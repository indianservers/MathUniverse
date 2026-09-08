import { normalQuantile } from "../../../phase4/statistics";
export function differenceProportionsInterval(
  successes1Value: number,
  total1Value: number,
  successes2Value: number,
  total2Value: number,
  confidenceValue: number,
) {
  const n1 = Math.max(1, Math.round(total1Value)),
    n2 = Math.max(1, Math.round(total2Value)),
    x1 = Math.max(0, Math.min(n1, Math.round(successes1Value))),
    x2 = Math.max(0, Math.min(n2, Math.round(successes2Value))),
    p1 = x1 / n1,
    p2 = x2 / n2,
    difference = p1 - p2,
    confidence = Math.max(0.5, Math.min(0.999, confidenceValue)),
    critical = normalQuantile(0.5 + confidence / 2),
    se = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2),
    margin = critical * se;
  return {
    x1,
    n1,
    x2,
    n2,
    p1,
    p2,
    difference,
    confidence,
    critical,
    se,
    margin,
    lower: difference - margin,
    upper: difference + margin,
    conditions: {
      success1: x1,
      failure1: n1 - x1,
      success2: x2,
      failure2: n2 - x2,
      met: Math.min(x1, n1 - x1, x2, n2 - x2) >= 10,
    },
  };
}
function rng(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function generateProportionSamples(
  seedValue: number,
  n1 = 200,
  n2 = 200,
  p1 = 0.29,
  p2 = 0.2,
) {
  const random = rng(seedValue);
  let x1 = 0,
    x2 = 0;
  for (let i = 0; i < n1; i += 1) if (random() < p1) x1 += 1;
  for (let i = 0; i < n2; i += 1) if (random() < p2) x2 += 1;
  return { x1, n1, x2, n2 };
}
