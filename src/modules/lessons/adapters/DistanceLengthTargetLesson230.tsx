import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleDot,
  Eye,
  Gauge,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Ruler,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type MainDrag = "a" | "b" | null;
type PracticeDrag = "p" | "q" | null;
type Tool = "point" | "segment" | "measure" | "midpoint" | "perpendicular";
type Reflection = "very" | "close" | "far";

const INITIAL_A = { x: -4, y: -2 };
const INITIAL_B = { x: 2, y: 3 };
const PRACTICE_PAIRS = [
  [
    { x: -3, y: 1 },
    { x: 4, y: -2 },
  ],
  [
    { x: -4, y: -3 },
    { x: 2, y: 1 },
  ],
  [
    { x: -2, y: 4 },
    { x: 3, y: -2 },
  ],
] as const;

export default function DistanceLengthTargetLesson230({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Point>(INITIAL_A);
  const [b, setB] = useState<Point>(INITIAL_B);
  const [mainDrag, setMainDrag] = useState<MainDrag>(null);
  const [tool, setTool] = useState<Tool>("segment");
  const [grid, setGrid] = useState(1);
  const [units, setUnits] = useState("units");
  const [showComponents, setShowComponents] = useState(true);
  const [pointsVisible, setPointsVisible] = useState(2);
  const [stage, setStage] = useState(0);
  const [quickReference, setQuickReference] = useState(false);
  const [challenge, setChallenge] = useState(0);
  const [practiceP, setPracticeP] = useState<Point>(PRACTICE_PAIRS[0][0]);
  const [practiceQ, setPracticeQ] = useState<Point>(PRACTICE_PAIRS[0][1]);
  const [practiceDrag, setPracticeDrag] = useState<PracticeDrag>(null);
  const [estimate, setEstimate] = useState("6.0");
  const [reflection, setReflection] = useState<Reflection>("close");

  const measurement = useMemo(() => measure(a, b), [a, b]);
  const practiceMeasurement = useMemo(
    () => measure(practiceP, practiceQ),
    [practiceP, practiceQ],
  );
  const convertedDistance =
    measurement.distance * (units === "cm" ? 10 : units === "m" ? 0.1 : 1);
  const unitLabel = units === "units" ? "units" : units;
  useEffect(() => {
    setA(INITIAL_A);
    setB(INITIAL_B);
    setMainDrag(null);
    setTool("segment");
    setGrid(1);
    setUnits("units");
    setShowComponents(true);
    setPointsVisible(2);
    setStage(0);
    setQuickReference(false);
  }, [resetToken]);

  const updatePoint = (setter: (point: Point) => void, point: Point) => {
    setter({ x: clamp(point.x, -6, 6), y: clamp(point.y, -6, 6) });
    onInteraction();
  };
  const resetEndpoint = (endpoint: "a" | "b") => {
    if (endpoint === "a") setA(INITIAL_A);
    else setB(INITIAL_B);
    setPointsVisible((count) => Math.max(count, endpoint === "a" ? 1 : 2));
    onInteraction();
  };
  const clear = () => {
    setPointsVisible(0);
    setMainDrag(null);
    onInteraction();
  };
  const placePoint = (point: Point) => {
    if (pointsVisible === 0) {
      updatePoint(setA, point);
      setPointsVisible(1);
    } else if (pointsVisible === 1) {
      updatePoint(setB, point);
      setPointsVisible(2);
    }
  };
  const nextChallenge = () => {
    const next = (challenge + 1) % PRACTICE_PAIRS.length;
    setChallenge(next);
    setPracticeP(PRACTICE_PAIRS[next][0]);
    setPracticeQ(PRACTICE_PAIRS[next][1]);
    setEstimate("");
    setReflection("close");
    onInteraction();
  };

  return (
    <section
      className="target-distance-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0287"
      data-dedicated-lesson="230"
      data-object-model="two-endpoint-coordinate-distance"
      aria-label="Distance Length dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-distance-header">
        <div>
          <span>Coordinate Geometry</span>
          <h1>Distance Length</h1>
          <p>Measure the distance between two points.</p>
          <section>
            <b>
              <CircleDot /> Interactive
            </b>
            <b>
              <Pencil /> Geometric
            </b>
            <b>
              <Zap /> Construction
            </b>
            <b>
              <Gauge /> 6–10 min
            </b>
          </section>
        </div>
        <aside>
          <h2>Learning goals</h2>
          <p>
            <Check /> Measure and interpret distance in the coordinate plane.
          </p>
          <p>
            <Check /> Use the distance formula to find lengths.
          </p>
          <button
            type="button"
            aria-expanded={quickReference}
            onClick={() => {
              setQuickReference((value) => !value);
              onInteraction();
            }}
          >
            <BookOpen /> Quick reference
          </button>
          {quickReference && (
            <div role="note">
              Square both coordinate changes, add them, then take the square
              root.
            </div>
          )}
        </aside>
      </header>

      <nav
        className="target-distance-stages"
        aria-label="Distance lesson stages"
      >
        {[
          [<Eye />, "Observe", "See it"],
          ["2", "Manipulate", "Change it"],
          ["3", "Notice", "Look for patterns"],
          ["4", "Understand", "Learn the rule"],
          ["5", "Try", "Practice"],
        ].map(([icon, title, subtitle], index) => (
          <button
            key={String(title)}
            type="button"
            className={stage === index ? "is-active" : ""}
            onClick={() => {
              setStage(index);
              onInteraction();
            }}
          >
            <i>{icon as ReactNode}</i>
            <span>
              <b>{title}</b>
              <small>{subtitle}</small>
            </span>
          </button>
        ))}
      </nav>

      <section className="target-distance-workspace">
        <article className="target-distance-plane">
          <header>
            <h2>Coordinate Plane</h2>
            <div>
              <label>
                Grid:
                <select
                  aria-label="Distance grid spacing"
                  value={grid}
                  onChange={(event) => {
                    setGrid(Number(event.target.value));
                    onInteraction();
                  }}
                >
                  <option value="1">1</option>
                  <option value="0.5">0.5</option>
                  <option value="2">2</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => {
                  setGrid(1);
                  onInteraction();
                }}
              >
                <RotateCcw /> Reset view
              </button>
            </div>
          </header>
          <DistancePlane
            a={a}
            b={b}
            measurement={measurement}
            grid={grid}
            pointsVisible={pointsVisible}
            showComponents={showComponents}
            showMidpoint={tool === "midpoint"}
            showPerpendicular={tool === "perpendicular"}
            drag={mainDrag}
            onDrag={setMainDrag}
            onA={(point) => updatePoint(setA, point)}
            onB={(point) => updatePoint(setB, point)}
            onPlace={placePoint}
          />
          <footer>
            {[
              ["point", <CircleDot />, "Point"],
              ["segment", <Ruler />, "Segment"],
              ["measure", <Gauge />, "Measure"],
              ["midpoint", <Target />, "Midpoint"],
              ["perpendicular", <Plus />, "Perpendicular"],
            ].map(([value, icon, label]) => (
              <button
                key={String(value)}
                type="button"
                className={tool === value ? "is-active" : ""}
                onClick={() => {
                  setTool(value as Tool);
                  if (value === "point" && pointsVisible === 2)
                    setPointsVisible(0);
                  onInteraction();
                }}
              >
                {icon as ReactNode}
                {label}
              </button>
            ))}
            <button type="button" onClick={clear}>
              <Trash2 /> Clear
            </button>
          </footer>
        </article>

        <aside className="target-distance-measurement">
          <header>
            <h2>Points &amp; Measurement</h2>
            <label>
              Units:
              <select
                aria-label="Distance units"
                value={units}
                onChange={(event) => {
                  setUnits(event.target.value);
                  onInteraction();
                }}
              >
                <option value="units">units</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </label>
          </header>
          <CoordinateEditor
            name="Point A"
            point={a}
            color="#0ca9be"
            visible={pointsVisible >= 1}
            onChange={(point) => updatePoint(setA, point)}
            onReset={() => resetEndpoint("a")}
          />
          <CoordinateEditor
            name="Point B"
            point={b}
            color="#7438e5"
            visible={pointsVisible >= 2}
            onChange={(point) => updatePoint(setB, point)}
            onReset={() => resetEndpoint("b")}
          />
          <section className="target-distance-result">
            <b>Distance AB</b>
            <strong data-testid="distance-primary-value">
              {convertedDistance.toFixed(2)} <small>{unitLabel}</small>
            </strong>
          </section>
          <button
            type="button"
            aria-expanded={showComponents}
            onClick={() => {
              setShowComponents((value) => !value);
              onInteraction();
            }}
          >
            Show Δx, Δy <ChevronDown />
          </button>
          {showComponents && (
            <section className="target-distance-components">
              <b>Live components</b>
              <p data-testid="distance-delta-x">
                Δx = x₂ − x₁ = {format(b.x)} − ({format(a.x)}) ={" "}
                {format(measurement.dx)}
              </p>
              <p data-testid="distance-delta-y">
                Δy = y₂ − y₁ = {format(b.y)} − ({format(a.y)}) ={" "}
                {format(measurement.dy)}
              </p>
              <strong>
                AB = √(Δx² + Δy²) = √({format(measurement.dx)}² +{" "}
                {format(measurement.dy)}²) = {measurement.distance.toFixed(2)}
              </strong>
            </section>
          )}
        </aside>
      </section>

      <section className="target-distance-learning">
        <article>
          <h2>See the Right Triangle</h2>
          <p>The segment forms a right triangle with legs |Δx| and |Δy|.</p>
          <MiniTriangle measurement={measurement} />
        </article>
        <article>
          <h2>Worked Example</h2>
          <p>Given A(−4, −2) and B(2, 3):</p>
          <p>Δx = 2 − (−4) = 6</p>
          <p>Δy = 3 − (−2) = 5</p>
          <strong>AB = √(6² + 5²) = √61</strong>
          <output>AB ≈ 7.81 units</output>
        </article>
        <article>
          <h2>Distance Formula</h2>
          <p>For points A(x₁, y₁) and B(x₂, y₂):</p>
          <div>AB = √((x₂ − x₁)² + (y₂ − y₁)²)</div>
          <p>Always non-negative and symmetric:</p>
          <strong>AB = BA ≥ 0</strong>
        </article>
      </section>

      <section className="target-distance-practice">
        <header>
          <div>
            <h2>Try It: Estimate Then Check</h2>
            <p>Follow the steps to deepen your understanding.</p>
          </div>
          <div>
            <span>
              <Check /> Auto-measured
            </span>
            <button type="button" onClick={nextChallenge}>
              New challenge <RefreshCw />
            </button>
          </div>
        </header>
        <div>
          <PracticePlane
            p={practiceP}
            q={practiceQ}
            drag={practiceDrag}
            onDrag={setPracticeDrag}
            onP={(point) => updatePoint(setPracticeP, point)}
            onQ={(point) => updatePoint(setPracticeQ, point)}
          />
          <section>
            <h3>
              <b>1</b> Estimate
            </h3>
            <p>Drag P or Q to estimate the distance.</p>
            <label>
              Your estimate
              <span>
                <input
                  type="number"
                  aria-label="Distance estimate"
                  step="0.1"
                  value={estimate}
                  onChange={(event) => {
                    setEstimate(event.target.value);
                    onInteraction();
                  }}
                />{" "}
                units
              </span>
            </label>
            <small>(Increase grid if needed)</small>
          </section>
          <section>
            <h3>
              <b>2</b> Check
            </h3>
            <p>Use exact measurement to verify.</p>
            <label>
              Exact distance
              <output data-testid="practice-distance-value">
                {practiceMeasurement.distance.toFixed(2)}
              </output>
              units
            </label>
          </section>
          <section className="target-distance-reflect">
            <h3>
              <b>3</b> Reflect
            </h3>
            <p>How close was your estimate?</p>
            {[
              ["very", "Very close (±0.5)"],
              ["close", "Close (±1.0)"],
              ["far", "Not close (±1.0+)"],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="distance-reflection"
                  value={value}
                  checked={reflection === value}
                  onChange={() => {
                    setReflection(value as Reflection);
                    onInteraction();
                  }}
                />
                {label}
              </label>
            ))}
          </section>
        </div>
      </section>

      <nav className="target-distance-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/229-parabola">
          <ArrowLeft />
          <span>
            <b>Previous</b>Parabola
          </span>
        </a>
        <a href="/lessons/geometry/231-area">
          <span>
            <b>Next</b>Area
          </span>
          <ArrowRight />
        </a>
      </nav>
      <output className="sr-only" role="status">
        {Math.abs(Number(estimate) - practiceMeasurement.distance) <=
        (reflection === "very"
          ? 0.5
          : reflection === "close"
            ? 1
            : Number.POSITIVE_INFINITY)
          ? "Estimate reflection consistent."
          : "Reconsider how close the estimate is."}
      </output>
    </section>
  );
}

