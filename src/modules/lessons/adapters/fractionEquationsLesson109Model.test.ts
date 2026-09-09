import { describe, expect, it } from "vitest";
import {
  FRACTION_EXAMPLES_109,
  FRACTION_PRACTICES_109,
  calculateFractionEquation109,
  evaluateFractionEquation109,
  fractionEquationText109,
  isFractionLcdDrop109,
  isFractionPracticeCorrect109,
} from "./fractionEquationsLesson109Model";

describe("fractionEquationsLesson109Model", () => {
  it("calculates the target LCD transformation and solution", () => {
    const problem = FRACTION_EXAMPLES_109[0];
    expect(fractionEquationText109(problem)).toBe("x/3 + 2 = 5");
    expect(calculateFractionEquation109(problem)).toEqual({
      lcd: 3,
      clearedCoefficient: 1,
      clearedConstant: 6,
      clearedRhs: 15,
      isolatedNumerator: 9,
      solution: 9,
    });
    expect(evaluateFractionEquation109(problem, 9)).toBe(5);
  });

  it("handles non-unit numerator coefficients and negative constants", () => {
    expect(calculateFractionEquation109(FRACTION_EXAMPLES_109[1])).toEqual({
      lcd: 5,
      clearedCoefficient: 2,
      clearedConstant: -5,
      clearedRhs: 15,
      isolatedNumerator: 20,
      solution: 10,
    });
    expect(
      calculateFractionEquation109(FRACTION_EXAMPLES_109[3]).solution,
    ).toBe(4);
  });

  it("validates LCD payloads and grades practice by substitution", () => {
    const practice = FRACTION_PRACTICES_109[0];
    expect(isFractionLcdDrop109("y-over-four-minus-one:4", practice)).toBe(
      true,
    );
    expect(isFractionLcdDrop109("", practice)).toBe(false);
    expect(isFractionLcdDrop109("y-over-four-minus-one:8", practice)).toBe(
      false,
    );
    expect(isFractionPracticeCorrect109(practice, 4, 12)).toBe(true);
    expect(isFractionPracticeCorrect109(practice, 8, 12)).toBe(false);
    expect(isFractionPracticeCorrect109(practice, 4, 11)).toBe(false);
  });
});
