import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AreaUnderCurveTargetLesson10184.css";

type Method = "left" | "right" | "mid";
const counts = [1, 4, 8, 16, 32, 64];
const fmt = (v: number, d = 4) => Number(v.toFixed(d));
function sum(fn: (x: number) => number, n: number, method: Method) {
  const dx = 2 / n;
  return Array.from({ length: n }, (_, i) => {
    const x =
      method === "left"
        ? i * dx
        : method === "right"
          ? (i + 1) * dx
          : (i + 0.5) * dx;
    return fn(x) * dx;
  }).reduce((a, b) => a + b, 0);
}
function bars(fn: (x: number) => number, n: number, method: Method) {
  const dx = 2 / n;
  return Array.from({ length: n }, (_, i) => {
    const x =
      method === "left"
        ? i * dx
        : method === "right"
          ? (i + 1) * dx
          : (i + 0.5) * dx;
    return { x0: i * dx, w: dx, x, y: fn(x) };
  });
}
export default function AreaUnderCurveTargetLesson10184({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(4),
    [method, setMethod] = useState<Method>("mid"),
    [playing, setPlaying] = useState(false);
  const [pn, setPn] = useState(4),
    [pmethod, setPmethod] = useState<Method>("left"),
    [pplaying, setPplaying] = useState(false);
  const [answer, setAnswer] = useState(""),
    [answerFeedback, setAnswerFeedback] = useState(""),
    [sign, setSign] = useState(""),
    [equal, setEqual] = useState(""),
    [conceptFeedback, setConceptFeedback] = useState("");
  const exact = 8 / 3,
    approx = sum((x) => x * x, n, method),
    error = approx - exact;
  const pexact = 16 / 3,
    papprox = sum((x) => 4 - x * x, pn, pmethod),
    perror = papprox - pexact;
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () =>
        setN((v) => {
          const i = counts.indexOf(v),
            next = counts[Math.min(i + 1, counts.length - 1)];
          if (next === 64) setPlaying(false);
          return next;
        }),
      450,
    );
    return () => clearInterval(id);
  }, [playing]);
  useEffect(() => {
    if (!pplaying) return;
    const id = window.setInterval(
      () =>
        setPn((v) => {
          const i = counts.indexOf(v),
            next = counts[Math.min(i + 1, counts.length - 1)];
          if (next === 64) setPplaying(false);
          return next;
        }),
      450,
    );
    return () => clearInterval(id);
  }, [pplaying]);
  const curve = useMemo(
    () =>
      Array.from({ length: 101 }, (_, i) => {
        const x = i / 50;
        return `${55 + x * 250},${270 - x * x * 54}`;
      }).join(" "),
    [],
  );
  const pcurve = useMemo(
    () =>
      Array.from({ length: 101 }, (_, i) => {
        const x = i / 50;
        return `${55 + x * 250},${270 - (4 - x * x) * 54}`;
      }).join(" "),
    [],
  );
  const reset = () => {
    setN(4);
    setMethod("mid");
    setPlaying(false);
  };
  const preset = () => {
    setPn(4);
    setPmethod("left");
    setPplaying(false);
  };
  const checkAnswer = () => {
    const v = Number(answer);
    setAnswerFeedback(
      answer.replace(/\s/g, "") === "16/3" || Math.abs(v - pexact) < 0.001
        ? "Correct: the exact area is 16/3."
        : "Integrate 4−x² from 0 to 2 and try again.",
    );
  };
  const checkConcept = () =>
    setConceptFeedback(
      sign === "positive" && equal === "yes"
        ? "Correct: the curve stays above the x-axis, so signed and geometric areas agree."
        : "Recheck whether 4−x² is below the x-axis on [0,2].",
    );
  const renderGraph = (practice = false) => {
    const f = practice ? (x: number) => 4 - x * x : (x: number) => x * x,
      nn = practice ? pn : n,
      m = practice ? pmethod : method,
      bb = bars(f, nn, m),
      path = practice ? pcurve : curve;
    return (
      <svg
        viewBox="0 0 360 300"
        aria-label={
          practice ? "Practice Riemann sum graph" : "Riemann sum graph"
        }
      >
        <path d="M40 270H335M55 18V285" stroke="#42546a" />
        {bb.map((b, i) => (
          <g key={i}>
            <rect
              x={55 + b.x0 * 125}
              y={270 - b.y * 54}
              width={Math.max(0.5, b.w * 125)}
              height={b.y * 54}
              fill="#cedcff"
              fillOpacity=".55"
              stroke="#ef4c85"
              strokeDasharray="4 2"
            />
            <circle
              cx={55 + b.x * 125}
              cy={270 - b.y * 54}
              r="2.4"
              fill="#d5145b"
            />
          </g>
        ))}
        <polyline
          points={path}
          fill="none"
          stroke="#126ae8"
          strokeWidth="2.5"
        />
        <text x="210" y="42">
          {practice ? "f(x)=4−x²" : "f(x)=x²"}
        </text>
      </svg>
    );
  };
  return (
    <main
      className="auc10184-page"
      data-testid="school-mockup-0858"
      data-object-model="dedicated-riemann-sum-convergence-engine"
      data-n={n}
      data-method={method}
      data-approximation={fmt(approx)}
      data-exact={fmt(exact)}
      data-error={fmt(error)}
      data-practice-n={pn}
      data-practice-approximation={fmt(papprox)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Area Under a Curve</h1>
        <p>
          Learn the Riemann-sum idea, see how rectangles approximate area, and
          discover the definite integral as the exact limit.
        </p>
        <div>
          <span>Class 12</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>Interactive Lab</span>
        </div>
      </header>
      <section className="auc-lab">
        <h3>INTERACTIVE LAB</h3>
        <h2>Riemann Sum to Integral</h2>
        <p>Explore f(x)=x² on [0,2].</p>
        <div className="auc-main">
          <aside>
            <article>
              <b>Function</b>
              <h2>f(x)=x²</h2>
            </article>
            <article>
              <b>Interval [a,b]</b>
              <h2>a=0 &nbsp;&nbsp; b=2</h2>
            </article>
            <label>
              <b>Number of rectangles (n)</b>
              <input
                aria-label="Main rectangle count"
                type="range"
                min="0"
                max="5"
                value={counts.indexOf(n)}
                onChange={(e) => setN(counts[Number(e.target.value)])}
              />
              <span>
                {counts.map((x) => (
                  <i className={x === n ? "active" : ""} key={x}>
                    {x}
                  </i>
                ))}
              </span>
            </label>
            <fieldset>
              <legend>Sample point xᵢ*</legend>
              {[
                ["left", "Left endpoints"],
                ["right", "Right endpoints"],
                ["mid", "Midpoints"],
              ].map(([v, t]) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="method"
                    checked={method === v}
                    onChange={() => setMethod(v as Method)}
                  />
                  {t}
                </label>
              ))}
            </fieldset>
            <div>
              <button onClick={() => setPlaying((v) => !v)}>
                {playing ? <Pause /> : <Play />}
                {playing ? "Pause" : "Animate n"}
              </button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
            </div>
          </aside>
          <article>
            {renderGraph()}
            <div className="auc-dx">
              Δx=(2−0)/{n}={fmt(2 / n, 3)}
            </div>
          </article>
        </div>
        <div className="auc-results">
          <article>
            <b>Riemann Sum (approx.)</b>
            <h2>{fmt(approx)}</h2>
          </article>
          <article>
            <b>Exact Integral</b>
            <h2>∫₀²x²dx=8/3≈2.6667</h2>
          </article>
          <article>
            <b>Error (signed)</b>
            <h2>{fmt(error)}</h2>
          </article>
          <article>
            <b>Error (absolute)</b>
            <h2>{fmt(Math.abs(error))}</h2>
          </article>
        </div>
      </section>
      <section className="auc-theory">
        <article>
          <h3>FORMULA</h3>
          <h4>Area under a curve on [a,b]</h4>
          <h2>Area=lim(n→∞) Σ f(xᵢ*)Δx = ∫ₐᵇf(x)dx</h2>
          <p>where Δx=(b−a)/n and xᵢ* is a sample point.</p>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Find the exact area of f(x)=x² on [0,2].</p>
          <h2>∫₀²x²dx=[x³/3]₀²=8/3≈2.6667</h2>
          <p>Our sums approach 8/3 as n increases.</p>
        </article>
        <article className="warn">
          <h3>IMPORTANT: SIGNED AREA vs GEOMETRIC AREA</h3>
          <p>
            Above the x-axis contributes positively; below contributes
            negatively.
          </p>
          <h2>Area geometric = ∫ₐᵇ|f(x)|dx</h2>
        </article>
        <article>
          <h3>When the curve crosses the x-axis</h3>
          <p>
            For f(x)=x on [−1,1], signed area is 0 while geometric area is 1.
          </p>
          <h2>Signed area cancels; geometric area adds.</h2>
        </article>
      </section>
      <section className="auc-practice">
        <h3>PRACTICE</h3>
        <p>Try y=4−x² on [0,2].</p>
        <div>
          <aside>
            <label>
              n
              <input
                aria-label="Practice rectangle count"
                type="range"
                min="0"
                max="5"
                value={counts.indexOf(pn)}
                onChange={(e) => setPn(counts[Number(e.target.value)])}
              />
            </label>
            {[
              ["left", "Left endpoints"],
              ["right", "Right endpoints"],
              ["mid", "Midpoints"],
            ].map(([v, t]) => (
              <label key={v}>
                <input
                  type="radio"
                  name="pmethod"
                  checked={pmethod === v}
                  onChange={() => setPmethod(v as Method)}
                />
                {t}
              </label>
            ))}
            <button onClick={() => setPplaying((v) => !v)}>
              {pplaying ? <Pause /> : <Play />}Animate n
            </button>
            <button onClick={preset}>
              <RotateCcw />
              Reset
            </button>
          </aside>
          <article>{renderGraph(true)}</article>
          <aside>
            <p>
              Riemann Sum: <b>{fmt(papprox)}</b>
            </p>
            <p>
              Exact Integral: <b>16/3≈5.3333</b>
            </p>
            <p>
              Signed Error: <b>{fmt(perror)}</b>
            </p>
          </aside>
        </div>
        <footer>
          <label>
            Exact Integral (Your Turn)
            <input
              aria-label="Exact integral answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={checkAnswer}>Check</button>
            {answerFeedback && <output>{answerFeedback}</output>}
          </label>
          <section>
            <label>
              Is the integral positive or negative?
              <select
                aria-label="Integral sign"
                value={sign}
                onChange={(e) => setSign(e.target.value)}
              >
                <option value="">Choose</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </select>
            </label>
            <label>
              Is geometric area equal to the integral?
              <select
                aria-label="Area equality"
                value={equal}
                onChange={(e) => setEqual(e.target.value)}
              >
                <option value="">Choose</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <button onClick={checkConcept}>Check concepts</button>
            {conceptFeedback && <output>{conceptFeedback}</output>}
          </section>
        </footer>
      </section>
      <nav className="auc-adjacent">
        <Link to="/lessons/school/class-12/class-12-formal-calculus-definite-integral-properties">
          ← Definite Integral Properties
        </Link>
        <Link to="/lessons/school/class-12/class-12-formal-calculus-area-between-curves">
          Area Between Curves →
        </Link>
      </nav>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <div>
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/documentation">Docs</Link>
          <Link to="/about">About</Link>
        </div>
      </footer>
    </main>
  );
}
