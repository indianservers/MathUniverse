import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramAnglesTargetLesson10074.css";

type Point = { x: number; y: number };
type Vertex = "a" | "b" | "c" | "d";
type Base = { a: Point; b: Point; d: Point };
const START: Base = {
  a: { x: 82, y: 85 },
  b: { x: 402, y: 85 },
  d: { x: 172, y: 312 },
};
const round = (n: number) => Math.round(n);
const angleBetween = (u: Point, v: Point) => {
  const dot = u.x * v.x + u.y * v.y;
  const mag = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  return round(
    (Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180) / Math.PI,
  );
};

export default function ParallelogramAnglesTargetLesson10074({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [base, setBase] = useState(START),
    [diagonal, setDiagonal] = useState<"AC" | "BD">("AC");
  const [showDiagonal, setShowDiagonal] = useState(true),
    [values, setValues] = useState(true);
  const [parallel, setParallel] = useState(true),
    [proofStep, setProofStep] = useState(0),
    [tab, setTab] = useState(0);
  const [active, setActive] = useState<Vertex | null>(null),
    [challengeB, setChallengeB] = useState(95),
    [answers, setAnswers] = useState([85, 85, 95]),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const c = useMemo(
    () => ({
      x: base.b.x + base.d.x - base.a.x,
      y: base.b.y + base.d.y - base.a.y,
    }),
    [base],
  );
  const angleA = angleBetween(
    { x: base.b.x - base.a.x, y: base.b.y - base.a.y },
    { x: base.d.x - base.a.x, y: base.d.y - base.a.y },
  );
  const angleB = 180 - angleA,
    angles = [angleA, angleB, angleA, angleB];
  const score = [180 - challengeB, 180 - challengeB, challengeB].filter(
    (n, i) => n === answers[i],
  ).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: Vertex, point: Point) =>
    setBase((old) => {
      const p = {
        x: Math.max(40, Math.min(500, point.x)),
        y: Math.max(45, Math.min(345, point.y)),
      };
      if (key === "a" || key === "b" || key === "d")
        return { ...old, [key]: p };
      return {
        ...old,
        d: { x: p.x - old.b.x + old.a.x, y: p.y - old.b.y + old.a.y },
      };
    });
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    return box
      ? {
          x: ((event.clientX - box.left) / box.width) * 540,
          y: ((event.clientY - box.top) / box.height) * 390,
        }
      : null;
  };
  const keyMove = (key: Vertex, dx: number, dy: number) => {
    const p = key === "c" ? c : base[key];
    act(() => update(key, { x: p.x + dx, y: p.y + dy }));
  };
  const reset = () =>
    act(() => {
      setBase(START);
      setDiagonal("AC");
      setShowDiagonal(true);
      setValues(true);
      setParallel(true);
      setProofStep(0);
      setChallengeB(95);
      setAnswers([85, 85, 95]);
    });
  return (
    <section
      className="pa10074-page"
      data-testid="school-mockup-0748"
      data-object-model="dedicated-constrained-parallelogram-opposite-angle-engine"
      data-points={`${base.a.x},${base.a.y};${base.b.x},${base.b.y};${c.x},${c.y};${base.d.x},${base.d.y}`}
      data-angles={angles.join(",")}
      data-diagonal={diagonal}
      data-layers={`${+showDiagonal},${+values},${+parallel}`}
      data-proof-step={proofStep + 1}
      data-challenge={`${challengeB};${answers.join(",")};${score}/3`}
      data-actions={actions}
    >
      <header className="pa10074-hero">
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Parallelogram Opposite Angles</h1>
        <p>
          Explore and prove that in a parallelogram, opposite angles are equal
          and adjacent angles are supplementary.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="pa10074-tabs">
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
        <section className="pa10074-lab">
          <header>
            <div>
              <h2>INTERACTIVE PARALLELOGRAM LAB</h2>
              <p>
                Drag any vertex to explore. Toggle diagonals to see the proof in
                action.
              </p>
            </div>
            <label>
              Show diagonals{" "}
              <button
                role="switch"
                aria-checked={showDiagonal}
                className={showDiagonal ? "on" : ""}
                onClick={() => act(() => setShowDiagonal(!showDiagonal))}
              >
                <i />
              </button>
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="pa10074-work">
            <aside>
              <section>
                <h3>MEASUREMENTS</h3>
                {["A", "B", "C", "D"].map((x, i) => (
                  <p key={x}>
                    <b>∠{x}</b>
                    <span>
                      {angles[i]}° <i className={`c${i}`} />
                    </span>
                  </p>
                ))}
                <Toggle
                  label="Show angle values"
                  value={values}
                  onChange={() => act(() => setValues(!values))}
                />
                <Toggle
                  label="Show parallel marks"
                  value={parallel}
                  onChange={() => act(() => setParallel(!parallel))}
                />
                <Toggle
                  label="Show diagonals"
                  value={showDiagonal}
                  onChange={() => act(() => setShowDiagonal(!showDiagonal))}
                />
              </section>
              <section>
                <h3>DRAG TIPS</h3>
                <p>Drag any vertex (A, B, C, or D) to change the shape.</p>
                <p>The parallelogram properties will always hold.</p>
              </section>
            </aside>
            <article className="pa10074-canvas">
              <svg
                ref={svgRef}
                viewBox="0 0 540 390"
                aria-label="Draggable opposite-angle parallelogram"
                onPointerMove={(e) => {
                  if (!active) return;
                  const p = pointer(e);
                  if (p) update(active, p);
                }}
                onPointerUp={() => active && act(() => setActive(null))}
                onPointerLeave={() => active && act(() => setActive(null))}
              >
                <defs>
                  <pattern
                    id="paGrid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M24 0H0V24" />
                  </pattern>
                </defs>
                <rect width="540" height="390" fill="url(#paGrid)" />
                <path
                  className="shape"
                  d={`M${base.a.x} ${base.a.y}L${base.b.x} ${base.b.y}L${c.x} ${c.y}L${base.d.x} ${base.d.y}Z`}
                />
                {showDiagonal && (
                  <line
                    className="diagonal"
                    x1={diagonal === "AC" ? base.a.x : base.b.x}
                    y1={diagonal === "AC" ? base.a.y : base.b.y}
                    x2={diagonal === "AC" ? c.x : base.d.x}
                    y2={diagonal === "AC" ? c.y : base.d.y}
                  />
                )}
                <AngleSectors
                  a={base.a}
                  b={base.b}
                  c={c}
                  d={base.d}
                  values={values}
                  angles={angles}
                />
                {parallel && (
                  <ParallelMarks a={base.a} b={base.b} c={c} d={base.d} />
                )}{" "}
                {(["a", "b", "c", "d"] as Vertex[]).map((key) => {
                  const p = key === "c" ? c : base[key];
                  return (
                    <circle
                      key={key}
                      className="handle"
                      cx={p.x}
                      cy={p.y}
                      r="7"
                      tabIndex={0}
                      aria-label={`Draggable vertex ${key.toUpperCase()}`}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setActive(key);
                      }}
                      onKeyDown={(e) => {
                        const n = e.shiftKey ? 10 : 4;
                        if (e.key === "ArrowLeft") keyMove(key, -n, 0);
                        if (e.key === "ArrowRight") keyMove(key, n, 0);
                        if (e.key === "ArrowUp") keyMove(key, 0, -n);
                        if (e.key === "ArrowDown") keyMove(key, 0, n);
                      }}
                    />
                  );
                })}
              </svg>
              <section className="pa10074-feedback">
                <h3>LIVE FEEDBACK</h3>
                <p>✓ AB ∥ CD and AD ∥ BC</p>
                <p>✓ Opposite angles are equal: ∠A = ∠C and ∠B = ∠D</p>
                <p>✓ Adjacent angles are supplementary: ∠A + ∠B = 180°</p>
              </section>
            </article>
            <aside className="pa10074-proof">
              <section>
                <h3>PROOF MODE</h3>
                <p>Step through the diagonal proof.</p>
              </section>
              <section>
                <h3>Select a diagonal:</h3>
                <button
                  className={diagonal === "AC" ? "active" : ""}
                  onClick={() => act(() => setDiagonal("AC"))}
                >
                  ◉ AC
                </button>
                <button
                  className={diagonal === "BD" ? "active" : ""}
                  onClick={() => act(() => setDiagonal("BD"))}
                >
                  ◉ BD
                </button>
              </section>
              <ProofSteps
                diagonal={diagonal}
                active={proofStep}
                onSelect={(index) => act(() => setProofStep(index))}
              />
              <section className="theorem">
                <h3>THEOREM</h3>
                <b>
                  In a parallelogram, opposite angles are equal.
                  <br />
                  Adjacent angles are supplementary.
                </b>
              </section>
            </aside>
          </div>
        </section>
        <section className="pa10074-theory">
          <Why angle={angleA} />
          <Worked angle={angleA} />
        </section>
        <section className="pa10074-lower">
          <Mistake />
          <article className="pa10074-challenge">
            <h2>
              <Trophy /> CHALLENGE: DRAG &amp; PREDICT
            </h2>
            <p>
              Drag a vertex to any position. Then, measure one angle and predict
              the others.
            </p>
            <label>
              Example: If ∠B ={" "}
              <input
                aria-label="Challenge angle B"
                type="number"
                min="1"
                max="179"
                value={challengeB}
                onChange={(e) =>
                  act(() =>
                    setChallengeB(Math.max(1, Math.min(179, +e.target.value))),
                  )
                }
              />
              °
            </label>
            {["A", "C", "D"].map((x, i) => (
              <label key={x}>
                Predict ∠{x} ={" "}
                <input
                  aria-label={`Predict angle ${x}`}
                  type="number"
                  value={answers[i]}
                  onChange={(e) =>
                    act(() => {
                      const n = [...answers];
                      n[i] = +e.target.value;
                      setAnswers(n);
                    })
                  }
                />
                °{" "}
                {answers[i] ===
                [180 - challengeB, 180 - challengeB, challengeB][i] ? (
                  <Check />
                ) : (
                  <TriangleAlert />
                )}
              </label>
            ))}
            <footer>
              <b>Challenge Tip</b>
              <p>
                Use the rules: Opposite angles are equal. Adjacent angles are
                supplementary.
              </p>
            </footer>
          </article>
        </section>
      </main>
      <nav className="pa10074-adjacent">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-diagonals">
          <ArrowLeft /> Parallelogram Diagonals
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-interior-angles">
          Parallelogram Interior Angles <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <label>
      {label}
      <button
        role="switch"
        aria-checked={value}
        className={value ? "on" : ""}
        onClick={onChange}
      >
        <i />
      </button>
    </label>
  );
}
function AngleSectors({
  a,
  b,
  c,
  d,
  values,
  angles,
}: {
  a: Point;
  b: Point;
  c: Point;
  d: Point;
  values: boolean;
  angles: number[];
}) {
  return (
    <g className="pa-angles">
      <path
        className="a"
        d={`M${a.x + 38} ${a.y}A38 38 0 0 1 ${a.x + 15} ${a.y + 35}L${a.x} ${a.y}Z`}
      />
      <path
        className="b"
        d={`M${b.x - 38} ${b.y}A38 38 0 0 0 ${b.x - 15} ${b.y + 35}L${b.x} ${b.y}Z`}
      />
      <path
        className="c"
        d={`M${c.x - 38} ${c.y}A38 38 0 0 1 ${c.x - 15} ${c.y - 35}L${c.x} ${c.y}Z`}
      />
      <path
        className="d"
        d={`M${d.x + 38} ${d.y}A38 38 0 0 0 ${d.x + 15} ${d.y - 35}L${d.x} ${d.y}Z`}
      />
      {values && (
        <>
          {[
            [a.x + 28, a.y + 48, angles[0]],
            [b.x - 55, b.y + 48, angles[1]],
            [c.x - 55, c.y - 38, angles[2]],
            [d.x + 28, d.y - 38, angles[3]],
          ].map((v, i) => (
            <text key={i} x={v[0]} y={v[1]}>
              {v[2]}°
            </text>
          ))}
        </>
      )}
    </g>
  );
}
function ParallelMarks({
  a,
  b,
  c,
  d,
}: {
  a: Point;
  b: Point;
  c: Point;
  d: Point;
}) {
  const m = (p: Point, q: Point) => ({
    x: (p.x + q.x) / 2,
    y: (p.y + q.y) / 2,
  });
  const ab = m(a, b),
    cd = m(c, d),
    ad = m(a, d),
    bc = m(b, c);
  return (
    <g className="pa-marks">
      <path
        d={`M${ab.x - 6} ${ab.y - 7}l12 14m1-14 12 14M${cd.x - 6} ${cd.y - 7}l12 14m1-14 12 14`}
      />
      <path
        d={`M${ad.x - 7} ${ad.y + 6}l14-12M${bc.x - 7} ${bc.y + 6}l14-12`}
      />
    </g>
  );
}
function ProofSteps({
  diagonal,
  active,
  onSelect,
}: {
  diagonal: "AC" | "BD";
  active: number;
  onSelect: (index: number) => void;
}) {
  const rows = [
    "Alternate interior angles",
    "Alternate interior angles",
    "Angle addition",
    "Substitution",
    "Conclusion",
  ];
  return (
    <section className="proofsteps">
      <h3>PROOF STEPS</h3>
      {rows.map((x, i) => (
        <button
          type="button"
          className={active === i ? "active" : ""}
          key={x + i}
          onClick={() => onSelect(i)}
        >
          <i>{i + 1}</i>
          <b>{x}</b>
          <p>
            {i < 2
              ? `Using diagonal ${diagonal} as a transversal gives equal alternate angles.`
              : i === 2
                ? "Add equal angles on each side of the diagonal."
                : i === 3
                  ? "Substitute the equal angle pairs."
                  : "Therefore, ∠A = ∠C and ∠B = ∠D."}
          </p>
        </button>
      ))}
    </section>
  );
}
function Why({ angle }: { angle: number }) {
  return (
    <article>
      <h2>WHY IT WORKS</h2>
      <p>
        In parallelogram ABCD, opposite sides are parallel. Using diagonal AC:
      </p>
      <ol>
        <li>∠BAC = ∠DCA (alternate interior angles).</li>
        <li>∠CAD = ∠BCA (alternate interior angles).</li>
        <li>Adding equals to equals proves ∠A = ∠C.</li>
        <li>Similarly, using BD proves ∠B = ∠D.</li>
      </ol>
      <strong>
        Current invariant: {angle}° + {180 - angle}° = 180°
      </strong>
      <footer>
        <b>Key Takeaway</b>
        <p>
          Parallel lines create equal alternate interior angles. Adding these
          equal angles proves equality of opposite angles.
        </p>
      </footer>
    </article>
  );
}
function Worked({ angle }: { angle: number }) {
  return (
    <article>
      <h2>WORKED EXAMPLE</h2>
      <p>
        <b>Given:</b> In parallelogram ABCD, ∠A = {angle}°<br />
        <b>Find:</b> ∠B, ∠C, ∠D
      </p>
      <svg viewBox="0 0 240 120">
        <path d="M45 15H210L190 105H25Z" />
        <text x="45" y="42">
          {angle}°
        </text>
        <text x="164" y="42">
          {180 - angle}°
        </text>
        <text x="155" y="94">
          {angle}°
        </text>
        <text x="43" y="94">
          {180 - angle}°
        </text>
      </svg>
      <ul>
        <li>Opposite angles: ∠C = ∠A = {angle}°</li>
        <li>
          Adjacent angles: ∠B = ∠D = 180° − {angle}° = {180 - angle}°
        </li>
      </ul>
      <footer>
        Answer: ∠B = {180 - angle}°, ∠C = {angle}°, ∠D = {180 - angle}°
      </footer>
    </article>
  );
}
function Mistake() {
  return (
    <article className="pa10074-mistake">
      <h2>
        <TriangleAlert /> COMMON MISTAKE
      </h2>
      <h3>Thinking adjacent angles are equal.</h3>
      <p>This is only true for rectangles, a special type of parallelogram.</p>
      <svg viewBox="0 0 250 135">
        <path d="M48 20H218L198 115H28Z" />
        <text x="55" y="55">
          70°
        </text>
        <text x="171" y="55">
          70° ×
        </text>
        <text x="43" y="105">
          110°
        </text>
        <text x="163" y="105">
          110°
        </text>
      </svg>
      <footer>In general, ∠A ≠ ∠B.</footer>
    </article>
  );
}
