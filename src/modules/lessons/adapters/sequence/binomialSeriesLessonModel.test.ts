import { describe, expect, it } from "vitest";
import {
  binomialSeriesAnalysis,
  generalizedBinomialCoefficients,
} from "./binomialSeriesLessonModel";

describe("binomial series model", () => {
  it("computes the target parameter scenario", () => {
    const result = binomialSeriesAnalysis(0.75, 0.4, 6);
    expect(result.coefficients.slice(0, 6)).toEqual([
      1, 0.75, -0.09375, 0.0390625, -0.021972656, 0.014282226,
    ]);
    expect(result.terms).toEqual([
      1, 0.3, -0.015, 0.0025, -0.0005625, 0.00014625,
    ]);
    expect(result.target).toBeCloseTo(1.4 ** 0.75, 8);
    expect(result.partial).toBeCloseTo(1.28708375, 8);
    expect(result.error).toBeLessThan(0.00004);
  });

  it("computes square-root coefficients with correct signs", () => {
    expect(generalizedBinomialCoefficients(0.5, 4)).toEqual([
      1, 0.5, -0.125, 0.0625,
    ]);
  });

  it("recognizes terminating nonnegative integer expansions", () => {
    const result = binomialSeriesAnalysis(2, 0.9, 8);
    expect(result.domain).toBe("all real x");
    expect(result.coefficients.slice(0, 5)).toEqual([1, 2, 1, 0, 0]);
    expect(result.partial).toBe(result.target);
  });

  it("bounds hostile parameters", () => {
    const result = binomialSeriesAnalysis(Infinity, -20, 1000);
    expect(result.alpha).toBe(0);
    expect(result.x).toBe(-0.99);
    expect(result.count).toBe(15);
    expect(result.samples).toHaveLength(81);
  });
});
