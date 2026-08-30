import { AlertTriangle, ArrowRight, Check, Eye } from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./QuotientRuleTargetLesson292.css";
type Expr = {
  key: string;
  label: string;
  derivative: string;
  fn: (x: number) => number;
  df: (x: number) => number;
  zeros: number[];
};
const numerators: Expr[] = [
    {
      key: "-(1+x^2)",
      label: "−(1+x²)",
      derivative: "−2x",
      fn: (x) => -(1 + x * x),
      df: (x) => -2 * x,
      zeros: [],
    },
    {
      key: "x^2+1",
      label: "x²+1",
      derivative: "2x",
      fn: (x) => x * x + 1,
      df: (x) => 2 * x,
      zeros: [],
    },
    {
      key: "sin(x)",
      label: "sin(x)",
      derivative: "cos(x)",
      fn: Math.sin,
      df: Math.cos,
      zeros: [0],
    },
  ],
  denominators: Expr[] = [
    {
      key: "2+x",
      label: "2+x",
      derivative: "1",
      fn: (x) => 2 + x,
      df: () => 1,
      zeros: [-2],
    },
    {
      key: "x-1",
      label: "x−1",
      derivative: "1",
      fn: (x) => x - 1,
      df: () => 1,
      zeros: [1],
    },
    {
      key: "x^2+1",
      label: "x²+1",
      derivative: "2x",
      fn: (x) => x * x + 1,
      df: (x) => 2 * x,
      zeros: [],
    },
  ];
const norm = (s: string) =>
    s.toLowerCase().replace(/\s/g, "").replace(/²/g, "^2"),
  find = (items: Expr[], text: string) =>
    items.find((e) => norm(e.key) === norm(text)) ?? null,
  fmt = (n: number, p = 4) => (Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p)));
