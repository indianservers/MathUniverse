import { Copy, Play, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import {
  symbolicDerivative,
  symbolicExpand,
  symbolicFactor,
  symbolicIntegral,
  symbolicLimit,
  symbolicPartialFractions,
  symbolicPolynomialDivide,
  symbolicSimplify,
  symbolicSolve,
  symbolicSubstitute,
  symbolicSystemSolve,
  trySymbolic,
  type SymbolicAssignment,
  type SymbolicResult,
} from "../utils/symbolic";

type NotebookOperation =
  | "simplify"
  | "factor"
  | "expand"
  | "solve"
  | "system"
  | "differentiate"
  | "integrate"
  | "limit"
  | "substitute"
  | "partial-fractions"
  | "polynomial-divide"
  | "matrix"
  | "list";

type EvaluationMode = "exact" | "numeric";

type NotebookCell = {
  id: string;
  input: string;
  operation: NotebookOperation;
  output: string;
  exact?: string;
  numeric?: string;
  ok: boolean;
  detail: string;
  steps: string[];
  createdAt: string;
};

type NotebookState = {
  cells: NotebookCell[];
  assumptions: string;
  mode: EvaluationMode;
};

const historyKey = "math-universe-cas-notebook-v2";

const examples: Array<{ label: string; input: string; operation: NotebookOperation }> = [
  { label: "Factor quadratic", input: "x^2-5*x+6", operation: "factor" },
  { label: "Equation system", input: "x+y=5; x-y=1", operation: "system" },
  { label: "Matrix", input: "[[1,2],[3,4]]", operation: "matrix" },
  { label: "List stats", input: "1, 2, 3, 5, 8", operation: "list" },
  { label: "Limit", input: "sin(x)/x, x, 0", operation: "limit" },
  { label: "Substitute", input: "x^2+a, a=3, x=2", operation: "substitute" },
];

const starterCells: NotebookCell[] = [
  createCell("x^2-5*x+6", "factor"),
  createCell("x^2-5*x+6=0", "solve"),
  createCell("x+y=5; x-y=1", "system"),
];

export default function MathLabCasNotebook() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<NotebookState>(() => {
    const saved = readNotebookState();
    const query = searchParams.get("q");
    const operation = normalizeOperation(searchParams.get("op"));
    if (query) {
      return {
        ...saved,
        cells: [createCell(query, operation ?? "simplify"), ...saved.cells].slice(0, 12),
      };
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify({ ...state, cells: state.cells.slice(0, 30) }));
  }, [state]);

  const latest = state.cells.find((cell) => cell.output);
  const solvedCount = state.cells.filter((cell) => cell.output && cell.ok).length;

  function updateCell(id: string, patch: Partial<NotebookCell>) {
    setState((current) => ({ ...current, cells: current.cells.map((cell) => (cell.id === id ? { ...cell, ...patch } : cell)) }));
  }

  function runCell(id: string) {
    setState((current) => ({
      ...current,
      cells: current.cells.map((cell) => (cell.id === id ? evaluateCell(cell, current.assumptions, current.mode) : cell)),
    }));
  }

  function runAll() {
    setState((current) => ({ ...current, cells: current.cells.map((cell) => evaluateCell(cell, current.assumptions, current.mode)) }));
  }

  function addCell(input = "", operation: NotebookOperation = "simplify") {
    setState((current) => ({ ...current, cells: [createCell(input, operation), ...current.cells].slice(0, 30) }));
  }

  function clearOutputs() {
    setState((current) => ({
      ...current,
      cells: current.cells.map((cell) => ({ ...cell, output: "", exact: undefined, numeric: undefined, detail: "", steps: [], ok: false })),
    }));
  }

  return (
    <div className="space-y-6">
      <TopicHeader
        title="CAS Notebook"
        subtitle="Multi-line symbolic notebook for exact algebra, numeric checks, assumptions, matrices, lists, systems, and step explanations."
        difficulty="Advanced Solver"
        estimatedMinutes={35}
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Notebook Controls" description="Run individual cells or the whole notebook with shared assumptions and exact/numeric output mode.">
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
              <button type="button" className="action-secondary inline-flex items-center justify-center gap-2" onClick={() => setState({ cells: starterCells, assumptions: "x real", mode: "exact" })}>
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
            <div className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <p>{solvedCount}/{state.cells.length} cells solved</p>
              <p className="mt-1">Latest: {latest?.operation ?? "none"}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Multi-Line Symbolic Notebook">
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
          {examples.map((example) => (
            <button key={example.label} type="button" className="rounded-lg border border-slate-200 bg-white p-4 text-left text-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5" onClick={() => addCell(example.input, example.operation)}>
              <p className="font-black">{example.label}</p>
              <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">{example.input}</p>
            </button>
          ))}
        </div>
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
        placeholder="Enter expression, equation system, matrix, or list"
      />
      {cell.output && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className={`mini-chip ${cell.ok ? "text-emerald-700 dark:text-emerald-200" : "text-rose-700 dark:text-rose-200"}`}>{cell.ok ? "Solved" : "Needs edit"}</span>
            <span className="mini-chip">{cell.createdAt}</span>
          </div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Output</p>
            <p className="mt-2 break-words font-mono text-lg font-black">{cell.output}</p>
            {cell.numeric && <p className="mt-2 break-words font-mono text-sm text-cyan-700 dark:text-cyan-200">numeric: {cell.numeric}</p>}
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{cell.detail}</p>
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Step explanations</p>
          <ol className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {cell.steps.map((step, stepIndex) => <li key={`${cell.id}-${stepIndex}`}><span className="font-black text-cyan-600 dark:text-cyan-300">{stepIndex + 1}.</span> {step}</li>)}
          </ol>
        </div>
      )}
    </article>
  );
}

