export type NumberSystemMode = "indian" | "international";
export type RoundingPlace = "ten" | "hundred" | "thousand" | "lakh" | "million";

const INDIAN_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

export function sanitizeWholeNumber(input: string): number | null {
  const cleaned = input.replace(/[,\s]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isSafeInteger(value) ? value : null;
}

export function formatNumberBySystem(value: number, mode: NumberSystemMode) {
  const raw = Math.max(0, Math.floor(value)).toString();
  if (mode === "international") return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const lastThree = raw.slice(-3);
  const other = raw.slice(0, -3);
  return other ? `${other.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}` : lastThree;
}

export function expandedForm(value: number) {
  return Math.max(0, Math.floor(value))
    .toString()
    .split("")
    .map((digit, index, digits) => Number(digit) * 10 ** (digits.length - index - 1))
    .filter(Boolean)
    .map((part) => part.toLocaleString("en-IN"))
    .join(" + ");
}

export function numberName(value: number, mode: NumberSystemMode) {
  if (value === 0) return "zero";
  if (mode === "indian") {
    const crore = Math.floor(value / 10000000);
    const lakh = Math.floor((value % 10000000) / 100000);
    const thousand = Math.floor((value % 100000) / 1000);
    const rest = value % 1000;
    return [
      crore ? `${underThousand(crore)} crore` : "",
      lakh ? `${underThousand(lakh)} lakh` : "",
      thousand ? `${underThousand(thousand)} thousand` : "",
      rest ? underThousand(rest) : "",
    ].filter(Boolean).join(" ");
  }

  const million = Math.floor(value / 1000000);
  const thousand = Math.floor((value % 1000000) / 1000);
  const rest = value % 1000;
  return [
    million ? `${underThousand(million)} million` : "",
    thousand ? `${underThousand(thousand)} thousand` : "",
    rest ? underThousand(rest) : "",
  ].filter(Boolean).join(" ");
}

function underThousand(value: number): string {
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  const restText = rest < 10 ? INDIAN_ONES[rest] : rest < 20 ? TEENS[rest - 10] : [TENS[Math.floor(rest / 10)], INDIAN_ONES[rest % 10]].filter(Boolean).join(" ");
  return [hundreds ? `${INDIAN_ONES[hundreds]} hundred` : "", restText].filter(Boolean).join(" ");
}

export function roundToPlace(value: number, place: RoundingPlace) {
  const factor = { ten: 10, hundred: 100, thousand: 1000, lakh: 100000, million: 1000000 }[place];
  return Math.round(value / factor) * factor;
}

export type ArithmeticStep = {
  expression: string;
  operation: string;
};

type Token = number | "+" | "-" | "*" | "/" | "(" | ")";

export function normalizeExpression(input: string) {
  return input.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");
}

export function evaluateArithmeticExpression(input: string): { value: number; steps: ArithmeticStep[]; warning?: string } {
  const normalized = normalizeExpression(input);
  if (!/^[\d+\-*/().]+$/.test(normalized)) throw new Error("Use only numbers, +, -, *, /, and brackets.");
  const tokens = tokenize(normalized);
  const parser = new Parser(tokens);
  const value = parser.parseExpression();
  if (!parser.done()) throw new Error("Check the brackets or operation signs.");
  const flatWarning = commonMistakeWarning(normalized);
  return { value: roundDecimal(value), steps: parser.steps, warning: flatWarning };
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i];
    if (/\d|\./.test(char)) {
      let value = char;
      i += 1;
      while (i < input.length && /[\d.]/.test(input[i])) {
        value += input[i];
        i += 1;
      }
      const number = Number(value);
      if (!Number.isFinite(number)) throw new Error("One number is not valid.");
      tokens.push(number);
      continue;
    }
    if ("+-*/()".includes(char)) tokens.push(char as Token);
    i += 1;
  }
  return tokens;
}

class Parser {
  index = 0;
  steps: ArithmeticStep[] = [];

  constructor(private readonly tokens: Token[]) {}

  done() {
    return this.index >= this.tokens.length;
  }

  parseExpression(): number {
    let value = this.parseTerm();
    while (this.peek() === "+" || this.peek() === "-") {
      const operator = this.consume() as "+" | "-";
      const right = this.parseTerm();
      const before = value;
      value = operator === "+" ? value + right : value - right;
      this.steps.push({ expression: `${formatCalc(before)} ${operator} ${formatCalc(right)} = ${formatCalc(value)}`, operation: operator === "+" ? "Add after multiplication/division are done." : "Subtract after multiplication/division are done." });
    }
    return value;
  }

