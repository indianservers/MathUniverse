import { describe, expect, it } from "vitest";
import { oneWayAnova, randomAnovaGroups } from "./anovaLessonModel";
const groups = [
  [8, 7, 6, 10, 8, 9],
  [12, 13, 11, 14, 12, 13],
  [16, 17, 15, 18, 17, 16],
];
describe("ANOVA lesson model", () => {
  it("decomposes the visible groups exactly", () => {
    const r = oneWayAnova(groups);
    expect(r.summaries.map((item) => item.mean)).toEqual([8, 12.5, 16.5]);
    expect(r.grandMean).toBeCloseTo(12.3333, 4);
    expect(r.ssBetween).toBeCloseTo(217);
    expect(r.ssWithin).toBeCloseTo(21);
    expect(r.ssTotal).toBeCloseTo(238);
    expect(r.statistic).toBeCloseTo(77.5);
    expect(r.pValue).toBeLessThan(2e-8);
    expect(r.reject).toBe(true);
  });
  it("generates reproducible groups", () => {
    expect(randomAnovaGroups(552)).toEqual(randomAnovaGroups(552));
  });
});
