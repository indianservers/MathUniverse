import { Lightbulb, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LocalExtremaTargetLesson10177.css";

const f = (x: number) => x * x * x - 3 * x,
  df = (x: number) => 3 * x * x - 3,
  fmt = (x: number) => Number(x.toFixed(2));
export default function LocalExtremaTargetLesson10177({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [x, setX] = useState(0.5),
    [playing, setPlaying] = useState(false),
    [solution, setSolution] = useState(false),
    [choice, setChoice] = useState(""),
    [feedback, setFeedback] = useState("");
  const slope = df(x),
    sign =
      slope > 1e-8
        ? "Positive (+)"
        : slope < -1e-8
          ? "Negative (−)"
          : "Zero (0)";
  const curve = useMemo(
    () =>
      Array.from({ length: 141 }, (_, i) => {
        const n = -3.5 + i * 0.05;
        return `${260 + n * 65},${220 - f(n) * 18}`;
      }).join(" "),
    [],
  );
  const px = (n: number) => 260 + n * 65,
    py = (n: number) => 220 - f(n) * 18;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setX((v) => {
          const n = fmt(v + 0.1);
          if (n > 2.6) {
            setPlaying(false);
            return -2.6;
          }
          return n;
        }),
      160,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const setPoint = (n: number) => setX(Math.max(-2.6, Math.min(2.6, n)));
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPoint(x - 0.1);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setPoint(x + 0.1);
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      setPoint(((p.clientX - r.left) / r.width) * 8 - 4);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  return (
    <main
      className="le10177-page"
      data-testid="school-mockup-0851"
      data-object-model="dedicated-local-extrema-first-derivative-engine"
      data-x={fmt(x)}
      data-derivative={fmt(slope)}
      data-sign={sign}
      data-playing={String(playing)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Local Maxima and Minima</h1>
        <p>Use the sign of f'(x) to locate and classify turning points.</p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>derivatives</span>
        </div>
      </header>
      <nav className="le-tabs">
        {["interact", "learn", "worked example", "practice"].map((name) => (
          <label key={name}>
            <input
              type="radio"
              name="local-extrema-tab"
              defaultChecked={name === "interact"}
            />
            {name}
          </label>
        ))}
      </nav>
      <section className="le-lab">
        <article>
          <div>
            <h4>Function</h4>
            <h2>f(x)=x³−3x</h2>
            <p>
              <b>●</b> Local maximum (−1,2) &nbsp; <i>●</i> Local minimum (1,−2)
            </p>
          </div>
          <svg viewBox="0 0 520 410" aria-label="Local extrema cubic graph">
            <defs>
              <pattern
                id="legrid"
                width="65"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path d="M65 0H0V50" fill="none" stroke="#dce6eb" />
              </pattern>
            </defs>
            <rect width="520" height="410" fill="url(#legrid)" />
            <path d="M15 220H505M260 15V395" stroke="#273548" />
            <polyline
              points={curve}
              fill="none"
              stroke="#7740e2"
              strokeWidth="3"
            />
            <line
              x1={px(x) - 90}
              y1={py(x) + 90 * slope * 0.277}
              x2={px(x) + 90}
              y2={py(x) - 90 * slope * 0.277}
              stroke="#667380"
              strokeWidth="2"
            />
            <circle
              cx={px(-1)}
              cy={py(-1)}
              r="7"
              fill="#7138d5"
              role="button"
              tabIndex={0}
              aria-label="Select local maximum"
              onClick={() => setX(-1)}
              onKeyDown={(e) => e.key === "Enter" && setX(-1)}
            />
            <circle
              cx={px(1)}
              cy={py(1)}
              r="7"
              fill="#0aa0b8"
              role="button"
              tabIndex={0}
              aria-label="Select local minimum"
              onClick={() => setX(1)}
              onKeyDown={(e) => e.key === "Enter" && setX(1)}
            />
            <circle
              role="slider"
              aria-label="Graph tangent point x zero"
              tabIndex={0}
              onPointerDown={drag}
              onKeyDown={key}
              cx={px(x)}
              cy={py(x)}
              r="6"
              fill="#111"
            />
            <text x={px(-1) - 30} y={py(-1) - 15}>
              (−1, 2)
            </text>
            <text x={px(1)} y={py(1) + 30}>
              (1, −2)
            </text>
          </svg>
          <b>
            <Lightbulb /> Select extrema or drag the black tangent point. Move
            the slider to inspect f'(x).
          </b>
        </article>
        <aside>
          <section>
            <h3>ADJUST x₀</h3>
            <label>
              x₀={fmt(x)}
              <input
                aria-label="Adjust x zero"
                type="range"
                min="-2.6"
                max="2.6"
                step=".1"
                value={x}
                onInput={(e) => setPoint(Number(e.currentTarget.value))}
              />
            </label>
          </section>
          <section>
            <h3>TANGENT AT x₀</h3>
            <h2>f'(x₀)=3x₀²−3</h2>
            <strong>= {fmt(slope)}</strong>
            <h4>Slope</h4>
            <b>{fmt(slope)}</b>
            <h4>Sign of f'(x₀)</h4>
            <b>{sign}</b>
            <div>
              <button
                onClick={() => {
                  setX(0.5);
                  setPlaying(false);
                }}
              >
                <RotateCcw /> Reset
              </button>
              <button onClick={() => setPlaying((v) => !v)}>
                {playing ? <Pause /> : <Play />}
                {playing ? "Pause" : "Play"}
              </button>
            </div>
          </section>
        </aside>
      </section>
      <section className="le-sign">
        <h3>DERIVATIVE SIGN CHART</h3>
        <table>
          <thead>
            <tr>
              <th>Interval</th>
              <th>(−∞,−1)</th>
              <th>−1</th>
              <th>(−1,1)</th>
              <th>1</th>
              <th>(1,∞)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Sign of f'(x)</th>
              <td>+</td>
              <td>0</td>
              <td>−</td>
              <td>0</td>
              <td>+</td>
            </tr>
            <tr>
              <th>Behavior of f</th>
              <td>Increasing ↗</td>
              <td>Turning Point (Local Max)</td>
              <td>Decreasing ↘</td>
              <td>Turning Point (Local Min)</td>
              <td>Increasing ↗</td>
            </tr>
            <tr>
              <th>Interpretation</th>
              <td colSpan={2}>+ → 0 → −: local maximum at x=−1</td>
              <td colSpan={3}>− → 0 → +: local minimum at x=1</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="le-three">
        <article>
          <h3>WHAT TO NOTICE</h3>
          <p>At x=−1, f'(x) changes from + to −, so f has a local maximum.</p>
          <p>At x=1, f'(x) changes from − to +, so f has a local minimum.</p>
        </article>
        <article>
          <h3>FIRST DERIVATIVE TEST</h3>
          <p>+ to − ⇒ local maximum</p>
          <p>− to + ⇒ local minimum</p>
          <p>No sign change ⇒ no local extremum</p>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>f'(c)=0 alone does not prove an extremum.</b>
          <p>Check the sign of f'(x), or use the second derivative test.</p>
        </article>
      </section>
      <section className="le-lower">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Find and classify extrema of f(x)=x³−3x.</p>
          <ol>
            <li>f'(x)=3x²−3</li>
            <li>f'(x)=0 ⇒ x=−1,1</li>
            <li>Signs are +,−,+ across the intervals.</li>
            <li>
              Therefore (−1,2) is a local maximum and (1,−2) is a local minimum.
            </li>
          </ol>
          <b>Answer: local maximum (−1,2); local minimum (1,−2).</b>
        </article>
        <div>
          <article>
            <h3>PRACTICE CHALLENGE</h3>
            <p>Find and classify extrema of g(x)=x⁴−4x²+1.</p>
            <button onClick={() => setSolution((v) => !v)}>
              {solution ? "Hide" : "Show"} solution
            </button>
            {solution && (
              <output>
                g'(x)=4x(x²−2); maxima at x=0 and minima at x=±√2.
              </output>
            )}
          </article>
          <article>
            <h3>CHECK YOUR UNDERSTANDING</h3>
            <p>For h(x)=x³ at x=0, h'(0)=0 but there is no extremum. Why?</p>
            {[
              "Because h''(0)=0.",
              "Because h'(x) does not change sign at x=0.",
              "Because the function is not continuous.",
              "Because h(0)=0.",
            ].map((v, i) => (
              <label key={v}>
                <input
                  type="radio"
                  name="le-check"
                  value={String(i)}
                  checked={choice === String(i)}
                  onChange={(e) => setChoice(e.target.value)}
                />
                {String.fromCharCode(65 + i)}. {v}
              </label>
            ))}
            <button
              onClick={() =>
                setFeedback(
                  choice === "1"
                    ? "Correct: h'(x)=3x² stays non-negative."
                    : "Check the derivative sign on both sides.",
                )
              }
            >
              Check answer
            </button>
            {feedback && <output>{feedback}</output>}
          </article>
        </div>
      </section>
      <nav className="le-adjacent">
        <button>← Increasing and Decreasing Functions</button>
        <button>Absolute Maxima and Minima →</button>
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
