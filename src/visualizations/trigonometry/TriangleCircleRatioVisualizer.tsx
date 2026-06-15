import { BookOpen, Eye, EyeOff, GraduationCap, HelpCircle, RotateCcw, Scale, TriangleAlert } from "lucide-react";
import { type CSSProperties } from "react";
import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../components/ui/SliderControl";
import { clamp, degreesToRadians, roundTo } from "../../utils/math";

export type TriangleCircleRatioFocus = "basic" | "reciprocal" | "functions";

type DiagramMode = "both" | "triangle" | "circle";
type RatioVisibility = "basic" | "all";
type TeachingMode = "beginner" | "professor";
type RatioId = "sin" | "cos" | "tan" | "csc" | "sec" | "cot";
type SideKey = "opposite" | "adjacent" | "hypotenuse";

type TriangleSides = {
  opposite: number;
  adjacent: number;
  hypotenuse: number;
};

type TrigRatios = Record<RatioId, number | null>;

const EPSILON = 1e-6;
const SIDE_COLORS: Record<SideKey | "tangent" | "radius", string> = {
  opposite: "#10b981",
  adjacent: "#6366f1",
  hypotenuse: "#06b6d4",
  radius: "#06b6d4",
  tangent: "#f97316",
};

const RATIO_DETAILS: Array<{
  id: RatioId;
  title: string;
  formula: string;
  numerator: SideKey;
  denominator: SideKey;
  reciprocal?: RatioId;
  note: string;
}> = [
  { id: "sin", title: "Sine", formula: "sin theta = opposite / hypotenuse", numerator: "opposite", denominator: "hypotenuse", reciprocal: "csc", note: "How high the point is compared with the radius." },
  { id: "cos", title: "Cosine", formula: "cos theta = adjacent / hypotenuse", numerator: "adjacent", denominator: "hypotenuse", reciprocal: "sec", note: "How far right the point is compared with the radius." },
  { id: "tan", title: "Tangent", formula: "tan theta = opposite / adjacent", numerator: "opposite", denominator: "adjacent", reciprocal: "cot", note: "Rise divided by run, like slope." },
  { id: "csc", title: "Cosecant", formula: "cosec theta = hypotenuse / opposite", numerator: "hypotenuse", denominator: "opposite", reciprocal: "sin", note: "The flipped sine ratio." },
  { id: "sec", title: "Secant", formula: "sec theta = hypotenuse / adjacent", numerator: "hypotenuse", denominator: "adjacent", reciprocal: "cos", note: "The flipped cosine ratio." },
  { id: "cot", title: "Cotangent", formula: "cot theta = adjacent / opposite", numerator: "adjacent", denominator: "opposite", reciprocal: "tan", note: "The flipped tangent ratio." },
];

const TEACHING_STEPS = [
  "Identify the right triangle. One angle is 90 degrees and the marked angle is theta.",
  "Name the sides from theta: opposite is across, adjacent touches theta, hypotenuse is across from 90 degrees.",
  "Build sine by comparing opposite to hypotenuse.",
  "Build cosine by comparing adjacent to hypotenuse.",
  "Build tangent by comparing opposite to adjacent, the same idea as rise over run.",
  "Set hypotenuse to 1 and the triangle becomes the unit-circle triangle.",
  "Flip sine, cosine, and tangent to get cosecant, secant, and cotangent.",
  "Scale the triangle. Side lengths change, but the ratios stay the same.",
];

export function degToRad(deg: number) {
  return degreesToRadians(deg);
}

export function safeDivide(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || Math.abs(denominator) < EPSILON) return null;
  return cleanNumber(numerator / denominator);
}

export function formatRatioValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "undefined";
  const rounded = roundTo(cleanNumber(value), 4);
  return Object.is(rounded, -0) ? "0" : `${rounded}`;
}

