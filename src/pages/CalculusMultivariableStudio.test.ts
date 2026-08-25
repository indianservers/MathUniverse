import { describe, expect, it } from "vitest";
import {
  analyzeSurface,
  parseSurfaceLayers,
} from "./CalculusMultivariableStudio";

describe("Multivariable Studio analysis", () => {
  it("computes the saddle surface value, partials, and gradient magnitude", () => {
    const result = analyzeSurface((x, y) => x * x - y * y, 0.25, 0.5);

    expect(result.z).toBeCloseTo(-0.1875, 8);
    expect(result.fx).toBeCloseTo(0.5, 6);
    expect(result.fy).toBeCloseTo(-1, 6);
    expect(result.magnitude).toBeCloseTo(Math.sqrt(1.25), 6);
    expect(result.fxx).toBeCloseTo(2, 4);
    expect(result.fyy).toBeCloseTo(-2, 4);
  });

  it("returns non-finite analysis when the surface is unavailable", () => {
    const result = analyzeSurface(null, 1, 1);
    expect(Number.isNaN(result.z)).toBe(true);
    expect(Number.isNaN(result.magnitude)).toBe(true);
  });

  it("restores valid comparison surfaces and visibility from the URL", () => {
    const layers = parseSurfaceLayers(
      JSON.stringify([
        { expression: "sin(x)+cos(y)", visible: true },
        { expression: "x*y", visible: false },
        { expression: "not valid(", visible: true },
      ]),
    );

    expect(layers).toHaveLength(2);
    expect(layers[0]).toMatchObject({
      expression: "sin(x)+cos(y)",
      visible: true,
    });
    expect(layers[1]).toMatchObject({ expression: "x*y", visible: false });
  });
});
