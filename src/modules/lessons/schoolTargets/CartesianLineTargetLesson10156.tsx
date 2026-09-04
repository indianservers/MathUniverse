import { Check, CircleHelp, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CartesianLineTargetLesson10156.css";
type V = { x: number; y: number; z: number };
const P0 = { x: 1, y: 2, z: -1 },
  D0 = { x: 2, y: -1, z: 3 };
const f = (n: number) => Number(n.toFixed(2));
export default function CartesianLineTargetLesson10156({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [p0, setP0] = useState(P0),
    [d, setD] = useState(D0),
    [t, setT] = useState(1.5),
    [q, setQ] = useState({ x: 5, y: -1, z: 5 }),
    [checked, setChecked] = useState(false),
    [actions, setActions] = useState(0);
  const p = useMemo(
      () => ({ x: p0.x + t * d.x, y: p0.y + t * d.y, z: p0.z + t * d.z }),
      [p0, d, t],
    ),
    ratios = (["x", "y", "z"] as const).map((a) =>
      d[a] === 0 ? null : (q[a] - p0[a]) / d[a],
    ),
    valid = ratios.filter((n): n is number => n !== null),
    onLine =
      valid.length > 0 &&
      valid.every((n) => Math.abs(n - valid[0]) < 1e-7) &&
      (["x", "y", "z"] as const).every((a) => d[a] !== 0 || q[a] === p0[a]),
    mag = Math.hypot(d.x, d.y, d.z);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    set = (kind: "p" | "d" | "q", a: keyof V, n: number) =>
      act(() =>
        kind === "p"
          ? setP0((v) => ({ ...v, [a]: n }))
          : kind === "d"
            ? setD((v) => ({ ...v, [a]: n }))
            : setQ((v) => ({ ...v, [a]: n })),
      );
  const reset = () =>
    act(() => {
      setP0(P0);
      setD(D0);
      setT(1.5);
      setQ({ x: 5, y: -1, z: 5 });
      setChecked(false);
    });
  const sx = (x: number) => 300 + x * 34,
    sy = (y: number, z: number) => 250 - y * 15 - z * 25;
  return (
    <section
      className="cl10156-page"
      data-testid="school-mockup-0830"
      data-object-model="dedicated-parametric-to-cartesian-line-elimination-engine"
      data-point={`${p.x},${p.y},${p.z}`}
      data-direction={`${d.x},${d.y},${d.z}`}
      data-membership={String(onLine)}
      data-magnitude={mag.toFixed(4)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Cartesian Equation of a Line</h1>
        <p>
          Convert parametric equations to symmetric Cartesian form by
          eliminating the parameter.
        </p>
        <div>
          <span>20 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main className="cl-lab">
        <div className="cl-title">
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Parameter-Elimination Lab</h2>
            <p>
              Convert the parametric equations of a line to Cartesian form using
              parameter elimination.
            </p>
          </div>
          <span>
            <button onClick={reset}>
              <RotateCcw />
              Reset lab
            </button>
            <button
              onClick={() =>
                alert(
                  "Isolate t from every equation, preserve signs, then equate the resulting expressions.",
                )
              }
            >
              <CircleHelp />
              How it works
            </button>
          </span>
        </div>
        <section className="cl-top">
          <aside>
            <article>
              <h3>LINE GIVEN IN PARAMETRIC FORM</h3>
              {(["p", "d"] as const).map((kind) => (
                <div className="triple" key={kind}>
                  <b>
                    {kind === "p" ? "Point on line P₀" : "Direction ratios"}
                  </b>
                  {(["x", "y", "z"] as const).map((a) => (
                    <label key={a}>
                      {a}
                      <input
                        aria-label={`${kind} ${a}`}
                        type="number"
                        value={(kind === "p" ? p0 : d)[a]}
                        onChange={(e) => set(kind, a, +e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              ))}
              <p className="equation">
                x = {p0.x} {d.x < 0 ? "−" : "+"} {Math.abs(d.x)}t<br />y ={" "}
                {p0.y} {d.y < 0 ? "−" : "+"} {Math.abs(d.y)}t<br />z = {p0.z}{" "}
                {d.z < 0 ? "−" : "+"} {Math.abs(d.z)}t
              </p>
            </article>
            <article>
              <h3>t SLIDER (MOVE POINT ON LINE)</h3>
              <label className="slider">
                t = {t.toFixed(2)}
                <input
                  aria-label="Cartesian line t"
                  type="range"
                  min="-5"
                  max="5"
                  step=".1"
                  value={t}
                  onInput={(e) => setT(+e.currentTarget.value)}
                  onChange={(e) => act(() => setT(+e.target.value))}
                />
              </label>
            </article>
            <article>
              <h3>CURRENT POINT ON LINE</h3>
              <p className="equation">
                P(t) = ({f(p.x)}, {f(p.y)}, {f(p.z)})
              </p>
            </article>
          </aside>
          <article className="cl-graph">
            <h3>3D LINE &amp; COMPONENT PROJECTIONS</h3>
            <svg
              viewBox="0 0 620 405"
              aria-label="Cartesian line with component projections"
            >
              <line className="axis x" x1="70" y1="280" x2="555" y2="280" />
              <line className="axis y" x1="125" y1="350" x2="500" y2="100" />
              <line className="axis z" x1="300" y1="370" x2="300" y2="45" />
              <line
                className="line"
                x1={sx(p0.x - 3 * d.x)}
                y1={sy(p0.y - 3 * d.y, p0.z - 3 * d.z)}
                x2={sx(p0.x + 3 * d.x)}
                y2={sy(p0.y + 3 * d.y, p0.z + 3 * d.z)}
              />
              <line
                className="proj red"
                x1={sx(p.x)}
                y1={sy(p.y, p.z)}
                x2={sx(p.x)}
                y2={sy(0, p.z)}
              />
              <line
                className="proj green"
                x1={sx(p.x)}
                y1={sy(p.y, p.z)}
                x2={sx(0)}
                y2={sy(p.y, p.z)}
              />
              <line
                className="proj violet"
                x1={sx(p.x)}
                y1={sy(p.y, p.z)}
                x2={sx(p.x)}
                y2={sy(p.y, 0)}
              />
              <circle
                className="given"
                cx={sx(p0.x)}
                cy={sy(p0.y, p0.z)}
                r="7"
              />
              <circle className="point" cx={sx(p.x)} cy={sy(p.y, p.z)} r="8" />
              <text x={sx(p0.x) + 8} y={sy(p0.y, p0.z) + 15}>
                P₀({p0.x},{p0.y},{p0.z})
              </text>
              <text x={sx(p.x) + 8} y={sy(p.y, p.z) - 10}>
                P(t)
              </text>
            </svg>
            <div className="projection-cards">
              <span>
                t = {t.toFixed(2)}
                <b>
                  P({t}) = ({f(p.x)},{f(p.y)},{f(p.z)})
                </b>
              </span>
              <span>
                x = {f(p.x)}
                <b>on yz-plane</b>
              </span>
              <span>
                y = {f(p.y)}
                <b>on xz-plane</b>
              </span>
              <span>
                z = {f(p.z)}
                <b>on xy-plane</b>
              </span>
            </div>
          </article>
        </section>
        <section className="cl-eliminate">
          <h3>ELIMINATE t FROM EACH EQUATION</h3>
          <div>
            {(["x", "y", "z"] as const).map((a) => (
              <article key={a}>
                <b>
                  From &nbsp; {a} = {p0[a]} {d[a] < 0 ? "−" : "+"}{" "}
                  {Math.abs(d[a])}t
                </b>
                {d[a] === 0 ? (
                  <strong>
                    {a} = {p0[a]} (constant)
                  </strong>
                ) : (
                  <>
                    <p>
                      {a} − ({p0[a]}) = {d[a]}t
                    </p>
                    <strong>
                      t = ({a} − ({p0[a]})) / {d[a]}
                    </strong>
                  </>
                )}
                <small>
                  Denominator {d[a]} = {a}-component
                </small>
              </article>
            ))}
          </div>
          <section>
            <b>EQUATE THE EXPRESSIONS FOR t</b>
            <p className="symmetric">
              {sym("x", p0.x, d.x)} &nbsp; = &nbsp; {sym("y", p0.y, d.y)} &nbsp;
              = &nbsp; {sym("z", p0.z, d.z)}
            </p>
          </section>
        </section>
        <section className="cl-concepts">
          <article>
            <h3>BACK TO PARAMETRIC FORM</h3>
            <p>Let the common value be t.</p>
            <p>
              {sym("x", p0.x, d.x)}=t ⇒ x={p0.x}+{d.x}t
            </p>
            <p>
              {sym("y", p0.y, d.y)}=t ⇒ y={p0.y}+{d.y}t
            </p>
            <p>
              {sym("z", p0.z, d.z)}=t ⇒ z={p0.z}+{d.z}t
            </p>
          </article>
          <article>
            <h3>POINT MEMBERSHIP TEST</h3>
            <div className="q-input">
              {(["x", "y", "z"] as const).map((a) => (
                <label key={a}>
                  {a}
                  <input
                    aria-label={`Test point ${a}`}
                    type="number"
                    value={q[a]}
                    onChange={(e) => set("q", a, +e.target.value)}
                  />
                </label>
              ))}
            </div>
            <p>Compare (Qx−x₀)/l, (Qy−y₀)/m, (Qz−z₀)/n.</p>
            <button onClick={() => act(() => setChecked(true))}>
              Test point
            </button>
            {checked && (
              <strong className={onLine ? "yes" : "no"}>
                {onLine ? <Check /> : <X />}
                {onLine ? `On the line at t=${f(valid[0])}` : "Not on the line"}
              </strong>
            )}
          </article>
          <article>
            <h3>WHEN A DIRECTION COMPONENT IS ZERO</h3>
            <p>
              If any direction ratio is 0, use the constant coordinate instead
              of dividing by zero.
            </p>
            <p>Example (2,0,3): (x−1)/2 = (z+1)/3, y=2.</p>
          </article>
        </section>
        <section className="cl-warning">
          <h3>SIGN WARNING</h3>
          <p>
            Do not drop the sign of direction components. The denominator must
            match the direction ratio exactly.
          </p>
          <p>Correct: (y−2)/−1 &nbsp; ✓ &nbsp; Incorrect: (y−2)/1 &nbsp; ✕</p>
        </section>
        <section className="cl-worked">
          <h3>WORKED EXAMPLE</h3>
          <div>
            <article>
              <b>Parametric form</b>
              <p>x=1+2t, y=2−t, z=−1+3t</p>
            </article>
            <article>
              <b>Eliminate t</b>
              <p>(x−1)/2 = (y−2)/−1 = (z+1)/3</p>
            </article>
            <article>
              <b>Check t=−2.5</b>
              <p>P=(−4,4.5,−8.5), and every ratio equals −2.5.</p>
            </article>
          </div>
        </section>
        <section className="cl-practice">
          <article>
            <h3>PRACTICE</h3>
            <p>Convert each line to symmetric form.</p>
            {[
              [
                [2, -1, 3],
                [1, 2, -1],
              ],
              [
                [-1, 4, 0],
                [3, -2, 1],
              ],
              [
                [0, 0, 0],
                [-2, 1, 2],
              ],
            ].map((v, i) => (
              <details key={i}>
                <summary>
                  {i + 1}. Through ({v[0].join(",")}), direction (
                  {v[1].join(",")})
                </summary>
                <p>
                  {sym("x", v[0][0], v[1][0])} = {sym("y", v[0][1], v[1][1])} ={" "}
                  {sym("z", v[0][2], v[1][2])}
                </p>
              </details>
            ))}
          </article>
          <article>
            <h3>ASSESSMENT PROMPTS</h3>
            <ol>
              <li>State one rule for Cartesian equation of a line.</li>
              <li>What happens if one direction ratio is zero?</li>
              <li>Why keep direction signs?</li>
              <li>Convert symmetric to parametric form.</li>
            </ol>
          </article>
        </section>
      </main>
    </section>
  );
}
const sym = (a: string, p: number, d: number) =>
  d === 0 ? `${a} = ${p}` : `(${a} − (${p}))/${d}`;
