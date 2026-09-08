import { studentTCdf, studentTQuantile } from "./studentTLessonModel";

function normalizeSample(
  values: number[],
  targetMean: number,
  targetSd: number,
) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const sd = Math.sqrt(
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      (values.length - 1),
  );
  return values.map((value) => targetMean + ((value - mean) * targetSd) / sd);
}

export const differenceMeansSampleA = normalizeSample(
  [
    12, 14, 16, 15, 13, 17, 15, 15, 14, 16, 18, 14, 13, 17, 15, 16, 14, 16, 15,
    17,
  ],
  15.35,
  1.4422,
);
export const differenceMeansSampleB = normalizeSample(
  [9, 10, 8, 11, 10, 9, 8, 10, 9, 10, 7, 8, 9, 7, 8, 9, 10, 8, 9, 8],
  8.75,
  1.0541,
);
export function summarizeGroup(values: number[]) {
  const clean = values.filter(Number.isFinite),
    n = clean.length,
    mean = clean.reduce((a, b) => a + b, 0) / Math.max(1, n),
    variance =
      n > 1
        ? clean.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1)
        : 0;
  return {
    n,
    mean,
    variance,
    sd: Math.sqrt(variance),
    se: Math.sqrt(variance / Math.max(1, n)),
  };
}
export type DifferenceMeansMethod = "pooled" | "welch" | "paired";
export function differenceMeansInterval(
  a: number[],
  b: number[],
  confidenceValue: number,
  method: DifferenceMeansMethod,
) {
  const first = summarizeGroup(a),
    second = summarizeGroup(b),
    confidence = Math.max(0.5, Math.min(0.999, confidenceValue));
  let difference = first.mean - second.mean,
    se: number,
    df: number,
    pooledSd: number;
  if (method === "paired") {
    const size = Math.min(a.length, b.length),
      differences = Array.from({ length: size }, (_, i) => a[i] - b[i]),
      summary = summarizeGroup(differences);
    difference = summary.mean;
    se = summary.se;
    df = Math.max(1, size - 1);
    pooledSd = Math.sqrt((first.variance + second.variance) / 2);
  } else if (method === "pooled") {
    df = Math.max(1, first.n + second.n - 2);
    const pooledVariance =
      ((first.n - 1) * first.variance + (second.n - 1) * second.variance) / df;
    pooledSd = Math.sqrt(pooledVariance);
    se = pooledSd * Math.sqrt(1 / first.n + 1 / second.n);
  } else {
    se = Math.sqrt(first.variance / first.n + second.variance / second.n);
    const numerator =
        (first.variance / first.n + second.variance / second.n) ** 2,
      denominator =
        (first.variance / first.n) ** 2 / (first.n - 1) +
        (second.variance / second.n) ** 2 / (second.n - 1);
    df = numerator / denominator;
    pooledSd = Math.sqrt((first.variance + second.variance) / 2);
  }
  const critical = studentTQuantile(0.5 + confidence / 2, df),
    margin = critical * se,
    t = difference / se,
    pValue = 2 * (1 - studentTCdf(Math.abs(t), df));
  return {
    first,
    second,
    method,
    confidence,
    difference,
    se,
    df,
    critical,
    margin,
    lower: difference - margin,
    upper: difference + margin,
    t,
    pValue,
    pooledSd,
    effect: difference / Math.max(1e-9, pooledSd),
  };
}
function rng(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
function normal(random: () => number) {
  return (
    Math.sqrt(-2 * Math.log(Math.max(Number.EPSILON, random()))) *
    Math.cos(2 * Math.PI * random())
  );
}
export function generateDifferenceSamples(seedValue: number, size = 20) {
  const random = rng(seedValue);
  return {
    a: Array.from({ length: size }, () => 15.3 + 1.45 * normal(random)),
    b: Array.from({ length: size }, () => 8.8 + 1.05 * normal(random)),
  };
}
