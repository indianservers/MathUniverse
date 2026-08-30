import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
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
import "./IndefiniteIntegralTargetLesson309.css";

const family = [-3, -1.5, 0, 1.5, 3];
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\^2/g, "²")
    .replace(/\*/g, "");

export default function IndefiniteIntegralTargetLesson309({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [c, setC] = useState(0),
    [tab, setTab] = useState("Explore"),
    [compare, setCompare] = useState(false),
    [answer, setAnswer] = useState(""),
    [hint, setHint] = useState(false),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const reset = () => {
    setC(0);
    setTab("Explore");
    setCompare(false);
    setAnswer("");
    setHint(false);
    setResult("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const setConstant = (value: number) =>
    act(() => setC(Math.max(-3, Math.min(3, Number(value.toFixed(2))))));
  const check = () =>
    act(() => {
      const value = normalize(answer);
      setResult(
        ["x²+c", "x²+constant", "x2+c"].includes(value)
          ? "correct"
          : "incorrect",
      );
    });
  return (
    <section
      className="ind309-page"
      data-testid="calculus-mockup-0388"
      data-dedicated-lesson="309"
      data-object-model="six-x-antiderivative-parabola-family-draggable-constant-linked-derivative-compare-symbolic-practice"
      data-c={c}
      data-tab={tab}
      data-compare={compare}
      data-result={result}
      data-hint={hint}
      data-actions={actions}
    >
      <header className="ind309-hero">
        <span>
          <b>CALCULUS</b>
          <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Indefinite Integral</h1>
        <p>Understand antiderivative families.</p>
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
          <button type="button" onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <a href="/graphing-calculator">↗ Workspace</a>
        </div>
      </header>
      <nav className="ind309-tabs">
        {[
          "Explore",
          "Explain the idea",
          "See examples",
          "Formulas & rules",
          "Common pitfall",
          "Practice",
          "Review",
        ].map((name) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="ind309-flow">
        {[
          [
            Eye,
            "OBSERVE",
            "The same derivative comes from many curves that differ only by a vertical shift.",
          ],
          [
            Hand,
            "MANIPULATE",
            "Move the C slider to see the vertical family of antiderivatives.",
          ],
          [
            Lightbulb,
            "NOTICE",
            "Changing C shifts the graph up or down without changing the derivative.",
          ],
          [
            Target,
            "UNDERSTAND",
            "All antiderivatives of f(x) form a family: F(x)+C, where C is real.",
          ],
        ].map(([Icon, title, text]) => (
          <article key={String(title)}>
            <Icon />
            <h3>{String(title)}</h3>
            <p>{String(text)}</p>
          </article>
        ))}
      </section>
      <section className="ind309-lab">
        <main>
          <header>
            <h2>
              Antiderivative family for <em>f(x) = 6x</em>
            </h2>
            <span>◉ Live</span>
            <button
              type="button"
              aria-label="Full screen model"
              onClick={() =>
                act(() => void document.documentElement.requestFullscreen?.())
              }
            >
              <Maximize2 />
            </button>
          </header>
          <FamilyGraph c={c} compare={compare} onC={setConstant} />
          <DerivativeGraph />
        </main>
        <aside>
          <section>
            <h2>Control the family</h2>
            <label>
              C (vertical shift)
              <input
                aria-label="Antiderivative constant C"
                type="range"
                min="-3"
                max="3"
                step="0.25"
                value={c}
                onChange={(e) => setConstant(Number(e.target.value))}
              />
              <input
                aria-label="Antiderivative constant value"
                type="number"
                min="-3"
                max="3"
                step=".25"
                value={c}
                onChange={(e) => setConstant(Number(e.target.value))}
              />
            </label>
            <h3>Current antiderivative</h3>
            <strong>
              F(x) = 3x² + <em>{c}</em>
            </strong>
            <small>Quick picks</small>
            <div>
              {[-3, -1, 0, 1, 3].map((value) => (
                <button
                  type="button"
                  className={c === value ? "active" : ""}
                  key={value}
                  onClick={() => setConstant(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <output>
              <CheckCircle2 /> Correct! <span>d/dx (3x² + {c}) = 6x</span>
            </output>
          </section>
          <section>
            <h2>At a glance</h2>
            <p>
              ⌂ Derivative (same for all): <b>f(x)=6x</b>
            </p>
            <p>
              ▦ Antiderivative family: <b>F(x)=3x²+C</b>
            </p>
            <p>↔ Domain: R</p>
            <p>↥ Range of f(x): R</p>
            <p>⌘ Vertex of F(x): (0,C)</p>
            <button
              type="button"
              onClick={() => act(() => setCompare((v) => !v))}
            >
              ⌖ {compare ? "Hide comparison" : "Compare a point"}
            </button>
          </section>
        </aside>
      </section>
      <section className="ind309-cards">
        <article>
          <h3>Why this works</h3>
          <p>Adding any constant C does not change the derivative.</p>
          <strong>
            Rule
            <br />
            d/dx [F(x)+C] = F′(x)
          </strong>
          <p>for any constant C.</p>
        </article>
        <article>
          <h3>Worked example</h3>
          <p>Find the indefinite integral of 6x.</p>
          <b>Solution</b>
          <strong>
            ∫6x dx = 6(x²/2)+C
            <br />= 3x²+C
          </strong>
          <small>Different C → vertically shifted curves.</small>
        </article>
        <article className="pitfall">
          <h3>⚠ Common pitfall</h3>
          <p>
            Forgetting the <b>+ C</b>.
          </p>
          <strong>Incorrect: ∫6x dx = 3x² ✕</strong>
          <p>
            There are infinitely many antiderivatives; 3x² is only one member.
          </p>
          <small>💡 Always include + C.</small>
        </article>
        <article className="practice">
          <h3>Mini practice</h3>
          <p>Find the general antiderivative.</p>
          <strong>g(x) = 2x</strong>
          <label>
            Your answer
            <input
              aria-label="Indefinite integral practice answer"
              value={answer}
              placeholder="Type e.g., x² + C"
              onChange={(e) => {
                setAnswer(e.target.value);
                setResult("");
              }}
            />
          </label>
          <button type="button" onClick={check}>
            Check
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct: ∫2x dx=x²+C."
              : result === "incorrect"
                ? "Include the constant C."
                : ""}
          </output>
          <button
            type="button"
            className="hint"
            onClick={() => act(() => setHint((v) => !v))}
          >
            ⌕ Hint
          </button>
          {hint && (
            <small>Increase the exponent and divide by the new exponent.</small>
          )}
        </article>
      </section>
      <nav className="ind309-adjacent">
        <a href="/lessons/calculus/308-definite-integral">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Definite Integral
          </span>
        </a>
        <a href="/lessons/calculus/310-fundamental-theorem">
          <span>
            <small>NEXT</small>Fundamental Theorem
          </span>{" "}
          →
        </a>
      </nav>
      <footer className="ind309-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">▥ Sitemap</a>
          <a href="/docs">⚑ Docs</a>
          <a href="/about">✉ About</a>
        </nav>
      </footer>
    </section>
  );
}

function FamilyGraph({
  c,
  compare,
  onC,
}: {
  c: number;
  compare: boolean;
  onC: (value: number) => void;
}) {
  const w = 520,
    h = 405,
    x0 = 260,
    y0 = 237,
    sx = (x: number) => x0 + x * 67,
    sy = (y: number) => y0 - y * 9;
  const path = (shift: number) =>
    Array.from({ length: 101 }, (_, i) => {
      const x = -3 + (i * 6) / 100,
        y = 3 * x * x + shift * 3;
      return `${i ? "L" : "M"}${sx(x)},${sy(y)}`;
    }).join(" ");
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const move = (p: PointerEvent) =>
      onC(
        Math.round(
          Math.max(
            -3,
            Math.min(3, (y0 - ((p.clientY - box.top) / box.height) * h) / 27),
          ) * 4,
        ) / 4,
      );
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <svg
      className="ind309-family"
      viewBox={`0 0 ${w} ${h}`}
      aria-label="Interactive antiderivative family"
    >
      {Array.from({ length: 13 }, (_, i) => i).map((i) => (
        <line
          key={i}
          x1={(i * w) / 12}
          y1="0"
          x2={(i * w) / 12}
          y2={h}
          className="grid"
        />
      ))}
      <line x1="0" y1={y0} x2={w} y2={y0} className="axis" />
      <line x1={x0} y1="0" x2={x0} y2={h} className="axis" />
      {family.map((value) => (
        <path
          key={value}
          d={path(value)}
          className={value === 0 ? "curve selected" : "curve"}
        />
      ))}
      <circle
        data-drag="indefinite-c"
        cx={sx(0)}
        cy={sy(c * 3)}
        r="9"
        onPointerDown={drag}
      />
      <line x1={sx(0)} y1={sy(-9)} x2={sx(0)} y2={sy(9)} className="shift" />
      <text x="378" y="38">
        F(x)+C (antiderivative family)
      </text>
      <text x="375" y="138">
        F(x)=3x² (C=0)
      </text>
      {compare && (
        <>
          <circle cx={sx(1)} cy={sy(3 + c * 3)} r="6" className="compare" />
          <text x={sx(1) + 8} y={sy(3 + c * 3) - 8}>
            F(1)={3 + c}
          </text>
        </>
      )}
    </svg>
  );
}
function DerivativeGraph() {
  const w = 520,
    h = 150;
  return (
    <section className="ind309-derivative">
      <h3>Linked derivative (constant across the family)</h3>
      <svg viewBox={`0 0 ${w} ${h}`}>
        <line x1="0" y1="75" x2={w} y2="75" className="axis" />
        <line x1="260" y1="0" x2="260" y2={h} className="axis" />
        <line x1="20" y1="140" x2="500" y2="10" className="line" />
        <text x="285" y="32">
          f(x)=6x
        </text>
      </svg>
      <p>
        Every curve in the family has the same derivative.
        <br />
        <b>d/dx [F(x)+C]=f(x)=6x</b>
      </p>
    </section>
  );
}
