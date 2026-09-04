import { CheckCircle2, GripVertical, RotateCcw } from "lucide-react";
import { type PointerEvent, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MedianOgiveTargetLesson10109.css";

const defaults = [5, 9, 12, 15, 7, 2];
const bounds = [0, 10, 20, 30, 40, 50, 60];
const r2 = (value: number) => Number(value.toFixed(2));

export default function MedianOgiveTargetLesson10109({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [frequencies, setFrequencies] = useState(defaults);
  const [showLess, setShowLess] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [dragging, setDragging] = useState<{
    index: number;
    y: number;
    value: number;
  } | null>(null);
  const [actions, setActions] = useState(0);
  const total = frequencies.reduce((sum, value) => sum + value, 0);
  const half = total / 2;
  const less = [0];
  frequencies.forEach((value) => less.push(less.at(-1)! + value));
  const more = bounds.map(
    (_, index) =>
      total -
      frequencies.slice(0, index).reduce((sum, value) => sum + value, 0),
  );
  const medianIndex = Math.max(0, less.findIndex((value) => value >= half) - 1);
  const lower = bounds[medianIndex];
  const cumulativeBefore = less[medianIndex];
  const medianFrequency = frequencies[medianIndex];
  const width = bounds[medianIndex + 1] - lower;
  const median = r2(
    lower + ((half - cumulativeBefore) / Math.max(1, medianFrequency)) * width,
  );
  const sx = (x: number) => 45 + (x / 60) * 455;
  const sy = (value: number) => 260 - (value / Math.max(60, total)) * 220;
  const lessPath = less
    .map(
      (value, index) => `${index ? "L" : "M"}${sx(bounds[index])},${sy(value)}`,
    )
    .join(" ");
  const morePath = more
    .map(
      (value, index) => `${index ? "L" : "M"}${sx(bounds[index])},${sy(value)}`,
    )
    .join(" ");
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setFrequency = (index: number, value: number) =>
    setFrequencies((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? Math.max(1, Math.min(30, Math.round(value)))
          : item,
      ),
    );
  const dragFrequency = (
    event: PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (dragging?.index !== index) return;
    setFrequency(index, dragging.value + (dragging.y - event.clientY) / 4);
  };
  const reset = () =>
    act(() => {
      setFrequencies(defaults);
      setShowLess(true);
      setShowMore(true);
      setDragging(null);
    });

  return (
    <section
      className="med10109-page"
      data-testid="school-mockup-0783"
      data-object-model="dedicated-dual-ogive-grouped-median-equivalence-engine"
      data-frequencies={frequencies.join(",")}
      data-less={less.join(",")}
      data-more={more.join(",")}
      data-total={total}
      data-half={half}
      data-median={median}
      data-median-class={`${lower}-${lower + width}`}
      data-show-less={String(showLess)}
      data-show-more={String(showMore)}
      data-actions={actions}
    >
      <header className="med10109-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <h1>Median from an Ogive</h1>
          <p>
            Find the median of grouped data using two equivalent graphical
            constructions and compare with the grouped median formula.
          </p>
          <nav>
            <span>18 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <aside>
          <b>KEY IDEA</b>
          <p>
            The median splits the data into two equal parts (N/2 each). Both
            less-than and more-than ogives give the same median.
          </p>
        </aside>
      </header>
      <main className="med10109-workspace">
        <section className="med10109-data">
          <h2>
            1 ) DATA <span>(Grouped Frequency Distribution)</span>
          </h2>
          <table>
            <thead>
              <tr>
                <th>Class Interval</th>
                <th>f (Frequency)</th>
                <th>&lt; Cf</th>
                <th>&gt; Cf</th>
              </tr>
            </thead>
            <tbody>
              {frequencies.map((frequency, index) => (
                <tr key={index}>
                  <td>
                    <GripVertical /> {bounds[index]} – {bounds[index + 1]}
                  </td>
                  <td>
                    <div
                      role="slider"
                      tabIndex={0}
                      aria-label={`Frequency row ${index + 1}`}
                      aria-valuemin="1"
                      aria-valuemax="30"
                      aria-valuenow={frequency}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() =>
                          setDragging({
                            index,
                            y: event.clientY,
                            value: frequency,
                          }),
                        );
                      }}
                      onPointerMove={(event) => dragFrequency(event, index)}
                      onPointerUp={() =>
                        dragging && act(() => setDragging(null))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "ArrowUp")
                          act(() => setFrequency(index, frequency + 1));
                        if (event.key === "ArrowDown")
                          act(() => setFrequency(index, frequency - 1));
                      }}
                    >
                      ↕ {frequency}
                    </div>
                  </td>
                  <td>{less[index + 1]}</td>
                  <td>{more[index + 1]}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total (N)</td>
                <td>{total}</td>
                <td>–</td>
                <td>–</td>
              </tr>
            </tfoot>
          </table>
          <p>Edit frequencies by dragging the values or using arrow keys.</p>
          <aside>
            <b>N = {total}</b>
            <strong>⇒</strong>
            <b>N/2 = {half}</b>
            <span>Class width (h) = {width}</span>
          </aside>
        </section>
        <section className="med10109-dual">
          <header>
            <h2>
              2 ) DUAL OGIVE{" "}
              <span>(Less-than &amp; More-than on same axes)</span>
            </h2>
            <label>
              <input
                type="checkbox"
                checked={showLess}
                onChange={(event) =>
                  act(() => setShowLess(event.target.checked))
                }
              />{" "}
              Less-than ogive
            </label>
            <label>
              <input
                type="checkbox"
                checked={showMore}
                onChange={(event) =>
                  act(() => setShowMore(event.target.checked))
                }
              />{" "}
              More-than ogive
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset points
            </button>
          </header>
          <svg
            viewBox="0 0 540 330"
            aria-label="Dual ogive median construction"
          >
            <g className="grid">
              {[0, 10, 20, 30, 40, 50, 60].map((value) => (
                <line
                  key={value}
                  x1="45"
                  y1={sy(value)}
                  x2="510"
                  y2={sy(value)}
                />
              ))}
            </g>
            <line x1="45" y1="260" x2="515" y2="260" />
            <line x1="45" y1="265" x2="45" y2="35" />
            {showLess && (
              <>
                <path className="less" d={lessPath} />
                {less.map((value, index) => (
                  <circle
                    key={`l${index}`}
                    className="less"
                    cx={sx(bounds[index])}
                    cy={sy(value)}
                    r="4"
                  />
                ))}
              </>
            )}
            {showMore && (
              <>
                <path className="more" d={morePath} />
                {more.map((value, index) => (
                  <circle
                    key={`m${index}`}
                    className="more"
                    cx={sx(bounds[index])}
                    cy={sy(value)}
                    r="4"
                  />
                ))}
              </>
            )}
            <g className="guide">
              <line x1="45" y1={sy(half)} x2={sx(median)} y2={sy(half)} />
              <line x1={sx(median)} y1={sy(half)} x2={sx(median)} y2="260" />
              <circle cx={sx(median)} cy={sy(half)} r="6" />
              <text x="52" y={sy(half) - 8}>
                N/2 = {half}
              </text>
              <text x={sx(median) + 15} y={sy(half) + 20}>
                Intersection ({median}, {half})
              </text>
            </g>
            {bounds.map((value) => (
              <text key={value} x={sx(value) - 5} y="282">
                {value}
              </text>
            ))}
          </svg>
          <div className="med10109-read">
            <article>
              <b>Read-off from Less-than ogive</b>
              <p>At cumulative frequency N/2 = {half}</p>
              <strong>x (Median) = {median}</strong>
            </article>
            <article>
              <b>Intersection of ogives</b>
              <strong>
                ({median}, {half})
              </strong>
              <p>Median = {median}</p>
            </article>
            <article>
              <b>Read-off from More-than ogive</b>
              <p>At cumulative frequency N/2 = {half}</p>
              <strong>x (Median) = {median}</strong>
            </article>
          </div>
          <aside>
            <b>Why do both constructions agree?</b>
            <p>
              At the median, half the observations lie below and half lie above,
              so both curves meet the N/2 guide at the same x-value.
            </p>
          </aside>
        </section>
        <div className="med10109-right">
          <section className="med10109-formula">
            <h2>3 ) GROUPED MEDIAN FORMULA</h2>
            <strong>Median = l + ((N/2 − cᶠ) / f) h</strong>
            <p>
              l = lower boundary, cᶠ = cumulative frequency before median class,
              f = frequency, h = class width
            </p>
            <div>
              N/2 = {half}
              <br />
              Median class: {lower} – {lower + width}
              <br />
              l={lower}, cᶠ={cumulativeBefore}, f={medianFrequency}, h={width}
              <br />
              <b>
                Median = {lower} + ({half} − {cumulativeBefore})/
                {medianFrequency} × {width}
              </b>
              <br />= {median}
            </div>
            <mark>Median (Formula) ≈ {median}</mark>
          </section>
          <section className="med10109-compare">
            <h2>4 ) COMPARISON</h2>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Value</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Less-than ogive (N/2 read-off)",
                  "Intersection of ogives",
                  "More-than ogive (N/2 read-off)",
                  "Grouped median formula",
                ].map((method) => (
                  <tr key={method}>
                    <td>{method}</td>
                    <td>{median}</td>
                    <td>≈ 0.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              <CheckCircle2 /> All methods agree because they derive from the
              same grouped distribution.
            </p>
          </section>
        </div>
      </main>
    </section>
  );
}
