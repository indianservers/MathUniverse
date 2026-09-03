import { Check, Play, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleBisectorTargetLesson10025.css";

const clamp = (value: number) => Math.min(140, Math.max(20, Math.round(value)));

export default function AngleBisectorTargetLesson10025({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(72);
  const [radius, setRadius] = useState(4);
  const [tool, setTool] = useState("Pointer");
  const [showArcs, setShowArcs] = useState(true);
  const [showMeasures, setShowMeasures] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [steps, setSteps] = useState([true, true, true, true]);
  const [tab, setTab] = useState("Interact");
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const board = useRef<SVGSVGElement>(null);
  const half = angle / 2;
  const complete = steps.every(Boolean);
  const upper = point(86, 230, 205, half);
  const lower = point(86, 230, 205, -half);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setAngle(72);
      setRadius(4);
      setTool("Pointer");
      setShowArcs(true);
      setShowMeasures(true);
      setShowLabels(true);
      setSteps([true, true, true, true]);
      setTab("Interact");
      setChallengeStarted(false);
      setChallengeChecked(false);
    });
  const dragRay = (event: PointerEvent<SVGCircleElement>) => {
    const svg = board.current;
    if (!svg || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 510;
    const y = ((event.clientY - rect.top) / rect.height) * 470;
    act(() =>
      setAngle(
        clamp(Math.abs((Math.atan2(230 - y, x - 86) * 180) / Math.PI) * 2),
      ),
    );
  };
  return (
    <section
      className="ab10025-page"
      data-testid="school-mockup-0699"
      data-object-model="dedicated-equal-arc-intersection-angle-bisector-ray-construction"
      data-angle={angle.toFixed(1)}
      data-half-angle={half.toFixed(1)}
      data-radius={radius.toFixed(1)}
      data-complete={complete}
      data-tool={tool}
      data-arcs={showArcs}
      data-measures={showMeasures}
      data-labels={showLabels}
      data-tab={tab}
      data-challenge-started={challengeStarted}
      data-challenge-checked={challengeChecked}
      data-actions={actions}
    >
      <header className="ab10025-hero">
        <small>Angle Bisector Construction</small>
        <h1>Angle Bisector Construction</h1>
        <p>
          <b>Objective:</b> Construct the angle bisector of a given angle and
          verify that it divides the angle into two equal parts.
        </p>
        <div>
          <span>◷ 24 min</span>
          <span>Subject: Practical Geometry</span>
          <span>Topic: Constructions</span>
          <span>Level: Class 7</span>
        </div>
        <MiniHero />
      </header>
      <nav className="ab10025-tabs" aria-label="Lesson sections">
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
      <section className="ab10025-lab">
        <header>
          <h2>1. OBSERVE &amp; MANIPULATE</h2>
          <p>
            Use the compass and steps below to construct the angle bisector.
            Values update live.
          </p>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </header>
        <aside className="ab10025-instructions">
          {[
            "Draw an angle ∠A.",
            "With center A, draw an arc that cuts the rays at B and C.",
            "With centers B and C (same radius), draw arcs to intersect at D.",
            "Join A to D. AD is the angle bisector.",
          ].map((label, index) => (
            <button
              onClick={() =>
                act(() =>
                  setSteps((values) =>
                    values.map((value, i) => (i === index ? !value : value)),
                  ),
                )
              }
              key={label}
            >
              <i>{index + 1}</i>
              <span>{label}</span>
              {steps[index] && <Check />}
            </button>
          ))}
          <section>
            <h3>Tools</h3>
            {["Pointer", "Compass", "Line", "Arc"].map((item, index) => (
              <button
                className={tool === item ? "active" : ""}
                aria-label={item}
                onClick={() => act(() => setTool(item))}
                key={item}
              >
                <i>{["↖", "♧", "╱", "◠"][index]}</i>
                <small>{item}</small>
              </button>
            ))}
          </section>
          <label>
            Compass radius{" "}
            <input
              aria-label="Compass radius"
              type="range"
              min="2"
              max="7"
              step=".5"
              value={radius}
              onChange={(event) =>
                act(() => setRadius(Number(event.target.value)))
              }
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowUp")
                  act(() => setRadius((value) => Math.min(7, value + 0.5)));
                if (event.key === "ArrowLeft" || event.key === "ArrowDown")
                  act(() => setRadius((value) => Math.max(2, value - 0.5)));
              }}
            />
            <b>{radius.toFixed(1)} cm</b>
          </label>
          <section className="ab10025-show">
            <h3>Show / Hide</h3>
            {[
              ["Show arcs", showArcs, setShowArcs],
              ["Show angle measures", showMeasures, setShowMeasures],
              ["Show labels", showLabels, setShowLabels],
            ].map(([label, value, setter]) => (
              <button
                className={value ? "on" : ""}
                onClick={() => act(() => setter(!value))}
                key={String(label)}
              >
                <i>{value ? "✓" : ""}</i>
                {String(label)}
              </button>
            ))}
          </section>
        </aside>
        <article className="ab10025-board">
          <svg
            ref={board}
            viewBox="0 0 510 470"
            aria-label="Interactive angle bisector construction"
          >
            <defs>
              <pattern
                id="ab-grid"
                width="22"
                height="22"
                patternUnits="userSpaceOnUse"
              >
                <path d="M22 0H0V22" fill="none" stroke="#e2ebf2" />
              </pattern>
            </defs>
            <rect width="510" height="470" fill="url(#ab-grid)" />
            <line x1="86" y1="230" x2={upper.x} y2={upper.y} />
            <line x1="86" y1="230" x2={lower.x} y2={lower.y} />
            {complete && (
              <line className="bisector" x1="86" y1="230" x2="395" y2="230" />
            )}
            {showArcs && (
              <>
                <path
                  className="blue-arc"
                  d={`M ${point(86, 230, 150, -half).x} ${point(86, 230, 150, -half).y} A150 150 0 0 0 ${point(86, 230, 150, half).x} ${point(86, 230, 150, half).y}`}
                />
                <path
                  className="purple-arc"
                  d="M310 107A132 132 0 0 1 390 230"
                />
                <path
                  className="purple-arc"
                  d="M312 353A132 132 0 0 0 390 230"
                />
              </>
            )}
            <circle cx="86" cy="230" r="5" />
            <circle
              cx={point(86, 230, 150, half).x}
              cy={point(86, 230, 150, half).y}
              r="5"
            />
            <circle
              cx={point(86, 230, 150, -half).x}
              cy={point(86, 230, 150, -half).y}
              r="5"
            />
            <circle cx="390" cy="230" r="6" />
            <circle
              className="drag"
              role="slider"
              aria-label="Upper ray point B"
              aria-valuemin={20}
              aria-valuemax={140}
              aria-valuenow={angle}
              tabIndex={0}
              cx={upper.x}
              cy={upper.y}
              r="7"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={dragRay}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowRight")
                  act(() => setAngle((value) => clamp(value + 2)));
                if (event.key === "ArrowDown" || event.key === "ArrowLeft")
                  act(() => setAngle((value) => clamp(value - 2)));
              }}
            />
            {showLabels && (
              <>
                <text x="65" y="236">
                  A
                </text>
                <text x={upper.x - 10} y={upper.y - 12}>
                  B
                </text>
                <text x={lower.x - 8} y={lower.y + 23}>
                  C
                </text>
                <text x="404" y="235">
                  D
                </text>
              </>
            )}
            {showMeasures && (
              <>
                <text className="orange" x="145" y="215">
                  {half.toFixed(1)}°
                </text>
                <text className="green" x="145" y="259">
                  {half.toFixed(1)}°
                </text>
              </>
            )}
          </svg>
          <footer>
            {[
              "Angle drawn",
              "Arc from A",
              "Arcs from B & C",
              "Join A to D",
            ].map((label, index) => (
              <span className={steps[index] ? "done" : ""} key={label}>
                <i>{steps[index] ? "✓" : index + 1}</i>
                {label}
              </span>
            ))}
          </footer>
        </article>
        <aside className="ab10025-measure">
          <h2>Angle Measure</h2>
          <p className="orange">∠BAD = {complete ? half.toFixed(1) : "--"}°</p>
          <p className="green">∠CAD = {complete ? half.toFixed(1) : "--"}°</p>
          <hr />
          <b>Difference</b>
          <strong>
            |{half.toFixed(1)}° − {half.toFixed(1)}°| = 0.0°
          </strong>
          <em>✓ Equal angles</em>
        </aside>
      </section>
      <section className="ab10025-pattern">
        <article>
          <h2>2. NOTICE THE PATTERN</h2>
          <p>
            No matter how wide or narrow the angle is, the two angles formed by
            AD are always equal.
          </p>
          <div>✓</div>
        </article>
        <article>
          <h2>3. UNDERSTAND THE RULE</h2>
          <b>Definition</b>
          <p>
            An angle bisector is a ray that divides an angle into two equal
            angles.
          </p>
          <aside>
            If AD is the bisector of ∠BAC, then <strong>∠BAD = ∠CAD.</strong>
          </aside>
        </article>
        <article>
          <h2>⚠ Misconception Alert</h2>
          <p>
            Do not join B to C. Joining B and C creates a triangle, not the
            angle bisector.
          </p>
          <MiniMistake />
        </article>
      </section>
      <section className="ab10025-bottom">
        <article>
          <h2>4. WORKED EXAMPLE</h2>
          <p>Construct the bisector of ∠PAQ = 80°.</p>
          <b>Solution:</b>
          <ol>
            <li>Draw ∠PAQ = 80°.</li>
            <li>With center A, draw an arc cutting AP at B and AQ at C.</li>
            <li>With centers B and C, draw arcs intersecting at D.</li>
            <li>Join A to D.</li>
            <li>Measure: ∠PAD = ∠DAQ = 40°.</li>
          </ol>
          <MiniWorked />
          <aside>
            <b>Result:</b> AD is the bisector and ∠PAD = ∠DAQ = 40°.
          </aside>
        </article>
        <article>
          <h2>5. TRY INDEPENDENTLY (Mini Challenge)</h2>
          <p>
            Construct the bisector of ∠XYZ = 60°. Verify the two angles are
            equal.
          </p>
          <MiniChallenge started={challengeStarted} />
          <footer>
            <button
              onClick={() => {
                setChallengeStarted(true);
                setChallengeChecked(false);
              }}
            >
              <Play />
              Start Construction
            </button>
            <button
              disabled={!challengeStarted}
              onClick={() => setChallengeChecked(true)}
            >
              <Check />
              Check Answer
            </button>
          </footer>
          {challengeChecked && <strong>✓ ∠XYD = ∠DYZ = 30°</strong>}
          <small>💡 Tip: Use the same radius for both arcs from B and C.</small>
        </article>
      </section>
      <nav className="ab10025-adjacent">
        <Link to={prev.route}>
          ← &nbsp; Previous: Perpendicular Bisector Construction
        </Link>
        <Link to={next.route}>
          Next: Perpendicular Through a Point &nbsp; →
        </Link>
      </nav>
    </section>
  );
}

