import { ArrowLeft, ArrowRight, Check, Copy, Lightbulb, Pencil } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ProportionTargetLesson84.css";

function clamp(value: number, maximum = 30) {
  return Math.max(1, Math.min(maximum, Math.round(Number.isFinite(value) ? value : 1)));
}

function display(value: number) {
  return Number(value.toFixed(2)).toString();
}

export default function ProportionTargetLesson84({ resetToken, onInteraction }: LessonAdapterProps) {
  const [knownFirst, setKnownFirst] = useState(2);
  const [knownSecond, setKnownSecond] = useState(9);
  const [targetFirst, setTargetFirst] = useState(6);
  const [tab, setTab] = useState("Interaction + visualization");
  const [copyState, setCopyState] = useState("Copy");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const scale = targetFirst / knownFirst;
  const targetSecond = knownSecond * scale;
  const crossLeft = knownFirst * targetSecond;
  const crossRight = knownSecond * targetFirst;

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const change = (key: "knownFirst" | "knownSecond" | "targetFirst", value: number) => {
    if (key === "knownFirst") setKnownFirst(clamp(value, 12));
    if (key === "knownSecond") setKnownSecond(clamp(value));
    if (key === "targetFirst") setTargetFirst(clamp(value));
    setPracticeLoaded(false);
    act();
  };
  const reset = () => { setKnownFirst(2); setKnownSecond(9); setTargetFirst(6); setTab("Interaction + visualization"); setCopyState("Copy"); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const copy = async () => { try { await navigator.clipboard?.writeText(`${knownFirst}:${knownSecond} = ${targetFirst}:${display(targetSecond)}`); setCopyState("Copied"); } catch { setCopyState("Ready"); } act(); };
  const dropUnit = (event: DragEvent<HTMLButtonElement>, key: "knownFirst" | "knownSecond" | "targetFirst", value: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/proportion-unit")) change(key, value); setDragging(""); };
  const loadPractice = () => { setKnownFirst(4); setKnownSecond(7); setTargetFirst(12); setPracticeLoaded(true); act(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="proportion84-page"
      data-testid="number-mockup-0066"
      data-dedicated-lesson="84"
      data-object-model="editable-known-target-ratio-shared-scale-factor-draggable-tape-units-cross-product-step-summary-solved-value-practice-model"
      data-known-first={knownFirst}
      data-known-second={knownSecond}
      data-target-first={targetFirst}
      data-target-second={display(targetSecond)}
      data-scale={display(scale)}
      data-cross-left={display(crossLeft)}
      data-cross-right={display(crossRight)}
      data-tab={tab}
      data-copy-state={copyState}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Proportion equal-ratio check. Both ratios must scale by the same factor. Cross-products verify the same relationship.</span>
      <nav className="proportion84-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>84 Proportion</b></nav>
      <header className="proportion84-header"><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Proportion</h1><p>Solve equivalent-ratio problems.</p><nav><b>♙ Foundational–Intermediate</b><b>ϟ Concept + Manipulative</b><b>▣ Fractions, Decimals, Ratios and Percentages</b><b>◷ 6–10 min</b></nav></header>
      <nav className="proportion84-tabs">{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
      <main className="proportion84-workspace">
        <section className="proportion84-lab"><small>PROPORTION LAB</small><h2>{knownFirst} : {knownSecond} = {targetFirst} : x</h2><p>Both parts must scale by the same factor.</p><ScaleTable knownFirst={knownFirst} knownSecond={knownSecond} targetFirst={targetFirst} targetSecond={targetSecond} scale={scale} /><TapeProof knownFirst={knownFirst} knownSecond={knownSecond} targetFirst={targetFirst} targetSecond={targetSecond} scale={scale} change={change} dropUnit={dropUnit} setDragging={setDragging} /><CrossProof knownFirst={knownFirst} knownSecond={knownSecond} targetFirst={targetFirst} targetSecond={targetSecond} crossLeft={crossLeft} crossRight={crossRight} /></section>
        <aside className="proportion84-side"><section className="proportion84-summary"><h3>Problem summary<button type="button" aria-label="Copy proportion" onClick={() => void copy()}><Copy />{copyState === "Copy" ? "" : copyState}</button></h3><p><span>Known ratio</span><b><input aria-label="Known ratio first term" type="number" min="1" max="12" value={knownFirst} onChange={(event) => change("knownFirst", Number(event.target.value))} /> : <input aria-label="Known ratio second term" type="number" min="1" max="30" value={knownSecond} onChange={(event) => change("knownSecond", Number(event.target.value))} /></b></p><p><span>Target ratio</span><b><input aria-label="Target ratio first term" type="number" min="1" max="30" value={targetFirst} onChange={(event) => change("targetFirst", Number(event.target.value))} /> : x</b></p><p><span>Find</span><strong>x</strong></p></section><section className="proportion84-steps"><h3>Step-by-step summary</h3><p><i>1</i><span><b>Scale factor: {display(scale)}</b>{knownFirst} × {display(scale)} = {targetFirst}</span></p><p><i>2</i><span><b>Apply same factor to {knownSecond}</b>{knownSecond} × {display(scale)} = {display(targetSecond)}</span></p><p><i>3</i><span><b>x = {display(targetSecond)}</b></span></p></section><section className="proportion84-answer"><h3>Answer</h3><b>x = {display(targetSecond)} <Check /></b></section><section className="proportion84-misconception"><h3><Lightbulb />Common misconception</h3><p>Students sometimes multiply both parts by different numbers.<br />Remember: <b>both parts must scale by the same factor.</b></p></section><button type="button" className="proportion84-practice" onClick={loadPractice}><Pencil /><span><b>{practiceLoaded ? `Solved: x = ${display(targetSecond)}` : "Try this next!"}</b>Try: Solve 4/7 = 12/x.</span><ArrowRight /></button></aside>
      </main>
      <nav className="proportion84-navigation"><a href="/lessons/numbers-and-arithmetic/83-ratio-models"><ArrowLeft /><span>Previous<b>Ratio Models</b></span></a><a href="/lessons/numbers-and-arithmetic/85-direct-proportion"><span>Next<b>Direct Proportion</b></span><ArrowRight /></a></nav>
    </div>
  );
}

function ScaleTable({ knownFirst, knownSecond, targetFirst, targetSecond, scale }: { knownFirst: number; knownSecond: number; targetFirst: number; targetSecond: number; scale: number }) {
  return <section className="proportion84-scale"><h3><i>1</i>Scale the ratios</h3><div><header><b>Quantity</b><b>Known ratio ({knownFirst} : {knownSecond})</b><b>Scale factor</b><b>Scaled ratio ({targetFirst} : x)</b></header><p><span>First quantity</span><b>{knownFirst}</b><em>× {display(scale)} →</em><strong>{targetFirst}</strong></p><p><span>Second quantity</span><b>{knownSecond}</b><em>× {display(scale)} →</em><strong>{display(targetSecond)}</strong></p></div><footer><b>{knownFirst} × {display(scale)} = {targetFirst}</b><b>{knownSecond} × {display(scale)} = {display(targetSecond)}</b></footer></section>;
}

function TapeProof({ knownFirst, knownSecond, targetFirst, targetSecond, scale, change, dropUnit, setDragging }: { knownFirst: number; knownSecond: number; targetFirst: number; targetSecond: number; scale: number; change: (key: "knownFirst" | "knownSecond" | "targetFirst", value: number) => void; dropUnit: (event: DragEvent<HTMLButtonElement>, key: "knownFirst" | "knownSecond" | "targetFirst", value: number) => void; setDragging: (value: string) => void }) {
  const units = (key: "knownFirst" | "knownSecond" | "targetFirst", count: number, color: string, width: number, limit = count, labelKey = key, ghostCount = 0) => <div className={color} style={{ width }}>{Array.from({ length: Math.min(30, Math.round(count)) }, (_, index) => <button type="button" draggable aria-label={`${labelKey} tape unit ${index + 1}`} onClick={() => change(key, index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/proportion-unit", `${key}:${index + 1}`); setDragging(`${key}:${index + 1}`); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropUnit(event, key, Math.min(limit, index + 1))} key={index} />)}{Array.from({ length: ghostCount }, (_, index) => <span className="ghost" aria-hidden="true" key={`ghost-${index}`} />)}</div>;
  return <section className="proportion84-tapes"><h3><i>2</i>Visualize with tape diagrams</h3><div className="proportion84-tape-row"><b>First quantity</b>{units("knownFirst", knownFirst, "cyan", Math.min(360, Math.max(72, knownFirst * 72)), knownFirst, "knownFirst", Math.round(knownFirst))}<em>× {display(scale)} →</em>{units("targetFirst", targetFirst, "cyan", Math.min(360, Math.max(72, targetFirst * 36)))}<small>{knownFirst} units</small><small>{targetFirst} units</small></div><div className="proportion84-tape-row"><b>Second quantity</b>{units("knownSecond", knownSecond, "cyan", 160)}<em>× {display(scale)} →</em>{units("targetFirst", targetSecond, "purple", 395, targetFirst, "targetSecond")}<small>{knownSecond} units</small><small>{display(targetSecond)} units</small></div></section>;
}

function CrossProof({ knownFirst, knownSecond, targetFirst, targetSecond, crossLeft, crossRight }: { knownFirst: number; knownSecond: number; targetFirst: number; targetSecond: number; crossLeft: number; crossRight: number }) {
  return <section className="proportion84-cross"><h3><i>3</i>Cross-products (algebraic check)</h3><div><b>{knownFirst} × x = {knownSecond} × {targetFirst}</b><ArrowRight /><b>{knownFirst}x = {display(crossRight)}</b><ArrowRight /><strong>x = {display(targetSecond)} <Check /></strong></div><p><Check />Cross-check: {knownFirst} × {display(targetSecond)} = {knownSecond} × {targetFirst}<ArrowRight />{display(crossLeft)} = {display(crossRight)}<Check /></p></section>;
}
