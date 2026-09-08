import { describe, expect, it } from "vitest";
import * as calc from "./calculusEnhancementEngine";

describe("Calculus enhancement engine", () => {
  it("covers limits and continuity with explicit classifications", () => {
    const band = calc.epsilonDelta((x) => x * x, 2, 4, .1);
    expect(band?.delta).toBeGreaterThan(.01);
    expect(Math.abs((2 + band!.delta) ** 2 - 4)).toBeLessThan(.1);
    expect(calc.oneSidedLimits((x) => x * x, 2).exists).toBe(true);
    expect(calc.sequenceLimit((n) => 1 / n, 0).finalError).toBeLessThan(1e-5);
    expect(calc.classifyDiscontinuity(2, 2)).toBe("removable");
    expect(calc.lhopitalEligibility({ numeratorLimit: 0, denominatorLimit: 0, differentiableNearby: true, derivativeDenominatorNonzero: true }).eligible).toBe(true);
  });

  it("covers differential and application tools", () => {
    expect(calc.secantToTangent((x) => x * x, 2, .001).tangent).toBeCloseTo(4, 4);
    expect(calc.derivativeRuleTree("sin(x^2)").rule).toBe("chain");
    expect(calc.derivativeRuleTree("sin(1*x^2+2*x)")).toMatchObject({ rule: "chain", outer: "sin", children: ["1*x^2+2*x"] });
    expect(calc.implicitCircleTangent(3, 4, 5)).toMatchObject({ slope: -.75, residual: 0 });
    expect(calc.polynomialMotion([1, 0, 0, 0], 2)).toEqual({ position: 8, velocity: 12, acceleration: 12, jerk: 6 });
    expect(calc.linearization(Math.sqrt, (x) => 1 / (2 * Math.sqrt(x)), 4, 4.1).error).toBeLessThan(.001);
    expect(calc.circleRelatedRates(3, 2).areaRate).toBeCloseTo(12 * Math.PI);
    expect(calc.rectangleOptimization(20)).toEqual({ width: 5, height: 5, maximumArea: 25 });
    expect(calc.meanValuePointQuadratic(1, 0, 0, 4)?.c).toBe(2);
  });

  it("covers accumulation and integration techniques", () => {
    expect(calc.ftcAccumulator((x) => x * x, 0, 2).residual).toBeLessThan(1e-6);
    expect(calc.riemannComparison((x) => x, 0, 1, 100).trapezoid).toBeCloseTo(.5);
    expect(calc.adaptiveIntegral(Math.sin, 0, Math.PI).value).toBeCloseTo(2, 6);
    expect(calc.substitutionBounds((x) => x * x, 2, 3).transformed).toEqual([4, 9]);
    expect(calc.integrationByParts((x) => x, Math.exp, () => 1, 0, 1).value).toBeCloseTo(1, 6);
    expect(calc.partialFractionsLinear(0, 1, 1, 2)).toEqual({ A: -1, B: 1 });
    expect(calc.improperPIntegral(2)).toMatchObject({ converges: true, value: 1 });
    expect(calc.revolutionVolumes(() => 2, 0, 3).washers).toBeCloseTo(12 * Math.PI);
  });

  it("covers ODEs, series, Taylor error, and vector theorems", () => {
    const methods = calc.odeMethodComparison((_x, y) => y, 0, 1, 1, 100);
    expect(methods.rk4).toBeCloseTo(Math.E, 7);
    expect(Math.abs(methods.rk4 - Math.E)).toBeLessThan(Math.abs(methods.euler - Math.E));
    expect(calc.convergenceTest({ kind: "p-series", parameter: 2 }).converges).toBe(true);
    expect(calc.taylorApproximation("exp", 1, 8).error).toBeLessThan(.0001);
    expect(calc.divergenceFluxLinear({ pX: 2, qY: 3 }, { width: 4, height: 5 }).flux).toBe(100);
  });
});
