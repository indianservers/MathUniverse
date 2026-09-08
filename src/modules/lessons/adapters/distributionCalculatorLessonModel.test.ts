import { describe, expect, it } from "vitest";
import {
  defaultDistributionParameters,
  distributionCdf,
  distributionQuery,
} from "./distributionCalculatorLessonModel";
describe("distribution calculator model", () => {
  it("matches the target normal interval", () => {
    const result = distributionQuery(
      "normal",
      "between",
      40,
      60,
      defaultDistributionParameters,
    );
    expect(result.probability).toBeCloseTo(0.682689, 5);
    expect(result.zLow).toBe(-1);
    expect(result.zHigh).toBe(1);
  });
  it("supports left and right normal tails", () => {
    expect(
      distributionQuery("normal", "left", 0, 60, defaultDistributionParameters)
        .probability,
    ).toBeCloseTo(0.841345, 5);
    expect(
      distributionQuery("normal", "right", 60, 0, defaultDistributionParameters)
        .probability,
    ).toBeCloseTo(0.158655, 5);
  });
  it("computes binomial and exponential CDFs", () => {
    expect(
      distributionCdf("binomial", 20, defaultDistributionParameters),
    ).toBeCloseTo(1);
    expect(
      distributionCdf("exponential", 0, defaultDistributionParameters),
    ).toBe(0);
  });
});
