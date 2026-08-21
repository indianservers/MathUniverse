import { compileFunctionExpression } from "../utils/functionParser";
import type { MathDiagnostic } from "./types";

export type PointOfInterestKind = "ROOT" | "X_INTERCEPT" | "Y_INTERCEPT" | "LOCAL_MAXIMUM" | "LOCAL_MINIMUM" | "STATIONARY" | "HOLE" | "VERTICAL_ASYMPTOTE" | "HORIZONTAL_ASYMPTOTE" | "INFLECTION_CANDIDATE" | "DOMAIN_ENDPOINT";
export type PointOfInterest = { id: string; kind: PointOfInterestKind; sourceNodeIds: string[]; x?: number; y?: number; exact?: string; approximate?: string; precision: number; residual?: number; method: string; tolerance: number; verification: "VERIFIED_NUMERIC" | "CANDIDATE" | "UNVERIFIED"; assumptions: string[]; warnings: string[] };
export type FunctionAnalysis = { sourceNodeId: string; expression: string; interval: { min: number; max: number }; domainSummary: string; rangeSummary: string; increasing: Array<[number, number]>; decreasing: Array<[number, number]>; points: PointOfInterest[]; diagnostics: MathDiagnostic[]; method: { algorithm: string; tolerance: number; precision: number; samples: number; convergence: "CONVERGED" | "PARTIAL" } };

export function analyzeFunction2d(sourceNodeId: string, expression: string, interval = { min: -10, max: 10 }, tolerance = 1e-7): FunctionAnalysis {
  let fn: (x: number) => number;
  try { fn = compileFunctionExpression(expression); } catch (error) { return { sourceNodeId, expression, interval, domainSummary: "Unsupported expression", rangeSummary: "Unavailable", increasing: [], decreasing: [], points: [], diagnostics: [{ code: "UNSUPPORTED_FUNCTION", severity: "ERROR", message: error instanceof Error ? error.message : "Expression could not be compiled." }], method: { algorithm: "SAFE_SCAN_BISECTION", tolerance, precision: 12, samples: 0, convergence: "PARTIAL" } }; }
  const samples = 1600; const dx = (interval.max - interval.min) / samples; const values: Array<{ x: number; y: number }> = []; const points: PointOfInterest[] = []; const gaps: number[] = [];
  const safe = (x: number) => { try { return fn(x); } catch { return Number.NaN; } };
  for (let index = 0; index <= samples; index += 1) { const x = interval.min + index * dx; const y = safe(x); values.push({ x, y }); if (!Number.isFinite(y)) gaps.push(x); }
  for (const candidate of denominatorRoots(expression, interval, tolerance)) if (!gaps.some((gap) => Math.abs(gap - candidate) < tolerance * 20)) gaps.push(candidate);
  const add = (point: PointOfInterest) => { if (!points.some((item) => item.kind === point.kind && point.x !== undefined && item.x !== undefined && Math.abs(item.x - point.x) < Math.max(tolerance * 20, dx * 0.35))) points.push(point); };
  for (let index = 1; index < values.length; index += 1) {
    const left = values[index - 1]; const right = values[index];
    if (Number.isFinite(left.y) && Number.isFinite(right.y) && (left.y === 0 || right.y === 0 || left.y * right.y < 0)) { const x = bisect(safe, left.x, right.x, tolerance); const y = safe(x); add(poi(sourceNodeId, "ROOT", x, y, "BRACKETED_BISECTION", tolerance, Math.abs(y), Math.abs(y) <= tolerance ? "VERIFIED_NUMERIC" : "CANDIDATE")); }
  }
  for (let index = 1; index < values.length - 1; index += 1) {
    const a = values[index - 1]; const b = values[index]; const c = values[index + 1]; if (![a.y, b.y, c.y].every(Number.isFinite)) continue;
    if (b.y <= a.y && b.y <= c.y) add(poi(sourceNodeId, "LOCAL_MINIMUM", b.x, b.y, "NEIGHBORHOOD_DERIVATIVE_SCAN", dx, Math.abs(derivative(safe, b.x, dx / 4)), "CANDIDATE"));
    if (b.y >= a.y && b.y >= c.y) add(poi(sourceNodeId, "LOCAL_MAXIMUM", b.x, b.y, "NEIGHBORHOOD_DERIVATIVE_SCAN", dx, Math.abs(derivative(safe, b.x, dx / 4)), "CANDIDATE"));
  }
  const y0 = safe(0); if (interval.min <= 0 && interval.max >= 0 && Number.isFinite(y0)) add(poi(sourceNodeId, "Y_INTERCEPT", 0, y0, "DIRECT_EVALUATION", 0, 0, "VERIFIED_NUMERIC"));
  for (const gap of gaps) { const h = Math.max(dx / 8, 1e-6); const left = safe(gap - h); const right = safe(gap + h); if (!Number.isFinite(left) || !Number.isFinite(right)) continue; const limit = (left + right) / 2; if (Math.abs(left - right) < Math.max(1e-4, Math.abs(limit) * 1e-4, h * 10)) add(poi(sourceNodeId, "HOLE", gap, limit, "SYMMETRIC_LIMIT_PROBE", h, Math.abs(left - right), "VERIFIED_NUMERIC", ["The displayed y-value is a limit; the function is undefined at the hole."])); else if (Math.abs(left) + Math.abs(right) > 1e4) add(poi(sourceNodeId, "VERTICAL_ASYMPTOTE", gap, undefined, "DIVERGENCE_PROBE", h, undefined, "CANDIDATE")); }
  const finite = values.filter((entry) => Number.isFinite(entry.y)); const minY = finite.length ? Math.min(...finite.map((entry) => entry.y)) : Number.NaN; const maxY = finite.length ? Math.max(...finite.map((entry) => entry.y)) : Number.NaN;
  const [increasing, decreasing] = monotonicIntervals(values);
  const diagnostics: MathDiagnostic[] = gaps.length ? [{ code: "DOMAIN_GAPS_DETECTED", severity: "INFO", message: `${gaps.length} sampled undefined location(s) were separated during analysis.` }] : [];
  return { sourceNodeId, expression, interval, domainSummary: gaps.length ? `Real values on sampled subintervals of [${interval.min}, ${interval.max}]; ${gaps.length} undefined sample(s).` : `Continuous over sampled interval [${interval.min}, ${interval.max}] within numerical tolerance.`, rangeSummary: finite.length ? `Sampled range approximately [${format(minY)}, ${format(maxY)}]; not a global proof.` : "No finite sampled range.", increasing, decreasing, points: points.sort((a, b) => (a.x ?? 0) - (b.x ?? 0) || a.kind.localeCompare(b.kind)), diagnostics, method: { algorithm: "SAFE_SCAN_BISECTION_AND_SYMMETRIC_LIMITS", tolerance, precision: 12, samples, convergence: gaps.length > samples / 2 ? "PARTIAL" : "CONVERGED" } };
}

