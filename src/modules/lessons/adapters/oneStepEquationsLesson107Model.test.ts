import { describe, expect, it } from "vitest";
import {
  ONE_STEP_EQUATIONS_107,
  ONE_STEP_PRACTICES_107,
  evaluateOneStepEquation107,
  evaluateOneStepPractice107,
  isOneStepAnswerCorrect107,
  isOneStepOperationDrop107,
  shouldResolveBalance107,
  solveOneStepEquation107,
  solveOneStepPractice107,
} from "./oneStepEquationsLesson107Model";

describe("oneStepEquationsLesson107Model", () => {
  it("derives and verifies all four inverse-operation solutions", () => {
    expect(ONE_STEP_EQUATIONS_107.map(solveOneStepEquation107)).toEqual([
      7, 13, 6, 20,
    ]);
    for (const equation of ONE_STEP_EQUATIONS_107) {
      const solution = solveOneStepEquation107(equation);
      expect(evaluateOneStepEquation107(equation, solution)).toBe(
        equation.right,
      );
      expect(isOneStepAnswerCorrect107(equation, solution)).toBe(true);
      expect(isOneStepAnswerCorrect107(equation, solution + 1)).toBe(false);
    }
  });

  it("calculates and verifies the independent practice equations", () => {
    expect(ONE_STEP_PRACTICES_107.map(solveOneStepPractice107)).toEqual([
      13, 9,
    ]);
    expect(evaluateOneStepPractice107(ONE_STEP_PRACTICES_107[0], 13)).toBe(9);
    expect(evaluateOneStepPractice107(ONE_STEP_PRACTICES_107[1], 9)).toBe(15);
  });

  it("requires valid matching drops on both pans in manual mode", () => {
    expect(isOneStepOperationDrop107("add-five", "add-five")).toBe(true);
    expect(isOneStepOperationDrop107("", "add-five")).toBe(false);
    expect(isOneStepOperationDrop107("triple", "add-five")).toBe(false);
    expect(shouldResolveBalance107(true, [])).toBe(true);
    expect(shouldResolveBalance107(false, ["left"])).toBe(false);
    expect(shouldResolveBalance107(false, ["left", "right"])).toBe(true);
  });
});
