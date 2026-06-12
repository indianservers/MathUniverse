import { symbolicDerivative, symbolicIntegral, symbolicLimit, trySymbolic } from "../utils/symbolic";
import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type CalculusTerm = {
  coefficient: number;
  display: string;
  kind: "constant" | "power" | "sin" | "cos";
  power?: number;
};

type LimitRequest = {
  expression: string;
  target: string;
  variable: string;
};

const epsilon = 1e-9;

export function solveCalculus(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind === "derivative") return solveDerivative(classification);
  if (classification.kind === "integral") return solveIntegral(classification);
  if (classification.kind === "limit") return solveLimit(classification);
  return null;
}

function solveDerivative(classification: ProblemClassification): ProblemSolverResult | null {
  const variable = classification.variable ?? "x";
  const expression = cleanCalculusExpression(classification.expression ?? classification.normalizedInput, variable);
  const deterministic = derivativeByRules(expression, variable);
  if (deterministic) {
    return calculusResult(classification, {
      method: "Derivative rules",
      result: deterministic.result,
      steps: [
        `Function: f(${variable}) = ${formatExpression(expression)}.`,
        "Differentiate term by term.",
        ...deterministic.steps,
        `Combine: f'(${variable}) = ${deterministic.result}.`,
        `Final answer: ${deterministic.result}.`,
      ],
    });
  }

  const symbolic = trySymbolic(() => symbolicDerivative(expression, variable));
  if (!symbolic) return null;
  return calculusResult(classification, {
    method: "CAS-assisted result",
    result: formatExpression(symbolic.result),
    steps: [
      `Function: f(${variable}) = ${formatExpression(expression)}.`,
      "The deterministic Phase 5 derivative rules do not fully cover this form.",
      "CAS-assisted result: use the symbolic engine for the final derivative.",
      ...symbolic.steps.map(formatStepExpression),
      `Final answer: ${formatExpression(symbolic.result)}.`,
    ],
    warnings: ["CAS-assisted result: detailed textbook derivation is not available for this form yet."],
  });
}

function solveIntegral(classification: ProblemClassification): ProblemSolverResult | null {
  const variable = classification.variable ?? "x";
  const definite = parseDefiniteIntegral(classification.rawInput, variable);
  if (definite) return solveDefiniteIntegral(classification, definite.expression, variable, definite.from, definite.to);
  const expression = cleanCalculusExpression(classification.expression ?? classification.normalizedInput, variable);
  const deterministic = integralByRules(expression, variable);
  if (deterministic) {
    return calculusResult(classification, {
      method: "Antiderivative rules",
      result: `${deterministic.result} + C`,
      assumptions: ["For indefinite integrals, a constant of integration + C is included."],
      steps: [
        `Integrand: ${formatExpression(expression)}.`,
        `Integrate with respect to ${variable}.`,
        "Break the integrand into terms.",
        ...deterministic.steps,
        "Add the constant of integration.",
        `Final answer: ${deterministic.result} + C.`,
      ],
    });
  }

  const symbolic = trySymbolic(() => symbolicIntegral(expression, variable));
  if (!symbolic) return null;
  return calculusResult(classification, {
    method: "CAS-assisted result",
    result: formatExpression(symbolic.result),
    assumptions: ["For indefinite integrals, a constant of integration + C is included."],
    steps: [
      `Integrand: ${formatExpression(expression)}.`,
      "The deterministic Phase 5 integral rules do not fully cover this form.",
      "CAS-assisted result: use the symbolic engine for the final antiderivative.",
      ...symbolic.steps.map(formatStepExpression),
      `Final answer: ${formatExpression(symbolic.result)}.`,
    ],
    warnings: ["CAS-assisted result: detailed textbook derivation is not available for this form yet."],
  });
}

