import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  Maximize2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./IncreasingDecreasingTargetLesson297.css";

const cubic = (a: number) => (-2 * a) / 3;
const linear = (b: number) => (-8 * b) / 3;
const value = (x: number, a: number, b: number) =>
  cubic(a) * x ** 3 + linear(b) * x;
const derivative = (x: number, a: number, b: number) =>
  -2 * a * x * x - (8 * b) / 3;
const clean = (n: number, p = 3) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));
const sign = (n: number) => (n > 1e-8 ? "+" : n < -1e-8 ? "−" : "0");
const behavior = (n: number) =>
  n > 0 ? "Increasing" : n < 0 ? "Decreasing" : "Stationary";

export default function IncreasingDecreasingTargetLesson297({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(-3),
    [b, setB] = useState(1),
    [domainMin, setDomainMin] = useState(-3),
    [domainMax, setDomainMax] = useState(3),
    [tab, setTab] = useState("Interaction + visualization"),
    [actions, setActions] = useState(0),
    [checks, setChecks] = useState([true, true, true]),
    [answers, setAnswers] = useState([
      "Increasing",
      "Decreasing",
      "Increasing",
    ]),
    [result, setResult] = useState<"correct" | "incorrect" | "">("");
  const roots = useMemo(() => {
    if (Math.abs(a) < 1e-9) return [];
    const square = (-4 * b) / (3 * a);
    if (square < -1e-9) return [];
    const root = Math.sqrt(Math.max(0, square));
    return root < 1e-7 ? [0] : [-root, root];
  }, [a, b]);
  const intervals = useMemo(() => {
    const edges = [
      Number.NEGATIVE_INFINITY,
      ...roots,
      Number.POSITIVE_INFINITY,
    ];
    return edges.slice(0, -1).map((lo, i) => {
      const hi = edges[i + 1],
        sample = !Number.isFinite(lo)
          ? hi - 1
          : !Number.isFinite(hi)
            ? lo + 1
            : (lo + hi) / 2,
        d = derivative(sample, a, b);
      return { lo, hi, derivative: d, sign: sign(d), behavior: behavior(d) };
    });
  }, [a, b, roots]);
  const act = (run: () => void) => {
    run();
    setActions((n) => n + 1);
    onInteraction();
  };
  const reset = () => {
    setA(-3);
    setB(1);
    setDomainMin(-3);
    setDomainMax(3);
    setTab("Interaction + visualization");
    setActions(0);
    setChecks([true, true, true]);
    setAnswers(["Increasing", "Decreasing", "Increasing"]);
    setResult("");
  };
  useEffect(reset, [resetToken]);
  const moveRoot = (r: number) =>
    act(() => setB(Number((-0.75 * a * r * r).toFixed(3))));
  const check = () =>
    act(() =>
      setResult(
        checks.every(Boolean) &&
          answers.join("|") === "Increasing|Decreasing|Increasing"
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="inc297-page"
      data-testid="calculus-mockup-0376"
      data-dedicated-lesson="297"
      data-object-model="editable-cubic-quadratic-coefficients-analytic-critical-roots-direct-root-drag-synchronized-function-derivative-sign-interval-practice"
      data-a={a}
      data-b={b}
      data-roots={roots.map((r) => clean(r)).join(",")}
      data-behaviors={intervals.map((i) => i.behavior).join(",")}
      data-domain={`${domainMin},${domainMax}`}
      data-result={result}
      data-actions={actions}
    >
      <header className="inc297-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Increasing / Decreasing</h1>
        <p>Use derivative signs.</p>
        <div className="meta">
          <i>Advanced</i>
          <i>Calculus Lab</i>
          <i>Derivative / Limit / CAS</i>
          <i>6–10 min</i>
        </div>
        <div className="actions">
          <button>English (English)⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `f(x)=${clean(cubic(a))}x^3${linear(b) < 0 ? "" : "+"}${clean(linear(b))}x; roots=${roots.join(",")}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/workspace/calculus">↗ Workspace</a>
        </div>
      </header>
      <nav className="inc297-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((n) => (
          <button
            key={n}
            className={tab === n ? "active" : ""}
            onClick={() => act(() => setTab(n))}
          >
            {n}
          </button>
        ))}
      </nav>
      <section className="inc297-main">
        <header>
          <div>
            <small>INTERACTION • VISUALIZATION</small>
            <h2>Increasing / Decreasing – graph + CAS</h2>
          </div>
          <b>● Active</b>
          <output>{actions} actions</output>
          <button>
            <Maximize2 />
          </button>
        </header>
        <section className="inc297-flow">
          {[
            [
              Eye,
              "Observe",
              "The top graph is f(x). The bottom graph is f′(x).",
            ],
            [
              SlidersHorizontal,
              "Manipulate",
              "Change sliders or domain. Watch signs and intervals.",
            ],
            [
              Lightbulb,
              "Notice",
              "Where f′(x)>0, f increases. Where f′(x)<0, f decreases.",
            ],
            [
              Target,
              "Understand",
              "Derivative signs partition the domain into intervals.",
            ],
          ].map(([_Icon, t, p], i) => (
            <article key={String(t)}>
              <b>{i + 1}</b>
              <div>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
              {i < 3 && <ArrowRight />}
            </article>
          ))}
        </section>
        <section className="inc297-lab">
          <main>
            <FunctionDerivativeGraphs
              a={a}
              b={b}
              roots={roots}
              domainMin={domainMin}
              domainMax={domainMax}
              onRoot={moveRoot}
            />
          </main>
          <aside>
            <article className="controls">
              <h3>Shape controls for f(x) ✎</h3>
              <label>
                a
                <input
                  aria-label="Increasing coefficient a"
                  type="range"
                  min="-6"
                  max="0"
                  step=".1"
                  value={a}
                  onChange={(e) => act(() => setA(Number(e.target.value)))}
                />
                <output>{a}</output>
              </label>
              <label>
                b
                <input
                  aria-label="Increasing coefficient b"
                  type="range"
                  min="-5"
                  max="5"
                  step=".1"
                  value={b}
                  onChange={(e) => act(() => setB(Number(e.target.value)))}
                />
                <output>{b}</output>
              </label>
              <label>
                Domain
                <div>
                  <input
                    aria-label="Increasing domain minimum"
                    type="range"
                    min="-5"
                    max="0"
                    step=".1"
                    value={domainMin}
                    onChange={(e) =>
                      act(() =>
                        setDomainMin(
                          Math.min(Number(e.target.value), domainMax - 0.5),
                        ),
                      )
                    }
                  />
                  <input
                    aria-label="Increasing domain maximum"
                    type="range"
                    min="0"
                    max="5"
                    step=".1"
                    value={domainMax}
                    onChange={(e) =>
                      act(() =>
                        setDomainMax(
                          Math.max(Number(e.target.value), domainMin + 0.5),
                        ),
                      )
                    }
                  />
                </div>
                <small>
                  {domainMin} to {domainMax}
                </small>
              </label>
            </article>
            <article className="chart">
              <h3>Sign chart (from f′)</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Interval</th>
                    {intervals.map((i, k) => (
                      <td key={k}>{intervalText(i.lo, i.hi)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>f′(x)</th>
                    {intervals.map((i, k) => (
                      <td key={k}>{i.sign}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>f(x)</th>
                    {intervals.map((i, k) => (
                      <td key={k}>{i.behavior}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </article>
            <article className="derivatives">
              <h3>Key derivatives</h3>
              <p>
                › f′(x) = {clean(-2 * a)}x² {linear(b) < 0 ? "−" : "+"}{" "}
                {Math.abs(clean(linear(b)))}
              </p>
              <p>› Critical points (f′=0):</p>
              <output>x = {roots.map((r) => clean(r, 3)).join(", ")}</output>
              {roots.map((r, i) => (
                <p key={r} className="point">
                  › f({clean(r, 2)}) = {clean(value(r, a, b), 3)}{" "}
                  {i === 0 ? "" : ""}
                </p>
              ))}
            </article>
          </aside>
        </section>
        <section className="inc297-feedback">
          <CheckCircle2 />
          <p>
            <b>Great! Signs of f′ correctly classify intervals.</b>
            <br />
            {intervals
              .map((i) => `${i.behavior} on ${intervalText(i.lo, i.hi)}`)
              .join(", ")}
            .
          </p>
        </section>
        <section className="inc297-info">
          <article>
            <h3>Rule (Derivative Test)</h3>
            <p>If f′(x)&gt;0 on an interval, f is increasing there.</p>
            <p>If f′(x)&lt;0, f is decreasing there.</p>
            <p>If f′ changes from + to − at c ⇒ local maximum.</p>
            <p>If f′ changes from − to + at c ⇒ local minimum.</p>
          </article>
          <article>
            <h3>ⓘ One worked example</h3>
            <p>Find where f(x)=−3x³+x² increases or decreases.</p>
            <p>1) f′(x)=−9x²+2x=x(−9x+2)</p>
            <p>2) f′(x)=0 ⇒ x=0, 2/9</p>
            <p>3) Sign: − on (−∞,0), + on (0,2/9), − on (2/9,∞)</p>
          </article>
          <article>
            <h3>⚠ Common misconception</h3>
            <p>
              <b>Misconception:</b> f′(x)=0 ⇒ f has an extreme value at x.
            </p>
            <p>Truth: f′(x)=0 is only a candidate. Check the sign change.</p>
            <p>
              + to − ⇒ local max
              <br />− to + ⇒ local min
              <br />
              No sign change ⇒ no extremum.
            </p>
          </article>
        </section>
        <section className="inc297-practice">
          <header>
            <h3>Quick practice challenge</h3>
            <p>Given g(x)=x³−3x, classify intervals of increase/decrease.</p>
          </header>
          <main>
            {[
              ["(−∞, −1)", 0],
              ["(−1, 1)", 1],
              ["(1, ∞)", 2],
            ].map(([label, index]) => (
              <label key={String(label)}>
                <input
                  type="checkbox"
                  checked={checks[Number(index)]}
                  onChange={() => {
                    setChecks((v) =>
                      v.map((x, i) => (i === Number(index) ? !x : x)),
                    );
                    setResult("");
                  }}
                />
                <span>{label}</span>
                <select
                  aria-label={`Classification ${Number(index) + 1}`}
                  value={answers[Number(index)]}
                  onChange={(e) => {
                    setAnswers((v) =>
                      v.map((x, i) =>
                        i === Number(index) ? e.target.value : x,
                      ),
                    );
                    setResult("");
                  }}
                >
                  <option>Increasing</option>
                  <option>Decreasing</option>
                </select>
              </label>
            ))}
            <div>
              <button onClick={check}>◉ Check</button>
              <button
                onClick={() =>
                  act(() => {
                    setChecks([true, true, true]);
                    setAnswers(["Increasing", "Decreasing", "Increasing"]);
                    setResult("");
                  })
                }
              >
                <RotateCcw />
                Reset
              </button>
            </div>
          </main>
          <aside>
            <h3>Your work</h3>
            <p>
              {result === "correct"
                ? "✓ Correct! g′(x)=3x²−3=3(x−1)(x+1)"
                : "Select every interval and classify using the sign of g′."}
            </p>
            <b>Zeros at x=−1, 1.</b>
            <p>Sign of g′: + on (−∞,−1), − on (−1,1), + on (1,∞).</p>
          </aside>
        </section>
      </section>
      <nav className="inc297-adjacent">
        <a href="/lessons/calculus/296-critical-points">
          ←{" "}
          <span>
            <small>Previous</small>Critical Points
          </span>
        </a>
        <a href="/lessons/calculus/298-local-and-global-extrema">
          <span>
            <small>Next</small>Local and Global Extrema
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
const intervalText = (lo: number, hi: number) =>
  `(${Number.isFinite(lo) ? clean(lo, 2) : "−∞"}, ${Number.isFinite(hi) ? clean(hi, 2) : "∞"})`;
function FunctionDerivativeGraphs({
  a,
  b,
  roots,
  domainMin,
  domainMax,
  onRoot,
}: {
  a: number;
  b: number;
  roots: number[];
  domainMin: number;
  domainMax: number;
  onRoot: (n: number) => void;
}) {
  const w = 410,
    h = 585,
    sx = (x: number) =>
      205 +
      (x / (Math.max(Math.abs(domainMin), Math.abs(domainMax)) || 1)) * 170,
    sy = (y: number, base: number, scale: number) => base - y * scale,
    path = (fn: (x: number) => number, base: number, scale: number) =>
      Array.from({ length: 301 }, (_, i) => {
        const x = domainMin + (i / 300) * (domainMax - domainMin);
        return `${i ? "L" : "M"}${sx(x)} ${sy(fn(x), base, scale)}`;
      }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) {
        const m = Math.max(Math.abs(domainMin), Math.abs(domainMax)) || 1;
        onRoot(((((e.clientX - r.left) / r.width) * w - 205) / 170) * m);
      }
    };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="inc-grid"
          width="42"
          height="42"
          patternUnits="userSpaceOnUse"
        >
          <path d="M42 0H0V42" fill="none" stroke="#e7ecf2" />
        </pattern>
      </defs>
      <rect width={w} height="280" fill="url(#inc-grid)" />
      <rect y="300" width={w} height="280" fill="url(#inc-grid)" />
      <text x="10" y="22">
        f(x) = {clean(cubic(a))}x³ {linear(b) < 0 ? "−" : "+"}{" "}
        {Math.abs(clean(linear(b)))}x
      </text>
      <line className="axis" x1="0" x2={w} y1="140" y2="140" />
      <line className="axis" x1="205" x2="205" y1="30" y2="280" />
      <path className="curve" d={path((x) => value(x, a, b), 140, 8)} />
      {roots.map((r, i) => (
        <g key={r}>
          <line
            className="guide"
            x1={sx(r)}
            x2={sx(r)}
            y1={sy(value(r, a, b), 140, 8)}
            y2="560"
          />
          <circle
            data-drag={i === roots.length - 1 ? "increasing-root" : undefined}
            cx={sx(r)}
            cy={sy(value(r, a, b), 140, 8)}
            r="7"
            onPointerDown={i === roots.length - 1 ? drag : undefined}
            onPointerMove={i === roots.length - 1 ? drag : undefined}
          />
          <text x={sx(r) + 7} y={sy(value(r, a, b), 140, 8) - 9}>
            ({clean(r, 2)}, {clean(value(r, a, b), 2)})
          </text>
        </g>
      ))}
      <text x="10" y="324">
        f′(x) = {clean(-2 * a)}x² {linear(b) < 0 ? "−" : "+"}{" "}
        {Math.abs(clean(linear(b)))}
      </text>
      <line className="axis" x1="0" x2={w} y1="440" y2="440" />
      <line className="axis" x1="205" x2="205" y1="320" y2="575" />
      <path
        className="derivative"
        d={path((x) => derivative(x, a, b), 440, 4)}
      />
      {roots.map((r) => (
        <circle key={r} className="root" cx={sx(r)} cy="440" r="5" />
      ))}
      <g className="labels">
        {intervalLabels(a, b, roots).map((x, i) => (
          <text
            key={i}
            x={70 + i * (280 / Math.max(1, intervalsCount(roots) - 1))}
            y="410"
          >
            {x}
          </text>
        ))}
      </g>
    </svg>
  );
}
const intervalsCount = (roots: number[]) => roots.length + 1;
const intervalLabels = (a: number, b: number, roots: number[]) => {
  const edges = [-Infinity, ...roots, Infinity];
  return edges
    .slice(0, -1)
    .map((lo, i) =>
      sign(
        derivative(
          !Number.isFinite(lo)
            ? edges[i + 1] - 1
            : !Number.isFinite(edges[i + 1])
              ? lo + 1
              : (lo + edges[i + 1]) / 2,
          a,
          b,
        ),
      ),
    );
};
