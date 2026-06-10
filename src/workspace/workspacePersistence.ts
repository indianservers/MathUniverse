import { normalizeMathObject } from "./coreObjects";
import { createDefaultScenes, syncScenesWithObjects } from "./sceneGraph";
import type { MathObject, MathScene, WorkspaceHistoryEntry, WorkspaceProjectMeta, WorkspaceSnapshot } from "./types";

export const WORKSPACE_SCHEMA_VERSION = 2;
export const WORKSPACE_STORAGE_KEY = "math-universe-unified-workspace";
export const WORKSPACE_EXPORT_SCHEMA = "math-universe.workspace-project";

export type WorkspacePersistedState = {
  project: WorkspaceProjectMeta;
  objects: MathObject[];
  scenes: MathScene[];
  selectedObjectId: string | null;
  selectedObjectIds: string[];
  history: WorkspaceHistoryEntry[];
};

export type WorkspaceProjectExport = {
  schema: typeof WORKSPACE_EXPORT_SCHEMA;
  schemaVersion: typeof WORKSPACE_SCHEMA_VERSION;
  exportedAt: string;
  snapshot: WorkspaceSnapshot;
};

export function createDefaultProject(): WorkspaceProjectMeta {
  return {
    id: "local-workspace",
    title: "Math Universe Workspace",
    description: "Browser-only 2D/3D math object model, scene graph, history, and persistence foundation.",
    updatedAt: Date.now(),
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
  };
}

export function createDefaultWorkspaceState(): WorkspacePersistedState {
  const objects: MathObject[] = [];
  return {
    project: createDefaultProject(),
    objects,
    scenes: createDefaultScenes(objects),
    selectedObjectId: null,
    selectedObjectIds: [],
    history: [],
  };
}

export function normalizeWorkspaceSnapshot(input: Partial<WorkspacePersistedState> | undefined): WorkspacePersistedState {
  const fallback = createDefaultWorkspaceState();
  const objects = Array.isArray(input?.objects) ? input.objects.map(normalizeMathObject) : fallback.objects;
  const scenes = syncScenesWithObjects(Array.isArray(input?.scenes) ? input.scenes : fallback.scenes, objects);
  const selectedObjectId = input?.selectedObjectId && objects.some((object) => object.id === input.selectedObjectId) ? input.selectedObjectId : null;
  const objectIds = new Set(objects.map((object) => object.id));
  const selectedObjectIds = Array.isArray(input?.selectedObjectIds) ? input.selectedObjectIds.filter((id) => objectIds.has(id)) : selectedObjectId ? [selectedObjectId] : [];

  return {
    project: {
      ...fallback.project,
      ...input?.project,
      schemaVersion: WORKSPACE_SCHEMA_VERSION,
      updatedAt: input?.project?.updatedAt ?? Date.now(),
    },
    objects,
    scenes,
    selectedObjectId,
    selectedObjectIds,
    history: Array.isArray(input?.history) ? input.history.slice(0, 80) : [],
  };
}

export function createWorkspaceSnapshot(state: WorkspacePersistedState): WorkspaceSnapshot {
  return {
    project: state.project,
    objects: state.objects.map(normalizeMathObject),
    scenes: syncScenesWithObjects(state.scenes, state.objects),
    selectedObjectId: state.selectedObjectId,
    selectedObjectIds: state.selectedObjectIds,
  };
}

export function exportWorkspaceProject(state: WorkspacePersistedState): WorkspaceProjectExport {
  return {
    schema: WORKSPACE_EXPORT_SCHEMA,
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    snapshot: createWorkspaceSnapshot(normalizeWorkspaceSnapshot(state)),
  };
}

export function parseWorkspaceProjectExport(json: string): WorkspacePersistedState {
  const parsed = JSON.parse(json) as unknown;
  if (!isObject(parsed) || parsed.schema !== WORKSPACE_EXPORT_SCHEMA || !isObject(parsed.snapshot)) {
    throw new Error("This file is not a Math Universe workspace project.");
  }
  return normalizeWorkspaceSnapshot(parsed.snapshot as Partial<WorkspacePersistedState>);
}

export function migrateWorkspaceState(value: unknown): WorkspacePersistedState {
  if (!isObject(value)) return createDefaultWorkspaceState();

  const state = "state" in value && isObject(value.state) ? value.state : value;
  return normalizeWorkspaceSnapshot(state as Partial<WorkspacePersistedState>);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}
