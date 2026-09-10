import { describe, expect, it } from "vitest";
import {
  POLYNOMIAL_EXAMPLES_115,
  POLYNOMIAL_PRACTICES_115,
  coefficientsFromRoots115,
  evaluatePolynomialRoots115,
  isPolynomialPracticeCorrect115,
  polynomialExpandedText115,
  polynomialFromRootMove115,
  polynomialRootChecks115,
} from "./polynomialEquationsLesson115Model";

describe("polynomialEquationsLesson115Model", () => {
  it("matches the target cubic expansion", () => {
    const roots = POLYNOMIAL_EXAMPLES_115[0];
    expect(coefficientsFromRoots115(roots)).toEqual({
      cubic: 1,
      square: -6,
      linear: 11,
      constant: -6,
    });
    expect(polynomialExpandedText115(roots)).toBe("x³ − 6x² + 11x − 6 = 0");
    expect(polynomialRootChecks115(roots)).toEqual([0, 0, 0]);
  });

  it("evaluates arbitrary test values from the factor product", () => {
    expect(evaluatePolynomialRoots115([1, 2, 3], 2)).toBe(0);
    expect(evaluatePolynomialRoots115([1, 2, 3], 4)).toBe(6);
  });

  it("rebuilds coefficients after pointer root movement", () => {
    const roots = polynomialFromRootMove115([1, 2, 3], 1, -2);
    expect(roots).toEqual([1, -2, 3]);
    expect(coefficientsFromRoots115(roots)).toEqual({
      cubic: 1,
      square: -2,
      linear: -5,
      constant: 6,
    });
  });

  it("grades the complete practice root set in any order", () => {
    const practice = POLYNOMIAL_PRACTICES_115[0];
    expect(isPolynomialPracticeCorrect115(practice, [4, -1, 2])).toBe(true);
    expect(isPolynomialPracticeCorrect115(practice, [-1, 2, 2])).toBe(false);
  });
});
