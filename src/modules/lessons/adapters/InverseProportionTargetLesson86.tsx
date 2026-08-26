import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, FlaskConical, Lightbulb, PanelsTopLeft, Share2, UserRound, Users } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./InverseProportionTargetLesson86.css";

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
const display = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function InverseProportionTargetLesson86({ resetToken, onInteraction }: LessonAdapterProps) {
  const [product, setProduct] = useState(24);
  const [workers, setWorkers] = useState(8);
  const [shareState, setShareState] = useState("Share");
  const [workspaceState, setWorkspaceState] = useState("closed");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const days = product / workers;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeWorkers = (value: number) => { setWorkers(clamp(value, 1, 12)); setPracticeLoaded(false); act(); };
  const changeDays = (value: number) => { const next = clamp(value, 1, 24); setWorkers(clamp(product / next, 1, 12)); setPracticeLoaded(false); act(); };
  const changeProduct = (value: number) => { setProduct(clamp(value, 6, 72)); setPracticeLoaded(false); act(); };
  const reset = () => { setProduct(24); setWorkers(8); setShareState("Share"); setWorkspaceState("closed"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`xy = ${product}; x = ${workers}; y = ${display(days)}`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  const openWorkspace = () => { setWorkspaceState("open"); act(); };
  const loadPractice = () => { setProduct(36); setWorkers(9); setPracticeLoaded(true); act(); };
  const dropModel = (event: DragEvent<HTMLButtonElement>, nextWorkers: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/inverse-object")) changeWorkers(nextWorkers); setDragging(""); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="inverse86-page" data-testid="number-mockup-0068" data-dedicated-lesson="86" data-object-model="editable-constant-product-reciprocal-table-draggable-curve-points-work-sharing-task-arrays-formula-quick-check-practice-model" data-product={product} data-workers={workers} data-days={display(days)} data-share-state={shareState} data-workspace-state={workspaceState} data-practice-loaded={practiceLoaded} data-dragging={dragging} data-actions={actions}>
      <span className="sr-only">Concept trace: Inverse proportion product. Inverse proportion has constant product, so as one value increases the other decreases.</span>
      <nav className="inverse86-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>&gt;</span><b>86 Inverse Proportion</b></nav>
      <header className="inverse86-header"><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Inverse Proportion</h1><p>Understand reciprocal relationships.</p><nav><b>6-10 min</b><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><button type="button" onClick={openWorkspace}><PanelsTopLeft />Workspace</button></nav></header>
      <p className="inverse86-banner">workers&nbsp; x &nbsp;days&nbsp; = &nbsp;{product}</p>
      <main className="inverse86-workspace">
        <ConstantTable product={product} workers={workers} changeWorkers={changeWorkers} dropModel={dropModel} setDragging={setDragging} />
        <InverseGraph product={product} workers={workers} changeWorkers={changeWorkers} dropModel={dropModel} setDragging={setDragging} />
        <section className="inverse86-visual"><h2>Work-sharing visual</h2><p>Total work: {product} tasks</p><div><TaskArray workers={3} days={product / 3} product={product} active={workers === 3} color="purple" changeWorkers={changeWorkers} dropModel={dropModel} setDragging={setDragging} /><TaskArray workers={8} days={product / 8} product={product} active={workers === 8} color="cyan" changeWorkers={changeWorkers} dropModel={dropModel} setDragging={setDragging} /></div></section>
        <aside className="inverse86-side"><section className="inverse86-quick"><h2>Quick check</h2><label>Product (x x y)<input aria-label="Constant product" type="number" min="6" max="72" value={product} onChange={(event) => changeProduct(Number(event.target.value))} /></label><label><Users />Workers (x)<input aria-label="Current workers x" type="number" min="1" max="12" value={workers} onChange={(event) => changeWorkers(Number(event.target.value))} /></label><label><CalendarDays />Days (y)<input aria-label="Current days y" type="number" min="1" max="24" value={display(days)} onChange={(event) => changeDays(Number(event.target.value))} /></label></section><section className="inverse86-formula"><h2>Formula</h2><b>y = <span>{product}<i />x</span></b></section><p className="inverse86-idea"><BriefcaseBusiness /><span><b>Constant product: {product}</b>As one value increases,<br />the other decreases.</span></p><p className="inverse86-idea"><Users /><span><b>Inverse proportion</b>keeps xy constant.</span></p><button type="button" className="inverse86-try" onClick={loadPractice}><Lightbulb /><span><b>{practiceLoaded ? `Solved: y = ${display(days)}` : "Try this"}</b>Try: If xy = 36,<br />find y when x = 9.</span></button></aside>
      </main>
      <nav className="inverse86-navigation"><a href="/lessons/numbers-and-arithmetic/85-direct-proportion"><ArrowLeft /><span>Previous<b>Direct Proportion</b></span></a><button type="button" onClick={loadPractice}><FlaskConical />{practiceLoaded ? `Practice solved: ${display(days)}` : "Practice Lab"}</button><a href="/lessons/numbers-and-arithmetic/87-unit-rates"><span>Next<b>Unit Rates</b></span><ArrowRight /></a></nav>
    </div>
  );
}

function ConstantTable({ product, workers, changeWorkers, dropModel, setDragging }: { product: number; workers: number; changeWorkers: (value: number) => void; dropModel: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void }) {
  return <section className="inverse86-table"><h2>Constant product table</h2><p>Every pair keeps the product {product}.</p><div><header><b><Users />Workers (x)</b><b><CalendarDays />Days (y)</b><b>Product (x x y)</b></header>{[1, 2, 3, 4, 6, 8].map((x) => <p className={workers === x ? "active" : ""} key={x}><button type="button" draggable aria-label={`Inverse table workers ${x}`} onClick={() => changeWorkers(x)} onDragStart={(event) => { event.dataTransfer.setData("text/inverse-object", `table:${x}`); setDragging(`table:${x}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropModel(event, x)}>{x}</button><strong>{display(product / x)}</strong><b>{product}</b></p>)}</div></section>;
}

function InverseGraph({ product, workers, changeWorkers, dropModel, setDragging }: { product: number; workers: number; changeWorkers: (value: number) => void; dropModel: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void }) {
  const xAt = (x: number) => 38 + x * 34;
  const yAt = (x: number) => 284 - Math.min(245, (product / x) * 10.1);
  const path = Array.from({ length: 86 }, (_, index) => { const x = .5 + index / 10; return `${index ? "L" : "M"}${xAt(x)} ${yAt(x)}`; }).join(" ");
  return <section className="inverse86-graph"><h2>Inverse proportion graph</h2><p>Decreasing curve: y = {product}/x</p><div><svg viewBox="0 0 405 305" aria-label={`Inverse proportion graph y equals ${product} over x`}><path className="axis" d="M38 26V284H380M38 26l-4 9M38 26l4 9M380 284l-9-4M380 284l-9 4" /><path className="curve" d={path} /><g className="ticks">{[0,1,2,3,4,5,6,7,8,9].map((x) => <g key={`x${x}`}><line x1={xAt(x)} x2={xAt(x)} y1="280" y2="288"/><text x={xAt(x)-3} y="301">{x}</text></g>)}{[0,4,8,12,16,20,24].map((y) => <g key={`y${y}`}><line x1="34" x2="42" y1={284-y*10.1} y2={284-y*10.1}/><text x="13" y={288-y*10.1}>{y}</text></g>)}</g><text x="46" y="34">y (days)</text><text x="335" y="302">x (workers)</text></svg>{[2,3,4,8].map((x) => <button type="button" draggable className={workers === x ? "active" : ""} aria-label={`Inverse graph point ${x}`} style={{ left: xAt(x), top: yAt(x) }} onClick={() => changeWorkers(x)} onDragStart={(event) => { event.dataTransfer.setData("text/inverse-object", `graph:${x}`); setDragging(`graph:${x}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropModel(event, x)} key={x}><span>({x}, {display(product / x)})</span></button>)}<p>y = <span>{product}<i />x</span></p></div></section>;
}

function TaskArray({ workers, days, product, active, color, changeWorkers, dropModel, setDragging }: { workers: number; days: number; product: number; active: boolean; color: string; changeWorkers: (value: number) => void; dropModel: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void }) {
  const shownDays = Math.max(1, Math.round(days));
  return <section className={`${color} ${active ? "active" : ""}`}><h3>{workers} workers need {display(days)} days</h3><div className="people">{Array.from({ length: workers }, (_, index) => <UserRound key={index} />)}</div><div className="tasks" style={{ gridTemplateColumns: `repeat(${shownDays}, 1fr)` }}>{Array.from({ length: product }, (_, index) => <button type="button" draggable aria-label={`${workers}-worker task ${index + 1}`} onClick={() => changeWorkers(workers)} onDragStart={(event) => { event.dataTransfer.setData("text/inverse-object", `${workers}:${index + 1}`); setDragging(`${workers}:${index + 1}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropModel(event, workers)} key={index} />)}</div><div className="days">{Array.from({ length: shownDays }, (_, index) => <b key={index}>{index + 1}</b>)}</div><p>Days</p><strong>{display(days)}<small>days</small></strong></section>;
}
