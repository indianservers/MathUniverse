export type TrialPoint = {
  trial: number;
  value: number;
  expected: number;
};

export type FrequencyBin = {
  label: string;
  count: number;
  expected: number;
};

export type CoinSimulation = {
  heads: number;
  tails: number;
  convergence: TrialPoint[];
};

export type DiceSimulation = {
  rolls: number[];
  frequencies: FrequencyBin[];
};

export type CardDraw = {
  rank: string;
  suit: string;
  color: "red" | "black";
};

export type RandomWalkSimulation = {
  path: TrialPoint[];
  finalPosition: number;
  maxDistance: number;
};

export type MonteCarloPiSimulation = {
  estimate: number;
  inside: number;
  total: number;
  convergence: TrialPoint[];
  sample: Array<{ x: number; y: number; inside: boolean }>;
};

export type SamplingDistributionSimulation = {
  sampleMeans: number[];
  histogram: FrequencyBin[];
  populationMean: number;
  meanOfMeans: number;
  standardError: number;
};

export type ConfidenceIntervalSimulation = {
  intervals: Array<{ index: number; mean: number; lower: number; upper: number; captures: boolean }>;
  captureRate: number;
  expectedCaptureRate: number;
};

export type HypothesisTestResult = {
  z: number;
  pValue: number;
  reject: boolean;
  conclusion: string;
};

export type MarkovChainSimulation = {
  states: string[];
  steps: Array<{ step: number; probabilities: number[] }>;
  steadyState: number[];
};

export type BayesScenario = {
  prior: number;
  sensitivity: number;
  falsePositiveRate: number;
  posterior: number;
};

type RandomSource = () => number;

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["hearts", "diamonds", "clubs", "spades"];

export function simulateCoins(trials: number, seed?: number): CoinSimulation {
  const safeTrials = clampInteger(trials, 1, 10000);
  const random = randomSource(seed);
  let heads = 0;
  const convergence: TrialPoint[] = [];
  const step = Math.max(1, Math.floor(safeTrials / 120));

  for (let trial = 1; trial <= safeTrials; trial += 1) {
    if (random() < 0.5) heads += 1;
    if (trial === 1 || trial === safeTrials || trial % step === 0) {
      convergence.push({ trial, value: heads / trial, expected: 0.5 });
    }
  }

  return { heads, tails: safeTrials - heads, convergence };
}

export function simulateDice(trials: number, diceCount: 1 | 2, seed?: number): DiceSimulation {
  const safeTrials = clampInteger(trials, 1, 10000);
  const random = randomSource(seed);
  const min = diceCount;
  const max = diceCount * 6;
  const counts = new Map<number, number>();
  const rolls: number[] = [];

  for (let trial = 0; trial < safeTrials; trial += 1) {
    let total = 0;
    for (let die = 0; die < diceCount; die += 1) total += randomInteger(1, 6, random);
    rolls.push(total);
    counts.set(total, (counts.get(total) ?? 0) + 1);
  }

  const frequencies = Array.from({ length: max - min + 1 }, (_, index) => {
    const outcome = min + index;
    return {
      label: String(outcome),
      count: counts.get(outcome) ?? 0,
      expected: safeTrials * diceProbability(outcome, diceCount),
    };
  });

  return { rolls, frequencies };
}

export function drawCards(count: number, seed?: number): CardDraw[] {
  const safeCount = clampInteger(count, 1, 10);
  const random = randomSource(seed);
  const deck = suits.flatMap((suit) => ranks.map((rank) => ({
    rank,
    suit,
    color: suit === "hearts" || suit === "diamonds" ? "red" as const : "black" as const,
  })));
  shuffle(deck, random);
  return deck.slice(0, safeCount);
}

export function binomialDistribution(n: number, p: number) {
  const safeN = clampInteger(n, 1, 50);
  const safeP = Math.min(1, Math.max(0, p));
  return Array.from({ length: safeN + 1 }, (_, k) => ({
    label: String(k),
    count: combination(safeN, k) * (safeP ** k) * ((1 - safeP) ** (safeN - k)),
    expected: 0,
  }));
}