function point(cx: number, cy: number, length: number, angle: number) {
  return {
    x: cx + Math.cos((angle * Math.PI) / 180) * length,
    y: cy - Math.sin((angle * Math.PI) / 180) * length,
  };
}
function MiniHero() {
  return (
    <svg viewBox="0 0 100 80">
      <line x1="8" y1="65" x2="76" y2="10" />
      <line x1="8" y1="65" x2="88" y2="65" />
      <line className="mini-blue" x1="8" y1="65" x2="85" y2="42" />
      <circle cx="8" cy="65" r="3" />
      <circle cx="76" cy="10" r="3" />
      <circle cx="85" cy="42" r="3" />
      <path d="M55 65A47 47 0 0 0 42 35" />
      <path d="M73 65A65 65 0 0 0 58 27" />
    </svg>
  );
}
function MiniMistake() {
  return (
    <svg viewBox="0 0 170 110">
      <line x1="15" y1="88" x2="102" y2="15" />
      <line x1="15" y1="88" x2="125" y2="88" />
      <line className="wrong" x1="102" y1="15" x2="125" y2="88" />
      <text x="137" y="43">
        ✕
      </text>
      <text x="98" y="12">
        B
      </text>
      <text x="127" y="90">
        C
      </text>
    </svg>
  );
}
function MiniWorked() {
  return (
    <svg viewBox="0 0 220 190">
      <line x1="18" y1="140" x2="160" y2="15" />
      <line x1="18" y1="140" x2="188" y2="175" />
      <line className="mini-blue" x1="18" y1="140" x2="196" y2="112" />
      <path d="M112 160A95 95 0 0 0 93 75" />
      <text x="70" y="120">
        40°
      </text>
      <text x="72" y="152">
        40°
      </text>
    </svg>
  );
}
function MiniChallenge({ started }: { started: boolean }) {
  return (
    <svg viewBox="0 0 260 170">
      <line x1="30" y1="90" x2="185" y2="20" />
      <line x1="30" y1="90" x2="210" y2="142" />
      {started && (
        <line className="mini-blue" x1="30" y1="90" x2="215" y2="85" />
      )}
      <path d="M63 90A33 33 0 0 0 58 76" />
      <text x="88" y="84">
        {started ? "30°" : "?"}
      </text>
      <text x="15" y="93">
        Y
      </text>
      <text x="190" y="18">
        X
      </text>
      <text x="215" y="147">
        Z
      </text>
    </svg>
  );
}
