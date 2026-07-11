import type { NCERTPracticeQuestion, NCERTPracticeResult } from "./ncertPracticeTypes";

export function normalizePracticeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function checkNCERTPracticeAnswer(input: string, question: NCERTPracticeQuestion): NCERTPracticeResult {
  const commonMistake = question.commonMistakes?.find((mistake) => {
    if (typeof mistake.answer === "number") {
      const value = Number(input);
      return Number.isFinite(value) && Math.abs(value - mistake.answer) <= (question.tolerance ?? 0.001);
    }
    return normalizePracticeText(input) === normalizePracticeText(mistake.answer);
  });
  if (commonMistake) return { ok: false, message: commonMistake.feedback, matchedCommonMistake: true };

  const expected = question.answer;
  if (Array.isArray(expected)) {
    const ok = expected.map(normalizePracticeText).includes(normalizePracticeText(input));
    return result(ok, question);
  }
  if (typeof expected === "number") {
    const value = Number(input);
    if (!Number.isFinite(value)) return { ok: false, message: question.commonMistake ?? "Use a number for this answer." };
    const tolerance = question.tolerance ?? 0.001;
    return result(Math.abs(value - expected) <= tolerance, question);
  }
  return result(normalizePracticeText(input) === normalizePracticeText(expected), question);
}

function result(ok: boolean, question: NCERTPracticeQuestion): NCERTPracticeResult {
  return {
    ok,
    message: ok ? `Correct. ${question.explanation}` : question.commonMistake ?? `Not yet. Hint: ${question.hint}`,
    matchedCommonMistake: false,
  };
}
