import { ArrowLeft, ArrowRight, Check, ClipboardList, Lightbulb, RotateCcw, Search, Sparkles } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./SubstitutionTargetLesson94.css";

type ExpressionModel = { label: string; variable: string; coefficient: number; power: number; constant: number; initialValue: number };
const expressions: ExpressionModel[] = [
  { label: "3x + 2", variable: "x", coefficient: 3, power: 1, constant: 2, initialValue: 5 },
  { label: "x² + 3", variable: "x", coefficient: 1, power: 2, constant: 3, initialValue: -2 },
  { label: "2y − 4", variable: "y", coefficient: 2, power: 1, constant: -4, initialValue: 6 },
];
const practiceProblems = [
  { expression: "4a − 1", variable: "a", value: 3, substitution: "4(3) − 1", operation: "12 − 1", answer: 11 },
  { expression: "2b + 5", variable: "b", value: 4, substitution: "2(4) + 5", operation: "8 + 5", answer: 13 },
  { expression: "c² + 1", variable: "c", value: -3, substitution: "(−3)² + 1", operation: "9 + 1", answer: 10 },
];
const operator = (constant: number) => constant < 0 ? `− ${Math.abs(constant)}` : `+ ${constant}`;
const calculate = (model: ExpressionModel, value: number) => model.coefficient * value ** model.power + model.constant;

