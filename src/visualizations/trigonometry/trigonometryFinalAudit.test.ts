import { describe, expect, it } from "vitest";
import { getTrigonometryConcept, trigonometryConcepts } from "../../data/trigonometryConcepts";
import { evaluateAngleFormula, type AngleSumDifferenceFormulaId } from "./AngleSumDifferenceVisualizer";
import { evaluateCoreIdentity, type CoreIdentityId } from "./CoreIdentityProofVisualizer";
import { evaluateDoubleHalfFormula, type DoubleHalfFormulaId } from "./DoubleHalfAngleVisualizer";
import { evaluateInverseTrig, type InverseTrigId } from "./InverseTrigVisualizer";
import {
  evaluateTrigGraphPoint,
  getAmplitudeBounds,
  getPhaseShift,
  getTrigGraphPeriod,
  sampleTrigGraph,
  type GraphTransformState,
} from "./TrigGraphStudio";
import {
  getPracticeQuestionsForConcept,
  hasDuplicateQuestionIds,
  trigPracticeQuestions,
  validateGraphMatch,
  validatePracticeAnswer,
} from "./TrigPracticeChallengeSystem";
import { getTriangleSides, getTrigRatios } from "./TriangleCircleRatioVisualizer";

const importantRouteIds = [
  "unit-circle",
  "trigonometric-functions",
  "degree-radian",
  "special-angles",
  "quadrant-signs",
  "right-triangle-ratios",
  "reciprocal-ratios",
  "pythagorean-identity",
  "sum-difference",
  "double-angle",
  "half-angle",
  "sine-graph",
  "cosine-graph",
  "tangent-graph",
  "amplitude",
  "period-frequency",
  "phase-shift",
  "inverse-trig",
  "inverse-principal-values",
  "trig-equations",
  "general-solutions",
];

function expectFiniteOrNull(value: number | null) {
  if (value !== null) expect(Number.isFinite(value)).toBe(true);
}

