import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./DerivativeGraphTargetLesson289.css";
const k = Math.SQRT1_2,
  c = 0.1644,
  fp = (x: number) => k * (x * x + x - 1),
  f = (x: number) => k * ((x * x * x) / 3 + (x * x) / 2 - x) + c,
  fmt = (n: number, p = 2) => Number(n.toFixed(p)),
  roots = [(-1 - Math.sqrt(5)) / 2, (-1 + Math.sqrt(5)) / 2];
export default function DerivativeGraphTargetLesson289({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(-0.64),
    [fScale, setFScale] = useState(3),
    [dScale, setDScale] = useState(6),
    [tab, setTab] = useState("Interaction + visualization"),
    [choice, setChoice] = useState("B"),
    [result, setResult] = useState<"correct" | "incorrect" | "">("correct"),
    [actions, setActions] = useState(0);
  const y = f(x),
    slope = fp(x),
    sign = slope > 1e-6 ? "Positive" : slope < -1e-6 ? "Negative" : "Zero";
  const reset = () => {
    setX(-0.64);
    setFScale(3);
    setDScale(6);
    setTab("Interaction + visualization");
    setChoice("B");
    setResult("correct");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeX = (v: number) =>
    act(() => setX(Math.max(-4, Math.min(4, fmt(v, 2)))));
  return (
    <section
      className="dgr289-page"
      data-testid="calculus-mockup-0368"
      data-dedicated-lesson="289"
      data-object-model="integrated-cubic-linked-derivative-shared-draggable-cursor-tangent-sign-zeros-scales-challenge"
      data-x={x}
      data-fx={fmt(y)}
      data-derivative={fmt(slope)}
      data-sign={sign}
      data-f-scale={fScale}
      data-d-scale={dScale}
      data-result={result}
      data-actions={actions}
    >
      <header className="dgr289-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Derivative Graph</h1>
        <p>Connect a function and its derivative.</p>
        <div className="meta">
          <i>Advanced</i>
          <i>Calculus Lab</i>
          <i>Derivatives / Limit / CAS</i>
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
                  `x=${x}, f(x)=${fmt(y)}, f'(x)=${fmt(slope)}`,
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
      <section className="dgr289-flow">
        {[
          [
            Eye,
            "Observe",
            "See how the slope of f(x) determines the value of f′(x).",
          ],
          [
            Hand,
            "Manipulate",
            "Drag the cursor or adjust controls to explore.",
          ],
          [
            Lightbulb,
            "Notice",
            "Positive slope → f′(x)>0; negative slope → f′(x)<0; zero slope → f′(x)=0.",
          ],
          [
            Target,
            "Understand",
            "The derivative graph f′(x) records the slope of f(x) at every x.",
          ],
        ].map(([Icon, t, p], i) => (
          <article key={String(t)}>
            <Icon />
            <b>{i + 1}</b>
            <h3>{t}</h3>
            <p>{p}</p>
            {i < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <nav className="dgr289-tabs">
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
      <section className="dgr289-lab">
        <header>
          <div>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>
              Synchronized graphs: <i>f(x)</i> and <i>f′(x)</i>
            </h2>
          </div>
          <b>All set! 🎉</b>
          <output>{actions} actions</output>
          <button>↗</button>
        </header>
        <div className="workspace">
          <main>
            <GraphPanel kind="function" x={x} scale={fScale} onX={changeX} />
            <GraphPanel kind="derivative" x={x} scale={dScale} onX={changeX} />
          </main>
          <aside>
            <article className="controls">
              <h3>Linked controls</h3>
              <label>
                Cursor <b>x={x.toFixed(2)}</b>
                <input
                  aria-label="Shared cursor"
                  type="range"
                  min="-4"
                  max="4"
                  step=".01"
                  value={x}
                  onChange={(e) => changeX(Number(e.target.value))}
                />
                <output>{x.toFixed(2)}</output>
              </label>
              <label>
                ♙ Vertical scale (f) <b>{fScale}</b>
                <input
                  aria-label="Function vertical scale"
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={fScale}
                  onChange={(e) => act(() => setFScale(Number(e.target.value)))}
                />
                <output>{fScale}</output>
              </label>
              <label>
                ♙ Vertical scale (f′) <b>{dScale}</b>
                <input
                  aria-label="Derivative vertical scale"
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={dScale}
                  onChange={(e) => act(() => setDScale(Number(e.target.value)))}
                />
                <output>{dScale}</output>
              </label>
            </article>
            <article>
              <h3>How to read</h3>
              <p>
                <i /> f(x) value at x
              </p>
              <p>
                <i /> Slope f′(x) (value on derivative graph)
              </p>
              <p>
                <i /> Shared cursor (x)
              </p>
              <p>
                <i /> Tangent line on f(x)
              </p>
            </article>
            <article className="feedback">
              <h3>Instant feedback</h3>
              <p>
                <Check /> Stays on both graphs
              </p>
              <p>
                <Check /> Slope ↔ derivative value match
              </p>
              <p>
                <Check /> Signs agree
              </p>
            </article>
          </aside>
        </div>
      </section>
      <section className="dgr289-learn">
        <article>
          <h3>▣ Key rule</h3>
          <p>The derivative at x is the slope of the function at that point.</p>
          <output>f′(x)=lim h→0 [f(x+h)−f(x)]/h</output>
          <p>Sign of f′(x) tells us:</p>
          <p>• f′(x)&gt;0 → f increasing</p>
          <p>• f′(x)&lt;0 → f decreasing</p>
          <p>• f′(x)=0 → horizontal tangent</p>
        </article>
        <article>
          <h3>
            <Check /> Worked example
          </h3>
          <p>Let f(x)=x³−3x. Then f′(x)=3x²−3.</p>
          <table>
            <tbody>
              <tr>
                <th>x</th>
                {[-2, -1, 0, 1, 2].map((v) => (
                  <td key={v}>{v}</td>
                ))}
              </tr>
              <tr>
                <th>f(x)</th>
                {[-2, 2, 0, -2, 2].map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
              </tr>
              <tr>
                <th>f′(x)</th>
                {[9, 0, -3, 0, 9].map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <p>● Zeros of f′(x) at x=−1,1 match horizontal tangents on f(x).</p>
          <p>● f′(0)=−3&lt;0 → f has a negative slope at x=0.</p>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common misconception
          </h3>
          <p>
            <b>Misreading sign:</b>
            <br />
            If f′(x)&gt;0, f is increasing (not decreasing).
          </p>
          <MiniSign />
          <p>✓ Positive → increasing</p>
          <p>⊗ Negative → decreasing</p>
        </article>
        <article className="challenge">
          <h3>♜ Quick challenge</h3>
          <p>At which x-values is f increasing in the graph above?</p>
          {[
            ["A", "(−1.62, 0.62)"],
            ["B", "x < −1.62 or x > 0.62"],
            ["C", "x < −1.62 and x > 0.62"],
            ["D", "−1.62 < x < 0.62"],
          ].map(([v, t]) => (
            <label className={choice === v ? "selected" : ""} key={v}>
              <input
                type="radio"
                name="dgr-answer"
                checked={choice === v}
                onChange={() => {
                  setChoice(v);
                  setResult("");
                }}
              />
              {v}. {t}
              {choice === v && result === "correct" && <Check />}
            </label>
          ))}
          <button
            onClick={() =>
              act(() => setResult(choice === "B" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          <footer className={result}>
            {result === "incorrect"
              ? "Check where the derivative graph lies above zero."
              : "Correct! f′(x)>0 outside the interval (−1.62, 0.62)."}
          </footer>
        </article>
      </section>
      <nav className="dgr289-adjacent">
        <a href="/lessons/calculus/288-normal-line">
          <ArrowRight />
          <span>
            <small>PREVIOUS</small>Normal Line
          </span>
        </a>
        <a href="/lessons/calculus/290-higher-derivatives">
          <span>
            <small>NEXT</small>Higher Derivatives
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="dgr289-footer">
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
function GraphPanel({
  kind,
  x,
  scale,
  onX,
}: {
  kind: "function" | "derivative";
  x: number;
  scale: number;
  onX: (v: number) => void;
}) {
  const w = 550,
    h = 290,
    sx = (n: number) => 310 + n * 58,
    sy = (n: number) => 145 - n * (125 / scale),
    value = kind === "function" ? f(x) : fp(x),
    path = Array.from({ length: 181 }, (_, i) => {
      const n = -4 + i / 20,
        v = kind === "function" ? f(n) : fp(n);
      return `${i ? "L" : "M"}${sx(n)} ${sy(v)}`;
    }).join(" "),
    drag = (e: ReactPointerEvent<SVGCircleElement>) => {
      if (e.buttons !== 1 && e.type === "pointermove") return;
      if (e.type === "pointerdown")
        e.currentTarget.setPointerCapture(e.pointerId);
      const r = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (r) onX((((e.clientX - r.left) / r.width) * w - 310) / 58);
    };
  return (
    <section className={`graph ${kind}`}>
      <h3>{kind === "function" ? "Function f(x)" : "Derivative f′(x)"}</h3>
      <svg viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <pattern
            id={`dgr-grid-${kind}`}
            width="58"
            height={125 / scale}
            patternUnits="userSpaceOnUse"
          >
            <path d={`M58 0H0V${125 / scale}`} fill="none" stroke="#e8edf3" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#dgr-grid-${kind})`} />
        <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
        <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
        <path className="curve" d={path} />
        <line className="cursor" x1={sx(x)} y1="0" x2={sx(x)} y2={h} />
        {kind === "function" && (
          <line
            className="tangent"
            x1={sx(x - 1)}
            y1={sy(f(x) - fp(x))}
            x2={sx(x + 1)}
            y2={sy(f(x) + fp(x))}
          />
        )}
        <circle
          data-drag={`cursor-${kind}`}
          cx={sx(x)}
          cy={sy(value)}
          r="6"
          onPointerDown={drag}
          onPointerMove={drag}
        />
        <text className="point" x={sx(x) + 12} y={sy(value) - 9}>
          ({x.toFixed(2)}, {value.toFixed(2)})
        </text>
        <text className="flabel" x="492" y="30">
          {kind === "function" ? "f(x)" : "f′(x)"}
        </text>
      </svg>
      <aside>
        <p>
          <i /> {kind === "function" ? "Cursor x" : "f′(x)"}
          <b>{kind === "function" ? x.toFixed(2) : slopeText(value)}</b>
        </p>
        <p>
          <i /> {kind === "function" ? "f(x)" : "Sign of f′(x)"}
          <b>
            {kind === "function"
              ? value.toFixed(2)
              : value > 0
                ? "Positive"
                : value < 0
                  ? "Negative"
                  : "Zero"}
          </b>
        </p>
        {kind === "derivative" && (
          <p>
            ○ Zeros of f′(x)
            <b>
              x≈{roots[0].toFixed(2)}, {roots[1].toFixed(2)}
            </b>
          </p>
        )}
      </aside>
    </section>
  );
}
const slopeText = (n: number) => n.toFixed(2);
function MiniSign() {
  return (
    <svg viewBox="0 0 190 80">
      <path
        d="M5 53Q35 5 65 32T125 32T185 53"
        fill="none"
        stroke="#6b35db"
        strokeWidth="2"
      />
      <line x1="0" y1="53" x2="190" y2="53" stroke="#1e293b" />
      <line x1="95" y1="10" x2="95" y2="75" stroke="#1e293b" />
    </svg>
  );
}
