import { describe, expect, it } from "vitest";
import {
  simulateWeibull,
  weibullAnalysis,
  weibullCdf,
  weibullHazard,
  weibullSurvival,
} from "./weibullLessonModel";

describe("Weibull lesson model", () => {
  it("computes reliability and lifetime summaries", () => {
    const result = weibullAnalysis(1.5, 100);
    expect(result.mean).toBeCloseTo(90.275, 3);
    expect(result.median).toBeCloseTo(78.322, 3);
    expect(weibullSurvival(100, 1.5, 100)).toBeCloseTo(Math.exp(-1), 8);
    expect(weibullCdf(100, 1.5, 100)).toBeCloseTo(1 - Math.exp(-1), 8);
    expect(weibullHazard(100, 1.5, 100)).toBeCloseTo(0.015, 8);
  });

  it("generates deterministic positive lifetimes", () => {
    const sample = simulateWeibull(1.5, 100, 1000, 20240517);
    expect(sample.values).toHaveLength(1000);
    expect(sample.values[0]).toBeGreaterThan(0);
    expect(sample.mean).toBeGreaterThan(80);
    expect(sample.mean).toBeLessThan(100);
  });
});
