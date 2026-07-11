import type { NCERTPracticeQuestion } from "../practice/ncertPracticeTypes";

export function selectWorksheetQuestions(questions: NCERTPracticeQuestion[], difficulty: string, count: number) {
  const filtered = questions.filter((question) => difficulty === "all" || question.difficulty === difficulty);
  return filtered.slice(0, Math.max(1, count));
}

export function printableAnswer(answer: NCERTPracticeQuestion["answer"]) {
  return Array.isArray(answer) ? answer.join(" / ") : String(answer);
}
