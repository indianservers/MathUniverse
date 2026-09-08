import { Check, RotateCcw, Shuffle } from "lucide-react";
import { useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { fDensity } from "./fDistributionLessonModel";
import { oneWayAnova, randomAnovaGroups } from "./anovaLessonModel";
import "./AnovaLesson552.css";

const INITIAL_GROUPS = [
  [8, 7, 6, 10, 8, 9],
  [12, 13, 11, 14, 12, 13],
  [16, 17, 15, 18, 17, 16],
];
const LABELS = ["A", "B", "C"];
const COLORS = ["#3b63e8", "#e5458c", "#0ca98b"];

export default function AnovaLesson552({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <AnovaActivity key={resetToken} onInteraction={onInteraction} />;
}

function AnovaActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [groups, setGroups] = useState(INITIAL_GROUPS),
    [alpha, setAlpha] = useState(0.05),
    [seed, setSeed] = useState(552),
    [answer, setAnswer] = useState(1),
    result = oneWayAnova(groups, alpha),
    touch = () => onInteraction();

  const setPreset = (name: "current" | "equal" | "spread") => {
    setGroups(
      name === "current"
        ? INITIAL_GROUPS
        : name === "equal"
          ? [
              [8, 10, 12, 14, 16, 18],
              [7, 11, 12, 13, 15, 20],
              [9, 10, 13, 14, 15, 17],
            ]
          : [
              [10, 11, 9, 10, 10, 10],
              [4, 9, 14, 19, 24, 5],
              [1, 7, 13, 19, 25, 31],
            ],
    );
    touch();
  };
  const updateValue = (
    groupIndex: number,
    valueIndex: number,
    value: number,
  ) => {
    setGroups((current) =>
      current.map((group, gi) =>
        gi === groupIndex
          ? group.map((item, vi) => (vi === valueIndex ? value : item))
          : group,
      ),
    );
    touch();
  };
  const reset = () => {
    setGroups(INITIAL_GROUPS);
    setAlpha(0.05);
    setSeed(552);
    setAnswer(1);
    touch();
  };
  const randomize = () => {
    const next = seed + 1;
    setSeed(next);
    setGroups(randomAnovaGroups(next));
    touch();
  };

  return (
    <div className="anova552" data-testid="inference-mockup-0515">
      <header className="anova552-hero">
        <span>DATA AND PROBABILITY &nbsp; INFERENTIAL STATISTICS</span>
        <h2>One-Way ANOVA</h2>
        <p>Compare three or more population means with one overall F test.</p>
        <b>Learning objective</b>
        <b>Examples</b>
        <b>Formulas</b>
        <b>Common pitfalls</b>
        <b>Assumptions &amp; cautions</b>
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
          <div>
            <span>INTERACTION + VISUALIZATION</span>
            <h3>ANOVA Explorer</h3>
            <p>
              Edit or drag the observations and watch the variation split
              update.
            </p>
          </div>
          <b>{result.reject ? "Means differ" : "No clear difference"}</b>
          <button onClick={reset}>
            <RotateCcw size={13} /> Reset all
          </button>
        </header>

        <section className="anova552-controls">
          <article>
            <h3>1. Choose a preset</h3>
            <button onClick={() => setPreset("current")}>
              Clear separation
            </button>
            <button onClick={() => setPreset("equal")}>Similar means</button>
            <button onClick={() => setPreset("spread")}>Unequal spreads</button>
            <button onClick={randomize}>
              <Shuffle size={13} /> Random groups
            </button>
          </article>
          <article>
            <h3>2. Edit group values</h3>
            <div className="anova552-groups">
              {groups.map((group, groupIndex) => (
                <fieldset key={LABELS[groupIndex]}>
                  <legend style={{ color: COLORS[groupIndex] }}>
                    Group {LABELS[groupIndex]}
                  </legend>
                  <div>
                    {group.map((value, valueIndex) => (
                      <input
                        key={valueIndex}
                        aria-label={`Group ${LABELS[groupIndex]} value ${valueIndex + 1}`}
                        type="number"
                        step=".5"
                        value={+value.toFixed(2)}
                        onChange={(event) =>
                          updateValue(
                            groupIndex,
                            valueIndex,
                            +event.target.value,
                          )
                        }
                      />
                    ))}
                  </div>
                  <p>
                    n = {group.length}{" "}
                    <strong>
                      mean = {result.summaries[groupIndex].mean.toFixed(2)}
                    </strong>
                  </p>
                </fieldset>
              ))}
            </div>
          </article>
          <article>
            <h3>3. Significance</h3>
            <label>
              Alpha
              <select
                value={alpha}
                onChange={(event) => {
                  setAlpha(+event.target.value);
                  touch();
                }}
              >
                <option value="0.1">0.10</option>
                <option value="0.05">0.05</option>
                <option value="0.01">0.01</option>
              </select>
            </label>
            <p>
              <strong>H0:</strong> μA = μB = μC
            </p>
            <p>
              <strong>HA:</strong> At least one mean differs
            </p>
            <p>
              Grand mean <strong>{result.grandMean.toFixed(2)}</strong>
            </p>
          </article>
        </section>

        <section className="anova552-plots">
          <article>
            <h3>Group observations</h3>
            <StripPlot
              groups={groups}
              means={result.summaries.map((item) => item.mean)}
              onChange={updateValue}
            />
            <p>Drag any point vertically to change its observation.</p>
          </article>
          <article>
            <h3>Group box plots</h3>
            <BoxPlots groups={groups} />
          </article>
        </section>

        <section className="anova552-decomposition">
          <article>
            <h3>Variation decomposition</h3>
            <div>
              <Metric
                label="Between groups (SSB)"
                value={result.ssBetween.toFixed(2)}
              />
              <b>+</b>
              <Metric
                label="Within groups (SSW)"
                value={result.ssWithin.toFixed(2)}
              />
              <b>=</b>
              <Metric label="Total (SST)" value={result.ssTotal.toFixed(2)} />
            </div>
            <p>
              SST = SSB + SSW. Larger between-group variation relative to
              within-group variation raises F.
            </p>
          </article>
          <article className="anova552-result">
            <h3>F statistic</h3>
            <strong>{result.statistic.toFixed(2)}</strong>
            <p>
              p{" "}
              {result.pValue < 0.0001
                ? "< 0.0001"
                : `= ${result.pValue.toFixed(4)}`}
            </p>
            <b>
              <Check size={17} />{" "}
              {result.reject ? "Reject H0" : "Fail to reject H0"}
            </b>
          </article>
        </section>

        <section className="anova552-detail">
          <article>
            <h3>ANOVA table</h3>
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>SS</th>
                  <th>df</th>
                  <th>MS</th>
                  <th>F</th>
                  <th>p</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Between</td>
                  <td>{result.ssBetween.toFixed(2)}</td>
                  <td>{result.dfBetween}</td>
                  <td>{result.msBetween.toFixed(2)}</td>
                  <td>{result.statistic.toFixed(2)}</td>
                  <td>
                    {result.pValue < 0.0001
                      ? "<.0001"
                      : result.pValue.toFixed(4)}
                  </td>
                </tr>
                <tr>
                  <td>Within</td>
                  <td>{result.ssWithin.toFixed(2)}</td>
                  <td>{result.dfWithin}</td>
                  <td>{result.msWithin.toFixed(2)}</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>{result.ssTotal.toFixed(2)}</td>
                  <td>{result.dfTotal}</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article>
            <h3>F distribution</h3>
            <FPlot
              statistic={result.statistic}
              critical={result.critical}
              df1={result.dfBetween}
              df2={result.dfWithin}
            />
            <p>
              Critical F = {result.critical.toFixed(2)} at α ={" "}
              {alpha.toFixed(2)}
            </p>
          </article>
        </section>

        <section className="anova552-posthoc">
          <h3>
            Post-hoc comparisons <small>Bonferroni adjusted</small>
          </h3>
          {result.comparisons.map((item) => (
            <div key={`${item.first}-${item.second}`}>
              <b>
                {LABELS[item.first]} vs {LABELS[item.second]}
              </b>
              <span>difference = {item.difference.toFixed(2)}</span>
              <span>
                adjusted p{" "}
                {item.adjustedP < 0.0001
                  ? "< 0.0001"
                  : `= ${item.adjustedP.toFixed(4)}`}
              </span>
              <strong className={item.significant ? "yes" : "no"}>
                {item.significant ? "Significant" : "Not significant"}
              </strong>
            </div>
          ))}
        </section>
      </main>

      <section className="anova552-notes">
        <article>
          <h3>Insight</h3>
          <p>
            η² = {result.etaSquared.toFixed(3)}: about{" "}
            {(result.etaSquared * 100).toFixed(1)}% of total variation is
            associated with group membership.
          </p>
        </article>
        <article>
          <h3>Common pitfall</h3>
          <p>
            The overall test does not identify which means differ. Use an
            adjusted post-hoc comparison after a significant F test.
          </p>
        </article>
        <article>
          <h3>Assumptions</h3>
          <p>
            Independent observations, approximately normal residuals, and
            reasonably similar population variances.
          </p>
        </article>
      </section>
      <section className="anova552-quiz">
        <h3>Quick check</h3>
        <p>What does a significant one-way ANOVA establish?</p>
        {[
          "Every group mean differs",
          "At least one population mean differs",
          "The largest sample mean is correct",
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
        {answer >= 0 && (
          <aside className={answer === 1 ? "correct" : "incorrect"}>
            {answer === 1
              ? "Correct. Follow-up comparisons locate the differences."
              : "Not quite. The omnibus F test only establishes that not all means are equal."}
          </aside>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}

function StripPlot({
  groups,
  means,
  onChange,
}: {
  groups: number[][];
  means: number[];
  onChange: (group: number, item: number, value: number) => void;
}) {
  const values = groups.flat(),
    min = Math.min(...values) - 2,
    max = Math.max(...values) + 2;
  const y = (value: number) =>
    208 - ((value - min) / Math.max(1, max - min)) * 180;
  const drag = (
    event: PointerEvent<SVGCircleElement>,
    groupIndex: number,
    valueIndex: number,
  ) => {
    if (event.buttons !== 1 && event.type === "pointermove") return;
    const rect = event.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const value =
      max -
      ((event.clientY - rect.top - 18) / Math.max(1, rect.height - 36)) *
        (max - min);
    onChange(
      groupIndex,
      valueIndex,
      Math.round(Math.max(min, Math.min(max, value)) * 2) / 2,
    );
  };
  return (
    <svg viewBox="0 0 600 230" role="img" aria-label="Interactive strip plot">
      {[0, 1, 2, 3, 4].map((tick) => {
        const value = min + (tick * (max - min)) / 4;
        return (
          <g key={tick}>
            <line x1="45" x2="575" y1={y(value)} y2={y(value)} />
            <text x="38" y={y(value) + 4} textAnchor="end">
              {value.toFixed(0)}
            </text>
          </g>
        );
      })}
      {groups.map((group, gi) => (
        <g key={gi}>
          {group.map((value, vi) => (
            <circle
              key={vi}
              cx={130 + gi * 170 + ((vi % 3) - 1) * 11}
              cy={y(value)}
              r="7"
              fill={COLORS[gi]}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                drag(event, gi, vi);
              }}
              onPointerMove={(event) => drag(event, gi, vi)}
            />
          ))}
          <line
            className="mean"
            x1={90 + gi * 170}
            x2={170 + gi * 170}
            y1={y(means[gi])}
            y2={y(means[gi])}
            style={{ stroke: COLORS[gi] }}
          />
          <text x={130 + gi * 170} y="225" textAnchor="middle">
            Group {LABELS[gi]}
          </text>
        </g>
      ))}
      <line
        className="grand"
        x1="45"
        x2="575"
        y1={y(means.reduce((sum, value) => sum + value, 0) / means.length)}
        y2={y(means.reduce((sum, value) => sum + value, 0) / means.length)}
      />
    </svg>
  );
}

function BoxPlots({ groups }: { groups: number[][] }) {
  const all = groups.flat(),
    min = Math.min(...all) - 2,
    max = Math.max(...all) + 2,
    y = (v: number) => 208 - ((v - min) / Math.max(1, max - min)) * 180;
  const q = (values: number[], p: number) => {
    const sorted = [...values].sort((a, b) => a - b),
      index = (sorted.length - 1) * p,
      low = Math.floor(index),
      fraction = index - low;
    return (
      sorted[low] +
      (sorted[low + 1] === undefined
        ? 0
        : fraction * (sorted[low + 1] - sorted[low]))
    );
  };
  return (
    <svg viewBox="0 0 600 230" role="img" aria-label="Box plots by group">
      {groups.map((group, gi) => {
        const low = Math.min(...group),
          high = Math.max(...group),
          q1 = q(group, 0.25),
          median = q(group, 0.5),
          q3 = q(group, 0.75),
          x = 130 + gi * 170;
        return (
          <g key={gi}>
            <line
              x1={x}
              x2={x}
              y1={y(low)}
              y2={y(high)}
              style={{ stroke: COLORS[gi] }}
            />
            <rect
              x={x - 35}
              y={y(q3)}
              width="70"
              height={Math.max(2, y(q1) - y(q3))}
              fill={`${COLORS[gi]}33`}
              style={{ stroke: COLORS[gi] }}
            />
            <line
              className="median"
              x1={x - 35}
              x2={x + 35}
              y1={y(median)}
              y2={y(median)}
            />
            <text x={x} y="225" textAnchor="middle">
              Group {LABELS[gi]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function FPlot({
  statistic,
  critical,
  df1,
  df2,
}: {
  statistic: number;
  critical: number;
  df1: number;
  df2: number;
}) {
  const domain = Math.max(6, Math.min(100, statistic * 1.12)),
    points = Array.from({ length: 121 }, (_, i) => ({
      x: (i / 120) * domain,
      y: fDensity((i / 120) * domain, df1, df2),
    })),
    maxY = Math.max(...points.map((point) => point.y), 0.001),
    sx = (x: number) => 8 + Math.min(1, x / domain) * 88,
    polyline = points
      .map((point) => `${sx(point.x)},${77 - (point.y / maxY) * 58}`)
      .join(" ");
  return (
    <svg
      className="anova552-f"
      viewBox="0 0 100 85"
      role="img"
      aria-label="F sampling distribution"
    >
      <polyline points={polyline} />
      <line
        className="critical"
        x1={sx(critical)}
        x2={sx(critical)}
        y1="12"
        y2="78"
      />
      <line
        className="observed"
        x1={sx(statistic)}
        x2={sx(statistic)}
        y1="6"
        y2="78"
      />
      <text x={Math.min(91, sx(statistic))} y="9" textAnchor="end">
        F={statistic.toFixed(2)}
      </text>
    </svg>
  );
}
