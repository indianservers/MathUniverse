import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { uniformAnalysis } from "./uniformLessonModel";
import "./UniformDistributionLesson527.css";

type Endpoint = "a" | "b" | "c" | "d";

export default function UniformDistributionLesson527({ resetToken, onInteraction }: LessonAdapterProps) {
  return <UniformActivity key={resetToken} onInteraction={onInteraction} />;
}

function UniformActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [a, setA] = useState(2), [b, setB] = useState(8), [c, setC] = useState(3.5), [d, setD] = useState(6);
  const [dragging, setDragging] = useState<Endpoint | null>(null);
  const [answers, setAnswers] = useState([1, 2, 0]), [checked, setChecked] = useState([true, true, true]);
  const result = useMemo(() => uniformAnalysis(a, b, c, d), [a, b, c, d]);
  const change = (key: Endpoint, value: number) => {
    const bounded = Math.max(-10, Math.min(10, value));
    if (key === "a") { const next = Math.min(b - 0.1, bounded); setA(next); setC((old) => Math.max(next, old)); setD((old) => Math.max(next, old)); }
    else if (key === "b") { const next = Math.max(a + 0.1, bounded); setB(next); setC((old) => Math.min(next, old)); setD((old) => Math.min(next, old)); }
    else if (key === "c") setC(Math.max(a, Math.min(d, bounded)));
    else setD(Math.max(c, Math.min(b, bounded)));
    onInteraction();
  };
  const xToSvg = (value: number) => 5 + ((value + 10) / 20) * 90;
  const valueFromPointer = (event: PointerEvent<SVGSVGElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return ((event.clientX - rect.left) / rect.width - 0.05) / 0.9 * 20 - 10; };
  const startDrag = (event: PointerEvent<SVGSVGElement>) => { const value = valueFromPointer(event); const points: Array<{ key: Endpoint; value: number }> = [{ key: "a", value: a }, { key: "b", value: b }, { key: "c", value: c }, { key: "d", value: d }]; const key = points.sort((left, right) => Math.abs(left.value - value) - Math.abs(right.value - value))[0].key; setDragging(key); event.currentTarget.setPointerCapture(event.pointerId); change(key, value); };
  const reset = () => { setA(2); setB(8); setC(3.5); setD(6); setDragging(null); setAnswers([1, 2, 0]); setChecked([true, true, true]); onInteraction(); };
  const questions = [{ text: "What is f(5) for X ~ U(2,8)?", options: ["0", "1/6", "1/8", "1/2"], correct: 1 }, { text: "If X ~ U(1,9), what is Var(X)?", options: ["64/12", "8/3", "16/3", "4"], correct: 2 }, { text: "For X ~ U(0,4), what is P(1 <= X <= 2)?", options: ["0.25", "0.5", "0.75", "1"], correct: 0 }];

  return <div className="un527" data-testid="probability-mockup-0490" data-target-family="probability-and-distributions">
    <header className="un527-hero"><span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span><h2>Uniform Distribution</h2><p>Model equally likely intervals.</p><aside><article><b>Learning Objective</b><p>Understand the uniform distribution on [a,b], compute probabilities, mean and variance, and explore properties through an interactive lab.</p></article><article><b>Key Insight</b><p>Every point in [a,b] is equally likely. Probability equals subinterval length divided by total length.</p></article></aside><button type="button" onClick={reset}><RotateCcw size={14} />Reset</button></header>
    <nav><b>Interactive Lab</b><span>Properties</span><span>Examples</span><span>Notes</span><span>Practice</span></nav>
    <section className="un527-lab"><header><div><h3>Explore the Uniform Distribution</h3><p>Drag the interval endpoints a and b to change the distribution. Select [c,d] to compute probability.</p></div><strong>Distribution: U(a,b)</strong></header>
      <div className="un527-controls"><EndpointControl label="a (left endpoint)" value={a} onChange={(value) => change("a", value)} /><EndpointControl label="b (right endpoint)" value={b} onChange={(value) => change("b", value)} /><EndpointControl label="c (subinterval left)" value={c} onChange={(value) => change("c", value)} /><EndpointControl label="d (subinterval right)" value={d} onChange={(value) => change("d", value)} /></div>
      <div className="un527-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none" onPointerDown={startDrag} onPointerMove={(event) => { if (dragging && event.currentTarget.hasPointerCapture(event.pointerId)) change(dragging, valueFromPointer(event)); }} onPointerUp={() => setDragging(null)}><line className="axis" x1="3" y1="82" x2="97" y2="82" /><polygon className="support" points={`${xToSvg(a)},82 ${xToSvg(a)},28 ${xToSvg(b)},28 ${xToSvg(b)},82`} /><polygon className="selected" points={`${xToSvg(c)},82 ${xToSvg(c)},28 ${xToSvg(d)},28 ${xToSvg(d)},82`} />{([{ key: "a", value: a }, { key: "b", value: b }, { key: "c", value: c }, { key: "d", value: d }] as Array<{ key: Endpoint; value: number }>).map((item) => <g key={item.key}><line className={item.key === "c" || item.key === "d" ? "inner" : "edge"} x1={xToSvg(item.value)} y1="25" x2={xToSvg(item.value)} y2="84" /><circle cx={xToSvg(item.value)} cy="82" r="1.5" /><text x={xToSvg(item.value)} y="93">{item.key}={item.value}</text></g>)}<text x={xToSvg((a + b) / 2)} y="24">1/(b-a) = {result.height.toFixed(4)}</text></svg><aside><article><h3>Density function</h3><strong>f(x)=1/(b-a) for a &lt;= x &lt;= b; 0 otherwise</strong></article><article><h3>Current values</h3><p>a={a} &nbsp; b={b}</p><p>c={c} &nbsp; d={d}</p><p>b-a={result.width.toFixed(2)} &nbsp; d-c={result.selectedWidth.toFixed(2)}</p></article></aside></div>
      <div className="un527-results"><article><h3>Probability of [c,d]</h3><strong>P({c}&lt;=X&lt;={d})=(d-c)/(b-a)</strong><p>=({d}-{c})/({b}-{a})={result.selectedWidth.toFixed(2)}/{result.width.toFixed(2)}</p><output>Probability: {result.probability.toFixed(4)} ({(result.probability * 100).toFixed(2)}%)</output></article><article><h3>Mean and Variance</h3><p>E[X]=(a+b)/2=({a}+{b})/2={result.mean.toFixed(4)}</p><p>Var(X)=(b-a)^2/12={result.width.toFixed(2)}^2/12={result.variance.toFixed(4)}</p><p>SD(X)=sqrt(Var(X))={result.std.toFixed(4)}</p></article><article><h3>Geometric Interpretation</h3><p>Height = 1/(b-a) = {result.height.toFixed(4)}</p><p>Width = d-c = {result.selectedWidth.toFixed(2)}</p><p>Area = height x width = {result.probability.toFixed(4)}</p><svg viewBox="0 0 100 45"><rect x="10" y="8" width="80" height="28" /><rect className="selected" x={10 + ((c - a) / result.width) * 80} y="8" width={(result.selectedWidth / result.width) * 80} height="28" /></svg></article></div>
    </section>
    <section className="un527-info"><article><h3>Properties</h3><p>Support: [a,b]</p><p>PDF: f(x)=1/(b-a)</p><p>CDF: 0 below a; (x-a)/(b-a) on [a,b]; 1 above b</p><p>Mean: (a+b)/2</p><p>Variance: (b-a)^2/12</p></article><article><h3>Common Misconception</h3><p>Constant density does not make unequal intervals equally probable. Probability is proportional to interval length.</p></article><article><h3>Example</h3><p>Let X~U(2,8). Then P(4&lt;=X&lt;=7)=(7-4)/(8-2)=1/2.</p></article></section>
    <section className="un527-quiz"><h3>Quick Knowledge Check</h3>{questions.map((question, index) => <article key={question.text}><div><b>{index + 1}. {question.text}</b>{question.options.map((option, optionIndex) => <label key={option} className={answers[index] === optionIndex ? "selected" : ""}><input type="radio" checked={answers[index] === optionIndex} onChange={() => { const next = [...answers]; next[index] = optionIndex; setAnswers(next); const nextChecked = [...checked]; nextChecked[index] = false; setChecked(nextChecked); onInteraction(); }} />{String.fromCharCode(65 + optionIndex)}. {option}</label>)}</div><aside className={checked[index] && answers[index] === question.correct ? "correct" : "incorrect"}>{checked[index] && answers[index] === question.correct ? <Check size={14} /> : <X size={14} />} {checked[index] ? answers[index] === question.correct ? "Correct!" : "Try again" : "Select an answer"}<button type="button" onClick={() => { const next = [...checked]; next[index] = true; setChecked(next); }}>Check</button></aside></article>)}</section>
    <footer><button type="button" onClick={reset}><RotateCcw size={14} />Reset lesson</button><span>Previous: Negative Binomial Distribution &nbsp; Next: Normal Distribution</span></footer>
  </div>;
}

function EndpointControl({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label>{label}<input type="number" step=".1" value={value} onChange={(event) => onChange(Number(event.target.value))} /><input type="range" min="-10" max="10" step=".1" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
