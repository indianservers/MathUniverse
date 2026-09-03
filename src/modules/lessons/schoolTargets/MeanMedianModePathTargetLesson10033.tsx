import {
  Check,
  GripVertical,
  Lightbulb,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MeanMedianModePathTargetLesson10033.css";

const source = [5, 3, 7, 2, 3];
const target = [2, 3, 3, 5, 7];
const tabs = ["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"];
type Answers = { mean: string; median: string; mode: string };

function stats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((total, value) => total + value, 0);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  const counts = new Map<number, number>();
  sorted.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  const max = Math.max(...counts.values());
  const mode = [...counts.entries()]
    .filter(([, count]) => count === max)
    .map(([value]) => value);
  return { sorted, sum, mean: sum / values.length, median, mode };
}

export default function MeanMedianModePathTargetLesson10033({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [ordered, setOrdered] = useState(target);
  const [dragged, setDragged] = useState<number | null>(null);
  const [tab, setTab] = useState("INTERACT");
  const [step, setStep] = useState(1);
  const [answers1, setAnswers1] = useState<Answers>({
    mean: "",
    median: "",
    mode: "",
  });
  const [answers2, setAnswers2] = useState<Answers>({
    mean: "",
    median: "",
    mode: "",
  });
  const [choice, setChoice] = useState("");
  const [reason, setReason] = useState("");
  const [results, setResults] = useState(["idle", "idle", "idle"] as Array<
    "idle" | "correct" | "retry"
  >);
  const [actions, setActions] = useState(0);
  const calculated = useMemo(() => stats(ordered), [ordered]);
  const correctOrder = ordered.every((value, index) => value === target[index]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const move = (from: number, to: number) =>
    act(() =>
      setOrdered((current) => {
        const next = [...current];
        const [value] = next.splice(from, 1);
        next.splice(to, 0, value);
        return next;
      }),
    );
  const resetStation = () =>
    act(() => {
      setOrdered(source);
      setStep(1);
    });
  const resetAll = () =>
    act(() => {
      setOrdered(target);
      setTab("INTERACT");
      setStep(1);
      setAnswers1({ mean: "", median: "", mode: "" });
      setAnswers2({ mean: "", median: "", mode: "" });
      setChoice("");
      setReason("");
      setResults(["idle", "idle", "idle"]);
    });
  const grade = (station: number) => {
    const correct =
      station === 0
        ? Number(answers1.mean) === 3 &&
          Number(answers1.median) === 2 &&
          Number(answers1.mode) === 2
        : station === 1
          ? Math.abs(Number(answers2.mean) - 5.33) < 0.02 &&
            Number(answers2.median) === 4 &&
            Number(answers2.mode) === 4
          : choice === "Mode" && reason.trim().length >= 8;
    setResults((current) =>
      current.map((value, index) =>
        index === station ? (correct ? "correct" : "retry") : value,
      ),
    );
    setActions((n) => n + 1);
  };
  return (
    <section
      className="mmm10033-page"
      data-testid="school-mockup-0707"
      data-object-model="dedicated-ordering-central-tendency-practice-path"
      data-order={ordered.join(",")}
      data-correct-order={correctOrder}
      data-sum={calculated.sum}
      data-mean={calculated.mean.toFixed(2)}
      data-median={calculated.median}
      data-mode={calculated.mode.join(",")}
      data-step={step}
      data-tab={tab}
      data-results={results.join(",")}
      data-actions={actions}
    >
      <header className="mmm10033-hero">
        <small>CLASS 8 · DATA HANDLING</small>
        <h1>Mean, Median and Mode Practice Path</h1>
        <p>
          Choose and compute the most appropriate measure of central tendency
          for a data set.
        </p>
        <div>
          <span>20 min</span>
          <span>FOUNDATION</span>
          <span>PRACTICE PATH</span>
          <span>statistics</span>
        </div>
        <Link to="/lessons/school" onClick={resetAll}>
          ← Back to School lessons
        </Link>
      </header>
      <nav className="mmm10033-tabs">
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
      <section className="mmm10033-station">
        <header>
          <h2>
            <b>Step {step} of 4</b> Arrange the data
          </h2>
          <p>Drag the number chips to arrange the data in order (ascending).</p>
          <button onClick={resetStation}>
            <RotateCcw /> Reset station
          </button>
        </header>
        <div className="chips">
          {source.map((value, index) => (
            <button
              draggable
              key={`${value}-${index}`}
              onDragStart={() => setDragged(index)}
              onClick={() => move(ordered.indexOf(value), index)}
            >
              <GripVertical />
              {value}
            </button>
          ))}
        </div>
        <div className="mmm10033-ordered">
          <b>Ordered data</b>
          <div>
            {ordered.map((value, index) => (
              <button
                draggable
                key={`${value}-${index}`}
                onDragStart={() => setDragged(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragged !== null) move(dragged, index);
                  setDragged(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft" && index > 0)
                    move(index, index - 1);
                  if (e.key === "ArrowRight" && index < ordered.length - 1)
                    move(index, index + 1);
                }}
              >
                {value}
                <small>{index + 1}</small>
              </button>
            ))}
          </div>
          <strong className={correctOrder ? "correct" : "retry"}>
            {correctOrder ? "✓ Correct order!" : "Keep arranging"}
          </strong>
        </div>
        <section className="mmm10033-measures">
          <article>
            <h2>
              MEAN <small>(Balance Point)</small>
            </h2>
            <p>The balance point shows the mean.</p>
            <MeanVisual values={ordered} mean={calculated.mean} />
            <h3>Mean = {format(calculated.mean)}</h3>
            <aside>
              <b>Check math</b>
              <p>
                Sum = {ordered.join(" + ")} = {calculated.sum}
              </p>
              <p>Count = {ordered.length}</p>
              <p>
                Mean = Sum ÷ Count = {calculated.sum} ÷ {ordered.length} ={" "}
                {format(calculated.mean)}
              </p>
            </aside>
          </article>
          <article>
            <h2>
              MEDIAN <small>(Middle Value)</small>
            </h2>
            <p>The median is the middle value.</p>
            <div className="median-row">
              {calculated.sorted.map((value, index) => (
                <span
                  className={
                    index === Math.floor(calculated.sorted.length / 2)
                      ? "middle"
                      : ""
                  }
                  key={`${value}-${index}`}
                >
                  {value}
                </span>
              ))}
            </div>
            <b>
              ↑<small>Middle position</small>
            </b>
            <h3>Median = {format(calculated.median)}</h3>
            <aside>
              With {ordered.length} values (odd count), the{" "}
              {Math.floor(ordered.length / 2) + 1}rd value is the median.
            </aside>
          </article>
          <article>
            <h2>
              MODE <small>(Most Frequent)</small>
            </h2>
            <p>The mode is the most frequent value.</p>
            <ModeVisual values={ordered} />
            <h3>Mode = {calculated.mode.join(", ")}</h3>
            <aside>
              The value {calculated.mode.join(", ")} appears most often.
            </aside>
          </article>
        </section>
        <footer>
          <strong>
            <Trophy /> Great! You found: Mean = {format(calculated.mean)},
            Median = {format(calculated.median)}, Mode ={" "}
            {calculated.mode.join(", ")}
          </strong>
          <button onClick={() => act(() => setStep(Math.min(4, step + 1)))}>
            All set! Go to Step {Math.min(4, step + 1)} →
          </button>
        </footer>
      </section>
      <section className="mmm10033-next">
        <b>Why these results?</b>
        <p>You can now explore what each measure tells us about the data.</p>
        <strong>
          Next up: <span>2</span> Explore each measure →
        </strong>
      </section>
      <section className="mmm10033-theory">
        <article>
          <h2>
            <Lightbulb /> WHY IT WORKS
          </h2>
          <p>These measures summarize data in different ways.</p>
          <p>• Mean uses all values and shows the balance point.</p>
          <p>• Median is resistant to extreme values and shows the middle.</p>
          <p>• Mode identifies the most common value.</p>
        </article>
        <article>
          <h2>◉ WORKED EXAMPLE</h2>
          <p>For the data set 2, 3, 3, 5, 7:</p>
          <p>Mean = (2 + 3 + 3 + 5 + 7) ÷ 5 = 4</p>
          <p>Median = 3 (middle value)</p>
          <p>Mode = 3 (most frequent)</p>
          <p>So, Mean = 4, Median = 3, Mode = 3.</p>
        </article>
        <article>
          <h2>⚠ MISCONCEPTION WARNING</h2>
          <b>
            Finding the median before ordering the data gives the wrong result.
          </b>
          <p>Unordered: 5, 3, 7, 2, 3</p>
          <p>Picking the middle value = 7 ✕</p>
          <p>
            <b>Correct approach:</b> Order first → 2, 3, 3, 5, 7. Then take the
            middle → 3 ✓
          </p>
        </article>
      </section>
      <section className="mmm10033-challenge">
        <header>
          <h2>MINI CHALLENGE</h2>
          <span>Solve all 3 stations</span>
        </header>
        <Station
          number={1}
          title="Station 1"
          data="1, 2, 2, 4, 6"
          answers={answers1}
          setAnswers={setAnswers1}
          result={results[0]}
          onCheck={() => grade(0)}
        />
        <Station
          number={2}
          title="Station 2"
          data="2, 4, 4, 4, 8, 10"
          answers={answers2}
          setAnswers={setAnswers2}
          result={results[1]}
          onCheck={() => grade(1)}
        />
        <article className="reason">
          <h3>
            <i>3</i> Station 3 (Reasoning)
          </h3>
          <p>Which measure best represents this data and why?</p>
          <b>Data: 2, 2, 2, 2, 2, 20</b>
          <div>
            {["Mean", "Median", "Mode"].map((name) => (
              <label key={name}>
                <input
                  type="radio"
                  name="measure"
                  value={name}
                  checked={choice === name}
                  onChange={(e) => {
                    setChoice(e.target.value);
                    setResults((r) => r.map((v, i) => (i === 2 ? "idle" : v)));
                  }}
                />
                {name}
              </label>
            ))}
          </div>
          <textarea
            aria-label="Explain your choice"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type your explanation here..."
          />
          <button className={results[2]} onClick={() => grade(2)}>
            <Check /> Check
          </button>
        </article>
      </section>
      <nav className="mmm10033-adjacent">
        <Link to="/lessons/school/class-8/class-8-data-handling-data-balance-lab">
          ← Previous: Data balance lab
        </Link>
        <Link to="/lessons/school/class-8/class-8-data-handling-explore-each-measure">
          Next: Explore each measure →
        </Link>
      </nav>
    </section>
  );
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
function MeanVisual({ values, mean }: { values: number[]; mean: number }) {
  return (
    <svg viewBox="0 0 250 105">
      <line x1="10" y1="50" x2="240" y2="50" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line x1={10 + i * 28.75} y1="43" x2={10 + i * 28.75} y2="57" />
          <text x={7 + i * 28.75} y="72">
            {i}
          </text>
        </g>
      ))}
      <path d={`M${10 + mean * 28.75} 54l-16 38h32z`} />
      <circle cx={10 + mean * 28.75} cy="25" r="8" />
      <line x1={10 + mean * 28.75} y1="33" x2={10 + mean * 28.75} y2="54" />
      {values.map((value, index) => (
        <circle
          className="value"
          key={index}
          cx={10 + value * 28.75}
          cy={15 - index * 2}
          r="2"
        />
      ))}
    </svg>
  );
}
function ModeVisual({ values }: { values: number[] }) {
  const counts = [...new Set(values)]
    .sort((a, b) => a - b)
    .map((value) => ({
      value,
      count: values.filter((v) => v === value).length,
    }));
  return (
    <svg viewBox="0 0 220 110">
      <line x1="15" y1="90" x2="205" y2="90" />
      {counts.map(({ value, count }, index) => (
        <g key={value}>
          {Array.from({ length: count }, (_, i) => (
            <rect
              className={
                count === Math.max(...counts.map((c) => c.count)) ? "mode" : ""
              }
              key={i}
              x={35 + index * 48}
              y={82 - i * 17}
              width="16"
              height="14"
              rx="3"
            />
          ))}
          <text x={39 + index * 48} y="105">
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
}
function Station({
  number,
  title,
  data,
  answers,
  setAnswers,
  result,
  onCheck,
}: {
  number: number;
  title: string;
  data: string;
  answers: Answers;
  setAnswers: (value: Answers) => void;
  result: string;
  onCheck: () => void;
}) {
  return (
    <article>
      <h3>
        <i>{number}</i>
        {title}
      </h3>
      <p>Find mean, median and mode.</p>
      <b>Data: {data}</b>
      {(["mean", "median", "mode"] as const).map((key) => (
        <label key={key}>
          {key[0].toUpperCase() + key.slice(1)} ={" "}
          <input
            aria-label={`${title} ${key}`}
            value={answers[key]}
            onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
            placeholder="?"
          />
        </label>
      ))}
      <button className={result} onClick={onCheck}>
        <Check /> Check
      </button>
    </article>
  );
}
