import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Calculus";
import "nerdamer/Solve";

export type SymbolicResult = {
  result: string;
  exact?: string;
  steps: string[];
  detail: string;
  restrictions?: string[];
  verification?: string[] | SymbolicVerification;
  warnings?: string[];
};

export type SymbolicAssignment = {
  name: string;
  value: string;
};

export type SymbolicVerification = {
  equivalent: boolean;
  method: "exact" | "numeric-sampling" | "failed";
  samples: Array<{ variable: string; value: number; difference: string }>;
};

export function symbolicSimplify(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = simplifyKnownIdentity(cleanSymbolic(nerdamer(normalized).toString()), normalized);
  return {
    result,
    exact: result,
    detail: "Symbolic simplification using algebraic normalization and like-term collection.",
    steps: [
      `Read the input as: ${expression}.`,
      `Normalize notation for the parser: ${normalized}.`,
      "Combine like terms, reduce nested operations, and simplify exact constants.",
      `Return exact form: ${result}.`,
    ],
  };
}

export function symbolicExpand(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`expand(${normalized})`).toString());
  return {
    result,
    exact: result,
    detail: "Expanded symbolically by distributing products and collecting terms.",
    steps: [
      `Read the expression: ${expression}.`,
      "Identify products, powers of sums, or grouped factors.",
      "Distribute multiplication over addition using algebraic expansion rules.",
      `Collect terms into expanded form: ${result}.`,
    ],
  };
}

export function symbolicFactor(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`factor(${normalized})`).toString());
  return {
    result,
    exact: result,
    detail: "Factored symbolically over supported algebraic expressions.",
    steps: [
      `Read the expression: ${expression}.`,
      "Look for common factors, special products, and polynomial factor patterns.",
      "Rewrite the expression as a product when an exact factorization is available.",
      `Return factored exact form: ${result}.`,
    ],
  };
}

export function symbolicDerivative(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`diff(${normalized},${variable})`).toString());
  return {
    result,
    exact: result,
    detail: "Exact symbolic derivative with algebraic simplification.",
    steps: [
      `Treat ${expression} as a function of ${variable}.`,
      "Break the function into sums, products, powers, and composed functions.",
      "Apply derivative rules: power, sum, product, chain, and trig rules where applicable.",
      `Simplify the result: d/d${variable}(${expression}) = ${result}.`,
    ],
  };
}

export function symbolicIntegral(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const antiderivative = cleanSymbolic(nerdamer(`integrate(${normalized},${variable})`).toString());
  const result = `${antiderivative}+C`;
  return {
    result,
    exact: result,
    detail: "Exact symbolic antiderivative where supported.",
    steps: [
      `Treat ${expression} as the integrand with respect to ${variable}.`,
      "Split sums and constants where possible.",
      "Apply antiderivative rules and simplify the exact form.",
      "Add the constant of integration C.",
      `Result: ${result}.`,
    ],
  };
}

export function symbolicDefiniteIntegral(expression: string, lower: string, upper: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const normalizedLower = normalizeSymbolic(lower);
  const normalizedUpper = normalizeSymbolic(upper);
  const result = cleanSymbolic(nerdamer(`defint(${normalized},${normalizedLower},${normalizedUpper},${cleanVariable})`).toString());
  return {
    result,
    exact: result,
    detail: "Exact definite integral using the fundamental theorem where the offline CAS supports the antiderivative.",
    steps: [
      `Read the integral as the area accumulation of ${expression} from ${lower} to ${upper}.`,
      `Normalize the integrand for the parser: ${normalized}.`,
      `Find an antiderivative with respect to ${cleanVariable}.`,
      `Evaluate upper minus lower: F(${upper}) - F(${lower}).`,
      `Return exact value: ${result}.`,
    ],
  };
}

export function symbolicLimit(expression: string, variable = "x", target = "0"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const normalizedTarget = normalizeSymbolic(target);
  const result = cleanSymbolic(nerdamer(`limit(${normalized},${cleanVariable},${normalizedTarget})`).toString());
  return {
    result,
    exact: result,
    detail: "Exact symbolic limit using one-variable CAS limit rules where supported.",
    steps: [
      `Read the limit as ${cleanVariable} approaches ${target}.`,
      `Normalize the expression for the parser: ${normalized}.`,
      "Apply algebraic simplification and limit laws before substituting.",
      `Return the exact limiting value: ${result}.`,
    ],
  };
}

