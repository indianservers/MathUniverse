import { compileFunctionExpression, compileTwoVariableExpression } from "../functionParser";

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
    .replace(/\s+/g, "")
    .replace(/(\d|\)|x|pi|e)(?=(x|pi|e|sin|cos|tan|asin|acos|atan|ln|log|exp|sqrt|cbrt|abs|floor|ceil|\())/gi, "$1*");
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

  const count = Math.max(2, samples);
  const points = Array.from({ length: count }, (_, index) => {
    const x = xMin + (index / (count - 1)) * (xMax - xMin);
    try {
      const y = compiled.fn!(x);
      return Number.isFinite(y) ? { x, y, valid: true } : { x, y: null, valid: false };
    } catch {
      return { x, y: null, valid: false };
    }
  });

  return { points, normalized: compiled.normalized };
}

export function generateTableValues(input: string, start = -5, end = 5, step = 1) {
  const compiled = compileFunction(input);
  if (!compiled.fn) return { rows: [] as GraphSample[], error: compiled.error };
  const rows: GraphSample[] = [];
  const safeStep = Math.max(Math.abs(step), 0.0001);
  for (let x = start; x <= end + safeStep / 2 && rows.length < 1000; x += safeStep) {
    const value = safeEvaluateCompiled(compiled.fn, Number(x.toFixed(8)));
    rows.push(value);
  }
  return { rows };
}

export function approximateRoots(input: string, xMin = -10, xMax = 10) {
  const sampled = sampleFunction(input, xMin, xMax, 600);
  if (sampled.error) return { roots: [] as number[], error: sampled.error };
  const roots: number[] = [];
  const points = sampled.points;
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const curr = points[index];
    if (!prev.valid || !curr.valid || prev.y === null || curr.y === null) continue;
    if (Math.abs(curr.y) < 0.015) roots.push(curr.x);
    if (prev.y * curr.y < 0) {
      const root = prev.x - (prev.y * (curr.x - prev.x)) / (curr.y - prev.y);
      roots.push(root);
    }
  }
  return { roots: dedupeRounded(roots).slice(0, 12) };
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
  const fn = compileTwoVariableExpression(expression);
  return Array.from({ length: steps }, (_, yIndex) => {
    const y = min + (yIndex / Math.max(1, steps - 1)) * (max - min);
    return Array.from({ length: steps }, (_, xIndex) => {
      const x = min + (xIndex / Math.max(1, steps - 1)) * (max - min);
      return { x, y, z: fn(x, y) };
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
