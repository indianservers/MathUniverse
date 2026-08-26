import { ArrowLeft, ArrowRight, Check, Clock3, ExternalLink, Languages, RotateCcw, Share2, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PercentageChangeTargetLesson89.css";

const clamp = (value: number) => Math.max(1, Math.min(300, Math.round(Number.isFinite(value) ? value : 1)));
const display = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function PercentageChangeTargetLesson89({ resetToken, onInteraction }: LessonAdapterProps) {
  const [original, setOriginal] = useState(80);
  const [next, setNext] = useState(100);
  const [tab, setTab] = useState("Interaction + visualization");
  const [shareState, setShareState] = useState("Share");
  const [workspaceState, setWorkspaceState] = useState("closed");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const signedChange = next - original;
  const change = Math.abs(signedChange);
  const percent = original ? (change / original) * 100 : 0;
  const direction = signedChange >= 0 ? "increase" : "decrease";
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeOriginal = (value: number) => { setOriginal(clamp(value)); setPracticeLoaded(false); act(); };
  const changeNext = (value: number) => { setNext(clamp(value)); setPracticeLoaded(false); act(); };
  const reset = () => { setOriginal(80); setNext(100); setTab("Interaction + visualization"); setShareState("Share"); setWorkspaceState("closed"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`${original} to ${next}: ${display(percent)}% ${direction}`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  const loadPractice = () => { setOriginal(50); setNext(65); setPracticeLoaded(true); act(); };
  const startDrag = (event: DragEvent<HTMLElement>, source: string) => { event.dataTransfer.setData("text/percentage-change", source); setDragging(source); };
  const dropValue = (event: DragEvent<HTMLElement>, target: "original" | "new") => { event.preventDefault(); const source = event.dataTransfer.getData("text/percentage-change"); if (source === "original" && target === "new") changeNext(original); if (source === "new" && target === "original") changeOriginal(next); setDragging(""); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="change89-page" data-testid="number-mockup-0071" data-dedicated-lesson="89" data-object-model="dual-editable-original-new-draggable-before-after-bars-percentage-change-breakdown-number-line-baseline-warning-practice-model" data-original={original} data-new={next} data-change={change} data-percent={display(percent)} data-direction={direction} data-tab={tab} data-share-state={shareState} data-workspace-state={workspaceState} data-practice-loaded={practiceLoaded} data-dragging={dragging} data-actions={actions}>
    <span className="sr-only">Concept trace: Percentage-change baseline. Use original amount as the base. Percentage Change visuals calculate change divided by the original amount.</span>
    <nav className="change89-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>&gt;</span><b>89 Percentage Change</b></nav>
    <header className="change89-header"><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Percentage Change</h1><p>Model increase and decrease.</p><div><b>Foundational-Intermediate</b><b>Concept + Manipulative</b><b>Fractions, Decimals, Ratios and Percentages</b><b><Clock3 />6-10 min</b></div><nav><button type="button" onClick={act}><Languages />English (English)<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><button type="button" onClick={() => { setWorkspaceState("open"); act(); }}><ExternalLink />Workspace</button></nav></header>
    <nav className="change89-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
    <main className="change89-workspace">
      <section className="change89-lab"><h2>VISUAL MODEL: {direction.toUpperCase()} FROM {original} TO {next}</h2><p>See how the change is calculated using the original amount as the base.</p><ChangeBars original={original} next={next} change={change} direction={direction} startDrag={startDrag} dropValue={dropValue} /><Breakdown original={original} next={next} change={change} percent={percent} /><ChangeLine original={original} next={next} change={change} percent={percent} direction={direction} startDrag={startDrag} dropValue={dropValue} changeNext={changeNext} /></section>
      <aside className="change89-side"><ValueEditor className="original" label="Original amount" value={original} note="This is the base (100%)." ariaLabel="Original amount" onChange={changeOriginal} /><ValueEditor className="new" label="New amount" value={next} note={`New value after the ${direction}.`} ariaLabel="New amount" onChange={changeNext} /><section className="change89-change"><h3>Change: <b>{change}</b></h3><p>{next} - {original} = {display(signedChange)}</p></section><section className="change89-formula"><h3>Percentage change</h3><p><span><b>{change}</b><b>{original}</b></span><i>×</i><strong>100</strong><i>=</i><em>{display(percent)}%</em></p></section><section className="change89-warning"><TriangleAlert /><p><b>Use the original amount as the base.</b><span>Do not divide by the new amount.</span></p></section><button type="button" className="change89-try" onClick={loadPractice}><span><b>{practiceLoaded ? `Solved: ${display(percent)}% increase` : "Try: From 50 to 65."}</b><small>What is the percentage change?</small><strong>{practiceLoaded ? "30% increase" : "Try it now"}<ArrowRight /></strong></span></button></aside>
    </main>
    <nav className="change89-navigation"><a href="/lessons/numbers-and-arithmetic/88-percentages"><ArrowLeft /><span>PREVIOUS<b>Percentages</b></span></a><a href="/lessons/numbers-and-arithmetic/90-compound-change"><span>NEXT<b>Compound Change</b></span><ArrowRight /></a></nav>
  </div>;
}

function ValueEditor({ className, label, value, note, ariaLabel, onChange }: { className: string; label: string; value: number; note: string; ariaLabel: string; onChange: (value: number) => void }) {
  return <section className={`change89-value ${className}`}><label>{label}: <input aria-label={ariaLabel} type="number" min="1" max="300" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label><p>{note}</p></section>;
}

function ChangeBars({ original, next, change, direction, startDrag, dropValue }: { original: number; next: number; change: number; direction: string; startDrag: (event: DragEvent<HTMLElement>, source: string) => void; dropValue: (event: DragEvent<HTMLElement>, target: "original" | "new") => void }) {
  const originalWidth = Math.min(745, original * 7.56);
  const nextWidth = Math.min(745, next * 6.85);
  const sharedWidth = Math.min(nextWidth, Math.min(original, next) * 6.76);
  return <section className="change89-bars"><h3>Before (original amount)</h3><div className="change89-before"><button type="button" draggable aria-label="Original amount bar" style={{ width: `${originalWidth}px` }} onDragStart={(event) => startDrag(event, "original")} onDragEnd={() => undefined} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropValue(event, "original")}>{original}</button><b>Original base</b></div><h3>After (new amount)</h3><div className={`change89-after ${direction}`} style={{ width: `${nextWidth}px` }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropValue(event, "new")}><button type="button" draggable aria-label="New amount bar" style={{ width: `${sharedWidth}px` }} onDragStart={(event) => startDrag(event, "new")}>{Math.min(original, next)}</button>{change > 0 && <button type="button" draggable aria-label="Change segment" className="change89-segment" onDragStart={(event) => startDrag(event, "new")}>{change}</button>}<strong>{next}</strong><span>Change ({direction})</span></div></section>;
}

function Breakdown({ original, next, change, percent }: { original: number; next: number; change: number; percent: number }) {
  return <section className="change89-breakdown"><h3>CALCULATION BREAKDOWN</h3><div><article><b><i>1</i>Find the change</b><p>Change = New - Original</p><strong>{next} - {original} = <em>{change}</em></strong></article><ArrowRight /><article><b><i>2</i>Percentage change</b><p><span><em>{change}</em><em>{original}</em></span> × 100</p></article><ArrowRight /><article><b><i>3</i>Simplify</b><p>= <strong>{display(percent)}%</strong></p></article></div></section>;
}

function ChangeLine({ original, next, change, percent, direction, startDrag, dropValue, changeNext }: { original: number; next: number; change: number; percent: number; direction: string; startDrag: (event: DragEvent<HTMLElement>, source: string) => void; dropValue: (event: DragEvent<HTMLElement>, target: "original" | "new") => void; changeNext: (value: number) => void }) {
  const maximum = Math.max(120, Math.ceil(Math.max(original, next) / 20) * 20);
  const linePosition = (value: number) => {
    if (maximum !== 120) return `${(value / maximum) * 100}%`;
    const anchors = [0, 16.55, 33.1, 49.6, 63.03, 81.16, 100];
    const segment = Math.min(5, Math.floor(value / 20));
    const progress = (value - segment * 20) / 20;
    return `${anchors[segment] + (anchors[segment + 1] - anchors[segment]) * progress}%`;
  };
  const low = Math.min(original, next);
  const high = Math.max(original, next);
  return <section className="change89-line"><h3>NUMBER LINE: BEFORE AND AFTER</h3><div className="axis">{Array.from({ length: maximum / 5 + 1 }, (_, index) => { const value = index * 5; const covered = value === original || value === next; return <button type="button" aria-label={`Percentage change number line ${value}`} className={value % 20 === 0 ? "major" : ""} style={{ left: linePosition(value) }} onClick={() => changeNext(value || 1)} key={value}>{value % 20 === 0 && !covered ? value : ""}</button>; })}<i className="arc" style={{ left: linePosition(low), width: `${Math.abs(Number.parseFloat(linePosition(high)) - Number.parseFloat(linePosition(low)))}%` }}><span>{direction === "increase" ? "+" : "-"}{change}</span></i><button type="button" className="point original" draggable aria-label="Original number line point" style={{ left: linePosition(original) }} onDragStart={(event) => startDrag(event, "original")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropValue(event, "original")}><b>{original}</b><span>Original</span></button><button type="button" className="point new" draggable aria-label="New number line point" style={{ left: linePosition(next) }} onDragStart={(event) => startDrag(event, "new")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropValue(event, "new")}><b>{next}</b><span>New amount</span></button></div><p>{direction === "increase" ? <TrendingUp /> : <TrendingDown />}<b>{display(percent)}% {direction}</b><Check /></p></section>;
}
