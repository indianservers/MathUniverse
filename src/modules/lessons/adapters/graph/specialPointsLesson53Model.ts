export type Quadratic53 = {
  id: string;
  label: string;
  a: number;
  b: number;
  c: number;
};

export type Line53 = { id: string; label: string; m: number; b: number };
export type Point53 = { x: number; y: number };
export type Bounds53 = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const QUADRATICS_53: Quadratic53[] = [
  { id: "q1", label: "f(x) = x² - 2x - 3", a: 1, b: -2, c: -3 },
  { id: "q2", label: "f(x) = x² - 4", a: 1, b: 0, c: -4 },
  { id: "q3", label: "f(x) = -x² + 4", a: -1, b: 0, c: 4 },
];

export const LINES_53: Line53[] = [
  { id: "l1", label: "g(x) = x - 1", m: 1, b: -1 },
  { id: "l2", label: "g(x) = 0.5x + 1", m: 0.5, b: 1 },
  { id: "l3", label: "g(x) = -x + 2", m: -1, b: 2 },
];

export const FULL_BOUNDS_53: Bounds53 = {
  xMin: -6.5,
  xMax: 7,
  yMin: -6,
  yMax: 4.25,
};
export const FIT_BOUNDS_53: Bounds53 = {
  xMin: -4.5,
  xMax: 5,
  yMin: -5,
  yMax: 4.5,
};

export function quadraticValue53(q: Quadratic53, x: number) {
  return q.a * x * x + q.b * x + q.c;
}

export function lineValue53(line: Line53, x: number) {
  return line.m * x + line.b;
}

function solveQuadratic53(a: number, b: number, c: number): number[] {
  if (Math.abs(a) < 1e-9) return Math.abs(b) < 1e-9 ? [] : [-c / b];
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return [];
  if (Math.abs(discriminant) < 1e-9) return [-b / (2 * a)];
  const root = Math.sqrt(discriminant);
  return [(-b - root) / (2 * a), (-b + root) / (2 * a)].sort((x, y) => x - y);
}

export function roots53(q: Quadratic53): Point53[] {
  return solveQuadratic53(q.a, q.b, q.c).map((x) => ({ x, y: 0 }));
}

export function vertex53(q: Quadratic53): Point53 {
  const x = -q.b / (2 * q.a);
  return { x, y: quadraticValue53(q, x) };
}

export function intersections53(q: Quadratic53, line: Line53): Point53[] {
  return solveQuadratic53(q.a, q.b - line.m, q.c - line.b).map((x) => ({
    x,
    y: lineValue53(line, x),
  }));
}

export function graphPoint53(
  point: Point53,
  bounds: Bounds53,
  width: number,
  height: number,
) {
  return {
    x: ((point.x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    y: ((bounds.yMax - point.y) / (bounds.yMax - bounds.yMin)) * height,
  };
}

export function curvePath53(
  value: (x: number) => number,
  bounds: Bounds53,
  width: number,
  height: number,
) {
  const points: string[] = [];
  for (let pixel = 0; pixel <= width; pixel += 3) {
    const x = bounds.xMin + (pixel / width) * (bounds.xMax - bounds.xMin);
    const point = graphPoint53({ x, y: value(x) }, bounds, width, height);
    points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }
  return points.join(" ");
}

export function formatPoint53(point: Point53) {
  const clean = (value: number) => {
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  };
  return `(${clean(point.x)}, ${clean(point.y)})`;
}
