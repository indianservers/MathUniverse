import { describe, expect, it } from "vitest";
import {
  hasOnlyFiniteQuestionValues,
  filterOlympyardQuestions,
  olympyardQuestions,
  olympyardTopicQuestionCounts,
  revealNextHintCount,
  sampleOlympyardQuestions,
  solutionRevealState,
  validateOlympyardAnswer,
  type OlympyardQuestion,
} from "../../data/olympyardQuestions";
import { olympyardTopics } from "../../data/olympyardTopics";

const byType = (type: OlympyardQuestion["type"]) => olympyardQuestions.find((question) => question.type === type)!;

describe("Olympyard question engine", () => {
  it("has a strong starter bank with topic coverage", () => {
    const counts = olympyardTopicQuestionCounts();

    expect(olympyardQuestions.length).toBeGreaterThanOrEqual(120);
    expect(olympyardTopics.every((topic) => (counts[topic.id] ?? 0) >= 6)).toBe(true);
  });

  it("keeps question metadata complete and valid", () => {
    const ids = new Set(olympyardQuestions.map((question) => question.id));

    expect(ids.size).toBe(olympyardQuestions.length);
    expect(olympyardQuestions.every((question) => question.topicId && question.gradeBand && question.difficulty && question.type)).toBe(true);
    expect(olympyardQuestions.every((question) => question.prompt.trim().length > 0)).toBe(true);
    expect(olympyardQuestions.every((question) => String(question.answer).length > 0)).toBe(true);
    expect(olympyardQuestions.every((question) => question.hints.length >= 3)).toBe(true);
    expect(olympyardQuestions.every((question) => question.solutionSteps.length >= 2)).toBe(true);
    expect(olympyardQuestions.every((question) => Boolean(question.commonMistake))).toBe(true);
    expect(olympyardQuestions.every(hasOnlyFiniteQuestionValues)).toBe(true);
  });

  it("ensures every MCQ-style question has a correct choice", () => {
    const choiceQuestions = olympyardQuestions.filter((question) => ["mcq", "visual-mcq", "geometry-marker"].includes(question.type));

    expect(choiceQuestions.length).toBeGreaterThan(0);
    expect(choiceQuestions.every((question) => question.choices?.some((choice) => choice.correct))).toBe(true);
  });

  it("filters questions by grade and difficulty", () => {
    const gradeFiltered = filterOlympyardQuestions(olympyardQuestions, "class-3-4", "all");
    const difficultyFiltered = filterOlympyardQuestions(olympyardQuestions, "all", "advanced");

    expect(gradeFiltered.length).toBeGreaterThan(0);
    expect(gradeFiltered.every((question) => question.gradeBand === "class-3-4")).toBe(true);
    expect(difficultyFiltered.length).toBeGreaterThan(0);
    expect(difficultyFiltered.every((question) => question.difficulty === "advanced")).toBe(true);
  });

  it("validates MCQ answers", () => {
    const question = byType("mcq");

    expect(validateOlympyardAnswer(question, "a").correct).toBe(true);
    expect(validateOlympyardAnswer(question, "b").correct).toBe(false);
  });

  it("validates numeric answers with tolerance", () => {
    const question = byType("numeric");
    const answer = Number(question.answer);

    expect(validateOlympyardAnswer(question, String(answer)).correct).toBe(true);
    expect(validateOlympyardAnswer(question, String(answer + 2)).correct).toBe(false);
    expect(validateOlympyardAnswer({ ...question, tolerance: 0.5 }, answer + 0.4).correct).toBe(true);
  });

  it("validates click-match answers", () => {
    const question = byType("click-match");

    expect(validateOlympyardAnswer(question, { half: "fifty", quarter: "twentyfive", threequarter: "seventyfive" }).correct).toBe(true);
    expect(validateOlympyardAnswer(question, { half: "twentyfive", quarter: "fifty", threequarter: "seventyfive" }).correct).toBe(false);
  });

  it("validates pattern and step-fill style answers", () => {
    const pattern = byType("pattern");
    const stepFill: OlympyardQuestion = {
      ...pattern,
      id: "test-step-fill",
      type: "step-fill",
      answer: ["add 3", "12"],
      stepFill: { steps: ["Rule", "Missing term"], blanks: ["add 3", "12"] },
    };

    expect(validateOlympyardAnswer(pattern, pattern.answer).correct).toBe(true);
    expect(validateOlympyardAnswer(stepFill, ["Add 3", "12"]).correct).toBe(true);
    expect(validateOlympyardAnswer(stepFill, ["Add 2", "11"]).correct).toBe(false);
  });

  it("progresses hints one at a time", () => {
    expect(revealNextHintCount(0, 4)).toBe(1);
    expect(revealNextHintCount(3, 4)).toBe(4);
    expect(revealNextHintCount(4, 4)).toBe(4);
  });

  it("opens solution reveal after attempt or explicit request", () => {
    expect(solutionRevealState(false, false)).toBe(false);
    expect(solutionRevealState(false, true)).toBe(true);
    expect(solutionRevealState(false, false, true)).toBe(true);
  });

  it("keeps Phase 2 sample exports small and finite", () => {
    const ids = new Set(sampleOlympyardQuestions.map((question) => question.id));

    expect(ids.size).toBe(sampleOlympyardQuestions.length);
    expect(sampleOlympyardQuestions.length).toBe(5);
    expect(sampleOlympyardQuestions.length).toBeLessThanOrEqual(5);
    expect(sampleOlympyardQuestions.every(hasOnlyFiniteQuestionValues)).toBe(true);
  });
});
