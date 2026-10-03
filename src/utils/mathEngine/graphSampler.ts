import { compileFunctionExpression, compileTwoVariableExpression } from "../functionParser";
import { sampleExplicitAdaptive } from "./adaptiveSampler";

export type GraphSample = {
  x: number;
  y: number | null;
  valid: boolean;
};

export type CompileResult = {
  normalized: string;
  fn?: (x: number) => number;
  error?: string;
};

export function normalizeFunctionInput(input: string) {
  return input
    .trim()
    .replace(/^y\s*=/i, "")
    .replace(/\u2212/g, "-")
    .replace(/\u00f7/g, "/")
    .replace(/\u00d7/g, "*")
    .replace(/\u03c0/g, "pi")
    .replace(/\s+/g, "");
}

export function compileFunction(input: string): CompileResult {
  const normalized = normalizeFunctionInput(input);
  try {
    return { normalized, fn: compileFunctionExpression(normalized) };
  } catch (error) {
    return { normalized, error: error instanceof Error ? error.message : "Invalid function" };
  }
}

export function safeEvaluateFunction(input: string, x: number) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return { x, y: null, valid: false, error: compiled.error ?? "Invalid function" };
  try {
    const y = compiled.fn(x);
    return Number.isFinite(y) ? { x, y, valid: true } : { x, y: null, valid: false };
  } catch {
    return { x, y: null, valid: false };
  }
}

export function sampleFunction(input: string, xMin = -10, xMax = 10, samples = 300) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return { points: [] as GraphSample[], error: compiled.error, normalized: compiled.normalized };

  const ySpan = Math.max(8, Math.abs(xMax - xMin));
  const points = sampleExplicitAdaptive(
    compiled.fn,
    xMin,
    xMax,
    ySpan,
    Math.max(80, Math.min(360, Math.round(samples / 4))),
  );

  return { points, normalized: compiled.normalized };
}

export function generateTableValues(input: string, start = -5, end = 5, step = 1) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return { rows: [] as GraphSample[], error: compiled.error };
  const rows: GraphSample[] = [];
  const direction = end >= start ? 1 : -1;
  const safeStep = Math.max(Math.abs(step), 0.0001) * direction;
  const inRange = (x: number) => direction > 0 ? x <= end + Math.abs(safeStep) / 2 : x >= end - Math.abs(safeStep) / 2;
  for (let x = start; inRange(x) && rows.length < 1000; x += safeStep) {
    const value = safeEvaluateCompiled(compiled.fn, Number(x.toFixed(8)));
    rows.push(value);
  }
  return { rows };
}

