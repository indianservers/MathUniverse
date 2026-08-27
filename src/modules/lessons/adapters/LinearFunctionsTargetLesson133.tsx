import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  Languages,
  RotateCcw,
  Scale,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./LinearFunctionsTargetLesson133.css";
import "./LinearFunctionsTargetLesson133Tuning.css";

/* eslint-disable no-irregular-whitespace */

const clean = (value: number) =>
  Math.abs(value) < 0.0001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const signed = (value: number) =>
  value < 0 ? `− ${clean(Math.abs(value))}` : `+ ${clean(value)}`;
const formula = (m: number, b: number, name = "y") =>
  `${name} = ${m === 1 ? "" : m === -1 ? "−" : clean(m)}x ${signed(b)}`;

function MiniLine({ m, b }: { m: number; b: number }) {
  const px = (x: number) => 125 + x * 24,
    py = (y: number) => 85 - y * 17;
  return (
    <svg
      className="lin133-mini"
      viewBox="0 0 250 170"
      aria-label="Linear function preview"
    >
      <defs>
        <pattern
          id="lin133-mini-grid"
          width="24"
          height="17"
          patternUnits="userSpaceOnUse"
        >
          <path d="M24 0H0V17" fill="none" stroke="#d7ebf0" />
        </pattern>
        <marker
          id="lin133-mini-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10Z" fill="#069eb7" />
        </marker>
      </defs>
      <rect width="250" height="170" fill="url(#lin133-mini-grid)" />
      <line x1="8" x2="242" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="160" y2="8" className="axis" />
      <line
        x1={px(-5)}
        y1={py(m * -5 + b)}
        x2={px(5)}
        y2={py(m * 5 + b)}
        className="line"
        markerEnd="url(#lin133-mini-arrow)"
      />
      <text x="230" y="105">
        x
      </text>
      <text x="109" y="17">
        y
      </text>
    </svg>
  );
}

function LinearGraph({
  m,
  b,
  onIntercept,
  onSlope,
}: {
  m: number;
  b: number;
  onIntercept: (value: number) => void;
  onSlope: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<"intercept" | "slope" | null>(null);
  const px = (x: number) => 210 + x * 44,
    py = (y: number) => 250 - y * 43;
  const slopeX = 2,
    slopeY = m * slopeX + b;
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !drag) return;
    const y = (250 - ((event.clientY - box.top) / box.height) * 520) / 43;
    if (drag === "intercept")
      onIntercept(Math.max(-5, Math.min(5, Math.round(y * 2) / 2)));
    else
      onSlope(
        Math.max(-4, Math.min(4, Math.round(((y - b) / slopeX) * 4) / 4)),
      );
  };
  return (
    <svg
      ref={svg}
      className="lin133-graph"
      viewBox="0 0 430 520"
      role="img"
      aria-label="Linear function slope and intercept graph"
      onPointerMove={pointer}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <defs>
        <pattern
          id="lin133-grid"
          width="44"
          height="43"
          patternUnits="userSpaceOnUse"
        >
          <path d="M44 0H0V43" fill="none" stroke="#dce6ec" />
        </pattern>
        <clipPath id="lin133-clip">
          <rect x="10" y="10" width="410" height="500" />
        </clipPath>
        <marker
          id="lin133-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10Z" fill="#079db6" />
        </marker>
      </defs>
      <rect x="10" y="10" width="410" height="500" fill="url(#lin133-grid)" />
      <line x1="10" x2="420" y1={py(0)} y2={py(0)} className="axis" />
      <line x1={px(0)} x2={px(0)} y1="510" y2="10" className="axis" />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
        <text key={`x${x}`} x={px(x)} y={py(0) + 22}>
          {x}
        </text>
      ))}
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((y) => (
        <text key={`y${y}`} x={px(0) - 14} y={py(y) + 4}>
          {y}
        </text>
      ))}
      <text x="414" y={py(0) + 19} className="xy">
        x
      </text>
      <text x={px(0) + 15} y="23" className="xy">
        y
      </text>
      <line
        x1={px(-6)}
        y1={py(m * -6 + b)}
        x2={px(6)}
        y2={py(m * 6 + b)}
        className="function-line"
        clipPath="url(#lin133-clip)"
        markerEnd="url(#lin133-arrow)"
      />
      <path
        d={`M${px(0)},${py(b)}H${px(slopeX)}V${py(slopeY)}`}
        className="triangle"
      />
      <path
        d={`M${px(-2)},${py(m * -2 + b)}H${px(0)}V${py(b)}`}
        className="equal-step"
      />
      <line
        x1={px(-2)}
        x2={px(-2)}
        y1={py(m * -2 + b)}
        y2={py(0)}
        className="guide"
      />
      <line
        x1={px(slopeX)}
        x2={px(slopeX)}
        y1={py(slopeY)}
        y2={py(0)}
        className="guide"
      />
      {[
        [-2, m * -2 + b],
        [0, b],
        [2, slopeY],
      ].map(([x, y], index) => (
        <g key={x} className="point">
          <circle cx={px(x)} cy={py(y)} r={index === 0 ? 7 : 8} />
          <text
            x={px(x) + (index === 0 ? -18 : 13)}
            y={py(y) + (index === 0 ? 29 : index === 1 ? 24 : -15)}
          >
            ({clean(x)}, {clean(y)})
          </text>
        </g>
      ))}
      <circle
        cx={px(0)}
        cy={py(b)}
        r="13"
        className="handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag linear intercept"
        aria-valuemin={-5}
        aria-valuemax={5}
        aria-valuenow={b}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("intercept");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onIntercept(Math.min(5, b + 0.5));
          if (event.key === "ArrowDown") onIntercept(Math.max(-5, b - 0.5));
        }}
      />
      <circle
        cx={px(slopeX)}
        cy={py(slopeY)}
        r="13"
        className="handle slope"
        role="slider"
        tabIndex={0}
        aria-label="Drag linear slope point"
        aria-valuemin={-4}
        aria-valuemax={4}
        aria-valuenow={m}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDrag("slope");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") onSlope(Math.min(4, m + 0.25));
          if (event.key === "ArrowDown") onSlope(Math.max(-4, m - 0.25));
        }}
      />
      <g className="rise-run">
        <text x={px(1)} y={py(b) + 34}>
          run
        </text>
        <text x={px(1)} y={py(b) + 56}>
          {clean(slopeX)}
        </text>
        <text x={px(slopeX) + 28} y={(py(b) + py(slopeY)) / 2}>
          rise
        </text>
        <text x={px(slopeX) + 28} y={(py(b) + py(slopeY)) / 2 + 23}>
          {m >= 0 ? "+" : "−"}
          {clean(Math.abs(m * slopeX))}
        </text>
      </g>
    </svg>
  );
}

