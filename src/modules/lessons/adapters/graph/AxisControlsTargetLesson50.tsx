import { Move, RotateCcw, Share2, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  AXIS_PRESETS,
  DEFAULT_AXIS_STATE,
  applyAxisPreset,
  axisCurvePath,
  axisGraphPosition,
  axisWorldFromPixels,
  normalizeAxisState,
  type AxisControlState,
  type AxisScale,
} from "./axisControlsLesson50Model";
import "./AxisControlsTargetLesson50.css";

type Handle = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export default function AxisControlsTargetLesson50({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [state, setState] = useState<AxisControlState>(DEFAULT_AXIS_STATE),
    [language, setLanguage] = useState("en"),
    [actions, setActions] = useState(0);
  const context = useMemo<AxisControlState>(
    () => ({
      ...DEFAULT_AXIS_STATE,
      xMin: Math.min(-9, state.xMin - 1),
      xMax: Math.max(9, state.xMax + 1),
      yMin: Math.min(-2, state.yMin - 1),
      yMax: Math.max(20, state.yMax + 2),
      xScale: "linear",
      yScale: "linear",
    }),
    [state],
  );
  const topLeft = axisGraphPosition(state.xMin, state.yMax, context),
    bottomRight = axisGraphPosition(state.xMax, state.yMin, context),
    origin = axisGraphPosition(state.originX, state.originY, context);
  const reset = () => {
    setState(DEFAULT_AXIS_STATE);
    setLanguage("en");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (change: Partial<AxisControlState>) =>
    act(() => setState((value) => normalizeAxisState({ ...value, ...change })));
  const setScale = (axis: "x" | "y", scale: AxisScale) =>
    update(axis === "x" ? { xScale: scale } : { yScale: scale });
  const drag = (
    event: ReactPointerEvent<SVGCircleElement>,
    handle: Handle | "origin",
  ) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const point = axisWorldFromPixels(
      ((event.clientX - rect.left) / rect.width) * 620,
      ((event.clientY - rect.top) / rect.height) * 500,
      context,
    );
    if (handle === "origin")
      update({
        originX: Number(point.x.toFixed(1)),
        originY: Number(point.y.toFixed(1)),
      });
    else
      update({
        ...(handle.includes("Left") ? { xMin: point.x } : { xMax: point.x }),
        ...(handle.startsWith("top") ? { yMax: point.y } : { yMin: point.y }),
      });
  };
  const keyHandle = (
    event: ReactKeyboardEvent<SVGCircleElement>,
    handle: Handle | "origin",
  ) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-0.5, 0],
      ArrowRight: [0.5, 0],
      ArrowUp: [0, 0.5],
      ArrowDown: [0, -0.5],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    if (handle === "origin")
      update({
        originX: state.originX + move[0],
        originY: state.originY + move[1],
      });
    else
      update({
        ...(handle.includes("Left")
          ? { xMin: state.xMin + move[0] }
          : { xMax: state.xMax + move[0] }),
        ...(handle.startsWith("top")
          ? { yMax: state.yMax + move[1] }
          : { yMin: state.yMin + move[1] }),
      });
  };
  const handles: [Handle, number, number][] = [
    ["topLeft", topLeft.x, topLeft.y],
    ["topRight", bottomRight.x, topLeft.y],
    ["bottomLeft", topLeft.x, bottomRight.y],
    ["bottomRight", bottomRight.x, bottomRight.y],
  ];
  const range = (min: number, max: number) =>
    `[${Number(min.toFixed(2))}, ${Number(max.toFixed(2))}]`;

  return (
    <section
      className="ac50-page"
      data-testid="2d-graphing-mockup-0142"
      data-dedicated-lesson="50"
      data-object-model="independent-axis-bounds-tick-spacing-linear-log-transforms-real-presets-pointer-keyboard-draggable-four-corner-range-handles-and-origin-shift-context-and-visible-exponential-curves-reset-share-language-and-navigation"
      data-x-range={range(state.xMin, state.xMax)}
      data-y-range={range(state.yMin, state.yMax)}
      data-x-scale={state.xScale}
      data-y-scale={state.yScale}
      data-origin={`${state.originX},${state.originY}`}
      data-actions={actions}
    >
      <nav className="ac50-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>50 Axis Controls</b>
      </nav>
      <header className="ac50-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
          <b>INTERACTION + VISUALIZATION</b>
        </small>
        <h1>Axis Controls</h1>
        <p>Configure graph presentation.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
        <section>
          <select
            aria-label="Axis controls language"
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
                  `x:${range(state.xMin, state.xMax)}, y:${range(state.yMin, state.yMax)}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
        </section>
      </header>
      <section className="ac50-workspace">
        <main className="ac50-graph">
          <header>
            <h2>Graph view</h2>
            <span>f(x) = 2ˣ</span>
            <b>━━ Visible window</b>
            <em>━━ Full range (context)</em>
          </header>
          <svg
            viewBox="0 0 620 500"
            role="img"
            aria-label="Exponential graph with draggable axis window and origin"
          >
            <defs>
              <pattern
                id="ac50-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M40 0H0V40" fill="none" stroke="#dfe8f2" />
              </pattern>
              <clipPath id="ac50-visible">
                <rect
                  x={topLeft.x}
                  y={topLeft.y}
                  width={bottomRight.x - topLeft.x}
                  height={bottomRight.y - topLeft.y}
                />
              </clipPath>
            </defs>
            <rect width="620" height="500" fill="url(#ac50-grid)" />
            <line
              x1="0"
              x2="620"
              y1={origin.y}
              y2={origin.y}
              className="axis"
            />
            <line
              x1={origin.x}
              x2={origin.x}
              y1="0"
              y2="500"
              className="axis"
            />
            <polyline
              points={axisCurvePath(context)}
              className="context-curve"
            />
            <g clipPath="url(#ac50-visible)">
              <g
                transform={`translate(${topLeft.x} ${topLeft.y}) scale(${(bottomRight.x - topLeft.x) / 620} ${(bottomRight.y - topLeft.y) / 500})`}
              >
                <polyline
                  points={axisCurvePath(state)}
                  className="visible-curve"
                />
              </g>
            </g>
            <rect
              x={topLeft.x}
              y={topLeft.y}
              width={bottomRight.x - topLeft.x}
              height={bottomRight.y - topLeft.y}
              className="window"
            />
            {handles.map(([handle, x, y]) => (
              <circle
                key={handle}
                aria-label={`Drag ${handle} axis limit`}
                tabIndex={0}
                cx={x}
                cy={y}
                r="8"
                className="range-handle"
                onPointerDown={(event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                onPointerMove={(event) => drag(event, handle)}
                onKeyDown={(event) => keyHandle(event, handle)}
              />
            ))}
            <circle
              aria-label="Drag axis origin"
              tabIndex={0}
              cx={origin.x}
              cy={origin.y}
              r="13"
              className="origin-handle"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={(event) => drag(event, "origin")}
              onKeyDown={(event) => keyHandle(event, "origin")}
            />
            <Move x={origin.x - 8} y={origin.y - 8} width="16" height="16" />
          </svg>
          <section className="ac50-summary">
            <article>
              <b>Visible window (teal)</b>
              <span>
                x: {range(state.xMin, state.xMax)} &nbsp; y:{" "}
                {range(state.yMin, state.yMax)}
              </span>
            </article>
            <article>
              <b>Tick spacing</b>
              <span>
                x: {state.xTick} &nbsp; y: {state.yTick}
              </span>
            </article>
            <article>
              <b>Origin shift</b>
              <span>
                ({state.originX}, {state.originY})
              </span>
            </article>
          </section>
          <article className="ac50-warning">
            <TriangleAlert />
            <div>
              <b>Bad axis limits can hide important behavior</b>
              <p>
                If the range is too small or the scale is too large, key
                features of the function may be hidden. Always choose limits
                that reveal the important behavior.
              </p>
            </div>
          </article>
        </main>
        <aside className="ac50-controls">
          <h2>Axis controls</h2>
          {(["x", "y"] as const).map((axis) => (
            <section key={axis}>
              <h3>{axis.toUpperCase()}-axis</h3>
              <div>
                <label>
                  {axis} min
                  <input
                    aria-label={`${axis} minimum`}
                    type="number"
                    value={state[`${axis}Min`]}
                    onChange={(event) =>
                      update({ [`${axis}Min`]: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  {axis} max
                  <input
                    aria-label={`${axis} maximum`}
                    type="number"
                    value={state[`${axis}Max`]}
                    onChange={(event) =>
                      update({ [`${axis}Max`]: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
              <label>
                Tick step
                <input
                  aria-label={`${axis} tick step`}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={state[`${axis}Tick`]}
                  onChange={(event) =>
                    update({ [`${axis}Tick`]: Number(event.target.value) })
                  }
                />
              </label>
              <nav>
                <button
                  className={state[`${axis}Scale`] === "linear" ? "active" : ""}
                  onClick={() => setScale(axis, "linear")}
                >
                  Linear scale
                </button>
                <button
                  className={state[`${axis}Scale`] === "log" ? "active" : ""}
                  onClick={() => setScale(axis, "log")}
                >
                  Log scale
                </button>
              </nav>
            </section>
          ))}
          <section className="ac50-presets">
            <h3>Presets</h3>
            <div>
              {(Object.keys(AXIS_PRESETS) as (keyof typeof AXIS_PRESETS)[]).map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() =>
                      act(() =>
                        setState((value) => applyAxisPreset(value, preset)),
                      )
                    }
                  >
                    <b>
                      {preset === "default"
                        ? "Default view"
                        : preset === "zoom"
                          ? "Zoom in"
                          : preset === "origin"
                            ? "Focus on origin"
                            : "Wide view"}
                    </b>
                    <small>
                      x:{" "}
                      {range(
                        AXIS_PRESETS[preset].xMin,
                        AXIS_PRESETS[preset].xMax,
                      )}{" "}
                      y:{" "}
                      {range(
                        AXIS_PRESETS[preset].yMin,
                        AXIS_PRESETS[preset].yMax,
                      )}
                    </small>
                  </button>
                ),
              )}
            </div>
          </section>
        </aside>
      </section>
      <nav className="ac50-adjacent">
        <a href="/lessons/graphs-and-functions/49-zoom-and-pan">
          ←{" "}
          <span>
            PREVIOUS<b>Zoom and Pan</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/51-grid-controls">
          <span>
            NEXT<b>Grid Controls</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
