import { Check, Lightbulb, Pause, Play, RotateCcw } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./EulerMethodTargetLesson324.css";

type Equation = "growth" | "decay" | "forced";
type Row = {
  n: number;
  x: number;
  euler: number;
  exact: number;
  error: number;
};
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number) => Number(value.toFixed(8));
const models = {
  growth: {
    label: "y′ = y",
    slope: (_x: number, y: number) => y,
    exact: (x: number, x0: number, y0: number) => y0 * Math.exp(x - x0),
  },
  decay: {
    label: "y′ = -0.5y",
    slope: (_x: number, y: number) => -0.5 * y,
    exact: (x: number, x0: number, y0: number) =>
      y0 * Math.exp(-0.5 * (x - x0)),
  },
  forced: {
    label: "y′ = y - x",
    slope: (x: number, y: number) => y - x,
    exact: (x: number, x0: number, y0: number) =>
      x + 1 + (y0 - x0 - 1) * Math.exp(x - x0),
  },
} satisfies Record<
  Equation,
  {
    label: string;
    slope: (x: number, y: number) => number;
    exact: (x: number, x0: number, y0: number) => number;
  }
>;

function solve(
  equation: Equation,
  x0: number,
  y0: number,
  h: number,
  xmax: number,
) {
  const model = models[equation];
  const count = Math.max(1, Math.round((xmax - x0) / h));
  const rows: Row[] = [{ n: 0, x: x0, euler: y0, exact: y0, error: 0 }];
  for (let n = 0; n < count; n += 1) {
    const previous = rows[rows.length - 1];
    const x = Math.min(xmax, previous.x + h);
    const euler =
      previous.euler +
      (x - previous.x) * model.slope(previous.x, previous.euler);
    const exact = model.exact(x, x0, y0);
    rows.push({ n: n + 1, x, euler, exact, error: Math.abs(euler - exact) });
  }
  return rows;
}

