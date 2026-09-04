import { Check, RefreshCw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DirectionCosinesTargetLesson10153.css";
type V = { x: number; y: number; z: number };
const START = { x: 2, y: 3, z: 6 };
const f = (n: number, d = 5) => Number(n.toFixed(d));
export default function DirectionCosinesTargetLesson10153({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [v, setV] = useState<V>(START),
    [draft, setDraft] = useState<V>(START),
    [view, setView] = useState<"sphere" | "projections">("sphere"),
    [layers, setLayers] = useState({
      angles: true,
      axes: true,
      projections: true,
      unit: true,
    }),
    [rotation, setRotation] = useState(0),
    [auto, setAuto] = useState(false),
    [actions, setActions] = useState(0);
  const m = useMemo(() => Math.hypot(v.x, v.y, v.z), [v]),
    u = m ? { x: v.x / m, y: v.y / m, z: v.z / m } : { x: 0, y: 0, z: 0 },
    angles = {
      a: m ? (Math.acos(Math.max(-1, Math.min(1, u.x))) * 180) / Math.PI : 0,
      b: m ? (Math.acos(Math.max(-1, Math.min(1, u.y))) * 180) / Math.PI : 0,
      g: m ? (Math.acos(Math.max(-1, Math.min(1, u.z))) * 180) / Math.PI : 0,
    },
    sum = u.x * u.x + u.y * u.y + u.z * u.z;
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setRotation((r) => r + 0.035), 60);
    return () => window.clearInterval(id);
  }, [auto]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    update = (axis: keyof V, n: number) =>
      act(() => {
        const next = { ...v, [axis]: n };
        setV(next);
        setDraft(next);
      }),
    sign = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "0");
  const cx = 330,
    cy = 225,
    R = 155,
    px = cx + (u.x * Math.cos(rotation) - u.y * Math.sin(rotation)) * R,
    py =
      cy -
      (u.z * 0.82 +
        (u.x * Math.sin(rotation) + u.y * Math.cos(rotation)) * 0.25) *
        R;
  return (
    <section
      className="dc10153-page"
      data-testid="school-mockup-0827"
      data-object-model="dedicated-unit-sphere-direction-cosines-engine"
      data-vector={`${v.x},${v.y},${v.z}`}
      data-norm={m.toFixed(5)}
      data-cosines={`${u.x.toFixed(5)},${u.y.toFixed(5)},${u.z.toFixed(5)}`}
      data-identity={sum.toFixed(6)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Direction Cosines</h1>
        <p>
          Explore the unit vector, direction angles, axis projections, and the
          normalized components of a line in space.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="dc-lab">
        <div className="dc-title">
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Direction Cosines Explorer</h2>
            <p>
              Explore a vector on the unit sphere. Change components or rotate
              the view to see all live links.
            </p>
          </div>
          <span>
            <button
              onClick={() =>
                act(() => {
                  setV(START);
                  setDraft(START);
                  setRotation(0);
                  setAuto(false);
                  setLayers({
                    angles: true,
                    axes: true,
                    projections: true,
                    unit: true,
                  });
                })
              }
            >
              <RefreshCw />
              Reset
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `v=(${v.x},${v.y},${v.z}), cosines=(${f(u.x)},${f(u.y)},${f(u.z)})`,
                );
                setActions((n) => n + 1);
              }}
            >
              <Share2 />
              Share
            </button>
          </span>
        </div>
        <section className="dc-top">
          <aside className="dc-input">
            <h3>INPUT VECTOR</h3>
            <b>
              Vector v = ({v.x}, {v.y}, {v.z})
            </b>
            <strong>|v| = {f(m)}</strong>
            {(["x", "y", "z"] as const).map((a) => (
              <label key={a}>
                {a}
                <span>
                  <output>{v[a]}</output>
                  <input
                    aria-label={`${a} component`}
                    type="range"
                    min="-7"
                    max="7"
                    step="1"
                    value={v[a]}
                    onChange={(e) => update(a, +e.target.value)}
                  />
                </span>
              </label>
            ))}
            <h3>NORM</h3>
            <div>
              |v| = √({v.x}² + {v.y}² + {v.z}²) = {f(m)}
            </div>
            <h3>DIRECTION ANGLES</h3>
            <div>
              <b>α (with +x)</b>
              <p>
                {angles.a.toFixed(4)}° = cos⁻¹({f(u.x)})
              </p>
              <b>β (with +y)</b>
              <p>
                {angles.b.toFixed(4)}° = cos⁻¹({f(u.y)})
              </p>
              <b>γ (with +z)</b>
              <p>
                {angles.g.toFixed(4)}° = cos⁻¹({f(u.z)})
              </p>
            </div>
            <h3>DIRECTION COSINES</h3>
            <div>
              <p>l = cos α = {f(u.x)}</p>
              <p>m = cos β = {f(u.y)}</p>
              <p>n = cos γ = {f(u.z)}</p>
            </div>
            <h3>VERIFICATION</h3>
            <div>
              <p>l² + m² + n² = {sum.toFixed(6)}</p>
              <strong>
                <Check /> Verified
              </strong>
            </div>
          </aside>
          <article className="dc-visual">
            <nav>
              <button
                className={view === "sphere" ? "active" : ""}
                onClick={() => act(() => setView("sphere"))}
              >
                Unit Sphere (3D)
              </button>
              <button
                className={view === "projections" ? "active" : ""}
                onClick={() => act(() => setView("projections"))}
              >
                2D Projections
              </button>
            </nav>
            <svg
              viewBox="0 0 660 470"
              aria-label="Interactive direction cosines unit sphere"
            >
              <defs>
                <radialGradient id="sphere">
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#dfe5e8" />
                </radialGradient>
              </defs>
              <circle
                cx={cx}
                cy={cy}
                r={R}
                fill="url(#sphere)"
                stroke="#c4cbd0"
              />
              {view === "sphere" &&
                Array.from({ length: 7 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx={cx}
                    cy={cy}
                    rx={R}
                    ry={20 + i * 18}
                    fill="none"
                    stroke="#d2d8dc"
                  />
                ))}
              {layers.axes && (
                <>
                  <line className="axis x" x1="90" y1="310" x2="585" y2="170" />
                  <line
                    className="axis y"
                    x1="110"
                    y1="145"
                    x2="565"
                    y2="320"
                  />
                  <line className="axis z" x1={cx} y1="410" x2={cx} y2="35" />
                  <text x="590" y="170">
                    +X
                  </text>
                  <text x="565" y="320">
                    +Y
                  </text>
                  <text x={cx - 10} y="30">
                    +Z
                  </text>
                </>
              )}
              {layers.projections && (
                <>
                  <line
                    className="projection"
                    x1={px}
                    y1={py}
                    x2={px}
                    y2={cy}
                  />
                  <line
                    className="projection"
                    x1={px}
                    y1={cy}
                    x2={cx}
                    y2={cy}
                  />
                </>
              )}
              {layers.unit && (
                <line className="vector" x1={cx} y1={cy} x2={px} y2={py} />
              )}{" "}
              {layers.angles && (
                <>
                  <path
                    className="arc a"
                    d={`M${cx + 80},${cy} A80,42 0 0 0 ${cx + 55},${cy - 31}`}
                  />
                  <path
                    className="arc b"
                    d={`M${cx + 58},${cy + 20} A66,45 0 0 0 ${cx + 38},${cy - 38}`}
                  />
                  <text x={cx + 67} y={cy + 27}>
                    α
                  </text>
                  <text x={cx + 46} y={cy - 42}>
                    β
                  </text>
                  <text x={cx - 18} y={cy - 72}>
                    γ
                  </text>
                </>
              )}
              <circle className="point" cx={px} cy={py} r="7" />
              <text x={px + 10} y={py - 10}>
                P({f(u.x, 3)}, {f(u.y, 3)}, {f(u.z, 3)})
              </text>
            </svg>
            <div className="layers">
              <b>Show</b>
              {Object.entries(layers).map(([key, on]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      act(() => setLayers((s) => ({ ...s, [key]: !on })))
                    }
                  />
                  {key}
                </label>
              ))}
            </div>
            <div className="view-actions">
              <button onClick={() => act(() => setAuto((a) => !a))}>
                {auto ? "Stop rotation" : "Auto-rotate"}
              </button>
              <button onClick={() => act(() => setRotation(0))}>
                Default View
              </button>
            </div>
            <section className="visual-cards">
              <article>
                <h3>UNIT VECTOR</h3>
                <p>
                  û = v/|v| = ({f(u.x, 3)}, {f(u.y, 3)}, {f(u.z, 3)})
                </p>
                <p>
                  Point on unit sphere P({f(u.x, 3)}, {f(u.y, 3)}, {f(u.z, 3)})
                </p>
              </article>
              <article>
                <h3>PROJECTIONS (LENGTHS)</h3>
                <p>On x-axis: {f(u.x, 3)}</p>
                <p>On y-axis: {f(u.y, 3)}</p>
                <p>On z-axis: {f(u.z, 3)}</p>
              </article>
              <article>
                <h3>SIGNS (QUADRANT)</h3>
                <p>
                  l {sign(u.x)}, m {sign(u.y)}, n {sign(u.z)}
                </p>
                <p>
                  {[u.x, u.y, u.z].every((n) => n > 0)
                    ? "First Octant (+,+,+)"
                    : "Mixed-sign octant"}
                </p>
              </article>
            </section>
          </article>
        </section>
        <section className="dc-links">
          <article>
            <h3>LIVE LINKS: COMPONENTS ↔ ANGLES ↔ COSINES</h3>
            <div>
              {(["x", "y", "z"] as const).map((a, i) => (
                <label key={a}>
                  <b>{a}-component</b>
                  <output>{v[a]}</output>
                  <input
                    aria-label={`Linked ${a} component`}
                    type="range"
                    min="-7"
                    max="7"
                    value={v[a]}
                    onChange={(e) => update(a, +e.target.value)}
                  />
                  <span>
                    cos {["α", "β", "γ"][i]} = {f(u[a], 4)} &nbsp; | &nbsp;{" "}
                    {Object.values(angles)[i].toFixed(4)}°
                  </span>
                </label>
              ))}
            </div>
          </article>
          <aside>
            <h3>UPDATE COMPONENTS</h3>
            {(["x", "y", "z"] as const).map((a) => (
              <label key={a}>
                {a}
                <input
                  aria-label={`Draft ${a} component`}
                  type="number"
                  value={draft[a]}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [a]: +e.target.value }))
                  }
                />
              </label>
            ))}
            <button onClick={() => act(() => setV(draft))}>
              Apply Changes
            </button>
          </aside>
        </section>
        <section className="dc-theory">
          <article>
            <h3>DIRECTION RATIOS → DIRECTION COSINES</h3>
            <p>For ratios (a,b,c):</p>
            <p>l=a/√(a²+b²+c²), m=b/√(a²+b²+c²), n=c/√(a²+b²+c²)</p>
          </article>
          <article>
            <h3>FROM DIRECTION COSINES</h3>
            <p>Direction ratios are a:b:c = l:m:n.</p>
            <p>A direction vector is k(l,m,n), k ≠ 0.</p>
          </article>
          <article className="warning">
            <h3>IMPORTANT WARNING</h3>
            <p>Do not use raw components as direction cosines.</p>
            <p>
              Raw components: ({v.x},{v.y},{v.z}) ✕
            </p>
            <p>
              Correct: ({f(u.x, 3)},{f(u.y, 3)},{f(u.z, 3)}) ✓
            </p>
          </article>
        </section>
        <section className="dc-examples">
          <article>
            <h3>WORKED EXAMPLE</h3>
            <p>For v=(2,3,6), |v|=7 and û=(2/7,3/7,6/7).</p>
            <p>α=73.7398°, β=64.6231°, γ=30.9280°.</p>
            <strong>l²+m²+n²=1</strong>
          </article>
          <article>
            <h3>ANOTHER EXAMPLE (SIGN CHANGE)</h3>
            <p>For v=(-2,3,-6), cosines are (-2/7,3/7,-6/7).</p>
            <p>
              Signs identify the octant and angles become obtuse on negative
              axes.
            </p>
          </article>
          <article>
            <h3>SUMMARY BOX</h3>
            <p>Direction cosines are normalized components.</p>
            <p>Always satisfy l²+m²+n²=1.</p>
          </article>
        </section>
        <section className="dc-practice">
          <article>
            <h3>PRACTICE</h3>
            <ol>
              <li>Find direction cosines of (-3,4,12).</li>
              <li>If cosines are (1/3,2/3,2/3), find a direction vector.</li>
              <li>Find the three angles for (1,-1,2).</li>
            </ol>
          </article>
          <aside>
            <h3>SELF CHECK (TRY THIS)</h3>
            <p>Use the explorer to set v=(-4,-3,6).</p>
            <button
              onClick={() =>
                act(() => {
                  setV({ x: -4, y: -3, z: 6 });
                  setDraft({ x: -4, y: -3, z: 6 });
                })
              }
            >
              Set Vector
            </button>
          </aside>
        </section>
      </main>
    </section>
  );
}
