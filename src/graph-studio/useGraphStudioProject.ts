import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  createGraphStudioProject,
  deleteGraphStudioProject,
  duplicateGraphStudioProject,
  importGraphStudioProject,
  readGraphStudioProjects,
  saveGraphStudioProject,
} from "./projectStorage";
import type {
  GraphStudioDimension,
  GraphStudioProject,
  GraphStudioVariable,
} from "./types";

type Options<TState> = {
  dimension: GraphStudioDimension;
  initialName: string;
  persist?: boolean;
  state: TState;
  applyState: (state: TState, variables: GraphStudioVariable[]) => void;
};

export function useGraphStudioProject<TState>({
  dimension,
  initialName,
  persist = true,
  state,
  applyState,
}: Options<TState>) {
  const [project, setProject] = useState(() =>
    createGraphStudioProject(dimension, initialName, state),
  );
  const [projects, setProjects] = useState<GraphStudioProject<TState>[]>(() =>
    readGraphStudioProjects<TState>(dimension),
  );
  const [undoStack, setUndoStack] = useState<TState[]>([]);
  const [redoStack, setRedoStack] = useState<TState[]>([]);
  const previousRef = useRef(state);
  const initialStateRef = useRef(state);
  const skipHistoryRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const gestureStart = useRef<TState | null>(null);
  useEffect(() => {
    const begin=()=>{gestureStart.current=previousRef.current;};
    const end=()=>{window.setTimeout(()=>{const before=gestureStart.current;gestureStart.current=null;if(before&&JSON.stringify(before)!==JSON.stringify(previousRef.current)){setUndoStack(items=>[...items.slice(-39),before]);setRedoStack([]);}},0);};
    window.addEventListener("immersive-transaction-start",begin);window.addEventListener("immersive-transaction-end",end);
    return()=>{window.removeEventListener("immersive-transaction-start",begin);window.removeEventListener("immersive-transaction-end",end);};
  }, []);

  useLayoutEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      previousRef.current = state;
      return;
    }
    if (skipHistoryRef.current !== null) {
      const skip = skipHistoryRef.current === JSON.stringify(state);
      skipHistoryRef.current = null;
      if (skip) {
        previousRef.current = state;
        return;
      }
    }
    if (JSON.stringify(previousRef.current) === JSON.stringify(state)) return;
    if (gestureStart.current) { previousRef.current=state; return; }
    const previous = previousRef.current;
    setUndoStack((items) => [...items.slice(-39), previous]);
    setRedoStack([]);
    previousRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!persist) return;
    const timer = window.setTimeout(() => {
      saveGraphStudioProject({ ...project, state });
      setProjects(readGraphStudioProjects<TState>(dimension));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [dimension, persist, project, state]);

  const updateProject = (patch: Partial<GraphStudioProject<TState>>) =>
    setProject((current) => ({ ...current, ...patch }));
  const save = () => {
    const saved = saveGraphStudioProject({ ...project, state });
    setProject(saved);
    setProjects(readGraphStudioProjects<TState>(dimension));
  };
  const newProject = () => {
    const next = createGraphStudioProject(
      dimension,
      `Untitled ${dimension.toUpperCase()} project`,
      initialStateRef.current,
    );
    skipHistoryRef.current = JSON.stringify(initialStateRef.current);
    applyState(initialStateRef.current, []);
    previousRef.current = initialStateRef.current;
    setProject(next);
    setUndoStack([]);
    setRedoStack([]);
  };
  const load = (next: GraphStudioProject<TState>) => {
    skipHistoryRef.current = JSON.stringify(next.state);
    applyState(next.state, next.variables);
    previousRef.current = next.state;
    setProject(next);
    setUndoStack([]);
    setRedoStack([]);
  };
  const remove = (id: string) => {
    deleteGraphStudioProject(id);
    setProjects(readGraphStudioProjects<TState>(dimension));
    if (id === project.id) newProject();
  };
  const duplicate = () => {
    const copy = duplicateGraphStudioProject({ ...project, state });
    setProjects(readGraphStudioProjects<TState>(dimension));
    load(copy);
  };
  const importProject = (raw: string) => {
    const imported = importGraphStudioProject<TState>(raw, dimension);
    setProjects(readGraphStudioProjects<TState>(dimension));
    load(imported);
  };
  const undo = () => {
    const current = JSON.stringify(state);
    const index = undoStack.findLastIndex((item) => JSON.stringify(item) !== current);
    const previous = index >= 0 ? undoStack[index] : undefined;
    if (!previous) return;
    skipHistoryRef.current = JSON.stringify(previous);
    setUndoStack((items) => items.slice(0, index));
    setRedoStack((items) => [...items, state]);
    previousRef.current = previous;
    applyState(previous, project.variables);
  };
  const redo = () => {
    const current = JSON.stringify(state);
    const index = redoStack.findLastIndex((item) => JSON.stringify(item) !== current);
    const next = index >= 0 ? redoStack[index] : undefined;
    if (!next) return;
    skipHistoryRef.current = JSON.stringify(next);
    setRedoStack((items) => items.slice(0, index));
    setUndoStack((items) => [...items, state]);
    previousRef.current = next;
    applyState(next, project.variables);
  };

  return {
    project,
    projects,
    updateProject,
    save,
    newProject,
    load,
    remove,
    duplicate,
    importProject,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}
