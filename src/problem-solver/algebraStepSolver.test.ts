import { describe, expect, it } from "vitest";
import { solveAlgebraSteps } from "./algebraStepSolver";

describe("algebra step solver", () => {
  it.each([
    ["2x + 5 = 15", "x = 5"],
    ["3x - 7 = 11", "x = 6"],
    ["-2x + 4 = 8", "x = -2"],
    ["x/3 + 2 = 5", "x = 9"],
  ])("solves linear equation %s", (equation, expected) => {
    const result = solveAlgebraSteps(equation);
    expect(result?.kind).toBe("linear");
    expect(result?.method).toBe("Linear isolation");
    expect(result?.finalAnswer).toBe(expected);
    expect(result?.verification.join(" ")).toContain("Check");
  });

  it.each([
    ["x^2 - 5x + 6 = 0", "x = 2, 3"],
    ["x^2 + 5x + 6 = 0", "x = -3, -2"],
    ["x^2 - 4 = 0", "x = -2, 2"],
    ["2x^2 - 8 = 0", "x = -2, 2"],
  ])("solves quadratic equation %s", (equation, expected) => {
    const result = solveAlgebraSteps(equation);
    expect(result?.kind).toBe("quadratic");
    expect(result?.finalAnswer).toBe(expected);
    expect(["Factoring", "Quadratic formula"]).toContain(result?.method);
    expect(result?.steps.join(" ")).toContain("standard form");
  });

  it.each([
    ["(x^2 - 1)/(x - 1) = 0", "x = -1", "x != 1"],
    ["(x + 2)/(x - 3) = 5", "x = 4.25", "x != 3"],
    ["1/(x+1) = 2", "x = -0.5", "x != -1"],
  ])("solves rational equation %s", (equation, expected, restriction) => {
    const result = solveAlgebraSteps(equation);
    expect(result?.kind).toBe("rational");
    expect(result?.method).toBe("Rational equation clearing denominators");
    expect(result?.finalAnswer).toBe(expected);
    expect(result?.restrictions).toContain(restriction);
    expect(result?.warnings.join(" ")).toContain(restriction);
  });
});
