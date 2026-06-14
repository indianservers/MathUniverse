import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import {
  definiteIntegralApprox,
  derivativeExact,
  evaluateFunction,
  formatExpression,
  formatNumber,
  generateFunctionPoints,
  mapMathToSvg,
  riemannSum,
  secantSlope,
  taylorPolynomial,
  tangentLineAt,
  type FunctionId,
  type Point,
  type RiemannMethod,
} from "../../utils/calculusMath";
import type { CalculusParameterKey, CalculusProofConfig } from "./calculusProofConfigs";

type CalculusValues = Record<CalculusParameterKey, number>;
type Props = { category: VisualProofCategory; proof: VisualProof; config: CalculusProofConfig };

const emptyValues: CalculusValues = { x: 0, a: 0, b: 0, h: 0, n: 0, order: 0, u: 0, v: 0, du: 0, dv: 0 };
const graphOrigin = { x: 320, y: 285 };
const graphScale = { x: 58, y: 44 };

export default function CalculusProofTemplate({ category, proof, config }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [functionId, setFunctionId] = useState<FunctionId>(config.defaultFunction);
  const [method, setMethod] = useState<RiemannMethod>(config.riemannMethod ?? "midpoint");
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => Object.fromEntries((config.toggles ?? []).map((toggle) => [toggle, true])));
  const [values, setValues] = useState<CalculusValues>(() => ({ ...emptyValues, ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])) }));

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => setActiveStep((step) => (step >= config.steps.length - 1 ? 0 : step + 1)), 900);
    return () => window.clearInterval(timer);
  }, [config.steps.length, isPlaying]);

  const formulas = useMemo(() => [...config.formulas, ...dynamicFormulaLines(config.kind, functionId, values, method)], [config.formulas, config.kind, functionId, method, values]);

  function reset() {
    setActiveStep(0);
    setIsPlaying(false);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setFunctionId(config.defaultFunction);
    setMethod(config.riemannMethod ?? "midpoint");
    setToggles(Object.fromEntries((config.toggles ?? []).map((toggle) => [toggle, true])));
    setValues({ ...emptyValues, ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])) });
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
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Calculus proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Calculus controls</h2>
        {config.functionOptions && (
          <label className="mt-3 block text-sm font-bold text-slate-700 dark:text-slate-200">
            Function
            <select value={functionId} onChange={(event) => setFunctionId(event.target.value as FunctionId)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950">
              {config.functionOptions.map((option) => <option key={option} value={option}>{formatExpression(option)}</option>)}
            </select>
          </label>
        )}
        {config.visual === "riemann" && (
          <label className="mt-3 block text-sm font-bold text-slate-700 dark:text-slate-200">
            Rectangle method
            <select value={method} onChange={(event) => setMethod(event.target.value as RiemannMethod)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950">
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="midpoint">Midpoint</option>
            </select>
          </label>
        )}
        {config.parameters.map((parameter) => (
          <Slider key={parameter.key} label={parameter.label} value={values[parameter.key]} min={parameter.min} max={parameter.max} step={parameter.step ?? 1} onChange={(value) => { setIsPlaying(false); setValues((current) => ({ ...current, [parameter.key]: value })); }} />
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
      visual={<CalculusVisual config={config} values={values} activeStep={activeStep} labelsVisible={labelsVisible} toggles={toggles} functionId={functionId} method={method} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={<FormulaPanel visible={formulaVisible} title="Formula and numerical substitution" formulas={formulas} />}
      conceptNotes={<p>{config.notes}</p>}
      reflectionQuestions={config.questions}
    />
  );
}

function CalculusVisual({ config, values, activeStep, labelsVisible, toggles, functionId, method }: { config: CalculusProofConfig; values: CalculusValues; activeStep: number; labelsVisible: boolean; toggles: Record<string, boolean>; functionId: FunctionId; method: RiemannMethod }) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={`${config.kind} calculus visual proof`} className="h-[540px] w-full max-w-full">
        <defs>
          <marker id="calc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a" />
          </marker>
        </defs>
        <rect x="18" y="18" width="864" height="504" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <Title title={titleForKind(config.kind)} subtitle={formatExpression(functionId)} />
        {(toggles["Show grid"] ?? true) && <Grid />}
        {["limit", "derivative", "mvt", "optimization"].includes(config.visual) && <GraphModel config={config} values={values} step={activeStep} labels={labelsVisible} toggles={toggles} functionId={functionId} />}
        {config.visual === "riemann" && <RiemannModel values={values} labels={labelsVisible} functionId={functionId} method={method} />}
        {config.visual === "accumulation" && <AccumulationModel values={values} labels={labelsVisible} toggles={toggles} functionId={functionId} />}
        {config.visual === "rule" && <RuleModel config={config} values={values} labels={labelsVisible} functionId={functionId} />}
        {config.visual === "parts" && <PartsModel values={values} labels={labelsVisible} />}
        {config.visual === "taylor" && <TaylorModel values={values} labels={labelsVisible} functionId={functionId} />}
      </svg>
    </div>
  );
}

function GraphModel({ config, values, step, labels, toggles, functionId }: ModelProps) {
  const x = values.x || 1;
  const h = values.h || 0.5;
  const a = values.a || -1;
  const b = values.b || 2;
  const curve = pathFromPoints(generateFunctionPoints(functionId, -4.5, 4.5));
  const p = mathPoint(functionId, x);
  const q = mathPoint(functionId, x + h);
  const ps = map(p);
  const qs = map(q);
  const tangent = tangentLineAt(functionId, x);
  const lineA = map({ x: -4.4, y: tangent.slope * -4.4 + tangent.intercept });
  const lineB = map({ x: 4.4, y: tangent.slope * 4.4 + tangent.intercept });
  const secantSlopeValue = secantSlope(functionId, x, h);
  const secA = map({ x: -4.4, y: secantSlopeValue * (-4.4 - p.x) + p.y });
  const secB = map({ x: 4.4, y: secantSlopeValue * (4.4 - p.x) + p.y });
  const secIntervalA = map(mathPoint(functionId, a));
  const secIntervalB = map(mathPoint(functionId, b));
  return (
    <g>
      <path d={curve} fill="none" stroke="#0891b2" strokeWidth="5" />
      {config.visual === "limit" && (
        <>
          <line x1={map({ x, y: -5 }).x} y1="95" x2={map({ x, y: 5 }).x} y2="475" stroke="#a855f7" strokeWidth="3" strokeDasharray="7 6" />
          <Point p={map(mathPoint(functionId, x - h))} label="left" labels={labels} fill="#f59e0b" />
          <Point p={map(mathPoint(functionId, x + h))} label="right" labels={labels} fill="#ef4444" />
        </>
      )}
      {config.visual === "mvt" && (
        <>
          <line x1={secIntervalA.x} y1={secIntervalA.y} x2={secIntervalB.x} y2={secIntervalB.y} stroke="#f59e0b" strokeWidth="5" />
          <Point p={secIntervalA} label="a" labels={labels} />
          <Point p={secIntervalB} label="b" labels={labels} />
        </>
      )}
      {(toggles["Show tangent"] ?? true) && <line x1={lineA.x} y1={lineA.y} x2={lineB.x} y2={lineB.y} stroke="#ef4444" strokeWidth="4" />}
      {(config.visual === "derivative" || config.kind === "SecantBecomesTangentProof") && <line x1={secA.x} y1={secA.y} x2={secB.x} y2={secB.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray={step > 3 ? "7 6" : undefined} />}
      <Point p={ps} label={`x=${formatNumber(x)}`} labels={labels} />
      {(config.visual === "derivative" || config.kind === "SecantBecomesTangentProof") && <Point p={qs} label="x+h" labels={labels} fill="#f59e0b" />}
      {config.visual === "optimization" && <CriticalMarkers functionId={functionId} labels={labels} />}
      <ValueCard lines={[formatExpression(functionId), `f(x) = ${formatNumber(p.y)}`, `secant slope = ${formatNumber(secantSlopeValue)}`, `tangent slope = ${formatNumber(tangent.slope)}`, config.visual === "limit" ? `left/right h = ${formatNumber(h)}` : config.visual === "mvt" ? `avg slope = ${formatNumber((evaluateFunction(functionId, b) - evaluateFunction(functionId, a)) / (b - a))}` : "graph updates from sliders"]} />
    </g>
  );
}

function RiemannModel({ values, labels, functionId, method }: { values: CalculusValues; labels: boolean; functionId: FunctionId; method: RiemannMethod }) {
  const a = values.a || -1;
  const b = values.b || 2;
  const n = Math.max(2, Math.round(values.n || 8));
  const dx = (b - a) / n;
  return (
    <g>
      <path d={pathFromPoints(generateFunctionPoints(functionId, -4.5, 4.5))} fill="none" stroke="#0891b2" strokeWidth="5" />
      {Array.from({ length: n }, (_, i) => {
        const left = a + i * dx;
        const sample = method === "right" ? left + dx : method === "midpoint" ? left + dx / 2 : left;
        const y = evaluateFunction(functionId, sample);
        const p0 = map({ x: left, y: 0 });
        const p1 = map({ x: left + dx, y });
        return <rect key={i} x={p0.x} y={Math.min(p0.y, p1.y)} width={Math.max(1, Math.abs(dx * graphScale.x) - 1)} height={Math.abs(p0.y - p1.y)} fill="#f59e0b" opacity="0.45" stroke="#92400e" />;
      })}
      {labels && <Text x="445" y="108">Riemann rectangles</Text>}
      <ValueCard lines={[`n = ${n}`, `method = ${method}`, `Delta x = ${formatNumber(dx)}`, `sum = ${formatNumber(riemannSum(functionId, a, b, n, method))}`, `midpoint integral approx = ${formatNumber(definiteIntegralApprox(functionId, a, b))}`]} />
    </g>
  );
}

function AccumulationModel({ values, labels, toggles, functionId }: { values: CalculusValues; labels: boolean; toggles: Record<string, boolean>; functionId: FunctionId }) {
  const a = values.a || -1;
  const x = values.x || 2;
  const h = values.h || 0.4;
  const left = Math.min(a, x);
  const right = Math.max(a, x);
  const area = definiteIntegralApprox(functionId, a, x);
  return (
    <g>
      <path d={pathFromPoints(generateFunctionPoints(functionId, -4.5, 4.5))} fill="none" stroke="#0891b2" strokeWidth="5" />
      <path d={areaPath(functionId, left, right)} fill="#22c55e" opacity="0.28" stroke="#16a34a" />
      {(toggles["Show small rectangle"] ?? false) && <rect x={map({ x, y: evaluateFunction(functionId, x) }).x} y={map({ x, y: evaluateFunction(functionId, x) }).y} width={h * graphScale.x} height={Math.abs(evaluateFunction(functionId, x) * graphScale.y)} fill="#f59e0b" opacity="0.45" />}
      <Point p={map(mathPoint(functionId, x))} label="x" labels={labels} />
      <ValueCard lines={[`A(x) = integral from ${formatNumber(a)} to ${formatNumber(x)}`, `area approx = ${formatNumber(area)}`, `f(x) = ${formatNumber(evaluateFunction(functionId, x))}`, `h = ${formatNumber(h)}`, "A'(x) matches f(x) in FTC view"]} />
    </g>
  );
}

function RuleModel({ config, values, labels }: { config: CalculusProofConfig; values: CalculusValues; labels: boolean; functionId: FunctionId }) {
  if (config.kind === "ProductRuleVisualProof") return <PartsModel values={values} labels={labels} productRule />;
  if (config.kind === "ChainRuleVisualProof") {
    return (
      <g>
        <rect x="120" y="210" width="120" height="80" rx="16" fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
        <rect x="355" y="210" width="120" height="80" rx="16" fill="#fef3c7" stroke="#d97706" strokeWidth="4" />
        <rect x="590" y="210" width="120" height="80" rx="16" fill="#dcfce7" stroke="#16a34a" strokeWidth="4" />
        <Arrow x1={240} y1={250} x2={355} y2={250} />
        <Arrow x1={475} y1={250} x2={590} y2={250} />
        <Text x="180" y="255">x</Text><Text x="415" y="255">u=g(x)</Text><Text x="650" y="255">y=f(u)</Text>
        <ValueCard lines={[`x = ${formatNumber(values.x)}`, `dx = ${formatNumber(values.h)}`, "du = g'(x) dx", "dy = f'(u) du", "dy/dx = dy/du x du/dx"]} />
      </g>
    );
  }
  const n = Math.round(values.n || 3);
  const x = values.x || 1;
  return (
    <g>
      <path d={pathFromPower(n)} fill="none" stroke="#0891b2" strokeWidth="5" />
      <Point p={map({ x, y: x ** n })} label="x" labels={labels} />
      <ValueCard lines={[`n = ${n}`, `x = ${formatNumber(x)}`, `d/dx x^n = nx^(n-1)`, `current derivative = ${formatNumber(n * x ** (n - 1))}`, "higher h terms vanish"]} />
    </g>
  );
}

function PartsModel({ values, labels, productRule = false }: { values: CalculusValues; labels: boolean; productRule?: boolean }) {
  const u = values.u || 4, v = values.v || 3, du = values.du || 0.6, dv = values.dv || 0.5;
  const x = 130, y = 145, scale = 45;
  return (
    <g>
      <rect x={x} y={y + dv * scale} width={u * scale} height={v * scale} fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      <rect x={x + u * scale} y={y + dv * scale} width={du * scale} height={v * scale} fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      <rect x={x} y={y} width={u * scale} height={dv * scale} fill="#dcfce7" stroke="#16a34a" strokeWidth="3" />
      <rect x={x + u * scale} y={y} width={du * scale} height={dv * scale} fill="#fecaca" stroke="#ef4444" strokeWidth="3" />
      {labels && <><Text x={x + u * scale / 2} y={y + dv * scale + v * scale / 2}>uv</Text><Text x={x + u * scale + du * scale / 2} y={y + dv * scale + v * scale / 2}>vdu</Text><Text x={x + u * scale / 2} y={y + dv * scale / 2}>udv</Text></>}
      <ValueCard lines={productRule ? ["Delta(uv)=vdu+udv+dudv", `corner = ${formatNumber(du * dv)}`, "(uv)' = u'v + uv'"] : ["d(uv)=u dv + v du", "uv = integral u dv + integral v du", "integral u dv = uv - integral v du"]} />
    </g>
  );
}

function TaylorModel({ values, labels, functionId }: { values: CalculusValues; labels: boolean; functionId: FunctionId }) {
  const order = Math.round(values.order || 3);
  const original = pathFromPoints(generateFunctionPoints(functionId, -3.5, 3.5));
  const approxPoints = Array.from({ length: 140 }, (_, i) => {
    const x = -3.5 + (i / 139) * 7;
    return { x, y: taylorPolynomial(functionId, 0, order, x) };
  }).filter((p) => Number.isFinite(p.y) && Math.abs(p.y) < 9);
  return (
    <g>
      <path d={original} fill="none" stroke="#0891b2" strokeWidth="5" />
      <path d={pathFromPoints(approxPoints)} fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="8 5" />
      <Point p={map({ x: 0, y: evaluateFunction(functionId, 0) })} label="center" labels={labels} fill="#a855f7" />
      <ValueCard lines={[`order = ${order}`, `function = ${formatExpression(functionId)}`, "red dashed = Taylor polynomial", "best accuracy near center", `test x = ${formatNumber(values.x)}`]} />
    </g>
  );
}

function CriticalMarkers({ functionId, labels }: { functionId: FunctionId; labels: boolean }) {
  const candidates = [-2, 0, 2].filter((x) => Math.abs(derivativeExact(functionId, x)) < 0.25);
  return <>{candidates.map((x) => <Point key={x} p={map(mathPoint(functionId, x))} label="critical" labels={labels} fill="#a855f7" />)}</>;
}

type ModelProps = { config: CalculusProofConfig; values: CalculusValues; step: number; labels: boolean; toggles: Record<string, boolean>; functionId: FunctionId };

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <label className="mt-4 block"><span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">{label}<span className="mini-chip">{formatNumber(value)}</span></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ "--slider-progress": `${((value - min) / (max - min)) * 100}%` } as CSSProperties} className="mt-3 w-full accent-cyan-500" aria-label={label} /></label>;
}

function Grid() {
  return <g>{Array.from({ length: 13 }, (_, i) => <line key={`v${i}`} x1={graphOrigin.x + (i - 6) * graphScale.x} y1="95" x2={graphOrigin.x + (i - 6) * graphScale.x} y2="475" stroke={i === 6 ? "#0f172a" : "#cbd5e1"} strokeWidth={i === 6 ? 3 : 1} />)}{Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="65" y1={graphOrigin.y + (i - 5) * graphScale.y} x2="590" y2={graphOrigin.y + (i - 5) * graphScale.y} stroke={i === 5 ? "#0f172a" : "#cbd5e1"} strokeWidth={i === 5 ? 3 : 1} />)}</g>;
}

function Point({ p, label, labels, fill = "#ef4444" }: { p: Point; label: string; labels: boolean; fill?: string }) {
  return <g><circle cx={p.x} cy={p.y} r="7" fill={fill} stroke="#fff" strokeWidth="2" />{labels && <Text x={p.x + 38} y={p.y - 12}>{label}</Text>}</g>;
}

function ValueCard({ lines }: { lines: string[] }) {
  return <g><rect x="630" y="125" width="235" height={Math.max(130, lines.length * 25 + 28)} rx="14" className="fill-white stroke-slate-200 dark:fill-slate-950 dark:stroke-white/10" />{lines.map((line, index) => <text key={line} x="648" y={160 + index * 25} className="fill-slate-800 text-[14px] font-black dark:fill-slate-100">{line}</text>)}</g>;
}

function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return <><text x="54" y="58" className="fill-slate-900 text-[22px] font-black dark:fill-white">{title}</text><text x="54" y="84" className="fill-slate-500 text-[13px] font-bold dark:fill-slate-300">{subtitle}</text></>;
}

