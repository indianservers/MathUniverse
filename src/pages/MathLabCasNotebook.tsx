import { Copy, Download, Play, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  casNotebookExamples,
  createNotebookCell,
  evaluateNotebookCellInState,
  evaluateNotebookCells,
  isNotebookOperation,
  operationOptions,
  serializeCasNotebookMarkdown,
  starterNotebookCells,
  type EvaluationMode,
  type NotebookCell,
  type NotebookOperation,
  type NotebookState,
} from "../cas/casNotebookEngine";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { buildCasNotebookWorkspaceObjects } from "../workspace/universalObjectGraph";
import { useUniversalObjectGraphPublisher } from "../workspace/useUniversalObjectGraphPublisher";

const historyKey = "math-universe-cas-notebook-v3";

export default function MathLabCasNotebook() {
  const [searchParams] = useSearchParams();
  const [copyStatus, setCopyStatus] = useState("");
  const [state, setState] = useState<NotebookState>(() => {
    const saved = readNotebookState();
    const query = searchParams.get("q");
    const operation = normalizeOperation(searchParams.get("op"));
    if (query) {
      return {
        ...saved,
        cells: [createNotebookCell(query, operation ?? "simplify"), ...saved.cells].slice(0, 30),
      };
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify({ ...state, cells: state.cells.slice(0, 30) }));
  }, [state]);

  const workspaceObjects = useMemo(() => buildCasNotebookWorkspaceObjects({
    assumptions: state.assumptions,
    mode: state.mode,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      input: cell.input,
      operation: cell.operation,
      output: cell.output,
      ok: cell.ok,
      steps: cell.steps,
    })),
  }), [state.assumptions, state.cells, state.mode]);
  useUniversalObjectGraphPublisher("cas-notebook", workspaceObjects);

  const exportMarkdown = useMemo(() => serializeCasNotebookMarkdown(state), [state]);
  const latest = state.cells.find((cell) => cell.output);
  const solvedCount = state.cells.filter((cell) => cell.output && cell.ok).length;
  const dependencyCount = state.cells.reduce((total, cell) => total + (cell.dependencies?.length ?? 0), 0);
  const warningCount = state.cells.reduce((total, cell) => total + (cell.warnings?.length ?? 0), 0);

  function updateCell(id: string, patch: Partial<NotebookCell>) {
    setState((current) => ({ ...current, cells: current.cells.map((cell) => (cell.id === id ? { ...cell, ...patch } : cell)) }));
  }

  function runCell(id: string) {
    setState((current) => ({ ...current, cells: evaluateNotebookCellInState(id, current.cells, current.assumptions, current.mode) }));
  }

  function runAll() {
    setState((current) => ({ ...current, cells: evaluateNotebookCells(current.cells, current.assumptions, current.mode) }));
  }

  function addCell(input = "", operation: NotebookOperation = "simplify") {
    setState((current) => ({ ...current, cells: [createNotebookCell(input, operation), ...current.cells].slice(0, 30) }));
  }

  function clearOutputs() {
    setState((current) => ({
      ...current,
      cells: current.cells.map((cell) => ({
        ...cell,
        output: "",
        exact: undefined,
        numeric: undefined,
        resolvedInput: undefined,
        dependencies: [],
        warnings: [],
        detail: "",
        steps: [],
        ok: false,
      })),
    }));
  }

  function copyExport() {
    navigator.clipboard?.writeText(exportMarkdown).then(() => {
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus(""), 1400);
    }).catch(() => {
      setCopyStatus("Copy unavailable");
      window.setTimeout(() => setCopyStatus(""), 1800);
    });
  }

  function downloadExport() {
    const blob = new Blob([exportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cas-notebook-export.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <TopicHeader
        title="CAS Notebook"
        subtitle="Multi-cell symbolic worksheet with memory, assumptions, exact/numeric modes, matrices, lists, explanations, and export."
        difficulty="Advanced Solver"
        estimatedMinutes={35}
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Notebook Controls" description="Run individual cells or the full worksheet. Earlier cells feed later cells through assignments and answer references.">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Mode</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["exact", "numeric"] as EvaluationMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={state.mode === mode ? "action-primary py-2" : "action-secondary py-2"}
                    onClick={() => setState((current) => ({ ...current, mode }))}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-black">
              Assumptions
              <textarea
                value={state.assumptions}
                onChange={(event) => setState((current) => ({ ...current, assumptions: event.target.value }))}
                className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-950"
                placeholder="x real; x > 0; n integer"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="action-primary inline-flex items-center justify-center gap-2" onClick={runAll}>
                <Play className="h-4 w-4" />
                Run all
              </button>
              <button type="button" className="action-secondary inline-flex items-center justify-center gap-2" onClick={() => addCell()}>
                <Plus className="h-4 w-4" />
                Cell
              </button>
              <button type="button" className="action-secondary inline-flex items-center justify-center gap-2" onClick={clearOutputs}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button type="button" className="action-secondary inline-flex items-center justify-center gap-2" onClick={() => setState({ cells: starterNotebookCells.map((cell) => ({ ...cell, id: crypto.randomUUID() })), assumptions: "x real", mode: "exact" })}>
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
            <div className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <p>{solvedCount}/{state.cells.length} cells solved</p>
              <p className="mt-1">Latest: {latest?.operation ?? "none"}</p>
              <p className="mt-1">{dependencyCount} linked reference{dependencyCount === 1 ? "" : "s"} active</p>
              <p className="mt-1">{warningCount} warning{warningCount === 1 ? "" : "s"}</p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm font-semibold text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
              Use `a := 3` to store a worksheet value. Use `#1`, `ans2`, or `out3` to reference earlier outputs.
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Multi-Cell Symbolic Worksheet">
          <div className="space-y-4">
            {state.cells.map((cell, index) => (
              <CasNotebookCell
                key={cell.id}
                cell={cell}
                index={state.cells.length - index}
                onRun={() => runCell(cell.id)}
                onChange={(patch) => updateCell(cell.id, patch)}
                onRemove={() => setState((current) => ({ ...current, cells: current.cells.filter((item) => item.id !== cell.id) }))}
                onDuplicate={() => addCell(cell.input, cell.operation)}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Examples">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {casNotebookExamples.map((example) => (
            <button key={example.label} type="button" className="rounded-lg border border-slate-200 bg-white p-4 text-left text-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5" onClick={() => addCell(example.input, example.operation)}>
              <p className="font-black">{example.label}</p>
              <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">{example.input}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Exportable Solution Notebook" description="The export is generated locally from the current worksheet state.">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="action-secondary inline-flex items-center gap-2" onClick={copyExport}>
            <Copy className="h-4 w-4" />
            {copyStatus || "Copy markdown"}
          </button>
          <button type="button" className="action-secondary inline-flex items-center gap-2" onClick={downloadExport}>
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
        <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">{exportMarkdown}</pre>
      </SectionCard>
    </div>
  );
}

function CasNotebookCell({ cell, index, onRun, onChange, onRemove, onDuplicate }: {
  cell: NotebookCell;
  index: number;
  onRun: () => void;
  onChange: (patch: Partial<NotebookCell>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-950 px-2 py-1 text-xs font-black text-white dark:bg-white dark:text-slate-950">In [{index}]</span>
          <select value={cell.operation} onChange={(event) => onChange({ operation: event.target.value as NotebookOperation })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950">
            {operationOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="button" className="math-tool-button h-9 w-9 rounded-lg" onClick={onRun} aria-label="Run cell"><Play className="h-4 w-4" /></button>
          <button type="button" className="math-tool-button h-9 w-9 rounded-lg" onClick={onDuplicate} aria-label="Duplicate cell"><Copy className="h-4 w-4" /></button>
          <button type="button" className="math-tool-button-danger h-9 w-9 rounded-lg" onClick={onRemove} aria-label="Remove cell"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <textarea
        value={cell.input}
        onChange={(event) => onChange({ input: event.target.value })}
        aria-label="CAS cell input"
        className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-900"
        placeholder="Enter expression, equation system, matrix, list, assignment, or # reference"
      />
      {cell.output && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className={`mini-chip ${cell.ok ? "text-emerald-700 dark:text-emerald-200" : "text-rose-700 dark:text-rose-200"}`}>{cell.ok ? "Solved" : "Needs edit"}</span>
            <span className="mini-chip">{cell.createdAt}</span>
            {cell.dependencies?.map((dependency) => <span key={dependency} className="mini-chip">uses {dependency}</span>)}
          </div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Output</p>
            <p className="mt-2 break-words font-mono text-lg font-black">{cell.output}</p>
            {cell.resolvedInput && cell.resolvedInput !== cell.input && <p className="mt-2 break-words font-mono text-sm text-slate-600 dark:text-slate-300">resolved: {cell.resolvedInput}</p>}
            {cell.numeric && <p className="mt-2 break-words font-mono text-sm text-cyan-700 dark:text-cyan-200">numeric: {cell.numeric}</p>}
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{cell.detail}</p>
          {!!cell.assumptionSummary?.length && (
            <div className="rounded-lg bg-indigo-50 p-3 text-sm font-semibold text-indigo-900 dark:bg-indigo-300/10 dark:text-indigo-100">
              Assumptions: {cell.assumptionSummary.join("; ")}
            </div>
          )}
          {!!cell.warnings?.length && (
            <div className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:bg-amber-300/10 dark:text-amber-100">
              {cell.warnings.join(" ")}
            </div>
          )}
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Step explanations</p>
          <ol className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {cell.steps.map((step, stepIndex) => <li key={`${cell.id}-${stepIndex}`}><span className="font-black text-cyan-600 dark:text-cyan-300">{stepIndex + 1}.</span> {step}</li>)}
          </ol>
        </div>
      )}
    </article>
  );
}

function readNotebookState(): NotebookState {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) ?? localStorage.getItem("math-universe-cas-notebook-v2") ?? "null") as Partial<NotebookState> | null;
    if (parsed && Array.isArray(parsed.cells)) {
      return {
        cells: parsed.cells.filter(isNotebookCell).slice(0, 30),
        assumptions: typeof parsed.assumptions === "string" ? parsed.assumptions : "x real",
        mode: parsed.mode === "numeric" ? "numeric" : "exact",
      };
    }
  } catch {
    // Fall back to starter cells.
  }
  return { cells: starterNotebookCells.map((cell) => ({ ...cell, id: crypto.randomUUID() })), assumptions: "x real", mode: "exact" };
}

function isNotebookCell(value: unknown): value is NotebookCell {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<NotebookCell>;
  return typeof item.id === "string" && typeof item.input === "string" && isNotebookOperation(item.operation);
}

function normalizeOperation(value: string | null): NotebookOperation | null {
  return isNotebookOperation(value) ? value : null;
}
