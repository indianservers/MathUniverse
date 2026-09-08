import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import { correlationDefault, correlationStats } from "./correlationLessonModel";
import "./CorrelationLesson489.css";
export default function CorrelationLesson489({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <CorrelationActivity key={resetToken} onInteraction={onInteraction} />;
}
function CorrelationActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [points, setPoints] = useState(correlationDefault),
    [selected, setSelected] = useState<number | null>(null),
    [line, setLine] = useState(true);
  const stats = correlationStats(points),
    strength =
      Math.abs(stats.r) >= 0.7
        ? stats.r > 0
          ? "Strong positive"
          : "Strong negative"
        : Math.abs(stats.r) >= 0.3
          ? "Moderate"
          : "No linear relationship";
  const update = (index: number, axis: "x" | "y", raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    setPoints(
      points.map((point, i) =>
        i === index ? { ...point, [axis]: value } : point,
      ),
    );
    onInteraction();
  };
  return (
    <div
      className="corr489"
      data-testid="statistics-mockup-0452"
      data-target-family="statistics-and-regression"
    >
      <header>
        <div>
          <span>DATA AND PROBABILITY · STATISTICS AND REGRESSION</span>
          <h2>Correlation Coefficient</h2>
          <p>Measure linear association between two quantitative variables.</p>
        </div>
        <span>Lesson 489 · Share</span>
      </header>
      <nav>
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </nav>
      <section className="corr489-steps">
        <b>
          Interact
          <br />
          <small>Build data and see r update.</small>
        </b>
        <b>
          Learn
          <br />
          <small>Understand strength and direction.</small>
        </b>
        <b>
          Example
          <br />
          <small>Interpret association.</small>
        </b>
        <b>
          Formula
          <br />
          <small>Use Pearson's r.</small>
        </b>
        <b>
          Practice
          <br />
          <small>Try paired sets.</small>
        </b>
      </section>
      <section className="corr489-work">
        <aside>
          <h3>Paired data</h3>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>x</th>
                <th>y</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr key={index} onClick={() => setSelected(index)}>
                  <td>P{index + 1}</td>
                  <td>
                    <input
                      aria-label={`Correlation x ${index + 1}`}
                      value={point.x}
                      onChange={(event) =>
                        update(index, "x", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`Correlation y ${index + 1}`}
                      value={point.y}
                      onChange={(event) =>
                        update(index, "y", event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => {
              setPoints(correlationDefault);
              setSelected(null);
              onInteraction();
            }}
          >
            <RotateCcw size={14} /> Reset points
          </button>
        </aside>
        <section className="corr489-graph">
          <h3>Drag points to explore</h3>
          <svg
            viewBox="0 0 500 320"
            role="img"
            aria-label="Correlation scatter plot"
          >
            {line && (
              <line
                x1="45"
                y1={`${260 - (stats.r > 0 ? 0 : 5) * 40}`}
                x2="455"
                y2={`${260 - (stats.r > 0 ? 5 : 0) * 40}`}
                stroke="#35b8dc"
                strokeWidth="2"
                strokeDasharray="7 5"
              />
            )}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={250 + point.x * 65}
                cy={160 - point.y * 50}
                r={selected === index ? 10 : 6}
                fill="#19b6ce"
                onClick={() => setSelected(index)}
              />
            ))}
          </svg>
          <label>
            <input
              type="checkbox"
              checked={line}
              onChange={(event) => setLine(event.target.checked)}
            />{" "}
            Show regression line
          </label>
        </section>
        <aside className="corr489-panel">
          <h3>Pearson correlation (r)</h3>
          <strong>{stats.r.toFixed(3)}</strong>
          <em>{strength}</em>
          <input
            aria-label="Correlation value"
            type="range"
            min="-1"
            max="1"
            step=".001"
            value={stats.r}
            readOnly
          />
          <div className="corr489-components">
            <p>
              Σ(xᵢ−x̄)(yᵢ−ȳ) <b>{(stats.covariance * stats.n).toFixed(3)}</b>
            </p>
            <p>
              x̄ <b>{stats.xMean.toFixed(3)}</b>
            </p>
            <p>
              ȳ <b>{stats.yMean.toFixed(3)}</b>
            </p>
            <p>
              Sx <b>{stats.sx.toFixed(3)}</b>
            </p>
            <p>
              Sy <b>{stats.sy.toFixed(3)}</b>
            </p>
            <p>
              Cov(x,y) <b>{stats.covariance.toFixed(3)}</b>
            </p>
          </div>
        </aside>
      </section>
      <section className="corr489-metrics">
        {[
          ["n", stats.n],
          ["r", stats.r.toFixed(3)],
          ["r²", (stats.r ** 2).toFixed(3)],
          ["Cov(x,y)", stats.covariance.toFixed(3)],
          ["Sx", stats.sx.toFixed(3)],
          ["Sy", stats.sy.toFixed(3)],
        ].map(([label, value]) => (
          <span key={String(label)}>
            {label}
            <b>{value}</b>
          </span>
        ))}
      </section>
      <section className="corr489-lower">
        <article>
          <h3>Key ideas</h3>
          <p>
            r = +1 is a perfect positive linear association; r = −1 is perfect
            negative; r = 0 means no linear association.
          </p>
        </article>
        <article>
          <h3>Definition & formula</h3>
          <p>
            Pearson's r is unit-free and lies between −1 and 1. It measures
            association, not cause.
          </p>
        </article>
        <article>
          <h3>Misconception guard</h3>
          <p>
            A strong correlation does not imply that one variable causes the
            other. Look for lurking variables and experiments.
          </p>
        </article>
      </section>
      <section className="corr489-example">
        <h3>Worked example</h3>
        <p>
          Current data: n = {stats.n}, r = {stats.r.toFixed(3)}, interpreted as
          a {strength.toLowerCase()} relationship.
        </p>
      </section>
      <section className="corr489-practice">
        <h3>Try it yourself</h3>
        <p>
          Compute r for a paired set and interpret its direction and strength.
        </p>
        <button type="button" onClick={() => onInteraction()}>
          Check answer
        </button>
      </section>
      <footer>
        <button
          type="button"
          onClick={() => {
            setPoints(correlationDefault);
            onInteraction();
          }}
        >
          <RotateCcw size={14} /> Reset lesson
        </button>
        <span>Previous: Time-Series Plot &nbsp; Next: Linear Regression →</span>
      </footer>
    </div>
  );
}
