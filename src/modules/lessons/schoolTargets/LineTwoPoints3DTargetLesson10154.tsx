import { Check, Expand, Move, RotateCcw, ZoomIn } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LineTwoPoints3DTargetLesson10154.css";
type V = { x: number; y: number; z: number };
type Key = "a" | "b";
const START = { a: { x: 1, y: 2, z: 3 }, b: { x: 4, y: 6, z: 5 } };
const fmt = (n: number) => Number(n.toFixed(2));
export default function LineTwoPoints3DTargetLesson10154({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pts, setPts] = useState(START),
    [t, setT] = useState(2),
    [showAxes, setShowAxes] = useState(true),
    [angle, setAngle] = useState(-0.55),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [active, setActive] = useState<Key | null>(null),
    [actions, setActions] = useState(0);
  const svg = useRef<SVGSVGElement>(null);
  const d = useMemo(
      () => ({
        x: pts.b.x - pts.a.x,
        y: pts.b.y - pts.a.y,
        z: pts.b.z - pts.a.z,
      }),
      [pts],
    ),
    p = { x: pts.a.x + t * d.x, y: pts.a.y + t * d.y, z: pts.a.z + t * d.z },
    mag = Math.hypot(d.x, d.y, d.z),
    angles = {
      x: (Math.acos(d.x / mag) * 180) / Math.PI,
      y: (Math.acos(d.y / mag) * 180) / Math.PI,
      z: (Math.acos(d.z / mag) * 180) / Math.PI,
    };
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    update = (k: Key, a: keyof V, n: number) =>
      act(() =>
        setPts((old) => ({
          ...old,
          [k]: { ...old[k], [a]: Number.isFinite(n) ? n : 0 },
        })),
      );
  const project = (q: V) => {
      const ca = Math.cos(angle),
        sa = Math.sin(angle),
        x = q.x * ca - q.y * sa,
        y = q.x * sa + q.y * ca;
      return {
        x: 310 + pan.x + x * 30 * zoom,
        y: 315 + pan.y + (y * 13 - q.z * 29) * zoom,
      };
    },
    pa = project(pts.a),
    pb = project(pts.b),
    pp = project(p),
    o = project({ x: 0, y: 0, z: 0 });
  const dragPoint = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!active) return;
    const r = svg.current?.getBoundingClientRect();
    if (!r) return;
    const u =
        (((e.clientX - r.left) / r.width) * 620 - 310 - pan.x) / (30 * zoom),
      w =
        (((e.clientY - r.top) / r.height) * 455 -
          315 -
          pan.y +
          pts[active].z * 29 * zoom) /
        (13 * zoom),
      ca = Math.cos(angle),
      sa = Math.sin(angle);
    setPts((old) => ({
      ...old,
      [active]: {
        ...old[active],
        x: fmt(u * ca + w * sa),
        y: fmt(-u * sa + w * ca),
      },
    }));
  };
  const reset = () =>
    act(() => {
      setPts(START);
      setT(2);
      setShowAxes(true);
      setAngle(-0.55);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    });
  return (
    <section
      className="lt10154-page"
      data-testid="school-mockup-0828"
      data-object-model="dedicated-draggable-two-point-3d-line-engine"
      data-direction={`${d.x},${d.y},${d.z}`}
      data-point={`${p.x},${p.y},${p.z}`}
      data-magnitude={mag.toFixed(4)}
      data-collinear={String(true)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Line Through Two Points in 3D</h1>
        <p>
          Build the vector and parametric equations of a line from two points
          and trace any point on it.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="lt-lab">
        <div className="lt-title">
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Line Explorer: Two-Point Construction</h2>
            <p>
              Drag points A and B, move the slider t, and explore the line
              through them in 3D.
            </p>
          </div>
          <aside>
            <button onClick={reset}>
              <RotateCcw />
              Reset lab
            </button>
            <label>
              Show axes{" "}
              <input
                type="checkbox"
                checked={showAxes}
                onChange={() => act(() => setShowAxes((v) => !v))}
              />
            </label>
          </aside>
        </div>
        <section className="lt-top">
          <article className="lt-scene">
            <b>3D CONSTRUCTION</b>
            <p>Drag A or B to update the line.</p>
            <nav>
              <button aria-label="Select points">
                <Move />
              </button>
              <button
                aria-label="Rotate view"
                onClick={() => act(() => setAngle((a) => a + 0.22))}
              >
                <RotateCcw />
              </button>
              <button
                aria-label="Pan view"
                onClick={() =>
                  act(() => setPan((p) => ({ x: p.x + 15, y: p.y + 8 })))
                }
              >
                <Move />
              </button>
              <button
                aria-label="Zoom view"
                onClick={() =>
                  act(() => setZoom((z) => (z >= 1.6 ? 1 : z + 0.2)))
                }
              >
                <ZoomIn />
              </button>
              <button
                aria-label="Fit view"
                onClick={() =>
                  act(() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  })
                }
              >
                <Expand />
              </button>
            </nav>
            <svg
              ref={svg}
              viewBox="0 0 620 455"
              aria-label="Draggable line through two points in 3D"
              onPointerMove={dragPoint}
              onPointerUp={() => active && act(() => setActive(null))}
              onPointerLeave={() => setActive(null)}
            >
              {showAxes && (
                <>
                  {Array.from({ length: 12 }, (_, i) => i - 3).map((n) => (
                    <g key={n}>
                      <line
                        className="grid"
                        x1={project({ x: n, y: -3, z: 0 }).x}
                        y1={project({ x: n, y: -3, z: 0 }).y}
                        x2={project({ x: n, y: 10, z: 0 }).x}
                        y2={project({ x: n, y: 10, z: 0 }).y}
                      />
                      <line
                        className="grid"
                        x1={project({ x: -3, y: n, z: 0 }).x}
                        y1={project({ x: -3, y: n, z: 0 }).y}
                        x2={project({ x: 10, y: n, z: 0 }).x}
                        y2={project({ x: 10, y: n, z: 0 }).y}
                      />
                    </g>
                  ))}
                  <line
                    className="axis x"
                    x1={project({ x: -5, y: 0, z: 0 }).x}
                    y1={project({ x: -5, y: 0, z: 0 }).y}
                    x2={project({ x: 11, y: 0, z: 0 }).x}
                    y2={project({ x: 11, y: 0, z: 0 }).y}
                  />
                  <line
                    className="axis y"
                    x1={project({ x: 0, y: -5, z: 0 }).x}
                    y1={project({ x: 0, y: -5, z: 0 }).y}
                    x2={project({ x: 0, y: 11, z: 0 }).x}
                    y2={project({ x: 0, y: 11, z: 0 }).y}
                  />
                  <line
                    className="axis z"
                    x1={o.x}
                    y1={o.y}
                    x2={project({ x: 0, y: 0, z: 11 }).x}
                    y2={project({ x: 0, y: 0, z: 11 }).y}
                  />
                </>
              )}
              <line
                className="line"
                x1={
                  project({
                    x: pts.a.x - 2 * d.x,
                    y: pts.a.y - 2 * d.y,
                    z: pts.a.z - 2 * d.z,
                  }).x
                }
                y1={
                  project({
                    x: pts.a.x - 2 * d.x,
                    y: pts.a.y - 2 * d.y,
                    z: pts.a.z - 2 * d.z,
                  }).y
                }
                x2={
                  project({
                    x: pts.a.x + 3 * d.x,
                    y: pts.a.y + 3 * d.y,
                    z: pts.a.z + 3 * d.z,
                  }).x
                }
                y2={
                  project({
                    x: pts.a.x + 3 * d.x,
                    y: pts.a.y + 3 * d.y,
                    z: pts.a.z + 3 * d.z,
                  }).y
                }
              />
              {(["a", "b"] as Key[]).map((k) => {
                const q = k === "a" ? pa : pb;
                return (
                  <g key={k}>
                    <line
                      className="projection"
                      x1={q.x}
                      y1={q.y}
                      x2={project({ ...pts[k], z: 0 }).x}
                      y2={project({ ...pts[k], z: 0 }).y}
                    />
                    <circle
                      className={k}
                      aria-label={`Draggable point ${k.toUpperCase()}`}
                      tabIndex={0}
                      cx={q.x}
                      cy={q.y}
                      r="8"
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setActive(k);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight")
                          update(k, "x", pts[k].x + 1);
                        if (e.key === "ArrowUp") update(k, "y", pts[k].y + 1);
                      }}
                    />
                    <text x={q.x + 10} y={q.y + 18}>
                      {k.toUpperCase()} ({pts[k].x}, {pts[k].y}, {pts[k].z})
                    </text>
                  </g>
                );
              })}
              <circle className="p" cx={pp.x} cy={pp.y} r="7" />
              <text className="ptext" x={pp.x + 10} y={pp.y + 15}>
                P ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
              </text>
            </svg>
            <div className="t-control">
              <label>
                Parameter t{" "}
                <input
                  aria-label="Line parameter t"
                  type="range"
                  min="-2"
                  max="3"
                  step=".1"
                  value={t}
                  onInput={(e) => setT(+e.currentTarget.value)}
                  onChange={(e) => act(() => setT(+e.target.value))}
                />
                <output>t = {t.toFixed(2)}</output>
              </label>
              <p>
                Point on line P = A + td{" "}
                <strong>
                  P ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
                </strong>
              </p>
            </div>
          </article>
          <aside className="lt-equations">
            <h3>FROM POINTS TO LINE</h3>
            {(["a", "b"] as Key[]).map((k) => (
              <article key={k}>
                <b>Point {k.toUpperCase()}</b>
                <strong>
                  {k.toUpperCase()} &nbsp; ({pts[k].x}, {pts[k].y}, {pts[k].z})
                </strong>
                <div>
                  {(["x", "y", "z"] as const).map((a) => (
                    <label key={a}>
                      {a}
                      <input
                        aria-label={`Point ${k.toUpperCase()} ${a}`}
                        type="number"
                        value={pts[k][a]}
                        onChange={(e) => update(k, a, +e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </article>
            ))}
            <article>
              <b>Direction vector d = B − A</b>
              <strong>
                d = ({fmt(d.x)}, {fmt(d.y)}, {fmt(d.z)})
              </strong>
            </article>
            <article>
              <b>Line (Vector Form)</b>
              <p>
                r = ({pts.a.x}, {pts.a.y}, {pts.a.z}) + t ({fmt(d.x)},{" "}
                {fmt(d.y)}, {fmt(d.z)})
              </p>
            </article>
            <article>
              <b>Parametric Equations</b>
              <p>
                x = {pts.a.x} + {fmt(d.x)}t<br />y = {pts.a.y} + {fmt(d.y)}t
                <br />z = {pts.a.z} + {fmt(d.z)}t
              </p>
            </article>
          </aside>
        </section>
        <section className="lt-analysis">
          <article>
            <h3>COMPONENT DIFFERENCE VISUAL</h3>
            <b>B − A = d</b>
            <svg viewBox="0 0 330 155">
              <line className="component" x1="45" y1="120" x2="210" y2="35" />
              <line className="dash" x1="45" y1="120" x2="210" y2="120" />
              <line className="dash" x1="210" y1="120" x2="210" y2="35" />
              <circle cx="45" cy="120" r="5" />
              <circle cx="210" cy="35" r="5" />
              <text x="10" y="142">
                A ({pts.a.x},{pts.a.y},{pts.a.z})
              </text>
              <text x="215" y="28">
                B ({pts.b.x},{pts.b.y},{pts.b.z})
              </text>
              <text x="95" y="75">
                d = ({d.x},{d.y},{d.z})
              </text>
            </svg>
          </article>
          <article>
            <h3>COLLINEARITY VERIFICATION</h3>
            <p>For any t, vector AP is a scalar multiple of d.</p>
            <p>
              AP = P − A = ({fmt(p.x - pts.a.x)}, {fmt(p.y - pts.a.y)},{" "}
              {fmt(p.z - pts.a.z)})
            </p>
            <p>
              td = {t}({d.x}, {d.y}, {d.z}) = ({fmt(t * d.x)}, {fmt(t * d.y)},{" "}
              {fmt(t * d.z)})
            </p>
            <strong>
              <Check /> AP = td &nbsp; ✓ Collinear
            </strong>
          </article>
        </section>
        <section className="lt-facts">
          <article>
            <h3>DIRECTION MATTERS, LINE DOES NOT</h3>
            <p>
              Reversing the points changes the direction vector but not the
              line.
            </p>
            <div>
              <p>
                Original: A → B<br />d = ({d.x},{d.y},{d.z})
              </p>
              <p>
                Reversed: B → A<br />
                d′ = ({-d.x},{-d.y},{-d.z})
              </p>
            </div>
            <b>Both equations represent the same geometric line.</b>
          </article>
          <article>
            <h3>QUICK CHECKS</h3>
            <p>
              <Check /> |d| = √({d.x}²+{d.y}²+{d.z}²) = {fmt(mag)}
            </p>
            <p>
              <Check /> Angle with x-axis: {angles.x.toFixed(2)}°
            </p>
            <p>
              <Check /> Angle with y-axis: {angles.y.toFixed(2)}°
            </p>
            <p>
              <Check /> Angle with z-axis: {angles.z.toFixed(2)}°
            </p>
          </article>
        </section>
        <section className="lt-worked">
          <h3>WORKED EXAMPLE</h3>
          <p>
            Find the line through C(2,-1,4) and D(5,3,10), and the point at
            t=-1.
          </p>
          <div>
            <article>
              <b>Step 1: Direction vector</b>
              <p>d=D−C=(3,4,6)</p>
            </article>
            <article>
              <b>Step 2: Vector equation</b>
              <p>r=(2,-1,4)+t(3,4,6)</p>
            </article>
            <article>
              <b>Step 3: Parametric equations</b>
              <p>
                x=2+3t
                <br />
                y=-1+4t
                <br />
                z=4+6t
              </p>
            </article>
            <article>
              <b>Step 4: Point at t=-1</b>
              <p>P=(-1,-5,-2)</p>
            </article>
          </div>
        </section>
        <section className="lt-practice">
          <h3>PRACTICE</h3>
          <p>
            For each pair, find d, the vector equation, parametric equations,
            and P at t=2.
          </p>
          <div>
            {[
              [
                [0, 1, 2],
                [2, 5, -1],
              ],
              [
                [-3, 2, 1],
                [1, 6, 7],
              ],
              [
                [4, -2, 3],
                [-2, 2, 11],
              ],
            ].map((q, i) => (
              <article key={i}>
                <b>
                  {i + 1} &nbsp; A({q[0].join(",")}), B({q[1].join(",")})
                </b>
                <details>
                  <summary>Show result</summary>
                  <p>d=({q[1].map((n, j) => n - q[0][j]).join(",")})</p>
                </details>
              </article>
            ))}
          </div>
        </section>
      </main>
    </section>
  );
}
