import { describe, expect, it } from "vitest";
import { analyzeConsistency, reduceConsistency, equationGeometry, consistencyGeometryMessage } from "./linearSystemConsistencyModel";

describe("lesson 10199 consistency engine", () => {
  it("calculates the newly attached screenshot's initial system", () => {
    expect(analyzeConsistency([15, 1, 2, 2, 2, 4])).toMatchObject({ type: "unique", rankA: 2, rankAugmented: 2, x: 0, y: 2 });
    expect(reduceConsistency([15, 1, 2, 2, 2, 4]).values).toEqual([15, 1, 2, 0, 28, 56]);
  });
  it("does not invent lines for tautologies or contradictions", () => {
    expect(equationGeometry(0, 0, 0)).toEqual({ kind: "plane", endpoints: null });
    expect(equationGeometry(0, 0, 1)).toEqual({ kind: "empty", endpoints: null });
    expect(consistencyGeometryMessage([0, 0, 0, 0, 0, 0])).toContain("Every point in the plane");
    expect(consistencyGeometryMessage([0, 0, 1, 1, 1, 2])).toContain("contradictory");
  });
  it("generates endpoints satisfying vertical and sloping equations", () => {
    for (const [a, b, c] of [[2, 0, 6], [2, 1, 5], [0, 3, 9]]) {
      const points = equationGeometry(a, b, c).endpoints!;
      expect(a * points[0] + b * points[1]).toBeCloseTo(c);
      expect(a * points[2] + b * points[3]).toBeCloseTo(c);
    }
  });
  it("extends horizontal and vertical lines through the viewport at every zoom", () => {
    for (const zoom of [0.6, 1, 1.8]) {
      const scale = 20 * zoom;
      const extent = Math.ceil(150 / scale) + 1;
      const horizontal = equationGeometry(0, 1, 2, extent).endpoints!;
      const vertical = equationGeometry(1, 0, 2, extent).endpoints!;
      expect(150 + horizontal[0] * scale).toBeLessThan(0);
      expect(150 + horizontal[2] * scale).toBeGreaterThan(300);
      expect(117 - vertical[1] * scale).toBeGreaterThan(235);
      expect(117 - vertical[3] * scale).toBeLessThan(0);
      expect(horizontal[1]).toBe(2);
      expect(vertical[0]).toBe(2);
    }
  });
  it("swaps rows for a zero first pivot without discarding the x equation", () => {
    expect(reduceConsistency([0, 1, 2, 1, 0, 3])).toEqual({
      values: [1, 0, 3, 0, 1, 2], operation: "R1 <-> R2",
    });
  });
  it("reduces a y-only system and preserves a contradiction", () => {
    expect(reduceConsistency([0, 1, 2, 0, 2, 5]).values).toEqual([0, 1, 2, 0, 0, 1]);
    expect(analyzeConsistency([0, 0, 0, 0, 0, 1]).type).toBe("none");
    expect(analyzeConsistency([0, 0, 0, 0, 0, 0]).rankA).toBe(0);
  });
  it("classifies coincident equations by equal deficient ranks", () => {
    expect(analyzeConsistency([1, 1, 2, 2, 2, 4])).toMatchObject({
      type: "infinite",
      rankA: 1,
      rankAugmented: 1,
    });
  });

  it("classifies parallel equations by unequal ranks", () => {
    expect(analyzeConsistency([1, 1, 2, 2, 2, 5])).toMatchObject({
      type: "none",
      rankA: 1,
      rankAugmented: 2,
    });
  });

  it("solves a full-rank system", () => {
    expect(analyzeConsistency([2, 1, 5, 1, -1, 1])).toMatchObject({
      type: "unique",
      rankA: 2,
      rankAugmented: 2,
      x: 2,
      y: 1,
    });
  });

  it("uses the target unique example's unit-pivot swap and echelon rows", () => {
    expect(reduceConsistency([2, 1, 5, 1, -1, 1])).toEqual({
      values: [1, -1, 1, 0, 3, 3],
      operation: "R1 <-> R2; R2 <- (1)R2 - (2)R1",
    });
  });

  it("preserves the default and inconsistent example reductions", () => {
    expect(reduceConsistency([1, 1, 2, 2, 2, 4]).values).toEqual([1, 1, 2, 0, 0, 0]);
    expect(reduceConsistency([1, 1, 2, 2, 2, 5]).values).toEqual([1, 1, 2, 0, 0, 1]);
  });
});
