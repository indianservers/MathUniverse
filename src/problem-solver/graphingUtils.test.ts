import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import { buildVisualVerification, compileFunction, equationIntersectionData, generateFunctionPoints, systemIntersectionData } from "./graphingUtils";
import type { ProblemSolverResult } from "./problemTypes";

describe("graphing utilities", () => {
  it("generates points for x^2", () => {
    const points = generateFunctionPoints("x^2", { xMin: -2, xMax: 2, yMin: -1, yMax: 5 }, 5);
    expect(points).toEqual([
      { x: -2, y: 4 },
      { x: -1, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 },
    ]);
  });

  it("generates points for 2*x + 1", () => {
    const fn = compileFunction("2*x + 1");
    expect(fn?.(3)).toBe(7);
  });

  it("rejects unsafe expressions", () => {
    expect(compileFunction("alert(x)")).toBeNull();
    expect(compileFunction("process.exit()")).toBeNull();
  });

  it("handles undefined rational points", () => {
    const fn = compileFunction("1/(x-1)");
    expect(fn?.(1)).toBeNull();
  });

  it("extracts roots for quadratic equation visual data", () => {
    const data = equationIntersectionData("x^2-5*x+6=0", "x = 2, 3");
    expect(data?.markers.map((marker) => marker.x)).toEqual([2, 3]);
  });

  it("extracts intersection for linear equation visual data", () => {
    const data = equationIntersectionData("2*x+5=15", "x = 5");
    expect(data?.markers[0]).toMatchObject({ x: 5, y: 15 });
  });

  it("extracts system line intersection", () => {
    const data = systemIntersectionData("solve 2x + y = 7 and x - y = 2", "x = 3, y = 1");
    expect(data?.intersection).toEqual({ x: 3, y: 1 });
  });

  it("builds derivative visual comparison", () => {
    const classification = classifyProblem("derivative of x^2");
    const result: ProblemSolverResult = {
      assumptions: [],
      canCopy: true,
      kind: "derivative",
      method: "Derivative rules",
      normalizedInput: classification.normalizedInput,
      result: "2x",
      steps: [],
      title: "Derivative",
      warnings: [],
    };
    const visual = buildVisualVerification(classification, result);
    expect(visual?.curves.length).toBe(2);
  });
});
