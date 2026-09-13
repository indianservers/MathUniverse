export type Vec = { x: number; y: number };

export const TAU = Math.PI * 2;

export function vec(x: number, y: number): Vec {
  return { x, y };
}

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(a: Vec, s: number): Vec {
  return { x: a.x * s, y: a.y * s };
}

export function midpoint(a: Vec, b: Vec): Vec {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function distance(a: Vec, b: Vec): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function length(a: Vec): number {
  return Math.hypot(a.x, a.y);
}

export function normalize(a: Vec): Vec {
  const len = length(a);
  if (len < 1e-12) return { x: 1, y: 0 };
  return { x: a.x / len, y: a.y / len };
}

export function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y;
}

export function cross(a: Vec, b: Vec): number {
  return a.x * b.y - a.y * b.x;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function sidesOf(n: number): number {
  return clampInt(n, 3, 50);
}

export function regularPolygonVertices(n: number, R: number, rotationDeg = 0): Vec[] {
  const count = sidesOf(n);
  const rot = toRad(rotationDeg) - Math.PI / 2;
  return Array.from({ length: count }, (_, i) => {
    const a = rot + (i * TAU) / count;
    return { x: R * Math.cos(a), y: R * Math.sin(a) };
  });
}

export function interiorAngleRegular(n: number): number {
  const count = sidesOf(n);
  return ((count - 2) * 180) / count;
}

export function exteriorAngleRegular(n: number): number {
  return 360 / sidesOf(n);
}

export function interiorAngleSum(n: number): number {
  return (sidesOf(n) - 2) * 180;
}

export function diagonalCount(n: number): number {
  const count = sidesOf(n);
  return (count * (count - 3)) / 2;
}

export function diagonalsFromVertex(n: number): number {
  return sidesOf(n) - 3;
}

export function sideLengthFromCircumradius(n: number, R: number): number {
  return 2 * R * Math.sin(Math.PI / sidesOf(n));
}

export function apothemFromCircumradius(n: number, R: number): number {
  return R * Math.cos(Math.PI / sidesOf(n));
}

export function regularPolygonArea(n: number, R: number): number {
  const count = sidesOf(n);
  return 0.5 * count * R * R * Math.sin(TAU / count);
}

export function polygonPerimeter(vertices: Vec[]): number {
  if (vertices.length < 2) return 0;
  return vertices.reduce((sum, point, i) => {
    const next = vertices[(i + 1) % vertices.length]!;
    return sum + distance(point, next);
  }, 0);
}

export function shoelaceArea(vertices: Vec[]): number {
  if (vertices.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i]!;
    const b = vertices[(i + 1) % vertices.length]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return 0.5 * Math.abs(sum);
}

export function polygonArea(vertices: Vec[]): number {
  return shoelaceArea(vertices);
}

export function signedArea(vertices: Vec[]): number {
  let sum = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i]!;
    const b = vertices[(i + 1) % vertices.length]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return 0.5 * sum;
}

export function isClockwise(vertices: Vec[]): boolean {
  return signedArea(vertices) < 0;
}

export function polygonWinding(vertices: Vec[]): "ccw" | "cw" | "degenerate" {
  const area = signedArea(vertices);
  if (Math.abs(area) < 1e-10) return "degenerate";
  return area > 0 ? "ccw" : "cw";
}

export type LineHit = { point: Vec; t: number; u: number };

export function lineIntersection(a: Vec, b: Vec, c: Vec, d: Vec): LineHit | null {
  const r = sub(b, a);
  const s = sub(d, c);
  const den = cross(r, s);
  if (Math.abs(den) < 1e-12) return null;
  const qp = sub(c, a);
  const t = cross(qp, s) / den;
  const u = cross(qp, r) / den;
  return { point: add(a, scale(r, t)), t, u };
}

export function segmentsIntersectProper(a: Vec, b: Vec, c: Vec, d: Vec): boolean {
  const hit = lineIntersection(a, b, c, d);
  if (!hit) return false;
  return hit.t > 1e-6 && hit.t < 1 - 1e-6 && hit.u > 1e-6 && hit.u < 1 - 1e-6;
}

export function isSelfIntersecting(vertices: Vec[]): boolean {
  const n = vertices.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i += 1) {
    const a = vertices[i]!;
    const b = vertices[(i + 1) % n]!;
    for (let j = i + 1; j < n; j += 1) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      if (adjacent) continue;
      if (j === (i + n - 1) % n) continue;
      const c = vertices[j]!;
      const d = vertices[(j + 1) % n]!;
      const shares = a === c || a === d || b === c || b === d;
      if (shares) continue;
      if ((j + 1) % n === i) continue;
      if (segmentsIntersectProper(a, b, c, d)) return true;
    }
  }
  return false;
}

