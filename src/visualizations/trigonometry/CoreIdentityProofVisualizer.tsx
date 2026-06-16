import { BookOpen, Eye, GraduationCap, HelpCircle, RotateCcw, Sigma, TriangleAlert } from "lucide-react";
import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import MathExpression from "../../components/ui/MathExpression";
import SectionCard from "../../components/ui/SectionCard";
import { degreesToRadians, roundTo } from "../../utils/math";

export type CoreIdentityId = "sin2-plus-cos2" | "one-plus-tan2-sec2" | "one-plus-cot2-csc2";

type ProofModel = "geometry" | "algebra" | "numeric";
type TeachingMode = "beginner" | "professor";
type ToggleKey = "squares" | "triangle" | "steps" | "values";

type IdentityEvaluation = {
  lhs: number | null;
  rhs: number | null;
  defined: boolean;
  reason?: string;
  difference: number | null;
  matched: boolean;
};

const EPSILON = 1e-6;
const SNAP_ANGLES = [0, 30, 45, 60, 90, 180, 270, 360];
const COLORS = {
  sin: "#10b981",
  cos: "#6366f1",
  radius: "#06b6d4",
  tan: "#f97316",
  sec: "#e11d48",
  warning: "#e11d48",
};

const IDENTITY_CONFIG: Record<CoreIdentityId, { title: string; formula: string; short: string; undefinedRule: string }> = {
  "sin2-plus-cos2": {
    title: "Unit-circle Pythagorean identity",
    formula: "\\sin^2\\theta+\\cos^2\\theta=1",
    short: "The unit-circle triangle has legs sin theta and cos theta, and radius 1.",
    undefinedRule: "Defined for every angle.",
  },
  "one-plus-tan2-sec2": {
    title: "Tangent and secant identity",
    formula: "1+\\tan^2\\theta=\\sec^2\\theta",
    short: "Divide the unit-circle identity by cos^2 theta, or use the tangent triangle.",
    undefinedRule: "Undefined when cos theta = 0.",
  },
  "one-plus-cot2-csc2": {
    title: "Cotangent and cosecant identity",
    formula: "1+\\cot^2\\theta=\\csc^2\\theta",
    short: "Divide the unit-circle identity by sin^2 theta, or use the cotangent triangle.",
    undefinedRule: "Undefined when sin theta = 0.",
  },
};

