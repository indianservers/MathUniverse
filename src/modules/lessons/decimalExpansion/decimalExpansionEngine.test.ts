import { describe, expect, it } from "vitest";
import {
  analyzeDecimalExpansion,
  factorizationText,
  normalizeFraction,
  predictionFeedback,
  primeFactorization,
  validateExitTicket,
  validateFraction,
  validatePracticeAnswer,
} from "./decimalExpansionEngine";

describe("decimal expansion engine", () => {
  it.each([
    [1, 8, "0.125", "terminating"],
    [3, 20, "0.15", "terminating"],
    [5, 6, "0.8(3)...", "repeating"],
    [7, 12, "0.58(3)...", "repeating"],
    [1, 3, "0.(3)...", "repeating"],
    [17, 200, "0.085", "terminating"],
    [6, 15, "0.4", "terminating"],
    [0, 9, "0", "terminating"],
    [-1, 8, "-0.125", "terminating"],
    [12, 4, "3", "terminating"],
  ])("classifies %i/%i as %s", (numerator, denominator, display, classification) => {
    const result = analyzeDecimalExpansion(numerator, denominator);
    expect(result.decimalDisplay).toBe(display);
    expect(result.classification).toBe(classification);
  });

  it("detects the 1/7 repeating cycle", () => {
    const result = analyzeDecimalExpansion(1, 7);
    expect(result.repeatingDigits.join("")).toBe("142857");
    expect(result.classification).toBe("repeating");
  });

  it("normalizes negative denominators", () => {
    expect(normalizeFraction(1, -8)).toEqual({ numerator: -1, denominator: 8, sign: -1 });
    expect(analyzeDecimalExpansion(1, -8).decimalDisplay).toBe("-0.125");
  });

  it("rejects denominator zero", () => {
    expect(validateFraction(1, 0)).toEqual({ ok: false, error: "The denominator cannot be 0." });
  });

  it("tracks the 7/12 remainder cycle exactly", () => {
    const result = analyzeDecimalExpansion(7, 12);
    expect(result.remainders.slice(0, 4)).toEqual([7, 10, 4, 4]);
    expect(result.steps.at(-1)?.repeatStartsAt).toBe(2);
  });

  it("reduces fractions and factorizes reduced denominators", () => {
    const result = analyzeDecimalExpansion(6, 15);
    expect(result.reducedNumerator).toBe(2);
    expect(result.reducedDenominator).toBe(5);
    expect(factorizationText(primeFactorization(40))).toBe("2³ × 5");
  });

  it("compares predictions to calculated outcomes", () => {
    const repeating = analyzeDecimalExpansion(7, 12);
    expect(predictionFeedback("repeating", repeating)).toContain("matches");
    expect(predictionFeedback("terminating", repeating)).toContain("terminating");
  });

  it("validates practice and exit-ticket explanations", () => {
    expect(validatePracticeAnswer("13/125", "terminates")).toBe(true);
    expect(validatePracticeAnswer("7/30", "repeats")).toBe(true);
    expect(validatePracticeAnswer("11/24", "24 = 2^3 x 3 so it repeats")).toBe(true);
    expect(validateExitTicket("17/200 terminates because 200 has only prime factors 2 and 5")).toBe(true);
  });
});
