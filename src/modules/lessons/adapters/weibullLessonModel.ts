function gamma(value: number): number {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7,
  ];
  if (value < 0.5)
    return Math.PI / (Math.sin(Math.PI * value) * gamma(1 - value));
  let x = 0.9999999999998099;
  const shifted = value - 1;
  coefficients.forEach((coefficient, index) => {
    x += coefficient / (shifted + index + 1);
  });
  const t = shifted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (shifted + 0.5) * Math.exp(-t) * x;
}

export function weibullDensity(
  time: number,
  shapeValue: number,
  scaleValue: number,
) {
  if (time < 0) return 0;
  const shape = Math.max(0.05, shapeValue),
    scale = Math.max(0.01, scaleValue);
  if (time === 0)
    return shape < 1 ? Number.POSITIVE_INFINITY : shape === 1 ? 1 / scale : 0;
  return (
    (shape / scale) *
    (time / scale) ** (shape - 1) *
    Math.exp(-((time / scale) ** shape))
  );
}

export function weibullSurvival(
  time: number,
  shapeValue: number,
  scaleValue: number,
) {
  if (time < 0) return 1;
  return Math.exp(
    -((time / Math.max(0.01, scaleValue)) ** Math.max(0.05, shapeValue)),
  );
}

export function weibullCdf(
  time: number,
  shapeValue: number,
  scaleValue: number,
) {
  return 1 - weibullSurvival(time, shapeValue, scaleValue);
}

export function weibullHazard(
  time: number,
  shapeValue: number,
  scaleValue: number,
) {
  if (time < 0) return 0;
  const shape = Math.max(0.05, shapeValue),
    scale = Math.max(0.01, scaleValue);
  if (time === 0)
    return shape < 1 ? Number.POSITIVE_INFINITY : shape === 1 ? 1 / scale : 0;
  return (shape / scale) * (time / scale) ** (shape - 1);
}

export function weibullQuantile(
  probabilityValue: number,
  shapeValue: number,
  scaleValue: number,
) {
  const probability = Math.max(0, Math.min(0.999999999, probabilityValue));
  return (
    Math.max(0.01, scaleValue) *
    (-Math.log1p(-probability)) ** (1 / Math.max(0.05, shapeValue))
  );
}

export function weibullAnalysis(shapeValue: number, scaleValue: number) {
  const shape = Math.max(0.05, shapeValue),
    scale = Math.max(0.01, scaleValue);
  const mean = scale * gamma(1 + 1 / shape);
  return {
    shape,
    scale,
    mean,
    median: weibullQuantile(0.5, shape, scale),
    variance: scale ** 2 * (gamma(1 + 2 / shape) - gamma(1 + 1 / shape) ** 2),
    mode: shape > 1 ? scale * ((shape - 1) / shape) ** (1 / shape) : 0,
  };
}

export function simulateWeibull(
  shapeValue: number,
  scaleValue: number,
  sampleSizeValue: number,
  seedValue: number,
) {
  const size = Math.max(1, Math.min(10000, Math.round(sampleSizeValue)));
  let state = seedValue >>> 0;
  const values = Array.from({ length: size }, () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return weibullQuantile(state / 4294967296, shapeValue, scaleValue);
  }).sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / size;
  return {
    values,
    mean,
    median: values[Math.floor((size - 1) / 2)],
    std: Math.sqrt(
      values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / size,
    ),
    percentile5: values[Math.floor((size - 1) * 0.05)],
    percentile95: values[Math.floor((size - 1) * 0.95)],
  };
}
