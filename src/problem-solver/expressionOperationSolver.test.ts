import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import { solveExpressionOperation } from "./expressionOperationSolver";

function solve(input: string) {
  const result = solveExpressionOperation(classifyProblem(input));
  if (!result) throw new Error(`No expression result for ${input}`);
  return result;
}

describe("expression operation solver", () => {
  it.each([
    ["simplify (x^2 - 1)/(x - 1)", "x + 1", "x != 1"],
    ["reduce (x^2 - 4)/(x - 2)", "x + 2", "x != 2"],
  ])("simplifies rational expression %s", (input, expected, restriction) => {
    const result = solve(input);
    expect(result.result).toContain(expected);
    expect(result.restrictions).toContain(restriction);
    expect(result.steps.join(" ")).toContain("Cancel common factor");
  });

  it("combines like terms", () => {
    expect(solve("simplify 2x + 3x - 5").result).toBe("5x - 5");
  });

  it.each([
    ["factor x^2 - 5x + 6", "(x - 2)(x - 3)"],
    ["factor x^2 - 4", "(x - 2)(x + 2)"],
    ["factor x^2 + 2x + 1", "(x + 1)^2"],
  ])("factors %s", (input, expected) => {
    expect(solve(input).result).toBe(expected);
  });

  it.each([
    ["expand (x+1)^2", "x^2 + 2x + 1"],
    ["expand (x-2)(x+3)", "x^2 + x - 6"],
    ["expand 2(x+1)(x-1)", "2x^2 - 2"],
  ])("expands %s", (input, expected) => {
    expect(solve(input).result).toBe(expected);
  });

  it.each([
    ["2 + 3 * 4", "14"],
    ["sqrt(16)", "4"],
    ["log(100)", "2"],
    ["ln(e)", "1"],
    ["abs(-5)", "5"],
    ["sin(30)", "0.5"],
    ["cos(60)", "0.5"],
    ["sum(15+98)", "113"],
    ["sum(15, 98)", "113"],
    ["add 15 and 98", "113"],
    ["15 plus 98", "113"],
    ["product of 3 and 4", "12"],
    ["subtract 4 from 10", "6"],
    ["divide 10 by 2", "5"],
  ])("evaluates %s", (input, expected) => {
    expect(solve(input).result).toBe(expected);
  });

  it("keeps exact and approximate forms for irrational roots", () => {
    expect(solve("sqrt(34)").result).toContain("Exact: sqrt(34)");
    expect(solve("sqrt 34").result).toContain("Approximate:");
  });

  it("preserves explicit multiplication in arithmetic steps", () => {
    expect(solve("2 + 3 * 4").steps[0]).toContain("2+3 * 4");
  });

  it("adds degree assumptions for trig evaluation", () => {
    expect(solve("sin(30)").assumptions.join(" ")).toContain("degrees");
  });

  it.each([
    ["simplify (x^2 - 1)/(x - 1)", "x != 1"],
    ["simplify 1/(x+1)", "x != -1"],
    ["sqrt(x-2)", "x >= 2"],
    ["log(x)", "x > 0"],
  ])("detects domain restrictions for %s", (input, expected) => {
    expect(solve(input).restrictions).toContain(expected);
  });
});
