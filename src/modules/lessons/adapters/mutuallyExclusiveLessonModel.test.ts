import { describe, expect, it } from "vitest";
import { clampCenter, defaultCenters, exclusiveSummary, outcomesInside } from "./mutuallyExclusiveLessonModel";

describe("mutually exclusive geometry model", () => {
  it("starts with disjoint three-outcome event sets", () => {
    const summary = exclusiveSummary(defaultCenters);
    expect(summary.a).toEqual([1, 5, 9]);
    expect(summary.b).toEqual([4, 8, 12]);
    expect(summary.intersection).toEqual([]);
    expect(summary.union).toHaveLength(6);
    expect(summary.exclusive).toBe(true);
  });

  it("detects overlap from circle geometry", () => {
    const summary = exclusiveSummary({ a: { x: 0.59, y: 0.43 }, b: { x: 0.59, y: 0.43 } });
    expect(summary.intersection).toEqual([3, 7, 11]);
    expect(summary.exclusive).toBe(false);
  });

  it("clamps dragged centers to the sample-space boundary", () => {
    expect(clampCenter({ x: -1, y: 2 })).toEqual({ x: 0.13, y: 0.76 });
    expect(outcomesInside({ x: 0.13, y: 0.43 })).toHaveLength(3);
  });
});
