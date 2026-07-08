import { describe, expect, it } from "vitest";
import { defaultGraphSettings, generateARGraphObject, generateExplicitSurfaceMesh, generateParametricCurve, generateParametricSurfaceMesh, parameterSliderSpecs } from "./arGraphGenerator";

describe("AR Math Lab graph generator", () => {
  it("generates an explicit surface mesh without using unsafe evaluation", () => {
    const mesh = generateExplicitSurfaceMesh({
      expression: "sin(x) * sin(y)",
      xRange: [-2, 2],
      yRange: [-2, 2],
      resolutionX: 16,
      resolutionY: 16,
      parameters: {},
      zScale: "auto",
    });

    expect(mesh.kind).toBe("surface");
    expect(mesh.vertices.length).toBe(16 * 16 * 3);
    expect(mesh.indices.length).toBeGreaterThan(0);
    expect(mesh.valueStats.invalidPointCount).toBe(0);
  });

  it("generates a parametric curve from x(t), y(t), z(t)", () => {
    const curve = generateParametricCurve({
      xExpression: "cos(t)",
      yExpression: "sin(t)",
      zExpression: "t",
      tRange: [0, Math.PI * 2],
      samples: 80,
      parameters: {},
    });

    expect(curve.kind).toBe("curve");
    expect(curve.points.length).toBe(80);
    expect(curve.valueStats.invalidPointCount).toBe(0);
  });

  it("generates a parametric surface from x(u,v), y(u,v), z(u,v)", () => {
    const surface = generateParametricSurfaceMesh({
      xExpression: "(R + r * cos(v)) * cos(u)",
      yExpression: "(R + r * cos(v)) * sin(u)",
      zExpression: "r * sin(v)",
      uRange: [0, Math.PI * 2],
      vRange: [0, Math.PI * 2],
      resolutionU: 20,
      resolutionV: 12,
      parameters: { R: 2, r: 0.45 },
    });

    expect(surface.kind).toBe("surface");
    expect(surface.vertices.length).toBe(20 * 12 * 3);
    expect(surface.indices.length).toBeGreaterThan(0);
  });

  it("generates recognized implicit shapes through predefined renderers", () => {
    const graph = generateARGraphObject("x^2 + y^2 + z^2 = 9", defaultGraphSettings, {});

    expect(graph.type).toBe("recognized_implicit_shape");
    expect(graph.classification.suggestedRenderer).toBe("predefined_sphere");
    expect(graph.geometry.kind).toBe("surface");
    expect(graph.parameterValues.r).toBe(3);
  });

  it("creates parameter slider specs for adjustable equations", () => {
    const specs = parameterSliderSpecs(["a", "k", "R"]);

    expect(specs.map((spec) => spec.key)).toEqual(["a", "k", "R"]);
    expect(specs.find((spec) => spec.key === "k")?.min).toBeGreaterThan(0);
  });

  it("rejects unsupported implicit equations with a helpful error", () => {
    expect(() => generateARGraphObject("x^2 + y^2 + z = 4", defaultGraphSettings, {})).toThrow(/not yet supported/i);
  });

  it.each([
    "alert(1)",
    "window.location",
    "document.cookie",
    "constructor.constructor",
    "while(true){}",
    "import something",
    "process.env",
    "x + + y",
  ])("rejects dangerous or invalid expression %s", (expression) => {
    expect(() => generateExplicitSurfaceMesh({
      expression,
      xRange: [-1, 1],
      yRange: [-1, 1],
      resolutionX: 8,
      resolutionY: 8,
      parameters: {},
      zScale: "auto",
    })).toThrow();
  });
});