export function getTriangleSides(thetaDeg: number, hypotenuse: number): TriangleSides {
  const safeTheta = clamp(thetaDeg, 0, 90);
  const safeHypotenuse = Math.max(0, Number.isFinite(hypotenuse) ? hypotenuse : 1);
  const theta = degToRad(safeTheta);
  return {
    opposite: cleanNumber(safeHypotenuse * Math.sin(theta)),
    adjacent: cleanNumber(safeHypotenuse * Math.cos(theta)),
    hypotenuse: cleanNumber(safeHypotenuse),
  };
}

export function getTrigRatios(thetaDeg: number): TrigRatios {
  const sides = getTriangleSides(thetaDeg, 1);
  return {
    sin: safeDivide(sides.opposite, sides.hypotenuse),
    cos: safeDivide(sides.adjacent, sides.hypotenuse),
    tan: safeDivide(sides.opposite, sides.adjacent),
    csc: safeDivide(sides.hypotenuse, sides.opposite),
    sec: safeDivide(sides.hypotenuse, sides.adjacent),
    cot: safeDivide(sides.adjacent, sides.opposite),
  };
}

export default function TriangleCircleRatioVisualizer({ focus = "basic", title = "Triangle + Unit Circle Ratio Visualizer" }: { focus?: TriangleCircleRatioFocus; title?: string }) {
  const [angle, setAngle] = useState(focus === "reciprocal" ? 35 : 45);
  const [hypotenuse, setHypotenuse] = useState(focus === "functions" ? 1 : 5);
  const [diagramMode, setDiagramMode] = useState<DiagramMode>("both");
  const [showLabels, setShowLabels] = useState(true);
  const [ratioVisibility, setRatioVisibility] = useState<RatioVisibility>(focus === "basic" ? "basic" : "all");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>(focus === "basic" ? "beginner" : "professor");
  const [activeStep, setActiveStep] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);

  const sides = useMemo(() => getTriangleSides(angle, hypotenuse), [angle, hypotenuse]);
  const unitSides = useMemo(() => getTriangleSides(angle, 1), [angle]);
  const ratios = useMemo(() => getRatiosFromSides(sides), [sides]);
  const visibleRatios = ratioVisibility === "basic" ? RATIO_DETAILS.slice(0, 3) : RATIO_DETAILS;
  const showTriangle = diagramMode !== "circle";
  const showCircle = diagramMode !== "triangle";
  const normalized = Math.abs(hypotenuse - 1) < EPSILON;

  return (
    <SectionCard
      title={title}
      description="A linked right triangle and unit circle for seeing SOH-CAH-TOA, reciprocals, and why scaling does not change trig ratios."
      allowFullscreen
      headerAction={
        <button
          type="button"
          className="tool-button gap-2"
          onClick={() => setTeachingMode((mode) => (mode === "beginner" ? "professor" : "beginner"))}
          aria-pressed={teachingMode === "professor"}
          title="Toggle beginner and professor explanations"
        >
          {teachingMode === "beginner" ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
          <span className="hidden sm:inline">{teachingMode === "beginner" ? "Beginner" : "Professor"}</span>
        </button>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className={showTriangle && showCircle ? "grid gap-4 xl:grid-cols-2" : "grid gap-4"}>
            {showTriangle && <RightTriangleScene angle={angle} sides={sides} showLabels={showLabels} activeStep={activeStep} />}
            {showCircle && <LinkedUnitCircleMiniScene angle={angle} unitSides={unitSides} showLabels={showLabels} teachingMode={teachingMode} />}
          </div>
          <AngleAndScaleControls
            angle={angle}
            hypotenuse={hypotenuse}
            diagramMode={diagramMode}
            showLabels={showLabels}
            ratioVisibility={ratioVisibility}
            setAngle={setAngle}
            setHypotenuse={setHypotenuse}
            setDiagramMode={setDiagramMode}
            setShowLabels={setShowLabels}
            setRatioVisibility={setRatioVisibility}
          />
          <RatioCardGrid ratioDetails={visibleRatios} sides={sides} ratios={ratios} />
        </div>

        <div className="space-y-4">
          <SideLabelLegend normalized={normalized} hypotenuse={hypotenuse} onNormalize={() => setHypotenuse(1)} />
          <ReciprocalPairPanel ratios={ratios} expanded={ratioVisibility === "all"} onExpand={() => setRatioVisibility("all")} />
          <StepByStepPanel activeStep={activeStep} setActiveStep={setActiveStep} teachingMode={teachingMode} angle={angle} />
          <MisconceptionBox teachingMode={teachingMode} />
          <PracticePromptCard practiceAnswer={practiceAnswer} setPracticeAnswer={setPracticeAnswer} />
        </div>
      </div>
    </SectionCard>
  );
}

function getRatiosFromSides(sides: TriangleSides): TrigRatios {
  return {
    sin: safeDivide(sides.opposite, sides.hypotenuse),
    cos: safeDivide(sides.adjacent, sides.hypotenuse),
    tan: safeDivide(sides.opposite, sides.adjacent),
    csc: safeDivide(sides.hypotenuse, sides.opposite),
    sec: safeDivide(sides.hypotenuse, sides.adjacent),
    cot: safeDivide(sides.adjacent, sides.opposite),
  };
}

function RightTriangleScene({ angle, sides, showLabels, activeStep }: { angle: number; sides: TriangleSides; showLabels: boolean; activeStep: number }) {
  const theta = degToRad(angle);
  const start = { x: 70, y: 294 };
  const maxBase = 320;
  const maxHeight = 210;
  const unitAdj = Math.max(Math.cos(theta), 0.02);
  const unitOpp = Math.max(Math.sin(theta), 0.02);
  const scale = Math.min(maxBase / unitAdj, maxHeight / unitOpp);
  const base = unitAdj * scale;
  const height = unitOpp * scale;
  const foot = { x: start.x + base, y: start.y };
  const top = { x: foot.x, y: foot.y - height };
  const arcEnd = { x: start.x + 48 * Math.cos(theta), y: start.y - 48 * Math.sin(theta) };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Right triangle view</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Side names are always based on theta.</p>
        </div>
        <span className="mini-chip">{roundTo(angle, 1)} deg</span>
      </div>
      <svg viewBox="0 0 520 350" className="h-[330px] w-full" role="img" aria-label="Right triangle showing opposite, adjacent, and hypotenuse">
        <rect width="520" height="350" rx="18" fill="#f8fafc" className="dark:fill-slate-900" />
        <GridLines />
        <polygon points={`${start.x},${start.y} ${foot.x},${foot.y} ${top.x},${top.y}`} fill="#06b6d4" opacity="0.13" />
        <line x1={start.x} y1={start.y} x2={foot.x} y2={foot.y} stroke={SIDE_COLORS.adjacent} strokeWidth={activeStep === 3 ? 8 : 5} strokeLinecap="round" />
        <line x1={foot.x} y1={foot.y} x2={top.x} y2={top.y} stroke={SIDE_COLORS.opposite} strokeWidth={activeStep === 2 ? 8 : 5} strokeLinecap="round" />
        <line x1={start.x} y1={start.y} x2={top.x} y2={top.y} stroke={SIDE_COLORS.hypotenuse} strokeWidth={activeStep === 5 ? 8 : 5} strokeLinecap="round" />
        <path d={`M${start.x + 48},${start.y} A48,48 0 0 0 ${arcEnd.x},${arcEnd.y}`} fill="none" stroke="#f59e0b" strokeWidth="5" />
        <path d={`M${foot.x - 28},${foot.y} L${foot.x - 28},${foot.y - 28} L${foot.x},${foot.y - 28}`} fill="none" stroke="#475569" strokeWidth="3" />
        <Point x={start.x} y={start.y} label="theta" />
        <Point x={foot.x} y={foot.y} label="90 deg" />
        <Point x={top.x} y={top.y} label="P" />
        {showLabels ? (
          <>
            <SvgLabel x={start.x + base / 2 - 48} y={start.y + 32} text={`adjacent = ${roundTo(sides.adjacent, 3)}`} color={SIDE_COLORS.adjacent} />
            <SvgLabel x={foot.x + 14} y={foot.y - height / 2} text={`opposite = ${roundTo(sides.opposite, 3)}`} color={SIDE_COLORS.opposite} />
            <SvgLabel x={start.x + base / 2 - 36} y={start.y - height / 2 - 16} text={`hypotenuse = ${roundTo(sides.hypotenuse, 3)}`} color={SIDE_COLORS.hypotenuse} />
          </>
        ) : (
          <SvgLabel x="72" y="58" text="Labels hidden: can you name the sides?" color="#334155" />
        )}
        <SvgLabel x={start.x + 58} y={start.y - 16} text={`${roundTo(angle, 1)} deg`} color="#f59e0b" />
      </svg>
    </div>
  );
}

