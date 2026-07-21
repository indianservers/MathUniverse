import type { QuizQuestion } from "./quizData";

export type QuizIntegrityIssue = { questionId: string; field: string; message: string };

export function validateQuizQuestion(question: QuizQuestion): QuizIntegrityIssue[] {
  const issues: QuizIntegrityIssue[] = [];
  const add = (field: string, message: string) => issues.push({ questionId: question.id, field, message });
  if (!/^[a-z0-9-]+$/.test(question.id)) add("id", "Stable lowercase ID required.");
  if (!question.conceptId || !question.subskill || !question.gradeBand) add("taxonomy", "Concept, subskill, and grade are required.");
  if (!question.misconceptionTag) add("misconceptionTag", "Known misconception tag required.");
  if (question.options.length !== 4 || new Set(question.options).size !== 4) add("options", "Exactly four unique options are required.");
  if (question.correctAnswerIndex < 0 || question.correctAnswerIndex >= question.options.length) add("correctAnswerIndex", "Oracle index is out of range.");
  if (question.answerOracle.kind !== "option-index" || question.answerOracle.value !== question.correctAnswerIndex) add("answerOracle", "Stored oracle must match the answer key.");
  if (question.hints.length !== 2 || question.hints.some((hint) => !hint.trim())) add("hints", "Two nonempty hint levels are required.");
  if (!question.explanation.trim() || !question.scoringRubric.fullCredit || !question.scoringRubric.noCredit) add("solution", "Explanation and scoring rubric are required.");
  if (question.distractorRationales.length !== question.options.length || question.distractorRationales.some((reason) => !reason.trim())) add("distractors", "Every option needs rationale or misconception feedback.");
  return issues;
}

export function validateQuizBank(questions: QuizQuestion[]) {
  const issues = questions.flatMap(validateQuizQuestion);
  const ids = new Set<string>();
  for (const question of questions) {
    if (ids.has(question.id)) issues.push({ questionId: question.id, field: "id", message: "Duplicate question ID." });
    ids.add(question.id);
  }
  return issues;
}

export function uniquePracticeSession(questions: QuizQuestion[], count: number, seed = 0) {
  if (!Number.isInteger(count) || count < 0) throw new Error("Session count must be a nonnegative integer.");
  const unique = [...new Map(questions.map((question) => [question.id, question])).values()];
  if (count > unique.length) throw new Error("Requested session exceeds unique question count.");
  return [...unique].sort((a, b) => stableHash(`${a.id}:${seed}`) - stableHash(`${b.id}:${seed}`)).slice(0, count);
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  return hash >>> 0;
}
