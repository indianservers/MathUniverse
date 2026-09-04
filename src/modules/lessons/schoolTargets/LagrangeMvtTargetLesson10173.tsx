import { CheckCircle2, Lightbulb, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LagrangeMvtTargetLesson10173.css";

const f = (x: number) => x * x;
const fmt = (n: number) => Number(n.toFixed(3));

export default function LagrangeMvtTargetLesson10173({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [showSecant, setShowSecant] = useState(true);
  const [showTangent, setShowTangent] = useState(true);
  const [tryA, setTryA] = useState(0);
  const [tryB, setTryB] = useState(4);
  const [computed, setComputed] = useState(true);
  const [solutions, setSolutions] = useState([false, false, false]);

  const valid = a < b;
  const secantSlope = valid ? (f(b) - f(a)) / (b - a) : NaN;
  const c = valid ? secantSlope / 2 : NaN;
  const tangentSlope = 2 * c;
  const tryValid = tryA < tryB;
  const tryC = tryValid ? (tryA + tryB) / 2 : NaN;
  const curve = useMemo(
    () =>
      Array.from({ length: 101 }, (_, i) => {
        const x = (i * 4) / 100;
        return `${58 + x * 102},${330 - x * x * 18}`;
      }).join(" "),
    [],
  );
  const px = (x: number) => 58 + x * 102;
  const py = (x: number) => 330 - f(x) * 18;
  const setEndpoint = (side: "a" | "b", value: number) => {
    if (side === "a") setA(Math.max(0, Math.min(b - 0.1, value)));
    else setB(Math.min(4, Math.max(a + 0.1, value)));
  };
  const keyEndpoint =
    (side: "a" | "b") => (event: KeyboardEvent<SVGCircleElement>) => {
      const value = side === "a" ? a : b;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown")
        setEndpoint(side, value - 0.1);
      if (event.key === "ArrowRight" || event.key === "ArrowUp")
        setEndpoint(side, value + 0.1);
    };
  const dragEndpoint =
    (side: "a" | "b") => (event: ReactPointerEvent<SVGCircleElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const svg = event.currentTarget.ownerSVGElement!;
      const move = (pointer: PointerEvent) => {
        const box = svg.getBoundingClientRect();
        setEndpoint(
          side,
          ((pointer.clientX - box.left) / box.width) * 5 - 0.55,
        );
      };
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };
  const toggleSolution = (index: number) =>
    setSolutions((current) =>
      current.map((value, i) => (i === index ? !value : value)),
    );

  return (
    <main
      className="mvt10173-page"
      data-testid="school-mockup-0847"
      data-object-model="dedicated-lagrange-secant-tangent-engine"
      data-interval={`[${fmt(a)}, ${fmt(b)}]`}
      data-secant-slope={valid ? String(fmt(secantSlope)) : "undefined"}
      data-c={valid ? String(fmt(c)) : "undefined"}
      data-slopes-match={String(
        valid && Math.abs(secantSlope - tangentSlope) < 1e-8,
      )}
    >
      <header>
        <small>CLASS 12 · FORMAL CALCULUS</small>
        <h1>Lagrange Mean Value Theorem</h1>
        <p>
          For <b>f(x)=x²</b> on the interval [{fmt(a)}, {fmt(b)}], there exists
          at least one c ∈ ({fmt(a)}, {fmt(b)}) such that
          <br />
          f'(c) = (f(b) − f(a)) / (b − a).
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>graph</span>
        </div>
      </header>

      <section className="mvt-lab">
        <article>
          <h2>
            f(x)=x² on [{fmt(a)}, {fmt(b)}]
          </h2>
          <svg viewBox="0 0 520 390" aria-label="Mean value theorem graph">
            <defs>
              <pattern
                id="mvtgrid"
                width="52"
                height="44"
                patternUnits="userSpaceOnUse"
              >
                <path d="M52 0H0V44" fill="none" stroke="#dce6eb" />
              </pattern>
            </defs>
            <rect width="520" height="390" fill="url(#mvtgrid)" />
            <path d="M24 330H500M58 18V370" stroke="#263548" />
            <polyline
              points={curve}
              fill="none"
              stroke="#1768f2"
              strokeWidth="3"
            />
            {showSecant && (
              <line
                x1={px(a)}
                y1={py(a)}
                x2={px(b)}
                y2={py(b)}
                stroke="#a855d6"
                strokeWidth="2.5"
                strokeDasharray="7"
              />
            )}
            {showTangent && valid && (
              <line
                x1={px(c) - 85}
                y1={py(c) + 85 * tangentSlope * 0.176}
                x2={px(c) + 85}
                y2={py(c) - 85 * tangentSlope * 0.176}
                stroke="#159447"
                strokeWidth="3"
              />
            )}
            <circle
              role="slider"
              aria-label="Graph endpoint a"
              tabIndex={0}
              onPointerDown={dragEndpoint("a")}
              onKeyDown={keyEndpoint("a")}
              cx={px(a)}
              cy={py(a)}
              r="7"
              fill="#7c3fd2"
            />
            <circle
              role="slider"
              aria-label="Graph endpoint b"
              tabIndex={0}
              onPointerDown={dragEndpoint("b")}
              onKeyDown={keyEndpoint("b")}
              cx={px(b)}
              cy={py(b)}
              r="7"
              fill="#7c3fd2"
            />
            <circle cx={px(c)} cy={py(c)} r="6" fill="#159447" />
            <text x={px(a) - 42} y={py(a) - 12}>
              A ({fmt(a)}, {fmt(f(a))})
            </text>
            <text x={px(b) + 10} y={py(b) - 8}>
              B ({fmt(b)}, {fmt(f(b))})
            </text>
            <text x={px(c) + 12} y={py(c) + 2}>
              C ({fmt(c)}, {fmt(f(c))})
            </text>
            <text x="260" y="110" fill="#1768f2">
              y=x²
            </text>
          </svg>
          <div className="mvt-graph-controls">
            <label>
              a = {fmt(a)}
              <input
                aria-label="Interval start a"
                type="range"
                min="0"
                max={b - 0.1}
                step=".1"
                value={a}
                onInput={(e) => setEndpoint("a", Number(e.currentTarget.value))}
              />
            </label>
            <label>
              b = {fmt(b)}
              <input
                aria-label="Interval end b"
                type="range"
                min={a + 0.1}
                max="4"
                step=".1"
                value={b}
                onInput={(e) => setEndpoint("b", Number(e.currentTarget.value))}
              />
            </label>
          </div>
          <p className="mvt-drag-note">
            Drag the endpoints to change the interval.
          </p>
        </article>
        <aside>
          <h3>SLOPES</h3>
          <section>
            <h4>
              Secant slope m<sub>sec</sub>
            </h4>
            <strong>
              ({fmt(f(b))} − {fmt(f(a))}) / ({fmt(b)} − {fmt(a)}) ={" "}
              {fmt(secantSlope)}
            </strong>
            <meter min="-10" max="10" value={secantSlope} />
            <output>{fmt(secantSlope)}</output>
            <button onClick={() => setShowSecant((value) => !value)}>
              {showSecant ? "Hide" : "Show"} secant AB
            </button>
          </section>
          <section>
            <h4>Tangent slope at c = {fmt(c)}</h4>
            <strong>
              f'({fmt(c)}) = 2({fmt(c)}) = {fmt(tangentSlope)}
            </strong>
            <meter min="-10" max="10" value={tangentSlope} />
            <output>{fmt(tangentSlope)}</output>
            <button onClick={() => setShowTangent((value) => !value)}>
              {showTangent ? "Hide" : "Show"} tangent at C
            </button>
          </section>
          <div className="mvt-match">
            <ShieldCheck /> Slopes match! f'(c) = m<sub>sec</sub> ={" "}
            {fmt(secantSlope)}
          </div>
        </aside>
      </section>

      <section className="mvt-pair">
        <article>
          <h3>THEOREM CONDITIONS (CHECK)</h3>
          <p>
            <CheckCircle2 /> 1. f(x)=x² is continuous on [{fmt(a)}, {fmt(b)}].
          </p>
          <p>
            <CheckCircle2 /> 2. f(x)=x² is differentiable on ({fmt(a)}, {fmt(b)}
            ).
          </p>
          <p>
            <CheckCircle2 /> 3. Therefore LMVT guarantees c ∈ ({fmt(a)},{" "}
            {fmt(b)}) with f'(c)=({fmt(f(b))}−{fmt(f(a))})/({fmt(b)}−{fmt(a)}).
          </p>
        </article>
        <article>
          <h3>DERIVATION FOR f(x)=x²</h3>
          <p>f(x)=x²</p>
          <p>f'(x)=2x</p>
          <p>
            We need f'(c)=({fmt(f(b))}−{fmt(f(a))})/({fmt(b)}−{fmt(a)})=
            {fmt(secantSlope)}
          </p>
          <p>
            2c={fmt(secantSlope)} ⇒ c={fmt(c)}
          </p>
          <p>
            Check: c={fmt(c)} ∈ ({fmt(a)}, {fmt(b)}) ✓
          </p>
          <b>Hence, c={fmt(c)} satisfies the Lagrange Mean Value Theorem.</b>
        </article>
      </section>

      <section className="mvt-compare">
        <h3>COMPARISON WITH ROLLE'S THEOREM</h3>
        <div>
          <article>
            <h4>LAGRANGE MEAN VALUE THEOREM</h4>
            <p>
              If f is continuous on [a,b] and differentiable on (a,b), then
              ∃c∈(a,b) such that f'(c)=(f(b)−f(a))/(b−a).
            </p>
            <ul>
              <li>Works for any endpoint values.</li>
              <li>Relates derivative to average rate of change.</li>
              <li>
                In our example: f'({fmt(c)})={fmt(secantSlope)}.
              </li>
            </ul>
            <b>
              Average rate of change on [{fmt(a)}, {fmt(b)}] ={" "}
              {fmt(secantSlope)}
            </b>
          </article>
          <article>
            <h4>ROLLE'S THEOREM</h4>
            <p>Requires all LMVT conditions and f(a)=f(b), then f'(c)=0.</p>
            <ul>
              <li>Requires equal endpoint values.</li>
              <li>Guarantees a horizontal tangent.</li>
              <li>
                Here f({fmt(a)})={fmt(f(a))} and f({fmt(b)})={fmt(f(b))}.
              </li>
            </ul>
            <b className="warn">Not applicable here since f(a) ≠ f(b).</b>
          </article>
        </div>
      </section>

      <section className="mvt-lower">
        <article className="mvt-worked">
          <h3>WORKED EXAMPLE</h3>
          <p>Apply LMVT to f(x)=x² on [1,3].</p>
          <ol>
            <li>
              <b>Check conditions.</b>
              <br />f is a polynomial, hence continuous and differentiable.
            </li>
            <li>
              <b>Compute secant slope.</b>
              <br />
              m=(9−1)/(3−1)=4.
            </li>
            <li>
              <b>Find c such that f'(c)=m.</b>
              <br />
              2c=4 ⇒ c=2.
            </li>
            <li>
              <b>Verify.</b>
              <br />
              2∈(1,3) and f'(2)=4.
            </li>
          </ol>
          <b>Answer: For f(x)=x² on [1,3], a valid c is 2.</b>
        </article>
        <div>
          <article className="mvt-misconception">
            <h3>
              <Lightbulb /> COMMON MISCONCEPTION
            </h3>
            <b>“LMVT always gives c=(a+b)/2.”</b>
            <p>
              Not true in general. It happens for f(x)=x², but c depends on the
              function.
            </p>
            <p>Always solve f'(c)=(f(b)−f(a))/(b−a).</p>
          </article>
          <article className="mvt-try">
            <h3>TRY IT YOURSELF (INTERACT)</h3>
            <p>Try different intervals for f(x)=x².</p>
            <div>
              <label>
                Enter a:
                <input
                  aria-label="Try interval start"
                  type="number"
                  step=".1"
                  value={tryA}
                  onChange={(e) => {
                    setTryA(Number(e.target.value));
                    setComputed(false);
                  }}
                />
              </label>
              <label>
                Enter b:
                <input
                  aria-label="Try interval end"
                  type="number"
                  step=".1"
                  value={tryB}
                  onChange={(e) => {
                    setTryB(Number(e.target.value));
                    setComputed(false);
                  }}
                />
              </label>
              <button onClick={() => setComputed(true)}>Compute c</button>
            </div>
            {computed && (
              <output className={tryValid ? "valid" : "invalid"}>
                {tryValid
                  ? `Result: c = ${fmt(tryC)}; f'(c) = ${fmt(2 * tryC)}.`
                  : "Enter an interval with a < b."}
              </output>
            )}
          </article>
        </div>
      </section>

      <section className="mvt-practice">
        <h3>PRACTICE</h3>
        <div>
          {[
            ["For f(x)=x² on [2,5], find c guaranteed by LMVT.", "c=3.5"],
            [
              "For f(x)=x² on [a,b], express c in terms of a and b.",
              "c=(a+b)/2",
            ],
            ["For f(x)=x² on [−2,2], what is c?", "c=0"],
          ].map(([question, answer], index) => (
            <article key={question}>
              <b>{index + 1}</b>
              <p>{question}</p>
              <button onClick={() => toggleSolution(index)}>
                {solutions[index] ? "Hide" : "Show"} solution
              </button>
              {solutions[index] && <output>{answer}</output>}
            </article>
          ))}
        </div>
      </section>
      <nav className="mvt-adjacent">
        <button>← Rolle's Theorem</button>
        <button>Rate of Change →</button>
      </nav>
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
