export function exponentialDensity(time: number, rate: number) {
  return time < 0 ? 0 : rate * Math.exp(-rate * time);
}

export function exponentialSurvival(time: number, rate: number) {
  return time < 0 ? 1 : Math.exp(-rate * time);
}

export function exponentialCdf(time: number, rate: number) {
  return 1 - exponentialSurvival(time, rate);
}

export function exponentialAnalysis(rateValue: number, thresholdValue: number) {
  const rate = Math.max(0.01, rateValue), threshold = Math.max(0, thresholdValue);
  return {
    rate,
    threshold,
    density: exponentialDensity(threshold, rate),
    survival: exponentialSurvival(threshold, rate),
    cumulative: exponentialCdf(threshold, rate),
    mean: 1 / rate,
    variance: 1 / rate ** 2,
  };
}

export function simulateExponentialArrivals(rateValue: number, horizonValue: number, seedValue: number) {
  const rate = Math.max(0.01, rateValue), horizon = Math.max(0.01, horizonValue);
  let state = seedValue >>> 0;
  const intervals: number[] = [];
  let elapsed = 0;
  while (intervals.length < 1000) {
    state = (1664525 * state + 1013904223) >>> 0;
    const interval = -Math.log(Math.max(Number.EPSILON, 1 - state / 4294967296)) / rate;
    if (elapsed + interval > horizon) break;
    intervals.push(interval);
    elapsed += interval;
  }
  return { intervals, elapsed, horizon, average: intervals.length ? elapsed / intervals.length : 0 };
}
