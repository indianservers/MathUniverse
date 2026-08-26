import { AlertCircle, ArrowLeft, ArrowRight, FlaskConical, Info, RotateCw } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./RecurringDecimalsTargetLesson82.css";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, Math.round(Number.isFinite(value) ? value : minimum)));
}

function divide(numerator: number, denominator: number) {
  const integer = Math.floor(numerator / denominator);
  let remainder = numerator % denominator;
  const seen = new Map<number, number>();
  const digits: number[] = [];
  const remainders: number[] = [];
  while (remainder !== 0 && !seen.has(remainder) && digits.length < 12) {
    seen.set(remainder, digits.length);
    remainders.push(remainder);
    const carried = remainder * 10;
    digits.push(Math.floor(carried / denominator));
    remainder = carried % denominator;
  }
  const repeatStart = remainder === 0 ? -1 : (seen.get(remainder) ?? 0);
  const prefix = digits.slice(0, repeatStart < 0 ? digits.length : repeatStart).join("");
  const cycle = repeatStart < 0 ? "" : digits.slice(repeatStart).join("");
  const exact = cycle ? `${integer}.${prefix}${cycle.repeat(3)}…` : `${integer}.${digits.join("") || "0"}`;
  return { integer, digits, remainders, repeatStart, prefix, cycle, exact, recurring: Boolean(cycle) };
}

export default function RecurringDecimalsTargetLesson82({ resetToken, onInteraction }: LessonAdapterProps) {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(3);
  const [visibleRepeats, setVisibleRepeats] = useState(4);
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const model = useMemo(() => divide(numerator, denominator), [numerator, denominator]);
  const repeatedRemainder = model.remainders[model.repeatStart < 0 ? model.remainders.length - 1 : model.repeatStart] ?? 0;
  const carried = repeatedRemainder * 10;
  const repeatDigit = model.cycle[0] ?? model.digits.at(-1)?.toString() ?? "0";
  const product = Number(repeatDigit) * denominator;
  const nextRemainder = carried - product;

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeNumerator = (value: number) => { setNumerator(clamp(value, 1, denominator - 1 || 1)); setPracticeLoaded(false); act(); };
  const changeDenominator = (value: number) => { const next = clamp(value, 2, 12); setDenominator(next); setNumerator((current) => Math.min(current, next - 1)); setPracticeLoaded(false); act(); };
  const reset = () => { setNumerator(1); setDenominator(3); setVisibleRepeats(4); setPracticeLoaded(false); setDragging(""); setActions(0); onInteraction(); };
  const loadPractice = () => { setNumerator(2); setDenominator(3); setVisibleRepeats(4); setPracticeLoaded(true); act(); };
  const dropRepeat = (event: DragEvent<HTMLButtonElement>, count: number) => { event.preventDefault(); if (event.dataTransfer.getData("text/repeat-tile")) { setVisibleRepeats(count); act(); } setDragging(""); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="recurring82-page"
      data-testid="number-mockup-0064"
      data-dedicated-lesson="82"
      data-object-model="editable-fraction-long-division-remainder-cycle-detection-draggable-repeat-tiles-exact-overbar-rounded-warning-practice-model"
      data-numerator={numerator}
      data-denominator={denominator}
      data-decimal={model.exact}
      data-cycle={model.cycle}
      data-repeat-start={model.repeatStart}
      data-remainders={model.remainders.join(",")}
      data-recurring={model.recurring}
      data-visible-repeats={visibleRepeats}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Recurring remainder loop. A repeating remainder creates a recurring decimal. A repeated remainder creates a recurring decimal.</span>
      <nav className="recurring82-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>Recurring Decimals</b></nav>
      <main className="recurring82-surface">
        <header><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Recurring Decimals</h1><p>Understand repeating patterns.</p><nav><b>ϟ Concept + Manipulative</b><b>♧ Interactive</b><b>◷ 8–12 min</b></nav></header>
        <div className="recurring82-workspace">
          <section className="recurring82-main">
            <LongDivision numerator={numerator} denominator={denominator} model={model} visibleRepeats={visibleRepeats} setVisibleRepeats={setVisibleRepeats} setDragging={setDragging} dropRepeat={dropRepeat} />
            <RemainderLoop remainder={repeatedRemainder} carried={carried} product={product} nextRemainder={nextRemainder} denominator={denominator} digit={repeatDigit} />
          </section>
          <aside className="recurring82-side">
            <section className="recurring82-fraction"><label>Fraction: {numerator}/{denominator}<span><input aria-label="Recurring decimal numerator" type="number" min="1" max={denominator - 1} value={numerator} onChange={(event) => changeNumerator(Number(event.target.value))} /><i /><input aria-label="Recurring decimal denominator" type="number" min="2" max="12" value={denominator} onChange={(event) => changeDenominator(Number(event.target.value))} /></span></label><b>{numerator} ÷ {denominator} = {model.exact}</b></section>
            <section className="recurring82-facts"><p><strong>{repeatDigit}</strong><span><b>Repeating digit: {repeatDigit}</b>The digit {repeatDigit} repeats forever.</span></p><p><RotateCw /><span><b>Remainder repeats: {repeatedRemainder}</b>The remainder {repeatedRemainder} appears again and again.</span></p></section>
            <section className="recurring82-exact"><b>Exact form: <span>0.{model.cycle ? model.cycle.repeat(3) : model.digits.join("")}</span>…</b><p>Use a bar to show the repeating digit.</p></section>
            <section className="recurring82-warning"><b>Rounded display is not<br />the exact value.</b><AlertCircle /></section>
            <section className="recurring82-info"><Info /><b>A repeated remainder creates<br />a recurring decimal.</b></section>
            <button type="button" className="recurring82-practice" onClick={loadPractice}><FlaskConical /><b>{practiceLoaded ? `Solved: 2/3 = ${model.exact}` : "Try:"}</b><span>Convert 2/3.</span><ArrowRight /></button>
          </aside>
        </div>
      </main>
      <nav className="recurring82-navigation"><a href="/lessons/numbers-and-arithmetic/81-fractiondecimal-conversion"><ArrowLeft /><span>Previous<b>Fraction–Decimal Conversion</b></span></a><a href="/lessons/numbers-and-arithmetic/83-ratio-models"><span>Next<b>Ratio Models</b></span><ArrowRight /></a></nav>
    </div>
  );
}

