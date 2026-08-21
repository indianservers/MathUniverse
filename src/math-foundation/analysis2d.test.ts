import { describe, expect, it } from "vitest";
import { analyzeFunction2d } from "./analysis2d";

describe("structured function analysis", () => {
  it("reports roots and extrema with auditable numerical metadata", () => {
    const result = analyzeFunction2d("f", "x^2-4", { min: -4, max: 4 });
    const roots = result.points.filter((point) => point.kind === "ROOT");
    expect(roots).toHaveLength(2);
    expect(roots.map((point) => point.x)).toEqual(expect.arrayContaining([expect.closeTo(-2, 5), expect.closeTo(2, 5)]));
    expect(roots.every((point) => point.method === "BRACKETED_BISECTION" && point.residual !== undefined)).toBe(true);
    expect(result.points.some((point) => point.kind === "LOCAL_MINIMUM" && Math.abs(point.x!) < 0.02)).toBe(true);
  });

  it("distinguishes a removable hole from an ordinary plotted point", () => {
    const result = analyzeFunction2d("h", "(x^2-1)/(x-1)", { min: -4, max: 4 });
    const hole = result.points.find((point) => point.kind === "HOLE");
    expect(hole?.x).toBeCloseTo(1, 6);
    expect(hole?.y).toBeCloseTo(2, 3);
    expect(hole?.warnings.join(" ")).toContain("limit");
  });

  it("returns an explicit diagnostic for unsupported syntax", () => {
    const result = analyzeFunction2d("bad", "fetch(x)");
    expect(result.method.convergence).toBe("PARTIAL");
    expect(result.diagnostics[0].code).toBe("UNSUPPORTED_FUNCTION");
  });
});
