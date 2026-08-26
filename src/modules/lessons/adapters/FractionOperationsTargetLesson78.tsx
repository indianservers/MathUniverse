import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Calculator, Check, Sparkles } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./FractionOperationsTargetLesson78.css";
import "./FractionOperationsTargetLesson78Tuning.css";

type FractionValue = { numerator: number; denominator: number };
type Operation = "Add" | "Subtract" | "Multiply" | "Divide";
const OPERATIONS: Operation[] = ["Add", "Subtract", "Multiply", "Divide"];

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function lcm(left: number, right: number) {
  return Math.abs(left * right) / gcd(left, right);
}

function reduce(numerator: number, denominator: number): FractionValue {
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
}

function clamp(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

export default function FractionOperationsTargetLesson78({ resetToken, onInteraction }: LessonAdapterProps) {
  const [first, setFirst] = useState<FractionValue>({ numerator: 1, denominator: 2 });
  const [second, setSecond] = useState<FractionValue>({ numerator: 1, denominator: 3 });
  const [operation, setOperation] = useState<Operation>("Add");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const commonDenominator = lcm(first.denominator, second.denominator);
  const convertedFirst = first.numerator * commonDenominator / first.denominator;
  const convertedSecond = second.numerator * commonDenominator / second.denominator;
  const rawResult = operation === "Add"
    ? { numerator: convertedFirst + convertedSecond, denominator: commonDenominator }
    : operation === "Subtract"
      ? { numerator: convertedFirst - convertedSecond, denominator: commonDenominator }
      : operation === "Multiply"
        ? { numerator: first.numerator * second.numerator, denominator: first.denominator * second.denominator }
        : { numerator: first.numerator * second.denominator, denominator: first.denominator * second.numerator };
  const result = reduce(rawResult.numerator, rawResult.denominator);
  const symbol = operation === "Add" ? "+" : operation === "Subtract" ? "−" : operation === "Multiply" ? "×" : "÷";
  const stepTwoTitle = operation === "Add" || operation === "Subtract" ? "Convert to a common denominator." : operation === "Multiply" ? "Multiply across." : "Multiply by the reciprocal.";
  const stepThreeTitle = operation === "Add" ? `Add the ${commonDenominatorName(commonDenominator)}.` : operation === "Subtract" ? `Subtract the ${commonDenominatorName(commonDenominator)}.` : operation === "Multiply" ? "Simplify the product." : "Simplify the quotient.";

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeFraction = (key: "first" | "second", part: "numerator" | "denominator", raw: number) => {
    const setter = key === "first" ? setFirst : setSecond;
    setter((current) => {
      if (part === "denominator") {
        const denominator = clamp(raw, 2, 12);
        return { numerator: Math.min(current.numerator, denominator), denominator };
      }
      return { ...current, numerator: clamp(raw, 1, current.denominator) };
    });
    setPracticeLoaded(false);
    act();
  };
  const dropPart = (event: DragEvent<HTMLButtonElement>, key: "first" | "second", part: number) => {
    event.preventDefault();
    if (!event.dataTransfer.getData("text/fraction-operation-part")) return;
    changeFraction(key, "numerator", part);
    setDragging("");
  };
  const reset = () => {
    setFirst({ numerator: 1, denominator: 2 });
    setSecond({ numerator: 1, denominator: 3 });
    setOperation("Add");
    setPracticeLoaded(false);
    setDragging("");
    setActions(0);
    onInteraction();
  };
  const loadPractice = () => {
    setFirst({ numerator: 2, denominator: 5 });
    setSecond({ numerator: 1, denominator: 10 });
    setOperation("Add");
    setPracticeLoaded(true);
    act();
  };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="operations78-page"
      data-testid="number-mockup-0060"
      data-dedicated-lesson="78"
      data-object-model="dual-editable-draggable-fraction-bars-four-operation-engine-lcm-conversion-reciprocal-reduction-result-practice-model"
      data-first={`${first.numerator}/${first.denominator}`}
      data-second={`${second.numerator}/${second.denominator}`}
      data-operation={operation}
      data-common-denominator={commonDenominator}
      data-converted-first={convertedFirst}
      data-converted-second={convertedSecond}
      data-raw-result={`${rawResult.numerator}/${rawResult.denominator}`}
      data-result={`${result.numerator}/${result.denominator}`}
      data-dragging={dragging}
      data-practice-loaded={practiceLoaded}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Fraction-operation denominator check. Common denominators are needed for addition and subtraction. Multiplication works across; division uses the reciprocal.</span>
      <nav className="operations78-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>78 Fraction Operations</b></nav>

      <main className="operations78-surface">
        <header className="operations78-hero"><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small><h1>Fraction Operations</h1><p>Understand arithmetic procedures.</p><h2><button type="button" aria-label={`Operation ${operation}; click to cycle`} onClick={() => { setOperation(OPERATIONS[(OPERATIONS.indexOf(operation) + 1) % OPERATIONS.length]); setPracticeLoaded(false); act(); }}>{operation}:</button> <b>{first.numerator}/{first.denominator}</b> <span>{symbol}</span> <em>{second.numerator}/{second.denominator}</em></h2></header>

        <section className="operations78-layout">
          <div className="operations78-proof">
            <section className="operations78-start"><StepHeading number={1} title="Start with the fractions." /><FractionBarRow fraction={first} color="cyan" name="First" keyName="first" onChange={(part) => changeFraction("first", "numerator", part)} onDrop={dropPart} onDrag={setDragging} /><hr /><FractionBarRow fraction={second} color="purple" name="Second" keyName="second" onChange={(part) => changeFraction("second", "numerator", part)} onDrop={dropPart} onDrag={setDragging} /><Down /></section>
            <section className="operations78-convert"><StepHeading number={2} title={stepTwoTitle} /><strong>{operation === "Add" || operation === "Subtract" ? `Common denominator: ${commonDenominator}` : operation === "Multiply" ? "Multiply numerator and denominator" : "Flip the second fraction"}</strong><ConvertedRow fraction={first} converted={convertedFirst} common={commonDenominator} color="cyan" operation={operation} /><hr /><ConvertedRow fraction={second} converted={convertedSecond} common={commonDenominator} color="purple" operation={operation} /><Down /></section>
            <section className="operations78-result"><StepHeading number={3} title={stepThreeTitle} /><ResultBar numerator={Math.abs(rawResult.numerator)} denominator={Math.abs(rawResult.denominator)} /><p><b>{operation === "Add" || operation === "Subtract" ? `${convertedFirst}/${commonDenominator}` : `${first.numerator}/${first.denominator}`}</b><span>{symbol}</span><em>{operation === "Add" || operation === "Subtract" ? `${convertedSecond}/${commonDenominator}` : `${second.numerator}/${second.denominator}`}</em><span>=</span><strong>{result.numerator}/{result.denominator}</strong></p><footer><Check /><b>Result:</b><strong>{result.numerator}/{result.denominator}</strong></footer></section>
          </div>

          <aside className="operations78-side">
            <h2>Fraction details</h2><label>First fraction</label><FractionEditor name="First fraction" fraction={first} color="cyan" onChange={(part, value) => changeFraction("first", part, value)} /><label>Second fraction</label><FractionEditor name="Second fraction" fraction={second} color="purple" onChange={(part, value) => changeFraction("second", part, value)} /><label>{operation === "Add" || operation === "Subtract" ? "Common denominator" : "Operation denominator"}</label><output className="common">{operation === "Add" || operation === "Subtract" ? commonDenominator : rawResult.denominator}</output><label>Result</label><output className="result">{result.numerator}/{result.denominator}</output><section className="warning"><AlertTriangle /><b>{operation === "Add" || operation === "Subtract" ? "Do not add denominators directly." : operation === "Multiply" ? "Multiply both numerators and denominators." : "Never divide by a zero fraction."}</b></section><button type="button" className="practice" onClick={loadPractice}><b>{practiceLoaded ? `2/5 + 1/10 = ${result.numerator}/${result.denominator}` : "Try: Add 2/5 + 1/10."}</b><ArrowRight /></button>
          </aside>
        </section>

        <nav className="operations78-navigation"><a href="/lessons/numbers-and-arithmetic/77-comparing-fractions"><ArrowLeft /><span>Previous<b>Comparing Fractions</b></span></a><a href="/lessons/numbers-and-arithmetic/79-decimal-place-value"><span>Next<b>Decimal Place Value</b></span><ArrowRight /></a></nav>
      </main>
      <footer className="operations78-footer"><h3><Sparkles /> Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs"><Calculator /> Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
      <button type="button" className="operations78-reset" onClick={reset}>Reset model</button>
    </div>
  );
}

