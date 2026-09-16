import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import { dist, fmt, midpoint, type Vec } from "./circleMath";

export const CIRCLE_VB = { w: 560, h: 500, cx: 280, cy: 252, scale: 34 };

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

export function useSvgDrag(onMove: (id: string, math: Vec, fine: boolean) => void, onSelect?: (id: string) => void) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<string | null>(null);

  const onPointerDown = useCallback((event: PointerEvent<SVGSVGElement>) => {
    const hit = (event.target as Element).closest("[data-drag]");
    if (!hit) return;
    const id = hit.getAttribute("data-drag");
    dragging.current = id;
    if (id) onSelect?.(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [onSelect]);

  const onPointerMove = useCallback((event: PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    onMove(dragging.current, svgToMath(clientToSvg(svgRef.current, event)), event.shiftKey);
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
  unitLabel = "u",
  focused,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyMove,
}: {
  children: ReactNode;
  ariaLabel: string;
  svgRef?: RefObject<SVGSVGElement | null>;
  unitLabel?: string;
  focused?: string | null;
  onPointerDown?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (event: PointerEvent<SVGSVGElement>) => void;
  onKeyMove?: (id: string, dx: number, dy: number) => void;
}) {
  const { w, h, cx, cy, scale } = CIRCLE_VB;
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!focused || !onKeyMove) return;
    const step = event.shiftKey ? 0.08 : 0.22;
    if (event.key === "ArrowLeft") { event.preventDefault(); onKeyMove(focused, -step, 0); }
    if (event.key === "ArrowRight") { event.preventDefault(); onKeyMove(focused, step, 0); }
    if (event.key === "ArrowUp") { event.preventDefault(); onKeyMove(focused, 0, step); }
    if (event.key === "ArrowDown") { event.preventDefault(); onKeyMove(focused, 0, -step); }
  };
  return (
    <svg
      ref={svgRef}
      className="clab-svg is-interactive"
      viewBox={`0 0 ${w} ${h}`}
      role="application"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <rect width={w} height={h} fill="#f7fbff" />
      <g stroke="#e4eef7" strokeWidth="1">
        {[-6, -4, -2, 2, 4, 6].map((n) => (
          <g key={n}>
            <line x1={cx + n * scale} y1={24} x2={cx + n * scale} y2={h - 28} />
            <line x1={36} y1={cy - n * scale} x2={w - 28} y2={cy - n * scale} />
            <text x={cx + n * scale} y={h - 10} fontSize="9" fill="#8aa0b8" textAnchor="middle">{n}{unitLabel === "cm" ? "cm" : ""}</text>
          </g>
        ))}
      </g>
      {children}
    </svg>
  );
}

export function CircleOutline({ origin, radius, dashed, color = "#08b9dd" }: { origin: Vec; radius: number; dashed?: boolean; color?: string }) {
  const p = mathToSvg(origin);
  return <circle cx={p.x} cy={p.y} r={radius * CIRCLE_VB.scale} fill="rgba(8,185,221,.07)" stroke={color} strokeWidth="2.2" strokeDasharray={dashed ? "6 4" : undefined} />;
}

export function ChordLine({ a, b, color = "#147df2", dashed, width = 2.3 }: { a: Vec; b: Vec; color?: string; dashed?: boolean; width?: number }) {
  const A = mathToSvg(a);
  const B = mathToSvg(b);
  return <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "6 4" : undefined} />;
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

export function FilledTriangle({ a, b, c, color }: { a: Vec; b: Vec; c: Vec; color: string }) {
  const A = mathToSvg(a); const B = mathToSvg(b); const C = mathToSvg(c);
  return <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={color} stroke="none" />;
}

export function ArcPath({
  origin, radius, startRad, endRad, color = "#8b45f4", fill, width = 3, dashed,
}: {
  origin: Vec; radius: number; startRad: number; endRad: number; color?: string; fill?: string; width?: number; dashed?: boolean;
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
  return <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "6 4" : undefined} />;
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

export function LengthBadge({ a, b, text, color = "#0f2747" }: { a: Vec; b: Vec; text: string; color?: string }) {
  const m = mathToSvg(midpoint(a, b));
  const w = Math.max(36, text.length * 7);
  return (
    <g>
      <rect x={m.x - w / 2} y={m.y - 18} width={w} height="16" rx="7" fill="#ffffffee" stroke="#dce7f4" />
      <text x={m.x} y={m.y - 6} fontSize="10" fontWeight="800" fill={color} textAnchor="middle">{text}</text>
    </g>
  );
}

export function GhostChord({ a, b }: { a: Vec; b: Vec; label?: string }) {
  return (
    <g>
      <ChordLine a={a} b={b} color="#94a3b8" dashed />
    </g>
  );
}

export function StepDot({ origin, n, label }: { origin: Vec; n: number; label: string }) {
  const p = mathToSvg(origin);
  return (
    <g>
      <circle cx={p.x - 18} cy={p.y + n * 16 - 36} r="8" fill="#147df2" />
      <text x={p.x - 18} y={p.y + n * 16 - 32} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="800">{n}</text>
      <text x={p.x - 6} y={p.y + n * 16 - 32} fontSize="10" fill="#334155">{label}</text>
    </g>
  );
}

export function DraggablePoint({ point, label, color = "#147df2", dragId, title }: { point: Vec; label?: string; color?: string; dragId: string; title?: string }) {
  const p = mathToSvg(point);
  return (
    <g className="clab-point" data-drag={dragId} style={{ cursor: "grab" }} tabIndex={0} role="slider" aria-label={title ?? label ?? dragId}>
      <title>{title ?? `Drag ${label ?? dragId}. Arrow keys nudge; Shift for fine steps.`}</title>
      <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
      <circle cx={p.x} cy={p.y} r="7" fill={color} stroke="#fff" strokeWidth="2" />
      {label ? <text x={p.x + 10} y={p.y - 10} fontSize="13" fontWeight="800" fill="#0f2747">{label}</text> : null}
    </g>
  );
}

export function FormulaCard({ title, children, hidden }: { title: string; children: ReactNode; hidden?: boolean }) {
  if (hidden) return (
    <article className="clab-card clab-teacher-hide">
      <h3>{title}</h3>
      <p className="clab-note">Hidden in teacher mode.</p>
    </article>
  );
  return (
    <article className="clab-card">
      <h3>{title}</h3>
      <div className="clab-formula">{children}</div>
    </article>
  );
}

export function MathLine({ tex }: { tex: string }) {
  return <div className="clab-math"><MathExpression value={tex} /></div>;
}

export function WorkedCard({ lines, hidden }: { lines: string[]; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <article className="clab-card">
      <h3>Worked values</h3>
      {lines.map((line) => <p key={line} className="clab-work">{line}</p>)}
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
  prompt, status, onCheck, onReset, onNew,
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

export function LiveRow({ color, label, value, hidden }: { color: string; label: string; value: string; hidden?: boolean }) {
  return (
    <div className="clab-live">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{hidden ? "—" : value}</strong>
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

export function badgeText(a: Vec, b: Vec, digits = 2) {
  return fmt(dist(a, b), digits);
}

export { fmt };
