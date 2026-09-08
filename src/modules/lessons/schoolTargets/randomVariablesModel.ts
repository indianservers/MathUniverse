export const COIN_OUTCOMES = ["HH", "HT", "TH", "TT"] as const;
export type CoinOutcome = typeof COIN_OUTCOMES[number];
export type OutcomeScores = [number, number, number, number];
export const RANDOM_VARIABLE_RULES = {
  heads: { label: "X = number of heads", scores: [2, 1, 1, 0] as OutcomeScores },
  tails: { label: "X = number of tails", scores: [0, 1, 1, 2] as OutcomeScores },
  same: { label: "X = 1 if coins match, 0 otherwise", scores: [1, 0, 0, 1] as OutcomeScores },
  payoff: { label: "X = 2 per head minus 1 per tail", scores: [4, 1, 1, -2] as OutcomeScores },
};
export function randomVariableGroups(scores: OutcomeScores) {
  if (!scores.every(Number.isFinite)) throw new RangeError("Every outcome needs one finite real value");
  const groups = new Map<number, CoinOutcome[]>();
  scores.forEach((value, i) => groups.set(value, [...(groups.get(value) ?? []), COIN_OUTCOMES[i]]));
  return [...groups.entries()].sort(([a], [b]) => b - a).map(([value, outcomes]) => ({ value, outcomes, probability: outcomes.length / 4 }));
}
export function tossMappedCoins(count: number, scores: OutcomeScores, rng = Math.random) {
  randomVariableGroups(scores);
  if (!Number.isInteger(count) || count < 0 || count > 1000) throw new RangeError("Invalid toss count");
  return Array.from({ length: count }, () => {
    const outcome = `${rng() < .5 ? "H" : "T"}${rng() < .5 ? "H" : "T"}` as CoinOutcome;
    return { outcome, value: scores[COIN_OUTCOMES.indexOf(outcome)] };
  });
}
