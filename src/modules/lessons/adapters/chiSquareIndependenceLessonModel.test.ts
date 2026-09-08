import { describe, expect, it } from "vitest";
import { chiSquareIndependence } from "./chiSquareIndependenceLessonModel";
describe("chi-square independence lesson model", () => {
  it("derives all totals and inference from the visible table", () => {
    const r = chiSquareIndependence([
      [45, 35],
      [50, 30],
      [35, 25],
      [25, 15],
    ]);
    expect(r.rowTotals).toEqual([80, 80, 60, 40]);
    expect(r.columnTotals).toEqual([155, 105]);
    expect(r.total).toBe(260);
    expect(r.expected[0][0]).toBeCloseTo(47.6923, 4);
    expect(r.statistic).toBeCloseTo(0.8321, 4);
    expect(r.df).toBe(3);
    expect(r.pValue).toBeGreaterThan(0.8);
    expect(r.reject).toBe(false);
  });
  it("detects a strong association", () => {
    const r = chiSquareIndependence([
      [40, 0],
      [0, 40],
    ]);
    expect(r.statistic).toBe(80);
    expect(r.reject).toBe(true);
    expect(r.cramersV).toBe(1);
  });
});