function LinkedUnitCircleMiniScene({ angle, unitSides, showLabels, teachingMode }: { angle: number; unitSides: TriangleSides; showLabels: boolean; teachingMode: TeachingMode }) {
  const theta = degToRad(angle);
  const cx = 260;
  const cy = 185;
  const r = 112;
  const x = cx + r * Math.cos(theta);
  const y = cy - r * Math.sin(theta);
  const tangentY = cy - r * Math.tan(theta);
  const safeTangentY = clamp(tangentY, 30, 320);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Unit-circle connection</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Radius is 1, so x = cos theta and y = sin theta.</p>
        </div>
        <span className="mini-chip">r = 1</span>
      </div>
      <svg viewBox="0 0 520 350" className="h-[330px] w-full" role="img" aria-label="Unit circle showing sine, cosine, tangent, and radius">
        <rect width="520" height="350" rx="18" fill="#f8fafc" className="dark:fill-slate-900" />
        <GridLines />
        <line x1="50" y1={cy} x2="470" y2={cy} stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx} y1="38" x2={cx} y2="320" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="#06b6d4" opacity="0.08" stroke={SIDE_COLORS.radius} strokeWidth="4" />
        <line x1={cx} y1={cy} x2={x} y2={y} stroke={SIDE_COLORS.radius} strokeWidth="5" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={x} y2={cy} stroke={SIDE_COLORS.adjacent} strokeWidth="5" strokeLinecap="round" />
        <line x1={x} y1={cy} x2={x} y2={y} stroke={SIDE_COLORS.opposite} strokeWidth="5" strokeLinecap="round" />
        {teachingMode === "professor" && (
          <>
            <line x1={cx + r} y1="34" x2={cx + r} y2="316" stroke={SIDE_COLORS.tangent} strokeWidth="3" strokeDasharray="7 7" />
            <line x1={cx + r} y1={cy} x2={cx + r} y2={safeTangentY} stroke={SIDE_COLORS.tangent} strokeWidth="5" strokeLinecap="round" />
            <SvgLabel x={cx + r + 10} y={safeTangentY} text="tan theta" color={SIDE_COLORS.tangent} />
          </>
        )}
        <circle cx={x} cy={y} r="8" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
        {showLabels && (
          <>
            <SvgLabel x={cx + 14} y={cy - 68} text="radius = 1" color={SIDE_COLORS.radius} />
            <SvgLabel x={(cx + x) / 2 - 32} y={cy + 28} text={`cos = ${roundTo(unitSides.adjacent, 3)}`} color={SIDE_COLORS.adjacent} />
            <SvgLabel x={x + 12} y={(cy + y) / 2} text={`sin = ${roundTo(unitSides.opposite, 3)}`} color={SIDE_COLORS.opposite} />
            <SvgLabel x={x + 12} y={y - 10} text={`(${roundTo(unitSides.adjacent, 3)}, ${roundTo(unitSides.opposite, 3)})`} color="#0f172a" />
          </>
        )}
      </svg>
    </div>
  );
}

