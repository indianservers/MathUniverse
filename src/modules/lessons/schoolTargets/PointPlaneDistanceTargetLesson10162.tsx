import { Check, Eye, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PointPlaneDistanceTargetLesson10162.css";

type V = { x: number; y: number; z: number };
const Q0: V = { x: 1, y: 2, z: 4 },
  N: V = { x: 2, y: -1, z: 2 },
  D = -5;
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z,
  add = (a: V, b: V, k = 1): V => ({
    x: a.x + k * b.x,
    y: a.y + k * b.y,
    z: a.z + k * b.z,
  }),
  sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  norm = (a: V) => Math.hypot(a.x, a.y, a.z),
  nice = (x: number) => Number(x.toFixed(4)),
  tup = (v: V) => `(${nice(v.x)}, ${nice(v.y)}, ${nice(v.z)})`;

export default function PointPlaneDistanceTargetLesson10162({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [q, setQ] = useState(Q0),
    [view, setView] = useState<"3D" | "Side">("3D"),
    [grid, setGrid] = useState(true),
    [zoom, setZoom] = useState(1),
    [drag, setDrag] = useState(false),
    [answers, setAnswers] = useState<Record<number, boolean>>({}),
    [epsilon, setEpsilon] = useState(0.1);
  const calc = useMemo(() => {
    const magnitude = norm(N),
      numerator = dot(N, q) + D,
      signed = numerator / magnitude,
      distance = Math.abs(signed),
      h = add(q, N, -numerator / (magnitude * magnitude)),
      connector = sub(q, h),
      footResidual = dot(N, h) + D,
      side =
        numerator > 1e-8
          ? "Positive (above)"
          : numerator < -1e-8
            ? "Negative (below)"
            : "On the plane";
    return {
      magnitude,
      numerator,
      signed,
      distance,
      h,
      connector,
      footResidual,
      side,
    };
  }, [q]);
  const reset = () => {
    setQ(Q0);
    setView("3D");
    setGrid(true);
    setZoom(1);
    setAnswers({});
    setEpsilon(0.1);
  };
  const xy = (v: V) =>
      view === "3D"
        ? { x: 315 + v.x * 48 + v.y * 18, y: 290 - v.z * 48 - v.y * 14 }
        : { x: 315 + v.x * 48, y: 300 - v.z * 48 },
    qq = xy(q),
    hh = xy(calc.h);
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = (((e.clientX - r.left) / r.width) * 640 - 315) / 48,
      z = (290 - ((e.clientY - r.top) / r.height) * 420) / 48;
    setQ((v) => ({ ...v, x: nice(x), z: nice(z) }));
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
    if (d) setQ((v) => ({ ...v, x: v.x + d[0], z: v.z + d[1] }));
  };
  const setSigned = (value: number) => {
    const unit = {
      x: N.x / calc.magnitude,
      y: N.y / calc.magnitude,
      z: N.z / calc.magnitude,
    };
    setQ(add(calc.h, unit, value));
  };
  const root = -calc.numerator / (calc.magnitude * calc.magnitude),
    f = (t: number) => calc.numerator + t * calc.magnitude * calc.magnitude;
  const practice = [
    "Distance answers: 0, 1, and 2/3.",
    "Feet follow H=Q-(n·Q+d)n/|n|².",
    "False; True; True.",
    "Positive residual means above the oriented plane.",
  ];
  return (
    <section
      className="pd10162-page"
      data-testid="school-mockup-0836"
      data-object-model="dedicated-point-plane-orthogonal-projection-engine"
      data-point={tup(q)}
      data-numerator={nice(calc.numerator)}
      data-signed-distance={nice(calc.signed)}
      data-distance={nice(calc.distance)}
      data-foot={tup(calc.h)}
      data-foot-residual={nice(calc.footResidual)}
      data-side={calc.side}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Distance from Point to Plane</h1>
        <p>
          Drop a perpendicular from point Q to plane and explore signed
          distance, foot of perpendicular, and the geometry.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="pd-lab">
        <section className="pd-top">
          <article className="pd-scene">
            <h3>3D INTERACTIVE LAB</h3>
            <nav>
              <button
                className={view === "3D" ? "active" : ""}
                onClick={() => setView("3D")}
              >
                3D View
              </button>
              <button
                className={view === "Side" ? "active" : ""}
                onClick={() => setView("Side")}
              >
                Side View
              </button>
              <button onClick={reset}>
                <RotateCcw />
                Reset
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
            </nav>
            <div className="pd-canvas" style={{ transform: `scale(${zoom})` }}>
              <svg
                viewBox="0 0 640 420"
                onPointerMove={move}
                onPointerUp={() => setDrag(false)}
                onPointerLeave={() => setDrag(false)}
                aria-label="Point and perpendicular projection onto plane"
              >
                {grid &&
                  [0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                      className="grid"
                      key={i}
                      x1={85 + i * 80}
                      y1="330"
                      x2={250 + i * 65}
                      y2="190"
                    />
                  ))}
                <polygon
                  className="plane"
                  points="70,310 270,170 575,245 365,375"
                />
                <line className="axis x" x1="70" y1="300" x2="575" y2="300" />
                <line className="axis y" x1="315" y1="370" x2="530" y2="140" />
                <line className="axis z" x1="315" y1="370" x2="315" y2="45" />
                <line
                  className="connector"
                  x1={qq.x}
                  y1={qq.y}
                  x2={hh.x}
                  y2={hh.y}
                />
                <circle
                  aria-label="Point Q drag handle"
                  tabIndex={0}
                  className="q"
                  cx={qq.x}
                  cy={qq.y}
                  r="9"
                  onKeyDown={nudge}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(true);
                  }}
                />
                <rect
                  className="right"
                  x={hh.x - 5}
                  y={hh.y - 5}
                  width="10"
                  height="10"
                />
                <text x={qq.x + 10} y={qq.y - 8}>
                  Q{tup(q)}
                </text>
                <text x={hh.x + 10} y={hh.y + 15}>
                  H{tup(calc.h)}
                </text>
                <text x="420" y="250">
                  2x-y+2z-5=0
                </text>
              </svg>
            </div>
            <footer>
              <p>
                Drag Q to explore. The foot H and all values update in real
                time.
              </p>
              <label>
                Zoom
                <input
                  aria-label="Scene zoom"
                  type="range"
                  min=".8"
                  max="1.25"
                  step=".05"
                  value={zoom}
                  onInput={(e) => setZoom(+e.currentTarget.value)}
                  onChange={() => {}}
                />
              </label>
            </footer>
          </article>
          <aside>
            <h3>CONTROL &amp; READOUT</h3>
            <p>Drag Q or move along the normal.</p>
            <strong>Q={tup(q)}</strong>
            <input
              aria-label="Signed distance along normal"
              type="range"
              min="-4"
              max="4"
              step=".1"
              value={Math.max(-4, Math.min(4, calc.signed))}
              onInput={(e) => setSigned(+e.currentTarget.value)}
              onChange={() => {}}
            />
            <p>Plane: 2x-y+2z-5=0</p>
            <p>Normal: n=(2,-1,2), |n|=3</p>
            <section>
              <b>Signed numerator n·Q-5</b>
              <strong>{nice(calc.numerator)}</strong>
            </section>
            <section>
              <b>Signed distance</b>
              <strong>
                {nice(calc.numerator)}/3 = {nice(calc.signed)}
              </strong>
            </section>
            <section>
              <b>Point-to-plane distance</b>
              <strong>
                |{nice(calc.numerator)}|/3 = {nice(calc.distance)}
              </strong>
            </section>
            <section>
              <b>Foot of perpendicular H</b>
              <p>H=Q-((n·Q-5)/|n|²)n</p>
              <strong>{tup(calc.h)}</strong>
            </section>
          </aside>
        </section>
        <section className="pd-status">
          <span>
            Angle between QH and n<b>0.00°</b>
          </span>
          <span>
            Distance |QH|<b>{nice(norm(calc.connector))}</b>
          </span>
          <span>
            Signed side<b>{calc.side}</b>
          </span>
          <span>
            QH ⟂ Plane
            <b>
              Verified <Check />
            </b>
          </span>
        </section>
        <section className="pd-grid">
          <article>
            <h3>FORMULA &amp; DERIVATION</h3>
            <p>For plane ax+by+cz+d=0 with normal n=(a,b,c):</p>
            <strong>Distance=|ax₀+by₀+cz₀+d|/√(a²+b²+c²)</strong>
            <p>Signed distance=(n·Q+d)/|n|</p>
            <strong>H=Q-((n·Q+d)/|n|²)n</strong>
          </article>
          <article>
            <h3>SUBSTITUTION VERIFICATION (H LIES ON PLANE)</h3>
            <p>H={tup(calc.h)}</p>
            <p>
              2({nice(calc.h.x)})-({nice(calc.h.y)})+2({nice(calc.h.z)})-5
            </p>
            <strong>{nice(calc.footResidual)}</strong>
            <b className={Math.abs(calc.footResidual) < 1e-7 ? "yes" : "no"}>
              {Math.abs(calc.footResidual) < 1e-7
                ? "Verified: H lies on the plane"
                : "Projection error"}
            </b>
          </article>
          <article>
            <h3>KEY REMINDERS</h3>
            <ul>
              <li>Use absolute value for distance.</li>
              <li>Without absolute value, you get signed distance.</li>
              <li>Normalize by |n|, not |n|².</li>
            </ul>
            <h3>WORKED EXAMPLE</h3>
            <p>For Q=(1,2,4), numerator=3, distance=1 and H=(1/3,7/3,10/3).</p>
          </article>
        </section>
        <section className="how">
          <h3>HOW IT WORKS</h3>
          <div>
            <span>
              <b>1 Drag Q</b>Move point Q anywhere in 3D.
            </span>
            <span>
              <b>2 Perpendicular drops</b>QH is perpendicular to the plane.
            </span>
            <span>
              <b>3 Read values</b>Signed side, distance, and foot update.
            </span>
            <span>
              <b>4 Verify</b>H always lies on the plane.
            </span>
          </div>
        </section>
        <section className="pd-bottom">
          <article>
            <h3>PRACTICE TIME</h3>
            <div>
              {practice.map((answer, i) => (
                <section key={answer}>
                  <b>
                    {i + 1}.{" "}
                    {i === 0
                      ? "Find three point-plane distances"
                      : i === 1
                        ? "Find the perpendicular feet"
                        : i === 2
                          ? "True or false"
                          : "Concept check"}
                  </b>
                  <p>
                    Solve using the current formula and verify by substitution.
                  </p>
                  <button
                    onClick={() => setAnswers((a) => ({ ...a, [i]: !a[i] }))}
                  >
                    <Eye />
                    Show answer
                  </button>
                  {answers[i] && <strong>{answer}</strong>}
                </section>
              ))}
            </div>
          </article>
          <article>
            <h3>ONE-SIDED LIMIT CHECK (ALONG NORMAL)</h3>
            <p>Move on L(t)=Q+t n and evaluate f(L(t))=2x-y+2z-5.</p>
            <p>Plane crossing parameter t₀={nice(root)}</p>
            <label>
              ε={epsilon.toFixed(3)}
              <input
                aria-label="Limit epsilon"
                type="range"
                min=".001"
                max=".5"
                step=".001"
                value={epsilon}
                onInput={(e) => setEpsilon(+e.currentTarget.value)}
                onChange={() => {}}
              />
            </label>
            <span>From below: f(L(t₀-ε))={nice(f(root - epsilon))}</span>
            <span>From above: f(L(t₀+ε))={nice(f(root + epsilon))}</span>
            <span>At t₀: f(L(t₀))={nice(f(root))}</span>
            <b>Signs match the signed-side readout.</b>
          </article>
        </section>
        <nav className="pd-adjacent">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-intercept-form-of-a-plane">
            ← Intercept Form of a Plane
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-angle-between-two-planes">
            Angle Between Two Planes →
          </a>
        </nav>
        <footer className="pd-footer">
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
