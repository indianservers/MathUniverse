import {
  ArrowLeft,
  ArrowRight,
  Hand,
  LocateFixed,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EqualChordsAnglesTargetLesson10089.css";

type Handle = "a" | "b" | "c" | "d";
const RADIUS = 6 / (2 * Math.sin((27 * Math.PI) / 180));
const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
const chord = (angle: number) =>
  round(2 * RADIUS * Math.sin((angle * Math.PI) / 360));
const polar = (cx: number, cy: number, r: number, degrees: number) => ({
  x: cx + r * Math.cos((degrees * Math.PI) / 180),
  y: cy - r * Math.sin((degrees * Math.PI) / 180),
});

export default function EqualChordsAnglesTargetLesson10089({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [leftRotation, setLeftRotation] = useState(180),
    [rightRotation, setRightRotation] = useState(0),
    [leftAngle, setLeftAngle] = useState(54),
    [rightAngle, setRightAngle] = useState(54),
    [radii, setRadii] = useState(true),
    [arcs, setArcs] = useState(true),
    [lengths, setLengths] = useState(true),
    [overlay, setOverlay] = useState(0),
    [converse, setConverse] = useState(true),
    [tool, setTool] = useState<"drag" | "rotate">("drag"),
    [dragging, setDragging] = useState<Handle | null>(null),
    [tab, setTab] = useState(0),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    cx = 300,
    cy = 205,
    r = 152;
  const points = useMemo(
    () => ({
      a: polar(cx, cy, r, leftRotation - leftAngle / 2),
      b: polar(cx, cy, r, leftRotation + leftAngle / 2),
      c: polar(cx, cy, r, rightRotation + rightAngle / 2 + overlay),
      d: polar(cx, cy, r, rightRotation - rightAngle / 2 + overlay),
    }),
    [leftRotation, rightRotation, leftAngle, rightAngle, overlay],
  );
  const ab = chord(leftAngle),
    cd = chord(rightAngle),
    equalChord = Math.abs(ab - cd) < 0.01,
    equalAngle = Math.abs(leftAngle - rightAngle) < 0.01,
    holds = equalChord && equalAngle;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setLeftRotation(180);
      setRightRotation(0);
      setLeftAngle(54);
      setRightAngle(54);
      setRadii(true);
      setArcs(true);
      setLengths(true);
      setOverlay(0);
      setConverse(true);
      setTool("drag");
    });
  const angleAt = (e: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return 0;
    const x = ((e.clientX - box.left) / box.width) * 600 - cx,
      y = cy - ((e.clientY - box.top) / box.height) * 410;
    return (Math.atan2(y, x) * 180) / Math.PI;
  };
  const rotatePair = (handle: Handle, degrees: number) => {
    if (handle === "a" || handle === "b") setLeftRotation(round(degrees));
    else setRightRotation(round(degrees - overlay));
  };
  const keyboard = (handle: Handle, delta: number) =>
    act(() =>
      rotatePair(
        handle,
        (handle === "a" || handle === "b" ? leftRotation : rightRotation) +
          delta,
      ),
    );
  const toggleConverse = (checked: boolean) =>
    act(() => {
      setConverse(checked);
      setRightAngle(checked ? leftAngle : 70);
    });
  const arcPath = (rotation: number, angle: number, rr: number) => {
    const p1 = polar(cx, cy, rr, rotation - angle / 2),
      p2 = polar(cx, cy, rr, rotation + angle / 2);
    return `M${p1.x} ${p1.y}A${rr} ${rr} 0 0 0 ${p2.x} ${p2.y}`;
  };
  return (
    <section
      className="eca10089-page"
      data-testid="school-mockup-0763"
      data-object-model="dedicated-equal-chord-central-angle-congruence-engine"
      data-ab={ab}
      data-cd={cd}
      data-left-angle={leftAngle}
      data-right-angle={rightAngle}
      data-equal-chords={String(equalChord)}
      data-equal-angles={String(equalAngle)}
      data-theorem={String(holds)}
      data-left-rotation={leftRotation}
      data-right-rotation={rightRotation}
      data-overlay={overlay}
      data-actions={actions}
    >
      <header className="eca10089-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Equal Chords and Equal Angles</h1>
        <p>
          Explore the relationship between equal chords and equal angles at a
          circle&apos;s centre.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="eca10089-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="eca10089-investigate">
          <header>
            <h2>INVESTIGATE</h2>
            <p>Drag points A, B, C or D. Observe angles and chord lengths.</p>
            <strong>Theorem: Equal chords ↔ Equal central angles</strong>
          </header>
          <div className="workspace">
            <aside>
              <section>
                <h3>CONTROLS</h3>
                <b>Display</b>
                <label>
                  <input
                    type="checkbox"
                    checked={radii}
                    onChange={(e) => act(() => setRadii(e.target.checked))}
                  />{" "}
                  Show radii OA, OB, OC, OD
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={arcs}
                    onChange={(e) => act(() => setArcs(e.target.checked))}
                  />{" "}
                  Show angle arcs
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={lengths}
                    onChange={(e) => act(() => setLengths(e.target.checked))}
                  />{" "}
                  Show chord lengths
                </label>
              </section>
              <section>
                <b>Measures</b>
                <label>
                  AB ={" "}
                  <input
                    aria-label="Chord AB length"
                    readOnly
                    value={ab.toFixed(2)}
                  />{" "}
                  cm
                </label>
                <label>
                  CD ={" "}
                  <input
                    aria-label="Chord CD length"
                    readOnly
                    value={cd.toFixed(2)}
                  />{" "}
                  cm
                </label>
              </section>
              <section>
                <b>Options</b>
                <label>
                  Overlay rotation <output>{overlay}°</output>
                  <input
                    aria-label="Overlay rotation"
                    type="range"
                    min="-90"
                    max="90"
                    value={overlay}
                    onChange={(e) => act(() => setOverlay(+e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") {
                        e.preventDefault();
                        act(() =>
                          setOverlay((value) => Math.min(90, value + 1)),
                        );
                      }
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        act(() =>
                          setOverlay((value) => Math.max(-90, value - 1)),
                        );
                      }
                    }}
                  />
                </label>
                <label className="switch">
                  Converse view{" "}
                  <input
                    aria-label="Converse view"
                    type="checkbox"
                    checked={converse}
                    onChange={(e) => toggleConverse(e.target.checked)}
                  />
                </label>
                <small>Equal angles ⇔ Equal chords</small>
              </section>
              <section className="status">
                <b>STATUS</b>
                <strong>{equalChord ? "✓ AB = CD" : "AB ≠ CD"}</strong>
                <strong>{equalAngle ? "∠AOB = ∠COD" : "Angles differ"}</strong>
                <em>
                  {holds ? "The theorem holds." : "Restore equal measures."}
                </em>
              </section>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 600 410"
                aria-label="Draggable equal chords circle"
                onPointerMove={(e) => {
                  if (dragging) rotatePair(dragging, angleAt(e));
                }}
                onPointerUp={() => dragging && act(() => setDragging(null))}
                onPointerLeave={() => dragging && act(() => setDragging(null))}
              >
                <line className="axis" x1={cx} y1="20" x2={cx} y2="390" />
                <line className="axis" x1="110" y1={cy} x2="490" y2={cy} />
                <circle className="circle" cx={cx} cy={cy} r={r} />
                {radii &&
                  (["a", "b", "c", "d"] as Handle[]).map((key) => (
                    <line
                      key={key}
                      className={`radius ${key}`}
                      x1={cx}
                      y1={cy}
                      x2={points[key].x}
                      y2={points[key].y}
                    />
                  ))}
                <line
                  className="chord ab"
                  x1={points.a.x}
                  y1={points.a.y}
                  x2={points.b.x}
                  y2={points.b.y}
                />
                <line
                  className="chord cd"
                  x1={points.c.x}
                  y1={points.c.y}
                  x2={points.d.x}
                  y2={points.d.y}
                />
                {arcs && (
                  <>
                    <path
                      className="arc ab"
                      d={arcPath(leftRotation, leftAngle, 38)}
                    />
                    <path
                      className="arc cd"
                      d={arcPath(rightRotation + overlay, rightAngle, 38)}
                    />
                  </>
                )}
                {(["a", "b", "c", "d"] as Handle[]).map((key) => (
                  <g key={key}>
                    <circle
                      className={`handle ${key}`}
                      tabIndex={0}
                      aria-label={`Draggable chord point ${key.toUpperCase()}`}
                      cx={points[key].x}
                      cy={points[key].y}
                      r="7"
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDragging(key);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowLeft") keyboard(key, -2);
                        if (e.key === "ArrowRight") keyboard(key, 2);
                      }}
                    />
                    <text
                      x={points[key].x + (key === "a" || key === "b" ? -18 : 8)}
                      y={points[key].y - 10}
                    >
                      {key.toUpperCase()}
                    </text>
                  </g>
                ))}
                <circle className="center" cx={cx} cy={cy} r="6" />
                <text x={cx + 8} y={cy - 8}>
                  O
                </text>
                {arcs && (
                  <>
                    <text className="angle ab" x="245" y="184">
                      {leftAngle}°
                    </text>
                    <text className="angle cd" x="335" y="184">
                      {rightAngle}°
                    </text>
                  </>
                )}
                {lengths && (
                  <>
                    <text className="measure ab" x="190" y="355">
                      AB = {ab.toFixed(2)} cm
                    </text>
                    <text className="measure cd" x="355" y="355">
                      CD = {cd.toFixed(2)} cm
                    </text>
                  </>
                )}
              </svg>
              <div className="readouts">
                <strong>AB = {ab.toFixed(2)} cm</strong>
                <strong>CD = {cd.toFixed(2)} cm</strong>
                <strong>∠AOB = {leftAngle}°</strong>
                <strong>∠COD = {rightAngle}°</strong>
              </div>
            </article>
            <aside className="tools">
              <h3>TOOLS</h3>
              <button
                className={tool === "drag" ? "active" : ""}
                onClick={() => act(() => setTool("drag"))}
              >
                <Hand /> Drag
              </button>
              <button
                className={tool === "rotate" ? "active" : ""}
                onClick={() => act(() => setTool("rotate"))}
              >
                <RotateCcw /> Rotate circle
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setLeftRotation(180);
                    setRightRotation(0);
                    setOverlay(0);
                  })
                }
              >
                <LocateFixed /> Center view
              </button>
              <h3>KEY</h3>
              <p>● A</p>
              <p>● B</p>
              <p>● C</p>
              <p>● D</p>
              <p>● O Centre</p>
            </aside>
          </div>
          <footer>
            Drag any point or use the rotation slider. Locked chord lengths stay
            equal.
          </footer>
        </section>
        <section className="eca10089-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Equal chords in the same circle are equidistant from the centre.
              Radii to the endpoints form two isosceles triangles with equal
              legs and equal bases.
            </p>
            <div className="triangles">
              △ AOB &nbsp;&nbsp; ≅ &nbsp;&nbsp; △ COD
            </div>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Given: AB = CD</p>
            <p>Prove: ∠AOB = ∠COD</p>
            <ol>
              <li>OA=OC and OB=OD (radii).</li>
              <li>AB=CD (given).</li>
              <li>△AOB ≅ △COD (SSS).</li>
              <li>∠AOB=∠COD (CPCTC).</li>
            </ol>
          </article>
          <article className="warning">
            <h2>WARNING</h2>
            <p>
              Comparing arcs by appearance does not establish equal chord
              lengths.
            </p>
            <div className="warning-circle">◯ ╱ &nbsp;&nbsp; ✕</div>
            <strong>Always compare chords or use the measurements.</strong>
          </article>
        </section>
        <section className="eca10089-challenge">
          <h2>CHALLENGE</h2>
          <p>
            Set both chords to 6 cm and rotate one without changing its central
            angle.
          </p>
          <div>
            <article>
              <p>✓ Set AB = 6 cm</p>
              <p>✓ Set CD = 6 cm</p>
              <p>
                ③ Rotate point C (and D) around the circle.
                <br />
                Keep ∠COD = 54°.
              </p>
            </article>
            <article>
              <h3>Goal</h3>
              <p>Maintain ∠COD = 54° while changing the position of CD.</p>
              <strong>Well done! CD remains {cd.toFixed(2)} cm.</strong>
              <em>✓ Theorem verified.</em>
            </article>
            <strong className="score">
              3/3<small>Complete</small>
            </strong>
          </div>
        </section>
      </main>
      <nav className="eca10089-nav">
        <Link to="/lessons/school/class-10/class-10-circle-proofs-angles-in-the-same-segment">
          <ArrowLeft /> Previous
          <br />
          Angles in the Same Segment
        </Link>
        <Link to="/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral-theorem">
          Next
          <br />
          Cyclic Quadrilateral Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
