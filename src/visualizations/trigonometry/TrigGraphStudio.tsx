import { BookOpen, CheckCircle2, Eye, GraduationCap, Pause, Play, RotateCcw, Target, TriangleAlert } from "lucide-react";
import { type CSSProperties, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import { roundTo } from "../../utils/math";

export type TrigGraphFunction = "sin" | "cos" | "tan";

export type GraphTransformState = {
  fn: TrigGraphFunction;
  amplitude: number;
  frequency: number;
  phase: number;
  verticalShift: number;
};

type StudioMode = "explore" | "step" | "challenge";
type TeachingMode = "beginner" | "professor";
type Emphasis = "a" | "b" | "c" | "d" | "parent";
type ToggleKey = "parent" | "grid" | "labels" | "bounds" | "midline" | "period" | "phase" | "circle" | "animate";
type SamplePoint = { x: number; y: number | null; segmentId: number };

const EPSILON = 1e-6;
const TAN_ASYMPTOTE_EPSILON = 0.035;
const X_MIN = -Math.PI * 2;
const X_MAX = Math.PI * 2;
const Y_LIMIT = 4.5;
const COLORS = {
  transformed: "#06b6d4",
  parent: "#94a3b8",
  amplitude: "#10b981",
  period: "#8b5cf6",
  phase: "#f59e0b",
  midline: "#f97316",
  tangent: "#ec4899",
  target: "#e11d48",
};

const DEFAULT_TARGETS: GraphTransformState[] = [
  { fn: "sin", amplitude: 1.5, frequency: 2, phase: -Math.PI / 2, verticalShift: 1 },
  { fn: "cos", amplitude: 2, frequency: 1, phase: Math.PI / 2, verticalShift: -1 },
  { fn: "sin", amplitude: 0.5, frequency: 0.5, phase: Math.PI, verticalShift: 2 },
  { fn: "cos", amplitude: 1, frequency: 2, phase: -Math.PI, verticalShift: 0 },
];

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function nearZero(value: number, tolerance = EPSILON) {
  return !Number.isFinite(value) || Math.abs(value) < tolerance;
}

export function safeTan(value: number): number | null {
  if (!Number.isFinite(value) || Math.abs(Math.cos(value)) < TAN_ASYMPTOTE_EPSILON) return null;
  return cleanNumber(Math.tan(value));
}

export function evaluateTrigGraphPoint(state: GraphTransformState, x: number): number | null {
  const input = state.frequency * x + state.phase;
  let base: number | null;
  if (state.fn === "sin") base = Math.sin(input);
  else if (state.fn === "cos") base = Math.cos(input);
  else base = safeTan(input);
  if (base === null || !Number.isFinite(base)) return null;
  const y = state.amplitude * base + state.verticalShift;
  return Number.isFinite(y) ? cleanNumber(y) : null;
}

export function getTrigGraphPeriod(state: GraphTransformState): number | null {
  if (nearZero(state.frequency)) return null;
  return state.fn === "tan" ? Math.PI / Math.abs(state.frequency) : (Math.PI * 2) / Math.abs(state.frequency);
}

export function getPhaseShift(state: GraphTransformState): number | null {
  if (nearZero(state.frequency)) return null;
  return cleanNumber(-state.phase / state.frequency);
}

export function getAmplitudeBounds(state: GraphTransformState): { upper: number; lower: number } | null {
  if (state.fn === "tan") return null;
  const magnitude = Math.abs(state.amplitude);
  return { upper: cleanNumber(state.verticalShift + magnitude), lower: cleanNumber(state.verticalShift - magnitude) };
}

export function sampleTrigGraph(state: GraphTransformState, xMin: number, xMax: number, sampleCount: number): SamplePoint[] {
  const samples: SamplePoint[] = [];
  let segmentId = 0;
  let previousWasNull = true;
  let previousY: number | null = null;
  for (let index = 0; index < sampleCount; index += 1) {
    const x = xMin + (index / Math.max(1, sampleCount - 1)) * (xMax - xMin);
    const y = evaluateTrigGraphPoint(state, x);
    const clipped = y === null || !Number.isFinite(y) || Math.abs(y) > Y_LIMIT ? null : y;
    if (clipped === null) {
      previousWasNull = true;
      previousY = null;
      samples.push({ x, y: null, segmentId });
      continue;
    }
    if (previousWasNull || (previousY !== null && Math.abs(clipped - previousY) > Y_LIMIT * 1.35)) {
      segmentId += 1;
    }
    samples.push({ x, y: clipped, segmentId });
    previousWasNull = false;
    previousY = clipped;
  }
  return samples;
}

export default function TrigGraphStudio({
  defaultFunction = "sin",
  emphasis = "parent",
  title = "Trigonometry Graph Studio",
}: {
  defaultFunction?: TrigGraphFunction;
  emphasis?: Emphasis;
  title?: string;
}) {
  const [state, setState] = useState<GraphTransformState>(() => initialState(defaultFunction, emphasis));
  const [xValue, setXValue] = useState(0);
  const [mode, setMode] = useState<StudioMode>("explore");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("beginner");
  const [activeParam, setActiveParam] = useState<Emphasis>(emphasis);
  const [stepIndex, setStepIndex] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeFeedback, setChallengeFeedback] = useState("Adjust the sliders, then check the match.");
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    parent: true,
    grid: true,
    labels: true,
    bounds: true,
    midline: true,
    period: true,
    phase: true,
    circle: true,
    animate: false,
  });

  const challengeTarget = DEFAULT_TARGETS[challengeIndex % DEFAULT_TARGETS.length];
  const activeState = mode === "challenge" ? { ...state, fn: challengeTarget.fn } : state;
  const value = evaluateTrigGraphPoint(activeState, xValue);
  const period = getTrigGraphPeriod(activeState);
  const phaseShift = getPhaseShift(activeState);

  useEffect(() => {
    if (!toggles.animate) return undefined;
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;
    const interval = window.setInterval(() => {
      setXValue((value) => wrapX(value + 0.035));
    }, 40);
    return () => window.clearInterval(interval);
  }, [toggles.animate]);

  function updateState(partial: Partial<GraphTransformState>, param?: Emphasis) {
    setState((current) => ({ ...current, ...partial }));
    if (param) setActiveParam(param);
  }

  function setFunction(fn: TrigGraphFunction) {
    setState((current) => ({ ...current, fn }));
    setActiveParam("parent");
  }

  function reset() {
    setState(initialState(defaultFunction, emphasis));
    setXValue(0);
    setMode("explore");
    setTeachingMode("beginner");
    setActiveParam(emphasis);
    setStepIndex(0);
    setChallengeFeedback("Adjust the sliders, then check the match.");
    setToggles({ parent: true, grid: true, labels: true, bounds: true, midline: true, period: true, phase: true, circle: true, animate: false });
  }

  return (
    <SectionCard
      title={title}
      description="Design sine, cosine, and tangent graphs by changing height, cycle length, slide, and lift."
      allowFullscreen
      headerAction={
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tool-button gap-2" onClick={() => setTeachingMode((mode) => (mode === "beginner" ? "professor" : "beginner"))} aria-pressed={teachingMode === "professor"}>
            {teachingMode === "beginner" ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
            <span className="hidden sm:inline">{teachingMode === "beginner" ? "Beginner" : "Professor"}</span>
          </button>
          <button type="button" className="tool-button h-9 w-9 justify-center p-0" onClick={reset} title="Reset graph studio">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[310px_minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <FunctionSelector value={activeState.fn} onChange={setFunction} locked={mode === "challenge"} />
          <FormulaParameterHighlighter state={activeState} activeParam={activeParam} setActiveParam={setActiveParam} teachingMode={teachingMode} />
          <StudioModePanel mode={mode} setMode={setMode} stepIndex={stepIndex} setStepIndex={setStepIndex} />
        </div>
        <div className="space-y-4">
          <TrigGraphCanvas
            state={activeState}
            target={mode === "challenge" ? challengeTarget : null}
            xValue={xValue}
            setXValue={setXValue}
            toggles={toggles}
            activeParam={activeParam}
            setActiveParam={setActiveParam}
          />
          <TransformationControlPanel
            state={activeState}
            editableState={state}
            updateState={updateState}
            xValue={xValue}
            setXValue={setXValue}
            toggles={toggles}
            setToggles={setToggles}
            challengeLockedFn={mode === "challenge"}
          />
        </div>
        <div className="space-y-4">
          <LiveValuesPanel state={activeState} xValue={xValue} value={value} period={period} phaseShift={phaseShift} />
          {toggles.circle && <UnitCircleWaveLink state={activeState} xValue={xValue} value={value} />}
          {mode === "step" && <StepModePanel state={activeState} stepIndex={stepIndex} setStepIndex={setStepIndex} setActiveParam={setActiveParam} teachingMode={teachingMode} />}
          {mode === "challenge" && <MatchTheGraphPanel target={challengeTarget} state={state} feedback={challengeFeedback} setFeedback={setChallengeFeedback} setChallengeIndex={setChallengeIndex} />}
          <MisconceptionBox fn={activeState.fn} />
          <PracticePromptCard state={activeState} />
        </div>
      </div>
    </SectionCard>
  );
}

function FunctionSelector({ value, onChange, locked }: { value: TrigGraphFunction; onChange: (value: TrigGraphFunction) => void; locked: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Function selector</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{locked ? "Challenge chooses the target function." : "Choose the parent graph to transform."}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["sin", "cos", "tan"] as const).map((fn) => (
          <button key={fn} type="button" disabled={locked} onClick={() => onChange(fn)} className={value === fn ? "action-primary justify-center px-2 py-2 text-xs" : "tool-button justify-center px-2 py-2 text-xs disabled:opacity-50"} aria-pressed={value === fn}>
            {fn}
          </button>
        ))}
      </div>
    </div>
  );
}

