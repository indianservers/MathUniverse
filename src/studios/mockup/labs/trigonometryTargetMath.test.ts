import { describe, expect, it } from "vitest";
import {
  composeWaves,
  inversePrincipal,
  solveObliqueSas,
  solveSsaAmbiguous,
  transformedTrig,
} from "./trigonometryTargetMath";

describe("trigonometry target math", () => {
  it("solves a valid SAS oblique triangle and preserves its invariants", () => {
    const result = solveObliqueSas(7.8, 10.5, 69.7);

    expect(result.valid).toBe(true);
    expect(result.A + result.B + result.C).toBeCloseTo(180, 8);
    expect(result.area).toBeCloseTo(0.5 * 7.8 * 10.5 * Math.sin(69.7 * Math.PI / 180), 8);
    expect(result.circumradius).toBeGreaterThan(0);
  });

  it("keeps inverse functions on their principal branches", () => {
    expect(inversePrincipal("Arcsin", 0.6)).toBeCloseTo(Math.asin(0.6), 10);
    expect(inversePrincipal("Arccos", 0.6)).toBeGreaterThanOrEqual(0);
    expect(inversePrincipal("Arccos", 0.6)).toBeLessThanOrEqual(Math.PI);
    expect(inversePrincipal("Arctan", 10)).toBeLessThan(Math.PI / 2);
  });

  it("evaluates ABCD transformations using phase shift form", () => {
    expect(transformedTrig("Sine", Math.PI / 6, 2, 1.5, Math.PI / 6, 0.5)).toBeCloseTo(0.5, 10);
    expect(transformedTrig("Cosine", 0, 3, 1, 0, -1)).toBeCloseTo(2, 10);
  });

  it("classifies the SSA ambiguous case and returns both triangles when they exist", () => {
    const two = solveSsaAmbiguous(8, 12, 30);
    expect(two.count).toBe(2);
    expect(two.acute).not.toBeNull();
    expect(two.obtuse).not.toBeNull();
    expect((two.acute?.B ?? 0) + (two.acute?.C ?? 0) + 30).toBeCloseTo(180, 6);
    expect((two.obtuse?.B ?? 0) + (two.obtuse?.C ?? 0) + 30).toBeCloseTo(180, 6);

    const none = solveSsaAmbiguous(4, 12, 30);
    expect(none.count).toBe(0);

    const right = solveSsaAmbiguous(6, 12, 30);
    expect(right.count).toBe(1);
    expect(right.acute?.B).toBeCloseTo(90, 5);
  });

  it("returns source values, resultant, and beat frequency", () => {
    const value = composeWaves(
      0.25,
      { amplitude: 1, frequency: 2, phase: 0, shift: 0 },
      { amplitude: 0.7, frequency: 3, phase: Math.PI / 4, shift: 0 },
    );

    expect(value.resultant).toBeCloseTo(value.y1 + value.y2, 10);
    expect(value.beatFrequency).toBe(1);
  });
});
