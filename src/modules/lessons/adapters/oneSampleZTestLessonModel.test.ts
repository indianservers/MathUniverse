import { describe, expect, it } from "vitest";
import { oneSampleZTest } from "./oneSampleZTestLessonModel";

describe("one-sample z-test lesson model", () => {
  it("computes a two-sided known-sigma test", () => {
    const result = oneSampleZTest(106, 100, 12, 36, 0.05, "two-sided");
    expect(result.se).toBe(2);
    expect(result.z).toBe(3);
    expect(result.pValue).toBeCloseTo(0.0027, 4);
    expect(result.effectSize).toBe(0.5);
    expect(result.reject).toBe(true);
  });

  it("uses the selected tail", () => {
    const right = oneSampleZTest(105, 100, 12, 36, 0.05, "greater");
    const left = oneSampleZTest(105, 100, 12, 36, 0.05, "less");
    expect(right.pValue).toBeLessThan(0.01);
    expect(left.pValue).toBeGreaterThan(0.99);
  });
});
