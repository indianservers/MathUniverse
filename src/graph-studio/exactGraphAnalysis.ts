import { symbolicDefiniteIntegral, symbolicSolve, symbolicSubstitute } from "../utils/symbolic";

export type ExactGraphAnalysis = {
  roots?: string;
  yIntercept?: string;
  integral?: string;
  methodNote: string;
};

export function buildExactGraphAnalysis(input: string, integralStart: number, integralEnd: number): ExactGraphAnalysis {
  const expression = input.trim().replace(/^y\s*=\s*/i, "").replace(/\u03c0/g, "pi");
  const result: ExactGraphAnalysis = {
    methodNote: "Numerical features use 600 root samples and 900 plot samples; roots use interpolation with an approximately 0.015 residual threshold.",
  };
  if (!expression || /[=,;]|\b(?:theta|t)\b/i.test(expression)) return result;

  try {
    const solved = symbolicSolve(`${expression}=0`, "x");
    const roots = solved.exact?.trim();
    if (roots && roots !== "[]") result.roots = roots.replace(/^\[|\]$/g, "").replace(/,/g, ", ");
  } catch {
    // Some graphable functions are intentionally outside the symbolic solver's scope.
  }
  try {
    result.yIntercept = symbolicSubstitute(expression, [{ name: "x", value: "0" }]).exact;
  } catch {
    // Keep the numerical result when exact substitution is unavailable.
  }
  try {
    result.integral = symbolicDefiniteIntegral(expression, String(integralStart), String(integralEnd), "x").exact;
  } catch {
    // Keep the numerical quadrature result when an exact antiderivative is unavailable.
  }
  return result;
}
