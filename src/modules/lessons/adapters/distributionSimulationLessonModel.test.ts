import { describe, expect, it } from "vitest";
import {
  binomialPmf,
  binomialTail,
  convergenceSeries,
  simulateBinomial,
} from "./distributionSimulationLessonModel";
describe("distribution simulation lesson model", () => {
  it("builds a normalized binomial model", () => {
    const total = Array.from({ length: 11 }, (_, k) =>
      binomialPmf(k, 10, 0.3),
    ).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 10);
    expect(binomialTail(4, 10, 0.3)).toBeCloseTo(0.3504, 4);
  });
  it("produces reproducible empirical results", () => {
    const a = simulateBinomial(10, 0.3, 10000, 56134761),
      b = simulateBinomial(10, 0.3, 10000, 56134761);
    expect(a.counts).toEqual(b.counts);
    expect(a.mean).toBeGreaterThan(2.9);
    expect(a.mean).toBeLessThan(3.1);
    expect(a.totalSuccesses).toBe(
      a.counts.reduce((sum, count, k) => sum + count * k, 0),
    );
    expect(convergenceSeries(10, 0.3, 12)).toHaveLength(5);
  });
});
