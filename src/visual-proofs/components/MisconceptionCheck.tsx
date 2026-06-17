import { Lightbulb } from "lucide-react";
import { useState } from "react";
import type { PredictionOption } from "./PredictionPrompt";

export type MisconceptionCheckConfig = {
  question: string;
  options: PredictionOption[];
  explanation: string;
  visualHint: string;
};

export function MisconceptionCheck({ config, onShowHint }: { config: MisconceptionCheckConfig; onShowHint?: () => void }) {
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const answer = () => {
    const option = config.options.find((item) => item.id === selected);
    setCorrect(Boolean(option?.correct));
    setFeedback(option?.correct ? config.explanation : option?.feedback ?? "Try again using the visual invariant.");
  };
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-950 shadow-sm dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-50" data-misconception-check="true">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5" aria-hidden="true" />
        <h2 className="text-base font-black">Misconception check</h2>
      </div>
      <p className="mt-2 text-sm font-bold leading-6">{config.question}</p>
      <div className="mt-3 grid gap-2">
        {config.options.map((option) => (
          <label key={option.id} className="flex gap-2 rounded-lg bg-white/75 px-3 py-2 text-sm font-bold text-amber-950 dark:bg-slate-950/35 dark:text-amber-100">
            <input type="radio" name={config.question} checked={selected === option.id} onChange={() => setSelected(option.id)} className="mt-1 h-4 w-4 accent-amber-500" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="action-primary rounded-xl" onClick={answer}>Check answer</button>
        {!correct && feedback ? <button type="button" className="action-secondary rounded-xl" onClick={() => { setSelected(""); setFeedback(null); }}>Try again</button> : null}
        <button type="button" className="action-secondary rounded-xl" onClick={onShowHint}>Show visual hint</button>
      </div>
      {feedback ? <p className="mt-3 rounded-lg bg-white/75 px-3 py-2 text-sm font-bold leading-6 text-amber-950 dark:bg-slate-950/35 dark:text-amber-100">{feedback}</p> : null}
      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-100">{config.visualHint}</p>
    </section>
  );
}
