import { describe, expect, it } from "vitest";
import {
  QUADRATIC_EXAMPLES_114,
  evaluateQuadratic114,
  isQuadraticPracticeCorrect114,
  quadraticFromRoots114,
  quadraticMethodSteps114,
  solveQuadratic114,
} from "./quadraticEquationsLesson114Model";

describe("quadraticEquationsLesson114Model", () => {
  it("matches the target roots, discriminant, and vertex", () => {
    expect(solveQuadratic114(QUADRATIC_EXAMPLES_114[0])).toEqual({
      first: 2,
      second: 3,
      discriminant: 1,
      vertexX: 2.5,
      vertexY: -0.25,
    });
  });

  it("keeps coefficient and draggable-root models synchronized", () => {
    const quadratic = quadraticFromRoots114(1, 1.5, 4);
    expect(quadratic).toEqual({ a: 1, b: -5.5, c: 6 });
    expect(evaluateQuadratic114(quadratic, 1.5)).toBe(0);
    expect(evaluateQuadratic114(quadratic, 4)).toBe(0);
  });

  it("provides a calculated derivation for every method", () => {
    const quadratic = QUADRATIC_EXAMPLES_114[0];
    expect(quadraticMethodSteps114(quadratic, "Factoring")).toContain(
      "product 6",
    );
    expect(quadraticMethodSteps114(quadratic, "Quadratic formula")).toContain(
      "Δ = 1",
    );
    expect(quadraticMethodSteps114(quadratic, "Complete the square")).toContain(
      "2.5",
    );
  });

  it("grades both practice roots in either order", () => {
    const practice = QUADRATIC_EXAMPLES_114[1];
    expect(isQuadraticPracticeCorrect114(practice, [3, 4])).toBe(true);
    expect(isQuadraticPracticeCorrect114(practice, [4, 3])).toBe(true);
    expect(isQuadraticPracticeCorrect114(practice, [3, 3])).toBe(false);
  });
});
