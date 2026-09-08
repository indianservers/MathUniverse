export type Point = { x: number; y: number };
export type SetKey = "a" | "b";

export const outcomePoints: Array<Point & { value: number }> = [
  { value: 1, x: 0.12, y: 0.25 }, { value: 2, x: 0.38, y: 0.2 }, { value: 3, x: 0.59, y: 0.2 }, { value: 4, x: 0.82, y: 0.25 },
  { value: 5, x: 0.12, y: 0.43 }, { value: 6, x: 0.38, y: 0.43 }, { value: 7, x: 0.59, y: 0.43 }, { value: 8, x: 0.82, y: 0.43 },
  { value: 9, x: 0.12, y: 0.62 }, { value: 10, x: 0.38, y: 0.66 }, { value: 11, x: 0.59, y: 0.66 }, { value: 12, x: 0.82, y: 0.62 },
];

export const defaultCenters: Record<SetKey, Point> = {
  a: { x: 0.13, y: 0.43 },
  b: { x: 0.82, y: 0.43 },
};

export const eventRadiusX = 0.13;
export const eventRadiusY = 0.24;

export function outcomesInside(center: Point) {
  return outcomePoints
    .filter((outcome) => ((outcome.x - center.x) / eventRadiusX) ** 2 + ((outcome.y - center.y) / eventRadiusY) ** 2 <= 1)
    .map((outcome) => outcome.value);
}

export function exclusiveSummary(centers: Record<SetKey, Point>) {
  const a = outcomesInside(centers.a);
  const b = outcomesInside(centers.b);
  const intersection = a.filter((value) => b.includes(value));
  const union = [...new Set([...a, ...b])].sort((left, right) => left - right);
  return { total: outcomePoints.length, a, b, intersection, union, exclusive: intersection.length === 0 };
}

export function clampCenter(point: Point): Point {
  return { x: Math.max(eventRadiusX, Math.min(1 - eventRadiusX, point.x)), y: Math.max(eventRadiusY, Math.min(1 - eventRadiusY, point.y)) };
}
