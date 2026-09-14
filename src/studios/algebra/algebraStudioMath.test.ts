import { describe, expect, it } from "vitest";
import {
  addPolynomials,
  answersMatchChallenge,
  applyBalanceOperation,
  autoBalanceLinear,
  classifyProofReason,
  combination,
  describeLinearSolution,
  dividePolynomialStrings,
  evaluateAlgebraExpression,
  expressionsEquivalent,
  inverseOfTransformedFamily,
  factorial,
  formatAlgebraNumber,
  geometricSeriesSum,
  multiplyPolynomials,
  parseAlgebraNumber,
  parseBalanceOperand,
  parseLinearEquation,
  reasonMatchesStep,
  slopeInterceptSystem,
  snapNearZero,
  simplifySquareRadical,
  geometricInfiniteSum,
  polynomialCoefficients,
  solveAbsoluteEquation,
  solveExponentialEquation,
  solveQuadraticEquation,
} from "./algebraStudioMath";
import { solveLinearInequality } from "./algebraEnhancementEngine";

describe("Algebra Studio shared math", () => {
  it("parses integers, decimals, negatives, fractions, pi, e, and square roots", () => {
    expect(parseAlgebraNumber("12").value).toBe(12);
    expect(parseAlgebraNumber("-3.5").value).toBe(-3.5);
    expect(parseAlgebraNumber("1/2").value).toBeCloseTo(0.5);
    expect(parseAlgebraNumber("π").value).toBeCloseTo(Math.PI);
    expect(parseAlgebraNumber("e").value).toBeCloseTo(Math.E);
    expect(parseAlgebraNumber("sqrt(9)").value).toBe(3);
    expect(parseAlgebraNumber("2^3").value).toBe(8);
  });

  it("snaps near-zero values and formats display only", () => {
    expect(snapNearZero(1e-15)).toBe(0);
    expect(formatAlgebraNumber(1 / 8)).toBe("0.125");
    expect(formatAlgebraNumber(Number.POSITIVE_INFINITY)).toBe("Undefined");
  });

  it("checks challenge answers by mathematical equivalence, not string match", () => {
    expect(answersMatchChallenge("x + 7", "2*(x+3)-(x-1)")).toBe(true);
    expect(answersMatchChallenge("x+7", "2(x+3)-(x-1)")).toBe(true);
    expect(answersMatchChallenge("2x+5", "2*(x+3)-(x-1)")).toBe(false);
    expect(answersMatchChallenge("20", 20)).toBe(true);
    expect(answersMatchChallenge("sqrt(4)+18", 20)).toBe(true);
  });

  it("treats 0x=0 as infinite and 0x=5 as none", () => {
    expect(describeLinearSolution(2, 3, 2, 3).kind).toBe("all");
    expect(describeLinearSolution(0, 0, 0, 5).kind).toBe("none");
    expect(describeLinearSolution(3, 5, 2, -1).kind).toBe("one");
  });

  it("applies balance operations to both sides and flips inequalities when scaling by a negative", () => {
    const added = applyBalanceOperation({ a: 2, b: 3, c: 0, d: 11 }, "Subtract", 3);
    expect(added.ok).toBe(true);
    if (added.ok) expect(added.state).toEqual({ a: 2, b: 0, c: 0, d: 8 });
    const scaled = applyBalanceOperation({ a: 2, b: 4, c: 0, d: 8 }, "Divide", -2, "<");
    expect(scaled.ok).toBe(true);
    if (scaled.ok) {
      expect(scaled.flipped).toBe(true);
      expect(scaled.relation).toBe(">");
    }
    const moved = applyBalanceOperation({ a: 3, b: 5, c: 2, d: -1 }, "Subtract", "2x");
    expect(moved.ok).toBe(true);
    if (moved.ok) expect(moved.state).toEqual({ a: 1, b: 5, c: 0, d: -1 });
    const chip = applyBalanceOperation({ a: 3, b: 5, c: 2, d: -1 }, "Subtract", "-2x");
    expect(chip.ok).toBe(true);
    if (chip.ok) expect(chip.state).toEqual({ a: 1, b: 5, c: 0, d: -1 });
    expect(parseBalanceOperand("2x").term).toEqual({ x: 2, n: 0 });
    expect(parseLinearEquation("3x+5=2x-1").ok).toBe(true);
    expect(solveLinearInequality(-2, 1, "<", 5)).toMatchObject({ relation: ">", reversed: true });
  });

  it("auto-balances a linear equation to x = value, 0=0, or 0=1", () => {
    expect(autoBalanceLinear({ a: 3, b: 5, c: 2, d: -1 })).toEqual({ a: 1, b: 0, c: 0, d: -6 });
    expect(autoBalanceLinear({ a: 2, b: 3, c: 2, d: 3 })).toEqual({ a: 0, b: 0, c: 0, d: 0 });
    expect(autoBalanceLinear({ a: 2, b: 1, c: 2, d: 4 })).toEqual({ a: 0, b: 0, c: 0, d: 1 });
  });

  it("solves quadratic, absolute-value, exponential, and 2x2 systems", () => {
    expect(solveQuadraticEquation(1, 0, -4).text).toContain("x = -2");
    expect(solveAbsoluteEquation(0, 3, 3).kind).toBe("all");
    expect(solveAbsoluteEquation(0, 3, 4).kind).toBe("none");
    expect(solveAbsoluteEquation(2, -1, -5).kind).toBe("none");
    expect(solveExponentialEquation(2, 8)).toMatchObject({ kind: "one", value: 3 });
    expect(slopeInterceptSystem(2, 1, -1, 4)).toMatchObject({ kind: "one", x: 1, y: 3 });
    expect(slopeInterceptSystem(2, 1, 2, 4).kind).toBe("none");
    expect(slopeInterceptSystem(2, 1, 2, 1).kind).toBe("all");
  });

  it("adds and multiplies polynomials by coefficients", () => {
    expect(addPolynomials([1, 2], [3, 4, 5])).toEqual([3, 5, 7]);
    expect(multiplyPolynomials([1, 1], [1, -1])).toEqual([1, 0, -1]);
  });

  it("computes factorial, combinations, and geometric series", () => {
    expect(factorial(5)).toBe(120);
    expect(combination(5, 2)).toBe(10);
    expect(geometricSeriesSum(3, 2, 4)).toBe(45);
    expect(geometricSeriesSum(5, 1, 4)).toBe(20);
  });

  it("treats expanded and factored forms as equivalent", () => {
    expect(expressionsEquivalent("(x-1)*(x+2)", "x^2+x-2")).toBe(true);
    expect(expressionsEquivalent("2x+2", "2(x+1)")).toBe(true);
  });

  it("validates identity proof reasons against the algebra", () => {
    const identity = classifyProofReason("a^2+2*a*b+b^2");
    expect(identity.valid).toBe(true);
    expect(reasonMatchesStep("Combine like terms", identity) || reasonMatchesStep("Distributive property", identity) || reasonMatchesStep("Definition of square", identity)).toBe(true);
    expect(classifyProofReason("a^2+b^2").valid).toBe(false);
  });

  it("covers the studio acceptance identities", () => {
    expect(describeLinearSolution(3, 5, 2, -1)).toMatchObject({ kind: "one", value: -6 });
    expect(solveQuadraticEquation(1, -5, 6).text).toContain("x = 2");
    expect(solveQuadraticEquation(1, -5, 6).text).toContain("x = 3");
    expect(solveAbsoluteEquation(2, -3, 5).values).toEqual([-1, 4]);
    expect(solveLinearInequality(-2, 3, ">", 7)).toMatchObject({ relation: "<", reversed: true });
    expect(simplifySquareRadical(72).text).toBe("6√2");
    expect(geometricInfiniteSum(1, 0.5).ok).toBe(true);
    expect(geometricInfiniteSum(1, 2).text).toBe("does not converge");
    const poly = polynomialCoefficients("x^3-4x^2+x+6");
    expect(poly.ok).toBe(true);
    if (poly.ok) {
      expect(poly.degree).toBe(3);
      expect(poly.constant).toBe(6);
    }
    expect(inverseOfTransformedFamily("x", 1.5, 2, -1, 2)).toBeCloseTo((2 - -1) / 1.5 + 2);
    expect(inverseOfTransformedFamily("1/x", 1, 0, 0, 4)).toBeCloseTo(0.25);
    expect(inverseOfTransformedFamily("2^x", 1, 0, 0, 8)).toBeCloseTo(3);
    expect(inverseOfTransformedFamily("abs(x)", 1, 0, 0, 2)).toBeNaN();
    const quotient = dividePolynomialStrings("x^2-1", "x-1");
    expect(quotient.ok).toBe(true);
    const atThree = evaluateAlgebraExpression(quotient.output, { x: 3 });
    expect(atThree.ok && atThree.value).toBeCloseTo(4);
  });
});
