import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Lightbulb,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_ZOOM_VIEWPORT,
  ZOOM_PAN_OVERVIEW,
  graphPosition,
  panViewport,
  viewportBounds,
  viewportCenterFromPixels,
  viewportRectangle,
  zoomPanCurvePath,
  zoomViewport,
  type GraphBounds,
  type ZoomViewport,
} from "./zoomPanLesson49Model";
import "./ZoomPanTargetLesson49.css";

function GraphPane({
  bounds,
  width,
  height,
  rectangle,
  viewport,
  interactive = false,
  onPointer,
  onKey,
  label,
}: {
  bounds: GraphBounds;
  width: number;
  height: number;
  rectangle?: boolean;
  viewport: ZoomViewport;
  interactive?: boolean;
  onPointer?: (event: ReactPointerEvent<SVGRectElement>) => void;
  onKey?: (event: ReactKeyboardEvent<SVGRectElement>) => void;
  label: string;
}) {
  const origin = graphPosition(0, 0, bounds, width, height),
    rect = viewportRectangle(viewport, width, height);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <defs>
        <pattern
          id={`zp49-grid-${width}-${height}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V40" fill="none" stroke="#dfe8f2" />
        </pattern>
      </defs>
      <rect
        width={width}
        height={height}
        fill={`url(#zp49-grid-${width}-${height})`}
      />
      <line x1="0" x2={width} y1={origin.y} y2={origin.y} className="axis" />
      <line x1={origin.x} x2={origin.x} y1="0" y2={height} className="axis" />
      <polyline
        points={zoomPanCurvePath(bounds, width, height)}
        className="curve"
      />
      {rectangle && (
        <rect
          aria-label={interactive ? "Drag viewport" : "Current viewport"}
          tabIndex={interactive ? 0 : undefined}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          className="viewport-rect"
          onPointerDown={
            interactive
              ? (event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
              : undefined
          }
          onPointerMove={onPointer}
          onKeyDown={onKey}
        />
      )}
    </svg>
  );
}

export default function ZoomPanTargetLesson49({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [viewport, setViewport] = useState<ZoomViewport>(DEFAULT_ZOOM_VIEWPORT),
    [actions, setActions] = useState(0);
  const bounds = viewportBounds(viewport);
  const reset = () => {
    setViewport(DEFAULT_ZOOM_VIEWPORT);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const zoom = (direction: "in" | "out") =>
    act(() => setViewport((value) => zoomViewport(value, direction)));
  const pan = (dx: number, dy: number) =>
    act(() => setViewport((value) => panViewport(value, dx, dy)));
  const dragViewport = (event: ReactPointerEvent<SVGRectElement>) => {
    if (event.buttons !== 1) return;
    const svg = event.currentTarget.ownerSVGElement,
      rect = svg?.getBoundingClientRect();
    if (!rect) return;
    const center = viewportCenterFromPixels(
      ((event.clientX - rect.left) / rect.width) * 560,
      ((event.clientY - rect.top) / rect.height) * 520,
      560,
      520,
    );
    act(() =>
      setViewport((value) =>
        panViewport(
          value,
          center.centerX - value.centerX,
          center.centerY - value.centerY,
        ),
      ),
    );
  };
  const keyViewport = (event: ReactKeyboardEvent<SVGRectElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-0.25, 0],
      ArrowRight: [0.25, 0],
      ArrowUp: [0, 0.25],
      ArrowDown: [0, -0.25],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    pan(move[0], move[1]);
  };
  const range = (min: number, max: number) =>
    `[${min.toFixed(2).replace(/\.00$/, "")}, ${max.toFixed(2).replace(/\.00$/, "")}]`;

  return (
    <section
      className="zp49-page"
      data-testid="2d-graphing-mockup-0141"
      data-dedicated-lesson="49"
      data-object-model="bounded-independent-viewport-center-and-scale-real-zoom-and-two-axis-pan-pointer-keyboard-draggable-viewport-synchronized-main-zoomed-overview-graphs-reset-and-navigation"
      data-center-x={viewport.centerX}
      data-center-y={viewport.centerY}
      data-width={viewport.width}
      data-height={viewport.height}
      data-actions={actions}
    >
      <nav className="zp49-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>49 Zoom And Pan</b>
      </nav>
      <header className="zp49-hero">
        <small>
          <b>INTERACTION + VISUALIZATION</b>
          <b>PRIMARY CONTROL</b>
          <b>FUNCTION</b>
        </small>
        <h1>Zoom and Pan</h1>
        <p>Inspect graphs at different scales.</p>
        <aside>
          <strong>f(x) = 0.25x³ − x</strong>
          <span>Same equation, different view</span>
        </aside>
      </header>
      <section className="zp49-workspace">
        <main className="zp49-main">
          <header>
            <h2>Viewport</h2>
            <span>x:{range(bounds.xMin, bounds.xMax)}</span>
            <span>y:{range(bounds.yMin, bounds.yMax)}</span>
          </header>
          <div>
            <GraphPane
              bounds={ZOOM_PAN_OVERVIEW}
              width={560}
              height={520}
              rectangle
              viewport={viewport}
              interactive
              onPointer={dragViewport}
              onKey={keyViewport}
              label="Overview graph with draggable current viewport"
            />
            <button
              className="left"
              aria-label="Pan viewport left"
              onClick={() => pan(-0.5, 0)}
            >
              <ArrowLeft />
            </button>
            <button
              className="right"
              aria-label="Pan viewport right"
              onClick={() => pan(0.5, 0)}
            >
              <ArrowRight />
            </button>
            <button
              className="up"
              aria-label="Pan viewport up"
              onClick={() => pan(0, 0.5)}
            >
              <ArrowUp />
            </button>
            <button
              className="down"
              aria-label="Pan viewport down"
              onClick={() => pan(0, -0.5)}
            >
              <ArrowDown />
            </button>
          </div>
        </main>
        <section className="zp49-previews">
          <article>
            <header>
              <h2>Zoomed region</h2>
              <span>x:{range(bounds.xMin, bounds.xMax)}</span>
              <span>y:{range(bounds.yMin, bounds.yMax)}</span>
            </header>
            <GraphPane
              bounds={bounds}
              width={320}
              height={230}
              viewport={viewport}
              label="Current zoomed graph region"
            />
          </article>
          <article>
            <h2>Overview</h2>
            <GraphPane
              bounds={ZOOM_PAN_OVERVIEW}
              width={320}
              height={200}
              rectangle
              viewport={viewport}
              label="Full graph overview and current viewport"
            />
          </article>
        </section>
        <aside className="zp49-controls">
          <h2>Zoom</h2>
          <button onClick={() => zoom("in")}>
            <ZoomIn />
            Zoom in
          </button>
          <button onClick={() => zoom("out")}>
            <ZoomOut />
            Zoom out
          </button>
          <hr />
          <h2>Pan</h2>
          <label>
            Pan X{" "}
            <button aria-label="Pan X left" onClick={() => pan(-0.5, 0)}>
              <ArrowLeft />
            </button>
            <output>{viewport.centerX.toFixed(1)}</output>
            <button aria-label="Pan X right" onClick={() => pan(0.5, 0)}>
              <ArrowRight />
            </button>
          </label>
          <label>
            Pan Y{" "}
            <button aria-label="Pan Y up" onClick={() => pan(0, 0.5)}>
              <ArrowUp />
            </button>
            <output>{viewport.centerY.toFixed(1)}</output>
            <button aria-label="Pan Y down" onClick={() => pan(0, -0.5)}>
              <ArrowDown />
            </button>
          </label>
          <hr />
          <h2>Reset</h2>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset view
          </button>
          <article>
            <Lightbulb />
            <div>
              <b>Same equation, different view</b>
              <p>Zoom and pan change what you see, not the equation.</p>
              <strong>f(x) = 0.25x³ − x</strong>
              <p>The equation stays the same.</p>
            </div>
          </article>
        </aside>
      </section>
      <p className="zp49-note">
        ⓘ Use zoom to focus in or out. Use pan to move the view. The purple
        rectangle shows the current viewport on the graph and in the overview.
      </p>
      <nav className="zp49-adjacent">
        <a href="/lessons/graphs-and-functions/48-trace-mode">
          ←{" "}
          <span>
            PREVIOUS<b>Trace Mode</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/50-axis-controls">
          <span>
            NEXT<b>Axis Controls</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
