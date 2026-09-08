import { describe, expect, it } from "vitest";
import { pairedTDefaults, pairedTTest } from "./pairedTTestLessonModel";

describe("paired t-test lesson model", () => {
  it("derives the test from within-pair differences", () => {
    const result = pairedTTest(pairedTDefaults);
    expect(result.meanBefore).toBeCloseTo(69.6, 8);
    expect(result.meanAfter).toBeCloseTo(75.8, 8);
    expect(result.mean).toBeCloseTo(6.2, 8);
    expect(result.sd).toBeCloseTo(1.4757, 4);
    expect(result.statistic).toBeCloseTo(13.2857, 4);
    expect(result.pValue).toBeLessThan(0.0001);
    expect(result.reject).toBe(true);
  });

  it("responds to paired changes", () => {
    const changed = pairedTDefaults.map((pair) => ({
      ...pair,
      after: pair.before,
    }));
    const result = pairedTTest(changed);
    expect(result.mean).toBe(0);
    expect(result.statistic).toBe(0);
    expect(result.reject).toBe(false);
  });
});
