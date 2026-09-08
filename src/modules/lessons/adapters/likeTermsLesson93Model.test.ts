import { describe, expect, it } from "vitest";
import {
  LIKE_TERMS_PROBLEMS_93,
  addLikeTerm93,
  evaluateLikeTerms93,
  isLikePracticeCorrect93,
  likeCoefficient93,
  originalLikeExpression93,
  simplifiedLikeExpression93,
} from "./likeTermsLesson93Model";

describe("likeTermsLesson93Model", () => {
  const problem = LIKE_TERMS_PROBLEMS_93[0];
  it("combines and evaluates the target expression", () => {
    expect(originalLikeExpression93(problem)).toBe("7x − 2x + 4");
    expect(likeCoefficient93(problem)).toBe(5);
    expect(simplifiedLikeExpression93(problem)).toBe("5x + 4");
    expect(evaluateLikeTerms93(problem, 4)).toBe(24);
  });
  it("updates terms and grades normalized answers", () => {
    expect(simplifiedLikeExpression93(addLikeTerm93(problem, "negative"))).toBe(
      "4x + 4",
    );
    expect(simplifiedLikeExpression93(addLikeTerm93(problem, "constant"))).toBe(
      "5x + 5",
    );
    expect(isLikePracticeCorrect93(" 2A + 6 ")).toBe(true);
    expect(isLikePracticeCorrect93("3a + 6")).toBe(false);
  });
});
