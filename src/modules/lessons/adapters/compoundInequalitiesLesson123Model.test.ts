import { describe, expect, it } from "vitest";
import {
  COMPOUND_INEQUALITY_EXAMPLES_123,
  compoundPointPasses123,
  solveCompoundInequality123,
} from "./compoundInequalitiesLesson123Model";

describe("compoundInequalitiesLesson123Model", () => {
  it("builds the target AND intersection and interval", () => {
    const result = solveCompoundInequality123(
      COMPOUND_INEQUALITY_EXAMPLES_123[0],
    );
    expect(result.empty).toBe(false);
    expect(result.interval).toBe("(2, 6]");
    expect(result.testPoints).toEqual([
      { value: 4, passes: true },
      { value: 2, passes: false },
      { value: 7, passes: false },
    ]);
  });

  it("builds the target OR union and endpoint inclusion", () => {
    const problem = COMPOUND_INEQUALITY_EXAMPLES_123[1];
    expect(solveCompoundInequality123(problem).interval).toBe(
      "(-∞, -1) ∪ [3, ∞)",
    );
    expect(compoundPointPasses123(problem, -2)).toBe(true);
    expect(compoundPointPasses123(problem, 0)).toBe(false);
    expect(compoundPointPasses123(problem, 3)).toBe(true);
  });

  it("detects a disjoint AND statement as the empty set", () => {
    expect(
      solveCompoundInequality123({
        mode: "AND",
        lower: 5,
        upper: 2,
        lowerClosed: true,
        upperClosed: true,
      }).interval,
    ).toBe("∅");
  });

  it("keeps a singleton only when both equal endpoints are closed", () => {
    expect(
      solveCompoundInequality123({
        mode: "AND",
        lower: 2,
        upper: 2,
        lowerClosed: true,
        upperClosed: true,
      }).interval,
    ).toBe("[2, 2]");
    expect(
      solveCompoundInequality123({
        mode: "AND",
        lower: 2,
        upper: 2,
        lowerClosed: false,
        upperClosed: true,
      }).empty,
    ).toBe(true);
  });
});
