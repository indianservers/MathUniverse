import { describe, expect, it } from "vitest";
import { bernoulliStats, simulateBernoulli } from "./bernoulliLessonModel";

describe("Bernoulli lesson model", () => {
  it("computes the target PMF and moments", () => {
    const result = bernoulliStats(0.65);
    expect(result.failure).toBeCloseTo(0.35);
    expect(result.mean).toBeCloseTo(0.65);
    expect(result.variance).toBeCloseTo(0.2275);
  });
  it("runs a reproducible real trial simulation", () => {
    const a = simulateBernoulli(0.65, 1000);
    const b = simulateBernoulli(0.65, 1000);
    expect(a).toEqual(b);
    expect(a.successes + a.failures).toBe(1000);
    expect(a.empiricalSuccess).toBeGreaterThan(0.6);
    expect(a.empiricalSuccess).toBeLessThan(0.7);
  });
});
