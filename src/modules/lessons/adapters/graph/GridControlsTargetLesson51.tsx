import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_GRID_STATE,
  GRID_MAJOR_OPTIONS,
  GRID_SUBDIVISION_OPTIONS,
  gridCurvePath,
  gridFunctionValue,
  gridGraphPosition,
  gridLines,
  gridXFromPixel,
  snapGridX,
  type GridControlState,
} from "./gridControlsLesson51Model";
import "./GridControlsTargetLesson51.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

function ControlledGrid({
  state,
  width = 620,
  height = 540,
  mini = false,
  selected = true,
  onPointer,
  onKey,
}: {
  state: GridControlState;
  width?: number;
  height?: number;
  mini?: boolean;
  selected?: boolean;
  onPointer?: (event: ReactPointerEvent<SVGCircleElement>) => void;
  onKey?: (event: ReactKeyboardEvent<SVGCircleElement>) => void;
}) {
  const lines = gridLines(state),
    origin = gridGraphPosition(0, 0, width, height),
    point = gridGraphPosition(
      state.selectedX,
      gridFunctionValue(state.selectedX),
      width,
      height,
    );
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={
        mini
          ? "Grid comparison graph"
          : "Parabola with configurable grid and draggable estimate point"
      }
    >
      {lines.vertical.map((line) => {
        const p = gridGraphPosition(line.value, 0, width, height);
        return (
          <line
            key={`v${line.value}`}
            x1={p.x}
            x2={p.x}
            y1="0"
            y2={height}
            className={line.major ? "major-grid" : "minor-grid"}
            opacity={state.opacity}
          />
        );
      })}
      {lines.horizontal.map((line) => {
        const p = gridGraphPosition(0, line.value, width, height);
        return (
          <line
            key={`h${line.value}`}
            x1="0"
            x2={width}
            y1={p.y}
            y2={p.y}
            className={line.major ? "major-grid" : "minor-grid"}
            opacity={state.opacity}
          />
        );
      })}
      <line x1="0" x2={width} y1={origin.y} y2={origin.y} className="axis" />
      <line x1={origin.x} x2={origin.x} y1="0" y2={height} className="axis" />
      <polyline points={gridCurvePath(width, height)} className="curve" />
      {[-2, -1, 0, 1, 2].map((x) => {
        const p = gridGraphPosition(x, gridFunctionValue(x), width, height);
        return (
          <circle
            key={x}
            cx={p.x}
            cy={p.y}
            r={mini ? 3 : 6}
            className="sample"
          />
        );
      })}
      {selected && (
        <>
          <line
            x1={origin.x}
            x2={point.x}
            y1={point.y}
            y2={point.y}
            className="estimate-guide"
          />
          <line
            x1={point.x}
            x2={point.x}
            y1={origin.y}
            y2={point.y}
            className="estimate-guide"
          />
          <circle
            aria-label={mini ? undefined : "Drag grid estimate point"}
            tabIndex={mini ? undefined : 0}
            cx={point.x}
            cy={point.y}
            r={mini ? 5 : 9}
            className="estimate-point"
            onPointerDown={
              !mini
                ? (event) =>
                    event.currentTarget.setPointerCapture(event.pointerId)
                : undefined
            }
            onPointerMove={onPointer}
            onKeyDown={onKey}
          />
          {state.labels && !mini && (
            <>
              <text
                x={point.x + 8}
                y={origin.y + 20}
                className="estimate-label"
              >
                {state.selectedX}
              </text>
              <text
                x={origin.x - 48}
                y={point.y + 4}
                className="estimate-label"
              >
                {gridFunctionValue(state.selectedX).toFixed(3)}
              </text>
              <text x={point.x - 80} y={point.y - 28} className="value-label">
                f({state.selectedX}) ={" "}
                {gridFunctionValue(state.selectedX).toFixed(3)}
              </text>
            </>
          )}
        </>
      )}
      {state.labels &&
        !mini &&
        [-3, -2, -1, 1, 2, 3].map((value) => (
          <text
            key={`label${value}`}
            x={gridGraphPosition(value, 0, width, height).x}
            y={origin.y + 20}
            textAnchor="middle"
            className="tick-label"
          >
            {value}
          </text>
        ))}
    </svg>
  );
}

