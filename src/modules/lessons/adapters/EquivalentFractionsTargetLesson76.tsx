import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Eye,
  Lightbulb,
  Puzzle,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import type { LessonAdapterProps } from "../types";
import "./EquivalentFractionsTargetLesson76.css";
import "./EquivalentFractionsTargetLesson76Tuning.css";

const FACTORS = [1, 2, 3, 4];

function clamp(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export default function EquivalentFractionsTargetLesson76({ resetToken, onInteraction }: LessonAdapterProps) {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [factor, setFactor] = useState(2);
  const [tab, setTab] = useState("Interaction + visualization");
  const [dragging, setDragging] = useState("");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [actions, setActions] = useState(0);
  const scaledNumerator = numerator * factor;
  const scaledDenominator = denominator * factor;
  const value = numerator / denominator;
  const divisor = gcd(numerator, denominator);
  const decimal = Number(value.toFixed(3)).toString();

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeNumerator = (nextValue: number) => {
    setNumerator(clamp(nextValue, 1, denominator));
    setPracticeLoaded(false);
    act();
  };
  const changeDenominator = (nextValue: number) => {
    const next = clamp(nextValue, 2, 8);
    setDenominator(next);
    setNumerator((current) => Math.min(current, next));
    setPracticeLoaded(false);
    act();
  };
  const changeFactor = (nextValue: number) => {
    setFactor(clamp(nextValue, 1, 4));
    setPracticeLoaded(false);
    act();
  };
  const dropFactor = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const next = Number(event.dataTransfer.getData("text/equivalent-factor"));
    if (Number.isInteger(next)) changeFactor(next);
    setDragging("");
  };
  const reset = () => {
    setNumerator(3);
    setDenominator(4);
    setFactor(2);
    setTab("Interaction + visualization");
    setDragging("");
    setPracticeLoaded(false);
    setActions(0);
    onInteraction();
  };
  const loadPractice = () => {
    setNumerator(2);
    setDenominator(5);
    setFactor(2);
    setPracticeLoaded(true);
    act();
  };

  useEffect(() => {
    setNumerator(3);
    setDenominator(4);
    setFactor(2);
    setTab("Interaction + visualization");
    setDragging("");
    setPracticeLoaded(false);
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className="equivalent76-page"
      data-testid="number-mockup-0058"
      data-dedicated-lesson="76"
      data-object-model="editable-original-fraction-shared-draggable-scale-factor-linked-segmented-bars-number-lines-products-equivalence-practice-model"
      data-numerator={numerator}
      data-denominator={denominator}
      data-factor={factor}
      data-scaled-numerator={scaledNumerator}
      data-scaled-denominator={scaledDenominator}
      data-value={value.toFixed(4)}
      data-decimal={decimal}
      data-simplified={`${numerator / divisor}/${denominator / divisor}`}
      data-tab={tab}
      data-dragging={dragging}
      data-practice-loaded={practiceLoaded}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Equivalent-fraction scaling. Scale numerator and denominator by the same non-zero factor. Both fractions occupy the same number-line point.</span>
      <nav className="equivalent76-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>76 Equivalent Fractions</b></nav>

      <header className="equivalent76-hero">
        <div><aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside><h1>Equivalent Fractions</h1><p>Understand scaling equivalence.</p><nav><b>♙ Foundational–Intermediate</b><b>ϟ Concept + Manipulative</b><b>▣ Fractions, Decimals, Ratios and Percentages</b><b>◷ 6–10 min</b></nav></div>
      </header>

      <nav className="equivalent76-tabs" aria-label="Equivalent fractions lesson sections">
        {[["Interaction + visualization", <Eye key="eye" />], ["Explain", <BookOpen key="book" />], ["Examples", <Lightbulb key="light" />], ["Formulas", <span key="sum">Σ</span>], ["Know more", <Sparkles key="spark" />]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(String(label)); act(); }} key={String(label)}>{icon}{label}</button>)}
      </nav>

      <main className="equivalent76-layout">
        <section className="equivalent76-proof">
          <h2>Scale {numerator}/{denominator} to an equivalent fraction</h2>
          <p>We multiply the numerator and denominator by the <b>same</b> non-zero factor.</p>
          <FractionProofModel numerator={numerator} denominator={denominator} factor={factor} onNumerator={changeNumerator} onDropFactor={dropFactor} />
          <section className="equivalent76-result"><span className="check">✓</span><Fraction numerator={numerator} denominator={denominator} /><b>=</b><Fraction numerator={scaledNumerator} denominator={scaledDenominator} /><b>=</b><strong>{decimal}</strong></section>
        </section>

        <aside className="equivalent76-side">
          <section className="equivalent76-original"><h3>Original: {numerator}/{denominator}</h3><Fraction numerator={<input aria-label="Original numerator" type="number" min="1" max={denominator} value={numerator} onChange={(event) => changeNumerator(Number(event.target.value))} />} denominator={<input aria-label="Original denominator" type="number" min="2" max="8" value={denominator} onChange={(event) => changeDenominator(Number(event.target.value))} />} /><p>= {decimal}</p></section>
          <section className="equivalent76-scale"><h3>Scale by: {factor}</h3><p>Multiply numerator and denominator by the same non-zero factor.</p><button type="button" draggable aria-label={`Scale factor ${factor}; click to cycle or drag`} onClick={() => changeFactor(factor === 4 ? 1 : factor + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/equivalent-factor", String(factor)); setDragging("factor"); }} onDragEnd={() => setDragging("")}>{factor}</button><div>{FACTORS.map((item) => <button type="button" aria-label={`Set scale factor ${item}`} className={factor === item ? "active" : ""} onClick={() => changeFactor(item)} key={item}>{item}</button>)}</div></section>
          <section className="equivalent76-product numerator"><h3>{numerator} × {factor} = {scaledNumerator}</h3><p>Multiply the numerator.</p></section>
          <section className="equivalent76-product denominator"><h3>{denominator} × {factor} = {scaledDenominator}</h3><p>Multiply the denominator.</p></section>
          <section className="equivalent76-equivalent"><h3>Equivalent: {scaledNumerator}/{scaledDenominator}</h3><Fraction numerator={scaledNumerator} denominator={scaledDenominator} /><p>= {decimal}</p></section>
          <section className="equivalent76-insight"><h3>Same value,<br />more equal parts.</h3><p>The shaded length is unchanged even though the number of parts increases.</p><i>{Array.from({ length: 3 }, (_, index) => <span key={index} />)}</i></section>
          <button type="button" className="equivalent76-practice" onClick={loadPractice}><span><b>{practiceLoaded ? `Solved: 2/5 = 4/10` : "Try: Make an equivalent fraction for 2/5."}</b></span><Puzzle /></button>
        </aside>
      </main>

      <nav className="equivalent76-navigation"><a href="/lessons/numbers-and-arithmetic/75-fraction-models"><ArrowLeft /><span>PREVIOUS<b>Fraction Models</b></span></a><a href="/lessons/numbers-and-arithmetic/77-comparing-fractions"><span>NEXT<b>Comparing Fractions</b></span><ArrowRight /></a></nav>
      <footer className="equivalent76-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs"><Calculator /> Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
      <button type="button" className="equivalent76-reset" onClick={reset}>Reset model</button>
    </div>
  );
}

function Fraction({ numerator, denominator }: { numerator: ReactNode; denominator: ReactNode }) {
  return <span className="equivalent76-fraction"><b>{numerator}</b><i /><b>{denominator}</b></span>;
}

function FractionProofModel({ numerator, denominator, factor, onNumerator, onDropFactor }: { numerator: number; denominator: number; factor: number; onNumerator: (value: number) => void; onDropFactor: (event: DragEvent<HTMLElement>) => void }) {
  const scaledNumerator = numerator * factor;
  const scaledDenominator = denominator * factor;
  return <div className="equivalent76-model">
    <BarLabel kind="original" numerator={numerator} denominator={denominator} />
    <SegmentedBar numerator={numerator} denominator={denominator} color="cyan" onChoose={onNumerator} />
    <FractionLine numerator={numerator} denominator={denominator} color="cyan" onChoose={onNumerator} />
    <div className="equivalent76-arithmetic"><span><b>{numerator} × {factor} = {scaledNumerator}</b></span><span><b>{denominator} × {factor} = {scaledDenominator}</b></span></div>
    <div onDragOver={(event) => event.preventDefault()} onDrop={onDropFactor}><BarLabel kind="equivalent" numerator={scaledNumerator} denominator={scaledDenominator} /></div>
    <SegmentedBar numerator={scaledNumerator} denominator={scaledDenominator} color="purple" onChoose={(part) => onNumerator(Math.ceil(part / factor))} />
    <FractionLine numerator={scaledNumerator} denominator={scaledDenominator} color="purple" onChoose={(part) => onNumerator(Math.ceil(part / factor))} />
  </div>;
}

function BarLabel({ kind, numerator, denominator }: { kind: "original" | "equivalent"; numerator: number; denominator: number }) {
  return <h3 className={`equivalent76-bar-label ${kind}`}>{kind === "original" ? "Original" : "Equivalent"}: {numerator}/{denominator}</h3>;
}

function SegmentedBar({ numerator, denominator, color, onChoose }: { numerator: number; denominator: number; color: "cyan" | "purple"; onChoose: (part: number) => void }) {
  return <div className={`equivalent76-bar ${color}`} role="group" aria-label={`${numerator} of ${denominator} parts shaded`}>{Array.from({ length: denominator }, (_, index) => <button type="button" aria-label={`${color} bar part ${index + 1}`} className={`${index < numerator ? "selected" : ""}${index === numerator ? " boundary" : ""}`} onClick={() => onChoose(index < numerator ? Math.max(1, index) : index + 1)} key={index}><span>{index === 0 ? "0" : `${index}/${denominator}`}</span></button>)}</div>;
}

function FractionLine({ numerator, denominator, color, onChoose }: { numerator: number; denominator: number; color: "cyan" | "purple"; onChoose: (part: number) => void }) {
  return <div className={`equivalent76-line ${color}`}><i /><div>{Array.from({ length: denominator + 1 }, (_, index) => <button type="button" aria-label={`${color} number line ${index}/${denominator}`} className={index === numerator ? "active" : ""} onClick={() => onChoose(Math.max(1, index))} style={{ left: `${index / denominator * 100}%` }} key={index}><span>{index === 0 ? "0" : index === denominator ? "1" : `${index}/${denominator}`}</span></button>)}</div><button type="button" draggable aria-label={`${color} marker ${numerator}/${denominator}`} data-label={`${numerator}/${denominator}`} className="marker" style={{ left: `${valueToPercent(numerator, denominator)}%` }} onDragStart={(event) => event.dataTransfer.setData("text/fraction-marker", `${numerator}/${denominator}`)}>{numerator}/{denominator}</button></div>;
}

function valueToPercent(numerator: number, denominator: number) {
  return numerator / denominator * 100;
}
