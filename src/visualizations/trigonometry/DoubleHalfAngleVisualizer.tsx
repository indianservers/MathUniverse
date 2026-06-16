import { BookOpen, CheckCircle2, Eye, GraduationCap, RotateCcw, Sigma, TriangleAlert } from "lucide-react";
import { type CSSProperties, type PointerEvent, type ReactNode, useMemo, useRef, useState } from "react";
import MathExpression from "../../components/ui/MathExpression";
import SectionCard from "../../components/ui/SectionCard";
import { degreesToRadians, radiansToDegrees, roundTo } from "../../utils/math";

export type DoubleHalfFormulaId =
  | "sin-double"
  | "cos-double-basic"
  | "cos-double-sin"
  | "cos-double-cos"
  | "tan-double"
  | "sin-half-square"
  | "cos-half-square"
  | "tan-half-sin-over-one-plus-cos"
  | "tan-half-one-minus-cos-over-sin"
  | "tan-half-radical";

type FormulaGroup = "double" | "half";
type FunctionKind = "sin" | "cos" | "tan";
type TeachingMode = "beginner" | "professor";
type ToggleKey = "thetaArm" | "doubleArm" | "halfArm" | "steps" | "values" | "graph" | "challenge";

type DoubleHalfEvaluation = {
  direct: number | null;
  expanded: number | null;
  defined: boolean;
  reason?: string;
  difference: number | null;
  matched: boolean;
  signNote?: string;
};

const EPSILON = 1e-6;
const SNAP_ANGLES = [0, 15, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];
const COLORS = {
  theta: "#06b6d4",
  double: "#8b5cf6",
  half: "#f59e0b",
  sin: "#10b981",
  cos: "#6366f1",
  tan: "#f97316",
  warning: "#e11d48",
};

const FORMULA_CONFIG: Record<DoubleHalfFormulaId, {
  group: FormulaGroup;
  kind: FunctionKind;
  title: string;
  label: string;
  directLabel: string;
  expandedLabel: string;
  summary: string;
  correctTiles: string[];
}> = {
  "sin-double": {
    group: "double",
    kind: "sin",
    title: "Double-angle sine",
    label: "\\sin(2\\theta)",
    directLabel: "\\sin(2\\theta)",
    expandedLabel: "2\\sin\\theta\\cos\\theta",
    summary: "The same turn is used twice, so sine addition becomes two matching products.",
    correctTiles: ["2", "sin(theta)", "cos(theta)"],
  },
  "cos-double-basic": {
    group: "double",
    kind: "cos",
    title: "Double-angle cosine",
    label: "\\cos(2\\theta)",
    directLabel: "\\cos(2\\theta)",
    expandedLabel: "\\cos^2\\theta-\\sin^2\\theta",
    summary: "Cosine reads the final horizontal shadow after theta is added to itself.",
    correctTiles: ["cos^2(theta)", "-", "sin^2(theta)"],
  },
  "cos-double-sin": {
    group: "double",
    kind: "cos",
    title: "Cosine double angle: sine form",
    label: "\\cos(2\\theta)",
    directLabel: "\\cos(2\\theta)",
    expandedLabel: "1-2\\sin^2\\theta",
    summary: "Use sin^2(theta) + cos^2(theta) = 1 to replace cos squared.",
    correctTiles: ["1", "-", "2sin^2(theta)"],
  },
  "cos-double-cos": {
    group: "double",
    kind: "cos",
    title: "Cosine double angle: cosine form",
    label: "\\cos(2\\theta)",
    directLabel: "\\cos(2\\theta)",
    expandedLabel: "2\\cos^2\\theta-1",
    summary: "Use the same Pythagorean identity to replace sin squared.",
    correctTiles: ["2cos^2(theta)", "-", "1"],
  },
  "tan-double": {
    group: "double",
    kind: "tan",
    title: "Double-angle tangent",
    label: "\\tan(2\\theta)",
    directLabel: "\\tan(2\\theta)",
    expandedLabel: "\\frac{2\\tan\\theta}{1-\\tan^2\\theta}",
    summary: "Tangent is a slope, so the denominator must be watched carefully.",
    correctTiles: ["2tan(theta)", "/", "1 - tan^2(theta)"],
  },
  "sin-half-square": {
    group: "half",
    kind: "sin",
    title: "Half-angle sine square",
    label: "\\sin^2\\left(\\frac{\\theta}{2}\\right)",
    directLabel: "\\sin^2\\left(\\frac{\\theta}{2}\\right)",
    expandedLabel: "\\frac{1-\\cos\\theta}{2}",
    summary: "Reverse the cosine double-angle formula and solve for the sine square.",
    correctTiles: ["1 - cos(theta)", "/", "2"],
  },
  "cos-half-square": {
    group: "half",
    kind: "cos",
    title: "Half-angle cosine square",
    label: "\\cos^2\\left(\\frac{\\theta}{2}\\right)",
    directLabel: "\\cos^2\\left(\\frac{\\theta}{2}\\right)",
    expandedLabel: "\\frac{1+\\cos\\theta}{2}",
    summary: "Reverse the cosine double-angle formula and solve for the cosine square.",
    correctTiles: ["1 + cos(theta)", "/", "2"],
  },
  "tan-half-sin-over-one-plus-cos": {
    group: "half",
    kind: "tan",
    title: "Half-angle tangent: sine over one plus cosine",
    label: "\\tan\\left(\\frac{\\theta}{2}\\right)",
    directLabel: "\\tan\\left(\\frac{\\theta}{2}\\right)",
    expandedLabel: "\\frac{\\sin\\theta}{1+\\cos\\theta}",
    summary: "This form is useful unless 1 + cos(theta) becomes zero.",
    correctTiles: ["sin(theta)", "/", "1 + cos(theta)"],
  },
  "tan-half-one-minus-cos-over-sin": {
    group: "half",
    kind: "tan",
    title: "Half-angle tangent: one minus cosine over sine",
    label: "\\tan\\left(\\frac{\\theta}{2}\\right)",
    directLabel: "\\tan\\left(\\frac{\\theta}{2}\\right)",
    expandedLabel: "\\frac{1-\\cos\\theta}{\\sin\\theta}",
    summary: "This equivalent form is useful unless sin(theta) becomes zero.",
    correctTiles: ["1 - cos(theta)", "/", "sin(theta)"],
  },
  "tan-half-radical": {
    group: "half",
    kind: "tan",
    title: "Half-angle tangent: signed radical",
    label: "\\tan\\left(\\frac{\\theta}{2}\\right)",
    directLabel: "\\tan\\left(\\frac{\\theta}{2}\\right)",
    expandedLabel: "\\pm\\sqrt{\\frac{1-\\cos\\theta}{1+\\cos\\theta}}",
    summary: "The radical gives a magnitude; the sign comes from the quadrant of theta/2.",
    correctTiles: ["sign", "sqrt", "(1 - cos(theta))/(1 + cos(theta))"],
  },
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

export function formatDoubleHalfValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "undefined";
  const rounded = roundTo(cleanNumber(value), 6);
  return Object.is(rounded, -0) ? "0" : `${rounded}`;
}

