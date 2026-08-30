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
  Trophy,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./InstantaneousRateTargetLesson285.css";

const fmt = (value: number, places = 5) => Number(value.toFixed(places));
const samples = [0.5, 0.1, 0.05, 0.01, 0.001, 0.0001];
export default function InstantaneousRateTargetLesson285({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [h, setH] = useState(0.05),
    [tab, setTab] = useState("Interaction + Visualization"),
    [feedback, setFeedback] = useState(true),
    [choice, setChoice] = useState("10"),
    [result, setResult] = useState<"" | "correct" | "incorrect">("correct"),
    [actions, setActions] = useState(0);
  const xB = 1 + h,
    yB = xB * xB,
    slope = 2 + h;
  const reset = () => {
    setH(0.05);
    setTab("Interaction + Visualization");
    setFeedback(true);
    setChoice("10");
    setResult("correct");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeH = (value: number) =>
    act(() => setH(Math.max(0.0001, Math.min(5, Number(value.toFixed(4))))));
  return (
    <section
      className="irc285-page"
      data-testid="calculus-mockup-0364"
      data-dedicated-lesson="285"
      data-object-model="quadratic-fixed-base-movable-secant-h-limit-tangent-convergence-practice"
      data-h={h}
      data-x-b={fmt(xB, 4)}
      data-y-b={fmt(yB, 5)}
      data-secant-slope={fmt(slope, 5)}
      data-error={fmt(Math.abs(slope - 2), 5)}
      data-feedback={feedback}
      data-choice={choice}
      data-result={result}
      data-actions={actions}
    >
      <span className="sr-only">Instantaneous rate of change</span>
      <header className="irc285-hero">
        <main>
          <span>
            <b>CALCULUS</b>
            <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
          </span>
          <h1>Instantaneous Rate of Change</h1>
          <p>Transition to tangent slope.</p>
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
                    `h=${h}, B=(${fmt(xB, 4)},${fmt(yB, 5)}), m_sec=${fmt(slope, 5)}`,
                  ),
                )
              }
            >
              <Share2 />
              Share
            </button>
            <a href="/workspace/calculus">↗ Workspace</a>
          </div>
        </main>
        <aside>
          <h3>What you'll learn</h3>
          <p>▣ How a secant line's slope approaches the tangent slope</p>
          <p>▣ The limit that defines the derivative at a point</p>
          <p>◉ Interpreting instantaneous rate of change</p>
          <p>▣ Connecting graph, table, and limit</p>
        </aside>
      </header>
      <nav className="irc285-tabs">
        {[
          "Interaction + Visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Common Mistakes",
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
      <section className="irc285-flow">
        {[
          [
            Eye,
            "Observe",
            "Watch the secant line approach the tangent as h → 0.",
          ],
          [
            Hand,
            "Manipulate",
            "Drag the move point or adjust h to change the secant.",
          ],
          [
            Lightbulb,
            "Notice",
            "The secant slope values converge to a single limit.",
          ],
          [
            Target,
            "Understand",
            "That limit is the instantaneous rate of change at x.",
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
      <section className="irc285-model">
        <header>
          <h3>
            Function &nbsp; <i>f(x) = x²</i>
          </h3>
          <span>Interactive</span>
          <label>
            <input
              type="checkbox"
              checked={feedback}
              onChange={() => act(() => setFeedback((value) => !value))}
            />
            Feedback on
          </label>
        </header>
        <div className="workspace">
          <div className="graph">
            <InstantGraph h={h} onH={changeH} />
            <div className="legend">
              <p>━ f(x)=x²</p>
              <p>-- Secant line</p>
              <p>━ Tangent line</p>
            </div>
            <output>
              Base point: <b>A(1,1)</b> on f(x)=x².
            </output>
          </div>
          <aside>
            <article className="h-control">
              <h2>Move point B or adjust h</h2>
              <label>
                h (change in x)
                <input
                  aria-label="Change in x h"
                  type="range"
                  min=".0001"
                  max="5"
                  step=".0001"
                  value={h}
                  onChange={(event) => changeH(Number(event.target.value))}
                />
                <small>
                  <span>0</span>
                  <span>5</span>
                </small>
              </label>
              <p>
                x<sub>B</sub> = 1+h <b>{fmt(xB, 4)}</b>
              </p>
              <strong>
                Point B = ({fmt(xB, 4)}, {fmt(yB, 5)})
              </strong>
            </article>
            <article className="slope">
              <h2>Slope of secant line AB</h2>
              <output>
                m<sub>sec</sub> = [f(1+h)−f(1)]/h <b>{fmt(slope, 5)}</b>
              </output>
              <p>
                As h → 0, m<sub>sec</sub> → 2
              </p>
              <p>
                This is the <b>instantaneous rate of change</b> at x=1.
              </p>
            </article>
            <article className="table">
              <h2>Convergence table</h2>
              <table>
                <thead>
                  <tr>
                    <th>h</th>
                    <th>
                      x<sub>B</sub>=1+h
                    </th>
                    <th>
                      m<sub>sec</sub>
                    </th>
                    <th>
                      |m<sub>sec</sub>−2|
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map((value) => (
                    <tr
                      key={value}
                      className={Math.abs(value - h) < 1e-6 ? "selected" : ""}
                    >
                      <td>{value}</td>
                      <td>{fmt(1 + value, 4)}</td>
                      <td>{(2 + value).toFixed(5)}</td>
                      <td>{value.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {feedback && <p>✓ Great! The slope is approaching 2.</p>}
            </article>
          </aside>
        </div>
      </section>
      <section className="irc285-learning">
        <article>
          <h3>✦ Derivative (Limit Definition)</h3>
          <output>f′(x)=lim h→0 [f(x+h)−f(x)]/h</output>
          <p>For f(x)=x², f′(x)=2x ⇒ f′(1)=2</p>
          <b>
            Interpretation: Instantaneous rate of change of f at x=1 is 2 units
            of y per unit of x.
          </b>
        </article>
        <article>
          <h3>
            <Check /> One Correct Example
          </h3>
          <p>Find the instantaneous rate of change of f(x)=3x² at x=2.</p>
          <b>Solution:</b>
          <output>
            f′(x)=6x
            <br />
            f′(2)=6(2)=12
          </output>
          <p>
            <b>Meaning:</b> At x=2, f(x) is changing at 12 units of y per unit
            of x.
          </p>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common Misconception
          </h3>
          <p>Thinking f′(1) = [f(1.01)−f(1)]/0.01 exactly.</p>
          <b>Not true:</b>
          <p>That's a secant slope with h=0.01, not the limit as h→0.</p>
          <b>Why it matters:</b>
          <p>Only the limit gives the true instantaneous rate.</p>
        </article>
      </section>
      <section className="irc285-practice">
        <header>Practice</header>
        <main>
          <p>Find the instantaneous rate of change of f(x)=x³−2x at x=2.</p>
          {["7", "10", "12", "14"].map((value, index) => (
            <label key={value} className={choice === value ? "selected" : ""}>
              <input
                type="radio"
                name="irc-answer"
                checked={choice === value}
                onChange={() => {
                  setChoice(value);
                  setResult("");
                }}
              />
              {String.fromCharCode(65 + index)}. {value}
              {choice === value && result === "correct" && <Check />}
            </label>
          ))}
        </main>
        <article className={result}>
          <h3>Solution:</h3>
          <p>
            f′(x)=3x²−2
            <br />
            f′(2)=3(2²)−2=10
          </p>
          <b>Answer: B. 10</b>
          <button
            onClick={() =>
              act(() => setResult(choice === "10" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
        </article>
        <aside>
          <Trophy />
          <h2>
            {result === "correct" ? "Great work!" : "Check the derivative"}
          </h2>
        </aside>
      </section>
    </section>
  );
}

function InstantGraph({ h, onH }: { h: number; onH: (value: number) => void }) {
  const w = 500,
    hg = 500,
    sx = (x: number) => 230 + x * 47,
    sy = (y: number) => 345 - y * 12,
    path = Array.from({ length: 231 }, (_, i) => {
      const x = -4.7 + i * 0.04;
      return `${i ? "L" : "M"}${sx(x)} ${sy(x * x)}`;
    }).join(" "),
    xB = 1 + h,
    yB = xB * xB,
    slope = 2 + h,
    secY = (x: number) => 1 + slope * (x - 1),
    drag = (event: ReactPointerEvent<SVGCircleElement>) => {
      if (event.buttons !== 1 && event.type === "pointermove") return;
      if (event.type === "pointerdown")
        event.currentTarget.setPointerCapture(event.pointerId);
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const x = (((event.clientX - box.left) / box.width) * w - 230) / 47;
      onH(Math.max(0.0001, x - 1));
    };
  return (
    <svg
      viewBox={`0 0 ${w} ${hg}`}
      role="img"
      aria-label="Quadratic graph with draggable secant point approaching the tangent"
    >
      <defs>
        <pattern
          id="irc-grid"
          width="47"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M47 0H0V40" fill="none" stroke="#edf0f5" />
        </pattern>
      </defs>
      <rect width={w} height={hg} fill="url(#irc-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={hg} />
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((value) => (
        <g className="tick" key={`x-${value}`}>
          <line x1={sx(value)} y1={sy(0) - 4} x2={sx(value)} y2={sy(0) + 4} />
          <text x={sx(value) - 4} y={sy(0) + 18}>{value}</text>
        </g>
      ))}
      {[-10, -5, 5, 10, 15, 20, 25].map((value) => (
        <g className="tick" key={`y-${value}`}>
          <line x1={sx(0) - 4} y1={sy(value)} x2={sx(0) + 4} y2={sy(value)} />
          <text x={sx(0) - 28} y={sy(value) + 4}>{value}</text>
        </g>
      ))}
      <path className="curve" d={path} />
      <line className="tangent" x1={sx(-1)} y1={sy(-3)} x2={sx(4)} y2={sy(7)} />
      <line
        className="secant"
        x1={sx(-1)}
        y1={sy(secY(-1))}
        x2={sx(4)}
        y2={sy(secY(4))}
      />
      <circle className="base" cx={sx(1)} cy={sy(1)} r="8" />
      <circle
        data-drag="point-b"
        cx={sx(xB)}
        cy={sy(yB)}
        r="8"
        onPointerDown={drag}
        onPointerMove={drag}
      />
      <text x={sx(1) - 35} y={sy(1) - 15}>
        A (1,1)
      </text>
      <text x={sx(xB) + 10} y={sy(yB) - 12}>
        B ({fmt(xB, 3)}, {fmt(yB, 4)})
      </text>
      <text className="tangent-label" x={sx(2.5)} y={sy(5.2)}>
        Tangent slope = 2
      </text>
    </svg>
  );
}
