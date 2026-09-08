import { describe, expect, it } from "vitest";
import {
  expandedExpression95,
  expansionBracket95,
  expansionValues95,
  isExpansionAnswer95,
} from "./expandingBracketsLesson95Model";

describe("expandingBracketsLesson95Model", () => {
  it("expands and verifies the target expression", () => {
    expect(expansionBracket95("x", 3)).toBe("(x + 3)");
    expect(expandedExpression95(4, "x", 3)).toBe("4x + 12");
    expect(expansionValues95(4, 3, 6)).toEqual({
      original: 36,
      distributed: 36,
      equivalent: true,
    });
  });

  it("supports negative bracket constants and normalized grading", () => {
    expect(expansionBracket95("n", -2)).toBe("(n − 2)");
    expect(expandedExpression95(3, "n", -2)).toBe("3n − 6");
    expect(isExpansionAnswer95("3n - 6", 3, "n", -2)).toBe(true);
    expect(isExpansionAnswer95("3n - 2", 3, "n", -2)).toBe(false);
  });
});
