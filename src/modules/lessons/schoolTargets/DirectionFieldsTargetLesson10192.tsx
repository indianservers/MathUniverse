import {
  Eye,
  EyeOff,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DirectionFieldsTargetLesson10192.css";

type Method = "Euler" | "RK4";
const fmt = (n: number, d = 4) => Number(n.toFixed(d));
const exact = (x: number, x0: number, y0: number) =>
  x - 1 + (y0 - x0 + 1) * Math.exp(-(x - x0));
function solve(x0: number, y0: number, h: number, method: Method) {
  const out = [{ x: x0, y: y0 }];
  let x = x0,
    y = y0;
  while (x < 4 - 1e-8) {
    const step = Math.min(h, 4 - x);
    if (method === "Euler") y += step * (x - y);
    else {
      const f = (a: number, b: number) => a - b,
        k1 = f(x, y),
        k2 = f(x + step / 2, y + (step * k1) / 2),
        k3 = f(x + step / 2, y + (step * k2) / 2),
        k4 = f(x + step, y + step * k3);
      y += (step * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
    }
    x += step;
    out.push({ x, y });
  }
  return out;
}
const mapX = (x: number, z: number) => 45 + (x + 1) * 78 * z,
  mapY = (y: number, z: number) => 285 - (y + 3) * 52 * z;
export default function DirectionFieldsTargetLesson10192({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [probe, setProbe] = useState({ x: 0, y: 1 }),
    [initial, setInitial] = useState({ x: 0, y: 1 }),
    [method, setMethod] = useState<Method>("Euler"),
    [h, setH] = useState(0.05),
    [traced, setTraced] = useState(true),
    [running, setRunning] = useState(false),
    [iso, setIso] = useState(true),
    [levels, setLevels] = useState([-2, -1, 0, 1, 2]),
    [axes, setAxes] = useState(true),
    [grid, setGrid] = useState(true),
    [values, setValues] = useState(true),
    [density, setDensity] = useState<"Sparse" | "Dense">("Dense"),
    [zoom, setZoom] = useState(1),
    [tips, setTips] = useState(true),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const slope = probe.x - probe.y,
    numerical = useMemo(
      () => solve(initial.x, initial.y, h, method),
      [initial, h, method],
    ),
    exactPoints = useMemo(
      () =>
        Array.from({ length: 151 }, (_, i) => {
          const x = initial.x + (i * (4 - initial.x)) / 150;
          return { x, y: exact(x, initial.x, initial.y) };
        }),
      [initial],
    );
  const errors = [0, 1, 2, 3, 4].map((x) => {
      const near = numerical.reduce((a, b) =>
        Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a,
      );
      const ex = exact(x, initial.x, initial.y);
      return { x, euler: near.y, exact: ex, error: Math.abs(near.y - ex) };
    }),
    maxError = Math.max(...errors.map((r) => r.error)),
    meanError = errors.reduce((a, r) => a + r.error, 0) / errors.length;
  const field = useMemo(() => {
    const cols = density === "Dense" ? 19 : 11,
      rows = density === "Dense" ? 15 : 9;
    return Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols,
        row = Math.floor(i / cols),
        x = -1 + (col * 5) / (cols - 1),
        y = -3 + (row * 7) / (rows - 1),
        m = x - y,
        a = Math.atan(m),
        cx = mapX(x, zoom),
        cy = mapY(y, zoom),
        dx = Math.cos(a) * 7,
        dy = -Math.sin(a) * 7;
      return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy, m };
    });
  }, [density, zoom]);
  const path = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${mapX(p.x, zoom)},${mapY(p.y, zoom)}`).join(" ");
  const changeProbe = (x: number, y: number) =>
    setProbe({
      x: Math.max(-1, Math.min(4, fmt(x, 2))),
      y: Math.max(-3, Math.min(4, fmt(y, 2))),
    });
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      changeProbe(
        (((p.clientX - r.left) / r.width) * 520 - 45) / (78 * zoom) - 1,
        (285 - ((p.clientY - r.top) / r.height) * 410) / (52 * zoom) - 3,
      );
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft") changeProbe(probe.x - 0.05, probe.y);
    if (e.key === "ArrowRight") changeProbe(probe.x + 0.05, probe.y);
    if (e.key === "ArrowUp") changeProbe(probe.x, probe.y + 0.05);
    if (e.key === "ArrowDown") changeProbe(probe.x, probe.y - 0.05);
  };
  const trace = () => {
    setInitial(probe);
    setRunning(true);
    setTraced(true);
    window.setTimeout(() => setRunning(false), 500);
  };
  const reset = () => {
    setProbe({ x: 0, y: 1 });
    setInitial({ x: 0, y: 1 });
    setMethod("Euler");
    setH(0.05);
    setTraced(true);
    setRunning(false);
    setIso(true);
    setLevels([-2, -1, 0, 1, 2]);
    setAxes(true);
    setGrid(true);
    setValues(true);
    setDensity("Dense");
    setZoom(1);
    setTips(true);
    setPrediction("");
    setFeedback("");
  };
  return (
    <main
      className="df10192-page"
      data-testid="school-mockup-0866"
      data-object-model="dedicated-direction-field-numerical-solver"
      data-probe-x={fmt(probe.x, 2)}
      data-probe-y={fmt(probe.y, 2)}
      data-slope={fmt(slope)}
      data-method={method}
      data-step={h}
      data-traced={traced}
      data-max-error={fmt(maxError)}
    >
      <header className="df-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>Direction Fields</h1>
        <p>
          Dense slope field for y′=x−y. Explore local slope, isoclines, and
          solution curves. Click an initial point to trace Euler or RK4.
        </p>
        <div>
          <span>25 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>visual</span>
          <span>interactive</span>
        </div>
      </header>
      <section className="df-lab">
        <div className="df-title">
          <div>
            <small>▦ &nbsp; INTERACTIVE LAB</small>
            <h2>Direction Field Explorer</h2>
            <p>Equation: y′ = x − y</p>
          </div>
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={() => setTraced(false)}>
              <Trash2 />
              Clear solution
            </button>
            <button onClick={() => setTips((x) => !x)}>
              {tips ? <EyeOff /> : <Eye />}
              {tips ? "Hide tips" : "Show tips"}
            </button>
          </div>
        </div>
        <div className="df-workspace">
          <aside className="df-controls">
            <article>
              <h3>PROBE (DRAG IN THE FIELD)</h3>
              <p>
                x = <b>{fmt(probe.x, 3)}</b>
              </p>
              <p>
                y = <b>{fmt(probe.y, 3)}</b>
              </p>
              <p>
                m = x−y = <b>{fmt(slope, 3)}</b>
              </p>
              <span className="probe-line" />
            </article>
            <article>
              <h3>TRACE SOLUTION</h3>
              <label>
                Initial point (x₀,y₀)
                <div>
                  <input
                    aria-label="Initial x"
                    type="number"
                    step=".1"
                    value={initial.x}
                    onChange={(e) =>
                      setInitial((v) => ({ ...v, x: Number(e.target.value) }))
                    }
                  />
                  <input
                    aria-label="Initial y"
                    type="number"
                    step=".1"
                    value={initial.y}
                    onChange={(e) =>
                      setInitial((v) => ({ ...v, y: Number(e.target.value) }))
                    }
                  />
                </div>
              </label>
              <button onClick={trace}>
                {running ? "Tracing..." : "◉ Trace solution"}
              </button>
              <label>
                Method:
                <select
                  aria-label="Numerical method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                >
                  <option>Euler</option>
                  <option>RK4</option>
                </select>
              </label>
              <label>
                Step size h
                <input
                  aria-label="Step size"
                  type="range"
                  min=".01"
                  max=".5"
                  step=".01"
                  value={h}
                  onChange={(e) => setH(Number(e.target.value))}
                />
                <b>{h}</b>
              </label>
            </article>
            <article>
              <h3>ISOCLINES y=x−m</h3>
              <label>
                <input
                  type="checkbox"
                  checked={iso}
                  onChange={(e) => setIso(e.target.checked)}
                />{" "}
                Show isoclines
              </label>
              {[-2, -1, 0, 1, 2].map((m, i) => (
                <label key={m}>
                  <input
                    type="checkbox"
                    checked={levels.includes(m)}
                    onChange={(e) =>
                      setLevels((old) =>
                        e.target.checked
                          ? [...old, m].sort()
                          : old.filter((n) => n !== m),
                      )
                    }
                  />
                  <span style={{ color: colors[i] }}>m={m}</span>
                </label>
              ))}
            </article>
            <article>
              <h3>VIEW OPTIONS</h3>
              <label>
                <input
                  type="checkbox"
                  checked={axes}
                  onChange={(e) => setAxes(e.target.checked)}
                />{" "}
                Show axes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={grid}
                  onChange={(e) => setGrid(e.target.checked)}
                />{" "}
                Show grid
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={values}
                  onChange={(e) => setValues(e.target.checked)}
                />{" "}
                Show slope value at probe
              </label>
              <label>
                Field density
                <select
                  value={density}
                  onChange={(e) =>
                    setDensity(e.target.value as "Sparse" | "Dense")
                  }
                >
                  <option>Sparse</option>
                  <option>Dense</option>
                </select>
              </label>
            </article>
          </aside>
          <div className="df-visual">
            <svg viewBox="0 0 520 410" aria-label="Interactive direction field">
              {grid &&
                Array.from({ length: 12 }, (_, i) => (
                  <g key={i}>
                    <line
                      x1={45 + i * 39}
                      y1="20"
                      x2={45 + i * 39}
                      y2="390"
                      className="grid"
                    />
                    <line
                      x1="35"
                      y1={25 + i * 32}
                      x2="505"
                      y2={25 + i * 32}
                      className="grid"
                    />
                  </g>
                ))}
              {field.map((l, i) => (
                <line key={i} {...l} className="slope" />
              ))}
              {iso &&
                levels.map((m, i) => (
                  <line
                    key={m}
                    x1={mapX(-1, zoom)}
                    y1={mapY(-1 - m, zoom)}
                    x2={mapX(4, zoom)}
                    y2={mapY(4 - m, zoom)}
                    style={{ stroke: colors[i] }}
                    className="isocline"
                  />
                ))}
              {axes && (
                <>
                  <line
                    x1={mapX(-1, zoom)}
                    y1={mapY(0, zoom)}
                    x2={mapX(4.2, zoom)}
                    y2={mapY(0, zoom)}
                    className="axis"
                  />
                  <line
                    x1={mapX(0, zoom)}
                    y1={mapY(-3, zoom)}
                    x2={mapX(0, zoom)}
                    y2={mapY(4.2, zoom)}
                    className="axis"
                  />
                </>
              )}
              {traced && (
                <>
                  <polyline points={path(exactPoints)} className="exact" />
                  <polyline points={path(numerical)} className="numerical" />
                </>
              )}
              <circle
                cx={mapX(probe.x, zoom)}
                cy={mapY(probe.y, zoom)}
                r="7"
                tabIndex={0}
                onPointerDown={drag}
                onKeyDown={key}
              />
              {values && (
                <text x={mapX(probe.x, zoom) + 10} y={mapY(probe.y, zoom) - 10}>
                  ({fmt(probe.x, 2)}, {fmt(probe.y, 2)}) m={fmt(slope, 2)}
                </text>
              )}
            </svg>
            <div className="df-zoom">
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.25, fmt(z + 0.05, 2)))}
              >
                <Plus />
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.75, fmt(z - 0.05, 2)))}
              >
                <Minus />
              </button>
              <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
            </div>
            <div className="df-readouts">
              <article>
                <h3>Current probe</h3>
                <p>
                  (x,y)=({fmt(probe.x, 3)}, {fmt(probe.y, 3)})
                </p>
                <p>Slope m=x−y={fmt(slope, 3)}</p>
                <p>
                  Tangent: y={fmt(slope, 3)}(x−{fmt(probe.x, 2)})+
                  {fmt(probe.y, 2)}
                </p>
              </article>
              <article>
                <h3>
                  Exact solution (through ({initial.x},{initial.y}))
                </h3>
                <p className="formula">
                  y=x−1+{fmt(initial.y - initial.x + 1, 2)}e⁻⁽ˣ⁻ˣ⁰⁾
                </p>
                <table>
                  <tbody>
                    <tr>
                      <th>x</th>
                      {errors.map((r) => (
                        <td key={r.x}>{r.x}</td>
                      ))}
                    </tr>
                    <tr>
                      <th>y exact</th>
                      {errors.map((r) => (
                        <td key={r.x}>{fmt(r.exact)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </article>
            </div>
          </div>
        </div>
        <div className="df-error">
          <div>
            <h3>Numerical vs Exact ({method})</h3>
            <p>Step size h={h}</p>
            <table>
              <tbody>
                <tr>
                  <th>x</th>
                  {errors.map((r) => (
                    <td key={r.x}>{r.x}</td>
                  ))}
                </tr>
                <tr>
                  <th>y ({method})</th>
                  {errors.map((r) => (
                    <td key={r.x}>{fmt(r.euler)}</td>
                  ))}
                </tr>
                <tr>
                  <th>y (Exact)</th>
                  {errors.map((r) => (
                    <td key={r.x}>{fmt(r.exact)}</td>
                  ))}
                </tr>
                <tr>
                  <th>Error</th>
                  {errors.map((r) => (
                    <td key={r.x}>{fmt(r.error)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <aside>
            <p>Max |error| on [0,4]: {fmt(maxError)}</p>
            <p>Mean |error|: {fmt(meanError)}</p>
            <p>ⓘ Decrease step size h for higher accuracy.</p>
          </aside>
        </div>
      </section>
      <section className="df-explain">
        <article>
          <h3>WHAT DIRECTION FIELDS SHOW</h3>
          <ul>
            <li>Each short segment shows slope y′=x−y.</li>
            <li>They describe LOCAL behavior only.</li>
            <li>A solution curve follows the slopes.</li>
          </ul>
        </article>
        <article className="warn">
          <h3>⚠ &nbsp; COMMON MISCONCEPTION</h3>
          <p>
            The little line segments are NOT solution curves. They do not
            connect to form trajectories.
          </p>
          <p>
            A solution curve is a smooth path tangent to the field everywhere.
          </p>
        </article>
      </section>
      <section className="df-challenge">
        <h3>♧ &nbsp; PREDICTION CHALLENGE</h3>
        <p>
          Without using trace, predict how the solution through (2,2) moves as x
          increases.
        </p>
        <div>
          {[
            "Upward and getting steeper",
            "Upward and flattening",
            "Downward and getting steeper",
            "Downward and flattening",
          ].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="df10192"
                checked={prediction === v}
                onChange={() => setPrediction(v)}
              />
              {v}
            </label>
          ))}
        </div>
        <button
          onClick={() =>
            setFeedback(
              prediction === "Upward and getting steeper"
                ? "Correct: initially y′=0, then x outgrows y and the slope becomes positive."
                : "Compare x and y immediately to the right of (2,2).",
            )
          }
        >
          Check answer
        </button>
        {tips && <p>Hint: compare x and y at points to the right of (2,2).</p>}
        {feedback && (
          <strong
            className={feedback.startsWith("Correct") ? "correct" : "incorrect"}
          >
            {feedback}
          </strong>
        )}
      </section>
      <section className="df-lower">
        {[
          [
            "LEARN",
            "What is a direction field?",
            "How to read slope at a point",
            "What are isoclines?",
            "Exact vs numerical solutions",
          ],
          [
            "EXPLORE",
            "Change initial point and trace",
            "Adjust step size h",
            "Toggle isoclines",
            "Compare Euler with RK4",
          ],
          [
            "PRACTICE",
            "Trace from different points",
            "Predict curve behavior",
            "Estimate slopes",
            "Improve accuracy",
          ],
          [
            "EXTEND",
            "Try other equations",
            "Observe equilibrium",
            "Investigate stability",
            "Verify exact forms",
          ],
        ].map((a) => (
          <article key={a[0]}>
            <h3>{a[0]}</h3>
            <ol>
              {a.slice(1).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </article>
        ))}
      </section>
      <Link
        className="df-prev"
        to="/lessons/school/class-12/class-12-differential-equations-general-and-particular-solutions"
      >
        ← General and Particular Solutions
      </Link>
      <div className="df-complete">
        Field sampled · trajectory traced · numerical error measured
      </div>
    </main>
  );
}
const colors = ["#ff416c", "#2997e8", "#12a36d", "#ff9a24", "#8538ef"];
