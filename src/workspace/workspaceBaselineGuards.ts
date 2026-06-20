export type WorkspaceBaselineRoute = {
  id: string;
  route: string;
  purpose: string;
  protectedSignals: string[];
  mustKeep: string[];
};

export const phase1BackupManifest = {
  branch: "codex/phase-1-baseline-20260611",
  archive: "docs/workspace/baselines/phase-1-baseline-20260611/math-universe-source-baseline.zip",
  archivedFolders: [
    "src/pages",
    "src/components",
    "src/workspace",
    "src/data",
    "src/modules",
    "src/visualizations",
  ],
  note: "Created before the 10-phase world-class math platform expansion. Do not overwrite this baseline during later phases.",
} as const;

export const protectedWorkspaceBaselines: WorkspaceBaselineRoute[] = [
  {
    id: "workspace-graph",
    route: "/workspace/graph",
    purpose: "Current Graph/CAS/Algebra workspace shell.",
    protectedSignals: ["Graph, CAS, And Algebra", "Workspace command keyboard", "Formula Library", "Results"],
    mustKeep: ["command input", "graph panel", "result cards", "algebra object panel"],
  },
  {
    id: "workspace-geometry-2d",
    route: "/workspace/geometry",
    purpose: "Current 2D geometry construction workspace.",
    protectedSignals: ["Geometry Constructor", "Object Properties", "Current tool", "Touch mode", "showUnits"],
    mustKeep: ["left tool palette", "central geometry board", "right object properties", "graph unit toggle", "GeoGebra-style multi-click tools"],
  },
  {
    id: "workspace-3d",
    route: "/workspace/3d?v_surface_scale=1&v_solid_height_radius=2.5&v_cross_section_z=0&v_scene_animation_speed=0.18",
    purpose: "Current 3D workspace with left controls, center 2D/3D panes, and right object inspector.",
    protectedSignals: ["3D Graphing And Solids Lab", "Controls", "Top View X-Y", "Side View X-Z", "3D Scene Objects", "Selected Object", "HorizontalPanelHeader", "PanelLeftClose", "PanelRightClose"],
    mustKeep: ["left controls panel", "middle 2D projection panes", "middle 3D scene", "right scene objects", "right selected object properties", "horizontal collapse", "vertical accordion collapse"],
  },
  {
    id: "workspace-data",
    route: "/workspace/data",
    purpose: "Current CAS/Data workspace.",
    protectedSignals: ["CAS, Spreadsheet, Tables, And Commands", "Spreadsheet", "regression", "Function analysis"],
    mustKeep: ["editable spreadsheet", "scatter generation", "regression output", "function analysis panel"],
  },
  {
    id: "workspace-teach",
    route: "/workspace/teach",
    purpose: "Current teacher studio workspace.",
    protectedSignals: ["Teacher", "Guided", "presentation", "offline"],
    mustKeep: ["teacher controls", "guided activity", "presentation state", "offline project library"],
  },
  {
    id: "shapes-explorer",
    route: "/shapes?shape=octahedron",
    purpose: "Current 2D/3D Shapes Explorer layout.",
    protectedSignals: ["Shapes Explorer", "Collapse Menu", "Expand Main Menu", "2D Pane", "3D Pane", "Formula Map"],
    mustKeep: ["collapsible main menu", "selected shape workspace", "2D pane", "3D pane", "formula map", "shape controls"],
  },
];

export const protectedLayoutInvariants = [
  "Do not remove or rewrite the current working 2D geometry board layout without first updating baseline tests and screenshots.",
  "Do not remove or rewrite the current working 3D workspace left/middle/right layout without first updating baseline tests and screenshots.",
  "Future engineering mathematics phases must add new labs through new routes or isolated components before replacing stable workspaces.",
  "Horizontal and vertical collapse controls are part of the protected 3D workspace contract.",
  "The Shapes Explorer collapsible main menu and in-panel 2D/3D panes are part of the protected shape-learning contract.",
] as const;
