import { Link2, Lock, Unlock } from "lucide-react";
import type { MathObject } from "../../workspace/types";
import { objectDependencyCount } from "../../workspace/dependencyGraph";

type InspectorPanelProps = {
  object: MathObject | null;
};

export default function InspectorPanel({ object }: InspectorPanelProps) {
  if (!object) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-black text-slate-900 dark:text-white">Inspector</h2>
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
          Select a workspace object to inspect its value, linked views, dependencies, and metadata.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{object.kind}</p>
          <h2 className="mt-1 break-words text-sm font-black text-slate-950 dark:text-white">{object.label}</h2>
        </div>
        <span className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-white/10 dark:text-slate-200" title={object.locked ? "Locked" : "Editable"}>
          {object.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-950/70">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Value</p>
        <p className="mt-1 break-words font-mono text-xs font-semibold text-slate-900 dark:text-cyan-50">{object.value}</p>
      </div>

      {object.summary && <p className="mt-3 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{object.summary}</p>}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Info label="Status" value={object.status} />
        <Info label="Deps" value={`${objectDependencyCount(object)}`} />
      </div>

      <div className="mt-3">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <Link2 className="h-3.5 w-3.5 text-cyan-500" />
          Linked views
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {object.linkedViews.map((view) => (
            <span key={view} className="mini-chip">
              {view}
            </span>
          ))}
        </div>
      </div>

      {object.metadata && (
        <div className="mt-3">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Metadata</p>
          <dl className="mt-2 space-y-1">
            {Object.entries(object.metadata).map(([key, value]) => (
              <div key={key} className="flex min-w-0 justify-between gap-2 rounded-lg bg-slate-100 px-2 py-1 dark:bg-white/10">
                <dt className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{key}</dt>
                <dd className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

