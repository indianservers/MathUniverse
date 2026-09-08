import { describe, expect, it } from "vitest";
import {
  evaluateTaylorPolynomial,
  taylorCoefficient,
  taylorMaclaurinAnalysis,
} from "./taylorMaclaurinLessonModel";

describe("Taylor and Maclaurin model", () => {
  it("computes the target fourth-order exponential polynomial", () => {
    const result = taylorMaclaurinAnalysis({
      fn: "e^x",
      center: 0,
      order: 4,
      shownOrder: 4,
      low: -3,
      high: 3,
    });
    expect(result.coefficients).toEqual([1, 1, 0.5, 0.1666667, 0.0416667]);
    expect(result.expanded).toBe(" 1 + x + 1/2x^2 + 1/6x^3 + 1/24x^4");
    expect(result.maxError).toBeCloseTo(Math.exp(3) - 16.375, 5);
    expect(result.valid).toBe(true);
  });

  it("evaluates Taylor polynomials around a nonzero center", () => {
    expect(evaluateTaylorPolynomial([2, 3, 4], 1, 2, 3)).toBe(24);
    expect(taylorCoefficient("sin x", 0, 1)).toBe(1);
    expect(taylorCoefficient("cos x", 0, 2)).toBe(-0.5);
  });

  it("rejects singular expansion centers and invalid intervals", () => {
    expect(
      taylorMaclaurinAnalysis({
        fn: "ln(1+x)",
        center: -1,
        order: 4,
        shownOrder: 4,
        low: -0.5,
        high: 2,
      }).valid,
    ).toBe(false);
    expect(
      taylorMaclaurinAnalysis({
        fn: "e^x",
        center: 0,
        order: 4,
        shownOrder: 4,
        low: 3,
        high: -3,
      }).samples,
    ).toEqual([]);
  });

  it("keeps shown order within the calculated coefficient range", () => {
    const result = taylorMaclaurinAnalysis({
      fn: "cos x",
      center: 0,
      order: 3,
      shownOrder: 20,
      low: -1,
      high: 1,
    });
    expect(result.shownOrder).toBe(3);
    expect(result.coefficients).toHaveLength(4);
  });
});
