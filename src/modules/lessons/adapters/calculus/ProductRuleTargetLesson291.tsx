import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  Lightbulb,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ProductRuleTargetLesson291.css";
type Expression = {
  key: string;
  label: string;
  derivative: string;
  fn: (x: number) => number;
  df: (x: number) => number;
};
const expressions: Expression[] = [
  {
    key: "sin(x)",
    label: "sin(x)",
    derivative: "cos(x)",
    fn: Math.sin,
    df: Math.cos,
  },
  {
    key: "x^2-2",
    label: "x² − 2",
    derivative: "2x",
    fn: (x) => x * x - 2,
    df: (x) => 2 * x,
  },
  { key: "x", label: "x", derivative: "1", fn: (x) => x, df: () => 1 },
  { key: "exp(x)", label: "eˣ", derivative: "eˣ", fn: Math.exp, df: Math.exp },
  {
    key: "cos(x)",
    label: "cos(x)",
    derivative: "−sin(x)",
    fn: Math.cos,
    df: (x) => -Math.sin(x),
  },
  {
    key: "x^2+1",
    label: "x² + 1",
    derivative: "2x",
    fn: (x) => x * x + 1,
    df: (x) => 2 * x,
  },
];
const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/²/g, "^2")
      .replace(/e\^x/g, "exp(x)"),
  resolve = (s: string) =>
    expressions.find((e) => normalize(e.key) === normalize(s)) ?? null,
  fmt = (n: number, p = 4) => Number(n.toFixed(p));