const TRANSFORM_STEPS: Record<CoreIdentityId, string[]> = {
  "sin2-plus-cos2": [
    "x^2 + y^2 = r^2",
    "(cos theta)^2 + (sin theta)^2 = 1^2",
    "cos^2 theta + sin^2 theta = 1",
    "sin^2 theta + cos^2 theta = 1",
  ],
  "one-plus-tan2-sec2": [
    "sin^2 theta + cos^2 theta = 1",
    "Divide every term by cos^2 theta.",
    "sin^2 theta / cos^2 theta + cos^2 theta / cos^2 theta = 1 / cos^2 theta",
    "tan^2 theta + 1 = sec^2 theta",
    "1 + tan^2 theta = sec^2 theta",
  ],
  "one-plus-cot2-csc2": [
    "sin^2 theta + cos^2 theta = 1",
    "Divide every term by sin^2 theta.",
    "sin^2 theta / sin^2 theta + cos^2 theta / sin^2 theta = 1 / sin^2 theta",
    "1 + cot^2 theta = cosec^2 theta",
  ],
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

export function formatIdentityValue(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "undefined";
  const rounded = roundTo(cleanNumber(value), 5);
  return Object.is(rounded, -0) ? "0" : `${rounded}`;
}

export function evaluateCoreIdentity(identityId: CoreIdentityId, thetaDeg: number): IdentityEvaluation {
  const theta = degToRad(thetaDeg);
  const sin = cleanNumber(Math.sin(theta));
  const cos = cleanNumber(Math.cos(theta));
  const tan = safeDivide(sin, cos);
  const sec = safeDivide(1, cos);
  const cot = safeDivide(cos, sin);
  const csc = safeDivide(1, sin);

  if (identityId === "sin2-plus-cos2") {
    const lhs = cleanNumber(sin * sin + cos * cos);
    const rhs = 1;
    return buildEvaluation(lhs, rhs);
  }

  if (identityId === "one-plus-tan2-sec2") {
    if (tan === null || sec === null) {
      return {
        lhs: null,
        rhs: null,
        defined: false,
        reason: "This identity is not evaluated here because tan theta and sec theta require division by cos theta.",
        difference: null,
        matched: false,
      };
    }
    return buildEvaluation(cleanNumber(1 + tan * tan), cleanNumber(sec * sec));
  }

  if (cot === null || csc === null) {
    return {
      lhs: null,
      rhs: null,
      defined: false,
      reason: "This identity is not evaluated here because cot theta and cosec theta require division by sin theta.",
      difference: null,
      matched: false,
    };
  }
  return buildEvaluation(cleanNumber(1 + cot * cot), cleanNumber(csc * csc));
}

export default function CoreIdentityProofVisualizer({ defaultIdentity = "sin2-plus-cos2", title = "Core Identity Proof Lab" }: { defaultIdentity?: CoreIdentityId; title?: string }) {
  const [identityId, setIdentityId] = useState<CoreIdentityId>(defaultIdentity);
  const [thetaDeg, setThetaDeg] = useState(45);
  const [proofModel, setProofModel] = useState<ProofModel>("geometry");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("beginner");
  const [activeStep, setActiveStep] = useState(0);
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({ squares: true, triangle: true, steps: true, values: true });
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);

  const config = IDENTITY_CONFIG[identityId];
  const evaluation = useMemo(() => evaluateCoreIdentity(identityId, thetaDeg), [identityId, thetaDeg]);
  const trig = useMemo(() => trigValues(thetaDeg), [thetaDeg]);

  function reset() {
    setThetaDeg(45);
    setProofModel("geometry");
    setTeachingMode("beginner");
    setActiveStep(0);
    setToggles({ squares: true, triangle: true, steps: true, values: true });
    setPracticeAnswer(null);
  }

  return (
    <SectionCard
      title={title}
      description="Move theta and watch Pythagoras become the three core trigonometric identities."
      allowFullscreen
      headerAction={
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tool-button gap-2" onClick={() => setTeachingMode((mode) => (mode === "beginner" ? "professor" : "beginner"))} aria-pressed={teachingMode === "professor"}>
            {teachingMode === "beginner" ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
            <span className="hidden sm:inline">{teachingMode === "beginner" ? "Beginner" : "Professor"}</span>
          </button>
          <button type="button" className="tool-button h-9 w-9 justify-center p-0" onClick={reset} title="Reset proof lab">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="grid gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_350px]">
        <IdentitySelector selected={identityId} onSelect={setIdentityId} />
        <div className="space-y-4">
          <IdentityProofScene identityId={identityId} thetaDeg={thetaDeg} trig={trig} proofModel={proofModel} toggles={toggles} activeStep={activeStep} />
          <CoreIdentityControls
            thetaDeg={thetaDeg}
            setThetaDeg={setThetaDeg}
            proofModel={proofModel}
            setProofModel={setProofModel}
            toggles={toggles}
            setToggles={setToggles}
          />
        </div>
        <div className="space-y-4">
          {toggles.values && <IdentityLhsRhsPanel config={config} evaluation={evaluation} thetaDeg={thetaDeg} />}
          {toggles.steps && <FormulaTransformationLadder identityId={identityId} activeStep={activeStep} setActiveStep={setActiveStep} teachingMode={teachingMode} />}
          <MisconceptionBox identityId={identityId} />
          <PracticePromptCard practiceAnswer={practiceAnswer} setPracticeAnswer={setPracticeAnswer} />
        </div>
      </div>
    </SectionCard>
  );
}

function IdentitySelector({ selected, onSelect }: { selected: CoreIdentityId; onSelect: (id: CoreIdentityId) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Core identities</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Choose a formula. Each proof uses the same Pythagoras idea.</p>
      <div className="mt-3 grid gap-2">
        {(Object.keys(IDENTITY_CONFIG) as CoreIdentityId[]).map((id) => (
          <button key={id} type="button" onClick={() => onSelect(id)} className={selected === id ? "rounded-xl border border-cyan-300 bg-cyan-50 p-3 text-left text-cyan-950 dark:border-cyan-300/40 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}>
            <p className="text-sm font-black"><MathExpression value={IDENTITY_CONFIG[id].formula} /></p>
            <p className="mt-1 text-xs leading-5">{IDENTITY_CONFIG[id].short}</p>
            <p className="mt-2 text-[11px] font-bold uppercase text-slate-400">{IDENTITY_CONFIG[id].undefinedRule}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function IdentityProofScene({ identityId, thetaDeg, trig, proofModel, toggles, activeStep }: { identityId: CoreIdentityId; thetaDeg: number; trig: ReturnType<typeof trigValues>; proofModel: ProofModel; toggles: Record<ToggleKey, boolean>; activeStep: number }) {
  if (identityId === "sin2-plus-cos2") return <UnitCircleSquareProofScene thetaDeg={thetaDeg} trig={trig} proofModel={proofModel} toggles={toggles} activeStep={activeStep} />;
  if (identityId === "one-plus-tan2-sec2") return <TangentSecantProofScene thetaDeg={thetaDeg} trig={trig} proofModel={proofModel} toggles={toggles} activeStep={activeStep} />;
  return <CotangentCosecantProofScene thetaDeg={thetaDeg} trig={trig} proofModel={proofModel} toggles={toggles} activeStep={activeStep} />;
}

function UnitCircleSquareProofScene({ thetaDeg, trig, proofModel, toggles, activeStep }: { thetaDeg: number; trig: ReturnType<typeof trigValues>; proofModel: ProofModel; toggles: Record<ToggleKey, boolean>; activeStep: number }) {
  const cx = 240;
  const cy = 210;
  const r = 118;
  const x = cx + trig.cos * r;
  const y = cy - trig.sin * r;
  const cosSquare = Math.abs(trig.cos) * 82;
  const sinSquare = Math.abs(trig.sin) * 82;

  return (
    <ProofSceneShell title="sin^2 theta + cos^2 theta = 1" subtitle="The point stays on a circle of radius 1, so its horizontal and vertical squared distances add to 1.">
      <svg viewBox="0 0 720 430" className="h-[430px] w-full" role="img" aria-label="Unit circle square proof for sine squared plus cosine squared">
        <rect width="720" height="430" rx="22" fill="#f8fafc" className="dark:fill-slate-900" />
        <Grid />
        <line x1="72" y1={cy} x2="422" y2={cy} stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx} y1="62" x2={cx} y2="354" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="#06b6d4" opacity="0.08" stroke={COLORS.radius} strokeWidth="4" />
        {toggles.triangle && (
          <>
            <polygon points={`${cx},${cy} ${x},${cy} ${x},${y}`} fill="#06b6d4" opacity="0.12" />
            <line x1={cx} y1={cy} x2={x} y2={cy} stroke={COLORS.cos} strokeWidth={activeStep === 1 ? 8 : 5} strokeLinecap="round" />
            <line x1={x} y1={cy} x2={x} y2={y} stroke={COLORS.sin} strokeWidth={activeStep === 1 ? 8 : 5} strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={COLORS.radius} strokeWidth={activeStep === 2 ? 8 : 5} strokeLinecap="round" />
            <SvgText x={(cx + x) / 2 - 28} y={cy + 28} fill={COLORS.cos}>cos theta</SvgText>
            <SvgText x={x + 12} y={(cy + y) / 2} fill={COLORS.sin}>sin theta</SvgText>
            <SvgText x={(cx + x) / 2 + 12} y={(cy + y) / 2 - 12} fill={COLORS.radius}>1</SvgText>
          </>
        )}
        <circle cx={x} cy={y} r="8" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
        {toggles.squares && (
          <>
            <rect x="470" y="86" width={cosSquare} height={cosSquare} fill={COLORS.cos} opacity="0.22" stroke={COLORS.cos} strokeWidth="3" />
            <rect x="470" y={210} width={sinSquare} height={sinSquare} fill={COLORS.sin} opacity="0.22" stroke={COLORS.sin} strokeWidth="3" />
            <rect x="606" y="132" width="82" height="82" fill={COLORS.radius} opacity="0.14" stroke={COLORS.radius} strokeWidth="4" />
            <SvgText x="470" y="72" fill={COLORS.cos}>area cos^2 theta = {formatIdentityValue(trig.cos * trig.cos)}</SvgText>
            <SvgText x="470" y="198" fill={COLORS.sin}>area sin^2 theta = {formatIdentityValue(trig.sin * trig.sin)}</SvgText>
            <SvgText x="598" y="122" fill={COLORS.radius}>radius square = 1</SvgText>
          </>
        )}
        <SvgText x="76" y="48" fill="#0f172a">{proofModel === "algebra" ? "x^2 + y^2 = r^2 becomes cos^2 theta + sin^2 theta = 1." : proofModel === "numeric" ? `At ${thetaDeg} deg: ${formatIdentityValue(trig.sin * trig.sin)} + ${formatIdentityValue(trig.cos * trig.cos)} = 1.` : "Two small squared legs combine to the squared radius."}</SvgText>
      </svg>
    </ProofSceneShell>
  );
}

function TangentSecantProofScene({ thetaDeg, trig, proofModel, toggles, activeStep }: { thetaDeg: number; trig: ReturnType<typeof trigValues>; proofModel: ProofModel; toggles: Record<ToggleKey, boolean>; activeStep: number }) {
  const undefinedState = trig.tan === null || trig.sec === null;
  const tanHeight = undefinedState ? 160 : Math.min(220, Math.abs(trig.tan!) * 74);
  return (
    <ProofSceneShell title="1 + tan^2 theta = sec^2 theta" subtitle="On the tangent triangle, the fixed leg is 1, the vertical leg is tan theta, and the hypotenuse is sec theta.">
      <TriangleIdentitySvg
        thetaDeg={thetaDeg}
        baseLabel="1"
        riseLabel="tan theta"
        hypLabel="sec theta"
        riseValue={trig.tan}
        hypValue={trig.sec}
        riseHeight={tanHeight}
        undefinedState={undefinedState}
        warning="tan theta and sec theta need cos theta in the denominator."
        proofModel={proofModel}
        toggles={toggles}
        activeStep={activeStep}
        formula="1^2 + tan^2 theta = sec^2 theta"
      />
    </ProofSceneShell>
  );
}

function CotangentCosecantProofScene({ thetaDeg, trig, proofModel, toggles, activeStep }: { thetaDeg: number; trig: ReturnType<typeof trigValues>; proofModel: ProofModel; toggles: Record<ToggleKey, boolean>; activeStep: number }) {
  const undefinedState = trig.cot === null || trig.csc === null;
  const cotHeight = undefinedState ? 160 : Math.min(220, Math.abs(trig.cot!) * 74);
  return (
    <ProofSceneShell title="1 + cot^2 theta = cosec^2 theta" subtitle="The companion triangle has one leg 1, the other leg cot theta, and hypotenuse cosec theta.">
      <TriangleIdentitySvg
        thetaDeg={thetaDeg}
        baseLabel="1"
        riseLabel="cot theta"
        hypLabel="cosec theta"
        riseValue={trig.cot}
        hypValue={trig.csc}
        riseHeight={cotHeight}
        undefinedState={undefinedState}
        warning="cot theta and cosec theta need sin theta in the denominator."
        proofModel={proofModel}
        toggles={toggles}
        activeStep={activeStep}
        formula="1^2 + cot^2 theta = cosec^2 theta"
      />
    </ProofSceneShell>
  );
}

function TriangleIdentitySvg({ thetaDeg, baseLabel, riseLabel, hypLabel, riseValue, hypValue, riseHeight, undefinedState, warning, proofModel, toggles, activeStep, formula }: { thetaDeg: number; baseLabel: string; riseLabel: string; hypLabel: string; riseValue: number | null; hypValue: number | null; riseHeight: number; undefinedState: boolean; warning: string; proofModel: ProofModel; toggles: Record<ToggleKey, boolean>; activeStep: number; formula: string }) {
  const ax = 118;
  const ay = 306;
  const bx = 430;
  const by = 306;
  const cy = 306 - riseHeight;
  const arcAngle = degToRad(Math.min(80, Math.max(8, thetaDeg % 180)));
  const arcX = ax + 48 * Math.cos(arcAngle);
  const arcY = ay - 48 * Math.sin(arcAngle);

  return (
    <svg viewBox="0 0 720 430" className="h-[430px] w-full" role="img" aria-label={`${formula} proof triangle`}>
      <rect width="720" height="430" rx="22" fill="#f8fafc" className="dark:fill-slate-900" />
      <Grid />
      <line x1="86" y1={ay} x2="648" y2={ay} stroke="#94a3b8" strokeWidth="2" />
      {toggles.triangle && (
        <>
          <polygon points={`${ax},${ay} ${bx},${by} ${bx},${cy}`} fill="#f97316" opacity="0.12" />
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke={COLORS.cos} strokeWidth={activeStep === 2 ? 8 : 5} strokeLinecap="round" />
          <line x1={bx} y1={by} x2={bx} y2={cy} stroke={COLORS.tan} strokeWidth={activeStep === 3 ? 8 : 5} strokeLinecap="round" />
          <line x1={ax} y1={ay} x2={bx} y2={cy} stroke={COLORS.sec} strokeWidth={activeStep >= 3 ? 8 : 5} strokeLinecap="round" />
          <path d={`M${ax + 48},${ay} A48,48 0 0 0 ${arcX},${arcY}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
          <SvgText x={(ax + bx) / 2 - 8} y={ay + 28} fill={COLORS.cos}>{baseLabel}</SvgText>
          <SvgText x={bx + 14} y={(by + cy) / 2} fill={COLORS.tan}>{riseLabel} = {formatIdentityValue(riseValue)}</SvgText>
          <SvgText x={(ax + bx) / 2 - 8} y={(ay + cy) / 2 - 18} fill={COLORS.sec}>{hypLabel} = {formatIdentityValue(hypValue)}</SvgText>
        </>
      )}
      {toggles.squares && !undefinedState && (
        <>
          <rect x="102" y="48" width="72" height="72" fill={COLORS.cos} opacity="0.18" stroke={COLORS.cos} strokeWidth="3" />
          <rect x="198" y="48" width={Math.min(118, riseHeight / 1.8)} height={Math.min(118, riseHeight / 1.8)} fill={COLORS.tan} opacity="0.18" stroke={COLORS.tan} strokeWidth="3" />
          <rect x="356" y="48" width={Math.min(132, Math.sqrt(Math.max(1, hypValue! * hypValue!)) * 44)} height={Math.min(132, Math.sqrt(Math.max(1, hypValue! * hypValue!)) * 44)} fill={COLORS.sec} opacity="0.12" stroke={COLORS.sec} strokeWidth="3" />
          <SvgText x="92" y="38" fill={COLORS.cos}>1^2</SvgText>
          <SvgText x="192" y="38" fill={COLORS.tan}>{riseLabel}^2</SvgText>
          <SvgText x="350" y="38" fill={COLORS.sec}>{hypLabel}^2</SvgText>
        </>
      )}
      {undefinedState && (
        <g>
          <rect x="78" y="56" width="566" height="86" rx="16" fill="#ffe4e6" stroke={COLORS.warning} strokeWidth="2" />
          <SvgText x="100" y="94" fill={COLORS.warning}>Undefined at this angle</SvgText>
          <SvgText x="100" y="122" fill={COLORS.warning}>{warning}</SvgText>
        </g>
      )}
      <SvgText x="78" y="390" fill="#0f172a">{proofModel === "algebra" ? "This identity comes from dividing sin^2 theta + cos^2 theta = 1." : proofModel === "numeric" ? `${formula}: check LHS and RHS in the live panel.` : "This is still Pythagoras, now on a reciprocal triangle."}</SvgText>
    </svg>
  );
}

function CoreIdentityControls({ thetaDeg, setThetaDeg, proofModel, setProofModel, toggles, setToggles }: { thetaDeg: number; setThetaDeg: (value: number) => void; proofModel: ProofModel; setProofModel: (value: ProofModel) => void; toggles: Record<ToggleKey, boolean>; setToggles: (value: Record<ToggleKey, boolean>) => void }) {
  const progress = (thetaDeg / 360) * 100;
  const toggleLabels: Array<[ToggleKey, string]> = [["squares", "Squares"], ["triangle", "Triangle"], ["steps", "Formula steps"], ["values", "Live values"]];

  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">Angle theta</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">0 to 360 degrees, with honest undefined states.</p>
            </div>
            <span className="rounded-lg bg-cyan-100 px-2 py-1 text-sm font-black text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">{roundTo(thetaDeg, 1)} deg</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={thetaDeg}
            onChange={(event) => setThetaDeg(Number(event.target.value))}
            className="slider-range w-full cursor-pointer appearance-none accent-cyan-500"
            style={{ "--slider-progress": `${progress}%` } as CSSProperties}
            aria-label="Angle theta"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SNAP_ANGLES.map((angle) => (
              <button key={angle} type="button" className="mini-chip" onClick={() => setThetaDeg(angle)}>
                {angle} deg
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <SegmentedButtons<ProofModel> label="Proof model" value={proofModel} options={[["geometry", "Geometry"], ["algebra", "Algebra"], ["numeric", "Numeric"]]} onChange={setProofModel} />
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

function IdentityLhsRhsPanel({ config, evaluation, thetaDeg }: { config: { title: string; formula: string }; evaluation: IdentityEvaluation; thetaDeg: number }) {
  return (
    <div className={evaluation.defined ? "rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10" : "rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-300/20 dark:bg-rose-400/10"}>
      <div className="flex items-center gap-2">
        <Sigma className="h-4 w-4" />
        <p className="text-sm font-black text-slate-950 dark:text-white">Live LHS / RHS verification</p>
      </div>
      <p className="mt-2 text-sm font-black text-slate-950 dark:text-white"><MathExpression value={config.formula} /></p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <ProofMetric label="LHS" value={formatIdentityValue(evaluation.lhs)} />
        <ProofMetric label="RHS" value={formatIdentityValue(evaluation.rhs)} />
        <ProofMetric label="difference" value={formatIdentityValue(evaluation.difference)} />
        <ProofMetric label="status" value={evaluation.defined ? (evaluation.matched ? "Matched" : "Check edge condition") : "Undefined at this angle"} />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
        theta = {thetaDeg} deg. {evaluation.defined ? "Floating-point tolerance is 1e-6." : evaluation.reason}
      </p>
    </div>
  );
}

function FormulaTransformationLadder({ identityId, activeStep, setActiveStep, teachingMode }: { identityId: CoreIdentityId; activeStep: number; setActiveStep: (step: number) => void; teachingMode: TeachingMode }) {
  const steps = TRANSFORM_STEPS[identityId];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black text-slate-950 dark:text-white">Formula transformation ladder</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{teachingMode === "beginner" ? "Read one line at a time. Each line is the same truth in a clearer form." : "The active line drives the diagram emphasis and domain note."}</p>
      <div className="mt-3 space-y-2">
        {steps.map((step, index) => (
          <button key={step} type="button" onClick={() => setActiveStep(index)} className={activeStep === index ? "w-full rounded-lg border border-violet-300 bg-violet-50 p-2 text-left font-mono text-xs font-black text-violet-950 dark:border-violet-300/30 dark:bg-violet-400/10 dark:text-violet-50" : "w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left font-mono text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}>
            Step {index + 1}: <MathExpression value={step} />
          </button>
        ))}
      </div>
    </div>
  );
}

function MisconceptionBox({ identityId }: { identityId: CoreIdentityId }) {
  const focus = identityId === "one-plus-tan2-sec2" ? "At 90 degrees, tan and sec are undefined because cos theta is 0." : identityId === "one-plus-cot2-csc2" ? "At 0, 180, and 360 degrees, cot and cosec are undefined because sin theta is 0." : "The identity is true for every angle, not just special angles.";
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-50">
      <div className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4" />
        <p className="text-sm font-black">Misconception correction</p>
      </div>
      <div className="mt-3 space-y-2 text-xs leading-5">
        <p><span className="font-black">Mistake:</span> sin^2 theta + cos^2 theta means (sin theta + cos theta)^2.</p>
        <p><span className="font-black">Correction:</span> Square sine and cosine separately, then add.</p>
        <p><span className="font-black">Domain note:</span> {focus}</p>
        <p><span className="font-black">Memory:</span> Pythagorean identities are Pythagoras written in trigonometry language.</p>
      </div>
    </div>
  );
}

function PracticePromptCard({ practiceAnswer, setPracticeAnswer }: { practiceAnswer: string | null; setPracticeAnswer: (value: string) => void }) {
  const correct = ["1", "tan-sec", "tan2 + 1 = sec2", "pythagoras"].includes(practiceAnswer ?? "");
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/50">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
        <p className="text-sm font-black text-slate-950 dark:text-white">Quick practice</p>
      </div>
      <div className="mt-3 grid gap-2">
        <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" onClick={() => setPracticeAnswer("1")}>At 60 deg, what should sin^2 theta + cos^2 theta equal?</button>
        <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" onClick={() => setPracticeAnswer("tan-sec")}>Which identity becomes undefined when cos theta = 0?</button>
        <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" onClick={() => setPracticeAnswer("tan2 + 1 = sec2")}>Divide by cos^2 theta. What step appears?</button>
        <button type="button" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" onClick={() => setPracticeAnswer("pythagoras")}>Which proof idea explains all three identities?</button>
      </div>
      <p className="mt-3 rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
        {practiceAnswer === null ? "Choose a prompt after moving theta." : correct ? "Correct. That answer follows directly from the proof model." : "Use the diagram and try again."}
      </p>
    </div>
  );
}

function ProofSceneShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
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
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-slate-950">
        {options.map(([id, text]) => (
          <button key={id} type="button" className={id === value ? "rounded-lg bg-cyan-600 px-2 py-1.5 text-xs font-black text-white shadow-sm" : "rounded-lg px-2 py-1.5 text-xs font-black text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"} onClick={() => onChange(id)} aria-pressed={id === value}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProofMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-950/60">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function trigValues(thetaDeg: number) {
  const theta = degToRad(thetaDeg);
  const sin = cleanNumber(Math.sin(theta));
  const cos = cleanNumber(Math.cos(theta));
  return {
    sin,
    cos,
    tan: safeDivide(sin, cos),
    sec: safeDivide(1, cos),
    cot: safeDivide(cos, sin),
    csc: safeDivide(1, sin),
  };
}

function buildEvaluation(lhs: number, rhs: number): IdentityEvaluation {
  const difference = cleanNumber(Math.abs(lhs - rhs));
  return {
    lhs,
    rhs,
    defined: true,
    difference,
    matched: difference <= EPSILON,
  };
}

function Grid() {
  return (
    <g opacity="0.55">
      {Array.from({ length: 13 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 55} y1="30" x2={40 + i * 55} y2="398" stroke="#e2e8f0" />)}
      {Array.from({ length: 8 }).map((_, i) => <line key={`h-${i}`} x1="32" y1={45 + i * 48} x2="688" y2={45 + i * 48} stroke="#e2e8f0" />)}
    </g>
  );
}

function SvgText({ x, y, fill, children }: { x: number | string; y: number | string; fill: string; children: ReactNode }) {
  return (
    <text x={x} y={y} fill={fill} fontSize="14" fontWeight="900" paintOrder="stroke" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </text>
  );
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value)) return value;
  return Math.abs(value) < EPSILON ? 0 : value;
}
