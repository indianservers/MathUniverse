import { Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { oneSampleTTest, type TAlternative } from "./oneSampleTTestLessonModel";
import "./OneSampleTTestLesson544.css";

const defaults = [69, 72, 71, 75, 68, 74, 70, 73, 69, 76];

export default function OneSampleTTestLesson544({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <TTestActivity key={resetToken} onInteraction={onInteraction} />;
}

function TTestActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [values, setValues] = useState(defaults),
    [nullMean, setNullMean] = useState(70),
    [alternative, setAlternative] = useState<TAlternative>("two-sided"),
    [alpha, setAlpha] = useState(0.05),
    [answer, setAnswer] = useState(0);
  const result = oneSampleTTest(values, nullMean, alpha, alternative),
    touch = () => onInteraction();
  const reset = () => {
    setValues(defaults);
    setNullMean(70);
    setAlternative("two-sided");
    setAlpha(0.05);
    setAnswer(0);
    touch();
  };
  const sx = (t: number) =>
    7 + ((Math.max(-4.2, Math.min(4.2, t)) + 4.2) / 8.4) * 87;
  const density = (t: number) =>
    Math.pow(1 + (t * t) / result.df, -(result.df + 1) / 2);
  const curve = Array.from({ length: 101 }, (_, index) => {
    const t = -4.2 + (index / 100) * 8.4;
    return `${sx(t)},${76 - density(t) * 57}`;
  }).join(" ");
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      t = -4.2 + ((event.clientX - rect.left) / rect.width) * 8.4,
      nextMean = nullMean + t * result.se,
      delta = nextMean - result.mean;
    setValues((current) => current.map((value) => value + delta));
    touch();
  };
  const updateValue = (index: number, value: number) => {
    setValues((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
    touch();
  };
  const pText = result.pValue.toFixed(4),
    decision = result.reject ? "Reject H0" : "Fail to reject H0";
  return (
    <div className="tt544" data-testid="inference-mockup-0507">
      <header className="tt544-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>One-Sample t-Test</h2>
        <h3>Test a population mean with estimated sigma.</h3>
        <section>
          <article>
            <b>Objective</b>
            <p>
              Decide whether a population mean differs from a hypothesized
              value.
            </p>
          </article>
          <article>
            <b>Test</b>
            <p>t test for one mean (sigma unknown)</p>
          </article>
          <article>
            <b>Use when</b>
            <p>Random sample, population approximately normal or n ≥ 30.</p>
          </article>
          <article>
            <b>Notation</b>
            <p>t = (x-bar - mu0)/(s/sqrt(n))</p>
          </article>
        </section>
        <button onClick={reset}>
          <RotateCcw size={14} /> Reset All
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Assumptions</span>
        <span>Know more</span>
      </nav>
      <main>
        <header>
          <div>
            <span>INTERACTION + VISUALIZATION</span>
            <h3>Test a mean with your data</h3>
            <p>
              Enter sample observations, set mu0 and the alternative, and
              explore the t test.
            </p>
          </div>
          <b>Live</b>
        </header>
        <section className="tt544-lab">
          <aside className="tt544-left">
            <section>
              <h3>1. Sample data</h3>
              <p>Enter or edit your sample observations (n ≥ 2)</p>
              <div className="tt544-values">
                {values.map((value, index) => (
                  <input
                    key={index}
                    aria-label={`Observation ${index + 1}`}
                    type="number"
                    value={+value.toFixed(3)}
                    onChange={(e) => updateValue(index, +e.target.value)}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setValues((current) => [...current, result.mean || 0]);
                  touch();
                }}
              >
                <Plus size={13} /> Add value
              </button>
              <footer>
                <span>n = {result.n}</span>
                <button
                  onClick={() => {
                    setValues([]);
                    touch();
                  }}
                >
                  <Trash2 size={12} /> Clear data
                </button>
              </footer>
            </section>
            <section>
              <h3>2. Hypotheses</h3>
              <label>
                mu0 (hypothesized mean)
                <input
                  type="number"
                  value={nullMean}
                  onChange={(e) => {
                    setNullMean(+e.target.value);
                    touch();
                  }}
                />
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
                  <option value="two-sided">Two-sided (mu ≠ mu0)</option>
                  <option value="greater">Right-tailed (mu &gt; mu0)</option>
                  <option value="less">Left-tailed (mu &lt; mu0)</option>
                </select>
              </label>
              <label>
                Significance level (alpha)
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={alpha * 100}
                  onChange={(e) => {
                    setAlpha(+e.target.value / 100);
                    touch();
                  }}
                />
                <b>{alpha.toFixed(2)}</b>
              </label>
              <dl>
                <div>
                  <dt>Mean, x-bar</dt>
                  <dd>{result.mean.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Std. dev., s</dt>
                  <dd>{result.sd.toFixed(3)}</dd>
                </div>
                <div>
                  <dt>Standard error</dt>
                  <dd>{result.se.toFixed(3)}</dd>
                </div>
                <div>
                  <dt>Degrees of freedom</dt>
                  <dd>{result.df}</dd>
                </div>
              </dl>
            </section>
          </aside>
          <article className="tt544-plot">
            <h3>3. Sampling distribution of t (df = {result.df})</h3>
            <p>{alternative} test: shaded area = p-value</p>
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
              aria-label="Student t distribution with observed statistic"
            >
              <polyline points={curve} />
              <line x1="6" x2="95" y1="76" y2="76" />
              <line
                className="tt544-mid"
                x1={sx(0)}
                x2={sx(0)}
                y1="18"
                y2="76"
              />
              {(alternative === "two-sided" || alternative === "less") && (
                <rect
                  className="tt544-tail"
                  x="6"
                  y="60"
                  width={Math.max(
                    0,
                    sx(
                      alternative === "less"
                        ? result.statistic
                        : -Math.abs(result.statistic),
                    ) - 6,
                  )}
                  height="16"
                />
              )}
              {(alternative === "two-sided" || alternative === "greater") && (
                <rect
                  className="tt544-tail"
                  x={sx(
                    alternative === "greater"
                      ? result.statistic
                      : Math.abs(result.statistic),
                  )}
                  y="60"
                  width={Math.max(
                    0,
                    95 -
                      sx(
                        alternative === "greater"
                          ? result.statistic
                          : Math.abs(result.statistic),
                      ),
                  )}
                  height="16"
                />
              )}
              <line
                className="tt544-observed"
                x1={sx(result.statistic)}
                x2={sx(result.statistic)}
                y1="28"
                y2="76"
              />
              <text x={sx(result.statistic)} y="24" textAnchor="middle">
                t = {result.statistic.toFixed(3)}
              </text>
              {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((t) => (
                <text key={t} x={sx(t)} y="84" textAnchor="middle">
                  {t}
                </text>
              ))}
            </svg>
            <div className="tt544-legend">
              <span>t distribution (df = {result.df})</span>
              <span>p-value ({alternative})</span>
            </div>
            <p>Drag the observed line to shift all observations.</p>
          </article>
          <aside className="tt544-result">
            <section>
              <h3>Result ({alternative})</h3>
              <strong>t = {result.statistic.toFixed(3)}</strong>
              <strong>df = {result.df}</strong>
              <strong>p-value = {pText}</strong>
            </section>
            <section>
              <h3>Decision (alpha = {alpha.toFixed(2)})</h3>
              <b>{decision}</b>
              <p>
                {result.reject
                  ? `There is sufficient evidence that the population mean differs in the direction of Ha.`
                  : "The sample does not provide sufficient evidence for Ha."}
              </p>
            </section>
          </aside>
        </section>
        <section className="tt544-math">
          <article>
            <h3>5. Formula &amp; substitution</h3>
            <p>t = (x-bar - mu0) / (s / sqrt(n))</p>
            <p>
              = ({result.mean.toFixed(2)} - {nullMean.toFixed(2)}) / (
              {result.sd.toFixed(3)} / sqrt({result.n}))
            </p>
            <strong>= {result.statistic.toFixed(3)}</strong>
          </article>
          <article>
            <h3>6. Confidence interval (dual to test)</h3>
            <p>{((1 - alpha) * 100).toFixed(0)}% CI for mu</p>
            <p>x-bar ± t* × s/sqrt(n)</p>
            <p>
              {result.mean.toFixed(2)} ± {result.critical.toFixed(3)} ×{" "}
              {result.se.toFixed(3)}
            </p>
            <strong>
              = ({result.lower.toFixed(2)}, {result.upper.toFixed(2)})
            </strong>
            <p>
              {result.lower <= nullMean && nullMean <= result.upper
                ? `Since ${nullMean} lies inside the CI, we fail to reject H0.`
                : `Since ${nullMean} lies outside the CI, we reject H0.`}
            </p>
          </article>
        </section>
      </main>
      <section className="tt544-notes">
        <article>
          <h3>Key insight</h3>
          <p>
            Larger |t| means a smaller p-value and stronger evidence against H0.
          </p>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p>Failing to reject H0 is not proof that the mean equals mu0.</p>
        </article>
        <article>
          <h3>Assumptions &amp; caution</h3>
          <p>
            Random independent observations; approximately normal population or
            sufficiently large n; no serious outliers.
          </p>
        </article>
      </section>
      <section className="tt544-quiz">
        <header>
          <h3>Quick knowledge check</h3>
          <b>{answer === (result.reject ? 1 : 0) ? "1 of 1" : "0 of 1"}</b>
        </header>
        <p>
          For the current data and test, which conclusion is correct at alpha ={" "}
          {alpha.toFixed(2)}?
        </p>
        <div>
          {[
            `Fail to reject H0. There is not enough evidence for Ha.`,
            `Reject H0. There is sufficient evidence for Ha.`,
            `Reject H0 only because the sample is small.`,
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
          {answer === (result.reject ? 1 : 0) && <Check size={14} />}
          <b>
            {answer === (result.reject ? 1 : 0)
              ? "Correct."
              : "Compare p with alpha."}
          </b>{" "}
          p = {pText} and alpha = {alpha.toFixed(2)}.
        </aside>
      </section>
      <footer>
        <span>Previous &nbsp; z-Test (One Sample)</span>
        <span>Next &nbsp; Two-Sample t-Test</span>
      </footer>
    </div>
  );
}
