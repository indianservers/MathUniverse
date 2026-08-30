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
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./HigherDerivativesTargetLesson290.css";
type Model = {
  name: string;
  f: (x: number) => number;
  d1: (x: number) => number;
  d2: (x: number) => number;
  d3: (x: number) => number;
  expressions: string[];
};
const models: Model[] = [
  {
    name: "x⁴ − 6x² + 3",
    f: (x) => x ** 4 - 6 * x * x + 3,
    d1: (x) => 4 * x ** 3 - 12 * x,
    d2: (x) => 12 * x * x - 12,
    d3: (x) => 24 * x,
    expressions: ["x⁴ − 6x² + 3", "4x³ − 12x", "12x² − 12", "24x"],
  },
  {
    name: "½x⁴ − 4x² + 2",
    f: (x) => 0.5 * x ** 4 - 4 * x * x + 2,
    d1: (x) => 2 * x ** 3 - 8 * x,
    d2: (x) => 6 * x * x - 8,
    d3: (x) => 12 * x,
    expressions: ["½x⁴ − 4x² + 2", "2x³ − 8x", "6x² − 8", "12x"],
  },
  {
    name: "−x⁴ + 6x² + 1",
    f: (x) => -(x ** 4) + 6 * x * x + 1,
    d1: (x) => -4 * x ** 3 + 12 * x,
    d2: (x) => -12 * x * x + 12,
    d3: (x) => -24 * x,
    expressions: ["−x⁴ + 6x² + 1", "−4x³ + 12x", "−12x² + 12", "−24x"],
  },
];
const fmt = (n: number, p = 3) =>
  Math.abs(n) < 1e-9 ? 0 : Number(n.toFixed(p));