  parseTerm(): number {
    let value = this.parseFactor();
    while (this.peek() === "*" || this.peek() === "/") {
      const operator = this.consume() as "*" | "/";
      const right = this.parseFactor();
      if (operator === "/" && right === 0) throw new Error("Division by zero is not allowed.");
      const before = value;
      value = operator === "*" ? value * right : value / right;
      this.steps.push({ expression: `${formatCalc(before)} ${operator} ${formatCalc(right)} = ${formatCalc(value)}`, operation: operator === "*" ? "Multiply before addition/subtraction." : "Divide before addition/subtraction." });
    }
    return value;
  }

  parseFactor(): number {
    const token = this.consume();
    if (typeof token === "number") return token;
    if (token === "(") {
      const value = this.parseExpression();
      if (this.consume() !== ")") throw new Error("A closing bracket is missing.");
      this.steps.push({ expression: `( ... ) = ${formatCalc(value)}`, operation: "Solve inside brackets first." });
      return value;
    }
    if (token === "-") return -this.parseFactor();
    throw new Error("The expression has an operation in the wrong place.");
  }

  private peek() {
    return this.tokens[this.index];
  }

  private consume() {
    return this.tokens[this.index++];
  }
}

function commonMistakeWarning(input: string) {
  if (/[+|-]\d+[*|/]/.test(input)) return "Do not simply work left to right. Multiplication or division must happen before addition or subtraction.";
  if (input.includes("(")) return "Brackets change the order. Finish the bracket group first.";
  return undefined;
}

export type Fraction = { numerator: number; denominator: number };
export type FractionOperation = "add" | "subtract" | "multiply" | "divide" | "compare" | "simplify";

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(fraction: Fraction): Fraction {
  if (fraction.denominator === 0) throw new Error("A denominator cannot be zero.");
  const sign = fraction.denominator < 0 ? -1 : 1;
  const divisor = gcd(fraction.numerator, fraction.denominator);
  return { numerator: sign * fraction.numerator / divisor, denominator: Math.abs(fraction.denominator) / divisor };
}

export function operateFractions(a: Fraction, b: Fraction, operation: FractionOperation) {
  if (a.denominator === 0 || b.denominator === 0) throw new Error("A denominator cannot be zero.");
  const common = lcm(a.denominator, b.denominator);
  let result: Fraction;
  if (operation === "add") result = { numerator: a.numerator * (common / a.denominator) + b.numerator * (common / b.denominator), denominator: common };
  else if (operation === "subtract") result = { numerator: a.numerator * (common / a.denominator) - b.numerator * (common / b.denominator), denominator: common };
  else if (operation === "multiply") result = { numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator };
  else if (operation === "divide") {
    if (b.numerator === 0) throw new Error("Cannot divide by zero.");
    result = { numerator: a.numerator * b.denominator, denominator: a.denominator * b.numerator };
  } else result = a;
  return { result: simplifyFraction(result), commonDenominator: common, comparison: a.numerator / a.denominator - b.numerator / b.denominator };
}

export function fractionToMixed(fraction: Fraction) {
  const simplified = simplifyFraction(fraction);
  const whole = Math.trunc(simplified.numerator / simplified.denominator);
  const remainder = Math.abs(simplified.numerator % simplified.denominator);
  return remainder ? `${whole ? `${whole} ` : ""}${remainder}/${simplified.denominator}` : `${whole}`;
}

export type DecimalOperation = "add" | "subtract" | "multiply" | "divide" | "scale10" | "scale100" | "divide10";

export function operateDecimals(a: number, b: number, operation: DecimalOperation) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("Use valid decimal numbers.");
  if ((operation === "divide" || operation === "divide10") && b === 0) throw new Error("Division by zero is not allowed.");
  const value =
    operation === "add" ? a + b :
    operation === "subtract" ? a - b :
    operation === "multiply" ? a * b :
    operation === "divide" ? a / b :
    operation === "scale10" ? a * 10 :
    operation === "scale100" ? a * 100 :
    a / 10;
  return roundDecimal(value);
}

export function roundDecimal(value: number) {
  return Math.round((value + Number.EPSILON) * 1000000) / 1000000;
}

function formatCalc(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}
