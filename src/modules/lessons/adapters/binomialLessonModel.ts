export function binomialChoose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let value = 1;
  for (let i = 1; i <= Math.min(k, n - k); i += 1)
    value = (value * (n - i + 1)) / i;
  return value;
}
export function binomialPmf(nValue: number, pValue: number) {
  const n = Math.max(1, Math.round(nValue)),
    p = Math.max(0, Math.min(1, pValue));
  return Array.from({ length: n + 1 }, (_, k) => ({
    k,
    probability: binomialChoose(n, k) * p ** k * (1 - p) ** (n - k),
  }));
}
export function binomialAnalysis(
  nValue: number,
  pValue: number,
  kValue: number,
  aValue: number,
  bValue: number,
) {
  const n = Math.max(1, Math.round(nValue)),
    p = Math.max(0, Math.min(1, pValue)),
    pmf = binomialPmf(n, p),
    k = Math.max(0, Math.min(n, Math.round(kValue))),
    a = Math.max(0, Math.min(n, Math.round(Math.min(aValue, bValue)))),
    b = Math.max(0, Math.min(n, Math.round(Math.max(aValue, bValue))));
  const cdf = pmf.map((_, index) =>
    pmf.slice(0, index + 1).reduce((sum, item) => sum + item.probability, 0),
  );
  return {
    n,
    p,
    k,
    a,
    b,
    pmf,
    cdf,
    exact: pmf[k].probability,
    range: pmf.slice(a, b + 1).reduce((sum, item) => sum + item.probability, 0),
    cumulative: cdf[k],
    mean: n * p,
    variance: n * p * (1 - p),
    std: Math.sqrt(n * p * (1 - p)),
  };
}
export function simulateBinomial(
  nValue: number,
  pValue: number,
  repetitionsValue: number,
  seedValue = 522,
) {
  const n = Math.max(1, Math.round(nValue)),
    p = Math.max(0, Math.min(1, pValue)),
    repetitions = Math.max(1, Math.min(100000, Math.round(repetitionsValue))),
    counts = Array(n + 1).fill(0) as number[];
  let seed = seedValue >>> 0;
  for (let run = 0; run < repetitions; run += 1) {
    let successes = 0;
    for (let trial = 0; trial < n; trial += 1) {
      seed = (1664525 * seed + 1013904223) >>> 0;
      if (seed / 4294967296 < p) successes += 1;
    }
    counts[successes] += 1;
  }
  const frequencies = counts.map((count) => count / repetitions),
    mean = frequencies.reduce((sum, value, k) => sum + k * value, 0),
    variance = frequencies.reduce(
      (sum, value, k) => sum + (k - mean) ** 2 * value,
      0,
    );
  return { repetitions, counts, frequencies, mean, variance };
}
