export type CoinEvent = "H" | "T" | "either";
export type DieEvent = "even" | "odd" | "prime" | "six" | "above3" | "any";
export const DIE_EVENTS: Record<DieEvent, { label: string; values: number[] }> = {
  even: { label: "Even (2, 4, 6)", values: [2, 4, 6] }, odd: { label: "Odd (1, 3, 5)", values: [1, 3, 5] },
  prime: { label: "Prime (2, 3, 5)", values: [2, 3, 5] }, six: { label: "Six (6)", values: [6] },
  above3: { label: "Greater than 3 (4, 5, 6)", values: [4, 5, 6] }, any: { label: "Any face (1–6)", values: [1, 2, 3, 4, 5, 6] },
};
export function independentEvents(coin: CoinEvent, die: DieEvent) {
  const outcomes = (["H", "T"] as const).flatMap(face => Array.from({ length: 6 }, (_, i) => ({ coin: face, die: i + 1,
    inA: coin === "either" || coin === face, inB: DIE_EVENTS[die].values.includes(i + 1) })));
  const countA = outcomes.filter(p => p.inA).length, countB = outcomes.filter(p => p.inB).length;
  const countAB = outcomes.filter(p => p.inA && p.inB).length;
  return { outcomes, countA, countB, countAB, pA: countA / 12, pB: countB / 12, pAB: countAB / 12, conditional: countAB / countA };
}
export type SimulationStats = { trials: number; hits: number };
export function simulateIndependent(count: number, coin: CoinEvent, die: DieEvent, rng = Math.random): SimulationStats {
  if (!Number.isInteger(count) || count < 0 || count > 10000) throw new RangeError("Trial batch must be between 0 and 10000");
  let hits = 0;
  for (let i = 0; i < count; i++) {
    const face = rng() < .5 ? "H" : "T", roll = 1 + Math.floor(rng() * 6);
    if ((coin === "either" || coin === face) && DIE_EVENTS[die].values.includes(roll)) hits++;
  }
  return { trials: count, hits };
}
export const URN_COMPARISON = { redBefore: 2 / 3, blueBefore: 1 / 3, redAfterRed: 1 / 2, blueAfterRed: 1 / 2 };
