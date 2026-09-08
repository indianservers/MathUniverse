export type ThreeMasses = [number, number, number];
export const FAIR_COIN_MASSES: ThreeMasses = [.25, .5, .25];
export const DISTRIBUTION_OUTCOMES = ["TT", "HT", "TH", "HH"] as const;
export const headCount = (outcome: string) => [...outcome].filter(face => face === "H").length;
export function distributionModel(masses: ThreeMasses) {
  const nonnegative = masses.every(p => Number.isFinite(p) && p >= 0);
  const total = masses.reduce((sum, p) => sum + p, 0);
  const normalized = Number.isFinite(total) && Math.abs(total - 1) < 1e-8;
  let sum = 0;
  return { total, nonnegative, normalized, valid: nonnegative && normalized,
    cumulative: masses.map(p => { sum += p; return sum; }), interval: masses[0] + masses[1] };
}
export function simulateDistribution(masses: ThreeMasses, trials: number, rng = Math.random): ThreeMasses {
  if (!distributionModel(masses).valid) throw new RangeError("A valid PMF is required");
  if (!Number.isInteger(trials) || trials < 1 || trials > 10000) throw new RangeError("Invalid trial count");
  const counts: ThreeMasses = [0, 0, 0];
  for (let i = 0; i < trials; i++) { const u = rng(); const index = u < masses[0] ? 0 : u < masses[0] + masses[1] ? 1 : 2; counts[index]++; }
  return counts;
}
export const probabilityFromChartY = (y: number) => Math.max(0, Math.min(1, Math.round((270 - y) / 220 * 100) / 100));
