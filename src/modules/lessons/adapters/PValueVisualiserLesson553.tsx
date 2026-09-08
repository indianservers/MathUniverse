import { Check, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  pValueAnalysis,
  pValueDensity,
  type PValueDistribution,
  type PValueTail,
} from "./pValueVisualiserLessonModel";
import "./PValueVisualiserLesson553.css";

export default function PValueVisualiserLesson553({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <Activity key={resetToken} onInteraction={onInteraction} />;
}

function Activity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [distribution, setDistribution] = useState<PValueDistribution>("z"),
    [tail, setTail] = useState<PValueTail>("two-sided"),
    [statistic, setStatistic] = useState(1.68),
    [alpha, setAlpha] = useState(0.05),
    [df1, setDf1] = useState(10),
    [df2, setDf2] = useState(15),
    [answers, setAnswers] = useState(["", "", ""]),
    result = pValueAnalysis(distribution, statistic, alpha, tail, df1, df2),
    touch = () => onInteraction();
  const set = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    touch();
  };
  const reset = () => {
    setDistribution("z");
    setTail("two-sided");
    setStatistic(1.68);
    setAlpha(0.05);
    setDf1(10);
    setDf2(15);
    setAnswers(["", "", ""]);
    touch();
  };
  const label =
    distribution === "z"
      ? "Standard Normal Distribution"
      : distribution === "t"
        ? `Student t Distribution (df = ${df1})`
        : distribution === "chi-square"
          ? `Chi-Square Distribution (df = ${df1})`
          : `F Distribution (${df1}, ${df2})`;
  return (
    <div className="pv553" data-testid="inference-mockup-0516">
      <header className="pv553-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>p-Value Visualiser</h2>
        <p>
          See how the p-value changes with the observed statistic, tail choice
          and test type.
        </p>
        <div>
          <b>Learning objective</b>
          <span>
            Understand and interpret p-values using interactive visualisation.
          </span>
          <b>Level</b>
          <span>High School – Undergraduate</span>
          <b>Mastery</b>
          <span>Interpret p-value and make decisions</span>
        </div>
      </header>
      <nav>
        <b>Interactive Visualisation</b>
        <span>Guided Calculation</span>
        <span>Key Insight</span>
        <span>Misconception</span>
        <span>Assumptions</span>
        <span>Quick Check</span>
      </nav>
      <main>
        <header>
          <div>
            <b>1</b>
            <h3>Explore the p-value</h3>
            <p>
              Adjust the test settings and drag the observed statistic to see
              the shaded probability change.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset all
          </button>
        </header>
        <section className="pv553-options">
          <label>
            Test type
            <select
              value={distribution}
              onChange={(e) =>
                set(setDistribution, e.target.value as PValueDistribution)
              }
            >
              <option value="z">z test</option>
              <option value="t">t test</option>
              <option value="chi-square">Chi-square test</option>
              <option value="f">F test</option>
            </select>
          </label>
          <fieldset>
            <legend>Tail</legend>
            {(["left", "right", "two-sided"] as PValueTail[]).map((value) => (
              <button
                key={value}
                className={tail === value ? "active" : ""}
                onClick={() => set(setTail, value)}
              >
                {value === "two-sided"
                  ? "Two-tail"
                  : value[0].toUpperCase() + value.slice(1)}
              </button>
            ))}
          </fieldset>
          <label>
            Observed statistic (
            {distribution === "z"
              ? "z"
              : distribution === "t"
                ? "t"
                : distribution === "chi-square"
                  ? "χ²"
                  : "F"}
            )
            <input
              type="range"
              min={distribution === "z" || distribution === "t" ? -4 : 0.05}
              max={
                distribution === "chi-square"
                  ? 30
                  : distribution === "f"
                    ? 10
                    : 4
              }
              step=".01"
              value={statistic}
              onChange={(e) => set(setStatistic, +e.target.value)}
            />
            <input
              type="number"
              step=".01"
              value={statistic}
              onChange={(e) => set(setStatistic, +e.target.value)}
            />
          </label>
          <label>
            Significance level (α)
            <input
              type="range"
              min=".01"
              max=".1"
              step=".01"
              value={alpha}
              onChange={(e) => set(setAlpha, +e.target.value)}
            />
            <input
              type="number"
              min=".001"
              max=".2"
              step=".01"
              value={alpha}
              onChange={(e) => set(setAlpha, +e.target.value)}
            />
          </label>
          {distribution !== "z" && (
            <label>
              Degrees of freedom
              <input
                type="number"
                min="1"
                value={df1}
                onChange={(e) => set(setDf1, +e.target.value)}
              />
            </label>
          )}
          {distribution === "f" && (
            <label>
              Denominator df
              <input
                type="number"
                min="1"
                value={df2}
                onChange={(e) => set(setDf2, +e.target.value)}
              />
            </label>
          )}
        </section>
        <section className="pv553-work">
          <aside>
            <h3>Current results</h3>
            <p>
              Observed <b>{result.statistic.toFixed(2)}</b>
            </p>
            <p>
              p-value ({tail}) <strong>{result.pValue.toFixed(4)}</strong>
            </p>
            <p>
              α <b>{alpha.toFixed(2)}</b>
            </p>
            <p>
              Decision{" "}
              <em>{result.reject ? "Reject H0" : "Fail to reject H0"}</em>
            </p>
            <hr />
            <p>
              {result.reject
                ? "The result is statistically significant at the selected alpha."
                : "There is not sufficient evidence to reject H0 at the selected alpha."}
            </p>
            <h3>Legend</h3>
            <small>
              <i className="teal" /> p-value region
            </small>
            <small>
              <i className="purple" /> critical region
            </small>
            <small>
              <i className="line" /> observed statistic
            </small>
          </aside>
          <article>
            <header>
              <h3>{label}</h3>
              <b>
                {distribution === "z"
                  ? "Z ~ N(0, 1)"
                  : "Sampling distribution under H0"}
              </b>
            </header>
            <DistributionPlot
              result={result}
              onStatistic={(value) => set(setStatistic, value)}
            />
            <div>
              <p>
                <b>How it works</b>
                <br />
                The p-value is the null-model probability of a statistic at
                least as extreme as the observed value in the chosen tail
                direction.
              </p>
              <p>
                <b>Critical values (α = {alpha.toFixed(2)})</b>
                <br />
                {Number.isFinite(result.criticalLow) &&
                  `Low: ${result.criticalLow.toFixed(3)} `}
                {Number.isFinite(result.criticalHigh) &&
                  `High: ${result.criticalHigh.toFixed(3)}`}
              </p>
            </div>
          </article>
        </section>
      </main>
      <section className="pv553-scenario">
        <h3>Scenario in focus (fixed)</h3>
        <p>We test a population mean with known σ.</p>
        <div>
          {[
            ["Population mean (μ0)", "100"],
            ["Population SD (σ)", "15"],
            ["Sample size (n)", "36"],
            ["Sample mean (x̄)", "104.2"],
            ["Test statistic", "z = 1.68"],
          ].map(([a, b]) => (
            <span key={a}>
              <small>{a}</small>
              <b>{b}</b>
            </span>
          ))}
        </div>
      </section>
      <section className="pv553-guide">
        <article>
          <h3>2 &nbsp; Guided calculation</h3>
          <p>
            <b>H0:</b> μ = 100 &nbsp; vs &nbsp; <b>HA:</b> μ ≠ 100
          </p>
          <p>
            Step 1 &nbsp; z = (104.2 − 100) / (15 / √36) = <b>1.68</b>
          </p>
          <p>
            Step 2 &nbsp; p = 2 × P(Z ≥ 1.68) = <b>0.09296</b>
          </p>
          <p>Step 3 &nbsp; Since p &gt; 0.05, fail to reject H0.</p>
        </article>
        <aside>
          <h3>Key takeaway</h3>
          <p>
            The p-value measures how surprising the result is under H0. Compare
            p with α, not the statistic directly.
          </p>
          <h3>Decision rule</h3>
          <p>
            Reject H0 if p ≤ α.
            <br />
            Fail to reject H0 if p &gt; α.
          </p>
        </aside>
      </section>
      <section className="pv553-notes">
        <article>
          <h3>Common misconception</h3>
          <b>“A large p-value proves H0 is true.”</b>
          <p>
            Failing to reject H0 only means the data are not unusual enough to
            contradict it at the chosen α.
          </p>
        </article>
        <article>
          <h3>Assumptions &amp; cautions</h3>
          <p>
            The sampling model must fit the selected test. Check independence,
            distribution conditions, and whether parameters are known.
          </p>
        </article>
      </section>
      <section className="pv553-quiz">
        <h3>Quick check</h3>
        <p>For z = 1.68, enter each p-value (4 d.p.).</p>
        {[
          ["Left-tail", "0.9537"],
          ["Right-tail", "0.0465"],
          ["Two-tail", "0.0930"],
        ].map(([name, expected], index) => (
          <label key={name}>
            {name}
            <span>p =</span>
            <input
              value={answers[index]}
              onChange={(e) => {
                const next = [...answers];
                next[index] = e.target.value;
                set(setAnswers, next);
              }}
            />
            {answers[index] && (
              <b
                className={
                  Math.abs(+answers[index] - +expected) < 0.00011
                    ? "correct"
                    : "incorrect"
                }
              >
                {Math.abs(+answers[index] - +expected) < 0.00011 ? (
                  <>
                    <Check size={13} /> Correct
                  </>
                ) : (
                  `Try ${expected}`
                )}
              </b>
            )}
          </label>
        ))}
      </section>
    </div>
  );
}

