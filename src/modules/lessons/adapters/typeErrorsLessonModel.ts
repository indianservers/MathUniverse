import { normalCdf } from "../../../phase4/statistics";

export function typeErrorsAnalysis(
  mu0Value: number,
  mu1Value: number,
  sigmaValue: number,
  sampleSizeValue: number,
  criticalValue: number,
) {
  const mu0 = Number.isFinite(mu0Value) ? mu0Value : 0;
  const mu1 = Number.isFinite(mu1Value) ? mu1Value : mu0;
  const sigma = Math.max(0.001, sigmaValue);
  const sampleSize = Math.max(2, Math.round(sampleSizeValue));
  const critical = Number.isFinite(criticalValue) ? criticalValue : 1.645;
  const standardError = sigma / Math.sqrt(sampleSize);
  const delta = (mu1 - mu0) / standardError;
  const alpha = 1 - normalCdf(critical);
  const beta = normalCdf(critical - delta);
  return {
    mu0,
    mu1,
    sigma,
    sampleSize,
    critical,
    standardError,
    delta,
    alpha,
    beta,
    power: 1 - beta,
    correctNull: 1 - alpha,
  };
}
