import { Check, Lightbulb, Maximize2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./AbsoluteValueTargetLesson14.css";

const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const clamp = (value: number) => Math.max(-15, Math.min(15, Math.round(value)));

export default function AbsoluteValueTargetLesson14({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [value, setValue] = useState(-12),
    [mode, setMode] = useState<"distance" | "direction">("distance"),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [firstAnswer, setFirstAnswer] = useState("7"),
    [secondAnswer, setSecondAnswer] = useState("7"),
    [checked, setChecked] = useState(true),
    [revealed, setRevealed] = useState(true);
  const distance = Math.abs(value),
    direction =
      value < 0 ? "Left of zero" : value > 0 ? "Right of zero" : "At zero",
    mirror = -value;
  const update = (next: number) => {
    setValue(clamp(next));
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setValue(-12);
    setMode("distance");
    setView(0);
    setActions(0);
    setFirstAnswer("7");
    setSecondAnswer("7");
    setChecked(true);
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setValue(-12);
    setMode("distance");
    setView(0);
    setActions(0);
    setFirstAnswer("7");
    setSecondAnswer("7");
    setChecked(true);
    setRevealed(true);
  }, [resetToken]);
  const grade = () => {
    setChecked(Number(firstAnswer) === 7 && Number(secondAnswer) === 7);
    setRevealed(true);
    onInteraction();
  };
  const percent = (number: number) => ((number + 15) / 30) * 100;
  return (
    <div
      className="target-absolute-page"
      data-testid="calculator-mockup-0014"
      data-dedicated-lesson="14"
      data-object-model="dual-draggable-signed-point-mirror-distance-arc-direction-trace-symmetry-practice-model"
      data-value={value}
      data-distance={distance}
      data-direction={direction}
      data-mirror={mirror}
      data-mode={mode}
      data-view={view}
      data-actions={actions}
      data-checked={checked}
      data-revealed={revealed}
    >
      <nav className="absolute-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>14 Absolute Value</b>
      </nav>
      <header className="absolute-header">
        <span>CORE WORKSPACES</span>
        <span>SCIENTIFIC CALCULATOR</span>
        <h1>Absolute Value</h1>
        <p>
          Absolute value is the distance from zero. Distance cannot be negative.
        </p>
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
              navigator.clipboard?.writeText(`|${value}| = ${distance}`)
            }
          >
            ⌘ Share
          </button>
        </nav>
        <button type="button" onClick={onInteraction}>
          ↗ Workspace
        </button>
      </header>
      <nav className="absolute-tabs">
        {TABS.map((tab, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            onClick={() => {
              setView(index);
              setActions((v) => v + 1);
              onInteraction();
            }}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="absolute-lab">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>Absolute Value Distance Lab</h2>
          <p>Explore how far a number is from zero on the number line.</p>
          <nav>
            <span>Mode</span>
            <button
              type="button"
              className={mode === "distance" ? "active" : ""}
              onClick={() => {
                setMode("distance");
                onInteraction();
              }}
            >
              Distance
            </button>
            <button
              type="button"
              className={mode === "direction" ? "active" : ""}
              onClick={() => {
                setMode("direction");
                onInteraction();
              }}
            >
              Direction
            </button>
          </nav>
          <button type="button">
            <Maximize2 />
          </button>
        </header>
        <div className="absolute-columns">
          <main>
            <section className="absolute-equation">
              <div>| {value} | = <b>{distance}</b></div>
              <small>
                {mode === "distance"
                  ? "distance cannot be negative."
                  : `${value} is ${direction.toLowerCase()}.`}
              </small>
            </section>
            <section className="absolute-line">
              <svg
                viewBox="0 0 600 185"
                aria-label="Absolute value number line"
              >
                <line x1="20" y1="105" x2="580" y2="105" />
                {Array.from({ length: 31 }, (_, i) => i - 15).map((number) => (
                  <g key={number}>
                    <line
                      x1={20 + percent(number) * 5.6}
                      y1="97"
                      x2={20 + percent(number) * 5.6}
                      y2="113"
                    />
                    {number % 2 === 0 || Math.abs(number) === 15 ? (
                      <text x={20 + percent(number) * 5.6} y="132">
                        {number}
                      </text>
                    ) : null}
                  </g>
                ))}
                <path
                  className="distance-arc"
                  d={`M ${20 + percent(value) * 5.6} 93 Q ${20 + percent(value / 2) * 5.6} 20 ${20 + percent(0) * 5.6} 93`}
                />
                <text
                  className="distance-label"
                  x={20 + percent(value / 2) * 5.6 - 20}
                  y="35"
                >
                  {distance} units
                </text>
                <circle className="zero" cx={300} cy="105" r="7" />
                <circle
                  className="input-point"
                  cx={20 + percent(value) * 5.6}
                  cy="105"
                  r="8"
                />
                <circle
                  className="mirror-point"
                  cx={20 + percent(mirror) * 5.6}
                  cy="105"
                  r="8"
                />
                <text className="zero-label" x="293" y="137">
                  0
                </text>
              </svg>
              <input
                aria-label="Absolute value point drag control"
                type="range"
                min="-15"
                max="15"
                value={value}
                onChange={(e) => update(Number(e.target.value))}
              />
              <input
                aria-label="Absolute value mirrored point drag control"
                type="range"
                min="-15"
                max="15"
                value={mirror}
                onChange={(e) => update(-Number(e.target.value))}
              />
              <label
                className="input-tag"
                style={{ left: `${percent(value)}%` }}
              >
                <b>{value}</b>
                <small>Drag me</small>
              </label>
              <label
                className="mirror-tag"
                style={{ left: `${percent(mirror)}%` }}
              >
                <b>{mirror}</b>
                <small>
                  Mirrored point
                  <br />
                  Drag me
                </small>
              </label>
            </section>
            <section className="absolute-note">
              ⓘ &nbsp; Absolute value measures distance from zero.
              <br />
              Distance is always <b>zero or positive.</b>
            </section>
            <section className="absolute-symmetry">
              <h3>⚖ &nbsp; Symmetry view</h3>
              <div>
                <b>{value}</b>
                <span>→</span>
                <output>{distance}</output>
                <strong>|−a| = |a|</strong>
                <b>{mirror}</b>
                <span>→</span>
                <output>{distance}</output>
              </div>
            </section>
          </main>
          <aside className="absolute-trace">
            <h3>Concept trace</h3>
            <Trace title="INPUT" value={String(value)} />
            <i>⌄</i>
            <Trace title="SIGN (DIRECTION)" value={direction} />
            <i>⌄</i>
            <Trace title="DISTANCE" value={`${distance} units`} cyan />
            <i>⌄</i>
            <Trace
              title="OUTPUT"
              value={String(distance)}
              orange
              note="Distance cannot be negative."
            />
            <section>
              <Lightbulb />
              <p>Absolute value shows how far a number is from zero.</p>
            </section>
          </aside>
        </div>
        <section className="absolute-practice">
          <header>
            <b>✎</b>
            <div>
              <h3>Let's practice!</h3>
              <p>What is |7|? What is |−7|?</p>
              <small>Drag the points and think about the distance.</small>
            </div>
            <label>
              | 7 | ={" "}
              <input
                aria-label="Positive absolute value practice answer"
                value={firstAnswer}
                onChange={(e) => {
                  setFirstAnswer(e.target.value);
                  setChecked(false);
                }}
              />
              {checked ? <Check /> : null}
            </label>
            <label>
              | −7 | ={" "}
              <input
                aria-label="Negative absolute value practice answer"
                value={secondAnswer}
                onChange={(e) => {
                  setSecondAnswer(e.target.value);
                  setChecked(false);
                }}
              />
              {checked ? <Check /> : null}
            </label>
            <button type="button" onClick={grade}>
              Check
            </button>
          </header>
          <footer onClick={() => setRevealed((v) => !v)}>
            <b>★ &nbsp; {revealed ? "Reveal: both are 7." : "Reveal answer"}</b>
            {revealed ? (
              <p>
                The distance of 7 from zero is 7 units. The distance of −7 from
                zero is also 7 units.
              </p>
            ) : null}
          </footer>
        </section>
      </section>
      <nav className="absolute-neighbors">
        <a href="/lessons/core-workspaces/13-factorial-permutation-and-combination">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Factorial, Permutation and Combination
          </span>
        </a>
        <a href="/lessons/core-workspaces/15-rounding-and-precision">
          <span>
            <small>NEXT</small>Rounding and Precision
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="absolute-footer">
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
  cyan,
  orange,
}: {
  title: string;
  value: string;
  note?: string;
  cyan?: boolean;
  orange?: boolean;
}) {
  return (
    <section className={`${cyan ? "cyan" : ""} ${orange ? "orange" : ""}`}>
      <small>{title}</small>
      <b>{value}</b>
      {note ? <p>{note}</p> : null}
    </section>
  );
}