export function combination(n: number, r: number) {
  if (r < 0 || r > n) return 0;
  const k = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = (result * (n - k + i)) / i;
  return result;
}

export function diceProbability(outcome: number, diceCount: 1 | 2) {
  if (diceCount === 1) return outcome >= 1 && outcome <= 6 ? 1 / 6 : 0;
  let ways = 0;
  for (let a = 1; a <= 6; a += 1) {
    for (let b = 1; b <= 6; b += 1) if (a + b === outcome) ways += 1;
  }
  return ways / 36;
}

export function simulateRandomWalk(steps: number, drift = 0.5, seed?: number): RandomWalkSimulation {
  const safeSteps = clampInteger(steps, 1, 5000);
  const safeDrift = clampProbability(drift);
  const random = randomSource(seed);
  let position = 0;
  let maxDistance = 0;
  const path: TrialPoint[] = [{ trial: 0, value: 0, expected: 0 }];
  const sampleStep = Math.max(1, Math.floor(safeSteps / 180));

  for (let step = 1; step <= safeSteps; step += 1) {
    position += random() < safeDrift ? 1 : -1;
    maxDistance = Math.max(maxDistance, Math.abs(position));
    if (step === safeSteps || step % sampleStep === 0) path.push({ trial: step, value: position, expected: step * (2 * safeDrift - 1) });
  }

  return { path, finalPosition: position, maxDistance };
}

export function simulateMonteCarloPi(samples: number, seed?: number): MonteCarloPiSimulation {
  const safeSamples = clampInteger(samples, 10, 20000);
  const random = randomSource(seed);
  let inside = 0;
  const convergence: TrialPoint[] = [];
  const sample: MonteCarloPiSimulation["sample"] = [];
  const sampleStep = Math.max(1, Math.floor(safeSamples / 160));

  for (let index = 1; index <= safeSamples; index += 1) {
    const x = random();
    const y = random();
    const hit = x * x + y * y <= 1;
    if (hit) inside += 1;
    if (sample.length < 320) sample.push({ x, y, inside: hit });
    if (index === safeSamples || index % sampleStep === 0) convergence.push({ trial: index, value: (4 * inside) / index, expected: Math.PI });
  }

  return { estimate: (4 * inside) / safeSamples, inside, total: safeSamples, convergence, sample };
}

export function simulateSamplingDistribution(samples: number, sampleSize: number, seed?: number): SamplingDistributionSimulation {
  const safeSamples = clampInteger(samples, 20, 5000);
  const safeSampleSize = clampInteger(sampleSize, 2, 100);
  const random = randomSource(seed);
  const sampleMeans: number[] = [];

  for (let sampleIndex = 0; sampleIndex < safeSamples; sampleIndex += 1) {
    let sum = 0;
    for (let index = 0; index < safeSampleSize; index += 1) {
      sum += randomInteger(1, 6, random);
    }
    sampleMeans.push(sum / safeSampleSize);
  }

  const meanOfMeans = average(sampleMeans);
  const standardError = standardDeviation(sampleMeans);
  return {
    sampleMeans,
    histogram: histogram(sampleMeans, 12),
    populationMean: 3.5,
    meanOfMeans,
    standardError,
  };
}

export function simulateConfidenceIntervals(repetitions: number, sampleSize: number, confidenceLevel = 0.95, seed?: number): ConfidenceIntervalSimulation {
  const safeRepetitions = clampInteger(repetitions, 10, 500);
  const safeSampleSize = clampInteger(sampleSize, 5, 200);
  const zCritical = confidenceLevel >= 0.99 ? 2.576 : confidenceLevel >= 0.95 ? 1.96 : 1.645;
  const random = randomSource(seed);
  const populationMean = 3.5;
  const populationSigma = Math.sqrt(35 / 12);
  const intervals = Array.from({ length: safeRepetitions }, (_, index) => {
    const values = Array.from({ length: safeSampleSize }, () => randomInteger(1, 6, random));
    const mean = average(values);
    const margin = zCritical * populationSigma / Math.sqrt(safeSampleSize);
    const lower = mean - margin;
    const upper = mean + margin;
    return { index: index + 1, mean, lower, upper, captures: lower <= populationMean && upper >= populationMean };
  });
  return {
    intervals,
    captureRate: intervals.filter((interval) => interval.captures).length / safeRepetitions,
    expectedCaptureRate: confidenceLevel,
  };
}

