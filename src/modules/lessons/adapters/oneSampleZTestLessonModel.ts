import { normalCdf, normalSurvival } from "../../../phase4/statistics";

export type ZAlternative = "two-sided" | "greater" | "less";

export function oneSampleZTest(
  sampleMeanValue: number,
  nullMeanValue: number,
  sigmaValue: number,
  sampleSizeValue: number,
  alphaValue: number,
  alternative: ZAlternative,
) {
  const sampleMean = Number.isFinite(sampleMeanValue) ? sampleMeanValue : 0;
  const nullMean = Number.isFinite(nullMeanValue) ? nullMeanValue : 0;
  const sigma = Math.max(0.0001, Math.abs(sigmaValue));
  const n = Math.max(1, Math.round(sampleSizeValue));
  const alpha = Math.max(0.001, Math.min(0.2, alphaValue));
  const se = sigma / Math.sqrt(n);
  const z = (sampleMean - nullMean) / se;
  const pValue =
    alternative === "greater"
      ? normalSurvival(z)
      : alternative === "less"
        ? normalCdf(z)
        : 2 * normalSurvival(Math.abs(z));
  return {
    sampleMean,
    nullMean,
    sigma,
    n,
    alpha,
    alternative,
    se,
    z,
    pValue: Math.min(1, pValue),
    reject: pValue < alpha,
    effectSize: (sampleMean - nullMean) / sigma,
  };
}
