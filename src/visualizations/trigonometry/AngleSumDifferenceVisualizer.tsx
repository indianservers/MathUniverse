import { BookOpen, CheckCircle2, Eye, GraduationCap, RotateCcw, TriangleAlert } from "lucide-react";
import { type CSSProperties, type PointerEvent, type ReactNode, useMemo, useRef, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import { degreesToRadians, radiansToDegrees, roundTo } from "../../utils/math";

export type AngleSumDifferenceFormulaId = "sin-add" | "sin-sub" | "cos-add" | "cos-sub" | "tan-add" | "tan-sub";

type FunctionKind = "sin" | "cos" | "tan";
type OperationKind = "add" | "sub";
type TeachingMode = "beginner" | "professor";
type ToggleKey = "projections" | "terms" | "values" | "builder" | "professor";

type AngleFormulaEvaluation = {
  direct: number | null;
  expanded: number | null;
  defined: boolean;
  reason?: string;
  difference: number | null;
  matched: boolean;
};

const EPSILON = 1e-6;
const SNAP_ANGLES = [0, 15, 30, 45, 60, 90, 120, 135, 150, 180];
const COLORS = {
  a: "#06b6d4",
  b: "#f59e0b",
  final: "#8b5cf6",
  projectionX: "#6366f1",
  projectionY: "#10b981",
  tangent: "#f97316",
  warning: "#e11d48",
};

const FORMULA_CONFIG: Record<AngleSumDifferenceFormulaId, {
  label: string;
  directLabel: string;
  expandedLabel: string;
  functionKind: FunctionKind;
  operation: OperationKind;
  correctTiles: string[];
  sign: "+" | "-";
  summary: string;
}> = {
  "sin-add": { label: "sin(A + B)", directLabel: "sin(A+B)", expandedLabel: "sinA cosB + cosA sinB", functionKind: "sin", operation: "add", correctTiles: ["sinA cosB", "+", "cosA sinB"], sign: "+", summary: "Sine reads the final vertical projection after two turns combine." },
  "sin-sub": { label: "sin(A - B)", directLabel: "sin(A-B)", expandedLabel: "sinA cosB - cosA sinB", functionKind: "sin", operation: "sub", correctTiles: ["sinA cosB", "-", "cosA sinB"], sign: "-", summary: "Subtraction reverses the B rotation, so one vertical component changes sign." },
  "cos-add": { label: "cos(A + B)", directLabel: "cos(A+B)", expandedLabel: "cosA cosB - sinA sinB", functionKind: "cos", operation: "add", correctTiles: ["cosA cosB", "-", "sinA sinB"], sign: "-", summary: "Cosine reads horizontal projection; one component points opposite in addition." },
  "cos-sub": { label: "cos(A - B)", directLabel: "cos(A-B)", expandedLabel: "cosA cosB + sinA sinB", functionKind: "cos", operation: "sub", correctTiles: ["cosA cosB", "+", "sinA sinB"], sign: "+", summary: "Reverse B and the horizontal projection parts point together." },
  "tan-add": { label: "tan(A + B)", directLabel: "tan(A+B)", expandedLabel: "(tanA + tanB) / (1 - tanA tanB)", functionKind: "tan", operation: "add", correctTiles: ["tanA + tanB", "/", "1 - tanA tanB"], sign: "-", summary: "Tangent is sine over cosine, so the denominator can disappear." },
  "tan-sub": { label: "tan(A - B)", directLabel: "tan(A-B)", expandedLabel: "(tanA - tanB) / (1 + tanA tanB)", functionKind: "tan", operation: "sub", correctTiles: ["tanA - tanB", "/", "1 + tanA tanB"], sign: "+", summary: "Tangent subtraction is a slope comparison with a denominator check." },
};

export function degToRad(deg: number) {
  return degreesToRadians(deg);
}

export function nearZero(value: number, tolerance = EPSILON) {
  return !Number.isFinite(value) || Math.abs(value) < tolerance;
}

export function safeDivide(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || nearZero(denominator)) return null;
  return cleanNumber(numerator / denominator);
}

export function formatAngleFormulaValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "undefined";
  const rounded = roundTo(cleanNumber(value), 5);
  return Object.is(rounded, -0) ? "0" : `${rounded}`;
}

