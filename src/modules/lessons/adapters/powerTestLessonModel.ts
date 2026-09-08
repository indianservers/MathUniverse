import { normalCdf, normalQuantile } from "../../../phase4/statistics";

export type PowerTail = "two-sided" | "right" | "left";

export function zTestPower(
  mu0Value: number,
  mu1Value: number,
  sigmaValue: number,
  sampleSizeValue: number,
  alphaValue: number,
  tail: PowerTail,
) {
  const mu0 = Number.isFinite(mu0Value) ? mu0Value : 0,
    mu1 = Number.isFinite(mu1Value) ? mu1Value : mu0,
    sigma = Math.max(0.001, sigmaValue),
    sampleSize = Math.max(2, Math.round(sampleSizeValue)),
    alpha = Math.max(0.0001, Math.min(0.25, alphaValue)),
    standardError = sigma / Math.sqrt(sampleSize),
    effectSize = (mu1 - mu0) / sigma,
    noncentrality = (mu1 - mu0) / standardError;
  let criticalLow = Number.NEGATIVE_INFINITY,
    criticalHigh = Number.POSITIVE_INFINITY,
    power = 0;
  if (tail === "two-sided") {
    criticalLow = normalQuantile(alpha / 2);
    criticalHigh = normalQuantile(1 - alpha / 2);
    power =
      normalCdf(criticalLow - noncentrality) +
      1 -
      normalCdf(criticalHigh - noncentrality);
  } else if (tail === "right") {
    criticalHigh = normalQuantile(1 - alpha);
    power = 1 - normalCdf(criticalHigh - noncentrality);
  } else {
    criticalLow = normalQuantile(alpha);
    power = normalCdf(criticalLow - noncentrality);
  }
  return {
    mu0,
    mu1,
    sigma,
    sampleSize,
    alpha,
    tail,
    standardError,
    effectSize,
    noncentrality,
    criticalLow,
    criticalHigh,
    beta: 1 - power,
    power: Math.max(0, Math.min(1, power)),
  };
}
export function requiredSampleSize(
  effectSizeValue: number,
  alpha: number,
  targetPower: number,
  tail: PowerTail,
) {
  const effectSize = Math.max(0.001, Math.abs(effectSizeValue)),
    target = Math.max(0.5, Math.min(0.999, targetPower));
  for (let n = 2; n <= 100000; n += 1) {
    const result = zTestPower(0, effectSize, 1, n, alpha, tail);
    if (result.power >= target)
      return { sampleSize: n, achievedPower: result.power };
  }
  return {
    sampleSize: 100000,
    achievedPower: zTestPower(0, effectSize, 1, 100000, alpha, tail).power,
  };
}
export function powerCurve(
  effectSize: number,
  sigma: number,
  alpha: number,
  tail: PowerTail,
) {
  return [10, 15, 20, 25, 30, 40, 50, 64, 80, 100, 150, 200].map(
    (sampleSize) => ({
      sampleSize,
      power: zTestPower(0, effectSize * sigma, sigma, sampleSize, alpha, tail)
        .power,
    }),
  );
}
