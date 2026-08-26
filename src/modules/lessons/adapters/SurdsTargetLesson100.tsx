import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, ExternalLink, Languages, RotateCcw, Share2, X } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./SurdsTargetLesson100.css";

type Stage = "input" | "factor" | "extracted" | "decimal";

const stageRank: Record<Stage, number> = { input: 0, factor: 1, extracted: 2, decimal: 3 };
const isSquare = (value: number) => Number.isInteger(Math.sqrt(value));
const cleanNumber = (value: number) => Number(value.toFixed(3)).toString();

function divisors(value: number) {
  const result: number[] = [];
  for (let candidate = 1; candidate <= value; candidate += 1) {
    if (value % candidate === 0) result.push(candidate);
  }
  return result;
}

function largestSquareFactor(value: number) {
  return divisors(value).filter(isSquare).at(-1) ?? 1;
}

function candidateFactors(value: number, selected: number) {
  const factors = divisors(value).filter((factor) => factor < value);
  if (factors.length <= 5) return factors;
  const preferred = [...factors.slice(0, 4), largestSquareFactor(value), selected];
  return [...new Set(preferred)].sort((a, b) => a - b).slice(-5);
}

function formatSurd(coefficient: number, residual: number) {
  if (residual === 1) return String(coefficient);
  return `${coefficient === 1 ? "" : coefficient}√${residual}`;
}

