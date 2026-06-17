import { describe, expect, it } from "vitest";
import { olympyardQuestions } from "./olympyardQuestions";
import {
  formatOlympyardTime,
  getWeakOlympyardTopics,
  getAdaptiveOlympyardTopics,
  initialOlympyardProgress,
  normalizeOlympyardProgress,
  selectOlympyardQuestions,
  summarizeOlympyardMastery,
  summarizeOlympyardSession,
  updateOlympyardProgress,
} from "./olympyardProgress";
import { buildPracticeSpine } from "./olympyardPracticeSpine";

describe("olympyard progress and mock test helpers", () => {
  it("normalizes legacy progress safely", () => {
    const progress = normalizeOlympyardProgress({ attempted: 2, correct: 1, streak: 1, badges: ["First 10 correct"] } as never);
    expect(progress.attempted).toBe(2);
    expect(progress.correct).toBe(1);
    expect(progress.topicMastery).toEqual({});
    expect(progress.mockHistory).toEqual([]);
  });

  it("updates totals, topic mastery, streak, and badges", () => {
    const firstQuestion = olympyardQuestions[0];
    const progress = updateOlympyardProgress(initialOlympyardProgress, Array.from({ length: 10 }, (_, index) => ({
      questionId: `${firstQuestion.id}-${index}`,
      topicId: firstQuestion.topicId,
      correct: true,
    })));

    expect(progress.attempted).toBe(10);
    expect(progress.correct).toBe(10);
    expect(progress.streak).toBe(10);
    expect(progress.topicMastery[firstQuestion.topicId].correct).toBe(10);
    expect(progress.badges).toContain("First 10 correct");
  });

  it("selects configured mock questions without exceeding the requested count", () => {
    const questions = selectOlympyardQuestions({
      mode: "mock",
      grade: "all",
      difficulty: "all",
      questionCount: 20,
    });

    expect(questions).toHaveLength(20);
    expect(new Set(questions.map((question) => question.topicId)).size).toBeGreaterThan(1);
  });

  it("supports weak area selection from local mastery", () => {
    const progress = updateOlympyardProgress(initialOlympyardProgress, [
      { questionId: "a", topicId: "geometry-reasoning", correct: false },
      { questionId: "b", topicId: "geometry-reasoning", correct: true },
      { questionId: "c", topicId: "patterns-sequences", correct: true },
      { questionId: "d", topicId: "patterns-sequences", correct: true },
    ]);

    const weak = getWeakOlympyardTopics(progress);
    expect(weak[0].topicId).toBe("geometry-reasoning");
    expect(selectOlympyardQuestions({ mode: "weak", grade: "all", difficulty: "all", questionCount: 10 }, progress).every((question) => question.topicId === "geometry-reasoning")).toBe(true);
  });

  it("selects adaptive questions from weak, undersampled, and new topic signals", () => {
    const progress = updateOlympyardProgress(initialOlympyardProgress, [
      { questionId: "a", topicId: "geometry-reasoning", correct: false },
      { questionId: "b", topicId: "geometry-reasoning", correct: false },
      { questionId: "c", topicId: "number-sense", correct: true },
      { questionId: "d", topicId: "number-sense", correct: true },
      { questionId: "e", topicId: "number-sense", correct: true },
    ]);

    const adaptiveTopics = getAdaptiveOlympyardTopics(progress, 3);
    const adaptiveQuestions = selectOlympyardQuestions({ mode: "adaptive", grade: "all", difficulty: "all", questionCount: 10 }, progress);

    expect(adaptiveTopics[0].topicId).toBe("geometry-reasoning");
    expect(adaptiveQuestions.length).toBeGreaterThan(0);
    expect(adaptiveQuestions.some((question) => question.topicId === "geometry-reasoning")).toBe(true);
  });

  it("builds the app-wide practice spine from Olympyard progress", () => {
    const progress = updateOlympyardProgress(initialOlympyardProgress, [
      { questionId: "a", topicId: "algebraic-thinking", correct: false },
      { questionId: "b", topicId: "algebraic-thinking", correct: true },
      { questionId: "c", topicId: "geometry-reasoning", correct: true },
      { questionId: "d", topicId: "geometry-reasoning", correct: true },
      { questionId: "e", topicId: "geometry-reasoning", correct: true },
    ]);
    const mastery = summarizeOlympyardMastery(progress);
    const spine = buildPracticeSpine(progress);

    expect(mastery.accuracy).toBe(80);
    expect(spine.primaryPracticeRoute).toContain("/olympyard/practice/");
    expect(spine.adaptiveRoute).toBe("/olympyard/mock-test?mode=adaptive");
    expect(spine.areaReadiness.some((area) => area.id === "algebra" && area.state === "review")).toBe(true);
  });

  it("summarizes sessions with topic breakdown and incorrect questions", () => {
    const questions = olympyardQuestions.slice(0, 3);
    const summary = summarizeOlympyardSession({
      [questions[0].id]: { questionId: questions[0].id, topicId: questions[0].topicId, correct: true },
      [questions[1].id]: { questionId: questions[1].id, topicId: questions[1].topicId, correct: false },
    }, questions, 125);

    expect(summary.score).toBe(1);
    expect(summary.attempted).toBe(2);
    expect(summary.accuracy).toBe(50);
    expect(summary.elapsedSeconds).toBe(125);
    expect(summary.incorrectQuestions).toHaveLength(1);
    expect(Object.keys(summary.topicBreakdown)).toContain(questions[0].topicId);
  });

  it("formats timer values", () => {
    expect(formatOlympyardTime(0)).toBe("0:00");
    expect(formatOlympyardTime(125)).toBe("2:05");
  });
});
