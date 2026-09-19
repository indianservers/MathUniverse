import { useRef, type PointerEvent, type ReactNode } from "react";

export const CX_Z = "#2aa7e0";
export const CX_W = "#8b5cf6";
export const CX_R = "#f59e0b";
export const CX_GRID = "#e8eef6";
export const CX_AXIS = "#94a3b8";

export function CxArrowDefs() {
  return (
    <defs>
      <marker id="cx-z" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={CX_Z} /></marker>
      <marker id="cx-w" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={CX_W} /></marker>
      <marker id="cx-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={CX_R} /></marker>
      <marker id="cx-g" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b" /></marker>
    </defs>
  );
}

type PlaneProps = {
  width?: number;
  height?: number;
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  pad?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  showTicks?: boolean;
  children: (map: { x: (re: number) => number; y: (im: number) => number; u: number; ox: number; oy: number }) => ReactNode;
  onPick?: (re: number, im: number) => void;
  label: string;
};

export function ComplexPlane({
  width = 640,
  height = 520,
  xmin = -4.2,
  xmax = 4.2,
  ymin = -3.4,
  ymax = 3.4,
  pad = 36,
  showGrid = true,
  showAxes = true,
  showTicks = true,
  children,
  onPick,
  label,
}: PlaneProps) {
  const dragging = useRef(false);
  const u = Math.min((width - pad * 2) / (xmax - xmin), (height - pad * 2) / (ymax - ymin));
  const ox = pad - xmin * u;
  const oy = pad + ymax * u;
  const x = (re: number) => ox + re * u;
  const y = (im: number) => oy - im * u;
  const pick = (event: PointerEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * width;
    const py = ((event.clientY - box.top) / box.height) * height;
    onPick((px - ox) / u, (oy - py) / u);
  };
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = Math.ceil(xmin); i <= Math.floor(xmax); i += 1) xs.push(i);
  for (let i = Math.ceil(ymin); i <= Math.floor(ymax); i += 1) ys.push(i);
  return (
    <svg
      className={`msk-graph cx-plane${onPick ? " is-interactive" : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        pick(event);
      }}
      onPointerMove={(event) => { if (dragging.current) pick(event); }}
      onPointerUp={() => { dragging.current = false; }}
    >
      <rect width={width} height={height} fill="#f7fbff" rx="18" />
      <CxArrowDefs />
      {showGrid ? xs.map((n) => <line key={`v${n}`} x1={x(n)} y1={y(ymax)} x2={x(n)} y2={y(ymin)} stroke={CX_GRID} />) : null}
      {showGrid ? ys.map((n) => <line key={`h${n}`} x1={x(xmin)} y1={y(n)} x2={x(xmax)} y2={y(n)} stroke={CX_GRID} />) : null}
      {showAxes ? (
        <>
          <line x1={x(xmin)} y1={y(0)} x2={x(xmax)} y2={y(0)} stroke={CX_AXIS} strokeWidth="1.5" />
          <line x1={x(0)} y1={y(ymin)} x2={x(0)} y2={y(ymax)} stroke={CX_AXIS} strokeWidth="1.5" />
          <text x={x(xmax) - 18} y={y(0) - 8} fontSize="12" fontWeight={800} fill="#64748b">Re</text>
          <text x={x(0) + 8} y={y(ymax) + 14} fontSize="12" fontWeight={800} fill="#64748b">Im</text>
        </>
      ) : null}
      {showTicks ? xs.filter((n) => n !== 0).map((n) => (
        <g key={`xt${n}`}>
          <line x1={x(n)} y1={y(0) - 4} x2={x(n)} y2={y(0) + 4} stroke="#64748b" />
          <text x={x(n)} y={y(0) + 16} textAnchor="middle" fontSize="11" fill="#94a3b8">{n}</text>
        </g>
      )) : null}
      {showTicks ? ys.filter((n) => n !== 0).map((n) => (
        <g key={`yt${n}`}>
          <line x1={x(0) - 4} y1={y(n)} x2={x(0) + 4} y2={y(n)} stroke="#64748b" />
          <text x={x(0) - 8} y={y(n) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{n}</text>
        </g>
      )) : null}
      {children({ x, y, u, ox, oy })}
    </svg>
  );
}

export function CxRay({
  x1, y1, x2, y2, color, dashed = false, width = 2.6, marker,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean; width?: number; marker?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "6 5" : undefined}
      markerEnd={marker ? `url(#${marker})` : undefined}
    />
  );
}

export function CxDot({ x, y, fill, label, sub }: { x: number; y: number; fill: string; label?: string; sub?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7" fill={fill} stroke="#fff" strokeWidth="2.5" />
      {label ? <text x="10" y="-10" fontSize="12" fontWeight={800} fill="#0f172a">{label}</text> : null}
      {sub ? <text x="10" y="6" fontSize="11" fill="#64748b">{sub}</text> : null}
    </g>
  );
}
