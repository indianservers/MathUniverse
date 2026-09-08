import { describe, expect, it } from "vitest";
import {
  SUBSTITUTION_EXPRESSIONS_94,
  calculateSubstitution94,
  substitutionDisplay94,
} from "./substitutionLesson94Model";

describe("substitutionLesson94Model", () => {
  it("evaluates the target linear expression", () => {
    expect(calculateSubstitution94(SUBSTITUTION_EXPRESSIONS_94[0], 5)).toBe(17);
    expect(
      substitutionDisplay94(SUBSTITUTION_EXPRESSIONS_94[0], 5, true),
    ).toMatchObject({
      substituted: "3(5) + 2",
      intermediate: 15,
      interpretedResult: 17,
      preservesMeaning: true,
    });
  });

  it("models why brackets matter for negative squares", () => {
    const square = SUBSTITUTION_EXPRESSIONS_94[1];
    expect(substitutionDisplay94(square, -2, true)).toMatchObject({
      substituted: "(−2)² + 3",
      interpretedResult: 7,
      preservesMeaning: true,
    });
    expect(substitutionDisplay94(square, -2, false)).toMatchObject({
      substituted: "−2² + 3",
      interpretedResult: -1,
      correctResult: 7,
      preservesMeaning: false,
    });
  });
});
