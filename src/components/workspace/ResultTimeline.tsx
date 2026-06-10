import { Clock3, Redo2, ShieldCheck, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { WorkspaceHistoryAction, WorkspaceHistoryEntry } from "../../workspace/types";

type ResultTimelineProps = {
  history: WorkspaceHistoryEntry[];
  redoHistory: WorkspaceHistoryEntry[];
  onUndo: () => void;
  onRedo: () => void;
};

type TimelineFilter = "all" | "recoverable" | "object" | "selection" | "command" | "project";

const timelineFilters: Array<{ id: TimelineFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "recoverable", label: "Recoverable" },
  { id: "object", label: "Objects" },
  { id: "selection", label: "Selection" },
  { id: "command", label: "Commands" },
  { id: "project", label: "Project" },
];

export default function ResultTimeline({ history, redoHistory, onUndo, onRedo }: ResultTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const undoableCount = useMemo(() => history.filter(isRecoverable).length, [history]);
  const redoableCount = useMemo(() => redoHistory.filter(isRecoverable).length, [redoHistory]);
  const visibleHistory = useMemo(() => history.filter((entry) => matchesTimelineFilter(entry, filter)).slice(0, 16), [filter, history]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 dark:text-white">Timeline</h2>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Recover edits, commands, selections, and project changes.</p>
        </div>
        <span className="mini-chip">{history.length}</span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={undoableCount === 0}
          className="tool-button min-h-9 justify-center rounded-lg px-2 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          title={undoableCount ? `Undo latest recoverable action (${undoableCount} available)` : "Nothing recoverable to undo"}
          aria-label="Undo latest recoverable timeline action"
        >
          <Undo2 className="h-4 w-4" />
          Undo
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={redoableCount === 0}
          className="tool-button min-h-9 justify-center rounded-lg px-2 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          title={redoableCount ? `Redo latest recovered action (${redoableCount} available)` : "Nothing to redo"}
          aria-label="Redo latest recovered timeline action"
        >
          <Redo2 className="h-4 w-4" />
          Redo
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <span className="mini-chip"><ShieldCheck className="h-3.5 w-3.5" />{undoableCount} undo</span>
        <span className="mini-chip"><Redo2 className="h-3.5 w-3.5" />{redoableCount} redo</span>
        <span className="mini-chip"><Clock3 className="h-3.5 w-3.5" />{formatTimelineTime(history[0]?.timestamp)}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {timelineFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`mini-chip ${filter === item.id ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-100" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="thin-scrollbar mt-2 max-h-[220px] space-y-2 overflow-auto pr-1">
        {visibleHistory.length === 0 ? (
          <p className="text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">Workspace actions will appear here.</p>
        ) : (
          visibleHistory.map((entry) => (
            <div key={entry.id} className="rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-white/10">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-xs font-bold text-slate-800 dark:text-slate-100">{entry.label}</p>
                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${isRecoverable(entry) ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200" : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
                  {isRecoverable(entry) ? "Undoable" : "Log"}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span>{timelineActionLabel(entry.action)}</span>
                <span>-</span>
                <span>{formatTimelineTime(entry.timestamp)}</span>
                <span>-</span>
                <span>{objectCountLabel(entry)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {redoHistory.length > 0 && (
        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 dark:border-amber-300/20 dark:bg-amber-300/10">
          <p className="text-[11px] font-black text-amber-800 dark:text-amber-100">Redo stack ready</p>
          <p className="truncate text-[10px] font-semibold text-amber-700 dark:text-amber-200">{redoHistory[0]?.label ?? "Recovered action"} can be replayed.</p>
        </div>
      )}
    </section>
  );
}

function isRecoverable(entry: WorkspaceHistoryEntry) {
  return Boolean(entry.before && entry.after);
}

function matchesTimelineFilter(entry: WorkspaceHistoryEntry, filter: TimelineFilter) {
  if (filter === "all") return true;
  if (filter === "recoverable") return isRecoverable(entry);
  if (filter === "selection") return entry.action === "select";
  if (filter === "command") return entry.action === "command";
  if (filter === "project") return entry.action === "project" || entry.action === "snapshot";
  return ["create", "update", "delete", "visibility", "scene"].includes(entry.action);
}

function timelineActionLabel(action: WorkspaceHistoryAction) {
  const labels: Record<WorkspaceHistoryAction, string> = {
    create: "Create",
    update: "Update",
    delete: "Delete",
    select: "Select",
    visibility: "Visibility",
    command: "Command",
    snapshot: "Snapshot",
    scene: "Scene",
    project: "Project",
  };
  return labels[action];
}

function formatTimelineTime(timestamp?: number) {
  if (!timestamp) return "No actions";
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function objectCountLabel(entry: WorkspaceHistoryEntry) {
  const count = entry.objectIds?.length ?? (entry.objectId ? 1 : 0);
  if (count === 0) return "Workspace";
  if (count === 1) return "1 object";
  return `${count} objects`;
}
