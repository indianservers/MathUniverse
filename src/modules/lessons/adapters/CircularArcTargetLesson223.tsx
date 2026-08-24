import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Copy,
  Globe2,
  Grid3X3,
  Lightbulb,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Share2,
  Sigma,
  Target,
  Wrench,
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
type ArcType = "minor" | "major";
type WorkspaceTab = "controls" | "results";
type Drag =
  | { kind: "center"; start: Point; originalCenter: Point }
  | { kind: "start" | "end" }
  | null;

const initialCenter = { x: 0, y: 0 };
const initialRadius = 5;
const initialStartAngle = 36.87;
const initialEndAngle = -83.13;

export default function CircularArcTargetLesson223({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [center, setCenter] = useState<Point>(initialCenter);
  const [radius, setRadius] = useState(initialRadius);
  const [startAngle, setStartAngle] = useState(initialStartAngle);
  const [endAngle, setEndAngle] = useState(initialEndAngle);
  const [arcType, setArcType] = useState<ArcType>("minor");
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("controls");
  const [drag, setDrag] = useState<Drag>(null);
  const [grid, setGrid] = useState(false);
  const [zoom, setZoom] = useState(33.5);
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [hint, setHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );

  const model = useMemo(
    () => arcModel(center, radius, startAngle, endAngle, arcType),
    [arcType, center, endAngle, radius, startAngle],
  );

  const reset = () => {
    setCenter(initialCenter);
    setRadius(initialRadius);
    setStartAngle(initialStartAngle);
    setEndAngle(initialEndAngle);
    setArcType("minor");
    setWorkspaceTab("controls");
    setGrid(false);
    setZoom(33.5);
    setHint(false);
    setAnswer("");
    setFeedback("idle");
    onInteraction();
  };

  useEffect(() => {
    setCenter(initialCenter);
    setRadius(initialRadius);
    setStartAngle(initialStartAngle);
    setEndAngle(initialEndAngle);
    setArcType("minor");
    setWorkspaceTab("controls");
    setGrid(false);
    setZoom(33.5);
    setHint(false);
    setAnswer("");
    setFeedback("idle");
  }, [resetToken]);

  const updateRadius = (value: number) => {
    setRadius(clamp(value, 1, 10));
    onInteraction();
  };

  const updateEndpointCoordinate = (
    endpoint: "start" | "end",
    axis: "x" | "y",
    value: number,
  ) => {
    const point = endpoint === "start" ? model.start : model.end;
    const next = { ...point, [axis]: value };
    const angle = radToDeg(Math.atan2(next.y - center.y, next.x - center.x));
    (endpoint === "start" ? setStartAngle : setEndAngle)(angle);
    onInteraction();
  };

  const checkAnswer = () => {
    const numeric = Number(answer);
    setFeedback(
      Number.isFinite(numeric) && Math.abs(numeric - 3 * Math.PI) <= 0.01
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  const share = async () => {
    const text = `Circular arc: O(${format(center.x)}, ${format(center.y)}), r=${format(radius)}, angle=${model.centralAngle.toFixed(2)}°, s=${model.arcLength.toFixed(3)}`;
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // The visible confirmation still supports browsers without clipboard access.
    }
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
    onInteraction();
  };

  return (
    <section
      className="text-slate-900"
      style={{ marginTop: -8 }}
      data-testid="dynamic-geometry-mockup-0280"
      data-dedicated-lesson="223"
      data-object-model="center-radius-two-point-circular-arc"
      data-direct-interaction="true"
      aria-label="Circular Arc dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>

      <header className="h-[171px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid h-full grid-cols-[minmax(280px,1.5fr)_repeat(4,minmax(82px,.55fr))] items-center gap-3">
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[7px] font-black uppercase text-slate-600">
              Dynamic Geometry Construction
            </span>
            <h1 className="mt-1 text-[31px] font-black leading-8 text-[#10275f]">
              Circular Arc
            </h1>
            <p className="mt-2 text-[11px] text-slate-600">
              Construct and explore arcs of a circle.
            </p>
            <div className="mt-5 flex gap-2">
              <label className="target-arc-header-action">
                <Globe2 />
                <select
                  aria-label="Lesson language"
                  value={language}
                  onChange={(event) => {
                    setLanguage(event.target.value);
                    onInteraction();
                  }}
                >
                  <option>English (English)</option>
                  <option>Hindi (हिन्दी)</option>
                </select>
              </label>
              <button
                type="button"
                className="target-arc-header-action"
                onClick={reset}
              >
                <RotateCcw /> Reset
              </button>
              <button
                type="button"
                className="target-arc-header-action"
                onClick={() => void share()}
              >
                <Share2 /> {shared ? "Copied" : "Share"}
              </button>
            </div>
          </div>
          <HeaderFact icon={<Target />} label="Level" value="Middle School" />
          <HeaderFact icon={<Clock3 />} label="Time" value="6–10 min" />
          <HeaderFact
            icon={<Copy />}
            label="Concepts"
            value="Arc, Central Angle, Arc Length"
          />
          <HeaderFact
            icon={<Wrench />}
            label="Tools"
            value="Point, Circle, Arc, Measure"
          />
        </div>
      </header>

      <nav className="mt-4 grid h-10 grid-cols-5 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {[
          ["Observe", "arc-workspace"],
          ["Manipulate", "arc-workspace"],
          ["Pattern", "arc-observation"],
          ["Rule", "arc-formula"],
          ["Try", "arc-practice"],
        ].map(([label, target], index) => (
          <button
            type="button"
            key={label}
            className={`flex items-center justify-center gap-2 rounded-md text-[9px] font-black ${index === 0 ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" : "text-slate-700"}`}
            onClick={() => {
              document.getElementById(target)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              onInteraction();
            }}
          >
            <span
              className={`grid h-4 w-4 place-items-center rounded-full ${index === 0 ? "bg-white text-blue-600" : "bg-slate-100"}`}
            >
              {index + 1}
            </span>
            {label}
          </button>
        ))}
      </nav>

      <section
        id="arc-workspace"
        className="mt-[11px] h-[570px] rounded-xl border border-slate-200 bg-white p-[7px] shadow-sm"
      >
        <h2 className="ml-2 mt-2 text-[12px] font-black">
          Move the controls to see how the arc, central angle, and arc length
          change.
        </h2>
        <div className="mt-3 grid h-[508px] grid-cols-[minmax(0,1fr)_269px] gap-5">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button
              type="button"
              className="target-arc-grid-toggle"
              aria-pressed={grid}
              onClick={() => {
                setGrid((value) => !value);
                onInteraction();
              }}
            >
              <Grid3X3 /> {grid ? "Hide grid" : "Show grid"}
            </button>
            <ArcCanvas
              model={model}
              zoom={zoom}
              grid={grid}
              drag={drag}
              onDrag={setDrag}
              onCenter={(point) => {
                setCenter(point);
                onInteraction();
              }}
              onStart={(angle) => {
                setStartAngle(angle);
                onInteraction();
              }}
              onEnd={(angle) => {
                setEndAngle(angle);
                onInteraction();
              }}
            />
            <div className="absolute bottom-4 left-3 grid overflow-hidden rounded-md border bg-white shadow-sm">
              <button
                type="button"
                aria-label="Zoom in"
                className="target-arc-zoom"
                onClick={() => {
                  setZoom((value) => clamp(value + 3, 24, 42));
                  onInteraction();
                }}
              >
                <Plus />
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                className="target-arc-zoom"
                onClick={() => {
                  setZoom((value) => clamp(value - 3, 24, 42));
                  onInteraction();
                }}
              >
                <Minus />
              </button>
              <button
                type="button"
                aria-label="Fit arc view"
                className="target-arc-zoom"
                onClick={() => {
                  setZoom(33.5);
                  onInteraction();
                }}
              >
                <Move />
              </button>
            </div>
            <div className="absolute bottom-4 right-4 rounded-md border bg-white p-3 text-[8px] shadow-sm">
              <p>
                <span className="mr-2 inline-block h-0.5 w-6 bg-purple-600" />
                OA (radius)
              </p>
              <p className="mt-2">
                <span className="mr-2 inline-block h-0.5 w-6 bg-cyan-500" />
                OB (radius)
              </p>
              <p className="mt-2">
                <span className="mr-2 inline-block h-0.5 w-6 bg-blue-600" />
                Arc AB ({arcType})
              </p>
            </div>
          </div>

          <aside className="min-w-0">
            <div className="grid h-8 w-[170px] grid-cols-2 overflow-hidden rounded-t-lg border border-b-0 bg-slate-50 text-[9px] font-black">
              {(["controls", "results"] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  aria-pressed={workspaceTab === tab}
                  className={
                    workspaceTab === tab
                      ? "border-b-2 border-blue-600 bg-white text-blue-700"
                      : "text-slate-600"
                  }
                  onClick={() => {
                    setWorkspaceTab(tab);
                    onInteraction();
                  }}
                >
                  {capitalize(tab)}
                </button>
              ))}
            </div>
            <div className="h-[476px] overflow-hidden rounded-xl rounded-tl-none border border-slate-200 bg-white p-3">
              {workspaceTab === "controls" ? (
                <ArcControls
                  model={model}
                  radius={radius}
                  arcType={arcType}
                  onCenter={(axis, value) => {
                    setCenter((point) => ({ ...point, [axis]: value }));
                    onInteraction();
                  }}
                  onRadius={updateRadius}
                  onCoordinate={updateEndpointCoordinate}
                  onStartAngle={(value) => {
                    setStartAngle(value);
                    onInteraction();
                  }}
                  onEndAngle={(value) => {
                    setEndAngle(value);
                    onInteraction();
                  }}
                  onArcType={(value) => {
                    setArcType(value);
                    onInteraction();
                  }}
                />
              ) : (
                <ArcResults model={model} arcType={arcType} />
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-[11px] grid h-[218px] grid-cols-[.95fr_.87fr_1.2fr] gap-2">
        <article id="arc-observation" className="target-arc-card">
          <h2>Observation</h2>
          <ResultRow
            label="Central angle (θ)"
            value={`${model.centralAngle.toFixed(2)}°`}
            tone="text-green-700"
          />
          <ResultRow
            label="Arc length (s)"
            value={model.arcLength.toFixed(3)}
            suffix="units"
            tone="text-blue-700"
          />
          <ResultRow
            label="Arc type"
            value={`${capitalize(arcType)} arc`}
            tone="text-purple-700"
          />
          <ResultRow
            label="Radius (r)"
            value={radius.toFixed(2)}
            suffix="units"
            tone="text-blue-700"
          />
        </article>
        <article className="target-arc-card">
          <h2>Construction steps</h2>
          {[
            "Construct a circle with center O and radius r.",
            "Mark start point A on the circle.",
            "Mark end point B on the circle.",
            `The ${arcType} arc AB is highlighted.`,
            "Measure central angle ∠AOB and arc length s.",
          ].map((step, index) => (
            <p key={step} className="target-arc-step">
              <b>{index + 1}</b>
              {step}
            </p>
          ))}
        </article>
        <article id="arc-formula" className="target-arc-card">
          <h2>Key formula</h2>
          <p>For a circle of radius r and central angle θ (in degrees):</p>
          <div className="target-arc-formula">s = θ/360° × 2πr</div>
          <p className="mt-3">where &nbsp; s = arc length</p>
          <p className="mt-2">r = radius</p>
          <p className="mt-2">θ = central angle</p>
        </article>
      </section>

      <section
        id="arc-practice"
        className="mt-3 h-[193px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="text-[11px] font-black text-blue-700">
          Try it: Practice
        </h2>
        <p className="mt-2 text-[9px]">
          Construct a minor arc with radius r = 6 such that the central angle is
          θ = 90°. Find the arc length.
        </p>
        <div className="mt-4 grid grid-cols-[1fr_1.2fr_.9fr] divide-x text-[8px]">
          <div className="pr-4">
            <h3 className="font-black">Your task</h3>
            {[
              "Set r = 6.",
              "Set θ = 90° using points A and B.",
              "Find the arc length.",
            ].map((item) => (
              <p key={item} className="mt-2">
                <CheckCircle2 className="mr-2 inline h-3 w-3 text-green-600" />
                {item}
              </p>
            ))}
          </div>
          <div className="px-4">
            <h3 className="font-black">Answer</h3>
            <label className="mt-3 flex items-center gap-2">
              Arc length (s)
              <input
                aria-label="Practice arc length"
                inputMode="decimal"
                className="w-28 rounded-md border px-2 py-1"
                placeholder="Enter value"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value);
                  setFeedback("idle");
                }}
              />
              units
            </label>
            <p className="mt-1">
              Expected: <b>9.425 units</b>
            </p>
            <button
              type="button"
              className="target-arc-check"
              onClick={checkAnswer}
            >
              Check answer
            </button>
            {feedback === "idle" ? (
              <span role="status" className="sr-only">
                Awaiting an arc length answer.
              </span>
            ) : (
              <p
                role="status"
                className={`mt-1 font-black ${feedback === "correct" ? "text-green-700" : "text-rose-700"}`}
              >
                {feedback === "correct"
                  ? "Correct arc length."
                  : "Recheck θ/360 × 2πr."}
              </p>
            )}
          </div>
          <div className="pl-4">
            <button
              type="button"
              className="flex items-center gap-2 font-black text-blue-700"
              aria-expanded={hint}
              onClick={() => {
                setHint((value) => !value);
                onInteraction();
              }}
            >
              <Lightbulb className="h-4 w-4" /> Hint
            </button>
            <div className="mt-3 rounded-md bg-blue-50 p-3 text-center">
              <p>
                {hint ? "Substitute r = 6 and θ = 90°." : "Use the formula"}
              </p>
              <p className="mt-3 font-serif text-[12px] italic">
                s = θ/360° × 2πr
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav
        className="mt-[9px] grid h-[49px] grid-cols-2 gap-3"
        aria-label="Adjacent lessons"
      >
        <a className="target-arc-nav" href="/lessons/geometry/222-semicircle">
          <ArrowLeft />
          <span>
            <b>Previous</b>Semicircle
          </span>
        </a>
        <a
          className="target-arc-nav justify-end text-right"
          href="/lessons/geometry/224-circumcircular-arc"
        >
          <span>
            <b>Next</b>Circumcircular Arc
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function HeaderFact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-16 -translate-y-3 gap-2 border-l border-slate-200 pl-3 text-[8px] text-slate-600">
      <span className="mt-1 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <span>
        <b className="block text-slate-500">{label}</b>
        <span className="mt-2 block leading-3 text-slate-800">{value}</span>
      </span>
    </div>
  );
}

