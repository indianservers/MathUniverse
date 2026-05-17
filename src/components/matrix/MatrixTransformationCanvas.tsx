import type { Cell, Matrix } from "../../utils/matrixOperations";
import { apply2DTransformation } from "../../utils/matrixOperations";

type MatrixTransformationCanvasProps = {
  matrix: Matrix;
  points?: Cell[];
};

const defaultShape: Cell[] = [[0, 0], [1.4, 0], [1.4, 1.2], [0, 1.2]];

export default function MatrixTransformationCanvas({ matrix, points = defaultShape }: MatrixTransformationCanvasProps) {
  const transformed = apply2DTransformation(matrix, points);
  const toPoint = ([x, y]: Cell) => `${180 + x * 55},${180 - y * 55}`;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
      <svg viewBox="0 0 360 360" className="h-[360px] w-full">
        {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => (
          <g key={value}>
            <line x1={0} x2={360} y1={180 + value * 30} y2={180 + value * 30} stroke="rgba(148,163,184,.22)" />
            <line x1={180 + value * 30} x2={180 + value * 30} y1={0} y2={360} stroke="rgba(148,163,184,.22)" />
          </g>
        ))}
        <line x1="0" x2="360" y1="180" y2="180" stroke="#64748b" />
        <line x1="180" x2="180" y1="0" y2="360" stroke="#64748b" />
        <polygon points={points.map(toPoint).join(" ")} fill="rgba(6,182,212,.18)" stroke="#06b6d4" strokeWidth="4" />
        <polygon points={transformed.map(toPoint).join(" ")} fill="rgba(249,115,22,.20)" stroke="#f97316" strokeWidth="4" />
      </svg>
    </div>
  );
}
