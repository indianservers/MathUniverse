import { describe, expect, it } from "vitest";
import {
  LINEAR_INEQUALITY_EXAMPLES_122,
  evaluateLinearInequality122,
  rightSideForBoundary122,
  solveLinearInequality122,
} from "./linearInequalitiesLesson122Model";

describe("linearInequalitiesLesson122Model", () => {
  it("solves and formats the target strict inequality", () => {
    expect(solveLinearInequality122(LINEAR_INEQUALITY_EXAMPLES_122[0])).toEqual(
      {
        valid: true,
        boundary: 3,
        solvedRelation: ">",
        flipped: false,
        right: true,
        closed: false,
        passPoint: 4,
        interval: "(3, ∞)",
      },
    );
  });

  it("reverses the comparator after division by a negative coefficient", () => {
    const result = solveLinearInequality122(LINEAR_INEQUALITY_EXAMPLES_122[1]);
    expect(result.boundary).toBe(-3);
    expect(result.solvedRelation).toBe(">");
    expect(result.flipped).toBe(true);
    expect(result.interval).toBe("(-3, ∞)");
  });

  it("uses a closed endpoint when equality is included", () => {
    const result = solveLinearInequality122(LINEAR_INEQUALITY_EXAMPLES_122[2]);
    expect(result.boundary).toBe(3);
    expect(result.solvedRelation).toBe("<=");
    expect(result.closed).toBe(true);
    expect(result.interval).toBe("(-∞, 3]");
  });

  it("evaluates interior and boundary test points using the original inequality", () => {
    const problem = LINEAR_INEQUALITY_EXAMPLES_122[0];
    expect(evaluateLinearInequality122(problem, 4)).toBe(true);
    expect(evaluateLinearInequality122(problem, 3)).toBe(false);
  });

  it("keeps the dragged boundary linked to the original coefficients", () => {
    expect(rightSideForBoundary122(LINEAR_INEQUALITY_EXAMPLES_122[0], 5)).toBe(
      13,
    );
  });
});
