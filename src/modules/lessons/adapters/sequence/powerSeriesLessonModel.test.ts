import { describe, expect, it } from "vitest";
import {
  evaluatePowerSeries,
  parsePowerSeriesCoefficient,
  powerSeriesAnalysis,
  powerSeriesCoefficients,
} from "./powerSeriesLessonModel";

describe("power series model", () => {
  it("builds and recognizes the target cosine series", () => {
    const coefficients = powerSeriesCoefficients("cos x", 0, 9),
      result = powerSeriesAnalysis({
        target: "cos x",
        center: 0,
        degree: 8,
        range: 1.5 * Math.PI,
        coefficients,
        preset: false,
      });
    expect(coefficients).toEqual([
      1, 0, -0.5, 0, 0.04166667, 0, -0.00138889, 0, 0.0000248,
    ]);
    expect(result.recognized).toBe("cos x");
    expect(result.radius).toBe(Infinity);
    expect(result.interval).toBe("(-∞, ∞)");
    expect(result.expanded).toContain("1/2x^2");
  });

  it("evaluates a truncated polynomial", () => {
    expect(evaluatePowerSeries([1, 2, 3], 0, 2, 2)).toBe(17);
    expect(evaluatePowerSeries([1, 2, 3], 1, 1, 3)).toBe(5);
  });

  it("finds the geometric-series radius from its singularity", () => {
    const result = powerSeriesAnalysis({
      target: "1 / (1 - x)",
      center: 0,
      degree: 8,
      range: 1.5,
      coefficients: [],
      preset: true,
    });
    expect(result.radius).toBe(1);
    expect(result.interval).toBe("(-1, 1)");
  });

  it("parses fractions without accepting invalid coefficients", () => {
    expect(parsePowerSeriesCoefficient("-1/720")).toBe(-0.00138889);
    expect(parsePowerSeriesCoefficient("1/0")).toBeNull();
    expect(parsePowerSeriesCoefficient("not a number")).toBeNull();
  });
});
