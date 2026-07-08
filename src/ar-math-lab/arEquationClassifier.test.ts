import { describe, expect, it } from "vitest";
import { classifyEquationInput } from "./arEquationClassifier";
import { convertToMeters } from "./arUnits";

describe("AR Math Lab equation classifier", () => {
  it("classifies explicit surfaces", () => {
    const result = classifyEquationInput("z = sin(x) * sin(y)");

    expect(result.type).toBe("explicit_surface");
    expect(result.variables).toEqual(["x", "y", "z"]);
    expect(result.recommendedMode).toBe("3d-preview");
  });

  it("classifies parametric curves", () => {
    const result = classifyEquationInput("x = cos(t), y = sin(t), z = t");

    expect(result.type).toBe("parametric_curve");
    expect(result.variables).toEqual(["t", "x", "y", "z"]);
  });

  it("recognizes supported implicit surfaces as predefined shapes", () => {
    const result = classifyEquationInput("x^2 + y^2 + z^2 = 9");

    expect(result.type).toBe("recognized_implicit_shape");
    expect(result.suggestedRenderer).toBe("predefined_sphere");
    expect(result.suggestedParameters).toEqual({ r: 3 });
    expect(result.confidence).toBe("high");
  });

  it("classifies geometry solids with real-world dimensions", () => {
    const result = classifyEquationInput("Cylinder radius 4 cm height 10 cm");

    expect(result.type).toBe("geometry_solid");
    expect(result.objectName).toBe("cylinder");
    expect(result.solidType).toBe("cylinder");
    expect(result.solidDimensions?.radius).toEqual({ value: 4, unit: "cm", meters: 0.04 });
    expect(result.solidDimensions?.height).toEqual({ value: 10, unit: "cm", meters: 0.1 });
    expect(result.solidDimensions?.diameter).toEqual({ value: 8, unit: "cm", meters: 0.08 });
  });

  it("returns helpful unknown input results", () => {
    const result = classifyEquationInput("make something beautiful");

    expect(result.type).toBe("unknown");
    expect(result.message).toContain("Try z = f(x, y)");
  });
});

describe("AR Math Lab unit conversion", () => {
  it("converts supported units to meters", () => {
    expect(convertToMeters(10, "mm")).toBe(0.01);
    expect(convertToMeters(12, "cm")).toBe(0.12);
    expect(convertToMeters(2, "m")).toBe(2);
    expect(convertToMeters(10, "inch")).toBeCloseTo(0.254);
    expect(convertToMeters(3, "ft")).toBeCloseTo(0.9144);
  });
});