function DistancePlane({
  a,
  b,
  measurement,
  grid,
  pointsVisible,
  showComponents,
  showMidpoint,
  showPerpendicular,
  drag,
  onDrag,
  onA,
  onB,
  onPlace,
}: {
  a: Point;
  b: Point;
  measurement: ReturnType<typeof measure>;
  grid: number;
  pointsVisible: number;
  showComponents: boolean;
  showMidpoint: boolean;
  showPerpendicular: boolean;
  drag: MainDrag;
  onDrag: (drag: MainDrag) => void;
  onA: (point: Point) => void;
  onB: (point: Point) => void;
  onPlace: (point: Point) => void;
}) {
  const graph = useCoordinateGraph(440, 435);
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const next = graph.domain(
      event.currentTarget,
      event.clientX,
      event.clientY,
    );
    if (drag === "a") onA(next);
    else onB(next);
  };
  const pointA = graph.screen(a);
  const pointB = graph.screen(b);
  const midpoint = graph.screen({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const gridSize = graph.scale * grid;
  return (
    <svg
      role="img"
      aria-label="Coordinate plane with draggable distance endpoints A and B"
      viewBox="0 0 440 435"
      onPointerMove={move}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onPlace(
            graph.domain(event.currentTarget, event.clientX, event.clientY),
          );
        }
      }}
    >
      <defs>
        <pattern
          id="distance-grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${gridSize} 0H0V${gridSize}`}
            fill="none"
            stroke="#dbe8ef"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        width="440"
        height="435"
        fill="url(#distance-grid)"
        pointerEvents="none"
      />
      <line
        x1="0"
        x2="440"
        y1={graph.originY}
        y2={graph.originY}
        stroke="#334155"
      />
      <line
        x1={graph.originX}
        x2={graph.originX}
        y1="0"
        y2="435"
        stroke="#334155"
      />
      {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => (
        <g key={value}>
          <text
            x={graph.originX + value * graph.scale - 4}
            y={graph.originY + 17}
            fontSize="9"
            fill="#334155"
          >
            {value}
          </text>
          {value !== 0 && (
            <text
              x={graph.originX - 16}
              y={graph.originY - value * graph.scale + 3}
              fontSize="9"
              fill="#334155"
            >
              {value}
            </text>
          )}
        </g>
      ))}
      <text x="430" y={graph.originY - 6} fontSize="11" fontWeight="700">
        x
      </text>
      <text x={graph.originX + 7} y="12" fontSize="11" fontWeight="700">
        y
      </text>
      {pointsVisible >= 2 && (
        <>
          <line
            data-testid="distance-segment"
            data-distance={measurement.distance.toFixed(6)}
            x1={pointA.x}
            y1={pointA.y}
            x2={pointB.x}
            y2={pointB.y}
            stroke="#64748b"
            strokeWidth="2"
          />
          {showComponents && (
            <g data-testid="distance-component-guides">
              <line
                x1={pointA.x}
                y1={pointA.y}
                x2={pointB.x}
                y2={pointA.y}
                stroke="#0ca9be"
                strokeDasharray="4 3"
              />
              <line
                x1={pointB.x}
                y1={pointA.y}
                x2={pointB.x}
                y2={pointB.y}
                stroke="#8b5cf6"
                strokeDasharray="4 3"
              />
              <path
                d={`M${pointB.x - 10} ${pointA.y}v-10h10`}
                fill="none"
                stroke="#0ca9be"
              />
            </g>
          )}
          {showPerpendicular && (
            <line
              data-testid="distance-perpendicular"
              x1={midpoint.x}
              y1={midpoint.y - 80}
              x2={midpoint.x}
              y2={midpoint.y + 80}
              stroke="#f97316"
              strokeDasharray="5 4"
            />
          )}
          {showMidpoint && (
            <circle
              data-testid="distance-midpoint"
              cx={midpoint.x}
              cy={midpoint.y}
              r="5"
              fill="#f59e0b"
            />
          )}
          <g
            transform={`translate(${(pointA.x + pointB.x) / 2 - 24} ${(pointA.y + pointB.y) / 2 - 28})`}
          >
            <rect
              width="55"
              height="25"
              rx="5"
              fill="#eff8ff"
              stroke="#38a6e8"
            />
            <text x="7" y="17" fill="#0872b8" fontSize="10" fontWeight="800">
              AB = {measurement.distance.toFixed(2)}
            </text>
          </g>
        </>
      )}
      {pointsVisible >= 1 && (
        <g>
          <circle
            data-testid="distance-point-a"
            data-x={a.x.toFixed(6)}
            data-y={a.y.toFixed(6)}
            cx={pointA.x}
            cy={pointA.y}
            r="7"
            fill="#0ca9be"
            stroke="#fff"
            strokeWidth="2"
            onPointerDown={() => onDrag("a")}
          />
          <text
            x={pointA.x + 8}
            y={pointA.y + 25}
            fill="#0995aa"
            fontSize="11"
            fontWeight="800"
          >
            A ({format(a.x)}, {format(a.y)})
          </text>
        </g>
      )}
      {pointsVisible >= 2 && (
        <g>
          <circle
            data-testid="distance-point-b"
            data-x={b.x.toFixed(6)}
            data-y={b.y.toFixed(6)}
            cx={pointB.x}
            cy={pointB.y}
            r="7"
            fill="#7438e5"
            stroke="#fff"
            strokeWidth="2"
            onPointerDown={() => onDrag("b")}
          />
          <text
            x={pointB.x}
            y={pointB.y - 15}
            fill="#7438e5"
            fontSize="11"
            fontWeight="800"
          >
            B ({format(b.x)}, {format(b.y)})
          </text>
        </g>
      )}
    </svg>
  );
}

