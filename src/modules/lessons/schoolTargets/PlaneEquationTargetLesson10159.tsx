import { Check, Clipboard, Move3d, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PlaneEquationTargetLesson10159.css";

type V = { x: number; y: number; z: number };
const P0: V = { x: 1, y: 2, z: 0 },
  N0: V = { x: 2, y: -1, z: 3 };
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z;
const mag = (a: V) => Math.hypot(a.x, a.y, a.z);
const nice = (v: number) => Number(v.toFixed(3));
const tuple = (v: V) => `(${nice(v.x)}, ${nice(v.y)}, ${nice(v.z)})`;
const term = (c: number, variable: string, first = false) =>
  c === 0
    ? ""
    : `${!first && c > 0 ? " + " : c < 0 ? " - " : ""}${Math.abs(c) === 1 ? "" : Math.abs(c)}${variable}`;

export default function PlaneEquationTargetLesson10159({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [p, setP] = useState(P0),
    [normal, setNormal] = useState(N0),
    [q, setQ] = useState<V>({ x: 0, y: 0, z: 0 });
  const [custom, setCustom] = useState<V>({ x: 1, y: 0, z: 0 }),
    [customAdded, setCustomAdded] = useState(false);
  const [layers, setLayers] = useState({
    plane: true,
    point: true,
    normal: true,
    perpendicular: true,
    axes: true,
    grid: true,
  });
  const [camera, setCamera] = useState({ rotate: 0, pan: 0, zoom: 1 }),
    [details, setDetails] = useState(false),
    [checked, setChecked] = useState(false),
    [drag, setDrag] = useState(false);
  const [activeTab, setActiveTab] = useState("3D VIEW");
  const calc = useMemo(() => {
    const d = -dot(normal, p),
      length = mag(normal),
      valid = length > 1e-8,
      evaluate = (v: V) => dot(normal, v) + d,
      distance = (v: V) => (valid ? Math.abs(evaluate(v)) / length : NaN);
    return { d, length, valid, evaluate, distance };
  }, [p, normal]);
  const equation = `${term(normal.x, "x", true)}${term(normal.y, "y")}${term(normal.z, "z")}${calc.d ? `${calc.d > 0 ? " + " : " - "}${Math.abs(calc.d)}` : ""} = 0`;
  const set = (kind: "p" | "n" | "q" | "c", axis: keyof V, value: number) =>
    kind === "p"
      ? setP((v) => ({ ...v, [axis]: value }))
      : kind === "n"
        ? setNormal((v) => ({ ...v, [axis]: value }))
        : kind === "q"
          ? setQ((v) => ({ ...v, [axis]: value }))
          : setCustom((v) => ({ ...v, [axis]: value }));
  const reset = () => {
    setP(P0);
    setNormal(N0);
    setQ({ x: 0, y: 0, z: 0 });
    setCustom({ x: 1, y: 0, z: 0 });
    setCustomAdded(false);
    setLayers({
      plane: true,
      point: true,
      normal: true,
      perpendicular: true,
      axes: true,
      grid: true,
    });
    setCamera({ rotate: 0, pan: 0, zoom: 1 });
    setChecked(false);
    setActiveTab("3D VIEW");
  };
  const xy = (v: V) => ({
    x: 310 + v.x * 48 + v.y * 20 + camera.pan,
    y: 245 - v.z * 48 - v.y * 18,
  });
  const pp = xy(p),
    np = xy({
      x: p.x + normal.x * 0.75,
      y: p.y + normal.y * 0.75,
      z: p.z + normal.z * 0.75,
    });
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const r = e.currentTarget.getBoundingClientRect();
    setP((v) => ({
      ...v,
      x: nice((((e.clientX - r.left) / r.width) * 620 - 310 - camera.pan) / 48),
      z: nice((245 - ((e.clientY - r.top) / r.height) * 390) / 48),
    }));
  };
  const nudge = (e: KeyboardEvent<SVGCircleElement>) => {
    const d =
      e.key === "ArrowLeft"
        ? [-0.25, 0]
        : e.key === "ArrowRight"
          ? [0.25, 0]
          : e.key === "ArrowUp"
            ? [0, 0.25]
            : e.key === "ArrowDown"
              ? [0, -0.25]
              : null;
    if (d) setP((v) => ({ ...v, x: v.x + d[0], z: v.z + d[1] }));
  };
  const points: [string, V][] = [
    ["P", p],
    ["A", { x: 2, y: 3, z: -1 }],
    ["B", { x: 0, y: 0, z: 0 }],
    ["C", { x: 1, y: 0, z: 0 }],
    ...(customAdded ? [["Q", custom] as [string, V]] : []),
  ];
  return (
    <section
      className="pe10159-page"
      data-testid="school-mockup-0833"
      data-object-model="dedicated-point-normal-plane-equation-engine"
      data-equation={equation}
      data-magnitude={nice(calc.length)}
      data-point={tuple(p)}
      data-normal={tuple(normal)}
      data-distance={nice(calc.distance(q))}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Plane Equation</h1>
        <p>
          Construct and explore a plane using a point P and a normal vector n.
          Rotate, drag, and observe how the equation updates in real time.
        </p>
        <div>
          <span>22 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
          <span>interactive</span>
        </div>
      </header>
      <main className="pe-lab">
        <section className="pe-main">
          <aside>
            <h3>PLANE CONSTRUCTOR</h3>
            <p>Drag P or rotate/resize n to update the plane.</p>
            {(
              [
                ["Point on plane (P)", "p", p],
                ["Normal vector (n)", "n", normal],
              ] as const
            ).map(([title, kind, value]) => (
              <fieldset key={kind}>
                <legend>{title}</legend>
                {(["x", "y", "z"] as const).map((axis) => (
                  <label key={axis}>
                    {axis}
                    <input
                      aria-label={`${kind} ${axis}`}
                      type="number"
                      step=".25"
                      value={value[axis]}
                      onChange={(e) => set(kind, axis, +e.target.value)}
                    />
                  </label>
                ))}
              </fieldset>
            ))}
            <b>Length |n| = {nice(calc.length)}</b>
            <input
              aria-label="Normal magnitude"
              type="range"
              min=".25"
              max="8"
              step=".25"
              value={Math.max(0.25, calc.length)}
              onInput={(e) => {
                const target = +e.currentTarget.value,
                  f = calc.length ? target / calc.length : 1;
                setNormal((v) => ({
                  x: nice(v.x * f),
                  y: nice(v.y * f),
                  z: nice(v.z * f),
                }));
              }}
              onChange={() => {}}
            />
            <button onClick={reset}>
              <RotateCcw />
              Reset to given values
            </button>
            <section className="derivation">
              <h3>EQUATION DERIVATION</h3>
              <h2>Vector form (point-normal)</h2>
              <strong>n · (r - a) = 0</strong>
              <p>
                Given P{tuple(p)}, n={tuple(normal)}
              </p>
              <p>
                Substitute: {tuple(normal)} · ((x,y,z)-{tuple(p)})=0
              </p>
              <p>Expand and simplify</p>
              <strong className={calc.valid ? "final" : "invalid"}>
                {calc.valid ? equation : "Normal vector cannot be zero"}
              </strong>
              <footer>
                <button
                  onClick={() => navigator.clipboard?.writeText(equation)}
                >
                  <Clipboard />
                  Copy equation
                </button>
                <button onClick={() => setDetails((v) => !v)}>
                  Step details
                </button>
              </footer>
              {details && (
                <p>
                  Every displacement in the plane is perpendicular to n, so its
                  dot product with n is zero.
                </p>
              )}
            </section>
          </aside>
          <article className="pe-view" data-tab={activeTab}>
            <nav>
              {[
                "3D VIEW",
                "COEFFICIENTS",
                "TEST POINTS",
                "EQUIVALENT EQUATIONS",
              ].map((x) => (
                <button
                  className={activeTab === x ? "active" : ""}
                  onClick={() => setActiveTab(x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </nav>
            <p className="tab-note">
              {activeTab === "3D VIEW"
                ? "Interactive plane, point, normal, and perpendicular line."
                : activeTab === "COEFFICIENTS"
                  ? `Coefficients (${normal.x}, ${normal.y}, ${normal.z}, ${calc.d}) define the current plane.`
                  : activeTab === "TEST POINTS"
                    ? "Use substitution below to classify points on or off the plane."
                    : "Every nonzero scalar multiple below represents this same plane."}
            </p>
            <div className="tools">
              <button
                onClick={() =>
                  setCamera((v) => ({ ...v, rotate: v.rotate + 18 }))
                }
              >
                <Move3d />
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
                    zoom: Math.min(1.6, v.zoom + 0.1),
                  }))
                }
              >
                Zoom
              </button>
              <button
                onClick={() => setLayers((v) => ({ ...v, axes: !v.axes }))}
              >
                Axes
              </button>
              <button
                onClick={() => setLayers((v) => ({ ...v, grid: !v.grid }))}
              >
                Grid
              </button>
              <button onClick={() => setCamera({ rotate: 0, pan: 0, zoom: 1 })}>
                Reset
              </button>
            </div>
            <div
              className="plane-scene"
              style={{
                transform: `perspective(900px) rotateY(${camera.rotate}deg) scale(${camera.zoom})`,
              }}
            >
              <svg
                viewBox="0 0 620 390"
                onPointerMove={move}
                onPointerUp={() => setDrag(false)}
                onPointerLeave={() => setDrag(false)}
                aria-label="Plane through a point with normal vector"
              >
                {layers.plane && (
                  <polygon
                    className="plane"
                    points="70,280 260,155 555,215 365,340"
                  />
                )}
                {layers.grid &&
                  [0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      className="grid"
                      x1={90 + i * 80}
                      y1="270"
                      x2={260 + i * 70}
                      y2="175"
                    />
                  ))}
                {layers.axes && (
                  <>
                    <line
                      className="axis x"
                      x1="70"
                      y1="285"
                      x2="560"
                      y2="285"
                    />
                    <line
                      className="axis z"
                      x1="310"
                      y1="350"
                      x2="310"
                      y2="45"
                    />
                    <line
                      className="axis y"
                      x1="105"
                      y1="340"
                      x2="520"
                      y2="115"
                    />
                  </>
                )}
                {layers.perpendicular && (
                  <line
                    className="perp"
                    x1={pp.x}
                    y1={pp.y}
                    x2={
                      xy({
                        x: p.x - normal.x * 0.65,
                        y: p.y - normal.y * 0.65,
                        z: p.z - normal.z * 0.65,
                      }).x
                    }
                    y2={
                      xy({
                        x: p.x - normal.x * 0.65,
                        y: p.y - normal.y * 0.65,
                        z: p.z - normal.z * 0.65,
                      }).y
                    }
                  />
                )}{" "}
                {layers.normal && (
                  <line
                    className="normal"
                    x1={pp.x}
                    y1={pp.y}
                    x2={np.x}
                    y2={np.y}
                  />
                )}{" "}
                {layers.point && (
                  <circle
                    aria-label="Plane point drag handle"
                    tabIndex={0}
                    className="point"
                    cx={pp.x}
                    cy={pp.y}
                    r="8"
                    onKeyDown={nudge}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDrag(true);
                    }}
                  />
                )}
                <text x={pp.x + 10} y={pp.y - 8}>
                  P{tuple(p)}
                </text>
                <text x={np.x + 8} y={np.y}>
                  n={tuple(normal)}
                </text>
                <text className="eq-label" x="425" y="250">
                  {equation}
                </text>
              </svg>
            </div>
            <section className="layer-list">
              {(Object.keys(layers) as (keyof typeof layers)[]).map((key) => (
                <label key={key}>
                  <input
                    aria-label={`Layer ${key}`}
                    type="checkbox"
                    checked={layers[key]}
                    onChange={(e) =>
                      setLayers((v) => ({ ...v, [key]: e.target.checked }))
                    }
                  />
                  {key}
                </label>
              ))}
              <article>
                <b>Visual facts (always true)</b>
                <p>n is perpendicular to the plane.</p>
                <p>The line through P parallel to n is perpendicular.</p>
              </article>
            </section>
          </article>
        </section>
        <section className="warning">
          <h3>Important: One point is not enough</h3>
          <p>
            A single point determines infinitely many planes. A point and normal
            vector, or three non-collinear points, determine one plane.
          </p>
        </section>
        <section className="pe-grid">
          <article>
            <h3>TEST POINTS (on or off the plane)</h3>
            <table>
              <tbody>
                {points.map(([name, v]) => {
                  const value = calc.evaluate(v),
                    on = Math.abs(value) < 1e-7;
                  return (
                    <tr key={name}>
                      <td>
                        {name}
                        {tuple(v)}
                      </td>
                      <td>{equation.replace("= 0", `= ${nice(value)}`)}</td>
                      <td className={on ? "yes" : "no"}>
                        {on ? <Check /> : <X />}
                        {on ? "On plane" : "Off plane"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="custom">
              {(["x", "y", "z"] as const).map((a) => (
                <input
                  key={a}
                  aria-label={`Custom point ${a}`}
                  type="number"
                  value={custom[a]}
                  onChange={(e) => set("c", a, +e.target.value)}
                />
              ))}
              <button onClick={() => setCustomAdded(true)}>
                Add custom point
              </button>
            </div>
          </article>
          <article>
            <h3>COEFFICIENTS ↔ NORMAL CONNECTION</h3>
            <p>For ax+by+cz+d=0, the normal vector is n=(a,b,c).</p>
            <strong>{equation}</strong>
            <p>
              Coefficients: ({normal.x},{normal.y},{normal.z},{calc.d})
            </p>
            <p>Magnitude |n|={nice(calc.length)}</p>
          </article>
          <article>
            <h3>MULTIPLE EQUIVALENT EQUATIONS</h3>
            {[1, 2, -1, 0.5].map((k) => (
              <p key={k}>
                <b>{k}x:</b> {term(k * normal.x, "x", true)}
                {term(k * normal.y, "y")}
                {term(k * normal.z, "z")}{" "}
                {k * calc.d
                  ? `${k * calc.d > 0 ? "+" : "-"} ${Math.abs(k * calc.d)}`
                  : ""}
                =0
              </p>
            ))}
          </article>
          <article>
            <h3>POINT-PLANE DISTANCE</h3>
            <p>d=|ax₀+by₀+cz₀+d|/√(a²+b²+c²)</p>
            <div className="qinputs">
              {(["x", "y", "z"] as const).map((a) => (
                <input
                  key={a}
                  aria-label={`Distance point ${a}`}
                  type="number"
                  value={q[a]}
                  onChange={(e) => set("q", a, +e.target.value)}
                />
              ))}
            </div>
            <strong>
              distance = {calc.valid ? nice(calc.distance(q)) : "undefined"}
            </strong>
          </article>
          <article>
            <h3>WORKED EXAMPLE</h3>
            <ol>
              <li>Choose P and n.</li>
              <li>Write n · (r-P)=0.</li>
              <li>Expand component products.</li>
              <li>Collect terms.</li>
            </ol>
            <strong>Final plane: {equation}</strong>
          </article>
          <article>
            <h3>PRACTICE</h3>
            <ol>
              <li>Plane through (1,0,2), normal (3,1,-1).</li>
              <li>Plane through (-2,3,1), normal (2,-2,1).</li>
              <li>Find a normal to 4x-2y+z+5=0.</li>
            </ol>
            <button onClick={() => setChecked(true)}>Check answers</button>
            {checked && (
              <p className="yes">
                <Check />
                Use 3x+y-z-1=0; 2x-2y+z+9=0; n=(4,-2,1).
              </p>
            )}
          </article>
        </section>
        <nav className="pe-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-shortest-distance-between-lines">
            ← Shortest Distance Between Lines
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-point-normal-form">
            Point-Normal Form →
          </a>
        </nav>
        <footer className="pe-footer">
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
