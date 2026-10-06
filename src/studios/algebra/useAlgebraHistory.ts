import { useRef, useState } from "react";
import { AlgebraHistory } from "./algebraHistory";
import { useStudioModel, useStudioState } from "../phase1/StudioModelProvider";

export function useAlgebraHistory<T>(initial: T, modelKey = "algebra-history", shared = true) {
  const initialRef = useRef(initial);
  const historyRef = useRef<AlgebraHistory<T> | null>(null);
  if (!historyRef.current) historyRef.current = new AlgebraHistory(initialRef.current);
  const history = historyRef.current;
  const [state, setState] = useState(initialRef.current);
  const model = useStudioModel();
  const [connected, setConnected] = useStudioState(modelKey, initialRef.current, shared);

  const sync = (value: T) => {
    setState(value);
    return value;
  };

  if (model && shared) {
    const update = (next: T | ((prev: T) => T)) => {
      const current = (model.ledger.values[modelKey] ?? connected) as T;
      const value = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      setConnected(value); return value;
    };
    return {
      state: connected,
      commit: update,
      replace: update,
      undo: () => { model.ledger.undo(); return model.ledger.values[modelKey] as T; },
      redo: () => { model.ledger.redo(); return model.ledger.values[modelKey] as T; },
      reset: (value: T = initialRef.current) => update(value),
      canUndo: !!model.ledger.past.length,
      canRedo: !!model.ledger.future.length,
    };
  }
  return {
    state,
    commit: (next: T | ((prev: T) => T)) => sync(history.commit(typeof next === "function" ? (next as (current: T) => T)(history.present) : next)),
    replace: (next: T | ((prev: T) => T)) => sync(history.replace(typeof next === "function" ? (next as (current: T) => T)(history.present) : next)),
    undo: () => sync(history.undo()),
    redo: () => sync(history.redo()),
    reset: (value: T = initialRef.current) => sync(history.reset(value)),
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}
