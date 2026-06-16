import { describe, expect, it } from "vitest";
import {
  getPracticeQuestionsForConcept,
  hasDuplicateQuestionIds,
  trigPracticeQuestions,
  validateGraphMatch,
  validateMatchAnswer,
  validatePracticeAnswer,
} from "./TrigPracticeChallengeSystem";

describe("TrigPracticeChallengeSystem data and validation", () => {
  it("has unique question IDs", () => {
    expect(hasDuplicateQuestionIds()).toBe(false);
  });

  it("gives every question concept metadata, hints, and explanations", () => {
    for (const question of trigPracticeQuestions) {
      expect(question.id).toBeTruthy();
      expect(question.conceptId).toBeTruthy();
      expect(question.phaseOwner).toMatch(/^phase-/);
      expect(question.hints.length).toBeGreaterThan(0);
      expect(question.hints.length).toBeLessThanOrEqual(4);
      expect(question.explanation).toBeTruthy();
    }
  });

  it("validates MCQ answers", () => {
    const question = trigPracticeQuestions.find((item) => item.id === "uc-quadrant-signs");
    expect(question).toBeTruthy();
    expect(validatePracticeAnswer(question!, "qii")).toBe(true);
    expect(validatePracticeAnswer(question!, "qiv")).toBe(false);
  });

  it("validates formula-fill answers with acceptable variants", () => {
    const question = trigPracticeQuestions.find((item) => item.id === "identity-fill");
    expect(question).toBeTruthy();
    expect(validatePracticeAnswer(question!, "1")).toBe(true);
    expect(validatePracticeAnswer(question!, "one")).toBe(true);
    expect(validatePracticeAnswer(question!, "0")).toBe(false);
  });

  it("validates proof-step answer variants", () => {
    const question = trigPracticeQuestions.find((item) => item.id === "identity-proof-step");
    expect(question).toBeTruthy();
    expect(validatePracticeAnswer(question!, "1 + tan^2 theta = sec^2 theta")).toBe(true);
    expect(validatePracticeAnswer(question!, "tan^2 theta = sec^2 theta")).toBe(false);
  });

  it("validates click-match placements", () => {
    const question = trigPracticeQuestions.find((item) => item.id === "ratios-click-match");
    expect(question).toBeTruthy();
    expect(validateMatchAnswer(question!, {
      "sin theta": "vertical projection / opposite over hypotenuse",
      "cos theta": "horizontal projection / adjacent over hypotenuse",
      "tan theta": "slope / opposite over adjacent",
    })).toBe(true);
    expect(validateMatchAnswer(question!, {
      "sin theta": "horizontal projection / adjacent over hypotenuse",
      "cos theta": "vertical projection / opposite over hypotenuse",
      "tan theta": "slope / opposite over adjacent",
    })).toBe(false);
  });

  it("validates graph-match tolerance logic", () => {
    const target = { amplitude: 2, frequency: 2, phase: -Math.PI / 2, verticalShift: 1 };
    expect(validateGraphMatch({ amplitude: 2.1, frequency: 1.9, phase: -1.6, verticalShift: 1.1 }, target).matched).toBe(true);
    expect(validateGraphMatch({ amplitude: 1, frequency: 1.9, phase: -1.6, verticalShift: 1.1 }, target).matched).toBe(false);
  });

  it("covers undefined-value questions", () => {
    const question = trigPracticeQuestions.find((item) => item.type === "undefined-check");
    expect(question).toBeTruthy();
    expect(validatePracticeAnswer(question!, "sec")).toBe(true);
    expect(validatePracticeAnswer(question!, "csc")).toBe(false);
  });

  it("maps concept aliases to useful practice", () => {
    expect(getPracticeQuestionsForConcept("wave-amplitude").some((question) => question.type === "graph-match")).toBe(true);
    expect(getPracticeQuestionsForConcept("inverse-principal-values").some((question) => question.phaseOwner === "phase-08")).toBe(true);
    expect(getPracticeQuestionsForConcept("quadrant-signs").length).toBeGreaterThan(0);
  });
});
