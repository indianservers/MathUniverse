import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  GraduationCap,
  Hand,
  Languages,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./DoubleHalfAngleTargetLesson268.css";

type FormulaMode = "sin" | "cos" | "tan";
type PracticeResult = "idle" | "correct" | "incorrect";
type Challenge = {
  prompt: string;
  setup: string;
  choices: string[];
  correct: number;
  steps: string[];
  hint: string;
};

const INITIAL_THETA = 45;
const EPSILON = 1e-10;
const CHALLENGES: Challenge[] = [
  {
    prompt: "Find sin(15°).",
    setup: "Using θ = 30°:",
    choices: [
      "√((1 − √3) / 4)",
      "√((2 − √3) / 4)",
      "√((2 + √3) / 4)",
      "−√((2 + √3) / 4)",
    ],
    correct: 1,
    steps: [
      "sin(15°) = √((1 − cos 30°) / 2)",
      "= √((1 − √3/2) / 2)",
      "= √((2 − √3) / 4)",
    ],
    hint: "15° is half of 30°. In quadrant I, choose the positive sine root.",
  },
  {
    prompt: "Find cos(75°).",
    setup: "Using θ = 150°:",
    choices: [
      "√((2 − √3) / 4)",
      "−√((2 − √3) / 4)",
      "√((2 + √3) / 4)",
      "(√6 + √2) / 4",
    ],
    correct: 0,
    steps: [
      "cos(75°) = √((1 + cos 150°) / 2)",
      "= √((1 − √3/2) / 2)",
      "= √((2 − √3) / 4)",
    ],
    hint: "75° is in quadrant I, so cosine uses the positive half-angle root.",
  },
  {
    prompt: "Find tan(15°).",
    setup: "Using θ = 30°:",
    choices: ["2 − √3", "2 + √3", "√3 − 2", "1 / √3"],
    correct: 0,
    steps: [
      "tan(15°) = sin 30° / (1 + cos 30°)",
      "= (1/2) / (1 + √3/2)",
      "= 1 / (2 + √3) = 2 − √3",
    ],
    hint: "Use tan(θ/2) = sin θ / (1 + cos θ), then rationalize.",
  },
];

