import { describe, expect, it } from "vitest";
import { challengeData, defaultFrequencyData, frequencyRows, meanOf, medianOf, modeOf, rangeOf, relativeTotal, repairedChallenge } from "./frequencyTablesModel";
describe("Frequency Tables model", () => {
  it("derives exact counts, tallies and proportions from raw observations", () => {
    const rows = frequencyRows(defaultFrequencyData);
    expect(rows.map(row => [row.value, row.frequency])).toEqual([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 2], [7, 1], [8, 1], [9, 1]]);
    expect(rows[4].tally).toBe("|||||"); expect(rows[4].relative).toBe(0.25); expect(relativeTotal(rows)).toBeCloseTo(1);
  });
  it("computes linked summary values and empty data safely", () => {
    expect(modeOf(frequencyRows(defaultFrequencyData))).toBe(5); expect(medianOf(defaultFrequencyData)).toBe(4.5); expect(rangeOf(defaultFrequencyData)).toBe(8); expect(meanOf(defaultFrequencyData)).toBe(4.55);
    expect(frequencyRows([])).toEqual([]); expect(modeOf([])).toBeNull(); expect(medianOf([])).toBeNull(); expect(rangeOf([])).toBeNull(); expect(meanOf([])).toBeNull(); expect(relativeTotal([])).toBe(0);
  });
  it("validates every repaired challenge frequency and refuses incomplete or wrong maps", () => {
    expect(repairedChallenge(challengeData, {})).toBe(false);
    const correct = Object.fromEntries(frequencyRows(challengeData).map(row => [row.value, row.frequency]));
    expect(correct).toEqual({ 2: 2, 3: 4, 4: 5, 5: 2, 6: 1, 7: 1 }); expect(repairedChallenge(challengeData, correct)).toBe(true);
    expect(repairedChallenge(challengeData, { ...correct, 3: 3 })).toBe(false);
  });
});