function poi(source: string, kind: PointOfInterestKind, x: number, y: number | undefined, method: string, tolerance: number, residual: number | undefined, verification: PointOfInterest["verification"], warnings: string[] = []): PointOfInterest { return { id: `poi-${source}-${kind.toLowerCase()}-${format(x)}`, kind, sourceNodeIds: [source], x, y, approximate: y === undefined ? `x≈${format(x)}` : `(${format(x)}, ${format(y)})`, precision: 12, residual, method, tolerance, verification, assumptions: ["real-valued evaluation on the declared interval"], warnings }; }
function bisect(fn: (x: number) => number, low: number, high: number, tolerance: number) { let lo = low; let hi = high; let flo = fn(lo); for (let index = 0; index < 80 && hi - lo > tolerance; index += 1) { const mid = (lo + hi) / 2; const fm = fn(mid); if (!Number.isFinite(fm)) break; if (flo === 0 || flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } } return (lo + hi) / 2; }
function derivative(fn: (x: number) => number, x: number, h: number) { return (fn(x + h) - fn(x - h)) / (2 * h); }
function denominatorRoots(expression: string, interval: { min: number; max: number }, tolerance: number) {
  const roots: number[] = []; const matches = expression.matchAll(/\/\(([^()]+)\)/g);
  for (const match of matches) {
    try {
      const denominator = compileFunctionExpression(match[1]); const steps = 400; let previousX = interval.min; let previousY = denominator(previousX);
      for (let index = 1; index <= steps; index += 1) {
        const x = interval.min + (interval.max - interval.min) * index / steps; const y = denominator(x);
        if (Number.isFinite(y) && Math.abs(y) <= tolerance) roots.push(x);
        else if (Number.isFinite(previousY) && Number.isFinite(y) && previousY * y < 0) roots.push(bisect(denominator, previousX, x, tolerance));
        previousX = x; previousY = y;
      }
    } catch { /* The main analysis will retain its declared partial result. */ }
  }
  return roots.filter((root, index) => roots.findIndex((candidate) => Math.abs(candidate - root) < tolerance * 20) === index);
}
function monotonicIntervals(values: Array<{ x: number; y: number }>): [Array<[number, number]>, Array<[number, number]>] { const increasing: Array<[number, number]> = []; const decreasing: Array<[number, number]> = []; let direction = 0; let start = values[0]?.x ?? 0; for (let index = 1; index < values.length; index += 1) { const previous = values[index - 1]; const current = values[index]; const next = Number.isFinite(previous.y) && Number.isFinite(current.y) ? Math.sign(current.y - previous.y) : 0; if (next !== direction) { if (direction > 0) increasing.push([start, previous.x]); if (direction < 0) decreasing.push([start, previous.x]); start = current.x; direction = next; } } const end = values.at(-1)?.x ?? start; if (direction > 0) increasing.push([start, end]); if (direction < 0) decreasing.push([start, end]); return [increasing, decreasing]; }
function format(value: number) { return Number(value.toPrecision(10)).toString(); }
