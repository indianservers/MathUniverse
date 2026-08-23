import type { ReactNode } from "react";

export default function AdapterFrame({ title, value, children, footer }: { title: string; value?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="adapter-frame overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/70" data-testid="lesson-live-surface">
      <div className="adapter-frame-header flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <h2 className="adapter-frame-title text-base font-black text-slate-950 dark:text-white">{title}</h2>
        {value ? <output className="adapter-frame-value rounded-lg bg-cyan-50 px-2.5 py-1 font-mono text-base font-black text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{value}</output> : null}
      </div>
      <div className="adapter-frame-body p-3 text-[15px] sm:p-4">{children}</div>
      {footer ? <div className="adapter-frame-footer border-t border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-slate-300">{footer}</div> : null}
    </section>
  );
}
