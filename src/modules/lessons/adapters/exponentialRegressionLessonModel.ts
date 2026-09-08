export const exponentialDefault = [
  { x: 0, y: 2.3 },
  { x: 1, y: 3 },
  { x: 2, y: 3.8 },
  { x: 3, y: 4.9 },
  { x: 4, y: 6.3 },
  { x: 5, y: 8.1 },
  { x: 6, y: 10.4 },
  { x: 7, y: 13.4 },
  { x: 8, y: 17.2 },
  { x: 9, y: 22.1 },
];
export function exponentialFit(points = exponentialDefault) {
  const valid = points.filter((p) => p.y > 0),
    n = valid.length,
    x = valid.reduce((s, p) => s + p.x, 0) / n,
    ly = valid.reduce((s, p) => s + Math.log(p.y), 0) / n,
    xx = valid.reduce((s, p) => s + (p.x - x) ** 2, 0),
    xy = valid.reduce((s, p) => s + (p.x - x) * (Math.log(p.y) - ly), 0),
    slope = xy / xx,
    intercept = ly - slope * x,
    a = Math.exp(intercept),
    b = Math.exp(slope),
    residuals = valid.map((p) => p.y - a * b ** p.x),
    sse = residuals.reduce((s, e) => s + e ** 2, 0),
    mean = valid.reduce((s, p) => s + p.y, 0) / n,
    sst = valid.reduce((s, p) => s + (p.y - mean) ** 2, 0);
  return { a, b, rate: (b - 1) * 100, residuals, sse, r2: 1 - sse / sst };
}
