import { CheckCircle2, Lightbulb, Maximize2, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./InverseTrigonometryTargetLesson11.css";

const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const clampRatio = (value: number) =>
  Math.max(-1, Math.min(1, Math.round(value * 100) / 100));
const trim = (value: number) => Number(value.toFixed(3)).toString();

export default function InverseTrigonometryTargetLesson11({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [ratio, setRatio] = useState(0.5);
  const [mode, setMode] = useState<"DEG" | "RAD">("DEG");
  const [view, setView] = useState(0);
  const [practiceRatio, setPracticeRatio] = useState(1);
  const [answer, setAnswer] = useState("90");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "correct",
  );
  const [revealed, setRevealed] = useState(true);
  const circleRef = useRef<SVGSVGElement>(null);
  const radians = Math.asin(ratio);
  const degrees = (radians * 180) / Math.PI;
  const adjacent = Math.cos(radians);
  const result = mode === "DEG" ? degrees : radians;
  const practiceDegrees = (Math.asin(practiceRatio) * 180) / Math.PI;
  const x = 150 + adjacent * 105;
  const y = 150 - ratio * 105;
  const updateRatio = (value: number) => {
    setRatio(clampRatio(value));
    onInteraction();
  };
  const reset = () => {
    setRatio(0.5);
    setMode("DEG");
    setView(0);
    setPracticeRatio(1);
    setAnswer("90");
    setFeedback("correct");
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setRatio(0.5);
    setMode("DEG");
    setView(0);
    setPracticeRatio(1);
    setAnswer("90");
    setFeedback("correct");
    setRevealed(true);
  }, [resetToken]);
  const dragRay = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!(event.buttons & 1)) return;
    const rect = circleRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerY = rect.top + rect.height / 2;
    updateRatio((centerY - event.clientY) / (rect.height * 0.35));
  };
  const grade = () => {
    setFeedback(
      Math.abs(Number(answer) - practiceDegrees) < 0.11
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };
  return (
    <div
      className="target-inverse-page"
      data-testid="calculator-mockup-0011"
      data-dedicated-lesson="11"
      data-object-model="draggable-ratio-principal-angle-unit-circle-triangle-range-verification-practice-model"
      data-ratio={ratio}
      data-mode={mode}
      data-angle={trim(result)}
      data-degrees={trim(degrees)}
      data-practice-ratio={practiceRatio}
      data-feedback={feedback}
      data-view={view}
    >
      <nav className="inverse-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>11 Inverse Trigonometry</b>
      </nav>
      <header className="inverse-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Inverse Trigonometry</h1>
        <p>Find angles from ratios.</p>
        <section>
          <b>⚲ Foundational-Advanced</b>
          <b>⌁ Calculator Lab</b>
          <b>▤ Scientific Calculator</b>
          <b>◷ 6-10 min</b>
        </section>
        <nav>
          <button type="button">⚒ English (English)⌄</button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard?.writeText(
                `asin(${ratio}) = ${trim(result)}${mode === "DEG" ? "°" : " rad"}`,
              )
            }
          >
            ⌘ Share
          </button>
        </nav>
        <button type="button" onClick={onInteraction}>
          ↗ Workspace
        </button>
      </header>
      <nav className="inverse-tabs">
        {TABS.map((tab, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              onInteraction();
            }}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="inverse-lab">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>Inverse sine lab: asin({ratio})</h2>
          <p>
            The input ratio returns the principal angle in the range −90° to
            90°.
          </p>
          <nav>
            <button
              type="button"
              className={mode === "DEG" ? "active" : ""}
              onClick={() => {
                setMode("DEG");
                onInteraction();
              }}
            >
              DEG
            </button>
            <button
              type="button"
              className={mode === "RAD" ? "active" : ""}
              onClick={() => {
                setMode("RAD");
                onInteraction();
              }}
            >
              RAD
            </button>
          </nav>
          <button type="button" onClick={onInteraction}>
            <Maximize2 />
            Full screen
          </button>
        </header>
        <div className="inverse-columns">
          <main>
            <div className="inverse-models">
              <section className="ratio-card">
                <h3>
                  <i>1</i> Set the ratio (y)
                </h3>
                <p>Drag the slider to set the sine ratio.</p>
                <div className="ratio-slider">
                  <output>{ratio}</output>
                  <input
                    aria-label="Inverse sine ratio drag control"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={ratio}
                    onChange={(e) => updateRatio(Number(e.target.value))}
                  />
                  <span>
                    <b>-1</b>
                    <b>0</b>
                    <b>1</b>
                  </span>
                </div>
                <article>
                  <small>Current ratio</small>
                  <b>y = {ratio}</b>
                </article>
                <footer>
                  On the unit circle, <i>y</i> is the vertical coordinate (sine
                  value).
                </footer>
              </section>
              <section className="inverse-circle-card">
                <h3>
                  <i>2</i> Unit circle (r = 1)
                </h3>
                <p>Point P represents (cos θ, sin θ).</p>
                <svg
                  ref={circleRef}
                  viewBox="0 0 300 300"
                  aria-label="Draggable inverse sine unit circle"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    dragRay(e);
                  }}
                  onPointerMove={dragRay}
                >
                  <line x1="25" y1="150" x2="285" y2="150" />
                  <line x1="150" y1="282" x2="150" y2="18" />
                  <circle cx="150" cy="150" r="105" />
                  <line className="ratio-guide" x1="45" y1={y} x2={x} y2={y} />
                  <line className="angle-ray" x1="150" y1="150" x2={x} y2={y} />
                  <line className="projection" x1={x} y1="150" x2={x} y2={y} />
                  <circle className="ray-handle" cx={x} cy={y} r="8" />
                  <text x={Math.min(x - 35, 205)} y={y - 10}>
                    P ({trim(adjacent)}, {ratio})
                  </text>
                  <text x="177" y={ratio >= 0 ? 142 : 169}>
                    θ {trim(degrees)}°
                  </text>
                  <text x="282" y="145">
                    x
                  </text>
                  <text x="132" y="20">
                    y
                  </text>
                  <text x={x - 12} y="173">
                    {trim(adjacent)}
                  </text>
                  <text x="125" y={y - 5}>
                    {ratio}
                  </text>
                </svg>
                <footer>
                  ♙ Drag the purple ray to change θ.
                  <br />
                  It stays within −90° to 90°.
                </footer>
              </section>
              <section className="inverse-triangle-card">
                <h3>
                  <i>3</i> Right triangle view
                </h3>
                <p>Formed by the angle θ.</p>
                <svg viewBox="0 0 190 225">
                  <path d="M18 190 L170 190 L170 45 Z" />
                  <path d="M154 190 v-16 h16" />
                  <circle cx="170" cy="45" r="4" />
                  <circle cx="18" cy="190" r="4" />
                  <text x="43" y="181">
                    θ
                  </text>
                  <text x="137" y="121">
                    opposite
                  </text>
                  <text x="137" y="134">
                    (sin θ)
                  </text>
                  <text x="63" y="207">
                    adjacent (cos θ)
                  </text>
                  <text x="91" y="112">
                    1
                  </text>
                  <text x="142" y="150">
                    {ratio}
                  </text>
                  <text x="93" y="220">
                    {trim(adjacent)}
                  </text>
                </svg>
                <p className="triangle-equation">
                  sin θ = <b>opposite</b> / hypotenuse
                  <br />= {ratio} / 1 = <strong>{ratio}</strong>
                </p>
              </section>
            </div>
            <section className="inverse-result">
              <article>
                <h3>
                  <i>4</i> Result (principal angle)
                </h3>
                <p>Inverse sine returns the main angle.</p>
              </article>
              <output>
                asin({ratio}) = {trim(result)}
                {mode === "DEG" ? "°" : " rad"}
              </output>
              <article>
                <h3>Verify the result</h3>
                <p>
                  sin({trim(degrees)}°) = {ratio} <CheckCircle2 />
                </p>
              </article>
            </section>
            <section className="inverse-range">
              <h3>
                <i>5</i> Principal value range for asin
              </h3>
              <p>asin(x) returns values in the range −90° to 90°.</p>
              <div>
                <span
                  className="range-dot"
                  style={{ left: `${(degrees + 90) / 1.8}%` }}
                >
                  <b>{trim(degrees)}°</b>
                </span>
                <i />
                <label>
                  -90°<small>(y = -1)</small>
                </label>
                <label>
                  0°<small>(y = 0)</small>
                </label>
                <label>
                  90°<small>(y = 1)</small>
                </label>
              </div>
              <aside>
                <b>Principal output</b>
                <p>
                  The angle {trim(degrees)}° is the unique principal angle whose
                  sine is {ratio}.
                </p>
              </aside>
            </section>
            <section className="inverse-practice">
              <h3>
                <i>6</i> Try it yourself
              </h3>
              <p>What is asin({practiceRatio})? Drag the slider and check.</p>
              <div>
                <output>{practiceRatio}</output>
                <input
                  aria-label="Inverse sine practice ratio"
                  type="range"
                  min="-1"
                  max="1"
                  step="0.5"
                  value={practiceRatio}
                  onChange={(e) => {
                    setPracticeRatio(Number(e.target.value));
                    setFeedback("idle");
                    setRevealed(false);
                    onInteraction();
                  }}
                />
                <span>
                  <b>-1</b>
                  <b>0</b>
                  <b>1</b>
                </span>
              </div>
              <label>
                Your answer<span>asin({practiceRatio}) =</span>
                <input
                  aria-label="Inverse trigonometry practice answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setFeedback("idle");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setRevealed((value) => !value)}
                >
                  Reveal answer
                </button>
              </label>
              <aside>
                <b>Check</b>
                <button type="button" onClick={grade}>
                  sin({answer || "?"}°) = {practiceRatio}
                  <CheckCircle2 />
                </button>
                <p className={feedback}>
                  {feedback === "correct"
                    ? "Correct!"
                    : feedback === "incorrect"
                      ? "Try again"
                      : "Ready to check"}
                </p>
                {revealed ? (
                  <small>
                    asin({practiceRatio}) = {trim(practiceDegrees)}°
                  </small>
                ) : null}
              </aside>
            </section>
          </main>
          <aside className="inverse-trace">
            <h3>Concept trace</h3>
            <b>Inverse sine: ratio to principal angle</b>
            <Trace
              title="Ratio"
              value={`y = ${ratio}`}
              note="This is the sine ratio."
            />
            <Trace
              title="Principal angle"
              value={`θ = ${trim(result)}${mode === "DEG" ? "°" : " rad"}`}
              note={
                mode === "DEG" ? "Within −90° to 90°." : "Within −π/2 to π/2."
              }
            />
            <Trace
              title="Check"
              value={`sin(${trim(degrees)}°) = ${ratio}`}
              note="Verification matches the ratio."
            />
            <section className="inverse-key">
              <Lightbulb />
              <b>Key idea</b>
              <h4>Inverse trig returns the main angle.</h4>
              <p>It gives the principal angle whose sine is the given ratio.</p>
            </section>
            <section className="inverse-domain">
              <b>Range of asin</b>
              <p>
                <span>-90°</span>
                <span>0°</span>
                <span>90°</span>
              </p>
              <i />
              <small>Output range</small>
            </section>
          </aside>
        </div>
      </section>
      <nav className="inverse-neighbors">
        <a href="/lessons/core-workspaces/10-trigonometric-calculator">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Trigonometric Calculator
          </span>
        </a>
        <a href="/lessons/core-workspaces/12-hyperbolic-functions">
          <span>
            <small>NEXT</small>Hyperbolic Functions
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="inverse-footer">
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
      </footer>
    </div>
  );
}

function Trace({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <section>
      <h4>{title}</h4>
      <b>{value}</b>
      <p>{note}</p>
    </section>
  );
}
