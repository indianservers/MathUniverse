import { describe, expect, it } from "vitest";
import {
  cauchyIndicial,
  cauchyValue,
  characteristic,
  classifySystem,
  homogeneousValue,
  linearResidual,
  newtonHalfLife,
  newtonTemperature,
  newtonTimeTo,
  oscillatorSample,
  secondOrderConstants,
  trajectory,
  undeterminedPresets,
  variationPresets,
} from "./engineeringMath";

describe("higher-order and engineering ODE math", () => {
  it("classifies characteristic roots and matches the initial-value solution", () => {
    const distinct = characteristic(1, -3, 2);
    expect(distinct.kind).toBe("distinct");
    expect(distinct.r1).toBeCloseTo(2);
    expect(distinct.r2).toBeCloseTo(1);
    expect(homogeneousValue(1, -3, 2, 1, 2, 0)).toBeCloseTo(1);

    const repeated = characteristic(1, -2, 1);
    expect(repeated.kind).toBe("repeated");
    expect(repeated.r1).toBeCloseTo(1);
    const constants = secondOrderConstants(1, -2, 1, 1, 3);
    expect(constants).toEqual({ c1: 1, c2: 2 });

    const complex = characteristic(1, 0, 1);
    expect(complex.kind).toBe("complex");
    expect(complex.alpha).toBeCloseTo(0);
    expect(complex.beta).toBeCloseTo(1);
    expect(homogeneousValue(1, 0, 1, 1, 0, Math.PI / 2)).toBeCloseTo(0, 5);
  });

  it("checks undetermined-coefficient particulars against the differential equation", () => {
    const forcing = {
      exp: (x: number) => Math.exp(x),
      cos: (x: number) => Math.cos(x),
      poly: (x: number) => x * x,
      sin: (x: number) => Math.sin(2 * x),
    };
    undeterminedPresets.forEach((preset) => {
      expect(preset.resonance).toBe(preset.id !== "poly");
      expect(Math.abs(linearResidual(preset.a, preset.b, preset.c, preset.particular, forcing[preset.id as keyof typeof forcing], 0.4))).toBeLessThan(1e-4);
    });
  });

  it("checks variation-of-parameters particulars and a constant Wronskian", () => {
    const sec = variationPresets[0];
    expect(sec.wronskianValue(0.2)).toBeCloseTo(1);
    const exp = variationPresets[1];
    expect(Math.abs(linearResidual(1, 0, -1, exp.particular, (x) => Math.exp(2 * x), 0.3))).toBeLessThan(1e-4);
  });

  it("solves the Cauchy–Euler indicial equation", () => {
    const repeated = cauchyIndicial(1, -3, 4);
    expect(repeated.kind).toBe("repeated");
    expect(repeated.r1).toBeCloseTo(2);
    expect(cauchyValue(1, -3, 4, 1, 0, 2)).toBeCloseTo(4);
    const distinct = cauchyIndicial(1, 1, -1);
    expect(distinct.r1).toBeCloseTo(1);
    expect(distinct.r2).toBeCloseTo(-1);
    expect(cauchyValue(1, 1, -1, 1, 1, 2)).toBeCloseTo(2.5);
    const complex = cauchyIndicial(1, 1, 1);
    expect(complex.kind).toBe("complex");
    expect(complex.beta).toBeCloseTo(1);
    expect(cauchyValue(1, 1, 1, 1, 0, 1)).toBeCloseTo(1);
    expect(Number.isFinite(cauchyValue(1, 1, 1, 1, 0, -1))).toBe(false);
  });

  it("classifies linear systems and keeps a center on a circle", () => {
    expect(classifySystem(-2, 0, 0, -1).label).toBe("stable node");
    expect(classifySystem(1, 0, 0, -1).label).toBe("saddle");
    expect(classifySystem(0, 1, -1, 0).label).toBe("center");
    expect(classifySystem(-1, -1, 1, -1).label).toBe("stable spiral");
    expect(classifySystem(1, 0, 0, 0).label).toBe("degenerate");
    const orbit = trajectory(0, 1, -1, 0, 1, 0, 40, 0.05);
    const radii = orbit.map((point) => Math.hypot(point.x, point.y));
    expect(Math.max(...radii) - Math.min(...radii)).toBeLessThan(0.05);
  });

  it("matches oscillator initial conditions, damping regimes, and Newton cooling", () => {
    const under = oscillatorSample(1, 0.2, 4, 1, 0, 0);
    expect(under.kind).toBe("underdamped");
    expect(under.x).toBeCloseTo(1);
    expect(under.v).toBeCloseTo(0, 5);
    expect(under.omega).toBeCloseTo(2);
    expect(under.zeta).toBeCloseTo(0.05);
    expect(oscillatorSample(1, 4, 4, 1, 0, 0).kind).toBe("critical");
    expect(oscillatorSample(1, 6, 4, 1, -1, 0.2).kind).toBe("overdamped");
    expect(newtonTemperature(100, 20, Math.log(2), 1)).toBeCloseTo(60);
    expect(newtonHalfLife(Math.log(2))).toBeCloseTo(1);
    expect(newtonTimeTo(100, 20, Math.log(2), 60)).toBeCloseTo(1);
  });
});
