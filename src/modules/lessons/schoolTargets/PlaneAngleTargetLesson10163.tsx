import { Check, Eye, RotateCcw, Share2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PlaneAngleTargetLesson10163.css";

type V = { x: number; y: number; z: number };
type Plane = { n: V; d: number };
type Preset = "parallel" | "perpendicular" | "coincident";
const P10: Plane = { n: { x: 1, y: 2, z: 2 }, d: 0 },
  P20: Plane = { n: { x: 2, y: -1, z: 2 }, d: 0 };
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z,
  norm = (a: V) => Math.hypot(a.x, a.y, a.z),
  cross = (a: V, b: V): V => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
  add = (a: V, b: V, k = 1): V => ({
    x: a.x + k * b.x,
    y: a.y + k * b.y,
    z: a.z + k * b.z,
  }),
  nice = (v: number) => Number(v.toFixed(4)),
  tup = (v: V) => `(${nice(v.x)}, ${nice(v.y)}, ${nice(v.z)})`;

export default function PlaneAngleTargetLesson10163({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [p1, setP1] = useState(P10),
    [p2, setP2] = useState(P20),
    [supplementary, setSupplementary] = useState(false),
    [view, setView] = useState<"3D" | "2D">("3D"),
    [grid, setGrid] = useState(true),
    [camera, setCamera] = useState({ rotate: 0, pan: 0, zoom: 1 }),
    [solutions, setSolutions] = useState(false),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [drag, setDrag] = useState<1 | 2 | null>(null),
    [relationChecked, setRelationChecked] = useState(true);
  const calc = useMemo(() => {
    const n1n = norm(p1.n),
      n2n = norm(p2.n),
      c = cross(p1.n, p2.n),
      cn = norm(c),
      product = dot(p1.n, p2.n),
      valid = n1n > 1e-8 && n2n > 1e-8,
      parallel = cn < 1e-8 && valid,
      perpendicular = Math.abs(product) < 1e-8 && valid;
    let coincident = false,
      point: V = { x: 0, y: 0, z: 0 };
    if (parallel) {
      const k =
        Math.abs(p1.n.x) > 1e-8
          ? p2.n.x / p1.n.x
          : Math.abs(p1.n.y) > 1e-8
            ? p2.n.y / p1.n.y
            : p2.n.z / p1.n.z;
      coincident = Math.abs(p2.d - k * p1.d) < 1e-7;
    } else {
      const A = dot(p1.n, p1.n),
        B = product,
        C = dot(p2.n, p2.n),
        det = A * C - B * B,
        alpha = (p1.d * C - p2.d * B) / det,
        beta = (p2.d * A - p1.d * B) / det;
      point = add(add({ x: 0, y: 0, z: 0 }, p1.n, alpha), p2.n, beta);
    }
    const acute = valid
        ? (Math.acos(Math.min(1, Math.abs(product) / (n1n * n2n))) * 180) /
          Math.PI
        : NaN,
      relation = !valid
        ? "Invalid normals"
        : coincident
          ? "Coincident"
          : parallel
            ? "Parallel"
            : perpendicular
              ? "Perpendicular"
              : "Intersecting";
    return {
      n1n,
      n2n,
      c,
      cn,
      product,
      parallel,
      perpendicular,
      coincident,
      acute,
      relation,
      point,
      valid,
    };
  }, [p1, p2]);
  const angle = supplementary ? 180 - calc.acute : calc.acute;
  const acuteText = calc.valid ? String(nice(calc.acute)) : "undefined",
    angleText = calc.valid ? String(nice(angle)) : "undefined";
  const set = (plane: 1 | 2, key: keyof V | "d", value: number) => {
    const fn = plane === 1 ? setP1 : setP2;
    fn((old) =>
      key === "d"
        ? { ...old, d: value }
        : { ...old, n: { ...old.n, [key]: value } },
    );
    setRelationChecked(false);
  };
  const reset = () => {
    setP1(P10);
    setP2(P20);
    setSupplementary(false);
    setView("3D");
    setGrid(true);
    setCamera({ rotate: 0, pan: 0, zoom: 1 });
    setSolutions(false);
    setAnswer("");
    setGraded(null);
    setRelationChecked(true);
  };
  const preset = (kind: Preset) => {
    setRelationChecked(false);
    return kind === "parallel"
      ? setP2({ n: { x: 2, y: 4, z: 4 }, d: 3 })
      : kind === "perpendicular"
        ? setP2({ n: { x: 2, y: -1, z: 0 }, d: 0 })
        : setP2({ n: { x: 2, y: 4, z: 4 }, d: 0 });
  };
  const swap = () => {
    const a = p1;
    setP1(p2);
    setP2(a);
    setRelationChecked(false);
  };
  const random = () => {
    setP1({ n: { x: 1, y: -2, z: 3 }, d: 4 });
    setP2({ n: { x: 2, y: 1, z: -1 }, d: -2 });
    setRelationChecked(false);
  };
  const xy = (n: V) => ({
      x: 320 + n.x * 42 + camera.pan,
      y: 260 - n.z * 42 - n.y * 14,
    }),
    o = xy({ x: 0, y: 0, z: 0 }),
    n1p = xy(p1.n),
    n2p = xy(p2.n),
    lp = xy(calc.c);
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const b = e.currentTarget.getBoundingClientRect(),
      x = (((e.clientX - b.left) / b.width) * 640 - 320 - camera.pan) / 42,
      z = (260 - ((e.clientY - b.top) / b.height) * 410) / 42;
    const fn = drag === 1 ? setP1 : setP2;
    fn((old) => ({ ...old, n: { ...old.n, x: nice(x), z: nice(z) } }));
    setRelationChecked(false);
  };
  const nudge = (which: 1 | 2, e: KeyboardEvent<SVGCircleElement>) => {
    const d =
      e.key === "ArrowLeft"
        ? [-0.2, 0]
        : e.key === "ArrowRight"
          ? [0.2, 0]
          : e.key === "ArrowUp"
            ? [0, 0.2]
            : e.key === "ArrowDown"
              ? [0, -0.2]
              : null;
    if (!d) return;
    const fn = which === 1 ? setP1 : setP2;
    fn((old) => ({
      ...old,
      n: { ...old.n, x: old.n.x + d[0], z: old.n.z + d[1] },
    }));
    setRelationChecked(false);
  };
  const check = () =>
    setGraded(
      calc.valid &&
        answer.toLowerCase().includes(calc.relation.toLowerCase()) &&
        answer.includes(nice(calc.acute).toFixed(2)),
    );
  return (
    <section
      className="pa10163-page"
      data-testid="school-mockup-0837"
      data-object-model="dedicated-two-plane-dihedral-intersection-engine"
      data-relation={calc.relation}
      data-cross={tup(calc.c)}
      data-angle={angleText}
      data-intersection-point={tup(calc.point)}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Angle Between Two Planes</h1>
        <p>
          Explore the dihedral angle between two planes using a rotatable 3D
          model. The angle between planes equals the acute angle between their
          normals.
        </p>
        <div>
          <span>24 min</span>
          <span>ADVANCED</span>
          <span>VISUAL EXPLORATION</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="pa-lab">
        <section className="pa-title">
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Dihedral-Angle Explorer</h2>
            <p>
              Rotate the scene, change coefficients, and see how the angle
              follows the normals.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw />
            Reset view
          </button>
          <button
            onClick={() =>
              navigator.clipboard?.writeText(`Angle ${acuteText}°`)
            }
          >
            <Share2 />
            Share
          </button>
        </section>
        <section className="pa-top">
          <aside>
            <h3>PLANES (CHANGE COEFFICIENTS)</h3>
            {(
              [
                ["π₁", "1", p1],
                ["π₂", "2", p2],
              ] as const
            ).map(([name, id, p]) => (
              <article key={id}>
                <b>{name}: ax+by+cz=d</b>
                <fieldset>
                  {(["x", "y", "z"] as const).map((k, i) => (
                    <label key={k}>
                      {["a", "b", "c"][i]}
                      <input
                        aria-label={`plane ${id} ${k}`}
                        type="number"
                        step=".25"
                        value={p.n[k]}
                        onChange={(e) => set(+id as 1 | 2, k, +e.target.value)}
                      />
                    </label>
                  ))}
                  <label>
                    d
                    <input
                      aria-label={`plane ${id} d`}
                      type="number"
                      step=".25"
                      value={p.d}
                      onChange={(e) => set(+id as 1 | 2, "d", +e.target.value)}
                    />
                  </label>
                </fieldset>
              </article>
            ))}
            <div className="actions">
              <button onClick={random}>Random example</button>
              <button onClick={swap}>Swap planes</button>
              <button onClick={() => setRelationChecked(true)}>
                Check relation
              </button>
            </div>
            <section className="relation">
              <b>Relation between planes</b>
              <strong>
                {relationChecked
                  ? calc.relation
                  : "Inputs changed - check relation"}
              </strong>
              <p>Intersection direction: n₁ x n₂={tup(calc.c)}</p>
              {!calc.parallel && (
                <p>
                  Line: r={tup(calc.point)}+t{tup(calc.c)}
                </p>
              )}
              <p>
                Point check: n₁·r={nice(dot(p1.n, calc.point))}; n₂·r=
                {nice(dot(p2.n, calc.point))}
              </p>
            </section>
          </aside>
          <article className="pa-scene">
            <nav>
              <button
                className={view === "3D" ? "active" : ""}
                onClick={() => setView("3D")}
              >
                3D View
              </button>
              <button
                className={view === "2D" ? "active" : ""}
                onClick={() => setView("2D")}
              >
                2D Projection
              </button>
            </nav>
            <div
              className="pa-canvas"
              style={{
                transform: `perspective(900px) rotateY(${camera.rotate}deg) scale(${camera.zoom})`,
              }}
            >
              <svg
                viewBox="0 0 640 410"
                onPointerMove={move}
                onPointerUp={() => setDrag(null)}
                onPointerLeave={() => setDrag(null)}
                aria-label="Two planes and their normal vectors"
              >
                {grid &&
                  [0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      className="grid"
                      x1={80 + i * 90}
                      y1="320"
                      x2={240 + i * 70}
                      y2="170"
                    />
                  ))}
                <polygon
                  className="plane p1"
                  points="75,270 250,145 565,235 370,355"
                />
                <polygon
                  className="plane p2"
                  points="105,165 285,120 540,340 310,310"
                />
                <line className="axis" x1="80" y1="300" x2="570" y2="300" />
                <line
                  className="normal n1"
                  x1={o.x}
                  y1={o.y}
                  x2={n1p.x}
                  y2={n1p.y}
                />
                <line
                  className="normal n2"
                  x1={o.x}
                  y1={o.y}
                  x2={n2p.x}
                  y2={n2p.y}
                />
                {!calc.parallel && (
                  <line
                    className="intersection"
                    x1={o.x - (lp.x - o.x)}
                    y1={o.y - (lp.y - o.y)}
                    x2={lp.x}
                    y2={lp.y}
                  />
                )}
                <circle
                  aria-label="Normal 1 drag handle"
                  tabIndex={0}
                  className="handle n1h"
                  cx={n1p.x}
                  cy={n1p.y}
                  r="8"
                  onKeyDown={(e) => nudge(1, e)}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(1);
                  }}
                />
                <circle
                  aria-label="Normal 2 drag handle"
                  tabIndex={0}
                  className="handle n2h"
                  cx={n2p.x}
                  cy={n2p.y}
                  r="8"
                  onKeyDown={(e) => nudge(2, e)}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(2);
                  }}
                />
                <text x={n1p.x + 8} y={n1p.y}>
                  n₁={tup(p1.n)}
                </text>
                <text x={n2p.x + 8} y={n2p.y}>
                  n₂={tup(p2.n)}
                </text>
                <text x={o.x + 18} y={o.y - 18}>
                  θ={acuteText}°
                </text>
              </svg>
            </div>
            <footer>
              <button
                onClick={() =>
                  setCamera((v) => ({ ...v, rotate: v.rotate + 18 }))
                }
              >
                Rotate
              </button>
              <button
                onClick={() => setCamera((v) => ({ ...v, pan: v.pan + 15 }))}
              >
                Pan
              </button>
              <button
                onClick={() =>
                  setCamera((v) => ({
                    ...v,
                    zoom: Math.min(1.4, v.zoom + 0.1),
                  }))
                }
              >
                Zoom
              </button>
              <label>
                <input
                  aria-label="Show grid"
                  type="checkbox"
                  checked={grid}
                  onChange={(e) => setGrid(e.target.checked)}
                />
                Show grid
              </label>
              <button onClick={() => setCamera({ rotate: 0, pan: 0, zoom: 1 })}>
                Reset
              </button>
            </footer>
          </article>
        </section>
        <section className="pa-calc">
          <article>
            <h3>NORMALS</h3>
            <p>
              n₁={tup(p1.n)}, |n₁|={nice(calc.n1n)}
            </p>
            <p>
              n₂={tup(p2.n)}, |n₂|={nice(calc.n2n)}
            </p>
            <p>n₁·n₂={nice(calc.product)}</p>
          </article>
          <article>
            <h3>ANGLE BETWEEN NORMALS</h3>
            <p>cos θ=|n₁·n₂|/(|n₁||n₂|)</p>
            <strong>θ={acuteText}°</strong>
          </article>
          <article>
            <h3>ANGLE BETWEEN PLANES</h3>
            <strong>{angleText}°</strong>
            <label>
              <input
                aria-label="Supplementary angle"
                type="checkbox"
                checked={supplementary}
                onChange={(e) => setSupplementary(e.target.checked)}
              />
              Show supplementary angle
            </label>
          </article>
          <article className="important">
            <h3>IMPORTANT</h3>
            <p>
              Use absolute value |n₁·n₂| to get the acute angle between planes.
            </p>
          </article>
        </section>
        <section className="pa-special">
          <article>
            <h3>SPECIAL POSITIONS</h3>
            <div>
              <button onClick={() => preset("parallel")}>
                <b>Parallel</b>n₁ x n₂=0
              </button>
              <button onClick={() => preset("perpendicular")}>
                <b>Perpendicular planes</b>n₁·n₂=0
              </button>
              <button onClick={() => preset("coincident")}>
                <b>Coincident</b>parallel and consistent
              </button>
            </div>
          </article>
          <article>
            <h3>CURRENT STATUS</h3>
            <strong>{calc.relation} planes</strong>
            <p>n₁ x n₂={tup(calc.c)}</p>
            <p>Dihedral angle={acuteText}°</p>
          </article>
        </section>
        <section className="pa-notes">
          <article>
            <h3>WORKED EXAMPLE</h3>
            <p>For n₁=(1,2,2), n₂=(2,-1,2), dot=4 and both norms are 3.</p>
            <p>cos θ=4/9, so θ={nice((Math.acos(4 / 9) * 180) / Math.PI)}°.</p>
            <p>
              Correct intersection direction is (6,2,-5), through the origin.
            </p>
          </article>
          <article>
            <h3>NOTES</h3>
            <ul>
              <li>The dihedral angle is between 0° and 90°.</li>
              <li>Rotate the model to see how normals determine θ.</li>
              <li>Cross product zero means parallel or coincident.</li>
              <li>Dot product zero means perpendicular.</li>
            </ul>
          </article>
        </section>
        <section className="pa-practice">
          <article>
            <h3>PRACTICE</h3>
            <ol>
              <li>Find the angle between 2x+y+2z=0 and x-y+2z=0.</li>
              <li>Find the angle between 3x+4y-5z=0 and 6x-8y+10z=0.</li>
              <li>Find a normal if the angle is 45°.</li>
            </ol>
            <button onClick={() => setSolutions((s) => !s)}>
              <Eye />
              Show solutions
            </button>
            {solutions && (
              <p>Use cos θ=|n₁·n₂|/(|n₁||n₂|), then test cross/dot products.</p>
            )}
          </article>
          <article>
            <h3>QUICK CHECKS</h3>
            <p>
              Parallel? <b>{calc.parallel ? "Yes" : "No"}</b>
            </p>
            <p>
              Perpendicular? <b>{calc.perpendicular ? "Yes" : "No"}</b>
            </p>
            <p>
              Acute angle? <b>{acuteText}°</b>
            </p>
            <h3>ASSESSMENT PROMPT</h3>
            <input
              aria-label="Assessment answer"
              placeholder="relation, angle to 2 decimals"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={check}>Check</button>
            {graded !== null &&
              (graded ? <Check className="yes" /> : <X className="no" />)}
          </article>
        </section>
        <nav className="pa-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-distance-from-point-to-plane">
            ← Distance from Point to Plane
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-angle-between-line-and-plane">
            Angle Between Line and Plane →
          </a>
        </nav>
        <footer className="pa-footer">
          <b>Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
          <span>© 2026 INDIAN SERVERS PRIVATE LIMITED.</span>
        </footer>
      </main>
    </section>
  );
}
