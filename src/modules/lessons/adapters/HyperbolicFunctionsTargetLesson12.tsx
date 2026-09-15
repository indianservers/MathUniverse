import { CheckCircle2, Eye, Maximize2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./HyperbolicFunctionsTargetLesson12.css";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";


const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const PRACTICE = [0, 1, -1, 2] as const;
const fmt = (value: number) => Number(value.toFixed(3)).toString();
// Legacy labels disagreed with the nonlinear projection. Keep the sampled x
// domain and use a linear y range containing every sample (exp(2.5) < 13).
const HYPER_GRAPH_VIEW = { xMin: -2.5, xMax: 2.5, yMin: 0, yMax: 13 };

export default function HyperbolicFunctionsTargetLesson12({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [graphView, setGraphView] = useState(HYPER_GRAPH_VIEW);
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
    setGraphView(HYPER_GRAPH_VIEW);
    setX(1);
    setView(0);
    setActions(0);
    setProblem(0);
    setRevealed(true);
    onInteraction();
  };
  useEffect(() => {
    setGraphView(HYPER_GRAPH_VIEW);
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
          x: sample,
          positive: Math.exp(sample),
          negative: Math.exp(-sample),
        };
      }),
    [],
  );

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
        <button type="button" onClick={() => onInteraction()}>
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
            <button type="button" onClick={() => onInteraction()} aria-label="Record graph interaction">
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
            <section className="hyper-shared-graph">
              <LessonCartesianGraph
                title="Hyperbolic sine using exponentials"
                description="Compare eˣ and e⁻ˣ at the same x. Drag a labelled point horizontally to change x."
                view={graphView} onViewChange={setGraphView} onResetView={() => setGraphView(HYPER_GRAPH_VIEW)}
                series={[
                  { id: "positive", label: "y = eˣ", color: "#08a6c0", points: curves.map(p => ({x:p.x,y:p.positive})) },
                  { id: "negative", label: "y = e⁻ˣ", color: "#8c45e8", points: curves.map(p => ({x:p.x,y:p.negative})), dashed: true },
                  { id: "difference", label: "Difference at x", color: "var(--lg-ink)", points: [{x,y:positive},{x,y:negative}], dashed: true },
                ]}
                annotations={[
                  { id: "positive", x, y:positive, label: "eˣ ≈ " + fmt(positive), color: "#08a6c0", onChange: p => updateX(p.x), keyboardStep: .1 },
                  { id: "negative", x, y:negative, label: "e⁻ˣ ≈ " + fmt(negative), color: "#8c45e8", onChange: p => updateX(p.x), keyboardStep: .1 },
                ]}
              />
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
      <LessonTopicStudyBoard lessonId={12} alwaysVisible onInteraction={onInteraction} />
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

