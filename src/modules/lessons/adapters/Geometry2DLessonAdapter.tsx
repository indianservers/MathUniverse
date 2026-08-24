import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Compass,
  Crosshair,
  Eye,
  Focus,
  Grid3X3,
  Hand,
  HelpCircle,
  Info,
  Lightbulb,
  Link2,
  Maximize2,
  MousePointer2,
  Move,
  PenTool,
  Pencil,
  Play,
  RotateCcw,
  Ruler,
  Share2,
  Star,
  Target,
  Trash2,
  Unlink,
  ZoomIn,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, {
  reusableEngineParamsFor,
  type ReusableLessonEngineParams,
} from "../components/ReusableLessonEngine";
import { geometry2DVisualPresetForLesson } from "../presets/geometry2DVisualPresets";
import type { LessonAdapterProps } from "../types";
import { remainingGeometryTargetForLesson } from "./GeometryTargetLessons206to235";
import ReflectionLineTargetLesson237 from "./ReflectionLineTargetLesson237";
import ReflectionPointTargetLesson238 from "./ReflectionPointTargetLesson238";
import ReflectionCircleTargetLesson239 from "./ReflectionCircleTargetLesson239";
import RotationPointTargetLesson240 from "./RotationPointTargetLesson240";
import DilationPointTargetLesson241 from "./DilationPointTargetLesson241";
import MatrixTransformationTargetLesson242 from "./MatrixTransformationTargetLesson242";
import CompositeTransformationsTargetLesson243 from "./CompositeTransformationsTargetLesson243";
import TransformationMappingTargetLesson244 from "./TransformationMappingTargetLesson244";
import InvariantsTargetLesson245 from "./InvariantsTargetLesson245";
import SymmetryExplorerTargetLesson246 from "./SymmetryExplorerTargetLesson246";
import LocusGeneratorTargetLesson247 from "./LocusGeneratorTargetLesson247";
import EquidistantLociTargetLesson248 from "./EquidistantLociTargetLesson248";
import MovingLinkageLociTargetLesson249 from "./MovingLinkageLociTargetLesson249";
import TranslationVectorTargetLesson236 from "./TranslationVectorTargetLesson236";

type GeometryTool =
  | "point"
  | "line"
  | "segment"
  | "ray"
  | "polyline"
  | "perpendicular"
  | "parallel"
  | "bisector"
  | "tangent"
  | "fit"
  | "triangle"
  | "polygon"
  | "circle"
  | "arc"
  | "sector"
  | "conic"
  | "measure"
  | "angle"
  | "relation"
  | "steps";

type GeometrySpec = {
  mockupId: string;
  title: string;
  subtitle: string;
  tool: GeometryTool;
  activeTool: string;
  result: string;
  propertyTitle: string;
  steps: string[];
  controls: [string, string][];
  checks: string[];
  insight: string;
  rule: string;
  practice: string;
};

