import { describe, expect, it } from "vitest";

import { createCasNotebookRow, evaluateCasInput, evaluateCasNotebookRows } from "./casResult";

describe("casResult foundation", () => {
  it("executes implemented CAS commands through the existing symbolic engine", () => {
    const factor = evaluateCasInput("Factor[x^2-5*x+6]");
    const limit = evaluateCasInput("Limit[sin(x)/x, x, 0]");

    expect(factor.status).toBe("ok");
    expect(factor.exact).toContain("x");
    expect(factor.latex).toBeTruthy();
    expect(factor.linkedViews).toContain("Graph");
    expect(limit.exact).toBe("1");
  });

  it("keeps numeric mode separate from exact output", () => {
    const result = evaluateCasInput("Numeric[sqrt(34)]", { mode: "numeric" });

    expect(result.status).toBe("ok");
    expect(result.exact).toBe("sqrt(34)");
    expect(result.numeric).toBe("5.830952");
    expect(result.summary).toBe("5.830952");
  });

  it("returns useful command recovery feedback before execution", () => {
    const typo = evaluateCasInput("Derivitive[x^2]");
    const wrongArity = evaluateCasInput("Substitute[x^2+a]");

    expect(typo.status).toBe("error");
    expect(typo.warnings.join(" ")).toContain("Derivative");
    expect(wrongArity.status).toBe("error");
    expect(wrongArity.summary).toContain("Substitute expects");
  });

  it("keeps unavailable CAS commands framed as current product boundaries", () => {
    const unknown = evaluateCasInput("HyperbolicCompass[triangle]");

    expect(unknown.status).toBe("error");
    expect(`${unknown.summary} ${unknown.detail} ${unknown.warnings.join(" ")}`).not.toMatch(/not implemented|coming soon|placeholder/i);
    expect(unknown.summary).toContain("Unknown CAS command");
  });

  it("executes Phase 2 algebra and equation commands through the CAS notebook evaluator", () => {
    const coefficients = evaluateCasInput("Coefficients[3*x^2+2*x+1]");
    const root = evaluateCasInput("Root[x^2-5*x+6]");
    const rootList = evaluateCasInput("RootList[x^2-5*x+6]");
    const polynomial = evaluateCasInput("Polynomial[1,2,3]");
    const complexRoot = evaluateCasInput("ComplexRoot[x^2+1]");
    const polar = evaluateCasInput("ToPolar[3+4i]");
    const nsolve = evaluateCasInput("NSolve[cos(x)=x]");
    const inequality = evaluateCasInput("SolveInequality[x^2<4]");
    const rationalized = evaluateCasInput("Rationalize[1/sqrt(2)]");

    expect(coefficients.status).toBe("ok");
    expect(coefficients.exact).toBe("[3, 2, 1]");
    expect(root.exact).toContain("2");
    expect(root.exact).toContain("3");
    expect(rootList.exact).toContain("[2, 0]");
    expect(polynomial.exact).toBe("x^3-6*x^2+11*x-6");
    expect(complexRoot.exact).toContain("i");
    expect(polar.exact).toBe("[5, 0.927295]");
    expect(nsolve.status).toBe("ok");
    expect(nsolve.exact).toContain("0.739");
    expect(inequality.status).toBe("ok");
    expect(inequality.exact).toContain("-2");
    expect(inequality.exact).toContain("2");
    expect(rationalized.exact).toBe("sqrt(2)/2");
  });

  it("executes Phase 3 calculus commands through the CAS notebook evaluator", () => {
    const rightLimit = evaluateCasInput("LimitAbove[1/x, x, 0]");
    const numericIntegral = evaluateCasInput("NIntegral[sin(x), 0, pi, x]");
    const implicit = evaluateCasInput("ImplicitDerivative[x^2+y^2=1, x, y]");
    const taylor = evaluateCasInput("TaylorPolynomial[sin(x), x, 0, 5]");
    const laplace = evaluateCasInput("Laplace[sin(t), t, s]");

    expect(rightLimit.status).toBe("ok");
    expect(rightLimit.exact).toBe("∞");
    expect(numericIntegral.status).toBe("ok");
    expect(Number(numericIntegral.exact)).toBeCloseTo(2, 5);
    expect(implicit.status).toBe("ok");
    expect(implicit.exact).toContain("x");
    expect(taylor.exact).toContain("x^5");
    expect(laplace.exact).toBe("1/(s^2+1)");
  });

  it("executes Phase 4 linear algebra commands through the CAS notebook evaluator", () => {
    const determinant = evaluateCasInput("Determinant[[1,2],[3,4]]");
    const matrixAdd = evaluateCasInput("MatrixAdd[[[1,2],[3,4]], [[5,6],[7,8]]]");
    const matrixProduct = evaluateCasInput("MatrixMultiply[[[1,2],[3,4]], [[5,6],[7,8]]]");
    const trace = evaluateCasInput("Trace[[1,2],[3,4]]");
    const identity = evaluateCasInput("IdentityMatrix[3]");
    const characteristic = evaluateCasInput("CharacteristicPolynomial[[1,2],[3,4]]");
    const lu = evaluateCasInput("LUDecomposition[[4,3],[6,3]]");
    const qr = evaluateCasInput("QRDecomposition[[1,1],[1,0]]");
    const svd = evaluateCasInput("SVD[[3,0],[0,2]]");
    const rref = evaluateCasInput("RREF[[1,2,3],[4,5,6]]");
    const rank = evaluateCasInput("MatrixRank[[1,2],[2,4]]");
    const eigenvalues = evaluateCasInput("Eigenvalues[[2,0],[0,3]]");
    const magnitude = evaluateCasInput("Magnitude[(3,4)]");
    const projection = evaluateCasInput("Projection[(3,4),(1,0)]");
    const dot = evaluateCasInput("Dot[(1,2),(3,4)]");
    const cross = evaluateCasInput("Cross[(1,0,0),(0,1,0)]");

    expect(determinant.status).toBe("ok");
    expect(determinant.exact).toBe("-2");
    expect(matrixAdd.exact).toBe("[[6, 8], [10, 12]]");
    expect(matrixProduct.exact).toBe("[[19, 22], [43, 50]]");
    expect(trace.exact).toBe("5");
    expect(identity.exact).toContain("[1, 0, 0]");
    expect(characteristic.exact).toContain("lambda^2");
    expect(lu.exact).toContain("L=");
    expect(qr.exact).toContain("Q=");
    expect(svd.exact).toContain("3");
    expect(rref.status).toBe("ok");
    expect(rref.exact).toContain("[1, 0");
    expect(rank.exact).toBe("1");
    expect(eigenvalues.exact).toContain("3");
    expect(magnitude.exact).toBe("5");
    expect(projection.exact).toBe("[3, 0]");
    expect(dot.exact).toBe("11");
    expect(cross.exact).toBe("[0, 0, 1]");
  });

  it("executes Phase 5 data, probability, and number theory commands through the CAS notebook evaluator", () => {
    const sum = evaluateCasInput("Sum[2,4,4,9]");
    const mode = evaluateCasInput("Mode[2,3,3,5]");
    const range = evaluateCasInput("Range[2,4,4,9]");
    const frequency = evaluateCasInput("FrequencyTable[2,3,3,5]");
    const mean = evaluateCasInput("Mean[2,4,4,9]");
    const median = evaluateCasInput("Median[2,4,4,9]");
    const variance = evaluateCasInput("Variance[2,4,4,9]");
    const stdev = evaluateCasInput("StandardDeviation[2,4,4,9]");
    const quartiles = evaluateCasInput("Quartiles[2,4,4,9,10]");
    const percentile = evaluateCasInput("Percentile[2,4,4,9,10,0.75]");
    const normal = evaluateCasInput("Normal[0,1,1.96]");
    const normalPdf = evaluateCasInput("NormalPDF[0,1,0]");
    const normalBetween = evaluateCasInput("NormalBetween[0,1,-1,1]");
    const binomial = evaluateCasInput("BinomialDist[10,0.5,3]");
    const binomialCdf = evaluateCasInput("BinomialCdf[10,0.5,3]");
    const poisson = evaluateCasInput("Poisson[3,2]");
    const exponential = evaluateCasInput("Exponential[2,1]");
    const gamma = evaluateCasInput("Gamma[2,3,4]");
    const chiSquared = evaluateCasInput("ChiSquared[4,5]");
    const tDist = evaluateCasInput("TDistribution[10,1.5]");
    const fDist = evaluateCasInput("FDistribution[5,10,2]");
    const cauchy = evaluateCasInput("Cauchy[0,1,0]");
    const hyper = evaluateCasInput("HyperGeometric[20,7,5,2]");
    const pascal = evaluateCasInput("Pascal[3,0.5,5]");
    const weibull = evaluateCasInput("Weibull[2,3,4]");
    const zipf = evaluateCasInput("Zipf[10,1.2,3]");
    const gcd = evaluateCasInput("GCD[84,30]");
    const factors = evaluateCasInput("PrimeFactors[360]");
    const divisors = evaluateCasInput("Divisors[28]");
    const nextPrime = evaluateCasInput("NextPrime[100]");
    const factorial = evaluateCasInput("Factorial[6]");
    const choose = evaluateCasInput("NCr[10,3]");

    expect(sum.exact).toBe("19");
    expect(mode.exact).toBe("[3]");
    expect(range.exact).toBe("7");
    expect(frequency.exact).toBe("[[2, 1], [3, 2], [5, 1]]");
    expect(mean.status).toBe("ok");
    expect(mean.exact).toBe("4.75");
    expect(median.exact).toBe("4");
    expect(variance.exact).toBe("6.6875");
    expect(Number(stdev.exact)).toBeCloseTo(2.586, 3);
    expect(quartiles.exact).toBe("[3, 4, 9.5]");
    expect(percentile.exact).toBe("9");
    expect(Number(normal.exact)).toBeCloseTo(0.975, 3);
    expect(Number(normalPdf.exact)).toBeCloseTo(0.3989, 4);
    expect(Number(normalBetween.exact)).toBeCloseTo(0.6827, 4);
    expect(Number(binomial.exact)).toBeCloseTo(0.1171875, 5);
    expect(Number(binomialCdf.exact)).toBeCloseTo(0.171875, 5);
    expect(Number(poisson.exact)).toBeCloseTo(0.224, 3);
    expect(Number(exponential.exact)).toBeCloseTo(0.8647, 3);
    expect(gamma.status).toBe("ok");
    expect(Number(chiSquared.exact)).toBeCloseTo(0.71, 2);
    expect(Number(tDist.exact)).toBeGreaterThan(0.9);
    expect(Number(fDist.exact)).toBeGreaterThan(0.8);
    expect(cauchy.exact).toBe("0.5");
    expect(Number(hyper.exact)).toBeGreaterThan(0);
    expect(Number(pascal.exact)).toBeCloseTo(0.1875, 4);
    expect(Number(weibull.exact)).toBeGreaterThan(0.8);
    expect(Number(zipf.exact)).toBeGreaterThan(0);
    expect(gcd.exact).toBe("6");
    expect(factors.exact).toBe("[2, 2, 2, 3, 3, 5]");
    expect(divisors.exact).toBe("[1, 2, 4, 7, 14, 28]");
    expect(nextPrime.exact).toBe("101");
    expect(factorial.exact).toBe("720");
    expect(choose.exact).toBe("120");
  });

  it("executes Phase 6 seeded random commands reproducibly", () => {
    const between = evaluateCasInput("RandomBetween[1,6,42]");
    const betweenAgain = evaluateCasInput("RandomBetween[1,6,42]");
    const uniform = evaluateCasInput("RandomUniform[0,1,3,42]");
    const normal = evaluateCasInput("RandomNormal[0,1,3,42]");
    const binomial = evaluateCasInput("RandomBinomial[10,0.5,5,42]");
    const poisson = evaluateCasInput("RandomPoisson[3,5,42]");
    const element = evaluateCasInput("RandomElement[red,blue,green,42]");
    const polynomial = evaluateCasInput("RandomPolynomial[3,-5,5,42]");

    expect(between.status).toBe("ok");
    expect(between.exact).toBe(betweenAgain.exact);
    expect(Number(between.exact)).toBeGreaterThanOrEqual(1);
    expect(Number(between.exact)).toBeLessThanOrEqual(6);
    expect(uniform.exact).toContain("[");
    expect(normal.exact).toContain("[");
    expect(binomial.exact).toContain("[");
    expect(poisson.exact).toContain("[");
    expect(["red", "blue", "green"]).toContain(element.exact);
    expect(polynomial.exact).toContain("x^3");
  });

  it("executes remaining GeoGebra parity commands with concrete CAS output", () => {
    const element = evaluateCasInput("Element[[10,20,30],2]");
    const first = evaluateCasInput("First[[10,20,30],2]");
    const take = evaluateCasInput("Take[[10,20,30,40],2,3]");
    const sequence = evaluateCasInput("Sequence[n^2,n,1,4]");
    const covariance = evaluateCasInput("Covariance[[1,2,3],[2,4,6]]");
    const fitPoly = evaluateCasInput("FitPoly[[[1,2],[2,5],[3,10]],2]");
    const fitExp = evaluateCasInput("FitExp[[[1,2],[2,4],[3,8]]]");
    const divisorsSum = evaluateCasInput("DivisorsSum[28]");
    const extended = evaluateCasInput("ExtendedGCD[84,30]");
    const modexp = evaluateCasInput("ModularExponent[3,13,7]");
    const mixed = evaluateCasInput("MixedNumber[17/5]");
    const dimension = evaluateCasInput("Dimension[[1,2],[3,4]]");
    const jordan = evaluateCasInput("JordanDiagonalization[[2,0],[0,3]]");
    const minimal = evaluateCasInput("MinimalPolynomial[[2,0],[0,3]]");
    const perpendicular = evaluateCasInput("PerpendicularVector[(3,4)]");
    const groebner = evaluateCasInput("GroebnerLex[x+y-3,x-y-1]");
    const intersect = evaluateCasInput("Intersect[y=x,y=2*x-1]");

    expect(element.exact).toBe("20");
    expect(first.exact).toBe("[10, 20]");
    expect(take.exact).toBe("[20, 30]");
    expect(sequence.exact).toBe("[1, 4, 9, 16]");
    expect(Number(covariance.exact)).toBeCloseTo(1.333333, 5);
    expect(fitPoly.exact).toContain("x^2");
    expect(fitExp.exact).toContain("e^");
    expect(divisorsSum.exact).toBe("56");
    expect(extended.exact).toBe("[6, -1, 3]");
    expect(modexp.exact).toBe("3");
    expect(mixed.exact).toBe("3 2/5");
    expect(dimension.exact).toBe("[2, 2]");
    expect(jordan.exact).toContain("D=");
    expect(minimal.exact).toContain("lambda^2");
    expect(perpendicular.exact).toBe("[-4, 3]");
    expect(groebner.exact).toContain("-3+x+y");
    expect(intersect.exact).toBe("[[1, 1]]");
  });

  it("evaluates notebook rows with assignments and row references", () => {
    const rows = [
      createCasNotebookRow("a := 3"),
      createCasNotebookRow("Simplify[a*x + 2]"),
      createCasNotebookRow("Expand[$2*(x+1)]"),
    ];

    const evaluated = evaluateCasNotebookRows(rows);

    expect(evaluated[0].result?.summary).toBe("a := 3");
    expect(evaluated[1].result?.dependencies).toContain("a := 3");
    expect(evaluated[1].result?.exact).toContain("3*x");
    expect(evaluated[2].result?.dependencies).toContain("row 2");
    expect(evaluated[2].result?.status).toBe("ok");
  });

  it("records assumptions as first-class CAS results", () => {
    const evaluated = evaluateCasNotebookRows([
      createCasNotebookRow("Assume[x real]"),
      createCasNotebookRow("Solve[x^2-4=0]"),
    ]);

    expect(evaluated[0].result?.assumptions).toContain("x real");
    expect(evaluated[1].result?.assumptions).toContain("x real");
  });
});
