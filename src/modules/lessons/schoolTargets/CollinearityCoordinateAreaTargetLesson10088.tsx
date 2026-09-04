import {
  ArrowLeft,
  ArrowRight,
  Minus,
  MousePointer2,
  Move,
  RotateCcw,
  Trash2,
  Plus,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CollinearityCoordinateAreaTargetLesson10088.css";

type Point = { x: number; y: number };
type Key = "a" | "b" | "c";
type Tool = "select" | "pan" | "delete";
const START: Record<Key, Point> = {
  a: { x: 1, y: 2 },
  b: { x: 3, y: 4 },
  c: { x: 5, y: 6 },
};
const round = (n: number, p = 4) => Math.round(n * 10 ** p) / 10 ** p;
const derive = (v: Record<Key, Point>) => {
  const { a, b, c } = v,
    d = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y),
    area = Math.abs(d) / 2,
    den = Math.hypot(b.y - a.y, b.x - a.x),
    distance = den
      ? Math.abs(
          (b.y - a.y) * c.x - (b.x - a.x) * c.y + b.x * a.y - b.y * a.x,
        ) / den
      : 0;
  return {
    det: round(d),
    signed: round(d / 2),
    area: round(area),
    distance: round(distance),
    collinear: Math.abs(d) < 0.0001,
  };
};
const project = (p: Point, a: Point, b: Point) => {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    t = (dx * (p.x - a.x) + dy * (p.y - a.y)) / (dx * dx + dy * dy || 1);
  return { x: round(a.x + t * dx, 2), y: round(a.y + t * dy, 2) };
};

