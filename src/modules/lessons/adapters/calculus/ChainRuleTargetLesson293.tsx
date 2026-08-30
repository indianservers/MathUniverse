import {
  AlertTriangle,
  ArrowRight,
  Check,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ChainRuleTargetLesson293.css";
const fmt = (n: number, p = 4) =>
    Math.abs(n) < 1e-10 ? 0 : Number(n.toFixed(p)),
  inner = (x: number) => Math.sin(x),
  innerRate = (x: number) => Math.cos(x),
  outer = (u: number) => u * u,
  outerRate = (u: number) => 2 * u,
  total = (x: number) => outerRate(inner(x)) * innerRate(x),
  output = (x: number) => outer(inner(x));
export default function ChainRuleTargetLesson293({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0.05),
    [tab, setTab] = useState("Interaction + visualization"),
    [answer, setAnswer] = useState("24x(3x^2+1)^3"),
    [hint, setHint] = useState(true),
    [steps, setSteps] = useState(false),
    [result, setResult] = useState<"correct" | "incorrect" | "">("correct"),
    [actions, setActions] = useState(0);
  const u = inner(x),
    y = output(x),
    gi = innerRate(x),
    fo = outerRate(u),
    rate = total(x);
  const reset = () => {
    setX(0.05);
    setTab("Interaction + visualization");
    setAnswer("24x(3x^2+1)^3");
    setHint(true);
    setSteps(false);
    setResult("correct");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((a) => a + 1);
    onInteraction();
  };
  const changeX = (n: number) =>
    act(() => setX(Math.max(-4, Math.min(4, Number(n.toFixed(2))))));
  const changeOutput = (n: number) => {
    const principal = Math.asin(Math.sqrt(Math.max(0, Math.min(1, n)))),
      sign = x < 0 ? -1 : 1;
    changeX(sign * principal);
  };
  const check = () => {
    const n = answer
      .toLowerCase()
      .replace(/\s|\*/g, "")
      .replace(/²/g, "^2")
      .replace(/³/g, "^3");
    act(() =>
      setResult(
        ["24x(3x^2+1)^3", "(24x)(3x^2+1)^3"].includes(n)
          ? "correct"
          : "incorrect",
      ),
    );
  };
  return (
    <section
      className="chr293-page"
      data-testid="calculus-mockup-0372"
      data-dedicated-lesson="293"
      data-object-model="input-sine-inner-square-outer-composition-linked-rates-invertible-output-drag-tangent-practice"
      data-x={x}
      data-inner={fmt(u)}
      data-output={fmt(y)}
      data-inner-rate={fmt(gi)}
      data-outer-rate={fmt(fo)}
      data-total-rate={fmt(rate)}
      data-result={result}
      data-hint={hint}
      data-steps={steps}
      data-actions={actions}
    >
      <header className="chr293-hero">
        <main>
          <span>
            <b>CALCULUS</b>
            <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
          </span>
          <h1>Chain Rule</h1>
          <p>Differentiate compositions.</p>
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
                    `x=${x}, y=sin²x=${fmt(y)}, dy/dx=${fmt(rate)}`,
                  ),
                )
              }
            >
              <Share2 />
              Share
            </button>
            <a href="/workspace/calculus">▣ Workspace</a>
          </div>
        </main>
        <aside>
          <h3>The Chain Rule</h3>
          <p>For a composition y=f(g(x)):</p>
          <output>
            dy/dx = <b>f′(g(x))</b> · <i>g′(x)</i>
          </output>
          <div>
            <span>
              outer rate
              <br />
              at inner
            </span>
            <span>inner rate</span>
          </div>
        </aside>
      </header>
      <nav className="chr293-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Common pitfalls",
          "Practice",
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
      <section className="chr293-flow">
        {[
          ["1", "OBSERVE", "See how x changes g(x) and then f(g(x))."],
          [
            "2",
            "MANIPULATE",
            "Adjust x to change the rates and watch the link.",
          ],
          ["3", "NOTICE", "The total rate equals outer rate × inner rate."],
          [
            "4",
            "UNDERSTAND",
            "This is the Chain Rule. Try the example and practice!",
          ],
        ].map(([n, t, p], i) => (
          <article key={n}>
            <b>{n}</b>
            <div>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
            {i < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="chr293-model">
        <h3>VISUAL MODEL</h3>
        <div className="pipeline">
          <article>
            <h4>Input</h4>
            <b>x</b>
            <output>{x.toFixed(2)}</output>
            <input
              aria-label="Chain input x"
              type="range"
              min="-4"
              max="4"
              step=".01"
              value={x}
              onChange={(e) => changeX(Number(e.target.value))}
            />
            <small>
              <span>−4</span>
              <span>4</span>
            </small>
          </article>
          <div className="rate">
            <b>g′(x)=cos x</b>
            <output>{gi.toFixed(4)}</output>
            <small>inner rate</small>
            <ArrowRight />
          </div>
          <article className="inner">
            <h4>Inner function</h4>
            <b>g(x)=sin x</b>
            <output>g(x) &nbsp; {u.toFixed(4)}</output>
            <MiniFunction kind="sin" value={x} />
          </article>
          <div className="rate outer-rate">
            <b>f′(u)=2u</b>
            <output>{fo.toFixed(4)}</output>
            <small>
              outer rate
              <br />
              at u=g(x)
            </small>
            <ArrowRight />
          </div>
          <article className="outer">
            <h4>Outer function</h4>
            <b>f(u)=u²</b>
            <output>f(g(x)) &nbsp; {y.toFixed(4)}</output>
            <MiniFunction kind="square" value={u} />
          </article>
          <ArrowRight />
          <article>
            <h4>Output</h4>
            <b>
              y=f(g(x))
              <br />
              =sin²x
            </b>
            <output>y &nbsp; {y.toFixed(4)}</output>
            <input
              aria-label="Chain output y"
              type="range"
              min="0"
              max="1"
              step=".0001"
              value={y}
              onChange={(e) => changeOutput(Number(e.target.value))}
            />
          </article>
        </div>
        <footer>
          <span>Domain: x∈[−4,4]</span>
          <span>Range: g(x)∈[−1,1]</span>
          <span>Range: f(g(x))∈[0,1]</span>
          <span>Range: y∈[0,1]</span>
        </footer>
      </section>
      <section className="chr293-graph">
        <main>
          <h3>Graph of y=sin²x</h3>
          <CompositionGraph x={x} onX={changeX} />
        </main>
        <aside>
          <h3>Rates at x={x.toFixed(2)}</h3>
          <div>
            <article>
              <h4>Inner rate</h4>
              <b>g′(x)=cos x</b>
              <output>{gi.toFixed(4)}</output>
              <MiniRate kind="cos" x={x} />
            </article>
            <article>
              <h4>Outer rate</h4>
              <b>f′(g(x))=2g(x)</b>
              <output>{fo.toFixed(4)}</output>
              <MiniRate kind="line" x={u} />
            </article>
            <article>
              <h4>Product (chain rule)</h4>
              <b>f′(g(x))·g′(x)</b>
              <output>{rate.toFixed(4)}</output>
            </article>
          </div>
          <footer>
            Total rate &nbsp; dy/dx at x={x.toFixed(2)} = {rate.toFixed(4)}
            <small>(Matches the slope of the graph at the orange point.)</small>
          </footer>
        </aside>
      </section>
      <section className="chr293-work">
        <article>
          <h3>▣ WORKED EXAMPLE</h3>
          <p>Differentiate y=sin²x using the Chain Rule.</p>
          <main>
            {[
              ["1", "Identify the composition", "Let u=sin x. Then y=f(u)=u²."],
              ["2", "Differentiate the outer function", "f(u)=u² ⇒ f′(u)=2u"],
              [
                "3",
                "Differentiate the inner function",
                "g(x)=sin x ⇒ g′(x)=cos x",
              ],
              [
                "4",
                "Apply the Chain Rule",
                "dy/dx=f′(g(x))·g′(x)=2(sin x)(cos x)=sin 2x",
              ],
            ].map(([n, t, p]) => (
              <p key={n}>
                <i>{n}</i>
                <b>{t}</b>
                <span>{p}</span>
              </p>
            ))}
          </main>
          <aside>
            <h4>Check at x={x.toFixed(2)}</h4>
            <output>
              dy/dx = sin({(2 * x).toFixed(2)}) = {Math.sin(2 * x).toFixed(5)}
            </output>
            <p>
              Model gives {rate.toFixed(4)} <Check />
            </p>
            <strong>
              Final answer:
              <br />
              dy/dx=sin 2x
            </strong>
          </aside>
        </article>
        <article className="pitfall">
          <h3>
            <AlertTriangle /> COMMON PITFALL
          </h3>
          <b>Do not multiply first, then differentiate.</b>
          <section>
            <h4>Incorrect approach</h4>
            <p>
              y=(sin x)²
              <br />
              dy/dx ≠ 2 sin x &nbsp; (missing cos x)
            </p>
          </section>
          <section>
            <h4>Why it’s wrong</h4>
            <p>
              This treats sin x like a single variable. You must account for how
              sin x changes as x changes.
            </p>
            <p>
              <b>Use the Chain Rule to link the rates.</b>
            </p>
          </section>
        </article>
      </section>
      <section className="chr293-practice">
        <main>
          <h3>TRY IT YOURSELF</h3>
          <p>Differentiate using the Chain Rule.</p>
          <output>y=(3x²+1)⁴</output>
        </main>
        <label>
          Your derivative &nbsp; dy/dx ={" "}
          <input
            aria-label="Chain rule practice answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult("");
            }}
          />
          <button onClick={check}>Check</button>
          <b className={result}>
            {result === "correct" ? (
              <>
                <Check /> Correct!<small>dy/dx=24x(3x²+1)³</small>
              </>
            ) : result === "incorrect" ? (
              "Include both outer and inner derivatives."
            ) : (
              ""
            )}
          </b>
          <button
            className="steps"
            onClick={() => act(() => setSteps((v) => !v))}
          >
            Steps⌄
          </button>
        </label>
        <aside>
          <button onClick={() => act(() => setHint((v) => !v))}>♧ Hint⌄</button>
          {hint && (
            <div>
              <p>Need help?</p>
              <p>
                • Outer: f(u)=u⁴ ⇒ f′(u)=4u³
                <br />• Inner: g(x)=3x²+1 ⇒ g′(x)=6x
                <br />• Multiply: 4(3x²+1)³·6x
              </p>
            </div>
          )}
          {steps && <footer>4(3x²+1)³ × 6x = 24x(3x²+1)³</footer>}
        </aside>
      </section>
      <nav className="chr293-adjacent">
        <a href="/lessons/calculus/292-quotient-rule">
          <ArrowRight />
          <span>
            <small>Previous</small>Quotient Rule
          </span>
        </a>
        <a href="/lessons/calculus/294-implicit-differentiation">
          <span>
            <small>Next</small>Implicit Differentiation
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function MiniFunction({
  kind,
  value,
}: {
  kind: "sin" | "square";
  value: number;
}) {
  const w = 110,
    h = 55,
    sx = (n: number) => 55 + n * 42,
    sy = (n: number) => 28 - n * 21,
    path = Array.from({ length: 81 }, (_, i) => {
      const n = -1.3 + i * 0.0325,
        v = kind === "sin" ? Math.sin(n * Math.PI) : n * n;
      return `${i ? "L" : "M"}${sx(n)} ${sy(v)}`;
    }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} stroke="#64748b" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} stroke="#64748b" />
      <path
        d={path}
        fill="none"
        stroke={kind === "sin" ? "#087fdc" : "#7835dd"}
        strokeWidth="2"
      />
      <circle
        cx={sx(kind === "sin" ? value / Math.PI : value)}
        cy={sy(kind === "sin" ? Math.sin(value) : value * value)}
        r="3"
        fill="#ff7a00"
      />
    </svg>
  );
}
function CompositionGraph({ x, onX }: { x: number; onX: (n: number) => void }) {
  const w = 500,
    h = 250,
    sx = (n: number) => 250 + n * 37,
    sy = (n: number) => 215 - n * 150,
    path = Array.from({ length: 251 }, (_, i) => {
      const n = -2 * Math.PI + i * ((4 * Math.PI) / 250);
      return `${i ? "L" : "M"}${sx(n)} ${sy(output(n))}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 250) / 37);
    };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="chr-grid"
          width="37"
          height="37.5"
          patternUnits="userSpaceOnUse"
        >
          <path d="M37 0H0V37.5" fill="none" stroke="#e8edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#chr-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      <path className="curve" d={path} />
      <line
        className="tangent"
        x1={sx(x - 0.7)}
        y1={sy(output(x) - 0.7 * total(x))}
        x2={sx(x + 0.7)}
        y2={sy(output(x) + 0.7 * total(x))}
      />
      <circle
        data-drag="chain-point"
        cx={sx(x)}
        cy={sy(output(x))}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={sx(x) + 9} y={sy(output(x)) - 10}>
        ({x.toFixed(2)}, {output(x).toFixed(4)})
      </text>
    </svg>
  );
}
function MiniRate({ kind, x }: { kind: "cos" | "line"; x: number }) {
  const w = 100,
    h = 60,
    sx = (n: number) => 50 + n * 30,
    sy = (n: number) => 30 - n * 20,
    path = Array.from({ length: 81 }, (_, i) => {
      const n = -1.6 + i * 0.04,
        v = kind === "cos" ? Math.cos(n * Math.PI) : 2 * n;
      return `${i ? "L" : "M"}${sx(n)} ${sy(v)}`;
    }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} stroke="#64748b" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} stroke="#64748b" />
      <path
        d={path}
        fill="none"
        stroke={kind === "cos" ? "#087fdc" : "#7835dd"}
        strokeWidth="2"
      />
      <circle
        cx={sx(kind === "cos" ? x / Math.PI : x)}
        cy={sy(kind === "cos" ? Math.cos(x) : 2 * x)}
        r="3"
        fill="#ff7a00"
      />
    </svg>
  );
}
