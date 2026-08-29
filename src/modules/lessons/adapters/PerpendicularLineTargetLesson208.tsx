import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Circle,
  Compass,
  Eraser,
  Eye,
  Maximize2,
  Minus,
  MousePointer2,
  Plus,
  Shuffle,
  Slash,
  SquarePen,
  Target,
  Waypoints,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./PerpendicularLineTargetLesson208.css";

type Point = { x: number; y: number };
type Tool = "select" | "point" | "line" | "perpendicular";
const initialP = { x: 2, y: 1 };

export default function PerpendicularLineTargetLesson208({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m, setM] = useState(0.5);
  const [p, setP] = useState<Point>(initialP);
  const [tool, setTool] = useState<Tool>("select");
  const [showPerpendicular, setShowPerpendicular] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [practice, setPractice] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [stage, setStage] = useState(0);
  const surfaceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setM(0.5);
    setP(initialP);
    setTool("select");
    setShowPerpendicular(true);
    setZoom(1);
    setPractice(false);
    setFeedback("idle");
  }, [resetToken]);
  const perpendicularSlope = Math.abs(m) < 0.001 ? null : -1 / m;
  const valid = showPerpendicular;
  const setPoint = (next: Point) => {
    setP({ x: clamp(next.x), y: clamp(next.y) });
    setFeedback("idle");
    onInteraction();
  };
  const randomize = () => {
    const slopes = [-2, -1, -0.5, 0.5, 1, 2];
    const next = slopes[Math.floor(Math.random() * slopes.length)];
    setM(next);
    setP({
      x: Math.round(Math.random() * 6 - 3),
      y: Math.round(Math.random() * 6 - 3),
    });
    setShowPerpendicular(true);
    setFeedback("idle");
    onInteraction();
  };
  const startPractice = () => {
    setM(-2 / 3);
    setP({ x: 3, y: -2 });
    setShowPerpendicular(false);
    setTool("perpendicular");
    setPractice(true);
    setFeedback("idle");
    document
      .getElementById("perpendicular-plane")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    onInteraction();
  };
  const checkPractice = () => {
    setFeedback(practice && showPerpendicular ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      ref={surfaceRef}
      className="perp208-page space-y-3"
      data-testid="dynamic-geometry-mockup-0265"
      data-dedicated-lesson="208"
      data-object-model="perpendicular-line"
      data-direct-interaction="true"
      data-slope={m.toFixed(4)}
      data-perpendicular-slope={
        perpendicularSlope === null ? "vertical" : perpendicularSlope.toFixed(4)
      }
      data-point={`${p.x}:${p.y}`}
      data-tool={tool}
      data-visible={String(showPerpendicular)}
      data-zoom={zoom.toFixed(1)}
      data-stage={String(stage)}
      data-practice={feedback}
      aria-label="Perpendicular line dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <span className="grid h-20 w-20 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 text-white">
            <PerpendicularIcon />
          </span>
          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[8px] font-black text-blue-700">
              Coordinate Geometry
            </span>
            <h1 className="mt-2 text-3xl font-black leading-none">
              Perpendicular Line
            </h1>
            <p className="mt-2 text-[11px] text-slate-600">
              Construct a right-angle line through a given point.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-slate-200 p-3 text-[8px]">
          <Meta title="Level" value="Middle School" />
          <Meta title="Time" value="6-10 min" />
          <Meta title="Skills" value="Slope, Perpendicularity" />
          <Meta title="Prerequisite" value="Straight Line, Slope" />
        </div>
      </header>
      <nav className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {[
          ["Explore", "Manipulate", Eye],
          ["Construct", "Use tools", Compass],
          ["Pattern", "Compare slopes", Waypoints],
          ["Rule", "Prove it", BookOpenCheck],
          ["Practice", "Build alone", SquarePen],
        ].map(([title, sub, StageIcon], index) => (
          <button
            type="button"
            key={String(title)}
            onClick={() => {
              setStage(index);
              document
                .getElementById(
                  index === 4
                    ? "perpendicular-practice"
                    : index >= 2
                      ? "perpendicular-rule"
                      : "perpendicular-plane",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              onInteraction();
            }}
            className={`flex h-[45px] items-center justify-center gap-2 text-[8px] font-bold [&_svg]:h-3.5 [&_svg]:w-3.5 ${stage === index ? "border-b-2 border-cyan-500 text-cyan-700" : "text-slate-600"}`}
          >
            <StageIcon />
            <span className="text-left">
              <strong className="text-[9px]">{title}</strong>
              <small className="block">{sub}</small>
            </span>
          </button>
        ))}
      </nav>

      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <h2 className="text-sm font-black">
              Manipulate: Construct a perpendicular line
            </h2>
            <div className="relative mt-2">
              <div className="absolute left-2 top-2 z-10 w-[70px] rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm">
                <Tool
                  active={tool === "select"}
                  label="Select"
                  onClick={() => setToolState("select")}
                >
                  <MousePointer2 />
                </Tool>
                <Tool
                  active={tool === "point"}
                  label="Point"
                  onClick={() => setToolState("point")}
                >
                  <Circle />
                </Tool>
                <Tool
                  active={tool === "line"}
                  label="Line"
                  onClick={() => setToolState("line")}
                >
                  <Slash />
                </Tool>
                <Tool
                  active={tool === "perpendicular"}
                  label="Perpendicular"
                  onClick={() => setToolState("perpendicular")}
                >
                  <Target />
                </Tool>
                <Tool
                  label="Clear"
                  onClick={() => {
                    setShowPerpendicular(false);
                    setFeedback("idle");
                    onInteraction();
                  }}
                >
                  <Eraser />
                </Tool>
              </div>
              <PerpendicularPlane
                id="perpendicular-plane"
                m={m}
                p={p}
                showPerpendicular={showPerpendicular}
                zoom={zoom}
                tool={tool}
                dragging={dragging}
                onDragging={setDragging}
                onPoint={setPoint}
                onLineSlope={(next) => {
                  setM(Math.max(-3, Math.min(3, next)));
                  setFeedback("idle");
                  onInteraction();
                }}
                onConstruct={(at) => {
                  if (distance(at, p) <= 0.6) {
                    setShowPerpendicular(true);
                    setFeedback("idle");
                  }
                  onInteraction();
                }}
                onZoom={(delta) => {
                  setZoom((value) =>
                    Math.max(0.75, Math.min(1.4, value + delta)),
                  );
                  onInteraction();
                }}
                onFullscreen={() => {
                  void surfaceRef.current?.requestFullscreen?.();
                  onInteraction();
                }}
              />
            </div>
          </div>
          <aside className="space-y-2">
            <Panel title="Controls">
              <label className="block font-bold">
                Given line slope (m):{" "}
                <strong className="float-right">{fraction(m)}</strong>
                <input
                  aria-label="Given line slope"
                  type="range"
                  min="-3"
                  max="3"
                  step="0.25"
                  value={m}
                  onChange={(event) => {
                    setM(Number(event.target.value));
                    setFeedback("idle");
                    onInteraction();
                  }}
                  className="mt-2 w-full"
                />
              </label>
              <p className="mt-3 font-bold">Point P:</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Coordinate
                  label="x"
                  value={p.x}
                  onChange={(x) => setPoint({ ...p, x })}
                />
                <Coordinate
                  label="y"
                  value={p.y}
                  onChange={(y) => setPoint({ ...p, y })}
                />
              </div>
              <button
                type="button"
                onClick={randomize}
                className="mt-3 w-full rounded-md bg-cyan-600 py-2 font-black text-white"
              >
                <Shuffle className="mr-1 inline h-3 w-3" /> New example
              </button>
            </Panel>
            <Panel title="Check your construction">
              {[
                ["Passes through P", valid],
                ["Perpendicular to given line", valid],
                ["Right angle = 90°", valid],
              ].map(([label, ok]) => (
                <p key={String(label)} className="flex justify-between py-1">
                  <span>{String(label)}</span>
                  <b className={ok ? "text-emerald-600" : "text-slate-300"}>
                    {ok ? "✓" : "○"}
                  </b>
                </p>
              ))}
            </Panel>
            <Panel title="Result">
              {valid ? (
                <p
                  role="status"
                  className="rounded bg-emerald-50 p-2 font-black text-emerald-700"
                >
                  Great! Your line is perpendicular.
                </p>
              ) : (
                <p className="rounded bg-amber-50 p-2 font-bold text-amber-800">
                  Use the Perpendicular tool through P.
                </p>
              )}
              <Measure
                label="Your slope"
                value={
                  perpendicularSlope === null
                    ? "undefined"
                    : fraction(perpendicularSlope)
                }
              />
              <Measure
                label="Expected slope"
                value={
                  perpendicularSlope === null ? "vertical" : fraction(-1 / m)
                }
              />
              <Measure label="Angle between lines" value="90.0°" />
            </Panel>
          </aside>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-sm font-black text-blue-800">
          Construction steps (Compass-style)
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {[
            "Mark point P on the plane.",
            "Draw the given line with slope m.",
            "Through P, draw a line perpendicular to the given line.",
            "Verify the right angle and slope product.",
          ].map((text, index) => (
            <article key={text} className="text-[8px]">
              <b className="grid h-5 w-5 place-items-center rounded-full bg-cyan-600 text-white">
                {index + 1}
              </b>
              <p className="mt-2 min-h-10">{text}</p>
              <MiniStep index={index} />
            </article>
          ))}
        </div>
      </section>
      <div
        id="perpendicular-rule"
        className="grid gap-3 md:grid-cols-[220px_1fr]"
      >
        <Panel title="Insight">
          <p>
            For two non-vertical lines with slopes m₁ and m₂, they are
            perpendicular when:
          </p>
          <p className="mt-3 text-center font-serif text-base font-black">
            m₁ × m₂ = -1
          </p>
        </Panel>
        <Panel title="Rule (Perpendicular Lines)">
          <p>If a line has slope m, then any perpendicular line has slope:</p>
          <p className="my-3 text-center font-serif text-lg font-black">
            m⊥ = -1/m
          </p>
          <ul className="list-disc pl-4">
            <li>If m = 0, the perpendicular is vertical.</li>
            <li>If m is undefined, the perpendicular is horizontal.</li>
          </ul>
        </Panel>
      </div>
      <section
        id="perpendicular-practice"
        className="min-h-[210px] rounded-lg border border-slate-200 bg-white p-3 text-[9px]"
      >
        <h2 className="text-sm font-black">Try on your own</h2>
        <p className="text-[9px]">
          Construct a perpendicular to the given line through point P.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-[150px_1fr_170px]">
          <div>
            <strong className="text-[10px] text-blue-700">Problem</strong>
            <p className="mt-3">Line slope m = -2/3</p>
            <p className="mt-2">Point P(3, -2)</p>
            <button
              type="button"
              onClick={startPractice}
              className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-[9px] font-black text-white"
            >
              Start construction
            </button>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <h3 className="text-[10px] font-black text-violet-700">
              Your construction
            </h3>
            <p className="mt-2 rounded bg-blue-50 p-2">
              Select Perpendicular, then place it through P.
            </p>
            <MiniPractice m={m} p={p} show={showPerpendicular} />
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <h3 className="text-[10px] font-black text-violet-700">
              Check & feedback
            </h3>
            {["Passes through P", "Perpendicular", "Right angle = 90°"].map(
              (text) => (
                <p key={text} className="mt-2">
                  {practice && showPerpendicular ? "✓" : "○"} {text}
                </p>
              ),
            )}
            <button
              type="button"
              disabled={!practice}
              onClick={checkPractice}
              className="mt-4 w-full rounded-md bg-blue-600 py-2 text-[9px] font-black text-white disabled:bg-slate-200"
            >
              Check answer
            </button>
            {feedback !== "idle" ? (
              <p
                role="status"
                className={`mt-2 rounded p-2 font-black ${feedback === "correct" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
              >
                {feedback === "correct"
                  ? "Correct perpendicular construction."
                  : "Construct the perpendicular line first."}
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <nav className="grid grid-cols-3 gap-2 text-[9px] font-bold">
        <a
          href="/lessons/geometry/209-parallel-line"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Parallel Line
          </span>
        </a>
        <span className="grid place-items-center rounded-lg border border-slate-200 bg-white p-3">
          Lesson progress 3 / 5
        </span>
        <a
          href="/lessons/geometry/176-angle-between-lines"
          className="flex items-center justify-end gap-2 rounded-lg border border-violet-200 bg-violet-50 p-3"
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>
            Angle Between Lines
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">Live Verification. Check Construction.</span>
    </section>
  );

  function setToolState(next: Tool) {
    setTool(next);
    onInteraction();
  }
}

function PerpendicularPlane({
  id,
  m,
  p,
  showPerpendicular,
  zoom,
  tool,
  dragging,
  onDragging,
  onPoint,
  onLineSlope,
  onConstruct,
  onZoom,
  onFullscreen,
}: {
  id: string;
  m: number;
  p: Point;
  showPerpendicular: boolean;
  zoom: number;
  tool: Tool;
  dragging: boolean;
  onDragging: (value: boolean) => void;
  onPoint: (point: Point) => void;
  onLineSlope: (m: number) => void;
  onConstruct: (point: Point) => void;
  onZoom: (d: number) => void;
  onFullscreen: () => void;
}) {
  const draggingRef = useRef(false);
  const width = 470,
    height = 450,
    cx = width / 2,
    cy = height / 2,
    unit = 30 * zoom,
    sx = (x: number) => cx + x * unit,
    sy = (y: number) => cy - y * unit;
  const from = (event: PointerEvent<SVGSVGElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    return {
      x: (((event.clientX - r.left) / r.width) * width - cx) / unit,
      y: (cy - ((event.clientY - r.top) / r.height) * height) / unit,
    };
  };
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current && !dragging) return;
    onPoint(from(event));
  };
  const mouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (!draggingRef.current) return;
    const r = event.currentTarget.getBoundingClientRect();
    onPoint({
      x: (((event.clientX - r.left) / r.width) * width - cx) / unit,
      y: (cy - ((event.clientY - r.top) / r.height) * height) / unit,
    });
  };
  const baseY = (x: number) => m * x;
  const mp = Math.abs(m) < 0.001 ? 999 : -1 / m;
  const perpY = (x: number) => p.y + mp * (x - p.x);
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-lg border border-slate-200"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none bg-white"
        role="img"
        aria-label="Perpendicular line coordinate plane with draggable point P"
        onPointerDown={(e) => {
          if (tool === "point") onPoint(from(e));
          if (tool === "line") {
            const q = from(e);
            onLineSlope(q.y / (q.x || 0.1));
          }
          if (tool === "perpendicular") onConstruct(from(e));
        }}
        onPointerMove={move}
        onMouseMove={mouseMove}
        onMouseUp={() => {
          draggingRef.current = false;
          onDragging(false);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
          onDragging(false);
        }}
      >
        {Array.from({ length: 15 }, (_, i) => i - 7).map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1="0" x2={sx(v)} y2={height} stroke="#dbeafe" />
            <line x1="0" y1={sy(v)} x2={width} y2={sy(v)} stroke="#dbeafe" />
          </g>
        ))}
        <line x1="0" y1={cy} x2={width} y2={cy} stroke="#64748b" />
        <line x1={cx} y1="0" x2={cx} y2={height} stroke="#64748b" />
        <line
          x1={sx(-8)}
          y1={sy(baseY(-8))}
          x2={sx(8)}
          y2={sy(baseY(8))}
          stroke="#7c3aed"
          strokeWidth="2.5"
        />
        {showPerpendicular ? (
          <line
            x1={sx(-8)}
            y1={sy(perpY(-8))}
            x2={sx(8)}
            y2={sy(perpY(8))}
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeDasharray="7 5"
          />
        ) : null}
        <circle
          data-testid="perpendicular-point-p"
          cx={sx(p.x)}
          cy={sy(p.y)}
          r="7"
          fill="#0891b2"
          className="cursor-grab"
          onPointerDown={(e) => {
            e.stopPropagation();
            if (tool === "perpendicular") {
              onConstruct(p);
              return;
            }
            if (tool !== "select") return;
            e.currentTarget.setPointerCapture(e.pointerId);
            draggingRef.current = true;
            onDragging(true);
          }}
          onMouseDown={() => {
            if (tool !== "select") return;
            draggingRef.current = true;
            onDragging(true);
          }}
          onPointerMove={(e) => {
            if (!draggingRef.current) return;
            const svg = e.currentTarget.ownerSVGElement;
            if (!svg) return;
            const r = svg.getBoundingClientRect();
            onPoint({
              x: (((e.clientX - r.left) / r.width) * width - cx) / unit,
              y: (cy - ((e.clientY - r.top) / r.height) * height) / unit,
            });
          }}
          onPointerUp={() => {
            draggingRef.current = false;
            onDragging(false);
          }}
        />
        <text
          x={sx(p.x) + 10}
          y={sy(p.y) - 10}
          fill="#0891b2"
          fontSize="12"
          fontWeight="800"
          pointerEvents="none"
        >
          P ({p.x}, {p.y})
        </text>
        {showPerpendicular ? (
          <>
            <rect
              x={sx(p.x) - 14}
              y={sy(p.y) - 14}
              width="14"
              height="14"
              fill="none"
              stroke="#7c3aed"
              pointerEvents="none"
            />
            <text
              x={sx(p.x) - 36}
              y={sy(p.y) - 20}
              fontSize="10"
              pointerEvents="none"
            >
              90°
            </text>
          </>
        ) : null}
      </svg>
      <div className="absolute bottom-3 left-3 flex flex-col gap-1">
        <Icon label="Zoom in" onClick={() => onZoom(0.1)}>
          <Plus />
        </Icon>
        <Icon label="Zoom out" onClick={() => onZoom(-0.1)}>
          <Minus />
        </Icon>
        <Icon label="Fullscreen" onClick={onFullscreen}>
          <Maximize2 />
        </Icon>
      </div>
    </div>
  );
}

function Tool({
  active = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[8px] font-bold [&_svg]:h-3 [&_svg]:w-3 ${active ? "bg-blue-50 text-blue-700" : ""}`}
    >
      {children}
      {label}
    </button>
  );
}
function Icon({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded border bg-white [&_svg]:h-4 [&_svg]:w-4"
    >
      {children}
    </button>
  );
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 text-[9px]">
      <h3 className="font-black text-blue-950">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
function Meta({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-r border-slate-200 px-3 last:border-0">
      <span className="text-slate-500">{title}</span>
      <strong className="block text-[9px]">{value}</strong>
    </div>
  );
}
function Measure({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between border-b border-slate-100 py-1.5 last:border-0">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  );
}
function Coordinate({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid grid-cols-[auto_1fr] items-center gap-1">
      {label}
      <input
        aria-label={`Point P ${label}`}
        type="number"
        min="-6"
        max="6"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border px-2 py-1"
      />
    </label>
  );
}
function MiniStep({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 120 55" className="h-12 w-full">
      {index > 0 ? (
        <line
          x1="12"
          y1="42"
          x2="108"
          y2={index === 3 ? "18" : "30"}
          stroke="#7c3aed"
          strokeWidth="2"
        />
      ) : null}
      <circle
        cx={index === 0 ? 60 : 70}
        cy={index === 0 ? 30 : 25}
        r="3"
        fill="#0891b2"
      />
      {index > 1 ? (
        <line
          x1="70"
          y1="5"
          x2="70"
          y2="50"
          stroke="#0ea5e9"
          strokeDasharray="5 3"
        />
      ) : null}
    </svg>
  );
}
function MiniPractice({ m, p, show }: { m: number; p: Point; show: boolean }) {
  return (
    <svg viewBox="0 0 260 90" className="mt-2 w-full">
      <line
        x1="10"
        y1="35"
        x2="250"
        y2={35 + m * 30}
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <circle cx={130 + p.x * 10} cy={50 - p.y * 8} r="4" fill="#0891b2" />
      {show ? (
        <line
          x1={130 + p.x * 10}
          y1="5"
          x2={130 + p.x * 10}
          y2="85"
          stroke="#0ea5e9"
          strokeDasharray="5 3"
        />
      ) : null}
    </svg>
  );
}
function PerpendicularIcon() {
  return (
    <svg viewBox="0 0 60 60" className="h-14 w-14">
      <line x1="5" y1="42" x2="55" y2="42" stroke="white" strokeWidth="3" />
      <line x1="30" y1="5" x2="30" y2="55" stroke="white" strokeWidth="3" />
      <path d="M30 32h10v10" fill="none" stroke="#f0abfc" strokeWidth="3" />
    </svg>
  );
}
function fraction(value: number) {
  if (Math.abs(value - Math.round(value)) < 0.001)
    return String(Math.round(value));
  const sign = value < 0 ? "-" : "";
  const a = Math.abs(value);
  for (let d = 2; d <= 8; d++) {
    const n = Math.round(a * d);
    if (Math.abs(n / d - a) < 0.01) return `${sign}${n}/${d}`;
  }
  return value.toFixed(2);
}
function clamp(v: number) {
  return Math.max(-6, Math.min(6, Number(v.toFixed(1))));
}
function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
