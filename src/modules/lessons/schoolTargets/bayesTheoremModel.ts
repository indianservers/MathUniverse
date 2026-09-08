import { totalProbability } from "./totalProbabilityModel";
export function bayesSources(weight: number, rate1: number, rate2: number) {
  const model = totalProbability(weight, rate1, rate2);
  return { ...model, posterior: model.contributions };
}
export function frequencyChips(expected: number) {
  return Array.from({ length: Math.ceil(Math.max(0, expected)) }, (_, i) => Math.min(1, expected - i));
}
export const BAYES_PRACTICE = bayesSources(.7, .01, .04);
