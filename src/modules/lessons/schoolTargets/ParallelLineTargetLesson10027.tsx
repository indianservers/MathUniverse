import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelLineTargetLesson10027.css";

const constructionSteps = [
  "Draw given line & point",
  "Make arc at point P",
  "Make arc at point A",
  "Copy angle at P",
  "Draw parallel through P",
];
const challengeChecks = [
  "Arcs of same radius used",
  "Angle copied correctly",
  "Line drawn through Q",
  "Parallel confirmed",
];

export default function ParallelLineTargetLesson10027({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [stage, setStage] = useState(4);
  const [tool, setTool] = useState("Pointer");
  const [grid, setGrid] = useState(true);
  const [transversal, setTransversal] = useState(true);
  const [labels, setLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [checks, setChecks] = useState([false, false, false, false]);
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "incomplete"
  >("idle");
  const [hint, setHint] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState(0);
  const [actions, setActions] = useState(0);
  const angle = 74;
  const progress = stage === 5 ? 100 : 0;
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setStage(1);
      setTool("Pointer");
      setGrid(true);
      setTransversal(true);
      setLabels(true);
      setZoom(1);
    });
  const animate = () =>
    act(() => setStage((value) => (value === 5 ? 1 : value + 1)));
  const resetChallenge = () => {
    setChecks([false, false, false, false]);
    setChallengeResult("idle");
    setHint(false);
    setActions((n) => n + 1);
  };
  const checkChallenge = () => {
    setChallengeResult(checks.every(Boolean) ? "correct" : "incomplete");
    setActions((n) => n + 1);
  };
  return (
    <section
      className="pl10027-page"
      data-testid="school-mockup-0701"
      data-object-model="dedicated-corresponding-angle-copy-transversal-parallel-line-construction"
      data-stage={stage}
      data-progress={progress}
      data-tool={tool}
      data-grid={grid}
      data-transversal={transversal}
      data-labels={labels}
      data-zoom={zoom.toFixed(1)}
      data-angle={angle}
      data-parallel={stage >= 4}
      data-tab={tab}
      data-challenge={challengeResult}
      data-quick-answer={quickAnswer}
      data-actions={actions}
    >
      <header className="pl10027-hero">
        <small>CLASS 7 · PRACTICAL GEOMETRY</small>
        <h1>Parallel Line Construction</h1>
        <p>
          Construct a line through a point that is parallel to a given line
          using the copy of a corresponding angle.
        </p>
        <div>
          <span>◷ 24 min</span>
          <span>▣ Class 7</span>
          <span>♧ Geometry</span>
          <span>▥ Level: Foundation</span>
        </div>
        <aside>
          <small>Lesson progress</small>
          <b>{progress}%</b>
        </aside>
      </header>
      <nav className="pl10027-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={tab === item ? "active" : ""}
              aria-pressed={tab === item}
              onClick={() => act(() => setTab(item))}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="pl10027-lab">
        <aside className="pl10027-steps">
          <h2>CONSTRUCTION STEPS</h2>
          {constructionSteps.map((label, index) => {
            const n = index + 1;
            return (
              <button
                className={n === stage ? "active" : n < stage ? "done" : ""}
                onClick={() => act(() => setStage(n))}
                key={label}
              >
                <i>{n}</i>
                <span>
                  <b>{label}</b>
                  {n === 4 && (
                    <small>Make arc from P cutting first arc at D.</small>
                  )}
                  {n === 5 && <small>Draw line through P and D.</small>}
                </span>
                {n < stage && <Check />}
              </button>
            );
          })}
          <h2>TOOLS</h2>
          <div>
            {["Pointer", "Line", "Compass", "Arc", "Transversal", "Erase"].map(
              (item, index) => (
                <button
                  className={tool === item ? "active" : ""}
                  aria-label={item}
                  onClick={() => act(() => setTool(item))}
                  key={item}
                >
                  <i>{["↖", "╱", "♧", "◠", "⌁", "⌫"][index]}</i>
                  {item}
                </button>
              ),
            )}
          </div>
          <button className="reset" onClick={reset}>
            <RotateCcw />
            Reset All
          </button>
        </aside>
        <article className="pl10027-work">
          <header>
            <div>
              <button
                className={grid ? "on" : ""}
                onClick={() => act(() => setGrid(!grid))}
              >
                ▦ Grid
              </button>
              <button
                className={transversal ? "on purple" : ""}
                onClick={() => act(() => setTransversal(!transversal))}
              >
                ⌗ Transversal
              </button>
              <button
                className={labels ? "on" : ""}
                onClick={() => act(() => setLabels(!labels))}
              >
                Labels
              </button>
              <button onClick={animate}>▷ Animate</button>
            </div>
            <div>
              <span>Zoom</span>
              <button
                aria-label="Zoom out"
                onClick={() => act(() => setZoom(Math.max(0.7, zoom - 0.1)))}
              >
                <Minus />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => act(() => setZoom(Math.min(1.3, zoom + 0.1)))}
              >
                <Plus />
              </button>
              <button
                aria-label="Fit construction"
                onClick={() => act(() => setZoom(1))}
              >
                ⛶
              </button>
            </div>
          </header>
          <svg
            className={grid ? "grid" : ""}
            viewBox="0 0 570 430"
            aria-label="Parallel line construction with copied corresponding angles"
          >
            <g
              transform={`translate(${285 * (1 - zoom)} ${215 * (1 - zoom)}) scale(${zoom})`}
            >
              <line className="line-l" x1="18" y1="250" x2="545" y2="250" />
              <path className="arrow" d="M545 250l-12-7m12 7l-12 7" />
              {stage >= 4 && (
                <>
                  <line className="line-m" x1="285" y1="65" x2="545" y2="65" />
                  <path className="arrow purple" d="M545 65l-12-7m12 7l-12 7" />
                </>
              )}
              {stage < 4 && (
                <line
                  className="line-m preview"
                  x1="285"
                  y1="65"
                  x2="545"
                  y2="65"
                />
              )}
              {transversal && (
                <>
                  <line
                    className="transversal"
                    x1="150"
                    y1="115"
                    x2="345"
                    y2="400"
                  />
                  <path
                    className="arrow purple"
                    d="M390 400l-11-7m11 7l-4-12"
                  />
                </>
              )}
              {stage >= 2 && (
                <path className="arc blue" d="M25 165A130 130 0 0 1 250 150" />
              )}
              {stage >= 3 && (
                <path className="arc blue" d="M20 330A145 145 0 0 0 265 360" />
              )}
              {stage >= 4 && (
                <>
                  <path
                    className="arc purple-arc"
                    d="M240 115A145 145 0 0 1 390 250"
                  />
                  <path
                    className="arc purple-arc"
                    d="M245 360A145 145 0 0 0 390 250"
                  />
                </>
              )}
              <circle cx="150" cy="250" r="5" />
              <circle cx="285" cy="65" r="5" />
              <circle cx="345" cy="250" r="5" />
              <circle cx="82" cy="117" r="5" />
              <circle cx="180" cy="145" r="5" />
              {labels && (
                <>
                  <text x="127" y="246">
                    A
                  </text>
                  <text x="283" y="51">
                    P
                  </text>
                  <text x="351" y="244">
                    E
                  </text>
                  <text x="72" y="105">
                    C
                  </text>
                  <text x="176" y="133">
                    D
                  </text>
                  <text x="530" y="238">
                    l
                  </text>
                  <text x="550" y="84">
                    m
                  </text>
                  <text className="blue-text" x="155" y="220">
                    74°
                  </text>
                  <text className="purple-text" x="305" y="91">
                    74°
                  </text>
                </>
              )}
            </g>
          </svg>
          <aside>
            <h3>READOUTS</h3>
            <p>∠CAB = 74°</p>
            <p>∠DPE = 74°</p>
            <b>Lines l and m are parallel.</b>
          </aside>
          <footer>
            <div>
              <small>Step {stage} of 5</small>
              <b>{constructionSteps[stage - 1]}</b>
            </div>
            <button
              disabled={stage === 1}
              onClick={() => act(() => setStage(stage - 1))}
            >
              ← Previous
            </button>
            <button
              disabled={stage === 5}
              onClick={() => act(() => setStage(stage + 1))}
            >
              Next →
            </button>
          </footer>
        </article>
      </section>
      <section className="pl10027-theory">
        <article>
          <h2>
            ▣ WORKED EXAMPLE <small>✓ Solved</small>
          </h2>
          <p>
            Construct a line m through point P which is parallel to the given
            line l.
          </p>
          <div>
            <MiniExample />
            <ol>
              <li>Given line l and point P not on l.</li>
              <li>
                With A as centre, draw arc cutting l at A and intersecting above
                and below at C and C′.
              </li>
              <li>
                With P as centre, draw arc of same radius cutting the first arc
                at D and D′.
              </li>
              <li>Join P to D and extend to form line m.</li>
              <li>
                Draw transversal PE. Then ∠DPE = ∠CAB = 74°. Hence, m ∥ l.
              </li>
            </ol>
          </div>
        </article>
        <article>
          <h2>⚒ KEY RULE / DEFINITION</h2>
          <h3>Corresponding Angles Theorem</h3>
          <p>
            If a transversal intersects two lines and a pair of corresponding
            angles are equal, then the lines are parallel.
          </p>
          <b>Symbolically:</b>
          <aside>
            If ∠1 = ∠2 (corresponding)<strong>then l ∥ m</strong>
          </aside>
          <MiniRule />
        </article>
      </section>
      <section className="pl10027-cards">
        <article>
          <h2>ⓘ WHY IT WORKS</h2>
          <p>
            The angle we copy at P is equal to the given angle at A. With
            transversal PE, ∠DPE = ∠CAB (corresponding angles).
          </p>
          <p>
            By the Corresponding Angles Theorem, lines m and l are parallel.
          </p>
          <b>
            Conclusion
            <br />
            <strong>m ∥ l</strong>
          </b>
        </article>
        <article>
          <h2>⚠ COMMON MISTAKE</h2>
          <p>
            Using different arc radius for the two arcs. The arcs must be of the
            same radius to copy the angle accurately.
          </p>
          <MiniMistake />
        </article>
        <article>
          <h2>♧ QUICK CHECK</h2>
          <p>After construction, what must be true if m is parallel to l?</p>
          {[
            "∠DPE = ∠CAB",
            "∠DPE + ∠CAB = 180°",
            "∠DPE = 90°",
            "None of these",
          ].map((answer, index) => (
            <button
              className={
                quickAnswer === index ? (index === 0 ? "correct" : "wrong") : ""
              }
              onClick={() => act(() => setQuickAnswer(index))}
              key={answer}
            >
              <i>{String.fromCharCode(65 + index)}</i>
              {answer}
            </button>
          ))}
          <b className={quickAnswer === 0 ? "" : "wrong-answer"}>
            {quickAnswer === 0
              ? "Correct! Option A is correct."
              : "Try again: corresponding angles must be equal."}
          </b>
        </article>
      </section>
      <section className="pl10027-challenge">
        <header>
          <h2>YOUR TURN (MINI CHALLENGE)</h2>
          <p>
            Construct a line through Q parallel to the given line l. Use the
            tools and steps you learned.
          </p>
          <button onClick={resetChallenge}>
            <RotateCcw />
            New challenge
          </button>
        </header>
        <MiniChallenge complete={checks.every(Boolean)} />
        <aside>
          <b>Checklist</b>
          {challengeChecks.map((label, index) => (
            <label key={label}>
              <input
                type="checkbox"
                checked={checks[index]}
                onChange={() => {
                  setChecks((values) =>
                    values.map((value, i) => (i === index ? !value : value)),
                  );
                  setChallengeResult("idle");
                  setActions((n) => n + 1);
                }}
              />
              {label}
            </label>
          ))}
        </aside>
        <div>
          <button onClick={checkChallenge}>Check Answer</button>
          <button
            onClick={() => {
              setHint(!hint);
              setActions((n) => n + 1);
            }}
          >
            {hint ? "Hide Hint" : "Show Hint"}
          </button>
          {challengeResult !== "idle" && (
            <strong className={challengeResult}>
              {challengeResult === "correct"
                ? "✓ Parallel construction verified"
                : "Complete all four construction checks"}
            </strong>
          )}
          {hint && (
            <small>
              Copy the corresponding angle at Q using the same compass radius.
            </small>
          )}
        </div>
      </section>
      <nav className="pl10027-adjacent">
        <Link to={prev.route}>
          ←
          <span>
            Previous Lesson<b>Perpendicular Through a Point</b>
          </span>
        </Link>
        <Link to={next.route}>
          <span>
            Next Lesson<b>Angle Bisector Construction</b>
          </span>
          →
        </Link>
      </nav>
    </section>
  );
}

