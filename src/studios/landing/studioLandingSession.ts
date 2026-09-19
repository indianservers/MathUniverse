import { useEffect, useState } from "react";

export type GenericLandingSession = {
  lastId: string;
  lastRoute: string;
  lastLabel: string;
  lastOpenedAt: number;
  completed: string[];
  extras: Record<string, string | number | boolean>;
};

const EVENT = "math-universe-landing-session";

function keyFor(studioId: string) {
  return `math-universe-landing:${studioId}`;
}

const fallbacks: Record<string, GenericLandingSession> = {
  modelling: {
    lastId: "epidemics",
    lastRoute: "/mathematical-modelling/epidemics",
    lastLabel: "Epidemic Spread in Campus",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  },
  discrete: {
    lastId: "number-sense",
    lastRoute: "/discrete-world/number-sense",
    lastLabel: "Number Sense",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  },
  statistics: {
    lastId: "data-explorer",
    lastRoute: "/probability-statistics/data-explorer",
    lastLabel: "Data Explorer",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  },
  structures: {
    lastId: "structure-test",
    lastRoute: "/algebraic-structures/structure-test",
    lastLabel: "Structure Test",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  },
  "set-theory": {
    lastId: "set-builder",
    lastRoute: "/set-theory/set-builder",
    lastLabel: "Set Builder",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  },
  "graph-theory": {
    lastId: "workspace",
    lastRoute: "/graph-theory",
    lastLabel: "Graph Theory",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  },
};

function emptySession(studioId: string): GenericLandingSession {
  return fallbacks[studioId] ?? {
    lastId: "",
    lastRoute: "/",
    lastLabel: "Studio",
    lastOpenedAt: 0,
    completed: [],
    extras: {},
  };
}

export function readLandingSession(studioId: string): GenericLandingSession {
  const fallback = emptySession(studioId);
  if (typeof window === "undefined") return { ...fallback, completed: [], extras: {} };
  try {
    const raw = localStorage.getItem(keyFor(studioId));
    if (!raw) return { ...fallback, completed: [], extras: {} };
    const parsed = JSON.parse(raw) as Partial<GenericLandingSession>;
    return {
      ...fallback,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === "string") : [],
      extras: parsed.extras && typeof parsed.extras === "object" ? parsed.extras : {},
      lastOpenedAt: typeof parsed.lastOpenedAt === "number" ? parsed.lastOpenedAt : 0,
    };
  } catch {
    return { ...fallback, completed: [], extras: {} };
  }
}

export function writeLandingSession(studioId: string, patch: Partial<GenericLandingSession>) {
  const next = { ...readLandingSession(studioId), ...patch };
  try {
    localStorage.setItem(keyFor(studioId), JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  return next;
}

export function markLandingVisit(studioId: string, id: string, route: string, label: string) {
  const current = readLandingSession(studioId);
  const completed = current.completed.includes(id) ? current.completed : [...current.completed, id];
  return writeLandingSession(studioId, {
    lastId: id,
    lastRoute: route,
    lastLabel: label,
    lastOpenedAt: Date.now(),
    completed,
  });
}

export function landingProgressPercent(labCount: number, completed: string[]) {
  if (labCount <= 0) return 0;
  return Math.round((completed.length / labCount) * 100);
}

export function relativeOpened(ts: number) {
  if (!ts) return "Not started yet";
  const delta = Date.now() - ts;
  if (delta < 60_000) return "Last opened just now";
  if (delta < 3_600_000) return `Last opened ${Math.max(1, Math.floor(delta / 60_000))} min ago`;
  if (delta < 86_400_000) return `Last opened ${Math.floor(delta / 3_600_000)}h ago`;
  return `Last opened ${Math.floor(delta / 86_400_000)}d ago`;
}

export function firstHourReady(completed: string[], lastOpenedAt: number) {
  return completed.length > 0 || lastOpenedAt > 0;
}

export function dayIndex(count: number) {
  if (count <= 0) return 0;
  const start = Date.UTC(2026, 0, 1);
  const days = Math.floor((Date.now() - start) / 86400000);
  return ((days % count) + count) % count;
}

export function onLandingSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useLandingSession(studioId: string) {
  const [session, setSession] = useState(() => readLandingSession(studioId));
  useEffect(() => onLandingSession(() => setSession(readLandingSession(studioId))), [studioId]);
  return session;
}

const CLASS_PIN_KEY = "math-universe-geometry-class-pin";

export function readClassPin() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(CLASS_PIN_KEY) ?? "";
}

export function writeClassPin(pin: string) {
  if (typeof window === "undefined") return pin;
  sessionStorage.setItem(CLASS_PIN_KEY, pin);
  window.dispatchEvent(new Event(EVENT));
  return pin;
}

export function makeClassPin() {
  const pin = Math.random().toString(36).slice(2, 6).toUpperCase();
  return writeClassPin(pin);
}

export function honestProgressLabel(percent: number, started: boolean) {
  if (!started && percent === 0) return "0% · not started";
  return `${percent}%`;
}
