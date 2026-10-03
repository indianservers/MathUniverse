export type AdaptiveSample = { x: number; y: number | null; valid: boolean };

const MAX_POINTS = 2400;
const MAX_DEPTH = 8;

export function sampleExplicitAdaptive(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  ySpan = 20,
  seed = 160,
): AdaptiveSample[] {
  const span = Math.max(1e-9, xMax - xMin);
  const vertical = Math.max(1, Math.abs(ySpan));
  const seeds = Math.max(24, Math.min(400, Math.round(seed)));
  const xs = Array.from({ length: seeds + 1 }, (_, index) => xMin + (span * index) / seeds);
  const ys = xs.map((x) => evaluate(fn, x));
  const points: AdaptiveSample[] = [];

  push(points, xs[0]!, ys[0]!);
  for (let index = 1; index < xs.length; index += 1) {
    const x0 = xs[index - 1]!;
    const x1 = xs[index]!;
    const y0 = ys[index - 1]!;
    const y1 = ys[index]!;
    // Reserve sampling capacity for every seed interval, including the far end
    // of domains that start with undefined values or a steep asymptote.
    const limit = points.length + Math.floor((MAX_POINTS - 1) / seeds) - 1;
    refine(fn, x0, x1, y0, y1, 0, points, vertical, limit);
    if (points.at(-1)?.x !== x1) push(points, x1, y1);
  }

  return points;
}

function refine(
  fn: (x: number) => number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  depth: number,
  out: AdaptiveSample[],
  vertical: number,
  limit: number,
) {
  if (out.length >= limit) {
    return;
  }

  const finite0 = Number.isFinite(y0);
  const finite1 = Number.isFinite(y1);
  if (!finite0 || !finite1) {
    if (depth < MAX_DEPTH && x1 - x0 > 1e-8) {
      const xm = (x0 + x1) / 2;
      const ym = evaluate(fn, xm);
      if (!finite0 && !finite1 && !Number.isFinite(ym)) {
        push(out, x1, y1);
        return;
      }
      refine(fn, x0, xm, y0, ym, depth + 1, out, vertical, limit);
      refine(fn, xm, x1, ym, y1, depth + 1, out, vertical, limit);
      return;
    }
    push(out, x1, y1);
    return;
  }

  const xm = (x0 + x1) / 2;
  const ym = evaluate(fn, xm);
  if (!Number.isFinite(ym)) {
    push(out, x1, Number.NaN);
    push(out, x1, y1);
    return;
  }

  const predicted = (y0 + y1) / 2;
  const error = Math.abs(ym - predicted);
  const jump = Math.abs(y1 - y0);
  const shouldSplit =
    depth < MAX_DEPTH &&
    (error > vertical * 0.0035 || jump > vertical * 0.18) &&
    x1 - x0 > 1e-7;

  if (shouldSplit) {
    refine(fn, x0, xm, y0, ym, depth + 1, out, vertical, limit);
    refine(fn, xm, x1, ym, y1, depth + 1, out, vertical, limit);
    return;
  }

  push(out, x1, y1);
}

function evaluate(fn: (x: number) => number, x: number) {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? y : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

function push(points: AdaptiveSample[], x: number, y: number) {
  points.push(
    Number.isFinite(y)
      ? { x, y, valid: true }
      : { x, y: null, valid: false },
  );
}