function CoordinateEditor({
  name,
  point,
  color,
  visible,
  onChange,
  onReset,
}: {
  name: string;
  point: Point;
  color: string;
  visible: boolean;
  onChange: (point: Point) => void;
  onReset: () => void;
}) {
  return (
    <section className="target-distance-coordinate">
      <h3>
        <i style={{ background: color }} /> {name}
      </h3>
      <div>
        <label>
          x
          <input
            type="number"
            aria-label={`${name} x coordinate`}
            step="0.5"
            value={visible ? point.x : ""}
            onChange={(event) =>
              onChange({ ...point, x: Number(event.target.value) })
            }
          />
        </label>
        <label>
          y
          <input
            type="number"
            aria-label={`${name} y coordinate`}
            step="0.5"
            value={visible ? point.y : ""}
            onChange={(event) =>
              onChange({ ...point, y: Number(event.target.value) })
            }
          />
        </label>
        <button type="button" aria-label={`Reset ${name}`} onClick={onReset}>
          <RotateCcw />
        </button>
      </div>
    </section>
  );
}

function MiniTriangle({
  measurement,
}: {
  measurement: ReturnType<typeof measure>;
}) {
  return (
    <svg
      role="img"
      aria-label="Right triangle decomposition of distance AB"
      viewBox="0 0 210 105"
    >
      <line x1="28" y1="82" x2="175" y2="82" stroke="#0ca9be" strokeWidth="2" />
      <line
        x1="175"
        y1="82"
        x2="175"
        y2="22"
        stroke="#7438e5"
        strokeWidth="2"
      />
      <line x1="28" y1="82" x2="175" y2="22" stroke="#64748b" strokeWidth="2" />
      <path d="M164 82V71H175" fill="none" stroke="#0ca9be" />
      <circle cx="28" cy="82" r="4" fill="#0ca9be" />
      <circle cx="175" cy="22" r="4" fill="#7438e5" />
      <text x="12" y="90" fontSize="10" fill="#0ca9be" fontWeight="800">
        A
      </text>
      <text x="183" y="20" fontSize="10" fill="#7438e5" fontWeight="800">
        B
      </text>
      <text x="78" y="99" fontSize="9" fill="#0ca9be">
        |Δx| = {Math.abs(measurement.dx)}
      </text>
      <text x="180" y="57" fontSize="9" fill="#7438e5">
        |Δy| = {Math.abs(measurement.dy)}
      </text>
      <text x="62" y="43" fontSize="9" fill="#334155" fontWeight="800">
        AB = {measurement.distance.toFixed(2)}
      </text>
    </svg>
  );
}

