import { describe, expect, it } from "vitest";
import {
  additionRuleSummary,
  outcomeRegion,
  regionIsHighlighted,
  twoDiceOutcomes,
} from "./additionRuleLessonModel";

describe("addition rule lesson model", () => {
  it("builds the complete ordered two-dice sample space", () => {
    expect(twoDiceOutcomes).toHaveLength(36);
    expect(twoDiceOutcomes[0]).toEqual([1, 1]);
    expect(twoDiceOutcomes.at(-1)).toEqual([6, 6]);
  });

  it("subtracts the overlap exactly once", () => {
    const summary = additionRuleSummary(false);
    expect(summary.a).toHaveLength(6);
    expect(summary.b).toHaveLength(6);
    expect(summary.intersection).toEqual([[4, 3]]);
    expect(summary.union).toHaveLength(11);
    expect(summary.probability).toBeCloseTo(11 / 36);
  });

  it("uses the simpler rule for mutually exclusive events", () => {
    const summary = additionRuleSummary(true);
    expect(summary.b).toEqual([[1, 1]]);
    expect(summary.intersection).toHaveLength(0);
    expect(summary.union).toHaveLength(7);
  });

  it("links outcome regions to the selected diagram region", () => {
    expect(outcomeRegion([4, 3], false)).toBe("intersection");
    expect(regionIsHighlighted("intersection", "union")).toBe(true);
    expect(regionIsHighlighted("neither", "union")).toBe(false);
  });
});
