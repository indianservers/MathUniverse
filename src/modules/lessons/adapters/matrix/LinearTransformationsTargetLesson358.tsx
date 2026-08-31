import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./LinearTransformationsTargetLesson358.css";
type Matrix = [number, number, number, number];
const initial: Matrix = [2, 1, 1, 2],
  tabs = [
    "Interaction + visualization",
    "Explain",
    "Examples",
    "Formulas",
    "Know more",
  ],
  clean = (n: number) => Number(n.toFixed(2));
const originX = 270,
  originY = 365,
  plotScale = 108;
const apply = (
  [a, b, c, d]: Matrix,
  [x, y]: [number, number],
): [number, number] => [clean(a * x + b * y), clean(c * x + d * y)];
export default function LinearTransformationsTargetLesson358({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [matrix, setMatrix] = useState<Matrix>(initial),
    [tab, setTab] = useState(tabs[0]),
    [drag, setDrag] = useState<0 | 1 | null>(null),
    [actions, setActions] = useState(0),
    [zoom, setZoom] = useState(1);
  const [a, b, c, d] = matrix,
    det = clean(a * d - b * c),
    trace = clean(a + d),
    points = (
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ] as [number, number][]
    ).map((p) => apply(matrix, p));
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setMatrix(initial);
      setTab(tabs[0]);
      setDrag(null);
      setActions(0);
      setZoom(1);
    };
  useEffect(reset, [resetToken]);
  const update = (i: number, v: string) =>
    act(() =>
      setMatrix((m) => m.map((n, j) => (j === i ? Number(v) : n)) as Matrix),
    );
  const pointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const box = event.currentTarget.getBoundingClientRect(),
      svgX = ((event.clientX - box.left) / box.width) * 720,
      svgY = ((event.clientY - box.top) / box.height) * 570,
      x = clean((svgX - originX) / (plotScale * zoom)),
      y = clean((originY - svgY) / (plotScale * zoom));
    act(() =>
      setMatrix((m) => (drag === 0 ? [x, m[1], y, m[3]] : [m[0], x, m[2], y])),
    );
  };
  const xy = ([x, y]: [number, number]) =>
    `${originX + x * plotScale * zoom},${originY - y * plotScale * zoom}`;
  return (
    <section
      className="mat358-page"
      data-testid="matrix-mockup-0543"
      data-object-model="editable-two-by-two-linear-transformation-draggable-basis-columns-derived-unit-square-point-mapping-determinant-trace"
      data-matrix={JSON.stringify(matrix)}
      data-det={det}
      data-trace={trace}
      data-points={JSON.stringify(points)}
      data-tab={tab}
      data-drag={drag ?? "none"}
      data-actions={actions}
    >
      <header className="mat358-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>MATRICES AND LINEAR ALGEBRA</b>
          </span>
          <h1>Linear Transformations</h1>
          <p>Visualize how every point is mapped by the same matrix.</p>
          <nav>
            <b>Advanced</b>
            <b>Linear Algebra Lab</b>
            <b>Matrix Commands / CAS</b>
            <b>6-10 min</b>
          </nav>
        </div>
        <aside>
          <button>Workspace</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
        </aside>
      </header>
      <nav className="mat358-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => act(() => setTab(t))}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="mat358-lab">
        <div className="mat358-plot">
          <h3>LINEAR TRANSFORMATION LAB</h3>
          <svg
            viewBox="0 0 720 570"
            onPointerMove={pointer}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
            role="img"
            aria-label="Draggable linear transformation plot"
          >
            <defs>
              <pattern
                id="grid358"
                width={plotScale}
                height={plotScale}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M${plotScale} 0H0V${plotScale}`}
                  fill="none"
                  stroke="#183052"
                />
              </pattern>
            </defs>
            <rect width="720" height="570" fill="url(#grid358)" />
            <path
              d={`M0 ${originY}H720M${originX} 0V570`}
              stroke="#d5deec"
              strokeWidth="1.5"
            />
            <polygon
              points={`${xy([0, 0])} ${xy([1, 0])} ${xy([1, 1])} ${xy([0, 1])}`}
              fill="#b5c3d933"
              stroke="#b7c5d8"
            />
            <polygon
              points={points.map(xy).join(" ")}
              fill="#04bde733"
              stroke="#18c8ef"
              strokeWidth="2"
            />
            {points.slice(1).map((p, i) => (
              <g key={i}>
                <line
                  x1={originX}
                  y1={originY}
                  x2={xy(p).split(",")[0]}
                  y2={xy(p).split(",")[1]}
                  stroke={i === 1 ? "#f3a600" : "#14c8ec"}
                  strokeWidth="2"
                />
                <circle
                  cx={xy(p).split(",")[0]}
                  cy={xy(p).split(",")[1]}
                  r="7"
                  fill="#16c8ed"
                  stroke="white"
                />
                <text
                  x={Number(xy(p).split(",")[0]) + 12}
                  y={Number(xy(p).split(",")[1]) - 8}
                >
                  ({p.join(", ")})
                </text>
              </g>
            ))}
          </svg>
          <p>
            Drag the endpoints of the basis vectors (column 1, column 2) to
            transform the matrix.
          </p>
          <nav>
            <button
              onClick={() => act(() => setZoom((z) => Math.max(0.7, z - 0.1)))}
            >
              −
            </button>
            <button onClick={() => act(() => setZoom(1))}>◎</button>
            <button
              onClick={() => act(() => setZoom((z) => Math.min(1.3, z + 0.1)))}
            >
              +
            </button>
          </nav>
        </div>
        <aside className="mat358-panel">
          <h3>TRANSFORMATION MATRIX</h3>
          <p>Edit matrix A</p>
          <div>
            {matrix.map((v, i) => (
              <input
                key={i}
                aria-label={`Matrix entry ${i + 1}`}
                type="number"
                value={v}
                onChange={(e) => update(i, e.target.value)}
              />
            ))}
          </div>
          <code>
            A = [ {a} {b} ; {c} {d} ]
          </code>
          <hr />
          <h3>PROPERTIES</h3>
          <strong>det(A) = {det}</strong>
          <p>
            area scale factor
            <br />
            The unit square's area is multiplied by {Math.abs(det)}.
          </p>
          <em>trace(A) = {trace}</em>
          <hr />
          <h3>EIGEN DIRECTION</h3>
          <p>
            {a + b === c + d
              ? "The line y = x is invariant."
              : "The current matrix has no y = x eigendirection."}
          </p>
          <hr />
          <h3>CONTROLS</h3>
          <button className="primary" onClick={() => act(() => setDrag(0))}>
            Drag basis vector {drag === 0 ? "1 active" : ""}
          </button>
          <button onClick={() => act(reset)}>Reset matrix</button>
        </aside>
      </section>
      <section className="mat358-results">
        <article>
          <h3>TRANSFORMED POINTS</h3>
          {(
            [
              [0, 0],
              [1, 0],
              [0, 1],
              [1, 1],
            ] as [number, number][]
          ).map((p, i) => (
            <p key={i}>
              <span>({p.join(", ")})</span>→<b>({points[i].join(", ")})</b>
            </p>
          ))}
        </article>
        <article>
          <h3>
            LIVE COMPUTATION <b>x' = A x</b>
          </h3>
          {(
            [
              [1, 0],
              [0, 1],
              [1, 1],
            ] as [number, number][]
          ).map((p, i) => (
            <p key={i}>
              {i + 1}. x = [{p.join(", ")}] &nbsp; A x = [
              {points[i + 1].join(", ")}]
            </p>
          ))}
        </article>
      </section>
      <aside className="mat358-insight">
        <b>Key insight:</b> Linear transformations map every point using the
        same matrix. The unit square becomes a parallelogram whose area is
        scaled by |det(A)|.
      </aside>
    </section>
  );
}
