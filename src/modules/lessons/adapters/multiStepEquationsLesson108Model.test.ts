import { describe, expect, it } from "vitest";
import {
  MULTI_STEP_PRACTICES_108,
  MULTI_STEP_PROBLEMS_108,
  evaluateMultiStepProblem108,
  formatMultiStepExpression108,
  intermediateMultiStepValue108,
  isMultiStepAnswerCorrect108,
  multiStepInverseText108,
  multiStepStageForOperation108,
  solveMultiStepProblem108,
  validateMultiStepOperation108,
} from "./multiStepEquationsLesson108Model";

describe("multiStepEquationsLesson108Model", () => {
  it("derives both inverse stages and verifies every lesson problem", () => {
    expect(MULTI_STEP_PROBLEMS_108.map(solveMultiStepProblem108)).toEqual([
      4, 4, 5, 5,
    ]);
    for (const problem of MULTI_STEP_PROBLEMS_108) {
      const solution = solveMultiStepProblem108(problem);
      expect(intermediateMultiStepValue108(problem)).toBe(
        problem.rhs - problem.constant,
      );
      expect(evaluateMultiStepProblem108(problem, solution)).toBe(problem.rhs);
      expect(isMultiStepAnswerCorrect108(problem, solution)).toBe(true);
      expect(isMultiStepAnswerCorrect108(problem, solution + 1)).toBe(false);
    }
    expect(formatMultiStepExpression108(MULTI_STEP_PROBLEMS_108[0])).toBe(
      "2x + 3 = 11",
    );
    expect(multiStepInverseText108(MULTI_STEP_PROBLEMS_108[2])).toBe("Add 5");
  });

  it("grades practice by substitution", () => {
    expect(MULTI_STEP_PRACTICES_108.map(solveMultiStepProblem108)).toEqual([
      4, 9,
    ]);
    expect(isMultiStepAnswerCorrect108(MULTI_STEP_PRACTICES_108[0], 4)).toBe(
      true,
    );
    expect(isMultiStepAnswerCorrect108(MULTI_STEP_PRACTICES_108[1], 8)).toBe(
      false,
    );
  });

  it("enforces constant removal before equal-group division", () => {
    expect(
      validateMultiStepOperation108(
        "two-x-plus-three:constant",
        "two-x-plus-three",
        "constant",
        [],
      ),
    ).toBe(true);
    expect(
      validateMultiStepOperation108(
        "two-x-plus-three:groups",
        "two-x-plus-three",
        "groups",
        [],
      ),
    ).toBe(false);
    expect(
      validateMultiStepOperation108(
        "two-x-plus-three:groups",
        "two-x-plus-three",
        "groups",
        ["constant"],
      ),
    ).toBe(true);
    expect(multiStepStageForOperation108("constant")).toBe(1);
    expect(multiStepStageForOperation108("groups")).toBe(2);
  });
});
