import { describe, expect, it } from "vitest";
import {
  evaluateRemainderPolynomial104,
  formatRemainderPolynomial104,
  isRemainderPracticeCorrect104,
  isRemainderValueDrop104,
  parseRemainderDivisor104,
  parseRemainderPolynomial104,
  remainderMethodsAgree104,
  remainderReconstructionMatches104,
  syntheticRemainderDivision104,
} from "./remainderTheoremLesson104Model";

describe("remainderTheoremLesson104Model", () => {
  it("proves the target example by evaluation, division, and reconstruction", () => {
    const polynomial = parseRemainderPolynomial104("x² + 3x + 2");
    const divisor = parseRemainderDivisor104("x − 1");
    const division = syntheticRemainderDivision104(
      polynomial.coefficients,
      divisor.root,
    );
    const evaluated = evaluateRemainderPolynomial104(
      polynomial.coefficients,
      divisor.root,
    );

    expect(polynomial).toEqual({ coefficients: [1, 3, 2], valid: true });
    expect(divisor).toEqual({ valid: true, root: 1 });
    expect(division).toEqual({
      products: [0, 1, 4],
      sums: [1, 4, 6],
      quotient: [1, 4],
      remainder: 6,
    });
    expect(evaluated).toBe(6);
    expect(formatRemainderPolynomial104(division.quotient)).toBe("x + 4");
    expect(
      remainderMethodsAgree104(
        polynomial,
        divisor,
        divisor.root,
        evaluated,
        division.remainder,
      ),
    ).toBe(true);
    expect(
      remainderReconstructionMatches104(
        polynomial.coefficients,
        divisor.root,
        division.quotient,
        division.remainder,
      ),
    ).toBe(true);
  });

  it("handles missing powers and rejects invalid theorem inputs", () => {
    expect(parseRemainderPolynomial104("x³ − 4x + 3")).toEqual({
      coefficients: [1, 0, -4, 3],
      valid: true,
    });
    expect(parseRemainderPolynomial104("x / 2").valid).toBe(false);
    expect(parseRemainderDivisor104("x + 2")).toEqual({
      valid: true,
      root: -2,
    });
    expect(parseRemainderDivisor104("x² + 1").valid).toBe(false);
  });

  it("grades practice from both methods and validates the dragged value", () => {
    const polynomial = parseRemainderPolynomial104("x² − 4x + 1");
    const divisor = parseRemainderDivisor104("x − 2");
    const division = syntheticRemainderDivision104(
      polynomial.coefficients,
      divisor.root,
    );
    const evaluated = evaluateRemainderPolynomial104(
      polynomial.coefficients,
      2,
    );

    expect(
      isRemainderPracticeCorrect104(
        polynomial,
        divisor,
        2,
        evaluated,
        division.remainder,
        -3,
      ),
    ).toBe(true);
    expect(
      isRemainderPracticeCorrect104(
        polynomial,
        divisor,
        -2,
        13,
        division.remainder,
        -3,
      ),
    ).toBe(false);
    expect(isRemainderValueDrop104("2", 2)).toBe(true);
    expect(isRemainderValueDrop104("", 0)).toBe(false);
  });
});
