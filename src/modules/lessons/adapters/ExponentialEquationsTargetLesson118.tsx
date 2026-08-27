import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Expand,
  Languages,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./ExponentialEquationsTargetLesson118.css";

type ExponentialProblem = { base: number; exponent: number; variable: string };
const examples: ExponentialProblem[] = [
  { base: 2, exponent: 5, variable: "x" },
  { base: 3, exponent: 3, variable: "x" },
  { base: 4, exponent: 3, variable: "x" },
  { base: 5, exponent: 2, variable: "x" },
];
const practices: ExponentialProblem[] = [
  { base: 3, exponent: 4, variable: "y" },
  { base: 2, exponent: 6, variable: "n" },
  { base: 5, exponent: 3, variable: "t" },
];
const targetOf = ({ base, exponent }: ExponentialProblem) => base ** exponent;
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

function Power({
  base,
  exponent,
}: {
  base: number | string;
  exponent: number | string;
}) {
  return (
    <span className="exp118-power">
      <span>{base}</span>
      <sup>{exponent}</sup>
    </span>
  );
}

function ExponentialGraph({
  base,
  exponent,
  onMove,
}: {
  base: number;
  exponent: number;
  onMove: (value: number) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const width = 300;
  const height = 335;
  const bounds = { left: 35, right: 280, top: 30, bottom: 295 };
  const xMin = -2;
  const xMax = 7;
  const target = base ** exponent;
  const yMax = Math.max(64, base ** Math.min(6, exponent + 1));
  const px = (x: number) =>
    bounds.left + ((x - xMin) / (xMax - xMin)) * (bounds.right - bounds.left);
  const py = (y: number) =>
    bounds.bottom - (y / yMax) * (bounds.bottom - bounds.top);
  const points = Array.from({ length: 151 }, (_, index) => {
    const x = xMin + ((xMax - xMin) * index) / 150;
    return `${px(x)},${py(base ** x)}`;
  }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * width;
    const value =
      xMin +
      ((local - bounds.left) / (bounds.right - bounds.left)) * (xMax - xMin);
    onMove(Math.round(Math.max(1, Math.min(6, value))));
  };
  return (
    <svg
      ref={ref}
      className="exp118-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Graph of ${base} to the x with target ${target}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <clipPath id="exp118-clip">
          <rect
            x={bounds.left}
            y={bounds.top}
            width={bounds.right - bounds.left}
            height={bounds.bottom - bounds.top}
          />
        </clipPath>
      </defs>
      <g className="grid">
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={px(i - 2)}
            x2={px(i - 2)}
            y1={bounds.top}
            y2={bounds.bottom}
          />
        ))}
        {[1, 2, 4, 8, 16, 32, 64]
          .filter((value) => value <= yMax)
          .map((value) => (
            <line
              key={value}
              x1={bounds.left}
              x2={bounds.right}
              y1={py(value)}
              y2={py(value)}
            />
          ))}
      </g>
      <line
        className="axis"
        x1={bounds.left}
        x2={bounds.right + 5}
        y1={bounds.bottom}
        y2={bounds.bottom}
      />
      <line
        className="axis"
        x1={px(0)}
        x2={px(0)}
        y1={bounds.top - 4}
        y2={bounds.bottom}
      />
      {Array.from({ length: 10 }, (_, i) => (
        <text key={i} x={px(i - 2)} y={bounds.bottom + 15}>
          {i - 2}
        </text>
      ))}
      {[1, 2, 4, 8, 16, 32, 64]
        .filter((value) => value <= yMax)
        .map((value) => (
          <text key={value} x={px(0) - 12} y={py(value) + 3}>
            {value}
          </text>
        ))}
      <line
        className="target"
        x1={bounds.left}
        x2={px(exponent)}
        y1={py(target)}
        y2={py(target)}
      />
      <line
        className="guide"
        x1={px(exponent)}
        x2={px(exponent)}
        y1={py(target)}
        y2={bounds.bottom}
      />
      <polyline
        className="curve"
        points={points}
        clipPath="url(#exp118-clip)"
      />
      <circle
        cx={px(exponent)}
        cy={py(target)}
        r="6"
        role="slider"
        tabIndex={0}
        aria-label="Drag exponential solution exponent"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onMove(exponent - 1);
          if (event.key === "ArrowRight") onMove(exponent + 1);
        }}
      />
      <text className="point-label" x={px(exponent) + 28} y={py(target) + 20}>
        ({exponent}, {target})
      </text>
      <text className="curve-label" x={bounds.right - 25} y={bounds.top + 15}>
        y = {base}ˣ
      </text>
    </svg>
  );
}