function AngleAndScaleControls({
  angle,
  hypotenuse,
  diagramMode,
  showLabels,
  ratioVisibility,
  setAngle,
  setHypotenuse,
  setDiagramMode,
  setShowLabels,
  setRatioVisibility,
}: {
  angle: number;
  hypotenuse: number;
  diagramMode: DiagramMode;
  showLabels: boolean;
  ratioVisibility: RatioVisibility;
  setAngle: (value: number) => void;
  setHypotenuse: (value: number) => void;
  setDiagramMode: (value: DiagramMode) => void;
  setShowLabels: (value: boolean) => void;
  setRatioVisibility: (value: RatioVisibility) => void;
}) {
  return (
    <SectionCard compact title="Controls" description="Drag theta and the hypotenuse to see both diagrams update together.">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <SliderGroup className="min-w-0">
          <SliderControl density="compact" label="Angle theta" value={angle} min={1} max={89} step={1} unit="deg" onChange={setAngle} description="Acute angle for right-triangle ratios" />
          <LocalSlider label="Hypotenuse" value={hypotenuse} min={1} max={10} step={0.25} onChange={setHypotenuse} description="Scale the triangle without changing ratios" />
        </SliderGroup>
        <div className="space-y-2">
          <SegmentedButtons<DiagramMode> label="Diagram mode" value={diagramMode} options={[["both", "Both"], ["triangle", "Triangle"], ["circle", "Circle"]]} onChange={setDiagramMode} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="tool-button justify-center gap-2" onClick={() => setShowLabels(!showLabels)} aria-pressed={showLabels}>
              {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {showLabels ? "Labels" : "Challenge"}
            </button>
            <button type="button" className="tool-button justify-center gap-2" onClick={() => setHypotenuse(1)}>
              <Scale className="h-4 w-4" />
              Radius 1
            </button>
          </div>
          <SegmentedButtons<RatioVisibility> label="Ratio cards" value={ratioVisibility} options={[["basic", "Basic"], ["all", "All six"]]} onChange={setRatioVisibility} />
        </div>
      </div>
    </SectionCard>
  );
}

function LocalSlider({ label, value, min, max, step, onChange, description }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; description?: string }) {
  const progress = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  function commit(next: number) {
    const clamped = Math.min(max, Math.max(min, Number.isFinite(next) ? next : value));
    onChange(Number((Math.round(clamped / step) * step).toFixed(6)));
  }

  return (
    <label className="grid gap-2 py-2 first:pt-0 last:pb-0 sm:grid-cols-[minmax(96px,0.8fr)_minmax(160px,1.8fr)_104px] sm:items-center">
      <div className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
        {description && <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <div className="min-w-0">
        <input
          className="slider-range w-full cursor-pointer appearance-none accent-cyan-500 touch-pan-x"
          style={{ "--slider-progress": `${progress}%` } as CSSProperties}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => commit(Number(event.target.value))}
          aria-label={label}
        />
        <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-1">
        <input
          className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-cyan-100"
          type="number"
          value={Number(value.toFixed(6))}
          min={min}
          max={max}
          step={step}
          onChange={(event) => commit(Number(event.target.value))}
          aria-label={`${label} exact value`}
        />
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-center text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-cyan-100">{roundTo(value, 3)}</span>
      </div>
    </label>
  );
}

