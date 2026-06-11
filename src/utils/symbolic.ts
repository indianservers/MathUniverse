import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Calculus";
import "nerdamer/Solve";

export type SymbolicResult = {
  result: string;
  exact?: string;
  steps: string[];
  detail: string;
};

export type SymbolicAssignment = {
  name: string;
  value: string;
};

export function symbolicSimplify(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(normalized).toString());
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
  const result = `${cleanVariable} = ${formatSolutionList(roots)}`;
  return {
    result,
    exact: roots,
    detail: "Exact symbolic solve where possible, with numeric graphing still available as a fallback.",
    steps: [
      `Read the equation as: ${equation}.`,
      `Normalize to parser form: ${normalized}.`,
      `Isolate or reduce the expression so the CAS can solve for ${cleanVariable}.`,
      `Exact solution set: ${roots}.`,
      "Use the graph panel or table to visually verify the roots.",
    ],
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

function cleanSymbolic(value: string) {
  return value.replace(/\s+/g, "").replace(/\*/g, "*");
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
