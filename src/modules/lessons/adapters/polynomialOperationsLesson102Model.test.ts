import { describe, expect, it } from "vitest";
import {
  calculatePolynomial102,
  formatPolynomial102,
  INITIAL_POLYNOMIAL_A_102,
  INITIAL_POLYNOMIAL_B_102,
  isPolynomialPracticeCorrect102,
  operationValues102,
  parsePolynomialTile102,
} from "./polynomialOperationsLesson102Model";

describe("polynomialOperationsLesson102Model", () => {
  it("adds, subtracts, and multiplies coefficient maps", () => {
    expect(
      formatPolynomial102(
        calculatePolynomial102(
          INITIAL_POLYNOMIAL_A_102,
          INITIAL_POLYNOMIAL_B_102,
          "add",
        ),
      ),
    ).toBe("x² + 5x + 5");
    expect(
      formatPolynomial102(
        calculatePolynomial102(
          INITIAL_POLYNOMIAL_A_102,
          INITIAL_POLYNOMIAL_B_102,
          "subtract",
        ),
      ),
    ).toBe("x² + x − 1");
    expect(
      formatPolynomial102(
        calculatePolynomial102(
          INITIAL_POLYNOMIAL_A_102,
          INITIAL_POLYNOMIAL_B_102,
          "multiply",
        ),
      ),
    ).toBe("2x³ + 9x² + 13x + 6");
  });

  it("verifies the target addition by substitution", () => {
    expect(
      operationValues102(
        INITIAL_POLYNOMIAL_A_102,
        INITIAL_POLYNOMIAL_B_102,
        "add",
        1,
      ),
    ).toMatchObject({ left: 11, right: 11, equal: true });
  });

  it("grades coefficients and safely parses tile payloads", () => {
    expect(isPolynomialPracticeCorrect102([5, 6, 3], [5, 6, 3])).toBe(true);
    expect(isPolynomialPracticeCorrect102([5, 5, 3], [5, 6, 3])).toBe(false);
    expect(
      parsePolynomialTile102(
        '{"id":"A-2","row":"A","degree":2,"coefficient":1}',
      ),
    ).toMatchObject({ id: "A-2", degree: 2 });
    expect(parsePolynomialTile102("not-json")).toBeNull();
  });
});
