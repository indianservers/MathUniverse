import { useEffect, useMemo, useState, type CSSProperties } from "react";
import FormulaPanel from "../components/FormulaPanel";
import MathLabel from "../components/MathLabel";
import ProofControls from "../components/ProofControls";
import StepPanel from "../components/StepPanel";
import VisualProofLayout from "../components/VisualProofLayout";
import type { ProofStep, VisualProof, VisualProofCategory } from "../data/proofTypes";

type CircleAreaUnrollingProofProps = {
  category: VisualProofCategory;
  proof: VisualProof;
};

const sectorOptions = [8, 16, 32, 64, 128];

const proofSteps: ProofStep[] = [
  {
    id: "circle",
    title: "Start with a circle",
    description: "The circle has radius r. Its area is the space inside this boundary.",
    focusLabel: "radius r",
  },
  {
    id: "sectors",
    title: "Cut into equal sectors",
    description: "Each sector is a very thin slice. More sectors make the curved boundary easier to straighten.",
    focusLabel: "equal sectors",
  },
  {
    id: "separate",
    title: "Separate the slices",
    description: "The slices move apart so we can rearrange them without changing total area.",
    focusLabel: "same area",
  },
  {
    id: "unroll",
    title: "Unroll the circumference",
    description: "Place the tiny curved edges end to end. Together they form a base close to the circumference.",
    focusLabel: "unrolled arc",
  },
  {
    id: "base",
    title: "Read the base",
    description: "The full circumference of the circle is 2 pi r, so the unrolled base is approximately 2 pi r.",
    focusLabel: "base 2 pi r",
  },
  {
    id: "height",
    title: "Read the height",
    description: "Every sector reaches from the center to the circle, so the height of the rearranged shape is r.",
    focusLabel: "height r",
  },
  {
    id: "formula",
    title: "Use triangle area",
    description: "Area = 1/2 x base x height = 1/2 x 2 pi r x r = pi r^2.",
    focusLabel: "area pi r^2",
  },
];

export default function CircleAreaUnrollingProof({ category, proof }: CircleAreaUnrollingProofProps) {
  const [sectorIndex, setSectorIndex] = useState(1);
  const [radius, setRadius] = useState(96);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);

  const sectorCount = sectorOptions[sectorIndex];

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= proofSteps.length - 1) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 1300);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const sectors = useMemo(() => buildSectorPaths(sectorCount, radius, 230, 235, activeStep >= 2 ? 10 : 0), [activeStep, radius, sectorCount]);

  function reset() {
    setIsPlaying(false);
    setActiveStep(0);
  }

  const controls = (
    <div className="space-y-4">
      <ProofControls
        activeStep={activeStep}
        totalSteps={proofSteps.length}
        isPlaying={isPlaying}
        labelsVisible={labelsVisible}
        formulaVisible={formulaVisible}
        playLabel={`Play ${proof.title}`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={reset}
        onPrevious={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.max(0, step - 1));
        }}
        onNext={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.min(proofSteps.length - 1, step + 1));
        }}
        onToggleLabels={() => setLabelsVisible((value) => !value)}
        onToggleFormula={() => setFormulaVisible((value) => !value)}
      />
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Parameters</h2>
        <Slider
          label="Sector count"
          value={sectorIndex}
          min={0}
          max={sectorOptions.length - 1}
          displayValue={`${sectorCount} sectors`}
          onChange={(value) => setSectorIndex(value)}
        />
        <Slider
          label="Radius"
          value={radius}
          min={70}
          max={130}
          displayValue={`r = ${radius}`}
          onChange={(value) => setRadius(value)}
        />
      </section>
    </div>
  );

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<CircleUnrollingSvg sectors={sectors} sectorCount={sectorCount} radius={radius} activeStep={activeStep} labelsVisible={labelsVisible} />}
      controls={controls}
      steps={<StepPanel steps={proofSteps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={
        <FormulaPanel
          visible={formulaVisible}
          formulas={[
            "Circumference = 2 pi r",
            "Area = 1/2 x base x height",
            "Area = 1/2 x 2 pi r x r",
            "Area = pi r^2",
          ]}
        />
      }
      conceptNotes={
        <p>
          Cutting the circle into sectors does not change its area. As the sectors become thinner, their curved outer edges behave more like straight pieces.
          When those tiny arcs are placed end to end, they measure the circumference, 2 pi r. The height stays r because each sector radius runs from the
          center to the circle. In the limiting picture, the rearranged area is the same as the circle area.
        </p>
      }
      reflectionQuestions={[
        "What changes when you move from 8 sectors to 128 sectors?",
        "Why does the height stay equal to the radius even after rearranging?",
        "Where does the circumference 2 pi r appear in the unrolled figure?",
      ]}
    />
  );
}

