import { Check, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import type { TAlternative } from "./oneSampleTTestLessonModel";
import {
  oneProportionTest,
  type ProportionTestMethod,
} from "./oneProportionTestLessonModel";
import "./OneProportionTestLesson547.css";

export default function OneProportionTestLesson547({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <ProportionActivity key={resetToken} onInteraction={onInteraction} />;
}
function ProportionActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [x, setX] = useState(60),
    [n, setN] = useState(200),
    [p0, setP0] = useState(0.3),
    [alternative, setAlternative] = useState<TAlternative>("two-sided"),
    [method, setMethod] = useState<ProportionTestMethod>("normal"),
    [alpha, setAlpha] = useState(0.05),
    [answers, setAnswers] = useState([0, 0, 0]);
  const result = oneProportionTest(x, n, p0, alpha, alternative, method),
    touch = () => onInteraction(),
    reset = () => {
      setX(60);
      setN(200);
      setP0(0.3);
      setAlternative("two-sided");
      setMethod("normal");
      setAlpha(0.05);
      setAnswers([0, 0, 0]);
      touch();
    };
  const sx = (z: number) =>
      7 + ((Math.max(-3.5, Math.min(3.5, z)) + 3.5) / 7) * 87,
    curve = Array.from({ length: 81 }, (_, i) => {
      const z = -3.5 + (i * 7) / 80;
      return `${sx(z)},${75 - Math.exp((-z * z) / 2) * 56}`;
    }).join(" ");
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      z = -3.5 + ((event.clientX - rect.left) / rect.width) * 7,
      proportion = p0 + z * result.se;
    setX(Math.max(0, Math.min(n, Math.round(proportion * n))));
    touch();
  };
  const pText = result.pValue < 0.0001 ? "< 0.0001" : result.pValue.toFixed(4),
    decision = result.reject ? "Reject H0" : "Fail to reject H0";
  const correct = [0, 0, 0],
    setAnswer = (question: number, value: number) => {
      setAnswers((current) =>
        current.map((item, index) => (index === question ? value : item)),
      );
      touch();
    };
  return (
    <div className="op547" data-testid="inference-mockup-0510">
      <header className="op547-hero">
        <div>
          <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
          <h2>One-Proportion Test</h2>
          <p>Test a population proportion.</p>
          <b>Advanced</b>
          <b>Inference Lab</b>
          <b>Probability Calculator / Statistics</b>
        </div>
        <aside>
          <h3>Learning objective</h3>
          <p>
            Use a one-proportion z test to determine whether a sample proportion
            provides sufficient evidence that the population proportion differs
            from a hypothesized value.
          </p>
        </aside>
        <button onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Assumptions</span>
        <span>Common mistakes</span>
        <span>Know more</span>
      </nav>
      <main>
        <header>
          <h3>One-Proportion Test Explorer</h3>
          <b>
            {result.conditions.met
              ? "All inputs valid"
              : "Normal conditions unmet"}
          </b>
        </header>
        <section className="op547-lab">
          <aside className="op547-controls">
            <label>
              <b>1. Sample data</b>
              <span>
                Successes (x)
                <input
                  type="number"
                  min="0"
                  max={n}
                  value={x}
                  onChange={(e) => {
                    setX(Math.max(0, Math.min(n, +e.target.value)));
                    touch();
                  }}
                />
              </span>
              <span>
                Sample size (n)
                <input
                  type="number"
                  min="1"
                  value={n}
                  onChange={(e) => {
                    const total = Math.max(1, +e.target.value);
                    setN(total);
                    setX((current) => Math.min(current, total));
                    touch();
                  }}
                />
              </span>
            </label>
            <label>
              <b>2. Null proportion (p0)</b>
              <input
                type="number"
                min=".001"
                max=".999"
                step=".01"
                value={p0}
                onChange={(e) => {
                  setP0(+e.target.value);
                  touch();
                }}
              />
            </label>
            <fieldset>
              <legend>3. Alternative hypothesis</legend>
              {(["two-sided", "greater", "less"] as TAlternative[]).map(
                (item) => (
                  <button
                    key={item}
                    className={alternative === item ? "active" : ""}
                    onClick={() => {
                      setAlternative(item);
                      touch();
                    }}
                  >
                    {item === "two-sided"
                      ? "Two-sided p ≠ p0"
                      : item === "greater"
                        ? "Right-tailed p > p0"
                        : "Left-tailed p < p0"}
                  </button>
                ),
              )}
            </fieldset>
            <fieldset>
              <legend>4. Method</legend>
              {(["normal", "exact"] as ProportionTestMethod[]).map((item) => (
                <button
                  key={item}
                  className={method === item ? "active" : ""}
                  onClick={() => {
                    setMethod(item);
                    touch();
                  }}
                >
                  {item === "normal"
                    ? "Normal approximation (z test)"
                    : "Exact binomial test"}
                </button>
              ))}
            </fieldset>
            <label>
              <b>5. Significance level (alpha)</b>
              <select
                value={alpha}
                onChange={(e) => {
                  setAlpha(+e.target.value);
                  touch();
                }}
              >
                <option value=".01">0.01</option>
                <option value=".05">0.05</option>
                <option value=".1">0.10</option>
              </select>
            </label>
          </aside>
          <article className="op547-plot">
            <h3>Null distribution under H0: p = {p0.toFixed(2)}</h3>
            <aside>
              <b>Sampling distribution of p-hat</b>
              <p>Mean = p0 = {p0.toFixed(2)}</p>
              <p>SE = {result.se.toFixed(5)}</p>
            </aside>
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
              <polyline points={curve} />
              <line x1="6" x2="96" y1="75" y2="75" />
              <line className="null" x1={sx(0)} x2={sx(0)} y1="18" y2="75" />
              {(alternative === "two-sided" || alternative === "less") && (
                <rect
                  className="tail"
                  x="6"
                  y="59"
                  width={Math.max(
                    0,
                    sx(
                      alternative === "less" ? result.z : -Math.abs(result.z),
                    ) - 6,
                  )}
                  height="16"
                />
              )}
              {(alternative === "two-sided" || alternative === "greater") && (
                <rect
                  className="tail"
                  x={sx(
                    alternative === "greater" ? result.z : Math.abs(result.z),
                  )}
                  y="59"
                  width={Math.max(
                    0,
                    96 -
                      sx(
                        alternative === "greater"
                          ? result.z
                          : Math.abs(result.z),
                      ),
                  )}
                  height="16"
                />
              )}
              <line
                className="observed"
                x1={sx(result.z)}
                x2={sx(result.z)}
                y1="28"
                y2="75"
              />
              <text x={sx(result.z)} y="24" textAnchor="middle">
                z = {result.z.toFixed(2)}
              </text>
            </svg>
            <p>Drag the observed line to change the success count.</p>
            <footer>
              <span>
                Sample proportion<b>{result.proportion.toFixed(4)}</b>
              </span>
              <span>
                Z statistic<b>{result.z.toFixed(2)}</b>
              </span>
              <span>
                P-value ({method})<b>{pText}</b>
              </span>
              <span>
                Decision at alpha = {alpha.toFixed(2)}
                <b>{decision}</b>
              </span>
            </footer>
            <output>
              Interpretation:{" "}
              {result.reject
                ? `There is sufficient evidence for the ${alternative} alternative.`
                : "The sample does not provide sufficient evidence against the null proportion."}
            </output>
          </article>
        </section>
      </main>
      <section className="op547-lower">
        <article>
          <h3>Guided calculation</h3>
          <p>
            <i>1</i> State the hypotheses
          </p>
          <b>
            H0: p = {p0.toFixed(2)} vs Ha:{" "}
            {alternative === "two-sided"
              ? `p ≠ ${p0.toFixed(2)}`
              : alternative === "greater"
                ? `p > ${p0.toFixed(2)}`
                : `p < ${p0.toFixed(2)}`}
          </b>
          <p>
            <i>2</i> Compute sample proportion
          </p>
          <b>
            p-hat = {x}/{n} = {result.proportion.toFixed(4)}
          </b>
          <p>
            <i>3</i> Standard error under H0
          </p>
          <b>SE = sqrt[p0(1-p0)/n] = {result.se.toFixed(5)}</b>
          <p>
            <i>4</i> Test statistic
          </p>
          <b>z = (p-hat-p0)/SE = {result.z.toFixed(3)}</b>
          <p>
            <i>5</i> P-value ({alternative})
          </p>
          <b>
            {method} p-value = {pText}
          </b>
          <p>
            <i>6</i> Conclusion
          </p>
          <b>{decision}</b>
          <button onClick={touch}>Recalculate</button>
        </article>
        <aside>
          <section>
            <h3>Key insight</h3>
            <p>
              Under H0, the sampling distribution is centered at p0 and uses p0
              in its standard error.
            </p>
          </section>
          <section>
            <h3>Common misconception</h3>
            <p>
              Do not use the sample proportion inside the hypothesis-test
              standard error.
            </p>
          </section>
          <section>
            <h3>Conditions &amp; assumptions</h3>
            <p>
              Random sample, independent observations, binary outcomes, and
              sufficient null successes/failures.
            </p>
            <b>
              np0 = {result.conditions.success.toFixed(1)}; n(1-p0) ={" "}
              {result.conditions.failure.toFixed(1)};{" "}
              {result.conditions.met ? "condition met" : "use exact method"}
            </b>
          </section>
        </aside>
      </section>
      <section className="op547-quiz">
        <h3>Quick check</h3>
        <p>Based on the current sample data, p0, and alpha:</p>
        <div>
          <article>
            <b>1. What is the test statistic?</b>
            {[`z = ${result.z.toFixed(2)}`, "z = 1.96", "z = 2.19"].map(
              (choice, index) => (
                <button
                  key={choice}
                  className={
                    answers[0] === index
                      ? index === correct[0]
                        ? "correct"
                        : "incorrect"
                      : ""
                  }
                  onClick={() => setAnswer(0, index)}
                >
                  {choice}
                </button>
              ),
            )}
          </article>
          <article>
            <b>2. What is the p-value?</b>
            {[`p = ${pText}`, "p = 0.0286", "p = 0.0142"].map(
              (choice, index) => (
                <button
                  key={choice}
                  className={
                    answers[1] === index
                      ? index === correct[1]
                        ? "correct"
                        : "incorrect"
                      : ""
                  }
                  onClick={() => setAnswer(1, index)}
                >
                  {choice}
                </button>
              ),
            )}
          </article>
          <article>
            <b>3. What is your decision?</b>
            {[decision, result.reject ? "Fail to reject H0" : "Reject H0"].map(
              (choice, index) => (
                <button
                  key={choice}
                  className={
                    answers[2] === index
                      ? index === correct[2]
                        ? "correct"
                        : "incorrect"
                      : ""
                  }
                  onClick={() => setAnswer(2, index)}
                >
                  {choice}
                </button>
              ),
            )}
          </article>
          <aside
            className={
              answers.every((value, index) => value === correct[index])
                ? "correct"
                : "incorrect"
            }
          >
            <Check size={18} />
            <b>
              {answers.every((value, index) => value === correct[index])
                ? "Great job!"
                : "Review the live calculation."}
            </b>
          </aside>
        </div>
      </section>
      <footer>
        <span>Previous &nbsp; Paired t-Test</span>
        <span>Next &nbsp; Two-Proportion Test</span>
      </footer>
    </div>
  );
}
