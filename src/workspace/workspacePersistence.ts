import type { MathObject, WorkspaceHistoryEntry, WorkspaceProjectMeta } from "./types";

export const WORKSPACE_SCHEMA_VERSION = 1;
export const WORKSPACE_STORAGE_KEY = "math-universe-unified-workspace";

export type WorkspacePersistedState = {
  project: WorkspaceProjectMeta;
  objects: MathObject[];
  selectedObjectId: string | null;
  history: WorkspaceHistoryEntry[];
};

export function createDefaultProject(): WorkspaceProjectMeta {
  return {
    id: "local-workspace",
    title: "Math Universe Workspace",
    description: "Unified graphing, CAS, geometry, and 3D workspace foundation.",
    updatedAt: Date.now(),
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
  };
}

