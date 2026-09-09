import { describe, expect, it } from "vitest";
import {
  LINEAR_PRACTICES_111,
  LINEAR_PROBLEMS_111,
  evaluateLinearGraph111,
  isLinearOperationDrop111,
  isLinearPracticeCorrect111,
  linearOperationPayload111,
  solveLinearEquation111,
} from "./linearEquationsLesson111Model";

describe("linearEquationsLesson111Model", () => {
  it("solves and verifies every selectable equation", () => {
    for (const problem of LINEAR_PROBLEMS_111) {
      const solved = solveLinearEquation111(problem);
      expect(solved.correct).toBe(true);
      expect(evaluateLinearGraph111(problem, solved.solution)).toBeCloseTo(
        problem.c,
      );
    }
  });

  it("matches the target equation and intersection", () => {
    const solved = solveLinearEquation111(LINEAR_PROBLEMS_111[0]);
    expect(solved).toEqual({
      intermediate: 12,
      solution: 3,
      checkValue: 13,
      correct: true,
    });
  });

  it("rejects empty, stale, and wrong-row drag payloads", () => {
    const problem = LINEAR_PROBLEMS_111[0];
    const payload = linearOperationPayload111(problem, "constant");
    expect(payload).toBe("four-x-plus-one:constant");
    expect(isLinearOperationDrop111(payload, problem, "constant")).toBe(true);
    expect(isLinearOperationDrop111("", problem, "constant")).toBe(false);
    expect(isLinearOperationDrop111(payload, problem, "coefficient")).toBe(
      false,
    );
  });

  it("grades each practice answer from the equation", () => {
    expect(
      LINEAR_PRACTICES_111.map((problem) =>
        isLinearPracticeCorrect111(
          problem,
          solveLinearEquation111(problem).solution,
        ),
      ),
    ).toEqual([true, true]);
    expect(isLinearPracticeCorrect111(LINEAR_PRACTICES_111[0], 6)).toBe(false);
  });
});
