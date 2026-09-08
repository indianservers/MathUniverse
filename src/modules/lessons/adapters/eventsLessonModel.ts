export type DiceOutcome = readonly [number, number];
export const diceOutcomes: DiceOutcome[] = Array.from({ length: 36 }, (_, index) => [Math.floor(index / 6) + 1, index % 6 + 1] as const);
export type DiceEvent = "doubles" | "sum7" | "even" | "atLeast6" | "none" | "certain";
export function eventOutcomes(kind: DiceEvent) { return diceOutcomes.filter(([a, b]) => kind === "doubles" ? a === b : kind === "sum7" ? a + b === 7 : kind === "even" ? (a + b) % 2 === 0 : kind === "atLeast6" ? a >= 6 || b >= 6 : kind === "certain" ? true : false); }
export function eventSummary(outcomes: DiceOutcome[]) { return { count: outcomes.length, total: 36, probability: outcomes.length / 36, complement: 36 - outcomes.length }; }
