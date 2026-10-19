export const correlationDefault = [
  { x: -2.5, y: -1.6 },
  { x: -1.5, y: -1.1 },
  { x: -0.5, y: -0.5 },
  { x: 0, y: 0 },
  { x: 0.5, y: 0.1 },
  { x: 1, y: 1 },
  { x: 1.5, y: 1.6 },
  { x: 2, y: 2 },
  { x: 2.8, y: 2.6 },
];
export function correlationStats(points = correlationDefault) {
  const n = points.length,
    x = points.reduce((s, p) => s + p.x, 0) / n,
    y = points.reduce((s, p) => s + p.y, 0) / n,
    xy = points.reduce((s, p) => s + (p.x - x) * (p.y - y), 0),
    xx = points.reduce((s, p) => s + (p.x - x) ** 2, 0),
    yy = points.reduce((s, p) => s + (p.y - y) ** 2, 0);
  const defined = xx > 0 && yy > 0;
  const slope = xx > 0 ? xy / xx : NaN;
  return {
    defined,
    slope,
    intercept: y - slope * x,
    n,
    xMean: x,
    yMean: y,
    covariance: xy / n,
    sx: Math.sqrt(xx / n),
    sy: Math.sqrt(yy / n),
    r: defined ? Math.max(-1, Math.min(1, xy / Math.sqrt(xx * yy))) : NaN,
  };
}
