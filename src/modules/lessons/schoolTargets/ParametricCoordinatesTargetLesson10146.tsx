import {
  CirclePause,
  CirclePlay,
  Lightbulb,
  RotateCcw,
  StepBack,
  StepForward,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParametricCoordinatesTargetLesson10146.css";

type Curve = "parabola" | "ellipse" | "hyperbola";
const limits: Record<Curve, [number, number]> = {
  parabola: [-4, 4],
  ellipse: [-Math.PI, Math.PI],
  hyperbola: [-1.25, 1.25],
};

export default function ParametricCoordinatesTargetLesson10146({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [curve, setCurve] = useState<Curve>("parabola");
  const [t, setT] = useState(1.6);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [actions, setActions] = useState(0);
  const dragging = useRef(false);
  const a = curve === "ellipse" ? 5 : 2,
    b = 3;
  const point =
    curve === "parabola"
      ? { x: a * t * t, y: 2 * a * t }
      : curve === "ellipse"
        ? { x: a * Math.cos(t), y: b * Math.sin(t) }
        : { x: a / Math.cos(t), y: b * Math.tan(t) };
  const [min, max] = limits[curve];
  const labels = {
    parabola: {
      name: "Parabola",
      formula: "P(at², 2at)",
      equation: "y² = 4ax",
    },
    ellipse: {
      name: "Ellipse",
      formula: "P(a cos θ, b sin θ)",
      equation: "x²/a² + y²/b² = 1",
    },
    hyperbola: {
      name: "Hyperbola",
      formula: "P(a sec θ, b tan θ)",
      equation: "x²/a² − y²/b² = 1",
    },
  }[curve];
  const graph = useMemo(() => {
    const W = 690,
      H = 410,
      scale = 27 * zoom,
      sx = (x: number) => W / 2 + x * scale,
      sy = (y: number) => H / 2 - y * scale;
    const domain = limits[curve];
    let pen = false;
    const path = Array.from(
      { length: 401 },
      (_, i) => domain[0] + (i * (domain[1] - domain[0])) / 400,
    )
      .map((q) => {
        const p =
          curve === "parabola"
            ? { x: a * q * q, y: 2 * a * q }
            : curve === "ellipse"
              ? { x: a * Math.cos(q), y: b * Math.sin(q) }
              : { x: a / Math.cos(q), y: b * Math.tan(q) };
        if (Math.abs(p.x) > 13 || Math.abs(p.y) > 9) {
          pen = false;
          return "";
        }
        const command = pen ? "L" : "M";
        pen = true;
        return `${command}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`;
      })
      .join(" ");
    return { W, H, scale, sx, sy, path };
  }, [a, b, curve, zoom]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setT((value) => (value >= max ? min : Math.min(max, value + 0.04))),
      55,
    );
    return () => window.clearInterval(timer);
  }, [max, min, playing]);
  const chooseCurve = (next: Curve) => {
    setCurve(next);
    setT(next === "parabola" ? 1.6 : next === "ellipse" ? 0.7 : 0.55);
    setPlaying(false);
    setZoom(1);
    setActions((v) => v + 1);
  };
  const updateT = (value: number) => {
    setT(Math.max(min, Math.min(max, value)));
    setActions((v) => v + 1);
  };
  const movePoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x =
      (((event.clientX - box.left) * graph.W) / box.width - graph.W / 2) /
      graph.scale;
    const y =
      (graph.H / 2 - ((event.clientY - box.top) * graph.H) / box.height) /
      graph.scale;
    const next =
      curve === "parabola"
        ? y / (2 * a)
        : curve === "ellipse"
          ? Math.atan2(y / b, x / a)
          : Math.atan(y / b);
    updateT(next);
  };
  const reset = () => {
    setCurve("parabola");
    setT(1.6);
    setPlaying(false);
    setZoom(1);
    setActions((v) => v + 1);
  };

  return (
    <section
      className="pc10146-page"
      data-testid="school-mockup-0820"
      data-object-model="dedicated-three-conic-parametric-tracer-engine"
      data-curve={curve}
      data-t={t.toFixed(3)}
      data-point={`${point.x.toFixed(3)},${point.y.toFixed(3)}`}
      data-equation={labels.equation}
      data-playing={String(playing)}
      data-zoom={zoom.toFixed(2)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Parametric Coordinates</h1>
        <p>
          Parametric Coordinates is a school mathematics idea in Conic Sections.
          It helps students model data, functions, curves,
          <br />
          proofs, and 3D directions. We use related ideas in graphs, design,
          surveys, navigation, and measurement.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav aria-label="Conic parametrization">
        {(["parabola", "ellipse", "hyperbola"] as Curve[]).map((item) => (
          <button
            key={item}
            className={curve === item ? "active" : ""}
            onClick={() => chooseCurve(item)}
          >
            <b>{{ parabola: "⌒", ellipse: "◯", hyperbola: "⤢" }[item]}</b>
            <strong>
              {
                {
                  parabola: "Parabola",
                  ellipse: "Ellipse",
                  hyperbola: "Hyperbola",
                }[item]
              }
            </strong>
            <span>
              {
                {
                  parabola: "P(at², 2at)",
                  ellipse: "P(a cos θ, b sin θ)",
                  hyperbola: "P(a sec θ, b tan θ)",
                }[item]
              }
            </span>
          </button>
        ))}
      </nav>
      <main>
        <aside className="pc-controls">
          <article>
            <p>
              <b>PARAMETER</b>
              <strong>t = {t.toFixed(3)}</strong>
            </p>
            <input
              aria-label="Parameter t"
              type="range"
              min={min}
              max={max}
              step="0.01"
              value={t}
              onInput={(e) => updateT(Number(e.currentTarget.value))}
              onChange={(e) => setT(Number(e.target.value))}
            />
            <div>
              <span>{min.toFixed(3)}</span>
              <span>{max.toFixed(3)}</span>
            </div>
            <section>
              <button onClick={() => setPlaying((v) => !v)}>
                {playing ? <CirclePause /> : <CirclePlay />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                aria-label="Step parameter backward"
                onClick={() => updateT(t - 0.1)}
              >
                <StepBack />
              </button>
              <button
                aria-label="Pause animation"
                onClick={() => setPlaying(false)}
              >
                <CirclePause />
              </button>
              <button
                aria-label="Step parameter forward"
                onClick={() => updateT(t + 0.1)}
              >
                <StepForward />
              </button>
              <button
                aria-label="Reset parameter"
                onClick={() =>
                  updateT(
                    curve === "parabola"
                      ? 1.6
                      : curve === "ellipse"
                        ? 0.7
                        : 0.55,
                  )
                }
              >
                <RotateCcw />
              </button>
            </section>
          </article>
          <article className="pc-values">
            <h2>PARAMETERS (exact)</h2>
            <p>
              a = {a} <small>(constant)</small>
            </p>
            {curve !== "parabola" && (
              <p>
                b = {b} <small>(constant)</small>
              </p>
            )}
            <h2>CURRENT POINT</h2>
            <p>P = {labels.formula}</p>
            <p>
              = ({point.x.toFixed(3)}, {point.y.toFixed(3)})
            </p>
            <div>
              <span className="trail">Locus trail</span>
              <span className="dot">Point P</span>
              <span className="xproj">Projection to x-axis</span>
              <span className="yproj">Projection to y-axis</span>
            </div>
          </article>
        </aside>
        <section className="pc-board">
          <div className="equation">
            Equation: <strong>{labels.equation}</strong>
          </div>
          <svg
            viewBox={`0 0 ${graph.W} ${graph.H}`}
            aria-label="Interactive parametric conic graph"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              movePoint(e);
            }}
            onPointerMove={(e) => {
              if (dragging.current && e.buttons === 1) movePoint(e);
            }}
            onPointerUp={(e) => {
              dragging.current = false;
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
          >
            {Array.from({ length: 25 }, (_, i) => i - 12).map((n) => (
              <g key={n}>
                <line
                  className="gridline"
                  x1={graph.sx(n)}
                  x2={graph.sx(n)}
                  y1="0"
                  y2={graph.H}
                />
                <line
                  className="gridline"
                  x1="0"
                  x2={graph.W}
                  y1={graph.sy(n)}
                  y2={graph.sy(n)}
                />
              </g>
            ))}
            <line
              className="axis"
              x1="0"
              x2={graph.W}
              y1={graph.sy(0)}
              y2={graph.sy(0)}
            />
            <line
              className="axis"
              x1={graph.sx(0)}
              x2={graph.sx(0)}
              y1="0"
              y2={graph.H}
            />
            <path className="curve" d={graph.path} />
            <line
              className="x-projection"
              x1={graph.sx(point.x)}
              x2={graph.sx(point.x)}
              y1={graph.sy(point.y)}
              y2={graph.sy(0)}
            />
            <line
              className="y-projection"
              x1={graph.sx(point.x)}
              x2={graph.sx(0)}
              y1={graph.sy(point.y)}
              y2={graph.sy(point.y)}
            />
            <circle
              className="projection"
              cx={graph.sx(point.x)}
              cy={graph.sy(0)}
              r="5"
            />
            <circle
              className="point"
              cx={graph.sx(point.x)}
              cy={graph.sy(point.y)}
              r="7"
            />
            <text x={graph.sx(point.x) + 10} y={graph.sy(point.y) - 10}>
              P({point.x.toFixed(2)}, {point.y.toFixed(2)})
            </text>
          </svg>
          <footer>
            <button onClick={() => setZoom((v) => Math.min(1.6, v + 0.15))}>
              <ZoomIn /> Zoom in
            </button>
            <button onClick={() => setZoom((v) => Math.max(0.65, v - 0.15))}>
              <ZoomOut /> Zoom out
            </button>
            <button onClick={() => setZoom(1)}>
              <RotateCcw /> Fit
            </button>
          </footer>
        </section>
        <aside className="pc-proof">
          <article>
            <h2>DERIVATION (substitution)</h2>
            <span className="verified">✓ Verified</span>
            <h3>Given: {labels.equation}</h3>
            <p>
              Let {labels.formula}. Substitute the generated x and y coordinates
              into the Cartesian equation.
            </p>
            <div>
              {curve === "parabola" ? (
                <>
                  <p>y² = (2at)² = 4a²t²</p>
                  <p>4ax = 4a(at²) = 4a²t²</p>
                </>
              ) : curve === "ellipse" ? (
                <>
                  <p>x²/a² = cos² t</p>
                  <p>y²/b² = sin² t</p>
                  <p>cos² t + sin² t = 1</p>
                </>
              ) : (
                <>
                  <p>x²/a² = sec² t</p>
                  <p>y²/b² = tan² t</p>
                  <p>sec² t − tan² t = 1</p>
                </>
              )}
              <strong>Thus, {labels.equation} ✓</strong>
            </div>
          </article>
          <article>
            <h2>ABOUT THIS PARAMETRIZATION</h2>
            <p>✓ Every valid parameter produces a point on the curve.</p>
            <p>✓ Changing t traces the locus continuously.</p>
            <p>✓ The coordinate projections update with P.</p>
            <p>✓ The Cartesian equation is satisfied identically.</p>
          </article>
        </aside>
      </main>
      <footer>
        <Lightbulb />
        <p>
          <b>Insight:</b> Changing t moves P along the curve. The projections
          drop perpendiculars to the axes. The locus trail shows the path of P.
        </p>
        <button onClick={reset}>Reset all</button>
      </footer>
    </section>
  );
}
