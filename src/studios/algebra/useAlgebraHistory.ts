import { useRef, useState } from "react";
import { AlgebraHistory } from "./algebraHistory";

export function useAlgebraHistory<T>(initial: T) {
  const initialRef = useRef(initial);
  const historyRef = useRef<AlgebraHistory<T> | null>(null);
  if (!historyRef.current) historyRef.current = new AlgebraHistory(initialRef.current);
  const history = historyRef.current;
  const [state, setState] = useState(initialRef.current);

  const sync = (value: T) => {
    setState(value);
    return value;
  };

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
