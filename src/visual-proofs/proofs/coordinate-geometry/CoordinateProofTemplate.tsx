import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import {
  circleEquationFromCenterRadius,
  coordinateToSvg,
  distanceBetweenPoints,
  formatCoordinate,
  formatEquation,
  formatNumber,
  midpoint,
  perpendicularSlope,
  reflectPointAcrossOrigin,
  reflectPointAcrossXAxis,
  reflectPointAcrossYAxis,
  rotatePointAboutOrigin,
  scalePointFromOrigin,
  sectionPoint,
  slope,
  translatePoint,
  triangleAreaByCoordinates,
  type CoordinatePoint,
} from "../../utils/coordinateGeometryMath";
import type { CoordinateParameterKey, CoordinateProofConfig } from "./coordinateProofConfigs";

type CoordinateValues = Record<CoordinateParameterKey, number>;

type Props = {
  category: VisualProofCategory;
  proof: VisualProof;
  config: CoordinateProofConfig;
};

const emptyValues: CoordinateValues = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, m: 0, n: 0, c: 0, dx: 0, dy: 0, radius: 0, theta: 0, scale: 0 };
const origin = { x: 330, y: 285 };
const unit = 28;

export default function CoordinateProofTemplate({ category, proof, config }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => Object.fromEntries((config.toggles ?? []).map((toggle) => [toggle, true])));
  const [values, setValues] = useState<CoordinateValues>(() => ({
    ...emptyValues,
    ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
  }));

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => (step >= config.steps.length - 1 ? 0 : step + 1));
    }, 900);
    return () => window.clearInterval(timer);
  }, [config.steps.length, isPlaying]);

  const formulas = useMemo(() => [...config.formulas, ...dynamicFormulaLines(config.kind, values)], [config.formulas, config.kind, values]);

  function reset() {
    setActiveStep(0);
    setIsPlaying(false);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setToggles(Object.fromEntries((config.toggles ?? []).map((toggle) => [toggle, true])));
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
        playLabel={`Play ${proof.title}`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={reset}
        onPrevious={() => { setIsPlaying(false); setActiveStep((step) => Math.max(0, step - 1)); }}
        onNext={() => { setIsPlaying(false); setActiveStep((step) => Math.min(config.steps.length - 1, step + 1)); }}
        onToggleLabels={() => setLabelsVisible((value) => !value)}
        onToggleFormula={() => setFormulaVisible((value) => !value)}
      />
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Coordinate geometry proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Coordinate controls</h2>
        {config.parameters.map((parameter) => (
          <Slider
            key={parameter.key}
            label={parameter.label}
            value={values[parameter.key]}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step ?? 1}
            onChange={(value) => {
              setIsPlaying(false);
              setValues((current) => ({ ...current, [parameter.key]: value }));
            }}
          />
        ))}
        {(config.toggles ?? []).map((toggle) => (
          <label key={toggle} className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
            {toggle}
            <input type="checkbox" checked={toggles[toggle] ?? false} onChange={() => setToggles((current) => ({ ...current, [toggle]: !current[toggle] }))} className="h-5 w-5 accent-cyan-500" />
          </label>
        ))}
      </section>
    </div>
  );

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<CoordinateVisual config={config} values={values} activeStep={activeStep} labelsVisible={labelsVisible} toggles={toggles} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={<FormulaPanel visible={formulaVisible} title="Formula and coordinate substitution" formulas={formulas} />}
      conceptNotes={<p>{config.notes}</p>}
      reflectionQuestions={config.questions}
    />
  );
}