export default function Geometry2DLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  if (lesson.id === 249) {
    return <MovingLinkageLociTargetLesson249 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 248) {
    return <EquidistantLociTargetLesson248 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 247) {
    return <LocusGeneratorTargetLesson247 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 246) {
    return <SymmetryExplorerTargetLesson246 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 245) {
    return <InvariantsTargetLesson245 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 244) {
    return <TransformationMappingTargetLesson244 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 243) {
    return <CompositeTransformationsTargetLesson243 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 242) {
    return <MatrixTransformationTargetLesson242 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 241) {
    return <DilationPointTargetLesson241 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 240) {
    return <RotationPointTargetLesson240 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 239) {
    return <ReflectionCircleTargetLesson239 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (lesson.id === 238) {
    return (
      <ReflectionPointTargetLesson238
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 237) {
    return (
      <ReflectionLineTargetLesson237
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 236) {
    return (
      <TranslationVectorTargetLesson236
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id >= 198 && lesson.id <= 235) {
    return (
      <DynamicGeometryMockupLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }

  const params = geometryParamsForLesson(lesson.id, lesson.title);
  return (
    <AdapterFrame
      title={`${lesson.title} - reusable 2D geometry engine`}
      value={
        params.isTransform
          ? "Transforming construction"
          : "Measured construction"
      }
      footer={`Focused geometry workspace with ${params.tools?.join(", ") ?? "point, segment, measure"} tools only.`}
    >
      <ReusableLessonEngine
        engine="geometry-2d"
        params={params}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    </AdapterFrame>
  );
}

function DynamicGeometryMockupLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  if (lesson.id === 198) {
    return (
      <FreePointTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 199) {
    return (
      <PointOnObjectTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 200) {
    return (
      <IntersectionPointTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 201) {
    return (
      <MidpointCentreTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 202) {
    return (
      <AttachDetachPointLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 203) {
    return (
      <LineThroughTwoPointsTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 204) {
    return (
      <SegmentTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 205) {
    return (
      <SegmentGivenLengthTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id >= 206 && lesson.id <= 235) {
    return remainingGeometryTargetForLesson({
      lesson,
      resetToken,
      onInteraction,
    });
  }

  const spec = dynamicGeometrySpecFor(lesson.id);
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);
  const [snap, setSnap] = useState(true);
  const [activeTab, setActiveTab] = useState("Construction");

  useEffect(() => {
    setX(2);
    setY(1);
    setSnap(true);
    setActiveTab("Construction");
  }, [lesson.id, resetToken]);

  const updatePoint = (axis: "x" | "y", value: number) => {
    if (axis === "x") setX(value);
    else setY(value);
    onInteraction();
  };

  return (
    <section
      className="space-y-4"
      data-testid={`dynamic-geometry-mockup-${spec.mockupId}`}
    >
      <header className="overflow-hidden rounded-2xl border border-[#dbe6fb] bg-white/95 shadow-[0_18px_46px_rgba(15,23,42,.075)]">
        <div className="grid gap-4 p-5 lg:grid-cols-[116px_minmax(0,1fr)_auto]">
          <div className="hidden h-28 w-28 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-lg lg:grid">
            {geometryHeaderIcon(spec.tool)}
          </div>
          <div>
            <p className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#087b98]">
              {lesson.id === 198
                ? "Dynamic Geometry Constructions"
                : lesson.topic}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#081238]">
              {spec.title}
            </h1>
            <p className="mt-2 text-base font-semibold text-[#53627f]">
              {spec.subtitle}
            </p>
          </div>
          <div className="grid content-start gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <HeaderMetric label="Time" value="6-10 min" />
            <HeaderMetric
              label="Level"
              value={lesson.id === 198 ? "Beginner" : "Middle School"}
            />
            <HeaderMetric label="Skills" value={skillLabel(spec.tool)} />
          </div>
        </div>
        <div className="grid border-t border-[#dbe6fb] sm:grid-cols-5">
          {["Observe", "Construct", "Pattern", "Rule", "Practice"].map(
            (tab, index) => (
              <button
                key={tab}
                type="button"
                className={
                  index === 0
                    ? "min-h-14 border-b-2 border-cyan-600 bg-cyan-50/70 text-sm font-black text-[#087b98]"
                    : "min-h-14 text-sm font-black text-[#53627f] hover:bg-cyan-50"
                }
                onClick={() => {
                  setActiveTab(tab);
                  onInteraction();
                }}
              >
                {index + 1} &nbsp; {tab}
              </button>
            ),
          )}
        </div>
      </header>

      <nav
        className="flex gap-2 overflow-x-auto rounded-2xl border border-[#dbe6fb] bg-white/95 p-2 shadow-sm"
        aria-label="Dynamic geometry lesson tabs"
      >
        {["Construction", "Explain", "Examples", "Formulas", "Know more"].map(
          (tab) => (
            <button
              key={tab}
              type="button"
              className={
                activeTab === tab
                  ? "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-[#087c9e] px-5 text-sm font-black text-white shadow-lg shadow-cyan-600/20"
                  : "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-black text-[#53627f] hover:bg-cyan-50"
              }
              onClick={() => {
                setActiveTab(tab);
                onInteraction();
              }}
            >
              {tabIcon(tab)}
              {tab}
            </button>
          ),
        )}
      </nav>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <main className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-[#081238]">
              Construction Workspace{" "}
              <HelpCircle className="ml-1 inline h-4 w-4 text-[#53627f]" />
            </h2>
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#dbe6fb] bg-white px-3 text-xs font-black text-[#152348]"
              onClick={() => {
                setSnap((value) => !value);
                onInteraction();
              }}
            >
              <Grid3X3 className="h-4 w-4" />
              {snap ? "Snap to grid" : "Free drag"}
            </button>
          </div>
          <div className="grid gap-3 lg:grid-cols-[76px_minmax(0,1fr)]">
            <ToolRail active={spec.activeTool} />
            <GeometryCanvas spec={spec} x={x} y={y} snap={snap} />
          </div>
          <UndoHistory spec={spec} />
        </main>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#081238]">
                {spec.propertyTitle}
              </h2>
              <ChevronDown className="h-4 w-4 text-[#53627f]" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm font-black text-[#152348]">
              <span className="h-3 w-3 rounded-full bg-blue-600" />P{" "}
              <span className="font-semibold text-[#53627f]">
                {spec.activeTool}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <NumericControl
                label="x"
                value={x}
                onChange={(value) => updatePoint("x", value)}
              />
              <NumericControl
                label="y"
                value={y}
                onChange={(value) => updatePoint("y", value)}
              />
            </div>
            <label className="mt-4 block text-xs font-black text-[#152348]">
              Label
              <input
                className="mt-2 h-11 w-full rounded-xl border border-[#dbe6fb] px-3 font-semibold outline-none focus:border-cyan-400"
                value="P"
                readOnly
              />
            </label>
            <div className="mt-4 grid grid-cols-[1fr_1fr] gap-3">
              <select className="h-11 rounded-xl border border-[#dbe6fb] bg-white px-3 text-sm font-bold">
                <option>Blue</option>
              </select>
              <select className="h-11 rounded-xl border border-[#dbe6fb] bg-white px-3 text-sm font-bold">
                <option>Solid</option>
              </select>
            </div>
          </section>

          <section className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 shadow-sm">
            <p className="text-sm font-black text-[#087b98]">
              <Eye className="mr-2 inline h-4 w-4" />
              Observe
            </p>
            <p className="mt-3 font-serif text-lg text-[#081238]">
              {spec.result}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#53627f]">
              {spec.insight}
            </p>
          </section>

          <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
            <p className="text-sm font-black text-[#081238]">Tools & Tips</p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-5 text-[#53627f]">
              {spec.checks.map((check) => (
                <li key={check}>• {check}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
        <h2 className="text-lg font-black text-[#087b98]">
          Construction steps (Compass-style)
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {spec.steps.map((step, index) => (
            <StepCard
              key={step}
              index={index + 1}
              text={step}
              tool={spec.tool}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)_minmax(280px,.8fr)]">
        <InfoCard title="Insight" body={spec.insight} formula={spec.result} />
        <InfoCard
          title={`Rule (${spec.title})`}
          body={spec.rule}
          formula={ruleFormula(spec.tool)}
        />
        <PracticeCard spec={spec} />
      </div>

      <footer className="grid gap-4 rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr]">
        <button
          type="button"
          className="min-h-16 rounded-xl border border-violet-200 bg-white px-4 text-left font-black text-[#081238]"
        >
          ← Previous
          <br />
          <span className="text-xs font-semibold text-[#53627f]">
            Dynamic Geometry
          </span>
        </button>
        <div className="grid place-items-center text-center text-sm font-black text-[#53627f]">
          <span>Lesson progress</span>
          <span className="mt-2 h-2 w-full max-w-64 rounded-full bg-slate-100">
            <span className="block h-2 w-1/3 rounded-full bg-cyan-600" />
          </span>
        </div>
        <button
          type="button"
          className="min-h-16 rounded-xl border border-violet-200 bg-violet-50 px-4 text-right font-black text-[#081238]"
        >
          Next →<br />
          <span className="text-xs font-semibold text-[#53627f]">
            {nextDynamicTitle(lesson.id)}
          </span>
        </button>
      </footer>
    </section>
  );
}

function LineThroughTwoPointsTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState({ x: -3, y: -1 });
  const [b, setB] = useState({ x: 4, y: 3 });
  const [display, setDisplay] = useState({
    grid: true,
    axes: true,
    coordinates: false,
    ticks: true,
  });
  const [activeTab, setActiveTab] = useState("Explore");
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);
  const [taskPoints, setTaskPoints] = useState({
    c: { x: 0, y: 2 },
    d: { x: 2, y: 0 },
  });
  const [taskResult, setTaskResult] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");

  useEffect(() => {
    setA({ x: -3, y: -1 });
    setB({ x: 4, y: 3 });
    setDisplay({ grid: true, axes: true, coordinates: false, ticks: true });
    setActiveTab("Explore");
    setDragging(null);
    setTaskPoints({ c: { x: 0, y: 2 }, d: { x: 2, y: 0 } });
    setTaskResult("idle");
  }, [resetToken]);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const vertical = Math.abs(dx) < 0.001;
  const slope = vertical ? null : dy / dx;
  const intercept = slope === null ? null : a.y - slope * a.x;
  const updatePoint = (which: "a" | "b", axis: "x" | "y", value: number) => {
    const setter = which === "a" ? setA : setB;
    setter((current) => ({
      ...current,
      [axis]: Math.max(-6, Math.min(6, value)),
    }));
    onInteraction();
  };
  const dragGraph = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && (event.buttons !== 1 || !dragging))
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(
      (((event.clientX - rect.left) / rect.width) * 620 - 310) / 42,
    );
    const y = Math.round(
      (250 - ((event.clientY - rect.top) / rect.height) * 500) / 42,
    );
    const which =
      event.type === "pointerdown"
        ? Math.hypot(x - a.x, y - a.y) <= Math.hypot(x - b.x, y - b.y)
          ? "a"
          : "b"
        : dragging;
    if (!which) return;
    if (event.type === "pointerdown") {
      setDragging(which);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    updatePoint(which, "x", x);
    updatePoint(which, "y", y);
  };
  const verifyTask = () => {
    const taskDx = taskPoints.d.x - taskPoints.c.x;
    const taskSlope =
      taskDx === 0 ? null : (taskPoints.d.y - taskPoints.c.y) / taskDx;
    const taskIntercept =
      taskSlope === null ? null : taskPoints.c.y - taskSlope * taskPoints.c.x;
    setTaskResult(
      taskSlope !== null &&
        Math.abs(taskSlope + 1) < 0.01 &&
        taskIntercept !== null &&
        Math.abs(taskIntercept - 2) < 0.01
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="relative -left-2 w-full max-w-[1174px] space-y-4"
      data-testid="dynamic-geometry-mockup-0260"
      data-direct-interaction="true"
    >
      <header className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_520px]">
          <div>
            <span className="rounded-full bg-cyan-50 px-2 py-1 text-[9px] font-black uppercase text-cyan-700">
              Coordinate Geometry
            </span>
            <h1 className="mt-2 text-2xl font-black text-slate-950">
              {lesson.title}
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-600">
              Construct and explore the line passing through any two points.
            </p>
            <div className="mt-2 flex gap-2 text-[10px] font-bold text-slate-600">
              <span className="rounded border border-slate-200 px-2 py-1">
                Grade 9-12
              </span>
              <span className="rounded border border-slate-200 px-2 py-1">
                Beginner
              </span>
              <span className="rounded border border-slate-200 px-2 py-1">
                5-10 min
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 text-center text-[10px] font-semibold text-slate-500">
            {["Observe", "Manipulate", "Notice", "Understand", "Try"].map(
              (step, index) => (
                <div key={step} className={index === 1 ? "text-blue-700" : ""}>
                  <span
                    className={`mx-auto mb-1 grid h-9 w-9 place-items-center rounded-full border ${index === 1 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white"}`}
                  >
                    {index + 1}
                  </span>
                  {step}
                </div>
              ),
            )}
          </div>
        </div>
      </header>
      <nav
        className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white"
        aria-label="Lesson sections"
      >
        {[
          "Explore",
          "Equation & Slope",
          "Collinearity",
          "Examples",
          "Summary",
        ].map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              onInteraction();
            }}
            className={`h-9 text-[10px] font-black ${activeTab === tab ? "border-b-2 border-blue-500 bg-blue-50 text-blue-700" : "text-slate-600"}`}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="grid gap-2 xl:grid-cols-[195px_minmax(0,1fr)_428px]">
        <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="text-xs font-black">Points</h2>
          <PointCoordinateEditor
            name="A"
            tone="blue"
            point={a}
            onChange={(axis, value) => updatePoint("a", axis, value)}
          />
          <PointCoordinateEditor
            name="B"
            tone="violet"
            point={b}
            onChange={(axis, value) => updatePoint("b", axis, value)}
          />
          <button
            type="button"
            className="mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-md border border-slate-200 text-[10px] font-bold"
            onClick={() => {
              setA({ x: -3, y: -1 });
              setB({ x: 4, y: 3 });
              onInteraction();
            }}
          >
            <RotateCcw className="h-3 w-3" />
            Reset points
          </button>
          <h3 className="mt-3 text-[10px] font-black">Display</h3>
          {(["grid", "axes", "coordinates", "ticks"] as const).map((key) => (
            <label
              key={key}
              className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold capitalize"
            >
              <input
                type="checkbox"
                checked={display[key]}
                onChange={(event) => {
                  setDisplay((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }));
                  onInteraction();
                }}
              />
              {key === "ticks" ? "Tick marks" : key}
            </label>
          ))}
          <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-2 text-[9px] leading-4 text-slate-600">
            <strong className="block text-blue-700">Tip</strong>Drag points A or
            B, or edit coordinates. The line and equation update instantly.
          </div>
        </aside>
        <main className="space-y-2">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            <LineThroughPointsGraph
              a={a}
              b={b}
              display={display}
              slope={slope}
              intercept={intercept}
              onPointer={dragGraph}
              onPointerEnd={() => setDragging(null)}
            />
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-[9px] font-bold"
              >
                Center
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-[9px] font-bold"
              >
                Zoom −
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-[9px] font-bold"
              >
                Zoom +
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-[9px] font-bold"
              >
                Fit
              </button>
            </div>
          </div>
          <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-blue-700">
                Try It Yourself
              </h2>
              <button
                type="button"
                className="rounded-md border border-violet-200 px-2 py-1 text-[9px] font-bold text-violet-700"
                onClick={() => {
                  setTaskPoints({ c: { x: 0, y: 2 }, d: { x: 2, y: 0 } });
                  setTaskResult("idle");
                }}
              >
                New Task
              </button>
            </div>
            <p className="mt-1 text-[10px] font-semibold">
              Place points C and D so that the line through them has slope m =
              −1 and y-intercept = 2.
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1">
              <TaskCoordinate
                label="C x"
                value={taskPoints.c.x}
                onChange={(value) =>
                  setTaskPoints((current) => ({
                    ...current,
                    c: { ...current.c, x: value },
                  }))
                }
              />
              <TaskCoordinate
                label="C y"
                value={taskPoints.c.y}
                onChange={(value) =>
                  setTaskPoints((current) => ({
                    ...current,
                    c: { ...current.c, y: value },
                  }))
                }
              />
              <TaskCoordinate
                label="D x"
                value={taskPoints.d.x}
                onChange={(value) =>
                  setTaskPoints((current) => ({
                    ...current,
                    d: { ...current.d, x: value },
                  }))
                }
              />
              <TaskCoordinate
                label="D y"
                value={taskPoints.d.y}
                onChange={(value) =>
                  setTaskPoints((current) => ({
                    ...current,
                    d: { ...current.d, y: value },
                  }))
                }
              />
            </div>
            <div className="mt-2 flex items-center justify-between rounded-md border border-violet-200 bg-violet-50 px-2 py-1.5 text-[9px] text-violet-700">
              <span>
                Hint: The line should pass through (0, 2) and have slope −1.
              </span>
              <button
                type="button"
                className="rounded bg-violet-600 px-2 py-1 font-black text-white"
                onClick={verifyTask}
              >
                Check
              </button>
            </div>
            {taskResult !== "idle" ? (
              <p
                role="status"
                className={`mt-1 text-[9px] font-black ${taskResult === "correct" ? "text-emerald-700" : "text-rose-700"}`}
              >
                {taskResult === "correct"
                  ? "Correct. The line is y = -x + 2."
                  : "Adjust C and D so both slope and intercept match."}
              </p>
            ) : null}
          </section>
        </main>
        <aside className="space-y-2">
          <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex justify-between">
              <h2 className="text-xs font-black">Observation</h2>
              <span
                className={`text-[10px] font-black ${vertical ? "text-amber-600" : "text-emerald-600"}`}
              >
                {vertical ? "Vertical line" : "✓ Collinear"}
              </span>
            </div>
            <div className="mt-2 overflow-hidden rounded-md border border-slate-200">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-200 p-3 text-xs">
                <span>Slope (m)</span>
                <strong>
                  {slope === null
                    ? "undefined"
                    : `${slope.toFixed(6)} = ${dy} / ${dx}`}
                </strong>
              </div>
              <div className="p-3 text-center text-xs">
                <span className="block text-left text-slate-500">
                  Equation (slope-intercept form)
                </span>
                <strong className="mt-2 block font-serif">
                  {vertical
                    ? `x = ${a.x.toFixed(3)}`
                    : `y = ${slope!.toFixed(6)}x + ${intercept!.toFixed(6)}`}
                </strong>
              </div>
            </div>
            <p className="mt-2 rounded-md bg-blue-50 p-2 text-[10px] font-semibold text-blue-800">
              Line passes through A({a.x}, {a.y}) and B({b.x}, {b.y}).
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex justify-between">
              <h2 className="text-xs font-black">Construction Steps</h2>
              <button
                type="button"
                className="text-[9px] font-bold text-violet-700"
              >
                Clear steps
              </button>
            </div>
            <ol className="mt-2 space-y-2 text-[10px] font-semibold">
              {[
                `Plotted point A(${a.x}, ${a.y})`,
                `Plotted point B(${b.x}, ${b.y})`,
                `Drew line through A and B`,
                `Extended the line infinitely`,
              ].map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-[8px] text-white">
                    {index + 1}
                  </span>
                  {step}
                  <Trash2 className="ml-auto h-3 w-3 text-slate-400" />
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-[10px] leading-5 text-slate-700">
            <h2 className="text-xs font-black text-violet-700">Key Insight</h2>
            <p className="mt-2">
              The line through two distinct points A(x₁, y₁) and B(x₂, y₂) has
            </p>
            <p className="mt-1 text-center font-serif text-sm font-black">
              slope m = (y₂ − y₁) / (x₂ − x₁)
            </p>
            <p className="mt-1">
              Equation (point-slope form): y − y₁ = m(x − x₁)
            </p>
          </section>
        </aside>
      </div>
      <nav
        className="grid grid-cols-[1fr_300px_1fr] items-center rounded-lg border border-slate-200 bg-white px-4 py-5 text-[10px] font-bold shadow-sm"
        aria-label="Adjacent lessons"
      >
        <a
          href="/lessons/geometry/202-attach-detach-point"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Attach / Detach Point
          </span>
        </a>
        <div className="text-center text-blue-700">
          ● ○ ○ ○ ○
          <span className="block text-[8px] text-slate-500">Step 2 of 5</span>
        </div>
        <a
          href="/lessons/geometry/204-segment"
          className="flex items-center justify-end gap-2 text-right"
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>
            Segment
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
    </section>
  );
}

function PointCoordinateEditor({
  name,
  tone,
  point,
  onChange,
}: {
  name: string;
  tone: "blue" | "violet";
  point: { x: number; y: number };
  onChange: (axis: "x" | "y", value: number) => void;
}) {
  return (
    <div className="mt-2 rounded-md border border-slate-200 p-2">
      <h3 className="text-[10px] font-black">
        <span className={tone === "blue" ? "text-blue-600" : "text-violet-600"}>
          ●
        </span>{" "}
        {name} (x, y)
      </h3>
      {(["x", "y"] as const).map((axis) => (
        <label
          key={axis}
          className="mt-2 grid grid-cols-[24px_1fr] items-center gap-2 text-[10px] font-bold"
        >
          <span>{axis}</span>
          <input
            aria-label={`${name} ${axis} coordinate`}
            className="min-w-0 rounded border border-slate-200 px-2 py-1 text-right"
            type="number"
            min="-6"
            max="6"
            value={point[axis]}
            onChange={(event) => onChange(axis, Number(event.target.value))}
          />
        </label>
      ))}
    </div>
  );
}

function TaskCoordinate({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-[8px] font-bold text-slate-500">
      {label}
      <input
        aria-label={`${label} task coordinate`}
        className="mt-0.5 w-full rounded border border-slate-200 px-2 py-1 text-slate-900"
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function LineThroughPointsGraph({
  a,
  b,
  display,
  slope,
  intercept,
  onPointer,
  onPointerEnd,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  display: {
    grid: boolean;
    axes: boolean;
    coordinates: boolean;
    ticks: boolean;
  };
  slope: number | null;
  intercept: number | null;
  onPointer: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerEnd: () => void;
}) {
  const sx = (x: number) => 310 + x * 42,
    sy = (y: number) => 250 - y * 42;
  const line =
    slope === null
      ? { x1: sx(a.x), y1: 0, x2: sx(a.x), y2: 500 }
      : {
          x1: 0,
          y1: sy(intercept! + slope * (-310 / 42)),
          x2: 620,
          y2: sy(intercept! + slope * (310 / 42)),
        };
  return (
    <svg
      viewBox="0 0 620 500"
      className="h-[430px] w-full touch-none"
      role="img"
      aria-label="Infinite line through draggable points A and B on a coordinate plane"
      onPointerDown={onPointer}
      onPointerMove={onPointer}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <rect width="620" height="500" fill="white" />
      {display.grid
        ? Array.from({ length: 13 }, (_, index) => (
            <g key={index}>
              <line
                x1={58 + index * 42}
                x2={58 + index * 42}
                y1="20"
                y2="480"
                stroke="#dbe3ef"
                strokeDasharray="4 4"
              />
              <line
                y1={40 + index * 42}
                y2={40 + index * 42}
                x1="20"
                x2="600"
                stroke="#dbe3ef"
                strokeDasharray="4 4"
              />
            </g>
          ))
        : null}
      {display.axes ? (
        <>
          <line
            x1="20"
            x2="605"
            y1="250"
            y2="250"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <line
            x1="310"
            x2="310"
            y1="15"
            y2="485"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <text x="604" y="238" fontSize="11">
            x
          </text>
          <text x="322" y="18" fontSize="11">
            y
          </text>
        </>
      ) : null}
      {display.ticks
        ? Array.from({ length: 13 }, (_, index) => {
            const n = index - 6;
            return (
              <g key={n}>
                <text x={sx(n) - 5} y="268" fontSize="9" fill="#475569">
                  {n}
                </text>
                <text x="290" y={sy(n) + 3} fontSize="9" fill="#475569">
                  {n}
                </text>
              </g>
            );
          })
        : null}
      <line {...line} stroke="#087ff5" strokeWidth="4" />
      <path
        d={`M ${line.x2 - 15} ${line.y2 - 8} L ${line.x2} ${line.y2} L ${line.x2 - 14} ${line.y2 + 8}`}
        fill="none"
        stroke="#087ff5"
        strokeWidth="3"
      />
      <circle cx={sx(a.x)} cy={sy(a.y)} r="9" fill="#087ff5" />
      <circle cx={sx(b.x)} cy={sy(b.y)} r="9" fill="#7c3aed" />
      <text
        x={sx(a.x) - 42}
        y={sy(a.y) + 30}
        fill="#087ff5"
        fontSize="15"
        fontWeight="800"
      >
        A({a.x}, {a.y})
      </text>
      <text
        x={sx(b.x) - 22}
        y={sy(b.y) - 20}
        fill="#7c3aed"
        fontSize="15"
        fontWeight="800"
      >
        B({b.x}, {b.y})
      </text>
      {display.coordinates ? (
        <>
          <line
            x1={sx(a.x)}
            x2={sx(a.x)}
            y1={sy(a.y)}
            y2="250"
            stroke="#087ff5"
            strokeDasharray="3 3"
          />
          <line
            x1={sx(b.x)}
            x2={sx(b.x)}
            y1={sy(b.y)}
            y2="250"
            stroke="#7c3aed"
            strokeDasharray="3 3"
          />
        </>
      ) : null}
    </svg>
  );
}

function SegmentTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState({ x: -3, y: 1 });
  const [b, setB] = useState({ x: 4, y: 2 });
  const [snap, setSnap] = useState(true);
  const [stage, setStage] = useState("Observe");
  const [compare, setCompare] = useState<"line" | "ray" | "none">("none");
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);
  const [answer, setAnswer] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setA({ x: -3, y: 1 });
    setB({ x: 4, y: 2 });
    setSnap(true);
    setStage("Observe");
    setCompare("none");
    setDragging(null);
    setAnswer("idle");
    setShowSolution(false);
  }, [resetToken]);

  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const update = (which: "a" | "b", point: { x: number; y: number }) => {
    const next = {
      x: Math.max(-6, Math.min(6, point.x)),
      y: Math.max(-6, Math.min(6, point.y)),
    };
    (which === "a" ? setA : setB)(next);
    onInteraction();
  };
  const dragSegment = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && (event.buttons !== 1 || !dragging))
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const raw = {
      x: (((event.clientX - rect.left) / rect.width) * 520 - 260) / 36,
      y: (230 - ((event.clientY - rect.top) / rect.height) * 460) / 36,
    };
    const point = {
      x: snap ? Math.round(raw.x) : Number(raw.x.toFixed(1)),
      y: snap ? Math.round(raw.y) : Number(raw.y.toFixed(1)),
    };
    const which =
      event.type === "pointerdown"
        ? Math.hypot(point.x - a.x, point.y - a.y) <=
          Math.hypot(point.x - b.x, point.y - b.y)
          ? "a"
          : "b"
        : dragging;
    if (!which) return;
    if (event.type === "pointerdown") {
      setDragging(which);
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    update(which, point);
  };

  return (
    <section
      className="space-y-2"
      data-testid="dynamic-geometry-mockup-0261"
      data-direct-interaction="true"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <span className="rounded-full bg-cyan-50 px-2 py-1 text-[9px] font-black uppercase text-cyan-700">
          Dynamic Geometry Constructions
        </span>
        <h1 className="mt-2 text-4xl font-black leading-none text-slate-950">
          {lesson.title}
        </h1>
        <p className="mt-2 text-xs font-semibold text-slate-600">
          Construct finite line segments and explore their properties.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-slate-600">
          <span className="rounded-full border border-slate-200 px-2 py-1">
            Foundation / Advanced
          </span>
          <span className="rounded-full border border-slate-200 px-2 py-1">
            Construction Studio
          </span>
          <span className="rounded-full border border-slate-200 px-2 py-1">
            Geometry Tools
          </span>
          <span className="rounded-full border border-slate-200 px-2 py-1">
            6-10 min
          </span>
        </div>
        <div className="mt-3 flex flex-wrap justify-between gap-2">
          <div className="flex gap-1.5">
            <button type="button" className="segment-action">
              English (English)
            </button>
            <button
              type="button"
              className="segment-action"
              onClick={() => {
                setA({ x: -3, y: 1 });
                setB({ x: 4, y: 2 });
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
            <button type="button" className="segment-action text-slate-400">
              Undo
            </button>
            <button type="button" className="segment-action text-slate-400">
              Redo
            </button>
            <button type="button" className="segment-action">
              <Share2 />
              Share
            </button>
          </div>
          <button type="button" className="segment-action">
            <Maximize2 />
            Workspace
          </button>
        </div>
      </header>
      <nav
        className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        aria-label="Segment lesson stages"
      >
        {[
          ["Observe", <Eye key="e" />],
          ["Manipulate", <Hand key="h" />],
          ["Notice", <Lightbulb key="l" />],
          ["Understand", <BookOpen key="b" />],
          ["Try", <Target key="t" />],
        ].map(([name, icon]) => (
          <button
            key={String(name)}
            type="button"
            onClick={() => {
              setStage(String(name));
              onInteraction();
            }}
            className={`flex h-14 items-center justify-center gap-2 text-[10px] font-black [&_svg]:h-4 [&_svg]:w-4 ${stage === name ? "border-b-2 border-cyan-500 bg-cyan-50 text-blue-700" : "text-slate-600"}`}
          >
            {icon}
            {name}
          </button>
        ))}
      </nav>
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_225px]">
        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-black">Construct a segment</h2>
              <p className="mt-1 text-[10px] font-semibold text-slate-600">
                Drag points A and B to change the segment.
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-black">
              Snap
              <input
                type="checkbox"
                checked={snap}
                onChange={(event) => {
                  setSnap(event.target.checked);
                  onInteraction();
                }}
              />
            </label>
          </div>
          <div className="mt-2 flex gap-1">
            <button
              className="segment-tool is-active"
              type="button"
              aria-label="Select tool"
            >
              <MousePointer2 />
            </button>
            <button
              className="segment-tool"
              type="button"
              aria-label="Point tool"
            >
              <Circle />
            </button>
            <button
              className="segment-tool"
              type="button"
              aria-label="Segment tool"
            >
              <PenTool />
            </button>
            <button
              className="segment-tool"
              type="button"
              aria-label="Line tool"
            >
              <Ruler />
            </button>
            <button
              className="segment-tool"
              type="button"
              aria-label="Settings"
            >
              <Compass />
            </button>
          </div>
          <SegmentGraph
            a={a}
            b={b}
            compare={compare}
            onPointer={dragSegment}
            onEnd={() => setDragging(null)}
          />
          <div className="grid overflow-hidden rounded-md border border-slate-200 sm:grid-cols-[1fr_155px]">
            <div className="p-2">
              <p className="text-[9px] font-bold text-slate-500">
                Point coordinates
              </p>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <SegmentPointInputs
                  name="A"
                  point={a}
                  onChange={(point) => update("a", point)}
                />
                <SegmentPointInputs
                  name="B"
                  point={b}
                  onChange={(point) => update("b", point)}
                />
              </div>
            </div>
            <div className="border-t border-slate-200 p-2 sm:border-l sm:border-t-0">
              <p className="text-[9px] font-bold text-slate-500">
                Segment length
              </p>
              <strong className="mt-3 block text-sm text-blue-700">
                AB = {length.toFixed(2)} units
              </strong>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] font-bold">
            <span>Compare with</span>
            {(["line", "ray", "none"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => {
                  setCompare(mode);
                  onInteraction();
                }}
                className={`rounded-md border px-3 py-1.5 capitalize ${compare === mode ? "border-blue-500 text-blue-700" : "border-slate-200 text-slate-600"}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>
        <aside className="space-y-2">
          <SegmentAside title="Instant observation" icon={<Eye />}>
            <p>Length</p>
            <strong className="text-sm text-blue-700">
              AB = {length.toFixed(2)} units
            </strong>
            <p className="mt-3">Midpoint</p>
            <strong className="text-sm text-violet-700">
              M ({midpoint.x.toFixed(2)}, {midpoint.y.toFixed(2)})
            </strong>
            <p className="mt-3">Distance formula check</p>
            <p className="mt-1 font-serif text-xs font-black">
              √(({b.x} − ({a.x}))² + ({b.y} − {a.y})²) = {length.toFixed(2)}
            </p>
          </SegmentAside>
          <SegmentAside title="Construction steps" icon={<Lightbulb />}>
            <ol className="space-y-2">
              {[
                "Place point A.",
                "Place point B.",
                "The segment AB is drawn. Its length is the distance between A and B.",
              ].map((text, index) => (
                <li className="flex gap-2" key={text}>
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-400 text-[8px] font-black text-white">
                    {index + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </SegmentAside>
          <SegmentAside title="Definition & insight" icon={<BookOpen />}>
            <p>A segment is the part of a line between two endpoints.</p>
            <p className="mt-2">
              Notation: AB or <span className="overline">AB</span>
            </p>
            <p className="mt-2">Length (Distance formula):</p>
            <p className="mt-1 font-serif text-xs font-black">
              AB = √((x₂ − x₁)² + (y₂ − y₁)²)
            </p>
          </SegmentAside>
        </aside>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-lg font-black">Try it yourself</h2>
        <p className="text-[10px] font-semibold text-slate-600">
          Construct a segment with the given endpoints and verify its length.
        </p>
        <div className="mt-2 grid gap-2 lg:grid-cols-[205px_minmax(0,1fr)_185px]">
          <div className="rounded-md bg-cyan-50 p-3 text-[10px] leading-5">
            <strong className="text-blue-700">Your task</strong>
            <p className="mt-3">
              Set A (−2, −1) and B (3, 4). Construct AB and find its length.
            </p>
            <p className="text-slate-500">
              Hint: Drag points or enter coordinates.
            </p>
            <button
              type="button"
              className="mt-2 rounded-md bg-blue-600 px-3 py-2 font-black text-white"
              onClick={() => {
                const ok = a.x === -2 && a.y === -1 && b.x === 3 && b.y === 4;
                setAnswer(ok ? "correct" : "incorrect");
                onInteraction();
              }}
            >
              Check Answer
            </button>
            {answer !== "idle" ? (
              <p
                role="status"
                className={`mt-2 font-black ${answer === "correct" ? "text-emerald-700" : "text-rose-700"}`}
              >
                {answer === "correct"
                  ? "Correct. The length is √50 ≈ 7.07."
                  : "Set both endpoints to the requested coordinates."}
              </p>
            ) : null}
          </div>
          <SegmentTaskPreview show={showSolution} />
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5">
            <strong className="text-blue-700">Answer preview</strong>
            <p className="mt-3">
              A (−2, −1)
              <br />B (3, 4)
            </p>
            <p className="mt-3">Expected length</p>
            <strong className="text-blue-700">AB = 7.07 units</strong>
            <button
              type="button"
              className="mt-3 flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 font-bold"
              onClick={() => {
                setShowSolution((value) => !value);
                onInteraction();
              }}
            >
              <Eye className="h-3 w-3" />
              Show Solution
            </button>
          </div>
        </div>
      </section>
      <nav
        className="grid grid-cols-2 gap-2 text-[10px] font-bold"
        aria-label="Adjacent lessons"
      >
        <a
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3"
          href="/lessons/geometry/203-line-through-two-points"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Line Through Two Points
          </span>
        </a>
        <a
          className="flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-3 text-right"
          href="/lessons/geometry/205-segment-with-given-length"
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>
            Segment with Given Length
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
    </section>
  );
}

function SegmentGraph({
  a,
  b,
  compare,
  onPointer,
  onEnd,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  compare: "line" | "ray" | "none";
  onPointer: (event: PointerEvent<SVGSVGElement>) => void;
  onEnd: () => void;
}) {
  const sx = (x: number) => 260 + x * 36,
    sy = (y: number) => 230 - y * 36;
  const dx = b.x - a.x,
    dy = b.y - a.y,
    n = Math.hypot(dx, dy) || 1,
    ux = dx / n,
    uy = dy / n;
  const x1 = compare === "line" ? sx(a.x) - ux * 300 : sx(a.x),
    y1 = compare === "line" ? sy(a.y) + uy * 300 : sy(a.y),
    x2 = compare === "none" ? sx(b.x) : sx(b.x) + ux * 300,
    y2 = compare === "none" ? sy(b.y) : sy(b.y) - uy * 300;
  return (
    <svg
      viewBox="0 0 520 460"
      className="h-[440px] w-full touch-none"
      role="img"
      aria-label="Finite segment AB with draggable endpoints A and B"
      onPointerDown={onPointer}
      onPointerMove={onPointer}
      onPointerUp={onEnd}
      onPointerCancel={onEnd}
    >
      <rect width="520" height="460" fill="white" />
      {Array.from({ length: 13 }, (_, index) => (
        <g key={index}>
          <line
            x1={44 + index * 36}
            x2={44 + index * 36}
            y1="25"
            y2="435"
            stroke="#dbe3ef"
            strokeDasharray="3 3"
          />
          <line
            y1={14 + index * 36}
            y2={14 + index * 36}
            x1="20"
            x2="500"
            stroke="#dbe3ef"
            strokeDasharray="3 3"
          />
        </g>
      ))}
      <line x1="20" x2="505" y1="230" y2="230" stroke="#334155" />
      <line x1="260" x2="260" y1="15" y2="445" stroke="#334155" />
      <text x="504" y="220" fontSize="10">
        x
      </text>
      <text x="270" y="18" fontSize="10">
        y
      </text>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#087ff5" strokeWidth="4" />
      <circle cx={sx(a.x)} cy={sy(a.y)} r="8" fill="#087ff5" />
      <circle cx={sx(b.x)} cy={sy(b.y)} r="8" fill="#087ff5" />
      <text
        x={sx(a.x) - 12}
        y={sy(a.y) - 14}
        fill="#087ff5"
        fontSize="14"
        fontWeight="800"
      >
        A
      </text>
      <text
        x={sx(b.x) + 8}
        y={sy(b.y) - 14}
        fill="#087ff5"
        fontSize="14"
        fontWeight="800"
      >
        B
      </text>
      <foreignObject x={sx(a.x) - 35} y={sy(a.y) + 10} width="80" height="30">
        <div className="rounded border border-slate-200 bg-white px-2 py-1 text-center text-[9px]">
          A ({a.x}, {a.y})
        </div>
      </foreignObject>
      <foreignObject x={sx(b.x) - 30} y={sy(b.y) + 10} width="80" height="30">
        <div className="rounded border border-slate-200 bg-white px-2 py-1 text-center text-[9px]">
          B ({b.x}, {b.y})
        </div>
      </foreignObject>
    </svg>
  );
}
function SegmentPointInputs({
  name,
  point,
  onChange,
}: {
  name: string;
  point: { x: number; y: number };
  onChange: (point: { x: number; y: number }) => void;
}) {
  return (
    <div>
      <p className="text-center text-[8px] font-bold">{name} (x, y)</p>
      <div className="mt-1 grid grid-cols-2 gap-1">
        <input
          aria-label={`${name} x coordinate`}
          className="min-w-0 rounded border border-slate-200 px-1 py-1 text-center text-[10px]"
          type="number"
          value={point.x}
          onChange={(event) =>
            onChange({ ...point, x: Number(event.target.value) })
          }
        />
        <input
          aria-label={`${name} y coordinate`}
          className="min-w-0 rounded border border-slate-200 px-1 py-1 text-center text-[10px]"
          type="number"
          value={point.y}
          onChange={(event) =>
            onChange({ ...point, y: Number(event.target.value) })
          }
        />
      </div>
    </div>
  );
}
function SegmentAside({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 text-[10px] leading-4 shadow-sm">
      <h2 className="flex items-center gap-2 text-xs font-black text-blue-700">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 [&_svg]:h-3.5 [&_svg]:w-3.5">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-3 rounded-md border border-slate-200 bg-white p-2 text-slate-700">
        {children}
      </div>
    </section>
  );
}
function SegmentTaskPreview({ show }: { show: boolean }) {
  return (
    <svg
      viewBox="0 0 310 190"
      className="h-[180px] w-full"
      role="img"
      aria-label="Practice coordinate plane for segment from negative two negative one to three four"
    >
      <rect width="310" height="190" fill="white" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line
            x1={35 + i * 30}
            x2={35 + i * 30}
            y1="10"
            y2="180"
            stroke="#dbe3ef"
            strokeDasharray="3 3"
          />
          <line
            y1={10 + i * 20}
            y2={10 + i * 20}
            x1="20"
            x2="290"
            stroke="#dbe3ef"
            strokeDasharray="3 3"
          />
        </g>
      ))}
      <line x1="20" x2="295" y1="110" y2="110" stroke="#334155" />
      <line x1="150" x2="150" y1="10" y2="180" stroke="#334155" />
      {show ? (
        <>
          <line
            x1="90"
            y1="130"
            x2="240"
            y2="30"
            stroke="#087ff5"
            strokeWidth="4"
          />
          <circle cx="90" cy="130" r="6" fill="#087ff5" />
          <circle cx="240" cy="30" r="6" fill="#087ff5" />
        </>
      ) : null}
    </svg>
  );
}

function SegmentGivenLengthTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [length, setLength] = useState(5);
  const [angle, setAngle] = useState(45);
  const [grid, setGrid] = useState(true);
  const [task, setTask] = useState({ ax: -2, ay: 1, length: 7, angle: 30 });
  const [taskResult, setTaskResult] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  useEffect(() => {
    setStart({ x: 0, y: 0 });
    setLength(5);
    setAngle(45);
    setGrid(true);
    setTask({ ax: -2, ay: 1, length: 7, angle: 30 });
    setTaskResult("idle");
  }, [resetToken]);
  const radians = (angle * Math.PI) / 180;
  const end = {
    x: start.x + length * Math.cos(radians),
    y: start.y + length * Math.sin(radians),
  };
  const updateAngleFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 620,
      py = ((event.clientY - rect.top) / rect.height) * 520;
    const sx = 310 + start.x * 30,
      sy = 260 - start.y * 30;
    setAngle(
      Math.round(((Math.atan2(sy - py, px - sx) * 180) / Math.PI + 360) % 360),
    );
    onInteraction();
  };
  const setNumeric = (
    setter: (value: number) => void,
    value: string,
    min: number,
    max: number,
  ) => {
    setter(Math.max(min, Math.min(max, Number(value))));
    onInteraction();
  };
  return (
    <section
      className="-mt-2 w-full space-y-3"
      data-testid="dynamic-geometry-mockup-0262"
      data-direct-interaction="true"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-4">
            <div className="grid h-16 w-14 place-items-center rounded-lg border border-cyan-200 text-cyan-600">
              <Compass className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950">
                {lesson.title}
              </h1>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Construct a segment of a specified length from a chosen start
                point.
              </p>
            </div>
          </div>
          <button type="button" className="segment-action">
            English (English)
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2 text-[9px] font-bold text-slate-600">
            <span className="rounded-md border border-slate-200 px-2 py-1">
              Dynamic Geometry Constructions
            </span>
            <span className="rounded-md border border-slate-200 px-2 py-1">
              Geometry Tools
            </span>
            <span className="rounded-md border border-slate-200 px-2 py-1">
              6-10 min
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="segment-action"
              onClick={() => {
                setStart({ x: 0, y: 0 });
                setLength(5);
                setAngle(45);
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
            <button type="button" className="segment-action">
              <Share2 />
              Share
            </button>
          </div>
        </div>
      </header>
      <nav
        className="grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        aria-label="Given length lesson stages"
      >
        {[
          ["Observe", "See the model"],
          ["Manipulate", "Change inputs"],
          ["Notice", "Pattern emerges"],
          ["Understand", "The rule"],
          ["Try it", "Practice"],
        ].map(([title, sub], index) => (
          <button
            type="button"
            key={title}
            className={`h-14 text-left text-[9px] ${index === 0 ? "border-b-2 border-blue-600 bg-blue-50" : ""}`}
            onClick={() => onInteraction()}
          >
            <strong className="block text-[10px] text-slate-800">
              <span className="mr-2 rounded bg-slate-100 px-1.5 py-1">
                {index + 1}
              </span>
              {title}
            </strong>
            <span className="ml-8 text-slate-500">{sub}</span>
          </button>
        ))}
      </nav>
      <section className="grid rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[minmax(0,1fr)_225px]">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black">Interactive Model</h2>
            <label className="flex items-center gap-2 text-[9px] font-bold">
              Grid
              <input
                type="checkbox"
                checked={grid}
                onChange={(event) => {
                  setGrid(event.target.checked);
                  onInteraction();
                }}
              />
            </label>
          </div>
          <p className="mt-2 inline-flex rounded-md border border-cyan-200 bg-cyan-50 px-2 py-1 text-[9px] font-bold text-blue-700">
            Drag the handle to set direction.
          </p>
          <GivenLengthGraph
            start={start}
            end={end}
            length={length}
            grid={grid}
            onPointer={updateAngleFromPointer}
          />
          <div className="flex gap-4 border-t border-slate-200 pt-2 text-[8px] font-bold">
            <span className="text-blue-700">● Start point A</span>
            <span className="text-violet-700">━━ Constructed segment</span>
            <span>-- Direction ray</span>
          </div>
        </div>
        <aside className="border-t border-slate-200 p-3 lg:border-l lg:border-t-0">
          <h2 className="text-xs font-black">Construction Controls</h2>
          <h3 className="mt-3 text-[9px] font-black">Start point A</h3>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <NumberField
              label="A x"
              value={start.x}
              onChange={(value) =>
                setNumeric(
                  (v) => setStart((current) => ({ ...current, x: v })),
                  value,
                  -6,
                  6,
                )
              }
            />
            <NumberField
              label="A y"
              value={start.y}
              onChange={(value) =>
                setNumeric(
                  (v) => setStart((current) => ({ ...current, y: v })),
                  value,
                  -6,
                  6,
                )
              }
            />
          </div>
          <h3 className="mt-3 text-[9px] font-black">Length</h3>
          <NumberField
            label="Length AB"
            value={length}
            onChange={(value) => setNumeric(setLength, value, 1, 9)}
          />
          <h3 className="mt-3 text-[9px] font-black">Direction</h3>
          <NumberField
            label="Angle theta"
            value={angle}
            onChange={(value) => setNumeric(setAngle, value, 0, 359)}
          />
          <AngleDial angle={angle} />
          <div className="mt-3 rounded-md border border-cyan-200 bg-cyan-50 p-2 text-[9px]">
            <div className="flex justify-between">
              <strong className="text-cyan-700">Live Verification</strong>
              <span className="rounded bg-emerald-100 px-1.5 text-emerald-700">
                ✓ Verified
              </span>
            </div>
            <p className="mt-2 font-bold">Constructed point B</p>
            <p>
              B ({end.x.toFixed(3)}, {end.y.toFixed(3)})
            </p>
            <p className="mt-1">
              Distance AB{" "}
              <strong className="float-right">{length.toFixed(3)} units</strong>
            </p>
            <p>
              Angle θ{" "}
              <strong className="float-right">{angle.toFixed(1)}°</strong>
            </p>
            <p className="mt-2 rounded bg-emerald-100 p-2 font-black text-emerald-700">
              Great! AB = {length} units.
            </p>
          </div>
        </aside>
      </section>
      <div className="grid gap-2 lg:grid-cols-3">
        <GivenLengthCard title="Worked Example" tone="blue">
          <p>
            Construct segment AB of length 5 units from A (0, 0) at angle 45°.
          </p>
          <ol className="mt-2 space-y-1">
            {[
              "Set start point A (0, 0).",
              "Set length AB = 5 units.",
              "Set direction angle θ = 45°.",
              "Draw ray from A at 45°.",
              "Mark point B so that AB = 5 units.",
              "Read coordinates of B and verify.",
            ].map((s, i) => (
              <li key={s}>
                <strong className="text-blue-700">{i + 1}.</strong> {s}
              </li>
            ))}
          </ol>
          <p className="mt-2 rounded bg-cyan-50 p-2 font-bold">
            Result: B ({end.x.toFixed(3)}, {end.y.toFixed(3)})
          </p>
        </GivenLengthCard>
        <GivenLengthCard title="Key Insight" tone="violet">
          <p>
            Point B is determined by the start point A, the length d, and the
            direction angle θ.
          </p>
          <p className="mt-2 font-black text-violet-700">Coordinate Rule</p>
          <div className="mt-2 rounded bg-violet-50 p-3 text-center font-serif text-sm font-black">
            xB = xA + d cos θ<br />
            yB = yA + d sin θ
          </div>
          <p className="mt-2">
            θ is measured counterclockwise from the positive x-axis.
          </p>
        </GivenLengthCard>
        <GivenLengthCard title="Your Turn" tone="cyan">
          <p>
            Construct segment AB of length 7 units from A (−2, 1) at angle 30°.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <NumberField
              label="Task A x"
              value={task.ax}
              onChange={(value) =>
                setTask((current) => ({ ...current, ax: Number(value) }))
              }
            />
            <NumberField
              label="Task A y"
              value={task.ay}
              onChange={(value) =>
                setTask((current) => ({ ...current, ay: Number(value) }))
              }
            />
          </div>
          <NumberField
            label="Task length"
            value={task.length}
            onChange={(value) =>
              setTask((current) => ({ ...current, length: Number(value) }))
            }
          />
          <NumberField
            label="Task angle"
            value={task.angle}
            onChange={(value) =>
              setTask((current) => ({ ...current, angle: Number(value) }))
            }
          />
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-cyan-600 py-2 text-[10px] font-black text-white"
            onClick={() => {
              const ok =
                task.ax === -2 &&
                task.ay === 1 &&
                task.length === 7 &&
                task.angle === 30;
              setTaskResult(ok ? "correct" : "incorrect");
              onInteraction();
            }}
          >
            Check My Construction
          </button>
          {taskResult !== "idle" ? (
            <p
              role="status"
              className={`mt-2 font-black ${taskResult === "correct" ? "text-emerald-700" : "text-rose-700"}`}
            >
              {taskResult === "correct"
                ? "Correct construction inputs."
                : "Use the requested start, length and angle."}
            </p>
          ) : null}
        </GivenLengthCard>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-sm font-black">
          Construction Steps (Compass & Straightedge)
        </h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {[
            ["Draw Ray", "Draw a ray from A in the desired direction."],
            ["Set Compass", "Set compass radius to the given length d."],
            [
              "Mark Point B",
              "With A as center, draw an arc to meet the ray at B.",
            ],
            ["Segment AB", "Segment AB is the required length d."],
          ].map(([title, body], index) => (
            <article
              key={title}
              className="rounded-md border border-slate-200 p-2 text-[9px]"
            >
              <h3 className="font-black text-blue-700">
                <span className="mr-1 rounded bg-blue-50 px-1.5 py-1">
                  {index + 1}
                </span>
                {title}
              </h3>
              <p className="mt-2 text-slate-600">{body}</p>
              <MiniConstructionStep step={index} />
            </article>
          ))}
        </div>
      </section>
      <nav
        className="grid grid-cols-2 gap-2 text-[10px] font-bold"
        aria-label="Adjacent lessons"
      >
        <a
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3"
          href="/lessons/geometry/204-segment"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Segment
          </span>
        </a>
        <a
          className="flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-3 text-right"
          href="/lessons/geometry/206-ray"
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>Ray
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
    </section>
  );
}

function GivenLengthGraph({
  start,
  end,
  length,
  grid,
  onPointer,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  length: number;
  grid: boolean;
  onPointer: (event: PointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (x: number) => 310 + x * 30,
    sy = (y: number) => 260 - y * 30;
  return (
    <svg
      viewBox="0 0 620 520"
      className="h-[480px] w-full touch-none"
      role="img"
      aria-label="Fixed-length segment from A to constructed point B with draggable direction handle"
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      {grid
        ? Array.from({ length: 17 }, (_, i) => (
            <g key={i}>
              <line
                x1={40 + i * 34}
                x2={40 + i * 34}
                y1="20"
                y2="500"
                stroke="#dbe3ef"
                strokeDasharray="3 3"
              />
              <line
                y1={20 + i * 30}
                y2={20 + i * 30}
                x1="20"
                x2="600"
                stroke="#dbe3ef"
                strokeDasharray="3 3"
              />
            </g>
          ))
        : null}
      <line x1="20" x2="605" y1="260" y2="260" stroke="#64748b" />
      <line x1="310" x2="310" y1="15" y2="505" stroke="#64748b" />
      <line
        x1={sx(start.x)}
        y1={sy(start.y)}
        x2={sx(end.x)}
        y2={sy(end.y)}
        stroke="#7c3aed"
        strokeWidth="4"
      />
      <line
        x1={sx(start.x)}
        y1={sy(start.y)}
        x2={sx(end.x) + (sx(end.x) - sx(start.x)) * 0.55}
        y2={sy(end.y) + (sy(end.y) - sy(start.y)) * 0.55}
        stroke="#334155"
        strokeDasharray="6 5"
      />
      <circle cx={sx(start.x)} cy={sy(start.y)} r="7" fill="#2563eb" />
      <circle
        cx={sx(end.x)}
        cy={sy(end.y)}
        r="14"
        fill="white"
        stroke="#2563eb"
        strokeWidth="3"
      />
      <text
        x={sx(start.x) + 10}
        y={sy(start.y) - 8}
        fill="#2563eb"
        fontSize="14"
        fontWeight="800"
      >
        A ({start.x}, {start.y})
      </text>
      <text
        x={sx(end.x) + 18}
        y={sy(end.y) - 12}
        fill="#7c3aed"
        fontSize="13"
        fontWeight="800"
      >
        B
      </text>
      <text
        x={(sx(start.x) + sx(end.x)) / 2}
        y={(sy(start.y) + sy(end.y)) / 2 - 10}
        fill="#7c3aed"
        fontSize="12"
        fontWeight="800"
      >
        AB = {length}
      </text>
    </svg>
  );
}
function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-1 block text-[8px] font-bold text-slate-500">
      {label}
      <input
        aria-label={label}
        className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-900"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function AngleDial({ angle }: { angle: number }) {
  const r = (angle * Math.PI) / 180,
    x = 55 + Math.cos(r) * 38,
    y = 55 - Math.sin(r) * 38;
  return (
    <svg
      viewBox="0 0 110 110"
      className="mx-auto mt-2 h-[105px] w-[105px]"
      role="img"
      aria-label={`Direction dial ${angle} degrees`}
    >
      <circle cx="55" cy="55" r="40" fill="white" stroke="#94a3b8" />
      <line x1="55" y1="55" x2={x} y2={y} stroke="#7c3aed" strokeWidth="3" />
      <circle cx={x} cy={y} r="4" fill="#2563eb" />
      <text x="45" y="88" fill="#1d4ed8" fontSize="14" fontWeight="900">
        {angle}°
      </text>
    </svg>
  );
}
function GivenLengthCard({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "blue" | "violet" | "cyan";
  children: ReactNode;
}) {
  const color =
    tone === "blue"
      ? "text-blue-700"
      : tone === "violet"
        ? "text-violet-700"
        : "text-cyan-700";
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 text-[9px] leading-4 shadow-sm">
      <h2 className={`text-xs font-black ${color}`}>{title}</h2>
      <div className="mt-3 text-slate-700">{children}</div>
    </article>
  );
}
function MiniConstructionStep({ step }: { step: number }) {
  return (
    <svg
      viewBox="0 0 130 60"
      className="mt-2 h-[50px] w-full"
      aria-hidden="true"
    >
      <line
        x1="15"
        y1="45"
        x2="112"
        y2={step === 1 ? "45" : "18"}
        stroke={step === 3 ? "#7c3aed" : "#64748b"}
        strokeWidth="2"
        strokeDasharray={step === 0 || step === 2 ? "5 4" : undefined}
      />
      <circle cx="15" cy="45" r="4" fill="#2563eb" />
      <circle cx="112" cy={step === 1 ? 45 : 18} r="4" fill="#2563eb" />
      {step === 1 ? (
        <path
          d="M45 48 L65 15 L85 48"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}

function FreePointTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);
  const [pointSize, setPointSize] = useState(6);
  const [snap, setSnap] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("Construction");

  useEffect(() => {
    setX(2);
    setY(1);
    setPointSize(6);
    setSnap(true);
    setDragging(false);
    setActiveTab("Construction");
  }, [resetToken]);

  const updateCoordinates = (nextX: number, nextY: number) => {
    setX(snap ? Math.round(nextX) : Math.round(nextX * 10) / 10);
    setY(snap ? Math.round(nextY) : Math.round(nextY * 10) / 10);
    onInteraction();
  };

  return (
    <section
      className="space-y-3"
      data-testid="dynamic-geometry-mockup-0255"
      data-direct-interaction="true"
    >
      <header className="rounded-xl border border-[#dbe6fb] bg-white px-4 py-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase text-[#087daa]">
              Dynamic Geometry Constructions
            </p>
            <h1 className="mt-2 text-[32px] font-black leading-none text-[#081238]">
              Free Point{" "}
              <span className="ml-2 text-lg font-normal text-[#52627e]">▯</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-[#52627e]">
              Create independent points anywhere in the plane.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <HeaderMetric label="Time" value="6-10 min" />
            <HeaderMetric label="Level" value="Beginner" />
            <HeaderMetric label="Skills" value="Geometry Basics" />
          </div>
        </div>
        <div className="mt-4 grid overflow-hidden rounded-xl border border-[#dbe6fb] sm:grid-cols-5">
          {[
            ["Observe", "What is a free point?"],
            ["Manipulate", "Drag the point"],
            ["Notice", "Independent coordinates"],
            ["Understand", "Free point rule"],
            ["Try", "Practice it"],
          ].map(([title, body], index) => (
            <button
              key={title}
              type="button"
              className={
                index === 0
                  ? "min-h-[70px] border-b-2 border-cyan-500 bg-cyan-50/40 px-3 text-left"
                  : "min-h-[70px] border-l border-[#e5edf8] px-3 text-left hover:bg-cyan-50/40"
              }
              onClick={() => onInteraction()}
            >
              <span className="flex items-center gap-2 text-xs font-black text-[#152348]">
                <i className="grid h-5 w-5 place-items-center rounded-full border border-[#dbe6fb] bg-white not-italic">
                  {index + 1}
                </i>
                {title}
              </span>
              <small className="ml-7 mt-2 block text-[10px] font-medium text-[#52627e]">
                {body}
              </small>
            </button>
          ))}
        </div>
      </header>

      <nav className="grid overflow-hidden rounded-xl border border-[#dbe6fb] bg-white p-2 shadow-sm sm:grid-cols-5">
        {["Construction", "Explain", "Examples", "Formulas", "Know more"].map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                onInteraction();
              }}
              className={
                activeTab === tab
                  ? "flex h-10 items-center justify-center gap-2 rounded-lg bg-[#078ca7] px-3 text-xs font-black text-white"
                  : "flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-black text-[#152348] hover:bg-cyan-50"
              }
            >
              {tab === "Construction" ? (
                <Focus className="h-4 w-4" />
              ) : (
                tabIcon(tab)
              )}
              {tab}
            </button>
          ),
        )}
      </nav>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_227px] xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-lg font-black text-[#152348]">
              Construction Workspace{" "}
              <HelpCircle className="ml-1 inline h-4 w-4 text-[#52627e]" />
            </h2>
            <button
              type="button"
              onClick={() => {
                setSnap((value) => !value);
                onInteraction();
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dbe6fb] px-3 text-xs font-black text-[#152348]"
            >
              <Grid3X3 className="h-4 w-4" />
              {snap ? "Snap to grid" : "Free placement"}
            </button>
          </div>
          <div className="grid grid-cols-[64px_minmax(0,1fr)] border-y border-[#dbe6fb]">
            <FreePointToolRail />
            <FreePointCanvas
              x={x}
              y={y}
              pointSize={pointSize}
              snap={snap}
              dragging={dragging}
              setDragging={setDragging}
              updateCoordinates={updateCoordinates}
            />
          </div>
          <div className="p-3">
            <p className="text-xs font-black text-[#152348]">
              <RotateCcw className="mr-2 inline h-4 w-4" />
              Undo history
            </p>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-[#52627e]">
              {["Start", "Add P", "Move P", "Move P", "Move P"].map(
                (label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <i
                      className={
                        index === 1
                          ? "grid h-7 w-7 place-items-center rounded-full border border-blue-300 bg-blue-50 not-italic text-blue-600"
                          : "grid h-7 w-7 place-items-center rounded-full border border-[#dbe6fb] bg-white not-italic"
                      }
                    >
                      {index ? "●" : "○"}
                    </i>
                    {label}
                    {index < 4 ? <b className="text-cyan-500">→</b> : null}
                  </span>
                ),
              )}
            </div>
          </div>
        </main>

        <aside className="space-y-3">
          <section className="rounded-xl border border-[#dbe6fb] bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#152348]">
                Point Properties
              </h2>
              <ChevronDown className="h-4 w-4" />
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs font-black">
              <span className="h-3 w-3 rounded-full bg-blue-600" />P{" "}
              <span className="font-medium text-[#52627e]">Free Point</span>
            </p>
            <p className="mt-3 text-[10px] font-black text-[#152348]">
              Coordinates
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <NumericControl
                compact
                label="x"
                value={x}
                onChange={(value) => updateCoordinates(value, y)}
              />
              <NumericControl
                compact
                label="y"
                value={y}
                onChange={(value) => updateCoordinates(x, value)}
              />
            </div>
            <label className="mt-2 block text-[10px] font-black">
              Label
              <input
                className="mt-1.5 h-8 w-full rounded-lg border border-[#dbe6fb] px-3 text-xs font-bold"
                value="P"
                readOnly
              />
            </label>
            <p className="mt-2 text-[10px] font-black">Appearance</p>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button className="h-8 rounded-lg border border-[#dbe6fb] bg-white text-left text-[10px] font-bold">
                <span className="mx-2 inline-block h-4 w-4 rounded bg-blue-600 align-middle" />
                Blue
              </button>
              <button className="h-8 rounded-lg border border-[#dbe6fb] bg-white text-[10px] font-bold">
                ━━ Solid
              </button>
            </div>
            <p className="mt-2 text-[10px] font-black">Point size</p>
            <div className="mt-1.5 inline-grid grid-cols-3 overflow-hidden rounded-lg border border-[#dbe6fb]">
              <button
                className="h-7 w-8"
                onClick={() => setPointSize(Math.max(3, pointSize - 1))}
              >
                −
              </button>
              <span className="grid h-7 w-8 place-items-center border-x border-[#dbe6fb] text-xs font-black">
                {pointSize}
              </span>
              <button
                className="h-7 w-8"
                onClick={() => setPointSize(Math.min(10, pointSize + 1))}
              >
                +
              </button>
            </div>
          </section>
          <section className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-3">
            <h3 className="text-xs font-black text-[#087daa]">
              <Eye className="mr-2 inline h-4 w-4" />
              Observe
            </h3>
            <p className="mt-2 font-serif text-sm italic text-[#152348]">
              P = ({x.toFixed(2)}, {y.toFixed(2)})
            </p>
            <p className="mt-1.5 text-xs font-black text-[#152348]">
              Drag point P.
            </p>
            <p className="mt-1 text-[11px] leading-4 text-[#52627e]">
              Its coordinates change freely on both axes.
            </p>
          </section>
          <section className="rounded-xl border border-[#dbe6fb] bg-white p-3">
            <h3 className="text-xs font-black text-[#152348]">
              Tools &amp; Tips
            </h3>
            <ul className="mt-1.5 space-y-0.5 text-[10px] leading-4 text-[#52627e]">
              <li>
                • Use <b>Point</b> tool to add a free point.
              </li>
              <li>• Drag to move the point anywhere.</li>
              <li>
                • Toggle <b>Snap to grid</b> for precision.
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <FreePointWorkedExample />
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-3 shadow-sm">
          <h2 className="text-sm font-black text-[#087daa]">
            Understand the Rule
          </h2>
          <p className="mt-3 text-[11px] leading-4 text-[#52627e]">
            A <b>free point</b> is defined by any ordered pair of real numbers.
          </p>
          <div className="my-3 rounded-lg border border-[#dbe6fb] bg-[#f8fbff] p-2 text-center font-serif text-lg italic text-[#152348]">
            P = (x, y)
          </div>
          <p className="text-[11px] leading-4 text-[#52627e]">
            There are no constraints between x and y. Both coordinates can be
            any real number.
          </p>
          <div className="mt-3 rounded-lg bg-[#f8fbff] p-2">
            <h3 className="text-xs font-black text-[#087daa]">Key Facts</h3>
            <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-[#52627e]">
              <li className="text-emerald-600">
                ✓{" "}
                <span className="text-[#52627e]">
                  The point is independent of other objects.
                </span>
              </li>
              <li className="text-emerald-600">
                ✓{" "}
                <span className="text-[#52627e]">
                  It can be moved freely on the plane.
                </span>
              </li>
              <li className="text-emerald-600">
                ✓{" "}
                <span className="text-[#52627e]">
                  Its coordinates update continuously.
                </span>
              </li>
            </ul>
          </div>
        </section>
        <section className="rounded-xl border border-violet-300 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-violet-700">
              Try It: Your Turn
            </h2>
            <button className="rounded-md border border-violet-200 px-2 py-1 text-[10px] font-black text-violet-700">
              Practice⌄
            </button>
          </div>
          <p className="mt-4 text-xs text-[#52627e]">
            Add a free point Q and place it at (4, -2).
          </p>
          <div className="mt-5 space-y-3">
            {[
              "Create point Q.",
              "Set Q to (4, -2).",
              "Verify the coordinates.",
            ].map((item) => (
              <label key={item} className="flex gap-2 text-xs text-[#52627e]">
                <input type="checkbox" defaultChecked />
                {item}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onInteraction()}
            className="mt-7 h-11 w-full rounded-lg bg-violet-600 text-xs font-black text-white"
          >
            <CheckCircle2 className="mr-2 inline h-4 w-4" />
            Check Answer
          </button>
          <p className="mt-5 text-[11px] leading-5 text-[#52627e]">
            <b>Need help?</b> Toggle Snap to grid and use the coordinate inputs
            on the right.
          </p>
        </section>
      </div>

      <footer className="grid items-center gap-3 rounded-xl border border-[#dbe6fb] bg-white p-3 md:grid-cols-[1fr_1fr_1fr]">
        <button className="text-left text-xs font-black text-[#152348]">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Previous
          <span className="block pl-6 text-[10px] font-medium text-[#52627e]">
            Dynamic Geometry Intro
          </span>
        </button>
        <div className="text-center text-[10px] text-[#52627e]">
          Lesson 1 of 12
          <div className="mx-auto mt-2 h-2 max-w-64 rounded-full bg-slate-100">
            <span className="block h-2 w-1/12 rounded-full bg-blue-600" />
          </div>
        </div>
        <button className="text-right text-xs font-black text-[#152348]">
          Next <ArrowRight className="ml-2 inline h-4 w-4" />
          <span className="block pr-6 text-[10px] font-medium text-[#52627e]">
            Point on Object
          </span>
        </button>
      </footer>
    </section>
  );
}

function FreePointToolRail() {
  return (
    <div className="border-r border-[#dbe6fb] bg-white">
      {[
        ["Point", <Circle />],
        ["Select", <MousePointer2 />],
        ["Pan", <Hand />],
        ["Zoom", <ZoomIn />],
        ["Delete", <Trash2 />],
      ].map(([label, icon], index) => (
        <button
          key={String(label)}
          type="button"
          className={
            index === 0
              ? "grid h-[62px] w-full place-items-center gap-1 bg-cyan-50 text-[10px] font-black text-[#087daa] ring-1 ring-cyan-200"
              : "grid h-[62px] w-full place-items-center gap-1 text-[10px] font-black text-[#52627e] hover:bg-cyan-50"
          }
        >
          <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}

function FreePointCanvas({
  x,
  y,
  pointSize,
  snap,
  dragging,
  setDragging,
  updateCoordinates,
}: {
  x: number;
  y: number;
  pointSize: number;
  snap: boolean;
  dragging: boolean;
  setDragging: (value: boolean) => void;
  updateCoordinates: (x: number, y: number) => void;
}) {
  const px = 220 + x * 30,
    py = 220 - y * 30;
  return (
    <svg
      viewBox="0 0 440 440"
      className="block h-[442px] w-full bg-white touch-none"
      role="img"
      aria-label="Free point P coordinate plane"
      onPointerMove={(event) => {
        if (!dragging) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const svgX = ((event.clientX - rect.left) * 440) / rect.width;
        const svgY = ((event.clientY - rect.top) * 440) / rect.height;
        updateCoordinates((svgX - 220) / 30, (220 - svgY) / 30);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="free-point-grid"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="#e5edf8"
            strokeDasharray="3 3"
          />
        </pattern>
      </defs>
      <rect width="440" height="440" fill="url(#free-point-grid)" />
      <line
        x1="18"
        y1="220"
        x2="425"
        y2="220"
        stroke="#172033"
        strokeWidth="1.5"
      />
      <line
        x1="220"
        y1="15"
        x2="220"
        y2="425"
        stroke="#172033"
        strokeWidth="1.5"
      />
      <text x="416" y="210" fontSize="12" fontWeight="800">
        x
      </text>
      <text x="230" y="25" fontSize="12" fontWeight="800">
        y
      </text>
      {[-6, -4, -2, 2, 4, 6].map((t) => (
        <text
          key={`fx${t}`}
          x={220 + t * 30}
          y="238"
          textAnchor="middle"
          fontSize="10"
          fill="#52627e"
        >
          {t}
        </text>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((t) => (
        <text
          key={`fy${t}`}
          x="206"
          y={224 - t * 30}
          textAnchor="end"
          fontSize="10"
          fill="#52627e"
        >
          {t}
        </text>
      ))}
      <g
        className="cursor-grab"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
      >
        <circle
          cx={px}
          cy={py}
          r={pointSize + 2}
          fill="#1478e8"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x={px + 14}
          y={py - 14}
          fontSize="18"
          fontWeight="900"
          fill="#1478e8"
        >
          P
        </text>
      </g>
      <foreignObject x="85" y="375" width="270" height="48">
        <div className="flex h-full items-center justify-center gap-3 rounded-lg border border-[#dbe6fb] bg-white/95 text-xs font-black text-[#152348] shadow">
          <span className="h-3 w-3 rounded-full bg-blue-600" />P{" "}
          <span className="rounded border px-2 py-1">x {x.toFixed(2)}</span>
          <span className="rounded border px-2 py-1">y {y.toFixed(2)}</span>
          <span>{snap ? "▣" : "□"}</span>
        </div>
      </foreignObject>
    </svg>
  );
}

function FreePointWorkedExample() {
  return (
    <section className="rounded-xl border border-[#dbe6fb] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-[#087daa]">Worked Example</h2>
        <button className="text-[10px] font-black text-blue-600">Hide⌃</button>
      </div>
      <p className="mt-4 text-xs text-[#52627e]">
        Construct a free point at (-3, 4).
      </p>
      <ol className="mt-4 space-y-2 text-[11px] text-[#52627e]">
        <li>
          <b className="mr-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-white">
            1
          </b>
          Choose the <b>Point</b> tool.
        </li>
        <li>
          <b className="mr-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-white">
            2
          </b>
          Click on (-3, 4) on the plane.
        </li>
        <li>
          <b className="mr-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-white">
            3
          </b>
          A point P appears at (-3, 4).
        </li>
      </ol>
      <svg viewBox="0 0 260 170" className="mt-3 w-full">
        <defs>
          <pattern
            id="worked-free-grid"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M22 0H0V22"
              fill="none"
              stroke="#e5edf8"
              strokeDasharray="3 3"
            />
          </pattern>
        </defs>
        <rect width="260" height="170" fill="url(#worked-free-grid)" />
        <line x1="130" y1="12" x2="130" y2="158" stroke="#172033" />
        <line x1="15" y1="85" x2="245" y2="85" stroke="#172033" />
        <circle cx="64" cy="41" r="5" fill="#1478e8" />
        <text x="71" y="36" fontSize="10" fill="#1478e8">
          P(-3, 4)
        </text>
      </svg>
    </section>
  );
}

function PointOnObjectTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [slope, setSlope] = useState(0.5);
  const [intercept, setIntercept] = useState(0);
  const [pointX, setPointX] = useState(2);
  const [pointY, setPointY] = useState(1);
  const [freeMode, setFreeMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [practiceX, setPracticeX] = useState("");
  const [practiceY, setPracticeY] = useState("");
  const [practiceResult, setPracticeResult] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [activeTab, setActiveTab] = useState("Explore");

  useEffect(() => {
    setSlope(0.5);
    setIntercept(0);
    setPointX(2);
    setPointY(1);
    setFreeMode(false);
    setDragging(false);
    setPracticeX("");
    setPracticeY("");
    setPracticeResult("idle");
    setActiveTab("Explore");
  }, [resetToken]);

  const changeLine = (m: number, b: number) => {
    setSlope(m);
    setIntercept(b);
    if (!freeMode) setPointY(Number((m * pointX + b).toFixed(2)));
    onInteraction();
  };
  const movePoint = (x: number, y?: number) => {
    const nextX = Math.max(-5.5, Math.min(5.5, Math.round(x * 4) / 4));
    setPointX(nextX);
    setPointY(
      freeMode && y !== undefined
        ? Math.max(-5, Math.min(5, Math.round(y * 4) / 4))
        : Number((slope * nextX + intercept).toFixed(2)),
    );
    onInteraction();
  };
  const resetPractice = () => {
    setPracticeX("");
    setPracticeY("");
    setPracticeResult("idle");
    onInteraction();
  };
  const checkPractice = () => {
    setPracticeResult(
      Number(practiceX) === 4 && Math.abs(Number(practiceY) - -1) < 0.01
        ? "correct"
        : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="space-y-2"
      data-testid="dynamic-geometry-mockup-0256"
      data-direct-interaction="true"
    >
      <header className="px-1 pb-1 pt-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex gap-2">
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase text-cyan-700">
                Geometry
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-[#52627e]">
                Dynamic Geometry Construction
              </span>
            </div>
            <h1 className="mt-3 text-[32px] font-black leading-none text-[#142044]">
              Point on Object{" "}
              <Star className="ml-2 inline h-5 w-5 text-slate-400" />
            </h1>
            <p className="mt-3 text-sm font-medium text-[#52627e]">
              Create constrained points. A point stays on its object.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black text-[#263452]">
              <span className="rounded-full border border-[#dbe6fb] bg-white px-3 py-2">
                Foundational-Advanced
              </span>
              <span className="rounded-full border border-[#dbe6fb] bg-white px-3 py-2">
                Construction Studio
              </span>
              <span className="rounded-full border border-[#dbe6fb] bg-white px-3 py-2">
                Geometry Tools
              </span>
              <span className="rounded-full border border-[#dbe6fb] bg-white px-3 py-2">
                <Clock3 className="mr-1 inline h-3 w-3" />
                6-10 min
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onInteraction()}
            className="mt-20 inline-flex h-11 items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 text-xs font-black text-blue-700 shadow-sm"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          {[
            [Eye, "Observe", "See a point constrained on a line or circle."],
            [Hand, "Manipulate", "Drag the point. It stays on the object."],
            [Focus, "Notice", "Distance/relationship updates in real time."],
            [
              Lightbulb,
              "Understand",
              "The constraint keeps the point on the object.",
            ],
            [Target, "Try", "Solve a task on your own."],
          ].map(([Icon, title, body], index) => (
            <div
              key={String(title)}
              className="flex min-h-[68px] items-start gap-2 rounded-xl border border-[#dbe6fb] bg-white p-2"
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${index === 3 ? "text-amber-500" : index === 4 ? "text-rose-500" : "text-blue-500"}`}
              />
              <div>
                <p className="text-[11px] font-black text-[#142044]">
                  {title as string}
                </p>
                <p className="mt-1 text-[8px] leading-3 text-[#52627e]">
                  {body as string}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      <nav
        className="grid rounded-xl border border-[#dbe6fb] bg-white p-1 shadow-sm sm:grid-cols-5"
        aria-label="Point on Object lesson tabs"
      >
        {["Explore", "Construct", "Formula", "Example", "Practice"].map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                onInteraction();
              }}
              className={
                activeTab === tab
                  ? "h-11 rounded-lg bg-blue-600 text-xs font-black text-white shadow"
                  : "h-11 rounded-lg text-xs font-black text-[#263452] hover:bg-blue-50"
              }
            >
              {tab}
            </button>
          ),
        )}
      </nav>

      <section className="rounded-xl border border-[#dbe6fb] bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black text-[#142044]">
            1. Explore: Point on a Line
          </h2>
          <div className="flex items-center gap-2 text-xs font-black">
            <span>Object</span>
            <button
              className="grid h-9 w-9 place-items-center rounded-lg border-2 border-blue-500 text-blue-600"
              aria-label="Line object"
            >
              <PenTool className="h-4 w-4" />
            </button>
            <button
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#dbe6fb]"
              aria-label="Circle object"
            >
              <Circle className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !freeMode;
                setFreeMode(next);
                if (!next)
                  setPointY(Number((slope * pointX + intercept).toFixed(2)));
                onInteraction();
              }}
              className={`ml-10 h-6 w-10 rounded-full p-1 ${freeMode ? "bg-blue-600" : "bg-slate-300"}`}
              aria-label="Free point mode"
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition ${freeMode ? "translate-x-4" : ""}`}
              />
            </button>
            <span>Free point mode</span>
          </div>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px]">
          <div className="overflow-hidden rounded-xl border border-[#dbe6fb]">
            <PointOnObjectGraph
              slope={slope}
              intercept={intercept}
              pointX={pointX}
              pointY={pointY}
              freeMode={freeMode}
              dragging={dragging}
              setDragging={setDragging}
              movePoint={movePoint}
            />
            <div className="flex flex-wrap items-center justify-center gap-5 border-t border-[#dbe6fb] px-3 py-2 text-[10px] font-semibold text-[#52627e]">
              <span>
                <i className="mr-2 inline-block h-0.5 w-6 bg-blue-600" />
                Constrained object (line ℓ)
              </span>
              <span>
                <i className="mr-2 inline-block h-3 w-3 rounded-full bg-blue-600" />
                Point P
              </span>
              <span>
                <i className="mr-2 inline-block w-6 border-t border-dashed border-slate-500" />
                Drag path of P
              </span>
            </div>
            <p className="border-t border-[#dbe6fb] px-3 py-2 text-[10px] text-indigo-600">
              <Info className="mr-2 inline h-3.5 w-3.5" />
              Drag point P along the line. The coordinates update, and P stays
              on ℓ.
            </p>
          </div>
          <aside className="rounded-xl border border-[#dbe6fb] bg-white p-4">
            <p className="text-xs font-black text-[#142044]">
              Point P <span className="font-medium">(on line ℓ)</span>
            </p>
            <p className="mt-2 text-xl font-black text-blue-600">
              ({pointX.toFixed(2)}, {pointY.toFixed(2)})
            </p>
            <hr className="my-4 border-[#dbe6fb]" />
            <p className="text-xs font-black">
              Line ℓ:{" "}
              <span className="font-serif text-base italic">
                y = {slope.toFixed(2)}x {intercept < 0 ? "−" : "+"}{" "}
                {Math.abs(intercept).toFixed(2)}
              </span>
              <Pencil className="float-right h-4 w-4" />
            </p>
            <label className="mt-4 block text-[10px] font-black">
              Slope (m)
              <span className="mt-1 flex justify-between font-medium text-[#52627e]">
                <i>-5</i>
                <i>5</i>
              </span>
              <input
                aria-label="Slope m"
                type="range"
                min="-5"
                max="5"
                step="0.25"
                value={slope}
                onChange={(e) => changeLine(Number(e.target.value), intercept)}
                className="w-full accent-blue-600"
              />
              <span className="block text-right text-xs">
                {slope.toFixed(2)}
              </span>
            </label>
            <label className="mt-3 block text-[10px] font-black">
              y-intercept (b)
              <span className="mt-1 flex justify-between font-medium text-[#52627e]">
                <i>-5</i>
                <i>5</i>
              </span>
              <input
                aria-label="y-intercept b"
                type="range"
                min="-5"
                max="5"
                step="0.25"
                value={intercept}
                onChange={(e) => changeLine(slope, Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="block text-right text-xs">
                {intercept.toFixed(2)}
              </span>
            </label>
          </aside>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-3">
          <h2 className="text-xs font-black text-violet-700">
            <Eye className="mr-2 inline h-4 w-4" />
            Observation
          </h2>
          <p className="mt-2 font-serif text-sm italic">P is always on ℓ.</p>
          <p className="mt-1.5 text-[11px]">Check the relationship:</p>
          <p className="mt-2 text-center font-serif text-sm italic">
            y − ({slope.toFixed(2)})x − ({intercept.toFixed(2)}) ={" "}
            {(pointY - slope * pointX - intercept).toFixed(2)}{" "}
            <span className="ml-2 rounded-lg bg-emerald-100 px-2 py-1 text-emerald-700">
              ≈ 0
            </span>
          </p>
        </section>
        <section className="rounded-xl border border-blue-200 bg-blue-50/40 p-3">
          <h2 className="text-xs font-black text-blue-700">
            <Lightbulb className="mr-2 inline h-4 w-4" />
            Key Idea
          </h2>
          <p className="mt-2 text-[11px] leading-4">
            A constrained point satisfies the equation of its object.
          </p>
          <p className="my-1.5 rounded-lg border border-blue-300 bg-white p-1.5 text-center font-serif text-base italic">
            y = mx + b
          </p>
          <p className="text-[9px] leading-3">
            P always has coordinates (x, y) that make the equation true.
          </p>
        </section>
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/35 p-3">
          <h2 className="text-xs font-black text-emerald-800">
            <BookOpen className="mr-2 inline h-4 w-4" />
            Definition
          </h2>
          <h3 className="mt-2 text-sm font-black">Point on Object</h3>
          <p className="mt-1.5 text-[11px] leading-4 text-[#52627e]">
            A point is constrained to an object (line, circle, segment, etc.) if
            it remains on that object when dragged or constructed.
          </p>
        </section>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <PointOnCircleExample />
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-3">
          <h2 className="text-sm font-black text-blue-800">
            3. Construction Steps (Line)
          </h2>
          <div className="mt-2 grid grid-cols-[1fr_170px] items-center gap-3">
            <ol className="space-y-2 text-[10px] text-[#52627e]">
              {[
                "Draw line ℓ.",
                "Select the Point Tool.",
                "Click on ℓ. Point P is created on ℓ.",
                "Drag P. It stays on ℓ.",
              ].map((s, i) => (
                <li key={s}>
                  <b className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white">
                    {i + 1}
                  </b>
                  {s}
                </li>
              ))}
            </ol>
            <svg
              viewBox="0 0 210 105"
              role="img"
              aria-label="Point on line construction steps"
            >
              <line
                x1="10"
                y1="105"
                x2="200"
                y2="20"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <circle cx="115" cy="58" r="6" fill="#2563eb" />
              <text x="110" y="43" fill="#2563eb" fontWeight="800">
                P
              </text>
              <text x="196" y="17" fontStyle="italic">
                ℓ
              </text>
              <MousePointer2 x="116" y="60" width="24" height="24" />
            </svg>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-[#dbe6fb] bg-white p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-[#142044]">
            4. Try It: Your Turn
          </h2>
          <button
            type="button"
            onClick={resetPractice}
            className="inline-flex h-7 items-center gap-2 rounded-lg border border-blue-200 px-3 text-[10px] font-black text-blue-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <div className="mt-2 grid items-end gap-3 lg:grid-cols-[1fr_100px_300px]">
          <div>
            <p className="text-xs text-[#52627e]">
              A line ℓ has equation y = −0.75x + 2. A point P is on ℓ.
            </p>
            <p className="mt-2 text-xs font-semibold">
              Drag P to x = 4 and read the coordinates. Then check the equation.
            </p>
          </div>
          <div className="rounded-lg border border-[#dbe6fb] p-2 text-center text-xs">
            <p className="text-[9px] font-black text-[#52627e]">Target</p>
            <b>x = 4.00</b>
          </div>
          <div
            className={`rounded-lg border p-2 ${practiceResult === "correct" ? "border-emerald-300 bg-emerald-50" : practiceResult === "incorrect" ? "border-rose-300 bg-rose-50" : "border-[#dbe6fb]"}`}
          >
            <p className="text-[9px] font-black text-emerald-600">
              Your answer
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm font-black">
              P ({" "}
              <input
                aria-label="Practice x coordinate"
                value={practiceX}
                onChange={(e) => setPracticeX(e.target.value)}
                className="h-9 w-16 rounded-lg border border-[#dbe6fb] text-center"
              />
              ,{" "}
              <input
                aria-label="Practice y coordinate"
                value={practiceY}
                onChange={(e) => setPracticeY(e.target.value)}
                className="h-9 w-16 rounded-lg border border-[#dbe6fb] text-center"
              />{" "}
              ){" "}
              <button
                type="button"
                onClick={checkPractice}
                className="ml-auto h-9 rounded-lg bg-blue-50 px-5 text-[10px] font-black text-blue-600"
              >
                Check
              </button>
            </div>
          </div>
        </div>
        {practiceResult !== "idle" ? (
          <p
            className={`mt-2 text-xs font-black ${practiceResult === "correct" ? "text-emerald-600" : "text-rose-600"}`}
          >
            {practiceResult === "correct"
              ? "Correct. P = (4, -1) lies on the line."
              : "Check y = -0.75(4) + 2."}
          </p>
        ) : null}
      </section>

      <footer className="grid items-center gap-3 rounded-xl border border-[#dbe6fb] bg-white p-2 md:grid-cols-2">
        <button className="text-left text-xs font-black text-blue-700">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Previous
          <span className="block pl-6 text-[10px] font-medium text-[#52627e]">
            Free Point
          </span>
        </button>
        <button className="text-right text-xs font-black text-blue-700">
          Next <ArrowRight className="ml-2 inline h-4 w-4" />
          <span className="block pr-6 text-[10px] font-medium text-[#52627e]">
            {lesson.id === 199 ? "Intersection Point" : "Next lesson"}
          </span>
        </button>
      </footer>
    </section>
  );
}

function PointOnObjectGraph({
  slope,
  intercept,
  pointX,
  pointY,
  freeMode,
  dragging,
  setDragging,
  movePoint,
}: {
  slope: number;
  intercept: number;
  pointX: number;
  pointY: number;
  freeMode: boolean;
  dragging: boolean;
  setDragging: (value: boolean) => void;
  movePoint: (x: number, y?: number) => void;
}) {
  const originX = 300,
    originY = 190,
    scale = 42,
    px = originX + pointX * scale,
    py = originY - pointY * scale;
  const yFor = (x: number) => slope * x + intercept;
  const start = { x: originX - 5.8 * scale, y: originY - yFor(-5.8) * scale },
    end = { x: originX + 5.8 * scale, y: originY - yFor(5.8) * scale };
  return (
    <svg
      viewBox="0 0 600 380"
      className="block h-[320px] w-full touch-none bg-white"
      role="img"
      aria-label="Point P constrained to line l coordinate plane"
      onPointerMove={(e) => {
        if (!dragging) return;
        const r = e.currentTarget.getBoundingClientRect();
        const sx = ((e.clientX - r.left) * 600) / r.width,
          sy = ((e.clientY - r.top) * 380) / r.height;
        movePoint((sx - originX) / scale, (originY - sy) / scale);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <pattern
          id="point-object-grid"
          width="42"
          height="42"
          patternUnits="userSpaceOnUse"
        >
          <path d="M42 0H0V42" fill="none" stroke="#dfe8f5" />
        </pattern>
      </defs>
      <rect width="600" height="380" fill="url(#point-object-grid)" />
      <line x1="15" y1={originY} x2="585" y2={originY} stroke="#263452" />
      <line x1={originX} y1="12" x2={originX} y2="368" stroke="#263452" />
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((t) => (
        <text
          key={`pox${t}`}
          x={originX + t * scale}
          y={originY + 18}
          textAnchor="middle"
          fontSize="10"
          fill="#52627e"
        >
          {t}
        </text>
      ))}
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((t) => (
        <text
          key={`poy${t}`}
          x={originX - 10}
          y={originY - t * scale + 4}
          textAnchor="end"
          fontSize="10"
          fill="#52627e"
        >
          {t}
        </text>
      ))}
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#2563eb"
        strokeWidth="2.5"
      />
      <text x={end.x - 6} y={end.y - 8} fontSize="16" fontStyle="italic">
        ℓ
      </text>
      <line
        x1={px - 45}
        y1={
          freeMode ? originY - (slope * (pointX - 1) + intercept) * scale : py
        }
        x2={px + 45}
        y2={
          freeMode ? originY - (slope * (pointX + 1) + intercept) * scale : py
        }
        stroke="#64748b"
        strokeDasharray="5 5"
      />
      <g
        className="cursor-grab"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
        }}
      >
        <circle cx={px} cy={py} r="8" fill="#2563eb" />
        <text
          x={px - 6}
          y={py - 18}
          fill="#2563eb"
          fontSize="17"
          fontWeight="900"
        >
          P
        </text>
      </g>
      <text x="580" y={originY - 8} fontWeight="800">
        x
      </text>
      <text x={originX + 8} y="18" fontWeight="800">
        y
      </text>
    </svg>
  );
}

function PointOnCircleExample() {
  return (
    <section className="rounded-xl border border-[#dbe6fb] bg-white p-3">
      <h2 className="text-sm font-black text-blue-800">
        2. Example: Point on a Circle
      </h2>
      <div className="mt-1 grid grid-cols-[150px_1fr] items-center gap-3">
        <svg
          viewBox="0 0 180 140"
          role="img"
          aria-label="Point P constrained to a circle"
        >
          <line x1="15" y1="78" x2="165" y2="78" stroke="#52627e" />
          <line x1="90" y1="10" x2="90" y2="140" stroke="#52627e" />
          <circle
            cx="90"
            cy="78"
            r="52"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <line x1="90" y1="78" x2="126" y2="40" stroke="#94a3b8" />
          <circle cx="126" cy="40" r="6" fill="#2563eb" />
          <text x="135" y="35" fontWeight="800">
            P
          </text>
          <text x="79" y="92">
            O
          </text>
        </svg>
        <div className="text-xs leading-5">
          <p>
            <b>Circle:</b>{" "}
            <span className="font-serif text-base italic">x² + y² = 16</span>
          </p>
          <p>(Center O(0, 0), r = 4)</p>
          <p className="my-2 rounded-lg border border-blue-200 bg-blue-50 p-2 text-center font-serif text-base italic text-blue-700">
            P (2.83, 2.83)
          </p>
          <p>
            <b>Check:</b> x² + y² = 16.00{" "}
            <span className="ml-2 rounded bg-emerald-100 px-2 py-1 text-emerald-700">
              ≈ 16
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function IntersectionPointTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [m1, setM1] = useState(1);
  const [c1, setC1] = useState(2);
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(2);
  const [answerX, setAnswerX] = useState("");
  const [answerY, setAnswerY] = useState("");
  const [answerState, setAnswerState] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [activeTab, setActiveTab] = useState("1 Observe & Manipulate");

  useEffect(() => {
    setM1(1);
    setC1(2);
    setM2(-1);
    setC2(2);
    setAnswerX("");
    setAnswerY("");
    setAnswerState("idle");
    setActiveTab("1 Observe & Manipulate");
  }, [resetToken]);

  const denominator = m1 - m2;
  const relation =
    Math.abs(denominator) < 0.001
      ? Math.abs(c1 - c2) < 0.001
        ? "Coincident"
        : "Parallel"
      : "Intersecting";
  const ix = relation === "Intersecting" ? (c2 - c1) / denominator : 0;
  const iy = relation === "Intersecting" ? m1 * ix + c1 : 0;
  const setLine = (setter: (value: number) => void, value: number) => {
    setter(value);
    onInteraction();
  };
  const reset = () => {
    setM1(1);
    setC1(2);
    setM2(-1);
    setC2(2);
    onInteraction();
  };
  const check = () => {
    setAnswerState(
      Number(answerX) === 1 && Number(answerY) === 1 ? "correct" : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="-mt-[7px] space-y-[10px]"
      data-testid="dynamic-geometry-mockup-0257"
      data-direct-interaction="true"
    >
      <header className="h-[149px] overflow-hidden rounded-xl border border-[#dbe6fb] bg-white p-3 shadow-sm">
        <div className="grid items-center gap-4 lg:grid-cols-[1fr_140px]">
          <div>
            <div className="flex gap-2">
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase text-cyan-700">
                Geometry
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase text-[#52627e]">
                Coordinate Geometry
              </span>
            </div>
            <h1 className="mt-3 text-[30px] font-black leading-none text-[#142044]">
              Intersection Point <BookOpen className="ml-2 inline h-4 w-4" />
            </h1>
            <p className="mt-3 text-sm text-[#52627e]">
              Find the point where two lines meet.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black">
              <span className="rounded-lg border border-[#dbe6fb] px-3 py-2">
                Concept
              </span>
              <span className="rounded-lg border border-[#dbe6fb] px-3 py-2">
                Coordinate plane
              </span>
              <span className="rounded-lg border border-[#dbe6fb] px-3 py-2">
                Class 9-10
              </span>
              <span className="rounded-lg border border-[#dbe6fb] px-3 py-2">
                ~6-10 min
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-[#dbe6fb] p-3 text-[10px] text-[#52627e]">
            <p>0% complete</p>
            <span className="my-2 block h-2 rounded-full bg-slate-200" />
            <p>0 / 5 activities</p>
          </div>
        </div>
      </header>
      <nav className="grid h-[43px] rounded-xl border border-[#dbe6fb] bg-white p-1 shadow-sm sm:grid-cols-5">
        {["1 Observe & Manipulate", "Pattern", "Rule", "Try", "Summary"].map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                onInteraction();
              }}
              className={
                activeTab === tab
                  ? "h-[33px] rounded-lg bg-cyan-600 text-[10px] font-black text-white"
                  : "h-[33px] rounded-lg text-[10px] font-black text-[#263452] hover:bg-cyan-50"
              }
            >
              {tab}
            </button>
          ),
        )}
      </nav>

      <section className="grid h-[408px] overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm lg:grid-cols-[150px_minmax(0,1fr)_160px]">
        <aside className="border-r border-[#dbe6fb] p-3">
          <IntersectionLineControls
            color="cyan"
            title="Line 1"
            m={m1}
            c={c1}
            setM={(v) => setLine(setM1, v)}
            setC={(v) => setLine(setC1, v)}
          />
          <div className="my-3 h-3 w-3 rounded-full bg-cyan-500 shadow" />
          <IntersectionLineControls
            color="violet"
            title="Line 2"
            m={m2}
            c={c2}
            setM={(v) => setLine(setM2, v)}
            setC={(v) => setLine(setC2, v)}
          />
          <button
            type="button"
            onClick={reset}
            className="mt-3 inline-flex h-8 items-center gap-2 rounded-lg border border-[#dbe6fb] px-3 text-[10px] font-black"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </aside>
        <div className="relative">
          <div className="absolute left-3 top-3 z-10 flex gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-600 text-white">
              <MousePointer2 className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border bg-white">
              <Hand className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border bg-white">
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
          <IntersectionGraph
            m1={m1}
            c1={c1}
            m2={m2}
            c2={c2}
            ix={ix}
            iy={iy}
            relation={relation}
          />
        </div>
        <aside className="m-3 rounded-xl border border-[#dbe6fb] p-3">
          <h2 className="text-xs font-black text-cyan-700">Observation</h2>
          <span
            className={`mt-3 inline-block rounded-lg px-3 py-1 text-[10px] font-black ${relation === "Intersecting" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
          >
            {relation}
          </span>
          <p className="mt-3 text-[10px] text-[#52627e]">Lines meet at</p>
          <p className="mt-1 text-xl font-black text-[#142044]">
            ({ix.toFixed(0)}, {iy.toFixed(0)})
          </p>
          <hr className="my-3 border-[#dbe6fb]" />
          <p className="text-[10px] font-black">
            Line 1{" "}
            <i className="float-right mt-1 inline-block h-0.5 w-9 bg-cyan-500" />
          </p>
          <p className="mt-1 font-serif text-xs italic">
            y = {m1}x + {c1}
          </p>
          <p className="mt-3 text-[10px] font-black">
            Line 2{" "}
            <i className="float-right mt-1 inline-block h-0.5 w-9 bg-violet-500" />
          </p>
          <p className="mt-1 font-serif text-xs italic">
            y = {m2}x + {c2}
          </p>
          <hr className="my-3 border-[#dbe6fb]" />
          <p className="text-[10px] leading-5 text-[#52627e]">
            Δx = 0 &nbsp;&nbsp; Δy = 0<br />
            Distance = 0
          </p>
          <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-[10px] font-black text-emerald-700">
            Status
            <br />
            <span className="text-xs">
              {relation === "Intersecting" ? "Unique intersection" : relation}
            </span>
          </p>
        </aside>
      </section>

      <div className="grid h-[299px] gap-2 overflow-hidden lg:grid-cols-[0.78fr_1.22fr]">
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-3">
          <h2 className="text-sm font-black text-blue-800">
            Construction{" "}
            <span className="font-medium text-[#52627e]">(drag or adjust)</span>
          </h2>
          <ol className="mt-3 space-y-4 text-[10px] leading-4 text-[#52627e]">
            {[
              [
                "Drag blue or purple endpoints",
                "Move any endpoint to change a line.",
              ],
              ["Watch the intersection", "The intersection updates instantly."],
              ["Try special cases", "Make lines parallel or coincident."],
            ].map(([a, b], i) => (
              <li key={a} className="flex gap-2">
                <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-600 text-white">
                  {i + 1}
                </b>
                <span>
                  <strong className="text-[#142044]">{a}</strong>
                  <br />
                  {b}
                </span>
              </li>
            ))}
          </ol>
          <svg viewBox="0 0 250 100" className="mt-2 w-full">
            <line
              x1="35"
              y1="80"
              x2="215"
              y2="35"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            <line
              x1="35"
              y1="25"
              x2="215"
              y2="83"
              stroke="#a855f7"
              strokeWidth="2"
            />
            <circle cx="35" cy="80" r="4" fill="#06b6d4" />
            <circle cx="215" cy="35" r="5" fill="#06b6d4" />
            <circle cx="35" cy="25" r="4" fill="#a855f7" />
            <circle cx="215" cy="83" r="5" fill="#a855f7" />
          </svg>
        </section>
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-4">
          <h2 className="text-sm font-black text-blue-800">
            What do you notice?
          </h2>
          <p className="mt-1 text-[10px] text-[#52627e]">
            Explore and notice the pattern.
          </p>
          <div className="mt-3 space-y-2">
            <IntersectionCaseCard
              index={1}
              title="Intersecting (Unique Solution)"
              formula="m₁ ≠ m₂"
              note="Lines meet at exactly one point."
              type="intersect"
            />
            <IntersectionCaseCard
              index={2}
              title="Parallel (No Solution)"
              formula="m₁ = m₂ and c₁ ≠ c₂"
              note="Lines never meet."
              type="parallel"
            />
            <IntersectionCaseCard
              index={3}
              title="Coincident (Infinite Solutions)"
              formula="m₁ = m₂ and c₁ = c₂"
              note="Lines are the same."
              type="coincident"
            />
          </div>
        </section>
      </div>

      <div className="grid h-[256px] gap-2 overflow-hidden lg:grid-cols-[0.83fr_1.17fr]">
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-4">
          <h2 className="text-sm font-black text-blue-800">
            Understand the rule
          </h2>
          <p className="mt-2 text-[10px] leading-4">
            Intersection of two lines &nbsp; y = m₁x + c₁ &nbsp; and &nbsp; y =
            m₂x + c₂
          </p>
          <p className="mt-2 text-[10px]">
            Set the equations equal and solve for x, then find y.
          </p>
          <p className="my-2 whitespace-nowrap rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-center font-serif text-sm italic">
            x = (c₂ - c₁) / (m₁ - m₂), &nbsp; y = m₁x + c₁
          </p>
          <p className="text-[10px]">
            Valid when m₁ ≠ m₂ (unique intersection).
          </p>
          <div className="mt-2 rounded-lg border border-violet-200 bg-violet-50 p-2 text-[9px] leading-4">
            <b>Tip</b>
            <br />
            If m₁ = m₂ and c₁ ≠ c₂, lines are parallel.
            <br />
            If m₁ = m₂ and c₁ = c₂, lines are coincident.
          </div>
        </section>
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-3">
          <h2 className="text-sm font-black text-blue-800">Example</h2>
          <div className="mt-2 grid grid-cols-[1fr_180px] gap-3">
            <div className="text-[10px] leading-5">
              <p>Find the intersection of y = 2x + 1 and y = -x + 4.</p>
              <p className="mt-1">
                Set equal:
                <br />
                2x + 1 = -x + 4<br />
                <b>3x = 3 &nbsp; ⇒ &nbsp; x = 1</b>
                <br />
                Find y:
                <br />y = 2(1) + 1 = 3
              </p>
              <p className="mt-2 rounded-lg bg-emerald-50 p-2 font-black text-emerald-700">
                Intersection point = (1, 3)
              </p>
            </div>
            <IntersectionMiniGraph />
          </div>
        </section>
      </div>

      <section className="grid h-[150px] gap-2 overflow-hidden rounded-xl border border-[#dbe6fb] bg-white p-3 lg:grid-cols-[140px_1fr_170px_170px]">
        <div>
          <h2 className="text-sm font-black text-blue-800">Try it yourself</h2>
          <p className="mt-2 text-[10px] leading-4 text-[#52627e]">
            Adjust the sliders to find the intersection. Then check your answer.
          </p>
        </div>
        <div className="rounded-lg border border-[#dbe6fb] p-3 text-[10px]">
          <p className="font-black text-cyan-700">Your lines</p>
          <p className="mt-2">Line 1: y = 2x - 1</p>
          <p className="mt-2 text-violet-700">Line 2: y = -3x + 5</p>
          <button className="mt-2 rounded-lg border px-3 py-1">
            Change lines
          </button>
        </div>
        <div
          className={`rounded-lg border p-3 text-[10px] ${answerState === "correct" ? "border-emerald-300 bg-emerald-50" : answerState === "incorrect" ? "border-rose-300 bg-rose-50" : "border-[#dbe6fb]"}`}
        >
          <p className="font-black text-cyan-700">Your answer</p>
          <label className="mt-2 flex items-center gap-2">
            x ={" "}
            <input
              aria-label="Intersection answer x"
              value={answerX}
              onChange={(e) => setAnswerX(e.target.value)}
              className="h-7 w-12 rounded border text-center"
            />
          </label>
          <label className="mt-2 flex items-center gap-2">
            y ={" "}
            <input
              aria-label="Intersection answer y"
              value={answerY}
              onChange={(e) => setAnswerY(e.target.value)}
              className="h-7 w-12 rounded border text-center"
            />
          </label>
          <button
            type="button"
            onClick={check}
            className="mt-2 h-8 w-full rounded-lg bg-cyan-600 font-black text-white"
          >
            Check answer
          </button>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-[10px]">
          <p className="font-black text-violet-700">Hint</p>
          <p className="mt-2">Set equations equal and solve.</p>
          <p className="mt-3 font-black">
            Answer
            <br />
            <span className="text-base">(1, 1)</span>
          </p>
        </div>
      </section>
      <footer className="grid h-[53px] rounded-xl border border-[#dbe6fb] bg-white p-2 md:grid-cols-2">
        <button className="text-left text-xs font-black text-[#142044]">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Previous
          <span className="block pl-6 text-[10px] font-medium text-[#52627e]">
            Point on Object
          </span>
        </button>
        <button className="text-right text-xs font-black text-[#142044]">
          Next
          <ArrowRight className="ml-2 inline h-4 w-4" />
          <span className="block pr-6 text-[10px] font-medium text-[#52627e]">
            Midpoint or Centre
          </span>
        </button>
      </footer>
    </section>
  );
}

function IntersectionLineControls({
  color,
  title,
  m,
  c,
  setM,
  setC,
}: {
  color: "cyan" | "violet";
  title: string;
  m: number;
  c: number;
  setM: (v: number) => void;
  setC: (v: number) => void;
}) {
  const accent = color === "cyan" ? "accent-cyan-600" : "accent-violet-600";
  return (
    <section>
      <h3
        className={`text-xs font-black ${color === "cyan" ? "text-cyan-700" : "text-violet-700"}`}
      >
        <i
          className={`mr-2 inline-block h-0.5 w-6 align-middle ${color === "cyan" ? "bg-cyan-500" : "bg-violet-500"}`}
        />
        {title}
      </h3>
      <p className="ml-8 mt-1 font-serif text-[10px] italic text-[#52627e]">
        y = m{xTitle(title)}x + c{xTitle(title)}
      </p>
      <label className="mt-3 block text-[10px] font-black">
        m = {m}
        <input
          aria-label={`${title} slope`}
          type="range"
          min="-10"
          max="10"
          step="1"
          value={m}
          onChange={(e) => setM(Number(e.target.value))}
          className={`mt-1 w-full ${accent}`}
        />
      </label>
      <label className="mt-2 block text-[10px] font-black">
        c = {c}
        <input
          aria-label={`${title} intercept`}
          type="range"
          min="-10"
          max="10"
          step="1"
          value={c}
          onChange={(e) => setC(Number(e.target.value))}
          className={`mt-1 w-full ${accent}`}
        />
      </label>
    </section>
  );
}
function xTitle(title: string) {
  return title.endsWith("1") ? "₁" : "₂";
}

function IntersectionGraph({
  m1,
  c1,
  m2,
  c2,
  ix,
  iy,
  relation,
}: {
  m1: number;
  c1: number;
  m2: number;
  c2: number;
  ix: number;
  iy: number;
  relation: string;
}) {
  const ox = 250,
    oy = 185,
    s = 16,
    sx = (x: number) => ox + x * s,
    sy = (y: number) => oy - y * s;
  return (
    <svg
      viewBox="0 0 500 370"
      className="block h-[357px] w-full bg-white"
      role="img"
      aria-label="Two lines and their intersection on a coordinate plane"
    >
      <defs>
        <pattern
          id="intersection-grid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path d="M16 0H0V16" fill="none" stroke="#e4edf8" />
        </pattern>
      </defs>
      <rect width="500" height="370" fill="url(#intersection-grid)" />
      <line x1="5" y1={oy} x2="495" y2={oy} stroke="#263452" />
      <line x1={ox} y1="5" x2={ox} y2="365" stroke="#263452" />
      {[-10, -8, -6, -4, -2, 2, 4, 6, 8, 10].map((t) => (
        <text
          key={`ix${t}`}
          x={sx(t)}
          y={oy + 15}
          textAnchor="middle"
          fontSize="9"
        >
          {t}
        </text>
      ))}
      {[-10, -8, -6, -4, -2, 2, 4, 6, 8, 10].map((t) => (
        <text
          key={`iy${t}`}
          x={ox - 8}
          y={sy(t) + 3}
          textAnchor="end"
          fontSize="9"
        >
          {t}
        </text>
      ))}
      <line
        x1={sx(-10)}
        y1={sy(m1 * -10 + c1)}
        x2={sx(10)}
        y2={sy(m1 * 10 + c1)}
        stroke="#06b6d4"
        strokeWidth="2.5"
      />
      <line
        x1={sx(-10)}
        y1={sy(m2 * -10 + c2)}
        x2={sx(10)}
        y2={sy(m2 * 10 + c2)}
        stroke="#a855f7"
        strokeWidth="2.5"
      />
      {relation === "Intersecting" ? (
        <>
          <circle cx={sx(ix)} cy={sy(iy)} r="6" fill="#312e81" />
          <g transform={`translate(${sx(ix) + 18} ${sy(iy) - 42})`}>
            <rect width="85" height="48" rx="6" fill="white" stroke="#93c5fd" />
            <text x="10" y="18" fontSize="10" fontWeight="800">
              Intersection
            </text>
            <text x="10" y="37" fontSize="15" fontWeight="900">
              ({ix.toFixed(0)}, {iy.toFixed(0)})
            </text>
          </g>
        </>
      ) : null}
      <text x="486" y={oy - 8} fontWeight="800">
        x
      </text>
      <text x={ox + 8} y="16" fontWeight="800">
        y
      </text>
    </svg>
  );
}

function IntersectionCaseCard({
  index,
  title,
  formula,
  note,
  type,
}: {
  index: number;
  title: string;
  formula: string;
  note: string;
  type: "intersect" | "parallel" | "coincident";
}) {
  return (
    <article className="grid grid-cols-[26px_1fr_145px] items-center rounded-lg border border-[#dbe6fb] p-2">
      <b
        className={`grid h-5 w-5 place-items-center rounded text-[10px] text-white ${index === 1 ? "bg-cyan-600" : index === 2 ? "bg-violet-600" : "bg-blue-600"}`}
      >
        {index}
      </b>
      <div className="text-[9px] leading-4">
        <p className="font-black text-[#142044]">{title}</p>
        <p className="font-serif italic">{formula}</p>
        <p>{note}</p>
      </div>
      <svg viewBox="0 0 145 50" className="w-full">
        <line
          x1="10"
          y1={type === "parallel" ? 35 : 42}
          x2="135"
          y2={type === "parallel" ? 8 : 8}
          stroke="#06b6d4"
          strokeWidth="2"
        />
        <line
          x1="10"
          y1={type === "parallel" ? 45 : 8}
          x2="135"
          y2={type === "parallel" ? 18 : 42}
          stroke="#a855f7"
          strokeWidth="2"
        />
        {type === "intersect" ? (
          <circle cx="73" cy="25" r="4" fill="#142044" />
        ) : null}
      </svg>
    </article>
  );
}

function IntersectionMiniGraph() {
  return (
    <svg
      viewBox="0 0 180 150"
      className="w-full"
      role="img"
      aria-label="Worked intersection graph"
    >
      <defs>
        <pattern
          id="intersection-mini-grid"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path d="M18 0H0V18" fill="none" stroke="#e4edf8" />
        </pattern>
      </defs>
      <rect width="180" height="150" fill="url(#intersection-mini-grid)" />
      <line x1="90" y1="8" x2="90" y2="142" stroke="#263452" />
      <line x1="8" y1="82" x2="172" y2="82" stroke="#263452" />
      <line
        x1="30"
        y1="135"
        x2="150"
        y2="15"
        stroke="#06b6d4"
        strokeWidth="2"
      />
      <line
        x1="105"
        y1="15"
        x2="160"
        y2="135"
        stroke="#a855f7"
        strokeWidth="2"
      />
      <circle cx="120" cy="48" r="5" fill="#142044" />
    </svg>
  );
}

function MidpointCentreTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState({ x: -4, y: 2 });
  const [b, setB] = useState({ x: 4, y: -1 });
  const [dragging, setDragging] = useState<"A" | "B" | null>(null);
  const [reverse, setReverse] = useState(false);
  const [answerX, setAnswerX] = useState("");
  const [answerY, setAnswerY] = useState("");
  const [answerState, setAnswerState] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };

  useEffect(() => {
    setA({ x: -4, y: 2 });
    setB({ x: 4, y: -1 });
    setDragging(null);
    setReverse(false);
    setAnswerX("");
    setAnswerY("");
    setAnswerState("idle");
  }, [resetToken]);
  const update = (point: "A" | "B", axis: "x" | "y", value: number) => {
    (point === "A" ? setA : setB)((old) => ({ ...old, [axis]: value }));
    onInteraction();
  };
  const move = (point: "A" | "B", x: number, y: number) => {
    const next = {
      x: Math.max(-6, Math.min(6, Math.round(x * 2) / 2)),
      y: Math.max(-6, Math.min(6, Math.round(y * 2) / 2)),
    };
    (point === "A" ? setA : setB)(next);
    onInteraction();
  };
  const reset = () => {
    setA({ x: -4, y: 2 });
    setB({ x: 4, y: -1 });
    onInteraction();
  };
  const toggleReverse = () => {
    setReverse((v) => !v);
    setA(b);
    setB(a);
    onInteraction();
  };
  const check = () => {
    setAnswerState(
      Number(answerX) === -1 && Number(answerY) === 1 ? "correct" : "incorrect",
    );
    onInteraction();
  };

  return (
    <section
      className="mt-[3px] space-y-[14px]"
      data-testid="dynamic-geometry-mockup-0258"
      data-direct-interaction="true"
    >
      <header className="h-[150px] overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm">
        <div className="flex h-[98px] items-center justify-between px-5">
          <div>
            <h1 className="text-[32px] font-black leading-none text-[#142044]">
              Midpoint or Centre
            </h1>
            <p className="mt-3 text-sm text-[#52627e]">
              Find the midpoint (centre) of a line segment using coordinates.
            </p>
          </div>
          <div className="flex gap-2 text-[10px] font-black">
            <span className="rounded-lg border border-violet-200 px-3 py-2 text-violet-700">
              Coordinate Geometry
            </span>
            <span className="rounded-lg border border-[#dbe6fb] px-3 py-2">
              <Clock3 className="mr-1 inline h-3 w-3" />
              6-10 min
            </span>
            <span className="rounded-lg border border-blue-200 px-3 py-2 text-blue-700">
              Construction &amp; Exploration
            </span>
          </div>
        </div>
        <nav className="grid h-[52px] border-t border-[#dbe6fb] sm:grid-cols-5">
          {[
            [Eye, "Observe"],
            [Hand, "Manipulate"],
            [Lightbulb, "Notice"],
            [BookOpen, "Understand"],
            [Pencil, "Try"],
          ].map(([Icon, label], i) => (
            <button
              key={String(label)}
              className={
                i === 0
                  ? "border-b-2 border-blue-500 text-xs font-black text-blue-700"
                  : "text-xs font-black text-[#52627e]"
              }
            >
              <Icon className="mr-2 inline h-4 w-4" />
              {label as string}
            </button>
          ))}
        </nav>
      </header>

      <section className="grid h-[510px] overflow-hidden rounded-xl border border-[#dbe6fb] bg-white p-3 shadow-sm lg:grid-cols-[minmax(0,1fr)_275px]">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#142044]">
                Interactive Model
              </h2>
              <p className="mt-1 text-xs text-[#52627e]">
                Drag the endpoints A and B.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dbe6fb] px-3 text-xs font-black"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          <MidpointGraph
            a={a}
            b={b}
            midpoint={midpoint}
            dragging={dragging}
            setDragging={setDragging}
            move={move}
          />
          <div className="mx-auto -mt-3 flex w-fit gap-6 rounded-lg border border-[#dbe6fb] bg-white px-4 py-2 text-[10px] font-black">
            <span className="text-blue-700">● A (x₁, y₁)</span>
            <span className="text-violet-700">● B (x₂, y₂)</span>
            <span className="text-cyan-700">● M midpoint</span>
          </div>
        </div>
        <aside className="ml-3 space-y-3">
          <section className="rounded-lg border border-[#dbe6fb]">
            <h2 className="bg-blue-50 px-3 py-2 text-sm font-black text-blue-700">
              Endpoints
            </h2>
            <MidpointEndpointRow
              point="A"
              color="blue"
              value={a}
              update={update}
            />
            <MidpointEndpointRow
              point="B"
              color="violet"
              value={b}
              update={update}
            />
          </section>
          <section className="rounded-lg border border-[#dbe6fb]">
            <h2 className="bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-700">
              Midpoint M
            </h2>
            <div className="grid grid-cols-[1fr_100px] items-center gap-2 border-b p-3 text-xs">
              <span className="font-serif italic">xM = (x₁ + x₂) / 2</span>
              <b className="rounded-lg border bg-slate-50 p-2 text-center">
                {midpoint.x}
              </b>
            </div>
            <div className="grid grid-cols-[1fr_100px] items-center gap-2 border-b p-3 text-xs">
              <span className="font-serif italic">yM = (y₁ + y₂) / 2</span>
              <b className="rounded-lg border bg-slate-50 p-2 text-center">
                {midpoint.y}
              </b>
            </div>
            <div className="grid grid-cols-[1fr_100px] items-center gap-2 p-3 text-sm font-black text-cyan-700">
              <span className="font-serif italic">M (xM, yM)</span>
              <b className="rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-center">
                ({midpoint.x}, {midpoint.y})
              </b>
            </div>
          </section>
          <section className="rounded-lg border border-[#dbe6fb] p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black">
                Reverse endpoints challenge{" "}
                <Info className="ml-1 inline h-3.5 w-3.5" />
              </p>
              <button
                type="button"
                onClick={toggleReverse}
                className={`h-6 w-10 rounded-full p-1 ${reverse ? "bg-blue-600" : "bg-slate-300"}`}
                aria-label="Reverse endpoints challenge"
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white ${reverse ? "translate-x-4" : ""}`}
                />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-[#52627e]">
              Swap A and B. Does M change?
            </p>
          </section>
        </aside>
      </section>

      <div className="grid h-[242px] gap-[14px] overflow-hidden lg:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-4">
          <h2 className="text-sm font-black text-violet-700">
            <Lightbulb className="mr-2 inline h-4 w-4" />
            What do you notice?
          </h2>
          <ul className="mt-4 space-y-5 text-xs text-[#52627e]">
            {[
              "M is exactly halfway between A and B.",
              "The distance AM equals MB.",
              "Swapping A and B keeps M the same.",
              "M lies on the segment AB.",
            ].map((t) => (
              <li key={t}>
                <CheckCircle2 className="mr-3 inline h-5 w-5 text-emerald-600" />
                {t}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-[#dbe6fb] bg-white p-4">
          <h2 className="text-sm font-black text-blue-700">
            <BookOpen className="mr-2 inline h-4 w-4" />
            Worked Example
          </h2>
          <div className="mt-3 grid grid-cols-[1fr_220px] gap-4">
            <div className="text-xs leading-6">
              <p>
                Find the midpoint of the segment joining A(-2, 5) and B(6, -3).
              </p>
              <p className="mt-2 font-black">Solution:</p>
              <p className="font-serif text-base italic">
                xM = (-2 + 6) / 2 = 2
              </p>
              <p className="font-serif text-base italic">
                yM = (5 + -3) / 2 = 1
              </p>
              <p className="mt-2 inline-block rounded-lg bg-emerald-50 px-3 py-1 text-emerald-700">
                Midpoint M = (2, 1)
              </p>
            </div>
            <MidpointWorkedGraph />
          </div>
        </section>
      </div>

      <section className="grid h-[160px] overflow-hidden rounded-xl border border-[#dbe6fb] bg-white p-4 lg:grid-cols-[1.05fr_1fr_220px]">
        <div>
          <h2 className="text-sm font-black text-violet-700">
            Key Rule (Midpoint / Centre Formula)
          </h2>
          <p className="mt-3 text-xs leading-5 text-[#52627e]">
            The midpoint (centre) M of the segment joining A(x₁, y₁) and B(x₂,
            y₂) is
          </p>
          <p className="mt-3 w-fit rounded-lg border border-violet-300 bg-violet-50 px-5 py-3 font-serif text-lg italic text-violet-700">
            M = ((x₁+x₂)/2, (y₁+y₂)/2)
          </p>
        </div>
        <ul className="mt-8 space-y-3 text-xs text-[#52627e]">
          <li>• Add the x-coordinates and divide by 2.</li>
          <li>• Add the y-coordinates and divide by 2.</li>
          <li>• Works for any two points in the plane.</li>
        </ul>
        <MidpointRuleDiagram />
      </section>

      <section className="grid h-[142px] overflow-hidden rounded-xl border border-[#dbe6fb] bg-white p-4 lg:grid-cols-[1fr_240px]">
        <div>
          <h2 className="text-sm font-black text-emerald-700">
            <Pencil className="mr-2 inline h-4 w-4" />
            Try It Yourself
          </h2>
          <p className="mt-3 text-xs">
            Find the midpoint of the segment joining A(-5, 4) and B(3, -2).
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs font-black">
            Your answer: ({" "}
            <input
              aria-label="Midpoint answer x"
              value={answerX}
              onChange={(e) => setAnswerX(e.target.value)}
              className="h-9 w-20 rounded-lg border text-center"
            />
            ,{" "}
            <input
              aria-label="Midpoint answer y"
              value={answerY}
              onChange={(e) => setAnswerY(e.target.value)}
              className="h-9 w-20 rounded-lg border text-center"
            />{" "}
            ){" "}
            <button
              type="button"
              onClick={check}
              className="h-9 rounded-lg bg-emerald-600 px-5 text-white"
            >
              Check Answer
            </button>
            <button className="h-9 rounded-lg border border-emerald-300 px-4 text-emerald-700">
              Show Solution
            </button>
            <button className="text-blue-600">New Question</button>
          </div>
          {answerState !== "idle" ? (
            <p
              className={`mt-1 text-[10px] font-black ${answerState === "correct" ? "text-emerald-600" : "text-rose-600"}`}
            >
              {answerState === "correct"
                ? "Correct. The midpoint is (-1, 1)."
                : "Average each coordinate pair."}
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-[10px]">
          <h3 className="font-black text-violet-700">
            <Lightbulb className="mr-2 inline h-4 w-4" />
            Hint
          </h3>
          <p className="mt-3 font-serif text-sm italic">
            Use M ((x₁+x₂)/2, (y₁+y₂)/2).
          </p>
        </div>
      </section>
      <footer className="grid h-[48px] items-center rounded-xl border border-[#dbe6fb] bg-white px-3 md:grid-cols-[1fr_1fr_1fr]">
        <button className="text-left text-xs font-black">
          <ArrowLeft className="mr-2 inline h-4 w-4" />
          Previous
          <span className="block pl-6 text-[9px] font-medium text-[#52627e]">
            Intersection Point
          </span>
        </button>
        <div className="text-center text-[9px] text-[#52627e]">
          ● ○ ○ ○ ○ ○ ○ ○ ○<br />
          <b>Lesson 24 of 60</b>
        </div>
        <button className="text-right text-xs font-black text-blue-700">
          Next <ArrowRight className="ml-2 inline h-4 w-4" />
          <span className="block pr-6 text-[9px] font-medium">
            {lesson.id === 201 ? "Attach / Detach Point" : "Next lesson"}
          </span>
        </button>
      </footer>
    </section>
  );
}

function MidpointEndpointRow({
  point,
  color,
  value,
  update,
}: {
  point: "A" | "B";
  color: "blue" | "violet";
  value: { x: number; y: number };
  update: (p: "A" | "B", axis: "x" | "y", value: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_68px_68px] items-center gap-2 border-t border-[#dbe6fb] p-3">
      <p
        className={`text-xs font-black ${color === "blue" ? "text-blue-700" : "text-violet-700"}`}
      >
        ● &nbsp; {point}{" "}
        <span className="font-serif italic text-[#52627e]">(x, y)</span>
      </p>
      <input
        aria-label={`${point} x coordinate`}
        type="number"
        value={value.x}
        onChange={(e) => update(point, "x", Number(e.target.value))}
        className="h-9 rounded-lg border text-center text-xs font-black"
      />
      <input
        aria-label={`${point} y coordinate`}
        type="number"
        value={value.y}
        onChange={(e) => update(point, "y", Number(e.target.value))}
        className="h-9 rounded-lg border text-center text-xs font-black"
      />
    </div>
  );
}

function MidpointGraph({
  a,
  b,
  midpoint,
  dragging,
  setDragging,
  move,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  midpoint: { x: number; y: number };
  dragging: "A" | "B" | null;
  setDragging: (p: "A" | "B" | null) => void;
  move: (p: "A" | "B", x: number, y: number) => void;
}) {
  const ox = 260,
    oy = 200,
    s = 32,
    sx = (x: number) => ox + x * s,
    sy = (y: number) => oy - y * s;
  return (
    <svg
      viewBox="0 0 520 400"
      className="block h-[400px] w-full touch-none"
      role="img"
      aria-label="Draggable endpoints A and B with midpoint M"
      onPointerMove={(e) => {
        if (!dragging) return;
        const r = e.currentTarget.getBoundingClientRect();
        move(
          dragging,
          (((e.clientX - r.left) * 520) / r.width - ox) / s,
          (oy - ((e.clientY - r.top) * 400) / r.height) / s,
        );
      }}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <defs>
        <pattern
          id="midpoint-grid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M32 0H0V32" fill="none" stroke="#e2eaf6" />
        </pattern>
      </defs>
      <rect width="520" height="400" fill="url(#midpoint-grid)" />
      <line x1="10" y1={oy} x2="510" y2={oy} stroke="#263452" />
      <line x1={ox} y1="10" x2={ox} y2="390" stroke="#263452" />
      <line
        x1={sx(a.x)}
        y1={sy(a.y)}
        x2={sx(b.x)}
        y2={sy(b.y)}
        stroke="#172554"
        strokeWidth="2"
      />
      <g
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging("A");
        }}
        className="cursor-grab"
      >
        <circle cx={sx(a.x)} cy={sy(a.y)} r="8" fill="#1d4ed8" />
        <text x={sx(a.x) - 6} y={sy(a.y) - 16} fill="#1d4ed8" fontWeight="900">
          A
        </text>
        <text x={sx(a.x) - 20} y={sy(a.y) + 30} fontSize="12">
          ({a.x}, {a.y})
        </text>
      </g>
      <g
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging("B");
        }}
        className="cursor-grab"
      >
        <circle cx={sx(b.x)} cy={sy(b.y)} r="8" fill="#7c3aed" />
        <text x={sx(b.x) + 4} y={sy(b.y) - 14} fill="#7c3aed" fontWeight="900">
          B
        </text>
        <text x={sx(b.x) - 18} y={sy(b.y) + 30} fontSize="12">
          ({b.x}, {b.y})
        </text>
      </g>
      <circle cx={sx(midpoint.x)} cy={sy(midpoint.y)} r="8" fill="#06b6d4" />
      <text
        x={sx(midpoint.x) + 10}
        y={sy(midpoint.y) - 10}
        fill="#0891b2"
        fontWeight="900"
      >
        M
      </text>
      <text x={sx(midpoint.x) - 18} y={sy(midpoint.y) + 28} fontSize="12">
        ({midpoint.x}, {midpoint.y})
      </text>
      <text x="500" y={oy - 8} fontWeight="800">
        x
      </text>
      <text x={ox + 8} y="18" fontWeight="800">
        y
      </text>
    </svg>
  );
}

function MidpointWorkedGraph() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="w-full"
      role="img"
      aria-label="Worked midpoint graph"
    >
      <defs>
        <pattern
          id="mid-work-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M20 0H0V20" fill="none" stroke="#e2eaf6" />
        </pattern>
      </defs>
      <rect width="220" height="150" fill="url(#mid-work-grid)" />
      <line x1="110" y1="8" x2="110" y2="142" stroke="#52627e" />
      <line x1="8" y1="75" x2="212" y2="75" stroke="#52627e" />
      <line
        x1="58"
        y1="35"
        x2="185"
        y2="125"
        stroke="#172554"
        strokeWidth="2"
      />
      <circle cx="58" cy="35" r="5" fill="#1d4ed8" />
      <circle cx="185" cy="125" r="5" fill="#7c3aed" />
      <circle cx="122" cy="80" r="5" fill="#06b6d4" />
      <text x="50" y="25" fill="#1d4ed8" fontWeight="800">
        A
      </text>
      <text x="188" y="115" fill="#7c3aed" fontWeight="800">
        B
      </text>
      <text x="126" y="70" fill="#0891b2" fontWeight="800">
        M
      </text>
    </svg>
  );
}
function MidpointRuleDiagram() {
  return (
    <svg
      viewBox="0 0 220 130"
      className="h-[125px] w-full"
      role="img"
      aria-label="Midpoint bisects segment AB"
    >
      <line
        x1="30"
        y1="105"
        x2="190"
        y2="25"
        stroke="#172554"
        strokeWidth="2"
      />
      <circle cx="30" cy="105" r="8" fill="#1d4ed8" />
      <circle cx="190" cy="25" r="8" fill="#7c3aed" />
      <circle cx="110" cy="65" r="8" fill="#06b6d4" />
      <text x="20" y="86" fill="#1d4ed8" fontWeight="800">
        A
      </text>
      <text x="190" y="14" fill="#7c3aed" fontWeight="800">
        B
      </text>
      <text x="103" y="48" fill="#0891b2" fontWeight="800">
        M
      </text>
      <path d="M66 83l5 8m2-12l5 8M145 43l5 8m2-12l5 8" stroke="#172554" />
    </svg>
  );
}

type ConstraintPoint = "P" | "Q";

function AttachDetachPointLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selectedPoint, setSelectedPoint] = useState<ConstraintPoint>("P");
  const [attached, setAttached] = useState<Record<ConstraintPoint, boolean>>({
    P: true,
    Q: false,
  });
  const [grid, setGrid] = useState(true);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");

  const reset = () => {
    setSelectedPoint("P");
    setAttached({ P: true, Q: false });
    setGrid(true);
    onInteraction();
  };

  useEffect(() => {
    setSelectedPoint("P");
    setAttached({ P: true, Q: false });
    setGrid(true);
    setActiveTab("Interaction + visualization");
  }, [resetToken]);

  const setConstraint = (value: boolean) => {
    setAttached((current) => ({ ...current, [selectedPoint]: value }));
    onInteraction();
  };

  return (
    <section
      className="space-y-3"
      data-testid="dynamic-geometry-mockup-0259"
      data-direct-interaction="true"
    >
      <header className="grid gap-5 rounded-xl border border-[#dbe6fb] bg-white px-5 py-2 shadow-sm lg:h-[90px] lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center">
        <div>
          <p className="text-[11px] font-black uppercase text-[#52627e]">
            Dynamic Geometry
          </p>
          <h1 className="mt-1 text-[34px] font-black leading-none text-[#081238]">
            Attach / Detach Point
          </h1>
          <p className="mt-1 text-sm font-medium text-[#53627f]">
            Understand how points attach to objects and follow them - or detach
            and move freely.
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-[#dbe6fb] rounded-xl border border-[#dbe6fb] bg-white">
          <TargetMetric
            icon={<Focus />}
            label="Focus"
            value="Constraints & Transformations"
          />
          <TargetMetric icon={<Clock3 />} label="Duration" value="6-10 min" />
          <TargetMetric
            icon={<BarChart3 />}
            label="Level"
            value="Middle School"
          />
        </div>
      </header>

      <nav
        className="grid overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm sm:grid-cols-5"
        aria-label="Lesson views"
      >
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              onInteraction();
            }}
            className={
              activeTab === tab
                ? "flex min-h-11 items-center justify-center gap-2 bg-[#078ca7] px-3 text-xs font-black text-white"
                : "flex min-h-11 items-center justify-center gap-2 px-3 text-xs font-black text-[#152348] hover:bg-cyan-50"
            }
          >
            {tab === "Interaction + visualization" ? (
              <Focus className="h-4 w-4" />
            ) : tab === "Explain" ? (
              <BookOpen className="h-4 w-4" />
            ) : tab === "Examples" ? (
              <PenTool className="h-4 w-4" />
            ) : tab === "Formulas" ? (
              <Ruler className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {tab}
          </button>
        ))}
      </nav>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_400px]">
        <main className="overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2">
            <div>
              <h2 className="text-lg font-black text-[#152348]">
                Drag directly on the model
              </h2>
              <p className="text-xs font-semibold text-[#53627f]">
                Try attaching point P to the circle, then detaching it.
              </p>
            </div>
            <div className="flex gap-2">
              <TargetToolButton
                icon={<RotateCcw />}
                label="Reset"
                onClick={reset}
              />
              <TargetToolButton
                icon={<Maximize2 />}
                label="Fit view"
                onClick={() => onInteraction()}
              />
              <button
                type="button"
                aria-pressed={grid}
                onClick={() => {
                  setGrid((value) => !value);
                  onInteraction();
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dbe6fb] px-3 text-xs font-black text-[#152348]"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
                <span
                  className={
                    grid
                      ? "relative h-5 w-9 rounded-full bg-[#078ca7]"
                      : "relative h-5 w-9 rounded-full bg-slate-300"
                  }
                >
                  <span
                    className={
                      grid
                        ? "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white"
                        : "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white"
                    }
                  />
                </span>
              </button>
            </div>
          </div>

          <AttachDetachCanvas
            grid={grid}
            attached={attached}
            selectedPoint={selectedPoint}
            onSelect={(point) => {
              setSelectedPoint(point);
              onInteraction();
            }}
          />

          <div className="grid border-t border-[#dbe6fb] bg-[#fbfdff] sm:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-4 px-6 py-7">
              <svg
                viewBox="0 0 112 72"
                className="h-16 w-24 shrink-0"
                aria-hidden="true"
              >
                <ellipse
                  cx="51"
                  cy="38"
                  rx="38"
                  ry="25"
                  fill="none"
                  stroke="#087daa"
                  strokeWidth="2"
                />
                <circle cx="27" cy="22" r="6" fill="#1478e8" />
                <path
                  d="M17 10l8 8"
                  stroke="#1478e8"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </svg>
              <div>
                <strong className="text-xs text-[#087daa]">
                  Attached: follows object
                </strong>
                <p className="mt-1 text-xs leading-5 text-[#52627e]">
                  When attached, point P stays on the circle as the circle
                  moves.
                </p>
              </div>
            </div>
            <div className="grid place-items-center px-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[#dbe6fb] bg-white text-xl text-[#152348]">
                ↔
              </span>
            </div>
            <div className="flex items-center gap-4 px-6 py-7">
              <svg
                viewBox="0 0 112 72"
                className="h-16 w-24 shrink-0"
                aria-hidden="true"
              >
                <ellipse
                  cx="44"
                  cy="42"
                  rx="28"
                  ry="20"
                  fill="none"
                  stroke="#8eb0c9"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
                <circle cx="91" cy="31" r="6" fill="#1478e8" />
                <path
                  d="M59 38l20-5"
                  stroke="#8eb0c9"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </svg>
              <div>
                <strong className="text-xs text-[#dc6f0b]">
                  Detached: moves freely
                </strong>
                <p className="mt-1 text-xs leading-5 text-[#52627e]">
                  When detached, point P moves anywhere on the plane.
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className="rounded-xl border border-[#dbe6fb] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#dbe6fb] pb-3">
            <h2 className="flex items-center gap-3 text-sm font-black text-[#152348]">
              <Circle className="h-5 w-5 text-[#087daa]" />
              Constraint: circle
            </h2>
            <ChevronDown className="h-4 w-4 text-[#52627e]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs font-black text-[#152348]">
            Constraint mode <Info className="h-3.5 w-3.5 text-[#52627e]" />
          </p>
          <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-lg border border-[#dbe6fb]">
            <button
              type="button"
              onClick={() => setConstraint(true)}
              className={
                attached[selectedPoint]
                  ? "flex h-9 items-center justify-center gap-2 bg-[#1478e8] text-xs font-black text-white"
                  : "flex h-9 items-center justify-center gap-2 bg-white text-xs font-black text-[#152348]"
              }
            >
              <Link2 className="h-4 w-4" />
              Attached
            </button>
            <button
              type="button"
              onClick={() => setConstraint(false)}
              className={
                !attached[selectedPoint]
                  ? "flex h-9 items-center justify-center gap-2 bg-orange-50 text-xs font-black text-[#e06e0b]"
                  : "flex h-9 items-center justify-center gap-2 bg-white text-xs font-black text-[#152348]"
              }
            >
              <Unlink className="h-4 w-4" />
              Detached
            </button>
          </div>

          <PointConstraintRow
            point="P"
            color="#1478e8"
            coordinates="2.83, 2.83"
            distance={attached.P ? "0.00" : "1.50"}
            attached={attached.P}
            selected={selectedPoint === "P"}
            onSelect={() => setSelectedPoint("P")}
          />
          <PointConstraintRow
            point="Q"
            color="#e77a12"
            coordinates="4.20, 2.10"
            distance={attached.Q ? "0.00" : "1.50"}
            attached={attached.Q}
            selected={selectedPoint === "Q"}
            onSelect={() => setSelectedPoint("Q")}
          />

          <p className="mt-3 text-xs font-black text-[#152348]">Actions</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setConstraint(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1478e8] px-3 text-xs font-black text-white"
            >
              <Link2 className="h-4 w-4" />
              Attach to circle
            </button>
            <button
              type="button"
              onClick={() => setConstraint(false)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-orange-300 bg-white px-3 text-xs font-black text-[#152348]"
            >
              <Unlink className="h-4 w-4 text-[#e77a12]" />
              Detach point
            </button>
          </div>
          <div className="mt-3 flex gap-3 rounded-lg border border-[#dbe6fb] bg-[#f8fbff] p-3 text-xs font-medium leading-5 text-[#52627e]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#087daa]" />
            <p>
              Attached points are constrained to the object and follow it.
              Detached points have no constraint and can move freely on the
              plane.
            </p>
          </div>
        </aside>
      </div>

      <footer className="grid items-center gap-3 rounded-xl border border-[#dbe6fb] bg-white px-5 py-3 shadow-sm md:grid-cols-[1fr_1fr_1fr]">
        <button type="button" className="flex items-center gap-3 text-left">
          <ArrowLeft className="h-5 w-5" />
          <span>
            <small className="block text-[10px] font-black uppercase text-[#52627e]">
              Previous lesson
            </small>
            <strong className="text-xs text-[#152348]">
              Midpoint or Centre
            </strong>
          </span>
        </button>
        <div className="text-center">
          <p className="text-[11px] font-bold text-[#52627e]">Lesson 3 of 28</p>
          <div className="mt-2 flex justify-center gap-2">
            {Array.from({ length: 14 }, (_, index) => (
              <span
                key={index}
                className={
                  index === 0
                    ? "h-2.5 w-2.5 rounded-full bg-cyan-500"
                    : "h-2.5 w-2.5 rounded-full border border-[#cdd9e9] bg-white"
                }
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="flex items-center justify-end gap-3 text-right"
        >
          <span>
            <small className="block text-[10px] font-black uppercase text-[#52627e]">
              Next lesson
            </small>
            <strong className="text-xs text-[#152348]">
              Line Through Two Points
            </strong>
          </span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </footer>
    </section>
  );
}

function TargetMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-14 items-start gap-3 px-4 py-2 text-[#087daa]">
      <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <span>
        <small className="block text-[10px] font-bold text-[#52627e]">
          {label}
        </small>
        <strong className="mt-1 block text-xs leading-4 text-[#152348]">
          {value}
        </strong>
      </span>
    </div>
  );
}

function TargetToolButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dbe6fb] px-3 text-xs font-black text-[#152348]"
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {label}
    </button>
  );
}

function AttachDetachCanvas({
  grid,
  attached,
  selectedPoint,
  onSelect,
}: {
  grid: boolean;
  attached: Record<ConstraintPoint, boolean>;
  selectedPoint: ConstraintPoint;
  onSelect: (point: ConstraintPoint) => void;
}) {
  const p = attached.P ? { x: 445, y: 80 } : { x: 515, y: 118 };
  const q = attached.Q ? { x: 485, y: 142 } : { x: 620, y: 106 };
  return (
    <svg
      viewBox="0 0 760 375"
      className="block w-full border-y border-[#e1eaf6] bg-white"
      role="img"
      aria-label="Circle with attached point P and detached point Q"
    >
      <defs>
        <pattern
          id="attach-detach-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V28" fill="none" stroke="#eaf0f8" />
        </pattern>
      </defs>
      {grid ? (
        <rect width="760" height="430" fill="url(#attach-detach-grid)" />
      ) : null}
      <line
        x1="52"
        y1="190"
        x2="730"
        y2="190"
        stroke="#26364c"
        strokeWidth="1.5"
      />
      <line
        x1="355"
        y1="18"
        x2="355"
        y2="365"
        stroke="#26364c"
        strokeWidth="1.5"
      />
      <text x="718" y="176" fill="#152348" fontSize="13" fontWeight="800">
        x
      </text>
      <text x="365" y="30" fill="#152348" fontSize="13" fontWeight="800">
        y
      </text>
      {[-4, -2, 0, 2, 4, 6].map((tick) => (
        <text
          key={`x-${tick}`}
          x={355 + tick * 53}
          y="210"
          textAnchor="middle"
          fill="#52627e"
          fontSize="11"
        >
          {tick}
        </text>
      ))}
      {[-4, -2, 2, 4].map((tick) => (
        <text
          key={`y-${tick}`}
          x="337"
          y={190 - tick * 34}
          textAnchor="end"
          fill="#52627e"
          fontSize="11"
        >
          {tick}
        </text>
      ))}
      <ellipse
        cx="355"
        cy="190"
        rx="150"
        ry="135"
        fill="none"
        stroke="#087daa"
        strokeWidth="2.2"
      />
      <circle cx="355" cy="190" r="4" fill="#087daa" />
      <text x="371" y="209" fill="#152348" fontSize="13" fontWeight="800">
        O (0, 0)
      </text>
      <line
        x1={p.x}
        y1={p.y}
        x2={q.x}
        y2={q.y}
        stroke="#3b82f6"
        strokeWidth="1.8"
        strokeDasharray="9 8"
      />
      <g onClick={() => onSelect("P")} className="cursor-pointer">
        <circle
          cx={p.x}
          cy={p.y}
          r={selectedPoint === "P" ? 10 : 8}
          fill="#1478e8"
          stroke="white"
          strokeWidth="3"
        />
        <rect
          x={p.x + 14}
          y={p.y - 35}
          width="86"
          height="30"
          rx="7"
          fill="white"
          stroke="#5fa3ff"
        />
        <text
          x={p.x + 57}
          y={p.y - 16}
          textAnchor="middle"
          fill="#1478e8"
          fontSize="12"
          fontWeight="800"
        >
          P {attached.P ? "attached" : "detached"}
        </text>
      </g>
      <g onClick={() => onSelect("Q")} className="cursor-pointer">
        <circle
          cx={q.x}
          cy={q.y}
          r={selectedPoint === "Q" ? 10 : 8}
          fill="#e77a12"
          stroke="white"
          strokeWidth="3"
        />
        <rect
          x={q.x + 12}
          y={q.y - 34}
          width="92"
          height="30"
          rx="7"
          fill="white"
          stroke="#f3a559"
        />
        <text
          x={q.x + 58}
          y={q.y - 15}
          textAnchor="middle"
          fill="#e77a12"
          fontSize="12"
          fontWeight="800"
        >
          Q {attached.Q ? "attached" : "detached"}
        </text>
      </g>
    </svg>
  );
}

function PointConstraintRow({
  point,
  color,
  coordinates,
  distance,
  attached,
  selected,
  onSelect,
}: {
  point: ConstraintPoint;
  color: string;
  coordinates: string;
  distance: string;
  attached: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const [x, y] = coordinates.split(", ");
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        selected
          ? "mt-2.5 block w-full rounded-lg bg-cyan-50/70 p-1.5 text-left ring-1 ring-cyan-200"
          : "mt-2.5 block w-full rounded-lg p-1.5 text-left hover:bg-slate-50"
      }
    >
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <strong className="text-xs text-[#152348]">Point {point}</strong>
        <span
          className={
            attached
              ? "ml-auto rounded-md border border-cyan-300 bg-cyan-50 px-2 py-0.5 text-[10px] font-black text-[#087daa]"
              : "ml-auto rounded-md border border-orange-300 bg-orange-50 px-2 py-0.5 text-[10px] font-black text-[#e06e0b]"
          }
        >
          {attached ? "Attached" : "Detached"}
        </span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <span className="rounded-md border border-[#dbe6fb] bg-white px-3 py-1.5 text-xs">
          <b className="mr-5">x</b>
          {x}
        </span>
        <span className="rounded-md border border-[#dbe6fb] bg-white px-3 py-1.5 text-xs">
          <b className="mr-5">y</b>
          {y}
        </span>
      </div>
      <div className="mt-1.5 flex justify-between rounded-md border border-[#dbe6fb] bg-white px-3 py-1.5 text-[11px] text-[#52627e]">
        <span>Distance to object</span>
        <strong className="text-[#152348]">{distance}</strong>
        <span className={attached ? "text-emerald-600" : "text-orange-600"}>
          {attached ? "On path" : "Off path"}
        </span>
      </div>
    </button>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#dbe6fb] bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-black uppercase text-[#53627f]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#152348]">{value}</p>
    </div>
  );
}

function ToolRail({ active }: { active: string }) {
  const tools: Array<[string, ReactNode]> = [
    ["Point", <MousePointer2 className="h-4 w-4" />],
    ["Select", <Move className="h-4 w-4" />],
    ["Pan", <Hand className="h-4 w-4" />],
    ["Zoom", <ZoomIn className="h-4 w-4" />],
    ["Delete", <Trash2 className="h-4 w-4" />],
  ];
  return (
    <div className="grid content-start overflow-hidden rounded-xl border border-[#dbe6fb] bg-white shadow-sm">
      {tools.map(([label, icon]) => (
        <button
          key={label}
          type="button"
          className={
            label === active
              ? "grid min-h-16 place-items-center gap-1 bg-cyan-50 text-xs font-black text-[#087b98] ring-1 ring-cyan-300"
              : "grid min-h-16 place-items-center gap-1 text-xs font-black text-[#53627f] hover:bg-cyan-50"
          }
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}

function GeometryCanvas({
  spec,
  x,
  y,
  snap,
}: {
  spec: GeometrySpec;
  x: number;
  y: number;
  snap: boolean;
}) {
  const px = 430 + x * 38;
  const py = 300 - y * 38;
  return (
    <svg
      viewBox="0 0 760 520"
      className="w-full rounded-xl border border-[#dbe6fb] bg-white"
      role="img"
      aria-label={`${spec.title} construction canvas`}
    >
      <defs>
        <pattern
          id={`geometry-grid-${spec.mockupId}`}
          width="38"
          height="38"
          patternUnits="userSpaceOnUse"
        >
          <path d="M38 0H0V38" fill="none" stroke="#e6eefb" />
        </pattern>
      </defs>
      <rect
        width="760"
        height="520"
        fill={`url(#geometry-grid-${spec.mockupId})`}
      />
      <line
        x1="72"
        y1="300"
        x2="720"
        y2="300"
        stroke="#111827"
        strokeWidth="2"
      />
      <line
        x1="430"
        y1="62"
        x2="430"
        y2="485"
        stroke="#111827"
        strokeWidth="2"
      />
      <text x="714" y="286" fontSize="15" fontWeight="900">
        x
      </text>
      <text x="444" y="76" fontSize="15" fontWeight="900">
        y
      </text>
      {renderGeometryShape(spec.tool, px, py)}
      <circle cx={px} cy={py} r="10" fill="#0ea5c9" />
      <text
        x={px + 18}
        y={py - 12}
        fill="#0795bd"
        fontSize="22"
        fontWeight="900"
      >
        P
      </text>
      <foreignObject x="255" y="430" width="250" height="58">
        <div className="flex h-full items-center gap-3 rounded-xl border border-[#dbe6fb] bg-white/95 px-4 text-sm font-black text-[#152348] shadow">
          <span className="h-3 w-3 rounded-full bg-blue-600" />P{" "}
          <span className="rounded-lg border px-3 py-1">x {x.toFixed(2)}</span>
          <span className="rounded-lg border px-3 py-1">y {y.toFixed(2)}</span>
        </div>
      </foreignObject>
      <foreignObject x="652" y="82" width="82" height="70">
        <button className="h-full w-full rounded-xl border border-[#dbe6fb] bg-white/95 text-xs font-black text-[#53627f]">
          {snap ? "Snap\nto grid" : "Free\ndrag"}
        </button>
      </foreignObject>
      <g transform="translate(682 348)">
        <rect width="46" height="116" rx="14" fill="white" stroke="#dbe6fb" />
        <text x="23" y="32" textAnchor="middle" fontSize="24">
          +
        </text>
        <text x="23" y="70" textAnchor="middle" fontSize="24">
          −
        </text>
        <path d="M15 92h16v16H15z" fill="none" stroke="#53627f" />
      </g>
    </svg>
  );
}

function renderGeometryShape(tool: GeometryTool, px: number, py: number) {
  if (tool === "point") return null;
  if (
    tool === "line" ||
    tool === "parallel" ||
    tool === "perpendicular" ||
    tool === "fit" ||
    tool === "relation"
  )
    return (
      <>
        <line
          x1="80"
          y1="360"
          x2="720"
          y2="220"
          stroke="#7c3aed"
          strokeWidth="4"
        />
        {tool === "perpendicular" ? (
          <>
            <line
              x1={px}
              y1="70"
              x2={px}
              y2="470"
              stroke="#0ea5e9"
              strokeWidth="3"
              strokeDasharray="8 7"
            />
            <path
              d={`M${px} 300 h30 v-30`}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="3"
            />
            <text x={px - 38} y="290" fontSize="16" fill="#1e3a8a">
              90°
            </text>
          </>
        ) : null}
        {tool === "parallel" ? (
          <line
            x1="80"
            y1="300"
            x2="720"
            y2="160"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeDasharray="8 7"
          />
        ) : null}
      </>
    );
  if (tool === "segment" || tool === "ray" || tool === "polyline")
    return (
      <>
        <polyline
          points="170,365 330,205 510,285 640,160"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="4"
        />
        <circle cx="170" cy="365" r="8" fill="#2563eb" />
        <circle cx="330" cy="205" r="8" fill="#2563eb" />
        <circle cx="510" cy="285" r="8" fill="#2563eb" />
        {tool === "ray" ? (
          <line
            x1="330"
            y1="205"
            x2="705"
            y2="86"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeDasharray="8 7"
          />
        ) : null}
      </>
    );
  if (tool === "bisector")
    return (
      <>
        <line
          x1="160"
          y1="330"
          x2="620"
          y2="330"
          stroke="#7c3aed"
          strokeWidth="4"
        />
        <line
          x1="390"
          y1="80"
          x2="390"
          y2="480"
          stroke="#0ea5e9"
          strokeWidth="3"
          strokeDasharray="8 7"
        />
        <path
          d="M250 292 C320 250 460 250 530 292"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
        />
      </>
    );
  if (
    tool === "tangent" ||
    tool === "circle" ||
    tool === "arc" ||
    tool === "sector"
  )
    return (
      <>
        <circle
          cx="410"
          cy="260"
          r="128"
          fill={tool === "sector" ? "#cffafe" : "none"}
          stroke="#0ea5c9"
          strokeWidth="4"
        />
        <line
          x1="410"
          y1="260"
          x2="538"
          y2="260"
          stroke="#7c3aed"
          strokeWidth="3"
        />
        {tool === "tangent" ? (
          <line
            x1="538"
            y1="88"
            x2="538"
            y2="432"
            stroke="#7c3aed"
            strokeWidth="4"
          />
        ) : null}
        {tool === "arc" ? (
          <path
            d="M282 260 A128 128 0 0 1 504 162"
            fill="none"
            stroke="#f97316"
            strokeWidth="7"
          />
        ) : null}
        {tool === "sector" ? (
          <line
            x1="410"
            y1="260"
            x2="500"
            y2="168"
            stroke="#7c3aed"
            strokeWidth="3"
          />
        ) : null}
      </>
    );
  if (tool === "triangle" || tool === "polygon")
    return (
      <>
        <polygon
          points={
            tool === "triangle"
              ? "250,360 560,350 410,126"
              : "210,320 300,160 470,150 600,300 425,400"
          }
          fill="#dffafe"
          stroke="#0ea5c9"
          strokeWidth="4"
        />
        <path
          d="M250 360 L410 126 L560 350"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="2"
          strokeDasharray="8 7"
        />
      </>
    );
  if (tool === "conic")
    return (
      <>
        <ellipse
          cx="410"
          cy="260"
          rx="190"
          ry="106"
          fill="none"
          stroke="#0ea5c9"
          strokeWidth="4"
        />
        <path
          d="M255 420 C380 70 485 70 620 420"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeDasharray="8 7"
        />
        {[
          [250, 260],
          [330, 165],
          [430, 154],
          [528, 202],
          [570, 310],
        ].map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r="7" fill="#f97316" />
        ))}
      </>
    );
  if (tool === "measure" || tool === "angle")
    return (
      <>
        <line
          x1="220"
          y1="360"
          x2="610"
          y2="190"
          stroke="#7c3aed"
          strokeWidth="4"
        />
        <path
          d="M220 360 A82 82 0 0 1 296 326"
          fill="none"
          stroke="#f97316"
          strokeWidth="5"
        />
        <text x="365" y="250" fontSize="22" fontWeight="900" fill="#0f766e">
          {tool === "angle" ? "48°" : "5.00 u"}
        </text>
      </>
    );
  return (
    <>
      <path
        d="M160 390 C260 160 392 410 520 164 S660 320 690 180"
        fill="none"
        stroke="#0ea5c9"
        strokeWidth="4"
      />
      <g stroke="#7c3aed" strokeWidth="2" opacity=".45">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={140 + i * 70} y1="110" x2={210 + i * 70} y2="430" />
        ))}
      </g>
    </>
  );
}

