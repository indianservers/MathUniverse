import { describe, expect, it } from "vitest";
import {
  samplingConvergence,
  simulateSamplingDistribution,
} from "./samplingDistributionsLessonModel";
describe("sampling distributions lesson model", () => {
  it("creates the target normal sample-mean distribution", () => {
    const r = simulateSamplingDistribution("normal", 25, 20000, 537);
    expect(r.means).toHaveLength(20000);
    expect(r.lastSample).toHaveLength(25);
    expect(r.empiricalMean).toBeCloseTo(50, 1);
    expect(r.empiricalStd).toBeCloseTo(2, 1);
    expect(r.standardError).toBe(2);
  });
  it("supports each population shape and convergence size", () => {
    for (const shape of [
      "normal",
      "uniform",
      "right",
      "left",
      "bimodal",
    ] as const)
      expect(
        simulateSamplingDistribution(shape, 20, 100, 1).empiricalMean,
      ).toBeGreaterThan(45);
    expect(samplingConvergence("right", 25, 2)).toHaveLength(4);
  });
});
