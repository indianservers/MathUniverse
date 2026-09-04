import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { type PointerEvent, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MoreThanCumulativeTargetLesson10106.css";

const defaultFrequencies = [6, 9, 12, 8, 5];
const boundaries = [9.5, 19.5, 29.5, 39.5, 49.5];

export default function MoreThanCumulativeTargetLesson10106({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [frequencies, setFrequencies] = useState(defaultFrequencies);
  const [drag, setDrag] = useState<{
    index: number;
    y: number;
    value: number;
  } | null>(null);
  const [actions, setActions] = useState(0);
  const total = frequencies.reduce((sum, value) => sum + value, 0);
  let remaining = total;
  const rows = frequencies.map((frequency, index) => {
    const current = remaining;
    remaining -= frequency;
    return { frequency, current, next: remaining, boundary: boundaries[index] };
  });
  const moreThan = [total, ...rows.map((row) => row.next)];
  const lessThan = [0];
  frequencies.forEach((frequency) =>
    lessThan.push(lessThan[lessThan.length - 1] + frequency),
  );
  const setFrequency = (index: number, value: number) => {
    setFrequencies((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? Math.max(0, Math.min(20, Math.round(value)))
          : item,
      ),
    );
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const dragFrequency = (
    event: PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (drag?.index !== index) return;
    setFrequency(index, drag.value + (drag.y - event.clientY) / 5);
  };
  const reset = () =>
    act(() => {
      setFrequencies(defaultFrequencies);
      setDrag(null);
    });
  const chartX = (index: number) => 40 + index * 77;
  const chartY = (value: number) => 230 - (value / Math.max(40, total)) * 180;
  const staircase = moreThan
    .slice(0, -1)
    .map((value, index) => {
      const x = chartX(index);
      const nextX = chartX(index + 1);
      const y = chartY(value);
      const nextY = chartY(moreThan[index + 1]);
      return `${index === 0 ? `M${x},${y}` : ""} H${nextX} V${nextY}`;
    })
    .join(" ");

  return (
    <section
      className="mtc10106-page"
      data-testid="school-mockup-0780"
      data-object-model="dedicated-more-than-descending-subtraction-engine"
      data-frequencies={frequencies.join(",")}
      data-more-than={moreThan.join(",")}
      data-less-than={lessThan.join(",")}
      data-total={total}
      data-actions={actions}
    >
      <header className="mtc10106-hero">
        <small>CLASS 10 · STATISTICS</small>
        <h1>More-Than Cumulative Frequency</h1>
        <p>
          More-than cumulative frequency (CF<sub>more</sub>) at a boundary shows
          how many observations are greater than or equal to that boundary.
        </p>
        <p>
          Start at total <i>N</i>, subtract each class frequency, and move
          downward.
        </p>
        <button onClick={reset}>
          <RotateCcw /> Reset table
        </button>
      </header>

      <main className="mtc10106-workspace">
        <section className="mtc10106-table-card">
          <h2>Editable grouped table (lower class boundaries)</h2>
          <p className="mtc10106-total">
            Total observations (<i>N</i>) <strong>{total}</strong>
          </p>
          <div className="mtc10106-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Lower class boundary (Lᵢ)</th>
                  <th>Class interval</th>
                  <th>
                    Frequency (fᵢ)<small>Drag to edit</small>
                  </th>
                  <th>Remove blocks</th>
                  <th>
                    Cumulative more-than CF<sub>more</sub> (≥ Lᵢ)
                  </th>
                  <th>Computation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>0</b>
                    <br />
                    (Start)
                  </td>
                  <td>–</td>
                  <td>–</td>
                  <td>–</td>
                  <td>–</td>
                  <td>
                    <strong>{total}</strong>
                    <small>= N</small>
                  </td>
                  <td>
                    Start at <i>N</i> = {total}
                  </td>
                </tr>
                {rows.map((row, index) => (
                  <tr key={row.boundary}>
                    <td>{index + 1}</td>
                    <td>{row.boundary}</td>
                    <td>
                      {index + 1}0–{index + 2}0
                    </td>
                    <td>
                      <div
                        className="mtc10106-frequency"
                        role="slider"
                        tabIndex={0}
                        aria-label={`Frequency row ${index + 1}`}
                        aria-valuemin="0"
                        aria-valuemax="20"
                        aria-valuenow={row.frequency}
                        onPointerDown={(event) => {
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          act(() =>
                            setDrag({
                              index,
                              y: event.clientY,
                              value: row.frequency,
                            }),
                          );
                        }}
                        onPointerMove={(event) => dragFrequency(event, index)}
                        onPointerUp={() => drag && act(() => setDrag(null))}
                        onKeyDown={(event) => {
                          if (
                            event.key === "ArrowDown" ||
                            event.key === "ArrowLeft"
                          ) {
                            event.preventDefault();
                            act(() => setFrequency(index, row.frequency - 1));
                          }
                          if (
                            event.key === "ArrowUp" ||
                            event.key === "ArrowRight"
                          ) {
                            event.preventDefault();
                            act(() => setFrequency(index, row.frequency + 1));
                          }
                          if (event.key === "Home")
                            act(() => setFrequency(index, 0));
                        }}
                      >
                        ↕ <b>{row.frequency}</b>
                      </div>
                    </td>
                    <td>
                      <span
                        className="mtc10106-blocks"
                        aria-label={`${row.frequency} observation blocks`}
                      >
                        {Array.from({ length: row.frequency }, (_, block) => (
                          <i key={block} />
                        ))}
                      </span>
                      <button
                        aria-label={`Clear frequency row ${index + 1}`}
                        onClick={() => act(() => setFrequency(index, 0))}
                      >
                        <Trash2 />
                      </button>
                    </td>
                    <td>
                      <strong>{row.next}</strong>
                    </td>
                    <td>
                      {row.current} − {row.frequency} = {row.next}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer>
            <span className="mtc10106-cube" /> = 1 observation (removed from the
            remaining total)
            <b>
              Final: CF<sub>more</sub> at last boundary = {moreThan.at(-1)}
            </b>
          </footer>
        </section>

        <section className="mtc10106-chart-card">
          <h2>
            Decreasing staircase (CF<sub>more</sub> vs. lower boundary)
          </h2>
          <svg
            viewBox="0 0 430 290"
            aria-label="More-than cumulative frequency staircase"
          >
            <g className="grid">
              {[0, 10, 20, 30, 40].map((v) => (
                <line key={v} x1="40" y1={chartY(v)} x2="425" y2={chartY(v)} />
              ))}
            </g>
            <line x1="40" y1="230" x2="425" y2="230" />
            <line x1="40" y1="35" x2="40" y2="230" />
            <path d={staircase} />
            {moreThan.map((value, index) => (
              <g key={index}>
                <circle cx={chartX(index)} cy={chartY(value)} r="4" />
                <text x={chartX(index) - 6} y={chartY(value) - 10}>
                  {value}
                </text>
                <text x={chartX(index) - 11} y="250">
                  {index === 0 ? "Start" : boundaries[index - 1]}
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <p>
              Each drop equals the class frequency of the interval just above.
            </p>
            <p>
              Drag any frequency in the table — all subsequent counts update
              automatically.
            </p>
          </footer>
        </section>

        <section className="mtc10106-warning">
          <div>
            <h2>
              <AlertTriangle /> Important: Do not accumulate upward
            </h2>
            <p>
              More-than cumulative frequency uses <b>descending subtraction.</b>
            </p>
            <p>Do not add upward as in the less-than method.</p>
            <p>That would give incorrect results.</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Less-than (ascending) ↑</th>
                <th>More-than (descending) ↓</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Add as you go up</td>
                <td>Subtract as you go down</td>
              </tr>
              <tr>
                <td>{lessThan.join(", ")}</td>
                <td>{moreThan.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="mtc10106-rule">
          <h2>Rule (at each step i)</h2>
          <strong>
            CF<sub>more</sub>(next) = CF<sub>more</sub>(current) − fᵢ
          </strong>
          <p>
            with CF<sub>more</sub>(0) = <i>N</i>
          </p>
        </section>
      </main>
      <nav className="mtc10106-nav">
        <button>
          <ArrowLeft /> Less-Than Cumulative Frequency
        </button>
        <button>
          Less-Than Ogive <ArrowRight />
        </button>
      </nav>
    </section>
  );
}
