import { describe, expect, it } from "vitest";
import { computeSetBuilder, computeSetOperation, eigenInfo2x2, eulerSolution, powerSet, quartileSummary, simpleInterestModel } from "./p0LessonModels";

describe("Phase 1 priority lesson models", () => {
  it("computes the five discrete concept models", () => {
    expect(computeSetBuilder([-2,-1,0,1,2,3,4], "even")).toEqual([-2,0,2,4]);
    expect(computeSetOperation([1,2,3], [3,4], "symmetric-difference")).toEqual([1,2,4]);
    expect(powerSet([1,2,3])).toHaveLength(8);
  });

  it("uses a five-number summary and the 1.5 IQR outlier rule", () => {
    const result = quartileSummary([2,3,4,4,5,6,7,8,20]);
    expect(result.iqr).toBe(4);
    expect(result.outliers).toEqual([20]);
  });

  it("derives eigen, ODE, and simple-interest outputs from current controls", () => {
    expect(eigenInfo2x2(2,1,1,2).eigenvalues).toEqual([3,1]);
    expect(eulerSolution("exponential",0,1,.2,1).at(-1)?.y).toBeCloseTo(1.2);
    expect(simpleInterestModel(10000,6,4)).toMatchObject({ interest: 2400, amount: 12400 });
  });
});
