import type { VerifiedMathStep } from "./types";

export type TransformationRule = { id: string; version: string; name: string; category: string; description: string; inputPattern: string; outputPattern: string; preconditions: string[]; domainRestrictions: string[]; verification: "AST_IDENTITY" | "EXACT_SUBSTITUTION" | "SYMBOLIC_DIFFERENTIATION" | "NUMERIC_RESIDUAL" | "EXISTING_EXACT_ENGINE"; explanationTemplate: string };

export const transformationRules: TransformationRule[] = [
  rule("RADICAL.SQRT_SQUARE_REAL", "Square root of a real square", "sqrt(u^2)", "abs(u)", ["u is real"], ["principal real square root"], "AST_IDENTITY", "The principal square root is non-negative, so a real square becomes an absolute value."),
  rule("RADICAL.SQRT_SQUARE_NONNEGATIVE", "Square root of a non-negative square", "sqrt(u^2)", "u", ["u is real", "u >= 0"], ["principal real square root"], "AST_IDENTITY", "The non-negative assumption removes the absolute-value branch."),
  rule("EQUATION.DIVIDE_NONZERO", "Divide both sides by a non-zero coefficient", "a*u=b", "u=b/a", ["a != 0"], ["division by zero excluded"], "EXACT_SUBSTITUTION", "Divide both sides by the same non-zero coefficient."),
  rule("EQUATION.ZERO_COEFFICIENT", "Resolve zero coefficient branch", "0*u=b", "no solution when b != 0", ["a = 0", "b != 0"], [], "EXACT_SUBSTITUTION", "The left side is zero for every u and cannot equal a non-zero right side."),
  rule("EQUATION.SQUARE_BOTH_SIDES", "Square both sides with candidate verification", "sqrt(u)=v", "u=v^2", ["v >= 0 for an original real solution"], ["may introduce extraneous roots"], "EXACT_SUBSTITUTION", "Squaring generates candidates; each candidate must be checked in the original equation."),
  rule("EQUATION.VERIFY_CANDIDATE", "Substitute candidate into original equation", "F(u)=G(u)", "verified candidate", [], [], "EXACT_SUBSTITUTION", "Substitution into the original equation determines whether a candidate is genuine."),
  rule("CALCULUS.POWER_DERIVATIVE", "Power rule", "d(u^n)/du", "n*u^(n-1)", ["n is constant"], [], "SYMBOLIC_DIFFERENTIATION", "Differentiate a power by multiplying by its exponent and reducing the exponent by one."),
  rule("CALCULUS.LINEARITY_DERIVATIVE", "Linearity of differentiation", "d(f+g)/du", "df/du+dg/du", [], [], "SYMBOLIC_DIFFERENTIATION", "Differentiate each term and preserve constant multiples."),
  rule("CALCULUS.POWER_ANTIDERIVATIVE", "Power antiderivative", "integral u^n du", "u^(n+1)/(n+1)+C", ["n != -1"], [], "EXACT_SUBSTITUTION", "Increase the exponent, divide by the new exponent, and include the integration constant."),
  rule("ALGEBRA.CANONICAL_EXACT", "Verified existing exact transformation", "supported expression", "canonical exact result", [], [], "EXISTING_EXACT_ENGINE", "The existing exact engine computed the result; the certified layer retains its conditions and verification status."),
  rule("NUMERIC.BISECTION", "Bisection bracket refinement", "continuous sign-changing interval", "certified root bracket", ["continuous on bracket", "opposite endpoint signs"], [], "NUMERIC_RESIDUAL", "Repeatedly halve a sign-changing interval until its width and residual meet tolerance."),
  rule("NUMERIC.SIMPSON", "Composite Simpson quadrature", "definite integral", "weighted numerical sum", ["even subinterval count", "finite sampled values"], [], "NUMERIC_RESIDUAL", "Composite Simpson quadrature combines endpoint, odd, and even samples with recorded tolerance."),
];

export function getTransformationRule(id: string) { return transformationRules.find((item) => item.id === id); }

export function verifiedStep(ruleId: string, before: string, after: string, assumptionsUsed: string[] = [], verificationStatus: VerifiedMathStep["verificationStatus"] = "VERIFIED"): VerifiedMathStep {
  const selected = getTransformationRule(ruleId);
  if (!selected) throw new Error(`Unknown transformation rule ${ruleId}`);
  return { id: `step-${ruleId.toLowerCase().replaceAll(".", "-")}-${Math.abs(hash(before + after))}`, before, after, ruleId, ruleVersion: selected.version, ruleName: selected.name, preconditions: selected.preconditions, assumptionsUsed, explanation: selected.explanationTemplate, verificationStatus };
}

function rule(id: string, name: string, inputPattern: string, outputPattern: string, preconditions: string[], domainRestrictions: string[], verification: TransformationRule["verification"], explanationTemplate: string): TransformationRule { return { id, version: "1.0.0", name, category: id.split(".")[0], description: explanationTemplate, inputPattern, outputPattern, preconditions, domainRestrictions, verification, explanationTemplate }; }
function hash(value: string) { let result = 0; for (const char of value) result = (Math.imul(result, 31) + char.charCodeAt(0)) | 0; return result; }
