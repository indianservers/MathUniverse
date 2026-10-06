import { useStudioState } from "../phase1/StudioModelProvider";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

export type Point = { x: number; y: number };
export type GraphSeries = { label: string; color: string; points: Point[]; dashed?: boolean };
export type GraphMarker = Point & { color?: string; label?: string };
export type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };

export function rk4Curve(field: (x: number, y: number) => number, initial: Point, bounds: Bounds, steps = 320): Point[] {
  const march = (direction: number) => {
    const result: Point[] = [];
    const h = direction * (bounds.xMax - bounds.xMin) / steps;
    let { x, y } = initial;
    for (let i = 0; i < steps && x >= bounds.xMin && x <= bounds.xMax && Number.isFinite(y) && Math.abs(y) < 1e6; i += 1) {
      result.push({ x, y });
      const k1 = field(x, y);
      const k2 = field(x + h / 2, y + h * k1 / 2);
      const k3 = field(x + h / 2, y + h * k2 / 2);
      const k4 = field(x + h, y + h * k3);
      y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      x += h;
    }
    return result;
  };
  return [...march(-1).reverse(), ...march(1).slice(1)];
}

export function sampleCurve(fn: (x: number) => number, xMin: number, xMax: number, count = 360): Point[] {
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = xMin + (index / count) * (xMax - xMin);
    let y = Number.NaN;
    try { y = fn(x); } catch { /* An undefined point becomes a break in the path. */ }
    return { x, y };
  });
}

function niceStep(range: number) {
  const rough = range / 8;
  const base = 10 ** Math.floor(Math.log10(Math.max(rough, 1e-8)));
  return [1, 2, 5, 10].map((n) => n * base).find((n) => n >= rough) ?? base;
}

