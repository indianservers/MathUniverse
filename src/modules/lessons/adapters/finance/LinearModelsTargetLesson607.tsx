import { Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LinearModelsTargetLesson607.css";

const fmt = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
export default function LinearModelsTargetLesson607({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [slope, setSlope] = useState(800),
    [intercept, setIntercept] = useState(1000),
    [points, setPoints] = useState([0, 2, 4, 6, 8, 10]),
    [residuals, setResiduals] = useState(true),
    [dragging, setDragging] = useState(false),
    [tab, setTab] = useState("Interact"),
    [slopeAnswer, setSlopeAnswer] = useState(""),
    [interceptAnswer, setInterceptAnswer] = useState(""),
    [fareAnswer, setFareAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setSlope(800);
    setIntercept(1000);
    setPoints([0, 2, 4, 6, 8, 10]);
    setResiduals(true);
    setDragging(false);
    setTab("Interact");
    setSlopeAnswer("");
    setInterceptAnswer("");
    setFareAnswer("");
    setGraded(null);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const rows = useMemo(
    () =>
      points
        .slice()
        .sort((a, b) => a - b)
        .map((x) => ({ x, y: slope * x + intercept })),
    [points, slope, intercept],
  );
  const px = (x: number) => 60 + (x / 10) * 500,
    py = (y: number) => 285 - ((y + 2000) / 16000) * 245;
  const graphMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect(),
      x = Math.max(
        0,
        Math.min(10, ((event.clientX - rect.left) / rect.width) * 10),
      ),
      y = 14000 - ((event.clientY - rect.top) / rect.height) * 16000;
    act(() =>
      setSlope(
        Math.round(
          Math.max(-2000, Math.min(2000, (y - intercept) / Math.max(0.5, x))) /
            50,
        ) * 50,
      ),
    );
  };
  const addPoint = () =>
    act(() => {
      const candidates = [1, 3, 5, 7, 9];
      const next = candidates.find((x) => !points.includes(x));
      if (next !== undefined) setPoints((current) => [...current, next]);
    });
  const check = () =>
    act(() =>
      setGraded(
        Number(slopeAnswer) === 16 &&
          Number(interceptAnswer) === 50 &&
          Number(fareAnswer) === 242,
      ),
    );
  return (
    <section
      className="lm607-page"
      data-testid="finance-mockup-0664"
      data-object-model="dedicated-draggable-slope-intercept-linear-model"
      data-slope={slope}
      data-intercept={intercept}
      data-points={points.length}
      data-residuals={residuals}
      data-dragging={dragging}
      data-output={(slope * 10 + intercept).toFixed(0)}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="lm607-hero">
        <span>
          <b>LINEAR MODELS</b>
          <b>Lesson 607</b>
        </span>
        <h1>Linear Models: Finance and Modelling Lab</h1>
        <p>
          <b>Objective:</b> Model a constant rate of change with a linear
          equation and interpret the slope and intercept.
        </p>
        <dl>
          <b>Subject: Discrete &amp; Applied Math</b>
          <b>Grade: 10-12</b>
          <b>Estimated Time: 20 min</b>
          <b>Difficulty: Medium</b>
          <b>Skills: Linear modelling, slope, intercept, rate</b>
        </dl>
      </header>
      <nav className="lm607-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="lm607-note">
          <b>{tab}:</b> A constant rate of change produces a straight-line
          model.
        </p>
      )}
      <section className="lm607-journey">
        <b>YOUR LEARNING JOURNEY</b>
        <div>
          {[
            ["Observe", "See the model"],
            ["Manipulate", "Change slope & intercept"],
            ["Notice", "Spot the pattern"],
            ["Understand", "Learn the rule"],
            ["Try", "Solve on your own"],
          ].map(([title, text], index) => (
            <article key={title}>
              <b>
                {index + 1} {title}
              </b>
              <small>{text}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="lm607-lab">
        <main>
          <header>
            <h2>Interact: Build Your Linear Model</h2>
            <p>
              Drag the line or adjust the controls. The table and equation
              update instantly.
            </p>
          </header>
          <svg
            viewBox="0 0 620 340"
            aria-label="Interactive linear model graph"
            onPointerMove={graphMove}
            onPointerUp={() => setDragging(false)}
          >
            {[40, 89, 138, 187, 236, 285].map((y) => (
              <line className="grid" key={y} x1="60" x2="560" y1={y} y2={y} />
            ))}
            {[0, 2, 4, 6, 8, 10].map((x) => (
              <g key={x}>
                <line className="grid" x1={px(x)} x2={px(x)} y1="40" y2="285" />
                <text x={px(x) - 5} y="305">
                  {x}
                </text>
              </g>
            ))}
            <line x1="60" x2="560" y1={py(0)} y2={py(0)} />
            <line x1={px(0)} x2={px(0)} y1="35" y2="290" />
            <path
              d={`M${px(0)},${py(intercept)} L${px(10)},${py(slope * 10 + intercept)}`}
            />
            {rows.map((row) => (
              <g key={row.x}>
                {residuals && (
                  <line
                    className="residual"
                    x1={px(row.x)}
                    x2={px(row.x)}
                    y1={py(row.y)}
                    y2={py(row.y + (row.x % 4 === 0 ? 180 : 0))}
                  />
                )}
                <circle cx={px(row.x)} cy={py(row.y)} r="6" />
                <text x={px(row.x) - 16} y={py(row.y) - 12}>
                  {fmt(row.y)}
                </text>
              </g>
            ))}
          </svg>
          <div className="lm607-graph-actions">
            <button
              className={dragging ? "active" : ""}
              onPointerDown={() => act(() => setDragging(true))}
            >
              Drag Line
            </button>
            <button onClick={addPoint}>
              <Plus /> Add Point
            </button>
          </div>
          <dl>
            <span>
              Slope (m)<b>Rs {fmt(slope)} / step</b>
            </span>
            <span>
              Intercept (b)<b>Rs {fmt(intercept)}</b>
            </span>
            <span>
              Linear Model Output
              <b>Rs {fmt(slope * 10 + intercept)} at x = 10</b>
            </span>
          </dl>
        </main>
        <aside>
          <h2>Model Controls</h2>
          <Control
            label="Slope (rate of change) m"
            value={slope}
            min={-2000}
            max={2000}
            step={50}
            onChange={(value) => act(() => setSlope(value))}
          />
          <Control
            label="Intercept (start value) b"
            value={intercept}
            min={-5000}
            max={5000}
            step={100}
            onChange={(value) => act(() => setIntercept(value))}
          />
          <section>
            <h3>Equation</h3>
            <strong>
              y = mx + b<br />y = {fmt(slope)}x + {fmt(intercept)}
            </strong>
          </section>
          <section className="lm607-table">
            <h3>Rate Table</h3>
            <table>
              <thead>
                <tr>
                  <th>x steps</th>
                  <th>y</th>
                  <th>Change in y</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.x} className={row.x === 10 ? "active" : ""}>
                    <td>{row.x}</td>
                    <td>{fmt(row.y)}</td>
                    <td>
                      {index
                        ? `${slope >= 0 ? "+" : ""}${fmt(slope * (row.x - rows[index - 1].x))}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <label>
              Show residuals{" "}
              <input
                aria-label="Show residuals"
                type="checkbox"
                checked={residuals}
                onChange={(event) =>
                  act(() => setResiduals(event.target.checked))
                }
              />
            </label>
            <p>
              Data Points (observed)
              <br />
              {rows.map((row) => `(${row.x}, ${fmt(row.y)})`).join(" | ")}
            </p>
          </section>
        </aside>
      </section>
      <section className="lm607-theory">
        <article>
          <h2>Interpretation</h2>
          <p>
            <b>Slope (m):</b> Rs {fmt(slope)} per step
          </p>
          <p>
            For every additional step, the amount changes by Rs {fmt(slope)}.
          </p>
          <p>
            <b>Intercept (b):</b> Rs {fmt(intercept)}
            <br />
            At 0 steps, the starting amount is Rs {fmt(intercept)}.
          </p>
          <aside>
            In words: Starting with Rs {fmt(intercept)}, the value changes by Rs{" "}
            {fmt(slope)} for each step.
          </aside>
        </article>
        <article>
          <h2>Key Rule</h2>
          <p>A linear model has the form:</p>
          <strong>y = mx + b</strong>
          <p>
            <b>m</b> is the constant rate of change.
            <br />
            <b>b</b> is the starting value when x=0.
            <br />
            <b>y</b> is the predicted value for any x.
          </p>
        </article>
        <article>
          <h2>Common Misconception</h2>
          <p>
            <b>Mistake:</b> Thinking the slope is the starting value.
          </p>
          <p>
            <b>Why it is wrong:</b> The slope is how much y changes per step.
            The starting value is the value when x=0.
          </p>
          <p>
            <b>Check:</b> Set x=0 in your equation. You should get intercept b.
          </p>
        </article>
      </section>
      <section className="lm607-lower">
        <article>
          <h2>Worked Example</h2>
          <p>
            A subscription costs Rs 1,500 upfront and Rs 750 per month. Model
            the total cost y after x months.
          </p>
          <p>
            <b>1 Identify the parts</b>
            <br />
            Starting value b=1,500
            <br />
            Rate m=750 per month
          </p>
          <p>
            <b>2 Write the equation</b>
            <br />
            y=750x+1500
          </p>
          <p>
            <b>3 Find the cost after 8 months</b>
            <br />
            y=750(8)+1500=Rs 7,500
          </p>
          <svg viewBox="0 0 250 100">
            <line x1="15" x2="235" y1="85" y2="85" />
            <line x1="15" x2="15" y1="10" y2="85" />
            <line className="example" x1="15" y1="75" x2="225" y2="20" />
            <circle cx="185" cy="30" r="5" />
          </svg>
        </article>
        <article>
          <h2>Your Turn</h2>
          <p>
            <b>Challenge 1</b>
          </p>
          <p>
            A taxi charges Rs 50 as the base fare and Rs 16 per kilometer. Write
            the linear model and find the fare for 12 km.
          </p>
          <label>
            Equation: y ={" "}
            <input
              aria-label="Taxi slope"
              value={slopeAnswer}
              onChange={(event) =>
                act(() => {
                  setSlopeAnswer(event.target.value);
                  setGraded(null);
                })
              }
            />
            x +{" "}
            <input
              aria-label="Taxi intercept"
              value={interceptAnswer}
              onChange={(event) =>
                act(() => {
                  setInterceptAnswer(event.target.value);
                  setGraded(null);
                })
              }
            />
          </label>
          <label>
            Fare for 12 km: y = Rs{" "}
            <input
              aria-label="Taxi fare"
              value={fareAnswer}
              onChange={(event) =>
                act(() => {
                  setFareAnswer(event.target.value);
                  setGraded(null);
                })
              }
            />
          </label>
          <button onClick={check}>Check Answer</button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "Correct: y = 16x + 50 and y(12) = Rs 242."
                : "Use base fare as b and per-kilometer fare as m."}
          </output>
          <button onClick={() => act(() => setHint((value) => !value))}>
            Show hint
          </button>
          {hint && <small>Substitute x=12 into y=16x+50.</small>}
        </article>
      </section>
      <nav className="lm607-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/606-model-builder">
          &larr;{" "}
          <span>
            Previous Lesson<b>Model Builder</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/608-quadratic-models">
          <span>
            Next Lesson<b>Quadratic Models</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
      <button className="lm607-reset" onClick={() => act(reset)}>
        <RotateCcw /> Reset lesson
      </button>
    </section>
  );
}
function Control({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="lm607-control">
      <b>{label}</b>
      <span>
        <input
          aria-label={`${label} slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
      </span>
      <small>
        {min} to {max}
      </small>
    </label>
  );
}
