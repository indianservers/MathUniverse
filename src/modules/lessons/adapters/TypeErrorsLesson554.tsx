import { RotateCcw } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { typeErrorsAnalysis } from "./typeErrorsLessonModel";
import "./TypeErrorsLesson554.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

export default function TypeErrorsLesson554({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <Activity key={resetToken} onInteraction={onInteraction} />;
}
function Activity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [mu0, setMu0] = useState(50),
    [mu1, setMu1] = useState(54),
    [sigma, setSigma] = useState(10),
    [sampleSize, setSampleSize] = useState(36),
    [critical, setCritical] = useState(1.645),
    [answer, setAnswer] = useState(1),
    r = typeErrorsAnalysis(mu0, mu1, sigma, sampleSize, critical),
    touch = () => onInteraction(),
    reset = () => {
      setMu0(50);
      setMu1(54);
      setSigma(10);
      setSampleSize(36);
      setCritical(1.645);
      setAnswer(1);
      touch();
    };
  return (
    <div className="te554" data-testid="inference-mockup-0517">
      <header className="te554-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Type I and Type II Errors</h2>
        <p>
          Visualise false positives, false negatives, and the power of a
          hypothesis test.
        </p>
        <aside>
          <b>Learning objective</b>
          <p>
            Understand Type I and Type II errors, visualise overlapping
            distributions, and interpret consequences.
          </p>
        </aside>
      </header>
      <nav>
        <b>Explore &amp; Visualize</b>
        <span>Guided Calculation</span>
        <span>Key Insight</span>
        <span>Assumptions &amp; Cautions</span>
        <span>Quick Check</span>
      </nav>
      <main>
        <header>
          <div>
            <h3>1. Visualize Type I and Type II Errors</h3>
            <p>
              Adjust the critical cutoff and alternative mean to see how α, β,
              and power change.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset
          </button>
        </header>
        <section className="te554-explore">
          <aside>
            <h3>Hypothesis test</h3>
            <p>H0: μ = {mu0}</p>
            <p>H1: μ &gt; {mu0} (right-tailed)</p>
            <h3>Known parameters</h3>
            <label>
              Null mean μ0
              <input
                type="number"
                value={mu0}
                onChange={(e) => {
                  setMu0(+e.target.value);
                  touch();
                }}
              />
            </label>
            <label>
              Population σ
              <input
                type="number"
                min=".1"
                value={sigma}
                onChange={(e) => {
                  setSigma(+e.target.value);
                  touch();
                }}
              />
            </label>
            <label>
              Sample size n
              <input
                type="number"
                min="2"
                value={sampleSize}
                onChange={(e) => {
                  setSampleSize(+e.target.value);
                  touch();
                }}
              />
            </label>
            <p>
              SE = σ / √n = <b>{r.standardError.toFixed(3)}</b>
            </p>
            <p>Under H0: z ~ N(0, 1)</p>
            <p>Under H1: z ~ N({r.delta.toFixed(2)}, 1)</p>
          </aside>
          <article>
            <ErrorPlot
              result={r}
              onCritical={(value) => {
                setCritical(value);
                touch();
              }}
            />
            <label>
              Critical cutoff (c)
              <input
                type="range"
                min="-1"
                max="4"
                step=".005"
                value={critical}
                onChange={(e) => {
                  setCritical(+e.target.value);
                  touch();
                }}
              />
              <input
                type="number"
                step=".005"
                value={critical}
                onChange={(e) => {
                  setCritical(+e.target.value);
                  touch();
                }}
              />
            </label>
            <div className="te554-metrics">
              <Metric
                label="α (Type I error)"
                detail="P(z > c | H0 true)"
                value={r.alpha}
              />
              <Metric
                label="β (Type II error)"
                detail="P(z ≤ c | H1 true)"
                value={r.beta}
              />
              <Metric
                label="Power (1 − β)"
                detail="P(z > c | H1 true)"
                value={r.power}
              />
            </div>
          </article>
        </section>
        <p className="te554-callout">
          At c = {critical.toFixed(3)}, α = {r.alpha.toFixed(4)}. The
          probability of a Type II error is β = {r.beta.toFixed(4)}, so power is{" "}
          {r.power.toFixed(4)}.
        </p>
      </main>
      <section className="te554-middle">
        <article>
          <h3>2. Decisions and Outcomes</h3>
          <table>
            <thead>
              <tr>
                <th>Decision</th>
                <th>H0 true</th>
                <th>H1 true</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Reject H0</th>
                <td>
                  <b>Type I error (α)</b>
                  <br />
                  False positive
                  <br />
                  {r.alpha.toFixed(4)}
                </td>
                <td>
                  <strong>Correct decision</strong>
                  <br />
                  Power (1 − β)
                  <br />
                  {r.power.toFixed(4)}
                </td>
              </tr>
              <tr>
                <th>Fail to reject H0</th>
                <td>
                  <strong>Correct decision</strong>
                  <br />1 − α<br />
                  {r.correctNull.toFixed(4)}
                </td>
                <td>
                  <b>Type II error (β)</b>
                  <br />
                  False negative
                  <br />
                  {r.beta.toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h3>3. Consequences in Context</h3>
          <p>
            A factory claims the mean fill is {mu0} ml. We test if it is higher.
          </p>
          <hr />
          <b>If we reject H0 when H0 is true</b>
          <p>
            We may declare overfilling when the process is actually on target,
            causing unnecessary adjustments.
          </p>
          <hr />
          <b>If we fail to reject H0 when H1 is true</b>
          <p>
            We may miss a genuinely high fill level, causing waste or regulatory
            issues.
          </p>
        </article>
      </section>
      <section className="te554-detail">
        <article>
          <h3>4. Guided Calculation</h3>
          <p>
            1 &nbsp; α = P(Z &gt; {critical.toFixed(3)}) ={" "}
            <b>{r.alpha.toFixed(4)}</b>
          </p>
          <p>
            2 &nbsp; δ = ({mu1} − {mu0}) / {r.standardError.toFixed(3)} ={" "}
            <b>{r.delta.toFixed(2)}</b>
          </p>
          <p>
            3 &nbsp; β = P(Z ≤ {critical.toFixed(3)} − {r.delta.toFixed(2)}) ={" "}
            <b>{r.beta.toFixed(4)}</b>
          </p>
          <p>
            4 &nbsp; Power = 1 − β = <b>{r.power.toFixed(4)}</b>
          </p>
        </article>
        <aside>
          <h3>5. Key Insight</h3>
          <p>
            Lowering c decreases β and increases power, but increases α. Raising
            c decreases α but increases β.
          </p>
          <h3>6. Common Misconception</h3>
          <p>
            Failing to reject H0 does not prove it is true; it means evidence
            was insufficient.
          </p>
        </aside>
      </section>
      <section className="te554-try">
        <h3>7. Try It Yourself</h3>
        <p>
          Change the alternative mean and watch β and power change at the
          current cutoff.
        </p>
        <div>
          <label>
            Alternative mean (μ1)
            <input
              type="range"
              min={mu0}
              max={mu0 + 10}
              step=".1"
              value={mu1}
              onChange={(e) => {
                setMu1(+e.target.value);
                touch();
              }}
            />
            <input
              type="number"
              value={mu1}
              step=".1"
              onChange={(e) => {
                setMu1(+e.target.value);
                touch();
              }}
            />
          </label>
          <Metric
            label="Non-centrality (δ)"
            detail="(μ1 − μ0) / SE"
            value={r.delta}
          />
          <Metric
            label="β (Type II error)"
            detail="False negative rate"
            value={r.beta}
          />
          <Metric
            label="Power (1 − β)"
            detail="Detection probability"
            value={r.power}
          />
        </div>
      </section>
      <section className="te554-quiz">
        <h3>Quick check</h3>
        <p>
          Which change generally increases power while the other parameters
          remain fixed?
        </p>
        {[
          "Raise the critical cutoff",
          "Move the alternative mean farther from the null",
          "Reduce the sample size",
        ].map((option, index) => (
          <button
            key={option}
            className={
              answer === index ? (index === 1 ? "correct" : "incorrect") : ""
            }
            onClick={() => {
              setAnswer(index);
              touch();
            }}
          >
            {option}
          </button>
        ))}
        <aside className={answer === 1 ? "correct" : "incorrect"}>
          {answer === 1
            ? "Correct. Greater separation reduces beta and raises power."
            : "Try again. Think about increasing separation between the distributions."}
        </aside>
      </section>
      <LessonTopicStudyBoard lessonId={554} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
function Metric({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: number;
}) {
  return (
    <span>
      <small>{label}</small>
      <i>{detail}</i>
      <b>{value.toFixed(4)}</b>
    </span>
  );
}
function ErrorPlot({
  result,
  onCritical,
}: {
  result: ReturnType<typeof typeErrorsAnalysis>;
  onCritical: (value: number) => void;
}) {
  const min = -4,
    max = Math.max(6, result.delta + 4),
    sx = (x: number) => 25 + ((x - min) / (max - min)) * 720,
    sy = (x: number, mean: number) =>
      245 - Math.exp(-((x - mean) ** 2) / 2) * 175,
    curve = (mean: number) =>
      Array.from({ length: 161 }, (_, i) => {
        const x = min + (i / 160) * (max - min);
        return `${sx(x)},${sy(x, mean)}`;
      }).join(" "),
    drag = (event: PointerEvent<SVGSVGElement>) => {
      if (event.buttons !== 1 && event.type === "pointermove") return;
      const rect = event.currentTarget.getBoundingClientRect(),
        value =
          min +
          Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) *
            (max - min);
      onCritical(Math.round(value * 200) / 200);
    };
  return (
    <svg
      viewBox="0 0 770 285"
      role="img"
      aria-label="Overlapping null and alternative distributions"
      onPointerDown={drag}
      onPointerMove={drag}
    >
      <line className="axis" x1="20" x2="750" y1="245" y2="245" />
      <polyline className="null" points={curve(0)} />
      <polyline className="alternative" points={curve(result.delta)} />
      <line
        className="cutoff"
        x1={sx(result.critical)}
        x2={sx(result.critical)}
        y1="25"
        y2="245"
      />
      <text x={sx(result.critical)} y="20" textAnchor="middle">
        c = {result.critical.toFixed(3)}
      </text>
      <text x="35" y="20">
        Null: N(0, 1)
      </text>
      <text x="540" y="20">
        Alternative: N({result.delta.toFixed(2)}, 1)
      </text>
      <text x={sx(result.critical + 0.55)} y="180">
        α = {result.alpha.toFixed(4)}
      </text>
      <text x={sx(result.critical - 0.65)} y="220">
        β = {result.beta.toFixed(4)}
      </text>
    </svg>
  );
}
