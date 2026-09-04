import { Check, CircleHelp, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./VectorEquationLineTargetLesson10155.css";
type V = { x: number; y: number; z: number };
const A0 = { x: 1, y: -1, z: 2 },
  B0 = { x: 2, y: 1, z: 3 };
const fmt = (n: number) => Number(n.toFixed(3));
export default function VectorEquationLineTargetLesson10155({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(A0),
    [b, setB] = useState(B0),
    [lambda, setLambda] = useState(2),
    [layers, setLayers] = useState({
      anchor: true,
      direction: true,
      line: true,
      point: true,
      axes: true,
    }),
    [angle, setAngle] = useState(-0.5),
    [auto, setAuto] = useState(false),
    [answers, setAnswers] = useState({
      p: ["", "", ""] as string[],
      lambda: "",
      onLine: "",
    }),
    [feedback, setFeedback] = useState<Record<string, boolean>>({}),
    [actions, setActions] = useState(0);
  const p = useMemo(
      () => ({
        x: a.x + lambda * b.x,
        y: a.y + lambda * b.y,
        z: a.z + lambda * b.z,
      }),
      [a, b, lambda],
    ),
    ma = Math.hypot(a.x, a.y, a.z),
    mb = Math.hypot(b.x, b.y, b.z),
    dot = a.x * b.x + a.y * b.y + a.z * b.z,
    theta = (Math.acos(dot / (ma * mb)) * 180) / Math.PI;
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(
      () => setLambda((l) => (l >= 4 ? -4 : Number((l + 0.1).toFixed(1)))),
      100,
    );
    return () => clearInterval(id);
  }, [auto]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    setComp = (kind: "a" | "b", axis: keyof V, n: number) =>
      act(() =>
        kind === "a"
          ? setA((v) => ({ ...v, [axis]: n }))
          : setB((v) => ({ ...v, [axis]: n })),
      ),
    project = (q: V) => {
      const c = Math.cos(angle),
        s = Math.sin(angle),
        x = q.x * c - q.y * s,
        y = q.x * s + q.y * c;
      return { x: 315 + x * 26, y: 280 + y * 12 - q.z * 25 };
    },
    o = project({ x: 0, y: 0, z: 0 }),
    pa = project(a),
    pb = project(b),
    pp = project(p),
    lineStart = project({
      x: a.x - 3 * b.x,
      y: a.y - 3 * b.y,
      z: a.z - 3 * b.z,
    }),
    lineEnd = project({ x: a.x + 4 * b.x, y: a.y + 4 * b.y, z: a.z + 4 * b.z });
  const reset = () =>
    act(() => {
      setA(A0);
      setB(B0);
      setLambda(2);
      setLayers({
        anchor: true,
        direction: true,
        line: true,
        point: true,
        axes: true,
      });
      setAngle(-0.5);
      setAuto(false);
      setAnswers({ p: ["", "", ""], lambda: "", onLine: "" });
      setFeedback({});
    });
  return (
    <section
      className="ve10155-page"
      data-testid="school-mockup-0829"
      data-object-model="dedicated-anchor-direction-vector-line-engine"
      data-anchor={`${a.x},${a.y},${a.z}`}
      data-direction={`${b.x},${b.y},${b.z}`}
      data-lambda={lambda}
      data-point={`${p.x},${p.y},${p.z}`}
      data-dot={dot.toFixed(3)}
      data-angle={theta.toFixed(3)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Vector Equation of a Line</h1>
        <p>
          Explore the line determined by an anchor point a and direction vector
          b using r = a + λb.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main className="ve-lab">
        <div className="ve-title">
          <div>
            <small>INTERACTIVE EXPLORER</small>
            <h2>Anchor + Direction 3D Explorer</h2>
          </div>
          <span>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={() => act(() => setAuto((v) => !v))}>
              <Play />
              {auto ? "Pause" : "Animate"}
            </button>
            <button
              onClick={() =>
                alert(
                  "Edit a and b, then move lambda to trace every point on the line.",
                )
              }
            >
              <CircleHelp />
              Help
            </button>
          </span>
        </div>
        <section className="ve-top">
          <aside className="ve-controls">
            <div className="lambda-badge">λ = {lambda}</div>
            {(["a", "b"] as const).map((kind) => (
              <article key={kind}>
                <h3>
                  {kind === "a" ? "Anchor vector a" : "Direction vector b"}
                </h3>
                <b>
                  {kind} = ({Object.values(kind === "a" ? a : b).join(", ")})
                </b>
                <div>
                  {(["x", "y", "z"] as const).map((axis) => (
                    <label key={axis}>
                      {axis}
                      <input
                        aria-label={`${kind} ${axis}`}
                        type="number"
                        value={(kind === "a" ? a : b)[axis]}
                        onChange={(e) => setComp(kind, axis, +e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </article>
            ))}
            <article>
              <h3>Parameter λ</h3>
              <label className="lambda">
                <input
                  aria-label="Line lambda"
                  type="range"
                  min="-4"
                  max="4"
                  step=".1"
                  value={lambda}
                  onInput={(e) => setLambda(+e.currentTarget.value)}
                  onChange={(e) => act(() => setLambda(+e.target.value))}
                />
                <output>{lambda}</output>
              </label>
              <p>P(λ)=a+λb</p>
              <strong>
                P({lambda}) = ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
              </strong>
            </article>
            <div className="layer-list">
              {Object.entries(layers).map(([key, on]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      act(() => setLayers((v) => ({ ...v, [key]: !on })))
                    }
                  />
                  Show {key}
                </label>
              ))}
            </div>
          </aside>
          <article className="ve-scene">
            <svg
              viewBox="0 0 630 510"
              aria-label="Interactive anchor direction vector line scene"
            >
              {layers.axes && (
                <>
                  <line className="axis x" x1="65" y1="280" x2="570" y2="280" />
                  <line
                    className="axis y"
                    x1="100"
                    y1="410"
                    x2="545"
                    y2="115"
                  />
                  <line className="axis z" x1={o.x} y1="475" x2={o.x} y2="45" />
                  <text x="575" y="277">
                    x
                  </text>
                  <text x="550" y="112">
                    y
                  </text>
                  <text x={o.x + 5} y="40">
                    z
                  </text>
                </>
              )}
              {layers.line && (
                <line
                  className="line"
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                />
              )}{" "}
              {layers.anchor && (
                <>
                  <line
                    className="anchor"
                    x1={o.x}
                    y1={o.y}
                    x2={pa.x}
                    y2={pa.y}
                  />
                  <circle className="a" cx={pa.x} cy={pa.y} r="7" />
                  <text x={pa.x + 10} y={pa.y}>
                    A = a ({a.x}, {a.y}, {a.z})
                  </text>
                </>
              )}
              {layers.direction && (
                <>
                  <line
                    className="direction"
                    x1={o.x}
                    y1={o.y}
                    x2={pb.x}
                    y2={pb.y}
                  />
                  <text x={pb.x + 7} y={pb.y}>
                    b ({b.x}, {b.y}, {b.z})
                  </text>
                </>
              )}
              {layers.point && (
                <>
                  <circle className="p" cx={pp.x} cy={pp.y} r="8" />
                  <text className="plabel" x={pp.x + 10} y={pp.y}>
                    P({lambda}) = ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
                  </text>
                </>
              )}
            </svg>
            <div className="scene-legend">
              <span>
                ━ a = ({a.x},{a.y},{a.z})
              </span>
              <span>
                ━ b = ({b.x},{b.y},{b.z})
              </span>
              <span>┄ Line r=a+λb</span>
            </div>
          </article>
          <aside className="ve-results">
            <article>
              <h3>Current values</h3>
              <p>
                a = ({a.x},{a.y},{a.z})
              </p>
              <p>|a| = {fmt(ma)}</p>
              <p>
                b = ({b.x},{b.y},{b.z})
              </p>
              <p>|b| = {fmt(mb)}</p>
              <p>a · b = {fmt(dot)}</p>
              <p>Angle(a,b) = {fmt(theta)}°</p>
              <p>λ = {lambda}</p>
              <p>
                P({lambda}) = ({fmt(p.x)},{fmt(p.y)},{fmt(p.z)})
              </p>
            </article>
            <article className="violet">
              <h3>Vector equation</h3>
              <p>r = a + λb</p>
              <p>
                = ({a.x},{a.y},{a.z}) + λ({b.x},{b.y},{b.z})
              </p>
            </article>
            <article className="blue">
              <h3>Coordinate (symmetric) form</h3>
              <p>
                (x−{a.x})/{b.x} = (y−({a.y}))/{b.y} = (z−{a.z})/{b.z}
              </p>
            </article>
            <article className="green">
              <h3>Parametric form</h3>
              <p>
                x = {a.x} + {b.x}λ<br />y = {a.y} + {b.y}λ<br />z = {a.z} +{" "}
                {b.z}λ
              </p>
            </article>
          </aside>
        </section>
        <section className="ve-second">
          <article>
            <h3>Vector addition (parallelogram rule)</h3>
            <p>P = a + λb is the diagonal formed by a and λb.</p>
            <svg viewBox="0 0 300 180">
              <line className="a" x1="25" y1="155" x2="85" y2="55" />
              <line className="b" x1="25" y1="155" x2="165" y2="150" />
              <line className="dash" x1="85" y1="55" x2="225" y2="50" />
              <line className="dash" x1="165" y1="150" x2="225" y2="50" />
              <line className="sum" x1="25" y1="155" x2="225" y2="50" />
              <text x="230" y="45">
                P(λ)
              </text>
            </svg>
          </article>
          <article>
            <h3>Positive and negative λ</h3>
            <p>The line extends infinitely in both directions.</p>
            <div className="numberline">
              <i />
              <button onClick={() => act(() => setLambda(-2))}>λ=-2</button>
              <button onClick={() => act(() => setLambda(0))}>λ=0</button>
              <button onClick={() => act(() => setLambda(2))}>λ=2</button>
            </div>
            <div className="lambda-cards">
              <p>
                λ=-2
                <br />
                P=(-3,-3,-4)
              </p>
              <p>
                λ=2
                <br />
                P=(5,1,8)
              </p>
            </div>
          </article>
        </section>
        <section className="ve-third">
          <article>
            <h3>Position vector vs direction vector</h3>
            <div>
              <p>
                <b>Position vector</b>
                <br />
                Gives location of a point and starts at the origin.
              </p>
              <p>
                <b>Direction vector</b>
                <br />
                Gives direction, not position. Parallel multiples define the
                same line.
              </p>
            </div>
          </article>
          <article>
            <h3>Point-on-line test</h3>
            <p>Q=(5,1,8): Q−a=(4,2,6)=2b, so λ=2.</p>
            <strong>
              <Check /> Yes, Q lies on the line at λ=2.
            </strong>
          </article>
        </section>
        <section className="ve-worked">
          <h3>Worked example</h3>
          <div>
            <article>
              <p>For A(1,-1,2), b=(2,1,3):</p>
              <b>r=(1,-1,2)+λ(2,1,3)</b>
            </article>
            <article>
              <b>Parametric equations</b>
              <p>
                x=1+2λ
                <br />
                y=-1+λ
                <br />
                z=2+3λ
              </p>
            </article>
            <article>
              <b>Find points on the line</b>
              <p>
                P(0)=(1,-1,2)
                <br />
                P(1)=(3,0,5)
                <br />
                P(2)=(5,1,8)
              </p>
            </article>
          </div>
        </section>
        <section className="ve-practice">
          <h3>Practice</h3>
          <div>
            <article>
              <b>1 Find P(3)</b>
              <div>
                {answers.p.map((v, i) => (
                  <input
                    key={i}
                    aria-label={`Practice P coordinate ${i + 1}`}
                    value={v}
                    onChange={(e) =>
                      setAnswers((s) => ({
                        ...s,
                        p: s.p.map((x, j) => (j === i ? e.target.value : x)),
                      }))
                    }
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  act(() =>
                    setFeedback((f) => ({
                      ...f,
                      p: answers.p.join(",") === "7,2,11",
                    })),
                  )
                }
              >
                Check
              </button>
              {feedback.p !== undefined && (
                <strong>{feedback.p ? "Correct" : "Try again"}</strong>
              )}
            </article>
            <article>
              <b>2 Find λ if P=(−3,−3,−4)</b>
              <input
                aria-label="Practice lambda"
                value={answers.lambda}
                onChange={(e) =>
                  setAnswers((s) => ({ ...s, lambda: e.target.value }))
                }
              />
              <button
                onClick={() =>
                  act(() =>
                    setFeedback((f) => ({
                      ...f,
                      lambda: answers.lambda === "-2",
                    })),
                  )
                }
              >
                Check
              </button>
              {feedback.lambda !== undefined && (
                <strong>{feedback.lambda ? "Correct" : "Try again"}</strong>
              )}
            </article>
            <article>
              <b>3 Does Q=(9,3,14) lie on the line?</b>
              <select
                aria-label="Point on line answer"
                value={answers.onLine}
                onChange={(e) =>
                  setAnswers((s) => ({ ...s, onLine: e.target.value }))
                }
              >
                <option value="">Choose</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <button
                onClick={() =>
                  act(() =>
                    setFeedback((f) => ({
                      ...f,
                      onLine: answers.onLine === "Yes",
                    })),
                  )
                }
              >
                Check
              </button>
              {feedback.onLine !== undefined && (
                <strong>{feedback.onLine ? "Correct" : "Try again"}</strong>
              )}
            </article>
          </div>
        </section>
        <nav className="ve-adjacent" aria-label="Adjacent vector line lessons">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-line-through-two-points-in-3d">
            ← Line Through Two Points in 3D
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-cartesian-equation-of-a-line">
            Cartesian Equation of a Line →
          </a>
        </nav>
        <nav className="ve-quick" aria-label="Vector line quick links">
          <b>Quick links:</b>
          <a href="/formulas">Formula Sheet</a>
          <a href="/math-lab/3d-graphing">3D Vector Basics</a>
          <a href="/lessons/vectors">Dot Product</a>
          <a href="/lessons/vectors">Cross Product</a>
        </nav>
      </main>
    </section>
  );
}
