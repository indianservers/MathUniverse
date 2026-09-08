import { describe, expect, it } from "vitest";
import { normalIntervalQuery } from "./intervalTailLessonModel";

describe("interval and tail model", () => {
  it("matches the target normal interval", () => {
    const result = normalIntervalQuery("between", -1, 1.5, 0, 1);
    expect(result.probability).toBeCloseTo(0.77454, 5);
    expect(result.cdfLow).toBeCloseTo(0.15866, 5);
    expect(1 - result.cdfHigh).toBeCloseTo(0.06681, 5);
  });

  it("keeps interval and outside probabilities complementary", () => {
    const result = normalIntervalQuery("outside", -2, 2, 0, 1);
    expect(result.between + result.probability).toBeCloseTo(1, 10);
  });
});
