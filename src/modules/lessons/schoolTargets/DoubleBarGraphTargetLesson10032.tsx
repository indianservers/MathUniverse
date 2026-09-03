import { Check, Expand, Pencil, RotateCcw, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DoubleBarGraphTargetLesson10032.css";

type Row = { day: string; boys: number; girls: number };
const initialRows: Row[] = [
  { day: "Mon", boys: 12, girls: 9 },
  { day: "Tue", boys: 15, girls: 12 },
  { day: "Wed", boys: 10, girls: 14 },
  { day: "Thu", boys: 18, girls: 16 },
  { day: "Fri", boys: 14, girls: 11 },
];
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

export default function DoubleBarGraphTargetLesson10032({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState(initialRows);
  const [scale, setScale] = useState(20);
  const [selected, setSelected] = useState(2);
  const [boysVisible, setBoysVisible] = useState(true);
  const [girlsVisible, setGirlsVisible] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [fullscreen, setFullscreen] = useState(false);
  const [challengeRow, setChallengeRow] = useState(4);
  const [challengeSeries, setChallengeSeries] = useState<"boys" | "girls">(
    "boys",
  );
  const [challengeValue, setChallengeValue] = useState(20);
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "retry"
  >("correct");
  const [actions, setActions] = useState(0);
  const totals = useMemo(
    () => ({
      boys: rows.reduce((sum, row) => sum + row.boys, 0),
      girls: rows.reduce((sum, row) => sum + row.girls, 0),
    }),
    [rows],
  );
  const differences = rows.map((row) => row.boys - row.girls);
  const greatest = Math.max(...differences.map(Math.abs));
  const greatestIndex = differences.findIndex(
    (value) => Math.abs(value) === greatest,
  );
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const updateCell = (index: number, key: "boys" | "girls", value: number) =>
    act(() => {
      setRows((current) =>
        current.map((row, i) =>
          i === index
            ? { ...row, [key]: Math.max(0, Math.min(30, value)) }
            : row,
        ),
      );
      setChallengeResult("idle");
    });
  const reset = () =>
    act(() => {
      setRows(initialRows);
      setScale(20);
      setSelected(2);
      setBoysVisible(true);
      setGirlsVisible(true);
      setTab("Interact");
      setFullscreen(false);
      setChallengeRow(4);
      setChallengeSeries("boys");
      setChallengeValue(20);
      setChallengeResult("correct");
    });
  const checkChallenge = () => {
    const candidate = rows.map((row) => ({ ...row }));
    candidate[challengeRow][challengeSeries] = challengeValue;
    const candidateDifferences = candidate.map((row) =>
      Math.abs(row.boys - row.girls),
    );
    const correct =
      challengeRow === 4 &&
      candidateDifferences[4] === Math.max(...candidateDifferences);
    setChallengeResult(correct ? "correct" : "retry");
    setActions((n) => n + 1);
  };
  return (
    <section
      className={`dbg10032-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="school-mockup-0706"
      data-object-model="dedicated-editable-paired-series-double-bar-comparison"
      data-boys-total={totals.boys}
      data-girls-total={totals.girls}
      data-selected={rows[selected].day}
      data-difference={differences[selected]}
      data-scale={scale}
      data-boys-visible={boysVisible}
      data-girls-visible={girlsVisible}
      data-tab={tab}
      data-challenge-result={challengeResult}
      data-actions={actions}
    >
      <header className="dbg10032-hero">
        <small>CLASS 8 · DATA HANDLING</small>
        <h1>Double Bar Graph Comparison ♧</h1>
        <p>
          Compare two related data series category by category using a double
          bar graph.
        </p>
        <dl>
          <div>
            <dt>Grade</dt>
            <dd>Class 8</dd>
          </div>
          <div>
            <dt>Topic</dt>
            <dd>Data Handling</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>18 min</dd>
          </div>
        </dl>
      </header>
      <nav className="dbg10032-tabs">
        {tabs.map((name) => (
          <button
            className={tab === name ? "active" : ""}
            key={name}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="dbg10032-model">
        <header>
          <h2>INTERACTIVE MODEL</h2>
          <p>
            <b>Edit the table.</b> The double bar graph updates automatically.
          </p>
          <div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={() => act(() => setFullscreen((value) => !value))}>
              <Expand /> {fullscreen ? "Exit fullscreen" : "Fullscreen"}
            </button>
          </div>
        </header>
        <article className="dbg10032-table">
          <h3>
            EDITABLE DATA TABLE <Pencil />
          </h3>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Boys (visits)</th>
                <th>Girls (visits)</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  className={selected === index ? "selected" : ""}
                  key={row.day}
                  onClick={() => act(() => setSelected(index))}
                >
                  <th>{row.day}</th>
                  <td>
                    <input
                      aria-label={`${row.day} boys visits`}
                      type="number"
                      min="0"
                      max="30"
                      value={row.boys}
                      onChange={(e) =>
                        updateCell(index, "boys", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`${row.day} girls visits`}
                      type="number"
                      min="0"
                      max="30"
                      value={row.girls}
                      onChange={(e) =>
                        updateCell(index, "girls", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>{Math.abs(row.boys - row.girls)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th>{totals.boys}</th>
                <th>{totals.girls}</th>
                <th>{Math.abs(totals.boys - totals.girls)}</th>
              </tr>
            </tfoot>
          </table>
          <p>All values are non-negative integers.</p>
          <hr />
          <h3>CONTROLS</h3>
          <label>
            Common scale (visits) <b>Max = {scale}</b>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={scale}
              onChange={(e) => act(() => setScale(Number(e.target.value)))}
            />
          </label>
          <label>
            Categories
            <select>
              <option>Day (Mon–Fri)</option>
            </select>
          </label>
          <h4>Series</h4>
          <div>
            <label>
              <input
                type="checkbox"
                checked={boysVisible}
                onChange={(e) => act(() => setBoysVisible(e.target.checked))}
              />{" "}
              Boys (visits)
            </label>
            <label>
              <input
                type="checkbox"
                checked={girlsVisible}
                onChange={(e) => act(() => setGirlsVisible(e.target.checked))}
              />{" "}
              Girls (visits)
            </label>
          </div>
          <aside>
            ⓘ Rule: Use one common scale for both series. The gap between paired
            bars shows the difference.
          </aside>
        </article>
        <article className="dbg10032-chart">
          <h3>DOUBLE BAR GRAPH</h3>
          <p>Hover over bars to see values and differences.</p>
          <BarChart
            rows={rows}
            scale={scale}
            boysVisible={boysVisible}
            girlsVisible={girlsVisible}
            selected={selected}
            onSelect={(index) => act(() => setSelected(index))}
          />
          <div className="legend">
            <span>■ Boys (visits)</span>
            <span>■ Girls (visits)</span>
          </div>
          <aside>
            <h3>{rows[selected].day}</h3>
            <p>
              Boys (visits): <b>{rows[selected].boys}</b> | Girls (visits):{" "}
              <b>{rows[selected].girls}</b> | Difference:{" "}
              <b>{Math.abs(differences[selected])}</b>
            </p>
          </aside>
        </article>
      </section>
      <section className="dbg10032-why">
        <h2>◉ WHY IT WORKS</h2>
        <article>
          <MiniBars kind="scale" />
          <b>Same scale</b>
          <p>
            Both series use the same vertical scale, so heights are directly
            comparable.
          </p>
        </article>
        <article>
          <MiniBars kind="pair" />
          <b>Paired bars</b>
          <p>Bars for the same category stand side by side.</p>
        </article>
        <article>
          <MiniBars kind="gap" />
          <b>Gap shows difference</b>
          <p>The vertical gap equals the difference in values.</p>
        </article>
      </section>
      <section className="dbg10032-lower">
        <article>
          <h2>▣ WORKED EXAMPLE</h2>
          <p>Library visits recorded over five days by boys and girls.</p>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Boys</th>
                <th>Girls</th>
                <th>Difference (B − G)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.day}>
                  <th>{row.day}</th>
                  <td>{row.boys}</td>
                  <td>{row.girls}</td>
                  <td>{row.boys - row.girls}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <strong>
            <Star /> Greatest difference: {greatest} visits on{" "}
            {rows[greatestIndex].day}.
          </strong>
        </article>
        <article>
          <h2>⚠ MISCONCEPTION WARNING</h2>
          <p>
            Using different scales for the two series creates a false
            comparison.
          </p>
          <b>Incorrect (different scales)</b>
          <ScaleExample different />
          <b>Correct (same scale)</b>
          <ScaleExample />
        </article>
        <article>
          <h2>☆ MINI CHALLENGE</h2>
          <p>
            Change ONE value in the table to make the difference greatest on
            Friday.
          </p>
          <div>
            <label>
              Row:
              <select
                value={challengeRow}
                onChange={(e) => {
                  setChallengeRow(Number(e.target.value));
                  setChallengeResult("idle");
                }}
              >
                {rows.map((row, i) => (
                  <option value={i} key={row.day}>
                    {row.day}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Series:
              <select
                value={challengeSeries}
                onChange={(e) => {
                  setChallengeSeries(e.target.value as "boys" | "girls");
                  setChallengeResult("idle");
                }}
              >
                <option value="boys">Boys (visits)</option>
                <option value="girls">Girls (visits)</option>
              </select>
            </label>
            <label>
              New value:
              <input
                type="number"
                value={challengeValue}
                onChange={(e) => {
                  setChallengeValue(Number(e.target.value));
                  setChallengeResult("idle");
                }}
              />
            </label>
            <button onClick={checkChallenge}>
              <Check /> Check
            </button>
          </div>
          <aside className={challengeResult}>
            <b>
              {challengeResult === "correct"
                ? "Correct! 🎉"
                : challengeResult === "retry"
                  ? "Try another one-value change."
                  : "Ready to check."}
            </b>
            <p>
              Friday’s proposed difference is{" "}
              {Math.abs(
                (challengeSeries === "boys" ? challengeValue : rows[4].boys) -
                  (challengeSeries === "girls"
                    ? challengeValue
                    : rows[4].girls),
              )}{" "}
              visits.
            </p>
          </aside>
        </article>
      </section>
      <nav className="dbg10032-adjacent">
        <Link to="/lessons/school/class-8/class-8-data-handling-mean-median-and-mode-practice-path">
          ← Previous Lesson
          <br />
          <b>Mean Median and Mode</b>
        </Link>
        <Link to="/lessons/school/class-8/class-8-data-handling-projects">
          Next Lesson →<br />
          <b>Data Handling Projects</b>
        </Link>
      </nav>
    </section>
  );
}

function BarChart({
  rows,
  scale,
  boysVisible,
  girlsVisible,
  selected,
  onSelect,
}: {
  rows: Row[];
  scale: number;
  boysVisible: boolean;
  girlsVisible: boolean;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const left = 55,
    top = 35,
    bottom = 330,
    chartHeight = bottom - top;
  return (
    <svg viewBox="0 0 600 390" aria-label="Double bar graph of library visits">
      {[0, 5, 10, 15, 20, 25, 30]
        .filter((v) => v <= scale)
        .map((v) => {
          const y = bottom - (v / scale) * chartHeight;
          return (
            <g key={v}>
              <line className="grid" x1={left} y1={y} x2="580" y2={y} />
              <text x="28" y={y + 4}>
                {v}
              </text>
            </g>
          );
        })}
      <line className="axis" x1={left} y1={top} x2={left} y2={bottom} />
      <line className="axis" x1={left} y1={bottom} x2="580" y2={bottom} />
      {rows.map((row, index) => {
        const x = 88 + index * 99,
          bh = (row.boys / scale) * chartHeight,
          gh = (row.girls / scale) * chartHeight;
        return (
          <g
            className={selected === index ? "selected" : ""}
            key={row.day}
            onClick={() => onSelect(index)}
          >
            {boysVisible && (
              <>
                <rect
                  className="boys"
                  tabIndex={0}
                  role="button"
                  aria-label={`${row.day} boys ${row.boys}`}
                  x={x}
                  y={bottom - bh}
                  width="27"
                  height={bh}
                />
                <text x={x + 6} y={bottom - bh - 8}>
                  {row.boys}
                </text>
              </>
            )}
            {girlsVisible && (
              <>
                <rect
                  className="girls"
                  tabIndex={0}
                  role="button"
                  aria-label={`${row.day} girls ${row.girls}`}
                  x={x + 31}
                  y={bottom - gh}
                  width="27"
                  height={gh}
                />
                <text x={x + 38} y={bottom - gh - 8}>
                  {row.girls}
                </text>
              </>
            )}
            <text x={x + 14} y="352">
              {row.day}
            </text>
            <text
              className="delta"
              x={x + 24}
              y={Math.min(bottom - bh, bottom - gh) - 28}
            >
              Δ {Math.abs(row.boys - row.girls)}
            </text>
          </g>
        );
      })}
      <text x="296" y="380">
        Day
      </text>
      <text x="5" y="18">
        Visits
      </text>
    </svg>
  );
}
function MiniBars({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 80 60">
      <line x1="8" y1="52" x2="73" y2="52" />
      <rect x="22" y="20" width="13" height="32" />
      <rect
        className="girl"
        x="40"
        y={kind === "gap" ? 30 : 16}
        width="13"
        height={kind === "gap" ? 22 : 36}
      />
    </svg>
  );
}
function ScaleExample({ different = false }: { different?: boolean }) {
  return (
    <svg viewBox="0 0 180 90">
      <line x1="12" y1="76" x2="75" y2="76" />
      <line x1="102" y1="76" x2="165" y2="76" />
      <rect x="35" y="28" width="25" height="48" />
      <rect
        className="girl"
        x="124"
        y={different ? 45 : 28}
        width="25"
        height={different ? 31 : 48}
      />
      <text x="14" y="18">
        Boys (0–20)
      </text>
      <text x="103" y="18">
        Girls (0–{different ? "40" : "20"})
      </text>
    </svg>
  );
}
