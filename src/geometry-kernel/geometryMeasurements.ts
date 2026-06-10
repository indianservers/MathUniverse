export type KernelPoint = {
  x: number;
  y: number;
  label?: string;
};

export type TriangleClassification = {
  sideType: "equilateral" | "isosceles" | "scalene";
  angleType: "acute" | "right" | "obtuse";
  area: number;
  perimeter: number;
  sides: [number, number, number];
};

export type LocusTracePoint = {
  x: number;
  y: number;
};

export function distance2d(a: KernelPoint, b: KernelPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function polygonArea2d(points: KernelPoint[]) {
  if (points.length < 3) return 0;
  return Math.abs(
    points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0) / 2
  );
}

export function classifyTriangle(points: [KernelPoint, KernelPoint, KernelPoint], unitScale = 40): TriangleClassification {
  const rawSides = [
    distance2d(points[0], points[1]) / unitScale,
    distance2d(points[1], points[2]) / unitScale,
    distance2d(points[2], points[0]) / unitScale,
  ].sort((a, b) => a - b) as [number, number, number];

  const [a, b, c] = rawSides;
  const eps = 0.04;
  const sideType = Math.abs(a - c) < eps ? "equilateral" : Math.abs(a - b) < eps || Math.abs(b - c) < eps ? "isosceles" : "scalene";
  const squareBalance = a * a + b * b - c * c;
  const angleType = Math.abs(squareBalance) < 0.08 ? "right" : squareBalance > 0 ? "acute" : "obtuse";

  return {
    sideType,
    angleType,
    area: polygonArea2d(points) / (unitScale * unitScale),
    perimeter: a + b + c,
    sides: rawSides,
  };
}

export function appendLocusPoint(trace: LocusTracePoint[], point: KernelPoint, limit = 240) {
  const last = trace[trace.length - 1];
  if (last && Math.hypot(last.x - point.x, last.y - point.y) < 2) return trace;
  return [...trace, { x: point.x, y: point.y }].slice(-limit);
}

export function locusPath(points: LocusTracePoint[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