export default function SurdsTargetLesson100({ resetToken, onInteraction }: LessonAdapterProps) {
  const [radicand, setRadicand] = useState(50);
  const [squareFactor, setSquareFactor] = useState(25);
  const [stage, setStage] = useState<Stage>("decimal");
  const [tab, setTab] = useState("Interact");
  const [language, setLanguage] = useState("en");
  const [practiceChoice, setPracticeChoice] = useState("C");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [shareCount, setShareCount] = useState(0);
  const [dragging, setDragging] = useState("");
  const [factorDrops, setFactorDrops] = useState<number[]>([]);
  const [actions, setActions] = useState(0);
  const quotient = Number.isInteger(radicand / squareFactor) ? radicand / squareFactor : radicand;
  const validSquareFactor = radicand % squareFactor === 0 && isSquare(squareFactor);
  const coefficient = validSquareFactor ? Math.sqrt(squareFactor) : 1;
  const residual = validSquareFactor ? quotient : radicand;
  const result = formatSurd(coefficient, residual);
  const originalDecimal = Math.sqrt(radicand);
  const simplifiedDecimal = coefficient * Math.sqrt(residual);
  const decimalMatch = Math.abs(originalDecimal - simplifiedDecimal) < 0.0000001;
  const candidates = useMemo(() => candidateFactors(radicand, squareFactor), [radicand, squareFactor]);
  const practiceCorrect = practiceChoice === "C";
  const extracted = stageRank[stage] >= stageRank.extracted;
  const factored = stageRank[stage] >= stageRank.factor;
  const decimalChecked = stageRank[stage] >= stageRank.decimal;
  const act = () => { setActions((count) => count + 1); onInteraction(); };
  const reset = () => { setRadicand(50); setSquareFactor(25); setStage("decimal"); setTab("Interact"); setLanguage("en"); setPracticeChoice("C"); setPracticeChecked(true); setShareCount(0); setDragging(""); setFactorDrops([]); setActions(0); onInteraction(); };
  useEffect(() => { reset(); }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateRadicand = (next: number) => {
    const bounded = Math.max(2, Math.min(400, Number.isFinite(next) ? Math.round(next) : 2));
    setRadicand(bounded);
    setSquareFactor(1);
    setStage("input");
    setFactorDrops([]);
    act();
  };
  const chooseFactor = (factor: number) => {
    setSquareFactor(factor);
    setStage("factor");
    act();
  };
  const findSquareFactor = () => {
    setSquareFactor(largestSquareFactor(radicand));
    setStage("factor");
    act();
  };
  const pullOutside = () => {
    setStage(validSquareFactor ? "extracted" : "factor");
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>, factor: number) => {
    event.dataTransfer.setData("text/surd-factor", String(factor));
    setDragging(String(factor));
  };
  const dropFactor = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const factor = Number(event.dataTransfer.getData("text/surd-factor"));
    if (!Number.isFinite(factor) || radicand % factor !== 0) return;
    setSquareFactor(factor);
    setStage("factor");
    setFactorDrops((current) => current.includes(factor) ? current : [...current, factor]);
    setDragging("");
    act();
  };

  return <div className="surds100-page" data-testid="algebra-mockup-0157" data-dedicated-lesson="100" data-object-model="editable-radicand-perfect-square-divisor-search-draggable-factor-extraction-exact-decimal-equivalence-graded-practice-model" data-radicand={radicand} data-square-factor={squareFactor} data-remaining-factor={residual} data-coefficient={coefficient} data-result={result} data-original-decimal={cleanNumber(originalDecimal)} data-simplified-decimal={cleanNumber(simplifiedDecimal)} data-decimal-match={decimalMatch} data-valid-square-factor={validSquareFactor} data-stage={stage} data-tab={tab} data-language={language} data-practice-choice={practiceChoice} data-practice-correct={practiceChecked && practiceCorrect} data-share-count={shareCount} data-dragging={dragging} data-factor-drops={factorDrops.join(",")} data-actions={actions}>
    <nav className="surds100-breadcrumb"><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/algebra">Algebra</a><span>&gt;</span><b>100 Surds</b></nav>
    <header className="surds100-intro"><small><b>ALGEBRA</b><b>EXPRESSIONS AND MANIPULATION</b></small><h1>Surds</h1><p>Simplify exact radicals by finding a square factor and taking its square root outside, leaving the non-square factor inside.</p><nav><b>Intermediate</b><b>Radical simplifier</b><b>6-10 min</b><b>Algebra</b></nav><aside><label><Languages /><select aria-label="Lesson language" value={language} onChange={(event) => { setLanguage(event.target.value); act(); }}><option value="en">English (English)</option><option value="hi">Hindi (हिन्दी)</option></select></label><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => { setShareCount((count) => count + 1); act(); }}><Share2 />Share</button><a href="/workspace"><ExternalLink />Workspace</a></aside></header>
    <nav className="surds100-tabs">{["Interact", "Explain", "Examples", "Formulas", "Know more"].map((name) => <button type="button" className={tab === name ? "active" : ""} key={name} onClick={() => { setTab(name); act(); }}>{name}</button>)}</nav>
    <main className="surds100-main"><section className="surds100-lab"><small>SQUARE-FACTOR EXTRACTOR</small><h2>Visualize and simplify</h2><p>Split the radicand into a square factor and a non-square factor.</p><button type="button" draggable className="surds100-root" aria-label={`Drag radical ${radicand}`} onDragStart={(event) => { event.dataTransfer.setData("text/surd-radicand", String(radicand)); setDragging(`root:${radicand}`); }} onDragEnd={() => setDragging("")}><span>√<i>{radicand}</i></span></button><ArrowDown className="surds100-arrow root-arrow" />
      <section className={`surds100-tree ${factored ? "shown" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={dropFactor} aria-label="Square factor extraction drop target"><b>{radicand}</b><div className="surds100-branches"><i /><i /></div><article className="square"><strong>{factored ? squareFactor : "?"}</strong>{factored && validSquareFactor ? <div className="surds100-square-grid" style={{ "--square-side": Math.sqrt(squareFactor) } as CSSProperties}>{Array.from({ length: squareFactor }, (_, index) => <i key={index} />)}</div> : <div className="surds100-invalid"><X />Choose a square factor</div>}<p>{validSquareFactor ? `${coefficient} × ${coefficient} square` : "Not a perfect square"}<br /><b>{validSquareFactor ? `= ${squareFactor}` : "Try another factor"}</b></p><h3>{validSquareFactor ? `√${squareFactor} = ${coefficient}` : `√${squareFactor} stays inside`}</h3></article><article className="remainder"><strong>{factored ? quotient : "?"}</strong><div>{Array.from({ length: Math.min(quotient, 9) }, (_, index) => <i key={index} />)}</div><p>Non-square<br />stays inside</p><h3>√{factored ? quotient : "?"}</h3></article></section>
      {extracted && validSquareFactor ? <section className="surds100-extraction"><ArrowDown /><b>{coefficient}</b><p>Square factor<br />comes outside</p><i /><strong>√{residual}</strong><div className="surds100-join" /><h3>{result}</h3></section> : <section className="surds100-extraction pending"><p>{validSquareFactor ? "Pull the square root outside" : "Select a perfect-square divisor"}</p></section>}
      <footer className={extracted && validSquareFactor ? "done" : "pending"}>{extracted && validSquareFactor ? <><CheckCircle2 />Result: √{radicand} = {result}</> : "Complete the extraction"}</footer></section>
      <aside className="surds100-controls"><section><small>CONTROLS</small><label>Radicand<input aria-label="Radicand" type="number" min="2" max="400" value={radicand} onChange={(event) => updateRadicand(Number(event.target.value))} /></label><fieldset><legend>Square-factor candidates</legend><div>{candidates.map((factor) => <button type="button" draggable aria-label={`Use factor ${factor}`} className={squareFactor === factor ? "selected" : ""} key={factor} onClick={() => chooseFactor(factor)} onDragStart={(event) => startDrag(event, factor)} onDragEnd={() => setDragging("")}>{factor}</button>)}</div></fieldset><button type="button" onClick={findSquareFactor}>Find square factor</button><button type="button" className="extract" disabled={!validSquareFactor} onClick={pullOutside}>Pull root outside</button><button type="button" className="decimal" disabled={!extracted} onClick={() => { setStage("decimal"); act(); }}>Decimal check</button></section><article><small>RESULT</small><h3>√{radicand} = {extracted && validSquareFactor ? result : "?"}</h3></article><article><small>DECIMAL CHECK</small>{decimalChecked ? <><h3>√{radicand} ≈ {cleanNumber(originalDecimal)}</h3><h3>{result} ≈ {cleanNumber(simplifiedDecimal)}</h3><b>{decimalMatch ? "Match ✓" : "Check the factor"}</b></> : <p>Run the decimal check to compare both forms.</p>}</article></aside>
    </main>
    <section className="surds100-notes"><article><small>GUIDED STEPS</small><ol><li><b>1</b>Write {radicand} as a product of a square and a non-square.<strong>{radicand} = {squareFactor} × {quotient}</strong></li><li><b>2</b>Take the square root of the square factor.<strong>√{squareFactor} = {validSquareFactor ? coefficient : "?"}</strong></li><li><b>3</b>Leave the non-square factor inside the root.<strong>√{residual}</strong></li><li><b>4</b>Combine the outside root with the inside root.<strong className="purple">√{radicand} = {result}</strong></li></ol></article><article><small>KEY FORMULA</small><p>For a, b ≥ 0:</p><strong>√ab = √a √b</strong><p>Use this to split a radicand into a square factor and a remaining factor.</p></article><article><small><AlertTriangle /> IMPORTANT WARNING</small><h3>Do not split roots over addition.</h3><p>√(9 + 16) = √25 = 5 <Check /></p><b>But</b><p>√9 + √16 = 3 + 4 = 7 <X /></p><footer>These are not the same.<br />Roots split over multiplication,<br />not addition.</footer></article></section>
    <section className="surds100-examples"><article><small>WORKED EXAMPLE</small><h3>Simplify √50.</h3><div>√50&nbsp; = &nbsp;√25 × 2<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;√25 √2<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;5√2</div><footer><b>Decimal check:</b><br />√50 ≈ 7.071<br />5√2 ≈ 7.071 &nbsp; <Check /> Match</footer></article><article><small>PRACTICE</small><h3>Simplify √72.</h3>{[["A", "3√6"], ["B", "4√2"], ["C", "6√2"], ["D", "2√16"]].map(([key, label]) => <label className={practiceChoice === key ? "selected" : ""} key={key}><input type="radio" name="surd-practice" aria-label={`Practice choice ${key} ${label}`} checked={practiceChoice === key} onChange={() => { setPracticeChoice(key); setPracticeChecked(false); act(); }} /><b>{key}.</b><span>{label}</span></label>)}<div><button type="button" onClick={() => { setPracticeChecked(true); act(); }}>Check answer</button><p className={practiceChecked && practiceCorrect ? "correct" : "pending"}>{practiceChecked ? practiceCorrect ? "Correct! √72 = √(36 × 2) = 6√2" : "Try again: find the largest square factor." : "Select an answer and check it."}</p></div></article></section>
    <nav className="surds100-navigation"><a href="/lessons/algebra/99-indices"><ArrowLeft /><span>PREVIOUS<b>Indices</b></span></a><a href="/lessons/algebra/101-rationalisation"><span>NEXT<b>Rationalisation</b></span><ArrowRight /></a></nav>
    <footer className="surds100-footer"><h3>Math Universe</h3><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><hr /><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><p>www.IndianServers.com info@IndianServers.com</p></footer>
  </div>;
}
