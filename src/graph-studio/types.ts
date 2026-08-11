export const GRAPH_STUDIO_SCHEMA_VERSION = 1;

export type GraphStudioDimension = "2d" | "3d";
export type GraphStudioStylePreset = "classroom" | "paper" | "neon" | "presentation" | "contrast" | "colorblind" | "print";

export type GraphStudioVariable = {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  playing: boolean;
  direction: 1 | -1;
  playback: "loop" | "ping-pong";
  speed: number;
  group?: string;
};

export type GraphStudioExpression = {
  id: string;
  name: string;
  source: string;
  color: string;
  visible: boolean;
  locked: boolean;
  groupId?: string;
  opacity?: number;
  lineWidth?: number;
  lineStyle?: "solid" | "dashed" | "dotted";
};

export type GraphStudioProject<TState = unknown> = {
  schemaVersion: number;
  id: string;
  name: string;
  dimension: GraphStudioDimension;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  stylePreset: GraphStudioStylePreset;
  variables: GraphStudioVariable[];
  notes: string[];
  pinnedAnalysis: string[];
  state: TState;
};

export type GraphStudioProjectEnvelope<TState = unknown> = {
  kind: "math-universe-graph-project";
  exportedAt: string;
  project: GraphStudioProject<TState>;
};
