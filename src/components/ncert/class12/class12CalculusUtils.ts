export type ContinuityCase = "continuous" | "removable-hole" | "jump" | "infinite" | "corner" | "cusp" | "vertical-tangent";

const reports: Record<ContinuityCase, { lhl: string; rhl: string; value: string; continuous: boolean; differentiable: boolean; reason: string }> = {
  continuous: { lhl: "f(a)", rhl: "f(a)", value: "f(a)", continuous: true, differentiable: true, reason: "LHL, RHL, and f(a) agree, and the tangent slope is finite." },
  "removable-hole": { lhl: "L", rhl: "L", value: "missing or different", continuous: false, differentiable: false, reason: "The two-sided limit exists, but f(a) does not match it." },
  jump: { lhl: "L1", rhl: "L2", value: "defined", continuous: false, differentiable: false, reason: "Left and right limits are different." },
  infinite: { lhl: "infinite", rhl: "infinite", value: "undefined", continuous: false, differentiable: false, reason: "A finite two-sided limit does not exist." },
  corner: { lhl: "f(a)", rhl: "f(a)", value: "f(a)", continuous: true, differentiable: false, reason: "The function is continuous, but left and right derivatives differ." },
  cusp: { lhl: "f(a)", rhl: "f(a)", value: "f(a)", continuous: true, differentiable: false, reason: "The tangent direction becomes sharp/vertical in opposite ways." },
  "vertical-tangent": { lhl: "f(a)", rhl: "f(a)", value: "f(a)", continuous: true, differentiable: false, reason: "The slope is not finite at the point." },
};

export function classifyContinuityCase(kind: ContinuityCase) {
  return reports[kind];
}

export function derivativeRuleStep(rule: "product" | "quotient" | "chain" | "log" | "parametric") {
  const steps = {
    product: ["Identify u and v.", "Use (uv)' = u'v + uv'.", "Substitute derivatives.", "Simplify the result."],
    quotient: ["Identify u and v.", "Use (u/v)' = (u'v - uv') / v^2.", "Substitute carefully.", "Keep the denominator squared."],
    chain: ["Identify outer and inner functions.", "Differentiate the outer function.", "Multiply by the derivative of the inner function.", "Simplify."],
    log: ["Take log on both sides where valid.", "Use log laws to separate products/powers.", "Differentiate implicitly.", "Multiply by y if needed."],
    parametric: ["Compute dx/dt.", "Compute dy/dt.", "Use dy/dx = (dy/dt)/(dx/dt).", "Check dx/dt is not zero."],
  };
  return steps[rule];
}

export function secondDerivativeVerdict(secondDerivativeAtPoint: number) {
  if (secondDerivativeAtPoint > 0) return "Concave up; local shape bends like a cup.";
  if (secondDerivativeAtPoint < 0) return "Concave down; local shape bends like a cap.";
  return "Second derivative test is inconclusive at this point.";
}
