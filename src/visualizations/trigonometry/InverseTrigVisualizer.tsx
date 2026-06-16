import { CheckCircle2, GraduationCap, MousePointer2, RotateCcw, Target, TriangleAlert } from "lucide-react";
import { type PointerEvent, type ReactNode, useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";

export type InverseTrigId = "asin" | "acos" | "atan";

export type InverseTrigEvaluation = {
  input: number;
  angleRad: number | null;
  angleDeg: number | null;
  defined: boolean;
  reason?: string;
  domainLabel: string;
  rangeLabel: string;
};

type DisplayMode = "degrees" | "radians" | "both";
type LabMode = "explore" | "step" | "challenge";
type TeachingMode = "beginner" | "professor";
type FocusMode = "inverse" | "principal" | "equations" | "general";
type SamplePoint = { x: number; y: number | null };

const EPSILON = 1e-9;
const GRAPH_WIDTH = 420;
const GRAPH_HEIGHT = 300;
const PAD = 36;
const TAN_DISPLAY_LIMIT = 5;

const INVERSE_META: Record<
  InverseTrigId,
  {
    name: string;
    alt: string;
    original: string;
    color: string;
    inputWord: string;
    principalNote: string;
    exampleInput: number;
  }
> = {
  asin: {
    name: "sin^-1 x",
    alt: "arcsin x",
    original: "y = sin theta",
    color: "#06b6d4",
    inputWord: "vertical height",
    principalNote: "arcsin chooses angles from -90 deg to 90 deg.",
    exampleInput: 0.5,
  },
  acos: {
    name: "cos^-1 x",
    alt: "arccos x",
    original: "y = cos theta",
    color: "#8b5cf6",
    inputWord: "horizontal position",
    principalNote: "arccos chooses angles from 0 deg to 180 deg.",
    exampleInput: 0.5,
  },
  atan: {
    name: "tan^-1 x",
    alt: "arctan x",
    original: "y = tan theta",
    color: "#f59e0b",
    inputWord: "slope",
    principalNote: "arctan chooses angles between -90 deg and 90 deg.",
    exampleInput: 1,
  },
};

const STEPS = [
  "Start with the original trig graph.",
  "The full graph repeats values, so one ratio can come from many angles.",
  "Choose one branch so the inverse can be a function.",
  "Swap input and output by reflecting across y = x.",
  "Read the principal angle from the inverse graph.",
  "For equations, there may be more angles beyond the principal value.",
];

export function nearZero(value: number, tolerance = EPSILON) {
  return Number.isFinite(value) && Math.abs(value) < tolerance;
}

export function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function formatAngleDeg(deg: number | null) {
  if (deg === null || !Number.isFinite(deg)) return "undefined";
  const rounded = cleanNumber(deg);
  return `${formatNumber(rounded)} deg`;
}

export function formatAngleRad(rad: number | null) {
  if (rad === null || !Number.isFinite(rad)) return "undefined";
  if (nearZero(rad)) return "0";
  const sign = rad < 0 ? "-" : "";
  const abs = Math.abs(rad);
  const known: Array<[number, string]> = [
    [Math.PI, "pi"],
    [Math.PI / 2, "pi/2"],
    [Math.PI / 3, "pi/3"],
    [Math.PI / 4, "pi/4"],
    [Math.PI / 6, "pi/6"],
  ];
  for (const [value, label] of known) {
    if (Math.abs(abs - value) < 0.004) return `${sign}${label}`;
  }
  return `${formatNumber(cleanNumber(rad))} rad`;
}

export function getInverseTrigRestrictedDomain(id: InverseTrigId) {
  if (id === "acos") return { min: 0, max: Math.PI };
  return { min: -Math.PI / 2, max: Math.PI / 2, openMin: id === "atan", openMax: id === "atan" };
}

export function getInverseTrigRange(id: InverseTrigId) {
  if (id === "acos") return { minRad: 0, maxRad: Math.PI };
  return { minRad: -Math.PI / 2, maxRad: Math.PI / 2, openMin: id === "atan", openMax: id === "atan" };
}

export function evaluateInverseTrig(id: InverseTrigId, input: number): InverseTrigEvaluation {
  const domainLabel = getDomainLabel(id);
  const rangeLabel = getRangeLabel(id);
  if (!Number.isFinite(input)) {
    return { input, angleRad: null, angleDeg: null, defined: false, reason: "Input must be a finite number.", domainLabel, rangeLabel };
  }
  if ((id === "asin" || id === "acos") && (input < -1 || input > 1)) {
    return { input, angleRad: null, angleDeg: null, defined: false, reason: `${INVERSE_META[id].alt} only accepts inputs from -1 to 1.`, domainLabel, rangeLabel };
  }
  const angleRad = id === "asin" ? Math.asin(input) : id === "acos" ? Math.acos(input) : Math.atan(input);
  const safeRad = Number.isFinite(angleRad) ? cleanNumber(angleRad) : null;
  return {
    input,
    angleRad: safeRad,
    angleDeg: safeRad === null ? null : cleanNumber(radToDeg(safeRad)),
    defined: safeRad !== null,
    domainLabel,
    rangeLabel,
  };
}

export function getReflectedPoint(id: InverseTrigId, input: number) {
  const evaluation = evaluateInverseTrig(id, input);
  if (!evaluation.defined || evaluation.angleRad === null) return null;
  return {
    original: { x: evaluation.angleRad, y: input },
    inverse: { x: input, y: evaluation.angleRad },
  };
}

export function sampleRestrictedOriginalGraph(id: InverseTrigId): SamplePoint[] {
  const domain = getInverseTrigRestrictedDomain(id);
  const min = domain.min ?? -Math.PI / 2;
  const max = domain.max ?? Math.PI / 2;
  return Array.from({ length: 160 }, (_, index) => {
    const t = index / 159;
    const x = min + (max - min) * t;
    const y = id === "asin" ? Math.sin(x) : id === "acos" ? Math.cos(x) : safeTan(x);
    return { x: cleanNumber(x), y };
  });
}

export function sampleInverseGraph(id: InverseTrigId): SamplePoint[] {
  const min = id === "atan" ? -TAN_DISPLAY_LIMIT : -1;
  const max = id === "atan" ? TAN_DISPLAY_LIMIT : 1;
  return Array.from({ length: 160 }, (_, index) => {
    const x = min + (index / 159) * (max - min);
    const evaluation = evaluateInverseTrig(id, x);
    return { x: cleanNumber(x), y: evaluation.angleRad };
  });
}

export function getDomainLabel(id: InverseTrigId) {
  if (id === "atan") return "(-infinity, infinity)";
  return "[-1, 1]";
}

export function getRangeLabel(id: InverseTrigId) {
  if (id === "acos") return "[0, pi] or [0 deg, 180 deg]";
  if (id === "atan") return "(-pi/2, pi/2) or (-90 deg, 90 deg)";
  return "[-pi/2, pi/2] or [-90 deg, 90 deg]";
}

export default function InverseTrigVisualizer({
  defaultFunction = "asin",
  focus = "inverse",
  title = "Inverse Trigonometry Visual Lab",
}: {
  defaultFunction?: InverseTrigId;
  focus?: FocusMode;
  title?: string;
}) {
  const [id, setId] = useState<InverseTrigId>(defaultFunction);
  const [input, setInput] = useState(INVERSE_META[defaultFunction].exampleInput);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("both");
  const [labMode, setLabMode] = useState<LabMode>(focus === "equations" || focus === "general" ? "step" : "explore");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("beginner");
  const [activeStep, setActiveStep] = useState(focus === "principal" ? 2 : 0);
  const [challengePoint, setChallengePoint] = useState<{ x: number; y: number } | null>(null);
  const [challengeFeedback, setChallengeFeedback] = useState("Place the inverse point by swapping the original point coordinates.");
  const [toggles, setToggles] = useState({
    parent: true,
    restricted: true,
    reflection: true,
    unitCircle: true,
    domainRange: true,
    challenge: focus === "equations" || focus === "general" ? false : true,
  });

  const evaluation = evaluateInverseTrig(id, input);
  const reflected = getReflectedPoint(id, input);
  const sliderRange = id === "atan" ? { min: -5, max: 5, step: 0.01 } : { min: -1, max: 1, step: 0.01 };
  const equationSolutions = useMemo(() => getEquationSolutions(id, input), [id, input]);

  function setFunction(next: InverseTrigId) {
    setId(next);
    setInput(clamp(INVERSE_META[next].exampleInput, next === "atan" ? -5 : -1, next === "atan" ? 5 : 1));
    setChallengePoint(null);
    setChallengeFeedback("Place the inverse point by swapping the original point coordinates.");
  }

  function checkChallenge() {
    if (!challengePoint || !reflected) {
      setChallengeFeedback("Click the inverse graph where the mirrored point should land.");
      return;
    }
    const error = Math.hypot(challengePoint.x - reflected.inverse.x, challengePoint.y - reflected.inverse.y);
    setChallengeFeedback(error < 0.22 ? "Correct: you swapped x and y." : "Try again: the inverse point should be (ratio, angle).");
  }

  return (
    <SectionCard
      title={title}
      description="Flip a restricted trig graph across y = x and read the principal angle from the inverse graph."
      allowFullscreen
    >
      <div className="space-y-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(230px,280px)_1fr]">
          <ControlPanel
            id={id}
            setFunction={setFunction}
            input={input}
            setInput={setInput}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            labMode={labMode}
            setLabMode={setLabMode}
            teachingMode={teachingMode}
            setTeachingMode={setTeachingMode}
            sliderRange={sliderRange}
            toggles={toggles}
            setToggles={setToggles}
          />
          <div className="grid gap-3 2xl:grid-cols-2">
            <OriginalGraphPanel
              id={id}
              input={input}
              setInput={setInput}
              evaluation={evaluation}
              showParent={toggles.parent}
              showRestricted={toggles.restricted}
              activeStep={labMode === "step" ? activeStep : null}
              teachingMode={teachingMode}
            />
            <ReflectionGraphPanel
              id={id}
              evaluation={evaluation}
              reflected={reflected}
              showReflection={toggles.reflection}
              activeStep={labMode === "step" ? activeStep : null}
              challengePoint={challengePoint}
              setChallengePoint={setChallengePoint}
              challengeMode={labMode === "challenge" && toggles.challenge}
            />
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
          <PrincipalValueCard id={id} evaluation={evaluation} displayMode={displayMode} />
          {toggles.domainRange && <DomainRangePanel id={id} />}
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
          {toggles.unitCircle && <UnitCirclePrincipalValuePanel id={id} evaluation={evaluation} />}
          <StepByStepPanel activeStep={activeStep} setActiveStep={setActiveStep} labMode={labMode} teachingMode={teachingMode} />
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
          {toggles.challenge && (
            <ReflectionChallengeCard
              id={id}
              reflected={reflected}
              challengePoint={challengePoint}
              feedback={challengeFeedback}
              checkChallenge={checkChallenge}
              reset={() => {
                setChallengePoint(null);
                setChallengeFeedback("Place the inverse point by swapping the original point coordinates.");
              }}
            />
          )}
          <NotationMisconceptionBox id={id} equationSolutions={equationSolutions} focus={focus} />
        </div>
      </div>
    </SectionCard>
  );
}

function ControlPanel({
  id,
  setFunction,
  input,
  setInput,
  displayMode,
  setDisplayMode,
  labMode,
  setLabMode,
  teachingMode,
  setTeachingMode,
  sliderRange,
  toggles,
  setToggles,
}: {
  id: InverseTrigId;
  setFunction: (id: InverseTrigId) => void;
  input: number;
  setInput: (value: number) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  labMode: LabMode;
  setLabMode: (mode: LabMode) => void;
  teachingMode: TeachingMode;
  setTeachingMode: (mode: TeachingMode) => void;
  sliderRange: { min: number; max: number; step: number };
  toggles: Record<"parent" | "restricted" | "reflection" | "unitCircle" | "domainRange" | "challenge", boolean>;
  setToggles: (value: Record<"parent" | "restricted" | "reflection" | "unitCircle" | "domainRange" | "challenge", boolean>) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Inverse function</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["asin", "acos", "atan"] as InverseTrigId[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={id === option}
              className={id === option ? "rounded-xl bg-slate-950 px-2 py-2 text-xs font-black text-white dark:bg-cyan-300 dark:text-slate-950" : "rounded-xl border border-slate-200 px-2 py-2 text-xs font-black text-slate-700 dark:border-white/10 dark:text-slate-200"}
              onClick={() => setFunction(option)}
            >
              {INVERSE_META[option].alt}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-black text-slate-950 dark:text-white">Input ratio x</span>
        <input
          className="mt-3 w-full accent-cyan-500"
          type="range"
          min={sliderRange.min}
          max={sliderRange.max}
          step={sliderRange.step}
          value={input}
          onChange={(event) => setInput(Number(event.target.value))}
        />
        <div className="mt-2 grid grid-cols-[1fr_94px] gap-2">
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>{sliderRange.min}</span>
            <span>{sliderRange.max}</span>
          </div>
          <input
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-bold dark:border-white/10 dark:bg-slate-900 dark:text-white"
            type="number"
            min={sliderRange.min}
            max={sliderRange.max}
            step={sliderRange.step}
            value={Number(input.toFixed(4))}
            onChange={(event) => setInput(clamp(Number(event.target.value), sliderRange.min, sliderRange.max))}
            aria-label="Inverse trig input x exact value"
          />
        </div>
      </label>

      <Segmented label="Display" options={["degrees", "radians", "both"]} value={displayMode} onChange={(value) => setDisplayMode(value as DisplayMode)} />
      <Segmented label="Mode" options={["explore", "step", "challenge"]} value={labMode} onChange={(value) => setLabMode(value as LabMode)} />
      <Segmented label="Voice" options={["beginner", "professor"]} value={teachingMode} onChange={(value) => setTeachingMode(value as TeachingMode)} />

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Show</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(toggles).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={toggles[key as keyof typeof toggles]}
              className={toggles[key as keyof typeof toggles] ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100" : "mini-chip"}
              onClick={() => setToggles({ ...toggles, [key]: !toggles[key as keyof typeof toggles] })}
            >
              {labelize(key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OriginalGraphPanel({
  id,
  input,
  setInput,
  evaluation,
  showParent,
  showRestricted,
  activeStep,
  teachingMode,
}: {
  id: InverseTrigId;
  input: number;
  setInput: (value: number) => void;
  evaluation: InverseTrigEvaluation;
  showParent: boolean;
  showRestricted: boolean;
  activeStep: number | null;
  teachingMode: TeachingMode;
}) {
  const ranges = getOriginalRanges(id);
  const point = evaluation.angleRad === null ? null : { x: evaluation.angleRad, y: input };
  const [dragging, setDragging] = useState(false);

  function setFromPointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * GRAPH_WIDTH;
    const angle = fromScreenX(px, ranges.xMin, ranges.xMax);
    const next = id === "asin" ? Math.sin(angle) : id === "acos" ? Math.cos(angle) : Math.tan(clamp(angle, -1.47, 1.47));
    if (Number.isFinite(next)) setInput(cleanNumber(clamp(next, id === "atan" ? -TAN_DISPLAY_LIMIT : -1, id === "atan" ? TAN_DISPLAY_LIMIT : 1)));
  }

  return (
    <GraphShell
      title="Original restricted graph"
      eyebrow={INVERSE_META[id].original}
      note={teachingMode === "beginner" ? "Drag the point on the chosen branch. The y-value is the ratio you type into inverse trig." : "The highlighted interval is selected so the inverse passes the vertical-line test."}
    >
      <svg
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        className="h-[300px] w-full touch-none"
        role="img"
        aria-label={`${INVERSE_META[id].original} restricted branch with draggable point`}
        onPointerDown={(event) => {
          setDragging(true);
          setFromPointer(event);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragging) setFromPointer(event);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <GraphGrid xMin={ranges.xMin} xMax={ranges.xMax} yMin={ranges.yMin} yMax={ranges.yMax} />
        {showParent && <path d={pathFromSamples(sampleParentOriginalGraph(id), ranges)} fill="none" stroke="#94a3b8" strokeDasharray="5 7" strokeWidth="2" opacity="0.5" />}
        {showRestricted && <path d={pathFromSamples(sampleRestrictedOriginalGraph(id), ranges)} fill="none" stroke={INVERSE_META[id].color} strokeWidth={activeStep === 2 ? 7 : 4} strokeLinecap="round" />}
        {point && (
          <g>
            <line x1={toScreenX(ranges.xMin, ranges.xMin, ranges.xMax)} x2={toScreenX(point.x, ranges.xMin, ranges.xMax)} y1={toScreenY(point.y, ranges.yMin, ranges.yMax)} y2={toScreenY(point.y, ranges.yMin, ranges.yMax)} stroke="#10b981" strokeDasharray="5 5" />
            <line x1={toScreenX(point.x, ranges.xMin, ranges.xMax)} x2={toScreenX(point.x, ranges.xMin, ranges.xMax)} y1={toScreenY(ranges.yMin, ranges.yMin, ranges.yMax)} y2={toScreenY(point.y, ranges.yMin, ranges.yMax)} stroke="#f59e0b" strokeDasharray="5 5" />
            <circle cx={toScreenX(point.x, ranges.xMin, ranges.xMax)} cy={toScreenY(point.y, ranges.yMin, ranges.yMax)} r="8" fill="#0f172a" stroke="#f8fafc" strokeWidth="3" />
            <text x={toScreenX(point.x, ranges.xMin, ranges.xMax) + 10} y={toScreenY(point.y, ranges.yMin, ranges.yMax) - 10} className="fill-slate-900 text-[11px] font-black dark:fill-white">
              (angle, ratio)
            </text>
          </g>
        )}
        <text x="14" y="24" className="fill-slate-500 text-[11px] font-bold dark:fill-slate-300">restricted branch</text>
      </svg>
    </GraphShell>
  );
}

function ReflectionGraphPanel({
  id,
  evaluation,
  reflected,
  showReflection,
  activeStep,
  challengePoint,
  setChallengePoint,
  challengeMode,
}: {
  id: InverseTrigId;
  evaluation: InverseTrigEvaluation;
  reflected: ReturnType<typeof getReflectedPoint>;
  showReflection: boolean;
  activeStep: number | null;
  challengePoint: { x: number; y: number } | null;
  setChallengePoint: (point: { x: number; y: number }) => void;
  challengeMode: boolean;
}) {
  const ranges = getInverseRanges(id);

  function placeChallenge(event: PointerEvent<SVGSVGElement>) {
    if (!challengeMode) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * GRAPH_WIDTH;
    const py = ((event.clientY - rect.top) / rect.height) * GRAPH_HEIGHT;
    setChallengePoint({ x: cleanNumber(fromScreenX(px, ranges.xMin, ranges.xMax)), y: cleanNumber(fromScreenY(py, ranges.yMin, ranges.yMax)) });
  }

  return (
    <GraphShell
      title="Inverse graph"
      eyebrow={`${INVERSE_META[id].alt}: input ratio -> output angle`}
      note="The inverse point is the original point with coordinates swapped."
    >
      <svg
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        className="h-[300px] w-full touch-none"
        role="img"
        aria-label={`${INVERSE_META[id].alt} graph reflected across y equals x`}
        onPointerDown={placeChallenge}
      >
        <GraphGrid xMin={ranges.xMin} xMax={ranges.xMax} yMin={ranges.yMin} yMax={ranges.yMax} />
        {showReflection && <ReflectionLine ranges={ranges} active={activeStep === 3} />}
        <path d={pathFromSamples(sampleInverseGraph(id), ranges)} fill="none" stroke={INVERSE_META[id].color} strokeWidth={activeStep === 3 || activeStep === 4 ? 7 : 4} strokeLinecap="round" />
        {reflected && (
          <g>
            <line x1={toScreenX(reflected.inverse.x, ranges.xMin, ranges.xMax)} x2={toScreenX(reflected.inverse.x, ranges.xMin, ranges.xMax)} y1={toScreenY(ranges.yMin, ranges.yMin, ranges.yMax)} y2={toScreenY(reflected.inverse.y, ranges.yMin, ranges.yMax)} stroke="#10b981" strokeDasharray="5 5" />
            <line x1={toScreenX(ranges.xMin, ranges.xMin, ranges.xMax)} x2={toScreenX(reflected.inverse.x, ranges.xMin, ranges.xMax)} y1={toScreenY(reflected.inverse.y, ranges.yMin, ranges.yMax)} y2={toScreenY(reflected.inverse.y, ranges.yMin, ranges.yMax)} stroke="#f59e0b" strokeDasharray="5 5" />
            <circle cx={toScreenX(reflected.inverse.x, ranges.xMin, ranges.xMax)} cy={toScreenY(reflected.inverse.y, ranges.yMin, ranges.yMax)} r="8" fill="#0f172a" stroke="#f8fafc" strokeWidth="3" />
            <text x={toScreenX(reflected.inverse.x, ranges.xMin, ranges.xMax) + 10} y={toScreenY(reflected.inverse.y, ranges.yMin, ranges.yMax) - 10} className="fill-slate-900 text-[11px] font-black dark:fill-white">
              (ratio, angle)
            </text>
          </g>
        )}
        {challengePoint && challengeMode && (
          <g>
            <circle cx={toScreenX(challengePoint.x, ranges.xMin, ranges.xMax)} cy={toScreenY(challengePoint.y, ranges.yMin, ranges.yMax)} r="8" fill="#e11d48" stroke="#fff" strokeWidth="3" />
            <text x={toScreenX(challengePoint.x, ranges.xMin, ranges.xMax) + 10} y={toScreenY(challengePoint.y, ranges.yMin, ranges.yMax) + 18} className="fill-rose-600 text-[11px] font-black">
              your point
            </text>
          </g>
        )}
        {!evaluation.defined && <text x="22" y="42" className="fill-rose-600 text-[13px] font-black">Input outside domain</text>}
      </svg>
    </GraphShell>
  );
}

function PrincipalValueCard({ id, evaluation, displayMode }: { id: InverseTrigId; evaluation: InverseTrigEvaluation; displayMode: DisplayMode }) {
  const angleText = displayMode === "degrees" ? formatAngleDeg(evaluation.angleDeg) : displayMode === "radians" ? formatAngleRad(evaluation.angleRad) : `${formatAngleDeg(evaluation.angleDeg)} = ${formatAngleRad(evaluation.angleRad)}`;
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">Principal value</p>
          <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
            {INVERSE_META[id].alt}({formatNumber(evaluation.input)}) = {angleText}
          </h3>
        </div>
        {evaluation.defined ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <TriangleAlert className="h-6 w-6 text-rose-600" />}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <MiniFact label="Domain" value={evaluation.domainLabel} />
        <MiniFact label="Range" value={evaluation.rangeLabel} />
        <MiniFact label="Status" value={evaluation.defined ? "valid input" : evaluation.reason ?? "invalid input"} />
      </div>
    </div>
  );
}

function DomainRangePanel({ id }: { id: InverseTrigId }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Domain and range</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MiniFact label="Domain: allowed inputs" value={getDomainLabel(id)} />
        <MiniFact label="Range: possible outputs" value={getRangeLabel(id)} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Principal-value ranges are chosen so each input ratio has exactly one output angle on the inverse graph.
      </p>
    </div>
  );
}

function UnitCirclePrincipalValuePanel({ id, evaluation }: { id: InverseTrigId; evaluation: InverseTrigEvaluation }) {
  const angle = evaluation.angleRad ?? 0;
  const cx = 150;
  const cy = 150;
  const r = 94;
  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);
  const projectionLabel = id === "asin" ? "sine height" : id === "acos" ? "cosine position" : "tangent slope";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Unit-circle principal value</p>
      <div className="grid gap-4 md:grid-cols-[300px_1fr] md:items-center">
        <svg viewBox="0 0 300 300" className="h-[260px] w-full">
          <circle cx={cx} cy={cy} r={r} fill="#ecfeff" stroke="#06b6d4" strokeWidth="3" className="dark:fill-cyan-400/10" />
          <line x1="30" x2="270" y1={cy} y2={cy} stroke="#94a3b8" />
          <line x1={cx} x2={cx} y1="30" y2="270" stroke="#94a3b8" />
          <path d={`M${cx + 34},${cy} A34,34 0 0 ${angle < 0 ? 1 : 0} ${cx + 34 * Math.cos(angle)},${cy - 34 * Math.sin(angle)}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
          <line x1={cx} y1={cy} x2={x} y2={y} stroke="#0f172a" strokeWidth="4" className="dark:stroke-white" />
          <line x1={x} y1={cy} x2={x} y2={y} stroke="#10b981" strokeDasharray="5 5" strokeWidth="3" />
          <line x1={cx} y1={cy} x2={x} y2={cy} stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth="3" />
          {id === "atan" && evaluation.defined && <line x1={cx + r} y1={cy} x2={cx + r} y2={cy - r * Math.tan(angle)} stroke="#ef4444" strokeWidth="3" />}
          <circle cx={x} cy={y} r="7" fill={INVERSE_META[id].color} stroke="#fff" strokeWidth="3" />
          <text x="22" y="28" className="fill-slate-600 text-[12px] font-bold dark:fill-slate-300">{projectionLabel}</text>
        </svg>
        <div className="space-y-2">
          <p className="text-lg font-black text-slate-950 dark:text-white">{INVERSE_META[id].alt} returns an angle.</p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            The input {formatNumber(evaluation.input)} is a {INVERSE_META[id].inputWord}. The marked arm shows the chosen principal angle.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepByStepPanel({ activeStep, setActiveStep, labMode, teachingMode }: { activeStep: number; setActiveStep: (value: number) => void; labMode: LabMode; teachingMode: TeachingMode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Step-by-step</p>
        <GraduationCap className="h-5 w-5 text-violet-500" />
      </div>
      <div className="mt-3 space-y-2">
        {STEPS.map((step, index) => (
          <button
            key={step}
            type="button"
            className={index === activeStep ? "w-full rounded-xl border border-violet-300 bg-violet-50 p-3 text-left text-sm font-bold text-violet-950 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-100" : "w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"}
            onClick={() => setActiveStep(index)}
          >
            Step {index + 1}: {step}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {labMode === "step" ? "The selected step highlights the related graph element." : teachingMode === "professor" ? "Switch to Step mode for a formal branch-to-inverse derivation." : "Switch to Step mode when you want the visual story one move at a time."}
      </p>
    </div>
  );
}

function ReflectionChallengeCard({
  id,
  reflected,
  challengePoint,
  feedback,
  checkChallenge,
  reset,
}: {
  id: InverseTrigId;
  reflected: ReturnType<typeof getReflectedPoint>;
  challengePoint: { x: number; y: number } | null;
  feedback: string;
  checkChallenge: () => void;
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-400/20 dark:bg-amber-400/10">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-amber-600" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">Reflection challenge</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        Click the inverse graph where the mirrored point should go. The target is ({formatNumber(reflected?.inverse.x ?? 0)}, {formatAngleRad(reflected?.inverse.y ?? null)}).
      </p>
      <p className="mt-2 rounded-xl bg-white/75 p-3 text-sm font-bold text-slate-800 dark:bg-slate-950/50 dark:text-white">
        {challengePoint ? `Your point: (${formatNumber(challengePoint.x)}, ${formatNumber(challengePoint.y)})` : "No point placed yet."}
      </p>
      <p className="mt-2 text-sm font-bold text-amber-900 dark:text-amber-100">{feedback}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="action-primary" onClick={checkChallenge}>
          <MousePointer2 className="h-4 w-4" /> Check reflection
        </button>
        <button type="button" className="action-secondary" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{INVERSE_META[id].name} is learned by flipping coordinates, not by taking a reciprocal.</p>
    </div>
  );
}

function NotationMisconceptionBox({ id, equationSolutions, focus }: { id: InverseTrigId; equationSolutions: string[]; focus: FocusMode }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-400/20 dark:bg-rose-400/10">
      <div className="flex items-center gap-2">
        <TriangleAlert className="h-5 w-5 text-rose-600" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700 dark:text-rose-200">Common traps</p>
      </div>
      <div className="mt-3 grid gap-2">
        <Misconception title={`${INVERSE_META[id].name} is not 1/${id.slice(1)} x`} body="The -1 means inverse function here, not reciprocal." />
        <Misconception title="sin^2 x is different" body="sin^2 x means (sin x)^2. sin^-1 x means arcsin x." />
        <Misconception title="Inverse trig gives an angle" body="The input is a ratio. The output is the chosen principal angle." />
        <Misconception title="Principal value is not always every solution" body={`For equations, start with the principal value, then check other angles. Here: ${equationSolutions.join(", ") || "no finite sample solution"}.`} />
      </div>
      {(focus === "equations" || focus === "general") && (
        <div className="mt-3 rounded-xl bg-white/80 p-3 text-sm dark:bg-slate-950/50">
          <p className="font-black text-slate-950 dark:text-white">Equation warning</p>
          <p className="mt-1 leading-6 text-slate-600 dark:text-slate-300">
            Inverse trig gives the principal value first. Equation-solving may need all angles in the requested interval.
          </p>
        </div>
      )}
    </div>
  );
}

function Segmented({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
      <div className="grid gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/10" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            className={value === option ? "rounded-lg bg-white px-2 py-1.5 text-xs font-black text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white" : "rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-300"}
            onClick={() => onChange(option)}
          >
            {labelize(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function GraphShell({ title, eyebrow, note, children }: { title: string; eyebrow: string; note: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/60">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
        <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{note}</p>
      </div>
      <div className="bg-slate-50 p-2 dark:bg-slate-900/70">{children}</div>
    </div>
  );
}

function GraphGrid({ xMin, xMax, yMin, yMax }: { xMin: number; xMax: number; yMin: number; yMax: number }) {
  const xZero = toScreenX(0, xMin, xMax);
  const yZero = toScreenY(0, yMin, yMax);
  return (
    <g>
      <rect x="0" y="0" width={GRAPH_WIDTH} height={GRAPH_HEIGHT} rx="16" fill="white" className="dark:fill-slate-950" />
      {Array.from({ length: 9 }).map((_, index) => {
        const x = PAD + index * ((GRAPH_WIDTH - PAD * 2) / 8);
        return <line key={`gx-${index}`} x1={x} x2={x} y1={PAD} y2={GRAPH_HEIGHT - PAD} stroke="#e2e8f0" className="dark:stroke-slate-800" />;
      })}
      {Array.from({ length: 7 }).map((_, index) => {
        const y = PAD + index * ((GRAPH_HEIGHT - PAD * 2) / 6);
        return <line key={`gy-${index}`} x1={PAD} x2={GRAPH_WIDTH - PAD} y1={y} y2={y} stroke="#e2e8f0" className="dark:stroke-slate-800" />;
      })}
      <line x1={PAD} x2={GRAPH_WIDTH - PAD} y1={yZero} y2={yZero} stroke="#94a3b8" strokeWidth="1.4" />
      <line x1={xZero} x2={xZero} y1={PAD} y2={GRAPH_HEIGHT - PAD} stroke="#94a3b8" strokeWidth="1.4" />
    </g>
  );
}

function ReflectionLine({ ranges, active }: { ranges: ReturnType<typeof getInverseRanges>; active: boolean }) {
  const min = Math.max(ranges.xMin, ranges.yMin);
  const max = Math.min(ranges.xMax, ranges.yMax);
  return (
    <g>
      <line x1={toScreenX(min, ranges.xMin, ranges.xMax)} y1={toScreenY(min, ranges.yMin, ranges.yMax)} x2={toScreenX(max, ranges.xMin, ranges.xMax)} y2={toScreenY(max, ranges.yMin, ranges.yMax)} stroke="#ef4444" strokeWidth={active ? 5 : 3} strokeDasharray="7 6" />
      <text x={toScreenX(max, ranges.xMin, ranges.xMax) - 44} y={toScreenY(max, ranges.yMin, ranges.yMax) - 8} className="fill-rose-600 text-[11px] font-black">y = x</text>
    </g>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function Misconception({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white/80 p-3 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">{title}</p>
      <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}

function getOriginalRanges(id: InverseTrigId) {
  if (id === "acos") return { xMin: -0.25, xMax: Math.PI + 0.25, yMin: -1.25, yMax: 1.25 };
  if (id === "atan") return { xMin: -Math.PI / 2, xMax: Math.PI / 2, yMin: -TAN_DISPLAY_LIMIT, yMax: TAN_DISPLAY_LIMIT };
  return { xMin: -Math.PI / 2 - 0.2, xMax: Math.PI / 2 + 0.2, yMin: -1.25, yMax: 1.25 };
}

function getInverseRanges(id: InverseTrigId) {
  if (id === "acos") return { xMin: -1.25, xMax: 1.25, yMin: -0.25, yMax: Math.PI + 0.25 };
  if (id === "atan") return { xMin: -TAN_DISPLAY_LIMIT, xMax: TAN_DISPLAY_LIMIT, yMin: -Math.PI / 2 - 0.2, yMax: Math.PI / 2 + 0.2 };
  return { xMin: -1.25, xMax: 1.25, yMin: -Math.PI / 2 - 0.2, yMax: Math.PI / 2 + 0.2 };
}

function sampleParentOriginalGraph(id: InverseTrigId): SamplePoint[] {
  const min = id === "acos" ? -Math.PI : -Math.PI * 2;
  const max = id === "acos" ? Math.PI * 2 : Math.PI * 2;
  return Array.from({ length: 240 }, (_, index) => {
    const x = min + (index / 239) * (max - min);
    const raw = id === "asin" ? Math.sin(x) : id === "acos" ? Math.cos(x) : safeTan(x);
    const y = raw === null || Math.abs(raw) > TAN_DISPLAY_LIMIT ? null : raw;
    return { x: cleanNumber(x), y };
  });
}

function pathFromSamples(samples: SamplePoint[], ranges: { xMin: number; xMax: number; yMin: number; yMax: number }) {
  let path = "";
  let drawing = false;
  for (const sample of samples) {
    if (sample.y === null || !Number.isFinite(sample.y)) {
      drawing = false;
      continue;
    }
    const x = toScreenX(sample.x, ranges.xMin, ranges.xMax);
    const y = toScreenY(sample.y, ranges.yMin, ranges.yMax);
    path += `${drawing ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)} `;
    drawing = true;
  }
  return path.trim();
}

function toScreenX(value: number, min: number, max: number) {
  return PAD + ((value - min) / (max - min)) * (GRAPH_WIDTH - PAD * 2);
}

function toScreenY(value: number, min: number, max: number) {
  return GRAPH_HEIGHT - PAD - ((value - min) / (max - min)) * (GRAPH_HEIGHT - PAD * 2);
}

function fromScreenX(value: number, min: number, max: number) {
  return min + ((value - PAD) / (GRAPH_WIDTH - PAD * 2)) * (max - min);
}

function fromScreenY(value: number, min: number, max: number) {
  return min + ((GRAPH_HEIGHT - PAD - value) / (GRAPH_HEIGHT - PAD * 2)) * (max - min);
}

function safeTan(value: number): number | null {
  if (!Number.isFinite(value) || Math.abs(Math.cos(value)) < 0.018) return null;
  const result = Math.tan(value);
  return Number.isFinite(result) ? cleanNumber(result) : null;
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value)) return 0;
  const rounded = Number(value.toFixed(8));
  return nearZero(rounded) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  return cleanNumber(value).toFixed(3).replace(/\.?0+$/, "");
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

function getEquationSolutions(id: InverseTrigId, input: number) {
  const evaluation = evaluateInverseTrig(id, input);
  if (!evaluation.defined || evaluation.angleDeg === null) return [];
  if (id === "asin") {
    const first = normalizeDeg(evaluation.angleDeg);
    const second = normalizeDeg(180 - evaluation.angleDeg);
    return uniqueNumbers([first, second]).map((value) => `${formatNumber(value)} deg`);
  }
  if (id === "acos") {
    const first = normalizeDeg(evaluation.angleDeg);
    const second = normalizeDeg(360 - evaluation.angleDeg);
    return uniqueNumbers([first, second]).map((value) => `${formatNumber(value)} deg`);
  }
  return [`${formatNumber(evaluation.angleDeg)} deg + 180 deg * n`];
}

function normalizeDeg(value: number) {
  const normalized = ((value % 360) + 360) % 360;
  return cleanNumber(normalized);
}

function uniqueNumbers(values: number[]) {
  return values.filter((value, index) => values.findIndex((candidate) => Math.abs(candidate - value) < 0.001) === index);
}
