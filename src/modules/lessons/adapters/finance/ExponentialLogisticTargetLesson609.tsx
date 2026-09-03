import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ExponentialLogisticTargetLesson609.css";

type Kind = "growth" | "decay" | "logistic";
const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
export default function ExponentialLogisticTargetLesson609({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [kind, setKind] = useState<Kind>("logistic"),
    [p0, setP0] = useState(1000),
    [capacity, setCapacity] = useState(10000),
    [rate, setRate] = useState(0.44),
    [step, setStep] = useState(1),
    [tab, setTab] = useState("Interact"),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setKind("logistic");
    setP0(1000);
    setCapacity(10000);
    setRate(0.44);
    setStep(1);
    setTab("Interact");
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const model = useMemo(() => {
    const safeP = Math.max(1, p0),
      safeK = Math.max(safeP + 1, capacity),
      A = (safeK - safeP) / safeP,
      t0 = Math.log(A) / Math.max(0.01, rate),
      value = (t: number) =>
        kind === "growth"
          ? safeP * Math.exp(rate * t)
          : kind === "decay"
            ? safeP * Math.exp(-rate * t)
            : safeK / (1 + A * Math.exp(-rate * t));
    return {
      A,
      t0,
      value,
      limit: kind === "logistic" ? safeK : kind === "decay" ? 0 : Infinity,
    };
  }, [p0, capacity, rate, kind]);
  const rows = Array.from({ length: 11 }, (_, index) => {
      const t = index * step;
      return { t, value: model.value(t) };
    }),
    max = Math.max(capacity, ...rows.map((row) => row.value)) * 1.12,
    px = (t: number) => 55 + (t / (10 * step)) * 550,
    py = (value: number) => 275 - (value / max) * 225,
    path = Array.from({ length: 101 }, (_, index) => (index / 10) * step)
      .map((t, index) => `${index ? "L" : "M"}${px(t)},${py(model.value(t))}`)
      .join(" ");
  const setInflection = (time: number) =>
    act(() => setRate(Math.log(model.A) / Math.max(0.1, time)));
  const challengeA = (8000 - 500) / 500,
    challengeValue = 8000 / (1 + challengeA * Math.exp(-0.8 * 6)),
    challengeT0 = Math.log(challengeA) / 0.8;
  return (
    <section
      className="el609-page"
      data-testid="finance-mockup-0666"
      data-object-model="dedicated-exponential-decay-logistic-saturation-model"
      data-kind={kind}
      data-p0={p0}
      data-capacity={capacity}
      data-rate={rate.toFixed(4)}
      data-inflection={model.t0.toFixed(4)}
      data-p5={model.value(5).toFixed(2)}
      data-p10={model.value(10).toFixed(2)}
      data-rows={rows.length}
      data-actions={actions}
    >
      <header className="el609-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>Exponential and Logistic Models</h1>
          <p>Compare growth, decay, and logistic saturation.</p>
        </main>
        <aside>
          <b>Level: Intermediate-Advanced</b>
          <b>Lab: Applied Modelling Lab</b>
          <b>Time: 6-10 min</b>
          <b>Language: English (English)</b>
        </aside>
      </header>
      <nav className="el609-tabs">
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
        <p className="el609-note">
          <b>{tab}:</b> Exponential change compounds; logistic growth approaches
          a carrying capacity.
        </p>
      )}
      <section className="el609-lab">
        <header>
          <div>
            <h2>1 Observe &amp; Manipulate the model</h2>
            <p>
              Adjust parameters to explore exponential growth, decay, and
              logistic saturation.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset all
          </button>
        </header>
        <div>
          <aside>
            <h3>Model type</h3>
            <nav>
              {(["growth", "decay", "logistic"] as Kind[]).map((name) => (
                <button
                  key={name}
                  className={kind === name ? "active" : ""}
                  onClick={() => act(() => setKind(name))}
                >
                  {name}
                </button>
              ))}
            </nav>
            <h3>Model equation</h3>
            <strong>
              {kind === "logistic"
                ? "P(t) = K / (1 + Ae^(-rt))"
                : kind === "growth"
                  ? "P(t) = P0 e^(rt)"
                  : "P(t) = P0 e^(-rt)"}
            </strong>
            <Control
              label="Initial value P0"
              value={p0}
              min={100}
              max={50000}
              step={100}
              onChange={(value) =>
                act(() => setP0(Math.min(value, capacity - 1)))
              }
            />
            {kind === "logistic" && (
              <Control
                label="Carrying capacity K"
                value={capacity}
                min={1000}
                max={500000}
                step={1000}
                onChange={(value) =>
                  act(() => setCapacity(Math.max(value, p0 + 1)))
                }
              />
            )}
            <Control
              label="Growth rate r (per time unit)"
              value={rate}
              min={0.01}
              max={5}
              step={0.01}
              onChange={(value) => act(() => setRate(value))}
            />
            {kind === "logistic" && (
              <Control
                label="Inflection time t0"
                value={model.t0}
                min={0.1}
                max={20}
                step={0.1}
                onChange={setInflection}
              />
            )}
            <section className="el609-derived">
              <b>Derived values</b>
              {kind === "logistic" ? (
                <>
                  <p>A=(K-P0)/P0 = {model.A.toFixed(4)}</p>
                  <p>
                    Inflection point ({model.t0.toFixed(2)},{" "}
                    {cash(capacity / 2)})
                  </p>
                </>
              ) : (
                <p>
                  {kind === "growth" ? "Doubling" : "Half-life"} time ={" "}
                  {(Math.log(2) / rate).toFixed(3)}
                </p>
              )}
            </section>
          </aside>
          <main>
            <section className="el609-cards">
              <span>
                P(0)<b>{cash(model.value(0))}</b>
              </span>
              <span>
                P(5)<b>{cash(model.value(5))}</b>
              </span>
              <span>
                P(10)<b>{cash(model.value(10))}</b>
              </span>
              <span>
                Limit t to infinity
                <b>
                  {Number.isFinite(model.limit)
                    ? cash(model.limit)
                    : "Unbounded"}
                </b>
              </span>
            </section>
            <section className="el609-chart">
              <svg
                viewBox="0 0 650 315"
                aria-label="Exponential and logistic model graph"
              >
                {[50, 95, 140, 185, 230, 275].map((y) => (
                  <line
                    className="grid"
                    key={y}
                    x1="55"
                    x2="605"
                    y1={y}
                    y2={y}
                  />
                ))}
                <line x1="55" x2="55" y1="35" y2="275" />
                <line x1="55" x2="605" y1="275" y2="275" />
                {kind === "logistic" && (
                  <>
                    <line
                      className="capacity"
                      x1="55"
                      x2="605"
                      y1={py(capacity)}
                      y2={py(capacity)}
                    />
                    <line
                      className="inflection"
                      x1={px(model.t0)}
                      x2={px(model.t0)}
                      y1={py(capacity / 2)}
                      y2="275"
                    />
                  </>
                )}
                <path d={path} />
                {rows.map((row) => (
                  <circle key={row.t} cx={px(row.t)} cy={py(row.value)} r="3" />
                ))}
              </svg>
            </section>
            <section className="el609-table">
              <header>
                Values table (linked to graph)
                <label>
                  Step:{" "}
                  <input
                    aria-label="Table step"
                    type="number"
                    min=".5"
                    max="2"
                    step=".5"
                    value={step}
                    onChange={(event) =>
                      act(() => setStep(+event.target.value))
                    }
                  />
                </label>
              </header>
              <table>
                <tbody>
                  <tr>
                    <th>t</th>
                    {rows.map((row) => (
                      <td key={row.t}>{row.t}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>P(t)</th>
                    {rows.map((row) => (
                      <td key={row.t}>{cash(row.value)}</td>
                    ))}
                  </tr>
                  {kind === "logistic" && (
                    <tr>
                      <th>% of K</th>
                      {rows.map((row) => (
                        <td key={row.t}>
                          {((row.value / capacity) * 100).toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
            <aside className="el609-cue">
              <b>Misconception cue</b> Logistic growth slows as it approaches
              carrying capacity K.
            </aside>
          </main>
        </div>
      </section>
      <section className="el609-theory">
        <article>
          <h2>2 Notice the pattern</h2>
          <p>Starts near P0 and changes faster.</p>
          <p>At t=t0, population=K/2.</p>
          <p>After the inflection point, logistic growth slows.</p>
          <p>The curve levels off and approaches K.</p>
        </article>
        <article>
          <h2>3 Understand the rule</h2>
          <p>Logistic model with carrying capacity K:</p>
          <strong>P(t)=K/(1+Ae^(-rt))</strong>
          <p>
            r controls growth rate.
            <br />K is the long-term limit.
            <br />
            Inflection at t0=(ln A)/r.
          </p>
        </article>
        <article>
          <h2>4 Try independently</h2>
          <p>
            A species has P0=500, K=8000, r=.80. Estimate P(6) and inflection
            time t0.
          </p>
          <button onClick={() => act(() => setSolution((value) => !value))}>
            Reveal solution
          </button>
          {solution && (
            <aside>
              <b>Answer:</b>
              <br />
              P(6) ≈ {cash(challengeValue)}
              <br />
              t0 ≈ {challengeT0.toFixed(2)}
            </aside>
          )}
        </article>
      </section>
      <section className="el609-worked">
        <main>
          <h2>Worked Example (Fully solved)</h2>
          <p>
            Given P0={p0}, K={capacity}, r={rate.toFixed(2)}.
          </p>
          <p>
            <b>(a) Find A.</b>
            <br />
            A=(K-P0)/P0={model.A.toFixed(4)}
          </p>
          <p>
            <b>(b) Find t0.</b>
            <br />
            t0=ln(A)/r={model.t0.toFixed(4)}
          </p>
          <p>
            <b>(c) Find P(5).</b>
            <br />
            P(5)={cash(model.value(5))}
          </p>
        </main>
        <aside>
          <p>A={model.A.toFixed(4)}</p>
          <p>t0={model.t0.toFixed(4)}</p>
          <p>P(5)={cash(model.value(5))}</p>
          <b>Correct</b>
        </aside>
      </section>
      <nav className="el609-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/608-quadratic-models">
          &larr;{" "}
          <span>
            Previous<b>Quadratic Models</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/610-periodic-models">
          <span>
            Next<b>Periodic Models</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
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
    <label className="el609-control">
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
          value={Number(value.toFixed(2))}
          onChange={(event) => onChange(+event.target.value)}
        />
      </span>
      <small>
        Range: {min.toLocaleString()} - {max.toLocaleString()}
      </small>
    </label>
  );
}
