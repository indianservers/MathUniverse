import { describe, expect, it } from "vitest";
import { analyzeExplicitGraph, findExtrema, findIntersections, findRoots, tangentAt } from "./graphAnalysis";

describe("graph analysis", () => {
  it("finds roots and extrema for explicit graphs", () => {
    const roots = findRoots("x^2-4", { xMin: -5, xMax: 5 });
    const extrema = findExtrema("x^2-4", { xMin: -5, xMax: 5 });

    expect(roots.map((point) => Math.round(point.x))).toEqual([-2, 2]);
    expect(extrema[0].kind).toBe("minimum");
    expect(extrema[0].x).toBeCloseTo(0, 2);
  });

  it("finds intersections and tangent equations", () => {
    const intersections = findIntersections("x^2", "2*x+3", { xMin: -5, xMax: 5 });
    const tangent = tangentAt("x^2", 2);

    expect(intersections.map((point) => Math.round(point.x))).toEqual([-1, 3]);
    expect(tangent.slope).toBeCloseTo(4);
    expect(tangent.equation).toBe("y=4*x-4");
  });

  it("returns a compact explicit graph analysis summary", () => {
    const summary = analyzeExplicitGraph("x^2-4", { xMin: -5, xMax: 5 });

    expect(summary.roots).toHaveLength(2);
    expect(summary.yIntercept).toBe(-4);
  });
});
