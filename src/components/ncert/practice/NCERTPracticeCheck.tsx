import { useMemo, useState } from "react";
import { checkNCERTPracticeAnswer } from "./ncertPracticeUtils";
import type { NCERTPracticeQuestion } from "./ncertPracticeTypes";

type NCERTPracticeCheckProps = {
  questions: NCERTPracticeQuestion[];
  title?: string;
};

export default function NCERTPracticeCheck({ questions, title = "Practice checker" }: NCERTPracticeCheckProps) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const question = questions[index] ?? questions[0];
  const submitted = question?.choices ? choice : answer;
  const result = useMemo(() => question ? checkNCERTPracticeAnswer(submitted, question) : null, [question, submitted]);

  if (!question) return null;

  const nextQuestion = () => {
    setIndex((current) => (current + 1) % questions.length);
    setAnswer("");
    setChoice("");
    setChecked(false);
  };

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-800 dark:bg-slate-950 dark:text-emerald-100">
          {index + 1} / {questions.length}
        </span>
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
        <button type="button" className="action-primary" onClick={() => setChecked(true)}>Check answer</button>
        <button type="button" className="action-secondary" onClick={nextQuestion}>Next question</button>
      </div>
      <p className={`mt-3 text-sm font-bold leading-6 ${checked && result?.ok ? "text-emerald-700 dark:text-emerald-200" : "text-slate-700 dark:text-slate-200"}`} aria-live="polite">
        {checked && result ? result.message : `Hint: ${question.hint}`}
      </p>
    </section>
  );
}
