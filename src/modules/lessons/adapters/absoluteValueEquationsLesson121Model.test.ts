import { describe, expect, it } from "vitest";
import {
  ABSOLUTE_VALUE_EXAMPLES_121,
  isAbsoluteValuePracticeCorrect121,
  solveAbsoluteValueEquation121,
} from "./absoluteValueEquationsLesson121Model";

describe("absoluteValueEquationsLesson121Model", () => {
  it("calculates both target solutions and verifies their distances", () => {
    expect(
      solveAbsoluteValueEquation121(ABSOLUTE_VALUE_EXAMPLES_121[0]),
    ).toEqual({
      solvable: true,
      left: 1,
      right: 5,
      leftCheck: true,
      rightCheck: true,
      valid: true,
    });
  });

  it("supports a negative center without changing the distance rule", () => {
    const result = solveAbsoluteValueEquation121(
      ABSOLUTE_VALUE_EXAMPLES_121[1],
    );
    expect(result.left).toBe(-7);
    expect(result.right).toBe(-1);
    expect(result.valid).toBe(true);
  });

  it("rejects a negative right side as having no real solutions", () => {
    const result = solveAbsoluteValueEquation121(
      ABSOLUTE_VALUE_EXAMPLES_121[2],
    );
    expect(result.solvable).toBe(false);
    expect(result.left).toBeNaN();
    expect(result.right).toBeNaN();
    expect(result.valid).toBe(false);
  });

  it("grades both practice solutions in either order", () => {
    expect(isAbsoluteValuePracticeCorrect121(-7, -1)).toBe(true);
    expect(isAbsoluteValuePracticeCorrect121(-1, -7)).toBe(true);
    expect(isAbsoluteValuePracticeCorrect121(-7, 1)).toBe(false);
  });
});
