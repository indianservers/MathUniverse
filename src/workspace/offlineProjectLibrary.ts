const PROJECT_LIBRARY_KEY = "math-universe-offline-project-library";

export type OfflineProjectEntry<TSnapshot> = {
  id: string;
  title: string;
  unit?: string;
  folder?: string;
  tags?: string[];
  thumbnail?: string;
  version?: number;
  parentId?: string;
  savedAt: number;
  summary: string;
  snapshot: TSnapshot;
};

export function readOfflineProjectLibrary<TSnapshot>() {
  try {
    const raw = localStorage.getItem(PROJECT_LIBRARY_KEY);
    return raw ? JSON.parse(raw) as OfflineProjectEntry<TSnapshot>[] : [];
  } catch {
    return [];
  }
}

export function saveOfflineProject<TSnapshot>(entry: OfflineProjectEntry<TSnapshot>) {
  const library = readOfflineProjectLibrary<TSnapshot>();
  const existing = library.find((item) => item.id === entry.id);
  const enriched = {
    ...entry,
    folder: entry.folder ?? existing?.folder ?? "My projects",
    tags: entry.tags ?? existing?.tags ?? [],
    version: entry.version ?? (existing?.version ? existing.version + 1 : 1),
  };
  const next = [enriched, ...library.filter((item) => item.id !== entry.id)].slice(0, 48);
  localStorage.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(next));
  return next;
}

export function duplicateOfflineProject<TSnapshot>(id: string, title?: string) {
  const library = readOfflineProjectLibrary<TSnapshot>();
  const source = library.find((item) => item.id === id);
  if (!source) return library;
  const copy: OfflineProjectEntry<TSnapshot> = {
    ...source,
    id: `${source.id}-copy-${Date.now()}`,
    title: title?.trim() || `${source.title} copy`,
    parentId: source.id,
    version: 1,
    savedAt: Date.now(),
  };
  return saveOfflineProject(copy);
}

export function searchOfflineProjects<TSnapshot>(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const library = readOfflineProjectLibrary<TSnapshot>();
  if (!terms.length) return library;
  return library.filter((project) => {
    const text = [project.title, project.summary, project.unit ?? "", project.folder ?? "", ...(project.tags ?? [])].join(" ").toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}

export function exportOfflineProjectBundle<TSnapshot>() {
  return JSON.stringify({ exportedAt: new Date().toISOString(), projects: readOfflineProjectLibrary<TSnapshot>() }, null, 2);
}

export function importOfflineProjectBundle<TSnapshot>(bundle: string) {
  const parsed = JSON.parse(bundle) as { projects?: OfflineProjectEntry<TSnapshot>[] };
  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];
  const existing = readOfflineProjectLibrary<TSnapshot>();
  const merged = [...projects, ...existing.filter((item) => !projects.some((project) => project.id === item.id))].slice(0, 48);
  localStorage.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(merged));
  return merged;
}

export function removeOfflineProject<TSnapshot>(id: string) {
  const next = readOfflineProjectLibrary<TSnapshot>().filter((item) => item.id !== id);
  localStorage.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(next));
  return next;
}

export function clearOfflineProjectLibrary() {
  localStorage.removeItem(PROJECT_LIBRARY_KEY);
}