describe("trigonometry final Phase 10 audit", () => {
  it("has unique concept ids and resolves all important route ids", () => {
    const ids = trigonometryConcepts.map((concept) => concept.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const concept of trigonometryConcepts) {
      expect(getTrigonometryConcept(concept.id)?.id).toBe(concept.id);
      expect(concept.title.trim()).not.toBe("");
      expect(concept.formula.trim()).not.toBe("");
    }

    for (const routeId of importantRouteIds) {
      expect(getTrigonometryConcept(routeId), routeId).toBeTruthy();
    }
  });

  it("keeps unit-circle and triangle ratios correct at standard angles", () => {
    const cases = [
      { deg: 0, sin: 0, cos: 1 },
      { deg: 30, sin: 0.5, cos: Math.sqrt(3) / 2 },
      { deg: 45, sin: Math.sqrt(2) / 2, cos: Math.sqrt(2) / 2 },
      { deg: 60, sin: Math.sqrt(3) / 2, cos: 0.5 },
      { deg: 90, sin: 1, cos: 0 },
    ];

    for (const item of cases) {
      const ratios = getTrigRatios(item.deg);
      expect(ratios.sin).toBeCloseTo(item.sin, 4);
      expect(ratios.cos).toBeCloseTo(item.cos, 4);
      if (Math.abs(item.cos) < 1e-6) expect(ratios.tan).toBeNull();
      else expect(ratios.tan).toBeCloseTo(item.sin / item.cos, 4);
    }

    const scaled = getTriangleSides(30, 10);
    expect(scaled.opposite).toBeCloseTo(5, 4);
    expect(scaled.adjacent).toBeCloseTo(10 * Math.sqrt(3) / 2, 4);
    expect(scaled.hypotenuse).toBeCloseTo(10, 4);
  });

  it("matches core identity evaluators where defined and reports undefined honestly", () => {
    const identities: CoreIdentityId[] = ["sin2-plus-cos2", "one-plus-tan2-sec2", "one-plus-cot2-csc2"];
    for (const identity of identities) {
      for (const theta of [0, 30, 45, 60, 90, 180, 270, 360]) {
        const result = evaluateCoreIdentity(identity, theta);
        if (result.defined) {
          expect(result.matched, `${identity} at ${theta}`).toBe(true);
          expectFiniteOrNull(result.lhs);
          expectFiniteOrNull(result.rhs);
        } else {
          expect(result.reason).toMatch(/division|require|evaluated/i);
        }
      }
    }
  });

  it("matches sum, difference, double, and half angle formulas where defined", () => {
    const sumFormulas: AngleSumDifferenceFormulaId[] = ["sin-add", "sin-sub", "cos-add", "cos-sub", "tan-add", "tan-sub"];
    for (const formula of sumFormulas) {
      for (const [a, b] of [[30, 45], [60, 30], [90, 45], [120, 30], [30, -45]]) {
        const result = evaluateAngleFormula(formula, a, b);
        if (result.defined) expect(result.matched, `${formula} at ${a},${b}`).toBe(true);
        else expect(result.reason).toContain("undefined");
      }
    }

    const doubleHalfFormulas: DoubleHalfFormulaId[] = [
      "sin-double",
      "cos-double-basic",
      "cos-double-sin",
      "cos-double-cos",
      "tan-double",
      "sin-half-square",
      "cos-half-square",
      "tan-half-sin-over-one-plus-cos",
      "tan-half-one-minus-cos-over-sin",
      "tan-half-radical",
    ];
    for (const formula of doubleHalfFormulas) {
      for (const theta of [0, 15, 30, 45, 60, 90, 120, 135, 180, 270, 360]) {
        const result = evaluateDoubleHalfFormula(formula, theta);
        if (result.defined) expect(result.matched, `${formula} at ${theta}`).toBe(true);
        else expect(result.reason).toBeTruthy();
      }
    }
  });

  it("keeps graph studio helpers finite and splits tangent asymptotes safely", () => {
    const states: GraphTransformState[] = [
      { fn: "sin", amplitude: 2, frequency: 1, phase: 0, verticalShift: 1 },
      { fn: "cos", amplitude: 1.5, frequency: 2, phase: Math.PI / 2, verticalShift: -1 },
      { fn: "tan", amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 },
    ];

    for (const state of states) {
      expectFiniteOrNull(evaluateTrigGraphPoint(state, 0));
      expectFiniteOrNull(getTrigGraphPeriod(state));
      expectFiniteOrNull(getPhaseShift(state));
      const bounds = getAmplitudeBounds(state);
      if (bounds) {
        expect(Number.isFinite(bounds.upper)).toBe(true);
        expect(Number.isFinite(bounds.lower)).toBe(true);
      }
      const samples = sampleTrigGraph(state, -Math.PI * 2, Math.PI * 2, 360);
      for (const sample of samples) expectFiniteOrNull(sample.y);
    }

    expect(evaluateTrigGraphPoint({ fn: "tan", amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 }, Math.PI / 2)).toBeNull();
  });

  it("keeps inverse trig domains and principal ranges correct", () => {
    const valid: Array<[InverseTrigId, number, number]> = [
      ["asin", 0.5, 30],
      ["acos", 0.5, 60],
      ["atan", 1, 45],
    ];
    for (const [id, input, expectedDeg] of valid) {
      const result = evaluateInverseTrig(id, input);
      expect(result.defined).toBe(true);
      expect(result.angleDeg).toBeCloseTo(expectedDeg, 3);
    }

    expect(evaluateInverseTrig("asin", 1.2).defined).toBe(false);
    expect(evaluateInverseTrig("acos", -1.2).defined).toBe(false);
    expect(evaluateInverseTrig("atan", 20).defined).toBe(true);
  });

  it("keeps practice questions unique, hinted, and answerable", () => {
    expect(hasDuplicateQuestionIds()).toBe(false);

    for (const question of trigPracticeQuestions) {
      expect(question.prompt.trim()).not.toBe("");
      expect(question.hints).toHaveLength(4);
      expect(question.explanation.trim()).not.toBe("");
      expect(validatePracticeAnswer(question, question.answer)).toBe(true);
    }

    for (const concept of ["unit-circle", "sine-graph", "inverse-trig", "trigonometric-functions"]) {
      expect(getPracticeQuestionsForConcept(concept).length).toBeGreaterThan(0);
    }

    expect(validateGraphMatch({ amplitude: 2, frequency: 2, phase: -Math.PI / 2, verticalShift: 1 }, { amplitude: 2, frequency: 2, phase: -Math.PI / 2, verticalShift: 1 }).matched).toBe(true);
  });
});
