import { isPrime } from "../../../visual-proofs/utils/numberTheoryMath";
// Odlyzko's first-zero table, rounded as published: https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros1
export const zetaZeroHeights = [14.134725142, 21.022039639, 25.010857580, 30.424876126, 32.935061588, 37.586178159];
const counts = [0];
for (let n = 1; n <= 10000; n++) counts[n] = counts[n - 1] + (isPrime(n) ? 1 : 0);
export function logarithmicIntegral(x: number) {
  if (!Number.isFinite(x) || x < 2 || x > 10000) throw new Error("x must be between 2 and 10,000.");
  // li(x)=Ei(log x), DLMF 6.2.8 and convergent Ei series 6.6.1.
  const z = Math.log(x); let sum = .5772156649015329 + Math.log(z), powerOverFactorial = 1;
  for (let k = 1; k <= 200; k++) { powerOverFactorial *= z / k; const term = powerOverFactorial / k; sum += term; if (Math.abs(term) < 1e-15 * Math.abs(sum)) break; }
  return sum;
}
export function primeCountSample(x: number) {
  if (!Number.isInteger(x) || x < 2 || x > 10000) throw new Error("Choose an integer x from 2 to 10,000.");
  const count = counts[x], li = logarithmicIntegral(x); let next = x + 1;
  while (!isPrime(next)) next++;
  return { x, count, li, error: count - li, next };
}
export function primeCountSeries(max: number) {
  if (![100, 1000, 10000].includes(max)) throw new Error("Unsupported plot range.");
  return Array.from({ length: max - 9 }, (_, i) => { const x = i + 10, count = counts[x], li = logarithmicIntegral(x); return { x, count, li, error: count - li }; });
}
export function checkPrimePractice(answers: string[], meaning: string) {
  const sample = primeCountSample(100);
  return answers.length === 3 && answers.every((value, i) => value.trim() !== "" && Number.isFinite(Number(value)) && Math.abs(Number(value) - [sample.count, sample.li, sample.error][i]) < (i === 0 ? .001 : .055)) && meaning === "over";
}
