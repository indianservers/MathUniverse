import type { MathDiagnostic } from "./types";

export type GraphQualityProfile = "PERFORMANCE" | "BALANCED" | "HIGH_ACCURACY";
export type AdaptiveViewport = { xMin: number; xMax: number; yMin: number; yMax: number; pixelWidth: number; pixelHeight: number };
export type AdaptivePoint = { x: number; y: number };
export type AdaptiveSegment = { points: AdaptivePoint[]; reason?: "DOMAIN_GAP" | "DISCONTINUITY" | "OVERFLOW" | "CANCELLED" };
export type SamplingEvidence = { method: "ADAPTIVE_SUBDIVISION"; profile: GraphQualityProfile; tolerancePixels: number; maximumDepth: number; evaluations: number; convergence: "CONVERGED" | "PARTIAL" | "CANCELLED"; estimatedScreenError: number };
export type AdaptiveGraphResult = { segments: AdaptiveSegment[]; diagnostics: MathDiagnostic[]; evidence: SamplingEvidence };

const profileSettings: Record<GraphQualityProfile, { tolerancePixels: number; maximumDepth: number; initialIntervals: number; maximumEvaluations: number }> = {
  PERFORMANCE: { tolerancePixels: 2.5, maximumDepth: 8, initialIntervals: 48, maximumEvaluations: 8_000 },
  BALANCED: { tolerancePixels: 1.25, maximumDepth: 11, initialIntervals: 72, maximumEvaluations: 20_000 },
  HIGH_ACCURACY: { tolerancePixels: 0.55, maximumDepth: 14, initialIntervals: 96, maximumEvaluations: 60_000 },
};

export type SamplingCancellation = { readonly cancelled: boolean };

export function adaptiveSampleExplicit(fn: (x: number) => number, viewport: AdaptiveViewport, profile: GraphQualityProfile = "BALANCED", cancellation?: SamplingCancellation): AdaptiveGraphResult {
  const settings = profileSettings[profile]; const diagnostics: MathDiagnostic[] = []; let evaluations = 0; let maxError = 0; let reachedLimit = false;
  const evaluate = (x: number) => { evaluations += 1; if (evaluations > settings.maximumEvaluations) { reachedLimit = true; return Number.NaN; } try { return fn(x); } catch { return Number.NaN; } };
  const yScale = viewport.pixelHeight / Math.max(Number.EPSILON, viewport.yMax - viewport.yMin);
  const xScale = viewport.pixelWidth / Math.max(Number.EPSILON, viewport.xMax - viewport.xMin);
  const finitePoint = (x: number, y: number): AdaptivePoint | undefined => Number.isFinite(y) && Math.abs(y) < 1e14 ? { x, y } : undefined;
  const segments: AdaptiveSegment[] = []; let current: AdaptivePoint[] = [];
  const flush = (reason?: AdaptiveSegment["reason"]) => { if (current.length > 1) segments.push({ points: dedupeAdjacent(current), reason }); current = []; };
  const append = (point: AdaptivePoint) => { const previous = current[current.length - 1]; if (!previous || previous.x !== point.x || previous.y !== point.y) current.push(point); };
  const discontinuityEvidence = (a: AdaptivePoint, middle: AdaptivePoint, b: AdaptivePoint) => {
    const jumpPixels = Math.abs(b.y - a.y) * yScale; const slopeA = (middle.y - a.y) / Math.max(Number.EPSILON, middle.x - a.x); const slopeB = (b.y - middle.y) / Math.max(Number.EPSILON, b.x - middle.x);
    const visibleSpan = Math.max(1, viewport.yMax - viewport.yMin);
    const oppositeLargeSides = Math.sign(a.y) !== Math.sign(b.y) && Math.min(Math.abs(a.y), Math.abs(b.y)) > visibleSpan * 4;
    const runawayMiddle = jumpPixels > viewport.pixelHeight * 1.5 && Math.sign(slopeA) === Math.sign(slopeB) && Math.abs(middle.y) > Math.max(visibleSpan * 4, Math.abs(a.y), Math.abs(b.y));
    return oppositeLargeSides || runawayMiddle;
  };
  const refine = (ax: number, ay: number, bx: number, by: number, depth: number): AdaptivePoint[] | undefined => {
    if (cancellation?.cancelled || reachedLimit) return undefined;
    const mx = (ax + bx) / 2; const my = evaluate(mx); const a = finitePoint(ax, ay); const middle = finitePoint(mx, my); const b = finitePoint(bx, by);
    if (!a || !middle || !b) return undefined;
    if (discontinuityEvidence(a, middle, b)) return undefined;
    const linearY = (ay + by) / 2; const screenError = Math.abs(my - linearY) * yScale; const horizontalPixels = Math.abs(bx - ax) * xScale; maxError = Math.max(maxError, screenError);
    const curvature = Math.abs((my - ay) / Math.max(Number.EPSILON, mx - ax) - (by - my) / Math.max(Number.EPSILON, bx - mx));
    const needsRefinement = depth < settings.maximumDepth && horizontalPixels > 1 && (screenError > settings.tolerancePixels || curvature * horizontalPixels > 8);
    if (!needsRefinement) return [a, b];
    const left = refine(ax, ay, mx, my, depth + 1); const right = refine(mx, my, bx, by, depth + 1);
    if (!left || !right) return undefined;
    return [...left.slice(0, -1), ...right];
  };
  let previousX = viewport.xMin; let previousY = evaluate(previousX);
  for (let index = 1; index <= settings.initialIntervals; index += 1) {
    if (cancellation?.cancelled || reachedLimit) break;
    const x = viewport.xMin + (viewport.xMax - viewport.xMin) * index / settings.initialIntervals; const y = evaluate(x);
    const refined = refine(previousX, previousY, x, y, 0);
    if (!refined) { flush(!Number.isFinite(previousY) || !Number.isFinite(y) ? "DOMAIN_GAP" : "DISCONTINUITY"); }
    else refined.forEach(append);
    previousX = x; previousY = y;
  }
  flush(cancellation?.cancelled ? "CANCELLED" : undefined);
  if (reachedLimit) diagnostics.push({ code: "SAMPLING_LIMIT_REACHED", severity: "WARNING", message: `Sampling stopped after ${settings.maximumEvaluations} evaluations to protect responsiveness.` });
  if (cancellation?.cancelled) diagnostics.push({ code: "SAMPLING_CANCELLED", severity: "INFO", message: "A stale graph calculation was cancelled." });
  if (!segments.length) diagnostics.push({ code: "NO_VISIBLE_REAL_VALUES", severity: "WARNING", message: "No drawable finite real values were found in the viewport." });
  return { segments, diagnostics, evidence: { method: "ADAPTIVE_SUBDIVISION", profile, tolerancePixels: settings.tolerancePixels, maximumDepth: settings.maximumDepth, evaluations, convergence: cancellation?.cancelled ? "CANCELLED" : reachedLimit ? "PARTIAL" : "CONVERGED", estimatedScreenError: maxError } };
}

function dedupeAdjacent(points: AdaptivePoint[]) { return points.filter((point, index) => index === 0 || Math.abs(point.x - points[index - 1].x) > 1e-14 || Math.abs(point.y - points[index - 1].y) > 1e-14); }
