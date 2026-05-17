import { clsx } from "clsx";

type ProgressBadgeProps = {
  progress: number;
};

export default function ProgressBadge({ progress }: ProgressBadgeProps) {
  const status = progress >= 100 ? "Complete" : progress > 0 ? "In progress" : "Ready";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200" title={`${Math.round(progress)}% ${status}`}>
      <span className={clsx("h-2 w-2 rounded-full shadow-sm", progress >= 100 ? "bg-emerald-400 shadow-emerald-400/40" : progress > 0 ? "bg-cyan-400 shadow-cyan-400/40" : "bg-slate-400")} />
      <span className="whitespace-nowrap">{status} · {Math.round(progress)}%</span>
    </div>
  );
}
