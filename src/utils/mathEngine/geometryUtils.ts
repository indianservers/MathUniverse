export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function midpoint(x1: number, y1: number, x2: number, y2: number) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

export function slope(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  if (Math.abs(dx) < 1e-12) return Infinity;
  return (y2 - y1) / dx;
}

export function lineEquation(x1: number, y1: number, x2: number, y2: number) {
  const m = slope(x1, y1, x2, y2);
  if (!Number.isFinite(m)) return { kind: "vertical" as const, equation: `x = ${format(x1)}`, x: x1 };
  const intercept = y1 - m * x1;
  return { kind: "slope-intercept" as const, equation: `y = ${format(m)}x ${intercept < 0 ? "-" : "+"} ${format(Math.abs(intercept))}`, slope: m, intercept };
}

export function triangleMetrics(a: number, b: number, c: number) {
  const sides = [a, b, c];
  if (sides.some((side) => !Number.isFinite(side) || side <= 0)) return { valid: false, error: "Triangle sides must be positive finite numbers." };
  if (a + b <= c || a + c <= b || b + c <= a) return { valid: false, error: "These sides do not satisfy the triangle inequality." };
  const semiperimeter = (a + b + c) / 2;
  return { valid: true, perimeter: a + b + c, semiperimeter, area: Math.sqrt(semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)) };
}

export function circleMetrics(radius: number) {
  if (!Number.isFinite(radius) || radius < 0) return { valid: false, error: "Radius must be a non-negative finite number." };
  return { valid: true, circumference: 2 * Math.PI * radius, area: Math.PI * radius * radius };
}

export function polygonArea(points: Array<{ x: number; y: number }>) {
  if (points.length < 3 || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) return { valid: false, area: 0, error: "A polygon needs at least three finite points." };
  const twiceSignedArea = points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0);
  return { valid: true, area: Math.abs(twiceSignedArea) / 2, orientation: twiceSignedArea < 0 ? "clockwise" as const : "counterclockwise" as const };
}

function format(value: number) {
  return Number(value.toFixed(6)).toString();
}
