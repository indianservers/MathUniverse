import {
  ArrowLeft,
  ArrowRight,
  Expand,
  Grid3X3,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./AngleBetweenLinesTargetLesson176.css";
type LineId = 1 | 2;
const angleFor = (m1: number, m2: number) => {
  const denominator = 1 + m1 * m2;
  if (Math.abs(denominator) < 0.0001) return 90;
  return (Math.atan(Math.abs((m1 - m2) / denominator)) * 180) / Math.PI;
};
const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 0.005 ? String(Math.round(v)) : v.toFixed(2);
function AngleGraph({
  m1,
  m2,
  axes,
  grid,
  onSlope,
  practice = false,
}: {
  m1: number;
  m2: number;
  axes: boolean;
  grid: boolean;
  onSlope?: (id: LineId, m: number) => void;
  practice?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<LineId | null>(null),
    W = practice ? 330 : 500,
    H = practice ? 180 : 360,
    u = 22,
    ox = W / 2,
    oy = H / 2,
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u,
    theta = angleFor(m1, m2);
  const move = (id: LineId, e: PointerEvent<SVGSVGElement>) => {
    const box = ref.current!.getBoundingClientRect(),
      x = (((e.clientX - box.left) / box.width) * W - ox) / u,
      y = (oy - ((e.clientY - box.top) / box.height) * H) / u;
    if (Math.abs(x) > 0.2) onSlope?.(id, Math.max(-10, Math.min(10, y / x)));
  };
  const key = (id: LineId, m: number, e: KeyboardEvent<SVGCircleElement>) => {
    if (!onSlope) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onSlope(id, Math.min(10, m + 0.1));
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onSlope(id, Math.max(-10, m - 0.1));
    }
  };
  return (
    <svg
      ref={ref}
      className={`abl176-graph${practice ? " practice" : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => {
        if (drag.current) move(drag.current, e);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <defs>
        <pattern
          id={practice ? "abl176-pgrid" : "abl176-grid"}
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dfe7ef" />
        </pattern>
      </defs>
      <rect
        width={W}
        height={H}
        fill={
          grid ? `url(#${practice ? "abl176-pgrid" : "abl176-grid"})` : "#fff"
        }
      />
      {axes ? (
        <>
          <line x1="0" x2={W} y1={oy} y2={oy} className="axis" />
          <line x1={ox} x2={ox} y1="0" y2={H} className="axis" />
        </>
      ) : null}
      {[
        [1, m1, "#167ae9"],
        [2, m2, "#7845e2"],
      ].map(([id, m, color]) => {
        const n = id as LineId,
          s = m as number,
          x = practice ? 3.5 : 5.5;
        return (
          <g key={n}>
            <line
              x1={sx(-10)}
              y1={sy(-10 * s)}
              x2={sx(10)}
              y2={sy(10 * s)}
              stroke={color as string}
              className="line"
            />
            <circle
              data-testid={`${practice ? "practice-" : ""}angle-line-${n}`}
              role="slider"
              tabIndex={0}
              aria-label={`Drag ${practice ? "practice " : ""}line ${n}`}
              cx={sx(x)}
              cy={sy(x * s)}
              r="7"
              fill={color as string}
              onPointerDown={(e) => {
                e.stopPropagation();
                drag.current = n;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onKeyDown={(e) => key(n, s, e)}
            />
          </g>
        );
      })}
      <path
        d={`M${ox + 38} ${oy - Math.tan(Math.atan(m2)) * 38}A42 42 0 0 0 ${ox + 38} ${oy - Math.tan(Math.atan(m1)) * 38}`}
        className="angle"
      />
      <text x={ox + 48} y={oy - 25} className="angle-label">
        {theta.toFixed(1)}°
      </text>
    </svg>
  );
}
export default function AngleBetweenLinesTargetLesson176({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m1, setM1] = useState(1.43),
    [m2, setM2] = useState(0.5),
    [axes, setAxes] = useState(true),
    [grid, setGrid] = useState(true),
    [expanded, setExpanded] = useState(false),
    [tab, setTab] = useState(0),
    [answer, setAnswer] = useState(""),
    [practiceStatus, setPracticeStatus] = useState(""),
    [showAnswer, setShowAnswer] = useState(false);
  const theta = angleFor(m1, m2),
    difference = m1 - m2,
    product = m1 * m2,
    classification =
      theta < 0.01
        ? "Parallel"
        : Math.abs(theta - 90) < 0.01
          ? "Right"
          : "Acute";
  const update = (id: LineId, m: number) => {
    (id === 1 ? setM1 : setM2)(m);
    onInteraction();
  };
  const reset = () => {
    setM1(1.43);
    setM2(0.5);
    setAxes(true);
    setGrid(true);
    setExpanded(false);
    setTab(0);
    setAnswer("");
    setPracticeStatus("");
    setShowAnswer(false);
    onInteraction();
  };
  useEffect(() => {
    setM1(1.43);
    setM2(0.5);
    setAxes(true);
    setGrid(true);
    setExpanded(false);
    setTab(0);
    setAnswer("");
    setPracticeStatus("");
    setShowAnswer(false);
  }, [resetToken]);
  return (
    <main
      className={`abl176-page${expanded ? " expanded" : ""}`}
      data-testid="geometry-mockup-0233"
      data-dedicated-lesson="176"
      data-direct-interaction="true"
      data-object-model="two-slope-pointer-keyboard-draggable-lines-correct-tangent-angle-formula-classification-axes-grid-expand-and-graded-perpendicular-practice"
      data-m1={m1.toFixed(2)}
      data-m2={m2.toFixed(2)}
      data-angle={theta.toFixed(2)}
      data-classification={classification}
      data-axes={axes}
      data-grid={grid}
      data-expanded={expanded}
      data-tab={tab}
      data-practice-status={practiceStatus}
    >
      <header className="abl176-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Angle Between Lines</h1>
        <p>
          Measure the angle between two lines using slopes, rotation, and the
          tan formula.
        </p>
        <aside>
          <b>
            Level<small>Intermediate</small>
          </b>
          <b>
            Tool<small>Construction Lab</small>
          </b>
          <b>
            Time<small>6-10 min</small>
          </b>
          <b>
            Focus<small>Concept + Practice</small>
          </b>
        </aside>
      </header>
      <nav className="abl176-tabs">
        {[
          "Explore",
          "Notice the pattern",
          "Understand the rule",
          "Try yourself",
          "Summary",
        ].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => {
              setTab(i);
              onInteraction();
            }}
          >
            {x}
          </button>
        ))}
      </nav>
      <section className="abl176-main">
        <article>
          <header>
            <h2>Manipulate the lines</h2>
            <div>
              <button
                aria-pressed={axes}
                onClick={() => {
                  setAxes((v) => !v);
                  onInteraction();
                }}
              >
                Axes
              </button>
              <button
                aria-pressed={grid}
                onClick={() => {
                  setGrid((v) => !v);
                  onInteraction();
                }}
              >
                <Grid3X3 />
                Grid
              </button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
              <button
                aria-label="Expand graph"
                onClick={() => {
                  setExpanded((v) => !v);
                  onInteraction();
                }}
              >
                <Expand />
              </button>
            </div>
          </header>
          <AngleGraph
            m1={m1}
            m2={m2}
            axes={axes}
            grid={grid}
            onSlope={update}
          />
          <p>Drag the blue or purple control points to rotate the lines.</p>
        </article>
        <aside>
          {[
            [1, m1, setM1, "blue"],
            [2, m2, setM2, "purple"],
          ].map(([id, m, setter, color]) => (
            <section key={id as number}>
              <h3>
                ● Line {id as number} ({color as string})
              </h3>
              <label>
                Slope m{id as number}
                <input
                  aria-label={`Angle line ${id as number} slope`}
                  type="range"
                  min="-10"
                  max="10"
                  step=".01"
                  value={m as number}
                  onChange={(e) => {
                    (setter as (v: number) => void)(Number(e.target.value));
                    onInteraction();
                  }}
                />
                <input
                  aria-label={`Angle line ${id as number} slope value`}
                  type="number"
                  step=".01"
                  value={m as number}
                  onChange={(e) => {
                    (setter as (v: number) => void)(Number(e.target.value));
                    onInteraction();
                  }}
                />
              </label>
              <p>Equation y = {fmt(m as number)}x + 0.00</p>
            </section>
          ))}
          <section>
            <h3>
              Angle between lines <b>{classification}</b>
            </h3>
            <output>θ = {theta.toFixed(2)}°</output>
            <span>0° ≤ θ ≤ 90°</span>
          </section>
        </aside>
      </section>
      <section className="abl176-info">
        <article>
          <h2>Live slope readout</h2>
          <p>
            ● m₁ (blue) <b>{m1.toFixed(2)}</b>
          </p>
          <p>
            ● m₂ (purple) <b>{m2.toFixed(2)}</b>
          </p>
          <p>
            Slope difference <b>{difference.toFixed(2)}</b>
          </p>
          <p>
            Product <b>{product.toFixed(2)}</b>
          </p>
        </article>
        <article>
          <h2>How the angle is computed</h2>
          <p>The angle between two non-parallel lines is</p>
          <output>tan θ = |(m₁-m₂)/(1+m₁m₂)|</output>
          <p>Substituting the values,</p>
          <strong>θ = {theta.toFixed(2)}°</strong>
        </article>
        <article>
          <h2>When is the angle...</h2>
          <p className={classification === "Acute" ? "active" : ""}>
            Acute 0°&lt;θ&lt;90°
          </p>
          <p className={classification === "Right" ? "active" : ""}>
            Right θ=90°
          </p>
          <p>Obtuse uses the supplementary angle.</p>
          <p className={classification === "Parallel" ? "active" : ""}>
            Parallel θ=0°
          </p>
        </article>
      </section>
      <section className="abl176-insight">
        <article>
          <h2>Construction steps</h2>
          <ol>
            <li>Rotate the blue line to set slope m₁.</li>
            <li>Rotate the purple line to set slope m₂.</li>
            <li>Observe the shaded acute angle.</li>
            <li>Use the slope formula to compute θ.</li>
          </ol>
        </article>
        <article>
          <h2>Key insight</h2>
          <p>
            The angle between two lines depends only on their slopes, not on
            their intercepts.
          </p>
          <p>Intercepts shift lines but keep the angle unchanged.</p>
        </article>
      </section>
      <section className="abl176-practice">
        <header>
          <h2>Try yourself</h2>
          <span>Solve without changing the lines.</span>
        </header>
        <AngleGraph practice m1={2} m2={-0.5} axes grid />
        <article>
          <p>
            Given the lines <b>y=2x+1</b> and <b>y=-1/2x+3</b>, find the angle
            between them.
          </p>
          <p>Slopes: m₁=2, m₂=-1/2</p>
          <label>
            Your angle{" "}
            <input
              aria-label="Practice angle answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="degrees"
            />
          </label>
          <button
            onClick={() => {
              setShowAnswer(true);
              onInteraction();
            }}
          >
            Show answer
          </button>
          <button
            onClick={() => {
              setPracticeStatus(
                Math.abs(Number(answer) - 90) < 0.01
                  ? "Correct angle"
                  : "Recheck the perpendicular slopes",
              );
              onInteraction();
            }}
          >
            Check mine
          </button>
          <button
            onClick={() => {
              setAnswer("");
              setPracticeStatus("");
              setShowAnswer(false);
              onInteraction();
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <output>{showAnswer ? "90°" : practiceStatus}</output>
        </article>
      </section>
      <nav className="abl176-nav">
        <a href="/lessons/geometry/175-perpendicular-lines">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Perpendicular Lines</b>
          </span>
        </a>
        <a href="/lessons/geometry/177-point-to-line-distance">
          <span>
            <small>Next</small>
            <b>Point-to-Line Distance</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="abl176-footer">
        <div>
          <b>⌁ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </div>
        <button onClick={() => onInteraction()}>
          <Share2 />
          Sitemap
        </button>
        <a href="#docs">Docs</a>
        <a href="#about">About</a>
      </footer>
    </main>
  );
}
