import { useCallback, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useStudioModel, useStudioState } from "./StudioModelProvider";
import { useAlgebraHistory } from "../algebra/useAlgebraHistory";
import { decodeFigState, encodeFigState, formatExactApprox } from "./studioKernel";

export function useStudioFigure<T extends object>(initial: T) {
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const model = useStudioModel();
  const decoded = decodeFigState(params.get("fig"), initial);
  const legacy = 'version' in decoded ? initial : decoded;
  const key = `figure:${pathname}`;
  const [connected, setConnected] = useStudioState(key, legacy);
  const history = useAlgebraHistory(legacy, "legacy-figure", false);
  const [exact, setExact] = useState(params.get("exact") !== "0");

  const persist = useCallback((state: T, nextExact = exact) => {
    setParams(() => {
      const updated = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
      updated.set("fig", encodeFigState(state));
      if (nextExact) updated.delete("exact");
      else updated.set("exact", "0");
      return updated;
    }, { replace: true });
  }, [exact, setParams]);

  const commit = (next: T | ((prev: T) => T)) => {
    const value = history.commit(next);
    persist(value);
    return value;
  };

  const share = async () => {
    persist(history.state);
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  const setExactAndPersist = (value: boolean) => {
    setExact(value);
    persist(history.state, value);
  };

  if (model) return {
    state: connected,
    commit: (next: T | ((prev: T) => T)) => { const value = typeof next === 'function' ? next(connected) : next; setConnected(value); return value; },
    undo: () => { model.ledger.undo(); return model.ledger.values[key] as T; },
    redo: () => { model.ledger.redo(); return model.ledger.values[key] as T; },
    reset: () => { model.ledger.reset(); return model.ledger.values[key] as T; },
    canUndo: !!model.ledger.past.length,
    canRedo: !!model.ledger.future.length,
    exact: model.exact,
    setExact: model.setExact,
    share: model.share,
    format: (n: number, digits = 4) => formatExactApprox(n, model.exact, digits),
  };
  return {
    state: history.state,
    commit,
    undo: () => {
      const value = history.undo();
      persist(value);
      return value;
    },
    redo: () => {
      const value = history.redo();
      persist(value);
      return value;
    },
    reset: () => {
      const value = history.reset(initial);
      persist(value);
      return value;
    },
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    exact,
    setExact: setExactAndPersist,
    share,
    format: (n: number, digits = 4) => formatExactApprox(n, exact, digits),
  };
}
