import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { degToRad, formatNumber, polygonPoints, regularPolygonPoints } from "../../utils/geometryMath";
import type { GeometryParameterKey, GeometryProofConfig } from "./geometryProofConfigs";

type GeometryProofTemplateProps = {
  category: VisualProofCategory;
  proof: VisualProof;
  config: GeometryProofConfig;
};

type GeometryValues = Record<GeometryParameterKey, number>;

const emptyValues: GeometryValues = {
  a: 0,
  b: 0,
  base: 0,
  height: 0,
  offset: 0,
  scale: 0,
  radius: 0,
  angle: 0,
  sides: 0,
};

export default function GeometryProofTemplate({ category, proof, config }: GeometryProofTemplateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [values, setValues] = useState<GeometryValues>(() => ({
    ...emptyValues,
    ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
  }));

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= config.steps.length - 1) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 1100);
    return () => window.clearInterval(timer);
  }, [config.steps.length, isPlaying]);

  const formulas = useMemo(() => dynamicFormulas(config.formulas, config.kind, values), [config.formulas, config.kind, values]);

  function reset() {
    setIsPlaying(false);
    setActiveStep(0);
    setSecondaryVisible(false);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setValues({
      ...emptyValues,
      ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
    });
  }

  const controls = (
    <div className="space-y-4">
      <ProofControls
        activeStep={activeStep}
        totalSteps={config.steps.length}
        isPlaying={isPlaying}
        labelsVisible={labelsVisible}
        formulaVisible={formulaVisible}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={reset}
        onPrevious={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.max(0, step - 1));
        }}
        onNext={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.min(config.steps.length - 1, step + 1));
        }}
        onToggleLabels={() => setLabelsVisible((value) => !value)}
        onToggleFormula={() => setFormulaVisible((value) => !value)}
      />
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Geometry proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Parameters</h2>
        {config.parameters.map((parameter) => (
          <Slider
            key={parameter.key}
            label={parameter.label}
            value={values[parameter.key]}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step ?? 1}
            unit={parameter.unit}
            onChange={(value) => setValues((current) => ({ ...current, [parameter.key]: value }))}
          />
        ))}
        {config.toggles.secondary && (
          <button type="button" className="action-secondary mt-4 w-full rounded-xl" onClick={() => setSecondaryVisible((value) => !value)}>
            {config.toggles.secondary}
          </button>
        )}
      </section>
    </div>
  );

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<GeometryVisual kind={config.kind} values={values} activeStep={activeStep} labelsVisible={labelsVisible} secondaryVisible={secondaryVisible} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={<FormulaPanel visible={formulaVisible} formulas={formulas} />}
      conceptNotes={<p>{config.notes}</p>}
      reflectionQuestions={config.questions}
    />
  );
}

function GeometryVisual({
  kind,
  values,
  activeStep,
  labelsVisible,
  secondaryVisible,
}: {
  kind: GeometryProofConfig["kind"];
  values: GeometryValues;
  activeStep: number;
  labelsVisible: boolean;
  secondaryVisible: boolean;
}) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 520" role="img" aria-label="Interactive geometry visual proof diagram" className="h-[520px] w-full max-w-full">
        <defs>
          <pattern id="vp-hatch" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0" stroke="#0f766e" strokeWidth="1" opacity="0.35" />
          </pattern>
          <marker id="vp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0891b2" />
          </marker>
        </defs>
        <rect x="18" y="18" width="864" height="484" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        {renderGeometry(kind, values, activeStep, labelsVisible, secondaryVisible)}
      </svg>
    </div>
  );
}

function renderGeometry(kind: GeometryProofConfig["kind"], values: GeometryValues, step: number, labels: boolean, secondary: boolean) {
  switch (kind) {
    case "PythagoreanAreaRearrangementProof":
      return <PythagoreanSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "TriangleAreaHalfRectangleProof":
      return <TriangleAreaSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "TriangleAngleSumProof":
      return <TriangleAngleSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "ExteriorAngleTheoremProof":
      return <ExteriorAngleSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "SimilarTrianglesProof":
      return <SimilarTrianglesSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "CircleCircumferenceUnwrappingProof":
      return <CircumferenceSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "SectorAreaFormulaProof":
      return <SectorSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "ParallelogramAreaShearingProof":
      return <ParallelogramSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "TrapezoidAreaDuplicationProof":
      return <TrapezoidSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "PolygonInteriorAngleSumProof":
      return <PolygonSvg values={values} step={step} labels={labels} secondary={secondary} />;
  }
}

