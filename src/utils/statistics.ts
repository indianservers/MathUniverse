export function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function mode(values: number[]) {
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  let bestValue = values[0] ?? 0;
  let bestCount = 0;
  counts.forEach((count, value) => {
    if (count > bestCount) {
      bestValue = value;
      bestCount = count;
    }
  });
  return bestValue;
}

export function variance(values: number[]) {
  if (values.length === 0) return 0;
  const avg = mean(values);
  return mean(values.map((value) => (value - avg) ** 2));
}

export function standardDeviation(values: number[]) {
  return Math.sqrt(variance(values));
}

export function normalPdf(x: number, mu = 0, sigma = 1) {
  if (sigma <= 0) return 0;
  const exponent = -0.5 * ((x - mu) / sigma) ** 2;
  return Math.exp(exponent) / (sigma * Math.sqrt(2 * Math.PI));
}

export function correlation(xs: number[], ys: number[]) {
  const n = Math.min(xs.length, ys.length);
  if (n === 0) return 0;
  const x = xs.slice(0, n);
  const y = ys.slice(0, n);
  const mx = mean(x);
  const my = mean(y);
  const numerator = x.reduce((sum, value, index) => sum + (value - mx) * (y[index] - my), 0);
  const denominator = Math.sqrt(x.reduce((sum, value) => sum + (value - mx) ** 2, 0) * y.reduce((sum, value) => sum + (value - my) ** 2, 0));
  return denominator === 0 ? 0 : numerator / denominator;
}

export function linearRegression(xs: number[], ys: number[]) {
  const n = Math.min(xs.length, ys.length);
  if (n === 0) return { slope: 0, intercept: 0, predict: () => 0 };
  const x = xs.slice(0, n);
  const y = ys.slice(0, n);
  const mx = mean(x);
  const my = mean(y);
  const denominator = x.reduce((sum, value) => sum + (value - mx) ** 2, 0);
  const slope = denominator === 0 ? 0 : x.reduce((sum, value, index) => sum + (value - mx) * (y[index] - my), 0) / denominator;
  const intercept = my - slope * mx;
  return { slope, intercept, predict: (input: number) => slope * input + intercept };
}
