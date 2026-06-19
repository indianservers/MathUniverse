import { useMemo, useState } from "react";
import { formatTrigNumber } from "../../utils/trigFormulaUtils";

type PracticeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

const practiceQuestions: PracticeQuestion[] = [
  {
    id: "segment-sin",
    prompt: "Which highlighted part is sin theta?",
    options: ["Vertical height", "Horizontal base", "Unit radius"],
    answer: "Vertical height",
    explanation: "sin theta is the y-coordinate, so it appears as the vertical height.",
  },
  {
    id: "identity-fill",
    prompt: "Complete the identity: sin^2 theta + cos^2 theta = ___",
    options: ["1", "tan theta", "0"],
    answer: "1",
    explanation: "The unit-circle radius is 1, so base^2 + height^2 equals 1.",
  },
  {
    id: "predict-45",
    prompt: "At theta = 45 degrees, what is sin theta approximately?",
    options: ["0.707", "1", "0.5"],
    answer: "0.707",
    explanation: `At 45 degrees, sin theta is about ${formatTrigNumber(Math.SQRT1_2)}.`,
  },
  {
    id: "compare-30",
    prompt: "Which is larger at theta = 30 degrees: sin theta or cos theta?",
    options: ["cos theta", "sin theta", "They are equal"],
    answer: "cos theta",
    explanation: "At 30 degrees, sin theta = 0.5 and cos theta is about 0.866.",
  },
  {
    id: "tan-undefined",
    prompt: "Why does tan theta become undefined at 90 degrees?",
    options: ["cos theta is 0", "sin theta is 0", "the radius is 0"],
    answer: "cos theta is 0",
    explanation: "tan theta = sin theta / cos theta, and division by zero is undefined.",
  },
];

export default function FormulaPracticeMode() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(() => new Set());
  const [correctIds, setCorrectIds] = useState<Set<string>>(() => new Set());
  const question = practiceQuestions[questionIndex] ?? practiceQuestions[0];
  const isCorrect = selectedAnswer === question.answer;

  const score = useMemo(() => correctIds.size, [correctIds]);

  const answerQuestion = (answer: string) => {
    setSelectedAnswer(answer);
    setAnsweredIds((previous) => new Set(previous).add(question.id));
    if (answer === question.answer) {
      setCorrectIds((previous) => new Set(previous).add(question.id));
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setQuestionIndex((index) => (index + 1) % practiceQuestions.length);
  };

  const retry = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnsweredIds(new Set());
    setCorrectIds(new Set());
  };

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60"
      data-testid="formula-practice-mode"
      aria-label="Formula practice mode"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Practice Mode</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Quick concept check</h2>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-400/10">
          <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Score</p>
          <p className="font-mono text-lg font-black text-emerald-900 dark:text-emerald-50" data-testid="practice-score">
            {score}/{practiceQuestions.length}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Question {questionIndex + 1} of {practiceQuestions.length}
        </p>
        <p className="mt-2 text-base font-black text-slate-950 dark:text-white" data-testid="practice-question">
          {question.prompt}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-black text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:bg-emerald-400/10"
              onClick={() => answerQuestion(option)}
              data-testid={`practice-answer-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              aria-pressed={selectedAnswer === option}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-3 min-h-16" aria-live="polite">
          {selectedAnswer ? (
            <div
              className={isCorrect ? "rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-50" : "rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-900 dark:border-rose-300/25 dark:bg-rose-400/10 dark:text-rose-50"}
              data-testid="practice-feedback"
            >
              <p className="font-black">{isCorrect ? "Correct" : "Try again"}</p>
              <p className="mt-1 text-sm leading-6">{question.explanation}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose an answer to see feedback instantly.</p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="action-primary min-h-10 rounded-lg py-2" onClick={nextQuestion} data-testid="practice-next">
            Next question
          </button>
          <button type="button" className="action-secondary min-h-10 rounded-lg py-2" onClick={retry} data-testid="practice-retry">
            Retry
          </button>
          <span className="mini-chip" data-testid="practice-progress">
            {answeredIds.size} attempted
          </span>
        </div>
      </div>
    </section>
  );
}

export { practiceQuestions };
