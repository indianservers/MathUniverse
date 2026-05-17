export type Point2D = { x: number; y: number };

export function linearY(x: number, m: number, c: number) {
  return m * x + c;
}

export function quadraticY(x: number, a: number, b: number, c: number) {
  return a * x * x + b * x + c;
}

export function quadraticRoots(a: number, b: number, c: number): [number, number] | null {
  if (a === 0) return b === 0 ? null : [-c / b, -c / b];
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;
  const sqrtD = Math.sqrt(discriminant);
  return [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)];
}

export function distance2D(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function triangleAreaFromPoints(p1: Point2D, p2: Point2D, p3: Point2D) {
  return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);
}

export function trianglePerimeter(p1: Point2D, p2: Point2D, p3: Point2D) {
  return distance2D(p1.x, p1.y, p2.x, p2.y) + distance2D(p2.x, p2.y, p3.x, p3.y) + distance2D(p3.x, p3.y, p1.x, p1.y);
}

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function roundTo(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
