import { type KeyboardEvent, type ReactNode } from "react";
import { clamp, fmt } from "../mockup/studioLabKit";
import { useLinearSession } from "./linearAlgebraStudioSession";

export const LA_A = "#147df2";
export const LA_B = "#8b45f4";
export const LA_C = "#f59e0b";
export const LA_D = "#10b981";
export const LA_E = "#08b9dd";

export function canvasFill(dark: boolean, force3d = false) {
  return dark || force3d ? "#0b1220" : "#f8fbff";
}

export function ink(dark: boolean) {
  return dark ? "#e2e8f0" : "#334155";
}

export function ArrowDefs() {
  return (
    <defs>
      <marker id="la-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={LA_A} />
      </marker>
      <marker id="la-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={LA_B} />
      </marker>
      <marker id="la-c" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={LA_C} />
      </marker>
      <marker id="la-d" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={LA_D} />
      </marker>
      <marker id="la-e" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={LA_E} />
      </marker>
    </defs>
  );
}

export function VectorRay({
  x1, y1, x2, y2, color = LA_A, dashed = false, width = 3, marker = "la-a",
}: {
  x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean; width?: number; marker?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "6 4" : undefined}
      markerEnd={`url(#${marker})`}
    />
  );
}

export function DragHandle({
  x, y, fill, label, shape = "circle", selected = false,
}: {
  x: number; y: number; fill: string; label: string; shape?: "circle" | "square" | "diamond"; selected?: boolean;
}) {
  return (
    <g className="la-handle" transform={`translate(${x} ${y})`}>
      <circle r="14" fill="transparent" />
      {shape === "square" ? (
        <rect x="-7" y="-7" width="14" height="14" fill={fill} stroke="#fff" strokeWidth={selected ? 3 : 2} />
      ) : shape === "diamond" ? (
        <polygon points="0,-8 8,0 0,8 -8,0" fill={fill} stroke="#fff" strokeWidth={selected ? 3 : 2} />
      ) : (
        <circle r="8" fill={fill} stroke="#fff" strokeWidth={selected ? 3 : 2} />
      )}
      <text x="10" y="-10" fontSize="11" fontWeight={800} fill={fill}>{label}</text>
    </g>
  );
}

export function AxisGrid({
  ox, oy, unit, dark, transform,
}: {
  ox: number; oy: number; unit: number; dark: boolean; transform?: (x: number, y: number) => { x: number; y: number };
}) {
  const map = transform ?? ((x: number, y: number) => ({ x: ox + x * unit, y: oy - y * unit }));
  const lines: ReactNode[] = [];
  for (let i = -4; i <= 4; i += 1) {
    const a = map(i, -4);
    const b = map(i, 4);
    const c = map(-4, i);
    const d = map(4, i);
    lines.push(<line key={`v${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={dark ? "#1e3a5f" : "#e2e8f0"} />);
    lines.push(<line key={`h${i}`} x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke={dark ? "#1e3a5f" : "#e2e8f0"} />);
  }
  return <g>{lines}</g>;
}

export function FormulaBridge({ children }: { children: ReactNode }) {
  return <p className="la-formula-bridge">{children}</p>;
}

export function ShapeLegend({ items }: { items: Array<{ color: string; label: string; shape: "solid" | "dashed" | "square" | "diamond" }> }) {
  return (
    <ul className="la-legend">
      {items.map((item) => (
        <li key={item.label}>
          {item.shape === "square" ? <i className="is-square" style={{ background: item.color }} /> : null}
          {item.shape === "diamond" ? <i className="is-diamond" style={{ background: item.color }} /> : null}
          {item.shape === "dashed" ? <i className="is-dashed" style={{ background: item.color }} /> : null}
          {item.shape === "solid" ? <i style={{ background: item.color }} /> : null}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function LiveRegion({ text }: { text: string }) {
  return <p className="sr-only" role="status" aria-live="polite">{text}</p>;
}

export function NudgeSlider({
  label, value, min, max, step, onChange, unit,
}: {
  label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; unit?: string;
}) {
  return (
    <label className="msk-field msk-slider-row la-nudge">
      <span>{label}</span>
      <div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label={`${label} slider`} />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={`${label} value`}
          onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
        />
        <output>{fmt(value, step < 1 ? 2 : 0)}{unit ? ` ${unit}` : ""}</output>
      </div>
    </label>
  );
}

export function canvasKeyNudge(
  event: KeyboardEvent<SVGSVGElement>,
  onNudge: (dx: number, dy: number) => void,
) {
  const step = event.shiftKey ? 0.5 : 0.1;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") { event.preventDefault(); onNudge(step, 0); }
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") { event.preventDefault(); onNudge(-step, 0); }
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") { event.preventDefault(); onNudge(0, step); }
  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") { event.preventDefault(); onNudge(0, -step); }
}

export function useDarkCanvas(mode3d = false) {
  const session = useLinearSession();
  return session.darkCanvas || session.theme === "dark" || mode3d;
}
