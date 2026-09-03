import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./HeronFormulaTargetLesson10079.css";

type Point = { x: number; y: number };
type Vertex = "a" | "b" | "c";
type Sides = { a: number; b: number; c: number };

const START: Sides = { a: 13, b: 14, c: 15 };
const SCALE = 18;
const round = (n: number, places = 2) =>
  Math.round(n * 10 ** places) / 10 ** places;
const distance = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);
const valid = ({ a, b, c }: Sides) =>
  a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;

function modelFromSides(sides: Sides) {
  const safe = valid(sides) ? sides : START;
  const x = (safe.a ** 2 + safe.c ** 2 - safe.b ** 2) / (2 * safe.a);
  const h = Math.sqrt(Math.max(0, safe.c ** 2 - x ** 2));
  const origin = { x: 40, y: 270 };
  return {
    a: { x: origin.x + x * SCALE, y: origin.y - h * SCALE },
    b: origin,
    c: { x: origin.x + safe.a * SCALE, y: origin.y },
    d: { x: origin.x + x * SCALE, y: origin.y },
    x,
    h,
  };
}

const derivation = [
  ["From altitude relations", "x² + h² = c²     and     (a − x)² + h² = b²"],
  [
    "Subtract equations",
    "(a − x)² − x² = b² − c²   ⇒   x = (a² + c² − b²) / 2a",
  ],
  ["Add equations", "2h² + (x² + (a − x)²) = b² + c²"],
  ["Use identity", "x² + (a − x)² = a² − 2ax + 2x²"],
  ["Substitute x and simplify", "h² = (a+b+c)(-a+b+c)(a-b+c)(a+b-c) / 4a²"],
  ["Area of triangle", "Area Δ = ½ · a · h"],
];

const initialOrder = ["A", "B", "C", "D", "E", "F"];

