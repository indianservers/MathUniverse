import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lightbulb, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./FactorisationTargetLesson97.css";

type Pair = [number, number];
type Challenge = { variable: string; sum: number; product: number; pair: Pair };

const challenges: Challenge[] = [
  { variable: "y", sum: 7, product: 10, pair: [5, 2] },
  { variable: "a", sum: 8, product: 15, pair: [3, 5] },
  { variable: "m", sum: 9, product: 20, pair: [4, 5] },
];

const signTerm = (coefficient: number, suffix = "") => `${coefficient < 0 ? "−" : "+"} ${Math.abs(coefficient)}${suffix}`;
const polynomial = (variable: string, sum: number, product: number) => `${variable}² ${signTerm(sum, variable)} ${signTerm(product)}`;
const factor = (variable: string, value: number) => `(${variable} ${value < 0 ? "−" : "+"} ${Math.abs(value)})`;
const factorForm = (variable: string, pair: Pair) => `${factor(variable, pair[0])}${factor(variable, pair[1])}`;
const pairKey = (pair: Pair) => `${pair[0]},${pair[1]}`;
const pairLabel = (pair: Pair) => `(${pair[0]}, ${pair[1]})`;
const pairMath = (pair: Pair, operation: "product" | "sum") => operation === "product"
  ? `${pair[0]} × ${pair[1]} = ${pair[0] * pair[1]}`
  : `${pair[0]} + ${pair[1]} = ${pair[0] + pair[1]}`;

function findPair(product: number, sum: number): Pair | null {
  for (let first = -36; first <= 36; first += 1) {
    const second = sum - first;
    if (first <= second && first * second === product) return [first, second];
  }
  return null;
}

function candidatePairs(product: number, sum: number, correct: Pair | null): Pair[] {
  const candidates: Pair[] = [[1, product]];
  if (correct) candidates.push(correct);
  else candidates.push([Math.floor(sum / 2), Math.ceil(sum / 2)]);
  const last: Pair = correct
    ? correct[0] >= 0 && correct[1] >= 0 ? [-correct[0], -correct[1]] : [Math.abs(correct[0]), Math.abs(correct[1])]
    : [-1, -product];
  candidates.push(last);
  return candidates.filter((pair, index, all) => all.findIndex((item) => pairKey(item) === pairKey(pair)) === index).slice(0, 3);
}

