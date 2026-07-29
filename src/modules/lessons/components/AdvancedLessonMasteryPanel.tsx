import { CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";

const storagePrefix = "math-universe-advanced-mastery";

export default function AdvancedLessonMasteryPanel({ lesson }: { lesson: AdvancedConceptLesson }) {
  const storageKey = `${storagePrefix}:${lesson.id}`;
  const checks = useMemo(() => [
    `I can explain the main idea of ${lesson.title} without reading the notes.`,
    `I can use the interactive lab or studio to test a meaningful example.`,
    `I can answer both assessment prompts for ${lesson.strand}.`,
    "I can name one limitation of what the visualization shows.",
  ], [lesson.strand, lesson.title]);
  const [completed, setCompleted] = useState<boolean[]>(() => checks.map(() => false));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as boolean[];
      setCompleted(checks.map((_, index) => Boolean(parsed[index])));
    } catch {
      setCompleted(checks.map(() => false));
    }
  }, [checks, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [completed, storageKey]);

  const doneCount = completed.filter(Boolean).length;
  const percent = Math.round((doneCount / checks.length) * 100);

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-300/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-black uppercase text-emerald-800 dark:text-emerald-100">Mastery check</h2>
          <p className="mt-1 text-xs font-semibold text-emerald-900 dark:text-emerald-100">{doneCount}/{checks.length} ready - {percent}%</p>
        </div>
        <button className="rounded-full bg-white p-2 text-emerald-700 shadow-sm transition hover:bg-emerald-100 dark:bg-white/10 dark:text-emerald-100" type="button" onClick={() => setCompleted(checks.map(() => false))} aria-label="Reset mastery checks">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white dark:bg-slate-950/60">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-3 space-y-2">
        {checks.map((check, index) => (
          <li key={check}>
            <button
              type="button"
              className="flex w-full items-start gap-2 rounded-xl bg-white/80 p-2 text-left text-sm font-semibold leading-5 text-slate-700 transition hover:bg-white dark:bg-slate-950/50 dark:text-slate-200"
              onClick={() => setCompleted((current) => current.map((item, itemIndex) => itemIndex === index ? !item : item))}
            >
              {completed[index] ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
              <span>{check}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
