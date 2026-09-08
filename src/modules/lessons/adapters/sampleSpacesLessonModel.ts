export type ExperimentStep = { label: string; outcomes: string[] };
export const sampleSpaceDefault: ExperimentStep[] = [{ label: "Coin", outcomes: ["H", "T"] }, { label: "Die", outcomes: ["1", "2", "3", "4", "5", "6"] }, { label: "Card", outcomes: ["A", "K", "Q"] }];
export function cartesianOutcomes(steps = sampleSpaceDefault): string[][] { return steps.reduce<string[][]>((rows, step) => rows.flatMap(row => step.outcomes.map(outcome => [...row, outcome])), [[]]); }
export function eventProbability(outcomes: string[][], predicate: (outcome: string[]) => boolean) { const favorable = outcomes.filter(predicate); return { favorable, count: favorable.length, total: outcomes.length, probability: outcomes.length ? favorable.length / outcomes.length : 0 }; }
