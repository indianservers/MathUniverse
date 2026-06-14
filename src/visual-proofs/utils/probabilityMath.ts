export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function probability(successes: number, total: number) {
  return total <= 0 ? 0 : successes / total;
}

export function complementProbability(p: number) {
  return 1 - p;
}

export function unionProbability(pA: number, pB: number, pIntersection: number) {
  return clamp(pA + pB - pIntersection, 0, 1);
}

export function independentIntersection(pA: number, pB: number) {
  return pA * pB;
}

export function conditionalProbability(pIntersection: number, pCondition: number) {
  return pCondition <= 0 ? 0 : pIntersection / pCondition;
}

export function bayesPosterior(prior: number, likelihood: number, falsePositive: number) {
  const evidence = likelihood * prior + falsePositive * (1 - prior);
  return evidence <= 0 ? 0 : (likelihood * prior) / evidence;
}

export function totalProbability(partitions: { prior: number; conditional: number }[]) {
  return partitions.reduce((sum, part) => sum + part.prior * part.conditional, 0);
}

export function factorial(n: number): number {
  if (n <= 1) return 1;
  return Array.from({ length: n }, (_, index) => index + 1).reduce((product, value) => product * value, 1);
}

export function permutation(n: number, r: number) {
  if (r > n) return 0;
  return factorial(n) / factorial(n - r);
}

export function combination(n: number, r: number) {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function binomialProbability(n: number, k: number, p: number) {
  return combination(n, k) * p ** k * (1 - p) ** (n - k);
}

export function birthdayExact(peopleCount: number) {
  if (peopleCount > 365) return 1;
  let noMatch = 1;
  for (let index = 0; index < peopleCount; index += 1) {
    noMatch *= (365 - index) / 365;
  }
  return 1 - noMatch;
}

export function formatProbability(value: number) {
  return `${(clamp(value, 0, 1) * 100).toFixed(1)}%`;
}

export function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, "");
}
