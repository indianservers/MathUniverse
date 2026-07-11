import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { normalizeMathObject, withObjectPatch } from "./coreObjects";
import { syncScenesWithObjects } from "./sceneGraph";
import { buildRuntimeWorkspaceObjects } from "./workspaceRuntimeModel";
import type { MathObject, MathScene, WorkspaceHistoryEntry, WorkspaceProjectMeta, WorkspaceSnapshot } from "./types";
import { createHistoryEntry, createUndoableHistoryEntry, invertHistoryEntry, limitHistory } from "./workspaceHistory";
import { createDefaultWorkspaceState, exportWorkspaceProject, migrateWorkspaceState, normalizeWorkspaceSnapshot, parseWorkspaceProjectExport, WORKSPACE_SCHEMA_VERSION, WORKSPACE_STORAGE_KEY } from "./workspacePersistence";

type WorkspaceState = {
  project: WorkspaceProjectMeta;
  objects: MathObject[];
  scenes: MathScene[];
  selectedObjectId: string | null;
  selectedObjectIds: string[];
  history: WorkspaceHistoryEntry[];
  redoHistory: WorkspaceHistoryEntry[];
  upsertObject: (object: MathObject, historyLabel?: string) => void;
  upsertObjects: (objects: MathObject[], historyLabel?: string) => void;
  replaceObjectScope: (scope: string, objects: MathObject[], historyLabel?: string) => void;
  updateObject: (objectId: string, patch: Partial<MathObject>, historyLabel?: string) => void;
  removeObject: (objectId: string) => void;
  selectObject: (objectId: string | null) => void;
  selectObjects: (objectIds: string[], append?: boolean) => void;
  toggleObjectVisibility: (objectId: string) => void;
  updateScene: (sceneId: string, patch: Partial<MathScene>, historyLabel?: string) => void;
  clearObjects: () => void;
  undo: () => void;
  redo: () => void;
  restoreSnapshot: (snapshot: WorkspaceSnapshot, historyLabel?: string) => void;
  exportProjectJson: () => string;
  importProjectJson: (json: string) => void;
  recordCommand: (label: string) => void;
  updateProject: (project: Partial<WorkspaceProjectMeta>) => void;
};

function mergeObjects(current: MathObject[], incoming: MathObject[], replaceLiveWorkspace = false) {
  const normalizedIncoming = incoming.map(normalizeMathObject).map((object) => {
    if (object.metadata?.source !== "live-workspace") return object;
    const previous = current.find((item) => item.id === object.id);
    if (!previous || !hasCustomObjectProperties(previous)) return object;
    return {
      ...object,
      properties: previous.properties,
      metadata: {
        ...object.metadata,
        evaluatedLabel: previous.metadata?.evaluatedLabel ?? object.metadata?.evaluatedLabel,
        caption: previous.metadata?.caption ?? previous.properties?.caption ?? object.metadata?.caption,
        layer: previous.metadata?.layer ?? previous.properties?.layer ?? object.metadata?.layer,
      },
    };
  });
  const incomingIds = new Set(normalizedIncoming.map((object) => object.id));
  const preserved = current.filter((object) => !incomingIds.has(object.id) && (!replaceLiveWorkspace || object.metadata?.source !== "live-workspace"));
  return buildRuntimeWorkspaceObjects([...normalizedIncoming, ...preserved.map(normalizeMathObject)]);
}

function hasCustomObjectProperties(object: MathObject) {
  const properties = object.properties;
  if (!properties) return false;
  return properties.label !== object.label
    || Boolean(properties.caption?.trim())
    || (properties.layer ?? 0) !== 0
    || (properties.labelMode ?? "name") !== "name"
    || Boolean(properties.conditionalVisibility?.trim())
    || Boolean(properties.dynamicColor)
    || Boolean(properties.dynamicStyle?.opacity?.trim())
    || Boolean(properties.dynamicStyle?.strokeWidth?.trim());
}

function snapshotFromState(state: Pick<WorkspaceState, "project" | "objects" | "scenes" | "selectedObjectId" | "selectedObjectIds">): WorkspaceSnapshot {
  return {
    project: state.project,
    objects: state.objects.map(normalizeMathObject),
    scenes: syncScenesWithObjects(state.scenes, state.objects),
    selectedObjectId: state.selectedObjectId,
    selectedObjectIds: state.selectedObjectIds,
  };
}

function applySnapshot(snapshot: WorkspaceSnapshot) {
  const normalized = normalizeWorkspaceSnapshot({ ...snapshot, history: [] });
  const evaluatedObjects = buildRuntimeWorkspaceObjects(normalized.objects);
  return {
    project: normalized.project,
    objects: evaluatedObjects,
    scenes: syncScenesWithObjects(normalized.scenes, evaluatedObjects),
    selectedObjectId: normalized.selectedObjectId,
    selectedObjectIds: normalized.selectedObjectIds,
  };
}

