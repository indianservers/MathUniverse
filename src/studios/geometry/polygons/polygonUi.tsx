import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { fmt } from "../../mockup/studioLabKit";
import { clamp, type Vec } from "./polygonMath";

export const VIEW = { w: 640, h: 460, cx: 320, cy: 236 };

export function toScreen(p: Vec, scale = 42, origin = { x: VIEW.cx, y: VIEW.cy }): { x: number; y: number } {
  return { x: origin.x + p.x * scale, y: origin.y - p.y * scale };
}

export function fromScreen(x: number, y: number, scale = 42, origin = { x: VIEW.cx, y: VIEW.cy }): Vec {
  return { x: (x - origin.x) / scale, y: (origin.y - y) / scale };
}

export function pointsAttr(points: Array<{ x: number; y: number }>): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function clientToSvg(svg: SVGSVGElement, event: { clientX: number; clientY: number }) {
  const rect = svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * VIEW.w;
  const y = ((event.clientY - rect.top) / rect.height) * VIEW.h;
  return { x, y };
}

export function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="poly-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

export function MeasureRow({
  color,
  label,
  value,
  active,
  onHover,
}: {
  color: string;
  label: string;
  value: ReactNode;
  active?: boolean;
  onHover?: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`poly-measure${active ? " is-on" : ""}`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
    >
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  );
}

export function FormulaCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="poly-formula">
      <b>{title}</b>
      <p>{children}</p>
    </div>
  );
}

export function PropertyCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="poly-prop">
      <b>{title}</b>
      <p>{children}</p>
    </div>
  );
}

export function ChallengePanel({
  prompt,
  hint,
  check,
  onReset,
  onNew,
}: {
  prompt: string;
  hint: string;
  check: () => { ok: boolean; detail: string };
  onReset: () => void;
  onNew?: () => void;
}) {
  const [status, setStatus] = useState("");
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="poly-challenge">
      <span>Challenge</span>
      <p>{prompt}</p>
      <div className="poly-challenge-actions">
        <button type="button" className="msk-cta" onClick={() => {
          const result = check();
          setStatus(result.ok ? `Correct. ${result.detail}` : result.detail);
        }}>Check</button>
        <button type="button" className="poly-ghost" onClick={() => setShowHint(true)}>Hint</button>
        <button type="button" className="poly-ghost" onClick={() => { setStatus(""); setShowHint(false); onReset(); }}>Reset</button>
        {onNew ? <button type="button" className="poly-ghost" onClick={() => { setStatus(""); setShowHint(false); onNew(); }}>New Challenge</button> : null}
      </div>
      {showHint ? <p className="poly-hint">{hint}</p> : null}
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}

export function PresetGrid({
  items,
  value,
  onChange,
}: {
  value: string;
  items: Array<{ id: string; label: string }>;
  onChange: (id: string) => void;
}) {
  return (
    <div className="poly-presets">
      {items.map((item) => (
        <button key={item.id} type="button" className={item.id === value ? "active" : ""} onClick={() => onChange(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function AngleArc({
  center,
  from,
  to,
  radius = 22,
  color = "#8b45f4",
  label,
  sweepInterior = true,
}: {
  center: { x: number; y: number };
  from: { x: number; y: number };
  to: { x: number; y: number };
  radius?: number;
  color?: string;
  label?: string;
  sweepInterior?: boolean;
}) {
  const a0 = Math.atan2(from.y - center.y, from.x - center.x);
  const a1 = Math.atan2(to.y - center.y, to.x - center.x);
  let delta = a1 - a0;
  while (delta <= -Math.PI) delta += Math.PI * 2;
  while (delta > Math.PI) delta -= Math.PI * 2;
  if (sweepInterior && Math.abs(delta) < Math.PI) {
    /* keep smaller arc */
  }
  const large = Math.abs(delta) > Math.PI ? 1 : 0;
  const sweep = delta >= 0 ? 1 : 0;
  const x1 = center.x + Math.cos(a0) * radius;
  const y1 = center.y + Math.sin(a0) * radius;
  const x2 = center.x + Math.cos(a1) * radius;
  const y2 = center.y + Math.sin(a1) * radius;
  const lx = center.x + Math.cos(a0 + delta / 2) * (radius + 14);
  const ly = center.y + Math.sin(a0 + delta / 2) * (radius + 14);
  return (
    <g>
      <path d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${large} ${sweep} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="1.7" />
      {label ? <text x={lx} y={ly} fontSize="10" fill={color} textAnchor="middle">{label}</text> : null}
    </g>
  );
}

export function DraggableVertex({
  p,
  label,
  fill = "#08b9dd",
  onDrag,
}: {
  p: { x: number; y: number };
  label?: string;
  fill?: string;
  onDrag: (next: { x: number; y: number }) => void;
}) {
  return (
    <g className="poly-handle" style={{ cursor: "grab" }}>
      <circle cx={p.x} cy={p.y} r="14" fill="transparent" onPointerDown={(event) => {
        const svg = event.currentTarget.ownerSVGElement;
        if (!svg) return;
        event.preventDefault();
        (event.currentTarget as SVGCircleElement).setPointerCapture(event.pointerId);
      }} onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const svg = event.currentTarget.ownerSVGElement;
        if (!svg) return;
        onDrag(clientToSvg(svg, event));
      }} />
      <circle cx={p.x} cy={p.y} r="6" fill={fill} stroke="#fff" strokeWidth="1.5" />
      {label ? <text x={p.x + 8} y={p.y - 8} fontSize="11" fontWeight="800" fill="#0f172a">{label}</text> : null}
    </g>
  );
}

export function usePointerDrag(
  svgRef: { current: SVGSVGElement | null },
  onMove: (math: Vec, screen: { x: number; y: number }) => void,
  scale = 42,
) {
  const dragging = useRef(false);
  const handlers = useMemo(() => {
    const move = (event: PointerEvent<SVGSVGElement>) => {
      if (!dragging.current || !svgRef.current) return;
      const screen = clientToSvg(svgRef.current, event);
      onMove(fromScreen(xClamp(screen.x), yClamp(screen.y), scale), screen);
    };
    return {
      onPointerDown: (event: PointerEvent<SVGSVGElement>) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: move,
      onPointerUp: () => { dragging.current = false; },
    };
  }, [onMove, scale, svgRef]);
  return handlers;
}

function xClamp(n: number) {
  return clamp(n, 20, VIEW.w - 20);
}
function yClamp(n: number) {
  return clamp(n, 20, VIEW.h - 20);
}

export function Stage({ children, label, footer }: { children: ReactNode; label: string; footer?: ReactNode }) {
  return (
    <section className="msk-panel msk-canvas poly-stage">
      <svg className="msk-graph poly-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={label}>
        <rect width={VIEW.w} height={VIEW.h} fill="#fbfdff" />
        {children}
      </svg>
      {footer}
    </section>
  );
}

export function Controls({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="msk-panel poly-controls">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function LivePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="msk-panel poly-live">
      <h2>{title}</h2>
      {children}
    </aside>
  );
}

export function fmtDeg(n: number, digits = 1) {
  return `${fmt(n, digits)}°`;
}

export function useRaf(active: boolean, step: (dt: number) => void) {
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let last = performance.now();
    const tick = (now: number) => {
      step(now - last);
      last = now;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, step]);
}

export { fmt };
