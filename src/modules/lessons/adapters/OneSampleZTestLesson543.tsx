import { Check, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { oneSampleZTest, type ZAlternative } from "./oneSampleZTestLessonModel";
import "./OneSampleZTestLesson543.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

export default function OneSampleZTestLesson543({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <ZTestActivity key={resetToken} onInteraction={onInteraction} />;
}

function ZTestActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [sigma, setSigma] = useState(12),
    [n, setN] = useState(36),
    [sampleMean, setSampleMean] = useState(106),
    [nullMean, setNullMean] = useState(100),
    [alternative, setAlternative] = useState<ZAlternative>("two-sided"),
    [alpha, setAlpha] = useState(0.05),
    [answer, setAnswer] = useState(0);
  const result = oneSampleZTest(
      sampleMean,
      nullMean,
      sigma,
      n,
      alpha,
      alternative,
    ),
    touch = () => onInteraction();
  const reset = () => {
    setSigma(12);
    setN(36);
    setSampleMean(106);
    setNullMean(100);
    setAlternative("two-sided");
    setAlpha(0.05);
    setAnswer(0);
    touch();
  };
  const sx = (z: number) =>
    8 + ((Math.max(-3.3, Math.min(3.3, z)) + 3.3) / 6.6) * 84;
  const curve = Array.from({ length: 81 }, (_, index) => {
    const z = -3.3 + (index / 80) * 6.6;
    return `${sx(z)},${76 - Math.exp((-z * z) / 2) * 59}`;
  }).join(" ");
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      z = -3.3 + ((event.clientX - rect.left) / rect.width) * 6.6;
    setSampleMean(nullMean + z * result.se);
    touch();
  };
  const altLabel =
      alternative === "two-sided"
        ? "not equal to"
        : alternative === "greater"
          ? "greater than"
          : "less than",
    pText = result.pValue.toFixed(4);
  return (
    <div className="zt543" data-testid="inference-mockup-0506">
      <header className="zt543-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>One-Sample z-Test</h2>
        <p>
          Test a mean with known population standard deviation using the
          standard normal.
        </p>
        <section>
          <b>Intermediate</b>
          <b>Sampling &amp; Distributions</b>
          <b>6-10 min</b>
          <b>Interactive Lab</b>
          <b>Z Test, Mean, Hypothesis</b>
        </section>
        <button onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
      </header>
      <nav>
        <b>Interactive Lab</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know More</span>
      </nav>
      <main>
        <h3>One-Sample Z Test</h3>
        <section className="zt543-lab">
          <aside className="zt543-controls">
            <label>
              Population standard deviation (sigma known)
              <input
                type="number"
                value={sigma}
                min="0.1"
                step="0.5"
                onChange={(e) => {
                  setSigma(+e.target.value);
                  touch();
                }}
              />
            </label>
            <label>
              Sample size (n)
              <input
                type="number"
                value={n}
                min="1"
                onChange={(e) => {
                  setN(Math.max(1, +e.target.value));
                  touch();
                }}
              />
            </label>
            <label>
              Sample mean (x-bar)
              <input
                type="number"
                value={+sampleMean.toFixed(3)}
                step="0.5"
                onChange={(e) => {
                  setSampleMean(+e.target.value);
                  touch();
                }}
              />
            </label>
            <label>
              Null mean (mu0)
              <input
                type="number"
                value={nullMean}
                step="0.5"
                onChange={(e) => {
                  setNullMean(+e.target.value);
                  touch();
                }}
              />
            </label>
            <fieldset>
              <legend>Alternative hypothesis</legend>
              {(["two-sided", "greater", "less"] as ZAlternative[]).map(
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
                      ? "≠ mu0"
                      : item === "greater"
                        ? "> mu0"
                        : "< mu0"}
                    <small>
                      {item === "two-sided"
                        ? "Two-sided"
                        : item === "greater"
                          ? "Right-tailed"
                          : "Left-tailed"}
                    </small>
                  </button>
                ),
              )}
            </fieldset>
            <label>
              Significance level (alpha)
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
            <button className="zt543-update" onClick={touch}>
              <RotateCcw size={14} /> Update
            </button>
            <p>Drag the yellow line on the curve to explore z and p-value.</p>
          </aside>
          <article className="zt543-plot">
            <section className="zt543-metrics">
              <span>
                Test statistic (z)<b>{result.z.toFixed(2)}</b>
              </span>
              <span>
                p-value<b>{pText}</b>
              </span>
              <span>
                Significance level (alpha)<b>{alpha.toFixed(2)}</b>
              </span>
            </section>
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
              role="img"
              aria-label="Standard normal distribution with p-value tail areas"
            >
              <polyline points={curve} />
              <line x1="7" x2="94" y1="76" y2="76" />
              <line
                className="zt543-mid"
                x1={sx(0)}
                x2={sx(0)}
                y1="17"
                y2="76"
              />
              {(alternative === "two-sided" || alternative === "less") && (
                <rect
                  className="zt543-tail"
                  x="7"
                  y="60"
                  width={Math.max(
                    0,
                    sx(
                      alternative === "less" ? result.z : -Math.abs(result.z),
                    ) - 7,
                  )}
                  height="16"
                />
              )}
              {(alternative === "two-sided" || alternative === "greater") && (
                <rect
                  className="zt543-tail"
                  x={sx(
                    alternative === "greater" ? result.z : Math.abs(result.z),
                  )}
                  y="60"
                  width={Math.max(
                    0,
                    94 -
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
                className="zt543-observed"
                x1={sx(result.z)}
                x2={sx(result.z)}
                y1="28"
                y2="76"
              />
              <text x={sx(result.z)} y="24" textAnchor="middle">
                z = {result.z.toFixed(2)}
              </text>
              <text x={sx(0)} y="54" textAnchor="middle">
                H0 true
              </text>
              {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
                <text key={tick} x={sx(tick)} y="84" textAnchor="middle">
                  {tick}
                </text>
              ))}
            </svg>
            <div className="zt543-legend">
              <span>Sampling distribution under H0</span>
              <span>p-value ({alternative})</span>
              <span>Observed z</span>
            </div>
            <strong>
              p-value = {pText} {result.reject ? "<" : ">="} alpha ={" "}
              {alpha.toFixed(2)} &nbsp; → &nbsp;{" "}
              {result.reject ? "Reject H0" : "Fail to reject H0"}
            </strong>
          </article>
        </section>
      </main>
      <section className="zt543-details">
        <article className="zt543-steps">
          <h3>Step-by-Step Calculation</h3>
          <p>
            <i>1</i> Standard error of the mean
          </p>
          <b>
            SE = sigma / sqrt(n) = {sigma.toFixed(2)} / sqrt({n}) ={" "}
            {result.se.toFixed(4)}
          </b>
          <p>
            <i>2</i> Test statistic
          </p>
          <b>
            z = (x-bar - mu0) / SE = ({sampleMean.toFixed(2)} -{" "}
            {nullMean.toFixed(2)}) / {result.se.toFixed(4)} ={" "}
            {result.z.toFixed(4)}
          </b>
          <p>
            <i>3</i> p-value ({alternative})
          </p>
          <b>p = {pText}</b>
          <p>
            <i>4</i> Decision
          </p>
          <b>
            {pText} {result.reject ? "<" : ">="} {alpha.toFixed(2)} →{" "}
            {result.reject ? "Reject H0" : "Fail to reject H0"}
          </b>
          <aside>
            <h3>Key Insight</h3>
            <p>
              Known sigma standardizes the sample mean with an exact standard
              normal reference when the assumptions hold.
            </p>
          </aside>
        </article>
        <div>
          <article>
            <h3>Hypothesis Summary</h3>
            <p>H0: mu = {nullMean}</p>
            <p>
              Ha: mu is {altLabel} {nullMean}
            </p>
            <p>alpha = {alpha.toFixed(2)}</p>
            <b>Decision: {result.reject ? "Reject H0" : "Fail to reject H0"}</b>
            <p>
              {result.reject
                ? "The sample provides sufficient evidence for the alternative."
                : "The sample does not provide sufficient evidence for the alternative."}
            </p>
          </article>
          <article>
            <h3>Effect Size (Cohen&apos;s d)</h3>
            <strong>
              d = (x-bar - mu0) / sigma = {result.effectSize.toFixed(2)}
            </strong>
            <p>
              Magnitude:{" "}
              {Math.abs(result.effectSize) < 0.2
                ? "Small"
                : Math.abs(result.effectSize) < 0.8
                  ? "Medium"
                  : "Large"}
            </p>
          </article>
        </div>
        <article>
          <h3>Common Misconception</h3>
          <p>
            A non-significant result does not prove H0 is true. It means the
            evidence was insufficient to reject it.
          </p>
        </article>
        <article>
          <h3>Assumptions &amp; Cautions</h3>
          <p>Observations are independent.</p>
          <p>Population standard deviation sigma is known.</p>
          <p>The sampling distribution of x-bar is normal or n is large.</p>
        </article>
      </section>
      <section className="zt543-quiz">
        <header>
          <h3>Quick Knowledge Check</h3>
          <b>Score: {answer === 0 ? "1 / 1" : "0 / 1"}</b>
        </header>
        <p>
          If we change the alternative hypothesis to Ha: mu &gt; 100 while
          keeping all numbers the same, what are the p-value and decision?
        </p>
        <div>
          {[
            "p = 0.0013; Reject H0",
            "p = 0.0027; Reject H0",
            "p = 0.9987; Fail to reject H0",
            "p = 0.0013; Fail to reject H0",
          ].map((choice, index) => (
            <button
              key={choice}
              className={
                answer === index ? (index === 0 ? "correct" : "incorrect") : ""
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
        <aside className={answer === 0 ? "correct" : "incorrect"}>
          {answer === 0 && <Check size={14} />}
          <b>{answer === 0 ? "Correct." : "Try the right tail."}</b> For a
          right-tailed test, use the area beyond the observed z.
        </aside>
      </section>
      <footer>
        <span>Previous &nbsp; Difference of Proportions Interval</span>
        <span>Next &nbsp; Two-Sample z-Test</span>
      </footer>
      <LessonTopicStudyBoard lessonId={543} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
