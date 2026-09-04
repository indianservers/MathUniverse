import { Check, Eye, Maximize2, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LinePlaneAngleTargetLesson10164.css";

type V = { x: number; y: number; z: number };
type Preset = "general" | "parallel" | "perpendicular";
const D0: V = { x: 1, y: 2, z: 2 },
  N0: V = { x: 2, y: -1, z: 2 };
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y + a.z * b.z,
  norm = (a: V) => Math.hypot(a.x, a.y, a.z),
  scale = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k, z: a.z * k }),
  sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
  nice = (x: number) => Number(x.toFixed(4)),
  tup = (v: V) => `(${nice(v.x)}, ${nice(v.y)}, ${nice(v.z)})`;

export default function LinePlaneAngleTargetLesson10164({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [d, setD] = useState(D0),
    [normal, setNormal] = useState(N0),
    [preset, setPreset] = useState<Preset>("general"),
    [grid, setGrid] = useState(true),
    [camera, setCamera] = useState({ rotate: 0, pan: 0, zoom: 1 }),
    [steps, setSteps] = useState(false),
    [checked, setChecked] = useState(false),
    [drag, setDrag] = useState(false);
  const calc = useMemo(() => {
    const dn = norm(d),
      nn = norm(normal),
      product = dot(d, normal),
      valid = dn > 1e-8 && nn > 1e-8,
      ratio = valid ? Math.min(1, Math.abs(product) / (dn * nn)) : NaN,
      linePlane = valid ? (Math.asin(ratio) * 180) / Math.PI : NaN,
      lineNormal = valid ? (Math.acos(ratio) * 180) / Math.PI : NaN,
      normalComponent = nn
        ? scale(normal, product / (nn * nn))
        : { x: 0, y: 0, z: 0 },
      projection = sub(d, normalComponent),
      projectionLength = norm(projection),
      parallel = valid && Math.abs(product) < 1e-8,
      perpendicular = valid && projectionLength < 1e-8;
    return {
      dn,
      nn,
      product,
      valid,
      linePlane,
      lineNormal,
      normalComponent,
      projection,
      projectionLength,
      parallel,
      perpendicular,
    };
  }, [d, normal]);
  const set = (kind: "d" | "n", axis: keyof V, value: number) =>
    kind === "d"
      ? setD((v) => ({ ...v, [axis]: value }))
      : setNormal((v) => ({ ...v, [axis]: value }));
  const apply = (value: Preset) => {
    setPreset(value);
    if (value === "general") {
      setD(D0);
      setNormal(N0);
    } else if (value === "parallel") {
      setD({ x: 1, y: 2, z: 0 });
      setNormal({ x: 2, y: -1, z: 2 });
    } else {
      setD({ x: 2, y: -1, z: 2 });
      setNormal({ x: 2, y: -1, z: 2 });
    }
  };
  const reset = () => {
    setD(D0);
    setNormal(N0);
    setPreset("general");
    setGrid(true);
    setCamera({ rotate: 0, pan: 0, zoom: 1 });
    setSteps(false);
    setChecked(false);
  };
  const xy = (v: V) => ({
      x: 310 + v.x * 55 + camera.pan,
      y: 285 - v.z * 55 - v.y * 17,
    }),
    o = xy({ x: 0, y: 0, z: 0 }),
    dp = xy(d),
    np = xy(normal),
    proj = xy(calc.projection);
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const b = e.currentTarget.getBoundingClientRect(),
      x = (((e.clientX - b.left) / b.width) * 650 - 310 - camera.pan) / 55,
      z = (285 - ((e.clientY - b.top) / b.height) * 430) / 55;
    setD((v) => ({ ...v, x: nice(x), z: nice(z) }));
    setPreset("general");
  };
  const nudge = (e: KeyboardEvent<SVGCircleElement>) => {
    const q =
      e.key === "ArrowLeft"
        ? [-0.2, 0]
        : e.key === "ArrowRight"
          ? [0.2, 0]
          : e.key === "ArrowUp"
            ? [0, 0.2]
            : e.key === "ArrowDown"
              ? [0, -0.2]
              : null;
    if (q) {
      setD((v) => ({ ...v, x: v.x + q[0], z: v.z + q[1] }));
      setPreset("general");
    }
  };
  const angleText = calc.valid ? String(nice(calc.linePlane)) : "undefined",
    normalAngleText = calc.valid ? String(nice(calc.lineNormal)) : "undefined";
  return (
    <section
      className="lp10164-page"
      data-testid="school-mockup-0838"
      data-object-model="dedicated-line-plane-complementary-angle-engine"
      data-direction={tup(d)}
      data-normal={tup(normal)}
      data-dot={nice(calc.product)}
      data-angle={angleText}
      data-normal-angle={normalAngleText}
      data-projection={tup(calc.projection)}
      data-projection-length={nice(calc.projectionLength)}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Angle Between Line and Plane</h1>
        <p>
          Explore the angle between a line and a plane through its direction
          vector, plane normal, and orthogonal projection.
        </p>
        <div>
          <span>24 min</span>
          <span>ADVANCED</span>
          <span>VISUAL EXPLORATION</span>
          <span>geometry3d</span>
        </div>
      </header>
      <main className="lp-lab">
        <section className="lp-title">
          <div>
            <small>LINE-TILT EXPLORER</small>
            <p>
              Adjust the line direction d and plane normal n. Exact values
              update in real time.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw />
            Reset explorer
          </button>
        </section>
        <section className="lp-top">
          <aside>
            {(
              [
                ["Line direction d", "d", d],
                ["Plane normal n", "n", normal],
              ] as const
            ).map(([title, kind, v]) => (
              <article key={kind}>
                <h3>{title}</h3>
                <fieldset>
                  {(["x", "y", "z"] as const).map((a) => (
                    <label key={a}>
                      {kind}
                      <sub>{a}</sub>
                      <input
                        aria-label={`${kind} ${a}`}
                        type="number"
                        step=".2"
                        value={v[a]}
                        onChange={(e) => {
                          set(kind, a, +e.target.value);
                          setPreset("general");
                        }}
                      />
                    </label>
                  ))}
                </fieldset>
                <strong>
                  {kind}={tup(v)}
                </strong>
                <p>
                  |{kind}|={nice(norm(v))}
                </p>
              </article>
            ))}
            <article>
              <h3>Quick presets</h3>
              <select
                aria-label="Line-plane preset"
                value={preset}
                onChange={(e) => apply(e.target.value as Preset)}
              >
                <option value="general">Current: General (skew)</option>
                <option value="parallel">Parallel (d ∥ plane)</option>
                <option value="perpendicular">Perpendicular (d ⟂ plane)</option>
              </select>
              <button onClick={() => apply("parallel")}>Parallel</button>
              <button onClick={() => apply("perpendicular")}>
                Perpendicular
              </button>
            </article>
          </aside>
          <article className="lp-scene">
            <div
              className="lp-canvas"
              style={{
                transform: `perspective(900px) rotateY(${camera.rotate}deg) scale(${camera.zoom})`,
              }}
            >
              <svg
                viewBox="0 0 650 430"
                onPointerMove={move}
                onPointerUp={() => setDrag(false)}
                onPointerLeave={() => setDrag(false)}
                aria-label="Line direction, plane normal, and projection"
              >
                {grid &&
                  [0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      className="grid"
                      x1={75 + i * 95}
                      y1="330"
                      x2={230 + i * 75}
                      y2="185"
                    />
                  ))}
                <polygon
                  className="plane"
                  points="70,315 275,165 585,240 370,375"
                />
                <line className="axis" x1="80" y1="300" x2="575" y2="300" />
                <line
                  className="normal"
                  x1={o.x}
                  y1={o.y}
                  x2={np.x}
                  y2={np.y}
                />
                <line
                  className="direction"
                  x1={o.x}
                  y1={o.y}
                  x2={dp.x}
                  y2={dp.y}
                />
                <line
                  className="projection"
                  x1={o.x}
                  y1={o.y}
                  x2={proj.x}
                  y2={proj.y}
                />
                <line
                  className="drop"
                  x1={dp.x}
                  y1={dp.y}
                  x2={proj.x}
                  y2={proj.y}
                />
                <circle className="origin" cx={o.x} cy={o.y} r="6" />
                <circle
                  aria-label="Line direction drag handle"
                  tabIndex={0}
                  className="handle"
                  cx={dp.x}
                  cy={dp.y}
                  r="9"
                  onKeyDown={nudge}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(true);
                  }}
                />
                <text x={dp.x + 8} y={dp.y - 8}>
                  d={tup(d)}
                </text>
                <text x={np.x + 8} y={np.y}>
                  n={tup(normal)}
                </text>
                <text x={proj.x + 8} y={proj.y + 12}>
                  Proj={tup(calc.projection)}
                </text>
                <text x={o.x + 25} y={o.y - 22}>
                  θ={angleText}°
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
              <button onClick={() => setCamera({ rotate: 0, pan: 0, zoom: 1 })}>
                <Maximize2 />
                Fit
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
            </footer>
          </article>
        </section>
        <section className="lp-exact">
          <h3>EXACT VALUES</h3>
          <div>
            <article>
              <b>Dot product</b>
              <strong>d·n={nice(calc.product)}</strong>
            </article>
            <article>
              <b>Magnitudes</b>
              <strong>
                |d|={nice(calc.dn)}
                <br />
                |n|={nice(calc.nn)}
              </strong>
            </article>
            <article>
              <b>Angle (line with plane)</b>
              <p>sin θ=|d·n|/(|d||n|)</p>
              <strong>θ={angleText}°</strong>
            </article>
            <article>
              <b>Complementary angle (line with normal)</b>
              <p>cos φ=|d·n|/(|d||n|)</p>
              <strong>φ={normalAngleText}°</strong>
            </article>
            <article>
              <b>Projection length</b>
              <strong>{nice(calc.projectionLength)}</strong>
            </article>
          </div>
        </section>
        <section className="lp-middle">
          <article>
            <h3>KEY POINTS</h3>
            <p>Normal component of d: {tup(calc.normalComponent)}</p>
            <p>Projection vector on plane: {tup(calc.projection)}</p>
            <p>Check n·projection={nice(dot(normal, calc.projection))}</p>
            <p>Line through origin: L(t)=t{tup(d)}</p>
            <p>
              Plane through origin: {normal.x}x+{normal.y}y+{normal.z}z=0
            </p>
          </article>
          <article>
            <h3>INTERPRETATION</h3>
            <p>θ={angleText}° is the acute angle between line and plane.</p>
            <p>φ={normalAngleText}° is the complementary line-normal angle.</p>
            <p>
              The green projection has length {nice(calc.projectionLength)}.
            </p>
            <p>The endpoint's perpendicular foot is {tup(calc.projection)}.</p>
            <section>
              <h3>COMMON MISTAKE</h3>
              <p>
                Do not use cosine directly for the line-plane angle. Use sine,
                or 90° minus the line-normal angle.
              </p>
            </section>
          </article>
        </section>
        <section className="lp-bottom">
          <article>
            <h3>WORKED EXAMPLE</h3>
            <p>d=(1,2,2), n=(2,-1,2), dot=4, and both magnitudes are 3.</p>
            <p>sin θ=4/9, hence θ=26.3878°.</p>
            <button onClick={() => setSteps((v) => !v)}>
              <Eye />
              View steps
            </button>
            {steps && (
              <p>
                Normal component=(8/9,-4/9,8/9); projection=(1/9,22/9,10/9).
              </p>
            )}
          </article>
          <article>
            <h3>PRACTICE</h3>
            <ol>
              <li>d=(2,1,2), plane x-2y+2z=0.</li>
              <li>d=(1,1,0), plane x+y+z=0.</li>
              <li>d=(2,-1,3), plane 2x+y-2z=0.</li>
            </ol>
            <button onClick={() => setChecked((v) => !v)}>Check answers</button>
            {checked && (
              <p>
                <Check />
                Use θ=asin(|d·n|/(|d||n|)) for each.
              </p>
            )}
          </article>
          <article>
            <h3>SPECIAL CASES</h3>
            <p>
              <b>Parallel:</b> d·n=0 ⇒ θ=0° {calc.parallel && <Check />}
            </p>
            <p>
              <b>Perpendicular:</b> d parallel n ⇒ θ=90°{" "}
              {calc.perpendicular && <Check />}
            </p>
            <p>Otherwise 0°&lt;θ&lt;90°.</p>
          </article>
        </section>
        <section className="lp-summary">
          <b>Formula summary</b>
          <span>sin θ=|d·n|/(|d||n|)</span>
          <span>0°≤θ≤90°</span>
          <span>φ=90°-θ</span>
          <span>
            {!calc.valid && (
              <>
                <X /> Direction and normal must be nonzero.
              </>
            )}
          </span>
        </section>
      </main>
    </section>
  );
}
