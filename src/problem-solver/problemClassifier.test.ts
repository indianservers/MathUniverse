import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import type { ProblemIntentKind } from "./problemTypes";

const cases: Array<[string, ProblemIntentKind]> = [
  ["2x + 5 = 15", "linear-equation"],
  ["x^2 - 5x + 6 = 0", "quadratic-equation"],
  ["x^3 + 2x^2 = 0", "polynomial-equation"],
  ["simplify (x^2 - 1)/(x - 1)", "simplify"],
  ["factor x^2 - 5x + 6", "factor"],
  ["expand (x+1)^2", "expand"],
  ["derivative of x^3 + 2x", "derivative"],
  ["differentiate x^3 + 2x", "derivative"],
  ["integrate 2x", "integral"],
  ["limit x->0 sin(x)/x", "limit"],
  ["solve 2x + y = 7 and x - y = 2", "system"],
  ["mean of 4, 6, 8, 10", "statistics"],
  ["sin(30)", "evaluate"],
  ["2 + 3 * 4", "evaluate"],
  ["[[1,2],[3,4]]", "matrix"],
  ["A train leaves station...", "unsupported"],
];

describe("problem solver classifier", () => {
  it.each(cases)("classifies %s as %s", (input, expected) => {
    expect(classifyProblem(input).kind).toBe(expected);
  });

  it("extracts equation variables and degree-based intent", () => {
    const linear = classifyProblem("2x + 5 = 15");
    expect(linear.variable).toBe("x");
    expect(linear.normalizedInput).toBe("2*x+5=15");

    const system = classifyProblem("solve 2x + y = 7 and x - y = 2");
    expect(system.variables).toEqual(["x", "y"]);
    expect(system.normalizedInput).toBe("2*x+y=7; x-y=2");
  });
});
