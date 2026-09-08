import { chiSquareCdf } from "./chiSquareLessonModel";

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  let value = 1;
  for (let i = 1; i <= Math.min(k, n - k); i += 1)
    value = (value * (n - i + 1)) / i;
  return value;
}
export function binomialPmf(
  k: number,
  trialsValue: number,
  probabilityValue: number,
) {
  const n = Math.max(1, Math.round(trialsValue)),
    p = Math.max(0, Math.min(1, probabilityValue));
  return choose(n, k) * p ** k * (1 - p) ** (n - k);
}
export function binomialTail(
  minimum: number,
  trialsValue: number,
  probabilityValue: number,
) {
  const n = Math.max(1, Math.round(trialsValue));
  let sum = 0;
  for (let k = Math.max(0, Math.ceil(minimum)); k <= n; k += 1)
    sum += binomialPmf(k, n, probabilityValue);
  return sum;
}
export function simulateBinomial(
  trialsValue: number,
  probabilityValue: number,
  sampleSizeValue: number,
  seedValue: number,
) {
  const n = Math.max(1, Math.round(trialsValue)),
    p = Math.max(0, Math.min(1, probabilityValue)),
    size = Math.max(1, Math.min(100000, Math.round(sampleSizeValue)));
  let state = seedValue >>> 0;
  const counts = Array(n + 1).fill(0) as number[],
    draws: number[] = [];
  let total = 0,
    totalSquares = 0;
  for (let sample = 0; sample < size; sample += 1) {
    let successes = 0;
    for (let trial = 0; trial < n; trial += 1) {
      state = (1664525 * state + 1013904223) >>> 0;
      if (state / 4294967296 < p) successes += 1;
    }
    counts[successes] += 1;
    total += successes;
    totalSquares += successes ** 2;
    if (sample >= size - 20) draws.push(successes);
  }
  const mean = total / size,
    variance = totalSquares / size - mean ** 2,
    theoretical = counts.map((_, k) => binomialPmf(k, n, p)),
    expected = theoretical.map((value) => value * size),
    chiSquare = counts.reduce(
      (sum, count, k) =>
        expected[k] > 0.01
          ? sum + (count - expected[k]) ** 2 / expected[k]
          : sum,
      0,
    ),
    df = Math.max(1, expected.filter((value) => value > 0.01).length - 1);
  return {
    n,
    p,
    size,
    counts,
    draws,
    mean,
    variance,
    totalSuccesses: total,
    theoretical,
    expected,
    chiSquare,
    df,
    pValue: 1 - chiSquareCdf(chiSquare, df),
  };
}
export function convergenceSeries(
  trials: number,
  probability: number,
  seed: number,
) {
  return [100, 300, 1000, 3000, 10000].map((size) => ({
    size,
    mean: simulateBinomial(trials, probability, size, seed).mean,
  }));
}
