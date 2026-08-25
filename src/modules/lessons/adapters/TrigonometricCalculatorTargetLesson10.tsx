import { Check, CircleAlert, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./TrigonometricCalculatorTargetLesson10.css";

const ANGLES = [0, 30, 45, 60, 90] as const;
const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const PRACTICE = [
  [45, 45],
  [30, 60],
  [60, 30],
] as const;

const rounded = (value: number) => Math.round(value * 1000) / 1000;
const trig = (kind: "sin" | "cos", angle: number, mode: "DEG" | "RAD") => {
  const input = mode === "DEG" ? (angle * Math.PI) / 180 : angle;
  return rounded(Math[kind](input));
};
const exact = (kind: "sin" | "cos", angle: number) => {
  const values: Record<string, string> = {
    "sin-0": "0",
    "sin-30": "1/2",
    "sin-45": "√2/2",
    "sin-60": "√3/2",
    "sin-90": "1",
    "cos-0": "1",
    "cos-30": "√3/2",
    "cos-45": "√2/2",
    "cos-60": "1/2",
    "cos-90": "0",
  };
  return values[`${kind}-${angle}`] ?? String(trig(kind, angle, "DEG"));
};

export default function TrigonometricCalculatorTargetLesson10({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [sinAngle, setSinAngle] = useState(30);
  const [cosAngle, setCosAngle] = useState(60);
  const [mode, setMode] = useState<"DEG" | "RAD">("DEG");
  const [activeHandle, setActiveHandle] = useState<"sin" | "cos">("sin");
  const [actions, setActions] = useState(0);
  const [view, setView] = useState(0);
  const [problem, setProblem] = useState(0);
  const [answer, setAnswer] = useState("about 1.414");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "correct",
  );
  const circleRef = useRef<SVGSVGElement>(null);
  const sinValue = trig("sin", sinAngle, mode);
  const cosValue = trig("cos", cosAngle, mode);
  const output = rounded(sinValue + cosValue);
  const [practiceSin, practiceCos] = PRACTICE[problem];
  const practiceResult = rounded(
    Math.sin((practiceSin * Math.PI) / 180) +
      Math.cos((practiceCos * Math.PI) / 180),
  );
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setSinAngle(30);
    setCosAngle(60);
    setMode("DEG");
    setActiveHandle("sin");
    setActions(0);
    setView(0);
    onInteraction();
  };
  useEffect(() => {
    setSinAngle(30);
    setCosAngle(60);
    setMode("DEG");
    setActiveHandle("sin");
    setActions(0);
    setView(0);
    setProblem(0);
    setAnswer("about 1.414");
    setFeedback("correct");
  }, [resetToken]);
  const setAngle = (kind: "sin" | "cos", value: number) => {
    const nearest = ANGLES.reduce(
      (best, angle) =>
        Math.abs(angle - value) < Math.abs(best - value) ? angle : best,
      0,
    );
    if (kind === "sin") setSinAngle(nearest);
    else setCosAngle(nearest);
    setActiveHandle(kind);
    touch();
  };
  const dragCircle = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!(event.buttons & 1)) return;
    const rect = circleRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left - rect.width / 2;
    const y = rect.height / 2 - event.clientY + rect.top;
    setAngle(
      activeHandle,
      Math.max(0, Math.min(90, (Math.atan2(y, x) * 180) / Math.PI)),
    );
  };
  const grade = () => {
    const numeric = Number(answer.replace(/[^0-9.-]/g, ""));
    setFeedback(
      Math.abs(numeric - practiceResult) < 0.01 ? "correct" : "incorrect",
    );
    touch();
  };
  const point = (angle: number, radius = 122) => ({
    x: 150 + radius * Math.cos((angle * Math.PI) / 180),
    y: 150 - radius * Math.sin((angle * Math.PI) / 180),
  });
  const pSin = point(sinAngle),
    pCos = point(cosAngle);
  return (
    <div
      className="target-trigcalc-page"
      data-testid="calculator-mockup-0010"
      data-dedicated-lesson="10"
      data-object-model="dual-draggable-unit-circle-special-angle-triangle-mode-trace-practice-model"
      data-sin-angle={sinAngle}
      data-cos-angle={cosAngle}
      data-mode={mode}
      data-output={output}
      data-actions={actions}
      data-view={view}
      data-feedback={feedback}
    >
      <nav className="trigcalc-breadcrumb">
        <a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>10 Trigonometric Calculator</b>
      </nav>
      <header className="trigcalc-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Trigonometric Calculator</h1>
        <p>Learn special-angle values and why angle mode accuracy matters.</p>
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
                `sin(${sinAngle}) + cos(${cosAngle}) = ${output}`,
              )
            }
          >
            ⌘ Share
          </button>
        </nav>
        <button type="button" className="trigcalc-workspace" onClick={touch}>
          ↗ Workspace
        </button>
      </header>
      <nav className="trigcalc-tabs">
        {TABS.map((tab, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              touch();
            }}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="trigcalc-lab">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>
            Special-angle lab: sin({sinAngle}°) + cos({cosAngle}°) in {mode}{" "}
            mode
          </h2>
          <div>
            <b>
              <CircleAlert />
              Mode matters
            </b>
            <span>{actions} actions</span>
            <button type="button" onClick={touch}>
              ↗
            </button>
          </div>
        </header>
        <div className="trigcalc-work">
          <main>
            <header>
              <b>
                Explore the unit circle &amp; right triangles. Drag the angle
                handles.
              </b>
              <nav>
                <button
                  type="button"
                  className={mode === "DEG" ? "active" : ""}
                  onClick={() => {
                    setMode("DEG");
                    touch();
                  }}
                >
                  DEG
                </button>
                <button
                  type="button"
                  className={mode === "RAD" ? "active" : ""}
                  onClick={() => {
                    setMode("RAD");
                    touch();
                  }}
                >
                  RAD
                </button>
              </nav>
            </header>
            <div className="trigcalc-visuals">
              <section className="trigcalc-circle-wrap">
                <svg
                  ref={circleRef}
                  className="trigcalc-circle"
                  viewBox="0 0 300 300"
                  onPointerMove={dragCircle}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    dragCircle(event);
                  }}
                >
                  <line x1="20" y1="150" x2="285" y2="150" />
                  <line x1="150" y1="282" x2="150" y2="15" />
                  <circle cx="150" cy="150" r="122" />
                  <line
                    className="sin-ray"
                    x1="150"
                    y1="150"
                    x2={pSin.x}
                    y2={pSin.y}
                  />
                  <line
                    className="cos-ray"
                    x1="150"
                    y1="150"
                    x2={pCos.x}
                    y2={pCos.y}
                  />
                  <circle
                    className="sin-handle"
                    cx={pSin.x}
                    cy={pSin.y}
                    r="7"
                    onPointerDown={() => setActiveHandle("sin")}
                  />
                  <circle
                    className="cos-handle"
                    cx={pCos.x}
                    cy={pCos.y}
                    r="7"
                    onPointerDown={() => setActiveHandle("cos")}
                  />
                  <text x={pSin.x + 8} y={pSin.y - 8}>
                    {sinAngle}°
                  </text>
                  <text className="cos-label" x={pCos.x + 8} y={pCos.y - 8}>
                    {cosAngle}°
                  </text>
                  <text x="278" y="145">
                    x
                  </text>
                  <text x="160" y="18">
                    y
                  </text>
                  <text x="275" y="169">
                    1
                  </text>
                  <text x="7" y="169">
                    -1
                  </text>
                  <text x="132" y="26">
                    1
                  </text>
                  <text x="128" y="289">
                    -1
                  </text>
                </svg>
                <label>
                  sin angle
                  <input
                    aria-label="Sine angle drag control"
                    type="range"
                    min="0"
                    max="90"
                    step="15"
                    value={sinAngle}
                    onChange={(e) => setAngle("sin", Number(e.target.value))}
                  />
                </label>
                <label>
                  cos angle
                  <input
                    aria-label="Cosine angle drag control"
                    type="range"
                    min="0"
                    max="90"
                    step="15"
                    value={cosAngle}
                    onChange={(e) => setAngle("cos", Number(e.target.value))}
                  />
                </label>
              </section>
              <div className="trigcalc-triangles">
                <Triangle kind="sin" angle={sinAngle} value={sinValue} />
                <Triangle kind="cos" angle={cosAngle} value={cosValue} />
              </div>
            </div>
            <section className="trigcalc-combine">
              <small>Combine the values</small>
              <p>
                <b>sin({sinAngle}°)</b> + <strong>cos({cosAngle}°)</strong> ={" "}
                <b>{sinValue}</b> + <strong>{cosValue}</strong> ={" "}
                <output>{output}</output>
              </p>
            </section>
          </main>
          <aside className="trigcalc-trace">
            <h3>Concept trace</h3>
            <Trace
              label="Mode"
              value={mode}
              note={`Values are computed in ${mode === "DEG" ? "degree" : "radian"} mode.`}
            />
            <Trace
              label={`sin(${sinAngle}°)`}
              value={String(sinValue)}
              note={
                mode === "DEG"
                  ? `= ${exact("sin", sinAngle)}`
                  : "radian interpretation"
              }
            />
            <Trace
              label={`cos(${cosAngle}°)`}
              value={String(cosValue)}
              note={
                mode === "DEG"
                  ? `= ${exact("cos", cosAngle)}`
                  : "radian interpretation"
              }
            />
            <Trace
              label="Output"
              value={String(output)}
              note={mode === "DEG" ? "Exact result" : "Approximate result"}
            />
            <p className="mode-warning">
              <CircleAlert />
              Wrong mode gives a misleading answer.
            </p>
          </aside>
        </div>
        <div className="trigcalc-bottom">
          <section>
            <h3>Special-angle values (DEG)</h3>
            <table>
              <thead>
                <tr>
                  <th>Angle</th>
                  <th>30°</th>
                  <th>45°</th>
                  <th>60°</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>sin θ</th>
                  <td>1/2</td>
                  <td>√2/2</td>
                  <td>√3/2</td>
                </tr>
                <tr>
                  <th>cos θ</th>
                  <td>√3/2</td>
                  <td>√2/2</td>
                  <td>1/2</td>
                </tr>
              </tbody>
            </table>
            <p>♧ Memorize these to solve quickly and accurately.</p>
          </section>
          <section className="trigcalc-practice">
            <button
              type="button"
              aria-label="Next trigonometry problem"
              onClick={() => {
                setProblem((problem + 1) % PRACTICE.length);
                setAnswer("");
                setFeedback("idle");
                touch();
              }}
            >
              ↻
            </button>
            <h3>Try it yourself</h3>
            <p>
              Evaluate &nbsp; sin({practiceSin}°)+cos({practiceCos}°)
            </p>
            <label>
              Your answer
              <input
                aria-label="Trigonometric practice answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setFeedback("idle");
                }}
                onBlur={grade}
              />
            </label>
            <button type="button" className="trigcalc-check" onClick={grade}>
              <Check />
              Check
            </button>
            <label>
              Reveal answer
              <output>
                {feedback === "correct"
                  ? `√2 (about ${practiceResult})`
                  : feedback === "incorrect"
                    ? "Try the special-angle table"
                    : "Check your answer"}
              </output>
            </label>
          </section>
        </div>
      </section>
      <nav className="trigcalc-neighbors">
        <a href="/lessons/core-workspaces/9-exponential-calculations">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Exponential Calculations
          </span>
        </a>
        <a href="/lessons/core-workspaces/11-inverse-trigonometry">
          <span>
            <small>NEXT</small>Inverse Trigonometry
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="trigcalc-footer">
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
      </footer>
    </div>
  );
}

function Triangle({
  kind,
  angle,
  value,
}: {
  kind: "sin" | "cos";
  angle: number;
  value: number;
}) {
  return (
    <section className={kind}>
      <h3>
        {kind}({angle}°)
      </h3>
      <div>
        <svg viewBox="0 0 150 105">
          <path d="M15 92 L125 92 L125 12 Z" />
          <path d="M110 92 v-15 h15" />
          <text x="56" y="101">
            {kind === "sin" ? exact("cos", angle) : exact("sin", angle)}
          </text>
          <text x="128" y="55">
            {kind === "sin" ? exact("sin", angle) : exact("cos", angle)}
          </text>
          <text x="45" y="77">
            {angle}°
          </text>
        </svg>
        <p>
          <b>
            {kind}({angle}°) =
          </b>
          <strong>{exact(kind, angle)}</strong>
          <output>= {value}</output>
        </p>
      </div>
    </section>
  );
}
function Trace({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <section>
      <h4>
        {label}
        <b>{value}</b>
      </h4>
      <p>{note}</p>
    </section>
  );
}
