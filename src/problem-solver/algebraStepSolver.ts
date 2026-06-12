export type AlgebraMethod = "Linear isolation" | "Factoring" | "Quadratic formula" | "Rational equation clearing denominators" | "CAS fallback";

export type AlgebraStepResult = {
  finalAnswer: string;
  kind: "linear" | "quadratic" | "rational";
  method: AlgebraMethod;
  normalizedEquation: string;
  restrictions: string[];
  steps: string[];
  verification: string[];
  warnings: string[];
};

type Polynomial = [number, number, number];
type Token = { type: "number" | "variable" | "operator" | "paren"; value: string };
type FractionEquation = { numerator: string; denominator: string; right: string };

const variable = "x";
const epsilon = 1e-9;

export function solveAlgebraSteps(equation: string): AlgebraStepResult | null {
  const normalizedEquation = normalizeEquation(equation);
  if (!normalizedEquation.includes("=")) return null;
  const rational = solveRationalEquation(normalizedEquation);
  if (rational) return rational;
  return solvePolynomialEquation(normalizedEquation);
}

function solvePolynomialEquation(normalizedEquation: string): AlgebraStepResult | null {
  const polynomial = equationToPolynomial(normalizedEquation);
  if (!polynomial) return null;
  const [c, b, a] = polynomial;
  if (isZero(a) && isZero(b)) return solveDegenerateLinear(normalizedEquation, c);
  if (isZero(a)) return solveLinear(normalizedEquation, b, c);
  return solveQuadratic(normalizedEquation, a, b, c);
}

function solveDegenerateLinear(normalizedEquation: string, constant: number): AlgebraStepResult {
  const identity = isZero(constant);
  const [left, right] = splitEquation(normalizedEquation);
  const simplifiedLeft = formatNumber(evaluatePolynomial(parsePolynomial(left) ?? [0, 0, 0], 0));
  const simplifiedRight = formatNumber(evaluatePolynomial(parsePolynomial(right) ?? [0, 0, 0], 0));
  return {
    finalAnswer: identity ? "Solution: all real numbers" : "No solution",
    kind: "linear",
    method: "Linear isolation",
    normalizedEquation,
    restrictions: [],
    steps: [
      `Start with: ${formatEquationForDisplay(normalizedEquation)}.`,
      `Simplify both sides: ${simplifiedLeft} = ${simplifiedRight}.`,
      identity ? "This statement is always true." : "This statement is false.",
      identity ? "Therefore every real number satisfies the equation." : "Therefore no value of x satisfies the equation.",
      identity ? "Final answer: Solution: all real numbers." : "Final answer: No solution.",
    ],
    verification: [identity ? "Every substitution gives the true statement." : "No substitution can make a false constant statement true."],
    warnings: identity ? ["Identity equation: infinitely many solutions."] : ["Contradiction equation: no solution."],
  };
}

function solveLinear(normalizedEquation: string, coefficient: number, constant: number): AlgebraStepResult {
  const movedConstant = -constant;
  const solution = movedConstant / coefficient;
  const steps = [
    `Start with: ${formatEquationForDisplay(normalizedEquation)}.`,
    `Normalize to standard form: ${formatLinear(coefficient, constant)} = 0.`,
    `Move the constant term: ${formatTerm(coefficient, 1)} = ${formatNumber(movedConstant)}.`,
    `Divide both sides by ${formatNumber(coefficient)}: x = ${formatNumber(solution)}.`,
    `Final answer: x = ${formatNumber(solution)}.`,
  ];
  return {
    finalAnswer: `x = ${formatNumber(solution)}`,
    kind: "linear",
    method: "Linear isolation",
    normalizedEquation,
    restrictions: [],
    steps,
    verification: [`Check by substitution: ${verificationText(normalizedEquation, solution)}.`],
    warnings: [],
  };
}

