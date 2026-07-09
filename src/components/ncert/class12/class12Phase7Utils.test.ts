import { describe, expect, it } from "vitest";
import { classifyContinuityCase, derivativeRuleStep } from "./class12CalculusUtils";
import { cofactor3, cramer2, det2, det3, inverse2, multiplyMatrixVector2 } from "./class12DeterminantUtils";
import { applyInitialConditionForGrowth, classifyDifferentialEquation, differentialEquationPreset } from "./class12DifferentialEquationsUtils";
import { integrationPresetStepper } from "./class12IntegrationUtils";
import { feasibleCorners, optimizeCorners } from "./class12LppUtils";
import { bayesPosterior } from "./class12ProbabilityUtils";
import { composeRelations, functionClassifier, relationPropertyReport } from "./class12RelationsUtils";
import { angleBetween, cross, directionCosines, dot, projectionLength, shortestDistanceSkew } from "./class12Vectors3DUtils";

describe("Class 12 Phase 7 utilities", () => {
  it("checks relation properties, function classification, and composition", () => {
    const equivalence = relationPropertyReport(["A", "B"], [["A", "A"], ["B", "B"], ["A", "B"], ["B", "A"]]);
    expect(equivalence.equivalence).toBe(true);
    const classifier = functionClassifier(["A", "B"], ["1", "2"], [["A", "1"], ["B", "1"]]);
    expect(classifier.isFunction).toBe(true);
    expect(classifier.oneOne).toBe(false);
    expect(classifier.onto).toBe(false);
    expect(composeRelations([["A", "B"]], [["B", "C"]])).toEqual([["A", "C"]]);
  });

  it("computes determinants, cofactors, inverse, and Cramer verification", () => {
    expect(det2([[2, 3], [1, 4]])).toBe(5);
    expect(det3([[1, 2, 3], [0, 1, 4], [5, 6, 0]])).toBe(1);
    expect(cofactor3([[1, 2, 3], [0, 1, 4], [5, 6, 0]], 0, 1)).toBe(20);
    const inverse = inverse2([[2, 1], [1, 1]]);
    expect(inverse?.[0][0]).toBeCloseTo(1);
    const solution = cramer2([[2, 1], [1, 1]], [5, 3]);
    expect(solution?.x).toBeCloseTo(2);
    expect(solution?.y).toBeCloseTo(1);
    expect(multiplyMatrixVector2([[2, 1], [1, 1]], [2, 1])).toEqual([5, 3]);
  });

  it("classifies continuity and returns derivative-rule steppers", () => {
    expect(classifyContinuityCase("corner").continuous).toBe(true);
    expect(classifyContinuityCase("corner").differentiable).toBe(false);
    expect(derivativeRuleStep("chain")).toContain("Multiply by the derivative of the inner function.");
  });

  it("returns supported integration presets without acting as a full CAS", () => {
    const preset = integrationPresetStepper("substitution-cos-x2");
    expect(preset.answer).toBe("sin(x^2) + C");
    expect(integrationPresetStepper("area-between").answer).toBe("1/6");
  });

  it("classifies and verifies supported differential equations", () => {
    expect(classifyDifferentialEquation("dy/dx + y = e^x")).toEqual({ order: 1, degree: 1 });
    expect(differentialEquationPreset("growth").solution).toBe("y = C e^(kx)");
    expect(applyInitialConditionForGrowth(2, 0, 3).c).toBe(3);
  });

  it("computes vector products, projections, direction cosines, and skew distance", () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32);
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
    expect(angleBetween([1, 0, 0], [0, 1, 0])).toBeCloseTo(Math.PI / 2);
    expect(projectionLength([3, 4, 0], [1, 0, 0])).toBe(3);
    expect(directionCosines([3, 0, 4])).toEqual([0.6, 0, 0.8]);
    expect(shortestDistanceSkew([0, 0, 0], [1, 0, 0], [0, 1, 1], [0, 1, 0])).toBe(1);
  });

  it("computes Bayes posterior and LPP corner optimization", () => {
    const bayes = bayesPosterior(0.01, 0.95, 0.05);
    expect(bayes.posterior).toBeCloseTo(0.161, 2);
    const corners = feasibleCorners([
      { a: 1, b: 1, c: 4, relation: "<=" },
      { a: 1, b: 0, c: 3, relation: "<=" },
      { a: 0, b: 1, c: 3, relation: "<=" },
    ]);
    const optimum = optimizeCorners(corners, [3, 2]);
    expect(optimum?.point).toEqual([3, 1]);
    expect(optimum?.value).toBe(11);
  });
});
