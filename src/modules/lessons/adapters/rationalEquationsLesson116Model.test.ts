import { describe, expect, it } from "vitest";
import {
  RATIONAL_PRACTICES_116,
  RATIONAL_PROBLEMS_116,
  isRationalMultiplierDrop116,
  isRationalPracticeCorrect116,
  rationalMultiplierPayload116,
  solveRationalEquation116,
} from "./rationalEquationsLesson116Model";

describe("rationalEquationsLesson116Model", () => {
  it("matches the target exact solution and checks", () => {
    expect(solveRationalEquation116(RATIONAL_PROBLEMS_116[0])).toEqual({
      numerator: 7,
      denominator: 3,
      value: 7 / 3,
      status: "unique",
      restrictionSatisfied: true,
      substitutionSatisfied: true,
    });
  });

  it("classifies editable degenerate equations truthfully", () => {
    expect(
      solveRationalEquation116({
        numerator: 0,
        restriction: 2,
        right: 3,
        variable: "x",
      }).status,
    ).toBe("none");
    expect(
      solveRationalEquation116({
        numerator: 0,
        restriction: 2,
        right: 0,
        variable: "x",
      }).status,
    ).toBe("infinite");
    expect(
      solveRationalEquation116({
        numerator: 1,
        restriction: 2,
        right: 0,
        variable: "x",
      }).status,
    ).toBe("none");
  });

  it("validates only the current non-empty denominator payload", () => {
    const problem = RATIONAL_PROBLEMS_116[0];
    const payload = rationalMultiplierPayload116(problem);
    expect(isRationalMultiplierDrop116(payload, problem)).toBe(true);
    expect(isRationalMultiplierDrop116("", problem)).toBe(false);
    expect(isRationalMultiplierDrop116("x + 2", problem)).toBe(false);
  });

  it("grades exact fractional practice answers", () => {
    expect(
      isRationalPracticeCorrect116(RATIONAL_PRACTICES_116[0], "-1/2"),
    ).toBe(true);
    expect(
      isRationalPracticeCorrect116(RATIONAL_PRACTICES_116[0], "-0.5"),
    ).toBe(true);
    expect(isRationalPracticeCorrect116(RATIONAL_PRACTICES_116[0], "1/2")).toBe(
      false,
    );
  });
});
