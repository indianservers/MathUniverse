import { ExternalLink, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  PARAMETRIC_TABLE_TIMES,
  clampParametricRadius,
  clampParametricTime,
  formatParametricTime,
  lissajousPath,
  parametricGraphPosition,
  parametricPath,
  parametricPoint,
  parametricVelocity,
  timeFromGraphPosition,
} from "./parametricCurvesLesson43Model";
import "./ParametricCurvesTargetLesson43.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

const tabs = ["Interactive", "Explain", "Examples", "Formulas", "Know more"];

export default function ParametricCurvesTargetLesson43({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(3),
    [b, setB] = useState(2),
    [t, setT] = useState(Math.PI * 1.2);
  const [speedFactor, setSpeedFactor] = useState(1),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState(tabs[0]),
    [actions, setActions] = useState(0);
  const point = useMemo(() => parametricPoint(a, b, t), [a, b, t]);
  const velocity = useMemo(() => parametricVelocity(a, b, t), [a, b, t]);
  const position = parametricGraphPosition(point);
  const reset = () => {
    setA(3);
    setB(2);
    setT(Math.PI * 1.2);
    setSpeedFactor(1);
    setPlaying(false);
    setTab(tabs[0]);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setT((value) => clampParametricTime(value + 0.025 * speedFactor)),
      32,
    );
    return () => window.clearInterval(timer);
  }, [playing, speedFactor]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeT = (value: number) =>
    act(() => setT(clampParametricTime(value)));
  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeT(
      timeFromGraphPosition(
        ((event.clientX - rect.left) / rect.width) * 730,
        ((event.clientY - rect.top) / rect.height) * 580,
        a,
        b,
      ),
    );
  };
  const keyPoint = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (
      !["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(event.key)
    )
      return;
    event.preventDefault();
    changeT(
      t +
        (event.key === "ArrowLeft" || event.key === "ArrowDown" ? -0.05 : 0.05),
    );
  };

  return (
    <section
      className="pc43-page"
      data-testid="2d-graphing-mockup-0135"
      data-dedicated-lesson="43"
      data-object-model="editable-parametric-radii-time-and-animation-speed-pointer-keyboard-draggable-particle-generated-primary-and-lissajous-paths-live-velocity-table-and-navigation"
      data-a={a}
      data-b={b}
      data-t={t}
      data-playing={playing}
      data-actions={actions}
    >
      <nav className="pc43-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>43 Parametric Curves</b>
      </nav>
      <header className="pc43-hero">
        <div>
          <h1>Parametric Curves</h1>
          <p>Explore time- or parameter-driven paths.</p>
        </div>
        <nav>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `x=${a}cos(t), y=${b}sin(t), t=${formatParametricTime(t)}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/graphing-calculator">
            <ExternalLink />
            Graphing Calculator
          </a>
        </nav>
      </header>
      <nav className="pc43-tabs">
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
      <section className="pc43-summary">
        <b>● &nbsp; x = {a}cos(t)</b>
        <b>● &nbsp; y = {b}sin(t)</b>
        <strong>◷ &nbsp; t = {formatParametricTime(t)}</strong>
        <span>
          ○ particle position
          <br />⟶ direction of motion
        </span>
        <p>
          ⓘ t controls motion,
          <br />
          not an axis
        </p>
      </section>
      <section className="pc43-workspace">
        <main className="pc43-graph">
          <svg
            viewBox="0 0 730 580"
            role="img"
            aria-label="Parametric ellipse and comparison Lissajous curve"
          >
            <defs>
              <pattern
                id="pc43-grid"
                width="41"
                height="56"
                patternUnits="userSpaceOnUse"
              >
                <path d="M41 0H0V56" fill="none" stroke="#dfe8f2" />
              </pattern>
              <marker
                id="pc43-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0 0L8 4L0 8Z" fill="#069cae" />
              </marker>
            </defs>
            <rect width="730" height="580" fill="url(#pc43-grid)" />
            <line x1="30" x2="700" y1="290" y2="290" className="axis" />
            <line x1="365" x2="365" y1="555" y2="20" className="axis" />
            <polyline points={lissajousPath(a, b)} className="comparison" />
            <polyline points={parametricPath(a, b)} className="primary" />
            <line
              x1={position.x}
              y1={position.y}
              x2={position.x + (velocity.dx / velocity.speed) * 45}
              y2={position.y - (velocity.dy / velocity.speed) * 45}
              className="direction"
              markerEnd="url(#pc43-arrow)"
            />
            <circle
              aria-label="Drag parametric particle"
              tabIndex={0}
              cx={position.x}
              cy={position.y}
              r="10"
              className="particle"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={dragPoint}
              onKeyDown={keyPoint}
            />
          </svg>
          <footer>
            <span>
              ━━ Primary path
              <br />
              <small>
                x = {a}cos(t), y = {b}sin(t)
              </small>
            </span>
            <span>
              ┅┅ Comparison (Lissajous)
              <br />
              <small>
                x = {a}sin(2t), y = {b}sin(3t)
              </small>
            </span>
          </footer>
          <output>
            Current position (x(t), y(t)) <b>x = {point.x.toFixed(4)}</b>
            <b>y = {point.y.toFixed(4)}</b>
          </output>
        </main>
        <aside className="pc43-controls">
          <section>
            <h2>
              Time (t)<b>t = {formatParametricTime(t)} rad</b>
            </h2>
            <label>
              <input
                aria-label="Parametric time"
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.01"
                value={t}
                onChange={(event) => changeT(Number(event.target.value))}
              />
              <small>
                <span>0</span>
                <span>π</span>
                <span>2π</span>
              </small>
            </label>
          </section>
          <section>
            <h2>
              x radius (a)<b>a = {a}</b>
            </h2>
            <label>
              <input
                aria-label="x radius"
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={a}
                onChange={(event) =>
                  act(() =>
                    setA(clampParametricRadius(Number(event.target.value))),
                  )
                }
              />
              <small>
                <span>1</span>
                <span>5</span>
              </small>
            </label>
            <input
              aria-label="x radius value"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={a}
              onChange={(event) =>
                act(() =>
                  setA(clampParametricRadius(Number(event.target.value))),
                )
              }
            />
          </section>
          <section>
            <h2>
              y radius (b)<b>b = {b}</b>
            </h2>
            <label>
              <input
                aria-label="y radius"
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={b}
                onChange={(event) =>
                  act(() =>
                    setB(clampParametricRadius(Number(event.target.value))),
                  )
                }
              />
              <small>
                <span>1</span>
                <span>5</span>
              </small>
            </label>
            <input
              aria-label="y radius value"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={b}
              onChange={(event) =>
                act(() =>
                  setB(clampParametricRadius(Number(event.target.value))),
                )
              }
            />
          </section>
          <section>
            <h2>
              Speed<b>{speedFactor.toFixed(1)}x</b>
            </h2>
            <label>
              <input
                aria-label="Animation speed"
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={speedFactor}
                onChange={(event) =>
                  act(() => setSpeedFactor(Number(event.target.value)))
                }
              />
              <small>
                <span>0.25x</span>
                <span>1x</span>
                <span>2x</span>
                <span>4x</span>
              </small>
            </label>
            <button
              className="pc43-play"
              onClick={() => act(() => setPlaying((value) => !value))}
            >
              {playing ? <Pause /> : <Play />}
              {playing ? "Pause motion" : "Play motion"}
            </button>
          </section>
          <section className="pc43-table">
            <h2>Values table</h2>
            <table>
              <thead>
                <tr>
                  <th>t (rad)</th>
                  <th>x(t) = {a}cos(t)</th>
                  <th>y(t) = {b}sin(t)</th>
                </tr>
              </thead>
              <tbody>
                {[...PARAMETRIC_TABLE_TIMES, t].map((time, index) => {
                  const value = parametricPoint(a, b, time);
                  return (
                    <tr
                      key={`${time}-${index}`}
                      className={index === 4 ? "active" : ""}
                    >
                      <td>
                        {index === 4
                          ? formatParametricTime(time)
                          : ["0", "π/2", "π", "3π/2"][index]}
                      </td>
                      <td>{value.x.toFixed(4)}</td>
                      <td>{value.y.toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </aside>
      </section>
      <nav className="pc43-adjacent">
        <a href="/lessons/graphs-and-functions/42-inequality-grapher">
          ←{" "}
          <span>
            PREVIOUS<b>Inequality Grapher</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/44-polar-graphs">
          <span>
            NEXT<b>Polar Graphs</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={43} view={tab} onInteraction={onInteraction} />

    </section>
  );
}
