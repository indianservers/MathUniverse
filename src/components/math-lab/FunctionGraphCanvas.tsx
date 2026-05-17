import type { GraphSample } from "../../utils/mathEngine/graphSampler";
import type { PointerEvent } from "react";

export type FunctionGraphSeries = {
  id: string;
  label: string;
  color: string;
  points: GraphSample[];
  visible: boolean;
};

export type FunctionGraphView = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type FunctionGraphCanvasProps = {
  series: FunctionGraphSeries[];
  view: FunctionGraphView;
  showGrid?: boolean;
  showAxes?: boolean;
  traceX?: number;
  selectedSeriesId?: string;
  onTraceChange?: (x: number) => void;
};

const WIDTH = 720;
const HEIGHT = 440;

export default function FunctionGraphCanvas({
  series,
  view,
  showGrid = true,
  showAxes = true,
  traceX,
  selectedSeriesId,
  onTraceChange,
}: FunctionGraphCanvasProps) {
  const toScreen = (x: number, y: number) => ({
    x: ((x - view.xMin) / (view.xMax - view.xMin)) * WIDTH,
    y: HEIGHT - ((y - view.yMin) / (view.yMax - view.yMin)) * HEIGHT,
  });

  const traceSeries = series.find((item) => item.id === selectedSeriesId && item.visible) ?? series.find((item) => item.visible);
  const tracePoint = traceSeries && typeof traceX === "number" ? nearestPoint(traceSeries.points, traceX) : null;

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!onTraceChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onTraceChange(view.xMin + ratio * (view.xMax - view.xMin));
  }

  return (
    <svg
      className="h-full min-h-[360px] w-full touch-none rounded-2xl border border-slate-200 bg-white shadow-inner dark:border-white/10 dark:bg-slate-950"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Interactive function graph"
      onPointerMove={handlePointerMove}
    >
      <rect width={WIDTH} height={HEIGHT} fill="currentColor" className="text-white dark:text-slate-950" />
      {showGrid && <Grid view={view} toScreen={toScreen} />}
      {showAxes && <Axes view={view} toScreen={toScreen} />}
      {series.filter((item) => item.visible).map((item) => (
        <g key={item.id}>
          {segmentsFor(item.points, view, toScreen).map((segment, index) => (
            <polyline
              key={`${item.id}-${index}`}
              points={segment}
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.92"
            />
          ))}
        </g>
      ))}
      {tracePoint && traceSeries && typeof tracePoint.y === "number" && (
        <g>
          <line x1={toScreen(tracePoint.x, view.yMin).x} x2={toScreen(tracePoint.x, view.yMin).x} y1="0" y2={HEIGHT} stroke="#64748b" strokeDasharray="5 7" opacity="0.45" />
          <circle cx={toScreen(tracePoint.x, tracePoint.y).x} cy={toScreen(tracePoint.x, tracePoint.y).y} r="7" fill={traceSeries.color} stroke="#ffffff" strokeWidth="3" />
          <g transform={`translate(${Math.min(WIDTH - 190, Math.max(10, toScreen(tracePoint.x, tracePoint.y).x + 12))}, ${Math.min(HEIGHT - 72, Math.max(12, toScreen(tracePoint.x, tracePoint.y).y - 42))})`}>
            <rect width="178" height="62" rx="14" fill="#0f172a" opacity="0.92" />
            <text x="12" y="22" fill="#e0f2fe" fontSize="13" fontWeight="700">{traceSeries.label}</text>
            <text x="12" y="44" fill="#ffffff" fontSize="13">x={formatTick(tracePoint.x)}, y={formatTick(tracePoint.y)}</text>
          </g>
        </g>
      )}
    </svg>
  );
}

function Grid({ view, toScreen }: { view: FunctionGraphView; toScreen: (x: number, y: number) => { x: number; y: number } }) {
  const xTicks = niceTicks(view.xMin, view.xMax, 12);
  const yTicks = niceTicks(view.yMin, view.yMax, 8);
  return (
    <g>
      {xTicks.map((tick) => {
        const x = toScreen(tick, 0).x;
        return <line key={`x-${tick}`} x1={x} x2={x} y1="0" y2={HEIGHT} stroke="#94a3b8" opacity="0.18" />;
      })}
      {yTicks.map((tick) => {
        const y = toScreen(0, tick).y;
        return <line key={`y-${tick}`} x1="0" x2={WIDTH} y1={y} y2={y} stroke="#94a3b8" opacity="0.18" />;
      })}
      {xTicks.map((tick) => {
        const point = toScreen(tick, 0);
        return tick !== 0 && point.y > 14 && point.y < HEIGHT - 8 ? <text key={`xl-${tick}`} x={point.x + 4} y={point.y - 6} fill="#64748b" fontSize="11">{formatTick(tick)}</text> : null;
      })}
      {yTicks.map((tick) => {
        const point = toScreen(0, tick);
        return tick !== 0 && point.x > 8 && point.x < WIDTH - 22 ? <text key={`yl-${tick}`} x={point.x + 6} y={point.y - 4} fill="#64748b" fontSize="11">{formatTick(tick)}</text> : null;
      })}
    </g>
  );
}

function Axes({ view, toScreen }: { view: FunctionGraphView; toScreen: (x: number, y: number) => { x: number; y: number } }) {
  const yAxisX = toScreen(0, 0).x;
  const xAxisY = toScreen(0, 0).y;
  return (
    <g>
      {view.yMin <= 0 && view.yMax >= 0 && <line x1="0" x2={WIDTH} y1={xAxisY} y2={xAxisY} stroke="#0f172a" strokeWidth="2" opacity="0.65" />}
      {view.xMin <= 0 && view.xMax >= 0 && <line x1={yAxisX} x2={yAxisX} y1="0" y2={HEIGHT} stroke="#0f172a" strokeWidth="2" opacity="0.65" />}
    </g>
  );
}

function segmentsFor(points: GraphSample[], view: FunctionGraphView, toScreen: (x: number, y: number) => { x: number; y: number }) {
  const segments: string[] = [];
  let current: string[] = [];
  let previousY: number | null = null;
  const visibleHeight = view.yMax - view.yMin;
  points.forEach((point) => {
    const jump = previousY !== null && point.y !== null && Math.abs(point.y - previousY) > visibleHeight * 0.65;
    if (!point.valid || point.y === null || jump || point.y < view.yMin - visibleHeight || point.y > view.yMax + visibleHeight) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
      previousY = point.y;
      return;
    }
    const screen = toScreen(point.x, point.y);
    current.push(`${screen.x.toFixed(2)},${screen.y.toFixed(2)}`);
    previousY = point.y;
  });
  if (current.length > 1) segments.push(current.join(" "));
  return segments;
}

function nearestPoint(points: GraphSample[], x: number) {
  return points.reduce<GraphSample | null>((best, point) => {
    if (!point.valid || point.y === null) return best;
    if (!best) return point;
    return Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best;
  }, null);
}

function niceTicks(min: number, max: number, target: number) {
  const span = Math.max(0.0001, max - min);
  const rough = span / target;
  const power = Math.pow(10, Math.floor(Math.log10(rough)));
  const ratio = rough / power;
  const step = (ratio >= 5 ? 5 : ratio >= 2 ? 2 : 1) * power;
  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let value = first; value <= max + step / 2 && ticks.length < 80; value += step) {
    ticks.push(Number(value.toFixed(8)));
  }
  return ticks;
}

function formatTick(value: number) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(2);
  return Number(value.toFixed(3)).toString();
}
