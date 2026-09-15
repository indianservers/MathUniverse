import { useEffect, useState } from "react";

export type TrigUnits = "deg" | "rad";

export type TrigSession = {
  units: TrigUnits;
  theta: number;
  lastRoute: string;
  lastMode: string | null;
  lastLabel: string;
  completed: string[];
  xp: number;
  theme: "light" | "dark";
  teacherMode: boolean;
  hintDismissed: boolean;
  stripScroll: number;
};

const KEY = "math-universe-trig-studio";
const EVENT = "math-universe-trig-session";

export const TRIG_PATH = [
  { id: "angles", label: "Angles", to: "/trigonometry/unit-circle", glyph: "θ" },
  { id: "circle", label: "Unit Circle", to: "/trigonometry/unit-circle?mode=Unit+Circle", glyph: "○" },
  { id: "functions", label: "Functions", to: "/trigonometry/graphs", glyph: "∿" },
  { id: "waves", label: "Waves", to: "/trigonometry/waves", glyph: "≈" },
] as const;

export const TRIG_LAB_META: Record<string, { outcome: string; minutes: number; level: string }> = {
  "unit-circle": { outcome: "Read sin, cos, and tan from the circle.", minutes: 8, level: "Start here" },
  "right-triangle": { outcome: "Solve a right triangle with SOH-CAH-TOA.", minutes: 10, level: "Core" },
  graphs: { outcome: "See how A, B, C, and D reshape a wave.", minutes: 10, level: "Core" },
  identities: { outcome: "Watch Pythagorean and angle-sum identities hold.", minutes: 8, level: "Next" },
  inverse: { outcome: "Read principal values of arcsin, arccos, and arctan.", minutes: 8, level: "Next" },
  oblique: { outcome: "Apply the sine and cosine laws to any triangle.", minutes: 12, level: "Next" },
  waves: { outcome: "Build beats and harmonics from two sines.", minutes: 8, level: "Extend" },
  applications: { outcome: "Find a height from distance and elevation.", minutes: 8, level: "Apply" },
  ar: { outcome: "Overlay a similar triangle on a live scene.", minutes: 6, level: "Apply" },
};

const fallback: TrigSession = {
  units: "deg",
  theta: 135,
  lastRoute: "/trigonometry/unit-circle",
  lastMode: null,
  lastLabel: "Unit Circle",
  completed: [],
  xp: 0,
  theme: "light",
  teacherMode: false,
  hintDismissed: false,
  stripScroll: 0,
};

export function readTrigSession(): TrigSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...fallback, completed: [] };
    const parsed = JSON.parse(raw) as Partial<TrigSession>;
    return {
      ...fallback,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === "string") : [],
      theta: typeof parsed.theta === "number" ? parsed.theta : fallback.theta,
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      theme: parsed.theme === "dark" ? "dark" : "light",
      teacherMode: Boolean(parsed.teacherMode),
      hintDismissed: Boolean(parsed.hintDismissed),
      stripScroll: typeof parsed.stripScroll === "number" ? parsed.stripScroll : 0,
    };
  } catch {
    return { ...fallback, completed: [] };
  }
}

export function writeTrigSession(patch: Partial<TrigSession>) {
  const next = { ...readTrigSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function onTrigSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function markTrigVisit(id: string, route: string, label: string, mode: string | null) {
  writeTrigSession({
    lastRoute: route,
    lastMode: mode,
    lastLabel: label,
  });
}

export function markTrigComplete(id: string) {
  const current = readTrigSession();
  if (current.completed.includes(id)) return current;
  return writeTrigSession({ completed: [...current.completed, id] });
}

export function awardTrigXp(points: number) {
  writeTrigSession({ xp: readTrigSession().xp + points });
}

export function continueHref(session: TrigSession) {
  if (!session.lastMode) return session.lastRoute;
  const joiner = session.lastRoute.includes("?") ? "&" : "?";
  return `${session.lastRoute}${joiner}mode=${encodeURIComponent(session.lastMode)}`;
}

export function nextTrigLab(labs: Array<{ id: string; route: string; label: string }>, completed: string[]) {
  return labs.find((item) => !completed.includes(item.id)) ?? labs[labs.length - 1];
}

export function useTrigSession() {
  const [session, setSession] = useState(readTrigSession);
  useEffect(() => onTrigSession(() => setSession(readTrigSession())), []);
  return session;
}

export function dailyChallengeIndex(count: number) {
  if (count <= 0) return 0;
  const start = Date.UTC(2026, 0, 1);
  const days = Math.floor((Date.now() - start) / 86400000);
  return ((days % count) + count) % count;
}
