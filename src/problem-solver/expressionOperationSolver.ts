import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type Polynomial = [number, number, number];
type Factor = { a: number; b: number };

const epsilon = 1e-9;

export function solveExpressionOperation(classification: ProblemClassification): ProblemSolverResult | null {
  if (!classification.expression) return null;
  if (classification.kind === "simplify") return simplifyExpression(classification);
  if (classification.kind === "factor") return factorExpression(classification);
  if (classification.kind === "expand") return expandExpression(classification);
  if (classification.kind === "evaluate") return evaluateExpression(classification);
  return null;
}

function simplifyExpression(classification: ProblemClassification): ProblemSolverResult | null {
  const expression = classification.expression ?? classification.normalizedInput;
  const rational = parseFractionExpression(expression);
  if (rational) {
    const numerator = parsePolynomial(rational.numerator);
    const denominator = parsePolynomial(rational.denominator);
    if (!numerator || !denominator) return null;
    const numeratorFactors = factorPolynomial(numerator);
    const denominatorFactors = factorPolynomial(denominator);
    const common = findCommonFactor(numeratorFactors, denominatorFactors);
    const restrictions = denominatorFactors.map((factor) => `x != ${formatNumber(-factor.b / factor.a)}`);
    if (common) {
      const remainingNumerator = removeFirstMatchingFactor(numeratorFactors, common);
      const remainingDenominator = removeFirstMatchingFactor(denominatorFactors, common);
      const simplified = formatFactorList(remainingNumerator) || "1";
      const denominatorText = formatFactorList(remainingDenominator);
      const finalAnswer = denominatorText ? `${simplified} / ${denominatorText}` : simplified;
      return expressionResult(classification, {
        method: "Rational simplification",
        result: `${finalAnswer}${restrictions.length ? `, ${restrictions.join(", ")}` : ""}`,
        restrictions,
        steps: [
          `Original expression: ${formatDisplay(expression)}.`,
          `Factor numerator: ${formatFactorList(numeratorFactors)}.`,
          `Factor denominator: ${formatFactorList(denominatorFactors)}.`,
          restrictions.length ? `Denominator restriction: ${restrictions.join(", ")}.` : "No denominator restriction was detected.",
          `Cancel common factor ${formatFactor(common)}.`,
          `Simplified expression: ${finalAnswer}.`,
          `Final answer: ${finalAnswer}${restrictions.length ? `, ${restrictions.join(", ")}` : ""}.`,
        ],
        warnings: restrictions.map((item) => `Domain restriction: ${item}.`),
      });
    }
    const unchanged = `${formatDisplay(expression)}${restrictions.length ? `, ${restrictions.join(", ")}` : ""}`;
    return expressionResult(classification, {
      method: "Rational simplification",
      result: unchanged,
      restrictions,
      steps: [
        `Original expression: ${formatDisplay(expression)}.`,
        `Factor numerator: ${formatFactorList(numeratorFactors) || formatPolynomial(numerator)}.`,
        `Factor denominator: ${formatFactorList(denominatorFactors) || formatPolynomial(denominator)}.`,
        restrictions.length ? `Denominator restriction: ${restrictions.join(", ")}.` : "No denominator restriction was detected.",
        "No common factor is available to cancel.",
        `Final answer: ${unchanged}.`,
      ],
      warnings: restrictions.map((item) => `Domain restriction: ${item}.`),
    });
  }

  const polynomial = parsePolynomial(expression);
  if (!polynomial) return null;
  const simplified = formatPolynomial(polynomial);
  return expressionResult(classification, {
    method: "Combine like terms",
    result: simplified,
    steps: [
      `Original expression: ${formatDisplay(expression)}.`,
      "Group like powers of x.",
      `Combine coefficients to get: ${simplified}.`,
      `Final answer: ${simplified}.`,
    ],
  });
}

