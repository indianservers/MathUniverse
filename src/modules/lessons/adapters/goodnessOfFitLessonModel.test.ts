import { describe, expect, it } from "vitest";
import { goodnessOfFitTest } from "./goodnessOfFitLessonModel";
describe("goodness-of-fit lesson model", () => {
  it("matches the target five-category example", () => {
    const r = goodnessOfFitTest([21, 18, 24, 17, 20], [1, 1, 1, 1, 1]);
    expect(r.expected).toEqual([20, 20, 20, 20, 20]);
    expect(r.contributions[0]).toBeCloseTo(0.05);
    expect(r.contributions[2]).toBeCloseTo(0.8);
    expect(r.statistic).toBeCloseTo(1.5);
    expect(r.df).toBe(4);
    expect(r.pValue).toBeCloseTo(0.8266, 3);
    expect(r.reject).toBe(false);
    expect(r.conditions.allAtLeastFive).toBe(true);
  });
  it("normalizes weights and adjusts df for fitted parameters", () => {
    const r = goodnessOfFitTest([30, 20], [3, 2], 0.05, 0);
    expect(r.expected).toEqual([30, 20]);
    expect(r.statistic).toBe(0);
    expect(r.df).toBe(1);
  });
});
