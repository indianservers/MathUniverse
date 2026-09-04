import { CheckCircle2, Info, Minus, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./HyperbolaTangentTargetLesson10150.css";

const clampTheta = (value: number) => {
  const v = Math.max(-2.6, Math.min(2.6, value));
  if (Math.abs(Math.cos(v)) < 0.08)
    return Math.sign(v || 1) * (Math.PI / 2 - 0.08);
  return v;
};
export default function HyperbolaTangentTargetLesson10150({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(3),
    [b, setB] = useState(2),
    [theta, setTheta] = useState(0.7),
    [actions, setActions] = useState(0);
  const dragging = useRef(false);
  const sec = 1 / Math.cos(theta),
    tan = Math.tan(theta),
    p = { x: a * sec, y: b * tan },
    xCoefficient = sec / a,
    yCoefficient = -tan / b,
    verified = xCoefficient * p.x + yCoefficient * p.y,
    slope = -xCoefficient / yCoefficient,
    xIntercept = 1 / xCoefficient,
    yIntercept = 1 / yCoefficient,
    branch = p.x >= 0 ? "Right" : "Left";
  const graph = useMemo(() => {
    const W = 780,
      H = 430,
      scale = 40,
      sx = (x: number) => W * 0.48 + x * scale,
      sy = (y: number) => H * 0.5 - y * scale;
    const path = (start: number, end: number) =>
      Array.from({ length: 181 }, (_, i) => start + (i * (end - start)) / 180)
        .map(
          (u, i) =>
            `${i ? "L" : "M"}${sx(a / Math.cos(u)).toFixed(1)},${sy(b * Math.tan(u)).toFixed(1)}`,
        )
        .join(" ");
    return {
      W,
      H,
      scale,
      sx,
      sy,
      right: path(-1.35, 1.35),
      left: path(Math.PI - 1.35, Math.PI + 1.35),
    };
  }, [a, b]);
  const updateTheta = (v: number) => {
      setTheta(clampTheta(v));
      setActions((x) => x + 1);
    },
    updateA = (v: number) => {
      setA(Math.max(1, Math.min(6, v)));
      setActions((x) => x + 1);
    },
    updateB = (v: number) => {
      setB(Math.max(1, Math.min(5, v)));
      setActions((x) => x + 1);
    };
  const movePoint = (e: ReactPointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect(),
      x =
        (((e.clientX - box.left) * graph.W) / box.width - graph.W * 0.48) /
        graph.scale,
      y =
        (graph.H * 0.5 - ((e.clientY - box.top) * graph.H) / box.height) /
        graph.scale;
    updateTheta(Math.atan2(y / b, x / a));
  };
  const lineY = (x: number) => (1 - xCoefficient * x) / yCoefficient;
  return (
    <section
      className="ht10150-page"
      data-testid="school-mockup-0824"
      data-object-model="dedicated-hyperbola-tangent-branch-engine"
      data-a={a.toFixed(2)}
      data-b={b.toFixed(2)}
      data-theta={theta.toFixed(3)}
      data-point={`${p.x.toFixed(3)},${p.y.toFixed(3)}`}
      data-branch={branch}
      data-slope={slope.toFixed(4)}
      data-x-intercept={xIntercept.toFixed(4)}
      data-y-intercept={yIntercept.toFixed(4)}
      data-verified={verified.toFixed(4)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Tangent to a Hyperbola</h1>
        <p>
          Explore the tangent to the rectangular hyperbola x²/a² − y²/b² = 1.
          The tangent at P(a secθ,b tanθ) is
          <br />x secθ/a − y tanθ/b = 1.
        </p>
        <label>
          <b>Move point using θ (radians)</b>
          <span>θ</span>
          <input
            aria-label="Hyperbola tangent theta"
            type="range"
            min="-2.6"
            max="2.6"
            step=".01"
            value={theta}
            onInput={(e) => updateTheta(Number(e.currentTarget.value))}
            onChange={(e) => setTheta(Number(e.target.value))}
          />
          <output>{theta.toFixed(2)} rad</output>
          <button onClick={() => updateTheta(theta - 0.1)}>
            <Minus />
          </button>
          <button onClick={() => updateTheta(theta + 0.1)}>
            <Plus />
          </button>
        </label>
      </header>
      <main>
        <aside className="ht-controls">
          <article>
            <h2>
              HYPERBOLA PARAMETERS <Info />
            </h2>
            <label>
              a
              <input
                aria-label="Hyperbola parameter a"
                type="number"
                value={a}
                min="1"
                max="6"
                step=".1"
                onChange={(e) => updateA(Number(e.target.value))}
              />
              <button onClick={() => updateA(a - 0.5)}>
                <Minus />
              </button>
              <button onClick={() => updateA(a + 0.5)}>
                <Plus />
              </button>
            </label>
            <label>
              b
              <input
                aria-label="Hyperbola parameter b"
                type="number"
                value={b}
                min="1"
                max="5"
                step=".1"
                onChange={(e) => updateB(Number(e.target.value))}
              />
              <button onClick={() => updateB(b - 0.5)}>
                <Minus />
              </button>
              <button onClick={() => updateB(b + 0.5)}>
                <Plus />
              </button>
            </label>
            <p>Equation</p>
            <div>
              x²/{(a * a).toFixed(1)} − y²/{(b * b).toFixed(1)} = 1
            </div>
          </article>
          <article>
            <h2>POINT ON HYPERBOLA</h2>
            <strong>P(a secθ,b tanθ)</strong>
            <p>
              θ <span>{theta.toFixed(2)} rad</span>
            </p>
            <p>
              P(x,y){" "}
              <span>
                ({p.x.toFixed(3)}, {p.y.toFixed(3)})
              </span>
            </p>
          </article>
          <article>
            <h2>TANGENT INTERCEPTS</h2>
            <p>
              x-intercept (a cosθ,0) <span>({xIntercept.toFixed(3)},0)</span>
            </p>
            <p>
              y-intercept (0,-b cotθ) <span>(0,{yIntercept.toFixed(3)})</span>
            </p>
          </article>
          <article>
            <h2>KEY FACT</h2>
            <p>
              As |θ| → π/2, point P moves away along the branch and the tangent
              approaches an asymptote.
            </p>
          </article>
        </aside>
        <section className="ht-board">
          <h2>HYPERBOLA AND TANGENT</h2>
          <div className="legend">
            <span>Hyperbola</span>
            <span>Tangent</span>
            <span>Asymptotes</span>
            <span>Point</span>
          </div>
          <svg
            viewBox={`0 0 ${graph.W} ${graph.H}`}
            aria-label="Interactive hyperbola tangent graph"
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
            {Array.from({ length: 23 }, (_, i) => i - 11).map((n) => (
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
            <line
              className="asymptote"
              x1={graph.sx(-10)}
              y1={graph.sy((-10 * b) / a)}
              x2={graph.sx(10)}
              y2={graph.sy((10 * b) / a)}
            />
            <line
              className="asymptote"
              x1={graph.sx(-10)}
              y1={graph.sy((10 * b) / a)}
              x2={graph.sx(10)}
              y2={graph.sy((-10 * b) / a)}
            />
            <path className="hyperbola" d={graph.left} />
            <path className="hyperbola" d={graph.right} />
            <line
              className="tangent"
              x1={graph.sx(-10)}
              y1={graph.sy(lineY(-10))}
              x2={graph.sx(10)}
              y2={graph.sy(lineY(10))}
            />
            <circle
              className="point"
              cx={graph.sx(p.x)}
              cy={graph.sy(p.y)}
              r="7"
            />
            <text
              className="p-label"
              x={graph.sx(p.x) + 10}
              y={graph.sy(p.y) - 10}
            >
              P
            </text>
            <circle
              className="intercept"
              cx={graph.sx(xIntercept)}
              cy={graph.sy(0)}
              r="5"
            />
            <circle
              className="intercept"
              cx={graph.sx(0)}
              cy={graph.sy(yIntercept)}
              r="5"
            />
          </svg>
        </section>
        <aside className="ht-proof">
          <article>
            <h2>TANGENT EQUATION</h2>
            <p>x secθ/a − y tanθ/b = 1</p>
            <p>
              {xCoefficient.toFixed(3)}x {yCoefficient < 0 ? "−" : "+"}{" "}
              {Math.abs(yCoefficient).toFixed(3)}y = 1
            </p>
          </article>
          <article>
            <h2>VERIFICATION</h2>
            <p>Substitute P into the tangent:</p>
            <p>{verified.toFixed(4)} = 1.0000</p>
            <strong>
              <CheckCircle2 /> Verified
            </strong>
          </article>
          <article>
            <h2>ASYMPTOTES</h2>
            <p>y = ±(b/a)x = ±{(b / a).toFixed(3)}x</p>
          </article>
          <article>
            <h2>BRANCH AWARENESS</h2>
            <p>
              xp = {p.x.toFixed(3)} &gt; 0 <strong>{branch} branch</strong>
            </p>
          </article>
          <article>
            <h2>HOW TO EXPLORE</h2>
            <p>✓ Drag the point or θ slider.</p>
            <p>✓ Watch intercepts and slope change.</p>
            <p>✓ Try negative θ and cross to the left branch.</p>
          </article>
        </aside>
      </main>
      <section className="ht-examples">
        <h2>TANGENT APPROACHES ASYMPTOTE</h2>
        {[0.2, 0.7, 1.2, 1.5, 1.54].map((v) => (
          <button key={v} onClick={() => updateTheta(v)}>
            <svg viewBox="0 0 120 55">
              <path d="M5 50 Q45 20 58 28 M115 5 Q75 35 62 27" />
              <line x1="5" y1="50" x2="115" y2="5" />
            </svg>
            <b>θ = {v.toFixed(2)} rad</b>
            <span>
              {v > 1.5
                ? "Tangent nearly equals asymptote"
                : "Tangent rotates toward asymptote"}
            </span>
          </button>
        ))}
      </section>
    </section>
  );
}
