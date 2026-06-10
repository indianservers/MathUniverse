import type { ClassroomLesson, LessonStep } from "./classroomAuthoring";

export type PracticeResponse = {
  stepId: string;
  answer: string;
  checkedAt?: number;
  score?: number;
  feedback?: string;
};

export type PracticeReport = {
  score: number;
  answered: number;
  totalChecks: number;
  correct: number;
  status: "not-started" | "in-progress" | "mastered";
};

const assessableKinds = new Set<LessonStep["kind"]>(["question", "check"]);

export function isAssessableStep(step: LessonStep) {
  return assessableKinds.has(step.kind);
}

function tokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+\-*/^.= ]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 || /^[0-9]+$/.test(token));
}

export function evaluatePracticeResponse(step: LessonStep, answer: string): PracticeResponse {
  const trimmed = answer.trim();
  if (!trimmed) {
    return { stepId: step.id, answer, checkedAt: Date.now(), score: 0, feedback: "Add a response before checking this step." };
  }

  if (!step.expected?.trim()) {
    const score = trimmed.length >= 20 ? 100 : 60;
    return {
      stepId: step.id,
      answer,
      checkedAt: Date.now(),
      score,
      feedback: score === 100 ? "Response captured with enough detail." : "Good start. Add a mathematical reason or comparison.",
    };
  }

  const expectedTokens = tokens(step.expected);
  const answerTokens = new Set(tokens(trimmed));
  const matched = expectedTokens.filter((token) => answerTokens.has(token));
  const coverage = expectedTokens.length ? matched.length / expectedTokens.length : 0;
  const score = Math.min(100, Math.round(coverage * 100));

  return {
    stepId: step.id,
    answer,
    checkedAt: Date.now(),
    score,
    feedback: score >= 70
      ? "Matches the expected reasoning closely enough to move on."
      : "Compare your response with the expected idea and include the missing mathematical language.",
  };
}

export function computePracticeReport(lesson: ClassroomLesson, responses: Record<string, PracticeResponse>): PracticeReport {
  const assessable = lesson.steps.filter(isAssessableStep);
  const totalChecks = assessable.length;
  const checkedResponses = assessable
    .map((step) => responses[step.id])
    .filter((response): response is PracticeResponse => Boolean(response?.answer.trim()));
  const answered = checkedResponses.length;
  const scored = checkedResponses.map((response) => response.score ?? 0);
  const score = totalChecks ? Math.round(scored.reduce((sum, value) => sum + value, 0) / totalChecks) : 0;
  const correct = scored.filter((value) => value >= 70).length;
  const status = totalChecks === 0 || answered === 0 ? "not-started" : answered === totalChecks && score >= 80 ? "mastered" : "in-progress";
  return { score, answered, totalChecks, correct, status };
}

export function practiceStatusLabel(status: PracticeReport["status"]) {
  if (status === "mastered") return "Mastery ready";
  if (status === "in-progress") return "Practice in progress";
  return "Practice not started";
}

export function practiceReportText(lesson: ClassroomLesson, responses: Record<string, PracticeResponse>, report: PracticeReport) {
  const lines = [
    lesson.title,
    `Objective: ${lesson.objective}`,
    `Audience: ${lesson.audience}`,
    `Assessment: ${practiceStatusLabel(report.status)} (${report.score}%)`,
    `Answered: ${report.answered}/${report.totalChecks}`,
    `Correct: ${report.correct}/${report.totalChecks}`,
    "",
    "Responses",
  ];

  lesson.steps.filter(isAssessableStep).forEach((step, index) => {
    const response = responses[step.id];
    lines.push(`${index + 1}. ${step.title}`);
    lines.push(`Prompt: ${step.prompt}`);
    lines.push(`Answer: ${response?.answer.trim() || "[blank]"}`);
    lines.push(`Score: ${response?.score ?? 0}%`);
    lines.push(`Feedback: ${response?.feedback ?? "Not checked yet."}`);
    lines.push("");
  });

  return lines.join("\n");
}
