import {
  Eraser,
  Expand,
  LocateFixed,
  Maximize2,
  MousePointer2,
  RotateCcw,
  ScanSearch,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  EQUATION_41_DEFINITIONS,
  clampEquationPoint,
  equationCurvePath,
  equationGraphPosition,
  equationIntersections,
  equationPointAnalysis,
  equationPointFromPixels,
  type EquationId,
} from "./equationGrapherLesson41Model";
import "./EquationGrapherTargetLesson41.css";

type Tool = "point" | "trace" | "intersections";

export default function EquationGrapherTargetLesson41({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPointState] = useState({ x: 2, y: 1 });
  const [visible, setVisible] = useState<Record<EquationId, boolean>>({
    ellipse: true,
    line: true,
    circle: true,
  });
  const [display, setDisplay] = useState({
    axes: true,
    grid: true,
    labels: true,
    test: true,
    snap: false,
  });
  const [tool, setTool] = useState<Tool>("point");
  const [traceAngle, setTraceAngle] = useState(0);
  const [actions, setActions] = useState(0);
  const analysis = useMemo(
    () => equationPointAnalysis(point.x, point.y),
    [point],
  );
  const graphPoint = equationGraphPosition(point.x, point.y);
  const intersections = equationIntersections();
  const reset = () => {
    setPointState({ x: 2, y: 1 });
    setVisible({ ellipse: true, line: true, circle: true });
    setDisplay({
      axes: true,
      grid: true,
      labels: true,
      test: true,
      snap: false,
    });
    setTool("point");
    setTraceAngle(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const setPoint = (x: number, y: number) =>
    act(() =>
      setPointState({
        x: clampEquationPoint(x, display.snap),
        y: clampEquationPoint(y, display.snap),
      }),
    );
  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const next = equationPointFromPixels(
      ((event.clientX - rect.left) / rect.width) * 720,
      ((event.clientY - rect.top) / rect.height) * 600,
      display.snap,
    );
    setPoint(next.x, next.y);
  };
  const keyPoint = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-0.5, 0],
      ArrowRight: [0.5, 0],
      ArrowUp: [0, 0.5],
      ArrowDown: [0, -0.5],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setPoint(point.x + move[0], point.y + move[1]);
  };
  const traceRadians = (traceAngle * Math.PI) / 180;
  const tracePoint = equationGraphPosition(
    3 * Math.cos(traceRadians),
    2 * Math.sin(traceRadians),
  );

  return (
    <section
      className="eg41-page"
      data-testid="2d-graphing-mockup-0133"
      data-dedicated-lesson="41"
      data-object-model="three-explicit-solution-set-equations-exact-residual-tests-pointer-keyboard-draggable-point-visibility-display-options-trace-and-analytic-intersections"
      data-point={`${point.x},${point.y}`}
      data-tool={tool}
      data-actions={actions}
    >
      <nav className="eg41-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>41 Equation Grapher</b>
      </nav>
      <header className="eg41-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </small>
        <h1>Equation Grapher</h1>
        <p>Visualise explicit and implicit equations.</p>
        <nav>
          <b>Solution set</b>
          <span>⚡ Graph Explorer</span>
          <span>▣ Graphing Calculator</span>
          <span>◷ 6-10 min</span>
        </nav>
      </header>
      <section className="eg41-workspace">
        <main className="eg41-graph-card">
          <header>
            <b>GRAPH</b>
            <nav>
              {EQUATION_41_DEFINITIONS.map((equation) => (
                <span key={equation.id}>
                  <i style={{ background: equation.color }} />
                  {equation.label}
                </span>
              ))}
            </nav>
            <aside>
              <button
                aria-label="Reset equation graph"
                onClick={() => act(reset)}
              >
                <RotateCcw />
              </button>
              <button
                aria-label="Fit equation graph"
                onClick={() => act(() => setPointState({ x: 2, y: 1 }))}
              >
                <Maximize2 />
              </button>
              <button
                aria-label="Expand equation graph"
                onClick={() =>
                  act(() =>
                    document
                      .querySelector(".eg41-graph-card")
                      ?.requestFullscreen?.(),
                  )
                }
              >
                <Expand />
              </button>
            </aside>
          </header>
          <svg
            viewBox="0 0 720 600"
            role="img"
            aria-label="Ellipse line and circle solution sets"
          >
            <defs>
              <pattern
                id="eg41-grid"
                width="45"
                height="45"
                patternUnits="userSpaceOnUse"
              >
                <path d="M45 0H0V45" fill="none" stroke="#dfe8f3" />
              </pattern>
            </defs>
            <rect
              width="720"
              height="600"
              fill={display.grid ? "url(#eg41-grid)" : "#fff"}
            />
            {display.axes && (
              <>
                <line x1="20" x2="705" y1="300" y2="300" className="axis" />
                <line x1="360" x2="360" y1="585" y2="15" className="axis" />
              </>
            )}
            {visible.circle && (
              <polyline
                points={equationCurvePath("circle")}
                className="circle"
              />
            )}
            {visible.ellipse && (
              <polyline
                points={equationCurvePath("ellipse")}
                className="ellipse"
              />
            )}
            {visible.line && (
              <polyline points={equationCurvePath("line")} className="line" />
            )}
            {display.labels && (
              <g className="eg41-cardinals">
                {[
                  [-3, 0],
                  [3, 0],
                  [0, 2],
                  [0, -2],
                ].map(([x, y]) => {
                  const p = equationGraphPosition(x, y);
                  return (
                    <g key={`${x}-${y}`}>
                      <circle cx={p.x} cy={p.y} r="5" />
                      <text x={p.x + 10} y={p.y + (y < 0 ? 20 : -10)}>
                        ({x}, {y})
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
            {tool === "intersections" &&
              intersections.map((item, index) => {
                const p = equationGraphPosition(item.x, item.y);
                return (
                  <g className="eg41-found" key={`${item.pair}-${index}`}>
                    <circle cx={p.x} cy={p.y} r="7" />
                    <title>
                      {item.pair}: ({item.x.toFixed(2)}, {item.y.toFixed(2)})
                    </title>
                  </g>
                );
              })}
            {tool === "trace" && (
              <>
                <circle
                  className="eg41-trace-point"
                  cx={tracePoint.x}
                  cy={tracePoint.y}
                  r="8"
                />
                <text x={tracePoint.x + 12} y={tracePoint.y - 12}>
                  trace {traceAngle}°
                </text>
              </>
            )}
            {display.test && (
              <g>
                <line
                  x1={graphPoint.x}
                  x2={graphPoint.x}
                  y1="300"
                  y2={graphPoint.y}
                  className="test-guide"
                />
                <circle
                  aria-label="Drag equation test point"
                  tabIndex={0}
                  cx={graphPoint.x}
                  cy={graphPoint.y}
                  r="9"
                  className="test-point"
                  onPointerDown={(event) =>
                    event.currentTarget.setPointerCapture(event.pointerId)
                  }
                  onPointerMove={dragPoint}
                  onKeyDown={keyPoint}
                />
                <g
                  className="test-label"
                  transform={`translate(${graphPoint.x + 12} ${graphPoint.y - 26})`}
                >
                  <rect width="62" height="34" rx="6" />
                  <text x="31" y="22" textAnchor="middle">
                    ({point.x}, {point.y})
                  </text>
                </g>
              </g>
            )}
          </svg>
          <section className="eg41-options">
            {(
              [
                ["axes", "Show axes"],
                ["grid", "Show grid"],
                ["labels", "Show labels"],
                ["test", "Show test points"],
                ["snap", "Snap to points"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={display[key]}
                  onChange={(event) =>
                    act(() =>
                      setDisplay((value) => ({
                        ...value,
                        [key]: event.target.checked,
                      })),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </section>
          <p className="eg41-note">
            ⓘ You are viewing solution sets. Every point on a curve makes its
            equation true.
          </p>
        </main>
        <aside className="eg41-controls">
          <h2>EQUATIONS</h2>
          {EQUATION_41_DEFINITIONS.map((equation) => (
            <label key={equation.id}>
              <i style={{ background: equation.color }} />
              <span>
                <b>{equation.label}</b>
                <small>{equation.description}</small>
              </span>
              <input
                aria-label={`Show ${equation.id}`}
                type="checkbox"
                checked={visible[equation.id]}
                onChange={(event) =>
                  act(() =>
                    setVisible((value) => ({
                      ...value,
                      [equation.id]: event.target.checked,
                    })),
                  )
                }
              />
            </label>
          ))}
          <section className="eg41-point">
            <h2>
              TEST POINT ({point.x}, {point.y})
            </h2>
            <label>
              Point{" "}
              <span>
                x ={" "}
                <input
                  aria-label="Test point x"
                  type="number"
                  value={point.x}
                  step="0.5"
                  min="-6"
                  max="6"
                  onChange={(event) =>
                    setPoint(Number(event.target.value), point.y)
                  }
                />
              </span>
              <span>
                y ={" "}
                <input
                  aria-label="Test point y"
                  type="number"
                  value={point.y}
                  step="0.5"
                  min="-6"
                  max="6"
                  onChange={(event) =>
                    setPoint(point.x, Number(event.target.value))
                  }
                />
              </span>
            </label>
          </section>
          {analysis.map((result) => (
            <article key={result.id}>
              <header>
                <i style={{ background: result.color }} />
                <b>{result.label}</b>
                <strong className={result.satisfies ? "yes" : "no"}>
                  {result.satisfies ? "satisfies" : "does not satisfy"}
                </strong>
              </header>
              <small>
                Substitute ({point.x}, {point.y}):
              </small>
              <p>
                {result.leftValue.toFixed(3)} = {result.rightValue.toFixed(3)} ?{" "}
                <b>{result.satisfies ? "✓ Yes" : "✕ No"}</b>
              </p>
            </article>
          ))}
          <p className="eg41-truth">
            ⓘ Every point on the curve makes the equation true
          </p>
        </aside>
      </section>
      <section className="eg41-tools">
        <b>INTERACTION TOOLS</b>
        <button
          className={tool === "point" ? "active" : ""}
          onClick={() =>
            act(() => {
              setTool("point");
              setDisplay((value) => ({ ...value, test: true }));
            })
          }
        >
          <MousePointer2 />
          Point tester
        </button>
        <button
          className={tool === "trace" ? "active" : ""}
          onClick={() => act(() => setTool("trace"))}
        >
          <LocateFixed />
          Trace curve
        </button>
        <button
          className={tool === "intersections" ? "active" : ""}
          onClick={() => act(() => setTool("intersections"))}
        >
          <ScanSearch />
          Intersection finder
        </button>
        <button
          onClick={() =>
            act(() => setDisplay((value) => ({ ...value, test: false })))
          }
        >
          <Eraser />
          Clear points
        </button>
        {tool === "trace" && (
          <input
            aria-label="Trace ellipse angle"
            type="range"
            min="0"
            max="360"
            value={traceAngle}
            onChange={(event) =>
              act(() => setTraceAngle(Number(event.target.value)))
            }
          />
        )}
      </section>
      <nav className="eg41-adjacent">
        <a href="/lessons/graphs-and-functions/40-function-plotter">
          ←{" "}
          <span>
            PREVIOUS<b>Function Plotter</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/42-inequality-grapher">
          <span>
            NEXT<b>Inequality Grapher</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
