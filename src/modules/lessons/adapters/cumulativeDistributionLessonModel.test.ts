import { describe, expect, it } from "vitest";
import { cumulativeDensity, cumulativeProbability, cumulativeWorkedValues } from "./cumulativeDistributionLessonModel";

describe("cumulative distribution lesson model", () => {
  it("evaluates the target continuous PDF and CDF", () => {
    expect(cumulativeDensity(1.4, "continuous")).toBeCloseTo(0.7);
    expect(cumulativeProbability(1.4, "continuous")).toBeCloseTo(0.49);
    expect(cumulativeProbability(2, "continuous")).toBe(1);
  });

  it("accumulates the discrete masses", () => {
    expect(cumulativeProbability(1, "discrete")).toBeCloseTo(0.5);
    expect(cumulativeProbability(2, "discrete")).toBeCloseTo(1);
    expect(cumulativeWorkedValues("discrete")).toHaveLength(5);
  });
});
