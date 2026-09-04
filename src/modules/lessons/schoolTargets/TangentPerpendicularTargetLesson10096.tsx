import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TangentPerpendicularTargetLesson10096.css";

type DragTarget = "point" | "line" | null;
const RADIUS = 6;
const round = (value: number, places = 1) =>
  Math.round(value * 10 ** places) / 10 ** places;
const normalize = (degrees: number) => ((degrees % 360) + 360) % 360;
const lineNormalize = (degrees: number) => ((degrees % 180) + 180) % 180;
const angleBetween = (a: number, b: number) => {
  const delta = Math.abs(lineNormalize(a) - lineNormalize(b));
  return round(Math.min(delta, 180 - delta));
};

export default function TangentPerpendicularTargetLesson10096({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [tAngle, setTAngle] = useState(270);
  const [lineAngle, setLineAngle] = useState(0);
  const [lineOffset, setLineOffset] = useState(0);
  const [dragging, setDragging] = useState<DragTarget>(null);
  const [showRadius, setShowRadius] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAngle, setShowAngle] = useState(true);
  const [snap, setSnap] = useState(true);
  const [mode, setMode] = useState<"tangent" | "secant" | "none">("tangent");
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const theta = (tAngle * Math.PI) / 180;
  const phi = (lineAngle * Math.PI) / 180;
  const t = { x: RADIUS * Math.cos(theta), y: RADIUS * Math.sin(theta) };
  const direction = { x: Math.cos(phi), y: Math.sin(phi) };
  const normal = { x: -Math.sin(phi), y: Math.cos(phi) };
  const base = {
    x: t.x + normal.x * lineOffset,
    y: t.y + normal.y * lineOffset,
  };
  const signedDistance = base.x * normal.x + base.y * normal.y;
  const distance = round(Math.abs(signedDistance), 2);
  const intersections =
    distance > RADIUS + 0.02 ? 0 : Math.abs(distance - RADIUS) <= 0.02 ? 1 : 2;
  const radiusLineAngle = angleBetween(tAngle, lineAngle);
  const perpendicular =
    intersections === 1 && Math.abs(radiusLineAngle - 90) < 0.2;
  const status =
    intersections === 1
      ? "TANGENT"
      : intersections === 2
        ? "SECANT"
        : "NO INTERSECTION";
  const cx = 342,
    cy = 250,
    scale = 35;
  const screen = (point: { x: number; y: number }) => ({
    x: cx + point.x * scale,
    y: cy - point.y * scale,
  });
  const st = screen(t),
    sb = screen(base);
  const screenDirection = { x: direction.x, y: -direction.y };
  const lineStart = {
    x: sb.x - screenDirection.x * 290,
    y: sb.y - screenDirection.y * 290,
  };
  const lineEnd = {
    x: sb.x + screenDirection.x * 290,
    y: sb.y + screenDirection.y * 290,
  };
  const rotateHandle = {
    x: sb.x + screenDirection.x * 220,
    y: sb.y + screenDirection.y * 220,
  };
  const foot = screen({
    x: normal.x * signedDistance,
    y: normal.y * signedDistance,
  });
  const setPointAngle = (value: number) => {
    const next = normalize(value);
    setTAngle(next);
    if (snap) {
      setLineAngle(lineNormalize(next + 90));
      setLineOffset(0);
      setMode("tangent");
    }
  };
  const setDirection = (value: number) => {
    const next = lineNormalize(value);
    setLineAngle(next);
    setLineOffset(0);
    const nextAngle = angleBetween(tAngle, next);
    setMode(Math.abs(nextAngle - 90) < 0.2 ? "tangent" : "secant");
  };
  const chooseMode = (next: typeof mode) =>
    act(() => {
      setMode(next);
      if (next === "tangent") {
        setLineAngle(lineNormalize(tAngle + 90));
        setLineOffset(0);
      }
      if (next === "secant") {
        setLineAngle(lineNormalize(tAngle + 64));
        setLineOffset(0);
      }
      if (next === "none") {
        const tangentAngle = lineNormalize(tAngle + 90);
        const tangentRadians = (tangentAngle * Math.PI) / 180;
        const tangentNormal = {
          x: -Math.sin(tangentRadians),
          y: Math.cos(tangentRadians),
        };
        const tangentSigned = t.x * tangentNormal.x + t.y * tangentNormal.y;
        setLineAngle(tangentAngle);
        setLineOffset(Math.sign(tangentSigned) || 1);
      }
    });
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const x = ((event.clientX - box.left) / box.width) * 684 - cx;
    const y = cy - ((event.clientY - box.top) / box.height) * 500;
    let degrees = (Math.atan2(y, x) * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    if (dragging === "point") setPointAngle(degrees);
    else setDirection(degrees);
  };
  const reset = () =>
    act(() => {
      setTAngle(270);
      setLineAngle(0);
      setLineOffset(0);
      setShowRadius(true);
      setShowDistance(true);
      setShowAngle(true);
      setSnap(true);
      setMode("tangent");
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
    <label className="tpr10096-switch">
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
      className="tpr10096-page"
      data-testid="school-mockup-0770"
      data-object-model="dedicated-tangent-line-distance-intersection-engine"
      data-t-angle={round(tAngle)}
      data-line-angle={round(lineAngle)}
      data-line-offset={round(lineOffset, 2)}
      data-distance={distance}
      data-intersections={intersections}
      data-contact-angle={radiusLineAngle}
      data-status={status.toLowerCase().replace(" ", "-")}
      data-perpendicular={String(perpendicular)}
      data-mode={mode}
      data-actions={actions}
    >
      <header className="tpr10096-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Tangent Perpendicular to Radius</h1>
        <p>
          Understand why a tangent at a point on a circle is perpendicular to
          the radius through that point.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="tpr10096-tabs">
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
        <section className="tpr10096-lab">
          <h2>INTERACTIVE EXPLORATION</h2>
          <p>
            Drag point T on the circle and rotate line ℓ. Observe and discover.
          </p>
          <div className="lab-grid">
            <aside>
              <section>
                <h3>
                  <b>1</b> Drag tangent point T
                </h3>
                <label>
                  Move T on the circle
                  <input
                    aria-label="Tangent point angle"
                    type="range"
                    min="0"
                    max="359"
                    value={tAngle}
                    onChange={(event) =>
                      act(() => setPointAngle(+event.target.value))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setPointAngle(tAngle + 2));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setPointAngle(tAngle - 2));
                      }
                    }}
                  />
                </label>
                <p>
                  T angle <b>{round(tAngle)}°</b>
                </p>
              </section>
              <section>
                <h3>
                  <b>2</b> Rotate line ℓ
                </h3>
                <label>
                  Rotate the purple line
                  <input
                    aria-label="Tangent line angle"
                    type="range"
                    min="0"
                    max="179"
                    value={lineAngle}
                    onChange={(event) =>
                      act(() => setDirection(+event.target.value))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setDirection(lineAngle - 1));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setDirection(lineAngle + 1));
                      }
                    }}
                  />
                </label>
                <p>
                  Angle of ℓ <b>{round(lineAngle)}°</b>
                </p>
              </section>
              <section>
                <h3>Display options</h3>
                <Switch
                  label="Show radius OT"
                  checked={showRadius}
                  onChange={setShowRadius}
                />
                <Switch
                  label="Show shortest distance"
                  checked={showDistance}
                  onChange={setShowDistance}
                />
                <Switch
                  label="Show angle ∠OTℓ"
                  checked={showAngle}
                  onChange={setShowAngle}
                />
                <Switch
                  label="Snap to perpendicular"
                  checked={snap}
                  onChange={setSnap}
                />
              </section>
              <section>
                <h3>Comparison mode</h3>
                <div className="modes">
                  {(["tangent", "secant", "none"] as const).map((value) => (
                    <button
                      key={value}
                      className={mode === value ? "active" : ""}
                      onClick={() => chooseMode(value)}
                    >
                      {value[0].toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
                <button className="reset" onClick={reset}>
                  <RotateCcw /> Reset
                </button>
              </section>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 684 500"
                aria-label="Tangent line and radius interactive diagram"
                onPointerMove={pointer}
                onPointerUp={() => dragging && act(() => setDragging(null))}
                onPointerLeave={() => dragging && act(() => setDragging(null))}
              >
                <circle className="circle" cx={cx} cy={cy} r={RADIUS * scale} />
                {showRadius && (
                  <line
                    className="radius"
                    x1={cx}
                    y1={cy}
                    x2={st.x}
                    y2={st.y}
                  />
                )}
                {showDistance && (
                  <line
                    className="distance"
                    x1={cx}
                    y1={cy}
                    x2={foot.x}
                    y2={foot.y}
                  />
                )}
                <line
                  className={`line ${status.toLowerCase().replace(" ", "-")}`}
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                />
                <circle className="center" cx={cx} cy={cy} r="5" />
                <text x={cx + 9} y={cy - 10}>
                  O
                </text>
                <circle
                  className="contact"
                  cx={st.x}
                  cy={st.y}
                  r="10"
                  role="slider"
                  tabIndex={0}
                  aria-label="Tangent point T"
                  aria-valuemin={0}
                  aria-valuemax={359}
                  aria-valuenow={round(tAngle)}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    act(() => setDragging("point"));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      act(() => setPointAngle(tAngle + 2));
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      act(() => setPointAngle(tAngle - 2));
                    }
                  }}
                />
                <text className="t-label" x={st.x - 8} y={st.y + 30}>
                  T
                </text>
                <circle
                  className="rotate-handle"
                  cx={rotateHandle.x}
                  cy={rotateHandle.y}
                  r="8"
                  role="slider"
                  tabIndex={0}
                  aria-label="Rotate tangent line"
                  aria-valuemin={0}
                  aria-valuemax={179}
                  aria-valuenow={round(lineAngle)}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    act(() => setDragging("line"));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      act(() => setDirection(lineAngle - 1));
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      act(() => setDirection(lineAngle + 1));
                    }
                  }}
                />
                {showRadius && (
                  <text
                    className="radius-label"
                    x={(cx + st.x) / 2 + 10}
                    y={(cy + st.y) / 2}
                  >
                    OT = 6.00
                  </text>
                )}
                {showAngle && (
                  <text
                    className={
                      perpendicular ? "angle-label good" : "angle-label bad"
                    }
                    x={st.x + 22}
                    y={st.y - 25}
                  >
                    {radiusLineAngle.toFixed(1)}°
                  </text>
                )}
                <text className="ell" x={lineEnd.x - 20} y={lineEnd.y - 12}>
                  ℓ
                </text>
              </svg>
              <p className="instruction">
                Drag T or rotate ℓ until the line just touches the circle at T.
                <br />
                <b>The radius OT will be perpendicular to ℓ.</b>
              </p>
            </article>
            <aside className={`status ${perpendicular ? "good" : "bad"}`}>
              <h3>STATUS: {status}</h3>
              <p>
                Intersections: <b>{intersections}</b>
              </p>
              <p>
                Distance d(O,ℓ): <b>{distance.toFixed(2)}</b>
              </p>
              <p>
                ∠OTℓ: <b>{radiusLineAngle.toFixed(1)}°</b>
              </p>
              <strong>
                {perpendicular ? (
                  <>
                    <CheckCircle2 /> Perpendicular
                  </>
                ) : (
                  "Adjust the line"
                )}
              </strong>
            </aside>
          </div>
        </section>
        <section className="tpr10096-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Among all lines through T, the radius OT is the shortest distance
              from O to a tangent line.
            </p>
            <p>
              A shortest distance is perpendicular to that line. Therefore the
              tangent at T is perpendicular to OT.
            </p>
            <div className="mini tangent">
              <i>O</i>
              <b>T</b>
            </div>
            <strong>d(O,ℓ) = OT = 6.00 (minimum)</strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Given:</b> Circle O with radius 6 units. If OT is vertical and
              ℓ is tangent at T:
            </p>
            <ol>
              <li>OT is a radius, so OT = 6.</li>
              <li>A tangent at T is perpendicular to OT.</li>
            </ol>
            <div className="mini tangent">
              <i>O</i>
              <b>T</b>
            </div>
            <strong>Result: ℓ is horizontal and ∠OTℓ = 90°.</strong>
          </article>
          <article className="mistake">
            <h2>
              <AlertTriangle /> A COMMON MISCONCEPTION
            </h2>
            <p>
              A line that looks like it touches the circle may actually be a
              secant.
            </p>
            <p>
              A secant intersects the circle at two points, so it is not the
              tangent.
            </p>
            <div className="mini secant">
              <i>O</i>
              <b>A</b>
              <b>B</b>
            </div>
            <strong>This line is a secant, not a tangent.</strong>
          </article>
        </section>
        <section className="tpr10096-challenge">
          <h2>YOUR CHALLENGE</h2>
          <p>
            Rotate ℓ until it is tangent to the circle at T and verify the
            angle.
          </p>
          <div>
            <section>
              <h3>Tasks</h3>
              <p>1 Set the line so there is exactly one intersection.</p>
              <p>2 The shortest distance from O to ℓ equals OT.</p>
              <p>3 The angle ∠OTℓ must be 90°.</p>
            </section>
            <section className="challenge-figure">
              <div className={perpendicular ? "right" : "tilted"}>
                <i>O</i>
                <b>T</b>
                <span>ℓ</span>
              </div>
            </section>
            <section>
              <h3>Live checks</h3>
              <p>Intersections = 1 {intersections === 1 && <CheckCircle2 />}</p>
              <p>
                d(O,ℓ) = OT{" "}
                {Math.abs(distance - RADIUS) < 0.02 && <CheckCircle2 />}
              </p>
              <p>∠OTℓ = 90° {perpendicular && <CheckCircle2 />}</p>
              {perpendicular && (
                <strong>
                  <Trophy /> Well done! ℓ is tangent at T.
                </strong>
              )}
            </section>
          </div>
        </section>
        <p className="tpr10096-tip">
          Tip: Enable “Snap to perpendicular” to lock ℓ at exactly 90°.
        </p>
        <nav className="tpr10096-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-opposite-angles-of-a-cyclic-quadrilateral">
            <ArrowLeft /> Opposite Angles of a Cyclic Quadrilateral
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-tangent-lengths-from-an-external-point">
            Tangent Lengths from an External Point <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
