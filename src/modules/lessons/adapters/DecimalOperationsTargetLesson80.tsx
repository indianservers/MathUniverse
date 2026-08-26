import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Check, Lightbulb, Sparkles } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./DecimalOperationsTargetLesson80.css";

type Operand = "first" | "second";
type Operation = "Add" | "Subtract";

function clamp(value: number) {
  return Math.max(0, Math.min(999, Math.round(Number.isFinite(value) ? value : 0)));
}

function decimal(value: number) {
  return (value / 100).toFixed(2);
}

function digits(value: number) {
  return [Math.floor(value / 100), Math.floor(value / 10) % 10, value % 10];
}

function words(value: number) {
  const [whole, tenths, hundredths] = digits(value);
  return `${whole} ${whole === 1 ? "whole" : "wholes"}, ${tenths} tenths, ${hundredths} hundredths`;
}

export default function DecimalOperationsTargetLesson80({ resetToken, onInteraction }: LessonAdapterProps) {
  const [first, setFirst] = useState(340);
  const [second, setSecond] = useState(125);
  const [operation, setOperation] = useState<Operation>("Add");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const result = operation === "Add" ? first + second : Math.max(0, first - second);
  const misaligned = operation === "Add" ? first + (second % 100) : Math.max(0, first - (second % 100));

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const change = (key: Operand, value: number) => {
    (key === "first" ? setFirst : setSecond)(clamp(value));
    setPracticeLoaded(false);
    act();
  };
  const reset = () => {
    setFirst(340);
    setSecond(125);
    setOperation("Add");
    setPracticeLoaded(false);
    setDragging("");
    setActions(0);
    onInteraction();
  };
  const swapDigits = (key: Operand, from: number, to: number) => {
    const next = digits(key === "first" ? first : second);
    [next[from], next[to]] = [next[to], next[from]];
    change(key, next[0] * 100 + next[1] * 10 + next[2]);
    setDragging("");
  };
  const dropDigit = (event: DragEvent<HTMLButtonElement>, key: Operand, to: number) => {
    event.preventDefault();
    const [sourceKey, sourceIndex] = event.dataTransfer.getData("text/decimal-digit").split(":");
    if (sourceKey === key) swapDigits(key, Number(sourceIndex), to);
  };
  const loadPractice = () => {
    setFirst(275);
    setSecond(60);
    setOperation("Add");
    setPracticeLoaded(true);
    act();
  };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="decimal80-page"
      data-testid="number-mockup-0062"
      data-dedicated-lesson="80"
      data-object-model="dual-editable-hundredths-aligned-place-columns-draggable-digits-base-ten-blocks-calculated-sum-misalignment-practice-model"
      data-first={decimal(first)}
      data-second={decimal(second)}
      data-operation={operation}
      data-result={decimal(result)}
      data-first-digits={digits(first).join(",")}
      data-second-digits={digits(second).join(",")}
      data-result-digits={digits(result).join(",")}
      data-misaligned={decimal(misaligned)}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Decimal-operation columns. Line up decimal points for addition and subtraction before combining digits with the same place value.</span>
      <nav className="decimal80-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>80 Decimal Operations</b></nav>

      <main className="decimal80-surface">
        <header><aside><small>NUMBERS AND ARITHMETIC</small><small>DECIMAL OPERATIONS</small></aside><h1>Decimal Operations</h1><p>Calculate with decimals.</p></header>
        <div className="decimal80-workspace">
          <section className="decimal80-left">
            <button type="button" className="decimal80-operation-title" onClick={() => { setOperation((current) => current === "Add" ? "Subtract" : "Add"); act(); }}>{operation}: {decimal(first)} {operation === "Add" ? "+" : "−"} {decimal(second)}</button>
            <section className="decimal80-algorithm">
              <h2>Line up decimal points</h2>
              <div className="decimal80-place-head"><b>Ones</b><b>Decimal<br />Point</b><b>Tenths</b><b>Hundredths</b></div>
              <DigitRow name="First" value={first} color="cyan" onDrop={dropDigit} onDrag={setDragging} />
              <span className="decimal80-sign">{operation === "Add" ? "+" : "−"}</span>
              <DigitRow name="Second" value={second} color="purple" onDrop={dropDigit} onDrag={setDragging} />
              <div className="decimal80-rule" />
              <div className="decimal80-result-row">{digits(result).map((digit, index) => <b key={index}>{index === 1 ? <><span>·</span>{digit}</> : digit}</b>)}</div>
              <output><Check />{decimal(result)}</output>
              <p>{words(result)}</p>
            </section>

            <section className="decimal80-block-proof">
              <h2>Visual with base-ten blocks</h2>
              <BlockRow label={decimal(first)} value={first} color="cyan" />
              <BlockRow label={decimal(second)} value={second} color="purple" />
              <ArrowRight className="decimal80-down" />
              <BlockRow label={decimal(result)} value={result} color="green" />
            </section>
            <button type="button" className="decimal80-practice" onClick={loadPractice}><Lightbulb /><b>{practiceLoaded ? `Solved: ${decimal(first)} + ${decimal(second)} = ${decimal(result)}` : "Try:"}</b><span>Add 2.75 + 0.6.</span></button>
          </section>

          <aside className="decimal80-right">
            <section className="decimal80-value cyan"><label>First value<input aria-label="First decimal value" inputMode="decimal" value={decimal(first)} onChange={(event) => change("first", Number(event.target.value) * 100)} /></label></section>
            <strong>{operation === "Add" ? "+" : "−"}</strong>
            <section className="decimal80-value purple"><label>Second value<input aria-label="Second decimal value" inputMode="decimal" value={decimal(second)} onChange={(event) => change("second", Number(event.target.value) * 100)} /></label></section>
            <hr />
            <section className="decimal80-value green"><label>{operation === "Add" ? "Sum" : "Difference"}<output>{decimal(result)}</output></label></section>
            <section className="decimal80-summary"><b>{words(result)}</b><MiniBlocks value={result} /></section>
            <section className="decimal80-mistake"><h3><AlertTriangle />Common mistake</h3><p>Decimal points must stay aligned.</p><div><b>Misaligned digits</b><span>{decimal(first)}</span><span>{operation === "Add" ? "+" : "−"} {decimal(second)}</span><i /><strong>{decimal(misaligned)}</strong><em>× Incorrect</em></div></section>
          </aside>
        </div>
      </main>

      <nav className="decimal80-navigation"><a href="/lessons/numbers-and-arithmetic/79-decimal-place-value"><ArrowLeft /><span>Previous<b>Decimal Place Value</b></span></a><a href="/lessons/numbers-and-arithmetic/81-subtract-decimals"><span>Next<b>Subtract Decimals</b></span><ArrowRight /></a></nav>
      <footer className="decimal80-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs">⚑ Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function DigitRow({ name, value, color, onDrop, onDrag }: { name: Operand extends never ? never : "First" | "Second"; value: number; color: string; onDrop: (event: DragEvent<HTMLButtonElement>, key: Operand, to: number) => void; onDrag: (value: string) => void }) {
  const key: Operand = name === "First" ? "first" : "second";
  return <div className={`decimal80-digit-row ${color}`}>{digits(value).map((digit, index) => <button type="button" draggable aria-label={`${name} decimal ${["ones", "tenths", "hundredths"][index]} digit ${digit}`} onDragStart={(event) => { event.dataTransfer.setData("text/decimal-digit", `${key}:${index}`); onDrag(`${key}:${index}`); }} onDragEnd={() => onDrag("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, key, index)} key={index}>{index === 1 ? <><span>·</span>{digit}</> : digit}</button>)}</div>;
}

function BlockRow({ label, value, color }: { label: string; value: number; color: string }) {
  const [whole, tenths, hundredths] = digits(value);
  return <article className={`decimal80-block-row ${color}`}><b>{label}</b><div><BlockGroup count={whole} kind="whole" /><span>+</span><BlockGroup count={tenths} kind="tenth" /><span>+</span><BlockGroup count={hundredths} kind="hundredth" /></div><footer><small>{whole} {whole === 1 ? "whole" : "wholes"}</small><small>{tenths} tenths</small><small>{hundredths} hundredths</small></footer></article>;
}

function BlockGroup({ count, kind }: { count: number; kind: "whole" | "tenth" | "hundredth" }) {
  return <div className={`decimal80-blocks ${kind}`} aria-label={`${count} ${kind} blocks`}>{Array.from({ length: count }, (_, index) => <i draggable key={index} aria-label={`${kind} block ${index + 1}`} />)}</div>;
}

function MiniBlocks({ value }: { value: number }) {
  const [whole, tenths, hundredths] = digits(value);
  return <div className="decimal80-mini"><span>{whole}</span><span>{tenths}</span><span>{hundredths}</span></div>;
}
