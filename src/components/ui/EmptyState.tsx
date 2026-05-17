import { Sparkles } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
      <Sparkles className="mx-auto h-8 w-8 text-cyan-500" />
      <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