function ArcCanvas({
  model,
  zoom,
  grid,
  drag,
  onDrag,
  onCenter,
  onStart,
  onEnd,
}: {
  model: ReturnType<typeof arcModel>;
  zoom: number;
  grid: boolean;
  drag: Drag;
  onDrag: (drag: Drag) => void;
  onCenter: (point: Point) => void;
  onStart: (angle: number) => void;
  onEnd: (angle: number) => void;
}) {
  const origin = { x: 235, y: 235 };
  const screen = (point: Point) => ({
    x: origin.x + point.x * zoom,
    y: origin.y - point.y * zoom,
  });
  const localPoint = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const local = new DOMPoint(clientX, clientY).matrixTransform(
      matrix.inverse(),
    );
    return { x: (local.x - origin.x) / zoom, y: (origin.y - local.y) / zoom };
  };
  const center = screen(model.center);
  const start = screen(model.start);
  const end = screen(model.end);
  const radiusPixels = model.radius * zoom;
  const startDrag = (
    event: ReactPointerEvent<SVGElement>,
    kind: "center" | "start" | "end",
  ) => {
    event.stopPropagation();
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    svg.setPointerCapture(event.pointerId);
    onDrag(
      kind === "center"
        ? {
            kind,
            start: localPoint(svg, event.clientX, event.clientY),
            originalCenter: model.center,
          }
        : { kind },
    );
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const point = localPoint(event.currentTarget, event.clientX, event.clientY);
    if (drag.kind === "center") {
      onCenter({
        x: clamp(drag.originalCenter.x + point.x - drag.start.x, -3, 3),
        y: clamp(drag.originalCenter.y + point.y - drag.start.y, -3, 3),
      });
      return;
    }
    const angle = radToDeg(
      Math.atan2(point.y - model.center.y, point.x - model.center.x),
    );
    (drag.kind === "start" ? onStart : onEnd)(angle);
  };
  return (
    <svg
      role="img"
      aria-label="Interactive circular arc plane with draggable center O and circumference points A and B"
      className="h-full w-full touch-none"
      viewBox="0 0 500 500"
      onPointerMove={move}
      onPointerUp={() => onDrag(null)}
      onPointerCancel={() => onDrag(null)}
    >
      <defs>
        <pattern
          id="arc-grid"
          width={zoom}
          height={zoom}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${zoom} 0 H 0 V ${zoom}`}
            fill="none"
            stroke="#dbe7f5"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="500" height="500" fill={grid ? "url(#arc-grid)" : "white"} />
      <line
        x1="10"
        y1={origin.y}
        x2="490"
        y2={origin.y}
        stroke="#64748b"
        strokeDasharray="4 4"
      />
      <line
        x1={origin.x}
        y1="10"
        x2={origin.x}
        y2="490"
        stroke="#64748b"
        strokeDasharray="4 4"
      />
      <path d={`M 486 ${origin.y - 4} l 8 4 -8 4`} fill="#64748b" />
      <path d={`M ${origin.x - 4} 14 l 4 -8 4 8`} fill="#64748b" />
      <text x="485" y={origin.y + 20} fontSize="12">
        x
      </text>
      <text x={origin.x - 15} y="18" fontSize="12">
        y
      </text>
      <circle
        cx={center.x}
        cy={center.y}
        r={radiusPixels}
        fill="none"
        stroke="#aeb8c7"
        strokeWidth="1.5"
      />
      <line
        x1={center.x}
        y1={center.y}
        x2={start.x}
        y2={start.y}
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <line
        x1={center.x}
        y1={center.y}
        x2={end.x}
        y2={end.y}
        stroke="#0ea5b7"
        strokeWidth="2"
      />
      <path
        data-testid="circular-arc-path"
        data-arc-length={model.arcLength.toFixed(6)}
        data-central-angle={model.centralAngle.toFixed(4)}
        d={arcPath(start, end, radiusPixels, model)}
        fill="none"
        stroke="#1677ff"
        strokeWidth="3"
      />
      <path
        d={angleArc(center, model)}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1"
      />
      <text
        x={center.x + 52}
        y={center.y - 12}
        fill="#1677ff"
        fontSize="12"
        fontWeight="700"
      >
        {model.centralAngle.toFixed(2)}°
      </text>
      <text x={center.x - 105} y={center.y - 34} fill="#64748b" fontSize="12">
        r = {model.radius.toFixed(2)}
      </text>
      <circle
        data-testid="arc-center-point"
        cx={center.x}
        cy={center.y}
        r="7"
        fill="#1677ff"
        onPointerDown={(event) => startDrag(event, "center")}
      />
      <circle
        data-testid="arc-start-point"
        cx={start.x}
        cy={start.y}
        r="7"
        fill="#7c3aed"
        onPointerDown={(event) => startDrag(event, "start")}
      />
      <circle
        data-testid="arc-end-point"
        cx={end.x}
        cy={end.y}
        r="7"
        fill="#10aebb"
        onPointerDown={(event) => startDrag(event, "end")}
      />
      <text x={center.x - 52} y={center.y + 22} fill="#1677ff" fontSize="12">
        O ({format(model.center.x)}, {format(model.center.y)})
      </text>
      <text x={start.x + 14} y={start.y - 10} fill="#7c3aed" fontSize="12">
        A ({format(model.start.x)}, {format(model.start.y)})
      </text>
      <text x={end.x + 14} y={end.y + 18} fill="#0891a2" fontSize="12">
        B ({format(model.end.x)}, {format(model.end.y)})
      </text>
    </svg>
  );
}

function ArcControls({
  model,
  radius,
  arcType,
  onCenter,
  onRadius,
  onCoordinate,
  onStartAngle,
  onEndAngle,
  onArcType,
}: {
  model: ReturnType<typeof arcModel>;
  radius: number;
  arcType: ArcType;
  onCenter: (axis: "x" | "y", value: number) => void;
  onRadius: (value: number) => void;
  onCoordinate: (
    endpoint: "start" | "end",
    axis: "x" | "y",
    value: number,
  ) => void;
  onStartAngle: (value: number) => void;
  onEndAngle: (value: number) => void;
  onArcType: (value: ArcType) => void;
}) {
  return (
    <div className="text-[8px]">
      <ControlTitle icon={<CircleDot />} title="Center O" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberField
          label="x₀"
          aria="Center x"
          value={model.center.x}
          onChange={(value) => onCenter("x", value)}
        />
        <NumberField
          label="y₀"
          aria="Center y"
          value={model.center.y}
          onChange={(value) => onCenter("y", value)}
        />
      </div>
      <ControlRange
        label="Radius (r)"
        aria="Arc radius"
        value={radius}
        min={1}
        max={10}
        step={0.1}
        display={radius.toFixed(2)}
        onChange={onRadius}
      />
      <hr className="my-3" />
      <ControlTitle
        icon={<span className="h-2 w-2 rounded-full bg-purple-600" />}
        title="Start point A"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberField
          label="x₁"
          aria="Start point x"
          value={model.start.x}
          onChange={(value) => onCoordinate("start", "x", value)}
        />
        <NumberField
          label="y₁"
          aria="Start point y"
          value={model.start.y}
          onChange={(value) => onCoordinate("start", "y", value)}
        />
      </div>
      <ControlRange
        label="Angle θ from +x axis"
        aria="Start angle"
        value={normalizeDegrees(model.startAngle)}
        min={-180}
        max={180}
        step={0.1}
        display={`${normalizeDegrees(model.startAngle).toFixed(2)}°`}
        onChange={onStartAngle}
      />
      <hr className="my-3" />
      <ControlTitle
        icon={<span className="h-2 w-2 rounded-full bg-cyan-500" />}
        title="End point B"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberField
          label="x₂"
          aria="End point x"
          value={model.end.x}
          onChange={(value) => onCoordinate("end", "x", value)}
        />
        <NumberField
          label="y₂"
          aria="End point y"
          value={model.end.y}
          onChange={(value) => onCoordinate("end", "y", value)}
        />
      </div>
      <ControlRange
        label="Angle φ from +x axis"
        aria="End angle"
        value={normalizeDegrees(model.endAngle)}
        min={-180}
        max={180}
        step={0.1}
        display={`${normalizeDegrees(model.endAngle).toFixed(2)}°`}
        onChange={onEndAngle}
      />
      <hr className="my-1" />
      <p className="font-black">Arc type</p>
      <div className="mt-1 grid grid-cols-2 overflow-hidden rounded-md border">
        {(["minor", "major"] as const).map((type) => (
          <button
            type="button"
            key={type}
            aria-pressed={arcType === type}
            className={`h-7 font-black ${arcType === type ? "border border-blue-500 bg-blue-50 text-blue-800" : "bg-slate-50"}`}
            onClick={() => onArcType(type)}
          >
            {capitalize(type)} arc
          </button>
        ))}
      </div>
      <p className="mt-2 flex items-center justify-between">
        Drag points A or B on the diagram{" "}
        <span className="relative h-5 w-9 rounded-full bg-blue-600">
          <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
        </span>
      </p>
    </div>
  );
}

function ArcResults({
  model,
  arcType,
}: {
  model: ReturnType<typeof arcModel>;
  arcType: ArcType;
}) {
  const values = [
    ["Arc type", `${capitalize(arcType)} arc`],
    ["Central angle", `${model.centralAngle.toFixed(2)}°`],
    ["Arc length", `${model.arcLength.toFixed(3)} units`],
    ["Chord length", `${model.chordLength.toFixed(3)} units`],
    ["Sector area", `${model.sectorArea.toFixed(3)} square units`],
    ["Circumference", `${model.circumference.toFixed(3)} units`],
  ];
  return (
    <div className="text-[9px]">
      <h3 className="flex items-center gap-2 text-[11px] font-black">
        <Sigma className="h-4 w-4 text-blue-600" />
        Calculated results
      </h3>
      <p className="mt-2 text-slate-500">
        All values derive from O, r, A, and B.
      </p>
      <div className="mt-4 space-y-2">
        {values.map(([label, value]) => (
          <p key={label} className="flex justify-between rounded-md border p-3">
            <span>{label}</span>
            <b>{value}</b>
          </p>
        ))}
      </div>
      <p className="mt-4 rounded-md bg-cyan-50 p-3 text-cyan-800">
        <Check className="mr-2 inline h-4 w-4" />
        The highlighted endpoints lie exactly on the circle.
      </p>
    </div>
  );
}

function ControlTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-[10px] font-black [&_svg]:h-3 [&_svg]:w-3">
      {icon}
      {title}
    </h3>
  );
}
function NumberField({
  label,
  aria,
  value,
  onChange,
}: {
  label: string;
  aria: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-1">
      <span>{label}</span>
      <input
        type="number"
        step="0.1"
        aria-label={aria}
        className="h-7 min-w-0 flex-1 rounded-md border px-2 py-0"
        value={value.toFixed(2)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function ControlRange({
  label,
  aria,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  aria: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-3">
      <p className="font-black">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          aria-label={aria}
          className="min-w-0 flex-1 accent-blue-600"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <output className="grid h-7 w-14 place-items-center rounded-md border px-2 text-right font-black">
          {display}
        </output>
      </div>
    </div>
  );
}
function ResultRow({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  tone: string;
}) {
  return (
    <p className="flex items-center justify-between border-b py-3 text-[9px]">
      <span>{label}</span>
      <span>
        <b className={`text-[12px] ${tone}`}>{value}</b>
        {suffix && (
          <small className="ml-2 block text-[7px] text-slate-500">
            {suffix}
          </small>
        )}
      </span>
    </p>
  );
}

function arcModel(
  center: Point,
  radius: number,
  startAngle: number,
  endAngle: number,
  arcType: ArcType,
) {
  const rawDelta = normalize360(endAngle - startAngle);
  const minorAngle = Math.min(rawDelta, 360 - rawDelta);
  const minorClockwise = rawDelta > 180;
  const centralAngle = arcType === "minor" ? minorAngle : 360 - minorAngle;
  const clockwise = arcType === "minor" ? minorClockwise : !minorClockwise;
  const start = polar(center, radius, startAngle);
  const end = polar(center, radius, endAngle);
  const radians = degToRad(centralAngle);
  return {
    center,
    radius,
    startAngle,
    endAngle,
    start,
    end,
    centralAngle,
    clockwise,
    arcLength: radius * radians,
    chordLength: 2 * radius * Math.sin(degToRad(minorAngle) / 2),
    sectorArea: (centralAngle / 360) * Math.PI * radius * radius,
    circumference: 2 * Math.PI * radius,
  };
}

function arcPath(
  start: Point,
  end: Point,
  radiusPixels: number,
  model: ReturnType<typeof arcModel>,
) {
  return `M ${start.x} ${start.y} A ${radiusPixels} ${radiusPixels} 0 ${model.centralAngle > 180 ? 1 : 0} ${model.clockwise ? 1 : 0} ${end.x} ${end.y}`;
}
function angleArc(center: Point, model: ReturnType<typeof arcModel>) {
  const a = {
    x: center.x + 44 * Math.cos(degToRad(model.startAngle)),
    y: center.y - 44 * Math.sin(degToRad(model.startAngle)),
  };
  const signed = model.clockwise ? -model.centralAngle : model.centralAngle;
  const endAngle = model.startAngle + signed;
  const b = {
    x: center.x + 44 * Math.cos(degToRad(endAngle)),
    y: center.y - 44 * Math.sin(degToRad(endAngle)),
  };
  return `M ${a.x} ${a.y} A 44 44 0 ${model.centralAngle > 180 ? 1 : 0} ${model.clockwise ? 1 : 0} ${b.x} ${b.y}`;
}
function polar(center: Point, radius: number, angle: number) {
  const radians = degToRad(angle);
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians),
  };
}
function normalize360(value: number) {
  return ((value % 360) + 360) % 360;
}
function normalizeDegrees(value: number) {
  const normalized = normalize360(value);
  return normalized > 180 ? normalized - 360 : normalized;
}
function degToRad(value: number) {
  return (value * Math.PI) / 180;
}
function radToDeg(value: number) {
  return (value * 180) / Math.PI;
}
function format(value: number) {
  return Number(value.toFixed(2)).toString();
}
function capitalize<T extends string>(value: T) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
