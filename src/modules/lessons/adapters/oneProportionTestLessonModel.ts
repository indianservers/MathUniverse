import { normalCdf, normalSurvival } from "../../../phase4/statistics";
import type { TAlternative } from "./oneSampleTTestLessonModel";

export type ProportionTestMethod = "normal" | "exact";

function logGamma(value: number) {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7,
  ];
  if (value < 0.5)
    return (
      Math.log(Math.PI) -
      Math.log(Math.sin(Math.PI * value)) -
      logGamma(1 - value)
    );
  let sum = 0.9999999999998099;
  const z = value - 1;
  coefficients.forEach((coefficient, index) => {
    sum += coefficient / (z + index + 1);
  });
  const t = z + coefficients.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(sum)
  );
}
function binomialProbability(x: number, n: number, p: number) {
  if (p === 0) return x === 0 ? 1 : 0;
  if (p === 1) return x === n ? 1 : 0;
  const logChoose = logGamma(n + 1) - logGamma(x + 1) - logGamma(n - x + 1);
  return Math.exp(logChoose + x * Math.log(p) + (n - x) * Math.log(1 - p));
}
function exactPValue(
  x: number,
  n: number,
  p: number,
  alternative: TAlternative,
) {
  if (alternative === "less")
    return Array.from({ length: x + 1 }, (_, i) =>
      binomialProbability(i, n, p),
    ).reduce((a, b) => a + b, 0);
  if (alternative === "greater")
    return Array.from({ length: n - x + 1 }, (_, i) =>
      binomialProbability(x + i, n, p),
    ).reduce((a, b) => a + b, 0);
  const observed = binomialProbability(x, n, p);
  return Array.from({ length: n + 1 }, (_, i) => binomialProbability(i, n, p))
    .filter((value) => value <= observed * (1 + 1e-10))
    .reduce((a, b) => a + b, 0);
}

export function oneProportionTest(
  successValue: number,
  totalValue: number,
  nullValue: number,
  alphaValue: number,
  alternative: TAlternative,
  method: ProportionTestMethod,
) {
  const n = Math.max(1, Math.round(totalValue)),
    x = Math.max(0, Math.min(n, Math.round(successValue))),
    p0 = Math.max(0.0001, Math.min(0.9999, nullValue)),
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    proportion = x / n,
    se = Math.sqrt((p0 * (1 - p0)) / n),
    z = (proportion - p0) / se;
  const normalP =
    alternative === "greater"
      ? normalSurvival(z)
      : alternative === "less"
        ? normalCdf(z)
        : 2 * normalSurvival(Math.abs(z));
  const pValue =
    method === "exact" ? exactPValue(x, n, p0, alternative) : normalP;
  return {
    x,
    n,
    p0,
    alpha,
    alternative,
    method,
    proportion,
    se,
    z,
    pValue: Math.min(1, pValue),
    reject: pValue < alpha,
    conditions: {
      success: n * p0,
      failure: n * (1 - p0),
      met: n * p0 >= 10 && n * (1 - p0) >= 10,
    },
  };
}
