import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Copy,
  Grid3X3,
  Proportions,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Drag = "a" | "b" | "c" | null;
type Mode = "small" | "reflex";
type PracticeFeedback = "idle" | "correct" | "incorrect";

const INITIAL_A = { x: 0, y: 0 };
const INITIAL_B = { x: 6, y: 0 };
const INITIAL_C = polarPoint(INITIAL_A, 6, 55);
const ANGLE_PRESETS = [
  ["Acute", 55],
  ["Right", 90],
  ["Obtuse", 120],
  ["Straight", 180],
  ["Reflex", 235],
] as const;

export default function AngleTargetLesson232({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Point>(INITIAL_A);
  const [b, setB] = useState<Point>(INITIAL_B);
  const [c, setC] = useState<Point>(INITIAL_C);
  const [drag, setDrag] = useState<Drag>(null);
  const [mode, setMode] = useState<Mode>("small");
  const [showProtractor, setShowProtractor] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showArc, setShowArc] = useState(true);
  const [showAB, setShowAB] = useState(true);
  const [showAC, setShowAC] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [stage, setStage] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState("");
  const [practiceAngle, setPracticeAngle] = useState(112);
  const [practiceDrag, setPracticeDrag] = useState(false);
  const [practiceFeedback, setPracticeFeedback] =
    useState<PracticeFeedback>("idle");

  const model = useMemo(() => angleModel(a, b, c, mode), [a, b, c, mode]);
  const reset = () => {
    setA(INITIAL_A);
    setB(INITIAL_B);
    setC(INITIAL_C);
    setDrag(null);
    setMode("small");
    setShowProtractor(false);
    setShowGrid(true);
    setShowArc(true);
    setShowAB(true);
    setShowAC(true);
    setShowLabels(true);
    setStage(0);
    onInteraction();
  };
  useEffect(() => {
    setA(INITIAL_A);
    setB(INITIAL_B);
    setC(INITIAL_C);
    setDrag(null);
    setMode("small");
    setShowProtractor(false);
    setShowGrid(true);
    setShowArc(true);
    setShowAB(true);
    setShowAC(true);
    setShowLabels(true);
    setStage(0);
  }, [resetToken]);

  const movePoint = (which: Exclude<Drag, null>, point: Point) => {
    const next = { x: clamp(point.x, -7, 7), y: clamp(point.y, -5, 7) };
    if (which === "a") {
      const dx = next.x - a.x;
      const dy = next.y - a.y;
      setA(next);
      setB({ x: b.x + dx, y: b.y + dy });
      setC({ x: c.x + dx, y: c.y + dy });
    } else if (which === "b") setB(next);
    else setC(next);
    onInteraction();
  };
  const applyPreset = (label: string, angle: number) => {
    const baseAngle = directionDegrees(a, b);
    const rayLength = Math.max(1, distance(a, c));
    if (label === "Reflex") {
      setMode("reflex");
      setC(polarPoint(a, rayLength, baseAngle + (360 - angle)));
    } else {
      setMode("small");
      setC(polarPoint(a, rayLength, baseAngle + angle));
    }
    onInteraction();
  };
  const copyPoint = async (label: string, point: Point) => {
    try {
      await navigator.clipboard?.writeText(
        `${label} (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`,
      );
    } catch {
      /* The visible copied state remains available. */
    }
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1200);
    onInteraction();
  };
  const checkPractice = () => {
    setPracticeFeedback(
      Math.abs(practiceAngle - 120) <= 1 ? "correct" : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="target-angle-page text-slate-900"
      data-testid="dynamic-geometry-mockup-0289"
      data-dedicated-lesson="232"
      data-object-model="three-point-two-ray-oriented-angle"
      aria-label="Angle dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>
      <header className="target-angle-header">
        <div>
          <span>Dynamic Geometry Construction</span>
          <h1>Angle</h1>
          <p>Measure angular relationships.</p>
          <section>
            <b>
              <Target /> Foundational–Advanced
            </b>
            <b>
              <Sparkles /> Construction Studio
            </b>
            <b>
              <Grid3X3 /> Geometry Tools
            </b>
            <b>
              <Timer /> 6–10 min
            </b>
          </section>
        </div>
        <aside>
          <header>
            <Sparkles /> Lesson progress
          </header>
          <div>
            <strong>{Math.round((stage / 5) * 100)}%</strong>
            <b>{stage} / 5 steps</b>
            <button
              type="button"
              aria-label={
                bookmarked ? "Remove Angle bookmark" : "Bookmark Angle lesson"
              }
              aria-pressed={bookmarked}
              onClick={() => {
                setBookmarked((value) => !value);
                onInteraction();
              }}
            >
              <Bookmark fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </aside>
      </header>

      <nav className="target-angle-stages" aria-label="Angle lesson stages">
        {[
          ["Observe", "What is an angle?"],
          ["Manipulate", "Change and measure"],
          ["Notice", "Find the pattern"],
          ["Understand", "The rule"],
          ["Try", "Practice task"],
        ].map(([title, subtitle], index) => (
          <button
            key={title}
            type="button"
            className={stage === index ? "is-active" : ""}
            onClick={() => {
              setStage(index);
              onInteraction();
            }}
          >
            <i>{index + 1}</i>
            <span>
              <b>{title}</b>
              <small>{subtitle}</small>
            </span>
          </button>
        ))}
      </nav>

      <section className="target-angle-workspace">
        <article className="target-angle-main">
          <header>
            <div>
              <h2>Interactive Angle Model</h2>
              <p>Drag the blue points to change the angle.</p>
            </div>
            <div>
              <button
                type="button"
                className={showProtractor ? "is-active" : ""}
                onClick={() => {
                  setShowProtractor((value) => !value);
                  onInteraction();
                }}
              >
                <Proportions /> Protractor
              </button>
              <button
                type="button"
                className={showGrid ? "is-active" : ""}
                onClick={() => {
                  setShowGrid((value) => !value);
                  onInteraction();
                }}
              >
                <Grid3X3 /> Grid
              </button>
              <button type="button" onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </div>
          </header>
          <AnglePlot
            a={a}
            b={b}
            c={c}
            model={model}
            drag={drag}
            showGrid={showGrid}
            showProtractor={showProtractor}
            showArc={showArc}
            showAB={showAB}
            showAC={showAC}
            showLabels={showLabels}
            onDrag={setDrag}
            onMove={movePoint}
          />
          <footer>
            <section>
              <h3>Angle type</h3>
              <div>
                {ANGLE_PRESETS.map(([label, angle]) => (
                  <button
                    key={label}
                    type="button"
                    className={
                      model.type === label.toLowerCase() ? "is-active" : ""
                    }
                    onClick={() => applyPreset(label, angle)}
                  >
                    <b>{label}</b>
                    <small>
                      {label === "Acute"
                        ? "0°–90°"
                        : label === "Right"
                          ? "90°"
                          : label === "Obtuse"
                            ? "90°–180°"
                            : label === "Straight"
                              ? "180°"
                              : "180°–360°"}
                    </small>
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3>Mode</h3>
              <div>
                <button
                  type="button"
                  className={mode === "small" ? "is-active" : ""}
                  onClick={() => {
                    setMode("small");
                    onInteraction();
                  }}
                >
                  Small angle
                </button>
                <button
                  type="button"
                  className={mode === "reflex" ? "is-active" : ""}
                  onClick={() => {
                    setMode("reflex");
                    onInteraction();
                  }}
                >
                  Reflex angle
                </button>
              </div>
            </section>
          </footer>
        </article>

        <aside className="target-angle-sidebar">
          <article>
            <h2>Measurement</h2>
            <p>∠ CAB</p>
            <strong data-testid="angle-measurement">
              {model.measure.toFixed(1)}°
            </strong>
            <span>
              <i style={{ background: typeColor(model.type) }} />{" "}
              {titleCase(model.type)} angle {typeRange(model.type)}
            </span>
          </article>
          <article className="target-angle-points">
            <h2>Point controls</h2>
            {[
              ["A (vertex)", a],
              ["B", b],
              ["C", c],
            ].map(([label, point]) => (
              <section key={String(label)}>
                <b>
                  <i /> {String(label)}
                </b>
                <div>
                  <span>
                    ( {format((point as Point).x)}, {format((point as Point).y)}{" "}
                    )
                  </span>
                  <button
                    type="button"
                    aria-label={`Copy point ${String(label).charAt(0)}`}
                    onClick={() =>
                      void copyPoint(String(label).charAt(0), point as Point)
                    }
                  >
                    <Copy />
                  </button>
                </div>
              </section>
            ))}
            <output role="status">
              {copied ? `Point ${copied} copied.` : ""}
            </output>
          </article>
          <article className="target-angle-options">
            <h2>Display options</h2>
            {[
              ["Show angle arc", showArc, setShowArc],
              ["Show ray AB", showAB, setShowAB],
              ["Show ray AC", showAC, setShowAC],
              ["Show labels", showLabels, setShowLabels],
            ].map(([label, checked, setter]) => (
              <label key={String(label)}>
                {label}
                <input
                  type="checkbox"
                  checked={checked as boolean}
                  onChange={(event) => {
                    (setter as (value: boolean) => void)(event.target.checked);
                    onInteraction();
                  }}
                />
              </label>
            ))}
          </article>
        </aside>
      </section>

      <section className="target-angle-learning">
        <article>
          <h2>Worked Example</h2>
          <p>Construct and measure an angle of 60°.</p>
          <div>
            <section>
              {[
                "Place point A.",
                "Place point B to the right to form ray AB.",
                "Drag point C until ∠ CAB = 60°.",
                "The angle is acute.",
              ].map((text, index) => (
                <p key={text}>
                  <b>{index + 1}</b>
                  {text}
                </p>
              ))}
            </section>
            <WorkedAngle />
          </div>
        </article>
        <article>
          <h2>Insight</h2>
          <p>
            An angle measures the <b>amount of turn</b> from one ray to another.
          </p>
          <strong>0° &lt; θ &lt; 360°</strong>
          <div>
            {[
              ["Acute angle", "0° < θ < 90°", "#0ca9be"],
              ["Right angle", "θ = 90°", "#2468e5"],
              ["Obtuse angle", "90° < θ < 180°", "#8b3fe3"],
              ["Straight angle", "θ = 180°", "#f97316"],
              ["Reflex angle", "180° < θ < 360°", "#ec1360"],
            ].map(([label, measure, color]) => (
              <p key={label}>
                <i style={{ background: color }} />
                <b>{label}</b>
                <span>{measure}</span>
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="target-angle-practice">
        <header>
          <h2>Your Turn</h2>
          <p>Construct an angle of 120°.</p>
        </header>
        <div>
          <PracticeAnglePlot
            angle={practiceAngle}
            dragging={practiceDrag}
            onDrag={setPracticeDrag}
            onAngle={(value) => {
              setPracticeAngle(value);
              setPracticeFeedback("idle");
              onInteraction();
            }}
          />
          <article>
            <h3>Check your answer</h3>
            <p>
              <i className={Math.abs(practiceAngle - 120) <= 1 ? "is-ok" : ""}>
                {Math.abs(practiceAngle - 120) <= 1 && <Check />}
              </i>{" "}
              Angle within ±1° of 120°
            </p>
            <p>
              <i
                className={
                  practiceAngle > 90 && practiceAngle < 180 ? "is-ok" : ""
                }
              >
                {practiceAngle > 90 && practiceAngle < 180 && <Check />}
              </i>{" "}
              Correct angle type (obtuse)
            </p>
            <footer>
              <button type="button" onClick={checkPractice}>
                <Check /> Check
              </button>
              <button
                type="button"
                onClick={() => {
                  setPracticeAngle(112);
                  setPracticeFeedback("idle");
                  onInteraction();
                }}
              >
                Reset
              </button>
            </footer>
            <output role="status" className={`is-${practiceFeedback}`}>
              {practiceFeedback === "correct"
                ? "120° construction correct."
                : practiceFeedback === "incorrect"
                  ? "Adjust ray AC closer to 120°."
                  : ""}
            </output>
          </article>
          <article className="target-angle-gauge">
            <h3>How close are you?</h3>
            <Gauge angle={practiceAngle} />
            <strong>{practiceAngle.toFixed(1)}°</strong>
            <p>Target: 120°</p>
            <small>Drag points, then check.</small>
          </article>
        </div>
      </section>

      <nav className="target-angle-nav" aria-label="Adjacent lessons">
        <a href="/lessons/geometry/231-area">
          <ArrowLeft />
          <span>
            <b>Previous</b>Area
          </span>
        </a>
        <section>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={stage === value - 1 ? "is-active" : ""}
              aria-label={`Go to angle step ${value}`}
              onClick={() => {
                setStage(value - 1);
                onInteraction();
              }}
            >
              {value}
            </button>
          ))}
        </section>
        <a href="/lessons/geometry/233-fixed-angle">
          <span>
            <b>Next</b>Fixed Angle
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function AnglePlot({
  a,
  b,
  c,
  model,
  drag,
  showGrid,
  showProtractor,
  showArc,
  showAB,
  showAC,
  showLabels,
  onDrag,
  onMove,
}: {
  a: Point;
  b: Point;
  c: Point;
  model: ReturnType<typeof angleModel>;
  drag: Drag;
  showGrid: boolean;
  showProtractor: boolean;
  showArc: boolean;
  showAB: boolean;
  showAC: boolean;
  showLabels: boolean;
  onDrag: (drag: Drag) => void;
  onMove: (which: Exclude<Drag, null>, point: Point) => void;
}) {
  const width = 520,
    height = 365,
    scale = 39,
    origin = { x: 178, y: 262 };
  const screen = (point: Point) => ({
    x: origin.x + point.x * scale,
    y: origin.y - point.y * scale,
  });
  const domain = (svg: SVGSVGElement, x: number, y: number) => {
    const value = svg.createSVGPoint();
    value.x = x;
    value.y = y;
    const local = value.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: (local.x - origin.x) / scale, y: (origin.y - local.y) / scale };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (drag)
      onMove(drag, domain(event.currentTarget, event.clientX, event.clientY));
  };
  const pa = screen(a),
    pb = screen(b),
    pc = screen(c);
  const arc = angleArc(
    pa,
    model.baseDirection,
    model.oriented,
    modeSweep(model),
  );
  return (
    <svg
      role="img"
      aria-label="Interactive angle with draggable vertex A and ray points B and C"
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={move}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
    >
      <defs>
        <pattern
          id="angle-grid"
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${scale} 0H0V${scale}`} fill="none" stroke="#e2e8f0" />
        </pattern>
      </defs>
      <rect
        data-testid="angle-grid-layer"
        data-visible={showGrid}
        width={width}
        height={height}
        fill={showGrid ? "url(#angle-grid)" : "white"}
      />
      {showProtractor && <Protractor center={pa} radius={145} />}
      {showAB && (
        <line
          data-testid="angle-ray-ab"
          x1={pa.x}
          y1={pa.y}
          x2={pb.x}
          y2={pb.y}
          stroke="#172554"
          strokeWidth="2"
        />
      )}
      {showAC && (
        <line
          data-testid="angle-ray-ac"
          x1={pa.x}
          y1={pa.y}
          x2={pc.x}
          y2={pc.y}
          stroke="#172554"
          strokeWidth="2"
        />
      )}
      {showArc && (
        <path
          data-testid="angle-arc"
          d={arc}
          fill="none"
          stroke="#0ca9be"
          strokeWidth="2"
        />
      )}
      {showArc && (
        <text
          x={pa.x + 70}
          y={pa.y - 40}
          fill="#0ca9be"
          fontSize="13"
          fontWeight="900"
        >
          {model.measure.toFixed(1)}°
        </text>
      )}
      {[
        ["a", a, pa],
        ["b", b, pb],
        ["c", c, pc],
      ].map(([key, point, screenPoint]) => (
        <g key={key as string}>
          <circle
            data-testid={`angle-point-${key}`}
            data-x={(point as Point).x.toFixed(6)}
            data-y={(point as Point).y.toFixed(6)}
            cx={(screenPoint as Point).x}
            cy={(screenPoint as Point).y}
            r="7"
            fill="#1769e8"
            onPointerDown={() => onDrag(key as Exclude<Drag, null>)}
          />
              {showLabels && (
                <text
                  data-testid="angle-point-label"
              x={
                (screenPoint as Point).x +
                (key === "a" ? -20 : key === "b" ? -14 : 0)
              }
              y={(screenPoint as Point).y + (key === "c" ? -12 : 22)}
              fill="#1769e8"
              fontSize="13"
              fontWeight="900"
            >
              {String(key).toUpperCase()}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function PracticeAnglePlot({
  angle,
  dragging,
  onDrag,
  onAngle,
}: {
  angle: number;
  dragging: boolean;
  onDrag: (value: boolean) => void;
  onAngle: (value: number) => void;
}) {
  const center = { x: 81, y: 132 },
    radius = 118,
    endpoint = {
      x: center.x + radius * Math.cos((angle * Math.PI) / 180),
      y: center.y - radius * Math.sin((angle * Math.PI) / 180),
    };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (280 / rect.width),
      y = (event.clientY - rect.top) * (180 / rect.height);
    let value = (Math.atan2(center.y - y, x - center.x) * 180) / Math.PI;
    if (value < 0) value += 360;
    onAngle(clamp(value, 0, 180));
  };
  return (
    <svg
      role="img"
      aria-label="Practice protractor with draggable ray C"
      viewBox="0 0 280 180"
      onPointerMove={move}
      onPointerUp={() => onDrag(false)}
      onPointerCancel={() => onDrag(false)}
    >
      <rect width="280" height="180" fill="#fff" />
      <Protractor center={center} radius={118} />
      <line
        x1={center.x}
        y1={center.y}
        x2="245"
        y2={center.y}
        stroke="#172554"
        strokeWidth="2"
      />
      <line
        x1={center.x}
        y1={center.y}
        x2={endpoint.x}
        y2={endpoint.y}
        stroke="#64748b"
        strokeWidth="2"
      />
      <circle cx={center.x} cy={center.y} r="6" fill="#1769e8" />
      <circle cx="245" cy={center.y} r="5" fill="#1769e8" />
      <circle
        data-testid="practice-angle-point-c"
        data-angle={angle.toFixed(6)}
        cx={endpoint.x}
        cy={endpoint.y}
        r="6"
        fill="#1769e8"
        onPointerDown={() => onDrag(true)}
      />
      <text
        x={center.x - 15}
        y={center.y + 20}
        fill="#1769e8"
        fontSize="11"
        fontWeight="900"
      >
        A
      </text>
      <text
        x="250"
        y={center.y + 20}
        fill="#1769e8"
        fontSize="11"
        fontWeight="900"
      >
        B
      </text>
      <text
        x={endpoint.x + 7}
        y={endpoint.y - 5}
        fill="#1769e8"
        fontSize="11"
        fontWeight="900"
      >
        C
      </text>
    </svg>
  );
}

function Protractor({ center, radius }: { center: Point; radius: number }) {
  return (
    <g data-testid="angle-protractor">
      {Array.from({ length: 19 }, (_, index) => {
        const angle = (index * 10 * Math.PI) / 180;
        const outer = {
            x: center.x + radius * Math.cos(angle),
            y: center.y - radius * Math.sin(angle),
          },
          innerRadius = radius - (index % 3 === 0 ? 12 : 7),
          inner = {
            x: center.x + innerRadius * Math.cos(angle),
            y: center.y - innerRadius * Math.sin(angle),
          };
        return (
          <g key={index}>
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#94a3b8"
            />
            <text
              x={center.x + (radius - 22) * Math.cos(angle) - 5}
              y={center.y - (radius - 22) * Math.sin(angle) + 3}
              fill="#64748b"
              fontSize="6"
            >
              {index * 10}
            </text>
          </g>
        );
      })}
      <path
        d={`M${center.x - radius} ${center.y}A${radius} ${radius} 0 0 1 ${center.x + radius} ${center.y}`}
        fill="none"
        stroke="#cbd5e1"
      />
    </g>
  );
}
function WorkedAngle() {
  return (
    <svg
      role="img"
      aria-label="Worked sixty degree angle"
      viewBox="0 0 180 125"
    >
      <line
        x1="30"
        y1="100"
        x2="150"
        y2="100"
        stroke="#172554"
        strokeWidth="2"
      />
      <line x1="30" y1="100" x2="88" y2="18" stroke="#172554" strokeWidth="2" />
      <path
        d="M65 100A35 35 0 0 0 50 71"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      />
      <circle cx="30" cy="100" r="5" fill="#1769e8" />
      <circle cx="150" cy="100" r="5" fill="#1769e8" />
      <circle cx="88" cy="18" r="5" fill="#1769e8" />
      <text x="76" y="73" fill="#16a34a" fontSize="13" fontWeight="900">
        60°
      </text>
      <text x="14" y="116" fill="#1769e8" fontSize="11" fontWeight="900">
        A
      </text>
      <text x="151" y="116" fill="#1769e8" fontSize="11" fontWeight="900">
        B
      </text>
      <text x="70" y="18" fill="#1769e8" fontSize="11" fontWeight="900">
        C
      </text>
    </svg>
  );
}
function Gauge({ angle }: { angle: number }) {
  const ratio = clamp(angle / 180, 0, 1),
    end = -180 + ratio * 180;
  return (
    <svg
      role="img"
      aria-label={`Angle accuracy gauge showing ${angle.toFixed(1)} degrees`}
      viewBox="0 0 210 95"
    >
      <path
        d="M20 82A85 85 0 0 1 190 82"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="16"
      />
      <path
        d="M20 82A85 85 0 0 1 190 82"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="16"
        strokeDasharray="11 4"
      />
      <line
        x1="105"
        y1="82"
        x2={105 + 62 * Math.cos((end * Math.PI) / 180)}
        y2={82 + 62 * Math.sin((end * Math.PI) / 180)}
        stroke="#172554"
        strokeWidth="2"
      />
      <text x="12" y="94" fontSize="8">
        0°
      </text>
      <text x="181" y="94" fontSize="8">
        180°
      </text>
    </svg>
  );
}

function angleModel(a: Point, b: Point, c: Point, mode: Mode) {
  const baseDirection = directionDegrees(a, b),
    otherDirection = directionDegrees(a, c),
    oriented = (otherDirection - baseDirection + 360) % 360,
    small = Math.min(oriented, 360 - oriented),
    measure = mode === "small" ? small : 360 - small;
  return {
    baseDirection,
    otherDirection,
    oriented,
    small,
    measure,
    type: classifyAngle(measure),
  };
}
function classifyAngle(angle: number) {
  if (Math.abs(angle - 90) < 0.05) return "right";
  if (Math.abs(angle - 180) < 0.05) return "straight";
  if (angle < 90) return "acute";
  if (angle < 180) return "obtuse";
  return "reflex";
}
function modeSweep(model: ReturnType<typeof angleModel>) {
  return model.measure > 180 ? model.measure : model.small;
}
function angleArc(
  center: Point,
  start: number,
  oriented: number,
  sweep: number,
) {
  const radius = 58,
    startPoint = {
      x: center.x + radius * Math.cos((-start * Math.PI) / 180),
      y: center.y + radius * Math.sin((-start * Math.PI) / 180),
    },
    direction = oriented <= 180 ? 1 : 0,
    endAngle =
      start + (sweep > 180 ? (direction ? 360 - sweep : sweep) : sweep),
    endPoint = {
      x: center.x + radius * Math.cos((-endAngle * Math.PI) / 180),
      y: center.y + radius * Math.sin((-endAngle * Math.PI) / 180),
    };
  return `M${startPoint.x} ${startPoint.y}A${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 0 ${endPoint.x} ${endPoint.y}`;
}
function directionDegrees(a: Point, b: Point) {
  const value = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return (value + 360) % 360;
}
function polarPoint(origin: Point, radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: origin.x + radius * Math.cos(radians),
    y: origin.y + radius * Math.sin(radians),
  };
}
function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function format(value: number) {
  return (Math.abs(value) < 0.005 ? 0 : value).toFixed(2);
}
function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function typeColor(type: string) {
  return type === "acute"
    ? "#0ca9be"
    : type === "right"
      ? "#2468e5"
      : type === "obtuse"
        ? "#8b3fe3"
        : type === "straight"
          ? "#f97316"
          : "#ec1360";
}
function typeRange(type: string) {
  return type === "acute"
    ? "(0° < θ < 90°)"
    : type === "right"
      ? "(θ = 90°)"
      : type === "obtuse"
        ? "(90° < θ < 180°)"
        : type === "straight"
          ? "(θ = 180°)"
          : "(180° < θ < 360°)";
}