export default function FactorisationTargetLesson97({ resetToken, onInteraction }: LessonAdapterProps) {
  const [sum, setSum] = useState(5);
  const [product, setProduct] = useState(6);
  const [selectedPair, setSelectedPair] = useState("2,3");
  const [checkValue, setCheckValue] = useState(2);
  const [stage, setStage] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [dragging, setDragging] = useState("");
  const [areaDrops, setAreaDrops] = useState<string[]>([]);
  const [challengePair, setChallengePair] = useState("5,2");
  const [challengeAnswer, setChallengeAnswer] = useState("(y + 5)(y + 2)");
  const [challengeChecked, setChallengeChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const correctPair = useMemo(() => findPair(product, sum), [product, sum]);
  const candidates = useMemo(() => candidatePairs(product, sum, correctPair), [product, sum, correctPair]);
  const selected = candidates.find((pair) => pairKey(pair) === selectedPair) ?? candidates[0];
  const pairCorrect = Boolean(correctPair && selected && pairKey(selected) === pairKey(correctPair));
  const activePair = pairCorrect && correctPair ? correctPair : selected;
  const expression = polynomial("x", sum, product);
  const factors = factorForm("x", activePair);
  const split = `x² ${signTerm(activePair[0], "x")} ${signTerm(activePair[1], "x")} ${signTerm(product)}`;
  const originalValue = checkValue ** 2 + sum * checkValue + product;
  const factorValue = (checkValue + activePair[0]) * (checkValue + activePair[1]);
  const challenge = challenges[0];
  const challengeExpected = factorForm(challenge.variable, challenge.pair);
  const normalizedChallenge = challengeAnswer.replace(/[−\s]/g, "").replace(/-/g, "−").toLowerCase();
  const normalizedExpected = challengeExpected.replace(/[−\s]/g, "").replace(/-/g, "−").toLowerCase();
  const challengeCorrect = challengePair === pairKey(challenge.pair) && (normalizedChallenge === normalizedExpected || normalizedChallenge === factorForm(challenge.variable, [challenge.pair[1], challenge.pair[0]]).replace(/[−\s]/g, "").toLowerCase());
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const reset = () => { setSum(5); setProduct(6); setSelectedPair("2,3"); setCheckValue(2); setStage(1); setTab("Interact"); setDragging(""); setAreaDrops([]); setChallengePair("5,2"); setChallengeAnswer("(y + 5)(y + 2)"); setChallengeChecked(true); setActions(0); onInteraction(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateTargets = (nextProduct: number, nextSum: number) => {
    const boundedProduct = Math.max(-36, Math.min(36, nextProduct));
    const boundedSum = Math.max(-20, Math.min(20, nextSum));
    const nextPair = findPair(boundedProduct, boundedSum);
    setProduct(boundedProduct);
    setSum(boundedSum);
    setSelectedPair(nextPair ? pairKey(nextPair) : pairKey(candidatePairs(boundedProduct, boundedSum, null)[0]));
    setStage(1);
    setAreaDrops([]);
    act();
  };
  const choosePair = (pair: Pair) => { setSelectedPair(pairKey(pair)); setStage(pairKey(pair) === pairKey(correctPair ?? pair) ? 2 : 1); setAreaDrops([]); act(); };
  const startDrag = (event: DragEvent<HTMLButtonElement>, term: string) => { event.dataTransfer.setData("text/factor-term", term); setDragging(term); };
  const dropTerm = (event: DragEvent<HTMLElement>, expected: string) => {
    event.preventDefault();
    const term = event.dataTransfer.getData("text/factor-term");
    if (!term) return;
    setAreaDrops((current) => current.includes(`${expected}:${term}`) ? current : [...current, `${expected}:${term}`]);
    setDragging("");
    setStage((current) => Math.max(current, 3));
    act();
  };
  const gradeChallenge = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") { setChallengeChecked(true); act(); } };
  return <div className="factor97-page" data-testid="algebra-mockup-0154" data-dedicated-lesson="97" data-object-model="editable-quadratic-factor-pair-search-draggable-reverse-area-expansion-substitution-graded-practice-model" data-sum={sum} data-product={product} data-correct-pair={correctPair ? pairKey(correctPair) : ""} data-selected-pair={pairKey(activePair)} data-pair-correct={pairCorrect} data-expression={expression} data-split={split} data-factors={factors} data-check-value={checkValue} data-original-value={originalValue} data-factor-value={factorValue} data-equivalent={pairCorrect && originalValue === factorValue} data-stage={stage} data-tab={tab} data-dragging={dragging} data-area-drops={areaDrops.join("|")} data-challenge="0" data-challenge-pair={challengePair} data-challenge-answer={challengeExpected} data-challenge-correct={challengeChecked && challengeCorrect} data-actions={actions}>
    <nav className="factor97-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>97 Factorisation</b></nav>
    <header className="factor97-header"><div><b>ALGEBRA</b><strong>EXPRESSIONS AND MANIPULATION</strong></div><h1>Factorisation</h1><p>Reverse expansion.</p><nav><b>Intermediate</b><b>Algebra</b><b>6-10 min</b><b>Reverse area model</b></nav><aside><h2><Lightbulb />Key idea</h2><p>Factorisation rewrites a quadratic as a product of two binomials by finding two numbers whose product is the constant term and whose sum is the coefficient of x.</p></aside></header>
    <nav className="factor97-tabs">{["Interact", "Learn", "Examples", "Formula", "Practice"].map((name) => <button type="button" className={tab === name ? "active" : ""} key={name} onClick={() => { setTab(name); act(); }}>{name}</button>)}</nav>
    <main className="factor97-workspace"><header><small>INTERACTIVE WORKSPACE</small><h2>Factorise&nbsp; <strong>{expression}</strong></h2></header>
      <nav className="factor97-stages">{["Find a product/sum pair", "Split middle term", "Build rectangle", "Write factor form"].map((label, index) => <button type="button" className={stage === index + 1 ? "active" : ""} key={label} onClick={() => { setStage(index + 1); act(); }}><i>{index + 1}</i>{label}{index < 3 && <span>→</span>}</button>)}</nav>
      <section className="factor97-primary"><article className="factor97-model"><h3>Start with the terms</h3><div className="factor97-source"><button type="button" draggable aria-label="Drag squared term" onDragStart={(event) => startDrag(event, "square")} onDragEnd={() => setDragging("")}>x²</button><button type="button" draggable aria-label="Drag middle term" onDragStart={(event) => startDrag(event, "middle")} onDragEnd={() => setDragging("")}>{sum}x</button><button type="button" draggable aria-label="Drag constant term" onDragStart={(event) => startDrag(event, "constant")} onDragEnd={() => setDragging("")}>{product}</button></div><b className="factor97-down">↓</b><h3>Split the middle term</h3><div className="factor97-split"><button type="button" draggable aria-label="Drag first split term" onDragStart={(event) => startDrag(event, "first-middle")} onDragEnd={() => setDragging("")}>{activePair[0]}x</button><button type="button" draggable aria-label="Drag second split term" onDragStart={(event) => startDrag(event, "second-middle")} onDragEnd={() => setDragging("")}>{activePair[1]}x</button></div><div className="factor97-arrows"><span>↓</span><span>↓</span></div><h3>Arrange into a rectangle</h3><section className="factor97-rectangle"><b className="factor97-top-x">x</b><b className="factor97-top-c">{activePair[0]}</b><b className="factor97-side-x">x</b><b className="factor97-side-c">{activePair[1]}</b><div className="factor97-area-grid"><DropCell expected="square" label="x²" onDrop={dropTerm} /><DropCell expected="first-middle" label={`${activePair[0]}x`} onDrop={dropTerm} /><DropCell expected="second-middle" label={`${activePair[1]}x`} onDrop={dropTerm} /><DropCell expected="constant" label={`${product}`} onDrop={dropTerm} /></div><div className="factor97-equals"><span>= x</span><span>= {activePair[1]}</span></div><div className="factor97-width"><span>= x</span><span>= {activePair[0]}</span></div><strong className="factor97-side-title">Side lengths</strong><div className="factor97-side-factors"><b>{factor("x", activePair[1]).slice(1, -1)}</b><b>{factor("x", activePair[0]).slice(1, -1)}</b></div></section><footer><CheckCircle2 />Rectangle area represents the original:&nbsp; <b>{expression}</b></footer></article>
        <aside className="factor97-pairs"><h3>Find factor pair for&nbsp; <strong>{expression}</strong></h3><label>Product target <span>(constant term)</span><input aria-label="Product target" type="number" value={product} onChange={(event) => updateTargets(Number(event.target.value), sum)} /></label><label>Sum target <span>(coefficient of x)</span><input aria-label="Sum target" type="number" value={sum} onChange={(event) => updateTargets(product, Number(event.target.value))} /></label><h4>Choose a factor pair:</h4>{candidates.map((pair) => { const correct = correctPair && pairKey(pair) === pairKey(correctPair); const selectedNow = pairKey(pair) === selectedPair; return <button type="button" aria-label={`Choose pair ${pair[0]} and ${pair[1]}`} className={selectedNow ? "selected" : ""} key={pairKey(pair)} onClick={() => choosePair(pair)}><b>{pairLabel(pair)}</b><span>{pairMath(pair, "product")}</span><span>{pairMath(pair, "sum")}</span>{selectedNow && correct && <Check />}</button>; })}<footer className={pairCorrect ? "correct" : "wrong"}><b>{pairCorrect ? `Pair ${pairLabel(activePair)} works!` : "This pair does not meet both targets."}</b><p>Product = &nbsp;{activePair[0] * activePair[1]} &nbsp;&nbsp;and&nbsp;&nbsp; Sum = &nbsp;{activePair[0] + activePair[1]}</p></footer></aside>
      </section>
      <section className="factor97-proof"><article><h3>Worked Example</h3><ol><li>Split the middle term using pair {pairLabel(activePair)}:<strong>{expression} = {split}</strong></li><li>Group and factor by rows:<strong>(x² {signTerm(activePair[0], "x")}) + ({activePair[1]}x {signTerm(product)}) = x(x {signTerm(activePair[0])}) + {activePair[1]}(x {signTerm(activePair[0])})</strong></li><li>Factor out the common binomial:<strong>= <b>{factors}</b></strong></li><li>Expand to check:<strong>{factors} = {expression} {pairCorrect && <CheckCircle2 />}</strong></li></ol></article><aside><h3>Check values (let x = <input aria-label="Check value" type="number" value={checkValue} onChange={(event) => { setCheckValue(Number(event.target.value)); act(); }} />)</h3><div><b>Original form<br /><em>{expression}</em></b><strong>{checkValue}² {signTerm(sum, `(${checkValue})`)} {signTerm(product)}<br />= {checkValue ** 2} {signTerm(sum * checkValue)} {signTerm(product)} = {originalValue}</strong></div><div><b>Factor form<br /><em>{factors}</em></b><strong>({checkValue} {signTerm(activePair[0]).replace("+ ", "+ ")})({checkValue} {signTerm(activePair[1]).replace("+ ", "+ ")})<br />= {checkValue + activePair[0]} × {checkValue + activePair[1]} = {factorValue}</strong></div><footer className={pairCorrect && originalValue === factorValue ? "same" : "different"}><CheckCircle2 />Both forms give the same value:&nbsp; <b>{pairCorrect && originalValue === factorValue ? originalValue : "not yet"}</b></footer><section><TriangleAlert /><span><b>Common mistake</b><p>Do not stop after guessing factors.<br />Always expand back to check that you get the original expression.</p></span></section></aside></section>
      <section className="factor97-practice"><article><h3>Guided Practice</h3><p>Factorise {polynomial(challenge.variable, challenge.sum, challenge.product)}.</p><nav><span><i>1</i>Find pair</span><b>→</b><span><i>2</i>Split</span><b>→</b><span><i>3</i>Build</span><b>→</b><span><i>4</i>Factor</span></nav><div><label>Pair:<select aria-label="Practice factor pair" value={challengePair} onChange={(event) => { setChallengePair(event.target.value); setChallengeChecked(false); act(); }}><option value={pairKey(challenge.pair)}>{pairLabel(challenge.pair)}</option><option value={`1,${challenge.product}`}>(1, {challenge.product})</option></select></label><span>Split: <b>{challenge.variable}² + {challenge.pair[0]}{challenge.variable} + {challenge.pair[1]}{challenge.variable} + {challenge.product}</b></span><label>Factor:<input aria-label="Practice factor form" value={challengeAnswer} onChange={(event) => { setChallengeAnswer(event.target.value); setChallengeChecked(false); act(); }} onKeyDown={gradeChallenge} /></label>{challengeChecked && challengeCorrect && <Check />}</div></article><aside><h3>Check your answer</h3><p>Expand:&nbsp; {challengeExpected}<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {challenge.variable}² + {challenge.pair[1]}{challenge.variable} + {challenge.pair[0]}{challenge.variable} + {challenge.product}<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {polynomial(challenge.variable, challenge.sum, challenge.product)}</p>{challengeChecked && challengeCorrect && <CheckCircle2 />}<b className={challengeChecked && challengeCorrect ? "correct" : ""}>{challengeChecked ? challengeCorrect ? "Correct!" : "Try again" : "Press Enter to check"}</b></aside></section>
      <nav className="factor97-navigation"><a href="/lessons/algebra/96-double-brackets"><ArrowLeft /><span>PREVIOUS<b>Double Brackets</b></span></a><a href="/lessons/algebra/98-algebraic-fractions"><span>NEXT<b>Algebraic Fractions</b></span><ArrowRight /></a></nav>
    </main><footer className="factor97-footer"><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations,<br />graphing, CAS-style tools, and classroom-ready activities.</p></div><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><small>© 2026 INDIAN SERVERS PRIVATE LIMITED.<br />NO RIGHT TO REPRODUCE IT.<br /><br />www.IndianServers.com&nbsp;&nbsp; info@IndianServers.com</small></footer>
  </div>;
}

function DropCell({ expected, label, onDrop }: { expected: string; label: string; onDrop: (event: DragEvent<HTMLElement>, expected: string) => void }) {
  return <button type="button" aria-label={`Drop ${expected} term`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, expected)}>{label}</button>;
}
