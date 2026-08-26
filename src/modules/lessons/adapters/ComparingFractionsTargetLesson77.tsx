import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  Languages,
  Lightbulb,
  RotateCcw,
  Rocket,
  Share2,
  Target,
} from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ComparingFractionsTargetLesson77.css";
import "./ComparingFractionsTargetLesson77Tuning.css";

type FractionState = { numerator: number; denominator: number };

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function lcm(left: number, right: number) {
  return Math.abs(left * right) / gcd(left, right);
}

function clamp(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

export default function ComparingFractionsTargetLesson77({ resetToken, onInteraction }: LessonAdapterProps) {
  const [fractionA, setFractionA] = useState<FractionState>({ numerator: 3, denominator: 4 });
  const [fractionB, setFractionB] = useState<FractionState>({ numerator: 4, denominator: 7 });
  const [tab, setTab] = useState("Understand");
  const [language, setLanguage] = useState("English (English)");
  const [shareState, setShareState] = useState("Share");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const commonDenominator = lcm(fractionA.denominator, fractionB.denominator);
  const commonA = fractionA.numerator * commonDenominator / fractionA.denominator;
  const commonB = fractionB.numerator * commonDenominator / fractionB.denominator;
  const valueA = fractionA.numerator / fractionA.denominator;
  const valueB = fractionB.numerator / fractionB.denominator;
  const comparison = commonA === commonB ? "=" : commonA > commonB ? ">" : "<";

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeFraction = (key: "A" | "B", part: "numerator" | "denominator", raw: number) => {
    const setter = key === "A" ? setFractionA : setFractionB;
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
  const dropPart = (event: DragEvent<HTMLButtonElement>, key: "A" | "B", part: number) => {
    event.preventDefault();
    const source = event.dataTransfer.getData("text/comparison-fraction");
    if (!source) return;
    changeFraction(key, "numerator", part);
    setDragging("");
  };
  const reset = () => {
    setFractionA({ numerator: 3, denominator: 4 });
    setFractionB({ numerator: 4, denominator: 7 });
    setTab("Understand");
    setLanguage("English (English)");
    setShareState("Share");
    setWorkspaceOpen(false);
    setPracticeLoaded(false);
    setDragging("");
    setActions(0);
    onInteraction();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(`${fractionA.numerator}/${fractionA.denominator} ${comparison} ${fractionB.numerator}/${fractionB.denominator}`);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  const loadPractice = () => {
    setFractionA({ numerator: 3, denominator: 4 });
    setFractionB({ numerator: 7, denominator: 9 });
    setPracticeLoaded(true);
    setTab("Compare");
    act();
  };

  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="compare77-page"
      data-testid="number-mockup-0059"
      data-dedicated-lesson="77"
      data-object-model="dual-editable-fractions-draggable-unit-bars-lcm-common-units-cross-product-ordering-shared-number-line-practice-model"
      data-fraction-a={`${fractionA.numerator}/${fractionA.denominator}`}
      data-fraction-b={`${fractionB.numerator}/${fractionB.denominator}`}
      data-common-denominator={commonDenominator}
      data-common-a={commonA}
      data-common-b={commonB}
      data-value-a={valueA.toFixed(3)}
      data-value-b={valueB.toFixed(3)}
      data-comparison={comparison}
      data-tab={tab}
      data-language={language}
      data-share-state={shareState}
      data-workspace-open={workspaceOpen}
      data-practice-loaded={practiceLoaded}
      data-dragging={dragging}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Common-unit comparison. Compare fractions using common units. The LCM creates equal-sized parts before numerators are compared.</span>
      <nav className="compare77-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>77 Comparing Fractions</b></nav>

      <header className="compare77-hero">
        <aside><small>NUMBERS AND ARITHMETIC</small><small>FRACTIONS, DECIMALS, RATIOS AND PERCENTAGES</small></aside>
        <h1>Comparing Fractions</h1><p>Compare quantities accurately.</p>
        <nav><b>♙ Fraction A: {fractionA.numerator}/{fractionA.denominator}</b><b>♙ Fraction B: {fractionB.numerator}/{fractionB.denominator}</b><b>ϟ Concept + Manipulative</b><b>▣ Fractions, Decimals, Ratios and Percentages</b><b>◷ 6–10 min</b></nav>
        <section>
          <button type="button" onClick={() => { setLanguage((current) => current.startsWith("English") ? "Hindi (हिन्दी)" : "English (English)"); act(); }}><Languages /> {language}<span>⌄</span></button>
          <button type="button" onClick={reset}><RotateCcw /> Reset</button>
          <button type="button" onClick={() => void share()}><Share2 /> {shareState}</button>
        </section>
        <button type="button" className="compare77-workspace" onClick={() => { setWorkspaceOpen((current) => !current); act(); }}>↗ {workspaceOpen ? "Workspace open" : "Workspace"}</button>
      </header>

      <nav className="compare77-tabs" aria-label="Comparison proof stages">
        {["Understand", "Convert", "Compare", "Number line", "Know more"].map((label, index) => <button type="button" className={tab === label ? "active" : ""} onClick={() => { setTab(label); act(); }} key={label}><span>{index < 4 ? index + 1 : "✣"}</span>{label}</button>)}
      </nav>

      <main className="compare77-layout">
        <div className="compare77-proof">
          <section className="compare77-understand"><StepTitle number={1} title="Understand the fractions in their own units" subtitle="Each bar is one whole." /><OriginalBar name="A" fraction={fractionA} color="cyan" onChange={(part) => changeFraction("A", "numerator", part)} onDrop={dropPart} onDrag={setDragging} /><OriginalBar name="B" fraction={fractionB} color="purple" onChange={(part) => changeFraction("B", "numerator", part)} onDrop={dropPart} onDrag={setDragging} /></section>
          <section className="compare77-convert"><StepTitle number={2} title="Convert to a common denominator" subtitle="Use the same whole and common units." /><strong>Common denominator: {commonDenominator}</strong><CommonRow name="A" fraction={fractionA} common={commonDenominator} converted={commonA} color="cyan" /><CommonRow name="B" fraction={fractionB} common={commonDenominator} converted={commonB} color="purple" /></section>
          <section className="compare77-compare"><StepTitle number={3} title="Compare using common units" subtitle={`Now the units are the same (${numberWord(commonDenominator)}).`} /><div><article><b>{commonA}/{commonDenominator}</b><span>Fraction A</span></article><strong>{comparison}</strong><article><b>{commonB}/{commonDenominator}</b><span>Fraction B</span></article></div><p><Check /> Therefore &nbsp; <b>{fractionA.numerator}/{fractionA.denominator}</b> &nbsp; {comparison} &nbsp; <b>{fractionB.numerator}/{fractionB.denominator}</b></p></section>
          <section className="compare77-number-line"><StepTitle number={4} title="See it on the number line" subtitle="Both fractions are between 0 and 1." /><ComparisonLine fractionA={fractionA} fractionB={fractionB} valueA={valueA} valueB={valueB} onChange={(key, numerator) => changeFraction(key, "numerator", numerator)} /></section>
          <button type="button" className="compare77-practice" onClick={loadPractice}><Rocket /><b>{practiceLoaded ? `Solved: 3/4 ${comparison} 7/9` : "Try: Compare 3/4 and 7/9."}</b><span>Try it now <ArrowRight /></span></button>
        </div>

        <aside className="compare77-side">
          <section className="compare77-glance"><h2>At a glance</h2><FractionEditor label="Fraction A" color="cyan" fraction={fractionA} value={valueA} onChange={(part, value) => changeFraction("A", part, value)} /><FractionEditor label="Fraction B" color="purple" fraction={fractionB} value={valueB} onChange={(part, value) => changeFraction("B", part, value)} /><hr /><h3>▣ Common denominator</h3><b>{commonDenominator}</b><hr /><h3>▣ In common units</h3><p>{fractionA.numerator}/{fractionA.denominator} &nbsp;=&nbsp; {commonA}/{commonDenominator}</p><p>{fractionB.numerator}/{fractionB.denominator} &nbsp;=&nbsp; {commonB}/{commonDenominator}</p><hr /><h3>▣ Decimals</h3><p>{fractionA.numerator}/{fractionA.denominator} &nbsp;≈&nbsp; {valueA.toFixed(3)}</p><p>{fractionB.numerator}/{fractionB.denominator} &nbsp;≈&nbsp; {valueB.toFixed(3)}</p><footer><span>{commonA}/{commonDenominator} {comparison} {commonB}/{commonDenominator}</span><b>Therefore {fractionA.numerator}/{fractionA.denominator} {comparison} {fractionB.numerator}/{fractionB.denominator}</b><Check /></footer></section>
          <section className="compare77-why"><Lightbulb /><div><h3>Why this works</h3><p>Using a common denominator means we are comparing the same size pieces of the same whole.</p></div></section>
          <section className="compare77-warning"><AlertTriangle /><div><h3>Common misconception</h3><p>Do not compare numerators alone.</p><p>{fractionA.numerator} {comparison} {fractionB.numerator} does not tell us which fraction is greater.</p></div></section>
          <section className="compare77-takeaway"><Target /><div><h3>Key takeaway</h3><p>Use the same whole and common units to compare fractions accurately.</p></div></section>
        </aside>
      </main>

      <nav className="compare77-navigation"><a href="/lessons/numbers-and-arithmetic/76-equivalent-fractions"><ArrowLeft /><span>Previous<b>Equivalent Fractions</b></span></a><a href="/lessons/numbers-and-arithmetic/78-fraction-operations"><span>Next<b>Fraction Operations</b></span><ArrowRight /></a></nav>
      <footer className="compare77-footer"><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap"><BookOpen /> Sitemap</a><a href="/docs"><Calculator /> Docs</a><a href="/about">✉ About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com info@IndianServers.com</small></footer>
    </div>
  );
}

function StepTitle({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return <header className="compare77-step-title"><b>{number}</b><div><h2>{title}</h2><p>{subtitle}</p></div></header>;
}

function OriginalBar({ name, fraction, color, onChange, onDrop, onDrag }: { name: "A" | "B"; fraction: FractionState; color: "cyan" | "purple"; onChange: (part: number) => void; onDrop: (event: DragEvent<HTMLButtonElement>, key: "A" | "B", part: number) => void; onDrag: (value: string) => void }) {
  return <article className={`compare77-original-row ${color}`}><h3>Fraction {name}<b>{fraction.numerator}/{fraction.denominator}</b></h3><div><div>{Array.from({ length: fraction.denominator }, (_, index) => <button type="button" draggable aria-label={`Fraction ${name} bar part ${index + 1}`} className={index < fraction.numerator ? "selected" : ""} onClick={() => onChange(index < fraction.numerator ? Math.max(1, index) : index + 1)} onDragStart={(event) => { event.dataTransfer.setData("text/comparison-fraction", `${name}:${index + 1}`); onDrag(`${name}:${index + 1}`); }} onDragEnd={() => onDrag("")} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, name, index + 1)} key={index} />)}</div><footer>{Array.from({ length: fraction.denominator + 1 }, (_, index) => <span style={{ left: `${index / fraction.denominator * 100}%` }} key={index}>{index === 0 ? "0" : index === fraction.denominator ? "1" : `${index}/${fraction.denominator}`}</span>)}</footer></div></article>;
}

function CommonRow({ name, fraction, common, converted, color }: { name: "A" | "B"; fraction: FractionState; common: number; converted: number; color: "cyan" | "purple" }) {
  const scale = common / fraction.denominator;
  return <article className={`compare77-common-row ${color}`}><h3>Fraction {name}<b>{fraction.numerator}/{fraction.denominator}</b></h3><div className="equation"><Fraction numerator={fraction.numerator} denominator={fraction.denominator} /><b>=</b><Fraction numerator={`${fraction.numerator} × ${scale}`} denominator={`${fraction.denominator} × ${scale}`} /><b>=</b><Fraction numerator={converted} denominator={common} /></div><div className="common-bar" aria-label={`Fraction ${name} as ${converted} of ${common} common units`}>{Array.from({ length: common }, (_, index) => <i className={index < converted ? "selected" : index >= common - Math.max(0, common - converted - 4) ? "extra" : ""} key={index} />)}<span className="brace" style={{ width: `${converted / common * 100}%` }}>{converted}/{common}</span><footer><span>0</span><span>{Math.floor(common / 2)}/{common}</span><span>{converted}/{common}</span><span>{common}/{common}</span></footer></div></article>;
}

function Fraction({ numerator, denominator }: { numerator: number | string; denominator: number | string }) {
  return <span className="compare77-fraction"><b>{numerator}</b><i /><b>{denominator}</b></span>;
}

function FractionEditor({ label, color, fraction, value, onChange }: { label: string; color: "cyan" | "purple"; fraction: FractionState; value: number; onChange: (part: "numerator" | "denominator", value: number) => void }) {
  return <section className={`compare77-editor ${color}`}><h3><i />{label}</h3><div><input aria-label={`${label} numerator`} type="number" min="1" max={fraction.denominator} value={fraction.numerator} onChange={(event) => onChange("numerator", Number(event.target.value))} /><span>/</span><input aria-label={`${label} denominator`} type="number" min="2" max="12" value={fraction.denominator} onChange={(event) => onChange("denominator", Number(event.target.value))} /><b>≈ {value.toFixed(3)}</b></div></section>;
}

function ComparisonLine({ fractionA, fractionB, valueA, valueB, onChange }: { fractionA: FractionState; fractionB: FractionState; valueA: number; valueB: number; onChange: (key: "A" | "B", numerator: number) => void }) {
  return <div className="compare77-line"><i /><div>{[0, .25, .5, .75, 1].map((value) => <button type="button" aria-label={`Number line ${value}`} style={{ left: `${value * 100}%` }} onClick={() => onChange("A", Math.max(1, Math.round(value * fractionA.denominator)))} key={value}><span>{value === 0 || value === 1 ? value : value === .25 ? "1/4" : value === .5 ? "1/2" : "3/4"}</span></button>)}</div><button type="button" draggable className="marker a" aria-label={`Fraction A marker ${fractionA.numerator}/${fractionA.denominator}`} style={{ left: `${valueA * 100}%` }}><b>{fractionA.numerator}/{fractionA.denominator}</b><span>≈ {valueA.toFixed(3)}</span></button><button type="button" draggable className="marker b" aria-label={`Fraction B marker ${fractionB.numerator}/${fractionB.denominator}`} style={{ left: `${valueB * 100}%` }}><b>{fractionB.numerator}/{fractionB.denominator}</b><span>≈ {valueB.toFixed(3)}</span></button></div>;
}

function numberWord(value: number) {
  const names: Record<number, string> = { 6: "sixths", 8: "eighths", 12: "twelfths", 15: "fifteenths", 20: "twentieths", 24: "twenty-fourths", 28: "twenty-eighths", 36: "thirty-sixths" };
  return names[value] ?? `${value}ths`;
}