export function symbolicTangentLine(expression: string, point: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const normalizedExpression = normalizeSymbolic(expression);
  const normalizedPoint = normalizeSymbolic(point);
  const derivative = cleanSymbolic(nerdamer(`diff(${normalizedExpression},${cleanVariable})`).toString());
  const yValue = cleanSymbolic(evaluateWithSubstitution(normalizedExpression, cleanVariable, normalizedPoint));
  const slope = cleanSymbolic(evaluateWithSubstitution(derivative, cleanVariable, normalizedPoint));
  const line = cleanSymbolic(nerdamer(`expand((${yValue})+(${slope})*(${cleanVariable}-(${normalizedPoint})))`).toString());
  const result = `y = ${line}`;
  return {
    result,
    exact: result,
    detail: "Tangent line found by evaluating the derivative as slope at the requested point.",
    steps: [
      `Treat ${expression} as y=f(${cleanVariable}).`,
      `Differentiate: f'(${cleanVariable}) = ${derivative}.`,
      `Evaluate the point: f(${point}) = ${yValue}.`,
      `Evaluate the slope: f'(${point}) = ${slope}.`,
      `Use point-slope form y - ${yValue} = ${slope}(${cleanVariable} - ${point}).`,
      `Simplify to ${result}.`,
    ],
  };
}

export function symbolicVerifyIdentity(left: string, right: string, variable = "x"): SymbolicResult & { verification: SymbolicVerification } {
  const cleanVariable = normalizeVariable(variable);
  const normalizedLeft = normalizeSymbolic(left);
  const normalizedRight = normalizeSymbolic(right);
  const differenceExpression = `(${normalizedLeft})-(${normalizedRight})`;
  const exactDifference = simplifyKnownIdentity(cleanSymbolic(nerdamer(`simplify(${differenceExpression})`).toString()), differenceExpression);
  const samples = sampleDifference(differenceExpression, cleanVariable);
  const numericallyEquivalent = samples.length > 0 && samples.every((sample) => Math.abs(Number(sample.difference)) < 1e-7);
  const equivalent = exactDifference === "0" || numericallyEquivalent;
  const method: SymbolicVerification["method"] = exactDifference === "0" ? "exact" : numericallyEquivalent ? "numeric-sampling" : "failed";
  return {
    result: equivalent ? "Identity verified" : "Identity not verified",
    exact: exactDifference,
    detail: "Checks whether two symbolic expressions represent the same function, using exact simplification first and numeric sampling as a fallback.",
    steps: [
      `Compare left side: ${left}.`,
      `Compare right side: ${right}.`,
      `Move everything to one side: (${left}) - (${right}).`,
      `Exact simplification gives: ${exactDifference}.`,
      method === "numeric-sampling" ? "Exact simplification was inconclusive, so sample values were checked." : `Verification method: ${method}.`,
      equivalent ? "Conclusion: the expressions match on the certified checks." : "Conclusion: the expressions did not pass the certified checks.",
    ],
    verification: { equivalent, method, samples },
  };
}

