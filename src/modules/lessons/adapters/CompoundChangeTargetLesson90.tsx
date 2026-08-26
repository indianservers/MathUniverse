import { ArrowLeft, Clock3, ExternalLink, Languages, Lightbulb, RotateCcw, Share2, TrendingUp, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./CompoundChangeTargetLesson90.css";

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
const display = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function CompoundChangeTargetLesson90({ resetToken, onInteraction }: LessonAdapterProps) {
  const [start, setStart] = useState(100);
  const [rate, setRate] = useState(10);
  const [stages, setStages] = useState(2);
  const [tab, setTab] = useState("Interaction + visualization");
  const [shareState, setShareState] = useState("Share");
  const [workspaceState, setWorkspaceState] = useState("closed");
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const multiplier = 1 + rate / 100;
  const values = useMemo(() => Array.from({ length: stages + 1 }, (_, index) => start * multiplier ** index), [start, multiplier, stages]);
  const final = values.at(-1) ?? start;
  const compound = ((final - start) / start) * 100;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeStart = (value: number) => { setStart(clamp(value, 10, 500)); act(); };
  const changeRate = (value: number) => { setRate(clamp(value, -30, 50)); act(); };
  const changeStages = (value: number) => { setStages(clamp(value, 1, 3)); act(); };
  const reset = () => { setStart(100); setRate(10); setStages(2); setTab("Interaction + visualization"); setShareState("Share"); setWorkspaceState("closed"); setDragging(""); setActions(0); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`${start} x ${display(multiplier)}^${stages} = ${display(final)} (${display(compound)}%)`); setShareState("Copied"); } catch { setShareState("Ready"); } act(); };
  const startDrag = (event: DragEvent<HTMLButtonElement>, stage: number) => { event.dataTransfer.setData("text/compound-stage", String(stage)); setDragging(`stage:${stage}`); };
  const dropStage = (event: DragEvent<HTMLButtonElement>, stage: number) => { event.preventDefault(); const source = Number(event.dataTransfer.getData("text/compound-stage")); if (Number.isFinite(source) && source !== stage) changeStages(clamp(stage, 1, 3)); setDragging(""); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = [
    { index: 0, label: "Start", base: values[0], next: values[1] ?? values[0], final: false },
    { index: 1, label: "After stage 1", base: values[1] ?? final, next: values[2] ?? final, final: stages === 1 },
    { index: stages, label: `After stage ${stages}`, base: final, next: final, final: true },
  ];
  return <div className="compound90-page" data-testid="number-mockup-0072" data-dedicated-lesson="90" data-object-model="editable-start-rate-stage-count-draggable-compound-bars-sequential-latest-base-formula-result-misconception-model" data-start={start} data-rate={rate} data-stages={stages} data-multiplier={display(multiplier)} data-final={display(final)} data-compound={display(compound)} data-tab={tab} data-share-state={shareState} data-workspace-state={workspaceState} data-dragging={dragging} data-actions={actions}>
    <span className="sr-only">Concept trace: Compound-change stages. Apply each percent change to the latest amount. Compound-change visuals preserve sequential bases.</span>
    <nav className="compound90-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>&gt;</span><b>90 Compound Change</b></nav>
    <header className="compound90-header" style={{ paddingLeft: 17 }}><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1 style={{ marginTop: 9 }}>Compound Change</h1><p>Understand repeated percentage effects.</p><div><b>Concept + Manipulative</b><b>Fractions, Decimals, Ratios and Percentages</b><b><Clock3 />6-10 min</b></div><nav><button type="button" onClick={act}><Languages />English (English)<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button><button type="button" onClick={() => { setWorkspaceState("open"); act(); }}><ExternalLink />Workspace</button></nav></header>
    <nav className="compound90-tabs" style={{ paddingLeft: 9 }}>{[["Interaction + visualization", "⊙"], ["Explain", "▣"], ["Examples", "♧"], ["Formulas", "Σ"], ["Know more", "✣"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}</nav>
    <main className="compound90-workspace"><section className="compound90-lab"><h2><strong>Compound Change Lab</strong></h2><p>See how two consecutive {rate}% {rate >= 0 ? "increases" : "decreases"} compound from the latest amount each time.</p><div className="compound90-stages">{rows.map((row, rowIndex) => <StageRow row={row} rowIndex={rowIndex} start={start} rate={rate} multiplier={multiplier} stages={stages} startDrag={startDrag} dropStage={dropStage} key={`${rowIndex}-${row.index}`} />)}<div className="compound90-latest"><LatestArrow top={0} /><p style={{ left: 29 }}>Each stage uses<br />the <b>latest</b><br />amount.</p><LatestArrow top={136} /></div></div><section className="compound90-insight"><Lightbulb /><p><b>The second {Math.abs(rate)}% is taken from {display(values[1] ?? start)}, not from {start}.</b><span>That&apos;s why the total {rate >= 0 ? "increase" : "decrease"} is {Math.abs(compound) > Math.abs(rate * stages) ? "more" : "different"} than {Math.abs(rate * stages)}%.</span></p></section></section><aside className="compound90-side"><section className="compound90-setup"><h2><strong>Set up your change</strong></h2><label>Start:<input aria-label="Compound starting amount" type="number" min="10" max="500" value={start} onChange={(event) => changeStart(Number(event.target.value))} /></label><label>Rate per stage:<select aria-label="Compound rate per stage" value={rate} onChange={(event) => changeRate(Number(event.target.value))}>{[-20,-10,5,10,20].map((value) => <option value={value} key={value}>{value > 0 ? "+" : ""}{value}%</option>)}</select></label><label>Number of stages:<select aria-label="Compound number of stages" value={stages} onChange={(event) => changeStages(Number(event.target.value))}>{[1,2,3].map((value) => <option value={value} key={value}>{value}</option>)}</select></label></section><section className="compound90-result"><h2><strong>Result</strong></h2><p>After {stages} stage{stages === 1 ? "" : "s"}</p><b>{display(final)}</b></section><section className="compound90-total"><p><b>Compound total:</b><strong>{display(Math.abs(compound))}%</strong></p><TrendingUp /></section><section className="compound90-warning"><h2><strong>Not {Math.abs(rate * stages)}%</strong></h2><TriangleAlert /><span aria-hidden="true" style={{ position: "absolute", top: 19, right: 24, color: "white", zIndex: 2, fontWeight: 900 }}>!</span><p>Two times {Math.abs(rate)}% is not {Math.abs(rate * stages)}%.<br />Because the second {Math.abs(rate)}%<br />is on a bigger base.</p></section></aside></main>
  </div>;
}

function LatestArrow({ top }: { top: number }) {
  return <i aria-hidden="true" style={{ position: "absolute", top, left: -1, width: 40, height: 66, borderTop: "3px solid #078c9f", borderRight: "3px solid #078c9f", borderRadius: "0 38px 0 0" }}><span style={{ position: "absolute", right: -8, bottom: -9, color: "#078c9f", fontSize: 15, fontStyle: "normal" }}>▼</span></i>;
}

type StageData = { index: number; label: string; base: number; next: number; final: boolean };
function StageRow({ row, rowIndex, start, rate, multiplier, stages, startDrag, dropStage }: { row: StageData; rowIndex: number; start: number; rate: number; multiplier: number; stages: number; startDrag: (event: DragEvent<HTMLButtonElement>, stage: number) => void; dropStage: (event: DragEvent<HTMLButtonElement>, stage: number) => void }) {
  const delta = row.next - row.base;
  return <article className={`compound90-stage ${row.final ? "final" : ""}`}><header><i>{rowIndex + 1}</i><p><b>{row.label}</b>{rowIndex > 0 && <span>({rate > 0 ? "+" : ""}{rate}%)</span>}</p></header><section className="compound90-bar" style={{ left: rowIndex === 0 ? 138 : 143, width: rowIndex === 0 ? 301 : 307 }}><button type="button" draggable aria-label={`Compound stage ${rowIndex + 1} amount bar`} onDragStart={(event) => startDrag(event, Math.max(1, row.index))} onDragEnd={() => undefined} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropStage(event, Math.max(1, row.index))}>{display(row.base)}</button>{!row.final && <button type="button" draggable aria-label={`Compound stage ${rowIndex + 1} change segment`} onDragStart={(event) => startDrag(event, Math.max(1, row.index + 1))}>{rate > 0 ? "+" : ""}{rate}%<small>({delta > 0 ? "+" : ""}{display(delta)})</small></button>}<small>0</small><b>{display(row.base)}</b>{!row.final && <em>{display(row.next)}</em>}</section><section className="compound90-equation">{row.final ? <><p><span>{start}</span> × ({multiplier.toFixed(2)})<sup>{stages}</sup> = <b>{display(row.base)}</b></p><small>Equivalent compound</small></> : <><p><span>{display(row.base)}</span> × {multiplier.toFixed(2)} = <b>{display(row.next)}</b></p><small>Base used: {display(row.base)}</small></>}</section></article>;
}
