import { describe, expect, it } from "vitest";
import {
  arithmeticSeriesAnalysis,
  arithmeticSeriesSum,
} from "./arithmeticSeriesLessonModel";

describe("arithmetic series model", () => {
  it("computes every value in the target scenario", () => {
    const result = arithmeticSeriesAnalysis(2, 3, 10);
    expect(result.terms).toEqual([2, 5, 8, 11, 14, 17, 20, 23, 26, 29]);
    expect(result.partials).toEqual([2, 7, 15, 26, 40, 57, 77, 100, 126, 155]);
    expect(result.pairs.map((pair) => pair.sum)).toEqual([31, 31, 31, 31, 31]);
    expect(result.last).toBe(29);
    expect(result.total).toBe(155);
    expect(result.formulaTotal).toBe(155);
  });

  it("handles decreasing series and odd term counts", () => {
    const result = arithmeticSeriesAnalysis(8, -2, 5);
    expect(result.terms).toEqual([8, 6, 4, 2, 0]);
    expect(result.pairs).toEqual([
      { first: 8, last: 0, sum: 8 },
      { first: 6, last: 2, sum: 8 },
      { first: 4, last: 4, sum: 8 },
    ]);
    expect(result.total).toBe(20);
  });

  it("uses the mathematically correct quick-check result", () => {
    expect(arithmeticSeriesSum(7, 4, 12)).toBe(348);
  });

  it("bounds hostile counts and replaces non-finite coefficients", () => {
    const result = arithmeticSeriesAnalysis(Number.NaN, Infinity, 10_000);
    expect(result.count).toBe(20);
    expect(result.terms).toHaveLength(20);
    expect(result.terms.every(Number.isFinite)).toBe(true);
  });
});
