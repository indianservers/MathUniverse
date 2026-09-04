import { ChevronDown, Play } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RollesTheoremTargetLesson10172.css";

const f = (x: number) => x * x - 4 * x + 3,
  fmt = (n: number) => Number(n.toFixed(3));
export default function RollesTheoremTargetLesson10172({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(1),
    [b, setB] = useState(3),
    [tangent, setTangent] = useState(true),
    [fail, setFail] = useState(1),
    [practice, setPractice] = useState(false);
  const [qa, setQa] = useState(1),
    [qb, setQb] = useState(-6),
    [qc, setQc] = useState(8),
    [a0, setA0] = useState(1),
    [b0, setB0] = useState(5),
    [solved, setSolved] = useState(false);
  const equal = Math.abs(f(a) - f(b)) < 1e-8,
    c = 2,
    inside = c > a && c < b,
    eligible = equal && inside;
  const secant = (f(b) - f(a)) / (b - a);
  const curve = useMemo(
    () =>
      Array.from({ length: 101 }, (_, i) => {
        const x = (i * 4) / 100;
        return `${80 + x * 100},${250 - f(x) * 75}`;
      }).join(" "),
    [],
  );
  const setEnd = (side: "a" | "b", n: number) =>
    side === "a"
      ? setA(Math.max(-1, Math.min(b - 0.1, n)))
      : setB(Math.min(5, Math.max(a + 0.1, n)));
  const keyEnd = (side: "a" | "b") => (e: KeyboardEvent<SVGCircleElement>) => {
    const n = side === "a" ? a : b;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setEnd(side, n - 0.1);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setEnd(side, n + 0.1);
  };
  const dragEnd =
    (side: "a" | "b") => (e: ReactPointerEvent<SVGCircleElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = e.currentTarget.ownerSVGElement!;
      const move = (ev: PointerEvent) =>
        setEnd(
          side,
          ((ev.clientX - svg.getBoundingClientRect().left) /
            svg.getBoundingClientRect().width) *
            6 -
            0.8,
        );
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };
  const root = qa !== 0 ? -qb / (2 * qa) : NaN,
    q = (x: number) => qa * x * x + qb * x + qc,
    qEqual = Math.abs(q(a0) - q(b0)) < 1e-8,
    qVerified = Number.isFinite(root) && root > a0 && root < b0 && qEqual;
  return (
    <main
      className="rt10172-page"
      data-testid="school-mockup-0846"
      data-object-model="dedicated-rolle-endpoint-stationary-point-engine"
      data-interval={`[${fmt(a)}, ${fmt(b)}]`}
      data-endpoints-equal={String(equal)}
      data-eligible={String(eligible)}
      data-c={eligible ? String(c) : "none"}
      data-secant={String(fmt(secant))}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Rolle's Theorem</h1>
        <p>
          Consider <b>f(x)=x²−4x+3</b> on the interval [{fmt(a)}, {fmt(b)}].
          <br />
          Verify Rolle's Theorem and find c such that f'(c)=0.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>graph</span>
          <span>interactive</span>
        </div>
      </header>
      <section className="rt-explorer">
        <h3>1. VISUAL EXPLORER</h3>
        <div>
          <article>
            <h2>f(x)=x²−4x+3</h2>
            <svg viewBox="0 0 560 390" aria-label="Rolle theorem graph">
              <defs>
                <pattern
                  id="rtgrid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M50 0H0V50" fill="none" stroke="#dde6eb" />
                </pattern>
              </defs>
              <rect width="560" height="390" fill="url(#rtgrid)" />
              <path d="M20 250H540M80 20V375" stroke="#263548" />
              <polyline
                points={curve}
                fill="none"
                stroke="#7544ed"
                strokeWidth="3"
              />
              <line
                x1={80 + a * 100}
                y1={250 - f(a) * 75}
                x2={80 + b * 100}
                y2={250 - f(b) * 75}
                stroke="#e2a12b"
                strokeWidth="2"
                strokeDasharray="6"
              />
              {tangent && inside && (
                <path
                  d="M250 325H390"
                  stroke="#19a6ec"
                  strokeWidth="3"
                  strokeDasharray="7"
                />
              )}
              <circle
                role="slider"
                aria-label="Left interval endpoint"
                tabIndex={0}
                onPointerDown={dragEnd("a")}
                onKeyDown={keyEnd("a")}
                cx={80 + a * 100}
                cy={250 - f(a) * 75}
                r="8"
                fill="#7043d5"
              />
              <circle
                role="slider"
                aria-label="Right interval endpoint"
                tabIndex={0}
                onPointerDown={dragEnd("b")}
                onKeyDown={keyEnd("b")}
                cx={80 + b * 100}
                cy={250 - f(b) * 75}
                r="8"
                fill="#7043d5"
              />
              <circle cx="280" cy="325" r="8" fill="#7043d5" />
              <text x={88 + a * 100} y={240 - f(a) * 75}>
                ({fmt(a)}, {fmt(f(a))})
              </text>
              <text x={88 + b * 100} y={240 - f(b) * 75}>
                ({fmt(b)}, {fmt(f(b))})
              </text>
              <text x="290" y="350">
                (2, -1)
              </text>
            </svg>
            <div className="rt-legend">
              <b>━ f(x)=x²−4x+3</b>
              <b>● Vertex (2,-1)</b>
              <b>-- Horizontal tangent at c=2</b>
            </div>
          </article>
          <aside>
            <section>
              <h3>DRAG ENDPOINTS (a,b)</h3>
              <label>
                a = {fmt(a)}
                <input
                  aria-label="Left endpoint a"
                  type="range"
                  min="-1"
                  max={b - 0.1}
                  step=".1"
                  value={a}
                  onInput={(e) => setEnd("a", Number(e.currentTarget.value))}
                />
              </label>
              <label>
                b = {fmt(b)}
                <input
                  aria-label="Right endpoint b"
                  type="range"
                  min={a + 0.1}
                  max="5"
                  step=".1"
                  value={b}
                  onInput={(e) => setEnd("b", Number(e.currentTarget.value))}
                />
              </label>
            </section>
            <section>
              <h3>INTERVAL</h3>
              <strong>
                [a,b]=[{fmt(a)}, {fmt(b)}]
              </strong>
            </section>
            <section>
              <h3>KEY VALUES</h3>
              <p>
                f(a)={fmt(f(a))}{" "}
                <b className={equal ? "yes" : "no"}>{equal ? "=" : "≠"}</b>{" "}
                f(b)={fmt(f(b))}
              </p>
              <p>f(2)=-1</p>
              <p>f'(x)=2x−4</p>
              <p>f'(2)=0</p>
            </section>
            <button onClick={() => setTangent((v) => !v)}>
              <Play /> {tangent ? "Hide" : "Animate"} Secant → Tangent
            </button>
          </aside>
        </div>
      </section>
      <section className="rt-check">
        <article>
          <h3>2. ROLLE'S THEOREM CHECKER</h3>
          <p>
            Check the three conditions for f on [{fmt(a)}, {fmt(b)}].
          </p>
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Check</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>f is continuous on [a,b].</td>
                <td>☑</td>
                <td className="yes">✓ Holds</td>
                <td>Polynomial is continuous on ℝ.</td>
              </tr>
              <tr>
                <td>f is differentiable on (a,b).</td>
                <td>☑</td>
                <td className="yes">✓ Holds</td>
                <td>Polynomial is differentiable on ℝ.</td>
              </tr>
              <tr>
                <td>f(a)=f(b).</td>
                <td>{equal ? "☑" : "☒"}</td>
                <td className={equal ? "yes" : "no"}>
                  {equal ? "✓ Holds" : "✕ Fails"}
                </td>
                <td>
                  {fmt(f(a))} {equal ? "=" : "≠"} {fmt(f(b))}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={eligible ? "ok" : "bad"}>
            <h3>ELIGIBILITY STATUS</h3>
            <b>
              {eligible
                ? "All three conditions are satisfied. Rolle's Theorem applies."
                : "The endpoint condition fails, so the theorem does not apply."}
            </b>
            <strong>{eligible ? "✓" : "✕"}</strong>
          </div>
        </article>
        <article>
          <h3>3. FROM SECANT TO HORIZONTAL TANGENT</h3>
          <p>The secant slope between (a,f(a)) and (b,f(b)) is:</p>
          <div>msec=(f(b)−f(a))/(b−a) = {fmt(secant)}</div>
          <p>Rolle's Theorem guarantees c only when the conditions hold.</p>
          <h3>DERIVATIVE</h3>
          <div>f'(x)=2x−4</div>
          <p>Solve 2x−4=0 ⇒ x=2.</p>
          <aside className={eligible ? "ok" : "bad"}>
            <b>
              {eligible
                ? "HORIZONTAL TANGENT AT c=2; f'(2)=0"
                : "No theorem guarantee on this interval."}
            </b>
          </aside>
        </article>
      </section>
      <section className="rt-proof">
        <article>
          <h3>4. WORKED PROOF</h3>
          <p>Let f(x)=x²−4x+3 on [1,3].</p>
          <p>1. A polynomial is continuous on the closed interval.</p>
          <p>2. A polynomial is differentiable on the open interval.</p>
          <p>3. f(1)=0=f(3).</p>
          <p>By Rolle's Theorem, some c∈(1,3) has f'(c)=0.</p>
          <p>Since f'(x)=2x−4, c=2.</p>
          <b>Therefore c=2 and f'(2)=0. Q.E.D.</b>
        </article>
        <article>
          <h3>5. WHAT IF A CONDITION FAILS?</h3>
          <div className="rt-fails">
            {[1, 2, 3].map((n) => (
              <button
                className={fail === n ? "active" : ""}
                onClick={() => setFail(n)}
                key={n}
              >
                Fail {n}
              </button>
            ))}
          </div>
          <p>
            {fail === 1
              ? "If f is not continuous, the theorem may fail even when endpoint values agree."
              : fail === 2
                ? "If f is not differentiable in the interior, a corner can prevent a horizontal tangent."
                : "If f(a)≠f(b), the secant is not horizontal and Rolle's conclusion is not guaranteed."}
          </p>
          <b>Failure example {fail}: the hypotheses matter.</b>
        </article>
      </section>
      <section className="rt-callouts">
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>Rolle's Theorem does not say f'(x)=0 for all x in (a,b).</b>
          <p>It guarantees at least one point c where f'(c)=0.</p>
        </article>
        <article>
          <h3>7. PRACTICE (CHECK YOUR UNDERSTANDING)</h3>
          <button onClick={() => setPractice((v) => !v)}>
            Show practice questions <ChevronDown />
          </button>
          {practice && (
            <p>
              Check whether each function is continuous, differentiable, and has
              equal endpoint values before finding c.
            </p>
          )}
        </article>
      </section>
      <section className="rt-solver">
        <article>
          <h3>8. TRY IT YOURSELF</h3>
          <p>Try Rolle's Theorem on another quadratic.</p>
          <div className="rt-inputs">
            <label>
              a
              <input
                aria-label="Quadratic a"
                type="number"
                value={qa}
                onChange={(e) => setQa(Number(e.target.value))}
              />
            </label>
            <label>
              b
              <input
                aria-label="Quadratic b"
                type="number"
                value={qb}
                onChange={(e) => setQb(Number(e.target.value))}
              />
            </label>
            <label>
              c
              <input
                aria-label="Quadratic c"
                type="number"
                value={qc}
                onChange={(e) => setQc(Number(e.target.value))}
              />
            </label>
            <label>
              a₀
              <input
                aria-label="Interval start"
                type="number"
                value={a0}
                onChange={(e) => setA0(Number(e.target.value))}
              />
            </label>
            <label>
              b₀
              <input
                aria-label="Interval end"
                type="number"
                value={b0}
                onChange={(e) => setB0(Number(e.target.value))}
              />
            </label>
          </div>
          <button onClick={() => setSolved(true)}>Check &amp; Solve</button>
        </article>
        <article className={solved && qVerified ? "ok" : "neutral"}>
          <h3>RESULT</h3>
          {solved ? (
            <>
              <p>
                f(a₀)={fmt(q(a0))}, f(b₀)={fmt(q(b0))}{" "}
                {qEqual ? "→ equal ✓" : "→ not equal ✕"}
              </p>
              <p>
                f'(x)={2 * qa}x+({qb})
              </p>
              <p>Stationary point c={fmt(root)}</p>
              <b>
                {qVerified
                  ? `Verified: c=${fmt(root)} and f'(c)=0.`
                  : "Rolle's conditions are not all satisfied."}
              </b>
            </>
          ) : (
            <p>Enter a quadratic and interval, then check.</p>
          )}
        </article>
        <article>
          <h3>GRAPH PREVIEW</h3>
          <svg viewBox="0 0 250 140">
            <path d="M15 110H235M100 10V130" stroke="#334155" />
            <path
              d="M35 25Q125 170 215 25"
              fill="none"
              stroke="#7544ed"
              strokeWidth="2"
            />
            <path d="M85 95H165" stroke="#20a4eb" strokeDasharray="5" />
          </svg>
          <b>c={fmt(root)}</b>
        </article>
      </section>
      <nav className="rt-adjacent">
        <button>← Mean Value Theorem</button>
        <button>Lagrange Mean Value Theorem →</button>
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