function factorExpression(classification: ProblemClassification): ProblemSolverResult | null {
  const expression = classification.expression ?? classification.normalizedInput;
  const polynomial = parsePolynomial(expression);
  if (!polynomial) return null;
  const [c, b, a] = polynomial;
  if (isZero(a)) return null;
  const factorization = factorQuadratic(a, b, c);
  if (!factorization) {
    return expressionResult(classification, {
      method: "Integer factorization",
      result: `${formatPolynomial(polynomial)} is not factorable over integers`,
      steps: [
        `Original expression: ${formatDisplay(expression)}.`,
        "Identify polynomial type: quadratic.",
        `Identify coefficients: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}.`,
        "Try integer factorization.",
        "No integer factor pair matches the middle term.",
        `Final answer: ${formatPolynomial(polynomial)} is not factorable over integers.`,
      ],
      warnings: ["Not factorable over integers by the Phase 4 deterministic factorer."],
    });
  }
  return expressionResult(classification, {
    method: "Integer factorization",
    result: factorization,
    steps: [
      `Original expression: ${formatDisplay(expression)}.`,
      "Identify polynomial type: quadratic.",
      `Identify coefficients: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}.`,
      "Try integer factorization by matching factor pairs.",
      `Final factored form: ${factorization}.`,
      `Final answer: ${factorization}.`,
    ],
  });
}

function expandExpression(classification: ProblemClassification): ProblemSolverResult | null {
  const expression = classification.expression ?? classification.normalizedInput;
  const polynomial = parsePolynomial(expression);
  if (!polynomial) return null;
  const expanded = formatPolynomial(polynomial);
  return expressionResult(classification, {
    method: "Distributive expansion",
    result: expanded,
    steps: [
      `Original expression: ${formatDisplay(expression)}.`,
      "Apply the distributive property across products and powers.",
      `Collect like powers of x: ${expanded}.`,
      `Final answer: ${expanded}.`,
    ],
  });
}

function evaluateExpression(classification: ProblemClassification): ProblemSolverResult | null {
  const expression = classification.expression ?? classification.normalizedInput;
  const domainIssue = invalidNumericDomain(expression);
  if (domainIssue) {
    return expressionResult(classification, {
      method: "Domain check",
      result: domainIssue.result,
      steps: [
        `Original expression: ${formatDisplay(expression)}.`,
        domainIssue.reason,
        "No real-number evaluation was performed.",
        `Final answer: ${domainIssue.result}.`,
      ],
      warnings: domainIssue.warnings,
      canCopy: false,
    });
  }
  const domain = detectDomainRestrictions(expression);
  if (domain.length && containsVariable(expression)) {
    return expressionResult(classification, {
      method: "Domain analysis",
      result: `Domain: ${domain.join(", ")}`,
      restrictions: domain,
      steps: [
        `Original expression: ${formatDisplay(expression)}.`,
        ...domain.map((restriction) => `Domain restriction: ${restriction}.`),
        "No numeric evaluation is performed because the expression contains a variable.",
        `Final answer: Domain: ${domain.join(", ")}.`,
      ],
      warnings: domain.map((restriction) => `Domain restriction: ${restriction}.`),
    });
  }
  const evaluated = evaluateNumericExpression(expression);
  if (!evaluated) return null;
  const assumptions = [...classification.assumptions, ...evaluated.assumptions];
  return {
    kind: classification.kind,
    method: evaluated.trig ? "Numeric evaluation with degree-mode trig" : "Numeric evaluation",
    title: "Evaluate",
    normalizedInput: classification.normalizedInput,
    result: evaluated.result,
    restrictions: domain,
    steps: [
      `Original expression: ${formatNumericDisplay(expression)}.`,
      evaluated.trig ? "Trigonometric numeric input is interpreted in degrees by default." : "Apply arithmetic order of operations.",
      `Evaluate the expression: ${evaluated.result}.`,
      `Final answer: ${evaluated.result}.`,
    ],
    assumptions,
    warnings: [...classification.warnings, ...domain.map((restriction) => `Domain restriction: ${restriction}.`)],
    canCopy: true,
  };
}

function expressionResult(classification: ProblemClassification, data: { canCopy?: boolean; method: string; result: string; restrictions?: string[]; steps: string[]; warnings?: string[] }): ProblemSolverResult {
  return {
    kind: classification.kind,
    method: data.method,
    title: labelForKind(classification.kind),
    normalizedInput: classification.normalizedInput,
    result: data.result,
    restrictions: data.restrictions ?? [],
    steps: data.steps,
    assumptions: classification.assumptions,
    warnings: [...classification.warnings, ...(data.warnings ?? [])],
    canCopy: data.canCopy ?? true,
  };
}

