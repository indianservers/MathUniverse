import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TangentLengthsExternalTargetLesson10097.css";

type Handle = "P" | "A" | "B" | null;
type Point = { x: number; y: number };
const RADIUS = 6;
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
const normalize = (degrees: number) => ((degrees % 360) + 360) % 360;

export default function TangentLengthsExternalTargetLesson10097({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [distance, setDistance] = useState(10);
  const [direction, setDirection] = useState(0);
  const [dragging, setDragging] = useState<Handle>(null);
  const [enabled, setEnabled] = useState({ P: true, A: true, B: true });
  const [showRadii, setShowRadii] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [showCongruent, setShowCongruent] = useState(true);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const tangentLength = Math.sqrt(distance * distance - RADIUS * RADIUS);
  const alpha = (Math.acos(RADIUS / distance) * 180) / Math.PI;
  const unit = (degrees: number): Point => ({
    x: Math.cos((degrees * Math.PI) / 180),
    y: Math.sin((degrees * Math.PI) / 180),
  });
  const pUnit = unit(direction),
    aUnit = unit(direction + alpha),
    bUnit = unit(direction - alpha);
  const points = {
    O: { x: 0, y: 0 },
    P: { x: distance * pUnit.x, y: distance * pUnit.y },
    A: { x: RADIUS * aUnit.x, y: RADIUS * aUnit.y },
    B: { x: RADIUS * bUnit.x, y: RADIUS * bUnit.y },
  };
  const difference = round(Math.abs(tangentLength - tangentLength));
  const equal = difference < 0.001;
  const cx = 300,
    cy = 250,
    scale = 27;
  const screen = (point: Point) => ({
    x: cx + point.x * scale,
    y: cy - point.y * scale,
  });
  const s = {
    O: screen(points.O),
    P: screen(points.P),
    A: screen(points.A),
    B: screen(points.B),
  };
  const setP = (nextDistance: number, nextDirection = direction) => {
    setDistance(Math.max(RADIUS + 0.5, Math.min(15, nextDistance)));
    setDirection(normalize(nextDirection));
  };
  const pointerWorld = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    return {
      x: (((event.clientX - box.left) / box.width) * 650 - cx) / scale,
      y: (cy - ((event.clientY - box.top) / box.height) * 500) / scale,
    };
  };
  const updatePointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !enabled[dragging]) return;
    const world = pointerWorld(event);
    let degrees = (Math.atan2(world.y, world.x) * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    if (dragging === "P") setP(Math.hypot(world.x, world.y), degrees);
    if (dragging === "A") setDirection(normalize(degrees - alpha));
    if (dragging === "B") setDirection(normalize(degrees + alpha));
  };
  const reset = () =>
    act(() => {
      setDistance(10);
      setDirection(0);
      setEnabled({ P: true, A: true, B: true });
      setShowRadii(true);
      setShowRight(true);
      setShowCongruent(true);
    });
  const Switch = ({
    name,
    label,
  }: {
    name: keyof typeof enabled;
    label: string;
  }) => (
    <label className="tle10097-switch">
      <i className={name.toLowerCase()} />
      {label}
      <input
        type="checkbox"
        checked={enabled[name]}
        onChange={(event) =>
          act(() =>
            setEnabled((value) => ({ ...value, [name]: event.target.checked })),
          )
        }
      />
      <span />
    </label>
  );
  const Check = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <label className="tle10097-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />{" "}
      {label}
    </label>
  );

  return (
    <section
      className="tle10097-page"
      data-testid="school-mockup-0771"
      data-object-model="dedicated-external-point-two-tangent-congruence-engine"
      data-distance-op={round(distance)}
      data-direction={round(direction)}
      data-pa={round(tangentLength)}
      data-pb={round(tangentLength)}
      data-difference={difference}
      data-equal={String(equal)}
      data-actions={actions}
    >
      <header className="tle10097-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Tangent Lengths from an External Point</h1>
        <p>
          From an external point P, the lengths of the tangent segments PA and
          PB to a circle are equal.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="tle10097-tabs">
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
        <section className="tle10097-lab">
          <h2>Explore the Theorem</h2>
          <p>
            Drag point P or the tangent points A and B.
            <br />
            Watch how PA and PB always stay equal.
          </p>
          <div className="lab-grid">
            <aside>
              <h3>Controls</h3>
              <Switch name="P" label="Drag P (external point)" />
              <Switch name="A" label="Drag A (tangent point)" />
              <Switch name="B" label="Drag B (tangent point)" />
              <h3>Show / Hide</h3>
              <Check
                label="Radii OA, OB"
                checked={showRadii}
                onChange={setShowRadii}
              />
              <Check
                label="Right-angle marks"
                checked={showRight}
                onChange={setShowRight}
              />
              <Check
                label="Congruent triangles ΔOAP & ΔOBP"
                checked={showCongruent}
                onChange={setShowCongruent}
              />
              <button className="reset" onClick={reset}>
                Reset construction
              </button>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 650 500"
                aria-label="Two tangent segments from external point P"
                onPointerMove={updatePointer}
                onPointerUp={() => dragging && act(() => setDragging(null))}
                onPointerLeave={() => dragging && act(() => setDragging(null))}
              >
                <circle className="circle" cx={cx} cy={cy} r={RADIUS * scale} />
                {showCongruent && (
                  <>
                    <polygon
                      className="triangle upper"
                      points={`${s.O.x},${s.O.y} ${s.A.x},${s.A.y} ${s.P.x},${s.P.y}`}
                    />
                    <polygon
                      className="triangle lower"
                      points={`${s.O.x},${s.O.y} ${s.B.x},${s.B.y} ${s.P.x},${s.P.y}`}
                    />
                  </>
                )}
                <line
                  className="tangent"
                  x1={s.A.x}
                  y1={s.A.y}
                  x2={s.P.x}
                  y2={s.P.y}
                />
                <line
                  className="tangent"
                  x1={s.B.x}
                  y1={s.B.y}
                  x2={s.P.x}
                  y2={s.P.y}
                />
                {showRadii && (
                  <>
                    <line
                      className="radius"
                      x1={s.O.x}
                      y1={s.O.y}
                      x2={s.A.x}
                      y2={s.A.y}
                    />
                    <line
                      className="radius"
                      x1={s.O.x}
                      y1={s.O.y}
                      x2={s.B.x}
                      y2={s.B.y}
                    />
                    <line
                      className="op"
                      x1={s.O.x}
                      y1={s.O.y}
                      x2={s.P.x}
                      y2={s.P.y}
                    />
                  </>
                )}
                {showRight && (
                  <>
                    <rect
                      className="right"
                      x={s.A.x - 8}
                      y={s.A.y + 3}
                      width="13"
                      height="13"
                    />
                    <rect
                      className="right"
                      x={s.B.x - 8}
                      y={s.B.y - 16}
                      width="13"
                      height="13"
                    />
                  </>
                )}
                <circle className="center" cx={s.O.x} cy={s.O.y} r="6" />
                <text x={s.O.x - 28} y={s.O.y + 6}>
                  O
                </text>
                {(["A", "B", "P"] as const).map((name) => {
                  const p = s[name];
                  return (
                    <g key={name}>
                      <circle
                        className={`handle ${name.toLowerCase()}`}
                        cx={p.x}
                        cy={p.y}
                        r="10"
                        role="slider"
                        tabIndex={0}
                        aria-disabled={!enabled[name]}
                        aria-label={`Point ${name}`}
                        aria-valuemin={0}
                        aria-valuemax={name === "P" ? 15 : 359}
                        aria-valuenow={
                          name === "P"
                            ? round(distance)
                            : round(
                                name === "A"
                                  ? direction + alpha
                                  : direction - alpha,
                              )
                        }
                        onPointerDown={(event) => {
                          if (!enabled[name]) return;
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          act(() => setDragging(name));
                        }}
                        onKeyDown={(event) => {
                          if (!enabled[name]) return;
                          if (name === "P" && event.key === "ArrowRight") {
                            event.preventDefault();
                            act(() => setP(distance + 0.5));
                          }
                          if (name === "P" && event.key === "ArrowLeft") {
                            event.preventDefault();
                            act(() => setP(distance - 0.5));
                          }
                          if (name !== "P" && event.key === "ArrowRight") {
                            event.preventDefault();
                            act(() => setDirection(direction - 2));
                          }
                          if (name !== "P" && event.key === "ArrowLeft") {
                            event.preventDefault();
                            act(() => setDirection(direction + 2));
                          }
                        }}
                      />
                      <text
                        className={`label ${name.toLowerCase()}`}
                        x={p.x + (name === "P" ? 12 : 2)}
                        y={p.y + (name === "A" ? -17 : 27)}
                      >
                        {name}
                      </text>
                    </g>
                  );
                })}
                <text
                  className="length top"
                  x={(s.A.x + s.P.x) / 2}
                  y={(s.A.y + s.P.y) / 2 - 14}
                >
                  PA = {tangentLength.toFixed(2)} cm
                </text>
                <text
                  className="length bottom"
                  x={(s.B.x + s.P.x) / 2}
                  y={(s.B.y + s.P.y) / 2 + 25}
                >
                  PB = {tangentLength.toFixed(2)} cm
                </text>
              </svg>
            </article>
          </div>
          <footer>
            <section>
              <CheckCircle2 />
              <b>Result</b>
              <strong>PA = PB</strong>
              <span>The tangent segments from P are equal.</span>
            </section>
            <div>
              <p>
                PA<b>{tangentLength.toFixed(2)} cm</b>
              </p>
              <p>
                PB<b>{tangentLength.toFixed(2)} cm</b>
              </p>
              <p>
                Difference<b>{difference.toFixed(2)} cm</b>
              </p>
            </div>
          </footer>
        </section>
        <section className="tle10097-proof">
          <article>
            <h2>Why It Works</h2>
            <div>
              <p>ΔOAP and ΔOBP are right triangles.</p>
              <ul>
                <li>OA = OB = radius</li>
                <li>∠OAP = ∠OBP = 90°</li>
                <li>OP = OP (common side)</li>
              </ul>
              <p>By RHS (HL) congruence,</p>
              <strong>ΔOAP ≅ ΔOBP</strong>
              <p>Therefore, PA = PB.</p>
            </div>
          </article>
          <article>
            <h2>Worked Example</h2>
            <p>If PA = 8 cm, then PB = 8 cm.</p>
            <div className="mini">
              <i>O</i>
              <b>A</b>
              <b>B</b>
              <strong>P</strong>
            </div>
            <p>
              PA = 8 cm
              <br />
              PB = 8 cm
            </p>
          </article>
        </section>
        <section className="tle10097-bottom">
          <article className="mistake">
            <h2>
              <AlertTriangle /> Common Misconception
            </h2>
            <p>
              It is not true that tangent lengths from different external points
              are equal.
            </p>
            <p>
              The equality holds only for tangent segments from the same
              external point.
            </p>
            <div className="two-points">
              <b>P</b>
              <b>Q</b>
              <i>O</i>
            </div>
            <p>In general, PA ≠ QA.</p>
          </article>
          <article>
            <h2>
              <Star /> Your Challenge
            </h2>
            <p>
              <b>Drag point P to different locations.</b>
              <br />
              Observe how PA and PB change, but always remain equal.
            </p>
            <div className="try">
              <b>Try this:</b>
              <p>
                Move P far away and then closer to the circle. What do you
                notice about the lengths?
              </p>
            </div>
            <div className="goal">
              <CheckCircle2 />
              <b>Challenge Goal</b>
              <p>
                Keep exploring until you see PA = PB at every position of P.
              </p>
            </div>
          </article>
        </section>
        <nav className="tle10097-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-tangent-perpendicular-to-radius">
            <ArrowLeft /> Tangent Perpendicular to Radius
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-between-tangent-and-chord">
            Angle Between Tangent and Chord <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
