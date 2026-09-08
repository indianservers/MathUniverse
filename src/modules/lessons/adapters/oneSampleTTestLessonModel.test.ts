import { describe, expect, it } from "vitest";
import {
  oneSampleTTest,
  studentTCdf,
  studentTQuantile,
} from "./oneSampleTTestLessonModel";

describe("one-sample t-test lesson model", () => {
  it("computes sample statistics and a real two-sided test", () => {
    const result = oneSampleTTest(
      [69, 72, 71, 75, 68, 74, 70, 73, 69, 76],
      70,
      0.05,
      "two-sided",
    );
    expect(result.mean).toBeCloseTo(71.7, 8);
    expect(result.sd).toBeCloseTo(2.7508, 4);
    expect(result.statistic).toBeCloseTo(1.9543, 4);
    expect(result.pValue).toBeGreaterThan(0.08);
    expect(result.pValue).toBeLessThan(0.09);
    expect(result.reject).toBe(false);
  });

  it("inverts the Student t distribution", () => {
    const critical = studentTQuantile(0.975, 9);
    expect(critical).toBeCloseTo(2.2622, 4);
    expect(studentTCdf(critical, 9)).toBeCloseTo(0.975, 8);
  });
});
