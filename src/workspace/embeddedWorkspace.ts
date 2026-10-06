export type EmbeddedGraphOptions = {
  activityId: string;
  expressions: string[];
  title: string;
  expressionRevision?: number;
  onSceneChange?: (scene: unknown) => void;
};

export function readEmbeddedGraphState<T>(options: EmbeddedGraphOptions | undefined, dimension: "2d" | "3d"): T | undefined {
  if (!options) return undefined;
  try {
    const value = JSON.parse(localStorage.getItem(`geometry-studio-graph:${dimension}:${options.activityId}`) ?? "null");
    if (value && Array.isArray(dimension === "2d" ? value.functions : value.surfaces)) return value as T;
  } catch { /* Use the example if saved state is unavailable or malformed. */ }
  return undefined;
}

export function saveEmbeddedGraphState(options: EmbeddedGraphOptions, dimension: "2d" | "3d", state: unknown) {
  try { localStorage.setItem(`geometry-studio-graph:${dimension}:${options.activityId}`, JSON.stringify(state)); } catch { /* Editing still works without browser storage. */ }
  options.onSceneChange?.(state);
}
