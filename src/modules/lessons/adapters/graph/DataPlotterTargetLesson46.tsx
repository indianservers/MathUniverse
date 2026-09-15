import {
  BarChart3,
  LineChart,
  Plus,
  RotateCcw,
  ScatterChart,
  Share2,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_DATA_PLOTTER_POINTS,
  dataPlotPosition,
  dataPlotterAnalysis,
  dataPointFromPixels,
  type DataPlotterPoint,
  type RegressionKind,
} from "./dataPlotterLesson46Model";
import "./DataPlotterTargetLesson46.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

type ChartKind = "scatter" | "line" | "bar";

export default function DataPlotterTargetLesson46({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<DataPlotterPoint[]>(() =>
    DEFAULT_DATA_PLOTTER_POINTS.map((point) => ({ ...point })),
  );
  const [chart, setChart] = useState<ChartKind>("scatter"),
    [regression, setRegression] = useState<RegressionKind>("linear"),
    [outlierCheck, setOutlierCheck] = useState(true),
    [actions, setActions] = useState(0);
  const analysis = useMemo(
    () => dataPlotterAnalysis(points, regression, outlierCheck),
    [points, regression, outlierCheck],
  );
  const reset = () => {
    setPoints(DEFAULT_DATA_PLOTTER_POINTS.map((point) => ({ ...point })));
    setChart("scatter");
    setRegression("linear");
    setOutlierCheck(true);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updatePoint = (id: number, update: Partial<DataPlotterPoint>) =>
    act(() =>
      setPoints((items) =>
        items.map((item) => (item.id === id ? { ...item, ...update } : item)),
      ),
    );
  const deletePoint = (id: number) =>
    act(() => setPoints((items) => items.filter((item) => item.id !== id)));
  const addPoint = () =>
    act(() =>
      setPoints((items) => [
        ...items,
        {
          id: Math.max(0, ...items.map((item) => item.id)) + 1,
          x: Math.min(10, items.length + 1),
          y: 50,
        },
      ]),
    );
  const movePoint = (id: number, x: number, y: number) =>
    updatePoint(id, {
      x: Math.max(0, Math.min(10, Math.round(x))),
      y: Math.max(0, Math.min(100, Math.round(y))),
    });
  const dragPoint = (
    id: number,
    event: ReactPointerEvent<SVGCircleElement>,
  ) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const next = dataPointFromPixels(
      ((event.clientX - rect.left) / rect.width) * 700,
      ((event.clientY - rect.top) / rect.height) * 550,
    );
    movePoint(id, next.x, next.y);
  };
  const keyPoint = (
    id: number,
    event: ReactKeyboardEvent<SVGCircleElement>,
  ) => {
    const point = points.find((item) => item.id === id);
    if (!point) return;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, 1],
      ArrowDown: [0, -1],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    movePoint(id, point.x + move[0], point.y + move[1]);
  };
  const fitPoints = Array.from({ length: 101 }, (_, index) => {
    const x = index / 10;
    return dataPlotPosition({ x, y: analysis.fit.predict(x) });
  })
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const ordered = [...points].sort((a, b) => a.x - b.x);
  const linePoints = ordered
    .map((point) => {
      const p = dataPlotPosition(point);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <section
      className="dp46-page"
      data-testid="2d-graphing-mockup-0138"
      data-dedicated-lesson="46"
      data-object-model="editable-addable-deletable-dataset-pointer-keyboard-draggable-observations-robust-outlier-detection-linear-and-quadratic-regression-correlation-residuals-and-real-scatter-line-bar-charts"
      data-chart={chart}
      data-regression={regression}
      data-outliers={[...analysis.outlierIds].join(",")}
      data-correlation={analysis.correlation.toFixed(4)}
      data-count={points.length}
      data-actions={actions}
    >
      <nav className="dp46-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>46 Data Plotter</b>
      </nav>
      <header className="dp46-hero">
        <small>INTERACTION + VISUALIZATION</small>
        <h1>Data Plotter</h1>
        <p>Connect datasets to graphs.</p>
        <nav>
          <a href="#dp46-workspace">↗ Workspace</a>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  points.map((point) => `${point.x},${point.y}`).join("\n"),
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <b>◷ 6-10 min</b>
        </nav>
      </header>
      <section className="dp46-workspace" id="dp46-workspace">
        <main>
          <section className="dp46-chart">
            <h2>Study hours vs Quiz score</h2>
            <nav>
              <span>
                ● Data points ({points.length - analysis.outlierIds.size})
              </span>
              <span>● Outlier ({analysis.outlierIds.size})</span>
              <span>
                ━━ Best-fit {regression === "quadratic" ? "curve" : "line"}
              </span>
            </nav>
            <svg
              viewBox="0 0 700 550"
              role="img"
              aria-label={`${chart} chart of study hours and quiz score`}
            >
              <defs>
                <pattern
                  id="dp46-grid"
                  width="58"
                  height="46"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M58 0H0V46" fill="none" stroke="#dce6ef" />
                </pattern>
              </defs>
              <rect
                x="58"
                y="50"
                width="580"
                height="460"
                fill="url(#dp46-grid)"
              />
              <line x1="58" x2="650" y1="510" y2="510" className="axis" />
              <line x1="58" x2="58" y1="510" y2="40" className="axis" />
              <text x="60" y="28">
                Quiz score
              </text>
              <text x="570" y="538">
                Study hours
              </text>
              {regression !== "none" && (
                <polyline points={fitPoints} className="fit" />
              )}
              {chart === "line" && (
                <polyline points={linePoints} className="data-line" />
              )}
              {chart === "bar" &&
                points.map((point) => {
                  const p = dataPlotPosition(point);
                  return (
                    <rect
                      key={`bar-${point.id}`}
                      x={p.x - 11}
                      y={p.y}
                      width="22"
                      height={510 - p.y}
                      fill={
                        analysis.outlierIds.has(point.id)
                          ? "#f58a08"
                          : "#079caf"
                      }
                      opacity=".65"
                    />
                  );
                })}
              {points.map((point) => {
                const p = dataPlotPosition(point),
                  outlier = analysis.outlierIds.has(point.id);
                return (
                  <g key={point.id}>
                    {regression !== "none" && (
                      <line
                        x1={p.x}
                        x2={p.x}
                        y1={p.y}
                        y2={
                          dataPlotPosition({
                            x: point.x,
                            y: analysis.fit.predict(point.x),
                          }).y
                        }
                        className="residual-line"
                      />
                    )}
                    <circle
                      aria-label={`Drag data row ${point.id}`}
                      tabIndex={0}
                      cx={p.x}
                      cy={p.y}
                      r="7"
                      fill={outlier ? "#f58a08" : "#079caf"}
                      stroke="#fff"
                      strokeWidth="2"
                      onPointerDown={(event) =>
                        event.currentTarget.setPointerCapture(event.pointerId)
                      }
                      onPointerMove={(event) => dragPoint(point.id, event)}
                      onKeyDown={(event) => keyPoint(point.id, event)}
                    />
                  </g>
                );
              })}
            </svg>
          </section>
          <section className="dp46-residuals">
            <h2>Residuals (y − ŷ)</h2>
            <svg
              viewBox="0 0 700 180"
              role="img"
              aria-label="Regression residual plot"
            >
              <line x1="58" x2="650" y1="90" y2="90" className="axis" />
              {analysis.residuals.map((item) => {
                const x = dataPlotPosition(item).x,
                  y = 90 - item.residual * 3;
                return (
                  <g key={item.id}>
                    <line
                      x1={x}
                      x2={x}
                      y1="90"
                      y2={y}
                      className="residual-line"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill={
                        analysis.outlierIds.has(item.id) ? "#f58a08" : "#079caf"
                      }
                    />
                  </g>
                );
              })}
            </svg>
          </section>
        </main>
        <aside className="dp46-controls">
          <header>
            <h2>Data</h2>
            <button aria-label="Reset data" onClick={() => act(reset)}>
              <RotateCcw />
            </button>
          </header>
          <div className="dp46-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Study hours (x)</th>
                  <th>Quiz score (y)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {points.map((point, index) => (
                  <tr
                    key={point.id}
                    className={
                      analysis.outlierIds.has(point.id) ? "outlier" : ""
                    }
                  >
                    <td>{index + 1}</td>
                    <td>
                      <input
                        aria-label={`Row ${point.id} study hours`}
                        type="number"
                        min="0"
                        max="10"
                        value={point.x}
                        onChange={(event) =>
                          movePoint(
                            point.id,
                            Number(event.target.value),
                            point.y,
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Row ${point.id} quiz score`}
                        type="number"
                        min="0"
                        max="100"
                        value={point.y}
                        onChange={(event) =>
                          movePoint(
                            point.id,
                            point.x,
                            Number(event.target.value),
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        aria-label={`Delete row ${point.id}`}
                        onClick={() => deletePoint(point.id)}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="dp46-add" onClick={addPoint}>
            <Plus />
            Add row
          </button>
          <h3>Chart type</h3>
          <section className="dp46-chart-types">
            <button
              className={chart === "scatter" ? "active" : ""}
              onClick={() => act(() => setChart("scatter"))}
            >
              <ScatterChart />
              Scatter
            </button>
            <button
              className={chart === "line" ? "active" : ""}
              onClick={() => act(() => setChart("line"))}
            >
              <LineChart />
              Line
            </button>
            <button
              className={chart === "bar" ? "active" : ""}
              onClick={() => act(() => setChart("bar"))}
            >
              <BarChart3 />
              Bar
            </button>
          </section>
          <label className="dp46-select">
            Regression model
            <select
              aria-label="Regression model"
              value={regression}
              onChange={(event) =>
                act(() => setRegression(event.target.value as RegressionKind))
              }
            >
              <option value="linear">Linear</option>
              <option value="quadratic">Quadratic</option>
              <option value="none">None</option>
            </select>
          </label>
          <p className="dp46-stat">
            Correlation <b>r = {analysis.correlation.toFixed(2)}</b>
          </p>
          <label className="dp46-toggle">
            Outlier check
            <input
              type="checkbox"
              checked={outlierCheck}
              onChange={(event) =>
                act(() => setOutlierCheck(event.target.checked))
              }
            />
          </label>
          <output>{analysis.fit.equation}</output>
          <blockquote>
            Do not force a curve before inspecting the data
          </blockquote>
        </aside>
      </section>
      <nav className="dp46-adjacent">
        <a href="/lessons/graphs-and-functions/45-point-plotter">
          ←{" "}
          <span>
            PREVIOUS<b>Point Plotter</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/47-table-of-values">
          <span>
            NEXT<b>Table of Values</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={46} alwaysVisible onInteraction={onInteraction} />

    </section>
  );
}
