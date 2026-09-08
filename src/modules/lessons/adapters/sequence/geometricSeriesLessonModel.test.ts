import { describe, expect, it } from "vitest";
import {
  geometricSeriesAnalysis,
  infiniteGeometricSeriesSum,
} from "./geometricSeriesLessonModel";

describe("geometric series model", () => {
  it("computes the target finite and infinite series", () => {
    const result = geometricSeriesAnalysis(3, 0.5, 10);
    expect(result.terms).toEqual([
      3, 1.5, 0.75, 0.375, 0.1875, 0.09375, 0.046875, 0.023438, 0.011719,
      0.005859,
    ]);
    expect(result.partials).toEqual([
      3, 4.5, 5.25, 5.625, 5.8125, 5.90625, 5.953125, 5.976563, 5.988282,
      5.994141,
    ]);
    expect(result.finite).toBe(5.994141);
    expect(result.formulaFinite).toBe(5.994141);
    expect(result.infinite).toBe(6);
    expect(result.converges).toBe(true);
  });

  it("classifies alternating convergence and divergence", () => {
    expect(infiniteGeometricSeriesSum(2, -0.4)).toBe(1.428571);
    expect(infiniteGeometricSeriesSum(2, -1)).toBeNull();
    expect(infiniteGeometricSeriesSum(2, 1.2)).toBeNull();
  });

  it("handles the r = 1 finite-sum special case", () => {
    const result = geometricSeriesAnalysis(4, 1, 6);
    expect(result.terms).toEqual([4, 4, 4, 4, 4, 4]);
    expect(result.finite).toBe(24);
    expect(result.formulaFinite).toBe(24);
  });

  it("bounds hostile counts and non-finite parameters", () => {
    const result = geometricSeriesAnalysis(Infinity, Number.NaN, 1_000);
    expect(result.count).toBe(20);
    expect(result.terms).toHaveLength(20);
    expect(result.terms.every(Number.isFinite)).toBe(true);
  });
});
