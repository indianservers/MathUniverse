export function overlapModel(lower: number, upper: number) {
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) throw new RangeError("Bounds must be finite");
  const kind = lower > upper ? "empty" : lower === upper ? "point" : "interval";
  return { lower, upper, kind, gap: Math.max(0, lower - upper),
    interval: kind === "empty" ? null : [lower, upper] as [number, number],
    count: kind === "empty" ? "No common points" : kind === "point" ? "One common point" : "Infinitely many points" };
}

export function boundFromPosition(position: number, start = 35, width = 610) {
  return Math.max(-10, Math.min(10, Math.round((-10 + (position - start) / width * 20) * 2) / 2));
}

export const OVERLAP_EXAMPLES = [
  { title: "Infeasible (gap)", lower: 5, upper: 2 },
  { title: "Touching (single point)", lower: 2, upper: 2 },
  { title: "Feasible (interval)", lower: 0, upper: 2 },
];
export const INFEASIBLE_PRACTICE = [[1, 4], [3, 3], [2, 0], [-1, 2]] as const;
