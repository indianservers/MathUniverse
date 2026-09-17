import { escapeTime } from "./fractalMath";

export type FractalJob = {
  kind: "mandel" | "julia";
  cx: number;
  cy: number;
  iter: number;
  cols: number;
  rows: number;
};

export function computeFractalGrid(job: FractalJob) {
  const { kind, cx, cy, iter, cols, rows } = job;
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = -2.2 + (col / Math.max(1, cols - 1)) * 3.2;
    const y = 1.4 - (row / Math.max(1, rows - 1)) * 2.8;
    const k = kind === "mandel" ? escapeTime(0, 0, x, y, iter) : escapeTime(x, y, cx, cy, iter);
    return { col, row, k };
  });
  return cells;
}
