import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from "react";
import type { Plane, Pt } from "./triangleGeometry";
import { toSvg } from "./triangleGeometry";

export function polyPoints(plane: Plane, pts: Pt[]) {
  return pts.map((p) => {
    const s = toSvg(plane, p);
    return `${s.x},${s.y}`;
  }).join(" ");
}

export function SideTickMark({ plane, a, b, count = 1, color = "#147df2" }: { plane: Plane; a: Pt; b: Pt; count?: number; color?: string }) {
  const A = toSvg(plane, a);
  const B = toSvg(plane, b);
  const mx = (A.x + B.x) / 2;
  const my = (A.y + B.y) / 2;
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * 7;
  const py = (dx / len) * 7;
  const ux = (dx / len) * 5;
  const uy = (dy / len) * 5;
  const start = -((count - 1) / 2);
  return (
    <g stroke={color} strokeWidth="1.6">
      {Array.from({ length: count }, (_, i) => {
        const ox = mx + (start + i) * ux;
        const oy = my + (start + i) * uy;
        return <line key={i} x1={ox - px} y1={oy - py} x2={ox + px} y2={oy + py} />;
      })}
    </g>
  );
}

export function AngleArc({
  plane, vertex, p, q, radius = 22, color = "#08b9dd", ticks = 1, label,
}: {
  plane: Plane; vertex: Pt; p: Pt; q: Pt; radius?: number; color?: string; ticks?: number; label?: string;
}) {
  const V = toSvg(plane, vertex);
  const P = toSvg(plane, p);
  const Q = toSvg(plane, q);
  const a1 = Math.atan2(P.y - V.y, P.x - V.x);
  const a2 = Math.atan2(Q.y - V.y, Q.x - V.x);
  let delta = a2 - a1;
  while (delta <= -Math.PI) delta += 2 * Math.PI;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  const large = Math.abs(delta) > Math.PI ? 1 : 0;
  const sweep = delta > 0 ? 1 : 0;
  const x1 = V.x + radius * Math.cos(a1);
  const y1 = V.y + radius * Math.sin(a1);
  const x2 = V.x + radius * Math.cos(a1 + delta);
  const y2 = V.y + radius * Math.sin(a1 + delta);
  const mid = a1 + delta / 2;
  const lx = V.x + (radius + 14) * Math.cos(mid);
  const ly = V.y + (radius + 14) * Math.sin(mid);
  return (
    <g fill="none" stroke={color} strokeWidth="1.7">
      <path d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${large} ${sweep} ${x2} ${y2}`} />
      {ticks > 1 ? <path d={`M ${V.x + (radius - 5) * Math.cos(mid)} ${V.y + (radius - 5) * Math.sin(mid)} L ${V.x + (radius + 5) * Math.cos(mid)} ${V.y + (radius + 5) * Math.sin(mid)}`} /> : null}
      {ticks > 2 ? <path d={`M ${V.x + (radius - 5) * Math.cos(mid - 0.12)} ${V.y + (radius - 5) * Math.sin(mid - 0.12)} L ${V.x + (radius + 5) * Math.cos(mid - 0.12)} ${V.y + (radius + 5) * Math.sin(mid - 0.12)}`} /> : null}
      {label ? <text x={lx} y={ly} fill={color} fontSize="11" fontWeight="700" textAnchor="middle">{label}</text> : null}
    </g>
  );
}

export function RightAngleMarker({ plane, vertex, p, q, size = 12, color = "#475569" }: { plane: Plane; vertex: Pt; p: Pt; q: Pt; size?: number; color?: string }) {
  const V = toSvg(plane, vertex);
  const P = toSvg(plane, p);
  const Q = toSvg(plane, q);
  const u = { x: P.x - V.x, y: P.y - V.y };
  const v = { x: Q.x - V.x, y: Q.y - V.y };
  const nu = Math.hypot(u.x, u.y) || 1;
  const nv = Math.hypot(v.x, v.y) || 1;
  const ux = (u.x / nu) * size;
  const uy = (u.y / nu) * size;
  const vx = (v.x / nv) * size;
  const vy = (v.y / nv) * size;
  return <polyline fill="none" stroke={color} strokeWidth="1.5" points={`${V.x + ux},${V.y + uy} ${V.x + ux + vx},${V.y + uy + vy} ${V.x + vx},${V.y + vy}`} />;
}

export function DraggableVertex({
  plane, p, label, color = "#147df2", active,
}: { plane: Plane; p: Pt; label: string; color?: string; active?: boolean }) {
  const s = toSvg(plane, p);
  return (
    <g className="tri-vertex" style={{ cursor: active ? "grabbing" : "grab" }}>
      <circle cx={s.x} cy={s.y} r="22" fill="transparent" />
      <circle cx={s.x} cy={s.y} r={active ? 8 : 7} fill="#fff" stroke={color} strokeWidth="2.4" />
      <text x={s.x + 10} y={s.y - 10} fill={color} fontSize="13" fontWeight="800">{label}</text>
    </g>
  );
}

export function SideMeasurement({ plane, a, b, text, color = "#334155" }: { plane: Plane; a: Pt; b: Pt; text: string; color?: string }) {
  const A = toSvg(plane, a);
  const B = toSvg(plane, b);
  const mx = (A.x + B.x) / 2;
  const my = (A.y + B.y) / 2;
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const ox = (-dy / len) * 14;
  const oy = (dx / len) * 14;
  return <text x={mx + ox} y={my + oy} fill={color} fontSize="11" fontWeight="700" textAnchor="middle">{text}</text>;
}

export function DashedLine({ plane, a, b, color = "#94a3b8" }: { plane: Plane; a: Pt; b: Pt; color?: string }) {
  const A = toSvg(plane, a);
  const B = toSvg(plane, b);
  return <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={color} strokeWidth="1.4" strokeDasharray="6 4" />;
}

export function SolidLine({ plane, a, b, color, width = 1.6 }: { plane: Plane; a: Pt; b: Pt; color: string; width?: number }) {
  const A = toSvg(plane, a);
  const B = toSvg(plane, b);
  return <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={color} strokeWidth={width} />;
}

export function CenterDot({ plane, p, label, color }: { plane: Plane; p: Pt; label: string; color: string }) {
  const s = toSvg(plane, p);
  return (
    <g>
      <circle cx={s.x} cy={s.y} r="5" fill={color} />
      <text x={s.x + 8} y={s.y - 8} fill={color} fontSize="12" fontWeight="800">{label}</text>
    </g>
  );
}

export function GridLayer({ plane }: { plane: Plane }) {
  const lines: ReactNode[] = [];
  for (let x = 0; x <= 18; x += 1) {
    const p1 = toSvg(plane, { x, y: 0 });
    const p2 = toSvg(plane, { x, y: 12 });
    lines.push(<line key={`x${x}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={x % 2 === 0 ? "#e2eaf4" : "#eef3f9"} />);
  }
  for (let y = 0; y <= 12; y += 1) {
    const p1 = toSvg(plane, { x: 0, y });
    const p2 = toSvg(plane, { x: 18, y });
    lines.push(<line key={`y${y}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={y % 2 === 0 ? "#e2eaf4" : "#eef3f9"} />);
  }
  return <g>{lines}</g>;
}

export function pointerToSvg(svg: SVGSVGElement, event: ReactPointerEvent | PointerEvent) {
  const rect = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  return {
    x: ((event.clientX - rect.left) / rect.width) * vb.width,
    y: ((event.clientY - rect.top) / rect.height) * vb.height,
  };
}

export function bindSvgDrag(
  svgRef: RefObject<SVGSVGElement | null>,
  onMove: (event: PointerEvent) => void,
  onEnd?: () => void,
) {
  const move = (event: PointerEvent) => onMove(event);
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    onEnd?.();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
