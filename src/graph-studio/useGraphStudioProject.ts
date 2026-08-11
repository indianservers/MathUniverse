import { useEffect, useRef, useState } from "react";
import { createGraphStudioProject, deleteGraphStudioProject, duplicateGraphStudioProject, importGraphStudioProject, readGraphStudioProjects, saveGraphStudioProject } from "./projectStorage";
import type { GraphStudioDimension, GraphStudioProject, GraphStudioVariable } from "./types";

type Options<TState> = {
  dimension: GraphStudioDimension;
  initialName: string;
  state: TState;
  applyState: (state: TState, variables: GraphStudioVariable[]) => void;
};

export function useGraphStudioProject<TState>({ dimension, initialName, state, applyState }: Options<TState>) {
  const [project, setProject] = useState(() => createGraphStudioProject(dimension, initialName, state));
  const [projects, setProjects] = useState<GraphStudioProject<TState>[]>(() => readGraphStudioProjects<TState>(dimension));
  const [undoStack, setUndoStack] = useState<TState[]>([]);
  const [redoStack, setRedoStack] = useState<TState[]>([]);
  const previousRef = useRef(state);
  const initialStateRef = useRef(state);
  const skipHistoryRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      previousRef.current = state;
      return;
    }
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      previousRef.current = state;
      return;
    }
    if (JSON.stringify(previousRef.current) === JSON.stringify(state)) return;
    setUndoStack((items) => [...items.slice(-39), previousRef.current]);
    setRedoStack([]);
    previousRef.current = state;
  }, [state]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveGraphStudioProject({ ...project, state });
      setProjects(readGraphStudioProjects<TState>(dimension));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [dimension, project, state]);

  const updateProject = (patch: Partial<GraphStudioProject<TState>>) => setProject((current) => ({ ...current, ...patch }));
  const save = () => {
    const saved = saveGraphStudioProject({ ...project, state });
    setProject(saved);
    setProjects(readGraphStudioProjects<TState>(dimension));
  };
  const newProject = () => {
    const next = createGraphStudioProject(dimension, `Untitled ${dimension.toUpperCase()} project`, initialStateRef.current);
    skipHistoryRef.current = true;
    applyState(initialStateRef.current, []);
    previousRef.current = initialStateRef.current;
    setProject(next);
    setUndoStack([]);
    setRedoStack([]);
  };
  const load = (next: GraphStudioProject<TState>) => {
    skipHistoryRef.current = true;
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
    const previous = undoStack.at(-1);
    if (!previous) return;
    skipHistoryRef.current = true;
    setUndoStack((items) => items.slice(0, -1));
    setRedoStack((items) => [...items, state]);
    previousRef.current = previous;
    applyState(previous, project.variables);
  };
  const redo = () => {
    const next = redoStack.at(-1);
    if (!next) return;
    skipHistoryRef.current = true;
    setRedoStack((items) => items.slice(0, -1));
    setUndoStack((items) => [...items, state]);
    previousRef.current = next;
    applyState(next, project.variables);
  };

  return { project, projects, updateProject, save, newProject, load, remove, duplicate, importProject, undo, redo, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 };
}
