import { describe, expect, it } from "vitest";
import {
  ALGEBRA_TILE_PROBLEMS_92,
  addAlgebraTile92,
  algebraTileCoefficients92,
  algebraTileExpression92,
  algebraTileStartingExpression92,
  evaluateAlgebraTiles92,
} from "./algebraTilesLesson92Model";

describe("algebraTilesLesson92Model", () => {
  const problem = ALGEBRA_TILE_PROBLEMS_92[0];

  it("combines the target expression from its tiles", () => {
    expect(algebraTileStartingExpression92(problem)).toBe("2x + 3x − 1");
    expect(algebraTileCoefficients92(problem)).toEqual({
      xSquared: 0,
      x: 5,
      constant: -1,
    });
    expect(algebraTileExpression92(problem)).toBe("5x − 1");
    expect(evaluateAlgebraTiles92(problem, 2)).toBe(9);
  });

  it("adds each tile through the shared object model", () => {
    expect(
      algebraTileExpression92(addAlgebraTile92(problem, "x-squared")),
    ).toBe("x² 5x − 1");
    expect(
      algebraTileExpression92(addAlgebraTile92(problem, "negative-x")),
    ).toBe("4x − 1");
    expect(algebraTileExpression92(addAlgebraTile92(problem, "unit"))).toBe(
      "5x",
    );
  });
});
