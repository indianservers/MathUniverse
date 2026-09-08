import { describe, expect, it } from "vitest";
import {
  cellRegion,
  conditionalSummary,
  dicePairs,
  formatSet,
} from "./conditionalProbabilityLessonModel";

describe("conditional probability lesson model", () => {
  it("builds all 36 ordered dice pairs", () => {
    expect(dicePairs).toHaveLength(36);
    expect(formatSet(dicePairs.slice(0, 2))).toBe("{(1,1), (1,2)}");
  });

  it("restricts the sum-seven event to first-die-is-one", () => {
    const summary = conditionalSummary("sum7", "first1");
    expect(summary.a).toHaveLength(6);
    expect(summary.b).toHaveLength(6);
    expect(summary.intersection).toEqual([[1, 6]]);
    expect(summary.probability).toBeCloseTo(1 / 6);
    expect(cellRegion([1, 6], "sum7", "first1")).toBe("both");
  });

  it("recalculates non-default event pairs", () => {
    expect(
      conditionalSummary("doubles", "atLeastOne6").probability,
    ).toBeCloseTo(1 / 11);
  });
});
