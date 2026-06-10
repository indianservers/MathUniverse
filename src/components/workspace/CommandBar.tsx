import { KeyboardEvent } from "react";
import { Command, Play, Sparkles } from "lucide-react";

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
    <div className="workspace-command-center">
      <div className="flex min-w-0 items-center gap-2">
        <Command className="ml-2 h-4 w-4 shrink-0 text-cyan-500" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent px-1 py-1.5 font-mono text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-cyan-50"
          placeholder="Type solve, graph, point, circle, surface, table..."
          aria-label="Workspace command"
          list="workspace-command-suggestions"
        />
        <datalist id="workspace-command-suggestions">
          {commandSuggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
        </datalist>
        <button type="button" onClick={onRun} className="action-primary min-h-8 rounded-lg px-3 py-1" aria-label="Run workspace command">
          <Play className="h-4 w-4" />
          Run
        </button>
      </div>
      <div className="workspace-command-suggestions">
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400"><Sparkles className="h-3.5 w-3.5 text-cyan-500" />Try</span>
        {commandSuggestions.slice(0, 6).map((suggestion) => (
          <button key={suggestion} type="button" className="mini-chip" onClick={() => onChange(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

const commandSuggestions = [
  "solve x^2 - 4 = 0",
  "graph y = x^2 - 4",
  "roots x^3 - x",
  "intersect y=x, y=2-x",
  "table sin(x)",
  "surface z = sin(x) cos(y)",
  "point A=(2,3)",
  "circle center=(0,0) radius=3",
];
