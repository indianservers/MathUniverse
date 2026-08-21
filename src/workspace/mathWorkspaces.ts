export type MathWorkspaceId = "cas" | "geometry" | "geometry-3d" | "graphs" | "graphs-3d" | "shapes";

export type MathWorkspaceGroup = "calculate" | "construct-graph" | "explore";

export type MathWorkspaceActionId =
  | "analyse-in-cas"
  | "open-in-geometry"
  | "open-in-3d-geometry"
  | "open-in-graphs"
  | "open-in-3d-graphs";

export type MathWorkspaceDefinition = {
  id: MathWorkspaceId;
  name: string;
  route: string;
  icon: "Sigma" | "Shapes" | "Cuboid" | "ChartSpline" | "Orbit";
  description: string;
  shortDescription: string;
  group: MathWorkspaceGroup;
  accent: string;
  badge: string;
  formula: string;
  artwork: string;
  supportedContextualActions: MathWorkspaceActionId[];
};

export const mathWorkspaceGroupLabels: Record<MathWorkspaceGroup, string> = {
  calculate: "Calculate",
  "construct-graph": "Construct and Graph",
  explore: "Explore",
};

export const mathWorkspaces: MathWorkspaceDefinition[] = [
  {
    id: "cas",
    name: "CAS",
    route: "/workspace/data",
    icon: "Sigma",
    description: "Solve, simplify and explore mathematics with exact symbolic results.",
    shortDescription: "Exact symbolic mathematics and analysis.",
    group: "calculate",
    accent: "#7c3aed",
    badge: "Symbolic",
    formula: "f(x) · ∑ · ∫",
    artwork: "/workspace-icons/cas.webp",
    supportedContextualActions: ["open-in-graphs", "open-in-3d-graphs", "open-in-geometry"],
  },
  {
    id: "geometry",
    name: "2D Geometry",
    route: "/workspace/geometry",
    icon: "Shapes",
    description: "Construct and investigate interactive 2D geometric objects.",
    shortDescription: "Interactive 2D constructions.",
    group: "construct-graph",
    accent: "#06b6d4",
    badge: "2D",
    formula: "∠A + ∠B + ∠C = 180°",
    artwork: "/workspace-icons/geometry.webp",
    supportedContextualActions: ["analyse-in-cas"],
  },
  {
    id: "geometry-3d",
    name: "3D Geometry",
    route: "/workspace/3d",
    icon: "Cuboid",
    description: "Build and measure points, lines, planes and solids in 3D.",
    shortDescription: "Construct geometry in three dimensions.",
    group: "construct-graph",
    accent: "#2563eb",
    badge: "3D",
    formula: "V = lwh",
    artwork: "/workspace-icons/geometry-3d.webp",
    supportedContextualActions: ["analyse-in-cas"],
  },
  {
    id: "graphs",
    name: "2D Graph",
    route: "/workspace/graph",
    icon: "ChartSpline",
    description: "Plot and analyse 2D functions, equations, inequalities and data.",
    shortDescription: "Plot and analyse 2D graphs.",
    group: "construct-graph",
    accent: "#0891b2",
    badge: "Plot",
    formula: "y = f(x)",
    artwork: "/workspace-icons/graphs.webp",
    supportedContextualActions: ["analyse-in-cas", "open-in-geometry"],
  },
  {
    id: "graphs-3d",
    name: "3D Graph",
    route: "/math-lab/3d-graphing",
    icon: "Orbit",
    description: "Visualize surfaces, curves and equations in three dimensions.",
    shortDescription: "Explore 3D graphs and surfaces.",
    group: "construct-graph",
    accent: "#4f46e5",
    badge: "Surface",
    formula: "z = f(x, y)",
    artwork: "/workspace-icons/graphs-3d.webp",
    supportedContextualActions: ["open-in-3d-geometry"],
  },
  {
    id: "shapes",
    name: "Shapes Explorer",
    route: "/shapes",
    icon: "Shapes",
    description: "Explore the properties, formulas, nets and cross-sections of shapes.",
    shortDescription: "Inspect shapes, formulas and sections.",
    group: "explore",
    accent: "#8b5cf6",
    badge: "Library",
    formula: "A · V · nets",
    artwork: "/workspace-icons/shapes.webp",
    supportedContextualActions: ["analyse-in-cas", "open-in-geometry", "open-in-3d-geometry"],
  },
];

export type MathWorkspacePayload = {
  version: 1;
  sourceWorkspace: MathWorkspaceId;
  objectType: "expression" | "equation" | "measurement" | "shape" | "cross-section" | "surface";
  label: string;
  value: string;
  metadata?: Record<string, string | number | boolean>;
};

export function findMathWorkspace(pathname: string) {
  return mathWorkspaces.find((workspace) => pathname === workspace.route || pathname.startsWith(`${workspace.route}/`));
}

export function workspaceById(id: MathWorkspaceId) {
  return mathWorkspaces.find((workspace) => workspace.id === id);
}

export function workspaceRoute(id: MathWorkspaceId) {
  const workspace = workspaceById(id);
  if (!workspace) throw new Error(`Unknown math workspace: ${id}`);
  return workspace.route;
}

export function createMathWorkspacePayload(payload: Omit<MathWorkspacePayload, "version">): MathWorkspacePayload {
  return { version: 1, ...payload };
}
