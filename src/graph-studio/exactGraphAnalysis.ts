import {
  symbolicDefiniteIntegral,
  symbolicSolve,
  symbolicSubstitute,
} from "../utils/symbolic";

export type ExactGraphAnalysis = {
  roots?: string;
  yIntercept?: string;
  integral?: string;
  verticalAsymptotes?: string;
  horizontalAsymptotes?: string;
  methodNote: string;
};

export function buildExactGraphAnalysis(
  input: string,
  integralStart: number,
  integralEnd: number,
): ExactGraphAnalysis {
  const expression = input
    .trim()
    .replace(/^y\s*=\s*/i, "")
    .replace(/\u03c0/g, "pi");
  const result: ExactGraphAnalysis = {
    methodNote:
      "Numerical features use 600 root samples and 900 plot samples; roots use interpolation with an approximately 0.015 residual threshold.",
  };
  if (!expression || /[=,;]|\b(?:theta|t)\b/i.test(expression)) return result;

  try {
    const solved = symbolicSolve(`${expression}=0`, "x");
    const roots = solved.exact?.trim();
    if (roots && roots !== "[]")
      result.roots = roots.replace(/^\[|\]$/g, "").replace(/,/g, ", ");
  } catch {
    // Some graphable functions are intentionally outside the symbolic solver's scope.
  }
  try {
    result.yIntercept = symbolicSubstitute(expression, [
      { name: "x", value: "0" },
    ]).exact;
  } catch {
    // Keep the numerical result when exact substitution is unavailable.
  }
  try {
    result.integral = symbolicDefiniteIntegral(
      expression,
      String(integralStart),
      String(integralEnd),
      "x",
    ).exact;
  } catch {
    // Keep the numerical quadrature result when an exact antiderivative is unavailable.
  }
  const rational = splitTopLevelDivision(expression);
  if (rational) {
    try {
      const solved = symbolicSolve(
        `${rational.denominator}=0`,
        "x",
      ).exact?.trim();
      if (solved && solved !== "[]")
        result.verticalAsymptotes = solved
          .replace(/^\[|\]$/g, "")
          .replace(/,/g, ", ");
    } catch {
      /* Numerical detection remains available. */
    }
    const numeratorDegree = polynomialDegree(rational.numerator);
    const denominatorDegree = polynomialDegree(rational.denominator);
    if (
      numeratorDegree !== null &&
      denominatorDegree !== null &&
      numeratorDegree < denominatorDegree
    )
      result.horizontalAsymptotes = "y = 0";
  }
  return result;
}

export function buildExactIntersections(first: string, second: string) {
  const left = first.trim().replace(/^y\s*=\s*/i, "");
  const right = second.trim().replace(/^y\s*=\s*/i, "");
  if (
    !left ||
    !right ||
    /[=,;{}]/.test(left + right) ||
    /[^0-9x+\-*/^().\s]/i.test(left + right)
  )
    return undefined;
  try {
    const solved = symbolicSolve(`(${left})-(${right})=0`, "x").exact?.trim();
    return solved && solved !== "[]"
      ? solved.replace(/^\[|\]$/g, "").replace(/,/g, ", ")
      : undefined;
  } catch {
    return undefined;
  }
}

function splitTopLevelDivision(expression: string) {
  let depth = 0;
  for (let index = 0; index < expression.length; index += 1) {
    if (expression[index] === "(") depth += 1;
    if (expression[index] === ")") depth -= 1;
    if (expression[index] === "/" && depth === 0)
      return {
        numerator: expression.slice(0, index),
        denominator: expression.slice(index + 1),
      };
  }
  return null;
}
function polynomialDegree(expression: string) {
  if (/[^0-9x+\-*.()^\s]/i.test(expression)) return null;
  const powers = [...expression.matchAll(/x(?:\^(\d+))?/gi)].map((match) =>
    Number(match[1] ?? 1),
  );
  return powers.length ? Math.max(...powers) : 0;
}