function parseFractionExpression(expression: string) {
  const trimmed = stripOuterParens(normalizeExpression(expression));
  const slash = findTopLevelSlash(trimmed);
  if (slash < 0) return null;
  return { numerator: stripOuterParens(trimmed.slice(0, slash)), denominator: stripOuterParens(trimmed.slice(slash + 1)) };
}

function parsePolynomial(expression: string): Polynomial | null {
  try {
    return new Parser(tokenize(expression)).parse();
  } catch {
    return null;
  }
}

class Parser {
  private index = 0;
  constructor(private readonly tokens: string[]) {}

  parse(): Polynomial {
    const result = this.expression();
    if (this.index !== this.tokens.length) throw new Error("Unexpected token");
    return cleanPolynomial(result);
  }

  private expression(): Polynomial {
    let current = this.term();
    while (this.peek() === "+" || this.peek() === "-") {
      const op = this.next();
      const right = this.term();
      current = op === "+" ? add(current, right) : subtract(current, right);
    }
    return current;
  }

  private term(): Polynomial {
    let current = this.factor();
    while (this.peek() === "*" || this.peek() === "/") {
      const op = this.next();
      const right = this.factor();
      current = op === "*" ? multiply(current, right) : divideByConstant(current, right);
    }
    return current;
  }

  private factor(): Polynomial {
    let current = this.unary();
    if (this.peek() === "^") {
      this.next();
      const exponent = this.unary();
      if (!isZero(exponent[1]) || !isZero(exponent[2]) || !Number.isInteger(exponent[0])) throw new Error("Unsupported exponent");
      current = power(current, exponent[0]);
    }
    return current;
  }

  private unary(): Polynomial {
    if (this.peek() === "+") {
      this.next();
      return this.unary();
    }
    if (this.peek() === "-") {
      this.next();
      return scale(this.unary(), -1);
    }
    return this.primary();
  }

  private primary(): Polynomial {
    const token = this.next();
    if (!token) throw new Error("Expected token");
    if (/^\d+(?:\.\d+)?$/.test(token)) return [Number(token), 0, 0];
    if (token === "x") return [0, 1, 0];
    if (token === "(") {
      const inner = this.expression();
      if (this.next() !== ")") throw new Error("Missing closing paren");
      return inner;
    }
    throw new Error(`Unsupported token ${token}`);
  }

  private peek() {
    return this.tokens[this.index];
  }

  private next() {
    return this.tokens[this.index++];
  }
}

function tokenize(expression: string) {
  const normalized = normalizeExpression(expression);
  const tokens: string[] = [];
  for (let index = 0; index < normalized.length;) {
    const char = normalized[index];
    if (/\d|\./.test(char)) {
      let end = index + 1;
      while (end < normalized.length && /[\d.]/.test(normalized[end])) end += 1;
      tokens.push(normalized.slice(index, end));
      index = end;
      continue;
    }
    if (char === "x" || "+-*/^()".includes(char)) {
      tokens.push(char);
      index += 1;
      continue;
    }
    throw new Error(`Unsupported token ${char}`);
  }
  return tokens;
}

function normalizeExpression(value: string) {
  return value.trim()
    .replace(/\s+/g, "")
    .replace(/(\d)(x|\()/g, "$1*$2")
    .replace(/(x|\))(\d)/g, "$1*$2")
    .replace(/\)(x|\()/g, ")*$1");
}

function add(a: Polynomial, b: Polynomial): Polynomial {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Polynomial, b: Polynomial): Polynomial {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(a: Polynomial, value: number): Polynomial {
  return [a[0] * value, a[1] * value, a[2] * value];
}

function multiply(a: Polynomial, b: Polynomial): Polynomial {
  const result = [0, 0, 0, 0, 0];
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) result[i + j] += a[i] * b[j];
  }
  if (result.slice(3).some((item) => !isZero(item))) throw new Error("Degree too high");
  return cleanPolynomial([result[0], result[1], result[2]]);
}

function divideByConstant(a: Polynomial, b: Polynomial): Polynomial {
  if (!isZero(b[1]) || !isZero(b[2]) || isZero(b[0])) throw new Error("Nonconstant divisor");
  return [a[0] / b[0], a[1] / b[0], a[2] / b[0]];
}

function power(a: Polynomial, exponent: number): Polynomial {
  if (exponent === 0) return [1, 0, 0];
  if (exponent === 1) return a;
  if (exponent === 2) return multiply(a, a);
  throw new Error("Unsupported power");
}

