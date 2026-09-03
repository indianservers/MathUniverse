import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  X,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SemiPerimeterTargetLesson10080.css";

type Sides = { a: number; b: number; c: number };
type Point = { x: number; y: number };
type Vertex = keyof Sides;
const START: Sides = { a: 5, b: 5, c: 6 };
const SCALE = 38;
const rr = (n: number, p = 3) => Math.round(n * 10 ** p) / 10 ** p;
const valid = ({ a, b, c }: Sides) => a + b > c && a + c > b && b + c > a;
const dist = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);
function geometry(s: Sides) {
  const x = (s.c ** 2 + s.a ** 2 - s.b ** 2) / (2 * s.c);
  const h = Math.sqrt(Math.max(0, s.a ** 2 - x ** 2));
  return {
    a: { x: 45 + x * SCALE, y: 275 - h * SCALE },
    b: { x: 45, y: 275 },
    c: { x: 45 + s.c * SCALE, y: 275 },
  };
}
const options: Sides[] = [
  { a: 6, b: 8, c: 10 },
  { a: 7, b: 9, c: 8 },
  { a: 5, b: 11, c: 8 },
  { a: 4, b: 12, c: 8 },
];
const area = (v: Sides) => {
  const s = (v.a + v.b + v.c) / 2;
  return Math.sqrt(Math.max(0, s * (s - v.a) * (s - v.b) * (s - v.c)));
};

