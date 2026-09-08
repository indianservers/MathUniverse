export function totalProbability(weight: number, rate1: number, rate2: number) {
  if (![weight, rate1, rate2].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) throw new RangeError("Probabilities must be between zero and one");
  const sources = [weight, 1 - weight].map((share, i) => {
    const rate = [rate1, rate2][i];
    return { share, rate, complement: 1 - rate, defective: share * rate, good: share * (1 - rate), expected: 100 * share };
  });
  const total = sources.reduce((sum, source) => sum + source.defective, 0);
  return { sources, total, expectedDefects: 100 * total, contributions: sources.map(source => total ? source.defective / total : null) };
}
export function probabilityControl(value: number) {
  if (!Number.isFinite(value)) throw new RangeError("Probability must be finite");
  return Math.round(Math.max(0, Math.min(1, value)) * 100) / 100;
}
export const TOTAL_PRACTICE = [
  { title: "Online quiz platform", text: "Users come from Ads (70%) and Referrals (30%). P(click | Ads) = 0.03; P(click | Referrals) = 0.06.", weight: .7, rate1: .03, rate2: .06, event: "click" },
  { title: "Quality control", text: "Parts come from Line A (0.55) and Line B (0.45). P(fail | A) = 0.01; P(fail | B) = 0.04.", weight: .55, rate1: .01, rate2: .04, event: "fail" },
  { title: "Medical test", text: "Hypothetical population: Sick (5%), Healthy (95%). P(positive | Sick) = 0.98; P(positive | Healthy) = 0.02.", weight: .05, rate1: .98, rate2: .02, event: "positive" },
];
