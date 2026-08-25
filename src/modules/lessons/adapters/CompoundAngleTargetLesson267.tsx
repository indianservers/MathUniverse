import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Hand,
  Languages,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Share2,
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
import "./CompoundAngleTargetLesson267.css";

type ProjectionSettings = {
  projections: boolean;
  coordinates: boolean;
  grid: boolean;
};
type Challenge = {
  prompt: string;
  split: string;
  choices: string[];
  correct: number;
  derivation: string[];
};
const INITIAL_ALPHA = 40,
  INITIAL_BETA = 75;
const CHALLENGES: Challenge[] = [
  {
    prompt: "Find cos(105°).",
    split: "105° = 60° + 45°",
    choices: [
      "−(√6 − √2) / 4",
      "(√6 − √2) / 4",
      "(√6 + √2) / 4",
      "−(√6 + √2) / 4",
    ],
    correct: 0,
    derivation: [
      "cos(105°) = cos 60° cos 45° − sin 60° sin 45°",
      "= (1/2)(√2/2) − (√3/2)(√2/2)",
      "= (√2 − √6)/4 = −(√6 − √2)/4",
    ],
  },
  {
    prompt: "Find sin(75°).",
    split: "75° = 45° + 30°",
    choices: ["(√6 + √2) / 4", "(√6 − √2) / 4", "−(√6 + √2) / 4", "1/2"],
    correct: 0,
    derivation: [
      "sin(75°) = sin 45° cos 30° + cos 45° sin 30°",
      "= (√2/2)(√3/2) + (√2/2)(1/2)",
      "= (√6 + √2)/4",
    ],
  },
];

