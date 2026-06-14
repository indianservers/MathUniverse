export type CoordinatePoint = { x: number; y: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function distanceBetweenPoints(p1: CoordinatePoint, p2: CoordinatePoint) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function midpoint(p1: CoordinatePoint, p2: CoordinatePoint): CoordinatePoint {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

export function sectionPoint(p1: CoordinatePoint, p2: CoordinatePoint, m: number, n: number): CoordinatePoint {
  return { x: (m * p2.x + n * p1.x) / (m + n), y: (m * p2.y + n * p1.y) / (m + n) };
}

export function slope(p1: CoordinatePoint, p2: CoordinatePoint) {
  const run = p2.x - p1.x;
  if (Math.abs(run) < 0.0001) return undefined;
  return (p2.y - p1.y) / run;
}

export function lineFromSlopeIntercept(m: number, c: number) {
  return { m, c, equation: `y = ${formatNumber(m)}x ${c < 0 ? "-" : "+"} ${formatNumber(Math.abs(c))}` };
}

export function lineFromPointSlope(point: CoordinatePoint, m: number) {
  return { m, point, c: point.y - m * point.x };
}

export function perpendicularSlope(m: number) {
  if (Math.abs(m) < 0.0001) return undefined;
  return -1 / m;
}

export function areSlopesParallel(m1: number, m2: number) {
  return Math.abs(m1 - m2) < 0.0001;
}

export function areSlopesPerpendicular(m1: number, m2: number) {
  return Math.abs(m1 * m2 + 1) < 0.0001;
}

export function triangleAreaByCoordinates(a: CoordinatePoint, b: CoordinatePoint, c: CoordinatePoint) {
  return Math.abs(a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2;
}

export function circleEquationFromCenterRadius(center: CoordinatePoint, radius: number) {
  return `(x ${center.x < 0 ? "+" : "-"} ${formatNumber(Math.abs(center.x))})^2 + (y ${center.y < 0 ? "+" : "-"} ${formatNumber(Math.abs(center.y))})^2 = ${formatNumber(radius * radius)}`;
}

export function translatePoint(point: CoordinatePoint, dx: number, dy: number): CoordinatePoint {
  return { x: point.x + dx, y: point.y + dy };
}

export function reflectPointAcrossXAxis(point: CoordinatePoint): CoordinatePoint {
  return { x: point.x, y: -point.y };
}

export function reflectPointAcrossYAxis(point: CoordinatePoint): CoordinatePoint {
  return { x: -point.x, y: point.y };
}

export function reflectPointAcrossOrigin(point: CoordinatePoint): CoordinatePoint {
  return { x: -point.x, y: -point.y };
}

export function rotatePointAboutOrigin(point: CoordinatePoint, angleDegrees: number): CoordinatePoint {
  const radians = (angleDegrees * Math.PI) / 180;
  return { x: point.x * Math.cos(radians) - point.y * Math.sin(radians), y: point.x * Math.sin(radians) + point.y * Math.cos(radians) };
}

export function scalePointFromOrigin(point: CoordinatePoint, factor: number): CoordinatePoint {
  return { x: point.x * factor, y: point.y * factor };
}

export function coordinateToSvg(point: CoordinatePoint, origin = { x: 330, y: 285 }, unit = 28): CoordinatePoint {
  return { x: origin.x + point.x * unit, y: origin.y - point.y * unit };
}

export function svgToCoordinate(point: CoordinatePoint, origin = { x: 330, y: 285 }, unit = 28): CoordinatePoint {
  return { x: (point.x - origin.x) / unit, y: (origin.y - point.y) / unit };
}

export function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) < 0.0001) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function formatCoordinate(point: CoordinatePoint) {
  return `(${formatNumber(point.x)}, ${formatNumber(point.y)})`;
}

export function formatEquation(m: number | undefined, c: number) {
  if (m === undefined) return "x = constant";
  return `y = ${formatNumber(m)}x ${c < 0 ? "-" : "+"} ${formatNumber(Math.abs(c))}`;
}
