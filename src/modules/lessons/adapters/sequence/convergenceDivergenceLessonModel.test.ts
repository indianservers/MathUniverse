import { describe, expect, it } from "vitest";
import {
  convergenceDivergenceAnalysis,
  geometricComparisonPartials,
} from "./convergenceDivergenceLessonModel";

const geometric = (ratio: number, first = 4) =>
  convergenceDivergenceAnalysis({
    type: "Geometric",
    first,
    ratio,
    power: 2,
    scale: 1,
    shift: 0,
  });

describe("convergence and divergence model", () => {
  it("computes the target convergent geometric series", () => {
    const result = geometric(0.5);
    expect(result.terms.slice(0, 5)).toEqual([4, 2, 1, 0.5, 0.25]);
    expect(result.partials.slice(0, 5)).toEqual([4, 6, 7, 7.5, 7.75]);
    expect(result.nthLimit).toBe(0);
    expect(result.ratioLimit).toBe(0.5);
    expect(result.infiniteSum).toBe(8);
    expect(result.convergent).toBe(true);
    expect(result.absolute).toBe(true);
  });

  it("distinguishes divergent geometric term limits", () => {
    expect(geometric(1).nthLimit).toBe(4);
    expect(geometric(-1).nthLimit).toBeNull();
    expect(geometric(1.5).nthLimit).toBe(Infinity);
    expect(geometric(-1.5).nthLimit).toBeNull();
    expect(geometric(-1).convergent).toBe(false);
  });

  it("classifies p-series and alternating series", () => {
    const pSeries = convergenceDivergenceAnalysis({
        type: "p-Series",
        first: 1,
        ratio: 0,
        power: 0.8,
        scale: 1,
        shift: 0,
      }),
      alternating = convergenceDivergenceAnalysis({
        type: "Alternating",
        first: 1,
        ratio: 0,
        power: 0.8,
        scale: 1,
        shift: 0,
      });
    expect(pSeries.convergent).toBe(false);
    expect(alternating.convergent).toBe(true);
    expect(alternating.absolute).toBe(false);
  });

  it("keeps custom denominators real and finite", () => {
    const result = convergenceDivergenceAnalysis({
      type: "Custom",
      first: 1,
      ratio: 0,
      power: 2,
      scale: 1,
      shift: -100,
    });
    expect(result.parameters.shift).toBe(-0.9);
    expect(result.terms.every(Number.isFinite)).toBe(true);
    expect(geometricComparisonPartials(1.5)).toHaveLength(16);
  });
});
