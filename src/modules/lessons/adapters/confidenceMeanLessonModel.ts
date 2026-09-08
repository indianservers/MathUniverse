import { normalQuantile } from "../../../phase4/statistics";
import { studentTCdf, studentTQuantile } from "./studentTLessonModel";
export const targetMeanSample = [
  12.5, 10.8, 11.6, 13.1, 9.7, 11.2, 10.5, 12.2, 11.7, 10.1, 12.3, 11, 10.9,
  13.4, 11.5, 10.7, 12, 11.8, 10.6, 12.6, 11.3, 10.2, 11.9, 12.3, 10.4, 11.4,
  12.2, 10.3, 11.1, 11.6,
];
export function summarizeMeanSample(values: number[]) {
  const clean = values.filter(Number.isFinite),
    n = clean.length,
    mean = clean.reduce((a, b) => a + b, 0) / Math.max(1, n),
    sd =
      n > 1
        ? Math.sqrt(
            clean.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
              (n - 1),
          )
        : 0;
  return { n, mean, sd, se: sd / Math.sqrt(Math.max(1, n)) };
}
export function confidenceIntervalMean(
  values: number[],
  confidenceValue: number,
  knownSigma?: number,
) {
  const summary = summarizeMeanSample(values),
    confidence = Math.max(0.5, Math.min(0.999, confidenceValue)),
    critical =
      knownSigma === undefined
        ? studentTQuantile(0.5 + confidence / 2, Math.max(1, summary.n - 1))
        : normalQuantile(0.5 + confidence / 2),
    se = (knownSigma ?? summary.sd) / Math.sqrt(Math.max(1, summary.n)),
    margin = critical * se;
  return {
    ...summary,
    confidence,
    critical,
    se,
    margin,
    lower: summary.mean - margin,
    upper: summary.mean + margin,
    knownSigma,
  };
}
export function confidenceFromMargin(
  margin: number,
  se: number,
  df: number,
  known = false,
) {
  const critical = Math.max(0, margin / Math.max(1e-9, se));
  return Math.max(
    0.5,
    Math.min(
      0.999,
      2 * (known ? normalCdfApprox(critical) : studentTCdf(critical, df)) - 1,
    ),
  );
}
function normalCdfApprox(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
function erf(x: number) {
  const sign = x < 0 ? -1 : 1,
    a = Math.abs(x),
    t = 1 / (1 + 0.3275911 * a);
  return (
    sign *
    (1 -
      ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
        t +
        0.254829592) *
        t *
        Math.exp(-a * a))
  );
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
export function generateMeanSample(seedValue: number, size = 30) {
  const random = rng(seedValue);
  return Array.from({ length: Math.max(3, size) }, () => 11.5 + normal(random));
}
export function simulateMeanIntervalCoverage(
  sampleSizeValue: number,
  confidenceValue: number,
  repetitionsValue: number,
  seedValue: number,
  populationMean = 11.5,
  populationSd = 2.5,
) {
  const n = Math.max(3, Math.round(sampleSizeValue)),
    repetitions = Math.max(10, Math.min(5000, Math.round(repetitionsValue))),
    random = rng(seedValue),
    critical = studentTQuantile(0.5 + confidenceValue / 2, n - 1),
    intervals = [] as Array<{
      mean: number;
      lower: number;
      upper: number;
      captures: boolean;
    }>;
  let captured = 0,
    totalWidth = 0;
  for (let i = 0; i < repetitions; i += 1) {
    const sample = Array.from(
        { length: n },
        () => populationMean + populationSd * normal(random),
      ),
      summary = summarizeMeanSample(sample),
      margin = critical * summary.se,
      lower = summary.mean - margin,
      upper = summary.mean + margin;
    const captures = lower <= populationMean && upper >= populationMean;
    if (captures) captured += 1;
    totalWidth += upper - lower;
    intervals.push({
      mean: summary.mean,
      lower,
      upper,
      captures,
    });
  }
  return {
    intervals,
    captured,
    missed: repetitions - captured,
    captureRate: captured / repetitions,
    averageWidth: totalWidth / repetitions,
    averageMargin: totalWidth / (2 * repetitions),
    repetitions,
    populationMean,
    populationSd,
  };
}