export function evaluateDoubleHalfFormula(formulaId: DoubleHalfFormulaId, thetaDeg: number): DoubleHalfEvaluation {
  const theta = degToRad(thetaDeg);
  const half = theta / 2;
  const sin = cleanNumber(Math.sin(theta));
  const cos = cleanNumber(Math.cos(theta));
  const tan = safeDivide(sin, cos);
  const sinHalf = cleanNumber(Math.sin(half));
  const cosHalf = cleanNumber(Math.cos(half));
  const tanHalf = safeDivide(sinHalf, cosHalf);

  if (formulaId === "sin-double") return buildEvaluation(cleanNumber(Math.sin(2 * theta)), cleanNumber(2 * sin * cos));
  if (formulaId === "cos-double-basic") return buildEvaluation(cleanNumber(Math.cos(2 * theta)), cleanNumber(cos * cos - sin * sin));
  if (formulaId === "cos-double-sin") return buildEvaluation(cleanNumber(Math.cos(2 * theta)), cleanNumber(1 - 2 * sin * sin));
  if (formulaId === "cos-double-cos") return buildEvaluation(cleanNumber(Math.cos(2 * theta)), cleanNumber(2 * cos * cos - 1));

  if (formulaId === "tan-double") {
    const direct = safeDivide(Math.sin(2 * theta), Math.cos(2 * theta));
    if (tan === null || direct === null) {
      return undefinedEvaluation("This tangent double-angle expression is undefined here because tan(theta), cos(2theta), or the slope denominator becomes zero.");
    }
    const expanded = safeDivide(2 * tan, 1 - tan * tan);
    if (expanded === null) return undefinedEvaluation("This tangent double-angle expression is undefined here because 1 - tan^2(theta) becomes zero.");
    return buildEvaluation(direct, expanded);
  }

  if (formulaId === "sin-half-square") return buildEvaluation(cleanNumber(sinHalf * sinHalf), cleanNumber((1 - cos) / 2));
  if (formulaId === "cos-half-square") return buildEvaluation(cleanNumber(cosHalf * cosHalf), cleanNumber((1 + cos) / 2));

  if (formulaId === "tan-half-sin-over-one-plus-cos") {
    if (tanHalf === null) return undefinedEvaluation("tan(theta/2) is undefined here because cos(theta/2) is zero.");
    const expanded = safeDivide(sin, 1 + cos);
    if (expanded === null) return undefinedEvaluation("This half-angle tangent form is undefined here because 1 + cos(theta) becomes zero.");
    return buildEvaluation(tanHalf, expanded);
  }

  if (formulaId === "tan-half-one-minus-cos-over-sin") {
    if (tanHalf === null) return undefinedEvaluation("tan(theta/2) is undefined here because cos(theta/2) is zero.");
    const expanded = safeDivide(1 - cos, sin);
    if (expanded === null) return undefinedEvaluation("This half-angle tangent form is undefined here because sin(theta) becomes zero.");
    return buildEvaluation(tanHalf, expanded);
  }

  if (tanHalf === null) return undefinedEvaluation("The signed radical form is undefined here because tan(theta/2) is undefined.");
  const radicand = safeDivide(1 - cos, 1 + cos);
  if (radicand === null || radicand < -EPSILON) return undefinedEvaluation("The radical form is undefined here because its denominator is zero or the radicand is invalid.");
  const sign = tanHalf < -EPSILON ? -1 : 1;
  const expanded = cleanNumber(sign * Math.sqrt(Math.max(0, radicand)));
  return {
    ...buildEvaluation(tanHalf, expanded),
    signNote: `Use ${sign < 0 ? "negative" : "positive"} sign because theta/2 is in ${halfAngleQuadrant(thetaDeg)}.`,
  };
}

