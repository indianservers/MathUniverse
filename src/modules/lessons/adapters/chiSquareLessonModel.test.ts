import { describe, expect, it } from "vitest";
import {
  chiSquareAnalysis,
  chiSquareCdf,
  chiSquareGoodnessOfFit,
  chiSquareQuantile,
} from "./chiSquareLessonModel";
describe("chi-square lesson model", () => {
  it("computes the target right-tail critical value", () => {
    const result = chiSquareAnalysis(6, 0.05);
    expect(result.critical).toBeCloseTo(12.592, 3);
    expect(result.mean).toBe(6);
    expect(result.variance).toBe(12);
    expect(result.skewness).toBeCloseTo(1.1547, 4);
    expect(chiSquareCdf(result.critical, 6)).toBeCloseTo(0.95, 5);
  });
  it("computes the target goodness-of-fit statistic", () => {
    const result = chiSquareGoodnessOfFit(
      [21, 15, 18, 26, 22, 18],
      [20, 20, 20, 20, 20, 20],
    );
    expect(result.statistic).toBeCloseTo(3.7);
    expect(result.df).toBe(5);
    expect(result.pValue).toBeCloseTo(0.5937, 3);
    expect(chiSquareQuantile(0.95, 5)).toBeCloseTo(11.07, 2);
  });
});