export default function ProductRuleTargetLesson291({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [uText, setUText] = useState("sin(x)"),
    [vText, setVText] = useState("x^2 - 2"),
    [x, setX] = useState(1.2),
    [domain, setDomain] = useState(6),
    [step, setStep] = useState(0.05),
    [axes, setAxes] = useState(true),
    [grid, setGrid] = useState(true),
    [legend, setLegend] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [practice, setPractice] = useState("exp(x)*(x+1)"),
    [result, setResult] = useState<"correct" | "incorrect" | "">("correct"),
    [actions, setActions] = useState(0);
  const u = resolve(uText) ?? expressions[0],
    v = resolve(vText) ?? expressions[1],
    uValid = Boolean(resolve(uText)),
    vValid = Boolean(resolve(vText)),
    uv = (n: number) => u.fn(n) * v.fn(n),
    rule = (n: number) => u.df(n) * v.fn(n) + u.fn(n) * v.df(n),
    model = (uv(x + step) - uv(x - step)) / (2 * step),
    values = {
      u: u.fn(x),
      v: v.fn(x),
      uv: uv(x),
      model,
      rule: rule(x),
      error: Math.abs(model - rule(x)),
    };
  const reset = () => {
    setUText("sin(x)");
    setVText("x^2 - 2");
    setX(1.2);
    setDomain(6);
    setStep(0.05);
    setAxes(true);
    setGrid(true);
    setLegend(true);
    setTab("Interaction + visualization");
    setPractice("exp(x)*(x+1)");
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
    act(() => setX(Math.max(-domain, Math.min(domain, Number(n.toFixed(2))))));
  const check = () => {
    const n = normalize(practice).replace(/\*/g, "");
    act(() =>
      setResult(
        [
          "exp(x)(x+1)",
          "(x+1)exp(x)",
          "exp(x)+xexp(x)",
          "xexp(x)+exp(x)",
        ].includes(n)
          ? "correct"
          : "incorrect",
      ),
    );
  };
  return (
    <section
      className="prd291-page"
      data-testid="calculus-mockup-0370"
      data-dedicated-lesson="291"
      data-object-model="editable-factor-pair-independent-product-derivative-product-rule-decomposition-domain-step-display-practice"
      data-u={u.key}
      data-v={v.key}
      data-x={x}
      data-step={step}
      data-domain={domain}
      data-u-value={fmt(values.u)}
      data-v-value={fmt(values.v)}
      data-product={fmt(values.uv)}
      data-model={fmt(values.model)}
      data-rule={fmt(values.rule)}
      data-error={fmt(values.error)}
      data-result={result}
      data-actions={actions}
    >
      <header className="prd291-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Product Rule</h1>
        <p>Differentiate products.</p>
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
                  `u=${u.key}, v=${v.key}, (uv)'=${fmt(values.rule)}`,
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
      <nav className="prd291-tabs">
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
      <section className="prd291-flow">
        {[
          [Eye, "Observe", "See the product uv and its derivative."],
          [SlidersHorizontal, "Manipulate", "Edit u(x) and v(x) to explore."],
          [
            Lightbulb,
            "Notice",
            "The product curve changes because both functions and their rates change.",
          ],
          [
            Target,
            "Understand",
            "The derivative equals the sum of two product terms.",
          ],
        ].map(([Icon, t, p], i) => (
          <article key={String(t)}>
            <b>{i + 1}</b>
            <div>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
            <Icon />
          </article>
        ))}
      </section>
      <section className="prd291-lab">
        <aside>
          <h3>Enter functions</h3>
          <article className={uValid ? "valid" : "invalid"}>
            <b>u(x)</b>
            <label>
              <input
                aria-label="Factor u"
                list="product-rule-expressions"
                value={uText}
                onChange={(e) =>
                  act(() => {
                    setUText(e.target.value);
                    setResult("");
                  })
                }
              />
              <button onClick={() => act(() => setUText("x"))}>×</button>
            </label>
            <p>u′(x) = {uValid ? u.derivative : "unsupported expression"}</p>
          </article>
          <article className={vValid ? "valid" : "invalid"}>
            <b>v(x)</b>
            <label>
              <input
                aria-label="Factor v"
                list="product-rule-expressions"
                value={vText}
                onChange={(e) =>
                  act(() => {
                    setVText(e.target.value);
                    setResult("");
                  })
                }
              />
              <button onClick={() => act(() => setVText("x"))}>×</button>
            </label>
            <p>v′(x) = {vValid ? v.derivative : "unsupported expression"}</p>
          </article>
          <datalist id="product-rule-expressions">
            {expressions.map((e) => (
              <option key={e.key} value={e.key} />
            ))}
          </datalist>
          <h3>Domain (x)</h3>
          <label className="domain">
            <input
              aria-label="Product domain minimum"
              type="number"
              value={-domain}
              onChange={(e) =>
                act(() =>
                  setDomain(Math.max(2, Math.abs(Number(e.target.value)))),
                )
              }
            />{" "}
            to{" "}
            <input
              aria-label="Product domain maximum"
              type="number"
              value={domain}
              onChange={(e) =>
                act(() =>
                  setDomain(Math.max(2, Math.abs(Number(e.target.value)))),
                )
              }
            />
          </label>
          <label className="step">
            Step: {step.toFixed(2)}{" "}
            <input
              aria-label="Product derivative step"
              type="range"
              min=".01"
              max=".2"
              step=".01"
              value={step}
              onChange={(e) => act(() => setStep(Number(e.target.value)))}
            />
          </label>
          <h3>Display options</h3>
          {[
            ["Show axes", axes, setAxes],
            ["Show grid", grid, setGrid],
            ["Show legend", legend, setLegend],
          ].map(([label, value, setter]) => (
            <label className="toggle" key={String(label)}>
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={() => act(() => setter((old: boolean) => !old))}
              />
              {label}
            </label>
          ))}
        </aside>
        <main>
          <h3>Product and derivative</h3>
          <ProductGraph
            u={u}
            v={v}
            x={x}
            domain={domain}
            step={step}
            axes={axes}
            grid={grid}
            legend={legend}
            onX={changeX}
          />
          <p className="domain-note">
            x ∈ [−{domain}, {domain}]
          </p>
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>u(x)</th>
                <th>v(x)</th>
                <th>uv</th>
                <th>(uv)′ (model)</th>
                <th>(uv)′ (rule)</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{x.toFixed(2)}</td>
                <td>{values.u.toFixed(4)}</td>
                <td>{values.v.toFixed(4)}</td>
                <td>{values.uv.toFixed(4)}</td>
                <td>{values.model.toFixed(4)}</td>
                <td>{values.rule.toFixed(4)}</td>
                <td>{values.error.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
          <footer>
            <Check /> Correct! The sampled derivative approaches (uv)′=u′v+uv′
            as step shrinks.
          </footer>
        </main>
        <aside className="decomposition">
          <h3>Derivative decomposition</h3>
          <output>(uv)′ = u′v + uv′</output>
          {[
            ["u′(x)", u.df, "#087df0"],
            ["v(x)", v.fn, "#b62edb"],
            ["u(x)", u.fn, "#087df0"],
            ["v′(x)", v.df, "#b62edb"],
            ["(uv)′", rule, "#ff6500"],
          ].map(([label, fn, color], i) => (
            <MiniGraph
              key={String(label)}
              label={String(label)}
              fn={fn as (x: number) => number}
              color={String(color)}
              operator={["×", "+", "×", "=", ""][i]}
              domain={domain}
            />
          ))}
        </aside>
      </section>
      <section className="prd291-learn">
        <article>
          <h3>The Product Rule</h3>
          <p>If u and v are differentiable, then:</p>
          <output>(uv)′ = u′v + uv′</output>
          <p>
            Where:
            <br />
            u′ = derivative of u<br />
            v′ = derivative of v
          </p>
          <footer>
            ⓘ This rule follows from the limit definition or algebraic expansion
            of a change in uv.
          </footer>
        </article>
        <article>
          <h3>Worked example</h3>
          <p>Find the derivative of y=(2x+1)(x²−3x).</p>
          <p>Let u=2x+1, u′=2; v=x²−3x, v′=2x−3.</p>
          <p>
            y′=u′v+uv′
            <br />
            =2(x²−3x)+(2x+1)(2x−3)
            <br />
            =6x²−7x−3
          </p>
          <b>
            <Check /> Answer: y′=6x²−7x−3
          </b>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common misconception
          </h3>
          <p>Forgetting one of the two terms.</p>
          <p>
            <b>Incorrect:</b> (uv)′=u′v &nbsp; ✕
          </p>
          <p>
            <b>Incorrect:</b> (uv)′=uv′ &nbsp; ✕
          </p>
          <footer>
            ♧ Remember: both u and v are changing. Include both u′v and uv′.
          </footer>
        </article>
      </section>
      <section className="prd291-practice">
        <header>Try it: Product Rule Challenge</header>
        <main>
          <p>Find y′ using the Product Rule.</p>
          <label>
            y = <input value="x*exp(x)" readOnly />
          </label>
          <button
            onClick={() =>
              act(() => navigator.clipboard?.writeText("x*exp(x)"))
            }
          >
            ×
          </button>
        </main>
        <label>
          Your answer: &nbsp; y′ ={" "}
          <input
            aria-label="Product rule practice answer"
            value={practice}
            onChange={(e) => {
              setPractice(e.target.value);
              setResult("");
            }}
          />
          <b className={result}>
            {result === "correct" ? (
              <>
                <Check /> Correct!
              </>
            ) : result === "incorrect" ? (
              "Try both product terms."
            ) : (
              ""
            )}
          </b>
          <button onClick={check}>Check answer</button>
          <p>Correct answer: y′=(x+1)eˣ</p>
        </label>
        <aside>
          <b>Tip</b>
          <p>
            Let u=x, v=eˣ. Then u′=1, v′=eˣ.
            <br />
            So y′=u′v+uv′=eˣ+xeˣ=(x+1)eˣ.
          </p>
        </aside>
      </section>
      <nav className="prd291-adjacent">
        <a href="/lessons/calculus/290-higher-derivatives">
          <ArrowRight />
          <span>
            <small>Previous</small>Higher Derivatives
          </span>
        </a>
        <a href="/lessons/calculus/292-quotient-rule">
          <span>
            <small>Next</small>Quotient Rule
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function ProductGraph({
  u,
  v,
  x,
  domain,
  step,
  axes,
  grid,
  legend,
  onX,
}: {
  u: Expression;
  v: Expression;
  x: number;
  domain: number;
  step: number;
  axes: boolean;
  grid: boolean;
  legend: boolean;
  onX: (n: number) => void;
}) {
  const w = 500,
    h = 390,
    sx = (n: number) => 250 + n * (220 / domain),
    sy = (n: number) => 200 - n * 17,
    uv = (n: number) => u.fn(n) * v.fn(n),
    rule = (n: number) => u.df(n) * v.fn(n) + u.fn(n) * v.df(n),
    path = (fn: (n: number) => number) =>
      Array.from({ length: 201 }, (_, i) => {
        const n = -domain + i * ((2 * domain) / 200);
        return `${i ? "L" : "M"}${sx(n)} ${sy(fn(n))}`;
      }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 250) / (220 / domain));
    };
  return (
    <div className="graph">
      <svg viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <pattern
            id="prd-grid"
            width={220 / domain}
            height="34"
            patternUnits="userSpaceOnUse"
          >
            <path d={`M${220 / domain} 0H0V34`} fill="none" stroke="#e8edf3" />
          </pattern>
        </defs>
        {grid && <rect width={w} height={h} fill="url(#prd-grid)" />}
        {axes && (
          <>
            <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
            <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
          </>
        )}
        <path className="u" d={path(u.fn)} />
        <path className="v" d={path(v.fn)} />
        <path className="uv" d={path(uv)} />
        <path className="rule" d={path(rule)} />
        <line className="cursor" x1={sx(x)} y1="0" x2={sx(x)} y2={h} />
        <circle
          data-drag="product-cursor"
          cx={sx(x)}
          cy={sy(uv(x))}
          r="6"
          onPointerDown={drag}
          onPointerMove={drag}
        />
      </svg>
      {legend && (
        <div className="legend">
          <p>━ u(x)={u.label}</p>
          <p>━ v(x)={v.label}</p>
          <p>━ uv</p>
          <p>━ (uv)′=u′v+uv′</p>
        </div>
      )}
      <small>
        Independent model uses central difference step h={step.toFixed(2)}.
      </small>
    </div>
  );
}
function MiniGraph({
  label,
  fn,
  color,
  operator,
  domain,
}: {
  label: string;
  fn: (x: number) => number;
  color: string;
  operator: string;
  domain: number;
}) {
  const w = 180,
    h = 55,
    sx = (n: number) => 90 + n * (80 / domain),
    sy = (n: number) => 28 - n * 4,
    path = Array.from({ length: 101 }, (_, i) => {
      const n = -domain + i * ((2 * domain) / 100);
      return `${i ? "L" : "M"}${sx(n)} ${sy(fn(n))}`;
    }).join(" ");
  return (
    <article>
      <h4>{label}</h4>
      <svg viewBox={`0 0 ${w} ${h}`}>
        <line x1="0" y1={sy(0)} x2={w} y2={sy(0)} stroke="#64748b" />
        <line x1={sx(0)} y1="0" x2={sx(0)} y2={h} stroke="#64748b" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" />
      </svg>
      {operator && <b>{operator}</b>}
    </article>
  );
}
