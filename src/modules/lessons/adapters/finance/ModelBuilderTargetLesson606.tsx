import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ModelBuilderTargetLesson606.css";

type Point = { x: number; y: number };
const defaults: Point[] = Array.from({ length: 6 }, (_, x) => ({
  x,
  y: 1000 + 800 * x,
}));
const num = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(
    value,
  );

function fitLinear(points: Point[]) {
  const n = points.length || 1,
    sx = points.reduce((s, p) => s + p.x, 0),
    sy = points.reduce((s, p) => s + p.y, 0),
    sxx = points.reduce((s, p) => s + p.x * p.x, 0),
    sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const denominator = n * sxx - sx * sx,
    slope = denominator ? (n * sxy - sx * sy) / denominator : 0,
    intercept = (sy - slope * sx) / n;
  const mean = sy / n,
    total = points.reduce((s, p) => s + (p.y - mean) ** 2, 0),
    residual = points.reduce(
      (s, p) => s + (p.y - (slope * p.x + intercept)) ** 2,
      0,
    );
  return {
    a: slope,
    b: intercept,
    r2: total ? 1 - residual / total : 1,
    predict: (x: number) => slope * x + intercept,
  };
}
function fitExponential(points: Point[]) {
  const safe = points.filter((point) => point.y > 0),
    logged = fitLinear(
      safe.map((point) => ({ x: point.x, y: Math.log(point.y) })),
    ),
    a = Math.exp(logged.b),
    b = Math.exp(logged.a);
  const mean = safe.reduce((s, p) => s + p.y, 0) / Math.max(1, safe.length),
    total = safe.reduce((s, p) => s + (p.y - mean) ** 2, 0),
    residual = safe.reduce((s, p) => s + (p.y - a * b ** p.x) ** 2, 0);
  return {
    a,
    b,
    r2: total ? 1 - residual / total : 1,
    predict: (x: number) => a * b ** x,
  };
}

function fitTwoPoint(points: Point[], relationship: "linear" | "exponential") {
  const first = points[0] ?? { x: 0, y: 0 };
  const last = points.at(-1) ?? first;
  const dx = last.x - first.x || 1;
  if (relationship === "linear") {
    const a = (last.y - first.y) / dx;
    const b = first.y - a * first.x;
    return { a, b, r2: 1, predict: (x: number) => a * x + b };
  }
  const b = first.y > 0 && last.y > 0 ? (last.y / first.y) ** (1 / dx) : 1;
  const a = first.y / b ** first.x;
  return { a, b, r2: 1, predict: (x: number) => a * b ** x };
}

