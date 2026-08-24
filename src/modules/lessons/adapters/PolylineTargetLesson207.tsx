import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  List,
  Maximize2,
  Minus,
  MousePointer2,
  Play,
  Plus,
  RotateCcw,
  Share2,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Tool = "select" | "point";

const initialPoints: Point[] = [
  { x: -4, y: 1 },
  { x: -1, y: 4 },
  { x: 2, y: 2 },
  { x: 5, y: -1 },
  { x: 1, y: -3 },
];
const workedPoints: Point[] = [
  { x: -4, y: 1 },
  { x: -2, y: 4 },
  { x: 2, y: 2 },
  { x: 5, y: -1 },
];
const practicePoints: Point[] = [
  { x: -6, y: -2 },
  { x: -2, y: 3 },
  { x: 3, y: 2 },
  { x: 6, y: -3 },
  { x: -1, y: -4 },
];

export default function PolylineTargetLesson207({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [closed, setClosed] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [dragging, setDragging] = useState<number | null>(null);
  const [history, setHistory] = useState<Point[][]>([]);
  const [zoom, setZoom] = useState(1);
  const [tolerance, setTolerance] = useState(0.25);
  const [stage, setStage] = useState(1);
  const [language, setLanguage] = useState("English (English)");
  const [practiceActive, setPracticeActive] = useState(false);
  const [practiceStatus, setPracticeStatus] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [shareStatus, setShareStatus] = useState("");
  const surfaceRef = useRef<HTMLElement>(null);

  const reset = () => {
    setPoints(initialPoints);
    setClosed(false);
    setTool("select");
    setDragging(null);
    setHistory([]);
    setZoom(1);
    setTolerance(0.25);
    setPracticeActive(false);
    setPracticeStatus("idle");
    onInteraction();
  };
  useEffect(() => {
    setPoints(initialPoints);
    setClosed(false);
    setTool("select");
    setDragging(null);
    setHistory([]);
    setZoom(1);
    setTolerance(0.25);
    setPracticeActive(false);
    setPracticeStatus("idle");
  }, [resetToken]);

  const lengths = useMemo(
    () => segmentLengths(points, closed),
    [points, closed],
  );
  const total = lengths.reduce((sum, value) => sum + value, 0);
  const remember = () =>
    setHistory((current) => [
      ...current.slice(-19),
      points.map((point) => ({ ...point })),
    ]);
  const replacePoints = (next: Point[]) => {
    remember();
    setPoints(next);
    setPracticeStatus("idle");
    onInteraction();
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setPoints(previous);
    setHistory((current) => current.slice(0, -1));
    setPracticeStatus("idle");
    onInteraction();
  };
  const share = async () => {
    const description = `Polyline: ${points.map((point, index) => `${letter(index)}(${point.x},${point.y})`).join(" -> ")}; total ${total.toFixed(2)} units`;
    try {
      await navigator.clipboard.writeText(description);
      setShareStatus("Polyline copied");
    } catch {
      setShareStatus(description);
    }
    onInteraction();
  };
  const startPractice = () => {
    remember();
    setPoints(practicePoints.map((point) => ({ ...point })));
    setClosed(false);
    setPracticeActive(true);
    setPracticeStatus("idle");
    document
      .getElementById("polyline-plane")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    onInteraction();
  };
  const checkPractice = () => {
    const correct =
      points.length === practicePoints.length &&
      points.every(
        (point, index) => distance(point, practicePoints[index]) <= tolerance,
      );
    setPracticeStatus(correct ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      ref={surfaceRef}
      className="space-y-3"
      data-testid="dynamic-geometry-mockup-0264"
      data-dedicated-lesson="207"
      data-object-model="polyline"
      data-direct-interaction="true"
      aria-label="Polyline dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-lg border border-slate-200 bg-white text-cyan-600">
              <PolylineIcon />
            </span>
            <div>
              <h1 className="text-3xl font-black leading-none">Polyline</h1>
              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                Create connected segments.
              </p>
            </div>
          </div>
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              onInteraction();
            }}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold"
          >
            <option>English (English)</option>
            <option>Hindi (हिन्दी)</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 text-[8px] font-black">
            <span className="rounded-md bg-blue-50 px-3 py-2 text-blue-700">
              Coordinate Geometry
            </span>
            <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">
              Beginner
            </span>
            <span className="target-geometry-chip">6-10 min</span>
            <span className="target-geometry-chip">Visual · Interactive</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="target-geometry-action"
              onClick={reset}
            >
              <RotateCcw /> Reset
            </button>
            <button
              type="button"
              className="target-geometry-action"
              onClick={share}
            >
              <Share2 /> Share
            </button>
          </div>
        </div>
        {shareStatus ? (
          <p
            role="status"
            className="mt-1 text-right text-[8px] font-bold text-emerald-700"
          >
            {shareStatus}
          </p>
        ) : null}
      </header>

      <nav
        className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        aria-label="Polyline lesson stages"
      >
        {[
          ["Observe", "See the path"],
          ["Manipulate", "Build and drag"],
          ["Pattern", "Notice lengths"],
          ["Rule", "Sum segments"],
          ["Practice", "Build a path"],
        ].map(([title, subtitle], index) => (
          <button
            type="button"
            key={title}
            onClick={() => {
              setStage(index);
              document
                .getElementById(
                  index === 4
                    ? "polyline-practice"
                    : index >= 2
                      ? "polyline-insight"
                      : "polyline-plane",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              onInteraction();
            }}
            className={`h-[45px] text-[8px] font-bold ${stage === index ? "border-b-2 border-blue-600 text-blue-700" : "text-slate-700"}`}
          >
            <strong className="text-[9px]">{title}</strong>
            <small className="block text-[7px]">{subtitle}</small>
          </button>
        ))}
      </nav>

      <section className="rounded-lg border border-slate-200 bg-white p-4 pb-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black">Build your polyline</h2>
            <p className="mt-1 text-[10px] text-slate-600">
              Click the plane to add points. Drag points to move. Use controls
              to shape and explore.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="grid grid-cols-2 rounded-md border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => {
                  setClosed(false);
                  onInteraction();
                }}
                className={`rounded px-4 py-1 text-[9px] font-black ${!closed ? "bg-blue-600 text-white" : ""}`}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => {
                  setClosed(true);
                  onInteraction();
                }}
                className={`rounded px-4 py-1 text-[9px] font-black ${closed ? "bg-blue-600 text-white" : ""}`}
              >
                Closed
              </button>
            </div>
            <button
              type="button"
              disabled={!history.length}
              onClick={undo}
              className="target-geometry-action disabled:opacity-40"
            >
              <Undo2 /> Undo last action
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-2">
            <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-1">
              <ToolButton
                active={tool === "select"}
                label="Select"
                onClick={() => {
                  setTool("select");
                  onInteraction();
                }}
              >
                <MousePointer2 />
              </ToolButton>
              <ToolButton
                active={tool === "point"}
                label="Point"
                onClick={() => {
                  setTool("point");
                  onInteraction();
                }}
              >
                <Circle />
              </ToolButton>
              <ToolButton label="Clear" onClick={() => replacePoints([])}>
                <Trash2 />
              </ToolButton>
            </div>
            <PolylinePlane
              id="polyline-plane"
              points={points}
              closed={closed}
              zoom={zoom}
              tool={tool}
              dragging={dragging}
              onDragging={setDragging}
              onRemember={remember}
              onPoints={(next) => {
                setPoints(next);
                setPracticeStatus("idle");
                onInteraction();
              }}
              onZoom={(delta) => {
                setZoom((value) =>
                  Math.max(0.75, Math.min(1.5, value + delta)),
                );
                onInteraction();
              }}
              onFullscreen={() => {
                void surfaceRef.current?.requestFullscreen?.();
                onInteraction();
              }}
            />
          </div>
          <aside className="space-y-2">
            <Panel title="Polyline summary">
              <Measure label="Vertices (n)" value={String(points.length)} />
              <Measure
                label={`Segments (${closed ? "n" : "n - 1"})`}
                value={String(lengths.length)}
              />
              <Measure
                label="Total length"
                value={`${total.toFixed(2)} units`}
                accent
              />
            </Panel>
            <Panel title="Segment lengths">
              <div className="space-y-2">
                {lengths.map((value, index) => (
                  <p key={index} className="flex justify-between">
                    <span>
                      {letter(index)}
                      {letter((index + 1) % points.length)}
                    </span>
                    <strong>{value.toFixed(2)}</strong>
                  </p>
                ))}
              </div>
            </Panel>
            <Panel title="Close to verify">
              <p>
                Move the first point near the last point within the threshold.
              </p>
              <label className="mt-2 grid grid-cols-[1fr_70px_auto] items-center gap-2 font-bold">
                <span>Tolerance</span>
                <input
                  aria-label="Closure tolerance"
                  type="number"
                  min="0.05"
                  max="2"
                  step="0.05"
                  value={tolerance}
                  onChange={(event) => {
                    setTolerance(Number(event.target.value));
                    onInteraction();
                  }}
                  className="rounded border border-slate-200 px-2 py-1"
                />
                <span>units</span>
              </label>
              {points.length > 2 &&
              distance(points[0], points.at(-1)!) <= tolerance ? (
                <p role="status" className="mt-2 font-black text-emerald-700">
                  Endpoints meet the closure tolerance.
                </p>
              ) : null}
            </Panel>
          </aside>
        </div>
        <p className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-[9px] text-blue-700">
          Tip: Add more points to create longer polylines.
        </p>
      </section>

      <div id="polyline-insight" className="!mt-7 grid gap-3 md:grid-cols-3">
        <Panel title="Worked example">
          <p>Construct and measure this polyline.</p>
          <MiniPolyline points={workedPoints} />
          <ol className="mt-2 space-y-1">
            {[
              "Click points in order A → B → C → D.",
              "Measure each segment length.",
              "Add more points or try a closed polyline.",
            ].map((text, index) => (
              <li key={text}>
                <b className="mr-2 text-blue-600">{index + 1}</b>
                {text}
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="mt-3 w-full rounded-md border border-slate-200 py-2 font-black text-blue-700"
            onClick={() => {
              replacePoints(workedPoints);
              setClosed(false);
            }}
          >
            <Play className="mr-1 inline h-3 w-3" /> Load example
          </button>
        </Panel>
        <Panel title="What do you notice?">
          {[
            "The polyline is made of straight segments.",
            "The total length is the sum of all segment lengths.",
            "Reordering points changes the shape and length.",
            "If the last point meets the first, the polyline is closed.",
          ].map((text) => (
            <p key={text} className="mb-3 flex gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              {text}
            </p>
          ))}
        </Panel>
        <Panel title="Insight">
          <div className="rounded-md bg-violet-50 p-3">
            <strong className="text-violet-700">
              A polyline is a connected path of line segments in order.
            </strong>
            <p className="mt-3">If the vertices are P₁, P₂, ..., Pₙ, then:</p>
            <p className="mt-3 rounded-md border border-violet-200 bg-white p-3 text-center font-serif text-base font-black">
              L = Σ |PᵢPᵢ₊₁|
            </p>
            <p className="mt-3">
              Each term is the Euclidean distance between consecutive points.
            </p>
          </div>
        </Panel>
      </div>

      <section
        id="polyline-practice"
        className="min-h-[211px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_180px]">
          <div>
            <h2 className="text-sm font-black">Try it yourself</h2>
            <p className="mt-1 text-[9px]">
              Build the polyline and measure its total length.
            </p>
            <p className="mt-3 text-[8px] font-black">
              Target points (in order)
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {practicePoints.map((point, index) => (
                <span
                  key={index}
                  className="rounded border border-slate-200 px-2 py-1 text-[9px]"
                >
                  {letter(index)}({point.x}, {point.y})
                </span>
              ))}
            </div>
            <p className="mt-3 text-[9px]">
              <b>Goal:</b> Construct A → B → C → D → E.
            </p>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <h3 className="font-black">Your solution</h3>
            <p className="mt-2 text-[9px]">
              Add points and connect in the given order.
            </p>
            <button
              type="button"
              onClick={startPractice}
              className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-[9px] font-black text-white"
            >
              {practiceActive
                ? "Reload target construction"
                : "Start constructing"}
            </button>
            <button
              type="button"
              onClick={checkPractice}
              className="mt-2 block rounded-md border border-blue-200 px-4 py-2 text-[9px] font-black text-blue-700"
            >
              <Check className="mr-1 inline h-3 w-3" /> Check answer
            </button>
            {practiceStatus !== "idle" ? (
              <p
                role="status"
                className={`mt-2 rounded p-2 text-[9px] font-black ${practiceStatus === "correct" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
              >
                {practiceStatus === "correct"
                  ? "Correct construction and order."
                  : "Match every target point in A-to-E order."}
              </p>
            ) : null}
          </div>
          <div className="rounded-md border border-slate-200 p-3 text-center">
            <h3 className="text-[9px] font-black">Target total length</h3>
            <strong className="mt-3 block text-xl text-violet-700">
              {segmentLengths(practicePoints, false)
                .reduce((sum, value) => sum + value, 0)
                .toFixed(2)}{" "}
              units
            </strong>
            <hr className="my-4" />
            <p className="text-[9px] font-black">Your total length</p>
            <strong className="mt-2 block text-sm">
              {practiceActive ? `${total.toFixed(2)} units` : "—"}
            </strong>
          </div>
        </div>
      </section>

      <nav className="grid grid-cols-3 gap-2 text-[9px] font-bold">
        <a
          href="/lessons/geometry/206-ray"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Ray
          </span>
        </a>
        <a
          href="/lessons"
          className="grid place-items-center rounded-lg border border-slate-200 bg-white p-3"
        >
          <List className="mr-1 inline h-3 w-3" /> Back to lesson list
        </a>
        <a
          href="/lessons/geometry/208-perpendicular-line"
          className="flex items-center justify-end gap-2 rounded-lg bg-violet-600 p-3 text-right text-white"
        >
          <span>
            <small className="block uppercase">Next</small>Perpendicular Line
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">Live Verification. Check Construction.</span>
    </section>
  );
}

function PolylinePlane({
  id,
  points,
  closed,
  zoom,
  tool,
  dragging,
  onDragging,
  onRemember,
  onPoints,
  onZoom,
  onFullscreen,
}: {
  id: string;
  points: Point[];
  closed: boolean;
  zoom: number;
  tool: Tool;
  dragging: number | null;
  onDragging: (index: number | null) => void;
  onRemember: () => void;
  onPoints: (points: Point[]) => void;
  onZoom: (delta: number) => void;
  onFullscreen: () => void;
}) {
  const width = 470,
    height = 440,
    cx = width / 2,
    cy = height / 2,
    unit = 29 * zoom;
  const sx = (x: number) => cx + x * unit,
    sy = (y: number) => cy - y * unit;
  const fromEvent = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp(
        (((event.clientX - rect.left) / rect.width) * width - cx) / unit,
      ),
      y: clamp(
        (cy - ((event.clientY - rect.top) / rect.height) * height) / unit,
      ),
    };
  };
  const pointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (tool !== "point" || points.length >= 8) return;
    onRemember();
    onPoints([...points, fromEvent(event)]);
  };
  const pointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const next = points.map((point, index) =>
      index === dragging ? fromEvent(event) : point,
    );
    onPoints(next);
  };
  const pathPoints = points
    .map((point) => `${sx(point.x)},${sy(point.y)}`)
    .join(" ");
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-lg border border-slate-200"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full touch-none bg-white"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={() => onDragging(null)}
        onPointerLeave={() => onDragging(null)}
        role="img"
        aria-label="Interactive polyline coordinate plane with draggable ordered vertices"
      >
        {Array.from({ length: 15 }, (_, index) => index - 7).map((value) => (
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
        ))}
        <line x1="0" y1={cy} x2={width} y2={cy} stroke="#64748b" />
        <line x1={cx} y1="0" x2={cx} y2={height} stroke="#64748b" />
        {points.length > 1 ? (
          closed ? (
            <polygon
              points={pathPoints}
              fill="#0ea5e90d"
              stroke="#0ea5e9"
              strokeWidth="2.5"
            />
          ) : (
            <polyline
              points={pathPoints}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
            />
          )
        ) : null}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              data-testid={`polyline-point-${index}`}
              cx={sx(point.x)}
              cy={sy(point.y)}
              r="6"
              fill="#2563eb"
              className="cursor-grab"
              onPointerDown={(event) => {
                if (tool !== "select") return;
                event.stopPropagation();
                event.currentTarget.setPointerCapture(event.pointerId);
                onRemember();
                onDragging(index);
              }}
            />
            <text
              x={sx(point.x) + 7}
              y={sy(point.y) - 8}
              fill="#1d4ed8"
              fontSize="10"
              fontWeight="800"
            >
              {letter(index)}({point.x}, {point.y})
            </text>
          </g>
        ))}
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

function ToolButton({
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
      className={`grid w-full place-items-center gap-1 rounded-md px-1 py-2 text-[8px] font-bold [&_svg]:h-4 [&_svg]:w-4 ${active ? "border border-blue-400 bg-blue-50 text-blue-700" : "text-slate-600"}`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
function IconButton({
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
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white shadow-sm [&_svg]:h-4 [&_svg]:w-4"
    >
      {children}
    </button>
  );
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 text-[9px] shadow-sm">
      <h3 className="font-black text-blue-950">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
function Measure({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <p className="flex justify-between border-b border-slate-100 py-2 last:border-0">
      <span>{label}</span>
      <strong className={accent ? "text-sm text-blue-700" : ""}>{value}</strong>
    </p>
  );
}
function MiniPolyline({ points }: { points: Point[] }) {
  const minX = Math.min(...points.map((point) => point.x)),
    maxX = Math.max(...points.map((point) => point.x)),
    minY = Math.min(...points.map((point) => point.y)),
    maxY = Math.max(...points.map((point) => point.y));
  const xy = points
    .map(
      (point) =>
        `${20 + ((point.x - minX) / (maxX - minX || 1)) * 180},${75 - ((point.y - minY) / (maxY - minY || 1)) * 55}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 220 90" className="mt-2 w-full">
      <polyline points={xy} fill="none" stroke="#7c3aed" strokeWidth="2" />
      {xy.split(" ").map((pair, index) => {
        const [x, y] = pair.split(",").map(Number);
        return <circle key={index} cx={x} cy={y} r="4" fill="#7c3aed" />;
      })}
    </svg>
  );
}
function PolylineIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9">
      <polyline
        points="7,31 19,18 31,25 40,11"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      {[
        [7, 31],
        [19, 18],
        [31, 25],
        [40, 11],
      ].map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="3"
          fill="white"
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
function segmentLengths(points: Point[], closed: boolean) {
  const pairs = points
    .slice(0, -1)
    .map((point, index) => [point, points[index + 1]] as const);
  if (closed && points.length > 2) pairs.push([points.at(-1)!, points[0]]);
  return pairs.map(([a, b]) => distance(a, b));
}
function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function clamp(value: number) {
  return Math.max(-6, Math.min(6, Number(value.toFixed(1))));
}
function letter(index: number) {
  return String.fromCharCode(65 + index);
}