export function isConvexPolygon(vertices: Vec[]): boolean {
  const n = vertices.length;
  if (n < 3) return false;
  if (isSelfIntersecting(vertices)) return false;
  let sign = 0;
  for (let i = 0; i < n; i += 1) {
    const a = vertices[i]!;
    const b = vertices[(i + 1) % n]!;
    const c = vertices[(i + 2) % n]!;
    const z = cross(sub(b, a), sub(c, b));
    if (Math.abs(z) < 1e-10) continue;
    const next = z > 0 ? 1 : -1;
    if (sign === 0) sign = next;
    else if (next !== sign) return false;
  }
  return sign !== 0;
}

export function interiorAngles(vertices: Vec[]): number[] {
  const n = vertices.length;
  if (n < 3) return [];
  const ccw = signedArea(vertices) >= 0;
  return vertices.map((_, i) => {
    const prev = vertices[(i - 1 + n) % n]!;
    const curr = vertices[i]!;
    const next = vertices[(i + 1) % n]!;
    const incoming = sub(curr, prev);
    const outgoing = sub(next, curr);
    const turn = Math.atan2(cross(incoming, outgoing), dot(incoming, outgoing));
    let interior = ccw ? Math.PI - turn : Math.PI + turn;
    if (interior < 0) interior += TAU;
    if (interior >= TAU) interior -= TAU;
    return toDeg(interior);
  });
}

export function pointInPolygon(point: Vec, vertices: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i, i += 1) {
    const a = vertices[i]!;
    const b = vertices[j]!;
    const intersect = a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / ((b.y - a.y) || 1e-12) + a.x;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || n < k) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  const kk = Math.min(k, n - k);
  for (let i = 1; i <= kk; i += 1) {
    result = (result * (n - kk + i)) / i;
  }
  return Math.round(result);
}

export function genericDiagonalIntersections(n: number): number {
  return combinations(sidesOf(n), 4);
}

export function tessellationAngleCheck(n: number): {
  n: number;
  interior: number;
  k: number;
  kInteger: boolean;
  product: number;
  tessellates: boolean;
  reason: string;
} {
  const count = sidesOf(n);
  const interior = interiorAngleRegular(count);
  const k = 360 / interior;
  const kRounded = Math.round(k);
  const kInteger = Math.abs(k - kRounded) < 1e-8;
  const product = interior * (kInteger ? kRounded : k);
  const tessellates = kInteger && kRounded >= 3 && Math.abs(kRounded * interior - 360) < 1e-6;
  const reason = tessellates
    ? `${interior.toFixed(0)}° × ${kRounded} = 360° — regular monohedral tessellation.`
    : kInteger && kRounded < 3
      ? `${interior.toFixed(0)}° × ${kRounded} cannot fill a vertex (need at least 3 polygons).`
      : `${interior.toFixed(4).replace(/\.?0+$/, "")}° does not divide 360° evenly.`;
  return { n: count, interior, k, kInteger, product, tessellates, reason };
}

export function regularMetrics(n: number, R: number) {
  const count = sidesOf(n);
  const side = sideLengthFromCircumradius(count, R);
  const apothem = apothemFromCircumradius(count, R);
  const perimeter = count * side;
  const area = regularPolygonArea(count, R);
  return {
    n: count,
    R,
    side,
    perimeter,
    apothem,
    area,
    interior: interiorAngleRegular(count),
    exterior: exteriorAngleRegular(count),
    interiorSum: interiorAngleSum(count),
    diagonals: diagonalCount(count),
    fromVertex: diagonalsFromVertex(count),
    triangles: count - 2,
  };
}

export function vertexLabel(index: number): string {
  if (index < 26) return String.fromCharCode(65 + index);
  return `A${index - 25}`;
}

export function apothemFoot(n: number, R: number, rotationDeg: number): { foot: Vec; sideMid: Vec } {
  const verts = regularPolygonVertices(n, R, rotationDeg);
  const a = verts[0]!;
  const b = verts[1]!;
  const mid = midpoint(a, b);
  return { foot: mid, sideMid: mid };
}