export default function EulerMethodTargetLesson324({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [equation, setEquation] = useState<Equation>("growth");
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [h, setH] = useState(0.2);
  const [xmin, setXmin] = useState(-2);
  const [xmax, setXmax] = useState(2);
  const [step, setStep] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [field, setField] = useState(true);
  const [eulerLayer, setEulerLayer] = useState(true);
  const [exactLayer, setExactLayer] = useState(true);
  const [tangent, setTangent] = useState(true);
  const [axes, setAxes] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"" | "correct" | "incorrect">("");
  const [actions, setActions] = useState(0);
  const rows = useMemo(
    () => solve(equation, x0, y0, h, xmax),
    [equation, x0, y0, h, xmax],
  );
  const currentStep = Math.min(step, rows.length - 1);
  const current = rows[currentStep];
  const maxError = Math.max(...rows.map((row) => row.error));
  const rms = Math.sqrt(
    rows.reduce((sum, row) => sum + row.error ** 2, 0) / rows.length,
  );
  const reset = () => {
    setEquation("growth");
    setX0(0);
    setY0(1);
    setH(0.2);
    setXmin(-2);
    setXmax(2);
    setStep(3);
    setPlaying(false);
    setField(true);
    setEulerLayer(true);
    setExactLayer(true);
    setTangent(true);
    setAxes(true);
    setTab("Interact");
    setAnswer("");
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => {
        if (value >= rows.length - 1) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 380);
    return () => window.clearInterval(timer);
  }, [playing, rows.length]);
  useEffect(
    () => setStep((value) => Math.min(value, rows.length - 1)),
    [rows.length],
  );
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateInitial = (x: number, y: number) =>
    act(() => {
      setX0(clamp(x, xmin, xmax - h));
      setY0(clamp(y, -1, 5));
      setStep(0);
      setPlaying(false);
      setResult("");
    });
  const practiceExact = Math.exp(1);
  return (
    <section
      className="eul324-page"
      data-testid="calculus-mockup-0403"
      data-object-model="forward-euler-generated-steps-slope-field-exact-solution-draggable-initial-condition-live-table-errors-animation-practice"
      data-equation={equation}
      data-x0={clean(x0)}
      data-y0={clean(y0)}
      data-h={clean(h)}
      data-step={currentStep}
      data-steps={rows.length - 1}
      data-current-x={clean(current.x)}
      data-current-euler={clean(current.euler)}
      data-current-exact={clean(current.exact)}
      data-current-error={clean(current.error)}
      data-max-error={clean(maxError)}
      data-rms-error={clean(rms)}
      data-playing={playing}
      data-tab={tab}
      data-result={result}
      data-actions={actions}
    >
      <header className="eul324-hero">
        <span>
          <b>CALCULUS</b>
          <b>NUMERICAL METHODS</b>
        </span>
        <h1>Euler's Method</h1>
        <p>
          Approximate solution curves for y′=f(x,y) using forward Euler steps.
        </p>
        <div>
          <i>◷ 6-12 min</i>
          <i>◇ Beginner</i>
          <i>◉ Interactive</i>
        </div>
      </header>
      <nav className="eul324-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="eul324-lab">
        <aside className="eul324-setup">
          <h2>MODEL SETUP</h2>
          <label>
            Differential equation
            <select
              aria-label="Euler equation"
              value={equation}
              onChange={(event) =>
                act(() => {
                  setEquation(event.target.value as Equation);
                  setStep(0);
                })
              }
            >
              {Object.entries(models).map(([key, model]) => (
                <option key={key} value={key}>
                  {model.label}
                </option>
              ))}
            </select>
          </label>
          <p>
            Initial condition <small>(draggable on graph)</small>
          </p>
          <label className="number">
            x₀
            <input
              aria-label="Euler initial x"
              type="number"
              step="0.1"
              value={x0}
              onChange={(event) =>
                updateInitial(Number(event.target.value), y0)
              }
            />
          </label>
          <label className="number">
            y₀
            <input
              aria-label="Euler initial y"
              type="number"
              step="0.1"
              value={y0}
              onChange={(event) =>
                updateInitial(x0, Number(event.target.value))
              }
            />
          </label>
          <label>
            Step size (h)
            <input
              aria-label="Euler step size"
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={h}
              onChange={(event) =>
                act(() => {
                  setH(Number(event.target.value));
                  setStep(0);
                })
              }
            />
            <output>{h.toFixed(2)}</output>
            <small>
              <i>0.05</i>
              <i>0.20</i>
              <i>0.50</i>
            </small>
          </label>
          <p>X-range</p>
          <div className="range-pair">
            <input
              aria-label="Euler x minimum"
              type="number"
              value={xmin}
              onChange={(event) =>
                act(() =>
                  setXmin(Math.min(Number(event.target.value), xmax - 1)),
                )
              }
            />
            <input
              aria-label="Euler x maximum"
              type="number"
              value={xmax}
              onChange={(event) =>
                act(() => {
                  setXmax(Math.max(Number(event.target.value), x0 + h));
                  setStep(0);
                })
              }
            />
          </div>
          <hr />
          <h2>DISPLAY</h2>
          <Toggle
            label="Slope field"
            checked={field}
            set={setField}
            act={act}
          />
          <Toggle
            label="Euler steps"
            checked={eulerLayer}
            set={setEulerLayer}
            act={act}
          />
          <Toggle
            label="Exact solution"
            checked={exactLayer}
            set={setExactLayer}
            act={act}
          />
          <Toggle
            label="Tangent line (current step)"
            checked={tangent}
            set={setTangent}
            act={act}
          />
          <Toggle label="Axes" checked={axes} set={setAxes} act={act} />
          <button
            className="animate"
            aria-label={
              playing ? "Pause Euler animation" : "Animate Euler steps"
            }
            onClick={() => act(() => setPlaying((value) => !value))}
          >
            {playing ? <Pause /> : <Play />}{" "}
            {playing ? "Pause" : "Animate steps"}
          </button>
          <button
            onClick={() =>
              act(() => {
                setStep(0);
                setPlaying(false);
              })
            }
          >
            <RotateCcw /> Reset
          </button>
          <aside>
            <b>Tip:</b> Drag the blue point or change h and press Animate to see
            how Euler's method builds the solution.
          </aside>
        </aside>
        <main className="eul324-center">
          <header>
            <span>━ Slope field</span>
            <span>● Euler (h={h.toFixed(2)})</span>
            <span>━ Exact: {models[equation].label}</span>
          </header>
          <EulerGraph
            equation={equation}
            x0={x0}
            y0={y0}
            xmin={xmin}
            xmax={xmax}
            rows={rows}
            step={currentStep}
            field={field}
            eulerLayer={eulerLayer}
            exactLayer={exactLayer}
            tangent={tangent}
            axes={axes}
            onInitial={updateInitial}
          />
          <footer>
            <b>
              Step {currentStep} / {rows.length - 1}
            </b>
            <span>Current x = {current.x.toFixed(2)}</span>
            <span>yEuler = {current.euler.toFixed(4)}</span>
            <span>yExact = {current.exact.toFixed(4)}</span>
          </footer>
          <article>
            <h3>Step construction</h3>
            <p>
              At (xₙ,yₙ)=({current.x.toFixed(2)},{current.euler.toFixed(4)}),
              slope is f(xₙ,yₙ)=
              {models[equation].slope(current.x, current.euler).toFixed(4)}.
            </p>
            <p>
              <b>Tangent line:</b> y=yₙ+f(xₙ,yₙ)(x-xₙ)
            </p>
            <p>
              <b>Euler update:</b> yₙ₊₁=yₙ+h f(xₙ,yₙ).
            </p>
          </article>
        </main>
        <aside className="eul324-results">
          <h2>Live comparison</h2>
          <div className="table">
            <header>
              <b>n</b>
              <b>xₙ</b>
              <b>yEuler</b>
              <b>yExact</b>
              <b>|Error|</b>
            </header>
            {rows.slice(0, 11).map((row) => (
              <p key={row.n} className={row.n === currentStep ? "active" : ""}>
                <span>{row.n}</span>
                <span>{row.x.toFixed(2)}</span>
                <span>{row.euler.toFixed(4)}</span>
                <span>{row.exact.toFixed(4)}</span>
                <span>{row.error.toFixed(4)}</span>
              </p>
            ))}
          </div>
          <section>
            <h2>
              Summary ({x0.toFixed(0)} to {xmax.toFixed(0)})
            </h2>
            <p>
              Max |Error| <b>{maxError.toFixed(4)}</b>
            </p>
            <p>
              RMS Error <b>{rms.toFixed(4)}</b>
            </p>
            <p>
              Steps <b>{rows.length - 1}</b>
            </p>
            <p>
              Step size h <b>{h.toFixed(2)}</b>
            </p>
          </section>
        </aside>
      </section>
      <section className="eul324-learning">
        <article>
          <h2>What is Euler's Method?</h2>
          <p>
            Euler's method approximates the solution of an initial value problem
          </p>
          <strong>y′=f(x,y), y(x₀)=y₀</strong>
          <p>
            by taking small tangent steps of length h. It is a first-order
            method with global error O(h).
          </p>
          <a>Learn more →</a>
        </article>
        <article>
          <h2>✧ Governing rule</h2>
          <p>Given x₀, y₀ and step size h,</p>
          <strong>yₙ₊₁=yₙ+h f(xₙ,yₙ)</strong>
          <h3>Algorithm</h3>
          <ol>
            <li>Set x₀,y₀ and choose h.</li>
            <li>Compute slope, update y, then xₙ₊₁=xₙ+h.</li>
          </ol>
        </article>
        <article>
          <h2>⚠ Common misconception</h2>
          <p>“Euler's method is exact for all h.”</p>
          <p>
            <b>Not true.</b> For general f(x,y), global error grows as O(h).
          </p>
          <h3>How to avoid:</h3>
          <ul>
            <li>Use smaller h for better accuracy.</li>
            <li>Compare with an exact solution when possible.</li>
            <li>Check error trends in the table.</li>
          </ul>
        </article>
      </section>
      <section className="eul324-practice">
        <article>
          <h2>Try it!</h2>
          <p>
            Use Euler's method to approximate y(1) for y′=y, y(0)=1, with
            h=0.25.
          </p>
        </article>
        <label>
          Your answer
          <input
            aria-label="Euler practice answer"
            value={answer}
            placeholder="Enter y(1)"
            onChange={(event) =>
              act(() => {
                setAnswer(event.target.value);
                setResult("");
              })
            }
          />
          <button
            onClick={() =>
              act(() =>
                setResult(
                  Math.abs(Number(answer) - 2.44140625) < 0.001
                    ? "correct"
                    : "incorrect",
                ),
              )
            }
          >
            Check
          </button>
        </label>
        <aside>
          <h2>Instant feedback</h2>
          <output className={result}>
            {result === "correct" ? (
              <>
                <Check /> Correct: 2.4414
              </>
            ) : result === "incorrect" ? (
              <>
                <Lightbulb /> Use four Euler updates, not the exact value{" "}
                {practiceExact.toFixed(4)}.
              </>
            ) : (
              "—"
            )}
          </output>
        </aside>
      </section>
    </section>
  );
}

