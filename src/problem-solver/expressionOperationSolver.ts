import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type Polynomial = [number, number, number];
type Factor = { a: number; b: number };
type NumericEvaluation = { assumptions: string[]; result: string; trig: boolean };

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
  const operation = arithmeticOperationLabel(expression);
  return {
    kind: classification.kind,
    method: operation ?? (evaluated.trig ? "Numeric evaluation with degree-mode trig" : "Numeric evaluation"),
    title: "Evaluate",
    normalizedInput: classification.normalizedInput,
    result: evaluated.result,
    restrictions: domain,
    steps: evaluationSteps(expression, evaluated.result, evaluated.trig, operation),
    assumptions,
    warnings: [...classification.warnings, ...domain.map((restriction) => `Domain restriction: ${restriction}.`)],
    canCopy: true,
  };
}

function evaluationSteps(expression: string, result: string, trig: boolean, operation: string | null) {
  const display = formatNumericDisplay(expression);
  const bodmasSteps = buildBodmasSteps(expression, result);
  if (bodmasSteps) return bodmasSteps;
  if (operation === "Sum") {
    const terms = expression.split("+").map((part) => part.trim()).filter(Boolean);
    return [`Original expression: ${display}.`, "Use the addition rule: combine all addends to get the total.", `Add the terms: ${terms.join(" + ")}.`, `Sum = ${result}.`, `Final answer: ${result}.`];
  }
  if (operation === "Multiplication") {
    const factors = expression.split("*").map((part) => part.trim()).filter(Boolean);
    return [`Original expression: ${display}.`, "Use the multiplication rule: multiply all factors together.", `Multiply the factors: ${factors.join(" x ")}.`, `Product = ${result}.`, `Final answer: ${result}.`];
  }
  if (operation === "Subtraction") return [`Original expression: ${display}.`, "Use the subtraction rule: subtract from left to right when only subtraction is present.", `Difference = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Division") return [`Original expression: ${display}.`, "Use the division rule: divide from left to right when only division is present.", `Quotient = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Modulo") return [`Original expression: ${display}.`, "Use the modulo rule: divide and keep the remainder.", `Remainder = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Percent") return [`Original expression: ${display}.`, "Use the percent rule: percent of a number means percent / 100 x base value.", "Convert the percent into a decimal multiplier.", `Percent value = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Greatest Common Divisor") return [`Original expression: ${display}.`, "Use the GCD rule: find the largest integer that divides every input exactly.", `GCD = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Least Common Multiple") return [`Original expression: ${display}.`, "Use the LCM rule: find the smallest positive integer divisible by every input.", `LCM = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Minimum") return [`Original expression: ${display}.`, "Use the minimum rule: compare every value and choose the smallest.", `Minimum = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Maximum") return [`Original expression: ${display}.`, "Use the maximum rule: compare every value and choose the largest.", `Maximum = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Factorial") return [`Original expression: ${display}.`, "Use the factorial rule: multiply all positive integers from 1 up to the number.", `Factorial = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Mean") return [`Original expression: ${display}.`, "Use the mean rule: add all values, then divide by the number of values.", `Mean = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Median") return [`Original expression: ${display}.`, "Use the median rule: sort the values and choose the middle value, or average the two middle values.", `Median = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Mode") return [`Original expression: ${display}.`, "Use the mode rule: count repeated values and choose the value or values with the highest frequency.", `Mode = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Count") return [`Original expression: ${display}.`, "Use the count rule: count the entries that match the function's condition.", `Count = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Standard Deviation") return [`Original expression: ${display}.`, "Use the standard-deviation rule: measure how far the values spread from their mean.", `Standard deviation = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Variance") return [`Original expression: ${display}.`, "Use the variance rule: average the squared distances from the mean.", `Variance = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Regression and Correlation") return [`Original expression: ${display}.`, "Use the regression/correlation rule for paired data values.", `Computed value = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Distribution") return [`Original expression: ${display}.`, "Use the selected probability-distribution rule with the supplied parameters.", `Distribution value = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Ordered Statistic") return [`Original expression: ${display}.`, "Use the ordered-statistic rule: sort or rank the values, then select the requested position.", `Ordered statistic = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Descriptive Statistic") return [`Original expression: ${display}.`, "Use the descriptive-statistic rule named by the function.", `Computed statistic = ${result}.`, `Final answer: ${result}.`];
  if (operation === "Combinatorics") return [`Original expression: ${display}.`, "Use the combinatorics rule named by the function, such as factorials, combinations, or permutations.", `Combinatorics value = ${result}.`, `Final answer: ${result}.`];
  return [
    `Original expression: ${display}.`,
    trig ? "Use the trigonometry rule: numeric angles are interpreted in degrees by default." : "Apply the relevant rule for the detected expression.",
    `Evaluate the expression: ${result}.`,
    `Final answer: ${result}.`,
  ];
}