export default function LinearFunctionsTargetLesson133({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m, setM] = useState(1.5),
    [b, setB] = useState(1),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)"),
    [actions, setActions] = useState(0),
    [shared, setShared] = useState(false),
    [workspace, setWorkspace] = useState(false),
    [fullscreen, setFullscreen] = useState(false);
  const rise = m * 2,
    samples = [-2, 0, 2].map((x) => [x, m * x + b]);
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setM(1.5);
    setB(1);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setActions(0);
    setShared(false);
    setWorkspace(false);
    setFullscreen(false);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const changeM = (value: number) => {
      setM(value);
      act();
    },
    changeB = (value: number) => {
      setB(value);
      act();
    };
  return (
    <div
      className={`lin133-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="graph-mockup-0190"
      data-dedicated-lesson="133"
      data-object-model="editable-linear-slope-intercept-linked-hero-and-cartesian-graphs-pointer-keyboard-draggable-intercept-and-slope-point-generated-rise-run-triangle-equal-step-table-rate-proof-practice-model"
      data-slope={m}
      data-intercept={b}
      data-formula={formula(m, b)}
      data-rise={rise}
      data-samples={samples
        .map(([x, y]) => `${clean(x)},${clean(y)}`)
        .join(";")}
      data-actions={actions}
      data-direct-interaction="true"
    >
      <nav className="lin133-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/graphs-and-functions">Graphs And Functions</a>
        <span>&gt;</span>
        <b>133 Linear Functions</b>
      </nav>
      <header className="lin133-intro">
        <div>
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>FUNCTIONS</b>
          </small>
          <h1>Linear Functions</h1>
          <p>Explore slope and intercept.</p>
          <nav>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Graph Explorer</b>
            <b>▣ Graphing Calculator</b>
            <b>◷ 6-10 min</b>
          </nav>
          <section>
            <label>
              <Languages />
              <select
                aria-label="Linear functions language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  act();
                }}
              >
                <option>English (English)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
              <ChevronDown />
            </label>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => {
                setShared(true);
                act();
              }}
            >
              <Share2 />
              {shared ? "Link ready" : "Share"}
            </button>
            <button
              onClick={() => {
                setWorkspace((value) => !value);
                act();
              }}
            >
              ↗ {workspace ? "Close workspace" : "Workspace"}
            </button>
          </section>
        </div>
        <aside>
          <MiniLine m={m} b={b} />
          <strong>{formula(m, b)}</strong>
        </aside>
      </header>
      <nav className="lin133-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              if (name === "Examples") {
                setM(-2);
                setB(3);
              }
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="lin133-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Slope–Intercept Explorer</h2>
            <p>Explore how slope and intercept determine a line.</p>
          </div>
          <nav>
            <b>
              <i />
              Ready
            </b>
            <span>{actions} actions</span>
            <button
              aria-label="Expand slope intercept explorer"
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
            </button>
          </nav>
        </header>
        <div className="lin133-layout">
          <main>
            <h3>
              Rule: <em>{formula(m, b)}</em>
            </h3>
            <LinearGraph m={m} b={b} onIntercept={changeB} onSlope={changeM} />
            <article>
              <p>
                <Check />
                <b>Equal x-steps</b>
                <span>from −2 → 0 → 2</span>
              </p>
              <p>
                <Check />
                <b>Equal y-changes</b>
                <span>
                  {rise >= 0 ? "+" : "−"}
                  {clean(Math.abs(rise))} each time
                </span>
              </p>
            </article>
          </main>
          <aside>
          <section className="lin133-controls">
              <h3>Adjust line</h3>
              <label>
                Slope (m)
                <input
                  aria-label="Linear slope"
                  type="range"
                  min="-5"
                  max="5"
                  step=".25"
                  value={m}
                  onChange={(event) => changeM(Number(event.target.value))}
                />
                <output>{clean(m)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
              <label>
                Intercept (b)
                <input
                  aria-label="Linear intercept"
                  type="range"
                  min="-5"
                  max="5"
                  step=".5"
                  value={b}
                  onChange={(event) => changeB(Number(event.target.value))}
                />
                <output>{clean(b)}</output>
                <small>
                  <span>-5</span>
                  <span>5</span>
                </small>
              </label>
            </section>
          <section className="lin133-values">
              <h3>Key values</h3>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>{formula(m, b)}</th>
                    <th>(x, y)</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map(([x, y]) => (
                    <tr key={x}>
                      <td>{clean(x)}</td>
                      <td>{clean(y)}</td>
                      <td>
                        ({clean(x)}, {clean(y)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <article>
                From x = 0 to x = 2<br />
                <br />
                Δx = 2　　　 Δy = {rise >= 0 ? "+" : "−"}
                {clean(Math.abs(rise))}
                <br />
                <br />
                Slope = Δy / Δx = {clean(rise)} / 2 = {clean(m)}
              </article>
            </section>
          </aside>
        </div>
        <section className="lin133-understand">
          <h3>Understand the line</h3>
          <div>
            <article>
              <Target />
              <b>1. Start at intercept</b>
              <p>The line crosses the y-axis at (0, {clean(b)}).</p>
            </article>
            <article>
              <TrendingUp />
              <b>2. Move by slope</b>
              <p>
                Slope {clean(m)} means rise {clean(rise)} for every run 2 to the
                right.
              </p>
            </article>
            <article>
              <Scale />
              <b>3. Equal x-steps, equal y-changes</b>
              <p>From −2 to 0 to 2, y changes by {clean(rise)} each time.</p>
            </article>
            <article>
              <TrendingUp />
              <b>4. Line means constant rate</b>
              <p>The line shows a constant rate of change everywhere.</p>
            </article>
          </div>
        </section>
        <section className="lin133-lower">
        <article className="lin133-warning">
            <TriangleAlert />
            <div>
              <h3>SLOPE_AS_POINT</h3>
              <strong>Slope is a rate of change, not a point.</strong>
              <p>
                Slope tells you how steep the line is.
                <br />
                It is not a location on the graph.
              </p>
            </div>
            <aside>
              <i>rise</i>
              <b>run</b>
            </aside>
          </article>
        <article className="lin133-practice">
            <div>
              <h3>Try it yourself</h3>
              <p>For the line y = −2x + 3:</p>
              <p>
                <Check />
                Intercept is 3 (point (0, 3))
              </p>
              <p>
                <Check />
                Slope is −2
              </p>
              <p>
                <Check />
                From x = 0 to x = 1, y changes from 3 to 1.
              </p>
            </div>
            <svg
              viewBox="0 0 150 120"
              aria-label="Practice line y equals negative 2x plus 3"
            >
              <line x1="15" x2="140" y1="90" y2="90" />
              <line x1="75" x2="75" y1="110" y2="8" />
              <line
                x1="30"
                x2="120"
                y1="0"
                y2="120"
                className="practice-line"
              />
              <circle cx="75" cy="45" r="5" />
              <circle cx="98" cy="75" r="5" />
              <text x="82" y="40">
                (0, 3)
              </text>
              <text x="104" y="70">
                (1, 1)
              </text>
            </svg>
          </article>
        </section>
      </section>
      <nav className="lin133-adjacent">
        <a href="/lessons/graphs-and-functions/132-vertical-line-test">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Vertical-Line Test
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/134-quadratic-functions">
          <span>
            <small>NEXT</small>Quadratic Functions
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="lin133-footer">
        <b>
          <Sparkles />
          Math Universe
        </b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com · info@IndianServers.com</small>
      </footer>
    </div>
  );
}
