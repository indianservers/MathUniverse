export type KernelPoint = { x: number; y: number };
export type KernelLine = { kind: "line"; a: KernelPoint; b: KernelPoint };
export type KernelSegment = { kind: "segment"; a: KernelPoint; b: KernelPoint };
export type KernelRay = { kind: "ray"; a: KernelPoint; b: KernelPoint };
export type KernelVector = { kind: "vector"; x: number; y: number };
export type KernelCircle = { kind: "circle"; center: KernelPoint; radius: number };
export type KernelConic = {
  kind: "conic";
  type: "circle" | "ellipse" | "parabola" | "hyperbola" | "general";
  // Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0
  coefficients: [number, number, number, number, number, number];
};
export type KernelLinearObject = KernelLine | KernelSegment | KernelRay;
export type KernelObject = KernelLinearObject | KernelCircle | KernelConic;

export type KernelIntersection = KernelPoint & {
  multiplicity: 1 | 2;
  onBoundary: boolean;
  source: "line-line" | "line-circle" | "circle-circle" | "line-conic" | "conic-conic";
};

export type RelationResult = {
  relation: "parallel" | "perpendicular" | "equal-length" | "incident" | "tangent" | "intersecting" | "none";
  confidence: number;
  detail: string;
};

const EPS = 1e-7;

export function point(x: number, y: number): KernelPoint {
  return { x, y };
}

export function line(a: KernelPoint, b: KernelPoint): KernelLine {
  return { kind: "line", a, b };
}

export function segment(a: KernelPoint, b: KernelPoint): KernelSegment {
  return { kind: "segment", a, b };
}

export function ray(a: KernelPoint, b: KernelPoint): KernelRay {
  return { kind: "ray", a, b };
}

export function vector(a: KernelPoint, b: KernelPoint): KernelVector {
  return { kind: "vector", x: b.x - a.x, y: b.y - a.y };
}

export function circle(center: KernelPoint, radius: number): KernelCircle {
  return { kind: "circle", center, radius: Math.abs(radius) };
}

export function conic(coefficients: [number, number, number, number, number, number]): KernelConic {
  const [a, b, c] = coefficients;
  const discriminant = b * b - 4 * a * c;
  let type: KernelConic["type"] = "general";
  if (Math.abs(b) < EPS && Math.abs(a - c) < EPS && Math.abs(a) > EPS) type = "circle";
  else if (discriminant < -EPS) type = "ellipse";
  else if (Math.abs(discriminant) <= EPS) type = "parabola";
  else if (discriminant > EPS) type = "hyperbola";
  return { kind: "conic", type, coefficients };
}

export function parseKernelPoint(value: string): KernelPoint | null {
  const match = value.match(/\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/);
  return match ? point(Number(match[1]), Number(match[2])) : null;
}

export function parseConicEquation(value: string): KernelConic | null {
  const compact = value.replace(/\s+/g, "").toLowerCase();
  const ellipse = compact.match(/^x\^2\/(\d+(?:\.\d+)?)\+y\^2\/(\d+(?:\.\d+)?)=1$/);
  if (ellipse) return conic([1 / Number(ellipse[1]), 0, 1 / Number(ellipse[2]), 0, 0, -1]);
  const circleEquation = compact.match(/^x\^2\+y\^2=(\d+(?:\.\d+)?)$/);
  if (circleEquation) return conic([1, 0, 1, 0, 0, -Number(circleEquation[1])]);
  const parabola = compact.match(/^y=([-+]?\d*\.?\d*)\*?x\^2$/);
  if (parabola) {
    const a = coefficient(parabola[1]);
    return conic([a, 0, 0, 0, -1, 0]);
  }
  return null;
}

export function distanceBetween(a: KernelPoint, b: KernelPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a: KernelPoint, b: KernelPoint): KernelPoint {
  return point((a.x + b.x) / 2, (a.y + b.y) / 2);
}

export function slope(object: KernelLinearObject) {
  const dx = object.b.x - object.a.x;
  if (Math.abs(dx) < EPS) return Infinity;
  return (object.b.y - object.a.y) / dx;
}

export function lineEquation(object: KernelLinearObject) {
  const a = object.b.y - object.a.y;
  const b = object.a.x - object.b.x;
  const c = -(a * object.a.x + b * object.a.y);
  return { a, b, c };
}

export function intersectObjects(first: KernelObject, second: KernelObject): KernelIntersection[] {
  if (isLinear(first) && isLinear(second)) return intersectLinearLinear(first, second);
  if (isLinear(first) && second.kind === "circle") return intersectLinearCircle(first, second);
  if (first.kind === "circle" && isLinear(second)) return intersectLinearCircle(second, first);
  if (first.kind === "circle" && second.kind === "circle") return intersectCircleCircle(first, second);
  if (isLinear(first) && second.kind === "conic") return intersectLinearConic(first, second);
  if (first.kind === "conic" && isLinear(second)) return intersectLinearConic(second, first);
  if (first.kind === "conic" && second.kind === "conic") return intersectConicConic(first, second);
  if (first.kind === "circle" && second.kind === "conic") return intersectConicConic(circleAsConic(first), second);
  if (first.kind === "conic" && second.kind === "circle") return intersectConicConic(first, circleAsConic(second));
  return [];
}