export default function GridControlsTargetLesson51({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [state, setState] = useState<GridControlState>(DEFAULT_GRID_STATE),
    [actions, setActions] = useState(0);
  const value = gridFunctionValue(state.selectedX),
    lines = useMemo(() => gridLines(state), [state]);
  const reset = () => {
    setState(DEFAULT_GRID_STATE);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((count) => count + 1);
    onInteraction();
  };
  const update = (change: Partial<GridControlState>) =>
    act(() =>
      setState((current) => {
        const next = { ...current, ...change };
        return { ...next, selectedX: snapGridX(next.selectedX, next) };
      }),
    );
  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    update({
      selectedX: gridXFromPixel(
        ((event.clientX - rect.left) / rect.width) * 620,
        state,
      ),
    });
  };
  const keyPoint = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    update({
      selectedX:
        state.selectedX +
        (event.key === "ArrowLeft" ? -lines.minorSpacing : lines.minorSpacing),
    });
  };
  const before = {
    ...state,
    majorSpacing: 2,
    subdivisions: 1,
    estimate: false,
    labels: false,
  };

  return (
    <section
      className="gc51-page"
      data-testid="2d-graphing-mockup-0143"
      data-dedicated-lesson="51"
      data-object-model="major-grid-spacing-minor-subdivision-derived-snap-interval-opacity-label-and-estimate-layers-pointer-keyboard-draggable-function-point-generated-parabola-before-after-comparison-reset-share-and-navigation"
      data-major={state.majorSpacing}
      data-subdivisions={state.subdivisions}
      data-minor={lines.minorSpacing}
      data-selected-x={state.selectedX}
      data-selected-y={value}
      data-actions={actions}
    >
      <nav className="gc51-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>51 Grid Controls</b>
      </nav>
      <header className="gc51-hero">
        <small>INTERACTION + VISUALIZATION</small>
        <h1>Grid Controls</h1>
        <p>Use appropriate construction guides.</p>
        <nav>
          <b>◷ 6-10 min</b>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `major=${state.majorSpacing}, subdivisions=${state.subdivisions}, x=${state.selectedX}, y=${value}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
        </nav>
      </header>
      <section className="gc51-workspace">
        <main className="gc51-graph">
          <h2>y = 0.5x²</h2>
          <ControlledGrid
            state={state}
            onPointer={dragPoint}
            onKey={keyPoint}
          />
        </main>
        <aside className="gc51-controls">
          <h2>Grid Controls</h2>
          <label>
            Major spacing
            <div>
              {GRID_MAJOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  className={state.majorSpacing === option ? "active" : ""}
                  onClick={() => update({ majorSpacing: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
          <label>
            Minor subdivisions
            <div>
              {GRID_SUBDIVISION_OPTIONS.map((option) => (
                <button
                  key={option}
                  className={state.subdivisions === option ? "active" : ""}
                  onClick={() => update({ subdivisions: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </label>
          <label className="gc51-toggle">
            Snap to grid
            <input
              type="checkbox"
              checked={state.snap}
              onChange={(event) => update({ snap: event.target.checked })}
            />
            <small>Snap points to the nearest major grid intersection.</small>
          </label>
          <label>
            Grid opacity
            <div className="gc51-opacity">
              <input
                aria-label="Grid opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={state.opacity}
                onChange={(event) =>
                  update({ opacity: Number(event.target.value) })
                }
              />
              <output>{Math.round(state.opacity * 100)}%</output>
            </div>
          </label>
          <label className="gc51-toggle">
            Estimate points
            <input
              type="checkbox"
              checked={state.estimate}
              onChange={(event) => update({ estimate: event.target.checked })}
            />
            <small>Show construction guides for estimating coordinates.</small>
          </label>
          <label className="gc51-toggle">
            Labels on
            <input
              type="checkbox"
              checked={state.labels}
              onChange={(event) => update({ labels: event.target.checked })}
            />
            <small>Show axis labels and tick values.</small>
          </label>
          <p>ⓘ Gridlines guide reading; they do not redefine values</p>
        </aside>
      </section>
      <section className="gc51-compare">
        <article>
          <h2>Before: Sparse grid</h2>
          <p>Harder to estimate values accurately.</p>
          <ControlledGrid
            state={before}
            width={280}
            height={160}
            mini
            selected
          />
          <b>?</b>
        </article>
        <i>→</i>
        <article>
          <h2>After: Guided by grid controls</h2>
          <p>Easier to estimate using construction guides.</p>
          <ControlledGrid
            state={state}
            width={280}
            height={160}
            mini
            selected={state.estimate}
          />
          <b>{state.estimate ? value.toFixed(3) : "?"}</b>
        </article>
      </section>
      <nav className="gc51-adjacent">
        <a href="/lessons/graphs-and-functions/50-axis-controls">
          ←{" "}
          <span>
            PREVIOUS<b>Axis Controls</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/52-multiple-graphics-views">
          <span>
            NEXT<b>Multiple Graphics Views</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={51} alwaysVisible onInteraction={onInteraction} />

    </section>
  );
}
