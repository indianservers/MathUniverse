import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./HomogeneousFirstOrderTargetLesson10189.css";

const fmt = (n: number, d = 4) => Number(n.toFixed(d));
export default function HomogeneousFirstOrderTargetLesson10189({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [scale, setScale] = useState(1),
    [showSlope, setShowSlope] = useState(true),
    [solution, setSolution] = useState(true),
    [work, setWork] = useState(""),
    [feedback, setFeedback] = useState("");
  const x = 4 * scale,
    y = 2 * scale,
    v = y / x,
    slope = 1 + v;
  const families = useMemo(
    () =>
      [-2, -1, 0, 1, 2].map((c) => ({
        c,
        points: Array.from({ length: 181 }, (_, i) => {
          const px = -4 + (i * 8) / 180;
          if (Math.abs(px) < 0.05) return null;
          const py = px * Math.log(Math.abs(px)) + c * px;
          return `${190 + px * 40},${145 - py * 22}`;
        })
          .filter(Boolean)
          .join(" "),
      })),
    [],
  );
  const change = (n: number) =>
    setScale(Math.max(0.25, Math.min(1.45, Math.round(n * 20) / 20)));
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      change((((p.clientX - r.left) / r.width) * 12 - 6) / 4);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const reset = () => {
    setScale(1);
    setShowSlope(true);
    setSolution(true);
    setWork("");
    setFeedback("");
  };
  const check = () => {
    const s = work.toLowerCase().replace(/\s/g, "");
    setFeedback(
      (s.includes("v=y/x") || s.includes("y=vx")) &&
        s.includes("ln|x|") &&
        s.includes("cx")
        ? "Correct: ratio substitution gives y = x ln|x| + Cx, x ≠ 0."
        : "Show v=y/x, use y=vx and y′=v+xv′, integrate dv=dx/x, then back-substitute.",
    );
  };
  return (
    <main
      className="hfo10189-page"
      data-testid="school-mockup-0863"
      data-object-model="dedicated-homogeneous-ratio-substitution-engine"
      data-x={fmt(x, 2)}
      data-y={fmt(y, 2)}
      data-ratio={fmt(v)}
      data-slope={fmt(slope)}
    >
      <header className="hfo-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>Homogeneous First-Order Equations</h1>
        <p>Ratio-substitution lab for dy/dx = (x+y)/x = 1 + y/x.</p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>calculus</span>
        </div>
      </header>
      <section className="hfo-lab">
        <h3>♙ &nbsp; RATIO-SUBSTITUTION LAB</h3>
        <div className="hfo-grid">
          <article className="hfo-geometry">
            <h3>❶ &nbsp; Geometry: slope depends only on v = y/x</h3>
            <p className="formula">
              dy/dx = 1 + y/x = 1 + v is constant along each ray from the
              origin.
            </p>
            <div className="hfo-graph-row">
              <aside>
                <b>Drag point P</b>
                <strong>
                  P({fmt(x, 2)}, {fmt(y, 2)})
                </strong>
                <hr />
                <b>v = y/x</b>
                <strong>{fmt(v)}</strong>
                <hr />
                <b>Slope</b>
                <strong>{fmt(slope)}</strong>
                <p>Move P along the same ray. Slope stays the same.</p>
                <button onClick={reset}>
                  <RotateCcw /> Reset point
                </button>
              </aside>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showSlope}
                    onChange={(e) => setShowSlope(e.target.checked)}
                  />{" "}
                  Show slope value
                </label>
                <svg
                  viewBox="0 0 390 340"
                  aria-label="Ratio invariant ray graph"
                >
                  {Array.from({ length: 13 }, (_, i) => (
                    <g key={i}>
                      <line
                        x1={30 + i * 27}
                        y1="20"
                        x2={30 + i * 27}
                        y2="320"
                        className="gridline"
                      />
                      <line
                        x1="30"
                        y1={20 + i * 25}
                        x2="360"
                        y2={20 + i * 25}
                        className="gridline"
                      />
                    </g>
                  ))}
                  {[-1.5, -1, -0.5, 0.5, 1, 1.5].map((m) => (
                    <line
                      key={m}
                      x1="195"
                      y1="170"
                      x2={195 + 150 * Math.sign(m)}
                      y2={170 - 150 * Math.abs(m)}
                      className="ray muted"
                    />
                  ))}
                  <line x1="30" y1="170" x2="365" y2="170" className="axis" />
                  <line x1="195" y1="15" x2="195" y2="325" className="axis" />
                  <line
                    x1="195"
                    y1="170"
                    x2={195 + x * 32}
                    y2={170 - y * 32}
                    className="ray active"
                  />
                  <circle
                    cx={195 + x * 32}
                    cy={170 - y * 32}
                    r="7"
                    tabIndex={0}
                    onPointerDown={drag}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") change(scale - 0.05);
                      if (e.key === "ArrowRight") change(scale + 0.05);
                    }}
                  />
                  <text x={205 + x * 32} y={165 - y * 32}>
                    P ({fmt(x, 1)}, {fmt(y, 1)})
                  </text>
                  {showSlope && (
                    <g>
                      <rect x="210" y="205" width="145" height="58" rx="7" />
                      <text x="220" y="225">
                        v = tan θ = y/x = {fmt(v)}
                      </text>
                      <text x="220" y="247">
                        Slope = 1 + v = {fmt(slope)}
                      </text>
                    </g>
                  )}
                </svg>
                <input
                  aria-label="Point along ray"
                  type="range"
                  min=".25"
                  max="1.45"
                  step=".05"
                  value={scale}
                  onChange={(e) => change(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="hfo-key">
              <b>Key fact:</b> All points on the same ray (same v) give the same
              slope 1+v.
            </p>
          </article>
          <article className="hfo-derive">
            <h3>❷ &nbsp; Ratio substitution &amp; solve</h3>
            {[
              ["Substitute", "y = vx", "Let v=y/x. Then y=vx."],
              ["Differentiate (product rule)", "dy/dx = v + x dv/dx", ""],
              ["Substitute into the equation", "v + x dv/dx = 1 + v", ""],
              ["Simplify", "dv/dx = 1/x", ""],
              ["Integrate", "v = ln|x| + C", ""],
              ["Back-substitute v=y/x", "y = x ln|x| + Cx", ""],
            ].map(([a, b, c], i) => (
              <div key={a}>
                <i>{i + 1}</i>
                <b>{a}</b>
                <p className="formula">{b}</p>
                {c && <small>{c}</small>}
              </div>
            ))}
            <strong className="hfo-answer">
              General solution: y = x ln|x| + Cx, &nbsp; x ≠ 0
            </strong>
          </article>
        </div>
      </section>
      <section className="hfo-middle">
        <article>
          <h3>❸ &nbsp; Scale test (homogeneity test)</h3>
          <p className="formula">F(x,y) = (x+y)/x</p>
          <table>
            <thead>
              <tr>
                <th>(x,y)</th>
                <th>F(x,y)</th>
                <th>(tx,ty)</th>
                <th>F(tx,ty)</th>
                <th>Equal?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["(3,1)", "4/3", "(6,2)", "4/3"],
                ["(2,−1)", "1/2", "(6,−3)", "1/2"],
                ["(−4,2)", "1/2", "(−8,4)", "1/2"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c) => (
                    <td key={c}>{c}</td>
                  ))}
                  <td>✓</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Since F(tx,ty)=F(x,y) for all t≠0, the equation is homogeneous of
            degree 0.
          </p>
        </article>
        <article>
          <h3>❹ &nbsp; Slope field &amp; solution family</h3>
          <svg viewBox="0 0 380 290">
            {Array.from({ length: 13 * 11 }, (_, i) => {
              const col = i % 13,
                row = Math.floor(i / 13),
                px = -3 + col * 0.5,
                py = -2.5 + row * 0.5,
                m = Math.abs(px) < 0.1 ? 8 : 1 + py / px,
                a = Math.atan(m),
                cx = 35 + col * 25,
                cy = 150 - row * 20,
                dx = Math.cos(a) * 6,
                dy = -Math.sin(a) * 6;
              return (
                <line
                  key={i}
                  x1={cx - dx}
                  y1={cy - dy}
                  x2={cx + dx}
                  y2={cy + dy}
                  className="slope"
                />
              );
            })}
            {families.map((f, i) => (
              <polyline
                key={f.c}
                points={f.points}
                className={`family c${i}`}
              />
            ))}
          </svg>
          <div className="hfo-legend">
            {families.map((f) => (
              <span key={f.c}>C = {f.c}</span>
            ))}
          </div>
          <p>
            <b>Domain:</b> x ≠ 0. Solutions exist on each interval (−∞,0) and
            (0,∞).
          </p>
        </article>
        <article>
          <h3>❺ &nbsp; Domain &amp; caution</h3>
          <div className="hfo-domain">Domain: x ≠ 0</div>
          <div className="hfo-warn">
            <b>⚠ Do not confuse!</b>
            <p>
              This is NOT a homogeneous linear equation of the form
              dy/dx+P(x)y=Q(x).
            </p>
            <p>
              It is homogeneous first-order because F(x,y) depends only on y/x
              and satisfies F(tx,ty)=F(x,y).
            </p>
          </div>
        </article>
      </section>
      <section className="hfo-practice">
        <div className="hfo-practice-title">
          <h3>❻ &nbsp; Targeted Practice</h3>
          <button onClick={() => setSolution((x) => !x)}>
            {solution ? <EyeOff /> : <Eye />}
            {solution ? "Hide solution" : "Show solution"}
          </button>
        </div>
        <div>
          <aside>
            <b>Problem</b>
            <p className="formula">dy/dx = (x+y)/x</p>
          </aside>
          <label>
            Your work (sketch steps)
            <textarea
              value={work}
              onChange={(e) => setWork(e.target.value)}
              placeholder="Write your steps here..."
            />
            <button onClick={check}>◎ Check answer</button>
            {feedback && (
              <p
                className={
                  feedback.startsWith("Correct") ? "correct" : "incorrect"
                }
              >
                {feedback}
              </p>
            )}
          </label>
        </div>
        {solution && (
          <p>
            <b>Full solution</b>
            <br />
            Using v=y/x, the solution is y=x ln|x|+Cx, x≠0.
          </p>
        )}
      </section>
      <nav className="hfo-nav">
        <Link to="/lessons/school/class-12/class-12-differential-equations-variable-separable-equations">
          ← Variable-Separable Equations
        </Link>
        <Link to="/lessons/school/class-12/class-12-differential-equations-linear-first-order-equations">
          Linear First-Order Equations →
        </Link>
      </nav>
      <div className="hfo-complete">
        Ratio preserved · homogeneous equation solved · domain checked
      </div>
    </main>
  );
}