function CoordinateVisual({ config, values, activeStep, labelsVisible, toggles }: { config: CoordinateProofConfig; values: CoordinateValues; activeStep: number; labelsVisible: boolean; toggles: Record<string, boolean> }) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={`${config.kind} coordinate geometry visual proof`} className="h-[540px] w-full max-w-full">
        <rect x="18" y="18" width="864" height="504" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <Title title={titleForKind(config.kind)} subtitle="Browser-only SVG coordinate proof" />
        {(toggles["Show grid"] ?? true) && <Grid />}
        {config.visual === "segment" && <SegmentModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} />}
        {config.visual === "line" && <LineModel config={config} values={values} labels={labelsVisible} toggles={toggles} />}
        {config.visual === "two-lines" && <TwoLinesModel config={config} values={values} labels={labelsVisible} toggles={toggles} />}
        {config.visual === "triangle" && <TriangleModel values={values} labels={labelsVisible} toggles={toggles} />}
        {config.visual === "circle" && <CircleModel values={values} labels={labelsVisible} toggles={toggles} />}
        {config.visual === "transform" && <TransformModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} />}
        {config.visual === "pythagorean" && <CoordinatePythagoreanModel values={values} labels={labelsVisible} toggles={toggles} />}
      </svg>
    </div>
  );
}

