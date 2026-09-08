import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  clampCumulativeX,
  cumulativeDensity,
  cumulativeProbability,
  cumulativeWorkedValues,
  discreteMasses,
  type CumulativeMode,
} from "./cumulativeDistributionLessonModel";
import "./CumulativeDistributionLesson518.css";

export default function CumulativeDistributionLesson518({ resetToken, onInteraction }: LessonAdapterProps) {
  return <CumulativeActivity key={resetToken} onInteraction={onInteraction} />;
}

function CumulativeActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [mode, setMode] = useState<CumulativeMode>("continuous");
  const [x, setX] = useState(1.4);
  const [answers, setAnswers] = useState([1, 3]);
  const [checked, setChecked] = useState([true, true]);
  const probability = cumulativeProbability(x, mode);
  const density = cumulativeDensity(x, mode);
  const rows = useMemo(() => cumulativeWorkedValues(mode), [mode]);

  const updateX = (value: number) => {
    setX(Math.round(clampCumulativeX(value) * 100) / 100);
    onInteraction();
  };
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    updateX(((event.clientX - rect.left) / rect.width - 0.1) / 0.4);
  };
  const reset = () => {
    setMode("continuous");
    setX(1.4);
    setAnswers([1, 3]);
    setChecked([true, true]);
    onInteraction();
  };

  const questions = [
    { text: "For F(x) = x^2/4 on 0 <= x <= 2, what is F(1.5)?", options: [0.375, 0.5625, 0.75, 0.9375], correct: 1 },
    { text: "Which statement is true about every CDF F(x)?", options: ["It may decrease.", "It can exceed 1.", "Its limit at negative infinity is 1.", "It is non-decreasing and stays between 0 and 1."], correct: 3 },
  ];

  return <div className="cdf518" data-testid="probability-mockup-0481" data-target-family="probability-and-distributions">
    <header className="cdf518-hero">
      <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
      <h2>Cumulative Distribution</h2>
      <p>Understand cumulative probability.</p>
      <article><b>Learning objective</b><p>Learn how cumulative distribution F(x) gives the probability that a random variable X is less than or equal to x.</p></article>
      <button type="button" onClick={reset}><RotateCcw size={14} />Reset Lab</button>
    </header>
    <nav><b>Interactive Lab</b><span>Explain</span><span>Examples</span><span>Formulas</span><span>Know more</span></nav>

    <section className="cdf518-lab">
      <header><div><h3>Interactive Lab</h3><p>Explore how the cumulative distribution function F(x) accumulates probability.<br />Drag the marker on either plot to see how areas and values correspond.</p></div><fieldset>{(["continuous", "discrete"] as CumulativeMode[]).map((value) => <button type="button" key={value} className={mode === value ? "active" : ""} onClick={() => { setMode(value); setX(1.4); onInteraction(); }}>{value[0].toUpperCase() + value.slice(1)}</button>)}</fieldset></header>
      <div className="cdf518-plots">
        <DistributionGraph kind="pdf" mode={mode} x={x} value={density} onPointer={updateFromPointer} />
        <DistributionGraph kind="cdf" mode={mode} x={x} value={probability} onPointer={updateFromPointer} />
      </div>
      <label className="cdf518-slider"><b>Drag x</b><input aria-label="Cumulative x value" type="range" min="0" max="2" step="0.01" value={x} onChange={(event) => updateX(Number(event.target.value))} /><strong>x = {x.toFixed(2)}</strong></label>
      <div className="cdf518-definition">
        <article><h3>Definition</h3><p>The cumulative distribution function (CDF) of a random variable X is</p><strong>F(x) = P(X &lt;= x) = integral from -infinity to x of f(t) dt.</strong><p>It gives the probability that X takes a value less than or equal to x.</p></article>
        <article><h3>Key properties to check</h3><p><Check size={14} /> Monotonicity: F(x1) &lt;= F(x2) if x1 &lt;= x2</p><p><Check size={14} /> Bounds: 0 &lt;= F(x) &lt;= 1</p><p><Check size={14} /> Limits: F(-infinity) = 0 and F(infinity) = 1</p></article>
      </div>
      <div className="cdf518-values">
        <article><h3>Worked values for {mode === "continuous" ? "F(x) = x^2 / 4" : "the discrete CDF"}</h3><table><thead><tr><th>x</th><th>F(x)</th><th>Interpretation</th></tr></thead><tbody>{rows.map((row) => <tr key={row.x} className={Math.abs(row.x - x) < 0.011 ? "current" : ""}><td>{row.x.toFixed(row.x % 1 ? 1 : 0)}</td><td>{row.cumulative.toFixed(4)}</td><td>P(X &lt;= {row.x}) = {row.cumulative.toFixed(4)}</td></tr>)}</tbody></table></article>
        <article><h3>At the endpoints</h3><strong>F(0) = {cumulativeProbability(0, mode).toFixed(mode === "continuous" ? 0 : 1)}</strong><strong>F(2) = 1</strong><p>As x moves from the lower to upper endpoint, F(x) increases to 1.</p><MiniCdf mode={mode} /></article>
      </div>
      <div className="cdf518-insights"><article><h3>Key insight</h3><p>F(x) is the running total of probability. The area under f(x) from the left endpoint to x is exactly F(x).</p></article><article><h3>Common misconception</h3><p>Students confuse f(x) and F(x). The density f(x) is a rate, while F(x) is accumulated probability.</p></article></div>
    </section>

    <section className="cdf518-quiz"><header><div><h3>Quick knowledge check</h3><p>Test your understanding.</p></div><strong>Score: {questions.reduce((score, question, index) => score + Number(checked[index] && answers[index] === question.correct), 0)} / 2</strong></header>{questions.map((question, index) => <article key={question.text}><div><b>{index + 1}. {question.text}</b>{question.options.map((option, optionIndex) => <label key={String(option)} className={answers[index] === optionIndex ? "selected" : ""}><input type="radio" name={`cdf-question-${index}`} checked={answers[index] === optionIndex} onChange={() => { const next = [...answers]; next[index] = optionIndex; setAnswers(next); const nextChecked = [...checked]; nextChecked[index] = false; setChecked(nextChecked); onInteraction(); }} />{String.fromCharCode(65 + optionIndex)}. {typeof option === "number" ? option.toFixed(4) : option}</label>)}</div><aside className={checked[index] && answers[index] === question.correct ? "correct" : checked[index] ? "incorrect" : "pending"}><Check size={15} /><b>{checked[index] ? answers[index] === question.correct ? "Correct!" : "Try again" : "Choose an answer"}</b><button type="button" onClick={() => { const next = [...checked]; next[index] = true; setChecked(next); }}>Check</button></aside></article>)}</section>
    <footer><button type="button" onClick={reset}><RotateCcw size={14} />Reset lesson</button><span>Previous: 517 Probability Plot &nbsp; Next: 519 Interval / Tail Probability</span></footer>
  </div>;
}

