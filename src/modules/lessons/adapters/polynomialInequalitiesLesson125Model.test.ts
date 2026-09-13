import { describe, expect, it } from "vitest";
import {
  POLYNOMIAL_EXAMPLES_125,
  evaluatePolynomial125,
  solvePolynomialInequality125,
} from "./polynomialInequalitiesLesson125Model";

describe("polynomialInequalitiesLesson125Model", () => {
  it("solves the target cubic from four numerical interval tests", () => {
    const example = POLYNOMIAL_EXAMPLES_125[0];
    const result = solvePolynomialInequality125(
      example.roots,
      example.leading,
      example.relation,
    );
    expect(result.tests).toEqual([-3, -0.5, 2, 4]);
    expect(result.evaluations).toEqual([-24, 7.875, -4, 18]);
    expect(result.passes).toEqual([false, true, false, true]);
    expect(result.interval).toBe("[-2, 1] ∪ [3, ∞)");
  });

  it("keeps the sign unchanged across an even-multiplicity root", () => {
    const example = POLYNOMIAL_EXAMPLES_125[1];
    const result = solvePolynomialInequality125(
      example.roots,
      example.leading,
      example.relation,
    );
    expect(result.degree).toBe(3);
    expect(result.evaluations).toEqual([-16, 3.375, 4]);
    expect(result.passes).toEqual([true, false, false]);
    expect(result.interval).toBe("(−∞, -1)");
  });

  it("retains an inclusive repeated root as an isolated solution", () => {
    const result = solvePolynomialInequality125(
      [
        { id: 0, value: -2, multiplicity: 1 },
        { id: 1, value: 1, multiplicity: 2 },
        { id: 2, value: 3, multiplicity: 1 },
      ],
      1,
      ">=",
    );
    expect(result.interval).toBe("(−∞, -2] ∪ {1} ∪ [3, ∞)");
  });

  it("combines coincident roots before building sign intervals", () => {
    const result = solvePolynomialInequality125(
      [
        { id: 0, value: 2, multiplicity: 1 },
        { id: 1, value: 2, multiplicity: 1 },
      ],
      1,
      "<",
    );
    expect(result.grouped).toEqual([{ value: 2, multiplicity: 2 }]);
    expect(result.tests).toEqual([1, 3]);
    expect(result.interval).toBe("∅");
  });

  it("evaluates the negative-leading worked example numerically", () => {
    const example = POLYNOMIAL_EXAMPLES_125[2];
    expect(
      evaluatePolynomial125(
        example.roots,
        example.leading,
        example.testPoint,
      ),
    ).toBe(10);
    expect(
      solvePolynomialInequality125(
        example.roots,
        example.leading,
        example.relation,
      ).interval,
    ).toBe("[-3, 1] ∪ [4, ∞)");
  });
});
