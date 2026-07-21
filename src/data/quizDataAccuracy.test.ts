import { describe, expect, it } from "vitest";
import { quizData, quizTopicCounts, quizTopics } from "./quizData";
import { uniquePracticeSession, validateQuizBank } from "./quizDataAccuracy";

describe("Phase 2 question-bank integrity", () => {
  it("gives every generated item complete deterministic assessment metadata", () => {
    expect(quizData.length).toBeGreaterThan(500);
    expect(validateQuizBank(quizData)).toEqual([]);
  });

  it("keeps 75 unique variants per topic", () => {
    for (const topic of quizTopics) {
      expect(quizTopicCounts[topic]).toBe(75);
      const topicQuestions = quizData.filter((question) => question.topic === topic);
      expect(new Set(topicQuestions.map((question) => question.id)).size).toBe(75);
    }
  });

  it("builds deterministic sessions without duplicate questions", () => {
    const first = uniquePracticeSession(quizData, 30, 42);
    const again = uniquePracticeSession(quizData, 30, 42);
    expect(first.map((question) => question.id)).toEqual(again.map((question) => question.id));
    expect(new Set(first.map((question) => question.id)).size).toBe(30);
  });
});
