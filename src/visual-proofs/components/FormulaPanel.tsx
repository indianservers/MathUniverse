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
      <div className="mt-3 space-y-2">
        {formulas.map((formula) => (
          <div key={formula} className="rounded-lg bg-slate-950 px-3 py-2 font-mono text-sm font-bold text-cyan-100 dark:bg-black/50">
            {formula}
          </div>
        ))}
      </div>
    </section>
  );
}
