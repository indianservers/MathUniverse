import type { WorkspaceHistoryAction, WorkspaceHistoryEntry } from "./types";

export function createHistoryEntry(action: WorkspaceHistoryAction, label: string, objectId?: string): WorkspaceHistoryEntry {
  return {
    id: crypto.randomUUID(),
    objectId,
    action,
    label,
    timestamp: Date.now(),
  };
}

export function limitHistory(history: WorkspaceHistoryEntry[], limit = 80) {
  return history.slice(0, limit);
}

