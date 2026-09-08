export function clampBernoulliP(value: number) {
  return Math.max(0, Math.min(1, value));
}
export function bernoulliStats(value: number) {
  const p = clampBernoulliP(value);
  return { p, failure: 1 - p, mean: p, variance: p * (1 - p) };
}
export function simulateBernoulli(
  pValue: number,
  trialsValue: number,
  seedValue = 521,
) {
  const p = clampBernoulliP(pValue);
  const trials = Math.max(1, Math.round(trialsValue));
  let seed = seedValue >>> 0;
  let successes = 0;
  for (let index = 0; index < trials; index += 1) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    if (seed / 4294967296 < p) successes += 1;
  }
  return {
    trials,
    successes,
    failures: trials - successes,
    empiricalSuccess: successes / trials,
    empiricalFailure: (trials - successes) / trials,
  };
}
