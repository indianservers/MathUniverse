import { describe, expect, it } from "vitest";
import {
  DEFAULT_SIGMA_COEFFICIENTS,
  parseSigmaSummand,
  sigmaNotationAnalysis,
} from "./sigmaNotationLessonModel";
describe("sigma notation model", () => {
  it("computes the target finite sum", () => {
    const coefficients = parseSigmaSummand("i² + 1")!,
      result = sigmaNotationAnalysis(1, 8, coefficients);
    expect(result.terms).toEqual([2, 5, 10, 17, 26, 37, 50, 65]);
    expect(result.partials).toEqual([2, 7, 17, 34, 60, 97, 147, 212]);
    expect(result.total).toBe(212);
    expect(result.growth).toBe("Quadratic");
  });
  it("handles nested sums with nonpositive indexes", () => {
    const result = sigmaNotationAnalysis(
      -2,
      2,
      DEFAULT_SIGMA_COEFFICIENTS,
      true,
    );
    expect(result.terms.slice(0, 3)).toEqual([0, 0, 0]);
    expect(Number.isFinite(result.total)).toBe(true);
  });
  it("caps hostile ranges", () => {
    const result = sigmaNotationAnalysis(1, 1000, DEFAULT_SIGMA_COEFFICIENTS);
    expect(result.indexes).toHaveLength(50);
    expect(result.truncated).toBe(true);
  });
});
