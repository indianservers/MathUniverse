import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export type BoardCommand = {
  id: string;
  label: string;
  keywords?: string;
  enabled: boolean;
  disabledReason?: string;
  priority: number;
  run: () => void;
};

export default function BoardCommandPalette({ open, commands, onClose }: { open: boolean; commands: BoardCommand[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...commands]
      .filter((command) => !needle || `${command.label} ${command.keywords ?? ""}`.toLowerCase().includes(needle))
      .sort((left, right) => Number(right.enabled) - Number(left.enabled) || left.priority - right.priority)
      .slice(0, 24);
  }, [commands, query]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/45 p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Board command palette" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-200 p-3 dark:border-white/10">
          <Search className="h-4 w-4" />
          <input autoFocus className="min-w-0 flex-1 bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Board commands" aria-label="Search Board commands" />
          <button type="button" className="tool-button min-h-8 px-2" onClick={onClose} aria-label="Close command palette"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {visible.map((command) => (
            <button
              key={command.id}
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/5"
              disabled={!command.enabled}
              title={command.disabledReason}
              onClick={() => {
                command.run();
                onClose();
              }}
            >
              <span className="font-semibold">{command.label}</span>
              {!command.enabled && <span className="ml-3 text-xs text-slate-500">{command.disabledReason}</span>}
            </button>
          ))}
          {!visible.length && <p className="p-3 text-sm text-slate-500">No matching commands.</p>}
        </div>
      </div>
    </div>
  );
}
