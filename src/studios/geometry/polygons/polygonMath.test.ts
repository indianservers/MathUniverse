import { describe, expect, it } from "vitest";
import {
  apothemFromCircumradius,
  combinations,
  diagonalCount,
  diagonalsFromVertex,
  exteriorAngleRegular,
  genericDiagonalIntersections,
  interiorAngleRegular,
  interiorAngleSum,
  interiorAngles,
  isConvexPolygon,
  isSelfIntersecting,
  polygonPerimeter,
  regularPolygonArea,
  regularPolygonVertices,
  regularMetrics,
  shoelaceArea,
  sideLengthFromCircumradius,
  tessellationAngleCheck,
} from "./polygonMath";
import { parsePolygonMode, polygonModeUrl } from "./polygonMode";

describe("regular polygon formulas", () => {
  it("matches canonical n = 3,4,5,6,8 values", () => {
    expect(interiorAngleRegular(3)).toBe(60);
    expect(exteriorAngleRegular(3)).toBe(120);
    expect(diagonalCount(3)).toBe(0);
    expect(interiorAngleRegular(4)).toBe(90);
    expect(exteriorAngleRegular(4)).toBe(90);
    expect(diagonalCount(4)).toBe(2);
    expect(interiorAngleRegular(5)).toBe(108);
    expect(exteriorAngleRegular(5)).toBe(72);
    expect(diagonalCount(5)).toBe(5);
    expect(interiorAngleRegular(6)).toBe(120);
    expect(exteriorAngleRegular(6)).toBe(60);
    expect(diagonalCount(6)).toBe(9);
    expect(interiorAngleRegular(8)).toBe(135);
    expect(exteriorAngleRegular(8)).toBe(45);
    expect(diagonalCount(8)).toBe(20);
    expect(interiorAngleSum(7)).toBe(900);
    expect(diagonalsFromVertex(8)).toBe(5);
  });

  it("derives side, apothem, area, and perimeter from R", () => {
    const n = 6;
    const R = 2;
    const side = sideLengthFromCircumradius(n, R);
    const apothem = apothemFromCircumradius(n, R);
    const area = regularPolygonArea(n, R);
    expect(side).toBeCloseTo(2, 8);
    expect(apothem).toBeCloseTo(Math.sqrt(3), 8);
    expect(area).toBeCloseTo((3 * Math.sqrt(3) * R * R) / 2, 8);
    const verts = regularPolygonVertices(n, R, 0);
    expect(shoelaceArea(verts)).toBeCloseTo(area, 8);
    expect(polygonPerimeter(verts)).toBeCloseTo(n * side, 8);
    const m = regularMetrics(8, 1);
    expect(m.exterior).toBe(45);
    expect(m.diagonals).toBe(20);
    expect(0.5 * m.perimeter * m.apothem).toBeCloseTo(m.area, 8);
  });
});

describe("polygon predicates", () => {
  it("detects convex regular polygons and a self-intersecting bowtie", () => {
    expect(isConvexPolygon(regularPolygonVertices(5, 3, 12))).toBe(true);
    const bowtie = [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
      { x: 2, y: 0 },
    ];
    expect(isSelfIntersecting(bowtie)).toBe(true);
    expect(isConvexPolygon(bowtie)).toBe(false);
  });

  it("keeps interior angles summing to (n-2)×180°", () => {
    const verts = regularPolygonVertices(5, 4, 8);
    const angles = interiorAngles(verts);
    expect(angles).toHaveLength(5);
    angles.forEach((angle) => expect(angle).toBeCloseTo(108, 5));
    expect(angles.reduce((s, a) => s + a, 0)).toBeCloseTo(540, 5);
  });
});

describe("tessellation and combinatorics", () => {
  it("allows only triangle, square, and hexagon as regular monohedral tiles", () => {
    expect(tessellationAngleCheck(3).tessellates).toBe(true);
    expect(tessellationAngleCheck(4).tessellates).toBe(true);
    expect(tessellationAngleCheck(6).tessellates).toBe(true);
    expect(tessellationAngleCheck(5).tessellates).toBe(false);
    expect(tessellationAngleCheck(7).tessellates).toBe(false);
    expect(tessellationAngleCheck(8).tessellates).toBe(false);
    expect(tessellationAngleCheck(3).k).toBeCloseTo(6);
    expect(tessellationAngleCheck(5).k).toBeCloseTo(360 / 108);
  });

  it("uses C(n,4) for generic interior intersections", () => {
    expect(combinations(8, 4)).toBe(70);
    expect(genericDiagonalIntersections(5)).toBe(5);
    expect(genericDiagonalIntersections(6)).toBe(15);
  });
});

describe("polygon mode aliases", () => {
  it("accepts short ids and display names", () => {
    expect(parsePolygonMode(null)).toBe("regular");
    expect(parsePolygonMode("regular")).toBe("regular");
    expect(parsePolygonMode("Regular Polygon")).toBe("regular");
    expect(parsePolygonMode("Interior Angles")).toBe("angles");
    expect(parsePolygonMode("Tessellation")).toBe("tessellation");
    expect(parsePolygonMode("Area")).toBe("area");
    expect(parsePolygonMode("Diagonals")).toBe("diagonals");
    expect(polygonModeUrl("angles")).toBe("angles");
  });
});