export default function HigherDerivativesTargetLesson290({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(0),
    [domain, setDomain] = useState(3.5),
    [modelIndex, setModelIndex] = useState(0),
    [showPoints, setShowPoints] = useState(true),
    [showSigns, setShowSigns] = useState(true),
    [showInflections, setShowInflections] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [answers, setAnswers] = useState(["0", "6", "48"]),
    [result, setResult] = useState<"correct" | "incorrect" | "">(""),
    [actions, setActions] = useState(0);
  const model = models[modelIndex],
    values = [model.f(x), model.d1(x), model.d2(x), model.d3(x)];
  const reset = () => {
    setX(0);
    setDomain(3.5);
    setModelIndex(0);
    setShowPoints(true);
    setShowSigns(true);
    setShowInflections(true);
    setTab("Interaction + visualization");
    setAnswers(["0", "6", "48"]);
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeX = (v: number) =>
    act(() => setX(Math.max(-domain, Math.min(domain, Number(v.toFixed(2))))));
  const check = () =>
    act(() =>
      setResult(
        Number(answers[0]) === 0 &&
          Number(answers[1]) === 6 &&
          Number(answers[2]) === 48
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="hdr290-page"
      data-testid="calculus-mockup-0369"
      data-dedicated-lesson="290"
      data-object-model="quartic-four-linked-derivative-levels-shared-drag-cursor-domain-visibility-sign-concavity-practice"
      data-x={x}
      data-domain={domain}
      data-model={model.name}
      data-f={fmt(values[0])}
      data-d1={fmt(values[1])}
      data-d2={fmt(values[2])}
      data-d3={fmt(values[3])}
      data-result={result}
      data-actions={actions}
    >
      <header className="hdr290-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Higher Derivatives</h1>
        <p>Analyse acceleration and concavity.</p>
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
                  `x=${x}; f,f',f'',f'''=${values.map((v) => fmt(v)).join(",")}`,
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
      <nav className="hdr290-tabs">
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
      <section className="hdr290-lab">
        <header>
          <div>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>Explore f, f′, f″ and f‴ together</h2>
          </div>
          <b>
            <Check /> All correct
          </b>
          <output>{actions} actions</output>
          <button>↗</button>
        </header>
        <div className="workspace">
          <aside>
            <article>
              <h3>▣ Linked cursor</h3>
              <label>
                x{" "}
                <input
                  aria-label="Higher derivative cursor"
                  type="range"
                  min={-domain}
                  max={domain}
                  step=".01"
                  value={x}
                  onChange={(e) => changeX(Number(e.target.value))}
                />
                <output>{x.toFixed(2)}</output>
              </label>
              <h3>Domain (x)</h3>
              <label className="domain">
                <input
                  aria-label="Domain minimum"
                  type="number"
                  value={-domain}
                  onChange={(e) =>
                    act(() =>
                      setDomain(Math.max(2, Math.abs(Number(e.target.value)))),
                    )
                  }
                />
                <input
                  aria-label="Domain maximum"
                  type="number"
                  value={domain}
                  onChange={(e) =>
                    act(() =>
                      setDomain(Math.max(2, Math.abs(Number(e.target.value)))),
                    )
                  }
                />
              </label>
              <h3>Function f(x)</h3>
              <p>f(x) = {model.expressions[0]}</p>
              <button
                onClick={() =>
                  act(() => setModelIndex((v) => (v + 1) % models.length))
                }
              >
                Random example
              </button>
              <h3>Display options</h3>
              {[
                ["Show points & values", showPoints, setShowPoints],
                ["Show signs", showSigns, setShowSigns],
                ["Show inflection points", showInflections, setShowInflections],
              ].map(([label, value, setter]) => (
                <label className="toggle" key={String(label)}>
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={() => act(() => setter((v: boolean) => !v))}
                  />
                  {label}
                </label>
              ))}
            </article>
            <article className="guide">
              <h3>Guide</h3>
              <p>
                ◉ <b>Observe</b>
                <small>
                  Move the cursor to watch the four curves and their values
                  update.
                </small>
              </p>
              <p>
                ♨ <b>Manipulate</b>
                <small>Change x or pick another function.</small>
              </p>
              <p>
                ♢ <b>Notice</b>
                <small>
                  How shape → slope → concavity → rate of change of concavity.
                </small>
              </p>
              <p>
                ◎ <b>Understand</b>
                <small>Connect each derivative to a geometric meaning.</small>
              </p>
            </article>
          </aside>
          <main>
            {[0, 1, 2, 3].map((level) => (
              <DerivativeRow
                key={level}
                level={level}
                x={x}
                domain={domain}
                model={model}
                showPoint={showPoints}
                showSigns={showSigns}
                showInflections={showInflections}
                onX={changeX}
              />
            ))}
          </main>
        </div>
      </section>
      <section className="hdr290-meaning">
        {[
          ["f′(x) = 0", "Horizontal tangent at x."],
          ["f″(x) = 0", "Inflection point of f."],
          ["f″(x) > 0", "Curve is concave up, acceleration positive."],
          ["f″(x) < 0", "Curve is concave down, acceleration negative."],
          ["f‴(x)", "Controls how concavity is changing."],
        ].map(([t, p], i) => (
          <article key={t}>
            <i>{["↕", "↗", "◔", "↓", "♧"][i]}</i>
            <div>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="hdr290-info">
        <article>
          <h3>The chain of derivatives</h3>
          <p>Each derivative answers a “rate of change” question.</p>
          <strong>
            f &nbsp; → &nbsp; f′ &nbsp; → &nbsp; f″ &nbsp; → &nbsp; f‴
          </strong>
          <div>
            <span>Position / shape</span>
            <span>Slope / velocity</span>
            <span>Concavity / acceleration</span>
            <span>Rate of change of concavity</span>
          </div>
          <p>Higher derivatives continue this pattern.</p>
        </article>
        <article>
          <h3>The rule (power rule)</h3>
          <p>For n≥1 and n∈N,</p>
          <output>dᵐ/dxᵐ (xⁿ)=n(n−1)…(n−m+1)xⁿ⁻ᵐ</output>
          <p>Special case:</p>
          <output>dⁿ/dxⁿ(c)=0, for any constant c, n≥1</output>
        </article>
        <article className="mistake">
          <h3>
            Common misconception <AlertTriangle />
          </h3>
          <p>
            <b>Mistake:</b> Thinking “higher derivative” just means “repeat the
            same rule randomly”.
          </p>
          <p>
            <b>Avoid:</b> Losing track of coefficients and signs.
          </p>
          <p>
            <b>Remember:</b> Each derivative depends on the correct result of
            the previous one.
          </p>
          <p>
            <b>Check:</b> Units/meaning change at every step.
          </p>
        </article>
      </section>
      <section className="hdr290-bottom">
        <article className="worked">
          <h3>▣ Worked example</h3>
          <p>
            Given f(x)=x⁴−6x²+3. Find f′(x), f″(x), f‴(x) and their values at
            x=0.
          </p>
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Derivative</th>
                <th>Expression</th>
                <th>Value at x=0</th>
                <th>Interpretation at x=0</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "f(x)", "x⁴−6x²+3", "3", "point above x-axis"],
                ["2", "f′(x)", "4x³−12x", "0", "horizontal tangent"],
                ["3", "f″(x)", "12x²−12", "−12", "concave down"],
                ["4", "f‴(x)", "24x", "0", "concavity stationary"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c) => (
                    <td key={c}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="practice">
          <h3>▣ Your turn</h3>
          <p>
            Let g(x)=2x⁵−3x⁴+x²−7. Find g′(x), g″(x), g‴(x) and enter their
            values at x=1.
          </p>
          {["g′(1) =", "g″(1) =", "g‴(1) ="].map((label, i) => (
            <label key={label}>
              {label}
              <input
                aria-label={`Practice derivative ${i + 1}`}
                value={answers[i]}
                onChange={(e) => {
                  setAnswers((v) =>
                    v.map((a, j) => (j === i ? e.target.value : a)),
                  );
                  setResult("");
                }}
              />
            </label>
          ))}
          <button onClick={check}>Check answer</button>
          <aside className={result}>
            <p>
              {result === "incorrect"
                ? "Recalculate each derivative before substituting x=1."
                : result === "correct"
                  ? "g′(1)=0 correct\ng″(1)=6 correct\ng‴(1)=48 correct"
                  : "Check to see your result."}
            </p>
            {result === "correct" && <b>Great! Keep practising.</b>}
          </aside>
        </article>
      </section>
      <nav className="hdr290-adjacent">
        <a href="/lessons/calculus/289-derivative-graph">
          <ArrowRight />
          <span>
            <small>Previous</small>Derivative Graph
          </span>
        </a>
        <a href="/lessons/calculus/291-product-rule">
          <span>
            <small>Next</small>Product Rule
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="hdr290-footer">
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>▣ Sitemap &nbsp; ♧ Docs &nbsp; ✉ About</nav>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </section>
  );
}
function DerivativeRow({
  level,
  x,
  domain,
  model,
  showPoint,
  showSigns,
  showInflections,
  onX,
}: {
  level: number;
  x: number;
  domain: number;
  model: Model;
  showPoint: boolean;
  showSigns: boolean;
  showInflections: boolean;
  onX: (v: number) => void;
}) {
  const funcs = [model.f, model.d1, model.d2, model.d3],
    fn = funcs[level],
    value = fn(x),
    colors = ["#08a8d3", "#7835de", "#ff7900", "#20ad58"],
    ranges = [10, 10, 14, 30],
    w = 440,
    h = 125,
    sx = (n: number) => 220 + n * (190 / domain),
    sy = (n: number) => 62 - n * (52 / ranges[level]),
    path = Array.from({ length: 161 }, (_, i) => {
      const n = -domain + i * ((2 * domain) / 160);
      return `${i ? "L" : "M"}${sx(n)} ${sy(fn(n))}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 220) / (190 / domain));
    };
  const titles = [
    "f : position / shape",
    "f′ : slope / velocity",
    "f″ : concavity / acceleration",
    "f‴ : rate of change of concavity",
  ];
  return (
    <section
      className="row"
      style={{ "--row-color": colors[level] } as CSSProperties}
    >
      <div className="plot">
        <svg viewBox={`0 0 ${w} ${h}`}>
          <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
          <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
          <path className="curve" d={path} />
          <line className="cursor" x1={sx(x)} y1="0" x2={sx(x)} y2={h} />
          {showPoint && (
            <circle
              data-drag={`higher-point-${level}`}
              cx={sx(x)}
              cy={sy(value)}
              r="5"
              onPointerDown={drag}
              onPointerMove={drag}
            />
          )}{" "}
          {showInflections &&
            level === 0 &&
            [-1, 1].map((v) => (
              <circle
                className="inflection"
                key={v}
                cx={sx(v)}
                cy={sy(fn(v))}
                r="3"
              />
            ))}
          <text x="12" y="18">
            {["f(x)", "f′(x)", "f″(x)", "f‴(x)"][level]}
          </text>
          <text className="value" x="330" y="18">
            {["f", "f′", "f″", "f‴"][level]}({x})={fmt(value)}
          </text>
        </svg>
      </div>
      <aside>
        <h3>{titles[level]}</h3>
        <p>
          {level === 0
            ? "The original function. Its height gives the position/height at x."
            : level === 1
              ? "Slope of f(x). Positive → increasing; negative → decreasing."
              : level === 2
                ? "Describes concavity. Positive → concave up; negative → concave down."
                : "Slope of f″(x). Positive → concavity getting stronger upward."}
        </p>
        {showSigns && (
          <p>
            At x={x}
            <br />
            <b>
              {["f", "f′", "f″", "f‴"][level]}({x})={fmt(value)}{" "}
              {level === 1
                ? value === 0
                  ? "(horizontal tangent)"
                  : value > 0
                    ? "(increasing)"
                    : "(decreasing)"
                : level === 2
                  ? value > 0
                    ? "(concave up)"
                    : "(concave down)"
                  : ""}
            </b>
          </p>
        )}
      </aside>
    </section>
  );
}
