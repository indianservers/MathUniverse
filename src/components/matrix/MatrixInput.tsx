import { Copy, Dices, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import MatrixGrid from "./MatrixGrid";
import { MatrixSizeSelector } from "./MatrixShared";
import type { Matrix } from "../../utils/matrixOperations";
import { cloneMatrix, createMatrix, randomMatrix } from "../../utils/matrixOperations";

type MatrixInputProps = {
  label: string;
  matrix: Matrix;
  onChange: (matrix: Matrix) => void;
  example: Matrix;
  minRows?: number;
  maxRows?: number;
  minCols?: number;
  maxCols?: number;
};

export default function MatrixInput({ label, matrix, onChange, example, minRows = 1, maxRows = 4, minCols = 1, maxCols = 4 }: MatrixInputProps) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 1;

  const resize = (nextRows: number, nextCols: number) => {
    onChange(Array.from({ length: nextRows }, (_, r) => Array.from({ length: nextCols }, (_, c) => matrix[r]?.[c] ?? 0)));
  };

  const copy = () => {
    const text = JSON.stringify(matrix);
    void navigator.clipboard?.writeText(text);
  };

  const addRow = () => { if (rows < maxRows) resize(rows + 1, cols); };
  const removeRow = () => { if (rows > minRows) resize(rows - 1, cols); };
  const addCol = () => { if (cols < maxCols) resize(rows, cols + 1); };
  const removeCol = () => { if (cols > minCols) resize(rows, cols - 1); };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-black">{label}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">{rows}×{cols}</span>
          <MatrixSizeSelector rows={rows} cols={cols} minRows={minRows} maxRows={maxRows} minCols={minCols} maxCols={maxCols} onResize={resize} />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="mobile-safe-scroll flex-1 pb-2">
          <MatrixGrid matrix={matrix} label={label} editable onChange={onChange} color={label.endsWith("B") ? "b" : "a"} />
        </div>
        <div className="flex flex-col justify-between gap-1 py-1">
          <button type="button" onClick={addRow} disabled={rows >= maxRows} className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" title="Add row">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={removeRow} disabled={rows <= minRows} className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" title="Remove row">
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex justify-start gap-1">
        <button type="button" onClick={addCol} disabled={cols >= maxCols} className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" title="Add column">
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={removeCol} disabled={cols <= minCols} className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" title="Remove column">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="ml-2 self-center text-xs text-slate-400">rows / cols</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={() => onChange(randomMatrix(rows, cols))}><Dices className="h-4 w-4" />Random</button>
        <button className="tool-button" type="button" onClick={() => onChange(createMatrix(rows, cols))}><Trash2 className="h-4 w-4" />Clear</button>
        <button className="tool-button" type="button" onClick={() => onChange(cloneMatrix(example))}><RotateCcw className="h-4 w-4" />Example</button>
        <button className="tool-button" type="button" onClick={copy}><Copy className="h-4 w-4" />Copy</button>
      </div>
    </div>
  );
}
