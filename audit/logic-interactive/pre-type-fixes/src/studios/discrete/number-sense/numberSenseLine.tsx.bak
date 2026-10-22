import { useId, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { unitTicks, valueToX, xToValue } from "./numberSenseMath";

export type NumberLinePoint = {
  id: string;
  value: number;
  label: string;
  color: string;
  draggable?: boolean;
};

type Props = {
  min: number;
  max: number;
  points: NumberLinePoint[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onMove?: (id: string, value: number) => void;
  distance?: [string, string];
  tickStep?: number;
  extraTicks?: number[];
  logScale?: boolean;
  snap?: number;
  hops?: { from: number; size: number };
  ariaLabel: string;
};

const LEFT = 48;
const RIGHT = 752;
const Y = 180;
const WIDTH = 800;
const HEIGHT = 320;

export function NumberLine({
  min,
  max,
  points,
  selectedId,
  onSelect,
  onMove,
  distance,
  tickStep = 1,
  extraTicks = [],
  logScale = false,
  snap,
  hops,
  ariaLabel,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<string | null>(null);
  const hopMarkerId = `ns-hop-${useId().replace(/:/g, "")}`;
  const ticks = logScale ? extraTicks : [...new Set([...unitTicks(min, max, tickStep), ...extraTicks])].sort((a, b) => a - b);

  const xAt = (value: number) => valueToX(value, min, max, LEFT, RIGHT, logScale);

  const readValue = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return min;
    const box = svg.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * WIDTH;
    const raw = xToValue(Math.min(RIGHT, Math.max(LEFT, x)), min, max, LEFT, RIGHT, logScale);
    const step = snap ?? tickStep;
    if (logScale) return Math.min(max, Math.max(min, raw));
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>, id: string) => {
    event.preventDefault();
    onSelect?.(id);
    const point = points.find((item) => item.id === id);
    if (!point?.draggable || !onMove) return;
    drag.current = id;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !onMove) return;
    onMove(drag.current, readValue(event));
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!selectedId || !onMove) return;
    const point = points.find((item) => item.id === selectedId);
    if (!point?.draggable) return;
    const step = snap ?? tickStep;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      onMove(selectedId, Math.min(max, Math.max(min, point.value + dir * step)));
    }
    if (event.key === "0" && !logScale) {
      event.preventDefault();
      onMove(selectedId, 0);
    }
  };

  const a = distance ? points.find((item) => item.id === distance[0]) : undefined;
  const b = distance ? points.find((item) => item.id === distance[1]) : undefined;
  const hopCount = hops ? Math.abs(hops.size) : 0;
  const distCount = a && b ? Math.abs(a.value - b.value) : 0;
  const proofLine = hops
    ? `${hopCount} unit hops · ${hops.from} + (${hops.size}) = ${hops.from + hops.size}`
    : a && b
      ? `|${a.value} − ${b.value}| = ${distCount} unit hops`
      : "Each tick is 1 unit. Distance is the hop count.";

  return (
    <svg
      ref={svgRef}
      className="ns-line"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      tabIndex={0}
      aria-label={ariaLabel}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKey}
    >
      <defs>
        <marker id={hopMarkerId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#d97706" />
        </marker>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="#f8fbff" />
      <rect x="16" y="12" width="768" height="44" rx="12" fill="#fff7ed" stroke="#f59e0b" strokeWidth="3" />
      <text x="400" y="42" textAnchor="middle" fontSize="22" fontWeight={900} fill="#9a3412">{proofLine}</text>
      <line x1={LEFT} y1={Y} x2={RIGHT} y2={Y} stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <polygon points={`${RIGHT},${Y} ${RIGHT - 18},${Y - 12} ${RIGHT - 18},${Y + 12}`} fill="currentColor" />
      <polygon points={`${LEFT},${Y} ${LEFT + 18},${Y - 12} ${LEFT + 18},${Y + 12}`} fill="currentColor" />
      {ticks.map((tick) => {
        const x = xAt(tick);
        const major = Math.abs(tick) < 1e-9 || Number.isInteger(tick);
        const origin = Math.abs(tick) < 1e-9;
        return (
          <g key={`t-${tick}`}>
            <line
              x1={x}
              y1={Y - (major ? 22 : 12)}
              x2={x}
              y2={Y + (major ? 22 : 12)}
              stroke={origin ? "#0f172a" : "#334155"}
              strokeWidth={origin ? 6 : major ? 4 : 3}
            />
            {major ? (
              <text x={x} y={Y + 48} textAnchor="middle" fontSize="22" fontWeight={800} fill={origin ? "#0f172a" : "#1e293b"}>
                {tick === 0 ? "0" : String(tick)}
              </text>
            ) : null}
          </g>
        );
      })}
      {hops ? Array.from({ length: hopCount }, (_, i) => {
        const dir = Math.sign(hops.size) || 1;
        const from = hops.from + dir * i;
        const to = from + dir;
        const x1 = xAt(from);
        const x2 = xAt(to);
        const mid = (x1 + x2) / 2;
        const loft = hops.size < 0 ? Y + 78 : Y - 96;
        return (
          <g key={`h-${i}`}>
            <path
              d={`M ${x1} ${Y - 14} Q ${mid} ${loft} ${x2} ${Y - 14}`}
              fill="none"
              stroke="#d97706"
              strokeWidth="7"
              strokeLinecap="round"
              markerEnd={`url(#${hopMarkerId})`}
            />
            <text
              x={mid}
              y={loft + (hops.size < 0 ? 22 : -8)}
              textAnchor="middle"
              fontSize="20"
              fontWeight={900}
              fill="#9a3412"
              stroke="#fff7ed"
              strokeWidth="5"
              paintOrder="stroke"
            >{i + 1}</text>
          </g>
        );
      }) : null}
      {a && b ? (
        <g>
          <line x1={xAt(a.value)} y1={Y + 68} x2={xAt(b.value)} y2={Y + 68} stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" />
          <text x={(xAt(a.value) + xAt(b.value)) / 2} y={Y + 98} textAnchor="middle" fontSize="22" fontWeight={900} fill="#5b21b6">
            |{a.value} − {b.value}| = {distCount}
          </text>
        </g>
      ) : null}
      {points.map((point) => {
        const x = xAt(point.value);
        const on = point.id === selectedId;
        const r = on ? 22 : 18;
        return (
          <g key={point.id} onPointerDown={(event) => onPointerDown(event, point.id)} style={{ cursor: point.draggable ? "grab" : "pointer" }}>
            <circle cx={x} cy={Y} r={r + 4} fill="#fff" />
            <circle cx={x} cy={Y} r={r} fill={point.color} stroke="#071641" strokeWidth={on ? 4 : 3} />
            <rect x={x - 48} y={Y - 92} width="96" height="34" rx="8" fill="#ffffff" fillOpacity="0.96" />
            <text x={x} y={Y - 68} textAnchor="middle" fontSize="20" fontWeight="900" fill={point.color}>{point.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
