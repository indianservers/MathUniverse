import { useEffect, useState } from "react";

export type ComplexSession = {
  lastRoute: string;
  lastMode: string | null;
  lastLabel: string;
  completed: string[];
  teacherMode: boolean;
  theme: "light" | "dark";
  xp: number;
};

const KEY = "math-universe-complex-numbers-studio";
const EVENT = "math-universe-complex-session";

const fallback: ComplexSession = {
  lastRoute: "/complex-numbers/argand-plane",
  lastMode: null,
  lastLabel: "Argand Plane",
  completed: [],
  teacherMode: false,
  theme: "light",
  xp: 0,
};

export const COMPLEX_SEARCH_ALIASES: Record<string, { id: string; mode?: string }> = {
  "|z|": { id: "argand-plane", mode: "Modulus" },
  modulus: { id: "argand-plane", mode: "Modulus" },
  argument: { id: "argand-plane", mode: "Argument" },
  conjugate: { id: "argand-plane", mode: "Conjugate" },
  argand: { id: "argand-plane" },
  cis: { id: "polar-forms", mode: "Polar" },
  polar: { id: "polar-forms" },
  "e^{iθ}": { id: "euler" },
  euler: { id: "euler" },
  "e^{ipi}": { id: "euler" },
  roots: { id: "roots" },
  "nth roots": { id: "roots", mode: "nth Roots" },
  julia: { id: "fractals", mode: "Julia Set" },
  mandelbrot: { id: "fractals", mode: "Mandelbrot Set" },
  phasor: { id: "waves-circuits", mode: "Phasors" },
  impedance: { id: "waves-circuits", mode: "Impedance" },
  mobius: { id: "loci", mode: "Möbius" },
};

export function readComplexSession(): ComplexSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...fallback, completed: [] };
    const parsed = JSON.parse(raw) as Partial<ComplexSession>;
    return {
      ...fallback,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === "string") : [],
      teacherMode: Boolean(parsed.teacherMode),
      theme: parsed.theme === "dark" ? "dark" : "light",
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
    };
  } catch {
    return { ...fallback, completed: [] };
  }
}

export function writeComplexSession(patch: Partial<ComplexSession>) {
  const next = { ...readComplexSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function onComplexSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function markComplexVisit(id: string, route: string, label: string, mode: string | null) {
  writeComplexSession({ lastRoute: route, lastMode: mode, lastLabel: label });
}

export function markComplexComplete(id: string) {
  const current = readComplexSession();
  if (current.completed.includes(id)) return current;
  return writeComplexSession({ completed: [...current.completed, id] });
}

export function continueComplexHref(session: ComplexSession) {
  const base = session.lastRoute.split("?")[0] ?? session.lastRoute;
  if (!session.lastMode) return base;
  return `${base}?mode=${encodeURIComponent(session.lastMode)}`;
}

export function useComplexSession() {
  const [session, setSession] = useState(readComplexSession);
  useEffect(() => onComplexSession(() => setSession(readComplexSession())), []);
  return session;
}

export function complexProgressPercent(labCount: number, completed: string[]) {
  if (!labCount) return 0;
  return Math.round((completed.length / labCount) * 100);
}
