import {
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  Info,
  Languages,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./ExactDecimalModesTargetLesson18.css";

type DisplayMode = "exact" | "decimal";
const TABS = ["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"];
const PRACTICE = [
  { prompt: "Choose exact or decimal for the diagonal of a 1 by 1 square.", question: "Which form is best?", answer: "exact" as DisplayMode, exact: "Exact (√2)", decimal: "Decimal (1.414...)" },
  { prompt: "Choose exact or decimal for cutting a board to the diagonal length.", question: "Which form is practical?", answer: "decimal" as DisplayMode, exact: "Exact (√2 m)", decimal: "Decimal (1.414 m)" },
  { prompt: "Choose exact or decimal when proving the Pythagorean relation.", question: "Which form preserves structure?", answer: "exact" as DisplayMode, exact: "Exact (√2)", decimal: "Decimal (1.414...)" },
];

export default function ExactDecimalModesTargetLesson18({ resetToken, onInteraction }: LessonAdapterProps) {
  const [mode, setMode] = useState<DisplayMode>("exact");
  const [precision, setPrecision] = useState(8);
  const [view, setView] = useState(0);
  const [actions, setActions] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceChoice, setPracticeChoice] = useState<DisplayMode>("exact");
  const [showExplanation, setShowExplanation] = useState(false);
  const decimal = Math.SQRT2.toFixed(precision);
  const problem = PRACTICE[practiceIndex];
  const practiceCorrect = practiceChoice === problem.answer;

  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setMode("exact"); setPrecision(8); setView(0); setActions(0); setExpanded(false);
    setWorkspaceOpen(false); setShareState("Share"); setPracticeIndex(0);
    setPracticeChoice("exact"); setShowExplanation(false); onInteraction();
  };
  useEffect(() => {
    setMode("exact"); setPrecision(8); setView(0); setActions(0); setExpanded(false);
    setWorkspaceOpen(false); setShareState("Share"); setPracticeIndex(0);
    setPracticeChoice("exact"); setShowExplanation(false);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(`sqrt(2) = √2 ≈ ${decimal}`);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    touch();
  };
  const selectMode = (next: DisplayMode) => { setMode(next); touch(); };
  const nextQuestion = () => {
    const next = (practiceIndex + 1) % PRACTICE.length;
    setPracticeIndex(next); setPracticeChoice(PRACTICE[next].answer); setShowExplanation(false); touch();
  };

  return (
    <div
      className={`target-exact-page ${expanded ? "expanded" : ""}`}
      data-testid="calculator-mockup-0018"
      data-dedicated-lesson="18"
      data-object-model="linked-unit-square-radical-decimal-number-line-precision-mode-comparison-graded-context-practice-model"
      data-mode={mode}
      data-precision={precision}
      data-decimal={decimal}
      data-actions={actions}
      data-view={view}
      data-practice-index={practiceIndex}
      data-practice-choice={practiceChoice}
      data-practice-correct={practiceCorrect}
      data-expanded={expanded}
    >
      <nav className="exact-breadcrumb">
        <a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>18 Exact And Decimal Modes</b>
      </nav>
      <header className="exact-header">
        <div className="exact-kickers"><span>CORE WORKSPACES</span><span>SCIENTIFIC CALCULATOR</span></div>
        <h1>Exact and Decimal Modes</h1>
        <p>Connect symbolic and approximate forms.</p>
        <div className="exact-meta"><b>♙ Foundational–Advanced</b><b>ϟ Calculator Lab</b><b>▣ Scientific Calculator</b><b>◴ 6–10 min</b></div>
        <nav className="exact-actions">
          <button type="button" onClick={touch}><Languages />English (English)<span>⌄</span></button>
          <button type="button" onClick={reset}><RotateCcw />Reset</button>
          <button type="button" onClick={() => void share()}><Share2 />{shareState}</button>
          <button type="button" className={workspaceOpen ? "active" : ""} onClick={() => { setWorkspaceOpen((value) => !value); touch(); }}><ExternalLink />Workspace</button>
        </nav>
      </header>
      <nav className="exact-tabs" aria-label="Lesson views">
        {TABS.map((tab, index) => <button type="button" className={view === index ? "active" : ""} key={tab} onClick={() => { setView(index); touch(); }}><span>{index === 0 ? "◉" : index === 1 ? "▣" : index === 2 ? "♧" : index === 3 ? "∑" : "✣"}</span>{tab}</button>)}
      </nav>

      <main className="exact-lab">
        <div className="exact-lab-title">
          <div><small>INTERACTION + VISUALIZATION</small><h2>Exact vs. Decimal: Explore the difference</h2></div>
          <div className="exact-status"><b>{actions === 0 ? "Awaiting interaction" : "Updated"}</b><span>{actions} actions</span><button type="button" aria-label="Toggle expanded workspace" onClick={() => { setExpanded((value) => !value); touch(); }}><Maximize2 /></button></div>
        </div>
        <div className="exact-equation" aria-label="Square root of two exact and decimal forms">
          <strong>sqrt(2)</strong><i>=</i><b>√2<small>exact</small></b><i>≈</i><b>1.41421356...<small>approximate</small></b>
        </div>
        <div className="exact-columns">
          <section className="exact-square-card">
            <h3>EXACT (Symbolic)</h3><p>The diagonal of a 1 × 1 square</p>
            <svg viewBox="0 0 330 330" role="img" aria-label="Unit square with exact square root of two diagonal">
              <rect x="35" y="20" width="261" height="261" />
              <line x1="35" y1="281" x2="296" y2="20" />
              <circle cx="35" cy="20" r="4"/><circle cx="296" cy="20" r="4"/><circle cx="35" cy="281" r="4"/><circle cx="296" cy="281" r="4"/>
              <text x="4" y="165">1</text><text x="162" y="318">1</text><text className="root" x="130" y="170">√2</text>
              <text className="axis" x="31" y="318">0</text><text className="axis" x="281" y="318">1</text>
            </svg>
            <div className="exact-note"><Info /><span>The exact length is <b>√2</b>.<br/>It is an irrational number—no ending decimal.</span></div>
          </section>
          <section className="exact-decimal-card">
            <h3>DECIMAL (Approximation)</h3><p>Zoom in on the length</p>
            <div className="exact-number-labels"><b>1.41</b><b>1.414</b><b>1.42</b></div>
            <div className="exact-number-line"><span/><i style={{ left: "50%" }}/></div>
            <output>{Math.SQRT2.toFixed(Math.min(precision, 3))}</output>
            <div className="exact-decimal-form">√2 <i>≈</i> {decimal}{precision < 16 ? "..." : ""}</div>
            <b className="exact-forever">the decimal goes on forever without repeating.</b>
          </section>
          <aside className="exact-trace">
            <h3 className="exact-uppercase">Concept trace</h3>
            <div><small>Exact form</small><b>√2</b><p>The exact, symbolic form.</p></div>
            <div className="violet"><small>Decimal form</small><b>≈ {decimal}...</b><p>An approximation that continues without end.</p></div>
            <div><small>Mode</small><b>{mode}</b><p>Current display mode.</p></div>
            <div><small>Use exact for</small><p>Structure, proofs, simplification, algebraic work.</p></div>
            <div><small>Use decimal for</small><p>Measurement, estimation, real-world context.</p></div>
          </aside>
        </div>
        <section className="exact-controls">
          <div><h3>Display mode</h3><nav><button type="button" className={mode === "exact" ? "active" : ""} onClick={() => selectMode("exact")}>Exact (Symbolic)</button><button type="button" className={mode === "decimal" ? "active" : ""} onClick={() => selectMode("decimal")}>Decimal (Preview)</button></nav></div>
          <label><b>Decimal precision</b><input aria-label="Decimal precision drag control" type="range" min="2" max="16" step="2" value={precision} onChange={(event) => { setPrecision(Number(event.target.value)); touch(); }}/><span>{[2,4,6,8,10,12,14,16].map((value) => <i key={value}>{value}</i>)}</span></label>
          <output>{decimal}<small>({precision} places)</small></output>
        </section>
        <section className="exact-comparison">
          <h3>Compare the two modes</h3>
          <div className="exact-table"><b>Aspect</b><b>Exact (Symbolic)</b><b>Decimal (Approximate)</b><span>Representation</span><span>√2</span><span>{decimal}...</span><span>Nature</span><span>Irrational (infinite, non-repeating)</span><span>Rounded to a finite number</span><span>Purpose</span><span>Use exact for proofs, algebra, and structure</span><span>Use decimal for measurements and estimates</span><span>Key point</span><span>Keeps the full value</span><span>Approximates the value</span></div>
          <p><Sparkles /> Both represent the same number; only the form is different.</p>
        </section>
        <section className="exact-practice">
          <div><h3>Practice</h3><p>{problem.prompt}</p><b>{problem.question}</b>
            <nav><button type="button" className={practiceChoice === "exact" ? "active" : ""} onClick={() => { setPracticeChoice("exact"); touch(); }}>{practiceCorrect && practiceChoice === "exact" ? <CheckCircle2 /> : <Eye />}{problem.exact}</button><button type="button" className={practiceChoice === "decimal" ? "active" : ""} onClick={() => { setPracticeChoice("decimal"); touch(); }}>{practiceCorrect && practiceChoice === "decimal" ? <CheckCircle2 /> : <Eye />}{problem.decimal}</button></nav>
            <button type="button" className="exact-new" onClick={nextQuestion}><RefreshCw />New question</button>
          </div>
          <div className={practiceCorrect ? "exact-answer correct" : "exact-answer wrong"}>{practiceCorrect ? <Check /> : <XCircle />}<span><small>Answer</small><b>{practiceCorrect ? `${problem.answer === "exact" ? "Exact: √2" : "Decimal estimate: 1.414"}` : "Try the other representation"}</b><p>{practiceCorrect ? "Decimal estimate: 1.414" : "Match the form to the context."}</p></span></div>
          <button type="button" className="exact-explain" onClick={() => { setShowExplanation((value) => !value); touch(); }}><Eye />{showExplanation ? "Hide explanation" : "Show explanation"}</button>
          {showExplanation ? <p className="exact-explanation">Exact form preserves the complete irrational value; decimal form is useful when a measured quantity is required.</p> : null}
        </section>
      </main>
      <nav className="exact-neighbors"><a href="/lessons/core-workspaces/17-calculation-history">← <span><small>PREVIOUS</small><b>Calculation History</b></span></a><a href="/lessons/core-workspaces/19-perfect-squares-and-approximations"><span><small>NEXT</small><b>Perfect Squares and Approximations</b></span> →</a></nav>
      <footer className="exact-footer"><b>✣ Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><button type="button" onClick={touch}>Sitemap</button><button type="button" onClick={touch}>Docs</button><button type="button" onClick={touch}>About</button></nav></footer>
    </div>
  );
}