function solveQuadratic(normalizedEquation: string, a: number, b: number, c: number): AlgebraStepResult {
  const factorPair = integerFactorPair(a, b, c);
  if (factorPair) {
    const roots = sortNumbers(factorPair.roots);
    return {
      finalAnswer: `x = ${roots.map(formatNumber).join(", ")}`,
      kind: "quadratic",
      method: "Factoring",
      normalizedEquation,
      restrictions: [],
      steps: [
        `Start with: ${formatEquationForDisplay(normalizedEquation)}.`,
        `Write in standard form: ${formatQuadratic(a, b, c)} = 0.`,
        `Identify coefficients: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}.`,
        `Factor the quadratic: ${factorPair.factorText} = 0.`,
        "Apply the zero-product rule: set each factor equal to 0.",
        `Solve each factor: x = ${roots.map(formatNumber).join(", ")}.`,
        `Final answer: x = ${roots.map(formatNumber).join(", ")}.`,
      ],
      verification: roots.map((root) => `Check x = ${formatNumber(root)}: ${verificationText(normalizedEquation, root)}.`),
      warnings: [],
    };
  }

  const discriminant = b * b - 4 * a * c;
  const roots = quadraticFormulaRoots(a, b, c);
  return {
    finalAnswer: roots.length ? `x = ${roots.map(formatNumber).join(", ")}` : "No real roots",
    kind: "quadratic",
    method: "Quadratic formula",
    normalizedEquation,
    restrictions: [],
    steps: [
      `Start with: ${formatEquationForDisplay(normalizedEquation)}.`,
      `Write in standard form: ${formatQuadratic(a, b, c)} = 0.`,
      `Identify coefficients: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}.`,
      `Compute the discriminant: D = b^2 - 4ac = ${formatNumber(discriminant)}.`,
      "Use the quadratic formula: x = (-b +/- sqrt(D)) / (2a).",
      roots.length ? `Substitute and simplify: x = ${roots.map(formatNumber).join(", ")}.` : "Since D is negative, there are no real roots.",
      roots.length ? `Final answer: x = ${roots.map(formatNumber).join(", ")}.` : "Final answer: no real roots.",
    ],
    verification: roots.map((root) => `Check x = ${formatNumber(root)}: ${verificationText(normalizedEquation, root)}.`),
    warnings: roots.length ? [] : ["Complex roots are not expanded in Phase 3."],
  };
}

function solveRationalEquation(normalizedEquation: string): AlgebraStepResult | null {
  const fraction = parseSimpleFractionEquation(normalizedEquation);
  if (!fraction) return null;

  const denominatorPolynomial = parsePolynomial(fraction.denominator);
  if (!denominatorPolynomial) return null;
  const restrictionRoots = solvePolynomialRoots(denominatorPolynomial);
  const restrictions = restrictionRoots.map((root) => `x != ${formatNumber(root)}`);
  const clearedEquation = `(${fraction.numerator})=(${fraction.right})*(${fraction.denominator})`;
  const clearedPolynomial = equationToPolynomial(clearedEquation);
  if (!clearedPolynomial) return null;
  const candidateRoots = solvePolynomialRoots(clearedPolynomial);
  const validRoots = candidateRoots.filter((root) => restrictionRoots.every((excluded) => !nearlyEqual(root, excluded)));
  const rejectedRoots = candidateRoots.filter((root) => restrictionRoots.some((excluded) => nearlyEqual(root, excluded)));
  const finalAnswer = validRoots.length ? `x = ${validRoots.map(formatNumber).join(", ")}` : "No valid solution";

  return {
    finalAnswer,
    kind: "rational",
    method: "Rational equation clearing denominators",
    normalizedEquation,
    restrictions,
    steps: [
      `Start with: ${formatEquationForDisplay(normalizedEquation)}.`,
      `Identify denominator: ${fraction.denominator}.`,
      restrictions.length ? `State denominator restriction: ${restrictions.join(", ")}.` : "No denominator restriction was found.",
      `Clear denominators by multiplying both sides by ${fraction.denominator}.`,
      `Solve the resulting equation: ${formatEquationForDisplay(clearedEquation)}.`,
      candidateRoots.length ? `Candidate solution${candidateRoots.length === 1 ? "" : "s"}: x = ${candidateRoots.map(formatNumber).join(", ")}.` : "No candidate solution is produced.",
      rejectedRoots.length ? `Reject invalid solution${rejectedRoots.length === 1 ? "" : "s"} ${rejectedRoots.map(formatNumber).join(", ")} because it makes the denominator zero.` : "No candidate solution violates the denominator restriction.",
      `Final answer: ${finalAnswer}${restrictions.length ? `, with ${restrictions.join(", ")}` : ""}.`,
    ],
    verification: validRoots.map((root) => `Check x = ${formatNumber(root)}: ${verificationText(normalizedEquation, root)}.`),
    warnings: restrictions.map((item) => `Domain restriction: ${item}.`),
  };
}

