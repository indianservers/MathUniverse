import { describe, expect, it } from "vitest";
import {
  symbolicBinomialDist,
  symbolicBinomialCdf,
  symbolicBinomialCoefficient,
  symbolicCompleteSquare,
  symbolicComplexSolve,
  symbolicDefiniteIntegral,
  symbolicDenominator,
  symbolicDerivative,
  symbolicDeterminant,
  symbolicDivisors,
  symbolicDotProduct,
  symbolicEigenvalues,
  symbolicEigenvectors,
  symbolicEliminate,
  symbolicEquationSide,
  symbolicExpand,
  symbolicFactor,
  symbolicFactorial,
  symbolicFrequencyTable,
  symbolicGcd,
  symbolicIdentityMatrix,
  symbolicIsPrime,
  symbolicIntegral,
  symbolicImplicitDerivative,
  symbolicAdjointMatrix,
  symbolicCofactorMatrix,
  symbolicInverseLaplace,
  symbolicLaplace,
  symbolicLcm,
  symbolicListSummary,
  symbolicLimit,
  symbolicMatrixAdd,
  symbolicMatrixMultiply,
  symbolicMatrixRank,
  symbolicMatrixSubtract,
  symbolicMatrixSummary,
  symbolicMean,
  symbolicMedian,
  symbolicMin,
  symbolicModulo,
  symbolicMode,
  symbolicMax,
  symbolicNextPrime,
  symbolicNumericalIntegral,
  symbolicNumericSolve,
  symbolicNormal,
  symbolicNormalBetween,
  symbolicNormalPdf,
  symbolicOneSidedLimit,
  symbolicPartialFractions,
  symbolicPolynomialCoefficients,
  symbolicPolynomialDegree,
  symbolicPolynomialDivide,
  symbolicPrimeFactors,
  symbolicProduct,
  symbolicPreviousPrime,
  symbolicPercentile,
  symbolicQuartiles,
  symbolicRationalize,
  symbolicRange,
  symbolicProjection,
  symbolicRref,
  symbolicScalarMultiply,
  symbolicSimplify,
  symbolicSolve,
  symbolicSolveInequality,
  symbolicSolveOde,
  symbolicSampleVariance,
  symbolicStandardDeviation,
  symbolicSubstitute,
  symbolicSum,
  symbolicSystemSolve,
  symbolicTangentLine,
  symbolicTaylorPolynomial,
  symbolicTranspose,
  symbolicInverseMatrix,
  symbolicCrossProduct,
  symbolicNumerator,
  symbolicTrace,
  symbolicUnitVector,
  symbolicVariance,
  symbolicVectorAdd,
  symbolicVectorMagnitude,
  symbolicVectorScale,
  symbolicVectorSubtract,
  symbolicVerifyIdentity,
  trySymbolic,
} from "./symbolic";

