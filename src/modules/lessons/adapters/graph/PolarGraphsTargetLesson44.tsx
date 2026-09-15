import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  clampPetalMultiplier,
  clampPolarAngle,
  clampPolarScale,
  polarAngleFromPixels,
  polarGraphPosition,
  polarPetalCount,
  polarReferencePath,
  polarRosePath,
  polarRosePoint,
} from "./polarGraphsLesson44Model";
import "./PolarGraphsTargetLesson44.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

export default function PolarGraphsTargetLesson44({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [angle, setAngle] = useState(40),
    [a, setA] = useState(4),
    [n, setN] = useState(3),
    [language, setLanguage] = useState("en"),
    [actions, setActions] = useState(0);
  const point = useMemo(() => polarRosePoint(a, n, angle), [a, n, angle]);
  const position = polarGraphPosition(a, point);
  const rayEnd = polarGraphPosition(a, {
    x: Math.max(5, a) * Math.cos(point.theta),
    y: Math.max(5, a) * Math.sin(point.theta),
  });
  const reset = () => {
    setAngle(40);
    setA(4);
    setN(3);
    setLanguage("en");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeAngle = (value: number) =>
    act(() => setAngle(clampPolarAngle(value)));
  const dragAngle = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeAngle(
      polarAngleFromPixels(
        ((event.clientX - rect.left) / rect.width) * 700,
        ((event.clientY - rect.top) / rect.height) * 600,
      ),
    );
  };
  const keyAngle = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (
      !["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(event.key)
    )
      return;
    event.preventDefault();
    changeAngle(
      angle + (event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1),
    );
  };

  return (
    <section
      className="pg44-page"
      data-testid="2d-graphing-mockup-0136"
      data-dedicated-lesson="44"
      data-object-model="editable-polar-angle-radius-scale-and-integer-petal-multiplier-pointer-keyboard-draggable-ray-generated-rose-and-reference-paths-live-radius-cartesian-conversion-petal-count-language-reset-share-and-navigation"
      data-angle={angle}
      data-radius={point.radius}
      data-petals={polarPetalCount(n)}
      data-language={language}
      data-actions={actions}
    >
      <nav className="pg44-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>44 Polar Graphs</b>
      </nav>
      <header className="pg44-hero">
        <h1>Polar Graphs</h1>
        <p>Explore radius-angle relationships.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
          <select
            aria-label="Polar graphs language"
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
                  `r = ${a}sin(${n}θ), θ = ${angle}°, r = ${point.radius.toFixed(3)}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
        </nav>
      </header>
      <section className="pg44-workspace">
        <main className="pg44-graph">
          <h2>EQUATION</h2>
          <strong>
            r = {a} sin({n}θ)
          </strong>
          <svg
            viewBox="0 0 700 600"
            role="img"
            aria-label="Polar rose graph with draggable angle and radius point"
          >
            <g className="polar-grid">
              {[46, 92, 138, 184, 230].map((radius, index) => (
                <g key={radius}>
                  <circle cx="350" cy="300" r={radius} />
                  <text x="352" y={300 - radius + 4}>
                    {index + 1}
                  </text>
                </g>
              ))}
              {Array.from({ length: 12 }, (_, index) => {
                const degree = index * 30,
                  radians = (degree * Math.PI) / 180,
                  x = 350 + 245 * Math.cos(radians),
                  y = 300 - 245 * Math.sin(radians);
                return (
                  <g key={degree}>
                    <line x1="350" y1="300" x2={x} y2={y} />
                    <text
                      x={350 + 266 * Math.cos(radians)}
                      y={304 - 266 * Math.sin(radians)}
                      textAnchor="middle"
                    >
                      {degree}°
                    </text>
                  </g>
                );
              })}
            </g>
            <polyline points={polarReferencePath(a)} className="reference" />
            <polyline points={polarRosePath(a, n)} className="rose" />
            <line
              x1="350"
              y1="300"
              x2={rayEnd.x}
              y2={rayEnd.y}
              className="angle-ray"
            />
            <line
              x1="350"
              y1="300"
              x2={position.x}
              y2={position.y}
              className="radius-line"
            />
            <circle cx="350" cy="300" r="7" className="pole" />
            <text x="305" y="335" className="pole-label">
              Pole
            </text>
            <circle
              aria-label="Drag polar angle"
              tabIndex={0}
              cx={position.x}
              cy={position.y}
              r="10"
              className="polar-point"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={dragAngle}
              onKeyDown={keyAngle}
            />
            <g
              className="theta-label"
              transform={`translate(${rayEnd.x - 54} ${rayEnd.y - 35})`}
            >
              <rect width="108" height="38" rx="6" />
              <text x="54" y="25" textAnchor="middle">
                θ = {angle}°
              </text>
            </g>
            <g
              className="radius-label"
              transform={`translate(${(350 + position.x) / 2 - 45} ${(300 + position.y) / 2 - 35})`}
            >
              <rect width="90" height="36" rx="6" />
              <text x="45" y="24" textAnchor="middle">
                r = {point.radius.toFixed(2)}
              </text>
            </g>
          </svg>
          <footer>
            <span>
              ━━ r = {a} sin({n}θ)
            </span>
            <span>
              ┅┅ r = 2 + cos(θ)<small>(reference)</small>
            </span>
            <b>
              Petal count<strong>{polarPetalCount(n)}</strong>
              <small>
                ({n % 2 ? "n is odd → n petals" : "n is even → 2n petals"})
              </small>
            </b>
          </footer>
        </main>
        <aside className="pg44-controls">
          <h2>CONTROLS</h2>
          <label>
            <b>
              θ (angle)<output>{angle}°</output>
            </b>
            <input
              aria-label="Polar angle"
              type="range"
              min="0"
              max="359"
              value={angle}
              onChange={(event) => changeAngle(Number(event.target.value))}
            />
            <small>
              <span>0°</span>
              <span>180°</span>
              <span>360°</span>
            </small>
          </label>
          <label>
            <b>
              Radius scale (a)<output>{a}</output>
            </b>
            <input
              aria-label="Radius scale"
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={a}
              onChange={(event) =>
                act(() => setA(clampPolarScale(Number(event.target.value))))
              }
            />
            <small>
              <span>1</span>
              <span>10</span>
            </small>
          </label>
          <label>
            <b>
              Petal multiplier (n)<output>{n}</output>
            </b>
            <input
              aria-label="Petal multiplier"
              type="range"
              min="1"
              max="10"
              step="1"
              value={n}
              onChange={(event) =>
                act(() =>
                  setN(clampPetalMultiplier(Number(event.target.value))),
                )
              }
            />
            <small>
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </small>
          </label>
          <section>
            <h3>Live values at θ = {angle}°</h3>
            <p>
              r <b>{point.radius.toFixed(3)}</b>
            </p>
            <p>
              (x, y){" "}
              <b>
                ({point.x.toFixed(3)}, {point.y.toFixed(3)})
              </b>
            </p>
          </section>
          <article>
            Angle first, radius next.
            <br />
            Move θ, then read r.<strong>r = a sin(nθ)</strong>
          </article>
        </aside>
      </section>
      <section className="pg44-lessons">
        <article>
          <b>◎</b>
          <span>
            <h2>Angle first, radius next</h2>Choose an angle θ, then measure the
            radius r from the pole.
          </span>
        </article>
        <article>
          <b>▱</b>
          <span>
            <h2>Polar coordinates</h2>A point is determined by (r, θ), not (x,
            y) first.
          </span>
        </article>
        <article>
          <b>⌕</b>
          <span>
            <h2>Cartesian check</h2>See the equivalent (x, y) update in real
            time.
          </span>
        </article>
      </section>
      <nav className="pg44-adjacent">
        <a href="/lessons/graphs-and-functions/43-parametric-curves">
          ←{" "}
          <span>
            PREVIOUS<b>Parametric Curves</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/45-point-plotter">
          <span>
            NEXT<b>Point Plotter</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={44} alwaysVisible onInteraction={onInteraction} />

    </section>
  );
}
