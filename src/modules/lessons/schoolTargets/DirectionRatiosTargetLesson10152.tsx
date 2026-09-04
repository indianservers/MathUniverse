import { Check, HelpCircle, RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DirectionRatiosTargetLesson10152.css";

type Point3 = { x: number; y: number; z: number };
const START = { a: { x: 1, y: 2, z: 3 }, b: { x: 4, y: 6, z: 3 } };
const PRACTICE_SETS = [
  [6, 8, 0],
  [-3, -4, 0],
  [3, 8, 0],
  [9, 12, 0],
];
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const simplify = (v: number[]) => {
  const ints = v.map((n) => Math.round(n * 100)),
    g = ints.reduce(gcd, 0) || 1;
  return ints.map((n) => n / g);
};
export default function DirectionRatiosTargetLesson10152({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [k, setK] = useState(2),
    [angle, setAngle] = useState(-0.6),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [drag, setDrag] = useState(false),
    [checked, setChecked] = useState(false),
    [choices, setChoices] = useState<Record<string, boolean>>({}),
    [actions, setActions] = useState(0);
  const svg = useRef<SVGSVGElement>(null);
  const d = useMemo(
    () => ({
      x: points.b.x - points.a.x,
      y: points.b.y - points.a.y,
      z: points.b.z - points.a.z,
    }),
    [points],
  );
  const ratio = simplify([d.x, d.y, d.z]),
    mag = Math.hypot(d.x, d.y, d.z);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (p: "a" | "b", axis: keyof Point3, value: number) =>
    act(() =>
      setPoints((old) => ({
        ...old,
        [p]: { ...old[p], [axis]: Math.max(-5, Math.min(8, value || 0)) },
      })),
    );
  const project = (p: Point3) => {
    const ca = Math.cos(angle),
      sa = Math.sin(angle),
      x = p.x * ca - p.y * sa,
      y = p.x * sa + p.y * ca;
    return {
      x: 300 + pan.x + x * 35 * zoom,
      y: 292 + pan.y + (y * 15 - p.z * 38) * zoom,
    };
  };
  const pa = project(points.a),
    pb = project(points.b),
    origin = project({ x: 0, y: 0, z: 0 });
  const dragB = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const r = svg.current?.getBoundingClientRect();
    if (!r) return;
    const u =
        (((e.clientX - r.left) / r.width) * 600 - 300 - pan.x) / (35 * zoom),
      v =
        (((e.clientY - r.top) / r.height) * 430 -
          292 -
          pan.y +
          points.b.z * 38 * zoom) /
        (15 * zoom);
    const ca = Math.cos(angle),
      sa = Math.sin(angle);
    setPoints((old) => ({
      ...old,
      b: {
        ...old.b,
        x: Number((u * ca + v * sa).toFixed(1)),
        y: Number((-u * sa + v * ca).toFixed(1)),
      },
    }));
  };
  const equivalent = (candidate: number[]) => {
    const cross = (u: number, v: number) =>
      near(u * d.y - v * d.x) &&
      near(u * d.z - candidate[2] * d.x) &&
      near(v * d.z - candidate[2] * d.y);
    return candidate.some((n) => n !== 0) && cross(candidate[0], candidate[1]);
  };
  return (
    <section
      className="dr10152-page"
      data-testid="school-mockup-0826"
      data-object-model="dedicated-draggable-3d-direction-ratio-engine"
      data-vector={`${d.x},${d.y},${d.z}`}
      data-ratio={ratio.join(":")}
      data-magnitude={mag.toFixed(4)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Direction Ratios</h1>
        <p>
          Direction Ratios is a school mathematics idea in Three-Dimensional
          Geometry. Explore how a line's direction comes from coordinate
          differences.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="dr-lab panel">
        <div className="lab-title">
          <b>INTERACTIVE LAB &bull; 3D VECTOR STUDIO</b>
          <span>
            <button
              onClick={() =>
                act(() => {
                  setPoints(START);
                  setAngle(-0.6);
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setK(2);
                  setChoices({});
                  setChecked(false);
                })
              }
            >
              <RotateCcw />
              Reset lab
            </button>
            <button
              onClick={() =>
                alert(
                  "Drag point B or edit its coordinates. Direction ratios are coordinate differences.",
                )
              }
            >
              <HelpCircle />
              Help
            </button>
          </span>
        </div>
        <section className="dr-workspace">
          <aside className="dr-left">
            <article>
              <h2>
                <i>1</i> POINTS <small>(EDITABLE)</small>
              </h2>
              {(["a", "b"] as const).map((p) => (
                <div className="point-input" key={p}>
                  <b>
                    {p.toUpperCase()}{" "}
                    <small>{p === "a" ? "(fixed)" : "(move or edit)"}</small>
                  </b>
                  {(["x", "y", "z"] as const).map((axis) => (
                    <label key={axis}>
                      {axis}
                      <sub>{p}</sub>
                      <input
                        aria-label={`Point ${p.toUpperCase()} ${axis}`}
                        type="number"
                        value={points[p][axis]}
                        onChange={(e) => update(p, axis, +e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </article>
            <article>
              <h2>
                <i>2</i> VECTOR AB = B − A
              </h2>
              <p>AB = (xB − xA, yB − yA, zB − zA)</p>
              <strong>
                AB = ({fmt(d.x)}, {fmt(d.y)}, {fmt(d.z)})
              </strong>
            </article>
            <article>
              <h2>
                <i>3</i> STEP-BY-STEP SUBTRACTION
              </h2>
              <p>B − A = (xB−xA, yB−yA, zB−zA)</p>
              <p>
                = ({points.b.x}−{points.a.x}, {points.b.y}−{points.a.y},{" "}
                {points.b.z}−{points.a.z})
              </p>
              <strong>
                = ({fmt(d.x)}, {fmt(d.y)}, {fmt(d.z)})
              </strong>
            </article>
          </aside>
          <article className="dr-scene">
            <div className="scene-tools">
              <button onClick={() => act(() => setAngle((a) => a + 0.25))}>
                ⟳ Rotate
              </button>
              <button
                onClick={() =>
                  act(() => setPan((p) => ({ x: p.x + 15, y: p.y })))
                }
              >
                ✣ Pan
              </button>
              <button
                onClick={() =>
                  act(() => setZoom((z) => (z >= 1.6 ? 1 : z + 0.2)))
                }
              >
                <Search />
                Zoom
              </button>
              <label>
                Unit cube:{" "}
                <select aria-label="Unit cube">
                  <option>1</option>
                  <option>2</option>
                </select>
              </label>
            </div>
            <svg
              ref={svg}
              viewBox="0 0 600 430"
              aria-label="Draggable 3D direction vector"
              onPointerMove={dragB}
              onPointerUp={() => drag && act(() => setDrag(false))}
              onPointerLeave={() => setDrag(false)}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i}>
                  <line
                    className="grid"
                    x1={project({ x: i, y: 0, z: 0 }).x}
                    y1={project({ x: i, y: 0, z: 0 }).y}
                    x2={project({ x: i, y: 7, z: 0 }).x}
                    y2={project({ x: i, y: 7, z: 0 }).y}
                  />
                  <line
                    className="grid"
                    x1={project({ x: 0, y: i, z: 0 }).x}
                    y1={project({ x: 0, y: i, z: 0 }).y}
                    x2={project({ x: 7, y: i, z: 0 }).x}
                    y2={project({ x: 7, y: i, z: 0 }).y}
                  />
                </g>
              ))}
              <line
                className="axis x"
                x1={origin.x}
                y1={origin.y}
                x2={project({ x: 8, y: 0, z: 0 }).x}
                y2={project({ x: 8, y: 0, z: 0 }).y}
              />
              <line
                className="axis y"
                x1={origin.x}
                y1={origin.y}
                x2={project({ x: 0, y: 8, z: 0 }).x}
                y2={project({ x: 0, y: 8, z: 0 }).y}
              />
              <line
                className="axis z"
                x1={origin.x}
                y1={origin.y}
                x2={project({ x: 0, y: 0, z: 7 }).x}
                y2={project({ x: 0, y: 0, z: 7 }).y}
              />
              <line
                className="projection"
                x1={pa.x}
                y1={pa.y}
                x2={project({ ...points.a, z: 0 }).x}
                y2={project({ ...points.a, z: 0 }).y}
              />
              <line
                className="projection"
                x1={pb.x}
                y1={pb.y}
                x2={project({ ...points.b, z: 0 }).x}
                y2={project({ ...points.b, z: 0 }).y}
              />
              <line
                className="vector"
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
              />
              <circle className="a" cx={pa.x} cy={pa.y} r="7" />
              <circle
                className="b"
                tabIndex={0}
                aria-label="Draggable point B"
                cx={pb.x}
                cy={pb.y}
                r="8"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDrag(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") update("b", "x", points.b.x + 1);
                  if (e.key === "ArrowUp") update("b", "y", points.b.y + 1);
                }}
              />
              <text x={pa.x + 10} y={pa.y - 8}>
                A({points.a.x}, {points.a.y}, {points.a.z})
              </text>
              <text x={pb.x + 10} y={pb.y - 8}>
                B({fmt(points.b.x)}, {fmt(points.b.y)}, {points.b.z})
              </text>
            </svg>
            <div className="scene-legend">
              <span>
                A({points.a.x}, {points.a.y}, {points.a.z})
              </span>
              <span>
                B({fmt(points.b.x)}, {fmt(points.b.y)}, {points.b.z})
              </span>
              <span>AB</span>
              <span>Δx ({fmt(d.x)})</span>
              <span>Δy ({fmt(d.y)})</span>
              <span>Δz ({fmt(d.z)})</span>
            </div>
          </article>
          <aside className="dr-right">
            <article>
              <h2>
                <i>4</i> DIRECTION RATIOS
              </h2>
              <p>
                From vector ({fmt(d.x)}, {fmt(d.y)}, {fmt(d.z)})
              </p>
              <strong className="ratio">{ratio.join(" : ")}</strong>
              <p>Equivalent (any non-zero multiple)</p>
              {[2, 3, -1, -2].map((n) => (
                <p className="equiv" key={n}>
                  <Check /> {ratio.map((v) => v * n).join(" : ")}
                </p>
              ))}
              <hr />
              <label>
                Custom k × ({ratio.join(", ")})
                <span>
                  <input
                    aria-label="Ratio multiplier"
                    type="number"
                    value={k}
                    onChange={(e) => setK(+e.target.value)}
                  />
                  <button onClick={() => act(() => setK(k || 1))}>Apply</button>
                </span>
              </label>
              <strong className="ratio">
                {ratio.map((v) => v * k).join(" : ")}
              </strong>
            </article>
            <article>
              <h2>
                <i>5</i> COMPONENT PROJECTIONS
              </h2>
              <p className="red">Δx = xB − xA = {fmt(d.x)}</p>
              <p className="green">Δy = yB − yA = {fmt(d.y)}</p>
              <p className="blue">Δz = zB − zA = {fmt(d.z)}</p>
            </article>
          </aside>
        </section>
        <article className="coordinate">
          <h2>
            <i>6</i> COORDINATE TABLE <small>(LINKED)</small>
          </h2>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>x</th>
                <th>y</th>
                <th>z</th>
                <th>Vector from A</th>
                <th>Δx</th>
                <th>Δy</th>
                <th>Δz</th>
                <th>Direction ratios</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>A</th>
                <td>{points.a.x}</td>
                <td>{points.a.y}</td>
                <td>{points.a.z}</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <th>B</th>
                <td>{fmt(points.b.x)}</td>
                <td>{fmt(points.b.y)}</td>
                <td>{points.b.z}</td>
                <td>
                  AB = ({fmt(d.x)}, {fmt(d.y)}, {fmt(d.z)})
                </td>
                <td>{fmt(d.x)}</td>
                <td>{fmt(d.y)}</td>
                <td>{fmt(d.z)}</td>
                <td>{ratio.join(" : ")}</td>
              </tr>
            </tbody>
          </table>
        </article>
        <section className="dr-cards">
          <article>
            <h2>
              <i>7</i> FORMULA LINK
            </h2>
            <p>If A(x₁,y₁,z₁) and B(x₂,y₂,z₂), then</p>
            <strong>AB = (x₂−x₁, y₂−y₁, z₂−z₁)</strong>
            <p>Direction ratios: (x₂−x₁):(y₂−y₁):(z₂−z₁)</p>
          </article>
          <article className="important">
            <h2>⚠ IMPORTANT</h2>
            <b>Direction ratios are NOT UNIQUE.</b>
            <p>If (l,m,n) is a set, then k(l,m,n), k ≠ 0 is also valid.</p>
          </article>
          <article>
            <h2>
              <i>8</i> VECTOR PROPERTIES
            </h2>
            <p>Magnitude |AB| = {fmt(mag)}</p>
            <p>
              Unit vector along AB = ({d.x ? fmt(d.x / mag) : 0},{" "}
              {d.y ? fmt(d.y / mag) : 0}, {d.z ? fmt(d.z / mag) : 0})
            </p>
            <p>
              Direction cosines = ({d.x ? fmt(d.x / mag) : 0},{" "}
              {d.y ? fmt(d.y / mag) : 0}, {d.z ? fmt(d.z / mag) : 0})
            </p>
          </article>
        </section>
        <section className="worked panel">
          <h2>
            <i>9</i> WORKED EXAMPLE <small>(CORRECT)</small>
          </h2>
          <p>For P(−2,1,4) and Q(1,5,7): PQ = (1−(−2),5−1,7−4) = (3,4,3).</p>
          <strong>Direction ratios: 3 : 4 : 3</strong>
          <span>
            <Check /> Verified
          </span>
          <aside>
            <b>Quick Check</b>
            <p>If R(7,10,-1) and A(2,2,-1), find direction ratios.</p>
            <strong>Answer: 5 : 8 : 0</strong>
          </aside>
        </section>
        <section className="practice panel">
          <h2>
            <i>10</i> PRACTICE <small>(TARGETED)</small>
          </h2>
          <p>Select all equivalent sets for the current direction ratios.</p>
          <div>
            {PRACTICE_SETS.map((v, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  checked={!!choices[i]}
                  onChange={() => setChoices((c) => ({ ...c, [i]: !c[i] }))}
                />
                {v.join(" : ")}{" "}
                {checked &&
                  choices[i] === equivalent(v) &&
                  (choices[i] ? <Check /> : null)}
              </label>
            ))}
          </div>
          <button onClick={() => act(() => setChecked(true))}>
            <Sparkles />
            Check my answers
          </button>
          {checked && (
            <strong>
              {PRACTICE_SETS.every(
                (candidate, i) => !!choices[i] === equivalent(candidate),
              )
                ? "All selections are correct."
                : "Review proportional triples."}
            </strong>
          )}
        </section>
        <section className="dr-close">
          <article className="discuss">
            <h2>
              <i>11</i> THINK &amp; DISCUSS
            </h2>
            <details>
              <summary>Why are direction ratios not unique?</summary>
              <p>
                Every non-zero scalar multiple points in the same direction.
              </p>
            </details>
            <details>
              <summary>What happens if Δz = 0?</summary>
              <p>The vector is parallel to the xy-plane.</p>
            </details>
            <details>
              <summary>When is one ratio zero?</summary>
              <p>When that coordinate does not change between the points.</p>
            </details>
          </article>
          <article className="real-life">
            <h2>
              <i>12</i> REAL-LIFE USE
            </h2>
            <p>
              Used in navigation, robotics, graphics, surveying, computer
              vision, and physics to describe directions independent of
              distance.
            </p>
          </article>
          <article>
            <h2>
              <i>13</i> NEXT STEP
            </h2>
            <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-direction-cosines">
              Learn Direction Cosines →
            </a>
            <a href="/math-lab/3d-graphing">Explore Lines in 3D →</a>
          </article>
        </section>
      </main>
    </section>
  );
}
const near = (n: number) => Math.abs(n) < 1e-6;
const fmt = (n: number) => Number(n.toFixed(2));
