import { partialQuotients, reconstructQuotients } from "./partialQuotientsModel";
export function euclideanLink(a: number, b: number) {
  const model = partialQuotients(a, b);
  return { ...model, chain: [a, b, ...model.steps.map(s => s.r)], reciprocalRows: model.steps.map((s, i) => ({ ...s, index: i, reciprocal: s.r === 0 ? null : [s.b, s.r] as const })) };
}
export function reverseEuclideanLink(fields: string[]) {
  if (!fields.length || fields.length > 12 || fields.some(s => !/^\d+$/.test(s.trim()))) throw new Error("Enter 1 to 12 integer partial quotients.");
  const terms = fields.map(Number), result = reconstructQuotients(terms);
  if (result.numerator < 1n || result.numerator > 1_000_000n || result.denominator < 1n || result.denominator > 1_000_000n) throw new Error("The reconstructed numerator and denominator must be 1 to 1,000,000.");
  return euclideanLink(Number(result.numerator), Number(result.denominator));
}
export function euclideanArea(a: number, b: number) {
  if (![a, b].every(v => Number.isInteger(v) && v > 0 && v <= 1_000_000)) throw new Error("Invalid area dimensions.");
  const quotient = Math.floor(a / b), remainder = a % b;
  const groups = quotient <= 24 ? Array.from({ length: quotient }, (_, i) => ({ x: i * b / a, width: b / a, count: 1, value: b })) : [{ x: 0, width: quotient * b / a, count: quotient, value: quotient * b }];
  return { quotient, remainder, groups, remainderStart: quotient * b / a, remainderWidth: remainder / a };
}
export function checkReverseFraction(text: string, terms: number[]) {
  const match = text.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match || BigInt(match[2]) === 0n) return false;
  const expected = reconstructQuotients(terms);
  return BigInt(match[1]) * expected.denominator === BigInt(match[2]) * expected.numerator;
}
