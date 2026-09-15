import { Check, Download, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import type { TAlternative } from "./oneSampleTTestLessonModel";
import {
  twoSampleTTest,
  type TwoSampleMethod,
} from "./twoSampleTTestLessonModel";
import "./TwoSampleTTestLesson545.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const sample1 = [12, 15, 14, 13, 16, 17, 11, 14, 16, 15],
  sample2 = [10, 9, 11, 10, 12, 9, 8, 11, 10, 9, 8, 10];
const parse = (text: string) =>
  text
    .split(/[\s,]+/)
    .map(Number)
    .filter(Number.isFinite);

export default function TwoSampleTTestLesson545({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <TwoSampleActivity key={resetToken} onInteraction={onInteraction} />;
}

function TwoSampleActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [first, setFirst] = useState(sample1),
    [second, setSecond] = useState(sample2),
    [method, setMethod] = useState<TwoSampleMethod>("welch"),
    [alternative, setAlternative] = useState<TAlternative>("two-sided"),
    [alpha, setAlpha] = useState(0.05),
    [answer, setAnswer] = useState(1);
  const result = twoSampleTTest(first, second, alpha, alternative, method),
    touch = () => onInteraction();
  const reset = () => {
    setFirst(sample1);
    setSecond(sample2);
    setMethod("welch");
    setAlternative("two-sided");
    setAlpha(0.05);
    setAnswer(1);
    touch();
  };
  const sx = (t: number) => 7 + ((Math.max(-4, Math.min(8, t)) + 4) / 12) * 87,
    density = (t: number) => Math.exp((-t * t) / 2),
    curve = Array.from({ length: 121 }, (_, i) => {
      const t = -4 + i / 10;
      return `${sx(t)},${76 - density(t) * 57}`;
    }).join(" ");
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      t = -4 + ((event.clientX - rect.left) / rect.width) * 12,
      desired = t * result.se,
      delta = desired - result.difference;
    setFirst((values) => values.map((value) => value + delta));
    touch();
  };
  const update = (setter: (values: number[]) => void, text: string) => {
    const values = parse(text);
    if (values.length >= 2) setter(values);
    touch();
  };
  const download = () => {
    const text = [
        "Two-Sample t-Test",
        `Method: ${method}`,
        `Mean 1: ${result.first.mean}`,
        `Mean 2: ${result.second.mean}`,
        `t: ${result.statistic}`,
        `df: ${result.df}`,
        `p-value: ${result.pValue}`,
        `Decision: ${result.reject ? "Reject H0" : "Fail to reject H0"}`,
      ].join("\n"),
      url = URL.createObjectURL(new Blob([text], { type: "text/plain" })),
      link = document.createElement("a");
    link.href = url;
    link.download = "two-sample-t-test-summary.txt";
    link.click();
    URL.revokeObjectURL(url);
    touch();
  };
  const decision = result.reject ? "Reject H0" : "Fail to reject H0",
    pText = result.pValue < 0.0001 ? "< 0.0001" : result.pValue.toFixed(4);
  return (
    <div className="tw545" data-testid="inference-mockup-0508">
      <header className="tw545-hero">
        <div>
          <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
          <h2>Two-Sample t-Test</h2>
          <p>Compare means of two independent groups.</p>
          <b>Learning objective</b>
          <p>
            Use a two-sample t test to determine whether two population means
            are different.
          </p>
        </div>
        <aside>
          <h3>At a glance</h3>
          <p>
            Test type <b>Two-sample t test</b>
          </p>
          <p>
            Variance assumption{" "}
            <b>{method === "welch" ? "Welch (unequal)" : "Pooled (equal)"}</b>
          </p>
          <p>
            Alternative <b>{alternative}</b>
          </p>
          <p>
            alpha <b>{alpha.toFixed(2)}</b>
          </p>
          <p>
            Result <b>{decision}</b>
          </p>
        </aside>
      </header>
      <nav>
        <b>Interactive</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Assumptions</span>
        <span>Know More</span>
      </nav>
      <main>
        <header>
          <h3>
            <i>1</i> Configure your test
          </h3>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset all
          </button>
        </header>
        <section className="tw545-samples">
          <article>
            <h3>
              Group 1 (Sample 1) <b>n1 = {result.first.n}</b>
            </h3>
            <label>
              Paste data (one per line)
              <textarea
                value={first.join(", ")}
                onChange={(e) => update(setFirst, e.target.value)}
              />
            </label>
            <footer>
              <span>
                Mean <b>{result.first.mean.toFixed(2)}</b>
              </span>
              <span>
                SD <b>{result.first.sd.toFixed(4)}</b>
              </span>
              <span>
                Variance <b>{result.first.variance.toFixed(3)}</b>
              </span>
            </footer>
          </article>
          <article>
            <h3>
              Group 2 (Sample 2) <b>n2 = {result.second.n}</b>
            </h3>
            <label>
              Paste data (one per line)
              <textarea
                value={second.join(", ")}
                onChange={(e) => update(setSecond, e.target.value)}
              />
            </label>
            <footer>
              <span>
                Mean <b>{result.second.mean.toFixed(2)}</b>
              </span>
              <span>
                SD <b>{result.second.sd.toFixed(4)}</b>
              </span>
              <span>
                Variance <b>{result.second.variance.toFixed(3)}</b>
              </span>
            </footer>
          </article>
        </section>
        <section className="tw545-options">
          <label>
            Variance assumption
            <button
              className={method === "welch" ? "active" : ""}
              onClick={() => {
                setMethod("welch");
                touch();
              }}
            >
              Welch (unequal variances)
            </button>
            <button
              className={method === "pooled" ? "active" : ""}
              onClick={() => {
                setMethod("pooled");
                touch();
              }}
            >
              Pooled (equal variances)
            </button>
          </label>
          <label>
            Alternative hypothesis
            <select
              value={alternative}
              onChange={(e) => {
                setAlternative(e.target.value as TAlternative);
                touch();
              }}
            >
              <option value="two-sided">Two-sided (mu1 ≠ mu2)</option>
              <option value="greater">mu1 &gt; mu2</option>
              <option value="less">mu1 &lt; mu2</option>
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
        </section>
        <p className="tw545-hyp">
          Hypotheses &nbsp; H0: mu1 = mu2 &nbsp;&nbsp;&nbsp; Ha:{" "}
          {alternative === "two-sided"
            ? "mu1 ≠ mu2"
            : alternative === "greater"
              ? "mu1 > mu2"
              : "mu1 < mu2"}
        </p>
        <section className="tw545-visual">
          <article>
            <h3>
              <i>2</i> Sampling distributions of x-bar1 and x-bar2
            </h3>
            <svg viewBox="0 0 100 70" preserveAspectRatio="none">
              <path
                d={`M5 59 Q ${30 + result.first.mean - result.second.mean} 5 52 59`}
              />
              <path d="M25 59 Q 52 12 76 59" />
              <line x1="4" x2="96" y1="59" y2="59" />
              <line className="one" x1="52" x2="52" y1="18" y2="59" />
              <line className="two" x1="49" x2="49" y1="27" y2="59" />
            </svg>
            <div>
              <b>E[x-bar1] = {result.first.mean.toFixed(2)}</b>
              <b>E[x-bar2] = {result.second.mean.toFixed(2)}</b>
            </div>
          </article>
          <article>
            <h3>Test statistic t under H0 ({method})</h3>
            <svg
              viewBox="0 0 100 92"
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
              <line x1="6" x2="95" y1="76" y2="76" />
              <rect
                className="tail"
                x={sx(Math.abs(result.statistic))}
                y="61"
                width={Math.max(0, 95 - sx(Math.abs(result.statistic)))}
                height="15"
              />
              <line
                className="observed"
                x1={sx(result.statistic)}
                x2={sx(result.statistic)}
                y1="30"
                y2="76"
              />
              <text x={sx(result.statistic)} y="26" textAnchor="middle">
                t = {result.statistic.toFixed(3)}
              </text>
            </svg>
            <footer>
              <span>
                Computed t <b>{result.statistic.toFixed(3)}</b>
              </span>
              <span>
                df <b>{result.df.toFixed(2)}</b>
              </span>
              <span>
                p-value <b>{pText}</b>
              </span>
            </footer>
          </article>
        </section>
        <aside
          className={result.reject ? "tw545-decision reject" : "tw545-decision"}
        >
          <Check size={18} />
          <b>Decision: {decision}</b>
          <span>
            Since p {result.reject ? "<" : ">="} {alpha.toFixed(2)},{" "}
            {result.reject
              ? "the population means differ in the direction of Ha."
              : "there is insufficient evidence of a difference."}
          </span>
        </aside>
        <section className="tw545-lower">
          <article>
            <h3>Guided calculation ({method} two-sample t test)</h3>
            <p>Step 1: Difference in sample means</p>
            <b>
              x-bar1 - x-bar2 = {result.first.mean.toFixed(2)} -{" "}
              {result.second.mean.toFixed(2)} = {result.difference.toFixed(2)}
            </b>
            <p>Step 2: Standard error</p>
            <b>SE = {result.se.toFixed(4)}</b>
            <p>Step 3: Test statistic</p>
            <b>
              t = {result.difference.toFixed(2)} / {result.se.toFixed(4)} ={" "}
              {result.statistic.toFixed(3)}
            </b>
            <p>Step 4: Degrees of freedom</p>
            <b>df = {result.df.toFixed(2)}</b>
            <p>
              {((1 - alpha) * 100).toFixed(0)}% CI = ({result.lower.toFixed(3)},{" "}
              {result.upper.toFixed(3)})
            </p>
          </article>
          <article>
            <h3>Results summary</h3>
            <table>
              <tbody>
                {[
                  ["Sample sizes", `${result.first.n}, ${result.second.n}`],
                  [
                    "Means",
                    `${result.first.mean.toFixed(2)}, ${result.second.mean.toFixed(2)}`,
                  ],
                  [
                    "Standard deviations",
                    `${result.first.sd.toFixed(4)}, ${result.second.sd.toFixed(4)}`,
                  ],
                  ["Test statistic", result.statistic.toFixed(3)],
                  ["Degrees of freedom", result.df.toFixed(2)],
                  ["p-value", pText],
                  ["Decision", decision],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={download}>
              <Download size={13} /> Download summary
            </button>
          </article>
        </section>
      </main>
      <section className="tw545-notes">
        <article>
          <h3>Key insight</h3>
          <p>
            The observed difference is evaluated relative to its sampling
            variability.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>
            Do not pool when group variances differ unless the equal-variance
            assumption is justified.
          </p>
        </article>
        <article>
          <h3>Assumptions &amp; cautions</h3>
          <p>
            Independent samples, approximately normal populations or adequate
            sample sizes, and no serious outliers.
          </p>
        </article>
      </section>
      <section className="tw545-quiz">
        <h3>Quick check</h3>
        <p>
          Based on the current results, what is the correct conclusion at alpha
          = {alpha.toFixed(2)}?
        </p>
        <div>
          {[
            "Fail to reject H0; not enough evidence that means differ.",
            "Reject H0; there is evidence the means differ.",
            "Fail to reject H0; the samples are too small.",
            "Reject H0 only for one-sided tests.",
          ].map((choice, index) => (
            <button
              key={choice}
              className={
                answer === index
                  ? index === (result.reject ? 1 : 0)
                    ? "correct"
                    : "incorrect"
                  : ""
              }
              onClick={() => {
                setAnswer(index);
                touch();
              }}
            >
              {String.fromCharCode(65 + index)} &nbsp; {choice}
            </button>
          ))}
        </div>
        <aside
          className={
            answer === (result.reject ? 1 : 0) ? "correct" : "incorrect"
          }
        >
          <b>
            {answer === (result.reject ? 1 : 0)
              ? "Correct."
              : "Compare p with alpha."}
          </b>{" "}
          p-value {pText}; decision: {decision}.
        </aside>
      </section>
      <footer>
        <span>Previous &nbsp; One-Sample t Test</span>
        <span>Next &nbsp; Paired t Test</span>
      </footer>
      <LessonTopicStudyBoard lessonId={545} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
