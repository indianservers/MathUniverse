import { Check, Pencil, RotateCcw, Star } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  goodnessOfFitDensity,
  goodnessOfFitTest,
} from "./goodnessOfFitLessonModel";
import "./ChiSquareGoodnessOfFitLesson549.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

export default function ChiSquareGoodnessOfFitLesson549({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <GoodnessActivity key={resetToken} onInteraction={onInteraction} />;
}
function GoodnessActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [observed, setObserved] = useState([21, 18, 24, 17, 20]),
    [weights, setWeights] = useState([1, 1, 1, 1, 1]),
    [editing, setEditing] = useState(false),
    [alpha, setAlpha] = useState(0.05),
    [estimated, setEstimated] = useState(0),
    [preset, setPreset] = useState("example1"),
    [answer, setAnswer] = useState(3);
  const r = goodnessOfFitTest(observed, weights, alpha, estimated),
    touch = () => onInteraction(),
    reset = () => {
      setObserved([21, 18, 24, 17, 20]);
      setWeights([1, 1, 1, 1, 1]);
      setEditing(false);
      setAlpha(0.05);
      setEstimated(0);
      setPreset("example1");
      setAnswer(3);
      touch();
    };
  const setExample = (value: string) => {
    setPreset(value);
    if (value === "example1") {
      setObserved([21, 18, 24, 17, 20]);
      setWeights([1, 1, 1, 1, 1]);
    } else if (value === "die") {
      setObserved([21, 15, 18, 26, 22, 18]);
      setWeights([1, 1, 1, 1, 1, 1]);
    } else {
      setObserved([42, 28, 18, 12]);
      setWeights([4, 3, 2, 1]);
    }
    touch();
  };
  const update = (
    setter: (v: number[]) => void,
    index: number,
    value: number,
  ) => {
    setter((current) =>
      current.map((item, i) => (i === index ? Math.max(0, value) : item)),
    );
    touch();
  };
  const chartDrag = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect(),
      index = Math.max(
        0,
        Math.min(
          observed.length - 1,
          Math.floor(
            ((event.clientY - rect.top) / rect.height) * observed.length,
          ),
        ),
      ),
      target = Math.max(0, ((event.clientX - rect.left) / rect.width) * 1.5),
      expected = r.expected[index],
      sign = observed[index] >= expected ? 1 : -1,
      next = expected + sign * Math.sqrt(target * expected);
    update(setObserved, index, Math.round(next));
  };
  const domain = Math.max(16, r.statistic * 2.5),
    samples = Array.from({ length: 101 }, (_, i) => {
      const x = (i / 100) * domain;
      return { x, y: goodnessOfFitDensity(x, r.df) };
    }),
    maxDensity = Math.max(0.001, ...samples.map((p) => p.y)),
    sx = (x: number) => 6 + (x / domain) * 89,
    curve = samples
      .map((p) => `${sx(p.x)},${76 - (p.y / maxDensity) * 57}`)
      .join(" ");
  const pText = r.pValue.toFixed(4),
    decision = r.reject ? "Reject H0" : "Fail to reject H0";
  const quiz = goodnessOfFitTest([25, 25, 25, 25, 0], [1, 1, 1, 1, 1]);
  return (
    <div className="gf549" data-testid="inference-mockup-0512">
      <header className="gf549-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>Chi-Square Goodness-of-Fit Test</h2>
        <p>
          Compare observed categorical counts with an expected distribution.
        </p>
        <b>Advanced</b>
        <b>Inference Lab</b>
        <b>Probability Calculator / Statistics</b>
        <button onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
      </header>
      <nav>
        <b>Interaction + visualization</b>
        <span>Guided Explanation</span>
        <span>Key Insight</span>
        <span>Assumptions &amp; Cautions</span>
        <span>Quick Check</span>
      </nav>
      <main>
        <header>
          <div>
            <span>INTERACTION + VISUALIZATION</span>
            <h3>Test a categorical distribution</h3>
          </div>
          <b>Parameters set</b>
          <select value={preset} onChange={(e) => setExample(e.target.value)}>
            <option value="example1">Example 1 (Loaded)</option>
            <option value="die">Six-sided die</option>
            <option value="weighted">Weighted categories</option>
          </select>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset all
          </button>
        </header>
        <section className="gf549-top">
          <article className="gf549-table">
            <h3>
              1. Data table (edit &amp; recalc){" "}
              <button onClick={() => setEditing((value) => !value)}>
                <Pencil size={12} /> {editing ? "Done" : "Edit mode"}
              </button>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Observed</th>
                  <th>Expected</th>
                  <th>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {r.observed.map((value, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {editing ? (
                        <input
                          aria-label={`Observed ${index + 1}`}
                          type="number"
                          value={value}
                          onChange={(e) =>
                            update(setObserved, index, +e.target.value)
                          }
                        />
                      ) : (
                        value.toFixed(0)
                      )}
                    </td>
                    <td>
                      {editing ? (
                        <input
                          aria-label={`Expected weight ${index + 1}`}
                          type="number"
                          min="0"
                          step=".1"
                          value={weights[index]}
                          onChange={(e) =>
                            update(setWeights, index, +e.target.value)
                          }
                        />
                      ) : (
                        r.expected[index].toFixed(2)
                      )}
                    </td>
                    <td>{r.contributions[index].toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Totals</th>
                  <th>{r.total}</th>
                  <th>{r.expected.reduce((a, b) => a + b, 0).toFixed(2)}</th>
                  <th>χ²={r.statistic.toFixed(3)}</th>
                </tr>
              </tfoot>
            </table>
            <button onClick={touch}>Apply changes</button>
          </article>
          <article className="gf549-charts">
            <section>
              <h3>2. Residual contributions (per category)</h3>
              <svg
                viewBox="0 0 100 75"
                preserveAspectRatio="none"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  chartDrag(e);
                }}
                onPointerMove={(e) => {
                  if (e.currentTarget.hasPointerCapture(e.pointerId))
                    chartDrag(e);
                }}
              >
                {r.contributions.map((value, index) => (
                  <g key={index}>
                    <text x="3" y={9 + index * 12}>
                      {index + 1}
                    </text>
                    <rect
                      x="10"
                      y={3 + index * 12}
                      width={Math.min(84, (value / 1.5) * 84)}
                      height="8"
                    />
                    <text
                      x={12 + Math.min(82, (value / 1.5) * 84)}
                      y={9 + index * 12}
                    >
                      {value.toFixed(3)}
                    </text>
                  </g>
                ))}
              </svg>
              <p>Drag a category bar to change its observed count.</p>
            </section>
            <section>
              <h3>3. χ² accumulation</h3>
              <svg viewBox="0 0 100 68" preserveAspectRatio="none">
                <polyline
                  points={r.cumulative
                    .map(
                      (value, index) =>
                        `${10 + (index / Math.max(1, r.cumulative.length - 1)) * 82},${57 - (value / Math.max(1, r.statistic)) * 45}`,
                    )
                    .join(" ")}
                />
                {r.cumulative.map((value, index) => (
                  <g key={index}>
                    <circle
                      cx={
                        10 + (index / Math.max(1, r.cumulative.length - 1)) * 82
                      }
                      cy={57 - (value / Math.max(1, r.statistic)) * 45}
                      r="1.7"
                    />
                    <text
                      x={
                        10 + (index / Math.max(1, r.cumulative.length - 1)) * 82
                      }
                      y={53 - (value / Math.max(1, r.statistic)) * 45}
                    >
                      {value.toFixed(3)}
                    </text>
                  </g>
                ))}
              </svg>
            </section>
          </article>
        </section>
        <section className="gf549-mid">
          <article>
            <h3>4. Test summary</h3>
            <table>
              <tbody>
                {[
                  ["Test", "Chi-Square Goodness-of-Fit"],
                  [
                    "Null hypothesis",
                    "Population follows expected distribution",
                  ],
                  [
                    "Alternative",
                    "Population does not follow expected distribution",
                  ],
                  ["Significance level", alpha.toFixed(2)],
                  ["Degrees of freedom", String(r.df)],
                  ["Test statistic", r.statistic.toFixed(3)],
                  ["p-value", pText],
                  ["Decision", decision],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <th>{a}</th>
                    <td>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <label>
              Estimated parameters
              <input
                type="number"
                min="0"
                max={Math.max(0, r.observed.length - 2)}
                value={estimated}
                onChange={(e) => {
                  setEstimated(+e.target.value);
                  touch();
                }}
              />
            </label>
            <label>
              alpha
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
          </article>
          <article>
            <h3>5. Right-tail p-value (χ² distribution)</h3>
            <svg viewBox="0 0 100 88" preserveAspectRatio="none">
              <polygon
                points={`${sx(r.statistic)},76 ${samples
                  .filter((p) => p.x >= r.statistic)
                  .map((p) => `${sx(p.x)},${76 - (p.y / maxDensity) * 57}`)
                  .join(" ")} 95,76`}
              />
              <polyline points={curve} />
              <line x1="6" x2="96" y1="76" y2="76" />
              <line
                className="observed"
                x1={sx(r.statistic)}
                x2={sx(r.statistic)}
                y1="24"
                y2="76"
              />
              <text x={sx(r.statistic)} y="20" textAnchor="middle">
                χ² = {r.statistic.toFixed(3)}
              </text>
            </svg>
            <p>Area to the right = {pText}</p>
          </article>
        </section>
        <section className="gf549-info">
          <article>
            <h3>6. Expected count checks</h3>
            <p>
              Minimum expected count <b>{r.minimumExpected.toFixed(2)}</b>
            </p>
            <p>
              All expected counts ≥ 5?{" "}
              <b>{r.conditions.allAtLeastFive ? "Yes" : "No"}</b>
            </p>
            <p>
              At most 20% below 5?{" "}
              <b>{r.conditions.tenPercentRule ? "Yes" : "No"}</b>
            </p>
            <strong>
              <Star size={14} />
              {r.conditions.valid
                ? "Assumptions satisfied for this test"
                : "Expected distribution is invalid"}
            </strong>
          </article>
          <article>
            <h3>7. Formula used</h3>
            <strong>χ² = Σ (Oi - Ei)² / Ei</strong>
            <p>
              df = k - 1 - fitted parameters = {r.observed.length} - 1 -{" "}
              {r.estimatedParameters} = {r.df}
            </p>
          </article>
          <article>
            <h3>8. Common misconception</h3>
            <p>
              A large difference in one category does not decide the test by
              itself. Add all standardized contributions and interpret the total
              p-value.
            </p>
          </article>
        </section>
        <section className="gf549-bottom">
          <article>
            <h3>9. Guided calculation</h3>
            <p>Example for category {Math.min(3, r.observed.length)}:</p>
            <strong>
              ({r.observed[Math.min(2, r.observed.length - 1)]}-
              {r.expected[Math.min(2, r.observed.length - 1)].toFixed(2)})²/
              {r.expected[Math.min(2, r.observed.length - 1)].toFixed(2)} ={" "}
              {r.contributions[Math.min(2, r.observed.length - 1)].toFixed(3)}
            </strong>
            <p>
              Sum:{" "}
              {r.contributions.map((value) => value.toFixed(3)).join(" + ")} ={" "}
              {r.statistic.toFixed(3)}
            </p>
          </article>
          <article>
            <h3>10. Quick Check</h3>
            <p>
              If observed counts were 25, 25, 25, 25, 0 with expected counts all
              20, what is χ²?
            </p>
            {[5, 10, 15, 25].map((choice, index) => (
              <button
                key={choice}
                className={
                  answer === index
                    ? index === 3
                      ? "correct"
                      : "incorrect"
                    : ""
                }
                onClick={() => {
                  setAnswer(index);
                  touch();
                }}
              >
                {String.fromCharCode(65 + index)}. {choice.toFixed(3)}
              </button>
            ))}
            <aside className={answer === 3 ? "correct" : "incorrect"}>
              <Check size={14} />
              <b>
                {answer === 3 ? "Correct." : "Include the fifth category."}
              </b>{" "}
              χ² = {quiz.statistic.toFixed(3)}
            </aside>
          </article>
        </section>
      </main>
      <footer>
        <span>Previous &nbsp; Two-Proportion Test</span>
        <span>Next &nbsp; Chi-Square Test of Independence</span>
      </footer>
      <LessonTopicStudyBoard lessonId={549} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
