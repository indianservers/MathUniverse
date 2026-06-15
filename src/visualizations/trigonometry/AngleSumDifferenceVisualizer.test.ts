import { describe, expect, it } from "vitest";
import {
  degToRad,
  evaluateAngleFormula,
  formatAngleFormulaValue,
  nearZero,
  safeDivide,
  type AngleSumDifferenceFormulaId,
} from "./AngleSumDifferenceVisualizer";

const COMMON_VALUES: Array<[number, number]> = [
  [30, 45],
  [60, 30],
  [90, 45],
  [45, 45],
  [120, 30],
];

describe("AngleSumDifferenceVisualizer math helpers", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(45)).toBeCloseTo(Math.PI / 4);
  });

  it.each(["sin-add", "sin-sub", "cos-add", "cos-sub"] as AngleSumDifferenceFormulaId[])("%s direct and expanded values match", (formulaId) => {
    for (const [a, b] of COMMON_VALUES) {
      const result = evaluateAngleFormula(formulaId, a, b);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("matches tan(A+B) where defined", () => {
    for (const [a, b] of [[30, 45], [20, 30], [120, 30]]) {
      const result = evaluateAngleFormula("tan-add", a, b);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("matches tan(A-B) where defined", () => {
    for (const [a, b] of [[30, 45], [60, 30], [80, 45], [120, 20]]) {
      const result = evaluateAngleFormula("tan-sub", a, b);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("marks tangent formulas undefined at denominator breaks", () => {
    const addBreak = evaluateAngleFormula("tan-add", 45, 45);
    const subBreak = evaluateAngleFormula("tan-sub", 45, -45);
    const subFinalAngleBreak = evaluateAngleFormula("tan-sub", 120, 30);
    const inputBreak = evaluateAngleFormula("tan-add", 90, 30);

    expect(addBreak.defined).toBe(false);
    expect(addBreak.direct).toBeNull();
    expect(addBreak.expanded).toBeNull();
    expect(subBreak.defined).toBe(false);
    expect(subFinalAngleBreak.defined).toBe(false);
    expect(inputBreak.defined).toBe(false);
  });

  it("never formats NaN or Infinity", () => {
    expect(safeDivide(1, 0)).toBeNull();
    expect(safeDivide(1, Number.NaN)).toBeNull();
    expect(nearZero(0)).toBe(true);
    expect(formatAngleFormulaValue(null)).toBe("undefined");
    expect(formatAngleFormulaValue(Number.NaN)).toBe("undefined");
    expect(formatAngleFormulaValue(Number.POSITIVE_INFINITY)).toBe("undefined");
  });

  it("uses null for undefined tangent helper output", () => {
    const result = evaluateAngleFormula("tan-add", 45, 45);

    expect(result.direct).toBeNull();
    expect(result.expanded).toBeNull();
    expect(result.difference).toBeNull();
    expect(result.reason).toContain("undefined");
  });
});
