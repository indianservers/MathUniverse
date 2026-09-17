export type Vec = { x: number; y: number };
export type LineGeom = { origin: Vec; dir: Vec };
export type CircleGeom = { center: Vec; r: number };

export const EPS = 1e-8;
export const REL_EPS = 1e-4;

export function dist(a: Vec, b: Vec) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a: Vec, b: Vec): Vec {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function scale(a: Vec, k: number): Vec {
  return { x: a.x * k, y: a.y * k };
}

export function dot(a: Vec, b: Vec) {
  return a.x * b.x + a.y * b.y;
}

export function len(a: Vec) {
  return Math.hypot(a.x, a.y);
}

export function norm(a: Vec): Vec | null {
  const l = len(a);
  if (l < EPS) return null;
  return { x: a.x / l, y: a.y / l };
}

export function perp(a: Vec): Vec {
  return { x: -a.y, y: a.x };
}

export function nearly(a: number, b: number, tol = REL_EPS) {
  return Math.abs(a - b) <= Math.max(tol, tol * Math.max(Math.abs(a), Math.abs(b)));
}

export function snapTo(n: number, spacing: number) {
  if (spacing <= 0) return n;
  return Math.round(n / spacing) * spacing;
}

export function lineFromPoints(a: Vec, b: Vec): LineGeom | null {
  const d = norm(sub(b, a));
  if (!d) return null;
  return { origin: a, dir: d };
}

export function projectPointToLine(p: Vec, line: LineGeom): Vec {
  const t = dot(sub(p, line.origin), line.dir);
  return add(line.origin, scale(line.dir, t));
}

export function pointOnLine(p: Vec, line: LineGeom, tol = REL_EPS) {
  return dist(p, projectPointToLine(p, line)) <= tol;
}

export function pointOnSegment(p: Vec, a: Vec, b: Vec, tol = REL_EPS) {
  const ab = dist(a, b);
  if (ab < EPS) return dist(p, a) <= tol;
  const t = dot(sub(p, a), sub(b, a)) / (ab * ab);
  if (t < -tol || t > 1 + tol) return false;
  return dist(p, add(a, scale(sub(b, a), Math.min(1, Math.max(0, t))))) <= tol;
}

export function pointOnCircle(p: Vec, circle: CircleGeom, tol = REL_EPS) {
  return nearly(dist(p, circle.center), circle.r, tol);
}

export function lineIntersection(l1: LineGeom, l2: LineGeom): Vec | null {
  const det = l1.dir.x * l2.dir.y - l1.dir.y * l2.dir.x;
  if (Math.abs(det) < EPS) return null;
  const d = sub(l2.origin, l1.origin);
  const t = (d.x * l2.dir.y - d.y * l2.dir.x) / det;
  return add(l1.origin, scale(l1.dir, t));
}

export function lineCircleIntersection(line: LineGeom, circle: CircleGeom): Vec[] {
  const f = sub(line.origin, circle.center);
  const a = 1;
  const b = 2 * dot(f, line.dir);
  const c = dot(f, f) - circle.r * circle.r;
  const disc = b * b - 4 * a * c;
  if (disc < -EPS) return [];
  if (Math.abs(disc) <= EPS) return [add(line.origin, scale(line.dir, -b / 2))];
  const s = Math.sqrt(Math.max(0, disc));
  return [
    add(line.origin, scale(line.dir, (-b - s) / 2)),
    add(line.origin, scale(line.dir, (-b + s) / 2)),
  ];
}

export function circleCircleIntersection(c1: CircleGeom, c2: CircleGeom): Vec[] {
  const d = dist(c1.center, c2.center);
  if (d < EPS) return [];
  if (d > c1.r + c2.r + EPS) return [];
  if (d < Math.abs(c1.r - c2.r) - EPS) return [];
  const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
  const h2 = c1.r * c1.r - a * a;
  const mid = add(c1.center, scale(sub(c2.center, c1.center), a / d));
  if (h2 < EPS) return [mid];
  const h = Math.sqrt(Math.max(0, h2));
  const n = scale(perp(sub(c2.center, c1.center)), h / d);
  return [add(mid, n), sub(mid, n)];
}

export function perpendicularLineThrough(p: Vec, line: LineGeom): LineGeom {
  return { origin: p, dir: norm(perp(line.dir)) ?? { x: 0, y: 1 } };
}

export function parallelLineThrough(p: Vec, line: LineGeom): LineGeom {
  return { origin: p, dir: line.dir };
}

export function perpendicularBisector(a: Vec, b: Vec): LineGeom | null {
  const d = sub(b, a);
  const n = norm(perp(d));
  if (!n) return null;
  return { origin: midpoint(a, b), dir: n };
}

export function angleBisector(a: Vec, vertex: Vec, c: Vec): LineGeom | null {
  const u = norm(sub(a, vertex));
  const v = norm(sub(c, vertex));
  if (!u || !v) return null;
  const s = add(u, v);
  const d = norm(s) ?? perp(u);
  return { origin: vertex, dir: d };
}

export function angleAt(a: Vec, vertex: Vec, c: Vec) {
  const u = sub(a, vertex);
  const v = sub(c, vertex);
  const lu = len(u);
  const lv = len(v);
  if (lu < EPS || lv < EPS) return NaN;
  const cos = Math.min(1, Math.max(-1, dot(u, v) / (lu * lv)));
  return (Math.acos(cos) * 180) / Math.PI;
}

export function areCollinear(a: Vec, b: Vec, c: Vec, tol = REL_EPS) {
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
  return area <= tol * Math.max(1, dist(a, b), dist(a, c));
}

export function isParallel(l1: LineGeom, l2: LineGeom, tol = REL_EPS) {
  return Math.abs(l1.dir.x * l2.dir.y - l1.dir.y * l2.dir.x) <= tol;
}

export function isPerpendicular(l1: LineGeom, l2: LineGeom, tol = REL_EPS) {
  return Math.abs(dot(l1.dir, l2.dir)) <= tol;
}

export function areEqualLength(a: Vec, b: Vec, c: Vec, d: Vec, tol = REL_EPS) {
  return nearly(dist(a, b), dist(c, d), tol);
}

export function centroid(points: Vec[]): Vec | null {
  if (!points.length) return null;
  const s = points.reduce((acc, p) => add(acc, p), { x: 0, y: 0 });
  return scale(s, 1 / points.length);
}

export function circumcenter(a: Vec, b: Vec, c: Vec): Vec | null {
  const l1 = perpendicularBisector(a, b);
  const l2 = perpendicularBisector(b, c);
  if (!l1 || !l2) return null;
  return lineIntersection(l1, l2);
}

export function incenter(a: Vec, b: Vec, c: Vec): Vec | null {
  const la = dist(b, c);
  const lb = dist(a, c);
  const lc = dist(a, b);
  const p = la + lb + lc;
  if (p < EPS) return null;
  return {
    x: (la * a.x + lb * b.x + lc * c.x) / p,
    y: (la * a.y + lb * b.y + lc * c.y) / p,
  };
}

export function orthocenter(a: Vec, b: Vec, c: Vec): Vec | null {
  const ab = lineFromPoints(a, b);
  const ac = lineFromPoints(a, c);
  if (!ab || !ac) return null;
  const hB = perpendicularLineThrough(b, ac);
  const hC = perpendicularLineThrough(c, ab);
  return lineIntersection(hB, hC);
}

export function polygonArea(points: Vec[]) {
  if (points.length < 3) return 0;
  return Math.abs(
    points.reduce((sum, p, i) => {
      const n = points[(i + 1) % points.length]!;
      return sum + p.x * n.y - n.x * p.y;
    }, 0) / 2,
  );
}

export function polygonPerimeter(points: Vec[]) {
  return points.reduce((sum, p, i) => sum + dist(p, points[(i + 1) % points.length]!), 0);
}

export function rotateAround(p: Vec, center: Vec, degrees: number): Vec {
  const rad = (degrees * Math.PI) / 180;
  const v = sub(p, center);
  return add(center, {
    x: v.x * Math.cos(rad) - v.y * Math.sin(rad),
    y: v.x * Math.sin(rad) + v.y * Math.cos(rad),
  });
}

export function reflectOverLine(p: Vec, line: LineGeom): Vec {
  const q = projectPointToLine(p, line);
  return add(q, sub(q, p));
}

export function dilate(p: Vec, center: Vec, k: number): Vec {
  return add(center, scale(sub(p, center), k));
}

export function clipLineToBox(line: LineGeom, box: { x0: number; y0: number; x1: number; y1: number }): [Vec, Vec] | null {
  const pts: Vec[] = [];
  const edges: LineGeom[] = [
    { origin: { x: box.x0, y: box.y0 }, dir: { x: 1, y: 0 } },
    { origin: { x: box.x0, y: box.y1 }, dir: { x: 1, y: 0 } },
    { origin: { x: box.x0, y: box.y0 }, dir: { x: 0, y: 1 } },
    { origin: { x: box.x1, y: box.y0 }, dir: { x: 0, y: 1 } },
  ];
  for (const edge of edges) {
    const hit = lineIntersection(line, edge);
    if (!hit) continue;
    if (hit.x >= box.x0 - EPS && hit.x <= box.x1 + EPS && hit.y >= box.y0 - EPS && hit.y <= box.y1 + EPS) {
      if (!pts.some((p) => dist(p, hit) < 1e-6)) pts.push(hit);
    }
  }
  if (pts.length < 2) {
    const far = 40;
    return [add(line.origin, scale(line.dir, -far)), add(line.origin, scale(line.dir, far))];
  }
  pts.sort((a, b) => dot(a, line.dir) - dot(b, line.dir));
  return [pts[0]!, pts[pts.length - 1]!];
}

export function fmtDec(n: number, digits = 3) {
  if (!Number.isFinite(n)) return "undefined";
  const v = Math.round(n * 10 ** digits) / 10 ** digits;
  return String(v);
}

export function fmtExact(n: number): string | null {
  if (!Number.isFinite(n)) return null;
  if (nearly(n, Math.round(n), 1e-8)) return String(Math.round(n));
  for (const root of [2, 3, 5]) {
    const k = n / Math.sqrt(root);
    if (nearly(k, Math.round(k * 4) / 4, 1e-6)) {
      const q = Math.round(k * 4) / 4;
      if (nearly(q, 1)) return `√${root}`;
      if (nearly(q, -1)) return `−√${root}`;
      return `${fmtDec(q, 2)}√${root}`;
    }
  }
  for (let den = 2; den <= 12; den += 1) {
    const num = Math.round(n * den);
    if (nearly(n, num / den, 1e-8)) return `${num}/${den}`;
  }
  return null;
}

export function fmtMeasure(n: number, mode: "decimal" | "exact" | "both") {
  const exact = fmtExact(n);
  const dec = fmtDec(n, 4);
  if (mode === "exact") return exact ?? dec;
  if (mode === "both" && exact && exact !== dec) return `${exact}  ≈ ${dec}`;
  return dec;
}

export function fmtAngle(deg: number, unit: "deg" | "rad", mode: "decimal" | "exact" | "both") {
  if (!Number.isFinite(deg)) return "undefined";
  if (unit === "rad") {
    const rad = (deg * Math.PI) / 180;
    return mode === "exact" && nearly(deg, 45) ? "π/4" : fmtDec(rad, 4);
  }
  const exact = nearly(deg, Math.round(deg), 1e-6) ? `${Math.round(deg)}°` : `${fmtDec(deg, 2)}°`;
  if (mode === "both" && exact.endsWith("°") && !Number.isInteger(deg)) return `${exact}  ≈ ${fmtDec(deg, 2)}°`;
  return exact;
}