export function evaluateAngleFormula(formulaId: AngleSumDifferenceFormulaId, angleADeg: number, angleBDeg: number): AngleFormulaEvaluation {
  const config = FORMULA_CONFIG[formulaId];
  const a = degToRad(angleADeg);
  const b = degToRad(angleBDeg);
  const combined = config.operation === "add" ? a + b : a - b;
  const sinA = Math.sin(a);
  const cosA = Math.cos(a);
  const sinB = Math.sin(b);
  const cosB = Math.cos(b);
  const tanA = safeDivide(sinA, cosA);
  const tanB = safeDivide(sinB, cosB);

  if (config.functionKind === "sin") {
    const direct = cleanNumber(Math.sin(combined));
    const expanded = formulaId === "sin-add" ? sinA * cosB + cosA * sinB : sinA * cosB - cosA * sinB;
    return buildEvaluation(direct, cleanNumber(expanded));
  }

  if (config.functionKind === "cos") {
    const direct = cleanNumber(Math.cos(combined));
    const expanded = formulaId === "cos-add" ? cosA * cosB - sinA * sinB : cosA * cosB + sinA * sinB;
    return buildEvaluation(direct, cleanNumber(expanded));
  }

  const direct = safeDivide(Math.sin(combined), Math.cos(combined));
  if (tanA === null || tanB === null || direct === null) {
    return undefinedEvaluation("This tangent expression is undefined here because a tangent value or the final slope denominator becomes zero.");
  }
  const denominator = formulaId === "tan-add" ? 1 - tanA * tanB : 1 + tanA * tanB;
  const numerator = formulaId === "tan-add" ? tanA + tanB : tanA - tanB;
  const expanded = safeDivide(numerator, denominator);
  if (expanded === null) return undefinedEvaluation("This tangent expression is undefined here because the expanded denominator becomes zero.");
  return buildEvaluation(direct, expanded);
}

