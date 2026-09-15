import { AlertTriangle, Check, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  fCdf,
  fDensity,
  fDistributionAnalysis,
  fQuantile,
} from "./fDistributionLessonModel";
import "./FDistributionLesson531.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const numeratorRows = [3, 4, 5, 6, 8, 10, 15];
const denominatorColumns = [10, 15, 20, 30, 40, 60, 120];

export default function FDistributionLesson531({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <FDistributionActivity key={resetToken} onInteraction={onInteraction} />
  );
}

function FDistributionActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [d1, setD1] = useState(5);
  const [d2, setD2] = useState(20);
  const [alpha, setAlpha] = useState(0.05);
  const [numeratorVariance, setNumeratorVariance] = useState(16);
  const [denominatorVariance, setDenominatorVariance] = useState(5);
  const [answer, setAnswer] = useState(1);
  const [checked, setChecked] = useState(true);
  const analysis = useMemo(
    () => fDistributionAnalysis(d1, d2, alpha),
    [alpha, d1, d2],
  );
  const observedRatio = numeratorVariance / Math.max(0.01, denominatorVariance);
  const domainMax = Math.max(6, analysis.critical * 1.75);
  const samples = Array.from({ length: 151 }, (_, index) => {
    const x = 0.015 + ((domainMax - 0.015) * index) / 150;
    return { x, density: fDensity(x, d1, d2) };
  });
  const maxDensity = Math.max(...samples.map((point) => point.density));
  const px = (value: number) => 5 + (value / domainMax) * 90;
  const py = (value: number) => 88 - (value / maxDensity) * 70;
  const line = samples
    .map((point) => `${px(point.x)},${py(point.density)}`)
    .join(" ");
  const setCriticalFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const value = Math.max(
      0.02,
      (((event.clientX - rect.left) / rect.width - 0.05) / 0.9) * domainMax,
    );
    setAlpha(Math.max(0.001, Math.min(0.25, 1 - fCdf(value, d1, d2))));
    onInteraction();
  };
  const reset = () => {
    setD1(5);
    setD2(20);
    setAlpha(0.05);
    setNumeratorVariance(16);
    setDenominatorVariance(5);
    setAnswer(1);
    setChecked(true);
    onInteraction();
  };
  const decision = observedRatio > analysis.critical;
  const alternatives = [2, 5, 10, 20];

  return (
    <div
      className="fd531"
      data-testid="probability-mockup-0494"
      data-target-family="probability-and-distributions"
    >
      <header className="fd531-hero">
        <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>F Distribution</h2>
        <p>Compare two variances.</p>
        <aside>
          <h3>Objective</h3>
          <p>
            Learn the F distribution, explore right-tail tests, read critical
            values, and interpret variance ratios.
          </p>
          <b>F ~ F(d1, d2), support 0 &lt; F &lt; infinity</b>
        </aside>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Knowledge check</span>
        <span>Know more</span>
      </nav>
      <main className="fd531-lab">
        <header>
          <div>
            <h3>Interaction + visualization</h3>
            <h4>Explore the F distribution</h4>
          </div>
          <strong>Active</strong>
          <button type="button" onClick={reset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </header>
        <section className="fd531-controls">
          <label>
            Numerator d1
            <input
              type="number"
              min="1"
              max="60"
              value={d1}
              onChange={(event) => {
                setD1(Math.max(1, Number(event.target.value)));
                onInteraction();
              }}
            />
          </label>
          <label>
            Denominator d2
            <input
              type="number"
              min="1"
              max="120"
              value={d2}
              onChange={(event) => {
                setD2(Math.max(1, Number(event.target.value)));
                onInteraction();
              }}
            />
          </label>
          <label>
            Tail
            <select value="right" aria-label="Tail">
              <option value="right">Right tail (upper)</option>
            </select>
          </label>
          <label>
            Significance level
            <input
              type="range"
              min=".001"
              max=".2"
              step=".001"
              value={alpha}
              onChange={(event) => {
                setAlpha(Number(event.target.value));
                onInteraction();
              }}
            />
            <output>alpha = {alpha.toFixed(3)}</output>
          </label>
        </section>
        <section className="fd531-plot">
          <article>
            <h3>
              F distribution density F({d1}, {d2})
            </h3>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setCriticalFromPointer(event);
              }}
              onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  setCriticalFromPointer(event);
              }}
            >
              <line className="axis" x1="3" y1="88" x2="97" y2="88" />
              {samples
                .filter((point) => point.x >= analysis.critical)
                .map((point) => (
                  <line
                    className="tail"
                    key={point.x}
                    x1={px(point.x)}
                    y1="88"
                    x2={px(point.x)}
                    y2={py(point.density)}
                  />
                ))}
              <polyline points={line} />
              <line
                className="critical"
                x1={px(analysis.critical)}
                x2={px(analysis.critical)}
                y1="20"
                y2="90"
              />
              <circle cx={px(analysis.critical)} cy="88" r="1.8" />
            </svg>
            <strong>
              Critical F({d1}, {d2}) = {analysis.critical.toFixed(3)}
            </strong>
          </article>
          <aside>
            <section>
              <h3>Variance ratio interpretation</h3>
              <p>F = numerator variance / denominator variance</p>
            </section>
            <section>
              <h3>Your ratio</h3>
              <b>Fobs = {observedRatio.toFixed(3)}</b>
              <p>Compare with critical {analysis.critical.toFixed(3)}</p>
              <strong>
                {decision
                  ? "Decision: Reject H0"
                  : "Decision: Fail to reject H0"}{" "}
                at alpha = {alpha.toFixed(3)}
              </strong>
            </section>
            <section>
              <h3>Enter sample variances</h3>
              <label>
                Numerator variance
                <input
                  type="number"
                  min=".01"
                  step=".25"
                  value={numeratorVariance}
                  onChange={(event) => {
                    setNumeratorVariance(
                      Math.max(0.01, Number(event.target.value)),
                    );
                    onInteraction();
                  }}
                />
              </label>
              <label>
                Denominator variance
                <input
                  type="number"
                  min=".01"
                  step=".25"
                  value={denominatorVariance}
                  onChange={(event) => {
                    setDenominatorVariance(
                      Math.max(0.01, Number(event.target.value)),
                    );
                    onInteraction();
                  }}
                />
              </label>
            </section>
          </aside>
        </section>
        <section className="fd531-slider">
          <b>Drag the purple handle to move the critical ratio</b>
          <input
            type="range"
            min=".001"
            max=".25"
            step=".001"
            value={alpha}
            onChange={(event) => {
              setAlpha(Number(event.target.value));
              onInteraction();
            }}
          />
          <output>{analysis.critical.toFixed(3)}</output>
          <div>
            <span>
              Right tail area <b>{alpha.toFixed(4)}</b>
            </span>
            <span>
              Left area <b>{analysis.leftArea.toFixed(4)}</b>
            </span>
            <span>
              Mean{" "}
              <b>
                {Number.isFinite(analysis.mean)
                  ? analysis.mean.toFixed(4)
                  : "undefined"}
              </b>
            </span>
            <span>
              Variance{" "}
              <b>
                {Number.isFinite(analysis.variance)
                  ? analysis.variance.toFixed(4)
                  : "undefined"}
              </b>
            </span>
          </div>
        </section>
        <section className="fd531-lower">
          <article>
            <h3>
              F-table (upper-tail critical values), alpha = {alpha.toFixed(3)}
            </h3>
            <table>
              <thead>
                <tr>
                  <th>d1\d2</th>
                  {denominatorColumns.map((value) => (
                    <th key={value}>{value}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numeratorRows.map((row) => (
                  <tr key={row} className={row === d1 ? "selected" : ""}>
                    <th>{row}</th>
                    {denominatorColumns.map((column) => (
                      <td key={column}>
                        <button
                          type="button"
                          className={
                            row === d1 && column === d2 ? "active" : ""
                          }
                          onClick={() => {
                            setD1(row);
                            setD2(column);
                            onInteraction();
                          }}
                        >
                          {fQuantile(1 - alpha, row, column).toFixed(2)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article>
            <h3>Family of F distributions (d2 = {d2})</h3>
            <svg viewBox="0 0 100 75" preserveAspectRatio="none">
              <line className="axis" x1="3" y1="67" x2="97" y2="67" />
              {alternatives.map((degree, index) => {
                const points = Array.from({ length: 100 }, (_, i) => {
                  const x = 0.02 + (6 * i) / 99;
                  return `${5 + (x / 6) * 90},${67 - Math.min(1, fDensity(x, degree, d2) / 1.2) * 55}`;
                }).join(" ");
                return (
                  <polyline
                    key={degree}
                    className={`family family-${index}`}
                    points={points}
                  />
                );
              })}
            </svg>
            <p>{alternatives.map((degree) => `d1=${degree}`).join("  |  ")}</p>
          </article>
        </section>
        <section className="fd531-notes">
          <article>
            <h3>Key insight</h3>
            <p>
              The F distribution models a ratio of two independent sample
              variances and changes with both degrees of freedom.
            </p>
          </article>
          <article>
            <AlertTriangle size={16} />
            <h3>Common misconception</h3>
            <p>F tests compare variability, not means.</p>
          </article>
          <article>
            <ShieldCheck size={16} />
            <h3>Assumptions &amp; caution</h3>
            <p>
              Use independent random samples from approximately normal
              populations.
            </p>
          </article>
        </section>
        <section className="fd531-quiz">
          <h3>Quick knowledge check</h3>
          <article>
            <div>
              <b>For F(5, 20) at alpha=0.05, the critical value equals:</b>
              {["2.234", "2.710", "3.850", "1.960"].map((option, index) => (
                <label
                  key={option}
                  className={answer === index ? "selected" : ""}
                >
                  <input
                    type="radio"
                    checked={answer === index}
                    onChange={() => {
                      setAnswer(index);
                      setChecked(false);
                      onInteraction();
                    }}
                  />
                  {String.fromCharCode(65 + index)}. {option}
                </label>
              ))}
            </div>
            <aside
              className={checked && answer === 1 ? "correct" : "incorrect"}
            >
              {checked && answer === 1 ? (
                <Check size={15} />
              ) : (
                <AlertTriangle size={15} />
              )}{" "}
              {checked
                ? answer === 1
                  ? "Correct! Well done."
                  : "Try again."
                : "Check your answer."}
              <button type="button" onClick={() => setChecked(true)}>
                Check
              </button>
            </aside>
          </article>
        </section>
      </main>
      <footer>
        <button type="button" onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Chi-Square Distribution &nbsp; Next: Exponential
          Distribution
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={531} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