export function oneProportionZTest(successes: number, trials: number, nullProbability: number, alpha = 0.05): HypothesisTestResult {
  const safeTrials = clampInteger(trials, 1, 100000);
  const safeSuccesses = clampInteger(successes, 0, safeTrials);
  const p0 = Math.min(0.999, Math.max(0.001, nullProbability));
  const pHat = safeSuccesses / safeTrials;
  const standardError = Math.sqrt((p0 * (1 - p0)) / safeTrials);
  const z = (pHat - p0) / standardError;
  const pValue = 2 * (1 - normalCdf(Math.abs(z)));
  const reject = pValue < alpha;
  return {
    z,
    pValue,
    reject,
    conclusion: reject
      ? `Reject H0 at alpha=${alpha}; the observed proportion ${round(pHat)} is unlikely if p=${round(p0)}.`
      : `Do not reject H0 at alpha=${alpha}; the observed proportion ${round(pHat)} is plausible if p=${round(p0)}.`,
  };
}

export function bayesPosterior(prior: number, sensitivity: number, falsePositiveRate: number): BayesScenario {
  const safePrior = clampProbability(prior);
  const safeSensitivity = clampProbability(sensitivity);
  const safeFalsePositive = clampProbability(falsePositiveRate);
  const evidence = safeSensitivity * safePrior + safeFalsePositive * (1 - safePrior);
  const posterior = evidence > 0 ? (safeSensitivity * safePrior) / evidence : 0;
  return { prior: safePrior, sensitivity: safeSensitivity, falsePositiveRate: safeFalsePositive, posterior };
}

export function simulateMarkovChain(transition: number[][], initial: number[], steps: number, stateNames = ["A", "B"]): MarkovChainSimulation {
  const safeSteps = clampInteger(steps, 1, 60);
  const size = Math.min(transition.length, initial.length, stateNames.length);
  const normalizedTransition = transition.slice(0, size).map((row) => normalizeProbabilities(row.slice(0, size)));
  let current = normalizeProbabilities(initial.slice(0, size));
  const output: MarkovChainSimulation["steps"] = [{ step: 0, probabilities: current }];

  for (let step = 1; step <= safeSteps; step += 1) {
    current = multiplyDistribution(current, normalizedTransition);
    output.push({ step, probabilities: current });
  }

  return { states: stateNames.slice(0, size), steps: output, steadyState: current };
}

export function clampInteger(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
}

function randomInteger(min: number, max: number, random: RandomSource = Math.random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[], random: RandomSource = Math.random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(0, index, random);
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function randomSource(seed?: number): RandomSource {
  if (seed === undefined) return Math.random;
  let state = Math.abs(Math.floor(seed)) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function clampProbability(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values: number[]) {
  const mean = average(values);
  return values.length ? Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length) : 0;
}

function histogram(values: number[], binCount: number): FrequencyBin[] {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min || 1) / binCount;
  return Array.from({ length: binCount }, (_, index) => {
    const start = min + index * width;
    const end = index === binCount - 1 ? max : start + width;
    const count = values.filter((value) => value >= start && (index === binCount - 1 ? value <= end : value < end)).length;
    return { label: `${round(start)}-${round(end)}`, count, expected: values.length / binCount };
  });
}

function normalCdf(z: number) {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * a);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return 0.5 * (1 + sign * erf);
}

function normalizeProbabilities(values: number[]) {
  const sanitized = values.map((value) => Math.max(0, Number.isFinite(value) ? value : 0));
  const total = sanitized.reduce((sum, value) => sum + value, 0) || 1;
  return sanitized.map((value) => value / total);
}

function multiplyDistribution(distribution: number[], transition: number[][]) {
  return distribution.map((_, column) => transition.reduce((sum, row, rowIndex) => sum + distribution[rowIndex] * row[column], 0));
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
