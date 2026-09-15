import { RotateCcw, Scan, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  CUBICS_54,
  FIT_BOUNDS_54,
  INSPECT_BOUNDS_54,
  averageRate54,
  criticalPoints54,
  cubicDerivative54,
  cubicSecondDerivative54,
  cubicValue54,
  formatNumber54,
  graphPath54,
  graphPoint54,
  roots54,
  xFromPixel54,
} from "./graphInspectorLesson54Model";
import "./GraphInspectorTargetLesson54.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

export default function GraphInspectorTargetLesson54({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [cubicId, setCubicId] = useState("c1");
  const [selectedX, setSelectedX] = useState(1.2);
  const [fit, setFit] = useState(false);
  const [actions, setActions] = useState(0);
  const cubic = CUBICS_54.find((item) => item.id === cubicId) ?? CUBICS_54[0];
  const bounds = fit ? FIT_BOUNDS_54 : INSPECT_BOUNDS_54;
  const width = 720;
  const height = 560;
  const origin = graphPoint54({ x: 0, y: 0 }, bounds, width, height);
  const selectedY = cubicValue54(cubic, selectedX);
  const slope = cubicDerivative54(cubic, selectedX);
  const selected = graphPoint54(
    { x: selectedX, y: selectedY },
    bounds,
    width,
    height,
  );
  const roots = roots54(cubic);
  const extrema = criticalPoints54(cubic);
  const increasing = slope > 0;

  const reset = () => {
    setCubicId("c1");
    setSelectedX(1.2);
    setFit(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeX = (value: number) =>
    act(() =>
      setSelectedX(Math.max(bounds.xMin, Math.min(bounds.xMax, value))),
    );
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeX(
      xFromPixel54(
        ((event.clientX - rect.left) / rect.width) * width,
        bounds,
        width,
      ),
    );
  };
  const key = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    changeX(selectedX + (event.key === "ArrowLeft" ? -0.05 : 0.05));
  };
  const intervalEdge = extrema.length ? Math.abs(extrema[0].x) : 0;

  return (
    <section
      className="gi54-page"
      data-testid="2d-graphing-mockup-0146"
      data-dedicated-lesson="54"
      data-object-model="selectable-cubic-generated-curve-numerically-solved-roots-analytical-extrema-pointer-keyboard-draggable-inspection-probe-live-value-first-and-second-derivatives-monotonicity-average-rate-concavity-fit-reset-share-and-navigation"
      data-x={selectedX.toFixed(2)}
      data-y={selectedY.toFixed(3)}
      data-slope={slope.toFixed(3)}
      data-actions={actions}
    >
      <nav className="gi54-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>54 Graph Inspector</b>
      </nav>
      <header className="gi54-hero">
        <h1>Graph Inspector</h1>
        <p>Read local and global graph properties.</p>
        <section>
          <label>
            Function
            <select
              aria-label="Inspector function"
              value={cubicId}
              onChange={(event) => act(() => setCubicId(event.target.value))}
            >
              {CUBICS_54.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <b className="gi54-curve-key">
            Selected curve <i />
          </b>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            className={fit ? "active" : ""}
            onClick={() => act(() => setFit((value) => !value))}
          >
            <Scan />
            Fit View
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `${cubic.label}; x=${selectedX}; y=${selectedY}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
        </section>
      </header>

      <section className="gi54-workspace">
        <main>
          <article className="gi54-graph">
            <header>
              <i />
              {cubic.label}
            </header>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label="Cubic graph with draggable inspection cursor"
            >
              <defs>
                <pattern
                  id="gi54-grid"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M28 0H0V28" fill="none" stroke="#dfe8f2" />
                </pattern>
              </defs>
              <rect width={width} height={height} fill="url(#gi54-grid)" />
              {extrema.length === 2 && (
                <>
                  <rect
                    className="increasing-band"
                    x="0"
                    y="0"
                    width={graphPoint54(extrema[0], bounds, width, height).x}
                    height={height}
                  />
                  <rect
                    className="decreasing-band"
                    x={graphPoint54(extrema[0], bounds, width, height).x}
                    y="0"
                    width={
                      graphPoint54(extrema[1], bounds, width, height).x -
                      graphPoint54(extrema[0], bounds, width, height).x
                    }
                    height={height}
                  />
                  <rect
                    className="increasing-band"
                    x={graphPoint54(extrema[1], bounds, width, height).x}
                    y="0"
                    width={
                      width - graphPoint54(extrema[1], bounds, width, height).x
                    }
                    height={height}
                  />
                </>
              )}
              <line
                className="axis"
                x1="0"
                x2={width}
                y1={origin.y}
                y2={origin.y}
              />
              <line
                className="axis"
                x1={origin.x}
                x2={origin.x}
                y1="0"
                y2={height}
              />
              <polyline
                className="curve"
                points={graphPath54(cubic, bounds, width, height)}
              />
              {roots.map((point, index) => {
                const mapped = graphPoint54(point, bounds, width, height);
                return (
                  <g key={index} className="root">
                    <circle cx={mapped.x} cy={mapped.y} r="6" />
                    <text x={mapped.x} y={mapped.y - 16} textAnchor="middle">
                      {formatNumber54(point.x)}
                    </text>
                  </g>
                );
              })}
              {extrema.map((point, index) => {
                const mapped = graphPoint54(point, bounds, width, height);
                return (
                  <g key={index} className="extreme">
                    <circle cx={mapped.x} cy={mapped.y} r="7" />
                    <text
                      x={mapped.x}
                      y={mapped.y + (index ? 28 : -18)}
                      textAnchor="middle"
                    >
                      {index ? "Local minimum" : "Local maximum"}{" "}
                      {formatNumber54(point.x)}, {formatNumber54(point.y)}
                    </text>
                  </g>
                );
              })}
              <line
                className="probe-line"
                x1={selected.x}
                x2={selected.x}
                y1="0"
                y2={height}
              />
              <circle
                aria-label="Drag graph inspector probe"
                tabIndex={0}
                className="probe"
                cx={selected.x}
                cy={selected.y}
                r="9"
                onPointerDown={(event) =>
                  event.currentTarget.setPointerCapture(event.pointerId)
                }
                onPointerMove={drag}
                onKeyDown={key}
              />
              <g
                className="probe-card"
                transform={`translate(${Math.min(width - 150, selected.x + 14)} ${Math.max(18, selected.y - 70)})`}
              >
                <rect width="140" height="64" rx="9" />
                <text x="12" y="20">
                  x = {formatNumber54(selectedX)}
                </text>
                <text x="12" y="39">
                  f(x) = {formatNumber54(selectedY)}
                </text>
                <text x="12" y="57">
                  f′(x) = {formatNumber54(slope)}
                </text>
              </g>
            </svg>
          </article>
          <section className="gi54-intervals">
            <article>
              <b>Increasing</b>
              <span>(-∞, -{formatNumber54(intervalEdge)})</span>
              <p>Derivative is positive.</p>
            </article>
            <article>
              <b>Decreasing</b>
              <span>
                (-{formatNumber54(intervalEdge)}, {formatNumber54(intervalEdge)}
                )
              </span>
              <p>Derivative is negative.</p>
            </article>
            <article>
              <b>Increasing</b>
              <span>({formatNumber54(intervalEdge)}, ∞)</span>
              <p>Derivative is positive.</p>
            </article>
          </section>
        </main>

        <aside className="gi54-facts">
          <h2>Selected curve facts</h2>
          <section>
            <b>
              Domain <span>(-∞, ∞)</span>
            </b>
            <b>
              Range <span>(-∞, ∞)</span>
            </b>
          </section>
          <section>
            <h3>Intercepts</h3>
            <p>
              x-intercepts{" "}
              <span>
                {roots
                  .map((point) => `(${formatNumber54(point.x)}, 0)`)
                  .join(", ")}
              </span>
            </p>
            <p>
              y-intercept <span>(0, {formatNumber54(cubic.c)})</span>
            </p>
          </section>
          <section>
            <h3>Extrema</h3>
            {extrema.map((point, index) => (
              <p key={index}>
                {index ? "minimum" : "maximum"}{" "}
                <span>
                  ({formatNumber54(point.x)}, {formatNumber54(point.y)})
                </span>
              </p>
            ))}
          </section>
          <section>
            <h3>Monotonicity</h3>
            <p>
              Selected point{" "}
              <span>{increasing ? "Increasing" : "Decreasing"}</span>
            </p>
          </section>
          <section className="selected">
            <h3>At x = {formatNumber54(selectedX)}</h3>
            <b>f′(x) = {formatNumber54(slope)}</b>
            <p>{increasing ? "Increasing" : "Decreasing"}</p>
          </section>
          <section>
            <h3>Average rate [-1, 1]</h3>
            <b>{formatNumber54(averageRate54(cubic))}</b>
          </section>
          <section>
            <h3>Concavity</h3>
            <p>
              {cubicSecondDerivative54(cubic, -1) > 0 ? "Up" : "Down"} on (-∞,
              0)
            </p>
            <p>
              {cubicSecondDerivative54(cubic, 1) > 0 ? "Up" : "Down"} on (0, ∞)
            </p>
          </section>
        </aside>
      </section>
      <nav className="gi54-adjacent">
        <a href="/lessons/graphs-and-functions/53-special-points">
          ←{" "}
          <span>
            PREVIOUS<b>Special Points</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/55-family-parameters">
          <span>
            NEXT<b>Graph Families</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={54} alwaysVisible onInteraction={onInteraction} />

    </section>
  );
}
