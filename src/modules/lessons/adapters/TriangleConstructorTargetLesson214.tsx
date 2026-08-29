import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Crosshair,
  HelpCircle,
  Languages,
  Lightbulb,
  Maximize2,
  Move,
  MousePointer2,
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
import "./TriangleConstructorTargetLesson214.css";

type Point = { x: number; y: number };
type Vertices = { a: Point; b: Point; c: Point };
type Mode = "SSS" | "SAS" | "ASA";
type Inputs = {
  ab: number;
  ac: number;
  bc: number;
  angleA: number;
  angleB: number;
};
type Tool = "select" | "pan";

const initialVertices: Vertices = {
  a: { x: -3, y: 0 },
  b: { x: 3, y: 0 },
  c: { x: -0.5, y: 4.3301 },
};
const initialInputs: Inputs = {
  ab: 6,
  ac: 5,
  bc: Math.sqrt(31),
  angleA: 60,
  angleB: 49.11,
};
const practiceTargets = [
  { ab: 8, angleA: 45, ac: 7 },
  { ab: 6, angleA: 70, ac: 5 },
  { ab: 9, angleA: 35, ac: 6 },
];

export default function TriangleConstructorTargetLesson214({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vertices, setVertices] = useState<Vertices>(initialVertices);
  const [inputs, setInputs] = useState<Inputs>(initialInputs);
  const [mode, setMode] = useState<Mode>("SAS");
  const [dragging, setDragging] = useState<keyof Vertices | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [language, setLanguage] = useState("English (English)");
  const [shareStatus, setShareStatus] = useState("");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceFeedback, setPracticeFeedback] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [activeStage, setActiveStage] = useState(0);
  const [fullscreenCount, setFullscreenCount] = useState(0);
  const surfaceRef = useRef<HTMLElement>(null);
  const validity = constructionValidity(mode, inputs);
  const measures = useMemo(() => triangleMeasures(vertices), [vertices]);

  const reset = () => {
    setVertices(initialVertices);
    setInputs(initialInputs);
    setMode("SAS");
    setTool("select");
    setPan({ x: 0, y: 0 });
    setPracticeIndex(0);
    setPracticeFeedback("idle");
    setShareStatus("");
    setActiveStage(0);
    setFullscreenCount(0);
    onInteraction();
  };
  useEffect(() => {
    setVertices(initialVertices);
    setInputs(initialInputs);
    setMode("SAS");
    setTool("select");
    setPan({ x: 0, y: 0 });
    setPracticeIndex(0);
    setPracticeFeedback("idle");
    setActiveStage(0);
    setFullscreenCount(0);
  }, [resetToken]);

  const setConstructionMode = (nextMode: Mode) => {
    const current = triangleMeasures(vertices);
    setMode(nextMode);
    setInputs({
      ab: current.ab,
      ac: current.ac,
      bc: current.bc,
      angleA: current.angleA,
      angleB: current.angleB,
    });
    setPracticeFeedback("idle");
    onInteraction();
  };
  const updateInput = (key: keyof Inputs, value: number) => {
    const next = { ...inputs, [key]: value };
    setInputs(next);
    const nextValidity = constructionValidity(mode, next);
    if (nextValidity.feasible) {
      const built = buildFromInputs(mode, next);
      if (built) setVertices(built);
    }
    setPracticeFeedback("idle");
    onInteraction();
  };
  const pointerToPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp(
        -7 + ((event.clientX - rect.left) / rect.width) * 14 - pan.x / 36,
        -6.5,
        6.5,
      ),
      y: clamp(
        7 - ((event.clientY - rect.top) / rect.height) * 14 + pan.y / 36,
        -6.5,
        6.5,
      ),
    };
  };
  const movePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool === "pan" && panStart) {
      setPan({
        x: clamp(event.clientX - panStart.x, -55, 55),
        y: clamp(event.clientY - panStart.y, -45, 45),
      });
      onInteraction();
      return;
    }
    if (!dragging) return;
    const point = pointerToPoint(event);
    const next = { ...vertices, [dragging]: point };
    const nextMeasures = triangleMeasures(next);
    setVertices(next);
    setInputs({
      ab: nextMeasures.ab,
      ac: nextMeasures.ac,
      bc: nextMeasures.bc,
      angleA: nextMeasures.angleA,
      angleB: nextMeasures.angleB,
    });
    setPracticeFeedback("idle");
    onInteraction();
  };
  const startPointDrag = (
    event: ReactPointerEvent<SVGCircleElement>,
    point: keyof Vertices,
  ) => {
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    if (tool === "select") setDragging(point);
  };
  const startPlaneDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (tool === "pan") {
      event.currentTarget.setPointerCapture(event.pointerId);
      setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    }
  };
  const stopDrag = () => {
    setDragging(null);
    setPanStart(null);
  };
  const share = async () => {
    const text = `Triangle: AB=${measures.ab.toFixed(2)}, AC=${measures.ac.toFixed(2)}, BC=${measures.bc.toFixed(2)}, angles=${measures.angleA.toFixed(2)}°, ${measures.angleB.toFixed(2)}°, ${measures.angleC.toFixed(2)}°, ${measures.sideClass} ${measures.angleClass}`;
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Triangle measurements copied");
    } catch {
      setShareStatus(text);
    }
    onInteraction();
  };
  const fullscreen = () => {
    setFullscreenCount((count) => count + 1);
    void surfaceRef.current?.requestFullscreen?.();
    onInteraction();
  };
  const checkPractice = () => {
    const target = practiceTargets[practiceIndex];
    const correct =
      mode === "SAS" &&
      Math.abs(measures.ab - target.ab) < 0.06 &&
      Math.abs(measures.ac - target.ac) < 0.06 &&
      Math.abs(measures.angleA - target.angleA) < 0.6;
    setPracticeFeedback(correct ? "correct" : "incorrect");
    onInteraction();
  };
  const newPractice = () => {
    const next = (practiceIndex + 1) % practiceTargets.length;
    setPracticeIndex(next);
    setMode("SAS");
    setPracticeFeedback("idle");
    onInteraction();
  };
  const target = practiceTargets[practiceIndex];

  return (
    <section
      ref={surfaceRef}
      className="triangle214-page space-y-3"
      style={{ marginTop: -9 }}
      data-testid="dynamic-geometry-mockup-0271"
      data-dedicated-lesson="214"
      data-object-model="triangle-construction"
      data-direct-interaction="true"
      data-vertices={Object.entries(vertices)
        .map(([key, point]) => `${key}:${point.x}:${point.y}`)
        .join("|")}
      data-inputs={`${inputs.ab}:${inputs.ac}:${inputs.bc}:${inputs.angleA}:${inputs.angleB}`}
      data-mode={mode}
      data-feasible={validity.feasible}
      data-ab={measures.ab.toFixed(4)}
      data-ac={measures.ac.toFixed(4)}
      data-bc={measures.bc.toFixed(4)}
      data-angle-a={measures.angleA.toFixed(4)}
      data-perimeter={measures.perimeter.toFixed(4)}
      data-area={measures.area.toFixed(4)}
      data-side-class={measures.sideClass}
      data-angle-class={measures.angleClass}
      data-tool={tool}
      data-pan={`${pan.x}:${pan.y}`}
      data-stage={activeStage}
      data-fullscreen-count={fullscreenCount}
      data-practice-index={practiceIndex}
      data-practice-feedback={practiceFeedback}
      aria-label="Triangle Constructor dedicated interactive geometry model"
    >
      <header className="rounded-2xl border border-slate-200 bg-white px-5 py-[18px] shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_150px]">
          <div>
            <div className="flex gap-2 text-[8px] font-black uppercase">
              <span className="rounded-full bg-cyan-50 px-2 py-1 text-cyan-700">
                Geometry
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                Dynamic Geometry Constructions
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-black">Triangle Constructor</h1>
            <p className="mt-2 text-[11px] text-slate-600">
              Construct triangles from three measures and explore when they are
              possible.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[8px] font-black">
              <span className="target-geometry-chip">
                Foundational–Advanced
              </span>
              <span className="target-geometry-chip">Construction Studio</span>
              <span className="target-geometry-chip">Geometry Tools</span>
              <span className="target-geometry-chip">6–10 min</span>
            </div>
          </div>
          <div className="grid content-start grid-cols-2 gap-2">
            <label className="col-span-2 flex items-center gap-2 rounded-md border px-3 py-2 text-[9px] font-bold">
              <Languages className="h-4 w-4 text-blue-600" />
              <select
                aria-label="Lesson language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  onInteraction();
                }}
                className="min-w-0 flex-1 bg-transparent text-[9px]"
              >
                <option>English (English)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
            </label>
            <button
              type="button"
              className="target-geometry-action justify-center"
              onClick={reset}
            >
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              className="target-geometry-action justify-center"
              onClick={share}
            >
              <Share2 />
              Share
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

      <nav
        className="grid min-h-11 grid-cols-5 overflow-hidden rounded-xl border border-slate-200 bg-white text-[9px] font-black"
        style={{ marginTop: 8 }}
      >
        {["Observe", "Manipulate", "Pattern", "Rule", "Try it"].map(
          (label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                setActiveStage(index);
                document
                  .getElementById(`triangle-${index}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                onInteraction();
              }}
              className={
                activeStage === index
                  ? "bg-cyan-600 text-white"
                  : "text-slate-600"
              }
            >
              {label}
            </button>
          ),
        )}
      </nav>

      <section
        id="triangle-0"
        className="rounded-xl border border-slate-200 bg-white px-3 pt-3 pb-2 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-black">Interactive construction</h2>
            <p className="mt-1 text-[9px] text-slate-600">
              Drag points or adjust controls. See measures and classification
              update live.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-2 text-[9px] font-black ${validity.feasible ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
            >
              <CheckCircle2 className="mr-1 inline h-3 w-3" />
              {validity.feasible ? "All good!" : "Not possible"}
            </span>
            <button
              type="button"
              title={validity.reason}
              aria-label="Construction help"
              className="target-geometry-tool"
            >
              <HelpCircle />
            </button>
          </div>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative overflow-hidden rounded-lg border border-slate-200 lg:h-[505px]">
            <TriangleCanvas
              vertices={vertices}
              measures={measures}
              feasible={validity.feasible}
              pan={pan}
              tool={tool}
              onPointerMove={movePointer}
              onPointerDown={startPlaneDrag}
              onPointerUp={stopDrag}
              onPointDown={startPointDrag}
            />
            <div className="absolute bottom-3 left-3 flex gap-2">
              <button
                type="button"
                aria-label="Select and drag triangle points"
                aria-pressed={tool === "select"}
                className={`target-geometry-tool ${tool === "select" ? "is-active" : ""}`}
                onClick={() => {
                  setTool("select");
                  onInteraction();
                }}
              >
                <MousePointer2 />
              </button>
              <button
                type="button"
                aria-label="Pan triangle plane"
                aria-pressed={tool === "pan"}
                className={`target-geometry-tool ${tool === "pan" ? "is-active" : ""}`}
                onClick={() => {
                  setTool("pan");
                  onInteraction();
                }}
              >
                <Move />
              </button>
              <button
                type="button"
                aria-label="Fit triangle to view"
                className="target-geometry-tool"
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  onInteraction();
                }}
              >
                <Crosshair />
              </button>
              <button
                type="button"
                aria-label="Enter triangle fullscreen"
                className="target-geometry-tool"
                onClick={fullscreen}
              >
                <Maximize2 />
              </button>
            </div>
          </div>
          <TriangleControls
            mode={mode}
            inputs={inputs}
            validity={validity}
            measures={measures}
            onMode={setConstructionMode}
            onInput={updateInput}
          />
        </div>
        <div className="mt-[5px] grid gap-3 lg:grid-cols-[125px_1fr_1fr]">
          <section className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 lg:h-[133px]">
            <h3 className="text-[10px] font-black text-blue-700">
              Live measures
            </h3>
            <dl className="mt-2 text-[9px] leading-4">
              <dt>AB = {measures.ab.toFixed(2)}</dt>
              <dt>AC = {measures.ac.toFixed(2)}</dt>
              <dt>BC = {measures.bc.toFixed(2)}</dt>
              <dt>∠A = {measures.angleA.toFixed(2)}°</dt>
              <dt>∠B = {measures.angleB.toFixed(2)}°</dt>
              <dt>∠C = {measures.angleC.toFixed(2)}°</dt>
            </dl>
          </section>
          <section
            id="triangle-3"
            className="rounded-lg border border-slate-200 p-3 lg:h-[133px]"
          >
            <h3 className="text-[10px] font-black text-blue-700">
              Feasibility rule (Triangle Inequality)
            </h3>
            <p className="mt-3 text-[9px]">
              For sides a, b, c to form a triangle:
            </p>
            <p className="my-3 text-center font-serif text-sm italic">
              a + b &gt; c, &nbsp; b + c &gt; a, &nbsp; c + a &gt; b
            </p>
            <p className="text-[9px]">All three conditions must hold.</p>
          </section>
          <section
            id="triangle-2"
            className="rounded-lg border border-slate-200 p-3 lg:h-[133px]"
          >
            <h3 className="flex items-center gap-2 text-[10px] font-black text-violet-700">
              <Lightbulb className="h-4 w-4" />
              What do you notice?
            </h3>
            <p className="mt-3 text-[9px] leading-4 text-slate-600">
              Change the sliders. When the triangle is possible, the status
              stays green and measurements update. When not possible, the status
              turns red and the triangle cannot be constructed.
            </p>
          </section>
        </div>
      </section>

      <div
        className="grid gap-3 lg:grid-cols-[1.75fr_1fr]"
        id="triangle-1"
        style={{ marginTop: 1 }}
      >
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:h-[167px]">
          <h2 className="text-[11px] font-black text-blue-700">
            Worked example (SAS)
          </h2>
          <div className="mt-3 grid grid-cols-[1.2fr_0.8fr] gap-3">
            <ol className="space-y-2 text-[9px]">
              {[
                "Place A at (−3, 0) and B at (3, 0).",
                "Set AB = 6.",
                "At A, construct a ray making ∠A = 60° with AB.",
                "On the ray, mark C so that AC = 5.",
                "Join C to B. Triangle ABC is constructed.",
              ].map((step, index) => (
                <li className="flex gap-2" key={step}>
                  <b className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-blue-600 text-[8px] text-white">
                    {index + 1}
                  </b>
                  {step}
                </li>
              ))}
            </ol>
            <WorkedTriangle />
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:h-[167px]">
          <h2 className="text-[11px] font-black text-blue-700">
            Insight (Law of Cosines)
          </h2>
          <p className="mt-3 text-[9px]">
            Given sides a, b with included angle C:
          </p>
          <p className="my-4 text-center font-serif text-base italic">
            c² = a² + b² − 2ab cos C
          </p>
          <p className="text-[9px]">
            Used here to compute the third side exactly.
          </p>
        </section>
      </div>

      <section
        id="triangle-4"
        className="grid min-h-[82px] items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:h-[90px] lg:grid-cols-[1.4fr_0.85fr_0.75fr]"
      >
        <div className="p-4">
          <h2 className="text-[11px] font-black text-blue-700">
            Try it: Build a triangle
          </h2>
          <p className="mt-2 text-[9px]">
            Construct a triangle with SAS: AB = {target.ab}, ∠A ={" "}
            {target.angleA}°, AC = {target.ac}.
          </p>
          <p className="mt-2 text-[9px] text-slate-600">
            Adjust the controls to match. Then classify it.
          </p>
        </div>
        <div className="border-x p-4 text-[8px] font-black">
          <span>Match these targets</span>
          <div className="mt-2 flex gap-1">
            <b className="rounded bg-slate-100 px-3 py-2">AB = {target.ab}</b>
            <b className="rounded bg-slate-100 px-3 py-2">
              ∠A = {target.angleA}°
            </b>
            <b className="rounded bg-slate-100 px-3 py-2">AC = {target.ac}</b>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-4">
          <button
            type="button"
            className="target-geometry-action border-blue-400 text-blue-700"
            onClick={checkPractice}
          >
            <Check />
            Check
          </button>
          <button
            type="button"
            className="target-geometry-action border-blue-400 text-blue-700"
            onClick={newPractice}
          >
            <RotateCcw />
            New values
          </button>
          {practiceFeedback !== "idle" ? (
            <p
              role="status"
              className={`w-full text-center text-[8px] font-black ${practiceFeedback === "correct" ? "text-emerald-700" : "text-amber-700"}`}
            >
              {practiceFeedback === "correct"
                ? "Correct: target triangle constructed."
                : "Keep adjusting the three SAS measures."}
            </p>
          ) : null}
        </div>
      </section>

      <nav className="grid min-h-14 grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white text-[9px] font-black">
        <a
          href="/lessons/geometry/213-best-fit-line"
          className="flex items-center gap-2 px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block text-slate-500">Previous</small>Best-Fit
            Line
          </span>
        </a>
        <a
          href="/lessons/geometry/215-regular-polygon"
          className="flex items-center justify-end gap-2 border-l px-4 text-right"
        >
          <span>
            <small className="block text-slate-500">Next</small>Regular Polygon
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">
        Live Verification. Check Construction. Apex x and Apex y placeholders
        have been replaced by a dedicated triangle object model.
      </span>
    </section>
  );
}

function TriangleControls({
  mode,
  inputs,
  validity,
  measures,
  onMode,
  onInput,
}: {
  mode: Mode;
  inputs: Inputs;
  validity: { feasible: boolean; reason: string };
  measures: ReturnType<typeof triangleMeasures>;
  onMode: (mode: Mode) => void;
  onInput: (key: keyof Inputs, value: number) => void;
}) {
  const controls =
    mode === "SSS"
      ? ([
          ["AB (base)", "ab", 1, 12],
          ["AC", "ac", 1, 12],
          ["BC", "bc", 1, 12],
        ] as const)
      : mode === "SAS"
        ? ([
            ["AB (base)", "ab", 1, 12],
            ["∠A", "angleA", 10, 170],
            ["AC", "ac", 1, 12],
          ] as const)
        : ([
            ["AB (base)", "ab", 1, 12],
            ["∠A", "angleA", 10, 160],
            ["∠B", "angleB", 10, 160],
          ] as const);
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 p-3 lg:h-[505px]">
      <h2 className="text-sm font-black">Triangle from three measures</h2>
      <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border">
        {(["SSS", "SAS", "ASA"] as Mode[]).map((item) => (
          <button
            type="button"
            key={item}
            className={`py-2 text-[9px] font-black ${mode === item ? "bg-violet-100 text-violet-700" : "bg-white"}`}
            onClick={() => onMode(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-3">
        {controls.map(([label, key, min, max]) => (
          <label
            key={key}
            className="grid grid-cols-[76px_1fr] items-center gap-3 text-[9px] font-black"
          >
            <span>
              {label}
              <output className="mt-1 block w-16 rounded-md border px-2 py-2 text-[11px]">
                {inputs[key].toFixed(key.startsWith("angle") ? 0 : 2)}
                {key.startsWith("angle") ? "°" : ""}
              </output>
            </span>
            <span>
              <i className="flex justify-between text-[7px] not-italic text-slate-500">
                <b>
                  {min}
                  {key.startsWith("angle") ? "°" : ""}
                </b>
                <b>
                  {max}
                  {key.startsWith("angle") ? "°" : ""}
                </b>
              </i>
              <input
                type="range"
                aria-label={label}
                min={min}
                max={max}
                step={key.startsWith("angle") ? 1 : 0.05}
                value={inputs[key]}
                onChange={(event) => onInput(key, Number(event.target.value))}
                className="w-full accent-violet-600"
              />
            </span>
          </label>
        ))}
      </div>
      <div
        role="status"
        className={`mt-4 rounded-md border p-3 ${validity.feasible ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50"}`}
      >
        <h3
          className={`flex items-center gap-2 text-[10px] font-black ${validity.feasible ? "text-emerald-700" : "text-rose-700"}`}
        >
          <CheckCircle2 className="h-4 w-4" />
          Construction status
        </h3>
        <b className="mt-1 block text-[11px]">
          {validity.feasible ? "Feasible" : "Not feasible"}
        </b>
        <p className="mt-1 text-[8px]">{validity.reason}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="Perimeter" value={measures.perimeter.toFixed(2)} />
        <Metric label="Area" value={measures.area.toFixed(2)} />
      </div>
      <div className="mt-3 rounded-md border p-3">
        <h3 className="text-[9px] font-black text-cyan-700">Classification</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <b className="rounded-full bg-violet-100 py-1 text-center text-[9px] text-violet-700">
            {measures.sideClass}
          </b>
          <b className="rounded-full bg-emerald-100 py-1 text-center text-[9px] text-emerald-700">
            {measures.angleClass}
          </b>
        </div>
      </div>
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-2 text-center">
      <span className="block text-[8px] font-bold text-slate-600">{label}</span>
      <b className="text-sm">{value}</b>
    </div>
  );
}

function TriangleCanvas({
  vertices,
  measures,
  feasible,
  pan,
  tool,
  onPointerMove,
  onPointerDown,
  onPointerUp,
  onPointDown,
}: {
  vertices: Vertices;
  measures: ReturnType<typeof triangleMeasures>;
  feasible: boolean;
  pan: Point;
  tool: Tool;
  onPointerMove: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerDown: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  onPointDown: (
    event: ReactPointerEvent<SVGCircleElement>,
    point: keyof Vertices,
  ) => void;
}) {
  const sx = (x: number) => 280 + x * 36,
    sy = (y: number) => 290 - y * 36;
  return (
    <svg
      viewBox="0 0 560 580"
      className="block aspect-[0.965/1] w-full touch-none bg-[linear-gradient(#eef2f7_1px,transparent_1px),linear-gradient(90deg,#eef2f7_1px,transparent_1px)] bg-[size:36px_36px] lg:h-[481px] lg:aspect-auto"
      role="img"
      aria-label="Interactive triangle coordinate plane with draggable vertices A B and C"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <g
        data-testid="triangle-pan-layer"
        transform={`translate(${pan.x} ${pan.y})`}
      >
        <line x1="28" y1={sy(0)} x2="532" y2={sy(0)} stroke="#94a3b8" />
        <line x1={sx(0)} y1="25" x2={sx(0)} y2="555" stroke="#94a3b8" />
        {[-6, -4, -2, 2, 4, 6].map((v) => (
          <g key={v}>
            <text x={sx(v) - 6} y={sy(0) + 18} fontSize="10">
              {v}
            </text>
            <text x={sx(0) - 18} y={sy(v) + 4} fontSize="10">
              {v}
            </text>
          </g>
        ))}
        {feasible ? (
          <polygon
            points={`${sx(vertices.a.x)},${sy(vertices.a.y)} ${sx(vertices.b.x)},${sy(vertices.b.y)} ${sx(vertices.c.x)},${sy(vertices.c.y)}`}
            fill="#dbeafe66"
            stroke="#2563eb"
            strokeWidth="2.5"
          />
        ) : (
          <text x="145" y="280" fill="#e11d48" fontSize="18" fontWeight="800">
            No triangle satisfies these measures
          </text>
        )}{" "}
        {feasible ? (
          <>
            <text
              x={(sx(vertices.a.x) + sx(vertices.b.x)) / 2 - 30}
              y={(sy(vertices.a.y) + sy(vertices.b.y)) / 2 + 34}
              fill="#2563eb"
              fontSize="14"
              fontWeight="800"
            >
              AB = {measures.ab.toFixed(2)}
            </text>
            <text
              x={(sx(vertices.a.x) + sx(vertices.c.x)) / 2 - 55}
              y={(sy(vertices.a.y) + sy(vertices.c.y)) / 2}
              fill="#7c3aed"
              fontSize="14"
              fontWeight="800"
            >
              AC = {measures.ac.toFixed(2)}
            </text>
            <text
              x={(sx(vertices.b.x) + sx(vertices.c.x)) / 2 + 8}
              y={(sy(vertices.b.y) + sy(vertices.c.y)) / 2}
              fill="#0891b2"
              fontSize="14"
              fontWeight="800"
            >
              BC = {measures.bc.toFixed(2)}
            </text>
          </>
        ) : null}
        {(["a", "b", "c"] as const).map((key) => (
          <g key={key}>
            <circle
              data-testid={`triangle-point-${key}`}
              cx={sx(vertices[key].x)}
              cy={sy(vertices[key].y)}
              r="12"
              fill="transparent"
              className={tool === "select" ? "cursor-grab" : "cursor-default"}
              onPointerDown={(event) => {
                event.stopPropagation();
                onPointDown(event, key);
              }}
            />
            <circle
              cx={sx(vertices[key].x)}
              cy={sy(vertices[key].y)}
              r="7"
              fill={key === "c" ? "#f59e0b" : "#2563eb"}
              pointerEvents="none"
            />
            <text
              x={sx(vertices[key].x) + (key === "b" ? 12 : -25)}
              y={sy(vertices[key].y) - 10}
              fill={key === "c" ? "#d97706" : "#0369a1"}
              fontSize="16"
              fontWeight="900"
            >
              {key.toUpperCase()}
            </text>
            <text
              x={sx(vertices[key].x) - 22}
              y={sy(vertices[key].y) + 27}
              fill="#0369a1"
              fontSize="11"
            >
              ({vertices[key].x.toFixed(1)}, {vertices[key].y.toFixed(1)})
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
function WorkedTriangle() {
  return (
    <svg
      viewBox="0 0 220 135"
      className="h-28 w-full"
      role="img"
      aria-label="Worked SAS triangle"
    >
      <polygon
        points="20,115 200,115 110,18"
        fill="#ede9fe"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <text x="5" y="130" fontSize="11" fontWeight="800">
        A(−3, 0)
      </text>
      <text x="170" y="130" fontSize="11" fontWeight="800">
        B(3, 0)
      </text>
      <text x="115" y="16" fontSize="11" fontWeight="800">
        C
      </text>
      <text x="103" y="130" fontSize="10">
        6
      </text>
      <text x="48" y="67" fontSize="10">
        5
      </text>
      <text x="170" y="67" fontSize="10">
        √31
      </text>
      <path d="M48 115 A28 28 0 0 0 34 91" fill="none" stroke="#7c3aed" />
      <text x="48" y="103" fontSize="10">
        60°
      </text>
    </svg>
  );
}

function buildFromInputs(mode: Mode, input: Inputs): Vertices | null {
  const a = { x: -input.ab / 2, y: 0 },
    b = { x: input.ab / 2, y: 0 };
  if (mode === "SAS")
    return {
      a,
      b,
      c: {
        x: a.x + input.ac * Math.cos(rad(input.angleA)),
        y: input.ac * Math.sin(rad(input.angleA)),
      },
    };
  if (mode === "SSS") {
    if (!constructionValidity(mode, input).feasible) return null;
    const xFromA =
      (input.ac ** 2 + input.ab ** 2 - input.bc ** 2) / (2 * input.ab);
    const height = Math.sqrt(Math.max(0, input.ac ** 2 - xFromA ** 2));
    return { a, b, c: { x: a.x + xFromA, y: height } };
  }
  if (input.angleA + input.angleB >= 180) return null;
  const angleC = 180 - input.angleA - input.angleB;
  const ac = (input.ab * Math.sin(rad(input.angleB))) / Math.sin(rad(angleC));
  return {
    a,
    b,
    c: {
      x: a.x + ac * Math.cos(rad(input.angleA)),
      y: ac * Math.sin(rad(input.angleA)),
    },
  };
}
function constructionValidity(mode: Mode, input: Inputs) {
  if (mode === "SSS") {
    const feasible =
      input.ab + input.ac > input.bc &&
      input.ab + input.bc > input.ac &&
      input.ac + input.bc > input.ab;
    return {
      feasible,
      reason: feasible
        ? "A unique triangle is formed."
        : "Triangle inequality fails for these side lengths.",
    };
  }
  if (mode === "ASA") {
    const feasible = input.angleA + input.angleB < 180;
    return {
      feasible,
      reason: feasible
        ? "Two angles and the included side form one triangle."
        : "The two given angles must sum to less than 180°.",
    };
  }
  return {
    feasible: input.angleA > 0 && input.angleA < 180,
    reason:
      "A unique triangle is formed from two sides and their included angle.",
  };
}
function triangleMeasures({ a, b, c }: Vertices) {
  const ab = distance(a, b),
    ac = distance(a, c),
    bc = distance(b, c);
  const angleA = angleFromSides(ac, ab, bc),
    angleB = angleFromSides(ab, bc, ac),
    angleC = Math.max(0, 180 - angleA - angleB);
  const area =
    Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
  const sorted = [ab, ac, bc].sort((x, y) => x - y),
    eps = 0.04;
  const sideClass =
    Math.abs(sorted[0] - sorted[2]) < eps
      ? "Equilateral"
      : Math.abs(sorted[0] - sorted[1]) < eps ||
          Math.abs(sorted[1] - sorted[2]) < eps
        ? "Isosceles"
        : "Scalene";
  const maxAngle = Math.max(angleA, angleB, angleC);
  const angleClass =
    Math.abs(maxAngle - 90) < 0.3
      ? "Right"
      : maxAngle > 90
        ? "Obtuse"
        : "Acute";
  return {
    ab,
    ac,
    bc,
    angleA,
    angleB,
    angleC,
    area,
    perimeter: ab + ac + bc,
    sideClass,
    angleClass,
  };
}
function angleFromSides(side1: number, side2: number, opposite: number) {
  const denominator = 2 * side1 * side2;
  if (denominator < 1e-8) return 0;
  return (
    (Math.acos(
      clamp((side1 ** 2 + side2 ** 2 - opposite ** 2) / denominator, -1, 1),
    ) *
      180) /
    Math.PI
  );
}
function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function rad(degrees: number) {
  return (degrees * Math.PI) / 180;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
