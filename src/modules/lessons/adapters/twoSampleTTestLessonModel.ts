import {
  studentTCdf,
  studentTQuantile,
  type TAlternative,
} from "./oneSampleTTestLessonModel";

export type TwoSampleMethod = "welch" | "pooled";

function summary(source: number[]) {
  const values = source.filter(Number.isFinite),
    n = values.length;
  const mean = n ? values.reduce((sum, value) => sum + value, 0) / n : 0;
  const variance =
    n > 1
      ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1)
      : 0;
  return {
    values,
    n,
    mean,
    variance,
    sd: Math.sqrt(variance),
    se: n ? Math.sqrt(variance / n) : 0,
  };
}

export function twoSampleTTest(
  firstSource: number[],
  secondSource: number[],
  alphaValue: number,
  alternative: TAlternative,
  method: TwoSampleMethod,
) {
  const first = summary(firstSource),
    second = summary(secondSource),
    difference = first.mean - second.mean,
    alpha = Math.max(0.001, Math.min(0.2, alphaValue));
  const pooledVariance =
    first.n + second.n > 2
      ? ((first.n - 1) * first.variance + (second.n - 1) * second.variance) /
        (first.n + second.n - 2)
      : 0;
  const se =
    method === "pooled"
      ? Math.sqrt(
          pooledVariance *
            (1 / Math.max(1, first.n) + 1 / Math.max(1, second.n)),
        )
      : Math.sqrt(
          first.variance / Math.max(1, first.n) +
            second.variance / Math.max(1, second.n),
        );
  const welchTop =
    (first.variance / Math.max(1, first.n) +
      second.variance / Math.max(1, second.n)) **
    2;
  const welchBottom =
    first.n > 1 && second.n > 1
      ? (first.variance / first.n) ** 2 / (first.n - 1) +
        (second.variance / second.n) ** 2 / (second.n - 1)
      : 1;
  const df =
    method === "pooled"
      ? Math.max(1, first.n + second.n - 2)
      : Math.max(1, welchTop / welchBottom);
  const statistic = se ? difference / se : 0;
  const pValue =
    alternative === "greater"
      ? 1 - studentTCdf(statistic, df)
      : alternative === "less"
        ? studentTCdf(statistic, df)
        : 2 * (1 - studentTCdf(Math.abs(statistic), df));
  const critical = studentTQuantile(1 - alpha / 2, df),
    margin = critical * se;
  return {
    first,
    second,
    difference,
    alpha,
    alternative,
    method,
    pooledVariance,
    se,
    df,
    statistic,
    pValue: Math.min(1, pValue),
    reject: pValue < alpha,
    critical,
    margin,
    lower: difference - margin,
    upper: difference + margin,
  };
}