function solveDefiniteIntegral(classification: ProblemClassification, expression: string, variable: string, from: number, to: number): ProblemSolverResult | null {
  const deterministic = integralByRules(expression, variable);
  if (!deterministic) {
    return calculusResult(classification, {
      method: "Definite integral visual support only",
      result: "Definite integral not solved exactly",
      steps: [
        `Integrand: ${formatExpression(expression)}.`,
        `Bounds: ${variable} = ${formatNumber(from)} to ${variable} = ${formatNumber(to)}.`,
        "The deterministic Phase 5 integral rules do not fully cover this definite integral.",
        "No exact definite-integral answer was generated.",
      ],
      warnings: ["Definite integral exact solving is limited to simple Phase 5 antiderivative rules."],
    });
  }
  const lower = evaluateSimpleExpression(deterministic.result, variable, from);
  const upper = evaluateSimpleExpression(deterministic.result, variable, to);
  if (lower === null || upper === null) return null;
  const value = upper - lower;
  return calculusResult(classification, {
    method: "Definite integral by antiderivative",
    result: formatNumber(value),
    assumptions: ["For definite integrals, evaluate F(b) - F(a)."],
    steps: [
      `Integrand: ${formatExpression(expression)}.`,
      `Bounds: ${variable} = ${formatNumber(from)} to ${variable} = ${formatNumber(to)}.`,
      ...deterministic.steps,
      `Antiderivative: F(${variable}) = ${deterministic.result}.`,
      `Evaluate F(${formatNumber(to)}) - F(${formatNumber(from)}).`,
      `Final answer: ${formatNumber(upper)} - ${formatNumber(lower)} = ${formatNumber(value)}.`,
    ],
  });
}