export default function DoubleHalfAngleTargetLesson268({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [theta, setTheta] = useState(INITIAL_THETA);
  const [mode, setMode] = useState<FormulaMode>("sin");
  const [stage, setStage] = useState("lab");
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(1);
  const [result, setResult] = useState<PracticeResult>("correct");
  const [hint, setHint] = useState(false);
  const model = useMemo(() => doubleHalfModel(theta, mode), [theta, mode]);
  const challenge = CHALLENGES[challengeIndex];

  const restore = () => {
    setTheta(INITIAL_THETA);
    setMode("sin");
    setStage("lab");
    setChallengeIndex(0);
    setChoice(1);
    setResult("correct");
    setHint(false);
  };
  useEffect(restore, [resetToken]);

  const updateTheta = (value: number) => {
    setTheta(clamp(normalizeSigned(value), -180, 180));
    onInteraction();
  };
  const selectMode = (next: FormulaMode) => {
    setMode(next);
    onInteraction();
  };
  const reset = () => {
    restore();
    onInteraction();
  };
  const selectChoice = (index: number) => {
    setChoice(index);
    setResult("idle");
    onInteraction();
  };
  const grade = () => {
    setResult(choice === challenge.correct ? "correct" : "incorrect");
    onInteraction();
  };
  const nextChallenge = () => {
    setChallengeIndex((current) => (current + 1) % CHALLENGES.length);
    setChoice(null);
    setResult("idle");
    setHint(false);
    onInteraction();
  };

  return (
    <section
      className="target-double-half-page"
      data-testid="trigonometry-mockup-0325"
      data-dedicated-lesson="268"
      data-object-model="linked-theta-double-half-unit-circle-sign-aware-identity-model"
      data-theta={theta.toFixed(6)}
      data-double-angle={model.doubleAngle.toFixed(6)}
      data-half-angle={model.halfAngle.toFixed(6)}
      data-mode={mode}
      data-stage={stage}
      data-double-direct={numberData(model.doubleDirect)}
      data-double-expanded={numberData(model.doubleExpanded)}
      data-half-direct={numberData(model.halfDirect)}
      data-half-expanded={numberData(model.halfExpanded)}
      data-half-sign={model.halfSign}
      data-double-defined={model.doubleDefined}
      data-half-defined={model.halfDefined}
      data-challenge-index={challengeIndex}
      data-choice={choice ?? "none"}
      data-practice-result={result}
    >
      <header className="target-double-half-header">
        <section>
          <span>Trigonometry</span>
          <span>Trigonometry</span>
        </section>
        <h1>Double- and Half-Angle Formulae</h1>
        <p>Explore derived identities.</p>
        <footer>
          <b>♙ Intermediate–Advanced</b>
          <b>ϟ Visual Lab</b>
          <b>▣ Trig Graphing / Geometry</b>
          <b>◷ 6–10 min</b>
          <label>
            <Languages />
            <select
              aria-label="Lesson language"
              defaultValue="en"
              onChange={onInteraction}
            >
              <option value="en">English (English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </label>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(
                globalThis.location?.href ?? "",
              );
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <a href="#double-half-lab">
            <Sparkles />
            Workspace
          </a>
        </footer>
      </header>

      <nav className="target-double-half-tabs" aria-label="Lesson stages">
        {[
          ["lab", Eye, "Interactive Lab"],
          ["observe", Eye, "Observe"],
          ["manipulate", Hand, "Manipulate"],
          ["notice", Lightbulb, "Notice"],
          ["understand", Sparkles, "Understand"],
          ["practice", GraduationCap, "Practice"],
        ].map(([id, Icon, label]) => (
          <button
            key={String(id)}
            type="button"
            className={stage === id ? "active" : ""}
            onClick={() => {
              setStage(String(id));
              onInteraction();
            }}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <section className="target-double-half-lab" id="double-half-lab">
        <h2>Linked angles on the unit circle</h2>
        <div>
          <LinkedAngleCircle theta={theta} onTheta={updateTheta} />
          <aside>
            <label className="target-double-half-slider">
              <b>Set angle θ</b>
              <span>
                <input
                  aria-label="Theta angle"
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={theta}
                  onChange={(event) => updateTheta(Number(event.target.value))}
                />
                <input
                  aria-label="Theta degrees"
                  type="number"
                  min="-180"
                  max="180"
                  step="1"
                  value={round(theta, 1)}
                  onChange={(event) => updateTheta(Number(event.target.value))}
                />
              </span>
              <small>
                <i>−180°</i>
                <i>0°</i>
                <i>180°</i>
              </small>
            </label>
            <table>
              <thead>
                <tr>
                  <th>Angle</th>
                  <th>Degrees</th>
                  <th>Radians</th>
                  <th>Coordinates (x, y)</th>
                </tr>
              </thead>
              <tbody>
                <AngleRow color="#087cf0" label="θ" angle={theta} />
                <AngleRow
                  color="#6d19d8"
                  label="2θ"
                  angle={model.doubleAngle}
                />
                <AngleRow
                  color="#0aa6c4"
                  label="θ / 2"
                  angle={model.halfAngle}
                />
              </tbody>
            </table>
            <article>
              <b>Quick checks</b>
              <p>
                <CheckCircle2 />
                All points lie on the unit circle
              </p>
              <p>
                <CheckCircle2 />
                Axes &amp; coordinates correct
              </p>
            </article>
          </aside>
        </div>
      </section>

      <section className="target-double-half-formulas">
        <header>
          <h2>Double- and half-angle formulae</h2>
          <div>
            <b>Show:</b>
            {(["sin", "cos", "tan"] as FormulaMode[]).map((item) => (
              <button
                type="button"
                key={item}
                className={mode === item ? "active" : ""}
                onClick={() => selectMode(item)}
              >
                {capitalize(item)}
              </button>
            ))}
          </div>
        </header>
        <div>
          <FormulaCard kind="double" model={model} theta={theta} />
          <FormulaCard kind="half" model={model} theta={theta} />
          <article className="target-double-half-domain">
            <h3>Half-angle domain &amp; sign</h3>
            <strong>{model.halfFormula}</strong>
            <ul>
              <li>Domain: {model.halfDomain}</li>
              <li>Choose sign using:</li>
              <li>If {mode}(θ / 2) ≥ 0 → +</li>
              <li>If {mode}(θ / 2) &lt; 0 → −</li>
            </ul>
            <small>
              Current sign: <b>{model.halfSign}</b> for θ / 2 ={" "}
              {formatAngle(model.halfAngle)}
            </small>
          </article>
        </div>
      </section>

      <section className="target-double-half-flow">
        {[
          [
            Eye,
            "01 Observe",
            "Three linked angles on the unit circle: θ, 2θ and θ/2. Notice their positions, coordinates and signs.",
          ],
          [
            Hand,
            "02 Manipulate",
            "Change θ with the slider or drag any point. All three update together in real time.",
          ],
          [
            Lightbulb,
            "03 Notice",
            "Patterns appear: the formulas hold for every valid θ. Pay attention to signs.",
          ],
          [
            GraduationCap,
            "04 Understand",
            "Use the correct formula, apply the sign rule, and solve problems confidently.",
          ],
        ].map(([Icon, title, copy], index) => (
          <article key={String(title)}>
            <Icon />
            <h3>{title}</h3>
            <p>{copy}</p>
            {index < 3 ? <ArrowRight /> : null}
          </article>
        ))}
      </section>

      <section className="target-double-half-learning">
        <article>
          <h2>Worked Example</h2>
          <p>Find sin(75°) using the half-angle formula.</p>
          <h3>Solution</h3>
          <p>Let θ = 150°, then θ / 2 = 75°.</p>
          <strong>sin(75°) = sin(150° / 2) = + √((1 − cos 150°) / 2)</strong>
          <p>= √((1 − (−√3/2)) / 2) = √((2 + √3) / 4)</p>
          <footer>
            sin(75°) = √((2 + √3) / 4) ≈ 0.9659 <CheckCircle2 />
          </footer>
        </article>
        <aside>
          <h2>
            <TriangleAlert />
            Common Misconception
          </h2>
          <p>
            <b>Mistake:</b> Using ± in the half-angle formula without checking
            the sign.
          </p>
          <p>
            <b>Why it’s wrong:</b> The ± sign depends on the quadrant of θ/2.
          </p>
          <p>
            <b>Example:</b> Find sin(−75°).
          </p>
          <strong>
            Incorrect: +√((1 − cos(−150°)) / 2) = +0.9659 <i>×</i>
          </strong>
          <strong>
            Correct: −√((1 − cos(−150°)) / 2) = −0.9659 <Check />
          </strong>
          <p>Always check the sign from the quadrant of θ/2.</p>
        </aside>
      </section>

      <section className="target-double-half-practice">
        <header>
          <h2>Practice Challenge</h2>
          <p>Find the exact value. (Select the correct option.)</p>
        </header>
        <div>
          <article>
            <h3>
              {challengeIndex + 1}. {challenge.prompt}
            </h3>
            <section>
              {challenge.choices.map((answer, index) => (
                <button
                  type="button"
                  key={answer}
                  className={choice === index ? "selected" : ""}
                  onClick={() => selectChoice(index)}
                >
                  <b>{String.fromCharCode(65 + index)}</b>
                  {answer}
                  {choice === index ? <Check /> : null}
                </button>
              ))}
            </section>
            <footer>
              <button type="button" onClick={grade}>
                <Check />
                Check Answer
              </button>
              <button
                type="button"
                onClick={() => {
                  setHint((value) => !value);
                  onInteraction();
                }}
              >
                <Lightbulb />
                Show Hint
              </button>
              {hint ? <p>{challenge.hint}</p> : null}
            </footer>
          </article>
          <aside className={result}>
            <h3>
              {result === "correct"
                ? "Correct! Well done."
                : result === "incorrect"
                  ? "Not quite. Try again."
                  : "Choose an answer, then check it."}
            </h3>
            {result === "correct" ? (
              <>
                <b>{challenge.setup}</b>
                {challenge.steps.map((step) => (
                  <p key={step}>{step}</p>
                ))}
              </>
            ) : result === "incorrect" ? (
              <p>
                Use the angle relationship and check the quadrant sign before
                selecting the exact value.
              </p>
            ) : null}
            <button type="button" onClick={nextChallenge}>
              <RefreshCw />
              New Question
            </button>
          </aside>
        </div>
      </section>
    </section>
  );
}

type DoubleHalfModel = ReturnType<typeof doubleHalfModel>;

function LinkedAngleCircle({
  theta,
  onTheta,
}: {
  theta: number;
  onTheta: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const cx = 146,
    cy = 160,
    r = 121;
  const angles = [
    {
      kind: "theta",
      angle: theta,
      color: "#087cf0",
      label: "Pθ",
      testId: "double-half-theta-handle",
    },
    {
      kind: "double",
      angle: normalizeSigned(theta * 2),
      color: "#6d19d8",
      label: "P2θ",
      testId: "double-half-double-handle",
    },
    {
      kind: "half",
      angle: theta / 2,
      color: "#0aa6c4",
      label: "Pθ/2",
      testId: "double-half-half-handle",
    },
  ] as const;
  const update = (
    event: ReactPointerEvent<SVGCircleElement>,
    kind: (typeof angles)[number]["kind"],
  ) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const angle = normalizeSigned(
      (Math.atan2(cy - point.y, point.x - cx) * 180) / Math.PI,
    );
    onTheta(
      kind === "theta" ? angle : kind === "double" ? angle / 2 : angle * 2,
    );
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 365 305"
      role="img"
      aria-label="Linked theta, double-angle, and half-angle unit-circle construction"
    >
      <line x1="25" x2="330" y1={cy} y2={cy} />
      <line x1={cx} x2={cx} y1="10" y2="292" />
      <circle cx={cx} cy={cy} r={r} fill="none" />
      <text x="327" y={cy - 8}>
        x
      </text>
      <text x={cx - 13} y="14">
        y
      </text>
      <text x={cx - 14} y={cy + 17}>
        O
      </text>
      {angles.map((item) => {
        const p = polarPoint(cx, cy, r, item.angle);
        return (
          <g key={item.kind}>
            <line
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              style={{ stroke: item.color }}
            />
            <line
              x1={p.x}
              y1={p.y}
              x2={p.x}
              y2={cy}
              className="projection"
              style={{ stroke: item.color }}
            />
            <path
              d={arcPath(
                cx,
                cy,
                item.kind === "theta" ? 39 : item.kind === "double" ? 55 : 26,
                0,
                item.angle,
              )}
              fill="none"
              style={{ stroke: item.color }}
            />
            <circle
              data-testid={item.testId}
              cx={p.x}
              cy={p.y}
              r="7"
              fill={item.color}
              role="slider"
              aria-label={`${item.kind} angle handle`}
              tabIndex={0}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                update(event, item.kind);
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) update(event, item.kind);
              }}
            />
            <text x={p.x + 8} y={p.y - 7} style={{ fill: item.color }}>
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AngleRow({
  color,
  label,
  angle,
}: {
  color: string;
  label: string;
  angle: number;
}) {
  const radians = radiansLabel(angle),
    x = Math.cos(toRadians(angle)),
    y = Math.sin(toRadians(angle));
  return (
    <tr>
      <td>
        <i style={{ background: color }} />
        {label}
      </td>
      <td>{formatAngle(angle)}</td>
      <td>{radians}</td>
      <td>
        ( {formatNumber(x, 4)} , {formatNumber(y, 4)} )
      </td>
    </tr>
  );
}

function FormulaCard({
  kind,
  model,
  theta,
}: {
  kind: "double" | "half";
  model: DoubleHalfModel;
  theta: number;
}) {
  const isDouble = kind === "double";
  const direct = isDouble ? model.doubleDirect : model.halfDirect;
  const expanded = isDouble ? model.doubleExpanded : model.halfExpanded;
  const defined = isDouble ? model.doubleDefined : model.halfDefined;
  return (
    <article className={kind}>
      <h3>{isDouble ? "Double-angle (2θ)" : "Half-angle (θ/2)"}</h3>
      <strong>{isDouble ? model.doubleFormula : model.halfFormula}</strong>
      <p>
        <b>
          {isDouble
            ? `Test with θ = ${formatAngle(theta)}`
            : "Sign rule: Use the sign of the half-angle value"}
        </b>
      </p>
      <p>
        {isDouble
          ? `LHS: ${formatValue(direct)}     RHS: ${formatValue(expanded)}`
          : `For θ = ${formatAngle(theta)}: ${model.mode}(θ / 2) is ${model.halfSign === "+" ? "positive" : "negative"}`}
      </p>
      <footer
        className={
          defined && close(direct, expanded) ? "verified" : "undefined"
        }
      >
        {defined && close(direct, expanded) ? (
          <>
            <Check />
            Verified
          </>
        ) : (
          "Undefined at this angle"
        )}
      </footer>
    </article>
  );
}

function doubleHalfModel(theta: number, mode: FormulaMode) {
  const radians = toRadians(theta),
    halfAngle = theta / 2,
    doubleAngle = normalizeSigned(theta * 2);
  const s = Math.sin(radians),
    c = Math.cos(radians),
    t = safeDivide(s, c);
  const halfRadians = radians / 2,
    doubleRadians = radians * 2;
  let doubleDirect: number | null,
    doubleExpanded: number | null,
    halfDirect: number | null,
    halfExpanded: number | null;
  let doubleFormula = "",
    halfFormula = "",
    halfDomain = "All real θ";
  if (mode === "sin") {
    doubleDirect = Math.sin(doubleRadians);
    doubleExpanded = 2 * s * c;
    halfDirect = Math.sin(halfRadians);
    halfExpanded = signedRoot((1 - c) / 2, Math.sin(halfRadians));
    doubleFormula = "sin(2θ) = 2 sin θ cos θ";
    halfFormula = "sin(θ/2) = ± √((1 − cos θ) / 2)";
  } else if (mode === "cos") {
    doubleDirect = Math.cos(doubleRadians);
    doubleExpanded = c * c - s * s;
    halfDirect = Math.cos(halfRadians);
    halfExpanded = signedRoot((1 + c) / 2, Math.cos(halfRadians));
    doubleFormula = "cos(2θ) = cos²θ − sin²θ";
    halfFormula = "cos(θ/2) = ± √((1 + cos θ) / 2)";
  } else {
    doubleDirect = safeTan(doubleRadians);
    doubleExpanded = t === null ? null : safeDivide(2 * t, 1 - t * t);
    halfDirect = safeTan(halfRadians);
    halfExpanded = safeDivide(s, 1 + c);
    doubleFormula = "tan(2θ) = 2 tan θ / (1 − tan²θ)";
    halfFormula = "tan(θ/2) = sin θ / (1 + cos θ)";
    halfDomain = "θ ≠ (2k + 1)π";
  }
  return {
    mode,
    halfAngle,
    doubleAngle,
    doubleDirect,
    doubleExpanded,
    halfDirect,
    halfExpanded,
    doubleDefined: doubleDirect !== null && doubleExpanded !== null,
    halfDefined: halfDirect !== null && halfExpanded !== null,
    halfSign: (halfDirect ?? 0) < 0 ? "−" : "+",
    doubleFormula,
    halfFormula,
    halfDomain,
  };
}

function signedRoot(value: number, signSource: number) {
  return Math.sign(signSource || 1) * Math.sqrt(Math.max(0, value));
}
function safeDivide(numerator: number, denominator: number) {
  return Math.abs(denominator) < EPSILON ? null : numerator / denominator;
}
function safeTan(radians: number) {
  return Math.abs(Math.cos(radians)) < EPSILON ? null : Math.tan(radians);
}
function toRadians(angle: number) {
  return (angle * Math.PI) / 180;
}
function normalizeSigned(angle: number) {
  const result = ((((angle + 180) % 360) + 360) % 360) - 180;
  return Math.abs(result + 180) < EPSILON && angle > 0 ? 180 : result;
}
function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const radians = toRadians(angle);
  return {
    x: cx + radius * Math.cos(radians),
    y: cy - radius * Math.sin(radians),
  };
}
function arcPath(
  cx: number,
  cy: number,
  radius: number,
  start: number,
  end: number,
) {
  const a = polarPoint(cx, cy, radius, start),
    b = polarPoint(cx, cy, radius, end),
    delta = Math.abs(end - start);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${delta > 180 ? 1 : 0} ${end >= start ? 0 : 1} ${b.x} ${b.y}`;
}
function close(a: number | null, b: number | null) {
  return a !== null && b !== null && Math.abs(a - b) < 1e-8;
}
function numberData(value: number | null) {
  return value === null ? "undefined" : value.toFixed(6);
}
function formatValue(value: number | null) {
  return value === null ? "undefined" : formatNumber(value, 4);
}
function formatNumber(value: number, places: number) {
  return Math.abs(value) < 0.5 * 10 ** -places
    ? (0).toFixed(places)
    : value.toFixed(places);
}
function formatAngle(value: number) {
  return `${round(value, 1)}°`;
}
function round(value: number, places: number) {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function radiansLabel(angle: number) {
  const rounded = Math.round(angle);
  const labels: Record<number, string> = {
    [-180]: "−π",
    [-90]: "−π/2",
    [-45]: "−π/4",
    0: "0",
    22: "π/8",
    23: "π/8",
    30: "π/6",
    45: "π/4",
    60: "π/3",
    90: "π/2",
    180: "π",
  };
  return labels[rounded] ?? `${formatNumber(angle / 180, 3)}π`;
}
