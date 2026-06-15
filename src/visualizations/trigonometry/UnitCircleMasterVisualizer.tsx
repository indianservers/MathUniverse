import { ChevronLeft, ChevronRight, Eye, GraduationCap, Lightbulb, Move, TriangleAlert } from "lucide-react";
import { type PointerEvent, useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { degreesToRadians, radiansToDegrees, roundTo } from "../../utils/math";

const EPSILON = 1e-6;
const SNAP_ANGLES = [0, 30, 45, 60, 90, 180, 270, 360];
const STEPS = [
  { title: "Radius", text: "Every point on the unit circle is one unit from the center." },
  { title: "Cosine", text: "The horizontal shadow of the radius is cos theta." },
  { title: "Sine", text: "The vertical shadow of the radius is sin theta." },
  { title: "Coordinate", text: "So the moving point is always (cos theta, sin theta)." },
  { title: "Tangent", text: "tan theta compares vertical movement to horizontal movement: sin theta / cos theta." },
  { title: "Quadrants", text: "Signs change because the point moves left/right and up/down." },
  { title: "Special Angles", text: "Certain angles have exact values that appear again and again." },
];

export type UnitCircleMasterFocus = "unit-circle" | "degree-radian" | "special-angles" | "quadrant-signs";
type AngleDisplayMode = "degrees" | "radians" | "both";
type TeachingMode = "beginner" | "professor";
type LayerKey = "sin" | "cos" | "tan" | "quadrants" | "exactValues" | "miniWave";
type ExactTrigValues = { degrees: number; radians: string; sin: string; cos: string; tan: string };

type UnitCircleMasterVisualizerProps = {
  focus?: UnitCircleMasterFocus;
  title?: string;
};

const EXACT_VALUES: Record<number, ExactTrigValues> = {
  0: { degrees: 0, radians: "0", sin: "0", cos: "1", tan: "0" },
  30: { degrees: 30, radians: "pi/6", sin: "1/2", cos: "sqrt(3)/2", tan: "sqrt(3)/3" },
  45: { degrees: 45, radians: "pi/4", sin: "sqrt(2)/2", cos: "sqrt(2)/2", tan: "1" },
  60: { degrees: 60, radians: "pi/3", sin: "sqrt(3)/2", cos: "1/2", tan: "sqrt(3)" },
  90: { degrees: 90, radians: "pi/2", sin: "1", cos: "0", tan: "undefined" },
  180: { degrees: 180, radians: "pi", sin: "0", cos: "-1", tan: "0" },
  270: { degrees: 270, radians: "3pi/2", sin: "-1", cos: "0", tan: "undefined" },
  360: { degrees: 360, radians: "2pi", sin: "0", cos: "1", tan: "0" },
};

export default function UnitCircleMasterVisualizer({ focus = "unit-circle", title = "Unit Circle Master Visualizer" }: UnitCircleMasterVisualizerProps) {
  const [angle, setAngle] = useState(defaultAngleForFocus(focus));
  const [displayMode, setDisplayMode] = useState<AngleDisplayMode>(focus === "degree-radian" ? "both" : "degrees");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>(focus === "quadrant-signs" ? "professor" : "beginner");
  const [activeStep, setActiveStep] = useState(defaultStepForFocus(focus));
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    sin: true,
    cos: true,
    tan: focus !== "degree-radian",
    quadrants: true,
    exactValues: focus === "special-angles" || focus === "unit-circle",
    miniWave: false,
  });

  const model = useMemo(() => buildUnitCircleModel(angle), [angle]);
  const exact = getExactTrigValues(model.normalizedDegrees);
  const professor = teachingMode === "professor";

  function toggleLayer(key: LayerKey) {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title={title}
        description="Drag the point, snap to special angles, and watch sine, cosine, tangent, quadrants, degrees, and radians update together."
        allowFullscreen
        headerAction={<ModeToggle mode={teachingMode} onChange={setTeachingMode} />}
      >
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.18fr)_360px]">
          <div className="min-w-0 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950">
              <UnitCircleCanvas
                model={model}
                activeStep={activeStep}
                layers={layers}
                professor={professor}
                onAngleChange={setAngle}
              />
            </div>
            {layers.miniWave && <MiniSineWave model={model} />}
            <AngleControlPanel
              angle={angle}
              setAngle={setAngle}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              layers={layers}
              toggleLayer={toggleLayer}
            />
          </div>
          <div className="min-w-0 space-y-3">
            <LiveTrigValues model={model} displayMode={displayMode} />
            {layers.quadrants && <QuadrantSignTable current={model.quadrant} />}
            {layers.exactValues && <ExactAngleValueCard exact={exact} model={model} />}
            <StepByStepPanel activeStep={activeStep} setActiveStep={setActiveStep} beginner={!professor} />
            <MisconceptionBox tangentUndefined={model.tan === null} />
            <MemoryTricks professor={professor} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function UnitCircleCanvas({
  model,
  activeStep,
  layers,
  professor,
  onAngleChange,
}: {
  model: ReturnType<typeof buildUnitCircleModel>;
  activeStep: number;
  layers: Record<LayerKey, boolean>;
  professor: boolean;
  onAngleChange: (angle: number) => void;
}) {
  const cx = 320;
  const cy = 300;
  const r = 180;
  const point = { x: cx + model.cos * r, y: cy - model.sin * r };
  const tangentX = cx + r;
  const tangentY = model.tan === null ? null : cy - model.tan * r;
  const angleArc = describeArc(cx, cy, 58, 0, model.normalizedDegrees);
  const active = {
    radius: activeStep === 0 || activeStep === 3,
    cos: activeStep === 1 || activeStep === 3,
    sin: activeStep === 2 || activeStep === 3,
    tan: activeStep === 4,
    quadrants: activeStep === 5,
    exact: activeStep === 6,
  };

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 720;
    const y = ((event.clientY - rect.top) / rect.height) * 620;
    const next = radiansToDegrees(Math.atan2(cy - y, x - cx));
    onAngleChange(roundTo(normalizeDegrees(next), 0));
  }

  return (
    <svg
      viewBox="0 0 720 620"
      className="h-[420px] w-full touch-none sm:h-[560px]"
      role="application"
      aria-label="Draggable unit circle visualizer"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        handlePointer(event);
      }}
      onPointerMove={(event) => {
        if (event.buttons === 1) handlePointer(event);
      }}
      onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
    >
      <defs>
        <marker id="unit-circle-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
        </marker>
      </defs>
      <rect width="720" height="620" rx="22" fill="#f8fafc" className="dark:fill-slate-950" />
      <Grid />
      {layers.quadrants && <QuadrantBackground cx={cx} cy={cy} r={r + 38} current={model.quadrant} active={active.quadrants} />}
      <line x1="70" x2="650" y1={cy} y2={cy} stroke="#64748b" strokeWidth="2" />
      <line x1={cx} x2={cx} y1="50" y2="560" stroke="#64748b" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r} fill="#22d3ee" opacity="0.08" stroke="#0891b2" strokeWidth="4" />
      <circle cx={cx} cy={cy} r="5" fill="#0f172a" className="dark:fill-white" />
      <path d={angleArc} fill="none" stroke="#f59e0b" strokeWidth={active.radius ? 7 : 4} />
      <line x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="#f59e0b" strokeWidth={active.radius ? 8 : 5} markerEnd="url(#unit-circle-arrow)" />
      {layers.cos && (
        <line x1={cx} y1={cy} x2={point.x} y2={cy} stroke="#8b5cf6" strokeWidth={active.cos ? 8 : 5} strokeDasharray="9 7" />
      )}
      {layers.sin && (
        <line x1={point.x} y1={cy} x2={point.x} y2={point.y} stroke="#10b981" strokeWidth={active.sin ? 8 : 5} strokeDasharray="9 7" />
      )}
      {layers.tan && (
        <>
          <line x1={tangentX} y1="68" x2={tangentX} y2="552" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="8 7" />
          {tangentY !== null && tangentY > 64 && tangentY < 556 ? (
            <>
              <line x1={cx} y1={cy} x2={tangentX} y2={tangentY} stroke="#f43f5e" strokeWidth={active.tan ? 7 : 4} />
              <circle cx={tangentX} cy={tangentY} r="7" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
            </>
          ) : (
            <text x="455" y="90" fill="#be123c" fontSize="15" fontWeight="900">tan theta is undefined here</text>
          )}
        </>
      )}
      <circle cx={point.x} cy={point.y} r={professor ? 10 : 12} fill="#f59e0b" stroke="#0f172a" strokeWidth="3" />
      <circle cx={point.x} cy={point.y} r="21" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
      <Label x={point.x + 15} y={point.y - 16} text={`P(${formatTrigValue(model.cos)}, ${formatTrigValue(model.sin)})`} size={professor ? 14 : 16} />
      <Label x={cx + 64} y={cy - 22} text={angleLabel(model, professor)} size={professor ? 14 : 16} />
      {layers.cos && <Label x={(cx + point.x) / 2 - 28} y={cy + 34} text="cos theta" color="#6d28d9" size={active.cos || !professor ? 16 : 14} />}
      {layers.sin && <Label x={point.x + 14} y={(cy + point.y) / 2} text="sin theta" color="#047857" size={active.sin || !professor ? 16 : 14} />}
      {layers.tan && <Label x={tangentX + 12} y={tangentY === null ? 120 : clamp(tangentY, 88, 530)} text="tan theta" color="#be123c" size={15} />}
      <Label x={cx + r + 10} y={cy + 26} text="(1, 0)" size={13} />
      <Label x={cx - r - 58} y={cy + 26} text="(-1, 0)" size={13} />
      <Label x={cx + 12} y={cy - r - 12} text="(0, 1)" size={13} />
      <Label x={cx + 12} y={cy + r + 28} text="(0, -1)" size={13} />
      {active.exact && <SpecialAngleMarkers cx={cx} cy={cy} r={r} />}
      <text x="42" y="44" fill="#0f172a" className="dark:fill-slate-100" fontSize={professor ? 15 : 17} fontWeight="900">
        Drag the orange point or use the slider below
      </text>
      <Move x={44} y={58} className="fill-none stroke-slate-600 dark:stroke-slate-200" size={18} />
    </svg>
  );
}

