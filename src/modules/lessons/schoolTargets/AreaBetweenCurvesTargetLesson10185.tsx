import { CheckCircle2, Pause, Play, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AreaBetweenCurvesTargetLesson10185.css";

const fmt = (v: number) => Number(v.toFixed(2));
export default function AreaBetweenCurvesTargetLesson10185({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [x, setX] = useState(1.2),
    [playing, setPlaying] = useState(false),
    [order, setOrder] = useState<"top" | "bottom">("top"),
    [mode, setMode] = useState<"vertical" | "horizontal">("vertical"),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [solution, setSolution] = useState(false);
  const upper = 2 * x,
    lower = x * x,
    height = upper - lower,
    area = 4 / 3;
  const change = (v: number) =>
    setX(Math.max(0.05, Math.min(1.95, Math.round(v * 20) / 20)));
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") change(x - 0.05);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") change(x + 0.05);
  };
  const drag = (e: ReactPointerEvent<SVGLineElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      change(((p.clientX - r.left) / r.width) * 2.4 - 0.2);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () =>
        setX((v) => {
          const next = v >= 1.9 ? 0.1 : fmt(v + 0.1);
          return next;
        }),
      220,
    );
    return () => clearInterval(id);
  }, [playing]);
  const blue = useMemo(
      () =>
        Array.from({ length: 101 }, (_, i) => {
          const t = i / 50;
          return `${35 + t * 235},${265 - 2 * t * 52}`;
        }).join(" "),
      [],
    ),
    red = useMemo(
      () =>
        Array.from({ length: 101 }, (_, i) => {
          const t = i / 50;
          return `${35 + t * 235},${265 - t * t * 52}`;
        }).join(" "),
      [],
    );
  const sx = 35 + x * 235,
    syTop = 265 - upper * 52,
    syBottom = 265 - lower * 52;
  const reset = () => {
    setX(1.2);
    setPlaying(false);
    setOrder("top");
    setMode("vertical");
  };
  const check = () =>
    setFeedback(
      answer.replace(/\s/g, "") === "4/3" ||
        Math.abs(Number(answer) - area) < 0.002
        ? "Correct: the enclosed area is 4/3 square units."
        : "Integrate top minus bottom: ∫₀²(2x−x²)dx.",
    );
  return (
    <main
      className="abc10185-page"
      data-testid="school-mockup-0859"
      data-object-model="dedicated-between-curves-slice-engine"
      data-x={fmt(x)}
      data-upper={fmt(upper)}
      data-lower={fmt(lower)}
      data-height={fmt(height)}
      data-order={order}
      data-mode={mode}
      data-area={fmt(area)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Area Between Curves</h1>
        <p>Vertical slices between y=2x and y=x² on [0,2].</p>
        <div>
          <span>16 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>visual</span>
          <span>calculus</span>
        </div>
      </header>
      <section className="abc-explore">
        <div className="abc-main">
          <div>
            <h3>1 &nbsp; EXPLORE: VERTICAL SLICE VISUALISER</h3>
            <p>Drag the blue slice or use the slider.</p>
            <div className="abc-graph">
              <svg viewBox="0 0 300 300" aria-label="Area between curves graph">
                <path d="M20 265H290M35 15V285" stroke="#3b4e62" />
                <defs>
                  <linearGradient id="abc-fill">
                    <stop stopColor="#9acaf5" />
                    <stop offset="1" stopColor="#d8ecff" />
                  </linearGradient>
                </defs>
                <path
                  d="M35 265 C95 215 160 170 270 57 L270 57 C160 225 95 255 35 265Z"
                  fill="url(#abc-fill)"
                />
                <polyline
                  points={blue}
                  fill="none"
                  stroke="#0879ed"
                  strokeWidth="2.5"
                />
                <polyline
                  points={red}
                  fill="none"
                  stroke="#ef2638"
                  strokeWidth="2.5"
                />
                <line
                  tabIndex={0}
                  aria-label="Draggable vertical slice"
                  x1={sx}
                  x2={sx}
                  y1={syTop}
                  y2={syBottom}
                  stroke="#0879ed"
                  strokeWidth="4"
                  onPointerDown={drag}
                />
                <circle cx={sx} cy={syTop} r="4" fill="#0879ed" />
                <circle cx={sx} cy={syBottom} r="4" fill="#ef2638" />
                <text x={sx - 18} y="32">
                  x={x.toFixed(2)}
                </text>
                <text x="205" y="76">
                  y=2x
                </text>
                <text x="205" y="190">
                  y=x²
                </text>
              </svg>
              <aside>
                <b>SLICE DETAILS ({mode})</b>
                <p>x={x.toFixed(2)}</p>
                <p>Upper: y=2x={upper.toFixed(2)}</p>
                <p>Lower: y=x²={lower.toFixed(2)}</p>
                <p>Height: 2x−x²={height.toFixed(2)}</p>
                <p>Area of slice ≈ {height.toFixed(2)} dx</p>
              </aside>
            </div>
            <div className="abc-slider">
              <b>Move slice:</b>
              <input
                aria-label="Slice position"
                type="range"
                min=".05"
                max="1.95"
                step=".05"
                value={x}
                onChange={(e) => change(Number(e.target.value))}
                onKeyDown={key}
              />
              <output>{x.toFixed(2)}</output>
              <button onClick={() => setPlaying((v) => !v)}>
                {playing ? <Pause /> : <Play />}
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </div>
          </div>
          <aside>
            <section>
              <h3>TOP MINUS BOTTOM</h3>
              <p>Choose the correct order.</p>
              <button
                className={order === "top" ? "active" : ""}
                onClick={() => setOrder("top")}
              >
                <CheckCircle2 /> (Top)−(Bottom): 2x−x²
              </button>
              <button
                className={order === "bottom" ? "wrong" : ""}
                onClick={() => setOrder("bottom")}
              >
                <XCircle /> (Bottom)−(Top): x²−2x
              </button>
              {order === "bottom" && (
                <div>
                  Incorrect order: area would be negative. Use Top−Bottom.
                </div>
              )}
            </section>
            <section>
              <h3>OTHER SLICE MODE</h3>
              <p>Horizontal slices (preview)</p>
              <svg viewBox="0 0 180 130">
                <path d="M12 112H170M24 10V122" stroke="#485a6c" />
                <path d="M24 112 Q75 20 155 18" fill="none" stroke="#0879ed" />
                <path d="M24 112 Q95 100 155 18" fill="none" stroke="#ef2638" />
                <line
                  x1="70"
                  x2="115"
                  y1="62"
                  y2="62"
                  stroke="#08915a"
                  strokeWidth="4"
                />
              </svg>
              <button
                onClick={() =>
                  setMode((v) => (v === "vertical" ? "horizontal" : "vertical"))
                }
              >
                Switch to {mode === "vertical" ? "horizontal" : "vertical"} mode
              </button>
            </section>
          </aside>
        </div>
      </section>
      <section className="abc-solve">
        <h3>2 &nbsp; SOLVE: FOLLOW THE STEPS</h3>
        <div>
          <article>
            <b>Step 1: Find intersections</b>
            <p>2x=x² ⇒ x(x−2)=0</p>
            <h2>x=0, x=2</h2>
            <p>Points: (0,0) and (2,4)</p>
          </article>
          <article>
            <b>Step 2: Identify upper and lower</b>
            <p>For 0&lt;x&lt;2, 2x&gt;x².</p>
            <h2>Top−Bottom=2x−x²</h2>
          </article>
          <article>
            <b>Step 3: Integrate</b>
            <h2>∫₀²(2x−x²)dx=[x²−x³/3]₀²=4/3</h2>
            <strong>
              4/3 square units <CheckCircle2 />
            </strong>
          </article>
        </div>
      </section>
      <section className="abc-warning">
        <div>
          <h3>IMPORTANT: CURVES MAY SWITCH ORDER</h3>
          <p>
            If curves switch places, split the interval at intersection points
            and integrate piecewise.
          </p>
        </div>
        <svg viewBox="0 0 230 100">
          <path d="M15 80H220M30 10V90" stroke="#3f5060" />
          <path d="M30 70 Q90 0 135 50 T215 25" fill="none" stroke="#0879ed" />
          <path
            d="M30 75 Q100 65 135 45 T215 20"
            fill="none"
            stroke="#ef2638"
          />
        </svg>
        <aside>
          <b>Always check which curve is on top</b>
          <p>Sketch, test a point, and switch if needed.</p>
        </aside>
      </section>
      <section className="abc-lower">
        <article>
          <h3>4 &nbsp; WORKED EXAMPLE</h3>
          <p>Find the area between y=2x and y=x² on [0,2].</p>
          <ol>
            <li>Intersections: (0,0), (2,4)</li>
            <li>2x is above x².</li>
            <li>Area=∫₀²(2x−x²)dx=4/3.</li>
          </ol>
          <strong>Answer: 4/3 square units ✓</strong>
        </article>
        <article>
          <h3>5 &nbsp; PRACTICE CHALLENGE</h3>
          <label>
            Your answer
            <input
              aria-label="Area answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
          <button onClick={check}>Check Answer</button>
          <button onClick={() => setSolution((v) => !v)}>
            {solution ? "Hide solution" : "Show solution"}
          </button>
          {feedback && <output>{feedback}</output>}
          {solution && <p>∫₀²(2x−x²)dx=[x²−x³/3]₀²=4/3.</p>}
        </article>
        <article>
          <h3>Quick sketch</h3>
          <svg viewBox="0 0 210 145">
            <path d="M15 125H195M25 10V135" stroke="#3f5060" />
            <path d="M25 125 Q80 35 185 22" fill="none" stroke="#0879ed" />
            <path d="M25 125 Q115 120 185 22" fill="none" stroke="#ef2638" />
          </svg>
        </article>
      </section>
      <section className="abc-summary">
        <article>
          <b>KEY FORMULA</b>
          <p>Area=∫ₐᵇ[top−bottom]dx</p>
        </article>
        <article>
          <b>WHEN TO SPLIT</b>
          <p>Split where f(x)=g(x).</p>
        </article>
        <article>
          <b>CHECKLIST</b>
          <p>Find intersections, determine top, integrate.</p>
        </article>
        <article>
          <b>RESULT SUMMARY</b>
          <p>Area=4/3 square units.</p>
        </article>
      </section>
      <nav className="abc-adjacent">
        <Link to="/lessons/school/class-12/class-12-formal-calculus-area-under-a-curve">
          ← Area Under a Curve
        </Link>
        <Link to="/lessons/school/class-12/class-12-formal-calculus-differential-equations-order-degree">
          Differential Equations →
        </Link>
      </nav>
      <aside className="abc-finish">
        <CheckCircle2 /> Great! You explored {mode} slicing, verified the
        integral, and saw why order matters. Keep practising to master Area
        Between Curves.
      </aside>
    </main>
  );
}
