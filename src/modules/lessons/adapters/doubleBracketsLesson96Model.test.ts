import { describe, expect, it } from "vitest";
import {
  binomial96,
  doubleBracketsExpression96,
  expandedExpression96,
  fourProducts96,
  isDoubleBracketsAnswer96,
  substitutionProof96,
  uncombinedExpression96,
} from "./doubleBracketsLesson96Model";

describe("doubleBracketsLesson96Model", () => {
  it("builds the four target products and combines the middle terms", () => {
    expect(binomial96("x", 2)).toBe("(x + 2)");
    expect(doubleBracketsExpression96("x", 2, 3)).toBe("(x + 2)(x + 3)");
    expect(fourProducts96("x", 2, 3)).toEqual({
      square: "x²",
      firstMiddle: "3x",
      secondMiddle: "2x",
      constant: 6,
    });
    expect(uncombinedExpression96("x", 2, 3)).toBe("x² + 3x + 2x + 6");
    expect(expandedExpression96("x", 2, 3)).toBe("x² + 5x + 6");
  });

  it("proves equivalence by independently evaluating both forms", () => {
    expect(substitutionProof96(2, 3, 1)).toEqual({
      original: 12,
      expanded: 12,
      equivalent: true,
    });
  });

  it("supports negative terms and normalized practice answers", () => {
    expect(expandedExpression96("p", -2, 5)).toBe("p² + 3p − 10");
    expect(isDoubleBracketsAnswer96("p^2 + 3p - 10", "p", -2, 5)).toBe(true);
    expect(isDoubleBracketsAnswer96("p² + 7p − 10", "p", -2, 5)).toBe(false);
  });
});
