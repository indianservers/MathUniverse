import { CheckCircle2, Eye, Maximize2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./HyperbolicFunctionsTargetLesson12.css";

const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const PRACTICE = [0, 1, -1, 2] as const;
const fmt = (value: number) => Number(value.toFixed(3)).toString();
const graphY = (value: number) => 300 - 225 * (1 - Math.exp(-value / 3));

export default function HyperbolicFunctionsTargetLesson12({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(1),
    [view, setView] = useState(0),
    [actions, setActions] = useState(0),
    [problem, setProblem] = useState(0),
    [revealed, setRevealed] = useState(true);
  const positive = Math.exp(x),
    negative = Math.exp(-x),
    sinh = (positive - negative) / 2;
  const practiceX = PRACTICE[problem],
    practiceAnswer = Math.sinh(practiceX);
  const updateX = (next: number) => {
    setX(Math.max(-2, Math.min(2, Math.round(next * 10) / 10)));
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setX(1);
    setView(0);
    setActions(0);
    setProblem(0);
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setX(1);
    setView(0);
    setActions(0);
    setProblem(0);
    setRevealed(true);
  }, [resetToken]);
  const curves = useMemo(
    () =>
      Array.from({ length: 81 }, (_, i) => {
        const sample = -2.5 + i / 16;
        return {
          px: 15 + i * 7.1,
          positive: graphY(Math.exp(sample)),
          negative: graphY(Math.exp(-sample)),
        };
      }),
    [],
  );
  const px = 15 + (x + 2.5) * 113.6,
    pyPositive = graphY(positive),
    pyNegative = graphY(negative);
  return (
    <div
      className="target-hyper-page"
      data-testid="calculator-mockup-0012"
      data-dedicated-lesson="12"
      data-object-model="draggable-x-dual-exponential-hyperbolic-sine-difference-trace-practice-model"
      data-x={x}
      data-positive={fmt(positive)}
      data-negative={fmt(negative)}
      data-output={fmt(sinh)}
      data-actions={actions}
      data-view={view}
      data-practice={problem}
      data-revealed={revealed}
    >
      <nav className="hyper-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>12 Hyperbolic Functions</b>
      </nav>
      <header className="hyper-header">
        <h1>Hyperbolic Functions</h1>
        <p>Introduce advanced function families.</p>
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
              navigator.clipboard?.writeText(`sinh(${x}) = ${fmt(sinh)}`)
            }
          >
            ⌘ Share
          </button>
        </nav>
        <button type="button" onClick={onInteraction}>
          ↗ Workspace
        </button>
      </header>
      <nav className="hyper-tabs">
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
      <section className="hyper-lab">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>Hyperbolic sine using exponentials</h2>
          <div>
            <b>
              <i />
              Ready
            </b>
            <span>{actions} actions</span>
            <button type="button" onClick={onInteraction}>
              <Maximize2 />
            </button>
          </div>
        </header>
        <div className="hyper-columns">
          <main>
            <div className="hyper-instruction">
              <b>Drag the blue handle to change x.</b> The values update
              instantly.<span>hyperbolic, not circular sine</span>
            </div>
            <section className="hyper-graph">
              <svg
                viewBox="0 0 600 360"
                aria-label="Hyperbolic exponential graph"
              >
                <line x1="15" y1="300" x2="585" y2="300" />
                <line x1="160" y1="340" x2="160" y2="15" />
                {[70, 145, 220].map((lineY) => (
                  <line
                    className="graph-grid"
                    x1="15"
                    y1={lineY}
                    x2="585"
                    y2={lineY}
                    key={lineY}
                  />
                ))}
                <line
                  className="guide"
                  x1={px}
                  y1="300"
                  x2={px}
                  y2={pyPositive}
                />
                <line
                  className="difference"
                  x1={px}
                  y1={pyPositive}
                  x2={px}
                  y2={pyNegative}
                />
                <text
                  className="difference-label"
                  x={px - 7}
                  y={(pyPositive + pyNegative) / 2}
                >
                  ↕
                </text>
                <polyline
                  className="positive"
                  points={curves.map((p) => `${p.px},${p.positive}`).join(" ")}
                />
                <polyline
                  className="negative"
                  points={curves.map((p) => `${p.px},${p.negative}`).join(" ")}
                />
                <circle
                  className="positive-dot"
                  cx={px}
                  cy={pyPositive}
                  r="7"
                />
                <circle
                  className="negative-dot"
                  cx={px}
                  cy={pyNegative}
                  r="7"
                />
                <text x="535" y="55">
                  y = eˣ
                </text>
                <text className="violet" x="540" y="260">
                  y = e⁻ˣ
                </text>
                <text x={px + 12} y={pyPositive + 15}>
                  eˣ ≈ {fmt(positive)}
                </text>
                <text className="violet" x={px + 12} y={pyNegative - 8}>
                  e⁻ˣ ≈ {fmt(negative)}
                </text>
                <text x="580" y="315">
                  x
                </text>
                <text x="150" y="14">
                  y
                </text>
                <text className="axis-label" x="58" y="318">
                  −2
                </text>
                <text className="axis-label" x="148" y="318">
                  0
                </text>
                <text className="axis-label" x="260" y="318">
                  1
                </text>
                <text className="axis-label" x="374" y="318">
                  2
                </text>
                <text className="axis-label" x="488" y="318">
                  3
                </text>
                <text className="axis-label" x="145" y="225">
                  1
                </text>
                <text className="axis-label" x="145" y="150">
                  2
                </text>
                <text className="axis-label" x="145" y="75">
                  3
                </text>
              </svg>
              <output className="hyper-formula">
                sinh({x}) ={" "}
                <span>
                  (e<sup>{x}</sup> − e<sup>{-x}</sup>)/2
                </span>{" "}
                ≈ <b>{fmt(sinh)}</b>
              </output>
              <input
                aria-label="Hyperbolic x drag control"
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={x}
                onChange={(e) => updateX(Number(e.target.value))}
              />
              <label style={{ left: `${((x + 2) / 4) * 100}%` }}>
                ↔<small>x = {x}</small>
              </label>
            </section>
            <div className="hyper-values">
              <article>
                <b>
                  e<sup>x</sup> &nbsp; at x = {x}
                </b>
                <strong>
                  e<sup>{x}</sup> ≈ {fmt(positive)}
                </strong>
                <p>Natural exponential (growing)</p>
              </article>
              <i>−</i>
              <article>
                <b>
                  e<sup>−x</sup> &nbsp; at x = {x}
                </b>
                <strong>
                  e<sup>{-x}</sup> ≈ {fmt(negative)}
                </strong>
                <p>Reciprocal exponential (decaying)</p>
              </article>
            </div>
            <section className="hyper-average">
              Average of the difference ={" "}
              <span>
                (e<sup>{x}</sup> − e<sup>{-x}</sup>)/2
              </span>{" "}
              ≈ <b>{fmt(sinh)}</b>
            </section>
          </main>
          <aside className="hyper-trace">
            <h3>Concept trace</h3>
            <Trace
              title="Definition"
              value="sinh(x) = (eˣ − e⁻ˣ) / 2"
              note="hyperbolic, not circular sine"
            />
            <Trace title="Input" value={`x = ${x}`} />
            <Trace title={`e${x}`} value={`e${x} ≈ ${fmt(positive)}`} />
            <Trace title={`e−${x}`} value={`e−${x} ≈ ${fmt(negative)}`} />
            <Trace title="Output" value={`sinh(${x}) ≈ ${fmt(sinh)}`} orange />
            <section className="hyper-why">
              <h3>Why hyperbolic?</h3>
              <p>These functions come from the unit hyperbola.</p>
              <svg viewBox="0 0 150 130">
                <line x1="10" y1="65" x2="140" y2="65" />
                <line x1="75" y1="10" x2="75" y2="120" />
                <path d="M15 20 Q60 65 15 110 M135 20 Q90 65 135 110" />
                <text x="52" y="128">
                  x² − y² = 1
                </text>
              </svg>
            </section>
          </aside>
        </div>
        <section className="hyper-practice">
          <header>
            <h3>Try it yourself</h3>
            <button
              type="button"
              onClick={() => {
                setProblem((problem + 1) % PRACTICE.length);
                setRevealed(false);
                setActions((v) => v + 1);
                onInteraction();
              }}
            >
              <RotateCcw />
              New practice
            </button>
          </header>
          <div>
            <article>
              <small>Practice</small>
              <b>What is sinh({practiceX})?</b>
              <button
                type="button"
                onClick={() => {
                  setRevealed((v) => !v);
                  onInteraction();
                }}
              >
                <Eye />
                {revealed ? "Hide answer" : "Reveal answer"}
              </button>
            </article>
            <article>
              <small>Answer</small>
              <b>{revealed ? fmt(practiceAnswer) : "?"}</b>
              <p>
                Because sinh({practiceX}) = (e<sup>{practiceX}</sup> − e
                <sup>{-practiceX}</sup>) / 2 = {fmt(practiceAnswer)}
              </p>
              {revealed ? <CheckCircle2 /> : null}
            </article>
          </div>
        </section>
      </section>
      <nav className="hyper-neighbors">
        <a href="/lessons/core-workspaces/11-inverse-trigonometry">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Inverse Trigonometry
          </span>
        </a>
        <a href="/lessons/core-workspaces/13-factorial-permutation-and-combination">
          <span>
            <small>NEXT</small>Factorial, Permutation and Combination
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="hyper-footer">
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
  orange,
}: {
  title: string;
  value: string;
  note?: string;
  orange?: boolean;
}) {
  return (
    <section className={orange ? "orange" : ""}>
      <h4>{title}</h4>
      <b>{value}</b>
      {note ? <p>{note}</p> : null}
    </section>
  );
}