function PythagoreanSvg({ values, step, labels, secondary }: SvgProps) {
  const a = values.a || 3;
  const b = values.b || 4;
  const c = Math.sqrt(a * a + b * b);
  const useSplit = secondary || step >= 3;
  return (
    <g>
      <Title title="Pythagorean area rearrangement" subtitle={`a = ${a}, b = ${b}, c = ${formatNumber(c)}`} />
      <rect x="110" y="140" width="250" height="250" fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {useSplit ? (
        <>
          <rect x="150" y="180" width="80" height="80" fill="#bae6fd" stroke="#0369a1" strokeWidth="3" />
          <rect x="235" y="180" width="110" height="110" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3" />
          {labels && <Text x={190} y={225}>a^2</Text>}
          {labels && <Text x={290} y={240}>b^2</Text>}
        </>
      ) : (
        <>
          <polygon points="235,145 355,265 235,385 115,265" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          {labels && <Text x={235} y={270}>c^2</Text>}
        </>
      )}
      <TriangleGroup opacity={step >= 1 ? 0.82 : 0.25} />
      <path d="M 470 170 L 720 170 L 720 390 L 470 390 Z" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="9 8" />
      <Text x={595} y={150}>same outer square and four triangles</Text>
      <Text x={595} y={425}>{useSplit ? "leftover = a^2 + b^2" : "leftover = c^2"}</Text>
      <Text x={595} y={465}>{`Dynamic: ${a}^2 + ${b}^2 = ${formatNumber(c)}^2`}</Text>
    </g>
  );
}

function TriangleGroup({ opacity }: { opacity: number }) {
  const triangles = [
    "110,140 235,140 110,265",
    "360,140 360,265 235,140",
    "360,390 235,390 360,265",
    "110,390 110,265 235,390",
  ];
  return (
    <g opacity={opacity}>
      {triangles.map((points, index) => (
        <polygon key={points} points={points} fill={index % 2 ? "#67e8f9" : "#c4b5fd"} stroke="#0f172a" strokeWidth="1.5" />
      ))}
    </g>
  );
}

