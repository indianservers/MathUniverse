import {
  AlertTriangle,
  ArrowRight,
  Check,
  Eye,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./DerivativeFirstPrinciplesTargetLesson286.css";

type Quadratic = { label: string; a: number; b: number; c: number };
const functions: Quadratic[] = [
  { label: "2x² + 2x", a: 2, b: 2, c: 0 },
  { label: "x²", a: 1, b: 0, c: 0 },
  { label: "x² + 3x + 1", a: 1, b: 3, c: 1 },
];
const tidy = (value: number, places = 4) =>
  Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(places));
const signed = (value: number) => `${value < 0 ? "−" : "+"} ${Math.abs(value)}`;
const derivativeText = ({ a, b }: Quadratic, x?: number) =>
  x === undefined
    ? `${2 * a}x ${signed(b)}`
    : `${2 * a}(${x}) ${signed(b)} = ${tidy(2 * a * x + b)}`;

export default function DerivativeFirstPrinciplesTargetLesson286({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [functionIndex, setFunctionIndex] = useState(0);
  const [x, setX] = useState(0);
  const [h, setH] = useState(0.25);
  const [tab, setTab] = useState("Interaction + visualization");
  const [answer, setAnswer] = useState("2x + 5");
  const [result, setResult] = useState<"correct" | "incorrect" | "">("correct");
  const [practiceRound, setPracticeRound] = useState(0);
  const [actions, setActions] = useState(0);
  const fn = functions[functionIndex];
  const f = (value: number) => fn.a * value * value + fn.b * value + fn.c;
  const quotient = (f(x + h) - f(x)) / h;
  const derivative = 2 * fn.a * x + fn.b;
  const reset = () => {
    setFunctionIndex(0);
    setX(0);
    setH(0.25);
    setTab("Interaction + visualization");
    setAnswer("2x + 5");
    setResult("correct");
    setPracticeRound(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeH = (value: number) =>
    act(() => setH(Math.max(0.01, Math.min(1, tidy(value, 3)))));
  const checkAnswer = () => {
    const normalized = answer
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/\*/g, "");
    const accepted =
      practiceRound === 0
        ? ["2x+5", "5+2x"].includes(normalized)
        : ["6x-4", "-4+6x"].includes(normalized);
    act(() => setResult(accepted ? "correct" : "incorrect"));
  };
  return (
    <section
      className="dfp286-page"
      data-testid="calculus-mockup-0365"
      data-dedicated-lesson="286"
      data-object-model="selectable-quadratic-base-point-h-secant-difference-quotient-symbolic-limit-practice"
      data-function={fn.label}
      data-x={x}
      data-h={h}
      data-quotient={tidy(quotient)}
      data-derivative={tidy(derivative)}
      data-result={result}
      data-actions={actions}
    >
      <header className="dfp286-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Derivative from First Principles</h1>
        <p>Visualise the derivative limit.</p>
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
                  `f=${fn.label}, x=${x}, h=${h}, quotient=${tidy(quotient)}`,
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
      <nav className="dfp286-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
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
      <section className="dfp286-flow">
        {[
          [
            Eye,
            "Observe",
            "Point P(x, f(x)) and Pₕ(x+h, f(x+h)) form a secant line.",
          ],
          [
            SlidersHorizontal,
            "Manipulate",
            "Move x and shrink h → 0. Watch the secant become a tangent.",
          ],
          [
            Lightbulb,
            "Notice",
            "The difference quotient approaches a fixed value.",
          ],
          [
            GraduationCap,
            "Understand",
            "That limit is the derivative f′(x), the slope of the tangent line.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            {index < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="dfp286-lab">
        <main>
          <h3>Explore the difference quotient</h3>
          <div className="controls">
            <label>
              f(x) ={" "}
              <select
                aria-label="Function"
                value={functionIndex}
                onChange={(event) =>
                  act(() => setFunctionIndex(Number(event.target.value)))
                }
              >
                {functions.map((item, index) => (
                  <option value={index} key={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              x ={" "}
              <select
                aria-label="Base x"
                value={x}
                onChange={(event) =>
                  act(() => setX(Number(event.target.value)))
                }
              >
                {[-2, -1, 0, 1, 2].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              h = {h.toFixed(4)}{" "}
              <input
                aria-label="Difference h"
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={h}
                onChange={(event) => changeH(Number(event.target.value))}
              />
              <output>{Math.max(0.01, h + 0.1).toFixed(4)}</output>
            </label>
          </div>
          <div className="graph-wrap">
            <FirstPrinciplesGraph fn={fn} x={x} h={h} onH={changeH} />
            <div className="legend">
              <p>━ f(x) = {fn.label}</p>
              <p>
                <i /> P (x, f(x))
              </p>
              <p>
                <i /> Pₕ (x+h, f(x+h))
              </p>
              <p>-- Secant PPₕ</p>
              <p>━ Tangent at P</p>
            </div>
            <div className="zoom">
              <button>+</button>
              <button>−</button>
              <button>⛶</button>
            </div>
          </div>
          <section className="algebra">
            <article>
              <h3>
                Algebraic simplification <small>(worked symbolically)</small>
              </h3>
              <div className="step">
                <span>[f(x+h) − f(x)] / h</span>
                <ArrowRight />
                <span>
                  [{fn.a}(x+h)² {signed(fn.b)}(x+h) − ({fn.a}x² {signed(fn.b)}
                  x)] / h
                </span>
              </div>
              <div className="step">
                <span>
                  [{2 * fn.a}xh + {fn.a}h² {signed(fn.b)}h] / h
                </span>
              </div>
              <div className="step">
                <span>
                  [{2 * fn.a}xh + {fn.a}h² {signed(fn.b)}h] / h
                </span>
                <ArrowRight />
                <span>
                  {2 * fn.a}x {signed(fn.a)}h {signed(fn.b)}
                </span>
                <ArrowRight />
                <span>
                  lim h→0 ({2 * fn.a}x {signed(fn.a)}h {signed(fn.b)})
                </span>
              </div>
            </article>
            <aside>
              <h3>
                General rule <small>(Result)</small>
              </h3>
              <p>If f(x) = ax² + bx + c,</p>
              <strong>then f′(x) = 2ax + b.</strong>
              <b>Check at x = {x}:</b>
              <p>
                f′({x}) = {derivativeText(fn, x)}
              </p>
              <footer>
                <Check /> Matches the limit result.
              </footer>
            </aside>
          </section>
        </main>
        <aside className="results">
          <article>
            <h3>Difference quotient</h3>
            <strong>f′(x) = lim h→0 [f(x+h)−f(x)] / h</strong>
          </article>
          <article>
            <h3>Current (h = {h.toFixed(4)})</h3>
            <strong>
              [f({tidy(x + h)})−f({x})] / {h} = [{tidy(f(x + h))}−{tidy(f(x))}]
              / {h} = {tidy(quotient, 5)}
            </strong>
            <b>
              <Check /> Correct
            </b>
          </article>
          <article>
            <h3>As h → 0</h3>
            <strong>lim h→0 [f(x+h)−f(x)] / h = {tidy(derivative)}</strong>
          </article>
          <article className="derivative">
            <h3>Derivative at x = {x}</h3>
            <strong>
              f′({x}) = {tidy(derivative)}
            </strong>
            <p>Slope of the tangent line = {tidy(derivative)}</p>
          </article>
          <article className="mistake">
            <h3>
              <AlertTriangle /> Common misconception
            </h3>
            <b>Do not cancel h too early.</b>
            <strong>[f(x+h)−f(x)] / h ≠ f′(x+h)−f′(x)</strong>
            <p>Simplify first, then take the limit.</p>
          </article>
          <article className="takeaway">
            <h3>
              <Star /> Key takeaway
            </h3>
            <p>
              The derivative is the <b>limit of the average rate of change</b>{" "}
              as h → 0.
            </p>
            <p>
              It equals the <b>instantaneous rate of change</b> — the slope of
              the tangent line.
            </p>
          </article>
        </aside>
      </section>
      <section className="dfp286-bottom">
        <article className="worked">
          <h3>
            Worked example <small>(complete)</small>
          </h3>
          <p>Find y′(x) for y = 3x³ − 4x² + x.</p>
          {[
            "f(x+h) = 3(x+h)³ − 4(x+h)² + (x+h)",
            "f(x+h) − f(x) = 9x²h + 9xh² + 3h³ − 8xh − 4h² + h",
            "[f(x+h) − f(x)]/h = 9x² + 9xh + 3h² − 8x − 4h + 1",
            "y′(x) = lim h→0 (...) = 9x² − 8x + 1",
          ].map((text, index) => (
            <p key={text}>
              <i>{index + 1}</i>
              {text}
            </p>
          ))}
          <footer>Answer: &nbsp; y′ = 9x² − 8x + 1</footer>
        </article>
        <article className="practice">
          <h3>Quick practice</h3>
          <p>
            Using first principles, find y′(x) for y ={" "}
            {practiceRound ? "3x² − 4x" : "x² + 5x"}.
          </p>
          <label>
            y′(x) ={" "}
            <input
              aria-label="Practice derivative"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setResult("");
              }}
            />
            <button onClick={checkAnswer}>Check</button>
          </label>
          <p>
            <b>Hint</b> &nbsp; Expand (x+h)², simplify, then take lim h→0.
          </p>
          <div className={result}>
            <b>
              {result === "incorrect"
                ? "Try the simplification again."
                : "Solution"}
            </b>
            <p>
              {result === "incorrect"
                ? "Keep every h-term until after dividing by h."
                : practiceRound
                  ? "[f(x+h)−f(x)]/h = 6x + 3h − 4  ⇒  y′(x)=6x−4"
                  : "[f(x+h)−f(x)]/h = 2x + h + 5  ⇒  y′(x)=2x+5"}
            </p>
            {result === "correct" && (
              <footer>
                <Check /> Correct! Well done.{" "}
                <button
                  onClick={() =>
                    act(() => {
                      setPracticeRound((value) => 1 - value);
                      setAnswer("");
                      setResult("");
                    })
                  }
                >
                  Try another
                </button>
              </footer>
            )}
          </div>
        </article>
      </section>
      <nav className="dfp286-adjacent">
        <a href="/lessons/calculus/285-instantaneous-rate-of-change">
          <ArrowRight />
          <span>
            <small>PREVIOUS</small>Instantaneous Rate of Change
          </span>
        </a>
        <a href="/lessons/calculus/287-tangent-line">
          <span>
            <small>NEXT</small>Tangent Line
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="dfp286-footer">
        <main>
          <b>⚒ Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </main>
        <nav>
          <a href="/sitemap">▣ Sitemap</a>
          <a href="/docs">♡ Docs</a>
          <a href="/about">✉ About</a>
        </nav>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHTS TO REPRODUCE IT.
          <br />
          www.IndianServers.com &nbsp; info@IndianServers.com
        </small>
      </footer>
    </section>
  );
}

function FirstPrinciplesGraph({
  fn,
  x,
  h,
  onH,
}: {
  fn: Quadratic;
  x: number;
  h: number;
  onH: (value: number) => void;
}) {
  const w = 520,
    hg = 410,
    sx = (value: number) => 250 + value * 58,
    sy = (value: number) => 330 - value * 27;
  const f = (value: number) => fn.a * value * value + fn.b * value + fn.c;
  const slope = 2 * fn.a * x + fn.b,
    secant = (f(x + h) - f(x)) / h;
  const path = Array.from({ length: 181 }, (_, index) => {
    const value = -4 + index / 20;
    return `${index ? "L" : "M"}${sx(value)} ${sy(f(value))}`;
  }).join(" ");
  const line = (m: number, start: number, end: number) => ({
    x1: sx(start),
    y1: sy(f(x) + m * (start - x)),
    x2: sx(end),
    y2: sy(f(x) + m * (end - x)),
  });
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1 && event.type === "pointermove") return;
    if (event.type === "pointerdown")
      event.currentTarget.setPointerCapture(event.pointerId);
    const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!box) return;
    const graphX = (((event.clientX - box.left) / box.width) * w - 250) / 58;
    onH(graphX - x);
  };
  return (
    <svg
      viewBox={`0 0 ${w} ${hg}`}
      role="img"
      aria-label="Quadratic with draggable secant point and tangent"
    >
      <defs>
        <pattern
          id="dfp-grid"
          width="58"
          height="54"
          patternUnits="userSpaceOnUse"
        >
          <path d="M58 0H0V54" fill="none" stroke="#edf1f6" />
        </pattern>
      </defs>
      <rect width={w} height={hg} fill="url(#dfp-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={hg} />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((value) => (
        <text
          className="tick"
          x={sx(value) - 4}
          y={sy(0) + 17}
          key={`x${value}`}
        >
          {value}
        </text>
      ))}
      {[-4, -2, 2, 4, 6, 8, 10].map((value) => (
        <text
          className="tick"
          x={sx(0) - 23}
          y={sy(value) + 4}
          key={`y${value}`}
        >
          {value}
        </text>
      ))}
      <path className="curve" d={path} />
      <line className="tangent" {...line(slope, -2.1, 4.2)} />
      <line className="secant" {...line(secant, -1.1, 1.2)} />
      <circle className="base" cx={sx(x)} cy={sy(f(x))} r="7" />
      <circle
        data-drag="point-ph"
        cx={sx(x + h)}
        cy={sy(f(x + h))}
        r="7"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text className="point-label" x={sx(x) - 53} y={sy(f(x)) - 16}>
        P ({x}, {tidy(f(x))})
      </text>
      <text className="point-label ph" x={sx(x + h) + 10} y={sy(f(x + h)) - 10}>
        Pₕ ({tidy(x + h)}, {tidy(f(x + h))})
      </text>
    </svg>
  );
}
