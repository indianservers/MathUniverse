import { describe, expect, it } from "vitest";
import {
  analyzeQuadratic,
  analyzeSlopeSystem,
  angularDiameterOfSphere,
  areaBetweenCurves,
  canonicalModulo,
  centralDerivative,
  circleMetrics,
  classifySolarEclipseAngular,
  coordinateMetrics,
  diskOverlapFraction,
  eulerStep,
  evaluatePolynomial,
  isPerfectSquareInteger,
  normalizeRational,
  leastCommonMultiple,
  quadraticResidual,
  rightTriangleMetrics,
  simpsonIntegral,
  similarityMetrics,
  sinusoidMetrics,
  triangleMetrics,
  unitCirclePoint,
} from "./coreAccuracyOracles";

describe("Phase 1 mathematical accuracy oracles", () => {
  it("classifies quadratics and verifies every real root", () => {
    for (const coefficients of [[1, -5, 6], [1, -2, 1], [1, 0, 1]] as const) {
      const [a, b, c] = coefficients;
      const result = analyzeQuadratic(a, b, c);
      for (const root of result.realRoots) expect(Math.abs(quadraticResidual(a, b, c, root))).toBeLessThan(1e-10);
    }
    expect(analyzeQuadratic(0, 2, -4)).toMatchObject({ kind: "linear", realRoots: [2] });
  });

  it("classifies line systems and verifies residuals", () => {
    expect(analyzeSlopeSystem(1, 2, -1, 4)).toMatchObject({ kind: "unique", x: 1, y: 3, residual1: 0, residual2: 0 });
    expect(analyzeSlopeSystem(2, 1, 2, -3)).toMatchObject({ kind: "parallel" });
    expect(analyzeSlopeSystem(2, 1, 2, 1)).toEqual({ kind: "identical" });
  });

  it("uses exact rational and perfect-square classification", () => {
    expect(normalizeRational(-18, 24)).toEqual({ numerator: -3, denominator: 4 });
    expect(normalizeRational(18, -24)).toEqual({ numerator: -3, denominator: 4 });
    expect(() => normalizeRational(1, 0)).toThrow(/zero/);
    expect(isPerfectSquareInteger(49)).toBe(true);
    expect(isPerfectSquareInteger(50)).toBe(false);
    expect(leastCommonMultiple(6, 8)).toBe(24);
    expect(canonicalModulo(-1, 5)).toBe(4);
    expect(evaluatePolynomial([1, -5, 6], 3)).toBe(0);
  });

  it("preserves geometry invariants", () => {
    expect(triangleMetrics(2, 3, 5).valid).toBe(false);
    const triangle = triangleMetrics(3, 4, 5);
    expect(triangle.valid).toBe(true);
    if (triangle.valid) {
      expect(triangle.area).toBeCloseTo(6, 12);
      expect(triangle.angleSum).toBeCloseTo(Math.PI, 12);
    }
    expect(Math.abs(rightTriangleMetrics(5, 12).squaredResidual)).toBeLessThan(1e-10);
    expect(circleMetrics(2, Math.PI / 2)).toMatchObject({ arcLength: Math.PI, sectorArea: Math.PI });
    expect(coordinateMetrics([1, 2], [4, 6])).toEqual({ distance: 5, midpoint: [2.5, 4], slope: 4 / 3 });
    expect(similarityMetrics([3, 4, 5], [6, 8, 10])).toEqual({ similar: true, scale: 2 });
  });

  it("preserves trigonometric and calculus invariants", () => {
    for (let index = -12; index <= 12; index += 1) expect(Math.abs(unitCirclePoint(index * Math.PI / 7).radiusResidual)).toBeLessThan(1e-12);
    expect(sinusoidMetrics(-3, 2, 4, 1)).toEqual({ amplitude: 3, period: Math.PI, phaseShift: -2, range: [-2, 4] });
    expect(centralDerivative((x) => x * x, 3)).toBeCloseTo(6, 7);
    expect(simpsonIntegral((x) => x * x, 0, 1)).toBeCloseTo(1 / 3, 10);
    expect(areaBetweenCurves((x) => x, (x) => x * x, 0, 1)).toBeCloseTo(1 / 6, 10);
    expect(eulerStep((_x, y) => y, 0, 1, 0.5)).toEqual({ x: 0.5, y: 1.5 });
  });

  it("classifies eclipse boundaries from angular disk geometry", () => {
    expect(classifySolarEclipseAngular(0.53, 0.56, 0)).toBe("total");
    expect(classifySolarEclipseAngular(0.53, 0.49, 0)).toBe("annular");
    expect(classifySolarEclipseAngular(0.53, 0.52, 0.2)).toBe("partial");
    expect(classifySolarEclipseAngular(0.53, 0.52, 0.525)).toBe("none");
    expect(diskOverlapFraction(1, 0.5, 0)).toBeCloseTo(0.25, 12);
    expect(angularDiameterOfSphere(1, 2)).toBeCloseTo(Math.PI / 3, 12);
  });
});
