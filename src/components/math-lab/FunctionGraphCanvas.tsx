import type { GraphSample } from "../../utils/mathEngine/graphSampler";
import { useRef, type PointerEvent, type WheelEvent } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { zoomGraphView } from "../../graph-studio/graphViewUtils";

export type FunctionGraphSeries = {
  id: string;
  label: string;
  color: string;
  points: GraphSample[];
  visible: boolean;
  style?: "line" | "points" | "derivative" | "dashed" | "region" | "vectors";
  opacity?: number;
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
  onViewChange?: (view: FunctionGraphView) => void;
  onResetView?: () => void;
  integralArea?: {
    points: GraphSample[];
    color: string;
    start: number;
    end: number;
  };
  featurePoints?: Array<{
    x: number;
    y: number;
    type: "root" | "intercept" | "minimum" | "maximum" | "intersection";
  }>;
  residualSegments?: Array<{ x: number; observedY: number; predictedY: number }>;
  logX?: boolean;
  logY?: boolean;
  interactivePoints?: Array<{ id: string; x: number; y: number; label: string; color: string }>;
  onInteractivePointChange?: (id: string, x: number, y: number) => void;
  imageLayers?: Array<{ id: string; href: string; x: number; y: number; width: number; height: number; opacity: number; label: string }>;
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
  onViewChange,
  onResetView,
  integralArea,
  featurePoints = [],
  residualSegments = [],
  logX = false,
  logY = false,
  interactivePoints = [],
  onInteractivePointChange,
  imageLayers = [],
}: FunctionGraphCanvasProps) {
  const dragRef = useRef<{ clientX: number; clientY: number; view: FunctionGraphView } | null>(null);
  const axisValue = (value: number, logarithmic: boolean) => logarithmic ? Math.log10(value) : value;
  const xMin = axisValue(view.xMin, logX); const xMax = axisValue(view.xMax, logX);
  const yMin = axisValue(view.yMin, logY); const yMax = axisValue(view.yMax, logY);
  const toScreen = (x: number, y: number) => ({
    x: ((axisValue(x, logX) - xMin) / (xMax - xMin)) * WIDTH,
    y: HEIGHT - ((axisValue(y, logY) - yMin) / (yMax - yMin)) * HEIGHT,
  });
  const fromScreen = (clientX: number, clientY: number, element: SVGGraphicsElement) => {
    const rect = element.ownerSVGElement?.getBoundingClientRect() ?? element.getBoundingClientRect();
    const xRatio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const yRatio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const xValue = xMin + xRatio * (xMax - xMin);
    const yValue = yMax - yRatio * (yMax - yMin);
    return { x: logX ? 10 ** xValue : xValue, y: logY ? 10 ** yValue : yValue };
  };

  const traceSeries = series.find((item) => item.id === selectedSeriesId && item.visible) ?? series.find((item) => item.visible);
  const tracePoint = traceSeries && typeof traceX === "number" ? nearestPoint(traceSeries.points, traceX) : null;

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (dragRef.current && event.buttons === 1 && onViewChange) {
      const rect = event.currentTarget.getBoundingClientRect();
      const dx = (event.clientX - dragRef.current.clientX) / rect.width * (view.xMax - view.xMin);
      const dy = (event.clientY - dragRef.current.clientY) / rect.height * (view.yMax - view.yMin);
      onViewChange({ xMin: dragRef.current.view.xMin - dx, xMax: dragRef.current.view.xMax - dx, yMin: dragRef.current.view.yMin + dy, yMax: dragRef.current.view.yMax + dy });
      return;
    }
    if (!onTraceChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    onTraceChange(logX ? 10 ** (xMin + ratio * (xMax - xMin)) : view.xMin + ratio * (view.xMax - view.xMin));
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.focus();
    dragRef.current = { clientX: event.clientX, clientY: event.clientY, view };
    event.currentTarget.setPointerCapture(event.pointerId);
    handlePointerMove(event);
  }

  function handleWheel(event: WheelEvent<SVGSVGElement>) {
    if (!onViewChange) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const xRatio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const yRatio = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    const anchorX = view.xMin + xRatio * (view.xMax - view.xMin);
    const anchorY = view.yMax - yRatio * (view.yMax - view.yMin);
    const factor = event.deltaY > 0 ? 1.14 : 0.86;
    const width = (view.xMax - view.xMin) * factor;
    const height = (view.yMax - view.yMin) * factor;
    onViewChange({ xMin: anchorX - width * xRatio, xMax: anchorX + width * (1 - xRatio), yMin: anchorY - height * (1 - yRatio), yMax: anchorY + height * yRatio });
  }

  function handleKeyDown(event: ReactKeyboardEvent<SVGSVGElement>) {
    if ((event.key === "+" || event.key === "=" || event.key === "Add") && onViewChange) {
      event.preventDefault();
      onViewChange(zoomGraphView(view, 0.8));
      return;
    }
    if ((event.key === "-" || event.key === "Subtract") && onViewChange) {
      event.preventDefault();
      onViewChange(zoomGraphView(view, 1.25));
      return;
    }
    if (event.key === "0" && onResetView) {
      event.preventDefault();
      onResetView();
      return;
    }
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    const xSpan = view.xMax - view.xMin;
    const ySpan = view.yMax - view.yMin;
    if (event.shiftKey && onTraceChange && typeof traceX === "number" && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      onTraceChange(Math.min(view.xMax, Math.max(view.xMin, traceX + direction * xSpan / 100)));
      return;
    }
    if (!onViewChange) return;
    const xDelta = event.key === "ArrowLeft" ? -xSpan * 0.1 : event.key === "ArrowRight" ? xSpan * 0.1 : 0;
    const yDelta = event.key === "ArrowDown" ? -ySpan * 0.1 : event.key === "ArrowUp" ? ySpan * 0.1 : 0;
    onViewChange({ xMin: view.xMin + xDelta, xMax: view.xMax + xDelta, yMin: view.yMin + yDelta, yMax: view.yMax + yDelta });
  }

  return (
    <svg
      className="h-full min-h-[360px] w-full touch-none rounded-2xl border border-slate-200 bg-white shadow-inner dark:border-white/10 dark:bg-slate-950"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={tracePoint && typeof tracePoint.y === "number" ? `Interactive function graph. Trace point x ${formatTick(tracePoint.x)}, y ${formatTick(tracePoint.y)}` : "Interactive function graph"}
      aria-describedby="function-graph-keyboard-help"
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={() => { dragRef.current = null; }}
      onPointerCancel={() => { dragRef.current = null; }}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
    >
      <desc id="function-graph-keyboard-help">Use plus and minus to zoom, arrow keys to pan, zero to reset, and Shift plus left or right arrow to move the trace point.</desc>
      <rect width={WIDTH} height={HEIGHT} fill="currentColor" className="text-white dark:text-slate-950" />
      <text x="694" y="222" fill="#64748b" fontSize="13" fontWeight="800">x</text>
      <text x="364" y="22" fill="#64748b" fontSize="13" fontWeight="800">y</text>
      {showGrid && <Grid view={view} toScreen={toScreen} logX={logX} logY={logY} />}
      {showAxes && <Axes view={view} toScreen={toScreen} logX={logX} logY={logY} />}
      {imageLayers.map((image) => {
        const topLeft = toScreen(image.x, image.y); const bottomRight = toScreen(image.x + image.width, image.y - image.height);
        if (![topLeft.x, topLeft.y, bottomRight.x, bottomRight.y].every(Number.isFinite)) return null;
        return <image key={image.id} href={image.href} x={topLeft.x} y={topLeft.y} width={Math.abs(bottomRight.x - topLeft.x)} height={Math.abs(bottomRight.y - topLeft.y)} opacity={image.opacity} preserveAspectRatio="none"><title>{image.label}</title></image>;
      })}
      {integralArea && <IntegralArea area={integralArea} view={view} toScreen={toScreen} />}
      {series.filter((item) => item.visible).map((item) => (
        <g key={item.id} opacity={item.opacity ?? 1}>
          {item.style === "region" ? item.points.filter((point) => point.valid && point.y !== null).map((point, index) => {
            const screen = toScreen(point.x, point.y!);
            if (!Number.isFinite(screen.x) || !Number.isFinite(screen.y)) return null;
            return <circle key={`${item.id}-${index}`} cx={screen.x} cy={screen.y} r="5.5" fill={item.color} opacity="0.18" />;
          }) : item.style === "points" ? item.points.filter((point) => point.valid && point.y !== null).map((point, index) => {
            const screen = toScreen(point.x, point.y!);
            if (!Number.isFinite(screen.x) || !Number.isFinite(screen.y)) return null;
            return <circle key={`${item.id}-${index}`} cx={screen.x} cy={screen.y} r="7" fill={item.color} stroke="#ffffff" strokeWidth="2.5" />;
          }) : item.style === "vectors" ? vectorSegments(item.points, toScreen).map((segment, index) => (
            <g key={`${item.id}-vector-${index}`}><line x1={segment.start.x} y1={segment.start.y} x2={segment.end.x} y2={segment.end.y} stroke={item.color} strokeWidth="2" strokeLinecap="round" /><path d={arrowHead(segment.start, segment.end)} fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" /></g>
          )) : segmentsFor(item.points, view, toScreen).map((segment, index) => (
              <polyline
                key={`${item.id}-${index}`}
                points={segment}
                fill="none"
                stroke={item.color}
                strokeWidth={item.style === "derivative" || item.style === "dashed" ? "2.5" : "3"}
                strokeDasharray={item.style === "derivative" || item.style === "dashed" ? "8 6" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.92"
              />
            ))}
        </g>
      ))}
      {residualSegments.map((residual, index) => {
        const observed = toScreen(residual.x, residual.observedY);
        const predicted = toScreen(residual.x, residual.predictedY);
        return <line key={`residual-${index}`} x1={observed.x} x2={predicted.x} y1={observed.y} y2={predicted.y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" opacity="0.85" />;
      })}
      {interactivePoints.filter((point) => (!logX || point.x > 0) && (!logY || point.y > 0)).map((point) => {
        const screen = toScreen(point.x, point.y);
        return <g key={`interactive-${point.id}`} aria-label={`${point.label} at ${formatTick(point.x)}, ${formatTick(point.y)}`}>
          <circle className="gs2d-drag-handle" cx={screen.x} cy={screen.y} r="10" fill={point.color} stroke="#ffffff" strokeWidth="3" tabIndex={0}
            onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={(event) => { if (event.buttons !== 1 || !onInteractivePointChange) return; event.stopPropagation(); const next = fromScreen(event.clientX, event.clientY, event.currentTarget); onInteractivePointChange(point.id, next.x, next.y); }}
            onKeyDown={(event) => { if (!onInteractivePointChange || !event.key.startsWith("Arrow")) return; event.preventDefault(); const dx = (view.xMax - view.xMin) / 100; const dy = (view.yMax - view.yMin) / 100; onInteractivePointChange(point.id, point.x + (event.key === "ArrowLeft" ? -dx : event.key === "ArrowRight" ? dx : 0), point.y + (event.key === "ArrowDown" ? -dy : event.key === "ArrowUp" ? dy : 0)); }} />
          <title>{point.label}: drag to update the linked equation</title>
        </g>;
      })}
      {featurePoints.filter((point) => point.x >= view.xMin && point.x <= view.xMax && point.y >= view.yMin && point.y <= view.yMax).map((point, index) => {
        const screen = toScreen(point.x, point.y);
        return <g key={`${point.type}-${index}`} aria-label={`${point.type} at ${formatTick(point.x)}, ${formatTick(point.y)}`}><circle cx={screen.x} cy={screen.y} r="5.5" fill={point.type === "intersection" ? "#f97316" : "#06b6d4"} stroke="#ffffff" strokeWidth="2" /><title>{`${point.type}: (${formatTick(point.x)}, ${formatTick(point.y)})`}</title></g>;
      })}
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

function IntegralArea({ area, view, toScreen }: { area: NonNullable<FunctionGraphCanvasProps["integralArea"]>; view: FunctionGraphView; toScreen: (x: number, y: number) => { x: number; y: number } }) {
  const valid = area.points.filter((point) => point.valid && point.y !== null && point.x >= area.start && point.x <= area.end);
  if (valid.length < 2) return null;
  const baseline = Math.max(view.yMin, Math.min(view.yMax, 0));
  const first = toScreen(valid[0].x, baseline);
  const last = toScreen(valid.at(-1)!.x, baseline);
  const curve = valid.map((point) => {
    const screen = toScreen(point.x, point.y!);
    return `${screen.x.toFixed(2)},${screen.y.toFixed(2)}`;
  }).join(" ");
  return (
    <polygon
      points={`${first.x.toFixed(2)},${first.y.toFixed(2)} ${curve} ${last.x.toFixed(2)},${last.y.toFixed(2)}`}
      fill={area.color}
      opacity="0.18"
      stroke={area.color}
      strokeWidth="1.5"
      aria-label={`Integral area from ${area.start} to ${area.end}`}
    />
  );
}

function Grid({ view, toScreen, logX, logY }: { view: FunctionGraphView; toScreen: (x: number, y: number) => { x: number; y: number }; logX: boolean; logY: boolean }) {
  const xTicks = graphTicks(view.xMin, view.xMax, 12, logX);
  const yTicks = graphTicks(view.yMin, view.yMax, 8, logY);
  return (
    <g>
      {xTicks.map((tick) => {
        const x = toScreen(tick, 0).x;
        return <line key={`x-${tick}`} x1={x} x2={x} y1="0" y2={HEIGHT} stroke="#94a3b8" opacity="0.28" />;
      })}
      {yTicks.map((tick) => {
        const y = toScreen(0, tick).y;
        return <line key={`y-${tick}`} x1="0" x2={WIDTH} y1={y} y2={y} stroke="#94a3b8" opacity="0.28" />;
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

function Axes({ view, toScreen, logX, logY }: { view: FunctionGraphView; toScreen: (x: number, y: number) => { x: number; y: number }; logX: boolean; logY: boolean }) {
  const yAxisX = toScreen(0, 0).x;
  const xAxisY = toScreen(0, 0).y;
  return (
    <g>
      {!logY && view.yMin <= 0 && view.yMax >= 0 && <line x1="0" x2={WIDTH} y1={xAxisY} y2={xAxisY} stroke="#0f172a" strokeWidth="2" opacity="0.65" />}
      {!logX && view.xMin <= 0 && view.xMax >= 0 && <line x1={yAxisX} x2={yAxisX} y1="0" y2={HEIGHT} stroke="#0f172a" strokeWidth="2" opacity="0.65" />}
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
    if (!Number.isFinite(screen.x) || !Number.isFinite(screen.y)) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
      previousY = point.y;
      return;
    }
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

function graphTicks(min: number, max: number, target: number, logarithmic: boolean) {
  if (!logarithmic) return niceTicks(min, max, target);
  const start = Math.ceil(Math.log10(Math.max(Number.MIN_VALUE, min)));
  const end = Math.floor(Math.log10(max));
  const ticks: number[] = [];
  for (let power = start; power <= end && ticks.length < 30; power += 1) ticks.push(10 ** power);
  return ticks;
}

function vectorSegments(points: GraphSample[], toScreen: (x: number, y: number) => { x: number; y: number }) {
  const segments: Array<{ start: { x: number; y: number }; end: { x: number; y: number } }> = [];
  for (let index = 0; index + 1 < points.length; index += 3) {
    const start = points[index]; const end = points[index + 1];
    if (!start?.valid || !end?.valid || start.y === null || end.y === null) continue;
    const screenStart = toScreen(start.x, start.y); const screenEnd = toScreen(end.x, end.y);
    if ([screenStart.x, screenStart.y, screenEnd.x, screenEnd.y].every(Number.isFinite)) segments.push({ start: screenStart, end: screenEnd });
  }
  return segments;
}

function arrowHead(start: { x: number; y: number }, end: { x: number; y: number }) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x); const size = 4;
  const left = { x: end.x - size * Math.cos(angle - Math.PI / 6), y: end.y - size * Math.sin(angle - Math.PI / 6) };
  const right = { x: end.x - size * Math.cos(angle + Math.PI / 6), y: end.y - size * Math.sin(angle + Math.PI / 6) };
  return `M ${left.x} ${left.y} L ${end.x} ${end.y} L ${right.x} ${right.y}`;
}

function formatTick(value: number) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(2);
  return Number(value.toFixed(3)).toString();
}
