import { AlertTriangle, ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, Eye, ExternalLink, Info, Lightbulb, RefreshCw, Share2, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import type { LessonAdapterProps } from "../types";
import "./RationalisationTargetLesson101.css";

type Expression = { key: string; numerator: number; radicand: number; constant?: number; label: string };
type Multiplier = "matching" | "other" | "conjugate";

const expressions: Expression[] = [
  { key: "root2", numerator: 1, radicand: 2, label: "1/√2" },
  { key: "root3", numerator: 2, radicand: 3, label: "2/√3" },
  { key: "root5", numerator: 3, radicand: 5, label: "3/√5" },
  { key: "conjugate", numerator: 1, constant: 2, radicand: 3, label: "1/(2 + √3)" },
];
const practice = [
  { numerator: 3, radicand: 5 },
  { numerator: 2, radicand: 7 },
  { numerator: 5, radicand: 3 },
];
const isSquare = (value: number) => Number.isInteger(Math.sqrt(value));
const clean = (value: number) => Number(value.toFixed(4)).toString();
const normalize = (value: string) => value.toLowerCase().replace(/\s/g, "").replace(/sqrt\(?([0-9]+)\)?/g, "√$1").replace(/\*/g, "");

export default function RationalisationTargetLesson101({ resetToken, onInteraction }: LessonAdapterProps) {
  const [expressionKey, setExpressionKey] = useState("root2");
  const [multiplier, setMultiplier] = useState<Multiplier>("matching");
  const [stage, setStage] = useState(3);
  const [decimalCheck, setDecimalCheck] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [shareCount, setShareCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [dragging, setDragging] = useState("");
  const [multiplierDrops, setMultiplierDrops] = useState<string[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("3√5/5");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [showPracticeSteps, setShowPracticeSteps] = useState(false);
  const [actions, setActions] = useState(0);
  const expression = expressions.find((item) => item.key === expressionKey) ?? expressions[0];
  const isConjugate = Boolean(expression.constant);
  const otherRadicand = expression.radicand === 3 ? 2 : 3;
  const multiplierRadicand = multiplier === "matching" ? expression.radicand : otherRadicand;
  const denominatorProduct = expression.radicand * multiplierRadicand;
  const simpleValid = !isConjugate && multiplier !== "conjugate" && isSquare(denominatorProduct);
  const conjugateValid = isConjugate && multiplier === "conjugate";
  const valid = simpleValid || conjugateValid;
  const multiplierLabel = multiplier === "conjugate" ? `${expression.constant ?? "a"} − √${expression.radicand}` : `√${multiplierRadicand}`;
  const denominatorLabel = isConjugate ? `${expression.constant} + √${expression.radicand}` : `√${expression.radicand}`;
  const denominatorResult = conjugateValid ? (expression.constant ?? 0) ** 2 - expression.radicand : simpleValid ? Math.sqrt(denominatorProduct) : `√${denominatorProduct}`;
  const resultTop = conjugateValid ? `${expression.numerator === 1 ? "" : expression.numerator}(${multiplierLabel})` : simpleValid ? `${expression.numerator === 1 ? "" : expression.numerator}√${multiplierRadicand}` : String(expression.numerator);
  const result = valid ? Number(denominatorResult) === 1 ? resultTop.replace(/^\((.*)\)$/, "$1") : `${resultTop}/${denominatorResult}` : `${expression.numerator}/${denominatorLabel}`;
  const originalDecimal = expression.numerator / ((expression.constant ?? 0) + Math.sqrt(expression.radicand));
  const rationalDecimal = conjugateValid ? expression.numerator * ((expression.constant ?? 0) - Math.sqrt(expression.radicand)) / Number(denominatorResult) : simpleValid ? expression.numerator * Math.sqrt(multiplierRadicand) / Number(denominatorResult) : originalDecimal;
  const decimalMatch = valid && Math.abs(originalDecimal - rationalDecimal) < 0.0000001;
  const currentPractice = practice[practiceIndex];
  const expectedPractice = `${currentPractice.numerator}√${currentPractice.radicand}/${currentPractice.radicand}`;
  const [practiceTop = "", practiceBottom = ""] = practiceAnswer.split("/");
  const practiceCorrect = normalize(practiceAnswer) === normalize(expectedPractice);
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const reset = () => { setExpressionKey("root2"); setMultiplier("matching"); setStage(3); setDecimalCheck(true); setTab("Interact"); setShareCount(0); setBookmarked(false); setDragging(""); setMultiplierDrops([]); setPracticeIndex(0); setPracticeAnswer("3√5/5"); setPracticeChecked(true); setShowPracticeSteps(false); setActions(0); onInteraction(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseExpression = (key: string) => {
    const next = expressions.find((item) => item.key === key) ?? expressions[0];
    setExpressionKey(key);
    setMultiplier(next.constant ? "conjugate" : "matching");
    setStage(0);
    setMultiplierDrops([]);
    act();
  };
  const chooseMultiplier = (next: Multiplier) => { setMultiplier(next); setStage(1); act(); };
  const startDrag = (event: DragEvent<HTMLButtonElement>, choice: Multiplier) => { event.dataTransfer.setData("text/rational-multiplier", choice); setDragging(choice); };
  const dropMultiplier = (event: DragEvent<HTMLElement>) => { event.preventDefault(); const choice = event.dataTransfer.getData("text/rational-multiplier") as Multiplier; if (!(["matching", "other", "conjugate"] as string[]).includes(choice)) return; setMultiplier(choice); setStage(1); setMultiplierDrops((current) => current.includes(choice) ? current : [...current, choice]); setDragging(""); act(); };
  const gradePractice = () => { setPracticeChecked(true); act(); };
  const handlePracticeKey = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") gradePractice(); };
  const nextPractice = () => { const next = (practiceIndex + 1) % practice.length; setPracticeIndex(next); setPracticeAnswer(""); setPracticeChecked(false); setShowPracticeSteps(false); act(); };

  return <div className="rational101-page" data-testid="algebra-mockup-0158" data-dedicated-lesson="101" data-object-model="selectable-radical-and-conjugate-denominator-draggable-unity-multiplier-rational-result-decimal-equivalence-graded-practice-model" data-expression={expressionKey} data-numerator={expression.numerator} data-radicand={expression.radicand} data-denominator={denominatorLabel} data-multiplier={multiplier} data-multiplier-label={multiplierLabel} data-denominator-result={denominatorResult} data-result={result} data-valid={valid} data-stage={stage} data-decimal-check={decimalCheck} data-original-decimal={clean(originalDecimal)} data-rational-decimal={clean(rationalDecimal)} data-decimal-match={decimalMatch} data-tab={tab} data-practice-index={practiceIndex} data-practice-expected={expectedPractice} data-practice-correct={practiceChecked && practiceCorrect} data-show-practice-steps={showPracticeSteps} data-share-count={shareCount} data-bookmarked={bookmarked} data-dragging={dragging} data-multiplier-drops={multiplierDrops.join(",")} data-actions={actions}>
    <aside className="rational101-sidebar-extra"><section><h3>Unlock more with<br /><b>Math Universe PRO</b></h3><p>✓ Unlimited interactive labs</p><p>✓ Step-by-step solutions</p><p>✓ Advanced visual tools</p><p>✓ Ad-free experience</p><a href="/upgrade">Upgrade Now</a></section><footer>© 2026 Indian Servers<br />Private Limited<nav><a href="/terms">Terms of Service</a><a href="/privacy">Privacy Policy</a></nav></footer></aside>
    <nav className="rational101-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>101 Rationalisation</b></nav>
    <header className="rational101-intro"><nav><b>Intermediate Algebra</b><b>6-10 min</b><b>Rationalising step</b></nav><aside><button type="button" onClick={() => { setShareCount((count) => count + 1); act(); }}><Share2 />Share</button><a href="/workspace"><ExternalLink />Workspace</a><button type="button" aria-label="Bookmark lesson" className={bookmarked ? "saved" : ""} onClick={() => { setBookmarked((current) => !current); act(); }}><Bookmark /></button></aside><h1>Rationalisation</h1><p>Remove radicals from denominators by multiplying numerator and denominator by a useful form of 1.</p></header>
    <nav className="rational101-tabs">{["Interact", "Explain", "Examples", "Guided Steps", "Practice", "Formula & Rules"].map((name) => <button type="button" className={tab === name ? "active" : ""} key={name} onClick={() => { setTab(name); act(); }}>{name}</button>)}</nav>
    <main className="rational101-workspace"><header><h2>Denominator-cleaning workspace</h2><p>Follow the steps to rationalise the denominator.</p><button type="button" role="switch" aria-checked={decimalCheck} onClick={() => { setDecimalCheck((current) => !current); act(); }}><span>Decimal check</span><i className={decimalCheck ? "on" : ""}><b /></i><Info /></button></header><section className="rational101-flow"><FlowStage title="Start"><Fraction top={String(expression.numerator)} bottom={denominatorLabel} /></FlowStage><ArrowRight /><FlowStage title="Choose multiplier" detail="(multiply by 1)" drop onDrop={dropMultiplier}><Fraction top={multiplierLabel} bottom={multiplierLabel} tone="purple" /><small>= 1</small></FlowStage><ArrowRight /><FlowStage title="Multiply top and bottom"><div className="rational101-product"><Fraction top={String(expression.numerator)} bottom={denominatorLabel} /><b>×</b><Fraction top={multiplierLabel} bottom={multiplierLabel} tone="purple" /></div><p>Multiply numerator and denominator<br />by {multiplierLabel}.</p></FlowStage><ArrowRight /><FlowStage title="Result"><Fraction top={stage >= 3 && valid ? resultTop : "?"} bottom={stage >= 3 && valid ? String(denominatorResult) : "?"} tone={valid ? "purple" : "red"} /></FlowStage></section>
      <section className="rational101-balance"><Fraction top={String(expression.numerator)} bottom={denominatorLabel} /><div className="scale"><i /><i /><b>=</b></div><p><b>Multiply by 1,</b><br />value unchanged.</p><Fraction top={valid ? resultTop : "?"} bottom={valid ? String(denominatorResult) : "?"} tone="purple" /></section>
      <section className="rational101-chooser"><label>Expression to rationalise<select aria-label="Expression to rationalise" value={expressionKey} onChange={(event) => chooseExpression(event.target.value)}>{expressions.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label><fieldset><legend>Choose multiplier</legend><div><MultiplierButton choice="matching" selected={multiplier === "matching"} label={`√${expression.radicand}/√${expression.radicand}`} onChoose={chooseMultiplier} onDrag={startDrag} /><MultiplierButton choice="other" selected={multiplier === "other"} label={`√${otherRadicand}/√${otherRadicand}`} onChoose={chooseMultiplier} onDrag={startDrag} /><MultiplierButton choice="conjugate" selected={multiplier === "conjugate"} label="Conjugate (a − b)/(a + b)" onChoose={chooseMultiplier} onDrag={startDrag} /></div></fieldset><article><small>Your progress</small><p className={stage >= 3 && valid ? "complete" : "pending"}>{stage >= 3 && valid ? <Check /> : <XCircle />}{stage >= 3 && valid ? "Last step completed" : valid ? `Step ${stage} active` : "Choose a valid multiplier"}</p></article></section>
      <nav className="rational101-stage-buttons"><button type="button" className={stage === 1 ? "active" : ""} onClick={() => { setStage(1); act(); }}><i>1</i>Choose multiplier</button><button type="button" className={stage === 2 ? "active" : ""} disabled={!valid} onClick={() => { setStage(2); act(); }}><i>2</i>Multiply top and bottom</button><button type="button" className={stage === 3 ? "active" : ""} disabled={!valid} onClick={() => { setStage(3); act(); }}><i>3</i>Simplify denominator</button></nav>
    </main>
    <section className="rational101-proof-row"><article className="rule"><h3><ShieldCheck />Rule to remember</h3><strong><Fraction top="1" bottom="√a" /> = <Fraction top="√a" bottom="a" tone="purple" />, &nbsp; a &gt; 0</strong><p>Generally, multiply by a useful form of 1 so the denominator becomes a rational number.</p></article><article className="warning"><h3>Warning: Always multiply top and bottom</h3><AlertTriangle /><p>Multiplying only the denominator changes the value.<br />Always multiply both numerator and denominator<br />by the same factor.</p></article><article className="decimal"><h3>Decimal check <Info /></h3>{decimalCheck ? <><header><CheckCircle2 />{decimalMatch ? "Values are equal (within rounding)." : "The chosen multiplier has not rationalised the denominator."}</header><div><section><small>Original expression</small><Fraction top={String(expression.numerator)} bottom={denominatorLabel} /><b>≈ {clean(originalDecimal)}</b></section><i>=</i><section><small>Rationalised expression</small><Fraction top={valid ? resultTop : "?"} bottom={valid ? String(denominatorResult) : "?"} tone="purple" /><b>≈ {valid ? clean(rationalDecimal) : "?"}</b></section></div><footer>{decimalMatch ? "Both expressions give the same decimal value." : "Choose a valid form of 1."}</footer></> : <p>Turn on Decimal check to compare both forms.</p>}</article></section>
    <section className="rational101-lower"><article className="rational101-guided"><h3>Guided steps</h3><ol><li><i>1</i><b>Identify the expression</b><p><Fraction top={String(expression.numerator)} bottom={denominatorLabel} /> has a radical in the denominator.</p></li><li><i>2</i><b>Choose a useful form of 1</b><p>Choose <Fraction top={multiplierLabel} bottom={multiplierLabel} /> = 1.</p></li><li><i>3</i><b>Multiply top and bottom</b><p><Fraction top={String(expression.numerator)} bottom={denominatorLabel} /> × <Fraction top={multiplierLabel} bottom={multiplierLabel} /></p></li><li><i>4</i><b>Simplify the denominator</b><p>{valid ? `${denominatorLabel} × ${multiplierLabel} = ${denominatorResult}.` : "This denominator is still irrational."}</p></li><li><i>5</i><b>Write the result</b><p>{valid ? result : "Choose a valid multiplier."} Denominator is {valid ? "rational" : "not rational"}.</p></li></ol></article><article className="rational101-practice"><h3>Practice time</h3><p>Try one on your own.</p><section><p>Rationalise the denominator:</p><Fraction top={String(currentPractice.numerator)} bottom={`√${currentPractice.radicand}`} /><p><b>Hint:</b> Multiply by <Fraction top={`√${currentPractice.radicand}`} bottom={`√${currentPractice.radicand}`} /></p><button type="button" onClick={() => { setShowPracticeSteps((current) => !current); act(); }}><Eye />{showPracticeSteps ? "Hide steps" : "Show steps"}</button>{showPracticeSteps && <aside>Multiply both numerator and denominator, then use √a × √a = a.</aside>}</section><label>Your answer<div className="rational101-answer-fraction"><input aria-label="Practice answer numerator" value={practiceTop} onChange={(event) => { setPracticeAnswer(`${event.target.value}/${practiceBottom}`); setPracticeChecked(false); act(); }} onKeyDown={handlePracticeKey} /><input aria-label="Practice answer denominator" value={practiceBottom} onChange={(event) => { setPracticeAnswer(`${practiceTop}/${event.target.value}`); setPracticeChecked(false); act(); }} onKeyDown={handlePracticeKey} /></div></label><article className={practiceChecked && practiceCorrect ? "correct" : "pending"}>{practiceChecked && practiceCorrect ? <CheckCircle2 /> : <Lightbulb />}<b>{practiceChecked ? practiceCorrect ? "Correct!" : "Try again" : "Press Enter to check"}</b><p>{practiceChecked && practiceCorrect ? "Nicely done." : `Use √${currentPractice.radicand}/√${currentPractice.radicand}.`}</p></article><button type="button" className="try" onClick={nextPractice}><RefreshCw />Try another</button></article></section>
    <nav className="rational101-navigation"><a href="/lessons/algebra/100-surds"><ArrowLeft /><span>Previous<b>Surds</b></span></a><a href="/lessons/algebra/102-polynomial-operations"><span>Next<b>Polynomial operations</b></span><ArrowRight /></a></nav>
    <footer className="rational101-tags"><span>Tags:</span><b>rationalisation</b><b>surds</b><b>denominators</b><b>multiply by 1</b><nav><a href="/notebook">Add to notebook</a><a href="/report">Report an issue</a></nav></footer>
  </div>;
}

function Fraction({ top, bottom, tone = "" }: { top: string; bottom: string; tone?: string }) { return <span className={`rational101-fraction ${tone}`}><b>{top}</b><b>{bottom}</b></span>; }
function FlowStage({ title, detail, drop = false, onDrop, children }: { title: string; detail?: string; drop?: boolean; onDrop?: (event: DragEvent<HTMLElement>) => void; children: ReactNode }) { return <article className={drop ? "drop" : ""} aria-label={drop ? "Multiplier drop target" : undefined} onDragOver={drop ? (event) => event.preventDefault() : undefined} onDrop={onDrop}><h3>{title}</h3>{detail && <p>{detail}</p>}<div>{children}</div></article>; }
function MultiplierButton({ choice, selected, label, onChoose, onDrag }: { choice: Multiplier; selected: boolean; label: string; onChoose: (choice: Multiplier) => void; onDrag: (event: DragEvent<HTMLButtonElement>, choice: Multiplier) => void }) { return <button type="button" draggable aria-label={`Use ${choice} multiplier`} className={selected ? "selected" : ""} onClick={() => onChoose(choice)} onDragStart={(event) => onDrag(event, choice)} onDragEnd={() => undefined}>{label}</button>; }
