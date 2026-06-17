import { useState } from "react";

export type PredictionOption = {
  id: string;
  label: string;
  feedback: string;
  correct?: boolean;
};

export type PredictionPromptConfig = {
  question: string;
  options?: PredictionOption[];
  correctAnswer?: string;
  correctFeedback: string;
  incorrectFeedback: string;
  revealAfterAnswer?: boolean;
};

export function PredictionPrompt({ config, answered, onAnswered }: { config: PredictionPromptConfig; answered: boolean; onAnswered: (correct: boolean) => void }) {
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const submit = () => {
    const correct = config.options
      ? Boolean(config.options.find((option) => option.id === selected)?.correct)
      : text.trim().toLowerCase() === config.correctAnswer?.trim().toLowerCase();
    const optionFeedback = config.options?.find((option) => option.id === selected)?.feedback;
    setFeedback(correct ? config.correctFeedback : optionFeedback ?? config.incorrectFeedback);
    onAnswered(correct);
  };
  return (
    <section className="rounded-xl border border-cyan-200 bg-cyan-50/90 p-4 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10">
      <h2 className="text-base font-black text-slate-950 dark:text-white">Predict before reveal</h2>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-cyan-50">{config.question}</p>
      {config.options ? (
        <div className="mt-3 grid gap-2">
          {config.options.map((option) => (
            <label key={option.id} className="flex gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/35 dark:text-slate-100">
              <input type="radio" name={config.question} checked={selected === option.id} onChange={() => setSelected(option.id)} className="mt-1 h-4 w-4 accent-cyan-500" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <input value={text} onChange={(event) => setText(event.target.value)} className="mt-3 w-full rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm font-bold dark:border-cyan-300/20 dark:bg-slate-950" />
      )}
      <button type="button" onClick={submit} disabled={answered && Boolean(feedback)} className="mt-3 action-primary rounded-xl disabled:opacity-60">Submit prediction</button>
      {feedback ? <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-sm font-bold leading-6 text-slate-800 dark:bg-slate-950/35 dark:text-cyan-50">{feedback}</p> : null}
    </section>
  );
}
