import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Languages,
  RotateCcw,
  Share2,
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
import "./BearingsTargetLesson273.css";

type Point = { x: number; y: number };
type Vertex = "A" | "B";
type Unit = "grid" | "km";
type PracticeState = "idle" | "correct" | "incorrect";

const INITIAL: Record<Vertex, Point> = {
  A: { x: 0, y: 0 },
  B: { x: 6, y: 4 },
};

const QUICK_DIRECTIONS = {
  NE: { x: 6, y: 4 },
  SE: { x: 6, y: -4 },
  SW: { x: -6, y: -4 },
  NW: { x: -6, y: 4 },
  E: { x: 6, y: 0 },
  W: { x: -6, y: 0 },
} as const;

const VIEWS = [
  ["interaction", "◉", "Interaction + visualization"],
  ["explain", "▤", "Explain"],
  ["examples", "♙", "Examples"],
  ["formulas", "∑", "Formulas"],
  ["know", "⌘", "Know more"],
] as const;

export default function BearingsTargetLesson273({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL);
  const [unit, setUnit] = useState<Unit>("grid");
  const [activeView, setActiveView] = useState("interaction");
  const [practiceChoice, setPracticeChoice] = useState<number | null>(null);
  const [practiceState, setPracticeState] = useState<PracticeState>("correct");
  const model = useMemo(() => bearingModel(points), [points]);
  const practiceBearing = 318;
  const practiceAnswer = reverseBearing(practiceBearing);

  const restore = () => {
    setPoints(INITIAL);
    setUnit("grid");
    setActiveView("interaction");
    setPracticeChoice(null);
    setPracticeState("correct");
  };
  useEffect(restore, [resetToken]);

  const updatePoint = (vertex: Vertex, point: Point) => {
    setPoints((current) => ({
      ...current,
      [vertex]: {
        x: clamp(point.x, -6, 6),
        y: clamp(point.y, -5, 5),
      },
    }));
    onInteraction();
  };

  const setDirection = (direction: keyof typeof QUICK_DIRECTIONS) => {
    const offset = QUICK_DIRECTIONS[direction];
    setPoints((current) => ({
      ...current,
      B: {
        x: clamp(current.A.x + offset.x, -6, 6),
        y: clamp(current.A.y + offset.y, -5, 5),
      },
    }));
    onInteraction();
  };

  const selectView = (view: string) => {
    setActiveView(view);
    const target =
      view === "interaction"
        ? "bearings-route-map"
        : view === "examples" || view === "formulas"
          ? "bearings-learning"
          : "bearings-flow";
    globalThis.document
      .getElementById(target)
      ?.scrollIntoView({ block: "start" });
    onInteraction();
  };

  const choosePractice = (choice: number) => {
    setPracticeChoice(choice);
    setPracticeState(choice === practiceAnswer ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      className="target-bearings-page"
      data-testid="trigonometry-mockup-0330"
      data-dedicated-lesson="273"
      data-object-model="draggable-north-grid-route-clockwise-bearing-reverse-quadrant-distance-model"
      data-bearing={model.bearing.toFixed(6)}
      data-bearing-three-digit={formatBearing(model.bearing)}
      data-reverse-bearing={model.reverse.toFixed(6)}
      data-distance={model.distance.toFixed(6)}
      data-delta-x={model.dx.toFixed(6)}
      data-delta-y={model.dy.toFixed(6)}
      data-quadrant={model.quadrant}
      data-unit={unit}
      data-active-view={activeView}
      data-practice-result={practiceState}
      data-practice-choice={practiceChoice ?? ""}
    >
      <header className="target-bearings-header">
        <div>
          <span>Trigonometry</span>
          <span>Trigonometry</span>
        </div>
        <h1>Bearings</h1>
        <p>Apply direction conventions.</p>
        <section>
          <b>♙ Intermediate–Advanced</b>
          <b>ϟ Visual Lab</b>
          <b>▣ Trig Graphing / Geometry</b>
          <b>◷ 6–10 min</b>
        </section>
        <aside>
          <label>
            <Languages />
            <select
              aria-label="Lesson language"
              defaultValue="en"
              onChange={() => onInteraction()}
            >
              <option value="en">English (English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </label>
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
                `A to B bearing ${formatBearing(model.bearing)} degrees; reverse ${formatBearing(model.reverse)} degrees`,
              );
              onInteraction();
            }}
          >
            <Share2 /> Share
          </button>
          <a href="#bearings-route-map">▣ &nbsp; Workspace</a>
        </aside>
      </header>

      <nav className="target-bearings-tabs" aria-label="Lesson views">
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

      <section className="target-bearings-map" id="bearings-route-map">
        <header>
          <b>Interaction + Visualization</b>
          <h2>Route map: bearings on a north grid</h2>
          <p>
            Drag points A and B to explore. Bearings are measured clockwise from
            north.
          </p>
        </header>
        <div>
          <article>
            <BearingMap points={points} model={model} onPoint={updatePoint} />
          </article>
          <section>
            <h2>A → B</h2>
            <p>
              <b>Bearing (three-digit)</b>
              <strong>{formatBearing(model.bearing)}°</strong>
            </p>
            <p>
              <b>Reverse bearing (B → A)</b>
              <strong>{formatBearing(model.reverse)}°</strong>
            </p>
            <p>
              <b>Distance</b>
              <strong>{displayDistance(model.distance, unit)}</strong>
            </p>
            <p>
              <b>Quadrant</b>
              <strong>{model.quadrant}</strong>
            </p>
          </section>
          <aside>
            <h2>Points</h2>
            <CoordinatePair
              vertex="A"
              label="A (start)"
              point={points.A}
              onPoint={updatePoint}
            />
            <CoordinatePair
              vertex="B"
              label="B (destination)"
              point={points.B}
              onPoint={updatePoint}
            />
            <hr />
            <h3>Quick set</h3>
            <div>
              {(
                Object.keys(QUICK_DIRECTIONS) as Array<
                  keyof typeof QUICK_DIRECTIONS
                >
              ).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  className={model.quadrant === direction ? "active" : ""}
                  onClick={() => setDirection(direction)}
                >
                  {direction}
                </button>
              ))}
            </div>
          </aside>
        </div>
        <footer>
          <span>
            ☝ Drag A or B to change the route. Watch the clockwise arc from
            north to the line AB.
          </span>
          <label>
            Units
            <select
              aria-label="Bearing distance units"
              value={unit}
              onChange={(event) => {
                setUnit(event.target.value as Unit);
                onInteraction();
              }}
            >
              <option value="grid">Grid</option>
              <option value="km">km</option>
            </select>
          </label>
        </footer>
      </section>

      <section className="target-bearings-flow" id="bearings-flow">
        <FlowCard
          number="1"
          title="Observe"
          copy="The bearing is the angle measured clockwise from north."
        >
          <MiniBearing bearing={35} />
        </FlowCard>
        <FlowCard
          number="2"
          title="Manipulate"
          copy="Drag points to change direction and distance."
        >
          <MiniRoute />
        </FlowCard>
        <FlowCard
          number="3"
          title="Notice"
          copy="Reverse bearing = add or subtract 180°."
        >
          <MiniReverse />
        </FlowCard>
        <FlowCard
          number="4"
          title="Understand"
          copy="Bearings are always written with three digits."
        >
          <div className="target-bearings-three">
            <b>007°</b>
            <b>090°</b>
            <b>225°</b>
            <span>✓</span>
            <span>✓</span>
            <span>✓</span>
          </div>
        </FlowCard>
      </section>

      <section className="target-bearings-learning" id="bearings-learning">
        <article>
          <h2>Rule (the formula)</h2>
          <p>Bearings are measured clockwise from north (000°).</p>
          <CompassRule />
          <footer>
            <b>Reverse bearing (B → A) is:</b>
            <strong>θᵦₐ = (θₐᵦ + 180°) mod 360°</strong>
            <span>• Add 180° if θₐᵦ &lt; 180°</span>
            <span>• Subtract 180° if θₐᵦ ≥ 180°</span>
          </footer>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>
            From A({points.A.x.toFixed(1)}, {points.A.y.toFixed(1)}) to B(
            {points.B.x.toFixed(1)}, {points.B.y.toFixed(1)}).
          </p>
          <BearingMap points={points} model={model} compact />
          <ol>
            <li>
              Bearing A → B = {formatBearing(model.bearing)}° (clockwise from
              north).
            </li>
            <li>
              Reverse bearing B → A = ({formatBearing(model.bearing)}° + 180°)
              mod 360° = {formatBearing(model.reverse)}°.
            </li>
          </ol>
          <footer>
            <b>Answer:</b>
            <span>A → B = {formatBearing(model.bearing)}°</span>
            <i>|</i>
            <span>B → A = {formatBearing(model.reverse)}°</span>
          </footer>
        </article>
        <article>
          <h2>
            <AlertTriangle /> Watch out! Common mistake
          </h2>
          <p>Measuring anticlockwise from north gives the wrong bearing.</p>
          <WrongBearing bearing={model.bearing} />
          <footer>
            Bearings must be measured <b>clockwise from north</b> and written
            with three digits.
          </footer>
        </article>
      </section>

      <section className="target-bearings-practice">
        <header>
          <h2>Practice challenge</h2>
          <p>
            Find the missing bearing. Check your answer to get instant feedback.
          </p>
        </header>
        <div>
          <article>
            <p>
              Given: Bearing A → B = {formatBearing(practiceBearing)}°.
              <br />
              <b>What is the reverse bearing B → A?</b>
            </p>
            <div>
              {[138, 42, 318, 222].map((choice, index) => (
                <button
                  key={choice}
                  type="button"
                  className={practiceChoice === choice ? practiceState : ""}
                  aria-label={`Practice option ${String.fromCharCode(65 + index)} ${formatBearing(choice)} degrees`}
                  onClick={() => choosePractice(choice)}
                >
                  <b>{String.fromCharCode(65 + index)}</b>
                  {formatBearing(choice)}°
                </button>
              ))}
            </div>
          </article>
          <PracticeCompass />
          <aside className={practiceState}>
            <h2>Solution</h2>
            <p>
              Reverse bearing = ({formatBearing(practiceBearing)}° − 180°) mod
              360° = {formatBearing(practiceAnswer)}°.
            </p>
            <strong>
              {practiceState === "correct"
                ? "Correct answer: A"
                : practiceState === "incorrect"
                  ? "Try again: add or subtract 180°."
                  : "Choose an answer to check."}
            </strong>
          </aside>
        </div>
      </section>

      <nav className="target-bearings-nav" aria-label="Adjacent lessons">
        <a href="/lessons/trigonometry/272-triangle-area-formula">
          <ArrowLeft />
          <span>
            <b>Previous</b>Triangle Area Formula
          </span>
        </a>
        <a href="/lessons/trigonometry/274-elevation-and-depression">
          <span>
            <b>Next</b>Elevation and Depression
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

