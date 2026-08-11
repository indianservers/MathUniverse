import { describe, expect, it } from "vitest";
import { analyzeFunction, analyzeSurfaceDifferential, buildTransformation, runGraphCasAction } from "./graphIntelligence";
import { defaultSimulationParameters, SIMULATION_MODELS, simulationSeries } from "./simulationEngine";
import { convertGraphUnit } from "./unitEngine";

describe("Graph Studio intelligence", () => {
  it("keeps symbolic CAS results exact and supplies steps", () => {
    const factor = runGraphCasAction("y = x^2-5*x+6", "factor");
    expect(factor?.result.replace(/\s/g, "")).toMatch(/\((-2\+x|x-2)\)\*\((-3\+x|x-3)\)/);
    expect(factor?.exact).toBe(factor?.result);
    expect(factor?.steps.length).toBeGreaterThan(2);
  });

  it("labels sampled function evidence as numerical or heuristic", () => {
    const findings = analyzeFunction("x^2", -5, 5);
    expect(findings.find((item) => item.label === "Symmetry")?.value).toContain("Even");
    expect(findings.find((item) => item.label === "Symmetry")?.status).toBe("numerical");
    expect(findings.find((item) => item.label === "Family")?.status).toBe("heuristic");
  });

  it("calculates a surface gradient, unit normal, and tangent plane", () => {
    const result = analyzeSurfaceDifferential("x^2+y^2", 1, 2);
    expect(result?.point.z).toBeCloseTo(5, 6);
    expect(result?.gradient.x).toBeCloseTo(2, 4);
    expect(result?.gradient.y).toBeCloseTo(4, 4);
    expect(Math.hypot(...(result?.normal ?? [0, 0, 0]))).toBeCloseTo(1, 6);
    expect(result?.steps).toHaveLength(5);
  });

  it("builds the reversible a f(b(x-h)) + k transformation", () => {
    expect(buildTransformation("x^2", 2, 3, 4, -1)).toContain("(x-(4))");
  });

  it("runs every advertised simulation with finite output", () => {
    expect(SIMULATION_MODELS).toHaveLength(20);
    SIMULATION_MODELS.forEach((model) => {
      const series = simulationSeries(model, defaultSimulationParameters(model), 40);
      expect(series).toHaveLength(40);
      expect(series.every((point) => Number.isFinite(point.value))).toBe(true);
    });
  });

  it("converts compatible units and blocks dimension mismatches", () => {
    expect(convertGraphUnit(1, "km", "m")).toMatchObject({ ok: true, value: 1000 });
    expect(convertGraphUnit(1, "m", "s")).toMatchObject({ ok: false });
  });
});