function parseSimpleFractionEquation(equation: string): FractionEquation | null {
  const [left, right] = splitEquation(equation);
  const fraction = parseFractionExpression(left);
  if (fraction) return { ...fraction, right };
  const rightFraction = parseFractionExpression(right);
  if (rightFraction) return { numerator: rightFraction.numerator, denominator: rightFraction.denominator, right: left };
  return null;
}

function parseFractionExpression(expression: string) {
  const trimmed = stripOuterParens(expression);
  const slashIndex = findTopLevelSlash(trimmed);
  if (slashIndex < 0) return null;
  const numerator = stripOuterParens(trimmed.slice(0, slashIndex));
  const denominator = stripOuterParens(trimmed.slice(slashIndex + 1));
  if (!denominator.includes(variable)) return null;
  return { numerator, denominator };
}

function equationToPolynomial(equation: string): Polynomial | null {
  try {
    const [left, right] = splitEquation(equation);
    return subtractPolynomials(parsePolynomialOrThrow(left), parsePolynomialOrThrow(right));
  } catch {
    return null;
  }
}

function parsePolynomial(expression: string): Polynomial | null {
  try {
    return parsePolynomialOrThrow(expression);
  } catch {
    return null;
  }
}

function parsePolynomialOrThrow(expression: string): Polynomial {
  const parser = new PolynomialParser(tokenize(expression));
  return trimPolynomial(parser.parseExpression());
}

class PolynomialParser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parseExpression(): Polynomial {
    let current = this.parseTerm();
    while (this.match("+") || this.match("-")) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      current = operator === "+" ? addPolynomials(current, right) : subtractPolynomials(current, right);
    }
    if (!this.isAtEnd()) throw new Error("Unexpected token");
    return current;
  }

  private parseTerm(): Polynomial {
    let current = this.parseFactor();
    while (this.match("*") || this.match("/")) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      current = operator === "*" ? multiplyPolynomials(current, right) : dividePolynomialByConstant(current, right);
    }
    return current;
  }

  private parseFactor(): Polynomial {
    let current = this.parseUnary();
    if (this.match("^")) {
      const exponent = this.parseUnary();
      if (!isZero(exponent[1]) || !isZero(exponent[2]) || !Number.isInteger(exponent[0])) throw new Error("Unsupported exponent");
      current = powerPolynomial(current, exponent[0]);
    }
    return current;
  }

  private parseUnary(): Polynomial {
    if (this.match("+")) return this.parseUnary();
    if (this.match("-")) return scalePolynomial(this.parseUnary(), -1);
    return this.parsePrimary();
  }

  private parsePrimary(): Polynomial {
    if (this.matchType("number")) return [Number(this.previous().value), 0, 0];
    if (this.matchType("variable")) return [0, 1, 0];
    if (this.match("(")) {
      const current = this.parseExpressionInside();
      if (!this.match(")")) throw new Error("Missing closing parenthesis");
      return current;
    }
    throw new Error("Unexpected primary");
  }

  private parseExpressionInside(): Polynomial {
    let current = this.parseTerm();
    while (this.match("+") || this.match("-")) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      current = operator === "+" ? addPolynomials(current, right) : subtractPolynomials(current, right);
    }
    return current;
  }

  private match(value: string) {
    if (this.peek()?.value !== value) return false;
    this.index += 1;
    return true;
  }

  private matchType(type: Token["type"]) {
    if (this.peek()?.type !== type) return false;
    this.index += 1;
    return true;
  }

  private previous() {
    return this.tokens[this.index - 1];
  }

  private peek() {
    return this.tokens[this.index];
  }

  private isAtEnd() {
    return this.index >= this.tokens.length;
  }
}

