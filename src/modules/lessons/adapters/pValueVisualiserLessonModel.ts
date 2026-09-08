import { normalCdf, normalQuantile } from "../../../phase4/statistics";
import {
  chiSquareCdf,
  chiSquareDensity,
  chiSquareQuantile,
} from "./chiSquareLessonModel";
import { fCdf, fDensity, fQuantile } from "./fDistributionLessonModel";
import { studentTCdf, studentTQuantile } from "./oneSampleTTestLessonModel";
import { studentTDensity } from "./studentTLessonModel";

export type PValueDistribution = "z" | "t" | "chi-square" | "f";
export type PValueTail = "left" | "right" | "two-sided";

export function pValueAnalysis(
  distribution: PValueDistribution,
  statisticValue: number,
  alphaValue: number,
  tail: PValueTail,
  df1Value = 10,
  df2Value = 15,
) {
  const alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    df1 = Math.max(1, Math.round(df1Value)),
    df2 = Math.max(1, Math.round(df2Value)),
    statistic =
      distribution === "chi-square" || distribution === "f"
        ? Math.max(0.001, statisticValue)
        : statisticValue;
  const cdf =
    distribution === "z"
      ? normalCdf(statistic)
      : distribution === "t"
        ? studentTCdf(statistic, df1)
        : distribution === "chi-square"
          ? chiSquareCdf(statistic, df1)
          : fCdf(statistic, df1, df2);
  const symmetric = distribution === "z" || distribution === "t";
  const pValue =
    tail === "left"
      ? cdf
      : tail === "right"
        ? 1 - cdf
        : symmetric
          ? 2 * Math.min(cdf, 1 - cdf)
          : Math.min(1, 2 * Math.min(cdf, 1 - cdf));
  const quantile = (probability: number) =>
    distribution === "z"
      ? normalQuantile(probability)
      : distribution === "t"
        ? studentTQuantile(probability, df1)
        : distribution === "chi-square"
          ? chiSquareQuantile(probability, df1)
          : fQuantile(probability, df1, df2);
  const criticalLow =
      tail === "right"
        ? Number.NEGATIVE_INFINITY
        : quantile(tail === "left" ? alpha : alpha / 2),
    criticalHigh =
      tail === "left"
        ? Number.POSITIVE_INFINITY
        : quantile(tail === "right" ? 1 - alpha : 1 - alpha / 2);
  return {
    distribution,
    statistic,
    alpha,
    tail,
    df1,
    df2,
    cdf,
    pValue: Math.max(0, Math.min(1, pValue)),
    criticalLow,
    criticalHigh,
    reject: pValue <= alpha,
  };
}

export function pValueDensity(
  distribution: PValueDistribution,
  x: number,
  df1 = 10,
  df2 = 15,
) {
  if (distribution === "z")
    return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
  if (distribution === "t") return studentTDensity(x, df1);
  if (distribution === "chi-square") return chiSquareDensity(x, df1);
  return fDensity(x, df1, df2);
}
