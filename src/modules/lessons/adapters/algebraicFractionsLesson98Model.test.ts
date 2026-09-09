import { describe, expect, it } from "vitest";
import {
  algebraicFractionLabel98,
  algebraicFractionValues98,
  isAlgebraicFractionAnswer98,
  isCommonFactorSource98,
  linearFactor98,
  quadraticFromRoots98,
  simplifiedFractionAnswer98,
} from "./algebraicFractionsLesson98Model";

const target = {
  id: "difference-one",
  variable: "x",
  cancelledRoot: 1,
  retainedRoot: -1,
};

describe("algebraicFractionsLesson98Model", () => {
  it("factors and simplifies the target rational expression", () => {
    expect(quadraticFromRoots98("x", 1, -1)).toBe("x² − 1");
    expect(linearFactor98("x", 1)).toBe("x − 1");
    expect(algebraicFractionLabel98(target)).toBe("x² − 1 / x − 1");
    expect(simplifiedFractionAnswer98(target)).toBe("x + 1, x ≠ 1");
  });

  it("checks valid values and preserves the excluded root", () => {
    expect(algebraicFractionValues98(target, 3)).toEqual({
      numerator: 8,
      denominator: 2,
      valid: true,
      original: 4,
      simplified: 4,
      equivalent: true,
    });
    expect(algebraicFractionValues98(target, 1)).toMatchObject({
      valid: false,
      original: null,
      equivalent: false,
    });
  });

  it("grades the simplified form and validates cancellation sources", () => {
    expect(isAlgebraicFractionAnswer98("x + 1, x != 1", target)).toBe(true);
    expect(isAlgebraicFractionAnswer98("x + 1", target)).toBe(false);
    expect(isCommonFactorSource98("numerator")).toBe(true);
    expect(isCommonFactorSource98("constant")).toBe(false);
  });
});
