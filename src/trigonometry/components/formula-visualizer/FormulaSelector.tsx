import { type TrigFormulaId, trigFormulaDefinitions } from "../../utils/trigFormulaUtils";

type FormulaSelectorProps = {
  selectedFormulaId: TrigFormulaId;
  onSelect: (formulaId: TrigFormulaId) => void;
};

export default function FormulaSelector({ selectedFormulaId, onSelect }: FormulaSelectorProps) {
  return (
    <section
      className="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50"
      aria-label="Formula selector"
      data-testid="formula-selector"
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {trigFormulaDefinitions.map((formula) => {
          const active = formula.id === selectedFormulaId;
          return (
            <button
              key={formula.id}
              type="button"
              className={`min-h-16 rounded-lg border px-3 py-2 text-left transition ${
                active
                  ? "border-cyan-400 bg-cyan-50 text-cyan-900 dark:border-cyan-300/70 dark:bg-cyan-400/15 dark:text-cyan-50"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-400/10"
              }`}
              onClick={() => onSelect(formula.id)}
              data-testid={`formula-selector-${formula.id}`}
              aria-pressed={active}
            >
              <span className="block font-mono text-xs font-black leading-4">{formula.label}</span>
              <span className="mt-1 block text-[11px] font-semibold leading-4 opacity-80">{formula.meaning}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
