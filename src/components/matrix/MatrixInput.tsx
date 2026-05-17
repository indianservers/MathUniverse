import { Copy, Dices, RotateCcw, Trash2 } from "lucide-react";
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-black">{label}</h3>
        <MatrixSizeSelector rows={rows} cols={cols} minRows={minRows} maxRows={maxRows} minCols={minCols} maxCols={maxCols} onResize={resize} />
      </div>
      <div className="mobile-safe-scroll pb-2">
        <MatrixGrid matrix={matrix} label={label} editable onChange={onChange} color={label.endsWith("B") ? "b" : "a"} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={() => onChange(randomMatrix(rows, cols))}><Dices className="h-4 w-4" />Random</button>
        <button className="tool-button" type="button" onClick={() => onChange(createMatrix(rows, cols))}><Trash2 className="h-4 w-4" />Clear</button>
        <button className="tool-button" type="button" onClick={() => onChange(cloneMatrix(example))}><RotateCcw className="h-4 w-4" />Example</button>
        <button className="tool-button" type="button" onClick={copy}><Copy className="h-4 w-4" />Copy</button>
      </div>
    </div>
  );
}