export default function ExponentialEquationsTargetLesson118({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [problem, setProblem] = useState<ExponentialProblem>(examples[0]);
  const [target, setTarget] = useState(32);
  const [ladderBuilt, setLadderBuilt] = useState(true);
  const [matched, setMatched] = useState(true);
  const [checked, setChecked] = useState(true);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [sound, setSound] = useState(true);
  const [hints, setHints] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("4");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState(false);
  const [actions, setActions] = useState(0);
  const exactExponent = Math.log(target) / Math.log(problem.base);
  const matchable = close(exactExponent, Math.round(exactExponent));
  const solvedExponent = matchable ? Math.round(exactExponent) : exactExponent;
  const practice = practices[practiceIndex];
  const practiceTarget = targetOf(practice);
  const practiceCorrect =
    practiceChecked && Number(practiceAnswer) === practice.exponent;
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setExampleIndex(0);
    setProblem(examples[0]);
    setTarget(32);
    setLadderBuilt(true);
    setMatched(true);
    setChecked(true);
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setSound(true);
    setHints(true);
    setFullscreen(false);
    setShared(false);
    setWorkspace(false);
    setPracticeIndex(0);
    setPracticeAnswer("4");
    setPracticeChecked(true);
    setDragging(false);
    setInvalidDrop(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => reset(), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateProblem = (base: number, nextTarget: number) => {
    setProblem((current) => ({
      ...current,
      base,
      exponent: Math.round(Math.log(nextTarget) / Math.log(base)),
    }));
    setTarget(nextTarget);
    setLadderBuilt(false);
    setMatched(false);
    setChecked(false);
    setInvalidDrop(false);
    act();
  };
  const moveExponent = (exponent: number) => {
    setProblem((current) => ({ ...current, exponent }));
    setTarget(problem.base ** exponent);
    setLadderBuilt(true);
    setMatched(false);
    setChecked(false);
    act();
  };
  const nextExample = () => {
    const next = (exampleIndex + 1) % examples.length;
    const item = examples[next];
    setExampleIndex(next);
    setProblem(item);
    setTarget(targetOf(item));
    setLadderBuilt(false);
    setMatched(false);
    setChecked(false);
    act();
  };
  const startRung = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData(
      "text/exponential-rung",
      `${problem.base}:${target}`,
    );
    setDragging(true);
    setInvalidDrop(false);
    act();
  };
  const dropRung = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const valid =
      event.dataTransfer.getData("text/exponential-rung") ===
      `${problem.base}:${target}`;
    setMatched(valid);
    setChecked(false);
    setDragging(false);
    setInvalidDrop(!valid);
    act();
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % practices.length;
    setPracticeIndex(next);
    setPracticeAnswer("");
    setPracticeChecked(false);
    act();
  };

  return (
    <div
      className={`exp118-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="algebra-mockup-0175"
      data-dedicated-lesson="118"
      data-object-model="editable-exponential-base-target-generated-power-ladder-native-matching-rung-drag-pointer-draggable-graph-exponent-common-base-logarithm-fallback-substitution-check-graded-practice-model"
      data-problem={`${problem.base},${target}`}
      data-exponent={solvedExponent}
      data-matchable={matchable}
      data-ladder-built={ladderBuilt}
      data-matched={matched}
      data-checked={checked}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceCorrect}
      data-actions={actions}
    >
      <nav className="exp118-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>118 Exponential Equations</b>
      </nav>
      <header className="exp118-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>Exponential Equations</h1>
        <p>Solve variable-exponent equations by matching powers.</p>
        <nav>
          <b>▣ Intermediate-Advanced Algebra</b>
          <b>◷ 6-10 min</b>
          <b>▦ Power ladder</b>
          <b>ϟ Guided Practice</b>
          <b>⌘ Solve / Graph / Check</b>
        </nav>
        <div>
          <label>
            <Languages />
            <select
              aria-label="Exponential equations language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                act();
              }}
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
          </label>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              setShared(true);
              act();
            }}
          >
            <Share2 />
            {shared ? "Link ready" : "Share"}
          </button>
          <button
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ {workspace ? "Close workspace" : "Workspace"}
          </button>
        </div>
      </header>
      <nav className="exp118-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Practice",
          "Formulas",
          "Know more",
        ].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Examples") nextExample();
              else act();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <main className="exp118-lab">
        <header>
          <span>
            <small>INTERACTION</small>
            <h2>Power ladder matcher</h2>
          </span>
          <nav>
            <Toggle
              label="Sound"
              checked={sound}
              onChange={() => {
                setSound((value) => !value);
                act();
              }}
            />
            <Toggle
              label="Hints"
              checked={hints}
              onChange={() => {
                setHints((value) => !value);
                act();
              }}
            />
            <button
              onClick={() => {
                setFullscreen((value) => !value);
                act();
              }}
            >
              <Expand />
              Full screen
            </button>
          </nav>
        </header>
        <h3>
          Goal:{" "}
          <span>
            Rewrite both sides with the same base, then match exponents.
          </span>
        </h3>
        <section className="exp118-controls">
          <label>
            Base
            <select
              aria-label="Exponential base"
              value={problem.base}
              onChange={(event) =>
                updateProblem(Number(event.target.value), target)
              }
            >
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </label>
          <label>
            Target value
            <input
              aria-label="Exponential target value"
              type="number"
              value={target}
              onChange={(event) =>
                updateProblem(
                  problem.base,
                  Math.max(1, Number(event.target.value)),
                )
              }
            />
          </label>
          <button
            className={ladderBuilt ? "done" : ""}
            onClick={() => {
              setLadderBuilt(true);
              act();
            }}
          >
            ① Build power ladder
          </button>
          <button
            className={matched ? "active" : ""}
            onClick={() => {
              setMatched(matchable);
              setChecked(false);
              act();
            }}
          >
            ② Match exponents
          </button>
          <button
            className={checked ? "done" : ""}
            onClick={() => {
              setChecked(true);
              act();
            }}
          >
            ③ Check value
          </button>
        </section>
        <section className="exp118-work">
          <article className="left-side">
            <b>Left side</b>
            <strong>
              <Power base={problem.base} exponent={problem.variable} />
            </strong>
            <p>Keep as is.</p>
            <span>Base {problem.base}</span>
          </article>
          <article className="ladder">
            <b>Power ladder for base {problem.base}</b>
            <div>
              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (exponent) => (
                  <button
                    key={exponent}
                    className={
                      problem.base ** exponent === target ? "selected" : ""
                    }
                    draggable={problem.base ** exponent === target}
                    aria-label={
                      problem.base ** exponent === target
                        ? `Drag matching power ${problem.base} to ${exponent}`
                        : undefined
                    }
                    onDragStart={
                      problem.base ** exponent === target
                        ? startRung
                        : undefined
                    }
                    onDragEnd={() => setDragging(false)}
                    onClick={() => moveExponent(exponent)}
                  >
                    <Power base={problem.base} exponent={exponent} /> ={" "}
                    {problem.base ** exponent}
                  </button>
                ),
              )}
            </div>
          </article>
          <article
            className="right-side"
            aria-label="Matching power drop target"
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropRung}
          >
            <b>Right side</b>
            <strong>{target}</strong>
            <p>
              Rewrite {target} as a power of {problem.base}.
            </p>
            {matched && matchable ? (
              <span>
                {target} ={" "}
                <Power base={problem.base} exponent={solvedExponent} />
              </span>
            ) : (
              <span className="pending">
                {matchable ? "Drop matching rung" : "Use logarithms"}
              </span>
            )}
          </article>
          <article className="graph-card-exp">
            <h3>
              Graph: y = <Power base={problem.base} exponent="x" /> and y ={" "}
              {target}
            </h3>
            <ExponentialGraph
              base={problem.base}
              exponent={
                matchable ? Math.round(solvedExponent) : problem.exponent
              }
              onMove={moveExponent}
            />
            <p>
              The curve y = <Power base={problem.base} exponent="x" />{" "}
              intersects y = {target} at x ={" "}
              {matchable ? solvedExponent : solvedExponent.toFixed(4)}.
            </p>
          </article>
          <article className="match">
            <b>Match exponents</b>
            <p>
              Since <Power base={problem.base} exponent={problem.variable} /> ={" "}
              <Power
                base={problem.base}
                exponent={matchable ? solvedExponent : "log"}
              />
              ,
            </p>
            <strong>
              {problem.variable} ={" "}
              {matchable ? solvedExponent : solvedExponent.toFixed(4)}
            </strong>
          </article>
          <article className="verify">
            <b>Check</b>
            <p>
              <Power
                base={problem.base}
                exponent={
                  matchable ? solvedExponent : solvedExponent.toFixed(4)
                }
              />{" "}
              = {Math.round(problem.base ** solvedExponent)} <Check />
            </p>
            <strong>
              {checked && close(problem.base ** solvedExponent, target)
                ? "True"
                : "Pending"}
            </strong>
          </article>
        </section>
        <footer className="exp118-warning">
          <CircleAlert />
          <span>
            <h3>Important</h3>
            <b>Do not divide the bases.</b>
            <p>
              You cannot solve 2ˣ = 10 by dividing 10 by 2. When bases cannot be
              matched, use logarithms.
            </p>
          </span>
          <aside>
            <b>Example: 2ˣ = 10</b>
            <strong>x = log₂ 10 ≈ 3.3219</strong>
          </aside>
        </footer>
        {invalidDrop && (
          <em>Use the highlighted rung for the current base and target.</em>
        )}
      </main>
      <section className="exp118-practice">
        <h2>Guided practice</h2>
        <div>
          <article>
            <b>Problem</b>
            <p>Solve for {practice.variable}.</p>
            <strong>
              <Power base={practice.base} exponent={practice.variable} /> ={" "}
              {practiceTarget}
            </strong>
          </article>
          <article className="practice-ladder">
            <b>Power ladder for base {practice.base}</b>
            {Array.from({ length: 5 }, (_, index) => index + 1).map(
              (exponent) => (
                <span
                  key={exponent}
                  className={exponent === practice.exponent ? "selected" : ""}
                >
                  <Power base={practice.base} exponent={exponent} /> ={" "}
                  {practice.base ** exponent}
                </span>
              ),
            )}
          </article>
          <article>
            <b>Answer</b>
            <strong>
              {practice.variable} = {practice.exponent}
            </strong>
            <button
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              ▣ Check answer
            </button>
          </article>
          <article
            className={practiceCorrect ? "solution correct" : "solution"}
          >
            <b>Your solution</b>
            <p>Enter the value of {practice.variable}.</p>
            <input
              aria-label="Exponential practice answer"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(event.target.value);
                setPracticeChecked(false);
                act();
              }}
            />
            <strong>
              {practiceCorrect
                ? "Correct! 🎉"
                : practiceChecked
                  ? "Try again"
                  : "Ready to check"}
            </strong>
            <span>
              <Power base={practice.base} exponent={practice.exponent} /> ={" "}
              {practiceTarget} <Check />
            </span>
          </article>
        </div>
        <button onClick={nextPractice}>New practice</button>
      </section>
      <nav className="exp118-adjacent">
        <a href="/lessons/algebra/117-radical-equations">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Radical Equations
          </span>
        </a>
        <a href="/lessons/algebra/119-logarithmic-equations">
          <span>
            <small>NEXT</small>Logarithmic Equations
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="exp118-footer">
        <b>
          <Sparkles />
          Math Universe
        </b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <button>Sitemap</button>
          <button>Docs</button>
          <button>About</button>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="exp118-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i />
    </label>
  );
}
