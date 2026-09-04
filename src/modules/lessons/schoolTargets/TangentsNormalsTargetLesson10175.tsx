import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TangentsNormalsTargetLesson10175.css";

const f = (x: number) => x * x,
  fmt = (x: number) => Number(x.toFixed(4));
export default function TangentsNormalsTargetLesson10175({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [x0, setX0] = useState(1),
    [q, setQ] = useState(1.5),
    [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState({
    curve: true,
    tangent: true,
    normal: true,
    point: true,
    secant: false,
  });
  const mt = 2 * x0,
    mn = Math.abs(mt) < 1e-9 ? Infinity : -1 / mt,
    ms = Math.abs(q - x0) < 1e-9 ? mt : (f(q) - f(x0)) / (q - x0);
  const curve = useMemo(
    () =>
      Array.from({ length: 121 }, (_, i) => {
        const x = -3 + i * 0.05;
        return `${260 + x * 72},${275 - f(x) * 32}`;
      }).join(" "),
    [],
  );
  const px = (x: number) => 260 + x * 72,
    py = (x: number) => 275 - f(x) * 32;
  const setQSafe = (n: number) => setQ(Math.max(-3, Math.min(3, n)));
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setQSafe(q - 0.01);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setQSafe(q + 0.01);
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const b = svg.getBoundingClientRect();
      setQSafe(((p.clientX - b.left) / b.width) * 7.2 - 3.6);
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const reset = () => {
    setX0(1);
    setQ(1.5);
    setZoom(1);
    setLayers({
      curve: true,
      tangent: true,
      normal: true,
      point: true,
      secant: false,
    });
  };
  const toggle = (name: keyof typeof layers) =>
    setLayers((v) => ({ ...v, [name]: !v[name] }));
  const tangentEq = `y = ${fmt(mt)}x ${fmt(f(x0) - mt * x0) >= 0 ? "+" : ""} ${fmt(f(x0) - mt * x0)}`;
  const normalEq = Number.isFinite(mn)
    ? `y - ${fmt(f(x0))} = ${fmt(mn)}(x - ${fmt(x0)})`
    : `x = ${fmt(x0)}`;
  return (
    <main
      className="tn10175-page"
      data-testid="school-mockup-0849"
      data-object-model="dedicated-tangent-normal-secant-limit-engine"
      data-x0={fmt(x0)}
      data-q={fmt(q)}
      data-tangent-slope={fmt(mt)}
      data-normal-slope={Number.isFinite(mn) ? fmt(mn) : "vertical"}
      data-secant-slope={fmt(ms)}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Tangents and Normals</h1>
        <p>
          For f(x)=x², at x={fmt(x0)}, point P({fmt(x0)}, {fmt(f(x0))}).
          Derivative slope f'({fmt(x0)})={fmt(mt)}.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>interactive</span>
        </div>
      </header>
      <section className="tn-lab">
        <aside>
          <section>
            <h3>FUNCTIONS &amp; LINES</h3>
            {(
              [
                ["curve", "f(x)=x²"],
                ["tangent", `Tangent: ${tangentEq}`],
                ["normal", `Normal: ${normalEq}`],
                ["point", `Point P(${fmt(x0)}, ${fmt(f(x0))})`],
                ["secant", "Secant PQ"],
              ] as const
            ).map(([k, label]) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={layers[k]}
                  onChange={() => toggle(k)}
                />
                {label}
              </label>
            ))}
          </section>
          <section>
            <h3>TOOLS</h3>
            <label>
              x₀
              <input
                aria-label="Tangent point x zero"
                type="range"
                min="-2.5"
                max="2.5"
                step=".1"
                value={x0}
                onInput={(e) => setX0(Number(e.currentTarget.value))}
              />
            </label>
            <label>
              Q x
              <input
                aria-label="Secant point x"
                type="range"
                min="-3"
                max="3"
                step=".01"
                value={q}
                onInput={(e) => setQSafe(Number(e.currentTarget.value))}
              />
            </label>
            <output>{fmt(q)}</output>
          </section>
          <section>
            <h3>ZOOM</h3>
            <button
              aria-label="Zoom in"
              onClick={() => setZoom((v) => Math.min(1.4, v + 0.1))}
            >
              <ZoomIn />
            </button>
            <button
              aria-label="Zoom out"
              onClick={() => setZoom((v) => Math.max(0.7, v - 0.1))}
            >
              <ZoomOut />
            </button>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </section>
        </aside>
        <article>
          <svg
            viewBox="0 0 520 390"
            aria-label="Tangent and normal graph"
            style={{ transform: `scale(${zoom})` }}
          >
            <defs>
              <pattern
                id="tngrid"
                width="52"
                height="45"
                patternUnits="userSpaceOnUse"
              >
                <path d="M52 0H0V45" fill="none" stroke="#dce6eb" />
              </pattern>
            </defs>
            <rect width="520" height="390" fill="url(#tngrid)" />
            <path d="M15 275H505M260 10V375" stroke="#273548" />
            {layers.curve && (
              <polyline
                points={curve}
                fill="none"
                stroke="#176ef0"
                strokeWidth="3"
              />
            )}
            {layers.tangent && (
              <line
                x1="80"
                y1={py(x0) + 180 * mt * 0.444}
                x2="440"
                y2={py(x0) - 180 * mt * 0.444}
                stroke="#14a05d"
                strokeWidth="3"
              />
            )}
            {layers.normal &&
              (Number.isFinite(mn) ? (
                <line
                  x1="70"
                  y1={py(x0) + 190 * mn * 0.444}
                  x2="450"
                  y2={py(x0) - 190 * mn * 0.444}
                  stroke="#ef3434"
                  strokeWidth="2.5"
                />
              ) : (
                <line
                  x1={px(x0)}
                  y1="20"
                  x2={px(x0)}
                  y2="370"
                  stroke="#ef3434"
                  strokeWidth="2.5"
                />
              ))}
            {layers.secant && (
              <line
                x1={px(x0)}
                y1={py(x0)}
                x2={px(q)}
                y2={py(q)}
                stroke="#7b3fce"
                strokeWidth="2"
                strokeDasharray="6"
              />
            )}
            {layers.point && (
              <circle cx={px(x0)} cy={py(x0)} r="7" fill="#7b3fce" />
            )}
            <circle
              role="slider"
              aria-label="Graph secant point Q"
              tabIndex={0}
              onPointerDown={drag}
              onKeyDown={key}
              cx={px(q)}
              cy={py(q)}
              r="7"
              fill="#263548"
            />
            <text x={px(x0) + 8} y={py(x0) - 10}>
              P({fmt(x0)}, {fmt(f(x0))})
            </text>
            <text x={px(q) + 8} y={py(q) - 8}>
              Q({fmt(q)}, {fmt(f(q))})
            </text>
            <text x="365" y="65" fill="#176ef0">
              y=x²
            </text>
          </svg>
        </article>
        <aside>
          <section className="tn-green">
            <h3>TANGENT SLOPE (DERIVATIVE)</h3>
            <strong>
              f'({fmt(x0)}) = lim h→0 [f({fmt(x0)}+h)-f({fmt(x0)})]/h ={" "}
              {fmt(mt)}
            </strong>
            <p>Slope of tangent = {fmt(mt)}</p>
          </section>
          <section className="tn-red">
            <h3>NORMAL SLOPE</h3>
            <strong>
              mₙ = -1/mₜ ={" "}
              {Number.isFinite(mn) ? fmt(mn) : "undefined (vertical)"}
            </strong>
          </section>
          <section>
            <h3>AT x={fmt(x0)}</h3>
            <ul>
              <li>
                Point P({fmt(x0)}, {fmt(f(x0))})
              </li>
              <li>
                f'({fmt(x0)})={fmt(mt)}
              </li>
              <li>Tangent slope={fmt(mt)}</li>
              <li>Normal slope={Number.isFinite(mn) ? fmt(mn) : "vertical"}</li>
            </ul>
          </section>
        </aside>
      </section>
      <section className="tn-pair">
        <article>
          <h3>DERIVATION OF EQUATIONS</h3>
          <h4>Tangent (Point-Slope Form)</h4>
          <p>y-y₁=mₜ(x-x₁)</p>
          <p>{tangentEq}</p>
          <b>Tangent Equation</b>
          <h4>Normal (Point-Slope Form)</h4>
          <p>mₙ=-1/mₜ={Number.isFinite(mn) ? fmt(mn) : "vertical"}</p>
          <p>{normalEq}</p>
          <b className="red">Normal Equation</b>
        </article>
        <article>
          <h3>SECANT APPROACHING TANGENT</h3>
          <p>
            The slope of secant PQ is mPQ=(f(x₀)-f({fmt(x0)}))/(x₀-{fmt(x0)}).
          </p>
          <table>
            <thead>
              <tr>
                <th>x₀</th>
                <th>Q(x₀,f(x₀))</th>
                <th>mPQ</th>
              </tr>
            </thead>
            <tbody>
              {[1.5, 1.2, 1.1, 1.01, 1.001, 1.0001].map((v) => (
                <tr key={v}>
                  <td>{v}</td>
                  <td>
                    ({v}, {fmt(f(v))})
                  </td>
                  <td>{fmt(v + x0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <b>
            As x₀→{fmt(x0)}, mPQ→{fmt(mt)}, the tangent slope.
          </b>
        </article>
      </section>
      <section className="tn-explain">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>At x=1, f(1)=1 and f'(1)=2.</p>
          <p>Tangent: y-1=2(x-1), so y=2x-1.</p>
          <p>Normal slope=-1/2, so y-1=-1/2(x-1).</p>
          <b>Answer: tangent y=2x-1; normal y-1=-1/2(x-1).</b>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <b>The normal at a point is not the y-axis or x=x₀.</b>
          <p>
            It must be perpendicular to the tangent, so its slope is the
            negative reciprocal whenever the tangent slope is nonzero.
          </p>
        </article>
      </section>
      <section className="tn-practice">
        <article>
          <h3>PRACTICE TABLE (FOR f(x)=x²)</h3>
          <table>
            <thead>
              <tr>
                <th>x₀</th>
                <th>P</th>
                <th>f'(x₀)</th>
                <th>Tangent</th>
                <th>Normal</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, -1].map((v) => {
                const m = 2 * v;
                return (
                  <tr key={v}>
                    <td>{v}</td>
                    <td>
                      ({v},{f(v)})
                    </td>
                    <td>{m}</td>
                    <td>{m === 0 ? `y=${f(v)}` : `y-${f(v)}=${m}(x-${v})`}</td>
                    <td>
                      {m === 0 ? `x=${v}` : `y-${f(v)}=${fmt(-1 / m)}(x-${v})`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </article>
        <article>
          <h3>TRY IT YOURSELF</h3>
          <p>Choose x₀ and Q; every value updates live.</p>
          <label>
            Q x
            <input
              aria-label="Practice secant x"
              type="range"
              min="-3"
              max="3"
              step=".01"
              value={q}
              onInput={(e) => setQSafe(Number(e.currentTarget.value))}
            />
          </label>
          <output>Secant slope={fmt(ms)}</output>
          <p>As Q approaches P, the secant slope approaches {fmt(mt)}.</p>
          <button onClick={() => setQ(x0)}>Set Q to x₀</button>
        </article>
      </section>
      <section className="tn-arc">
        <h3>LESSON ARC</h3>
        <div>
          <b>Hook</b>
          <span>Observe the curve and line near the point.</span>
          <b>Worked Connection</b>
          <span>Connect derivative and negative reciprocal.</span>
          <b>Exit Check</b>
          <span>Verify with a quick example.</span>
          <b>You Can Do It!</b>
        </div>
      </section>
      <footer>
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
