import { ArrowLeft, ArrowRight, Check, Languages, Lightbulb, MapPin, PanelsTopLeft, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PercentagesTargetLesson88.css";

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
const display = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function PercentagesTargetLesson88({ resetToken, onInteraction }: LessonAdapterProps) {
  const [percent, setPercent] = useState(25);
  const [whole, setWhole] = useState(80);
  const [tab, setTab] = useState("Interaction + visualization");
  const [shareState, setShareState] = useState("Share");
  const [workspaceState, setWorkspaceState] = useState("closed");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const divisor = gcd(percent, 100) || 1;
  const numerator = percent / divisor;
  const denominator = 100 / divisor;
  const decimal = percent / 100;
  const part = decimal * whole;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changePercent = (value: number) => { setPercent(clamp(value, 0, 100)); setPracticeLoaded(false); act(); };
  const reset = () => { setPercent(25); setWhole(80); setTab("Interaction + visualization"); setShareState("Share"); setWorkspaceState("closed"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`${percent}% = ${percent}/100 = ${numerator}/${denominator} = ${display(decimal)}`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  const loadPractice = () => { setPercent(40); setWhole(60); setPracticeLoaded(true); act(); };
  const dropCell = (event: DragEvent<HTMLButtonElement>, value: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/percent-cell")) changePercent(value); setDragging(""); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="percent88-page" data-testid="number-mockup-0070" data-dedicated-lesson="88" data-object-model="editable-percent-draggable-hundred-grid-equivalent-fraction-decimal-slider-number-line-part-of-quantity-practice-model" data-percent={percent} data-decimal={display(decimal)} data-numerator={numerator} data-denominator={denominator} data-whole={whole} data-part={display(part)} data-tab={tab} data-share-state={shareState} data-workspace-state={workspaceState} data-practice-loaded={practiceLoaded} data-dragging={dragging} data-actions={actions}>
      <span className="sr-only">Concept trace: Hundred-grid percent model. Percent means out of 100, or parts per hundred, and dividing by 100 gives decimal form.</span>
      <nav className="percent88-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>&gt;</span><b>88 Percentages</b></nav>
      <header className="percent88-header"><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Percentages</h1><p>Unify fraction-decimal-percentage forms.</p><div><b>Foundational-Intermediate</b><b>Concept + Manipulative</b><b>Fractions, Decimals, Ratios and Percentages</b><b>6-10 min</b></div><nav><button type="button"><Languages />English (English)<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><button type="button" onClick={() => { setWorkspaceState("open"); act(); }}><PanelsTopLeft />Workspace</button></nav></header>
      <nav className="percent88-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
      <main className="percent88-workspace">
        <section className="percent88-left"><HundredModel percent={percent} changePercent={changePercent} dropCell={dropCell} setDragging={setDragging} numerator={numerator} denominator={denominator} decimal={decimal} /><PercentLine percent={percent} changePercent={changePercent} /><QuantityModel percent={percent} whole={whole} part={part} changePercent={changePercent} /></section>
        <aside className="percent88-side"><section className="percent88-control"><h3>PERCENT</h3><output>{percent}%</output><input aria-label="Percentage value" type="range" min="0" max="100" step="1" value={percent} onChange={(event) => changePercent(Number(event.target.value))} /><div><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div></section><ValueCard label="FRACTION (OUT OF 100)" value={`${percent}/100`} /><ValueCard label="DECIMAL" value={display(decimal)} blue /><ValueCard label="SIMPLIFIED FRACTION" value={`${numerator}/${denominator}`} /><section className="percent88-facts"><p><Check />Percent means parts per hundred.</p><p><Check />Divide by 100 to get decimal form.</p></section><button type="button" className="percent88-try" onClick={loadPractice}><Lightbulb /><b>{practiceLoaded ? `Solved: ${display(part)}` : "Try:"}</b>Find 40% of 60.</button></aside>
      </main>
      <nav className="percent88-navigation"><a href="/lessons/numbers-and-arithmetic/87-unit-rates"><ArrowLeft /><span>PREVIOUS<b>Unit Rates</b></span></a><a href="/lessons/numbers-and-arithmetic/89-percentage-change"><span>NEXT<b>Percentage Change</b></span><ArrowRight /></a></nav>
      <footer className="percent88-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function HundredModel({ percent, changePercent, dropCell, setDragging, numerator, denominator, decimal }: { percent: number; changePercent: (value: number) => void; dropCell: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void; numerator: number; denominator: number; decimal: number }) {
  const selected = (index: number) => percent === 25 ? Math.floor(index / 10) < 5 && index % 10 < 5 : index < percent;
  return <section className="percent88-model"><h3>100-SQUARE MODEL</h3><h2>{percent}% means {percent} out of 100</h2><div className="percent88-grid">{Array.from({ length: 100 }, (_, index) => <button type="button" draggable className={selected(index) ? "selected" : ""} aria-label={`Hundred grid cell ${index + 1}`} onClick={() => changePercent(index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/percent-cell", String(index + 1)); setDragging(`cell:${index + 1}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropCell(event, index + 1)} key={index} />)}</div><section className="percent88-equivalents"><h3>EQUIVALENT FORMS</h3><b>{percent}%</b><i>=</i><b><span>{percent}</span><span>100</span></b><i>=</i><b><span>{numerator}</span><span>{denominator}</span></b><i>=</i><b>{display(decimal)}</b></section></section>;
}

function PercentLine({ percent, changePercent }: { percent: number; changePercent: (value: number) => void }) {
  return <section className="percent88-line"><h3>NUMBER LINE</h3><div><i />{[12.5,25,37.5,50,62.5,75,87.5].map((value) => <span className="percent88-tick" style={{ left: `${value}%` }} key={value} />)}{[0,25,50,75,100].map((value) => <button type="button" className={percent === value ? "active" : ""} aria-label={`Percent number line ${value}`} style={{ left: `${value}%` }} onClick={() => changePercent(value)} key={value}>{value}%</button>)}<strong style={{ left: `${percent}%` }}><MapPin /></strong></div></section>;
}

function QuantityModel({ percent, whole, part, changePercent }: { percent: number; whole: number; part: number; changePercent: (value: number) => void }) {
  const perGroup = whole / 4;
  return <section className="percent88-quantity"><h3>PART OF A QUANTITY</h3><h2>{percent}% of {whole} = {display(part)}</h2><div>{Array.from({ length: 4 }, (_, group) => <section key={group}><div>{Array.from({ length: Math.round(perGroup) }, (_, index) => { const absolute = group * Math.round(perGroup) + index; return <button type="button" className={absolute < Math.round(part) ? "selected" : ""} aria-label={`Quantity dot ${absolute + 1}`} onClick={() => changePercent(Math.round(((absolute + 1) / whole) * 100))} key={index} />; })}</div><b>25%<small>({display(perGroup)})</small></b></section>)}</div><p>100%<b>({whole})</b></p></section>;
}

function ValueCard({ label, value, blue = false }: { label: string; value: string; blue?: boolean }) { return <section className={`percent88-value ${blue ? "blue" : ""}`}><h3>{label}</h3><b>{value}</b></section>; }
