import { normalCdf } from "../../../phase4/statistics";
export type DistributionKind = "normal" | "binomial" | "exponential";
export type QueryMode = "between" | "left" | "right";
export type DistributionParameters = {
  mean: number;
  sigma: number;
  n: number;
  p: number;
  lambda: number;
};
export const defaultDistributionParameters: DistributionParameters = {
  mean: 50,
  sigma: 10,
  n: 20,
  p: 0.5,
  lambda: 0.2,
};
function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 1; i <= Math.min(k, n - k); i += 1)
    result = (result * (n - i + 1)) / i;
  return result;
}
export function distributionCdf(
  kind: DistributionKind,
  x: number,
  parameters: DistributionParameters,
) {
  if (kind === "normal")
    return normalCdf((x - parameters.mean) / Math.max(0.001, parameters.sigma));
  if (kind === "exponential")
    return x < 0 ? 0 : 1 - Math.exp(-Math.max(0.001, parameters.lambda) * x);
  const n = Math.max(1, Math.round(parameters.n)),
    p = Math.max(0, Math.min(1, parameters.p)),
    limit = Math.min(n, Math.floor(x));
  let sum = 0;
  for (let k = 0; k <= limit; k += 1)
    sum += choose(n, k) * p ** k * (1 - p) ** (n - k);
  return sum;
}
export function distributionDensity(
  kind: DistributionKind,
  x: number,
  parameters: DistributionParameters,
) {
  if (kind === "normal") {
    const sigma = Math.max(0.001, parameters.sigma),
      z = (x - parameters.mean) / sigma;
    return Math.exp((-z * z) / 2) / (sigma * Math.sqrt(2 * Math.PI));
  }
  if (kind === "exponential")
    return x < 0
      ? 0
      : Math.max(0.001, parameters.lambda) *
          Math.exp(-Math.max(0.001, parameters.lambda) * x);
  const n = Math.max(1, Math.round(parameters.n)),
    k = Math.round(x),
    p = Math.max(0, Math.min(1, parameters.p));
  return choose(n, k) * p ** k * (1 - p) ** (n - k);
}
export function distributionQuery(
  kind: DistributionKind,
  mode: QueryMode,
  a: number,
  b: number,
  parameters: DistributionParameters,
) {
  const low = mode === "between" ? Math.min(a, b) : a,
    high = mode === "between" ? Math.max(a, b) : b,
    left = distributionCdf(
      kind,
      low - (kind === "binomial" ? 1 : 0),
      parameters,
    ),
    right = distributionCdf(kind, high, parameters),
    probability =
      mode === "between" ? right - left : mode === "left" ? right : 1 - left;
  return {
    low,
    high,
    left,
    right,
    probability,
    zLow: kind === "normal" ? (low - parameters.mean) / parameters.sigma : low,
    zHigh:
      kind === "normal" ? (high - parameters.mean) / parameters.sigma : high,
  };
}
export function distributionDomain(
  kind: DistributionKind,
  parameters: DistributionParameters,
) {
  if (kind === "normal")
    return {
      min: parameters.mean - 3.5 * parameters.sigma,
      max: parameters.mean + 3.5 * parameters.sigma,
    };
  if (kind === "binomial")
    return { min: 0, max: Math.max(1, Math.round(parameters.n)) };
  return { min: 0, max: 6 / Math.max(0.001, parameters.lambda) };
}
