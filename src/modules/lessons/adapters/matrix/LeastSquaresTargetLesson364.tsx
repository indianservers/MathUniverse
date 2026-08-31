import { Eye, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LeastSquaresTargetLesson364.css";
type Point = { x: number; y: number };
const initial: Point[] = [
    { x: -2, y: -1 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 4 },
  ],
  clean = (n: number) => Number(n.toFixed(4));
function fit(points: Point[]) {
  const n = points.length,
    xbar = points.reduce((s, p) => s + p.x, 0) / n,
    ybar = points.reduce((s, p) => s + p.y, 0) / n,
    sxx = points.reduce((s, p) => s + (p.x - xbar) ** 2, 0),
    sxy = points.reduce((s, p) => s + (p.x - xbar) * (p.y - ybar), 0),
    m = sxx ? sxy / sxx : 0,
    b = ybar - m * xbar;
  return {
    n,
    xbar: clean(xbar),
    ybar: clean(ybar),
    sxx: clean(sxx),
    sxy: clean(sxy),
    m: clean(m),
    b: clean(b),
    exactM: m,
    exactB: b,
  };
}
function metrics(points: Point[], m: number, b: number) {
  const rawResiduals = points.map((p) => p.y - (m * p.x + b)),
    residuals = rawResiduals.map(clean),
    sse = clean(rawResiduals.reduce((s, r) => s + r * r, 0)),
    rmse = clean(Math.sqrt(sse / points.length)),
    mae = clean(residuals.reduce((s, r) => s + Math.abs(r), 0) / points.length),
    atr: [number, number] = [
      clean(points.reduce((s, p, i) => s + p.x * rawResiduals[i], 0)),
      clean(rawResiduals.reduce((s, r) => s + r, 0)),
    ];
  return { residuals, sse, rmse, mae, atr };
}
export default function LeastSquaresTargetLesson364({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<Point[]>(initial),
    [m, setM] = useState(0.688),
    [b, setB] = useState(0.1),
    [mode, setMode] = useState<"points" | "line">("points"),
    [drag, setDrag] = useState<number | null>(null),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0),
    best = useMemo(() => fit(points), [points]),
    current = useMemo(() => metrics(points, m, b), [points, m, b]),
    minimum = useMemo(
      () => metrics(points, best.exactM, best.exactB),
      [points, best],
    ),
    minimized = Math.abs(m - best.m) < 0.002 && Math.abs(b - best.b) < 0.002;
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setPoints(initial);
      setM(0.688);
      setB(0.1);
      setMode("points");
      setDrag(null);
      setTab("Interact");
      setChallenge("");
      setActions(0);
    },
    reveal = () =>
      act(() => {
        setM(best.m);
        setB(best.b);
        setChallenge("correct");
      });
  useEffect(reset, [resetToken]);
  const px = (x: number) => 33 + (x + 3) * 44,
    py = (y: number) => 240 - y * 45,
    pointer = (e: React.PointerEvent<SVGSVGElement>) => {
      const box = e.currentTarget.getBoundingClientRect(),
        sx = ((e.clientX - box.left) / box.width) * 520,
        sy = ((e.clientY - box.top) / box.height) * 390;
      if (mode === "points" && drag !== null) {
        const y = clean((240 - sy) / 45);
        act(() =>
          setPoints((ps) => ps.map((p, i) => (i === drag ? { ...p, y } : p))),
        );
      } else if (mode === "line") {
        const x = (sx - 33) / 44 - 3,
          y = (240 - sy) / 45;
        act(() => setB(clean(y - m * x)));
      }
    };
  return (
    <section
      className="ls364-page"
      data-testid="matrix-mockup-0549"
      data-object-model="editable-draggable-data-real-least-squares-fit-residuals-sse-rmse-mae-normal-equations-orthogonality-line-challenge"
      data-points={JSON.stringify(points)}
      data-current-line={JSON.stringify([m, b])}
      data-best-line={JSON.stringify([best.m, best.b])}
      data-current-sse={current.sse}
      data-minimum-sse={minimum.sse}
      data-atr={JSON.stringify(minimum.atr)}
      data-mode={mode}
      data-tab={tab}
      data-challenge={challenge}
      data-actions={actions}
    >
      <header className="ls364-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>MATRICES AND LINEAR ALGEBRA</b>
          </span>
          <h1>Least Squares</h1>
          <p>The closest solution when no exact solution exists</p>
          <nav>
            Advanced &nbsp; Linear Algebra Lab &nbsp; Matrices / Vectors &nbsp;
            6-10 min
          </nav>
        </div>
        <aside>
          <select>
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
        </aside>
      </header>
      <nav className="ls364-tabs">
        {[
          "Interact",
          "Compare",
          "Geometry",
          "Normal Equations",
          "Worked Example",
          "Challenge",
        ].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => act(() => setTab(t))}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="ls364-main">
        <div className="ls364-plot">
          <h3>Interactive: drag points or the line</h3>
          <svg
            viewBox="0 0 520 390"
            onPointerMove={pointer}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            <defs>
              <pattern
                id="lsgrid"
                width="44"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path d="M44 0H0V50" fill="none" stroke="#e5eaf0" />
              </pattern>
              <clipPath id="lsplotclip">
                <rect x="33" y="20" width="308" height="340" />
              </clipPath>
            </defs>
            <rect x="33" y="20" width="308" height="340" fill="url(#lsgrid)" />
            <path d="M33 240H350M165 15V360" stroke="#283952" />
            <text x="354" y="245" fill="#263957">
              x
            </text>
            <text x="171" y="24" fill="#263957">
              y
            </text>
            {[-3, -2, -1, 0, 1, 2, 3, 4].map((value) => (
              <text
                key={"x" + value}
                x={px(value)}
                y="374"
                textAnchor="middle"
                fill="#263957"
              >
                {value}
              </text>
            ))}
            {[-1, 0, 1, 2, 3, 4].map((value) => (
              <text
                key={"y" + value}
                x="24"
                y={py(value) + 3}
                textAnchor="end"
                fill="#263957"
              >
                {value}
              </text>
            ))}
            <g clipPath="url(#lsplotclip)">
              <line
                x1={px(-3)}
                y1={py(m * -3 + b)}
                x2={px(4)}
                y2={py(m * 4 + b)}
                stroke="#7c35ea"
                strokeWidth="3"
              />
              <line
                x1={px(-3)}
                y1={py(best.m * -3 + best.b)}
                x2={px(4)}
                y2={py(best.m * 4 + best.b)}
                stroke="#08b5d1"
                strokeWidth="2"
                strokeDasharray="7 5"
              />
              {points.map((p, i) => {
                const predicted = m * p.x + b;
                return (
                  <g key={i}>
                    <line
                      x1={px(p.x)}
                      y1={py(p.y)}
                      x2={px(p.x)}
                      y2={py(predicted)}
                      stroke="#ef5c74"
                      strokeWidth="2"
                    />
                    <rect
                      x={px(p.x) - 3}
                      y={py(predicted) - 3}
                      width="6"
                      height="6"
                      fill="#f48124"
                    />
                    <circle
                      cx={px(p.x)}
                      cy={py(p.y)}
                      r="7"
                      fill="#1677e8"
                      onPointerDown={() => setDrag(i)}
                    />
                  </g>
                );
              })}
            </g>
            <g className="ls364-legend">
              <circle cx="378" cy="39" r="6" fill="#1677e8" />
              <text x="392" y="43">
                Data point
              </text>
              <line
                x1="372"
                y1="65"
                x2="385"
                y2="65"
                stroke="#ef5c74"
                strokeWidth="2"
              />
              <text x="392" y="68">
                Residual (rᵢ)
              </text>
              <rect x="375" y="87" width="7" height="7" fill="#f48124" />
              <text x="392" y="94">
                Squared error (rᵢ²)
              </text>
              <line
                x1="372"
                y1="119"
                x2="385"
                y2="119"
                stroke="#7c35ea"
                strokeWidth="2"
              />
              <text x="392" y="123">
                Your line y=mx+b
              </text>
              <line
                x1="372"
                y1="148"
                x2="385"
                y2="148"
                stroke="#08b5d1"
                strokeDasharray="5 3"
              />
              <text x="392" y="152">
                Best fit y=m̂x+b̂
              </text>
            </g>
          </svg>
          <section>
            <label>
              m (slope)
              <input
                aria-label="Slope m"
                type="range"
                min="-3"
                max="3"
                step="0.001"
                value={m}
                onChange={(e) =>
                  act(() => {
                    setM(Number(e.target.value));
                    setChallenge("");
                  })
                }
              />
              <output>{m.toFixed(3)}</output>
            </label>
            <label>
              b (intercept)
              <input
                aria-label="Intercept b"
                type="range"
                min="-3"
                max="3"
                step="0.001"
                value={b}
                onChange={(e) =>
                  act(() => {
                    setB(Number(e.target.value));
                    setChallenge("");
                  })
                }
              />
              <output>{b.toFixed(3)}</output>
            </label>
          </section>
          <button
            onClick={() =>
              act(() => setMode((v) => (v === "points" ? "line" : "points")))
            }
          >
            Edit {mode} (drag)
          </button>
        </div>
        <aside>
          <article>
            <h2>Sum of squared errors (SSE)</h2>
            <p>Lower is better</p>
            <strong>{current.sse}</strong>
            <meter
              min="0"
              max={Math.max(15, current.sse)}
              value={current.sse}
            />
            <button onClick={reveal}>
              <Eye />
              Reveal minimum
            </button>
          </article>
          <article>
            <h3>Your line</h3>
            <code>y=mx+b</code>
            <p className="ls364-coefficients">
              <b>m</b>
              <span>{m.toFixed(4)}</span>
              <b>b</b>
              <span>{b.toFixed(4)}</span>
            </p>
            <hr />
            <h3>Best fit line</h3>
            <code>ŷ=m̂x+b̂</code>
            <p className="ls364-coefficients">
              <b>m̂</b>
              <span>{best.m.toFixed(4)}</span>
              <b>b̂</b>
              <span>{best.b.toFixed(4)}</span>
            </p>
          </article>
          <article>
            <h3>Data summary</h3>
            <p>
              n={best.n} &nbsp; x̄={best.xbar} &nbsp; ȳ={best.ybar}
            </p>
            <p>
              Sxx={best.sxx} &nbsp; Sxy={best.sxy}
            </p>
          </article>
        </aside>
      </section>
      <section className="ls364-concepts">
        {[
          [
            "Least squares model",
            "b ≈ A x̂",
            "We model b as the design matrix A times the parameter vector x̂.",
            "b = observed data · A = design matrix · x̂ = [m̂,b̂]",
          ],
          [
            "Projection & residual",
            "r = b - A x̂",
            "The fitted values are the projection b̂=A x̂; residuals are the remaining vertical errors.",
            "rᵢ = bᵢ - b̂ᵢ",
          ],
          [
            "Orthogonality",
            "Aᵀr = 0",
            "At the optimum residuals are orthogonal to every design column.",
            "No improvement is possible in any column-space direction.",
          ],
          [
            "Normal equations",
            "AᵀA x̂ = Aᵀb",
            "Solving gives the unique least-squares line when A has full rank.",
            "Independent columns make AᵀA invertible.",
          ],
        ].map((x) => (
          <article key={x[0]}>
            <h3>{x[0]}</h3>
            <code>{x[1]}</code>
            <p>{x[2]}</p>
            <small>{x[3]}</small>
          </article>
        ))}
      </section>
      <section className="ls364-lower">
        <article>
          <h3>Worked example (calculated)</h3>
          <p>Fit a line to the editable points.</p>
          <table className="ls364-data-table">
            <tbody>
              <tr>
                <th>xᵢ</th>
                {points.map((point, index) => (
                  <td key={index}>{point.x}</td>
                ))}
              </tr>
              <tr>
                <th>yᵢ</th>
                {points.map((point, index) => (
                  <td key={index}>{point.y}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <p>For y=mx+b, solve the normal equations:</p>
          <div className="ls364-design-matrix">
            <b>A =</b>
            <span>
              {points.map((point, index) => (
                <i key={index}>[{point.x}, 1]</i>
              ))}
            </span>
            <b>b =</b>
            <span>
              {points.map((point, index) => (
                <i key={index}>[{point.y}]</i>
              ))}
            </span>
          </div>
          <code>
            AᵀA = [[
            {clean(points.reduce((sum, point) => sum + point.x ** 2, 0))},
            {clean(points.reduce((sum, point) => sum + point.x, 0))}], [
            {clean(points.reduce((sum, point) => sum + point.x, 0))},{best.n}]]
            <br />
            Aᵀb = [{clean(points.reduce((s, p) => s + p.x * p.y, 0))},
            {clean(points.reduce((s, p) => s + p.y, 0))}]<br />
            x̂ = [{best.m},{best.b}]
          </code>
          <strong>
            Best fit: y={best.m}x+{best.b}
            <br />
            Minimum SSE={minimum.sse}
          </strong>
        </article>
        <article>
          <h3>Compare: your line vs best fit</h3>
          <table>
            <tbody>
              {[
                ["Slope", m, best.m],
                ["Intercept", b, best.b],
                ["SSE", current.sse, minimum.sse],
                ["RMSE", current.rmse, minimum.rmse],
                ["MAE", current.mae, minimum.mae],
              ].map((row) => (
                <tr key={String(row[0])}>
                  {row.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <code>Aᵀr ≈ [{minimum.atr.join(", ")}]</code>
        </article>
        <article>
          <h3>Challenge</h3>
          <strong>Minimize the squared error</strong>
          <p>Adjust m and b (or drag the line) to reach the minimum SSE.</p>
          <div className="ls364-goal">
            <b>Goal</b>
            <br />
            Reach the minimum SSE.
          </div>
          <button
            onClick={() =>
              act(() => setChallenge(minimized ? "correct" : "incorrect"))
            }
          >
            I minimized it!
          </button>
          <button
            onClick={() =>
              act(() => {
                setM(0.688);
                setB(0.1);
                setChallenge("");
              })
            }
          >
            Reset challenge
          </button>
          {challenge && (
            <output className={challenge}>
              {challenge === "correct"
                ? "Minimum reached"
                : "Move the purple line to the dashed line"}
            </output>
          )}
          <small className="ls364-hint">
            <b>Hint:</b> The minimum occurs when the purple line coincides with
            the dashed line.
          </small>
        </article>
      </section>
    </section>
  );
}
