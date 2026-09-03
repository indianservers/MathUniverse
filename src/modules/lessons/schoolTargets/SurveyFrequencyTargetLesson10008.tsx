import { RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SurveyFrequencyTargetLesson10008.css";
const sports = ["Cricket", "Football", "Badminton", "Basketball", "Tennis"],
  sportIcons = ["🏏", "⚽", "🏸", "🏀", "🎾"],
  initial = [
    "Cricket",
    "Football",
    "Cricket",
    "Badminton",
    "Cricket",
    "Football",
    "Basketball",
    "Cricket",
    "Tennis",
    "Football",
    "Cricket",
    "Badminton",
    "Cricket",
    "Cricket",
    "Football",
    "Basketball",
    "Cricket",
    "Tennis",
    "Cricket",
    "Badminton",
  ],
  fruits = ["Apple", "Banana", "Mango", "Grapes", "Orange"],
  fruitIcons = ["🍎", "🍌", "🥭", "🍇", "🍊"],
  colors = ["#2f7de1", "#21b7a8", "#7553d4", "#f19326", "#82bd3c"];
const tally = (n: number) =>
  Array.from({ length: Math.floor(n / 5) }, () => "||||̸")
    .concat(n % 5 ? "|".repeat(n % 5) : [])
    .join("  ") || "-";
export default function SurveyFrequencyTargetLesson10008({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [responses, setResponses] = useState(initial),
    [custom, setCustom] = useState(""),
    [order, setOrder] = useState(sports),
    [tab, setTab] = useState("Interact"),
    [orientation, setOrientation] = useState("vertical"),
    [showCounts, setShowCounts] = useState(true),
    [practice, setPractice] = useState<string[]>([]),
    [practiceCustom, setPracticeCustom] = useState(""),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    counts = order.map((name) => responses.filter((x) => x === name).length),
    practiceCounts = fruits.map(
      (name) => practice.filter((x) => x === name).length,
    ),
    total = responses.length,
    max = Math.max(...counts, 1),
    idx = schoolLessonCatalog.findIndex((x) => x.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1],
    add = (name: string) =>
      act(() => {
        const clean = name.trim();
        if (clean) {
          setResponses((v) => [...v, clean]);
          setOrder((v) => (v.includes(clean) ? v : [...v, clean]));
        }
      }),
    addPractice = (name: string) =>
      act(() => {
        if (name.trim() && practice.length < 15)
          setPractice((v) => [...v, name.trim()]);
      }),
    sorted = useMemo(() => [...order].sort(), [order]);
  return (
    <section
      className="sf10008-page"
      data-testid="school-mockup-0682"
      data-object-model="dedicated-survey-response-tally-frequency-percentage-and-bar-model"
      data-responses={responses.join("|")}
      data-counts={counts.join(",")}
      data-total={total}
      data-practice-counts={practiceCounts.join(",")}
      data-practice-total={practice.length}
      data-orientation={orientation}
      data-show-counts={showCounts}
      data-actions={actions}
    >
      <header className="sf10008-hero">
        <small>CLASS 6 · DATA HANDLING</small>
        <h1>Survey to Frequency Table</h1>
        <h2>OBJECTIVE</h2>
        <p>
          Convert raw survey responses into a tally chart and frequency table,
          then represent the result.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </dl>
        <Link to="/lessons/school">← School lessons</Link>
        <div className="survey-art">📋</div>
      </header>
      <nav className="sf10008-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (x) => (
            <button
              className={tab === x ? "active" : ""}
              onClick={() => act(() => setTab(x))}
              key={x}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <section className="sf10008-steps">
        {[
          ["1", "Observe", "Raw responses"],
          ["2", "Manipulate", "Tally & table"],
          ["3", "Notice Pattern", "Check & sort"],
          ["4", "Understand Rule", "What it means"],
          ["5", "Try It", "On your own"],
        ].map(([n, a, b]) => (
          <article key={n}>
            <b>{n}</b>
            <span>
              <strong>{a}</strong>
              <small>{b}</small>
            </span>
          </article>
        ))}
      </section>
      <section className="sf10008-main">
        <article className="responses">
          <h2>1 OBSERVE: RAW RESPONSES</h2>
          <p>Record each learner's favourite sport.</p>
          <p>Click a sport or type to add a response.</p>
          <div className="chips">
            {sports.map((x, i) => (
              <button onClick={() => add(x)} key={x}>
                {sportIcons[i]} {x}
              </button>
            ))}
          </div>
          <div className="custom">
            <input
              aria-label="Another sport"
              placeholder="Type another sport..."
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <button
              onClick={() => {
                add(custom);
                setCustom("");
              }}
            >
              Add
            </button>
          </div>
          <header>
            <b>Responses recorded ({total})</b>
            <button onClick={() => act(() => setResponses([]))}>
              Clear all <Trash2 />
            </button>
          </header>
          <div className="response-list">
            {responses.map((x, i) => (
              <button
                onClick={() =>
                  act(() => setResponses((v) => v.filter((_, j) => j !== i)))
                }
                key={`${x}-${i}`}
              >
                {x}
              </button>
            ))}
          </div>
          <aside>
            💡 Tip: Click a sport to add responses. This list is unsorted.
          </aside>
        </article>
        <div className="tables">
          <article>
            <h2>2 MANIPULATE: TALLY CHART</h2>
            <table>
              <thead>
                <tr>
                  <th>Sport</th>
                  <th>Tally Marks</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {order.map((x, i) => (
                  <tr key={x}>
                    <th>{x}</th>
                    <td>{tally(counts[i])}</td>
                    <td>{counts[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer>
              <button
                onClick={() => act(() => setResponses((v) => v.slice(0, -1)))}
              >
                ↶ Undo last
              </button>
              <button onClick={() => act(() => setResponses([]))}>
                <Trash2 />
                Clear tallies
              </button>
              <button
                onClick={() =>
                  act(() => setOrder(order === sorted ? sports : sorted))
                }
              >
                ⇅ Sort (A → Z)
              </button>
            </footer>
          </article>
          <article>
            <h2>3 NOTICE PATTERN: FREQUENCY TABLE</h2>
            <table>
              <thead>
                <tr>
                  <th>Sport</th>
                  <th>Tally</th>
                  <th>Frequency (f)</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {order.map((x, i) => (
                  <tr key={x}>
                    <th>{x}</th>
                    <td>{tally(counts[i])}</td>
                    <td>{counts[i]}</td>
                    <td>
                      {total ? Math.round((counts[i] / total) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <td />
                  <th>{total}</th>
                  <th>{total ? 100 : 0}%</th>
                </tr>
              </tfoot>
            </table>
            <aside>
              Total check: {counts.join(" + ")} = {total} ✓ Correct!
            </aside>
          </article>
          <article className="bar">
            <h2>4 UNDERSTAND RULE: BAR GRAPH PREVIEW</h2>
            <svg viewBox="0 0 500 220" role="img" aria-label="Survey bar graph">
              {order.map((x, i) => {
                const h = (counts[i] / max) * 145;
                return (
                  <g key={x}>
                    <rect
                      x={55 + i * 88}
                      y={175 - h}
                      width="44"
                      height={h}
                      fill={colors[i]}
                    />
                    {showCounts && (
                      <text x={77 + i * 88} y={165 - h}>
                        {counts[i]}
                      </text>
                    )}
                    <text x={77 + i * 88} y="194">
                      {x}
                    </text>
                  </g>
                );
              })}
              <line x1="40" x2="485" y1="175" y2="175" />
            </svg>
            <footer>
              <button
                onClick={() =>
                  act(() =>
                    setOrientation((v) =>
                      v === "vertical" ? "horizontal" : "vertical",
                    ),
                  )
                }
              >
                ▥{" "}
                {orientation === "vertical"
                  ? "Vertical bars"
                  : "Horizontal bars"}
              </button>
              <button onClick={() => act(() => setShowCounts((v) => !v))}>
                ◉ {showCounts ? "Hide counts" : "Show counts"}
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setOrientation("vertical");
                    setShowCounts(true);
                  })
                }
              >
                <RotateCcw />
                Reset graph
              </button>
            </footer>
          </article>
        </div>
      </section>
      <section className="sf10008-practice">
        <h2>5 TRY IT: YOUR TURN</h2>
        <div>
          <article>
            <b>Survey: Favourite Fruit</b>
            <p>Record responses (enter 15)</p>
            <div>
              {fruits.map((x, i) => (
                <button onClick={() => addPractice(x)} key={x}>
                  {fruitIcons[i]} {x}
                </button>
              ))}
            </div>
            <input
              aria-label="Another fruit"
              value={practiceCustom}
              onChange={(e) => setPracticeCustom(e.target.value)}
              placeholder="Type another..."
            />
            <button
              onClick={() => {
                addPractice(practiceCustom);
                setPracticeCustom("");
              }}
            >
              Add
            </button>
            <p>
              <b>Responses ({practice.length} / 15)</b>{" "}
              <button onClick={() => act(() => setPractice([]))}>Clear</button>
            </p>
          </article>
          <article>
            <b>Build your table</b>
            <table>
              <thead>
                <tr>
                  <th>Fruit</th>
                  <th>Tally</th>
                  <th>Frequency (f)</th>
                </tr>
              </thead>
              <tbody>
                {fruits.map((x, i) => (
                  <tr key={x}>
                    <td>{x}</td>
                    <td>{tally(practiceCounts[i])}</td>
                    <td>{practiceCounts[i]}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <td />
                  <th>{practice.length}</th>
                </tr>
              </tfoot>
            </table>
          </article>
          <article>
            <b>Your bar graph</b>
            <svg viewBox="0 0 300 150">
              {practiceCounts.map((n, i) => (
                <rect
                  key={i}
                  x={30 + i * 52}
                  y={120 - n * 7}
                  width="28"
                  height={n * 7}
                  fill={colors[i]}
                />
              ))}
            </svg>
            <p>
              {practice.length
                ? "Keep adding responses until 15."
                : "Add responses to draw your graph."}
            </p>
          </article>
        </div>
      </section>
      <section className="sf10008-bottom">
        <article>
          <h2>⚠ COMMON MISCONCEPTION</h2>
          <h3>Counting the same response twice.</h3>
          <p>Each response should be counted once.</p>
          <p>
            Example: If "Cricket" appears 10 times, write 10 in the frequency
            column, not 20.
          </p>
        </article>
        <article>
          <h2>✓ WORKED EXAMPLE (CORRECT)</h2>
          <p>
            <b>Given raw responses (20):</b>
            <br />
            {initial.join(", ")}
          </p>
          <table>
            <tbody>
              {sports.map((x, i) => (
                <tr key={x}>
                  <td>{x}</td>
                  <td>{tally([10, 5, 3, 2, 2][i])}</td>
                  <td>{[10, 5, 3, 2, 2][i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>
            <b>Conclusion</b>
            <p>Cricket is the most popular sport in this survey.</p>🏆
          </aside>
        </article>
      </section>
      <nav className="sf10008-adjacent">
        <Link to={prev.route}>
          ← Previous lesson<b>{prev.title}</b>
        </Link>
        <Link to={next.route}>
          Next lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
