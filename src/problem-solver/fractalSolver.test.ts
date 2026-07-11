import { describe, expect, it } from "vitest";
import { solveProblem } from "./problemSolverEngine";

describe("Sierpinski carpet solver", () => {
  it("solves retained square count by iteration", () => {
    const { classification, result } = solveProblem("How many retained squares after iteration 4 in the Sierpinski carpet?");
    expect(classification.kind).toBe("fractal");
    expect(result.result).toBe("4096");
    expect(result.steps.join(" ")).toContain("R_n = 8^n");
  });

  it("finds iteration from retained square count", () => {
    const { result } = solveProblem("Sierpinski retained squares count is 4096");
    expect(result.result).toBe("n = 4");
  });

  it("finds iteration from side scale", () => {
    const { result } = solveProblem("Sierpinski side scale is 1/81");
    expect(result.result).toBe("n = 4");
  });
});
