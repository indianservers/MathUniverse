import { describe, expect, it } from "vitest";
import {
  exponentLawValues99,
  isIndexFactorSource99,
  isPowerAnswer99,
  power99,
  productOfPowers99,
  repeatedFactors99,
  superscript99,
} from "./indicesLesson99Model";

describe("indicesLesson99Model", () => {
  it("models the target product of powers", () => {
    expect(superscript99(12)).toBe("¹²");
    expect(power99("x", 3)).toBe("x³");
    expect(repeatedFactors99("x", 3)).toBe("x × x × x");
    expect(productOfPowers99("x", 3, 2)).toEqual({
      first: "x³",
      second: "x²",
      combinedExponent: 5,
      result: "x⁵",
    });
  });

  it("verifies both sides independently at the target check value", () => {
    expect(exponentLawValues99(4, 3, 2)).toEqual({
      left: 1024,
      right: 1024,
      equal: true,
    });
  });

  it("grades common power notation and validates draggable factor IDs", () => {
    expect(isPowerAnswer99("y⁷", "y", 7)).toBe(true);
    expect(isPowerAnswer99("y^7", "y", 7)).toBe(true);
    expect(isPowerAnswer99("y7", "y", 7)).toBe(true);
    expect(isPowerAnswer99("y6", "y", 7)).toBe(false);
    expect(isIndexFactorSource99("blue-3", 3, 2)).toBe(true);
    expect(isIndexFactorSource99("purple-3", 3, 2)).toBe(false);
    expect(isIndexFactorSource99("constant", 3, 2)).toBe(false);
  });
});
