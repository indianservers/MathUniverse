export function bayesPosterior(prior: number, likelihood: number, falsePositive: number) {
  const evidence = prior * likelihood + (1 - prior) * falsePositive;
  const posterior = evidence === 0 ? 0 : (prior * likelihood) / evidence;
  return { evidence, posterior, numerator: prior * likelihood, denominator: evidence };
}

export const bayesPresets = {
  medical: { prior: 0.01, likelihood: 0.95, falsePositive: 0.05 },
  factory: { prior: 0.08, likelihood: 0.9, falsePositive: 0.12 },
  bag: { prior: 0.5, likelihood: 0.7, falsePositive: 0.3 },
  spam: { prior: 0.2, likelihood: 0.85, falsePositive: 0.1 },
};
