import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Eye,
  Hand,
  Languages,
  Lightbulb,
  Link2,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
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
import "./TrigEquationsTargetLesson269.css";

type UnitMode = "radian" | "degree";
type Result = "idle" | "correct" | "incorrect";
type Challenge = {
  prompt: string;
  solutions: number[];
  hint: string;
  derivation: string;
};

const TAU = 2 * Math.PI;
const INITIAL_MIN = -TAU;
const INITIAL_MAX = TAU;
const CHALLENGES: Challenge[] = [
  {
    prompt: "Find all solutions of sin(x) = 1/2 in the interval [−2π, 2π].",
    solutions: [
      (-11 * Math.PI) / 6,
      (-7 * Math.PI) / 6,
      Math.PI / 6,
      (5 * Math.PI) / 6,
    ],
    hint: "Use reference angle π/6. Sine is positive in quadrants I and II, then shift by 2π.",
    derivation:
      "x = π/6 + 2πn or x = 5π/6 + 2πn; retain the four values in [−2π, 2π].",
  },
  {
    prompt: "Find all solutions of cos(x) = −1/2 in the interval [−2π, 2π].",
    solutions: [
      (-4 * Math.PI) / 3,
      (-2 * Math.PI) / 3,
      (2 * Math.PI) / 3,
      (4 * Math.PI) / 3,
    ],
    hint: "The reference angle is π/3. Cosine is negative in quadrants II and III.",
    derivation: "x = ±2π/3 + 2πn; retain the four values in [−2π, 2π].",
  },
];

