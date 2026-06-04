import { Play, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { runCasOperation, type CasOperation } from "../utils/mathEngine/casUtils";

type NotebookEntry = {
  id: string;
  input: string;
  operation: CasOperation;
  output: string;
  ok: boolean;
  createdAt: string;
};

const historyKey = "math-universe-cas-history";
const examples: Array<{ label: string; input: string; operation: CasOperation }> = [
  { label: "Factor quadratic", input: "x^2-5*x+6", operation: "factor" },
  { label: "Solve equation", input: "x^2-5*x+6=0", operation: "solve" },
  { label: "Differentiate", input: "x^3+2*x^2", operation: "differentiate" },
  { label: "Integrate", input: "sin(x)+x^2", operation: "integrate" },
];

export default function MathLabCasNotebook() {
  const [searchParams] = useSearchParams();
  const initialOperation = normalizeOperation(searchParams.get("op")) ?? "factor";
  const [input, setInput] = useState(() => searchParams.get("q") ?? "x^2-5*x+6");
  const [operation, setOperation] = useState<CasOperation>(initialOperation);
  const [history, setHistory] = useState<NotebookEntry[]>(() => readHistory());
  const latest = history[0];

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));
  }, [history]);

  const operationLabel = useMemo(() => operationOptions.find((item) => item.value === operation)?.label ?? "Simplify", [operation]);

  function run() {
    const result = runCasOperation(input, operation);
    const entry: NotebookEntry = {
      id: crypto.randomUUID(),
      input,
      operation,
      output: result.output,
      ok: result.ok,
      createdAt: new Date().toLocaleString(),
    };
    setHistory((items) => [entry, ...items].slice(0, 20));
  }

  return (
    <div className="space-y-6">
      <TopicHeader
        title="CAS Notebook"
        subtitle="Simplify, factor, expand, solve, differentiate, and integrate symbolic expressions with saved local history."
        difficulty="Advanced Solver"
        estimatedMinutes={25}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Notebook Cell" description="Use * for multiplication, ^ for powers, and x as the main variable.">
          <div className="space-y-4">
            <label className="block text-sm font-black">
              Operation
              <select value={operation} onChange={(event) => setOperation(event.target.value as CasOperation)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-slate-950">
                {operationOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-black">
              Expression
              <textarea value={input} onChange={(event) => setInput(event.target.value)} className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-950" />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="action-primary inline-flex items-center gap-2" onClick={run}>
                <Play className="h-4 w-4" />
                Run {operationLabel}
              </button>
              <button type="button" className="action-secondary inline-flex items-center gap-2" onClick={() => setHistory([])}>
                <RotateCcw className="h-4 w-4" />
                Clear history
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Result">
          {latest ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="mini-chip">{latest.operation}</span>
                <span className={`mini-chip ${latest.ok ? "text-emerald-700 dark:text-emerald-200" : "text-rose-700 dark:text-rose-200"}`}>{latest.ok ? "Solved" : "Needs edit"}</span>
              </div>
              <FormulaBlock title="Input" formula={latest.input} />
              <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Output</p>
                <p className="mt-2 break-words font-mono text-lg font-black">{latest.output}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Run a cell to see symbolic output here.</p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Examples">
        <div className="grid gap-3 md:grid-cols-4">
          {examples.map((example) => (
            <button key={example.label} type="button" className="rounded-lg border border-slate-200 bg-white p-4 text-left text-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5" onClick={() => { setInput(example.input); setOperation(example.operation); }}>
              <p className="font-black">{example.label}</p>
              <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">{example.input}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Saved History">
        <div className="space-y-3">
          {history.length === 0 && <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No saved CAS runs yet.</p>}
          {history.map((entry) => (
            <button key={entry.id} type="button" className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5" onClick={() => { setInput(entry.input); setOperation(entry.operation); }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-black">{entry.operation}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400"><Save className="h-3 w-3" />{entry.createdAt}</span>
              </div>
              <p className="mt-2 font-mono text-sm">{entry.input}</p>
              <p className="mt-1 break-words font-mono text-sm text-cyan-700 dark:text-cyan-200">{entry.output}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

const operationOptions: Array<{ value: CasOperation; label: string }> = [
  { value: "simplify", label: "Simplify" },
  { value: "factor", label: "Factor" },
  { value: "expand", label: "Expand" },
  { value: "solve", label: "Solve for x" },
  { value: "differentiate", label: "Differentiate by x" },
  { value: "integrate", label: "Integrate by x" },
];

function readHistory(): NotebookEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isNotebookEntry).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function isNotebookEntry(value: unknown): value is NotebookEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<NotebookEntry>;
  return typeof item.id === "string" && typeof item.input === "string" && typeof item.output === "string";
}

function normalizeOperation(value: string | null): CasOperation | null {
  return operationOptions.some((item) => item.value === value) ? value as CasOperation : null;
}
