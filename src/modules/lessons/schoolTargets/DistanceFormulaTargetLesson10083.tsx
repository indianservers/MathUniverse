import { ArrowLeft, ArrowRight, Expand, RotateCcw } from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DistanceFormulaTargetLesson10083.css";

type Point = { x: number; y: number };
type PointKey = "a" | "b";
const START = { a: { x: 1, y: 2 }, b: { x: 5, y: 5 } };
const rr = (n: number, places = 2) =>
  Math.round(n * 10 ** places) / 10 ** places;

export default function DistanceFormulaTargetLesson10083({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [active, setActive] = useState<PointKey | null>(null),
    [showGrid, setShowGrid] = useState(true),
    [gridStep, setGridStep] = useState(1),
    [tab, setTab] = useState(0),
    [expanded, setExpanded] = useState(false),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const metrics = useMemo(() => {
    const dx = Math.abs(points.b.x - points.a.x),
      dy = Math.abs(points.b.y - points.a.y),
      square = dx ** 2 + dy ** 2;
    return {
      dx: rr(dx),
      dy: rr(dy),
      square: rr(square),
      distance: rr(Math.sqrt(square)),
    };
  }, [points]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: PointKey, next: Point) =>
    setPoints((old) => ({ ...old, [key]: fixed(snapPoint(next, gridStep)) }));
  const reset = () =>
    act(() => {
      setPoints(START);
      setShowGrid(true);
      setGridStep(1);
      setExpanded(false);
    });
  const local = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    return box
      ? {
          x: ((event.clientX - box.left) / box.width) * 14 - 7,
          y: 7 - ((event.clientY - box.top) / box.height) * 14,
        }
      : null;
  };
  const moveKey = (key: PointKey, dx: number, dy: number) =>
    act(() => update(key, { x: points[key].x + dx, y: points[key].y + dy }));
  const sx = (x: number) => (x + 7) * 34.2857,
    sy = (y: number) => (7 - y) * 34.2857;
  return (
    <section
      className={`df10083-page ${expanded ? "expanded" : ""}`}
      data-testid="school-mockup-0757"
      data-object-model="dedicated-two-point-distance-pythagorean-engine"
      data-a={`${points.a.x},${points.a.y}`}
      data-b={`${points.b.x},${points.b.y}`}
      data-differences={`${metrics.dx},${metrics.dy}`}
      data-square={metrics.square}
      data-distance={metrics.distance}
      data-grid={String(showGrid)}
      data-grid-step={gridStep}
      data-expanded={String(expanded)}
      data-actions={actions}
    >
      <header className="df10083-hero">
        <h1>Distance Formula ☆</h1>
        <p>
          <b>Objective:</b> Derive and use the distance between two coordinate
          points.
        </p>
        <div>
          <span>◷ 18 min</span>
          <span>Class 10</span>
          <span>Coordinate Geometry</span>
        </div>
      </header>
      <nav className="df10083-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map(
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
        <section className="df10083-lab">
          <aside>
            <h2>Explore on the coordinate plane</h2>
            <p>
              Drag points A or B, or edit their coordinates. See the right
              triangle, differences, and distance update live.
            </p>
            {(["a", "b"] as PointKey[]).map((key, index) => (
              <section key={key} className={`point-card ${key}`}>
                <h3>
                  ● Point {key.toUpperCase()} (x{index + 1}, y{index + 1})
                </h3>
                <label>
                  x<sub>{index + 1}</sub>
                  <input
                    aria-label={`Point ${key.toUpperCase()} x`}
                    type="number"
                    min="-6"
                    max="6"
                    step={gridStep}
                    value={points[key].x}
                    onChange={(e) =>
                      act(() =>
                        update(key, { ...points[key], x: +e.target.value }),
                      )
                    }
                  />
                </label>
                <label>
                  y<sub>{index + 1}</sub>
                  <input
                    aria-label={`Point ${key.toUpperCase()} y`}
                    type="number"
                    min="-6"
                    max="6"
                    step={gridStep}
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
            <section className="differences">
              <h3>Differences</h3>
              <p>
                Horizontal &nbsp; |x₂ − x₁| = <b>{metrics.dx}</b>
              </p>
              <p>
                Vertical &nbsp; |y₂ − y₁| = <b>{metrics.dy}</b>
              </p>
            </section>
            <section className="distance">
              <h3>Distance</h3>
              <p>d = √[(x₂−x₁)² + (y₂−y₁)²]</p>
              <p>
                = √({metrics.dx}² + {metrics.dy}²) = √{metrics.square}
              </p>
              <strong>d = {metrics.distance.toFixed(2)} units</strong>
            </section>
            <div className="grid-controls">
              <label>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={() => act(() => setShowGrid((v) => !v))}
                />{" "}
                Show grid
              </label>
              <label>
                Grid:
                <select
                  aria-label="Grid size"
                  value={gridStep}
                  onChange={(e) => act(() => setGridStep(+e.target.value))}
                >
                  <option value="0.5">0.5 unit</option>
                  <option value="1">1 unit</option>
                  <option value="2">2 units</option>
                </select>
              </label>
            </div>
          </aside>
          <article className="df10083-graph">
            <button onClick={reset}>
              <RotateCcw /> Reset view
            </button>
            <svg
              ref={svgRef}
              viewBox="0 0 480 480"
              aria-label="Draggable distance formula coordinate plane"
              onPointerMove={(e) => {
                if (!active) return;
                const p = local(e);
                if (p) update(active, p);
              }}
              onPointerUp={() => active && act(() => setActive(null))}
              onPointerLeave={() => active && act(() => setActive(null))}
            >
              {showGrid &&
                Array.from({ length: 15 }, (_, i) => (
                  <g key={i}>
                    <line
                      className="grid"
                      x1={i * 34.2857}
                      y1="0"
                      x2={i * 34.2857}
                      y2="480"
                    />
                    <line
                      className="grid"
                      x1="0"
                      y1={i * 34.2857}
                      x2="480"
                      y2={i * 34.2857}
                    />
                  </g>
                ))}
              <line className="axis" x1="0" y1={sy(0)} x2="480" y2={sy(0)} />
              <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2="480" />
              <path
                className="triangle"
                d={`M${sx(points.a.x)} ${sy(points.a.y)}H${sx(points.b.x)}V${sy(points.b.y)}Z`}
              />
              <line
                className="distance-line"
                x1={sx(points.a.x)}
                y1={sy(points.a.y)}
                x2={sx(points.b.x)}
                y2={sy(points.b.y)}
              />
              {(["a", "b"] as PointKey[]).map((key) => (
                <circle
                  key={key}
                  className={key}
                  tabIndex={0}
                  aria-label={`Draggable point ${key.toUpperCase()}`}
                  cx={sx(points[key].x)}
                  cy={sy(points[key].y)}
                  r="8"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setActive(key);
                  }}
                  onKeyDown={(e) => {
                    const d = e.shiftKey ? gridStep * 2 : gridStep;
                    if (e.key === "ArrowLeft") moveKey(key, -d, 0);
                    if (e.key === "ArrowRight") moveKey(key, d, 0);
                    if (e.key === "ArrowUp") moveKey(key, 0, d);
                    if (e.key === "ArrowDown") moveKey(key, 0, -d);
                  }}
                />
              ))}
              <text x={sx(points.a.x) - 45} y={sy(points.a.y) + 5}>
                A ({points.a.x}, {points.a.y})
              </text>
              <text x={sx(points.b.x) + 12} y={sy(points.b.y)}>
                B ({points.b.x}, {points.b.y})
              </text>
              <text
                className="dx"
                x={(sx(points.a.x) + sx(points.b.x)) / 2 - 20}
                y={sy(points.a.y) + 22}
              >
                {metrics.dx} units
              </text>
              <text
                className="dy"
                x={sx(points.b.x) + 12}
                y={(sy(points.a.y) + sy(points.b.y)) / 2}
              >
                {metrics.dy} units
              </text>
              <text
                className="dlabel"
                x={(sx(points.a.x) + sx(points.b.x)) / 2}
                y={(sy(points.a.y) + sy(points.b.y)) / 2 - 12}
              >
                {metrics.distance} units
              </text>
            </svg>
            <div className="legend">
              <span>━ Horizontal difference (|x₂−x₁|)</span>
              <span>━ Vertical difference (|y₂−y₁|)</span>
              <span>━ Distance (d)</span>
            </div>
            <button
              className="expand"
              aria-label="Toggle fullscreen graph"
              onClick={() => act(() => setExpanded((v) => !v))}
            >
              <Expand />
            </button>
          </article>
        </section>
        <section className="df10083-lower">
          <article>
            <h2>Why this works</h2>
            <p>
              The horizontal and vertical differences form the legs of a right
              triangle. By the Pythagorean Theorem, the distance between A and B
              is the hypotenuse.
            </p>
            <div className="mini-triangle">
              <i />
              <span>d² = |x₂−x₁|² + |y₂−y₁|²</span>
            </div>
          </article>
          <article>
            <h2>Worked example</h2>
            <p>
              Find the distance between A({points.a.x}, {points.a.y}) and B(
              {points.b.x}, {points.b.y}).
            </p>
            <p>
              x₂ − x₁ = {points.b.x} − {points.a.x} ={" "}
              {rr(points.b.x - points.a.x)}
            </p>
            <p>
              y₂ − y₁ = {points.b.y} − {points.a.y} ={" "}
              {rr(points.b.y - points.a.y)}
            </p>
            <p>
              d = √({metrics.dx}² + {metrics.dy}²) = √{metrics.square}
            </p>
            <strong>Distance = {metrics.distance.toFixed(2)} units</strong>
          </article>
        </section>
      </main>
      <nav className="df10083-nav">
        <Link to="/lessons/school/class-9/class-9-mensuration-combined-solids">
          <ArrowLeft /> Previous lesson
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-section-formula">
          Next lesson <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function fixed(point: Point) {
  return {
    x: Math.max(-6, Math.min(6, point.x)),
    y: Math.max(-6, Math.min(6, point.y)),
  };
}
function snapPoint(point: Point, step: number) {
  return {
    x: rr(Math.round(point.x / step) * step),
    y: rr(Math.round(point.y / step) * step),
  };
}
