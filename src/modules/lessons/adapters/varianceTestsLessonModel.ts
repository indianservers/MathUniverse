import { chiSquareCdf, chiSquareQuantile } from "./chiSquareLessonModel";
import { fCdf, fQuantile } from "./fDistributionLessonModel";
import type { TAlternative } from "./oneSampleTTestLessonModel";

function tailP(cdf: number, alternative: TAlternative) {
  return alternative === "greater"
    ? 1 - cdf
    : alternative === "less"
      ? cdf
      : 2 * Math.min(cdf, 1 - cdf);
}
export function twoVarianceFTest(
  n1Value: number,
  variance1Value: number,
  n2Value: number,
  variance2Value: number,
  nullRatioValue: number,
  alphaValue: number,
  alternative: TAlternative,
) {
  const n1 = Math.max(2, Math.round(n1Value)),
    n2 = Math.max(2, Math.round(n2Value)),
    variance1 = Math.max(0.000001, variance1Value),
    variance2 = Math.max(0.000001, variance2Value),
    nullRatio = Math.max(0.000001, nullRatioValue),
    df1 = n1 - 1,
    df2 = n2 - 1,
    statistic = variance1 / variance2 / nullRatio,
    cdf = fCdf(statistic, df1, df2),
    pValue = Math.min(1, tailP(cdf, alternative)),
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    lower = fQuantile(
      alternative === "greater"
        ? alpha
        : alternative === "less"
          ? 0
          : alpha / 2,
      df1,
      df2,
    ),
    upper = fQuantile(
      alternative === "less"
        ? 1 - alpha
        : alternative === "greater"
          ? 1
          : 1 - alpha / 2,
      df1,
      df2,
    );
  return {
    mode: "two" as const,
    n1,
    n2,
    variance1,
    variance2,
    nullRatio,
    df1,
    df2,
    statistic,
    cdf,
    pValue,
    alpha,
    alternative,
    lower,
    upper,
    reject: pValue < alpha,
  };
}
export function oneVarianceChiSquareTest(
  nValue: number,
  varianceValue: number,
  nullVarianceValue: number,
  alphaValue: number,
  alternative: TAlternative,
) {
  const n = Math.max(2, Math.round(nValue)),
    variance = Math.max(0.000001, varianceValue),
    nullVariance = Math.max(0.000001, nullVarianceValue),
    df = n - 1,
    statistic = (df * variance) / nullVariance,
    cdf = chiSquareCdf(statistic, df),
    pValue = Math.min(1, tailP(cdf, alternative)),
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    lower = chiSquareQuantile(
      alternative === "greater"
        ? alpha
        : alternative === "less"
          ? 0
          : alpha / 2,
      df,
    ),
    upper = chiSquareQuantile(
      alternative === "less"
        ? 1 - alpha
        : alternative === "greater"
          ? 1
          : 1 - alpha / 2,
      df,
    );
  return {
    mode: "one" as const,
    n,
    variance,
    nullVariance,
    df,
    statistic,
    cdf,
    pValue,
    alpha,
    alternative,
    lower,
    upper,
    reject: pValue < alpha,
  };
}
