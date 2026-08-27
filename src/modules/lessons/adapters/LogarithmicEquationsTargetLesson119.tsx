import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Expand,
  Globe2,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./LogarithmicEquationsTargetLesson119.css";

type LogProblem = { base: number; exponent: number; variable: string };

const examples: LogProblem[] = [
  { base: 2, exponent: 5, variable: "x" },
  { base: 10, exponent: 3, variable: "x" },
  { base: 3, exponent: 4, variable: "y" },
];

const practices: LogProblem[] = [
  { base: 3, exponent: 4, variable: "y" },
  { base: 2, exponent: 6, variable: "n" },
  { base: 5, exponent: 3, variable: "t" },
];

const expectedValue = (problem: LogProblem) => problem.base ** problem.exponent;
const close = (left: number, right: number) => Math.abs(left - right) < 1e-8;

function LogTerm({ base, value }: { base: number; value: string | number }) {
  return (
    <span className="log119-log">
      log<sub>{base}</sub>({value})
    </span>
  );
}

function Power({ base, exponent }: { base: number; exponent: number | string }) {
  return (
    <span className="log119-power">
      {base}<sup>{exponent}</sup>
    </span>
  );
}

export default function LogarithmicEquationsTargetLesson119({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [problem, setProblem] = useState<LogProblem>(examples[0]);
  const [xValue, setXValue] = useState(32);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [actions, setActions] = useState(0);

  const target = expectedValue(problem);
  const domainPass = xValue > 0;
  const logValue = domainPass ? Math.log(xValue) / Math.log(problem.base) : null;
  const verified = logValue !== null && close(logValue, problem.exponent);
  const ladderMatch = Array.from({ length: 5 }, (_, index) => index + 1).find(
    (power) => problem.base ** power === xValue,
  );
  const practice = practices[practiceIndex];
  const practiceValue = expectedValue(practice);

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };

  const reset = () => {
    setExampleIndex(0);
    setProblem(examples[0]);
    setXValue(32);
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setShared(false);
    setWorkspace(false);
    setFullscreen(false);
    setPracticeIndex(0);
    setPracticeChecked(false);
    setActions(0);
    onInteraction();
  };

  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseExample = () => {
    const next = (exampleIndex + 1) % examples.length;
    const item = examples[next];
    setExampleIndex(next);
    setProblem(item);
    setXValue(expectedValue(item));
    setPracticeChecked(false);
    act();
  };

  const setCandidate = (value: number) => {
    setXValue(Math.max(-8, Math.min(1000, value)));
    act();
  };

  const nextPractice = () => {
    setPracticeIndex((value) => (value + 1) % practices.length);
    setPracticeChecked(false);
    act();
  };

  return (
    <div
      className={`log119-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="algebra-mockup-0176"
      data-dedicated-lesson="119"
      data-object-model="editable-logarithm-candidate-native-range-drag-domain-gate-exponential-rewrite-generated-power-ladder-value-substitution-check-invalid-input-rejection-quick-practice-model"
      data-problem={`${problem.base},${problem.exponent},${xValue}`}
      data-domain-pass={domainPass}
      data-log-value={logValue === null ? "undefined" : Number(logValue.toFixed(6))}
      data-verified={verified}
      data-ladder-match={ladderMatch ?? "none"}
      data-example-index={exampleIndex}
      data-practice-index={practiceIndex}
      data-practice-checked={practiceChecked}
      data-actions={actions}
    >
      <nav className="log119-breadcrumb" aria-label="Lesson breadcrumb">
        <a href="/">Home</a><span>&gt;</span>
        <a href="/lessons">Lessons</a><span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a><span>&gt;</span>
        <b>119 Logarithmic Equations</b>
      </nav>

      <header className="log119-intro">
        <small><b>ALGEBRA</b><b>EQUATIONS AND INEQUALITIES</b></small>
        <h1>Logarithmic Equations</h1>
        <p>Solve with domain restrictions.</p>
        <nav>
          <b>♙ Intermediate-Advanced</b>
          <b>ϟ Guided Practice</b>
          <b>▣ Solve / NoSolve / Inequality Graphing</b>
          <b>◷ 6-10 min</b>
        </nav>
        <div>
          <label>
            <Globe2 />
            <select
              aria-label="Logarithmic equations language"
              value={language}
              onChange={(event) => { setLanguage(event.target.value); act(); }}
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
            <ChevronDown />
          </label>
          <button onClick={reset}><RotateCcw />Reset</button>
          <button onClick={() => { setShared(true); act(); }}><Share2 />{shared ? "Link ready" : "Share"}</button>
          <button onClick={() => { setWorkspace((value) => !value); act(); }}>↗ {workspace ? "Close workspace" : "Workspace"}</button>
        </div>
      </header>

      <nav className="log119-tabs">
        {["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Examples") chooseExample(); else act();
            }}
          >{tab}</button>
        ))}
      </nav>

      <main className="log119-stage">
        <section className="log119-solver">
          <header>
            <span><small>INTERACTION + VISUALIZATION</small><h2>Solve the logarithmic equation</h2></span>
            <b><ShieldCheck />Domain-gated solver</b>
          </header>

          <div className="log119-equation"><LogTerm base={problem.base} value={problem.variable} /> = {problem.exponent}</div>

          <article className="log119-step rewrite">
            <i>1</i><div><h3>Rewrite as exponential form</h3><p><LogTerm base={problem.base} value={problem.variable} /> = {problem.exponent} means</p></div>
            <strong>{problem.variable} = <Power base={problem.base} exponent={problem.exponent} /></strong>
          </article>

          <article className="log119-step compute">
            <i>2</i><div><h3>Compute</h3><p><Power base={problem.base} exponent={problem.exponent} /> = {target}, so</p></div>
            <strong>{problem.variable} = {target}</strong>
          </article>

          <article className="log119-step domain">
            <i>3</i><h3>Domain gate (log input must be &gt; 0)</h3>
            <div className={domainPass ? "gate pass" : "gate fail"}>
              <ShieldCheck />
              <span><b>Requirement:</b><b>{problem.variable} &gt; 0</b><b>Check:</b><b>{problem.variable} = {xValue}</b></span>
              <strong>{domainPass ? "PASS" : "REJECT"} {domainPass ? <Check /> : <CircleAlert />}</strong>
            </div>
          </article>

          <article className="log119-step value-check">
            <i>4</i><div><h3>Value check</h3><p><LogTerm base={problem.base} value={xValue} /> = {logValue === null ? "undefined" : Number(logValue.toFixed(4))}</p></div>
            <strong className={verified ? "verified" : "rejected"}>{verified ? "Verified" : "Not a solution"} {verified ? <Check /> : <CircleAlert />}</strong>
          </article>

          <section className="log119-explorer">
            <article>
              <h3>{problem.variable} value</h3>
              <input
                aria-label="Logarithm candidate slider"
                type="range"
                min="-8"
                max={Math.max(40, target)}
                value={Math.min(xValue, Math.max(40, target))}
                onChange={(event) => setCandidate(Number(event.target.value))}
              />
              <div className="ticks"><span>-8</span><span>0</span><span>{Math.round(Math.max(40, target) * 0.4)}</span><span>{Math.round(Math.max(40, target) * 0.8)}</span><span>{Math.max(40, target)}</span></div>
              <label><b>{problem.variable} =</b><input aria-label="Logarithm candidate value" type="number" value={xValue} onChange={(event) => setCandidate(Number(event.target.value))} /><button aria-label="Decrease logarithm candidate" onClick={() => setCandidate(xValue - 1)}>−</button><button aria-label="Increase logarithm candidate" onClick={() => setCandidate(xValue + 1)}>+</button></label>
            </article>
            <article className="log119-ladder">
              <h3>Power ladder (base {problem.base})</h3>
              {Array.from({ length: 5 }, (_, index) => index + 1).map((power) => (
                <button
                  key={power}
                  className={problem.base ** power === xValue ? "selected" : ""}
                  aria-label={`Set logarithm candidate to ${problem.base} to ${power}`}
                  onClick={() => setCandidate(problem.base ** power)}
                ><Power base={problem.base} exponent={power} /> = {problem.base ** power}<span>{problem.base ** power === xValue ? "★" : ""}</span></button>
              ))}
            </article>
          </section>
        </section>

        <aside className="log119-rail">
          <section className="log119-reasoning">
            <header><h2>Reasoning steps</h2><button aria-label="Expand reasoning steps" onClick={() => { setFullscreen((value) => !value); act(); }}><Expand /></button></header>
            <div className="reason blue"><i>1</i><span><h3>Rewrite</h3><p>log<sub>b</sub>(x) = c<br />⇔ x = b<sup>c</sup></p></span></div>
            <div className={`reason ${domainPass ? "green" : "red"}`}><i>2</i><span><h3>Domain</h3><p>Log input must be positive.</p><b>{problem.variable} &gt; 0</b></span></div>
            <div className="reason purple"><i>3</i><span><h3>Compute</h3><p>Evaluate the power b<sup>c</sup>.</p><b><Power base={problem.base} exponent={problem.exponent} /> = {target}</b></span></div>
            <div className={`reason ${verified ? "cyan" : "red"}`}><i>4</i><span><h3>Check</h3><p>Substitute back to confirm the solution.</p><b><LogTerm base={problem.base} value={xValue} /> = {logValue === null ? "undefined" : Number(logValue.toFixed(4))}</b></span></div>
          </section>

          <section className="log119-warning"><CircleAlert /><div><h3>LOG_INPUT_NOT_POSITIVE</h3><p>Zero or negative log input is rejected.</p><b>Keep the log input &gt; 0.</b></div></section>

          <section className="log119-practice">
            <header><h2>Quick practice</h2><button onClick={nextPractice}>Try it</button></header>
            <div><p><LogTerm base={practice.base} value={practice.variable} /> = {practice.exponent} <span>→</span> {practice.variable} = ?</p><strong>{practice.variable} = {practiceValue}</strong><button onClick={() => { setPracticeChecked(true); act(); }}>{practiceChecked ? "Solution checked" : "Check solution"}</button></div>
          </section>
        </aside>
      </main>

      <nav className="log119-adjacent">
        <a href="/lessons/algebra/118-exponential-equations"><ArrowLeft /><span><small>PREVIOUS</small>Exponential Equations</span></a>
        <button onClick={() => { setActiveTab("Explain"); act(); }}>▣ View lesson notes</button>
        <a href="/lessons/algebra/120-trigonometric-equations"><span><small>NEXT</small>Trigonometric Equations</span><ArrowRight /></a>
      </nav>

      <footer className="log119-footer">
        <b><Sparkles />Math Universe</b>
        <span>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</span>
        <nav><button>Sitemap</button><button>Docs</button><button>About</button></nav>
        <hr />
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small>
        <small>www.IndianServers.com · info@IndianServers.com</small>
      </footer>
    </div>
  );
}
