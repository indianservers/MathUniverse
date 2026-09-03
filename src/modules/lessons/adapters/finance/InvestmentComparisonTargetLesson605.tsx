import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./InvestmentComparisonTargetLesson605.css";

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
const tabs = ["Interact", "Learn", "Worked Example", "Formula", "Practice"];

export default function InvestmentComparisonTargetLesson605({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [capital, setCapital] = useState(20000),
    [rateA, setRateA] = useState(6),
    [rateB, setRateB] = useState(8),
    [years, setYears] = useState(5),
    [fee, setFee] = useState(1);
  const [risk, setRisk] = useState("Moderate"),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setCapital(20000);
    setRateA(6);
    setRateB(8);
    setYears(5);
    setFee(1);
    setRisk("Moderate");
    setTab("Interact");
    setAnswer("");
    setGraded(null);
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
    const factorA = (1 + rateA / 100) * (1 - fee / 100),
      factorB = (1 + rateB / 100) * (1 - fee / 100);
    const series = Array.from({ length: years + 1 }, (_, year) => ({
      year,
      a: capital * factorA ** year,
      b: capital * factorB ** year,
    }));
    return {
      factorA,
      factorB,
      series,
      finalA: series.at(-1)?.a ?? capital,
      finalB: series.at(-1)?.b ?? capital,
    };
  }, [capital, rateA, rateB, years, fee]);
  const max = Math.max(
    50000,
    ...model.series.flatMap((point) => [point.a, point.b]),
  );
  const px = (year: number) => 50 + (year / Math.max(1, years)) * 555,
    py = (value: number) => 280 - (value / max) * 235;
  const path = (key: "a" | "b") =>
    model.series
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${px(point.year)},${py(point[key])}`,
      )
      .join(" ");
  const challengeAnswer = rateB;
  const check = () =>
    act(() => setGraded(Math.abs(Number(answer) - challengeAnswer) < 0.011));

  return (
    <section
      className="ic605-page"
      data-testid="finance-mockup-0662"
      data-object-model="dedicated-fee-adjusted-two-plan-compound-growth-model"
      data-capital={capital}
      data-rate-a={rateA}
      data-rate-b={rateB}
      data-years={years}
      data-fee={fee}
      data-final-a={model.finalA.toFixed(2)}
      data-final-b={model.finalB.toFixed(2)}
      data-points={model.series.length}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="ic605-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>Investment Comparison</h1>
          <p>Compare scenarios under the same time and starting assumptions.</p>
        </main>
        <aside>
          <b>Lesson: 605</b>
          <b>Level: Intermediate-Advanced</b>
          <b>Time: 6-10 min</b>
          <b>Lab: Applied Modelling Lab</b>
        </aside>
      </header>
      <nav className="ic605-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      {tab !== "Interact" && (
        <p className="ic605-note">
          <b>{tab}:</b> Compare investments with identical capital and time
          assumptions.
        </p>
      )}
      <section className="ic605-sequence">
        <b>LEARNING SEQUENCE</b>
        <div>
          {[
            ["Observe", "See how two plans grow."],
            ["Manipulate", "Adjust the controls."],
            ["Notice the pattern", "Compare curves and values."],
            ["Understand the rule", "Grasp the math behind it."],
            ["Try independently", "Apply in a challenge."],
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
      <section className="ic605-lab">
        <aside>
          <h3>CONTROL PANEL</h3>
          <Control
            label="Starting capital (Rs)"
            value={capital}
            min={1000}
            max={100000}
            step={1000}
            onChange={(value) => act(() => setCapital(value))}
          />
          <Control
            label="Plan A rate (p.a.)"
            value={rateA}
            min={0}
            max={25}
            step={0.5}
            suffix="%"
            onChange={(value) => act(() => setRateA(value))}
          />
          <Control
            label="Plan B rate (p.a.)"
            value={rateB}
            min={0}
            max={25}
            step={0.5}
            suffix="%"
            onChange={(value) => act(() => setRateB(value))}
          />
          <Control
            label="Time horizon (years)"
            value={years}
            min={1}
            max={30}
            step={1}
            onChange={(value) => act(() => setYears(value))}
          />
          <Control
            label="Fees (% of balance p.a.)"
            value={fee}
            min={0}
            max={5}
            step={0.25}
            suffix="%"
            onChange={(value) => act(() => setFee(value))}
          />
          <label className="ic605-risk">
            Risk/volatility
            <select
              aria-label="Risk volatility"
              value={risk}
              onChange={(event) => act(() => setRisk(event.target.value))}
            >
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </label>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset to defaults
          </button>
        </aside>
        <main>
          <section className="ic605-chart">
            <header>
              <b>INVESTMENT COMPARISON MODEL</b>
              <span>
                Plan A ({rateA}% p.a.) | Plan B ({rateB}% p.a.)
              </span>
            </header>
            <svg
              viewBox="0 0 650 330"
              aria-label="Investment growth comparison graph"
            >
              {[45, 92, 139, 186, 233, 280].map((y, index) => (
                <g className="grid" key={y}>
                  <line x1="50" x2="605" y1={y} y2={y} />
                  <text x="8" y={y + 4}>
                    {currency((max * (5 - index)) / 5).replace(".00", "")}
                  </text>
                </g>
              ))}
              <line x1="50" x2="50" y1="40" y2="280" />
              <line x1="50" x2="605" y1="280" y2="280" />
              <path className="a" d={path("a")} />
              <path className="b" d={path("b")} />
              {model.series.map((point) => (
                <g key={point.year}>
                  <circle
                    className="a"
                    cx={px(point.year)}
                    cy={py(point.a)}
                    r="5"
                  />
                  <circle
                    className="b"
                    cx={px(point.year)}
                    cy={py(point.b)}
                    r="5"
                  />
                  <text x={px(point.year) - 12} y="300">
                    {point.year}
                  </text>
                  {(point.year === 0 || point.year === years) && (
                    <text x={px(point.year) - 25} y={py(point.b) - 10}>
                      {currency(point.b).replace(".00", "")}
                    </text>
                  )}
                </g>
              ))}
            </svg>
            <footer>
              Break-even (crossover): Plan{" "}
              {model.finalB >= model.finalA ? "B" : "A"} leads from year 0
            </footer>
          </section>
          <section className="ic605-results">
            <article>
              <b>Plan A Summary</b>
              <strong>Rs {currency(model.finalA)}</strong>
              <p>Final value after year {years}</p>
              <small>
                Effective return (p.a.):{" "}
                {((model.factorA - 1) * 100).toFixed(2)}%
              </small>
            </article>
            <article>
              <b>Plan B Summary</b>
              <strong>Rs {currency(model.finalB)}</strong>
              <p>Final value after year {years}</p>
              <small>
                Effective return (p.a.):{" "}
                {((model.factorB - 1) * 100).toFixed(2)}%
              </small>
            </article>
            <aside>
              <b>Key readout</b>
              <p>
                Plan {model.finalB >= model.finalA ? "B" : "A"} yields{" "}
                <strong>
                  Rs {currency(Math.abs(model.finalB - model.finalA))}
                </strong>{" "}
                more at year {years}.
              </p>
            </aside>
          </section>
        </main>
      </section>
      <section className="ic605-theory">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>
            Both plans start with Rs {currency(capital)}. Fees are {fee}% p.a.
          </p>
          <p>Plan A effective factor = {model.factorA.toFixed(4)}</p>
          <p>Plan B effective factor = {model.factorB.toFixed(4)}</p>
          <p>
            FV<sub>A</sub> = Rs {currency(model.finalA)}
          </p>
          <p>
            FV<sub>B</sub> = Rs {currency(model.finalB)}
          </p>
        </article>
        <article>
          <h2>KEY RULE / DEFINITION</h2>
          <p>
            <b>Future value with fees</b>
          </p>
          <strong>
            FV = P[(1 + r)(1 - f)]<sup>n</sup>
          </strong>
          <p>
            P = starting capital
            <br />r = nominal annual rate
            <br />f = annual fee rate
            <br />n = number of years
          </p>
        </article>
        <article>
          <h2>COMMON MISCONCEPTION</h2>
          <p>Adding rates instead of compounding.</p>
          <p>
            <b>Incorrect:</b> P(1 + nr)
          </p>
          <p>
            <b>Why it is wrong:</b> It ignores growth on growth.
          </p>
          <p>
            <b>Always use:</b> P(1 + r)<sup>n</sup>, adjusted for fees.
          </p>
        </article>
      </section>
      <section className="ic605-challenge">
        <header>
          <h2>QUICK CHALLENGE</h2>
          <p>
            With the same starting capital, fees of {fee}% p.a. and {years}{" "}
            years, what nominal annual rate must Plan A earn to match Plan B's
            final value of Rs {currency(model.finalB)}?
          </p>
        </header>
        <label>
          Your answer
          <span>
            <input
              aria-label="Matching annual rate"
              value={answer}
              onChange={(event) =>
                act(() => {
                  setAnswer(event.target.value);
                  setGraded(null);
                })
              }
            />
            %<button onClick={check}>Check Answer</button>
          </span>
        </label>
        <aside>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? `Correct! Plan A needs ${challengeAnswer.toFixed(2)}% p.a.`
                : `Rearrange the fee-adjusted compound formula.`}
          </output>
          <button onClick={() => act(() => setSolution((value) => !value))}>
            Show solution
          </button>
          {solution && (
            <small>
              Equal fees and time mean Plan A must use Plan B's{" "}
              {rateB.toFixed(2)}% nominal rate.
            </small>
          )}
        </aside>
      </section>
      <nav className="ic605-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/604-tax-and-discounts">
          &larr;{" "}
          <span>
            PREVIOUS<b>Tax and Discounts</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/606-model-builder">
          <span>
            NEXT<b>Model Builder</b>
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
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="ic605-control">
      {label}
      <input
        aria-label={label}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(+event.target.value)}
      />
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
      </span>
      <small>
        {min.toLocaleString()} to {max.toLocaleString()}
        {suffix}
      </small>
    </label>
  );
}
