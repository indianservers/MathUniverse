function logGamma(value: number): number {
  const c = [
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
  c.forEach((v, i) => {
    x += v / (z + i + 1);
  });
  const t = z + c.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
  );
}
function gammaP(shape: number, x: number) {
  if (x <= 0) return 0;
  if (x < shape + 1) {
    let term = 1 / shape,
      sum = term;
    for (let n = 1; n < 220; n += 1) {
      term *= x / (shape + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) break;
    }
    return sum * Math.exp(-x + shape * Math.log(x) - logGamma(shape));
  }
  let b = x + 1 - shape,
    c = 1e30,
    d = 1 / b,
    h = d;
  for (let i = 1; i < 220; i += 1) {
    const a = -i * (i - shape);
    b += 2;
    d = a * d + b;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = b + a / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-14) break;
  }
  return 1 - Math.exp(-x + shape * Math.log(x) - logGamma(shape)) * h;
}
export function gammaDensity(
  x: number,
  shapeValue: number,
  scaleValue: number,
) {
  if (x <= 0) return 0;
  const shape = Math.max(0.1, shapeValue),
    scale = Math.max(0.01, scaleValue);
  return Math.exp(
    (shape - 1) * Math.log(x) -
      x / scale -
      logGamma(shape) -
      shape * Math.log(scale),
  );
}
export function gammaCdf(x: number, shapeValue: number, scaleValue: number) {
  return x <= 0
    ? 0
    : Math.max(
        0,
        Math.min(
          1,
          gammaP(Math.max(0.1, shapeValue), x / Math.max(0.01, scaleValue)),
        ),
      );
}
export function gammaAnalysis(shapeValue: number, scaleValue: number) {
  const shape = Math.max(0.1, shapeValue),
    scale = Math.max(0.01, scaleValue);
  return {
    shape,
    scale,
    rate: 1 / scale,
    mean: shape * scale,
    variance: shape * scale ** 2,
    std: Math.sqrt(shape) * scale,
    mode: shape >= 1 ? (shape - 1) * scale : 0,
  };
}
export function simulateGammaArrival(
  rateValue: number,
  eventNumberValue: number,
  seedValue: number,
) {
  const rate = Math.max(0.01, rateValue),
    eventNumber = Math.max(1, Math.round(eventNumberValue));
  let state = seedValue >>> 0,
    elapsed = 0;
  const arrivals: number[] = [];
  for (let i = 0; i < Math.max(8, eventNumber); i += 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    elapsed +=
      -Math.log(Math.max(Number.EPSILON, 1 - state / 4294967296)) / rate;
    arrivals.push(elapsed);
  }
  return {
    arrivals,
    waitingTime: arrivals[eventNumber - 1],
    eventNumber,
    rate,
  };
}
