export type CumulativeMode = "continuous" | "discrete";

export const discreteMasses = [
  { x: 0, probability: 0.1 },
  { x: 0.5, probability: 0.15 },
  { x: 1, probability: 0.25 },
  { x: 1.5, probability: 0.3 },
  { x: 2, probability: 0.2 },
];

export function clampCumulativeX(value: number) {
  return Math.max(0, Math.min(2, value));
}

export function cumulativeDensity(value: number, mode: CumulativeMode) {
  const x = clampCumulativeX(value);
  if (mode === "continuous") return x / 2;
  return (
    discreteMasses.find((point) => Math.abs(point.x - x) < 0.001)
      ?.probability ?? 0
  );
}

export function cumulativeProbability(value: number, mode: CumulativeMode) {
  const x = clampCumulativeX(value);
  if (mode === "continuous") return (x * x) / 4;
  return discreteMasses
    .filter((point) => point.x <= x + Number.EPSILON)
    .reduce((total, point) => total + point.probability, 0);
}

export function cumulativeWorkedValues(mode: CumulativeMode) {
  const values =
    mode === "continuous"
      ? [0, 0.5, 1, 1.4, 1.5, 2]
      : discreteMasses.map((point) => point.x);
  return values.map((x) => ({ x, cumulative: cumulativeProbability(x, mode) }));
}