export default function AngleSumDifferenceVisualizer({ defaultFormula = "sin-add", title = "Angle Sum and Difference Visualizer" }: { defaultFormula?: AngleSumDifferenceFormulaId; title?: string }) {
  const [formulaId, setFormulaId] = useState<AngleSumDifferenceFormulaId>(defaultFormula);
  const [angleA, setAngleA] = useState(30);
  const [angleB, setAngleB] = useState(45);
  const [activeAngle, setActiveAngle] = useState<"A" | "B">("A");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("beginner");
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({ projections: true, terms: true, values: true, builder: true, professor: false });
  const [signGuess, setSignGuess] = useState<"+" | "-" | null>(null);
  const [builderTiles, setBuilderTiles] = useState<string[]>([]);
  const [builderFeedback, setBuilderFeedback] = useState("Choose tiles, then check.");
  const [snapNote, setSnapNote] = useState("");

  const config = FORMULA_CONFIG[formulaId];
  const evaluation = useMemo(() => evaluateAngleFormula(formulaId, angleA, angleB), [angleA, angleB, formulaId]);

  function setFormula(next: AngleSumDifferenceFormulaId) {
    setFormulaId(next);
    setSignGuess(null);
    setBuilderTiles([]);
    setBuilderFeedback("Choose tiles, then check.");
  }

  function syncFunctionAndOperation(functionKind: FunctionKind, operation: OperationKind) {
    const next = `${functionKind}-${operation === "add" ? "add" : "sub"}` as AngleSumDifferenceFormulaId;
    setFormula(next);
  }

  function snapActive(angle: number) {
    if (activeAngle === "A") setAngleA(angle);
    else setAngleB(angle);
    setSnapNote(`${activeAngle} snapped to ${angle} deg`);
    window.setTimeout(() => setSnapNote(""), 900);
  }

  return (
    <SectionCard
      title={title}
      description="Combine two rotations, predict the signs, and compare direct values with expanded formulas."
      allowFullscreen
      headerAction={
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tool-button gap-2" onClick={() => setTeachingMode((mode) => (mode === "beginner" ? "professor" : "beginner"))} aria-pressed={teachingMode === "professor"}>
            {teachingMode === "beginner" ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
            <span className="hidden sm:inline">{teachingMode === "beginner" ? "Beginner" : "Professor"}</span>
          </button>
          <button type="button" className="tool-button h-9 w-9 justify-center p-0" onClick={() => { setAngleA(30); setAngleB(45); setFormula("sin-add"); }} title="Reset angle sum lab">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <FormulaSelector selected={formulaId} onSelect={setFormula} />
        <div className="space-y-4">
          <AngleCompositionScene formulaId={formulaId} angleA={angleA} angleB={angleB} setAngleA={setAngleA} setAngleB={setAngleB} toggles={toggles} />
          <TwoAngleControlPanel
            angleA={angleA}
            angleB={angleB}
            setAngleA={setAngleA}
            setAngleB={setAngleB}
            activeAngle={activeAngle}
            setActiveAngle={setActiveAngle}
            config={config}
            syncFunctionAndOperation={syncFunctionAndOperation}
            toggles={toggles}
            setToggles={setToggles}
            snapActive={snapActive}
            snapNote={snapNote}
          />
        </div>
        <div className="space-y-4">
          {toggles.values && <DirectExpandedVerificationPanel config={config} evaluation={evaluation} angleA={angleA} angleB={angleB} />}
          {toggles.terms && <ProjectionBreakdownPanel formulaId={formulaId} angleA={angleA} angleB={angleB} teachingMode={teachingMode} />}
          <SignPredictionCard config={config} signGuess={signGuess} setSignGuess={setSignGuess} />
          {toggles.builder && <FormulaBuilderMiniChallenge config={config} tiles={builderTiles} setTiles={setBuilderTiles} feedback={builderFeedback} setFeedback={setBuilderFeedback} />}
          <MisconceptionBox formulaId={formulaId} />
        </div>
      </div>
    </SectionCard>
  );
}

function FormulaSelector({ selected, onSelect }: { selected: AngleSumDifferenceFormulaId; onSelect: (id: AngleSumDifferenceFormulaId) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Formula selector</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Pick one combined-angle formula. The scene keeps A and B independent.</p>
      <div className="mt-3 grid gap-2">
        {(Object.keys(FORMULA_CONFIG) as AngleSumDifferenceFormulaId[]).map((id) => (
          <button key={id} type="button" onClick={() => onSelect(id)} className={id === selected ? "rounded-xl border border-cyan-300 bg-cyan-50 p-3 text-left text-cyan-950 dark:border-cyan-300/40 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}>
            <p className="text-sm font-black">{FORMULA_CONFIG[id].label}</p>
            <p className="mt-1 font-mono text-xs">{FORMULA_CONFIG[id].expandedLabel}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function AngleCompositionScene({ formulaId, angleA, angleB, setAngleA, setAngleB, toggles }: { formulaId: AngleSumDifferenceFormulaId; angleA: number; angleB: number; setAngleA: (value: number) => void; setAngleB: (value: number) => void; toggles: Record<ToggleKey, boolean> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<"A" | "B" | null>(null);
  const config = FORMULA_CONFIG[formulaId];
  const finalDeg = config.operation === "add" ? angleA + angleB : angleA - angleB;
  const cx = 360;
  const cy = 235;
  const r = 145;
  const pointA = polarPoint(cx, cy, r, angleA);
  const pointB = polarPoint(cx, cy, r * 0.74, config.operation === "add" ? angleA + angleB : angleA - angleB);
  const finalPoint = polarPoint(cx, cy, r, finalDeg);
  const tanValue = safeDivide(Math.sin(degToRad(finalDeg)), Math.cos(degToRad(finalDeg)));
  const tanY = tanValue === null ? null : cy - Math.max(-210, Math.min(210, tanValue * 72));

  function updateFromPointer(event: PointerEvent<SVGSVGElement>) {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 720;
    const y = ((event.clientY - rect.top) / rect.height) * 460;
    const deg = normalizeDragDegrees(radiansToDegrees(Math.atan2(cy - y, x - cx)));
    if (dragging === "A") setAngleA(deg);
    else setAngleB(deg);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Angle composition scene</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{config.summary}</p>
        </div>
        <span className="mini-chip">Final: {roundTo(finalDeg, 1)} deg</span>
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 720 460"
        className="h-[460px] w-full touch-none"
        role="img"
        aria-label="Unit circle showing angle A, angle B, and final combined arm"
        onPointerMove={updateFromPointer}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
      >
        <rect width="720" height="460" rx="22" fill="#f8fafc" className="dark:fill-slate-900" />
        <Grid />
        <line x1="90" y1={cy} x2="630" y2={cy} stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx} y1="58" x2={cx} y2="410" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="#06b6d4" opacity="0.07" stroke="#94a3b8" strokeWidth="2" />
        <AngleArc cx={cx} cy={cy} radius={48} startDeg={0} endDeg={angleA} color={COLORS.a} label="A" />
        <AngleArc cx={cx} cy={cy} radius={68} startDeg={angleA} endDeg={finalDeg} color={COLORS.b} label={config.operation === "add" ? "B" : "-B"} />
        <AngleArc cx={cx} cy={cy} radius={92} startDeg={0} endDeg={finalDeg} color={COLORS.final} label={config.operation === "add" ? "A+B" : "A-B"} />
        <line x1={cx} y1={cy} x2={pointA.x} y2={pointA.y} stroke={COLORS.a} strokeWidth="6" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={pointB.x} y2={pointB.y} stroke={COLORS.b} strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={finalPoint.x} y2={finalPoint.y} stroke={COLORS.final} strokeWidth="7" strokeLinecap="round" />
        {toggles.projections && (
          <>
            <line x1={finalPoint.x} y1={cy} x2={finalPoint.x} y2={finalPoint.y} stroke={COLORS.projectionY} strokeWidth="5" strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={finalPoint.x} y2={cy} stroke={COLORS.projectionX} strokeWidth="5" strokeLinecap="round" />
            <SvgText x={finalPoint.x + 12} y={(cy + finalPoint.y) / 2} fill={COLORS.projectionY}>sine projection</SvgText>
            <SvgText x={(cx + finalPoint.x) / 2 - 30} y={cy + 28} fill={COLORS.projectionX}>cosine projection</SvgText>
          </>
        )}
        {config.functionKind === "tan" && (
          <>
            <line x1={cx + r} y1="60" x2={cx + r} y2="410" stroke={COLORS.tangent} strokeWidth="3" strokeDasharray="7 7" />
            {tanY === null ? <SvgText x={cx + r + 10} y="92" fill={COLORS.warning}>tangent undefined</SvgText> : <line x1={cx + r} y1={cy} x2={cx + r} y2={tanY} stroke={COLORS.tangent} strokeWidth="6" strokeLinecap="round" />}
          </>
        )}
        <DragHandle point={pointA} color={COLORS.a} label="drag A" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging("A"); }} />
        <DragHandle point={pointB} color={COLORS.b} label="drag B" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging("B"); }} />
        <circle cx={finalPoint.x} cy={finalPoint.y} r="8" fill={COLORS.final} stroke="#0f172a" strokeWidth="2" />
        <SvgText x="58" y="44" fill="#0f172a">Drag the cyan A handle or amber B handle. Sliders below are the accessible fallback.</SvgText>
      </svg>
    </div>
  );
}

function TwoAngleControlPanel({
  angleA,
  angleB,
  setAngleA,
  setAngleB,
  activeAngle,
  setActiveAngle,
  config,
  syncFunctionAndOperation,
  toggles,
  setToggles,
  snapActive,
  snapNote,
}: {
  angleA: number;
  angleB: number;
  setAngleA: (value: number) => void;
  setAngleB: (value: number) => void;
  activeAngle: "A" | "B";
  setActiveAngle: (value: "A" | "B") => void;
  config: (typeof FORMULA_CONFIG)[AngleSumDifferenceFormulaId];
  syncFunctionAndOperation: (functionKind: FunctionKind, operation: OperationKind) => void;
  toggles: Record<ToggleKey, boolean>;
  setToggles: (value: Record<ToggleKey, boolean>) => void;
  snapActive: (angle: number) => void;
  snapNote: string;
}) {
  const toggleLabels: Array<[ToggleKey, string]> = [["projections", "Projections"], ["terms", "Terms"], ["values", "Values"], ["builder", "Builder"], ["professor", "Derivation"]];
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-3">
          <AngleSlider label="Angle A" value={angleA} onChange={setAngleA} active={activeAngle === "A"} onFocus={() => setActiveAngle("A")} />
          <AngleSlider label="Angle B" value={angleB} onChange={setAngleB} active={activeAngle === "B"} onFocus={() => setActiveAngle("B")} />
          <div className="flex flex-wrap gap-2">
            {SNAP_ANGLES.map((angle) => <button key={angle} type="button" className="mini-chip" onClick={() => snapActive(angle)}>{angle} deg</button>)}
          </div>
          {snapNote && <p className="text-xs font-black text-cyan-600 dark:text-cyan-200">{snapNote}</p>}
        </div>
        <div className="space-y-2">
          <SegmentedButtons<OperationKind> label="Operation" value={config.operation} options={[["add", "Addition"], ["sub", "Subtraction"]]} onChange={(operation) => syncFunctionAndOperation(config.functionKind, operation)} />
          <SegmentedButtons<FunctionKind> label="Function" value={config.functionKind} options={[["sin", "Sine"], ["cos", "Cosine"], ["tan", "Tangent"]]} onChange={(functionKind) => syncFunctionAndOperation(functionKind, config.operation)} />
          <div className="grid grid-cols-2 gap-2">
            {toggleLabels.map(([key, label]) => (
              <button key={key} type="button" className={toggles[key] ? "tool-button justify-center gap-2 bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-50" : "tool-button justify-center gap-2"} onClick={() => setToggles({ ...toggles, [key]: !toggles[key] })} aria-pressed={toggles[key]}>
                <Eye className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectExpandedVerificationPanel({ config, evaluation, angleA, angleB }: { config: (typeof FORMULA_CONFIG)[AngleSumDifferenceFormulaId]; evaluation: AngleFormulaEvaluation; angleA: number; angleB: number }) {
  return (
    <div className={evaluation.defined ? "rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10" : "rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-300/20 dark:bg-rose-400/10"}>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        <p className="text-sm font-black text-slate-950 dark:text-white">Direct vs expanded</p>
      </div>
      <p className="mt-2 font-mono text-sm font-black text-slate-950 dark:text-white">{config.directLabel} = {config.expandedLabel}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Metric label="Direct" value={formatAngleFormulaValue(evaluation.direct)} />
        <Metric label="Expanded" value={formatAngleFormulaValue(evaluation.expanded)} />
        <Metric label="Difference" value={formatAngleFormulaValue(evaluation.difference)} />
        <Metric label="Status" value={evaluation.defined ? (evaluation.matched ? "Matched" : "Check") : "Undefined"} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">A = {roundTo(angleA, 1)} deg, B = {roundTo(angleB, 1)} deg. {evaluation.defined ? "Tolerance: 1e-6." : evaluation.reason}</p>
    </div>
  );
}

function ProjectionBreakdownPanel({ formulaId, angleA, angleB, teachingMode }: { formulaId: AngleSumDifferenceFormulaId; angleA: number; angleB: number; teachingMode: TeachingMode }) {
  const config = FORMULA_CONFIG[formulaId];
  const steps = transformationSteps(formulaId);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Projection breakdown</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{teachingMode === "beginner" ? "Think of A and B as two turns. The final shadow is rebuilt from smaller shadows." : "Rotation composition gives the same projected coordinate as the expansion."}</p>
      <div className="mt-3 space-y-2">
        {steps.map((step, index) => <p key={step} className="rounded-lg bg-slate-100 p-2 text-xs leading-5 text-slate-700 dark:bg-white/5 dark:text-slate-300"><span className="font-black text-cyan-700 dark:text-cyan-200">Step {index + 1}:</span> {step}</p>)}
      </div>
      <p className="mt-3 rounded-lg bg-violet-50 p-2 font-mono text-xs font-black text-violet-900 dark:bg-violet-400/10 dark:text-violet-50">{config.directLabel} at A={angleA} deg, B={angleB} deg</p>
    </div>
  );
}

function SignPredictionCard({ config, signGuess, setSignGuess }: { config: (typeof FORMULA_CONFIG)[AngleSumDifferenceFormulaId]; signGuess: "+" | "-" | null; setSignGuess: (value: "+" | "-") => void }) {
  const correct = signGuess === config.sign;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Predict the sign</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">For {config.label}, what sign joins the main terms?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["+", "-"] as const).map((sign) => <button key={sign} type="button" className={signGuess === sign ? "rounded-lg bg-cyan-600 px-3 py-2 text-lg font-black text-white" : "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"} onClick={() => setSignGuess(sign)}>{sign}</button>)}
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">{signGuess === null ? "Predict before reading the expansion." : correct ? "Correct. The sign follows the projection direction." : "Watch the projection direction; this formula uses the other sign."}</p>
    </div>
  );
}

function FormulaBuilderMiniChallenge({ config, tiles, setTiles, feedback, setFeedback }: { config: (typeof FORMULA_CONFIG)[AngleSumDifferenceFormulaId]; tiles: string[]; setTiles: (tiles: string[]) => void; feedback: string; setFeedback: (feedback: string) => void }) {
  const available = Array.from(new Set([...config.correctTiles, "sinA + sinB", "cosA + cosB", "tanA tanB"]));
  const full = tiles.length >= config.correctTiles.length;
  function check() {
    const exact = config.correctTiles.every((tile, index) => tile === tiles[index]);
    setFeedback(exact ? "Correct. Direct and expanded forms are the same value." : full ? "Almost. Watch the projection direction and denominator." : "Fill every blank first.");
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Click-to-fill formula builder</p>
      <p className="mt-2 rounded-lg bg-slate-100 p-2 font-mono text-xs font-black text-slate-700 dark:bg-white/5 dark:text-slate-200">{config.directLabel} = {config.correctTiles.map((_, i) => <span key={i} className="mx-1 inline-block min-w-16 rounded bg-white px-2 py-1 dark:bg-slate-950">{tiles[i] ?? "____"}</span>)}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {available.map((tile) => <button key={tile} type="button" className="mini-chip" onClick={() => { if (!full) setTiles([...tiles, tile]); }}>{tile}</button>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="action-primary" onClick={check}>Check formula</button>
        <button type="button" className="action-secondary" onClick={() => { setTiles([]); setFeedback("Choose tiles, then check."); }}>Clear</button>
      </div>
      <p className="mt-3 rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{feedback}</p>
    </div>
  );
}

function MisconceptionBox({ formulaId }: { formulaId: AngleSumDifferenceFormulaId }) {
  const tangent = FORMULA_CONFIG[formulaId].functionKind === "tan";
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50">
      <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4" /><p className="text-sm font-black">Misconception correction</p></div>
      <div className="mt-3 space-y-2 text-xs leading-5">
        <p><span className="font-black">Mistake:</span> sin(A+B) = sinA + sinB.</p>
        <p><span className="font-black">Correction:</span> Rotation changes both x and y projections; products appear because the second turn changes the axes.</p>
        <p><span className="font-black">Signs:</span> Plus and minus signs come from whether projection components point together or opposite.</p>
        {tangent && <p><span className="font-black">Tangent:</span> Tangent formulas fail when the denominator becomes zero.</p>}
      </div>
    </div>
  );
}

function AngleSlider({ label, value, onChange, active, onFocus }: { label: string; value: number; onChange: (value: number) => void; active: boolean; onFocus: () => void }) {
  const progress = ((value + 180) / 360) * 100;
  return (
    <label className={active ? "block rounded-xl border border-cyan-300 bg-cyan-50 p-3 dark:border-cyan-300/30 dark:bg-cyan-400/10" : "block rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5"}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-slate-900 dark:text-white">{label}</span>
        <input className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold dark:border-white/10 dark:bg-slate-900" type="number" value={Number(value.toFixed(3))} min={-180} max={180} step={1} onFocus={onFocus} onChange={(event) => onChange(clamp(Number(event.target.value), -180, 180))} aria-label={`${label} exact value`} />
      </div>
      <input className="slider-range w-full cursor-pointer appearance-none accent-cyan-500" type="range" min={-180} max={180} step={1} value={value} onFocus={onFocus} onChange={(event) => onChange(Number(event.target.value))} style={{ "--slider-progress": `${progress}%` } as CSSProperties} aria-label={label} />
      <p className="mt-1 text-right font-mono text-xs font-bold text-cyan-700 dark:text-cyan-200">{roundTo(value, 1)} deg</p>
    </label>
  );
}

function SegmentedButtons<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (value: T) => void }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-black uppercase text-slate-400">{label}</p>
      <div className={`grid gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-slate-950 ${options.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {options.map(([id, text]) => <button key={id} type="button" className={id === value ? "rounded-lg bg-cyan-600 px-2 py-1.5 text-xs font-black text-white shadow-sm" : "rounded-lg px-2 py-1.5 text-xs font-black text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"} onClick={() => onChange(id)} aria-pressed={id === value}>{text}</button>)}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-950/60"><p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p></div>;
}

function DragHandle({ point, color, label, onPointerDown }: { point: { x: number; y: number }; color: string; label: string; onPointerDown: (event: PointerEvent<SVGCircleElement>) => void }) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r="15" fill={color} opacity="0.24" />
      <circle cx={point.x} cy={point.y} r="8" fill={color} stroke="#0f172a" strokeWidth="2" onPointerDown={onPointerDown} className="cursor-grab" />
      <SvgText x={point.x + 12} y={point.y - 12} fill={color}>{label}</SvgText>
    </g>
  );
}

function AngleArc({ cx, cy, radius, startDeg, endDeg, color, label }: { cx: number; cy: number; radius: number; startDeg: number; endDeg: number; color: string; label: string }) {
  const start = polarPoint(cx, cy, radius, startDeg);
  const end = polarPoint(cx, cy, radius, endDeg);
  const delta = Math.abs(endDeg - startDeg);
  const largeArc = delta > 180 ? 1 : 0;
  const sweep = endDeg >= startDeg ? 0 : 1;
  const mid = polarPoint(cx, cy, radius + 14, (startDeg + endDeg) / 2);
  return (
    <g>
      <path d={`M${start.x},${start.y} A${radius},${radius} 0 ${largeArc} ${sweep} ${end.x},${end.y}`} fill="none" stroke={color} strokeWidth="4" />
      <SvgText x={mid.x} y={mid.y} fill={color}>{label}</SvgText>
    </g>
  );
}

function SvgText({ x, y, fill, children }: { x: number | string; y: number | string; fill: string; children: ReactNode }) {
  return <text x={x} y={y} fill={fill} fontSize="13" fontWeight="900" paintOrder="stroke" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{children}</text>;
}

function Grid() {
  return <g opacity="0.55">{Array.from({ length: 13 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 55} y1="30" x2={40 + i * 55} y2="430" stroke="#e2e8f0" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1="32" y1={45 + i * 45} x2="688" y2={45 + i * 45} stroke="#e2e8f0" />)}</g>;
}

function transformationSteps(formulaId: AngleSumDifferenceFormulaId) {
  const config = FORMULA_CONFIG[formulaId];
  if (config.functionKind === "tan") {
    return [
      `Start with ${config.directLabel}.`,
      "Write tangent as sine divided by cosine.",
      "Substitute the sine and cosine sum/difference expansions.",
      `Simplify to ${config.expandedLabel}.`,
    ];
  }
  return [
    `Start with the final rotation: ${config.operation === "add" ? "A+B" : "A-B"}.`,
    `${config.functionKind === "sin" ? "The vertical projection" : "The horizontal projection"} is ${config.directLabel}.`,
    "Break the projection into two smaller projection products.",
    `${config.directLabel} = ${config.expandedLabel}.`,
  ];
}

function polarPoint(cx: number, cy: number, r: number, deg: number) {
  const angle = degToRad(deg);
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

function buildEvaluation(direct: number, expanded: number): AngleFormulaEvaluation {
  const difference = cleanNumber(Math.abs(direct - expanded));
  return { direct, expanded, defined: true, difference, matched: difference <= EPSILON };
}

function undefinedEvaluation(reason: string): AngleFormulaEvaluation {
  return { direct: null, expanded: null, defined: false, reason, difference: null, matched: false };
}

function normalizeDragDegrees(value: number) {
  const normalized = ((value + 180) % 360 + 360) % 360 - 180;
  return Math.round(normalized);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value)) return value;
  return Math.abs(value) < EPSILON ? 0 : value;
}
