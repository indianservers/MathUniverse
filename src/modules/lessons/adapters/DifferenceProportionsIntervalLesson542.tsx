import { Check, RotateCcw, Shuffle, Zap } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  differenceProportionsInterval,
  generateProportionSamples,
} from "./differenceProportionsLessonModel";
import "./DifferenceProportionsIntervalLesson542.css";

const clampCount = (value: number, total: number) =>
  Math.max(0, Math.min(total, Math.round(value || 0)));
const confidenceLabel = (value: number) => `${Math.round(value * 100)}%`;

export default function DifferenceProportionsIntervalLesson542({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <DifferenceProportionsActivity
      key={resetToken}
      onInteraction={onInteraction}
    />
  );
}

function DifferenceProportionsActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [x1, setX1] = useState(58);
  const [n1, setN1] = useState(200);
  const [x2, setX2] = useState(40);
  const [n2, setN2] = useState(200);
  const [confidence, setConfidence] = useState(0.95);
  const [seed, setSeed] = useState(542);
  const [answer, setAnswer] = useState(1);
  const result = differenceProportionsInterval(x1, n1, x2, n2, confidence);
  const quiz = differenceProportionsInterval(72, 250, 55, 200, 0.95);

  const touch = () => onInteraction();
  const reset = () => {
    setX1(58);
    setN1(200);
    setX2(40);
    setN2(200);
    setConfidence(0.95);
    setSeed(542);
    setAnswer(1);
    touch();
  };
  const newSample = () => {
    const next = seed + 1;
    const sample = generateProportionSamples(next, n1, n2);
    setSeed(next);
    setX1(sample.x1);
    setX2(sample.x2);
    touch();
  };
  const setTotal = (
    value: number,
    currentX: number,
    setN: (value: number) => void,
    setX: (value: number) => void,
  ) => {
    const total = Math.max(10, Math.round(value || 10));
    setN(total);
    setX(clampCount(currentX, total));
    touch();
  };
  const lineX = (value: number) => 8 + ((value + 0.1) / 0.3) * 84;
  const distributionX = (value: number) => 8 + ((value + 0.08) / 0.26) * 84;
  const dragObserved = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const desired = -0.1 + ((event.clientX - rect.left) / rect.width) * 0.3;
    setX1(clampCount((desired + result.p2) * n1, n1));
    touch();
  };
  const curve = Array.from({ length: 65 }, (_, index) => {
    const value = -0.08 + (index / 64) * 0.26;
    const z = value / Math.max(result.se, 0.0001);
    return `${distributionX(value)},${74 - Math.exp((-z * z) / 2) * 56}`;
  }).join(" ");
  const intervalAboveZero = result.lower > 0;

  return (
    <div className="dp542" data-testid="inference-mockup-0505">
      <header className="dp542-hero">
        <div>
          <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
          <h2>Difference of Proportions Interval</h2>
          <p>
            Two-proportion confidence interval for p1 - p2 using the unpooled
            standard error.
          </p>
          <div className="dp542-tags">
            <b>Advanced</b>
            <b>Inference Lab</b>
            <b>Probability Calculator</b>
          </div>
          <button onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <aside>
          <h3>Objective</h3>
          <p>
            Construct and interpret a confidence interval for the difference
            between two population proportions.
          </p>
          <h3>You&apos;ll learn</h3>
          <p>
            <Check size={13} /> Compute with the unpooled SE
          </p>
          <p>
            <Check size={13} /> Build and interpret the interval
          </p>
          <p>
            <Check size={13} /> Visualize the sampling distribution
          </p>
        </aside>
      </header>
      <nav>
        <b>Interaction + visualisation</b>
        <span>Explain</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <main>
        <header>
          <div>
            <span>INTERACTION + LAB</span>
            <h3>Build the interval for p1 - p2</h3>
            <p>
              Enter two samples or use the example. Every view updates from the
              same calculation.
            </p>
          </div>
          <strong>Active</strong>
          <button onClick={newSample}>
            <Shuffle size={14} /> New sample
          </button>
        </header>
        <section className="dp542-lab">
          <aside className="dp542-inputs">
            <h3>Your samples</h3>
            <fieldset>
              <legend>Group 1</legend>
              <label>
                Successes (x1)
                <input
                  aria-label="Group 1 successes"
                  type="number"
                  value={x1}
                  min="0"
                  max={n1}
                  onChange={(e) => {
                    setX1(clampCount(+e.target.value, n1));
                    touch();
                  }}
                />
              </label>
              <label>
                Total (n1)
                <input
                  aria-label="Group 1 total"
                  type="number"
                  value={n1}
                  min="10"
                  onChange={(e) => setTotal(+e.target.value, x1, setN1, setX1)}
                />
              </label>
            </fieldset>
            <fieldset>
              <legend>Group 2</legend>
              <label>
                Successes (x2)
                <input
                  aria-label="Group 2 successes"
                  type="number"
                  value={x2}
                  min="0"
                  max={n2}
                  onChange={(e) => {
                    setX2(clampCount(+e.target.value, n2));
                    touch();
                  }}
                />
              </label>
              <label>
                Total (n2)
                <input
                  aria-label="Group 2 total"
                  type="number"
                  value={n2}
                  min="10"
                  onChange={(e) => setTotal(+e.target.value, x2, setN2, setX2)}
                />
              </label>
            </fieldset>
            <button className="dp542-load" onClick={reset}>
              <Zap size={14} /> Load example
            </button>
          </aside>
          <div className="dp542-center">
            <section className="dp542-results">
              <h3>Sample results</h3>
              <div>
                <span>p1</span>
                <b>{result.p1.toFixed(3)}</b>
              </div>
              <div>
                <span>p2</span>
                <b>{result.p2.toFixed(3)}</b>
              </div>
              <div>
                <span>p1 - p2</span>
                <b>{result.difference.toFixed(3)}</b>
              </div>
              <p>
                <b>Difference</b>
                <br />
                {(result.difference * 100).toFixed(1)} percentage points
              </p>
            </section>
            <section className="dp542-distribution">
              <h3>Sampling distribution of p1 - p2 (approx.)</h3>
              <div className="dp542-legend">
                <span>Normal approximation</span>
                <span>{confidenceLabel(confidence)} CI</span>
                <span>Observed</span>
              </div>
              <svg
                viewBox="0 0 100 92"
                preserveAspectRatio="none"
                role="img"
                aria-label="Normal approximation and observed difference"
              >
                <polygon
                  points={`${distributionX(result.lower)},74 ${distributionX(result.lower)},${74 - Math.exp(-Math.pow(result.lower / Math.max(result.se, 0.0001), 2) / 2) * 56} ${curve} ${distributionX(result.upper)},74`}
                />
                <polyline points={curve} />
                <line
                  className="dp542-zero"
                  x1={distributionX(0)}
                  x2={distributionX(0)}
                  y1="18"
                  y2="76"
                />
                <line
                  className="dp542-observed"
                  x1={distributionX(result.difference)}
                  x2={distributionX(result.difference)}
                  y1="33"
                  y2="76"
                />
                <circle cx={distributionX(result.difference)} cy="74" r="1.8" />
                <text
                  x={distributionX(result.difference)}
                  y="29"
                  textAnchor="middle"
                >
                  Observed {result.difference.toFixed(3)}
                </text>
                <line x1="6" x2="96" y1="75" y2="75" />
              </svg>
              <strong>
                {confidenceLabel(confidence)} CI: ({result.lower.toFixed(3)},{" "}
                {result.upper.toFixed(3)})
              </strong>
            </section>
          </div>
          <aside className="dp542-summary">
            <label>
              Confidence level (1 - alpha)
              <input
                type="range"
                min="80"
                max="99"
                value={confidence * 100}
                onChange={(e) => {
                  setConfidence(+e.target.value / 100);
                  touch();
                }}
              />
              <b>{confidenceLabel(confidence)}</b>
            </label>
            <section>
              <h3>Interval for p1 - p2</h3>
              <strong>
                ({result.lower.toFixed(3)}, {result.upper.toFixed(3)})
              </strong>
              <p>
                We are {confidenceLabel(confidence)} confident that p1 - p2 is
                between {result.lower.toFixed(3)} and {result.upper.toFixed(3)}.
              </p>
            </section>
            <section>
              <h3>Interpretation</h3>
              <p>
                {intervalAboveZero
                  ? "The interval is entirely above 0, evidence that Group 1's population proportion is higher."
                  : result.upper < 0
                    ? "The interval is entirely below 0, evidence that Group 1's population proportion is lower."
                    : "The interval contains 0, so the data do not establish a population difference."}
              </p>
            </section>
          </aside>
        </section>
        <section className="dp542-views">
          <article>
            <h3>Sample proportions</h3>
            <label>
              Group 1: p1{" "}
              <i>
                <span style={{ width: `${result.p1 * 100}%` }} />
              </i>
              <b>{result.p1.toFixed(3)}</b>
            </label>
            <label>
              Group 2: p2{" "}
              <i>
                <span style={{ width: `${result.p2 * 100}%` }} />
              </i>
              <b>{result.p2.toFixed(3)}</b>
            </label>
            <small>
              0 &nbsp;&nbsp;&nbsp;&nbsp; 0.25 &nbsp;&nbsp;&nbsp;&nbsp; 0.50
              &nbsp;&nbsp;&nbsp;&nbsp; 0.75 &nbsp;&nbsp;&nbsp;&nbsp; 1.00
            </small>
          </article>
          <article>
            <h3>Difference visualized</h3>
            <svg
              viewBox="0 0 100 44"
              preserveAspectRatio="none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragObserved(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  dragObserved(e);
              }}
            >
              <line x1="5" x2="96" y1="22" y2="22" />
              <line
                className="dp542-ci"
                x1={lineX(result.lower)}
                x2={lineX(result.upper)}
                y1="22"
                y2="22"
              />
              <line
                className="dp542-null"
                x1={lineX(0)}
                x2={lineX(0)}
                y1="11"
                y2="33"
              />
              <circle cx={lineX(result.difference)} cy="22" r="2.2" />
              <text x={lineX(result.lower)} y="9" textAnchor="middle">
                {result.lower.toFixed(3)}
              </text>
              <text x={lineX(result.upper)} y="9" textAnchor="middle">
                {result.upper.toFixed(3)}
              </text>
            </svg>
            <p>Drag the observed point to update Group 1.</p>
          </article>
        </section>
        <section className="dp542-math">
          <h3>How it&apos;s calculated (unpooled standard error)</h3>
          <div>
            <article>
              <b>Numbers</b>
              <p>
                x1 = {result.x1}, n1 = {result.n1}
              </p>
              <p>
                x2 = {result.x2}, n2 = {result.n2}
              </p>
              <p>p1 - p2 = {result.difference.toFixed(3)}</p>
            </article>
            <article>
              <b>Unpooled standard error</b>
              <p>SE = sqrt[p1(1-p1)/n1 + p2(1-p2)/n2]</p>
              <strong>= {result.se.toFixed(5)}</strong>
            </article>
            <article>
              <b>Margin of error and interval</b>
              <p>
                ME = {result.critical.toFixed(3)} x {result.se.toFixed(5)} ={" "}
                {result.margin.toFixed(4)}
              </p>
              <p>
                CI = {result.difference.toFixed(3)} +/-{" "}
                {result.margin.toFixed(4)}
              </p>
              <strong>
                = ({result.lower.toFixed(4)}, {result.upper.toFixed(4)})
              </strong>
            </article>
          </div>
        </section>
        <section className="dp542-notes">
          <article>
            <h3>Key insight</h3>
            <p>
              Independent samples use an unpooled standard error because their
              proportions can differ.
            </p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <p>
              Pooling belongs to a two-proportion test under an
              equal-proportions null, not this interval.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; caution</h3>
            <p>
              Independent random samples and at least 10 successes and failures
              per group.
            </p>
            <b>
              {result.conditions.met
                ? "Conditions met"
                : "Large-count condition not met"}
            </b>
          </article>
          <article>
            <h3>Notation guide</h3>
            <p>p1, p2 population proportions</p>
            <p>p-hat sample proportions</p>
            <p>SE unpooled standard error</p>
          </article>
        </section>
        <section className="dp542-quiz">
          <h3>Quick check</h3>
          <p>
            Given x1 = 72, n1 = 250 and x2 = 55, n2 = 200, what is the
            approximate 95% CI for p1 - p2?
          </p>
          <div>
            {[
              "(-0.067, 0.093)",
              "(0.013, 0.173)",
              "(-0.113, 0.173)",
              "(-0.013, 0.273)",
            ].map((choice, index) => (
              <button
                key={choice}
                className={
                  answer === index
                    ? index === 0
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
          <aside className={answer === 0 ? "correct" : "incorrect"}>
            {answer === 0 ? "Correct." : "Recheck the unpooled standard error."}{" "}
            The calculated interval is ({quiz.lower.toFixed(3)},{" "}
            {quiz.upper.toFixed(3)}).
          </aside>
        </section>
      </main>
      <footer>
        <span>Previous &nbsp; Difference of Means Interval</span>
        <span>Next &nbsp; One-Sample z-Test</span>
      </footer>
    </div>
  );
}
