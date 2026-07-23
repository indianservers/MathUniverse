import type { ReactNode } from "react";

export default function AdapterFrame({ title, value, children, footer }: { title: string; value?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/70" data-testid="lesson-live-surface">
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 dark:border-white/10">
        <h2 className="text-sm font-black text-slate-950 dark:text-white">{title}</h2>
        {value ? <output className="rounded-lg bg-cyan-50 px-2.5 py-1 font-mono text-sm font-black text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{value}</output> : null}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
      {footer ? <div className="border-t border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-300">{footer}</div> : null}
    </section>
  );
}