export default function SubstitutionTargetLesson94({ resetToken, onInteraction }: LessonAdapterProps) {
  const [expressionIndex, setExpressionIndex] = useState(0);
  const [value, setValue] = useState(5);
  const [showSlots, setShowSlots] = useState(true);
  const [useBrackets, setUseBrackets] = useState(true);
  const [checked, setChecked] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [dragging, setDragging] = useState(false);
  const [drops, setDrops] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [actions, setActions] = useState(0);
  const model = expressions[expressionIndex];
  const result = calculate(model, value);
  const multiplied = model.coefficient * value ** model.power;
  const shownValue = value < 0 ? useBrackets ? `(−${Math.abs(value)})` : String(value) : `(${value})`;
  const substituted = model.power === 2 ? `${model.coefficient === 1 ? "" : model.coefficient}${shownValue}² ${operator(model.constant)}` : `${model.coefficient}${shownValue} ${operator(model.constant)}`;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const reset = () => { setExpressionIndex(0); setValue(5); setShowSlots(true); setUseBrackets(true); setChecked(true); setTab("Interact"); setDragging(false); setDrops(0); setPracticeIndex(0); setActions(0); onInteraction(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const setChosenValue = (next: number) => { setValue(Math.max(-10, Math.min(10, next))); setChecked(false); act(); };
  const selectExpression = (index: number) => { setExpressionIndex(index); setValue(expressions[index].initialValue); setChecked(false); act(); };
  const startDrag = (event: DragEvent<HTMLButtonElement>) => { event.dataTransfer.setData("text/substitution-value", String(value)); setDragging(true); };
  const dropValue = (event: DragEvent<HTMLElement>) => { event.preventDefault(); if (!event.dataTransfer.getData("text/substitution-value")) return; setChecked(true); setDragging(false); setDrops((count) => count + 1); act(); };
  const practice = practiceProblems[practiceIndex];

  return <div className="sub94-page" data-testid="algebra-mockup-0151" data-dedicated-lesson="94" data-object-model="draggable-substitution-slot-expression-value-step-evaluation-negative-brackets-equivalence-practice-model" data-expression={model.label} data-variable={model.variable} data-value={value} data-result={result} data-substituted={substituted} data-show-slots={showSlots} data-use-brackets={useBrackets} data-checked={checked} data-tab={tab} data-dragging={dragging} data-drops={drops} data-practice={practiceIndex} data-practice-answer={practice.answer} data-actions={actions}>
    <nav className="sub94-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>94 Substitution</b></nav>
    <header className="sub94-header"><div className="sub94-eyebrows"><b>ALGEBRA</b><strong>EXPRESSIONS AND MANIPULATION</strong></div><h1>Substitution</h1><p>Evaluate expressions for chosen values.</p><div className="sub94-badges"><b>Intermediate</b><b>Algebra</b><b>6-10 min</b><b>Substitution model</b></div><nav>{["Interact", "Learn", "Examples", "Formula", "Practice"].map((name) => <button type="button" className={tab === name ? "active" : ""} key={name} onClick={() => { setTab(name); act(); }}>{name}</button>)}</nav></header>
    <main className="sub94-layout"><section className="sub94-machine"><header><span><Sparkles /></span><div><h2>Substitution Machine</h2><p>Replace the variable with the chosen value, then follow the order of operations.</p></div><button type="button" onClick={reset}><RotateCcw />Reset</button></header><section className={`sub94-expression ${showSlots ? "slots" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={dropValue}><i>f({model.variable}) =</i><strong>{model.coefficient === 1 ? "" : model.coefficient}<em>{model.variable}</em>{model.power === 2 ? "²" : ""} {operator(model.constant)}</strong></section><div className="sub94-drag-row"><button type="button" draggable aria-label="Drag chosen value" onDragStart={startDrag} onDragEnd={() => setDragging(false)}>{model.variable} = {value}</button><span>← · · · ·</span><p><b>Drag</b> or use the controls<br />to set the value of {model.variable}</p></div><h3>Step-by-step evaluation</h3><section className="sub94-steps"><article><b>Step 1</b><p>Replace variable</p><strong>f(<em>{shownValue}</em>)</strong></article><span>→</span><article><b>Step 2</b><p>{model.power === 2 ? "Apply exponent" : "Multiply"}</p><strong>{substituted}</strong></article><span>→</span><article><b>Step 3</b><p>{model.constant < 0 ? "Subtract" : "Add"}</p><strong>{multiplied} {operator(model.constant)}</strong></article><span>→</span><article><b>Step 4</b><p>Result</p><strong>{result}</strong></article></section><footer><Check /><strong>f({value}) = {result}</strong></footer></section>
      <aside className="sub94-controls"><h2>Controls</h2><label>Expression<select aria-label="Expression" value={expressionIndex} onChange={(event) => selectExpression(Number(event.target.value))}>{expressions.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}</select></label><p><b>Variable</b><span>{model.variable}</span></p><label>Value of {model.variable}<div><button type="button" aria-label="Decrease value" onClick={() => setChosenValue(value - 1)}>−</button><input aria-label="Substitution value" type="number" value={value} onChange={(event) => setChosenValue(Number(event.target.value))} /><button type="button" aria-label="Increase value" onClick={() => setChosenValue(value + 1)}>+</button></div><input aria-label="Substitution value slider" type="range" min="-10" max="10" step="1" value={value} onChange={(event) => setChosenValue(Number(event.target.value))} /><small><span>-10</span><span>0</span><span>10</span></small></label><Toggle label="Show substitution slots" value={showSlots} onToggle={() => { setShowSlots((current) => !current); act(); }} /><Toggle label="Use brackets for negatives" value={useBrackets} onToggle={() => { setUseBrackets((current) => !current); setChecked(false); act(); }} /><button type="button" className="sub94-check-button" onClick={() => { setChecked(true); act(); }}>Check value</button><section><h3>Result</h3><strong>f({value}) = {result}</strong><p>{checked ? "Correct!" : "Ready to check"} {checked && <Check />}</p></section></aside>
      <section className="sub94-rule"><h2><Lightbulb />The Rule</h2><p>Substitution means replacing every matching<br />variable with a chosen value, then simplifying.</p><ol><li>Replace every matching variable.</li><li>Use brackets for negative values.</li><li>Follow the order of operations.</li></ol><footer><b>Central idea:</b> plug in, then simplify.</footer></section>
      <section className="sub94-brackets"><h2><Sparkles />Why brackets matter (negative values)</h2><p>If a negative value is used, brackets preserve the meaning.</p><div><article><b>Correct</b><strong>x = −2 in x² + 3</strong><span>(−2)² + 3<br />= &nbsp;4 + 3<br />= &nbsp;7</span><Check /></article><article><b>Incorrect (missing brackets)</b><strong>x = −2 in x² + 3</strong><span>− 2² + 3<br />= −4 + 3<br />= −1</span><i>×</i></article></div><footer>Do not write −2² as though it were the same as (−2)².</footer></section>
      <section className="sub94-worked"><h2><ClipboardList />Worked example</h2><p>Evaluate <i>f(x) = {model.label}</i> for {model.variable} = {value}.</p><div><strong>f({value}) = {substituted}</strong><strong>= &nbsp;{multiplied} {operator(model.constant)}</strong><strong>= &nbsp;<em>{result}</em></strong></div><aside><b>So,</b><strong>f({value}) = {result}</strong></aside></section>
      <section className="sub94-practice"><h2><ClipboardList />Practice challenge</h2><p>Evaluate <i>{practice.expression}</i> when {practice.variable} = {practice.value}.</p><div><strong>{practice.expression}</strong><strong>= &nbsp;{practice.substitution}</strong><strong>= &nbsp;{practice.operation}</strong><strong>= &nbsp;<em>{practice.answer}</em></strong></div><aside><b>Answer</b><strong>{practice.answer}</strong><span>Great job!</span></aside><button type="button" onClick={() => { setPracticeIndex((index) => (index + 1) % practiceProblems.length); act(); }}>Try another</button></section>
      <section className="sub94-tips"><h2>☆ &nbsp;Quick tips</h2><div><article><Search /><span><b>Check every slot</b><small>Replace all matching variables.<br />Missing one changes the answer.</small></span></article><article><b>(−)</b><span><strong>Use brackets</strong><small>For negative values to avoid<br />changing the order of operations.</small></span></article><article><b>÷<br />+ −</b><span><strong>Simplify step by step</strong><small>Follow the order of operations<br />to get the correct result.</small></span></article></div></section>
      <nav className="sub94-navigation"><a href="/lessons/algebra/93-like-terms"><ArrowLeft /><span>Previous<b>Like Terms</b></span></a><a href="/lessons/algebra/95-expanding-brackets"><span>Next<b>Expanding Brackets</b></span><ArrowRight /></a></nav><footer className="sub94-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.<br />www.IndianServers.com &nbsp;&nbsp; info@IndianServers.com</small><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav></footer>
    </main>
  </div>;
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) { return <button type="button" role="switch" aria-checked={value} className="sub94-toggle" onClick={onToggle}><span>{label}</span><i className={value ? "on" : ""}><b /></i></button>; }
