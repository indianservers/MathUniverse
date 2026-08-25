import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Lightbulb,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import type { LessonAdapterProps } from "../types";
import "./ContinuedFractionsTargetLesson74.css";
import "./ContinuedFractionsTargetLesson74Tuning.css";

type Rational = { numerator: number; denominator: number };

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function rational(numerator: number, denominator: number): Rational {
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
}

function convergent(terms: number[]): Rational {
  let value = rational(terms.at(-1) ?? 1, 1);
  for (let index = terms.length - 2; index >= 0; index -= 1) {
    value = rational(terms[index] * value.numerator + value.denominator, value.numerator);
  }
  return value;
}

function clampTerm(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(9, Math.round(value)));
}

function fractionText(value: Rational) {
  return value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;
}

export default function ContinuedFractionsTargetLesson74({ resetToken, onInteraction }: LessonAdapterProps) {
  const [terms, setTerms] = useState([1, 2, 3]);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [tab, setTab] = useState("Inside-Out Evaluation");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [actions, setActions] = useState(0);
  const convergents = useMemo(() => terms.map((_, index) => convergent(terms.slice(0, index + 1))), [terms]);
  const finalValue = convergents[2];
  const decimal = finalValue.numerator / finalValue.denominator;
  const inner = rational(1, terms[2]);
  const middle = rational(terms[1] * terms[2] + 1, terms[2]);

  const act = () => { setActions((value) => value + 1); onInteraction(); };
  const changeTerm = (index: number, value: number) => {
    const next = clampTerm(value);
    setTerms((current) => current.map((term, currentIndex) => currentIndex === index ? next : term));
    setSelectedIndex(index);
    setPracticeLoaded(false);
    act();
  };
  const dropTerm = (event: DragEvent<HTMLButtonElement>, targetIndex: number) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/partial-index");
    const sourceIndex = raw === "" ? dragIndex : Number(raw);
    if (sourceIndex === null || !Number.isInteger(sourceIndex)) return;
    setTerms((current) => {
      const next = [...current];
      [next[sourceIndex], next[targetIndex]] = [next[targetIndex], next[sourceIndex]];
      return next;
    });
    setSelectedIndex(targetIndex);
    setDragIndex(null);
    setPracticeLoaded(false);
    act();
  };
  const loadPractice = () => {
    setTerms([2, 1, 4]);
    setSelectedIndex(2);
    setActiveStep(1);
    setPracticeLoaded(true);
    act();
  };
  useEffect(() => {
    setTerms([1, 2, 3]);
    setSelectedIndex(2);
    setDragIndex(null);
    setActiveStep(1);
    setTab("Inside-Out Evaluation");
    setPracticeLoaded(false);
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className="continued74-page"
      data-testid="number-mockup-0056"
      data-dedicated-lesson="74"
      data-object-model="editable-draggable-partial-quotients-exact-rational-inside-out-layers-convergents-decimal-number-line-practice-model"
      data-terms={terms.join(",")}
      data-selected-index={selectedIndex}
      data-drag-index={dragIndex ?? ""}
      data-inner={fractionText(inner)}
      data-middle={fractionText(middle)}
      data-convergents={convergents.map(fractionText).join(",")}
      data-result={fractionText(finalValue)}
      data-decimal={decimal.toFixed(3)}
      data-active-step={activeStep}
      data-tab={tab}
      data-practice-loaded={practiceLoaded}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Nested-fraction layers. Evaluate nested fractions from inside outward. Each prefix creates an exact convergent.</span>
      <nav className="continued74-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>5 Continued Fractions</b></nav>

      <header className="continued74-hero">
        <div><small>NUMBERS AND ARITHMETIC</small><h1>Continued Fractions</h1><p>Explore nested fraction representations.</p><aside><b>▣ Foundation-Intermediate</b><b>◷ 6-10 min</b></aside></div>
        <section><h2>[{terms[0]}; &nbsp;{terms[1]}, &nbsp;{terms[2]}]</h2><p>{terms[0]} + 1/({terms[1]} + 1/{terms[2]})</p></section>
      </header>
      <nav className="continued74-tabs" aria-label="Continued fractions lesson sections">
        {[["Inside-Out Evaluation", "⊙"], ["Steps", "▣"], ["Number Line", "✣"], ["About Continued Fractions", "ⓘ"]].map(([label, icon]) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{icon}</span>{label}</button>)}
      </nav>

      <main className="continued74-layout">
        <section className="continued74-proof">
          <h2>Evaluate the deepest fraction first.</h2>
          <StepRail activeStep={activeStep} onChoose={(step) => { setActiveStep(step); act(); }} terms={terms} />
          <section className={`continued74-nested ${activeStep === 1 ? "active" : ""}`} onClick={() => { setActiveStep(1); act(); }}>
            <span>{terms[0]} +</span><Fraction numerator="1" denominator={<>{terms[1]} + <Fraction numerator="1" denominator={terms[2]} /></>} />
            <div><span>{terms[1]} +</span><Fraction numerator="1" denominator={terms[2]} emphasis /></div>
          </section>
          <strong className="continued74-inner-result">= <Fraction numerator="1" denominator={terms[2]} /></strong>
          <button type="button" className={`continued74-middle ${activeStep === 2 ? "active" : ""}`} onClick={() => { setActiveStep(2); act(); }}>
            <span>{terms[1]} +</span><Fraction numerator="1" denominator={terms[2]} /><i>=</i><Fraction numerator={middle.numerator} denominator={middle.denominator} />
          </button>
          <strong className="continued74-middle-result">= <Fraction numerator={middle.numerator} denominator={middle.denominator} /></strong>
          <button type="button" className={`continued74-outer ${activeStep === 3 ? "active" : ""}`} onClick={() => { setActiveStep(3); act(); }}>
            <span>{terms[0]} +</span><Fraction numerator={middle.denominator} denominator={middle.numerator} /><i>=</i><Fraction numerator={finalValue.numerator} denominator={finalValue.denominator} success />
          </button>
          <strong className="continued74-outer-result">= <Fraction numerator={finalValue.numerator} denominator={finalValue.denominator} success /></strong>
          <p className="continued74-final">{fractionText(finalValue)} ≈ {decimal.toFixed(3)}</p>
        </section>

        <aside className="continued74-side">
          <section className="continued74-partials"><h3>Partial Quotients</h3><p>The entries of the continued fraction.</p><div>{terms.map((term, index) => <label key={index}><button type="button" draggable aria-label={`Partial quotient ${index}: ${term}`} className={selectedIndex === index ? "selected" : ""} onClick={() => setSelectedIndex(index)} onDragStart={(event) => { event.dataTransfer.setData("text/partial-index", String(index)); setDragIndex(index); }} onDragEnd={() => setDragIndex(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropTerm(event, index)}><input aria-label={`Edit partial quotient ${index}`} type="number" min="1" max="9" value={term} onChange={(event) => changeTerm(index, Number(event.target.value))} /></button><span>a<sub>{index}</sub></span></label>)}</div></section>
          <section className="continued74-convergents"><h3>Convergents</h3><p>Convergents: &nbsp;{convergents.map(fractionText).join(",  ")}</p><div>{convergents.map((value, index) => <article key={index}><b>{index + 1}</b><strong>{fractionText(value)}</strong><span>≈ {(value.numerator / value.denominator).toFixed(3)}</span>{index < 2 ? <i>↓</i> : null}</article>)}</div></section>
          <section className="continued74-decimal"><h3>Decimal Value</h3><p>{fractionText(finalValue)} ≈ {decimal.toFixed(3)}</p></section>
          <section className="continued74-warning"><TriangleAlert /><div><h3>Common Misconception</h3><p>Do not add the numbers directly ({terms.join(" + ")} ≠ {fractionText(finalValue)}). Evaluate from the inside out.</p></div></section>
          <button type="button" className="continued74-try" onClick={loadPractice}><Lightbulb /><span>{practiceLoaded ? `[2; 1, 4] = ${fractionText(finalValue)}` : "Try: Evaluate [2; 1, 4]."}</span><ArrowRight /></button>
        </aside>
      </main>

      <section className="continued74-number-line"><h2>Number Line</h2><p>Locate the value of {fractionText(finalValue)}.</p><FractionNumberLine value={decimal} label={`${fractionText(finalValue)} ≈ ${decimal.toFixed(3)}`} /></section>
      <nav className="continued74-navigation"><a href="/lessons/numbers-and-arithmetic"><ArrowLeft /><span>PREVIOUS<b>Number Theory</b><small>Explore primes and divisibility.</small></span></a><a href="/math-lab/continued-fractions"><span>NEXT<b>Infinite Continued Fractions</b><small>Explore periodic continued fractions.</small></span><ArrowRight /></a></nav>
      <footer className="continued74-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs"><Calculator /> Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function Fraction({ numerator, denominator, emphasis, success }: { numerator: ReactNode; denominator: ReactNode; emphasis?: boolean; success?: boolean }) {
  return <span className={`continued74-fraction${emphasis ? " emphasis" : ""}${success ? " success" : ""}`}><b>{numerator}</b><i /><b>{denominator}</b></span>;
}

function StepRail({ activeStep, onChoose, terms }: { activeStep: number; onChoose: (step: number) => void; terms: number[] }) {
  const items = [["Deepest", `Evaluate 1/${terms[2]}`], ["Middle", `Evaluate ${terms[1]} + 1/${terms[2]}`], ["Outer", `Evaluate ${terms[0]} + 1/(${terms[1] * terms[2] + 1}/${terms[2]})`]];
  return <aside className="continued74-step-rail">{items.map(([label, detail], index) => <button type="button" className={activeStep === index + 1 ? "active" : ""} onClick={() => onChoose(index + 1)} key={label}><b>{index + 1}</b><span><strong>{label}</strong><small>{detail}</small></span></button>)}</aside>;
}

function FractionNumberLine({ value, label }: { value: number; label: string }) {
  const left = 29 + ((value - 1) / .7) * 738;
  return <svg viewBox="0 0 820 75" role="img" aria-label={`Number line point ${label}`}><line x1="28" y1="43" x2="790" y2="43" />{Array.from({ length: 7 }, (_, index) => { const x = 45 + index * 111; return <g key={index}><line x1={x} x2={x} y1="37" y2="49" /><text x={x} y="69">{(1 + index / 10).toFixed(1)}</text></g>; })}<path d={`M${left} 12 v24`} /><circle cx={left} cy="43" r="6" /><g className="label"><rect x={left - 49} y="0" width="98" height="31" rx="7" /><text x={left} y="20">{label}</text></g></svg>;
}
