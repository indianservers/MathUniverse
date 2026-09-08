export type PopulationShape =
  "normal" | "uniform" | "right" | "left" | "bimodal";
function rng(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
function normal(random: () => number) {
  const u1 = Math.max(Number.EPSILON, random()),
    u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
function observation(shape: PopulationShape, random: () => number) {
  if (shape === "normal") return 50 + 10 * normal(random);
  if (shape === "uniform") return 50 + (random() - 0.5) * Math.sqrt(1200);
  if (shape === "right")
    return 40 - 10 * Math.log(Math.max(Number.EPSILON, 1 - random()));
  if (shape === "left")
    return 60 + 10 * Math.log(Math.max(Number.EPSILON, 1 - random()));
  return (random() < 0.5 ? 41 : 59) + Math.sqrt(19) * normal(random);
}
export function simulateSamplingDistribution(
  shape: PopulationShape,
  sampleSizeValue: number,
  repetitionsValue: number,
  seedValue: number,
  replacement = true,
) {
  const sampleSize = Math.min(
      replacement ? 10000 : 1000,
      Math.max(2, Math.round(sampleSizeValue)),
    ),
    repetitions = Math.max(10, Math.min(50000, Math.round(repetitionsValue))),
    random = rng(seedValue),
    means: number[] = [];
  const population = replacement
    ? []
    : Array.from({ length: 1000 }, () => observation(shape, random));
  let lastSample: number[] = [];
  for (let repetition = 0; repetition < repetitions; repetition += 1) {
    const selected = new Set<number>();
    const sample = Array.from({ length: Math.min(sampleSize, 1000) }, () => {
      if (replacement) return observation(shape, random);
      let index = Math.floor(random() * population.length);
      while (selected.has(index))
        index = Math.floor(random() * population.length);
      selected.add(index);
      return population[index];
    });
    const mean = sample.reduce((sum, value) => sum + value, 0) / sampleSize;
    means.push(mean);
    if (repetition === repetitions - 1)
      lastSample = sample.sort((a, b) => a - b);
  }
  const empiricalMean =
      means.reduce((sum, value) => sum + value, 0) / repetitions,
    empiricalStd = Math.sqrt(
      means.reduce((sum, value) => sum + (value - empiricalMean) ** 2, 0) /
        repetitions,
    ),
    sorted = [...means].sort((a, b) => a - b),
    bins = Array(32).fill(0) as number[],
    low = 40,
    high = 60;
  means.forEach((value) => {
    const index = Math.max(
      0,
      Math.min(31, Math.floor(((value - low) / (high - low)) * 32)),
    );
    bins[index] += 1;
  });
  return {
    shape,
    sampleSize,
    repetitions,
    means,
    bins,
    lastSample,
    empiricalMean,
    empiricalStd,
    bias: empiricalMean - 50,
    min: sorted[0],
    max: sorted.at(-1) ?? 0,
    lower95: sorted[Math.floor((repetitions - 1) * 0.025)],
    upper95: sorted[Math.floor((repetitions - 1) * 0.975)],
    standardError:
      (10 / Math.sqrt(sampleSize)) *
      (replacement ? 1 : Math.sqrt((1000 - sampleSize) / 999)),
    replacement,
  };
}
export function samplingConvergence(
  shape: PopulationShape,
  sampleSize: number,
  seed: number,
) {
  return [100, 1000, 5000, 20000].map((repetitions) => {
    const result = simulateSamplingDistribution(
      shape,
      sampleSize,
      repetitions,
      seed,
    );
    return {
      repetitions,
      mean: result.empiricalMean,
      std: result.empiricalStd,
    };
  });
}