function FormulaParameterHighlighter({ state, activeParam, setActiveParam, teachingMode }: { state: GraphTransformState; activeParam: Emphasis; setActiveParam: (value: Emphasis) => void; teachingMode: TeachingMode }) {
  const formula = `y = ${formatParam(state.amplitude)} ${state.fn}(${formatParam(state.frequency)}x ${signedRadians(state.phase)}) ${signedNumber(state.verticalShift)}`;
  const cards: Array<[Emphasis, string, string, string]> = [
    ["a", "a", "height / amplitude", "Distance from midline to peak for sine and cosine."],
    ["b", "b", "speed / frequency", "Larger b means a shorter period."],
    ["c", "c", "slide / phase", "Actual phase shift is -c/b."],
    ["d", "d", "lift / midline", "Moves the middle line up or down."],
  ];
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-300/20 dark:bg-violet-400/10">
      <p className="text-xs font-black uppercase text-violet-700 dark:text-violet-200">Formula parameter highlighter</p>
      <p className="mt-2 break-words rounded-lg bg-white px-2 py-2 font-mono text-sm font-black text-slate-950 dark:bg-slate-950/60 dark:text-white">{formula}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {cards.map(([id, symbol, label, text]) => (
          <button key={id} type="button" onClick={() => setActiveParam(id)} className={activeParam === id ? "rounded-lg border border-cyan-300 bg-cyan-50 p-2 text-left text-cyan-950 dark:border-cyan-300/40 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-lg border border-slate-200 bg-white/70 p-2 text-left text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}>
            <p className="font-mono text-sm font-black">{symbol}: {label}</p>
            <p className="mt-1 text-xs leading-5">{teachingMode === "beginner" ? beginnerParameterText(id) : text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StudioModePanel({ mode, setMode, stepIndex, setStepIndex }: { mode: StudioMode; setMode: (mode: StudioMode) => void; stepIndex: number; setStepIndex: (value: number) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Mode</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["explore", "step", "challenge"] as const).map((item) => (
          <button key={item} type="button" className={mode === item ? "action-primary justify-center px-2 py-2 text-xs capitalize" : "tool-button justify-center px-2 py-2 text-xs capitalize"} onClick={() => setMode(item)} aria-pressed={mode === item}>
            {item}
          </button>
        ))}
      </div>
      {mode === "step" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((step) => <button key={step} type="button" className={stepIndex === step ? "mini-chip bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100" : "mini-chip"} onClick={() => setStepIndex(step)}>Step {step + 1}</button>)}
        </div>
      )}
    </div>
  );
}

function TrigGraphCanvas({
  state,
  target,
  xValue,
  setXValue,
  toggles,
  activeParam,
  setActiveParam,
}: {
  state: GraphTransformState;
  target: GraphTransformState | null;
  xValue: number;
  setXValue: (value: number) => void;
  toggles: Record<ToggleKey, boolean>;
  activeParam: Emphasis;
  setActiveParam: (value: Emphasis) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 820;
  const height = 440;
  const plot = { left: 58, right: 790, top: 28, bottom: 380 };
  const innerW = plot.right - plot.left;
  const innerH = plot.bottom - plot.top;
  const parentState = useMemo<GraphTransformState>(() => ({ fn: state.fn, amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 }), [state.fn]);
  const transformedSamples = useMemo(() => sampleTrigGraph(state, X_MIN, X_MAX, 720), [state]);
  const parentSamples = useMemo(() => sampleTrigGraph(parentState, X_MIN, X_MAX, 720), [parentState]);
  const targetSamples = useMemo(() => (target ? sampleTrigGraph(target, X_MIN, X_MAX, 720) : []), [target]);
  const yToPixel = (y: number) => plot.top + (Y_LIMIT - y) / (Y_LIMIT * 2) * innerH;
  const xToPixel = (x: number) => plot.left + (x - X_MIN) / (X_MAX - X_MIN) * innerW;
  const pixelToX = (pixelX: number) => X_MIN + ((pixelX - plot.left) / innerW) * (X_MAX - X_MIN);
  const currentY = evaluateTrigGraphPoint(state, xValue);
  const currentXPixel = xToPixel(xValue);
  const currentYPixel = currentY === null || Math.abs(currentY) > Y_LIMIT ? null : yToPixel(currentY);
  const bounds = getAmplitudeBounds(state);
  const period = getTrigGraphPeriod(state);
  const phaseShift = getPhaseShift(state);
  const phaseX = phaseShift === null ? null : xToPixel(clamp(phaseShift, X_MIN, X_MAX));

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    setXValue(clamp(pixelToX(x), X_MIN, X_MAX));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Trig graph canvas</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Drag across the graph to scrub x. Tangent curves break at asymptotes.</p>
        </div>
        <span className="mini-chip">x = {formatRadians(xValue)}</span>
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="h-[440px] w-full touch-none" role="img" aria-label="Interactive trigonometry graph studio. Use the x scrubber slider below as a keyboard fallback." onPointerDown={handlePointer} onPointerMove={(event) => { if (event.buttons === 1) handlePointer(event); }}>
        <rect width={width} height={height} rx="22" fill="#f8fafc" className="dark:fill-slate-900" />
        {toggles.grid && <GraphGrid plot={plot} xToPixel={xToPixel} yToPixel={yToPixel} />}
        <line x1={plot.left} y1={yToPixel(0)} x2={plot.right} y2={yToPixel(0)} stroke="#64748b" strokeWidth="2" />
        <line x1={xToPixel(0)} y1={plot.top} x2={xToPixel(0)} y2={plot.bottom} stroke="#64748b" strokeWidth="2" />
        {state.fn === "tan" && <TangentAsymptotes state={state} xToPixel={xToPixel} plot={plot} />}
        {toggles.midline && <OverlayLine y={yToPixel(state.verticalShift)} x1={plot.left} x2={plot.right} color={COLORS.midline} label={`midline y=${formatNumber(state.verticalShift)}`} />}
        {toggles.bounds && bounds && (
          <>
            <OverlayLine y={yToPixel(bounds.upper)} x1={plot.left} x2={plot.right} color={COLORS.amplitude} label={`top d+|a|=${formatNumber(bounds.upper)}`} />
            <OverlayLine y={yToPixel(bounds.lower)} x1={plot.left} x2={plot.right} color={COLORS.amplitude} label={`bottom d-|a|=${formatNumber(bounds.lower)}`} />
            <line x1={plot.right - 52} y1={yToPixel(state.verticalShift)} x2={plot.right - 52} y2={yToPixel(bounds.upper)} stroke={COLORS.amplitude} strokeWidth={activeParam === "a" ? 6 : 3} />
          </>
        )}
        {toggles.phase && phaseX !== null && (
          <g onMouseEnter={() => setActiveParam("c")}>
            <line x1={xToPixel(0)} y1={plot.bottom + 24} x2={phaseX} y2={plot.bottom + 24} stroke={COLORS.phase} strokeWidth={activeParam === "c" ? 5 : 3} markerEnd="url(#arrowPhase)" />
            <text x={(xToPixel(0) + phaseX) / 2 - 44} y={plot.bottom + 44} fill={COLORS.phase} fontSize="12" fontWeight="900">phase shift {-state.phase >= 0 ? "" : ""}{formatRadians(phaseShift ?? 0)}</text>
          </g>
        )}
        {toggles.period && period && (
          <g onMouseEnter={() => setActiveParam("b")}>
            <line x1={xToPixel(0)} y1={plot.top + 18} x2={xToPixel(Math.min(X_MAX, period))} y2={plot.top + 18} stroke={COLORS.period} strokeWidth={activeParam === "b" ? 5 : 3} />
            <line x1={xToPixel(0)} y1={plot.top + 10} x2={xToPixel(0)} y2={plot.top + 26} stroke={COLORS.period} strokeWidth="3" />
            <line x1={xToPixel(Math.min(X_MAX, period))} y1={plot.top + 10} x2={xToPixel(Math.min(X_MAX, period))} y2={plot.top + 26} stroke={COLORS.period} strokeWidth="3" />
            <text x={xToPixel(Math.min(X_MAX, period / 2)) - 28} y={plot.top + 12} fill={COLORS.period} fontSize="12" fontWeight="900">period</text>
          </g>
        )}
        <defs>
          <marker id="arrowPhase" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={COLORS.phase} /></marker>
        </defs>
        {toggles.parent && <GraphPaths samples={parentSamples} xToPixel={xToPixel} yToPixel={yToPixel} color={COLORS.parent} width={2.4} dash="6 5" />}
        {target && <GraphPaths samples={targetSamples} xToPixel={xToPixel} yToPixel={yToPixel} color={COLORS.target} width={3} dash="4 4" />}
        <GraphPaths samples={transformedSamples} xToPixel={xToPixel} yToPixel={yToPixel} color={COLORS.transformed} width={4} />
        <line x1={currentXPixel} y1={plot.top} x2={currentXPixel} y2={plot.bottom} stroke="#0f172a" strokeDasharray="5 5" opacity="0.6" />
        {currentYPixel !== null ? <circle cx={currentXPixel} cy={currentYPixel} r="7" fill={COLORS.transformed} stroke="#0f172a" strokeWidth="2" /> : <text x={Math.min(plot.right - 116, currentXPixel + 8)} y={plot.top + 28} fill={COLORS.tangent} fontSize="12" fontWeight="900">undefined here</text>}
        {toggles.labels && <AxisLabels plot={plot} xToPixel={xToPixel} yToPixel={yToPixel} />}
        <text x={plot.left} y={height - 16} fill="#475569" fontSize="12" fontWeight="800">transformed</text>
        <circle cx={plot.left + 90} cy={height - 20} r="5" fill={COLORS.transformed} />
        {toggles.parent && <><text x={plot.left + 116} y={height - 16} fill="#64748b" fontSize="12" fontWeight="800">parent</text><circle cx={plot.left + 196} cy={height - 20} r="5" fill={COLORS.parent} /></>}
        {target && <><text x={plot.left + 220} y={height - 16} fill={COLORS.target} fontSize="12" fontWeight="800">target</text><circle cx={plot.left + 294} cy={height - 20} r="5" fill={COLORS.target} /></>}
      </svg>
    </div>
  );
}

function TransformationControlPanel({
  state,
  editableState,
  updateState,
  xValue,
  setXValue,
  toggles,
  setToggles,
}: {
  state: GraphTransformState;
  editableState: GraphTransformState;
  updateState: (partial: Partial<GraphTransformState>, param?: Emphasis) => void;
  xValue: number;
  setXValue: (value: number) => void;
  toggles: Record<ToggleKey, boolean>;
  setToggles: (value: Record<ToggleKey, boolean>) => void;
  challengeLockedFn: boolean;
}) {
  const toggleLabels: Array<[ToggleKey, string]> = [
    ["parent", "parent"],
    ["grid", "grid"],
    ["labels", "labels"],
    ["bounds", "bounds"],
    ["midline", "midline"],
    ["period", "period"],
    ["phase", "phase"],
    ["circle", "circle"],
    ["animate", "animate"],
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-3 md:grid-cols-2">
          <StudioSlider label="a amplitude/stretch" value={editableState.amplitude} min={-3} max={3} step={0.1} onChange={(value) => updateState({ amplitude: value }, "a")} />
          <StudioSlider label="b frequency" value={editableState.frequency} min={0.25} max={4} step={0.05} onChange={(value) => updateState({ frequency: value }, "b")} />
          <StudioSlider label="c phase" value={editableState.phase} min={-Math.PI * 2} max={Math.PI * 2} step={0.05} onChange={(value) => updateState({ phase: value }, "c")} valueLabel={formatRadians(editableState.phase)} />
          <StudioSlider label="d vertical shift" value={editableState.verticalShift} min={-3} max={3} step={0.1} onChange={(value) => updateState({ verticalShift: value }, "d")} />
          <StudioSlider label="x scrubber" value={xValue} min={X_MIN} max={X_MAX} step={0.02} onChange={setXValue} valueLabel={formatRadians(xValue)} wide />
        </div>
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <button type="button" className={toggles.animate ? "action-primary gap-2" : "tool-button gap-2"} onClick={() => setToggles({ ...toggles, animate: !toggles.animate })}>
              {toggles.animate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {toggles.animate ? "Pause" : "Play"}
            </button>
            <span className="mini-chip">period {formatNullable(getTrigGraphPeriod(state), formatRadians)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {toggleLabels.map(([key, label]) => (
              <button key={key} type="button" className={toggles[key] ? "tool-button justify-center gap-2 bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-50" : "tool-button justify-center gap-2"} onClick={() => setToggles({ ...toggles, [key]: !toggles[key] })} aria-pressed={toggles[key]}>
                <Eye className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveValuesPanel({ state, xValue, value, period, phaseShift }: { state: GraphTransformState; xValue: number; value: number | null; period: number | null; phaseShift: number | null }) {
  const bounds = getAmplitudeBounds(state);
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <p className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white"><CheckCircle2 className="h-4 w-4" /> Live graph values</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="x" value={formatRadians(xValue)} />
        <Metric label="y" value={formatGraphValue(value)} />
        <Metric label="period" value={formatNullable(period, formatRadians)} />
        <Metric label="phase shift" value={formatNullable(phaseShift, formatRadians)} />
        <Metric label="midline" value={`y=${formatNumber(state.verticalShift)}`} />
        <Metric label="bounds" value={bounds ? `${formatNumber(bounds.lower)} to ${formatNumber(bounds.upper)}` : "not bounded"} />
      </div>
    </div>
  );
}

function UnitCircleWaveLink({ state, xValue, value }: { state: GraphTransformState; xValue: number; value: number | null }) {
  const input = state.frequency * xValue + state.phase;
  const cx = 96;
  const cy = 90;
  const r = 58;
  const px = cx + Math.cos(input) * r;
  const py = cy - Math.sin(input) * r;
  const tangentDefined = state.fn !== "tan" || safeTan(input) !== null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Unit-circle / wave link</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{state.fn === "tan" ? "Tangent reads slope. It becomes undefined when the ray is vertical." : "The wave records a circle projection as x changes."}</p>
      <svg viewBox="0 0 320 180" className="mt-2 h-[180px] w-full" role="img" aria-label="Mini unit circle linked to graph">
        <rect width="320" height="180" rx="16" fill="#f8fafc" className="dark:fill-slate-900" />
        <circle cx={cx} cy={cy} r={r} fill="#06b6d4" opacity="0.08" stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx - r - 18} x2={cx + r + 18} y1={cy} y2={cy} stroke="#94a3b8" />
        <line x1={cx} x2={cx} y1={cy - r - 18} y2={cy + r + 18} stroke="#94a3b8" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke={state.fn === "tan" ? COLORS.tangent : COLORS.transformed} strokeWidth="4" />
        <line x1={px} y1={cy} x2={px} y2={py} stroke={COLORS.amplitude} strokeDasharray="5 4" strokeWidth="3" />
        <line x1={cx} y1={cy} x2={px} y2={cy} stroke={COLORS.period} strokeDasharray="5 4" strokeWidth="3" />
        <circle cx={px} cy={py} r="6" fill={COLORS.transformed} stroke="#0f172a" strokeWidth="2" />
        <text x="182" y="58" fill="#0f172a" fontSize="12" fontWeight="800">{state.fn === "sin" ? "height -> sine graph" : state.fn === "cos" ? "horizontal -> cosine graph" : "slope -> tangent graph"}</text>
        <text x="182" y="82" fill={tangentDefined ? "#0f172a" : COLORS.tangent} fontSize="12" fontWeight="800">value: {formatGraphValue(value)}</text>
      </svg>
    </div>
  );
}

function StepModePanel({ state, stepIndex, setStepIndex, setActiveParam, teachingMode }: { state: GraphTransformState; stepIndex: number; setStepIndex: (value: number) => void; setActiveParam: (value: Emphasis) => void; teachingMode: TeachingMode }) {
  const steps: Array<[Emphasis, string, string]> = [
    ["parent", `Parent: y = ${state.fn} x`, "Start with the unmodified parent graph."],
    ["a", "Amplitude/stretch", "a changes height. For tangent, it stretches the slope vertically."],
    ["b", "Frequency/period", "b changes how quickly the graph cycles."],
    ["c", "Phase", "c slides the graph. The actual shift is -c/b."],
    ["d", "Vertical shift", "d lifts the midline up or down."],
    ["parent", "Final graph", "All transformations act together."],
  ];
  const [param, title, body] = steps[stepIndex] ?? steps[0];
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-300/20 dark:bg-violet-400/10">
      <p className="text-sm font-black text-slate-950 dark:text-white">Step mode</p>
      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{teachingMode === "beginner" ? "Build the graph one change at a time." : "Read the transformation composition in order."}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {steps.map((_, index) => <button key={index} type="button" className={stepIndex === index ? "mini-chip bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100" : "mini-chip"} onClick={() => { setStepIndex(index); setActiveParam(steps[index][0]); }}>Step {index + 1}</button>)}
      </div>
      <p className="mt-3 rounded-lg bg-white/70 p-2 font-bold text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">{title}: {body}</p>
      <button type="button" className="action-secondary mt-3" onClick={() => setActiveParam(param)}>Highlight this parameter</button>
    </div>
  );
}

function MatchTheGraphPanel({ target, state, feedback, setFeedback, setChallengeIndex }: { target: GraphTransformState; state: GraphTransformState; feedback: string; setFeedback: (value: string) => void; setChallengeIndex: (updater: (value: number) => number) => void }) {
  function check() {
    const amp = Math.abs(Math.abs(state.amplitude) - Math.abs(target.amplitude)) <= 0.18;
    const freq = Math.abs(state.frequency - target.frequency) <= 0.12;
    const phase = circularClose(getPhaseShift(state), getPhaseShift(target), 0.28);
    const vertical = Math.abs(state.verticalShift - target.verticalShift) <= 0.18;
    const parts = [
      amp ? "height close" : "match the height first",
      freq ? "cycle length close" : "adjust frequency for cycle length",
      phase ? "slide close" : "slide left/right with c",
      vertical ? "midline close" : "move the midline with d",
    ];
    setFeedback(parts.join(" | "));
  }
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-300/20 dark:bg-rose-400/10">
      <p className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white"><Target className="h-4 w-4" /> Match-the-graph challenge</p>
      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">Match the dashed red target. Start with height, then cycle length, then slide, then midline.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="target function" value={target.fn} />
        <Metric label="target period" value={formatNullable(getTrigGraphPeriod(target), formatRadians)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="action-primary" onClick={check}>Check match</button>
        <button type="button" className="action-secondary" onClick={() => { setChallengeIndex((value) => value + 1); setFeedback("New target loaded. Match height first."); }}>New target</button>
      </div>
      <p className="mt-3 rounded-lg bg-white/70 p-2 text-xs font-semibold text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">{feedback}</p>
    </div>
  );
}

function MisconceptionBox({ fn }: { fn: TrigGraphFunction }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50">
      <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4" /><p className="text-sm font-black">Misconception correction</p></div>
      <div className="mt-3 space-y-2 text-xs leading-5">
        <p><span className="font-black">Amplitude:</span> changes height, not width.</p>
        <p><span className="font-black">Frequency:</span> larger b means a shorter period.</p>
        <p><span className="font-black">Phase:</span> +c does not always shift right; actual shift is -c/b.</p>
        <p><span className="font-black">Midline:</span> d moves the middle line; it does not change amplitude.</p>
        {fn === "tan" && <p><span className="font-black">Tangent:</span> it is not one continuous curve. It breaks at asymptotes.</p>}
      </div>
    </div>
  );
}

function PracticePromptCard({ state }: { state: GraphTransformState }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Practice prompt</p>
      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
        {state.fn === "tan" ? "Move x near pi/2 and explain why the graph breaks." : "Double a, then double b. Say which change affected height and which affected width."}
      </p>
    </div>
  );
}

function StudioSlider({ label, value, min, max, step, onChange, valueLabel, wide }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; valueLabel?: string; wide?: boolean }) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <label className={`rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5 ${wide ? "md:col-span-2" : ""}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-slate-900 dark:text-white">{label}</span>
        <input className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold dark:border-white/10 dark:bg-slate-900" type="number" value={Number(value.toFixed(4))} min={min} max={max} step={step} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} aria-label={`${label} exact value`} />
      </div>
      <input className="slider-range w-full cursor-pointer appearance-none accent-cyan-500" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--slider-progress": `${progress}%` } as CSSProperties} aria-label={label} />
      <p className="mt-1 text-right font-mono text-xs font-bold text-cyan-700 dark:text-cyan-200">{valueLabel ?? formatNumber(value)}</p>
    </label>
  );
}

function GraphGrid({ plot, xToPixel, yToPixel }: { plot: { left: number; right: number; top: number; bottom: number }; xToPixel: (x: number) => number; yToPixel: (y: number) => number }) {
  const ticks = [-2 * Math.PI, -1.5 * Math.PI, -Math.PI, -0.5 * Math.PI, 0, 0.5 * Math.PI, Math.PI, 1.5 * Math.PI, 2 * Math.PI];
  return (
    <g opacity="0.72">
      {ticks.map((tick) => <line key={`x-${tick}`} x1={xToPixel(tick)} x2={xToPixel(tick)} y1={plot.top} y2={plot.bottom} stroke="#e2e8f0" />)}
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((tick) => <line key={`y-${tick}`} x1={plot.left} x2={plot.right} y1={yToPixel(tick)} y2={yToPixel(tick)} stroke="#e2e8f0" />)}
    </g>
  );
}

function GraphPaths({ samples, xToPixel, yToPixel, color, width, dash }: { samples: SamplePoint[]; xToPixel: (x: number) => number; yToPixel: (y: number) => number; color: string; width: number; dash?: string }) {
  const paths = samplesToPaths(samples, xToPixel, yToPixel);
  return <>{paths.map((path, index) => <path key={index} d={path} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />)}</>;
}

function AxisLabels({ plot, xToPixel, yToPixel }: { plot: { left: number; right: number; top: number; bottom: number }; xToPixel: (x: number) => number; yToPixel: (y: number) => number }) {
  const ticks: Array<[number, string]> = [[-2 * Math.PI, "-2pi"], [-1.5 * Math.PI, "-3pi/2"], [-Math.PI, "-pi"], [-0.5 * Math.PI, "-pi/2"], [0, "0"], [0.5 * Math.PI, "pi/2"], [Math.PI, "pi"], [1.5 * Math.PI, "3pi/2"], [2 * Math.PI, "2pi"]];
  return (
    <g>
      {ticks.map(([tick, label]) => <text key={label} x={xToPixel(tick) - 14} y={plot.bottom + 18} fill="#64748b" fontSize="11" fontWeight="800">{label}</text>)}
      {[-4, -2, 0, 2, 4].map((tick) => <text key={tick} x={plot.left - 32} y={yToPixel(tick) + 4} fill="#64748b" fontSize="11" fontWeight="800">{tick}</text>)}
    </g>
  );
}

function OverlayLine({ y, x1, x2, color, label }: { y: number; x1: number; x2: number; color: string; label: string }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth="2.5" strokeDasharray="8 6" />
      <text x={x1 + 8} y={y - 6} fill={color} fontSize="12" fontWeight="900">{label}</text>
    </g>
  );
}

function TangentAsymptotes({ state, xToPixel, plot }: { state: GraphTransformState; xToPixel: (x: number) => number; plot: { top: number; bottom: number } }) {
  const asymptotes: number[] = [];
  for (let n = -8; n <= 8; n += 1) {
    const x = (Math.PI / 2 + n * Math.PI - state.phase) / state.frequency;
    if (x >= X_MIN && x <= X_MAX) asymptotes.push(x);
  }
  return (
    <g>
      {asymptotes.map((x) => (
        <g key={x}>
          <line x1={xToPixel(x)} x2={xToPixel(x)} y1={plot.top} y2={plot.bottom} stroke={COLORS.tangent} strokeDasharray="5 5" strokeWidth="2" />
          <text x={xToPixel(x) + 4} y={plot.top + 18} fill={COLORS.tangent} fontSize="11" fontWeight="900">undefined</text>
        </g>
      ))}
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p></div>;
}

function samplesToPaths(samples: SamplePoint[], xToPixel: (x: number) => number, yToPixel: (y: number) => number) {
  const paths: string[] = [];
  let current = "";
  let activeSegment = -1;
  for (const sample of samples) {
    if (sample.y === null) {
      if (current) paths.push(current);
      current = "";
      activeSegment = -1;
      continue;
    }
    if (activeSegment !== sample.segmentId) {
      if (current) paths.push(current);
      current = "";
      activeSegment = sample.segmentId;
    }
    current += `${current ? " L" : "M"}${roundTo(xToPixel(sample.x), 2)},${roundTo(yToPixel(sample.y), 2)}`;
  }
  if (current) paths.push(current);
  return paths;
}

function initialState(fn: TrigGraphFunction, emphasis: Emphasis): GraphTransformState {
  if (emphasis === "a") return { fn, amplitude: 2, frequency: 1, phase: 0, verticalShift: 0 };
  if (emphasis === "b") return { fn, amplitude: 1, frequency: 2, phase: 0, verticalShift: 0 };
  if (emphasis === "c") return { fn, amplitude: 1, frequency: 1, phase: Math.PI / 3, verticalShift: 0 };
  if (emphasis === "d") return { fn, amplitude: 1, frequency: 1, phase: 0, verticalShift: 1 };
  return { fn, amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 };
}

function beginnerParameterText(param: Emphasis) {
  if (param === "a") return "Height: bigger a makes taller waves.";
  if (param === "b") return "Speed: bigger b squeezes cycles closer.";
  if (param === "c") return "Slide: c moves the wave left or right.";
  if (param === "d") return "Lift: d moves the middle line.";
  return "Start with the parent graph.";
}

function circularClose(a: number | null, b: number | null, tolerance: number) {
  if (a === null || b === null) return false;
  const period = Math.PI * 2;
  const diff = Math.abs(((a - b + Math.PI) % period + period) % period - Math.PI);
  return diff <= tolerance;
}

function wrapX(value: number) {
  if (value > X_MAX) return X_MIN;
  if (value < X_MIN) return X_MAX;
  return value;
}

function formatGraphValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "undefined";
  return formatNumber(value);
}

function formatNullable(value: number | null, formatter: (value: number) => string) {
  return value === null || !Number.isFinite(value) ? "undefined" : formatter(value);
}

function formatNumber(value: number) {
  const rounded = roundTo(cleanNumber(value), 4);
  return Object.is(rounded, -0) ? "0" : `${rounded}`;
}

function formatParam(value: number) {
  return formatNumber(value);
}

function signedNumber(value: number) {
  if (nearZero(value)) return "+ 0";
  return value >= 0 ? `+ ${formatNumber(value)}` : `- ${formatNumber(Math.abs(value))}`;
}

function signedRadians(value: number) {
  if (nearZero(value)) return "+ 0";
  return value >= 0 ? `+ ${formatRadians(value)}` : `- ${formatRadians(Math.abs(value))}`;
}

function formatRadians(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  const ratio = value / Math.PI;
  if (nearZero(ratio)) return "0";
  if (Math.abs(ratio - 1) < 0.01) return "pi";
  if (Math.abs(ratio + 1) < 0.01) return "-pi";
  if (Math.abs(ratio - 0.5) < 0.01) return "pi/2";
  if (Math.abs(ratio + 0.5) < 0.01) return "-pi/2";
  if (Math.abs(ratio - 2) < 0.01) return "2pi";
  if (Math.abs(ratio + 2) < 0.01) return "-2pi";
  return `${formatNumber(value)} rad`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value)) return value;
  return Math.abs(value) < EPSILON ? 0 : value;
}
