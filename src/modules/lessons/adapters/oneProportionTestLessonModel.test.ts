import { describe, expect, it } from "vitest";
import { oneProportionTest } from "./oneProportionTestLessonModel";

describe("one-proportion test lesson model", () => {
  it("uses the null proportion in the normal standard error", () => {
    const result = oneProportionTest(60, 200, 0.3, 0.05, "two-sided", "normal");
    expect(result.proportion).toBe(0.3);
    expect(result.se).toBeCloseTo(0.0324, 4);
    expect(result.z).toBe(0);
    expect(result.pValue).toBeCloseTo(1, 8);
    expect(result.reject).toBe(false);
    expect(result.conditions.met).toBe(true);
  });
  it("supports exact binomial tails", () => {
    const exact = oneProportionTest(8, 10, 0.5, 0.05, "greater", "exact"),
      normal = oneProportionTest(8, 10, 0.5, 0.05, "greater", "normal");
    expect(exact.pValue).toBeCloseTo(0.0546875, 7);
    expect(exact.pValue).not.toBeCloseTo(normal.pValue, 3);
  });
});