export default function QuotientRuleTargetLesson292({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [fText, setFText] = useState("-(1+x^2)"),
    [gText, setGText] = useState("2+x"),
    [x0, setX0] = useState(0),
    [showDerivative, setShowDerivative] = useState(true),
    [tab, setTab] = useState("Interaction + Visualization"),
    [answer, setAnswer] = useState("(-3x^2+2x+3)/(x^2+1)^2"),
    [showSolution, setShowSolution] = useState(false),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [actions, setActions] = useState(0);
  const f = find(numerators, fText) ?? numerators[0],
    g = find(denominators, gText) ?? denominators[0],
    fValid = Boolean(find(numerators, fText)),
    gValid = Boolean(find(denominators, gText)),
    quotient = (x: number) => f.fn(x) / g.fn(x),
    rule = (x: number) =>
      (g.fn(x) * f.df(x) - f.fn(x) * g.df(x)) / g.fn(x) ** 2,
    h = 0.001,
    model = (quotient(x0 + h) - quotient(x0 - h)) / (2 * h),
    y = quotient(x0),
    slope = rule(x0);
  const reset = () => {
    setFText("-(1+x^2)");
    setGText("2+x");
    setX0(0);
    setShowDerivative(true);
    setTab("Interaction + Visualization");
    setAnswer("(-3x^2+2x+3)/(x^2+1)^2");
    setShowSolution(false);
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((a) => a + 1);
    onInteraction();
  };
  const changeX = (n: number) => {
    let next = Math.max(-5, Math.min(5, Number(n.toFixed(2))));
    if (g.zeros.some((z) => Math.abs(z - next) < 0.05)) next += 0.1;
    act(() => setX0(next));
  };
  const check = () => {
    const n = norm(answer).replace(/\*/g, "").replace(/\^2/g, "²");
    act(() =>
      setResult(
        ["(-3x²+2x+3)/(x²+1)²", "(3+2x-3x²)/(x²+1)²"].includes(n)
          ? "correct"
          : "incorrect",
      ),
    );
  };
  return (
    <section
      className="qtr292-page"
      data-testid="calculus-mockup-0371"
      data-dedicated-lesson="292"
      data-object-model="editable-numerator-denominator-automatic-poles-quotient-derivative-tangent-rule-comparison-practice"
      data-f={f.key}
      data-g={g.key}
      data-poles={g.zeros.join(",")}
      data-x0={x0}
      data-y={fmt(y)}
      data-model={fmt(model)}
      data-rule={fmt(slope)}
      data-error={fmt(Math.abs(model - slope))}
      data-derivative-visible={showDerivative}
      data-result={result}
      data-actions={actions}
    >
      <header className="qtr292-hero">
        <main>
          <span>
            <b>CALCULUS</b>
            <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
          </span>
          <h1>Quotient Rule</h1>
          <p>Differentiate quotients.</p>
          <div className="meta">
            <i>Advanced</i>
            <i>Calculus Lab</i>
            <i>Derivative / Limit / CAS</i>
            <i>6–10 min</i>
          </div>
        </main>
        <aside>
          <h3>Quotient Rule</h3>
          <output>(u/v)′ = (vu′−uv′)/v², &nbsp; v≠0</output>
          <p>If y=f(x)/g(x), then y′=(gf′−fg′)/g², where g(x)≠0.</p>
        </aside>
      </header>
      <nav className="qtr292-tabs">
        {[
          "Interaction + Visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Common Mistakes",
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
      <section className="qtr292-flow">
        {[
          ["1", "Observe", "See how the quotient y=f(x)/g(x) behaves."],
          ["2", "Manipulate", "Change f(x), g(x) and watch y and y′."],
          [
            "3",
            "Notice",
            "The derivative at x₀ matches the quotient rule result.",
          ],
          [
            "4",
            "Understand",
            "The quotient rule combines the product and chain rules.",
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
      <section className="qtr292-lab">
        <aside>
          <h3>BUILD THE QUOTIENT y=f(x)/g(x)</h3>
          <div className="factors">
            <article className={fValid ? "valid" : "invalid"}>
              <b>Numerator f(x)</b>
              <label>
                f(x)=
                <input
                  aria-label="Quotient numerator"
                  list="qtr-numerators"
                  value={fText}
                  onChange={(e) => act(() => setFText(e.target.value))}
                />
                <button onClick={() => act(() => setFText("x^2+1"))}>fₓ</button>
              </label>
              <p>f′(x)={fValid ? f.derivative : "unsupported"}</p>
            </article>
            <article className={gValid ? "valid" : "invalid"}>
              <b>Denominator g(x)</b>
              <label>
                g(x)=
                <input
                  aria-label="Quotient denominator"
                  list="qtr-denominators"
                  value={gText}
                  onChange={(e) => act(() => setGText(e.target.value))}
                />
                <button onClick={() => act(() => setGText("x^2+1"))}>fₓ</button>
              </label>
              <p>g′(x)={gValid ? g.derivative : "unsupported"}</p>
            </article>
          </div>
          <datalist id="qtr-numerators">
            {numerators.map((e) => (
              <option key={e.key}>{e.key}</option>
            ))}
          </datalist>
          <datalist id="qtr-denominators">
            {denominators.map((e) => (
              <option key={e.key}>{e.key}</option>
            ))}
          </datalist>
          <article className="exclusion">
            <h3>Exclusion (where g(x)=0)</h3>
            {g.zeros.length ? (
              <>
                <output>
                  {g.label}=0 &nbsp; ⇒ &nbsp; x={g.zeros.join(", ")}
                </output>
                <p>This point is not in the domain of y.</p>
              </>
            ) : (
              <p>No real exclusions. The denominator stays positive.</p>
            )}
          </article>
          <label className="point">
            Point x₀ (move on graph)
            <input
              aria-label="Quotient point x0"
              type="range"
              min="-5"
              max="5"
              step=".01"
              value={x0}
              onChange={(e) => changeX(Number(e.target.value))}
            />
            <small>
              <span>−5</span>
              <span>5</span>
            </small>
            <output>{x0.toFixed(2)}</output>
          </label>
        </aside>
        <main>
          <header>
            <h3>
              MODEL: y=f(x)/g(x) = {f.label}/{g.label}
            </h3>
            <label>
              <input
                type="checkbox"
                checked={showDerivative}
                onChange={() => act(() => setShowDerivative((v) => !v))}
              />{" "}
              Show derivative y′
            </label>
          </header>
          <QuotientGraph
            f={f}
            g={g}
            x0={x0}
            derivative={showDerivative}
            onX={changeX}
          />
          <div className="legend">
            ━ y={f.label}/{g.label} &nbsp; <i>--- Tangent at x={x0}</i> &nbsp; ●
            Point ({x0}, {fmt(y, 3)}) &nbsp;{" "}
            <b>--- Vertical asymptote {g.zeros.join(", ")}</b>
          </div>
          <section className="results">
            <article>
              <h3>Values at x={x0}</h3>
              <p>
                f(x)={fmt(f.fn(x0))}
                <br />
                g(x)={fmt(g.fn(x0))}
                <br />
                f′(x)={fmt(f.df(x0))}
                <br />
                g′(x)={fmt(g.df(x0))}
                <br />
                y(x)={fmt(y)}
              </p>
            </article>
            <article>
              <h3>Tangent check</h3>
              <p>
                Slope (graph) = {fmt(model)}
                <br />
                Slope (rule) = {fmt(slope)}
              </p>
              <b>
                Match <Check />
              </b>
            </article>
            <article>
              <h3>Domain of y</h3>
              <output>
                {g.zeros.length ? `ℝ \\ {${g.zeros.join(",")}}` : "ℝ"}
              </output>
              <p>{g.zeros.map((z) => `x≠${z}`).join(", ")}</p>
            </article>
          </section>
        </main>
      </section>
      <section className="qtr292-derivation">
        <article>
          <h3>QUOTIENT RULE RESULT</h3>
          <output>y′=[g(x)f′(x)−f(x)g′(x)]/[g(x)]²</output>
          <p>
            y′=[({g.label})({f.derivative})−({f.label})({g.derivative})]/(
            {g.label})²
          </p>
          <p>
            The numerator order is denominator × numerator derivative minus
            numerator × denominator derivative.
          </p>
        </article>
        <article>
          <h3>AT x₀={x0}</h3>
          <output>
            y′({x0})=[{fmt(g.fn(x0))}·{fmt(f.df(x0))}−{fmt(f.fn(x0))}·
            {fmt(g.df(x0))}]/{fmt(g.fn(x0))}²
          </output>
          <strong>= {fmt(slope)}</strong>
        </article>
        <article>
          <h3>SLOPE OF TANGENT AT x₀={x0}</h3>
          <p>
            The slope computed from the graph equals the slope from the quotient
            rule.
          </p>
          <output>
            y′graph({x0}) ≈ y′rule({x0}) = {fmt(slope)}
          </output>
          <Check />
        </article>
      </section>
      <section className="qtr292-bottom">
        <article>
          <h3>Worked Example</h3>
          <p>Find y′ for y=(x²+1)/(x−3).</p>
          <p>
            u=x²+1, u′=2x
            <br />
            v=x−3, v′=1
          </p>
          <output>
            y′=[(x−3)(2x)−(x²+1)]/(x−3)²
            <br />
            =(x²−6x−1)/(x−3)²
          </output>
          <p>Domain: ℝ\{3}</p>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common Misconception
          </h3>
          <p>
            <b>DO NOT</b> differentiate like a single fraction.
          </p>
          <output>Incorrect: (u/v)′=u′/v′ &nbsp; ✕</output>
          <p>
            <b>Why wrong?</b> This ignores the product rule inside the quotient.
          </p>
          <p>Always use: (u/v)′=(vu′−uv′)/v²</p>
        </article>
        <article className="practice">
          <h3>Quick Practice Check</h3>
          <p>Find y′ for y=(3x−1)/(x²+1).</p>
          <label>
            Your answer:
            <input
              aria-label="Quotient rule practice answer"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button onClick={check}>Check Answer</button>
          <button
            className="solution"
            onClick={() => act(() => setShowSolution((v) => !v))}
          >
            <Eye /> {showSolution ? "Hide" : "Show"} Solution
          </button>
          {showSolution && (
            <output>
              y′=[3(x²+1)−(3x−1)(2x)]/(x²+1)²
              <br />
              =(−3x²+2x+3)/(x²+1)²
            </output>
          )}
          <b className={result}>
            {result === "correct"
              ? "Correct!"
              : result === "incorrect"
                ? "Check numerator order and denominator square."
                : ""}
          </b>
        </article>
      </section>
      <nav className="qtr292-adjacent">
        <a href="/lessons/calculus/291-product-rule">
          <ArrowRight />
          <span>
            <small>Previous</small>Product Rule
          </span>
        </a>
        <a href="/lessons/calculus/293-chain-rule">
          <span>
            <small>Next</small>Chain Rule
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="qtr292-footer">
        <b>Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <nav>▣ Sitemap &nbsp; ♧ Docs &nbsp; ✉ About</nav>
      </footer>
    </section>
  );
}
function QuotientGraph({
  f,
  g,
  x0,
  derivative,
  onX,
}: {
  f: Expr;
  g: Expr;
  x0: number;
  derivative: boolean;
  onX: (n: number) => void;
}) {
  const w = 570,
    h = 350,
    sx = (n: number) => 285 + n * 52,
    sy = (n: number) => 175 - n * 31,
    q = (n: number) => f.fn(n) / g.fn(n),
    d = (n: number) => (g.fn(n) * f.df(n) - f.fn(n) * g.df(n)) / g.fn(n) ** 2,
    segments: (fn: (n: number) => number) => string[] = (fn) => {
      const out: string[] = [];
      let path = "";
      for (let i = 0; i <= 300; i++) {
        const n = -5 + i / 30,
          val = fn(n),
          valid =
            Number.isFinite(val) &&
            Math.abs(val) < 20 &&
            Math.abs(g.fn(n)) > 0.03;
        if (!valid) {
          if (path) out.push(path);
          path = "";
          continue;
        }
        path += `${path ? "L" : "M"}${sx(n)} ${sy(val)}`;
      }
      if (path) out.push(path);
      return out;
    },
    slope = d(x0),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 285) / 52);
    };
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <pattern
          id="qtr-grid"
          width="52"
          height="31"
          patternUnits="userSpaceOnUse"
        >
          <path d="M52 0H0V31" fill="none" stroke="#e8edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#qtr-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      {g.zeros.map((z) => (
        <line
          className="asymptote"
          key={z}
          x1={sx(z)}
          y1="0"
          x2={sx(z)}
          y2={h}
        />
      ))}
      {segments(q).map((p, i) => (
        <path className="quotient" key={i} d={p} />
      ))}
      {derivative &&
        segments(d).map((p, i) => (
          <path className="derivative" key={i} d={p} />
        ))}
      <line
        className="tangent"
        x1={sx(x0 - 2)}
        y1={sy(q(x0) - 2 * slope)}
        x2={sx(x0 + 2)}
        y2={sy(q(x0) + 2 * slope)}
      />
      <circle
        data-drag="quotient-point"
        cx={sx(x0)}
        cy={sy(q(x0))}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
    </svg>
  );
}