export default function DoubleHalfAngleVisualizer({
  defaultFormula = "sin-double",
  title = "Double and Half Angle Visual Derivation Lab",
}: {
  defaultFormula?: DoubleHalfFormulaId;
  title?: string;
}) {
  const [formulaId, setFormulaId] = useState<DoubleHalfFormulaId>(defaultFormula);
  const [thetaDeg, setThetaDeg] = useState(FORMULA_CONFIG[defaultFormula].group === "half" ? 120 : 45);
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("beginner");
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    thetaArm: true,
    doubleArm: true,
    halfArm: true,
    steps: true,
    values: true,
    graph: true,
    challenge: true,
  });
  const [builderTiles, setBuilderTiles] = useState<string[]>([]);
  const [builderFeedback, setBuilderFeedback] = useState("Choose tiles, then check.");
  const [signGuess, setSignGuess] = useState<"+" | "-" | null>(null);
  const [snapNote, setSnapNote] = useState("");

  const config = FORMULA_CONFIG[formulaId];
  const evaluation = useMemo(() => evaluateDoubleHalfFormula(formulaId, thetaDeg), [formulaId, thetaDeg]);

  function reset(nextFormula = defaultFormula) {
    setFormulaId(nextFormula);
    setThetaDeg(FORMULA_CONFIG[nextFormula].group === "half" ? 120 : 45);
    setTeachingMode("beginner");
    setBuilderTiles([]);
    setBuilderFeedback("Choose tiles, then check.");
    setSignGuess(null);
  }

  function setFormula(next: DoubleHalfFormulaId) {
    setFormulaId(next);
    setBuilderTiles([]);
    setBuilderFeedback("Choose tiles, then check.");
    setSignGuess(null);
  }

  function setGroup(group: FormulaGroup) {
    setFormula(group === "double" ? "sin-double" : "sin-half-square");
  }

  function setKind(kind: FunctionKind) {
    if (config.group === "double") {
      setFormula(kind === "sin" ? "sin-double" : kind === "cos" ? "cos-double-basic" : "tan-double");
    } else {
      setFormula(kind === "sin" ? "sin-half-square" : kind === "cos" ? "cos-half-square" : "tan-half-sin-over-one-plus-cos");
    }
  }

  function snapTheta(angle: number) {
    setThetaDeg(angle);
    setSnapNote(`theta snapped to ${angle} deg`);
    window.setTimeout(() => setSnapNote(""), 900);
  }

  return (
    <SectionCard
      title={title}
      description="Double angle is theta plus theta. Half angle reverses that idea and needs sign awareness."
      allowFullscreen
      headerAction={
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tool-button gap-2" onClick={() => setTeachingMode((mode) => (mode === "beginner" ? "professor" : "beginner"))} aria-pressed={teachingMode === "professor"}>
            {teachingMode === "beginner" ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
            <span className="hidden sm:inline">{teachingMode === "beginner" ? "Beginner" : "Professor"}</span>
          </button>
          <button type="button" className="tool-button h-9 w-9 justify-center p-0" onClick={() => reset()} title="Reset double and half angle lab">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_370px]">
        <FormulaSelector selected={formulaId} onSelect={setFormula} />
        <div className="space-y-4">
          {config.group === "double" ? (
            <RepeatedAngleScene formulaId={formulaId} thetaDeg={thetaDeg} setThetaDeg={setThetaDeg} toggles={toggles} />
          ) : (
            <HalfAngleScene formulaId={formulaId} thetaDeg={thetaDeg} setThetaDeg={setThetaDeg} toggles={toggles} />
          )}
          <ThetaControlPanel
            thetaDeg={thetaDeg}
            setThetaDeg={setThetaDeg}
            group={config.group}
            setGroup={setGroup}
            kind={config.kind}
            setKind={setKind}
            toggles={toggles}
            setToggles={setToggles}
            snapTheta={snapTheta}
            snapNote={snapNote}
          />
          {toggles.graph && <GraphComparisonPanel formulaId={formulaId} thetaDeg={thetaDeg} />}
        </div>
        <div className="space-y-4">
          {toggles.values && <DirectExpandedVerificationPanel config={config} evaluation={evaluation} thetaDeg={thetaDeg} />}
          {toggles.steps && <FormulaTransformationLadder formulaId={formulaId} teachingMode={teachingMode} />}
          {config.group === "half" && <HalfAngleSignPanel thetaDeg={thetaDeg} signGuess={signGuess} setSignGuess={setSignGuess} evaluation={evaluation} />}
          {toggles.challenge && <FormulaBuilderMiniChallenge config={config} tiles={builderTiles} setTiles={setBuilderTiles} feedback={builderFeedback} setFeedback={setBuilderFeedback} />}
          <MisconceptionBox formulaId={formulaId} />
          <PracticePromptCard formulaId={formulaId} />
        </div>
      </div>
    </SectionCard>
  );
}

