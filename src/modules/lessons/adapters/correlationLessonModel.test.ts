import { describe, expect, it } from "vitest";
import { correlationDefault, correlationStats } from "./correlationLessonModel";
describe("Correlation model", () => {
  it("computes Pearson statistics", () => {
    const stats = correlationStats();
    expect(stats.r).toBeGreaterThan(0.9);
    expect(stats.n).toBe(9);
  });
  it("recognizes perfect positive pairs", () => {
    expect(
      correlationStats([
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ]).r,
    ).toBeCloseTo(1);
    expect(correlationDefault).toHaveLength(9);
  });
});
