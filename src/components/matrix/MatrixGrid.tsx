import { clsx } from "clsx";
import type { Cell, Matrix } from "../../utils/matrixOperations";
import { formatNumber, parseMatrixValue } from "../../utils/matrixOperations";

type MatrixGridProps = {
  matrix: Matrix;
  label?: string;
  editable?: boolean;
  highlights?: Cell[];
  color?: "a" | "b" | "result" | "neutral";
  onChange?: (matrix: Matrix) => void;
};

export default function MatrixGrid({ matrix, label, editable = false, highlights = [], color = "neutral", onChange }: MatrixGridProps) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const isHighlighted = (row: number, col: number) => highlights.some(([r, c]) => r === row && c === col);

  const update = (row: number, col: number, value: string) => {
    if (!onChange) return;
    onChange(matrix.map((items, r) => items.map((cell, c) => (r === row && c === col ? parseMatrixValue(value) : cell))));
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {label && <p className="text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>}
      <div className="flex items-stretch gap-2">
        <div className="w-2 rounded-l-2xl border-y-4 border-l-4 border-slate-400 dark:border-slate-500" />
        <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${Math.max(cols, 1)}, minmax(56px, 1fr))` }}>
          <span />
          {Array.from({ length: cols }, (_, col) => <span key={`col-${col}`} className="text-center text-xs font-black text-slate-400">C{col + 1}</span>)}
          {matrix.flatMap((row, r) => row.map((value, c) => (
            [
            c === 0 ? <span key={`row-${r}`} className="flex items-center justify-center text-xs font-black text-slate-400">R{r + 1}</span> : null,
            <div
              key={`${r}-${c}`}
              className={clsx(
                "result-pop flex min-h-14 min-w-14 items-center justify-center rounded-xl border px-2 text-center font-mono text-base font-black transition duration-300 sm:min-h-12 sm:min-w-12",
                colorClass(color),
                isHighlighted(r, c) && "scale-105 ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-950",
                isHighlighted(r, c) && highlightClass(color),
              )}
            >
              {editable ? (
                <input
                  className="w-16 bg-transparent text-center outline-none"
                  value={formatNumber(value)}
                  onChange={(event) => update(r, c, event.target.value)}
                  aria-label={`${label ?? "matrix"} row ${r + 1} column ${c + 1}`}
                />
              ) : (
                formatNumber(value)
              )}
            </div>
            ]
          )))}
        </div>
        <div className="w-2 rounded-r-2xl border-y-4 border-r-4 border-slate-400 dark:border-slate-500" />
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{rows} x {cols}</p>
    </div>
  );
}

function colorClass(color: MatrixGridProps["color"]) {
  if (color === "a") return "border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100";
  if (color === "b") return "border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-100";
  if (color === "result") return "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100";
  return "border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-100";
}

function highlightClass(color: MatrixGridProps["color"]) {
  if (color === "b") return "ring-violet-300 dark:ring-violet-300/60";
  if (color === "result") return "ring-emerald-300 dark:ring-emerald-300/60";
  return "ring-cyan-300 dark:ring-cyan-300/60";
}