function FormulaSelector({ selected, onSelect }: { selected: DoubleHalfFormulaId; onSelect: (id: DoubleHalfFormulaId) => void }) {
  const groups: Array<[FormulaGroup, string]> = [["double", "Double Angle"], ["half", "Half Angle"]];
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Formula selector</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Choose one identity. The scene changes to match the formula.</p>
      {groups.map(([group, label]) => (
        <div key={group} className="mt-3">
          <p className="text-[11px] font-black uppercase text-slate-400">{label}</p>
          <div className="mt-2 grid gap-2">
            {(Object.keys(FORMULA_CONFIG) as DoubleHalfFormulaId[]).filter((id) => FORMULA_CONFIG[id].group === group).map((id) => (
              <button key={id} type="button" onClick={() => onSelect(id)} className={id === selected ? "rounded-xl border border-cyan-300 bg-cyan-50 p-3 text-left text-cyan-950 dark:border-cyan-300/40 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}>
                <p className="text-sm font-black"><MathExpression value={FORMULA_CONFIG[id].label} /></p>
                <p className="mt-1 text-xs"><MathExpression value={FORMULA_CONFIG[id].expandedLabel} /></p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RepeatedAngleScene({ formulaId, thetaDeg, setThetaDeg, toggles }: { formulaId: DoubleHalfFormulaId; thetaDeg: number; setThetaDeg: (value: number) => void; toggles: Record<ToggleKey, boolean> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const cx = 360;
  const cy = 232;
  const r = 145;
  const thetaPoint = polarPoint(cx, cy, r, thetaDeg);
  const doublePoint = polarPoint(cx, cy, r, thetaDeg * 2);
  const tanDouble = safeDivide(Math.sin(degToRad(thetaDeg * 2)), Math.cos(degToRad(thetaDeg * 2)));
  const tanY = tanDouble === null ? null : cy - Math.max(-210, Math.min(210, tanDouble * 66));

  function updateTheta(event: PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 720;
    const y = ((event.clientY - rect.top) / rect.height) * 460;
    setThetaDeg(normalize360(radiansToDegrees(Math.atan2(cy - y, x - cx))));
  }

  return (
    <SceneShell title="Repeated rotation scene" subtitle="The violet arm is 2theta. It is made by doing the cyan theta turn twice.">
      <svg ref={svgRef} viewBox="0 0 720 460" className="h-[460px] w-full touch-none" role="img" aria-label="Unit circle showing theta and twice theta" onPointerMove={(event) => { if (event.buttons === 1) updateTheta(event); }}>
        <rect width="720" height="460" rx="22" fill="#f8fafc" className="dark:fill-slate-900" />
        <Grid />
        <line x1="78" y1={cy} x2="642" y2={cy} stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx} y1="54" x2={cx} y2="410" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="#06b6d4" opacity="0.07" stroke="#94a3b8" strokeWidth="2" />
        {toggles.thetaArm && (
          <>
            <AngleArc cx={cx} cy={cy} radius={48} startDeg={0} endDeg={thetaDeg} color={COLORS.theta} label="theta" />
            <line x1={cx} y1={cy} x2={thetaPoint.x} y2={thetaPoint.y} stroke={COLORS.theta} strokeWidth="6" strokeLinecap="round" />
            <DragHandle point={thetaPoint} color={COLORS.theta} label="drag theta" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); }} />
          </>
        )}
        {toggles.doubleArm && (
          <>
            <AngleArc cx={cx} cy={cy} radius={78} startDeg={thetaDeg} endDeg={thetaDeg * 2} color={COLORS.half} label="second theta" />
            <AngleArc cx={cx} cy={cy} radius={108} startDeg={0} endDeg={thetaDeg * 2} color={COLORS.double} label="2theta" />
            <line x1={cx} y1={cy} x2={doublePoint.x} y2={doublePoint.y} stroke={COLORS.double} strokeWidth="7" strokeLinecap="round" />
          </>
        )}
        <line x1={doublePoint.x} y1={cy} x2={doublePoint.x} y2={doublePoint.y} stroke={COLORS.sin} strokeWidth="5" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={doublePoint.x} y2={cy} stroke={COLORS.cos} strokeWidth="5" strokeLinecap="round" />
        <SvgText x={doublePoint.x + 12} y={(cy + doublePoint.y) / 2} fill={COLORS.sin}>sin(2θ)</SvgText>
        <SvgText x={(cx + doublePoint.x) / 2 - 38} y={cy + 30} fill={COLORS.cos}>cos(2θ)</SvgText>
        {formulaId === "tan-double" && (
          <>
            <line x1={cx + r} y1="60" x2={cx + r} y2="408" stroke={COLORS.tan} strokeWidth="3" strokeDasharray="7 7" />
            {tanY === null ? <SvgText x={cx + r + 12} y="88" fill={COLORS.warning}>tan(2θ) undefined</SvgText> : <line x1={cx + r} y1={cy} x2={cx + r} y2={tanY} stroke={COLORS.tan} strokeWidth="6" strokeLinecap="round" />}
          </>
        )}
        <circle cx={doublePoint.x} cy={doublePoint.y} r="8" fill={COLORS.double} stroke="#0f172a" strokeWidth="2" />
        <SvgText x="58" y="44" fill="#0f172a">Drag the cyan endpoint. Slider below stays available.</SvgText>
      </svg>
    </SceneShell>
  );
}

function HalfAngleScene({ thetaDeg, setThetaDeg, toggles }: { formulaId: DoubleHalfFormulaId; thetaDeg: number; setThetaDeg: (value: number) => void; toggles: Record<ToggleKey, boolean> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const cx = 360;
  const cy = 232;
  const r = 145;
  const thetaPoint = polarPoint(cx, cy, r, thetaDeg);
  const halfPoint = polarPoint(cx, cy, r, thetaDeg / 2);

  function updateTheta(event: PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 720;
    const y = ((event.clientY - rect.top) / rect.height) * 460;
    setThetaDeg(normalize360(radiansToDegrees(Math.atan2(cy - y, x - cx))));
  }

  return (
    <SceneShell title="Half-angle scene" subtitle="The amber arm is θ/2. Doubling it lands exactly on the cyan θ arm.">
      <svg ref={svgRef} viewBox="0 0 720 460" className="h-[460px] w-full touch-none" role="img" aria-label="Unit circle showing theta and theta over two" onPointerMove={(event) => { if (event.buttons === 1) updateTheta(event); }}>
        <rect width="720" height="460" rx="22" fill="#f8fafc" className="dark:fill-slate-900" />
        <Grid />
        <line x1="78" y1={cy} x2="642" y2={cy} stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx} y1="54" x2={cx} y2="410" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="#f59e0b" opacity="0.07" stroke="#94a3b8" strokeWidth="2" />
        {toggles.halfArm && (
          <>
            <AngleArc cx={cx} cy={cy} radius={54} startDeg={0} endDeg={thetaDeg / 2} color={COLORS.half} label="θ/2" />
            <line x1={cx} y1={cy} x2={halfPoint.x} y2={halfPoint.y} stroke={COLORS.half} strokeWidth="7" strokeLinecap="round" />
            <circle cx={halfPoint.x} cy={halfPoint.y} r="8" fill={COLORS.half} stroke="#0f172a" strokeWidth="2" />
          </>
        )}
        {toggles.thetaArm && (
          <>
            <AngleArc cx={cx} cy={cy} radius={92} startDeg={0} endDeg={thetaDeg} color={COLORS.theta} label="θ" />
            <line x1={cx} y1={cy} x2={thetaPoint.x} y2={thetaPoint.y} stroke={COLORS.theta} strokeWidth="5" strokeLinecap="round" />
            <DragHandle point={thetaPoint} color={COLORS.theta} label="drag theta" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); }} />
          </>
        )}
        <line x1={halfPoint.x} y1={cy} x2={halfPoint.x} y2={halfPoint.y} stroke={COLORS.sin} strokeWidth="5" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={halfPoint.x} y2={cy} stroke={COLORS.cos} strokeWidth="5" strokeLinecap="round" />
        <SvgText x={halfPoint.x + 12} y={(cy + halfPoint.y) / 2} fill={COLORS.sin}>sin(θ/2)</SvgText>
        <SvgText x={(cx + halfPoint.x) / 2 - 42} y={cy + 30} fill={COLORS.cos}>cos(θ/2)</SvgText>
        <SvgText x="58" y="44" fill="#0f172a">Half-angle formulas come from setting u = θ/2 in double-angle formulas.</SvgText>
      </svg>
    </SceneShell>
  );
}

function ThetaControlPanel({
  thetaDeg,
  setThetaDeg,
  group,
  setGroup,
  kind,
  setKind,
  toggles,
  setToggles,
  snapTheta,
  snapNote,
}: {
  thetaDeg: number;
  setThetaDeg: (value: number) => void;
  group: FormulaGroup;
  setGroup: (group: FormulaGroup) => void;
  kind: FunctionKind;
  setKind: (kind: FunctionKind) => void;
  toggles: Record<ToggleKey, boolean>;
  setToggles: (value: Record<ToggleKey, boolean>) => void;
  snapTheta: (angle: number) => void;
  snapNote: string;
}) {
  const progress = (thetaDeg / 360) * 100;
  const toggleLabels: Array<[ToggleKey, string]> = [
    ["thetaArm", "theta arm"],
    ["doubleArm", "2theta arm"],
    ["halfArm", "θ/2 arm"],
    ["steps", "formula steps"],
    ["values", "values"],
    ["graph", "graph"],
    ["challenge", "challenge"],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">Angle theta</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">0 to 360 degrees. Drag the arm or use the slider.</p>
            </div>
            <input className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold dark:border-white/10 dark:bg-slate-900" type="number" value={Number(thetaDeg.toFixed(3))} min={0} max={360} step={1} onChange={(event) => setThetaDeg(clamp(Number(event.target.value), 0, 360))} aria-label="Angle theta exact value" />
          </div>
          <input className="slider-range w-full cursor-pointer appearance-none accent-cyan-500" type="range" min={0} max={360} step={1} value={thetaDeg} onChange={(event) => setThetaDeg(Number(event.target.value))} style={{ "--slider-progress": `${progress}%` } as CSSProperties} aria-label="Angle theta" />
          <p className="mt-1 text-right font-mono text-xs font-bold text-cyan-700 dark:text-cyan-200">{roundTo(thetaDeg, 1)} deg</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SNAP_ANGLES.map((angle) => <button key={angle} type="button" className="mini-chip" onClick={() => snapTheta(angle)}>{angle} deg</button>)}
          </div>
          {snapNote && <p className="mt-2 text-xs font-black text-cyan-600 dark:text-cyan-200">{snapNote}</p>}
        </div>
        <div className="space-y-2">
          <SegmentedButtons<FormulaGroup> label="Formula group" value={group} options={[["double", "Double angle"], ["half", "Half angle"]]} onChange={setGroup} />
          <SegmentedButtons<FunctionKind> label="Function" value={kind} options={[["sin", "Sine"], ["cos", "Cosine"], ["tan", "Tangent"]]} onChange={setKind} />
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

function DirectExpandedVerificationPanel({ config, evaluation, thetaDeg }: { config: (typeof FORMULA_CONFIG)[DoubleHalfFormulaId]; evaluation: DoubleHalfEvaluation; thetaDeg: number }) {
  return (
    <div className={evaluation.defined ? "rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10" : "rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-300/20 dark:bg-rose-400/10"}>
      <div className="flex items-center gap-2">
        <Sigma className="h-4 w-4" />
        <p className="text-sm font-black text-slate-950 dark:text-white">Direct vs expanded</p>
      </div>
      <p className="mt-2 text-sm font-black text-slate-950 dark:text-white"><MathExpression value={`${config.directLabel}=${config.expandedLabel}`} /></p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Metric label="Direct" value={formatDoubleHalfValue(evaluation.direct)} />
        <Metric label="Expanded" value={formatDoubleHalfValue(evaluation.expanded)} />
        <Metric label="Difference" value={formatDoubleHalfValue(evaluation.difference)} />
        <Metric label="Status" value={evaluation.defined ? (evaluation.matched ? "Matched" : "Check") : "Undefined"} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">theta = {roundTo(thetaDeg, 1)} deg. {evaluation.defined ? "Tolerance: 1e-6." : evaluation.reason}</p>
      {evaluation.signNote && <p className="mt-2 rounded-lg bg-white/70 p-2 text-xs font-bold text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">{evaluation.signNote}</p>}
    </div>
  );
}

function FormulaTransformationLadder({ formulaId, teachingMode }: { formulaId: DoubleHalfFormulaId; teachingMode: TeachingMode }) {
  const steps = transformationSteps(formulaId);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Formula transformation ladder</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{teachingMode === "beginner" ? "Read one move at a time. The formula is being built, not memorized." : "The derivation follows substitution into Phase 05 addition formulas or the cosine double-angle identity."}</p>
      <div className="mt-3 space-y-2">
        {steps.map((step, index) => (
          <p key={`${step}-${index}`} className="rounded-lg bg-slate-100 p-2 font-mono text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300">
            <span className="font-black text-cyan-700 dark:text-cyan-200">Step {index + 1}:</span> <MathExpression value={step} />
          </p>
        ))}
      </div>
    </div>
  );
}

function GraphComparisonPanel({ formulaId, thetaDeg }: { formulaId: DoubleHalfFormulaId; thetaDeg: number }) {
  const config = FORMULA_CONFIG[formulaId];
  const selected = config.kind;
  const halfMode = config.group === "half";
  const width = 620;
  const height = 220;
  const midY = height / 2;
  const xFor = (deg: number) => 34 + (deg / 360) * (width - 68);
  const yFor = (value: number | null) => value === null ? null : midY - Math.max(-1.5, Math.min(1.5, value)) * 58;
  const baseSeries = graphPath((deg) => trigForKind(selected, deg), xFor, yFor);
  const derivedSeries = graphPath((deg) => trigForKind(selected, halfMode ? deg / 2 : deg * 2), xFor, yFor);
  const markerX = xFor(thetaDeg);
  const baseY = yFor(trigForKind(selected, thetaDeg));
  const derivedY = yFor(trigForKind(selected, halfMode ? thetaDeg / 2 : thetaDeg * 2));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Graph comparison</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{halfMode ? <>Compare <MathExpression value={`${selected}(\\theta)`} /> with <MathExpression value={`${selected}\\left(\\frac{\\theta}{2}\\right)`} />.</> : <>Compare <MathExpression value={`${selected}(\\theta)`} /> with <MathExpression value={`${selected}(2\\theta)`} />. The doubled graph completes cycles faster.</>}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-[220px] w-full" role="img" aria-label="Compact graph comparison">
        <rect width={width} height={height} rx="16" fill="#f8fafc" className="dark:fill-slate-900" />
        <line x1="28" y1={midY} x2={width - 24} y2={midY} stroke="#94a3b8" />
        <line x1={markerX} y1="18" x2={markerX} y2={height - 18} stroke="#0f172a" strokeDasharray="5 5" opacity="0.55" />
        <path d={baseSeries} fill="none" stroke={COLORS.theta} strokeWidth="3" />
        <path d={derivedSeries} fill="none" stroke={halfMode ? COLORS.half : COLORS.double} strokeWidth="3" />
        {baseY !== null && <circle cx={markerX} cy={baseY} r="5" fill={COLORS.theta} />}
        {derivedY !== null && <circle cx={markerX} cy={derivedY} r="6" fill={halfMode ? COLORS.half : COLORS.double} />}
        <SvgText x="42" y="32" fill={COLORS.theta}>{selected}(θ)</SvgText>
        <SvgText x="42" y="54" fill={halfMode ? COLORS.half : COLORS.double}>{halfMode ? `${selected}(θ/2)` : `${selected}(2θ)`}</SvgText>
      </svg>
    </div>
  );
}

function HalfAngleSignPanel({ thetaDeg, signGuess, setSignGuess, evaluation }: { thetaDeg: number; signGuess: "+" | "-" | null; setSignGuess: (value: "+" | "-") => void; evaluation: DoubleHalfEvaluation }) {
  const halfDeg = normalize360(thetaDeg / 2);
  const tanHalf = safeDivide(Math.sin(degToRad(halfDeg)), Math.cos(degToRad(halfDeg)));
  const correctSign = tanHalf !== null && tanHalf < -EPSILON ? "-" : "+";
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50">
      <p className="text-sm font-black">Half-angle sign panel</p>
      <p className="mt-1 text-xs leading-5">θ/2 = {roundTo(halfDeg, 1)} deg, {halfAngleQuadrant(thetaDeg)}. The radical form needs the sign of tan(θ/2), not always plus.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["+", "-"] as const).map((sign) => (
          <button key={sign} type="button" className={signGuess === sign ? "rounded-lg bg-amber-600 px-3 py-2 text-lg font-black text-white" : "rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-lg font-black dark:border-amber-300/20 dark:bg-slate-950/40"} onClick={() => setSignGuess(sign)} aria-pressed={signGuess === sign}>
            {sign}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs font-bold">{signGuess === null ? "Predict the radical sign." : signGuess === correctSign ? "Correct sign for this half-angle." : "Try again: locate theta/2 before choosing the sign."}</p>
      {evaluation.signNote && <p className="mt-2 rounded-lg bg-white/70 p-2 text-xs font-bold dark:bg-slate-950/40">{evaluation.signNote}</p>}
    </div>
  );
}

function FormulaBuilderMiniChallenge({ config, tiles, setTiles, feedback, setFeedback }: { config: (typeof FORMULA_CONFIG)[DoubleHalfFormulaId]; tiles: string[]; setTiles: (tiles: string[]) => void; feedback: string; setFeedback: (feedback: string) => void }) {
  const available = Array.from(new Set([...config.correctTiles, "2sin(theta)", "2cos(theta)", "positive only", "sin(theta)+cos(theta)"]));
  const full = tiles.length >= config.correctTiles.length;
  function check() {
    const exact = config.correctTiles.every((tile, index) => tile === tiles[index]);
    setFeedback(exact ? "Correct. This matches the derivation ladder." : full ? "Try again. Watch the sign, square, or denominator." : "Fill every blank first.");
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Click-to-fill formula builder</p>
      <p className="mt-2 rounded-lg bg-slate-100 p-2 text-xs font-black text-slate-700 dark:bg-white/5 dark:text-slate-200">
        <MathExpression value={config.directLabel} /> = {config.correctTiles.map((_, i) => <span key={i} className="mx-1 inline-block min-w-16 rounded bg-white px-2 py-1 dark:bg-slate-950">{tiles[i] ? <MathExpression value={tiles[i]} /> : "____"}</span>)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {available.map((tile) => <button key={tile} type="button" className="mini-chip" onClick={() => { if (!full) setTiles([...tiles, tile]); }}><MathExpression value={tile} /></button>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="action-primary" onClick={check}>Check formula</button>
        <button type="button" className="action-secondary" onClick={() => { setTiles([]); setFeedback("Choose tiles, then check."); }}>Clear</button>
      </div>
      <p className="mt-3 rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{feedback}</p>
    </div>
  );
}

function MisconceptionBox({ formulaId }: { formulaId: DoubleHalfFormulaId }) {
  const config = FORMULA_CONFIG[formulaId];
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50">
      <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4" /><p className="text-sm font-black">Misconception correction</p></div>
      <div className="mt-3 space-y-2 text-xs leading-5">
        {config.group === "double" ? (
          <>
            <p><span className="font-black">Mistake:</span> sin(2theta) = 2sin(theta).</p>
            <p><span className="font-black">Correction:</span> Doubling the angle is not the same as doubling the trig value. The point rotates to a new place.</p>
            <p><span className="font-black">Cosine:</span> cos(2theta) has three useful forms connected by sin^2(theta) + cos^2(theta) = 1.</p>
            <p><span className="font-black">Tangent:</span> The double-angle expression fails when its denominator becomes zero.</p>
          </>
        ) : (
          <>
            <p><span className="font-black">Mistake:</span> Half angle means divide the output by 2.</p>
            <p><span className="font-black">Correction:</span> Half angle means halve the input angle before applying trig.</p>
            <p><span className="font-black">Radical:</span> Half-angle square-root formulas need quadrant sign awareness.</p>
          </>
        )}
      </div>
    </div>
  );
}

function PracticePromptCard({ formulaId }: { formulaId: DoubleHalfFormulaId }) {
  const config = FORMULA_CONFIG[formulaId];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
        <p className="text-sm font-black text-slate-950 dark:text-white">Try it yourself</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{config.group === "double" ? "Set theta to 45 deg. The 2theta arm lands at 90 deg, so sin(2theta) becomes 1." : "Set theta to 120 deg. The half-angle is 60 deg, so the sign and quadrant are easy to check."}</p>
    </div>
  );
}

function SceneShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
      <div className="mb-2">
        <p className="text-sm font-black text-slate-950 dark:text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
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
  const rawDelta = endDeg - startDeg;
  const largeArc = Math.abs(rawDelta) > 180 ? 1 : 0;
  const sweep = rawDelta >= 0 ? 0 : 1;
  const mid = polarPoint(cx, cy, radius + 14, startDeg + rawDelta / 2);
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
  return <g opacity="0.55">{Array.from({ length: 13 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 55} y1="30" x2={40 + i * 55} y2="430" stroke="#e2e8f0" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1="45" y1={45 + i * 45} x2="675" y2={45 + i * 45} stroke="#e2e8f0" />)}</g>;
}

function transformationSteps(formulaId: DoubleHalfFormulaId) {
  if (formulaId === "sin-double") {
    return ["sin(A+B) = sinA cosB + cosA sinB", "Set A = theta and B = theta.", "sin(theta+theta) = sin(theta)cos(theta) + cos(theta)sin(theta)", "sin(2theta) = 2sin(theta)cos(theta)"];
  }
  if (formulaId.startsWith("cos-double")) {
    return ["cos(A+B) = cosA cosB - sinA sinB", "Set A = theta and B = theta.", "cos(2theta) = cos^2(theta) - sin^2(theta)", "Use sin^2(theta) + cos^2(theta) = 1 to make the other two cosine forms."];
  }
  if (formulaId === "tan-double") {
    return ["tan(A+B) = (tanA + tanB) / (1 - tanA tanB)", "Set A = theta and B = theta.", "tan(2theta) = (tan(theta) + tan(theta)) / (1 - tan^2(theta))", "tan(2theta) = 2tan(theta) / (1 - tan^2(theta))"];
  }
  if (formulaId === "sin-half-square") {
    return ["Start with cos(2u) = 1 - 2sin^2(u).", "Let u = theta/2, so 2u = theta.", "cos(theta) = 1 - 2sin^2(theta/2)", "sin^2(theta/2) = (1 - cos(theta)) / 2"];
  }
  if (formulaId === "cos-half-square") {
    return ["Start with cos(2u) = 2cos^2(u) - 1.", "Let u = theta/2, so 2u = theta.", "cos(theta) = 2cos^2(theta/2) - 1", "cos^2(theta/2) = (1 + cos(theta)) / 2"];
  }
  return ["Use the half-angle sine and cosine relationships.", "Write tan(theta/2) = sin(theta/2) / cos(theta/2).", "Convert the expression into the selected tangent half-angle form.", "Check denominator restrictions and the sign of theta/2."];
}

function graphPath(fn: (deg: number) => number | null, xFor: (deg: number) => number, yFor: (value: number | null) => number | null) {
  const parts: string[] = [];
  let open = false;
  for (let deg = 0; deg <= 360; deg += 2) {
    const y = yFor(fn(deg));
    const x = xFor(deg);
    if (y === null || !Number.isFinite(y)) {
      open = false;
      continue;
    }
    parts.push(`${open ? "L" : "M"}${roundTo(x, 2)},${roundTo(y, 2)}`);
    open = true;
  }
  return parts.join(" ");
}

function trigForKind(kind: FunctionKind, deg: number) {
  const rad = degToRad(deg);
  if (kind === "sin") return Math.sin(rad);
  if (kind === "cos") return Math.cos(rad);
  const tan = safeDivide(Math.sin(rad), Math.cos(rad));
  return tan === null || Math.abs(tan) > 1.5 ? null : tan;
}

function polarPoint(cx: number, cy: number, r: number, deg: number) {
  const angle = degToRad(deg);
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

function halfAngleQuadrant(thetaDeg: number) {
  const half = normalize360(thetaDeg / 2);
  if (nearZero(half) || nearZero(half - 90) || nearZero(half - 180) || nearZero(half - 270)) return "on an axis";
  if (half < 90) return "Quadrant I";
  if (half < 180) return "Quadrant II";
  if (half < 270) return "Quadrant III";
  return "Quadrant IV";
}

function buildEvaluation(direct: number, expanded: number): DoubleHalfEvaluation {
  const difference = cleanNumber(Math.abs(direct - expanded));
  return { direct, expanded, defined: true, difference, matched: difference <= EPSILON };
}

function undefinedEvaluation(reason: string): DoubleHalfEvaluation {
  return { direct: null, expanded: null, defined: false, reason, difference: null, matched: false };
}

function normalize360(value: number) {
  const normalized = ((value % 360) + 360) % 360;
  return Number(normalized.toFixed(6));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value)) return value;
  return Math.abs(value) < EPSILON ? 0 : value;
}