function cleanPolynomial(poly: Polynomial): Polynomial {
  return poly.map((item) => isZero(item) ? 0 : item) as Polynomial;
}

function factorPolynomial(poly: Polynomial): Factor[] {
  const [c, b, a] = poly;
  if (isZero(a)) return isZero(b) ? [] : [{ a: b, b: c }];
  const quadratic = factorQuadraticFactors(a, b, c);
  return quadratic ?? [];
}

function factorQuadratic(a: number, b: number, c: number) {
  if (isZero(a - 1)) {
    const roots = quadraticRoots(a, b, c);
    if (roots?.every(isNearlyInteger)) {
      const ordered = orderRootsForDisplay(roots);
      if (ordered.length === 2 && isZero(ordered[0] - ordered[1])) return `${formatRootFactor(ordered[0])}^2`;
      return ordered.map(formatRootFactor).join("");
    }
  }
  const factors = factorQuadraticFactors(a, b, c);
  if (!factors) return null;
  if (factors.length === 2 && sameFactor(factors[0], factors[1])) return `${formatFactor(factors[0])}^2`;
  return formatFactorList(factors);
}

function quadraticRoots(a: number, b: number, c: number) {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < -epsilon) return null;
  if (isZero(discriminant)) return [-b / (2 * a), -b / (2 * a)];
  const sqrt = Math.sqrt(discriminant);
  return [(-b - sqrt) / (2 * a), (-b + sqrt) / (2 * a)];
}

function orderRootsForDisplay(roots: number[]) {
  return [...roots].sort((left, right) => {
    const leftPositive = left > 0 ? 0 : 1;
    const rightPositive = right > 0 ? 0 : 1;
    return leftPositive - rightPositive || Math.abs(left) - Math.abs(right);
  });
}

function formatRootFactor(root: number) {
  return `(x ${root < 0 ? "+" : "-"} ${formatNumber(Math.abs(root))})`;
}

function factorQuadraticFactors(a: number, b: number, c: number): Factor[] | null {
  const limit = 24;
  for (let p = -limit; p <= limit; p += 1) {
    for (let q = -limit; q <= limit; q += 1) {
      for (let r = -limit; r <= limit; r += 1) {
        for (let s = -limit; s <= limit; s += 1) {
          if (p === 0 || r === 0) continue;
          if (p * r === a && q * s === c && p * s + q * r === b) return normalizeFactors([{ a: p, b: q }, { a: r, b: s }]);
        }
      }
    }
  }
  return null;
}

function normalizeFactors(factors: Factor[]) {
  return factors.map((factor) => factor.a < 0 ? { a: -factor.a, b: -factor.b } : factor)
    .sort((left, right) => left.a - right.a || left.b - right.b);
}

function findCommonFactor(left: Factor[], right: Factor[]) {
  return left.find((item) => right.some((candidate) => sameFactor(item, candidate)));
}

function removeFirstMatchingFactor(items: Factor[], target: Factor) {
  let removed = false;
  return items.filter((item) => {
    if (!removed && sameFactor(item, target)) {
      removed = true;
      return false;
    }
    return true;
  });
}

function sameFactor(left: Factor, right: Factor) {
  return left.a * right.b === right.a * left.b && left.a * right.a > 0;
}

function formatFactorList(factors: Factor[]) {
  return factors.map(formatFactor).join("");
}

function formatFactor(factor: Factor) {
  const a = factor.a;
  const b = factor.b;
  const aText = isZero(a - 1) ? "x" : `${formatNumber(a)}x`;
  if (isZero(b)) return `(${aText})`;
  return `(${aText} ${b < 0 ? "-" : "+"} ${formatNumber(Math.abs(b))})`;
}

function formatPolynomial([c, b, a]: Polynomial) {
  const terms: string[] = [];
  if (!isZero(a)) terms.push(termText(a, "x^2"));
  if (!isZero(b)) terms.push(termText(b, "x"));
  if (!isZero(c) || !terms.length) terms.push(formatNumber(c));
  return terms.map((term, index) => index === 0 ? term : term.startsWith("-") ? ` - ${term.slice(1)}` : ` + ${term}`).join("");
}

