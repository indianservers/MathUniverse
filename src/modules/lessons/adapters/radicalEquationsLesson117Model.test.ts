import { describe, expect, it } from "vitest";
import {
  RADICAL_PRACTICES_117,
  RADICAL_PROBLEMS_117,
  isRadicalPracticeCorrect117,
  isRadicalSquareDrop117,
  radicalSquarePayload117,
  solveRadicalEquation117,
} from "./radicalEquationsLesson117Model";

describe("radicalEquationsLesson117Model", () => {
  it("matches the target candidate, domain, and original check", () => {
    expect(solveRadicalEquation117(RADICAL_PROBLEMS_117[0])).toEqual({
      candidate: 15,
      boundary: -1,
      radicand: 16,
      principalRoot: 4,
      valid: true,
      status: "valid",
    });
  });

  it("rejects the candidate introduced by squaring a negative right side", () => {
    expect(
      solveRadicalEquation117({ offset: 1, right: -4, variable: "x" }),
    ).toEqual({
      candidate: 15,
      boundary: -1,
      radicand: 16,
      principalRoot: 4,
      valid: false,
      status: "extraneous",
    });
  });

  it("validates the square operation for the full current equation", () => {
    const problem = RADICAL_PROBLEMS_117[0];
    const payload = radicalSquarePayload117(problem);
    expect(isRadicalSquareDrop117(payload, problem)).toBe(true);
    expect(isRadicalSquareDrop117("", problem)).toBe(false);
    expect(isRadicalSquareDrop117("x:1:-4", problem)).toBe(false);
  });

  it("grades practice only after original-equation validation", () => {
    expect(isRadicalPracticeCorrect117(RADICAL_PRACTICES_117[0], 27)).toBe(
      true,
    );
    expect(isRadicalPracticeCorrect117(RADICAL_PRACTICES_117[0], 26)).toBe(
      false,
    );
    expect(
      isRadicalPracticeCorrect117({ offset: 1, right: -4, variable: "x" }, 15),
    ).toBe(false);
  });
});
