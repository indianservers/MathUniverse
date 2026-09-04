import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AnglesSameSegmentTargetLesson10093.css";

type PointName = "C" | "D";
type Point = { x: number; y: number };
const A_ANGLE = 218;
const B_ANGLE = 322;
const round = (value: number, places = 1) =>
  Math.round(value * 10 ** places) / 10 ** places;
const unit = (degrees: number): Point => ({
  x: Math.cos((degrees * Math.PI) / 180),
  y: Math.sin((degrees * Math.PI) / 180),
});
const angleAt = (p: Point, a: Point, b: Point) => {
  const u = { x: a.x - p.x, y: a.y - p.y };
  const v = { x: b.x - p.x, y: b.y - p.y };
  const cosine =
    (u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y));
  return round((Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI);
};

export default function AnglesSameSegmentTargetLesson10093({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angles, setAngles] = useState({ C: 125, D: 55 });
  const [dragging, setDragging] = useState<PointName | null>(null);
  const [answer, setAnswer] = useState<"equal" | "supplementary" | null>(null);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const a = unit(A_ANGLE);
  const b = unit(B_ANGLE);
  const c = unit(angles.C);
  const d = unit(angles.D);
  const angleC = angleAt(c, a, b);
  const angleD = angleAt(d, a, b);
  const chordSide = (p: Point) =>
    Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x));
  const sameSegment = chordSide(c) === chordSide(d);
  const difference = round(Math.abs(angleC - angleD));
  const sum = round(angleC + angleD);
  const correct = answer === (sameSegment ? "equal" : "supplementary");
  const cx = 355,
    cy = 260,
    radius = 205;
  const screen = (point: Point) => ({
    x: cx + radius * point.x,
    y: cy - radius * point.y,
  });
  const pa = screen(a),
    pb = screen(b),
    pc = screen(c),
    pd = screen(d);
  const setPoint = (name: PointName, degrees: number) => {
    const normalized = (degrees + 360) % 360;
    setAngles((value) => ({ ...value, [name]: normalized }));
    setAnswer(null);
  };
  const pointerAngle = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return 0;
    const x = ((event.clientX - box.left) / box.width) * 710 - cx;
    const y = cy - ((event.clientY - box.top) / box.height) * 520;
    let degrees = (Math.atan2(y, x) * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    return degrees;
  };
  const reset = () =>
    act(() => {
      setAngles({ C: 125, D: 55 });
      setDragging(null);
      setAnswer(null);
    });

  return (
    <section
      className="ass10093-page"
      data-testid="school-mockup-0767"
      data-object-model="dedicated-two-point-same-segment-inscribed-angle-engine"
      data-c-angle={round(angles.C)}
      data-d-angle={round(angles.D)}
      data-angle-c={angleC}
      data-angle-d={angleD}
      data-difference={difference}
      data-sum={sum}
      data-relation={sameSegment ? "equal" : "supplementary"}
      data-answer={answer ?? "none"}
      data-correct={String(correct)}
      data-actions={actions}
    >
      <header className="ass10093-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Angles in the Same Segment</h1>
        <p>
          Angles standing on the same chord in the same segment of a circle are
          equal.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="ass10093-tabs">
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
        <section className="ass10093-explore">
          <header>
            <h2>Explore the theorem</h2>
            <p>Drag points C and D along the circle.</p>
          </header>
          <aside>
            <div
              className={
                sameSegment
                  ? "ass10093-theorem-result"
                  : "ass10093-theorem-result opposite"
              }
            >
              {sameSegment ? <CheckCircle2 /> : <Info />}
              <b>Result</b>
              <strong>
                {sameSegment ? "∠ACB = ∠ADB" : "∠ACB + ∠ADB = 180°"}
              </strong>
              <span>
                {sameSegment
                  ? "The angles are equal."
                  : "The angles are supplementary."}
              </span>
            </div>
            <div className="measures">
              <p>
                ∠ACB<b>{angleC.toFixed(1)}°</b>
              </p>
              <p>
                ∠ADB<b>{angleD.toFixed(1)}°</b>
              </p>
              <p>
                {sameSegment ? "Difference" : "Sum"}
                <b>{(sameSegment ? difference : sum).toFixed(1)}°</b>
              </p>
            </div>
            <p className="notice">
              <Info /> C and D may move anywhere on the circle. Their chord-side
              relation drives the result.
            </p>
          </aside>
          <article>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <svg
              ref={svgRef}
              viewBox="0 0 710 520"
              aria-label="Two draggable angles standing on chord AB"
              onPointerMove={(event) =>
                dragging && setPoint(dragging, pointerAngle(event))
              }
              onPointerUp={() => dragging && act(() => setDragging(null))}
              onPointerLeave={() => dragging && act(() => setDragging(null))}
            >
              <defs>
                <pattern
                  id="ass-dots"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" />
                </pattern>
              </defs>
              <rect
                className="dots"
                width="710"
                height="520"
                fill="url(#ass-dots)"
              />
              <circle className="circle" cx={cx} cy={cy} r={radius} />
              <line className="radius" x1={cx} y1={cy} x2={pa.x} y2={pa.y} />
              <line className="radius" x1={cx} y1={cy} x2={pb.x} y2={pb.y} />
              <line className="chord" x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} />
              {[pc, pd].map((p, index) => (
                <g key={index}>
                  <line
                    className="side"
                    x1={p.x}
                    y1={p.y}
                    x2={pa.x}
                    y2={pa.y}
                  />
                  <line
                    className="side"
                    x1={p.x}
                    y1={p.y}
                    x2={pb.x}
                    y2={pb.y}
                  />
                </g>
              ))}
              <circle className="center" cx={cx} cy={cy} r="5" />
              <text x={cx + 8} y={cy - 8}>
                O
              </text>
              <text className="central-label" x={cx - 42} y={cy + 86}>
                ∠AOB = 104.0°
              </text>
              <circle className="fixed" cx={pa.x} cy={pa.y} r="7" />
              <text x={pa.x - 20} y={pa.y + 28}>
                A
              </text>
              <circle className="fixed" cx={pb.x} cy={pb.y} r="7" />
              <text x={pb.x + 10} y={pb.y + 28}>
                B
              </text>
              {(["C", "D"] as PointName[]).map((name) => {
                const p = name === "C" ? pc : pd;
                return (
                  <g key={name}>
                    <circle
                      className="drag-point"
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      role="slider"
                      tabIndex={0}
                      aria-label={`Point ${name} on circle`}
                      aria-valuemin={0}
                      aria-valuemax={359}
                      aria-valuenow={round(angles[name])}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(name));
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          act(() => setPoint(name, angles[name] + 3));
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          act(() => setPoint(name, angles[name] - 3));
                        }
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          act(() => setPoint(name, 270));
                        }
                      }}
                    />
                    <text className="point-label" x={p.x + 10} y={p.y - 13}>
                      {name}
                    </text>
                  </g>
                );
              })}
              <text className="angle-label" x={pc.x - 26} y={pc.y + 54}>
                {angleC.toFixed(1)}°
              </text>
              <text className="angle-label" x={pd.x - 8} y={pd.y + 54}>
                {angleD.toFixed(1)}°
              </text>
            </svg>
          </article>
        </section>

        <section className="ass10093-why">
          <h2>Why this is true</h2>
          <p>
            The central angle subtended by chord AB is twice the angle at the
            circumference standing on the same chord in the same segment.
          </p>
          <p>So ∠ACB = ∠ADB = ½ ∠AOB = ½ × 104.0° = 52.0°.</p>
        </section>

        <section className="ass10093-cards">
          <article>
            <h2>Worked Example</h2>
            <p>
              In the figure, AB is a chord of a circle with centre O. ∠ACB =
              58°. Find ∠ADB.
            </p>
            <div className="mini same">
              <i>C</i>
              <i>D</i>
              <b>A</b>
              <b>B</b>
            </div>
            <p>
              <b>Solution</b>
            </p>
            <p>Since C and D lie on the same segment of chord AB,</p>
            <strong>∴ ∠ADB = 58°</strong>
          </article>
          <article className="misconception">
            <h2>
              <AlertTriangle /> Common Misconception
            </h2>
            <p>Points on opposite segments do not give equal angles.</p>
            <p>They give supplementary angles.</p>
            <div className="mini opposite">
              <i>C</i>
              <i>D</i>
              <b>A</b>
              <b>B</b>
            </div>
            <strong>
              If C and D lie on opposite segments of AB, then ∠ACB + ∠ADB =
              180°.
            </strong>
          </article>
          <article>
            <h2>Quick Check</h2>
            <p>Move C and D independently. What happens to the angles?</p>
            <p className="check">
              <CheckCircle2 /> Same segment
              <br />
              <b>∠ACB = ∠ADB</b>
            </p>
            <p className="check bad">
              <AlertTriangle /> Opposite segments
              <br />
              <b>∠ACB + ∠ADB = 180°</b>
            </p>
            <p className="check">
              <Info /> Press Arrow Down on a point to cross the chord.
            </p>
          </article>
        </section>

        <section className="ass10093-challenge">
          <h2>Your Challenge</h2>
          <p>
            Drag points C and D anywhere on the circle. Classify the
            relationship between the angles.
          </p>
          <div>
            <button
              className={answer === "equal" ? "selected" : ""}
              onClick={() => act(() => setAnswer("equal"))}
            >
              Equal (same segment)<span>∠ACB = ∠ADB</span>
            </button>
            <button
              className={answer === "supplementary" ? "selected" : ""}
              onClick={() => act(() => setAnswer("supplementary"))}
            >
              Supplementary (opposite segments)<span>∠ACB + ∠ADB = 180°</span>
            </button>
          </div>
          {answer && (
            <strong className={correct ? "correct" : "incorrect"}>
              {correct
                ? "Correct. The classification matches the current geometry."
                : "Check which side of chord AB contains each point."}
            </strong>
          )}
        </section>
        <section className="ass10093-goal">
          <b>Goal:</b> Observe when the relationship changes and explain why.
        </section>
        <nav className="ass10093-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-in-a-semicircle">
            <ArrowLeft /> Angle in a Semicircle
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral">
            Cyclic Quadrilateral <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