function termText(coefficient: number, symbol: string) {
  if (isZero(Math.abs(coefficient) - 1)) return `${coefficient < 0 ? "-" : ""}${symbol}`;
  return `${formatNumber(coefficient)}${symbol}`;
}

function evaluateNumericExpression(expression: string) {
  const normalized = normalizeUnicodeMath(expression).trim().replace(/\s+/g, "");
  const exact = exactNumericEvaluation(normalized);
  if (exact) return exact;
  const trig = /\b(?:sin|cos|tan)\(/i.test(normalized);
  const jsExpression = normalized
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/log10\(/gi, "Math.log10(")
    .replace(/log2\(/gi, "Math.log2(")
    .replace(/log\(/gi, "Math.log10(")
    .replace(/ln\(/gi, "Math.log(")
    .replace(/exp\(/gi, "Math.exp(")
    .replace(/sqrt\(/gi, "Math.sqrt(")
    .replace(/abs\(/gi, "Math.abs(")
    .replace(/sum\(/gi, "sum(")
    .replace(/add\(/gi, "sum(")
    .replace(/sin\(([-+]?\d+(?:\.\d+)?)\)/gi, (_, value) => `Math.sin((${value})*Math.PI/180)`)
    .replace(/cos\(([-+]?\d+(?:\.\d+)?)\)/gi, (_, value) => `Math.cos((${value})*Math.PI/180)`)
    .replace(/tan\(([-+]?\d+(?:\.\d+)?)\)/gi, (_, value) => `Math.tan((${value})*Math.PI/180)`);
  if (!isSafeNumericExpression(jsExpression)) return null;
  try {
    const sum = (...values: number[]) => values.reduce((total, value) => total + value, 0);
    const value = Number(Function("sum", `"use strict"; return (${jsExpression});`)(sum));
    if (!Number.isFinite(value)) return null;
    return {
      result: formatNumber(value),
      trig,
      assumptions: trig ? ["Trigonometric numeric input is interpreted in degrees by default."] : [],
    };
  } catch {
    return null;
  }
}

function isSafeNumericExpression(expression: string) {
  if (!/^[\d+\-*/().,\sA-Za-z]+$/.test(expression)) return false;
  const identifiers = expression.match(/[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)?/g) ?? [];
  const allowed = new Set([
    "Math.PI",
    "Math.E",
    "Math.log10",
    "Math.log2",
    "Math.log",
    "Math.exp",
    "Math.sqrt",
    "Math.abs",
    "Math.sin",
    "Math.cos",
    "Math.tan",
    "sum",
  ]);
  return identifiers.every((identifier) => allowed.has(identifier));
}

function exactNumericEvaluation(expression: string) {
  const sqrt = expression.match(/^sqrt\(([-+]?\d+(?:\.\d+)?)\)$/i);
  if (sqrt) {
    const value = Number(sqrt[1]);
    if (value < 0) return null;
    const root = Math.sqrt(value);
    const result = Number.isInteger(root) ? formatNumber(root) : `Exact: sqrt(${formatNumber(value)}); Approximate: ${formatNumber(root)}`;
    return { result, trig: false, assumptions: Number.isInteger(root) ? [] : ["Approximate decimal rounded to 6 places."] };
  }
  const log = expression.match(/^log\((10(?:0+)?)\)$/i) ?? expression.match(/^log10\((10(?:0+)?)\)$/i);
  if (log) return { result: formatNumber(Math.log10(Number(log[1]))), trig: false, assumptions: ["log is treated as base 10."] };
  const log2 = expression.match(/^log2\(([-+]?\d+(?:\.\d+)?)\)$/i);
  if (log2) return { result: formatNumber(Math.log2(Number(log2[1]))), trig: false, assumptions: ["log2 is treated as base 2."] };
  if (/^ln\(e\)$/i.test(expression)) return { result: "1", trig: false, assumptions: ["ln uses base e."] };
  if (/^ln\(e\^2\)$/i.test(expression)) return { result: "2", trig: false, assumptions: ["ln uses base e."] };
  const exp = expression.match(/^exp\(([-+]?\d+(?:\.\d+)?)\)$/i);
  if (exp) {
    const value = Number(exp[1]);
    return { result: `Exact: e^${formatNumber(value)}; Approximate: ${formatNumber(Math.exp(value))}`, trig: false, assumptions: ["Approximate decimal rounded to 6 places."] };
  }
  return null;
}

function invalidNumericDomain(expression: string) {
  const normalized = normalizeExpression(normalizeUnicodeMath(expression));
  const sqrt = normalized.match(/^sqrt\(([-+]?\d+(?:\.\d+)?)\)$/i);
  if (sqrt && Number(sqrt[1]) < 0) {
    return {
      reason: `The square-root argument is ${formatNumber(Number(sqrt[1]))}, which is negative.`,
      result: "No real value",
      warnings: ["sqrt of a negative number is not real; complex results are not expanded in this solver."],
    };
  }
  const log = normalized.match(/^(log|ln|log10|log2)\(([-+]?\d+(?:\.\d+)?)\)$/i);
  if (log && Number(log[2]) <= 0) {
    return {
      reason: `The logarithm argument is ${formatNumber(Number(log[2]))}, but logarithms require a positive argument in the real-number system.`,
      result: "Undefined over the real numbers",
      warnings: [`${log[1]} requires a positive argument.`],
    };
  }
  return null;
}

function detectDomainRestrictions(expression: string) {
  const normalized = normalizeExpression(normalizeUnicodeMath(expression));
  const restrictions: string[] = [];
  const sqrt = normalized.match(/^sqrt\((.+)\)$/i);
  if (sqrt) {
    const restriction = linearInequalityRestriction(sqrt[1], ">=");
    if (restriction) restrictions.push(restriction);
    else if (containsVariable(sqrt[1])) restrictions.push("square-root argument >= 0");
  }
  const log = normalized.match(/^(?:log|ln|log10|log2)\((.+)\)$/i);
  if (log) {
    const restriction = linearInequalityRestriction(log[1], ">");
    if (restriction) restrictions.push(restriction);
    else if (containsVariable(log[1])) restrictions.push("logarithm argument > 0");
  }
  const rational = parseFractionExpression(normalized);
  if (rational) {
    const denominator = parsePolynomial(rational.denominator);
    if (denominator) {
      for (const factor of factorPolynomial(denominator)) restrictions.push(`x != ${formatNumber(-factor.b / factor.a)}`);
    } else {
      restrictions.push("denominator != 0");
    }
  }
  return [...new Set(restrictions)];
}

function linearInequalityRestriction(expression: string, operator: ">=" | ">") {
  const polynomial = parsePolynomial(expression);
  if (!polynomial) return null;
  const [c, b, a] = polynomial;
  if (!isZero(a) || isZero(b)) return null;
  const boundary = -c / b;
  const direction = b > 0 ? operator : operator === ">=" ? "<=" : "<";
  return `x ${direction} ${formatNumber(boundary)}`;
}

function containsVariable(expression: string) {
  return /\bx\b/i.test(normalizeExpression(expression));
}

function normalizeUnicodeMath(value: string) {
  return value
    .replace(/Ã—|×|·/g, "*")
    .replace(/Ã·|÷/g, "/")
    .replace(/âˆ’|−/g, "-")
    .replace(/Â²|²/g, "^2")
    .replace(/Â³|³/g, "^3")
    .replace(/âˆš\s*\(?\s*([^)\s]+)\s*\)?|√\s*\(?\s*([^)\s]+)\s*\)?/g, (_, mojibakeRadicand: string | undefined, radicand: string | undefined) => `sqrt(${mojibakeRadicand ?? radicand})`);
}

function stripOuterParens(value: string): string {
  let current = value.trim();
  while (current.startsWith("(") && current.endsWith(")") && matchingOuterParens(current)) current = current.slice(1, -1);
  return current;
}

function matchingOuterParens(value: string) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    if (value[index] === ")") depth -= 1;
    if (depth === 0 && index < value.length - 1) return false;
  }
  return depth === 0;
}

function findTopLevelSlash(value: string) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    if (value[index] === ")") depth -= 1;
    if (value[index] === "/" && depth === 0) return index;
  }
  return -1;
}

function labelForKind(kind: string) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDisplay(value: string) {
  return normalizeExpression(value).replace(/\*/g, "");
}

function formatNumericDisplay(value: string) {
  return value.trim().replace(/\s+/g, "").replace(/\*/g, " * ");
}

function formatNumber(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}

function isNearlyInteger(value: number) {
  return isZero(value - Math.round(value));
}
