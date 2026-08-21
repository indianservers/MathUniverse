import type { ComplexValue, IntegerValue, MathDiagnostic, MathValue, RationalValue } from "./types";

type Fraction = { numerator: bigint; denominator: bigint };

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left || 1n;
}

export function normalizeFraction(numerator: bigint, denominator: bigint): Fraction {
  if (denominator === 0n) return { numerator, denominator };
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
}

export function fractionValue(numerator: bigint, denominator = 1n): IntegerValue | RationalValue {
  const normalized = normalizeFraction(numerator, denominator);
  if (normalized.denominator === 1n) return { kind: "INTEGER", value: normalized.numerator.toString() };
  return { kind: "RATIONAL", numerator: normalized.numerator.toString(), denominator: normalized.denominator.toString() };
}

export function toFraction(value: MathValue): Fraction | undefined {
  if (value.kind === "INTEGER") return { numerator: BigInt(value.value), denominator: 1n };
  if (value.kind === "RATIONAL") return { numerator: BigInt(value.numerator), denominator: BigInt(value.denominator) };
  return undefined;
}

export function rationalAdd(left: Fraction, right: Fraction) { return normalizeFraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator); }
export function rationalSubtract(left: Fraction, right: Fraction) { return normalizeFraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator); }
export function rationalMultiply(left: Fraction, right: Fraction) { return normalizeFraction(left.numerator * right.numerator, left.denominator * right.denominator); }
export function rationalDivide(left: Fraction, right: Fraction) { return normalizeFraction(left.numerator * right.denominator, left.denominator * right.numerator); }

function asComplex(value: MathValue): { real: Fraction; imaginary: Fraction } | undefined {
  if (value.kind === "COMPLEX") {
    const real = toFraction(value.real); const imaginary = toFraction(value.imaginary);
    return real && imaginary ? { real, imaginary } : undefined;
  }
  const real = toFraction(value);
  return real ? { real, imaginary: { numerator: 0n, denominator: 1n } } : undefined;
}

function complexValue(real: Fraction, imaginary: Fraction): MathValue {
  if (imaginary.numerator === 0n) return fractionValue(real.numerator, real.denominator);
  return { kind: "COMPLEX", real: fractionValue(real.numerator, real.denominator), imaginary: fractionValue(imaginary.numerator, imaginary.denominator) } as ComplexValue;
}

export function applyArithmetic(operator: "+" | "-" | "*" | "/" | "^", leftValue: MathValue, rightValue: MathValue): { value?: MathValue; diagnostic?: MathDiagnostic } {
  const left = asComplex(leftValue); const right = asComplex(rightValue);
  if (!left || !right) return { diagnostic: { code: "TYPE_MISMATCH", severity: "ERROR", message: `Operator '${operator}' requires scalar numeric values.` } };
  if (operator === "+") return { value: complexValue(rationalAdd(left.real, right.real), rationalAdd(left.imaginary, right.imaginary)) };
  if (operator === "-") return { value: complexValue(rationalSubtract(left.real, right.real), rationalSubtract(left.imaginary, right.imaginary)) };
  if (operator === "*") return { value: complexValue(rationalSubtract(rationalMultiply(left.real, right.real), rationalMultiply(left.imaginary, right.imaginary)), rationalAdd(rationalMultiply(left.real, right.imaginary), rationalMultiply(left.imaginary, right.real))) };
  if (operator === "/") {
    const divisor = rationalAdd(rationalMultiply(right.real, right.real), rationalMultiply(right.imaginary, right.imaginary));
    if (divisor.numerator === 0n) return { value: { kind: "SPECIAL", state: "UNDEFINED", reason: "Division by zero" }, diagnostic: { code: "DIVISION_BY_ZERO", severity: "ERROR", message: "Division by zero is undefined." } };
    return { value: complexValue(rationalDivide(rationalAdd(rationalMultiply(left.real, right.real), rationalMultiply(left.imaginary, right.imaginary)), divisor), rationalDivide(rationalSubtract(rationalMultiply(left.imaginary, right.real), rationalMultiply(left.real, right.imaginary)), divisor)) };
  }
  if (right.imaginary.numerator !== 0n || right.real.denominator !== 1n) return { diagnostic: { code: "UNSUPPORTED_EXACT_EVALUATION", severity: "ERROR", message: "Exact powers currently require an integer exponent." } };
  const exponent = right.real.numerator;
  if (exponent < 0n) {
    const positive = applyArithmetic("^", leftValue, fractionValue(-exponent));
    return positive.value ? applyArithmetic("/", fractionValue(1n), positive.value) : positive;
  }
  let result: MathValue = fractionValue(1n); let base = leftValue; let power = exponent;
  while (power > 0n) { if (power % 2n === 1n) result = applyArithmetic("*", result, base).value ?? result; power /= 2n; if (power > 0n) base = applyArithmetic("*", base, base).value ?? base; }
  return { value: result };
}

export function formatValue(value: MathValue): string {
  switch (value.kind) {
    case "INTEGER": return value.value;
    case "RATIONAL": return `${value.numerator}/${value.denominator}`;
    case "DECIMAL": { const raw = value.coefficient.padStart(value.scale + 1, "0"); return value.scale ? `${raw.slice(0, -value.scale)}.${raw.slice(-value.scale)}` : raw; }
    case "SURD": return `${formatValue(value.coefficient)}√${value.radicand}`;
    case "COMPLEX": {
      const real = formatValue(value.real); const imaginary = formatValue(value.imaginary); const negative = imaginary.startsWith("-");
      return `${real} ${negative ? "-" : "+"} ${negative ? imaginary.slice(1) : imaginary}i`;
    }
    case "BOOLEAN": return String(value.value);
    case "VECTOR": return `(${value.values.map(formatValue).join(", ")})`;
    case "MATRIX": return `[${value.values.map((row) => `[${row.map(formatValue).join(", ")}]`).join(", ")}]`;
    case "LIST": return `[${value.values.map(formatValue).join(", ")}]`;
    case "SET": return `{${value.values.map(formatValue).join(", ")}}`;
    case "INTERVAL": return `${value.lowerInclusive ? "[" : "("}${value.lower ? formatValue(value.lower) : "-∞"}, ${value.upper ? formatValue(value.upper) : "∞"}${value.upperInclusive ? "]" : ")"}`;
    case "FUNCTION": return `function(${value.parameters.join(", ")})`;
    case "SPECIAL": return `${value.state}: ${value.reason}`;
    case "UNIT": return `${formatValue(value.magnitude)} ${value.unit}`;
  }
}

export function approximateValue(value: MathValue, precision = 12): string | undefined {
  const scalar = toFraction(value);
  if (scalar) return (Number(scalar.numerator) / Number(scalar.denominator)).toPrecision(precision).replace(/\.?0+$/, "");
  if (value.kind === "COMPLEX") return `${approximateValue(value.real, precision)} + ${approximateValue(value.imaginary, precision)}i`;
  return undefined;
}
