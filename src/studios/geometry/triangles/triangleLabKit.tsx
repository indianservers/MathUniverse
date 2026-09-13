import { useState, type ReactNode } from "react";
import { Panel, Segmented, StatusOk, StepList, fmt } from "../../mockup/studioLabKit";

export { fmt };

export function MeasureRow({ label, value, color = "#147df2" }: { label: string; value: ReactNode; color?: string }) {
  return (
    <div className="tri-metric">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function FormulaCard({ title, formula, why, tryThis }: { title: string; formula: string; why: string; tryThis: string }) {
  return (
    <div className="tri-formula">
      <b>Key relationship</b>
      <p className="tri-formula-eq">{formula}</p>
      <small><b>Why it works. </b>{why}</small>
      <small><b>Try this. </b>{tryThis}</small>
      <span className="tri-formula-kicker">{title}</span>
    </div>
  );
}

export function ChallengeCard({
  prompt, check, hint, onReset,
}: {
  prompt: string;
  check: () => boolean;
  hint: string;
  onReset: () => void;
}) {
  const [status, setStatus] = useState("");
  const [seed, setSeed] = useState(0);
  return (
    <div className="tri-challenge" data-seed={seed}>
      <span>Challenge</span>
      <p>{prompt}</p>
      <div className="tri-btn-row">
        <button type="button" className="msk-cta" onClick={() => setStatus(check() ? "Correct — the live figure matches the goal." : hint)}>Check</button>
        <button type="button" className="msk-soft" onClick={() => { onReset(); setStatus(""); }}>Reset</button>
        <button type="button" className="msk-soft" onClick={() => { onReset(); setSeed((n) => n + 1); setStatus("New challenge loaded. Same goal — rebuild it from scratch."); }}>New Challenge</button>
      </div>
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}

export function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="msk-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

export function Fold({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="tri-fold" open={open}>
      <summary>{title}</summary>
      {children}
    </details>
  );
}

export function LabFrame({
  controls, canvas, insights, ariaLabel,
}: {
  controls: ReactNode;
  canvas: ReactNode;
  insights: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="tri-lab" aria-label={ariaLabel}>
      <Fold title="Controls">{controls}</Fold>
      <section className="msk-panel tri-canvas">{canvas}</section>
      <aside className="tri-insights">
        <Fold title="Measurements">{insights}</Fold>
      </aside>
    </div>
  );
}

export function InsightStack({
  measurements, property, steps, formula, challenge,
}: {
  measurements: ReactNode;
  property: ReactNode;
  steps?: string[];
  formula: ReactNode;
  challenge: ReactNode;
}) {
  return (
    <>
      <Panel title="Live measurements">{measurements}</Panel>
      <Panel title="Key property">{property}{steps ? <StepList items={steps} /> : null}</Panel>
      {formula}
      {challenge}
    </>
  );
}

export function PresetGrid({ value, options, onChange }: { value: string; options: Array<{ id: string; label: string }>; onChange: (id: string) => void }) {
  return <Segmented value={value} onChange={onChange} options={options} label="Presets" />;
}

export function okNum(n: number, digits = 2) {
  return Number.isFinite(n) ? fmt(n, digits) : "—";
}

export { StatusOk };
