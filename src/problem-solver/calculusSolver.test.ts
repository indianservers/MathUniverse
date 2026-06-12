import { describe, expect, it } from "vitest";
import { solveCalculus } from "./calculusSolver";
import { classifyProblem } from "./problemClassifier";

function solve(input: string) {
  const classification = classifyProblem(input);
  const result = solveCalculus(classification);
  if (!result) throw new Error(`No calculus result for ${input}`);
  return { classification, result };
}

describe("calculus solver", () => {
  it.each([
    ["derivative of x^3 + 2x", "3x^2 + 2"],
    ["differentiate x^2 + 5x + 6", "2x + 5"],
    ["d/dx x^4", "4x^3"],
    ["derivative of sin(x)", "cos(x)"],
  ])("solves derivative %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.method).toBe("Derivative rules");
    expect(result.steps.join(" ")).toContain("Final answer");
  });

  it.each([
    ["integrate 2x", "x^2 + C"],
    ["integral of x^2", "x^3/3 + C"],
    ["integrate x^2 + 3x", "x^3/3 + 3x^2/2 + C"],
    ["integrate cos(x)", "sin(x) + C"],
  ])("solves integral %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.method).toBe("Antiderivative rules");
    expect(result.assumptions.join(" ")).toContain("constant of integration");
  });

  it("solves simple definite integrals with bounds", () => {
    const { result } = solve("integrate x from 0 to 2");
    expect(result.result).toBe("2");
    expect(result.method).toBe("Definite integral by antiderivative");
    expect(result.steps.join(" ")).toContain("F(2) - F(0)");
  });

  it.each([
    ["limit x->2 x^2 + 1", "5"],
    ["lim x->0 sin(x)/x", "1"],
    ["lim x→0 sin(x)/x", "1"],
  ])("solves limit %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.assumptions.join(" ")).toContain("Approach value");
  });

  it.each([
    ["derivative of x^3 + 2x", "derivative"],
    ["integrate 2x", "integral"],
    ["limit x->0 sin(x)/x", "limit"],
  ])("keeps %s out of equation routing", (input, expectedKind) => {
    const { classification, result } = solve(input);
    expect(classification.kind).toBe(expectedKind);
    expect(result.kind).toBe(expectedKind);
    expect(result.method).not.toMatch(/Linear|Factoring|Rational equation/);
  });
});
