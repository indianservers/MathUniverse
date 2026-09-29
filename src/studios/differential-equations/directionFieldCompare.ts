import type { Point } from "./Phase1Graph";

/** Interpolate a plotted solution at a shared x so paths can be compared fairly. */
export function solutionValueAt(points: Point[], x: number): number | null {
  if (points.length < 2 || x < points[0]!.x || x > points[points.length - 1]!.x) return null;
  for (let index = 1; index < points.length; index += 1) {
    const left = points[index - 1]!;
    const right = points[index]!;
    if (right.x < x) continue;
    if (!Number.isFinite(left.y) || !Number.isFinite(right.y)) return null;
    const span = right.x - left.x;
    return span === 0 ? right.y : left.y + (right.y - left.y) * (x - left.x) / span;
  }
  return null;
}