function UndoHistory({ spec }: { spec: GeometrySpec }) {
  return (
    <div className="mt-4 rounded-xl border border-[#dbe6fb] bg-[#f8fbff] p-3">
      <p className="text-sm font-black text-[#152348]">
        <RotateCcw className="mr-2 inline h-4 w-4" />
        Undo history
      </p>
      <div className="mt-3 flex items-center gap-3 overflow-x-auto text-xs font-bold text-[#53627f]">
        {[
          "Start",
          `Add ${spec.activeTool}`,
          "Move P",
          "Check relation",
          "Save construction",
        ].map((item, index) => (
          <div key={item} className="flex shrink-0 items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#dbe6fb] bg-white">
              {index ? "●" : "○"}
            </span>
            <span>{item}</span>
            {index < 4 ? (
              <span className="text-xl text-[#087b98]">→</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function NumericControl({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  const height = compact ? "h-8" : "h-11";
  return (
    <label className="grid grid-cols-[32px_1fr] items-center overflow-hidden rounded-xl border border-[#dbe6fb] bg-[#f8fbff] text-sm font-black text-[#53627f]">
      <span
        className={`grid place-items-center border-r border-[#dbe6fb] ${height}`}
      >
        {label}
      </span>
      <input
        aria-label={`${label} coordinate`}
        type="number"
        className={`${height} min-w-0 bg-white px-2 text-center font-mono font-black text-[#081238] outline-none`}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function StepCard({
  index,
  text,
  tool,
}: {
  index: number;
  text: string;
  tool: GeometryTool;
}) {
  return (
    <article className="rounded-xl bg-[#f8fbff] p-3">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-600 text-xs font-black text-white">
        {index}
      </span>
      <p className="mt-3 min-h-12 text-sm font-semibold leading-5 text-[#53627f]">
        {text}
      </p>
      <svg viewBox="0 0 180 90" className="mt-3 w-full rounded-lg bg-white">
        <line
          x1="20"
          y1="68"
          x2="160"
          y2="28"
          stroke="#7c3aed"
          strokeWidth="3"
        />
        {tool === "circle" || tool === "arc" || tool === "sector" ? (
          <circle
            cx="90"
            cy="45"
            r="30"
            fill="none"
            stroke="#0ea5c9"
            strokeWidth="3"
          />
        ) : (
          <circle cx="90" cy="45" r="6" fill="#0ea5c9" />
        )}
      </svg>
    </article>
  );
}

function InfoCard({
  title,
  body,
  formula,
}: {
  title: string;
  body: string;
  formula: string;
}) {
  return (
    <section className="rounded-2xl border border-[#dbe6fb] bg-white/95 p-4 shadow-sm">
      <h2 className="text-lg font-black text-[#087b98]">{title}</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#53627f]">
        {body}
      </p>
      <div className="mt-4 rounded-xl border border-[#dbe6fb] bg-[#f8fbff] p-4 text-center font-serif text-xl font-black text-[#081238]">
        {formula}
      </div>
    </section>
  );
}

function PracticeCard({ spec }: { spec: GeometrySpec }) {
  return (
    <section className="rounded-2xl border border-violet-300 bg-white/95 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-violet-800">
          Try It: Your Turn
        </h2>
        <button className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
          Practice
        </button>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#53627f]">
        {spec.practice}
      </p>
      <div className="mt-4 space-y-3">
        {spec.checks.slice(0, 3).map((check) => (
          <label
            key={check}
            className="flex gap-2 text-sm font-semibold text-[#53627f]"
          >
            <input type="checkbox" defaultChecked />
            {check}
          </label>
        ))}
      </div>
      <button
        type="button"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 font-black text-white"
      >
        <CheckCircle2 className="h-4 w-4" />
        Check Answer
      </button>
    </section>
  );
}

function tabIcon(tab: string) {
  if (tab === "Construction") return <Compass className="h-4 w-4" />;
  if (tab === "Explain") return <BookOpen className="h-4 w-4" />;
  if (tab === "Examples") return <PenTool className="h-4 w-4" />;
  if (tab === "Formulas") return <Ruler className="h-4 w-4" />;
  return <Eye className="h-4 w-4" />;
}

function geometryHeaderIcon(tool: GeometryTool) {
  if (
    tool === "circle" ||
    tool === "arc" ||
    tool === "sector" ||
    tool === "conic"
  )
    return <Circle className="h-16 w-16" />;
  if (tool === "measure" || tool === "angle")
    return <Ruler className="h-16 w-16" />;
  return <Compass className="h-16 w-16" />;
}

function skillLabel(tool: GeometryTool) {
  if (tool === "perpendicular") return "Slope, Perpendicularity";
  if (tool === "parallel") return "Direction, Parallel";
  if (tool === "circle" || tool === "arc" || tool === "sector")
    return "Circle, Radius";
  if (tool === "measure" || tool === "angle") return "Measure, Verify";
  return "Geometry Basics";
}

function ruleFormula(tool: GeometryTool) {
  if (tool === "perpendicular") return "m1 x m2 = -1";
  if (tool === "parallel") return "m1 = m2";
  if (tool === "circle") return "CP = r";
  if (tool === "angle") return "angle AOB";
  if (tool === "measure") return "AB = distance(A,B)";
  if (tool === "conic") return "Ax^2+Bxy+Cy^2+Dx+Ey+F=0";
  return "constraint stays true while dragging";
}

function nextDynamicTitle(lessonId: number) {
  return dynamicGeometrySpecFor(Math.min(235, lessonId + 1)).title;
}

function dynamicGeometrySpecFor(lessonId: number): GeometrySpec {
  const item =
    dynamicGeometryItems.find((entry) => entry.id === lessonId) ??
    dynamicGeometryItems[0];
  return {
    mockupId: item.mockup,
    title: item.title,
    subtitle: item.subtitle,
    tool: item.tool,
    activeTool: item.activeTool,
    result: item.result,
    propertyTitle: item.propertyTitle,
    steps: [
      `Choose the ${item.activeTool} tool.`,
      item.step,
      "Drag the defining points and keep the relation true.",
      "Verify the construction result.",
    ],
    controls: [
      ["x", "2.00"],
      ["y", "1.00"],
    ],
    checks: item.checks,
    insight: item.insight,
    rule: item.rule,
    practice: item.practice,
  };
}

const dynamicGeometryItems: Array<{
  id: number;
  mockup: string;
  title: string;
  subtitle: string;
  tool: GeometryTool;
  activeTool: string;
  result: string;
  propertyTitle: string;
  step: string;
  checks: string[];
  insight: string;
  rule: string;
  practice: string;
}> = [
  g(
    198,
    "0255",
    "Free Point",
    "Create independent points anywhere in the plane.",
    "point",
    "Point",
    "P = (2.00, 1.00)",
    "Point Properties",
    "Click on the plane to place P.",
    [
      "Use Point tool to add a free point.",
      "Drag to move the point anywhere.",
      "Toggle Snap to grid for precision.",
    ],
    "A free point is independent: both coordinates can change freely.",
    "A free point is defined by an ordered pair of real numbers.",
    "Add a free point Q and place it at (4, -2).",
  ),
  g(
    199,
    "0256",
    "Point on Object",
    "Constrain a point to stay on a parent object.",
    "point",
    "Point",
    "P stays on its object",
    "Attached Point",
    "Place P on the line or circle.",
    [
      "Point remains attached.",
      "Parent object controls motion.",
      "Coordinates update while constrained.",
    ],
    "A point on object moves, but only along its parent.",
    "The parent object supplies the constraint.",
    "Attach Q to the circle and drag it around the circumference.",
  ),
  g(
    200,
    "0257",
    "Intersection Point",
    "Create an exact point where two objects meet.",
    "line",
    "Point",
    "I = object A ∩ object B",
    "Intersection Properties",
    "Select two objects that cross.",
    [
      "Uses exact crossing.",
      "Shared by both objects.",
      "Updates when parents move.",
    ],
    "Intersection points are dependent on both parent objects.",
    "A valid intersection satisfies both object equations.",
    "Construct the intersection of a line and circle.",
  ),
  g(
    201,
    "0258",
    "Midpoint or Centre",
    "Mark the exact halfway point or centre.",
    "bisector",
    "Point",
    "M is equidistant from A and B",
    "Midpoint Properties",
    "Select a segment or circle.",
    [
      "Equal distances from endpoints.",
      "Updates with endpoints.",
      "Works as a centre marker.",
    ],
    "A midpoint is fixed by equal distance from both endpoints.",
    "M=((x1+x2)/2,(y1+y2)/2).",
    "Find the midpoint of AB after dragging A.",
  ),
  g(
    202,
    "0259",
    "Attach / Detach Point",
    "Switch a point between constrained and free motion.",
    "point",
    "Select",
    "P constraint toggled",
    "Constraint Properties",
    "Choose attach or detach.",
    [
      "Attach follows parent.",
      "Detach moves freely.",
      "Dependency list updates.",
    ],
    "Attaching adds a constraint; detaching releases it.",
    "Constraint state controls allowed motion.",
    "Detach P from the circle and move it off the circumference.",
  ),
  g(
    203,
    "0260",
    "Line Through Two Points",
    "Construct a straight line through two points.",
    "line",
    "Line",
    "Line AB",
    "Line Properties",
    "Select A, then B.",
    [
      "Two distinct points define a line.",
      "Line extends both ways.",
      "Dragging endpoints rotates line.",
    ],
    "A line through two points is unique when the points are distinct.",
    "A and B determine exactly one line.",
    "Create line AB through two free points.",
  ),
  g(
    204,
    "0261",
    "Segment",
    "Draw a finite segment between two endpoints.",
    "segment",
    "Segment",
    "Segment AB",
    "Segment Properties",
    "Select the first and second endpoint.",
    ["Has two endpoints.", "Length is measurable.", "Does not extend forever."],
    "A segment is the finite part of a line between endpoints.",
    "AB has fixed endpoints A and B.",
    "Draw segment AB and measure its length.",
  ),
  g(
    205,
    "0262",
    "Segment with Given Length",
    "Construct a segment with a specified length.",
    "segment",
    "Segment",
    "AB = 5.00",
    "Length Properties",
    "Set length, then choose start and direction.",
    [
      "Length remains fixed.",
      "Endpoint lies on guide circle.",
      "Measurement verifies value.",
    ],
    "A fixed-length segment preserves distance while direction can change.",
    "AB = chosen length.",
    "Construct a segment of length 5 units.",
  ),
  g(
    206,
    "0263",
    "Ray",
    "Create a ray with a start point and direction.",
    "ray",
    "Ray",
    "Ray AB",
    "Ray Properties",
    "Select start A and direction point B.",
    ["Starts at A.", "Passes through B.", "Extends in one direction."],
    "A ray begins at one endpoint and continues forever in one direction.",
    "Ray AB starts at A and goes through B.",
    "Create ray AB and drag B to change direction.",
  ),
  g(
    207,
    "0264",
    "Polyline",
    "Join multiple points with straight pieces.",
    "polyline",
    "Polyline",
    "A-B-C-D path",
    "Polyline Properties",
    "Click vertices in order.",
    [
      "Straight pieces connect vertices.",
      "Vertex order matters.",
      "Path can remain open.",
    ],
    "A polyline is a path made of consecutive line segments.",
    "A-B-C uses segments AB and BC.",
    "Create a four-vertex polyline.",
  ),
  g(
    208,
    "0265",
    "Perpendicular Line",
    "Construct a right-angle line through a given point.",
    "perpendicular",
    "Perpendicular",
    "Right angle = 90°",
    "Controls",
    "Through P, draw a line perpendicular to the given line.",
    ["Passes through P.", "Perpendicular to given line.", "Right angle = 90°."],
    "For non-vertical lines, perpendicular slopes multiply to -1.",
    "A perpendicular line meets the given line at 90 degrees.",
    "Construct a perpendicular to the given line through point P.",
  ),
  g(
    209,
    "0266",
    "Parallel Line",
    "Construct a line through a point matching a given direction.",
    "parallel",
    "Line",
    "No intersection",
    "Controls",
    "Through P, draw a line parallel to the given line.",
    ["Passes through P.", "Matches direction.", "No crossing."],
    "Parallel lines keep the same direction and never meet.",
    "Parallel lines have equal slopes.",
    "Construct a parallel line through P.",
  ),
  g(
    210,
    "0267",
    "Perpendicular Bisector",
    "Bisect a segment at a right angle.",
    "bisector",
    "Bisector",
    "PA = PB",
    "Bisector Properties",
    "Use equal arcs from the endpoints.",
    ["Cuts segment in half.", "Meets at 90°.", "All points are equidistant."],
    "The perpendicular bisector collects all points equally far from A and B.",
    "Any point on the bisector has PA = PB.",
    "Construct the perpendicular bisector of AB.",
  ),
  g(
    211,
    "0268",
    "Angle Bisector",
    "Split an angle into two equal angles.",
    "bisector",
    "Bisector",
    "∠AOC = ∠COB",
    "Angle Properties",
    "Create equal arc marks on both arms.",
    ["Shares the vertex.", "Two angles are equal.", "Stays inside the angle."],
    "An angle bisector is the equal-turn line from the vertex.",
    "The bisector creates two equal angles.",
    "Bisect angle AOB.",
  ),
  g(
    212,
    "0269",
    "Tangent",
    "Construct a line touching a circle at one point.",
    "tangent",
    "Line",
    "Radius ⟂ tangent",
    "Tangent Properties",
    "Draw tangent at the touch point.",
    ["Touches once.", "Radius is perpendicular.", "Does not cut the circle."],
    "At the point of tangency, the radius meets the tangent at 90 degrees.",
    "Tangent line is perpendicular to the radius.",
    "Construct a tangent at point P on the circle.",
  ),
  g(
    213,
    "0270",
    "Best-Fit Line",
    "Model a point cloud with a trend line.",
    "fit",
    "Line",
    "Residuals balanced",
    "Fit Properties",
    "Adjust the line to minimise residuals.",
    ["Shows trend.", "Residuals compare errors.", "Need not pass every point."],
    "A best-fit line models the overall trend rather than every data point.",
    "Best fit balances positive and negative residuals.",
    "Place a trend line through the data.",
  ),
  g(
    214,
    "0271",
    "Triangle Constructor",
    "Build a triangle from valid vertices.",
    "triangle",
    "Polygon",
    "A + B + C = 180°",
    "Triangle Properties",
    "Place three non-collinear points.",
    ["Three vertices.", "Three sides.", "Angle sum is 180°."],
    "A triangle needs three non-collinear vertices.",
    "Triangle angle sum equals 180 degrees.",
    "Construct triangle ABC.",
  ),
  g(
    215,
    "0272",
    "Regular Polygon",
    "Create a polygon with equal sides and angles.",
    "polygon",
    "Polygon",
    "Equal sides and angles",
    "Polygon Properties",
    "Choose centre, vertex, and side count.",
    ["All sides equal.", "All angles equal.", "Exterior angle = 360°/n."],
    "Regular polygons preserve equal side lengths and equal angles.",
    "Exterior angle is 360 degrees divided by n.",
    "Construct a regular hexagon.",
  ),
  g(
    216,
    "0273",
    "Rigid Polygon",
    "Move a polygon without changing its shape.",
    "polygon",
    "Select",
    "Shape preserved",
    "Rigid Properties",
    "Drag the polygon as one object.",
    ["Lengths stay fixed.", "Angles stay fixed.", "Moves as a whole."],
    "A rigid polygon preserves internal distances and angles.",
    "Rigid motion keeps shape congruent.",
    "Drag a rigid triangle without changing side lengths.",
  ),
  g(
    217,
    "0274",
    "General Polygon",
    "Create a polygon from ordered vertices.",
    "polygon",
    "Polygon",
    "Ordered boundary",
    "Polygon Properties",
    "Click vertices around the boundary.",
    ["Vertex order matters.", "Boundary closes.", "Area can be measured."],
    "A polygon boundary follows the selected vertex order.",
    "A polygon is a closed chain of segments.",
    "Create a pentagon with five ordered vertices.",
  ),
  g(
    218,
    "0275",
    "Circle: Centre and Point",
    "Create a circle using its centre and one point.",
    "circle",
    "Circle",
    "Radius = CP",
    "Circle Properties",
    "Select centre C, then point P.",
    ["C is centre.", "P lies on circle.", "CP controls radius."],
    "The radius is the distance from centre to point on the circle.",
    "All circle points are r from C.",
    "Construct a circle with centre C through P.",
  ),
  g(
    219,
    "0276",
    "Circle: Centre and Radius",
    "Create a circle with fixed radius.",
    "circle",
    "Circle",
    "r = 4.00",
    "Radius Properties",
    "Set radius and choose centre.",
    ["Radius fixed.", "Centre can move.", "All points stay r away."],
    "A centre-radius circle keeps the same radius while the centre moves.",
    "Circle equation depends on centre and radius.",
    "Construct a circle of radius 4.",
  ),
  g(
    220,
    "0277",
    "Circle Through Three Points",
    "Construct the unique circle through three non-collinear points.",
    "circle",
    "Circle",
    "Circumcircle ABC",
    "Circumcircle Properties",
    "Select three non-collinear points.",
    [
      "Three points define circle.",
      "Fails if collinear.",
      "Centre from bisectors.",
    ],
    "Three non-collinear points determine one circumcircle.",
    "The centre is intersection of perpendicular bisectors.",
    "Construct the circle through A, B, and C.",
  ),
  g(
    221,
    "0278",
    "Compass",
    "Copy a distance exactly with a compass radius.",
    "circle",
    "Compass",
    "Copied radius AB",
    "Compass Properties",
    "Copy distance AB from a new centre.",
    ["Preserves length.", "Creates guide circle.", "Useful for constructions."],
    "A compass copies distance without measuring numerically.",
    "Copied radius remains equal to source segment.",
    "Copy AB as a radius from point C.",
  ),
  g(
    222,
    "0279",
    "Semicircle",
    "Draw half a circle over a diameter.",
    "arc",
    "Circle",
    "Arc = 180°",
    "Arc Properties",
    "Select diameter endpoints.",
    ["Uses a diameter.", "Half circle only.", "Arc measure 180°."],
    "A semicircle is exactly half of the circle over a diameter.",
    "Central angle is 180 degrees.",
    "Construct a semicircle with diameter AB.",
  ),
  g(
    223,
    "0280",
    "Circular Arc",
    "Draw a selected portion of a circle.",
    "arc",
    "Arc",
    "Arc AB",
    "Arc Properties",
    "Choose centre, start, and end.",
    ["Follows the circle.", "Has start and end.", "Differs from chord."],
    "An arc is curved and belongs to the circle.",
    "Arc length depends on radius and central angle.",
    "Construct the minor arc from A to B.",
  ),
  g(
    224,
    "0281",
    "Circumcircular Arc",
    "Create an arc through three points.",
    "arc",
    "Arc",
    "Arc through A, B, C",
    "Arc Properties",
    "Select three points on the supporting circle.",
    [
      "Uses circumcircle.",
      "Passes through three points.",
      "Curved through middle point.",
    ],
    "A circumcircular arc belongs to the circle determined by three points.",
    "Three points determine the supporting circle.",
    "Construct an arc through A, B, and C.",
  ),
  g(
    225,
    "0282",
    "Circular Sector",
    "Construct a sector bounded by two radii and an arc.",
    "sector",
    "Sector",
    "Sector area",
    "Sector Properties",
    "Choose centre and two boundary points.",
    ["Two radii.", "One arc.", "Central angle controls area."],
    "A sector is the slice made by two radii and the connecting arc.",
    "Area = theta/360 x pi r^2.",
    "Construct a 60 degree sector.",
  ),
  g(
    226,
    "0283",
    "Conic Through Five Points",
    "Fit a conic through five point constraints.",
    "conic",
    "Conic",
    "Five constraints",
    "Conic Properties",
    "Select five well-spaced points.",
    [
      "Needs five points.",
      "Avoid duplicate constraints.",
      "Updates as points move.",
    ],
    "A general conic is determined by five independent point constraints.",
    "Five points fix the conic coefficients up to scale.",
    "Construct a conic through five points.",
  ),
  g(
    227,
    "0284",
    "Ellipse",
    "Explore the conic with constant sum of focal distances.",
    "conic",
    "Conic",
    "PF1 + PF2 constant",
    "Ellipse Properties",
    "Adjust foci and boundary point.",
    ["Two foci.", "Constant distance sum.", "Closed curve."],
    "An ellipse keeps the sum of distances to two foci constant.",
    "PF1 + PF2 = constant.",
    "Create an ellipse and verify the focal sum.",
  ),
  g(
    228,
    "0285",
    "Hyperbola",
    "Explore the conic with constant distance difference.",
    "conic",
    "Conic",
    "|PF1 - PF2| constant",
    "Hyperbola Properties",
    "Adjust foci and branch point.",
    ["Two branches.", "Constant difference.", "Asymptote guides."],
    "A hyperbola keeps the difference of focal distances constant.",
    "|PF1 - PF2| = constant.",
    "Create a hyperbola and compare focal distances.",
  ),
  g(
    229,
    "0286",
    "Parabola",
    "Construct points equidistant from focus and directrix.",
    "conic",
    "Conic",
    "PF = distance to directrix",
    "Parabola Properties",
    "Move focus and directrix.",
    ["One focus.", "One directrix.", "Equal distances."],
    "A parabola is the locus of points equidistant from focus and directrix.",
    "PF = d(P, directrix).",
    "Construct a parabola from focus and directrix.",
  ),
  g(
    230,
    "0287",
    "Distance / Length",
    "Measure an exact segment length.",
    "measure",
    "Measure",
    "AB = 5.00",
    "Measurement Properties",
    "Select two points or a segment.",
    ["Exact measurement.", "Updates on drag.", "Uses units."],
    "Distance is the exact length between two points.",
    "AB = sqrt((dx)^2 + (dy)^2).",
    "Measure the length of AB.",
  ),
  g(
    231,
    "0288",
    "Area",
    "Measure surface inside a boundary.",
    "measure",
    "Measure",
    "Area = 12 square units",
    "Area Properties",
    "Select a closed polygon.",
    ["Needs closed boundary.", "Square units.", "Different from perimeter."],
    "Area measures covered surface inside a closed boundary.",
    "Rectangle area = base x height.",
    "Measure the area of a polygon.",
  ),
  g(
    232,
    "0289",
    "Angle",
    "Measure the turn between two rays.",
    "angle",
    "Angle",
    "∠AOB = 48°",
    "Angle Properties",
    "Select three points with vertex in the middle.",
    ["Uses a vertex.", "Measures opening.", "Not side length."],
    "Angle size is the amount of turn between rays.",
    "Angle AOB has vertex O.",
    "Measure angle AOB.",
  ),
  g(
    233,
    "0290",
    "Fixed Angle",
    "Construct a ray at a chosen angle.",
    "angle",
    "Angle",
    "Fixed angle = 45°",
    "Fixed Angle Properties",
    "Set angle size and choose base ray.",
    ["Angle stays fixed.", "Ray can move.", "Constraint persists."],
    "A fixed angle preserves the turn while the construction moves.",
    "The chosen angle remains constant.",
    "Create a 45 degree ray from A.",
  ),
  g(
    234,
    "0291",
    "Relation Checker",
    "Test exact geometric relationships.",
    "relation",
    "Select",
    "Relation verified",
    "Relation Properties",
    "Select objects and run checks.",
    ["Checks exact relation.", "Reports pass/fail.", "Avoids visual guessing."],
    "A relation checker verifies properties such as parallel, perpendicular, equal, and incident.",
    "Relations must remain true under dragging.",
    "Check whether two lines are perpendicular.",
  ),
  g(
    235,
    "0292",
    "Construction Steps",
    "Inspect the dependency order of a construction.",
    "steps",
    "Protocol",
    "Step order valid",
    "Protocol Properties",
    "Review each object dependency.",
    ["Shows dependencies.", "Supports undo.", "Explains construction order."],
    "Construction steps reveal which objects depend on earlier choices.",
    "A valid construction follows dependency order.",
    "Reorder the steps and verify dependencies.",
  ),
];

function g(
  id: number,
  mockup: string,
  title: string,
  subtitle: string,
  tool: GeometryTool,
  activeTool: string,
  result: string,
  propertyTitle: string,
  step: string,
  checks: string[],
  insight: string,
  rule: string,
  practice: string,
) {
  return {
    id,
    mockup,
    title,
    subtitle,
    tool,
    activeTool,
    result,
    propertyTitle,
    step,
    checks,
    insight,
    rule,
    practice,
  };
}

function geometryParamsForLesson(
  lessonId: number,
  title: string,
): ReusableLessonEngineParams {
  const params = reusableEngineParamsFor("geometry-2d", title);
  return geometry2DVisualPresetForLesson(lessonId, params);
}
