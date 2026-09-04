import { Check, Eye, Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InterceptPlaneTargetLesson10161.css";

type Axis = "a" | "b" | "c";
type I = { a: number; b: number; c: number };
const I0: I = { a: 4, b: 3, c: 2 };
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a)),
  nice = (n: number) => Number(n.toFixed(3));
const finite = (n: number) => Number.isFinite(n),
  show = (n: number) => (finite(n) ? String(nice(n)) : "∞");
const standardForm = (values: [number, string][], rhs: number) => {
  const terms = values.filter(([value]) => Math.abs(value) > 1e-9);
  return `${terms
    .map(([value, variable], index) => {
      const sign = value < 0 ? (index ? " - " : "-") : index ? " + " : "";
      return `${sign}${Math.abs(value)}${variable}`;
    })
    .join("")} = ${nice(rhs)}`;
};

export default function InterceptPlaneTargetLesson10161({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [v, setV] = useState<I>(I0),
    [layers, setLayers] = useState({
      axes: true,
      plane: true,
      traces: true,
      tetrahedron: true,
    }),
    [camera, setCamera] = useState(0),
    [solutions, setSolutions] = useState(false),
    [drag, setDrag] = useState<Axis | null>(null);
  const calc = useMemo(() => {
    const allFinite = finite(v.a) && finite(v.b) && finite(v.c),
      A = finite(v.a) ? 1 / v.a : 0,
      B = finite(v.b) ? 1 / v.b : 0,
      C = finite(v.c) ? 1 / v.c : 0;
    let sx = 0,
      sy = 0,
      sz = 0,
      rhs = 1;
    if (allFinite) {
      sx = v.b * v.c;
      sy = v.a * v.c;
      sz = v.a * v.b;
      rhs = v.a * v.b * v.c;
      const divisor =
        gcd(
          gcd(Math.round(Math.abs(sx)), Math.round(Math.abs(sy))),
          gcd(Math.round(Math.abs(sz)), Math.round(Math.abs(rhs))),
        ) || 1;
      sx /= divisor;
      sy /= divisor;
      sz /= divisor;
      rhs /= divisor;
    } else {
      const vals = [v.a, v.b, v.c].filter(finite);
      const product = vals.reduce((p, n) => p * n, 1);
      sx = A * product;
      sy = B * product;
      sz = C * product;
      rhs = product;
    }
    const normalLength = Math.hypot(sx, sy, sz),
      distance = normalLength ? Math.abs(rhs) / normalLength : NaN,
      volume = allFinite ? Math.abs(v.a * v.b * v.c) / 6 : Infinity,
      area = allFinite
        ? 0.5 * Math.hypot(v.a * v.b, v.a * v.c, v.b * v.c)
        : Infinity;
    return {
      allFinite,
      A,
      B,
      C,
      sx,
      sy,
      sz,
      rhs,
      normalLength,
      distance,
      volume,
      area,
    };
  }, [v]);
  const intercept = `x/${show(v.a)} + y/${show(v.b)} + z/${show(v.c)} = 1`,
    standard = standardForm(
      [
        [nice(calc.sx), "x"],
        [nice(calc.sy), "y"],
        [nice(calc.sz), "z"],
      ],
      calc.rhs,
    );
  const set = (axis: Axis, value: number) =>
    setV((s) => ({
      ...s,
      [axis]: Math.abs(value) < 0.25 ? (value < 0 ? -0.25 : 0.25) : nice(value),
    }));
  const reset = () => {
    setV(I0);
    setLayers({ axes: true, plane: true, traces: true, tetrahedron: true });
    setCamera(0);
    setSolutions(false);
  };
  const xy = (axis: Axis, n: number) =>
      axis === "a"
        ? { x: 305 + n * 48, y: 305 }
        : axis === "b"
          ? { x: 305 + n * 27, y: 305 - n * 18 }
          : { x: 305, y: 305 - n * 62 },
    A = xy("a", finite(v.a) ? v.a : 6),
    B = xy("b", finite(v.b) ? v.b : 6),
    C = xy("c", finite(v.c) ? v.c : 5);
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = ((e.clientX - r.left) / r.width) * 640,
      y = ((e.clientY - r.top) / r.height) * 430;
    set(
      drag,
      drag === "a"
        ? (x - 305) / 48
        : drag === "b"
          ? (x - 305) / 27
          : (305 - y) / 62,
    );
  };
  const nudge = (axis: Axis, e: KeyboardEvent<SVGCircleElement>) => {
    if (["ArrowRight", "ArrowUp"].includes(e.key))
      set(axis, (finite(v[axis]) ? v[axis] : 4) + 0.25);
    if (["ArrowLeft", "ArrowDown"].includes(e.key))
      set(axis, (finite(v[axis]) ? v[axis] : 4) - 0.25);
  };
  const presets = [
    I0,
    { a: 6, b: 4, c: 3 },
    { a: 3, b: 3, c: 3 },
    { a: Infinity, b: 3, c: 2 },
  ];
  return (
    <section
      className="ip10161-page"
      data-testid="school-mockup-0835"
      data-object-model="dedicated-three-axis-intercept-plane-engine"
      data-intercepts={`${show(v.a)},${show(v.b)},${show(v.c)}`}
      data-standard={standard}
      data-volume={show(calc.volume)}
      data-distance={nice(calc.distance)}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Intercept Form of a Plane</h1>
        <p>
          Interact with the intercepts below. Move the sliders or drag the
          handles on the axes to see how the plane changes.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="ip-lab">
        <section className="ip-top">
          <article className="ip-scene">
            <h3>3D INTERCEPT EXPLORER</h3>
            <div className="forms">
              <span>
                <b>Intercept form</b>
                {intercept}
              </span>
              <i>↔</i>
              <span>
                <b>Standard form</b>
                {standard}
              </span>
            </div>
            <div
              className="ip-canvas"
              style={{ transform: `perspective(900px) rotateY(${camera}deg)` }}
            >
              <svg
                viewBox="0 0 640 430"
                onPointerMove={move}
                onPointerUp={() => setDrag(null)}
                onPointerLeave={() => setDrag(null)}
                aria-label="Plane through three coordinate-axis intercepts"
              >
                {layers.axes && (
                  <>
                    <line
                      className="axis x"
                      x1="90"
                      y1="305"
                      x2="590"
                      y2="305"
                    />
                    <line
                      className="axis y"
                      x1="305"
                      y1="365"
                      x2="530"
                      y2="160"
                    />
                    <line
                      className="axis z"
                      x1="305"
                      y1="365"
                      x2="305"
                      y2="45"
                    />
                  </>
                )}
                {layers.plane && (
                  <polygon
                    className="plane"
                    points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
                  />
                )}{" "}
                {layers.tetrahedron && (
                  <>
                    <line
                      className="tetra"
                      x1="305"
                      y1="305"
                      x2={A.x}
                      y2={A.y}
                    />
                    <line
                      className="tetra"
                      x1="305"
                      y1="305"
                      x2={B.x}
                      y2={B.y}
                    />
                    <line
                      className="tetra"
                      x1="305"
                      y1="305"
                      x2={C.x}
                      y2={C.y}
                    />
                  </>
                )}
                {layers.traces && (
                  <>
                    <line
                      className="trace ab"
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                    />
                    <line
                      className="trace ac"
                      x1={A.x}
                      y1={A.y}
                      x2={C.x}
                      y2={C.y}
                    />
                    <line
                      className="trace bc"
                      x1={B.x}
                      y1={B.y}
                      x2={C.x}
                      y2={C.y}
                    />
                  </>
                )}
                {(
                  [
                    ["a", A, "A"],
                    ["b", B, "B"],
                    ["c", C, "C"],
                  ] as const
                ).map(([axis, p, label]) => (
                  <g key={axis}>
                    <circle
                      aria-label={`${axis} intercept drag handle`}
                      tabIndex={0}
                      className={`handle ${axis}`}
                      cx={p.x}
                      cy={p.y}
                      r="9"
                      onKeyDown={(e) => nudge(axis, e)}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDrag(axis);
                      }}
                    />
                    <text x={p.x + 8} y={p.y - 8}>
                      {label} ({axis === "a" ? show(v.a) : 0},{" "}
                      {axis === "b" ? show(v.b) : 0},{" "}
                      {axis === "c" ? show(v.c) : 0})
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <footer>
              {(Object.keys(layers) as (keyof typeof layers)[]).map((k) => (
                <label key={k}>
                  <input
                    aria-label={`Show ${k}`}
                    type="checkbox"
                    checked={layers[k]}
                    onChange={(e) =>
                      setLayers((s) => ({ ...s, [k]: e.target.checked }))
                    }
                  />
                  Show {k}
                </label>
              ))}
              <button onClick={() => setCamera((a) => a + 18)}>
                Rotate view
              </button>
              <button onClick={() => setCamera(0)}>
                <RotateCcw />
                Reset view
              </button>
            </footer>
          </article>
          <aside>
            <section className="controls">
              <h3>INTERCEPT CONTROLS</h3>
              <p>Drag sliders or axis handles to change intercepts.</p>
              {(["a", "b", "c"] as Axis[]).map((axis, i) => (
                <article key={axis}>
                  <b>
                    {axis} ({["x", "y", "z"][i]}-intercept)
                  </b>
                  <div>
                    <input
                      aria-label={`${axis} intercept slider`}
                      type="range"
                      min="-8"
                      max="8"
                      step=".25"
                      disabled={!finite(v[axis])}
                      value={finite(v[axis]) ? v[axis] : 0}
                      onInput={(e) => set(axis, +e.currentTarget.value)}
                      onChange={() => {}}
                    />
                    <strong>{show(v[axis])}</strong>
                    <button
                      aria-label={`Decrease ${axis}`}
                      onClick={() =>
                        set(axis, (finite(v[axis]) ? v[axis] : 4) - 0.25)
                      }
                    >
                      <Minus />
                    </button>
                    <button
                      aria-label={`Increase ${axis}`}
                      onClick={() =>
                        set(axis, (finite(v[axis]) ? v[axis] : 4) + 0.25)
                      }
                    >
                      <Plus />
                    </button>
                  </div>
                </article>
              ))}
              <b>Quick presets</b>
              <div className="presets">
                {presets.map((p, i) => (
                  <button key={i} onClick={() => setV(p)}>
                    ({show(p.a)}, {show(p.b)}, {show(p.c)})
                  </button>
                ))}
                <button onClick={reset}>
                  <RotateCcw /> Reset all
                </button>
              </div>
            </section>
            <section className="enrichment">
              <h3>TETRAHEDRON ENRICHMENT</h3>
              <p>The plane with the coordinate planes forms a tetrahedron.</p>
              <strong>Volume = |abc|/6 = {show(calc.volume)}</strong>
              <b>
                {finite(calc.volume)
                  ? `${nice(calc.volume)} cubic units`
                  : "Unbounded when an intercept is infinite"}
              </b>
            </section>
          </aside>
        </section>
        <section className="ip-table">
          <article>
            <h3>INTERCEPT TABLE</h3>
            <table>
              <tbody>
                {(["a", "b", "c"] as Axis[]).map((axis, i) => (
                  <tr key={axis}>
                    <td>{["x", "y", "z"][i]}-axis</td>
                    <td>
                      {axis}={show(v[axis])}
                    </td>
                    <td>
                      ({axis === "a" ? show(v.a) : 0},
                      {axis === "b" ? show(v.b) : 0},
                      {axis === "c" ? show(v.c) : 0})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>General intercept form: {intercept}</p>
            <p>Standard form: {standard}</p>
          </article>
          <article>
            <h3>TRACES ON COORDINATE PLANES</h3>
            <div className="traces">
              <span>
                <b>xy-plane (z=0)</b>x/{show(v.a)} + y/{show(v.b)} = 1
              </span>
              <span>
                <b>xz-plane (y=0)</b>x/{show(v.a)} + z/{show(v.c)} = 1
              </span>
              <span>
                <b>yz-plane (x=0)</b>y/{show(v.b)} + z/{show(v.c)} = 1
              </span>
            </div>
          </article>
        </section>
        <section className="ip-grid">
          <article>
            <h3>INTERACTIONS &amp; SPECIAL CASES</h3>
            <p>
              If an intercept is zero, intercept form is invalid; the editor
              clamps finite intercepts away from zero.
            </p>
            <p>
              If an intercept is infinite, its term vanishes and the plane is
              parallel to that axis.
            </p>
          </article>
          <article className="pitfall">
            <h3>COMMON PITFALL</h3>
            <p>Do not confuse denominators with coefficients.</p>
            <b>x/4+y/3+z/2=1 is not 4x+3y+2z=1.</b>
            <p>Its standard form is 3x+4y+6z=12.</p>
          </article>
          <article>
            <h3>VECTOR &amp; GEOMETRIC VIEW</h3>
            <p>
              Intercept points A({show(v.a)},0,0), B(0,{show(v.b)},0), C(0,0,
              {show(v.c)}).
            </p>
            <p>
              Normal vector n=({nice(calc.sx)},{nice(calc.sy)},{nice(calc.sz)}).
            </p>
            <p>
              Triangle area={show(calc.area)}; distance from origin=
              {nice(calc.distance)}.
            </p>
          </article>
          <article>
            <h3>WORKED EXAMPLE</h3>
            <p>For a=6, b=-3, c=2: x/6-y/3+z/2=1.</p>
            <p>Multiply by 6 to obtain x-2y+3z=6.</p>
            <p>Check all three intercept points by substitution.</p>
          </article>
          <article className="practice">
            <h3>PRACTICE</h3>
            <ol>
              <li>a=2,b=5,c=10</li>
              <li>A(3,0,0), B(0,4,0), C(0,0,6)</li>
              <li>a=-4,b=6,c=-3</li>
              <li>Parallel to yz-plane through (0,0,5)</li>
            </ol>
            <button onClick={() => setSolutions((s) => !s)}>
              <Eye />
              Show solutions
            </button>
            {solutions && <p>5x+2y+z=10; 4x+3y+2z=12; -3x+2y-4z=12; x=0.</p>}
          </article>
        </section>
        <section className="ip-checks">
          <h3>IMPORTANT FORMULAE &amp; CHECKS</h3>
          <div>
            <span>
              Intercept form<b>x/a+y/b+z/c=1</b>
            </span>
            <span>
              Standard form<b>{standard}</b>
            </span>
            <span>
              Normal vector
              <b>
                ({calc.sx},{calc.sy},{calc.sz})
              </b>
            </span>
            <span>
              Distance from origin<b>{nice(calc.distance)}</b>
            </span>
            <span>
              Volume<b>{show(calc.volume)}</b>
            </span>
          </div>
          <p>
            <Check />
            Verify plane equation <Check />
            Check intercepts <Check />
            Confirm traces <Check />
            Compute volume <Check />
            Verify normals
          </p>
        </section>
        <nav className="ip-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-point-normal-form">
            ← Point-Normal Form
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-distance-from-point-to-plane">
            Distance From Point to Plane →
          </a>
        </nav>
        <footer className="ip-footer">
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
