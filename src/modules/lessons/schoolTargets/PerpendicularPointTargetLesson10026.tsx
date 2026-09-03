import { Redo2, RotateCcw, Undo2 } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PerpendicularPointTargetLesson10026.css";

type Model = { mode: "On-line" | "Off-line"; radius: number; offset: number };
const initial: Model = { mode: "On-line", radius: 3.5, offset: 0 };

export default function PerpendicularPointTargetLesson10026({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState(initial);
  const [history, setHistory] = useState<Model[]>([]);
  const [future, setFuture] = useState<Model[]>([]);
  const [lineSelected, setLineSelected] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [tab, setTab] = useState("Interact");
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const pY = 210 - model.offset * 22;
  const radiusPx = model.radius * 34;
  const correct = lineSelected && model.radius >= 2.5;
  const update = (nextModel: Model) => {
    setHistory((values) => [...values, model]);
    setFuture([]);
    setModel(nextModel);
    setActions((value) => value + 1);
  };
  const undo = () => {
    const value = history.at(-1);
    if (!value) return;
    setFuture((values) => [model, ...values]);
    setHistory((values) => values.slice(0, -1));
    setModel(value);
    setActions((n) => n + 1);
  };
  const redo = () => {
    const value = future[0];
    if (!value) return;
    setHistory((values) => [...values, model]);
    setFuture((values) => values.slice(1));
    setModel(value);
    setActions((n) => n + 1);
  };
  const reset = () => {
    setModel(initial);
    setHistory([]);
    setFuture([]);
    setLineSelected(true);
    setShowLabels(true);
    setShowSteps(true);
    setTab("Interact");
    setChallengeStarted(false);
    setActions((n) => n + 1);
  };
  const dragP = (event: PointerEvent<SVGCircleElement>) => {
    if (
      !svgRef.current ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((event.clientY - rect.top) / rect.height) * 420;
    const offset = Math.round(Math.max(0, Math.min(5, (210 - y) / 22)) * 2) / 2;
    update({ ...model, offset, mode: offset < 0.25 ? "On-line" : "Off-line" });
  };
  return (
    <section
      className="pp10026-page"
      data-testid="school-mockup-0700"
      data-object-model="dedicated-point-line-equal-arc-intersections-perpendicular-construction"
      data-mode={model.mode}
      data-radius={model.radius.toFixed(1)}
      data-offset={model.offset.toFixed(1)}
      data-line-selected={lineSelected}
      data-labels={showLabels}
      data-steps={showSteps}
      data-correct={correct}
      data-tab={tab}
      data-challenge={challengeStarted}
      data-actions={actions}
    >
      <header className="pp10026-hero">
        <small>CLASS 7 · PRACTICAL GEOMETRY</small>
        <h1>Perpendicular Through a Point</h1>
        <p>
          <b>Objective:</b> Construct a line perpendicular to a given line
          passing through a given point (on the line or off the line).
        </p>
        <div>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
          <span>CLASS 7</span>
        </div>
        <Link to="/lessons/school">← &nbsp; School lessons</Link>
      </header>
      <nav className="pp10026-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={tab === item ? "active" : ""}
              aria-pressed={tab === item}
              onClick={() => {
                setTab(item);
                setActions((n) => n + 1);
              }}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="pp10026-lab">
        <aside className="pp10026-tools">
          <h2>CONSTRUCTION TOOLS</h2>
          <p>Follow the steps to construct the perpendicular.</p>
          <ol>
            <li>
              <b>Select a case</b>
              <div>
                {["On-line", "Off-line"].map((mode) => (
                  <button
                    className={model.mode === mode ? "active" : ""}
                    onClick={() =>
                      update({
                        ...model,
                        mode: mode as Model["mode"],
                        offset: mode === "On-line" ? 0 : 3,
                      })
                    }
                    key={mode}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </li>
            <li>
              <b>Choose line</b>
              <button
                className={lineSelected ? "selected" : ""}
                onClick={() => {
                  setLineSelected(!lineSelected);
                  setActions((n) => n + 1);
                }}
              >
                Line l selected - ⟷
              </button>
            </li>
            <li>
              <b>Mark point P</b>
              <button
                aria-label="Toggle point P position"
                onClick={() =>
                  update({
                    ...model,
                    mode: model.mode === "On-line" ? "Off-line" : "On-line",
                    offset: model.mode === "On-line" ? 3 : 0,
                  })
                }
              >
                Point P placed - ●
              </button>
            </li>
            <li>
              <b>Draw arc</b>
              <p>Center: P</p>
              <label>
                Radius: <b>{model.radius.toFixed(1)}</b>
                <button
                  aria-label="Decrease radius"
                  onClick={() =>
                    update({
                      ...model,
                      radius: Math.max(2, model.radius - 0.5),
                    })
                  }
                >
                  −
                </button>
                <button
                  aria-label="Increase radius"
                  onClick={() =>
                    update({
                      ...model,
                      radius: Math.min(6, model.radius + 0.5),
                    })
                  }
                >
                  ＋
                </button>
              </label>
            </li>
            <li>
              <b>Mark intersections</b>
              <p>Points A and B marked</p>
            </li>
            <li>
              <b>Draw perpendicular</b>
              <p>
                Join A and B<br />
                Perpendicular constructed
              </p>
            </li>
          </ol>
          <footer>
            <b>Controls</b>
            <div>
              <button
                aria-label="Undo construction change"
                disabled={!history.length}
                onClick={undo}
              >
                <Undo2 />
                Undo
              </button>
              <button
                aria-label="Redo construction change"
                disabled={!future.length}
                onClick={redo}
              >
                <Redo2 />
                Redo
              </button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
              </button>
            </div>
            <label>
              <input
                type="checkbox"
                checked={showSteps}
                onChange={() => {
                  setShowSteps(!showSteps);
                  setActions((n) => n + 1);
                }}
              />
              Show steps
            </label>
          </footer>
        </aside>
        <article className="pp10026-work">
          <header>
            <h2>Interactive Construction</h2>
            <label>
              Show labels{" "}
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => {
                  setShowLabels(!showLabels);
                  setActions((n) => n + 1);
                }}
              />
            </label>
          </header>
          <svg
            ref={svgRef}
            viewBox="0 0 500 420"
            aria-label="Interactive perpendicular through point construction"
          >
            <defs>
              <pattern
                id="pp-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path d="M24 0H0V24" fill="none" stroke="#e3edf3" />
              </pattern>
            </defs>
            <rect width="500" height="420" fill="url(#pp-grid)" />
            <line
              className={lineSelected ? "base selected" : "base"}
              x1="15"
              y1="210"
              x2="485"
              y2="210"
            />
            <path
              className="arrows"
              d="M15 210l10-6m-10 6l10 6M485 210l-10-6m10 6l-10 6"
            />
            {correct && (
              <>
                <circle className="arc" cx="250" cy={pY} r={radiusPx} />
                <line
                  className="perpendicular"
                  x1="250"
                  y1="8"
                  x2="250"
                  y2="410"
                />
                <path
                  className="arrows purple"
                  d="M250 8l-6 10m6-10l6 10M250 410l-6-10m6 10l6-10"
                />
              </>
            )}
            <circle
              className="drag"
              role="slider"
              aria-label="Point P vertical position"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={model.offset}
              tabIndex={0}
              cx="250"
              cy={pY}
              r="6"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={dragP}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp")
                  update({
                    ...model,
                    mode: "Off-line",
                    offset: Math.min(5, model.offset + 0.5),
                  });
                if (event.key === "ArrowDown") {
                  const offset = Math.max(0, model.offset - 0.5);
                  update({
                    ...model,
                    mode: offset === 0 ? "On-line" : "Off-line",
                    offset,
                  });
                }
              }}
            />
            {correct && (
              <>
                <circle cx="250" cy={pY - radiusPx} r="5" />
                <circle cx="250" cy={pY + radiusPx} r="5" />
                <path className="right" d={`M250 210h17v-17h-17`} />
              </>
            )}
            {showLabels && (
              <>
                <text x="258" y={pY + 3}>
                  P
                </text>
                <text x="258" y={pY - radiusPx - 7}>
                  A
                </text>
                <text x="258" y={pY + radiusPx + 17}>
                  B
                </text>
                <text x="462" y="225">
                  l
                </text>
                <text className="angle" x="270" y="198">
                  90°
                </text>
              </>
            )}
          </svg>
          <aside>
            <span>✓</span>
            <div>
              <b>Result</b>
              <p>Line AB is perpendicular to line l at point P.</p>
            </div>
            <div>
              ∠(AB, l)<strong>90°</strong>
            </div>
            <div>
              Status<strong>{correct ? "Correct" : "Incomplete"}</strong>
            </div>
          </aside>
        </article>
      </section>
      <section className="pp10026-concepts">
        <article>
          <h2>What did we observe?</h2>
          <p>The arcs from P cut line l at A and B.</p>
          <p>
            Joining A and B forms a line that meets l at a right angle (90°).
          </p>
          <MiniObserve />
        </article>
        <article>
          <h2>Notice the pattern</h2>
          {[
            "Arc centered at P gives two equidistant points A and B.",
            "Line AB passes through P.",
            "AB is perpendicular to l.",
            "Works for both on-line and off-line cases.",
          ].map((text) => (
            <p key={text}>✓ &nbsp; {text}</p>
          ))}
        </article>
        <article>
          <h2>Key Rule</h2>
          <aside>
            <b>Perpendicular Through a Point Rule</b>
            <p>
              With center at the given point P, draw an arc that cuts the given
              line l at two points A and B. Join A and B.
            </p>
            <strong>Then AB ⟂ l and ∠(AB, l) = 90°.</strong>
          </aside>
        </article>
      </section>
      <aside className="pp10026-warning">
        <section>
          <h2>⚠ &nbsp; Common Mistake</h2>
          <p>
            Not using the same center (P) for the arc. The arc must be centered
            at P so that the distances PA and PB are equal.
          </p>
        </section>
        <section>
          <h2>☀ &nbsp; Why it matters</h2>
          <p>
            Equal distances from P to A and P to B guarantee that AB is
            perpendicular to l.
          </p>
        </section>
      </aside>
      <section className="pp10026-theory">
        <article>
          <h2>Worked Example</h2>
          <p>
            <b>Construction:</b> Draw a line perpendicular to line l through
            point P below line l.
          </p>
          <ol>
            <li>Draw an arc centered at P cutting line l at A and B.</li>
            <li>Join A and B to get line AB.</li>
            <li>Then AB ⟂ l.</li>
          </ol>
          <MiniWorked />
          <aside>
            <b>Verified</b>
            <p>✓ ∠(AB, l) = 90°</p>
            <p>✓ Construction is correct.</p>
          </aside>
        </article>
        <article>
          <h2>Formula / Definition</h2>
          <h3>Definition</h3>
          <p>
            Two lines are perpendicular if they intersect to form a right angle.
          </p>
          <h3>Symbolically</h3>
          <strong>AB ⟂ l ⇔ ∠(AB, l) = 90°</strong>
          <h3>Steps (Summary)</h3>
          <ol>
            <li>With center P, draw an arc cutting l at A and B.</li>
            <li>Join A and B.</li>
            <li>AB is perpendicular to l.</li>
          </ol>
        </article>
      </section>
      <section className="pp10026-challenge">
        <h2>Try this challenge</h2>
        <p>Draw a line perpendicular to the given line through point P.</p>
        <MiniChallenge started={challengeStarted} />
        <button
          onClick={() => {
            setChallengeStarted(!challengeStarted);
            setActions((n) => n + 1);
          }}
        >
          ♧ &nbsp;{" "}
          {challengeStarted ? "Reset Construction" : "Start Construction"}
        </button>
        <aside>
          <b>Self-check</b>
          <p>{challengeStarted ? "✓" : "○"} AB ⟂ l</p>
          <p>{challengeStarted ? "✓" : "○"} ∠(AB, l) = 90°</p>
        </aside>
      </section>
      <nav className="pp10026-adjacent">
        <Link to={prev.route}>
          ←
          <span>
            Previous Lesson<b>Angle Bisector Construction</b>
          </span>
        </Link>
        <Link to={next.route}>
          <span>
            Next Lesson<b>Parallel Line Construction</b>
          </span>
          →
        </Link>
      </nav>
    </section>
  );
}

function MiniObserve() {
  return (
    <svg viewBox="0 0 210 120">
      <line x1="15" y1="65" x2="195" y2="65" />
      <line className="violet" x1="105" y1="10" x2="105" y2="112" />
      <circle className="arc" cx="105" cy="65" r="48" />
      <path className="right" d="M105 65h10V55h-10" />
      <text x="110" y="60">
        P
      </text>
      <text x="110" y="15">
        A
      </text>
      <text x="110" y="115">
        B
      </text>
      <text x="196" y="62">
        l
      </text>
    </svg>
  );
}
function MiniWorked() {
  return (
    <svg viewBox="0 0 230 120">
      <line x1="15" y1="55" x2="215" y2="55" />
      <line className="violet" x1="115" y1="5" x2="115" y2="115" />
      <path className="arc" d="M65 95A58 58 0 0 1 165 95" />
      <circle cx="115" cy="95" r="4" />
      <path className="right" d="M115 55h10V45h-10" />
      <text x="102" y="100">
        P
      </text>
      <text x="120" y="12">
        A
      </text>
    </svg>
  );
}
function MiniChallenge({ started }: { started: boolean }) {
  return (
    <svg viewBox="0 0 240 90">
      <line x1="15" y1="70" x2="220" y2="38" />
      <circle cx="105" cy="20" r="4" />
      {started && <line className="violet" x1="105" y1="5" x2="118" y2="88" />}
      <text x="112" y="18">
        P
      </text>
      <text x="222" y="38">
        l
      </text>
    </svg>
  );
}