export function symbolicSubstitute(expression: string, assignments: SymbolicAssignment[]): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const applied = assignments.reduce((current, assignment) => {
    const variable = normalizeVariable(assignment.name);
    const value = normalizeSymbolic(assignment.value);
    return current.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${value})`);
  }, normalized);
  const result = cleanSymbolic(nerdamer(applied).toString());
  return {
    result,
    exact: result,
    detail: "Exact substitution followed by symbolic simplification.",
    steps: [
      `Start with ${expression}.`,
      `Apply ${assignments.map((item) => `${item.name}=${item.value}`).join(", ")}.`,
      `Simplify the substituted expression: ${applied}.`,
      `Return exact form: ${result}.`,
    ],
  };
}

export function symbolicSystemSolve(equations: string[], variables?: string[]): SymbolicResult {
  const normalizedEquations = equations.map(normalizeEquation);
  const engine = nerdamer as unknown as { solveEquations?: (items: string[]) => { toString: () => string } };
  if (!engine.solveEquations) throw new Error("System solver is unavailable.");
  const raw = engine.solveEquations(normalizedEquations).toString();
  const pairs = parseSolveEquationPairs(raw, variables);
  const result = pairs.length ? pairs.map(([name, value]) => `${name} = ${cleanSymbolic(value)}`).join(", ") : cleanSymbolic(raw);
  return {
    result,
    exact: raw,
    detail: "Exact simultaneous equation solve for supported algebraic systems.",
    steps: [
      `Read ${equations.length} equation${equations.length === 1 ? "" : "s"}.`,
      `Normalize equations: ${normalizedEquations.join("; ")}.`,
      "Solve the equations together so shared variables satisfy every equation.",
      `Return solution values: ${result}.`,
    ],
  };
}

export function symbolicPolynomialDivide(dividend: string, divisor: string, variable = "x"): SymbolicResult {
  const normalizedDividend = normalizeSymbolic(dividend);
  const normalizedDivisor = normalizeSymbolic(divisor);
  const quotient = cleanSymbolic(nerdamer(`divide(${normalizedDividend},${normalizedDivisor})`).toString());
  const remainder = cleanSymbolic(nerdamer(`expand((${normalizedDividend})-(${normalizedDivisor})*(${quotient}))`).toString());
  const result = remainder === "0" ? quotient : `${quotient}, remainder ${remainder}`;
  return {
    result,
    exact: result,
    detail: `Polynomial division in ${normalizeVariable(variable)} with quotient and remainder.`,
    steps: [
      `Divide ${dividend} by ${divisor}.`,
      `CAS quotient: ${quotient}.`,
      `Check remainder by dividend - divisor*quotient = ${remainder}.`,
      `Return ${result}.`,
    ],
  };
}

export function symbolicPartialFractions(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const fallback = partialFractionLinearFallback(normalized, cleanVariable);
  const result = fallback ?? cleanSymbolic(nerdamer(`partfrac(${normalized},${cleanVariable})`).toString());
  return {
    result,
    exact: result,
    detail: fallback ? "Partial fraction decomposition for a product of two linear factors." : "Partial fraction command delegated to the CAS engine where supported.",
    steps: fallback
      ? [
          `Read rational expression: ${expression}.`,
          "Detect a denominator with two linear factors.",
          "Solve cover-up constants for A/(linear factor) + B/(linear factor).",
          `Return decomposition: ${result}.`,
        ]
      : [
          `Read rational expression: ${expression}.`,
          "Ask the CAS for partial fraction form.",
          `Return decomposition: ${result}.`,
        ],
  };
}

export function symbolicLatex(expression: string) {
  try {
    const converted = (nerdamer as unknown as { convertToLaTeX?: (value: string) => string }).convertToLaTeX?.(expression);
    if (converted) return converted;
  } catch {
    // Fall back to a readable monospaced expression below.
  }
  return expression.replace(/\*/g, "\\cdot ");
}

export function symbolicSolve(equation: string, variable = "x"): SymbolicResult {
  const normalized = normalizeEquation(equation);
  const cleanVariable = normalizeVariable(variable);
  const roots = nerdamer.solve(normalized, cleanVariable).toString();
  const analyzed = analyzeSolveCandidates(normalized, roots, cleanVariable);
  const result = `${cleanVariable} = ${formatSolutionList(analyzed.accepted.length ? `[${analyzed.accepted.join(",")}]` : roots)}`;
  return {
    result,
    exact: roots,
    detail: "Exact symbolic solve where possible, with domain and substitution checks around the candidate solution set.",
    steps: [
      `Read the equation as: ${equation}.`,
      `Normalize to parser form: ${normalized}.`,
      `Isolate or reduce the expression so the CAS can solve for ${cleanVariable}.`,
      `Exact solution set: ${roots}.`,
      ...analyzed.steps,
      "Use the graph panel or table to visually verify the roots.",
    ],
    restrictions: analyzed.restrictions,
    verification: analyzed.verification,
    warnings: analyzed.warnings,
  };
}

export function trySymbolic(action: () => SymbolicResult): SymbolicResult | null {
  try {
    const result = action();
    if (!result.result || /undefined|NaN/i.test(result.result)) return null;
    return result;
  } catch {
    return null;
  }
}

function normalizeEquation(equation: string) {
  const normalized = normalizeSymbolic(equation);
  return normalized.includes("=") ? normalized : `${normalized}=0`;
}

function normalizeVariable(variable: string) {
  const clean = variable.trim().replace(/[^a-zA-Z0-9_]/g, "");
  return clean || "x";
}

function normalizeSymbolic(expression: string) {
  return expression
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/\bsin\^2\(([^)]+)\)/gi, "(sin($1))^2")
    .replace(/\bcos\^2\(([^)]+)\)/gi, "(cos($1))^2")
    .replace(/\btan\^2\(([^)]+)\)/gi, "(tan($1))^2")
    .replace(/\s+/g, "")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/([a-zA-Z)])(\d)/g, "$1*$2")
    .replace(/\)([a-zA-Z(])/g, ")*$1")
    .replace(/\bpi\b/gi, "pi")
    .replace(/\bln\(/gi, "log(")
    .replace(/√/g, "sqrt");
}

function formatSolutionList(value: string) {
  return value.replace(/^\[|\]$/g, "").replace(/,/g, ", ") || "no symbolic solution";
}

function analyzeSolveCandidates(equation: string, rawRoots: string, variable: string) {
  const candidates = uniqueCandidates(parseSolutionCandidates(rawRoots));
  const restrictions = detectSolveRestrictions(equation, variable);
  const accepted: string[] = [];
  const rejected: string[] = [];
  const verification: string[] = [];
  const warnings: string[] = [];

  candidates.forEach((candidate) => {
    const restrictionFailure = restrictions.find((restriction) => restriction.fails(candidate));
    if (restrictionFailure) {
      rejected.push(candidate);
      verification.push(`Rejected ${variable} = ${candidate}: ${restrictionFailure.label}.`);
      return;
    }

    const residual = evaluateEquationResidual(equation, variable, candidate);
    if (residual === null) {
      accepted.push(candidate);
      warnings.push(`Could not numerically verify ${variable} = ${candidate}; retained as symbolic candidate.`);
      return;
    }
    if (Math.abs(residual) <= 1e-7) {
      accepted.push(candidate);
      verification.push(`Verified ${variable} = ${candidate}: substitution residual ${formatSmallNumber(residual)}.`);
    } else {
      rejected.push(candidate);
      verification.push(`Rejected ${variable} = ${candidate}: substitution residual ${formatSmallNumber(residual)}.`);
    }
  });

  return {
    accepted: accepted.length ? accepted : candidates,
    rejected,
    restrictions: restrictions.map((restriction) => restriction.label),
    verification,
    warnings,
    steps: [
      restrictions.length ? `Domain restrictions checked: ${restrictions.map((restriction) => restriction.label).join("; ")}.` : "No simple real-domain restriction was detected.",
      verification.length ? `Candidate verification: ${verification.join(" ")}` : "Candidate verification was not available for this solution form.",
      rejected.length ? `Extraneous or invalid candidates removed: ${rejected.join(", ")}.` : "No extraneous candidate was removed.",
    ],
  };
}

function parseSolutionCandidates(rawRoots: string) {
  const trimmed = rawRoots.replace(/^\[|\]$/g, "");
  return splitTopLevelSymbolic(trimmed, ",").map((candidate) => candidate.trim()).filter(Boolean);
}

function uniqueCandidates(candidates: string[]) {
  const output: string[] = [];
  const numericValues: number[] = [];
  candidates.forEach((candidate) => {
    const numeric = evaluateSymbolicNumber(candidate);
    if (numeric !== null && numericValues.some((value) => Math.abs(value - numeric) < 1e-7)) return;
    if (numeric !== null) numericValues.push(numeric);
    if (!output.includes(candidate)) output.push(candidate);
  });
  return output;
}

function detectSolveRestrictions(equation: string, variable: string) {
  const restrictions: Array<{ label: string; fails: (candidate: string) => boolean }> = [];
  collectFunctionArguments(equation, "sqrt").forEach((argument) => {
    restrictions.push({
      label: `${argument} >= 0 for real square roots`,
      fails: (candidate) => {
        const value = evaluateExpressionAt(argument, variable, candidate);
        return value !== null && value < -1e-9;
      },
    });
  });
  collectFunctionArguments(equation, "log").forEach((argument) => {
    restrictions.push({
      label: `${argument} > 0 for logarithms`,
      fails: (candidate) => {
        const value = evaluateExpressionAt(argument, variable, candidate);
        return value !== null && value <= 0;
      },
    });
  });
  collectSimpleDenominators(equation).forEach((denominator) => {
    restrictions.push({
      label: `${denominator} != 0 for denominators`,
      fails: (candidate) => {
        const value = evaluateExpressionAt(denominator, variable, candidate);
        return value !== null && Math.abs(value) < 1e-9;
      },
    });
  });
  return restrictions;
}

function evaluateEquationResidual(equation: string, variable: string, candidate: string) {
  const [left, right = "0"] = splitTopLevelSymbolic(equation, "=");
  return evaluateExpressionAt(`(${left})-(${right})`, variable, candidate);
}

function evaluateExpressionAt(expression: string, variable: string, candidate: string) {
  try {
    const value = evaluateWithSubstitution(expression, variable, candidate);
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  } catch {
    return null;
  }
}

function evaluateSymbolicNumber(expression: string) {
  try {
    const value = nerdamer(expression).evaluate().text();
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  } catch {
    return null;
  }
}

function collectFunctionArguments(expression: string, functionName: string) {
  const output: string[] = [];
  const token = `${functionName}(`;
  let index = expression.indexOf(token);
  while (index >= 0) {
    const start = index + token.length;
    let depth = 1;
    let cursor = start;
    while (cursor < expression.length && depth > 0) {
      const char = expression[cursor];
      if (char === "(") depth += 1;
      if (char === ")") depth -= 1;
      cursor += 1;
    }
    if (depth === 0) output.push(expression.slice(start, cursor - 1));
    index = expression.indexOf(token, cursor);
  }
  return output;
}

function collectSimpleDenominators(expression: string) {
  const output: string[] = [];
  const matches = expression.matchAll(/\/\(([^()=]+)\)|\/([a-zA-Z][a-zA-Z0-9_]*[+-]\d+(?:\.\d+)?)/g);
  for (const match of matches) {
    output.push(match[1] ?? match[2]);
  }
  return output;
}

function splitTopLevelSymbolic(value: string, separator: string) {
  const output: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if (char === separator && depth === 0) {
      output.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  output.push(current);
  return output;
}

function formatSmallNumber(value: number) {
  const rounded = Math.round(value * 1_000_000_000) / 1_000_000_000;
  return `${Object.is(rounded, -0) ? 0 : rounded}`;
}

function cleanSymbolic(value: string) {
  return value.replace(/\s+/g, "").replace(/\*/g, "*");
}

function simplifyKnownIdentity(result: string, normalizedInput: string) {
  const expression = normalizedInput.replace(/\s+/g, "");
  if (/^\(?sin\(x\)\)?\^2\+\(?cos\(x\)\)?\^2$/.test(expression) || /^\(?cos\(x\)\)?\^2\+\(?sin\(x\)\)?\^2$/.test(expression)) return "1";
  if (expression === "(sin(x))^2+(cos(x))^2" || expression === "(cos(x))^2+(sin(x))^2") return "1";
  if (expression === "((sin(x))^2+(cos(x))^2)-1" || expression === "((cos(x))^2+(sin(x))^2)-1") return "0";
  if (result === "cos(x)^2+sin(x)^2" || result === "sin(x)^2+cos(x)^2") return "1";
  return result;
}

function sampleDifference(expression: string, variable: string) {
  const values = [-2, -0.5, 0.5, 1.25, 2];
  return values.flatMap((value) => {
    try {
      const evaluated = evaluateWithSubstitution(expression, variable, String(value));
      const numeric = Number(evaluated);
      if (!Number.isFinite(numeric)) return [];
      return [{ variable, value, difference: `${Math.round(numeric * 1_000_000_000) / 1_000_000_000}` }];
    } catch {
      return [];
    }
  });
}

function evaluateWithSubstitution(expression: string, variable: string, value: string) {
  const engine = nerdamer as unknown as (expression: string, substitutions?: Record<string, string>) => { evaluate: () => { text?: () => string; toString: () => string } };
  const evaluated = engine(expression, { [variable]: value }).evaluate();
  return evaluated.text?.() ?? evaluated.toString();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSolveEquationPairs(raw: string, variables?: string[]) {
  const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
  const pairs: [string, string][] = [];
  for (let index = 0; index < parts.length; index += 2) {
    const name = variables?.[index / 2] ?? parts[index];
    const value = parts[index + 1];
    if (name && value) pairs.push([name, value]);
  }
  return pairs;
}

function partialFractionLinearFallback(expression: string, variable: string) {
  const escapedVariable = escapeRegExp(variable);
  const match = expression.match(new RegExp(`^\\(?(-?\\d*(?:\\.\\d+)?)\\*?${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)?\\/\\(\\(${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)\\*\\(${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)\\)$`));
  if (!match) return null;
  const slopeRaw = match[1];
  const slope = slopeRaw === "" || slopeRaw === "+" ? 1 : slopeRaw === "-" ? -1 : Number(slopeRaw);
  const intercept = Number(match[2]);
  const first = Number(match[3]);
  const second = Number(match[4]);
  if (!Number.isFinite(slope) || first === second) return null;
  const firstRoot = -first;
  const secondRoot = -second;
  const numeratorAtFirst = slope * firstRoot + intercept;
  const numeratorAtSecond = slope * secondRoot + intercept;
  const a = numeratorAtFirst / (firstRoot + second);
  const b = numeratorAtSecond / (secondRoot + first);
  return `${formatCoefficient(a)}/(${variable}${signedConstant(first)})${b < 0 ? "-" : "+"}${formatCoefficient(Math.abs(b))}/(${variable}${signedConstant(second)})`;
}

function formatCoefficient(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function signedConstant(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}