function buildBodmasSteps(expression: string, result: string): string[] | null {
  const normalized = normalizeUnicodeMath(expression).trim().replace(/^=/, "").replace(/\s+/g, "");
  if (!normalized || /[a-z]/i.test(normalized) || /[(),!]/.test(normalized)) return null;
  if (!/[+\-*/^%]/.test(normalized)) return null;
  const tokens = tokenizeNumericExpression(normalized);
  if (!tokens || tokens.filter((token) => isOperatorToken(token)).length < 2) return null;
  const distinctOperators = new Set(tokens.filter(isOperatorToken));
  if (distinctOperators.size === 1 && !distinctOperators.has("^")) return null;
  if (tokens.filter((token) => token === "^").length > 1) return null;

  const steps = [`Original expression: ${formatNumericDisplay(expression)}.`];
  steps.push("Applied BODMAS rule: Brackets first, Orders/powers next, Division and Multiplication from left to right, then Addition and Subtraction from left to right.");

  const working = [...tokens];
  const operationSteps: string[] = [];
  applyTokenOperations(working, ["^"], "Orders/powers", operationSteps);
  applyTokenOperations(working, ["*", "/", "%"], "Division and multiplication", operationSteps);
  applyTokenOperations(working, ["+", "-"], "Addition and subtraction", operationSteps);

  if (!operationSteps.length) return null;
  steps.push(...operationSteps);
  steps.push(`Final answer: ${result}.`);
  return steps;
}

function tokenizeNumericExpression(expression: string): string[] | null {
  const tokens: string[] = [];
  for (let index = 0; index < expression.length;) {
    const char = expression[index];
    const previous = tokens[tokens.length - 1];
    const signedNumber = (char === "+" || char === "-") && (!previous || isOperatorToken(previous)) && /[\d.]/.test(expression[index + 1] ?? "");
    if (/[\d.]/.test(char) || signedNumber) {
      let end = index + (signedNumber ? 2 : 1);
      while (end < expression.length && /[\d.]/.test(expression[end])) end += 1;
      const token = expression.slice(index, end);
      if (!/^[-+]?\d*\.?\d+$/.test(token)) return null;
      tokens.push(token);
      index = end;
      continue;
    }
    if ("+-*/^%".includes(char)) {
      tokens.push(char);
      index += 1;
      continue;
    }
    return null;
  }
  if (!tokens.length || isOperatorToken(tokens[0]) || isOperatorToken(tokens[tokens.length - 1])) return null;
  return tokens;
}

function applyTokenOperations(tokens: string[], operators: string[], label: string, steps: string[]) {
  for (let index = 0; index < tokens.length;) {
    if (!operators.includes(tokens[index])) {
      index += 1;
      continue;
    }
    const left = Number(tokens[index - 1]);
    const right = Number(tokens[index + 1]);
    const op = tokens[index];
    const value = evaluateTokenOperation(left, op, right);
    const before = formatTokenExpression(tokens);
    tokens.splice(index - 1, 3, formatNumber(value));
    const after = formatTokenExpression(tokens);
    steps.push(`${label}: ${formatNumber(left)} ${operatorDisplay(op)} ${formatNumber(right)} = ${formatNumber(value)}; expression becomes ${after}.`);
    if (op === "^") index = Math.max(0, index - 1);
    else index = Math.max(0, index - 1);
    if (before === after) index += 1;
  }
}

function evaluateTokenOperation(left: number, operator: string, right: number) {
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "*") return left * right;
  if (operator === "/") return left / right;
  if (operator === "%") return left % right;
  if (operator === "^") return left ** right;
  return Number.NaN;
}

function isOperatorToken(token: string) {
  return token.length === 1 && "+-*/^%".includes(token);
}

function operatorDisplay(operator: string) {
  if (operator === "*") return "x";
  if (operator === "/") return "/";
  if (operator === "^") return "^";
  if (operator === "%") return "%";
  return operator;
}

