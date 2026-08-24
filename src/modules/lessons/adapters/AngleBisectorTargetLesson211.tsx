import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  Hand,
  Languages,
  Lightbulb,
  Maximize2,
  MousePointer2,
  NotebookTabs,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type DragPoint = "a" | "b" | "c" | null;
type Tool = "select" | "pan" | "compass";

const initialPoints = {
  a: { x: 105, y: 205 },
  b: { x: 480, y: 45 },
  c: { x: 435, y: 335 },
};

export default function AngleBisectorTargetLesson211({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(initialPoints);
  const [showArcs, setShowArcs] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [dragging, setDragging] = useState<DragPoint>(null);
  const [panOrigin, setPanOrigin] = useState<Point | null>(null);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [language, setLanguage] = useState("English (English)");
  const [shareStatus, setShareStatus] = useState("");
  const [practiceAngle, setPracticeAngle] = useState(78);
  const [practiceCount, setPracticeCount] = useState(0);
  const surfaceRef = useRef<HTMLElement>(null);
  const model = useMemo(
    () => deriveAngle(points.a, points.b, points.c),
    [points],
  );

  const reset = () => {
    setPoints(initialPoints);
    setShowArcs(true);
    setShowSteps(false);
    setTool("select");
    setPan({ x: 0, y: 0 });
    setPracticeAngle(78);
    setPracticeCount(0);
    setShareStatus("");
    onInteraction();
  };
  useEffect(() => {
    setPoints(initialPoints);
    setShowArcs(true);
    setShowSteps(false);
    setTool("select");
    setPan({ x: 0, y: 0 });
    setPracticeAngle(78);
    setPracticeCount(0);
  }, [resetToken]);

  const share = async () => {
    const text = `Angle BAC = ${model.full.toFixed(1)} degrees; bisector angles BAL = LAC = ${model.half.toFixed(1)} degrees.`;
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Angle measurements copied");
    } catch {
      setShareStatus(text);
    }
    onInteraction();
  };

  const pointFromPointer = (event: ReactPointerEvent<SVGSVGElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 600 - pan.x,
      y: ((event.clientY - rect.top) / rect.height) * 400 - pan.y,
    };
  };
  const movePoint = (key: Exclude<DragPoint, null>, point: Point) => {
    const next = {
      x: clamp(point.x, 35, 565),
      y: clamp(point.y, 30, 370),
    };
    setPoints((current) => ({ ...current, [key]: next }));
    onInteraction();
  };
  const pointerDown = (
    event: ReactPointerEvent<SVGSVGElement>,
    point?: Exclude<DragPoint, null>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === "pan") {
      setPanOrigin({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    } else if (tool === "select" && point) {
      setDragging(point);
    }
  };
  const pointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool === "pan" && panOrigin) {
      setPan({
        x: clamp(event.clientX - panOrigin.x, -45, 45),
        y: clamp(event.clientY - panOrigin.y, -35, 35),
      });
      onInteraction();
    } else if (dragging) {
      movePoint(dragging, pointFromPointer(event));
    }
  };
  const pointerUp = () => {
    setDragging(null);
    setPanOrigin(null);
  };
  const fullscreen = () => {
    void surfaceRef.current?.requestFullscreen?.();
    onInteraction();
  };
  const nextPractice = () => {
    const angles = [46, 64, 92, 118, 136];
    const nextCount = practiceCount + 1;
    setPracticeCount(nextCount);
    setPracticeAngle(angles[nextCount % angles.length]);
    onInteraction();
  };

  return (
    <section
      ref={surfaceRef}
      className="space-y-3"
      data-testid="dynamic-geometry-mockup-0268"
      data-dedicated-lesson="211"
      data-object-model="angle-bisector"
      data-direct-interaction="true"
      aria-label="Angle bisector dedicated interactive geometry model"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_172px]">
          <div>
            <div className="flex flex-wrap gap-2 text-[8px] font-black uppercase text-slate-600">
              <span className="rounded-full bg-cyan-50 px-2 py-1 text-cyan-700">
                Geometry
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1">
                Dynamic Geometry Constructions
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Angle Bisector
            </h1>
            <p className="mt-1 text-[11px] text-slate-600">
              Construct a line that divides an angle into two equal angles.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[8px] font-black">
              <select
                aria-label="Lesson standard"
                className="target-geometry-chip"
                defaultValue="Geometry"
                onChange={onInteraction}
              >
                <option>Geometry</option>
                <option>Foundational-Advanced</option>
              </select>
              <span className="target-geometry-chip">Construction Studio</span>
              <span className="target-geometry-chip">Geometry Tools</span>
              <span className="target-geometry-chip">6-10 min</span>
            </div>
          </div>
          <div className="grid content-start grid-cols-2 gap-2">
            <label className="col-span-2 flex items-center gap-2 rounded-md border px-3 py-2 text-[9px] font-bold">
              <Languages className="h-3.5 w-3.5 text-cyan-600" />
              <select
                aria-label="Lesson language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  onInteraction();
                }}
                className="w-full min-w-0 flex-1 bg-transparent text-[9px]"
              >
                <option>English (English)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
            </label>
            <button
              className="target-geometry-action justify-center"
              type="button"
              onClick={reset}
            >
              <RotateCcw /> Reset
            </button>
            <button
              className="target-geometry-action justify-center"
              type="button"
              onClick={share}
            >
              <Share2 /> Share
            </button>
            <button
              className="target-geometry-action col-span-2 justify-center"
              type="button"
              onClick={fullscreen}
            >
              <Maximize2 /> Workspace
            </button>
            {shareStatus ? (
              <span
                role="status"
                className="col-span-2 text-center text-[8px] font-bold text-emerald-700"
              >
                {shareStatus}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <nav className="grid min-h-10 grid-cols-[repeat(5,1fr)_70px] rounded-lg border border-slate-200 bg-white p-1 text-[9px] font-black">
        {["Explore", "Construct", "Observe", "Rule", "Practice"].map(
          (label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                document
                  .getElementById(`angle-${label.toLowerCase()}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                onInteraction();
              }}
              className={`rounded-md px-2 py-2 ${index === 0 ? "bg-blue-600 text-white" : "text-slate-600"}`}
            >
              {label}
            </button>
          ),
        )}
        <button
          type="button"
          className="flex items-center justify-center gap-1 border-l text-slate-600"
          onClick={() =>
            document
              .getElementById("angle-rule")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <NotebookTabs className="h-3 w-3" /> Notes
        </button>
      </nav>

      <div className="grid gap-3 lg:grid-cols-[1.8fr_1fr]" id="angle-explore">
        <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-black">Explore the Angle Bisector</h2>
              <p className="mt-1 text-[9px] text-slate-600">
                Drag the blue points to change the angle.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[8px] font-bold">
              <span>Show arcs</span>
              <button
                type="button"
                role="switch"
                aria-label="Show arcs"
                aria-checked={showArcs}
                onClick={() => {
                  setShowArcs((value) => !value);
                  onInteraction();
                }}
                className={`relative h-5 w-9 rounded-full ${showArcs ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${showArcs ? "left-[18px]" : "left-0.5"}`}
                />
              </button>
              <button
                type="button"
                aria-label="Enter workspace fullscreen"
                className="target-geometry-tool"
                onClick={fullscreen}
              >
                <Maximize2 />
              </button>
            </div>
          </div>
          <div className="relative mt-2 overflow-hidden rounded-md border border-slate-100 bg-[linear-gradient(#eef2f7_1px,transparent_1px),linear-gradient(90deg,#eef2f7_1px,transparent_1px)] bg-[size:28px_28px]">
            <svg
              viewBox="0 0 600 400"
              className="block aspect-[3/2] w-full touch-none"
              role="img"
              aria-label="Interactive angle bisector construction with draggable points A B and C"
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
              onPointerDown={(event) => pointerDown(event)}
            >
              <g transform={`translate(${pan.x} ${pan.y})`}>
                <line
                  x1={points.a.x}
                  y1={points.a.y}
                  x2={extendRay(points.a, points.b, 440).x}
                  y2={extendRay(points.a, points.b, 440).y}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />
                <line
                  x1={points.a.x}
                  y1={points.a.y}
                  x2={extendRay(points.a, points.c, 440).x}
                  y2={extendRay(points.a, points.c, 440).y}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />
                <line
                  x1={points.a.x}
                  y1={points.a.y}
                  x2={model.bisectorEnd.x}
                  y2={model.bisectorEnd.y}
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeDasharray="11 8"
                />
                {showArcs ? (
                  <>
                    <path
                      d={arcPath(
                        points.a,
                        90,
                        model.startAngle,
                        model.midAngle,
                      )}
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="4"
                    />
                    <path
                      d={arcPath(points.a, 90, model.midAngle, model.endAngle)}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="4"
                    />
                    <text
                      x={model.upperLabel.x}
                      y={model.upperLabel.y}
                      fill="#7c3aed"
                      fontSize="17"
                      fontWeight="800"
                    >
                      {model.half.toFixed(1)}°
                    </text>
                    <text
                      x={model.lowerLabel.x}
                      y={model.lowerLabel.y}
                      fill="#06b6d4"
                      fontSize="17"
                      fontWeight="800"
                    >
                      {model.half.toFixed(1)}°
                    </text>
                  </>
                ) : null}
                {showSteps || tool === "compass" ? (
                  <ConstructionOverlay model={model} points={points} />
                ) : null}
                {(["a", "b", "c"] as const).map((key) => (
                  <g key={key}>
                    <circle
                      data-testid={`angle-point-${key}`}
                      cx={points[key].x}
                      cy={points[key].y}
                      r="10"
                      fill="transparent"
                      className={
                        tool === "select" ? "cursor-grab" : "cursor-default"
                      }
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        pointerDown(event, key);
                      }}
                    />
                    <circle
                      cx={points[key].x}
                      cy={points[key].y}
                      r="6"
                      fill="#2563eb"
                      pointerEvents="none"
                    />
                    <text
                      x={points[key].x - 27}
                      y={points[key].y + 6}
                      fill="#0369a1"
                      fontSize="18"
                      fontWeight="900"
                      pointerEvents="none"
                    >
                      {key.toUpperCase()}
                    </text>
                  </g>
                ))}
                <text
                  x={model.bisectorEnd.x + 8}
                  y={model.bisectorEnd.y - 4}
                  fill="#7c3aed"
                  fontSize="20"
                  fontStyle="italic"
                >
                  l
                </text>
              </g>
            </svg>
            <div className="absolute bottom-3 left-3 rounded-md border bg-white/95 p-2 text-[9px] shadow-sm">
              <strong>Drag points:</strong>
              <div className="mt-1 grid grid-cols-[16px_1fr] gap-x-1 gap-y-1">
                <b className="text-blue-600">A</b>
                <span>Vertex</span>
                <b className="text-blue-600">B</b>
                <span>First arm</span>
                <b className="text-blue-600">C</b>
                <span>Second arm</span>
                <b className="text-violet-600 italic">l</b>
                <span>Bisector</span>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex overflow-hidden rounded-md border bg-white shadow-sm">
              {(
                [
                  ["select", MousePointer2, "Select and drag points"],
                  ["pan", Hand, "Pan construction"],
                  ["compass", Compass, "Show compass construction"],
                ] as const
              ).map(([name, Icon, label]) => (
                <button
                  key={name}
                  type="button"
                  aria-label={label}
                  aria-pressed={tool === name}
                  className={`grid h-10 w-11 place-items-center border-r last:border-0 ${tool === name ? "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-500" : "text-slate-500"}`}
                  onClick={() => {
                    setTool(name);
                    onInteraction();
                  }}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </article>

        <aside className="grid gap-3">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-black">Measurements</h2>
            <div className="mt-4 space-y-4 text-[12px]">
              <Measurement
                color="#7c3aed"
                label="∠BAL"
                value={`${model.half.toFixed(1)}°`}
              />
              <Measurement
                color="#22b8dc"
                label="∠LAC"
                value={`${model.half.toFixed(1)}°`}
              />
              <div className="flex items-center justify-between border-t pt-3 font-black">
                <span>Difference</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  0.0° <Check className="h-4 w-4" />
                </span>
              </div>
            </div>
          </section>
          <section
            role="status"
            className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-[10px] font-bold text-slate-700"
          >
            <CheckCircle2 className="h-6 w-6 shrink-0 fill-emerald-600 text-white" />
            <span>
              The two angles are equal.
              <br />
              Line <i>l</i> is the angle bisector.
            </span>
          </section>
          <section
            id="angle-rule"
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-sm font-black">Definition</h2>
            <p className="mt-2 text-[9px] leading-4 text-slate-700">
              An angle bisector is a ray that divides an angle into two equal
              angles.
            </p>
            <div className="mt-3 rounded-md border border-violet-200 bg-violet-50 p-4 text-center font-serif text-sm italic">
              ∠BAL = ∠LAC = ½∠BAC
            </div>
          </section>
        </aside>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]" id="angle-construct">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black">Compass Construction</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-[1.1fr_1fr]">
            <ol className="space-y-3 text-[9px] leading-4">
              {[
                "With center A, draw an arc cutting AB and AC at points P and Q.",
                "With center P, draw an arc. With center Q, draw an arc of the same radius.",
                "Mark the intersection of the arcs at R.",
                "Draw ray AR. Ray AR is the angle bisector of ∠BAC.",
              ].map((step, index) => (
                <li key={step} className="flex gap-2">
                  <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-600 text-white">
                    {index + 1}
                  </b>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <ConstructionDiagram />
          </div>
          <button
            type="button"
            aria-pressed={showSteps}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-2 text-[9px] font-black text-blue-700"
            onClick={() => {
              setShowSteps((value) => !value);
              onInteraction();
            }}
          >
            <span className="text-sm">⊙</span>
            {showSteps ? "Hide steps on canvas" : "Show steps on canvas"}
          </button>
        </section>
        <section
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          id="angle-observe"
        >
          <h2 className="text-sm font-black">Why it Works</h2>
          <div className="mt-4 space-y-3 text-[9px] leading-5 text-slate-700">
            <p>
              Since <i>AP = AQ</i> and <i>RP = RQ</i> (construction),
            </p>
            <p>
              triangles <i>APR</i> and <i>AQR</i> are congruent by SSS.
            </p>
            <p>
              Therefore <i>∠PAR = ∠RAQ</i>.
            </p>
            <p>
              Ray <i>AR</i> bisects <i>∠BAC</i>.
            </p>
          </div>
          <div className="mt-4 rounded-md border border-violet-200 bg-violet-50 p-3">
            <h3 className="flex items-center gap-2 text-[10px] font-black text-violet-700">
              <Lightbulb className="h-4 w-4" /> Key Insight
            </h3>
            <p className="mt-2 text-[9px] leading-4">
              The angle bisector is the set of all points equidistant from the
              sides of the angle.
            </p>
          </div>
        </section>
      </div>

      <PracticePanel
        angle={practiceAngle}
        onNewAngle={nextPractice}
        onInteraction={onInteraction}
      />

      <nav className="grid min-h-14 grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-white text-[9px] font-black">
        <a
          href="/lessons/geometry/210-perpendicular-bisector"
          className="flex items-center gap-2 px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block text-slate-500">Previous</small>
            Perpendicular Bisector
          </span>
        </a>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border-x"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            onInteraction();
          }}
        >
          <span className="grid grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map((n) => (
              <i key={n} className="h-1.5 w-1.5 rounded-sm bg-slate-500" />
            ))}
          </span>
          Lesson Overview
        </button>
        <a
          href="/lessons/geometry/212-tangent"
          className="flex items-center justify-end gap-2 px-4 text-right"
        >
          <span>
            <small className="block text-slate-500">Next</small>Tangent
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">
        Full angle controls are derived from draggable rays; no fixed Ray length
        control is used. Live Verification. Check Construction.
      </span>
    </section>
  );
}

function Measurement({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-3">
        <i className="h-3 w-3 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <b className="text-base">{value}</b>
    </div>
  );
}

function ConstructionOverlay({
  model,
  points,
}: {
  model: AngleModel;
  points: typeof initialPoints;
}) {
  const p = pointAlong(points.a, points.b, 130),
    q = pointAlong(points.a, points.c, 130),
    r = pointAlong(points.a, model.bisectorEnd, 185);
  return (
    <g pointerEvents="none" opacity="0.8">
      <circle
        cx={points.a.x}
        cy={points.a.y}
        r="130"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
      <circle
        cx={p.x}
        cy={p.y}
        r="105"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
      <circle
        cx={q.x}
        cy={q.y}
        r="105"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
      {[p, q, r].map((point, index) => (
        <g key={index}>
          <circle cx={point.x} cy={point.y} r="4" fill="#0ea5e9" />
          <text x={point.x + 7} y={point.y - 7} fontSize="14" fontWeight="800">
            {["P", "Q", "R"][index]}
          </text>
        </g>
      ))}
    </g>
  );
}

function ConstructionDiagram() {
  return (
    <svg
      viewBox="0 0 260 170"
      className="w-full"
      role="img"
      aria-label="Compass construction diagram with points P Q and R"
    >
      <line x1="20" y1="85" x2="220" y2="20" stroke="#0f172a" strokeWidth="2" />
      <line
        x1="20"
        y1="85"
        x2="220"
        y2="150"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <line
        x1="20"
        y1="85"
        x2="245"
        y2="85"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeDasharray="7 5"
      />
      <path d="M105 57 A90 90 0 0 1 105 113" fill="none" stroke="#38bdf8" />
      <path d="M180 34 Q220 85 180 136" fill="none" stroke="#38bdf8" />
      {[
        [20, 85, "A"],
        [105, 57, "P"],
        [105, 113, "Q"],
        [205, 85, "R"],
        [185, 31, "B"],
        [185, 139, "C"],
      ].map(([x, y, label]) => (
        <g key={label as string}>
          <circle cx={x as number} cy={y as number} r="4" fill="#2563eb" />
          <text
            x={(x as number) + 7}
            y={(y as number) - 5}
            fontSize="12"
            fontWeight="800"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PracticePanel({
  angle,
  onNewAngle,
  onInteraction,
}: {
  angle: number;
  onNewAngle: () => void;
  onInteraction: () => void;
}) {
  const initial = useMemo(() => practicePoints(angle), [angle]);
  const [b, setB] = useState(initial.b);
  const [c, setC] = useState(initial.c);
  const [dragging, setDragging] = useState<"b" | "c" | null>(null);
  const a = { x: 35, y: 90 };
  useEffect(() => {
    setB(initial.b);
    setC(initial.c);
  }, [initial]);
  const model = useMemo(() => deriveAngle(a, b, c), [b, c]);
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 220, 20, 210),
      y: clamp(((event.clientY - rect.top) / rect.height) * 180, 10, 170),
    };
    dragging === "b" ? setB(point) : setC(point);
    onInteraction();
  };
  return (
    <section
      id="angle-practice"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-black">Try It Yourself</h2>
      <p className="mt-1 text-[9px] text-slate-600">
        Construct the angle bisector and report the angles.
      </p>
      <div className="mt-3 grid items-center gap-4 lg:grid-cols-[1fr_1.35fr_0.75fr]">
        <PracticeDiagram
          a={a}
          b={b}
          c={c}
          model={model}
          onPointerMove={move}
          onPointerUp={() => setDragging(null)}
          onPointDown={(event, point) => {
            event.currentTarget.ownerSVGElement?.setPointerCapture(
              event.pointerId,
            );
            setDragging(point);
          }}
        />
        <div>
          <ol className="space-y-2 text-[9px]">
            {[
              "Use the compass construction to draw the bisector.",
              "Drag the points to change the angle.",
              "Record the two angles.",
            ].map((text, index) => (
              <li key={text} className="flex items-center gap-2">
                <b className="grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-white">
                  {index + 1}
                </b>
                {text}
              </li>
            ))}
          </ol>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <PracticeValue label="∠BAL" value={model.half} color="violet" />
            <PracticeValue label="∠LAC" value={model.half} color="cyan" />
            <div className="rounded-md border p-2">
              <span className="text-[8px]">Difference</span>
              <b className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                0.0° <Check className="h-3 w-3" />
              </b>
            </div>
          </div>
        </div>
        <div className="grid place-items-center rounded-md border bg-slate-50 p-3 text-center">
          <CheckCircle2 className="h-12 w-12 fill-violet-600 text-white" />
          <b className="mt-1 text-[10px]">Nice work!</b>
          <span className="text-[8px]">You bisected the angle.</span>
          <button
            type="button"
            className="target-geometry-action mt-2 text-blue-700"
            onClick={onNewAngle}
          >
            <RotateCcw /> New Angle
          </button>
        </div>
      </div>
    </section>
  );
}

function PracticeValue({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "violet" | "cyan";
}) {
  return (
    <div
      className={`rounded-md border p-2 ${color === "violet" ? "border-violet-200 bg-violet-50" : "border-cyan-200 bg-cyan-50"}`}
    >
      <span className="text-[8px]">{label}</span>
      <b className="mt-2 block text-sm">{value.toFixed(1)}°</b>
    </div>
  );
}

function PracticeDiagram({
  a,
  b,
  c,
  model,
  onPointerMove,
  onPointerUp,
  onPointDown,
}: {
  a: Point;
  b: Point;
  c: Point;
  model: AngleModel;
  onPointerMove: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  onPointDown: (
    event: ReactPointerEvent<SVGCircleElement>,
    point: "b" | "c",
  ) => void;
}) {
  const l = polar(a, 82, model.midAngle);
  return (
    <svg
      viewBox="0 0 220 180"
      className="h-32 w-full touch-none"
      role="img"
      aria-label={`Practice angle ${model.full.toFixed(1)} degrees`}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <path
        d={`M${b.x} ${b.y} L${a.x} ${a.y} L${c.x} ${c.y}`}
        fill="none"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <line
        x1={a.x}
        y1={a.y}
        x2={l.x}
        y2={l.y}
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <path
        d={arcPath(a, 52, model.startAngle, model.endAngle)}
        fill="#8b5cf644"
        stroke="#7c3aed"
      />
      <circle cx={a.x} cy={a.y} r="4" fill="#2563eb" />
      <circle
        data-testid="practice-angle-point-b"
        cx={b.x}
        cy={b.y}
        r="7"
        fill="#2563eb"
        className="cursor-grab"
        onPointerDown={(event) => onPointDown(event, "b")}
      />
      <circle
        data-testid="practice-angle-point-c"
        cx={c.x}
        cy={c.y}
        r="7"
        fill="#2563eb"
        className="cursor-grab"
        onPointerDown={(event) => onPointDown(event, "c")}
      />
      <text x={a.x - 18} y={a.y + 5} fontSize="12" fontWeight="800">
        A
      </text>
      <text x={b.x - 2} y={b.y - 7} fontSize="12" fontWeight="800">
        B
      </text>
      <text x={c.x - 2} y={c.y + 15} fontSize="12" fontWeight="800">
        C
      </text>
      <text
        x={a.x + 65}
        y={a.y + 4}
        fill="#7c3aed"
        fontSize="12"
        fontWeight="800"
      >
        {model.full.toFixed(1)}°
      </text>
    </svg>
  );
}

function practicePoints(angle: number) {
  const a = { x: 35, y: 90 };
  return {
    b: polar(a, 105, -25),
    c: polar(a, 105, -25 + angle),
  };
}

type AngleModel = ReturnType<typeof deriveAngle>;
function deriveAngle(a: Point, b: Point, c: Point) {
  const startAngle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  let endAngle = (Math.atan2(c.y - a.y, c.x - a.x) * 180) / Math.PI;
  while (endAngle < startAngle) endAngle += 360;
  if (endAngle - startAngle > 180) endAngle -= 360;
  const full = Math.abs(endAngle - startAngle);
  const midAngle = startAngle + (endAngle - startAngle) / 2;
  const bisectorEnd = polar(a, 445, midAngle);
  const upperLabel = polar(a, 118, startAngle + (midAngle - startAngle) * 0.55);
  const lowerLabel = polar(a, 118, midAngle + (endAngle - midAngle) * 0.65);
  return {
    startAngle,
    endAngle,
    midAngle,
    full,
    half: full / 2,
    bisectorEnd,
    upperLabel,
    lowerLabel,
  };
}
function pointAlong(a: Point, b: Point, length: number) {
  return extendRay(a, b, length);
}
function extendRay(a: Point, b: Point, length: number) {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return {
    x: a.x + ((b.x - a.x) / d) * length,
    y: a.y + ((b.y - a.y) / d) * length,
  };
}
function polar(center: Point, radius: number, degrees: number): Point {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
}
function arcPath(center: Point, radius: number, start: number, end: number) {
  const a = polar(center, radius, start),
    b = polar(center, radius, end),
    delta = Math.abs(end - start);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${delta > 180 ? 1 : 0} ${end > start ? 1 : 0} ${b.x} ${b.y}`;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
