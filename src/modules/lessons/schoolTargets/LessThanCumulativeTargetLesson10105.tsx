import {
  AlertTriangle,
  Info,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { type PointerEvent, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LessThanCumulativeTargetLesson10105.css";

type FrequencyRow = {
  id: number;
  lower: number;
  upper: number;
  frequency: number;
};
const defaults: FrequencyRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4 },
  { id: 2, lower: 10, upper: 20, frequency: 3 },
  { id: 3, lower: 20, upper: 30, frequency: 5 },
  { id: 4, lower: 30, upper: 40, frequency: 6 },
  { id: 5, lower: 40, upper: 50, frequency: 7 },
  { id: 6, lower: 50, upper: 60, frequency: 5 },
];

export default function LessThanCumulativeTargetLesson10105({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<FrequencyRow[]>(defaults);
  const [showValues, setShowValues] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [dragging, setDragging] = useState<{
    id: number;
    y: number;
    frequency: number;
  } | null>(null);
  const [randomCycle, setRandomCycle] = useState(0);
  const [actions, setActions] = useState(0);
  let running = 0;
  const cumulative = rows.map((row) => ({
    ...row,
    previous: running,
    cumulative: (running += row.frequency),
  }));
  const total = running;
  const maxValue = Math.max(10, Math.ceil(total / 5) * 5);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setFrequency = (id: number, value: number) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, frequency: Math.max(1, Math.min(99, Math.round(value))) }
          : row,
      ),
    );
  const dragFrequency = (
    event: PointerEvent<HTMLDivElement>,
    row: FrequencyRow,
  ) => {
    if (dragging?.id !== row.id) return;
    setFrequency(row.id, dragging.frequency + (dragging.y - event.clientY) / 4);
  };
  const reset = () =>
    act(() => {
      setRows(defaults);
      setShowValues(true);
      setShowPoints(true);
      setRandomCycle(0);
    });
  const randomize = () =>
    act(() => {
      const cycle = randomCycle + 1;
      setRows((current) =>
        current.map((row, index) => ({
          ...row,
          frequency: 2 + ((index * 5 + cycle * 3) % 8),
        })),
      );
      setRandomCycle(cycle);
    });
  const bars = cumulative.map((row, index) => {
    const x = 45 + index * 62;
    const height = (row.cumulative / maxValue) * 180;
    return { ...row, x, y: 220 - height, height };
  });
  const point = (upper: number, cf: number) => ({
    x: 40 + (upper / 60) * 390,
    y: 220 - (cf / maxValue) * 180,
  });
  const ogivePoints = [
    { x: 40, y: 220 },
    ...cumulative.map((row) => point(row.upper, row.cumulative)),
  ];
  const staircase = ogivePoints
    .slice(1)
    .map((current, index) => {
      const previous = ogivePoints[index];
      return `${index === 0 ? `M${previous.x},${previous.y}` : ""} H${current.x} V${current.y}`;
    })
    .join(" ");

  return (
    <section
      className="ltc10105-page"
      data-testid="school-mockup-0779"
      data-object-model="dedicated-less-than-cumulative-ogive-engine"
      data-frequencies={rows.map((row) => row.frequency).join(",")}
      data-cumulative={cumulative.map((row) => row.cumulative).join(",")}
      data-total={total}
      data-show-values={String(showValues)}
      data-show-points={String(showPoints)}
      data-random-cycle={randomCycle}
      data-actions={actions}
    >
      <header className="ltc10105-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <h1>Less-Than Cumulative Frequency</h1>
          <p>
            Less-Than Cumulative Frequency (CF) is the running total of
            frequencies up to and including each class.
          </p>
          <p>
            Drag any frequency to change it — all later cumulative totals,
            table, and graphs update instantly.
          </p>
          <nav>
            <span>18 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset
        </button>
      </header>
      <main>
        <section className="ltc10105-table">
          <h2>1) EDITABLE FREQUENCY TABLE</h2>
          <p>Drag any frequency cell to adjust (1–99).</p>
          <table>
            <thead>
              <tr>
                <th>Class Interval</th>
                <th>Upper Class Boundary (xᵢ)</th>
                <th>
                  Frequency (fᵢ)
                  <br />
                  (Drag)
                </th>
                <th>Less-Than CF (CFᵢ)</th>
                <th>Running Total (Accumulator)</th>
              </tr>
            </thead>
            <tbody>
              {cumulative.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    {row.lower} – {row.upper}
                  </td>
                  <td>{row.upper}</td>
                  <td>
                    <div
                      className={`ltc10105-frequency c${index}`}
                      role="slider"
                      tabIndex={0}
                      aria-label={`Frequency row ${index + 1}`}
                      aria-valuemin="1"
                      aria-valuemax="99"
                      aria-valuenow={row.frequency}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() =>
                          setDragging({
                            id: row.id,
                            y: event.clientY,
                            frequency: row.frequency,
                          }),
                        );
                      }}
                      onPointerMove={(event) => dragFrequency(event, row)}
                      onPointerUp={() =>
                        dragging && act(() => setDragging(null))
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "ArrowLeft" ||
                          event.key === "ArrowDown"
                        ) {
                          event.preventDefault();
                          act(() => setFrequency(row.id, row.frequency - 1));
                        }
                        if (
                          event.key === "ArrowRight" ||
                          event.key === "ArrowUp"
                        ) {
                          event.preventDefault();
                          act(() => setFrequency(row.id, row.frequency + 1));
                        }
                      }}
                    >
                      ↕ <b>{row.frequency}</b>
                    </div>
                  </td>
                  <td>{row.cumulative}</td>
                  <td>
                    {index === 0
                      ? row.frequency
                      : `${row.previous} + ${row.frequency} = ${row.cumulative}`}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total (N)</td>
                <td>{total}</td>
                <td>{total}</td>
                <td />
              </tr>
            </tfoot>
          </table>
          <footer>
            <Info /> Change any frequency — all later cumulative values update
            automatically.
          </footer>
        </section>
        <section className="ltc10105-bars">
          <header>
            <div>
              <h2>2) LESS-THAN CUMULATIVE FREQUENCY (BAR VIEW)</h2>
              <p>Stacked by class in order of upper class boundaries.</p>
            </div>
            <label>
              Show values{" "}
              <input
                type="checkbox"
                checked={showValues}
                onChange={(event) =>
                  act(() => setShowValues(event.target.checked))
                }
              />
            </label>
          </header>
          <svg
            viewBox="0 0 440 270"
            aria-label="Cumulative frequency bar chart"
          >
            <line x1="40" y1="220" x2="425" y2="220" />
            <line x1="40" y1="35" x2="40" y2="220" />
            {bars.map((bar, index) => (
              <g key={bar.id} className={`c${index}`}>
                <rect x={bar.x} y={bar.y} width="48" height={bar.height} />
                {showValues && (
                  <text x={bar.x + 18} y={bar.y - 6}>
                    {bar.cumulative}
                  </text>
                )}
                <text x={bar.x + 15} y="242">
                  {bar.upper}
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <b>RECURRENCE (RUNNING TOTAL RULE)</b>
            <strong>CFᵢ = CFᵢ₋₁ + fᵢ</strong>
            <span>with CF₀ = 0</span>
          </footer>
        </section>
        <section className="ltc10105-ogive">
          <header>
            <div>
              <h2>3) LESS-THAN OGIVE (STAIRCASE)</h2>
              <p>Monotone staircase using upper class boundaries.</p>
            </div>
            <label>
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(event) =>
                  act(() => setShowPoints(event.target.checked))
                }
              />{" "}
              Show points
            </label>
          </header>
          <svg
            viewBox="0 0 460 270"
            aria-label="Less-than cumulative frequency ogive"
          >
            <g className="grid">
              {[0, 10, 20, 30, 40, 50, 60].map((tick) => (
                <line
                  key={`v${tick}`}
                  x1={40 + (tick / 60) * 390}
                  y1="35"
                  x2={40 + (tick / 60) * 390}
                  y2="220"
                />
              ))}
              {Array.from({ length: maxValue / 5 + 1 }, (_, index) => (
                <line
                  key={`h${index}`}
                  x1="40"
                  y1={220 - ((index * 5) / maxValue) * 180}
                  x2="430"
                  y2={220 - ((index * 5) / maxValue) * 180}
                />
              ))}
            </g>
            <path d={staircase} />
            {showPoints &&
              ogivePoints.map((item, index) => (
                <g key={index}>
                  <circle cx={item.x} cy={item.y} r="4" />
                  <text x={item.x - 7} y={item.y - 8}>
                    {index === 0 ? 0 : cumulative[index - 1].cumulative}
                  </text>
                </g>
              ))}
          </svg>
          <footer>
            <p>
              Join the points (0, 0) and (xᵢ, CFᵢ) in order of upper class
              boundaries.
            </p>
            <p>
              This is the <b>less-than ogive</b> (cumulative frequency curve).
            </p>
          </footer>
        </section>
      </main>
      <aside className="ltc10105-warning">
        <AlertTriangle />
        <div>
          <strong>
            IMPORTANT: Do NOT plot less-than cumulative frequencies against
            lower class boundaries.
          </strong>
          <p>
            Use the upper class boundaries (xᵢ) on the x-axis for less-than
            ogive.
          </p>
        </div>
      </aside>
      <section className="ltc10105-try">
        <h2>Try it:</h2>
        <p>
          <b>1</b> Drag any frequency value in the table.
          <span>Example: change 5 → 8</span>
        </p>
        <p>
          <b>2</b> See the running totals update from that row forward.
        </p>
        <p>
          <b>3</b> Watch the bars and ogive update instantly.
        </p>
        <p>
          <b>4</b> Observe the recurrence CFᵢ=CFᵢ₋₁+fᵢ.
        </p>
        <button onClick={randomize}>
          <Shuffle /> Randomize Frequencies
        </button>
      </section>
      <footer className="ltc10105-footer">
        <div>
          <Sparkles />
          <span>
            <b>Math Universe</b>Interactive math labs, visual proofs, NCERT
            explorations, graphing, CAS-style tools, and classroom-ready
            activities.
          </span>
        </div>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </section>
  );
}
