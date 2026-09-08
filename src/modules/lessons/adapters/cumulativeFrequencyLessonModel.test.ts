import { describe, expect, it } from "vitest";
import {
  cumulativeValues,
  cumulativeDefault,
  percentile,
} from "./cumulativeFrequencyLessonModel";
describe("Cumulative frequency model", () => {
  it("builds cumulative totals", () => {
    expect(cumulativeValues().at(-1)).toBe(40);
    expect(cumulativeValues()[3]).toBe(27);
  });
  it("interpolates percentiles", () => {
    expect(percentile(cumulativeDefault, 0.5)).toBeCloseTo(163.136, 2);
  });
});
