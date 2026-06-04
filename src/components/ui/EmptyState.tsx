import { Sparkles } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-center shadow-inner dark:border-slate-700 dark:bg-slate-950/40">
      <Sparkles className="mx-auto h-7 w-7 text-cyan-500" />
      <h3 className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