function formatTokenExpression(tokens: string[]) {
  return tokens.map((token) => token === "*" ? " x " : isOperatorToken(token) ? ` ${token} ` : token).join("").replace(/\s+/g, " ").trim();
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

function evaluateNumericExpression(expression: string): NumericEvaluation | null {
  const normalized = normalizeUnicodeMath(expression).trim().replace(/^=/, "").replace(/\s+/g, "");
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
    .replace(/sin\(([-+]?\d+(?:\.\d+)?)\)/gi, (_, value) => `Math.sin((${value})*Math.PI/180)`)
    .replace(/cos\(([-+]?\d+(?:\.\d+)?)\)/gi, (_, value) => `Math.cos((${value})*Math.PI/180)`)
    .replace(/tan\(([-+]?\d+(?:\.\d+)?)\)/gi, (_, value) => `Math.tan((${value})*Math.PI/180)`);
  if (!/^[\d+\-*/%().,\sMathPIElogcosintaqrubse]+$/.test(jsExpression)) return null;
  try {
    const value = Number(Function(`"use strict"; return (${jsExpression});`)());
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

function arithmeticOperationLabel(expression: string): string | null {
  const normalized = normalizeUnicodeMath(expression).trim().replace(/^=/, "").replace(/\s+/g, "");
  if (/^(average|averagea|mean)\(/i.test(normalized)) return "Mean";
  if (/^median\(/i.test(normalized)) return "Median";
  if (/^(mode|mode\.sngl|mode\.mult)\(/i.test(normalized)) return "Mode";
  if (/^(stdev|stdev\.p|stdev\.s|stdeva|stdevpa)\(/i.test(normalized)) return "Standard Deviation";
  if (/^(var|var\.p|var\.s|vara|varpa|variance)\(/i.test(normalized)) return "Variance";
  if (/^(correl|pearson|covariance\.p|covariance\.s|slope|intercept|rsq|forecast\.linear|steyx)\(/i.test(normalized)) return "Regression and Correlation";
  if (/^(norm\.dist|norm\.s\.dist|binom\.dist|poisson\.dist|expon\.dist|weibull\.dist|lognorm\.dist)\(/i.test(normalized)) return "Distribution";
  if (/^(rank\.eq|rank\.avg|percentile|percentile\.inc|percentile\.exc|percentrank\.inc|quartile|quartile\.inc|quartile\.exc|large|small)\(/i.test(normalized)) return "Ordered Statistic";
  if (/^(avedev|devsq|skew|kurt|standardize)\(/i.test(normalized)) return "Descriptive Statistic";
  if (/^(sum|sumsq|sumproduct|sumx2my2|sumx2py2|sumxmy2)\(/i.test(normalized)) return "Sum";
  if (/^product\(/i.test(normalized)) return "Multiplication";
  if (/^(count|counta|countblank)\(/i.test(normalized)) return "Count";
  if (/^percent\(/i.test(normalized)) return "Percent";
  if (/^(gcd|hcf)\(/i.test(normalized)) return "Greatest Common Divisor";
  if (/^lcm\(/i.test(normalized)) return "Least Common Multiple";
  if (/^(min|mina)\(/i.test(normalized)) return "Minimum";
  if (/^(max|maxa)\(/i.test(normalized)) return "Maximum";
  if (/^(fact|factdouble|combin|combina|permut|permutationa|multinomial)\(/i.test(normalized)) return "Combinatorics";
  if (/^\d+!$/.test(normalized)) return "Factorial";
  if (isFlatNumericOperation(normalized, "+")) return "Sum";
  if (isFlatNumericOperation(normalized, "*")) return "Multiplication";
  if (!normalized.startsWith("-") && isFlatNumericOperation(normalized, "-")) return "Subtraction";
  if (isFlatNumericOperation(normalized, "/")) return "Division";
  if (isFlatNumericOperation(normalized, "%")) return "Modulo";
  return null;
}

function isFlatNumericOperation(expression: string, operator: string) {
  if (!expression.includes(operator)) return false;
  const escaped = operator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const number = "-?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?";
  return new RegExp(`^${number}(?:${escaped}${number})+$`, "i").test(expression);
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function lcm(left: number, right: number) {
  if (left === 0 || right === 0) return 0;
  return Math.abs(left * right) / gcd(left, right);
}

function factorialOf(value: number) {
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function exactNumericEvaluation(expression: string): NumericEvaluation | null {
  const special = exactOperationEvaluation(expression);
  if (special) return special;

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

function exactOperationEvaluation(expression: string): NumericEvaluation | null {
  const excel = parseExcelFunction(expression);
  if (excel) {
    const { args, name } = excel;
    const nonBlankArgs = args.filter((item) => item.trim() !== "");
    const numbers = parseNumericArguments(nonBlankArgs);
    const op = normalizeExcelFunctionName(name);
    const numeric = (...values: number[]): NumericEvaluation => ({ result: formatNumber(values[0]), trig: false, assumptions: [] });
    if (op === "pi") return numeric(Math.PI);
    if (op === "rand") return { result: formatNumber(0.5), trig: false, assumptions: ["RAND is nondeterministic in Excel; this solver returns a stable preview value."] };
    if (op === "randbetween" && numbers.length >= 2) return numeric(Math.floor(numbers[0]) + Math.floor(0.5 * (Math.floor(numbers[1]) - Math.floor(numbers[0]) + 1)));
    if (["sum", "subtotal.sum"].includes(op) && numbers.length) return numeric(numbers.reduce((total, value) => total + value, 0));
    if (op === "sumsq" && numbers.length) return numeric(numbers.reduce((total, value) => total + value ** 2, 0));
    if (op === "sumproduct" && numbers.length) {
      const pairs = splitPairArrays(numbers);
      return numeric(pairs ? pairs.left.reduce((total, value, index) => total + value * pairs.right[index], 0) : numbers.reduce((total, value) => total + value, 0));
    }
    if (op === "sumx2my2" && numbers.length) {
      const pairs = splitPairArrays(numbers);
      if (pairs) return numeric(pairs.left.reduce((total, value, index) => total + value ** 2 - pairs.right[index] ** 2, 0));
    }
    if (op === "sumx2py2" && numbers.length) {
      const pairs = splitPairArrays(numbers);
      if (pairs) return numeric(pairs.left.reduce((total, value, index) => total + value ** 2 + pairs.right[index] ** 2, 0));
    }
    if (op === "sumxmy2" && numbers.length) {
      const pairs = splitPairArrays(numbers);
      if (pairs) return numeric(pairs.left.reduce((total, value, index) => total + (value - pairs.right[index]) ** 2, 0));
    }
    if (op === "product" && numbers.length) return numeric(numbers.reduce((total, value) => total * value, 1));
    if (["average", "averagea", "mean"].includes(op) && numbers.length) return numeric(numbers.reduce((total, value) => total + value, 0) / numbers.length);
    if (op === "geomean" && numbers.length && numbers.every((value) => value > 0)) return numeric(numbers.reduce((total, value) => total * value, 1) ** (1 / numbers.length));
    if (op === "harmean" && numbers.length && numbers.every((value) => value > 0)) return numeric(numbers.length / numbers.reduce((total, value) => total + 1 / value, 0));
    if (op === "median" && numbers.length) return numeric(median(numbers));
    if (["mode", "mode.sngl", "mode.mult"].includes(op) && numbers.length) {
      const modes = modeValues(numbers);
      return { result: modes.length ? modes.map(formatNumber).join(", ") : "No mode", trig: false, assumptions: modes.length > 1 ? ["Multiple modes exist."] : [] };
    }
    if (["min", "mina"].includes(op) && numbers.length) return numeric(Math.min(...numbers));
    if (["max", "maxa"].includes(op) && numbers.length) return numeric(Math.max(...numbers));
    if (op === "count") return numeric(numbers.length);
    if (op === "counta") return numeric(nonBlankArgs.length);
    if (op === "countblank") return numeric(args.length - nonBlankArgs.length);
    if ((op === "stdev" || op === "stdev.p" || op === "stdevpa") && numbers.length) return numeric(Math.sqrt(variance(numbers, false)));
    if ((op === "stdev.s" || op === "stdeva") && numbers.length >= 2) return numeric(Math.sqrt(variance(numbers, true)));
    if ((op === "var" || op === "var.p" || op === "variance" || op === "varpa") && numbers.length) return numeric(variance(numbers, false));
    if ((op === "var.s" || op === "vara") && numbers.length >= 2) return numeric(variance(numbers, true));
    if (op === "avedev" && numbers.length) return numeric(averageDeviation(numbers));
    if (op === "devsq" && numbers.length) return numeric(deviationSquares(numbers));
    if (op === "skew" && numbers.length >= 3) return numeric(skewness(numbers));
    if (op === "kurt" && numbers.length >= 4) return numeric(kurtosis(numbers));
    if (op === "standardize" && numbers.length >= 3) return numeric((numbers[0] - numbers[1]) / numbers[2]);
    if (op === "rank.eq" && numbers.length >= 2) return numeric(rankEq(numbers[0], numbers.slice(1), false));
    if (op === "rank.avg" && numbers.length >= 2) return numeric(rankAverage(numbers[0], numbers.slice(1), false));
    if (["correl", "pearson", "covariance.p", "covariance.s", "slope", "intercept", "rsq", "forecast.linear", "steyx"].includes(op)) {
      const paired = op === "forecast.linear" ? splitPairArrays(numbers.slice(1)) : splitPairArrays(numbers);
      if (paired) {
        if (op === "correl" || op === "pearson") return numeric(correlation(paired.left, paired.right));
        if (op === "covariance.p") return numeric(covariance(paired.left, paired.right, false));
        if (op === "covariance.s") return numeric(covariance(paired.left, paired.right, true));
        if (op === "slope") return numeric(linearSlope(paired.left, paired.right));
        if (op === "intercept") return numeric(linearIntercept(paired.left, paired.right));
        if (op === "rsq") return numeric(correlation(paired.left, paired.right) ** 2);
        if (op === "forecast.linear") return numeric(linearIntercept(paired.left, paired.right) + linearSlope(paired.left, paired.right) * numbers[0]);
        if (op === "steyx") return numeric(standardErrorY(paired.left, paired.right));
      }
    }
    if ((op === "gcd" || op === "hcf") && numbers.length >= 2 && numbers.every(Number.isInteger)) return { result: formatNumber(numbers.map(Math.abs).reduce(gcd)), trig: false, assumptions: ["Greatest common divisor is computed over integers."] };
    if (op === "lcm" && numbers.length >= 2 && numbers.every(Number.isInteger)) return { result: formatNumber(numbers.map(Math.abs).reduce(lcm)), trig: false, assumptions: ["Least common multiple is computed over integers."] };
    if (op === "percent" && numbers.length >= 2) return { result: formatNumber((numbers[0] / 100) * numbers[1]), trig: false, assumptions: ["Percent-of is interpreted as percent / 100 times the base value."] };
    if (op === "abs" && numbers.length >= 1) return numeric(Math.abs(numbers[0]));
    if (op === "sign" && numbers.length >= 1) return numeric(Math.sign(numbers[0]));
    if (op === "even" && numbers.length >= 1) return numeric(roundToEvenOdd(numbers[0], 2));
    if (op === "odd" && numbers.length >= 1) return numeric(roundToEvenOdd(numbers[0], 1));
    if (op === "int" && numbers.length >= 1) return numeric(Math.floor(numbers[0]));
    if (op === "trunc" && numbers.length >= 1) return numeric(Math.trunc(numbers[0] * 10 ** (numbers[1] ?? 0)) / 10 ** (numbers[1] ?? 0));
    if (op === "round" && numbers.length >= 2) return numeric(roundToPlaces(numbers[0], numbers[1]));
    if (op === "roundup" && numbers.length >= 2) return numeric(roundAwayFromZero(numbers[0], numbers[1]));
    if (op === "rounddown" && numbers.length >= 2) return numeric(roundTowardZero(numbers[0], numbers[1]));
    if (["ceiling", "ceiling.math", "ceiling.precise", "iso.ceiling"].includes(op) && numbers.length >= 1) return numeric(Math.ceil(numbers[0] / Math.abs(numbers[1] || 1)) * Math.abs(numbers[1] || 1));
    if (["floor", "floor.math", "floor.precise"].includes(op) && numbers.length >= 1) return numeric(Math.floor(numbers[0] / Math.abs(numbers[1] || 1)) * Math.abs(numbers[1] || 1));
    if (op === "mround" && numbers.length >= 2) return numeric(Math.round(numbers[0] / numbers[1]) * numbers[1]);
    if (op === "mod" && numbers.length >= 2) return numeric(((numbers[0] % numbers[1]) + numbers[1]) % numbers[1]);
    if (op === "quotient" && numbers.length >= 2) return numeric(Math.trunc(numbers[0] / numbers[1]));
    if (op === "power" && numbers.length >= 2) return numeric(numbers[0] ** numbers[1]);
    if (op === "sqrt" && numbers.length >= 1 && numbers[0] >= 0) {
      const root = Math.sqrt(numbers[0]);
      if (Number.isInteger(root)) return numeric(root);
      return { result: `Exact: sqrt(${formatNumber(numbers[0])}); Approximate: ${formatNumber(root)}`, trig: false, assumptions: ["Approximate decimal rounded to 6 places."] };
    }
    if (op === "sqrtpi" && numbers.length >= 1 && numbers[0] >= 0) return numeric(Math.sqrt(numbers[0] * Math.PI));
    if (op === "fact" && numbers.length >= 1 && Number.isInteger(numbers[0]) && numbers[0] >= 0 && numbers[0] <= 170) return numeric(factorialOf(numbers[0]));
    if (op === "factdouble" && numbers.length >= 1 && Number.isInteger(numbers[0]) && numbers[0] >= 0 && numbers[0] <= 300) return numeric(doubleFactorial(numbers[0]));
    if (op === "combin" && numbers.length >= 2) return numeric(combination(numbers[0], numbers[1]));
    if (op === "combina" && numbers.length >= 2) return numeric(combination(numbers[0] + numbers[1] - 1, numbers[1]));
    if (op === "permut" && numbers.length >= 2) return numeric(permutation(numbers[0], numbers[1]));
    if (op === "permutationa" && numbers.length >= 2) return numeric(numbers[0] ** numbers[1]);
    if (op === "multinomial" && numbers.length >= 1 && numbers.every(Number.isInteger)) return numeric(factorialOf(numbers.reduce((total, value) => total + value, 0)) / numbers.reduce((total, value) => total * factorialOf(value), 1));
    if (op === "degrees" && numbers.length >= 1) return numeric(numbers[0] * 180 / Math.PI);
    if (op === "radians" && numbers.length >= 1) return numeric(numbers[0] * Math.PI / 180);
    if (op === "acos" && numbers.length >= 1) return numeric(Math.acos(numbers[0]));
    if (op === "acosh" && numbers.length >= 1) return numeric(Math.acosh(numbers[0]));
    if (op === "asin" && numbers.length >= 1) return numeric(Math.asin(numbers[0]));
    if (op === "asinh" && numbers.length >= 1) return numeric(Math.asinh(numbers[0]));
    if (op === "atan" && numbers.length >= 1) return numeric(Math.atan(numbers[0]));
    if (op === "atan2" && numbers.length >= 2) return numeric(Math.atan2(numbers[0], numbers[1]));
    if (op === "atanh" && numbers.length >= 1) return numeric(Math.atanh(numbers[0]));
    if (op === "cosh" && numbers.length >= 1) return numeric(Math.cosh(numbers[0]));
    if (op === "sinh" && numbers.length >= 1) return numeric(Math.sinh(numbers[0]));
    if (op === "tanh" && numbers.length >= 1) return numeric(Math.tanh(numbers[0]));
    if (op === "sec" && numbers.length >= 1) return numeric(1 / Math.cos(numbers[0]));
    if (op === "sech" && numbers.length >= 1) return numeric(1 / Math.cosh(numbers[0]));
    if (op === "csc" && numbers.length >= 1) return numeric(1 / Math.sin(numbers[0]));
    if (op === "csch" && numbers.length >= 1) return numeric(1 / Math.sinh(numbers[0]));
    if (op === "cot" && numbers.length >= 1) return numeric(1 / Math.tan(numbers[0]));
    if (op === "coth" && numbers.length >= 1) return numeric(1 / Math.tanh(numbers[0]));
    if (op === "large" && numbers.length >= 2) return nthSorted(numbers.slice(0, -1), numbers[numbers.length - 1], "desc");
    if (op === "small" && numbers.length >= 2) return nthSorted(numbers.slice(0, -1), numbers[numbers.length - 1], "asc");
    if ((op === "percentile" || op === "percentile.inc") && numbers.length >= 2) return numeric(percentileInc(numbers.slice(0, -1), numbers[numbers.length - 1]));
    if (op === "percentile.exc" && numbers.length >= 2) return numeric(percentileExc(numbers.slice(0, -1), numbers[numbers.length - 1]));
    if (op === "percentrank.inc" && numbers.length >= 2) return numeric(percentRankInc(numbers.slice(1), numbers[0]));
    if ((op === "quartile" || op === "quartile.inc") && numbers.length >= 2) return numeric(quartileInc(numbers.slice(0, -1), numbers[numbers.length - 1]));
    if (op === "quartile.exc" && numbers.length >= 2) return numeric(percentileExc(numbers.slice(0, -1), numbers[numbers.length - 1] / 4));
    if (op === "norm.s.dist" && numbers.length >= 1) return numeric(numbers[1] ? normalCdf(numbers[0]) : normalPdf(numbers[0], 0, 1));
    if (op === "norm.dist" && numbers.length >= 3) return numeric(numbers[3] ? normalCdf((numbers[0] - numbers[1]) / numbers[2]) : normalPdf(numbers[0], numbers[1], numbers[2]));
    if (op === "binom.dist" && numbers.length >= 3) return numeric(numbers[3] ? binomialCdf(numbers[0], numbers[1], numbers[2]) : binomialPmf(numbers[0], numbers[1], numbers[2]));
    if (op === "poisson.dist" && numbers.length >= 2) return numeric(numbers[2] ? poissonCdf(numbers[0], numbers[1]) : poissonPmf(numbers[0], numbers[1]));
    if (op === "expon.dist" && numbers.length >= 2) return numeric(numbers[2] ? 1 - Math.exp(-numbers[1] * numbers[0]) : numbers[1] * Math.exp(-numbers[1] * numbers[0]));
    if (op === "weibull.dist" && numbers.length >= 3) {
      const scaled = (numbers[0] / numbers[2]) ** numbers[1];
      return numeric(numbers[3] ? 1 - Math.exp(-scaled) : (numbers[1] / (numbers[2] ** numbers[1])) * (numbers[0] ** (numbers[1] - 1)) * Math.exp(-scaled));
    }
    if (op === "lognorm.dist" && numbers.length >= 3 && numbers[0] > 0) return numeric(numbers[3] ? normalCdf((Math.log(numbers[0]) - numbers[1]) / numbers[2]) : Math.exp(-((Math.log(numbers[0]) - numbers[1]) ** 2) / (2 * numbers[2] ** 2)) / (numbers[0] * numbers[2] * Math.sqrt(2 * Math.PI)));
  }

  const factorial = expression.match(/^([-+]?\d+)!$/);
  if (factorial) {
    const value = Number(factorial[1]);
    if (value < 0 || value > 170) return null;
    return { result: formatNumber(factorialOf(value)), trig: false, assumptions: ["Factorial is computed for non-negative integers."] };
  }
  return null;
}

function parseExcelFunction(expression: string) {
  const match = expression.match(/^=?([a-z][a-z0-9.]*)\((.*)\)$/i);
  if (!match) return null;
  return {
    args: splitExcelArgs(match[2]),
    name: match[1],
  };
}

function splitExcelArgs(value: string) {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if ((char === "," || char === ";") && depth === 0) {
      args.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  args.push(current.trim());
  return args;
}

function normalizeExcelFunctionName(value: string) {
  const lower = value.toLowerCase();
  const aliases: Record<string, string> = {
    averagea: "average",
    forecast: "forecast.linear",
    mode_sngl: "mode.sngl",
    stdevp: "stdev.p",
    stdevs: "stdev.s",
    varp: "var.p",
    vars: "var.s",
  };
  return aliases[lower] ?? lower;
}

function parseNumericArguments(args: string[]): number[] {
  return args.map(parseNumericArgument).filter((value) => Number.isFinite(value));
}

function parseNumericArgument(arg: string): number {
  const trimmed = arg.trim();
  if (!trimmed) return Number.NaN;
  if (/^true$/i.test(trimmed)) return 1;
  if (/^false$/i.test(trimmed)) return 0;
  const direct = Number(trimmed);
  if (Number.isFinite(direct)) return direct;
  const evaluated = evaluateNumericExpression(trimmed);
  if (!evaluated) return Number.NaN;
  const approximate = evaluated.result.match(/Approximate:\s*(-?\d+(?:\.\d+)?)/)?.[1];
  const plain = evaluated.result.match(/^-?\d+(?:\.\d+)?$/)?.[0];
  return Number(approximate ?? plain);
}

function splitPairArrays(values: number[]) {
  if (values.length < 2 || values.length % 2 !== 0) return null;
  const midpoint = values.length / 2;
  return {
    left: values.slice(0, midpoint),
    right: values.slice(midpoint),
  };
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function modeValues(values: number[]) {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const max = Math.max(...counts.values());
  if (max <= 1) return [];
  return Array.from(counts.entries()).filter(([, count]) => count === max).map(([value]) => value).sort((a, b) => a - b);
}

function variance(values: number[], sample: boolean) {
  const average = mean(values);
  const denominator = sample ? values.length - 1 : values.length;
  return values.reduce((total, value) => total + (value - average) ** 2, 0) / denominator;
}

function averageDeviation(values: number[]) {
  const average = mean(values);
  return values.reduce((total, value) => total + Math.abs(value - average), 0) / values.length;
}

function deviationSquares(values: number[]) {
  const average = mean(values);
  return values.reduce((total, value) => total + (value - average) ** 2, 0);
}

function skewness(values: number[]) {
  const sampleDeviation = Math.sqrt(variance(values, true));
  if (sampleDeviation === 0) return Number.NaN;
  const average = mean(values);
  const n = values.length;
  const standardizedSum = values.reduce((total, value) => total + ((value - average) / sampleDeviation) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * standardizedSum;
}

function kurtosis(values: number[]) {
  const sampleDeviation = Math.sqrt(variance(values, true));
  if (sampleDeviation === 0) return Number.NaN;
  const average = mean(values);
  const n = values.length;
  const fourthPowerSum = values.reduce((total, value) => total + ((value - average) / sampleDeviation) ** 4, 0);
  return (n * (n + 1) * fourthPowerSum) / ((n - 1) * (n - 2) * (n - 3)) - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
}

function rankEq(value: number, values: number[], ascending: boolean) {
  const before = ascending ? values.filter((item) => item < value).length : values.filter((item) => item > value).length;
  return before + 1;
}

function rankAverage(value: number, values: number[], ascending: boolean) {
  const positions = values
    .map((item) => item === value ? rankEq(item, values, ascending) : null)
    .filter((item): item is number => item !== null);
  if (!positions.length) return Number.NaN;
  const duplicateCount = values.filter((item) => item === value).length;
  return positions[0] + (duplicateCount - 1) / 2;
}

function covariance(left: number[], right: number[], sample: boolean) {
  const n = Math.min(left.length, right.length);
  if (n < (sample ? 2 : 1)) return Number.NaN;
  const leftMean = mean(left.slice(0, n));
  const rightMean = mean(right.slice(0, n));
  const denominator = sample ? n - 1 : n;
  return left.slice(0, n).reduce((total, value, index) => total + (value - leftMean) * (right[index] - rightMean), 0) / denominator;
}

function correlation(left: number[], right: number[]) {
  const leftVariance = variance(left, false);
  const rightVariance = variance(right, false);
  if (leftVariance === 0 || rightVariance === 0) return Number.NaN;
  return covariance(left, right, false) / Math.sqrt(leftVariance * rightVariance);
}

function linearSlope(knownY: number[], knownX: number[]) {
  return covariance(knownX, knownY, true) / variance(knownX, true);
}

function linearIntercept(knownY: number[], knownX: number[]) {
  return mean(knownY) - linearSlope(knownY, knownX) * mean(knownX);
}

function standardErrorY(knownY: number[], knownX: number[]) {
  if (knownY.length < 3 || knownY.length !== knownX.length) return Number.NaN;
  const slope = linearSlope(knownY, knownX);
  const intercept = linearIntercept(knownY, knownX);
  const residualSum = knownY.reduce((total, y, index) => total + (y - (intercept + slope * knownX[index])) ** 2, 0);
  return Math.sqrt(residualSum / (knownY.length - 2));
}

function roundToPlaces(value: number, places: number) {
  const factor = 10 ** Math.trunc(places);
  return Math.round(value * factor) / factor;
}

function roundAwayFromZero(value: number, places: number) {
  const factor = 10 ** Math.trunc(places);
  return Math.sign(value) * Math.ceil(Math.abs(value) * factor) / factor;
}

function roundTowardZero(value: number, places: number) {
  const factor = 10 ** Math.trunc(places);
  return Math.sign(value) * Math.floor(Math.abs(value) * factor) / factor;
}

function roundToEvenOdd(value: number, targetParity: number) {
  if (value === 0) return targetParity % 2 === 0 ? 0 : 1;
  const sign = value < 0 ? -1 : 1;
  let rounded = Math.ceil(Math.abs(value));
  const parity = Math.abs(targetParity) % 2;
  if (rounded % 2 !== parity) rounded += 1;
  return sign * rounded;
}

function doubleFactorial(value: number) {
  if (value <= 1) return 1;
  let result = 1;
  for (let factor = value; factor > 1; factor -= 2) result *= factor;
  return result;
}

function combination(n: number, k: number) {
  const total = Math.trunc(n);
  const chosen = Math.trunc(k);
  if (total < 0 || chosen < 0 || chosen > total) return Number.NaN;
  return factorialOf(total) / (factorialOf(chosen) * factorialOf(total - chosen));
}

function permutation(n: number, k: number) {
  const total = Math.trunc(n);
  const chosen = Math.trunc(k);
  if (total < 0 || chosen < 0 || chosen > total) return Number.NaN;
  return factorialOf(total) / factorialOf(total - chosen);
}

function nthSorted(values: number[], rank: number, order: "asc" | "desc") {
  const index = Math.trunc(rank) - 1;
  if (index < 0 || index >= values.length) return null;
  const sorted = [...values].sort((a, b) => order === "asc" ? a - b : b - a);
  return { result: formatNumber(sorted[index]), trig: false, assumptions: [] };
}

function percentileInc(values: number[], k: number) {
  if (!values.length || k < 0 || k > 1) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * k;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (position - lower) * (sorted[upper] - sorted[lower]);
}

function quartileInc(values: number[], quartile: number) {
  const q = Math.trunc(quartile);
  if (q < 0 || q > 4) return Number.NaN;
  return percentileInc(values, q / 4);
}

function percentileExc(values: number[], k: number) {
  if (!values.length || k <= 0 || k >= 1) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const position = k * (sorted.length + 1);
  if (position < 1 || position > sorted.length) return Number.NaN;
  const lowerIndex = Math.floor(position) - 1;
  const upperIndex = Math.ceil(position) - 1;
  if (lowerIndex === upperIndex) return sorted[lowerIndex];
  return sorted[lowerIndex] + (position - Math.floor(position)) * (sorted[upperIndex] - sorted[lowerIndex]);
}

function percentRankInc(values: number[], value: number) {
  if (values.length < 2) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const exactIndex = sorted.findIndex((item) => item === value);
  if (exactIndex >= 0) return exactIndex / (sorted.length - 1);
  for (let index = 0; index < sorted.length - 1; index += 1) {
    const lower = sorted[index];
    const upper = sorted[index + 1];
    if (value >= lower && value <= upper) {
      const span = upper - lower;
      if (span === 0) return index / (sorted.length - 1);
      return (index + (value - lower) / span) / (sorted.length - 1);
    }
  }
  return Number.NaN;
}

function erf(value: number) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}

function normalCdf(value: number) {
  return 0.5 * (1 + erf(value / Math.sqrt(2)));
}

function normalPdf(value: number, average: number, standardDeviation: number) {
  if (standardDeviation <= 0) return Number.NaN;
  const z = (value - average) / standardDeviation;
  return Math.exp(-0.5 * z ** 2) / (standardDeviation * Math.sqrt(2 * Math.PI));
}

function binomialPmf(successes: number, trials: number, probability: number) {
  const k = Math.trunc(successes);
  const n = Math.trunc(trials);
  if (k < 0 || n < 0 || k > n || probability < 0 || probability > 1) return Number.NaN;
  return combination(n, k) * probability ** k * (1 - probability) ** (n - k);
}

function binomialCdf(successes: number, trials: number, probability: number) {
  let total = 0;
  for (let k = 0; k <= Math.trunc(successes); k += 1) total += binomialPmf(k, trials, probability);
  return total;
}

function poissonPmf(events: number, lambda: number) {
  const k = Math.trunc(events);
  if (k < 0 || lambda < 0) return Number.NaN;
  return Math.exp(-lambda) * lambda ** k / factorialOf(k);
}

function poissonCdf(events: number, lambda: number) {
  let total = 0;
  for (let k = 0; k <= Math.trunc(events); k += 1) total += poissonPmf(k, lambda);
  return total;
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
