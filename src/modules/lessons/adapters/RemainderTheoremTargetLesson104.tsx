import { useEffect, useMemo, useState, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Edit3, Info, Lightbulb, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./RemainderTheoremTargetLesson104.css";

type Parsed = { coefficients: number[]; valid: boolean };
const practiceSets = [
  { polynomial: "x² − 4x + 1", divisor: "x − 2" },
  { polynomial: "x³ + x² − 4x − 4", divisor: "x + 1" },
];
const superscripts: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5" };

function parsePolynomial(source: string): Parsed {
  const terms = source.replace(/[⁰¹²³⁴⁵]/g, (value) => `^${superscripts[value]}`).replaceAll("−", "-").replace(/\s+/g, "").replace(/-/g, "+-").split("+").filter(Boolean);
  const values = new Map<number, number>();
  for (const term of terms) {
    const variable = term.match(/^([+-]?)(\d*)x(?:\^([0-5]))?$/i);
    const constant = term.match(/^([+-]?\d+)$/);
    if (variable) { const sign = variable[1] === "-" ? -1 : 1; const coefficient = variable[2] ? sign * Number(variable[2]) : sign; const degree = variable[3] ? Number(variable[3]) : 1; values.set(degree, (values.get(degree) ?? 0) + coefficient); }
    else if (constant) values.set(0, (values.get(0) ?? 0) + Number(constant[1]));
    else return { coefficients: [], valid: false };
  }
  const degree = Math.max(0, ...values.keys());
  return { coefficients: Array.from({ length: degree + 1 }, (_, index) => values.get(degree - index) ?? 0), valid: terms.length > 0 && degree > 0 };
}

function parseDivisor(source: string) { const match = source.replaceAll("−", "-").replace(/\s+/g, "").match(/^x(?:([+-])(\d+))?$/i); return match ? { valid: true, root: match[1] === "+" ? -Number(match[2]) : match[1] === "-" ? Number(match[2]) : 0 } : { valid: false, root: 0 }; }
function evaluate(coefficients: number[], value: number) { return coefficients.reduce((result, coefficient) => result * value + coefficient, 0); }
function divide(coefficients: number[], root: number) { const products = Array(coefficients.length).fill(0) as number[]; const sums = Array(coefficients.length).fill(0) as number[]; sums[0] = coefficients[0] ?? 0; for (let index = 1; index < coefficients.length; index += 1) { products[index] = sums[index - 1] * root; sums[index] = coefficients[index] + products[index]; } return { products, sums, quotient: sums.slice(0, -1), remainder: sums.at(-1) ?? 0 }; }
function formatPolynomial(coefficients: number[]) { const degree = coefficients.length - 1; const parts = coefficients.flatMap((coefficient, index) => { if (!coefficient) return []; const power = degree - index; const symbol = power === 0 ? "" : power === 1 ? "x" : `x${["⁰", "¹", "²", "³", "⁴", "⁵"][power]}`; const magnitude = symbol && Math.abs(coefficient) === 1 ? symbol : `${Math.abs(coefficient)}${symbol}`; return [{ coefficient, magnitude }]; }); return parts.length ? parts.map((part, index) => `${index === 0 ? (part.coefficient < 0 ? "−" : "") : part.coefficient < 0 ? " − " : " + "}${part.magnitude}`).join("") : "0"; }
function substitutionText(coefficients: number[], value: number) { const degree = coefficients.length - 1; return coefficients.map((coefficient, index) => { const power = degree - index; if (power === 0) return `${coefficient}`; return `${coefficient === 1 ? "" : coefficient}${power === 1 ? `(${value})` : `(${value})${["⁰", "¹", "²", "³", "⁴", "⁵"][power]}`}`; }).join(" + ").replaceAll("+ -", "− "); }
function evaluatedTerms(coefficients: number[], value: number) { const degree = coefficients.length - 1; return coefficients.map((coefficient, index) => coefficient * value ** (degree - index)).join(" + ").replaceAll("+ -", "− "); }
function reconstructed(coefficients: number[], root: number, quotient: number[], remainder: number) { const result = Array(coefficients.length).fill(0) as number[]; quotient.forEach((coefficient, index) => { result[index] += coefficient; result[index + 1] -= root * coefficient; }); result[result.length - 1] += remainder; return result.every((coefficient, index) => coefficient === coefficients[index]); }

export default function RemainderTheoremTargetLesson104({ resetToken, onInteraction }: LessonAdapterProps) {
  const [polynomialInput, setPolynomialInput] = useState("x² + 3x + 2");
  const [divisorInput, setDivisorInput] = useState("x − 1");
  const [valueA, setValueA] = useState(1);
  const [substituteA, setSubstituteA] = useState(true);
  const [showDivision, setShowDivision] = useState(true);
  const [checkReconstruction, setCheckReconstruction] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [dragging, setDragging] = useState("");
  const [valueDrops, setValueDrops] = useState(0);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practicePolynomial, setPracticePolynomial] = useState(practiceSets[0].polynomial);
  const [practiceDivisor, setPracticeDivisor] = useState(practiceSets[0].divisor);
  const [practiceA, setPracticeA] = useState(2);
  const [practiceAnswer, setPracticeAnswer] = useState(-3);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const parsed = useMemo(() => parsePolynomial(polynomialInput), [polynomialInput]);
  const divisor = useMemo(() => parseDivisor(divisorInput), [divisorInput]);
  const division = useMemo(() => divide(parsed.coefficients, divisor.root), [parsed.coefficients, divisor.root]);
  const evaluated = evaluate(parsed.coefficients, valueA);
  const agree = parsed.valid && divisor.valid && valueA === divisor.root && evaluated === division.remainder;
  const identityVerified = parsed.valid && divisor.valid && reconstructed(parsed.coefficients, divisor.root, division.quotient, division.remainder);
  const practiceParsed = useMemo(() => parsePolynomial(practicePolynomial), [practicePolynomial]);
  const practiceDivisorModel = useMemo(() => parseDivisor(practiceDivisor), [practiceDivisor]);
  const practiceDivision = useMemo(() => divide(practiceParsed.coefficients, practiceDivisorModel.root), [practiceParsed.coefficients, practiceDivisorModel.root]);
  const practiceEvaluation = evaluate(practiceParsed.coefficients, practiceA);
  const practiceCorrect = practiceParsed.valid && practiceDivisorModel.valid && practiceA === practiceDivisorModel.root && practiceEvaluation === practiceDivision.remainder && practiceAnswer === practiceDivision.remainder;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const reset = () => { setPolynomialInput("x² + 3x + 2"); setDivisorInput("x − 1"); setValueA(1); setSubstituteA(true); setShowDivision(true); setCheckReconstruction(true); setTab("Interact"); setDragging(""); setValueDrops(0); setInvalidDrop(false); setPracticeIndex(0); setPracticePolynomial(practiceSets[0].polynomial); setPracticeDivisor(practiceSets[0].divisor); setPracticeA(2); setPracticeAnswer(-3); setPracticeChecked(true); setActions(0); onInteraction(); };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateDivisor = (source: string) => { setDivisorInput(source); const next = parseDivisor(source); if (next.valid) setValueA(next.root); act(); };
  const startDrag = (event: DragEvent<HTMLButtonElement>) => { event.dataTransfer.setData("text/remainder-value-a", String(valueA)); setDragging(String(valueA)); setInvalidDrop(false); act(); };
  const dropValue = (event: DragEvent<HTMLElement>) => { event.preventDefault(); const value = Number(event.dataTransfer.getData("text/remainder-value-a")); if (value === valueA) { setValueDrops((count) => count + 1); setInvalidDrop(false); } else setInvalidDrop(true); setDragging(""); act(); };
  const nextPractice = () => { const next = (practiceIndex + 1) % practiceSets.length; const set = practiceSets[next]; const root = parseDivisor(set.divisor).root; const remainder = divide(parsePolynomial(set.polynomial).coefficients, root).remainder; setPracticeIndex(next); setPracticePolynomial(set.polynomial); setPracticeDivisor(set.divisor); setPracticeA(root); setPracticeAnswer(remainder + 1); setPracticeChecked(false); act(); };

  return <div className="remainder104-page" data-testid="algebra-mockup-0161" data-dedicated-lesson="104" data-object-model="editable-polynomial-independent-evaluation-synthetic-division-draggable-a-remainder-agreement-reconstruction-graded-practice-model" data-polynomial={formatPolynomial(parsed.coefficients)} data-polynomial-valid={parsed.valid} data-divisor={divisorInput} data-divisor-valid={divisor.valid} data-divisor-root={divisor.root} data-value-a={valueA} data-evaluated={evaluated} data-products={division.products.join(",")} data-sums={division.sums.join(",")} data-quotient={formatPolynomial(division.quotient)} data-remainder={division.remainder} data-agree={agree} data-identity-verified={identityVerified} data-substitute-a={substituteA} data-show-division={showDivision} data-check-reconstruction={checkReconstruction} data-tab={tab} data-dragging={dragging} data-value-drops={valueDrops} data-invalid-drop={invalidDrop} data-practice-index={practiceIndex} data-practice-evaluated={practiceEvaluation} data-practice-products={practiceDivision.products.join(",")} data-practice-sums={practiceDivision.sums.join(",")} data-practice-quotient={formatPolynomial(practiceDivision.quotient)} data-practice-remainder={practiceDivision.remainder} data-practice-answer={practiceAnswer} data-practice-correct={practiceChecked && practiceCorrect} data-actions={actions}>
    <nav className="remainder104-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>Remainder Theorem</b></nav>
    <header className="remainder104-intro"><section><small><b>ALGEBRA</b><b>EXPRESSIONS AND MANIPULATION</b></small><h1>Remainder Theorem</h1><p>When a polynomial <i>f(x)</i> is divided by <i>(x − a)</i>, the remainder is <i>f(a)</i>.</p><nav><b>Intermediate Algebra</b><b>6-10 min</b><b>Remainder Theorem</b></nav></section><aside><Lightbulb /><h3>Key Idea</h3><p>If <i>f(x)</i> is divided by <i>x − a</i>,</p><strong>remainder = <i>f(a)</i></strong><p>Use <i>a</i>, not <i>−a</i>.</p></aside></header>
    <nav className="remainder104-tabs">{["Interact", "Explain", "Examples", "Practice", "Know more"].map((name) => <button type="button" className={tab === name ? "active" : ""} onClick={() => { setTab(name); act(); }} key={name}>{name}</button>)}</nav>
    <main className="remainder104-workspace"><header><label>Polynomial <i>f(x)</i><span><input aria-label="Polynomial f of x" value={polynomialInput} onChange={(event) => { setPolynomialInput(event.target.value); act(); }} /><Edit3 /></span></label><label>Divisor<span><input aria-label="Remainder divisor" value={divisorInput} onChange={(event) => updateDivisor(event.target.value)} /><Edit3 /></span></label><label>Value <i>a</i><input aria-label="Value a" type="number" value={valueA} onChange={(event) => { setValueA(Number(event.target.value)); act(); }} /></label><div><Switch label="Substitute a" value={substituteA} onToggle={() => { setSubstituteA((value) => !value); act(); }} /><Switch label="Show division row" value={showDivision} onToggle={() => { setShowDivision((value) => !value); act(); }} /><Switch label="Check reconstruction" value={checkReconstruction} onToggle={() => { setCheckReconstruction((value) => !value); act(); }} /></div><button type="button" onClick={reset}><RotateCcw />Reset</button></header>
      <section className="remainder104-methods"><article className="remainder104-evaluate" aria-label="Evaluation value drop target" onDragOver={(event) => event.preventDefault()} onDrop={dropValue}><h2><i>1</i>Evaluate <em>f(a)</em></h2><p>Substitute <button type="button" className="drag-value" draggable aria-label="Drag value a" onDragStart={startDrag} onDragEnd={() => setDragging("")}>a = {valueA}</button> into <i>f(x)</i>.</p>{substituteA ? <div className="equations"><p><i>f({valueA})</i> = {substitutionText(parsed.coefficients, valueA)}</p><p>= {evaluatedTerms(parsed.coefficients, valueA)}</p><strong>= {evaluated}</strong></div> : <div className="hidden-method">Substitution is hidden</div>}<aside><Info /><p>We used <i>a = {valueA}</i> (from the divisor <i>{divisorInput}</i>),<br />not <i>−{valueA}</i>.</p></aside>{invalidDrop && <p className="invalid">Drop the active value a into this method.</p>}</article><article className="remainder104-division"><h2><i>2</i>Synthetic division by <em>x − a</em></h2><p>Divide by <i>{divisorInput}</i> using synthetic division.</p>{showDivision ? <MiniDivision coefficients={parsed.coefficients} root={divisor.root} calculation={division} /> : <div className="hidden-method">Division row is hidden</div>}<footer><span>Quotient: <b>{formatPolynomial(division.quotient)}</b></span><strong>Remainder: {division.remainder}</strong></footer></article></section>
      <section className={`remainder104-agreement ${agree ? "agree" : "disagree"}`}><div><Check /></div><strong>Remainder = {agree ? evaluated : "?"}</strong><p>{agree ? "Both methods agree." : `f(${valueA}) = ${evaluated}, but division gives ${division.remainder}.`}</p></section>
      <section className="remainder104-reconstruction"><h2><i>3</i>Check reconstruction</h2>{checkReconstruction ? <><p>Verify that <i>f(x) = ({divisorInput})(${formatPolynomial(division.quotient)}) + ${division.remainder}</i>.</p><strong>({divisorInput})({formatPolynomial(division.quotient)}) + {division.remainder} = {formatPolynomial(parsed.coefficients)} = f(x)</strong><footer><Check />{identityVerified ? "Identity verified." : "Identity not verified."}</footer></> : <div className="hidden-method">Reconstruction is hidden</div>}</section>
      <aside className="remainder104-warning"><CircleAlert /><b>Remember</b><p>For divisor <i>x − a</i>, use <i>a</i> in <i>f(a)</i>. For example, <i>x − 1 ⇒ a = 1</i>, not −1.</p></aside>
      <section className="remainder104-practice"><header><h2>Practice <small>(Your turn)</small></h2><p>Try a similar problem.</p></header><div className="remainder104-practice-controls"><label><i>f(x)</i><span><input aria-label="Practice polynomial" value={practicePolynomial} onChange={(event) => { setPracticePolynomial(event.target.value); setPracticeChecked(false); act(); }} /><Edit3 /></span></label><label>Divisor<span><input aria-label="Practice divisor" value={practiceDivisor} onChange={(event) => { const source = event.target.value; setPracticeDivisor(source); const model = parseDivisor(source); if (model.valid) setPracticeA(model.root); setPracticeChecked(false); act(); }} /><Edit3 /></span></label><label><i>a</i><input aria-label="Practice a" type="number" value={practiceA} onChange={(event) => { setPracticeA(Number(event.target.value)); setPracticeChecked(false); act(); }} /></label><button type="button" onClick={() => { setPracticeChecked(true); act(); }}>Check my work</button><button type="button" onClick={nextPractice}><RefreshCw />New problem</button></div><div className="remainder104-practice-methods"><article><h3>Evaluate <i>f({practiceA})</i></h3><p>f({practiceA}) = {substitutionText(practiceParsed.coefficients, practiceA)}</p><p>= {practiceEvaluation}</p></article><article><h3>Synthetic division</h3><MiniDivision coefficients={practiceParsed.coefficients} root={practiceDivisorModel.root} calculation={practiceDivision} compact /><p>Quotient: <b>{formatPolynomial(practiceDivision.quotient)}</b></p><p>Remainder: <b>{practiceDivision.remainder}</b></p></article></div><footer className={practiceChecked && practiceCorrect ? "correct" : "wrong"}>Answer: <b>Remainder =</b><input aria-label="Practice remainder answer" type="number" value={practiceAnswer} onChange={(event) => { setPracticeAnswer(Number(event.target.value)); setPracticeChecked(false); act(); }} />{practiceChecked && practiceCorrect && <Check />}</footer></section>
    </main>
    <nav className="remainder104-navigation"><a href="/lessons/algebra/105-factor-theorem"><ArrowLeft /><span>Previous<b>Factor Theorem</b></span></a><a href="/lessons/algebra/104-remainder-theorem"><span>Next<b>Remainder Theorem (Higher Degree)</b></span><ArrowRight /></a></nav>
    <footer className="remainder104-footer"><h3><Sparkles />Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><p>www.IndianServers.com info@IndianServers.com</p></footer>
  </div>;
}

function Switch({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) { return <button type="button" role="switch" aria-checked={value} onClick={onToggle}><i className={value ? "on" : ""}><b /></i><span>{label}</span></button>; }
function MiniDivision({ coefficients, root, calculation, compact = false }: { coefficients: number[]; root: number; calculation: ReturnType<typeof divide>; compact?: boolean }) { return <div className={`remainder104-mini ${compact ? "compact" : ""}`} style={{ "--remainder-columns": coefficients.length } as React.CSSProperties}><b>{root}</b><header>{coefficients.map((value, index) => <span key={index}>{value}</span>)}</header><section><i>↓</i>{calculation.products.map((value, index) => <span key={index}>{index ? value : ""}</span>)}</section><footer>{calculation.sums.map((value, index) => <span className={index === calculation.sums.length - 1 ? "remainder" : ""} key={index}>{value}</span>)}</footer></div>; }
