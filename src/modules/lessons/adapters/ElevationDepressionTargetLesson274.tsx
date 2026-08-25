import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Info,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ElevationDepressionTargetLesson274.css";

type Point = { x: number; y: number };
type Vertex = "observer" | "target";
type SightMode = "elevation" | "depression";
type PracticeState = "idle" | "correct" | "incorrect";

const INITIAL = {
  observer: { x: 0, y: 0 },
  target: { x: 90, y: 90 },
};

const VIEWS = [
  ["interaction", "◉", "Interaction + Visualization"],
  ["explain", "▤", "Explain"],
  ["examples", "♙", "Examples"],
  ["formulas", "∑", "Formulas"],
  ["know", "⌘", "Know more"],
] as const;

export default function ElevationDepressionTargetLesson274({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL);
  const [mode, setMode] = useState<SightMode>("elevation");
  const [activeView, setActiveView] = useState("interaction");
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceState, setPracticeState] = useState<PracticeState>("idle");
  const [solutionOpen, setSolutionOpen] = useState(true);
  const model = useMemo(() => sightModel(points), [points]);
  const expectedPractice = twoStationHeight(32, 48, 50);

  const restore = () => {
    setPoints(INITIAL);
    setMode("elevation");
    setActiveView("interaction");
    setPracticeAnswer("");
    setPracticeState("idle");
    setSolutionOpen(true);
  };
  useEffect(restore, [resetToken]);

  const updatePoint = (vertex: Vertex, point: Point) => {
    const next = {
      x: clamp(point.x, -100, 250),
      y: clamp(point.y, -180, 220),
    };
    setPoints((current) => ({ ...current, [vertex]: next }));
    if (vertex === "target") {
      const observer = points.observer;
      setMode(next.y >= observer.y ? "elevation" : "depression");
    } else {
      const target = points.target;
      setMode(target.y >= next.y ? "elevation" : "depression");
    }
    onInteraction();
  };

  const setSightMode = (nextMode: SightMode) => {
    setMode(nextMode);
    setPoints((current) => ({
      ...current,
      target: {
        x: current.observer.x + Math.max(model.adjacent, 1),
        y:
          current.observer.y +
          (nextMode === "elevation" ? model.opposite : -model.opposite),
      },
    }));
    onInteraction();
  };

  const updateTriangle = (
    key: "angle" | "height" | "distance",
    raw: number,
  ) => {
    const sign = mode === "elevation" ? 1 : -1;
    const angle = key === "angle" ? clamp(raw, 1, 89) : model.angle;
    const opposite = key === "height" ? clamp(raw, 1, 500) : model.opposite;
    const adjacent = key === "distance" ? clamp(raw, 1, 1000) : model.adjacent;
    let nextOpposite = opposite;
    let nextAdjacent = adjacent;
    if (key === "angle")
      nextOpposite = nextAdjacent * Math.tan(toRadians(angle));
    if (key === "height")
      nextAdjacent = nextOpposite / Math.tan(toRadians(angle));
    if (key === "distance")
      nextOpposite = nextAdjacent * Math.tan(toRadians(angle));
    setPoints((current) => ({
      ...current,
      target: {
        x: current.observer.x + nextAdjacent,
        y: current.observer.y + sign * nextOpposite,
      },
    }));
    onInteraction();
  };

  const selectView = (view: string) => {
    setActiveView(view);
    const target =
      view === "interaction"
        ? "elevation-lab"
        : view === "examples" || view === "formulas"
          ? "elevation-learning"
          : "elevation-flow";
    globalThis.document
      .getElementById(target)
      ?.scrollIntoView({ block: "start" });
    onInteraction();
  };

  const checkPractice = () => {
    const answer = Number(practiceAnswer);
    setPracticeState(
      Number.isFinite(answer) && Math.abs(answer - expectedPractice) <= 0.05
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="target-elevation-page"
      data-testid="trigonometry-mockup-0331"
      data-dedicated-lesson="274"
      data-object-model="draggable-observer-target-horizontal-sightline-elevation-depression-right-triangle-model"
      data-mode={mode}
      data-angle={model.angle.toFixed(6)}
      data-opposite={model.opposite.toFixed(6)}
      data-adjacent={model.adjacent.toFixed(6)}
      data-hypotenuse={model.hypotenuse.toFixed(6)}
      data-tangent={model.tangent.toFixed(6)}
      data-identity-difference={model.difference.toFixed(6)}
      data-active-view={activeView}
      data-practice-answer={expectedPractice.toFixed(6)}
      data-practice-result={practiceState}
      data-solution-open={solutionOpen}
    >
      <header className="target-elevation-header">
        <div>
          <span>Trigonometry</span>
          <span>Intermediate–Advanced</span>
          <span>Visual Lab</span>
        </div>
        <h1>Elevation and Depression</h1>
        <p>Model heights and distances.</p>
        <aside>
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
                `${mode}: angle ${model.angle.toFixed(2)} degrees, height ${model.opposite.toFixed(2)} m, distance ${model.adjacent.toFixed(2)} m`,
              );
              onInteraction();
            }}
          >
            <Share2 /> Share
          </button>
          <a href="#elevation-lab">▣ &nbsp; Workspace</a>
        </aside>
      </header>

      <nav className="target-elevation-tabs" aria-label="Lesson views">
        {VIEWS.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            className={activeView === id ? "active" : ""}
            aria-pressed={activeView === id}
            onClick={() => selectView(id)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <section className="target-elevation-flow" id="elevation-flow">
        <Flow Icon={Eye} number="1" title="Observe">
          Study the model. Identify angle, height and distance.
        </Flow>
        <Flow Icon={Hand} number="2" title="Manipulate">
          Drag the target or adjust angle / height to see changes.
        </Flow>
        <Flow Icon={Lightbulb} number="3" title="Notice">
          Watch how opposite, adjacent and hypotenuse change.
        </Flow>
        <Flow Icon={Target} number="4" title="Understand">
          Elevation ▲ goes up. Depression ▼ goes down. Use tan θ = opp / adj.
        </Flow>
      </section>

      <section className="target-elevation-lab" id="elevation-lab">
        <header>
          <h2>
            Survey side view (drag the target) <Info />
          </h2>
        </header>
        <div>
          <article>
            <SightDiagram
              points={points}
              model={model}
              mode={mode}
              onPoint={updatePoint}
            />
          </article>
          <aside>
            <header>
              <b>Feedback</b>
              <span>
                <Check /> Correct
              </span>
              <strong>
                tan {model.angle.toFixed(0)}° = {model.opposite.toFixed(0)} /{" "}
                {model.adjacent.toFixed(0)} = {model.tangent.toFixed(3)}
              </strong>
            </header>
            <nav>
              <button
                type="button"
                className={mode === "elevation" ? "active" : ""}
                onClick={() => setSightMode("elevation")}
              >
                Elevation ▲
              </button>
              <button
                type="button"
                className={mode === "depression" ? "active" : ""}
                onClick={() => setSightMode("depression")}
              >
                Depression ▼
              </button>
            </nav>
            <SightSlider
              label={`Angle of ${mode} (θ)`}
              name="Sight angle"
              value={model.angle}
              min={1}
              max={89}
              step={1}
              degree
              onChange={(value) => updateTriangle("angle", value)}
            />
            <SightSlider
              label="Height (opposite)"
              name="Sight height"
              value={model.opposite}
              min={1}
              max={500}
              step={1}
              suffix="m"
              onChange={(value) => updateTriangle("height", value)}
            />
            <SightSlider
              label="Distance (adjacent)"
              name="Sight distance"
              value={model.adjacent}
              min={1}
              max={1000}
              step={1}
              suffix="m"
              onChange={(value) => updateTriangle("distance", value)}
            />
            <footer>
              All lengths are in meters (m).
              <br />
              Angle is in degrees (°).
            </footer>
          </aside>
        </div>
        <footer>
          <Metric label="Angle (θ)" value={`${model.angle.toFixed(1)}°`} />
          <Metric
            label="Opposite (height)"
            value={`${model.opposite.toFixed(1)} m`}
          />
          <Metric
            label="Adjacent (distance)"
            value={`${model.adjacent.toFixed(1)} m`}
          />
          <Metric
            label="Hypotenuse (line of sight)"
            value={`${model.hypotenuse.toFixed(2)} m`}
          />
        </footer>
      </section>

      <section className="target-elevation-learning" id="elevation-learning">
        <article>
          <h2>Relevant Rule / Formula</h2>
          <p>In a right triangle:</p>
          <strong>tan θ = opposite / adjacent</strong>
          <p>
            <b>Elevation:</b> θ measured upward ▲
          </p>
          <p>
            <b>Depression:</b> θ measured downward ▼
          </p>
          <p>
            <b>Signs:</b> Opposite is +ve for elevation, −ve for depression if
            measured from horizontal.
          </p>
        </article>
        <article>
          <h2>Worked Example (Elevation)</h2>
          <p>
            From a point on level ground, the angle of elevation to the top of a
            tower is 30°. The distance from the observer to the foot is 80 m.
          </p>
          <h3>Solution</h3>
          <strong>
            tan 30° = height / 80
            <br />⇒ 0.5774 = height / 80
            <br />⇒ height = 0.5774 × 80 = {heightFromAngle(30, 80).toFixed(
              2,
            )}{" "}
            m
          </strong>
          <footer>Answer: {heightFromAngle(30, 80).toFixed(2)} m</footer>
        </article>
        <article>
          <h2>
            <AlertTriangle /> Common Misconception
          </h2>
          <h3>Mixing up opposite and adjacent.</h3>
          <p>
            For elevation/depression, the height (vertical) is the opposite
            side. The horizontal distance is the adjacent side.
          </p>
          <MisconceptionDiagram />
        </article>
      </section>

      <section className="target-elevation-practice">
        <article>
          <h2>Practice Challenge</h2>
          <p>
            From a point on the ground, the angle of elevation to the top of a
            hill is 32°.
          </p>
          <p>
            If you walk 50 m closer to the hill, the angle of elevation becomes
            48°. Find the height of the hill.
          </p>
        </article>
        <section>
          <label>
            Your Answer{" "}
            <span>
              Height ={" "}
              <input
                aria-label="Elevation practice height"
                type="number"
                step="0.01"
                value={practiceAnswer}
                onChange={(event) => {
                  setPracticeAnswer(event.target.value);
                  setPracticeState("idle");
                  onInteraction();
                }}
              />{" "}
              m
            </span>
          </label>
          <button type="button" onClick={checkPractice}>
            Check Answer
          </button>
          <output className={practiceState}>
            {practiceState === "correct"
              ? "Correct!"
              : practiceState === "incorrect"
                ? "Try again."
                : ""}
          </output>
        </section>
        <aside>
          <button
            type="button"
            aria-expanded={solutionOpen}
            onClick={() => {
              setSolutionOpen((current) => !current);
              onInteraction();
            }}
          >
            ⌄ &nbsp; Show Solution <span>{solutionOpen ? "⌃" : "⌄"}</span>
          </button>
          {solutionOpen ? (
            <div>
              <p>Let height = h, initial distance = x.</p>
              <strong>
                tan 32° = h/x, &nbsp; tan 48° = h/(x − 50)
                <br />⇒ h ≈ {expectedPractice.toFixed(2)} m
              </strong>
              <footer>Answer: {expectedPractice.toFixed(2)} m</footer>
            </div>
          ) : null}
        </aside>
      </section>

      <nav className="target-elevation-nav" aria-label="Adjacent lessons">
        <a href="/lessons/trigonometry/273-bearings">
          <ArrowLeft />
          <span>
            <b>Previous</b>Bearings
          </span>
        </a>
        <a href="/lessons/trigonometry/275-harmonic-motion">
          <span>
            <b>Next</b>Harmonic Motion
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

type SightModel = ReturnType<typeof sightModel>;

function Flow({
  Icon,
  number,
  title,
  children,
}: {
  Icon: typeof Eye;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article>
      <Icon />
      <div>
        <h2>
          <span>{number}</span>
          {title}
        </h2>
        <p>{children}</p>
      </div>
    </article>
  );
}

function SightDiagram({
  points,
  model,
  mode,
  onPoint,
}: {
  points: typeof INITIAL;
  model: SightModel;
  mode: SightMode;
  onPoint: (vertex: Vertex, point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const bounds = { left: 45, right: 490, top: 35, bottom: 330 };
  const extentX = Math.max(model.adjacent, 100),
    extentY = Math.max(model.opposite, 100);
  const map = (point: Point) => ({
    x:
      bounds.left +
      ((point.x - points.observer.x) / extentX) * (bounds.right - bounds.left),
    y:
      points.observer.y === point.y
        ? 285
        : 285 - ((point.y - points.observer.y) / extentY) * 235,
  });
  const observer = map(points.observer),
    target = map(points.target),
    foot = { x: target.x, y: observer.y };
  const move = (event: ReactPointerEvent<SVGCircleElement>, vertex: Vertex) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const x =
      points.observer.x +
      ((p.x - bounds.left) / (bounds.right - bounds.left)) * extentX;
    const y = points.observer.y + ((285 - p.y) / 235) * extentY;
    onPoint(vertex, { x, y });
  };
  const arcY = mode === "elevation" ? observer.y - 23 : observer.y + 23;
  return (
    <svg
      ref={svg}
      viewBox="0 0 540 355"
      role="img"
      aria-label="Draggable elevation and depression survey diagram"
    >
      <line className="ground" x1="30" x2="515" y1="315" y2="315" />
      <line
        className="horizontal"
        x1={observer.x}
        x2={foot.x}
        y1={observer.y}
        y2={observer.y}
      />
      <line
        className="sight"
        x1={observer.x}
        y1={observer.y}
        x2={target.x}
        y2={target.y}
      />
      <line
        className="height"
        x1={target.x}
        y1={target.y}
        x2={foot.x}
        y2={foot.y}
      />
      <rect
        className="building"
        x={target.x - 23}
        y={Math.min(target.y, foot.y)}
        width="46"
        height={Math.abs(foot.y - target.y)}
      />
      <path
        className="angle"
        d={`M ${observer.x + 44} ${observer.y} A 44 44 0 0 ${mode === "elevation" ? 0 : 1} ${observer.x + 32} ${arcY}`}
      />
      <ObserverIcon x={observer.x} y={observer.y} />
      <circle
        data-testid="sight-observer-handle"
        role="slider"
        aria-label="Sight observer"
        tabIndex={0}
        cx={observer.x}
        cy={observer.y}
        r="8"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event, "observer");
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) move(event, "observer");
        }}
      />
      <circle
        data-testid="sight-target-handle"
        role="slider"
        aria-label="Sight target"
        tabIndex={0}
        cx={target.x}
        cy={target.y}
        r="9"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event, "target");
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) move(event, "target");
        }}
      />
      <text className="target-label" x={target.x + 20} y={target.y - 14}>
        Target (drag me)
        <tspan x={target.x + 20} dy="18">
          ({model.adjacent.toFixed(0)},{" "}
          {(mode === "elevation" ? model.opposite : -model.opposite).toFixed(0)}{" "}
          m)
        </tspan>
      </text>
      <text
        className="sight-label"
        x={(observer.x + target.x) / 2 - 20}
        y={(observer.y + target.y) / 2 - 20}
      >
        Line of sight
        <tspan x={(observer.x + target.x) / 2 - 20} dy="17">
          h = {model.hypotenuse.toFixed(2)} m
        </tspan>
      </text>
      <text className="angle-label" x={observer.x + 63} y={observer.y - 12}>
        {model.angle.toFixed(1)}°
      </text>
      <text
        className="distance-label"
        x={(observer.x + foot.x) / 2 - 35}
        y="345"
      >
        Distance = {model.adjacent.toFixed(1)} m
      </text>
      <text
        className="height-label"
        x={target.x + 32}
        y={(target.y + foot.y) / 2}
      >
        Height
        <tspan x={target.x + 32} dy="17">
          = {model.opposite.toFixed(1)} m
        </tspan>
      </text>
    </svg>
  );
}

