import { describe, expect, it } from "vitest";
import { calculateDisplayScale, parseGeometrySolidInput } from "./arGeometrySolids";

function solid(input: string) {
  const result = parseGeometrySolidInput(input);
  if (!result.ok) throw new Error(result.message);
  return result.solid;
}

describe("AR Math Lab geometry solids", () => {
  it("calculates cone values and AR meter dimensions", () => {
    const cone = solid("Cone radius 5 cm height 12 cm");

    expect(cone.solidType).toBe("cone");
    expect(cone.dimensions.radius.meters).toBeCloseTo(0.05);
    expect(cone.dimensions.height.meters).toBeCloseTo(0.12);
    expect(cone.calculatedValues.values.slantHeight).toBeCloseTo(13);
    expect(cone.calculatedValues.values.volume).toBeCloseTo(314.16, 1);
    expect(cone.calculatedValues.values.curvedSurfaceArea).toBeCloseTo(204.2, 1);
    expect(cone.calculatedValues.values.totalSurfaceArea).toBeCloseTo(282.74, 1);
  });

  it("calculates cylinder values", () => {
    const cylinder = solid("Cylinder radius 4 cm height 10 cm");

    expect(cylinder.solidType).toBe("cylinder");
    expect(cylinder.calculatedValues.values.volume).toBeCloseTo(502.65, 1);
    expect(cylinder.calculatedValues.values.curvedSurfaceArea).toBeCloseTo(251.33, 1);
    expect(cylinder.calculatedValues.values.totalSurfaceArea).toBeCloseTo(351.86, 1);
  });

  it("calculates cuboid and cube values", () => {
    const cuboid = solid("Cuboid length 10 cm width 6 cm height 4 cm");
    const cube = solid("Cube side 5 cm");

    expect(cuboid.calculatedValues.values.volume).toBe(240);
    expect(cuboid.calculatedValues.values.surfaceArea).toBe(248);
    expect(cube.calculatedValues.values.volume).toBe(125);
    expect(cube.calculatedValues.values.surfaceArea).toBe(150);
  });

  it("calculates sphere and hemisphere values", () => {
    const sphere = solid("Sphere radius 5 cm");
    const hemisphere = solid("Hemisphere radius 6 cm");

    expect(sphere.calculatedValues.values.volume).toBeCloseTo(523.6, 1);
    expect(sphere.calculatedValues.values.surfaceArea).toBeCloseTo(314.16, 1);
    expect(hemisphere.calculatedValues.values.volume).toBeCloseTo(452.39, 1);
    expect(hemisphere.calculatedValues.values.curvedSurfaceArea).toBeCloseTo(226.19, 1);
    expect(hemisphere.calculatedValues.values.totalSurfaceArea).toBeCloseTo(339.29, 1);
  });

  it("parses frustum, torus, prism, pyramid, and box inputs", () => {
    expect(solid("Frustum bottom radius 6 cm top radius 3 cm height 10 cm").solidType).toBe("frustum");
    expect(solid("Torus major radius 8 cm minor radius 2 cm").solidType).toBe("torus");
    expect(solid("Hexagonal prism side 3 cm height 12 cm").solidType).toBe("prism");
    expect(solid("Square pyramid base side 6 cm height 10 cm").solidType).toBe("pyramid");
    const box = solid("Box 10 cm by 6 cm by 4 cm");
    expect(box.solidType).toBe("cuboid");
    expect(box.dimensions.length.value).toBe(10);
    expect(box.dimensions.width.value).toBe(6);
    expect(box.dimensions.height.value).toBe(4);
  });

  it("validates missing and invalid dimensions", () => {
    const missing = parseGeometrySolidInput("Cone radius 5 cm");
    const invalid = parseGeometrySolidInput("Sphere radius -5 cm");

    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.message).toContain("height");
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) expect(invalid.message).toContain("greater than zero");
  });

  it("warns about default units and preserves scale modes", () => {
    const parsed = parseGeometrySolidInput("Cylinder radius 4 height 10");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.solid.unit).toBe("cm");
    expect(parsed.solid.warnings.join(" ")).toContain("No unit was detected");
    expect(calculateDisplayScale({ ...parsed.solid, displayScaleMode: "real-scale" })).toBe(1);
    expect(calculateDisplayScale({ ...parsed.solid, displayScaleMode: "miniature" })).toBeGreaterThan(1);
  });
});
