import { gcd, simplifyFraction, type Fraction } from "./grade7MathUtils";

export function integerOperation(a: number, b: number, operation: "add" | "subtract" | "multiply" | "divide") {
  if (operation === "add") return a + b;
  if (operation === "subtract") return a - b;
  if (operation === "multiply") return a * b;
  if (b === 0) throw new Error("Cannot divide by zero.");
  return a / b;
}

export function solveSimpleEquation(a: number, b: number, c: number) {
  if (a === 0) throw new Error("Coefficient of x cannot be zero.");
  return (c - b) / a;
}

export function compareFractions(a: Fraction, b: Fraction) {
  const left = a.numerator * b.denominator;
  const right = b.numerator * a.denominator;
  return { left, right, comparison: left === right ? "equal" : left > right ? "greater" : "less" };
}

export function rationalValue(fraction: Fraction) {
  if (fraction.denominator === 0) throw new Error("Denominator cannot be zero.");
  return fraction.numerator / fraction.denominator;
}

export function percentValue(base: number, percent: number) {
  return base * percent / 100;
}

export function profitLoss(cost: number, selling: number) {
  const diff = selling - cost;
  return { amount: diff, percent: cost === 0 ? 0 : Math.abs(diff) / cost * 100, type: diff >= 0 ? "profit" : "loss" };
}

export function simpleInterest(principal: number, rate: number, time: number) {
  return principal * rate * time / 100;
}

export function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(values: number[]) {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const max = Math.max(...counts.values());
  return [...counts.entries()].filter(([, count]) => count === max).map(([value]) => value);
}

export function simplifyLikeTerms(xTerms: number[], constants: number[]) {
  return { xCoefficient: xTerms.reduce((sum, value) => sum + value, 0), constant: constants.reduce((sum, value) => sum + value, 0) };
}

export function substituteLinearExpression(coefficient: number, constant: number, x: number) {
  return coefficient * x + constant;
}

export function perpendicularBisectorCheck(ax: number, bx: number, midpoint: number) {
  const expected = (ax + bx) / 2;
  return { expected, error: Math.abs(midpoint - expected), ok: Math.abs(midpoint - expected) <= 0.05 };
}

export function triangleInequality(a: number, b: number, c: number) {
  return a + b > c && a + c > b && b + c > a;
}

export function angleBisectorCheck(leftAngle: number, rightAngle: number) {
  return { difference: Math.abs(leftAngle - rightAngle), ok: Math.abs(leftAngle - rightAngle) <= 1 };
}

export function fractionText(fraction: Fraction) {
  const simple = simplifyFraction(fraction);
  return `${simple.numerator}/${simple.denominator}`;
}

export function lcmByGcd(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}