function RatioCardGrid({ ratioDetails, sides, ratios }: { ratioDetails: typeof RATIO_DETAILS; sides: TriangleSides; ratios: TrigRatios }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {ratioDetails.map((ratio) => {
        const numerator = sides[ratio.numerator];
        const denominator = sides[ratio.denominator];
        const value = ratios[ratio.id];
        return (
          <div key={ratio.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">{ratio.title}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{ratio.formula}</p>
              </div>
              <span className={value === null ? "rounded-lg bg-rose-100 px-2 py-1 text-xs font-black text-rose-700 dark:bg-rose-400/15 dark:text-rose-100" : "rounded-lg bg-cyan-100 px-2 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100"}>
                {formatRatioValue(value)}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-xs">
              <SidePill side={ratio.numerator} value={numerator} />
              <span className="text-lg font-black text-slate-400">/</span>
              <SidePill side={ratio.denominator} value={denominator} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{value === null ? "This ratio is undefined because its denominator is zero or too close to zero." : ratio.note}</p>
            {ratio.reciprocal && <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Reciprocal pair: {ratio.id} <span aria-hidden="true">{"<->"}</span> {ratio.reciprocal}</p>}
          </div>
        );
      })}
    </div>
  );
}

function SidePill({ side, value }: { side: SideKey; value: number }) {
  return (
    <div className="rounded-lg border px-2 py-2" style={{ borderColor: SIDE_COLORS[side], color: SIDE_COLORS[side] }}>
      <p className="font-black capitalize">{side}</p>
      <p className="mt-1 font-mono text-[11px]">{roundTo(value, 3)}</p>
    </div>
  );
}

