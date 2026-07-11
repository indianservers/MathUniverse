import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { checkNCERTPracticeAnswer } from "./ncertPracticeUtils";
import type { NCERTPracticeQuestion } from "./ncertPracticeTypes";
import { useNCERTMastery } from "../../../hooks/useNCERTMastery";

type NCERTPracticeCheckProps = {
  questions: NCERTPracticeQuestion[];
  title?: string;
  conceptId?: string;
  compact?: boolean;
  worksheetMode?: boolean;
  onProgress?: (event: { questionId: string; correct: boolean; difficulty: string }) => void;
};

export default function NCERTPracticeCheck({ questions, title = "Practice checker", conceptId, compact = false, worksheetMode = false, onProgress }: NCERTPracticeCheckProps) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "exam">("all");
  const filteredQuestions = questions.filter((item) => difficulty === "all" || item.difficulty === difficulty);
  const question = filteredQuestions[index % Math.max(1, filteredQuestions.length)] ?? filteredQuestions[0];
  const submitted = question?.choices ? choice : answer;
  const result = useMemo(() => question ? checkNCERTPracticeAnswer(submitted, question) : null, [question, submitted]);
  const mastery = useNCERTMastery(conceptId ?? question?.conceptId);

  if (!question) return null;

  const clearAnswer = () => {
    setAnswer("");
    setChoice("");
    setChecked(false);
    setShowExplanation(false);
  };

  const nextQuestion = () => {
    setIndex((current) => (current + 1) % filteredQuestions.length);
    clearAnswer();
  };

  const previousQuestion = () => {
    setIndex((current) => (current - 1 + filteredQuestions.length) % filteredQuestions.length);
    clearAnswer();
  };

  const randomQuestion = () => {
    setIndex((current) => (current + 3) % filteredQuestions.length);
    clearAnswer();
  };

  const checkAnswer = () => {
    const checkedResult = checkNCERTPracticeAnswer(submitted, question);
    setChecked(true);
    setShowExplanation(true);
    mastery.recordAttempt(question.difficulty ?? "easy", checkedResult.ok);
    onProgress?.({ questionId: question.id, correct: checkedResult.ok, difficulty: question.difficulty ?? "easy" });
  };

  return (
    <section className={`rounded-2xl border border-emerald-200 bg-emerald-50 ${compact ? "p-3" : "p-4"} dark:border-emerald-300/20 dark:bg-emerald-300/10 ${worksheetMode ? "print:bg-white print:text-black" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-800 dark:bg-slate-950 dark:text-emerald-100">
            {index + 1} / {filteredQuestions.length}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-800 dark:bg-slate-950 dark:text-cyan-100">
            {mastery.status} {mastery.percent}%
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(["all", "easy", "medium", "exam"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setDifficulty(item);
              setIndex(0);
              clearAnswer();
            }}
            className={difficulty === item ? "action-primary px-3 py-2 text-xs" : "action-secondary px-3 py-2 text-xs"}
          >
            {item === "all" ? "All" : item}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-black leading-6 text-slate-800 dark:text-slate-100">{question.prompt}</p>
      {question.choices ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Answer choices">
          {question.choices.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setChoice(item);
                setChecked(false);
              }}
              className={choice === item ? "action-primary" : "action-secondary"}
              aria-pressed={choice === item}
            >
              {item}
            </button>
          ))}
        </div>
      ) : (
        <input
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setChecked(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") setChecked(true);
          }}
          className="mt-3 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-3 font-mono font-black dark:border-emerald-300/20 dark:bg-slate-900"
          placeholder="Type your answer"
          aria-label="Practice answer"
        />
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="action-primary" onClick={checkAnswer}>Check answer</button>
        <button type="button" className="action-secondary" onClick={previousQuestion}>Previous</button>
        <button type="button" className="action-secondary" onClick={nextQuestion}>Next question</button>
        <button type="button" className="action-secondary" onClick={randomQuestion}>Random</button>
        <button type="button" className="action-secondary" onClick={() => setShowHint((current) => !current)}>Hint</button>
        {conceptId && (
          <button
            type="button"
            className="action-secondary"
            onClick={() => {
              if (window.confirm("Reset local mastery for this concept?")) mastery.reset();
            }}
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
      <p className={`mt-3 text-sm font-bold leading-6 ${checked && result?.ok ? "text-emerald-700 dark:text-emerald-200" : "text-slate-700 dark:text-slate-200"}`} aria-live="polite">
        {checked && result ? result.message : showHint ? `Hint: ${question.hint}` : "Try it first, then reveal a hint if needed."}
      </p>
      {showExplanation && (
        <div className="mt-3 rounded-2xl bg-white/80 p-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-slate-950/40 dark:text-slate-100">
          <span className="font-black">Explanation: </span>{question.explanation}
        </div>
      )}
    </section>
  );
}
