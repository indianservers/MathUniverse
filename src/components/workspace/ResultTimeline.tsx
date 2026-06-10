import type { WorkspaceHistoryEntry } from "../../workspace/types";

type ResultTimelineProps = {
  history: WorkspaceHistoryEntry[];
};

export default function ResultTimeline({ history }: ResultTimelineProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-900 dark:text-white">Timeline</h2>
        <span className="mini-chip">{history.length}</span>
      </div>
      <div className="thin-scrollbar mt-2 max-h-[180px] space-y-2 overflow-auto pr-1">
        {history.length === 0 ? (
          <p className="text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Workspace actions will appear here.</p>
        ) : (
          history.slice(0, 12).map((entry) => (
            <div key={entry.id} className="rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-white/10">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{entry.label}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {entry.action} - {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

