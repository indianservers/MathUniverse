import {
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Lightbulb,
  Lock,
  MousePointer2,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramConditionsTargetLesson10076.css";
type P = { x: number; y: number };
type V = "a" | "b" | "c" | "d";
const START = {
  a: { x: 105, y: 70 },
  b: { x: 420, y: 88 },
  c: { x: 378, y: 320 },
  d: { x: 58, y: 310 },
};
const names = [
  "Opposite sides are parallel",
  "Opposite sides are equal",
  "Opposite angles are equal",
  "Diagonals bisect each other",
  "One pair of opposite sides is equal and parallel",
];
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const rr = (n: number) => Math.round(n * 100) / 100;
const angle = (prev: P, p: P, next: P) => {
  const u = { x: prev.x - p.x, y: prev.y - p.y },
    v = { x: next.x - p.x, y: next.y - p.y };
  return (
    (Math.acos(
      Math.max(
        -1,
        Math.min(
          1,
          (u.x * v.x + u.y * v.y) /
            (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)),
        ),
      ),
    ) *
      180) /
    Math.PI
  );
};
const intersection = (a: P, c: P, b: P, d: P) => {
  const den = (a.x - c.x) * (b.y - d.y) - (a.y - c.y) * (b.x - d.x);
  if (Math.abs(den) < 0.01) return { x: 0, y: 0 };
  const t = ((a.x - b.x) * (b.y - d.y) - (a.y - b.y) * (b.x - d.x)) / den;
  return { x: a.x + t * (c.x - a.x), y: a.y + t * (c.y - a.y) };
};
export default function ParallelogramConditionsTargetLesson10076({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pts, setPts] = useState(START),
    [certs, setCerts] = useState([false, false, false, true, false]),
    [showMeasures, setShowMeasures] = useState(true),
    [locked, setLocked] = useState(false),
    [tool, setTool] = useState<"vertex" | "diagonals" | "marks" | "grid">(
      "vertex",
    ),
    [tab, setTab] = useState(0),
    [active, setActive] = useState<V | null>(null),
    [text, setText] = useState(""),
    [graded, setGraded] = useState(false),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const o = useMemo(() => intersection(pts.a, pts.c, pts.b, pts.d), [pts]);
  const sides = [
    dist(pts.a, pts.b),
    dist(pts.b, pts.c),
    dist(pts.c, pts.d),
    dist(pts.d, pts.a),
  ].map((n) => rr(n / 50));
  const half = [
    dist(pts.a, o),
    dist(pts.c, o),
    dist(pts.b, o),
    dist(pts.d, o),
  ].map((n) => rr(n / 50));
  const ang = [
    angle(pts.d, pts.a, pts.b),
    angle(pts.a, pts.b, pts.c),
    angle(pts.b, pts.c, pts.d),
    angle(pts.c, pts.d, pts.a),
  ].map((n) => rr(n));
  const count = certs.filter(Boolean).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPts(START);
      setCerts([false, false, false, true, false]);
      setShowMeasures(true);
      setLocked(false);
      setTool("vertex");
      setText("");
      setGraded(false);
    });
  const point = (e: PointerEvent<SVGSVGElement>) => {
    const b = svgRef.current?.getBoundingClientRect();
    return b
      ? {
          x: ((e.clientX - b.left) / b.width) * 500,
          y: ((e.clientY - b.top) / b.height) * 380,
        }
      : null;
  };
  const update = (k: V, p: P) =>
    setPts((old) => ({
      ...old,
      [k]: {
        x: Math.max(35, Math.min(465, p.x)),
        y: Math.max(40, Math.min(345, p.y)),
      },
    }));
  const keyMove = (k: V, dx: number, dy: number) =>
    act(() => update(k, { x: pts[k].x + dx, y: pts[k].y + dy }));
  return (
    <section
      className="pc10076-page"
      data-testid="school-mockup-0750"
      data-object-model="dedicated-quadrilateral-measurement-and-sufficient-condition-dashboard"
      data-points={`${pts.a.x},${pts.a.y};${pts.b.x},${pts.b.y};${pts.c.x},${pts.c.y};${pts.d.x},${pts.d.y}`}
      data-sides={sides.join(",")}
      data-halves={half.join(",")}
      data-angles={ang.join(",")}
      data-certificates={certs.map(Number).join(",")}
      data-result={String(count > 0)}
      data-count={count}
      data-tool={tool}
      data-locked={String(locked)}
      data-graded={String(graded)}
      data-actions={actions}
    >
      <header className="pc10076-hero">
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Conditions for a Quadrilateral to Be a Parallelogram</h1>
        <p>
          Test different conditions. Any one valid condition is enough to prove
          a quadrilateral is a parallelogram.
        </p>
        <div>
          <span>30 min</span>
          <span>Class 9</span>
          <span>Geometry</span>
          <span>Interactive</span>
        </div>
      </header>
      <nav className="pc10076-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-selected={tab === i}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="pc10076-lab">
          <div className="pc10076-model">
            <header>
              <div>
                <h2>INTERACTIVE MODEL</h2>
                <p>
                  Drag any vertex A, B, C, or D. Observe the conditions on the
                  right.
                </p>
              </div>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 500 380"
              aria-label="Draggable quadrilateral condition model"
              onPointerMove={(e) => {
                if (!active || locked) return;
                const p = point(e);
                if (p) update(active, p);
              }}
              onPointerUp={() => active && act(() => setActive(null))}
              onPointerLeave={() => active && act(() => setActive(null))}
            >
              <defs>
                <pattern
                  id="pcGrid"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M22 0H0V22" />
                </pattern>
              </defs>
              <rect width="500" height="380" fill="url(#pcGrid)" />
              <path
                className="shape"
                d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}L${pts.c.x} ${pts.c.y}L${pts.d.x} ${pts.d.y}Z`}
              />
              <line x1={pts.a.x} y1={pts.a.y} x2={pts.c.x} y2={pts.c.y} />
              <line x1={pts.b.x} y1={pts.b.y} x2={pts.d.x} y2={pts.d.y} />
              {(["a", "b", "c", "d"] as V[]).map((k) => (
                <g key={k}>
                  <circle
                    className="handle"
                    cx={pts[k].x}
                    cy={pts[k].y}
                    r="7"
                    tabIndex={0}
                    aria-label={`Draggable vertex ${k.toUpperCase()}`}
                    onPointerDown={(e) => {
                      if (locked) return;
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setActive(k);
                    }}
                    onKeyDown={(e) => {
                      if (locked) return;
                      const n = e.shiftKey ? 10 : 4;
                      if (e.key === "ArrowLeft") keyMove(k, -n, 0);
                      if (e.key === "ArrowRight") keyMove(k, n, 0);
                      if (e.key === "ArrowUp") keyMove(k, 0, -n);
                      if (e.key === "ArrowDown") keyMove(k, 0, n);
                    }}
                  />
                  <text
                    x={pts[k].x + (k === "a" || k === "d" ? -18 : 9)}
                    y={pts[k].y + (k === "a" || k === "b" ? -10 : 20)}
                  >
                    {k.toUpperCase()}
                  </text>
                </g>
              ))}
              <circle className="origin" cx={o.x} cy={o.y} r="6" />
              <text x={o.x - 8} y={o.y - 12}>
                O
              </text>
            </svg>
            <footer>
              {[
                ["vertex", <MousePointer2 />, "Vertex"],
                ["diagonals", "⌁", "Diagonals"],
                ["marks", "✣", "Marks"],
                ["grid", <Grid3X3 />, "Grid"],
              ].map(([v, icon, label]) => (
                <button
                  key={String(v)}
                  className={tool === v ? "active" : ""}
                  onClick={() => act(() => setTool(v as typeof tool))}
                >
                  {icon}
                  {label}
                </button>
              ))}
              <label>
                Show measurements{" "}
                <button
                  role="switch"
                  aria-checked={showMeasures}
                  className={showMeasures ? "on" : ""}
                  onClick={() => act(() => setShowMeasures(!showMeasures))}
                >
                  <i />
                </button>
              </label>
              <label>
                <Lock /> Lock shape{" "}
                <button
                  role="switch"
                  aria-checked={locked}
                  className={locked ? "on" : ""}
                  onClick={() => act(() => setLocked(!locked))}
                >
                  <i />
                </button>
              </label>
            </footer>
          </div>
          <article className="pc10076-dashboard">
            <h2>CONDITIONS DASHBOARD</h2>
            <p>
              A quadrilateral is a parallelogram if at least one condition is
              true.
            </p>
            {names.map((x, i) => (
              <button
                key={x}
                className={certs[i] ? "satisfied" : ""}
                onClick={() =>
                  act(() => {
                    const n = [...certs];
                    n[i] = !n[i];
                    setCerts(n);
                    setGraded(false);
                  })
                }
              >
                <i>{i + 1}</i>
                <span>
                  <b>{x}</b>
                  <small>
                    {i === 0
                      ? "AB ∥ CD and AD ∥ BC"
                      : i === 1
                        ? "AB = CD and AD = BC"
                        : i === 2
                          ? "∠A = ∠C and ∠B = ∠D"
                          : i === 3
                            ? "AO = OC and BO = OD"
                            : "AB = CD and AB ∥ CD"}
                  </small>
                </span>
                <strong>{certs[i] ? "✓ Satisfied" : "× Not satisfied"}</strong>
              </button>
            ))}
            <footer className={count ? "yes" : "no"}>
              <b>
                Result:{" "}
                {count
                  ? `${count} sufficient condition${count > 1 ? "s are" : " is"} satisfied.`
                  : "No sufficient condition is certified."}
              </b>
              <strong>
                {count
                  ? "∴ ABCD is a parallelogram."
                  : "ABCD is not yet proved a parallelogram."}
              </strong>
            </footer>
          </article>
        </section>
        {showMeasures && (
          <section className="pc10076-measures">
            <article>
              <h2>LIVE MEASUREMENTS</h2>
              <p>
                <b>AB = {sides[0]}</b>
                <b>CD = {sides[2]}</b>
                <b>AD = {sides[3]}</b>
                <b>BC = {sides[1]}</b>
              </p>
              <p>
                <b>AO = {half[0]}</b>
                <b>OC = {half[1]}</b>
                <b>BO = {half[2]}</b>
                <b>OD = {half[3]}</b>
              </p>
            </article>
            <article>
              <h2>ANGLE MEASUREMENTS</h2>
              <p>
                {ang.map((n, i) => (
                  <b key={i}>
                    ∠{["A", "B", "C", "D"][i]} = {n}°
                  </b>
                ))}
              </p>
            </article>
          </section>
        )}
        <section className="pc10076-theory">
          <Why />
          <Worked />
          <Warning />
        </section>
        <section className="pc10076-challenge">
          <h2>YOUR CHALLENGE</h2>
          <p>
            Adjust the quadrilateral or its evidence so that exactly ONE
            condition turns green. Then justify your answer.
          </p>
          <div>
            <article>
              <b>Target: Exactly 1 condition should be satisfied.</b>
              {names.map((x, i) => (
                <label key={x}>
                  <input type="radio" readOnly checked={certs[i]} />
                  {x}
                </label>
              ))}
            </article>
            <article>
              <label>
                Justify your answer
                <textarea
                  aria-label="Challenge justification"
                  value={text}
                  onChange={(e) =>
                    act(() => {
                      setText(e.target.value);
                      setGraded(false);
                    })
                  }
                  placeholder="Type your justification here..."
                />
              </label>
              <button onClick={() => act(() => setGraded(true))}>
                Check Answer
              </button>
              {graded && (
                <p
                  className={
                    count === 1 && text.trim().length >= 12
                      ? "correct"
                      : "incorrect"
                  }
                >
                  {count === 1 && text.trim().length >= 12
                    ? "Correct: one sufficient condition and a justification are present."
                    : "Keep exactly one condition active and explain why it is sufficient."}
                </p>
              )}
            </article>
            <aside>
              <Lightbulb />
              <b>TIP</b>
              <p>
                Try making one pair of opposite sides equal and parallel, but
                not the other pair.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <nav className="pc10076-adjacent">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-diagonals">
          <ArrowLeft /> Previous: Quadrilateral Diagonals
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-midpoint-theorem">
          Next: Midpoint Theorem <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function Mini({ warning = false }: { warning?: boolean }) {
  return (
    <svg viewBox="0 0 180 110">
      <path d={warning ? "M52 14H142L165 95H20Z" : "M38 15H158L140 95H20Z"} />
      <line x1={warning ? 52 : 38} y1="15" x2={warning ? 165 : 140} y2="95" />
      <line x1="158" y1="15" x2="20" y2="95" />
    </svg>
  );
}
function Why() {
  return (
    <article>
      <h2>WHY IT WORKS</h2>
      <p>
        If the diagonals of a quadrilateral bisect each other, then it has the
        properties of a parallelogram.
      </p>
      <section>
        <b>Proof idea:</b>
        <p>
          From AO = OC and BO = OD, triangles AOB and COD are congruent by SSS.
          Hence AB ∥ CD and AD ∥ BC.
        </p>
      </section>
    </article>
  );
}
function Worked() {
  return (
    <article>
      <h2>WORKED EXAMPLE</h2>
      <p>In quadrilateral PQRS, diagonals PR and QS bisect each other at O.</p>
      <Mini />
      <p>
        <b>Given:</b> PO = OR and QO = OS
        <br />
        <b>To prove:</b> PQRS is a parallelogram.
      </p>
      <b>Conclusion: PQ ∥ SR and PS ∥ QR</b>
    </article>
  );
}
function Warning() {
  return (
    <article className="warning">
      <h2>
        <TriangleAlert /> WARNING
      </h2>
      <p>Equal diagonals alone are NOT sufficient!</p>
      <Mini warning />
      <p>In this isosceles trapezium, AC = BD but it is not a parallelogram.</p>
    </article>
  );
}
