import { describe, expect, it } from "vitest";
import {
  proportionInterval,
  simulateProportionCoverage,
} from "./confidenceProportionLessonModel";
describe("confidence proportion lesson model", () => {
  it("computes Wilson and Wald intervals", () => {
    const wilson = proportionInterval(180, 250, 0.95, "wilson"),
      wald = proportionInterval(180, 250, 0.95, "wald");
    expect(wilson.pHat).toBe(0.72);
    expect(wilson.lower).toBeCloseTo(0.6613, 4);
    expect(wilson.upper).toBeCloseTo(0.772, 4);
    expect(wald.lower).toBeCloseTo(0.6643, 4);
    expect(wald.upper).toBeCloseTo(0.7757, 4);
  });
  it("simulates nominal Wilson coverage", () => {
    const r = simulateProportionCoverage(0.72, 250, 0.95, 1000, "wilson", 540);
    expect(r.captured + r.missed).toBe(1000);
    expect(r.captureRate).toBeGreaterThan(0.9);
    expect(r.captureRate).toBeLessThan(0.99);
  });
});
