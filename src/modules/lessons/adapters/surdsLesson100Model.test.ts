import { describe, expect, it } from "vitest";
import {
  factorFromSurdDrop100,
  isSurdPracticeCorrect100,
  largestSquareFactor100,
  simplifySurd100,
  squareFactorCandidates100,
} from "./surdsLesson100Model";

describe("surdsLesson100Model", () => {
  it("extracts the largest square factor from the target radicand", () => {
    expect(largestSquareFactor100(50)).toBe(25);
    expect(squareFactorCandidates100(50, 25)).toContain(25);
    expect(simplifySurd100(50, 25)).toMatchObject({
      quotient: 2,
      validSquareFactor: true,
      coefficient: 5,
      residual: 2,
      result: "5√2",
      decimalMatch: true,
    });
  });

  it("keeps invalid factors inside and rejects unrelated drops", () => {
    expect(simplifySurd100(50, 10)).toMatchObject({
      validSquareFactor: false,
      result: "√50",
      decimalMatch: false,
    });
    expect(factorFromSurdDrop100("25", "", 50)).toBe(25);
    expect(factorFromSurdDrop100("", "50", 50)).toBe(25);
    expect(factorFromSurdDrop100("7", "12", 50)).toBeNull();
  });

  it("grades the target practice choice", () => {
    expect(isSurdPracticeCorrect100("C")).toBe(true);
    expect(isSurdPracticeCorrect100("B")).toBe(false);
  });
});
