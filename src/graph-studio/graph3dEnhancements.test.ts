import { describe, expect, it } from "vitest";
import {
  curveArcLength,
  evaluateDomainPredicate,
  explicitSurfaceArea,
  expressionToLatex,
  intersectionCurve,
  meshToObj,
  meshToStl,
  suggestExpressionFix,
  vectorCalculusAt,
} from "./graph3dEnhancements";

describe("Graph Studio 3D enhancements", () => {
  it("suggests a rewrite for empty and unbalanced expressions", () => {
    expect(suggestExpressionFix("").rewrite).toBe("sin(x)*cos(y)");
    expect(suggestExpressionFix("sin(x").message).toMatch(/parenthes/i);
    expect(expressionToLatex("sin(x)*cos(y)")).toContain("\\sin");
  });

  it("evaluates disk domain predicates and mesh export", () => {
    expect(evaluateDomainPredicate("x^2+y^2<=4", 0, 0)).toBe(true);
    expect(evaluateDomainPredicate("x^2+y^2<=4", 3, 0)).toBe(false);
    expect(evaluateDomainPredicate("x>0, y>=0", 1, 2)).toBe(true);
    expect(evaluateDomainPredicate("x>0, y>=0", -1, 2)).toBe(false);
    const mesh = { positions: [0, 0, 0, 1, 0, 0, 0, 1, 0], indices: [0, 1, 2], minZ: 0, maxZ: 0 };
    expect(meshToStl(mesh)).toContain("facet normal");
    expect(meshToObj(mesh)).toContain("f 1 2 3");
  });

  it("computes surface area, arc length, intersection, and curl", () => {
    const area = explicitSurfaceArea("0", -1, 1, -1, 1, 20);
    expect(area.area).toBeCloseTo(4, 1);
    expect(curveArcLength([{ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 }])).toBe(5);
    expect(intersectionCurve("x", "0", -1, 1, -1, 1, 12).length).toBeGreaterThan(4);
    const calculus = vectorCalculusAt({ x: "-y", y: "x", z: "0" }, { x: 1, y: 0, z: 0 });
    expect(calculus?.curl.z).toBeCloseTo(2, 1);
    expect(calculus?.divergence).toBeCloseTo(0, 1);
  });
});