export function relationBetween(first: KernelObject, second: KernelObject): RelationResult {
  if (isLinear(first) && isLinear(second)) {
    const v1 = vector(first.a, first.b);
    const v2 = vector(second.a, second.b);
    const dot = v1.x * v2.x + v1.y * v2.y;
    const cross = v1.x * v2.y - v1.y * v2.x;
    if (Math.abs(cross) < 1e-5) return { relation: "parallel", confidence: 1, detail: "Direction vectors are scalar multiples." };
    if (Math.abs(dot) < 1e-5) return { relation: "perpendicular", confidence: 1, detail: "Direction vectors have dot product 0." };
    return { relation: "intersecting", confidence: 0.9, detail: "Lines are neither parallel nor perpendicular." };
  }
  const intersections = intersectObjects(first, second);
  if (intersections.some((item) => item.multiplicity === 2)) return { relation: "tangent", confidence: 0.95, detail: "Intersection has multiplicity 2." };
  if (intersections.length) return { relation: "intersecting", confidence: 0.9, detail: `${intersections.length} intersection point${intersections.length === 1 ? "" : "s"} found.` };
  return { relation: "none", confidence: 0.7, detail: "No supported relation found." };
}

export function polygonArea(points: KernelPoint[]) {
  return Math.abs(points.reduce((sum, item, index) => {
    const next = points[(index + 1) % points.length];
    return sum + item.x * next.y - next.x * item.y;
  }, 0)) / 2;
}

export function polygonPerimeter(points: KernelPoint[]) {
  return points.reduce((sum, item, index) => sum + distanceBetween(item, points[(index + 1) % points.length]), 0);
}

export function proofHintsForRelation(result: RelationResult) {
  const hints: Record<RelationResult["relation"], string[]> = {
    parallel: ["Compare slopes.", "Or compare direction vectors.", "Parallel lines keep a constant distance apart."],
    perpendicular: ["Compute the dot product.", "Or check whether slopes multiply to -1.", "A right-angle marker can be shown at the intersection."],
    "equal-length": ["Measure both segments.", "Compare squared lengths to avoid rounding."],
    incident: ["Substitute the point into the object equation.", "A zero residual means the point lies on the object."],
    tangent: ["A tangent touches with one double intersection.", "Radius to tangent point is perpendicular to the tangent."],
    intersecting: ["Solve both equations together.", "Each intersection satisfies both objects."],
    none: ["Try another object pair.", "The current pair has no supported exact relation."],
  };
  return hints[result.relation];
}

function intersectLinearLinear(first: KernelLinearObject, second: KernelLinearObject): KernelIntersection[] {
  const denominator = (first.a.x - first.b.x) * (second.a.y - second.b.y) - (first.a.y - first.b.y) * (second.a.x - second.b.x);
  if (Math.abs(denominator) < EPS) return [];
  const x = ((first.a.x * first.b.y - first.a.y * first.b.x) * (second.a.x - second.b.x) - (first.a.x - first.b.x) * (second.a.x * second.b.y - second.a.y * second.b.x)) / denominator;
  const y = ((first.a.x * first.b.y - first.a.y * first.b.x) * (second.a.y - second.b.y) - (first.a.y - first.b.y) * (second.a.x * second.b.y - second.a.y * second.b.x)) / denominator;
  const hit = point(x, y);
  if (!pointOnLinear(first, hit) || !pointOnLinear(second, hit)) return [];
  return [{ ...hit, multiplicity: 1, onBoundary: onAnyEndpoint([first, second], hit), source: "line-line" }];
}

function intersectLinearCircle(object: KernelLinearObject, item: KernelCircle): KernelIntersection[] {
  const dx = object.b.x - object.a.x;
  const dy = object.b.y - object.a.y;
  const fx = object.a.x - item.center.x;
  const fy = object.a.y - item.center.y;
  const qa = dx * dx + dy * dy;
  const qb = 2 * (fx * dx + fy * dy);
  const qc = fx * fx + fy * fy - item.radius * item.radius;
  const discriminant = qb * qb - 4 * qa * qc;
  if (discriminant < -EPS) return [];
  const root = Math.sqrt(Math.max(0, discriminant));
  return uniquePoints([(-qb - root) / (2 * qa), (-qb + root) / (2 * qa)]
    .map((t) => point(object.a.x + t * dx, object.a.y + t * dy))
    .filter((hit) => pointOnLinear(object, hit)))
    .map((hit) => ({ ...hit, multiplicity: Math.abs(discriminant) < EPS ? 2 : 1, onBoundary: onAnyEndpoint([object], hit), source: "line-circle" as const }));
}

