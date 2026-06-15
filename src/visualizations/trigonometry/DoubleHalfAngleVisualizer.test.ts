import { describe, expect, it } from "vitest";
import {
  degToRad,
  evaluateDoubleHalfFormula,
  formatDoubleHalfValue,
  nearZero,
  safeDivide,
  type DoubleHalfFormulaId,
} from "./DoubleHalfAngleVisualizer";

const COMMON_VALUES = [0, 15, 30, 45, 60, 90, 120, 135, 180, 270, 360];
const DEFINED_TAN_DOUBLE = [0, 15, 30, 60, 120, 180, 360];
const DEFINED_TAN_HALF_A = [0, 15, 30, 45, 60, 90, 120, 270, 360];
const DEFINED_TAN_HALF_B = [15, 30, 45, 60, 90, 120, 270];
const DEFINED_RADICAL = [0, 15, 30, 45, 60, 90, 120, 270, 360];

describe("DoubleHalfAngleVisualizer math helpers", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
  });

  it.each(["sin-double", "cos-double-basic", "cos-double-sin", "cos-double-cos"] as DoubleHalfFormulaId[])("%s direct and expanded values match", (formulaId) => {
    for (const theta of COMMON_VALUES) {
      const result = evaluateDoubleHalfFormula(formulaId, theta);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("matches tan double-angle where defined", () => {
    for (const theta of DEFINED_TAN_DOUBLE) {
      const result = evaluateDoubleHalfFormula("tan-double", theta);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("marks tan double-angle undefined at denominator and input breaks", () => {
    for (const theta of [45, 90, 135, 225, 270]) {
      const result = evaluateDoubleHalfFormula("tan-double", theta);
      expect(result.defined).toBe(false);
      expect(result.direct).toBeNull();
      expect(result.expanded).toBeNull();
    }
  });

  it.each(["sin-half-square", "cos-half-square"] as DoubleHalfFormulaId[])("%s direct and expanded values match", (formulaId) => {
    for (const theta of COMMON_VALUES) {
      const result = evaluateDoubleHalfFormula(formulaId, theta);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("matches tangent half-angle sine over one plus cosine where defined", () => {
    for (const theta of DEFINED_TAN_HALF_A) {
      const result = evaluateDoubleHalfFormula("tan-half-sin-over-one-plus-cos", theta);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("matches tangent half-angle one minus cosine over sine where defined", () => {
    for (const theta of DEFINED_TAN_HALF_B) {
      const result = evaluateDoubleHalfFormula("tan-half-one-minus-cos-over-sin", theta);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.matched).toBe(true);
    }
  });

  it("marks tangent half-angle forms undefined at denominator breaks", () => {
    expect(evaluateDoubleHalfFormula("tan-half-sin-over-one-plus-cos", 180).defined).toBe(false);
    expect(evaluateDoubleHalfFormula("tan-half-one-minus-cos-over-sin", 0).defined).toBe(false);
    expect(evaluateDoubleHalfFormula("tan-half-one-minus-cos-over-sin", 180).defined).toBe(false);
    expect(evaluateDoubleHalfFormula("tan-half-one-minus-cos-over-sin", 360).defined).toBe(false);
  });

  it("matches radical tangent half-angle with sign note where defined", () => {
    for (const theta of DEFINED_RADICAL) {
      const result = evaluateDoubleHalfFormula("tan-half-radical", theta);
      expect(result.defined).toBe(true);
      expect(result.direct).toBeCloseTo(result.expanded!);
      expect(result.signNote).toBeTruthy();
    }
    const negative = evaluateDoubleHalfFormula("tan-half-radical", 270);
    expect(negative.signNote).toContain("negative");
  });

  it("does not format NaN or Infinity", () => {
    expect(safeDivide(1, 0)).toBeNull();
    expect(safeDivide(1, Number.NaN)).toBeNull();
    expect(nearZero(0)).toBe(true);
    expect(formatDoubleHalfValue(null)).toBe("undefined");
    expect(formatDoubleHalfValue(Number.NaN)).toBe("undefined");
    expect(formatDoubleHalfValue(Number.POSITIVE_INFINITY)).toBe("undefined");
  });
});
