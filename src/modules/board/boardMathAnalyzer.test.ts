import { describe, expect, it } from "vitest";
import {
  analyzeBoardExpression,
  detectAmbiguities,
  detectVariables,
  normalizeBoardExpression,
} from "./boardMathAnalyzer";

describe("Board mathematical analysis", () => {
  it("normalizes safe LaTeX for existing engines", () => {
    const normalized = normalizeBoardExpression(String.raw`\frac{2x}{3}+\sin(x)`);
    expect(normalized.engineExpression).toContain("((2x)/(3))");
    expect(normalized.engineExpression).toContain("sin(x)");
  });

  it("classifies algebra and prioritizes relevant actions", () => {
    const analysis = analyzeBoardExpression("x^2-5x+6");
    expect(analysis.classification).toBe("algebraic-expression");
    expect(analysis.variables).toEqual(["x"]);
    expect(analysis.metadata?.degree).toBe(2);
    expect(analysis.suggestedActions.slice(0, 3).map((action) => action.label)).toEqual(["Factor", "Draw graph", "Find roots"]);
    expect(analysis.suggestedActions.some((action) => action.label === "Draw graph")).toBe(true);
  });

  it.each([
    ["2x+5=15", "equation", "Solve"],
    ["f(x)=x^3-3x", "function", "Draw graph"],
    ["4, 7, 7, 8, 10, 12", "data-series", "Analyze statistics"],
    ["[[1,2],[3,4]]", "matrix", "Matrix summary"],
    ["2x-3>7", "inequality", "Solve inequality"],
  ])("classifies %s as %s", (expression, classification, action) => {
    const analysis = analyzeBoardExpression(expression);
    expect(analysis.classification).toBe(classification);
    expect(analysis.suggestedActions[0].label).toBe(action);
  });

  it("detects variables without treating function names as variables", () => {
    expect(detectVariables("a*x+sin(x)+b")).toEqual(["a", "b", "x"]);
  });

  it("blocks actions until material ambiguities are resolved", () => {
    const ambiguities = detectAmbiguities("1/l+x", "algebraic-expression");
    expect(ambiguities[0].requiresResolution).toBe(true);
    const analysis = analyzeBoardExpression("1/l+x");
    expect(analysis.suggestedActions.every((action) => !action.enabled)).toBe(true);
  });

  it("suppresses irrelevant operations", () => {
    const actions = analyzeBoardExpression("4,7,7,8").suggestedActions.map((action) => action.type);
    expect(actions).toEqual(["statistics"]);
    expect(actions).not.toContain("differentiate");
  });

  it("rejects malformed and oversized input", () => {
    expect(() => normalizeBoardExpression(String.raw`\frac{1`)).toThrow();
    expect(() => normalizeBoardExpression("x".repeat(2_001))).toThrow(/exceeds/i);
  });
});
