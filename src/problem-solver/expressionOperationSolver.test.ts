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
  ])("evaluates %s", (input, expected) => {
    expect(solve(input).result).toBe(expected);
  });

  it.each([
    ["sum 2, 3, 4", "9", "Sum"],
    ["add 12 18 30", "60", "Sum"],
    ["multiply 7 and 8", "56", "Multiplication"],
    ["mul 6 9", "54", "Multiplication"],
    ["subtract 3 from 10", "7", "Subtraction"],
    ["divide 100 by 4", "25", "Division"],
    ["mod 17 5", "2", "Modulo"],
    ["power 2 to 3", "8", "Numeric evaluation"],
    ["square 12", "144", "Numeric evaluation"],
    ["cube 5", "125", "Numeric evaluation"],
    ["reciprocal 8", "0.125", "Division"],
    ["15% of 200", "30", "Percent"],
    ["percent 12.5 of 640", "80", "Percent"],
    ["gcd 48 180", "12", "Greatest Common Divisor"],
    ["hcf 48 and 180", "12", "Greatest Common Divisor"],
    ["lcm 12 18", "36", "Least Common Multiple"],
    ["minimum 9, 4, 12", "4", "Minimum"],
    ["maximum 9, 4, 12", "12", "Maximum"],
    ["factorial 6", "720", "Factorial"],
    ["6!", "720", "Factorial"],
  ])("evaluates arithmetic command %s", (input, expected, method) => {
    const result = solve(input);
    expect(result.result).toBe(expected);
    expect(result.method).toBe(method);
  });

  it.each([
    ["SUM(2,3,4)", "9", "Sum"],
    ["PRODUCT(2,3,4)", "24", "Multiplication"],
    ["COUNT(2,3,apple,4)", "3", "Count"],
    ["COUNTA(2,,apple,4)", "3", "Count"],
    ["COUNTBLANK(2,,apple,)", "2", "Count"],
    ["ROUND(12.345,2)", "12.35", "Numeric evaluation"],
    ["ROUNDUP(12.341,2)", "12.35", "Numeric evaluation"],
    ["ROUNDDOWN(12.349,2)", "12.34", "Numeric evaluation"],
    ["INT(12.9)", "12", "Numeric evaluation"],
    ["TRUNC(12.987,2)", "12.98", "Numeric evaluation"],
    ["CEILING(12.1,1)", "13", "Numeric evaluation"],
    ["FLOOR(12.9,1)", "12", "Numeric evaluation"],
    ["MOD(17,5)", "2", "Modulo"],
    ["POWER(2,3)", "8", "Numeric evaluation"],
    ["FACT(6)", "720", "Combinatorics"],
    ["GCD(48,180)", "12", "Greatest Common Divisor"],
    ["LCM(12,18)", "36", "Least Common Multiple"],
    ["MIN(9,4,12)", "4", "Minimum"],
    ["MAX(9,4,12)", "12", "Maximum"],
    ["SUMSQ(2,3,4)", "29", "Sum"],
    ["GEOMEAN(2,8)", "4", "Numeric evaluation"],
    ["HARMEAN(2,6)", "3", "Numeric evaluation"],
    ["LARGE(2,9,4,12,2)", "9", "Ordered Statistic"],
    ["SMALL(2,9,4,12,2)", "4", "Ordered Statistic"],
    ["PERCENTILE.INC(10,20,30,40,0.5)", "25", "Ordered Statistic"],
    ["QUARTILE.INC(10,20,30,40,2)", "25", "Ordered Statistic"],
    ["SUMPRODUCT(1,2,3,4)", "11", "Sum"],
    ["SUMXMY2(1,2,3,4)", "8", "Sum"],
    ["AVEDEV(2,4,6)", "1.333333", "Descriptive Statistic"],
    ["DEVSQ(2,4,6)", "8", "Descriptive Statistic"],
    ["STANDARDIZE(12,10,2)", "1", "Descriptive Statistic"],
    ["RANK.EQ(4,1,4,4,8)", "2", "Ordered Statistic"],
    ["RANK.AVG(4,1,4,4,8)", "2.5", "Ordered Statistic"],
    ["CORREL(1,2,3,2,4,6)", "1", "Regression and Correlation"],
    ["SLOPE(2,4,6,1,2,3)", "2", "Regression and Correlation"],
    ["INTERCEPT(2,4,6,1,2,3)", "0", "Regression and Correlation"],
    ["RSQ(2,4,6,1,2,3)", "1", "Regression and Correlation"],
    ["FORECAST.LINEAR(4,2,4,6,1,2,3)", "8", "Regression and Correlation"],
    ["COMBIN(5,2)", "10", "Combinatorics"],
    ["PERMUT(5,2)", "20", "Combinatorics"],
    ["MULTINOMIAL(2,3,4)", "1260", "Combinatorics"],
    ["SEC(0)", "1", "Numeric evaluation"],
    ["NORM.S.DIST(0,TRUE)", "0.5", "Distribution"],
    ["BINOM.DIST(2,4,0.5,FALSE)", "0.375", "Distribution"],
    ["POISSON.DIST(2,3,FALSE)", "0.224042", "Distribution"],
  ])("evaluates Excel-style math formula %s", (input, expected, method) => {
    const result = solve(input);
    expect(result.result).toBe(expected);
    expect(result.method).toBe(method);
  });

  it("keeps exact and approximate forms for irrational roots", () => {
    expect(solve("sqrt(34)").result).toContain("Exact: sqrt(34)");
    expect(solve("sqrt 34").result).toContain("Approximate:");
  });

  it("preserves explicit multiplication in arithmetic steps", () => {
    expect(solve("2 + 3 * 4").steps[0]).toContain("2+3 * 4");
  });

  it("explains BODMAS for mixed arithmetic", () => {
    const result = solve("23+340-4/45");
    const steps = result.steps.join(" ");
    expect(result.result).toBe("362.911111");
    expect(steps).toContain("Applied BODMAS rule");
    expect(steps).toContain("Division and multiplication: 4 / 45");
    expect(steps).toContain("Addition and subtraction: 23 + 340");
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
