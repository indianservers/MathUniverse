import { describe, expect, it } from "vitest";
import {
  candidateFactorText105,
  complementaryRoot105,
  divideByCandidateFactor105,
  evaluateFactorPolynomial105,
  factorTheoremVerdict105,
  formatFactorPolynomial105,
  isFactorDragPayload105,
  parseCandidateFactor105,
  parseFactorPolynomial105,
} from "./factorTheoremLesson105Model";

describe("factorTheoremLesson105Model", () => {
  it("proves the target factor and derives its paired root", () => {
    const polynomial = parseFactorPolynomial105("x² − 3x + 2");
    const factor = parseCandidateFactor105("x − 1");
    const division = divideByCandidateFactor105(
      polynomial.coefficients,
      factor.root,
    );
    const evaluated = evaluateFactorPolynomial105(
      polynomial.coefficients,
      factor.root,
    );

    expect(polynomial).toEqual({ coefficients: [1, -3, 2], valid: true });
    expect(factor).toEqual({ valid: true, root: 1 });
    expect(division).toEqual({
      products: [0, 1, -2],
      sums: [1, -2, 0],
      quotient: [1, -2],
      remainder: 0,
    });
    expect(evaluated).toBe(0);
    expect(
      factorTheoremVerdict105(
        polynomial,
        factor,
        1,
        evaluated,
        division.remainder,
      ),
    ).toBe(true);
    expect(complementaryRoot105(division.quotient)).toBe(2);
    expect(formatFactorPolynomial105(division.quotient)).toBe("x − 2");
    expect(candidateFactorText105(2)).toBe("x − 2");
  });

  it("rejects a mismatched test value and invalid candidate syntax", () => {
    const polynomial = parseFactorPolynomial105("x² − 3x + 2");
    const factor = parseCandidateFactor105("x − 1");
    const division = divideByCandidateFactor105(
      polynomial.coefficients,
      factor.root,
    );

    expect(
      factorTheoremVerdict105(polynomial, factor, 2, 0, division.remainder),
    ).toBe(false);
    expect(parseCandidateFactor105("x² − 1").valid).toBe(false);
    expect(parseFactorPolynomial105("x / 2").valid).toBe(false);
  });

  it("supports missing powers and validates both drag payloads", () => {
    expect(parseFactorPolynomial105("x³ − 4x")).toEqual({
      coefficients: [1, 0, -4, 0],
      valid: true,
    });
    expect(parseCandidateFactor105("x + 3")).toEqual({
      valid: true,
      root: -3,
    });
    expect(isFactorDragPayload105("x − 1", "x − 1")).toBe(true);
    expect(isFactorDragPayload105("", "0")).toBe(false);
    expect(isFactorDragPayload105("2", "1")).toBe(false);
  });
});
