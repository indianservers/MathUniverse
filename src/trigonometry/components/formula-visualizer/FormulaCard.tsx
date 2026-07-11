import {
  type TrigFormulaDefinition,
  type TrigFormulaValues,
  getFormulaLiveValue,
} from "../../utils/trigFormulaUtils";
import MathExpression from "../../../components/ui/MathExpression";

type FormulaCardProps = {
  formula: TrigFormulaDefinition;
  values: TrigFormulaValues;
  active?: boolean;
  onSelect?: () => void;
};

export default function FormulaCard({ formula, values, active = false, onSelect }: FormulaCardProps) {
  return (
    <article
      className={`w-full rounded-lg border p-3 text-left transition ${
        active
          ? "border-cyan-400 bg-cyan-50 shadow-sm shadow-cyan-200/60 dark:border-cyan-300/70 dark:bg-cyan-400/10 dark:shadow-none"
          : "border-slate-200 bg-white/80 hover:border-cyan-300 hover:bg-cyan-50/60 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/40 dark:hover:bg-cyan-400/10"
      }`}
      data-testid={`formula-card-${formula.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <MathExpression value={formula.formula} className="text-sm font-black text-slate-950 dark:text-white" />
          <p className="mt-1 text-xs font-bold uppercase text-cyan-700 dark:text-cyan-300">{formula.meaning}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 font-mono text-sm font-black text-slate-800 dark:bg-slate-950/80 dark:text-cyan-100">
          {getFormulaLiveValue(formula.id, values)}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{formula.visualExplanation}</p>
      <button
        type="button"
        className={active ? "mt-3 mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-100" : "mt-3 mini-chip"}
        onClick={onSelect}
        data-testid={`visualize-${formula.id}`}
        aria-pressed={active}
      >
        Visualize
      </button>
    </article>
  );
}
