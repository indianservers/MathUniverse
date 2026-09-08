import { describe, expect, it } from "vitest";
import {
  fCdf,
  fDistributionAnalysis,
  fQuantile,
} from "./fDistributionLessonModel";

describe("F distribution lesson model", () => {
  it("computes the target F(5,20) critical value", () => {
    const result = fDistributionAnalysis(5, 20, 0.05);
    expect(result.critical).toBeCloseTo(2.711, 3);
    expect(result.leftArea).toBeCloseTo(0.95, 6);
    expect(result.mean).toBeCloseTo(1.1111, 4);
  });

  it("round-trips probabilities through the quantile", () => {
    const quantile = fQuantile(0.9, 10, 20);
    expect(fCdf(quantile, 10, 20)).toBeCloseTo(0.9, 6);
  });
});
