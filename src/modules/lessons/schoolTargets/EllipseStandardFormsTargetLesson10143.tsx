import { CheckCircle2, Grid3X3, Info, RotateCcw, Shuffle } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EllipseStandardFormsTargetLesson10143.css";

type Orientation = "horizontal" | "vertical";
type Point = { x: number; y: number };

export default function EllipseStandardFormsTargetLesson10143({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);
  const [theta, setTheta] = useState(0.695);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [actions, setActions] = useState(0);
  const dragging = useRef(false);
  const c = Math.sqrt(a * a - b * b);
  const point: Point =
    orientation === "horizontal"
      ? { x: a * Math.cos(theta), y: b * Math.sin(theta) }
      : { x: b * Math.cos(theta), y: a * Math.sin(theta) };
  const f1: Point =
    orientation === "horizontal" ? { x: -c, y: 0 } : { x: 0, y: -c };
  const f2: Point =
    orientation === "horizontal" ? { x: c, y: 0 } : { x: 0, y: c };
  const pf1 = Math.hypot(point.x - f1.x, point.y - f1.y);
  const pf2 = Math.hypot(point.x - f2.x, point.y - f2.y);
  const graph = useMemo(() => {
    const W = 820,
      H = 450,
      scale = 48;
    const sx = (x: number) => W / 2 + x * scale;
    const sy = (y: number) => H / 2 - y * scale;
    const rx = (orientation === "horizontal" ? a : b) * scale;
    const ry = (orientation === "horizontal" ? b : a) * scale;
    return { W, H, scale, sx, sy, rx, ry };
  }, [a, b, orientation]);

  const setMajor = (value: number) => {
    const next = Math.max(b + 0.1, value);
    setA(next);
    setActions((v) => v + 1);
  };
  const setMinor = (value: number) => {
    setB(Math.min(a - 0.1, value));
    setActions((v) => v + 1);
  };
  const angleFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) * graph.W) / box.width - graph.W / 2;
    const y = graph.H / 2 - ((event.clientY - box.top) * graph.H) / box.height;
    const next =
      orientation === "horizontal"
        ? Math.atan2(y / (b * graph.scale), x / (a * graph.scale))
        : Math.atan2(y / (a * graph.scale), x / (b * graph.scale));
    setTheta(next);
    setActions((v) => v + 1);
  };
  const reset = () => {
    setOrientation("horizontal");
    setA(5);
    setB(3);
    setTheta(0.695);
    setShowGrid(true);
    setShowDimensions(true);
    setActions((v) => v + 1);
  };
  const majorHorizontal = orientation === "horizontal";
  const vertices = majorHorizontal
    ? `(-${a.toFixed(2)}, 0), (${a.toFixed(2)}, 0)`
    : `(0, -${a.toFixed(2)}), (0, ${a.toFixed(2)})`;
  const coVertices = majorHorizontal
    ? `(0, -${b.toFixed(2)}), (0, ${b.toFixed(2)})`
    : `(-${b.toFixed(2)}, 0), (${b.toFixed(2)}, 0)`;
  const foci = majorHorizontal
    ? `(-${c.toFixed(2)}, 0), (${c.toFixed(2)}, 0)`
    : `(0, -${c.toFixed(2)}), (0, ${c.toFixed(2)})`;

  return (
    <section
      className="el10143-page"
      data-testid="school-mockup-0817"
      data-object-model="dedicated-ellipse-two-focus-invariant-engine"
      data-orientation={orientation}
      data-a={a.toFixed(2)}
      data-b={b.toFixed(2)}
      data-c={c.toFixed(4)}
      data-point={`${point.x.toFixed(2)},${point.y.toFixed(2)}`}
      data-distance-sum={(pf1 + pf2).toFixed(4)}
      data-eccentricity={(c / a).toFixed(4)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Ellipse Standard Forms</h1>
        <p>
          Ellipse Standard Forms is a school mathematics idea in Conic Sections.
          It helps students model data, functions, curves, proofs, and 3D
          directions. We use related ideas in graphs, design, surveys,
          navigation, and measurement.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main>
        <aside className="el-controls">
          <h2>INTERACTIVE LAB</h2>
          <h3>Ellipse Explorer</h3>
          <p>
            Explore the ellipse and drag point P. The sum of distances to the
            two foci is always 2a.
          </p>
          <div
            className="orientation"
            role="group"
            aria-label="Ellipse orientation"
          >
            <button
              className={majorHorizontal ? "active" : ""}
              onClick={() => {
                setOrientation("horizontal");
                setActions((v) => v + 1);
              }}
            >
              <b>Horizontal</b>
              <span>Major axis along x</span>
              <em>x²/a² + y²/b² = 1</em>
            </button>
            <button
              className={!majorHorizontal ? "active" : ""}
              onClick={() => {
                setOrientation("vertical");
                setActions((v) => v + 1);
              }}
            >
              <b>Vertical</b>
              <span>Major axis along y</span>
              <em>x²/b² + y²/a² = 1</em>
            </button>
          </div>
          <label>
            <b>
              a <span>(semi-major axis)</span>
            </b>
            <input
              aria-label="Semi-major axis a"
              type="range"
              min="2"
              max="7"
              step="0.1"
              value={a}
              onInput={(event) => setMajor(Number(event.currentTarget.value))}
              onChange={(e) => setMajor(Number(e.target.value))}
            />
            <output>{a.toFixed(2)}</output>
          </label>
          <label>
            <b>
              b <span>(semi-minor axis)</span>
            </b>
            <input
              aria-label="Semi-minor axis b"
              type="range"
              min="1"
              max="6.9"
              step="0.1"
              value={b}
              onInput={(event) => setMinor(Number(event.currentTarget.value))}
              onChange={(e) => setMinor(Number(e.target.value))}
            />
            <output>{b.toFixed(2)}</output>
          </label>
          <p className="constraint">
            <CheckCircle2 /> Constraint: a &gt; b &gt; 0 satisfied.{" "}
            <span>0.10 &lt; b &lt; a</span>
          </p>
          <dl>
            <div>
              <dt className="violet">c = √(a² − b²)</dt>
              <dd>{c.toFixed(4)}</dd>
            </div>
            <div>
              <dt className="red">Vertices</dt>
              <dd>{vertices}</dd>
            </div>
            <div>
              <dt className="blue">Co-vertices</dt>
              <dd>{coVertices}</dd>
            </div>
            <div>
              <dt className="green">Foci</dt>
              <dd>{foci}</dd>
            </div>
            <div>
              <dt className="orange">Major axis length</dt>
              <dd>{(2 * a).toFixed(3)}</dd>
            </div>
            <div>
              <dt className="cyan">Minor axis length</dt>
              <dd>{(2 * b).toFixed(3)}</dd>
            </div>
            <div>
              <dt className="yellow">Eccentricity</dt>
              <dd>{(c / a).toFixed(4)}</dd>
            </div>
          </dl>
        </aside>
        <section className="el-board">
          <div className="checks">
            <label>
              <input
                type="checkbox"
                checked={showDimensions}
                onChange={() => setShowDimensions((v) => !v)}
              />{" "}
              Show dimensions
            </label>
            <label>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={() => setShowGrid((v) => !v)}
              />{" "}
              <Grid3X3 /> Grid
            </label>
          </div>
          <svg
            viewBox={`0 0 ${graph.W} ${graph.H}`}
            aria-label="Interactive ellipse graph"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              angleFromPointer(e);
            }}
            onPointerMove={(e) => {
              if (dragging.current && e.buttons === 1) angleFromPointer(e);
            }}
            onPointerUp={(e) => {
              dragging.current = false;
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
          >
            {showGrid &&
              Array.from({ length: 17 }, (_, i) => i - 8).map((n) => (
                <g key={n}>
                  <line
                    className="grid"
                    x1={graph.sx(n)}
                    x2={graph.sx(n)}
                    y1="0"
                    y2={graph.H}
                  />
                  <line
                    className="grid"
                    x1="0"
                    x2={graph.W}
                    y1={graph.sy(n)}
                    y2={graph.sy(n)}
                  />
                </g>
              ))}
            <line
              className="axis"
              x1="0"
              x2={graph.W}
              y1={graph.sy(0)}
              y2={graph.sy(0)}
            />
            <line
              className="axis"
              x1={graph.sx(0)}
              x2={graph.sx(0)}
              y1="0"
              y2={graph.H}
            />
            <ellipse
              className="ellipse"
              cx={graph.sx(0)}
              cy={graph.sy(0)}
              rx={graph.rx}
              ry={graph.ry}
            />
            <line
              className="distance"
              x1={graph.sx(f1.x)}
              y1={graph.sy(f1.y)}
              x2={graph.sx(point.x)}
              y2={graph.sy(point.y)}
            />
            <line
              className="distance"
              x1={graph.sx(f2.x)}
              y1={graph.sy(f2.y)}
              x2={graph.sx(point.x)}
              y2={graph.sy(point.y)}
            />
            {showDimensions && (
              <g className="dimensions">
                <line
                  x1={majorHorizontal ? graph.sx(-a) : graph.sx(0)}
                  y1={majorHorizontal ? graph.sy(-b - 0.9) : graph.sy(-a)}
                  x2={majorHorizontal ? graph.sx(a) : graph.sx(0)}
                  y2={majorHorizontal ? graph.sy(-b - 0.9) : graph.sy(a)}
                />
                <text
                  x={majorHorizontal ? graph.sx(0) : graph.sx(0) + 8}
                  y={majorHorizontal ? graph.sy(-b - 1.05) : graph.sy(0)}
                >
                  2a = {(2 * a).toFixed(3)}
                </text>
                <line
                  className="minor-dimension"
                  x1={majorHorizontal ? graph.sx(-b) : graph.sx(-b - 0.75)}
                  y1={majorHorizontal ? graph.sy(-b - 0.35) : graph.sy(-b)}
                  x2={majorHorizontal ? graph.sx(b) : graph.sx(-b - 0.75)}
                  y2={majorHorizontal ? graph.sy(-b - 0.35) : graph.sy(b)}
                />
                <text
                  className="minor-dimension"
                  x={majorHorizontal ? graph.sx(0) : graph.sx(-b - 0.9)}
                  y={majorHorizontal ? graph.sy(-b - 0.5) : graph.sy(0)}
                >
                  2b = {(2 * b).toFixed(3)}
                </text>
              </g>
            )}
            <g className="focus">
              <circle cx={graph.sx(f1.x)} cy={graph.sy(f1.y)} r="6" />
              <circle cx={graph.sx(f2.x)} cy={graph.sy(f2.y)} r="6" />
              <text x={graph.sx(f1.x) - 18} y={graph.sy(f1.y) - 14}>
                F₁
              </text>
              <text x={graph.sx(f2.x) + 8} y={graph.sy(f2.y) - 14}>
                F₂
              </text>
            </g>
            <g className="vertices">
              <circle
                cx={graph.sx(majorHorizontal ? -a : 0)}
                cy={graph.sy(majorHorizontal ? 0 : -a)}
                r="6"
              />
              <circle
                cx={graph.sx(majorHorizontal ? a : 0)}
                cy={graph.sy(majorHorizontal ? 0 : a)}
                r="6"
              />
            </g>
            <g className="point">
              <circle cx={graph.sx(point.x)} cy={graph.sy(point.y)} r="9" />
              <text x={graph.sx(point.x) + 10} y={graph.sy(point.y) - 12}>
                P ({point.x.toFixed(2)}, {point.y.toFixed(2)})
              </text>
            </g>
            <g className="distance-label">
              <text
                x={(graph.sx(f1.x) + graph.sx(point.x)) / 2 - 24}
                y={(graph.sy(f1.y) + graph.sy(point.y)) / 2 - 8}
              >
                PF₁ = {pf1.toFixed(4)}
              </text>
              <text
                x={(graph.sx(f2.x) + graph.sx(point.x)) / 2 + 5}
                y={(graph.sy(f2.y) + graph.sy(point.y)) / 2 - 8}
              >
                PF₂ = {pf2.toFixed(4)}
              </text>
            </g>
            <g className="sum">
              <rect
                x={graph.W / 2 - 110}
                y={graph.H / 2 + 35}
                width="220"
                height="34"
                rx="8"
              />
              <text x={graph.W / 2} y={graph.H / 2 + 57}>
                PF₁ + PF₂ = {(pf1 + pf2).toFixed(4)} = 2a
              </text>
            </g>
          </svg>
          <footer>
            <Info />
            <p>
              Drag point P along the ellipse.
              <br />
              Observe how PF₁ + PF₂ remains constant and equal to 2a.
            </p>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button
              onClick={() => {
                setTheta(Math.random() * Math.PI * 2);
                setActions((v) => v + 1);
              }}
            >
              <Shuffle /> Random point P
            </button>
          </footer>
        </section>
      </main>
    </section>
  );
}