function MiniExample() {
  return (
    <svg viewBox="0 0 240 190">
      <line x1="10" y1="115" x2="225" y2="115" />
      <line className="mini-purple" x1="105" y1="35" x2="225" y2="35" />
      <path
        className="mini-arc"
        d="M30 55A90 90 0 0 1 145 115M30 150A110 110 0 0 0 145 115M75 45A75 75 0 0 1 145 115"
      />
      <line className="mini-dash" x1="85" y1="20" x2="145" y2="170" />
      <text x="70" y="30">
        P
      </text>
      <text x="75" y="120">
        A
      </text>
      <text x="148" y="120">
        B
      </text>
      <text x="210" y="25">
        m
      </text>
      <text x="225" y="110">
        l
      </text>
    </svg>
  );
}
function MiniRule() {
  return (
    <svg viewBox="0 0 210 115">
      <line x1="15" y1="30" x2="195" y2="30" />
      <line x1="15" y1="90" x2="195" y2="90" />
      <line x1="110" y1="4" x2="85" y2="112" />
      <path d="M105 30a17 17 0 0 1-14 15M91 90a17 17 0 0 1 14-15" />
      <text x="87" y="47">
        1
      </text>
      <text x="102" y="78">
        1
      </text>
    </svg>
  );
}
function MiniMistake() {
  return (
    <svg viewBox="0 0 200 95">
      <line x1="15" y1="65" x2="85" y2="65" />
      <line x1="115" y1="65" x2="190" y2="65" />
      <path className="wrong" d="M18 42Q50 5 82 42M18 80Q50 45 82 80" />
      <path className="right" d="M118 42Q152 5 187 42M118 80Q152 45 187 80" />
      <text x="42" y="93">
        ✕ Wrong
      </text>
      <text x="135" y="93">
        ✓ Correct
      </text>
    </svg>
  );
}
function MiniChallenge({ complete }: { complete: boolean }) {
  return (
    <svg viewBox="0 0 310 120">
      <line x1="20" y1="90" x2="285" y2="90" />
      <circle cx="70" cy="90" r="4" />
      <circle cx="220" cy="90" r="4" />
      <circle cx="175" cy="27" r="4" />
      {complete && (
        <line className="mini-purple" x1="80" y1="27" x2="285" y2="27" />
      )}
      <text x="68" y="78">
        A
      </text>
      <text x="218" y="78">
        B
      </text>
      <text x="170" y="20">
        Q
      </text>
      <text x="290" y="92">
        l
      </text>
    </svg>
  );
}