const operationOptions: Array<{ value: NotebookOperation; label: string }> = [
  { value: "simplify", label: "Simplify" },
  { value: "factor", label: "Factor" },
  { value: "expand", label: "Expand" },
  { value: "solve", label: "Solve" },
  { value: "system", label: "Equation System" },
  { value: "differentiate", label: "Differentiate" },
  { value: "integrate", label: "Integrate" },
  { value: "limit", label: "Limit" },
  { value: "substitute", label: "Substitute" },
  { value: "partial-fractions", label: "Partial Fractions" },
  { value: "polynomial-divide", label: "Polynomial Divide" },
  { value: "matrix", label: "Matrix" },
  { value: "list", label: "List" },
];

function evaluateCell(cell: NotebookCell, assumptions: string, mode: EvaluationMode): NotebookCell {
  const input = cell.input.trim();
  if (!input) return { ...cell, ok: false, output: "Enter an expression first.", detail: "The cell is empty.", steps: ["Choose an operation.", "Enter an expression, matrix, list, or system.", "Run the cell again."], createdAt: new Date().toLocaleString() };
  const result = runNotebookOperation(cell.operation, input, assumptions);
  const numeric = mode === "numeric" ? numericCheck(input, result?.result ?? input) : undefined;
  return {
    ...cell,
    output: mode === "numeric" && numeric ? numeric : result?.result ?? "CAS could not process this cell.",
    exact: result?.exact ?? result?.result,
    numeric,
    ok: Boolean(result),
    detail: result?.detail ?? "The CAS engine could not produce a supported symbolic result for this input.",
    steps: [
      `Assumptions: ${assumptions.trim() || "none"}.`,
      `Mode: ${mode}.`,
      ...(result?.steps ?? ["Parse the cell input.", "No supported transformation matched this cell."]),
    ],
    createdAt: new Date().toLocaleString(),
  };
}

