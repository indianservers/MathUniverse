import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Expand,
  MousePointer2,
  Move,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CyclicQuadrilateralTargetLesson10094.css";

type Name = "A" | "B" | "C" | "D";
type Vertex = { angle: number; radius: number };
type Point = { x: number; y: number };
const NAMES: Name[] = ["A", "B", "C", "D"];
const DEFAULTS: Record<Name, Vertex> = {
  A: { angle: 112, radius: 1 },
  B: { angle: 31, radius: 1 },
  C: { angle: 298, radius: 1 },
  D: { angle: 202, radius: 1 },
};
const round = (value: number, places = 1) =>
  Math.round(value * 10 ** places) / 10 ** places;
const pointFor = ({ angle, radius }: Vertex): Point => ({
  x: radius * Math.cos((angle * Math.PI) / 180),
  y: radius * Math.sin((angle * Math.PI) / 180),
});
const angleAt = (point: Point, before: Point, after: Point) => {
  const u = { x: before.x - point.x, y: before.y - point.y };
  const v = { x: after.x - point.x, y: after.y - point.y };
  const denominator = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  const cosine = (u.x * v.x + u.y * v.y) / denominator;
  return round((Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI);
};

export default function CyclicQuadrilateralTargetLesson10094({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [vertices, setVertices] = useState(DEFAULTS);
  const [dragging, setDragging] = useState<Name | null>(null);
  const [showCircle, setShowCircle] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showSums, setShowSums] = useState(true);
  const [snap, setSnap] = useState(false);
  const [tool, setTool] = useState<"select" | "move" | "fit" | "animate">(
    "select",
  );
  const [challengeRadius, setChallengeRadius] = useState(1.2);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [tab, setTab] = useState(0);
  const [randomStep, setRandomStep] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const points = Object.fromEntries(
    NAMES.map((name) => [name, pointFor(vertices[name])]),
  ) as Record<Name, Point>;
  const measures = {
    A: angleAt(points.A, points.D, points.B),
    B: angleAt(points.B, points.A, points.C),
    C: angleAt(points.C, points.B, points.D),
    D: angleAt(points.D, points.C, points.A),
  };
  const sumAC = round(measures.A + measures.C);
  const sumBD = round(measures.B + measures.D);
  const verticesOnCircle = NAMES.filter(
    (name) => Math.abs(vertices[name].radius - 1) < 0.015,
  ).length;
  const cyclic =
    verticesOnCircle === 4 &&
    Math.abs(sumAC - 180) < 0.2 &&
    Math.abs(sumBD - 180) < 0.2;
  const challengeOnCircle = Math.abs(challengeRadius - 1) < 0.015;
  const challengeCorrect = challengeChecked && challengeOnCircle;
  const cx = 342,
    cy = 260,
    radius = 205;
  const screen = (point: Point) => ({
    x: cx + point.x * radius,
    y: cy - point.y * radius,
  });
  const screenPoints = Object.fromEntries(
    NAMES.map((name) => [name, screen(points[name])]),
  ) as Record<Name, Point>;
  const polygon = NAMES.map(
    (name) => `${screenPoints[name].x},${screenPoints[name].y}`,
  ).join(" ");
  const setVertex = (name: Name, next: Vertex) => {
    setVertices((value) => ({ ...value, [name]: next }));
    setChallengeChecked(false);
  };
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 684 - cx;
    const y = cy - ((event.clientY - box.top) / box.height) * 520;
    let angle = (Math.atan2(y, x) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    const radial = snap
      ? 1
      : Math.max(0.55, Math.min(1.25, Math.hypot(x, y) / radius));
    setVertex(dragging, { angle, radius: radial });
  };
  const randomize = () =>
    act(() => {
      const step = (randomStep + 1) % 3;
      const sets = [
        [126, 43, 310, 214],
        [103, 18, 287, 190],
        [136, 54, 325, 226],
      ];
      setVertices(
        Object.fromEntries(
          NAMES.map((name, index) => [
            name,
            { angle: sets[step][index], radius: 1 },
          ]),
        ) as Record<Name, Vertex>,
      );
      setRandomStep(step);
      setChallengeChecked(false);
    });
  const reset = () =>
    act(() => {
      setVertices(DEFAULTS);
      setShowCircle(true);
      setShowAngles(true);
      setShowSums(true);
      setSnap(false);
      setTool("select");
      setChallengeRadius(1.2);
      setChallengeChecked(false);
      setRandomStep(0);
    });

  const Switch = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <label className="cyq10094-switch">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />
      <span>{checked ? "ON" : "OFF"}</span>
    </label>
  );

  return (
    <section
      className="cyq10094-page"
      data-testid="school-mockup-0768"
      data-object-model="dedicated-four-vertex-cyclic-quadrilateral-engine"
      data-vertices-on-circle={verticesOnCircle}
      data-angle-a={measures.A}
      data-angle-b={measures.B}
      data-angle-c={measures.C}
      data-angle-d={measures.D}
      data-sum-ac={sumAC}
      data-sum-bd={sumBD}
      data-cyclic={String(cyclic)}
      data-tool={tool}
      data-challenge-radius={round(challengeRadius, 2)}
      data-challenge-correct={String(challengeCorrect)}
      data-actions={actions}
    >
      <header className="cyq10094-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Cyclic Quadrilateral</h1>
        <p>
          A quadrilateral is cyclic when all four vertices lie on one circle.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset activity
        </button>
      </header>
      <nav className="cyq10094-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              onClick={() => act(() => setTab(index))}
            >
              {label}
            </button>
          ),
        )}
      </nav>
      <main>
        <section className="cyq10094-lab">
          <aside>
            <h2>DRAG · OBSERVE · CONSTRUCT</h2>
            <p>Drag any vertex to move it.</p>
            <Switch
              label="Show circle (fit)"
              checked={showCircle}
              onChange={setShowCircle}
            />
            <Switch
              label="Angle measures"
              checked={showAngles}
              onChange={setShowAngles}
            />
            <Switch
              label="Opposite sum check"
              checked={showSums}
              onChange={setShowSums}
            />
            <Switch label="Snap to circle" checked={snap} onChange={setSnap} />
            <button className="random" onClick={randomize}>
              <RotateCcw /> Random cyclic
            </button>
            <p className="tip">
              <b>Tip:</b> Keep all four points on the circle to maintain
              cyclicity.
            </p>
            <h3>Vertex coordinates</h3>
            {NAMES.map((name) => (
              <p className="coordinate" key={name}>
                <i className={`dot ${name.toLowerCase()}`} /> <b>{name}</b> (
                {(points[name].x * 6).toFixed(2)},{" "}
                {(points[name].y * 6).toFixed(2)})
              </p>
            ))}
            <p className={cyclic ? "status good" : "status bad"}>
              {cyclic ? <CheckCircle2 /> : <XCircle />} {verticesOnCircle} of 4
              vertices lie on the circle.
            </p>
          </aside>
          <article>
            <header>
              <div>
                <b className={cyclic ? "good" : "bad"}>
                  {cyclic ? <CheckCircle2 /> : <XCircle />}{" "}
                  {cyclic ? "CYCLIC QUADRILATERAL" : "NOT CYCLIC"}
                </b>
                <span>
                  {cyclic
                    ? "All four vertices lie on one circle."
                    : "Restore every vertex to the fitted circle."}
                </span>
              </div>
              <nav>
                {[
                  ["select", MousePointer2],
                  ["move", Move],
                  ["fit", Expand],
                  ["animate", Play],
                ].map(([value, Icon]) => (
                  <button
                    key={String(value)}
                    aria-label={`${value} tool`}
                    className={tool === value ? "active" : ""}
                    onClick={() => act(() => setTool(value as typeof tool))}
                  >
                    <Icon />
                  </button>
                ))}
              </nav>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 684 520"
              aria-label="Interactive cyclic quadrilateral construction"
              onPointerMove={updateFromPointer}
              onPointerUp={() => dragging && act(() => setDragging(null))}
              onPointerLeave={() => dragging && act(() => setDragging(null))}
            >
              {showCircle && (
                <circle className="fit-circle" cx={cx} cy={cy} r={radius} />
              )}
              <line
                className="diagonal"
                x1={screenPoints.A.x}
                y1={screenPoints.A.y}
                x2={screenPoints.C.x}
                y2={screenPoints.C.y}
              />
              <line
                className="diagonal"
                x1={screenPoints.B.x}
                y1={screenPoints.B.y}
                x2={screenPoints.D.x}
                y2={screenPoints.D.y}
              />
              <polygon className="quad" points={polygon} />
              <circle className="center" cx={cx} cy={cy} r="5" />
              <text x={cx + 8} y={cy - 8}>
                O
              </text>
              {NAMES.map((name, index) => {
                const p = screenPoints[name];
                return (
                  <g key={name}>
                    {showAngles && (
                      <circle
                        className={`angle-fill n${index}`}
                        cx={p.x}
                        cy={p.y}
                        r="32"
                      />
                    )}
                    <circle
                      className={`vertex ${name.toLowerCase()}`}
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      role="slider"
                      tabIndex={0}
                      aria-label={`Vertex ${name}`}
                      aria-valuemin={0}
                      aria-valuemax={359}
                      aria-valuenow={round(vertices[name].angle)}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(name));
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, {
                              ...vertices[name],
                              angle: vertices[name].angle + 3,
                            }),
                          );
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, {
                              ...vertices[name],
                              angle: vertices[name].angle - 3,
                            }),
                          );
                        }
                        if (event.key === "ArrowDown" && !snap) {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, {
                              ...vertices[name],
                              radius: 0.82,
                            }),
                          );
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, { ...vertices[name], radius: 1 }),
                          );
                        }
                      }}
                    />
                    <text
                      className="vertex-label"
                      x={p.x + (name === "D" ? -25 : 12)}
                      y={p.y + (name === "A" ? -14 : 22)}
                    >
                      {name}
                    </text>
                    {showAngles && (
                      <text
                        className={`measure n${index}`}
                        x={p.x + (name === "D" ? 22 : -2)}
                        y={p.y + (name === "A" ? 44 : name === "C" ? -30 : 3)}
                      >
                        {measures[name].toFixed(1)}°
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <footer>
              <section>
                <h3>OPPOSITE ANGLE SUMS</h3>
                {showSums ? (
                  <>
                    <p>
                      ∠A + ∠C = {measures.A}° + {measures.C}° = <b>{sumAC}°</b>{" "}
                      {Math.abs(sumAC - 180) < 0.2 ? (
                        <CheckCircle2 />
                      ) : (
                        <XCircle />
                      )}
                    </p>
                    <p>
                      ∠B + ∠D = {measures.B}° + {measures.D}° = <b>{sumBD}°</b>{" "}
                      {Math.abs(sumBD - 180) < 0.2 ? (
                        <CheckCircle2 />
                      ) : (
                        <XCircle />
                      )}
                    </p>
                    <small>Each sum should be 180°.</small>
                  </>
                ) : (
                  <p>Opposite-sum layer hidden.</p>
                )}
              </section>
              <section>
                <h3>CYCLIC CHECK</h3>
                <p>
                  Vertices on circle: <b>{verticesOnCircle} of 4</b>
                </p>
                <p>
                  Result: <b>{cyclic ? "Cyclic" : "Not cyclic"}</b>{" "}
                  {cyclic ? <CheckCircle2 /> : <XCircle />}
                </p>
              </section>
            </footer>
          </article>
        </section>

        <section className="cyq10094-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              A quadrilateral is cyclic if and only if each pair of opposite
              angles is supplementary.
            </p>
            <strong>∠A + ∠C = 180° and ∠B + ∠D = 180°</strong>
            <p>
              <CheckCircle2 /> All four vertices are concyclic.
            </p>
            <p>
              <CheckCircle2 /> The angle sums follow from common arcs.
            </p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Consider rectangle ABCD.</p>
            <div className="mini cyclic">
              <b>A</b>
              <b>B</b>
              <b>C</b>
              <b>D</b>
            </div>
            <p>
              Each interior angle = 90°.
              <br />
              ∠A + ∠C = 180°
              <br />
              ∠B + ∠D = 180°
            </p>
            <b>Hence, ABCD is cyclic.</b>
          </article>
          <article className="warning">
            <h2>WARNING: COMMON MISTAKE</h2>
            <p>
              Drawing a circle near four points does not prove they are cyclic.
            </p>
            <div className="mini noncyclic">
              <b>A</b>
              <b>B</b>
              <b>C</b>
              <b>D</b>
            </div>
            <strong>
              <XCircle /> Not cyclic
            </strong>
            <p>Vertex C is not on the circle.</p>
          </article>
        </section>

        <section className="cyq10094-challenge">
          <aside>
            <h2>CHALLENGE</h2>
            <p>Move vertex B off the circle. Can you restore cyclicity?</p>
            <ol>
              <li>Move B anywhere off the circle.</li>
              <li>Adjust its radius back to the fitted circle.</li>
              <li>Check the cyclic result.</li>
            </ol>
            <button onClick={() => act(() => setChallengeChecked(true))}>
              Check answer
            </button>
          </aside>
          <article>
            <h3>Your current figure</h3>
            <div className="challenge-figure">
              <span>A</span>
              <span
                style={{
                  transform: `translate(${round((challengeRadius - 1) * 90)}px,-8px)`,
                }}
              >
                B
              </span>
              <span>C</span>
              <span>D</span>
            </div>
            <label>
              Vertex B radius{" "}
              <input
                aria-label="Challenge vertex B radius"
                type="range"
                min=".7"
                max="1.25"
                step=".01"
                value={challengeRadius}
                onChange={(event) =>
                  act(() => {
                    setChallengeRadius(+event.target.value);
                    setChallengeChecked(false);
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => {
                      setChallengeRadius((value) =>
                        Math.max(0.7, round(value - 0.01, 2)),
                      );
                      setChallengeChecked(false);
                    });
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => {
                      setChallengeRadius((value) =>
                        Math.min(1.25, round(value + 0.01, 2)),
                      );
                      setChallengeChecked(false);
                    });
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    act(() => {
                      setChallengeRadius(1);
                      setChallengeChecked(false);
                    });
                  }
                }}
              />
            </label>
          </article>
          <article className="challenge-status">
            <h3>Status</h3>
            <strong className={challengeOnCircle ? "good" : "bad"}>
              {challengeOnCircle ? "CYCLIC" : "NOT CYCLIC"}
            </strong>
            <p>
              Vertices on circle:{" "}
              <b>{challengeOnCircle ? "4 of 4" : "3 of 4"}</b>
            </p>
            <p>
              Opposite angle condition:{" "}
              <b>{challengeOnCircle ? "satisfied" : "not satisfied"}</b>
            </p>
            {challengeChecked && (
              <p className={challengeCorrect ? "good" : "bad"}>
                {challengeCorrect
                  ? "Correct! Cyclicity restored."
                  : "Move B onto the circle before checking."}
              </p>
            )}
          </article>
        </section>
        <nav className="cyq10094-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angles-in-the-same-segment">
            <ArrowLeft /> Angles in the Same Segment
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-opposite-angles-of-a-cyclic-quadrilateral">
            Opposite Angles of a Cyclic Quadrilateral <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
