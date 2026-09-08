import { normalCdf } from "../../../phase4/statistics";

function logGamma(value: number): number {
  const coefficients = [676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
  if (value < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  let x = 0.9999999999998099;
  const shifted = value - 1;
  coefficients.forEach((coefficient, index) => { x += coefficient / (shifted + index + 1); });
  const t = shifted + coefficients.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(x);
}

export function studentTDensity(x: number, dfValue: number) {
  const df = Math.max(1, dfValue);
  const logScale = logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI);
  return Math.exp(logScale - ((df + 1) / 2) * Math.log1p((x * x) / df));
}

export function studentTCdf(x: number, dfValue: number) {
  if (x === 0) return 0.5;
  const sign = x < 0 ? -1 : 1;
  const bound = Math.min(Math.abs(x), 30);
  const slices = 320;
  const step = bound / slices;
  let sum = studentTDensity(0, dfValue) + studentTDensity(bound, dfValue);
  for (let index = 1; index < slices; index += 1) sum += (index % 2 === 0 ? 2 : 4) * studentTDensity(index * step, dfValue);
  const area = sum * step / 3;
  return Math.max(0, Math.min(1, 0.5 + sign * area));
}

export function studentTQuantile(probabilityValue: number, dfValue: number): number {
  const probability = Math.max(0.000001, Math.min(0.999999, probabilityValue));
  if (probability === 0.5) return 0;
  if (probability < 0.5) return -studentTQuantile(1 - probability, dfValue);
  let low = 0, high = 20;
  for (let iteration = 0; iteration < 55; iteration += 1) { const middle = (low + high) / 2; if (studentTCdf(middle, dfValue) < probability) low = middle; else high = middle; }
  return (low + high) / 2;
}

export function studentTAnalysis(dfValue: number, alphaValue: number) {
  const df = Math.max(1, Math.round(dfValue)), alpha = Math.max(0.001, Math.min(0.5, alphaValue)), critical = studentTQuantile(1 - alpha / 2, df);
  return { df, alpha, tail: alpha / 2, critical, central: studentTCdf(critical, df) - studentTCdf(-critical, df), normalCentral: normalCdf(critical) - normalCdf(-critical), variance: df > 2 ? df / (df - 2) : Number.POSITIVE_INFINITY };
}
