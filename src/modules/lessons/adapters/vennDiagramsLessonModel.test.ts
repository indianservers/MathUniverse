import { describe, expect, it } from "vitest";
import { expectedPlacements, shadeIncludes, universe, vennSummary } from "./vennDiagramsLessonModel";

describe("Venn diagrams lesson model", () => {
  it("partitions all twenty outcomes into four regions", () => {
    const summary = vennSummary(expectedPlacements);
    expect(universe).toHaveLength(20);
    expect(summary.aOnly).toEqual([1,2,3,4,5,6,7]);
    expect(summary.intersection).toEqual([8,9,10,11,12]);
    expect(summary.bOnly).toEqual([13,14,15,16,17]);
    expect(summary.outside).toEqual([18,19,20]);
  });
  it("derives set counts and inclusion-exclusion", () => {
    const summary = vennSummary(expectedPlacements);
    expect(summary.a).toHaveLength(12);
    expect(summary.b).toHaveLength(10);
    expect(summary.union).toHaveLength(17);
    expect(summary.a.length + summary.b.length - summary.intersection.length).toBe(summary.union.length);
    expect(summary.correct).toBe(20);
  });
  it("maps quick shading to mathematical regions", () => {
    expect(shadeIncludes("intersection", "a")).toBe(true);
    expect(shadeIncludes("outside", "union")).toBe(false);
  });
});
