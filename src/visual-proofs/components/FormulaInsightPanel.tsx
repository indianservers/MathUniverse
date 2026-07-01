import { AlertTriangle, CheckCircle2, Sigma } from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import type { ProofInvariant, ProofLiveValue } from "../data/proofTypes";

type FormulaInsightPanelProps = {
  title?: string;
  formula: string;
  explanation: string;
  liveValues?: ProofLiveValue[];
  invariants?: ProofInvariant[];
  assumptions?: string[];
  warnings?: string[];
};

export function FormulaInsightPanel({
  title = "Formula and insight",
  formula,
  explanation,
  liveValues = [],
  invariants = [],
  assumptions = [],
  warnings = [],
}: FormulaInsightPanelProps) {
  return (
    <section className="visual-proof-formula-wrap rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]" aria-label={title} data-testid="visual-proof-formula-panel">
      <div className="flex items-center gap-2">
        <Sigma className="h-5 w-5 text-cyan-600 dark:text-cyan-200" aria-hidden="true" />
        <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      </div>
      <div className="mt-3 rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-cyan-100 dark:bg-black/50">
        <MathExpression value={formula} className="font-semibold" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{explanation}</p>
      {liveValues.length ? (
        <div className="mt-3">
          <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Current values</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {liveValues.map((item) => (
            <div key={item.id} className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-950/40">
              <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-1 break-words text-sm font-black text-slate-950 dark:text-white"><MathExpression value={formatValue(item.value, item.unit)} /></p>
              {item.exactValue ? <p className="mt-1 break-words text-xs font-bold text-slate-500 dark:text-slate-400">Exact: <MathExpression value={String(item.exactValue)} /></p> : null}
              {item.roundedValue ? <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Rounded: <MathExpression value={String(item.roundedValue)} /></p> : null}
              {item.warning ? <p className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-200">{item.warning}</p> : null}
            </div>
          ))}
          </div>
        </div>
      ) : null}
      {invariants.length ? (
        <div className="mt-3 space-y-2">
          {invariants.map((invariant) => (
            <div key={invariant.id} className="flex gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-5 text-emerald-950 dark:bg-emerald-400/10 dark:text-emerald-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span><strong>{invariant.label}:</strong> {invariant.explanation}</span>
            </div>
          ))}
        </div>
      ) : null}
      {assumptions.length ? <InfoList title="Assumptions" items={assumptions} /> : null}
      {warnings.length ? (
        <div className="mt-3 space-y-2">
          {warnings.map((warning) => (
            <p key={warning} className="flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold leading-5 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {warning}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function formatValue(value: ProofLiveValue["value"], unit?: string) {
  return `${String(value)}${unit ? ` ${unit}` : ""}`;
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-950/40">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 leading-5 text-slate-600 dark:text-slate-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
