import { describe, expect, it } from "vitest";
import {
  factorForm97,
  factorisationValues97,
  factorPairCandidates97,
  findFactorPair97,
  isAreaDropCorrect97,
  isFactorisationAnswer97,
  quadraticExpression97,
  splitQuadratic97,
} from "./factorisationLesson97Model";

describe("factorisationLesson97Model", () => {
  it("finds and applies the target product-sum pair", () => {
    expect(findFactorPair97(6, 5)).toEqual([2, 3]);
    expect(factorPairCandidates97(6, 5, [2, 3])).toEqual([
      [1, 6],
      [2, 3],
      [-2, -3],
    ]);
    expect(quadraticExpression97("x", 5, 6)).toBe("x² + 5x + 6");
    expect(splitQuadratic97("x", [2, 3], 6)).toBe("x² + 2x + 3x + 6");
    expect(factorForm97("x", [2, 3])).toBe("(x + 2)(x + 3)");
  });

  it("verifies the factor form independently by substitution", () => {
    expect(factorisationValues97(5, 6, [2, 3], 2)).toEqual({
      original: 20,
      factored: 20,
      equivalent: true,
    });
    expect(factorisationValues97(5, 6, [1, 6], 2).equivalent).toBe(false);
  });

  it("grades either factor order and rejects incorrect area drops", () => {
    expect(isFactorisationAnswer97("(y+5)(y+2)", "y", [5, 2])).toBe(true);
    expect(isFactorisationAnswer97("(y + 2)(y + 5)", "y", [5, 2])).toBe(true);
    expect(isFactorisationAnswer97("(y + 1)(y + 10)", "y", [5, 2])).toBe(false);
    expect(isAreaDropCorrect97("square", "square")).toBe(true);
    expect(isAreaDropCorrect97("constant", "square")).toBe(false);
  });
});
