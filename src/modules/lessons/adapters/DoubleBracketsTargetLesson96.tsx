import { ArrowLeft, ArrowRight, Check, Eye, RefreshCw, RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect, useState, type DragEvent, type KeyboardEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./DoubleBracketsTargetLesson96.css";

type Challenge = { variable: string; first: number; second: number };
const challenges: Challenge[] = [
  { variable: "y", first: 4, second: 1 },
  { variable: "a", first: 2, second: 5 },
  { variable: "m", first: 3, second: 2 },
];
const bracket = (variable: string, constant: number) => `(${variable} + ${constant})`;
const polynomial = (variable: string, first: number, second: number) => `${variable}² + ${first + second}${variable} + ${first * second}`;

export default function DoubleBracketsTargetLesson96({ resetToken, onInteraction }: LessonAdapterProps) {
  const [variable, setVariable] = useState("x");
  const [first, setFirst] = useState(2);
  const [second, setSecond] = useState(3);
  const [checkValue, setCheckValue] = useState(1);
  const [showProducts, setShowProducts] = useState(true);
  const [combineMiddle, setCombineMiddle] = useState(true);
  const [checkEnabled, setCheckEnabled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [dragging, setDragging] = useState("");
  const [middleDrops, setMiddleDrops] = useState<string[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState("y² + 5y + 4");
  const [challengeChecked, setChallengeChecked] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const middle = first + second;
  const constant = first * second;
  const expression = `${bracket(variable, first)}${bracket(variable, second)}`;
  const expanded = polynomial(variable, first, second);
  const uncombined = `${variable}² + ${second}${variable} + ${first}${variable} + ${constant}`;
  const originalValue = (checkValue + first) * (checkValue + second);
  const expandedValue = checkValue ** 2 + middle * checkValue + constant;
  const challenge = challenges[challengeIndex];
  const challengeExpected = polynomial(challenge.variable, challenge.first, challenge.second);
  const challengeCorrect = challengeAnswer.replace(/\s/g, "").toLowerCase() === challengeExpected.replace(/\s/g, "").toLowerCase();
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const reset = () => { setVariable("x"); setFirst(2); setSecond(3); setCheckValue(1); setShowProducts(true); setCombineMiddle(true); setCheckEnabled(true); setChecked(true); setTab("Interact"); setDragging(""); setMiddleDrops([]); setChallengeIndex(0); setChallengeAnswer("y² + 5y + 4"); setChallengeChecked(true); setShowSolution(false); setActions(0); onInteraction(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateFirst = (next: number) => { setFirst(Math.max(1, Math.min(6, next))); setChecked(false); setMiddleDrops([]); act(); };
  const updateSecond = (next: number) => { setSecond(Math.max(1, Math.min(6, next))); setChecked(false); setMiddleDrops([]); act(); };
  const startDrag = (event: DragEvent<HTMLButtonElement>, source: string) => { event.dataTransfer.setData("text/middle-product", source); setDragging(source); };
  const dropMiddle = (event: DragEvent<HTMLElement>) => { event.preventDefault(); const source = event.dataTransfer.getData("text/middle-product"); if (!source) return; setMiddleDrops((current) => current.includes(source) ? current : [...current, source]); setCombineMiddle(true); setDragging(""); act(); };
  const nextChallenge = () => { const next = (challengeIndex + 1) % challenges.length; const item = challenges[next]; setChallengeIndex(next); setChallengeAnswer(polynomial(item.variable, item.first, item.second)); setChallengeChecked(true); setShowSolution(false); act(); };
  const gradeChallenge = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") { setChallengeChecked(true); act(); } };

  return <div className="double96-page" data-testid="algebra-mockup-0153" data-dedicated-lesson="96" data-object-model="draggable-four-product-binomial-area-middle-term-combination-substitution-proof-graded-challenge-model" data-variable={variable} data-first={first} data-second={second} data-check-value={checkValue} data-expression={expression} data-uncombined={uncombined} data-expanded={expanded} data-middle={middle} data-constant={constant} data-original-value={originalValue} data-expanded-value={expandedValue} data-equivalent={originalValue === expandedValue} data-show-products={showProducts} data-combine-middle={combineMiddle} data-check-enabled={checkEnabled} data-checked={checked} data-tab={tab} data-dragging={dragging} data-middle-drops={middleDrops.join(",")} data-challenge={challengeIndex} data-challenge-answer={challengeExpected} data-challenge-correct={challengeChecked && challengeCorrect} data-show-solution={showSolution} data-actions={actions}>
    <nav className="double96-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>96 Double Brackets</b></nav>
    <header className="double96-header"><div><b>ALGEBRA</b><strong>EXPRESSIONS AND MANIPULATION</strong></div><h1>Double Brackets</h1><p>Expand binomial products using area tiles.</p><nav><b>Intermediate</b><b>Algebra</b><b>6-10 min</b><b>Area tiles</b></nav><aside><h2>In this lesson</h2><p>✓ Use area tiles to expand {expression}</p><p>✓ See the four products: {variable}², {second}{variable}, {first}{variable}, {constant}</p><p>✓ Combine like middle terms</p><p>✓ Verify by substitution ({variable} = {checkValue})</p></aside></header>
    <nav className="double96-tabs">{["Interact", "Learn", "Examples", "Formula", "Practice"].map((name) => <button type="button" className={tab === name ? "active" : ""} key={name} onClick={() => { setTab(name); act(); }}>{name}</button>)}</nav>
    <main className="double96-layout"><section className="double96-area"><header><h2>Area Tiles Model</h2><p>Multiply each term in one bracket by each term in the other.</p></header><section className={`double96-visual ${showProducts ? "products" : ""}`}><h3><span>{variable}</span><span>+ {second}</span></h3><b className="double96-side-x">{variable}</b><b className="double96-side-c">+ {first}</b><div className="double96-grid"><strong>{variable}²</strong><button type="button" draggable aria-label="Drag second middle product" onDragStart={(event) => startDrag(event, "second")} onDragEnd={() => setDragging("")}>{second}{variable}</button><button type="button" draggable aria-label="Drag first middle product" onDragStart={(event) => startDrag(event, "first")} onDragEnd={() => setDragging("")}>{first}{variable}</button><div className="double96-units" style={{ gridTemplateColumns: `repeat(${second},1fr)`, gridTemplateRows: `repeat(${first},1fr)` }}>{Array.from({ length: constant }, (_, index) => <i key={index}>1</i>)}<b>{constant}</b></div></div></section><section className="double96-combine" onDragOver={(event) => event.preventDefault()} onDrop={dropMiddle}><h3>Combine the middle terms</h3><div><b>{second}{variable}</b><span>+</span><b>{first}{variable}</b><span>=</span><strong>{middle}{variable}</strong></div><footer><b>Final result</b><strong>{combineMiddle ? expanded : uncombined}</strong></footer></section></section>
      <aside className="double96-builder"><header><h2>Build your expression</h2><button type="button" aria-label="Reset expression" onClick={reset}><RotateCcw /></button></header><label>Bracket 1<div><input aria-label="First variable" value={variable} maxLength={1} onChange={(event) => { setVariable(event.target.value.replace(/[^a-z]/gi, "").slice(0, 1) || "x"); setChecked(false); act(); }} /><span>+</span><select aria-label="First constant" value={first} onChange={(event) => updateFirst(Number(event.target.value))}>{[1,2,3,4,5,6].map((value) => <option key={value}>{value}</option>)}</select></div></label><label>Bracket 2<div><input aria-label="Second variable" value={variable} readOnly /><span>+</span><select aria-label="Second constant" value={second} onChange={(event) => updateSecond(Number(event.target.value))}>{[1,2,3,4,5,6].map((value) => <option key={value}>{value}</option>)}</select></div></label><hr /><label>Check by substitution<div className="double96-check-value"><span>Set {variable} =</span><input aria-label="Substitution value" type="number" value={checkValue} onChange={(event) => { setCheckValue(Number(event.target.value)); setChecked(false); act(); }} /></div></label><hr /><h3>Options</h3><Toggle label="Show four products" value={showProducts} onToggle={() => { setShowProducts((current) => !current); act(); }} /><Toggle label="Combine middle terms" value={combineMiddle} onToggle={() => { setCombineMiddle((current) => !current); act(); }} /><Toggle label="Check by substitution" value={checkEnabled} onToggle={() => { setCheckEnabled((current) => !current); act(); }} /></aside>
      <section className="double96-result"><h2>Result</h2><p>Expanded expression</p><strong>{combineMiddle ? expanded : uncombined}</strong>{checkEnabled && <><h3>Check at {variable} = {checkValue}<b>{checked ? "✓ Matches" : "Ready"}</b></h3><p>Original: &nbsp;&nbsp;&nbsp;&nbsp;({checkValue} + {first})({checkValue} + {second}) = {originalValue}</p><p>Expanded: &nbsp; {checkValue}² + {middle}({checkValue}) + {constant} = {expandedValue}</p><footer><Check />Same value: {expandedValue}</footer></>}</section>
      <section className="double96-steps"><h2>Step-by-step multiplication</h2><div><article><i>1</i><span><b>{variable} times {variable}</b><p>{variable} × {variable} = {variable}²</p><small>Top-left area</small><strong>{variable}²</strong></span></article><em>→</em><article><i>2</i><span><b>{variable} times {second} and {first} times {variable}</b><p>{variable} × {second} = {second}{variable}<br />{first} × {variable} = {first}{variable}</p><small>Middle terms</small><strong>{second}{variable} + {first}{variable}</strong></span></article><em>→</em><article><i>3</i><span><b>{first} times {second}</b><p>{first} × {second} = {constant}</p><small>Bottom-right area</small><strong>{constant}</strong></span></article><em>→</em><article><i>4</i><span><b>Combine middle terms</b><p>{second}{variable} + {first}{variable} = {middle}{variable}</p><small>Final expression</small><strong>{expanded}</strong></span></article></div></section>
      <section className="double96-cards"><article><h2>General Rule</h2><strong>(a + b)(c + d) = ac + ad + bc + bd</strong><p>Each term in the first bracket is<br />multiplied by each term in the second.</p><footer>Then, combine like terms.</footer></article><article><h2><TriangleAlert />Watch out!</h2><b>Don't miss the middle terms.</b><p>Only multiplying {variable} × {variable} and {first} × {second} gives<br />{variable}² + {constant}, which is incomplete.</p><strong>{expanded}.</strong></article><article><h2>Worked Example</h2><strong>{expression}<br />= {uncombined}<br />= {expanded}</strong><footer><Check />Verified at {variable} = {checkValue}: {expandedValue}</footer></article></section>
      <section className="double96-practice"><h2>Try it yourself</h2><p>Expand using area tiles.</p><strong>{bracket(challenge.variable, challenge.first)}{bracket(challenge.variable, challenge.second)}</strong><label>Your answer<input aria-label="Challenge answer" value={challengeAnswer} onChange={(event) => { setChallengeAnswer(event.target.value); setChallengeChecked(false); act(); }} onKeyDown={gradeChallenge} />{challengeChecked && challengeCorrect && <Check />}</label><b className={challengeChecked && challengeCorrect ? "correct" : ""}>{challengeChecked ? challengeCorrect ? "✓ Correct!" : "Try again" : "Press Enter"}</b><button type="button" onClick={() => { setShowSolution((current) => !current); act(); }}><Eye />{showSolution ? "Hide area tiles solution" : "Show area tiles solution"}</button>{showSolution && <aside>{challenge.variable}² | {challenge.second}{challenge.variable}<br />{challenge.first}{challenge.variable} | {challenge.first * challenge.second}</aside>}<button type="button" className="double96-new" onClick={nextChallenge}><RefreshCw />New challenge</button></section>
      <nav className="double96-navigation"><a href="/lessons/algebra/95-expanding-brackets"><ArrowLeft /><span>Previous<b>Expanding Brackets</b></span></a><a href="/lessons/algebra/97-factorisation"><span>Next<b>Factorisation</b></span><ArrowRight /></a></nav><footer className="double96-footer"><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.<br />www.IndianServers.com info@IndianServers.com</small><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav></footer>
    </main>
  </div>;
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) { return <button type="button" role="switch" aria-checked={value} onClick={onToggle}><span>{label}</span><i className={value ? "on" : ""}><b /></i></button>; }
