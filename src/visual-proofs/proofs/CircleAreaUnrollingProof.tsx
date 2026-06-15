import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import FormulaPanel from "../components/FormulaPanel";
import MathLabel from "../components/MathLabel";
import ProofControls from "../components/ProofControls";
import SymbolLegendPanel, { buildSymbolMeanings } from "../components/SymbolLegendPanel";
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
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const progressRef = useRef(0);

  const sectorCount = sectorOptions[sectorIndex];
  const formulas = useMemo(
    () => [
      "Circumference = 2πr",
      "Area = 1/2 x base x height",
      "Area = 1/2 x 2πr x r",
      "Area = πr²",
    ],
    [],
  );
  const symbolMeanings = useMemo(
    () => buildSymbolMeanings({
      proof,
      formulas,
      parameters: [
        { key: "r", label: "radius of the circle", value: radius },
        { key: "n", label: "number of equal sectors", value: sectorCount },
      ],
      extra: [
        { symbol: "base", meaning: "unrolled circumference", value: "about 2πr" },
        { symbol: "height", meaning: "sector radius", value: "r" },
        { symbol: "A", meaning: "area of the original circle", value: "πr²" },
      ],
    }),
    [formulas, proof, radius, sectorCount],
  );

  useEffect(() => {
    if (!isPlaying) return undefined;
    const maxProgress = proofSteps.length - 1;
    const stepDurationMs = 1450;
    let frame = 0;
    let previousTime = performance.now();

    function tick(now: number) {
      const deltaSteps = (now - previousTime) / stepDurationMs;
      previousTime = now;
      const nextProgress = Math.min(maxProgress, progressRef.current + deltaSteps);
      progressRef.current = nextProgress;
      setTimelineProgress(nextProgress);
      setActiveStep(Math.round(nextProgress));
      if (nextProgress >= maxProgress) {
          setIsPlaying(false);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) return;
    progressRef.current = activeStep;
    setTimelineProgress(activeStep);
  }, [activeStep, isPlaying, radius, sectorCount]);

  const sectors = useMemo(() => buildSectorPaths(sectorCount, radius, 230, 246, smoothstep(clamp01((timelineProgress - 1) / 1.1)) * 13), [radius, sectorCount, timelineProgress]);

  function reset() {
    setIsPlaying(false);
    setActiveStep(0);
    progressRef.current = 0;
    setTimelineProgress(0);
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
          setActiveStep((step) => {
            const next = Math.max(0, step - 1);
            progressRef.current = next;
            setTimelineProgress(next);
            return next;
          });
        }}
        onNext={() => {
          setIsPlaying(false);
          setActiveStep((step) => {
            const next = Math.min(proofSteps.length - 1, step + 1);
            progressRef.current = next;
            setTimelineProgress(next);
            return next;
          });
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
      visual={<CircleUnrollingSvg sectors={sectors} sectorCount={sectorCount} radius={radius} activeStep={activeStep} timelineProgress={timelineProgress} labelsVisible={labelsVisible} />}
      controls={controls}
      steps={<StepPanel steps={proofSteps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={
        <FormulaPanel
          visible={formulaVisible}
          formulas={formulas}
        />
      }
      symbolLegend={<SymbolLegendPanel meanings={symbolMeanings} />}
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
  timelineProgress,
  labelsVisible,
}: {
  sectors: SectorPath[];
  sectorCount: number;
  radius: number;
  activeStep: number;
  timelineProgress: number;
  labelsVisible: boolean;
}) {
  const progress = timelineProgress;
  const circleCutProgress = smoothstep(clamp01((progress - 0.45) / 1.05));
  const separationProgress = smoothstep(clamp01((progress - 1.3) / 1.25));
  const unrollProgress = smoothstep(clamp01((progress - 2.15) / 1.85));
  const compareProgress = smoothstep(clamp01((progress - 3.55) / 1.4));
  const formulaProgress = smoothstep(clamp01((progress - 5.2) / 0.9));
  const baseWidth = Math.min(455, Math.max(315, radius * 4.55));
  const baseX = 414;
  const baseY = 356;
  const height = Math.min(145, Math.max(90, radius * 0.96));
  const apex = { x: baseX + baseWidth / 2, y: baseY - height };
  const visibleFanCount = Math.min(sectorCount, 72);
  const emphasizeBase = activeStep >= 4 || compareProgress > 0.35;
  const emphasizeHeight = activeStep >= 5 || compareProgress > 0.7;
  const emphasizeFormula = activeStep >= 6 || formulaProgress > 0.2;
  const circleOpacity = 1 - unrollProgress * 0.22;
  const modelOpacity = clamp01(unrollProgress * 1.2);
  const baseDrawWidth = baseWidth * clamp01(compareProgress + unrollProgress * 0.45);
  const showUnrolled = modelOpacity > 0.01;

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
          <linearGradient id="visual-proof-stage" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#eef2ff" />
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
        <text x="54" y="84" className="fill-slate-500 text-[13px] font-bold dark:fill-slate-300">Watch equal sectors unfold into a triangle-like area model.</text>
        <rect x="48" y="110" width="804" height="336" rx="18" fill="url(#visual-proof-stage)" stroke="#dbeafe" />

        <g opacity={circleOpacity}>
          <circle cx="230" cy="246" r={radius} fill="none" stroke="#0f172a" strokeWidth="1.2" opacity="0.18" />
          {circleCutProgress < 0.2 ? (
            <circle cx="230" cy="246" r={radius} fill="url(#visual-proof-circle)" opacity="0.86" className="stroke-cyan-700 dark:stroke-cyan-200" strokeWidth="3" />
          ) : (
            sectors.map((sector, index) => (
              <path
                key={sector.d}
                d={sector.d}
                fill={index % 2 === 0 ? "#8be3ef" : "#c4b5fd"}
                opacity={0.66 + separationProgress * 0.18}
                stroke="#ffffff"
                strokeWidth="1.4"
              />
            ))
          )}
          <line x1="230" y1="246" x2={230 + radius} y2="246" stroke="#0f172a" strokeWidth="3" className="dark:stroke-white" />
          <circle cx="230" cy="246" r="5" className="fill-slate-950 dark:fill-white" />
          {labelsVisible && (
            <>
              <MathLabel x={230 + radius / 2} y={232} tone="slate">r</MathLabel>
              <text x="230" y={radius + 298} textAnchor="middle" className="fill-slate-700 text-[13px] font-black dark:fill-slate-300">
                {sectorCount} equal sectors
              </text>
            </>
          )}
        </g>

        {showUnrolled && (
          <g filter="url(#visual-proof-glow)" opacity={modelOpacity}>
            <path
              d={`M ${baseX} ${baseY} L ${baseX + baseWidth} ${baseY} L ${apex.x} ${apex.y} Z`}
              fill="#14b8a6"
              opacity="0.08"
              stroke={emphasizeFormula ? "#059669" : "#0891b2"}
              strokeWidth={emphasizeFormula ? 4 : 2}
            />
            {Array.from({ length: visibleFanCount }, (_, index) => {
              const localProgress = clamp01(unrollProgress * 1.25 - (index / visibleFanCount) * 0.25);
              const x1 = baseX + index * (baseWidth / visibleFanCount);
              const x2 = baseX + (index + 1) * (baseWidth / visibleFanCount);
              const drop = (1 - localProgress) * 52;
              const lean = (1 - localProgress) * (index - visibleFanCount / 2) * 0.55;
              return (
                <path
                  key={index}
                  d={`M ${x1 + lean} ${baseY + drop} L ${x2 + lean} ${baseY + drop} L ${apex.x} ${apex.y + drop * 0.18} Z`}
                  fill={index % 2 === 0 ? "#67e8f9" : "#fbbf24"}
                  opacity={0.16 + localProgress * 0.52}
                  stroke="#0f172a"
                  strokeWidth="0.45"
                  strokeOpacity="0.13"
                />
              );
            })}
            {Array.from({ length: visibleFanCount + 1 }, (_, index) => {
              const x = baseX + index * (baseWidth / visibleFanCount);
              return <line key={index} x1={x} y1={baseY} x2={apex.x} y2={apex.y} stroke="rgba(15,23,42,0.16)" strokeWidth="0.55" opacity={modelOpacity} />;
            })}
            <line x1={baseX} y1={baseY + 20} x2={baseX + baseDrawWidth} y2={baseY + 20} stroke={emphasizeBase ? "#f59e0b" : "#64748b"} strokeWidth={emphasizeBase ? 6 : 3} strokeLinecap="round" />
            <line x1={apex.x} y1={baseY} x2={apex.x} y2={baseY - height * clamp01(compareProgress + 0.35)} stroke={emphasizeHeight ? "#22c55e" : "#64748b"} strokeDasharray="8 7" strokeWidth={emphasizeHeight ? 5 : 3} strokeLinecap="round" />
            <circle cx={apex.x} cy={apex.y} r={6 + formulaProgress * 3} fill="#22c55e" />
            {labelsVisible && (
              <>
                <MathLabel x={baseX + baseWidth / 2} y={baseY + 56} tone="amber">base approx 2πr</MathLabel>
                <MathLabel x={apex.x + 42} y={baseY - height / 2} tone="emerald">height r</MathLabel>
                <MathLabel x={apex.x} y={apex.y - 20} tone="cyan">same area</MathLabel>
              </>
            )}
            {emphasizeFormula && labelsVisible && (
              <text x={baseX + baseWidth / 2} y="430" textAnchor="middle" className="fill-emerald-700 text-[25px] font-black dark:fill-emerald-100" opacity={0.45 + formulaProgress * 0.55}>
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
          <g opacity={0.6 + compareProgress * 0.4}>
            <text x="648" y="136" textAnchor="middle" className="fill-slate-700 text-[15px] font-black dark:fill-slate-200">
              Thinner sectors make the jagged model approach a clean triangle.
            </text>
            <text x="648" y="462" textAnchor="middle" className="fill-slate-600 text-[13px] font-bold dark:fill-slate-300">
              1/2 x base x height = 1/2 x 2πr x r
            </text>
          </g>
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

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
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
