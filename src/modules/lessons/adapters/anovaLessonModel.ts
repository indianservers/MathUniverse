import { fCdf, fQuantile } from "./fDistributionLessonModel";
import { studentTCdf } from "./oneSampleTTestLessonModel";

export function oneWayAnova(groupSource: number[][], alphaValue = 0.05) {
  const groups = groupSource.map((group) => group.filter(Number.isFinite)),
    summaries = groups.map((values) => {
      const n = values.length,
        mean = n ? values.reduce((sum, value) => sum + value, 0) / n : 0,
        ss = values.reduce((sum, value) => sum + (value - mean) ** 2, 0);
      return { values, n, mean, ss, variance: n > 1 ? ss / (n - 1) : 0 };
    }),
    totalN = summaries.reduce((sum, item) => sum + item.n, 0),
    grandMean = totalN
      ? summaries.reduce((sum, item) => sum + item.mean * item.n, 0) / totalN
      : 0,
    ssBetween = summaries.reduce(
      (sum, item) => sum + item.n * (item.mean - grandMean) ** 2,
      0,
    ),
    ssWithin = summaries.reduce((sum, item) => sum + item.ss, 0),
    ssTotal = ssBetween + ssWithin,
    dfBetween = Math.max(1, summaries.length - 1),
    dfWithin = Math.max(1, totalN - summaries.length),
    dfTotal = Math.max(1, totalN - 1),
    msBetween = ssBetween / dfBetween,
    msWithin = ssWithin / dfWithin,
    statistic = msWithin ? msBetween / msWithin : 0,
    pValue = 1 - fCdf(statistic, dfBetween, dfWithin),
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    critical = fQuantile(1 - alpha, dfBetween, dfWithin),
    etaSquared = ssTotal ? ssBetween / ssTotal : 0,
    omegaSquared =
      ssTotal + msWithin
        ? (ssBetween - dfBetween * msWithin) / (ssTotal + msWithin)
        : 0,
    pairCount = Math.max(1, (summaries.length * (summaries.length - 1)) / 2),
    comparisons = summaries.flatMap((first, i) =>
      summaries.slice(i + 1).map((second, offset) => {
        const j = i + offset + 1,
          se = Math.sqrt(
            msWithin * (1 / Math.max(1, first.n) + 1 / Math.max(1, second.n)),
          ),
          t = se ? (second.mean - first.mean) / se : 0,
          rawP = 2 * (1 - studentTCdf(Math.abs(t), dfWithin)),
          adjustedP = Math.min(1, rawP * pairCount);
        return {
          first: i,
          second: j,
          difference: second.mean - first.mean,
          se,
          t,
          rawP,
          adjustedP,
          significant: adjustedP < alpha,
        };
      }),
    );
  return {
    groups,
    summaries,
    totalN,
    grandMean,
    ssBetween,
    ssWithin,
    ssTotal,
    dfBetween,
    dfWithin,
    dfTotal,
    msBetween,
    msWithin,
    statistic,
    pValue,
    alpha,
    critical,
    reject: pValue < alpha,
    etaSquared,
    omegaSquared,
    comparisons,
  };
}

function seeded(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function randomAnovaGroups(seedValue: number) {
  const random = seeded(seedValue);
  return [8, 12.5, 16.5].map((mean) =>
    Array.from(
      { length: 6 },
      () => mean + (random() + random() + random() - 1.5) * 4,
    ),
  );
}
