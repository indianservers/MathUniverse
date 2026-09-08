import { Check, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { clampProbability, inverseCdf, inverseDensity, inverseQuantile, standardQuantile, type InverseDistribution } from "./inverseProbabilityLessonModel";
import "./InverseProbabilityLesson520.css";

const distributionNames: Record<InverseDistribution, string> = { normal: "Normal", logistic: "Logistic", uniform: "Uniform" };
const presets = [0.8, 0.9, 0.95, 0.975, 0.99, 0.999];

export default function InverseProbabilityLesson520({ resetToken, onInteraction }: LessonAdapterProps) {
  return <InverseActivity key={resetToken} onInteraction={onInteraction} />;
}

function InverseActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [distribution, setDistribution] = useState<InverseDistribution>("normal");
  const [p, setP] = useState(0.95);
  const [mean, setMean] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [answer, setAnswer] = useState(2);
  const [checked, setChecked] = useState(true);
  const z = standardQuantile(p, distribution);
  const x = inverseQuantile(p, mean, sigma, distribution);
  const check = inverseCdf(x, mean, sigma, distribution);
  const samples = useMemo(() => Array.from({ length: 121 }, (_, index) => { const sampleZ = -4 + index / 15; const sampleX = mean + sampleZ * sigma; return { z: sampleZ, cdf: inverseCdf(sampleX, mean, sigma, distribution), pdf: inverseDensity(sampleX, mean, sigma, distribution) * sigma }; }), [distribution, mean, sigma]);
  const px = (value: number) => 8 + (value + 4) / 8 * 84;
  const cdfLine = samples.map((point) => `${px(point.z)},${90 - point.cdf * 76}`).join(" ");
  const maxPdf = Math.max(...samples.map((point) => point.pdf), 0.01);
  const pdfLine = samples.map((point) => `${px(point.z)},${90 - point.pdf / maxPdf * 68}`).join(" ");
  const setProbability = (value: number) => { setP(Math.round(clampProbability(value) * 10000) / 10000); setChecked(false); onInteraction(); };
  const dragCdf = (event: PointerEvent<SVGSVGElement>) => { const rect = event.currentTarget.getBoundingClientRect(); const draggedZ = ((event.clientX - rect.left) / rect.width - 0.08) / 0.84 * 8 - 4; setProbability(inverseCdf(mean + draggedZ * sigma, mean, sigma, distribution)); };
  const reset = () => { setDistribution("normal"); setP(0.95); setMean(0); setSigma(1); setAnswer(2); setChecked(true); onInteraction(); };

  return <div className="ip520" data-testid="probability-mockup-0483" data-target-family="probability-and-distributions">
    <header className="ip520-hero"><span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span><h2>Inverse Probability</h2><p>Find quantiles (cutoff values) for a given probability.</p><article><b>Learning Objective</b><p>Given a probability p, find the critical value x such that a specified area is to the left of x.</p><b>Key Idea</b><strong>x = F^-1(p)</strong></article><button type="button" onClick={reset}><RotateCcw size={14} />Reset</button></header>
    <nav><b>Interactive Lab</b><span>Explain</span><span>Examples</span><span>Formulas</span><span>Know more</span></nav>
    <section className="ip520-lab"><header><div><h3>Interactive Lab</h3><h4>Find the quantile (inverse probability)</h4><p>Adjust the target probability to find the critical value x such that P(X &lt;= x) = p.</p></div><label>Distribution: <select value={distribution} onChange={(event) => { setDistribution(event.target.value as InverseDistribution); onInteraction(); }}>{Object.entries(distributionNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label></header><div className="ip520-work">
      <aside><h3>1 &nbsp; Target probability (area to the left)</h3><strong className="ip520-p">p = {p.toFixed(4)}</strong><input aria-label="Target probability" type="range" min="0.01" max="0.99" step="0.0001" value={p} onChange={(event) => setProbability(Number(event.target.value))} /><div className="ip520-presets">{[0.9, 0.95, 0.975, 0.99].map((value) => <button type="button" key={value} className={Math.abs(p - value) < 0.00001 ? "active" : ""} onClick={() => setProbability(value)}>{value * 100}%</button>)}</div><h3>2 &nbsp; Distribution parameters</h3><NumberControl label="mu (mean)" value={mean} onChange={setMean} /><NumberControl label="sigma (std. dev.)" value={sigma} min={0.01} onChange={(value) => setSigma(Math.max(0.01, value))} /><h3>3 &nbsp; Result (quantile)</h3><strong className="ip520-result">x = {x.toFixed(4)}</strong><p>Check: P(X &lt;= {x.toFixed(4)}) = <b>{check.toFixed(4)}</b></p><p>z-score: {z.toFixed(4)} &nbsp; Percentile: {(p * 100).toFixed(2)}%</p><p>Inverse notation: x = F^-1({p.toFixed(4)})</p><article>Drag the vertical handle on the CDF plot or move the slider to change p.</article></aside>
      <main><ProbabilityGraph title="CDF: F(x) = P(X <= x)" line={cdfLine} z={z} value={p} kind="cdf" onPointer={dragCdf} /><ProbabilityGraph title="PDF: f(x)" line={pdfLine} z={z} value={inverseDensity(x, mean, sigma, distribution) * sigma / maxPdf} kind="pdf" /></main>
    </div><div className="ip520-bottom"><article><h3>Critical value presets (standard normal)</h3><div>{presets.map((value) => <button type="button" key={value} className={Math.abs(p - value) < 0.00001 ? "active" : ""} onClick={() => { setDistribution("normal"); setMean(0); setSigma(1); setProbability(value); }}><b>{value * 100}%</b><span>{inverseQuantile(value, 0, 1, "normal").toFixed(4)}</span></button>)}</div></article><article><h3>Summary table</h3><table><tbody><tr><td>Target probability</td><td>p</td><td>{p.toFixed(4)}</td></tr><tr><td>Quantile (critical value)</td><td>x = F^-1(p)</td><td>{x.toFixed(4)}</td></tr><tr><td>z-score</td><td>z_p</td><td>{z.toFixed(4)}</td></tr><tr><td>Check (CDF)</td><td>P(X &lt;= x)</td><td>{check.toFixed(4)}</td></tr><tr><td>Tail area (right)</td><td>1 - p</td><td>{(1 - p).toFixed(4)}</td></tr></tbody></table></article></div></section>
    <section className="ip520-insights"><article><h3>Key Insight</h3><p>Inverse probability asks what value x gives a cumulative area p. Use x = F^-1(p) to move from probability to value.</p></article><article><h3>Common Misconception</h3><p>For continuous distributions, P(X = x) = 0. Inverse probability uses areas such as P(X &lt;= x) = p.</p></article><article><h3>When to Use</h3><p>Find cutoffs, hypothesis-test critical values, confidence intervals, and risk thresholds.</p></article></section>
    <section className="ip520-quiz"><header><h3>Quick Knowledge Check</h3><b>Score: {checked && answer === 2 ? "1 / 1" : "0 / 1"}</b></header><p>For a standard normal distribution, what is z such that P(Z &lt;= z) = 0.975?</p><div>{[1.2816, 1.6449, 1.96, 2.3263].map((option, index) => <label key={option} className={answer === index ? "selected" : ""}><input type="radio" checked={answer === index} onChange={() => { setAnswer(index); setChecked(false); onInteraction(); }} />{String.fromCharCode(65 + index)}. {option.toFixed(4)}</label>)}</div><button type="button" onClick={() => setChecked(true)}>Check answer</button>{checked && <strong className={answer === 2 ? "correct" : "incorrect"}>{answer === 2 ? <Check size={15} /> : <X size={15} />}{answer === 2 ? "Correct! z = 1.9600 is the 97.5th percentile." : "Use the inverse standard normal CDF at 0.975."}</strong>}</section>
    <footer><button type="button" onClick={reset}><RotateCcw size={14} />Reset lesson</button><span>Previous: Interval / Tail Probability &nbsp; Next: Bernoulli Distribution</span></footer>
  </div>;
}

function NumberControl({ label, value, min = -1000, onChange }: { label: string; value: number; min?: number; onChange: (value: number) => void }) { return <label className="ip520-number">{label}<span><input type="number" min={min} step="0.1" value={value} onChange={(event) => onChange(Number(event.target.value))} /><button type="button" onClick={() => onChange(Math.max(min, value - 0.1))}><Minus size={13} /></button><button type="button" onClick={() => onChange(value + 0.1)}><Plus size={13} /></button></span></label>; }
function ProbabilityGraph({ title, line, z, value, kind, onPointer }: { title: string; line: string; z: number; value: number; kind: "cdf" | "pdf"; onPointer?: (event: PointerEvent<SVGSVGElement>) => void }) { const x = 8 + (z + 4) / 8 * 84, y = 90 - value * (kind === "cdf" ? 76 : 68); return <article className={`ip520-graph ${kind}`}><h3>{title}</h3><svg viewBox="0 0 100 100" preserveAspectRatio="none" onPointerDown={onPointer ? (event) => { event.currentTarget.setPointerCapture(event.pointerId); onPointer(event); } : undefined} onPointerMove={onPointer ? (event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) onPointer(event); } : undefined}><line className="axis" x1="6" y1="90" x2="95" y2="90" /><polyline points={line} /><line className="marker" x1={x} y1="8" x2={x} y2="90" /><circle cx={x} cy={y} r="2" /></svg><strong>x = {z.toFixed(4)}</strong></article>; }
