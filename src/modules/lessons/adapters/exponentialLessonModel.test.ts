import { describe, expect, it } from "vitest";
import { exponentialAnalysis, exponentialCdf, exponentialSurvival, simulateExponentialArrivals } from "./exponentialLessonModel";

describe("exponential lesson model", () => {
  it("computes the target waiting-time values", () => {
    const result = exponentialAnalysis(0.4, 3);
    expect(result.density).toBeCloseTo(0.1205, 4);
    expect(result.survival).toBeCloseTo(0.3012, 4);
    expect(result.cumulative).toBeCloseTo(0.6988, 4);
    expect(result.mean).toBe(2.5);
    expect(result.variance).toBeCloseTo(6.25);
  });

  it("preserves memorylessness and generates bounded arrivals", () => {
    expect(exponentialSurvival(5, 0.4) / exponentialSurvival(2, 0.4)).toBeCloseTo(exponentialSurvival(3, 0.4), 10);
    const simulation = simulateExponentialArrivals(0.4, 18, 532);
    expect(simulation.elapsed).toBeLessThanOrEqual(18);
    expect(simulation.intervals.every((value) => value > 0)).toBe(true);
    expect(exponentialCdf(3, 0.4)).toBeCloseTo(0.6988, 4);
  });
});
