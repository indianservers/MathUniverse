import { chiSquareCdf, chiSquareDensity } from "./chiSquareLessonModel";

export function goodnessOfFitTest(
  observedSource: number[],
  weightSource: number[],
  alphaValue = 0.05,
  estimatedParametersValue = 0,
) {
  const observed = observedSource.map((value) =>
      Math.max(0, Number.isFinite(value) ? value : 0),
    ),
    total = observed.reduce((sum, value) => sum + value, 0),
    weights = observed.map((_, index) => Math.max(0, weightSource[index] ?? 0)),
    weightTotal = weights.reduce((sum, value) => sum + value, 0),
    probabilities = weights.map((value) =>
      weightTotal ? value / weightTotal : 1 / Math.max(1, observed.length),
    ),
    expected = probabilities.map((probability) => probability * total),
    contributions = observed.map((value, index) =>
      expected[index] > 0
        ? (value - expected[index]) ** 2 / expected[index]
        : Number.POSITIVE_INFINITY,
    ),
    statistic = contributions.reduce((sum, value) => sum + value, 0),
    estimatedParameters = Math.max(
      0,
      Math.min(observed.length - 2, Math.round(estimatedParametersValue)),
    ),
    df = Math.max(1, observed.length - 1 - estimatedParameters),
    pValue = Number.isFinite(statistic) ? 1 - chiSquareCdf(statistic, df) : 0,
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    cumulative = contributions.map((_, index) =>
      contributions.slice(0, index + 1).reduce((sum, value) => sum + value, 0),
    ),
    minimumExpected = expected.length ? Math.min(...expected) : 0,
    smallExpected = expected.filter((value) => value < 5).length;
  return {
    observed,
    total,
    weights,
    probabilities,
    expected,
    contributions,
    statistic,
    estimatedParameters,
    df,
    pValue,
    alpha,
    reject: pValue < alpha,
    cumulative,
    minimumExpected,
    conditions: {
      allAtLeastFive: minimumExpected >= 5,
      tenPercentRule: smallExpected <= Math.floor(expected.length * 0.2),
      valid: total > 0 && minimumExpected > 0 && minimumExpected >= 1,
    },
  };
}
export function goodnessOfFitDensity(x: number, df: number) {
  return chiSquareDensity(x, df);
}
