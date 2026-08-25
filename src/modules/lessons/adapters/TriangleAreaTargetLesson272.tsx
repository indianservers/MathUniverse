import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  Hand,
  Info,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./TriangleAreaTargetLesson272.css";

type Point = { x: number; y: number };
type Vertex = "A" | "B" | "C";
type ControlMode = "sides" | "coordinates";
type PracticeState = "idle" | "correct" | "incorrect";

const INITIAL_POINTS: Record<Vertex, Point> = {
  A: { x: 0, y: 0 },
  B: { x: 4, y: 0 },
  C: { x: 2, y: 3 },
};

const PRACTICE = [
  { a: 8, b: 6, angle: 45 },
  { a: 7, b: 9, angle: 60 },
  { a: 5, b: 12, angle: 30 },
];

const LESSON_TABS = [
  { id: "interaction", label: "Interaction + Visualization", icon: "◉" },
  { id: "explain", label: "Explain", icon: "2" },
  { id: "examples", label: "Examples", icon: "∑" },
  { id: "practice", label: "Practice", icon: "♙" },
  { id: "know", label: "Know More", icon: "⌘" },
] as const;

export default function TriangleAreaTargetLesson272({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [controlMode, setControlMode] = useState<ControlMode>("sides");
  const [activeTab, setActiveTab] = useState("interaction");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceState, setPracticeState] = useState<PracticeState>("idle");
  const model = useMemo(() => triangleAreaModel(points), [points]);
  const question = PRACTICE[practiceIndex];
  const expectedPractice = sasArea(question.a, question.b, question.angle);

  const restore = () => {
    setPoints(INITIAL_POINTS);
    setControlMode("sides");
    setActiveTab("interaction");
    setPracticeIndex(0);
    setPracticeAnswer("");
    setPracticeState("idle");
  };

  useEffect(restore, [resetToken]);

  const updatePoint = (vertex: Vertex, point: Point) => {
    setPoints((current) => ({
      ...current,
      [vertex]: {
        x: clamp(point.x, -3.5, 7.5),
        y: clamp(point.y, -4.5, 5.5),
      },
    }));
    onInteraction();
  };

  const updateSas = (key: "a" | "b" | "angle", raw: number) => {
    const next = {
      a: key === "a" ? clamp(raw, 1, 10) : model.a,
      b: key === "b" ? clamp(raw, 1, 10) : model.b,
      angle: key === "angle" ? clamp(raw, 10, 170) : model.C,
    };
    setPoints(buildFromSas(points.C, next.a, next.b, next.angle));
    onInteraction();
  };

  const selectLessonTab = (id: string) => {
    setActiveTab(id);
    const target =
      id === "interaction"
        ? "triangle-area-lab"
        : id === "practice"
          ? "triangle-area-practice"
          : "triangle-area-learning";
    globalThis.document
      .getElementById(target)
      ?.scrollIntoView({ block: "start" });
    onInteraction();
  };

  const checkPractice = () => {
    const answer = Number(practiceAnswer);
    setPracticeState(
      Number.isFinite(answer) && Math.abs(answer - expectedPractice) <= 0.02
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  const nextQuestion = () => {
    setPracticeIndex((current) => (current + 1) % PRACTICE.length);
    setPracticeAnswer("");
    setPracticeState("idle");
    onInteraction();
  };

  return (
    <section
      className="target-triangle-area-page"
      data-testid="trigonometry-mockup-0329"
      data-dedicated-lesson="272"
      data-object-model="draggable-coordinate-triangle-sas-determinant-altitude-area-equivalence-model"
      data-side-a={model.a.toFixed(6)}
      data-side-b={model.b.toFixed(6)}
      data-base={model.c.toFixed(6)}
      data-height={model.height.toFixed(6)}
      data-angle-c={model.C.toFixed(6)}
      data-formula-area={model.formulaArea.toFixed(6)}
      data-base-height-area={model.baseHeightArea.toFixed(6)}
      data-determinant-area={model.determinantArea.toFixed(6)}
      data-difference={model.difference.toFixed(6)}
      data-practice-answer={expectedPractice.toFixed(6)}
      data-practice-result={practiceState}
      data-active-tab={activeTab}
      data-control-mode={controlMode}
    >
      <header className="target-triangle-area-header">
        <div>
          <span>Trigonometry</span>
          <span>Intermediate–Advanced</span>
        </div>
        <h1>Triangle Area Formula</h1>
        <p>Use one-half ab sin C.</p>
        <aside>
          <a href="#triangle-area-lab">
            <Sparkles /> Workspace
          </a>
          <button
            type="button"
            onClick={() => {
              restore();
              onInteraction();
            }}
          >
            <RotateCcw /> Reset
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(
                `Area = 1/2 ab sin C = ${model.formulaArea.toFixed(3)}`,
              );
              onInteraction();
            }}
          >
            <Share2 /> Share
          </button>
          <b>◷ 6–10 min</b>
        </aside>
      </header>

      <nav className="target-triangle-area-tabs" aria-label="Lesson views">
        {LESSON_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : ""}
            aria-pressed={activeTab === tab.id}
            onClick={() => selectLessonTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="target-triangle-area-flow">
        {[
          {
            Icon: Eye,
            title: "Observe",
            copy: "Explore how base, height and angle C affect area.",
          },
          {
            Icon: Hand,
            title: "Manipulate",
            copy: "Drag the triangle or sliders. Watch the area update.",
          },
          {
            Icon: Lightbulb,
            title: "Notice",
            copy: "Area depends on base, height and the included angle C.",
          },
          {
            Icon: Target,
            title: "Understand",
            copy: "A = 1/2 ab sin C gives the exact area of any triangle.",
          },
        ].map(({ Icon, title, copy }) => (
          <article key={title}>
            <Icon />
            <div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="target-triangle-area-lab" id="triangle-area-lab">
        <header>
          <div>
            <h2>Draggable Triangle Explorer</h2>
            <p>
              Drag vertices to reshape, or use sliders. Area updates instantly.
            </p>
          </div>
          <strong>
            <CheckCircle2 /> All good! Both methods match.
          </strong>
        </header>

        <div className="target-triangle-area-workspace">
          <article>
            <AreaTriangle points={points} model={model} onPoint={updatePoint} />
            <footer>
              <span className="base">base (AB)</span>
              <span className="height">height (CD)</span>
              <span className="side">sides AC and BC</span>
            </footer>
          </article>

          <aside>
            <nav>
              <button
                type="button"
                className={controlMode === "sides" ? "active" : ""}
                onClick={() => {
                  setControlMode("sides");
                  onInteraction();
                }}
              >
                Sides &amp; Angle
              </button>
              <button
                type="button"
                className={controlMode === "coordinates" ? "active" : ""}
                onClick={() => {
                  setControlMode("coordinates");
                  onInteraction();
                }}
              >
                Coordinates
              </button>
            </nav>
            {controlMode === "sides" ? (
              <SasControls model={model} onChange={updateSas} />
            ) : (
              <CoordinateControls points={points} onPoint={updatePoint} />
            )}
          </aside>
        </div>

        <section className="target-triangle-area-results">
          <article>
            <h2>Area by formula</h2>
            <strong>A = 1/2 ab sin C</strong>
            <p>
              = 1/2 ({model.a.toFixed(3)}) ({model.b.toFixed(3)}) sin{" "}
              {model.C.toFixed(2)}°
            </p>
            <b>= {model.formulaArea.toFixed(3)} square units</b>
          </article>
          <article>
            <h2>Area by base–height</h2>
            <strong>A = 1/2 × base × height</strong>
            <p>
              = 1/2 ({model.c.toFixed(3)}) ({model.height.toFixed(3)})
            </p>
            <b>= {model.baseHeightArea.toFixed(3)} square units</b>
          </article>
          <article>
            <h2>Area of triangle</h2>
            <output>{model.determinantArea.toFixed(3)} square units</output>
            <p>
              Difference: <b>{model.difference.toFixed(3)}</b> <CheckCircle2 />
            </p>
            <small>(Exact numerical match)</small>
          </article>
        </section>

        <footer className="target-triangle-area-match">
          <Check />
          <p>
            <b>The two methods match.</b>
            The altitude is the perpendicular component of either adjacent side,
            so 1/2 ab sin C equals 1/2 base × height.
          </p>
        </footer>
      </section>

      <section
        className="target-triangle-area-learning"
        id="triangle-area-learning"
      >
        <article>
          <h2>
            <BookOpen /> Formula / Rule
          </h2>
          <p>
            For any triangle with sides a and b including angle C between them,
          </p>
          <strong>A = 1/2 ab sin C</strong>
          <p>Where</p>
          <ul>
            <li>a, b are the two sides</li>
            <li>C is the included angle between a and b</li>
            <li>A is the area of the triangle</li>
          </ul>
          <footer>
            <b>Domain: 0° &lt; C &lt; 180°</b>
            <span>Sign: sin C &gt; 0 in this domain, so A &gt; 0</span>
          </footer>
        </article>
        <article>
          <h2>
            <Sparkles /> Worked Example
          </h2>
          <p>
            Find the area of a triangle with a = 7, b = 9, and included angle C
            = 60°.
          </p>
          <h3>Solution</h3>
          <strong>
            A = 1/2 ab sin C
            <br />= 1/2 (7)(9) sin 60°
            <br />= 31.5 × √3/2
            <br />= {sasArea(7, 9, 60).toFixed(2)} square units
          </strong>
        </article>
        <article>
          <h2>
            <AlertTriangle /> Common Misconception
          </h2>
          <p>Do not use the angle opposite a side.</p>
          <strong>
            1/2 ab sin C uses the angle C included between sides a and b.
          </strong>
          <p>Using any other angle gives the wrong area.</p>
          <MisconceptionTriangle />
        </article>
      </section>

      <section
        className="target-triangle-area-practice"
        id="triangle-area-practice"
      >
        <header>
          <div>
            <h2>Quick Practice</h2>
            <p>Solve and check.</p>
          </div>
          <button type="button" onClick={nextQuestion}>
            <RefreshCw /> New Question
          </button>
        </header>
        <div>
          <article>
            <p>
              <b>Q.</b> A triangle has a = {question.a}, b = {question.b}, and
              included angle C = {question.angle}°.
              <br /> Find its area.
            </p>
            <label>
              Your answer
              <span>
                <input
                  aria-label="Triangle area practice answer"
                  type="number"
                  step="0.01"
                  value={practiceAnswer}
                  placeholder="??"
                  onChange={(event) => {
                    setPracticeAnswer(event.target.value);
                    setPracticeState("idle");
                    onInteraction();
                  }}
                />
                sq. units
              </span>
            </label>
            <button type="button" onClick={checkPractice}>
              <Check /> Check
            </button>
          </article>
          <aside>
            <div>
              <h3>Solution</h3>
              <strong>
                A = 1/2 ({question.a})({question.b}) sin {question.angle}°
                <br />= {(question.a * question.b * 0.5).toFixed(2)} × sin{" "}
                {question.angle}°
                <br />= {expectedPractice.toFixed(2)} square units
              </strong>
            </div>
            <section className={practiceState}>
              {practiceState === "correct" ? (
                <>
                  <Award />
                  <b>Great job!</b>
                  <strong>Correct.</strong>
                </>
              ) : practiceState === "incorrect" ? (
                <>
                  <Info />
                  <b>Try again</b>
                  <strong>Use the included angle.</strong>
                </>
              ) : (
                <>
                  <Award />
                  <b>Your result</b>
                  <strong>Ready to check</strong>
                </>
              )}
            </section>
          </aside>
        </div>
      </section>

      <nav className="target-triangle-area-nav" aria-label="Adjacent lessons">
        <a href="/lessons/trigonometry/271-cosine-rule">
          <ArrowLeft />
          <span>
            <b>Previous</b>Cosine Rule
          </span>
        </a>
        <a href="/lessons/trigonometry/273-bearings">
          <span>
            <b>Next</b>Bearings
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

type AreaModel = ReturnType<typeof triangleAreaModel>;

function AreaTriangle({
  points,
  model,
  onPoint,
}: {
  points: Record<Vertex, Point>;
  model: AreaModel;
  onPoint: (vertex: Vertex, point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const map = (point: Point) => ({
    x: 185 + point.x * 39,
    y: 207 - point.y * 39,
  });
  const A = map(points.A);
  const B = map(points.B);
  const C = map(points.C);
  const D = map(model.foot);

  const move = (event: ReactPointerEvent<SVGCircleElement>, vertex: Vertex) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint(vertex, { x: (point.x - 185) / 39, y: (207 - point.y) / 39 });
  };

  return (
    <svg
      ref={svg}
      viewBox="0 0 390 370"
      role="img"
      aria-label="Draggable coordinate triangle and altitude"
    >
      {Array.from({ length: 11 }, (_, index) => index - 4).map((value) => (
        <g key={value}>
          <line
            className="grid"
            x1={185 + value * 39}
            x2={185 + value * 39}
            y1="15"
            y2="355"
          />
          <line
            className="grid"
            x1="15"
            x2="375"
            y1={207 + value * 39}
            y2={207 + value * 39}
          />
        </g>
      ))}
      <line className="axis" x1="15" x2="375" y1="207" y2="207" />
      <line className="axis" x1="185" x2="185" y1="15" y2="355" />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} />
      <line className="altitude" x1={C.x} y1={C.y} x2={D.x} y2={D.y} />
      <path className="right-angle" d={`M ${D.x} ${D.y - 16} h 16 v 16`} />
      {(["A", "B", "C"] as Vertex[]).map((vertex) => {
        const point = vertex === "A" ? A : vertex === "B" ? B : C;
        return (
          <g key={vertex}>
            <circle
              data-testid={`triangle-area-vertex-${vertex.toLowerCase()}`}
              role="slider"
              aria-label={`Triangle area vertex ${vertex}`}
              tabIndex={0}
              cx={point.x}
              cy={point.y}
              r="7"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                move(event, vertex);
              }}
              onPointerMove={(event) => {
                if (event.buttons === 1) move(event, vertex);
              }}
            />
            <text x={point.x + (vertex === "B" ? 10 : -42)} y={point.y - 10}>
              {vertex}({points[vertex].x.toFixed(1)},{" "}
              {points[vertex].y.toFixed(1)})
            </text>
          </g>
        );
      })}
      <circle className="foot" cx={D.x} cy={D.y} r="4" />
      <text x={D.x - 15} y={D.y + 22}>
        D({model.foot.x.toFixed(1)}, {model.foot.y.toFixed(1)})
      </text>
    </svg>
  );
}

function SasControls({
  model,
  onChange,
}: {
  model: AreaModel;
  onChange: (key: "a" | "b" | "angle", value: number) => void;
}) {
  return (
    <section className="target-triangle-area-controls">
      <AreaSlider
        label="Side a = BC"
        name="Triangle area side a"
        value={model.a}
        min={1}
        max={10}
        step={0.1}
        onChange={(value) => onChange("a", value)}
      />
      <AreaSlider
        label="Side b = AC"
        name="Triangle area side b"
        value={model.b}
        min={1}
        max={10}
        step={0.1}
        onChange={(value) => onChange("b", value)}
      />
      <AreaSlider
        label="Included angle C"
        name="Triangle area included angle"
        value={model.C}
        min={10}
        max={170}
        step={1}
        degree
        onChange={(value) => onChange("angle", value)}
      />
      <footer>
        <b>Measured ∠C = {model.C.toFixed(2)}°</b>
        <span>From sides BC and AC.</span>
      </footer>
    </section>
  );
}

function AreaSlider({
  label,
  name,
  value,
  min,
  max,
  step,
  degree = false,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  degree?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <b>{label}</b>
      <span>
        <input
          aria-label={`${name} slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={name}
          type="number"
          min={min}
          max={max}
          step={step}
          value={degree ? value.toFixed(2) : value.toFixed(3)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {degree ? "°" : ""}
      </span>
      <small>
        {min}
        {degree ? "°" : ""}
        <i>
          {max}
          {degree ? "°" : ""}
        </i>
      </small>
    </label>
  );
}

function CoordinateControls({
  points,
  onPoint,
}: {
  points: Record<Vertex, Point>;
  onPoint: (vertex: Vertex, point: Point) => void;
}) {
  return (
    <section className="target-triangle-area-coordinates">
      {(["A", "B", "C"] as Vertex[]).map((vertex) => (
        <fieldset key={vertex}>
          <legend>Vertex {vertex}</legend>
          <label>
            x
            <input
              aria-label={`Vertex ${vertex} x coordinate`}
              type="number"
              step="0.1"
              value={points[vertex].x}
              onChange={(event) =>
                onPoint(vertex, {
                  ...points[vertex],
                  x: Number(event.target.value),
                })
              }
            />
          </label>
          <label>
            y
            <input
              aria-label={`Vertex ${vertex} y coordinate`}
              type="number"
              step="0.1"
              value={points[vertex].y}
              onChange={(event) =>
                onPoint(vertex, {
                  ...points[vertex],
                  y: Number(event.target.value),
                })
              }
            />
          </label>
        </fieldset>
      ))}
      <footer>Coordinates update the same geometric model.</footer>
    </section>
  );
}

function MisconceptionTriangle() {
  return (
    <svg
      viewBox="0 0 250 105"
      role="img"
      aria-label="Included angle compared with an opposite angle"
    >
      <polygon points="20,90 220,90 165,18" />
      <path className="wrong" d="M 43 90 A 24 24 0 0 0 31 70" />
      <path className="correct" d="M 203 90 A 24 24 0 0 1 210 69" />
      <text x="10" y="102">
        A
      </text>
      <text x="225" y="102">
        B
      </text>
      <text x="162" y="14">
        C
      </text>
      <text className="wrong-label" x="7" y="67">
        wrong angle
      </text>
      <text className="correct-label" x="173" y="65">
        included
      </text>
    </svg>
  );
}

function triangleAreaModel(points: Record<Vertex, Point>) {
  const a = distance(points.B, points.C);
  const b = distance(points.A, points.C);
  const c = distance(points.A, points.B);
  const safeA = Math.max(a, 1e-6);
  const safeB = Math.max(b, 1e-6);
  const cosC = clamp(
    (safeA * safeA + safeB * safeB - c * c) / (2 * safeA * safeB),
    -1,
    1,
  );
  const C = radiansToDegrees(Math.acos(cosC));
  const determinantArea = Math.abs(
    ((points.B.x - points.A.x) * (points.C.y - points.A.y) -
      (points.B.y - points.A.y) * (points.C.x - points.A.x)) /
      2,
  );
  const baseVector = { x: points.B.x - points.A.x, y: points.B.y - points.A.y };
  const baseSquared = Math.max(c * c, 1e-8);
  const projection =
    ((points.C.x - points.A.x) * baseVector.x +
      (points.C.y - points.A.y) * baseVector.y) /
    baseSquared;
  const foot = {
    x: points.A.x + projection * baseVector.x,
    y: points.A.y + projection * baseVector.y,
  };
  const height = distance(points.C, foot);
  const formulaArea = sasArea(a, b, C);
  const baseHeightArea = 0.5 * c * height;
  return {
    a,
    b,
    c,
    C,
    foot,
    height,
    formulaArea,
    baseHeightArea,
    determinantArea,
    difference: Math.max(
      Math.abs(formulaArea - baseHeightArea),
      Math.abs(baseHeightArea - determinantArea),
    ),
  };
}

function buildFromSas(
  C: Point,
  a: number,
  b: number,
  angle: number,
): Record<Vertex, Point> {
  const baseDirection = degreesToRadians(-123.6900675);
  const secondDirection = baseDirection + degreesToRadians(angle);
  return {
    C,
    A: {
      x: C.x + b * Math.cos(baseDirection),
      y: C.y + b * Math.sin(baseDirection),
    },
    B: {
      x: C.x + a * Math.cos(secondDirection),
      y: C.y + a * Math.sin(secondDirection),
    },
  };
}

function sasArea(a: number, b: number, angle: number) {
  return 0.5 * a * b * Math.sin(degreesToRadians(angle));
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