function StepHeading({ number, title }: { number: number; title: string }) {
  return <header className="operations78-step-heading"><b>{number}</b><h2>{title}</h2></header>;
}

function FractionBarRow({ fraction, color, name, keyName, onChange, onDrop, onDrag }: { fraction: FractionValue; color: "cyan" | "purple"; name: string; keyName: "first" | "second"; onChange: (part: number) => void; onDrop: (event: DragEvent<HTMLButtonElement>, key: "first" | "second", part: number) => void; onDrag: (value: string) => void }) {
  return <article className={`operations78-bar-row ${color}`}><Fraction numerator={fraction.numerator} denominator={fraction.denominator} /><div role="group" aria-label={`${name} fraction bar`}>{Array.from({ length: fraction.denominator }, (_, index) => <button type="button" draggable aria-label={`${name} bar part ${index + 1}`} className={index < fraction.numerator ? "selected" : ""} onClick={() => onChange(index < fraction.numerator ? Math.max(1, index) : index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/fraction-operation-part", `${keyName}:${index + 1}`); onDrag(`${keyName}:${index + 1}`); }} onDragEnd={() => onDrag("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, keyName, index + 1)} key={index} />)}</div></article>;
}

function ConvertedRow({ fraction, converted, common, color, operation }: { fraction: FractionValue; converted: number; common: number; color: "cyan" | "purple"; operation: Operation }) {
  const displayNumerator = operation === "Add" || operation === "Subtract" ? converted : fraction.numerator;
  const displayDenominator = operation === "Add" || operation === "Subtract" ? common : fraction.denominator;
  return <article className={`operations78-converted-row ${color}`}><Fraction numerator={fraction.numerator} denominator={fraction.denominator} /><b>=</b><Fraction numerator={displayNumerator} denominator={displayDenominator} /><div>{Array.from({ length: displayDenominator }, (_, index) => <i className={index < displayNumerator ? "selected" : ""} key={index} />)}</div></article>;
}