function CircleUnrollingSvg({
  sectors,
  sectorCount,
  radius,
  activeStep,
  labelsVisible,
}: {
  sectors: SectorPath[];
  sectorCount: number;
  radius: number;
  activeStep: number;
  labelsVisible: boolean;
}) {
  const baseWidth = Math.min(390, radius * Math.PI * 1.32);
  const baseX = 455;
  const baseY = 340;
  const height = Math.min(140, radius * 0.95);
  const apex = { x: baseX + baseWidth / 2, y: baseY - height };
  const showUnrolled = activeStep >= 3;
  const emphasizeBase = activeStep >= 4;
  const emphasizeHeight = activeStep >= 5;
  const emphasizeFormula = activeStep >= 6;

  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 520" role="img" aria-label="Circle sectors unrolled into a triangle proving circle area" className="h-[520px] w-full max-w-full">
        <defs>
          <linearGradient id="visual-proof-circle" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="visual-proof-unroll" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="visual-proof-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="18" y="18" width="864" height="484" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <text x="54" y="58" className="fill-slate-900 text-[22px] font-black dark:fill-white">Area of Circle by Unrolling Circumference</text>
        <text x="54" y="84" className="fill-slate-500 text-[13px] font-bold dark:fill-slate-300">Use sliders and steps to see the circle become an area formula.</text>

        <g className="transition-all duration-700" opacity={showUnrolled ? 0.55 : 1}>
          {activeStep === 0 ? (
            <circle cx="230" cy="235" r={radius} fill="url(#visual-proof-circle)" opacity="0.86" className="stroke-cyan-700 dark:stroke-cyan-200" strokeWidth="3" />
          ) : (
            sectors.map((sector, index) => (
              <path
                key={sector.d}
                d={sector.d}
                fill={index % 2 === 0 ? "#22d3ee" : "#a78bfa"}
                opacity="0.82"
                stroke="rgba(15,23,42,0.32)"
                strokeWidth="0.7"
              />
            ))
          )}
          <line x1="230" y1="235" x2={230 + radius} y2="235" stroke="#0f172a" strokeWidth="3" className="dark:stroke-white" />
          <circle cx="230" cy="235" r="4" className="fill-slate-950 dark:fill-white" />
          {labelsVisible && <MathLabel x={230 + radius / 2} y={222} tone="slate">r</MathLabel>}
        </g>

        {activeStep >= 1 && labelsVisible && (
          <text x="230" y={395} textAnchor="middle" className="fill-slate-600 text-[13px] font-black dark:fill-slate-300">
            {sectorCount} equal sectors
          </text>
        )}

        {showUnrolled && (
          <g filter="url(#visual-proof-glow)">
            <path
              d={`M ${baseX} ${baseY} L ${baseX + baseWidth} ${baseY} L ${apex.x} ${apex.y} Z`}
              fill="url(#visual-proof-unroll)"
              opacity="0.16"
              stroke={emphasizeFormula ? "#22c55e" : "#0891b2"}
              strokeWidth={emphasizeFormula ? 4 : 2}
            />
            {Array.from({ length: Math.min(sectorCount, 64) }, (_, index) => {
              const x1 = baseX + index * (baseWidth / Math.min(sectorCount, 64));
              const x2 = baseX + (index + 1) * (baseWidth / Math.min(sectorCount, 64));
              return (
                <path
                  key={index}
                  d={`M ${x1} ${baseY} L ${x2} ${baseY} L ${apex.x} ${apex.y} Z`}
                  fill={index % 2 === 0 ? "#22d3ee" : "#f59e0b"}
                  opacity="0.34"
                  stroke="rgba(15,23,42,0.16)"
                  strokeWidth="0.5"
                />
              );
            })}
            {Array.from({ length: Math.min(sectorCount, 64) + 1 }, (_, index) => {
              const x = baseX + index * (baseWidth / Math.min(sectorCount, 64));
              return <line key={index} x1={x} y1={baseY} x2={apex.x} y2={apex.y} stroke="rgba(15,23,42,0.16)" strokeWidth="0.45" />;
            })}
            <line x1={baseX} y1={baseY + 18} x2={baseX + baseWidth} y2={baseY + 18} stroke={emphasizeBase ? "#f59e0b" : "#64748b"} strokeWidth={emphasizeBase ? 5 : 3} />
            <line x1={apex.x} y1={apex.y} x2={apex.x} y2={baseY} stroke={emphasizeHeight ? "#22c55e" : "#64748b"} strokeDasharray="8 7" strokeWidth={emphasizeHeight ? 5 : 3} />
            <circle cx={apex.x} cy={apex.y} r="5" fill="#22c55e" />
            {labelsVisible && (
              <>
                <MathLabel x={baseX + baseWidth / 2} y={baseY + 52} tone="amber">base approx 2πr</MathLabel>
                <MathLabel x={apex.x + 42} y={baseY - height / 2} tone="emerald">height r</MathLabel>
                <MathLabel x={apex.x} y={apex.y - 20} tone="cyan">same area</MathLabel>
              </>
            )}
            {emphasizeFormula && labelsVisible && (
              <text x={baseX + baseWidth / 2} y="450" textAnchor="middle" className="fill-emerald-700 text-[23px] font-black dark:fill-emerald-100">
                Area = πr²
              </text>
            )}
          </g>
        )}

        {!showUnrolled && activeStep >= 2 && labelsVisible && (
          <text x="585" y="250" className="fill-slate-600 text-[16px] font-black dark:fill-slate-300">
            The pieces are ready to unroll.
          </text>
        )}

        {showUnrolled && labelsVisible && (
          <text x="648" y="126" textAnchor="middle" className="fill-slate-700 text-[15px] font-black dark:fill-slate-200">
            As sectors get thinner, the jagged model approaches a clean triangle.
          </text>
        )}
      </svg>
    </div>
  );
}

