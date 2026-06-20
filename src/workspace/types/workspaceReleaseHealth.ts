export type WorkspaceHealthStatus =
  | "passed"
  | "warning"
  | "failed"
  | "not-run";

export interface WorkspaceHealthCheck {
  id: string;
  label: string;
  status: WorkspaceHealthStatus;
  details?: string;
}

export interface WorkspaceRouteHealth {
  routeId: string;
  routePath: string;
  module: "graphing" | "geometry" | "three-d" | "data-cas" | "teacher-studio" | "workspace-home" | "unknown";
  status: WorkspaceHealthStatus;
  checks: WorkspaceHealthCheck[];
  notes?: string[];
}
