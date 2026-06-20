export type WorkspaceMode =
  | "home"
  | "graph"
  | "geometry"
  | "three-d"
  | "data"
  | "teacher";

export interface WorkspaceModeConfig {
  mode: WorkspaceMode;
  routePath: string;
  title: string;
  description: string;
  primarySurfaceTestId?: string;
}
