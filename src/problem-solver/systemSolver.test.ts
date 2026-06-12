import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import { solveSystem } from "./systemSolver";

function solve(input: string) {
  const classification = classifyProblem(input);
  const result = solveSystem(classification);
  if (!result) throw new Error(`No system result for ${input}`);
  return { classification, result };
}

describe("system solver", () => {
  it.each([
    ["solve 2x + y = 7 and x - y = 2", "x = 3, y = 1"],
    ["2x + 3y = 12; x - y = 1", "x = 3, y = 2"],
  ])("solves 2x2 system %s", (input, expected) => {
    const { result } = solve(input);
    expect(result.result).toBe(expected);
    expect(result.method).toBe("Elimination method");
    expect(result.steps.join(" ")).toContain("elimination");
    expect(result.verification?.join(" ")).toContain("Check");
  });

  it("detects no solution systems", () => {
    const { result } = solve("x + y = 2; x + y = 3");
    expect(result.result).toBe("No solution");
    expect(result.warnings.join(" ")).toContain("inconsistent");
  });

  it("detects infinite solution systems", () => {
    const { result } = solve("x + y = 2; 2x + 2y = 4");
    expect(result.result).toBe("Infinitely many solutions");
    expect(result.warnings.join(" ")).toContain("dependent");
  });

  it("solves 3x3 systems with verification", () => {
    const { result } = solve("x + y + z = 6; 2x - y + z = 3; x + 2y - z = 2");
    expect(result.result).toBe("x = 1, y = 2, z = 3");
    expect(result.method).toBe("Matrix row-reduction");
    expect(result.verification).toHaveLength(3);
  });

  it.each([
    "solve 2x + y = 7 and x - y = 2",
    "2x + y = 7; x - y = 2",
    "2x + y = 7\nx - y = 2",
  ])("parses joined systems: %s", (input) => {
    const { classification, result } = solve(input);
    expect(classification.kind).toBe("system");
    expect(result.result).toBe("x = 3, y = 1");
  });

  it("does not produce fake linear steps for nonlinear systems", () => {
    const { result } = solve("x^2 + y = 5; x + y = 3");
    expect(result.result).toBe("Unsupported nonlinear system");
    expect(result.method).toBe("Unsupported nonlinear system");
    expect(result.steps.join(" ")).toContain("No linear-system steps were generated");
  });
});
