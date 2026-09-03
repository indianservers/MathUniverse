import { Lightbulb, Play, RotateCcw } from "lucide-react";
import {
  forwardRef,
  type PointerEvent,
  type RefObject,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RangeSpreadTargetLesson10034.css";

const initial = [3, 5, 6, 8, 11];
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const summary = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const minimum = sorted[0],
    maximum = sorted[sorted.length - 1];
  const middle = Math.floor(sorted.length / 2);
  return {
    sorted,
    minimum,
    maximum,
    range: maximum - minimum,
    median:
      sorted.length % 2
        ? sorted[middle]
        : (sorted[middle - 1] + sorted[middle]) / 2,
  };
};

export default function RangeSpreadTargetLesson10034({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [data, setData] = useState(initial);
  const [showOutlier, setShowOutlier] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [whyOpen, setWhyOpen] = useState(false);
  const [challenge, setChallenge] = useState(initial);
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "retry"
  >("idle");
  const [showAnswer, setShowAnswer] = useState(false);
  const [moves, setMoves] = useState(0);
  const [actions, setActions] = useState(0);
  const mainRef = useRef<SVGSVGElement>(null);
  const challengeRef = useRef<SVGSVGElement>(null);
  const current = summary(data);
  const challengeStats = summary(challenge);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const updatePoint = (
    index: number,
    value: number,
    target: "main" | "challenge",
  ) => {
    const normalized = Math.max(0, Math.min(16, Math.round(value)));
    if (target === "main")
      act(() =>
        setData((values) =>
          values.map((item, i) => (i === index ? normalized : item)),
        ),
      );
    else {
      setChallenge((values) =>
        values.map((item, i) => (i === index ? normalized : item)),
      );
      setChallengeResult("idle");
      setMoves((n) => n + 1);
      setActions((n) => n + 1);
    }
  };
  const pointerValue = (
    event: PointerEvent<SVGCircleElement>,
    ref: RefObject<SVGSVGElement | null>,
  ) => {
    if (!ref.current || !event.currentTarget.hasPointerCapture(event.pointerId))
      return null;
    const rect = ref.current.getBoundingClientRect();
    return (((event.clientX - rect.left) / rect.width) * 600 - 45) / (510 / 16);
  };
  const reset = () =>
    act(() => {
      setData(initial);
      setShowOutlier(true);
      setTab("Interact");
      setWhyOpen(false);
      setChallenge(initial);
      setChallengeResult("idle");
      setShowAnswer(false);
      setMoves(0);
    });
  return (
    <section
      className="range10034-page"
      data-testid="school-mockup-0708"
      data-object-model="dedicated-draggable-extremes-range-spread-explorer"
      data-values={current.sorted.join(",")}
      data-min={current.minimum}
      data-max={current.maximum}
      data-range={current.range}
      data-median={current.median}
      data-outlier={showOutlier}
      data-tab={tab}
      data-challenge-values={challengeStats.sorted.join(",")}
      data-challenge-range={challengeStats.range}
      data-challenge-median={challengeStats.median}
      data-challenge-result={challengeResult}
      data-moves={moves}
      data-actions={actions}
    >
      <header className="range10034-hero">
        <small>CLASS 8 · DATA HANDLING</small>
        <h1>Range and Spread Explorer</h1>
        <p>
          Understand how minimum, maximum, and outliers affect the spread of
          data.
        </p>
        <div>
          <span>▣ Class 8</span>
          <span>▦ Mathematics</span>
          <span>▦ Data Handling</span>
          <span>◷ 15–20 min</span>
        </div>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <nav className="range10034-tabs">
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
      <section className="range10034-explorer">
        <header>
          <h2>Explore the spread of data</h2>
          <p>Drag the points or the min/max handles to change the range.</p>
          <div>
            <button
              onClick={() =>
                act(() => setData(showOutlier ? [3, 5, 6, 8, 16] : initial))
              }
            >
              <Play /> Animate
            </button>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </div>
        </header>
        <article>
          <label>
            Show outlier{" "}
            <input
              type="checkbox"
              checked={showOutlier}
              onChange={(e) => act(() => setShowOutlier(e.target.checked))}
            />
          </label>
          <RangeLine
            ref={mainRef}
            values={data}
            outlier={showOutlier ? 16 : null}
            onPoint={(index, event) => {
              const value = pointerValue(event, mainRef);
              if (value !== null) updatePoint(index, value, "main");
            }}
            onNudge={(index, delta) =>
              updatePoint(index, data[index] + delta, "main")
            }
          />
          <div className="range-pill">
            Range = {current.maximum} − {current.minimum} = {current.range}
          </div>
          <section>
            <span>
              Minimum<b>{current.minimum}</b>
            </span>
            <span>
              Maximum<b>{current.maximum}</b>
            </span>
            <span>
              Range<b>{current.range}</b>
            </span>
          </section>
          <aside>
            <b>ⓘ Rule: Range = maximum − minimum</b>
            <p>
              Range uses only the extremes and does not describe the whole
              distribution.
            </p>
            <button onClick={() => act(() => setWhyOpen((value) => !value))}>
              Why?⌄
            </button>
            {whyOpen && (
              <small>
                Moving any interior value without changing either extreme leaves
                the range unchanged.
              </small>
            )}
          </aside>
        </article>
      </section>
      <section className="range10034-summary">
        <article>
          <h2>Your data (sorted)</h2>
          <strong>{current.sorted.join(", ")}</strong>
          <b>n = {data.length}</b>
        </article>
        <article>
          <h2>Quick view</h2>
          <p>
            Minimum <b>{current.minimum}</b>
          </p>
          <p>
            Maximum <b>{current.maximum}</b>
          </p>
          <p>
            Range = Maximum − Minimum{" "}
            <b>
              {current.maximum} − {current.minimum} = {current.range}
            </b>
          </p>
          <p>
            Median <b>{current.median}</b>
          </p>
        </article>
      </section>
      <section className="range10034-theory">
        <article>
          <h2>◉ Why it works</h2>
          <p>
            Range measures the total spread from the smallest to the largest
            value.
          </p>
          <p>
            If an outlier is far away, the range increases a lot, even if the
            rest of the data stays close together.
          </p>
          <MiniSpread />
          <b>Outlier increases the range.</b>
        </article>
        <article>
          <h2>▣ Worked example</h2>
          <p>Find the range of the data:</p>
          <strong>3, 5, 6, 8, 11</strong>
          <p>Minimum = 3</p>
          <p>Maximum = 11</p>
          <p>
            Range = Maximum − Minimum = 11 − 3 = <b>8</b>
          </p>
          <aside>Range = 8</aside>
        </article>
        <article>
          <h2>⚠ Common misconception</h2>
          <p>
            Some students use difference of middle values or the number of data
            points.
          </p>
          <aside className="wrong">
            ✕ Wrong: Range = number of data points (5 − 1 = 4)
          </aside>
          <aside>✓ Correct: Range = maximum − minimum = 11 − 3 = 8</aside>
          <p>Range uses only the extremes.</p>
        </article>
      </section>
      <section className="range10034-challenge">
        <header>
          <h2>◎ Your turn: Mini challenge</h2>
          <p>
            Drag one point to make the range 12 while keeping the median
            unchanged.
          </p>
          <button onClick={() => setShowAnswer(true)}>
            <Lightbulb /> Tips
          </button>
        </header>
        <RangeLine
          ref={challengeRef}
          values={challenge}
          onPoint={(index, event) => {
            const value = pointerValue(event, challengeRef);
            if (value !== null) updatePoint(index, value, "challenge");
          }}
          onNudge={(index, delta) =>
            updatePoint(index, challenge[index] + delta, "challenge")
          }
        />
        <div className="challenge-pill">
          Range = {challengeStats.maximum} − {challengeStats.minimum} ={" "}
          {challengeStats.range}
        </div>
        <aside>
          <h3>Goal</h3>
          <p>Range = 12</p>
          <p>Median stays 6</p>
          <h3>Check</h3>
          <button
            disabled={moves === 0}
            onClick={() => {
              const correct =
                challengeStats.range === 12 && challengeStats.median === 6;
              setChallengeResult(correct ? "correct" : "retry");
              setActions((n) => n + 1);
            }}
          >
            Check answer
          </button>
          <p>Moves: {moves}</p>
        </aside>
        <footer>
          ⓘ <b>Hint:</b>{" "}
          {showAnswer
            ? "Move the maximum from 11 to 15; 15 − 3 = 12 and the median remains 6."
            : "Move only one point. To get range 12 with min at 3, the max must be 15."}
          <button
            onClick={() => {
              setChallenge([3, 5, 6, 8, 15]);
              setMoves((n) => n + 1);
              setChallengeResult("idle");
            }}
          >
            Show answer
          </button>
        </footer>
      </section>
      <nav className="range10034-adjacent">
        <Link to="/lessons/school/class-8/class-8-data-handling-data-balance-lab">
          ← Previous
          <br />
          <b>Data balance lab</b>
        </Link>
        <Link to="/lessons/school/class-8/class-8-data-handling-mean-median-and-mode-practice-path">
          Next →<br />
          <b>Mean, Median and Mode</b>
        </Link>
      </nav>
    </section>
  );
}

type LineProps = {
  values: number[];
  outlier?: number | null;
  onPoint: (index: number, event: PointerEvent<SVGCircleElement>) => void;
  onNudge: (index: number, delta: number) => void;
};
const RangeLine = forwardRef<SVGSVGElement, LineProps>(
  ({ values, outlier = null, onPoint, onNudge }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 600 150"
      aria-label="Draggable data range number line"
    >
      <line className="axis" x1="45" y1="75" x2="555" y2="75" />
      {Array.from({ length: 17 }, (_, value) => {
        const x = 45 + (value / 16) * 510;
        return (
          <g key={value}>
            <line className="tick" x1={x} y1="69" x2={x} y2="81" />
            <text x={x - 3} y="98">
              {value}
            </text>
          </g>
        );
      })}
      {values.map((value, index) => {
        const x = 45 + (value / 16) * 510;
        return (
          <circle
            className={`point p${index}`}
            role="slider"
            aria-label={`Data point ${index + 1}`}
            tabIndex={0}
            key={index}
            cx={x}
            cy={45 - (index % 2) * 10}
            r="6"
            onPointerDown={(e) =>
              e.currentTarget.setPointerCapture(e.pointerId)
            }
            onPointerMove={(e) => onPoint(index, e)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp")
                onNudge(index, 1);
              if (e.key === "ArrowLeft" || e.key === "ArrowDown")
                onNudge(index, -1);
            }}
          />
        );
      })}
      {outlier !== null && (
        <circle
          className="outlier"
          cx={45 + (outlier / 16) * 510}
          cy="45"
          r="7"
        />
      )}
      <text
        className="min-label"
        x={45 + (Math.min(...values) / 16) * 510 - 16}
        y="130"
      >
        Min {Math.min(...values)}
      </text>
      <text
        className="max-label"
        x={45 + (Math.max(...values) / 16) * 510 - 16}
        y="130"
      >
        Max {Math.max(...values)}
      </text>
    </svg>
  ),
);
RangeLine.displayName = "RangeLine";
function MiniSpread() {
  return (
    <svg viewBox="0 0 200 70">
      <line x1="10" y1="43" x2="190" y2="43" />
      <circle cx="35" cy="27" r="5" />
      <circle cx="48" cy="27" r="5" />
      <circle cx="61" cy="27" r="5" />
      <circle cx="84" cy="27" r="5" />
      <circle className="outlier" cx="170" cy="27" r="6" />
      <path d="M35 57H170M35 51v12M170 51v12" />
    </svg>
  );
}
