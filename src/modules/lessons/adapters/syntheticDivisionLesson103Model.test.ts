import { describe, expect, it } from "vitest";
import {
  formatSyntheticPolynomial103,
  isSyntheticDrop103,
  parsePolynomial103,
  parseSyntheticDivisor103,
  syntheticDivide103,
  syntheticExpansionMatches103,
} from "./syntheticDivisionLesson103Model";

describe("syntheticDivisionLesson103Model", () => {
  it("parses and divides the target polynomial", () => {
    expect(parsePolynomial103("x² + 5x + 6")).toEqual({
      coefficients: [1, 5, 6],
      valid: true,
    });
    expect(parseSyntheticDivisor103("x + 2")).toEqual({
      synthetic: -2,
      valid: true,
    });
    const division = syntheticDivide103([1, 5, 6], -2);
    expect(division).toEqual({
      products: [0, -2, -6],
      sums: [1, 3, 0],
      quotient: [1, 3],
      remainder: 0,
    });
    expect(formatSyntheticPolynomial103(division.quotient)).toBe("x + 3");
    expect(
      syntheticExpansionMatches103(
        [1, 5, 6],
        -2,
        division.quotient,
        division.remainder,
      ),
    ).toBe(true);
  });

  it("preserves missing coefficients and rejects invalid input", () => {
    expect(parsePolynomial103("x³ - 5x + 6").coefficients).toEqual([
      1, 0, -5, 6,
    ]);
    expect(parsePolynomial103("x/y").valid).toBe(false);
    expect(parseSyntheticDivisor103("2x + 1").valid).toBe(false);
  });

  it("validates synthetic-number drag payloads", () => {
    expect(isSyntheticDrop103("-2", -2)).toBe(true);
    expect(isSyntheticDrop103("2", -2)).toBe(false);
    expect(isSyntheticDrop103("", 0)).toBe(false);
  });
});
