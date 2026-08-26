import type { FunctionGraphView } from "../components/math-lab/FunctionGraphCanvas";
import type { GraphSample } from "../utils/mathEngine/graphSampler";

type FittableSeries = {
  visible: boolean;
  error?: string;
  points: GraphSample[];
};

const MIN_SPAN = 1e-6;
const MAX_SPAN = 1e8;

export function zoomGraphView(view: FunctionGraphView, factor: number): FunctionGraphView {
  const centerX = (view.xMin + view.xMax) / 2;
  const centerY = (view.yMin + view.yMax) / 2;
  const width = clampSpan((view.xMax - view.xMin) * factor);
  const height = clampSpan((view.yMax - view.yMin) * factor);
  return {
    xMin: centerX - width / 2,
    xMax: centerX + width / 2,
    yMin: centerY - height / 2,
    yMax: centerY + height / 2,
  };
}

export function fitGraphView(series: FittableSeries[], fallback: FunctionGraphView): FunctionGraphView {
  const points = series
    .filter((item) => item.visible && !item.error)
    .flatMap((item) => item.points)
    .filter((point): point is GraphSample & { y: number } => point.valid && point.y !== null && Number.isFinite(point.x) && Number.isFinite(point.y));
  if (!points.length) return fallback;

  const xs = points.map((point) => point.x).sort((a, b) => a - b);
  const ys = points.map((point) => point.y).sort((a, b) => a - b);
  const xMin = xs[0];
  const xMax = xs.at(-1)!;
  // Trim only the most extreme vertical samples so asymptotes do not make the useful graph unreadable.
  const yMin = percentile(ys, ys.length >= 100 ? 0.01 : 0);
  const yMax = percentile(ys, ys.length >= 100 ? 0.99 : 1);
  return paddedView(xMin, xMax, yMin, yMax);
}

function paddedView(xMin: number, xMax: number, yMin: number, yMax: number): FunctionGraphView {
  const xSpan = Math.max(MIN_SPAN, xMax - xMin);
  const ySpan = Math.max(MIN_SPAN, yMax - yMin);
  const xPadding = xSpan <= MIN_SPAN ? Math.max(1, Math.abs(xMin) * 0.2) : xSpan * 0.08;
  const yPadding = ySpan <= MIN_SPAN ? Math.max(1, Math.abs(yMin) * 0.2) : ySpan * 0.1;
  return {
    xMin: xMin - xPadding,
    xMax: xMax + xPadding,
    yMin: yMin - yPadding,
    yMax: yMax + yPadding,
  };
}

function percentile(values: number[], ratio: number) {
  if (!values.length) return 0;
  return values[Math.min(values.length - 1, Math.max(0, Math.round((values.length - 1) * ratio)))];
}

function clampSpan(value: number) {
  return Math.min(MAX_SPAN, Math.max(MIN_SPAN, value));
}
