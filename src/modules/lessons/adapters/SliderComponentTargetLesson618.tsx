import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Languages,
  MousePointerClick,
  RotateCcw,
  Share2,
  Sigma,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./SliderComponentTargetLesson618.css";
import "./SliderComponentTargetLesson618.fidelity.css";

const initial = { label: "a", minimum: 0, maximum: 2, step: 0.1, defaultValue: 1.2 };
const tidy = (value: number) => Number(value.toFixed(2));

export default function SliderComponentTargetLesson618({ resetToken, onInteraction }: LessonAdapterProps) {
  const [settings, setSettings] = useState(initial);
  const [value, setValue] = useState(initial.defaultValue);
  const [showValue, setShowValue] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [tab, setTab] = useState("Interaction + visualization");
  const [shareState, setShareState] = useState("Share");
  const [workspaceState, setWorkspaceState] = useState("closed");
  const [actions, setActions] = useState(0);

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const normalize = (candidate: typeof initial) => {
    const minimum = Math.min(candidate.minimum, candidate.maximum - 0.1);
    const maximum = Math.max(candidate.maximum, minimum + 0.1);
    const step = Math.max(0.01, Math.min(candidate.step, maximum - minimum));
    const defaultValue = Math.max(minimum, Math.min(maximum, candidate.defaultValue));
    return { ...candidate, minimum: tidy(minimum), maximum: tidy(maximum), step: tidy(step), defaultValue: tidy(defaultValue) };
  };
  const updateSetting = (key: keyof typeof initial, raw: string) => {
    const next = key === "label" ? { ...settings, label: raw } : { ...settings, [key]: Number(raw) };
    if (key !== "label" && !Number.isFinite(next[key] as number)) return;
    const normalized = normalize(next);
    setSettings(normalized);
    setValue((current) => key === "defaultValue" ? normalized.defaultValue : Math.max(normalized.minimum, Math.min(normalized.maximum, current)));
    act();
  };
  const changeValue = (next: number) => { setValue(tidy(next)); act(); };
  const reset = () => { setSettings(initial); setValue(initial.defaultValue); setShowValue(true); setAdvanced(false); setTab("Interaction + visualization"); setShareState("Share"); setWorkspaceState("closed"); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`${settings.label} = ${value}; y = ${value}x^2`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const percentage = ((value - settings.minimum) / (settings.maximum - settings.minimum)) * 100;
  const meaningfulRange = settings.maximum > settings.minimum && settings.step <= settings.maximum - settings.minimum;

  return <div className="slider618-page" data-testid="authoring-mockup-0074" data-dedicated-lesson="618" data-object-model="editable-slider-schema-draggable-range-live-parabola-equation-linked-preview-authoring-checklist-model" data-label={settings.label} data-minimum={settings.minimum} data-maximum={settings.maximum} data-step={settings.step} data-default={settings.defaultValue} data-value={value} data-show-value={showValue} data-tab={tab} data-share-state={shareState} data-workspace-state={workspaceState} data-actions={actions}>
    <nav className="slider618-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/authoring-and-learning-system">Authoring And Learning System</a><span>&gt;</span><b>618 Slider Component</b></nav>
    <header className="slider618-header"><aside><small>AUTHORING AND LEARNING SYSTEM</small><small>INTERACTIVE AUTHORING</small></aside><h1>Slider Component</h1><p>Expose adjustable parameters.</p><div><b>All Levels</b><b>Authoring Studio</b><b>Notes / Custom Tools / Scripting</b><b><Clock3 />6-10 min</b></div><nav><button type="button" onClick={act}><Languages />English (English)<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><button type="button" onClick={() => { setWorkspaceState("open"); act(); }}><ExternalLink />Workspace</button></nav></header>
    <nav className="slider618-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
    <main className="slider618-workspace">
      <SettingsPanel settings={settings} showValue={showValue} advanced={advanced} onUpdate={updateSetting} onShowValue={(checked) => { setShowValue(checked); act(); }} onAdvanced={() => { setAdvanced((open) => !open); act(); }} />
      <section className="slider618-live"><h2>LIVE GRAPH PREVIEW</h2><ParabolaGraph value={value} label={settings.label} /><strong className="slider618-current" aria-live="polite">{showValue ? `${settings.label || "a"} = ${value}` : "Current value hidden"}</strong><div className="slider618-range"><input aria-label="Parameter slider a" type="range" min={settings.minimum} max={settings.maximum} step={settings.step} value={value} onChange={(event) => changeValue(Number(event.target.value))} style={{ "--slider-progress": `${percentage}%` } as React.CSSProperties} /><div><span>Min<br /><b>{settings.minimum}</b></span><span>{tidy(settings.minimum + (settings.maximum - settings.minimum) * .25)}</span><span>{tidy(settings.minimum + (settings.maximum - settings.minimum) * .5)}</span><span>{tidy(settings.minimum + (settings.maximum - settings.minimum) * .75)}</span><span>{settings.maximum}</span></div></div><div className="slider618-summary"><span>Min&nbsp; {settings.minimum}</span><span>Max&nbsp; {settings.maximum}</span><span>Step&nbsp; {settings.step}</span><span>Default&nbsp; {settings.defaultValue}</span></div></section>
      <aside className="slider618-linked"><h2>LINKED PREVIEW</h2><div className="slider618-equation"><span>y = <i>{settings.label || "a"}</i> x²</span></div><div className="slider618-flow"><p><MousePointerClick /><b>Move slider</b></p><span>↓</span><p><Sigma /><b>Equation updates</b></p><span>↓</span><p><TrendingUp /><b>Graph changes</b></p></div><section><h3>AUTHORING CHECKLIST</h3>{[
        `Label: ${settings.label || "required"}`,
        `Range: Min ${settings.minimum}, Max ${settings.maximum}`,
        `Step: ${settings.step}`,
        `Default value: ${settings.defaultValue}`,
        "Keyboard supported",
      ].map((item) => <p key={item}><Check />{item}{item === "Keyboard supported" && <span className="key-badge">Tab / ← →</span>}</p>)}<p className={meaningfulRange ? "" : "warning"}><Check />Meaningful range required<span>!</span></p></section></aside>
    </main>
  </div>;
}

type Settings = typeof initial;
function SettingsPanel({ settings, showValue, advanced, onUpdate, onShowValue, onAdvanced }: { settings: Settings; showValue: boolean; advanced: boolean; onUpdate: (key: keyof Settings, value: string) => void; onShowValue: (checked: boolean) => void; onAdvanced: () => void }) {
  return <aside className="slider618-settings"><h2>COMPONENT SETTINGS</h2><h3>Parameter slider</h3><label>Label<input aria-label="Slider label" value={settings.label} onChange={(event) => onUpdate("label", event.target.value)} /></label><div><label>Min<input aria-label="Slider minimum" type="number" step="0.1" value={settings.minimum} onChange={(event) => onUpdate("minimum", event.target.value)} /></label><label>Max<input aria-label="Slider maximum" type="number" step="0.1" value={settings.maximum} onChange={(event) => onUpdate("maximum", event.target.value)} /></label><label>Step<input aria-label="Slider step" type="number" min="0.01" step="0.01" value={settings.step} onChange={(event) => onUpdate("step", event.target.value)} /></label><label>Default<input aria-label="Slider default value" type="number" step={settings.step} value={settings.defaultValue} onChange={(event) => onUpdate("defaultValue", event.target.value)} /></label></div><label className="slider618-check"><input aria-label="Show value" type="checkbox" checked={showValue} onChange={(event) => onShowValue(event.target.checked)} /><span><b>Show value</b><small>Display current value above slider</small></span></label><button type="button" className="slider618-advanced" aria-expanded={advanced} onClick={onAdvanced}>Advanced<ChevronDown /></button>{advanced && <div className="slider618-advanced-content"><b>Keyboard increment</b><span>Arrow keys move by {settings.step}</span></div>}<p className="slider618-note">This slider controls the parameter '{settings.label || "a"}' in the equation y = {settings.label || "a"}x<sup>2</sup>.</p></aside>;
}

function ParabolaGraph({ value, label }: { value: number; label: string }) {
  const curve = useMemo(() => (factor: number) => {
    const points: string[] = [];
    for (let index = 0; index <= 80; index += 1) {
      const x = -3 + index * 0.075;
      const y = factor * x * x;
      points.push(`${196 + x * 59},${220 - y * 28}`);
    }
    return points.join(" ");
  }, []);
  return <div className="slider618-graph">
    <svg viewBox="0 0 500 300" role="img" aria-label={`Live graph y equals ${value} x squared`}>
      <defs>
        <pattern id="slider618-small-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#eef2f6" /></pattern>
        <pattern id="slider618-grid" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#slider618-small-grid)" /><path d="M50 0H0V50" fill="none" stroke="#dce5ec" /></pattern>
        <clipPath id="slider618-clip"><rect x="10" y="10" width="410" height="270" /></clipPath>
      </defs>
      <rect x="10" y="10" width="410" height="270" fill="url(#slider618-grid)" />
      <g clipPath="url(#slider618-clip)"><polyline points={curve(.5)} fill="none" stroke="#efa7e9" strokeWidth="2" strokeDasharray="7 5" /><polyline points={curve(1)} fill="none" stroke="#8dd2df" strokeWidth="2" strokeDasharray="7 5" /><polyline points={curve(1.5)} fill="none" stroke="#8b35ef" strokeWidth="2.5" /><polyline points={curve(value)} fill="none" stroke="#7624eb" strokeWidth="4" /></g>
      <line x1="10" y1="220" x2="414" y2="220" stroke="#101a32" /><path d="M414 220l-8-5v10z" fill="#101a32" />
      <line x1="196" y1="280" x2="196" y2="10" stroke="#101a32" /><path d="M196 10l-5 8h10z" fill="#101a32" />
      {[-3,-2,-1,0,1,2,3].map((tick) => <g key={tick}><line x1={196 + tick * 59} y1="216" x2={196 + tick * 59} y2="224" stroke="#101a32" /><text x={196 + tick * 59} y="241" textAnchor="middle">{tick}</text></g>)}
      {[-1,1,2,3].map((tick) => <g key={tick}><line x1="192" y1={220 - tick * 58} x2="200" y2={220 - tick * 58} stroke="#101a32" /><text x="185" y={224 - tick * 58} textAnchor="end">{tick}</text></g>)}
      <text x="395" y="209" className="axis">x</text><text x="207" y="28" className="axis">y</text>
    </svg>
    <div className="slider618-legend"><span className="pink">a = 0.5</span><span className="cyan">a = 1.0</span><span className="violet">a = 1.5</span><span className="active">{label || "a"} = {value} (active)</span></div>
  </div>;
}
