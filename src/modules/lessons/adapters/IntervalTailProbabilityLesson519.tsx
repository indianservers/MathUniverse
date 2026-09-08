import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { normalDensity, normalIntervalQuery, type IntervalMode } from "./intervalTailLessonModel";
import "./IntervalTailProbabilityLesson519.css";

const modes: Array<{ value: IntervalMode; label: string }> = [{ value: "left", label: "Left Tail" }, { value: "right", label: "Right Tail" }, { value: "between", label: "Between" }, { value: "outside", label: "Outside" }];

export default function IntervalTailProbabilityLesson519({ resetToken, onInteraction }: LessonAdapterProps) {
  return <IntervalTailActivity key={resetToken} onInteraction={onInteraction} />;
}

function IntervalTailActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [mode, setMode] = useState<IntervalMode>("between");
  const [mean, setMean] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [a, setA] = useState(-1);
  const [b, setB] = useState(1.5);
  const [answer, setAnswer] = useState(1);
  const [checked, setChecked] = useState(true);
  const result = useMemo(() => normalIntervalQuery(mode, a, b, mean, sigma), [a, b, mean, mode, sigma]);
  const samples = Array.from({ length: 121 }, (_, index) => { const z = -3 + index / 20; const x = mean + z * sigma; return { z, x, y: normalDensity(x, mean, sigma) * sigma }; });
  const px = (z: number) => 8 + (z + 3) / 6 * 84;
  const py = (y: number) => 90 - y / 0.4 * 70;
  const line = samples.map((point) => `${px(point.z)},${py(point.y)}`).join(" ");
  const shaded = samples.filter((point) => mode === "left" ? point.x <= result.low : mode === "right" ? point.x >= result.high : mode === "between" ? point.x >= result.low && point.x <= result.high : point.x <= result.low || point.x >= result.high);
  const update = (setter: (value: number) => void, value: number) => { setter(value); onInteraction(); };
  const reset = () => { setMode("between"); setMean(0); setSigma(1); setA(-1); setB(1.5); setAnswer(1); setChecked(true); onInteraction(); };
  const options = [0.68269, 0.77454, 0.84134, 0.93319];

  return <div className="it519" data-testid="probability-mockup-0482" data-target-family="probability-and-distributions" data-lesson-title="Interval / Tail Probability">
    <header className="it519-hero"><span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span><h2>Interval &amp; Tail Probability</h2><p>Calculate probabilities for intervals and tails of the normal distribution.</p><button type="button" onClick={reset}><RotateCcw size={14} />Reset</button></header>
    <nav><b>Interaction + Visualization</b><span>Explain</span><span>Examples</span><span>Formulas</span><span>Know more</span></nav>
    <section className="it519-lab"><header><div><h3>Interaction + Visualization</h3><h4>Explore the Normal Distribution</h4></div><strong>Active</strong></header><div className="it519-work">
      <aside><h3>Choose mode</h3><div className="it519-modes">{modes.map((item) => <button type="button" key={item.value} className={mode === item.value ? "active" : ""} onClick={() => { setMode(item.value); onInteraction(); }}><i className={item.value} />{item.label}</button>)}</div><h3>Distribution</h3><div className="it519-pair"><label>Mean (mu)<input type="number" step="0.1" value={mean} onChange={(event) => update(setMean, Number(event.target.value))} /></label><label>Std. Dev. (sigma)<input type="number" min="0.01" step="0.1" value={sigma} onChange={(event) => update(setSigma, Math.max(0.01, Number(event.target.value)))} /></label></div><h3>Bounds (drag or type)</h3><div className="it519-pair"><label>Lower bound (a)<input type="number" step="0.1" value={a} onChange={(event) => update(setA, Number(event.target.value))} /></label><label>Upper bound (b)<input type="number" step="0.1" value={b} onChange={(event) => update(setB, Number(event.target.value))} /></label></div><h3>Quick presets</h3><div className="it519-presets">{[1, 2, 3].map((value) => <button type="button" key={value} onClick={() => { setA(mean - value * sigma); setB(mean + value * sigma); setMode("between"); onInteraction(); }}>+/-{value} sigma</button>)}<button type="button" onClick={() => { setA(mean - 0.67449 * sigma); setB(mean + 0.67449 * sigma); setMode("between"); onInteraction(); }}>IQR</button></div></aside>
      <main><header><h3>Normal Distribution &nbsp; X ~ N(mu = {mean}, sigma = {sigma})</h3><p><i />Area selected</p></header><svg className="it519-plot" viewBox="0 0 100 100" preserveAspectRatio="none"><line className="axis" x1="6" y1="90" x2="95" y2="90" /><polyline points={line} />{shaded.map((point) => <line className="shade" key={point.z} x1={px(point.z)} y1="90" x2={px(point.z)} y2={py(point.y)} />)}<line className="bound" x1={px(result.zLow)} y1="10" x2={px(result.zLow)} y2="90" /><line className="bound" x1={px(result.zHigh)} y1="10" x2={px(result.zHigh)} y2="90" /></svg><div className="it519-ranges"><input aria-label="Lower bound slider" type="range" min={mean - 3 * sigma} max={mean + 3 * sigma} step={sigma / 100} value={a} onChange={(event) => update(setA, Number(event.target.value))} /><input aria-label="Upper bound slider" type="range" min={mean - 3 * sigma} max={mean + 3 * sigma} step={sigma / 100} value={b} onChange={(event) => update(setB, Number(event.target.value))} /></div><div className="it519-metrics"><p>P(a &lt;= X &lt;= b)<b>{result.between.toFixed(5)}</b><small>{(result.between * 100).toFixed(3)}%</small></p><p>P(X &lt; a)<b>{result.cdfLow.toFixed(5)}</b></p><p>P(X &gt; b)<b>{(1 - result.cdfHigh).toFixed(5)}</b></p><p>P(outside)<b>{result.outside.toFixed(5)}</b></p></div></main>
    </div></section>
    <section className="it519-details"><article><h3>Complement Check</h3><p>P(a &lt;= X &lt;= b) + P(outside) = 1</p><strong>{result.between.toFixed(5)} + {result.outside.toFixed(5)} = {(result.between + result.outside).toFixed(5)}</strong><b><Check size={14} />Verified</b></article><article><h3>Z-scores</h3><p>z_a = (a - mu) / sigma = {result.zLow.toFixed(2)}</p><p>z_b = (b - mu) / sigma = {result.zHigh.toFixed(2)}</p></article><article><h3>Standard Normal Table</h3><p>Phi(z_b) = {result.cdfHigh.toFixed(5)}</p><p>Phi(z_a) = {result.cdfLow.toFixed(5)}</p><strong>P(a &lt;= X &lt;= b) = Phi(z_b) - Phi(z_a)</strong></article></section>
    <section className="it519-insights"><article><h3>Learning Objective</h3><p>Find left-tail, right-tail, between, and outside probabilities, convert bounds to z-scores, and verify results with complements.</p></article><article><h3>Key Insight</h3><p>For X ~ N(mu, sigma^2), standardize with z = (x - mu)/sigma. Area plus its complement is always 1.</p></article><article><h3>Common Misconception</h3><p>Always subtract the lower CDF value from the higher CDF value. Reversing them gives a negative area.</p></article></section>
    <section className="it519-quiz"><h3>Quick Knowledge Check</h3><p>Let X ~ N(0,1). What is P(-1.00 &lt;= X &lt;= 1.50)?</p><div>{options.map((option, index) => <label key={option} className={answer === index ? "selected" : ""}><input type="radio" checked={answer === index} onChange={() => { setAnswer(index); setChecked(false); onInteraction(); }} />{String.fromCharCode(65 + index)}. {option.toFixed(5)}</label>)}</div><button type="button" onClick={() => setChecked(true)}>Check answer</button>{checked && <strong className={answer === 1 ? "correct" : "incorrect"}>{answer === 1 ? <Check size={15} /> : <X size={15} />}{answer === 1 ? "Correct! Phi(1.50) - Phi(-1.00) = 0.77454" : "Try subtracting the lower CDF from the upper CDF."}</strong>}</section>
    <footer><button type="button" onClick={reset}><RotateCcw size={14} />Reset lesson</button><span>Previous: Cumulative Distribution &nbsp; Next: Inverse Probability</span></footer>
  </div>;
}
