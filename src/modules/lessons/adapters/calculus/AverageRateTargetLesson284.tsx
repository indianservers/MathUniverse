import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
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
import "./AverageRateTargetLesson284.css";

const f = (x: number) => 0.3 * x * x + 0.5 * x + 0.8;
const fixed = (value: number, places = 3) => Number(value.toFixed(places));

export default function AverageRateTargetLesson284({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [xA, setXA] = useState(-3),
    [xB, setXB] = useState(2),
    [tab, setTab] = useState("Interaction + visualization"),
    [actions, setActions] = useState(0),
    [practice, setPractice] = useState("0.500"),
    [practiceResult, setPracticeResult] = useState<
      "" | "correct" | "incorrect"
    >("correct");
  const yA = f(xA),
    yB = f(xB),
    rise = yB - yA,
    run = xB - xA,
    rate = Math.abs(run) < 0.01 ? Number.NaN : rise / run;
  const reset = () => {
    setXA(-3);
    setXB(2);
    setTab("Interaction + visualization");
    setActions(0);
    setPractice("0.500");
    setPracticeResult("correct");
  };
  useEffect(reset, [resetToken]);
  const act = (runAction: () => void) => {
    runAction();
    setActions((value) => value + 1);
    onInteraction();
  };
  const movePoint = (point: "a" | "b", value: number) =>
    act(() =>
      point === "a"
        ? setXA(fixed(Math.min(value, xB - 0.25), 2))
        : setXB(fixed(Math.max(value, xA + 0.25), 2)),
    );
  return (
    <section
      className="arc284-page"
      data-testid="calculus-mockup-0363"
      data-dedicated-lesson="284"
      data-object-model="quadratic-two-draggable-secants-linked-rise-run-rate-independent-practice"
      data-x-a={xA}
      data-x-b={xB}
      data-y-a={fixed(yA)}
      data-y-b={fixed(yB)}
      data-rise={fixed(rise)}
      data-run={fixed(run)}
      data-rate={Number.isFinite(rate) ? fixed(rate) : "undefined"}
      data-practice={practice}
      data-practice-result={practiceResult}
      data-actions={actions}
    >
      <span className="sr-only">Average rate of change</span>
      <header className="arc284-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Average Rate of Change</h1>
        <p>Understand secant slope.</p>
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
                  `A=(${xA},${fixed(yA)}), B=(${xB},${fixed(yB)}), average rate=${fixed(rate)}`,
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
      <nav className="arc284-tabs">
        {[
          "Interaction + visualization",
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
      <section className="arc284-lab">
        <header>
          <div>
            <b>INTERACTION · VISUALISATION</b>
            <h2>Explore the secant slope</h2>
            <p>
              Drag the two points on the curve to see how average rate of change
              updates in real time.
            </p>
          </div>
          <strong>
            <Check />
            Ready
          </strong>
          <span>{actions} actions</span>
          <button
            title="Full screen"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            <Maximize2 />
          </button>
        </header>
        <div className="arc284-work">
          <div className="graph">
            <SecantGraph xA={xA} xB={xB} onMove={movePoint} />
            <div className="formula">
              <output>f(x) = 0.3x² + 0.5x + 0.8</output>
              <p>Domain: ℝ &nbsp; Range: [{fixed(f(-5 / 6))}, ∞)</p>
            </div>
            <div className="legend">
              <span>Drag points A and B along the curve.</span>
              <b>━ Secant AB</b>
              <b>-- Rise</b>
              <b>-- Run</b>
            </div>
          </div>
          <aside>
            <article>
              <h3>Average rate of change</h3>
              <p>Between the selected points on the curve.</p>
              <output>
                f′(x̄) = <b>Δy / Δx</b> = rise / run
              </output>
              <div>
                <p>
                  Δy = f({xB}) − f({xA}) <strong>{fixed(rise)}</strong>
                </p>
                <p>
                  Δx = {xB} − ({xA}) <strong>{fixed(run)}</strong>
                </p>
                <b>
                  Average rate ={" "}
                  <span>
                    {fixed(rise)} / {fixed(run)}
                  </span>{" "}
                  = {Number.isFinite(rate) ? fixed(rate) : "undefined"}
                </b>
              </div>
            </article>
            <article className="controls">
              <h3>Linked controls</h3>
              <label>
                x<sub>A</sub>
                <input
                  aria-label="Point A x-coordinate"
                  type="range"
                  min="-6"
                  max="6"
                  step=".05"
                  value={xA}
                  onChange={(event) =>
                    movePoint("a", Number(event.target.value))
                  }
                />
                <output>{xA.toFixed(2)}</output>
              </label>
              <label>
                x<sub>B</sub>
                <input
                  aria-label="Point B x-coordinate"
                  type="range"
                  min="-6"
                  max="6"
                  step=".05"
                  value={xB}
                  onChange={(event) =>
                    movePoint("b", Number(event.target.value))
                  }
                />
                <output>{xB.toFixed(2)}</output>
              </label>
              <p>
                Move points inside the domain. For this function, any real
                numbers work.
              </p>
            </article>
          </aside>
        </div>
      </section>
      <section className="arc284-flow">
        {[
          [
            Eye,
            "Observe",
            "The secant line connects two points on the curve. Its slope is the average rate of change.",
          ],
          [
            Hand,
            "Manipulate",
            "Drag points A and B. Change the horizontal separation (run) to see the slope update.",
          ],
          [
            Lightbulb,
            "Notice",
            "As the points move closer, the secant slope approaches the tangent slope at a point.",
          ],
          [
            Target,
            "Understand",
            "Average rate of change measures how much f(x) changes per unit change in x over an interval.",
          ],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
            <MiniSecant mode={index} />
            {index < 3 && <ArrowRight />}
          </article>
        ))}
      </section>
      <section className="arc284-learning">
        <article>
          <h3>Key Rule</h3>
          <p>For a function f and two inputs a and b with a ≠ b:</p>
          <output>
            Average Rate of Change on [a,b] is
            <br />
            <b>(f(b)−f(a))/(b−a)</b>
          </output>
          <p>
            This is the slope of the secant line through (a,f(a)) and (b,f(b)).
          </p>
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>Find the average rate of change of g(x)=1+x²/4 on [−2,4].</p>
          <p>g(−2)=2 &nbsp; g(4)=5</p>
          <output>
            <b>Average rate = (5−2)/(4−(−2)) = 3/6 = 0.500</b>
          </output>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common Misconception
          </h3>
          <b>Thinking average rate of change is just f(b)−f(a).</b>
          <p>
            That is change in y, not the rate. You must divide by the change in
            x.
          </p>
          <output>Correct rate: Δy/Δx = (f(b)−f(a))/(b−a) ✓</output>
        </article>
      </section>
      <section className="arc284-practice">
        <div>
          <h3>Quick Practice Challenge</h3>
          <p>Compute the average rate of change for g(x)=1+x²/4 on [−1,3].</p>
          <div>
            {["0.250", "0.400", "0.500", "0.800"].map((value, index) => (
              <label
                key={value}
                className={practice === value ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="arc-answer"
                  checked={practice === value}
                  onChange={() => {
                    setPractice(value);
                    setPracticeResult("");
                  }}
                />
                {String.fromCharCode(65 + index)} {value}
              </label>
            ))}
          </div>
        </div>
        <article>
          <h3>Solution</h3>
          <p>g(−1)=1.25 &nbsp; g(3)=3.25</p>
          <output>
            Average rate = (3.25−1.25)/(3−(−1)) = 2/4 = <b>0.500</b>
          </output>
        </article>
        <aside className={practiceResult}>
          <b>
            {practiceResult === "correct"
              ? "✓ Correct!"
              : practiceResult === "incorrect"
                ? "Try again"
                : "Check your answer"}
          </b>
          <p>The secant slope over [−1,3] is 0.500.</p>
          <button
            onClick={() =>
              act(() =>
                setPracticeResult(
                  practice === "0.500" ? "correct" : "incorrect",
                ),
              )
            }
          >
            Check
          </button>
        </aside>
      </section>
      <nav className="arc284-nav">
        <a href="/lessons/calculus/283-epsilondelta-visualiser">
          <ArrowLeft />
          <span>
            <small>Previous</small>Epsilon-Delta Visualiser
          </span>
        </a>
        <a href="/lessons/calculus/285-instantaneous-rate-of-change">
          <span>
            <small>Next</small>Instantaneous Rate of Change
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function SecantGraph({
  xA,
  xB,
  onMove,
}: {
  xA: number;
  xB: number;
  onMove: (point: "a" | "b", value: number) => void;
}) {
  const w = 600,
    h = 420,
    sx = (x: number) => w / 2 + x * 42,
    sy = (y: number) => h - 55 - y * 54,
    path = Array.from({ length: 241 }, (_, i) => {
      const x = -6 + i * 0.05;
      return `${i ? "L" : "M"}${sx(x)} ${sy(f(x))}`;
    }).join(" "),
    drag =
      (point: "a" | "b") => (event: ReactPointerEvent<SVGCircleElement>) => {
        if (event.buttons !== 1 && event.type === "pointermove") return;
        if (event.type === "pointerdown")
          event.currentTarget.setPointerCapture(event.pointerId);
        const box =
          event.currentTarget.ownerSVGElement?.getBoundingClientRect();
        if (!box) return;
        onMove(
          point,
          (((event.clientX - box.left) / box.width) * w - w / 2) / 42,
        );
      };
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Parabola with draggable secant points A and B"
    >
      <defs>
        <pattern
          id="arc-grid"
          width="42"
          height="54"
          patternUnits="userSpaceOnUse"
        >
          <path d="M42 0H0V54" fill="none" stroke="#e9edf3" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#arc-grid)" />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      <path className="curve" d={path} />
      <line
        className="secant"
        x1={sx(xA)}
        y1={sy(f(xA))}
        x2={sx(xB)}
        y2={sy(f(xB))}
      />
      <line
        className="rise"
        x1={sx(xB)}
        y1={sy(f(xA))}
        x2={sx(xB)}
        y2={sy(f(xB))}
      />
      <line
        className="run"
        x1={sx(xA)}
        y1={sy(f(xA))}
        x2={sx(xB)}
        y2={sy(f(xA))}
      />
      <circle
        data-drag="point-a"
        cx={sx(xA)}
        cy={sy(f(xA))}
        r="8"
        onPointerDown={drag("a")}
        onPointerMove={drag("a")}
      />
      <circle
        data-drag="point-b"
        cx={sx(xB)}
        cy={sy(f(xB))}
        r="8"
        onPointerDown={drag("b")}
        onPointerMove={drag("b")}
      />
      <text x={sx(xA) - 10} y={sy(f(xA)) - 15}>
        A ({xA}, {fixed(f(xA))})
      </text>
      <text x={sx(xB) + 10} y={sy(f(xB)) - 12}>
        B ({xB}, {fixed(f(xB))})
      </text>
      <text
        className="rise-text"
        x={sx(xB) + 9}
        y={(sy(f(xA)) + sy(f(xB))) / 2}
      >
        rise = {fixed(f(xB) - f(xA))}
      </text>
      <text
        className="run-text"
        x={(sx(xA) + sx(xB)) / 2 - 20}
        y={sy(f(xA)) + 20}
      >
        run = {fixed(xB - xA)}
      </text>
    </svg>
  );
}
function MiniSecant({ mode }: { mode: number }) {
  return (
    <svg viewBox="0 0 140 70">
      <path
        d="M12 12 Q70 110 128 12"
        fill="none"
        stroke="#3488ee"
        strokeWidth="2"
      />
      <line
        x1={mode === 2 ? 52 : 35}
        y1={mode === 2 ? 53 : 48}
        x2={mode === 2 ? 92 : 110}
        y2={mode === 2 ? 42 : 30}
        stroke="#783de0"
        strokeWidth="2"
      />
      <circle
        cx={mode === 2 ? 52 : 35}
        cy={mode === 2 ? 53 : 48}
        r="3"
        fill="#783de0"
      />
      <circle
        cx={mode === 2 ? 92 : 110}
        cy={mode === 2 ? 42 : 30}
        r="3"
        fill="#783de0"
      />
    </svg>
  );
}
