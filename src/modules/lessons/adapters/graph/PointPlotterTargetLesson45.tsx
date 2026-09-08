import { GripVertical, PlusCircle, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  DragEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_PLOT_POINTS,
  POINT_PLOTTER_COLORS,
  clampPlotCoordinate,
  connectedPointPath,
  pointFromPlotPixels,
  pointPlotPosition,
  reorderPlotPoints,
  type PlotPoint,
} from "./pointPlotterLesson45Model";
import "./PointPlotterTargetLesson45.css";

export default function PointPlotterTargetLesson45({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<PlotPoint[]>(() =>
    DEFAULT_PLOT_POINTS.map((point) => ({ ...point })),
  );
  const [selected, setSelected] = useState("C"),
    [connect, setConnect] = useState(false),
    [snap, setSnap] = useState(true),
    [language, setLanguage] = useState("en"),
    [dragged, setDragged] = useState<string | null>(null),
    [actions, setActions] = useState(0);
  const current = points.find((point) => point.id === selected) ?? points[0];
  const position = pointPlotPosition(current);
  const reset = () => {
    setPoints(DEFAULT_PLOT_POINTS.map((point) => ({ ...point })));
    setSelected("C");
    setConnect(false);
    setSnap(true);
    setLanguage("en");
    setDragged(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updatePoint = (id: string, update: Partial<PlotPoint>) =>
    act(() =>
      setPoints((items) =>
        items.map((item) => (item.id === id ? { ...item, ...update } : item)),
      ),
    );
  const movePoint = (id: string, x: number, y: number) =>
    updatePoint(id, {
      x: clampPlotCoordinate(x, snap),
      y: clampPlotCoordinate(y, snap),
    });
  const dragPoint = (
    id: string,
    event: ReactPointerEvent<SVGCircleElement>,
  ) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const next = pointFromPlotPixels(
      ((event.clientX - rect.left) / rect.width) * 660,
      ((event.clientY - rect.top) / rect.height) * 620,
      snap,
    );
    movePoint(id, next.x, next.y);
  };
  const keyPoint = (
    id: string,
    event: ReactKeyboardEvent<SVGCircleElement>,
  ) => {
    const point = points.find((item) => item.id === id);
    if (!point) return;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-0.5, 0],
      ArrowRight: [0.5, 0],
      ArrowUp: [0, 0.5],
      ArrowDown: [0, -0.5],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    movePoint(id, point.x + move[0], point.y + move[1]);
  };
  const dropRow = (targetId: string, event: DragEvent) => {
    event.preventDefault();
    if (!dragged) return;
    act(() =>
      setPoints((items) => reorderPlotPoints(items, dragged, targetId)),
    );
    setDragged(null);
  };
  const addPoint = () =>
    act(() =>
      setPoints((items) => {
        const id = String.fromCharCode(65 + items.length);
        const next = {
          id,
          x: 0,
          y: 0,
          color:
            POINT_PLOTTER_COLORS[items.length % POINT_PLOTTER_COLORS.length],
        };
        setSelected(id);
        return [...items, next];
      }),
    );

  return (
    <section
      className="pp45-page"
      data-testid="2d-graphing-mockup-0137"
      data-dedicated-lesson="45"
      data-object-model="editable-reorderable-colored-point-collection-pointer-keyboard-draggable-points-grid-snapping-optional-connection-add-point-selection-coordinate-guides-language-reset-share-and-navigation"
      data-selected={selected}
      data-connect={connect}
      data-snap={snap}
      data-count={points.length}
      data-language={language}
      data-actions={actions}
    >
      <nav className="pp45-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>45 Point Plotter</b>
      </nav>
      <header className="pp45-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </small>
        <h1>Point Plotter</h1>
        <p>Build coordinate fluency.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
        <section>
          <select
            aria-label="Point plotter language"
            value={language}
            onChange={(event) => act(() => setLanguage(event.target.value))}
          >
            <option value="en">English (English)</option>
            <option value="hi">Hindi</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  points
                    .map((point) => `${point.id}(${point.x}, ${point.y})`)
                    .join(", "),
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
        </section>
      </header>
      <section className="pp45-workspace">
        <main className="pp45-graph">
          <header>
            <label>
              Connect the points (optional)
              <input
                type="checkbox"
                checked={connect}
                onChange={(event) =>
                  act(() => setConnect(event.target.checked))
                }
              />
            </label>
            <small>Plot exact ordered pairs before connecting anything</small>
            <label>
              <input
                type="checkbox"
                checked={snap}
                onChange={(event) => act(() => setSnap(event.target.checked))}
              />
              Snap to grid
            </label>
          </header>
          <svg
            viewBox="0 0 660 620"
            role="img"
            aria-label="Editable ordered points on Cartesian axes"
          >
            <defs>
              <pattern
                id="pp45-grid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path d="M28 0H0V28" fill="none" stroke="#dfe8f2" />
              </pattern>
            </defs>
            <rect
              x="22"
              y="22"
              width="616"
              height="576"
              rx="10"
              fill="url(#pp45-grid)"
              stroke="#d6e2ed"
            />
            <line x1="30" x2="635" y1="310" y2="310" className="axis" />
            <line x1="330" x2="330" y1="590" y2="26" className="axis" />
            {connect && (
              <polyline
                points={connectedPointPath(points)}
                className="connection"
              />
            )}
            <line
              x1="330"
              y1={position.y}
              x2={position.x}
              y2={position.y}
              className="guide"
            />
            <line
              x1={position.x}
              y1="310"
              x2={position.x}
              y2={position.y}
              className="guide"
            />
            <text
              x={(330 + position.x) / 2}
              y={position.y - 12}
              className="guide-label"
            >
              x first
            </text>
            <text
              x={position.x + 12}
              y={(310 + position.y) / 2}
              className="guide-label"
            >
              y second
            </text>
            {points.map((point) => {
              const p = pointPlotPosition(point);
              return (
                <g key={point.id}>
                  <circle
                    aria-label={`Drag point ${point.id}`}
                    tabIndex={0}
                    cx={p.x}
                    cy={p.y}
                    r={point.id === selected ? 10 : 8}
                    fill={point.color}
                    stroke="#fff"
                    strokeWidth="3"
                    onClick={() => act(() => setSelected(point.id))}
                    onPointerDown={(event) => {
                      setSelected(point.id);
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => dragPoint(point.id, event)}
                    onKeyDown={(event) => keyPoint(point.id, event)}
                  />
                  <text
                    x={p.x}
                    y={p.y - 15}
                    textAnchor="middle"
                    fill={point.color}
                    className="point-name"
                  >
                    {point.id}
                  </text>
                </g>
              );
            })}
          </svg>
          <section className="pp45-steps">
            <article>
              <b>1</b>
              <span>
                <h2>x coordinate — horizontal (x first)</h2>☑ Move horizontally
                to the x-value.
                <br />☑ Example ({current.id}): x = {current.x}
              </span>
            </article>
            <article>
              <b>2</b>
              <span>
                <h2>y coordinate — vertical (y second)</h2>☑ Then move
                vertically to the y-value.
                <br />☑ Example ({current.id}): y = {current.y}
              </span>
            </article>
          </section>
        </main>
        <aside className="pp45-controls">
          <h2>
            💡 Points <small>(editable ordered pairs)</small>
          </h2>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>x</th>
                <th>y</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr
                  key={point.id}
                  draggable
                  onDragStart={() => setDragged(point.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropRow(point.id, event)}
                  className={selected === point.id ? "active" : ""}
                >
                  <td onClick={() => act(() => setSelected(point.id))}>
                    <GripVertical />{" "}
                    <b style={{ color: point.color }}>{point.id}</b>
                  </td>
                  <td>
                    <input
                      aria-label={`${point.id} x`}
                      type="number"
                      min="-5"
                      max="5"
                      step={snap ? 1 : 0.5}
                      value={point.x}
                      onChange={(event) =>
                        movePoint(point.id, Number(event.target.value), point.y)
                      }
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`${point.id} y`}
                      type="number"
                      min="-5"
                      max="5"
                      step={snap ? 1 : 0.5}
                      value={point.y}
                      onChange={(event) =>
                        movePoint(point.id, point.x, Number(event.target.value))
                      }
                    />
                  </td>
                  <td>
                    <i style={{ background: point.color }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="pp45-add" onClick={addPoint}>
            <PlusCircle />
            Add point
          </button>
          <section>
            <h3>Choose point colors</h3>
            <div>
              {POINT_PLOTTER_COLORS.map((color) => (
                <button
                  key={color}
                  aria-label={`Set ${selected} color ${color}`}
                  className={current.color === color ? "active" : ""}
                  style={{ background: color }}
                  onClick={() => updatePoint(selected, { color })}
                />
              ))}
            </div>
          </section>
          <p>
            ⓘ <b>Plot exact ordered pairs before connecting anything</b>
            <br />A point is evidence, not a trend line.
          </p>
        </aside>
      </section>
      <nav className="pp45-adjacent">
        <a href="/lessons/graphs-and-functions/44-polar-graphs">
          ←{" "}
          <span>
            PREVIOUS<b>Polar Graphs</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/46-data-plotter">
          <span>
            NEXT<b>Data Plotter</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
