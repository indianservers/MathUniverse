import {
  Activity,
  Copy,
  Eye,
  EyeOff,
  Maximize2,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_PLOTTER_FUNCTIONS,
  PLOTTER_SAMPLE_X,
  evaluatePlotterExpression,
  formatPlotterValue,
  plotterIntersections,
  plotterPath,
  type PlotterFunction,
} from "./functionPlotterLesson40Model";
import "./FunctionPlotterTargetLesson40.css";

const expressionCycle = ["x^2 - 2", "0.8x + 1", "sin(x)", "cos(x)", "x"];

export default function FunctionPlotterTargetLesson40({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [functions, setFunctions] = useState<PlotterFunction[]>(() =>
    DEFAULT_PLOTTER_FUNCTIONS.map((fn) => ({ ...fn })),
  );
  const [trace, setTrace] = useState(1.5);
  const [actions, setActions] = useState(0);
  const intersections = useMemo(
    () => plotterIntersections(functions),
    [functions],
  );
  const reset = () => {
    setFunctions(DEFAULT_PLOTTER_FUNCTIONS.map((fn) => ({ ...fn })));
    setTrace(1.5);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateFunction = (
    id: PlotterFunction["id"],
    update: Partial<PlotterFunction>,
  ) =>
    act(() =>
      setFunctions((items) =>
        items.map((item) => (item.id === id ? { ...item, ...update } : item)),
      ),
    );
  const graphX = (x: number) => 40 + (x + 4.5) * 73.3;
  const graphY = (y: number) => 290 - y * 61;

  return (
    <section
      className="fp40-page"
      data-testid="2d-graphing-mockup-0132"
      data-dedicated-lesson="40"
      data-object-model="editable-independent-function-definitions-visibility-presets-delete-copy-generated-curves-numerical-intersections-linked-trace-outputs-and-sample-table"
      data-trace={trace}
      data-actions={actions}
    >
      <nav className="fp40-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>40 Function Plotter</b>
      </nav>
      <header className="fp40-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </small>
        <h1>Function Plotter</h1>
        <p>Compare multiple functions.</p>
        <nav>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset view
          </button>
          <button onClick={() => act(() => setTrace(1.5))}>
            <Maximize2 /> Zoom fit
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  functions
                    .map((fn) => `${fn.id}(x)=${fn.expression}`)
                    .join("\n"),
                ),
              )
            }
          >
            <Share2 /> Share
          </button>
          <b>● Outputs update together</b>
        </nav>
      </header>
      <section className="fp40-workspace">
        <main className="fp40-graph-card">
          <aside className="fp40-intersections">
            <b>Intersections</b>
            {intersections.slice(0, 4).map((point, index) => (
              <span key={`${point.pair}-${index}`}>
                <i style={{ background: point.color }} />
                {point.pair}: ({point.x.toFixed(3)}, {point.y.toFixed(3)})
              </span>
            ))}
          </aside>
          <svg
            viewBox="0 0 740 580"
            role="img"
            aria-label="Three function plots with linked trace"
          >
            <defs>
              <pattern
                id="fp40-grid"
                width="36.65"
                height="30.5"
                patternUnits="userSpaceOnUse"
              >
                <path d="M36.65 0H0V30.5" fill="none" stroke="#e0e9f4" />
              </pattern>
            </defs>
            <rect
              x="40"
              y="30"
              width="660"
              height="520"
              fill="url(#fp40-grid)"
              stroke="#d7e3f0"
            />
            <line x1="40" x2="706" y1="290" y2="290" className="axis" />
            <line x1="370" x2="370" y1="550" y2="24" className="axis" />
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((value) => (
              <text
                key={`x${value}`}
                x={graphX(value)}
                y="312"
                textAnchor="middle"
              >
                {value}
              </text>
            ))}
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((value) => (
              <text
                key={`y${value}`}
                x="357"
                y={graphY(value) + 4}
                textAnchor="end"
              >
                {value}
              </text>
            ))}
            {functions
              .filter((fn) => fn.visible)
              .map((fn) => (
                <polyline
                  key={fn.id}
                  points={plotterPath(fn.expression)}
                  fill="none"
                  stroke={fn.color}
                  strokeWidth="3.5"
                />
              ))}
            <line
              x1={graphX(trace)}
              x2={graphX(trace)}
              y1="30"
              y2="550"
              className="trace"
            />
            <g
              className="trace-label"
              transform={`translate(${graphX(trace) - 34} 6)`}
            >
              <rect width="68" height="30" rx="7" />
              <text x="34" y="20" textAnchor="middle">
                x = {trace}
              </text>
            </g>
            {functions
              .filter((fn) => fn.visible)
              .map((fn) => {
                const y = evaluatePlotterExpression(fn.expression, trace);
                return Number.isFinite(y) ? (
                  <circle
                    key={fn.id}
                    cx={graphX(trace)}
                    cy={graphY(y)}
                    r="7"
                    fill={fn.color}
                  />
                ) : null;
              })}
          </svg>
          <section className="fp40-outputs">
            <h2>Outputs at x = {trace}</h2>
            <div>
              {functions
                .filter((fn) => fn.visible)
                .map((fn) => (
                  <output key={fn.id} style={{ borderColor: fn.color }}>
                    <i style={{ background: fn.color }} />
                    <b>
                      {fn.id}({trace})
                    </b>{" "}
                    ={" "}
                    {formatPlotterValue(
                      evaluatePlotterExpression(fn.expression, trace),
                    )}
                  </output>
                ))}
            </div>
          </section>
        </main>
        <aside className="fp40-controls">
          <h2>Functions</h2>
          {functions.map((fn) => (
            <section key={fn.id} className={!fn.visible ? "disabled" : ""}>
              <header>
                <span>
                  <i style={{ background: fn.color }} />
                  <b>{fn.id}(x)</b>
                </span>
                <button
                  aria-label={`Toggle ${fn.id}`}
                  onClick={() =>
                    updateFunction(fn.id, { visible: !fn.visible })
                  }
                >
                  {fn.visible ? <Eye /> : <EyeOff />}
                </button>
                <input
                  aria-label={`${fn.id} visible`}
                  type="checkbox"
                  checked={fn.visible}
                  onChange={(event) =>
                    updateFunction(fn.id, { visible: event.target.checked })
                  }
                />
              </header>
              <label>
                <i style={{ background: fn.color }} />
                <input
                  aria-label={`${fn.id} expression`}
                  value={fn.expression}
                  onChange={(event) =>
                    updateFunction(fn.id, { expression: event.target.value })
                  }
                />
              </label>
              <footer>
                <button
                  aria-label={`Cycle ${fn.id} expression`}
                  onClick={() =>
                    updateFunction(fn.id, {
                      expression:
                        expressionCycle[
                          (expressionCycle.indexOf(fn.expression) + 1) %
                            expressionCycle.length
                        ],
                    })
                  }
                >
                  <Activity />
                </button>
                <button
                  aria-label={`Copy ${fn.id} expression`}
                  onClick={() =>
                    act(() => navigator.clipboard?.writeText(fn.expression))
                  }
                >
                  <Copy />
                </button>
                <button
                  aria-label={`Remove ${fn.id} graph`}
                  onClick={() => updateFunction(fn.id, { visible: false })}
                >
                  <Trash2 />
                </button>
              </footer>
            </section>
          ))}
          <section className="fp40-trace">
            <h2>
              Trace x <span>Trace x = {trace}</span>
            </h2>
            <label>
              <em>-5</em>
              <input
                aria-label="Trace x"
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={trace}
                onChange={(event) =>
                  act(() => setTrace(Number(event.target.value)))
                }
              />
              <em>5</em>
              <input
                aria-label="Trace x value"
                type="number"
                min="-5"
                max="5"
                step="0.5"
                value={trace}
                onChange={(event) =>
                  act(() =>
                    setTrace(
                      Math.max(-5, Math.min(5, Number(event.target.value))),
                    ),
                  )
                }
              />
            </label>
          </section>
          <p className="fp40-tip">
            Move the trace to see function values update together on the graph
            and in the outputs.
          </p>
        </aside>
      </section>
      <section className="fp40-table">
        <h2>Sample values</h2>
        <table>
          <thead>
            <tr>
              <th>x</th>
              {PLOTTER_SAMPLE_X.map((x) => (
                <th key={x} className={x === trace ? "active" : ""}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {functions.map((fn) => (
              <tr key={fn.id}>
                <th>
                  <i style={{ background: fn.color }} />
                  {fn.id}(x) = {fn.expression}
                </th>
                {PLOTTER_SAMPLE_X.map((x) => (
                  <td key={x} className={x === trace ? "active" : ""}>
                    {formatPlotterValue(
                      evaluatePlotterExpression(fn.expression, x),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <nav className="fp40-adjacent">
        <a href="/lessons/graphs-and-functions/39-cartesian-graphing">
          ←{" "}
          <span>
            PREVIOUS<b>Cartesian Graphing</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/41-equation-grapher">
          <span>
            NEXT<b>Equation Grapher</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
