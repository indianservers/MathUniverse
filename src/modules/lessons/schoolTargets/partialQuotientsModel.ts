import { gcd, gcdSteps } from "../../../visual-proofs/utils/numberTheoryMath";

export function partialQuotients(numerator: number, denominator: number) {
  if (![numerator, denominator].every(v => Number.isInteger(v) && v >= 1 && v <= 1_000_000)) throw new Error("Enter positive integers from 1 to 1,000,000.");
  const divisor = gcd(numerator, denominator);
  const steps = numerator < denominator ? [{ a: numerator, b: denominator, q: 0, r: numerator }, ...gcdSteps(numerator, denominator)] : gcdSteps(numerator, denominator);
  let p0 = 0, p1 = 1, q0 = 1, q1 = 0;
  const convergents = steps.map((step, index) => {
    const p = step.q * p1 + p0, q = step.q * q1 + q0;
    [p0, p1, q0, q1] = [p1, p, q1, q];
    return { index, p, q, decimal: p / q, error: Math.abs(p * denominator - numerator * q) / (q * denominator) };
  });
  return { numerator, denominator, divisor, reduced: [numerator / divisor, denominator / divisor] as const, steps, terms: steps.map(step => step.q), convergents };
}
export function decimalFraction(text: string): [number, number] {
  if (!/^\d+(?:\.\d{1,6})?$/.test(text.trim())) throw new Error("Enter a positive decimal with up to six decimal places.");
  const [whole, digits = ""] = text.trim().split(".");
  const denominator = 10 ** digits.length, numerator = Number(whole) * denominator + Number(digits || 0);
  if (!Number.isSafeInteger(numerator) || numerator <= 0) throw new Error("Decimal is outside the supported range.");
  const divisor = gcd(numerator, denominator), result: [number, number] = [numerator / divisor, denominator / divisor];
  partialQuotients(...result);
  return result;
}
export function reconstructQuotients(terms: number[]) {
  if (!terms.length || terms.length > 64 || !terms.every((v, i) => Number.isInteger(v) && v >= (i === 0 ? 0 : 1) && v <= 1_000_000)) throw new Error("Invalid partial quotients.");
  let numerator = BigInt(terms.at(-1)!), denominator = 1n;
  for (let i = terms.length - 2; i >= 0; i--) [numerator, denominator] = [BigInt(terms[i]) * numerator + denominator, numerator];
  return { numerator, denominator };
}
export function checkQuotientAnswer(text: string, numerator: number, denominator: number) {
  const trimmed = text.trim();
  if (!/^\[?\s*\d+(?:\s*[,;]\s*\d+)*\s*\]?$/.test(trimmed) || trimmed.startsWith("[") !== trimmed.endsWith("]")) return false;
  const terms = (trimmed.startsWith("[") ? trimmed.slice(1, -1) : trimmed).split(/[,;]/).map(Number);
  try { const result = reconstructQuotients(terms); return result.numerator * BigInt(denominator) === result.denominator * BigInt(numerator); } catch { return false; }
}
export function continuedFractionTex(terms: number[]): string {
  if (!terms.length) return "";
  let result = String(terms.at(-1));
  for (let i = terms.length - 2; i >= 0; i--) result = `${terms[i]}+\\cfrac{1}{${result}}`;
  return result;
}
export function quotientNotation(terms: number[]) { return `[${terms[0]}${terms.length > 1 ? `; ${terms.slice(1).join(", ")}` : ""}]`; }
