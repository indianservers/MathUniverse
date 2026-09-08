import { describe, expect, it } from "vitest";
import {
  findCriticalPoints,
  normalizeImplicitEquation,
  sampleAdaptiveExplicitSurface,
  sampleImplicitSurface,
  sampleParametricCurve,
  sampleParametricSurface,
  sampleVectorField,
  volumeBetweenSurfaces,
} from "./graph3dAdvanced";

describe("advanced 3D graph sampling", () => {
  it("normalizes and meshes an implicit sphere", () => {
    expect(normalizeImplicitEquation("x^2+y^2+z^2=9")).toBe("(x^2+y^2+z^2)-(9)");
    const mesh = sampleImplicitSurface("x^2+y^2+z^2=9", 3.5, 18);
    expect(mesh.error).toBeUndefined();
    expect(mesh.indices.length).toBeGreaterThan(300);
    expect(mesh.minZ).toBeLessThan(-2.5);
    expect(mesh.maxZ).toBeGreaterThan(2.5);
  });

  it("samples parametric surfaces and space curves", () => {
    const surface = sampleParametricSurface(
      { x: "(2+0.5*cos(v))*cos(u)", y: "(2+0.5*cos(v))*sin(u)", z: "0.5*sin(v)" },
      { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2 },
      18,
    );
    const curve = sampleParametricCurve({ x: "cos(t)", y: "sin(t)", z: "t/4" }, 0, Math.PI * 4, 120);
    expect(surface.error).toBeUndefined();
    expect(surface.indices.length).toBeGreaterThan(500);
    expect(curve.error).toBeUndefined();
    expect(curve.points).toHaveLength(120);
  });

  it("refines curved explicit regions and classifies critical points", () => {
    const mesh = sampleAdaptiveExplicitSurface("sin(4*x)*cos(4*y)", 2, 2, 10, 2);
    const critical = findCriticalPoints("x^2-y^2", 2, 2, 41);
    expect(mesh.adaptiveCells).toBeGreaterThan(100);
    expect(critical.some((point) => point.kind === "saddle" && Math.hypot(point.x, point.y) < 0.25)).toBe(true);
  });

  it("integrates bounded volume and produces vector streamlines", () => {
    const volume = volumeBetweenSurfaces("1", "0", 2, 3, 40);
    const field = sampleVectorField({ x: "-y", y: "x", z: "0" }, 2, 4, true);
    expect(volume.absolute).toBeCloseTo(24, 1);
    expect(field.vectors.length).toBeGreaterThan(20);
    expect(field.streamlines.some((line) => line.length > 5)).toBe(true);
  });
});
