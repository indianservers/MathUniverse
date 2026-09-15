import { Expand, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  TRACE_STEP_OPTIONS,
  TRACE_X_MAX,
  TRACE_X_MIN,
  nearbyTraceValues,
  snapTraceX,
  traceFunctionPath,
  traceGraphPosition,
  traceModeSlope,
  traceModeValue,
  traceTangentPath,
  traceXFromPixel,
} from "./traceModeLesson48Model";
import "./TraceModeTargetLesson48.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

const tabs = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];

export default function TraceModeTargetLesson48({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(1.8),
    [stepIndex, setStepIndex] = useState(1),
    [history, setHistory] = useState<number[]>([1.4, 1.5, 1.6, 1.7]),
    [tab, setTab] = useState(tabs[0]),
    [actions, setActions] = useState(0);
  const step = TRACE_STEP_OPTIONS[stepIndex],
    y = traceModeValue(x),
    slope = traceModeSlope(x),
    position = traceGraphPosition(x, y);
  const nearby = useMemo(() => nearbyTraceValues(x, step), [x, step]);
  const reset = () => {
    setX(1.8);
    setStepIndex(1);
    setHistory([1.4, 1.5, 1.6, 1.7]);
    setTab(tabs[0]);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeX = (value: number) =>
    act(() => {
      const next = snapTraceX(value, step);
      setX(next);
      setHistory((items) => [...items, next].slice(-8));
    });
  const dragTrace = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeX(
      traceXFromPixel(((event.clientX - rect.left) / rect.width) * 690, step),
    );
  };
  const keyTrace = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    changeX(x + (event.key === "ArrowLeft" ? -step : step));
  };

  return (
    <section
      className="tm48-page"
      data-testid="2d-graphing-mockup-0140"
      data-dedicated-lesson="48"
      data-object-model="exact-sine-linear-function-and-derivative-pointer-keyboard-horizontal-trace-live-tangent-configurable-step-previous-next-nearby-value-table-recent-position-history-tabs-reset-share-fullscreen-and-navigation"
      data-x={x}
      data-y={y.toFixed(6)}
      data-slope={slope.toFixed(6)}
      data-step={step}
      data-actions={actions}
    >
      <nav className="tm48-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>48 Trace Mode</b>
      </nav>
      <header className="tm48-hero">
        <div>
          <h1>Trace Mode</h1>
          <p>Observe paths and change.</p>
          <nav>
            <b>Foundational-Advanced</b>
            <b>⚡ Graph Explorer</b>
            <b>▣ Graphing Calculator</b>
            <b>◷ 6-10 min</b>
          </nav>
        </div>
        <section>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `x=${x}, y=${y.toFixed(4)}, slope=${slope.toFixed(4)}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
        </section>
      </header>
      <nav className="tm48-tabs">
        {tabs.map((label) => (
          <button
            key={label}
            className={tab === label ? "active" : ""}
            onClick={() => act(() => setTab(label))}
          >
            {label}
          </button>
        ))}
      </nav>
      <section className="tm48-lab">
        <header>
          <div>
            <h2>Trace the path on the graph</h2>
            <p>
              Drag the trace point along the curve. Observe how x, y and the
              slope change.
            </p>
          </div>
          <b>{actions === 0 ? "Awaiting interaction" : "Exploring"}</b>
          <span>{actions} actions</span>
          <button
            aria-label="Expand trace lab"
            onClick={() =>
              act(() =>
                document.querySelector(".tm48-lab")?.requestFullscreen?.(),
              )
            }
          >
            <Expand />
          </button>
        </header>
        <section className="tm48-workspace">
          <main className="tm48-graph">
            <svg
              viewBox="0 0 690 560"
              role="img"
              aria-label="Function curve with draggable trace and tangent"
            >
              <defs>
                <pattern
                  id="tm48-grid"
                  width="42"
                  height="42"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M42 0H0V42" fill="none" stroke="#dfe8f2" />
                </pattern>
              </defs>
              <rect
                x="35"
                y="25"
                width="620"
                height="500"
                fill="url(#tm48-grid)"
              />
              <line
                x1="35"
                x2="655"
                y1={traceGraphPosition(0, 0).y}
                y2={traceGraphPosition(0, 0).y}
                className="axis"
              />
              <line
                x1={traceGraphPosition(0, 0).x}
                x2={traceGraphPosition(0, 0).x}
                y1="25"
                y2="525"
                className="axis"
              />
              <text x="45" y="48" className="formula">
                f(x) = sin(x) + 0.3x
              </text>
              <polyline points={traceFunctionPath()} className="curve" />
              <polyline points={traceTangentPath(x)} className="tangent" />
              <line
                x1={position.x}
                x2={position.x}
                y1="25"
                y2="525"
                className="trace-guide"
              />
              <line
                x1="35"
                x2={position.x}
                y1={position.y}
                y2={position.y}
                className="trace-guide"
              />
              {history.map((value, index) => {
                const p = traceGraphPosition(value, traceModeValue(value));
                return (
                  <circle
                    key={`${value}-${index}`}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="history"
                    opacity={(index + 1) / history.length}
                  />
                );
              })}
              <circle
                aria-label="Drag trace point"
                tabIndex={0}
                cx={position.x}
                cy={position.y}
                r="12"
                className="trace-point"
                onPointerDown={(event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                onPointerMove={dragTrace}
                onKeyDown={keyTrace}
              />
              <g
                className="tm48-label"
                transform={`translate(${Math.min(565, position.x + 18)} ${Math.max(35, position.y + 20)})`}
              >
                <rect width="100" height="36" rx="7" />
                <text x="50" y="23" textAnchor="middle">
                  ({x.toFixed(2)}, {y.toFixed(2)})
                </text>
              </g>
            </svg>
          </main>
          <aside className="tm48-controls">
            <h2>
              Trace point <i />
            </h2>
            <output>
              <b>x = {x.toFixed(2)}</b>
              <b>y = {y.toFixed(3)}</b>
            </output>
            <label>
              Trace along x
              <input
                aria-label="Trace along x"
                type="range"
                min={TRACE_X_MIN}
                max={TRACE_X_MAX}
                step={step}
                value={x}
                onChange={(event) => changeX(Number(event.target.value))}
              />
              <small>
                <span>-2π</span>
                <span>2π</span>
              </small>
              <input
                aria-label="Trace x value"
                type="number"
                min={TRACE_X_MIN}
                max={TRACE_X_MAX}
                step={step}
                value={x}
                onChange={(event) => changeX(Number(event.target.value))}
              />
            </label>
            <label>
              Step size
              <input
                aria-label="Trace step size"
                type="range"
                min="0"
                max="3"
                value={stepIndex}
                onChange={(event) =>
                  act(() => setStepIndex(Number(event.target.value)))
                }
              />
              <small>
                {TRACE_STEP_OPTIONS.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </small>
              <output>{step}</output>
            </label>
            <section>
              <h3>
                Slope estimate <b>{slope.toFixed(3)}</b>
              </h3>
              <p>Tangent (instantaneous) at x = {x.toFixed(2)}</p>
            </section>
            <nav>
              <button onClick={() => changeX(x - step)}>
                ‹ Previous point
              </button>
              <button onClick={() => changeX(x + step)}>Next point ›</button>
            </nav>
            <p>ⓘ Move steadily and report both x and y.</p>
          </aside>
        </section>
        <section className="tm48-nearby">
          <h2>Nearby values</h2>
          <table>
            <tbody>
              <tr>
                <th>x</th>
                {nearby.map((item, index) => (
                  <td key={item.x} className={index === 4 ? "active" : ""}>
                    {item.x.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr>
                <th>f(x)</th>
                {nearby.map((item, index) => (
                  <td key={item.x} className={index === 4 ? "active" : ""}>
                    {item.y.toFixed(3)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p>● Path history (drag trail) shows recent positions.</p>
        </section>
      </section>
      <nav className="tm48-adjacent">
        <a href="/lessons/graphs-and-functions/47-table-of-values">
          ←{" "}
          <span>
            PREVIOUS<b>Table of Values</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/49-zoom-and-pan">
          <span>
            NEXT<b>Zoom and Pan</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={48} view={tab} onInteraction={onInteraction} />

    </section>
  );
}
