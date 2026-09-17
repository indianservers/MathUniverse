export type Pt = { x: number; y: number };
export type TrianglePts = { A: Pt; B: Pt; C: Pt };
export type SideClass = "Scalene" | "Isosceles" | "Equilateral";
export type AngleClass = "Acute" | "Right" | "Obtuse";
export type CenterLocation = "inside" | "vertex" | "outside" | "hypotenuse midpoint";

const DEG = 180 / Math.PI;

export function dist(a: Pt, b: Pt) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a: Pt, b: Pt): Pt {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function add(a: Pt, b: Pt): Pt {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Pt, b: Pt): Pt {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(p: Pt, k: number): Pt {
  return { x: p.x * k, y: p.y * k };
}

export function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function rotateAround(p: Pt, origin: Pt, rad: number): Pt {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const v = sub(p, origin);
  return { x: origin.x + v.x * c - v.y * s, y: origin.y + v.x * s + v.y * c };
}

export function signedArea(A: Pt, B: Pt, C: Pt) {
  return (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2;
}

export function triangleArea(A: Pt, B: Pt, C: Pt) {
  return Math.abs(signedArea(A, B, C));
}

export function orientation(A: Pt, B: Pt, C: Pt) {
  const s = signedArea(A, B, C);
  if (s > 1e-9) return 1;
  if (s < -1e-9) return -1;
  return 0;
}

export function trianglePerimeter(A: Pt, B: Pt, C: Pt) {
  return dist(A, B) + dist(B, C) + dist(C, A);
}

export function angleAt(vertex: Pt, p: Pt, q: Pt) {
  const u = sub(p, vertex);
  const v = sub(q, vertex);
  const du = Math.hypot(u.x, u.y);
  const dv = Math.hypot(v.x, v.y);
  if (du < 1e-9 || dv < 1e-9) return 0;
  const cos = Math.min(1, Math.max(-1, (u.x * v.x + u.y * v.y) / (du * dv)));
  return Math.acos(cos) * DEG;
}

export function triangleAngles(A: Pt, B: Pt, C: Pt) {
  return {
    A: angleAt(A, B, C),
    B: angleAt(B, A, C),
    C: angleAt(C, A, B),
  };
}

export function triangleSides(A: Pt, B: Pt, C: Pt) {
  return { AB: dist(A, B), BC: dist(B, C), CA: dist(C, A) };
}

export function isTriangle(a: number, b: number, c: number, eps = 1e-9) {
  return a + b > c + eps && b + c > a + eps && c + a > b + eps && a > 0 && b > 0 && c > 0;
}

export function triangleInequality(a: number, b: number, c: number, eps = 1e-6) {
  const ab = a + b - c;
  const bc = b + c - a;
  const ca = c + a - b;
  const degenerate = Math.abs(ab) <= eps || Math.abs(bc) <= eps || Math.abs(ca) <= eps;
  const valid = ab > eps && bc > eps && ca > eps;
  return {
    ab: { left: a + b, right: c, ok: ab > eps, equal: Math.abs(ab) <= eps },
    bc: { left: b + c, right: a, ok: bc > eps, equal: Math.abs(bc) <= eps },
    ca: { left: c + a, right: b, ok: ca > eps, equal: Math.abs(ca) <= eps },
    valid,
    degenerate: degenerate && !valid,
  };
}

export function heronArea(a: number, b: number, c: number) {
  const s = (a + b + c) / 2;
  const v = s * (s - a) * (s - b) * (s - c);
  return { s, area: v <= 0 ? 0 : Math.sqrt(v) };
}

export function classifyBySides(a: number, b: number, c: number, rel = 0.03): SideClass {
  const mean = (a + b + c) / 3 || 1;
  const eq = (x: number, y: number) => Math.abs(x - y) <= rel * mean;
  if (eq(a, b) && eq(b, c)) return "Equilateral";
  if (eq(a, b) || eq(b, c) || eq(c, a)) return "Isosceles";
  return "Scalene";
}

export function classifyByAngles(angA: number, angB: number, angC: number, rightEps = 1.25): AngleClass {
  const angles = [angA, angB, angC];
  if (angles.some((value) => Math.abs(value - 90) <= rightEps)) return "Right";
  if (angles.some((value) => value > 90 + rightEps)) return "Obtuse";
  return "Acute";
}

export function projectionOnLine(p: Pt, a: Pt, b: Pt): Pt {
  const ab = sub(b, a);
  const len2 = ab.x * ab.x + ab.y * ab.y;
  if (len2 < 1e-12) return { ...a };
  const t = ((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / len2;
  return { x: a.x + t * ab.x, y: a.y + t * ab.y };
}

export function altitudeFoot(vertex: Pt, p: Pt, q: Pt) {
  return projectionOnLine(vertex, p, q);
}

export function lineIntersection(p1: Pt, d1: Pt, p2: Pt, d2: Pt): Pt | null {
  const det = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(det) < 1e-12) return null;
  const t = ((p2.x - p1.x) * d2.y - (p2.y - p1.y) * d2.x) / det;
  return { x: p1.x + t * d1.x, y: p1.y + t * d1.y };
}

export function perpendicularBisector(a: Pt, b: Pt) {
  const m = midpoint(a, b);
  const d = sub(b, a);
  return { point: m, dir: { x: -d.y, y: d.x } };
}

export function unit(p: Pt): Pt {
  const n = Math.hypot(p.x, p.y) || 1;
  return { x: p.x / n, y: p.y / n };
}

export function angleBisectorDir(vertex: Pt, p: Pt, q: Pt): Pt {
  return add(unit(sub(p, vertex)), unit(sub(q, vertex)));
}

export function centroid(A: Pt, B: Pt, C: Pt): Pt {
  return { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
}

export function circumcenter(A: Pt, B: Pt, C: Pt): Pt | null {
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  if (Math.abs(d) < 1e-10) return null;
  const a2 = A.x * A.x + A.y * A.y;
  const b2 = B.x * B.x + B.y * B.y;
  const c2 = C.x * C.x + C.y * C.y;
  return {
    x: (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d,
    y: (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d,
  };
}

export function incenter(A: Pt, B: Pt, C: Pt): Pt {
  const a = dist(B, C);
  const b = dist(A, C);
  const c = dist(A, B);
  const p = a + b + c;
  if (p < 1e-12) return centroid(A, B, C);
  return { x: (a * A.x + b * B.x + c * C.x) / p, y: (a * A.y + b * B.y + c * C.y) / p };
}

export function orthocenter(A: Pt, B: Pt, C: Pt): Pt | null {
  const footA = altitudeFoot(A, B, C);
  const footB = altitudeFoot(B, A, C);
  return lineIntersection(A, sub(footA, A), B, sub(footB, B));
}

export function inradius(A: Pt, B: Pt, C: Pt) {
  const s = trianglePerimeter(A, B, C) / 2;
  if (s < 1e-9) return 0;
  return triangleArea(A, B, C) / s;
}

export function circumradius(A: Pt, B: Pt, C: Pt) {
  const o = circumcenter(A, B, C);
  return o ? dist(o, A) : 0;
}

export function perpDistance(p: Pt, a: Pt, b: Pt) {
  return dist(p, projectionOnLine(p, a, b));
}

export function centerLocation(point: Pt, A: Pt, B: Pt, C: Pt, vertexHit = 0.12): CenterLocation {
  const vertices = [A, B, C];
  if (vertices.some((v) => dist(point, v) < vertexHit)) return "vertex";
  const o1 = orientation(A, B, point);
  const o2 = orientation(B, C, point);
  const o3 = orientation(C, A, point);
  const inside = (o1 >= 0 && o2 >= 0 && o3 >= 0) || (o1 <= 0 && o2 <= 0 && o3 <= 0);
  return inside ? "inside" : "outside";
}

export function circumcenterLocation(A: Pt, B: Pt, C: Pt): CenterLocation {
  const angles = triangleAngles(A, B, C);
  const cls = classifyByAngles(angles.A, angles.B, angles.C);
  if (cls === "Right") return "hypotenuse midpoint";
  if (cls === "Obtuse") return "outside";
  return "inside";
}

export function orthocenterLocation(A: Pt, B: Pt, C: Pt): CenterLocation {
  const angles = triangleAngles(A, B, C);
  const cls = classifyByAngles(angles.A, angles.B, angles.C);
  if (cls === "Right") return "vertex";
  if (cls === "Obtuse") return "outside";
  return "inside";
}

export function medianRatio(vertex: Pt, p: Pt, q: Pt, g: Pt) {
  const m = midpoint(p, q);
  const ag = dist(vertex, g);
  const gm = dist(g, m);
  return { midpoint: m, ag, gm, ratio: gm < 1e-9 ? Infinity : ag / gm };
}

export type ConstructedTriangle = TrianglePts & { ok: boolean };

export function constructSSS(a: number, b: number, c: number, origin: Pt, rotation = 0): ConstructedTriangle {
  const ok = isTriangle(a, b, c);
  const B = origin;
  const C = { x: origin.x + a, y: origin.y };
  const cosB = ok ? Math.min(1, Math.max(-1, (a * a + c * c - b * b) / (2 * a * c))) : 1;
  const ang = Math.acos(cosB);
  const A = { x: origin.x + c * Math.cos(ang), y: origin.y + c * Math.sin(ang) };
  return rotateTri({ A, B, C, ok }, origin, rotation);
}

export function constructSAS(ab: number, angleA: number, ac: number, origin: Pt, rotation = 0): ConstructedTriangle {
  const rad = (angleA * Math.PI) / 180;
  const A = origin;
  const B = { x: origin.x + ab, y: origin.y };
  const C = { x: origin.x + ac * Math.cos(rad), y: origin.y + ac * Math.sin(rad) };
  return rotateTri({ A, B, C, ok: ab > 0 && ac > 0 && angleA > 0 && angleA < 180 }, origin, rotation);
}

export function constructASAc(angleA: number, c: number, angleB: number, origin: Pt, rotation = 0): ConstructedTriangle {
  const angleC = 180 - angleA - angleB;
  const radA = (angleA * Math.PI) / 180;
  const ok = c > 0 && angleA > 0.5 && angleB > 0.5 && angleC > 0.5;
  const a = ok ? (c * Math.sin((angleC * Math.PI) / 180)) / Math.sin(radA) : c;
  return constructASA(angleB, a, angleC, origin, rotation);
}

export function constructASA(angleB: number, a: number, angleC: number, origin: Pt, rotation = 0): ConstructedTriangle {
  const angleA = 180 - angleB - angleC;
  const ok = a > 0 && angleA > 0.5 && angleB > 0.5 && angleC > 0.5;
  const B = origin;
  const C = { x: origin.x + a, y: origin.y };
  const radB = (angleB * Math.PI) / 180;
  const radC = (angleC * Math.PI) / 180;
  const A = lineIntersection(B, { x: Math.cos(radB), y: Math.sin(radB) }, C, { x: -Math.cos(radC), y: Math.sin(radC) }) ?? {
    x: origin.x + a / 2,
    y: origin.y + 1,
  };
  return rotateTri({ A, B, C, ok }, origin, rotation);
}

export function constructAAS(angleA: number, angleB: number, sideA: number, origin: Pt, rotation = 0): ConstructedTriangle {
  const angleC = 180 - angleA - angleB;
  const ok = sideA > 0 && angleA > 0.5 && angleB > 0.5 && angleC > 0.5;
  const sideC = ok ? (sideA * Math.sin((angleC * Math.PI) / 180)) / Math.sin((angleA * Math.PI) / 180) : sideA;
  return constructASA(angleB, sideC || 1, angleC, origin, rotation);
}

export function constructRHS(hyp: number, leg: number, origin: Pt, rotation = 0): ConstructedTriangle {
  const ok = hyp > leg && leg > 0;
  const other = ok ? Math.sqrt(Math.max(0, hyp * hyp - leg * leg)) : 0;
  const C = origin;
  const B = { x: origin.x + leg, y: origin.y };
  const A = { x: origin.x, y: origin.y + other };
  return rotateTri({ A, B, C, ok }, origin, rotation);
}

function rotateTri(tri: ConstructedTriangle, origin: Pt, rotation: number): ConstructedTriangle {
  if (!rotation) return tri;
  const rad = (rotation * Math.PI) / 180;
  return {
    A: rotateAround(tri.A, origin, rad),
    B: rotateAround(tri.B, origin, rad),
    C: rotateAround(tri.C, origin, rad),
    ok: tri.ok,
  };
}

export function ssaSolutions(angleA: number, a: number, b: number, origin: Pt): ConstructedTriangle[] {
  const rad = (angleA * Math.PI) / 180;
  const A = origin;
  const C = { x: origin.x + b * Math.cos(rad), y: origin.y + b * Math.sin(rad) };
  const cy2 = (C.y - origin.y) ** 2;
  const dx = C.x - origin.x;
  const disc = a * a - cy2;
  if (disc < -1e-8 || a <= 0 || b <= 0 || angleA <= 0 || angleA >= 180) return [];
  const root = Math.sqrt(Math.max(0, disc));
  const xs = [origin.x + dx - root, origin.x + dx + root].filter((x, i, arr) => i === arr.findIndex((v) => Math.abs(v - x) < 1e-6) && x > origin.x + 1e-6);
  return xs.map((x) => ({ A, B: { x, y: origin.y }, C, ok: true }));
}

export function scaleTriangle(tri: TrianglePts, k: number, anchor: Pt): TrianglePts {
  return {
    A: add(anchor, scale(sub(tri.A, anchor), k)),
    B: add(anchor, scale(sub(tri.B, anchor), k)),
    C: add(anchor, scale(sub(tri.C, anchor), k)),
  };
}

export function translateTriangle(tri: TrianglePts, v: Pt): TrianglePts {
  return { A: add(tri.A, v), B: add(tri.B, v), C: add(tri.C, v) };
}

export function rotateTriangle(tri: TrianglePts, origin: Pt, deg: number): TrianglePts {
  const rad = (deg * Math.PI) / 180;
  return { A: rotateAround(tri.A, origin, rad), B: rotateAround(tri.B, origin, rad), C: rotateAround(tri.C, origin, rad) };
}

export function sideRatios(p: TrianglePts, q: TrianglePts) {
  const s1 = triangleSides(p.A, p.B, p.C);
  const s2 = triangleSides(q.A, q.B, q.C);
  return {
    DE_AB: s1.AB < 1e-9 ? 0 : s2.AB / s1.AB,
    EF_BC: s1.BC < 1e-9 ? 0 : s2.BC / s1.BC,
    DF_AC: s1.CA < 1e-9 ? 0 : s2.CA / s1.CA,
  };
}

export function almostEqual(a: number, b: number, eps = 0.08) {
  return Math.abs(a - b) <= eps;
}

export function ranking(A: Pt, B: Pt, C: Pt) {
  const sides = [
    { name: "BC", len: dist(B, C), angle: "A" as const },
    { name: "AC", len: dist(A, C), angle: "B" as const },
    { name: "AB", len: dist(A, B), angle: "C" as const },
  ].sort((x, y) => y.len - x.len);
  return {
    longest: sides[0],
    middle: sides[1],
    shortest: sides[2],
  };
}

export type Plane = { ox: number; oy: number; unit: number; width: number; height: number };

export function defaultPlane(width = 720, height = 460): Plane {
  return { ox: 48, oy: height - 36, unit: 36, width, height };
}

export function toSvg(plane: Plane, p: Pt) {
  return { x: plane.ox + p.x * plane.unit, y: plane.oy - p.y * plane.unit };
}

export function fromSvg(plane: Plane, x: number, y: number): Pt {
  return { x: (x - plane.ox) / plane.unit, y: (plane.oy - y) / plane.unit };
}

export function clampPoint(p: Pt, minX = 0.4, maxX = 18.6, minY = 0.35, maxY = 11.4): Pt {
  return {
    x: Math.min(maxX, Math.max(minX, p.x)),
    y: Math.min(maxY, Math.max(minY, p.y)),
  };
}

export const EXPLORER_PRESETS: Record<string, TrianglePts> = {
  scalene: { A: { x: 2.2, y: 7.4 }, B: { x: 1.4, y: 1.3 }, C: { x: 9.6, y: 1.6 } },
  isosceles: { A: { x: 5.5, y: 8.4 }, B: { x: 1.6, y: 1.4 }, C: { x: 9.4, y: 1.4 } },
  equilateral: { A: { x: 5.5, y: 1.4 + (7 * Math.sqrt(3)) / 2 }, B: { x: 2, y: 1.4 }, C: { x: 9, y: 1.4 } },
  right: { A: { x: 1.8, y: 7.6 }, B: { x: 1.8, y: 1.4 }, C: { x: 9.2, y: 1.4 } },
  acute: { A: { x: 5.2, y: 8.1 }, B: { x: 2.2, y: 1.6 }, C: { x: 10.2, y: 2.1 } },
  obtuse: { A: { x: 3.2, y: 6.6 }, B: { x: 1.4, y: 1.6 }, C: { x: 11.2, y: 1.8 } },
};

export function measureTriangle(A: Pt, B: Pt, C: Pt) {
  const sides = triangleSides(A, B, C);
  const angles = triangleAngles(A, B, C);
  const area = triangleArea(A, B, C);
  const perimeter = sides.AB + sides.BC + sides.CA;
  const heron = heronArea(sides.BC, sides.CA, sides.AB);
  return {
    sides,
    angles,
    area,
    perimeter,
    semiperimeter: perimeter / 2,
    heron: heron.area,
    bySides: classifyBySides(sides.BC, sides.CA, sides.AB),
    byAngles: classifyByAngles(angles.A, angles.B, angles.C),
    angleSum: angles.A + angles.B + angles.C,
  };
}