export function Phase1Graph({
  bounds, series, field, density = 18, points = [], onPointChange, onInspect,
  showField = false, showAxes = true, showGrid = true, showLegend = true,
  horizontalLines = [], markers = [], segments = [], height = 420, label = "Interactive solution graph",
}: {
  bounds: Bounds;
  series: GraphSeries[];
  field?: (x: number, y: number) => number;
  density?: number;
  points?: Point[];
  onPointChange?: (index: number, point: Point) => void;
  onInspect?: (point: Point) => void;
  showField?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  horizontalLines?: Array<{ y: number; label: string; color: string }>;
  markers?: GraphMarker[];
  segments?: GraphSeries[];
  height?: number;
  label?: string;
}) {
  const [zoom, setZoom] = useStudioState("Phase1Graph:Phase1Graph:zoom", 1);
  const [offset, setOffset] = useStudioState<Point>("Phase1Graph:Phase1Graph:offset", { x: 0, y: 0 });
  const [drag, setDrag] = useState<{ kind: "point"; index: number } | { kind: "pan"; clientX: number; clientY: number; offset: Point } | null>(null);
  const [hover, setHover] = useState<Point | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 640;
  const pad = 38;
  const visible = useMemo(() => {
    const centerX = (bounds.xMin + bounds.xMax) / 2 + offset.x;
    const centerY = (bounds.yMin + bounds.yMax) / 2 + offset.y;
    const halfX = (bounds.xMax - bounds.xMin) / (2 * zoom);
    const halfY = (bounds.yMax - bounds.yMin) / (2 * zoom);
    return { xMin: centerX - halfX, xMax: centerX + halfX, yMin: centerY - halfY, yMax: centerY + halfY };
  }, [bounds.xMin, bounds.xMax, bounds.yMin, bounds.yMax, offset, zoom]);
  const px = (x: number) => pad + ((x - visible.xMin) / (visible.xMax - visible.xMin)) * (width - 2 * pad);
  const py = (y: number) => height - pad - ((y - visible.yMin) / (visible.yMax - visible.yMin)) * (height - 2 * pad);
  const fromEvent = (event: PointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    const sx = ((event.clientX - rect.left) / rect.width) * width;
    const sy = ((event.clientY - rect.top) / rect.height) * height;
    return {
      x: visible.xMin + ((sx - pad) / (width - 2 * pad)) * (visible.xMax - visible.xMin),
      y: visible.yMin + ((height - pad - sy) / (height - 2 * pad)) * (visible.yMax - visible.yMin),
    };
  };
  const path = (items: Point[]) => {
    let previous: Point | null = null;
    return items.map((point) => {
      if (!Number.isFinite(point.y) || point.y < visible.yMin - 1 || point.y > visible.yMax + 1) { previous = null; return ""; }
      const command = previous && Math.abs(point.y - previous.y) < (visible.yMax - visible.yMin) / 3 ? "L" : "M";
      previous = point;
      return `${command}${px(point.x).toFixed(1)},${py(point.y).toFixed(1)}`;
    }).join(" ");
  };
  const xStep = niceStep(visible.xMax - visible.xMin);
  const yStep = niceStep(visible.yMax - visible.yMin);
  const vertical = Array.from({ length: Math.min(40, Math.ceil((visible.xMax - visible.xMin) / xStep) + 2) }, (_, i) => (Math.floor(visible.xMin / xStep) + i) * xStep).filter((x) => x >= visible.xMin && x <= visible.xMax);
  const horizontal = Array.from({ length: Math.min(40, Math.ceil((visible.yMax - visible.yMin) / yStep) + 2) }, (_, i) => (Math.floor(visible.yMin / yStep) + i) * yStep).filter((y) => y >= visible.yMin && y <= visible.yMax);
  const slopeMarks = showField && field ? Array.from({ length: density + 1 }, (_, ix) => Array.from({ length: Math.max(8, Math.round(density * (height / width))) + 1 }, (_, iy) => {
    const rows = Math.max(8, Math.round(density * (height / width)));
    const x = visible.xMin + (ix + 0.5) * (visible.xMax - visible.xMin) / (density + 1);
    const y = visible.yMin + (iy + 0.5) * (visible.yMax - visible.yMin) / (rows + 1);
    const slope = field(x, y);
    if (!Number.isFinite(slope)) return null;
    const angle = Math.atan(slope * ((visible.xMax - visible.xMin) / (visible.yMax - visible.yMin)) * ((height - 2 * pad) / (width - 2 * pad)));
    const length = Math.min(16, (width - 2 * pad) / (density + 2) * 0.6);
    const dx = Math.cos(angle) * length / 2;
    const dy = Math.sin(angle) * length / 2;
    return <line key={`${ix}-${iy}`} x1={px(x) - dx} y1={py(y) + dy} x2={px(x) + dx} y2={py(y) - dy} stroke="#3d82f6" strokeWidth="1.5" strokeLinecap="round" opacity=".85" />;
  })) : null;
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
  return <div className="de1-graph-wrap">
    <div className="de1-graph-toolbar" aria-label="Graph view controls">
      <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.55, value / 1.25))}><Minus size={16} /></button>
      <output>{Math.round(zoom * 100)}%</output>
      <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(5, value * 1.25))}><Plus size={16} /></button>
      <button type="button" title="Reset view" aria-label="Reset view" onClick={reset}><RotateCcw size={15} /></button>
      <button type="button" title="Expand graph" aria-label="Expand graph" onClick={() => svgRef.current?.requestFullscreen?.()}><Maximize2 size={15} /></button>
    </div>
    <svg ref={svgRef} className={`de1-graph${drag ? " is-dragging" : ""}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={label}
      onPointerDown={(event) => { setDrag({ kind: "pan", clientX: event.clientX, clientY: event.clientY, offset }); event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={(event) => { const point = fromEvent(event); setHover(point); onInspect?.(point); if (drag?.kind === "point") onPointChange?.(drag.index, point); else if (drag?.kind === "pan") { const rect = event.currentTarget.getBoundingClientRect(); setOffset({ x: drag.offset.x - (event.clientX - drag.clientX) / rect.width * (visible.xMax - visible.xMin), y: drag.offset.y + (event.clientY - drag.clientY) / rect.height * (visible.yMax - visible.yMin) }); } }}
      onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)} onPointerLeave={() => setHover(null)}>
      <rect width={width} height={height} fill="#fff" />
      {showGrid ? <g stroke="#e7effb" strokeWidth="1">{vertical.map((x) => <line key={`x${x}`} x1={px(x)} x2={px(x)} y1={pad} y2={height - pad} />)}{horizontal.map((y) => <line key={`y${y}`} x1={pad} x2={width - pad} y1={py(y)} y2={py(y)} />)}</g> : null}
      {showAxes ? <g stroke="#243858" strokeWidth="1.5"><line x1={pad} x2={width - pad} y1={py(0)} y2={py(0)} /><line x1={px(0)} x2={px(0)} y1={pad} y2={height - pad} /></g> : null}
      <g fill="#516586" fontSize="11" textAnchor="middle">{vertical.map((x) => <text key={`xt${x}`} x={px(x)} y={height - 15}>{Number(x.toFixed(3))}</text>)}</g>
      <g fill="#516586" fontSize="11" textAnchor="end">{horizontal.map((y) => <text key={`yt${y}`} x={pad - 9} y={py(y) + 4}>{Number(y.toFixed(3))}</text>)}</g>
      {slopeMarks}
      {horizontalLines.map((line) => <g key={line.label}><line x1={pad} x2={width - pad} y1={py(line.y)} y2={py(line.y)} stroke={line.color} strokeWidth="2" strokeDasharray="6 5" /><text x={width - pad - 6} y={py(line.y) - 6} fill={line.color} fontSize="12" textAnchor="end">{line.label}</text></g>)}
      {series.map((item) => <path key={item.label} data-series={item.label} d={path(item.points)} fill="none" stroke={item.color} strokeWidth="2.7" strokeDasharray={item.dashed ? "7 5" : undefined} strokeLinecap="round" strokeLinejoin="round" />)}
      {segments.map((item) => <path key={item.label} d={path(item.points)} fill="none" stroke={item.color} strokeWidth="2" strokeDasharray={item.dashed ? "5 4" : undefined} />)}
      {markers.map((point, index) => <g key={`${point.label ?? "marker"}-${index}`}><circle cx={px(point.x)} cy={py(point.y)} r="5" fill={point.color ?? "#1769f5"} stroke="#fff" strokeWidth="2" />{point.label ? <text x={px(point.x) + 9} y={py(point.y) - 8} fill={point.color ?? "#1769f5"} fontSize="12">{point.label}</text> : null}</g>)}
      {points.map((point, index) => <g key={index} data-point="true" className="de1-draggable-point" onPointerDown={(event) => { event.stopPropagation(); setDrag({ kind: "point", index }); event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); }}><circle cx={px(point.x)} cy={py(point.y)} r="14" fill="transparent" /><circle cx={px(point.x)} cy={py(point.y)} r="6.5" fill={series[index]?.color ?? "#1769f5"} stroke="#fff" strokeWidth="2" /></g>)}
    </svg>
    {hover && !drag ? <div className="de1-graph-inspector">x {hover.x.toFixed(2)} · y {hover.y.toFixed(2)}{field && Number.isFinite(field(hover.x, hover.y)) ? ` · slope ${field(hover.x, hover.y).toFixed(2)}` : ""}</div> : null}
    {showLegend && series.length ? <div className="de1-legend">{series.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</div> : null}
  </div>;
}