export function approximateRoots(input: string, xMin = -10, xMax = 10) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return { roots: [] as number[], error: compiled.error };
  const fn = compiled.fn;
  const points = sampleFunction(input, xMin, xMax, 600).points;
  const roots: number[] = [];
  const evaluate = (x: number) => { try { return fn(x); } catch { return NaN; } };
  const accept = (x: number) => {
    const integer = Math.round(x);
    const snapped = Math.abs(integer - x) < 1e-8 && evaluate(integer) === 0 ? integer : Number(x.toPrecision(12));
    if (Math.abs(snapped - x) < 1e-8 && evaluate(snapped) === 0) x = snapped;
    const residual = evaluate(x);
    const delta = Math.max(1e-6, Math.abs(x) * 1e-7);
    const left = evaluate(x - delta), right = evaluate(x + delta);
    // Floating-point underflow produces zero plateaus, not isolated roots.
    if (residual === 0 && Number.isFinite(left) && Number.isFinite(right) && (left === 0 || right === 0)) return;
    const side = Number.isFinite(right) ? 1 : -1;
    const coarse = Number.isFinite(left) && Number.isFinite(right) ? Math.abs(right - left) : Math.abs(evaluate(x + side * 2 * delta) - evaluate(x + side * delta));
    const fine = Number.isFinite(left) && Number.isFinite(right) ? Math.abs(evaluate(x + delta / 2) - evaluate(x - delta / 2)) : Math.abs(evaluate(x + side * delta) - evaluate(x + side * delta / 2));
    const continuous = Number.isFinite(coarse) && Number.isFinite(fine) && (coarse < 1e-7 || fine < coarse * 0.999);
    if (continuous && Number.isFinite(residual) && Math.abs(residual) <= 1e-12 && !roots.some(r => Math.abs(r - x) < 1e-5)) roots.push(x);
  };
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const previous = points[i - 1];
    if (previous && previous.valid !== p.valid) {
      let low = previous.x, high = p.x;
      for (let step = 0; step < 48; step++) {
        const mid = (low + high) / 2;
        if (Number.isFinite(evaluate(mid)) === previous.valid) low = mid; else high = mid;
      }
      accept(previous.valid ? low : high);
    }
    if (!p.valid || p.y === null) continue;
    const prev = points[i - 1];
    const next = points[i + 1];
    if (p.y === 0 && ((prev?.valid && prev.y !== 0) || (next?.valid && next.y !== 0))) accept(p.x);
    if (prev?.valid && prev.y !== null && prev.y * p.y < 0) {
      let low = prev.x, high = p.x, lowValue = prev.y;
      for (let step = 0; step < 48; step++) {
        const mid = (low + high) / 2, value = evaluate(mid);
        if (!Number.isFinite(value)) break;
        if (value === 0) { low = high = mid; break; }
        if (Math.sign(value) === Math.sign(lowValue)) { low = mid; lowValue = value; } else high = mid;
      }
      accept((low + high) / 2);
    }
    // Refine isolated local minima of |f| to find tangent roots without
    // treating the small positive tails of exponentials as zeroes.
    if (prev?.valid && next?.valid && prev.y !== null && next.y !== null &&
        Math.abs(p.y) < Math.abs(prev.y) && Math.abs(p.y) <= Math.abs(next.y)) {
      let low = prev.x, high = next.x;
      for (let step = 0; step < 80; step++) {
        const l = low + (high - low) / 3, r = high - (high - low) / 3;
        if (Math.abs(evaluate(l)) < Math.abs(evaluate(r))) high = r; else low = l;
      }
      accept((low + high) / 2);
    }
  }
  return { roots: roots.sort((a,b) => a-b).slice(0, 12) };
}

export function approximateYIntercept(input: string) {
  const value = safeEvaluateFunction(input, 0);
  return value.valid ? { y: value.y } : { y: null, error: value.error ?? "Function is undefined at x = 0." };
}

export function approximateVisibleRange(input: string, xMin = -10, xMax = 10) {
  const sampled = sampleFunction(input, xMin, xMax, 500);
  if (sampled.error) return { min: null, max: null, error: sampled.error };
  const values = sampled.points.map((point) => point.y).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return values.length ? { min: Math.min(...values), max: Math.max(...values) } : { min: null, max: null, error: "No real values in visible window." };
}

export function detectDiscontinuities(samples: GraphSample[]) {
  const jumps: number[] = [];
  for (let index = 1; index < samples.length; index += 1) {
    const prev = samples[index - 1];
    const curr = samples[index];
    if (!prev.valid || !curr.valid || prev.y === null || curr.y === null) {
      if (prev.valid !== curr.valid) jumps.push(curr.x);
      continue;
    }
    if (Math.abs(curr.y - prev.y) > 25) jumps.push((curr.x + prev.x) / 2);
  }
  return dedupeRounded(jumps).slice(0, 12);
}

export function sampleSurface(expression: string, min = -3, max = 3, steps = 40) {
  const fn = compileTwoVariableExpression(expression.trim().replace(/^z\s*=/i, ""));
  const size = Math.max(2, Math.min(120, Math.round(steps)));
  return Array.from({ length: size }, (_, yIndex) => {
    const y = min + (yIndex / Math.max(1, size - 1)) * (max - min);
    return Array.from({ length: size }, (_, xIndex) => {
      const x = min + (xIndex / Math.max(1, size - 1)) * (max - min);
      try {
        const z = fn(x, y);
        return { x, y, z: Number.isFinite(z) ? z : Number.NaN };
      } catch {
        return { x, y, z: Number.NaN };
      }
    });
  });
}

function safeEvaluateCompiled(fn: (x: number) => number, x: number): GraphSample {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? { x, y, valid: true } : { x, y: null, valid: false };
  } catch {
    return { x, y: null, valid: false };
  }
}

function dedupeRounded(values: number[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toFixed(3);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
