import { describe, expect, it } from "vitest";
import { solveProblem } from "./problemSolverEngine";

describe("proportional reasoning solver", () => {
  it("solves map-scale actual distance prompts", () => {
    const output = solveProblem("3.2 cm on map with scale 1:50000");
    expect(output.classification.kind).toBe("proportional-reasoning");
    expect(output.result.result).toBe("1.6 km");
    expect(output.result.steps.join(" ")).toContain("Actual distance");
  });

  it("splits a whole in a multi-term ratio", () => {
    const output = solveProblem("divide 900 in ratio 2:3:4");
    expect(output.result.result).toBe("200, 300, 400");
    expect(output.result.verification?.join(" ")).toContain("900");
  });

  it("computes pie angles from a ratio", () => {
    const output = solveProblem("ratio 2:3:4 pie angles");
    expect(output.result.result).toBe("80 deg, 120 deg, 160 deg");
  });

  it("detects inverse proportion situations", () => {
    const output = solveProblem("inverse proportion 4 workers 12 days, 6 workers");
    expect(output.result.result).toBe("8");
    expect(output.result.steps.join(" ")).toContain("inverse proportion");
  });
});
