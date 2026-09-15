export function fitMetrics(xs: number[], ys: number[], predict: (x: number) => number) {
  const n = xs.length || 1;
  const errs = xs.map((x, i) => (ys[i] ?? 0) - predict(x));
  const rmse = Math.sqrt(errs.reduce((s, e) => s + e * e, 0) / n);
  const mae = errs.reduce((s, e) => s + Math.abs(e), 0) / n;
  const mean = ys.reduce((s, y) => s + y, 0) / n;
  const sst = ys.reduce((s, y) => s + (y - mean) ** 2, 0) || 1;
  const sse = errs.reduce((s, e) => s + e * e, 0);
  return { rmse, mae, r2: 1 - sse / sst };
}

export function aic(rmse: number, n: number, params: number, lambda: number) {
  return n * Math.log(rmse * rmse + 1e-9) + params * (2 + lambda);
}

export function sampleGrowth(n = 24) {
  const xs = Array.from({ length: n }, (_, i) => i);
  const ys = xs.map((x) => 8 + 0.4 * x + 0.12 * x * x + (x % 5) * 0.3);
  return { xs, ys };
}

export function parseCsvPairs(text: string) {
  const xs: number[] = [];
  const ys: number[] = [];
  text.split(/\r?\n/).forEach((line) => {
    const cells = line.trim().split(/[,;\t ]+/).filter(Boolean);
    if (cells.length < 2) return;
    const x = Number(cells[0]);
    const y = Number(cells[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      xs.push(x);
      ys.push(y);
    }
  });
  return xs.length ? { xs, ys } : sampleGrowth();
}

export function formatComparisonReport(
  scores: Array<{ name: string; rmse: number; r2: number; aic: number }>,
) {
  const lines = ["Model,RMSE,R2,AIC", ...scores.map((s) => `${s.name},${s.rmse.toFixed(4)},${s.r2.toFixed(4)},${s.aic.toFixed(3)}`)];
  return lines.join("\n");
}
