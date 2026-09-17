import { Check, Download, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import {
  simulateWeibull,
  weibullAnalysis,
  weibullDensity,
  weibullHazard,
  weibullSurvival,
} from "./weibullLessonModel";
import "./WeibullDistributionLesson534.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

export default function WeibullDistributionLesson534({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <WeibullActivity key={resetToken} onInteraction={onInteraction} />;
}

function WeibullActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [shape, setShape] = useState(1.5),
    [scale, setScale] = useState(100),
    [size, setSize] = useState(1000),
    [seed, setSeed] = useState(20240517);
  const [answers, setAnswers] = useState([2, 1]);
  const theory = weibullAnalysis(shape, scale);
  const sample = useMemo(
    () => simulateWeibull(shape, scale, size, seed),
    [scale, seed, shape, size],
  );
  const reset = () => {
    setShape(1.5);
    setScale(100);
    setSize(1000);
    setSeed(20240517);
    setAnswers([2, 1]);
    onInteraction();
  };
  const exportSample = () => {
    const url = URL.createObjectURL(
      new Blob(["lifetime\n" + sample.values.join("\n")], { type: "text/csv" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "weibull-lifetimes.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const domain = Math.max(200, scale * 2.5),
    points = Array.from({ length: 121 }, (_, i) => (domain * i) / 120),
    densityMax = Math.max(
      ...points
        .slice(1)
        .map((t) => weibullDensity(t, shape, scale))
        .filter(Number.isFinite),
      0.001,
    ),
    hazardMax = Math.max(
      ...points
        .slice(1)
        .map((t) => weibullHazard(t, shape, scale))
        .filter(Number.isFinite),
      0.001,
    );
  const path = (value: (t: number) => number, max: number) =>
    points
      .map(
        (t) =>
          `${5 + (t / domain) * 90},${88 - Math.min(1, value(t) / max) * 70}`,
      )
      .join(" ");
  const bins = Array.from(
      { length: 18 },
      (_, i) =>
        sample.values.filter(
          (v) => v >= (i * domain) / 18 && v < ((i + 1) * domain) / 18,
        ).length,
    ),
    maxBin = Math.max(1, ...bins);
  const survivalAt = (time: number) => weibullSurvival(time, shape, scale);
  const hazardPattern =
    shape < 1 ? "Decreasing" : shape === 1 ? "Constant" : "Increasing";
  return (
    <div className="wb534" data-testid="probability-mockup-0497">
      <header>
        <span>DATA AND PROBABILITY &nbsp; PROBABILITY AND DISTRIBUTIONS</span>
        <h2>Weibull Distribution</h2>
        <p>Model reliability and lifetimes.</p>
        <aside>
          <h3>Objective</h3>
          <p>
            Use the two-parameter Weibull distribution to model component
            lifetimes, reliability, and hazard behavior.
          </p>
          <h3>Key insight</h3>
          <p>Shape controls the hazard pattern; scale sets the time scale.</p>
        </aside>
      </header>
      <nav>
        <b>Lab</b>
        <span>Theory</span>
        <span>Examples</span>
        <span>Simulations</span>
        <span>Practice</span>
      </nav>
      <main>
        <header>
          <div>
            <h3>Interactive Lab</h3>
            <h4>Explore Weibull Behavior</h4>
            <p>
              Adjust shape and scale to see how distribution, reliability, and
              hazard change.
            </p>
          </div>
          <strong>Simulation active</strong>
          <button onClick={exportSample}>
            <Download size={14} />
            Export
          </button>
        </header>
        <section className="wb534-work">
          <aside>
            <h3>Distribution controls</h3>
            <label>
              Shape k
              <input
                type="range"
                min=".2"
                max="5"
                step=".05"
                value={shape}
                onChange={(e) => {
                  setShape(+e.target.value);
                  onInteraction();
                }}
              />
              <output>{shape.toFixed(2)}</output>
            </label>
            <label>
              Scale lambda
              <input
                type="range"
                min="10"
                max="200"
                step="1"
                value={scale}
                onChange={(e) => {
                  setScale(+e.target.value);
                  onInteraction();
                }}
              />
              <output>{scale.toFixed(1)}</output>
            </label>
            <h3>Simulation settings</h3>
            <label>
              Sample size
              <input
                type="number"
                min="50"
                max="10000"
                step="50"
                value={size}
                onChange={(e) => {
                  setSize(Math.max(50, +e.target.value));
                  onInteraction();
                }}
              />
            </label>
            <label>
              Random seed
              <input
                type="number"
                value={seed}
                onChange={(e) => {
                  setSeed(+e.target.value);
                  onInteraction();
                }}
              />
            </label>
            <button
              onClick={() => {
                setSeed((v) => v + 1);
                onInteraction();
              }}
            >
              <RotateCcw size={14} />
              Run simulation
            </button>
          </aside>
          <article>
            <h3>Weibull distribution (2-parameter)</h3>
            <p>PDF f(t)=(k/lambda)(t/lambda)^(k-1)e^(-(t/lambda)^k)</p>
            <p>CDF F(t)=1-e^(-(t/lambda)^k)</p>
            <p>Survival R(t)=e^(-(t/lambda)^k)</p>
            <p>Hazard h(t)=f(t)/R(t)</p>
            <section>
              <b>Current parameters</b>
              <strong>
                k = {shape.toFixed(2)} &nbsp; lambda = {scale.toFixed(1)}
              </strong>
              <p>Mean {theory.mean.toFixed(3)}</p>
              <p>Median {theory.median.toFixed(3)}</p>
              <p>Variance {theory.variance.toFixed(2)}</p>
            </section>
          </article>
        </section>
        <section className="wb534-graphs">
          <Graph
            title="Density f(t)"
            line={path((t) => weibullDensity(t, shape, scale), densityMax)}
            label={`Mode = ${theory.mode.toFixed(1)}`}
          />
          <Graph
            title="Survival (Reliability) R(t)"
            line={path((t) => survivalAt(t), 1)}
            label={`R(100) = ${survivalAt(100).toFixed(3)}`}
          />
          <Graph
            title="Hazard rate h(t)"
            line={path((t) => weibullHazard(t, shape, scale), hazardMax)}
            label={`h(100) = ${weibullHazard(100, shape, scale).toFixed(4)}`}
          />
        </section>
        <p className="wb534-interpret">
          <b>Interpretation for k={shape.toFixed(2)}:</b> {hazardPattern}{" "}
          failure rate{" "}
          {shape > 1
            ? "(wear-out)"
            : shape < 1
              ? "(early-life)"
              : "(random failures)"}
          .
        </p>
        <section className="wb534-sim">
          <h3>Component lifetime simulation</h3>
          <div>
            <article>
              <h3>Histogram of lifetimes</h3>
              <div className="wb534-hist">
                {bins.map((count, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${Math.max(2, (count / maxBin) * 100)}%`,
                    }}
                  />
                ))}
              </div>
            </article>
            <article>
              <h3>Summary statistics (simulated)</h3>
              <p>
                Mean <b>{sample.mean.toFixed(2)}</b>
              </p>
              <p>
                Median <b>{sample.median.toFixed(2)}</b>
              </p>
              <p>
                Std. dev. <b>{sample.std.toFixed(2)}</b>
              </p>
              <p>
                5th percentile <b>{sample.percentile5.toFixed(2)}</b>
              </p>
              <p>
                95th percentile <b>{sample.percentile95.toFixed(2)}</b>
              </p>
            </article>
            <article>
              <h3>Sample lifetimes</h3>
              <p>
                {sample.values
                  .slice(0, 15)
                  .map((v) => v.toFixed(1))
                  .join("  ")}
              </p>
              <h3>Percent surviving</h3>
              {[50, 100, 150].map((t) => (
                <p key={t}>
                  P(T&gt;{t}) <b>{survivalAt(t).toFixed(3)}</b>
                </p>
              ))}
            </article>
          </div>
        </section>
        <section className="wb534-notes">
          <article>
            <h3>How shape affects hazard</h3>
            <p>k&lt;1 decreasing; k=1 constant; k&gt;1 increasing.</p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <p>
              Larger scale does not mean larger failure rate; it stretches the
              distribution.
            </p>
          </article>
          <article>
            <h3>Assumptions &amp; cautions</h3>
            <p>
              Independent lifetimes, comparable conditions, and a validated
              two-parameter fit.
            </p>
          </article>
        </section>
        <section className="wb534-quiz">
          <h3>Quick check</h3>
          {[
            {
              q: "For k=1.50, is the hazard rate increasing, constant, or decreasing?",
              o: ["Decreasing", "Constant", "Increasing"],
              c: 2,
            },
            {
              q: "If k=1, what distribution do you get?",
              o: ["Normal", "Exponential", "Lognormal"],
              c: 1,
            },
          ].map((question, i) => (
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
        <span>Previous: Gamma Distribution &nbsp; Next: Standardisation</span>
      </footer>
      <LessonTopicStudyBoard lessonId={534} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
function Graph({
  title,
  line,
  label,
}: {
  title: string;
  line: string;
  label: string;
}) {
  return (
    <article>
      <h3>{title}</h3>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="4" y1="88" x2="98" y2="88" />
        <polyline points={line} />
      </svg>
      <b>{label}</b>
    </article>
  );
}
