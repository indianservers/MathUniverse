import { Check, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { chiSquareDensity } from "./chiSquareLessonModel";
import { fDensity } from "./fDistributionLessonModel";
import type { TAlternative } from "./oneSampleTTestLessonModel";
import {
  oneVarianceChiSquareTest,
  twoVarianceFTest,
} from "./varianceTestsLessonModel";
import "./VarianceTestsLesson551.css";

type Mode = "one" | "two";
export default function VarianceTestsLesson551({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <VarianceActivity key={resetToken} onInteraction={onInteraction} />;
}
function VarianceActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [mode, setMode] = useState<Mode>("two"),
    [n1, setN1] = useState(20),
    [variance1, setVariance1] = useState(16),
    [n2, setN2] = useState(25),
    [variance2, setVariance2] = useState(25),
    [nullValue, setNullValue] = useState(1),
    [alternative, setAlternative] = useState<TAlternative>("two-sided"),
    [alpha, setAlpha] = useState(0.05),
    [answer, setAnswer] = useState(1);
  const two = twoVarianceFTest(
      n1,
      variance1,
      n2,
      variance2,
      nullValue,
      alpha,
      alternative,
    ),
    one = oneVarianceChiSquareTest(
      n1,
      variance1,
      nullValue,
      alpha,
      alternative,
    ),
    r = mode === "two" ? two : one,
    touch = () => onInteraction(),
    reset = () => {
      setMode("two");
      setN1(20);
      setVariance1(16);
      setN2(25);
      setVariance2(25);
      setNullValue(1);
      setAlternative("two-sided");
      setAlpha(0.05);
      setAnswer(1);
      touch();
    };
  const domain = mode === "two" ? 5 : Math.max(35, r.statistic * 1.8),
    density = (x: number) =>
      mode === "two"
        ? fDensity(x, two.df1, two.df2)
        : chiSquareDensity(x, one.df),
    samples = Array.from({ length: 121 }, (_, i) => {
      const x = (i / 120) * domain;
      return { x, y: density(x) };
    }),
    maxDensity = Math.max(0.001, ...samples.map((p) => p.y)),
    sx = (x: number) => 6 + Math.min(1, x / domain) * 89,
    curve = samples
      .map((p) => `${sx(p.x)},${76 - (p.y / maxDensity) * 57}`)
      .join(" ");
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      statistic = Math.max(
        0.001,
        ((event.clientX - rect.left) / rect.width) * domain,
      );
    if (mode === "two") setVariance1(statistic * variance2 * nullValue);
    else setVariance1((statistic * nullValue) / (n1 - 1));
    touch();
  };
  const pText = r.pValue.toFixed(4),
    decision = r.reject ? "Reject H0" : "Fail to reject H0";
  return (
    <div className="vt551" data-testid="inference-mockup-0514">
      <header className="vt551-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Variance Tests</h2>
        <p>Compare population variances with Chi-square and F tests.</p>
        <b>Learning objective</b>
        <b>Examples</b>
        <b>Formulas</b>
        <b>Common pitfalls</b>
        <b>Assumptions &amp; cautions</b>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <main>
        <header>
          <div>
            <span>INTERACTION + VISUALIZATION</span>
            <h3>Variance Tests Explorer</h3>
            <p>
              Choose a test, enter summaries, and explore the sampling
              distribution.
            </p>
          </div>
          <b>
            Mode:{" "}
            {mode === "two"
              ? "Two-variance F test"
              : "One-variance chi-square test"}
          </b>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset all
          </button>
        </header>
        <section className="vt551-setup">
          <article>
            <h3>1. Choose test</h3>
            <button
              className={mode === "one" ? "active" : ""}
              onClick={() => {
                setMode("one");
                setNullValue(25);
                touch();
              }}
            >
              One-variance
              <br />
              χ² test
            </button>
            <button
              className={mode === "two" ? "active" : ""}
              onClick={() => {
                setMode("two");
                setNullValue(1);
                touch();
              }}
            >
              Two-variance
              <br />F test
            </button>
          </article>
          <article>
            <h3>2. Enter sample summaries</h3>
            <div>
              <fieldset>
                <legend>Sample 1</legend>
                <label>
                  Sample size n1
                  <input
                    type="number"
                    min="2"
                    value={n1}
                    onChange={(e) => {
                      setN1(+e.target.value);
                      touch();
                    }}
                  />
                </label>
                <label>
                  Sample variance s1²
                  <input
                    type="number"
                    min=".001"
                    step=".5"
                    value={+variance1.toFixed(4)}
                    onChange={(e) => {
                      setVariance1(+e.target.value);
                      touch();
                    }}
                  />
                </label>
              </fieldset>
              {mode === "two" && (
                <fieldset>
                  <legend>Sample 2</legend>
                  <label>
                    Sample size n2
                    <input
                      type="number"
                      min="2"
                      value={n2}
                      onChange={(e) => {
                        setN2(+e.target.value);
                        touch();
                      }}
                    />
                  </label>
                  <label>
                    Sample variance s2²
                    <input
                      type="number"
                      min=".001"
                      step=".5"
                      value={variance2}
                      onChange={(e) => {
                        setVariance2(+e.target.value);
                        touch();
                      }}
                    />
                  </label>
                </fieldset>
              )}
            </div>
          </article>
          <article>
            <h3>3. Hypothesis</h3>
            <label>
              {mode === "two"
                ? "Variance ratio under H0"
                : "Population variance under H0"}
              <input
                type="number"
                min=".001"
                step=".5"
                value={nullValue}
                onChange={(e) => {
                  setNullValue(+e.target.value);
                  touch();
                }}
              />
            </label>
          </article>
        </section>
        <section className="vt551-options">
          <article>
            <h3>4. Tails &amp; significance</h3>
            <label>
              Alternative hypothesis
              <select
                value={alternative}
                onChange={(e) => {
                  setAlternative(e.target.value as TAlternative);
                  touch();
                }}
              >
                <option value="two-sided">Two-sided (≠)</option>
                <option value="greater">Right-tailed (&gt;)</option>
                <option value="less">Left-tailed (&lt;)</option>
              </select>
            </label>
            <label>
              Significance level alpha
              <input
                type="number"
                min=".001"
                max=".2"
                step=".01"
                value={alpha}
                onChange={(e) => {
                  setAlpha(+e.target.value);
                  touch();
                }}
              />
            </label>
          </article>
          <article>
            <h3>5. Test statistic</h3>
            <p>
              {mode === "two"
                ? "F = (s1²/s2²) / ratio0"
                : "χ² = (n-1)s² / variance0"}
            </p>
            <strong>{r.statistic.toFixed(4)}</strong>
          </article>
          <article>
            <h3>6. Reference distribution</h3>
            <p>
              {mode === "two"
                ? `F distribution, df1=${two.df1}, df2=${two.df2}`
                : `Chi-square distribution, df=${one.df}`}
            </p>
            <b>Right-tailed reference CDF</b>
          </article>
        </section>
        <section className="vt551-chart">
          <article>
            <h3>7. Sampling distribution under H0</h3>
            <svg
              viewBox="0 0 100 90"
              preserveAspectRatio="none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) drag(e);
              }}
            >
              <polygon
                points={`${sx(r.upper)},76 ${samples
                  .filter((p) => p.x >= r.upper)
                  .map((p) => `${sx(p.x)},${76 - (p.y / maxDensity) * 57}`)
                  .join(" ")} 95,76`}
              />
              <polyline points={curve} />
              <line x1="6" x2="96" y1="76" y2="76" />
              <line
                className="low"
                x1={sx(r.lower)}
                x2={sx(r.lower)}
                y1="45"
                y2="76"
              />
              <line
                className="high"
                x1={sx(r.upper)}
                x2={sx(r.upper)}
                y1="45"
                y2="76"
              />
              <line
                className="observed"
                x1={sx(r.statistic)}
                x2={sx(r.statistic)}
                y1="25"
                y2="76"
              />
              <text x={sx(r.statistic)} y="21" textAnchor="middle">
                Observed = {r.statistic.toFixed(3)}
              </text>
            </svg>
            <p>Drag the observed line to change sample variance 1.</p>
          </article>
          <aside>
            <section>
              <h3>Critical values</h3>
              <p>
                Lower{" "}
                <b>{Number.isFinite(r.lower) ? r.lower.toFixed(4) : "0"}</b>
              </p>
              <p>
                Upper{" "}
                <b>{Number.isFinite(r.upper) ? r.upper.toFixed(4) : "∞"}</b>
              </p>
              <p>
                Acceptance region{" "}
                <b>
                  {r.lower.toFixed(4)} to{" "}
                  {Number.isFinite(r.upper) ? r.upper.toFixed(4) : "∞"}
                </b>
              </p>
            </section>
            <section>
              <h3>Decision</h3>
              <b>{decision}</b>
              <p>
                Observed statistic is{" "}
                {r.reject
                  ? "in the rejection region"
                  : "inside the acceptance region"}
                .
              </p>
            </section>
            <section>
              <h3>p-value ({alternative})</h3>
              <strong>{pText}</strong>
              <p>
                p {r.reject ? "<" : ">="} {alpha.toFixed(2)}
              </p>
            </section>
          </aside>
        </section>
        <section className="vt551-detail">
          <article>
            <h3>8. Interpretation</h3>
            <p>
              At the {(alpha * 100).toFixed(0)}% significance level, we{" "}
              {r.reject ? "reject" : "fail to reject"} the null variance
              statement.
            </p>
          </article>
          <article>
            <h3>Guided calculation</h3>
            <p>
              {mode === "two"
                ? `F = (${variance1.toFixed(2)}/${variance2.toFixed(2)})/${nullValue.toFixed(2)} = ${two.statistic.toFixed(4)}`
                : `χ² = (${n1}-1)(${variance1.toFixed(2)})/${nullValue.toFixed(2)} = ${one.statistic.toFixed(4)}`}
            </p>
            <p>
              Critical values follow from the selected reference distribution
              and alpha.
            </p>
          </article>
        </section>
      </main>
      <section className="vt551-notes">
        <article>
          <h3>Key insight</h3>
          <p>
            The F test uses a ratio of independent sample variances. Direction
            matters for one-tailed alternatives.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>Use variances, not standard deviations, in the test statistic.</p>
        </article>
        <article>
          <h3>Assumptions &amp; cautions</h3>
          <p>
            Independent observations and approximately normal populations.
            Classical variance tests are sensitive to outliers and
            non-normality.
          </p>
        </article>
      </section>
      <section className="vt551-quiz">
        <h3>Quick check</h3>
        <p>For the current inputs, what is the correct conclusion?</p>
        {[
          "Reject H0; variances differ.",
          "Fail to reject H0; insufficient evidence that variances differ.",
          "Reject H0 because the first variance is smaller.",
        ].map((choice, index) => (
          <button
            key={choice}
            className={
              answer === index
                ? index === (r.reject ? 0 : 1)
                  ? "correct"
                  : "incorrect"
                : ""
            }
            onClick={() => {
              setAnswer(index);
              touch();
            }}
          >
            {String.fromCharCode(65 + index)}. {choice}
          </button>
        ))}
        <aside
          className={answer === (r.reject ? 0 : 1) ? "correct" : "incorrect"}
        >
          <Check size={14} />
          <b>
            {answer === (r.reject ? 0 : 1)
              ? "Correct."
              : "Compare p with alpha."}
          </b>{" "}
          p = {pText}; {decision}.
        </aside>
      </section>
      <footer>
        <span>Previous &nbsp; Chi-Square Independence</span>
        <span>Next &nbsp; ANOVA</span>
      </footer>
    </div>
  );
}
