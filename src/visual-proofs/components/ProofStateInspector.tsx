import { Bug, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ProofInvariant, ProofLiveValue, ProofParameter } from "../data/proofTypes";

type ProofStateInspectorProps = {
  parameters?: ProofParameter[];
  liveValues?: ProofLiveValue[];
  invariants?: ProofInvariant[];
  warnings?: string[];
  defaultOpen?: boolean;
};

export function ProofStateInspector({ parameters = [], liveValues = [], invariants = [], warnings = [], defaultOpen = false }: ProofStateInspectorProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]" aria-label="Proof state inspector" data-testid="visual-proof-state-inspector">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
          <Bug className="h-5 w-5 text-cyan-600 dark:text-cyan-200" aria-hidden="true" />
          State inspector
        </span>
        {open ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
      </button>
      {open ? (
        <div className="mt-3 space-y-3 text-sm">
          <InspectorGroup title="Parameters" rows={parameters.map((item) => [item.label, formatInspectorValue(item.value, item.unit)])} />
          <InspectorGroup title="Live values" rows={liveValues.map((item) => [item.label, formatInspectorValue(item.exactValue ?? item.value, item.unit)])} />
          <InspectorGroup title="Invariants" rows={invariants.map((item) => [item.label, item.holds ? "holds" : "check failed"])} />
          {warnings.length ? <InspectorGroup title="Warnings" rows={warnings.map((warning) => ["warning", warning])} /> : null}
        </div>
      ) : (
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Collapsed for students; open for teacher/debug live proof state.</p>
      )}
    </section>
  );
}

function InspectorGroup({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  if (!rows.length) return null;
  return (
    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-950/40">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <dl className="mt-2 space-y-1">
        {rows.map(([label, value]) => (
          <div key={`${label}-${value}`} className="flex items-start justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-300">{label}</dt>
            <dd className="text-right font-mono font-bold text-slate-950 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatInspectorValue(value: number | string | boolean, unit?: string) {
  return `${String(value)}${unit ? ` ${unit}` : ""}`;
}
