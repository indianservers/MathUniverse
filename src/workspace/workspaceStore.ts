import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MathObject, WorkspaceHistoryEntry, WorkspaceProjectMeta } from "./types";
import { createHistoryEntry, limitHistory } from "./workspaceHistory";
import { createDefaultProject, WORKSPACE_STORAGE_KEY } from "./workspacePersistence";

type WorkspaceState = {
  project: WorkspaceProjectMeta;
  objects: MathObject[];
  selectedObjectId: string | null;
  history: WorkspaceHistoryEntry[];
  upsertObject: (object: MathObject, historyLabel?: string) => void;
  upsertObjects: (objects: MathObject[], historyLabel?: string) => void;
  removeObject: (objectId: string) => void;
  selectObject: (objectId: string | null) => void;
  toggleObjectVisibility: (objectId: string) => void;
  clearObjects: () => void;
  recordCommand: (label: string) => void;
  updateProject: (project: Partial<WorkspaceProjectMeta>) => void;
};

function mergeObjects(current: MathObject[], incoming: MathObject[], replaceLiveWorkspace = false) {
  const incomingIds = new Set(incoming.map((object) => object.id));
  const preserved = current.filter((object) => !incomingIds.has(object.id) && (!replaceLiveWorkspace || object.metadata?.source !== "live-workspace"));
  return [...incoming, ...preserved].sort((first, second) => second.updatedAt - first.updatedAt);
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      project: createDefaultProject(),
      objects: [],
      selectedObjectId: null,
      history: [],
      upsertObject: (object, historyLabel) =>
        set((state) => ({
          objects: mergeObjects(state.objects, [object]),
          project: { ...state.project, updatedAt: Date.now() },
          history: historyLabel ? limitHistory([createHistoryEntry("update", historyLabel, object.id), ...state.history]) : state.history,
        })),
      upsertObjects: (objects, historyLabel) =>
        set((state) => ({
          objects: mergeObjects(state.objects, objects, objects.some((object) => object.metadata?.source === "live-workspace")),
          selectedObjectId: state.selectedObjectId && objects.some((object) => object.id === state.selectedObjectId) ? state.selectedObjectId : state.selectedObjectId,
          project: { ...state.project, updatedAt: Date.now() },
          history: historyLabel ? limitHistory([createHistoryEntry("snapshot", historyLabel), ...state.history]) : state.history,
        })),
      removeObject: (objectId) =>
        set((state) => ({
          objects: state.objects.filter((object) => object.id !== objectId),
          selectedObjectId: state.selectedObjectId === objectId ? null : state.selectedObjectId,
          project: { ...state.project, updatedAt: Date.now() },
          history: limitHistory([createHistoryEntry("delete", "Removed workspace object", objectId), ...state.history]),
        })),
      selectObject: (objectId) =>
        set((state) => ({
          selectedObjectId: objectId,
          history: objectId ? limitHistory([createHistoryEntry("select", "Selected workspace object", objectId), ...state.history]) : state.history,
        })),
      toggleObjectVisibility: (objectId) =>
        set((state) => ({
          objects: state.objects.map((object) =>
            object.id === objectId ? { ...object, visible: !object.visible, status: object.visible ? "hidden" : "ready", updatedAt: Date.now() } : object
          ),
          project: { ...state.project, updatedAt: Date.now() },
          history: limitHistory([createHistoryEntry("visibility", "Toggled object visibility", objectId), ...state.history]),
        })),
      clearObjects: () =>
        set((state) => ({
          objects: [],
          selectedObjectId: null,
          project: { ...state.project, updatedAt: Date.now() },
          history: limitHistory([createHistoryEntry("delete", "Cleared workspace objects"), ...state.history]),
        })),
      recordCommand: (label) =>
        set((state) => ({
          project: { ...state.project, updatedAt: Date.now() },
          history: limitHistory([createHistoryEntry("command", label), ...state.history]),
        })),
      updateProject: (project) =>
        set((state) => ({
          project: { ...state.project, ...project, updatedAt: Date.now() },
          history: limitHistory([createHistoryEntry("update", "Updated workspace project"), ...state.history]),
        })),
    }),
    {
      name: WORKSPACE_STORAGE_KEY,
      partialize: (state) => ({
        project: state.project,
        objects: state.objects,
        selectedObjectId: state.selectedObjectId,
        history: state.history,
      }),
    }
  )
);
