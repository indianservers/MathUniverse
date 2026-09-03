import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ResidualErrorTargetLesson615.css";
type Point = { x: number; y: number };
type Model = "linear" | "quadratic";
const initial: Point[] = [
  { x: 1, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 8 },
  { x: 4, y: 11 },
  { x: 5, y: 10 },
  { x: 6, y: 12 },
  { x: 7, y: 16 },
];
const solve3 = (m: number[][]) => {
  for (let i = 0; i < 3; i++) {
    let k = i;
    for (let j = i + 1; j < 3; j++)
      if (Math.abs(m[j][i]) > Math.abs(m[k][i])) k = j;
    [m[i], m[k]] = [m[k], m[i]];
    const p = m[i][i];
    for (let j = i; j < 4; j++) m[i][j] /= p;
    for (let r = 0; r < 3; r++)
      if (r !== i) {
        const q = m[r][i];
        for (let j = i; j < 4; j++) m[r][j] -= q * m[i][j];
      }
  }
  return [m[0][3], m[1][3], m[2][3]];
};
const quadFit = (ps: Point[]) => {
  const n = ps.length,
    s1 = ps.reduce((s, p) => s + p.x, 0),
    s2 = ps.reduce((s, p) => s + p.x ** 2, 0),
    s3 = ps.reduce((s, p) => s + p.x ** 3, 0),
    s4 = ps.reduce((s, p) => s + p.x ** 4, 0),
    sy = ps.reduce((s, p) => s + p.y, 0),
    sxy = ps.reduce((s, p) => s + p.x * p.y, 0),
    sx2y = ps.reduce((s, p) => s + p.x ** 2 * p.y, 0);
  return solve3([
    [s4, s3, s2, sx2y],
    [s3, s2, s1, sxy],
    [s2, s1, n, sy],
  ]);
};
const fixed = (n: number, d = 2) => n.toFixed(d);
export default function ResidualErrorTargetLesson615({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(initial),
    [model, setModel] = useState<Model>("linear"),
    [m, setM] = useState(2),
    [b, setB] = useState(1),
    [a, setA] = useState(0),
    [drag, setDrag] = useState<number | null>(null),
    [scale, setScale] = useState("auto"),
    [display, setDisplay] = useState({
      line: true,
      residuals: true,
      table: true,
      grid: true,
    }),
    [tab, setTab] = useState("Interact"),
    [practice, setPractice] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPoints(initial);
    setModel("linear");
    setM(2);
    setB(1);
    setA(0);
    setDrag(null);
    setScale("auto");
    setDisplay({ line: true, residuals: true, table: true, grid: true });
    setTab("Interact");
    setPractice(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const predict = (x: number) =>
      model === "linear" ? m * x + b : a * x * x + m * x + b,
    residuals = points.map((p) => p.y - predict(p.x)),
    sse = residuals.reduce((s, v) => s + v * v, 0),
    mae = residuals.reduce((s, v) => s + Math.abs(v), 0) / points.length,
    maxResidual =
      scale === "auto"
        ? Math.max(3, Math.ceil(Math.max(...residuals.map(Math.abs))))
        : 6,
    px = (x: number) => 35 + (x / 8) * 420,
    py = (y: number) => 250 - (y / 20) * 210;
  const curve = Array.from({ length: 81 }, (_, i) => i / 10)
    .map((x, i) => `${i ? "L" : "M"}${px(x)},${py(predict(x))}`)
    .join(" ");
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const rect = e.currentTarget.getBoundingClientRect(),
      y = 20 - ((e.clientY - rect.top) / rect.height) * 20;
    act(() =>
      setPoints((ps) =>
        ps.map((p, i) =>
          i === drag
            ? { ...p, y: Math.max(0, Math.min(20, Number(y.toFixed(1)))) }
            : p,
        ),
      ),
    );
  };
  const fitQuadratic = () =>
      act(() => {
        const [qA, qB, qC] = quadFit(points);
        setModel("quadratic");
        setA(Number(qA.toFixed(3)));
        setM(Number(qB.toFixed(3)));
        setB(Number(qC.toFixed(3)));
        setPractice(true);
      }),
    toggle = (key: keyof typeof display) =>
      act(() => setDisplay((v) => ({ ...v, [key]: !v[key] })));
  const pattern =
    residuals.slice(1, -1).some((v) => v > 0) &&
    residuals.filter((v) => v < 0).length >= 2;
  return (
    <section
      className="re615-page"
      data-testid="finance-mockup-0672"
      data-object-model="dedicated-draggable-linear-quadratic-residual-error-model"
      data-model={model}
      data-a={fixed(a, 3)}
      data-m={fixed(m, 3)}
      data-b={fixed(b, 3)}
      data-sse={fixed(sse)}
      data-mae={fixed(mae)}
      data-points={points.length}
      data-scale={scale}
      data-display={Object.entries(display)
        .filter(([, shown]) => shown)
        .map(([key]) => key)
        .join("|")}
      data-practice={practice}
      data-actions={actions}
    >
      <header className="re615-hero">
        <div>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </div>
        <h1>Residual and Error Analysis</h1>
        <p>
          <b>Objective:</b> Evaluate model quality by analysing residuals and
          error measures.
        </p>
        <dl>
          <span>Level: Intermediate–Advanced</span>
          <span>Lab Type: Applied Modelling Lab</span>
          <span>Duration: 6–10 min</span>
          <span>English (English)</span>
        </dl>
      </header>
      <nav className="re615-tabs">
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
      {tab !== "Interact" && (
        <p className="re615-note">
          <b>{tab}:</b> Residual equals observed minus predicted.
        </p>
      )}
      <section className="re615-lab">
        <header>
          <div>
            <h2>
              Observe → Manipulate → Notice the pattern → Understand → Try
              independently
            </h2>
            <p>
              Drag points to change the data. The model and residuals update
              instantly.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
        </header>
        <section className="re615-upper">
          <article>
            <h2>1. Data &amp; Fitted Model</h2>
            <svg
              viewBox="0 0 500 300"
              aria-label="Draggable fitted model graph"
              onPointerMove={move}
              onPointerUp={() => setDrag(null)}
              onPointerLeave={() => setDrag(null)}
            >
              {display.grid && (
                <>
                  {[0, 5, 10, 15, 20].map((y) => (
                    <line
                      className="grid"
                      key={`y${y}`}
                      x1="35"
                      x2="455"
                      y1={py(y)}
                      y2={py(y)}
                    />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                    <line
                      className="grid"
                      key={`x${x}`}
                      x1={px(x)}
                      x2={px(x)}
                      y1="40"
                      y2="250"
                    />
                  ))}
                </>
              )}
              <line className="axis" x1="35" x2="465" y1={py(0)} y2={py(0)} />
              <line className="axis" x1="35" x2="35" y1="35" y2="250" />
              <text className="formula" x="115" y="18">
                Model: ŷ = {model === "quadratic" ? `${fixed(a)}x² + ` : ""}
                {fixed(m)}x + {fixed(b)}
              </text>
              {display.line && <path className="fit" d={curve} />}{" "}
              {points.map((p, i) => (
                <circle
                  className="observed"
                  key={i}
                  cx={px(p.x)}
                  cy={py(p.y)}
                  r="5"
                  onPointerDown={() => setDrag(i)}
                />
              ))}
            </svg>
            <p>
              Drag points (●) to move observations. Random scatter around 0
              suggests a good fit.
            </p>
          </article>
          {display.table && (
            <aside>
              <table>
                <thead>
                  <tr>
                    <th>i</th>
                    <th>x</th>
                    <th>y (obs)</th>
                    <th>ŷ (pred)</th>
                    <th>e=y−ŷ</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((p, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{p.x}</td>
                      <td>{fixed(p.y, 1)}</td>
                      <td>{fixed(predict(p.x), 1)}</td>
                      <td
                        className={
                          residuals[i] > 0
                            ? "positive"
                            : residuals[i] < 0
                              ? "negative"
                              : ""
                        }
                      >
                        {fixed(residuals[i], 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>e: residual (observed − predicted)</p>
              <footer>
                <i />
                Positive <i />
                Negative <i />
                Zero
              </footer>
            </aside>
          )}
        </section>
        <section className="re615-middle">
          <article>
            <h2>2. Residual Plot</h2>
            <svg viewBox="0 0 500 240" aria-label="Residual pattern plot">
              {display.grid &&
                [35, 75, 115, 155, 195].map((y) => (
                  <line
                    className="grid"
                    key={y}
                    x1="45"
                    x2="465"
                    y1={y}
                    y2={y}
                  />
                ))}
              <line className="axis dash" x1="45" x2="465" y1="115" y2="115" />
              {display.residuals &&
                residuals.map((v, i) => (
                  <circle
                    className={v > 0 ? "positive" : v < 0 ? "negative" : "zero"}
                    key={i}
                    cx={45 + (points[i].x / 8) * 420}
                    cy={115 - (v / maxResidual) * 70}
                    r="5"
                  />
                ))}
            </svg>
            <p>
              Look for patterns. Random scatter around 0 suggests a good fit.
            </p>
          </article>
          <aside>
            <h2>3. Error Measures</h2>
            <section>
              <b>SSE (Sum of Squared Errors)</b>
              <strong>SSE = Σ(yᵢ−ŷᵢ)² = {fixed(sse)}</strong>
            </section>
            <section>
              <b>MAE (Mean Absolute Error)</b>
              <strong>MAE = Σ|yᵢ−ŷᵢ| / n = {fixed(mae)}</strong>
            </section>
            <section className={pattern ? "warning" : "good"}>
              <b>{pattern ? "⚠ Pattern warning" : "✓ Random residuals"}</b>
              <p>
                {pattern
                  ? "Residuals show structure. The model may be missing curvature."
                  : "No strong residual pattern is visible."}
              </p>
            </section>
          </aside>
        </section>
        <section className="re615-controls">
          <h2>Controls</h2>
          <label>
            Model type
            <select
              aria-label="Model type"
              value={model}
              onChange={(e) => act(() => setModel(e.target.value as Model))}
            >
              <option value="linear">Linear (y = mx + b)</option>
              <option value="quadratic">Quadratic (y = ax² + bx + c)</option>
            </select>
          </label>
          {model === "quadratic" && (
            <label>
              Coefficient (a)
              <input
                aria-label="Quadratic coefficient"
                type="range"
                min="-2"
                max="2"
                step=".1"
                value={a}
                onChange={(e) => act(() => setA(Number(e.target.value)))}
              />
            </label>
          )}
          <label>
            Slope / x coefficient
            <input
              aria-label="Slope"
              type="range"
              min="-5"
              max="5"
              step=".1"
              value={m}
              onChange={(e) => act(() => setM(Number(e.target.value)))}
            />
            <input
              aria-label="Slope value"
              type="number"
              value={m}
              onChange={(e) => act(() => setM(Number(e.target.value)))}
            />
          </label>
          <label>
            Intercept
            <input
              aria-label="Intercept"
              type="range"
              min="-10"
              max="10"
              step=".1"
              value={b}
              onChange={(e) => act(() => setB(Number(e.target.value)))}
            />
            <input
              aria-label="Intercept value"
              type="number"
              value={b}
              onChange={(e) => act(() => setB(Number(e.target.value)))}
            />
          </label>
          <label>
            Residual scale
            <select
              aria-label="Residual scale"
              value={scale}
              onChange={(e) => act(() => setScale(e.target.value))}
            >
              <option value="auto">Auto</option>
              <option value="fixed">Fixed ±6</option>
            </select>
          </label>
          <fieldset>
            <legend>Display</legend>
            {(["line", "residuals", "table", "grid"] as const).map((k) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={display[k]}
                  onChange={() => toggle(k)}
                />
                Show {k}
              </label>
            ))}
          </fieldset>
        </section>
      </section>
      <section className="re615-theory">
        <article>
          <b>Key rule / definition</b>
          <p>
            Residual: eᵢ = yᵢ − ŷᵢ, the difference between observed and
            predicted.
          </p>
          <p>Good fit: residuals are randomly scattered around 0.</p>
        </article>
        <article>
          <b>⚠ Common misconception</b>
          <p>
            “If the line passes through most points, the model is good.” A
            curved residual pattern signals missing structure.
          </p>
        </article>
        <article>
          <b>Worked example (correct)</b>
          <p>
            Model: ŷ=2x+1
            <br />
            Residuals: 0,−1,1,2,−1,−1,1
            <br />
            SSE={fixed(9)}, MAE={fixed(1)}
          </p>
        </article>
        <article>
          <b>Challenge Your turn</b>
          <p>Try a quadratic model that better fits the data.</p>
          <button onClick={fitQuadratic}>
            Open Practice <ChevronRight />
          </button>
          {practice && <output>Quadratic fitted: SSE {fixed(sse)}.</output>}
        </article>
      </section>
      <nav className="re615-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/614-sensitivity-analysis">
          <ChevronLeft />
          <span>
            <b>Previous Lesson</b>Sensitivity Analysis
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/616-scenario-comparison">
          <span>
            <b>Next Lesson</b>Scenario Comparison
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
