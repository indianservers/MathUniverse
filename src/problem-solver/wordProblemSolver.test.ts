import { describe, expect, it } from "vitest";
import { classifyProblem } from "./problemClassifier";
import { solveWordProblem } from "./wordProblemSolver";

function solve(input: string) {
  const result = solveWordProblem(classifyProblem(input));
  if (!result) throw new Error(`No word-problem result for ${input}`);
  return result;
}

describe("word problem solver", () => {
  it.each([
    ["A train travels 60 km in 2 hours", "30 km/hour", "Distance divided by time"],
    ["A car travels at 50 km/h for 3 hours", "150 km", "Speed multiplied by time"],
    ["Percent increase from 50 to 60", "20% increase", "Percent change"],
    ["Rectangle length 8 width 5 area", "Area = 40, Perimeter = 26", "Rectangle formula"],
    ["Circle radius 7 circumference", "Circumference = 43.982297", "Circle formula"],
    ["Ratio of 12 to 18", "2:3", "Simplify ratio"],
    ["Simple interest principal 5000 rate 8 time 2 years", "Interest = 800, Amount = 5800", "Simple interest formula"],
    ["120 for 6 notebooks", "20 per 1 unit", "Divide total by number of units"],
  ])("solves %s", (input, expected, method) => {
    const result = solve(input);
    expect(result.result).toBe(expected);
    expect(result.method).toBe(method);
    expect(result.steps.length).toBeGreaterThan(2);
  });

  it("avoids guessing when no supported pattern matches", () => {
    const result = solve("A train leaves station");
    expect(result.result).toBe("Need more structure");
    expect(result.canCopy).toBe(false);
  });
});
