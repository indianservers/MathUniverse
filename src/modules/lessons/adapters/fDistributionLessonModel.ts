function logGamma(value: number): number {
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
  const shifted = value - 1;
  coefficients.forEach((coefficient, index) => {
    x += coefficient / (shifted + index + 1);
  });
  const t = shifted + coefficients.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) +
    (shifted + 0.5) * Math.log(t) -
    t +
    Math.log(x)
  );
}

function betaFraction(a: number, b: number, x: number) {
  const tiny = 1e-30;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let result = d;
  for (let iteration = 1; iteration <= 160; iteration += 1) {
    const even =
      (iteration * (b - iteration) * x) /
      ((a + 2 * iteration - 1) * (a + 2 * iteration));
    d = 1 + even * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + even / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    result *= d * c;
    const odd =
      -((a + iteration) * (a + b + iteration) * x) /
      ((a + 2 * iteration) * (a + 2 * iteration + 1));
    d = 1 + odd * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + odd / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    result *= delta;
    if (Math.abs(delta - 1) < 1e-13) break;
  }
  return result;
}

function regularizedBeta(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log1p(-x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (front * betaFraction(a, b, x)) / a
    : 1 - (front * betaFraction(b, a, 1 - x)) / b;
}

export function fDensity(
  x: number,
  numeratorDfValue: number,
  denominatorDfValue: number,
) {
  if (x <= 0) return 0;
  const d1 = Math.max(1, numeratorDfValue),
    d2 = Math.max(1, denominatorDfValue);
  const a = d1 / 2,
    b = d2 / 2;
  return Math.exp(
    a * Math.log(d1 / d2) +
      (a - 1) * Math.log(x) -
      (a + b) * Math.log1p((d1 * x) / d2) -
      (logGamma(a) + logGamma(b) - logGamma(a + b)),
  );
}

export function fCdf(
  x: number,
  numeratorDfValue: number,
  denominatorDfValue: number,
) {
  if (x <= 0) return 0;
  const d1 = Math.max(1, numeratorDfValue),
    d2 = Math.max(1, denominatorDfValue);
  return regularizedBeta((d1 * x) / (d1 * x + d2), d1 / 2, d2 / 2);
}

export function fQuantile(
  probabilityValue: number,
  numeratorDfValue: number,
  denominatorDfValue: number,
) {
  const probability = Math.max(0.000001, Math.min(0.999999, probabilityValue));
  let low = 0,
    high = 2;
  while (
    fCdf(high, numeratorDfValue, denominatorDfValue) < probability &&
    high < 1e6
  )
    high *= 2;
  for (let iteration = 0; iteration < 70; iteration += 1) {
    const middle = (low + high) / 2;
    if (fCdf(middle, numeratorDfValue, denominatorDfValue) < probability)
      low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

export function fDistributionAnalysis(
  d1Value: number,
  d2Value: number,
  alphaValue: number,
) {
  const d1 = Math.max(1, Math.round(d1Value)),
    d2 = Math.max(1, Math.round(d2Value));
  const alpha = Math.max(0.001, Math.min(0.25, alphaValue));
  const critical = fQuantile(1 - alpha, d1, d2);
  return {
    d1,
    d2,
    alpha,
    critical,
    leftArea: fCdf(critical, d1, d2),
    mean: d2 > 2 ? d2 / (d2 - 2) : Number.POSITIVE_INFINITY,
    variance:
      d2 > 4
        ? (2 * d2 ** 2 * (d1 + d2 - 2)) / (d1 * (d2 - 2) ** 2 * (d2 - 4))
        : Number.POSITIVE_INFINITY,
  };
}
