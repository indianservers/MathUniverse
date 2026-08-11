import { GRAPH_STUDIO_SCHEMA_VERSION, type GraphStudioDimension, type GraphStudioProject, type GraphStudioProjectEnvelope } from "./types";

const STORAGE_KEY = "math-universe-graph-studio-projects-v1";
const ACTIVE_KEY = "math-universe-graph-studio-active-v1";
const MAX_PROJECTS = 40;

export function createGraphStudioProject<TState>(dimension: GraphStudioDimension, name: string, state: TState): GraphStudioProject<TState> {
  const now = new Date().toISOString();
  return {
    schemaVersion: GRAPH_STUDIO_SCHEMA_VERSION,
    id: `graph-${dimension}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    dimension,
    createdAt: now,
    updatedAt: now,
    favorite: false,
    stylePreset: "classroom",
    variables: [],
    notes: [],
    pinnedAnalysis: [],
    state,
  };
}

export function readGraphStudioProjects<TState>(dimension?: GraphStudioDimension): GraphStudioProject<TState>[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown[];
    const migrated = parsed.map(migrateGraphStudioProject).filter((item): item is GraphStudioProject<TState> => Boolean(item));
    return dimension ? migrated.filter((item) => item.dimension === dimension) : migrated;
  } catch {
    return [];
  }
}

export function saveGraphStudioProject<TState>(project: GraphStudioProject<TState>) {
  const nextProject = { ...project, schemaVersion: GRAPH_STUDIO_SCHEMA_VERSION, updatedAt: new Date().toISOString() };
  const current = readGraphStudioProjects<unknown>();
  const next = [nextProject, ...current.filter((item) => item.id !== project.id)]
    .sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX_PROJECTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  localStorage.setItem(`${ACTIVE_KEY}:${project.dimension}`, project.id);
  return nextProject;
}

export function deleteGraphStudioProject(id: string) {
  const next = readGraphStudioProjects<unknown>().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function duplicateGraphStudioProject<TState>(project: GraphStudioProject<TState>) {
  const copy = createGraphStudioProject(project.dimension, `${project.name} copy`, project.state);
  return saveGraphStudioProject({ ...copy, variables: project.variables, stylePreset: project.stylePreset, notes: project.notes, pinnedAnalysis: project.pinnedAnalysis });
}

export function exportGraphStudioProject<TState>(project: GraphStudioProject<TState>) {
  const envelope: GraphStudioProjectEnvelope<TState> = { kind: "math-universe-graph-project", exportedAt: new Date().toISOString(), project };
  return JSON.stringify(envelope, null, 2);
}

export function importGraphStudioProject<TState>(raw: string, expectedDimension: GraphStudioDimension) {
  const parsed = JSON.parse(raw) as Partial<GraphStudioProjectEnvelope<TState>>;
  if (parsed.kind !== "math-universe-graph-project" || !parsed.project) throw new Error("This file is not a Math Universe graph project.");
  const migrated = migrateGraphStudioProject<TState>(parsed.project);
  if (!migrated) throw new Error("The graph project is incomplete or uses an unsupported schema.");
  if (migrated.dimension !== expectedDimension) throw new Error(`Open this project in Graph Studio ${migrated.dimension.toUpperCase()}.`);
  return saveGraphStudioProject({ ...migrated, id: `${migrated.id}-import-${Date.now()}`, name: `${migrated.name} imported` });
}

export function downloadGraphStudioFile(filename: string, content: string, mime = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function migrateGraphStudioProject<TState>(value: unknown): GraphStudioProject<TState> | null {
  if (!value || typeof value !== "object") return null;
  const project = value as Partial<GraphStudioProject<TState>>;
  if (!project.id || !project.name || !project.dimension || project.state === undefined) return null;
  const now = new Date().toISOString();
  return {
    schemaVersion: GRAPH_STUDIO_SCHEMA_VERSION,
    id: project.id,
    name: project.name,
    dimension: project.dimension,
    createdAt: project.createdAt ?? now,
    updatedAt: project.updatedAt ?? now,
    favorite: project.favorite ?? false,
    stylePreset: project.stylePreset ?? "classroom",
    variables: Array.isArray(project.variables) ? project.variables : [],
    notes: Array.isArray(project.notes) ? project.notes : [],
    pinnedAnalysis: Array.isArray(project.pinnedAnalysis) ? project.pinnedAnalysis : [],
    state: project.state,
  };
}
