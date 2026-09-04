import {
  CheckCircle2,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DifferentialsApproximationTargetLesson10179.css";

const fmt = (value: number, digits = 5) => Number(value.toFixed(digits));
export default function DifferentialsApproximationTargetLesson10179({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(4),
    [dx, setDx] = useState(0.1),
    [zoom, setZoom] = useState(1),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState("");
  const fa = Math.sqrt(a),
    actual = Math.sqrt(a + dx),
    delta = actual - fa,
    derivative = 1 / (2 * fa),
    dy = derivative * dx,
    approx = fa + dy,
    error = Math.abs(delta - dy),
    percent = Math.abs(delta) > 1e-12 ? (error / Math.abs(delta)) * 100 : 0;
  const curve = useMemo(
    () =>
      Array.from({ length: 141 }, (_, i) => {
        const x = i * 0.05;
        return `${35 + x * 66},${330 - Math.sqrt(x) * 94}`;
      }).join(" "),
    [],
  );
  const px = (x: number) => 35 + x * 66,
    py = (y: number) => 330 - y * 94;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setDx((v) => {
          const next = Math.max(0.001, fmt(v * 0.72, 3));
          if (next <= 0.001) setPlaying(false);
          return next;
        }),
      260 / speed,
    );
    return () => window.clearInterval(timer);
  }, [playing, speed]);
  const setBase = (value: number) => setA(Math.max(0.1, Math.min(25, value)));
  const setChange = (value: number) =>
    setDx(Math.max(0.001, Math.min(1, value)));
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setChange(dx - 0.01);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setChange(dx + 0.01);
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect(),
        x = ((p.clientX - r.left) / r.width) * 8 - 0.5;
      setChange(x - a);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const reset = () => {
    setA(4);
    setDx(0.1);
    setZoom(1);
    setPlaying(false);
    setSpeed(1);
  };
  const expected = 3 + 0.3 / 27;
  return (
    <main
      className="da10179-page"
      data-testid="school-mockup-0853"
      data-object-model="dedicated-differential-linearization-engine"
      data-base={fmt(a, 3)}
      data-dx={fmt(dx, 3)}
      data-actual={fmt(actual)}
      data-differential={fmt(dy)}
      data-approximation={fmt(approx)}
      data-error={fmt(error)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Approximation Using Differentials</h1>
        <p>
          Use differentials to approximate function values near a point by the
          equation of the tangent line.
        </p>
        <div>
          <span>16 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>LAB</span>
        </div>
      </header>
      <nav className="da-tabs">
        {[
          "Tangent Approximation Lab",
          "Learn",
          "Worked Example",
          "Practice",
          "Summary",
        ].map((name, index) => (
          <label key={name}>
            <input type="radio" name="da-tab" defaultChecked={index === 0} />
            {name}
          </label>
        ))}
      </nav>
      <section className="da-lab">
        <h3>TANGENT APPROXIMATION LAB</h3>
        <p>Explore how the tangent line at x=a approximates y=f(x) near x=a.</p>
        <div className="da-inputs">
          <label>
            <b>FUNCTION</b>
            <output>f(x)=√x</output>
          </label>
          <label>
            <b>BASE POINT a</b>
            <input
              aria-label="Base point a"
              type="number"
              min=".1"
              max="25"
              step=".1"
              value={a}
              onChange={(e) => setBase(Number(e.target.value))}
            />
            <span>
              f(a)=√{fmt(a, 2)}={fmt(fa)}
            </span>
          </label>
          <label>
            <b>CHANGE dx</b>
            <input
              aria-label="Change dx"
              type="range"
              min=".001"
              max="1"
              step=".001"
              value={dx}
              onInput={(e) => setChange(Number(e.currentTarget.value))}
            />
            <output>{fmt(dx, 3)}</output>
            <span>x=a+dx={fmt(a + dx, 3)}</span>
          </label>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </div>
        <div className="da-workspace">
          <article>
            <h3>GRAPH</h3>
            <svg
              viewBox="0 0 520 390"
              aria-label="Square root tangent approximation graph"
              style={{ transform: `scale(${zoom})` }}
            >
              <defs>
                <pattern
                  id="dagrid"
                  width="66"
                  height="47"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M66 0H0V47" fill="none" stroke="#dce6eb" />
                </pattern>
              </defs>
              <rect width="520" height="390" fill="url(#dagrid)" />
              <path d="M20 330H500M35 15V370" stroke="#273548" />
              <polyline
                points={curve}
                fill="none"
                stroke="#1673e9"
                strokeWidth="3"
              />
              <line
                x1="35"
                y1={py(fa - a * derivative)}
                x2="500"
                y2={py(fa + (7 - a) * derivative)}
                stroke="#178a53"
                strokeDasharray="7"
                strokeWidth="2.5"
              />
              <line
                x1={px(a)}
                y1={py(fa)}
                x2={px(a)}
                y2="330"
                stroke="#178a53"
                strokeDasharray="5"
              />
              <line
                x1={px(a + dx)}
                y1={py(actual)}
                x2={px(a + dx)}
                y2="330"
                stroke="#176cea"
                strokeDasharray="5"
              />
              <line
                x1={px(a + dx)}
                y1={py(actual)}
                x2={px(a + dx)}
                y2={py(approx)}
                stroke="#7b3bd1"
                strokeWidth="3"
              />
              <circle cx={px(a)} cy={py(fa)} r="7" fill="#111" />
              <circle
                role="slider"
                aria-label="Graph changed x point"
                tabIndex={0}
                onPointerDown={drag}
                onKeyDown={key}
                cx={px(a + dx)}
                cy={py(actual)}
                r="7"
                fill="#1673e9"
              />
              <text x={px(a) + 8} y={py(fa) + 23}>
                ({fmt(a, 2)}, {fmt(fa, 2)})
              </text>
              <text x={px(a + dx) + 8} y={py(actual) - 10}>
                ({fmt(a + dx, 2)}, √{fmt(a + dx, 2)})
              </text>
            </svg>
            <div className="da-zoom">
              <button
                aria-label="Zoom in graph"
                onClick={() => setZoom((v) => Math.min(1.4, v + 0.1))}
              >
                <ZoomIn />
              </button>
              <button
                aria-label="Zoom out graph"
                onClick={() => setZoom((v) => Math.max(0.7, v - 0.1))}
              >
                <ZoomOut />
              </button>
              <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
            </div>
            <small>
              Δy is the actual change; dy is the tangent-line differential.
            </small>
          </article>
          <article className="da-values">
            <h3>VALUES AT x=a+dx={fmt(a + dx, 3)}</h3>
            <p>
              f(a)=√{fmt(a, 2)} <b>= {fmt(fa)}</b>
            </p>
            <p>
              Actual value f(a+dx)=√{fmt(a + dx, 3)} <b>= {fmt(actual)}</b>
            </p>
            <p className="purple">
              Actual change Δy=f(a+dx)−f(a) <b>= {fmt(delta)}</b>
            </p>
            <p>Derivative f'(x)=1/(2√x)</p>
            <p>
              f'({fmt(a, 2)})={fmt(derivative)}
            </p>
            <p className="orange">
              Differential dy=f'(a)dx <b>= {fmt(dy)}</b>
            </p>
            <p className="green">
              Tangent approximation f(a+dx)≈f(a)+f'(a)dx <b>= {fmt(approx)}</b>
            </p>
            <hr />
            <h3>ERROR ANALYSIS</h3>
            <p>
              Absolute error |Δy−dy| <b>= {fmt(error)}</b>
            </p>
            <p>
              Percentage error |Δy−dy|/|Δy|×100% <b>= {fmt(percent, 2)}%</b>
            </p>
          </article>
        </div>
        <section className="da-shrink">
          <div>
            <h3>SEE ERROR SHRINK</h3>
            <p>Decrease dx to see the approximation improve.</p>
          </div>
          <button
            aria-label={playing ? "Pause shrinking dx" : "Play shrinking dx"}
            onClick={() => setPlaying((v) => !v)}
          >
            {playing ? <Pause /> : <Play />}
          </button>
          <input
            aria-label="Error shrink dx"
            type="range"
            min=".001"
            max="1"
            step=".001"
            value={dx}
            onInput={(e) => setChange(Number(e.currentTarget.value))}
          />
          <div>
            <b>Animation speed</b>
            {[1, 2, 4].map((v) => (
              <button
                className={speed === v ? "active" : ""}
                onClick={() => setSpeed(v)}
                key={v}
              >
                {v}x
              </button>
            ))}
          </div>
        </section>
      </section>
      <section className="da-concepts">
        <article>
          <h3>LINEAR APPROXIMATION FORMULA</h3>
          <p>For a differentiable function f at x=a,</p>
          <b>f(a+dx)≈f(a)+f'(a)dx</b>
          <p>This is the equation of the tangent line at x=a.</p>
        </article>
        <article>
          <h3>WHY IT WORKS</h3>
          <p>
            Near x=a, the curve y=f(x) is well approximated by its tangent line.
            The smaller dx, the smaller the error.
          </p>
        </article>
        <article>
          <h3>WHEN TO BE CAREFUL</h3>
          <p>
            If |dx| is large, the curve bends significantly and the tangent line
            no longer gives a good approximation.
          </p>
        </article>
      </section>
      <section className="da-worked">
        <article>
          <h3>WORKED EXAMPLE (CORRECT)</h3>
          <p>Estimate √4.10 using differentials with a=4.</p>
          <ul>
            <li>f(a)=√4=2</li>
            <li>f'(4)=1/4=.25</li>
            <li>f(4+.1)≈2+(.25)(.1)=2.025</li>
            <li>Actual √4.10≈2.02485</li>
            <li>Absolute error≈.00015; percentage error≈.60%</li>
          </ul>
        </article>
        <aside>
          <h3>CHECK</h3>
          <p>(√4.10)²=4.10 ✓</p>
          <p>(2.025)²=4.100625</p>
          <b>close to 4.10</b>
        </aside>
      </section>
      <section className="da-practice">
        <h3>PRACTICE TASK</h3>
        <p>Estimate ∛27.3 using differentials with a=27.</p>
        <div>
          <article>
            <b>Use f(x)=∛x.</b>
            <p>a=27, dx=.3</p>
          </article>
          <article>
            <h4>Hint</h4>
            <p>f'(x)=1/(3x^(2/3))</p>
          </article>
          <article>
            <label>
              Your estimate
              <input
                aria-label="Cube root approximation answer"
                type="number"
                step=".00001"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </label>
            <button
              onClick={() =>
                setFeedback(
                  Math.abs(Number(answer) - expected) < 0.00002
                    ? "Correct: 3.01111 is the differential estimate."
                    : "Use 3 + 0.3/27.",
                )
              }
            >
              <CheckCircle2 /> Check my answer
            </button>
            {feedback && <output>{feedback}</output>}
          </article>
        </div>
      </section>
      <nav className="da-adjacent">
        <button>← Absolute Maxima and Minima</button>
        <button>Differentials and Applications →</button>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