export default function SemiPerimeterTargetLesson10080({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState(START),
    [points, setPoints] = useState(() => geometry(START)),
    [active, setActive] = useState<Vertex | null>(null),
    [tab, setTab] = useState(0),
    [choice, setChoice] = useState(1),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const m = useMemo(() => {
    const s = (sides.a + sides.b + sides.c) / 2;
    return {
      s: rr(s),
      p: rr(2 * s),
      f: [rr(s - sides.a), rr(s - sides.b), rr(s - sides.c)],
      area: rr(area(sides)),
      valid: valid(sides),
    };
  }, [sides]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: Vertex, value: number) => {
    const next = { ...sides, [key]: Math.max(1, Math.min(12, value)) };
    setSides(next);
    if (valid(next)) setPoints(geometry(next));
  };
  const local = (e: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    return r
      ? {
          x: ((e.clientX - r.left) / r.width) * 330,
          y: ((e.clientY - r.top) / r.height) * 310,
        }
      : null;
  };
  const move = (key: Vertex, p: Point) => {
    const n = {
      a: points.a,
      b: points.b,
      c: points.c,
      [key]: {
        x: Math.max(25, Math.min(310, p.x)),
        y: Math.max(25, Math.min(285, p.y)),
      },
    };
    const s = {
      a: rr(dist(n.b, n.c) / SCALE, 1),
      b: rr(dist(n.a, n.c) / SCALE, 1),
      c: rr(dist(n.a, n.b) / SCALE, 1),
    };
    if (valid(s)) {
      setSides(s);
      setPoints(geometry(s));
    }
  };
  const reset = () =>
    act(() => {
      setSides(START);
      setPoints(geometry(START));
      setChoice(1);
      setTab(0);
    });
  return (
    <section
      className="sp10080-page"
      data-testid="school-mockup-0754"
      data-object-model="dedicated-semiperimeter-ribbon-heron-factor-engine"
      data-sides={`${sides.a},${sides.b},${sides.c}`}
      data-perimeter={m.p}
      data-semiperimeter={m.s}
      data-factors={m.f.join(",")}
      data-area={m.area}
      data-valid={String(m.valid)}
      data-choice={choice}
      data-actions={actions}
    >
      <header className="sp10080-hero">
        <small>CLASS 9 · MENSURATION</small>
        <h1>Semi-Perimeter Lab</h1>
        <p>
          Explore how the semi-perimeter <i>s</i> controls Heron&apos;s formula.
          Drag the triangle or adjust the sides.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>number</span>
        </div>
      </header>
      <nav className="sp10080-tabs">
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
        <section className="sp10080-lab">
          <article className="sp10080-controls">
            <header>
              <h2>1. TRIANGLE CONTROLS</h2>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </header>
            <p>Adjust side lengths</p>
            {(["a", "b", "c"] as Vertex[]).map((k) => (
              <label key={k}>
                <b>{k}</b>
                <input
                  aria-label={`Side ${k} slider`}
                  type="range"
                  min="1"
                  max="12"
                  step="0.1"
                  value={sides[k]}
                  onChange={(e) => act(() => update(k, +e.target.value))}
                />
                <input
                  aria-label={`Side ${k}`}
                  type="number"
                  min="1"
                  max="12"
                  step="0.1"
                  value={sides[k]}
                  onChange={(e) => act(() => update(k, +e.target.value))}
                />
              </label>
            ))}
            <p>Or drag the triangle&apos;s vertices</p>
            <svg
              ref={svgRef}
              viewBox="0 0 330 310"
              aria-label="Draggable semi-perimeter triangle"
              onPointerMove={(e) => {
                if (active) {
                  const p = local(e);
                  if (p) move(active, p);
                }
              }}
              onPointerUp={() => active && act(() => setActive(null))}
              onPointerLeave={() => active && act(() => setActive(null))}
            >
              <path
                d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${points.c.x} ${points.c.y}Z`}
              />
              {(["a", "b", "c"] as Vertex[]).map((k) => (
                <circle
                  key={k}
                  tabIndex={0}
                  aria-label={`Draggable vertex ${k.toUpperCase()}`}
                  cx={points[k].x}
                  cy={points[k].y}
                  r="7"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setActive(k);
                  }}
                  onKeyDown={(e) => {
                    const d = e.shiftKey ? 10 : 4;
                    if (e.key === "ArrowLeft")
                      act(() =>
                        move(k, { x: points[k].x - d, y: points[k].y }),
                      );
                    if (e.key === "ArrowRight")
                      act(() =>
                        move(k, { x: points[k].x + d, y: points[k].y }),
                      );
                    if (e.key === "ArrowUp")
                      act(() =>
                        move(k, { x: points[k].x, y: points[k].y - d }),
                      );
                    if (e.key === "ArrowDown")
                      act(() =>
                        move(k, { x: points[k].x, y: points[k].y + d }),
                      );
                  }}
                />
              ))}
              <text x={points.a.x - 6} y={points.a.y - 12}>
                A
              </text>
              <text x={points.b.x - 5} y={points.b.y + 22}>
                B
              </text>
              <text x={points.c.x - 4} y={points.c.y + 22}>
                C
              </text>
              <text
                x={(points.a.x + points.b.x) / 2 - 18}
                y={(points.a.y + points.b.y) / 2}
              >
                {sides.a}
              </text>
              <text
                x={(points.a.x + points.c.x) / 2 + 10}
                y={(points.a.y + points.c.y) / 2}
              >
                {sides.b}
              </text>
              <text x={(points.b.x + points.c.x) / 2} y={points.b.y + 26}>
                {sides.c}
              </text>
            </svg>
            <strong className={m.valid ? "valid" : "invalid"}>
              {m.valid ? <CheckCircle2 /> : <X />}
              {m.valid
                ? "Valid triangle (all factors ≥ 0)"
                : "Not a valid triangle"}
            </strong>
          </article>
          <article className="sp10080-ribbon">
            <h2>2. PERIMETER RIBBON → SEMI-PERIMETER</h2>
            <p>The perimeter ribbon folds into two equal halves.</p>
            <h3>Perimeter P = a + b + c</h3>
            <div className="whole">
              {(["a", "b", "c"] as Vertex[]).map((k) => (
                <span key={k} style={{ flex: sides[k] }}>
                  {sides[k]}
                </span>
              ))}
            </div>
            <b className="total">{m.p}</b>
            <div className="fold">
              ↓<b>Fold</b>
            </div>
            <div className="halves">
              <div>
                {(["a", "b", "c"] as Vertex[]).map((k) => (
                  <span key={k} style={{ flex: sides[k] }}>
                    {sides[k]}
                  </span>
                ))}
              </div>
              <b>{m.s}</b>
              <div>
                {(["a", "b", "c"] as Vertex[]).map((k) => (
                  <span key={k} style={{ flex: sides[k] }}>
                    {sides[k]}
                  </span>
                ))}
              </div>
              <b>{m.s}</b>
            </div>
            <div className="semi">
              <b>Semi-perimeter</b>
              <span>
                s = (a + b + c) / 2 = {m.p} / 2 = <strong>{m.s}</strong>
              </span>
            </div>
            <h2>
              3. HERON FACTORS <small>(must be nonnegative)</small>
            </h2>
            <div className="factors">
              {m.f.map((f, i) => (
                <span key={i}>
                  <b>s − {["a", "b", "c"][i]}</b>
                  {m.s} − {sides[(["a", "b", "c"] as Vertex[])[i]]} = {f}
                  <i
                    style={{
                      width: `${Math.max(0, Math.min(100, (f / m.s) * 100))}%`,
                    }}
                  />
                </span>
              ))}
            </div>
            <p className="area">
              <b>Area Δ</b> = √s(s−a)(s−b)(s−c) = √{m.s}·{m.f[0]}·{m.f[1]}·
              {m.f[2]} = <strong>{m.area}</strong>
            </p>
          </article>
        </section>
        <section className="sp10080-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>Heron&apos;s formula uses the semi-perimeter s.</p>
            <p>✓ s = (a+b+c)/2, half the perimeter.</p>
            <p>✓ For a valid triangle all three factors are nonnegative.</p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>If a=5, b=5, c=6:</p>
            <p>s = (5+5+6)/2 = 8</p>
            <p>A = √(8·3·3·2) = √144 = 12</p>
          </article>
          <article className="warn">
            <h2>COMMON MISCONCEPTION</h2>
            <p>Semi-perimeter is half the perimeter, not half of each side.</p>
            <p>✕ Wrong: 5/2, 5/2, 6/2</p>
            <p>✓ Right: s = (5+5+6)/2 = 8</p>
          </article>
        </section>
        <section className="sp10080-practice">
          <h2>PRACTICE CHALLENGE</h2>
          <p>Choose sides with s = 12. Which set gives the maximum area?</p>
          <div>
            {options.map((o, i) => (
              <button
                key={i}
                className={choice === i ? "active" : ""}
                onClick={() => act(() => setChoice(i))}
              >
                <span>
                  ◉ ({o.a}, {o.b}, {o.c})
                </span>
                <b>Area = {rr(area(o))}</b>
              </button>
            ))}
          </div>
          <strong>
            <CheckCircle2 /> Explanation: For fixed s, area is maximized when
            the sides are as equal as possible.
          </strong>
        </section>
      </main>
      <nav className="sp10080-nav">
        <Link to="/lessons/school/class-9/class-9-mensuration-heron-s-formula-derivation">
          <ArrowLeft /> Previous
        </Link>
        <span>Lesson 2 of 5</span>
        <Link to="/lessons/school/class-9/class-9-mensuration-coordinate-area-versus-heron-s-formula">
          Next <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