type DivisionModel = ReturnType<typeof divide>;

function LongDivision({ numerator, denominator, model, visibleRepeats, setVisibleRepeats, setDragging, dropRepeat }: { numerator: number; denominator: number; model: DivisionModel; visibleRepeats: number; setVisibleRepeats: (value: number) => void; setDragging: (value: string) => void; dropRepeat: (event: DragEvent<HTMLButtonElement>, count: number) => void }) {
  const digit = model.cycle[0] ?? model.digits[0]?.toString() ?? "0";
  const remainder = model.remainders[0] ?? 0;
  const carried = remainder * 10;
  const product = Number(digit) * denominator;
  const columnLeft = [75, 140, 211, 275];
  return <section className="recurring82-division"><h2>Long division: {numerator}.000 ÷ {denominator}</h2><div className="recurring82-decimal"><b>{model.integer} .</b>{Array.from({ length: 3 }, (_, index) => <strong className="active" key={index}>{digit}</strong>)}<span>•••</span></div><div className="recurring82-working"><b>{denominator}</b><i /><strong>{numerator} . 0 0 0 0 0 0 •••</strong><span>− 0</span><em />{Array.from({ length: visibleRepeats }, (_, index) => <article style={{ left: `${columnLeft[index] ?? 275 + (index - 3) * 64}px` }} key={index}><small>↓</small><b>{carried}</b><span>− {product}</span><i /><em>{remainder}</em><button type="button" draggable aria-label={`Repeating digit tile ${index + 1}`} onClick={() => setVisibleRepeats(index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/repeat-tile", String(index + 1)); setDragging(String(index + 1)); }} onDragEnd={() => setDragging("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropRepeat(event, index + 1)}>{digit}</button></article>)}</div></section>;
}

function RemainderLoop({ remainder, carried, product, nextRemainder, denominator, digit }: { remainder: number; carried: number; product: number; nextRemainder: number; denominator: number; digit: string }) {
  return <section className="recurring82-loop"><h2>Remainder loop</h2><div className="recurring82-loop-arrow">↶</div><article><small>Remainder</small><b>{remainder}</b></article><ArrowRight /><article><small>Bring down 0</small><b>{carried}</b></article><ArrowRight /><article><small>Subtract {product} ({denominator} × {digit})</small><b>{product}</b></article><ArrowRight /><article><small>Remainder</small><b>{nextRemainder}</b></article><p>The remainder {remainder} repeats,<br />so the steps repeat.</p></section>;
}
