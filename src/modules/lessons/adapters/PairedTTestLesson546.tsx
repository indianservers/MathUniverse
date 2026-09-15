import { Check, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  pairedTDefaults,
  pairedTTest,
  type PairedObservation,
} from "./pairedTTestLessonModel";
import "./PairedTTestLesson546.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

export default function PairedTTestLesson546({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <PairedActivity key={resetToken} onInteraction={onInteraction} />;
}

function PairedActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [pairs, setPairs] = useState(pairedTDefaults),
    [editing, setEditing] = useState(false),
    [alpha, setAlpha] = useState(0.05),
    [answer, setAnswer] = useState(1);
  const result = pairedTTest(pairs, alpha),
    touch = () => onInteraction(),
    reset = () => {
      setPairs(pairedTDefaults);
      setEditing(false);
      setAlpha(0.05);
      setAnswer(1);
      touch();
    };
  const update = (
    index: number,
    key: keyof PairedObservation,
    value: number,
  ) => {
    setPairs((current) =>
      current.map((pair, i) =>
        i === index ? { ...pair, [key]: value } : pair,
      ),
    );
    touch();
  };
  const plotX = (value: number) => 8 + ((value - 40) / 60) * 84,
    plotY = (index: number) => 12 + index * 6;
  const dragPair = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      index = Math.max(
        0,
        Math.min(
          pairs.length - 1,
          Math.round(
            (((event.clientY - rect.top) / rect.height) * 70 - 12) / 6,
          ),
        ),
      ),
      value = 40 + ((event.clientX - rect.left) / rect.width) * 60;
    update(index, "after", Math.round(value));
  };
  const tx = (value: number) =>
      7 + ((Math.max(-4, Math.min(14, value)) + 4) / 18) * 88,
    density = (value: number) =>
      Math.pow(1 + (value * value) / result.df, -(result.df + 1) / 2),
    curve = Array.from({ length: 121 }, (_, i) => {
      const t = -4 + (i * 18) / 120;
      return `${tx(t)},${75 - density(t) * 55}`;
    }).join(" ");
  const dragT = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      t = -4 + ((event.clientX - rect.left) / rect.width) * 18,
      target = t * result.se,
      delta = target - result.mean;
    setPairs((current) =>
      current.map((pair) => ({ ...pair, after: pair.after + delta })),
    );
    touch();
  };
  const bins = Array.from(
      { length: 8 },
      (_, i) =>
        result.differences.filter((value) => Math.round(value) === i + 1)
          .length,
    ),
    maxBin = Math.max(1, ...bins),
    pText = result.pValue < 0.0001 ? "< 0.0001" : result.pValue.toFixed(5);
  return (
    <div className="pt546" data-testid="inference-mockup-0509">
      <header className="pt546-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Paired t-Test</h2>
        <p>Compare matched (paired) observations.</p>
        <div>
          <b>Advanced</b>
          <b>Inference Lab</b>
          <b>Probability Calculator / Statistics</b>
          <b>6-10 min</b>
        </div>
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
      <section className="pt546-objective">
        <article>
          <h3>Learning objective</h3>
          <p>
            Use the paired t test to determine whether the mean difference
            between related measurements is zero.
          </p>
        </article>
        <article>
          <h3>Worked dataset (n = {result.n} pairs)</h3>
          <p>
            Before vs After scores out of 100. Did the program improve scores?
          </p>
        </article>
        <b>
          <Check size={14} /> All calculations are consistent
        </b>
      </section>
      <main>
        <header>
          <h3>Paired t Test - Inference Lab</h3>
          <b>p-value (two-tailed) {pText}</b>
        </header>
        <section className="pt546-top">
          <article className="pt546-data">
            <h3>1. Paired Data</h3>
            <table>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Before</th>
                  <th>After</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {editing ? (
                        <input
                          aria-label={`Before ${index + 1}`}
                          type="number"
                          value={+pair.before.toFixed(2)}
                          onChange={(e) =>
                            update(index, "before", +e.target.value)
                          }
                        />
                      ) : (
                        pair.before.toFixed(0)
                      )}
                    </td>
                    <td>
                      {editing ? (
                        <input
                          aria-label={`After ${index + 1}`}
                          type="number"
                          value={+pair.after.toFixed(2)}
                          onChange={(e) =>
                            update(index, "after", +e.target.value)
                          }
                        />
                      ) : (
                        pair.after.toFixed(0)
                      )}
                    </td>
                    <td>{(pair.after - pair.before).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Mean</th>
                  <th>{result.meanBefore.toFixed(1)}</th>
                  <th>{result.meanAfter.toFixed(1)}</th>
                  <th>{result.mean.toFixed(1)}</th>
                </tr>
              </tfoot>
            </table>
            <div>
              <button onClick={() => setEditing((value) => !value)}>
                <Pencil size={12} /> {editing ? "Done editing" : "Edit data"}
              </button>
              <button
                onClick={() => {
                  setPairs((current) => [
                    ...current,
                    { before: result.meanBefore, after: result.meanAfter },
                  ]);
                  setEditing(true);
                  touch();
                }}
              >
                <Plus size={12} />
              </button>
              <button
                onClick={() => {
                  setPairs((current) => current.slice(0, -1));
                  touch();
                }}
                disabled={pairs.length <= 2}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </article>
          <article className="pt546-pairs">
            <h3>2. Paired Plot (Before → After)</h3>
            <svg
              viewBox="0 0 100 72"
              preserveAspectRatio="none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragPair(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) dragPair(e);
              }}
            >
              {pairs.map((pair, index) => (
                <g key={index}>
                  <line
                    x1={plotX(pair.before)}
                    x2={plotX(pair.after)}
                    y1={plotY(index)}
                    y2={plotY(index)}
                  />
                  <circle
                    className="before"
                    cx={plotX(pair.before)}
                    cy={plotY(index)}
                    r="1.5"
                  />
                  <circle
                    className="after"
                    cx={plotX(pair.after)}
                    cy={plotY(index)}
                    r="1.5"
                  />
                </g>
              ))}
            </svg>
            <p>Drag across a pair row to change its After score.</p>
            <footer>
              <span>Before</span>
              <span>After</span>
            </footer>
          </article>
          <article className="pt546-hist">
            <h3>3. Differences Histogram</h3>
            <div>
              {bins.map((count, index) => (
                <i key={index} style={{ height: `${(count / maxBin) * 85}%` }}>
                  <b>{count || ""}</b>
                  <span>{index + 1}</span>
                </i>
              ))}
            </div>
            <p>Difference (After - Before)</p>
          </article>
        </section>
        <section className="pt546-stats">
          <span>
            n <b>{result.n}</b>
          </span>
          <span>
            Mean diff <b>{result.mean.toFixed(2)}</b>
          </span>
          <span>
            SD of diff <b>{result.sd.toFixed(3)}</b>
          </span>
          <span>
            SE <b>{result.se.toFixed(3)}</b>
          </span>
          <span>
            df <b>{result.df}</b>
          </span>
          <label>
            alpha{" "}
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
        <section className="pt546-middle">
          <article>
            <h3>4. Test Statistic</h3>
            <p>H0: mean difference = 0</p>
            <strong>t = mean difference / (SD / sqrt(n))</strong>
            <strong>
              = {result.mean.toFixed(2)} / {result.se.toFixed(3)} ={" "}
              {result.statistic.toFixed(3)}
            </strong>
          </article>
          <article>
            <h3>5. Null Distribution of t</h3>
            <svg
              viewBox="0 0 100 86"
              preserveAspectRatio="none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragT(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) dragT(e);
              }}
            >
              <polyline points={curve} />
              <line x1="6" x2="96" y1="75" y2="75" />
              <line
                className="critical"
                x1={tx(result.critical)}
                x2={tx(result.critical)}
                y1="45"
                y2="75"
              />
              <line
                className="observed"
                x1={tx(result.statistic)}
                x2={tx(result.statistic)}
                y1="26"
                y2="75"
              />
              <text x={tx(result.statistic)} y="22" textAnchor="middle">
                tobs = {result.statistic.toFixed(2)}
              </text>
            </svg>
            <b>p-value (two-tailed) {pText}</b>
            <p>Drag the observed line to shift all After scores.</p>
          </article>
          <article>
            <h3>6. Confidence Interval for mean difference</h3>
            <p>{((1 - alpha) * 100).toFixed(0)}% CI</p>
            <strong>mean diff ± t* × SE</strong>
            <strong>
              = {result.mean.toFixed(2)} ± {result.critical.toFixed(3)} ×{" "}
              {result.se.toFixed(3)}
            </strong>
            <output>
              ({result.lower.toFixed(2)}, {result.upper.toFixed(2)})
            </output>
            <p>
              {result.lower > 0
                ? "The interval supports a positive mean improvement."
                : "The interval includes zero, so improvement is not established."}
            </p>
          </article>
        </section>
        <section className="pt546-notes">
          <article>
            <h3>7. What does this mean?</h3>
            <p>
              The mean score changed by {result.mean.toFixed(2)} points. The
              pairing keeps person-to-person variation out of the test.
            </p>
          </article>
          <article>
            <h3>8. Common Misconception</h3>
            <p>
              Do not run an independent two-sample test when the same subjects
              are measured twice.
            </p>
          </article>
          <article>
            <h3>9. Assumptions &amp; Cautions</h3>
            <p>
              Pairs are independent; differences are approximately normal;
              inspect difference outliers.
            </p>
          </article>
        </section>
        <section className="pt546-steps">
          <h3>10. Guided Calculation</h3>
          <div>
            <article>
              <b>1. Compute differences</b>
              <p>Di = Afteri - Beforei</p>
              <strong>Mean d = {result.mean.toFixed(2)}</strong>
            </article>
            <article>
              <b>2. Compute SE</b>
              <p>SE = sd / sqrt(n)</p>
              <strong>
                {result.sd.toFixed(3)} / sqrt({result.n}) ={" "}
                {result.se.toFixed(3)}
              </strong>
            </article>
            <article>
              <b>3. Compute t</b>
              <p>t = mean d / SE</p>
              <strong>{result.statistic.toFixed(3)}</strong>
            </article>
            <article>
              <b>4. Decision</b>
              <p>|t| {result.reject ? ">" : "≤"} critical</p>
              <strong>
                {result.reject ? "Reject H0" : "Fail to reject H0"}
              </strong>
            </article>
            <article>
              <b>5. Conclusion</b>
              <p>
                {result.reject
                  ? "There is evidence of a mean paired change."
                  : "A mean paired change is not established."}
              </p>
            </article>
          </div>
        </section>
      </main>
      <section className="pt546-quiz">
        <h3>11. Quick Check</h3>
        <p>Using alpha = {alpha.toFixed(2)}, what is the correct conclusion?</p>
        <div>
          {[
            "Fail to reject H0; no evidence of improvement.",
            "Reject H0; there is significant evidence of improvement.",
            "Not enough information to decide.",
            "Reject H0; the program decreased scores.",
          ].map((choice, index) => (
            <button
              key={choice}
              className={
                answer === index
                  ? index === (result.reject && result.mean > 0 ? 1 : 0)
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
        </div>
        <aside
          className={
            answer === (result.reject && result.mean > 0 ? 1 : 0)
              ? "correct"
              : "incorrect"
          }
        >
          <Check size={14} />
          <b>
            {answer === (result.reject && result.mean > 0 ? 1 : 0)
              ? "Correct."
              : "Compare the p-value and direction."}
          </b>{" "}
          p-value {pText}; mean difference {result.mean.toFixed(2)}.
        </aside>
      </section>
      <footer>
        <span>Previous &nbsp; 545 Two-Sample t Test</span>
        <span>Next &nbsp; 547 One-Proportion Test</span>
      </footer>
      <LessonTopicStudyBoard lessonId={546} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
