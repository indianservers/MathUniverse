import { useState, type PointerEventHandler, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useStudioMode } from "../../hooks/useStudioMode";
import { MockupLearningStrip } from "./MockupStudioChrome";
import type { StudioMockupPage } from "./studioMockupCatalog";
import { trigModeChallenge } from "./trigStudioCopy";
import { awardTrigXp, markTrigComplete } from "./trigStudioSession";
import { markComplexComplete } from "../complex/complexStudioSession";

export function fmt(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "—";
  const factor = 10 ** digits;
  return String(Math.round(n * factor) / factor);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export type LabChildren = ReactNode | ((mode: string) => ReactNode);

export function LabShell({
  page,
  modes,
  children,
}: {
  page: StudioMockupPage;
  modes?: string[];
  children: LabChildren;
}) {
  const tabs = modes?.length ? modes : page.modes.length ? page.modes : ["Explore"];
  const [mode, setMode] = useStudioMode("mode", tabs, tabs[0]);
  return (
    <>
      <nav className="msk-tabs" aria-label={`${page.title} modes`}>
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-lab">{typeof children === "function" ? children(mode) : children}</div>
      <MockupLearningStrip page={page} mode={mode} />
    </>
  );
}

export function useLabMode(page: StudioMockupPage, extraModes?: string[], options?: { keepFallback?: boolean }) {
  const tabs = extraModes?.length ? extraModes : page.modes.length ? page.modes : ["Explore"];
  const [mode, setMode] = useStudioMode("mode", tabs, tabs[0], options);
  return { tabs, mode, setMode };
}

export function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`msk-panel ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="msk-field">
      <span>{label}{hint ? <small> {hint}</small> : null}</span>
      {children}
    </label>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  unit?: string;
}) {
  return (
    <label className="msk-field msk-slider-row">
      <span>{label}</span>
      <div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <output>{fmt(value, step < 1 ? 2 : 0)}{unit ? ` ${unit}` : ""}</output>
      </div>
    </label>
  );
}

export function Segmented({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <div className="msk-seg" role="group" aria-label={label}>
      {options.map((item) => (
        <button key={item.id} type="button" className={item.id === value ? "active" : ""} aria-pressed={item.id === value} onClick={() => onChange(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function ChipRow({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (id: string) => void;
}) {
  return (
    <div className="msk-chips">
      {options.map((item) => (
        <button key={item.id} type="button" className={item.id === value ? "active" : ""} onClick={() => onChange(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function LiveRow({ color, label, value }: { color?: string; label: string; value: ReactNode }) {
  return (
    <div className="msk-live-row">
      <i style={{ background: color ?? "#08b9dd" }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function StatusOk({ children }: { children: ReactNode }) {
  return <p className="msk-ok">{children}</p>;
}

export function StepList({ items }: { items: string[] }) {
  return (
    <ol className="msk-steps">
      {items.map((item, index) => (
        <li key={item}><b>{index + 1}</b><span>{item}</span></li>
      ))}
    </ol>
  );
}

export function parseChallengeAnswer(raw: string) {
  const text = raw.trim().replace(/−/g, "-").replace(/\s/g, "").toLowerCase();
  if (!text) return Number.NaN;
  if (text === "sqrt2/2" || text === "√2/2") return Math.SQRT1_2;
  if (text === "sqrt3/2" || text === "√3/2") return Math.sqrt(3) / 2;
  if (text.includes("/")) {
    const [num, den] = text.split("/");
    if (num && den && Number(den) !== 0) return Number(num) / Number(den);
  }
  return Number(text);
}

export function ChallengeBox({
  prompt,
  expected,
  hint,
  placeholder = "1 or √2/2",
  teach,
  onCorrect,
  page,
  mode,
}: {
  prompt?: string;
  expected?: number;
  hint?: string;
  placeholder?: string;
  teach?: { label: string; href: string };
  onCorrect?: () => void;
  page?: StudioMockupPage;
  mode?: string;
}) {
  const resolved = page ? trigModeChallenge(page, mode) : { prompt: prompt ?? "", expected: expected ?? 0, hint: hint ?? "" };
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState(false);
  const location = useLocation();
  if (!resolved.prompt || resolved.prompt === "0") return null;
  return (
    <div className="msk-challenge">
      <span>Challenge</span>
      <p>{resolved.prompt}</p>
      <input value={answer} placeholder={placeholder} onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" />
      <button className="msk-cta" type="button" onClick={() => {
        const correct = Math.abs(parseChallengeAnswer(answer) - resolved.expected) < 0.03;
        setOk(correct);
        setStatus(correct ? "Correct — that matches the live model." : resolved.hint);
        if (correct) {
          const route = page?.route ?? location.pathname;
          if (route.includes("/trigonometry/") && page) {
            awardTrigXp(10);
            markTrigComplete(page.id);
          } else if (route.includes("/complex-numbers/")) {
            const id = page?.id ?? location.pathname.split("/").filter(Boolean).at(-1) ?? "";
            if (id) markComplexComplete(id);
          } else if (route.includes("/discrete-world/")) {
            // Discrete World tracks completion on its own engine pages.
          }
          onCorrect?.();
        }
      }}>Check</button>
      {status ? <p role="status">{status}</p> : null}
      {!ok && teach ? <a className="msk-teach" href={teach.href}>{teach.label}</a> : null}
    </div>
  );
}

export function CanvasToolbar({ items }: { items: Array<{ id: string; label: string; active?: boolean; onClick?: () => void }> }) {
  return (
    <div className="msk-canvas-tools">
      {items.map((item) => (
        <button key={item.id} type="button" className={item.active ? "active" : ""} onClick={item.onClick}>{item.label}</button>
      ))}
    </div>
  );
}

export function GridSvg({
  width,
  height,
  origin,
  unit,
  xMax,
  yMax,
  dark,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ariaLabel,
}: {
  width?: number;
  height?: number;
  origin?: { x: number; y: number };
  unit?: number;
  xMax?: number;
  yMax?: number;
  dark?: boolean;
  children: ReactNode;
  onPointerDown?: PointerEventHandler<SVGSVGElement>;
  onPointerMove?: PointerEventHandler<SVGSVGElement>;
  onPointerUp?: PointerEventHandler<SVGSVGElement>;
  ariaLabel?: string;
}) {
  const w = width ?? 640;
  const h = height ?? 420;
  const ox = origin?.x ?? 48;
  const oy = origin?.y ?? h - 48;
  const u = unit ?? 28;
  const xmax = xMax ?? 14;
  const ymax = yMax ?? 10;
  return (
    <svg
      className={`msk-graph ${dark ? "is-dark" : ""}${onPointerDown || onPointerMove ? " is-interactive" : ""}`}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <rect width={w} height={h} fill={dark ? "#061428" : "#f8fbff"} />
      {Array.from({ length: xmax + 1 }, (_, i) => (
        <g key={`x${i}`}>
          <line x1={ox + i * u} y1={20} x2={ox + i * u} y2={oy} stroke={dark ? "#16324f" : "#e5edf7"} />
          {i % 2 === 0 ? <text x={ox + i * u} y={oy + 16} fill="#7b8aa3" fontSize="10" textAnchor="middle">{i}</text> : null}
        </g>
      ))}
      {Array.from({ length: ymax + 1 }, (_, i) => (
        <g key={`y${i}`}>
          <line x1={ox} y1={oy - i * u} x2={w - 16} y2={oy - i * u} stroke={dark ? "#16324f" : "#e5edf7"} />
          {i > 0 && i % 2 === 0 ? <text x={ox - 8} y={oy - i * u + 4} fill="#7b8aa3" fontSize="10" textAnchor="end">{i}</text> : null}
        </g>
      ))}
      <line x1={ox} y1={20} x2={ox} y2={oy} stroke={dark ? "#94a3b8" : "#182845"} strokeWidth="1.5" />
      <line x1={ox} y1={oy} x2={w - 16} y2={oy} stroke={dark ? "#94a3b8" : "#182845"} strokeWidth="1.5" />
      {children}
    </svg>
  );
}

export function toSvg(x: number, y: number, origin = { x: 48, y: 372 }, unit = 28) {
  return { x: origin.x + x * unit, y: origin.y - y * unit };
}

export function ExtraFrame({
  mode,
  extra,
  fallback,
}: {
  mode: string;
  extra?: ReactNode;
  fallback: ReactNode;
}) {
  return (
    <div className="msk-extra-frame" data-mode-canvas={mode}>
      {extra ?? fallback}
    </div>
  );
}
