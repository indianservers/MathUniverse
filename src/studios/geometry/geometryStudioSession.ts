import { useEffect, useState } from "react";

export type GeoSession = {
  lastRoute: string;
  lastMode: string | null;
  lastLabel: string;
  lastOpenedAt: number;
  completed: string[];
  warmups: string[];
  theme: "light" | "dark";
  teacherMode: boolean;
  classPaused: boolean;
  hintDismissed: boolean;
  coachDismissed: boolean;
  largeLabels: boolean;
};

const KEY = "math-universe-geometry-studio";
const EVENT = "math-universe-geo-session";

const fallback: GeoSession = {
  lastRoute: "/geometry/triangles",
  lastMode: null,
  lastLabel: "Triangles Lab",
  lastOpenedAt: 0,
  completed: [],
  warmups: [],
  theme: "light",
  teacherMode: false,
  classPaused: false,
  hintDismissed: false,
  coachDismissed: false,
  largeLabels: false,
};

export function readGeoSession(): GeoSession {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...fallback, completed: [], warmups: [] };
    const parsed = JSON.parse(raw) as Partial<GeoSession>;
    return {
      ...fallback,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === "string") : [],
      warmups: Array.isArray(parsed.warmups) ? parsed.warmups.filter((item) => typeof item === "string") : [],
      theme: parsed.theme === "dark" ? "dark" : "light",
      teacherMode: Boolean(parsed.teacherMode),
      classPaused: Boolean(parsed.classPaused),
      hintDismissed: Boolean(parsed.hintDismissed),
      coachDismissed: Boolean(parsed.coachDismissed),
      largeLabels: Boolean(parsed.largeLabels),
      lastOpenedAt: typeof parsed.lastOpenedAt === "number" ? parsed.lastOpenedAt : 0,
    };
  } catch {
    return { ...fallback, completed: [], warmups: [] };
  }
}

export function writeGeoSession(patch: Partial<GeoSession>) {
  const next = { ...readGeoSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  return next;
}

export function onGeoSession(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function markGeoVisit(id: string, route: string, label: string, mode: string | null) {
  writeGeoSession({
    lastRoute: route,
    lastMode: mode,
    lastLabel: label,
    lastOpenedAt: Date.now(),
  });
}

export function markGeoComplete(id: string) {
  const current = readGeoSession();
  if (current.completed.includes(id)) return current;
  return writeGeoSession({ completed: [...current.completed, id] });
}

export function markGeoWarmup(id: string) {
  const current = readGeoSession();
  if (current.warmups.includes(id)) return current;
  return writeGeoSession({ warmups: [...current.warmups, id] });
}

export function continueGeoHref(session: GeoSession) {
  if (!session.lastMode) return session.lastRoute;
  const joiner = session.lastRoute.includes("?") ? "&" : "?";
  return `${session.lastRoute}${joiner}mode=${encodeURIComponent(session.lastMode)}`;
}

export function nextGeoLab(labs: Array<{ id: string; route: string; label: string }>, completed: string[]) {
  return labs.find((item) => !completed.includes(item.id)) ?? labs[labs.length - 1];
}

export function relativeOpened(ts: number) {
  if (!ts) return "Not started yet";
  const delta = Date.now() - ts;
  if (delta < 60_000) return "Last opened just now";
  if (delta < 3_600_000) return `Last opened ${Math.max(1, Math.floor(delta / 60_000))} min ago`;
  if (delta < 86_400_000) return `Last opened ${Math.floor(delta / 3_600_000)}h ago`;
  return `Last opened ${Math.floor(delta / 86_400_000)}d ago`;
}

export function useGeoSession() {
  const [session, setSession] = useState(readGeoSession);
  useEffect(() => onGeoSession(() => setSession(readGeoSession())), []);
  return session;
}