export default function TrigEquationsTargetLesson269({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [k, setK] = useState(0.5);
  const [intervalMin, setIntervalMin] = useState(INITIAL_MIN);
  const [intervalMax, setIntervalMax] = useState(INITIAL_MAX);
  const [unit, setUnit] = useState<UnitMode>("radian");
  const [stage, setStage] = useState("interaction");
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result>("idle");
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const model = useMemo(
    () => cosineEquationModel(k, intervalMin, intervalMax),
    [k, intervalMin, intervalMax],
  );
  const challenge = CHALLENGES[challengeIndex];

  const restore = () => {
    setK(0.5);
    setIntervalMin(INITIAL_MIN);
    setIntervalMax(INITIAL_MAX);
    setUnit("radian");
    setStage("interaction");
    setChallengeIndex(0);
    setAnswer("");
    setResult("idle");
    setHintOpen(false);
    setSolutionOpen(false);
  };
  useEffect(restore, [resetToken]);
  const updateK = (value: number) => {
    setK(clamp(value, -1, 1));
    onInteraction();
  };
  const updateMin = (value: number) => {
    setIntervalMin(Math.min(value, intervalMax - Math.PI / 12));
    onInteraction();
  };
  const updateMax = (value: number) => {
    setIntervalMax(Math.max(value, intervalMin + Math.PI / 12));
    onInteraction();
  };
  const reset = () => {
    restore();
    onInteraction();
  };
  const grade = () => {
    const parsed = parseSolutionList(answer);
    setResult(
      sameSolutions(parsed, challenge.solutions) ? "correct" : "incorrect",
    );
    onInteraction();
  };
  const nextChallenge = () => {
    setChallengeIndex((current) => (current + 1) % CHALLENGES.length);
    setAnswer("");
    setResult("idle");
    setHintOpen(false);
    setSolutionOpen(false);
    onInteraction();
  };

  return (
    <section
      className="target-trig-equations-page"
      data-testid="trigonometry-mockup-0326"
      data-dedicated-lesson="269"
      data-object-model="cosine-horizontal-level-periodic-interval-intersection-solution-family-model"
      data-k={k.toFixed(6)}
      data-interval-min={intervalMin.toFixed(6)}
      data-interval-max={intervalMax.toFixed(6)}
      data-solution-count={model.solutions.length}
      data-solutions={model.solutions
        .map((value) => value.toFixed(6))
        .join(",")}
      data-unit={unit}
      data-stage={stage}
      data-challenge-index={challengeIndex}
      data-practice-result={result}
    >
      <header className="target-trig-equations-header">
        <div>
          <section>
            <span>Trigonometry</span>
            <span>Trigonometry</span>
          </section>
          <h1>Trig Equations</h1>
          <p>Find interval and general solutions.</p>
          <footer>
            <b>♙ Intermediate–Advanced</b>
            <b>ϟ Visual Lab</b>
            <b>▣ Trig Graphing / Geometry</b>
            <b>◷ 6–10 min</b>
          </footer>
        </div>
        <aside>
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
          <div>
            <button type="button" onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(
                  `cos(x) = ${round(k, 3)}, x in [${formatPi(intervalMin)}, ${formatPi(intervalMax)}]`,
                );
                onInteraction();
              }}
            >
              <Share2 />
              Share
            </button>
          </div>
          <a href="#trig-equation-solver">
            <Sparkles />
            Workspace
          </a>
        </aside>
      </header>

      <nav className="target-trig-equations-tabs" aria-label="Lesson views">
        {[
          ["interaction", Eye, "Interaction + visualization"],
          ["explain", BookOpen, "Explain"],
          ["examples", Lightbulb, "Examples"],
          ["formulas", Calculator, "Formulas"],
          ["know", Sparkles, "Know more"],
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

      <section className="target-trig-equations-flow">
        {[
          [
            Eye,
            "1 Observe",
            "See where the graph of y = cos(x) crosses the horizontal line y = k.",
          ],
          [
            Hand,
            "2 Manipulate",
            "Move k or the interval to collect all intersection points.",
          ],
          [
            Lightbulb,
            "3 Notice",
            "Solutions repeat every 2π and occur symmetrically about 0.",
          ],
          [
            Target,
            "4 Understand",
            "General solution: x = ± arccos(k) + 2πn, n ∈ Z.",
          ],
        ].map(([Icon, title, copy]) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        className="target-trig-equations-solver"
        id="trig-equation-solver"
      >
        <aside>
          <h2>Solve &nbsp; cos(x) = k</h2>
          <p>
            Adjust the horizontal line y = k and the interval to collect
            solutions.
          </p>
          <hr />
          <label>
            <b>k (y-value)</b>
            <span>
              <small>−1</small>
              <input
                aria-label="Equation level k"
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={k}
                onChange={(event) => updateK(Number(event.target.value))}
              />
              <small>1</small>
              <input
                aria-label="Equation level value"
                type="number"
                min="-1"
                max="1"
                step="0.01"
                value={round(k, 2)}
                onChange={(event) => updateK(Number(event.target.value))}
              />
            </span>
          </label>
          <label className="target-trig-equations-interval">
            <b>Interval for x ({unit === "radian" ? "radians" : "degrees"})</b>
            <span>
              <output>
                {unit === "radian"
                  ? formatPi(intervalMin)
                  : `${round(toDegrees(intervalMin), 0)}°`}
              </output>
              <i>
                <input
                  aria-label="Interval minimum"
                  type="range"
                  min={-3 * Math.PI}
                  max={3 * Math.PI}
                  step={Math.PI / 12}
                  value={intervalMin}
                  onChange={(event) => updateMin(Number(event.target.value))}
                />
                <input
                  aria-label="Interval maximum"
                  type="range"
                  min={-3 * Math.PI}
                  max={3 * Math.PI}
                  step={Math.PI / 12}
                  value={intervalMax}
                  onChange={(event) => updateMax(Number(event.target.value))}
                />
              </i>
              <output>
                {unit === "radian"
                  ? formatPi(intervalMax)
                  : `${round(toDegrees(intervalMax), 0)}°`}
              </output>
            </span>
            <strong>
              Interval: [
              {unit === "radian"
                ? formatPi(intervalMin)
                : `${round(toDegrees(intervalMin), 0)}°`}
              ,{" "}
              {unit === "radian"
                ? formatPi(intervalMax)
                : `${round(toDegrees(intervalMax), 0)}°`}
              ]
            </strong>
          </label>
          <ul>
            <li>
              <i />y = cos(x)
            </li>
            <li>
              <i />y = k = {round(k, 2)}
            </li>
            <li>
              <i />
              Intersections (solutions)
            </li>
          </ul>
        </aside>
        <article>
          <header>
            <button
              type="button"
              className={unit === "radian" ? "active" : ""}
              onClick={() => {
                setUnit("radian");
                onInteraction();
              }}
            >
              Radian
            </button>
            <button
              type="button"
              className={unit === "degree" ? "active" : ""}
              onClick={() => {
                setUnit("degree");
                onInteraction();
              }}
            >
              Degree
            </button>
          </header>
          <CosineEquationGraph
            model={model}
            intervalMin={intervalMin}
            intervalMax={intervalMax}
            k={k}
            unit={unit}
            onK={updateK}
          />
          <div className="target-trig-equations-results">
            <section>
              <b>
                Solutions in [{formatPi(intervalMin)}, {formatPi(intervalMax)}]
              </b>
              <strong>
                {model.solutions.length
                  ? model.solutions.map(formatPi).join(" ,  ")
                  : "No intersections"}
              </strong>
            </section>
            <section>
              <b>Decimal (approx.)</b>
              <strong>
                {model.solutions.length
                  ? model.solutions.map((value) => value.toFixed(3)).join(",  ")
                  : "None"}
              </strong>
            </section>
          </div>
          <footer className={model.solutions.length ? "found" : "empty"}>
            <CheckCircle2 />
            {model.solutions.length
              ? `Found ${model.solutions.length} intersection(s). Well done!`
              : "No intersections in this interval."}
          </footer>
        </article>
      </section>

      <section className="target-trig-equations-connect">
        <h2>How inputs connect to outputs</h2>
        <div>
          <FlowNode icon={Calculator} title="k (y = k)">
            Sets the height of the line
          </FlowNode>
          <ArrowRight />
          <FlowNode icon={Link2} title="Intersections">
            Where y = cos(x) meets y = k
          </FlowNode>
          <ArrowRight />
          <FlowNode icon={BookOpen} title="Interval">
            Limits the x-range searched
          </FlowNode>
          <ArrowRight />
          <FlowNode icon={Target} title="Solutions">
            All x that satisfy cos(x) = k
          </FlowNode>
        </div>
      </section>

      <section className="target-trig-equations-learning">
        <article>
          <h2>
            <Calculator />
            Relevant Rule
          </h2>
          <p>For k ∈ [−1, 1]:</p>
          <strong>cos(x) = k</strong>
          <strong>⇔ x = ± arccos(k) + 2πn, &nbsp; n ∈ Z</strong>
          <p>arccos(k) gives the principal value in [0, π].</p>
        </article>
        <article>
          <h2>
            <BookOpen />
            Worked Example
          </h2>
          <p>Solve cos(x) = −1/2 on [−2π, 2π].</p>
          <p>
            <b>Step 1:</b> k = −1/2 &nbsp; → &nbsp; arccos(−1/2) = 2π/3.
          </p>
          <p>
            <b>Step 2:</b> General solution
          </p>
          <strong>x = ± 2π/3 + 2πn, &nbsp; n ∈ Z.</strong>
          <p>
            <b>Step 3:</b> Values in [−2π, 2π]
          </p>
          <p>n = −1 → x = −4π/3, −2π/3</p>
          <p>n = 0 → x = −2π/3, 2π/3</p>
          <p>n = 1 → x = 2π/3, 4π/3</p>
          <footer>
            <b>Answer:</b> x = −4π/3, −2π/3, 2π/3, 4π/3
          </footer>
        </article>
        <aside>
          <h2>
            <TriangleAlert />
            Common Pitfall
          </h2>
          <p>
            <b>Don’t forget the periodic family!</b>
          </p>
          <p>
            Solving cos(x) = k gives infinitely many solutions, not just the two
            principal ones in [0, 2π).
          </p>
          <p>Missing “+ 2πn” leads to incomplete answers.</p>
          <MiniPeriodicGraph />
          <footer>× &nbsp; Incomplete</footer>
        </aside>
      </section>

      <section className="target-trig-equations-practice">
        <header>
          <h2>Practice Challenge</h2>
          <button type="button" onClick={nextChallenge}>
            <RefreshCw />
            New Challenge
          </button>
        </header>
        <p>{challenge.prompt}</p>
        <div>
          <input
            aria-label="Trig equation solutions"
            value={answer}
            placeholder="Enter solutions separated by commas (use π or pi)"
            onChange={(event) => {
              setAnswer(event.target.value);
              setResult("idle");
              onInteraction();
            }}
          />
          <button type="button" onClick={grade}>
            Check Answer
          </button>
        </div>
        <footer>
          <button
            type="button"
            onClick={() => {
              setHintOpen((value) => !value);
              onInteraction();
            }}
          >
            ⌁ &nbsp; Hint
          </button>
          <button
            type="button"
            onClick={() => {
              setSolutionOpen((value) => !value);
              onInteraction();
            }}
          >
            <Eye />
            Show Solution
          </button>
        </footer>
        {hintOpen ? <p className="hint">{challenge.hint}</p> : null}
        {solutionOpen ? (
          <p className="solution">{challenge.derivation}</p>
        ) : null}
        {result !== "idle" ? (
          <p role="status" className={result}>
            {result === "correct"
              ? "Correct. Every solution in the interval is included."
              : "Check the reference angles, periodic shifts, and interval endpoints."}
          </p>
        ) : null}
      </section>

      <nav className="target-trig-equations-nav">
        <a href="/lessons/trigonometry/268-double-and-half-angle-formulae">
          <ArrowLeft />
          <span>
            <b>Previous Lesson</b>Double- and Half-Angle Formulae
          </span>
        </a>
        <a href="/lessons/trigonometry/270-sine-rule">
          <span>
            <b>Next Lesson</b>Sine Rule
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

type EquationModel = ReturnType<typeof cosineEquationModel>;
function CosineEquationGraph({
  model,
  intervalMin,
  intervalMax,
  k,
  unit,
  onK,
}: {
  model: EquationModel;
  intervalMin: number;
  intervalMax: number;
  k: number;
  unit: UnitMode;
  onK: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    left = 24,
    right = 530,
    top = 23,
    bottom = 194;
  const xScale = (x: number) =>
    left + ((x - intervalMin) / (intervalMax - intervalMin)) * (right - left);
  const yScale = (y: number) => top + ((1.25 - y) / 2.5) * (bottom - top);
  const samples = Array.from(
    { length: 321 },
    (_, index) => intervalMin + (index / 320) * (intervalMax - intervalMin),
  );
  const path = samples
    .map(
      (x, index) => `${index ? "L" : "M"}${xScale(x)},${yScale(Math.cos(x))}`,
    )
    .join(" ");
  const move = (event: ReactPointerEvent<SVGCircleElement>) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onK(clamp(1.25 - ((point.y - top) / (bottom - top)) * 2.5, -1, 1));
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 550 225"
      role="img"
      aria-label="Cosine graph with draggable equation level"
    >
      {[-1, -0.5, 0, 0.5, 1].map((value) => (
        <line
          key={value}
          x1={left}
          x2={right}
          y1={yScale(value)}
          y2={yScale(value)}
          className={value === 0 ? "axis" : "grid"}
        />
      ))}
      <line
        x1={xScale(Math.max(intervalMin, 0))}
        x2={xScale(Math.max(intervalMin, 0))}
        y1={top}
        y2={bottom}
        className="axis"
      />
      <path d={path} className="cosine" />
      <line
        x1={left}
        x2={right}
        y1={yScale(k)}
        y2={yScale(k)}
        className="level"
      />
      <circle
        data-testid="trig-equation-level-handle"
        cx={right - 12}
        cy={yScale(k)}
        r="7"
        role="slider"
        aria-label="Draggable equation level"
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) move(event);
        }}
      />
      {model.solutions.map((x) => (
        <circle
          key={x}
          data-testid="trig-equation-intersection"
          cx={xScale(x)}
          cy={yScale(k)}
          r="5"
          className="intersection"
        />
      ))}
      {Array.from(
        { length: 9 },
        (_, index) => intervalMin + (index / 8) * (intervalMax - intervalMin),
      ).map((x) => (
        <g key={x}>
          <line
            x1={xScale(x)}
            x2={xScale(x)}
            y1={yScale(0) - 4}
            y2={yScale(0) + 4}
            className="tick"
          />
          <text x={xScale(x)} y={yScale(0) + 18} textAnchor="middle">
            {unit === "radian" ? formatPi(x) : `${round(toDegrees(x), 0)}°`}
          </text>
        </g>
      ))}
      <text x={right - 3} y={yScale(0) - 8}>
        x
      </text>
      <text x={xScale(Math.max(intervalMin, 0)) + 8} y={top + 6}>
        y
      </text>
    </svg>
  );
}
function FlowNode({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Calculator;
  title: string;
  children: string;
}) {
  return (
    <article>
      <Icon />
      <div>
        <b>{title}</b>
        <p>{children}</p>
      </div>
    </article>
  );
}
function MiniPeriodicGraph() {
  const points = Array.from(
    { length: 101 },
    (_, i) =>
      `${10 + i * 2.1},${70 - Math.cos(-2 * Math.PI + (i / 100) * 4 * Math.PI) * 29}`,
  ).join(" ");
  return (
    <svg
      viewBox="0 0 235 105"
      role="img"
      aria-label="Incomplete periodic solution sketch"
    >
      <line x1="10" x2="225" y1="70" y2="70" />
      <line x1="118" x2="118" y1="10" y2="98" />
      <polyline points={points} fill="none" />
      <line x1="10" x2="225" y1="46" y2="46" className="level" />
      <circle cx="48" cy="46" r="4" />
      <circle cx="170" cy="46" r="4" />
      <text x="5" y="100">
        −2π
      </text>
      <text x="218" y="100">
        2π
      </text>
    </svg>
  );
}
function cosineEquationModel(k: number, min: number, max: number) {
  const alpha = Math.acos(clamp(k, -1, 1)),
    solutions: number[] = [];
  for (let n = -8; n <= 8; n += 1)
    for (const value of [alpha + n * TAU, -alpha + n * TAU])
      if (
        value >= min - 1e-8 &&
        value <= max + 1e-8 &&
        !solutions.some((item) => Math.abs(item - value) < 1e-7)
      )
        solutions.push(value);
  solutions.sort((a, b) => a - b);
  return { alpha, solutions };
}
function parseSolutionList(value: string) {
  return value
    .split(/[,;]/)
    .map(parseMathValue)
    .filter((item): item is number => item !== null)
    .sort((a, b) => a - b);
}
function parseMathValue(raw: string) {
  const value = raw
    .trim()
    .toLowerCase()
    .replaceAll("π", "pi")
    .replaceAll(" ", "")
    .replaceAll("−", "-");
  if (!value) return null;
  if (!value.includes("pi")) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  const match = value.match(/^([+-]?)(\d*)pi(?:\/(\d+))?$/);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1,
    numerator = match[2] ? Number(match[2]) : 1,
    denominator = match[3] ? Number(match[3]) : 1;
  return (sign * numerator * Math.PI) / denominator;
}
function sameSolutions(actual: number[], expected: number[]) {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => Math.abs(value - expected[index]) < 1e-4)
  );
}
function formatPi(value: number) {
  if (Math.abs(value) < 1e-8) return "0";
  const fraction = approximateFraction(value / Math.PI, 24),
    sign = fraction.n < 0 ? "−" : "",
    numerator = Math.abs(fraction.n),
    top = numerator === 1 ? "" : String(numerator),
    bottom = fraction.d === 1 ? "" : `/${fraction.d}`;
  return `${sign}${top}π${bottom}`;
}
function approximateFraction(value: number, maxDenominator: number) {
  let best = { n: Math.round(value), d: 1, error: Infinity };
  for (let d = 1; d <= maxDenominator; d += 1) {
    const n = Math.round(value * d),
      error = Math.abs(value - n / d);
    if (error < best.error) best = { n, d, error };
  }
  const divisor = gcd(Math.abs(best.n), best.d);
  return { n: best.n / divisor, d: best.d / divisor };
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a || 1;
}
function round(value: number, places: number) {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}
function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