function SegmentModel({ config, values, step, labels, toggles }: ModelProps) {
  const a = point(values.x1, values.y1);
  const b = point(values.x2, values.y2);
  const as = coordinateToSvg(a, origin, unit);
  const bs = coordinateToSvg(b, origin, unit);
  const corner = coordinateToSvg({ x: b.x, y: a.y }, origin, unit);
  const mid = midpoint(a, b);
  const section = sectionPoint(a, b, Math.max(1, values.m || 2), Math.max(1, values.n || 3));
  const focus = config.kind === "MidpointFormulaProof" ? mid : config.kind === "SectionFormulaProof" ? section : undefined;
  return (
    <g>
      <line x1={as.x} y1={as.y} x2={bs.x} y2={bs.y} stroke="#0f172a" strokeWidth="5" />
      {(toggles["Show projection triangle"] ?? toggles["Show slope triangle"] ?? true) && (
        <>
          <line x1={as.x} y1={as.y} x2={corner.x} y2={corner.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 6" />
          <line x1={corner.x} y1={corner.y} x2={bs.x} y2={bs.y} stroke="#ef4444" strokeWidth="4" strokeDasharray="7 6" />
        </>
      )}
      <Point p={as} label={`A ${formatCoordinate(a)}`} labels={labels} />
      <Point p={bs} label={`B ${formatCoordinate(b)}`} labels={labels} />
      {focus && <Point p={coordinateToSvg(focus, origin, unit)} label={`${config.kind === "MidpointFormulaProof" ? "M" : "P"} ${formatCoordinate(focus)}`} fill="#a855f7" labels={labels} />}
      <ValueCard lines={[
        `A = ${formatCoordinate(a)}`,
        `B = ${formatCoordinate(b)}`,
        `delta x = ${formatNumber(b.x - a.x)}`,
        `delta y = ${formatNumber(b.y - a.y)}`,
        config.kind === "DistanceFormulaProof" ? `AB = ${formatNumber(distanceBetweenPoints(a, b))}` : config.kind === "SlopeFormulaProof" ? `slope = ${formatNumber(slope(a, b) ?? Number.NaN)}` : focus ? `${config.kind === "MidpointFormulaProof" ? "M" : "P"} = ${formatCoordinate(focus)}` : `step ${step + 1}`,
      ]} />
    </g>
  );
}

function LineModel({ config, values, labels }: Pick<ModelProps, "config" | "values" | "labels" | "toggles">) {
  const m = values.m || 0;
  const anchor = config.kind === "PointSlopeLineEquationProof" ? point(values.x1, values.y1) : point(0, values.c);
  const c = config.kind === "PointSlopeLineEquationProof" ? anchor.y - m * anchor.x : values.c;
  const xA = -9;
  const xB = 9;
  const p1 = coordinateToSvg(point(xA, m * xA + c), origin, unit);
  const p2 = coordinateToSvg(point(xB, m * xB + c), origin, unit);
  const anchorSvg = coordinateToSvg(anchor, origin, unit);
  return (
    <g>
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#0891b2" strokeWidth="5" />
      <Point p={anchorSvg} label={config.kind === "PointSlopeLineEquationProof" ? `P ${formatCoordinate(anchor)}` : `(0,c)`} labels={labels} fill="#ef4444" />
      <SlopeTriangle start={anchor} m={m} />
      <ValueCard lines={[`m = ${formatNumber(m)}`, `c = ${formatNumber(c)}`, formatEquation(m, c), config.kind === "PointSlopeLineEquationProof" ? `y - ${formatNumber(anchor.y)} = ${formatNumber(m)}(x - ${formatNumber(anchor.x)})` : "intercept anchors the line"]} />
    </g>
  );
}

function TwoLinesModel({ config, values }: Pick<ModelProps, "config" | "values" | "labels" | "toggles">) {
  const m1 = values.m || 1;
  const m2 = config.kind === "PerpendicularLinesSlopeProof" ? perpendicularSlope(m1) ?? 999 : values.n || 1;
  const cGap = values.c || 3;
  const line1 = linePoints(m1, -1);
  const line2 = linePoints(m2, cGap);
  return (
    <g>
      <line x1={line1[0].x} y1={line1[0].y} x2={line1[1].x} y2={line1[1].y} stroke="#0891b2" strokeWidth="5" />
      {m2 === 999 ? <line x1={origin.x} y1="90" x2={origin.x} y2="480" stroke="#ef4444" strokeWidth="5" /> : <line x1={line2[0].x} y1={line2[0].y} x2={line2[1].x} y2={line2[1].y} stroke="#ef4444" strokeWidth="5" />}
      <SlopeTriangle start={point(-3, m1 * -3 - 1)} m={m1} />
      {m2 !== 999 && <SlopeTriangle start={point(2, m2 * 2 + cGap)} m={m2} />}
      <ValueCard lines={[`m1 = ${formatNumber(m1)}`, `m2 = ${m2 === 999 ? "undefined" : formatNumber(m2)}`, config.kind === "ParallelLinesSlopeProof" ? `parallel? ${Math.abs(m1 - m2) < 0.001 ? "yes" : "not yet"}` : `m1 x m2 = ${m2 === 999 ? "special case" : formatNumber(m1 * m2)}`, config.kind === "PerpendicularLinesSlopeProof" ? "negative reciprocal gives 90 degrees" : "equal slopes give equal tilt"]} />
    </g>
  );
}

function TriangleModel({ values, labels }: { values: CoordinateValues; labels: boolean; toggles: Record<string, boolean> }) {
  const a = point(values.x1, values.y1);
  const b = point(values.x2, values.y2);
  const c = point(values.x3, values.y3);
  const as = coordinateToSvg(a, origin, unit);
  const bs = coordinateToSvg(b, origin, unit);
  const cs = coordinateToSvg(c, origin, unit);
  return (
    <g>
      <polygon points={`${as.x},${as.y} ${bs.x},${bs.y} ${cs.x},${cs.y}`} fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      <Point p={as} label={`A ${formatCoordinate(a)}`} labels={labels} />
      <Point p={bs} label={`B ${formatCoordinate(b)}`} labels={labels} />
      <Point p={cs} label={`C ${formatCoordinate(c)}`} labels={labels} />
      <ValueCard lines={[`A = ${formatCoordinate(a)}`, `B = ${formatCoordinate(b)}`, `C = ${formatCoordinate(c)}`, `area = ${formatNumber(triangleAreaByCoordinates(a, b, c))}`, "shoelace/determinant area"]} />
    </g>
  );
}

function CircleModel({ values, labels }: { values: CoordinateValues; labels: boolean; toggles: Record<string, boolean> }) {
  const center = point(values.x1, values.y1);
  const r = values.radius || 4;
  const theta = ((values.theta || 0) * Math.PI) / 180;
  const p = point(center.x + r * Math.cos(theta), center.y + r * Math.sin(theta));
  const cs = coordinateToSvg(center, origin, unit);
  const ps = coordinateToSvg(p, origin, unit);
  return (
    <g>
      <circle cx={cs.x} cy={cs.y} r={r * unit} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <line x1={cs.x} y1={cs.y} x2={ps.x} y2={ps.y} stroke="#ef4444" strokeWidth="5" />
      <line x1={ps.x} y1={ps.y} x2={ps.x} y2={cs.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 6" />
      <line x1={cs.x} y1={cs.y} x2={ps.x} y2={cs.y} stroke="#22c55e" strokeWidth="4" strokeDasharray="7 6" />
      <Point p={cs} label={`C ${formatCoordinate(center)}`} labels={labels} fill="#a855f7" />
      <Point p={ps} label={`P ${formatCoordinate(p)}`} labels={labels} />
      <ValueCard lines={[`center = ${formatCoordinate(center)}`, `r = ${formatNumber(r)}`, circleEquationFromCenterRadius(center, r), `P = ${formatCoordinate(p)}`]} />
    </g>
  );
}

function TransformModel({ config, values, labels }: ModelProps) {
  const p = point(values.x1, values.y1);
  let p2 = translatePoint(p, values.dx, values.dy);
  if (config.kind === "ReflectionAcrossAxesProof") p2 = values.n === 2 ? reflectPointAcrossYAxis(p) : values.n === 3 ? reflectPointAcrossOrigin(p) : reflectPointAcrossXAxis(p);
  if (config.kind === "RotationAboutOriginProof") p2 = rotatePointAboutOrigin(p, values.theta || 90);
  if (config.kind === "ScalingDilationOriginProof") p2 = scalePointFromOrigin(p, values.scale || 1);
  const ps = coordinateToSvg(p, origin, unit);
  const qs = coordinateToSvg(p2, origin, unit);
  return (
    <g>
      <line x1={origin.x} y1={origin.y} x2={ps.x} y2={ps.y} stroke="#94a3b8" strokeWidth="3" strokeDasharray="7 6" />
      <line x1={origin.x} y1={origin.y} x2={qs.x} y2={qs.y} stroke="#a855f7" strokeWidth="3" strokeDasharray="7 6" />
      <line x1={ps.x} y1={ps.y} x2={qs.x} y2={qs.y} stroke="#f59e0b" strokeWidth="5" markerEnd="url(#arrow)" />
      <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /></marker></defs>
      <Point p={ps} label={`P ${formatCoordinate(p)}`} labels={labels} />
      <Point p={qs} label={`P' ${formatCoordinate(p2)}`} labels={labels} fill="#ef4444" />
      <ValueCard lines={[`P = ${formatCoordinate(p)}`, `P' = ${formatCoordinate(p2)}`, ruleForTransform(config.kind, values), "distance/shape rule shown on grid"]} />
    </g>
  );
}

function CoordinatePythagoreanModel({ values, labels }: { values: CoordinateValues; labels: boolean; toggles: Record<string, boolean> }) {
  const aLen = values.x2 || 5;
  const bLen = values.y3 || 4;
  const a = point(0, 0);
  const b = point(aLen, 0);
  const c = point(0, bLen);
  const as = coordinateToSvg(a, origin, unit);
  const bs = coordinateToSvg(b, origin, unit);
  const cs = coordinateToSvg(c, origin, unit);
  return (
    <g>
      <polygon points={`${as.x},${as.y} ${bs.x},${bs.y} ${cs.x},${cs.y}`} fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      <line x1={bs.x} y1={bs.y} x2={cs.x} y2={cs.y} stroke="#ef4444" strokeWidth="6" />
      <Point p={as} label="A (0,0)" labels={labels} />
      <Point p={bs} label={`B (${formatNumber(aLen)},0)`} labels={labels} />
      <Point p={cs} label={`C (0,${formatNumber(bLen)})`} labels={labels} />
      <ValueCard lines={[`a = ${formatNumber(aLen)}`, `b = ${formatNumber(bLen)}`, `c = ${formatNumber(Math.hypot(aLen, bLen))}`, `c^2 = ${formatNumber(aLen * aLen)} + ${formatNumber(bLen * bLen)}`]} />
    </g>
  );
}

type ModelProps = { config: CoordinateProofConfig; values: CoordinateValues; step: number; labels: boolean; toggles: Record<string, boolean> };

function Grid() {
  const lines = [];
  for (let i = -10; i <= 10; i += 1) {
    lines.push(<line key={`v${i}`} x1={origin.x + i * unit} y1="90" x2={origin.x + i * unit} y2="480" stroke={i === 0 ? "#0f172a" : "#cbd5e1"} strokeWidth={i === 0 ? 3 : 1} />);
    lines.push(<line key={`h${i}`} x1="60" y1={origin.y - i * unit} x2="600" y2={origin.y - i * unit} stroke={i === 0 ? "#0f172a" : "#cbd5e1"} strokeWidth={i === 0 ? 3 : 1} />);
  }
  return <g>{lines}</g>;
}

function Point({ p, label, labels, fill = "#ef4444" }: { p: CoordinatePoint; label: string; labels: boolean; fill?: string }) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r="8" fill={fill} stroke="#fff" strokeWidth="2" />
      {labels && <Text x={p.x + 50} y={p.y - 12}>{label}</Text>}
    </g>
  );
}

