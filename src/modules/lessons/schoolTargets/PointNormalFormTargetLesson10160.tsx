import { Check, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PointNormalFormTargetLesson10160.css";

type V = { x: number; y: number; z: number };
const P0: V = { x: 1, y: -2, z: 3 },
  N0: V = { x: 2, y: 1, z: -1 },
  R0: V = { x: 0.4, y: -0.6, z: 1.8 };
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z,
  sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  mag = (a: V) => Math.hypot(a.x, a.y, a.z),
  num = (v: number) => Number(v.toFixed(4)),
  tup = (v: V) => `(${num(v.x)}, ${num(v.y)}, ${num(v.z)})`;
const term = (c: number, s: string, first = false) =>
  c === 0
    ? ""
    : `${c < 0 ? (first ? "-" : " - ") : first ? "" : " + "}${Math.abs(c) === 1 ? "" : Math.abs(c)}${s}`;

export default function PointNormalFormTargetLesson10160({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [p, setP] = useState(P0),
    [normal, setNormal] = useState(N0),
    [r, setR] = useState(R0),
    [layers, setLayers] = useState({
      plane: true,
      normal: true,
      displacement: true,
      perpendicular: true,
      axes: true,
    }),
    [camera, setCamera] = useState(0),
    [drag, setDrag] = useState(false),
    [answers, setAnswers] = useState(["", "", "", ""]),
    [graded, setGraded] = useState<boolean[]>([]);
  const calc = useMemo(() => {
    const displacement = sub(r, p),
      normalLength = mag(normal),
      residual = dot(normal, displacement),
      d = -dot(normal, p),
      distance = normalLength ? Math.abs(residual) / normalLength : NaN,
      on = Math.abs(residual) < 1e-7,
      valid = normalLength > 1e-8;
    return { displacement, normalLength, residual, d, distance, on, valid };
  }, [p, normal, r]);
  const equation = `${term(normal.x, "x", true)}${term(normal.y, "y")}${term(normal.z, "z")}${calc.d ? `${calc.d > 0 ? " + " : " - "}${Math.abs(calc.d)}` : ""} = 0`;
  const set = (kind: "p" | "n" | "r", axis: keyof V, value: number) =>
    kind === "p"
      ? setP((v) => ({ ...v, [axis]: value }))
      : kind === "n"
        ? setNormal((v) => ({ ...v, [axis]: value }))
        : setR((v) => ({ ...v, [axis]: value }));
  const reset = () => {
    setP(P0);
    setNormal(N0);
    setR(R0);
    setLayers({
      plane: true,
      normal: true,
      displacement: true,
      perpendicular: true,
      axes: true,
    });
    setCamera(0);
    setAnswers(["", "", "", ""]);
    setGraded([]);
  };
  const xy = (v: V) => ({
      x: 320 + v.x * 48 + v.y * 19,
      y: 255 - v.z * 48 - v.y * 16,
    }),
    pp = xy(p),
    rr = xy(r),
    nn = xy({
      x: p.x + normal.x * 0.8,
      y: p.y + normal.y * 0.8,
      z: p.z + normal.z * 0.8,
    });
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const b = e.currentTarget.getBoundingClientRect();
    setR((v) => ({
      ...v,
      x: num((((e.clientX - b.left) / b.width) * 640 - 320) / 48),
      z: num((255 - ((e.clientY - b.top) / b.height) * 420) / 48),
    }));
  };
  const nudge = (e: KeyboardEvent<SVGCircleElement>) => {
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
    if (d) setR((v) => ({ ...v, x: v.x + d[0], z: v.z + d[1] }));
  };
  const pick = (type: "on" | "plus" | "minus" | "random") =>
    type === "on"
      ? setR({ x: p.x + normal.y, y: p.y - normal.x, z: p.z })
      : type === "plus"
        ? setR({ x: p.x + normal.x, y: p.y + normal.y, z: p.z + normal.z })
        : type === "minus"
          ? setR({ x: p.x - normal.x, y: p.y - normal.y, z: p.z - normal.z })
          : setR({ x: -1.25, y: 0.5, z: 2.25 });
  const expected = ["0", "no", "4", "1.633"];
  const grade = (i: number) =>
    setGraded((g) => {
      const v = [...g];
      v[i] = answers[i].trim().toLowerCase() === expected[i];
      return v;
    });
  return (
    <section
      className="pn10160-page"
      data-testid="school-mockup-0834"
      data-object-model="dedicated-point-normal-displacement-orthogonality-engine"
      data-equation={equation}
      data-residual={num(calc.residual)}
      data-distance={num(calc.distance)}
      data-on-plane={String(calc.on)}
      data-point={tup(r)}
      data-camera={camera}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Point-Normal Form</h1>
        <p>A plane through point P₀ with normal vector n:</p>
        <strong>n · (r - r₀) = 0</strong>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main className="pn-lab">
        <section className="pn-top">
          <aside>
            <h3>INTERACTIVE POINT-NORMAL BUILDER</h3>
            {(
              [
                ["1. Point on plane P₀", "p", p],
                ["2. Normal vector n", "n", normal],
                ["3. Test point r (draggable)", "r", r],
              ] as const
            ).map(([title, kind, value]) => (
              <article key={kind}>
                <h2>{title}</h2>
                <p>
                  {kind === "p"
                    ? "P₀(x₀,y₀,z₀)"
                    : kind === "n"
                      ? "n=(a,b,c)"
                      : "R(x,y,z)"}
                </p>
                <fieldset>
                  {(["x", "y", "z"] as const).map((a) => (
                    <label key={a}>
                      {a}
                      <input
                        aria-label={`${kind} ${a}`}
                        type="number"
                        step=".2"
                        value={value[a]}
                        onChange={(e) => set(kind, a, +e.target.value)}
                      />
                    </label>
                  ))}
                </fieldset>
                {kind === "n" && (
                  <strong className={calc.valid ? "valid" : "invalid"}>
                    {calc.valid
                      ? `n ≠ 0 ✓ |n|=${num(calc.normalLength)}`
                      : "Invalid zero normal"}
                  </strong>
                )}
              </article>
            ))}
            <section className="picks">
              <b>Quick picks</b>
              <button onClick={() => pick("on")}>On plane</button>
              <button onClick={() => pick("plus")}>Off plane (+)</button>
              <button onClick={() => pick("minus")}>Off plane (-)</button>
              <button onClick={() => pick("random")}>Random</button>
              <button onClick={reset}>
                <RotateCcw /> Reset all
              </button>
            </section>
          </aside>
          <article className="pn-scene">
            <h3>3D VISUALIZATION</h3>
            <div className="scene-tools">
              <button onClick={() => setCamera((v) => v + 18)}>Rotate</button>
              <button onClick={() => setCamera(0)}>
                <RotateCcw />
                Reset
              </button>
            </div>
            <div
              className="pn-canvas"
              style={{ transform: `perspective(900px) rotateY(${camera}deg)` }}
            >
              <svg
                viewBox="0 0 640 420"
                onPointerMove={move}
                onPointerUp={() => setDrag(false)}
                onPointerLeave={() => setDrag(false)}
                aria-label="Point-normal form plane visualization"
              >
                {layers.plane && (
                  <polygon
                    className="plane"
                    points="80,285 270,150 570,230 370,360"
                  />
                )}
                {layers.axes && (
                  <>
                    <line
                      className="axis x"
                      x1="70"
                      y1="290"
                      x2="575"
                      y2="290"
                    />
                    <line
                      className="axis z"
                      x1="320"
                      y1="370"
                      x2="320"
                      y2="50"
                    />
                    <line
                      className="axis y"
                      x1="100"
                      y1="350"
                      x2="540"
                      y2="120"
                    />
                  </>
                )}
                {layers.normal && (
                  <line
                    className="normal"
                    x1={pp.x}
                    y1={pp.y}
                    x2={nn.x}
                    y2={nn.y}
                  />
                )}{" "}
                {layers.displacement && (
                  <line
                    className="disp"
                    x1={pp.x}
                    y1={pp.y}
                    x2={rr.x}
                    y2={rr.y}
                  />
                )}{" "}
                {layers.perpendicular && (
                  <line
                    className="perp"
                    x1={rr.x}
                    y1={rr.y}
                    x2={rr.x}
                    y2={pp.y}
                  />
                )}
                <circle className="base" cx={pp.x} cy={pp.y} r="7" />
                <circle
                  aria-label="Test point drag handle"
                  tabIndex={0}
                  className="test"
                  cx={rr.x}
                  cy={rr.y}
                  r="9"
                  onKeyDown={nudge}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(true);
                  }}
                />
                <text x={pp.x - 70} y={pp.y + 18}>
                  P₀{tup(p)}
                </text>
                <text x={rr.x + 10} y={rr.y - 8}>
                  R{tup(r)}
                </text>
                <text x={nn.x + 8} y={nn.y}>
                  n={tup(normal)}
                </text>
              </svg>
            </div>
            <section className="scene-bottom">
              {(Object.keys(layers) as (keyof typeof layers)[]).map((k) => (
                <label key={k}>
                  <input
                    aria-label={`Show ${k}`}
                    type="checkbox"
                    checked={layers[k]}
                    onChange={(e) =>
                      setLayers((v) => ({ ...v, [k]: e.target.checked }))
                    }
                  />
                  Show {k}
                </label>
              ))}
              <p>
                Drag R to see how r-r₀ stays in the plane exactly when it is
                perpendicular to n.
              </p>
            </section>
          </article>
        </section>
        <section className="pn-equation">
          <article>
            <h3>POINT-NORMAL EQUATION</h3>
            <strong>n · (r-r₀) = 0</strong>
            <p>
              Substitute: {tup(normal)} · ((x,y,z)-{tup(p)})=0
            </p>
            <p>Expand and simplify:</p>
            <strong>{calc.valid ? equation : "No plane: n=0"}</strong>
          </article>
          <article>
            <h3>TEST POINT CHECKER</h3>
            <div>
              <span>
                n · (r-r₀)<b>{num(calc.residual)}</b>
              </span>
              <span>
                Signed residual ax+by+cz+d<b>{num(calc.residual)}</b>
              </span>
              <span>
                Perpendicular distance<b>{num(calc.distance)}</b>
              </span>
            </div>
            <p>
              Vector r-r₀={tup(calc.displacement)}; status:{" "}
              <b className={calc.on ? "yes" : "no"}>
                {calc.on ? "On plane" : "Off plane"}
              </b>
            </p>
          </article>
        </section>
        <section className="pn-grid">
          <article>
            <h3>FROM POINT-NORMAL TO ax+by+cz+d=0</h3>
            <p>n · (r-r₀)=0 ⇒ ax+by+cz-(ax₀+by₀+cz₀)=0</p>
            <strong>d=-(ax₀+by₀+cz₀)={calc.d}</strong>
            <strong>General form: {equation}</strong>
          </article>
          <article>
            <h3>NORMAL REVERSAL (EQUIVALENCE)</h3>
            <p>(-n) · (r-r₀)=0 is identical to n · (r-r₀)=0.</p>
            <button
              onClick={() => setNormal((v) => ({ x: -v.x, y: -v.y, z: -v.z }))}
            >
              Reverse normal
            </button>
            <strong>
              {term(-normal.x, "x", true)}
              {term(-normal.y, "y")}
              {term(-normal.z, "z")}
              {calc.d
                ? `${-calc.d > 0 ? " + " : " - "}${Math.abs(calc.d)}`
                : ""}
              =0
            </strong>
          </article>
          <article className="misconception">
            <h3>COMMON MISCONCEPTION</h3>
            <p>
              Wrong: n · r=0. This describes a plane through the origin only.
            </p>
            <b>Always use n · (r-r₀)=0 for a general point P₀.</b>
          </article>
          <article>
            <h3>ALL IN-PLANE DISPLACEMENTS ARE PERPENDICULAR TO n</h3>
            <p>For any in-plane point R, r-r₀ is perpendicular to n.</p>
            <p>Proof: n · (r-r₀)=0 exactly states orthogonality.</p>
          </article>
          <article>
            <h3>WORKED EXAMPLE</h3>
            <ol>
              <li>
                Point-normal: {tup(normal)} · ((x,y,z)-{tup(p)})=0
              </li>
              <li>Expand component products.</li>
              <li>Simplify: {equation}</li>
            </ol>
          </article>
          <article>
            <h3>PRACTICE YOURSELF</h3>
            {[
              "Value of n · (r-r₀) for a point on plane?",
              "Is R=(2,-1,2) on this plane?",
              "Signed residual for R=(2,-1,2)?",
              "Distance from R=(2,-1,2)?",
            ].map((q, i) => (
              <div className="question" key={q}>
                <span>
                  {i + 1}. {q}
                </span>
                <input
                  aria-label={`Practice answer ${i + 1}`}
                  value={answers[i]}
                  onChange={(e) =>
                    setAnswers((a) =>
                      a.map((v, j) => (j === i ? e.target.value : v)),
                    )
                  }
                />
                <button onClick={() => grade(i)}>Check</button>
                {graded[i] !== undefined &&
                  (graded[i] ? (
                    <Check className="yes" />
                  ) : (
                    <X className="no" />
                  ))}
              </div>
            ))}
          </article>
        </section>
        <section className="concepts">
          <h3>MORE CONCEPTS (VERIFIED)</h3>
          <div>
            <article>
              <b>Direction lying in plane</b>
              <p>Any d with n · d=0 lies in the plane.</p>
            </article>
            <article>
              <b>Cross product normal</b>
              <p>If u,v lie in the plane, u x v is parallel to n.</p>
            </article>
            <article>
              <b>Scalar triple product</b>
              <p>For an in-plane displacement d, n · d=0.</p>
            </article>
            <article>
              <b>Distance formula</b>
              <p>Distance = |ax+by+cz+d|/|n|.</p>
            </article>
          </div>
        </section>
        <nav className="pn-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-plane-equation">
            ← Plane Equation
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-intercept-form-of-a-plane">
            Intercept Form of a Plane →
          </a>
        </nav>
        <footer className="pn-footer">
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
