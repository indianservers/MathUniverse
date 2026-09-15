import { useEffect, useState } from "react";

export type LinearSession = {
  lastRoute: string;
  lastMode: string | null;
  lastLabel: string;
  completed: string[];
  xp: number;
  theme: "light" | "dark";
  darkCanvas: boolean;
  boardMode: boolean;
  teacherMode: boolean;
  hintDismissed: boolean;
  levelFilter: string;
};

const KEY = "math-universe-linear-algebra-studio";
const EVENT = "math-universe-linear-session";

const fallback: LinearSession = {
  lastRoute: "/linear-algebra/vectors",
  lastMode: null,
  lastLabel: "Vectors",
  completed: [],
  xp: 0,
  theme: "light",
  darkCanvas: false,
  boardMode: false,
  teacherMode: false,
  hintDismissed: false,
  levelFilter: "All",
};

export const LINEAR_SEARCH_ALIASES: Record<string, { id: string; mode?: string }> = {
  "a×b": { id: "matrices", mode: "Multiply" },
  axb: { id: "matrices", mode: "Multiply" },
  "a*b": { id: "matrices", mode: "Multiply" },
  multiply: { id: "matrices", mode: "Multiply" },
  λ: { id: "eigenvectors" },
  lambda: { id: "eigenvectors" },
  eigenvalue: { id: "eigenvectors" },
  eigenvector: { id: "eigenvectors" },
  rref: { id: "row-reduction" },
  pivot: { id: "row-reduction" },
  proj: { id: "vectors", mode: "Projections" },
  projection: { id: "vectors", mode: "Projections" },
  det: { id: "determinants" },
  determinant: { id: "determinants" },
  gram: { id: "orthogonality" },
  "least squares": { id: "least-squares" },
  rmse: { id: "least-squares" },
};

export function readLinearSession(): LinearSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...fallback, completed: [] };
    const parsed = JSON.parse(raw) as Partial<LinearSession>;
    return {
      ...fallback,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === "string") : [],
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      theme: parsed.theme === "dark" ? "dark" : "light",
      darkCanvas: Boolean(parsed.darkCanvas),
      boardMode: Boolean(parsed.boardMode),
      teacherMode: Boolean(parsed.teacherMode),
      hintDismissed: Boolean(parsed.hintDismissed),
      levelFilter: typeof parsed.levelFilter === "string" ? parsed.levelFilter : "All",
    };
  } catch {
    return { ...fallback, completed: [] };
  }
}

export function writeLinearSession(patch: Partial<LinearSession>) {
  const next = { ...readLinearSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function onLinearSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function markLinearVisit(id: string, route: string, label: string, mode: string | null) {
  writeLinearSession({
    lastRoute: route,
    lastMode: mode,
    lastLabel: label,
  });
}

export function markLinearComplete(id: string) {
  const current = readLinearSession();
  if (current.completed.includes(id)) return current;
  return writeLinearSession({ completed: [...current.completed, id] });
}

export function awardLinearXp(points: number) {
  writeLinearSession({ xp: readLinearSession().xp + points });
}

export function continueLinearHref(session: LinearSession) {
  if (!session.lastMode) return session.lastRoute;
  const joiner = session.lastRoute.includes("?") ? "?" : "?";
  const base = session.lastRoute.split("?")[0] ?? session.lastRoute;
  return `${base}?mode=${encodeURIComponent(session.lastMode)}`;
}

export function useLinearSession() {
  const [session, setSession] = useState(readLinearSession);
  useEffect(() => onLinearSession(() => setSession(readLinearSession())), []);
  return session;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
