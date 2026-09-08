export type TAlternative = "two-sided" | "greater" | "less";

function logGamma(value: number) {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7,
  ];
  if (value < 0.5)
    return (
      Math.log(Math.PI) -
      Math.log(Math.sin(Math.PI * value)) -
      logGamma(1 - value)
    );
  let x = 0.9999999999998099;
  const z = value - 1;
  coefficients.forEach((coefficient, index) => {
    x += coefficient / (z + index + 1);
  });
  const t = z + coefficients.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
  );
}

function betaFraction(a: number, b: number, x: number) {
  const maxIterations = 160;
  const tiny = 1e-30;
  const qab = a + b,
    qap = a + 1,
    qam = a - 1;
  let c = 1,
    d = 1 - (qab * x) / qap;
  d = (1 / Math.max(tiny, Math.abs(d))) * Math.sign(d || 1);
  let h = d;
  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    d = Math.abs(d) < tiny ? tiny : d;
    c = 1 + aa / c;
    c = Math.abs(c) < tiny ? tiny : c;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    d = Math.abs(d) < tiny ? tiny : d;
    c = 1 + aa / c;
    c = Math.abs(c) < tiny ? tiny : c;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 3e-12) break;
  }
  return h;
}

function regularizedBeta(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const factor = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log(1 - x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (factor * betaFraction(a, b, x)) / a
    : 1 - (factor * betaFraction(b, a, 1 - x)) / b;
}

export function studentTCdf(t: number, df: number) {
  if (!(df > 0)) return Number.NaN;
  const beta = regularizedBeta(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? 1 - beta / 2 : beta / 2;
}

export function studentTQuantile(probability: number, df: number) {
  let low = -20,
    high = 20;
  for (let index = 0; index < 100; index += 1) {
    const middle = (low + high) / 2;
    if (studentTCdf(middle, df) < probability) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

export function oneSampleTTest(
  source: number[],
  nullMeanValue: number,
  alphaValue: number,
  alternative: TAlternative,
) {
  const values = source.filter(Number.isFinite);
  const n = values.length;
  const mean = n ? values.reduce((sum, value) => sum + value, 0) / n : 0;
  const variance =
    n > 1
      ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (n - 1)
      : 0;
  const sd = Math.sqrt(variance);
  const se = n ? sd / Math.sqrt(n) : 0;
  const nullMean = Number.isFinite(nullMeanValue) ? nullMeanValue : 0;
  const alpha = Math.max(0.001, Math.min(0.2, alphaValue));
  const df = Math.max(1, n - 1);
  const statistic = se ? (mean - nullMean) / se : 0;
  const pValue =
    alternative === "greater"
      ? 1 - studentTCdf(statistic, df)
      : alternative === "less"
        ? studentTCdf(statistic, df)
        : 2 * (1 - studentTCdf(Math.abs(statistic), df));
  const critical = studentTQuantile(1 - alpha / 2, df);
  const margin = critical * se;
  return {
    values,
    n,
    mean,
    variance,
    sd,
    se,
    nullMean,
    alpha,
    df,
    statistic,
    pValue: Math.min(1, pValue),
    reject: pValue < alpha,
    critical,
    margin,
    lower: mean - margin,
    upper: mean + margin,
    effectSize: sd ? (mean - nullMean) / sd : 0,
  };
}