export default function CompoundAngleTargetLesson267({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [alpha, setAlpha] = useState(INITIAL_ALPHA),
    [beta, setBeta] = useState(INITIAL_BETA),
    [settings, setSettings] = useState<ProjectionSettings>({
      projections: true,
      coordinates: true,
      grid: false,
    }),
    [challengeIndex, setChallengeIndex] = useState(0),
    [choice, setChoice] = useState<number | null>(0),
    [practiceResult, setPracticeResult] = useState<
      "idle" | "correct" | "incorrect"
    >("correct");
  const model = useMemo(() => compoundModel(alpha, beta), [alpha, beta]),
    challenge = CHALLENGES[challengeIndex];
  useEffect(() => {
    setAlpha(INITIAL_ALPHA);
    setBeta(INITIAL_BETA);
    setSettings({ projections: true, coordinates: true, grid: false });
    setChallengeIndex(0);
    setChoice(0);
    setPracticeResult("correct");
  }, [resetToken]);
  const updateAngle = (kind: "alpha" | "beta", value: number) => {
    (kind === "alpha" ? setAlpha : setBeta)(normalizeSigned(value));
    onInteraction();
  };
  const reset = () => {
    setAlpha(INITIAL_ALPHA);
    setBeta(INITIAL_BETA);
    setSettings({ projections: true, coordinates: true, grid: false });
    setChallengeIndex(0);
    setChoice(0);
    setPracticeResult("correct");
    onInteraction();
  };
  const toggle = (key: keyof ProjectionSettings) => {
    setSettings((state) => ({ ...state, [key]: !state[key] }));
    onInteraction();
  };
  const nextChallenge = () => {
    setChallengeIndex((value) => (value + 1) % CHALLENGES.length);
    setChoice(null);
    setPracticeResult("idle");
    onInteraction();
  };
  return (
    <section
      className="target-compound-page"
      data-testid="trigonometry-mockup-0324"
      data-dedicated-lesson="267"
      data-object-model="dual-unit-circle-rotation-sum-difference-projection-formula-model"
      data-alpha={alpha.toFixed(6)}
      data-beta={beta.toFixed(6)}
      data-sum={model.sum.toFixed(6)}
      data-difference={model.difference.toFixed(6)}
      data-cos-sum={model.cosSum.toFixed(6)}
      data-sin-sum={model.sinSum.toFixed(6)}
      data-cos-difference={model.cosDifference.toFixed(6)}
      data-sin-difference={model.sinDifference.toFixed(6)}
      data-projections={settings.projections}
      data-coordinates={settings.coordinates}
      data-grid={settings.grid}
      data-challenge-index={challengeIndex}
      data-choice={choice ?? "none"}
      data-practice-result={practiceResult}
    >
      <header className="target-compound-header">
        <section>
          <span>Trigonometry</span>
          <span>Trigonometry</span>
        </section>
        <h1>Compound-Angle Formulae</h1>
        <p>Understand sum and difference identities.</p>
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
                `α=${formatAngle(alpha)}, β=${formatAngle(beta)}, α+β=${formatAngle(model.sum)}`,
              );
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button
            type="button"
            onClick={() => {
              document
                .querySelector(".target-compound-workspace")
                ?.scrollIntoView({ behavior: "smooth" });
              onInteraction();
            }}
          >
            ↗ Workspace
          </button>
        </footer>
      </header>
      <section className="target-compound-flow">
        <Flow icon={Eye} title="Observe">
          See two angles on the unit circle and their components.
        </Flow>
        <Flow icon={Hand} title="Manipulate">
          Drag the angle handles to change α and β. Watch projections.
        </Flow>
        <Flow icon={Lightbulb} title="Notice">
          Notice the pattern in x and y components (cos, sin).
        </Flow>
        <Flow icon={Target} title="Understand">
          Derive the sum and difference formulae.
        </Flow>
      </section>
      <section className="target-compound-workspace">
        <header>
          <div>
            <h2>Explore on the unit circle</h2>
            <p>
              Drag the angle handles on the circle to see the sum and difference
              identities in action.
            </p>
          </div>
          <b>
            <CheckCircle2 />
            All projections correct
          </b>
        </header>
        <div>
          <article>
            <CompoundCircle
              alpha={alpha}
              beta={beta}
              settings={settings}
              onAngle={updateAngle}
            />
            <section>
              {(["projections", "coordinates", "grid"] as const).map((key) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={() => toggle(key)}
                  />
                  Show {key}
                </label>
              ))}
            </section>
            <footer>
              <span>● &nbsp; α = {formatAngle(alpha)}</span>
              <span>● &nbsp; β = {formatAngle(beta)}</span>
              <b>Units: degrees</b>
            </footer>
          </article>
          <aside>
            <AngleTable alpha={alpha} beta={beta} onAngle={updateAngle} />
            <FormulaResult
              title={`Sum angle: α + β = ${formatAngle(model.sum)}`}
              color="cyan"
              rows={[
                ["cos(α + β)", "cos α cos β − sin α sin β", model.cosSum],
                ["sin(α + β)", "sin α cos β + cos α sin β", model.sinSum],
              ]}
            />
            <FormulaResult
              title={`Difference angle: α − β = ${formatAngle(model.difference)}`}
              color="violet"
              rows={[
                [
                  "cos(α − β)",
                  "cos α cos β + sin α sin β",
                  model.cosDifference,
                ],
                [
                  "sin(α − β)",
                  "sin α cos β − cos α sin β",
                  model.sinDifference,
                ],
              ]}
            />
            <p>♧ &nbsp; Tip: Try dragging α and β into different quadrants.</p>
          </aside>
        </div>
      </section>
      <section className="target-compound-formulas">
        <h2>
          The Compound-
          <br />
          Angle Formulae
        </h2>
        <article>
          <h3>♨ &nbsp; Sum Identities</h3>
          <p>cos(α + β) = cos α cos β − sin α sin β</p>
          <p>sin(α + β) = sin α cos β + cos α sin β</p>
        </article>
        <article>
          <h3>◉ &nbsp; Difference Identities</h3>
          <p>cos(α − β) = cos α cos β + sin α sin β</p>
          <p>sin(α − β) = sin α cos β − cos α sin β</p>
        </article>
        <aside>
          <h3>Domain</h3>
          <b>α, β ∈ R</b>
          <p>
            Results are defined
            <br />
            for all real angles.
          </p>
        </aside>
      </section>
      <section className="target-compound-learning">
        <article>
          <h2>
            <CheckCircle2 />
            Worked Example
          </h2>
          <h3>Find sin(15°) using the identity for sin(α − β).</h3>
          <p>Let α = 45°, β = 30°.</p>
          <div>
            <section>
              <p>sin(15°) = sin(45° − 30°)</p>
              <p>= sin 45° cos 30° − cos 45° sin 30°</p>
              <p>= (√2/2)(√3/2) − (√2/2)(1/2)</p>
              <p>= √6/4 − √2/4</p>
            </section>
            <WorkedCircle />
            <footer>
              <Fraction top="√6 − √2" bottom="4" /> ≈ 0.2588 <CheckCircle2 />
            </footer>
          </div>
        </article>
        <aside>
          <h2>
            <TriangleAlert />
            Common Misconception
          </h2>
          <h3>
            Do not add or subtract sines
            <br />
            or cosines directly!
          </h3>
          <p>Incorrect: &nbsp; sin(α + β) = sin α + sin β</p>
          <p>Incorrect: &nbsp; cos(α − β) = cos α − cos β</p>
          <h3>Why it’s wrong:</h3>
          <p>
            Sine and cosine are not linear functions. Use the compound-angle
            identities (products of sines and cosines), not simple addition or
            subtraction.
          </p>
          <b>×</b>
        </aside>
      </section>
      <section className="target-compound-practice">
        <header>
          <h2>♜ &nbsp; Quick Practice</h2>
          <p>Solve using compound-angle identities.</p>
          <button type="button" onClick={nextChallenge}>
            <RefreshCw />
            New Challenge
          </button>
        </header>
        <div>
          <article>
            <h3>
              <span>1</span>
              {challenge.prompt}
            </h3>
            <div>
              {challenge.choices.map((answer, index) => (
                <button
                  type="button"
                  key={answer}
                  className={choice === index ? "selected" : ""}
                  onClick={() => {
                    setChoice(index);
                    setPracticeResult(
                      index === challenge.correct ? "correct" : "incorrect",
                    );
                    onInteraction();
                  }}
                >
                  <i>{String.fromCharCode(65 + index)}</i>
                  <b>{answer}</b>
                  {choice === index && practiceResult === "correct" ? (
                    <Check />
                  ) : null}
                </button>
              ))}
            </div>
          </article>
          <aside className={practiceResult}>
            <h2>
              {practiceResult === "correct"
                ? "Correct! 🎉"
                : practiceResult === "incorrect"
                  ? "Try again"
                  : "Choose an answer"}
            </h2>
            <p>{challenge.split}</p>
            {challenge.derivation.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <b>
              {practiceResult === "correct"
                ? "Well done!"
                : "Use the matching sum or difference identity."}
            </b>
          </aside>
        </div>
      </section>
      <nav className="target-compound-nav">
        <a href="/lessons/trigonometry/266-trig-identities">
          <ArrowLeft />
          <span>
            <b>Previous</b>Trig Identities
          </span>
        </a>
        <a href="/lessons/trigonometry/268-double-and-half-angle-formulae">
          <span>
            <b>Next</b>Double- and Half-Angle Formulae
          </span>
          <ArrowRight />
        </a>
      </nav>
      <span className="sr-only">
        Compound-angle identities combine two rotations.
      </span>
    </section>
  );
}
function Flow({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Eye;
  title: string;
  children: string;
}) {
  return (
    <article>
      <Icon />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}
function CompoundCircle({
  alpha,
  beta,
  settings,
  onAngle,
}: {
  alpha: number;
  beta: number;
  settings: ProjectionSettings;
  onAngle: (kind: "alpha" | "beta", value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    cx = 218,
    cy = 252,
    r = 168,
    a = point(cx, cy, r, alpha),
    b = point(cx, cy, r, beta);
  const move = (
    event: ReactPointerEvent<SVGSVGElement>,
    kind: "alpha" | "beta",
  ) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onAngle(kind, toDegrees(Math.atan2(cy - p.y, p.x - cx)));
  };
  const drag =
    (kind: "alpha" | "beta") =>
    (event: ReactPointerEvent<SVGCircleElement>) => {
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      move(event, kind);
    };
  const dragMove =
    (kind: "alpha" | "beta") =>
    (event: ReactPointerEvent<SVGCircleElement>) => {
      if (event.buttons === 1) move(event, kind);
    };
  return (
    <svg
      ref={svg}
      viewBox="0 0 430 430"
      role="img"
      aria-label="Two draggable compound-angle vectors"
    >
      {settings.grid
        ? [...Array(11)].map((_, i) => (
            <g key={i}>
              <line
                x1={50 + i * 30}
                x2={50 + i * 30}
                y1="45"
                y2="425"
                className="grid"
              />
              <line
                x1="45"
                x2="390"
                y1={70 + i * 30}
                y2={70 + i * 30}
                className="grid"
              />
            </g>
          ))
        : null}
      <line x1="25" x2="420" y1={cy} y2={cy} />
      <line x1={cx} x2={cx} y1="15" y2="425" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#64748b" />
      <path
        d={arcPath(cx, cy, 48, 0, alpha)}
        fill="none"
        stroke="#06b6d4"
        strokeWidth="2"
      />
      <path
        d={arcPath(cx, cy, 67, alpha, beta)}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <line
        x1={cx}
        y1={cy}
        x2={a.x}
        y2={a.y}
        stroke="#06b6d4"
        strokeWidth="3"
      />
      <line
        x1={cx}
        y1={cy}
        x2={b.x}
        y2={b.y}
        stroke="#7c3aed"
        strokeWidth="3"
      />
      {settings.projections ? (
        <>
          <line
            x1={a.x}
            x2={a.x}
            y1={a.y}
            y2={cy}
            stroke="#06b6d4"
            strokeDasharray="5 4"
          />
          <line
            x1={a.x}
            x2={cx}
            y1={a.y}
            y2={a.y}
            stroke="#06b6d4"
            strokeDasharray="5 4"
          />
          <line
            x1={b.x}
            x2={b.x}
            y1={b.y}
            y2={cy}
            stroke="#7c3aed"
            strokeDasharray="5 4"
          />
          <line
            x1={b.x}
            x2={cx}
            y1={b.y}
            y2={b.y}
            stroke="#7c3aed"
            strokeDasharray="5 4"
          />
        </>
      ) : null}
      <circle
        data-testid="compound-alpha-handle"
        cx={a.x}
        cy={a.y}
        r="8"
        fill="#06b6d4"
        onPointerDown={drag("alpha")}
        onPointerMove={dragMove("alpha")}
      />
      <circle
        data-testid="compound-beta-handle"
        cx={b.x}
        cy={b.y}
        r="8"
        fill="#7c3aed"
        onPointerDown={drag("beta")}
        onPointerMove={dragMove("beta")}
      />
      <text x={a.x + 10} y={a.y - 10} fill="#0891b2">
        α = {formatAngle(alpha)}
      </text>
      <text x={b.x - 72} y={b.y + 5} fill="#7c3aed">
        β = {formatAngle(beta)}
      </text>
      {settings.coordinates ? (
        <>
          <text x={a.x + 10} y={a.y + 10} fill="#0891b2">
            ({Math.cos(toRadians(alpha)).toFixed(2)},{" "}
            {Math.sin(toRadians(alpha)).toFixed(2)})
          </text>
          <text x={b.x - 80} y={b.y - 12} fill="#7c3aed">
            ({Math.cos(toRadians(beta)).toFixed(2)},{" "}
            {Math.sin(toRadians(beta)).toFixed(2)})
          </text>
        </>
      ) : null}
      <text x="416" y={cy + 15}>
        x
      </text>
      <text x={cx + 8} y="17">
        y
      </text>
      <text x={cx - 17} y={cy + 18}>
        O
      </text>
    </svg>
  );
}
function AngleTable({
  alpha,
  beta,
  onAngle,
}: {
  alpha: number;
  beta: number;
  onAngle: (kind: "alpha" | "beta", value: number) => void;
}) {
  return (
    <section className="target-compound-angle-table">
      <header>
        <h3>Angles</h3>
        <label>
          α ={" "}
          <input
            aria-label="Alpha angle"
            type="number"
            value={Number(alpha.toFixed(1))}
            onChange={(event) => onAngle("alpha", Number(event.target.value))}
          />
          °
        </label>
        <label>
          β ={" "}
          <input
            aria-label="Beta angle"
            type="number"
            value={Number(beta.toFixed(1))}
            onChange={(event) => onAngle("beta", Number(event.target.value))}
          />
          °
        </label>
      </header>
      <div>
        <b />
        <b>x (cos)</b>
        <b>y (sin)</b>
        <strong>cos α</strong>
        <span>{Math.cos(toRadians(alpha)).toFixed(4)}</span>
        <span>{Math.sin(toRadians(alpha)).toFixed(4)}</span>
        <strong>sin β</strong>
        <span>{Math.cos(toRadians(beta)).toFixed(4)}</span>
        <span>{Math.sin(toRadians(beta)).toFixed(4)}</span>
      </div>
    </section>
  );
}
function FormulaResult({
  title,
  color,
  rows,
}: {
  title: string;
  color: string;
  rows: Array<[string, string, number]>;
}) {
  return (
    <section className={`target-compound-result ${color}`}>
      <h3>{title}</h3>
      {rows.map(([label, formula, value]) => (
        <div key={label}>
          <b>{label}</b>
          <span>= &nbsp; {formula}</span>
          <strong>{value.toFixed(4)}</strong>
          <CheckCircle2 />
        </div>
      ))}
    </section>
  );
}
function WorkedCircle() {
  return (
    <svg viewBox="0 0 180 150">
      <line x1="20" x2="165" y1="92" y2="92" />
      <line x1="80" x2="80" y1="10" y2="140" />
      <circle cx="80" cy="92" r="55" fill="none" stroke="#94a3b8" />
      <line x1="80" y1="92" x2="126" y2="46" stroke="#06b6d4" strokeWidth="2" />
      <line x1="80" y1="92" x2="132" y2="62" stroke="#7c3aed" strokeWidth="2" />
      <circle cx="126" cy="46" r="4" fill="#06b6d4" />
      <circle cx="132" cy="62" r="4" fill="#7c3aed" />
      <text x="128" y="37" fill="#0891b2">
        (cos45°, sin45°)
      </text>
      <text x="133" y="61" fill="#7c3aed">
        (cos30°, sin30°)
      </text>
    </svg>
  );
}
function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="target-compound-fraction">
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}
function compoundModel(alpha: number, beta: number) {
  const ar = toRadians(alpha),
    br = toRadians(beta),
    sum = alpha + beta,
    difference = alpha - beta;
  return {
    sum,
    difference,
    cosSum: Math.cos(ar) * Math.cos(br) - Math.sin(ar) * Math.sin(br),
    sinSum: Math.sin(ar) * Math.cos(br) + Math.cos(ar) * Math.sin(br),
    cosDifference: Math.cos(ar) * Math.cos(br) + Math.sin(ar) * Math.sin(br),
    sinDifference: Math.sin(ar) * Math.cos(br) - Math.cos(ar) * Math.sin(br),
  };
}
function point(cx: number, cy: number, r: number, angle: number) {
  const rad = toRadians(angle);
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}
function arcPath(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
) {
  const a = point(cx, cy, r, start),
    b = point(cx, cy, r, end),
    large = Math.abs(end - start) > 180 ? 1 : 0,
    sweep = end >= start ? 0 : 1;
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} ${sweep} ${b.x} ${b.y}`;
}
function normalizeSigned(value: number) {
  if (!Number.isFinite(value)) return 0;
  const next = ((((value + 180) % 360) + 360) % 360) - 180;
  return Math.abs(next + 180) < 1e-8 ? 180 : next;
}
function formatAngle(value: number) {
  return `${Number(value.toFixed(1))}°`;
}
function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}
