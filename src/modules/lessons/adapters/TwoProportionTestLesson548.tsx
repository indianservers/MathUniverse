import { Check, RotateCcw, Shuffle } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import type { TAlternative } from "./oneSampleTTestLessonModel";
import {
  randomTwoProportionExample,
  twoProportionTest,
} from "./twoProportionTestLessonModel";
import "./TwoProportionTestLesson548.css";

export default function TwoProportionTestLesson548({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <TwoProportionActivity key={resetToken} onInteraction={onInteraction} />
  );
}
function TwoProportionActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [x1, setX1] = useState(58),
    [n1, setN1] = useState(200),
    [x2, setX2] = useState(38),
    [n2, setN2] = useState(200),
    [alpha, setAlpha] = useState(0.05),
    [alternative, setAlternative] = useState<TAlternative>("two-sided"),
    [seed, setSeed] = useState(548),
    [answer, setAnswer] = useState(2);
  const r = twoProportionTest(x1, n1, x2, n2, alpha, alternative),
    touch = () => onInteraction(),
    reset = () => {
      setX1(58);
      setN1(200);
      setX2(38);
      setN2(200);
      setAlpha(0.05);
      setAlternative("two-sided");
      setSeed(548);
      setAnswer(2);
      touch();
    };
  const random = () => {
    const next = seed + 1,
      s = randomTwoProportionExample(next, n1, n2);
    setSeed(next);
    setX1(s.x1);
    setX2(s.x2);
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
      difference = z * r.seNull;
    setX1(Math.max(0, Math.min(n1, Math.round((r.p2 + difference) * n1))));
    touch();
  };
  const pText = r.pValue < 0.0001 ? "< 0.0001" : r.pValue.toFixed(4),
    decision = r.reject ? "Reject H0" : "Fail to reject H0";
  return (
    <div className="tp548" data-testid="inference-mockup-0511">
      <header className="tp548-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Two-Proportion Test</h2>
        <p>Compare two population proportions.</p>
        <b>Advanced</b>
        <b>Inference Lab</b>
        <b>Probability Calculator / Statistics</b>
        <button onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <section className="tp548-intro">
        <article>
          <h3>Learning Objective</h3>
          <p>
            Test whether two population proportions are equal against the
            selected alternative.
          </p>
        </article>
        <article>
          <h3>Key Insight</h3>
          <p>
            Under H0, use the pooled proportion to estimate the common
            proportion.
          </p>
        </article>
        <article>
          <h3>Conclusion (alpha = {alpha.toFixed(2)})</h3>
          <b>{decision}</b>
          <p>p-value = {pText}</p>
        </article>
      </section>
      <main>
        <header>
          <div>
            <h3>
              <i>1</i> Set the data for the two groups
            </h3>
            <p>Enter successes and totals or use a random example.</p>
          </div>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset Data
          </button>
        </header>
        <section className="tp548-data">
          <aside>
            {[
              ["Group 1", "Treatment", x1, n1, setX1, setN1],
              ["Group 2", "Control", x2, n2, setX2, setN2],
            ].map((group, index) => (
              <fieldset key={index}>
                <legend>
                  {group[0] as string}
                  <span>{group[1] as string}</span>
                </legend>
                <label>
                  Successes
                  <input
                    type="number"
                    min="0"
                    max={group[3] as number}
                    value={group[2] as number}
                    onChange={(e) => {
                      (group[4] as (v: number) => void)(
                        Math.max(
                          0,
                          Math.min(group[3] as number, +e.target.value),
                        ),
                      );
                      touch();
                    }}
                  />
                </label>
                <label>
                  Total
                  <input
                    type="number"
                    min="1"
                    value={group[3] as number}
                    onChange={(e) => {
                      const total = Math.max(1, +e.target.value);
                      (group[5] as (v: number) => void)(total);
                      (group[4] as (v: number) => void)(
                        Math.min(group[2] as number, total),
                      );
                      touch();
                    }}
                  />
                </label>
                <b>
                  p-hat{index + 1} = {(index ? r.p2 : r.p1).toFixed(4)}
                </b>
              </fieldset>
            ))}
          </aside>
          <article>
            <h3>Proportions at a Glance</h3>
            <label>
              Group 1 <b>{(r.p1 * 100).toFixed(2)}%</b>
              <i>
                <span style={{ width: `${r.p1 * 100}%` }} />
              </i>
            </label>
            <label>
              Group 2 <b>{(r.p2 * 100).toFixed(2)}%</b>
              <i>
                <span style={{ width: `${r.p2 * 100}%` }} />
              </i>
            </label>
          </article>
          <aside className="tp548-summary">
            <h3>Quick Summary</h3>
            <p>
              n1={r.n1}, x1={r.x1}, p1={r.p1.toFixed(4)}
            </p>
            <p>
              n2={r.n2}, x2={r.x2}, p2={r.p2.toFixed(4)}
            </p>
            <strong>Difference = {r.difference.toFixed(4)}</strong>
            <button onClick={random}>
              <Shuffle size={13} /> Random Example
            </button>
          </aside>
        </section>
        <label className="tp548-alt">
          Alternative
          <select
            value={alternative}
            onChange={(e) => {
              setAlternative(e.target.value as TAlternative);
              touch();
            }}
          >
            <option value="two-sided">p1 ≠ p2</option>
            <option value="greater">p1 &gt; p2</option>
            <option value="less">p1 &lt; p2</option>
          </select>
          alpha
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
        <section className="tp548-test">
          <article>
            <h3>
              <i>2</i> Pooled Proportion and Standard Error (Under H0)
            </h3>
            <p>Pooled proportion</p>
            <strong>p = (x1+x2)/(n1+n2) = {r.pooled.toFixed(4)}</strong>
            <p>Pooled standard error</p>
            <strong>SE0 = sqrt[p(1-p)(1/n1+1/n2)]</strong>
            <strong>= {r.seNull.toFixed(6)}</strong>
          </article>
          <article>
            <h3>
              <i>3</i> Test Statistic and p-value
            </h3>
            <p>
              z = (p1-p2)/SE0 = {r.difference.toFixed(4)}/{r.seNull.toFixed(6)}{" "}
              = {r.z.toFixed(3)}
            </p>
            <svg
              viewBox="0 0 100 86"
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
              <rect
                className="tail"
                x={sx(Math.abs(r.z))}
                y="60"
                width={Math.max(0, 96 - sx(Math.abs(r.z)))}
                height="15"
              />
              <line
                className="observed"
                x1={sx(r.z)}
                x2={sx(r.z)}
                y1="28"
                y2="75"
              />
              <text x={sx(r.z)} y="24" textAnchor="middle">
                z = {r.z.toFixed(3)}
              </text>
            </svg>
            <b>
              {alternative} p-value = {pText}
            </b>
            <p>Drag the observed line to update Group 1.</p>
          </article>
          <article>
            <h3>Interpretation</h3>
            <p>
              The observed difference is {Math.abs(r.z).toFixed(2)} standard
              errors from zero.
            </p>
            <b>{decision}</b>
            <p>
              {r.reject
                ? "There is evidence the population proportions differ in the direction of Ha."
                : "There is insufficient evidence for Ha."}
            </p>
          </article>
        </section>
        <section className="tp548-lower">
          <article>
            <h3>
              <i>4</i> Confidence Interval for p1-p2
            </h3>
            <p>Use unpooled standard error.</p>
            <strong>SE = {r.seInterval.toFixed(6)}</strong>
            <p>
              ME = {r.critical.toFixed(3)} × {r.seInterval.toFixed(6)} ={" "}
              {r.margin.toFixed(4)}
            </p>
            <output>
              ({r.lower.toFixed(4)}, {r.upper.toFixed(4)})
            </output>
          </article>
          <article>
            <h3>
              <i>5</i> Difference in Proportions
            </h3>
            <strong>p1-p2 = {r.difference.toFixed(4)}</strong>
            <table>
              <tbody>
                <tr>
                  <th>Group</th>
                  <th>Successes</th>
                  <th>Total</th>
                  <th>Proportion</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>{r.x1}</td>
                  <td>{r.n1}</td>
                  <td>{r.p1.toFixed(4)}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>{r.x2}</td>
                  <td>{r.n2}</td>
                  <td>{r.p2.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article>
            <h3>
              <i>6</i> Guided Calculation
            </h3>
            {[
              "State hypotheses",
              "Choose significance level",
              "Compute sample proportions",
              "Compute pooled SE",
              "Compute z statistic",
              "Find p-value",
              "Make decision",
            ].map((step) => (
              <p key={step}>
                <Check size={12} />
                {step}
              </p>
            ))}
            <b>All steps complete</b>
          </article>
        </section>
      </main>
      <section className="tp548-notes">
        <article>
          <h3>Assumptions &amp; Conditions</h3>
          <p>
            Independent random samples, binary outcomes, and sufficiently large
            success/failure counts.
          </p>
          <b>
            {r.conditions.met
              ? "All large-count checks pass"
              : "Large-count condition needs attention"}
          </b>
        </article>
        <article>
          <h3>Common Misconception</h3>
          <p>
            Use the pooled SE for the null test, but the unpooled SE for the
            confidence interval.
          </p>
        </article>
        <article>
          <h3>Quick Check</h3>
          <p>What is the correct decision?</p>
          {["Fail to reject H0", "Reject H0", "Use a paired t test"].map(
            (choice, index) => (
              <button
                key={choice}
                className={
                  answer === index
                    ? index === (r.reject ? 1 : 0)
                      ? "correct"
                      : "incorrect"
                    : ""
                }
                onClick={() => {
                  setAnswer(index);
                  touch();
                }}
              >
                {choice}
              </button>
            ),
          )}
          <aside>
            {answer === (r.reject ? 1 : 0)
              ? "Correct."
              : "Compare p-value with alpha."}
          </aside>
        </article>
      </section>
      <section className="tp548-final">
        <Check size={22} />
        <div>
          <h3>Final Summary</h3>
          <p>
            z = {r.z.toFixed(3)}; p-value = {pText};{" "}
            {((1 - alpha) * 100).toFixed(0)}% CI = ({r.lower.toFixed(4)},{" "}
            {r.upper.toFixed(4)})
          </p>
        </div>
        <strong>
          {decision}
          <br />
          (p1{" "}
          {alternative === "two-sided"
            ? "≠"
            : alternative === "greater"
              ? ">"
              : "<"}{" "}
          p2)
        </strong>
      </section>
      <footer>
        <span>Previous &nbsp; One-Proportion Test</span>
        <span>Next &nbsp; Chi-Square Goodness-of-Fit</span>
      </footer>
    </div>
  );
}