function SideLabelLegend({ normalized, hypotenuse, onNormalize }: { normalized: boolean; hypotenuse: number; onNormalize: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Side color key</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {normalized ? "With hypotenuse 1, adjacent is cosine and opposite is sine." : `Hypotenuse is ${roundTo(hypotenuse, 2)}. Scale changed, but every ratio card keeps the same value.`}
          </p>
        </div>
        <button type="button" className="tool-button h-9 w-9 justify-center p-0" onClick={onNormalize} title="Normalize to radius 1">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 grid gap-2 text-xs">
        <LegendRow label="Opposite / sine" color={SIDE_COLORS.opposite} />
        <LegendRow label="Adjacent / cosine" color={SIDE_COLORS.adjacent} />
        <LegendRow label="Hypotenuse / radius" color={SIDE_COLORS.hypotenuse} />
        <LegendRow label="Tangent rise/run" color={SIDE_COLORS.tangent} />
      </div>
    </div>
  );
}

function ReciprocalPairPanel({ ratios, expanded, onExpand }: { ratios: TrigRatios; expanded: boolean; onExpand: () => void }) {
  const pairs: Array<[RatioId, RatioId]> = [["sin", "csc"], ["cos", "sec"], ["tan", "cot"]];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Reciprocal pairs</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Reciprocal means flip numerator and denominator.</p>
        </div>
        {!expanded && (
          <button type="button" className="mini-chip" onClick={onExpand}>
            Show all six
          </button>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {pairs.map(([left, right]) => (
          <div key={left} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs dark:bg-white/5">
            <RatioMini id={left} value={ratios[left]} />
            <span className="font-black text-slate-400">flip</span>
            <RatioMini id={right} value={ratios[right]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepByStepPanel({ activeStep, setActiveStep, teachingMode, angle }: { activeStep: number; setActiveStep: (value: number) => void; teachingMode: TeachingMode; angle: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Step-by-step explanation</p>
      <div className="mt-3 space-y-2">
        {TEACHING_STEPS.map((step, index) => (
          <button
            key={step}
            type="button"
            className={index === activeStep ? "w-full rounded-lg border border-cyan-300 bg-cyan-50 p-2 text-left text-xs font-semibold text-cyan-900 dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-cyan-50" : "w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}
            onClick={() => setActiveStep(index)}
          >
            Step {index + 1}: {step}
          </button>
        ))}
      </div>
      {teachingMode === "professor" && (
        <p className="mt-3 rounded-lg bg-slate-100 p-2 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          At {roundTo(angle, 1)} degrees, every similar right triangle has the same ratios. Tangent is the slope of the radius arm: vertical change divided by horizontal change.
        </p>
      )}
    </div>
  );
}

function MisconceptionBox({ teachingMode }: { teachingMode: TeachingMode }) {
  const corrections = teachingMode === "beginner"
    ? [
        ["Adjacent is not any nearby side.", "It is the non-hypotenuse side touching theta."],
        ["Opposite is not based on the right angle.", "It is the side across from theta."],
        ["Tangent does not use the hypotenuse.", "It uses opposite divided by adjacent."],
      ]
    : [
        ["Bigger triangles do not have bigger sine.", "Side lengths scale together, so the ratio is unchanged."],
        ["cosec, sec, and cot are not new measurements.", "They are flipped sine, cosine, and tangent ratios."],
        ["Undefined is meaningful.", "A ratio with denominator 0 cannot be evaluated safely."],
      ];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50">
      <div className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4" />
        <p className="text-sm font-black">Common confusion</p>
      </div>
      <div className="mt-3 space-y-2">
        {corrections.map(([mistake, correction]) => (
          <div key={mistake} className="rounded-lg bg-white/55 p-2 text-xs leading-5 dark:bg-slate-950/30">
            <p className="font-black">{mistake}</p>
            <p>{correction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticePromptCard({ practiceAnswer, setPracticeAnswer }: { practiceAnswer: string | null; setPracticeAnswer: (value: string | null) => void }) {
  const options = [
    ["opposite", "Which side is across from theta?"],
    ["sine", "Which ratio uses opposite and hypotenuse?"],
    ["2", "If sin theta = 0.5, what is cosec theta?"],
  ];
  const feedback = practiceAnswer === null ? "Choose an answer to check your thinking." : practiceAnswer === "opposite" || practiceAnswer === "sine" || practiceAnswer === "2" ? "Correct. You matched the visual rule." : "Look again at the labels, then try the visual rule.";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
        <p className="text-sm font-black text-slate-950 dark:text-white">Quick practice</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">Answer one prompt, then hide labels and try again.</p>
      <div className="mt-3 space-y-2">
        {options.map(([answer, question]) => (
          <button key={question} type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" onClick={() => setPracticeAnswer(answer)}>
            {question}
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{feedback}</p>
    </div>
  );
}

function SegmentedButtons<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (value: T) => void }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-black uppercase text-slate-400">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-slate-950">
        {options.map(([id, optionLabel]) => (
          <button key={id} type="button" className={id === value ? "rounded-lg bg-cyan-600 px-2 py-1.5 text-xs font-black text-white shadow-sm" : "rounded-lg px-2 py-1.5 text-xs font-black text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"} onClick={() => onChange(id)} aria-pressed={id === value}>
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function RatioMini({ id, value }: { id: RatioId; value: number | null }) {
  return (
    <div className="rounded-md bg-white p-2 text-center dark:bg-slate-950/40">
      <p className="font-black uppercase text-slate-500 dark:text-slate-400">{id}</p>
      <p className="mt-1 font-mono font-black text-slate-950 dark:text-white">{formatRatioValue(value)}</p>
    </div>
  );
}

function LegendRow({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
}

function Point({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="7" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
      <SvgLabel x={x + 10} y={y - 10} text={label} color="#0f172a" />
    </g>
  );
}

function SvgLabel({ x, y, text, color }: { x: number | string; y: number | string; text: string; color: string }) {
  return (
    <text x={x} y={y} fill={color} fontSize="14" fontWeight="800" paintOrder="stroke" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      {text}
    </text>
  );
}

function GridLines() {
  return (
    <g opacity="0.55">
      {Array.from({ length: 9 }).map((_, i) => <line key={`x-${i}`} x1={40 + i * 55} y1="28" x2={40 + i * 55} y2="322" stroke="#e2e8f0" />)}
      {Array.from({ length: 6 }).map((_, i) => <line key={`y-${i}`} x1="36" y1={50 + i * 48} x2="484" y2={50 + i * 48} stroke="#e2e8f0" />)}
    </g>
  );
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value)) return value;
  return Math.abs(value) < EPSILON ? 0 : value;
}
