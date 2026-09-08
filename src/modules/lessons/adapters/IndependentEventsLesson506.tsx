import { Check, CircleAlert, Pause, Play, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  conditionalProbability,
  defaultSpinnerWeights,
  independenceSummary,
  normalizeWeights,
  simulateSpinnerCoin,
  type SpinnerColor,
  type SpinnerWeights,
} from "./independentEventsLessonModel";
import "./IndependentEventsLesson506.css";

const colors: SpinnerColor[] = ["blue", "red", "green"];

export default function IndependentEventsLesson506({ resetToken, onInteraction }: LessonAdapterProps) {
  return <IndependentEventsActivity key={resetToken} onInteraction={onInteraction} />;
}

function IndependentEventsActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [trials, setTrials] = useState(600);
  const [weights, setWeights] = useState<SpinnerWeights>(defaultSpinnerWeights);
  const [independentCoin, setIndependentCoin] = useState(true);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [seed, setSeed] = useState(506);
  const [answers, setAnswers] = useState<Record<number, "yes" | "no" | undefined>>({});
  const [checked, setChecked] = useState<number[]>([]);
  const normalized = useMemo(() => normalizeWeights(weights), [weights]);
  const counts = useMemo(() => simulateSpinnerCoin(trials, weights, independentCoin, seed), [independentCoin, seed, trials, weights]);
  const summary = useMemo(() => independenceSummary(counts), [counts]);
  const heads = colors.reduce((sum, color) => sum + counts[color].heads, 0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setTrials((value) => Math.min(5000, value + 25));
      setSeed((value) => value + 1);
    }, Math.max(120, 700 - speed * 10));
    return () => window.clearInterval(timer);
  }, [running, speed]);

  const reset = () => {
    setTrials(600); setWeights(defaultSpinnerWeights); setIndependentCoin(true);
    setRunning(false); setSpeed(50); setSeed(506); setAnswers({}); setChecked([]); onInteraction();
  };
  const setWeight = (color: SpinnerColor, value: number) => {
    setWeights((current) => ({ ...current, [color]: value })); setSeed((valueSeed) => valueSeed + 1); onInteraction();
  };

  return <div className="ie506" data-testid="probability-mockup-0469" data-target-family="probability-and-distributions">
    <header className="ie506-hero"><div><span>DATA AND PROBABILITY · PROBABILITY AND DISTRIBUTIONS</span><h2>Independent Events</h2><p>Test independence of two events.</p></div><article><b>Objective</b><p>Verify when P(A ∩ B) = P(A)P(B) using experiment, calculation, and reasoning.</p></article></header>
    <nav aria-label="Lesson sections"><b>Interact</b><span>Learn</span><span>Example</span><span>Formula</span><span>Practice</span></nav>
    <section className="ie506-lab">
      <div className="ie506-experiment"><h3>Two-Event Spinner & Coin Experiment</h3><p>Event A: Spinner shows Blue (B)<br />Event B: Coin shows Heads (H)</p><div className="ie506-objects"><div className="ie506-spinner" style={{ background: `conic-gradient(#79a9ee 0 ${normalized.blue * 100}%,#ef8588 ${normalized.blue * 100}% ${(normalized.blue + normalized.red) * 100}%,#8fd889 ${(normalized.blue + normalized.red) * 100}% 100%)` }}><b>Blue</b><span>Red</span><i>Green</i></div><div className="ie506-coin">H</div></div><div className="ie506-controls"><label>Trials<input type="number" min="50" max="5000" step="50" value={trials} onChange={(event) => { setTrials(Math.max(50, Math.min(5000, Number(event.target.value)))); onInteraction(); }} /></label><label>Speed<input type="range" min="1" max="60" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label><button type="button" onClick={() => { setRunning((value) => !value); onInteraction(); }}>{running ? <Pause size={14} /> : <Play size={14} />}{running ? "Pause" : "Run simulation"}</button><button type="button" onClick={reset}><RotateCcw size={14} /> Reset</button></div><select aria-label="Probability model" value={independentCoin ? "independent" : "dependent"} onChange={(event) => { setIndependentCoin(event.target.value === "independent"); setSeed((value) => value + 1); onInteraction(); }}><option value="independent">Mode: Independent</option><option value="dependent">Mode: Dependent</option></select></div>
      <div className="ie506-results"><h3>Joint Outcomes (Counts)</h3><JointTable counts={counts} /><article><h3>Empirical Probabilities <small>(from {trials} trials)</small></h3><div className="ie506-probs">{colors.map((color) => <p key={color}>P({color[0].toUpperCase()}) = <b>{((counts[color].heads + counts[color].tails) / trials).toFixed(4)}</b></p>)}<p>P(H) = <b>{(heads / trials).toFixed(4)}</b></p><p>P(T) = <b>{(1 - heads / trials).toFixed(4)}</b></p></div></article></div>
    </section>
    <section className="ie506-verdict"><p>P(A)P(B) = {summary.pBlue.toFixed(4)} × {summary.pHeads.toFixed(4)} = <b>{summary.product.toFixed(4)}</b></p><p>P(A ∩ B) = {counts.blue.heads}/{summary.total} = <b>{summary.pJoint.toFixed(4)}</b></p><p>Difference <b>{summary.difference.toFixed(4)}</b></p><strong className={summary.independent ? "yes" : "no"}>{summary.independent ? <Check size={18} /> : <CircleAlert size={18} />}{summary.independent ? "Likely Independent" : "Dependent"}<small>Difference {summary.independent ? "<" : "≥"} 0.02</small></strong></section>
    <section className="ie506-analysis"><article><h3>Sample Space & Outcome Map</h3><p>Ω = {"{(B,H), (B,T), (R,H), (R,T), (G,H), (G,T)}"}</p><JointTable counts={counts} probabilities /></article><article><h3>Conditional Probabilities</h3>{colors.map((color) => <p key={color}>P(H | {color[0].toUpperCase()}) = {counts[color].heads}/{counts[color].heads + counts[color].tails} = <b>{conditionalProbability(counts, color).toFixed(4)}</b></p>)}</article><article><h3>Dependency Control</h3><p>Change spinner weights to see when events become dependent.</p>{colors.map((color) => <label key={color}>P({color[0].toUpperCase()})<input type="range" min="5" max="90" value={Math.round(weights[color] * 100)} onChange={(event) => setWeight(color, Number(event.target.value) / 100)} /><b>{Math.round(normalized[color] * 100)}%</b></label>)}<label className="ie506-toggle"><input type="checkbox" checked={independentCoin} onChange={(event) => { setIndependentCoin(event.target.checked); setSeed((value) => value + 1); onInteraction(); }} /><span /> Independent Coin (P(H) = 0.5)</label><aside><b>What changes dependence?</b><p>If P(H | B) ≠ P(H), then A and B are dependent. Try switching the coin model.</p></aside></article></section>
    <section className="ie506-takeaways"><article><h3>Key Takeaways</h3><p>✓ Events A and B are independent iff P(A ∩ B) = P(A)P(B).</p><p>✓ Equivalently, P(A | B) = P(A) and P(B | A) = P(B).</p><p>✓ With a fair independent coin, spinner and coin outcomes factor.</p></article><article><h3>Common Misconception Guard</h3><p>✕ Mistake: P(A ∩ B) = P(A) + P(B)</p><p>✓ Correct rule: P(A ∩ B) = P(A)P(B)</p></article></section>
    <section className="ie506-practice"><h3>Practice: Check Independence</h3><div>{[
      ["Die and Coin (fair)", "A: Die shows 4; B: Coin shows Heads", "yes"],
      ["Two cards (without replacement)", "A: First card is Ace; B: Second card is Ace", "no"],
      ["Spinner P(Blue)=0.6 and fair coin", "A: Spinner shows Blue; B: Coin shows Heads", "yes"],
    ].map(([title, text, correct], index) => <article key={title}><b><i>{index + 1}</i>{title}</b><p>{text}</p><fieldset><legend>Independent?</legend>{(["yes", "no"] as const).map((answer) => <label key={answer}><input type="radio" name={`independence-${index}`} checked={answers[index] === answer} onChange={() => { setAnswers((current) => ({ ...current, [index]: answer })); setChecked((current) => current.filter((value) => value !== index)); onInteraction(); }} /> {answer === "yes" ? "Yes" : "No"}</label>)}</fieldset><button type="button" onClick={() => { setChecked((current) => current.includes(index) ? current : [...current, index]); onInteraction(); }}>Check</button>{checked.includes(index) && <span className={answers[index] === correct ? "correct" : "incorrect"}>{answers[index] === correct ? "Correct" : "Review the conditional probabilities"}</span>}</article>)}</div><button type="button" onClick={() => { setAnswers({ 0: "yes", 1: "no", 2: "yes" }); setChecked([0, 1, 2]); onInteraction(); }}><Trophy size={15} /> Reveal All Solutions</button></section>
    <footer><button type="button" onClick={reset}><RotateCcw size={14} /> Reset lesson</button><span>Previous: Multiplication Rule &nbsp; Next: Mutually Exclusive Events →</span></footer>
  </div>;
}

function JointTable({ counts, probabilities = false }: { counts: ReturnType<typeof simulateSpinnerCoin>; probabilities?: boolean }) {
  const total = Object.values(counts).reduce((sum, count) => sum + count.heads + count.tails, 0);
  const heads = colors.reduce((sum, color) => sum + counts[color].heads, 0);
  return <table><thead><tr><th>Spinner \ Coin</th><th>Heads (H)</th><th>Tails (T)</th><th>Row Total</th></tr></thead><tbody>{colors.map((color) => { const row = counts[color].heads + counts[color].tails; return <tr key={color}><th>{color[0].toUpperCase() + color.slice(1)}</th><td>{counts[color].heads}{probabilities && <small>({(counts[color].heads / total).toFixed(4)})</small>}</td><td>{counts[color].tails}{probabilities && <small>({(counts[color].tails / total).toFixed(4)})</small>}</td><td>{row}</td></tr>; })}<tr><th>Column Total</th><td>{heads}</td><td>{total - heads}</td><td>{total}</td></tr></tbody></table>;
}