function DistributionGraph({ kind, mode, x, value, onPointer }: { kind: "pdf" | "cdf"; mode: CumulativeMode; x: number; value: number; onPointer: (event: PointerEvent<SVGSVGElement>) => void }) {
  const samples = Array.from({ length: 81 }, (_, index) => { const sampleX = index / 40; return { x: sampleX, y: kind === "pdf" ? cumulativeDensity(sampleX, mode) : cumulativeProbability(sampleX, mode) }; });
  const px = (valueX: number) => 10 + valueX * 40;
  const py = (valueY: number) => 88 - valueY * 70;
  const continuousLine = samples.map((point) => `${px(point.x)},${py(point.y)}`).join(" ");
  const discreteLine = discreteMasses.map((point, index) => `${px(point.x)},${py(kind === "pdf" ? point.probability : discreteMasses.slice(0, index + 1).reduce((sum, item) => sum + item.probability, 0))}`).join(" ");
  return <article className={`cdf518-graph ${kind}`}><h3>{kind === "pdf" ? "Probability Density Function f(x)" : "Cumulative Distribution Function F(x)"}</h3><strong>{mode === "continuous" ? kind === "pdf" ? "f(x) = x/2, 0 <= x <= 2" : "F(x) = x^2/4, 0 <= x <= 2" : kind === "pdf" ? "Discrete probability masses" : "Cumulative probability steps"}</strong><svg viewBox="0 0 100 100" preserveAspectRatio="none" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onPointer(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) onPointer(event); }}><line className="axis" x1="10" y1="88" x2="94" y2="88" /><line className="axis" x1="10" y1="8" x2="10" y2="88" />{kind === "pdf" && mode === "continuous" && <polygon className="area" points={`10,88 ${continuousLine.split(" ").filter((_, index) => index <= Math.round(x * 40)).join(" ")} ${px(x)},88`} />}{mode === "continuous" ? <polyline points={continuousLine} /> : <polyline className="steps" points={discreteLine} />}{mode === "discrete" && discreteMasses.map((point, index) => { const y = kind === "pdf" ? point.probability : discreteMasses.slice(0, index + 1).reduce((sum, item) => sum + item.probability, 0); return <circle key={point.x} cx={px(point.x)} cy={py(y)} r="1.7" />; })}<line className="marker" x1={px(x)} y1="8" x2={px(x)} y2="88" /><circle className="marker-dot" cx={px(x)} cy={py(value)} r="2.1" /></svg><p><i />{kind === "pdf" ? "Area left of x" : "Cumulative probability F(x)"}<b>{kind === "cdf" ? `= ${value.toFixed(4)}` : `= F(${x.toFixed(2)})`}</b></p></article>;
}

function MiniCdf({ mode }: { mode: CumulativeMode }) {
  const points = Array.from({ length: 41 }, (_, index) => { const x = index / 20; return `${5 + x * 45},${46 - cumulativeProbability(x, mode) * 38}`; }).join(" ");
  return <svg className="cdf518-mini" viewBox="0 0 100 50" preserveAspectRatio="none"><line x1="5" y1="46" x2="98" y2="46" /><line x1="5" y1="4" x2="5" y2="46" /><polyline points={points} /></svg>;
}
