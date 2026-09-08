import { describe, expect, it } from "vitest";
import {
  algebraTiles, arithmeticSeries, cancelZeroPairs, changeLogBase, completeSquare,
  composeFunctions, distributeBinomials, evaluatePiecewise, exponentLawCounterexample,
  factorIntegerQuadratic, generateSequences, inverseLinear, numericIntersections,
  polynomialFromRoots, quadraticRoots, rationalFunctionAnalysis, rationalRestrictions,
  solveAbsoluteValue, solveLinearEquation, solveLinearInequality, solveThreeByThree,
  syntheticDivide, validateEquivalentExpressions, validateRadicalCandidate, verifyEquationCandidates,
} from "./algebraEnhancementEngine";

describe("Algebra enhancement engine", () => {
  it("models signed tiles and zero-pair cancellation", () => {
    expect(algebraTiles(1, -2, 3)).toEqual({ positiveX2: 1, negativeX2: 0, positiveX: 0, negativeX: 2, positiveUnit: 3, negativeUnit: 0 });
    expect(cancelZeroPairs(5, 3)).toEqual({ positive: 2, negative: 0, cancelled: 3 });
  });

  it("expands and factors integer binomials", () => {
    expect(distributeBinomials(1, -1, 1, 2)).toEqual({ quadratic: 1, linear: 1, constant: -2 });
    expect(factorIntegerQuadratic(1, 1, -2)).not.toBeNull();
  });

  it("solves linear, inequality, absolute-value, and completed-square forms", () => {
    expect(solveLinearEquation(3, 6, 2, 0)).toEqual({ kind: "one", value: -6 });
    expect(solveLinearInequality(-2, 1, "<", 5)).toMatchObject({ boundary: -2, relation: ">", reversed: true });
    expect(solveAbsoluteValue(2, -1, 5)).toEqual([-2, 3]);
    expect(completeSquare(2, -8, 3)).toEqual({ a: 2, h: 2, k: -5 });
  });

  it("tracks rational restrictions and radical extraneous roots", () => {
    expect(rationalRestrictions([2, -1], [2])).toEqual({ excluded: [-1, 2], holes: [2], verticalAsymptotes: [-1] });
    expect(validateRadicalCandidate(4, (x) => Math.sqrt(x) - 2).valid).toBe(true);
  });

  it("supports composition, inverse, and piecewise domains", () => {
    expect(composeFunctions((x) => x + 1, (x) => x * x, 3)).toEqual({ fog: 10, gof: 16 });
    expect(inverseLinear(2, 4)?.evaluate(8)).toBe(2);
    expect(evaluatePiecewise(0, [{ from: 0, to: 1, includeFrom: true, value: (x) => x + 2 }])).toEqual({ matched: true, value: 2 });
  });

  it("links roots, coefficients, complex roots, and synthetic division", () => {
    expect(polynomialFromRoots([1, 2])).toEqual([1, -3, 2]);
    expect(quadraticRoots(1, 0, 1)).toEqual([{ real: -0, imaginary: -1 }, { real: -0, imaginary: 1 }]);
    expect(syntheticDivide([1, -3, 2], 1)).toEqual({ quotient: [1, -2], remainder: 0 });
  });

  it("analyzes rational functions and three-variable systems", () => {
    expect(rationalFunctionAnalysis([1], [1, 2], 1, 2).horizontalAsymptote).toBe(0);
    expect(solveThreeByThree([[1, 1, 1], [2, -1, 1], [1, 2, -1]], [6, 3, 2])?.map((x) => Math.round(x))).toEqual([1, 2, 3]);
  });

  it("finds nonlinear intersections numerically", () => {
    expect(numericIntersections((x) => x * x, () => 1, -2, 2)).toEqual(expect.arrayContaining([expect.closeTo(-1, 5), expect.closeTo(1, 5)]));
  });

  it("checks exponent laws and logarithm domains", () => {
    expect(exponentLawCounterexample(2, 3, 4, "product").valid).toBe(true);
    expect(exponentLawCounterexample(2, 3, 4, "sum").valid).toBe(false);
    expect(changeLogBase(8, 2, 10)?.inFromBase).toBeCloseTo(3);
    expect(changeLogBase(-1, 2, 10)).toBeNull();
  });

  it("generates and sums distinct sequence families", () => {
    expect(generateSequences(2, 3, 4)).toEqual({ arithmetic: [2, 5, 8, 11], geometric: [2, 6, 18, 54], recursive: [2, 5, 8, 11] });
    expect(arithmeticSeries(3, 4, 10)).toMatchObject({ last: 39, sum: 210 });
  });

  it("validates proof transformations and equation candidates", () => {
    expect(validateEquivalentExpressions((x) => (x + 1) ** 2, (x) => x * x + 2 * x + 1).equivalentOnSamples).toBe(true);
    expect(validateEquivalentExpressions((x) => x + 1, (x) => x + 2)).toMatchObject({ equivalentOnSamples: false });
    expect(verifyEquationCandidates([-1, 5], (x) => 2 * x * x - 8 * x - 10).every((result) => result.valid)).toBe(true);
  });
});
