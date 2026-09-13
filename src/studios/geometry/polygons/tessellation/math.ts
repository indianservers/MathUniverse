import type { Point, TessellationCheck } from "./types";

export const SQRT3 = Math.sqrt(3);
export const VERTEX_EPS = 1e-6;

export function regularInteriorAngle(n: number): number {
  const sides = Math.max(3, Math.round(n));
  return ((sides - 2) * 180) / sides;
}

export function regularPolygonArea(n: number, side: number): number {
  const sides = Math.max(3, Math.round(n));
  return (sides * side * side) / (4 * Math.tan(Math.PI / sides));
}

export function regularCircumradius(n: number, side: number): number {
  return side / (2 * Math.sin(Math.PI / Math.max(3, Math.round(n))));
}

export function regularTessellationCheck(n: number): TessellationCheck {
  const sides = Math.max(3, Math.round(n));
  const interior = regularInteriorAngle(sides);
  const k = 360 / interior;
  const kInteger = Math.abs(k - Math.round(k)) < 1e-8;
  const meeting = kInteger ? Math.round(k) : null;
  const tessellates = meeting !== null && meeting >= 3;
  const floorCount = Math.max(1, Math.floor(k + 1e-10));
  const gapDeg = Math.max(0, 360 - floorCount * interior);
  const overlapDeg = Math.max(0, (floorCount + 1) * interior - 360);
  return {
    n: sides,
    interior,
    k,
    kInteger,
    tessellates,
    meetingCount: tessellates ? meeting : null,
    floorCount,
    gapDeg,
    overlapDeg,
  };
}

export function centroid(vertices: Point[]): Point {
  const n = vertices.length || 1;
  return {
    x: vertices.reduce((sum, p) => sum + p.x, 0) / n,
    y: vertices.reduce((sum, p) => sum + p.y, 0) / n,
  };
}

export function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function vertexKey(point: Point, unit: number): string {
  const scale = 1 / Math.max(1e-6, unit);
  const qx = Math.round(point.x * scale * 4) / 4;
  const qy = Math.round(point.y * scale * 4) / 4;
  return `${qx.toFixed(3)},${qy.toFixed(3)}`;
}

export function edgeKey(a: Point, b: Point, unit: number): string {
  const ka = vertexKey(a, unit);
  const kb = vertexKey(b, unit);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

export function inflateVertices(vertices: Point[], amount: number): Point[] {
  const c = centroid(vertices);
  return vertices.map((p) => {
    const d = Math.hypot(p.x - c.x, p.y - c.y) || 1;
    const k = (d + amount) / d;
    return { x: c.x + (p.x - c.x) * k, y: c.y + (p.y - c.y) * k };
  });
}

export function pointInPolygon(point: Point, vertices: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const vi = vertices[i];
    const vj = vertices[j];
    if (!vi || !vj) continue;
    const intersect =
      vi.y > point.y !== vj.y > point.y &&
      point.x < ((vj.x - vi.x) * (point.y - vi.y)) / ((vj.y - vi.y) || VERTEX_EPS) + vi.x;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function nearestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

export function rotatePoint(p: Point, origin: Point, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const x = p.x - origin.x;
  const y = p.y - origin.y;
  return { x: origin.x + x * c - y * s, y: origin.y + x * s + y * c };
}

export function worldFromScreen(
  sx: number,
  sy: number,
  width: number,
  height: number,
  panX: number,
  panY: number,
  zoom: number,
  rotation: number,
): Point {
  const origin = { x: width / 2 + panX, y: height / 2 + panY };
  const unscaled = { x: (sx - origin.x) / zoom, y: (sy - origin.y) / zoom };
  return rotatePoint(unscaled, { x: 0, y: 0 }, -rotation);
}

export function screenCornersWorld(
  width: number,
  height: number,
  panX: number,
  panY: number,
  zoom: number,
  rotation: number,
) {
  return [
    worldFromScreen(0, 0, width, height, panX, panY, zoom, rotation),
    worldFromScreen(width, 0, width, height, panX, panY, zoom, rotation),
    worldFromScreen(width, height, width, height, panX, panY, zoom, rotation),
    worldFromScreen(0, height, width, height, panX, panY, zoom, rotation),
  ];
}

export function boundsFromPoints(points: Point[], pad: number): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
}

export function polygonPath(vertices: Point[]): string {
  return vertices.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
}

export function wedgePath(center: Point, radius: number, startDeg: number, endDeg: number): string {
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const a = { x: center.x + radius * Math.cos(start), y: center.y + radius * Math.sin(start) };
  const b = { x: center.x + radius * Math.cos(end), y: center.y + radius * Math.sin(end) };
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${center.x} ${center.y} L ${a.x} ${a.y} A ${radius} ${radius} 0 ${endDeg - startDeg > 180 ? 1 : large} 1 ${b.x} ${b.y} Z`;
}

export function sectorPath(center: Point, radius: number, startDeg: number, sweepDeg: number): string {
  return wedgePath(center, radius, startDeg, startDeg + sweepDeg);
}

export function regularPolygonAtVertex(
  n: number,
  side: number,
  vertex: Point,
  startDeg: number,
): Point[] {
  const R = regularCircumradius(n, side);
  const interior = regularInteriorAngle(n);
  const bisector = ((startDeg + interior / 2) * Math.PI) / 180;
  const cx = vertex.x + R * Math.cos(bisector);
  const cy = vertex.y + R * Math.sin(bisector);
  const vertex0 = Math.atan2(vertex.y - cy, vertex.x - cx);
  const step = (2 * Math.PI) / n;
  return Array.from({ length: n }, (_, j) => ({
    x: cx + R * Math.cos(vertex0 + j * step),
    y: cy + R * Math.sin(vertex0 + j * step),
  }));
}
