export type SurfacePalette =
  "height" | "thermal" | "contour" | "mono" | "custom";
export type Graph3DLayerKind =
  "explicit" | "implicit" | "parametric" | "curve" | "vector-field";
export type Graph3DCoordinateMode = "cartesian" | "cylindrical" | "spherical";
export type Graph3DKeyframe = {
  id: string;
  label: string;
  time: number;
  camera: [number, number, number];
  variables: Record<string, number>;
};

export type Graph3DSurface = {
  id: string;
  name: string;
  expression: string;
  visible: boolean;
  palette: SurfacePalette;
  colorLow: string;
  colorHigh: string;
  opacity: number;
  wireframe: boolean;
  showPoints: boolean;
  samplingAnimation: boolean;
  kind: Graph3DLayerKind;
  coordinateMode: Graph3DCoordinateMode;
  components: { x: string; y: string; z: string };
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  tMin: number;
  tMax: number;
  adaptive: boolean;
  streamlines: boolean;
};

const colors = [
  ["#22d3ee", "#8b5cf6"],
  ["#fb7185", "#fbbf24"],
  ["#34d399", "#38bdf8"],
  ["#f472b6", "#818cf8"],
  ["#a3e635", "#14b8a6"],
] as const;

export function createGraph3DSurface(
  expression = "sin(x) * cos(y)",
  index = 0,
): Graph3DSurface {
  const [colorLow, colorHigh] = colors[index % colors.length];
  return {
    id: `surface-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `Surface ${index + 1}`,
    expression,
    visible: true,
    palette: index ? "custom" : "height",
    colorLow,
    colorHigh,
    opacity: index ? 0.72 : 0.9,
    wireframe: false,
    showPoints: false,
    samplingAnimation: index === 0,
    kind: "explicit",
    coordinateMode: "cartesian",
    components: { x: "u", y: "v", z: expression },
    uMin: -3,
    uMax: 3,
    vMin: -3,
    vMax: 3,
    tMin: 0,
    tMax: Math.PI * 6,
    adaptive: true,
    streamlines: true,
  };
}

type LegacySurfaceState = {
  surfaces?: Graph3DSurface[];
  expression?: string;
  secondaryExpression?: string;
  secondaryVisible?: boolean;
  opacity?: number;
  palette?: SurfacePalette;
  showWireframe?: boolean;
  showPoints?: boolean;
};

export function migrateGraph3DSurfaces(
  state: LegacySurfaceState,
): Graph3DSurface[] {
  if (Array.isArray(state.surfaces) && state.surfaces.length) {
    return state.surfaces.map((surface, index) => ({
      ...createGraph3DSurface(surface.expression, index),
      ...surface,
      id: surface.id || `surface-migrated-${index}`,
      name: surface.name || `Surface ${index + 1}`,
    }));
  }

  const primary = {
    ...createGraph3DSurface(state.expression || "sin(x) * cos(y)", 0),
    opacity: state.opacity ?? 0.9,
    palette: state.palette ?? "height",
    wireframe: state.showWireframe ?? false,
    showPoints: state.showPoints ?? false,
  };
  if (!state.secondaryVisible) return [primary];
  return [
    primary,
    createGraph3DSurface(state.secondaryExpression || "x^2 - y^2", 1),
  ];
}