export function fanTriangles(vertices: Vec[], fromIndex: number): Array<[Vec, Vec, Vec]> {
  const n = vertices.length;
  const origin = vertices[fromIndex]!;
  const triangles: Array<[Vec, Vec, Vec]> = [];
  for (let k = 1; k <= n - 2; k += 1) {
    const i = (fromIndex + k) % n;
    const j = (fromIndex + k + 1) % n;
    triangles.push([origin, vertices[i]!, vertices[j]!]);
  }
  return triangles;
}

export function fanDiagonals(vertices: Vec[], fromIndex: number): Array<[Vec, Vec]> {
  const n = vertices.length;
  const origin = vertices[fromIndex]!;
  const lines: Array<[Vec, Vec]> = [];
  for (let k = 2; k <= n - 2; k += 1) {
    lines.push([origin, vertices[(fromIndex + k) % n]!]);
  }
  return lines;
}

export function allDiagonals(vertices: Vec[]): Array<[number, number, Vec, Vec]> {
  const n = vertices.length;
  const lines: Array<[number, number, Vec, Vec]> = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 2; j < n; j += 1) {
      if (i === 0 && j === n - 1) continue;
      lines.push([i, j, vertices[i]!, vertices[j]!]);
    }
  }
  return lines;
}

export function interiorDiagonalIntersections(vertices: Vec[]): Vec[] {
  const diags = allDiagonals(vertices);
  const hits: Vec[] = [];
  for (let i = 0; i < diags.length; i += 1) {
    const a = diags[i]!;
    for (let j = i + 1; j < diags.length; j += 1) {
      const b = diags[j]!;
      const share = a[0] === b[0] || a[0] === b[1] || a[1] === b[0] || a[1] === b[1];
      if (share) continue;
      const hit = lineIntersection(a[2], a[3], b[2], b[3]);
      if (!hit) continue;
      if (hit.t > 1e-4 && hit.t < 1 - 1e-4 && hit.u > 1e-4 && hit.u < 1 - 1e-4) {
        hits.push(hit.point);
      }
    }
  }
  return hits;
}

export function shoelaceTable(vertices: Vec[]): Array<{
  label: string;
  x: number;
  y: number;
  xyNext: number;
  yxNext: number;
}> {
  return vertices.map((point, i) => {
    const next = vertices[(i + 1) % vertices.length]!;
    return {
      label: vertexLabel(i),
      x: point.x,
      y: point.y,
      xyNext: point.x * next.y,
      yxNext: point.y * next.x,
    };
  });
}

export type CompositeShape = {
  id: string;
  name: string;
  parts: Array<{ id: string; points: Vec[]; label: string }>;
};

export const COMPOSITE_PRESETS: CompositeShape[] = [
  {
    id: "l-shape",
    name: "L-shape",
    parts: [
      { id: "a", label: "6 × 2 rectangle", points: [vec(0, 0), vec(6, 0), vec(6, 2), vec(0, 2)] },
      { id: "b", label: "2 × 4 rectangle", points: [vec(0, 2), vec(2, 2), vec(2, 6), vec(0, 6)] },
    ],
  },
  {
    id: "house",
    name: "House",
    parts: [
      { id: "a", label: "6 × 4 rectangle", points: [vec(0, 0), vec(6, 0), vec(6, 4), vec(0, 4)] },
      { id: "b", label: "roof triangle", points: [vec(0, 4), vec(6, 4), vec(3, 7)] },
    ],
  },
  {
    id: "arrow",
    name: "Arrow",
    parts: [
      { id: "a", label: "shaft 5 × 2", points: [vec(0, 1.5), vec(5, 1.5), vec(5, 3.5), vec(0, 3.5)] },
      { id: "b", label: "head triangle", points: [vec(5, 0), vec(8, 2.5), vec(5, 5)] },
    ],
  },
  {
    id: "step",
    name: "Step",
    parts: [
      { id: "a", label: "lower 4 × 2", points: [vec(0, 0), vec(4, 0), vec(4, 2), vec(0, 2)] },
      { id: "b", label: "upper 4 × 2", points: [vec(4, 2), vec(8, 2), vec(8, 4), vec(4, 4)] },
    ],
  },
];

export function regularPolygonName(n: number): string {
  const names: Record<number, string> = {
    3: "triangle",
    4: "square",
    5: "pentagon",
    6: "hexagon",
    7: "heptagon",
    8: "octagon",
    9: "nonagon",
    10: "decagon",
    12: "dodecagon",
    20: "20-gon",
  };
  return names[sidesOf(n)] ?? `${sidesOf(n)}-gon`;
}
