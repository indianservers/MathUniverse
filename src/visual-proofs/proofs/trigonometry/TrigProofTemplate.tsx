import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import {
  arcLength,
  chordLength,
  cosDeg,
  degToRad,
  formatAngle,
  formatTrigValue,
  generateCosinePoints,
  generateSinePoints,
  quadrantForAngle,
  sinDeg,
  tanDeg,
  triangleAreaUsingSine,
  triangleSideFromLawOfCosines,
  unitCirclePoint,
  type AngleMode,
} from "../../utils/trigMath";
import type { TrigParameterKey, TrigProofConfig } from "./trigProofConfigs";

type TrigValues = Record<TrigParameterKey, number>;

type Props = {
  category: VisualProofCategory;
  proof: VisualProof;
  config: TrigProofConfig;
};

const emptyValues: TrigValues = { theta: 0, alpha: 0, beta: 0, radius: 0, scale: 0, a: 0, b: 0, c: 0 };

export default function TrigProofTemplate({ category, proof, config }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [angleMode, setAngleMode] = useState<AngleMode>("degrees");
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => Object.fromEntries((config.toggles ?? []).map((toggle) => [toggle, true])));
  const [values, setValues] = useState<TrigValues>(() => ({
    ...emptyValues,
    ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
  }));

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => (step >= config.steps.length - 1 ? 0 : step + 1));
      const thetaParam = config.parameters.find((parameter) => parameter.key === "theta");
      if (thetaParam) {
        setValues((current) => ({
          ...current,
          theta: current.theta >= thetaParam.max ? thetaParam.min : Math.min(thetaParam.max, current.theta + (thetaParam.step ?? 1) * 4),
        }));
      }
    }, 900);
    return () => window.clearInterval(timer);
  }, [config.parameters, config.steps.length, isPlaying]);

  const formulas = useMemo(() => [...config.formulas, ...dynamicFormulaLines(config.kind, values)], [config.formulas, config.kind, values]);

  function reset() {
    setActiveStep(0);
    setIsPlaying(false);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setAngleMode("degrees");
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
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Trigonometry proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Trigonometry controls</h2>
        {config.degreeRadianToggle && (
          <div className="mt-3 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-black dark:bg-slate-950/60" role="group" aria-label="Angle display mode">
            {(["degrees", "radians"] as const).map((mode) => (
              <button key={mode} type="button" className={`rounded-lg px-3 py-2 ${angleMode === mode ? "bg-white text-cyan-700 shadow-sm dark:bg-slate-800 dark:text-cyan-200" : "text-slate-600 dark:text-slate-300"}`} onClick={() => setAngleMode(mode)}>
                {mode === "degrees" ? "Degrees" : "Radians"}
              </button>
            ))}
          </div>
        )}
        {config.parameters.map((parameter) => (
          <Slider
            key={parameter.key}
            label={parameter.label}
            value={values[parameter.key]}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step ?? 1}
            display={parameter.key === "theta" || parameter.key === "alpha" || parameter.key === "beta" ? formatAngle(values[parameter.key], angleMode) : values[parameter.key].toFixed(1)}
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
      visual={<TrigVisual config={config} values={values} activeStep={activeStep} labelsVisible={labelsVisible} angleMode={angleMode} toggles={toggles} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={<FormulaPanel visible={formulaVisible} title="Formula and visual derivation" formulas={formulas} />}
      conceptNotes={<p>{config.notes}</p>}
      reflectionQuestions={config.questions}
    />
  );
}

function TrigVisual({ config, values, activeStep, labelsVisible, angleMode, toggles }: { config: TrigProofConfig; values: TrigValues; activeStep: number; labelsVisible: boolean; angleMode: AngleMode; toggles: Record<string, boolean> }) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={`${config.kind} trigonometry visual proof`} className="h-[540px] w-full max-w-full">
        <rect x="18" y="18" width="864" height="504" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <Title title={titleForKind(config.kind)} subtitle={subtitleForKind(config.kind, values, angleMode)} />
        {config.visual === "right-triangle" && <RightTriangleModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
        {config.visual === "unit-circle" && <UnitCircleModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
        {config.visual === "arc" && <ArcModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
        {config.visual === "graphs" && <GraphsModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
        {config.visual === "rotation" && <RotationModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
        {config.visual === "triangle-law" && <TriangleLawModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
        {config.visual === "small-angle" && <SmallAngleModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} angleMode={angleMode} />}
      </svg>
    </div>
  );
}

function RightTriangleModel({ config, values, step, labels, toggles }: ModelProps) {
  const theta = values.theta || 35;
  const scale = (values.scale || 4) * 42;
  const base = scale;
  const height = Math.tan(degToRad(theta)) * base;
  const x = 125;
  const y = 405;
  const p2 = { x: x + base, y };
  const p3 = { x: x + base, y: y - height };
  const hyp = Math.hypot(base, height);
  const complementary = config.kind === "ComplementaryAngleIdentitiesProof";
  return (
    <g>
      <polygon points={`${x},${y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      {toggles["Show similar triangle overlay"] && <polygon points={`${x},${y} ${x + base * 0.72},${y} ${x + base * 0.72},${y - height * 0.72}`} fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray="7 6" />}
      <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke={step >= 2 ? "#ef4444" : "#0f172a"} strokeWidth="6" />
      <line x1={x} y1={y} x2={p2.x} y2={p2.y} stroke={step >= 3 ? "#f59e0b" : "#0f172a"} strokeWidth="6" />
      <line x1={x} y1={y} x2={p3.x} y2={p3.y} stroke={step >= 4 ? "#22c55e" : "#0f172a"} strokeWidth="6" />
      <path d={`M ${x + 45} ${y} A 45 45 0 0 0 ${x + 45 * Math.cos(degToRad(theta))} ${y - 45 * Math.sin(degToRad(theta))}`} fill="none" stroke="#7c3aed" strokeWidth="5" />
      {labels && (
        <>
          <Text x={x + base + 36} y={y - height / 2}>{complementary ? "opposite theta / adjacent complement" : "opposite"}</Text>
          <Text x={x + base / 2} y={y + 34}>adjacent</Text>
          <Text x={x + base / 2 - 15} y={y - height / 2 - 22}>hypotenuse</Text>
          <Text x={x + 62} y={y - 18}>theta</Text>
          {complementary && <Text x={p3.x - 48} y={p3.y + 36}>90 deg - theta</Text>}
        </>
      )}
      <ValueCard x={610} y={160} lines={[
        `theta = ${theta.toFixed(1)} deg`,
        `opposite = ${height.toFixed(2)}`,
        `adjacent = ${base.toFixed(2)}`,
        `hypotenuse = ${hyp.toFixed(2)}`,
        `sin = ${formatTrigValue(height / hyp)}`,
        `cos = ${formatTrigValue(base / hyp)}`,
        `tan = ${formatTrigValue(height / base)}`,
      ]} />
    </g>
  );
}

function UnitCircleModel({ config, values, step, labels, toggles, angleMode }: ModelProps) {
  const theta = values.theta || 0;
  const center = { x: 270, y: 290 };
  const radius = 150;
  const point = unitCirclePoint(degToRad(theta), radius);
  const px = center.x + point.x;
  const py = center.y - point.y;
  const cos = cosDeg(theta);
  const sin = sinDeg(theta);
  const tan = Math.abs(cos) < 0.015 ? Number.POSITIVE_INFINITY : tanDeg(theta);
  return (
    <g>
      <Axes cx={center.x} cy={center.y} r={radius + 34} />
      <circle cx={center.x} cy={center.y} r={radius} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <path d={arcPath(center.x, center.y, 52, 0, theta)} fill="none" stroke="#7c3aed" strokeWidth="5" />
      <line x1={center.x} y1={center.y} x2={px} y2={py} stroke="#0f172a" strokeWidth="5" />
      {(toggles["Show projections"] ?? true) && (
        <>
          <line x1={px} y1={py} x2={px} y2={center.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 6" />
          <line x1={center.x} y1={center.y} x2={px} y2={center.y} stroke="#22c55e" strokeWidth="5" />
          <line x1={px} y1={center.y} x2={px} y2={py} stroke="#ef4444" strokeWidth="5" />
        </>
      )}
      {config.kind === "TangentRatioIdentityProof" && (toggles["Show tangent line"] ?? true) && (
        <>
          <line x1={center.x + radius} y1={center.y - 160} x2={center.x + radius} y2={center.y + 160} stroke="#a855f7" strokeWidth="4" />
          {Number.isFinite(tan) && <line x1={center.x} y1={center.y} x2={center.x + radius} y2={center.y - tan * radius} stroke="#a855f7" strokeWidth="4" strokeDasharray="8 6" />}
        </>
      )}
      <circle cx={px} cy={py} r="8" fill="#ef4444" />
      {labels && (
        <>
          <Text x={px + 34} y={py - 12}>P</Text>
          <Text x={(center.x + px) / 2} y={center.y + 30}>cos theta</Text>
          <Text x={px + 48} y={(center.y + py) / 2}>sin theta</Text>
          {toggles["Show quadrant labels"] && <Text x={center.x - 95} y={center.y - 118}>Q {quadrantForAngle(theta)}</Text>}
        </>
      )}
      <ValueCard x={610} y={145} lines={[
        `theta = ${formatAngle(theta, angleMode)}`,
        `sin theta = ${formatTrigValue(sin)}`,
        `cos theta = ${formatTrigValue(cos)}`,
        `tan theta = ${formatTrigValue(tan)}`,
        `quadrant = ${quadrantForAngle(theta)}`,
        config.kind === "PythagoreanTrigIdentityProof" ? `sin^2 + cos^2 = ${formatTrigValue(sin * sin + cos * cos)}` : `P = (${formatTrigValue(cos)}, ${formatTrigValue(sin)})`,
      ]} />
      {step >= 4 && <Text x="690" y="405">{Math.abs(cos) < 0.015 ? "tan undefined when cos theta = 0" : "projection triangle links all ratios"}</Text>}
    </g>
  );
}

function ArcModel({ values, step, labels, toggles, angleMode }: ModelProps) {
  const radiusValue = values.radius || 3;
  const theta = values.theta || 90;
  const thetaRad = degToRad(theta);
  const center = { x: 285, y: 290 };
  const radius = 62 + radiusValue * 18;
  const point = unitCirclePoint(thetaRad, radius);
  const px = center.x + point.x;
  const py = center.y - point.y;
  const s = arcLength(radiusValue, thetaRad);
  return (
    <g>
      <circle cx={center.x} cy={center.y} r={radius} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={center.x + radius} y2={center.y} stroke="#22c55e" strokeWidth="5" />
      <line x1={center.x} y1={center.y} x2={px} y2={py} stroke="#22c55e" strokeWidth="5" />
      <path d={arcPath(center.x, center.y, radius, 0, theta)} fill="none" stroke="#f59e0b" strokeWidth="10" />
      <path d={arcPath(center.x, center.y, 58, 0, theta)} fill="none" stroke="#7c3aed" strokeWidth="5" />
      {toggles["Show radius copies"] && Array.from({ length: Math.min(5, Math.max(1, Math.round(thetaRad))) }, (_, index) => (
        <path key={index} d={arcPath(center.x, center.y, radius + 18 + index * 7, 0, 57.3)} fill="none" stroke="#22c55e" strokeWidth="3" opacity={0.55} />
      ))}
      {labels && (
        <>
          <Text x={center.x + radius / 2} y={center.y + 28}>r</Text>
          <Text x={px + 36} y={py - 12}>s</Text>
          <Text x={center.x + 72} y={center.y - 30}>theta</Text>
        </>
      )}
      <ValueCard x={610} y={160} lines={[
        `r = ${radiusValue.toFixed(2)}`,
        `theta = ${formatAngle(theta, angleMode)}`,
        `s = r theta = ${s.toFixed(3)}`,
        `theta = s / r = ${(s / radiusValue).toFixed(3)} rad`,
        `chord = ${chordLength(radiusValue, thetaRad).toFixed(3)}`,
        step >= 5 ? "Use radians for s = r theta" : "Arc grows with radius and angle",
      ]} />
    </g>
  );
}

function GraphsModel({ values, step: _step, labels, toggles, angleMode }: ModelProps) {
  const theta = values.theta || 0;
  const center = { x: 165, y: 270 };
  const radius = 96;
  const point = unitCirclePoint(degToRad(theta), radius);
  const px = center.x + point.x;
  const py = center.y - point.y;
  const graph = { x: 380, y: 150, w: 390, h: 220 };
  const progressX = graph.x + (theta / 360) * graph.w;
  const sinePoints = generateSinePoints(graph.w, graph.h).map((p) => `${graph.x + p.x},${graph.y + p.y}`).join(" ");
  const cosinePoints = generateCosinePoints(graph.w, graph.h).map((p) => `${graph.x + p.x},${graph.y + p.y}`).join(" ");
  return (
    <g>
      <Axes cx={center.x} cy={center.y} r={radius + 25} />
      <circle cx={center.x} cy={center.y} r={radius} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={px} y2={py} stroke="#0f172a" strokeWidth="4" />
      <circle cx={px} cy={py} r="7" fill="#ef4444" />
      <rect x={graph.x} y={graph.y} width={graph.w} height={graph.h} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <line x1={graph.x} y1={graph.y + graph.h / 2} x2={graph.x + graph.w} y2={graph.y + graph.h / 2} stroke="#94a3b8" strokeWidth="2" />
      {(toggles["Show sine graph"] ?? true) && <polyline points={sinePoints} fill="none" stroke="#ef4444" strokeWidth="4" />}
      {(toggles["Show cosine graph"] ?? true) && <polyline points={cosinePoints} fill="none" stroke="#22c55e" strokeWidth="4" />}
      <line x1={progressX} y1={graph.y} x2={progressX} y2={graph.y + graph.h} stroke="#7c3aed" strokeWidth="3" strokeDasharray="7 6" />
      <line x1={px} y1={py} x2={progressX} y2={graph.y + graph.h / 2 - sinDeg(theta) * graph.h * 0.38} stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" />
      {labels && (
        <>
          <Text x={graph.x + 54} y={graph.y + 30}>sin</Text>
          <Text x={graph.x + 54} y={graph.y + 56}>cos</Text>
          <Text x={progressX} y={graph.y + graph.h + 28}>{formatAngle(theta, angleMode)}</Text>
        </>
      )}
      <ValueCard x={610} y={405} lines={[`theta = ${formatAngle(theta, angleMode)}`, `sin = ${formatTrigValue(sinDeg(theta))}`, `cos = ${formatTrigValue(cosDeg(theta))}`, "amplitude = 1", "period = 2pi"]} />
    </g>
  );
}

function RotationModel({ config, values, step: _step, labels, toggles, angleMode }: ModelProps) {
  const theta = config.kind === "DoubleAngleIdentitiesProof" ? values.theta || 40 : (values.alpha || 35) + (values.beta || 40);
  const alpha = values.alpha || values.theta || 40;
  const beta = values.beta || values.theta || 40;
  const finalAngle = config.kind === "DoubleAngleIdentitiesProof" ? alpha * 2 : theta;
  const center = { x: 290, y: 290 };
  const radius = 150;
  const start = unitCirclePoint(degToRad(alpha), radius);
  const end = unitCirclePoint(degToRad(finalAngle), radius);
  return (
    <g>
      <Axes cx={center.x} cy={center.y} r={radius + 25} />
      <circle cx={center.x} cy={center.y} r={radius} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <path d={arcPath(center.x, center.y, 55, 0, alpha)} fill="none" stroke="#22c55e" strokeWidth="5" />
      <path d={arcPath(center.x, center.y, 76, alpha, finalAngle)} fill="none" stroke="#f59e0b" strokeWidth="5" />
      <line x1={center.x} y1={center.y} x2={center.x + start.x} y2={center.y - start.y} stroke="#22c55e" strokeWidth="5" />
      <line x1={center.x} y1={center.y} x2={center.x + end.x} y2={center.y - end.y} stroke="#ef4444" strokeWidth="6" />
      {(toggles["Show coordinate projections"] ?? true) && (
        <>
          <line x1={center.x + end.x} y1={center.y - end.y} x2={center.x + end.x} y2={center.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 6" />
          <line x1={center.x} y1={center.y} x2={center.x + end.x} y2={center.y} stroke="#22c55e" strokeWidth="4" />
        </>
      )}
      {labels && (
        <>
          <Text x={center.x + 75} y={center.y - 36}>alpha</Text>
          <Text x={center.x + 102} y={center.y - 80}>beta</Text>
          <Text x={center.x + end.x + 42} y={center.y - end.y}>final vector</Text>
        </>
      )}
      <ValueCard x={600} y={145} lines={[
        `alpha = ${formatAngle(alpha, angleMode)}`,
        `beta = ${formatAngle(beta, angleMode)}`,
        `final = ${formatAngle(finalAngle, angleMode)}`,
        `sin final = ${formatTrigValue(sinDeg(finalAngle))}`,
        `cos final = ${formatTrigValue(cosDeg(finalAngle))}`,
        config.kind.includes("Cosine") ? "read the x-coordinate" : config.kind.includes("Sine") ? "read the y-coordinate" : "set alpha = beta = theta",
      ]} />
    </g>
  );
}

function TriangleLawModel({ config, values, step: _step, labels, toggles, angleMode }: ModelProps) {
  if (config.kind === "SineRuleProof") return <SineRuleDiagram values={values} labels={labels} />;
  const a = values.a || 6;
  const b = values.b || 5;
  const theta = values.theta || 60;
  const scale = 42;
  const origin = { x: 150, y: 390 };
  const baseEnd = { x: origin.x + a * scale, y: origin.y };
  const top = { x: origin.x + b * scale * cosDeg(theta), y: origin.y - b * scale * sinDeg(theta) };
  const c = triangleSideFromLawOfCosines(a, b, theta);
  const area = triangleAreaUsingSine(a, b, theta);
  return (
    <g>
      <polygon points={`${origin.x},${origin.y} ${baseEnd.x},${baseEnd.y} ${top.x},${top.y}`} fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      {(toggles["Show projections"] ?? toggles["Show altitude"] ?? true) && (
        <>
          <line x1={top.x} y1={top.y} x2={top.x} y2={origin.y} stroke="#ef4444" strokeWidth="4" strokeDasharray="7 6" />
          <line x1={origin.x} y1={origin.y} x2={top.x} y2={origin.y} stroke="#f59e0b" strokeWidth="5" />
        </>
      )}
      <path d={arcPath(origin.x, origin.y, 48, 0, theta)} fill="none" stroke="#7c3aed" strokeWidth="5" />
      {labels && (
        <>
          <Text x={(origin.x + baseEnd.x) / 2} y={origin.y + 34}>a</Text>
          <Text x={(origin.x + top.x) / 2 - 24} y={(origin.y + top.y) / 2}>b</Text>
          <Text x={(baseEnd.x + top.x) / 2 + 28} y={(baseEnd.y + top.y) / 2}>c</Text>
          <Text x={origin.x + 62} y={origin.y - 18}>C</Text>
        </>
      )}
      <ValueCard x={610} y={150} lines={[
        `a = ${a.toFixed(1)}`,
        `b = ${b.toFixed(1)}`,
        `C = ${formatAngle(theta, angleMode)}`,
        `c = ${c.toFixed(3)}`,
        config.kind === "TriangleAreaSineFormulaProof" ? `area = ${area.toFixed(3)}` : `c^2 = ${(c * c).toFixed(3)}`,
        config.kind === "TriangleAreaSineFormulaProof" ? `height = b sin C = ${(b * sinDeg(theta)).toFixed(3)}` : "projection = b cos C",
      ]} />
    </g>
  );
}

function SineRuleDiagram({ values, labels }: { values: TrigValues; labels: boolean }) {
  const shift = values.a || 42;
  const center = { x: 310, y: 285 };
  const r = 150;
  const points = [
    unitCirclePoint(degToRad(220 - shift), r),
    unitCirclePoint(degToRad(325), r),
    unitCirclePoint(degToRad(70 + shift / 4), r),
  ].map((p) => ({ x: center.x + p.x, y: center.y - p.y }));
  return (
    <g>
      <circle cx={center.x} cy={center.y} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="#cffafe" stroke="#0f172a" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={center.x + r} y2={center.y} stroke="#22c55e" strokeWidth="4" />
      {labels && (
        <>
          <Text x={points[0].x - 18} y={points[0].y + 28}>A</Text>
          <Text x={points[1].x + 18} y={points[1].y + 28}>B</Text>
          <Text x={points[2].x} y={points[2].y - 18}>C</Text>
          <Text x={center.x + 72} y={center.y - 12}>R</Text>
          <Text x="650" y="250">a / sin A = b / sin B = c / sin C = 2R</Text>
        </>
      )}
      <ValueCard x={610} y={150} lines={["Each side is a chord", "a = 2R sin A", "b = 2R sin B", "c = 2R sin C", "shared ratio = 2R"]} />
    </g>
  );
}

function SmallAngleModel({ values, labels, toggles, angleMode }: ModelProps) {
  const theta = values.theta || 12;
  const center = { x: 285, y: 315 };
  const r = toggles["Zoom near origin"] ? 220 : 155;
  const p = unitCirclePoint(degToRad(theta), r);
  const tanY = Math.min(230, tanDeg(theta) * r);
  return (
    <g>
      <circle cx={center.x} cy={center.y} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={center.x + r} y2={center.y} stroke="#0f172a" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={center.x + p.x} y2={center.y - p.y} stroke="#0f172a" strokeWidth="4" />
      <line x1={center.x + p.x} y1={center.y} x2={center.x + p.x} y2={center.y - p.y} stroke="#ef4444" strokeWidth="5" />
      <path d={arcPath(center.x, center.y, r, 0, theta)} fill="none" stroke="#f59e0b" strokeWidth="8" />
      <line x1={center.x + r} y1={center.y} x2={center.x + r} y2={center.y - tanY} stroke="#a855f7" strokeWidth="5" />
      {labels && (
        <>
          <Text x={center.x + p.x + 36} y={center.y - p.y / 2}>sin theta</Text>
          <Text x={center.x + r + 48} y={center.y - tanY / 2}>tan theta</Text>
          <Text x={center.x + r * 0.65} y={center.y - 28}>theta arc</Text>
        </>
      )}
      <ValueCard x={610} y={145} lines={[
        `theta = ${formatAngle(theta, angleMode)}`,
        `theta radians = ${degToRad(theta).toFixed(4)}`,
        `sin theta = ${formatTrigValue(sinDeg(theta))}`,
        `tan theta = ${formatTrigValue(tanDeg(theta))}`,
        `error |theta - sin theta| = ${Math.abs(degToRad(theta) - sinDeg(theta)).toFixed(4)}`,
        "radians required",
      ]} />
    </g>
  );
}

type ModelProps = {
  config: TrigProofConfig;
  values: TrigValues;
  step: number;
  labels: boolean;
  toggles: Record<string, boolean>;
  angleMode: AngleMode;
};

function Slider({ label, value, min, max, step, display, onChange }: { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (value: number) => void }) {
  const progress = `${((value - min) / (max - min)) * 100}%`;
  return (
    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        <span className="mini-chip">{display}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--slider-progress": progress } as CSSProperties} className="mt-3 w-full accent-cyan-500" aria-label={label} />
    </label>
  );
}

function Axes({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#94a3b8" strokeWidth="2" />
      <line x1={cx} y1={cy + r} x2={cx} y2={cy - r} stroke="#94a3b8" strokeWidth="2" />
    </g>
  );
}

function ValueCard({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return (
    <g>
      <rect x={x - 20} y={y - 32} width="250" height={Math.max(130, lines.length * 25 + 24)} rx="14" className="fill-white stroke-slate-200 dark:fill-slate-950 dark:stroke-white/10" />
      {lines.map((line, index) => (
        <text key={line} x={x} y={y + index * 25} className="fill-slate-800 text-[15px] font-black dark:fill-slate-100">{line}</text>
      ))}
    </g>
  );
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
  return <text x={x} y={y} textAnchor="middle" className="fill-slate-800 text-[14px] font-black dark:fill-slate-100">{children}</text>;
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = unitCirclePoint(degToRad(startDeg), r);
  const end = unitCirclePoint(degToRad(endDeg), r);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg >= startDeg ? 0 : 1;
  return `M ${cx + start.x} ${cy - start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${cx + end.x} ${cy - end.y}`;
}

function titleForKind(kind: string) {
  return kind.replace(/Proof$/, "").replace(/([A-Z])/g, " $1").trim();
}

function subtitleForKind(kind: string, values: TrigValues, angleMode: AngleMode) {
  if (kind.includes("AngleAddition")) return `alpha + beta = ${formatAngle((values.alpha || 0) + (values.beta || 0), angleMode)}`;
  return `theta = ${formatAngle(values.theta || 0, angleMode)}`;
}

function dynamicFormulaLines(kind: string, values: TrigValues) {
  const theta = values.theta || 0;
  const alpha = values.alpha || 0;
  const beta = values.beta || 0;
  const a = values.a || 6;
  const b = values.b || 5;
  if (kind === "TangentRatioIdentityProof" && Math.abs(cosDeg(theta)) < 0.015) return ["Current tangent: undefined because cos theta is 0."];
  if (kind === "PythagoreanTrigIdentityProof") return [`Numeric check: ${formatTrigValue(sinDeg(theta) ** 2)} + ${formatTrigValue(cosDeg(theta) ** 2)} = ${formatTrigValue(sinDeg(theta) ** 2 + cosDeg(theta) ** 2)}`];
  if (kind === "CosineAngleAdditionProof") return [`Current check: cos(alpha + beta) = ${formatTrigValue(cosDeg(alpha + beta))}`];
  if (kind === "SineAngleAdditionProof") return [`Current check: sin(alpha + beta) = ${formatTrigValue(sinDeg(alpha + beta))}`];
  if (kind === "TriangleAreaSineFormulaProof") return [`Current area: 1/2(${a.toFixed(1)})(${b.toFixed(1)})sin(${theta.toFixed(1)} deg) = ${triangleAreaUsingSine(a, b, theta).toFixed(3)}`];
  if (kind === "SmallAngleApproximationProof") return [`Current radians: theta = ${degToRad(theta).toFixed(4)}, sin theta = ${formatTrigValue(sinDeg(theta))}`];
  return [];
}
