import { ArrowLeft, ArrowRight, Check, Info, Lightbulb, Scale, Sparkles, Star, Tag } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./UnitRatesTargetLesson87.css";

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
const display = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function UnitRatesTargetLesson87({ resetToken, onInteraction }: LessonAdapterProps) {
  const [total, setTotal] = useState(300);
  const [units, setUnits] = useState(5);
  const [tab, setTab] = useState("Interaction + visualization");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const unitRate = total / units;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeTotal = (value: number) => { setTotal(clamp(value, 10, 999)); setPracticeLoaded(false); act(); };
  const changeUnits = (value: number) => { setUnits(clamp(value, 1, 9)); setPracticeLoaded(false); act(); };
  const reset = () => { setTotal(300); setUnits(5); setTab("Interaction + visualization"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const loadPractice = () => { setTotal(450); setUnits(9); setPracticeLoaded(true); act(); };
  const dropBag = (event: DragEvent<HTMLButtonElement>, value: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/unit-rate-bag")) changeUnits(value); setDragging(""); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="unit87-page" data-testid="number-mockup-0069" data-dedicated-lesson="87" data-object-model="editable-total-unit-count-draggable-rice-bags-equal-sharing-cards-unit-rate-table-double-number-line-practice-model" data-total={total} data-units={units} data-unit-rate={display(unitRate)} data-tab={tab} data-practice-loaded={practiceLoaded} data-dragging={dragging} data-actions={actions}>
      <span className="sr-only">Concept trace: Unit-rate per-one model. Divide by the number of units to find per one, the amount for exactly one unit.</span>
      <nav className="unit87-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>&gt;</span><b>Unit Rates</b></nav>
      <header className="unit87-header"><h1>Unit Rates</h1><p>Compare per-unit quantities.</p><nav><b>Foundational-Intermediate</b><b>Concept + Manipulative</b><b>Unit Rates</b><b>6-10 min</b></nav></header>
      <nav className="unit87-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
      <main className="unit87-workspace">
        <section className="unit87-lab"><h2>Let's find the cost per 1 kg.</h2><p>We have {units} identical bags of 1 kg each. The total cost is {total} rupees.</p><BagRow units={units} changeUnits={changeUnits} dropBag={dropBag} setDragging={setDragging} /><p className="unit87-total">Total cost: {total} rupees</p><p className="unit87-divide">Divide equally by {units}</p><ShareCards units={units} rate={unitRate} /><p className="unit87-equation"><b>{total}</b><span>÷</span><strong>{units}</strong><span>=</span><em>{display(unitRate)}</em></p><p className="unit87-result"><Check />Unit rate: {display(unitRate)} <small>per kg</small></p><p className="unit87-insight"><Lightbulb />1 kg costs {display(unitRate)}</p><ComparisonTable rate={unitRate} /><DoubleLine rate={unitRate} /></section>
        <aside className="unit87-side"><section className="cost"><Tag /><label>Total cost:<input aria-label="Total cost rupees" type="number" min="10" max="999" value={total} onChange={(event) => changeTotal(Number(event.target.value))} /></label></section><section className="units"><Scale /><label><span>Units:</span><b><input aria-label="Number of kilograms" type="number" min="1" max="9" value={units} onChange={(event) => changeUnits(Number(event.target.value))} /> kg</b></label></section><section className="per"><b className="unit87-per-badge">PER<br />ONE</b><p><span>Per one:</span><b>{display(unitRate)}</b>rupees per kg</p></section><section className="explain"><p><Info /><b>Divide by the number of<br />units to find per one.</b></p><p>Per one means for<br />exactly 1 unit.</p><hr /><button type="button" onClick={loadPractice}><Star /><span><b>{practiceLoaded ? `Solved: ${display(unitRate)} per kg` : "Try:"}</b>450 rupees for 9 kg.</span></button></section></aside>
      </main>
      <nav className="unit87-navigation"><a href="/lessons/numbers-and-arithmetic/86-inverse-proportion"><ArrowLeft /><span>PREVIOUS<b>Inverse Proportion</b></span></a><a href="/lessons/numbers-and-arithmetic/88-percentages"><span>NEXT<b>Percentages</b></span><ArrowRight /></a></nav>
      <footer className="unit87-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function BagRow({ units, changeUnits, dropBag, setDragging }: { units: number; changeUnits: (value: number) => void; dropBag: (event: DragEvent<HTMLButtonElement>, value: number) => void; setDragging: (value: string) => void }) {
  return <div className="unit87-bags" style={{ gridTemplateColumns: `repeat(${units}, 1fr)` }}>{Array.from({ length: units }, (_, index) => <button type="button" draggable aria-label={`Rice bag ${index + 1}`} onClick={() => changeUnits(index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/unit-rate-bag", String(index + 1)); setDragging(`bag:${index + 1}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropBag(event, index + 1)} key={index}><img src="/assets/lessons/unit-rates-rice-bag.png" alt="" /></button>)}</div>;
}

function ShareCards({ units, rate }: { units: number; rate: number }) {
  return <div className="unit87-shares" style={{ gridTemplateColumns: `repeat(${units}, 1fr)` }}>{Array.from({ length: units }, (_, index) => <button type="button" aria-label={`Equal share ${index + 1}`} key={index}><b>{display(rate)}</b><span>rupees</span><small>for 1 kg</small></button>)}</div>;
}

function ComparisonTable({ rate }: { rate: number }) {
  return <section className="unit87-table"><h3>Compare more amounts</h3><div><header><b>Kilograms (kg)</b><b>Calculation</b><b>Total cost (rupees)</b></header>{[1, 2, 3, 5].map((kg) => <p key={kg}><span>{kg} kg</span><span>{display(rate)} x {kg}</span><b>{display(rate * kg)}</b></p>)}</div></section>;
}

function DoubleLine({ rate }: { rate: number }) {
  return <section className="unit87-line"><h3>See it on a double number line</h3><div className="kg"><b>Kilograms (kg)</b><i />{[0,1,2,3,4,5].map((value) => <span style={{ left: `${value * 20}%` }} key={value}>{value}</span>)}</div><div className="money"><b>Rupees</b><i />{[0,1,2,3,4,5].map((value) => <span style={{ left: `${value * 20}%` }} key={value}>{display(rate * value)}</span>)}</div><p><Check />Each step of 1 kg adds {display(rate)} rupees.</p></section>;
}