function PracticePlane({
  p,
  q,
  drag,
  onDrag,
  onP,
  onQ,
}: {
  p: Point;
  q: Point;
  drag: PracticeDrag;
  onDrag: (drag: PracticeDrag) => void;
  onP: (point: Point) => void;
  onQ: (point: Point) => void;
}) {
  const graph = useCoordinateGraph(270, 172);
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const next = graph.domain(
      event.currentTarget,
      event.clientX,
      event.clientY,
    );
    if (drag === "p") onP(next);
    else onQ(next);
  };
  const pointP = graph.screen(p),
    pointQ = graph.screen(q);
  return (
    <svg
      role="img"
      aria-label="Practice coordinate plane with draggable points P and Q"
      viewBox="0 0 270 172"
      onPointerMove={move}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
    >
      <defs>
        <pattern
          id="distance-practice-grid"
          width={graph.scale}
          height={graph.scale}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${graph.scale} 0H0V${graph.scale}`}
            fill="none"
            stroke="#e2e8f0"
          />
        </pattern>
      </defs>
      <rect width="270" height="172" fill="url(#distance-practice-grid)" />
      <line
        x1="0"
        x2="270"
        y1={graph.originY}
        y2={graph.originY}
        stroke="#64748b"
      />
      <line
        x1={graph.originX}
        x2={graph.originX}
        y1="0"
        y2="172"
        stroke="#64748b"
      />
      <line
        x1={pointP.x}
        y1={pointP.y}
        x2={pointQ.x}
        y2={pointQ.y}
        stroke="#94a3b8"
        strokeDasharray="4 3"
      />
      <circle
        data-testid="practice-distance-point-p"
        data-x={p.x.toFixed(6)}
        cx={pointP.x}
        cy={pointP.y}
        r="6"
        fill="#0ca9be"
        onPointerDown={() => onDrag("p")}
      />
      <circle
        data-testid="practice-distance-point-q"
        data-x={q.x.toFixed(6)}
        cx={pointQ.x}
        cy={pointQ.y}
        r="6"
        fill="#7438e5"
        onPointerDown={() => onDrag("q")}
      />
      <text
        x={pointP.x - 26}
        y={pointP.y - 10}
        fill="#0995aa"
        fontSize="10"
        fontWeight="800"
      >
        P ({format(p.x)}, {format(p.y)})
      </text>
      <text
        x={pointQ.x - 20}
        y={pointQ.y + 22}
        fill="#7438e5"
        fontSize="10"
        fontWeight="800"
      >
        Q ({format(q.x)}, {format(q.y)})
      </text>
    </svg>
  );
}

function useCoordinateGraph(width: number, height: number) {
  const scale = Math.min((width - 34) / 12, (height - 18) / 12);
  const originX = width / 2;
  const originY = height / 2;
  return {
    scale,
    originX,
    originY,
    screen: (point: Point) => ({
      x: originX + point.x * scale,
      y: originY - point.y * scale,
    }),
    domain: (svg: SVGSVGElement, clientX: number, clientY: number) => {
      const value = svg.createSVGPoint();
      value.x = clientX;
      value.y = clientY;
      const local = value.matrixTransform(svg.getScreenCTM()?.inverse());
      return {
        x: clamp(Math.round(((local.x - originX) / scale) * 10) / 10, -6, 6),
        y: clamp(Math.round(((originY - local.y) / scale) * 10) / 10, -6, 6),
      };
    },
  };
}

function measure(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { dx, dy, distance: Math.hypot(dx, dy) };
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function format(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
