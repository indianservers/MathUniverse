import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Eye,
  Hand,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SeriesExpansionsTargetLesson442.css";
type Fn = "exp" | "sin" | "cos";
type Feedback = "idle" | "correct" | "incorrect";
export default function SeriesExpansionsTargetLesson442({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [fn, setFn] = useState<Fn>("exp"),
    [center, setCenter] = useState(0),
    [degree, setDegree] = useState(6),
    [tab, setTab] = useState("CAS Workspace"),
    [actions, setActions] = useState(0),
    [practice, setPractice] = useState(""),
    [feedback, setFeedback] = useState<Feedback>("idle"),
    [showSolution, setShowSolution] = useState(false);
  const model = useMemo(
      () => seriesModel(fn, center, degree),
      [fn, center, degree],
    ),
    practiceExpected = taylorValue("exp", 0, 5, 0.7);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(() => {
    setFn("exp");
    setCenter(0);
    setDegree(6);
    setTab("CAS Workspace");
    setActions(0);
    setPractice("");
    setFeedback("idle");
    setShowSolution(false);
  }, [resetToken]);
  const check = () =>
    act(() =>
      setFeedback(
        Math.abs(Number(practice) - practiceExpected) < 0.00001
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="se442-page"
      data-testid="symbolic-cas-mockup-0348"
      data-dedicated-lesson="442"
      data-object-model="taylor-derivative-cycle-center-degree-approximation-error-graph-practice"
      data-function={fn}
      data-center={center}
      data-degree={degree}
      data-value={model.approxAtOne}
      data-error={model.errorAtOne}
      data-actions={actions}
      data-feedback={feedback}
    >
      <h2 className="sr-only">Series Expansions</h2>
      <section className="se442-flow">
        {[
          [Eye, "1 Observe", "See the function and its series approximation."],
          [
            Hand,
            "2 Manipulate",
            "Change center and degree. Watch terms and graph update.",
          ],
          [Lightbulb, "3 Notice", "Compare curves and track the error band."],
          [
            Brain,
            "4 Understand",
            "Build intuition for series accuracy and limits.",
          ],
        ].map(([Icon, title, text], i) => (
          <article key={String(title)}>
            <Icon />
            <span>
              <b>{String(title)}</b>
              <p>{String(text)}</p>
            </span>
            {i < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <nav className="se442-tabs">
        {[
          "CAS Workspace",
          "Explain",
          "Examples",
          "Formulas",
          "Misconceptions",
          "Practice",
        ].map((name, index) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            data-lesson-control={`series-tab-${index}`}
            onClick={() => act(() => setTab(name))}
          >
            {index === 0 && <Eye />}
            {name}
          </button>
        ))}
      </nav>
      <section className="se442-builder">
        <header>
          <span>
            <h2>Taylor / Maclaurin Builder</h2>
            <p>
              Build the series, view terms, and see the approximation with
              error.
            </p>
          </span>
          <strong>
            <Check /> All systems go
          </strong>
        </header>
        <div className="se442-controls">
          <label>
            Function f(x)
            <select
              data-lesson-control="series-function"
              value={fn}
              onChange={(e) => act(() => setFn(e.target.value as Fn))}
            >
              <option value="exp">e^x</option>
              <option value="sin">sin(x)</option>
              <option value="cos">cos(x)</option>
            </select>
          </label>
          <label>
            Center a
            <input
              type="number"
              data-lesson-control="series-center"
              value={center}
              onChange={(e) => act(() => setCenter(Number(e.target.value)))}
            />
          </label>
          <label>
            Degree n
            <input
              type="range"
              min="0"
              max="12"
              data-lesson-control="series-degree"
              value={degree}
              onChange={(e) => act(() => setDegree(Number(e.target.value)))}
            />
            <output>{degree}</output>
          </label>
        </div>
        <section className="se442-formula">
          <article>
            <h3>Taylor Series about a</h3>
            <strong>f(x) = Σ f^(k)(a)/k! · (x-a)^k</strong>
          </article>
          <article>
            <h3>Your series (n = {degree})</h3>
            <strong>{seriesText(model.coefficients, center, degree)}</strong>
          </article>
        </section>
        <div className="se442-main">
          <article className="terms">
            <h3>Series terms up to degree {degree}</h3>
            {model.coefficients.map((coefficient, k) => (
              <p key={k}>
                k={k}: &nbsp; {termText(coefficient, k, center)}
              </p>
            ))}
            <footer>
              T{degree}(x) = {seriesText(model.coefficients, center, degree)}
            </footer>
          </article>
          <section className="plot">
            <h3>Function and approximation</h3>
            <SeriesGraph
              fn={fn}
              center={center}
              coefficients={model.coefficients}
            />
            <footer>
              Window x∈[-4,4] &nbsp; Error max ≈ {model.maxError.toFixed(4)}
            </footer>
          </section>
          <aside>
            <article>
              <h3>Immediate feedback</h3>
              <p>
                <Check /> Your approximation is very close near x={center}.
              </p>
              <b>At x=1</b>
              <p>f(1)={model.exactAtOne.toFixed(7)}</p>
              <p>
                T{degree}(1)={model.approxAtOne.toFixed(7)}
              </p>
              <p>|R|≈{model.errorAtOne.toFixed(7)}</p>
            </article>
            <article>
              <h3>Key rule (remainder)</h3>
              <p>Rₙ(x)=f^(n+1)(ξ)/(n+1)! · (x-a)^(n+1)</p>
            </article>
            <article>
              <h3>Rule of thumb</h3>
              <p>Smaller |x-a| and higher n gives smaller error.</p>
            </article>
            <article>
              <h3>What's happening?</h3>
              <p>
                As degree increases, the approximation matches over a wider
                interval.
              </p>
            </article>
          </aside>
        </div>
      </section>
      <section className="se442-learn">
        <article>
          <h3>Worked example</h3>
          <p>Approximate e^0.5 using n=4.</p>
          <strong>T₄(0.5)=1+0.5+0.5²/2!+0.5³/3!+0.5⁴/4!</strong>
          <output>{taylorValue("exp", 0, 4, 0.5).toFixed(7)}</output>
        </article>
        <article className="misconception">
          <h3>
            <TriangleAlert /> Common misconception
          </h3>
          <p>
            Increasing terms does not improve accuracy everywhere. Series are
            local approximations; check the error band and interval around a.
          </p>
        </article>
      </section>
      <section className="se442-practice">
        <header>
          <h3>Practice challenge</h3>
          <p>Compute T₅(0.7) for e^x about a=0.</p>
        </header>
        <div>
          <label>
            Enter numeric answer
            <input
              data-lesson-control="series-practice-answer"
              value={practice}
              onChange={(e) => setPractice(e.target.value)}
            />
          </label>
          <button data-lesson-control="series-practice-check" onClick={check}>
            Check answer
          </button>
          <article>
            <b>Target value</b>
            <p>e^0.7 = {Math.exp(0.7).toFixed(7)}</p>
          </article>
          <article>
            <b>Your result</b>
            <p>{practice || "—"}</p>
          </article>
          <article>
            <b>Error</b>
            <p>
              {practice
                ? Math.abs(Number(practice) - Math.exp(0.7)).toFixed(7)
                : "—"}
            </p>
          </article>
        </div>
        <footer>
          <span>Hint: Use T₅(x)=Σ x^k/k!</span>
          <button
            data-lesson-control="series-solution"
            onClick={() => act(() => setShowSolution((v) => !v))}
          >
            View solution
          </button>
        </footer>
        {showSolution && <em>T₅(0.7)={practiceExpected.toFixed(7)}</em>}
        {feedback !== "idle" && (
          <strong className={feedback}>
            {feedback === "correct"
              ? "Correct approximation."
              : "Add terms through k=5."}
          </strong>
        )}
      </section>
      <nav className="se442-nav">
        <a href="/lessons/symbolic-mathematics/441-limits">
          <ArrowLeft />
          <span>
            <small>Previous</small>Limits
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/443-differential-equations">
          <span>
            <small>Next</small>Differential Equations
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function SeriesGraph({
  fn,
  center,
  coefficients,
}: {
  fn: Fn;
  center: number;
  coefficients: number[];
}) {
  const sx = (x: number) => 210 + x * 45,
    sy = (y: number) => 170 - y * 10,
    points = (f: (x: number) => number) =>
      Array.from({ length: 121 }, (_, i) => {
        const x = -4 + i / 15,
          y = Math.max(-14, Math.min(24, f(x)));
        return `${i ? "L" : "M"}${sx(x)} ${sy(y)}`;
      }).join(" ");
  return (
    <svg
      viewBox="0 0 420 330"
      role="img"
      aria-label="Function, Taylor approximation, and error band"
    >
      <g stroke="#e1e8ef">
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => (
          <line key={x} x1={sx(x)} y1="20" x2={sx(x)} y2="310" />
        ))}
        {[-10, 0, 10, 20].map((y) => (
          <line key={y} x1="20" y1={sy(y)} x2="400" y2={sy(y)} />
        ))}
      </g>
      <line x1="20" y1={sy(0)} x2="400" y2={sy(0)} stroke="#59677a" />
      <line x1={sx(0)} y1="20" x2={sx(0)} y2="310" stroke="#59677a" />
      <path
        d={points((x) => fnValue(fn, x))}
        fill="none"
        stroke="#0875e0"
        strokeWidth="3"
      />
      <path
        d={points((x) => evaluateSeries(coefficients, center, x))}
        fill="none"
        stroke="#7b38db"
        strokeWidth="3"
      />
      <circle
        cx={sx(center)}
        cy={sy(fnValue(fn, center))}
        r="5"
        fill="#14213d"
      />
    </svg>
  );
}
function seriesModel(fn: Fn, center: number, degree: number) {
  const coefficients = Array.from(
      { length: degree + 1 },
      (_, k) => derivativeValue(fn, k, center) / factorial(k),
    ),
    exactAtOne = fnValue(fn, 1),
    approxAtOne = evaluateSeries(coefficients, center, 1),
    errors = Array.from({ length: 81 }, (_, i) => {
      const x = -4 + i / 10;
      return Math.abs(fnValue(fn, x) - evaluateSeries(coefficients, center, x));
    });
  return {
    coefficients,
    exactAtOne,
    approxAtOne,
    errorAtOne: Math.abs(exactAtOne - approxAtOne),
    maxError: Math.max(...errors.filter(Number.isFinite)),
  };
}
function derivativeValue(fn: Fn, k: number, x: number) {
  if (fn === "exp") return Math.exp(x);
  if (fn === "sin")
    return [Math.sin(x), Math.cos(x), -Math.sin(x), -Math.cos(x)][k % 4];
  return [Math.cos(x), -Math.sin(x), -Math.cos(x), Math.sin(x)][k % 4];
}
function fnValue(fn: Fn, x: number) {
  return fn === "exp" ? Math.exp(x) : fn === "sin" ? Math.sin(x) : Math.cos(x);
}
function factorial(n: number) {
  let value = 1;
  for (let i = 2; i <= n; i++) value *= i;
  return value;
}
function evaluateSeries(coefficients: number[], center: number, x: number) {
  return coefficients.reduce(
    (sum, c, k) => sum + c * Math.pow(x - center, k),
    0,
  );
}
function taylorValue(fn: Fn, center: number, degree: number, x: number) {
  return evaluateSeries(
    seriesModel(fn, center, degree).coefficients,
    center,
    x,
  );
}
function termText(c: number, k: number, a: number) {
  return `${trim(c)}${k ? `(x${a ? `${a < 0 ? "+" : "-"}${Math.abs(a)}` : ""})^${k}` : ""}`;
}
function seriesText(coefficients: number[], center: number, degree: number) {
  return (
    coefficients
      .slice(0, Math.min(degree + 1, 7))
      .map((c, k) => termText(c, k, center))
      .join(" + ") + (degree > 6 ? " + …" : "")
  );
}
function trim(value: number) {
  return String(Number(value.toFixed(5)));
}
