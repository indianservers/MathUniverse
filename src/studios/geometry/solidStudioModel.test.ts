import { describe, expect, it } from "vitest";
import { solidStudioProperties } from "./solidStudioModel";

describe("Geometry Studio solid measurements", () => {
  it("uses tetrahedron geometry instead of cube formulas", () => {
    const solid = solidStudioProperties("tetrahedron", 4, 99);
    expect(solid.volume).toBeCloseTo(64 / (6 * Math.sqrt(2)));
    expect(solid.surfaceArea).toBeCloseTo(16 * Math.sqrt(3));
    expect([solid.faces, solid.edges, solid.vertices]).toEqual([4, 6, 4]);
  });
  it("uses the triangular base and responds to prism height", () => {
    const low = solidStudioProperties("prism", 4, 2), high = solidStudioProperties("prism", 4, 6);
    expect(high.volume).toBeCloseTo(3 * low.volume);
    expect(high.surfaceArea - low.surfaceArea).toBeCloseTo(3 * 4 * 4);
    expect([high.faces, high.edges, high.vertices]).toEqual([5, 9, 6]);
  });
  it("uses square-pyramid volume and slant heights", () => {
    const solid = solidStudioProperties("pyramid", 6, 4);
    expect(solid.volume).toBe(48);
    expect(solid.surfaceArea).toBe(96);
  });
  it("interprets round-solid size consistently as diameter", () => {
    expect(solidStudioProperties("cylinder", 4, 3).volume).toBeCloseTo(12 * Math.PI);
    expect(solidStudioProperties("cone", 4, 3).volume).toBeCloseTo(4 * Math.PI);
    expect(solidStudioProperties("sphere", 4, 3).volume).toBeCloseTo(32 * Math.PI / 3);
  });
});
