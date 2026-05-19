import { ArrowLeft, Clock, Gauge } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const segments = location.pathname.split("/").filter(Boolean);
  useEffect(() => {
    document.title = `${title} | Math Universe`;
  }, [title]);
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-cyan-50 to-violet-100 p-6 shadow-glow dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950 md:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative">
          <ProgressBadge progress={progress} />
          <div className="mt-4 flex flex-wrap gap-2">
            {segments.length > 0 && (
              <button type="button" className="action-secondary min-h-10 px-3 py-2" onClick={() => navigate(-1)} title="Back to previous page">
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            {segments.length > 0 && <ShareSetupButton />}
          </div>
          <h1 className="mt-4 max-w-5xl text-3xl font-bold tracking-tight text-slate-950 md:text-5xl dark:text-white">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">{subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
            {difficulty && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 dark:bg-white/10">
                <Gauge className="h-4 w-4 text-cyan-500" />
                {difficulty}
              </span>
            )}
            {estimatedMinutes && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 dark:bg-white/10">
                <Clock className="h-4 w-4 text-violet-500" />
                {estimatedMinutes} min
              </span>
            )}
          </div>
          <div className="mt-6 h-1.5 max-w-sm overflow-hidden rounded-full bg-white/70 dark:bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          </div>
        </div>
      </div>
      {formula && <FormulaBlock title={formula.title} formula={formula.formula} explanation={formula.explanation} />}
    </div>
  );
}
