import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  proportionInterval,
  simulateProportionCoverage,
  type ProportionIntervalMethod,
} from "./confidenceProportionLessonModel";
import "./ConfidenceIntervalProportionLesson540.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function ConfidenceIntervalProportionLesson540({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <ProportionIntervalActivity
      key={resetToken}
      onInteraction={onInteraction}
    />
  );
}
function ProportionIntervalActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [successes, setSuccesses] = useState(180),
    [n, setN] = useState(250),
    [confidence, setConfidence] = useState(0.95),
    [method, setMethod] = useState<ProportionIntervalMethod>("wilson"),
    [trueP, setTrueP] = useState(0.72),
    [repetitions, setRepetitions] = useState(1000),
    [seed, setSeed] = useState(540),
    [answers, setAnswers] = useState([0, 0, 0, 0]);
  const current = proportionInterval(successes, n, confidence, method),
    wilson = proportionInterval(successes, n, confidence, "wilson"),
    wald = proportionInterval(successes, n, confidence, "wald"),
    coverage = useMemo(
      () =>
        simulateProportionCoverage(
          trueP,
          n,
          confidence,
          repetitions,
          method,
          seed,
        ),
      [confidence, method, n, repetitions, seed, trueP],
    );
  const sx = (value: number) => 5 + ((value - 0.5) / 0.4) * 90;
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      value =
        0.5 +
        Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) *
          0.4;
    setSuccesses(Math.round(value * n));
    onInteraction();
  };
  const reset = () => {
    setSuccesses(180);
    setN(250);
    setConfidence(0.95);
    setMethod("wilson");
    setTrueP(0.72);
    setRepetitions(1000);
    setSeed(540);
    setAnswers([0, 0, 0, 0]);
    onInteraction();
  };
  const questions = [
    {
      q: "What is the sample proportion p-hat?",
      o: [current.pHat.toFixed(4), "0.6800", "0.7500"],
      c: 0,
    },
    {
      q: `What is the ${method} margin of error?`,
      o: [current.margin.toFixed(4), "0.0280", "0.1100"],
      c: 0,
    },
    {
      q: "Which method is generally more accurate?",
      o: ["Wilson (score)", "Wald (normal)", "Both always equal"],
      c: 0,
    },
    {
      q: "Is the true population proportion random or fixed?",
      o: ["Fixed (unknown)", "Random", "Equal to every sample"],
      c: 0,
    },
  ];
  return (
    <div className="cp540" data-testid="inference-mockup-0503">
      <header>
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Confidence Interval for Proportion</h2>
        <p>Estimate a population proportion.</p>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </button>
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
          <h3>Interactive Lab</h3>
          <h4>Construct a confidence interval for a population proportion</h4>
          <strong>Live - values synced</strong>
        </header>
        <section className="cp540-controls">
          <label>
            Successes x
            <input
              type="number"
              min="0"
              max={n}
              value={successes}
              onChange={(e) => {
                setSuccesses(Math.max(0, Math.min(n, +e.target.value)));
                onInteraction();
              }}
            />
          </label>
          <label>
            Sample size n
            <input
              type="number"
              min="1"
              value={n}
              onChange={(e) => {
                const next = Math.max(1, +e.target.value);
                setN(next);
                setSuccesses((v) => Math.min(v, next));
                onInteraction();
              }}
            />
          </label>
          <article>
            Sample proportion p-hat<b>{current.pHat.toFixed(4)}</b>
            <span>{(current.pHat * 100).toFixed(2)}%</span>
          </article>
          <label>
            Confidence level
            <select
              value={confidence}
              onChange={(e) => {
                setConfidence(+e.target.value);
                onInteraction();
              }}
            >
              <option value=".9">90%</option>
              <option value=".95">95%</option>
              <option value=".99">99%</option>
            </select>
          </label>
          <fieldset>
            <legend>Method</legend>
            <button
              className={method === "wilson" ? "active" : ""}
              onClick={() => setMethod("wilson")}
            >
              Wilson (score)
            </button>
            <button
              className={method === "wald" ? "active" : ""}
              onClick={() => setMethod("wald")}
            >
              Wald (normal)
            </button>
          </fieldset>
        </section>
        <section className="cp540-interval">
          <article>
            <h3>
              {(confidence * 100).toFixed(0)}% Confidence Interval ({method})
            </h3>
            <svg
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) drag(e);
              }}
            >
              <line x1="3" y1="36" x2="98" y2="36" />
              <line
                className="range"
                x1={sx(current.lower)}
                x2={sx(current.upper)}
                y1="27"
                y2="27"
              />
              <circle cx={sx(current.lower)} cy="27" r="2" />
              <circle
                className="estimate"
                cx={sx(current.pHat)}
                cy="27"
                r="2"
              />
              <circle cx={sx(current.upper)} cy="27" r="2" />
            </svg>
            <p>
              Drag the interval line to update the observed sample proportion.
            </p>
          </article>
          <aside>
            <p>Interval ({method})</p>
            <b>
              [{current.lower.toFixed(3)}, {current.upper.toFixed(3)}]
            </b>
            <p>Margin of error</p>
            <b>{current.margin.toFixed(4)}</b>
            <p>Interval width</p>
            <b>{(current.upper - current.lower).toFixed(4)}</b>
          </aside>
        </section>
        <section className="cp540-decomp">
          <h3>Margin of error decomposition ({method})</h3>
          <div>
            <article>
              Critical value<b>{current.critical.toFixed(3)}</b>
            </article>
            <strong>x</strong>
            <article>
              Standard error<b>{current.se.toFixed(5)}</b>
            </article>
            <strong>=</strong>
            <article>
              Margin of error<b>{current.margin.toFixed(4)}</b>
            </article>
            <article>
              Check
              <b>
                {current.lower.toFixed(4)}, {current.upper.toFixed(4)}
              </b>
            </article>
          </div>
        </section>
        <section className="cp540-coverage">
          <header>
            <div>
              <h3>Repeated coverage simulation</h3>
              <p>
                Samples of size n={n} from true proportion p={trueP.toFixed(2)}.
              </p>
            </div>
            <label>
              True p
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                value={trueP}
                onChange={(e) =>
                  setTrueP(Math.max(0, Math.min(1, +e.target.value)))
                }
              />
            </label>
            <label>
              Repetitions
              <select
                value={repetitions}
                onChange={(e) => setRepetitions(+e.target.value)}
              >
                <option>100</option>
                <option>500</option>
                <option>1000</option>
                <option>5000</option>
              </select>
            </label>
            <button
              onClick={() => {
                setSeed((v) => v + 1);
                onInteraction();
              }}
            >
              Run simulation again
            </button>
          </header>
          <div>
            <aside>
              <b>Coverage {(coverage.captureRate * 100).toFixed(1)}%</b>
              <p>
                {coverage.captured} of {coverage.repetitions}
              </p>
              <b>Average width {coverage.averageWidth.toFixed(4)}</b>
            </aside>
            <article>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <line
                  className="truth"
                  x1={sx(trueP)}
                  x2={sx(trueP)}
                  y1="3"
                  y2="96"
                />
                {coverage.intervals.slice(0, 35).map((item, i) => (
                  <g key={i}>
                    <line
                      className={item.captures ? "captured" : "missed"}
                      x1={sx(item.lower)}
                      x2={sx(item.upper)}
                      y1={5 + i * 2.6}
                      y2={5 + i * 2.6}
                    />
                    <circle cx={sx(item.pHat)} cy={5 + i * 2.6} r=".6" />
                  </g>
                ))}
              </svg>
            </article>
          </div>
        </section>
        <section className="cp540-compare">
          <h3>Method comparison (same data)</h3>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Interval</th>
                <th>Margin of error</th>
                <th>Width</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Wilson (score)</th>
                <td>
                  [{wilson.lower.toFixed(3)}, {wilson.upper.toFixed(3)}]
                </td>
                <td>{wilson.margin.toFixed(4)}</td>
                <td>{(wilson.upper - wilson.lower).toFixed(4)}</td>
                <td>More accurate across p and n.</td>
              </tr>
              <tr>
                <th>Wald (normal)</th>
                <td>
                  [{wald.lower.toFixed(3)}, {wald.upper.toFixed(3)}]
                </td>
                <td>{wald.margin.toFixed(4)}</td>
                <td>{(wald.upper - wald.lower).toFixed(4)}</td>
                <td>Less accurate near 0 or 1.</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="cp540-notes">
          <article>
            <h3>Key insight</h3>
            <p>
              A confidence interval gives plausible values for the true
              population proportion.
            </p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <p>
              The fixed true p is not random; the interval-building process has
              long-run coverage.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; cautions</h3>
            <p>Random sample and adequate expected success/failure counts.</p>
          </article>
          <article>
            <h3>Notation guide</h3>
            <p>x successes; n sample size; p-hat sample proportion.</p>
          </article>
        </section>
        <section className="cp540-example">
          <h3>Worked example</h3>
          <p>
            p-hat={successes}/{n}={current.pHat.toFixed(4)}; z*=
            {current.critical.toFixed(3)}; interval=[{current.lower.toFixed(4)},{" "}
            {current.upper.toFixed(4)}].
          </p>
        </section>
        <section className="cp540-quiz">
          <h3>Quick check</h3>
          {questions.map((question, i) => (
            <article key={question.q}>
              <b>
                {i + 1}. {question.q}
              </b>
              {question.o.map((option, j) => (
                <label
                  key={option}
                  className={answers[i] === j ? "selected" : ""}
                >
                  <input
                    type="radio"
                    checked={answers[i] === j}
                    onChange={() => {
                      const next = [...answers];
                      next[i] = j;
                      setAnswers(next);
                      onInteraction();
                    }}
                  />
                  {option}
                </label>
              ))}
              <strong
                className={answers[i] === question.c ? "correct" : "incorrect"}
              >
                <Check size={13} />
                {answers[i] === question.c ? "Correct" : "Try again"}
              </strong>
            </article>
          ))}
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Confidence Interval for Mean &nbsp; Next: Difference of
          Means Interval
        </span>
      </footer>
      <LessonTopicStudyBoard lessonId={540} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