function ResultBar({ numerator, denominator }: { numerator: number; denominator: number }) {
  const count = Math.max(1, Math.min(24, denominator));
  const selected = Math.max(0, Math.min(count, Math.round(numerator / denominator * count)));
  return <div className="operations78-result-bar" aria-label={`${numerator} of ${denominator} result parts`}>{Array.from({ length: count }, (_, index) => <i className={index < selected ? "selected" : ""} key={index} />)}</div>;
}

function FractionEditor({ name, fraction, color, onChange }: { name: string; fraction: FractionValue; color: "cyan" | "purple"; onChange: (part: "numerator" | "denominator", value: number) => void }) {
  return <div className={`operations78-editor ${color}`}><input aria-label={`${name} numerator`} type="number" min="1" max={fraction.denominator} value={fraction.numerator} onChange={(event) => onChange("numerator", Number(event.target.value))} /><i /><input aria-label={`${name} denominator`} type="number" min="2" max="12" value={fraction.denominator} onChange={(event) => onChange("denominator", Number(event.target.value))} /></div>;
}

function Fraction({ numerator, denominator }: { numerator: number; denominator: number }) {
  return <span className="operations78-fraction"><b>{numerator}</b><i /><b>{denominator}</b></span>;
}

function Down() { return <span className="operations78-down">↓</span>; }

function commonDenominatorName(value: number) {
  const names: Record<number, string> = { 4: "fourths", 6: "sixths", 8: "eighths", 10: "tenths", 12: "twelfths", 15: "fifteenths", 20: "twentieths" };
  return names[value] ?? `${value}ths`;
}