function SlopeTriangle({ start, m }: { start: CoordinatePoint; m: number }) {
  const run = 2;
  const a = coordinateToSvg(start, origin, unit);
  const b = coordinateToSvg(point(start.x + run, start.y), origin, unit);
  const c = coordinateToSvg(point(start.x + run, start.y + m * run), origin, unit);
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#f59e0b" strokeWidth="4" />
      <line x1={b.x} y1={b.y} x2={c.x} y2={c.y} stroke="#ef4444" strokeWidth="4" />
    </g>
  );
}

function ValueCard({ lines }: { lines: string[] }) {
  return (
    <g>
      <rect x="630" y="125" width="230" height={Math.max(130, lines.length * 25 + 28)} rx="14" className="fill-white stroke-slate-200 dark:fill-slate-950 dark:stroke-white/10" />
      {lines.map((line, index) => <text key={line} x="648" y={160 + index * 25} className="fill-slate-800 text-[14px] font-black dark:fill-slate-100">{line}</text>)}
    </g>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        <span className="mini-chip">{formatNumber(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--slider-progress": `${((value - min) / (max - min)) * 100}%` } as CSSProperties} className="mt-3 w-full accent-cyan-500" aria-label={label} />
    </label>
  );
}

function linePoints(m: number, c: number) {
  return [coordinateToSvg(point(-9, m * -9 + c), origin, unit), coordinateToSvg(point(9, m * 9 + c), origin, unit)];
}

function point(x: number, y: number): CoordinatePoint {
  return { x, y };
}

function ruleForTransform(kind: string, values: CoordinateValues) {
  if (kind === "TranslationOfPointsProof") return `add (${formatNumber(values.dx)}, ${formatNumber(values.dy)})`;
  if (kind === "ReflectionAcrossAxesProof") return values.n === 2 ? "(x,y) -> (-x,y)" : values.n === 3 ? "(x,y) -> (-x,-y)" : "(x,y) -> (x,-y)";
  if (kind === "RotationAboutOriginProof") return `rotate ${formatNumber(values.theta)} deg`;
  return `multiply by k = ${formatNumber(values.scale)}`;
}

function dynamicFormulaLines(kind: string, values: CoordinateValues) {
  const a = point(values.x1, values.y1);
  const b = point(values.x2, values.y2);
  if (kind === "DistanceFormulaProof") return [`Current: AB = ${formatNumber(distanceBetweenPoints(a, b))}`];
  if (kind === "MidpointFormulaProof") return [`Current: M = ${formatCoordinate(midpoint(a, b))}`];
  if (kind === "SlopeFormulaProof") return [`Current: slope = ${formatNumber(slope(a, b) ?? Number.NaN)}`];
  if (kind === "TriangleAreaCoordinatesProof") return [`Current area = ${formatNumber(triangleAreaByCoordinates(a, b, point(values.x3, values.y3)))}`];
  return [];
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
  return <text x={x} y={y} textAnchor="middle" className="fill-slate-800 text-[12px] font-black dark:fill-slate-100">{children}</text>;
}

function titleForKind(kind: string) {
  return kind.replace(/Proof$/, "").replace(/([A-Z])/g, " $1").trim();
}
