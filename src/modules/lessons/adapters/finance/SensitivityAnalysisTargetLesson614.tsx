import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SensitivityAnalysisTargetLesson614.css";
type Key = "principal" | "rate" | "delta";
const base = { principal: 20000, rate: 8, delta: 1 };
const value = (p: number, r: number, d: number) => p * (1 + (r + d) / 100) ** 5;
const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
export default function SensitivityAnalysisTargetLesson614({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [factor, setFactor] = useState<Key>("principal"),
    [change, setChange] = useState(10),
    [tab, setTab] = useState("Interact"),
    [answerValue, setAnswerValue] = useState(""),
    [answerImpact, setAnswerImpact] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setFactor("principal");
    setChange(10);
    setTab("Interact");
    setAnswerValue("");
    setAnswerImpact("");
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const changed = { ...base, [factor]: base[factor] * (1 + change / 100) },
    baseline = value(base.principal, base.rate, base.delta),
    current = value(changed.principal, changed.rate, changed.delta),
    impact = (current / baseline - 1) * 100,
    absolute = current - baseline;
  const impacts = (Object.keys(base) as Key[]).map((key) => {
    const low = { ...base, [key]: base[key] * 0.9 },
      high = { ...base, [key]: base[key] * 1.1 };
    return {
      key,
      low: (value(low.principal, low.rate, low.delta) / baseline - 1) * 100,
      high: (value(high.principal, high.rate, high.delta) / baseline - 1) * 100,
    };
  });
  const max = impacts.reduce((a, b) =>
    Math.max(Math.abs(a.low), Math.abs(a.high)) >
    Math.max(Math.abs(b.low), Math.abs(b.high))
      ? a
      : b,
  ).key;
  const challengeCurrent = value(base.principal, 8.8, base.delta),
    challengeImpact = (challengeCurrent / baseline - 1) * 100,
    check = () =>
      act(() =>
        setGraded(
          Math.abs(Number(answerValue) - challengeCurrent) < 0.02 &&
            Math.abs(Number(answerImpact) - challengeImpact) < 0.02,
        ),
      );
  const samples = Array.from({ length: 6 }, (_, i) => {
      const pct = -20 + i * 8,
        x = { ...base, [factor]: base[factor] * (1 + pct / 100) };
      return {
        pct,
        input: x[factor],
        output: value(x.principal, x.rate, x.delta),
      };
    }),
    minY = Math.min(...samples.map((p) => p.output)),
    maxY = Math.max(...samples.map((p) => p.output)),
    path = samples
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${55 + i * 75},${220 - ((p.output - minY) / (maxY - minY || 1)) * 160}`,
      )
      .join(" ");
  const labels: { [K in Key]: string } = {
    principal: "Principal (P)",
    rate: "Base rate (r)",
    delta: "Rate change (Δr)",
  };
  return (
    <section
      className="sa614-page"
      data-testid="finance-mockup-0671"
      data-object-model="dedicated-one-factor-tornado-response-sensitivity-model"
      data-factor={factor}
      data-change={change}
      data-baseline={baseline.toFixed(2)}
      data-current={current.toFixed(2)}
      data-impact={impact.toFixed(2)}
      data-most-sensitive={max}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="sa614-hero">
        <div>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </div>
        <h1>Sensitivity Analysis</h1>
        <p>
          Understand how model output changes when inputs change—one at a time.
        </p>
        <dl>
          <span>
            Level<b>Intermediate–Advanced</b>
          </span>
          <span>
            Topic<b>Financial Mathematics</b>
          </span>
          <span>
            Time<b>6–10 min</b>
          </span>
          <span>
            Skills<b>Modelling, Interpretation</b>
          </span>
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
        <p className="sa614-note">
          <b>{tab}:</b> Change one input while holding the others at baseline.
        </p>
      )}
      <ol className="sa614-sequence">
        {[
          ["Observe", "See the baseline model"],
          ["Manipulate", "Change one input"],
          ["Notice the pattern", "Track the effect"],
          ["Understand the rule", "Generalize the idea"],
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
      <section className="sa614-dashboard">
        <header>
          <div>
            <b>INTERACT: CHANGE ONE INPUT AT A TIME</b>
            <h2>Sensitivity Dashboard</h2>
          </div>
          <span>
            <button onClick={() => act(reset)}>
              <RotateCcw /> Reset to baseline
            </button>
            <button onClick={() => act(() => setChange(0))}>
              <HelpCircle />
            </button>
          </span>
        </header>
        <main>
          <aside className="sa614-left">
            <section>
              <b>CONTROLS</b>
              <p>Choose a factor to test (one at a time)</p>
              <select
                aria-label="Factor to test"
                value={factor}
                onChange={(e) => act(() => setFactor(e.target.value as Key))}
              >
                {(Object.keys(labels) as Key[]).map((k) => (
                  <option key={k} value={k}>
                    {labels[k]}
                  </option>
                ))}
              </select>
              <label>
                Change {labels[factor]}
                <input
                  aria-label="Percentage change"
                  type="range"
                  min="-20"
                  max="20"
                  value={change}
                  onChange={(e) => act(() => setChange(Number(e.target.value)))}
                />
                <input
                  aria-label="Percentage change value"
                  type="number"
                  min="-20"
                  max="20"
                  value={change}
                  onChange={(e) => act(() => setChange(Number(e.target.value)))}
                />
              </label>
              <small>🔒 Other inputs locked at baseline</small>
            </section>
            <section>
              <b>BASELINE INPUTS</b>
              <p>
                Principal, P (₹)
                <strong>{base.principal.toLocaleString("en-IN")}</strong>
              </p>
              <p>
                Base rate, r (%)<strong>{base.rate}%</strong>
              </p>
              <p>
                Rate change, Δr (pp)<strong>{base.delta}%</strong>
              </p>
            </section>
            <section>
              <b>OUTPUT</b>
              <p>Five-year output, FV (₹)</p>
              <strong>₹{money(baseline)}</strong>
            </section>
            <section>
              <b>PERCENTAGE IMPACT</b>
              <strong>
                {impact >= 0 ? "+" : ""}
                {impact.toFixed(2)}%
              </strong>
              <p>
                Change in output from baseline ({absolute >= 0 ? "+" : ""}₹
                {money(absolute)})
              </p>
            </section>
            <section>
              <b>
                <Star /> MOST SENSITIVE FACTOR
              </b>
              <strong>{labels[max]}</strong>
              <p>Drives the largest change in output</p>
            </section>
          </aside>
          <section className="sa614-center">
            <article>
              <h3>TORNADO CHART — % IMPACT AFTER ±10% CHANGE</h3>
              <svg
                viewBox="0 0 470 190"
                aria-label="Computed tornado sensitivity chart"
              >
                <line x1="235" x2="235" y1="25" y2="155" />
                {impacts.map((row, i) => (
                  <g key={row.key}>
                    <text x="10" y={48 + i * 48}>
                      {labels[row.key]}
                    </text>
                    <rect
                      className={`left n${i}`}
                      x={235 - Math.abs(row.low) * 8}
                      y={34 + i * 48}
                      width={Math.abs(row.low) * 8}
                      height="25"
                    />
                    <rect
                      className={`right n${i}`}
                      x="235"
                      y={34 + i * 48}
                      width={Math.abs(row.high) * 8}
                      height="25"
                    />
                    <text x={220 - Math.abs(row.low) * 8} y={50 + i * 48}>
                      {row.low.toFixed(2)}%
                    </text>
                    <text x={242 + Math.abs(row.high) * 8} y={50 + i * 48}>
                      +{row.high.toFixed(2)}%
                    </text>
                  </g>
                ))}
              </svg>
            </article>
            <article>
              <h3>RESPONSE CURVE — {labels[factor]} VS FIVE-YEAR OUTPUT</h3>
              <svg
                viewBox="0 0 470 250"
                aria-label="Sensitivity response curve"
              >
                {[50, 90, 130, 170, 210].map((y) => (
                  <line
                    className="grid"
                    key={y}
                    x1="55"
                    x2="430"
                    y1={y}
                    y2={y}
                  />
                ))}
                <path d={path} />
                {samples.map((p, i) => (
                  <circle
                    key={i}
                    cx={55 + i * 75}
                    cy={220 - ((p.output - minY) / (maxY - minY || 1)) * 160}
                    r="4"
                  />
                ))}
                <text x="200" y="245">
                  {labels[factor]}
                </text>
              </svg>
            </article>
            <footer>
              <span>
                BASELINE SUMMARY<strong>FV₀ = ₹{money(baseline)}</strong>
              </span>
              <span>
                CURRENT OUTPUT<strong>FV = ₹{money(current)}</strong>
              </span>
              <span>
                CHANGE
                <strong>
                  {absolute >= 0 ? "+" : ""}₹{money(absolute)} (
                  {impact.toFixed(2)}%)
                </strong>
              </span>
            </footer>
          </section>
          <aside className="sa614-right">
            <section>
              <b>INTERPRETATION</b>
              <p>
                A {change >= 0 ? "+" : ""}
                {change}% change in {labels[factor]} changes the five-year
                output by{" "}
                <strong>
                  {impact >= 0 ? "+" : ""}
                  {impact.toFixed(2)}%
                </strong>
                .
              </p>
              <p>{labels[max]} has the greatest impact on the model output.</p>
            </section>
            <section>
              <b>⚠ MISCONCEPTION CHECK</b>
              <p>Shape of the response curve is the same for every factor.</p>
              <p>
                <strong>Why it’s wrong:</strong> Some factors affect output
                nonlinearly. Always test and observe the pattern.
              </p>
            </section>
            <section>
              <b>QUICK READOUTS</b>
              <p>
                Current factor<strong>{labels[factor]}</strong>
              </p>
              <p>
                Change applied<strong>{change}%</strong>
              </p>
              <p>
                % impact on output<strong>{impact.toFixed(2)}%</strong>
              </p>
              <p>
                Absolute change<strong>₹{money(absolute)}</strong>
              </p>
              <p>
                Output (FV)<strong>₹{money(current)}</strong>
              </p>
            </section>
          </aside>
        </main>
      </section>
      <section className="sa614-theory">
        <article>
          <h2>WORKED EXAMPLE (CORRECT)</h2>
          <p>Baseline: P=₹20,000, r=8%, Δr=1% gives FV₀=₹{money(baseline)}.</p>
          <p>Test Principal at +10%: P=₹22,000.</p>
          <strong>FV = 1.10 × FV₀ = ₹{money(baseline * 1.1)}</strong>
        </article>
        <article>
          <h2>KEY RULE</h2>
          <p>
            Sensitivity of output to an input is measured by percentage change.
          </p>
          <strong>
            Percent impact = (Output new − Output base) / Output base × 100%
          </strong>
          <p>Test one input at a time and compare impacts.</p>
        </article>
        <article>
          <h2>TRY IT (CHALLENGE)</h2>
          <p>
            Change the Base rate (r) by +10% (to 8.8%). What is the new
            five-year output and percentage impact?
          </p>
          <div>
            <label>
              Output (₹)
              <input
                aria-label="Challenge output"
                value={answerValue}
                onChange={(e) => act(() => setAnswerValue(e.target.value))}
              />
            </label>
            <label>
              % Impact
              <input
                aria-label="Challenge impact"
                value={answerImpact}
                onChange={(e) => act(() => setAnswerImpact(e.target.value))}
              />
            </label>
          </div>
          <button onClick={check}>Check Answer</button>
          {graded !== null && (
            <output className={graded ? "correct" : ""}>
              {graded
                ? `Correct: ₹${money(challengeCurrent)}, ${challengeImpact.toFixed(2)}%`
                : "Recalculate with r = 8.8%."}
            </output>
          )}
        </article>
      </section>
      <nav className="sa614-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/613-dimensional-analysis">
          <ChevronLeft />
          <span>
            <b>Previous</b>Dimensional Analysis
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/615-residual-and-error-analysis">
          <span>
            <b>Next</b>Residual and Error Analysis
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
