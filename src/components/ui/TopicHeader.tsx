import { Clock, Gauge } from "lucide-react";
import { useEffect } from "react";
import FormulaBlock from "./FormulaBlock";
import ProgressBadge from "./ProgressBadge";
import { ShareSetupButton } from "./UiFeedback";

type TopicHeaderProps = {
  title: string;
  subtitle: string;
  difficulty?: string;
  estimatedMinutes?: number;
  formula?: { title: string; formula: string; explanation?: string };
  progress?: number;
};

export default function TopicHeader({ title, subtitle, difficulty, estimatedMinutes, formula, progress = 0 }: TopicHeaderProps) {
  useEffect(() => {
    document.title = `${title} | Math Universe`;
  }, [title]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/60 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
        <ProgressBadge progress={progress} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h1>
          <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {difficulty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <Gauge className="h-3.5 w-3.5 text-cyan-500" />
              {difficulty}
            </span>
          )}
          {estimatedMinutes && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-violet-500" />
              {estimatedMinutes} min
            </span>
          )}
          <ShareSetupButton />
        </div>
      </div>
      {formula && <FormulaBlock title={formula.title} formula={formula.formula} explanation={formula.explanation} />}
    </div>
  );
}
