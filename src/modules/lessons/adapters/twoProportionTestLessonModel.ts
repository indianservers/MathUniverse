import {
  normalCdf,
  normalQuantile,
  normalSurvival,
} from "../../../phase4/statistics";
import type { TAlternative } from "./oneSampleTTestLessonModel";

export function twoProportionTest(
  x1Value: number,
  n1Value: number,
  x2Value: number,
  n2Value: number,
  alphaValue: number,
  alternative: TAlternative,
) {
  const n1 = Math.max(1, Math.round(n1Value)),
    n2 = Math.max(1, Math.round(n2Value)),
    x1 = Math.max(0, Math.min(n1, Math.round(x1Value))),
    x2 = Math.max(0, Math.min(n2, Math.round(x2Value))),
    p1 = x1 / n1,
    p2 = x2 / n2,
    difference = p1 - p2,
    pooled = (x1 + x2) / (n1 + n2),
    seNull = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2)),
    z = seNull ? difference / seNull : 0,
    normalP =
      alternative === "greater"
        ? normalSurvival(z)
        : alternative === "less"
          ? normalCdf(z)
          : 2 * normalSurvival(Math.abs(z)),
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    seInterval = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2),
    critical = normalQuantile(1 - alpha / 2),
    margin = critical * seInterval;
  return {
    x1,
    n1,
    x2,
    n2,
    p1,
    p2,
    difference,
    pooled,
    seNull,
    z,
    pValue: Math.min(1, normalP),
    alpha,
    alternative,
    reject: normalP < alpha,
    seInterval,
    critical,
    margin,
    lower: difference - margin,
    upper: difference + margin,
    conditions: {
      group1Success: x1,
      group1Failure: n1 - x1,
      group2Success: x2,
      group2Failure: n2 - x2,
      met: Math.min(x1, n1 - x1, x2, n2 - x2) >= 10,
    },
  };
}

function seeded(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function randomTwoProportionExample(
  seedValue: number,
  n1 = 200,
  n2 = 200,
) {
  const random = seeded(seedValue),
    p1 = 0.2 + random() * 0.35,
    p2 = 0.15 + random() * 0.3;
  let x1 = 0,
    x2 = 0;
  for (let i = 0; i < n1; i += 1) if (random() < p1) x1 += 1;
  for (let i = 0; i < n2; i += 1) if (random() < p2) x2 += 1;
  return { x1, n1, x2, n2 };
}
