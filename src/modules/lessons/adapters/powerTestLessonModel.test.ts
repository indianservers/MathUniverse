import { describe, expect, it } from "vitest";
import {
  powerCurve,
  requiredSampleSize,
  zTestPower,
} from "./powerTestLessonModel";
describe("power of a test model", () => {
  it("computes the visible parameters consistently", () => {
    const r = zTestPower(100, 105, 10, 64, 0.05, "two-sided");
    expect(r.standardError).toBe(1.25);
    expect(r.effectSize).toBe(0.5);
    expect(r.noncentrality).toBe(4);
    expect(r.power).toBeCloseTo(0.9793, 3);
  });
  it("finds the minimum sample size", () => {
    const r = requiredSampleSize(0.5, 0.05, 0.8, "two-sided");
    expect(r.sampleSize).toBe(32);
    expect(r.achievedPower).toBeGreaterThanOrEqual(0.8);
  });
  it("builds an increasing sample-size curve", () => {
    const curve = powerCurve(0.5, 10, 0.05, "two-sided");
    expect(curve.at(-1)!.power).toBeGreaterThan(curve[0].power);
  });
});
