import {
  ArrowLeft,
  ArrowRight,
  Grid2X2,
  Languages,
  Lightbulb,
  RotateCcw,
  Rocket,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./FractionModelsTargetLesson75.css";
import "./FractionModelsTargetLesson75Tuning.css";

const DENOMINATOR_PRESETS = [2, 3, 4, 6, 8, 12];

function clampDenominator(value: number) {
  if (!Number.isFinite(value)) return 2;
  return Math.max(2, Math.min(12, Math.round(value)));
}

function clampNumerator(value: number, denominator: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(denominator, Math.round(value)));
}

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle - 90) * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function sectorPath(index: number, count: number) {
  const start = polarPoint(100, 100, 75, index * 360 / count);
  const end = polarPoint(100, 100, 75, (index + 1) * 360 / count);
  const large = 360 / count > 180 ? 1 : 0;
  return `M100 100 L${start.x} ${start.y} A75 75 0 ${large} 1 ${end.x} ${end.y} Z`;
}

export default function FractionModelsTargetLesson75({ resetToken, onInteraction }: LessonAdapterProps) {
  const [denominator, setDenominator] = useState(4);
  const [numerator, setNumerator] = useState(3);
  const [language, setLanguage] = useState("English (English)");
  const [shareState, setShareState] = useState("Share");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [actions, setActions] = useState(0);
  const value = numerator / denominator;
  const decimalText = Number(value.toFixed(3)).toString();
  const percentText = `${Number((value * 100).toFixed(1))}%`;
  const setTotal = denominator * 3;
  const setSelected = numerator * 3;

  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const changeDenominator = (valueToSet: number) => {
    const next = clampDenominator(valueToSet);
    setDenominator(next);
    setNumerator((current) => Math.min(current, next));
    setPracticeLoaded(false);
    act();
  };
  const changeNumerator = (valueToSet: number) => {
    setNumerator(clampNumerator(valueToSet, denominator));
    setPracticeLoaded(false);
    act();
  };
  const reset = () => {
    setDenominator(4);
    setNumerator(3);
    setLanguage("English (English)");
    setShareState("Share");
    setPracticeLoaded(false);
    setActions(0);
    onInteraction();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(`${numerator}/${denominator} = ${decimalText} = ${percentText}`);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  const loadPractice = () => {
    setDenominator(5);
    setNumerator(2);
    setPracticeLoaded(true);
    act();
  };
  useEffect(() => {
    setDenominator(4);
    setNumerator(3);
    setLanguage("English (English)");
    setShareState("Share");
    setPracticeLoaded(false);
    setActions(0);
  }, [resetToken]);

  return (
    <div
      className="fraction75-page"
      data-testid="number-mockup-0057"
      data-dedicated-lesson="75"
      data-object-model="linked-numerator-denominator-drag-ranges-clickable-area-circle-equivalent-set-number-line-decimal-percent-practice-model"
      data-numerator={numerator}
      data-denominator={denominator}
      data-value={value.toFixed(4)}
      data-decimal={decimalText}
      data-percent={percentText}
      data-set-selected={setSelected}
      data-set-total={setTotal}
      data-language={language}
      data-share-state={shareState}
      data-practice-loaded={practiceLoaded}
      data-actions={actions}
    >
      <span className="sr-only">Concept trace: Equal-parts fraction model. Linked fraction representations. Fraction models show selected parts of one whole. Every model uses equal-sized pieces.</span>
      <nav className="fraction75-breadcrumb"><a href="/" aria-label="Back"><ArrowLeft /></a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span><b>75 Fraction Models</b></nav>
      <header className="fraction75-header">
        <div><h1>Fraction Models</h1><p>Build visual fraction meaning.</p></div>
        <aside>
          <button type="button" onClick={() => { setLanguage((current) => current.startsWith("English") ? "Hindi (हिन्दी)" : "English (English)"); act(); }}><Languages /><span>{language}</span><i>⌄</i></button>
          <button type="button" onClick={reset}><RotateCcw /> Reset</button>
          <button type="button" onClick={() => void share()}><Share2 /> {shareState}</button>
        </aside>
        <nav><b>♙ Foundational–Intermediate</b><b>ϟ Concept + Manipulative</b><b>▣ Fractions, Decimals, Ratios and Percentages</b><b>◷ 6–10 min</b></nav>
      </header>

      <section className="fraction75-summary">
        <h2><b>{numerator}</b> of <b>{denominator}</b> equal parts</h2>
        <div><Fraction numerator={numerator} denominator={denominator} /><i>=</i><strong>{decimalText}</strong><i>=</i><em>{percentText}</em></div>
      </section>

      <main className="fraction75-models">
        <section className="fraction75-area"><h3><Grid2X2 /> Area model</h3><div>{Array.from({ length: denominator }, (_, index) => <button type="button" aria-label={`Area part ${index + 1} ${index < numerator ? "selected" : "unselected"}`} className={index < numerator ? "selected" : ""} onClick={() => changeNumerator(index < numerator ? index : index + 1)} key={index} />)}</div><p><b>{numerator}</b> of <b>{denominator}</b> equal parts</p></section>
        <section className="fraction75-circle"><h3><span>◐</span> Circle model</h3><svg viewBox="0 0 200 200" role="img" aria-label={`${numerator} of ${denominator} circle sectors selected`}>{Array.from({ length: denominator }, (_, index) => <path key={index} d={sectorPath(index, denominator)} className={index < numerator ? "selected" : ""} onClick={() => changeNumerator(index < numerator ? index : index + 1)} />)}<circle cx="100" cy="100" r="75" /></svg><p><b>{numerator}</b> of <b>{denominator}</b> equal parts</p></section>
        <section className="fraction75-set"><h3><span>✣</span> Set model: <b>{setSelected}</b> of {setTotal}</h3><div>{Array.from({ length: setTotal }, (_, index) => <button type="button" aria-label={`Set object ${index + 1} ${index < setSelected ? "selected" : "unselected"}`} className={index < setSelected ? "selected" : ""} onClick={() => changeNumerator(Math.ceil((index + 1) / 3))} key={index} />)}</div><p><b>{setSelected}</b> of {setTotal} = <b>{numerator}</b> of <b>{denominator}</b> equal parts</p></section>
        <section className="fraction75-line"><h3><span>↔</span> Number line position: <b>{decimalText}</b></h3><FractionLine numerator={numerator} denominator={denominator} value={value} onChoose={changeNumerator} /><p><b>{decimalText}</b> is the same as <b>{numerator}/{denominator}</b>.</p></section>
      </main>

      <aside className="fraction75-controls">
        <h3>Build the fraction</h3>
        <section><label htmlFor="fraction75-denominator">Drag to set denominator</label><input id="fraction75-denominator" aria-label="Drag to set denominator" type="range" min="2" max="12" step="1" value={denominator} onChange={(event) => changeDenominator(Number(event.target.value))} /><output>{denominator}</output><div>{DENOMINATOR_PRESETS.map((preset) => <button type="button" className={denominator === preset ? "active" : ""} onClick={() => changeDenominator(preset)} key={preset}>{preset}</button>)}</div></section>
        <section><label htmlFor="fraction75-numerator">Drag to set numerator</label><input id="fraction75-numerator" aria-label="Drag to set numerator" type="range" min="0" max={denominator} step="1" value={numerator} onChange={(event) => changeNumerator(Number(event.target.value))} /><output>{numerator}</output><div>{Array.from({ length: Math.min(4, denominator) }, (_, index) => index + 1).map((preset) => <button type="button" className={numerator === preset ? "active" : ""} onClick={() => changeNumerator(preset)} key={preset}>{preset}</button>)}</div></section>
        <hr />
        <div className="fraction75-metrics"><p><span>Decimal</span><b>{decimalText}</b></p><p><span>Percent</span><b>{percentText}</b></p></div>
        <p className="fraction75-tip"><Lightbulb /><b>The parts must be equal-sized pieces of the same whole.</b></p>
      </aside>
      <button type="button" className="fraction75-practice" onClick={loadPractice}><Rocket /><b>{practiceLoaded ? `2/5 = ${decimalText} = ${percentText}` : "Try: Model 2/5 in three ways."}</b><ArrowRight /></button>
      <footer className="fraction75-linked"><span>🔗</span> All models are linked and show the same fraction.</footer>
    </div>
  );
}

function Fraction({ numerator, denominator }: { numerator: number; denominator: number }) {
  return <span className="fraction75-fraction"><b>{numerator}</b><i /><b>{denominator}</b></span>;
}

function FractionLine({ numerator, denominator, value, onChoose }: { numerator: number; denominator: number; value: number; onChoose: (value: number) => void }) {
  const x = 28 + value * 350;
  return <svg viewBox="0 0 410 105" role="img" aria-label={`Fraction number line at ${numerator} over ${denominator}`}><defs><marker id="fraction75-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" /></marker></defs><line x1="28" y1="55" x2="393" y2="55" markerEnd="url(#fraction75-arrow)" />{[0, .25, .5, .75, 1].map((tick) => <g key={tick}><line x1={28 + tick * 350} x2={28 + tick * 350} y1="45" y2="66" /><text x={28 + tick * 350} y="84">{tick === 0 || tick === 1 ? tick : tick === .25 ? "1/4" : tick === .5 ? "1/2" : "3/4"}</text></g>)}<circle cx={x} cy="55" r="9" onClick={() => onChoose(numerator)} /><text className="marker" x={x} y="28">{numerator}<tspan x={x} dy="10">―</tspan><tspan x={x} dy="12">{denominator}</tspan></text></svg>;
}
