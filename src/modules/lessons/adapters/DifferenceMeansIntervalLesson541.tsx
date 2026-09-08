import { Check, RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  differenceMeansInterval,
  differenceMeansSampleA,
  differenceMeansSampleB,
  generateDifferenceSamples,
  type DifferenceMeansMethod,
} from "./differenceMeansLessonModel";
import "./DifferenceMeansIntervalLesson541.css";
const parseValues = (text: string) =>
  text
    .split(/[\s,]+/)
    .map(Number)
    .filter(Number.isFinite);
const formatValues = (values: number[]) =>
  values.map((v) => v.toFixed(2)).join(", ");
export default function DifferenceMeansIntervalLesson541({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return (
    <DifferenceMeansActivity key={resetToken} onInteraction={onInteraction} />
  );
}
function DifferenceMeansActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [a, setA] = useState(differenceMeansSampleA),
    [b, setB] = useState(differenceMeansSampleB),
    [labelA, setLabelA] = useState("Drug A"),
    [labelB, setLabelB] = useState("Drug B"),
    [relationship, setRelationship] = useState<"independent" | "paired">(
      "independent",
    ),
    [equal, setEqual] = useState(true),
    [confidence, setConfidence] = useState(0.95),
    [seed, setSeed] = useState(541),
    [answer, setAnswer] = useState(1);
  const method: DifferenceMeansMethod =
      relationship === "paired" ? "paired" : equal ? "pooled" : "welch",
    result = differenceMeansInterval(a, b, confidence, method);
  const reset = () => {
    setA(differenceMeansSampleA);
    setB(differenceMeansSampleB);
    setLabelA("Drug A");
    setLabelB("Drug B");
    setRelationship("independent");
    setEqual(true);
    setConfidence(0.95);
    setSeed(541);
    setAnswer(1);
    onInteraction();
  };
  const newData = () => {
    const next = seed + 1,
      data = generateDifferenceSamples(next);
    setSeed(next);
    setA(data.a);
    setB(data.b);
    onInteraction();
  };
  const sx = (value: number) => 5 + ((value + 1) / 10) * 90;
  const drag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      desired = -1 + ((event.clientX - rect.left) / rect.width) * 10,
      delta = desired - result.difference;
    setA((values) => values.map((value) => value + delta));
    onInteraction();
  };
  const bins = (values: number[], min: number, max: number) =>
    Array.from(
      { length: 10 },
      (_, i) =>
        values.filter(
          (v) =>
            v >= min + (i * (max - min)) / 10 &&
            v < min + ((i + 1) * (max - min)) / 10,
        ).length,
    );
  const binsA = bins(a, 6, 20),
    binsB = bins(b, 6, 20),
    maxBin = Math.max(1, ...binsA, ...binsB);
  return (
    <div className="dm541" data-testid="inference-mockup-0504">
      <header>
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Difference of Means Interval</h2>
        <p>
          Construct and interpret a confidence interval for the difference
          between two population means.
        </p>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </button>
      </header>
      <nav>
        <b>Interaction + Visualisation</b>
        <span>Explain the concept</span>
        <span>Examples</span>
        <span>Formulas</span>
        <span>Know more</span>
      </nav>
      <section className="dm541-intro">
        <article>
          <h3>Objective</h3>
          <p>
            Build a confidence interval for mu1-mu2 using the appropriate
            two-sample method.
          </p>
        </article>
        <article>
          <h3>Key Insight</h3>
          <p>
            If zero is not in the interval, there is evidence of a difference.
          </p>
        </article>
        <article>
          <h3>Common Misconception</h3>
          <p>
            Do not use an independent interval for paired data or automatically
            pool unequal variances.
          </p>
        </article>
      </section>
      <main>
        <header>
          <h3>Interactive Lab: Build the interval</h3>
          <strong>Live</strong>
          <button onClick={newData}>New data</button>
        </header>
        <section className="dm541-controls">
          <label>
            Group relationship
            <button
              className={relationship === "independent" ? "active" : ""}
              onClick={() => setRelationship("independent")}
            >
              Independent
            </button>
            <button
              className={relationship === "paired" ? "active" : ""}
              onClick={() => setRelationship("paired")}
            >
              Paired
            </button>
          </label>
          {relationship === "independent" && (
            <label>
              Equal variances?
              <button
                className={equal ? "active" : ""}
                onClick={() => setEqual(true)}
              >
                Assume equal
              </button>
              <button
                className={!equal ? "active" : ""}
                onClick={() => setEqual(false)}
              >
                Do not assume
              </button>
            </label>
          )}
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
        </section>
        <section className="dm541-data">
          <article>
            <h3>Population 1 (Group 1)</h3>
            <input value={labelA} onChange={(e) => setLabelA(e.target.value)} />
            <textarea
              value={formatValues(a)}
              onChange={(e) => {
                const values = parseValues(e.target.value);
                if (values.length) setA(values);
                onInteraction();
              }}
            />
            <p>
              Mean <b>{result.first.mean.toFixed(2)}</b> SD{" "}
              <b>{result.first.sd.toFixed(4)}</b> Variance{" "}
              <b>{result.first.variance.toFixed(4)}</b>
            </p>
          </article>
          <article>
            <h3>Population 2 (Group 2)</h3>
            <input value={labelB} onChange={(e) => setLabelB(e.target.value)} />
            <textarea
              value={formatValues(b)}
              onChange={(e) => {
                const values = parseValues(e.target.value);
                if (values.length) setB(values);
                onInteraction();
              }}
            />
            <p>
              Mean <b>{result.second.mean.toFixed(2)}</b> SD{" "}
              <b>{result.second.sd.toFixed(4)}</b> Variance{" "}
              <b>{result.second.variance.toFixed(4)}</b>
            </p>
          </article>
          <aside>
            <h3>Summary</h3>
            <b>
              {labelA} - {labelB}
            </b>
            <strong>{result.difference.toFixed(2)}</strong>
            <p>SE {result.se.toFixed(4)}</p>
            <p>df {result.df.toFixed(method === "welch" ? 2 : 0)}</p>
            <p>Method {method}</p>
          </aside>
        </section>
        <section className="dm541-visual">
          <article>
            <h3>Data distributions</h3>
            <div>
              <span>
                {binsA.map((count, i) => (
                  <i key={i} style={{ height: `${(count / maxBin) * 100}%` }} />
                ))}
              </span>
              <span>
                {binsB.map((count, i) => (
                  <i key={i} style={{ height: `${(count / maxBin) * 100}%` }} />
                ))}
              </span>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>Group</th>
                  <th>n</th>
                  <th>Mean</th>
                  <th>SD</th>
                  <th>SE</th>
                </tr>
                <tr>
                  <td>{labelA}</td>
                  <td>{result.first.n}</td>
                  <td>{result.first.mean.toFixed(2)}</td>
                  <td>{result.first.sd.toFixed(4)}</td>
                  <td>{result.first.se.toFixed(4)}</td>
                </tr>
                <tr>
                  <td>{labelB}</td>
                  <td>{result.second.n}</td>
                  <td>{result.second.mean.toFixed(2)}</td>
                  <td>{result.second.sd.toFixed(4)}</td>
                  <td>{result.second.se.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article>
            <h3>{(confidence * 100).toFixed(0)}% CI for mu1 - mu2</h3>
            <strong>
              ({result.lower.toFixed(3)}, {result.upper.toFixed(3)})
            </strong>
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
              <line className="zero" x1={sx(0)} x2={sx(0)} y1="12" y2="52" />
              <line
                className="range"
                x1={sx(result.lower)}
                x2={sx(result.upper)}
                y1="25"
                y2="25"
              />
              <circle cx={sx(result.lower)} cy="25" r="2" />
              <circle cx={sx(result.upper)} cy="25" r="2" />
            </svg>
            <p>
              Drag the interval to shift Group 1 and explore the difference.
            </p>
            <aside>
              Conclusion:{" "}
              {result.lower > 0
                ? `${labelA} mean is higher than ${labelB}.`
                : result.upper < 0
                  ? `${labelA} mean is lower than ${labelB}.`
                  : "No clear mean difference."}
            </aside>
          </article>
        </section>
        <section className="dm541-math">
          <article>
            <h3>Formula &amp; calculation</h3>
            <p>Difference = {result.difference.toFixed(3)}</p>
            <p>SE = {result.se.toFixed(4)}</p>
            <p>Critical t = {result.critical.toFixed(4)}</p>
            <p>
              CI = {result.difference.toFixed(3)} +/- {result.margin.toFixed(4)}{" "}
              = ({result.lower.toFixed(3)}, {result.upper.toFixed(3)})
            </p>
            <p>
              t = {result.t.toFixed(2)}, p{" "}
              {result.pValue < 0.0001
                ? "< 0.0001"
                : `= ${result.pValue.toFixed(4)}`}
            </p>
          </article>
          <article>
            <h3>Practical significance</h3>
            <p>Cohen's d using pooled SD</p>
            <strong>d = {result.effect.toFixed(2)}</strong>
            <p>
              {Math.abs(result.effect) >= 1.2
                ? "Very large"
                : Math.abs(result.effect) >= 0.8
                  ? "Large"
                  : Math.abs(result.effect) >= 0.5
                    ? "Medium"
                    : "Small"}{" "}
              effect
            </p>
          </article>
        </section>
        <section className="dm541-bottom">
          <article>
            <h3>Assumptions &amp; cautions</h3>
            <p>
              <Check size={13} /> Independent random samples or correctly paired
              observations.
            </p>
            <p>
              <Check size={13} /> Approximately normal populations or adequate
              sample sizes.
            </p>
            <p>
              <Check size={13} /> Pool only when equal variances are reasonable.
            </p>
          </article>
          <article>
            <h3>Quick knowledge check</h3>
            <b>
              At the 5% level, what conclusion is supported by this interval?
            </b>
            {[
              "Not enough evidence of a difference.",
              `${labelA} has a higher mean than ${labelB}.`,
              `${labelA} has a lower mean than ${labelB}.`,
              "The difference is exactly zero.",
            ].map((option, i) => (
              <label key={option} className={answer === i ? "selected" : ""}>
                <input
                  type="radio"
                  checked={answer === i}
                  onChange={() => {
                    setAnswer(i);
                    onInteraction();
                  }}
                />
                {option}
              </label>
            ))}
            <strong
              className={
                answer === 1 && result.lower > 0 ? "correct" : "incorrect"
              }
            >
              <Check size={13} />
              {answer === 1 && result.lower > 0 ? "Correct" : "Try again"}
            </strong>
          </article>
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw size={14} />
          Reset lesson
        </button>
        <span>
          Previous: Confidence Interval for Proportion &nbsp; Next: Difference
          of Proportions Interval
        </span>
      </footer>
    </div>
  );
}
