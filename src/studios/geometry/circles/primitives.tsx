import { useCallback, useRef, type PointerEvent, type ReactNode, type RefObject } from "react";
import { type Vec, fmt } from "./circleMath";

export const CIRCLE_VB = { w: 560, h: 480, cx: 280, cy: 246, scale: 28 };

export function mathToSvg(p: Vec, frame = CIRCLE_VB) {
  return { x: frame.cx + p.x * frame.scale, y: frame.cy - p.y * frame.scale };
}

export function svgToMath(p: Vec, frame = CIRCLE_VB): Vec {
  return { x: (p.x - frame.cx) / frame.scale, y: (frame.cy - p.y) / frame.scale };
}

export function clientToSvg(svg: SVGSVGElement, event: PointerEvent, frame = CIRCLE_VB): Vec {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * frame.w,
    y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * frame.h,
  };
}

export function useSvgDrag(onMove: (id: string, math: Vec) => void) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<string | null>(null);

  const onPointerDown = useCallback((event: PointerEvent<SVGSVGElement>) => {
    const hit = (event.target as Element).closest("[data-drag]");
    if (!hit) return;
    dragging.current = hit.getAttribute("data-drag");
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    onMove(dragging.current, svgToMath(clientToSvg(svgRef.current, event)));
  }, [onMove]);

  const onPointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  return { svgRef, onPointerDown, onPointerMove, onPointerUp };
}

export function CircleSvg({
  children,
  ariaLabel,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  children: ReactNode;
  ariaLabel: string;
  svgRef?: RefObject<SVGSVGElement | null>;
  onPointerDown?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (event: PointerEvent<SVGSVGElement>) => void;
}) {
  const { w, h, cx, cy, scale } = CIRCLE_VB;
  return (
    <svg
      ref={svgRef}
      className="clab-svg"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <rect width={w} height={h} fill="#f7fbff" />
      <g stroke="#e4eef7" strokeWidth="1">
        {[-6, -4, -2, 2, 4, 6].map((n) => (
          <g key={n}>
            <line x1={cx + n * scale} y1={24} x2={cx + n * scale} y2={h - 28} />
            <line x1={36} y1={cy - n * scale} x2={w - 28} y2={cy - n * scale} />
          </g>
        ))}
      </g>
      {children}
    </svg>
  );
}

export function CircleOutline({ origin, radius }: { origin: Vec; radius: number }) {
  const p = mathToSvg(origin);
  return <circle cx={p.x} cy={p.y} r={radius * CIRCLE_VB.scale} fill="rgba(8,185,221,.07)" stroke="#08b9dd" strokeWidth="2.2" />;
}

export function ChordLine({ a, b, color = "#147df2", dashed }: { a: Vec; b: Vec; color?: string; dashed?: boolean }) {
  const A = mathToSvg(a);
  const B = mathToSvg(b);
  return <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={color} strokeWidth="2.3" strokeDasharray={dashed ? "6 4" : undefined} />;
}

export function RadiusLine({ origin, point, color = "#147df2" }: { origin: Vec; point: Vec; color?: string }) {
  const O = mathToSvg(origin);
  const P = mathToSvg(point);
  return <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke={color} strokeWidth="1.8" />;
}

export function TangentLine({ point, direction, length = 4.6, color = "#f59e0b" }: { point: Vec; direction: Vec; length?: number }) {
  const dirLen = Math.hypot(direction.x, direction.y) || 1;
  const ux = (direction.x / dirLen) * length;
  const uy = (direction.y / dirLen) * length;
  const a = mathToSvg({ x: point.x - ux, y: point.y - uy });
  const b = mathToSvg({ x: point.x + ux, y: point.y + uy });
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="2.2" />;
}

