import { AlertTriangle, ArrowLeft, ArrowRight, Check, FlaskConical } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./FractionDecimalConversionTargetLesson81.css";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
}

function terminating(denominator: number) {
  let remaining = denominator;
  while (remaining % 2 === 0) remaining /= 2;
  while (remaining % 5 === 0) remaining /= 5;
  return remaining === 1;
}

function decimalText(numerator: number, denominator: number) {
  const value = numerator / denominator;
  if (terminating(denominator / gcd(numerator, denominator))) return String(Number(value.toFixed(4)));
  return `${value.toFixed(3)}…`;
}

function percentText(numerator: number, denominator: number) {
  return `${Number((numerator / denominator * 100).toFixed(1))}%`;
}

export default function FractionDecimalConversionTargetLesson81({ resetToken, onInteraction }: LessonAdapterProps) {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const value = numerator / denominator;
  const decimal = decimalText(numerator, denominator);
  const percent = percentText(numerator, denominator);
  const selectedCells = Math.round(value * 100);
  const reducedBy = gcd(numerator, denominator);
  const reducedNumerator = numerator / reducedBy;
  const reducedDenominator = denominator / reducedBy;
  const isTerminating = terminating(reducedDenominator);

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeNumerator = (next: number) => {
    setNumerator(clamp(next, 0, denominator));
    setPracticeLoaded(false);
    act();
  };
  const changeDenominator = (next: number) => {
    const valid = clamp(next, 1, 12);
    setDenominator(valid);
    setNumerator((current) => Math.min(current, valid));
    setPracticeLoaded(false);
    act();
  };
  const reset = () => {
    setNumerator(3);
    setDenominator(4);
    setPracticeLoaded(false);
    setDragging("");
    setActions(0);
    onInteraction();
  };
  const dropPart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    if (event.dataTransfer.getData("text/fraction-part")) changeNumerator(index);
    setDragging("");
  };
  const loadPractice = () => {
    setNumerator(7);
    setDenominator(8);
    setPracticeLoaded(true);
    act();
  };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="conversion81-page"
      data-testid="number-mockup-0063"
      data-dedicated-lesson="81"
      data-object-model="editable-reduced-fraction-division-trace-clickable-draggable-strip-hundred-grid-decimal-percent-number-line-terminating-practice-model"
      data-numerator={numerator}
      data-denominator={denominator}
      data-reduced={`${reducedNumerator}/${reducedDenominator}`}
      data-decimal={decimal}
      data-percent={percent}
      data-selected-cells={selectedCells}
      data-terminating={isTerminating}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Fraction-decimal bridge. Divide numerator by denominator to get decimal form. The value stays the same across forms.</span>
      <nav className="conversion81-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>81 Fractiondecimal Conversion</b></nav>

      <main className="conversion81-surface">
        <header><small>NUMBERS AND ARITHMETIC</small><h1>Fraction-Decimal Conversion</h1><p>Connect representations.</p><aside><Check /><b>The value stays the same<br />across forms.</b></aside></header>
        <div className="conversion81-workspace">
          <section className="conversion81-proof">
            <div className="conversion81-stages"><b>Fraction</b><ArrowRight /><b>Decimal</b><ArrowRight /><b>Percent</b></div>
            <section className="conversion81-fraction"><h2>Fraction: {numerator}/{denominator}</h2><div className="conversion81-strip" style={{ gridTemplateColumns: `repeat(${denominator}, 1fr)` }}>{Array.from({ length: denominator }, (_, index) => <button type="button" draggable className={index < numerator ? "selected" : ""} aria-label={`Fraction strip part ${index + 1}`} onClick={() => changeNumerator(index < numerator ? index : index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/fraction-part", String(index + 1)); setDragging(String(index + 1)); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropPart(event, index + 1)} key={index} />)}</div><div className="conversion81-fraction-input"><input aria-label="Fraction numerator" type="number" min="0" max={denominator} value={numerator} onChange={(event) => changeNumerator(Number(event.target.value))} /><i /><input aria-label="Fraction denominator" type="number" min="1" max="12" value={denominator} onChange={(event) => changeDenominator(Number(event.target.value))} /></div></section>
            <Division numerator={numerator} denominator={denominator} decimal={decimal} />
            <section className="conversion81-percent"><h2>{selectedCells} of 100 hundredths</h2><div>{Array.from({ length: 100 }, (_, index) => <button type="button" draggable aria-label={`Percent grid cell ${index + 1}`} className={index < selectedCells ? "selected" : ""} onClick={() => changeNumerator(Math.round((index + 1) / 100 * denominator))} key={index} />)}</div><b>{percent}</b></section>
            <section className="conversion81-equation"><b>{numerator}/{denominator}</b><ArrowRight /><b>{decimal}</b><ArrowRight /><b>{percent}</b><p><strong>{numerator}/{denominator}</strong> = {decimal}</p><p><strong>{decimal}</strong> = <em>{percent}</em></p></section>
            <NumberLine value={value} numerator={numerator} denominator={denominator} decimal={decimal} percent={percent} onChange={changeNumerator} />
          </section>

          <aside className="conversion81-side">
            <section className="conversion81-forms"><h2>Equivalent Forms</h2><p><b>Fraction</b><strong>{numerator}/{denominator}</strong></p><p><b>Division</b><strong>{numerator} ÷ {denominator} = {decimal}</strong></p><p><b>Decimal</b><strong>{decimal}</strong></p><p><b>Percent</b><strong>{percent}</strong></p></section>
            <section className="conversion81-misconception"><h2><AlertTriangle />Common Misconception</h2><p>Students may think the numerator and denominator switch when converting.<br /><b>Remember: Divide the numerator by the denominator,</b> not the other way around.</p></section>
            <section className="conversion81-practice"><h2><FlaskConical />Try It!</h2><p><b>{practiceLoaded ? `Solved: 7/8 = ${decimal}` : "Try:"}</b> Convert 7/8 to a decimal.</p><button type="button" onClick={loadPractice}>{practiceLoaded ? "Practice Loaded" : "Start Practice"}<ArrowRight /></button><small>{isTerminating ? "Terminating decimal" : "Recurring decimal"}</small></section>
          </aside>
        </div>
      </main>
      <nav className="conversion81-navigation"><a href="/lessons/numbers-and-arithmetic/80-decimal-operations"><ArrowLeft /><span>Previous<b>Decimal Operations</b></span></a><a href="/lessons/numbers-and-arithmetic/82-recurring-decimals"><span>Next<b>Recurring Decimals</b></span><ArrowRight /></a></nav>
    </div>
  );
}

function Division({ numerator, denominator, decimal }: { numerator: number; denominator: number; decimal: string }) {
  const digits = decimal.replace("…", "").split(".")[1] ?? "0";
  const firstProduct = Math.floor(numerator * 10 / denominator) * denominator;
  const firstRemainder = numerator * 10 - firstProduct;
  const secondProduct = Math.floor(firstRemainder * 10 / denominator) * denominator;
  const secondRemainder = firstRemainder * 10 - secondProduct;
  return <section className="conversion81-division"><h2>Divide numerator by denominator</h2><b>{decimal}</b><div><strong>{denominator})</strong><span>{numerator}.00</span><i /><span>− {firstProduct}</span><i /><span>{firstRemainder}0</span><span>− {secondProduct}</span><i /><span>{secondRemainder}</span></div><output>{numerator} ÷ {denominator} = {digits ? decimal : "0"}</output></section>;
}

function NumberLine({ value, numerator, denominator, decimal, percent, onChange }: { value: number; numerator: number; denominator: number; decimal: string; percent: string; onChange: (value: number) => void }) {
  const marker = Math.max(0, Math.min(100, value * 100));
  return <section className="conversion81-line"><h2>Number Line: Aligning {numerator}/{denominator}, {decimal}, and {percent}</h2><div><i />{Array.from({ length: 21 }, (_, index) => index * 5).map((tick) => <button type="button" aria-label={`Conversion number line ${tick / 100}`} style={{ left: `${tick}%` }} onClick={() => onChange(Math.round(tick / 100 * denominator))} key={tick} />)}<span className="marker" style={{ left: `${marker}%` }} /></div><footer><b style={{ left: `${marker}%` }}>{decimal}<br /><em>{numerator}/{denominator}</em>&nbsp;&nbsp;&nbsp; {percent}</b></footer></section>;
}
