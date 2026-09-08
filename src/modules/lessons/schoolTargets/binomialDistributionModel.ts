import { randomBinomial } from "d3";

export type BinomialQuery = "exact" | "atMost" | "atLeast" | "between";
export function validateBinomial(n: number, p: number) {
  if (!Number.isInteger(n) || n < 1 || n > 20 || !Number.isFinite(p) || p < 0 || p > 1) throw new Error("n must be 1 to 20 and p must be 0 to 1");
}
export function choosePositions(n: number, r: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 20 || !Number.isInteger(r) || r < 0 || r > n) throw new Error("Invalid combination");
  let count = 1;
  for (let i = 1; i <= Math.min(r, n - r); i++) count = count * (n - i + 1) / i;
  return Math.round(count);
}
export function binomialMasses(n: number, p: number) {
  validateBinomial(n, p);
  return Array.from({ length: n + 1 }, (_, r) => choosePositions(n, r) * p ** r * (1 - p) ** (n - r));
}
export function matchesBinomialQuery(k: number, kind: BinomialQuery, a: number, b: number) {
  return kind === "exact" ? k === a : kind === "atMost" ? k <= a : kind === "atLeast" ? k >= a : k >= a && k <= b;
}
export function queryBinomial(masses: number[], kind: BinomialQuery, a: number, b = a) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= masses.length || b >= masses.length || (kind === "between" && a > b)) throw new Error("Invalid query bounds");
  return masses.reduce((sum, mass, k) => sum + (matchesBinomialQuery(k, kind, a, b) ? mass : 0), 0);
}
export function sampleBinomial(n: number, p: number, count: number, random: () => number = Math.random) {
  validateBinomial(n, p);
  if (!Number.isInteger(count) || count < 1 || count > 2000) throw new Error("Sample count must be 1 to 2000");
  const generator = randomBinomial.source(() => { const u = random(); if (!Number.isFinite(u) || u < 0 || u >= 1) throw new Error("Invalid random value"); return u; })(n, p);
  const counts = Array<number>(n + 1).fill(0);
  for (let i = 0; i < count; i++) counts[generator()]++;
  const mean = counts.reduce((sum, frequency, k) => sum + frequency * k, 0) / count;
  const variance = counts.reduce((sum, frequency, k) => sum + frequency * (k - mean) ** 2, 0) / count;
  return { counts, total: count, mean, variance };
}
// Lexicographic unranking avoids storing every arrangement when n is large.
export function binomialArrangement(n: number, r: number, rank: number): boolean[] {
  const total = choosePositions(n, r);
  if (!Number.isInteger(rank) || rank < 0 || rank >= total) throw new Error("Invalid arrangement index");
  let remaining = r;
  return Array.from({ length: n }, (_, i) => {
    if (remaining === 0) return false;
    const withSuccess = choosePositions(n - i - 1, remaining - 1);
    if (rank < withSuccess) { remaining--; return true; }
    rank -= withSuccess;
    return false;
  });
}
export function swapBinomialPositions(arrangement: boolean[], from: number, to: number) {
  if (![from, to].every(i => Number.isInteger(i) && i >= 0 && i < arrangement.length)) throw new Error("Invalid arrangement position");
  const next = [...arrangement];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
