import { describe, expect, it } from "vitest";
import { evaluateCertifiedCas } from "./casEngine";
import { analyzeAssumptions } from "./assumptionEngine";
import { transformationRules } from "./transformationRules";
import { createLinkedCalculusWorkflow } from "./calculusWorkflow";

describe("Phase 4 certified CAS", () => {
  it("changes sqrt(x^2) with explicit real and non-negative assumptions", () => {
    const real = evaluateCertifiedCas("sqrt(x^2)", ["x in R"]);
    const nonnegative = evaluateCertifiedCas("sqrt(x^2)", ["x in R", "x >= 0"]);
    expect(real.exactExpression).toBe("|x|"); expect(real.steps[0].ruleId).toBe("RADICAL.SQRT_SQUARE_REAL");
    expect(nonnegative.exactExpression).toBe("x"); expect(nonnegative.steps[0].assumptionsUsed).toContain("x >= 0");
  });
  it("retains both branches of a*x=1", () => { const result = evaluateCertifiedCas("Solve[a*x=1,x]"); expect(result.status).toBe("CONDITIONAL"); expect(result.branches).toEqual(expect.arrayContaining([expect.objectContaining({ condition: "a ≠ 0", result: "x = 1/a" }), expect.objectContaining({ condition: "a = 0", result: "no solution" })])); });
  it("rejects the extraneous radical candidate", () => { const result = evaluateCertifiedCas("Solve[sqrt(x+2)=x,x]"); expect(result.exactExpression).toBe("{2}"); expect(result.branches.find((item) => item.id === "candidate-minus-1")?.status).toBe("REJECTED"); });
  it("fails on contradictory assumptions", () => { expect(analyzeAssumptions(["x=0", "x!=0"]).contradictions).toHaveLength(1); expect(evaluateCertifiedCas("sqrt(x^2)", ["x=0", "x!=0"]).status).toBe("ERROR"); });
  it("has a versioned rule for every displayed certified step", () => { expect(transformationRules.length).toBeGreaterThanOrEqual(12); for (const result of [evaluateCertifiedCas("sqrt(x^2)", ["x in R"]), evaluateCertifiedCas("Solve[a*x=1,x]"), evaluateCertifiedCas("Derivative[x^3-3*x,x]")]) for (const step of result.steps) expect(transformationRules.some((rule) => rule.id === step.ruleId && rule.version === step.ruleVersion)).toBe(true); });
  it("keeps a calculus function, derivative, stationary points and integral linked", () => { const workflow = createLinkedCalculusWorkflow(); expect(workflow.graph.getRecord(workflow.functionNodeId)?.id).toBe(workflow.functionNodeId); expect(workflow.graph.getRecord(workflow.derivativeNodeId)?.id).toBe(workflow.derivativeNodeId); expect(workflow.graph.evaluateExpression("df(2)").exactForm).toBe("9"); expect(workflow.numericalIntegral.value).toBeCloseTo(0, 10); expect(workflow.links).toHaveLength(4); });
});
