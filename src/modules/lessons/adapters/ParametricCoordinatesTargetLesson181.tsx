import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Pause,
  Play,
  RotateCcw,
  Share2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ParametricCoordinatesTargetLesson181.css";
const PI = Math.PI,
  fmt = (v: number) => (Math.abs(v) < 0.005 ? "0.00" : v.toFixed(2)),
  pointAt = (t: number) => ({ x: 2 + Math.cos(t), y: 1 + Math.sin(t) });
function MotionGraph({ t, onT }: { t: number; onT: (t: number) => void }) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    W = 560,
    H = 380,
    u = 42,
    ox = 250,
    oy = 210,
    p = pointAt(t),
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u;
  const from = (e: PointerEvent<SVGSVGElement>) => {
    const b = ref.current!.getBoundingClientRect(),
      x = (((e.clientX - b.left) / b.width) * W - ox) / u,
      y = (oy - ((e.clientY - b.top) / b.height) * H) / u;
    return Math.atan2(y - 1, x - 2);
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onT(t - 0.1);
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onT(t + 0.1);
    }
  };
  return (
    <svg
      ref={ref}
      className="pm181-main-graph"
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => drag.current && onT(from(e))}
      onPointerUp={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
    >
      <defs>
        <pattern
          id="pm181-grid"
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dfe8ef" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#pm181-grid)" />
      <line x1="0" x2={W} y1={oy} y2={oy} />
      <line x1={ox} x2={ox} y1="0" y2={H} />
      <ellipse cx={sx(2)} cy={sy(1)} rx={u} ry={u} className="pm181-path" />
      <path
        d={`M${sx(2)} ${sy(1)}A${u} ${u} 0 0 0 ${sx(2 + Math.cos(t))} ${sy(1 + Math.sin(t))}`}
        className="pm181-trace"
      />
      <circle
        data-testid="parametric-motion-point"
        role="slider"
        aria-label="Parametric point P"
        tabIndex={0}
        cx={sx(p.x)}
        cy={sy(p.y)}
        r="8"
        onPointerDown={(e) => {
          drag.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onKeyDown={key}
      />
      <text x={sx(p.x) + 12} y={sy(p.y) - 10}>
        P({fmt(p.x)}, {fmt(p.y)})
      </text>
      <text x={W - 16} y={oy - 9}>
        x
      </text>
      <text x={ox + 9} y="15">
        y
      </text>
    </svg>
  );
}
function FunctionGraph({ kind, t }: { kind: "x" | "y"; t: number }) {
  const W = 260,
    H = 135,
    ox = 130,
    oy = 70,
    sx = (v: number) => ox + (v / (2 * PI)) * 115,
    sy = (v: number) => oy - v * 26,
    path = Array.from({ length: 101 }, (_, i) => {
      const q = -2 * PI + (i * 4 * PI) / 100,
        v = kind === "x" ? 2 + Math.cos(q) : 1 + Math.sin(q);
      return `${i ? "L" : "M"}${sx(q)} ${sy(v - (kind === "x" ? 2 : 1))}`;
    }).join(" "),
    v = kind === "x" ? 2 + Math.cos(t) : 1 + Math.sin(t);
  return (
    <svg className={`pm181-mini ${kind}`} viewBox={`0 0 ${W} ${H}`}>
      <line x1="5" x2={W - 5} y1={oy} y2={oy} />
      <line x1={ox} x2={ox} y1="5" y2={H - 5} />
      <path d={path} />
      <circle cx={sx(t)} cy={sy(v - (kind === "x" ? 2 : 1))} r="5" />
      <text x="5" y={H - 8}>
        −2π
      </text>
      <text x={W - 28} y={H - 8}>
        2π
      </text>
    </svg>
  );
}
export default function ParametricCoordinatesTargetLesson181({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [t, setT] = useState(1),
    [playing, setPlaying] = useState(false),
    [animate, setAnimate] = useState(true),
    [speed, setSpeed] = useState(1),
    [stage, setStage] = useState(0),
    [shared, setShared] = useState(false),
    [curve, setCurve] = useState("Ellipse"),
    [equation, setEquation] = useState(""),
    [status, setStatus] = useState(""),
    [solution, setSolution] = useState(false);
  const p = pointAt(t),
    setParameter = (v: number) => {
      setT(Math.max(-2 * PI, Math.min(2 * PI, v)));
      onInteraction();
    };
  const reset = () => {
    setT(1);
    setPlaying(false);
    setAnimate(true);
    setSpeed(1);
    setStage(0);
    setShared(false);
    setCurve("Ellipse");
    setEquation("");
    setStatus("");
    setSolution(false);
    onInteraction();
  };
  useEffect(() => {
    setT(1);
    setPlaying(false);
    setAnimate(true);
    setSpeed(1);
    setStage(0);
    setShared(false);
    setCurve("Ellipse");
    setEquation("");
    setStatus("");
    setSolution(false);
  }, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setT((v) => {
        if (v < 2 * PI) return v + 0.025 * speed;
        if (animate) return -2 * PI;
        setPlaying(false);
        return 2 * PI;
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, [animate, playing, speed]);
  const normalized = equation
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/\^2/g, "²"),
    correct =
      curve === "Ellipse" &&
      (normalized === "x²/4+y²=1" || normalized === "x²÷4+y²=1");
  return (
    <main
      className="pm181-page"
      data-testid="geometry-mockup-0238"
      data-dedicated-lesson="181"
      data-object-model="shared-parameter-synchronized-motion-coordinate-functions-and-elimination"
      data-t={t.toFixed(3)}
      data-x={p.x.toFixed(3)}
      data-y={p.y.toFixed(3)}
      data-playing={playing}
      data-animate={animate}
      data-speed={speed.toFixed(1)}
      data-stage={stage}
      data-status={status}
    >
      <header className="pm181-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Parametric Coordinates</h1>
        <p>Represent motion through a parameter.</p>
        <section>
          <b>♙ Intermediate</b>
          <b>⌁ Construction Lab</b>
          <b>▣ Geometry / Graphing View</b>
          <b>◷ 6-10 min</b>
        </section>
        <footer>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `t=${fmt(t)} P(${fmt(p.x)},${fmt(p.y)})`,
              );
              setShared(true);
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() => {
              setStage(4);
              onInteraction();
            }}
          >
            <Bookmark />
          </button>
          <output>{shared ? "Saved" : ""}</output>
        </footer>
      </header>
      <nav className="pm181-stages">
        {[
          ["Observe", "See the motion"],
          ["Manipulate", "Control the motion"],
          ["Pattern", "Notice relationships"],
          ["Rule", "Understand the rule"],
          ["Try", "Practice it yourself"],
        ].map(([a, b], i) => (
          <button
            className={stage === i ? "active" : ""}
            key={a}
            onClick={() => {
              setStage(i);
              onInteraction();
            }}
          >
            <i>{i + 1}</i>
            <b>{a}</b>
            <small>{b}</small>
          </button>
        ))}
      </nav>
      <section className="pm181-work">
        <article>
          <h2>Motion of a point ⓘ</h2>
          <MotionGraph t={t} onT={setParameter} />
          <div>
            <section>
              <h3>x = cos(t) + 2</h3>
              <FunctionGraph kind="x" t={t} />
            </section>
            <section>
              <h3>y = sin(t) + 1</h3>
              <FunctionGraph kind="y" t={t} />
            </section>
          </div>
        </article>
        <aside>
          <section>
            <h2>Parameter t</h2>
            <output>t = {fmt(t)} rad</output>
            <label>
              −2π
              <input
                aria-label="Parameter t"
                type="range"
                min={-2 * PI}
                max={2 * PI}
                step=".01"
                value={t}
                onChange={(e) => setParameter(Number(e.target.value))}
              />
              2π
            </label>
            <div>
              <button
                aria-label="Start parameter"
                onClick={() => setParameter(-2 * PI)}
              >
                <SkipBack />
              </button>
              <button
                aria-label={playing ? "Pause motion" : "Play motion"}
                onClick={() => {
                  setPlaying((v) => !v);
                  onInteraction();
                }}
              >
                {playing ? <Pause /> : <Play />}
              </button>
              <button
                aria-label="Step forward"
                onClick={() => setParameter(t + 0.1)}
              >
                <SkipForward />
              </button>
              <button
                aria-label="End parameter"
                onClick={() => setParameter(2 * PI)}
              >
                <SkipForward />
              </button>
            </div>
            <footer>
              <label>
                <input
                  type="checkbox"
                  checked={animate}
                  onChange={() => {
                    setAnimate((v) => !v);
                    onInteraction();
                  }}
                />
                Animate
              </label>
              <label>
                Speed
                <input
                  aria-label="Animation speed"
                  type="range"
                  min=".5"
                  max="3"
                  step=".5"
                  value={speed}
                  onChange={(e) => {
                    setSpeed(Number(e.target.value));
                    onInteraction();
                  }}
                />
              </label>
            </footer>
          </section>
          <section>
            <h3>Current coordinates</h3>
            <output>
              <b>x(t) = {fmt(p.x)}</b>
              <b>y(t) = {fmt(p.y)}</b>
            </output>
          </section>
          <section>
            <h3>Eliminate the parameter (result)</h3>
            <output>(x - 2)² + (y - 1)² = 1</output>
            <p>💡 A circle of radius 1 centered at (2, 1).</p>
          </section>
          <section>
            <h3>At a glance</h3>
            <p>• The point P moves as t changes.</p>
            <p>• x(t) and y(t) are sinusoidal.</p>
            <p>• Eliminating t gives a circle.</p>
          </section>
        </aside>
      </section>
      <section className="pm181-note">
        <b>◉ What is happening?</b>
        <p>
          The parameter t drives the motion. At each t, the values x(t) and y(t)
          give the coordinates of P.
        </p>
        <p>
          The graphs of x(t) and y(t) show how each coordinate changes with t.
        </p>
      </section>
      <section className="pm181-learn">
        <article>
          <h3>Definition</h3>
          <p>A parametric representation of a curve in the plane is given by</p>
          <output>
            x=f(t),
            <br />
            y=g(t)
          </output>
          <p>where t varies over an interval I.</p>
          <p>As t changes, P(f(t),g(t)) traces the curve.</p>
        </article>
        <article>
          <h3>Construction steps</h3>
          <ol>
            <li>Choose x=f(t) and y=g(t).</li>
            <li>Let t move over an interval I.</li>
            <li>Plot P(f(t),g(t)) to trace the curve.</li>
            <li>Eliminate t to get an equation in x and y.</li>
          </ol>
        </article>
        <article>
          <h3>Worked example</h3>
          <p>Let x=cos(t)+2, y=sin(t)+1.</p>
          <p>Eliminate t:</p>
          <p>(x-2)²+(y-1)²=cos²t+sin²t=1</p>
          <output>(x-2)²+(y-1)²=1</output>
        </article>
      </section>
      <section className="pm181-practice">
        <h3>◉ Try it yourself</h3>
        <p>1. Use the slider to explore, then answer.</p>
        <article>
          <output>
            x=2 cos t<br />
            y=sin t
          </output>
          <fieldset>
            <legend>a) What curve is traced?</legend>
            {["Circle", "Ellipse", "Line", "Parabola"].map((x) => (
              <label key={x}>
                <input
                  type="radio"
                  name="curve181"
                  checked={curve === x}
                  onChange={() => {
                    setCurve(x);
                    onInteraction();
                  }}
                />
                {x}
              </label>
            ))}
          </fieldset>
          <label>
            b) Find the Cartesian equation satisfied by x and y.
            <input
              aria-label="Parametric practice equation"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="x²/4 + y² = 1"
            />
          </label>
          <aside>
            <b>Hint</b>
            <p>Eliminate t using cos²t+sin²t=1.</p>
            <button
              onClick={() => {
                setStatus(
                  correct
                    ? "Correct ellipse equation"
                    : "Check the curve and eliminate t",
                );
                onInteraction();
              }}
            >
              Check answer
            </button>
            <button
              onClick={() => {
                setSolution((v) => !v);
                onInteraction();
              }}
            >
              Show solution
            </button>
            <output>{solution ? "x²/4 + y² = 1" : status}</output>
          </aside>
        </article>
      </section>
      <nav className="pm181-nav">
        <a href="/lessons/geometry/180-polar-coordinates">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Polar Coordinates</b>
          </span>
        </a>
        <a href="/lessons/geometry/182-barycentric-coordinates">
          <span>
            <small>Next</small>
            <b>Barycentric Coordinates</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="pm181-footer">
        <b>Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <a>Sitemap</a>
        <a>Docs</a>
        <a>About</a>
      </footer>
    </main>
  );
}
