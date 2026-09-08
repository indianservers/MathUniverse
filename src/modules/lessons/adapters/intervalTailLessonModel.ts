import { normalCdf } from "../../../phase4/statistics";

export type IntervalMode = "left" | "right" | "between" | "outside";

export function normalIntervalQuery(mode: IntervalMode, a: number, b: number, mean: number, sigma: number) {
  const spread = Math.max(0.01, sigma);
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  const zLow = (low - mean) / spread;
  const zHigh = (high - mean) / spread;
  const cdfLow = normalCdf(zLow);
  const cdfHigh = normalCdf(zHigh);
  const between = cdfHigh - cdfLow;
  const probability = mode === "left" ? cdfLow : mode === "right" ? 1 - cdfHigh : mode === "outside" ? 1 - between : between;
  return { low, high, zLow, zHigh, cdfLow, cdfHigh, between, outside: 1 - between, probability };
}

export function normalDensity(x: number, mean: number, sigma: number) {
  const spread = Math.max(0.01, sigma);
  const z = (x - mean) / spread;
  return Math.exp(-(z * z) / 2) / (spread * Math.sqrt(2 * Math.PI));
}
