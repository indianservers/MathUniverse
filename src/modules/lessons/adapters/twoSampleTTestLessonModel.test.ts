import { describe, expect, it } from "vitest";
import { twoSampleTTest } from "./twoSampleTTestLessonModel";

const first = [12, 15, 14, 13, 16, 17, 11, 14, 16, 15];
const second = [10, 9, 11, 10, 12, 9, 8, 11, 10, 9, 8, 10];

describe("two-sample t-test lesson model", () => {
  it("computes the Welch test from the displayed observations", () => {
    const result = twoSampleTTest(first, second, 0.05, "two-sided", "welch");
    expect(result.first.mean).toBeCloseTo(14.3, 8);
    expect(result.second.mean).toBeCloseTo(9.75, 8);
    expect(result.statistic).toBeGreaterThan(6);
    expect(result.pValue).toBeLessThan(0.0001);
    expect(result.reject).toBe(true);
  });

  it("changes degrees of freedom when pooling", () => {
    const welch = twoSampleTTest(first, second, 0.05, "two-sided", "welch");
    const pooled = twoSampleTTest(first, second, 0.05, "two-sided", "pooled");
    expect(pooled.df).toBe(20);
    expect(welch.df).not.toBe(pooled.df);
  });
});