function runNotebookOperation(operation: NotebookOperation, input: string, assumptions: string): SymbolicResult | null {
  if (operation === "simplify") return withAssumptions(trySymbolic(() => symbolicSimplify(input)), assumptions);
  if (operation === "factor") return withAssumptions(trySymbolic(() => symbolicFactor(input)), assumptions);
  if (operation === "expand") return withAssumptions(trySymbolic(() => symbolicExpand(input)), assumptions);
  if (operation === "solve") return withAssumptions(trySymbolic(() => symbolicSolve(input.includes("=") ? input : `${input}=0`, inferVariable(input))), assumptions);
  if (operation === "system") return withAssumptions(trySymbolic(() => symbolicSystemSolve(splitTopLevel(input), inferVariables(input))), assumptions);
  if (operation === "differentiate") return withAssumptions(trySymbolic(() => symbolicDerivative(firstArg(input), secondArg(input) ?? inferVariable(input))), assumptions);
  if (operation === "integrate") return withAssumptions(trySymbolic(() => symbolicIntegral(firstArg(input), secondArg(input) ?? inferVariable(input))), assumptions);
  if (operation === "limit") {
    const [expression, variable = inferVariable(input), target = "0"] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicLimit(expression, variable, target)), assumptions);
  }
  if (operation === "substitute") {
    const [expression, ...rawAssignments] = splitTopLevel(input);
    const assignments = rawAssignments.map(parseAssignment).filter(Boolean) as SymbolicAssignment[];
    return withAssumptions(trySymbolic(() => symbolicSubstitute(expression, assignments)), assumptions);
  }
  if (operation === "partial-fractions") {
    const [expression, variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicPartialFractions(expression, variable)), assumptions);
  }
  if (operation === "polynomial-divide") {
    const [dividend, divisor = "1", variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicPolynomialDivide(dividend, divisor, variable)), assumptions);
  }
  if (operation === "matrix") return matrixResult(input);
  if (operation === "list") return listResult(input);
  return null;
}

function withAssumptions(result: SymbolicResult | null, assumptions: string): SymbolicResult | null {
  if (!result) return null;
  const clean = assumptions.trim();
  if (!clean) return result;
  return {
    ...result,
    detail: `${result.detail} Assumptions recorded: ${clean}.`,
    steps: [...result.steps, `Carry assumptions forward for interpretation: ${clean}.`],
  };
}

function matrixResult(input: string): SymbolicResult | null {
  const matrix = parseMatrix(input);
  if (!matrix.length) return null;
  const rows = matrix.length;
  const columns = matrix[0]?.length ?? 0;
  const determinant = rows === columns ? determinantOf(matrix) : null;
  const transpose = transposeMatrix(matrix);
  return {
    result: `matrix ${rows}x${columns}${determinant !== null ? `, det=${round(determinant)}` : ""}`,
    exact: JSON.stringify(matrix),
    detail: "Matrix parsed for exact row/column structure, determinant where square, and transpose preview.",
    steps: [
      "Read nested bracket matrix syntax.",
      `Detected ${rows} row${rows === 1 ? "" : "s"} and ${columns} column${columns === 1 ? "" : "s"}.`,
      determinant !== null ? `Computed determinant: ${round(determinant)}.` : "Determinant skipped because the matrix is not square.",
      `Transpose: ${JSON.stringify(transpose)}.`,
    ],
  };
}

function listResult(input: string): SymbolicResult | null {
  const values = input.replace(/^\[|\]$/g, "").split(/[,\s]+/).map(Number).filter(Number.isFinite);
  if (!values.length) return null;
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / values.length;
  return {
    result: `list n=${values.length}, sum=${round(sum)}, mean=${round(mean)}, min=${Math.min(...values)}, max=${Math.max(...values)}`,
    exact: `[${values.join(", ")}]`,
    detail: "Numeric list object with reusable summary statistics.",
    steps: [
      "Parse comma/space separated numeric entries.",
      `Count ${values.length} values.`,
      `Sum values to ${round(sum)} and divide by n for mean ${round(mean)}.`,
      "Expose min/max for follow-up spreadsheet or statistics workflows.",
    ],
  };
}

