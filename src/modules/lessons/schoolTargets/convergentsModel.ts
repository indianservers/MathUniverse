import { gcd } from "../../../visual-proofs/utils/numberTheoryMath";
export interface SqrtTwoConvergent { k: number; p: number; q: number; decimal: number; signedError: number; determinant: number }
export function sqrtTwoConvergents(count: number): SqrtTwoConvergent[] {
  if (!Number.isInteger(count) || count < 1 || count > 14) throw new Error("Choose 1 to 14 convergents.");
  let p2 = 0, p1 = 1, q2 = 1, q1 = 0;
  return Array.from({ length: count }, (_, k) => {
    const a = k === 0 ? 1 : 2, p = a * p1 + p2, q = a * q1 + q2;
    const determinant = p * q1 - p1 * q;
    // Rationalizing the difference avoids cancellation for very close approximations.
    const signedError = (p * p - 2 * q * q) / (q * q * (p / q + Math.SQRT2));
    [p2, p1, q2, q1] = [p1, p, q1, q];
    return { k, p, q, decimal: p / q, signedError, determinant };
  });
}
export function convergentCap(cap: number) {
  if (!Number.isInteger(cap) || cap < 1 || cap > 100) throw new Error("Denominator cap must be 1 to 100.");
  const convergents = sqrtTwoConvergents(14), eligible = convergents.filter(c => c.q <= cap), best = eligible.at(-1)!;
  const candidates = Array.from({ length: cap }, (_, i) => { const q = i + 1, p = Math.round(Math.SQRT2 * q); return { p, q, error: Math.abs(p / q - Math.SQRT2) }; }).filter(c => gcd(c.p, c.q) === 1).sort((a, b) => a.error - b.error || a.q - b.q);
  const nonConvergents = candidates.filter(c => !convergents.some(v => v.p === c.p && v.q === c.q));
  return { eligible, best, bestRational: candidates[0], nonConvergents: nonConvergents.slice(0, 3) };
}
export function isEquivalentConvergent(pText: string, qText: string, expectedP: number, expectedQ: number) {
  if (![pText, qText].every(s => /^\d+$/.test(s.trim()))) return false;
  const p = Number(pText), q = Number(qText);
  return Number.isSafeInteger(p) && Number.isSafeInteger(q) && p > 0 && q > 0 && BigInt(p) * BigInt(expectedQ) === BigInt(q) * BigInt(expectedP);
}
