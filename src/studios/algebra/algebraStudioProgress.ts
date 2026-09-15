const PROGRESS_KEY = "algebra-studio:lab-progress";
const EXPERIMENTS_KEY = "algebra-studio:named-experiments";
const TEACHER_KEY = "algebra-studio:teacher-freeze";
const EXACT_KEY = "algebra-studio:exact-mode";

export const ALGEBRA_LAB_IDS = [
  "expressions",
  "equations",
  "functions",
  "polynomials",
  "systems",
  "exponents",
  "sequences",
  "structures",
  "proof",
  "cas",
  "advanced",
] as const;

export type AlgebraLabId = (typeof ALGEBRA_LAB_IDS)[number];

export type AlgebraLabProgress = {
  visited: string[];
  modes: Record<string, string[]>;
  challengesPassed: number;
  challengeAttempts: number;
  lastUndo: string;
};

export type NamedExperiment = { name: string; route: string; at: number };

const emptyProgress = (): AlgebraLabProgress => ({
  visited: [],
  modes: {},
  challengesPassed: 0,
  challengeAttempts: 0,
  lastUndo: "",
});

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null") as T | null;
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function readLabProgress(): AlgebraLabProgress {
  const raw = readJson<Partial<AlgebraLabProgress>>(PROGRESS_KEY, {});
  return {
    ...emptyProgress(),
    ...raw,
    visited: Array.isArray(raw.visited) ? raw.visited.filter((item): item is string => typeof item === "string") : [],
    modes: raw.modes && typeof raw.modes === "object" ? raw.modes : {},
    challengesPassed: Number(raw.challengesPassed) || 0,
    challengeAttempts: Number(raw.challengeAttempts) || 0,
    lastUndo: typeof raw.lastUndo === "string" ? raw.lastUndo : "",
  };
}

function writeProgress(next: AlgebraLabProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
}

export function recordLabVisit(id: string) {
  const current = readLabProgress();
  if (!current.visited.includes(id)) current.visited = [...current.visited, id];
  writeProgress(current);
  return current;
}

export function recordLabMode(id: string, mode: string) {
  const current = recordLabVisit(id);
  const used = new Set(current.modes[id] ?? []);
  used.add(mode);
  current.modes[id] = [...used];
  writeProgress(current);
  return current;
}

export function recordChallengeResult(passed: boolean) {
  const current = readLabProgress();
  current.challengeAttempts += 1;
  if (passed) current.challengesPassed += 1;
  writeProgress(current);
  return current;
}

export function recordUndoCaption(caption: string) {
  const current = readLabProgress();
  current.lastUndo = caption;
  writeProgress(current);
  return current;
}

export function uniqueModesUsed(progress = readLabProgress()) {
  return Object.values(progress.modes).reduce((sum, modes) => sum + new Set(modes).size, 0);
}

export function namedExperiments(): NamedExperiment[] {
  const value = readJson<NamedExperiment[]>(EXPERIMENTS_KEY, []);
  return Array.isArray(value) ? value.filter((item) => item && typeof item.route === "string") : [];
}

export function saveNamedExperiment(name: string, route: string) {
  const next = [{ name: name.trim() || "Untitled lab", route, at: Date.now() }, ...namedExperiments()].slice(0, 8);
  if (typeof window !== "undefined") localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(next));
  return next;
}

export function teacherFreezeEnabled() {
  return typeof window !== "undefined" && localStorage.getItem(TEACHER_KEY) === "1";
}

export function setTeacherFreeze(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEACHER_KEY, enabled ? "1" : "0");
  document.documentElement.classList.toggle("alg-teacher-freeze", enabled);
}

export function exactModeEnabled() {
  return typeof window === "undefined" || localStorage.getItem(EXACT_KEY) !== "0";
}

export function setExactMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXACT_KEY, enabled ? "1" : "0");
}

export function formatExactOrApprox(value: number, exact = exactModeEnabled()) {
  if (!Number.isFinite(value)) return "Undefined";
  if (exact && Number.isInteger(value)) return String(value);
  const snapped = Math.round(value * 1e6) / 1e6;
  return exact && Number.isInteger(snapped) ? String(snapped) : String(snapped);
}