type BearingModel = ReturnType<typeof bearingModel>;

function BearingMap({
  points,
  model,
  onPoint = () => undefined,
  compact = false,
}: {
  points: Record<Vertex, Point>;
  model: BearingModel;
  onPoint?: (vertex: Vertex, point: Point) => void;
  compact?: boolean;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const scale = compact ? 24 : 27;
  const center = compact ? { x: 150, y: 112 } : { x: 175, y: 155 };
  const map = (point: Point) => ({
    x: center.x + point.x * scale,
    y: center.y - point.y * scale,
  });
  const A = map(points.A),
    B = map(points.B);
  const radius = compact ? 40 : 50;
  const arcEnd = bearingPoint(A, radius, model.bearing);
  const move = (event: ReactPointerEvent<SVGCircleElement>, vertex: Vertex) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix || compact) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint(vertex, {
      x: (point.x - center.x) / scale,
      y: (center.y - point.y) / scale,
    });
  };
  return (
    <svg
      ref={svg}
      viewBox={compact ? "0 0 320 220" : "0 0 390 320"}
      role="img"
      aria-label={
        compact ? "Worked bearing map" : "Draggable north-grid bearing map"
      }
    >
      {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => (
        <g key={value}>
          <line
            className="grid"
            x1={center.x + value * scale}
            x2={center.x + value * scale}
            y1="16"
            y2={compact ? 204 : 304}
          />
          <line
            className="grid"
            x1="15"
            x2={compact ? 305 : 375}
            y1={center.y + value * scale}
            y2={center.y + value * scale}
          />
        </g>
      ))}
      <line
        className="axis"
        x1="15"
        x2={compact ? 305 : 375}
        y1={A.y}
        y2={A.y}
      />
      <line
        className="axis"
        x1={A.x}
        x2={A.x}
        y1="15"
        y2={compact ? 205 : 305}
      />
      <text x={A.x - 5} y="14">
        N
      </text>
      <text x={compact ? 306 : 376} y={A.y + 4}>
        E
      </text>
      <text x={A.x - 5} y={compact ? 218 : 318}>
        S
      </text>
      <text x="2" y={A.y + 4}>
        W
      </text>
      <line className="route" x1={A.x} y1={A.y} x2={B.x} y2={B.y} />
      <path
        className="bearing-arc"
        d={`M ${A.x} ${A.y - radius} A ${radius} ${radius} 0 ${model.bearing > 180 ? 1 : 0} 1 ${arcEnd.x} ${arcEnd.y}`}
      />
      <text className="bearing-label" x={A.x + 60} y={A.y - 22}>
        {formatBearing(model.bearing)}°
      </text>
      {(["A", "B"] as Vertex[]).map((vertex) => {
        const point = vertex === "A" ? A : B;
        return (
          <g key={vertex}>
            <circle
              data-testid={
                compact ? undefined : `bearing-vertex-${vertex.toLowerCase()}`
              }
              role={compact ? undefined : "slider"}
              aria-label={compact ? undefined : `Bearing vertex ${vertex}`}
              tabIndex={compact ? undefined : 0}
              cx={point.x}
              cy={point.y}
              r={compact ? 6 : 7}
              onPointerDown={(event) => {
                if (!compact) {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  move(event, vertex);
                }
              }}
              onPointerMove={(event) => {
                if (!compact && event.buttons === 1) move(event, vertex);
              }}
            />
            <text x={point.x + 9} y={point.y + (vertex === "A" ? 18 : -8)}>
              {vertex}
              {compact
                ? `(${points[vertex].x.toFixed(1)}, ${points[vertex].y.toFixed(1)})`
                : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CoordinatePair({
  vertex,
  label,
  point,
  onPoint,
}: {
  vertex: Vertex;
  label: string;
  point: Point;
  onPoint: (vertex: Vertex, point: Point) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <label>
        x
        <input
          aria-label={`Bearing point ${vertex} x`}
          type="number"
          min="-6"
          max="6"
          step="1"
          value={point.x}
          onChange={(event) =>
            onPoint(vertex, { ...point, x: Number(event.target.value) })
          }
        />
      </label>
      <label>
        y
        <input
          aria-label={`Bearing point ${vertex} y`}
          type="number"
          min="-5"
          max="5"
          step="1"
          value={point.y}
          onChange={(event) =>
            onPoint(vertex, { ...point, y: Number(event.target.value) })
          }
        />
      </label>
    </fieldset>
  );
}

function FlowCard({
  number,
  title,
  copy,
  children,
}: {
  number: string;
  title: string;
  copy: string;
  children: ReactNode;
}) {
  return (
    <article>
      <h2>
        <span>{number}</span>
        {title}
      </h2>
      <p>{copy}</p>
      {children}
    </article>
  );
}
function MiniBearing({ bearing }: { bearing: number }) {
  const end = bearingPoint({ x: 35, y: 85 }, 70, bearing);
  return (
    <svg viewBox="0 0 150 105">
      <line x1="35" y1="90" x2="35" y2="15" />
      <line className="route" x1="35" y1="90" x2={end.x} y2={end.y} />
      <path d="M35 55 A35 35 0 0 1 55 61" />
      <text x="28" y="12">
        N
      </text>
    </svg>
  );
}
function MiniRoute() {
  return (
    <svg viewBox="0 0 150 105">
      <path className="dashed" d="M15 92 Q55 42 130 22" />
      <circle cx="58" cy="58" r="6" />
      <circle cx="125" cy="24" r="6" />
    </svg>
  );
}
function MiniReverse() {
  return (
    <svg viewBox="0 0 150 105">
      <path d="M30 62 A45 35 0 0 1 120 62" />
      <path d="M120 62 A45 35 0 0 1 30 62" />
      <circle cx="30" cy="62" r="6" />
      <circle cx="120" cy="62" r="6" />
      <text x="64" y="19">
        +180°
      </text>
      <text x="64" y="101">
        −180°
      </text>
    </svg>
  );
}
function CompassRule() {
  return (
    <svg
      viewBox="0 0 210 140"
      role="img"
      aria-label="Bearing compass convention"
    >
      <line x1="105" y1="15" x2="105" y2="125" />
      <line x1="45" y1="70" x2="165" y2="70" />
      <path d="M105 30 A40 40 0 0 1 145 70" />
      <text x="100" y="12">
        000° N
      </text>
      <text x="165" y="74">
        E 090°
      </text>
      <text x="91" y="138">
        S 180°
      </text>
      <text x="4" y="74">
        270° W
      </text>
    </svg>
  );
}
function WrongBearing({ bearing }: { bearing: number }) {
  const wrong = normalizeBearing(360 - bearing),
    end = bearingPoint({ x: 58, y: 90 }, 55, bearing);
  return (
    <svg
      viewBox="0 0 230 120"
      role="img"
      aria-label="Incorrect anticlockwise bearing"
    >
      <line x1="58" y1="95" x2="58" y2="15" />
      <line className="route" x1="58" y1="95" x2={end.x} y2={end.y} />
      <path d="M58 40 A55 55 0 0 0 25 84" />
      <text x="51" y="13">
        N
      </text>
      <text x="145" y="55">
        This gives {formatBearing(wrong)}°
      </text>
      <text x="145" y="70">
        (incorrect).
      </text>
    </svg>
  );
}

function PracticeCompass() {
  return (
    <svg
      className="target-bearings-practice-compass"
      viewBox="0 0 130 95"
      role="img"
      aria-label="Bearing practice compass"
    >
      <rect x="24" y="18" width="78" height="62" rx="8" />
      <path d="M35 18 Q40 5 53 10 L73 18" />
      <circle cx="64" cy="49" r="20" />
      <circle cx="64" cy="49" r="10" />
      <line x1="64" y1="49" x2="55" y2="35" />
      <text x="58" y="27">
        N
      </text>
    </svg>
  );
}

function bearingModel(points: Record<Vertex, Point>) {
  const dx = points.B.x - points.A.x,
    dy = points.B.y - points.A.y,
    distance = Math.hypot(dx, dy),
    bearing =
      distance < 1e-8
        ? 0
        : normalizeBearing(radiansToDegrees(Math.atan2(dx, dy))),
    reverse = reverseBearing(bearing),
    quadrant = quadrantOf(dx, dy);
  return { dx, dy, distance, bearing, reverse, quadrant };
}
function quadrantOf(dx: number, dy: number) {
  if (Math.abs(dx) < 1e-8 && Math.abs(dy) < 1e-8) return "Same point";
  if (Math.abs(dx) < 1e-8) return dy >= 0 ? "N" : "S";
  if (Math.abs(dy) < 1e-8) return dx >= 0 ? "E" : "W";
  return `${dy > 0 ? "N" : "S"}${dx > 0 ? "E" : "W"}`;
}
function bearingPoint(origin: Point, radius: number, bearing: number) {
  const angle = degreesToRadians(bearing);
  return {
    x: origin.x + radius * Math.sin(angle),
    y: origin.y - radius * Math.cos(angle),
  };
}
function reverseBearing(bearing: number) {
  return normalizeBearing(bearing + 180);
}
function normalizeBearing(value: number) {
  return ((value % 360) + 360) % 360;
}
function formatBearing(value: number) {
  return String(Math.round(normalizeBearing(value))).padStart(3, "0");
}
function displayDistance(value: number, unit: Unit) {
  return unit === "km"
    ? `${(value * 10).toFixed(1)} km`
    : `${value.toFixed(2)} grid`;
}
function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}
function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