export default function CollinearityCoordinateAreaTargetLesson10088({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [lineFit, setLineFit] = useState(true),
    [tool, setTool] = useState<Tool>("select"),
    [zoom, setZoom] = useState(1),
    [dragging, setDragging] = useState<Key | null>(null),
    [tab, setTab] = useState(0),
    [equation, setEquation] = useState(""),
    [checked, setChecked] = useState(false),
    [actions, setActions] = useState(0),
    [visibleC, setVisibleC] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null),
    m = useMemo(() => derive(points), [points]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: Key, p: Point) =>
    setPoints((v) => ({
      ...v,
      [key]: {
        x: Math.max(-6, Math.min(6, round(p.x, 1))),
        y: Math.max(-6, Math.min(7, round(p.y, 1))),
      },
    }));
  const local = (e: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    return r
      ? {
          x: ((e.clientX - r.left) / r.width) * 13 - 6,
          y: 7 - ((e.clientY - r.top) / r.height) * 13,
        }
      : null;
  };
  const resetPoint = (key: Key) =>
    act(() => {
      setPoints((v) => ({ ...v, [key]: START[key] }));
      if (key === "c") setVisibleC(true);
      setChecked(false);
    });
  const snap = () =>
    act(() => {
      setPoints((v) => ({ ...v, c: project(v.c, v.a, v.b) }));
      setVisibleC(true);
      setChecked(false);
    });
  const normalized = equation
    .toLowerCase()
    .replace(/\s/g, "")
    .replace("y=1x", "y=x");
  const equationCorrect = normalized === "y=x+1" || normalized === "y=1+x";
  const sx = (x: number) => (x + 6) * 34,
    sy = (y: number) => (7 - y) * 34;
  const lineEnds = useMemo(() => {
    const dx = points.b.x - points.a.x,
      dy = points.b.y - points.a.y;
    if (Math.abs(dx) < 0.001)
      return [
        { x: points.a.x, y: -6 },
        { x: points.a.x, y: 7 },
      ];
    const slope = dy / dx;
    return [
      { x: -6, y: points.a.y + slope * (-6 - points.a.x) },
      { x: 6, y: points.a.y + slope * (6 - points.a.x) },
    ];
  }, [points.a, points.b]);
  return (
    <section
      className="cca10088-page"
      data-testid="school-mockup-0762"
      data-object-model="dedicated-three-point-zero-determinant-line-distance-engine"
      data-a={`${points.a.x},${points.a.y}`}
      data-b={`${points.b.x},${points.b.y}`}
      data-c={`${points.c.x},${points.c.y}`}
      data-determinant={m.det}
      data-signed-area={m.signed}
      data-area={m.area}
      data-distance={m.distance}
      data-collinear={String(m.collinear && visibleC)}
      data-tool={tool}
      data-zoom={zoom}
      data-equation-correct={String(equationCorrect)}
      data-checked={String(checked)}
      data-actions={actions}
    >
      <header className="cca10088-hero">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Collinearity Using Coordinate Area</h1>
        <p>
          Test whether three points are collinear by calculating the area of the
          triangle they form.
        </p>
      </header>
      <nav className="cca10088-tabs">
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
      <aside className="cca10088-rule">
        <b>ⓘ Rule:</b> Three points A, B, C are collinear if and only if the
        area of △ABC is 0.<span>Determinant</span>
        <span>Signed area</span>
        <span>Zero-area snap</span>
      </aside>
      <main>
        <section className="cca10088-lab">
          <aside>
            <h2>Move points A, B and C</h2>
            <p>Drag the points on the plane or edit their coordinates.</p>
            {(["a", "b", "c"] as Key[]).map((key) => (
              <div className={`point ${key}`} key={key}>
                <b>● {key.toUpperCase()}</b>
                <label>
                  x
                  <input
                    aria-label={`Collinearity ${key.toUpperCase()} x`}
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
                  y
                  <input
                    aria-label={`Collinearity ${key.toUpperCase()} y`}
                    type="number"
                    value={points[key].y}
                    onChange={(e) =>
                      act(() =>
                        update(key, { ...points[key], y: +e.target.value }),
                      )
                    }
                  />
                </label>
                <button
                  aria-label={`Reset point ${key.toUpperCase()}`}
                  onClick={() => resetPoint(key)}
                >
                  <RotateCcw />
                </button>
              </div>
            ))}
            <section className="metrics">
              <h3>Determinant (2 × Area)</h3>
              <strong>
                D = |x₁ y₁ 1; x₂ y₂ 1; x₃ y₃ 1| = {visibleC ? m.det : "—"}
              </strong>
              <h3>Area of △ABC</h3>
              <strong>A = |D|/2 = {visibleC ? m.area : "—"}</strong>
              <h3>Signed area gauge</h3>
              <div className="gauge">
                <i />
                <b>{visibleC ? m.signed : 0}</b>
              </div>
              <em className={m.collinear && visibleC ? "yes" : ""}>
                {m.collinear && visibleC
                  ? "✓ Exactly zero"
                  : "Move C onto line AB"}
              </em>
            </section>
            <section className="result">
              <h3>Collinearity result</h3>
              <strong className={m.collinear && visibleC ? "yes" : ""}>
                {m.collinear && visibleC ? "✓ Collinear" : "Not collinear"}
              </strong>
              <small>
                {m.collinear && visibleC
                  ? "Area = 0 → Points lie on a straight line."
                  : `Area = ${m.area}`}
              </small>
            </section>
            <label className="switch">
              Show line-fit{" "}
              <input
                aria-label="Show line fit"
                type="checkbox"
                checked={lineFit}
                onChange={(e) => act(() => setLineFit(e.target.checked))}
              />
            </label>
            <button className="snap" onClick={snap}>
              🧲 Snap C to line AB (area = 0)
            </button>
          </aside>
          <article>
            <header>
              <div>
                <button
                  aria-label="Select tool"
                  className={tool === "select" ? "active" : ""}
                  onClick={() => act(() => setTool("select"))}
                >
                  <MousePointer2 />
                </button>
                <button
                  aria-label="Pan tool"
                  className={tool === "pan" ? "active" : ""}
                  onClick={() => act(() => setTool("pan"))}
                >
                  <Move />
                </button>
                <button
                  aria-label={visibleC ? "Delete point C" : "Restore point C"}
                  className={tool === "delete" ? "active" : ""}
                  onClick={() =>
                    act(() => {
                      setTool("delete");
                      setVisibleC((v) => !v);
                    })
                  }
                >
                  <Trash2 />
                </button>
              </div>
              <div>
                Zoom{" "}
                <button
                  aria-label="Zoom out"
                  onClick={() =>
                    act(() => setZoom((v) => Math.max(0.6, round(v - 0.1, 1))))
                  }
                >
                  <Minus />
                </button>
                <b>{Math.round(zoom * 100)}%</b>
                <button
                  aria-label="Zoom in"
                  onClick={() =>
                    act(() => setZoom((v) => Math.min(1.5, round(v + 0.1, 1))))
                  }
                >
                  <Plus />
                </button>
              </div>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 442 442"
              aria-label="Draggable collinearity coordinate plane"
              onPointerMove={(e) => {
                if (!dragging || tool !== "select") return;
                const q = local(e);
                if (q) update(dragging, q);
              }}
              onPointerUp={() => dragging && act(() => setDragging(null))}
              onPointerLeave={() => dragging && act(() => setDragging(null))}
            >
              <g
                transform={`translate(${221 * (1 - zoom)} ${221 * (1 - zoom)}) scale(${zoom})`}
              >
                {Array.from({ length: 14 }, (_, i) => (
                  <g key={i}>
                    <line
                      className="grid"
                      x1={i * 34}
                      y1="0"
                      x2={i * 34}
                      y2="442"
                    />
                    <line
                      className="grid"
                      x1="0"
                      y1={i * 34}
                      x2="442"
                      y2={i * 34}
                    />
                  </g>
                ))}
                <line className="axis" x1="0" y1={sy(0)} x2="442" y2={sy(0)} />
                <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2="442" />
                {lineFit && (
                  <line
                    className="fit"
                    x1={sx(lineEnds[0].x)}
                    y1={sy(lineEnds[0].y)}
                    x2={sx(lineEnds[1].x)}
                    y2={sy(lineEnds[1].y)}
                  />
                )}
                <path
                  className="triangle"
                  d={`M${sx(points.a.x)} ${sy(points.a.y)}L${sx(points.b.x)} ${sy(points.b.y)}L${sx(points.c.x)} ${sy(points.c.y)}Z`}
                />
                {(["a", "b", "c"] as Key[])
                  .filter((k) => k !== "c" || visibleC)
                  .map((key) => (
                    <g key={key}>
                      <circle
                        className={key}
                        tabIndex={0}
                        aria-label={`Draggable collinearity point ${key.toUpperCase()}`}
                        cx={sx(points[key].x)}
                        cy={sy(points[key].y)}
                        r="7"
                        onPointerDown={(e) => {
                          if (tool === "delete" && key === "c") {
                            setVisibleC(false);
                            return;
                          }
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
                      <text x={sx(points[key].x) + 8} y={sy(points[key].y) - 8}>
                        {key.toUpperCase()}({points[key].x}, {points[key].y})
                      </text>
                    </g>
                  ))}
              </g>
            </svg>
            <footer>
              <span>
                Distance of C from line AB (perpendicular)
                <strong>d = {visibleC ? m.distance.toFixed(4) : "—"}</strong>
              </span>
              <span>
                Interpretation: d = 0
                <small>
                  {m.collinear && visibleC
                    ? "Point C lies on line AB."
                    : "Point C is away from line AB."}
                </small>
              </span>
            </footer>
          </article>
        </section>
        <section className="cca10088-cards">
          <article>
            <h2>💡 Why it works</h2>
            <p>Twice the signed area of △ABC is the determinant:</p>
            <strong>D=x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂).</strong>
            <p>If D=0, then A=|D|/2=0, so the points are collinear.</p>
          </article>
          <article>
            <h2>▣ Worked example</h2>
            <p>A(1,2), B(3,4), C(5,6)</p>
            <strong>D = 1(4−6)+3(6−2)+5(2−4) = 0</strong>
            <p>A=|0|/2=0</p>
            <em>Result: Collinear ✓</em>
          </article>
          <article className="warning">
            <h2>⚠ Common misconception</h2>
            <p>A very small area ≠ exactly zero.</p>
            <p>Floating-point rounding can make a tiny area look like zero.</p>
            <p>Use zero-area snap or check that D=0 exactly.</p>
          </article>
        </section>
        <section className="cca10088-challenge">
          <h2>◴ Challenge: Make the points collinear</h2>
          <p>
            Move point C anywhere, then drag it so that the area becomes exactly
            zero. When collinear, give the equation of the line through A and B.
          </p>
          <div>
            <article>
              <h3>Your line equation</h3>
              <input
                aria-label="Line equation"
                value={equation}
                onChange={(e) =>
                  act(() => {
                    setEquation(e.target.value);
                    setChecked(false);
                  })
                }
                placeholder="y = mx + c"
              />
              <button onClick={() => act(() => setChecked(true))}>
                Check answer
              </button>
            </article>
            <article>
              <h3>Hint</h3>
              <p>
                The line through A(1,2) and B(3,4) has slope m=(4−2)/(3−1)=1.
              </p>
              <p>Use point-slope or slope-intercept form.</p>
            </article>
            <article>
              <h3>Progress</h3>
              <p>{m.collinear && visibleC ? "◉" : "○"} Area = 0</p>
              <p>
                {m.distance === 0 && visibleC ? "◉" : "○"} Line-fit passes
                through all three points
              </p>
              <p>
                {checked && equationCorrect ? "◉" : "○"} Equation is correct
              </p>
              <em
                className={
                  checked && m.collinear && equationCorrect ? "yes" : ""
                }
              >
                {checked
                  ? m.collinear && equationCorrect
                    ? "Challenge complete ✓"
                    : "Check the point and equation."
                  : "Ready to check"}
              </em>
            </article>
          </div>
        </section>
      </main>
      <nav className="cca10088-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-area-of-triangle-using-coordinates">
          <ArrowLeft /> Previous Lesson
          <br />
          Area of Triangle Using Coordinates
        </Link>
        <span>
          Lesson 1 of 5<i />
        </span>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-section-formula">
          Next Lesson
          <br />
          Section Formula <ArrowRight />
        </Link>
      </nav>
      <aside className="cca10088-tip">
        ✦ <b>Tip:</b> Drag points to explore. Use zero-area snap for exact
        collinearity.
      </aside>
    </section>
  );
}