function solveLimit(classification: ProblemClassification): ProblemSolverResult | null {
  const request = parseLimitRequest(classification);
  if (!request) return null;
  const { expression, target, variable } = request;
  const formattedExpression = formatExpression(expression);
  const formattedTarget = formatExpression(target);

  if (isStandardSineLimit(expression, variable, target)) {
    return calculusResult(classification, {
      method: "Standard limit",
      result: "1",
      assumptions: [`Limit variable: ${variable}. Approach value: ${formattedTarget}.`],
      steps: [
        `Expression: ${formattedExpression}.`,
        `Variable and approach value: ${variable} -> ${formattedTarget}.`,
        "Direct substitution gives 0/0, an indeterminate form.",
        "Use the standard radian limit: lim x->0 sin(x)/x = 1.",
        "Final answer: 1.",
      ],
    });
  }

  const direct = directSubstitution(expression, variable, target);
  if (direct) {
    return calculusResult(classification, {
      method: "Direct substitution",
      result: direct,
      assumptions: [`Limit variable: ${variable}. Approach value: ${formattedTarget}.`],
      steps: [
        `Expression: ${formattedExpression}.`,
        `Variable and approach value: ${variable} -> ${formattedTarget}.`,
        "Try direct substitution.",
        `Substitute ${variable} = ${formattedTarget}: ${formatExpression(expression.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${target})`))}.`,
        `Simplify the substituted value: ${direct}.`,
        `Final answer: ${direct}.`,
      ],
    });
  }

  const symbolic = trySymbolic(() => symbolicLimit(expression, variable, target));
  if (!symbolic) return null;
  return calculusResult(classification, {
    method: "CAS-assisted result",
    result: formatExpression(symbolic.result),
    assumptions: [`Limit variable: ${variable}. Approach value: ${formattedTarget}.`],
    steps: [
      `Expression: ${formattedExpression}.`,
      `Variable and approach value: ${variable} -> ${formattedTarget}.`,
      "Direct substitution did not produce a safe finite value with the Phase 5 evaluator.",
      "CAS-assisted result: use symbolic limit laws for the final value.",
      ...symbolic.steps.map(formatStepExpression),
      `Final answer: ${formatExpression(symbolic.result)}.`,
    ],
    warnings: ["CAS-assisted result: detailed textbook derivation is not available for this limit form yet."],
  });
}

function calculusResult(classification: ProblemClassification, data: {
  assumptions?: string[];
  method: string;
  result: string;
  steps: string[];
  warnings?: string[];
}): ProblemSolverResult {
  return {
    kind: classification.kind,
    method: data.method,
    title: labelForKind(classification.kind),
    normalizedInput: classification.normalizedInput,
    result: data.result,
    restrictions: [],
    steps: data.steps,
    assumptions: [...classification.assumptions, ...(data.assumptions ?? [])],
    warnings: [...classification.warnings, ...(data.warnings ?? [])],
    canCopy: true,
  };
}

function derivativeByRules(expression: string, variable: string) {
  const terms = parseCalculusTerms(expression, variable);
  if (!terms?.length) return null;
  const derivativeTerms: Array<{ result: string; step: string }> = [];
  for (const term of terms) {
    const result = derivativeTerm(term, variable);
    if (!result) return null;
    if (result.result !== "0") derivativeTerms.push(result);
  }
  const result = joinTerms(derivativeTerms.map((item) => item.result)) || "0";
  return { result, steps: derivativeTerms.length ? derivativeTerms.map((item) => item.step) : ["Every term is constant, so the derivative is 0."] };
}

function integralByRules(expression: string, variable: string) {
  const terms = parseCalculusTerms(expression, variable);
  if (!terms?.length) return null;
  const integralTerms: Array<{ result: string; step: string }> = [];
  for (const term of terms) {
    const result = integralTerm(term, variable);
    if (!result) return null;
    integralTerms.push(result);
  }
  const result = joinTerms(integralTerms.map((item) => item.result)) || "0";
  return { result, steps: integralTerms.map((item) => item.step) };
}

function derivativeTerm(term: CalculusTerm, variable: string) {
  if (term.kind === "constant") {
    return { result: "0", step: `d/d${variable}(${term.display}) = 0 by the constant rule.` };
  }
  if (term.kind === "sin") {
    const result = formatSignedCoefficient(term.coefficient, `cos(${variable})`);
    return { result, step: `d/d${variable}(${term.display}) = ${result} using the sine rule.` };
  }
  if (term.kind === "cos") {
    const result = formatSignedCoefficient(-term.coefficient, `sin(${variable})`);
    return { result, step: `d/d${variable}(${term.display}) = ${result} using the cosine rule.` };
  }
  const power = term.power ?? 1;
  const coefficient = term.coefficient * power;
  const nextPower = power - 1;
  const result = formatPowerTerm(coefficient, nextPower, variable);
  const rule = power === 1 ? "constant multiple rule" : "power rule";
  return { result, step: `d/d${variable}(${term.display}) = ${result} using the ${rule}.` };
}

function integralTerm(term: CalculusTerm, variable: string) {
  if (term.kind === "constant") {
    const result = formatPowerTerm(term.coefficient, 1, variable);
    return { result, step: `Integral of ${term.display} is ${result} by the constant rule.` };
  }
  if (term.kind === "sin") {
    const result = formatSignedCoefficient(-term.coefficient, `cos(${variable})`);
    return { result, step: `Integral of ${term.display} is ${result} using integral of sin(${variable}).` };
  }
  if (term.kind === "cos") {
    const result = formatSignedCoefficient(term.coefficient, `sin(${variable})`);
    return { result, step: `Integral of ${term.display} is ${result} using integral of cos(${variable}).` };
  }
  const power = term.power ?? 1;
  const nextPower = power + 1;
  const result = formatPowerTerm(term.coefficient, nextPower, variable, nextPower);
  return { result, step: `Integral of ${term.display} is ${result} using the power rule for antiderivatives.` };
}

function parseCalculusTerms(expression: string, variable: string): CalculusTerm[] | null {
  const pieces = splitSignedTerms(normalizeCalculusExpression(expression));
  if (!pieces.length) return null;
  const terms: CalculusTerm[] = [];
  for (const piece of pieces) {
    const term = parseCalculusTerm(piece, variable);
    if (!term) return null;
    terms.push(term);
  }
  return terms;
}

function parseCalculusTerm(piece: string, variable: string): CalculusTerm | null {
  const sign = piece.startsWith("-") ? -1 : 1;
  const body = piece.replace(/^[+-]/, "");
  const coeffPrefix = body.match(/^(\d+(?:\.\d+)?)\*(sin|cos)\(([^)]+)\)$/i);
  const plainTrig = body.match(/^(sin|cos)\(([^)]+)\)$/i);
  const trig = coeffPrefix ?? plainTrig;
  if (trig) {
    const functionName = (coeffPrefix ? trig[2] : trig[1]).toLowerCase();
    const inner = coeffPrefix ? trig[3] : trig[2];
    if (inner !== variable) return null;
    return {
      coefficient: sign * (coeffPrefix ? Number(trig[1]) : 1),
      display: formatExpression(piece),
      kind: functionName as "sin" | "cos",
    };
  }

  if (!body.includes(variable)) {
    const value = Number(body);
    if (!Number.isFinite(value)) return null;
    return { coefficient: sign * value, display: formatExpression(piece), kind: "constant" };
  }

  const escaped = escapeRegExp(variable);
  const match = body.match(new RegExp(`^(?:(\\d+(?:\\.\\d+)?)\\*)?${escaped}(?:\\^(\\d+))?$`));
  if (!match) return null;
  return {
    coefficient: sign * (match[1] ? Number(match[1]) : 1),
    display: formatExpression(piece),
    kind: "power",
    power: match[2] ? Number(match[2]) : 1,
  };
}

function parseLimitRequest(classification: ProblemClassification): LimitRequest | null {
  const normalized = normalizeArrows(classification.rawInput || classification.normalizedInput);
  const match = normalized.match(/^(?:limit|lim)\s+([a-zA-Z])\s*->\s*([^\s]+)\s+(.+)$/i);
  if (match) {
    return {
      variable: match[1],
      target: normalizeCalculusExpression(match[2]),
      expression: cleanCalculusExpression(match[3], match[1]),
    };
  }
  if (classification.expression && classification.variable) {
    return { variable: classification.variable, target: "0", expression: cleanCalculusExpression(classification.expression, classification.variable) };
  }
  return null;
}

function parseDefiniteIntegral(rawInput: string, variable: string) {
  const match = rawInput.match(/^(?:integrate|integral\s+of)\s+(.+?)\s+from\s+([-+]?\d+(?:\.\d+)?)\s+to\s+([-+]?\d+(?:\.\d+)?)$/i);
  if (!match) return null;
  return { expression: cleanCalculusExpression(match[1], variable), from: Number(match[2]), to: Number(match[3]) };
}

function isStandardSineLimit(expression: string, variable: string, target: string) {
  const normalized = normalizeCalculusExpression(expression).toLowerCase();
  return isZero(Number(target)) && (normalized === `sin(${variable})/${variable}` || normalized === `(sin(${variable}))/${variable}`);
}

function directSubstitution(expression: string, variable: string, target: string) {
  const normalized = normalizeCalculusExpression(expression).replace(/\^/g, "**");
  const substituted = normalized.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${target})`);
  const jsExpression = substituted
    .replace(/sqrt\(/gi, "Math.sqrt(")
    .replace(/abs\(/gi, "Math.abs(")
    .replace(/sin\(/gi, "Math.sin(")
    .replace(/cos\(/gi, "Math.cos(")
    .replace(/tan\(/gi, "Math.tan(");
  if (!/^[\d+\-*/().,\sMathPIcosintaqrubse]+$/.test(jsExpression)) return null;
  try {
    const value = Number(Function(`"use strict"; return (${jsExpression});`)());
    if (!Number.isFinite(value)) return null;
    return formatNumber(value);
  } catch {
    return null;
  }
}

function cleanCalculusExpression(expression: string, variable: string) {
  return normalizeCalculusExpression(expression)
    .replace(new RegExp(`d${escapeRegExp(variable)}$`, "i"), "")
    .replace(/^\u222b/i, "")
    .replace(/dx$/i, "");
}

function normalizeCalculusExpression(value: string) {
  return normalizeArrows(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/([a-zA-Z)])(\d)/g, "$1*$2")
    .replace(/\)([a-zA-Z(])/g, ")*$1");
}

function normalizeArrows(value: string) {
  return value
    .replace(/\u2192|\u00e2\u2020\u2019|\u00c3\u00a2\u00e2\u20ac\u00a0\u00e2\u20ac\u2122/g, "->")
    .replace(/\u222b|\u00e2\u2039\u2020\u00c2\u00ab/g, "\u222b");
}

function evaluateSimpleExpression(expression: string, variable: string, value: number) {
  const substituted = expression.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${formatNumber(value)})`).replace(/\^/g, "**");
  if (!/^[\d+\-*/().\s]+$/.test(substituted)) return null;
  try {
    const evaluated = Number(Function(`"use strict"; return (${substituted});`)());
    return Number.isFinite(evaluated) ? evaluated : null;
  } catch {
    return null;
  }
}

function splitSignedTerms(expression: string) {
  const terms: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if ((char === "+" || char === "-") && depth === 0 && index > start) {
      terms.push(expression.slice(start, index));
      start = index;
    }
  }
  terms.push(expression.slice(start));
  return terms.filter(Boolean);
}

function joinTerms(terms: string[]) {
  return terms.filter((term) => term !== "0").map((term, index) => {
    if (index === 0) return term;
    return term.startsWith("-") ? ` - ${term.slice(1)}` : ` + ${term}`;
  }).join("");
}

function formatPowerTerm(coefficient: number, power: number, variable: string, denominator = 1) {
  if (isZero(coefficient)) return "0";
  const numerator = coefficient;
  if (power === 0) return formatNumber(numerator / denominator);
  const reduced = reduceFraction(numerator, denominator);
  const coefficientText = coefficientFractionText(numerator, denominator);
  const variableText = power === 1 ? variable : `${variable}^${power}`;
  if (reduced.denominator !== 1) {
    const sign = reduced.numerator < 0 ? "-" : "";
    const absNumerator = Math.abs(reduced.numerator);
    const numeratorText = absNumerator === 1 ? variableText : `${formatNumber(absNumerator)}${variableText}`;
    return `${sign}${numeratorText}/${formatNumber(reduced.denominator)}`;
  }
  if (coefficientText === "1") return variableText;
  if (coefficientText === "-1") return `-${variableText}`;
  return `${coefficientText}${variableText}`;
}

function coefficientFractionText(numerator: number, denominator: number) {
  const reduced = reduceFraction(numerator, denominator);
  if (reduced.denominator === 1) return formatNumber(reduced.numerator);
  return `${formatNumber(reduced.numerator)}/${formatNumber(reduced.denominator)}`;
}

function reduceFraction(numerator: number, denominator: number) {
  const sign = numerator * denominator < 0 ? -1 : 1;
  let n = Math.abs(Math.round(numerator));
  let d = Math.abs(Math.round(denominator));
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  return { numerator: sign * n, denominator: d };
}

function gcd(a: number, b: number): number {
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

function formatSignedCoefficient(coefficient: number, expression: string) {
  if (isZero(coefficient - 1)) return expression;
  if (isZero(coefficient + 1)) return `-${expression}`;
  return `${formatNumber(coefficient)}${expression}`;
}

function formatStepExpression(step: string) {
  return formatExpression(step).replace(/\+ C/g, " + C");
}

function formatExpression(value: string) {
  return value.replace(/\*/g, "").replace(/\+/g, " + ").replace(/-/g, " - ").replace(/\s+/g, " ").trim().replace(/^-\s*/, "-");
}

function formatNumber(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function labelForKind(kind: string) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}
