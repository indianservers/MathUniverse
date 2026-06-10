import type { WorkspaceHistoryAction, WorkspaceHistoryEntry, WorkspaceSnapshot } from "./types";

export function createHistoryEntry(action: WorkspaceHistoryAction, label: string, objectId?: string, before?: WorkspaceSnapshot, after?: WorkspaceSnapshot): WorkspaceHistoryEntry {
  return {
    id: crypto.randomUUID(),
    objectId,
    objectIds: objectId ? [objectId] : undefined,
    action,
    label,
    timestamp: Date.now(),
    before,
    after,
  };
}

export function limitHistory(history: WorkspaceHistoryEntry[], limit = 80) {
  return history.slice(0, limit);
}

export function createUndoableHistoryEntry(input: {
  action: WorkspaceHistoryAction;
  label: string;
  objectIds?: string[];
  before: WorkspaceSnapshot;
  after: WorkspaceSnapshot;
}): WorkspaceHistoryEntry {
  return {
    id: crypto.randomUUID(),
    action: input.action,
    label: input.label,
    objectId: input.objectIds?.[0],
    objectIds: input.objectIds,
    timestamp: Date.now(),
    before: input.before,
    after: input.after,
  };
}

export function invertHistoryEntry(entry: WorkspaceHistoryEntry, labelPrefix: "Undo" | "Redo"): WorkspaceHistoryEntry | null {
  if (!entry.before || !entry.after) return null;
  return {
    ...entry,
    id: crypto.randomUUID(),
    label: `${labelPrefix} ${entry.label.replace(/^(Undo|Redo)\s+/, "")}`,
    timestamp: Date.now(),
    before: entry.after,
    after: entry.before,
  };
}
