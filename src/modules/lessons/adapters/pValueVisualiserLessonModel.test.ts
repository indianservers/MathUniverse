import { describe, expect, it } from "vitest";
import { pValueAnalysis } from "./pValueVisualiserLessonModel";

describe("p-value visualiser model", () => {
  it("matches the target two-tailed z scenario", () => {
    const result = pValueAnalysis("z", 1.68, 0.05, "two-sided");
    expect(result.pValue).toBeCloseTo(0.09296, 4);
    expect(result.criticalLow).toBeCloseTo(-1.96, 2);
    expect(result.criticalHigh).toBeCloseTo(1.96, 2);
    expect(result.reject).toBe(false);
  });
  it("changes calculation for test family and tail", () => {
    expect(pValueAnalysis("t", 1.68, 0.05, "right", 10).pValue).toBeGreaterThan(
      0.05,
    );
    expect(pValueAnalysis("chi-square", 20, 0.05, "right", 5).reject).toBe(
      true,
    );
    expect(pValueAnalysis("f", 4, 0.05, "right", 4, 20).pValue).toBeLessThan(
      0.05,
    );
  });
});