function DistributionPlot({
  result,
  onStatistic,
}: {
  result: ReturnType<typeof pValueAnalysis>;
  onStatistic: (value: number) => void;
}) {
  const symmetric = result.distribution === "z" || result.distribution === "t",
    min = symmetric ? -4 : 0,
    max =
      result.distribution === "chi-square"
        ? Math.max(30, result.statistic * 1.2)
        : result.distribution === "f"
          ? Math.max(8, result.statistic * 1.2)
          : 4,
    points = Array.from({ length: 161 }, (_, i) => {
      const x = min + (i / 160) * (max - min);
      return {
        x,
        y: pValueDensity(result.distribution, x, result.df1, result.df2),
      };
    }),
    peak = Math.max(0.001, ...points.map((p) => p.y)),
    sx = (x: number) => 35 + ((x - min) / (max - min)) * 700,
    sy = (y: number) => 260 - (y / peak) * 190,
    line = points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" "),
    extreme = (x: number) =>
      result.tail === "left"
        ? x <= result.statistic
        : result.tail === "right"
          ? x >= result.statistic
          : symmetric
            ? Math.abs(x) >= Math.abs(result.statistic)
            : x <= result.statistic || x >= result.criticalHigh,
    shade = points
      .filter(extreme)
      .map((p) => `${sx(p.x)},${sy(p.y)}`)
      .join(" ");
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    if (event.buttons !== 1 && event.type === "pointermove") return;
    const rect = event.currentTarget.getBoundingClientRect(),
      value =
        min +
        Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) *
          (max - min);
    onStatistic(Math.round(value * 100) / 100);
  };
  return (
    <svg
      viewBox="0 0 770 310"
      role="img"
      aria-label="Interactive p-value distribution"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <line className="axis" x1="30" x2="750" y1="260" y2="260" />
      <polygon
        className="shade"
        points={`${sx(points.find((p) => extreme(p.x))?.x ?? result.statistic)},260 ${shade} ${sx(points.filter(extreme).at(-1)?.x ?? result.statistic)},260`}
      />
      <polyline points={line} />
      {Number.isFinite(result.criticalLow) && (
        <line
          className="critical"
          x1={sx(result.criticalLow)}
          x2={sx(result.criticalLow)}
          y1="45"
          y2="260"
        />
      )}
      {Number.isFinite(result.criticalHigh) && (
        <line
          className="critical"
          x1={sx(result.criticalHigh)}
          x2={sx(result.criticalHigh)}
          y1="45"
          y2="260"
        />
      )}
      <line
        className="observed"
        x1={sx(result.statistic)}
        x2={sx(result.statistic)}
        y1="35"
        y2="260"
      />
      <text x={sx(result.statistic)} y="285" textAnchor="middle">
        {result.statistic.toFixed(2)}
      </text>
      <text x="385" y="305" textAnchor="middle">
        p-value = {result.pValue.toFixed(4)}
      </text>
    </svg>
  );
}
