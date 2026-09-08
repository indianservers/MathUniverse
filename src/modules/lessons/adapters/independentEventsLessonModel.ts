export type SpinnerColor = "blue" | "red" | "green";
export type SpinnerWeights = Record<SpinnerColor, number>;
export type JointCounts = Record<SpinnerColor, { heads: number; tails: number }>;

export const defaultSpinnerWeights: SpinnerWeights = { blue: 0.49, red: 0.25, green: 0.26 };

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function normalizeWeights(weights: SpinnerWeights): SpinnerWeights {
  const total = Math.max(0.0001, weights.blue + weights.red + weights.green);
  return {
    blue: weights.blue / total,
    red: weights.red / total,
    green: weights.green / total,
  };
}

export function simulateSpinnerCoin(
  trials: number,
  weights: SpinnerWeights,
  independent: boolean,
  seed = 506,
): JointCounts {
  const random = seededRandom(seed);
  const normalized = normalizeWeights(weights);
  const counts: JointCounts = {
    blue: { heads: 0, tails: 0 },
    red: { heads: 0, tails: 0 },
    green: { heads: 0, tails: 0 },
  };
  const headsByColor = independent
    ? { blue: 0.5, red: 0.5, green: 0.5 }
    : { blue: 0.72, red: 0.38, green: 0.2 };

  for (let index = 0; index < trials; index += 1) {
    const spin = random();
    const color: SpinnerColor = spin < normalized.blue
      ? "blue"
      : spin < normalized.blue + normalized.red ? "red" : "green";
    const side = random() < headsByColor[color] ? "heads" : "tails";
    counts[color][side] += 1;
  }
  return counts;
}

export function independenceSummary(counts: JointCounts) {
  const colors = Object.values(counts);
  const total = colors.reduce((sum, count) => sum + count.heads + count.tails, 0);
  const blue = counts.blue.heads + counts.blue.tails;
  const heads = colors.reduce((sum, count) => sum + count.heads, 0);
  const pBlue = blue / total;
  const pHeads = heads / total;
  const pJoint = counts.blue.heads / total;
  const product = pBlue * pHeads;
  const difference = Math.abs(pJoint - product);
  return { total, blue, heads, pBlue, pHeads, pJoint, product, difference, independent: difference < 0.02 };
}

export function conditionalProbability(counts: JointCounts, color: SpinnerColor) {
  const total = counts[color].heads + counts[color].tails;
  return total === 0 ? 0 : counts[color].heads / total;
}