function Text({ x, y, children }: { x: number | string; y: number | string; children: ReactNode }) {
  return <text x={x} y={y} textAnchor="middle" className="fill-slate-800 text-[13px] font-black dark:fill-slate-100">{children}</text>;
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth="4" markerEnd="url(#calc-arrow)" />;
}

function map(point: Point) { return mapMathToSvg(point, graphOrigin, graphScale); }
function mathPoint(functionId: FunctionId, x: number) { return { x, y: evaluateFunction(functionId, x) }; }
function pathFromPoints(points: Point[]) { return points.map((point, i) => `${i === 0 ? "M" : "L"} ${map(point).x} ${map(point).y}`).join(" "); }
function pathFromPower(n: number) { return pathFromPoints(Array.from({ length: 140 }, (_, i) => { const x = -3.5 + (i / 139) * 7; return { x, y: x ** n }; }).filter((p) => Math.abs(p.y) < 8)); }
function areaPath(functionId: FunctionId, a: number, b: number) { const pts = generateFunctionPoints(functionId, a, b, 80); return `M ${map({ x: a, y: 0 }).x} ${map({ x: a, y: 0 }).y} ${pts.map((p) => `L ${map(p).x} ${map(p).y}`).join(" ")} L ${map({ x: b, y: 0 }).x} ${map({ x: b, y: 0 }).y} Z`; }
function titleForKind(kind: string) { return kind.replace(/Proof$/, "").replace(/([A-Z])/g, " $1").trim(); }

function dynamicFormulaLines(kind: string, functionId: FunctionId, values: CalculusValues, method: RiemannMethod) {
  const x = values.x || 1, h = values.h || 0.5, a = values.a || -1, b = values.b || 2, n = Math.max(2, Math.round(values.n || 8));
  if (kind.includes("Derivative") || kind.includes("Secant")) return [`Current secant slope = ${formatNumber(secantSlope(functionId, x, h))}`, `Current tangent slope = ${formatNumber(derivativeExact(functionId, x))}`];
  if (kind.includes("Riemann")) return [`Current ${method} sum = ${formatNumber(riemannSum(functionId, a, b, n, method))}`];
  if (kind.includes("Integral") || kind.includes("Fundamental")) return [`Current accumulated area = ${formatNumber(definiteIntegralApprox(functionId, a, x))}`];
  if (kind.includes("Taylor")) return [`Current approximation at x = ${formatNumber(x)} is ${formatNumber(taylorPolynomial(functionId, 0, Math.round(values.order || 3), x))}`];
  return [`Current f(x) = ${formatNumber(evaluateFunction(functionId, x))}`];
}
