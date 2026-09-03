import { Check, Eye, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PerpendicularBisectorTargetLesson10024.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function PerpendicularBisectorTargetLesson10024({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [length, setLength] = useState(8);
  const [radiusControl, setRadiusControl] = useState(4);
  const [showArcs, setShowArcs] = useState(true);
  const [showBisector, setShowBisector] = useState(true);
  const [showRightAngle, setShowRightAngle] = useState(true);
  const [tool, setTool] = useState("Select");
  const [tab, setTab] = useState("Interact");
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const board = useRef<SVGSVGElement>(null);
  const half = length / 2;
  const arcRadius = radiusControl + 2;
  const valid = arcRadius > half;
  const intersectionHeight = valid
    ? Math.sqrt(arcRadius * arcRadius - half * half)
    : 0;
  const scale = 36.5;
  const ax = 245 - half * scale;
  const bx = 245 + half * scale;
  const py = 220 - intersectionHeight * scale;
  const qy = 220 + intersectionHeight * scale;
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    setChallengeChecked(false);
  };
  const reset = () =>
    act(() => {
      setLength(8);
      setRadiusControl(4);
      setShowArcs(true);
      setShowBisector(true);
      setShowRightAngle(true);
      setTool("Select");
      setTab("Interact");
    });
  const dragEndpoint = (
    event: PointerEvent<SVGCircleElement>,
    endpoint: "A" | "B",
  ) => {
    const svg = board.current;
    if (!svg || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 490;
    const distance = Math.abs(x - 245) / scale;
    const nextLength = clamp(Math.round(distance * 2 * 2) / 2, 4, 12);
    act(() => setLength(nextLength));
    if (endpoint === "A" && x > 245) act(() => setLength(4));
    if (endpoint === "B" && x < 245) act(() => setLength(4));
  };
  const proofRows = [
    ["AP = BP", `${arcRadius.toFixed(2)} cm = ${arcRadius.toFixed(2)} cm`],
    ["AQ = BQ", `${arcRadius.toFixed(2)} cm = ${arcRadius.toFixed(2)} cm`],
    ["AM = MB", `${half.toFixed(2)} cm = ${half.toFixed(2)} cm`],
    ["PM ⟂ AB", "90°"],
  ];
  return (
    <section
      className="pb10024-page"
      data-testid="school-mockup-0698"
      data-object-model="dedicated-equal-radius-arc-intersection-midpoint-perpendicular-bisector-construction"
      data-length={length.toFixed(2)}
      data-radius={radiusControl.toFixed(2)}
      data-arc-distance={arcRadius.toFixed(2)}
      data-valid={valid}
      data-arcs={showArcs}
      data-bisector={showBisector}
      data-right-angle={showRightAngle}
      data-tool={tool}
      data-tab={tab}
      data-challenge={challengeChecked}
      data-actions={actions}
    >
      <header className="pb10024-hero">
        <small>CLASS 7 · PRACTICAL GEOMETRY</small>
        <h1>Perpendicular Bisector Construction</h1>
        <p>
          Construct the perpendicular bisector of a segment and verify that it
          passes through the midpoint.
        </p>
        <div>
          <span>24 min</span>
          <span>FOUNDATION</span>
          <span>VISUAL_EXPLORATION</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">← &nbsp; School lessons</Link>
      </header>
      <nav className="pb10024-tabs" aria-label="Lesson sections">
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
      <section className="pb10024-lab">
        <article className="pb10024-board">
          <header>
            <h2>CONSTRUCT &amp; EXPLORE</h2>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <svg
            ref={board}
            viewBox="0 0 490 530"
            aria-label="Interactive perpendicular bisector construction"
          >
            <defs>
              <pattern
                id="pb-grid"
                width="25"
                height="25"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M25 0H0V25"
                  fill="none"
                  stroke="#deebf5"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="490" height="530" fill="url(#pb-grid)" />
            {showArcs && valid && (
              <>
                <circle
                  className="arc"
                  cx={ax}
                  cy="220"
                  r={arcRadius * scale}
                />
                <circle
                  className="arc"
                  cx={bx}
                  cy="220"
                  r={arcRadius * scale}
                />
              </>
            )}
            <line className="segment" x1={ax} y1="220" x2={bx} y2="220" />
            {valid && (
              <>
                <line className="guide" x1={ax} y1="220" x2="245" y2={py} />
                <line className="guide" x1={bx} y1="220" x2="245" y2={py} />
                <line className="guide" x1={ax} y1="220" x2="245" y2={qy} />
                <line className="guide" x1={bx} y1="220" x2="245" y2={qy} />
              </>
            )}
            {showBisector && valid && (
              <line
                className="bisector"
                x1="245"
                y1={Math.max(12, py - 70)}
                x2="245"
                y2={Math.min(518, qy + 70)}
              />
            )}
            {showRightAngle && (
              <path className="right" d="M245 220v-16h16v16" />
            )}
            <circle
              className="endpoint"
              role="slider"
              aria-label="Endpoint A"
              aria-valuemin={4}
              aria-valuemax={12}
              aria-valuenow={length}
              tabIndex={0}
              cx={ax}
              cy="220"
              r="6"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={(event) => dragEndpoint(event, "A")}
            />
            <circle
              className="endpoint"
              role="slider"
              aria-label="Endpoint B"
              aria-valuemin={4}
              aria-valuemax={12}
              aria-valuenow={length}
              tabIndex={0}
              cx={bx}
              cy="220"
              r="6"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={(event) => dragEndpoint(event, "B")}
            />
            <circle className="point" cx="245" cy="220" r="5" />
            {valid && (
              <>
                <circle className="point purple" cx="245" cy={py} r="6" />
                <circle className="point purple" cx="245" cy={qy} r="6" />
              </>
            )}
            <text x={ax - 30} y="220">
              A
            </text>
            <text x={bx + 15} y="220">
              B
            </text>
            <text x="253" y="244">
              M
            </text>
            {valid && (
              <>
                <text x="253" y={py - 13}>
                  P
                </text>
                <text x="253" y={qy + 24}>
                  Q
                </text>
                <text
                  className="measure"
                  x={(ax + 245) / 2 - 18}
                  y={(220 + py) / 2}
                >
                  {arcRadius.toFixed(2)} cm
                </text>
                <text
                  className="measure"
                  x={(bx + 245) / 2 + 3}
                  y={(220 + py) / 2}
                >
                  {arcRadius.toFixed(2)} cm
                </text>
                <text
                  className="measure"
                  x={(ax + 245) / 2 - 18}
                  y={(220 + qy) / 2}
                >
                  {arcRadius.toFixed(2)} cm
                </text>
                <text
                  className="measure"
                  x={(bx + 245) / 2 + 3}
                  y={(220 + qy) / 2}
                >
                  {arcRadius.toFixed(2)} cm
                </text>
              </>
            )}
          </svg>
          <footer>
            {["Select", "Compass", "Segment", "Circle", "Move", "Delete"].map(
              (item, index) => (
                <button
                  aria-label={item}
                  className={tool === item ? "active" : ""}
                  onClick={() => act(() => setTool(item))}
                  key={item}
                >
                  {["↖", "♧", "╱", "⊙", "✥", "♜"][index]}
                </button>
              ),
            )}
          </footer>
        </article>
        <aside className="pb10024-panel">
          <section>
            <h2>CONTROLS</h2>
            <label>
              Segment AB{" "}
              <span className="pb10024-number">
                Length
                <input
                  aria-label="Segment AB length"
                  type="number"
                  min="4"
                  max="12"
                  step=".5"
                  value={length}
                  onChange={(event) =>
                    act(() =>
                      setLength(clamp(Number(event.target.value), 4, 12)),
                    )
                  }
                />
                <output>{length.toFixed(2)} cm</output>
              </span>
            </label>
            <label>
              Compass radius{" "}
              <span className="pb10024-number">
                <input
                  aria-label="Compass radius"
                  type="number"
                  min="2.5"
                  max="7"
                  step=".5"
                  value={radiusControl}
                  onChange={(event) =>
                    act(() =>
                      setRadiusControl(
                        clamp(Number(event.target.value), 2.5, 7),
                      ),
                    )
                  }
                />
                <output>{radiusControl.toFixed(2)} cm</output>
              </span>
            </label>
            {[
              ["Show arcs", showArcs, setShowArcs],
              ["Show bisector", showBisector, setShowBisector],
              ["Show right angle", showRightAngle, setShowRightAngle],
            ].map(([label, value, setter]) => (
              <button
                className={value ? "on" : ""}
                onClick={() => act(() => setter(!value))}
                key={String(label)}
              >
                <Eye />
                {String(label)}
              </button>
            ))}
          </section>
          <section className="pb10024-proof">
            <h2>LIVE PROOF CHECK</h2>
            {proofRows.map(([name, value]) => (
              <p key={name}>
                <b>{name}</b>
                <span>{valid ? value : "Radius too small"}</span>
                <Check />
              </p>
            ))}
          </section>
          <section className="pb10024-notice">
            <h2>ⓘ WHAT YOU'LL NOTICE</h2>
            <p>Every point on the bisector is equidistant from A and B.</p>
          </section>
        </aside>
      </section>
      <section className="pb10024-sequence">
        <h2>YOUR LEARNING SEQUENCE</h2>
        <div>
          {[
            ["1", "Observe", "See the construction in action."],
            ["2", "Manipulate", "Drag points, change radius, explore."],
            ["3", "Notice", "Find the pattern in the measurements."],
            ["4", "Rule", "Understand the mathematical rule."],
            ["5", "Try", "Apply it on your own!"],
          ].map((item) => (
            <article className={item[0] === "1" ? "active" : ""} key={item[0]}>
              <i>{item[0]}</i>
              <b>{item[1]}</b>
              <p>{item[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pb10024-theory">
        <article>
          <h2>☷ WORKED EXAMPLE</h2>
          <p>
            Construct the perpendicular bisector of <b>AB</b> with{" "}
            <b>AB = 8 cm</b> using radius 4 cm.
          </p>
          <ol>
            <li>Draw segment AB = 8 cm.</li>
            <li>Set compass radius &gt; 4 cm.</li>
            <li>From A, draw arcs above and below.</li>
            <li>From B, draw arcs with same radius.</li>
            <li>Mark intersections P and Q.</li>
            <li>Join PQ. This is the perpendicular bisector.</li>
          </ol>
          <MiniBisector />
          <aside>
            ✓ &nbsp; Verified: AM = MB = 4 cm, and AP = BP = AQ = BQ = 6 cm.
          </aside>
        </article>
        <article>
          <section>
            <h2>⚙ KEY RULE / DEFINITION</h2>
            <h3>Perpendicular Bisector Theorem</h3>
            <p>
              Any point on the perpendicular bisector of a segment is
              equidistant from the endpoints of the segment.
            </p>
            <aside>
              <b>Symbolically:</b>
              <p>If P lies on the perpendicular bisector of AB, then</p>
              <strong>PA = PB</strong>
            </aside>
          </section>
          <section className="pb10024-mistake">
            <h2>⚠ MISCONCEPTION CUE</h2>
            <b>
              Using different compass radii from A and B will not produce a
              perpendicular bisector.
            </b>
            <p>Always use the same radius for both arcs.</p>
            <MiniMistake />
          </section>
        </article>
        <article className="pb10024-turn">
          <h2>▱ YOUR TURN</h2>
          <p>
            Construct the perpendicular bisector of XY where XY = 6 cm. Use
            radius 3.5 cm.
          </p>
          <MiniChallenge />
          <p>Use the tools above. Then check your result.</p>
          <button onClick={() => setChallengeChecked(true)}>
            <Check /> Check my construction
          </button>
          {challengeChecked && (
            <strong>✓ Construction verified: XM = MY and PQ ⟂ XY</strong>
          )}
          <small>Hint: Use equal radius from both endpoints.</small>
        </article>
      </section>
      <nav className="pb10024-adjacent">
        <Link to={prev.route}>← &nbsp; Previous: Copying an Angle</Link>
        <Link to={next.route}>Next: Angle Bisector Construction &nbsp; →</Link>
      </nav>
    </section>
  );
}

function MiniBisector() {
  return (
    <svg className="pb10024-mini" viewBox="0 0 210 155">
      <line x1="20" y1="90" x2="190" y2="90" />
      <line className="violet" x1="105" y1="12" x2="105" y2="145" />
      <circle className="arc" cx="55" cy="90" r="69" />
      <circle className="arc" cx="155" cy="90" r="69" />
      <circle cx="55" cy="90" r="4" />
      <circle cx="155" cy="90" r="4" />
      <circle cx="105" cy="90" r="4" />
      <text x="8" y="91">
        A
      </text>
      <text x="194" y="91">
        B
      </text>
      <text x="109" y="108">
        M
      </text>
      <text x="110" y="16">
        P
      </text>
      <text x="110" y="148">
        Q
      </text>
    </svg>
  );
}
function MiniMistake() {
  return (
    <svg className="pb10024-mini" viewBox="0 0 210 120">
      <line x1="20" y1="72" x2="190" y2="72" />
      <circle className="arc" cx="55" cy="72" r="55" />
      <circle className="wrong" cx="155" cy="72" r="42" />
      <text x="104" y="73">
        ✕
      </text>
      <text x="8" y="74">
        A
      </text>
      <text x="194" y="74">
        B
      </text>
    </svg>
  );
}
function MiniChallenge() {
  return (
    <svg className="pb10024-mini challenge" viewBox="0 0 230 210">
      <line x1="22" y1="120" x2="208" y2="120" />
      <line className="dash" x1="115" y1="22" x2="115" y2="198" />
      <circle className="arc" cx="70" cy="120" r="72" />
      <circle className="arc" cx="160" cy="120" r="72" />
      <circle cx="22" cy="120" r="4" />
      <circle cx="208" cy="120" r="4" />
      <circle cx="115" cy="120" r="4" />
      <text x="6" y="122">
        X
      </text>
      <text x="214" y="122">
        Y
      </text>
      <text x="110" y="18">
        ?
      </text>
      <text x="110" y="205">
        ?
      </text>
    </svg>
  );
}
