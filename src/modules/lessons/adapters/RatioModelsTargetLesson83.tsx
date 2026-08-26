import { ArrowLeft, ArrowRight, Check, Info, Lightbulb, RotateCcw, Share2, Sparkles, Users } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./RatioModelsTargetLesson83.css";

function clamp(value: number, minimum = 1, maximum = 8) {
  return Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
}

export default function RatioModelsTargetLesson83({ resetToken, onInteraction }: LessonAdapterProps) {
  const [blue, setBlue] = useState(2);
  const [red, setRed] = useState(3);
  const [scale, setScale] = useState(2);
  const [tab, setTab] = useState("Interaction + visualization");
  const [shareState, setShareState] = useState("Share");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const total = blue + red;
  const scaledBlue = blue * scale;
  const scaledRed = red * scale;

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const change = (key: "blue" | "red", value: number) => { (key === "blue" ? setBlue : setRed)(clamp(value)); setPracticeLoaded(false); act(); };
  const reset = () => { setBlue(2); setRed(3); setScale(2); setTab("Interaction + visualization"); setShareState("Share"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`${blue}:${red} = ${scaledBlue}:${scaledRed}`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  const dropToken = (event: DragEvent<HTMLButtonElement>, key: "blue" | "red", value: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/ratio-token")) change(key, value); setDragging(""); };
  const loadPractice = () => { setBlue(3); setRed(5); setScale(2); setPracticeLoaded(true); act(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="ratio83-page"
      data-testid="number-mockup-0065"
      data-dedicated-lesson="83"
      data-object-model="dual-editable-part-count-draggable-token-tape-diagram-scaled-batch-double-number-line-preserved-relationship-practice-model"
      data-blue={blue}
      data-red={red}
      data-total={total}
      data-scale={scale}
      data-scaled-blue={scaledBlue}
      data-scaled-red={scaledRed}
      data-tab={tab}
      data-share-state={shareState}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Ratio order model. Ratio order matters. Part-to-part is different from part-to-whole, and both parts must scale together.</span>
      <nav className="ratio83-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>83 Ratio Models</b></nav>
      <main className="ratio83-surface">
        <header><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Ratio Models</h1><p>Compare quantities multiplicatively.</p><nav><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><b>◷ 6–10 min</b></nav></header>
        <nav className="ratio83-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
        <div className="ratio83-workspace">
          <section className="ratio83-lab"><h2>Blue : Red = {blue} : {red}</h2><h3>PART-TO-PART RATIO MODEL (ONE BATCH)</h3><TokenRow blue={blue} red={red} onChange={change} onDrop={dropToken} onDrag={setDragging} /><p className="ratio83-total">Total parts: {total}</p><Tape blue={blue} red={red} onChange={change} /><ScaledRow blue={blue} red={red} scale={scale} setScale={(value) => { setScale(value); setPracticeLoaded(false); act(); }} /><DoubleLine blue={blue} red={red} /><p className="ratio83-preserved"><Check />The relationship is preserved when both parts scale together.</p><button type="button" className="ratio83-practice" onClick={loadPractice}><Lightbulb />{practiceLoaded ? `Solved: ${blue}:${red}` : "Try: Model 3:5."}</button></section>
          <aside className="ratio83-side"><section className="blue"><label>FIRST PART (BLUE)<input aria-label="First blue ratio part" type="number" min="1" max="8" value={blue} onChange={(event) => change("blue", Number(event.target.value))} /></label><p>The first part represents<br />one quantity.</p></section><section className="purple"><label>SECOND PART (RED)<input aria-label="Second red ratio part" type="number" min="1" max="8" value={red} onChange={(event) => change("red", Number(event.target.value))} /></label><p>The second part represents<br />another quantity.</p></section><section><h3>TOTAL PARTS</h3><b>{total}</b><p>Total parts: {total}</p></section><section className="blue"><h3>SCALED RATIO<br />(SCALE FACTOR: {scale})</h3><b>{scaledBlue} : {scaledRed}</b><p>{blue} : {red} = {scaledBlue} : {scaledRed}</p></section><p className="ratio83-info"><Info />Ratio order matters.</p><p className="ratio83-parts"><Users />Part-to-part is different<br />from part-to-whole.</p><p className="ratio83-success"><Check />The relationship is<br />preserved when both<br />parts scale together.</p></aside>
        </div>
      </main>
      <nav className="ratio83-navigation"><a href="/lessons/numbers-and-arithmetic/82-recurring-decimals"><ArrowLeft /><span>PREVIOUS<b>Recurring Decimals</b></span></a><a href="/lessons/numbers-and-arithmetic/84-proportion"><span>NEXT<b>Proportion</b></span><ArrowRight /></a></nav>
      <footer className="ratio83-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap">▥ Sitemap</a><a href="/docs">⚑ Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function TokenRow({ blue, red, onChange, onDrop, onDrag }: { blue: number; red: number; onChange: (key: "blue" | "red", value: number) => void; onDrop: (event: DragEvent<HTMLButtonElement>, key: "blue" | "red", value: number) => void; onDrag: (value: string) => void }) {
  const group = (key: "blue" | "red", count: number) => <div className={`${key} ${count > 2 && key === "blue" ? "dense" : ""}`}>{Array.from({ length: count }, (_, index) => <button type="button" draggable aria-label={`${key} ratio token ${index + 1}`} onClick={() => onChange(key, index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/ratio-token", `${key}:${index + 1}`); onDrag(`${key}:${index + 1}`); }} onDragEnd={() => onDrag("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, key, index + 1)} key={index} />)}<i /><b>{count} {key}</b></div>;
  return <div className="ratio83-tokens">{group("blue", blue)}{group("red", red)}</div>;
}

function Tape({ blue, red, onChange }: { blue: number; red: number; onChange: (key: "blue" | "red", value: number) => void }) {
  return <section className="ratio83-tape"><h3>TAPE DIAGRAM ({blue + red} EQUAL UNITS)</h3><div>{Array.from({ length: blue }, (_, index) => <button type="button" className="blue" aria-label={`Blue tape part ${index + 1}`} onClick={() => onChange("blue", index + 1)} key={`b${index}`} />)}{Array.from({ length: red }, (_, index) => <button type="button" className="red" aria-label={`Red tape part ${index + 1}`} onClick={() => onChange("red", index + 1)} key={`r${index}`} />)}</div><footer style={{ gridTemplateColumns: `${blue}fr ${red}fr` }}><b>{blue} parts</b><b>{red} parts</b></footer></section>;
}

function ScaledRow({ blue, red, scale, setScale }: { blue: number; red: number; scale: number; setScale: (value: number) => void }) {
  return <section className="ratio83-scaled"><h3>SCALED BY {scale} (SCALE FACTOR: {scale})</h3><div className="blue">{Array.from({ length: blue * scale }, (_, index) => <i key={index} />)}<b>{blue * scale} blue</b></div><div className="red">{Array.from({ length: red * scale }, (_, index) => <i key={index} />)}<b>{red * scale} red</b></div><button type="button" draggable aria-label="Ratio scale factor" onClick={() => setScale(scale === 4 ? 1 : scale + 1)} onDragEnd={() => setScale(scale)}>Scale factor: {scale}</button></section>;
}

function DoubleLine({ blue, red }: { blue: number; red: number }) {
  return <section className="ratio83-lines"><h3>DOUBLE NUMBER LINE</h3><div className="blue"><b>Blue</b><i />{Array.from({ length: 4 }, (_, index) => <span style={{ left: `${index * 33.333}%` }} key={index}>{blue * index}</span>)}</div><div className="red"><b>Red</b><i />{Array.from({ length: 4 }, (_, index) => <span style={{ left: `${index * 33.333}%` }} key={index}>{red * index}</span>)}</div></section>;
}
