import { normalCdf, normalQuantile } from "../../../phase4/statistics";

export type InverseDistribution = "normal" | "logistic" | "uniform";

export function clampProbability(p: number) {
  return Math.max(0.0001, Math.min(0.9999, p));
}

export function standardQuantile(p: number, distribution: InverseDistribution) {
  const probability = clampProbability(p);
  if (distribution === "normal") return normalQuantile(probability);
  if (distribution === "logistic") return Math.log(probability / (1 - probability));
  return 2 * probability - 1;
}

export function inverseQuantile(p: number, mean: number, sigma: number, distribution: InverseDistribution) {
  return mean + Math.max(0.01, sigma) * standardQuantile(p, distribution);
}

export function inverseCdf(x: number, mean: number, sigma: number, distribution: InverseDistribution) {
  const z = (x - mean) / Math.max(0.01, sigma);
  if (distribution === "normal") return normalCdf(z);
  if (distribution === "logistic") return 1 / (1 + Math.exp(-z));
  return Math.max(0, Math.min(1, (z + 1) / 2));
}

export function inverseDensity(x: number, mean: number, sigma: number, distribution: InverseDistribution) {
  const spread = Math.max(0.01, sigma);
  const z = (x - mean) / spread;
  if (distribution === "normal") return Math.exp(-(z * z) / 2) / (spread * Math.sqrt(2 * Math.PI));
  if (distribution === "logistic") { const e = Math.exp(-z); return e / (spread * (1 + e) ** 2); }
  return Math.abs(z) <= 1 ? 1 / (2 * spread) : 0;
}
