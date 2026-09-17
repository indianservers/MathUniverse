import type { ReactNode } from "react";
import { MockupLearningStrip } from "../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { useLabMode } from "../mockup/studioLabKit";

export function ComplexLabChrome({
  page,
  pills = false,
  children,
}: {
  page: StudioMockupPage;
  pills?: boolean;
  children: (mode: string, setMode: (mode: string) => void) => ReactNode;
}) {
  const { tabs, mode, setMode } = useLabMode(page);
  return (
    <div className={`cx-lab-root${pills ? " is-pills" : ""}`} data-cx-lab={page.id} data-lab-mode={mode} data-mode-canvas={mode} data-studio-kernel="1">
      <p className="sr-only" role="status" aria-live="polite">{page.title} mode {mode}</p>
      {pills ? (
        <nav className="cx-pills" aria-label={`${page.title} modes`}>
          {tabs.map((item) => (
            <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
              {item}
            </button>
          ))}
        </nav>
      ) : null}
      <div className="cx-lab" data-mode-canvas={mode}>{children(mode, setMode)}</div>
      <MockupLearningStrip page={page} mode={mode} />
    </div>
  );
}

export function CxCol({ title, kicker, children, className = "" }: { title?: string; kicker?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`cx-col ${className}`.trim()}>
      {kicker ? <div className="cx-kicker">{kicker}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function CxCanvas({ title, tools, children }: { title: string; tools?: ReactNode; children: ReactNode }) {
  return (
    <section className="cx-canvas">
      <h2>
        {title}
        {tools}
      </h2>
      {children}
    </section>
  );
}

export function CxLive({ title, badge, children }: { title: string; badge?: ReactNode; children: ReactNode }) {
  return (
    <aside className="cx-live">
      <h2>
        {title}
        {badge}
      </h2>
      {children}
    </aside>
  );
}

export function CxStepper({
  label,
  value,
  min,
  max,
  step = 0.1,
  digits = 2,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  digits?: number;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <label className="cx-step">
      <span>{label}</span>
      <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(clamp(value - step))}>−</button>
      <input
        type="number"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Number(value.toFixed(digits))}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
      />
      <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(clamp(value + step))}>+</button>
    </label>
  );
}

export function CxSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display?: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="cx-slider">
      <span>
        {label}
        <output>{display ?? String(value)}</output>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export function CxToggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="cx-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={on} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
