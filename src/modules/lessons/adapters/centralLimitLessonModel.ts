import { normalQuantile } from "../../../phase4/statistics";

export type CltPopulation =
  "exponential" | "uniform" | "bernoulli" | "lognormal";
function rng(seedValue: number) {
  let state = seedValue >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
function normal(random: () => number) {
  return (
    Math.sqrt(-2 * Math.log(Math.max(Number.EPSILON, random()))) *
    Math.cos(2 * Math.PI * random())
  );
}
function populationParameters(population: CltPopulation) {
  if (population === "exponential") return { mean: 1, sd: 1 };
  if (population === "uniform") return { mean: 1, sd: 1 / Math.sqrt(3) };
  if (population === "bernoulli") return { mean: 0.3, sd: Math.sqrt(0.21) };
  const variance = (Math.E - 1) * Math.E;
  return { mean: Math.sqrt(Math.E), sd: Math.sqrt(variance) };
}
function draw(population: CltPopulation, random: () => number) {
  if (population === "exponential")
    return -Math.log(Math.max(Number.EPSILON, 1 - random()));
  if (population === "uniform") return 2 * random();
  if (population === "bernoulli") return random() < 0.3 ? 1 : 0;
  return Math.exp(normal(random));
}
export function simulateCentralLimit(
  population: CltPopulation,
  sampleSizeValue: number,
  repetitionsValue: number,
  seedValue: number,
) {
  const n = Math.max(2, Math.round(sampleSizeValue)),
    repetitions = Math.max(100, Math.min(30000, Math.round(repetitionsValue))),
    random = rng(seedValue),
    means: number[] = [];
  let lastSample: number[] = [];
  for (let repetition = 0; repetition < repetitions; repetition += 1) {
    const sample: number[] = [];
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      const value = draw(population, random);
      sample.push(value);
      sum += value;
    }
    means.push(sum / n);
    if (repetition === repetitions - 1)
      lastSample = sample.sort((a, b) => a - b);
  }
  const parameters = populationParameters(population),
    mean = means.reduce((a, b) => a + b, 0) / repetitions,
    variance =
      means.reduce((sum, value) => sum + (value - mean) ** 2, 0) / repetitions,
    sd = Math.sqrt(variance),
    skewness =
      means.reduce((sum, value) => sum + ((value - mean) / sd) ** 3, 0) /
      repetitions,
    excessKurtosis =
      means.reduce((sum, value) => sum + ((value - mean) / sd) ** 4, 0) /
        repetitions -
      3,
    sorted = [...means].sort((a, b) => a - b),
    bins = Array(36).fill(0) as number[],
    low = parameters.mean - (4 * parameters.sd) / Math.sqrt(n),
    high = parameters.mean + (4 * parameters.sd) / Math.sqrt(n);
  means.forEach((value) => {
    const index = Math.max(
      0,
      Math.min(35, Math.floor(((value - low) / (high - low)) * 36)),
    );
    bins[index] += 1;
  });
  const qq = Array.from({ length: 31 }, (_, i) => {
    const probability = (i + 0.5) / 31;
    return {
      theoretical: normalQuantile(probability),
      sample: (sorted[Math.floor(probability * (repetitions - 1))] - mean) / sd,
    };
  });
  return {
    population,
    n,
    repetitions,
    ...parameters,
    theoreticalSe: parameters.sd / Math.sqrt(n),
    means,
    lastSample,
    bins,
    simulatedMean: mean,
    simulatedSd: sd,
    skewness,
    excessKurtosis,
    qq,
  };
}
export function cltCheckpoints(population: CltPopulation, seed: number) {
  return [5, 10, 30, 50, 100].map((n) => {
    const result = simulateCentralLimit(population, n, 5000, seed + n);
    return {
      n,
      se: result.theoreticalSe,
      skewness: result.skewness,
      excessKurtosis: result.excessKurtosis,
    };
  });
}
