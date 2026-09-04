import { Check, Eye, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SkewLinesTargetLesson10157.css";

type V = { x: number; y: number; z: number };
type Kind = "Intersecting" | "Parallel" | "Coincident" | "Skew";
type Model = { a: V; d: V; b: V; e: V };
const models: Record<Kind, Model> = {
  Intersecting: {
    a: { x: 0, y: 0, z: 0 },
    d: { x: 1, y: 2, z: 0 },
    b: { x: 0, y: 0, z: 0 },
    e: { x: 0, y: 1, z: 2 },
  },
  Parallel: {
    a: { x: 0, y: 0, z: 0 },
    d: { x: 1, y: 1, z: 0 },
    b: { x: 0, y: 1, z: 1 },
    e: { x: 1, y: 1, z: 0 },
  },
  Coincident: {
    a: { x: 1, y: 2, z: 3 },
    d: { x: 2, y: -1, z: 4 },
    b: { x: 3, y: 1, z: 7 },
    e: { x: 2, y: -1, z: 4 },
  },
  Skew: {
    a: { x: 0, y: 0, z: 0 },
    d: { x: 1, y: 0, z: 0 },
    b: { x: 0, y: 1, z: 1 },
    e: { x: 0, y: 1, z: 0 },
  },
};
const sub = (u: V, v: V): V => ({ x: u.x - v.x, y: u.y - v.y, z: u.z - v.z });
const cross = (u: V, v: V): V => ({
  x: u.y * v.z - u.z * v.y,
  y: u.z * v.x - u.x * v.z,
  z: u.x * v.y - u.y * v.x,
});
const dot = (u: V, v: V) => u.x * v.x + u.y * v.y + u.z * v.z;
const zero = (v: V) => Math.hypot(v.x, v.y, v.z) < 1e-8;
const fmt = (v: V) => `(${v.x}, ${v.y}, ${v.z})`;

export default function SkewLinesTargetLesson10157({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState<Model>(models.Skew);
  const [plane, setPlane] = useState(true);
  const [axes, setAxes] = useState(true);
  const [wire, setWire] = useState(false);
  const [solutions, setSolutions] = useState(false);
  const [camera, setCamera] = useState(0);
  const calc = useMemo(() => {
    const c = cross(model.d, model.e),
      delta = sub(model.b, model.a),
      triple = dot(delta, c);
    const parallel = zero(c),
      coincident = parallel && zero(cross(delta, model.d));
    let intersects = false,
      s = 0,
      t = 0;
    if (!parallel) {
      const cc = dot(c, c);
      s = dot(cross(delta, model.e), c) / cc;
      t = dot(cross(delta, model.d), c) / cc;
      const p = {
        x: model.a.x + s * model.d.x,
        y: model.a.y + s * model.d.y,
        z: model.a.z + s * model.d.z,
      };
      const q = {
        x: model.b.x + t * model.e.x,
        y: model.b.y + t * model.e.y,
        z: model.b.z + t * model.e.z,
      };
      intersects = Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z) < 1e-7;
    }
    const kind: Kind = coincident
      ? "Coincident"
      : parallel
        ? "Parallel"
        : intersects
          ? "Intersecting"
          : "Skew";
    return { c, triple, parallel, intersects, s, t, kind };
  }, [model]);
  const set = (line: "a" | "d" | "b" | "e", axis: keyof V, value: number) =>
    setModel((m) => ({ ...m, [line]: { ...m[line], [axis]: value } }));
  const load = (kind: Kind) => setModel(models[kind]);
  const point = (base: V, dir: V, k: number) => ({
    x: 315 + (base.x + k * dir.x) * 62,
    y: 230 - (base.z + k * dir.z) * 54 - (base.y + k * dir.y) * 20,
  });
  const l1a = point(model.a, model.d, -2.3),
    l1b = point(model.a, model.d, 2.3),
    l2a = point(model.b, model.e, -2.3),
    l2b = point(model.b, model.e, 2.3);
  return (
    <section
      className="sk10157-page"
      data-testid="school-mockup-0831"
      data-object-model="dedicated-skew-line-classification-engine"
      data-classification={calc.kind}
      data-cross={fmt(calc.c)}
      data-triple={calc.triple}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Skew Lines</h1>
        <p>
          Explore, classify, and prove the relationship between two lines in 3D
          space.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="sk-lab">
        <nav>
          {[
            "EXPLORER",
            "CLASSIFIER",
            "DECISION TREE",
            "EQUATIONS & TESTS",
            "WORKED EXAMPLE",
            "PRACTICE",
          ].map((x) => (
            <a key={x} href={`#sk-${x.toLowerCase().replaceAll(" ", "-")}`}>
              {x}
            </a>
          ))}
          <label>
            Plane: ON{" "}
            <input
              aria-label="Show plane"
              type="checkbox"
              checked={plane}
              onChange={(e) => setPlane(e.target.checked)}
            />
          </label>
          <label>
            Axes{" "}
            <input
              aria-label="Show axes"
              type="checkbox"
              checked={axes}
              onChange={(e) => setAxes(e.target.checked)}
            />
          </label>
        </nav>
        <section className="sk-explorer" id="sk-explorer">
          <aside>
            <h3>LINE INPUTS &amp; TESTS</h3>
            {(
              [
                ["Line 1", "a", "d"],
                ["Line 2", "b", "e"],
              ] as const
            ).map(([title, p, d]) => (
              <article key={title}>
                <h2>{title}</h2>
                <p>
                  L: r = {fmt(model[p])} + u{fmt(model[d])}
                </p>
                <div>
                  {([p, d] as const).map((part, i) => (
                    <fieldset key={part}>
                      <legend>{i ? "Direction" : "Point"}</legend>
                      {(["x", "y", "z"] as const).map((axis) => (
                        <input
                          key={axis}
                          aria-label={`${part} ${axis}`}
                          type="number"
                          value={model[part][axis]}
                          onChange={(e) => set(part, axis, +e.target.value)}
                        />
                      ))}
                    </fieldset>
                  ))}
                </div>
              </article>
            ))}
            <section className="sk-tests">
              <h3>TESTS</h3>
              <p>
                <b>1 Direction test (parallel?)</b>
                <Check />
                d₁ x d₂ = {fmt(calc.c)}
                <small>
                  {calc.parallel ? "Parallel directions" : "Not parallel"}
                </small>
              </p>
              <p>
                <b>2 Intersection test</b>
                <Check />
                {calc.parallel
                  ? "Parallel system"
                  : `s=${calc.s.toFixed(2)}, t=${calc.t.toFixed(2)}`}
                <small>
                  {calc.intersects ? "One common point" : "No solution"}
                </small>
              </p>
              <p>
                <b>3 Scalar triple product</b>
                <Check />
                (a₂-a₁) · (d₁ x d₂) = {calc.triple}
                <small>{calc.triple === 0 ? "Coplanar" : "Non-coplanar"}</small>
              </p>
              <strong>Conclusion: {calc.kind} Lines</strong>
            </section>
          </aside>
          <article className="sk-scene">
            <h3>3D VISUALIZER</h3>
            <p>
              Drag to rotate &bull; Scroll to zoom &bull; Right-click drag to
              pan
            </p>
            <div
              className={`sk-canvas ${wire ? "wire" : ""}`}
              style={{ transform: `perspective(900px) rotateY(${camera}deg)` }}
            >
              <svg
                viewBox="0 0 650 430"
                aria-label="Two lines in three-dimensional space"
              >
                {plane && (
                  <polygon
                    className="plane"
                    points="100,310 290,160 565,230 360,380"
                  />
                )}
                {axes && (
                  <>
                    <line
                      className="axis x"
                      x1="90"
                      y1="270"
                      x2="580"
                      y2="270"
                    />
                    <line
                      className="axis y"
                      x1="315"
                      y1="380"
                      x2="315"
                      y2="55"
                    />
                    <line
                      className="axis z"
                      x1="120"
                      y1="355"
                      x2="540"
                      y2="130"
                    />
                  </>
                )}
                <line
                  className="line one"
                  x1={l1a.x}
                  y1={l1a.y}
                  x2={l1b.x}
                  y2={l1b.y}
                />
                <line
                  className="line two"
                  x1={l2a.x}
                  y1={l2a.y}
                  x2={l2b.x}
                  y2={l2b.y}
                />
                <circle
                  className="p1"
                  cx={point(model.a, model.d, 0).x}
                  cy={point(model.a, model.d, 0).y}
                  r="7"
                />
                <circle
                  className="p2"
                  cx={point(model.b, model.e, 0).x}
                  cy={point(model.b, model.e, 0).y}
                  r="7"
                />
                <text
                  x={point(model.a, model.d, 0).x + 8}
                  y={point(model.a, model.d, 0).y - 8}
                >
                  a₁{fmt(model.a)}
                </text>
                <text
                  x={point(model.b, model.e, 0).x + 8}
                  y={point(model.b, model.e, 0).y - 8}
                >
                  a₂{fmt(model.b)}
                </text>
              </svg>
            </div>
            <footer>
              <button onClick={() => setPlane((v) => !v)}>Show plane</button>
              <button onClick={() => setCamera((v) => v + 18)}>
                Rotate view
              </button>
              <button onClick={() => setCamera(0)}>
                <RotateCcw />
                Reset view
              </button>
              <button onClick={() => setWire((v) => !v)}>
                <Eye />
                {wire ? "Solid" : "Wireframe"}
              </button>
            </footer>
          </article>
        </section>
        <section className="sk-classifier" id="sk-classifier">
          <h3>RELATIONSHIP CLASSIFIER</h3>
          <div>
            {(Object.keys(models) as Kind[]).map((kind) => (
              <button
                key={kind}
                className={calc.kind === kind ? "active" : ""}
                onClick={() => load(kind)}
              >
                <b>
                  {kind}
                  {calc.kind === kind ? " (Current)" : ""}
                </b>
                <span>
                  {kind === "Intersecting"
                    ? "Lines meet at one point."
                    : kind === "Parallel"
                      ? "Same direction, different lines."
                      : kind === "Coincident"
                        ? "Same line."
                        : "Non-coplanar, non-intersecting."}
                </span>
                <i>
                  {fmt(models[kind].a)} + s{fmt(models[kind].d)}
                </i>
                <i>
                  {fmt(models[kind].b)} + t{fmt(models[kind].e)}
                </i>
              </button>
            ))}
          </div>
          <p>
            Important: In 3D, two non-parallel lines need not intersect. They
            can be <b>skew lines</b>.
          </p>
        </section>
        <section className="sk-summary">
          <article id="sk-decision-tree">
            <h3>DECISION TREE</h3>
            <div className="tree">
              Are directions parallel?
              <br />↙ Yes &nbsp;&nbsp;&nbsp; No ↘<br />
              Same line? &nbsp;&nbsp; Intersect?
              <br />
              <b>Coincident / Parallel / Intersecting / Skew</b>
            </div>
          </article>
          <article id="sk-equations-&-tests">
            <h3>ALGEBRA SUMMARY (CURRENT)</h3>
            <ol>
              <li>
                d₁ x d₂ = {fmt(calc.c)} →{" "}
                {calc.parallel ? "parallel" : "not parallel"}
              </li>
              <li>
                Intersection system →{" "}
                {calc.intersects ? "one solution" : "no solution"}
              </li>
              <li>
                Triple product = {calc.triple} →{" "}
                {calc.triple === 0 ? "coplanar" : "non-coplanar"}
              </li>
            </ol>
            <strong>
              Therefore, L₁ and L₂ are {calc.kind.toUpperCase()} lines.
            </strong>
          </article>
          <article>
            <h3>PLANE VIEW</h3>
            <div className="plane2d">
              <span>L₁ projects to y=0</span>
              <span>L₂ projects through (0,1)</span>
            </div>
            <p>
              Projections do not intersect → lines are not intersecting in 3D.
            </p>
          </article>
        </section>
        <section className="sk-bottom">
          <article id="sk-worked-example">
            <h3>WORKED EXAMPLE</h3>
            <p>
              For d₁=(2,-1,3), d₂=(4,1,6), the cross product is nonzero. Solving
              both vector equations gives no common parameters, and the scalar
              triple product is nonzero.
            </p>
            <ol>
              <li>Not parallel.</li>
              <li>No intersection.</li>
              <li>Non-coplanar.</li>
            </ol>
            <strong>Therefore the lines are skew.</strong>
          </article>
          <article id="sk-practice">
            <h3>PRACTICE</h3>
            <p>
              Classify each pair by checking direction, intersection, and
              coplanarity.
            </p>
            <ol>
              <li>(0,0,0)+s(1,1,1) and (2,2,2)+t(1,1,1)</li>
              <li>(1,0,0)+s(0,1,0) and (1,2,0)+t(0,1,0)</li>
              <li>(0,0,0)+s(1,0,0) and (0,1,1)+t(0,1,0)</li>
            </ol>
            <button onClick={() => setSolutions((v) => !v)}>
              <Eye />
              Show Solutions
            </button>
            {solutions && (
              <p data-testid="skew-solutions">
                Coincident; parallel distinct; skew.
              </p>
            )}
          </article>
        </section>
        <nav className="sk-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-cartesian-equation-of-a-line">
            ← Cartesian Equation of a Line
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-shortest-distance-between-lines">
            Shortest Distance Between Lines →
          </a>
        </nav>
        <footer className="sk-footer">
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
