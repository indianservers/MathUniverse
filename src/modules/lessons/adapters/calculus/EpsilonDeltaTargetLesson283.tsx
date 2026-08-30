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
  Search,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./EpsilonDeltaTargetLesson283.css";

const round = (value: number) => Number(value.toFixed(2));
export default function EpsilonDeltaTargetLesson283({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [epsilon, setEpsilon] = useState(2),
    [delta, setDelta] = useState(1),
    [a, setA] = useState(1),
    [tab, setTab] = useState("Interaction + visualization"),
    [actions, setActions] = useState(0),
    [practiceEpsilon, setPracticeEpsilon] = useState(1.6),
    [practiceDelta, setPracticeDelta] = useState(0.8);
  const L = 2 * a,
    pass = 2 * delta <= epsilon + 1e-9,
    practicePass = 2 * practiceDelta <= practiceEpsilon + 1e-9;
  const reset = () => {
    setEpsilon(2);
    setDelta(1);
    setA(1);
    setTab("Interaction + visualization");
    setActions(0);
    setPracticeEpsilon(1.6);
    setPracticeDelta(0.8);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const setBand = (kind: "epsilon" | "delta" | "a", value: number) =>
    act(() =>
      kind === "epsilon"
        ? setEpsilon(round(value))
        : kind === "delta"
          ? setDelta(round(value))
          : setA(round(value)),
    );
  return (
    <section
      className="ed283-page"
      data-testid="calculus-mockup-0362"
      data-dedicated-lesson="283"
      data-object-model="linear-epsilon-delta-linked-input-output-bands-draggable-handles-proof-practice"
      data-epsilon={epsilon}
      data-delta={delta}
      data-a={a}
      data-limit={L}
      data-pass={pass}
      data-practice-epsilon={practiceEpsilon}
      data-practice-delta={practiceDelta}
      data-practice-pass={practicePass}
      data-actions={actions}
    >
      <span className="sr-only">Epsilon-delta visualiser</span>
      <header className="ed283-hero">
        <span>
          <b>CALCULUS</b>
          <b>LIMITS AND DIFFERENTIAL CALCULUS</b>
        </span>
        <h1>Epsilon–Delta Visualiser</h1>
        <p>Develop formal limit intuition.</p>
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
                  `epsilon=${epsilon}, delta=${delta}, a=${a}, pass=${pass}`,
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
      <nav className="ed283-tabs">
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
      <section className="ed283-lab">
        <header>
          <div>
            <b>INTERACTION · VISUALISATION</b>
            <h2>Work directly on the model</h2>
          </div>
          <strong className={pass ? "pass" : "fail"}>
            {pass ? "PASS" : "FAIL"} <Check />
          </strong>
          <span>{actions} actions</span>
          <button
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
            title="Full screen"
          >
            <Maximize2 />
          </button>
        </header>
        <div className="ed283-model">
          <h3>
            Epsilon–Delta Visualiser - graph + CAS <output>f′(x) = 2</output>
          </h3>
          <div className="ed283-work">
            <EpsilonGraph
              epsilon={epsilon}
              delta={delta}
              a={a}
              setBand={setBand}
            />
            <aside>
              <BandControl
                label="Adjust ε (output band)"
                symbol="ε"
                value={epsilon}
                min={0.1}
                max={10}
                step={0.1}
                color="purple"
                onChange={(value) => setBand("epsilon", value)}
              />
              <BandControl
                label="Adjust δ (input interval)"
                symbol="δ"
                value={delta}
                min={0.01}
                max={5}
                step={0.01}
                color="orange"
                onChange={(value) => setBand("delta", value)}
              />
              <BandControl
                label="Delta interval around a"
                symbol="a"
                value={a}
                min={-5}
                max={5}
                step={0.1}
                color="blue"
                onChange={(value) => setBand("a", value)}
              />
            </aside>
          </div>
          <p className="condition">
            We check: if |x − a| &lt; δ then |f(x) − L| &lt; ε
          </p>
          <div className="results">
            <article>
              <b>Output band (L ± ε)</b>
              <p>L = f(a) = {L}</p>
              <p>
                y ∈ ({round(L - epsilon)}, {round(L + epsilon)})
              </p>
            </article>
            <article className={pass ? "pass" : "fail"}>
              <b>Containment result</b>
              <p>
                {pass
                  ? `Within the band for all x in (${round(a - delta)}, ${round(a + delta)})`
                  : `The input interval escapes the output band.`}
              </p>
              <strong>{pass ? "✓ PASS" : "✕ FAIL"}</strong>
            </article>
            <article>
              <b>Input interval (a ± δ)</b>
              <p>
                x ∈ ({round(a - delta)}, {round(a + delta)})
              </p>
            </article>
          </div>
          <footer>
            A linear function turns an input band around x = {a} into a
            proportional output band around y = {L}.
          </footer>
        </div>
      </section>
      <section className="ed283-how">
        <b>HOW TO USE</b>
        {[
          [Eye, "1 Observe", "The purple band is L ± ε around y = L."],
          [
            Hand,
            "2 Manipulate",
            "Change ε and δ. Watch how the line and bands respond.",
          ],
          [
            Search,
            "3 Notice",
            "If the orange interval is inside the safe region, you get PASS.",
          ],
          [
            Lightbulb,
            "4 Understand",
            "This is the ε–δ definition of lim x→a 2x = 2a in action.",
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
      <section className="ed283-learning">
        <article>
          <h3>The rule (ε–δ definition)</h3>
          <p>We say lim x→a f(x) = L if</p>
          <output>
            ∀ ε &gt; 0, ∃ δ &gt; 0 such that
            <br />0 &lt; |x − a| &lt; δ ⇒ |f(x) − L| &lt; ε.
          </output>
          <b>
            Read: For any output tolerance ε, we can find an input tolerance δ.
          </b>
        </article>
        <article>
          <h3>One correct worked example</h3>
          <p>Show that lim x→1 2x = 2.</p>
          <p>
            <b>Proof.</b> Let ε &gt; 0 be given. Choose δ = ε/2.
          </p>
          <output>
            If 0 &lt; |x − 1| &lt; δ then
            <br />
            |2x − 2| = 2|x − 1| &lt; 2(ε/2) = ε.
          </output>
          <p>Hence |2x − 2| &lt; ε. □</p>
        </article>
        <article className="mistake">
          <h3>
            <AlertTriangle /> Common misconception
          </h3>
          <b>You do not pick δ first.</b>
          <p>
            Fixing δ and then trying to make ε work can fail. For a given ε, δ
            must be chosen small enough to guarantee the band.
          </p>
          <ConcentricBands />
        </article>
      </section>
      <section className="ed283-practice">
        <header>
          <div>
            <b>PRACTICE CHALLENGE (LESSON-SPECIFIC)</b>
            <h3>
              Set ε = {practiceEpsilon}. Find a smallest δ that works for
              f(x)=2x at a=1.
            </h3>
          </div>
          <button
            onClick={() =>
              act(() => {
                const next = round(practiceEpsilon === 1.6 ? 2.4 : 1.6);
                setPracticeEpsilon(next);
                setPracticeDelta(round(next / 2));
              })
            }
          >
            Try a new ε
          </button>
        </header>
        <article>
          <b>Your turn</b>
          <p>Set ε = {practiceEpsilon} and adjust δ until PASS.</p>
          <label>
            ε ={" "}
            <input
              aria-label="Practice epsilon"
              type="number"
              step=".1"
              value={practiceEpsilon}
              onChange={(event) =>
                act(() => setPracticeEpsilon(Number(event.target.value)))
              }
            />
          </label>
          <label>
            δ ={" "}
            <input
              aria-label="Practice delta"
              type="number"
              step=".1"
              value={practiceDelta}
              onChange={(event) =>
                act(() => setPracticeDelta(Number(event.target.value)))
              }
            />
          </label>
        </article>
        <article>
          <b>
            <Lightbulb /> Hint
          </b>
          <p>
            For f(x)=2x, we need 2|x−1| &lt; {practiceEpsilon}. So choose δ ={" "}
            {round(practiceEpsilon / 2)}.
          </p>
        </article>
        <article className={practicePass ? "pass" : "fail"}>
          <b>Check your answer</b>
          <p>Your result: δ = {practiceDelta}</p>
          <strong>{practicePass ? "PASS ✓" : "TRY AGAIN"}</strong>
          <p>
            {practicePass
              ? "That is a working δ."
              : `Choose δ ≤ ${round(practiceEpsilon / 2)}.`}
          </p>
        </article>
      </section>
      <nav className="ed283-nav">
        <a href="/lessons/calculus/282-types-of-discontinuity">
          <ArrowLeft />
          <span>
            <small>Previous</small>Types of Discontinuity
          </span>
        </a>
        <a href="/lessons/calculus/284-average-rate-of-change">
          <span>
            <small>Next</small>Average Rate of Change
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function BandControl({
  label,
  symbol,
  value,
  min,
  max,
  step,
  color,
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <article className={`band ${color}`}>
      <h3>{label}</h3>
      <output>
        {symbol} = {value}
      </output>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        <span>{min}</span>
        <span>{max}</span>
      </small>
      <div>
        <button onClick={() => onChange(Math.max(min, round(value - step)))}>
          −
        </button>
        <input
          aria-label={`${label} number`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button onClick={() => onChange(Math.min(max, round(value + step)))}>
          +
        </button>
      </div>
    </article>
  );
}
function EpsilonGraph({
  epsilon,
  delta,
  a,
  setBand,
}: {
  epsilon: number;
  delta: number;
  a: number;
  setBand: (kind: "epsilon" | "delta" | "a", value: number) => void;
}) {
  const w = 560,
    h = 390,
    sx = (x: number) => w / 2 + x * 39,
    sy = (y: number) => h / 2 - y * 30,
    L = 2 * a;
  const drag =
    (kind: "delta" | "a") => (event: ReactPointerEvent<SVGCircleElement>) => {
      if (event.buttons !== 1 && event.type === "pointermove") return;
      if (event.type === "pointerdown") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const x = (((event.clientX - box.left) / box.width) * w - w / 2) / 39;
      setBand(kind, kind === "a" ? x : Math.abs(x - a));
    };
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Epsilon delta graph with draggable input interval"
    >
      <defs>
        <pattern
          id="ed-grid"
          width="39"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path d="M39 0H0V30" fill="none" stroke="#edf0f5" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#ed-grid)" />
      <rect
        x="0"
        y={sy(L + epsilon)}
        width={w}
        height={epsilon * 60}
        fill="#8b5cf6"
        opacity=".1"
      />
      <line
        className="purple"
        x1="0"
        y1={sy(L + epsilon)}
        x2={w}
        y2={sy(L + epsilon)}
      />
      <line
        className="purple"
        x1="0"
        y1={sy(L - epsilon)}
        x2={w}
        y2={sy(L - epsilon)}
      />
      <line className="axis" x1="0" y1={sy(0)} x2={w} y2={sy(0)} />
      <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2={h} />
      {[-6, -4, -2, 2, 4, 6].map((value) => (
        <g key={`x-${value}`} className="tick">
          <line x1={sx(value)} y1={sy(0) - 4} x2={sx(value)} y2={sy(0) + 4} />
          <text x={sx(value) - 5} y={sy(0) + 18}>{value}</text>
        </g>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((value) => (
        <g key={`y-${value}`} className="tick">
          <line x1={sx(0) - 4} y1={sy(value)} x2={sx(0) + 4} y2={sy(value)} />
          <text x={sx(0) - 20} y={sy(value) + 4}>{value}</text>
        </g>
      ))}
      <path
        d={`M${sx(-5)} ${sy(-10)} L${sx(5)} ${sy(10)}`}
        className="function"
      />
      <line className="guide" x1={sx(a)} y1={sy(0)} x2={sx(a)} y2={sy(L)} />
      <line
        className="orange"
        x1={sx(a - delta)}
        y1={sy(0)}
        x2={sx(a - delta)}
        y2={sy(-3)}
      />
      <line
        className="orange"
        x1={sx(a + delta)}
        y1={sy(0)}
        x2={sx(a + delta)}
        y2={sy(-3)}
      />
      <circle
        data-drag="delta-left"
        cx={sx(a - delta)}
        cy={sy(0)}
        r="7"
        onPointerDown={drag("delta")}
        onPointerMove={drag("delta")}
      />
      <circle
        data-drag="a"
        className="a"
        cx={sx(a)}
        cy={sy(L)}
        r="7"
        onPointerDown={drag("a")}
        onPointerMove={drag("a")}
      />
      <circle
        data-drag="delta-right"
        cx={sx(a + delta)}
        cy={sy(0)}
        r="7"
        onPointerDown={drag("delta")}
        onPointerMove={drag("delta")}
      />
      <text x={sx(a) + 14} y={sy(L) - 10}>
        ({a}, {L})
      </text>
      <text x={sx(4.2)} y={sy(7.1)} className="function-label">f(x) = 2x</text>
      <text x="8" y={sy(L + epsilon) - 8} className="purple-text">L + ε</text>
      <text x="8" y={sy(L - epsilon) + 18} className="purple-text">L − ε</text>
      <text x={sx(a - delta) - 36} y={sy(-1.7)} className="orange-text">a − δ</text>
      <text x={sx(a + delta) + 5} y={sy(-1.7)} className="orange-text">a + δ</text>
      <text className="orange-text" x={sx(a) - 25} y={sy(-3) + 20}>
        δ = {delta}
      </text>
      <text className="purple-text" x={w - 60} y={sy(L)}>
        ε = {epsilon}
      </text>
    </svg>
  );
}
function ConcentricBands() {
  return (
    <svg viewBox="0 0 180 120">
      <circle cx="90" cy="55" r="45" fill="#8b5cf6" opacity=".08" />
      <circle cx="90" cy="55" r="32" fill="#8b5cf6" opacity=".12" />
      <circle cx="90" cy="55" r="18" fill="#8b5cf6" opacity=".2" />
      <circle cx="90" cy="55" r="5" fill="#7c3aed" />
      <path d="M55 110h70M55 105v10M125 105v10" stroke="#f97316" />
      <text x="72" y="119" fill="#f97316">
        δ (input)
      </text>
    </svg>
  );
}