describe("symbolic math engine", () => {
  it("expands, factors, and simplifies polynomial expressions", () => {
    const expanded = symbolicExpand("(x+2)*(x+3)").result;
    expect(expanded).toContain("x^2");
    expect(expanded).toContain("5*x");
    expect(expanded).toContain("6");
    expect(symbolicFactor("x^2-5*x+6").result).toContain("x");
    expect(symbolicSimplify("x+x+2").result).toContain("2*x");
  });

  it("derives and integrates common classroom expressions", () => {
    expect(symbolicDerivative("x^3-2*x").result).toContain("3*x^2");
    expect(symbolicIntegral("3*x^2").result).toContain("x^3");
    expect(symbolicIntegral("3*x^2").result).toContain("+C");
  });

  it("solves quadratics and safely reports unsupported symbolic work", () => {
    const solved = symbolicSolve("x^2-5*x+6=0").result;
    expect(solved).toContain("2");
    expect(solved).toContain("3");
    expect(trySymbolic(() => symbolicSolve("x+"))).toBeNull();
  });

  it("solves with domain and extraneous-root guardrails", () => {
    const rational = symbolicSolve("(x^2-1)/(x-1)=0");
    expect(rational.result).toBe("x = -1");
    expect(rational.restrictions).toContain("x-1 != 0 for denominators");
    expect(Array.isArray(rational.verification) ? rational.verification.join(" ") : "").toContain("Rejected x = 1");

    const logarithmic = symbolicSolve("log(x-1)=0");
    expect(logarithmic.result).toBe("x = 2");
    expect(logarithmic.restrictions).toContain("x-1 > 0 for logarithms");
    expect(Array.isArray(logarithmic.verification) ? logarithmic.verification.join(" ") : "").toContain("Verified x = 2");

    const absolute = symbolicSolve("abs(x-3)=2");
    expect(absolute.result).toContain("1");
    expect(absolute.result).toContain("5");
  });

  it("handles deeper CAS operations for limits, systems, substitution, division, and partial fractions", () => {
    expect(symbolicLimit("sin(x)/x", "x", "0").result).toBe("1");
    expect(symbolicSystemSolve(["x+y=5", "x-y=1"], ["x", "y"]).result).toContain("x = 3");
    expect(symbolicSubstitute("x^2+a", [{ name: "a", value: "3" }, { name: "x", value: "2" }]).result).toBe("7");
    expect(symbolicPolynomialDivide("x^3-1", "x-1").result).toContain("x^2");
    expect(symbolicPartialFractions("(3*x+5)/((x+1)(x+2))").result).toContain("/(x+");
  });

  it("supports Phase 2 algebra command helpers", () => {
    expect(symbolicPolynomialCoefficients("3*x^2+2*x+1").result).toBe("[3, 2, 1]");
    expect(symbolicPolynomialDegree("3*x^4+x").result).toBe("4");
    expect(symbolicCompleteSquare("x^2-6*x+5").result).toBe("(x-3)^2-4");
    expect(symbolicNumerator("(x+1)/(x-2)").result).toBe("x+1");
    expect(symbolicDenominator("(x+1)/(x-2)").result).toBe("x-2");
    expect(symbolicEquationSide("x+1=3", "left").result).toBe("x+1");
    expect(symbolicEquationSide("x+1=3", "right").result).toBe("3");
    expect(symbolicRationalize("1/sqrt(2)").result).toBe("sqrt(2)/2");
  });

  it("supports Phase 2 equation-solving helpers", () => {
    const numeric = symbolicNumericSolve("cos(x)=x");
    expect(numeric.result).toContain("0.739");

    const complex = symbolicComplexSolve("x^2+1=0");
    expect(complex.result).toContain("i");

    const inequality = symbolicSolveInequality("x^2<4");
    expect(inequality.result).toContain("-2");
    expect(inequality.result).toContain("2");

    const eliminated = symbolicEliminate(["x+y=5", "x-y=1", "y"]);
    expect(eliminated.result).toContain("x");
  });

  it("accepts student-style notation and common exact identities", () => {
    expect(symbolicSimplify("√(12)+√(27)").result).toBe("5*sqrt(3)");
    expect(symbolicSimplify("2π").result).toBe("2*pi");
    expect(symbolicSimplify("6 ÷ 3 + 2 × x").result).toContain("2*x");
    expect(symbolicSimplify("sin^2(x)+cos^2(x)").result).toBe("1");
  });

  it("computes definite integrals and tangent lines", () => {
    expect(symbolicDefiniteIntegral("x^2", "0", "2").result).toBe("8/3");
    const tangent = symbolicTangentLine("x^2", "3");
    expect(tangent.result).toBe("y = -9+6*x");
    expect(tangent.steps).toContain("Evaluate the slope: f'(3) = 6.");
  });

  it("supports Phase 3 calculus command helpers", () => {
    expect(symbolicOneSidedLimit("1/x", "x", "0", "above").result).toBe("∞");
    expect(symbolicOneSidedLimit("1/x", "x", "0", "below").result).toBe("-∞");
    expect(Number(symbolicNumericalIntegral("sin(x)", "0", "pi").result)).toBeCloseTo(2, 5);
    expect(symbolicImplicitDerivative("x^2+y^2=1", "x", "y").result).toContain("x");
    expect(symbolicImplicitDerivative("x^2+y^2=1", "x", "y").result).toContain("y");
    expect(symbolicTaylorPolynomial("sin(x)", "x", "0", "5").result).toContain("x^5");
    expect(symbolicLaplace("sin(t)", "t", "s").result).toBe("1/(s^2+1)");
    expect(symbolicInverseLaplace("1/(s^2+1)", "s", "t").result).toBe("sin(t)");
    expect(symbolicSolveOde("y'=y").result).toBe("y=C*e^x");
  });

  it("supports Phase 4 linear algebra command helpers", () => {
    expect(symbolicMatrixSummary("[[1,2],[3,4]]").result).toContain("2x2 matrix");
    expect(symbolicDeterminant("[[1,2],[3,4]]").result).toBe("-2");
    expect(symbolicTranspose("[[1,2],[3,4]]").result).toBe("[[1, 3], [2, 4]]");
    expect(symbolicInverseMatrix("[[1,2],[3,4]]").result).toContain("-2");
    expect(symbolicMatrixAdd("[[1,2],[3,4]]", "[[5,6],[7,8]]").result).toBe("[[6, 8], [10, 12]]");
    expect(symbolicMatrixSubtract("[[5,6],[7,8]]", "[[1,2],[3,4]]").result).toBe("[[4, 4], [4, 4]]");
    expect(symbolicMatrixMultiply("[[1,2],[3,4]]", "[[5,6],[7,8]]").result).toBe("[[19, 22], [43, 50]]");
    expect(symbolicScalarMultiply("2", "[[1,2],[3,4]]").result).toBe("[[2, 4], [6, 8]]");
    expect(symbolicTrace("[[1,2],[3,4]]").result).toBe("5");
    expect(symbolicIdentityMatrix("3").result).toBe("[[1, 0, 0], [0, 1, 0], [0, 0, 1]]");
    expect(symbolicCofactorMatrix("[[1,2],[3,4]]").result).toBe("[[4, -3], [-2, 1]]");
    expect(symbolicAdjointMatrix("[[1,2],[3,4]]").result).toBe("[[4, -2], [-3, 1]]");
    expect(symbolicRref("[[1,2,3],[4,5,6]]").result).toBe("[[1, 0, -1], [0, 1, 2]]");
    expect(symbolicMatrixRank("[[1,2],[2,4]]").result).toBe("1");
    expect(symbolicEigenvalues("[[2,0],[0,3]]").result).toContain("3");
    expect(symbolicEigenvectors("[[2,0],[0,3]]").result).toContain("λ=3");
    expect(symbolicVectorMagnitude("(3,4)").result).toBe("5");
    expect(symbolicUnitVector("(3,4)").result).toBe("[0.6, 0.8]");
    expect(symbolicVectorAdd("(1,2)", "(3,4)").result).toBe("[4, 6]");
    expect(symbolicVectorSubtract("(3,4)", "(1,2)").result).toBe("[2, 2]");
    expect(symbolicVectorScale("2", "(3,4)").result).toBe("[6, 8]");
    expect(symbolicProjection("(3,4)", "(1,0)").result).toBe("[3, 0]");
    expect(symbolicDotProduct("(1,2)", "(3,4)").result).toBe("11");
    expect(symbolicCrossProduct("(1,0,0)", "(0,1,0)").result).toBe("[0, 0, 1]");
  });

  it("supports Phase 5 data, probability, and number theory helpers", () => {
    expect(symbolicListSummary(["2", "4", "4", "9"]).result).toContain("mean=4.75");
    expect(symbolicSum(["2", "4", "4", "9"]).result).toBe("19");
    expect(symbolicProduct(["2", "4", "5"]).result).toBe("40");
    expect(symbolicMin(["2", "4", "4", "9"]).result).toBe("2");
    expect(symbolicMax(["2", "4", "4", "9"]).result).toBe("9");
    expect(symbolicRange(["2", "4", "4", "9"]).result).toBe("7");
    expect(symbolicMean(["2", "4", "4", "9"]).result).toBe("4.75");
    expect(symbolicMedian(["2", "4", "4", "9"]).result).toBe("4");
    expect(symbolicMode(["2", "3", "3", "5"]).result).toBe("[3]");
    expect(symbolicFrequencyTable(["2", "3", "3", "5"]).result).toBe("[[2, 1], [3, 2], [5, 1]]");
    expect(symbolicVariance(["2", "4", "4", "9"]).result).toBe("6.6875");
    expect(symbolicSampleVariance(["2", "4", "4", "9"]).result).toBe("8.916667");
    expect(Number(symbolicStandardDeviation(["2", "4", "4", "9"]).result)).toBeCloseTo(2.586, 3);
    expect(symbolicQuartiles(["2", "4", "4", "9", "10"]).result).toBe("[3, 4, 9.5]");
    expect(symbolicPercentile(["2", "4", "4", "9", "10", "0.75"]).result).toBe("9");
    expect(Number(symbolicNormal("0", "1", "1.96").result)).toBeCloseTo(0.975, 3);
    expect(Number(symbolicNormalPdf("0", "1", "0").result)).toBeCloseTo(0.3989, 4);
    expect(Number(symbolicNormalBetween("0", "1", "-1", "1").result)).toBeCloseTo(0.6827, 4);
    expect(Number(symbolicBinomialDist("10", "0.5", "3").result)).toBeCloseTo(0.1171875, 5);
    expect(Number(symbolicBinomialCdf("10", "0.5", "3").result)).toBeCloseTo(0.171875, 5);
    expect(symbolicGcd(["84", "30"]).result).toBe("6");
    expect(symbolicLcm(["12", "18"]).result).toBe("36");
    expect(symbolicIsPrime("97").result).toBe("true");
    expect(symbolicPrimeFactors("360").result).toBe("[2, 2, 2, 3, 3, 5]");
    expect(symbolicDivisors("28").result).toBe("[1, 2, 4, 7, 14, 28]");
    expect(symbolicNextPrime("100").result).toBe("101");
    expect(symbolicPreviousPrime("100").result).toBe("97");
    expect(symbolicModulo("17", "5").result).toBe("2");
    expect(symbolicFactorial("6").result).toBe("720");
    expect(symbolicBinomialCoefficient("10", "3").result).toBe("120");
  });

  it("verifies identities with exact and numeric fallback checks", () => {
    const exact = symbolicVerifyIdentity("x^2+2*x+1", "(x+1)^2");
    expect(exact.verification.equivalent).toBe(true);
    expect(exact.verification.method).toBe("exact");

    const trig = symbolicVerifyIdentity("tan(x)", "sin(x)/cos(x)");
    expect(trig.verification.equivalent).toBe(true);
    expect(trig.verification.method).toBe("numeric-sampling");

    const falseIdentity = symbolicVerifyIdentity("x+1", "x+2");
    expect(falseIdentity.verification.equivalent).toBe(false);
  });
});
