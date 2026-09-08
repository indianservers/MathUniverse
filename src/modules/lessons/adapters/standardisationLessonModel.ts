import { normalCdf, normalQuantile } from "../../../phase4/statistics";

export function standardise(value: number, mean: number, sigmaValue: number) {
  return (value - mean) / Math.max(0.001, sigmaValue);
}

export function destandardise(z: number, mean: number, sigmaValue: number) {
  return mean + z * Math.max(0.001, sigmaValue);
}

export function standardisationAnalysis(
  value: number,
  mean: number,
  sigmaValue: number,
) {
  const sigma = Math.max(0.001, sigmaValue),
    z = standardise(value, mean, sigma),
    percentile = normalCdf(z);
  return { value, mean, sigma, z, percentile, upperTail: 1 - percentile };
}

export function standardisationTable(
  mean: number,
  sigmaValue: number,
  currentValue: number,
) {
  const currentProbability = normalCdf(
    standardise(currentValue, mean, sigmaValue),
  );
  return [0.05, 0.25, 0.5, 0.75, currentProbability, 0.97725].map(
    (probability) => {
    const z = probability === 0.5 ? 0 : normalQuantile(probability);
      return { probability, z, raw: destandardise(z, mean, sigmaValue) };
    },
  );
}