function tokenize(expression: string): Token[] {
  const normalized = normalizeExpression(expression);
  const tokens: Token[] = [];
  for (let index = 0; index < normalized.length;) {
    const char = normalized[index];
    if (/\d|\./.test(char)) {
      let end = index + 1;
      while (end < normalized.length && /[\d.]/.test(normalized[end])) end += 1;
      tokens.push({ type: "number", value: normalized.slice(index, end) });
      index = end;
      continue;
    }
    if (char === variable) {
      tokens.push({ type: "variable", value: char });
      index += 1;
      continue;
    }
    if ("+-*/^".includes(char)) {
      tokens.push({ type: "operator", value: char });
      index += 1;
      continue;
    }
    if ("()".includes(char)) {
      tokens.push({ type: "paren", value: char });
      index += 1;
      continue;
    }
    throw new Error(`Unsupported token ${char}`);
  }
  return tokens;
}

function normalizeEquation(value: string) {
  return normalizeExpression(value).replace(/−/g, "-");
}

function normalizeExpression(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/(\d)(x|\()/g, "$1*$2")
    .replace(/(x|\))(\d)/g, "$1*$2")
    .replace(/\)(x|\()/g, ")*$1");
}

function splitEquation(equation: string) {
  const parts = equation.split("=");
  if (parts.length !== 2) throw new Error("Expected one equals sign");
  return [parts[0], parts[1]] as const;
}

function addPolynomials(a: Polynomial, b: Polynomial): Polynomial {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractPolynomials(a: Polynomial, b: Polynomial): Polynomial {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scalePolynomial(a: Polynomial, scale: number): Polynomial {
  return [a[0] * scale, a[1] * scale, a[2] * scale];
}

function multiplyPolynomials(a: Polynomial, b: Polynomial): Polynomial {
  const result = [0, 0, 0, 0, 0];
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) result[i + j] += a[i] * b[j];
  }
  if (result.slice(3).some((item) => !isZero(item))) throw new Error("Degree above 2");
  return trimPolynomial([result[0], result[1], result[2]]);
}

function dividePolynomialByConstant(a: Polynomial, b: Polynomial): Polynomial {
  if (!isZero(b[1]) || !isZero(b[2]) || isZero(b[0])) throw new Error("Only constant divisors are supported");
  return [a[0] / b[0], a[1] / b[0], a[2] / b[0]];
}

function powerPolynomial(a: Polynomial, exponent: number): Polynomial {
  if (exponent < 0 || exponent > 2) throw new Error("Unsupported power");
  if (exponent === 0) return [1, 0, 0];
  if (exponent === 1) return a;
  return multiplyPolynomials(a, a);
}

function trimPolynomial(poly: Polynomial): Polynomial {
  return poly.map((item) => isZero(item) ? 0 : item) as Polynomial;
}

function solvePolynomialRoots([c, b, a]: Polynomial) {
  if (isZero(a)) return isZero(b) ? [] : [-c / b];
  return quadraticFormulaRoots(a, b, c);
}

function evaluatePolynomial([c, b, a]: Polynomial, x: number) {
  return a * x * x + b * x + c;
}

