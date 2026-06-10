import { KeyboardEvent } from "react";
import { Play, Search } from "lucide-react";

type CommandBarProps = {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
};

export default function CommandBar({ value, onChange, onRun }: CommandBarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onRun();
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white/85 p-1 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      <Search className="ml-2 h-4 w-4 shrink-0 text-cyan-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 bg-transparent px-1 py-1.5 font-mono text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-cyan-50"
        placeholder="Type a command, expression, construction, or question..."
        aria-label="Workspace command"
      />
      <button type="button" onClick={onRun} className="action-primary min-h-8 rounded-lg px-3 py-1" aria-label="Run workspace command">
        <Play className="h-4 w-4" />
        Run
      </button>
    </div>
  );
}
