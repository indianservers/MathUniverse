import { Maximize2, Minus, Plus, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PowerSeriesTargetLesson343.css";

type Target = "cos x" | "sin x" | "e^x" | "1 / (1 - x)";
const tabs = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
const clean = (value: number) => Number(value.toFixed(8));
const factorial = (n: number) => {
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
};
const coefficientsFor = (target: Target, center: number, count: number) =>
  Array.from({ length: count }, (_, n) => {
    if (target === "cos x")
      return Math.cos(center + (n * Math.PI) / 2) / factorial(n);
    if (target === "sin x")
      return Math.sin(center + (n * Math.PI) / 2) / factorial(n);
    if (target === "e^x") return Math.exp(center) / factorial(n);
    if (Math.abs(1 - center) < 1e-9) return 0;
    return 1 / (1 - center) ** (n + 1);
  });
const targetValue = (target: Target, x: number) =>
  target === "cos x"
    ? Math.cos(x)
    : target === "sin x"
      ? Math.sin(x)
      : target === "e^x"
        ? Math.exp(x)
        : 1 / (1 - x);
const formatCoefficient = (value: number) => {
  if (Math.abs(value) < 1e-10) return "0";
  const reciprocal = Math.round(1 / Math.abs(value));
  if (reciprocal > 1 && Math.abs(Math.abs(value) - 1 / reciprocal) < 1e-8)
    return `${value < 0 ? "-" : ""}1/${reciprocal}`;
  return clean(value).toString();
};
const parseCoefficient = (text: string) => {
  const normalized = text.trim();
  if (normalized.includes("/")) {
    const [a, b] = normalized.split("/").map(Number);
    return b ? a / b : 0;
  }
  return Number(normalized) || 0;
};

export default function PowerSeriesTargetLesson343({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [center, setCenter] = useState(0),
    [target, setTarget] = useState<Target>("cos x"),
    [mode, setMode] = useState<"Preset" | "Manual">("Manual");
  const [manual, setManual] = useState(() => coefficientsFor("cos x", 0, 9));
  const [degree, setDegree] = useState(8),
    [range, setRange] = useState(1.5 * Math.PI),
    [tab, setTab] = useState(tabs[0]);
  const [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [question, setQuestion] = useState(0),
    [fullscreen, setFullscreen] = useState(false),
    [actions, setActions] = useState(0);
  const coefficients =
    mode === "Preset"
      ? coefficientsFor(target, center, Math.max(9, degree + 1))
      : manual;
  const active = coefficients.slice(0, degree + 1);
  const partialAt = (x: number) =>
    active.reduce(
      (sum, coefficient, n) => sum + coefficient * (x - center) ** n,
      0,
    );
  const sampleXs = Array.from(
    { length: 81 },
    (_, index) => center - range + (2 * range * index) / 80,
  );
  const graphPoints = sampleXs
    .map((x) => ({ x, target: targetValue(target, x), partial: partialAt(x) }))
    .filter(
      (point) => Number.isFinite(point.target) && Math.abs(point.target) < 20,
    );
  const maxError = Math.max(
    ...graphPoints.map((point) => Math.abs(point.partial - point.target)),
    0,
  );
  const finitePairs = coefficients
    .map((value, index) => ({ value, index }))
    .filter((item) => item.index > 0 && Math.abs(item.value) > 1e-12);
  const rootEstimates = finitePairs
    .map((item) => 1 / Math.abs(item.value) ** (1 / item.index))
    .filter(Number.isFinite);
  const manualCosine = manual
    .slice(0, 9)
    .every(
      (value, index) =>
        Math.abs(value - coefficientsFor("cos x", center, 9)[index]) < 1e-8,
    );
  const manualRadius = rootEstimates.length
    ? rootEstimates.slice(-3).reduce((sum, value) => sum + value, 0) /
      Math.min(3, rootEstimates.length)
    : Infinity;
  const radius =
    mode === "Preset"
      ? target === "1 / (1 - x)"
        ? Math.abs(1 - center)
        : Infinity
      : manualCosine
        ? Infinity
        : manualRadius;
  const interval = Number.isFinite(radius)
    ? `(${clean(center - radius)}, ${clean(center + radius)})`
    : "(-∞, ∞)";
  const recognized =
    mode === "Preset"
      ? target
      : target === "cos x" && manualCosine
        ? "cos x"
        : "Custom series";
  const expanded =
    active
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => Math.abs(value) > 1e-10)
      .map(({ value, index }, termIndex) => {
        const sign = value < 0 ? "−" : termIndex ? "+" : "";
        const magnitude = formatCoefficient(Math.abs(value));
        const power =
          index === 0
            ? ""
            : index === 1
              ? `(x${center ? `−${center}` : ""})`
              : `(x${center ? `−${center}` : ""})^${index}`;
        return `${sign} ${magnitude === "1" && power ? "" : magnitude}${power}`;
      })
      .join(" ") || "0";
  const reset = () => {
    setCenter(0);
    setTarget("cos x");
    setMode("Manual");
    setManual(coefficientsFor("cos x", 0, 9));
    setDegree(8);
    setRange(1.5 * Math.PI);
    setTab(tabs[0]);
    setQuick("");
    setQuestion(0);
    setFullscreen(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeCenter = (value: number) =>
    act(() => {
      setCenter(clean(value));
      setQuick("");
    });
  const changeTarget = (value: Target) =>
    act(() => {
      setTarget(value);
      if (mode === "Preset")
        setManual(coefficientsFor(value, center, Math.max(9, degree + 1)));
      setQuick("");
    });
  const setCoefficient = (index: number, value: number) =>
    act(() => {
      setMode("Manual");
      setManual((current) => {
        const next = [...current];
        next[index] = clean(value);
        return next;
      });
      setQuick("");
    });
  const graphMin = Math.min(
      -2,
      ...graphPoints.flatMap((point) => [point.target, point.partial]),
    ),
    graphMax = Math.max(
      2,
      ...graphPoints.flatMap((point) => [point.target, point.partial]),
    );
  const gx = (x: number) => 36 + ((x - (center - range)) / (2 * range)) * 544,
    gy = (y: number) =>
      190 - ((y - graphMin) / Math.max(0.01, graphMax - graphMin)) * 160;
  const pathFor = (key: "target" | "partial") =>
    graphPoints
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${gx(point.x).toFixed(2)} ${gy(point[key]).toFixed(2)}`,
      )
      .join(" ");
  const dragApproximation = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1 || degree === 0) return;
    const svg = event.currentTarget.ownerSVGElement,
      rect = svg?.getBoundingClientRect();
    if (!rect) return;
    const localY = ((event.clientY - rect.top) / rect.height) * 220;
    const desired = graphMin + ((190 - localY) / 160) * (graphMax - graphMin);
    const x = center + range * 0.72,
      base = (x - center) ** degree;
    if (Math.abs(base) < 1e-10) return;
    const lower = active
      .slice(0, degree)
      .reduce(
        (sum, coefficient, n) => sum + coefficient * (x - center) ** n,
        0,
      );
    setCoefficient(degree, (desired - lower) / base);
  };
  const challenges = [
    {
      label: "For the cosine power series, what is R?",
      choices: ["0", "1", "∞", "π"],
      correct: 2,
    },
    {
      label: "For Σ xⁿ, what is R?",
      choices: ["0", "1", "2", "∞"],
      correct: 1,
    },
  ];
  return (
    <section
      className={`seq343-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="sequence-mockup-0528"
      data-object-model="centered-power-series-preset-taylor-coefficients-manual-coefficient-editor-target-function-partial-sum-graph-draggable-highest-coefficient-truncation-error-radius-estimator-convergence-interval-endpoint-tests-expanded-polynomial-multi-question-practice"
      data-center={center}
      data-target={target}
      data-mode={mode}
      data-degree={degree}
      data-range={clean(range)}
      data-coefficients={coefficients.map(clean).join(",")}
      data-radius={Number.isFinite(radius) ? clean(radius) : "infinity"}
      data-interval={interval}
      data-error={clean(maxError)}
      data-recognized={recognized}
      data-tab={tab}
      data-question={question}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq343-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>SEQUENCES AND SERIES</b>
          </span>
          <h1>Power Series</h1>
          <p>Represent functions as infinite polynomials.</p>
          <div>
            {[
              "Intermediate-Advanced",
              "Exploration Lab",
              "Sequence / CAS",
              "6-10 min",
            ].map((item) => (
              <b key={item}>{item}</b>
            ))}
          </div>
          <nav>
            <select aria-label="Language">
              <option>English (English)</option>
              <option>Hindi (Hindi)</option>
            </select>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={() => act(() => {})}>
              <Share2 />
              Share
            </button>
            <button onClick={() => act(() => {})}>Workspace</button>
          </nav>
        </div>
        <aside>
          <b>Learning Objective</b>
          <p>
            Explore power series of the form Σ aₙ(x-c)ⁿ, estimate the radius of
            convergence, test endpoints, and see how partial sums approximate a
            target function.
          </p>
        </aside>
      </header>
      <nav className="seq343-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="seq343-lab">
        <header>
          <div>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>Power Series Exploration Lab</h2>
          </div>
          <span>● All systems ready</span>
          <b>{actions} actions</b>
          <button
            title="Fullscreen"
            onClick={() => act(() => setFullscreen((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="seq343-main">
          <aside className="seq343-controls">
            <h2>1. Define your power series</h2>
            <label>
              Center c{" "}
              <span>
                <button
                  aria-label="Decrease center"
                  onClick={() => changeCenter(center - 1)}
                >
                  <Minus />
                </button>
                <input
                  aria-label="Power series center"
                  type="number"
                  value={center}
                  onChange={(event) => changeCenter(Number(event.target.value))}
                />
                <button
                  aria-label="Increase center"
                  onClick={() => changeCenter(center + 1)}
                >
                  <Plus />
                </button>
              </span>
            </label>
            <b>Coefficient input mode</b>
            <div className="seq343-mode">
              {(["Preset", "Manual"] as const).map((item) => (
                <button
                  className={mode === item ? "active" : ""}
                  key={item}
                  onClick={() =>
                    act(() => {
                      setMode(item);
                      setManual(
                        coefficientsFor(
                          target,
                          center,
                          Math.max(9, degree + 1),
                        ),
                      );
                    })
                  }
                >
                  {item}
                </button>
              ))}
            </div>
            <p>Enter coefficients aₙ for n = 0, 1, 2, ...</p>
            <table className="seq343-coefficients">
              <tbody>
                {coefficients
                  .slice(0, Math.max(9, degree + 1))
                  .map((value, index) => (
                    <tr key={index}>
                      <th scope="row">
                        a<sub>{index}</sub>
                      </th>
                      <td>
                        <input
                          aria-label={`Coefficient a${index}`}
                          value={formatCoefficient(value)}
                          disabled={mode === "Preset"}
                          onChange={(event) =>
                            setCoefficient(
                              index,
                              parseCoefficient(event.target.value),
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              className="seq343-add"
              onClick={() =>
                act(() => {
                  setMode("Manual");
                  setManual((current) => [...current, 0]);
                })
              }
            >
              <Plus />
              Add terms
            </button>
            <article>
              <b>Recognized series</b>
              <strong>✓ {recognized}</strong>
              <p>
                {recognized === "cos x"
                  ? "cos x = Σ (-1)ⁿx²ⁿ/(2n)!"
                  : `Centered at c = ${center}`}
              </p>
            </article>
          </aside>
          <main>
            <section className="seq343-graph">
              <h2>2. Partial sums vs target function</h2>
              <header>
                <label>
                  Target function f(x)
                  <select
                    aria-label="Target function"
                    value={target}
                    onChange={(event) =>
                      changeTarget(event.target.value as Target)
                    }
                  >
                    <option>cos x</option>
                    <option>sin x</option>
                    <option>e^x</option>
                    <option>1 / (1 - x)</option>
                  </select>
                </label>
                <label>
                  Number of terms N
                  <input
                    aria-label="Truncation degree"
                    type="range"
                    min="1"
                    max="12"
                    value={degree}
                    onChange={(event) =>
                      act(() => setDegree(Number(event.target.value)))
                    }
                  />
                  <input
                    aria-label="Truncation degree number"
                    type="number"
                    min="1"
                    max="12"
                    value={degree}
                    onChange={(event) =>
                      act(() =>
                        setDegree(
                          Math.max(1, Math.min(12, Number(event.target.value))),
                        ),
                      )
                    }
                  />
                </label>
                <div>
                  <b>━ Partial sum Sₙ(x)</b>
                  <b>┄ Target f(x)</b>
                </div>
              </header>
              <svg
                viewBox="0 0 620 220"
                role="img"
                aria-label="Power series approximation plot"
              >
                <path className="axis" d="M30 190H590M310 15V200" />
                <path className="target" d={pathFor("target")} />
                <path className="partial" d={pathFor("partial")} />
                <circle
                  data-drag="power-series-coefficient"
                  cx={gx(center + range * 0.72)}
                  cy={gy(partialAt(center + range * 0.72))}
                  r="7"
                  onPointerDown={(event) =>
                    event.currentTarget.setPointerCapture(event.pointerId)
                  }
                  onPointerMove={dragApproximation}
                />
              </svg>
              <footer>
                <output>
                  Max |Sₙ(x) − f(x)|: <b>{clean(maxError)}</b>
                  <span>{maxError < 0.05 ? "Good" : "Refine"}</span>
                </output>
                <label>
                  x range{" "}
                  <input
                    aria-label="Power series x range"
                    type="range"
                    min={0.5}
                    max={6.28}
                    step={0.1}
                    value={range}
                    onChange={(event) =>
                      act(() => setRange(Number(event.target.value)))
                    }
                  />
                  <b>± {clean(range / Math.PI)}π</b>
                </label>
              </footer>
            </section>
            <section className="seq343-analysis">
              <article>
                <h2>3. Convergence interval</h2>
                <p>Interval of convergence</p>
                <strong>{interval}</strong>
                <div className="number-line">
                  <i />
                  <b>c = {center}</b>
                </div>
                <small>
                  {Number.isFinite(radius)
                    ? "Endpoint tests determine inclusion."
                    : "The series converges for every real x."}
                </small>
              </article>
              <article>
                <h2>4. Radius of convergence (estimator)</h2>
                <p>Cauchy-Hadamard estimate</p>
                <strong>R = 1 / lim sup ⁿ√|aₙ|</strong>
                <output>{Number.isFinite(radius) ? clean(radius) : "∞"}</output>
                <small>Derived from the active coefficient sequence.</small>
              </article>
              <article>
                <h2>5. Endpoint tests</h2>
                <div>
                  <span>
                    <b>At x = c − R</b>
                    <p>
                      {Number.isFinite(radius)
                        ? target === "1 / (1 - x)"
                          ? "Diverges"
                          : "Inspect alternating/root test"
                        : "Converges for all x ∈ R"}
                    </p>
                  </span>
                  <span>
                    <b>At x = c + R</b>
                    <p>
                      {Number.isFinite(radius)
                        ? target === "1 / (1 - x)"
                          ? "Diverges"
                          : "Inspect alternating/root test"
                        : "Converges for all x ∈ R"}
                    </p>
                  </span>
                </div>
              </article>
              <article>
                <h2>6. Current partial sum (N = {degree})</h2>
                <p>Series</p>
                <strong>S{degree}(x) = Σ aₙ(x−c)ⁿ</strong>
                <p>Expanded form</p>
                <output>{expanded}</output>
              </article>
            </section>
          </main>
        </div>
      </section>
      <section className="seq343-insights">
        <article>
          <b>Key Insight</b>
          <p>
            Power series give global or local polynomial approximations. The
            radius R tells us how far the approximation stays valid.
          </p>
        </article>
        <article>
          <b>Common Misconception</b>
          <p>
            A large but finite N guarantees convergence everywhere. Convergence
            depends on R, not only the number of terms.
          </p>
        </article>
        <article>
          <b>Assumptions / Constraints</b>
          <p>
            Coefficients are defined for n ≥ 0. Series is centered at c.
            Convergence is tested by ratio/root behavior.
          </p>
        </article>
        <article>
          <b>Notation</b>
          <p>
            Sₙ(x): partial sum
            <br />
            R: radius of convergence
            <br />
            aₙ: coefficient of (x-c)ⁿ
          </p>
        </article>
      </section>
      <section className="seq343-guide">
        <b>Guided Explanation</b>
        <p>
          A power series centered at c is Σ aₙ(x-c)ⁿ. The radius R is the
          distance from c to the nearest singularity of the represented
          function. Inside (c-R,c+R) it converges absolutely; endpoints require
          separate tests.
        </p>
        <div>
          <i>c−R</i>
          <strong>c</strong>
          <i>c+R</i>
        </div>
      </section>
      <section className="seq343-check">
        <article>
          <h2>Quick Check</h2>
          <p>{challenges[question].label}</p>
          <div>
            {challenges[question].choices.map((choice, index) => (
              <button
                className={
                  quick && index === challenges[question].correct
                    ? "correct"
                    : ""
                }
                key={choice}
                onClick={() =>
                  act(() =>
                    setQuick(
                      index === challenges[question].correct
                        ? "correct"
                        : "incorrect",
                    ),
                  )
                }
              >
                {String.fromCharCode(65 + index)} <b>{choice}</b>
              </button>
            ))}
          </div>
        </article>
        <aside className={quick}>
          <b>
            {quick === "correct"
              ? "✓ Correct!"
              : quick === "incorrect"
                ? "Try again"
                : "Choose an answer."}
          </b>
          {quick === "correct" && (
            <>
              <p>The coefficient behavior gives this radius of convergence.</p>
              <button
                onClick={() =>
                  act(() => {
                    setQuestion((value) => (value + 1) % challenges.length);
                    setQuick("");
                  })
                }
              >
                Try another
              </button>
            </>
          )}
        </aside>
      </section>
    </section>
  );
}
