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

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["hearts", "diamonds", "clubs", "spades"];

export function simulateCoins(trials: number): CoinSimulation {
  const safeTrials = clampInteger(trials, 1, 10000);
  let heads = 0;
  const convergence: TrialPoint[] = [];
  const step = Math.max(1, Math.floor(safeTrials / 120));

  for (let trial = 1; trial <= safeTrials; trial += 1) {
    if (Math.random() < 0.5) heads += 1;
    if (trial === 1 || trial === safeTrials || trial % step === 0) {
      convergence.push({ trial, value: heads / trial, expected: 0.5 });
    }
  }

  return { heads, tails: safeTrials - heads, convergence };
}

export function simulateDice(trials: number, diceCount: 1 | 2): DiceSimulation {
  const safeTrials = clampInteger(trials, 1, 10000);
  const min = diceCount;
  const max = diceCount * 6;
  const counts = new Map<number, number>();
  const rolls: number[] = [];

  for (let trial = 0; trial < safeTrials; trial += 1) {
    let total = 0;
    for (let die = 0; die < diceCount; die += 1) total += randomInteger(1, 6);
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

export function drawCards(count: number): CardDraw[] {
  const safeCount = clampInteger(count, 1, 10);
  const deck = suits.flatMap((suit) => ranks.map((rank) => ({
    rank,
    suit,
    color: suit === "hearts" || suit === "diamonds" ? "red" as const : "black" as const,
  })));
  shuffle(deck);
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

export function clampInteger(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(0, index);
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}
