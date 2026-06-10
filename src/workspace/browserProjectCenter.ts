export const LIVE_WORKSPACE_STORAGE_KEY = "math-universe-workspace-full";
export const PROJECT_RECOVERY_STORAGE_KEY = "math-universe-project-recovery-slots";
export const MAX_PROJECT_RECOVERY_SLOTS = 8;

export type WorkspaceSummary = {
  plots: number;
  results: number;
  geometryObjects: number;
  spaceObjects: number;
  lessonSteps: number;
  practiceResponses: number;
  animationSnapshots: number;
};

export type ProjectRecoverySlot<TWorkspace = unknown> = {
  id: string;
  label: string;
  reason: "autosave" | "manual" | "import" | "template";
  timestamp: number;
  summary: WorkspaceSummary;
  workspace: TWorkspace;
};

export type WorkspaceImportValidation =
  | { kind: "bundle"; valid: true; label: string; warnings: string[] }
  | { kind: "lesson-package"; valid: true; label: string; warnings: string[] }
  | { kind: "workspace"; valid: true; label: string; warnings: string[] }
  | { kind: "unknown"; valid: false; label: string; warnings: string[] };

export function summarizeWorkspaceSnapshot(workspace: unknown): WorkspaceSummary {
  const value = isRecord(workspace) ? workspace : {};
  const construction = isRecord(value.construction) ? value.construction : {};
  const geometryObjects = ["points", "lines", "circles", "polygons", "angles", "arcs", "texts", "conics", "constraints", "transforms"]
    .reduce((total, key) => total + arrayLength(construction[key]), 0);

  return {
    plots: arrayLength(value.plots),
    results: arrayLength(value.results),
    geometryObjects,
    spaceObjects: 7 + arrayLength(value.space3dShapes),
    lessonSteps: isRecord(value.lesson) ? arrayLength(value.lesson.steps) : 0,
    practiceResponses: isRecord(value.practiceResponses) ? Object.keys(value.practiceResponses).length : 0,
    animationSnapshots: arrayLength(value.animationSnapshots),
  };
}

export function validateWorkspaceImport(value: unknown): WorkspaceImportValidation {
  if (!isRecord(value)) return { kind: "unknown", valid: false, label: "Invalid JSON file", warnings: ["The file does not contain a JSON object."] };

  if (value.schema === "math-universe.workspace-bundle" && isRecord(value.workspace)) {
    return { kind: "bundle", valid: true, label: "Project bundle", warnings: importWarnings(value.workspace, Boolean(value.lesson)) };
  }

  if (isRecord(value.workspace) && isRecord(value.lesson)) {
    return { kind: "lesson-package", valid: true, label: "Lesson package", warnings: importWarnings(value.workspace, true) };
  }

  const hasWorkspaceShape = ["plots", "results", "construction", "surface", "solid", "lesson"].some((key) => key in value);
  if (hasWorkspaceShape) {
    return { kind: "workspace", valid: true, label: "Workspace JSON", warnings: importWarnings(value, Boolean(value.lesson)) };
  }

  return { kind: "unknown", valid: false, label: "Unsupported JSON file", warnings: ["Expected a workspace JSON, lesson package, or Math Universe project bundle."] };
}

export function readProjectRecoverySlots<TWorkspace = unknown>(): ProjectRecoverySlot<TWorkspace>[] {
  if (!hasLocalStorage()) return [];
  try {
    const raw = localStorage.getItem(PROJECT_RECOVERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isProjectRecoverySlot) as ProjectRecoverySlot<TWorkspace>[];
  } catch {
    return [];
  }
}

export function saveProjectRecoverySlot<TWorkspace>(
  workspace: TWorkspace,
  reason: ProjectRecoverySlot["reason"],
  label: string,
  replaceReason?: ProjectRecoverySlot["reason"]
) {
  const slot: ProjectRecoverySlot<TWorkspace> = {
    id: `${reason}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    reason,
    timestamp: Date.now(),
    summary: summarizeWorkspaceSnapshot(workspace),
    workspace,
  };
  const existing = readProjectRecoverySlots<TWorkspace>().filter((item) => item.reason !== replaceReason);
  writeProjectRecoverySlots([slot, ...existing].slice(0, MAX_PROJECT_RECOVERY_SLOTS));
  return slot;
}

export function removeProjectRecoverySlot(slotId: string) {
  const slots = readProjectRecoverySlots().filter((slot) => slot.id !== slotId);
  writeProjectRecoverySlots(slots);
  return slots;
}

export function clearManualProjectRecoverySlots() {
  const slots = readProjectRecoverySlots().filter((slot) => slot.reason === "autosave");
  writeProjectRecoverySlots(slots);
  return slots;
}

function writeProjectRecoverySlots<TWorkspace>(slots: ProjectRecoverySlot<TWorkspace>[]) {
  if (!hasLocalStorage()) return;
  localStorage.setItem(PROJECT_RECOVERY_STORAGE_KEY, JSON.stringify(slots));
}

function importWarnings(workspace: unknown, hasLesson: boolean) {
  const summary = summarizeWorkspaceSnapshot(workspace);
  const warnings: string[] = [];
  if (summary.plots === 0 && summary.geometryObjects === 0 && summary.spaceObjects <= 7) warnings.push("No authored graph, geometry, or custom 3D objects were found.");
  if (!hasLesson) warnings.push("No lesson plan is attached; classroom steps will use the current/default lesson.");
  if (summary.results === 0) warnings.push("No CAS result cards are saved in this file.");
  return warnings;
}

function isProjectRecoverySlot(value: unknown): value is ProjectRecoverySlot {
  return isRecord(value) && typeof value.id === "string" && typeof value.timestamp === "number" && isRecord(value.summary) && "workspace" in value;
}

function arrayLength(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function hasLocalStorage() {
  return typeof localStorage !== "undefined";
}