type SectorPath = {
  d: string;
};

function buildSectorPaths(count: number, radius: number, cx: number, cy: number, separation: number): SectorPath[] {
  const angleStep = (Math.PI * 2) / count;
  return Array.from({ length: count }, (_, index) => {
    const startAngle = -Math.PI / 2 + index * angleStep;
    const endAngle = startAngle + angleStep;
    const midAngle = (startAngle + endAngle) / 2;
    const offsetX = Math.cos(midAngle) * separation;
    const offsetY = Math.sin(midAngle) * separation;
    const start = polarToCartesian(cx + offsetX, cy + offsetY, radius, startAngle);
    const end = polarToCartesian(cx + offsetX, cy + offsetY, radius, endAngle);
    const largeArc = angleStep > Math.PI ? 1 : 0;
    return {
      d: [
        `M ${cx + offsetX} ${cy + offsetY}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        "Z",
      ].join(" "),
    };
  });
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function Slider({
  label,
  value,
  min,
  max,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  displayValue: string;
  onChange: (value: number) => void;
}) {
  const progress = `${((value - min) / (max - min)) * 100}%`;

  return (
    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        <span className="mini-chip">{displayValue}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--slider-progress": progress } as CSSProperties}
        className="mt-3 w-full accent-cyan-500"
        aria-label={label}
      />
    </label>
  );
}
