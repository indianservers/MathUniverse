export const normalizedCursorAngle = (x: number, y: number) =>
  ((((Math.atan2(y, x) * 180) / Math.PI) % 360) + 360) % 360;
export function cursorAngle(
  x: number,
  y: number,
  current: number,
  snap: number,
) {
  const angle = normalizedCursorAngle(x, y);
  const nearest = angle + 360 * Math.round((current - angle) / 360);
  return Math.max(
    0,
    Math.min(720, snap ? Math.round(nearest / snap) * snap : nearest),
  );
}
export function nearestProjectedAngle(
  x: number,
  y: number,
  project: (degrees: number) => number[],
) {
  let best = 0,
    distance = Infinity;
  for (let angle = 0; angle <= 360; angle += 0.5) {
    const p = project(angle),
      d = (p[0] - x) ** 2 + (p[1] - y) ** 2;
    if (d < distance) {
      distance = d;
      best = angle;
    }
  }
  return best;
}
