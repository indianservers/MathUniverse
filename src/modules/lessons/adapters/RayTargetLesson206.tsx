import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Grid3X3,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type DragPoint = "a" | "b" | null;

const initialA: Point = { x: 0, y: 0 };
const initialB: Point = { x: 4, y: 2 };

export default function RayTargetLesson206({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [dragging, setDragging] = useState<DragPoint>(null);
  const [grid, setGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [stage, setStage] = useState(0);
  const [editing, setEditing] = useState<DragPoint>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [slopeAnswer, setSlopeAnswer] = useState("");
  const [angleAnswer, setAngleAnswer] = useState("");
  const [notationAnswer, setNotationAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const surfaceRef = useRef<HTMLElement>(null);

  const reset = () => {
    setA(initialA);
    setB(initialB);
    setGrid(true);
    setZoom(1);
    setStage(0);
    setEditing(null);
    setSlopeAnswer("");
    setAngleAnswer("");
    setNotationAnswer("");
    setAnswerStatus("idle");
    onInteraction();
  };

  useEffect(() => {
    setA(initialA);
    setB(initialB);
    setGrid(true);
    setZoom(1);
    setStage(0);
    setEditing(null);
    setSlopeAnswer("");
    setAngleAnswer("");
    setNotationAnswer("");
    setAnswerStatus("idle");
  }, [resetToken]);

  const measures = useMemo(() => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    return {
      dx,
      dy,
      length,
      angle,
      slope: dx === 0 ? null : dy / dx,
    };
  }, [a, b]);

  const updatePoint = (name: Exclude<DragPoint, null>, point: Point) => {
    const next = {
      x: Math.max(-6, Math.min(6, Number(point.x.toFixed(1)))),
      y: Math.max(-6, Math.min(6, Number(point.y.toFixed(1)))),
    };
    if (name === "a") setA(next);
    else setB(next);
    setAnswerStatus("idle");
    onInteraction();
  };

  const share = async () => {
    const text = `Ray AB: A(${a.x}, ${a.y}), B(${b.x}, ${b.y}), angle ${measures.angle.toFixed(2)} degrees`;
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Ray copied");
    } catch {
      setShareStatus(text);
    }
    onInteraction();
  };

  const checkAnswer = () => {
    const notation = notationAnswer.replace(/[^a-z]/gi, "").toUpperCase();
    const correct =
      Math.abs(Number(slopeAnswer) - 1) < 0.01 &&
      Math.abs(Number(angleAnswer) - 45) < 0.15 &&
      (notation === "PQ" || notation === "RAYPQ");
    setAnswerStatus(correct ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      ref={surfaceRef}
      className="space-y-3"
      data-testid="dynamic-geometry-mockup-0263"
      data-dedicated-lesson="206"
      data-object-model="ray"
      data-direct-interaction="true"
      data-a={`${a.x}:${a.y}`}
      data-b={`${b.x}:${b.y}`}
      data-grid={grid}
      data-zoom={zoom}
      data-stage={stage}
      data-slope={measures.slope ?? "undefined"}
      data-angle={measures.angle}
      aria-label="Ray dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-blue-600 text-4xl font-light text-white shadow-sm">
              ↗
            </span>
            <div>
              <h1 className="text-3xl font-black leading-none text-slate-950">
                Ray
              </h1>
              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                Construct a half-line that starts at one point and extends
                infinitely in one direction.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[8px] font-black text-slate-600">
                <span className="target-geometry-chip">
                  Dynamic Geometry Construction
                </span>
                <span className="target-geometry-chip">
                  Foundation / Advanced
                </span>
                <span className="target-geometry-chip">6-10 min</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="target-geometry-action"
            onClick={share}
          >
            <Share2 /> Share
          </button>
        </div>
        {shareStatus ? (
          <p
            role="status"
            className="mt-2 text-right text-[9px] font-bold text-emerald-700"
          >
            {shareStatus}
          </p>
        ) : null}
      </header>

      <nav
        className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        aria-label="Ray lesson stages"
      >
        {[
          ["Observe", "See how a ray works"],
          ["Manipulate", "Drag points"],
          ["Notice", "Identify the pattern"],
          ["Understand", "Learn the rule"],
          ["Try", "Solve a task"],
        ].map(([title, subtitle], index) => (
          <button
            type="button"
            key={title}
            onClick={() => {
              setStage(index);
              document
                .getElementById(
                  index === 4
                    ? "ray-practice"
                    : index >= 2
                      ? "ray-rule"
                      : "ray-model",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              onInteraction();
            }}
            className={`h-[52px] px-1 text-left text-[8px] font-bold ${stage === index ? "border-b-2 border-blue-500 bg-blue-50 text-blue-800" : "text-slate-600"}`}
          >
            <span className="mr-1 inline-grid h-5 w-5 place-items-center rounded-full border border-blue-300 text-[9px] font-black">
              {index + 1}
            </span>
            <strong className="text-[9px]">{title}</strong>
            <small className="ml-6 block text-[7px] font-semibold">
              {subtitle}
            </small>
          </button>
        ))}
      </nav>

      <section
        id="ray-model"
        className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-blue-950">
              1 Observe the Ray
            </h2>
            <p className="text-[10px] font-semibold text-slate-600">
              Drag the blue point A or the purple point B to explore.
            </p>
          </div>
          <button
            type="button"
            className="target-geometry-action"
            onClick={reset}
          >
            <RotateCcw /> Reset
          </button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_285px]">
          <RayPlane
            a={a}
            b={b}
            grid={grid}
            zoom={zoom}
            dragging={dragging}
            onDragging={setDragging}
            onPoint={updatePoint}
            onGrid={() => {
              setGrid((value) => !value);
              onInteraction();
            }}
            onZoom={(delta) => {
              setZoom((value) => Math.max(0.75, Math.min(1.5, value + delta)));
              onInteraction();
            }}
            onFullscreen={() => {
              void surfaceRef.current?.requestFullscreen?.();
              onInteraction();
            }}
          />
          <aside className="space-y-2">
            <Panel title="Objects">
              <PointRow
                name="A"
                role="Endpoint"
                color="#1685e5"
                point={a}
                editing={editing === "a"}
                onEdit={() => setEditing(editing === "a" ? null : "a")}
                onChange={(point) => updatePoint("a", point)}
              />
              <PointRow
                name="B"
                role="Direction point"
                color="#7c3aed"
                point={b}
                editing={editing === "b"}
                onEdit={() => setEditing(editing === "b" ? null : "b")}
                onChange={(point) => updatePoint("b", point)}
              />
            </Panel>
            <Panel title="Ray notation">
              <p className="py-2 text-center font-serif text-xl font-black">
                <span className="relative inline-block border-t border-slate-800 px-0.5">
                  AB
                  <span className="absolute -right-1.5 -top-[5px] text-[9px]">
                    ›
                  </span>
                </span>
              </p>
            </Panel>
            <Panel title="Measurements">
              <Measure
                label="Length AB"
                value={`${measures.length.toFixed(2)} units`}
              />
              <Measure
                label="Angle of ray"
                value={`${measures.angle.toFixed(2)}°`}
              />
              <Measure
                label="Slope"
                value={
                  measures.slope === null
                    ? "undefined"
                    : measures.slope.toFixed(2)
                }
              />
            </Panel>
            <Panel title="Ray view">
              <svg
                viewBox="0 0 220 70"
                className="w-full"
                role="img"
                aria-label="Small ray from A through B"
              >
                <line
                  x1="35"
                  y1="38"
                  x2="190"
                  y2="28"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                <path
                  d="M190 28l-10-5m10 5l-9 7"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2"
                />
                <circle cx="35" cy="38" r="4" fill="#1685e5" />
                <circle cx="125" cy="32" r="4" fill="#7c3aed" />
                <text x="28" y="22" fontSize="11" fontWeight="700">
                  A
                </text>
                <text x="120" y="18" fontSize="11" fontWeight="700">
                  B
                </text>
              </svg>
              <p className="text-center text-[9px] text-slate-600">
                Starts at A and continues infinitely through B.
              </p>
            </Panel>
          </aside>
        </div>
      </section>

      <div id="ray-rule" className="grid gap-3 md:grid-cols-2">
        <Panel title="What is a Ray?">
          <p>
            A ray is a part of a line that has one endpoint and extends
            infinitely in one direction.
          </p>
          <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3">
            <p className="font-serif text-base font-black">Ray AB</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Starts at A (included)</li>
              <li>Passes through B</li>
              <li>Continues infinitely beyond B</li>
            </ul>
          </div>
        </Panel>
        <Panel title="How it's constructed">
          <ol className="space-y-2">
            {[
              "Place point A (endpoint).",
              "Place point B (any other point).",
              "Draw the half-line starting at A and passing through B.",
              "Extend it beyond B to show one-way infinity.",
            ].map((text, index) => (
              <li key={text} className="flex gap-2">
                <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-600 text-[9px] text-white">
                  {index + 1}
                </b>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid items-center gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-black text-violet-700">Key rule</h2>
            <p className="mt-2 text-[10px]">
              A ray has a fixed starting point and a fixed direction. Changing
              point B changes its direction.
            </p>
          </div>
          <p className="border-l border-slate-200 pl-4 text-center font-serif text-base font-black">
            If A(x₁,y₁) and B(x₂,y₂), slope = (y₂-y₁)/(x₂-x₁)
          </p>
        </div>
      </section>

      <section
        id="ray-practice"
        className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-blue-950">
              5 Try it yourself
            </h2>
            <p className="text-[10px] text-slate-600">
              Construct ray PQ, then record its slope, angle, and notation.
            </p>
          </div>
          <button
            type="button"
            onClick={checkAnswer}
            className="rounded-md bg-violet-600 px-4 py-2 text-[10px] font-black text-white"
          >
            <CheckCircle2 className="mr-1 inline h-3 w-3" /> Check your answer
          </button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_260px]">
          <div className="grid items-center rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
            <div>
              <strong className="text-[9px] text-blue-700">Task</strong>
              <p className="mt-2 text-[10px] font-semibold">
                Construct ray PQ with P(-2,1) as endpoint and Q(2,5) as
                direction point.
              </p>
            </div>
            <svg
              viewBox="0 0 220 90"
              className="w-full"
              role="img"
              aria-label="Practice ray PQ"
            >
              <line
                x1="30"
                y1="76"
                x2="190"
                y2="14"
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <path
                d="M190 14l-11 1m11-1l-6 9"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <circle cx="55" cy="66" r="5" fill="#1685e5" />
              <circle cx="150" cy="29" r="5" fill="#7c3aed" />
              <text x="38" y="86" fontSize="10">
                P(-2,1)
              </text>
              <text x="145" y="20" fontSize="10">
                Q(2,5)
              </text>
            </svg>
          </div>
          <div className="space-y-2 text-[9px]">
            <PracticeInput
              label="Slope"
              value={slopeAnswer}
              onChange={setSlopeAnswer}
            />
            <PracticeInput
              label="Angle"
              value={angleAnswer}
              onChange={setAngleAnswer}
              suffix="°"
            />
            <PracticeInput
              label="Ray notation"
              value={notationAnswer}
              onChange={setNotationAnswer}
            />
            {answerStatus !== "idle" ? (
              <p
                role="status"
                className={`rounded-md p-2 font-black ${answerStatus === "correct" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
              >
                {answerStatus === "correct"
                  ? "Correct: slope 1, angle 45°, ray PQ."
                  : "Check Δy/Δx = 4/4 and name the endpoint first."}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <nav
        className="grid grid-cols-3 gap-2 text-[9px] font-bold"
        aria-label="Adjacent lessons"
      >
        <a
          href="/lessons/geometry/205-segment-with-given-length"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Segment with Given Length
          </span>
        </a>
        <a
          href="/lessons"
          className="grid place-items-center rounded-lg border border-slate-200 bg-white p-3"
        >
          Back to lesson list
        </a>
        <a
          href="/lessons/geometry/207-polyline"
          className="flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-3 text-right"
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>
            Polyline
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">
        Live Verification: dedicated interactive geometry model. Check
        Construction.
      </span>
    </section>
  );
}

function RayPlane({
  a,
  b,
  grid,
  zoom,
  dragging,
  onDragging,
  onPoint,
  onGrid,
  onZoom,
  onFullscreen,
}: {
  a: Point;
  b: Point;
  grid: boolean;
  zoom: number;
  dragging: DragPoint;
  onDragging: (value: DragPoint) => void;
  onPoint: (name: Exclude<DragPoint, null>, point: Point) => void;
  onGrid: () => void;
  onZoom: (delta: number) => void;
  onFullscreen: () => void;
}) {
  const width = 480,
    height = 490,
    cx = width / 2,
    cy = height / 2,
    unit = 32 * zoom;
  const sx = (x: number) => cx + x * unit,
    sy = (y: number) => cy - y * unit;
  const dx = b.x - a.x,
    dy = b.y - a.y,
    length = Math.hypot(dx, dy) || 1;
  const end = {
    x: sx(a.x) + (dx / length) * 360,
    y: sy(a.y) - (dy / length) * 360,
  };
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: (((event.clientX - rect.left) / rect.width) * width - cx) / unit,
      y: (cy - ((event.clientY - rect.top) / rect.height) * height) / unit,
    };
    onPoint(dragging, point);
  };
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onGrid}
        className={`absolute left-3 top-3 z-10 flex items-center gap-1 rounded-md border px-2 py-2 text-[9px] font-black ${grid ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white"}`}
      >
        <Grid3X3 className="h-3 w-3" /> {grid ? "Hide grid" : "Show grid"}
      </button>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full touch-none"
        onPointerMove={pointer}
        onPointerUp={() => onDragging(null)}
        onPointerLeave={() => onDragging(null)}
        role="img"
        aria-label="Ray AB coordinate plane with draggable endpoint and direction point"
      >
        {grid
          ? Array.from({ length: 15 }, (_, index) => index - 7).map((value) => (
              <g key={value}>
                <line
                  x1={sx(value)}
                  y1="0"
                  x2={sx(value)}
                  y2={height}
                  stroke="#dbeafe"
                  strokeDasharray="3 3"
                />
                <line
                  x1="0"
                  y1={sy(value)}
                  x2={width}
                  y2={sy(value)}
                  stroke="#dbeafe"
                  strokeDasharray="3 3"
                />
              </g>
            ))
          : null}
        <line x1="0" y1={cy} x2={width} y2={cy} stroke="#64748b" />
        <line x1={cx} y1="0" x2={cx} y2={height} stroke="#64748b" />
        {[-6, -4, -2, 2, 4, 6].map((value) => (
          <g key={`tick-${value}`}>
            <line
              x1={sx(value)}
              y1={cy - 3}
              x2={sx(value)}
              y2={cy + 3}
              stroke="#475569"
            />
            <text
              x={sx(value)}
              y={cy + 16}
              textAnchor="middle"
              fontSize="9"
              fill="#334155"
            >
              {value}
            </text>
            <line
              x1={cx - 3}
              y1={sy(value)}
              x2={cx + 3}
              y2={sy(value)}
              stroke="#475569"
            />
            <text
              x={cx - 8}
              y={sy(value) + 3}
              textAnchor="end"
              fontSize="9"
              fill="#334155"
            >
              {value}
            </text>
          </g>
        ))}
        <text x={width - 12} y={cy - 8} fontSize="11" fontWeight="800">
          x
        </text>
        <text x={cx + 8} y="14" fontSize="11" fontWeight="800">
          y
        </text>
        <line
          x1={sx(a.x)}
          y1={sy(a.y)}
          x2={sx(b.x)}
          y2={sy(b.y)}
          stroke="#7c3aed"
          strokeWidth="3"
        />
        <path
          d={`M${end.x},${end.y} l${(-12 * dx) / length + (7 * dy) / length},${(12 * dy) / length + (7 * dx) / length} M${end.x},${end.y} l${(-12 * dx) / length - (7 * dy) / length},${(12 * dy) / length - (7 * dx) / length}`}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
        />
        <line
          x1={sx(b.x)}
          y1={sy(b.y)}
          x2={end.x}
          y2={end.y}
          stroke="#7c3aed"
          strokeDasharray="6 5"
        />
        <circle
          data-testid="ray-point-a"
          cx={sx(a.x)}
          cy={sy(a.y)}
          r="7"
          fill="#1685e5"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            onDragging("a");
          }}
          className="cursor-grab"
        />
        <circle
          data-testid="ray-point-b"
          cx={sx(b.x)}
          cy={sy(b.y)}
          r="7"
          fill="#7c3aed"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            onDragging("b");
          }}
          className="cursor-grab"
        />
        <text
          x={sx(a.x) + 10}
          y={sy(a.y) + 22}
          fill="#0369a1"
          fontSize="12"
          fontWeight="800"
        >
          A ({a.x}, {a.y})
        </text>
        <text
          x={sx(b.x) - 25}
          y={sy(b.y) - 14}
          fill="#6d28d9"
          fontSize="12"
          fontWeight="800"
        >
          B ({b.x}, {b.y})
        </text>
      </svg>
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <IconButton label="Zoom in" onClick={() => onZoom(0.1)}>
          <Plus />
        </IconButton>
        <IconButton label="Zoom out" onClick={() => onZoom(-0.1)}>
          <Minus />
        </IconButton>
        <IconButton label="Fullscreen" onClick={onFullscreen}>
          <Maximize2 />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white shadow-sm [&_svg]:h-4 [&_svg]:w-4"
    >
      {children}
    </button>
  );
}
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 text-[9px]">
      <h3 className="font-black text-blue-950">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
function Measure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5 last:border-0">
      <span>{label}</span>
      <strong className="font-serif text-[11px]">{value}</strong>
    </div>
  );
}
function PointRow({
  name,
  role,
  color,
  point,
  editing,
  onEdit,
  onChange,
}: {
  name: string;
  role: string;
  color: string;
  point: Point;
  editing: boolean;
  onEdit: () => void;
  onChange: (point: Point) => void;
}) {
  return (
    <div className="border-b border-slate-100 py-2 last:border-0">
      <div className="grid grid-cols-[auto_20px_1fr_auto_auto] items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        <b>{name}</b>
        <span>{role}</span>
        <strong>
          ({point.x}, {point.y})
        </strong>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit point ${name}`}
        >
          <Edit3 className="h-3 w-3" />
        </button>
      </div>
      {editing ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label>
            x
            <input
              aria-label={`${name} x coordinate`}
              type="number"
              min="-6"
              max="6"
              step="0.5"
              value={point.x}
              onChange={(event) =>
                onChange({ ...point, x: Number(event.target.value) })
              }
              className="ml-1 w-14 rounded border p-1"
            />
          </label>
          <label>
            y
            <input
              aria-label={`${name} y coordinate`}
              type="number"
              min="-6"
              max="6"
              step="0.5"
              value={point.y}
              onChange={(event) =>
                onChange({ ...point, y: Number(event.target.value) })
              }
              className="ml-1 w-14 rounded border p-1"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
function PracticeInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="grid grid-cols-[80px_1fr_auto] items-center gap-2">
      <span className="font-bold">{label}</span>
      <input
        aria-label={`Ray practice ${label.toLowerCase()}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-md border border-slate-200 px-2 py-1.5"
      />
      {suffix ? <span>{suffix}</span> : null}
    </label>
  );
}
