import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./OppositeCyclicAnglesTargetLesson10095.css";

type Name = "A" | "B" | "C" | "D";
type Point = { x: number; y: number };
const NAMES: Name[] = ["A", "B", "C", "D"];
const DEFAULT_ANGLES: Record<Name, number> = { A: 110, B: 30, C: 258, D: 166 };
const round = (value: number, places = 1) =>
  Math.round(value * 10 ** places) / 10 ** places;
const pointFor = (degrees: number): Point => ({
  x: Math.cos((degrees * Math.PI) / 180),
  y: Math.sin((degrees * Math.PI) / 180),
});
const measureAt = (point: Point, before: Point, after: Point) => {
  const u = { x: before.x - point.x, y: before.y - point.y };
  const v = { x: after.x - point.x, y: after.y - point.y };
  const cosine =
    (u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y));
  return round((Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI);
};

export default function OppositeCyclicAnglesTargetLesson10095({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [positions, setPositions] = useState(DEFAULT_ANGLES);
  const [dragging, setDragging] = useState<Name | null>(null);
  const [showAngles, setShowAngles] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  const [showSums, setShowSums] = useState(true);
  const [showCenter, setShowCenter] = useState(true);
  const [targetA, setTargetA] = useState(95);
  const [prediction, setPrediction] = useState("");
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const points = Object.fromEntries(
    NAMES.map((name) => [name, pointFor(positions[name])]),
  ) as Record<Name, Point>;
  const measures = {
    A: measureAt(points.A, points.D, points.B),
    B: measureAt(points.B, points.A, points.C),
    C: measureAt(points.C, points.B, points.D),
    D: measureAt(points.D, points.C, points.A),
  };
  const sums = {
    AC: round(measures.A + measures.C),
    BD: round(measures.B + measures.D),
  };
  const balanced =
    Math.abs(sums.AC - 180) < 0.2 && Math.abs(sums.BD - 180) < 0.2;
  const arcs = {
    BC: round(2 * measures.A),
    CD: round(2 * measures.B),
    DA: round(2 * measures.C),
    AB: round(2 * measures.D),
  };
  const expectedC = round(180 - targetA);
  const predictionCorrect =
    checked &&
    prediction.trim() !== "" &&
    Math.abs(Number(prediction) - expectedC) < 0.01;
  const cx = 342,
    cy = 250,
    radius = 186;
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
  const setPoint = (name: Name, angle: number) => {
    setPositions((value) => ({ ...value, [name]: (angle + 360) % 360 }));
  };
  const pointerAngle = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return 0;
    const x = ((event.clientX - box.left) / box.width) * 684 - cx;
    const y = cy - ((event.clientY - box.top) / box.height) * 500;
    let degrees = (Math.atan2(y, x) * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    return degrees;
  };
  const reset = () =>
    act(() => {
      setPositions(DEFAULT_ANGLES);
      setShowAngles(true);
      setShowArcs(true);
      setShowSums(true);
      setShowCenter(true);
      setTargetA(95);
      setPrediction("");
      setChecked(false);
    });
  const Switch = ({
    label,
    checked: value,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (next: boolean) => void;
  }) => (
    <label className="oca10095-switch">
      {label}
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />
      <span />
    </label>
  );

  return (
    <section
      className="oca10095-page"
      data-testid="school-mockup-0769"
      data-object-model="dedicated-cyclic-opposite-angle-and-arc-engine"
      data-angle-a={measures.A}
      data-angle-b={measures.B}
      data-angle-c={measures.C}
      data-angle-d={measures.D}
      data-sum-ac={sums.AC}
      data-sum-bd={sums.BD}
      data-balanced={String(balanced)}
      data-arc-bc={arcs.BC}
      data-arc-cd={arcs.CD}
      data-arc-da={arcs.DA}
      data-arc-ab={arcs.AB}
      data-target-a={targetA}
      data-expected-c={expectedC}
      data-prediction-correct={String(predictionCorrect)}
      data-actions={actions}
    >
      <header className="oca10095-hero">
        <h1>Opposite Angles of a Cyclic Quadrilateral</h1>
        <p>In a cyclic quadrilateral, opposite angles are supplementary.</p>
        <strong>∠A + ∠C = 180° and ∠B + ∠D = 180°.</strong>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="oca10095-tabs">
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
        <section className="oca10095-lab">
          <aside>
            <h2>CONTROLS</h2>
            <p>Drag any vertex to change the quadrilateral.</p>
            <Switch
              label="Show angle measures"
              checked={showAngles}
              onChange={setShowAngles}
            />
            <h3>DISPLAY OPTIONS</h3>
            <label className="oca10095-check">
              <input
                type="checkbox"
                checked={showArcs}
                onChange={(event) =>
                  act(() => setShowArcs(event.target.checked))
                }
              />{" "}
              Show arcs
            </label>
            <label className="oca10095-check">
              <input
                type="checkbox"
                checked={showSums}
                onChange={(event) =>
                  act(() => setShowSums(event.target.checked))
                }
              />{" "}
              Show angle sums
            </label>
            <label className="oca10095-check">
              <input
                type="checkbox"
                checked={showCenter}
                onChange={(event) =>
                  act(() => setShowCenter(event.target.checked))
                }
              />{" "}
              Show center O
            </label>
            <button className="reset" onClick={reset}>
              <RotateCcw /> Reset figure
            </button>
            <h3>ANGLE READOUTS</h3>
            {NAMES.map((name) => (
              <p className={`readout ${name.toLowerCase()}`} key={name}>
                ∠{name}
                <b>{measures[name].toFixed(1)}°</b>
              </p>
            ))}
          </aside>
          <article>
            <svg
              ref={svgRef}
              viewBox="0 0 684 500"
              aria-label="Draggable cyclic quadrilateral and opposite angles"
              onPointerMove={(event) =>
                dragging && setPoint(dragging, pointerAngle(event))
              }
              onPointerUp={() => dragging && act(() => setDragging(null))}
              onPointerLeave={() => dragging && act(() => setDragging(null))}
            >
              <circle className="circle" cx={cx} cy={cy} r={radius} />
              <polygon className="quad" points={polygon} />
              {showCenter && (
                <>
                  <circle className="center" cx={cx} cy={cy} r="5" />
                  <text x={cx + 8} y={cy - 8}>
                    O
                  </text>
                </>
              )}
              {NAMES.map((name, index) => {
                const p = screenPoints[name];
                return (
                  <g key={name}>
                    {showAngles && (
                      <circle
                        className={`angle n${index}`}
                        cx={p.x}
                        cy={p.y}
                        r="31"
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
                      aria-valuenow={round(positions[name])}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(name));
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          act(() => setPoint(name, positions[name] + 2));
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          act(() => setPoint(name, positions[name] - 2));
                        }
                      }}
                    />
                    <text
                      className="name"
                      x={p.x + (name === "D" ? -28 : 12)}
                      y={p.y + (name === "A" ? -14 : 25)}
                    >
                      {name}
                    </text>
                    {showAngles && (
                      <text
                        className={`measure n${index}`}
                        x={p.x + (name === "D" ? 20 : -4)}
                        y={p.y + (name === "A" ? 46 : name === "C" ? -32 : 5)}
                      >
                        {measures[name].toFixed(1)}°
                      </text>
                    )}
                  </g>
                );
              })}
              {showArcs && (
                <>
                  <text className="arc" x="175" y="80">
                    ⌢DA {arcs.DA.toFixed(1)}°
                  </text>
                  <text className="arc" x="475" y="80">
                    ⌢AB {arcs.AB.toFixed(1)}°
                  </text>
                  <text className="arc" x="175" y="440">
                    ⌢CD {arcs.CD.toFixed(1)}°
                  </text>
                  <text className="arc" x="475" y="440">
                    ⌢BC {arcs.BC.toFixed(1)}°
                  </text>
                </>
              )}
            </svg>
            <p className="drag-tip">
              <Info /> Drag any vertex (A, B, C, or D) to explore.
            </p>
          </article>
          <aside className="supplement">
            <h2>SUPPLEMENTARY CHECK</h2>
            {!showSums && (
              <p className="hidden-sums">Angle-sum layer hidden.</p>
            )}
            {showSums &&
              (["AC", "BD"] as const).map((pair) => {
                const first = pair[0] as Name,
                  second = pair[1] as Name,
                  sum = sums[pair];
                return (
                  <section key={pair}>
                    <h3>
                      ∠{first} + ∠{second}
                    </h3>
                    <p>
                      {measures[first].toFixed(1)}° +{" "}
                      {measures[second].toFixed(1)}° = {sum.toFixed(1)}°
                    </p>
                    <input
                      aria-label={`Sum ${pair}`}
                      type="range"
                      min="0"
                      max="180"
                      value={Math.min(180, sum)}
                      readOnly
                    />
                    <strong>= {sum.toFixed(1)}°</strong>
                    <em>
                      <CheckCircle2 />{" "}
                      {Math.abs(sum - 180) < 0.2
                        ? "Balanced"
                        : "Adjust vertices"}
                    </em>
                  </section>
                );
              })}
          </aside>
        </section>

        <section className="oca10095-arcs">
          <article>
            <h2>
              ARC RELATIONSHIPS <span>(inscribed angle theorem)</span>
            </h2>
            <div>
              {(["BC", "CD", "DA", "AB"] as const).map((arc, index) => (
                <section key={arc}>
                  <h3>⌢{arc}</h3>
                  <p>= 2∠{NAMES[index]}</p>
                  <p>= 2 × {measures[NAMES[index]].toFixed(1)}°</p>
                  <b>= {arcs[arc].toFixed(1)}°</b>
                </section>
              ))}
            </div>
          </article>
          <aside>
            <h2>THEOREM (Rule)</h2>
            <p>In a cyclic quadrilateral ABCD,</p>
            <strong>
              ∠A + ∠C = 180°
              <br />
              ∠B + ∠D = 180°
            </strong>
            <hr />
            <h3>Converse (Cyclicity Test)</h3>
            <p>
              If either opposite pair sums to 180°, then the quadrilateral is
              cyclic.
            </p>
          </aside>
        </section>

        <section className="oca10095-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              <b>
                Opposite angles subtend arcs with the other two vertices on
                them.
              </b>
            </p>
            <p>
              ∠A and ∠C stand on arcs BC and DA that together make the full
              circle.
            </p>
            <p>⌢BC + ⌢DA = 360° ⇒ ∠A + ∠C = ½(360°) = 180°.</p>
            <p>Similarly, ∠B + ∠D = 180°.</p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>If ∠A = 112°, find ∠C.</p>
            <div className="mini">
              <b>A</b>
              <b>B</b>
              <b>C</b>
              <b>D</b>
            </div>
            <p>
              ∠A + ∠C = 180°
              <br />
              112° + ∠C = 180°
              <br />
              ∠C = 180° − 112°
            </p>
            <strong>∠C = 68°</strong>
          </article>
          <article className="mistake">
            <h2>
              <Lightbulb /> COMMON MISCONCEPTION
            </h2>
            <p>
              <b>
                Adjacent angles of a cyclic quadrilateral are not generally
                supplementary.
              </b>
            </p>
            <p>Only opposite angles sum to 180°.</p>
            <p>
              From the figure: ∠A + ∠B = {measures.A}° + {measures.B}° ={" "}
              {round(measures.A + measures.B)}°
            </p>
            <b>(Not necessarily 180°)</b>
          </article>
        </section>

        <section className="oca10095-challenge">
          <h2>YOUR TURN! CHALLENGE</h2>
          <p>Adjust the target ∠A. Predict ∠C before revealing.</p>
          <div className="challenge-grid">
            <section>
              <label>
                Set ∠A
                <input
                  aria-label="Challenge angle A"
                  type="range"
                  min="60"
                  max="120"
                  value={targetA}
                  onChange={(event) =>
                    act(() => {
                      setTargetA(+event.target.value);
                      setChecked(false);
                    })
                  }
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      act(() => {
                        setTargetA((value) => Math.max(60, value - 1));
                        setChecked(false);
                      });
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      act(() => {
                        setTargetA((value) => Math.min(120, value + 1));
                        setChecked(false);
                      });
                    }
                  }}
                />
              </label>
              <b>{targetA}°</b>
              <label>
                Your prediction for ∠C
                <input
                  aria-label="Prediction for angle C"
                  type="number"
                  value={prediction}
                  onChange={(event) =>
                    act(() => {
                      setPrediction(event.target.value);
                      setChecked(false);
                    })
                  }
                />
              </label>
              <button onClick={() => act(() => setChecked(true))}>Check</button>
            </section>
            <section className="steps">
              <b>Predict before you reveal!</b>
              <p>1 → 2 → 3</p>
              <small>Set ∠A · Predict ∠C · Reveal & check</small>
            </section>
            <section className="challenge-result">
              <h3>Result</h3>
              <p>
                ∠A = {targetA.toFixed(1)}°<br />
                Predicted ∠C = {prediction || "?"}°<br />
                <b>Actual ∠C = {expectedC.toFixed(1)}°</b>
              </p>
              {checked && (
                <strong className={predictionCorrect ? "correct" : "incorrect"}>
                  {predictionCorrect ? (
                    <>
                      <CheckCircle2 /> Correct! Great intuition.
                    </>
                  ) : (
                    "Use ∠C = 180° − ∠A."
                  )}
                </strong>
              )}
            </section>
          </div>
        </section>
        <nav className="oca10095-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral">
            <ArrowLeft /> Cyclic Quadrilateral
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-tangent-perpendicular-to-radius">
            Tangent Perpendicular to Radius <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
