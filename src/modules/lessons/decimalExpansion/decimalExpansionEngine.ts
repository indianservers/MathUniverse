export type DecimalClassification = "terminating" | "repeating";

export type DecimalValidation =
  | { ok: true; numerator: number; denominator: number }
  | { ok: false; error: string };

export type DivisionStep = {
  index: number;
  remainder: number;
  dividend: number;
  digit: number | null;
  product: number | null;
  nextRemainder: number | null;
  repeatStartsAt?: number;
};

export type DecimalAnalysis = {
  numerator: number;
  denominator: number;
  sign: -1 | 1;
  reducedNumerator: number;
  reducedDenominator: number;
  wholePart: number;
  integerPart: string;
  digits: number[];
  nonRepeatingDigits: number[];
  repeatingDigits: number[];
  classification: DecimalClassification;
  decimalPlain: string;
  decimalDisplay: string;
  factorization: Array<{ prime: number; exponent: number }>;
  remainders: number[];
  steps: DivisionStep[];
  truncated: boolean;
};

const MAX_SUPPORTED = 1_000_000;

export function validateFraction(numerator: number, denominator: number): DecimalValidation {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) return { ok: false, error: "Use whole-number numerator and denominator values." };
  if (denominator === 0) return { ok: false, error: "The denominator cannot be 0." };
  if (Math.abs(numerator) > MAX_SUPPORTED || Math.abs(denominator) > MAX_SUPPORTED) return { ok: false, error: "Use integers with absolute value at most 1,000,000 for this preview." };
  return { ok: true, numerator, denominator };
}

export function gcd(a: number, b: number) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function normalizeFraction(numerator: number, denominator: number) {
  const validation = validateFraction(numerator, denominator);
  if (!validation.ok) throw new Error(validation.error);
  const sign = numerator === 0 ? 1 : Math.sign(numerator * denominator) < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return {
    numerator: sign * Math.abs(numerator / divisor),
    denominator: Math.abs(denominator / divisor),
    sign: sign as -1 | 1,
  };
}

export function primeFactorization(value: number) {
  let remaining = Math.abs(value);
  const factors: DecimalAnalysis["factorization"] = [];
  for (let prime = 2; prime * prime <= remaining; prime += prime === 2 ? 1 : 2) {
    if (remaining % prime !== 0) continue;
    let exponent = 0;
    while (remaining % prime === 0) {
      remaining /= prime;
      exponent += 1;
    }
    factors.push({ prime, exponent });
  }
  if (remaining > 1) factors.push({ prime: remaining, exponent: 1 });
  return factors;
}

export function isTerminatingDenominator(denominator: number) {
  let reduced = Math.abs(denominator);
  while (reduced % 2 === 0) reduced /= 2;
  while (reduced % 5 === 0) reduced /= 5;
  return reduced === 1;
}

export function analyzeDecimalExpansion(numerator: number, denominator: number, maxDigits = 80): DecimalAnalysis {
  const validation = validateFraction(numerator, denominator);
  if (!validation.ok) throw new Error(validation.error);
  const normalized = normalizeFraction(numerator, denominator);
  const absNumerator = Math.abs(normalized.numerator);
  const wholePart = Math.floor(absNumerator / normalized.denominator);
  let remainder = absNumerator % normalized.denominator;
  const integerPart = `${normalized.sign < 0 ? "-" : ""}${wholePart}`;
  const digits: number[] = [];
  const remainders: number[] = [remainder];
  const steps: DivisionStep[] = [{ index: 0, remainder, dividend: remainder, digit: null, product: null, nextRemainder: null }];
  const seen = new Map<number, number>();
  let repeatStartsAt: number | undefined;
  let truncated = false;

  while (remainder !== 0 && digits.length < maxDigits) {
    if (seen.has(remainder)) {
      repeatStartsAt = seen.get(remainder);
      steps[steps.length - 1] = { ...steps[steps.length - 1], repeatStartsAt };
      break;
    }
    seen.set(remainder, digits.length);
    const dividend = remainder * 10;
    const digit = Math.floor(dividend / normalized.denominator);
    const product = digit * normalized.denominator;
    const nextRemainder = dividend - product;
    digits.push(digit);
    steps.push({ index: steps.length, remainder, dividend, digit, product, nextRemainder });
    remainder = nextRemainder;
    remainders.push(remainder);
  }

  if (remainder !== 0 && repeatStartsAt === undefined) truncated = true;
  const classification: DecimalClassification = remainder === 0 ? "terminating" : "repeating";
  const nonRepeatingDigits = classification === "repeating" ? digits.slice(0, repeatStartsAt ?? 0) : digits;
  const repeatingDigits = classification === "repeating" ? digits.slice(repeatStartsAt ?? 0) : [];
  const decimalPlain = digits.length > 0 ? `${integerPart}.${digits.join("")}${classification === "repeating" ? "..." : ""}` : integerPart;
  const decimalDisplay = formatDecimalDisplay(integerPart, nonRepeatingDigits, repeatingDigits, classification);

  return {
    numerator,
    denominator,
    sign: normalized.sign,
    reducedNumerator: normalized.numerator,
    reducedDenominator: normalized.denominator,
    wholePart,
    integerPart,
    digits,
    nonRepeatingDigits,
    repeatingDigits,
    classification,
    decimalPlain,
    decimalDisplay,
    factorization: primeFactorization(normalized.denominator),
    remainders,
    steps,
    truncated,
  };
}

export function formatDecimalDisplay(integerPart: string, nonRepeating: number[], repeating: number[], classification: DecimalClassification) {
  if (nonRepeating.length === 0 && repeating.length === 0) return integerPart;
  if (classification === "terminating") return `${integerPart}.${nonRepeating.join("")}`;
  return `${integerPart}.${nonRepeating.join("")}${repeating.length ? `(${repeating.join("")})` : ""}...`;
}

export function factorizationText(factors: DecimalAnalysis["factorization"]) {
  if (factors.length === 0) return "1";
  return factors.map(({ prime, exponent }) => exponent === 1 ? `${prime}` : `${prime}${superscript(exponent)}`).join(" × ");
}

export function superscript(value: number) {
  const map: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return `${value}`.split("").map((char) => map[char] ?? char).join("");
}

export function predictionFeedback(prediction: string | null, analysis: DecimalAnalysis | null) {
  if (!prediction || !analysis) return "Make a prediction, then run long division to compare.";
  if (prediction === analysis.classification) return "Your prediction matches the long-division result.";
  if (prediction === "unsure") return "Good investigation move: the experiment now gives evidence.";
  return `Your prediction was ${prediction}, but the reduced denominator shows this decimal is ${analysis.classification}.`;
}

export function validatePracticeAnswer(questionId: string, answer: string) {
  const text = answer.toLowerCase();
  if (questionId === "13/125") return /terminat/.test(text);
  if (questionId === "7/30") return /repeat/.test(text);
  if (questionId === "11/24") return /24|2\^?3|2³/.test(text) && /3/.test(text) && /repeat/.test(text);
  return false;
}

export function validateExitTicket(answer: string) {
  const text = answer.toLowerCase();
  return /terminat/.test(text) && /200/.test(text) && /2|5|prime|factor/.test(text) && !/repeat/.test(text);
}