function withUndoEntry(state: WorkspaceState, before: WorkspaceSnapshot, after: WorkspaceSnapshot, action: WorkspaceHistoryEntry["action"], label: string, objectIds?: string[]) {
  return {
    history: limitHistory([createUndoableHistoryEntry({ action, label, objectIds, before, after }), ...state.history]),
    redoHistory: [],
  };
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ...createDefaultWorkspaceState(),
      selectedObjectId: null,
      selectedObjectIds: [],
      history: [],
      redoHistory: [],
      upsertObject: (object, historyLabel) =>
        set((state) => {
          const before = snapshotFromState(state);
          const objects = mergeObjects(state.objects, [object]);
          const nextState = {
            objects,
            scenes: syncScenesWithObjects(state.scenes, objects),
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...(historyLabel ? withUndoEntry(state, before, after, "update", historyLabel, [object.id]) : {}),
          };
        }),
      upsertObjects: (objects, historyLabel) =>
        set((state) => {
          const before = snapshotFromState(state);
          const mergedObjects = mergeObjects(state.objects, objects, objects.some((object) => object.metadata?.source === "live-workspace"));
          const nextState = {
            objects: mergedObjects,
            scenes: syncScenesWithObjects(state.scenes, mergedObjects),
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...(historyLabel ? withUndoEntry(state, before, after, "snapshot", historyLabel, objects.map((object) => object.id)) : {}),
          };
        }),
      replaceObjectScope: (scope, objects, historyLabel) =>
        set((state) => {
          const cleanScope = scope.trim();
          if (!cleanScope) return state;
          const before = snapshotFromState(state);
          const scopedObjects = objects
            .map(normalizeMathObject)
            .map((object) => ({
              ...object,
              metadata: {
                ...object.metadata,
                universalScope: cleanScope,
              },
            }));
          const retainedObjects = state.objects.filter((object) => object.metadata?.universalScope !== cleanScope);
          const mergedObjects = buildRuntimeWorkspaceObjects([...scopedObjects, ...retainedObjects.map(normalizeMathObject)]);
          const nextState = {
            objects: mergedObjects,
            scenes: syncScenesWithObjects(state.scenes, mergedObjects),
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...(historyLabel ? withUndoEntry(state, before, after, "snapshot", historyLabel, scopedObjects.map((object) => object.id)) : {}),
          };
        }),
      updateObject: (objectId, patch, historyLabel) =>
        set((state) => {
          const before = snapshotFromState(state);
          const objects = buildRuntimeWorkspaceObjects(state.objects.map((object) => (object.id === objectId ? withObjectPatch(object, patch) : object)));
          const nextState = {
            objects,
            scenes: syncScenesWithObjects(state.scenes, objects),
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...(historyLabel ? withUndoEntry(state, before, after, "update", historyLabel, [objectId]) : {}),
          };
        }),
      removeObject: (objectId) =>
        set((state) => {
          const before = snapshotFromState(state);
          const objects = buildRuntimeWorkspaceObjects(state.objects.filter((object) => object.id !== objectId));
          const selectedObjectIds = state.selectedObjectIds.filter((id) => id !== objectId);
          const nextState = {
            objects,
            scenes: syncScenesWithObjects(state.scenes, objects),
            selectedObjectId: state.selectedObjectId === objectId ? null : state.selectedObjectId,
            selectedObjectIds,
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...withUndoEntry(state, before, after, "delete", "Removed workspace object", [objectId]),
          };
        }),
      selectObject: (objectId) =>
        set((state) => ({
          selectedObjectId: objectId,
          selectedObjectIds: objectId ? [objectId] : [],
          scenes: state.scenes.map((scene) => ({ ...scene, selectedIds: objectId && scene.nodes.some((node) => node.objectId === objectId) ? [objectId] : [] })),
          history: objectId ? limitHistory([createHistoryEntry("select", "Selected workspace object", objectId), ...state.history]) : state.history,
        })),
      selectObjects: (objectIds, append = false) =>
        set((state) => {
          const availableIds = new Set(state.objects.map((object) => object.id));
          const incoming = objectIds.filter((id) => availableIds.has(id));
          const selectedObjectIds = append ? Array.from(new Set([...state.selectedObjectIds, ...incoming])) : incoming;
          const selectedObjectId = selectedObjectIds[0] ?? null;
          return {
            selectedObjectId,
            selectedObjectIds,
            scenes: state.scenes.map((scene) => ({ ...scene, selectedIds: selectedObjectIds.filter((id) => scene.nodes.some((node) => node.objectId === id)) })),
            history: selectedObjectId ? limitHistory([createHistoryEntry("select", "Selected workspace objects", selectedObjectId), ...state.history]) : state.history,
          };
        }),
      toggleObjectVisibility: (objectId) =>
        set((state) => {
          const before = snapshotFromState(state);
          const objects = state.objects.map((object) =>
            object.id === objectId ? normalizeMathObject({ ...object, visible: !object.visible, status: object.visible ? "hidden" : "ready", updatedAt: Date.now() }) : object
          );
          const nextState = {
            objects,
            scenes: syncScenesWithObjects(state.scenes, objects),
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...withUndoEntry(state, before, after, "visibility", "Toggled object visibility", [objectId]),
          };
        }),
      updateScene: (sceneId, patch, historyLabel) =>
        set((state) => {
          const before = snapshotFromState(state);
          const scenes = syncScenesWithObjects(state.scenes.map((scene) => (scene.id === sceneId ? { ...scene, ...patch } : scene)), state.objects);
          const nextState = {
            scenes,
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...(historyLabel ? withUndoEntry(state, before, after, "scene", historyLabel) : {}),
          };
        }),
      clearObjects: () =>
        set((state) => {
          const before = snapshotFromState(state);
          const objects: MathObject[] = [];
          const nextState = {
            objects,
            scenes: syncScenesWithObjects(state.scenes, objects),
            selectedObjectId: null,
            selectedObjectIds: [],
            project: { ...state.project, updatedAt: Date.now() },
          };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...withUndoEntry(state, before, after, "delete", "Cleared workspace objects"),
          };
        }),
      undo: () =>
        set((state) => {
          const entry = state.history.find((item) => item.before && item.after);
          if (!entry?.before) return state;
          const redoEntry = invertHistoryEntry(entry, "Redo");
          return {
            ...applySnapshot(entry.before),
            history: state.history.filter((item) => item.id !== entry.id),
            redoHistory: redoEntry ? limitHistory([redoEntry, ...state.redoHistory]) : state.redoHistory,
          };
        }),
      redo: () =>
        set((state) => {
          const entry = state.redoHistory.find((item) => item.before && item.after);
          if (!entry?.before) return state;
          const undoEntry = invertHistoryEntry(entry, "Undo");
          return {
            ...applySnapshot(entry.before),
            history: undoEntry ? limitHistory([undoEntry, ...state.history]) : state.history,
            redoHistory: state.redoHistory.filter((item) => item.id !== entry.id),
          };
        }),
      restoreSnapshot: (snapshot, historyLabel) =>
        set((state) => {
          const before = snapshotFromState(state);
          const restored = applySnapshot(snapshot);
          const after = snapshotFromState({ ...state, ...restored });
          return {
            ...restored,
            ...(historyLabel ? withUndoEntry(state, before, after, "snapshot", historyLabel) : {}),
          };
        }),
      exportProjectJson: () => JSON.stringify(exportWorkspaceProject(get()), null, 2),
      importProjectJson: (json) =>
        set((state) => {
          const before = snapshotFromState(state);
          const imported = parseWorkspaceProjectExport(json);
          const restored = applySnapshot({ ...imported, selectedObjectIds: imported.selectedObjectIds });
          const after = snapshotFromState({ ...state, ...restored });
          return {
            ...restored,
            ...withUndoEntry(state, before, after, "snapshot", "Imported workspace project"),
          };
        }),
      recordCommand: (label) =>
        set((state) => ({
          project: { ...state.project, updatedAt: Date.now() },
          history: limitHistory([createHistoryEntry("command", label), ...state.history]),
        })),
      updateProject: (project) =>
        set((state) => {
          const before = snapshotFromState(state);
          const nextState = { project: { ...state.project, ...project, updatedAt: Date.now(), schemaVersion: WORKSPACE_SCHEMA_VERSION } };
          const after = snapshotFromState({ ...state, ...nextState });
          return {
            ...nextState,
            ...withUndoEntry(state, before, after, "project", "Updated workspace project"),
          };
        }),
    }),
    {
      name: WORKSPACE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: WORKSPACE_SCHEMA_VERSION,
      migrate: (persisted) => migrateWorkspaceState(persisted),
      partialize: (state) => ({
        project: state.project,
        objects: state.objects,
        scenes: state.scenes,
        selectedObjectId: state.selectedObjectId,
        selectedObjectIds: state.selectedObjectIds,
        history: state.history,
        redoHistory: state.redoHistory,
      }),
    }
  )
);
