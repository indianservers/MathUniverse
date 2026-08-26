import { ArrowLeft, ArrowRight, Check, Languages, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./DirectProportionTargetLesson85.css";

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));

export default function DirectProportionTargetLesson85({ resetToken, onInteraction }: LessonAdapterProps) {
  const [quantity, setQuantity] = useState(3);
  const [rate, setRate] = useState(30);
  const [tab, setTab] = useState("Interaction + visualization");
  const [shareState, setShareState] = useState("Share");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const cost = quantity * rate;

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeQuantity = (value: number) => { setQuantity(clamp(value, 1, 5)); setPracticeLoaded(false); act(); };
  const changeRate = (value: number) => { setRate(clamp(value, 1, 50)); setPracticeLoaded(false); act(); };
  const reset = () => { setQuantity(3); setRate(30); setTab("Interaction + visualization"); setShareState("Share"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`y = ${rate}x; x = ${quantity}; y = ${cost}`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  const dropPoint = (event: DragEvent<HTMLButtonElement>, value: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/direct-point")) changeQuantity(value); setDragging(""); };
  const loadPractice = () => { setRate(12); setQuantity(5); setPracticeLoaded(true); act(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="direct85-page" data-testid="number-mockup-0067" data-dedicated-lesson="85" data-object-model="editable-constant-multiplier-linked-table-draggable-coordinate-points-origin-line-unit-rate-equation-practice-model" data-quantity={quantity} data-rate={rate} data-cost={cost} data-ratio={rate} data-tab={tab} data-share-state={shareState} data-practice-loaded={practiceLoaded} data-dragging={dragging} data-actions={actions}>
      <span className="sr-only">Concept trace: Direct proportion table. Direct proportion has form y = kx. The ratio y over x remains constant and the graph passes through the origin.</span>
      <nav className="direct85-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>&gt;</span><b>85 Direct Proportion</b></nav>
      <header className="direct85-header">
        <aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside>
        <h1>Direct Proportion</h1><p>Understand constant ratios.</p>
        <div className="direct85-chips"><b>Foundational-Intermediate</b><b>Concept + Manipulative</b><b>Fractions, Decimals, Ratios and Percentages</b><b>6-10 min</b></div>
        <nav><button type="button"><Languages />English (English)<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><button type="button">Workspace</button></nav>
      </header>
      <nav className="direct85-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
      <main className="direct85-workspace">
        <section className="direct85-lab">
          <small>DIRECT PROPORTION LAB</small><h2>y = {rate}x</h2><p className="direct85-rule"><Check />Direct proportion keeps y/x constant.</p>
          <RatioTable rate={rate} quantity={quantity} changeQuantity={changeQuantity} dropPoint={dropPoint} setDragging={setDragging} />
          <Graph rate={rate} quantity={quantity} changeQuantity={changeQuantity} dropPoint={dropPoint} setDragging={setDragging} />
        </section>
        <aside className="direct85-side">
          <section className="direct85-values"><h3>Current values</h3><label>Quantity (x)<input aria-label="Current quantity x" type="number" min="1" max="5" value={quantity} onChange={(event) => changeQuantity(Number(event.target.value))} /></label><label>Cost (y)<output>{cost}</output></label></section>
          <section className="direct85-unit"><h3>Unit rate</h3><div><b>Unit rate: {rate}</b><p>1 item costs <strong>{rate}</strong>.</p><p>{quantity} items cost <strong>{cost}</strong>.</p></div></section>
          <section className="direct85-equation"><h3>Equation</h3><label>y = <input aria-label="Constant of proportion k" type="number" min="1" max="50" value={rate} onChange={(event) => changeRate(Number(event.target.value))} />x</label><p>Direct proportion:<b>y/x = {rate}</b></p></section>
          <section className="direct85-ideas"><h3>Key ideas</h3><p><i>↗</i>More input creates proportionally more output.</p><p><i>↗</i>Direct proportion keeps y/x constant.</p><p><i>✓</i>The graph passes through the origin.</p></section>
          <section className="direct85-try"><h3>Try it!</h3><p>Try: If <b>y = 12x</b>,<br />find y when <b>x = 5</b>.</p><button type="button" onClick={loadPractice}>{practiceLoaded ? `y = ${cost}` : "Check your answer"}<ArrowRight /></button></section>
        </aside>
      </main>
      <nav className="direct85-navigation"><a href="/lessons/numbers-and-arithmetic/84-proportion"><ArrowLeft /><span>Previous<b>RATIO AND RATE COMPARISON</b></span></a><a href="/lessons/numbers-and-arithmetic/86-inverse-proportion"><span>Next<b>INVERSE PROPORTION</b></span><ArrowRight /></a></nav>
    </div>
  );
}

function RatioTable({ rate, quantity, changeQuantity, dropPoint, setDragging }: { rate: number; quantity: number; changeQuantity: (value: number) => void; dropPoint: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void }) {
  return <section className="direct85-table"><h3>Proportion table</h3><div><header><b>Quantity (x)</b><b>Cost (y)</b><b>y/x</b><b>Constant ratio</b></header>{[1, 2, 3, 4].map((x) => <p className={quantity === x ? "selected" : ""} key={x}><button type="button" draggable aria-label={`Proportion table quantity ${x}`} onClick={() => changeQuantity(x)} onDragStart={(event) => { event.dataTransfer.setData("text/direct-point", String(x)); setDragging(`table:${x}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropPoint(event, x)}>{x}</button><strong>{x * rate}</strong><span>{x * rate}/{x} = {rate}</span><b>{rate}</b></p>)}</div><footer><strong>Constant multiplier (y/x)</strong>{[1, 2, 3, 4].map((x, index) => <span key={x}><b>{rate}</b>{index < 3 && "="}</span>)}</footer></section>;
}

function Graph({ rate, quantity, changeQuantity, dropPoint, setDragging }: { rate: number; quantity: number; changeQuantity: (value: number) => void; dropPoint: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void }) {
  const yFor = (x: number) => 290 - Math.min(240, (x * rate / Math.max(150, rate * 5)) * 240);
  const lineTop = yFor(5);
  return <section className="direct85-graph"><h3>Graph of y = {rate}x</h3><div className="direct85-plot"><svg viewBox="0 0 480 320" aria-label={`Graph of y equals ${rate} x`}><g className="grid">{[1, 2, 3, 4, 5].map((x) => <line x1={54 + x * 78} x2={54 + x * 78} y1="44" y2="290" key={`x${x}`} />)}{[0, 1, 2, 3, 4, 5].map((y) => <line x1="54" x2="452" y1={290 - y * 48} y2={290 - y * 48} key={`y${y}`} />)}</g><path className="axis" d="M54 38V290H462M54 38l-5 10M54 38l5 10M462 290l-10-5M462 290l-10 5" /><line className="trend" x1="54" y1="290" x2="444" y2={lineTop} /><path className="trend" d={`M444 ${lineTop}l-12 2m12-2l-5 11`} /><g className="labels"><text x="48" y="307">0</text><text x="466" y="297">x</text><text x="49" y="28">y</text>{[1, 2, 3, 4, 5].map((x) => <text x={51 + x * 78} y="309" key={`lx${x}`}>{x}</text>)}{[1, 2, 3, 4, 5].map((y) => <text x="18" y={295 - y * 48} key={`ly${y}`}>{Math.round(y * Math.max(150, rate * 5) / 5)}</text>)}</g></svg>{[1, 2, 3, 4].map((x) => <button type="button" draggable className={quantity === x ? "active" : ""} aria-label={`Graph point ${x}`} style={{ left: 54 + x * 78, top: yFor(x) }} onClick={() => changeQuantity(x)} onDragStart={(event) => { event.dataTransfer.setData("text/direct-point", String(x)); setDragging(`graph:${x}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropPoint(event, x)} key={x}><span>({x}, {x * rate})</span></button>)}</div><p><Check />The graph passes through the origin.</p></section>;
}
