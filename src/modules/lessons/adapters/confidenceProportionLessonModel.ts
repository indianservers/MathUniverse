import { normalQuantile } from "../../../phase4/statistics";
export type ProportionIntervalMethod = "wilson" | "wald";
export function proportionInterval(
  successesValue: number,
  sampleSizeValue: number,
  confidenceValue: number,
  method: ProportionIntervalMethod,
) {
  const n = Math.max(1, Math.round(sampleSizeValue)),
    successes = Math.max(0, Math.min(n, Math.round(successesValue))),
    pHat = successes / n,
    confidence = Math.max(0.5, Math.min(0.999, confidenceValue)),
    critical = normalQuantile(0.5 + confidence / 2);
  if (method === "wald") {
    const se = Math.sqrt((pHat * (1 - pHat)) / n),
      margin = critical * se;
    return {
      n,
      successes,
      pHat,
      confidence,
      critical,
      se,
      margin,
      lower: Math.max(0, pHat - margin),
      upper: Math.min(1, pHat + margin),
      method,
    };
  }
  const denominator = 1 + critical ** 2 / n,
    center = (pHat + critical ** 2 / (2 * n)) / denominator,
    se =
      Math.sqrt((pHat * (1 - pHat) + critical ** 2 / (4 * n)) / n) /
      denominator,
    margin = critical * se;
  return {
    n,
    successes,
    pHat,
    confidence,
    critical,
    se,
    margin,
    lower: Math.max(0, center - margin),
    upper: Math.min(1, center + margin),
    center,
    method,
  };
}
function rng(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function simulateProportionCoverage(
  trueProportionValue: number,
  sampleSizeValue: number,
  confidenceValue: number,
  repetitionsValue: number,
  method: ProportionIntervalMethod,
  seedValue: number,
) {
  const p = Math.max(0, Math.min(1, trueProportionValue)),
    n = Math.max(1, Math.round(sampleSizeValue)),
    repetitions = Math.max(10, Math.min(5000, Math.round(repetitionsValue))),
    random = rng(seedValue),
    intervals = [] as Array<{
      pHat: number;
      lower: number;
      upper: number;
      captures: boolean;
    }>;
  let captured = 0,
    totalWidth = 0;
  for (let repetition = 0; repetition < repetitions; repetition += 1) {
    let successes = 0;
    for (let trial = 0; trial < n; trial += 1) if (random() < p) successes += 1;
    const interval = proportionInterval(successes, n, confidenceValue, method),
      captures = interval.lower <= p && interval.upper >= p;
    if (captures) captured += 1;
    totalWidth += interval.upper - interval.lower;
    intervals.push({
      pHat: interval.pHat,
      lower: interval.lower,
      upper: interval.upper,
      captures,
    });
  }
  return {
    p,
    n,
    repetitions,
    method,
    intervals,
    captured,
    missed: repetitions - captured,
    captureRate: captured / repetitions,
    averageWidth: totalWidth / repetitions,
  };
}
