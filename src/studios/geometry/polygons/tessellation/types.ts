export type Point = { x: number; y: number };

export type TileKind = "triangle" | "square" | "hexagon";

export type AnimationMode = "expand" | "sweep" | "instant";

export type ColorMode = "uniform" | "alternating" | "tri";

export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

export type Tile = {
  id: string;
  kind: TileKind;
  row: number;
  col: number;
  orientation: "up" | "down" | "none";
  generation: number;
  vertices: Point[];
  center: Point;
  side: number;
  colorIndex: number;
};

export type VertexRecord = {
  key: string;
  point: Point;
  tileIds: string[];
};

export type EdgeRecord = {
  key: string;
  a: Point;
  b: Point;
  tileIds: string[];
  length: number;
};

export type TessellationCheck = {
  n: number;
  interior: number;
  k: number;
  kInteger: boolean;
  tessellates: boolean;
  meetingCount: number | null;
  floorCount: number;
  gapDeg: number;
  overlapDeg: number;
};

export type LatticeVectors = { ax: number; ay: number; bx: number; by: number };
