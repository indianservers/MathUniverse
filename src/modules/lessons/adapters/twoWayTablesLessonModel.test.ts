import { describe, expect, it } from "vitest";
import { conditionalValue, defaultTwoWayCounts, focusCell, sanitizeCount, twoWaySummary } from "./twoWayTablesLessonModel";
describe("two-way tables model", () => {
  it("derives row, column, and grand totals", () => { const result=twoWaySummary(defaultTwoWayCounts); expect(result).toMatchObject({firstRed:6,firstBlue:4,secondRed:5,secondBlue:5,total:10}); });
  it("computes joint, marginal, conditional, and independence values", () => { const result=twoWaySummary(defaultTwoWayCounts); expect(result.divide(defaultTwoWayCounts.rr)).toBe(.3); expect(conditionalValue(defaultTwoWayCounts,"blueGivenRed")).toBe(.5); expect(result.independent).toBe(true); });
  it("sanitizes edited counts and maps conditional focus", () => { expect(sanitizeCount(-4)).toBe(0); expect(sanitizeCount(3.7)).toBe(4); expect(focusCell("redGivenBlue")).toBe("br"); });
});
