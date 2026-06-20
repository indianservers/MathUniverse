import type { WorkspaceMode, WorkspaceModeConfig } from "./types/workspaceMode";

export const workspaceModeConfigs: Record<WorkspaceMode, WorkspaceModeConfig> = {
  home: {
    mode: "home",
    routePath: "/workspace",
    title: "All workspace",
    description: "Unified workspace home with graphing, geometry, 3D, data, and teaching tools.",
    primarySurfaceTestId: "workspace-graph-surface",
  },
  graph: {
    mode: "graph",
    routePath: "/workspace/graph",
    title: "Graph",
    description: "Graphing, CAS, algebra commands, result cards, and linked object registry.",
    primarySurfaceTestId: "workspace-graph-surface",
  },
  geometry: {
    mode: "geometry",
    routePath: "/workspace/geometry",
    title: "Geometry",
    description: "2D construction board with points, lines, circles, polygons, tools, and measurements.",
    primarySurfaceTestId: "workspace-geometry-board",
  },
  "three-d": {
    mode: "three-d",
    routePath: "/workspace/3d",
    title: "3D",
    description: "3D graphing, solids, surfaces, camera controls, and object transforms.",
    primarySurfaceTestId: "workspace-3d-surface",
  },
  data: {
    mode: "data",
    routePath: "/workspace/data",
    title: "CAS / Data",
    description: "Spreadsheet, CAS, function analysis, results, and object registry pages.",
    primarySurfaceTestId: "workspace-data-surface",
  },
  teacher: {
    mode: "teacher",
    routePath: "/workspace/teach",
    title: "Teacher",
    description: "Syllabus templates, guided activity mode, presentation controls, and exports.",
    primarySurfaceTestId: "workspace-teacher-surface",
  },
};

export const workspaceModeNavigation = [
  workspaceModeConfigs.graph,
  workspaceModeConfigs.geometry,
  workspaceModeConfigs["three-d"],
  workspaceModeConfigs.data,
  workspaceModeConfigs.teacher,
];

export function resolveWorkspaceModeFromPath(pathname: string): WorkspaceModeConfig | null {
  const normalized = pathname.replace(/\/+$/, "") || "/workspace";
  if (normalized === "/workspace") return workspaceModeConfigs.home;
  if (normalized === "/workspace/graph") return workspaceModeConfigs.graph;
  if (normalized === "/workspace/geometry") return workspaceModeConfigs.geometry;
  if (normalized === "/workspace/3d") return workspaceModeConfigs["three-d"];
  if (normalized === "/workspace/data" || normalized.startsWith("/workspace/data/")) return workspaceModeConfigs.data;
  if (normalized === "/workspace/teach") return workspaceModeConfigs.teacher;
  return null;
}