export default function HeronFormulaTargetLesson10079({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState<Sides>(START);
  const [points, setPoints] = useState(() => modelFromSides(START));
  const [active, setActive] = useState<Vertex | null>(null);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(derivation.map(() => true));
  const [order, setOrder] = useState(initialOrder);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const metrics = useMemo(() => {
    const ok = valid(sides);
    const s = (sides.a + sides.b + sides.c) / 2;
    const radicand = s * (s - sides.a) * (s - sides.b) * (s - sides.c);
    return { ok, s: round(s), area: ok ? round(Math.sqrt(radicand)) : 0 };
  }, [sides]);

  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setSide = (key: keyof Sides, value: number) => {
    const next = { ...sides, [key]: Math.max(1, Math.min(20, value || 1)) };
    setSides(next);
    if (valid(next)) setPoints(modelFromSides(next));
    setChecked(false);
  };
  const reset = () =>
    act(() => {
      setSides(START);
      setPoints(modelFromSides(START));
      setOrder(initialOrder);
      setChecked(false);
      setOpen(derivation.map(() => true));
    });
  const localPoint = (ev: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    return box
      ? {
          x: ((ev.clientX - box.left) / box.width) * 360,
          y: ((ev.clientY - box.top) / box.height) * 320,
        }
      : null;
  };
  const moveVertex = (key: Vertex, point: Point) => {
    const nextPoints = {
      a: points.a,
      b: points.b,
      c: points.c,
      [key]: {
        x: Math.max(25, Math.min(335, point.x)),
        y: Math.max(25, Math.min(285, point.y)),
      },
    };
    const nextSides = {
      a: round(distance(nextPoints.b, nextPoints.c) / SCALE, 1),
      b: round(distance(nextPoints.a, nextPoints.c) / SCALE, 1),
      c: round(distance(nextPoints.a, nextPoints.b) / SCALE, 1),
    };
    if (!valid(nextSides)) return;
    setSides(nextSides);
    setPoints(modelFromSides(nextSides));
    setChecked(false);
  };
  const keyMove = (key: Vertex, dx: number, dy: number) =>
    act(() =>
      moveVertex(key, { x: points[key].x + dx, y: points[key].y + dy }),
    );
  const moveStep = (index: number, direction: -1 | 1) =>
    act(() => {
      const destination = index + direction;
      if (destination < 0 || destination >= order.length) return;
      const next = [...order];
      [next[index], next[destination]] = [next[destination], next[index]];
      setOrder(next);
      setChecked(false);
    });
  const p = points;

  return (
    <section
      className="hf10079-page"
      data-testid="school-mockup-0753"
      data-object-model="dedicated-heron-altitude-semiperimeter-area-engine"
      data-sides={`${sides.a},${sides.b},${sides.c}`}
      data-semiperimeter={metrics.s}
      data-area={metrics.area}
      data-valid={String(metrics.ok)}
      data-altitude={round(points.h)}
      data-split={round(points.x)}
      data-order={order.join("")}
      data-checked={String(checked)}
      data-actions={actions}
    >
      <header className="hf10079-hero">
        <small>CLASS 9 · MENSURATION</small>
        <h1>Heron&apos;s Formula Derivation</h1>
        <p>
          Derive Heron&apos;s area formula by connecting altitude geometry and
          algebra.
        </p>
        <div>
          <span>◷ 30 min</span>
          <span>◆ Proof Lab</span>
          <span>Class 9</span>
        </div>
      </header>

      <nav className="hf10079-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (name, index) => (
            <button
              key={name}
              className={tab === index ? "active" : ""}
              aria-selected={tab === index}
              onClick={() => act(() => setTab(index))}
            >
              {name}
            </button>
          ),
        )}
      </nav>

      <main>
        <section className="hf10079-lab">
          <div className="hf10079-controls">
            <label>Enter side lengths (units):</label>
            {(["a", "b", "c"] as const).map((key) => (
              <label key={key}>
                <i>{key}</i>
                <input
                  aria-label={`Side ${key}`}
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={sides[key]}
                  onChange={(event) =>
                    act(() => setSide(key, +event.target.value))
                  }
                />
              </label>
            ))}
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <div className="hf10079-results">
              <span>Live results</span>
              <b>
                <i>s</i> = {metrics.s}
              </b>
              <b>
                Area Δ = {metrics.area} <em>sq units</em>
              </b>
            </div>
          </div>
          {!metrics.ok && (
            <p className="hf10079-invalid">
              <TriangleAlert /> These lengths do not form a triangle. Adjust a
              side.
            </p>
          )}

          <div className="hf10079-workspace">
            <article className="hf10079-diagram">
              <h2>Triangle with altitude to side c</h2>
              <svg
                ref={svgRef}
                viewBox="0 0 360 320"
                aria-label="Draggable Heron formula triangle"
                onPointerMove={(event) => {
                  if (!active) return;
                  const next = localPoint(event);
                  if (next) moveVertex(active, next);
                }}
                onPointerUp={() => active && act(() => setActive(null))}
                onPointerLeave={() => active && act(() => setActive(null))}
              >
                <path
                  d={`M${p.a.x} ${p.a.y}L${p.b.x} ${p.b.y}L${p.c.x} ${p.c.y}Z`}
                />
                <line
                  className="altitude"
                  x1={p.a.x}
                  y1={p.a.y}
                  x2={p.d.x}
                  y2={p.d.y}
                />
                <path
                  className="right-angle"
                  d={`M${p.d.x} ${p.d.y - 15}h15v15`}
                />
                {(["a", "b", "c"] as Vertex[]).map((key) => (
                  <circle
                    key={key}
                    className="vertex"
                    tabIndex={0}
                    aria-label={`Draggable vertex ${key.toUpperCase()}`}
                    cx={p[key].x}
                    cy={p[key].y}
                    r="7"
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      setActive(key);
                    }}
                    onKeyDown={(event) => {
                      const delta = event.shiftKey ? 10 : 4;
                      if (event.key === "ArrowLeft") keyMove(key, -delta, 0);
                      if (event.key === "ArrowRight") keyMove(key, delta, 0);
                      if (event.key === "ArrowUp") keyMove(key, 0, -delta);
                      if (event.key === "ArrowDown") keyMove(key, 0, delta);
                    }}
                  />
                ))}
                <circle className="foot" cx={p.d.x} cy={p.d.y} r="5" />
                <text x={p.a.x - 7} y={p.a.y - 13}>
                  A
                </text>
                <text x={p.b.x - 8} y={p.b.y + 20}>
                  B
                </text>
                <text x={p.c.x - 3} y={p.c.y + 20}>
                  C
                </text>
                <text x={p.d.x - 5} y={p.d.y + 20}>
                  D
                </text>
                <text className="side a" x={(p.b.x + p.c.x) / 2} y={p.b.y + 36}>
                  a
                </text>
                <text
                  className="side b"
                  x={(p.a.x + p.c.x) / 2 + 12}
                  y={(p.a.y + p.c.y) / 2}
                >
                  b
                </text>
                <text
                  className="side c"
                  x={(p.a.x + p.b.x) / 2 - 25}
                  y={(p.a.y + p.b.y) / 2}
                >
                  a
                </text>
                <text className="math" x={(p.b.x + p.d.x) / 2} y={p.d.y + 34}>
                  x
                </text>
                <text className="math" x={(p.d.x + p.c.x) / 2} y={p.d.y + 34}>
                  a − x
                </text>
                <text className="height" x={p.d.x + 12} y={(p.a.y + p.d.y) / 2}>
                  h
                </text>
              </svg>
              <div className="hf10079-legend">
                <b>Legend</b>
                <span>● a = BC = {sides.a}</span>
                <span>● Altitude AD = h</span>
                <span>● b = AC = {sides.b}</span>
                <span>● BD = x</span>
                <span>● c = AB = {sides.c}</span>
                <span>● DC = a − x</span>
              </div>
              <section className="hf10079-relations">
                <h3>Key relations from right triangles</h3>
                <div>
                  <span>
                    In ΔADB:<strong>x² + h² = c²</strong>
                  </span>
                  <span>
                    In ΔADC:<strong>(a − x)² + h² = b²</strong>
                  </span>
                </div>
              </section>
            </article>

            <article className="hf10079-derivation">
              <h2>Algebraic derivation</h2>
              <p>Manipulate the relations to reach Heron&apos;s formula.</p>
              {derivation.map(([title, formula], index) => (
                <section key={title}>
                  <button
                    aria-expanded={open[index]}
                    onClick={() =>
                      act(() =>
                        setOpen((old) =>
                          old.map((value, i) => (i === index ? !value : value)),
                        ),
                      )
                    }
                  >
                    <span>{index + 1}</span>
                    <b>{title}</b>
                    <ChevronDown />
                  </button>
                  {open[index] && <p>{formula}</p>}
                </section>
              ))}
              <strong className="hf10079-formula">
                Δ = √[s(s − a)(s − b)(s − c)] &nbsp; where &nbsp; s = (a + b +
                c) / 2
              </strong>
            </article>
          </div>
        </section>

        <section className="hf10079-cards">
          <article className="why">
            <h2>Why it works</h2>
            <ul>
              <li>The altitude creates two right triangles.</li>
              <li>Pythagoras relates x, a − x, h and the sides.</li>
              <li>Algebra eliminates x and h.</li>
              <li>The result factors symmetrically using s.</li>
            </ul>
          </article>
          <article className="example">
            <h2>Worked example</h2>
            <p>
              For sides a = {sides.a}, b = {sides.b}, c = {sides.c}
            </p>
            <p>
              s = ({sides.a} + {sides.b} + {sides.c}) / 2 = {metrics.s}
            </p>
            <p>
              Δ = √[{metrics.s}({metrics.s} − {sides.a})({metrics.s} − {sides.b}
              )({metrics.s} − {sides.c})]
            </p>
            <strong>
              = {metrics.area} sq units <Check />
            </strong>
          </article>
          <article className="mistake">
            <h2>Common mistake</h2>
            <p>Using the full perimeter instead of semi-perimeter (2s).</p>
            <p className="wrong">× Wrong: use a + b + c inside every factor.</p>
            <strong>✓ Correct: use s = (a + b + c) / 2</strong>
          </article>
        </section>

        <section className="hf10079-practice">
          <h2>Practice challenge</h2>
          <p>Reorder the steps to complete the derivation.</p>
          <div className="hf10079-practice-grid">
            <ol>
              {order.map((letter, index) => (
                <li key={letter}>
                  <b>{letter}</b>
                  <span>
                    {derivation[initialOrder.indexOf(letter)]?.[1] ??
                      "Apply Heron's formula"}
                  </span>
                  <button
                    aria-label={`Move step ${letter} up`}
                    onClick={() => moveStep(index, -1)}
                  >
                    <ArrowUp />
                  </button>
                  <button
                    aria-label={`Move step ${letter} down`}
                    onClick={() => moveStep(index, 1)}
                  >
                    <ArrowDown />
                  </button>
                </li>
              ))}
            </ol>
            <aside>
              <h3>Quick verify</h3>
              <p>Check Heron&apos;s formula for a = 5, b = 5, c = 6.</p>
              <p>s = 8</p>
              <p>Δ = √(8 × 3 × 3 × 2) = 12 sq units</p>
              <button onClick={() => act(() => setChecked(true))}>
                {checked ? "Verified ✓" : "Check another triangle"}
              </button>
            </aside>
          </div>
        </section>
      </main>

      <nav className="hf10079-lesson-nav">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-converse-of-midpoint-theorem">
          <ArrowLeft /> Previous lesson
        </Link>
        <Link to="/lessons/school/class-9/class-9-mensuration-semi-perimeter-lab">
          Next lesson: Semi-Perimeter Lab <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
