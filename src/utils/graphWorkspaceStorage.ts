export type SavedGraphWorkspace<T> = {
  id: string;
  name: string;
  savedAt: string;
  state: T;
};

export function readSavedGraphWorkspaces<T>(storageKey: string): SavedGraphWorkspace<T>[] {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is SavedGraphWorkspace<T> => (
      Boolean(item)
      && typeof item.id === "string"
      && typeof item.name === "string"
      && typeof item.savedAt === "string"
      && typeof item.state === "object"
    ));
  } catch {
    return [];
  }
}

export function saveGraphWorkspace<T>(storageKey: string, workspace: SavedGraphWorkspace<T>) {
  const current = readSavedGraphWorkspaces<T>(storageKey);
  const next = [workspace, ...current.filter((item) => item.id !== workspace.id)].slice(0, 24);
  localStorage.setItem(storageKey, JSON.stringify(next));
  return next;
}

export function deleteGraphWorkspace<T>(storageKey: string, id: string) {
  const next = readSavedGraphWorkspaces<T>(storageKey).filter((item) => item.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(next));
  return next;
}