function intersectCircleCircle(first: KernelCircle, second: KernelCircle): KernelIntersection[] {
  const d = distanceBetween(first.center, second.center);
  if (d > first.radius + second.radius + EPS || d < Math.abs(first.radius - second.radius) - EPS || d < EPS) return [];
  const a = (first.radius ** 2 - second.radius ** 2 + d ** 2) / (2 * d);
  const hSquared = first.radius ** 2 - a ** 2;
  const h = Math.sqrt(Math.max(0, hSquared));
  const x = first.center.x + (a * (second.center.x - first.center.x)) / d;
  const y = first.center.y + (a * (second.center.y - first.center.y)) / d;
  const rx = -(second.center.y - first.center.y) * (h / d);
  const ry = (second.center.x - first.center.x) * (h / d);
  return uniquePoints([point(x + rx, y + ry), point(x - rx, y - ry)])
    .map((hit) => ({ ...hit, multiplicity: Math.abs(hSquared) < EPS ? 2 : 1, onBoundary: false, source: "circle-circle" as const }));
}

function intersectLinearConic(object: KernelLinearObject, item: KernelConic): KernelIntersection[] {
  const dx = object.b.x - object.a.x;
  const dy = object.b.y - object.a.y;
  const [a, b, c, d, e, f] = item.coefficients;
  const qa = a * dx * dx + b * dx * dy + c * dy * dy;
  const qb = 2 * a * object.a.x * dx + b * (object.a.x * dy + object.a.y * dx) + 2 * c * object.a.y * dy + d * dx + e * dy;
  const qc = a * object.a.x ** 2 + b * object.a.x * object.a.y + c * object.a.y ** 2 + d * object.a.x + e * object.a.y + f;
  const roots = solveQuadratic(qa, qb, qc);
  return uniquePoints(roots.map((t) => point(object.a.x + t * dx, object.a.y + t * dy)).filter((hit) => pointOnLinear(object, hit)))
    .map((hit) => ({ ...hit, multiplicity: roots.length === 1 ? 2 : 1, onBoundary: onAnyEndpoint([object], hit), source: "line-conic" as const }));
}

function intersectConicConic(first: KernelConic, second: KernelConic): KernelIntersection[] {
  // Browser-only pragmatic numeric pass: scan x, solve both conics for y, and dedupe.
  const hits: KernelPoint[] = [];
  for (let x = -20; x <= 20; x += 0.025) {
    const yValues = solveConicForY(first, x);
    for (const y of yValues) {
      if (Math.abs(evaluateConic(second, point(x, y))) < 0.035) hits.push(point(x, y));
    }
  }
  return uniquePoints(hits, 0.15).slice(0, 8).map((hit) => ({ ...hit, multiplicity: 1, onBoundary: false, source: "conic-conic" as const }));
}

function solveConicForY(item: KernelConic, x: number) {
  const [a, b, c, d, e, f] = item.coefficients;
  return solveQuadratic(c, b * x + e, a * x * x + d * x + f);
}

function evaluateConic(item: KernelConic, p: KernelPoint) {
  const [a, b, c, d, e, f] = item.coefficients;
  return a * p.x ** 2 + b * p.x * p.y + c * p.y ** 2 + d * p.x + e * p.y + f;
}

function solveQuadratic(a: number, b: number, c: number) {
  if (Math.abs(a) < EPS) return Math.abs(b) < EPS ? [] : [-c / b];
  const discriminant = b * b - 4 * a * c;
  if (discriminant < -EPS) return [];
  if (Math.abs(discriminant) < EPS) return [-b / (2 * a)];
  const root = Math.sqrt(discriminant);
  return [(-b - root) / (2 * a), (-b + root) / (2 * a)];
}

function pointOnLinear(object: KernelLinearObject, p: KernelPoint) {
  const total = distanceBetween(object.a, object.b);
  if (object.kind === "line") return true;
  if (object.kind === "segment") return distanceBetween(object.a, p) + distanceBetween(p, object.b) <= total + 1e-5;
  const direction = vector(object.a, object.b);
  const toPoint = vector(object.a, p);
  return direction.x * toPoint.x + direction.y * toPoint.y >= -EPS;
}

function isLinear(object: KernelObject): object is KernelLinearObject {
  return object.kind === "line" || object.kind === "segment" || object.kind === "ray";
}

function onAnyEndpoint(objects: KernelLinearObject[], p: KernelPoint) {
  return objects.some((object) => distanceBetween(object.a, p) < 1e-5 || distanceBetween(object.b, p) < 1e-5);
}

function circleAsConic(item: KernelCircle) {
  const { x, y } = item.center;
  return conic([1, 0, 1, -2 * x, -2 * y, x * x + y * y - item.radius * item.radius]);
}

function uniquePoints(points: KernelPoint[], tolerance = 1e-6) {
  return points.filter((item, index) => points.findIndex((other) => distanceBetween(item, other) < tolerance) === index);
}

function coefficient(raw: string) {
  if (!raw || raw === "+") return 1;
  if (raw === "-") return -1;
  return Number(raw);
}