function quadraticFormulaRoots(a: number, b: number, c: number) {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < -epsilon) return [];
  if (isZero(discriminant)) return [-b / (2 * a)];
  const sqrt = Math.sqrt(discriminant);
  return sortNumbers([(-b - sqrt) / (2 * a), (-b + sqrt) / (2 * a)]);
}

function integerFactorPair(a: number, b: number, c: number) {
  const roots = quadraticFormulaRoots(a, b, c);
  if (!roots.length || roots.some((root) => !isNearlyInteger(root))) return null;
  const sortedRoots = sortNumbers(roots);
  const factorText = formatFactoredQuadratic(a, sortedRoots);
  return { roots: sortedRoots, factorText };
}

function formatFactoredQuadratic(a: number, roots: number[]) {
  const leading = nearlyEqual(a, 1) ? "" : `${formatNumber(a)}`;
  if (roots.length === 1) {
    const root = roots[0];
    return `${leading}(x${root < 0 ? "+" : "-"}${formatNumber(Math.abs(root))})^2`;
  }
  return `${leading}${roots.map((root) => `(x${root < 0 ? "+" : "-"}${formatNumber(Math.abs(root))})`).join("")}`;
}

function formatLinear(b: number, c: number) {
  return `${formatTerm(b, 1)}${formatSignedConstant(c)}`;
}

function formatQuadratic(a: number, b: number, c: number) {
  return `${formatTerm(a, 2)}${formatSignedTerm(b, 1)}${formatSignedConstant(c)}`;
}

function formatTerm(coefficient: number, degree: 1 | 2) {
  if (isZero(coefficient)) return "";
  const abs = Math.abs(coefficient);
  const coefficientText = nearlyEqual(abs, 1) ? "" : formatNumber(abs);
  const sign = coefficient < 0 ? "-" : "";
  return `${sign}${coefficientText}x${degree === 2 ? "^2" : ""}`;
}

function formatSignedTerm(coefficient: number, degree: 1 | 2) {
  if (isZero(coefficient)) return "";
  return `${coefficient < 0 ? " - " : " + "}${formatTerm(Math.abs(coefficient), degree)}`;
}

function formatSignedConstant(value: number) {
  if (isZero(value)) return "";
  return `${value < 0 ? " - " : " + "}${formatNumber(Math.abs(value))}`;
}

function formatNumber(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function formatEquationForDisplay(value: string) {
  return value.replace(/\*/g, "");
}

function verificationText(equation: string, xValue: number) {
  const [left, right] = splitEquation(equation);
  const leftValue = evaluateExpressionAt(left, xValue);
  const rightValue = evaluateExpressionAt(right, xValue);
  return `${formatNumber(leftValue)} = ${formatNumber(rightValue)}`;
}

function evaluateExpressionAt(expression: string, xValue: number) {
  const polynomial = parsePolynomial(expression);
  if (polynomial) return evaluatePolynomial(polynomial, xValue);
  const substituted = normalizeExpression(expression).replace(/\bx\b/g, `(${formatNumber(xValue)})`).replace(/\^/g, "**");
  if (!/^[\d+\-*/().\s*]+$/.test(substituted)) throw new Error("Unsafe numeric expression");
  return Number(Function(`"use strict"; return (${substituted});`)());
}

function stripOuterParens(value: string): string {
  let current = value.trim();
  while (current.startsWith("(") && current.endsWith(")") && matchingOuterParens(current)) current = current.slice(1, -1);
  return current;
}

function matchingOuterParens(value: string) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0 && index < value.length - 1) return false;
  }
  return depth === 0;
}

function findTopLevelSlash(value: string) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "/" && depth === 0) return index;
  }
  return -1;
}

function sortNumbers(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}

function nearlyEqual(a: number, b: number) {
  return Math.abs(a - b) < epsilon;
}

function isNearlyInteger(value: number) {
  return nearlyEqual(value, Math.round(value));
}
