export type StudioKind = "algebra" | "calculus" | "trigonometry" | "geometry" | "statistics" | "linear-algebra" | "discrete" | "complex" | "modelling";

export type StudioObject = {
  id: string;
  kind: "expression" | "dataset" | "point" | "matrix" | "model";
  name: string;
  value: unknown;
  sourceStudio: StudioKind;
  provenance?: string;
};

export type StudioProject = {
  schema: "math-universe.project/v1";
  id: string;
  title: string;
  studio: StudioKind;
  objects: StudioObject[];
  parameters: Record<string, number | string | boolean>;
  createdAt: string;
  updatedAt: string;
};

export function createStudioProject(title: string, studio: StudioKind, now = new Date()): StudioProject {
  const stamp = now.toISOString();
  return {
    schema: "math-universe.project/v1",
    id: `${studio}-${stamp.replace(/\D/g, "").slice(0, 14)}`,
    title: title.trim() || "Untitled project",
    studio,
    objects: [],
    parameters: {},
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function exportStudioProject(project: StudioProject) {
  return JSON.stringify(project, null, 2);
}

export function importStudioProject(source: string): StudioProject {
  const value = JSON.parse(source) as StudioProject;
  if (value.schema !== "math-universe.project/v1" || !value.title || !Array.isArray(value.objects)) {
    throw new Error("Unsupported or incomplete Math Universe project");
  }
  return value;
}

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  const encoded = btoa(binary);
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

export function createProjectDeepLink(origin: string, route: string, project: StudioProject) {
  const url = new URL(route, origin);
  url.searchParams.set("project", toBase64Url(exportStudioProject(project)));
  return url.toString();
}

export function readProjectDeepLink(url: string) {
  const encoded = new URL(url).searchParams.get("project");
  return encoded ? importStudioProject(fromBase64Url(encoded)) : null;
}

const acceptedObjects: Record<StudioKind, StudioObject["kind"][]> = {
  algebra: ["expression", "point", "dataset", "matrix"], calculus: ["expression", "point", "dataset"],
  trigonometry: ["expression", "point", "dataset"], geometry: ["point", "expression", "dataset"],
  statistics: ["dataset", "point", "model"], "linear-algebra": ["matrix", "dataset", "point"],
  discrete: ["dataset", "matrix", "model"], complex: ["expression", "point", "matrix"],
  modelling: ["model", "dataset", "expression", "matrix", "point"],
};

export function transferStudioObject(object: StudioObject, targetStudio: StudioKind): StudioObject {
  if (!acceptedObjects[targetStudio].includes(object.kind)) throw new Error(`${targetStudio} cannot import ${object.kind} objects`);
  return { ...object, id: `${targetStudio}:${object.id}`, sourceStudio: targetStudio, provenance: `${object.sourceStudio} → ${targetStudio}` };
}

export function differentiatePolynomial(coefficients: number[]) {
  const degree = coefficients.length - 1;
  return coefficients.slice(0, -1).map((coefficient, index) => coefficient * (degree - index));
}

export function evaluatePolynomial(coefficients: number[], x: number) {
  return coefficients.reduce((sum, coefficient) => sum * x + coefficient, 0);
}

export type Checkpoint<T> = { name: string; state: T; at: string };
export type ProjectHistory<T> = { past: Checkpoint<T>[]; present: Checkpoint<T>; future: Checkpoint<T>[] };

export function createHistory<T>(state: T, name = "Initial"): ProjectHistory<T> {
  return { past: [], present: { name, state, at: new Date(0).toISOString() }, future: [] };
}

export function checkpoint<T>(history: ProjectHistory<T>, state: T, name: string): ProjectHistory<T> {
  return { past: [...history.past, history.present], present: { name, state, at: new Date().toISOString() }, future: [] };
}

export function undoCheckpoint<T>(history: ProjectHistory<T>): ProjectHistory<T> {
  const previous = history.past.at(-1);
  return previous ? { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future] } : history;
}

export function redoCheckpoint<T>(history: ProjectHistory<T>): ProjectHistory<T> {
  const next = history.future[0];
  return next ? { past: [...history.past, history.present], present: next, future: history.future.slice(1) } : history;
}

export type AccessibleControl = { label?: string; keyboard: boolean; contrastRatio: number; reducedMotion: boolean };
export function auditAccessibleControls(controls: AccessibleControl[]) {
  const issues = controls.flatMap((control, index) => [
    ...(!control.label ? [`Control ${index + 1} needs a label`] : []),
    ...(!control.keyboard ? [`${control.label || `Control ${index + 1}`} needs keyboard support`] : []),
    ...(control.contrastRatio < 4.5 ? [`${control.label || `Control ${index + 1}`} contrast is below 4.5:1`] : []),
  ]);
  return { passed: issues.length === 0, issues, reducedMotionReady: controls.every((control) => control.reducedMotion) };
}

export function responsiveStudioLayout(width: number) {
  if (width < 640) return { columns: 1, density: "compact", sidebar: "drawer" } as const;
  if (width < 1100) return { columns: 2, density: "comfortable", sidebar: "collapsed" } as const;
  return { columns: 3, density: "spacious", sidebar: "expanded" } as const;
}

export type ResultMode = "exact" | "approximate" | "simulated" | "inferred";
export function labelledResult(value: unknown, mode: ResultMode, details: { tolerance?: number; samples?: number; confidence?: number } = {}) {
  return { value, mode, label: mode[0].toUpperCase() + mode.slice(1), ...details };
}

export type TeacherActivity = { title: string; prompt: string; expected: number; tolerance: number; hint: string };
export function assessTeacherActivity(activity: TeacherActivity, response: number, attempts: number) {
  const correct = Math.abs(response - activity.expected) <= activity.tolerance;
  return { correct, progress: correct ? 100 : Math.min(90, attempts * 25), feedback: correct ? "Correct — checkpoint complete" : attempts > 1 ? activity.hint : "Try again and compare the quantities." };
}

export function adaptivePerformancePolicy(pointCount: number, hardwareConcurrency = 4, workerAvailable = typeof Worker !== "undefined") {
  const expensive = pointCount > 50_000;
  return {
    execution: expensive && workerAvailable ? "worker" : "main-thread",
    quality: pointCount > 200_000 ? "preview" : pointCount > 50_000 ? "adaptive" : "full",
    chunkSize: Math.max(1_000, Math.round(10_000 * Math.max(1, hardwareConcurrency) / 4)),
  } as const;
}

export async function runAdaptiveComputation<T>(items: T[], compute: (item: T) => number, chunkSize = 2_000) {
  const results: number[] = [];
  for (let start = 0; start < items.length; start += chunkSize) {
    results.push(...items.slice(start, start + chunkSize).map(compute));
    if (start + chunkSize < items.length) await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  return results;
}
