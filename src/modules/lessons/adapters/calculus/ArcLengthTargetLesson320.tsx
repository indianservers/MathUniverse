import {
  CheckCircle2,
  Eye,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ArcLengthTargetLesson320.css";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const clean = (v: number) => Number(v.toFixed(8));
const f = (x: number) => 0.5 * x * x;
const primitive = (x: number) =>
  0.5 * (x * Math.sqrt(1 + x * x) + Math.asinh(x));
const exactLength = (a: number, b: number) => primitive(b) - primitive(a);
const polygonLength = (a: number, b: number, n: number) => {
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i += 1)
    sum += Math.hypot(dx, f(a + (i + 1) * dx) - f(a + i * dx));
  return sum;
};

export default function ArcLengthTargetLesson320({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(-5),
    [b, setB] = useState(5),
    [n, setN] = useState(20),
    [x, setX] = useState(1.2),
    [tab, setTab] = useState("Interactive"),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const exact = exactLength(a, b),
    approx = polygonLength(a, b, n),
    error = Math.abs(exact - approx),
    dx = (b - a) / n,
    dy = f(clamp(x + dx, a, b)) - f(x),
    ds = Math.hypot(dx, dy);
  const reset = () => {
    setA(-5);
    setB(5);
    setN(20);
    setX(1.2);
    setTab("Interactive");
    setAnswer("");
    setResult("");
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const setBounds = (nextA: number, nextB: number) => {
    const low = Math.min(nextA, nextB - 0.5),
      high = Math.max(nextB, low + 0.5);
    setA(clamp(low, -6, 4));
    setB(clamp(high, -4, 6));
    setX((v) => clamp(v, low, high));
  };
  return (
    <section
      className="arc320-page"
      data-testid="calculus-mockup-0399"
      data-object-model="parabola-domain-polyline-segments-draggable-ds-triangle-exact-arc-integral-error-practice"
      data-a={clean(a)}
      data-b={clean(b)}
      data-n={n}
      data-x={clean(x)}
      data-dx={clean(dx)}
      data-dy={clean(dy)}
      data-ds={clean(ds)}
      data-approx={clean(approx)}
      data-exact={clean(exact)}
      data-error={clean(error)}
      data-tab={tab}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="arc320-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Arc Length</h1>
        <p>Measure curved paths.</p>
        <div className="meta">
          <i>♙ Advanced</i>
          <i>ϟ Advanced Lab</i>
          <i>▣ Integral / ODE / CAS</i>
          <i>◷ 6-10 min</i>
        </div>
        <div className="actions">
          <select aria-label="Lesson language">
            <option>English (English)</option>
          </select>
          <button
            onClick={() => {
              reset();
              onInteraction();
            }}
          >
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <nav className="arc320-tabs">
        {[
          "Interactive",
          "Explain",
          "Examples",
          "Formulas",
          "Misconceptions",
          "Practice",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="arc320-lab">
        <header>
          <div>
            <b>ARC LENGTH INTERACTIVE</b>
            <h2>Approximate the arc length by adjustable segments</h2>
          </div>
          <span>
            Convergence <b>{error < 0.1 ? "Good" : "Refine"}</b>
            <i>{n} segments</i>
          </span>
        </header>
        <div className="arc320-work">
          <div className="arc320-plot">
            <ArcGraph a={a} b={b} n={n} x={x} onX={(v) => act(() => setX(v))} />
            <div className="domain">
              Domain{" "}
              <b>
                [{a.toFixed(0)}, {b.toFixed(0)}]
              </b>
            </div>
            <div className="arc320-results">
              <article>
                Approx. arc length L<sub>N</sub>
                <strong>{approx.toFixed(4)}</strong>
                <b>units</b>
              </article>
              <article>
                Exact arc length L<strong>{exact.toFixed(4)}</strong>
                <b>units</b>
              </article>
              <article>
                Absolute error |L−L<sub>N</sub>|
                <strong>{error.toFixed(4)}</strong>
                <b>units</b>
              </article>
            </div>
            <p className="success">
              <CheckCircle2 />{" "}
              <b>{error < 0.1 ? "Excellent!" : "Keep refining."}</b> Your
              approximation{" "}
              {error < 0.1 ? "is very close to" : "is approaching"} the exact
              arc length.
            </p>
          </div>
          <aside>
            <article>
              <b>Function</b>
              <strong>f(x) = 1/2 x²</strong>
            </article>
            <article>
              <b>Domain [a, b]</b>
              <label>
                a ={" "}
                <input
                  aria-label="Arc lower bound"
                  type="number"
                  value={a}
                  step=".5"
                  onChange={(e) =>
                    act(() => setBounds(Number(e.target.value), b))
                  }
                />
              </label>
              <label>
                b ={" "}
                <input
                  aria-label="Arc upper bound"
                  type="number"
                  value={b}
                  step=".5"
                  onChange={(e) =>
                    act(() => setBounds(a, Number(e.target.value)))
                  }
                />
              </label>
            </article>
            <article>
              <b>Segments (N)</b>
              <output>{n}</output>
              <input
                aria-label="Arc segments"
                type="range"
                min="5"
                max="200"
                step="5"
                value={n}
                onChange={(e) => act(() => setN(Number(e.target.value)))}
              />
            </article>
            <article className="triangle">
              <b>ds triangle at x</b>
              <label>
                x = <output>{x.toFixed(3)}</output>
                <input
                  aria-label="Arc triangle position"
                  type="range"
                  min={a}
                  max={b - dx}
                  step=".01"
                  value={clamp(x, a, b - dx)}
                  onChange={(e) => act(() => setX(Number(e.target.value)))}
                />
              </label>
              <p>
                dx = <strong>{dx.toFixed(4)}</strong>
              </p>
              <p>
                dy = <strong>{dy.toFixed(4)}</strong>
              </p>
              <p>ds = √(dx² + dy²)</p>
              <p>
                = <strong>{ds.toFixed(4)}</strong>
              </p>
            </article>
            <article className="what">
              <b>What's happening?</b>
              <p>
                We approximate the curve with straight segments. As N increases,
                the approximation converges to the true arc length.
              </p>
            </article>
          </aside>
        </div>
        <div className="arc320-flow">
          {[
            [
              Eye,
              "1 Observe",
              "The curve y=x²/2 on [a,b] is approximated by N straight segments.",
            ],
            [
              Target,
              "2 Manipulate",
              "Drag the Segments slider, move x, and change the domain.",
            ],
            [
              Lightbulb,
              "3 Notice",
              "As N increases, Lₙ approaches a stable value.",
            ],
            [
              CheckCircle2,
              "4 Understand",
              "Arc length is the limit of the sum of tiny segment lengths.",
            ],
          ].map(([Icon, t, p], index) => (
            <article key={String(t)}>
              <h3>
                <Icon />
                {String(t)}
              </h3>
              <p>{String(p)}</p>
              <FlowVisual index={index} />
            </article>
          ))}
        </div>
      </section>
      <section className="arc320-cards">
        <article>
          <h3>Arc Length - Formula & Rule</h3>
          <p>For a curve y=f(x) on [a,b],</p>
          <strong>L=∫ₐᵇ √(1+(dy/dx)²) dx</strong>
          <p>where dy/dx=f′(x).</p>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>
            Find the arc length of y=x²/2 on [{a},{b}].
          </p>
          <b>y′=x</b>
          <strong>
            L=∫{a}^{b} √(1+x²) dx
          </strong>
          <p>= {exact.toFixed(4)} units (matches interactive).</p>
        </article>
        <article className="mistake">
          <h3>⚠ Common Misconception</h3>
          <p>Using ∫y(x)dx finds signed area, not arc length.</p>
          <b>Correct approach:</b>
          <p>Arc length uses √(1+(y′)²), not y itself.</p>
          <MiniCompare />
        </article>
      </section>
      <section className="arc320-practice">
        <div>
          <h3>Quick Practice</h3>
          <p>
            Find the arc length of y=x²/2 on [0,3]. Enter your answer (4
            decimals).
          </p>
        </div>
        <label>
          Your answer
          <input
            aria-label="Arc practice answer"
            value={answer}
            placeholder="e.g., 5.6526"
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult("");
            }}
          />
        </label>
        <span>units</span>
        <button
          onClick={() =>
            act(() =>
              setResult(
                Math.abs(Number(answer) - exactLength(0, 3)) < 0.0001
                  ? "correct"
                  : "incorrect",
              ),
            )
          }
        >
          Check
        </button>
        <button onClick={() => act(() => setHint((v) => !v))}>
          ♧ {hint ? "Hide" : "Show"} hint
        </button>
        <output className={result}>
          {result === "correct"
            ? "Correct."
            : result === "incorrect"
              ? `Use y'=x; the value is ${exactLength(0, 3).toFixed(4)}.`
              : hint
                ? "Integrate sqrt(1+x^2) from 0 to 3."
                : ""}
        </output>
      </section>
    </section>
  );
}

function ArcGraph({
  a,
  b,
  n,
  x,
  onX,
}: {
  a: number;
  b: number;
  n: number;
  x: number;
  onX: (v: number) => void;
}) {
  const w = 560,
    h = 330,
    p = 42,
    sx = (v: number) => p + ((v + 6) / 12) * (w - 2 * p),
    sy = (v: number) => h - p - (v / 14) * (h - 2 * p);
  const samples = useMemo(
    () => Array.from({ length: n + 1 }, (_, i) => a + (i / n) * (b - a)),
    [a, b, n],
  );
  const curve = Array.from({ length: 121 }, (_, i) => {
    const v = -6 + i / 10;
    return `${i ? "L" : "M"}${sx(v)},${sy(f(v))}`;
  }).join(" ");
  const poly = samples
      .map((v, i) => `${i ? "L" : "M"}${sx(v)},${sy(f(v))}`)
      .join(" "),
    next = clamp(x + (b - a) / n, a, b);
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (q: PointerEvent) =>
      onX(
        clamp(
          ((q.clientX - box.left) / box.width) * 12 - 6,
          a,
          b - (b - a) / n,
        ),
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg className="arc320-graph" viewBox={`0 0 ${w} ${h}`}>
      {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((v) => (
        <g className="grid" key={v}>
          <line x1={sx(v)} x2={sx(v)} y1={p} y2={h - p} />
          <text x={sx(v)} y={h - p + 17}>
            {v}
          </text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10, 12].map((v) => (
        <g className="grid" key={v}>
          <line x1={p} x2={w - p} y1={sy(v)} y2={sy(v)} />
          <text x={p - 10} y={sy(v) + 3}>
            {v}
          </text>
        </g>
      ))}
      <line className="axis" x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
      <path className="curve" d={curve} />
      <path className="poly" d={poly} />
      {samples.map((v) => (
        <circle className="sample" key={v} cx={sx(v)} cy={sy(f(v))} r="2.5" />
      ))}
      <path
        className="tri"
        d={`M${sx(x)},${sy(f(x))}H${sx(next)}V${sy(f(next))}`}
      />
      <text className="tri-label" x={(sx(x) + sx(next)) / 2} y={sy(f(x)) + 15}>
        dx
      </text>
      <text
        className="tri-label"
        x={sx(next) + 5}
        y={(sy(f(x)) + sy(f(next))) / 2}
      >
        dy
      </text>
      <circle
        data-drag="arc-triangle"
        className="drag"
        cx={sx(x)}
        cy={sy(f(x))}
        r="7"
        onPointerDown={drag}
      />
      <text className="formula" x="18" y="28">
        y = 1/2 x²
      </text>
    </svg>
  );
}
function MiniCompare() {
  return (
    <svg viewBox="0 0 250 75">
      <path className="area" d="M8 62L32 53L55 40L80 18V62Z" />
      <path d="M8 62L32 53L55 40L80 18" />
      <path d="M145 62L168 53L192 40L218 18" />
      <line x1="125" x2="125" y1="8" y2="70" />
      <text x="20" y="73">
        Area (wrong)
      </text>
      <text x="160" y="73">
        Arc length (right)
      </text>
    </svg>
  );
}

function FlowVisual({ index }: { index: number }) {
  if (index === 3)
    return (
      <strong className="arc320-flow-formula">
        L = lim<sub>N→∞</sub> Σ dsᵢ
      </strong>
    );
  return (
    <svg className={`arc320-mini mini-${index}`} viewBox="0 0 150 58">
      {index === 0 && (
        <>
          <path d="M10 9L28 31L49 45L74 50L100 44L123 29L140 8" />
          {[10, 28, 49, 74, 100, 123, 140].map((cx, i) => (
            <circle key={cx} cx={cx} cy={[9, 31, 45, 50, 44, 29, 8][i]} r="2" />
          ))}
        </>
      )}
      {index === 1 && (
        <>
          <line x1="8" x2="65" y1="16" y2="16" />
          <circle cx="30" cy="16" r="4" />
          <path d="M80 48H137V8Z" />
          <text x="103" y="56">
            dx
          </text>
          <text x="139" y="30">
            dy
          </text>
          <text x="104" y="21">
            ds
          </text>
        </>
      )}
      {index === 2 && (
        <>
          <path d="M4 8Q18 58 34 8M56 8Q73 58 90 8M108 8Q126 58 145 8" />
          <text x="8" y="57">
            N=10
          </text>
          <text x="57" y="57">
            N=50
          </text>
          <text x="109" y="57">
            N=200
          </text>
        </>
      )}
    </svg>
  );
}
