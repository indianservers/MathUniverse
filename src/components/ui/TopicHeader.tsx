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
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-cyan-100/80 bg-white/[.88] px-3 py-2.5 shadow-lg shadow-cyan-100/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/[.78] dark:shadow-black/20">
        <ProgressBadge progress={progress} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-950 dark:text-white">{title}</h1>
          <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {difficulty && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
              <Gauge className="h-3.5 w-3.5 text-cyan-500" />
              {difficulty}
            </span>
          )}
          {estimatedMinutes && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-100">
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
