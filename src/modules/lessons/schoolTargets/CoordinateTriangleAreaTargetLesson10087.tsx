import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  type PointerEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CoordinateTriangleAreaTargetLesson10087.css";

type Point = { x: number; y: number };
type Key = "a" | "b" | "c";
const START: Record<Key, Point> = {
  a: { x: 1, y: 1 },
  b: { x: 5, y: 1 },
  c: { x: 3, y: 4 },
};
const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
const measure = (v: Record<Key, Point>, swapped: boolean) => {
  const order = swapped ? [v.a, v.c, v.b] : [v.a, v.b, v.c],
    [p, q, r] = order;
  const determinant = p.x * (q.y - r.y) + q.x * (r.y - p.y) + r.x * (p.y - q.y);
  const signed = determinant / 2,
    area = Math.abs(signed),
    base = Math.hypot(v.b.x - v.a.x, v.b.y - v.a.y),
    height = base ? (2 * area) / base : 0;
  return {
    determinant: round(determinant),
    signed: round(signed),
    area: round(area),
    base: round(base),
    height: round(height),
    orientation:
      signed > 0 ? "counterclockwise" : signed < 0 ? "clockwise" : "collinear",
  };
};

export default function CoordinateTriangleAreaTargetLesson10087({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [swapped, setSwapped] = useState(false),
    [mode, setMode] = useState<"signed" | "absolute">("signed"),
    [showHeight, setShowHeight] = useState(true),
    [showCoordinates, setShowCoordinates] = useState(true),
    [dragging, setDragging] = useState<Key | null>(null),
    [tab, setTab] = useState(0),
    [explanation, setExplanation] = useState(""),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    m = useMemo(() => measure(points, swapped), [points, swapped]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: Key, next: Point) =>
    setPoints((v) => ({
      ...v,
      [key]: {
        x: Math.max(-1, Math.min(7, round(next.x, 1))),
        y: Math.max(-2, Math.min(6, round(next.y, 1))),
      },
    }));
  const local = (
    e: PointerEvent<SVGSVGElement>,
    ref: RefObject<SVGSVGElement>,
  ) => {
    const r = ref.current?.getBoundingClientRect();
    return r
      ? {
          x: ((e.clientX - r.left) / r.width) * 9 - 1,
          y: 6 - ((e.clientY - r.top) / r.height) * 8,
        }
      : null;
  };
  const reset = () =>
    act(() => {
      setPoints(START);
      setSwapped(false);
      setMode("signed");
      setShowHeight(true);
      setShowCoordinates(true);
      setExplanation("");
    });
  const sx = (x: number) => (x + 1) * 42,
    sy = (y: number) => (6 - y) * 42;
  const pointOrder = swapped
    ? [points.a, points.c, points.b]
    : [points.a, points.b, points.c];
  const formula = `${pointOrder[0].x}(${pointOrder[1].y}−${pointOrder[2].y}) + ${pointOrder[1].x}(${pointOrder[2].y}−${pointOrder[0].y}) + ${pointOrder[2].x}(${pointOrder[0].y}−${pointOrder[1].y})`;
  return (
    <section
      className="cta10087-page"
      data-testid="school-mockup-0761"
      data-object-model="dedicated-three-vertex-signed-determinant-area-engine"
      data-a={`${points.a.x},${points.a.y}`}
      data-b={`${points.b.x},${points.b.y}`}
      data-c={`${points.c.x},${points.c.y}`}
      data-determinant={m.determinant}
      data-signed-area={m.signed}
      data-absolute-area={m.area}
      data-orientation={m.orientation}
      data-swapped={String(swapped)}
      data-actions={actions}
    >
      <header className="cta10087-hero">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Area of Triangle Using Coordinates</h1>
        <p>
          Compute the area of a triangle from its vertex coordinates using the
          determinant method.
        </p>
        <p>
          Interpret the result&apos;s sign to determine orientation and use
          absolute value for geometric area.
        </p>
      </header>
      <nav className="cta10087-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
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
        <section className="cta10087-lab">
          <h2>Build and explore your triangle</h2>
          <div className="workspace">
            <aside>
              {(["a", "b", "c"] as Key[]).map((key, i) => (
                <section key={key} className={key}>
                  <h3>
                    ● {key.toUpperCase()} (x{i + 1}, y{i + 1})
                  </h3>
                  <label>
                    x{i + 1}
                    <input
                      aria-label={`Vertex ${key.toUpperCase()} x`}
                      type="number"
                      value={points[key].x}
                      onChange={(e) =>
                        act(() =>
                          update(key, { ...points[key], x: +e.target.value }),
                        )
                      }
                    />
                  </label>
                  <label>
                    y{i + 1}
                    <input
                      aria-label={`Vertex ${key.toUpperCase()} y`}
                      type="number"
                      value={points[key].y}
                      onChange={(e) =>
                        act(() =>
                          update(key, { ...points[key], y: +e.target.value }),
                        )
                      }
                    />
                  </label>
                </section>
              ))}
              <button onClick={reset}>
                <RotateCcw /> Reset triangle
              </button>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 378 336"
                aria-label="Draggable coordinate-area triangle"
                onPointerMove={(e) => {
                  if (!dragging) return;
                  const q = local(e, svgRef);
                  if (q) update(dragging, q);
                }}
                onPointerUp={() => dragging && act(() => setDragging(null))}
                onPointerLeave={() => dragging && act(() => setDragging(null))}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <g key={i}>
                    <line
                      className="grid"
                      x1={i * 42}
                      y1="0"
                      x2={i * 42}
                      y2="336"
                    />
                    <line
                      className="grid"
                      x1="0"
                      y1={i * 42}
                      x2="378"
                      y2={i * 42}
                    />
                  </g>
                ))}
                <line className="axis" x1="0" y1={sy(0)} x2="378" y2={sy(0)} />
                <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2="336" />
                <path
                  className="triangle"
                  d={`M${sx(points.a.x)} ${sy(points.a.y)}L${sx(points.b.x)} ${sy(points.b.y)}L${sx(points.c.x)} ${sy(points.c.y)}Z`}
                />
                {showHeight && (
                  <>
                    <line
                      className="height"
                      x1={sx(points.c.x)}
                      y1={sy(points.c.y)}
                      x2={sx(points.c.x)}
                      y2={sy(points.a.y)}
                    />
                    <circle
                      className="foot"
                      cx={sx(points.c.x)}
                      cy={sy(points.a.y)}
                      r="5"
                    />
                    <text x={sx(points.c.x) - 12} y={sy(points.a.y) + 24}>
                      D ({points.c.x}, {points.a.y})
                    </text>
                  </>
                )}
                {(["a", "b", "c"] as Key[]).map((key) => (
                  <circle
                    key={key}
                    className={key}
                    tabIndex={0}
                    aria-label={`Draggable vertex ${key.toUpperCase()}`}
                    cx={sx(points[key].x)}
                    cy={sy(points[key].y)}
                    r="7"
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragging(key);
                    }}
                    onKeyDown={(e) => {
                      const dx =
                          e.key === "ArrowLeft"
                            ? -1
                            : e.key === "ArrowRight"
                              ? 1
                              : 0,
                        dy =
                          e.key === "ArrowUp"
                            ? 1
                            : e.key === "ArrowDown"
                              ? -1
                              : 0;
                      if (dx || dy)
                        act(() =>
                          update(key, {
                            x: points[key].x + dx,
                            y: points[key].y + dy,
                          }),
                        );
                    }}
                  />
                ))}
                {showCoordinates &&
                  (["a", "b", "c"] as Key[]).map((key) => (
                    <text
                      className={`label ${key}`}
                      key={key}
                      x={sx(points[key].x) + (key === "b" ? 8 : -42)}
                      y={sy(points[key].y) - 10}
                    >
                      {key.toUpperCase()} ({points[key].x}, {points[key].y})
                    </text>
                  ))}
              </svg>
              <div className="toggles">
                <label>
                  <input
                    type="checkbox"
                    checked={showHeight}
                    onChange={(e) => act(() => setShowHeight(e.target.checked))}
                  />{" "}
                  Show base–height
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showCoordinates}
                    onChange={(e) =>
                      act(() => setShowCoordinates(e.target.checked))
                    }
                  />{" "}
                  Show coordinates
                </label>
              </div>
            </article>
            <aside className="method">
              <h2>Determinant method</h2>
              <h3>① Determinant (2 × signed area)</h3>
              <strong>
                | x₁ y₁ 1 |<br />| x₂ y₂ 1 | = {m.determinant}
                <br />| x₃ y₃ 1 |
              </strong>
              <p>{formula}</p>
              <p>= {m.determinant}</p>
              <h3>
                ② Signed area = ½ × {m.determinant} = {m.signed} sq. units
              </h3>
              <section>
                <h3>Orientation & area</h3>
                <label>
                  <input
                    aria-label="Signed area mode"
                    type="radio"
                    checked={mode === "signed"}
                    onChange={() => act(() => setMode("signed"))}
                  />{" "}
                  Signed area (orientation matters)
                </label>
                <strong>
                  {m.signed} sq. units ({m.orientation})
                </strong>
                <label>
                  <input
                    aria-label="Absolute area mode"
                    type="radio"
                    checked={mode === "absolute"}
                    onChange={() => act(() => setMode("absolute"))}
                  />{" "}
                  Absolute area (geometric area)
                </label>
                <strong>{m.area} sq. units</strong>
              </section>
            </aside>
          </div>
          <footer>
            <span>Base AB = {m.base} units</span>
            <span>Height from C to AB = {m.height} units</span>
            <span>
              Area = ½ × {m.base} × {m.height} = {m.area} sq. units
            </span>
          </footer>
        </section>
        <aside className="cta10087-tip">
          💡 <strong>Drag any vertex</strong> (or edit the coordinates) to see
          how the area and orientation change in real time.
        </aside>
        <section className="cta10087-cards">
          <article>
            <h2>◎ Why it works</h2>
            <p>The determinant is twice the signed area of the triangle.</p>
            <strong>
              | x₁ y₁ 1 |<br />| x₂ y₂ 1 | = 2 × (signed area)
              <br />| x₃ y₃ 1 |
            </strong>
            <p>Positive → counterclockwise (CCW)</p>
            <p>Negative → clockwise (CW)</p>
            <p>Taking absolute value gives geometric area.</p>
          </article>
          <article className="worked">
            <h2>♙ Worked example</h2>
            <p>Find the area of △ABC with A(1,1), B(5,1), C(3,4).</p>
            <p>Determinant = 12</p>
            <p>Signed area = ½ × 12 = 6 sq. units (counterclockwise)</p>
            <p>Area = ½ |12| = 6 sq. units</p>
            <em>
              <Check /> Matches base–height: ½ × 4 × 3 = 6.
            </em>
          </article>
          <article className="mistake">
            <h2>⚠ Common mistake</h2>
            <p>Forgetting the absolute value.</p>
            <p>
              Signed area may be negative, but geometric area cannot be
              negative.
            </p>
            <div>
              <b>Correct: Area = ½ |Determinant|</b>
              <b>Not correct: Area = ½ (Determinant)</b>
            </div>
          </article>
          <article className="challenge">
            <h2>♜ Challenge: swap two vertices</h2>
            <p>Swap B and C. What happens?</p>
            <p>New order: A(1,1), C(3,4), B(5,1)</p>
            <button onClick={() => act(() => setSwapped((v) => !v))}>
              {swapped ? "Restore order" : "Apply swap"}
            </button>
            <strong>
              Result: Signed area becomes {swapped ? m.signed : -m.signed} sq.
              units, but absolute area remains {m.area}.
            </strong>
            <label>
              Why does the orientation change but the area stay the same?
              <textarea
                aria-label="Orientation explanation"
                value={explanation}
                onChange={(e) => act(() => setExplanation(e.target.value))}
                placeholder="Type your explanation here..."
              />
            </label>
          </article>
        </section>
      </main>
      <nav className="cta10087-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-distance-formula">
          <ArrowLeft /> Previous: Distance Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-collinearity-using-coordinate-area">
          Next: Collinearity Using Coordinate Area <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
