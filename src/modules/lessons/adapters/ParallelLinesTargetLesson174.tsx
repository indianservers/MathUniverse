import {
  ArrowLeft,
  ArrowRight,
  Eye,
  MousePointer2,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ParallelLinesTargetLesson174.css";
type Line = { m: number; b: number };
const initial1 = { m: 2, b: 2 },
  initial2 = { m: 2, b: -2 };
const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 0.005 ? String(Math.round(v)) : v.toFixed(2);
function ParallelGraph({
  l1,
  l2,
  angles,
  onLine,
}: {
  l1: Line;
  l2: Line;
  angles: boolean;
  onLine: (id: 1 | 2, line: Line) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<1 | 2 | null>(null),
    W = 500,
    H = 500,
    u = 30,
    ox = 250,
    oy = 250,
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u;
  const update = (id: 1 | 2, e: PointerEvent<SVGSVGElement>) => {
    const box = ref.current!.getBoundingClientRect(),
      x = (((e.clientX - box.left) / box.width) * W - ox) / u,
      y = (oy - ((e.clientY - box.top) / box.height) * H) / u,
      source = id === 1 ? l1 : l2;
    if (Math.abs(x) > 0.3) onLine(id, { m: (y - source.b) / x, b: source.b });
  };
  const key = (id: 1 | 2, e: KeyboardEvent<SVGCircleElement>) => {
    const source = id === 1 ? l1 : l2;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onLine(id, { ...source, m: source.m + 0.25 });
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onLine(id, { ...source, m: source.m - 0.25 });
    }
  };
  const angle = (Math.atan(l1.m) * 180) / Math.PI;
  return (
    <svg
      ref={ref}
      className="pl174-graph"
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => {
        if (drag.current) update(drag.current, e);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <defs>
        <pattern
          id="pl174-grid"
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dfe7ef" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#pl174-grid)" />
      <line x1="0" x2={W} y1={oy} y2={oy} className="axis" />
      <line x1={ox} x2={ox} y1="0" y2={H} className="axis" />
      {[
        [l1, 1, "#167af0"],
        [l2, 2, "#6f2de2"],
      ].map(([line, id, color]) => {
        const l = line as Line,
          n = id as 1 | 2;
        return (
          <g key={n}>
            <line
              x1={sx(-8)}
              y1={sy(-8 * l.m + l.b)}
              x2={sx(8)}
              y2={sy(8 * l.m + l.b)}
              stroke={color as string}
              className="line"
            />
            <circle
              data-testid={`parallel-line-${n}`}
              role="slider"
              tabIndex={0}
              aria-label={`Drag line ${n}`}
              cx={sx(2)}
              cy={sy(2 * l.m + l.b)}
              r="7"
              fill={color as string}
              onPointerDown={(e) => {
                e.stopPropagation();
                drag.current = n;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onKeyDown={(e) => key(n, e)}
            />
            <text x={sx(5)} y={sy(5 * l.m + l.b) - 8} fill={color as string}>
              ℓ{n}
            </text>
          </g>
        );
      })}
      {angles ? (
        <>
          <path d={`M${ox} ${sy(l1.b)}a24 24 0 0 0 18 -20`} className="angle" />
          <path d={`M${ox} ${sy(l2.b)}a24 24 0 0 0 18 -20`} className="angle" />
          <text x={ox + 23} y={sy(l1.b) - 10}>
            {angle.toFixed(2)}°
          </text>
          <text x={ox + 23} y={sy(l2.b) - 10}>
            {angle.toFixed(2)}°
          </text>
        </>
      ) : null}
    </svg>
  );
}
export default function ParallelLinesTargetLesson174({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [l1, setL1] = useState(initial1),
    [l2, setL2] = useState(initial2),
    [angles, setAngles] = useState(true),
    [tab, setTab] = useState(0),
    [answer, setAnswer] = useState({ m: "", b: "" }),
    [status, setStatus] = useState(""),
    [construct, setConstruct] = useState(false);
  const parallel = Math.abs(l1.m - l2.m) < 0.001,
    distance = parallel
      ? Math.abs(l2.b - l1.b) / Math.sqrt(l1.m * l1.m + 1)
      : null;
  const update = (id: 1 | 2, line: Line) => {
    (id === 1 ? setL1 : setL2)(line);
    onInteraction();
  };
  const reset = () => {
    setL1(initial1);
    setL2(initial2);
    setAngles(true);
    setTab(0);
    setAnswer({ m: "", b: "" });
    setStatus("");
    setConstruct(false);
    onInteraction();
  };
  useEffect(() => {
    setL1(initial1);
    setL2(initial2);
    setAngles(true);
    setTab(0);
    setAnswer({ m: "", b: "" });
    setStatus("");
    setConstruct(false);
  }, [resetToken]);
  return (
    <main
      className="pl174-page"
      data-testid="geometry-mockup-0231"
      data-dedicated-lesson="174"
      data-object-model="two-independent-pointer-keyboard-draggable-lines-equal-slope-parallel-invariant-corresponding-angles-distance-construction-and-graded-equation-practice"
      data-m1={l1.m.toFixed(2)}
      data-b1={l1.b.toFixed(2)}
      data-m2={l2.m.toFixed(2)}
      data-b2={l2.b.toFixed(2)}
      data-parallel={parallel}
      data-angles={angles}
      data-tab={tab}
      data-construct={construct}
      data-status={status}
    >
      <header className="pl174-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Parallel Lines</h1>
        <p>Two lines with the same slope never meet.</p>
        <aside>
          <b>
            Level<small>Intermediate</small>
          </b>
          <b>
            Activity type<small>Construct & explore</small>
          </b>
          <b>
            Est. time<small>6-10 min</small>
          </b>
        </aside>
        <nav>
          {["Explore", "Try It", "Observe", "Rule", "Practice"].map((x, i) => (
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
      </header>
      <section className="pl174-observe">
        <header>
          <i>1</i>
          <div>
            <h2>Observe & Manipulate</h2>
            <p>Adjust the lines. Keep the slopes equal and see what happens.</p>
          </div>
        </header>
        <div className="pl174-work">
          <article>
            <div className="pl174-toolbar">
              <button className="active">
                <MousePointer2 />
              </button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
              <button
                onClick={() => {
                  setAngles((v) => !v);
                  onInteraction();
                }}
              >
                <Eye />
                Show angles
              </button>
            </div>
            <ParallelGraph l1={l1} l2={l2} angles={angles} onLine={update} />
          </article>
          <aside>
            <h3>Line controls</h3>
            {[
              [1, l1, setL1, "#167af0"],
              [2, l2, setL2, "#6f2de2"],
            ].map(([id, line, setter, color]) => (
              <section key={id as number}>
                <b style={{ color: color as string }}>● Line ℓ{id as number}</b>
                {(["m", "b"] as const).map((k) => (
                  <label key={k}>
                    {k === "m" ? "Slope" : "Y-intercept"} {k}
                    <input
                      aria-label={`Line ${id as number} ${k}`}
                      type="range"
                      min="-6"
                      max="6"
                      step=".25"
                      value={(line as Line)[k]}
                      onChange={(e) => {
                        (setter as (v: Line) => void)({
                          ...(line as Line),
                          [k]: Number(e.target.value),
                        });
                        onInteraction();
                      }}
                    />
                    <input
                      aria-label={`Line ${id as number} ${k} value`}
                      type="number"
                      value={(line as Line)[k]}
                      onChange={(e) => {
                        (setter as (v: Line) => void)({
                          ...(line as Line),
                          [k]: Number(e.target.value),
                        });
                        onInteraction();
                      }}
                    />
                  </label>
                ))}
                <output>
                  ℓ{id as number}: y = {fmt((line as Line).m)}x +{" "}
                  {fmt((line as Line).b)}
                </output>
              </section>
            ))}
            <footer className={parallel ? "correct" : ""}>
              <b>{parallel ? "✓ Slopes are equal" : "Slopes differ"}</b>
              <p>
                {parallel
                  ? `m₁ = m₂ = ${fmt(l1.m)}. The lines are parallel.`
                  : "Set equal slopes to make the lines parallel."}
              </p>
            </footer>
          </aside>
        </div>
        <section className="pl174-observations">
          <h2>What do you observe?</h2>
          <div>
            <b>The lines never meet.</b>
            <p>No matter how you move the intercepts, they stay apart.</p>
          </div>
          <div>
            <b>Equal corresponding angles.</b>
            <p>All matching angles are equal.</p>
          </div>
          <div>
            <b>Constant distance.</b>
            <p>
              {distance === null
                ? "Requires equal slopes."
                : `Perpendicular distance = ${distance.toFixed(2)}.`}
            </p>
          </div>
        </section>
      </section>
      <section className="pl174-cards">
        <article>
          <h2>
            <i>2</i> Construct a Parallel
          </h2>
          <p>Make a line parallel to ℓ₁ through a given point.</p>
          <strong>Point P (1,-3)</strong>
          <ol>
            <li>Match the slope m=2.</li>
            <li>Set intercept b=-5.</li>
            <li>Check the new line.</li>
          </ol>
          <output>y = 2x - 5</output>
          <button
            onClick={() => {
              setL2({ m: l1.m, b: -3 - l1.m });
              setConstruct(true);
              onInteraction();
            }}
          >
            <Eye />
            Check on graph
          </button>
        </article>
        <article>
          <h2>
            <i>3</i> Why is this true?
          </h2>
          <p>Parallel lines have the same slope.</p>
          <strong>
            ℓ₁: y=mx+b₁
            <br />
            ℓ₂: y=mx+b₂
            <br />
            and b₁ ≠ b₂
          </strong>
          <output>then ℓ₁ ∥ ℓ₂</output>
          <p>
            Equal slopes → equal corresponding angles → lines never intersect.
          </p>
        </article>
        <article>
          <h2>
            <i>4</i> Worked example
          </h2>
          <p>Find the line parallel to y=2x+3 that passes through (-2,5).</p>
          <ol>
            <li>Same slope m=2</li>
            <li>Use point-slope form</li>
            <li>Simplify</li>
          </ol>
          <output>y = 2x + 9</output>
        </article>
      </section>
      <section className="pl174-practice">
        <header>
          <h2>
            <i>5</i> Practice
          </h2>
          <p>
            Make the given line parallel to y=-3x+1 and pass through the point
            (4,-6).
          </p>
          <button
            onClick={() => {
              const ok =
                Math.abs(Number(answer.m) + 3) < 0.001 &&
                Math.abs(Number(answer.b) - 6) < 0.001;
              setStatus(
                ok
                  ? "Correct parallel equation"
                  : "Enter a valid equation and click Check",
              );
              onInteraction();
            }}
          >
            Check
          </button>
        </header>
        <div>
          <section>
            <b>Target line</b>
            <output>y = -3x + 1</output>
          </section>
          <section>
            <b>Point</b>
            <output>(4,-6)</output>
          </section>
          <section>
            <b>Your equation</b>
            <label>
              y ={" "}
              <input
                aria-label="Practice parallel slope"
                value={answer.m}
                onChange={(e) => setAnswer({ ...answer, m: e.target.value })}
              />
              x +{" "}
              <input
                aria-label="Practice parallel intercept"
                value={answer.b}
                onChange={(e) => setAnswer({ ...answer, b: e.target.value })}
              />
            </label>
          </section>
          <section className={status.startsWith("Correct") ? "correct" : ""}>
            <b>Result</b>
            <output>
              {status || "Enter a valid equation and click Check."}
            </output>
          </section>
        </div>
      </section>
      <nav className="pl174-nav">
        <a href="/lessons/geometry/173-equation-of-a-line">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Equation of a Line</b>
          </span>
        </a>
        <a href="/lessons/geometry/175-perpendicular-lines">
          <span>
            <small>Next</small>
            <b>Perpendicular Lines</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
    </main>
  );
}