function numericCheck(input: string, exact: string) {
  const values = [input, exact].map((value) => evaluateNumericExpression(value)).filter(Number.isFinite);
  return values.length ? values.map(round).join(" -> ") : undefined;
}

function evaluateNumericExpression(value: string) {
  try {
    const expression = value
      .replace(/\+C$/, "")
      .replace(/\^/g, "**")
      .replace(/\bpi\b/gi, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/\bsin\b/gi, "Math.sin")
      .replace(/\bcos\b/gi, "Math.cos")
      .replace(/\btan\b/gi, "Math.tan")
      .replace(/\bsqrt\b/gi, "Math.sqrt")
      .replace(/\blog\b/gi, "Math.log10")
      .replace(/\bln\b/gi, "Math.log");
    if (/[a-zA-Z_]/.test(expression.replace(/Math\.[a-zA-Z0-9_]+/g, "")) || /[;={}\[\]'"]/.test(expression)) return Number.NaN;
    return Function(`"use strict"; return (${expression});`)() as number;
  } catch {
    return Number.NaN;
  }
}

function splitTopLevel(value: string) {
  const output: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if ((char === "," || char === ";") && depth === 0) {
      if (current.trim()) output.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) output.push(current.trim());
  return output;
}

function firstArg(value: string) {
  return splitTopLevel(value)[0] ?? value;
}

function secondArg(value: string) {
  return splitTopLevel(value)[1];
}

function parseAssignment(value: string) {
  const [name, ...rest] = value.split("=");
  const expression = rest.join("=").trim();
  return name?.trim() && expression ? { name: name.trim(), value: expression } : null;
}

function inferVariable(value: string) {
  return value.match(/\b[a-z]\b/i)?.[0] ?? "x";
}

function inferVariables(value: string) {
  return Array.from(new Set(value.match(/\b[a-z]\b/gi)?.map((item) => item.toLowerCase()) ?? ["x", "y"]));
}

function parseMatrix(input: string) {
  try {
    const parsed = JSON.parse(input.replace(/'/g, "\"")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => (Array.isArray(row) ? row.map(Number).filter(Number.isFinite) : []))
      .filter((row) => row.length > 0);
  } catch {
    return [];
  }
}

function transposeMatrix(matrix: number[][]) {
  const columns = Math.max(...matrix.map((row) => row.length));
  return Array.from({ length: columns }, (_, column) => matrix.map((row) => row[column] ?? 0));
}

function determinantOf(matrix: number[][]): number | null {
  if (matrix.length === 0 || matrix.some((row) => row.length !== matrix.length)) return null;
  if (matrix.length === 1) return matrix[0][0];
  if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  return matrix[0].reduce((total, value, column) => total + value * ((column % 2 === 0 ? 1 : -1) * (determinantOf(minor(matrix, 0, column)) ?? 0)), 0);
}

function minor(matrix: number[][], rowToRemove: number, columnToRemove: number) {
  return matrix.filter((_, row) => row !== rowToRemove).map((row) => row.filter((_, column) => column !== columnToRemove));
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function createCell(input: string, operation: NotebookOperation): NotebookCell {
  return {
    id: crypto.randomUUID(),
    input,
    operation,
    output: "",
    ok: false,
    detail: "",
    steps: [],
    createdAt: new Date().toLocaleString(),
  };
}

function readNotebookState(): NotebookState {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) ?? "null") as Partial<NotebookState> | null;
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
  return { cells: starterCells, assumptions: "x real", mode: "exact" };
}

function isNotebookCell(value: unknown): value is NotebookCell {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<NotebookCell>;
  return typeof item.id === "string" && typeof item.input === "string" && isNotebookOperation(item.operation);
}

function normalizeOperation(value: string | null): NotebookOperation | null {
  return isNotebookOperation(value) ? value : null;
}

function isNotebookOperation(value: unknown): value is NotebookOperation {
  return operationOptions.some((item) => item.value === value);
}
