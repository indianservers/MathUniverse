import {
  type ExplanationLevel,
  type TrigFormulaDefinition,
  type TrigFormulaId,
  type TrigFormulaValues,
  formatTrigNumber,
  getFormulaLiveValue,
} from "../../utils/trigFormulaUtils";
import MathExpression from "../../../components/ui/MathExpression";

type IdentityProofPanelProps = {
  formula: TrigFormulaDefinition;
  values: TrigFormulaValues;
  explanationLevel: ExplanationLevel;
  compareEvenOdd: boolean;
  compareComplementary: boolean;
};

const svgClass = "h-[260px] w-full rounded-lg bg-slate-950";

export default function IdentityProofPanel({
  formula,
  values,
  explanationLevel,
  compareEvenOdd,
  compareComplementary,
}: IdentityProofPanelProps) {
  return (
    <section
      className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60"
      data-testid="identity-proof-panel"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Visual proof panel</p>
          <MathExpression value={formula.formula} display className="mt-2 text-2xl font-black text-slate-950 dark:text-white" />
          <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{formula.meaning}</p>
        </div>
        <div className="rounded-lg bg-cyan-50 px-3 py-2 dark:bg-cyan-400/10">
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Live value</p>
          <p className="mt-1 font-mono text-lg font-black text-cyan-900 dark:text-cyan-50" data-testid="selected-formula-live-value">
            {getFormulaLiveValue(formula.id, values)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        {renderProofVisual(formula.id, values, compareEvenOdd, compareComplementary)}
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labelForLevel(explanationLevel)}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200" data-testid="selected-formula-explanation">
              {formula.explanations[explanationLevel]}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ProofMetric label="sin" value={formatTrigNumber(values.sin)} />
            <ProofMetric label="cos" value={formatTrigNumber(values.cos)} />
            <ProofMetric label="tan" value={values.tan === null ? "undefined" : formatTrigNumber(values.tan)} />
            <ProofMetric label="cot" value={values.cot === null ? "undefined" : formatTrigNumber(values.cot)} />
            <ProofMetric label="sec" value={values.sec === null ? "undefined" : formatTrigNumber(values.sec)} />
            <ProofMetric label="cosec" value={values.cosec === null ? "undefined" : formatTrigNumber(values.cosec)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function renderProofVisual(
  formulaId: TrigFormulaId,
  values: TrigFormulaValues,
  compareEvenOdd: boolean,
  compareComplementary: boolean,
) {
  if (formulaId.startsWith("even-") || compareEvenOdd) return <EvenOddVisual values={values} />;
  if (formulaId.startsWith("comp-") || compareComplementary) return <ComplementaryVisual values={values} />;
  if (formulaId.includes("reciprocal") || formulaId === "tan-ratio" || formulaId === "cot-ratio" || formulaId === "tan" || formulaId === "cot") return <QuotientVisual values={values} />;
  if (formulaId.startsWith("periodic-") || formulaId.startsWith("angle-") || formulaId.startsWith("double-")) return <AngleTransformVisual values={values} formulaId={formulaId} />;
  return <PythagoreanVisual values={values} formulaId={formulaId} />;
}

function PythagoreanVisual({ values, formulaId }: { values: TrigFormulaValues; formulaId: TrigFormulaId }) {
  const origin = { x: 86, y: 190 };
  const base = 190 * Math.abs(values.cos);
  const height = 130 * Math.abs(values.sin);
  const point = { x: origin.x + base, y: origin.y - height };
  const sinSquare = 90 * values.sinSquare;
  const cosSquare = 90 * values.cosSquare;
  const tanIdentity = formulaId === "pythagorean-tan";
  const cotIdentity = formulaId === "pythagorean-cot";

  return (
    <svg viewBox="0 0 520 260" className={svgClass} data-testid="pythagorean-proof-visual" role="img" aria-label="Pythagorean trigonometry proof">
      <rect width="520" height="260" fill="#020617" />
      <line x1="46" y1="190" x2="330" y2="190" stroke="#64748b" strokeWidth="2" />
      <line x1={origin.x} y1="34" x2={origin.x} y2="216" stroke="#64748b" strokeWidth="2" />
      <line x1={origin.x} y1={origin.y} x2={point.x} y2={origin.y} stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
      <line x1={point.x} y1={origin.y} x2={point.x} y2={point.y} stroke="#fb7185" strokeWidth="7" strokeLinecap="round" />
      <line x1={origin.x} y1={origin.y} x2={point.x} y2={point.y} stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      <circle cx={point.x} cy={point.y} r="7" fill="#f59e0b" />
      <text x={origin.x + base / 2 - 22} y={origin.y + 26} fill="#38bdf8" fontSize="13" fontWeight="900">cos theta</text>
      <text x={point.x + 12} y={origin.y - height / 2} fill="#fb7185" fontSize="13" fontWeight="900">sin theta</text>
      <text x={origin.x + base / 2 - 12} y={origin.y - height / 2 - 12} fill="#fef3c7" fontSize="13" fontWeight="900">1</text>

      <g transform="translate(350 42)">
        <text x="0" y="0" fill="#e2e8f0" fontSize="14" fontWeight="900">Square areas</text>
        <rect x="0" y="20" width={cosSquare} height={cosSquare} fill="rgba(56,189,248,0.55)" stroke="#38bdf8" strokeWidth="2" />
        <rect x="84" y="20" width={sinSquare} height={sinSquare} fill="rgba(251,113,133,0.55)" stroke="#fb7185" strokeWidth="2" />
        <text x="0" y="136" fill="#38bdf8" fontSize="12" fontWeight="800">cos^2 = {formatTrigNumber(values.cosSquare)}</text>
        <text x="0" y="154" fill="#fb7185" fontSize="12" fontWeight="800">sin^2 = {formatTrigNumber(values.sinSquare)}</text>
        <text x="0" y="182" fill="#fef3c7" fontSize="12" fontWeight="900">
          {tanIdentity ? "1 + tan^2 = sec^2" : cotIdentity ? "1 + cot^2 = cosec^2" : "sin^2 + cos^2 = 1"}
        </text>
      </g>
    </svg>
  );
}

function QuotientVisual({ values }: { values: TrigFormulaValues }) {
  return (
    <svg viewBox="0 0 520 260" className={svgClass} data-testid="quotient-proof-visual" role="img" aria-label="Quotient identity proof">
      <rect width="520" height="260" fill="#020617" />
      <line x1="72" y1="198" x2="270" y2="198" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
      <line x1="270" y1="198" x2="270" y2="74" stroke="#fb7185" strokeWidth="8" strokeLinecap="round" />
      <line x1="72" y1="198" x2="270" y2="74" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />
      <path d="M 108 198 A 36 36 0 0 0 98 174" fill="none" stroke="#f59e0b" strokeWidth="4" />
      <text x="140" y="222" fill="#38bdf8" fontSize="14" fontWeight="900">adjacent = cos theta</text>
      <text x="282" y="138" fill="#fb7185" fontSize="14" fontWeight="900">opposite = sin theta</text>
      <line x1="360" y1="40" x2="360" y2="220" stroke="#facc15" strokeWidth="3" strokeDasharray="7 5" />
      <line x1="360" y1="130" x2="360" y2={values.tan === null ? 130 : Math.max(48, Math.min(220, 130 - values.tan * 46))} stroke="#facc15" strokeWidth="8" strokeLinecap="round" />
      <text x="380" y="78" fill="#fef3c7" fontSize="13" fontWeight="900">tan line</text>
      <text x="72" y="42" fill="#e2e8f0" fontSize="15" fontWeight="900">tan theta = opposite / adjacent = sin theta / cos theta</text>
      <text x="72" y="64" fill="#cbd5e1" fontSize="13" fontWeight="800">cot theta flips the same ratio: adjacent / opposite.</text>
    </svg>
  );
}

function EvenOddVisual({ values }: { values: TrigFormulaValues }) {
  const origin = { x: 250, y: 132 };
  const radius = 88;
  const positive = { x: origin.x + values.cos * radius, y: origin.y - values.sin * radius };
  const negative = { x: origin.x + values.cos * radius, y: origin.y + values.sin * radius };

  return (
    <svg viewBox="0 0 520 260" className={svgClass} data-testid="even-odd-proof-visual" role="img" aria-label="Even odd trigonometry comparison">
      <rect width="520" height="260" fill="#020617" />
      <circle cx={origin.x} cy={origin.y} r={radius} fill="rgba(34,211,238,0.08)" stroke="#67e8f9" strokeWidth="3" />
      <line x1="92" y1={origin.y} x2="430" y2={origin.y} stroke="#cbd5e1" strokeWidth="2" />
      <line x1={origin.x} y1="36" x2={origin.x} y2="224" stroke="#475569" strokeWidth="2" />
      <line x1={origin.x} y1={origin.y} x2={positive.x} y2={positive.y} stroke="#c084fc" strokeWidth="5" strokeLinecap="round" />
      <line x1={origin.x} y1={origin.y} x2={negative.x} y2={negative.y} stroke="#fb7185" strokeWidth="5" strokeLinecap="round" />
      <line x1={positive.x} y1={positive.y} x2={negative.x} y2={negative.y} stroke="#94a3b8" strokeDasharray="5 5" />
      <circle cx={positive.x} cy={positive.y} r="7" fill="#c084fc" />
      <circle cx={negative.x} cy={negative.y} r="7" fill="#fb7185" />
      <text x="38" y="42" fill="#e2e8f0" fontSize="15" fontWeight="900">Compare theta and -theta</text>
      <text x="38" y="70" fill="#fb7185" fontSize="13" fontWeight="800">sin flips: {formatTrigNumber(values.sin)} to {formatTrigNumber(-values.sin)}</text>
      <text x="38" y="92" fill="#38bdf8" fontSize="13" fontWeight="800">cos stays: {formatTrigNumber(values.cos)}</text>
      <text x="38" y="114" fill="#facc15" fontSize="13" fontWeight="800">tan flips sign when defined</text>
    </svg>
  );
}

function ComplementaryVisual({ values }: { values: TrigFormulaValues }) {
  return (
    <svg viewBox="0 0 520 260" className={svgClass} data-testid="complementary-proof-visual" role="img" aria-label="Complementary angle trigonometry comparison">
      <rect width="520" height="260" fill="#020617" />
      <line x1="88" y1="204" x2="330" y2="204" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
      <line x1="330" y1="204" x2="330" y2="72" stroke="#fb7185" strokeWidth="8" strokeLinecap="round" />
      <line x1="88" y1="204" x2="330" y2="72" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      <path d="M 128 204 A 40 40 0 0 0 118 178" fill="none" stroke="#c084fc" strokeWidth="4" />
      <path d="M 330 116 A 44 44 0 0 1 292 96" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="116" y="230" fill="#c084fc" fontSize="13" fontWeight="900">theta</text>
      <text x="274" y="104" fill="#22d3ee" fontSize="13" fontWeight="900">90 deg - theta</text>
      <text x="72" y="42" fill="#e2e8f0" fontSize="15" fontWeight="900">Complementary angles swap sides</text>
      <text x="72" y="70" fill="#fb7185" fontSize="13" fontWeight="800">sin(90 deg - theta) = adjacent for theta = cos theta = {formatTrigNumber(values.cos)}</text>
      <text x="72" y="92" fill="#38bdf8" fontSize="13" fontWeight="800">cos(90 deg - theta) = opposite for theta = sin theta = {formatTrigNumber(values.sin)}</text>
      <text x="72" y="114" fill="#facc15" fontSize="13" fontWeight="800">tan(90 deg - theta) = cot theta</text>
    </svg>
  );
}

function AngleTransformVisual({ values, formulaId }: { values: TrigFormulaValues; formulaId: TrigFormulaId }) {
  const origin = { x: 260, y: 132 };
  const radius = 86;
  const thetaPoint = pointOnCircle(origin, radius, values.degrees);
  const beta = 30;
  const targetDegrees = formulaId.startsWith("double-")
    ? values.degrees * 2
    : formulaId.startsWith("periodic-tan")
      ? values.degrees + 180
      : formulaId.startsWith("periodic-")
        ? values.degrees + 360
        : formulaId.includes("diff")
          ? values.degrees - beta
          : values.degrees + beta;
  const targetPoint = pointOnCircle(origin, radius, targetDegrees);
  const targetLabel = formulaId.startsWith("double-") ? "2theta" : formulaId.startsWith("periodic-") ? "repeat angle" : formulaId.includes("diff") ? "theta - beta" : "theta + beta";

  return (
    <svg viewBox="0 0 520 260" className={svgClass} data-testid="angle-transform-proof-visual" role="img" aria-label="Angle transform trigonometry comparison">
      <rect width="520" height="260" fill="#020617" />
      <circle cx={origin.x} cy={origin.y} r={radius} fill="rgba(34,211,238,0.08)" stroke="#67e8f9" strokeWidth="3" />
      <line x1="88" y1={origin.y} x2="432" y2={origin.y} stroke="#cbd5e1" strokeWidth="2" />
      <line x1={origin.x} y1="34" x2={origin.x} y2="226" stroke="#475569" strokeWidth="2" />
      <path d={arcPath(origin, radius + 18, 0, values.degrees)} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <path d={arcPath(origin, radius + 34, values.degrees, targetDegrees)} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 6" />
      <line x1={origin.x} y1={origin.y} x2={thetaPoint.x} y2={thetaPoint.y} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <line x1={origin.x} y1={origin.y} x2={targetPoint.x} y2={targetPoint.y} stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <line x1={targetPoint.x} y1={origin.y} x2={targetPoint.x} y2={targetPoint.y} stroke="#fb7185" strokeWidth="6" strokeLinecap="round" />
      <line x1={origin.x} y1={origin.y} x2={targetPoint.x} y2={origin.y} stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
      <circle cx={thetaPoint.x} cy={thetaPoint.y} r="7" fill="#f59e0b" />
      <circle cx={targetPoint.x} cy={targetPoint.y} r="7" fill="#22d3ee" />
      <text x="34" y="42" fill="#e2e8f0" fontSize="15" fontWeight="900">Angle transformation</text>
      <text x="34" y="70" fill="#f59e0b" fontSize="13" fontWeight="800">theta = {formatTrigNumber(values.degrees)} deg</text>
      <text x="34" y="92" fill="#22d3ee" fontSize="13" fontWeight="800">{targetLabel} = {formatTrigNumber(((targetDegrees % 360) + 360) % 360)} deg</text>
      <text x="34" y="116" fill="#fb7185" fontSize="13" fontWeight="800">new sine = vertical projection</text>
      <text x="34" y="138" fill="#38bdf8" fontSize="13" fontWeight="800">new cosine = horizontal projection</text>
      <text x="312" y="42" fill="#cbd5e1" fontSize="13" fontWeight="800">beta helper angle = 30 deg</text>
    </svg>
  );
}

function pointOnCircle(origin: { x: number; y: number }, radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return { x: origin.x + Math.cos(radians) * radius, y: origin.y - Math.sin(radians) * radius };
}

function arcPath(origin: { x: number; y: number }, radius: number, startDegrees: number, endDegrees: number) {
  const start = pointOnCircle(origin, radius, startDegrees);
  const end = pointOnCircle(origin, radius, endDegrees);
  const sweep = endDegrees >= startDegrees ? 0 : 1;
  const delta = Math.abs(endDegrees - startDegrees);
  const largeArc = delta % 360 > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function ProofMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function labelForLevel(level: ExplanationLevel) {
  if (level === "detailed") return "Detailed";
  if (level === "memory") return "Exam Memory Trick";
  return "Simple";
}
