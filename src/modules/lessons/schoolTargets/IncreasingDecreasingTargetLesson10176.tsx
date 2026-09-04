import { Lightbulb, Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./IncreasingDecreasingTargetLesson10176.css";

const f = (x: number) => x * x * x - 3 * x,
  df = (x: number) => 3 * x * x - 3,
  fmt = (x: number) => Number(x.toFixed(3));
export default function IncreasingDecreasingTargetLesson10176({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [x, setX] = useState(-0.5),
    [test, setTest] = useState(-0.5),
    [zoom, setZoom] = useState(1);
  const [answers, setAnswers] = useState([false, false, false]),
    [a, setA] = useState(-3),
    [b, setB] = useState(0);
  const [turning, setTurning] = useState(true),
    [tangent, setTangent] = useState(true),
    [applied, setApplied] = useState(false),
    [hint, setHint] = useState(false);
  const slope = df(x),
    status =
      slope > 1e-8 ? "Increasing" : slope < -1e-8 ? "Decreasing" : "Stationary";
  const curve = useMemo(
    () =>
      Array.from({ length: 161 }, (_, i) => {
        const n = -4 + i * 0.05;
        return `${260 + n * 56},${230 - f(n) * 10}`;
      }).join(" "),
    [],
  );
  const px = (n: number) => 260 + n * 56,
    py = (n: number) => 230 - f(n) * 10;
  const setPoint = (n: number) => setX(Math.max(-3.5, Math.min(3.5, n)));
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPoint(x - 0.1);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setPoint(x + 0.1);
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      setPoint(((p.clientX - r.left) / r.width) * 9 - 4.5);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const roots = a < 0 ? [-Math.sqrt(-a / 3), Math.sqrt(-a / 3)] : [];
  const resetExplorer = () => {
    setA(-3);
    setB(0);
    setTurning(true);
    setTangent(true);
    setApplied(false);
  };
  return (
    <main
      className="id10176-page"
      data-testid="school-mockup-0850"
      data-object-model="dedicated-cubic-derivative-sign-engine"
      data-x={fmt(x)}
      data-derivative={fmt(slope)}
      data-status={status.toLowerCase()}
      data-critical-points={roots.map(fmt).join(",") || "none"}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Increasing and Decreasing Functions</h1>
        <p>
          Use derivatives to determine where a function increases, decreases,
          and has turning points.
        </p>
        <div>
          <span>30 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>derivative</span>
        </div>
      </header>
      <section className="id-top">
        <article>
          <h3>FUNCTION &amp; GRAPH</h3>
          <h2>f(x)=x³−3x</h2>
          <label>
            Tangent at <output>x={fmt(x)}</output>
            <input
              aria-label="Tangent point x"
              type="range"
              min="-3.5"
              max="3.5"
              step=".1"
              value={x}
              onInput={(e) => setPoint(Number(e.currentTarget.value))}
            />
          </label>
          <svg
            viewBox="0 0 520 430"
            aria-label="Increasing and decreasing cubic graph"
            style={{ transform: `scale(${zoom})` }}
          >
            <defs>
              <pattern
                id="idgrid"
                width="56"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path d="M56 0H0V50" fill="none" stroke="#dce6eb" />
              </pattern>
            </defs>
            <rect width="520" height="430" fill="url(#idgrid)" />
            <path d="M15 230H505M260 15V415" stroke="#253549" />
            <polyline
              points={curve}
              fill="none"
              stroke="#0ca34f"
              strokeWidth="3"
            />
            <polyline
              points={Array.from({ length: 41 }, (_, i) => {
                const n = -1 + i * 0.05;
                return `${px(n)},${py(n)}`;
              }).join(" ")}
              fill="none"
              stroke="#ff6d19"
              strokeWidth="3"
            />
            {tangent && (
              <line
                x1={px(x) - 70}
                y1={py(x) + 70 * slope * 0.18}
                x2={px(x) + 70}
                y2={py(x) - 70 * slope * 0.18}
                stroke="#7e8791"
                strokeWidth="2"
              />
            )}
            {turning && (
              <>
                <circle cx={px(-1)} cy={py(-1)} r="6" fill="#1770e8" />
                <circle cx={px(1)} cy={py(1)} r="6" fill="#1770e8" />
              </>
            )}
            <circle
              role="slider"
              aria-label="Graph tangent point"
              tabIndex={0}
              onPointerDown={drag}
              onKeyDown={key}
              cx={px(x)}
              cy={py(x)}
              r="7"
              fill="#111"
            />
            <text x={px(-1) - 30} y={py(-1) - 15}>
              (−1, 2)
            </text>
            <text x={px(1) - 25} y={py(1) + 28}>
              (1, −2)
            </text>
          </svg>
          <div className="id-zoom">
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
          <b>
            Move the tangent slider or drag the black point. The right panel
            updates automatically.
          </b>
        </article>
        <aside>
          <h3>DERIVATIVE &amp; SIGN ANALYSIS</h3>
          <h2>f'(x)=3x²−3=3(x−1)(x+1)</h2>
          <h4>Step 1: Critical points</h4>
          <p>Solve f'(x)=0 ⇒ x=−1, x=1</p>
          <h4>Step 2: Sign chart for f'(x)</h4>
          <table>
            <thead>
              <tr>
                <th>Interval</th>
                <th>(−∞,−1)</th>
                <th>(−1,1)</th>
                <th>(1,∞)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Test point</td>
                <td>−2</td>
                <td>0</td>
                <td>2</td>
              </tr>
              <tr>
                <td>f'(x)</td>
                <td>+</td>
                <td>−</td>
                <td>+</td>
              </tr>
              <tr>
                <td>f(x)</td>
                <td>↗</td>
                <td>↘</td>
                <td>↗</td>
              </tr>
            </tbody>
          </table>
          <section>
            <h4>Interval Testing</h4>
            <div>
              {[-2, -0.5, 0, 0.5, 2].map((v) => (
                <button
                  className={test === v ? "active" : ""}
                  onClick={() => setTest(v)}
                  key={v}
                >
                  {v}
                </button>
              ))}
            </div>
            <p>
              At x={test}, f'({test})={fmt(df(test))}
            </p>
            <b className={df(test) >= 0 ? "up" : "down"}>
              f'(x) {df(test) > 0 ? ">" : df(test) < 0 ? "<" : "="} 0 →{" "}
              {df(test) > 0
                ? "Increasing"
                : df(test) < 0
                  ? "Decreasing"
                  : "Stationary"}
            </b>
          </section>
          <b className="id-link">
            The sign of f'(x) determines whether f increases or decreases.
          </b>
        </aside>
      </section>
      <section className="id-middle">
        <article>
          <h3>CLASSIFICATION OF CRITICAL POINTS</h3>
          <p>Use f''(x)=6x or the sign change of f'(x).</p>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>x</th>
                <th>f(x)</th>
                <th>f''(x)</th>
                <th>Sign change</th>
                <th>Conclusion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>−1</td>
                <td>2</td>
                <td>−6</td>
                <td>+ → −</td>
                <td>Local maximum</td>
              </tr>
              <tr>
                <td>B</td>
                <td>1</td>
                <td>−2</td>
                <td>6</td>
                <td>− → +</td>
                <td>Local minimum</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>Increasing on (−∞,−1) and (1,∞)</li>
            <li>Decreasing on (−1,1)</li>
            <li>Local maximum at (−1,2)</li>
            <li>Local minimum at (1,−2)</li>
          </ul>
          <b>
            These intervals and turning points are confirmed by both derivative
            and graph.
          </b>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <p>Do not classify critical points by only looking at the graph.</p>
          <ol>
            <li>Find f'(x) and critical points.</li>
            <li>Make a sign chart for f'(x).</li>
            <li>Use sign changes or f''(x) to classify.</li>
          </ol>
          <b>Graphs can guide you, but derivatives confirm the result.</b>
        </article>
      </section>
      <section className="id-practice">
        <article>
          <h3>PRACTICE</h3>
          <div>
            {[
              ["Find f'(x) for f(x)=x³−3x.", "3x²−3"],
              ["Find the critical points.", "x=−1, 1"],
              [
                "Find intervals where f increases and decreases.",
                "Increasing outside [−1,1]; decreasing inside.",
              ],
            ].map(([q, a], i) => (
              <section key={q}>
                <b>{i + 1}</b>
                <p>{q}</p>
                <button
                  onClick={() =>
                    setAnswers((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {answers[i] ? "Hide" : "Show"} answer
                </button>
                {answers[i] && <output>{a}</output>}
              </section>
            ))}
          </div>
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <p>Experiment with f(x)=x³+ax+b.</p>
          <label>
            a
            <input
              aria-label="Cubic coefficient a"
              type="range"
              min="-6"
              max="3"
              step=".5"
              value={a}
              onInput={(e) => {
                setA(Number(e.currentTarget.value));
                setApplied(false);
              }}
            />
            <output>{a}</output>
          </label>
          <label>
            b
            <input
              aria-label="Cubic coefficient b"
              type="range"
              min="-4"
              max="4"
              step=".5"
              value={b}
              onInput={(e) => {
                setB(Number(e.currentTarget.value));
                setApplied(false);
              }}
            />
            <output>{b}</output>
          </label>
          <label>
            <input
              type="checkbox"
              checked={turning}
              onChange={(e) => setTurning(e.target.checked)}
            />{" "}
            Show turning points
          </label>
          <label>
            <input
              type="checkbox"
              checked={tangent}
              onChange={(e) => setTangent(e.target.checked)}
            />{" "}
            Show tangent
          </label>
          <div>
            <button onClick={resetExplorer}>
              <RotateCcw /> Reset
            </button>
            <button onClick={() => setApplied(true)}>Apply</button>
          </div>
          {applied && (
            <output>
              {roots.length
                ? `Critical points: x=${fmt(roots[0])}, ${fmt(roots[1])}. b shifts heights only.`
                : "No two distinct turning points; the cubic is increasing."}
            </output>
          )}
        </article>
      </section>
      <section className="id-guided">
        <h3>GUIDED PRACTICE</h3>
        <div>
          <article>
            <b>I. Understand</b>
            <p>What is the role of f'(x) in determining monotonicity?</p>
            <p>How do sign changes indicate turning points?</p>
          </article>
          <article>
            <b>II. Apply</b>
            <p>Make a sign chart for f'(x).</p>
            <p>Classify critical points.</p>
          </article>
          <article>
            <b>III. Extend</b>
            <p>How does f(x)=x³−6x² change?</p>
            <p>What happens if a≥0 in x³+ax+b?</p>
          </article>
        </div>
      </section>
      <section className="id-challenge">
        <h3>CHALLENGE</h3>
        <p>
          Find all a for which x³+ax has three distinct real zeros and determine
          intervals of increase/decrease.
        </p>
        <button onClick={() => setHint((v) => !v)}>
          <Lightbulb /> Hint
        </button>
        {hint && (
          <output>
            Three distinct zeros require a&lt;0. Critical points are
            ±sqrt(−a/3).
          </output>
        )}
      </section>
      <nav className="id-adjacent">
        <button>← Tangents and Normals</button>
        <button>Local Maxima and Minima →</button>
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
