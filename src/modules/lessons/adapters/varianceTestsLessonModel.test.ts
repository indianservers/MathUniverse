import { describe, expect, it } from "vitest";
import {
  oneVarianceChiSquareTest,
  twoVarianceFTest,
} from "./varianceTestsLessonModel";
describe("variance tests lesson model", () => {
  it("matches the target two-variance F test", () => {
    const r = twoVarianceFTest(20, 16, 25, 25, 1, 0.05, "two-sided");
    expect(r.statistic).toBe(0.64);
    expect(r.df1).toBe(19);
    expect(r.df2).toBe(24);
    expect(r.lower).toBeCloseTo(0.407777, 5);
    expect(r.upper).toBeCloseTo(2.345154, 5);
    expect(r.pValue).toBeCloseTo(0.32405, 4);
    expect(r.reject).toBe(false);
  });
  it("computes a one-variance chi-square test", () => {
    const r = oneVarianceChiSquareTest(20, 16, 25, 0.05, "two-sided");
    expect(r.statistic).toBeCloseTo(12.16);
    expect(r.df).toBe(19);
    expect(r.pValue).toBeGreaterThan(0.1);
  });
});