export default function ModelBuilderTargetLesson606({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<Point[]>(defaults),
    [relationship, setRelationship] = useState<"linear" | "exponential">(
      "linear",
    ),
    [view, setView] = useState<"graph" | "table" | "equation">("graph"),
    [fitMethod, setFitMethod] = useState<"least-squares" | "two-point">(
      "least-squares",
    ),
    [tab, setTab] = useState("Interact"),
    [predictionX, setPredictionX] = useState(7),
    [modelAnswer, setModelAnswer] = useState(""),
    [costAnswer, setCostAnswer] = useState(""),
    [monthAnswer, setMonthAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [fitted, setFitted] = useState(true),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPoints(defaults);
    setRelationship("linear");
    setView("graph");
    setFitMethod("least-squares");
    setTab("Interact");
    setPredictionX(7);
    setModelAnswer("");
    setCostAnswer("");
    setMonthAnswer("");
    setGraded(null);
    setFitted(true);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const model = useMemo(() => {
    if (fitMethod === "two-point") return fitTwoPoint(points, relationship);
    return relationship === "linear"
      ? fitLinear(points)
      : fitExponential(points);
  }, [points, relationship, fitMethod]);
  const predicted = model.predict(predictionX),
    maxX = Math.max(10, predictionX, ...points.map((p) => p.x)),
    maxY = Math.max(7000, predicted, ...points.map((p) => p.y)) * 1.08;
  const px = (x: number) => 55 + (x / maxX) * 540,
    py = (y: number) => 275 - (y / maxY) * 225;
  const curve = Array.from({ length: 61 }, (_, index) => (index / 60) * maxX)
    .map((x, index) => `${index ? "L" : "M"}${px(x)},${py(model.predict(x))}`)
    .join(" ");
  const equation =
    relationship === "linear"
      ? `y = ${num(model.a, 2)}x + ${num(model.b, 2)}`
      : `y = ${num(model.a, 2)}(${model.b.toFixed(4)})^x`;
  const setPoint = (index: number, key: keyof Point, value: number) =>
    act(() => {
      setPoints((current) =>
        current.map((point, pointIndex) =>
          pointIndex === index ? { ...point, [key]: value } : point,
        ),
      );
      setFitted(false);
    });
  const addPoint = () =>
    act(() => {
      const x = points.length ? Math.max(...points.map((p) => p.x)) + 1 : 0;
      setPoints((current) => [
        ...current,
        { x, y: Math.round(model.predict(x)) },
      ]);
      setFitted(false);
    });
  const check = () =>
    act(() =>
      setGraded(
        modelAnswer.replace(/\s/g, "").toLowerCase() === "250x+500" &&
          Math.abs(Number(costAnswer) - 3250) < 0.01 &&
          Math.abs(Number(monthAnswer) - 18) < 0.01,
      ),
    );

  return (
    <section
      className="mb606-page"
      data-testid="finance-mockup-0663"
      data-object-model="dedicated-editable-data-regression-prediction-model"
      data-relationship={relationship}
      data-fit-method={fitMethod}
      data-points={points.length}
      data-a={model.a.toFixed(4)}
      data-b={model.b.toFixed(4)}
      data-r2={model.r2.toFixed(4)}
      data-prediction={predicted.toFixed(2)}
      data-fitted={fitted}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="mb606-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>Model Builder · Finance and Modelling Lab</h1>
          <p>Build and explore linear models from real scenarios.</p>
          <dl>
            <b>Level: Intermediate-Advanced</b>
            <b>Time: 6-10 min</b>
            <b>Type: Applied Modelling</b>
            <b>Focus: Linear models</b>
          </dl>
        </main>
        <aside>
          <b>Objective</b>
          <p>
            Build a linear model for a real scenario, interpret its components,
            and use it to make and validate predictions.
          </p>
        </aside>
      </header>
      <nav className="mb606-tabs">
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
        <p className="mb606-note">
          <b>{tab}:</b> A model connects variables through a fitted mathematical
          rule.
        </p>
      )}
      <section className="mb606-builder">
        <section className="mb606-observe">
          <h2>1 Observe &amp; Manipulate</h2>
          <p>Enter a real scenario and your data points.</p>
          <label>
            Scenario
            <textarea
              aria-label="Scenario"
              defaultValue="An app charges a one-time setup fee and then a fixed amount per month."
            />
          </label>
          <label>
            Variables
            <span>
              x = Number of months
              <br />y = Total cost (Rs)
            </span>
          </label>
          <b>Data points</b>
          <table>
            <thead>
              <tr>
                <th>Month (x)</th>
                <th>Total cost (y)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr key={index}>
                  <td>
                    <input
                      aria-label={`Point ${index + 1} x`}
                      type="number"
                      value={point.x}
                      onChange={(event) =>
                        setPoint(index, "x", +event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`Point ${index + 1} y`}
                      type="number"
                      value={point.y}
                      onChange={(event) =>
                        setPoint(index, "y", +event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      aria-label={`Remove point ${index + 1}`}
                      onClick={() =>
                        act(() => {
                          setPoints((current) =>
                            current.filter(
                              (_, pointIndex) => pointIndex !== index,
                            ),
                          );
                          setFitted(false);
                        })
                      }
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addPoint}>
            <Plus /> Add data point
          </button>
        </section>
        <section className="mb606-manipulate">
          <h2>2 Manipulate</h2>
          <p>Choose model type and fit the model.</p>
          <label>
            Relationship type
            <span>
              <button
                className={relationship === "linear" ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setRelationship("linear");
                    setFitted(false);
                  })
                }
              >
                Linear
              </button>
              <button
                className={relationship === "exponential" ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setRelationship("exponential");
                    setFitted(false);
                  })
                }
              >
                Exponential
              </button>
            </span>
          </label>
          <label>
            Fit method
            <select
              aria-label="Fit method"
              value={fitMethod}
              onChange={(event) =>
                act(() => {
                  setFitMethod(event.target.value as typeof fitMethod);
                  setFitted(false);
                })
              }
            >
              <option value="least-squares">Least Squares (Best Fit)</option>
              <option value="two-point">Two-point fit</option>
            </select>
          </label>
          <button onClick={() => act(() => setFitted(true))}>Fit Model</button>
          <aside className={fitted ? "fit" : ""}>
            <b>{fitted ? "Model fitted" : "Refit required"}</b>
            <p>
              {fitted
                ? "Your data fits the displayed model."
                : "Data changed. Fit the model again."}
            </p>
          </aside>
          <dl>
            <span>
              {relationship === "linear" ? "Slope (m)" : "Initial (a)"}
              <b>{num(model.a, 2)}</b>
            </span>
            <span>
              {relationship === "linear" ? "Intercept (b)" : "Factor (b)"}
              <b>{num(model.b, 4)}</b>
            </span>
            <span>
              R<sup>2</sup>
              <b>{model.r2.toFixed(4)}</b>
            </span>
          </dl>
        </section>
        <section className="mb606-model">
          <h2>Model &amp; Data</h2>
          {view === "graph" && (
            <svg viewBox="0 0 650 315" aria-label="Fitted model graph">
              {[50, 95, 140, 185, 230, 275].map((y) => (
                <line className="grid" key={y} x1="55" x2="595" y1={y} y2={y} />
              ))}
              <line x1="55" x2="55" y1="40" y2="275" />
              <line x1="55" x2="595" y1="275" y2="275" />
              <path d={curve} />
              {points.map((point, index) => (
                <g key={index}>
                  <circle cx={px(point.x)} cy={py(point.y)} r="5" />
                  <text x={px(point.x) - 12} y={py(point.y) - 10}>
                    {num(point.y)}
                  </text>
                </g>
              ))}
            </svg>
          )}
          {view === "table" && (
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>Observed y</th>
                  <th>Predicted y</th>
                  <th>Residual</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point, index) => (
                  <tr key={index}>
                    <td>{point.x}</td>
                    <td>{num(point.y, 2)}</td>
                    <td>{num(model.predict(point.x), 2)}</td>
                    <td>{num(point.y - model.predict(point.x), 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {view === "equation" && (
            <div className="equation">
              <b>Your fitted model</b>
              <strong>{equation}</strong>
              <p>
                R<sup>2</sup> = {model.r2.toFixed(4)}
              </p>
            </div>
          )}
          <nav>
            {["graph", "table", "equation"].map((name) => (
              <button
                key={name}
                className={view === name ? "active" : ""}
                onClick={() => act(() => setView(name as typeof view))}
              >
                {name}
              </button>
            ))}
          </nav>
        </section>
      </section>
      <section className="mb606-middle">
        <article>
          <h2>3 Notice the pattern</h2>
          <p>Look for a constant change.</p>
          <table>
            <thead>
              <tr>
                <th>From x</th>
                <th>To x</th>
                <th>Delta x</th>
                <th>y changes</th>
                <th>Delta y</th>
                <th>Delta y / Delta x</th>
              </tr>
            </thead>
            <tbody>
              {points.slice(0, -1).map((point, index) => {
                const next = points[index + 1],
                  dx = next.x - point.x,
                  dy = next.y - point.y;
                return (
                  <tr key={index}>
                    <td>{point.x}</td>
                    <td>{next.x}</td>
                    <td>{num(dx, 2)}</td>
                    <td>
                      {num(point.y)} to {num(next.y)}
                    </td>
                    <td>{num(dy, 2)}</td>
                    <td>{dx ? num(dy / dx, 2) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <aside>
            The change is approximately {num(model.a, 2)} for every 1 increase
            in x.
          </aside>
        </article>
        <article>
          <h2>4 Understand the rule</h2>
          <p>
            {relationship === "linear"
              ? "Linear model: y = mx + b"
              : "Exponential model: y = ab^x"}
          </p>
          <strong>Your model: {equation}</strong>
          <aside>
            <b>
              {relationship === "linear"
                ? `Slope = ${num(model.a, 2)}`
                : `Growth factor = ${num(model.b, 4)}`}
            </b>
            <p>Interpret the rate of change in context.</p>
          </aside>
          <aside>
            <b>
              {relationship === "linear"
                ? `Intercept = ${num(model.b, 2)}`
                : `Initial value = ${num(model.a, 2)}`}
            </b>
            <p>Interpret the starting value in context.</p>
          </aside>
          <footer>
            <b>Common misconception</b>
            <p>Do not confuse the rate of change with the starting value.</p>
          </footer>
        </article>
      </section>
      <section className="mb606-lower">
        <article>
          <h2>5 Try independently</h2>
          <p>Predict and check.</p>
          <label>
            Make a prediction
            <input
              aria-label="Prediction x"
              type="number"
              value={predictionX}
              onChange={(event) =>
                act(() => setPredictionX(+event.target.value))
              }
            />
            <button onClick={() => act(() => setPredictionX(predictionX))}>
              Predict y
            </button>
          </label>
          <strong>
            Predicted total cost (Rs)<b>{num(predicted, 2)}</b>
          </strong>
          <p>
            Check using the model
            <br />
            {equation}
            <br />= {num(predicted, 2)}
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>
            A co-working space charges a Rs 1,500 registration fee and Rs 1,200
            per month.
          </p>
          <p>
            <b>Build the model.</b>
            <br />y = 1200x + 1500
          </p>
          <p>
            <b>Find the cost after 9 months.</b>
            <br />y = 1200(9) + 1500 = Rs 12,300
          </p>
          <svg viewBox="0 0 300 100">
            <line x1="20" x2="285" y1="85" y2="85" />
            <line x1="20" x2="20" y1="10" y2="85" />
            <line className="example" x1="20" y1="80" x2="260" y2="15" />
            <circle cx="235" cy="23" r="5" />
          </svg>
        </article>
        <article>
          <h2>Challenge</h2>
          <p>
            A streaming service has a Rs 500 signup fee and Rs 250 per month.
          </p>
          <label>
            1 Write the linear model y = mx + b.
            <span>
              y ={" "}
              <input
                aria-label="Challenge model"
                value={modelAnswer}
                onChange={(event) =>
                  act(() => {
                    setModelAnswer(event.target.value);
                    setGraded(null);
                  })
                }
              />
            </span>
          </label>
          <label>
            2 How much will it cost after 11 months?
            <span>
              y ={" "}
              <input
                aria-label="Challenge cost"
                value={costAnswer}
                onChange={(event) =>
                  act(() => {
                    setCostAnswer(event.target.value);
                    setGraded(null);
                  })
                }
              />
            </span>
          </label>
          <label>
            3 How many months to reach Rs 5,000?
            <span>
              x ={" "}
              <input
                aria-label="Challenge months"
                value={monthAnswer}
                onChange={(event) =>
                  act(() => {
                    setMonthAnswer(event.target.value);
                    setGraded(null);
                  })
                }
              />
            </span>
          </label>
          <button onClick={check}>Check answers</button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "All three answers are correct."
                : "Check slope, intercept, and substitution."}
          </output>
        </article>
      </section>
      <nav className="mb606-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/605-investment-comparison">
          &larr;{" "}
          <span>
            Previous Lesson<b>Investment Comparison</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/607-linear-models">
          <span>
            Next Lesson<b>Linear Models</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
    </section>
  );
}
