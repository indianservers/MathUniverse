import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleSubtendedArcTargetLesson10091.css";

type Point = { x: number; y: number };
const A_ANGLE = 210.8,
  B_ANGLE = 329.2,
  ARC = 241.6;
const round = (n: number, p = 1) => Math.round(n * 10 ** p) / 10 ** p;
const unit = (degrees: number): Point => ({
  x: Math.cos((degrees * Math.PI) / 180),
  y: Math.sin((degrees * Math.PI) / 180),
});
const angleAt = (p: Point, a: Point, b: Point) => {
  const u = { x: a.x - p.x, y: a.y - p.y },
    v = { x: b.x - p.x, y: b.y - p.y },
    dot = u.x * v.x + u.y * v.y,
    den = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  return round(
    (Math.acos(Math.max(-1, Math.min(1, dot / den))) * 180) / Math.PI,
  );
};
export default function AngleSubtendedArcTargetLesson10091({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [position, setPosition] = useState(0.5),
    [centralVisible, setCentralVisible] = useState(true),
    [inscribedVisible, setInscribedVisible] = useState(true),
    [dragging, setDragging] = useState(false),
    [tab, setTab] = useState(0),
    [observations, setObservations] = useState<number[]>([0.5, 0.72]),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    cx = 310,
    cy = 235,
    r = 185,
    a = unit(A_ANGLE),
    b = unit(B_ANGLE),
    cAngle = (B_ANGLE + position * ARC) % 360,
    c = unit(cAngle),
    central = round(360 - ARC),
    inscribed = angleAt(c, a, b),
    ratio = round(central / inscribed, 2),
    valid = Math.abs(ratio - 2) < 0.01;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setPos = (value: number) => {
    const p = Math.max(0.04, Math.min(0.96, value));
    setPosition(p);
    setObservations((v) => [v.at(-1) ?? 0.5, p]);
  };
  const reset = () =>
    act(() => {
      setPosition(0.5);
      setCentralVisible(true);
      setInscribedVisible(true);
      setObservations([0.5, 0.72]);
    });
  const localAngle = (e: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return cAngle;
    const x = ((e.clientX - box.left) / box.width) * 620 - cx,
      y = cy - ((e.clientY - box.top) / box.height) * 470;
    let d = (Math.atan2(y, x) * 180) / Math.PI;
    if (d < 0) d += 360;
    return d;
  };
  const infer = (degrees: number) => {
    let delta = degrees - B_ANGLE;
    if (delta < 0) delta += 360;
    if (delta <= ARC) setPos(delta / ARC);
  };
  const screen = (p: Point) => ({ x: cx + r * p.x, y: cy - r * p.y });
  const pa = screen(a),
    pb = screen(b),
    pc = screen(c);
  const arcPoint = (d: number, rr = r) => {
    const q = unit(d);
    return { x: cx + rr * q.x, y: cy - rr * q.y };
  };
  const arcPath = (start: number, end: number, rr: number) => {
    const p1 = arcPoint(start, rr),
      p2 = arcPoint(end, rr),
      large = (end - start + 360) % 360 > 180 ? 1 : 0;
    return `M${p1.x} ${p1.y}A${rr} ${rr} 0 ${large} 0 ${p2.x} ${p2.y}`;
  };
  const observation = (p: number) => {
    const q = unit((B_ANGLE + p * ARC) % 360);
    const i = angleAt(q, a, b);
    return { central, inscribed: i, ratio: round(central / i, 2) };
  };
  return (
    <section
      className="asa10091-page"
      data-testid="school-mockup-0765"
      data-object-model="dedicated-fixed-arc-central-inscribed-angle-engine"
      data-position={round(position, 3)}
      data-c={`${round(c.x, 2)},${round(c.y, 2)}`}
      data-central-angle={central}
      data-inscribed-angle={inscribed}
      data-ratio={ratio}
      data-invariant={String(valid)}
      data-observations={observations.length}
      data-actions={actions}
    >
      <header className="asa10091-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Angle Subtended by an Arc</h1>
        <p>
          Compare the angle subtended by the same arc at the centre and on the
          circle.
        </p>
        <div>
          <span>24 min</span>
          <span>Class 10</span>
          <span>Circle Proofs</span>
          <span>Difficulty</span>
          <span>NCERT: Ex. 10.2</span>
        </div>
      </header>
      <nav className="asa10091-tabs">
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
        <section className="asa10091-lab">
          <aside>
            <section>
              <h2>INTERACT</h2>
              <b>Fixed arc AB</b>
              <p>
                <span>A ●</span>
                <span>B ●</span>
              </p>
              <small>Drag point C on the major arc.</small>
            </section>
            <section>
              <b>Drag C around</b>
              <input
                aria-label="Point C around major arc"
                type="range"
                min=".04"
                max=".96"
                step=".01"
                value={position}
                onChange={(e) => act(() => setPos(+e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    act(() => setPos(position - 0.02));
                  }
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    act(() => setPos(position + 0.02));
                  }
                }}
              />
              <strong>
                C (x,y)
                <br />({round(c.x, 2)}, {round(c.y, 2)})
              </strong>
            </section>
            <section>
              <b>Measure angles</b>
              <label>
                <input
                  type="checkbox"
                  checked={centralVisible}
                  onChange={(e) =>
                    act(() => setCentralVisible(e.target.checked))
                  }
                />{" "}
                Central angle ∠AOB
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={inscribedVisible}
                  onChange={(e) =>
                    act(() => setInscribedVisible(e.target.checked))
                  }
                />{" "}
                Inscribed angle ∠ACB
              </label>
            </section>
            <section className="result">
              <h3>LIVE RESULT</h3>
              <strong>∠AOB = {central}°</strong>
              <strong>∠ACB = {inscribed}°</strong>
              <hr />
              <p>
                Ratio{" "}
                <b>
                  {central}/{inscribed} = {ratio.toFixed(2)} : 1
                </b>
              </p>
              <em>
                <CheckCircle2 /> Invariant confirmed
              </em>
            </section>
          </aside>
          <article>
            <button onClick={reset}>
              <RotateCcw /> Reset diagram
            </button>
            <svg
              ref={svgRef}
              viewBox="0 0 620 470"
              aria-label="Draggable central and inscribed angle circle"
              onPointerMove={(e) => {
                if (dragging) infer(localAngle(e));
              }}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <circle className="circle" cx={cx} cy={cy} r={r} />
              <path className="fixed-arc" d={arcPath(A_ANGLE, B_ANGLE, r)} />
              <line className="chord" x1={pc.x} y1={pc.y} x2={pa.x} y2={pa.y} />
              <line className="chord" x1={pc.x} y1={pc.y} x2={pb.x} y2={pb.y} />
              {centralVisible && (
                <>
                  <line
                    className="radius"
                    x1={cx}
                    y1={cy}
                    x2={pa.x}
                    y2={pa.y}
                  />
                  <line
                    className="radius"
                    x1={cx}
                    y1={cy}
                    x2={pb.x}
                    y2={pb.y}
                  />
                  <path className="central" d={arcPath(A_ANGLE, B_ANGLE, 42)} />
                  <text className="central-label" x={cx - 28} y={cy + 53}>
                    {central}°
                  </text>
                </>
              )}
              {inscribedVisible && (
                <>
                  <path
                    className="inscribed"
                    d={`M${pc.x - 26} ${pc.y + 28}Q${pc.x} ${pc.y + 42} ${pc.x + 26} ${pc.y + 28}`}
                  />
                  <text className="inscribed-label" x={pc.x - 22} y={pc.y + 68}>
                    {inscribed}°
                  </text>
                </>
              )}
              <circle className="center" cx={cx} cy={cy} r="7" />
              <text x={cx - 10} y={cy - 16}>
                O
              </text>
              <circle className="point a" cx={pa.x} cy={pa.y} r="7" />
              <text x={pa.x - 25} y={pa.y + 22}>
                A
              </text>
              <circle className="point b" cx={pb.x} cy={pb.y} r="7" />
              <text x={pb.x + 12} y={pb.y + 22}>
                B
              </text>
              <circle
                className="point c"
                tabIndex={0}
                aria-label="Draggable point C on major arc"
                cx={pc.x}
                cy={pc.y}
                r="8"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDragging(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") act(() => setPos(position - 0.02));
                  if (e.key === "ArrowRight")
                    act(() => setPos(position + 0.02));
                }}
              />
              <text x={pc.x - 10} y={pc.y - 16}>
                C
              </text>
            </svg>
            <footer>
              <article>
                <p>— Radii OA, OB</p>
                <p>— Arc AB (fixed)</p>
                <p>— Chords CA, CB</p>
              </article>
              <article>
                As C moves on the major arc, the ratio{" "}
                <strong>∠AOB / ∠ACB</strong> remains <b>2 : 1.</b>
              </article>
            </footer>
          </article>
        </section>
        <section className="asa10091-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              The central angle ∠AOB and the inscribed angle ∠ACB stand on the
              same arc AB.
            </p>
            <p>
              The central angle opens twice as wide as the angle at the
              circumference.
            </p>
            <strong>
              Key idea: Equal arcs subtend equal angles at the circumference.
            </strong>
          </article>
          <article>
            <h2>THE RULE (THEOREM)</h2>
            <strong>
              The angle subtended by an arc at the centre is twice the angle
              subtended by the arc at any point on the remaining circle.
            </strong>
            <b>∠AOB = 2 ∠ACB</b>
          </article>
          <article className="warning">
            <h2>MISCONCEPTION WARNING</h2>
            <p>
              Point C must lie on the remaining (major) arc AB, not on the same
              minor arc.
            </p>
            <p>
              If C is on the minor arc AB, ∠ACB is the reflex counterpart and
              this form of the rule does not apply.
            </p>
            <div>✓ Correct: major arc &nbsp;&nbsp; ✕ Incorrect: same arc</div>
          </article>
        </section>
        <section className="asa10091-lower">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>If ∠AOB=120°, find ∠ACB.</p>
            <ol>
              <li>Given: ∠AOB=120°</li>
              <li>By the theorem: ∠AOB=2∠ACB</li>
              <li>∠ACB=½×120°=60°</li>
            </ol>
            <strong>Answer: ∠ACB = 60°</strong>
          </article>
          <article>
            <h2>CHALLENGE: DRAG & OBSERVE</h2>
            <p>
              Drag point C along the major arc of AB and observe two positions.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>∠AOB</th>
                  <th>∠ACB</th>
                  <th>Ratio</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((p, i) => {
                  const o = observation(p);
                  return (
                    <tr key={i}>
                      <td>Position {i + 1}</td>
                      <td>{o.central}°</td>
                      <td>{o.inscribed}°</td>
                      <td>{o.ratio.toFixed(2)} : 1</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <em>
              <CheckCircle2 /> The ratio remains 2 : 1 for all positions.
            </em>
          </article>
        </section>
      </main>
      <nav className="asa10091-nav">
        <Link to="/lessons/school/class-10/class-10-circle-proofs-perpendicular-from-centre-to-chord">
          <ArrowLeft /> Previous
          <br />
          Perpendicular from Centre to Chord
        </Link>
        <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-in-a-semicircle">
          Next
          <br />
          Angle in a Semicircle <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