function Toggle({
  label,
  checked,
  set,
  act,
}: {
  label: string;
  checked: boolean;
  set: (value: boolean) => void;
  act: (run: () => void) => void;
}) {
  return (
    <label className="eul324-toggle">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => act(() => set(event.target.checked))}
      />
      {label}
    </label>
  );
}

function EulerGraph({
  equation,
  x0,
  y0,
  xmin,
  xmax,
  rows,
  step,
  field,
  eulerLayer,
  exactLayer,
  tangent,
  axes,
  onInitial,
}: {
  equation: Equation;
  x0: number;
  y0: number;
  xmin: number;
  xmax: number;
  rows: Row[];
  step: number;
  field: boolean;
  eulerLayer: boolean;
  exactLayer: boolean;
  tangent: boolean;
  axes: boolean;
  onInitial: (x: number, y: number) => void;
}) {
  const w = 350,
    h = 510,
    p = 18,
    ymin = -4,
    ymax = 5.5,
    model = models[equation];
  const sx = (x: number) => p + ((x - xmin) / (xmax - xmin)) * (w - 2 * p),
    sy = (y: number) => h - p - ((y - ymin) / (ymax - ymin)) * (h - 2 * p);
  const exact = Array.from({ length: 181 }, (_, i) => {
    const x = xmin + (i / 180) * (xmax - xmin);
    return `${i ? "L" : "M"}${sx(x)},${sy(model.exact(x, x0, y0))}`;
  }).join(" ");
  const euler = rows
    .map((row, i) => `${i ? "L" : "M"}${sx(row.x)},${sy(row.euler)}`)
    .join(" ");
  const current = rows[step],
    slope = model.slope(current.x, current.euler),
    span = 0.38;
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (e: PointerEvent) =>
      onInitial(
        xmin + ((e.clientX - box.left) / box.width) * (xmax - xmin),
        ymax - ((e.clientY - box.top) / box.height) * (ymax - ymin),
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg
      className="eul324-graph"
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Euler method graph"
    >
      {field && (
        <g className="field">
          {Array.from({ length: 300 }, (_, i) => {
            const col = i % 20,
              row = Math.floor(i / 20),
              x = xmin + (col / 19) * (xmax - xmin),
              y = ymin + (row / 14) * (ymax - ymin),
              m = model.slope(x, y),
              a = Math.atan(m),
              dx = Math.cos(a) * 5,
              dy = Math.sin(a) * 5;
            return (
              <line
                key={i}
                x1={sx(x) - dx}
                y1={sy(y) + dy}
                x2={sx(x) + dx}
                y2={sy(y) - dy}
              />
            );
          })}
        </g>
      )}
      {axes && (
        <g className="axes">
          <line x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
          <line x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
          {[-2, -1, 0, 1, 2]
            .filter((x) => x >= xmin && x <= xmax)
            .map((x) => (
              <text key={`x${x}`} x={sx(x)} y={sy(0) + 17}>
                {x}
              </text>
            ))}
          {[-4, -3, -1, 1, 2, 3, 4, 5].map((y) => (
            <text key={`y${y}`} x={sx(0) - 9} y={sy(y) + 3}>
              {y}
            </text>
          ))}
        </g>
      )}
      {exactLayer && <path className="exact" d={exact} />}{" "}
      {eulerLayer && (
        <>
          <path className="euler" d={euler} />
          {rows.map((row) => (
            <circle
              key={row.n}
              cx={sx(row.x)}
              cy={sy(row.euler)}
              r="3.3"
              className={row.n === step ? "current" : ""}
            />
          ))}
        </>
      )}
      {tangent && (
        <line
          className="tangent"
          x1={sx(current.x - span)}
          y1={sy(current.euler - slope * span)}
          x2={sx(current.x + span)}
          y2={sy(current.euler + slope * span)}
        />
      )}
      <circle
        data-drag="euler-initial"
        className="initial"
        cx={sx(x0)}
        cy={sy(y0)}
        r="7"
        onPointerDown={drag}
      />
    </svg>
  );
}