function TriangleAreaSvg({ values, step, labels, secondary }: SvgProps) {
  const base = values.base || 210;
  const height = values.height || 150;
  const offset = values.offset || 160;
  const x = 115;
  const y = 360;
  const top = { x: x + offset, y: y - height };
  return (
    <g>
      <Title title="Triangle area is half a rectangle" subtitle="Works for oblique triangles too" />
      {(step >= 1 || secondary) && <rect x={x} y={y - height} width={base} height={height} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" strokeDasharray="8 7" />}
      <polygon points={`${x},${y} ${x + base},${y} ${top.x},${top.y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      {(step >= 2 || secondary) && <polygon points={`${x},${y - height} ${x + base},${y - height} ${top.x},${top.y}`} fill="#bae6fd" stroke="#0369a1" strokeWidth="3" opacity="0.78" />}
      {labels && (
        <>
          <line x1={top.x} y1={top.y} x2={top.x} y2={y} stroke="#22c55e" strokeWidth="3" strokeDasharray="7 6" />
          <Text x={x + base / 2} y={y + 34}>base b</Text>
          <Text x={top.x + 35} y={y - height / 2}>height h</Text>
          <Text x={560} y={240}>Two equal triangles fill b x h</Text>
          <Text x={560} y={285}>One triangle = 1/2 bh</Text>
        </>
      )}
    </g>
  );
}

function TriangleAngleSvg({ values, step, labels, secondary }: SvgProps) {
  const left = { x: values.a || 110, y: 360 };
  const top = { x: values.b || 260, y: 360 - (values.height || 150) };
  const right = { x: 390, y: 360 };
  return (
    <g>
      <Title title="Triangle angle sum" subtitle="Copy all three angles onto a straight line" />
      <polygon points={polygonPoints([left, top, right])} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      <AngleArc cx={left.x} cy={left.y} start={-35} end={0} color="#f59e0b" show={step >= 1} />
      <AngleArc cx={top.x} cy={top.y} start={115} end={245} color="#22c55e" show={step >= 2} />
      <AngleArc cx={right.x} cy={right.y} start={180} end={220} color="#a855f7" show={step >= 3} />
      {secondary && <line x1="80" y1={top.y} x2="440" y2={top.y} stroke="#64748b" strokeWidth="2" strokeDasharray="9 8" />}
      {step >= 4 && (
        <>
          <line x1="500" y1="320" x2="800" y2="320" stroke="#0f172a" strokeWidth="4" className="dark:stroke-white" />
          <path d="M 520 320 A 45 45 0 0 1 610 320" fill="none" stroke="#f59e0b" strokeWidth="8" />
          <path d="M 610 320 A 55 55 0 0 1 720 320" fill="none" stroke="#22c55e" strokeWidth="8" />
          <path d="M 720 320 A 40 40 0 0 1 800 320" fill="none" stroke="#a855f7" strokeWidth="8" />
        </>
      )}
      {labels && <Text x={650} y={385}>A + B + C = 180 degrees</Text>}
    </g>
  );
}

function ExteriorAngleSvg({ values, step, labels }: SvgProps) {
  const left = { x: values.a || 120, y: 360 };
  const top = { x: values.b || 260, y: 360 - (values.height || 150) };
  const right = { x: 390, y: 360 };
  return (
    <g>
      <Title title="Exterior angle theorem" subtitle="Remote interior angles fill the exterior angle" />
      <polygon points={polygonPoints([left, top, right])} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 1 && <line x1={right.x} y1={right.y} x2="560" y2={right.y} stroke="#0f172a" strokeWidth="3" className="dark:stroke-white" />}
      <AngleArc cx={right.x} cy={right.y} start={0} end={145} color="#ef4444" show={step >= 2} />
      <AngleArc cx={left.x} cy={left.y} start={-35} end={0} color="#f59e0b" show={step >= 3} />
      <AngleArc cx={top.x} cy={top.y} start={110} end={240} color="#22c55e" show={step >= 3} />
      {step >= 4 && (
        <>
          <path d="M 585 310 A 60 60 0 0 1 705 310" fill="none" stroke="#f59e0b" strokeWidth="9" />
          <path d="M 705 310 A 70 70 0 0 1 835 310" fill="none" stroke="#22c55e" strokeWidth="9" />
        </>
      )}
      {labels && <Text x={690} y={380}>Exterior angle = A + B</Text>}
    </g>
  );
}

function SimilarTrianglesSvg({ values, step, labels, secondary }: SvgProps) {
  const k = values.scale || 1.7;
  const sep = secondary ? 20 : values.offset || 200;
  const base = [{ x: 110, y: 350 }, { x: 240, y: 350 }, { x: 165, y: 235 }];
  const large = base.map((point) => ({ x: 360 + sep + (point.x - 110) * k, y: 350 + (point.y - 350) * k }));
  return (
    <g>
      <Title title="Similar triangles" subtitle={`Scale factor k = ${formatNumber(k, 1)}`} />
      <polygon points={polygonPoints(base)} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 1 && <polygon points={polygonPoints(large)} fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.86" />}
      {step >= 2 && labels && (
        <>
          <Text x="175" y="220">A, B, C</Text>
          <Text x={large[2].x + 35} y={large[2].y - 15}>A', B', C'</Text>
          <Text x="610" y="420">Corresponding ratios = k</Text>
        </>
      )}
      {step >= 3 && <line x1="175" y1="350" x2={large[1].x - 20} y2="350" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 8" />}
    </g>
  );
}

function CircumferenceSvg({ values, step, labels, secondary }: SvgProps) {
  const r = values.radius || 75;
  const travel = 2 * Math.PI * r;
  const cx = 150 + Math.min(travel, 450) * Math.min(1, step / 5);
  const cy = 330 - r;
  const markerAngle = -90 + 360 * Math.min(1, step / 5);
  const marker = { x: cx + r * Math.cos(degToRad(markerAngle)), y: cy + r * Math.sin(degToRad(markerAngle)) };
  return (
    <g>
      <Title title="Circle circumference by rolling" subtitle="One full turn travels one circumference" />
      <line x1="80" y1="330" x2="810" y2="330" stroke="#64748b" strokeWidth="3" />
      {step >= 2 && <line x1="150" y1="345" x2={cx} y2="345" stroke="#f59e0b" strokeWidth="6" />}
      <circle cx={cx} cy={cy} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={marker.x} y2={marker.y} stroke="#ef4444" strokeWidth="3" />
      <circle cx={marker.x} cy={marker.y} r="7" fill="#ef4444" />
      {(step >= 4 || secondary) && <line x1="500" y1="180" x2="780" y2="180" stroke="#22c55e" strokeWidth="7" />}
      {labels && (
        <>
          <Text x={cx + r / 2} y={cy - 10}>r</Text>
          <Text x="640" y="215">unwrapped boundary = 2 pi r</Text>
        </>
      )}
    </g>
  );
}

function SectorSvg({ values, step, labels, secondary }: SvgProps) {
  const r = values.radius || 90;
  const angle = values.angle || 120;
  const cx = 260;
  const cy = 280;
  const end = { x: cx + r * Math.cos(degToRad(angle - 90)), y: cy + r * Math.sin(degToRad(angle - 90)) };
  const start = { x: cx, y: cy - r };
  const large = angle > 180 ? 1 : 0;
  return (
    <g>
      <Title title="Sector area formula" subtitle={`theta = ${formatNumber(angle)} degrees`} />
      <circle cx={cx} cy={cy} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 1 && <path d={`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`} fill="#fef3c7" stroke="#d97706" strokeWidth="4" />}
      {secondary && <Text x="650" y="205">Radians: 1/2 r^2 theta</Text>}
      {labels && (
        <>
          <Text x="620" y="260">sector fraction = theta / 360</Text>
          <Text x="620" y="305">area = theta / 360 x pi r^2</Text>
        </>
      )}
    </g>
  );
}

function ParallelogramSvg({ values, step, labels, secondary }: SvgProps) {
  const base = values.base || 220;
  const height = values.height || 140;
  const offset = values.offset || 70;
  const x = 130;
  const y = 365;
  const points = `${x},${y} ${x + base},${y} ${x + base + offset},${y - height} ${x + offset},${y - height}`;
  return (
    <g>
      <Title title="Parallelogram area by shearing" subtitle="Cut and move the side triangle" />
      <polygon points={points} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 3 && <polygon points={`${x},${y} ${x + offset},${y - height} ${x + offset},${y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" />}
      {(step >= 4 || secondary) && <polygon points={`${x + base},${y} ${x + base + offset},${y - height} ${x + base + offset},${y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.82" />}
      {(step >= 5 || secondary) && <rect x="510" y={y - height} width={base} height={height} fill="url(#vp-hatch)" stroke="#22c55e" strokeWidth="3" />}
      {labels && (
        <>
          <line x1={x + offset} y1={y - height} x2={x + offset} y2={y} stroke="#22c55e" strokeWidth="3" strokeDasharray="7 6" />
          <Text x={x + base / 2} y={y + 35}>base b</Text>
          <Text x={x + offset + 35} y={y - height / 2}>height h</Text>
          <Text x="620" y="430">Area = b x h</Text>
        </>
      )}
    </g>
  );
}

function TrapezoidSvg({ values, step, labels, secondary }: SvgProps) {
  const top = values.a || 120;
  const bottom = values.b || 230;
  const height = values.height || 130;
  const offset = values.offset || 50;
  const x = 120;
  const y = 365;
  const trap = `${x},${y} ${x + bottom},${y} ${x + offset + top},${y - height} ${x + offset},${y - height}`;
  return (
    <g>
      <Title title="Trapezoid / trapezium duplication" subtitle="Two copies form a parallelogram" />
      <polygon points={trap} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {(step >= 2 || secondary) && <polygon points={`${x + bottom + 35},${y - height} ${x + bottom + 35 + bottom},${y - height} ${x + bottom + 35 + bottom - offset},${y} ${x + bottom + 35 + bottom - offset - top},${y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.8" />}
      {step >= 4 && <path d="M 505 220 L 790 220 L 720 365 L 435 365 Z" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="9 8" />}
      {labels && (
        <>
          <Text x={x + offset + top / 2} y={y - height - 18}>a</Text>
          <Text x={x + bottom / 2} y={y + 34}>b</Text>
          <Text x="610" y="430">Area = 1/2(a + b)h</Text>
        </>
      )}
    </g>
  );
}

function PolygonSvg({ values, step, labels, secondary }: SvgProps) {
  const sides = Math.round(values.sides || 5);
  const points = regularPolygonPoints(sides, 270, 280, 125, secondary ? -75 : -90);
  const sum = (sides - 2) * 180;
  return (
    <g>
      <Title title="Polygon interior angle sum" subtitle={`${sides} sides split into ${sides - 2} triangles`} />
      <polygon points={polygonPoints(points)} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 2 && points.slice(2, -1).map((point) => <line key={`${point.x}-${point.y}`} x1={points[0].x} y1={points[0].y} x2={point.x} y2={point.y} stroke="#d97706" strokeWidth="3" />)}
      {labels && (
        <>
          <circle cx={points[0].x} cy={points[0].y} r="7" fill="#ef4444" />
          <Text x="640" y="235">triangles = n - 2 = {sides - 2}</Text>
          <Text x="640" y="280">sum = ({sides} - 2) x 180</Text>
          <Text x="640" y="325">{sum} degrees</Text>
        </>
      )}
    </g>
  );
}

type SvgProps = {
  values: GeometryValues;
  step: number;
  labels: boolean;
  secondary: boolean;
};

function AngleArc({ cx, cy, start, end, color, show }: { cx: number; cy: number; start: number; end: number; color: string; show: boolean }) {
  if (!show) return null;
  const r = 42;
  const startPoint = { x: cx + r * Math.cos(degToRad(start)), y: cy + r * Math.sin(degToRad(start)) };
  const endPoint = { x: cx + r * Math.cos(degToRad(end)), y: cy + r * Math.sin(degToRad(end)) };
  return <path d={`M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 0 1 ${endPoint.x} ${endPoint.y}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />;
}

function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <text x="54" y="58" className="fill-slate-900 text-[22px] font-black dark:fill-white">{title}</text>
      <text x="54" y="84" className="fill-slate-500 text-[13px] font-bold dark:fill-slate-300">{subtitle}</text>
    </>
  );
}

function Text({ x, y, children }: { x: number | string; y: number | string; children: ReactNode }) {
  return <text x={x} y={y} textAnchor="middle" className="fill-slate-800 text-[16px] font-black dark:fill-slate-100">{children}</text>;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const progress = `${((value - min) / (max - min)) * 100}%`;
  return (
    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        <span className="mini-chip">{formatNumber(value, 1)}{unit ? ` ${unit}` : ""}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--slider-progress": progress } as CSSProperties}
        className="mt-3 w-full accent-cyan-500"
        aria-label={label}
      />
    </label>
  );
}

function dynamicFormulas(formulas: string[], kind: GeometryProofConfig["kind"], values: GeometryValues) {
  if (kind === "PythagoreanAreaRearrangementProof") {
    const a = values.a || 3;
    const b = values.b || 4;
    const c = Math.sqrt(a * a + b * b);
    return [...formulas, `Example: ${a}^2 + ${b}^2 = ${formatNumber(c)}^2`, `${a * a} + ${b * b} = ${formatNumber(c * c)}`];
  }
  if (kind === "PolygonInteriorAngleSumProof") {
    const sides = Math.round(values.sides || 5);
    return [...formulas, `For n = ${sides}: (${sides} - 2) x 180 = ${(sides - 2) * 180} degrees`];
  }
  if (kind === "SectorAreaFormulaProof") {
    const angle = values.angle || 120;
    return [...formulas, `For theta = ${formatNumber(angle)} degrees: fraction = ${formatNumber(angle / 360, 3)}`];
  }
  return formulas;
}
