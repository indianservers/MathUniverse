import { describe, expect, it } from "vitest";
import { boundaryChecks, groupedData, groupRows, selfCheckFrequencies } from "./groupedFrequencyModel";
describe("Grouped frequency model", () => {
  it("counts contiguous half-open classes and midpoint values", () => {
    const rows = groupRows(groupedData, [2, 7, 12, 17, 22]); expect(rows.map(row => [row.frequency, row.width, row.midpoint])).toEqual([[5, 5, 4.5], [5, 5, 9.5], [5, 5, 14.5], [5, 5, 19.5]]); expect(rows.reduce((sum, row) => sum + row.frequency, 0)).toBe(20);
  });
  it("detects coverage, gaps and non-positive widths", () => { expect(boundaryChecks(groupRows(groupedData, [2, 7, 12, 17, 22]), groupedData)).toEqual({ noGaps: true, noOverlaps: true, total: true }); expect(boundaryChecks(groupRows(groupedData, [3, 7, 12, 18, 22]), groupedData).noGaps).toBe(false); });
  it("calculates the self-check counts from values rather than hard-coded answers", () => { expect(selfCheckFrequencies(Array.from({ length: 16 }, (_, i) => i + 1), [1, 5, 9, 13], 4)).toEqual([4, 4, 4, 4]); });
});
