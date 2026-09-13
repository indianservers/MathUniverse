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

export function dist(a: Vec, b: Vec): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function length(a: Vec): number {
  return Math.hypot(a.x, a.y);
}

export function midpoint(a: Vec, b: Vec): Vec {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function normalize(a: Vec): Vec {
  const len = length(a);
  if (len < 1e-12) return { x: 1, y: 0 };
  return { x: a.x / len, y: a.y / len };
}

export function perp(a: Vec): Vec {
  return { x: -a.y, y: a.x };
}

export function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function normalizeAngle(rad: number): number {
  let value = rad % TAU;
  if (value < 0) value += TAU;
  return value;
}

export function normalizeDeg(deg: number): number {
  let value = deg % 360;
  if (value < 0) value += 360;
  return value;
}

export function shortestDeltaDeg(from: number, to: number): number {
  let delta = normalizeDeg(to - from);
  if (delta > 180) delta -= 360;
  return delta;
}

export function minorArcDeg(a: number, b: number): number {
  return Math.min(normalizeDeg(b - a), normalizeDeg(a - b));
}

export function angleOf(p: Vec, origin: Vec = { x: 0, y: 0 }): number {
  return Math.atan2(p.y - origin.y, p.x - origin.x);
}

export function angleBetween(a: Vec, vertex: Vec, b: Vec): number {
  const u = normalize(sub(a, vertex));
  const v = normalize(sub(b, vertex));
  return Math.acos(clamp(dot(u, v), -1, 1));
}

export function signedAngle(a: Vec, vertex: Vec, b: Vec): number {
  const u = sub(a, vertex);
  const v = sub(b, vertex);
  return Math.atan2(u.x * v.y - u.y * v.x, dot(u, v));
}

export function pointOnCircle(center: Vec, radius: number, angleRad: number): Vec {
  return {
    x: center.x + radius * Math.cos(angleRad),
    y: center.y + radius * Math.sin(angleRad),
  };
}

export function chordLengthFromDistance(radius: number, distance: number): number {
  const d = clamp(Math.abs(distance), 0, radius);
  return 2 * Math.sqrt(Math.max(0, radius * radius - d * d));
}

export function chordLengthFromCentral(radius: number, thetaRad: number): number {
  return 2 * radius * Math.sin(Math.abs(thetaRad) / 2);
}

export function distanceFromCenterToChord(a: Vec, b: Vec, origin: Vec): number {
  const m = midpoint(a, b);
  return dist(origin, m);
}

export function circumference(radius: number): number {
  return TAU * radius;
}

export function circleArea(radius: number): number {
  return Math.PI * radius * radius;
}

export function arcLength(radius: number, thetaDeg: number): number {
  return (Math.abs(thetaDeg) / 360) * circumference(radius);
}

export function sectorArea(radius: number, thetaDeg: number): number {
  return (Math.abs(thetaDeg) / 360) * circleArea(radius);
}

export function segmentArea(radius: number, thetaDeg: number): number {
  const theta = toRad(Math.abs(thetaDeg));
  return 0.5 * radius * radius * (theta - Math.sin(theta));
}

export function tangentLength(radius: number, op: number): number {
  const d = Math.abs(op);
  if (d <= radius) return 0;
  return Math.sqrt(d * d - radius * radius);
}

export function powerOfPoint(origin: Vec, radius: number, p: Vec): number {
  const d2 = dist(origin, p) ** 2;
  return d2 - radius * radius;
}

/** Intersections of line through `a` and `b` with circle (origin, r). */
export function lineCircleIntersection(a: Vec, b: Vec, origin: Vec, radius: number): Vec[] {
  const d = sub(b, a);
  const f = sub(a, origin);
  const A = dot(d, d);
  if (A < 1e-12) return [];
  const B = 2 * dot(f, d);
  const C = dot(f, f) - radius * radius;
  const disc = B * B - 4 * A * C;
  if (disc < -1e-10) return [];
  const sqrt = Math.sqrt(Math.max(0, disc));
  const t1 = (-B - sqrt) / (2 * A);
  const t2 = (-B + sqrt) / (2 * A);
  const points = [add(a, scale(d, t1))];
  if (sqrt > 1e-10) points.push(add(a, scale(d, t2)));
  return points;
}

export function chordThroughPoint(origin: Vec, radius: number, p: Vec, directionRad: number): { a: Vec; b: Vec; pa: number; pb: number } | null {
  const u = { x: Math.cos(directionRad), y: Math.sin(directionRad) };
  const hits = lineCircleIntersection(p, add(p, u), origin, radius);
  if (hits.length < 2) return null;
  const [a, b] = hits;
  return { a, b, pa: dist(p, a), pb: dist(p, b) };
}

/** Contact points of tangents from an external point to a circle. */
export function tangentContactPoints(origin: Vec, radius: number, p: Vec): Vec[] {
  const rel = sub(p, origin);
  const d2 = dot(rel, rel);
  if (d2 <= radius * radius + 1e-10) return [];
  const a = (radius * radius) / d2;
  const h = (radius * Math.sqrt(d2 - radius * radius)) / d2;
  const perpRel = perp(rel);
  return [
    add(origin, add(scale(rel, a), scale(perpRel, h))),
    add(origin, sub(scale(rel, a), scale(perpRel, h))),
  ];
}

export function projectToCircle(origin: Vec, radius: number, p: Vec): Vec {
  const dir = normalize(sub(p, origin));
  return add(origin, scale(dir, radius));
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  const factor = 10 ** digits;
  return String(Math.round(n * factor) / factor);
}

export function nearlyEqual(a: number, b: number, tol = 0.08): boolean {
  return Math.abs(a - b) <= tol;
}
