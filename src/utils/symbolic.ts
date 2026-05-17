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

export function symbolicSolve(equation: string, variable = "x"): SymbolicResult {
  const normalized = normalizeEquation(equation);
  const roots = nerdamer.solve(normalized, variable).toString();
  const result = `${variable} = ${formatSolutionList(roots)}`;
  return {
    result,
    exact: roots,
    detail: "Exact symbolic solve where possible, with numeric graphing still available as a fallback.",
    steps: [
      `Read the equation as: ${equation}.`,
      `Normalize to parser form: ${normalized}.`,
      `Isolate or reduce the expression so the CAS can solve for ${variable}.`,
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

function normalizeSymbolic(expression: string) {
  return expression
    .trim()
    .replace(/\s+/g, "")
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
