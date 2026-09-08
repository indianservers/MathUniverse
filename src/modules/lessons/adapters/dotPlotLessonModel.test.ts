import { describe, expect, it } from "vitest";
import {
  dotCounts,
  dotDefault,
  dotIqr,
  dotMedian,
  dotMode,
} from "./dotPlotLessonModel";
describe("Dot plot model", () => {
  it("counts stacks and linked statistics", () => {
    expect(dotCounts(dotDefault)[5]).toBe(3);
    expect(dotMode(dotDefault)).toEqual([4, 5]);
    expect(dotMedian(dotDefault)).toBe(4);
    expect(dotIqr(dotDefault)).toBe(2);
  });
  it("handles empty and tied data", () => {
    expect(dotMode([])).toEqual([]);
    expect(dotMedian([])).toBeNull();
    expect(dotMode([1, 1, 2, 2])).toEqual([1, 2]);
  });
});
