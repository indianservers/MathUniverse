export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function mean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function quartiles(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const lower = sorted.slice(0, mid);
  const upper = sorted.slice(sorted.length % 2 ? mid + 1 : mid);
  return { q1: median(lower), q2: median(sorted), q3: median(upper), iqr: median(upper) - median(lower) };
}

export function variancePopulation(values: number[]) {
  const avg = mean(values);
  return values.length ? values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length : 0;
}

export function varianceSample(values: number[]) {
  const avg = mean(values);
  return values.length > 1 ? values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1) : 0;
}

export function standardDeviationPopulation(values: number[]) {
  return Math.sqrt(variancePopulation(values));
}

export function zScore(x: number, avg: number, sd: number) {
  return sd === 0 ? 0 : (x - avg) / sd;
}

export function covariance(xs: number[], ys: number[]) {
  const xMean = mean(xs);
  const yMean = mean(ys);
  return xs.length ? xs.reduce((sum, x, index) => sum + (x - xMean) * (ys[index] - yMean), 0) / xs.length : 0;
}

export function correlation(xs: number[], ys: number[]) {
  const sx = standardDeviationPopulation(xs);
  const sy = standardDeviationPopulation(ys);
  return sx * sy === 0 ? 0 : covariance(xs, ys) / (sx * sy);
}

export function linearRegression(xs: number[], ys: number[]) {
  const xMean = mean(xs);
  const yMean = mean(ys);
  const denominator = xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0);
  const slope = denominator === 0 ? 0 : xs.reduce((sum, x, index) => sum + (x - xMean) * (ys[index] - yMean), 0) / denominator;
  return { slope, intercept: yMean - slope * xMean };
}

export function residuals(xs: number[], ys: number[], line: { slope: number; intercept: number }) {
  return xs.map((x, index) => ys[index] - (line.slope * x + line.intercept));
}

export function residualSumOfSquares(xs: number[], ys: number[], line: { slope: number; intercept: number }) {
  return residuals(xs, ys, line).reduce((sum, residual) => sum + residual ** 2, 0);
}

export function normalPdf(x: number, mu: number, sigma: number) {
  const safeSigma = Math.max(0.1, sigma);
  return Math.exp(-0.5 * ((x - mu) / safeSigma) ** 2) / (safeSigma * Math.sqrt(2 * Math.PI));
}

export function generateUniformSamples(n: number, min: number, max: number) {
  return Array.from({ length: clamp(Math.floor(n), 1, 500) }, () => min + Math.random() * (max - min));
}

export function generateNormalSamples(n: number, mu: number, sigma: number) {
  return Array.from({ length: clamp(Math.floor(n), 1, 500) }, () => {
    const u = Math.max(Number.EPSILON, Math.random());
    const v = Math.random();
    return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  });
}

export function confidenceIntervalMean(avg: number, sd: number, n: number, z: number) {
  const margin = z * sd / Math.sqrt(Math.max(1, n));
  return { lower: avg - margin, upper: avg + margin, margin };
}

export function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, "");
}
