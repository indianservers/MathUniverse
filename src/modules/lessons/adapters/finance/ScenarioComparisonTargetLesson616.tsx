import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ScenarioComparisonTargetLesson616.css";
const amount = (p: number, r: number, t: number) => p * (1 + r / 100) ** t,
  fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
export default function ScenarioComparisonTargetLesson616({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [principal, setPrincipal] = useState(25000),
    [rate, setRate] = useState(8),
    [years, setYears] = useState(10),
    [worst, setWorst] = useState(-2),
    [best, setBest] = useState(2),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [solution, setSolution] = useState(false),
    [shared, setShared] = useState(false),
    [help, setHelp] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setPrincipal(25000);
    setRate(8);
    setYears(10);
    setWorst(-2);
    setBest(2);
    setTab("Interact");
    setAnswer("");
    setGraded(null);
    setSolution(false);
    setShared(false);
    setHelp(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const scenarios = [
      { key: "worst", label: "WORST CASE", rate: Math.max(0, rate + worst) },
      { key: "base", label: "BASE CASE", rate },
      { key: "best", label: "BEST CASE", rate: Math.max(0, rate + best) },
    ].map((x) => ({ ...x, value: amount(principal, x.rate, years) })),
    baseValue = scenarios[1].value;
  const series = scenarios.map((s) =>
      Array.from({ length: years + 1 }, (_, year) => ({
        year,
        value: amount(principal, s.rate, year),
      })),
    ),
    maxValue = Math.max(...series.flatMap((row) => row.map((p) => p.value))),
    px = (x: number) => 35 + (x / Math.max(1, years)) * 330,
    py = (y: number) => 210 - (y / maxValue) * 170;
  const paths = series.map((row) =>
      row
        .map((p, i) => `${i ? "L" : "M"}${px(p.year)},${py(p.value)}`)
        .join(" "),
    ),
    targetRate = ((60000 / principal) ** (1 / years) - 1) * 100,
    check = () =>
      act(() => setGraded(Math.abs(Number(answer) - targetRate) < 0.06));
  return (
    <section
      className="sc616-page"
      data-testid="finance-mockup-0673"
      data-object-model="dedicated-three-scenario-compound-growth-distribution-model"
      data-principal={principal}
      data-rate={rate}
      data-years={years}
      data-worst={worst}
      data-best={best}
      data-base-output={baseValue.toFixed(2)}
      data-worst-output={scenarios[0].value.toFixed(2)}
      data-best-output={scenarios[2].value.toFixed(2)}
      data-graded={graded === null ? "" : graded}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="sc616-hero">
        <h1>
          616 Scenario Comparison <b>INTERACTION</b>
        </h1>
        <p>Compare assumptions using base, best, and worst cases.</p>
        <dl>
          <span>Level: Intermediate–Advanced</span>
          <span>Lab: Applied Modelling</span>
          <span>Topic: Financial Mathematics</span>
          <span>Time: 6–10 min</span>
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
        <p className="sc616-note">
          <b>{tab}:</b> Compare the same model under clearly stated assumptions.
        </p>
      )}
      <ol className="sc616-sequence">
        {[
          ["Observe", "See the model in action"],
          ["Manipulate", "Change assumptions"],
          ["Notice the pattern", "Spot relationships"],
          ["Understand the rule", "Key idea & definition"],
          ["Try independently", "Challenge yourself"],
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
      <section className="sc616-board">
        <header>
          <div>
            <h2>Scenario-comparison board</h2>
            <p>Edit assumptions to compare base, best, and worst cases.</p>
          </div>
          <span>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset all
            </button>
            <button onClick={() => act(() => setShared(true))}>
              <Share2 />
              Share
            </button>
            <button onClick={() => act(() => setHelp((v) => !v))}>
              <CircleHelp />
              How it works
            </button>
          </span>
        </header>
        <main>
          <aside className="sc616-inputs">
            <h3>Editable assumptions</h3>
            {[
              [
                "Starting amount (₹)",
                principal,
                100,
                100000,
                100,
                setPrincipal,
              ],
              ["Annual rate (%)", rate, 0, 25, 0.1, setRate],
              ["Years", years, 1, 20, 1, setYears],
            ].map(([label, value, min, max, step, setter]) => (
              <label key={String(label)}>
                {String(label)}
                <input
                  aria-label={`${label} slider`}
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={Number(step)}
                  value={Number(value)}
                  onChange={(e) =>
                    act(() =>
                      (setter as React.Dispatch<React.SetStateAction<number>>)(
                        Number(e.target.value),
                      ),
                    )
                  }
                />
                <input
                  aria-label={String(label)}
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
              </label>
            ))}
            <h3>Scenario adjustments</h3>
            <label>
              Worst case
              <input
                aria-label="Worst adjustment"
                type="number"
                value={worst}
                onChange={(e) => act(() => setWorst(Number(e.target.value)))}
              />{" "}
              pp
            </label>
            <label>
              Base case<strong>0 pp</strong>
            </label>
            <label>
              Best case
              <input
                aria-label="Best adjustment"
                type="number"
                value={best}
                onChange={(e) => act(() => setBest(Number(e.target.value)))}
              />{" "}
              pp
            </label>
            <aside>
              <b>What is pp?</b>
              <p>Percentage points. For example, 8% + 2 pp = 10%.</p>
            </aside>
          </aside>
          <section className="sc616-results">
            <div className="sc616-cards">
              {scenarios.map((s, i) => {
                const diff = s.value - baseValue,
                  pct = (diff / baseValue) * 100;
                return (
                  <article className={s.key} key={s.key}>
                    <b>{s.label}</b>
                    <h2>{s.rate.toFixed(1).replace(".0", "")}%</h2>
                    <small>
                      ({rate}{" "}
                      {i === 1 ? "+ 0" : i === 0 ? `${worst}` : `+ ${best}`} pp)
                    </small>
                    <section>
                      <b>Compound amount</b>
                      <strong>₹{fmt(s.value)}</strong>
                      <p>Total interest</p>
                      <strong>₹{fmt(s.value - principal)}</strong>
                      <p>Compared to base</p>
                      <strong>
                        {diff >= 0 ? "+" : "−"}₹{fmt(Math.abs(diff))}
                      </strong>
                      <small>
                        ({pct >= 0 ? "+" : ""}
                        {pct.toFixed(2)}%)
                      </small>
                    </section>
                  </article>
                );
              })}
            </div>
            <div className="sc616-charts">
              <article>
                <h3>Compound amount over time</h3>
                <p>A=P(1+r)ᵗ where P=₹{principal.toLocaleString("en-IN")}</p>
                <svg
                  viewBox="0 0 400 245"
                  aria-label="Scenario compound growth chart"
                >
                  {[45, 85, 125, 165, 205].map((y) => (
                    <line
                      className="grid"
                      key={y}
                      x1="35"
                      x2="365"
                      y1={y}
                      y2={y}
                    />
                  ))}
                  {paths.map((d, i) => (
                    <path className={`p${i}`} key={i} d={d} />
                  ))}
                  {series.map((row, i) =>
                    row.map((p) => (
                      <circle
                        className={`p${i}`}
                        key={`${i}${p.year}`}
                        cx={px(p.year)}
                        cy={py(p.value)}
                        r="2.5"
                      />
                    )),
                  )}
                </svg>
              </article>
              <article>
                <h3>Outcome distribution at Year {years}</h3>
                <p>Range of possible outcomes.</p>
                <svg
                  viewBox="0 0 400 245"
                  aria-label="Scenario outcome distribution"
                >
                  <defs>
                    <linearGradient id="scenario-fill">
                      <stop stopColor="#ef3f75" />
                      <stop offset=".5" stopColor="#3f82ef" />
                      <stop offset="1" stopColor="#19a957" />
                    </linearGradient>
                  </defs>
                  <path
                    className="distribution"
                    d="M25 205 C90 202 105 160 150 120 C190 80 210 45 235 75 C275 120 300 190 375 205 L375 220 L25 220Z"
                  />
                  {scenarios.map((s, i) => (
                    <g key={s.key}>
                      <line
                        className={`marker p${i}`}
                        x1={80 + i * 120}
                        x2={80 + i * 120}
                        y1="70"
                        y2="205"
                      />
                      <text x={55 + i * 120} y="55">
                        {s.label.split(" ")[0]} ₹{Math.round(s.value / 1000)}K
                      </text>
                    </g>
                  ))}
                </svg>
              </article>
            </div>
          </section>
        </main>
        {help && (
          <output className="help">
            Keep principal and years shared; scenario rate adjustments are
            percentage points.
          </output>
        )}
        {shared && (
          <output className="shared">
            Scenario comparison copied to the workspace.
          </output>
        )}
      </section>
      <section className="sc616-bottom">
        <article>
          <h3>Key idea</h3>
          <p>Compounding grows faster at higher rates.</p>
          <p>Small changes in rate lead to large differences over time.</p>
        </article>
        <article>
          <h3>Key rule</h3>
          <strong>A=P(1+r)ᵗ</strong>
          <p>P is principal, r is annual rate, and t is time.</p>
        </article>
        <article className="driver">
          <h3>Top driver</h3>
          <p>Rate is the biggest driver over longer horizons.</p>
          <div>
            <i style={{ width: "92%" }} /> Annual rate
            <br />
            <i style={{ width: "20%" }} /> Years
            <br />
            <i style={{ width: "8%" }} /> Starting amount
          </div>
        </article>
        <article>
          <h3>⚠ Common misconception</h3>
          <p>Adding 2 pp is not multiplying by 1.02.</p>
          <p>Incorrect: 8% × 1.02 = 8.16% &nbsp; Correct: 8% + 2 pp = 10%</p>
        </article>
        <article>
          <h3>Notice the pattern</h3>
          <p>
            Amounts grow exponentially and the gap between scenarios widens over
            time.
          </p>
        </article>
        <article className="challenge">
          <h3>◎ Quick challenge</h3>
          <p>
            Keep P=₹{principal.toLocaleString("en-IN")} and t={years}. What
            annual rate gives an amount closest to ₹60,000?
          </p>
          <label>
            Your answer
            <input
              aria-label="Challenge rate"
              value={answer}
              onChange={(e) => act(() => setAnswer(e.target.value))}
            />
            %
          </label>
          <button onClick={check}>Check answer</button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            Show solution
          </button>
          {graded !== null && (
            <output className={graded ? "correct" : ""}>
              {graded
                ? `Correct: ${targetRate.toFixed(2)}%`
                : "Use the inverse compound formula."}
            </output>
          )}
          {solution && (
            <small>r=(60000/P)^(1/t)−1={targetRate.toFixed(2)}%</small>
          )}
        </article>
      </section>
      <nav className="sc616-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/615-residual-and-error-analysis">
          <ChevronLeft />
          <span>
            <b>PREVIOUS LESSON</b>Residual and Error Analysis
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/617-linear-programming">
          <span>
            <b>NEXT LESSON</b>Linear Programming
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
