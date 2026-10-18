import { totalProbability } from "./totalProbabilityModel";
export function bayesSources(weight: number, rate1: number, rate2: number) {
  const model = totalProbability(weight, rate1, rate2);
  return { ...model, posterior: model.contributions };
}
export function frequencyChips(expected: number) {
  const nearest = Math.round(expected);
  const amount = nearest > 0 && Math.abs(expected - nearest) <= Number.EPSILON * Math.max(1, expected) * 4 ? nearest : Math.max(0, expected);
  return Array.from({ length: Math.ceil(amount) }, (_, i) => Math.min(1, amount - i));
}
export const BAYES_PRACTICE = bayesSources(.7, .01, .04);
