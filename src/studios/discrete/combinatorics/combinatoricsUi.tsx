import { useState, type ReactNode } from "react";

export const TOKEN_COLORS = ["#147df2", "#8b45f4", "#08b9dd", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#6366f1"];

export function tokenColor(label: string, index = 0) {
  const code = label.charCodeAt(0) || index;
  return TOKEN_COLORS[(code + index) % TOKEN_COLORS.length]!;
}

export function ComboWorkspace({
  controls,
  viz,
  insights,
  collapsed,
  onToggle,
  theme = "arr",
}: {
  controls: ReactNode;
  viz: ReactNode;
  insights: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
  theme?: "arr" | "sel" | "pig" | "ie" | "tree";
}) {
  return (
    <div className="combo-workspace">
      <section className={`combo-col combo-controls${collapsed ? " is-collapsed" : ""}`}>
        <button type="button" className="combo-mobile-toggle" onClick={onToggle}>{collapsed ? "Show controls" : "Hide controls"}</button>
        {controls}
      </section>
      <section className={`combo-col combo-viz theme-${theme}`}>{viz}</section>
      <aside className="combo-col combo-insights">{insights}</aside>
    </div>
  );
}

export function LiveRow({ color, label, value }: { color: string; label: string; value: string | number }) {
  return (
    <div className="combo-live">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function FormulaCard({ title, formula, note }: { title: string; formula: string; note?: string }) {
  return (
    <div className="combo-card">
      <h3>{title}</h3>
      <p className="combo-formula">{formula}</p>
      {note ? <p className="combo-note">{note}</p> : null}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="combo-slider">
      {label}
      <div>
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <output>{value}</output>
      </div>
    </label>
  );
}

export function Seg({
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
    <div className="combo-seg" role="group" aria-label={label}>
      {options.map((item) => (
        <button key={item.id} type="button" className={item.id === value ? "is-on" : ""} aria-pressed={item.id === value} onClick={() => onChange(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Token({
  label,
  color,
  selected,
  muted,
  onClick,
  draggable,
  onDragStart,
}: {
  label: string;
  color: string;
  selected?: boolean;
  muted?: boolean;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
}) {
  return (
    <button
      type="button"
      className={`combo-token${selected ? " is-on" : ""}${muted ? " is-muted" : ""}`}
      style={{ background: color }}
      draggable={draggable}
      onClick={onClick}
      onDragStart={onDragStart}
    >
      {label}
    </button>
  );
}

export function Slot({
  index,
  value,
  color,
  choices,
  onDrop,
}: {
  index: number;
  value: string | null;
  color?: string;
  choices?: number;
  onDrop: () => void;
}) {
  return (
    <div
      className={`combo-slot${value ? " is-filled" : ""}`}
      onClick={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <small>{`Slot ${index + 1}`}</small>
      {choices != null ? <em>{`${choices} choices`}</em> : null}
      <b style={value ? { background: color } : undefined}>{value ?? "—"}</b>
    </div>
  );
}

export function ChallengeCard({
  prompt,
  expected,
  hint,
  proof,
  onReset,
  onNew,
}: {
  prompt: string;
  expected: number;
  hint: string;
  proof?: string;
  onReset?: () => void;
  onNew?: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "pass" | "fail" | "hint">("idle");
  return (
    <div className="combo-card combo-challenge">
      <h3>Challenge</h3>
      <p>{prompt}</p>
      <input value={answer} onChange={(e) => { setAnswer(e.target.value); setStatus("idle"); }} aria-label="Challenge answer" />
      <div className="combo-btn-row">
        <button type="button" className="combo-primary" onClick={() => setStatus(Math.abs(Number(answer) - expected) < 0.02 ? "pass" : "fail")}>Check</button>
        <button type="button" className="combo-ghost" onClick={() => setStatus("hint")}>Hint</button>
        <button type="button" className="combo-ghost" onClick={() => { setAnswer(""); setStatus("idle"); onReset?.(); }}>Reset</button>
        {onNew ? <button type="button" className="combo-ghost" onClick={() => { setAnswer(""); setStatus("idle"); onNew(); }}>New Challenge</button> : null}
      </div>
      {status === "pass" ? <p className="combo-ok">Correct.</p> : null}
      {status === "fail" ? <p className="combo-fail">Not yet — try the visual proof.</p> : null}
      {status === "hint" ? <p className="combo-note">{hint}</p> : null}
      {status === "pass" && proof ? <p className="combo-work">{proof}</p> : null}
    </div>
  );
}

export function LearningStrip({
  items,
}: {
  items: Array<{ title: string; text: string; onClick: () => void; active?: boolean }>;
}) {
  return (
    <section className="combo-strip" aria-label="Learning loop">
      {items.map((item) => (
        <button key={item.title} type="button" className={item.active ? "is-on" : ""} onClick={item.onClick}>
          <b>{item.title}</b>
          <small>{item.text}</small>
        </button>
      ))}
    </section>
  );
}

export function ProductPath({ factors, total }: { factors: number[]; total: number }) {
  return (
    <p className="combo-product" aria-label="multiplication path">
      {factors.map((n, i) => (
        <span key={`${n}-${i}`}>
          {i > 0 ? <i>×</i> : null}
          <b>{n}</b>
        </span>
      ))}
      <i>=</i>
      <strong>{total}</strong>
    </p>
  );
}
