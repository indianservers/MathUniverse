import { describe, expect, it } from "vitest";
import {
  confidenceIntervalMean,
  simulateMeanIntervalCoverage,
  summarizeMeanSample,
  targetMeanSample,
} from "./confidenceMeanLessonModel";
describe("confidence interval mean lesson model", () => {
  it("computes the target editable sample interval", () => {
    const s = summarizeMeanSample(targetMeanSample),
      ci = confidenceIntervalMean(targetMeanSample, 0.95);
    expect(s.n).toBe(30);
    expect(s.mean).toBeCloseTo(11.43, 2);
    expect(s.sd).toBeCloseTo(0.918, 3);
    expect(ci.critical).toBeCloseTo(2.045, 3);
    expect(ci.lower).toBeCloseTo(11.09, 2);
    expect(ci.upper).toBeCloseTo(11.77, 2);
  });
  it("simulates nominal interval coverage", () => {
    const r = simulateMeanIntervalCoverage(30, 0.95, 1000, 539);
    expect(r.intervals).toHaveLength(1000);
    expect(r.captureRate).toBeGreaterThan(0.9);
    expect(r.captureRate).toBeLessThan(0.99);
    expect(r.captured + r.missed).toBe(1000);
  });
});
