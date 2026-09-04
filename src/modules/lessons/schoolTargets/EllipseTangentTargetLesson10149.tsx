import { CheckCircle2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EllipseTangentTargetLesson10149.css";

export default function EllipseTangentTargetLesson10149({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(5),
    [b, setB] = useState(3),
    [degrees, setDegrees] = useState(60),
    [actions, setActions] = useState(0);
  const dragging = useRef(false),
    theta = (degrees * Math.PI) / 180,
    c = Math.sqrt(Math.max(0, a * a - b * b)),
    p = { x: a * Math.cos(theta), y: b * Math.sin(theta) };
  const xCoefficient = Math.cos(theta) / a,
    yCoefficient = Math.sin(theta) / b,
    slope = -xCoefficient / yCoefficient,
    normalSlope = Math.abs(slope) < 0.0001 ? Infinity : -1 / slope,
    xIntercept =
      Math.abs(Math.cos(theta)) < 0.0001 ? Infinity : a / Math.cos(theta),
    yIntercept =
      Math.abs(Math.sin(theta)) < 0.0001 ? Infinity : b / Math.sin(theta),
    verified = xCoefficient * p.x + yCoefficient * p.y;
  const graph = useMemo(() => {
    const W = 700,
      H = 430,
      scale = 47,
      sx = (x: number) => W * 0.42 + x * scale,
      sy = (y: number) => H * 0.5 - y * scale;
    return { W, H, scale, sx, sy };
  }, []);
  const updateA = (v: number) => {
      setA(Math.max(b + 0.1, Math.min(8, v)));
      setActions((x) => x + 1);
    },
    updateB = (v: number) => {
      setB(Math.max(1, Math.min(a - 0.1, v)));
      setActions((x) => x + 1);
    },
    updateDegrees = (v: number) => {
      setDegrees(Math.max(0, Math.min(180, v)));
      setActions((x) => x + 1);
    };
  const movePoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect(),
      x =
        (((event.clientX - box.left) * graph.W) / box.width - graph.W * 0.42) /
        graph.scale,
      y =
        (graph.H * 0.5 - ((event.clientY - box.top) * graph.H) / box.height) /
        graph.scale;
    updateDegrees(
      (Math.atan2(y / b, x / a) * 180) / Math.PI < 0
        ? 180
        : (Math.atan2(y / b, x / a) * 180) / Math.PI,
    );
  };
  const lineY = (x: number) =>
    Math.abs(yCoefficient) < 0.0001 ? 0 : (1 - xCoefficient * x) / yCoefficient;
  return (
    <section
      className="et10149-page"
      data-testid="school-mockup-0823"
      data-object-model="dedicated-ellipse-tangent-contact-engine"
      data-a={a.toFixed(2)}
      data-b={b.toFixed(2)}
      data-theta={degrees.toFixed(2)}
      data-point={`${p.x.toFixed(4)},${p.y.toFixed(4)}`}
      data-slope={Number.isFinite(slope) ? slope.toFixed(4) : "Infinity"}
      data-normal-slope={
        Number.isFinite(normalSlope) ? normalSlope.toFixed(4) : "Infinity"
      }
      data-x-intercept={
        Number.isFinite(xIntercept) ? xIntercept.toFixed(4) : "Infinity"
      }
      data-y-intercept={
        Number.isFinite(yIntercept) ? yIntercept.toFixed(4) : "Infinity"
      }
      data-verified={verified.toFixed(4)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Tangent to an Ellipse</h1>
        <p>
          Explore the tangent to the ellipse x²/a² + y²/b² = 1 at a point P(a
          cos θ, b sin θ). Move the slider to see the tangent, intercepts,
          slope, and constructions update live.
        </p>
      </header>
      <main>
        <aside className="et-controls">
          <h2>TANGENT EXPLORER</h2>
          <p>Ellipse</p>
          <div className="equation">x²/a² + y²/b² = 1</div>
          <div className="ab">
            <label>
              a
              <input
                aria-label="Ellipse semi-major axis a"
                type="number"
                min={b + 0.1}
                max="8"
                step=".1"
                value={a}
                onChange={(e) => updateA(Number(e.target.value))}
              />
            </label>
            <label>
              b
              <input
                aria-label="Ellipse semi-minor axis b"
                type="number"
                min="1"
                max={a - 0.1}
                step=".1"
                value={b}
                onChange={(e) => updateB(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="theta">
            Parameter θ <span>0°</span>
            <input
              aria-label="Ellipse tangent angle theta"
              type="range"
              min="0"
              max="180"
              step="1"
              value={degrees}
              onInput={(e) => updateDegrees(Number(e.currentTarget.value))}
              onChange={(e) => setDegrees(Number(e.target.value))}
            />
            <span>180°</span>
            <output>θ = {degrees.toFixed(0)}°</output>
          </label>
          <article>
            <p>Tangent at P(a cos θ,b sin θ)</p>
            <strong>
              ● P({p.x.toFixed(4)}, {p.y.toFixed(4)})
            </strong>
          </article>
          <article>
            <p>Tangent equation</p>
            <div>x cosθ/a + y sinθ/b = 1</div>
            <strong>
              {xCoefficient.toFixed(4)}x + {yCoefficient.toFixed(4)}y = 1
            </strong>
          </article>
          <article>
            <p>Local slope of tangent</p>
            <div>
              -b cosθ/(a sinθ) ={" "}
              {Number.isFinite(slope) ? slope.toFixed(4) : "∞"}
            </div>
          </article>
          <article>
            <p>Intercepts</p>
            <div className="intercepts">
              <span>
                x-intercept
                <br />(
                {Number.isFinite(xIntercept) ? xIntercept.toFixed(4) : "∞"},0)
              </span>
              <span>
                y-intercept
                <br />
                (0,{Number.isFinite(yIntercept) ? yIntercept.toFixed(4) : "∞"})
              </span>
            </div>
          </article>
        </aside>
        <section className="et-board">
          <h2>ELLIPSE AND TANGENT</h2>
          <svg
            viewBox={`0 0 ${graph.W} ${graph.H}`}
            aria-label="Interactive ellipse tangent graph"
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
            {Array.from({ length: 21 }, (_, i) => i - 8).map((n) => (
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
            <ellipse
              className="ellipse"
              cx={graph.sx(0)}
              cy={graph.sy(0)}
              rx={a * graph.scale}
              ry={b * graph.scale}
            />
            <line
              className="radius"
              x1={graph.sx(0)}
              y1={graph.sy(0)}
              x2={graph.sx(p.x)}
              y2={graph.sy(p.y)}
            />
            {Math.abs(yCoefficient) > 0.0001 ? (
              <line
                className="tangent"
                x1={graph.sx(-8)}
                y1={graph.sy(lineY(-8))}
                x2={graph.sx(10)}
                y2={graph.sy(lineY(10))}
              />
            ) : (
              <line
                className="tangent"
                x1={graph.sx(xIntercept)}
                x2={graph.sx(xIntercept)}
                y1="0"
                y2={graph.H}
              />
            )}
            <circle
              className="focus"
              cx={graph.sx(-c)}
              cy={graph.sy(0)}
              r="5"
            />
            <circle className="focus" cx={graph.sx(c)} cy={graph.sy(0)} r="5" />
            <circle
              className="point"
              cx={graph.sx(p.x)}
              cy={graph.sy(p.y)}
              r="7"
            />
            <text
              className="point-label"
              x={graph.sx(p.x) + 10}
              y={graph.sy(p.y) - 10}
            >
              P(a cosθ,b sinθ)
            </text>
            <text
              className="t-label"
              x={graph.sx(6)}
              y={graph.sy(lineY(6)) - 9}
            >
              Tangent
            </text>
          </svg>
          <div className="legend">
            <span>● P(a cosθ,b sinθ)</span>
            <span>— Tangent</span>
            <span>-- Radius OP</span>
            <span>● Foci (±c,0)</span>
            <span>— Axes</span>
          </div>
          <div className="values">
            a={a}, b={b}, c=√(a²-b²)={c.toFixed(4)}
          </div>
        </section>
        <aside className="et-proof">
          <article>
            <h2>RADIUS-TO-TANGENT CONSTRUCTION</h2>
            <svg viewBox="0 0 300 190">
              <line className="mini-radius" x1="55" y1="140" x2="165" y2="80" />
              <line
                className="mini-tangent"
                x1="100"
                y1="15"
                x2="245"
                y2="160"
              />
              <circle cx="55" cy="140" r="5" />
              <circle className="mini-p" cx="165" cy="80" r="6" />
              <text x="35" y="160">
                O(0,0)
              </text>
              <text x="175" y="72">
                P(a cosθ,b sinθ)
              </text>
            </svg>
            <p>
              Tangent at P is perpendicular to the ellipse gradient direction.
            </p>
            <p>
              Its local slope is the negative reciprocal of the normal slope.
            </p>
          </article>
          <article>
            <h2>EQUATION VERIFIER</h2>
            <p>Substitute P into the tangent equation.</p>
            <p>x cosθ/a + y sinθ/b = 1</p>
            <p>
              cos²θ + sin²θ = {verified.toFixed(4)} <CheckCircle2 />
            </p>
            <small>Verified for all θ.</small>
          </article>
        </aside>
      </main>
      <section className="et-relations">
        <h2>KEY RELATIONS (at the current θ)</h2>
        <div>
          <article>
            <b>Point on ellipse</b>
            <p>
              P({p.x.toFixed(4)},{p.y.toFixed(4)})
            </p>
          </article>
          <article>
            <b>Tangent equation</b>
            <p>
              {xCoefficient.toFixed(4)}x + {yCoefficient.toFixed(4)}y = 1
            </p>
          </article>
          <article>
            <b>Intercepts</b>
            <p>
              ({Number.isFinite(xIntercept) ? xIntercept.toFixed(3) : "∞"},0),
              (0,{Number.isFinite(yIntercept) ? yIntercept.toFixed(3) : "∞"})
            </p>
          </article>
          <article>
            <b>Slope of tangent</b>
            <p>{Number.isFinite(slope) ? slope.toFixed(4) : "∞"}</p>
          </article>
          <article>
            <b>Normal at P</b>
            <p>
              slope=
              {Number.isFinite(normalSlope) ? normalSlope.toFixed(4) : "∞"}
            </p>
          </article>
        </div>
      </section>
    </section>
  );
}
