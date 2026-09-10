import { describe, expect, it } from "vitest";
import {
  evaluateQuadraticInequality124,
  solveQuadraticInequality124,
  verifyQuadraticPractice124,
} from "./quadraticInequalitiesLesson124Model";

describe("quadraticInequalitiesLesson124Model", () => {
  it("solves the target upward positive inequality outside the roots", () => {
    const problem = {
      a: 1,
      firstRoot: 2,
      secondRoot: 3,
      relation: ">" as const,
    };
    const result = solveQuadraticInequality124(problem);
    expect(result.roots).toEqual([2, 3]);
    expect(result.b).toBe(-5);
    expect(result.c).toBe(6);
    expect(result.text).toBe("x < 2 or x > 3");
    expect(result.interval).toBe("(−∞, 2) ∪ (3, ∞)");
  });

  it("selects the interior and includes roots for a nonpositive inequality", () => {
    const result = solveQuadraticInequality124({
      a: 1,
      firstRoot: -2,
      secondRoot: 2,
      relation: "<=",
    });
    expect(result.text).toBe("-2 ≤ x ≤ 2");
    expect(result.interval).toBe("[-2, 2]");
  });

  it("handles repeated roots without inventing a sign change", () => {
    expect(
      solveQuadraticInequality124({
        a: 1,
        firstRoot: 2,
        secondRoot: 2,
        relation: ">",
      }).interval,
    ).toBe("(−∞, 2) ∪ (2, ∞)");
    expect(
      solveQuadraticInequality124({
        a: 1,
        firstRoot: 2,
        secondRoot: 2,
        relation: "<",
      }).interval,
    ).toBe("∅");
  });

  it("evaluates sign-chart values from the factored quadratic", () => {
    const problem = {
      a: 1,
      firstRoot: 2,
      secondRoot: 3,
      relation: ">" as const,
    };
    expect(evaluateQuadraticInequality124(problem, 1)).toBe(2);
    expect(evaluateQuadraticInequality124(problem, 2.5)).toBe(-0.25);
    expect(evaluateQuadraticInequality124(problem, 4)).toBe(2);
  });

  it("verifies the displayed practice interval through the solver", () => {
    expect(verifyQuadraticPractice124()).toBe(true);
  });
});