export function ArcPath({
  origin,
  radius,
  startRad,
  endRad,
  color = "#8b45f4",
  fill,
  width = 3,
}: {
  origin: Vec;
  radius: number;
  startRad: number;
  endRad: number;
  color?: string;
  fill?: string;
  width?: number;
}) {
  const sweep = ((endRad - startRad) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  const large = sweep > Math.PI ? 1 : 0;
  const start = mathToSvg({ x: origin.x + radius * Math.cos(startRad), y: origin.y + radius * Math.sin(startRad) });
  const end = mathToSvg({ x: origin.x + radius * Math.cos(endRad), y: origin.y + radius * Math.sin(endRad) });
  const r = radius * CIRCLE_VB.scale;
  const o = mathToSvg(origin);
  if (fill) {
    return <path d={`M ${o.x} ${o.y} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`} fill={fill} stroke="none" />;
  }
  return <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth={width} />;
}

export function AngleMarker({ vertex, from, to, radius = 0.72, color = "#8b45f4" }: { vertex: Vec; from: Vec; to: Vec; radius?: number; color?: string }) {
  const a0 = Math.atan2(from.y - vertex.y, from.x - vertex.x);
  const a1 = Math.atan2(to.y - vertex.y, to.x - vertex.x);
  return <ArcPath origin={vertex} radius={radius} startRad={a0} endRad={a1} color={color} />;
}

export function RightAngleMarker({ origin, point, tangentDir }: { origin: Vec; point: Vec; tangentDir: Vec }) {
  const n = { x: point.x - origin.x, y: point.y - origin.y };
  const nLen = Math.hypot(n.x, n.y) || 1;
  const tLen = Math.hypot(tangentDir.x, tangentDir.y) || 1;
  const s = 0.42;
  const nx = (n.x / nLen) * s;
  const ny = (n.y / nLen) * s;
  const tx = (tangentDir.x / tLen) * s;
  const ty = (tangentDir.y / tLen) * s;
  const p1 = mathToSvg({ x: point.x - nx, y: point.y - ny });
  const p2 = mathToSvg({ x: point.x - nx + tx, y: point.y - ny + ty });
  const p3 = mathToSvg({ x: point.x + tx, y: point.y + ty });
  return <polyline points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="none" stroke="#10b981" strokeWidth="2" />;
}

export function DraggablePoint({ point, label, color = "#147df2", dragId }: { point: Vec; label?: string; color?: string; dragId: string }) {
  const p = mathToSvg(point);
  return (
    <g className="clab-point" data-drag={dragId} style={{ cursor: "grab" }}>
      <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
      <circle cx={p.x} cy={p.y} r="7" fill={color} stroke="#fff" strokeWidth="2" />
      {label ? <text x={p.x + 10} y={p.y - 10} fontSize="13" fontWeight="800" fill="#0f2747">{label}</text> : null}
    </g>
  );
}

export function FormulaCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="clab-card">
      <h3>{title}</h3>
      <div className="clab-formula">{children}</div>
    </article>
  );
}

export function PropertyCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="clab-card">
      <h3>{title}</h3>
      <ol className="clab-props">{items.map((item) => <li key={item}>{item}</li>)}</ol>
    </article>
  );
}

export function PresetButton({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
  return (
    <button type="button" className={active ? "clab-preset is-on" : "clab-preset"} onClick={onClick}>{label}</button>
  );
}

export function ChallengeCard({
  prompt,
  status,
  onCheck,
  onReset,
  onNew,
}: {
  prompt: string;
  status: "idle" | "pass" | "fail";
  onCheck: () => void;
  onReset: () => void;
  onNew: () => void;
}) {
  return (
    <article className="clab-card clab-challenge">
      <h3>Try this</h3>
      <p>{prompt}</p>
      <div className="clab-btn-row">
        <button type="button" className="clab-primary" onClick={onCheck}>Check</button>
        <button type="button" className="clab-ghost" onClick={onReset}>Reset</button>
        <button type="button" className="clab-ghost" onClick={onNew}>New challenge</button>
      </div>
      {status === "pass" ? <p className="clab-ok" role="status">Correct — the figure satisfies the challenge.</p> : null}
      {status === "fail" ? <p className="clab-fail" role="status">Not yet. Keep adjusting the construction.</p> : null}
    </article>
  );
}

export function LiveRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="clab-live">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="clab-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} />
      {label}
    </label>
  );
}

export function Slider({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (n: number) => void;
}) {
  return (
    <label className="clab-slider">
      <span>{label}</span>
      <div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <output>{fmt(value, step < 1 ? 2 : 0)}{unit ? ` ${unit}` : ""}</output>
      </div>
    </label>
  );
}

export { fmt };
