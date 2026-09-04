import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InfiniteDiscontinuityTargetLesson10170.css";

const fmt = (n: number, d = 3) => n.toFixed(d),
  clamp = (n: number, l: number, h: number) => Math.max(l, Math.min(h, n));
export default function InfiniteDiscontinuityTargetLesson10170({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(2),
    [draftA, setDraftA] = useState(2),
    [left, setLeft] = useState(1.5),
    [right, setRight] = useState(2.5),
    [epsilon, setEpsilon] = useState(0.1);
  const [grid, setGrid] = useState(true),
    [asymptote, setAsymptote] = useState(true),
    [checked, setChecked] = useState(false);
  const fn = (x: number) => 1 / (x - a),
    mapX = (x: number) => 260 + x * 37,
    mapY = (y: number) => 200 - clamp(y, -6, 6) * 30;
  const curves = useMemo(() => {
    const make = (start: number, end: number) =>
      Array.from({ length: 90 }, (_, i) => {
        const x = start + ((end - start) * i) / 89;
        return `${mapX(x)},${mapY(1 / (x - a))}`;
      }).join(" ");
    return { left: make(-6, a - 0.08), right: make(a + 0.08, 6) };
  }, [a]);
  const setProbe = (side: "left" | "right", x: number) =>
    side === "left"
      ? setLeft(clamp(x, -6, a - 0.02))
      : setRight(clamp(x, a + 0.02, 6));
  const keyProbe =
    (side: "left" | "right") => (e: KeyboardEvent<SVGCircleElement>) => {
      const x = side === "left" ? left : right;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        setProbe(side, x - 0.05);
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        setProbe(side, x + 0.05);
    };
  const dragProbe =
    (side: "left" | "right") => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = e.currentTarget.ownerSVGElement!;
      const move = (ev: PointerEvent) =>
        setProbe(
          side,
          ((ev.clientX - svg.getBoundingClientRect().left) /
            svg.getBoundingClientRect().width) *
            14 -
            7,
        );
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };
  const applyA = () => {
    const n = clamp(draftA, -5, 5);
    setA(n);
    setLeft(n - 0.5);
    setRight(n + 0.5);
  };
  const reset = () => {
    setA(2);
    setDraftA(2);
    setLeft(1.5);
    setRight(2.5);
    setEpsilon(0.1);
    setGrid(true);
    setAsymptote(true);
    setChecked(false);
  };
  const table = [0.1, 0.01, 0.001];
  return (
    <main
      className="id10170-page"
      data-testid="school-mockup-0844"
      data-object-model="dedicated-vertical-asymptote-one-sided-limit-engine"
      data-asymptote={fmt(a, 2)}
      data-left-limit="-infinity"
      data-right-limit="infinity"
      data-classification="Infinite Discontinuity"
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Infinite Discontinuity</h1>
        <p>
          Explore <b>f(x)=1/(x−{fmt(a, 0)})</b>. The vertical line x={fmt(a, 0)}{" "}
          is an asymptote: the function tends to −∞ from the left and +∞ from
          the right.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </div>
      </header>
      <section className="id-lab">
        <div className="id-title">
          <div>
            <h3>☷ &nbsp; INTERACTIVE LAB</h3>
            <h2>Infinite Discontinuity Explorer</h2>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <div className="id-top">
          <article>
            <h3>GRAPH</h3>
            <div className="id-chart">
              <svg
                viewBox="0 0 520 390"
                aria-label="Infinite discontinuity graph"
              >
                {grid && (
                  <>
                    <defs>
                      <pattern
                        id="idgrid"
                        width="37"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path d="M37 0H0V30" fill="none" stroke="#dce6eb" />
                      </pattern>
                    </defs>
                    <rect width="520" height="390" fill="url(#idgrid)" />
                  </>
                )}
                <path d="M10 200H510M260 10V380" stroke="#263548" />
                {asymptote && (
                  <path
                    d={`M${mapX(a)} 10V380`}
                    stroke="#9f4ee6"
                    strokeDasharray="6"
                  />
                )}
                <polyline
                  points={curves.left}
                  fill="none"
                  stroke="#0589c6"
                  strokeWidth="3"
                />
                <polyline
                  points={curves.right}
                  fill="none"
                  stroke="#0589c6"
                  strokeWidth="3"
                />
                <circle
                  role="slider"
                  aria-label="Left asymptote probe"
                  tabIndex={0}
                  onPointerDown={dragProbe("left")}
                  onKeyDown={keyProbe("left")}
                  cx={mapX(left)}
                  cy={mapY(fn(left))}
                  r="7"
                  fill="#1ca7c4"
                />
                <circle
                  role="slider"
                  aria-label="Right asymptote probe"
                  tabIndex={0}
                  onPointerDown={dragProbe("right")}
                  onKeyDown={keyProbe("right")}
                  cx={mapX(right)}
                  cy={mapY(fn(right))}
                  r="7"
                  fill="#58b66b"
                />
                <text x={mapX(a) + 8} y="35" fill="#8d36d0">
                  x = {fmt(a, 0)}
                </text>
              </svg>
              <div className="id-legend">
                <b>━ f(x)=1/(x−{fmt(a, 0)})</b>
                <b>┊ Asymptote x={fmt(a, 0)}</b>
              </div>
            </div>
            <p>
              Drag the probes on the curve to explore one-sided behavior near x=
              {fmt(a, 0)}.
            </p>
            <div className="id-results">
              <section>
                <h3>ASYMPTOTE</h3>
                <strong>x = {fmt(a, 2)}</strong>
              </section>
              <section>
                <h3>LHL</h3>
                <strong>−∞</strong>
                <p>lim x→{fmt(a, 0)}⁻ f(x)=−∞</p>
              </section>
              <section>
                <h3>RHL</h3>
                <strong>+∞</strong>
                <p>lim x→{fmt(a, 0)}⁺ f(x)=+∞</p>
              </section>
            </div>
          </article>
          <aside>
            <section>
              <h3>ONE-SIDED PROBES (DRAG)</h3>
              <div className="id-probes">
                <label>
                  ● Left probe (x→{fmt(a, 0)}⁻)<b>xL = {fmt(left, 2)}</b>
                  <output>f(xL) = {fmt(fn(left))}</output>
                </label>
                <label>
                  ● Right probe (x→{fmt(a, 0)}⁺)<b>xR = {fmt(right, 2)}</b>
                  <output>f(xR) = {fmt(fn(right))}</output>
                </label>
              </div>
            </section>
            <section>
              <h3>ε-DISTANCE TO ASYMPTOTE</h3>
              <p>Choose how close x is to {fmt(a, 0)}.</p>
              <label>
                ε = |x−{fmt(a, 0)}| <output>{epsilon.toFixed(3)}</output>
                <input
                  aria-label="Epsilon distance"
                  type="range"
                  min=".001"
                  max="1"
                  step=".001"
                  value={epsilon}
                  onInput={(e) => {
                    const next = Number(e.currentTarget.value);
                    setEpsilon(next);
                    setLeft(a - next);
                    setRight(a + next);
                  }}
                />
              </label>
            </section>
            <section>
              <h3>VALUE TABLE (AUTO-UPDATES)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Side</th>
                    <th>x</th>
                    <th>x−a</th>
                    <th>f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {table
                    .flatMap((e) => [
                      ["Left", a - e, -e, -1 / e],
                      ["Right", a + e, e, 1 / e],
                    ])
                    .map((r, i) => (
                      <tr key={i}>
                        <td>{r[0]}</td>
                        <td>{fmt(Number(r[1]), 3)}</td>
                        <td>{fmt(Number(r[2]), 3)}</td>
                        <td>{fmt(Number(r[3]), 3)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
          </aside>
        </div>
      </section>
      <section className="id-facts">
        <article>
          <h3>ASYMPTOTE &amp; DOMAIN</h3>
          <p>
            <b>Vertical asymptote:</b> x={fmt(a, 2)}
          </p>
          <p>
            <b>Domain:</b> ℝ \ {fmt(a, 2)}
          </p>
          <p>
            <b>Range:</b> ℝ \ {0}
          </p>
        </article>
        <article>
          <h3>WHAT IS AN INFINITE DISCONTINUITY?</h3>
          <p>
            A function has an infinite discontinuity at x=a if at least one
            one-sided limit is ±∞. The graph has a vertical asymptote.
          </p>
        </article>
        <article>
          <h3>KEY TAKEAWAY</h3>
          <p>
            As x approaches {fmt(a, 0)} from the left, f(x)→−∞. From the right,
            f(x)→+∞.
          </p>
        </article>
      </section>
      <section className="id-compare">
        <h3>COMPARE DISCONTINUITIES</h3>
        <div>
          <article>
            <h3>○ Finite (Removable)</h3>
            <p>(x²−4)/(x−2)</p>
            <p>Limit exists; graph has a hole.</p>
          </article>
          <article>
            <h3>○ Jump</h3>
            <p>LHL=1, RHL=3</p>
            <p>Finite side limits exist but are unequal.</p>
          </article>
          <article className="selected">
            <h3>✓ Infinite (This Lesson)</h3>
            <p>f(x)=1/(x−{fmt(a, 0)})</p>
            <p>LHL=−∞, RHL=+∞.</p>
          </article>
        </div>
      </section>
      <section className="id-explain">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Find the one-sided limits of f(x)=1/(x−{fmt(a, 0)}).</p>
          <p>
            From the left, the denominator is a negative small number, so the
            quotient tends to −∞.
          </p>
          <p>From the right, it is positive and tends to +∞.</p>
          <strong>
            Therefore f has an infinite discontinuity at x={fmt(a, 0)}.
          </strong>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>Thinking the limit does not exist.</b>
          <p>
            The finite two-sided limit does not exist, but the one-sided limits
            do exist as infinite limits.
          </p>
          <strong>Always check both sides separately.</strong>
        </article>
      </section>
      <section className="id-practice">
        <article>
          <h3>PRACTICE</h3>
          <p>1. Find the one-sided limits of 3/(x+1) at x=−1.</p>
          <p>2. Find the one-sided limits of −2/(x−3) at x=3.</p>
          <p>3. Classify 5/(2x) at x=0.</p>
          <button onClick={() => setChecked(true)}>
            <Check /> Check answers
          </button>
          {checked && (
            <b>
              Each has a vertical asymptote; determine signs from each
              denominator.
            </b>
          )}
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <p>Explore how changing the asymptote changes f(x)=1/(x−a).</p>
          <label>
            Move the asymptote (a):{" "}
            <input
              aria-label="Asymptote position"
              type="range"
              min="-5"
              max="5"
              step=".25"
              value={draftA}
              onInput={(e) => setDraftA(Number(e.currentTarget.value))}
            />
            <output>a = {fmt(draftA, 2)}</output>
          </label>
          <div>
            <label>
              <input
                type="checkbox"
                checked={asymptote}
                onChange={(e) => setAsymptote(e.target.checked)}
              />{" "}
              Show asymptote
            </label>
            <label>
              <input
                type="checkbox"
                checked={grid}
                onChange={(e) => setGrid(e.target.checked)}
              />{" "}
              Show grid
            </label>
          </div>
          <button onClick={applyA}>
            <RotateCcw /> Update graph
          </button>
        </article>
      </section>
      <nav className="id-adjacent">
        <button>← Previous: Jump Discontinuity</button>
        <button>Next: Differentiability versus Continuity →</button>
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
