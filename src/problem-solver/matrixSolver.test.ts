import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import { solveMatrix } from "./matrixSolver";

function solve(input: string) {
  const classification = classifyProblem(input);
  const result = solveMatrix(classification);
  if (!result) throw new Error(`No matrix result for ${input}`);
  return { classification, result };
}

describe("matrix solver", () => {
  it.each([
    ["[[1,2],[3,4]]", "[[1,2],[3,4]]"],
    ["[[-1,2.5],[3,4]]", "[[-1,2.5],[3,4]]"],
  ])("parses matrix literal %s", (input, expected) => {
    const { classification, result } = solve(input);
    expect(classification.kind).toBe("matrix");
    expect(result.result).toBe(expected);
  });

  it("rejects non-rectangular matrices safely", () => {
    const { result } = solve("[[1,2],[3]]");
    expect(result.result).toBe("Invalid matrix input");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("adds matrices", () => {
    expect(solve("[[1,2],[3,4]] + [[5,6],[7,8]]").result.result).toBe("[[6,8],[10,12]]");
  });

  it("subtracts matrices", () => {
    expect(solve("[[5,6],[7,8]] - [[1,2],[3,4]]").result.result).toBe("[[4,4],[4,4]]");
  });

  it("multiplies by scalar", () => {
    expect(solve("2 * [[1,2],[3,4]]").result.result).toBe("[[2,4],[6,8]]");
  });

  it("multiplies matrices", () => {
    const { result } = solve("[[1,2],[3,4]] * [[5,6],[7,8]]");
    expect(result.result).toBe("[[19,22],[43,50]]");
    expect(result.steps.join(" ")).toContain("Cell (1, 1)");
  });

  it("transposes matrices", () => {
    expect(solve("transpose [[1,2],[3,4]]").result.result).toBe("[[1,3],[2,4]]");
  });

  it("computes determinant", () => {
    const { result } = solve("determinant [[1,2],[3,4]]");
    expect(result.result).toBe("-2");
    expect(result.steps.join(" ")).toContain("ad - bc");
  });

  it("computes inverse", () => {
    expect(solve("inverse [[1,2],[3,4]]").result.result).toBe("[[-2,1],[1.5,-0.5]]");
  });

  it("computes RREF", () => {
    expect(solve("rref [[1,2,3],[4,5,6]]").result.result).toBe("[[1,0,-1],[0,1,2]]");
  });

  it("solves augmented matrices", () => {
    const { result } = solve("solve matrix [[2,1,7],[1,-1,2]]");
    expect(result.result).toBe("x = 3, y = 1");
    expect(result.verification?.join(" ")).toContain("Check row");
  });

  it("warns for determinant of non-square matrix", () => {
    const { result } = solve("determinant [[1,2,3],[4,5,6]]");
    expect(result.result).toBe("Determinant requires a square matrix");
    expect(result.warnings.join(" ")).toContain("square");
  });

  it("warns for inverse of singular matrix", () => {
    const { result } = solve("inverse [[1,2],[2,4]]");
    expect(result.result).toBe("Matrix is singular");
    expect(result.warnings.join(" ")).toContain("non-zero determinant");
  });

  it("warns for incompatible multiplication", () => {
    const { result } = solve("[[1,2]] * [[1,2]]");
    expect(result.result).toBe("Incompatible matrix dimensions");
    expect(result.warnings.join(" ")).toContain("Incompatible");
  });
});
