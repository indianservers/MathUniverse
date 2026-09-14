import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { clamp, snapDeg, snapLength, type Vec } from "./circleMath";
import { circleModeUrl, parseAngleKind, parseCircleMode, parsePowerKind, type CircleModeId } from "./circleMode";

type UnitKind = "units" | "cm";

type Session = {
  mode: CircleModeId;
  setMode: (id: CircleModeId) => void;
  kind: string;
  setKind: (kind: string) => void;
  r: number;
  setR: (n: number) => void;
  origin: Vec;
  setOrigin: (p: Vec) => void;
  snap: boolean;
  setSnap: (v: boolean) => void;
  teacher: boolean;
  setTeacher: (v: boolean) => void;
  units: UnitKind;
  setUnits: (u: UnitKind) => void;
  unitLabel: string;
  snapA: (deg: number) => number;
  snapL: (n: number) => number;
  announce: string;
  setAnnounce: (s: string) => void;
  undo: () => void;
  registerUndo: (fn: () => void) => void;
  pushUndo: (fn: () => void) => void;
  share: () => Promise<string>;
  exportSvg: () => void;
  persist: Map<string, unknown>;
};

const CircleSessionContext = createContext<Session | null>(null);

export function CircleSessionProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const mode = parseCircleMode(params.get("mode"));
  const r = clamp(Number(params.get("r") || 5) || 5, 2.4, 7.2);
  const kind = mode === "angles" ? parseAngleKind(params.get("kind")) : mode === "power" ? parsePowerKind(params.get("kind")) : params.get("kind") ?? "";
  const [origin, setOrigin] = useState<Vec>({ x: 0, y: 0 });
  const [snap, setSnap] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [units, setUnits] = useState<UnitKind>("units");
  const [announce, setAnnounce] = useState("");
  const undoStack = useRef<Array<() => void>>([]);
  const undoHandler = useRef<(() => void) | null>(null);
  const persist = useRef(new Map<string, unknown>()).current;

  const write = useCallback((patch: Record<string, string | null>, replace = false) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(patch)) {
        if (value == null || value === "") next.delete(key);
        else next.set(key, value);
      }
      return next;
    }, { replace });
  }, [setParams]);

  const setMode = (id: CircleModeId) => {
    write({ mode: circleModeUrl(id), kind: null });
  };
  const setKind = (next: string) => write({ kind: next });
  const setR = (n: number) => write({ r: String(clamp(n, 2.4, 7.2)) }, true);

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setAnnounce("Share URL copied.");
      return "Copied share URL.";
    } catch {
      setAnnounce(url);
      return url;
    }
  };

  const exportSvg = () => {
    const svg = document.querySelector(".clab-svg");
    if (!svg) return;
    const blob = new Blob([`<?xml version="1.0"?>${svg.outerHTML}`], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `circles-${mode}.svg`;
    a.click();
    URL.revokeObjectURL(href);
    setAnnounce("SVG downloaded.");
  };

  const value: Session = {
    mode,
    setMode,
    kind,
    setKind,
    r,
    setR,
    origin,
    setOrigin,
    snap,
    setSnap,
    teacher,
    setTeacher,
    units,
    setUnits,
    unitLabel: units === "cm" ? "cm" : "units",
    snapA: (deg) => snapDeg(deg, snap),
    snapL: (n) => snapLength(n, snap),
    announce,
    setAnnounce,
    registerUndo: (fn) => { undoHandler.current = fn; },
    pushUndo: (fn) => { undoStack.current.push(fn); },
    undo: () => {
      const stacked = undoStack.current.pop();
      if (stacked) stacked();
      else undoHandler.current?.();
      setAnnounce("Undid last change.");
    },
    share,
    exportSvg,
    persist,
  };

  return <CircleSessionContext.Provider value={value}>{children}</CircleSessionContext.Provider>;
}

export function useCircleSession() {
  const ctx = useContext(CircleSessionContext);
  if (!ctx) throw new Error("CircleSession missing");
  return ctx;
}

export function usePersisted<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const { persist } = useCircleSession();
  const [state, setState] = useState<T>(() => (persist.has(key) ? persist.get(key) as T : initial));
  const set = (next: T | ((prev: T) => T)) => {
    setState((prev) => {
      const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      persist.set(key, value);
      return value;
    });
  };
  return [state, set];
}