function AngleControlPanel({
  angle,
  setAngle,
  displayMode,
  setDisplayMode,
  layers,
  toggleLayer,
}: {
  angle: number;
  setAngle: (angle: number) => void;
  displayMode: AngleDisplayMode;
  setDisplayMode: (mode: AngleDisplayMode) => void;
  layers: Record<LayerKey, boolean>;
  toggleLayer: (key: LayerKey) => void;
}) {
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/40">
        <SliderControl label="Angle theta" value={angle} min={0} max={360} step={1} unit="deg" onChange={setAngle} description="Keyboard-accessible fallback for the draggable point." />
        <div className="mt-3 flex flex-wrap gap-2">
          {SNAP_ANGLES.map((degrees) => (
            <button key={degrees} type="button" className={normalizeDegrees(angle) === normalizeDegrees(degrees) ? "action-primary px-3 py-2 text-xs" : "tool-button px-3 py-2 text-xs"} onClick={() => setAngle(degrees)} aria-label={`Snap angle to ${degrees} degrees`}>
              {degrees} deg
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/40">
        <ToggleGroup label="Angle display" values={["degrees", "radians", "both"]} selected={displayMode} onSelect={setDisplayMode} />
        <div className="grid grid-cols-2 gap-2">
          {([
            ["cos", "Show cosine"],
            ["sin", "Show sine"],
            ["tan", "Show tangent"],
            ["quadrants", "Show signs"],
            ["exactValues", "Exact values"],
            ["miniWave", "Mini wave"],
          ] as Array<[LayerKey, string]>).map(([key, label]) => (
            <button key={key} type="button" aria-pressed={layers[key]} className={layers[key] ? "action-primary justify-center px-2 py-2 text-xs" : "tool-button justify-center px-2 py-2 text-xs"} onClick={() => toggleLayer(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveTrigValues({ model, displayMode }: { model: ReturnType<typeof buildUnitCircleModel>; displayMode: AngleDisplayMode }) {
  const rows = [
    ["theta", displayMode === "degrees" ? `${roundTo(model.degrees, 2)} deg` : displayMode === "radians" ? model.radianDecimal : `${roundTo(model.degrees, 2)} deg = ${model.radianDecimal}`],
    ["radian label", model.exact?.radians ?? model.radianPiLabel],
    ["coordinate", `(${formatTrigValue(model.cos)}, ${formatTrigValue(model.sin)})`],
    ["sin theta", formatTrigValue(model.sin)],
    ["cos theta", formatTrigValue(model.cos)],
    ["tan theta", formatTrigValue(model.tan)],
    ["quadrant", model.quadrant],
    ["signs", `sin ${model.signs.sin}, cos ${model.signs.cos}, tan ${model.signs.tan}`],
  ];
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <p className="text-sm font-black text-cyan-900 dark:text-cyan-100">Live values</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-2 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
      {model.tan === null && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2 text-sm font-bold text-rose-800 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100">
          tan theta is undefined because cos theta is 0.
        </p>
      )}
    </div>
  );
}

function QuadrantSignTable({ current }: { current: ReturnType<typeof getQuadrant> }) {
  const rows = [
    ["I", "+", "+", "+"],
    ["II", "+", "-", "-"],
    ["III", "-", "-", "+"],
    ["IV", "-", "+", "-"],
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/40">
      <p className="text-sm font-black text-slate-950 dark:text-white">Quadrant sign table</p>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-4 bg-slate-100 text-xs font-black uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">
          <span className="p-2">Quadrant</span><span className="p-2">sin</span><span className="p-2">cos</span><span className="p-2">tan</span>
        </div>
        {rows.map(([quadrant, sin, cos, tan]) => (
          <div key={quadrant} className={`grid grid-cols-4 text-sm font-black ${current === quadrant ? "bg-cyan-100 text-cyan-950 dark:bg-cyan-400/20 dark:text-cyan-50" : "bg-white text-slate-700 dark:bg-slate-950/50 dark:text-slate-200"}`}>
            <span className="p-2">Q{quadrant}</span><span className="p-2">{sin}</span><span className="p-2">{cos}</span><span className="p-2">{tan}</span>
          </div>
        ))}
      </div>
      {current === "axis" && <p className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-200">The angle is on an axis, so at least one value is zero.</p>}
    </div>
  );
}

function ExactAngleValueCard({ exact, model }: { exact: ExactTrigValues | null; model: ReturnType<typeof buildUnitCircleModel> }) {
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-300/20 dark:bg-violet-400/10">
      <p className="text-sm font-black text-violet-900 dark:text-violet-100">Exact angle values</p>
      {exact ? (
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <ValueChip label="angle" value={`${exact.degrees} deg = ${exact.radians}`} />
          <ValueChip label="sin" value={exact.sin} />
          <ValueChip label="cos" value={exact.cos} />
          <ValueChip label="tan" value={exact.tan} />
        </div>
      ) : (
        <p className="mt-2 text-sm leading-5 text-violet-900 dark:text-violet-100">
          {roundTo(model.normalizedDegrees, 2)} deg is not one of the snap angles. Use a snap button to see exact values.
        </p>
      )}
    </div>
  );
}

function StepByStepPanel({ activeStep, setActiveStep, beginner }: { activeStep: number; setActiveStep: (step: number) => void; beginner: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/40">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Step-by-step lesson</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{beginner ? "Simple shadow language is active." : "Coordinate, slope, and radian reasoning are active."}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" className="tool-button h-8 w-8 justify-center p-0" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} aria-label="Previous lesson step"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" className="tool-button h-8 w-8 justify-center p-0" onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} aria-label="Next lesson step"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {activeStep + 1}: {STEPS[activeStep].title}</p>
        <p className="mt-2 text-sm leading-5 text-slate-700 dark:text-slate-200">{STEPS[activeStep].text}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {STEPS.map((step, index) => (
          <button key={step.title} type="button" className={index === activeStep ? "action-primary h-8 px-2 text-xs" : "tool-button h-8 px-2 text-xs"} onClick={() => setActiveStep(index)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function MisconceptionBox({ tangentUndefined }: { tangentUndefined: boolean }) {
  const items = [
    ["Sine is not the horizontal value.", "Cosine is horizontal x-position. Sine is vertical y-position."],
    ["Tangent is not always defined.", "When cos theta is 0, tan theta = sin theta / cos theta cannot be calculated."],
    ["Radians are not a different angle.", "Degrees and radians are two ways to measure the same rotation."],
    ["Quadrant signs are not random.", "They come from whether x and y coordinates are positive or negative."],
  ];
  return (
    <div className={`rounded-xl border p-3 ${tangentUndefined ? "border-rose-200 bg-rose-50 dark:border-rose-300/20 dark:bg-rose-400/10" : "border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-400/10"}`}>
      <p className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white"><TriangleAlert className="h-4 w-4" /> Misconception checks</p>
      <div className="mt-2 grid gap-2">
        {items.map(([wrong, right]) => (
          <div key={wrong} className="rounded-lg bg-white/80 p-2 text-sm dark:bg-slate-950/50">
            <p className="font-black text-slate-800 dark:text-slate-100">{wrong}</p>
            <p className="mt-1 leading-5 text-slate-600 dark:text-slate-300">{right}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryTricks({ professor }: { professor: boolean }) {
  const tricks = professor
    ? ["Coordinates are (cos theta, sin theta).", "Tangent is slope: y/x.", "Radians are arc length on radius 1.", "Coterminal angles land on the same point."]
    : ["Cosine touches the x-axis.", "Sine rises on the y-axis.", "Tangent is rise divided by run.", "Signs follow the point's x and y position."];
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-300/20 dark:bg-emerald-400/10">
      <p className="flex items-center gap-2 text-sm font-black text-emerald-900 dark:text-emerald-100"><Lightbulb className="h-4 w-4" /> Visual memory tricks</p>
      <div className="mt-2 grid gap-1.5">
        {tricks.map((trick) => <p key={trick} className="rounded-lg bg-white/80 px-2 py-1.5 text-sm font-semibold text-emerald-900 dark:bg-slate-950/50 dark:text-emerald-100">{trick}</p>)}
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: TeachingMode; onChange: (mode: TeachingMode) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white/80 p-1 dark:border-white/10 dark:bg-slate-950/60">
      <button type="button" className={mode === "beginner" ? "action-primary h-9 px-3 text-xs" : "tool-button h-9 px-3 text-xs"} onClick={() => onChange("beginner")}>
        <Eye className="h-4 w-4" /> Beginner
      </button>
      <button type="button" className={mode === "professor" ? "action-primary h-9 px-3 text-xs" : "tool-button h-9 px-3 text-xs"} onClick={() => onChange("professor")}>
        <GraduationCap className="h-4 w-4" /> Professor
      </button>
    </div>
  );
}

function ToggleGroup<T extends string>({ label, values, selected, onSelect }: { label: string; values: T[]; selected: T; onSelect: (value: T) => void }) {
  return (
    <div>
      <p className="mb-1 text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/10">
        {values.map((value) => (
          <button key={value} type="button" className={selected === value ? "rounded-lg bg-white px-2 py-1.5 text-xs font-black text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-100" : "rounded-lg px-2 py-1.5 text-xs font-black capitalize text-slate-500 dark:text-slate-300"} onClick={() => onSelect(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniSineWave({ model }: { model: ReturnType<typeof buildUnitCircleModel> }) {
  const width = 720;
  const height = 130;
  const markerX = (model.normalizedDegrees / 360) * width;
  const markerY = height / 2 - model.sin * 42;
  const path = Array.from({ length: 220 }, (_, index) => {
    const x = (index / 219) * width;
    const y = height / 2 - Math.sin((index / 219) * Math.PI * 2) * 42;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full">
        <rect width={width} height={height} rx="12" fill="#f8fafc" className="dark:fill-slate-950" />
        <line x1="0" x2={width} y1={height / 2} y2={height / 2} stroke="#94a3b8" />
        <path d={path} fill="none" stroke="#10b981" strokeWidth="4" />
        <line x1={markerX} x2={markerX} y1="18" y2={height - 18} stroke="#f59e0b" strokeDasharray="5 5" />
        <circle cx={markerX} cy={markerY} r="7" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
        <text x="14" y="24" fill="#0f172a" className="dark:fill-slate-100" fontSize="13" fontWeight="900">Mini sine wave link</text>
      </svg>
    </div>
  );
}

function QuadrantBackground({ cx, cy, r, current, active }: { cx: number; cy: number; r: number; current: ReturnType<typeof getQuadrant>; active: boolean }) {
  const quadrants = [
    { id: "I", x: cx, y: cy - r, labelX: cx + r * 0.5, labelY: cy - r * 0.5 },
    { id: "II", x: cx - r, y: cy - r, labelX: cx - r * 0.62, labelY: cy - r * 0.5 },
    { id: "III", x: cx - r, y: cy, labelX: cx - r * 0.68, labelY: cy + r * 0.55 },
    { id: "IV", x: cx, y: cy, labelX: cx + r * 0.5, labelY: cy + r * 0.55 },
  ];
  return (
    <g opacity={active ? 0.22 : 0.13}>
      {quadrants.map((quadrant) => (
        <g key={quadrant.id}>
          <rect x={quadrant.x} y={quadrant.y} width={r} height={r} fill={current === quadrant.id ? "#22d3ee" : "#94a3b8"} />
          <text x={quadrant.labelX} y={quadrant.labelY} fill="#0f172a" fontSize="24" fontWeight="900">{quadrant.id}</text>
        </g>
      ))}
    </g>
  );
}

function SpecialAngleMarkers({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {SNAP_ANGLES.filter((angle) => angle < 360).map((angle) => {
        const rad = degToRad(angle);
        const x = cx + Math.cos(rad) * r;
        const y = cy - Math.sin(rad) * r;
        const labelX = cx + Math.cos(rad) * (r + 32);
        const labelY = cy - Math.sin(rad) * (r + 32);
        return (
          <g key={angle}>
            <circle cx={x} cy={y} r="4.5" fill="#7c3aed" />
            <text x={labelX - 12} y={labelY + 4} fill="#6d28d9" fontSize="12" fontWeight="900">{angle} deg</text>
          </g>
        );
      })}
    </g>
  );
}

function Grid() {
  return (
    <g opacity="0.42">
      {Array.from({ length: 13 }).map((_, index) => <line key={`x-${index}`} x1={60 + index * 50} x2={60 + index * 50} y1="42" y2="578" stroke="#e2e8f0" />)}
      {Array.from({ length: 11 }).map((_, index) => <line key={`y-${index}`} x1="48" x2="672" y1={60 + index * 50} y2={60 + index * 50} stroke="#e2e8f0" />)}
    </g>
  );
}

function Label({ x, y, text, color = "#0f172a", size = 14 }: { x: number; y: number; text: string; color?: string; size?: number }) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return <text x={x} y={y} fill={color} className={color === "#0f172a" ? "dark:fill-slate-100" : ""} fontSize={size} fontWeight="900">{text}</text>;
}

function ValueChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-2 dark:bg-slate-950/60">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function angleLabel(model: ReturnType<typeof buildUnitCircleModel>, professor: boolean) {
  if (professor) return `theta = ${roundTo(model.degrees, 1)} deg = ${model.radianPiLabel}`;
  return `theta = ${roundTo(model.degrees, 1)} deg`;
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToSvg(cx, cy, r, startDeg);
  const end = polarToSvg(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToSvg(cx: number, cy: number, r: number, degrees: number) {
  const rad = degToRad(degrees);
  return { x: cx + Math.cos(rad) * r, y: cy - Math.sin(rad) * r };
}

function defaultAngleForFocus(focus: UnitCircleMasterFocus) {
  if (focus === "degree-radian") return 90;
  if (focus === "special-angles") return 45;
  if (focus === "quadrant-signs") return 135;
  return 45;
}

function defaultStepForFocus(focus: UnitCircleMasterFocus) {
  if (focus === "degree-radian") return 0;
  if (focus === "special-angles") return 6;
  if (focus === "quadrant-signs") return 5;
  return 1;
}

function buildUnitCircleModel(degrees: number) {
  const normalizedDegrees = normalizeDegrees(degrees);
  const thetaRad = degToRad(normalizedDegrees);
  const sin = cleanTrig(Math.sin(thetaRad));
  const cos = cleanTrig(Math.cos(thetaRad));
  const tan = safeTan(thetaRad);
  return {
    degrees,
    normalizedDegrees,
    thetaRad,
    sin,
    cos,
    tan,
    quadrant: getQuadrant(normalizedDegrees),
    signs: {
      sin: signLabel(sin),
      cos: signLabel(cos),
      tan: tan === null ? "undefined" : signLabel(tan),
    },
    exact: getExactTrigValues(normalizedDegrees),
    radianDecimal: `${formatTrigValue(thetaRad)} rad`,
    radianPiLabel: radiansAsPiLabel(normalizedDegrees),
  };
}

export function degToRad(deg: number): number {
  return degreesToRadians(deg);
}

export function radToDeg(rad: number): number {
  return radiansToDegrees(rad);
}

export function normalizeDegrees(deg: number): number {
  const normalized = ((deg % 360) + 360) % 360;
  return Object.is(normalized, -0) ? 0 : normalized;
}

export function getQuadrant(deg: number): "I" | "II" | "III" | "IV" | "axis" {
  const normalized = normalizeDegrees(deg);
  if (near(normalized, 0) || near(normalized, 90) || near(normalized, 180) || near(normalized, 270)) return "axis";
  if (normalized < 90) return "I";
  if (normalized < 180) return "II";
  if (normalized < 270) return "III";
  return "IV";
}

export function safeTan(thetaRad: number): number | null {
  const cos = Math.cos(thetaRad);
  if (Math.abs(cos) < EPSILON) return null;
  return cleanTrig(Math.tan(thetaRad));
}

export function formatTrigValue(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "undefined";
  const cleaned = cleanTrig(value);
  return roundTo(cleaned, 4).toString();
}

export function getExactTrigValues(degrees: number): ExactTrigValues | null {
  const normalized = normalizeDegrees(degrees);
  if (near(normalized, 0) && Math.abs(degrees) >= 360) return EXACT_VALUES[360];
  const key = SNAP_ANGLES.find((angle) => near(normalizeDegrees(angle), normalized) || (angle === 360 && near(normalized, 0)));
  return key === undefined ? null : EXACT_VALUES[key];
}

function radiansAsPiLabel(degrees: number) {
  const exact = getExactTrigValues(degrees);
  if (exact) return exact.radians;
  const multiple = normalizeDegrees(degrees) / 180;
  return `${roundTo(multiple, 3)}pi`;
}

function signLabel(value: number) {
  if (Math.abs(value) < EPSILON) return "0";
  return value > 0 ? "+" : "-";
}

function cleanTrig(value: number) {
  return Math.abs(value) < EPSILON ? 0 : value;
}

function near(a: number, b: number) {
  return Math.abs(a - b) < EPSILON;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
