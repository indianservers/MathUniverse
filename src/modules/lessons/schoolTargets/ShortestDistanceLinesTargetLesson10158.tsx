import { Box, Check, Eye, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ShortestDistanceLinesTargetLesson10158.css";

type V = { x: number; y: number; z: number };
type Model = { a: V; u: V; b: V; v: V };
const initial: Model = {
  a: { x: 0, y: 0, z: 0 },
  u: { x: 1, y: 0, z: 0 },
  b: { x: 0, y: 1, z: 1 },
  v: { x: 0, y: 1, z: 0 },
};
const add = (a: V, b: V, k = 1): V => ({
  x: a.x + k * b.x,
  y: a.y + k * b.y,
  z: a.z + k * b.z,
});
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a: V, b: V): V => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const norm = (a: V) => Math.hypot(a.x, a.y, a.z);
const fmt = (v: V, digits = 2) =>
  `(${v.x.toFixed(digits)}, ${v.y.toFixed(digits)}, ${v.z.toFixed(digits)})`;
const n = (x: number) => Number(x.toFixed(4));

export default function ShortestDistanceLinesTargetLesson10158({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [m, setM] = useState(initial);
  const [layers, setLayers] = useState({
    perpendicular: true,
    axes: true,
    plane: true,
  });
  const [camera, setCamera] = useState(0);
  const [solutions, setSolutions] = useState<Record<number, boolean>>({});
  const [drag, setDrag] = useState<"a" | "b" | null>(null);
  const calc = useMemo(() => {
    const w = sub(m.b, m.a),
      c = cross(m.u, m.v),
      cn = norm(c),
      un = norm(m.u),
      parallel = cn < 1e-8;
    let s = 0,
      t = 0;
    if (!parallel) {
      const A = dot(m.u, m.u),
        B = dot(m.u, m.v),
        C = dot(m.v, m.v),
        D = dot(m.u, w),
        E = dot(m.v, w),
        det = B * B - A * C;
      s = (-C * D + B * E) / det;
      t = (A * E - B * D) / det;
    } else if (un > 0) {
      s = dot(w, m.u) / dot(m.u, m.u);
    }
    const p = add(m.a, m.u, s),
      q = parallel ? m.b : add(m.b, m.v, t);
    const distance = parallel
      ? un
        ? norm(cross(w, m.u)) / un
        : 0
      : Math.abs(dot(w, c)) / cn;
    const connector = sub(q, p),
      angle =
        norm(connector) && un
          ? (Math.acos(
              Math.min(
                1,
                Math.abs(dot(connector, m.u)) / (norm(connector) * un),
              ),
            ) *
              180) /
            Math.PI
          : 90;
    return { w, c, cn, parallel, distance, s, t, p, q, angle };
  }, [m]);
  const set = (part: keyof Model, axis: keyof V, value: number) =>
    setM((old) => ({ ...old, [part]: { ...old[part], [axis]: value } }));
  const reset = () => {
    setM(initial);
    setLayers({ perpendicular: true, axes: true, plane: true });
    setCamera(0);
    setSolutions({});
  };
  const xy = (p: V) => ({
    x: 330 + p.x * 72 + p.y * 34,
    y: 300 - p.z * 72 - p.y * 24,
  });
  const pa = xy(m.a),
    pb = xy(m.b),
    pp = xy(calc.p),
    pq = xy(calc.q);
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = (((e.clientX - r.left) / r.width) * 650 - 330) / 72,
      z = (300 - ((e.clientY - r.top) / r.height) * 430) / 72;
    setM((old) => ({ ...old, [drag]: { ...old[drag], x: n(x), z: n(z) } }));
  };
  const nudge = (part: "a" | "b", key: string) => {
    const delta =
      key === "ArrowLeft"
        ? [-0.25, 0]
        : key === "ArrowRight"
          ? [0.25, 0]
          : key === "ArrowUp"
            ? [0, 0.25]
            : key === "ArrowDown"
              ? [0, -0.25]
              : null;
    if (!delta) return;
    setM((old) => ({
      ...old,
      [part]: {
        ...old[part],
        x: old[part].x + delta[0],
        z: old[part].z + delta[1],
      },
    }));
  };
  return (
    <section
      className="sd10158-page"
      data-testid="school-mockup-0832"
      data-object-model="dedicated-shortest-distance-two-line-engine"
      data-distance={n(calc.distance)}
      data-parallel={String(calc.parallel)}
      data-cross={fmt(calc.c, 0)}
      data-foot={`${fmt(calc.p)},${fmt(calc.q)}`}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Shortest Distance Between Lines</h1>
        <p>
          Find the shortest distance between two non-parallel lines in 3D using
          vectors, cross products, and triple products.
        </p>
        <div>
          <span>3D Geometry</span>
          <span>Vector Methods</span>
          <span>Triple Product</span>
          <span>Distance</span>
          <span>NCERT</span>
          <button onClick={reset}>
            <RotateCcw />
            Reset all
          </button>
        </div>
      </header>
      <main className="sd-lab">
        <section className="sd-top">
          <aside>
            <h3>LINES (EDITABLE)</h3>
            <p>Drag the points or direction handles to explore.</p>
            {(
              [
                ["Line L₁", "a", "u"],
                ["Line L₂", "b", "v"],
              ] as const
            ).map(([title, p, d]) => (
              <article key={title}>
                <h2>{title}</h2>
                <p className="equation">
                  L: r = {fmt(m[p], 0)} + t{fmt(m[d], 0)}
                </p>
                {([p, d] as const).map((part, i) => (
                  <fieldset key={part}>
                    <legend>
                      {i ? "Direction" : "Point"} {part}
                    </legend>
                    {(["x", "y", "z"] as const).map((axis) => (
                      <label key={axis}>
                        {axis}
                        <input
                          aria-label={`${part} ${axis}`}
                          type="number"
                          step=".25"
                          value={m[part][axis]}
                          onChange={(e) => set(part, axis, +e.target.value)}
                        />
                      </label>
                    ))}
                  </fieldset>
                ))}
              </article>
            ))}
          </aside>
          <article className="sd-scene">
            <h3>3D VISUALIZATION</h3>
            <div className="layer-controls">
              {(
                [
                  ["perpendicular", "Show perpendicular"],
                  ["axes", "Show axes"],
                  ["plane", "Show plane"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    aria-label={label}
                    checked={layers[key]}
                    onChange={(e) =>
                      setLayers((s) => ({ ...s, [key]: e.target.checked }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div
              className="sd-canvas"
              style={{ transform: `perspective(900px) rotateY(${camera}deg)` }}
            >
              <svg
                viewBox="0 0 650 430"
                onPointerMove={move}
                onPointerUp={() => setDrag(null)}
                onPointerLeave={() => setDrag(null)}
                aria-label="Shortest connector between two lines"
              >
                {layers.plane && (
                  <polygon
                    className="plane"
                    points="90,315 295,170 575,245 365,390"
                  />
                )}
                {layers.axes && (
                  <>
                    <line className="axis" x1="75" y1="300" x2="590" y2="300" />
                    <line className="axis" x1="330" y1="390" x2="330" y2="45" />
                    <line
                      className="axis"
                      x1="105"
                      y1="365"
                      x2="545"
                      y2="120"
                    />
                  </>
                )}
                <line
                  className="line l1"
                  x1={xy(add(m.a, m.u, -2.5)).x}
                  y1={xy(add(m.a, m.u, -2.5)).y}
                  x2={xy(add(m.a, m.u, 2.5)).x}
                  y2={xy(add(m.a, m.u, 2.5)).y}
                />
                <line
                  className="line l2"
                  x1={xy(add(m.b, m.v, -2.5)).x}
                  y1={xy(add(m.b, m.v, -2.5)).y}
                  x2={xy(add(m.b, m.v, 2.5)).x}
                  y2={xy(add(m.b, m.v, 2.5)).y}
                />
                {layers.perpendicular && (
                  <line
                    className="connector"
                    x1={pp.x}
                    y1={pp.y}
                    x2={pq.x}
                    y2={pq.y}
                  />
                )}
                <circle
                  aria-label="Line 1 point drag handle"
                  tabIndex={0}
                  className="handle a"
                  cx={pa.x}
                  cy={pa.y}
                  r="9"
                  onKeyDown={(e) => nudge("a", e.key)}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag("a");
                  }}
                />
                <circle
                  aria-label="Line 2 point drag handle"
                  tabIndex={0}
                  className="handle b"
                  cx={pb.x}
                  cy={pb.y}
                  r="9"
                  onKeyDown={(e) => nudge("b", e.key)}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag("b");
                  }}
                />
                <text x={pa.x + 10} y={pa.y + 16}>
                  {fmt(m.a, 0)}
                </text>
                <text x={pb.x + 10} y={pb.y - 12}>
                  {fmt(m.b, 0)}
                </text>
              </svg>
            </div>
            <footer>
              <button onClick={() => setCamera((v) => v + 18)}>
                <Box />
                View
              </button>
              <button onClick={() => setCamera(0)}>Reset view</button>
            </footer>
          </article>
        </section>
        <section className="sd-compute">
          <h3>KEY VECTORS &amp; COMPUTATIONS</h3>
          <div>
            <article>
              <h2>Direction vectors</h2>
              <p>d₁ = {fmt(m.u, 0)}</p>
              <p>d₂ = {fmt(m.v, 0)}</p>
            </article>
            <article>
              <h2>Cross product</h2>
              <p>d₁ x d₂</p>
              <strong>{fmt(calc.c, 0)}</strong>
              <small>|cross| = {n(calc.cn)}</small>
            </article>
            <article>
              <h2>Vector between points</h2>
              <p>a₂ - a₁</p>
              <strong>{fmt(calc.w, 0)}</strong>
            </article>
            <article>
              <h2>Shortest distance</h2>
              <p>
                {calc.parallel
                  ? "|(a₂-a₁) x d₁| / |d₁|"
                  : "|(a₂-a₁) · (d₁ x d₂)| / |d₁ x d₂|"}
              </p>
              <strong>d = {n(calc.distance)}</strong>
            </article>
          </div>
        </section>
        <section className="sd-formulas">
          <article>
            <h3>NON-PARALLEL LINES (GENERAL FORMULA)</h3>
            <p>
              When d₁ x d₂ ≠ 0, use the scalar triple product divided by the
              cross-product magnitude.
            </p>
            <strong>d = |(a₂-a₁) · (d₁ x d₂)| / |d₁ x d₂|</strong>
          </article>
          <article>
            <h3>PARALLEL LINES (SPECIAL CASE)</h3>
            <p>When d₁ x d₂ = 0, division by the cross product is invalid.</p>
            <strong>d = |(a₂-a₁) x d₁| / |d₁|</strong>
          </article>
          <article className="warning">
            <h3>IMPORTANT WARNING</h3>
            <p>Always test d₁ x d₂ before choosing the formula.</p>
            <b>
              {calc.parallel
                ? "Parallel: use the special formula."
                : "Non-parallel: use the triple-product formula."}
            </b>
          </article>
        </section>
        <section className="sd-worked">
          <h3>WORKED EXAMPLE (THIS LESSON)</h3>
          <div>
            <article>
              <b>Given</b>
              <p>
                L₁: {fmt(m.a, 0)} + s{fmt(m.u, 0)}
              </p>
              <p>
                L₂: {fmt(m.b, 0)} + t{fmt(m.v, 0)}
              </p>
            </article>
            <article>
              <b>Solution (Step-by-step)</b>
              <ol>
                <li>Cross product = {fmt(calc.c, 0)}</li>
                <li>a₂-a₁ = {fmt(calc.w, 0)}</li>
                <li>
                  Shortest feet: {fmt(calc.p)} and {fmt(calc.q)}
                </li>
                <li>Connector is perpendicular to both directions.</li>
              </ol>
            </article>
            <article>
              <b>Result</b>
              <strong>d = {n(calc.distance)}</strong>
              <p>
                The closest parameters are s={n(calc.s)}, t={n(calc.t)}.
              </p>
            </article>
          </div>
        </section>
        <section className="sd-practice">
          <article>
            <h3>PRACTICE</h3>
            <div>
              {["Non-parallel lines", "Parallel lines", "Skew lines"].map(
                (title, i) => (
                  <section key={title}>
                    <b>
                      Practice {i + 1}: {title}
                    </b>
                    <p>
                      Classify the directions, then choose and evaluate the
                      correct distance formula.
                    </p>
                    <button
                      onClick={() =>
                        setSolutions((s) => ({ ...s, [i]: !s[i] }))
                      }
                    >
                      <Eye />
                      Show solution
                    </button>
                    {solutions[i] && (
                      <strong>
                        {i === 1
                          ? "Parallel formula; distance = 1"
                          : "Triple-product formula; calculate the common-normal length."}
                      </strong>
                    )}
                  </section>
                ),
              )}
            </div>
          </article>
          <article>
            <h3>KEY TAKEAWAYS</h3>
            <p>
              <Check />
              Use the cross product to find a normal to both directions.
            </p>
            <p>
              <Check />
              Use the scalar triple product for non-parallel lines.
            </p>
            <p>
              <Check />
              Use the perpendicular formula for parallel lines.
            </p>
          </article>
        </section>
        <section className="sd-check">
          <h3>INTERACTIVE CHECK</h3>
          <div>
            <span>
              Angle between connector and L₁<b>{n(calc.angle)}°</b>
            </span>
            <span>
              Shortest distance<b>{n(calc.distance)}</b>
            </span>
            <span>
              Perpendicular feet
              <b>
                {fmt(calc.p)} → {fmt(calc.q)}
              </b>
            </span>
          </div>
        </section>
        <nav className="sd-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-skew-lines">
            ← Skew Lines
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-plane-equation">
            Plane Equation →
          </a>
        </nav>
      </main>
    </section>
  );
}
