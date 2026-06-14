type FormulaPanelProps = {
  title?: string;
  formulas: string[];
  visible?: boolean;
};

export default function FormulaPanel({ title = "Formula derivation", formulas, visible = true }: FormulaPanelProps) {
  if (!visible) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label={title}>
      <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Read each line as a count, length, area, or angle that the visual preserved.
      </p>
      <div className="mt-3 space-y-2">
        {formulas.map((formula, index) => (
          <div key={`${formula}-${index}`} className="rounded-lg bg-slate-950 px-3 py-2 font-mono text-sm font-bold text-cyan-100 shadow-sm dark:bg-black/50">
            <span className="mr-2 rounded bg-cyan-300/15 px-1.5 py-0.5 text-[0.68rem] uppercase tracking-wide text-cyan-200">
              line {index + 1}
            </span>
            <span>{formula}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-cyan-200/50 bg-cyan-50 px-3 py-2 text-xs font-bold leading-5 text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
        Drag sliders or move through steps: the numbers change, but the invariant behind the formula must stay true.
      </div>
    </section>
  );
}
