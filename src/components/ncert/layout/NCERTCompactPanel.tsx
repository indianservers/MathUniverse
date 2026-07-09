import type { ReactNode } from "react";

type NCERTCompactPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
  accent?: "cyan" | "emerald" | "violet" | "amber";
};

const accentClasses = {
  cyan: "border-cyan-200 bg-cyan-50/60 dark:border-cyan-300/20 dark:bg-cyan-300/10",
  emerald: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-300/20 dark:bg-emerald-300/10",
  violet: "border-violet-200 bg-violet-50/70 dark:border-violet-300/20 dark:bg-violet-300/10",
  amber: "border-amber-200 bg-amber-50/70 dark:border-amber-300/20 dark:bg-amber-300/10",
};

export default function NCERTCompactPanel({ title, description, children, accent = "cyan" }: NCERTCompactPanelProps) {
  return (
    <section className={`rounded-2xl border p-4 ${accentClasses[accent]}`}>
      <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      {description && <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
