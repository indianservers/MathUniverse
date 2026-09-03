import {
  ChevronLeft,
  ChevronRight,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ParameterEstimationTargetLesson612.css";

type Point = { x: number; y: number };
const noise = [
  -5, 8, -9, 6, -8, 11, -4, 5, -12, 7, 3, -6, 12, -3, 6, -8, 9, 2, -11, 8, -5,
  10, -7, 4, -12, 6, -2, 11, -6, 8, 13, -9,
];
const makePoints = (): Point[] =>
  noise.map((n, i) => ({
    x: -12 + (24 * i) / 31,
    y: 3.7 * (-12 + (24 * i) / 31) + 10.4 + n,
  }));
const regress = (points: Point[]) => {
  const n = points.length,
    mx = points.reduce((s, p) => s + p.x, 0) / n,
    my = points.reduce((s, p) => s + p.y, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.x - mx) ** 2, 0),
    slope = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / sxx;
  return { slope, intercept: my - slope * mx, mx, sxx };
};
const f = (n: number, d = 2) => n.toFixed(d);
export default function ParameterEstimationTargetLesson612({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(makePoints),
    [slope, setSlope] = useState(4),
    [intercept, setIntercept] = useState(10),
    [drag, setDrag] = useState<number | null>(null),
    [tab, setTab] = useState("Interact"),
    [am, setAm] = useState(""),
    [ab, setAb] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPoints(makePoints());
    setSlope(4);
    setIntercept(10);
    setDrag(null);
    setTab("Interact");
    setAm("");
    setAb("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const fit = useMemo(() => regress(points), [points]),
    residuals = points.map((p) => p.y - (slope * p.x + intercept)),
    sse = residuals.reduce((s, v) => s + v * v, 0),
    rmse = Math.sqrt(sse / points.length),
    mean = points.reduce((s, p) => s + p.y, 0) / points.length,
    sst = points.reduce((s, p) => s + (p.y - mean) ** 2, 0),
    r2 = 1 - sse / sst,
    se = Math.sqrt(sse / (points.length - 2)),
    sm = (2.042 * se) / Math.sqrt(fit.sxx),
    bm = 2.042 * se * Math.sqrt(1 / points.length + fit.mx ** 2 / fit.sxx);
  const px = (x: number) => 35 + ((x + 12) / 24) * 405,
    py = (y: number) => 230 - ((y + 40) / 140) * 230,
    ry = (y: number) => 338 - (y / 40) * 42;
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const r = e.currentTarget.getBoundingClientRect(),
      y = 100 - ((e.clientY - r.top) / r.height) * 140;
    act(() =>
      setPoints((ps) =>
        ps.map((p, i) =>
          i === drag ? { ...p, y: Math.max(-40, Math.min(100, y)) } : p,
        ),
      ),
    );
  };
  const challenge = [
      [-2, -1.2],
      [-1, 0.6],
      [0, 2.8],
      [1, 5.4],
      [2, 7.6],
      [3, 10.9],
    ],
    cf = regress(challenge.map(([x, y]) => ({ x, y })));
  const check = () =>
    act(() =>
      setGraded(
        Math.abs(Number(am) - cf.slope) < 0.006 &&
          Math.abs(Number(ab) - cf.intercept) < 0.006,
      ),
    );
  return (
    <section
      className="pe612-page"
      data-testid="finance-mockup-0669"
      data-object-model="dedicated-draggable-observations-least-squares-confidence-model"
      data-slope={f(slope, 3)}
      data-intercept={f(intercept, 3)}
      data-fit-slope={f(fit.slope, 3)}
      data-fit-intercept={f(fit.intercept, 3)}
      data-sse={f(sse)}
      data-rmse={f(rmse)}
      data-r2={f(r2, 3)}
      data-points={points.length}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pe612-hero">
        <div>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </div>
        <h1>Parameter Estimation</h1>
        <p>Fit a model to data by estimating the best parameters.</p>
        <dl>
          <span>
            Level<b>Intermediate–Advanced</b>
          </span>
          <span>
            Lab Type<b>Parameter Estimation</b>
          </span>
          <span>
            Estimated Time<b>10–12 min</b>
          </span>
          <span>⚑ &nbsp; English (English)</span>
        </dl>
        <nav>
          {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
            (n) => (
              <button
                key={n}
                className={tab === n ? "active" : ""}
                onClick={() => act(() => setTab(n))}
              >
                {n}
              </button>
            ),
          )}
        </nav>
      </header>
      {tab !== "Interact" && (
        <p className="pe612-note">
          <b>{tab}:</b> Least squares minimizes the sum of squared residuals.
        </p>
      )}
      <b className="pe612-kicker">LEARNING SEQUENCE</b>
      <ol className="pe612-sequence">
        {[
          ["Observe", "Explore the data"],
          ["Manipulate", "Adjust parameters"],
          ["Notice the pattern", "Minimize error"],
          ["Understand the rule", "Best-fit line"],
          ["Try independently", "Answer challenge"],
        ].map(([a, b], i) => (
          <li key={a}>
            <i>{i + 1}</i>
            <span>
              <b>{a}</b>
              <small>{b}</small>
            </span>
            {i < 4 && <ChevronRight />}
          </li>
        ))}
      </ol>
      <section className="pe612-lab">
        <article className="pe612-chart">
          <header>
            <h2>Observed data with current model</h2>
            <span>
              Drag points to explore <Info />
            </span>
          </header>
          <svg
            viewBox="0 0 475 380"
            aria-label="Draggable observed data and residual graph"
            onPointerMove={move}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                className="grid"
                key={y}
                x1="35"
                x2="440"
                y1={py(y)}
                y2={py(y)}
              />
            ))}
            {[-10, -5, 0, 5, 10].map((x) => (
              <g key={x}>
                <line className="grid" x1={px(x)} x2={px(x)} y1="30" y2="235" />
                <text x={px(x) - 6} y="252">
                  {x}
                </text>
              </g>
            ))}
            <line className="axis" x1="35" x2="440" y1={py(0)} y2={py(0)} />
            <line className="axis" x1="35" x2="35" y1="30" y2="235" />
            <g className="legend">
              <circle cx="57" cy="48" r="4" />
              <text x="72" y="51">
                Observed data
              </text>
              <line x1="51" x2="65" y1="67" y2="67" />
              <text x="72" y="70">
                Model: y = mx + b
              </text>
            </g>
            <line
              className="model"
              x1={px(-12)}
              y1={py(slope * -12 + intercept)}
              x2={px(12)}
              y2={py(slope * 12 + intercept)}
            />
            {points.map((p, i) => (
              <circle
                className="point"
                key={i}
                cx={px(p.x)}
                cy={py(p.y)}
                r="3.5"
                onPointerDown={() => setDrag(i)}
              />
            ))}
            <text className="res-title" x="35" y="280">
              Residuals (observed − predicted)
            </text>
            <line
              className="axis dash"
              x1="35"
              x2="440"
              y1={ry(0)}
              y2={ry(0)}
            />
            {residuals.map((v, i) => (
              <circle
                className="residual"
                key={i}
                cx={px(points[i].x)}
                cy={ry(Math.max(-40, Math.min(40, v)))}
                r="2.8"
              />
            ))}
          </svg>
          <dl>
            {[
              ["n (points)", points.length],
              ["SSE", f(sse)],
              ["RMSE", f(rmse)],
              ["R²", f(r2, 3)],
              ["Std. error (sₑ)", f(se)],
            ].map(([a, b]) => (
              <span key={a}>
                <small>{a}</small>
                <b>{b}</b>
              </span>
            ))}
          </dl>
          <output className={r2 > 0.85 ? "good" : ""}>
            ✓ &nbsp;{" "}
            {r2 > 0.85
              ? "Great fit! You’re close to the best-fit model."
              : "Keep adjusting to reduce squared error."}
          </output>
        </article>
        <article className="pe612-controls">
          <h2>Adjust model parameters</h2>
          <p>Drag the sliders to change the line.</p>
          <h3>
            Model: <i>y = mx + b</i>
          </h3>
          {[
            ["Slope (m)", "Slope", slope, -5, 10, setSlope],
            ["Intercept (b)", "Intercept", intercept, -50, 50, setIntercept],
          ].map(([title, name, value, min, max, setter]) => (
            <label key={String(name)}>
              <b>{String(title)}</b>
              <span>
                <input
                  aria-label={`${name} slider`}
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={name === "Slope" ? 0.1 : 1}
                  value={Number(value)}
                  onChange={(e) =>
                    act(() =>
                      (setter as React.Dispatch<React.SetStateAction<number>>)(
                        Number(e.target.value),
                      ),
                    )
                  }
                />
                <small>
                  {String(min)} <i />
                  {String(max)}
                </small>
                <input
                  aria-label={String(name)}
                  type="number"
                  value={Number(value)}
                  onChange={(e) =>
                    act(() =>
                      (setter as React.Dispatch<React.SetStateAction<number>>)(
                        Number(e.target.value),
                      ),
                    )
                  }
                />
              </span>
            </label>
          ))}
          <section>
            <h3>Best-fit suggestion</h3>
            <p>Compute the least-squares line.</p>
            <button
              onClick={() =>
                act(() => {
                  setSlope(Number(fit.slope.toFixed(3)));
                  setIntercept(Number(fit.intercept.toFixed(3)));
                })
              }
            >
              <Sparkles /> Suggest Best Fit
            </button>
            <strong>
              m* = {f(fit.slope, 3)}
              <br />
              b* = {f(fit.intercept, 3)}
            </strong>
          </section>
          <section>
            <h3>Uncertainty (95% CI)</h3>
            <p>Based on the residual standard error.</p>
            <strong>
              m ∈ [{f(fit.slope - sm, 3)}, {f(fit.slope + sm, 3)}]<br />b ∈ [
              {f(fit.intercept - bm, 3)}, {f(fit.intercept + bm, 3)}]
            </strong>
            <aside>
              <Info /> Narrower intervals mean more certainty.
            </aside>
          </section>
          <button className="reset" onClick={() => act(reset)}>
            <RotateCcw /> Reset model
          </button>
        </article>
      </section>
      <section className="pe612-theory">
        <article>
          <h2>▣ &nbsp; Worked Example (Solution)</h2>
          <p>Given data (n = 5) and model y = mx + b.</p>
          <table>
            <tbody>
              {[
                [-2, 1],
                [-1, 2],
                [0, 1],
                [1, 4],
                [2, 6],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Using least squares:</p>
          <strong>
            m* = 2.100, &nbsp; b* = 1.400
            <br />
            Model: ŷ = 2.100x + 1.400
            <br />
            <br />
            SSE = 0.800, RMSE = 0.400
            <br />
            R² = 0.980
          </strong>
        </article>
        <article>
          <h2>♧ &nbsp; Key Rule / Definition</h2>
          <p>The least-squares line ŷ = mx + b minimizes</p>
          <strong>SSE = Σ [yᵢ − (mxᵢ + b)]²</strong>
          <p>Closed-form formulas:</p>
          <strong>
            m* = [nΣxy − (Σx)(Σy)] / [nΣx² − (Σx)²]
            <br />
            <br />
            b* = ȳ − m*x̄
          </strong>
          <aside>
            <Info /> R² measures variance explained by the model.
          </aside>
        </article>
        <article>
          <h2>⬢ &nbsp; Common Misconception</h2>
          <h3>Minimizing vertical distances only.</h3>
          <p>Some think minimizing Σ|yᵢ − ŷᵢ| gives the same line.</p>
          <h3>Why it’s misleading:</h3>
          <p>
            Least absolute deviations produces a different line and has
            different statistical properties.
          </p>
          <aside>
            Tip: Use least squares for a principled, stable best-fit line.
          </aside>
        </article>
      </section>
      <section className="pe612-challenge">
        <header>
          <h2>Try This Challenge</h2>
          <p>Estimate slope m and intercept b (round to 2 d.p.).</p>
        </header>
        <table>
          <tbody>
            <tr>
              <th>x</th>
              {challenge.map((r) => (
                <td key={r[0]}>{r[0]}</td>
              ))}
            </tr>
            <tr>
              <th>y</th>
              {challenge.map((r) => (
                <td key={r[0]}>{r[1]}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <div>
          <label>
            m
            <input
              aria-label="Challenge slope"
              value={am}
              onChange={(e) => act(() => setAm(e.target.value))}
            />
          </label>
          <label>
            b
            <input
              aria-label="Challenge intercept"
              value={ab}
              onChange={(e) => act(() => setAb(e.target.value))}
            />
          </label>
          <button onClick={check}>Check Answer</button>
          {graded !== null && (
            <output className={graded ? "correct" : ""}>
              {graded
                ? "Correct: m = 2.40, b = 3.15"
                : "Recalculate the estimates."}
            </output>
          )}
        </div>
      </section>
      <nav className="pe612-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/611-piecewise-models">
          <ChevronLeft />
          <span>
            <b>Previous Lesson</b>Piecewise Models
          </span>
        </a>
        <span>Lesson 3 of 22</span>
        <a href="/lessons/discrete-and-applied-mathematics/613-dimensional-analysis">
          <span>
            <b>Next Lesson</b>Dimensional Analysis
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
