import { Play, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./UnitRateTargetLesson10016.css";

const contexts = {
  apples: {
    a: "Apples (count)",
    b: "Cost (₹)",
    unit: "apple",
    symbol: "₹",
    defaults: [4, 12],
  },
  rice: {
    a: "Rice (kg)",
    b: "Cost (₹)",
    unit: "kg",
    symbol: "₹",
    defaults: [5, 200],
  },
  distance: {
    a: "Time (hours)",
    b: "Distance (km)",
    unit: "hour",
    symbol: "km",
    defaults: [3, 180],
  },
} as const;
type ContextKey = keyof typeof contexts;
const tidy = (value: number) =>
  Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function UnitRateTargetLesson10016({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [contextKey, setContextKey] = useState<ContextKey>("apples");
  const [a, setA] = useState(4);
  const [b, setB] = useState(12);
  const [rows, setRows] = useState(5);
  const [auto, setAuto] = useState(true);
  const [replays, setReplays] = useState(0);
  const [tab, setTab] = useState("Interact");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [choice, setChoice] = useState("");
  const [grade, setGrade] = useState<boolean | null>(null);
  const [actions, setActions] = useState(0);
  const context = contexts[contextKey];
  const unit = a === 0 ? 0 : b / a;
  const factors = [2, 1.5, 1, 0.5, a ? 1 / a : 0].slice(Math.max(0, 5 - rows));
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (action: () => void) => {
    action();
    setActions((count) => count + 1);
  };
  const chooseContext = (key: ContextKey) =>
    act(() => {
      setContextKey(key);
      setA(contexts[key].defaults[0]);
      setB(contexts[key].defaults[1]);
    });
  const reset = () =>
    act(() => {
      setContextKey("apples");
      setA(4);
      setB(12);
      setRows(5);
      setAuto(true);
      setReplays(0);
      setAnswerA("");
      setAnswerB("");
      setChoice("");
      setGrade(null);
    });
  const check = () =>
    act(() =>
      setGrade(
        Number(answerA) === 8 && Number(answerB) === 7.5 && choice === "B",
      ),
    );
  return (
    <section
      className="ur10016-page"
      data-testid="school-mockup-0690"
      data-object-model="dedicated-linked-unit-rate-table-double-number-line-and-comparison-grading"
      data-values={`${a},${b}`}
      data-unit-rate={tidy(unit)}
      data-rows={rows}
      data-auto={auto}
      data-replays={replays}
      data-challenge-graded={grade === null ? "" : grade}
      data-actions={actions}
    >
      <header className="ur10016-hero">
        <small>CLASS 7 · NUMBERS AND ARITHMETIC</small>
        <h1>Unit Rate Table Lab</h1>
        <p>
          <b>Objective:</b> Find unit rates using a unit-rate table. Compare two
          quantities and decide which is greater.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number</span>
        </dl>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <nav className="ur10016-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="ur10016-manipulate">
        <header>
          <h2>Manipulate: Build a unit-rate table</h2>
          <p>
            Enter any value for one quantity. The table will scale and show the
            unit rate.
          </p>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </header>
        <div className="ur10016-workspace">
          <aside>
            <label>
              Choose the context
              <select
                aria-label="Unit rate context"
                value={contextKey}
                onChange={(event) =>
                  chooseContext(event.target.value as ContextKey)
                }
              >
                {Object.entries(contexts).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value.a} and {value.b}
                  </option>
                ))}
              </select>
            </label>
            <b>● Quantity A</b>
            <p>{context.a}</p>
            <label>
              Enter value for A
              <input
                aria-label="Quantity A"
                type="number"
                value={a}
                onChange={(event) => setA(Number(event.target.value))}
              />
            </label>
            <b>● Quantity B</b>
            <p>{context.b}</p>
            <label>
              Enter value for B
              <input
                aria-label="Quantity B"
                type="number"
                value={b}
                onChange={(event) => setB(Number(event.target.value))}
              />
            </label>
            <button
              onClick={() =>
                act(() => setRows((value) => Math.min(5, value + 1)))
              }
            >
              ＋ Add row
            </button>
            <button
              onClick={() =>
                act(() => setRows((value) => Math.max(2, value - 1)))
              }
            >
              <Trash2 />
            </button>
            <footer>
              Rows in table: {rows}
              <button
                onClick={() =>
                  act(() => setRows((value) => Math.max(2, value - 1)))
                }
              >
                −
              </button>
              <button
                onClick={() =>
                  act(() => setRows((value) => Math.min(5, value + 1)))
                }
              >
                ＋
              </button>
            </footer>
          </aside>
          <article>
            <h3>
              Unit-rate table{" "}
              <small>(Divide by the same factor to reach 1 unit)</small>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>● {context.a}</th>
                  <th>÷ factor</th>
                  <th>● {context.b}</th>
                </tr>
              </thead>
              <tbody>
                {factors.map((factor, i) => (
                  <tr
                    className={
                      factor === 1 / a ? "unit" : factor === 1 ? "start" : ""
                    }
                    key={`${factor}-${i}`}
                  >
                    <td>
                      {factor === 1
                        ? "Start"
                        : factor === 1 / a
                          ? `÷ ${tidy(a)}`
                          : `× ${tidy(factor)}`}
                    </td>
                    <td>{tidy(a * factor)}</td>
                    <td>
                      {factor === 1
                        ? "—"
                        : factor === 1 / a
                          ? `÷ ${tidy(a)}`
                          : `× ${tidy(factor)}`}
                    </td>
                    <td>{tidy(b * factor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <aside>
              <h3>Unit rate (per 1 {context.unit})</h3>
              <strong>
                {context.symbol}
                {tidy(unit)}
              </strong>
              <p>
                {context.b.replace(/ \(.+\)/, "")} per 1 {context.unit} ={" "}
                {context.symbol}
                {tidy(unit)}
              </p>
            </aside>
          </article>
          <article>
            <h3>Rate & comparison</h3>
            <section>
              <p>Unit rate (A → B)</p>
              <strong>
                {context.symbol}
                {tidy(unit)} <small>per {context.unit}</small>
              </strong>
            </section>
            <h3>Compare two quantities</h3>
            <select>
              <option>{context.a}</option>
            </select>
            <select>
              <option>{context.b}</option>
            </select>
            <p>
              = <b>{tidy(unit)}</b> {context.symbol} per {context.unit}
            </p>
            <footer>
              <b>Interpretation</b>
              <p>
                Each {context.unit} corresponds to {context.symbol}
                {tidy(unit)}.
              </p>
            </footer>
          </article>
        </div>
      </section>
      <section className="ur10016-visual">
        <header>
          <h2>Visualize: Double number line (linked quantities)</h2>
          <label>
            Auto-animate to 1
            <input
              type="checkbox"
              checked={auto}
              onChange={() => act(() => setAuto(!auto))}
            />
          </label>
          <button onClick={() => act(() => setReplays((value) => value + 1))}>
            <Play />
            Replay
          </button>
        </header>
        <svg
          viewBox="0 0 700 180"
          role="img"
          aria-label="Linked double number line"
        >
          <text x="8" y="50">
            {context.a}
          </text>
          <text x="8" y="125">
            {context.b}
          </text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
            <g key={value}>
              <line
                x1={95 + value * 62}
                y1="55"
                x2={95 + value * 62}
                y2="120"
              />
              <circle cx={95 + value * 62} cy="55" r="5" />
              <circle cx={95 + value * 62} cy="120" r="5" />
              <text x={95 + value * 62} y="38">
                {value}
              </text>
              <text x={95 + value * 62} y="145">
                {tidy(value * unit)}
              </text>
            </g>
          ))}
          <line x1="95" y1="55" x2="591" y2="55" />
          <line x1="95" y1="120" x2="591" y2="120" />
        </svg>
        <aside>
          <h3>Live readout</h3>
          <p>
            Start: {a} {context.unit}s → {context.symbol}
            {tidy(b)}
          </p>
          <p>
            ÷ {tidy(a)}: 1 {context.unit} → {context.symbol}
            {tidy(unit)} (unit rate)
          </p>
        </aside>
        <footer>
          Both quantities change together. Dividing by {tidy(a)} takes us from{" "}
          {tidy(a)} {context.unit}s & {context.symbol}
          {tidy(b)} to 1 {context.unit} & {context.symbol}
          {tidy(unit)}.
        </footer>
      </section>
      <section className="ur10016-flow">
        <b>Learning flow</b>
        {[
          "Observe",
          "Manipulate",
          "Notice the pattern",
          "Understand the rule",
          "Try independently",
        ].map((item, i) => (
          <span key={item}>
            <i>{i + 1}</i>
            <strong>{item}</strong>
            <small>
              {
                [
                  "See how both quantities change together.",
                  "Change values and scale the table.",
                  "The ratio stays the same.",
                  "Unit rate = Total amount ÷ Number of units.",
                  "Apply to new situations.",
                ][i]
              }
            </small>
          </span>
        ))}
      </section>
      <section className="ur10016-theory">
        <article>
          <h2>Worked Example</h2>
          <p>
            A bag has 5 kg of rice and costs ₹200. What is the cost per 1 kg?
          </p>
          <table>
            <tbody>
              <tr>
                <td>×2</td>
                <td>10</td>
                <td>400</td>
              </tr>
              <tr>
                <td>Start</td>
                <td>5</td>
                <td>200</td>
              </tr>
              <tr>
                <td>÷5</td>
                <td>1</td>
                <td>40</td>
              </tr>
            </tbody>
          </table>
          <strong>Unit rate (per 1 kg) = ₹40</strong>
        </article>
        <article>
          <h2>Key Rule</h2>
          <h3>Definition</h3>
          <p>Unit rate is the value of one unit in a ratio.</p>
          <h3>Formula</h3>
          <strong>Unit rate = Total amount ÷ Number of units</strong>
          <h3>For comparison</h3>
          <p>
            Compare unit rates. The greater unit rate corresponds to the greater
            amount per unit.
          </p>
        </article>
        <article>
          <h2>⚠ Common Mistake</h2>
          <p>Dividing the total amount by the unit rate.</p>
          <p className="wrong">Incorrect: 12 ÷ 3 = 4 apples ✕</p>
          <p className="right">Correct: 12 ÷ 4 = 3 ₹ per apple ✓</p>
          <b>Why it's wrong</b>
          <p>The unit rate tells how much of B corresponds to 1 unit of A.</p>
        </article>
      </section>
      <section className="ur10016-challenge">
        <article>
          <h2>Challenge</h2>
          <p>
            A notebook costs ₹48 for 6 notebooks. Find the unit price and decide
            which option is better.
          </p>
          <div>
            <b>
              Option A<br />6 notebooks for ₹48
            </b>
            <b>
              Option B<br />
              10 notebooks for ₹75
            </b>
          </div>
        </article>
        <article>
          <h3>Your turn</h3>
          <label>
            Unit price A ={" "}
            <input
              aria-label="Unit price A"
              value={answerA}
              onChange={(event) => setAnswerA(event.target.value)}
            />{" "}
            ₹ per notebook
          </label>
          <label>
            Unit price B ={" "}
            <input
              aria-label="Unit price B"
              value={answerB}
              onChange={(event) => setAnswerB(event.target.value)}
            />{" "}
            ₹ per notebook
          </label>
        </article>
        <article>
          <p>Which option is better?</p>
          {["A", "B", "same"].map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="better"
                checked={choice === item}
                onChange={() => setChoice(item)}
              />
              Option {item}
            </label>
          ))}
          <button onClick={check}>Check answer</button>
          {grade !== null && (
            <output>
              {grade
                ? "Correct: Option B costs ₹7.50 each."
                : "Compare ₹8 with ₹7.50 per notebook."}
            </output>
          )}
        </article>
      </section>
      <nav className="ur10016-adjacent">
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
