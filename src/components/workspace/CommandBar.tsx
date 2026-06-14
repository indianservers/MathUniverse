import { useMemo } from "react";
import { Command, Play, Sparkles } from "lucide-react";
import SmartMathInput from "../math-input/SmartMathInput";
import { commandExamplesFor, resolveCommandSpec } from "../../workspace/commandRegistry";

type CommandBarProps = {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
};

const defaultCommandSuggestions = [
  "plot sin(x)",
  "solve x^2 - 5*x + 6 = 0",
  "derivative x^3 - 2*x",
  "integral 3*x^2",
  "intersect x^2 and 2*x+3",
  "table sin(x) from -3 to 3 step 0.5",
  "surface z = sin(x) * cos(y)",
  "point A=(2,3)",
  "circle center=(0,0) radius=3",
  "matrix [[1,2],[3,4]]",
  "mean(34,34,56,78)",
  "SUMPRODUCT(1,2,3,4)",
  "NORM.S.DIST(0,TRUE)",
];

export default function CommandBar({ value, onChange, onRun }: CommandBarProps) {
  const suggestions = useMemo(() => smartCommandSuggestions(value), [value]);

  return (
    <div className="workspace-command-center">
      <div className="flex min-w-0 items-start gap-2">
        <Command className="ml-2 mt-3 h-4 w-4 shrink-0 text-cyan-500" />
        <div className="min-w-0 flex-1">
          <SmartMathInput
            ariaLabel="Smart workspace command editor"
            compact
            mode="workspace"
            onChange={onChange}
            onSubmit={onRun}
            placeholder="Type plot, solve, point, circle, surface, table, mean..."
            rows={1}
            showLegend={false}
            value={value}
          />
        </div>
        <button type="button" onClick={onRun} className="action-primary min-h-10 rounded-lg px-3 py-1" aria-label="Run workspace command">
          <Play className="h-4 w-4" />
          Run
        </button>
      </div>
      <div className="workspace-command-suggestions">
        <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400"><Sparkles className="h-3.5 w-3.5 text-cyan-500" />Smart</span>
        {suggestions.slice(0, 8).map((suggestion) => (
          <button key={suggestion} type="button" className="mini-chip transition hover:bg-cyan-100 hover:text-cyan-800 dark:hover:bg-cyan-300/15 dark:hover:text-cyan-100" onClick={() => onChange(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 pl-7 text-[10px] font-black uppercase">
        <LegendDot className="bg-cyan-300" label="command" />
        <LegendDot className="bg-blue-300" label="keyword" />
        <LegendDot className="bg-amber-300" label="number" />
        <LegendDot className="bg-rose-300" label="operator" />
        <LegendDot className="bg-violet-300" label="function" />
        <LegendDot className="bg-emerald-300" label="variable" />
        <LegendDot className="bg-sky-300" label="geometry" />
        <LegendDot className="bg-fuchsia-300" label="matrix" />
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-slate-500 dark:bg-white/5 dark:text-slate-400">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function smartCommandSuggestions(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return defaultCommandSuggestions;
  const query = trimmed.toLowerCase();
  const registry = commandExamplesFor(query, 8);
  const firstWord = query.match(/^([a-z]+)/)?.[1] ?? "";
  const spec = firstWord ? resolveCommandSpec(firstWord) : undefined;
  const contextual = [
    ...(spec?.examples ?? []),
    ...registry,
    ...defaultCommandSuggestions.filter((item) => item.toLowerCase().includes(query) || item.toLowerCase().includes(firstWord)),
  ];
  if (query.includes("circle")) contextual.push("circle center=(0,0) radius=3", "area circle radius 5");
  if (query.includes("matrix")) contextual.push("determinant [[1,2],[3,4]]", "inverse [[1,2],[3,4]]");
  if (query.includes("point")) contextual.push("point A=(2,3)", "line (0,0), (4,3)");
  if (query.includes("surface") || query.includes("3d")) contextual.push("surface z = sin(x) * cos(y)", "sphere center=(0,0,0) radius=2");
  if (query.includes("mean") || query.includes("average")) contextual.push("mean(34,34,56,78)", "AVERAGE(10,20,30)", "MEDIAN(4,6,8,10)");
  if (query.includes("stat") || query.includes("norm")) contextual.push("NORM.S.DIST(0,TRUE)", "STDEV.S(4,6,8,10)", "CORREL(1,2,3,2,4,6)");
  return Array.from(new Set(contextual)).slice(0, 10);
}