function ObserverIcon({ x, y }: Point) {
  return (
    <g className="observer">
      <circle cx={x - 18} cy={y + 17} r="7" />
      <line x1={x - 18} y1={y + 24} x2={x - 18} y2={y + 48} />
      <line x1={x - 18} y1={y + 31} x2={x - 30} y2={y + 40} />
      <line x1={x - 18} y1={y + 31} x2={x - 7} y2={y + 22} />
      <line x1={x - 18} y1={y + 48} x2={x - 28} y2={y + 62} />
      <line x1={x - 18} y1={y + 48} x2={x - 8} y2={y + 62} />
    </g>
  );
}

function SightSlider({
  label,
  name,
  value,
  min,
  max,
  step,
  degree = false,
  suffix = "",
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  degree?: boolean;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="target-elevation-slider">
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
          value={value.toFixed(degree ? 2 : 1)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {degree ? "°" : suffix}
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
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <b>{label}</b>
      <strong>{value}</strong>
    </div>
  );
}
function MisconceptionDiagram() {
  return (
    <svg
      viewBox="0 0 250 130"
      role="img"
      aria-label="Opposite height and adjacent horizontal distance"
    >
      <line className="adjacent" x1="25" y1="108" x2="220" y2="108" />
      <line className="opposite" x1="220" y1="108" x2="220" y2="18" />
      <line className="hypotenuse" x1="25" y1="108" x2="220" y2="18" />
      <text x="115" y="125">
        Adjacent (distance)
      </text>
      <text x="183" y="15">
        Opposite (height)
      </text>
    </svg>
  );
}

function sightModel(points: typeof INITIAL) {
  const dx = points.target.x - points.observer.x,
    dy = points.target.y - points.observer.y,
    adjacent = Math.max(Math.abs(dx), 1e-8),
    opposite = Math.abs(dy),
    hypotenuse = Math.hypot(dx, dy),
    angle = toDegrees(Math.atan2(opposite, adjacent)),
    tangent = opposite / adjacent;
  return {
    adjacent,
    opposite,
    hypotenuse,
    angle,
    tangent,
    difference: Math.abs(Math.tan(toRadians(angle)) - tangent),
  };
}
function heightFromAngle(angle: number, distance: number) {
  return distance * Math.tan(toRadians(angle));
}
function twoStationHeight(first: number, second: number, step: number) {
  const a = Math.tan(toRadians(first)),
    b = Math.tan(toRadians(second));
  return (step * a * b) / (b - a);
}
function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
