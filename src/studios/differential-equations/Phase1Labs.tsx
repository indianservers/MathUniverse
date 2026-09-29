import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BookOpen, Check, ChevronDown, Compass, GitBranch, Lightbulb, Plus, RotateCcw, Search, Sparkles, Target, Trash2 } from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { compileFunctionExpression, compileTwoVariableExpression } from "../../utils/functionParser";
import { inspectEquation, normalizeEquation } from "./equationInspection";
import { contourSegments, exactPresets, homogeneousPresets, linearPresets, methodPresets } from "./firstOrderMath";
import { Phase1Graph, rk4Curve, sampleCurve, type Bounds, type GraphSeries, type Point } from "./Phase1Graph";
import { solutionValueAt } from "./directionFieldCompare";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import "./phase1Labs.css";

const blue = "#1769f5";
const violet = "#7838ee";
const green = "#0ba66a";
const orange = "#f97316";
const baseBounds: Bounds = { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5 };

export function Card({ title, icon: Icon, children, className = "" }: { title: string; icon?: typeof Search; children: React.ReactNode; className?: string }) {
  return <section className={`de1-card ${className}`}><h2>{Icon ? <Icon size={19} aria-hidden="true" /> : null}{title}</h2>{children}</section>;
}
export function Formula({ value, display = false }: { value: string; display?: boolean }) { return <MathExpression value={value} display={display} className="de1-formula" />; }
export function Slider({ label, value, min, max, step = 0.1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="de1-slider"><span>{label}<output>{Number(value.toFixed(3))}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
export function CheckBox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="de1-check"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
}
export function ExampleChips({ items, onSelect }: { items: Array<{ label: string; value: string }>; onSelect: (value: string) => void }) {
  return <div className="de1-chips">{items.map((item) => <button key={item.value} type="button" onClick={() => onSelect(item.value)}>{item.label}</button>)}</div>;
}
export function Steps({ steps }: { steps: Array<{ title: string; formula?: string; detail?: string }> }) {
  return <div className="de1-steps">{steps.map((step, index) => <details key={`${index}-${step.title}`} open={index === 0}><summary><span>{index + 1}</span><strong>{step.title}</strong><ChevronDown size={15} /></summary><div className="de1-step-content">{step.formula ? <Formula value={step.formula} /> : null}{step.detail ? <p>{step.detail}</p> : null}</div></details>)}</div>;
}
export function Notice({ children, good = false }: { children: React.ReactNode; good?: boolean }) { return <p className={`de1-notice${good ? " is-good" : ""}`}><Lightbulb size={17} />{children}</p>; }
export function compileSlope(raw: string, parameters: Record<string, number> = {}) {
  try {
    let expression = raw.trim().replace(/′/g, "'").replace(/^\s*(?:dy\s*\/\s*dx|y')\s*=\s*/i, "").replace(/[−–]/g, "-");
    for (const [key, value] of Object.entries(parameters)) expression = expression.replace(new RegExp(`\\b${key}\\b`, "g"), `(${value})`);
    const fn = compileTwoVariableExpression(expression);
    fn(0.21, 0.37);
    return { fn, error: "" };
  } catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Enter a valid slope rule." }; }
}
export function fmt(value: number, digits = 2) { return Number.isFinite(value) ? Number(value.toFixed(digits)).toLocaleString() : "undefined"; }

const explorerExamples = [
  { label: "Logistic Growth", value: "y' = r*y*(1-y/K)" },
  { label: "Linear First-Order", value: "y' = x-y" },
  { label: "Separable", value: "y' = x*y" },
  { label: "Bernoulli", value: "y' = y-y^2" },
  { label: "Custom Example", value: "y' = sin(x)-y" },
];

export function EquationExplorerPhase1() {
  const [equation, setEquation] = useState(explorerExamples[0].value);
  const [r, setR] = useState(0.8);
  const [capacity, setCapacity] = useState(5);
  const [parameterA, setParameterA] = useState(1);
  const [parameterB, setParameterB] = useState(1);
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [xMax, setXMax] = useState(10);
  const [view, setView] = useState<"Both" | "Solutions" | "Direction Field">("Both");
  const [showEquilibria, setShowEquilibria] = useState(true);
  const [showSelected, setShowSelected] = useState(true);
  const logistic = /\br\s*\*?\s*y\s*\*?\s*\(\s*1\s*-\s*y\s*\/\s*K\s*\)/i.test(equation);
  const hasA = /\ba\b/.test(equation);
  const hasB = /\bb\b/.test(equation);
  const compiled = useMemo(() => compileSlope(equation, { r, K: capacity, a: parameterA, b: parameterB }), [equation, r, capacity, parameterA, parameterB]);
  const bounds = { xMin: -2, xMax, yMin: -2.5, yMax: Math.max(7, capacity + 2) };
  const field = compiled.fn ?? (() => Number.NaN);
  const curves: GraphSeries[] = compiled.fn && view !== "Direction Field" ? [0.5, 1, 2, 4, 7].map((start, index) => ({ label: `y(${fmt(x0, 1)}) = ${fmt(start, 1)}`, color: [orange, blue, violet, green, "#ef4444"][index], points: rk4Curve(field, { x: x0, y: start }, bounds) })) : [];
  if (compiled.fn && showSelected && view !== "Direction Field") curves.push({ label: "Selected solution", color: "#142d75", points: rk4Curve(field, { x: x0, y: y0 }, bounds) });
  const inspection = inspectEquation(equation);
  const reset = () => { setEquation(explorerExamples[0].value); setR(0.8); setCapacity(5); setParameterA(1); setParameterB(1); setX0(0); setY0(1); setXMax(10); setView("Both"); };
  return <div className="de1-page">
    <Card title="Differential Equation" icon={Search} className="de1-equation-banner"><div className="de1-equation-row"><input aria-label="Differential equation" value={equation} onChange={(event) => setEquation(event.target.value)} /><button type="button" className="de1-primary" onClick={() => document.getElementById("de1-explorer-graph")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Solve &amp; Visualize <ArrowRight size={16} /></button></div><span>Try an example:</span><ExampleChips items={explorerExamples} onSelect={setEquation} />{compiled.error && <p role="alert" className="de1-error">{compiled.error}</p>}</Card>
    <div className="de1-summary-three"><Card title="Equation Classification"><div className="de1-badges"><b>First-order</b><b className={logistic ? "orange" : "green"}>{logistic || inspection.linearity === "Nonlinear" ? "Nonlinear" : "Linear"}</b><b className="green">{logistic ? "Autonomous" : "Slope rule"}</b></div></Card><Card title="Standard Form"><Formula value={logistic ? "\\frac{dy}{dx}=r y\\left(1-\\frac{y}{K}\\right)" : `\\frac{dy}{dx}=${equation.replace(/^.*=/, "")}`} /></Card><Card title="Description"><p>{logistic ? `Logistic growth slows as y approaches the carrying capacity K = ${fmt(capacity)}.` : inspection.explanation}</p></Card></div>
    <div className="de1-three-col de1-explorer-layout"><Card title="Parameters & Settings"><button type="button" className="de1-text-button" onClick={reset}><RotateCcw size={14} /> Reset</button>{hasA ? <Slider label="a  Detected parameter" value={parameterA} min={-3} max={3} step={0.1} onChange={setParameterA} /> : null}{hasB ? <Slider label="b  Detected parameter" value={parameterB} min={-3} max={3} step={0.1} onChange={setParameterB} /> : null}{logistic ? <><Slider label="r  Growth rate" value={r} min={0.1} max={2} step={0.05} onChange={setR} /><Slider label="K  Carrying capacity" value={capacity} min={1} max={10} step={0.1} onChange={setCapacity} /></> : null}<h3>Domain (x)</h3><Slider label="x max" value={xMax} min={4} max={16} step={0.5} onChange={setXMax} /><h3>Initial Condition</h3><div className="de1-pair"><label>x₀<input type="number" value={x0} step="0.1" onChange={(event) => setX0(Number(event.target.value))} /></label><label>y(x₀)<input type="number" value={y0} step="0.1" onChange={(event) => setY0(Number(event.target.value))} /></label></div><h3>Visualization Options</h3><CheckBox label="Highlight selected solution" checked={showSelected} onChange={setShowSelected} /><CheckBox label="Show equilibrium points" checked={showEquilibria} onChange={setShowEquilibria} /></Card>
      <Card title="Solution Curves and Direction Field" className="de1-graph-card"><div id="de1-explorer-graph"><div className="de1-segmented">{(["Both", "Solutions", "Direction Field"] as const).map((item) => <button type="button" key={item} aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}</div><Phase1Graph bounds={bounds} series={curves} field={field} showField={view !== "Solutions"} horizontalLines={logistic && showEquilibria ? [{ y: capacity, label: `y = K = ${fmt(capacity)}`, color: violet }, { y: 0, label: "y = 0", color: "#ec4899" }] : []} label="Solution curves and direction field" /></div></Card>
      <div className="de1-stack"><Card title="Symbolic Interpretation"><h3>Equation</h3><Formula value={logistic ? "\\frac{dy}{dx}=ry(1-y/K)" : equation} display />{logistic ? <><h3>Equilibrium Points</h3><p>y = 0 (unstable) · y = K = {fmt(capacity)} (stable)</p><h3>Analytic Solution</h3><Formula value="y(x)=\frac{K}{1+Ce^{-rx}}" display /><p>C = {fmt(((capacity - y0) / Math.max(1e-8, y0)) * Math.exp(r * x0), 3)} when x₀ = {fmt(x0)}.</p></> : <p>The slope rule determines a numerical solution through each initial point.</p>}</Card><Card title="Example Library"><ExampleChips items={explorerExamples} onSelect={setEquation} /></Card></div></div>
    <div className="de1-insights"><Card title="Growth Rate"><p>{logistic ? `Larger r makes solutions approach K faster. Current r = ${fmt(r)}.` : "The field shows how quickly solutions rise or fall."}</p></Card><Card title="Carrying Capacity"><p>{logistic ? `K = ${fmt(capacity)} sets the upper stable equilibrium.` : "Equilibria are where the slope is zero."}</p></Card><Card title="Initial Condition"><p>Through ({fmt(x0)}, {fmt(y0)}), one solution is selected from the family.</p></Card></div>
  </div>;
}

type FeatureKey = "separable" | "exact" | "linear" | "homogeneous" | "bernoulli" | "higher" | "numerical";
const featureLabels: Array<{ id: FeatureKey; label: string; hint: string }> = [
  { id: "separable", label: "Separable", hint: "Can be written g(y)dy = f(x)dx" },
  { id: "exact", label: "Exact", hint: "Mᵧ = Nₓ" },
  { id: "linear", label: "Linear (First-Order)", hint: "y′ + P(x)y = Q(x)" },
  { id: "homogeneous", label: "Homogeneous", hint: "Slope depends on y/x" },
  { id: "bernoulli", label: "Bernoulli", hint: "y′ + P(x)y = Q(x)yⁿ" },
  { id: "higher", label: "Higher-Order", hint: "Contains y′′ or higher" },
  { id: "numerical", label: "Numerical / Other", hint: "Use an approximation when no symbolic form fits" },
];
const methodRoutes: Record<FeatureKey, string> = { separable: "separable", exact: "exact", linear: "linear-first-order", homogeneous: "homogeneous", bernoulli: "bernoulli", higher: "higher-order-linear", numerical: "euler" };
function detectFeatures(text: string): Record<FeatureKey, boolean> {
  const n = normalizeEquation(text);
  return { higher: /y''|d\^2y/.test(n), linear: /y'[^=]*[+-][^=]*y=|dy\/dx[^=]*[+-][^=]*y=/.test(n) && !/y\^|y²/.test(n), separable: /xy|x\*y|y'=y|dy\/dx=xy/.test(n), exact: /dx.*dy/.test(n), homogeneous: /\(x[+-]y\)\/\(x[+-]y\)|y\/x|x\/y/.test(n), bernoulli: /y\^|y²/.test(n) && /y'|dy\/dx/.test(n), numerical: false };
}
export function MethodSelectorPhase1() {
  const [equation, setEquation] = useState("y' + 2y = e^x");
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>(() => detectFeatures("y' + 2y = e^x"));
  const [selected, setSelected] = useState<FeatureKey>("linear");
  const [showMore, setShowMore] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const [autonomous, setAutonomous] = useState("No");
  const ranked = useMemo(() => { const noSymbolic = !featureLabels.some((item) => item.id !== "numerical" && features[item.id]); return featureLabels.map((item) => ({ ...item, score: features.higher ? (item.id === "higher" ? 95 : 10) : item.id === "higher" ? 10 : item.id === "numerical" ? (noSymbolic || features.numerical ? 90 : 30) : features[item.id] ? (item.id === "linear" ? 95 : 88) : 20 })).sort((a, b) => b.score - a.score); }, [features]);
  const chooseEquation = (value: string) => { setEquation(value); const detected = detectFeatures(value); setFeatures(detected); setSelected(featureLabels.find((item) => detected[item.id])?.id ?? "numerical"); setAnalyzed(false); };
  return <div className="de1-page"><div className="de1-lead-strip"><span><Search /> Equation Analysis <small>Identify key features</small></span><span><GitBranch /> Decision Tree <small>Visual guidance</small></span><span><Compass /> Recommended Methods <small>Based on your equation</small></span></div>
    <div className="de1-method-grid"><Card title="1  Analyze Your Equation"><label className="de1-field">Enter your equation (optional)<input aria-label="Equation to analyze" value={equation} onChange={(event) => { setEquation(event.target.value); setFeatures(detectFeatures(event.target.value)); setAnalyzed(false); }} /></label><ExampleChips items={methodPresets.map((item) => ({ label: item.equation, value: item.equation }))} onSelect={chooseEquation} /><h3>Equation Type &amp; Features</h3><p>Select all that apply. You can override the suggested features.</p>{featureLabels.map((item) => <label key={item.id} className="de1-feature-toggle"><span><b>{item.label}</b><small>{item.hint}</small></span><input type="checkbox" checked={features[item.id]} onChange={(event) => { setFeatures({ ...features, [item.id]: event.target.checked }); setAnalyzed(false); }} /></label>)}<h3>Additional Information</h3><label className="de1-field">Is the equation autonomous?<select value={autonomous} onChange={(event) => setAutonomous(event.target.value)}><option>No</option><option>Yes</option><option>Unsure</option></select></label><button className="de1-primary de1-full" type="button" onClick={() => { if (!Object.values(features).some(Boolean)) { const detected = detectFeatures(equation); setFeatures(detected); setSelected(featureLabels.find((item) => detected[item.id])?.id ?? "numerical"); } else setSelected(ranked[0].id); setAnalyzed(true); }}>Analyze &amp; Recommend <ArrowRight size={16} /></button></Card>
    <Card title="2  Explore the Decision Tree" className="de1-tree-card"><p>See how equation features lead to solution methods.</p><div className="de1-decision-tree"><div className="de1-node">Start<br /><small>A differential equation is given.</small></div><div className="de1-tree-line" /><div className="de1-node question">What order?</div><div className="de1-tree-branches"><div className={features.higher ? "de1-node selected" : "de1-node"}>Higher-Order<br /><small>Use characteristic roots or variation of parameters.</small></div><div className={!features.higher ? "de1-node selected" : "de1-node"}>First-Order<br /><small>Test structure and coefficients.</small></div></div><div className="de1-tree-line" /><div className="de1-node question">Which structure fits?</div><div className="de1-tree-methods">{featureLabels.filter((item) => item.id !== "higher").map((item) => <button key={item.id} type="button" className={features[item.id] ? "selected" : ""} onClick={() => setSelected(item.id)}><b>{item.label}</b><small>{item.hint}</small></button>)}</div><Notice>{analyzed ? `The strongest matching path is ${ranked[0].label}.` : "Press Analyze to refresh recommendations after changing the equation."}</Notice></div></Card>
    <Card title="3  Recommended Methods" className="de1-recommendations"><p>Recommendations come from the selected features.</p>{ranked.slice(0, showMore ? 6 : 3).map((item, index) => <article key={item.id} className={selected === item.id ? "de1-recommendation selected" : "de1-recommendation"}><button type="button" onClick={() => setSelected(item.id)}><span className="de1-rank">{index + 1}</span><span><b>{item.label}</b><small>{item.hint}</small></span><strong>{item.score}% match</strong></button><div className="de1-confidence"><i style={{ width: `${item.score}%` }} /></div>{selected === item.id && <><h4>Why this method fits</h4><p>{features[item.id] ? `The selected ${item.label.toLowerCase()} feature matches this method's defining form.` : "This is a fallback path. Verify its defining form before using it."}</p><Link to={`/differential-equations/${methodRoutes[item.id]}`}>Open the {item.label} lab <ArrowRight size={14} /></Link></>}</article>)}<button type="button" className="de1-secondary de1-full" onClick={() => setShowMore((value) => !value)}>{showMore ? "Show Fewer Methods" : "Show More Methods"}</button></Card></div>
  </div>;
}

const fieldExamples = [
  { label: "y − x", value: "y-x" }, { label: "x + y", value: "x+y" }, { label: "xy", value: "x*y" },
  { label: "sin(x) − y", value: "sin(x)-y" }, { label: "y(1 − y)", value: "y*(1-y)" },
];
export function DirectionFieldsPhase1() {
  const [expression, setExpression] = useState("y-x");
  const [points, setPoints] = useState<Point[]>([{ x: -2, y: 1 }, { x: 1.5, y: -1 }]);
  const [density, setDensity] = useState(20);
  const [showField, setShowField] = useState(true);
  const [showSolutions, setShowSolutions] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showNullcline, setShowNullcline] = useState(true);
  const [inspector, setInspector] = useState<Point>({ x: 0.83, y: 0.42 });
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => setProgress((value) => {
      if (value >= 1) { setPlaying(false); return 1; }
      return Math.min(1, value + 0.0125);
    }), 50);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);
  const compiled = useMemo(() => compileSlope(expression), [expression]);
  const field = compiled.fn ?? (() => Number.NaN);
  const solutionCurves = useMemo(() => compiled.fn ? points.map((point, index) => ({ label: `Solution ${index + 1}`, color: [blue, orange, violet, green][index % 4], points: rk4Curve(compiled.fn!, point, baseBounds) })) : [], [compiled, points]);
  const currentX = baseBounds.xMin + progress * (baseBounds.xMax - baseBounds.xMin);
  const values = solutionCurves.map((curve) => solutionValueAt(curve.points, currentX));
  const earlierValues = solutionCurves.map((curve) => solutionValueAt(curve.points, Math.max(baseBounds.xMin, currentX - 0.25)));
  const gap = values.length >= 2 && values[0] !== null && values[1] !== null ? Math.abs(values[0] - values[1]) : null;
  const earlierGap = earlierValues.length >= 2 && earlierValues[0] !== null && earlierValues[1] !== null ? Math.abs(earlierValues[0] - earlierValues[1]) : null;
  const gapTrend = gap === null || earlierGap === null ? "not yet comparable" : gap < earlierGap - 0.01 ? "converging" : gap > earlierGap + 0.01 ? "separating" : "nearly steady";
  const series: GraphSeries[] = showSolutions ? solutionCurves.map((curve) => ({ ...curve, points: curve.points.filter((point) => point.x <= currentX) })) : [];
  if (showNullcline && compiled.fn) {
    const nullcline = normalizeEquation(expression) === "y-x"
      ? sampleCurve((x) => x, -3.5, 3.5)
      : contourSegments(field, 0, 42).flatMap((segment) => [{ x: segment[0], y: segment[1] }, { x: segment[2], y: segment[3] }, { x: Number.NaN, y: Number.NaN }]);
    series.push({ label: "Nullcline f(x,y) = 0", color: green, dashed: true, points: nullcline });
  }
  return <div className="de1-page"><div className="de1-three-col de1-direction-layout"><div className="de1-stack"><Card title="Differential Equation" icon={Activity}><label className="de1-field">Slope rule dy/dx =<input aria-label="Slope rule" value={expression} onChange={(event) => setExpression(event.target.value)} /></label><ExampleChips items={fieldExamples} onSelect={setExpression} />{compiled.error && <p className="de1-error" role="alert">{compiled.error}</p>}</Card><Card title="Initial Conditions" icon={Target}>{points.map((point, index) => <div className="de1-point-row" key={index}><span style={{ background: [blue, orange, violet, green][index % 4] }} /><label>x<input aria-label={`Initial point ${index + 1} x`} type="number" step="0.1" value={Number(point.x.toFixed(2))} onChange={(event) => setPoints(points.map((old, i) => i === index ? { ...old, x: Number(event.target.value) } : old))} /></label><label>y<input aria-label={`Initial point ${index + 1} y`} type="number" step="0.1" value={Number(point.y.toFixed(2))} onChange={(event) => setPoints(points.map((old, i) => i === index ? { ...old, y: Number(event.target.value) } : old))} /></label><button type="button" aria-label={`Remove initial point ${index + 1}`} onClick={() => setPoints(points.filter((_, i) => i !== index))}><Trash2 size={14} /></button></div>)}<button type="button" className="de1-secondary" onClick={() => setPoints([...points, { x: 0, y: 0 }])}><Plus size={15} /> Add Initial Point</button></Card><Card title="Animate solution family" icon={Activity}><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}><button type="button" className="de1-primary" onClick={() => { if (reducedMotion) { setProgress(1); return; } if (progress >= 1) setProgress(0); setPlaying(!playing); }}>{playing ? "Pause" : "Play together"}</button><button type="button" className="de1-secondary" onClick={() => { setPlaying(false); setProgress(0); }}>Restart</button></div><Slider label="Shared x position (%)" value={Math.round(progress * 100)} min={0} max={100} step={1} onChange={(value) => { setPlaying(false); setProgress(value / 100); }} /><p>All colored paths advance to the same x value. You can also drag the slider to inspect one moment.</p></Card><Card title="Display Options"><CheckBox label="Show slope field" checked={showField} onChange={setShowField} /><CheckBox label="Show solution curves" checked={showSolutions} onChange={setShowSolutions} /><CheckBox label="Show axes" checked={showAxes} onChange={setShowAxes} /><CheckBox label="Show nullclines" checked={showNullcline} onChange={setShowNullcline} /><CheckBox label="Show grid" checked={showGrid} onChange={setShowGrid} /><Slider label="Field Density" value={density} min={10} max={30} step={2} onChange={setDensity} /></Card></div>
    <div className="de1-stack"><Card title="Interactive Canvas" icon={Sparkles} className="de1-graph-card"><Phase1Graph bounds={baseBounds} series={series} field={field} density={density} points={points} markers={showSolutions ? values.flatMap((value, index) => value === null || Math.abs(value) > baseBounds.yMax ? [] : [{ x: currentX, y: value, color: solutionCurves[index]!.color, label: `S${index + 1}` }]) : []} onPointChange={(index, point) => setPoints(points.map((old, i) => i === index ? point : old))} onInspect={setInspector} showField={showField} showAxes={showAxes} showGrid={showGrid} label="Draggable initial conditions on a direction field" /><Notice>Drag the colored points to change the solution curves. Drag empty space to pan.</Notice></Card><Card title="Quick Examples"><ExampleChips items={fieldExamples} onSelect={setExpression} /></Card></div>
    <div className="de1-stack"><Card title="How Direction Fields Work" icon={Lightbulb}><p>A short line at each point shows the slope f(x,y). Solution curves follow the local directions.</p><blockquote>“A slope field is a map of all possible solution directions.”</blockquote></Card><Card title="Live Inspector" icon={Target}><dl className="de1-metrics"><div><dt>Point (x, y)</dt><dd>({fmt(inspector.x)}, {fmt(inspector.y)})</dd></div><div><dt>Slope dy/dx</dt><dd>{fmt(field(inspector.x, inspector.y), 3)}</dd></div><div><dt>Direction</dt><dd>{field(inspector.x, inspector.y) > 0 ? "Rising" : field(inspector.x, inspector.y) < 0 ? "Falling" : "Horizontal"}</dd></div></dl></Card><Card title="Curve comparison" icon={GitBranch}><p>At x = {fmt(currentX, 2)}, compare paths at the same horizontal position.</p><dl className="de1-metrics">{values.map((value, index) => <div key={index}><dt style={{ color: solutionCurves[index]!.color }}>Solution {index + 1}</dt><dd>{value === null ? "Outside interval" : fmt(value, 3)}</dd></div>)}{values.length >= 2 && values[0] !== null && values[1] !== null ? <div><dt>Gap between 1 and 2</dt><dd>{fmt(gap!, 3)} · {gapTrend}</dd></div> : null}</dl></Card><Card title="Try This"><ul><li>Drag an initial point and watch its curve update.</li><li>Increase density to see more detail.</li><li>Toggle nullclines to find where dy/dx = 0.</li></ul></Card></div></div></div>;
}

const ivpExamples = [{ label: "y′ = x − y", value: "x-y" }, { label: "y′ = y(1 − y)", value: "y*(1-y)" }, { label: "y′ = sin(x)", value: "sin(x)" }, { label: "y′ = x²", value: "x^2" }];
export function InitialValuePhase1() {
  const [expression, setExpression] = useState("x-y");
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(1);
  const [steps, setSteps] = useState(50);
  const [density, setDensity] = useState(20);
  const [showField, setShowField] = useState(true);
  const [showSolution, setShowSolution] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showAnalytic, setShowAnalytic] = useState(true);
  const [showNumerical, setShowNumerical] = useState(true);
  const compiled = useMemo(() => compileSlope(expression), [expression]);
  const field = compiled.fn ?? (() => Number.NaN);
  const exactKnown = normalizeEquation(expression) === "x-y";
  const analytic = (x: number) => x - 1 + (y0 - x0 + 1) * Math.exp(x0 - x);
  const numerical = compiled.fn ? rk4Curve(field, { x: x0, y: y0 }, baseBounds, steps * 4) : [];
  const series: GraphSeries[] = [];
  if (showSolution && showAnalytic && exactKnown) series.push({ label: "Analytical solution", color: blue, points: sampleCurve(analytic, -3.5, 3.5) });
  if (showSolution && showNumerical && compiled.fn) series.push({ label: "Numerical solution (RK4)", color: violet, dashed: exactKnown, points: numerical });
  const sampleX = 2;
  const approximate = numerical.reduce((best, point) => Math.abs(point.x - sampleX) < Math.abs(best.x - sampleX) ? point : best, numerical[0] ?? { x: sampleX, y: Number.NaN });
  const error = exactKnown ? Math.abs(approximate.y - analytic(approximate.x)) : Number.NaN;
  const errorText = Number.isFinite(error) && error < 1e-4 ? error.toExponential(2) : fmt(error, 6);
  const reset = () => { setExpression("x-y"); setX0(0); setY0(1); setSteps(50); setDensity(20); setShowField(true); setShowSolution(true); };
  return <div className="de1-page de1-three-col de1-ivp-layout"><div className="de1-stack"><Card title="1. Define the Differential Equation"><p>Enter a first-order differential equation y′ = f(x,y).</p><input aria-label="Initial value slope rule" value={expression} onChange={(event) => setExpression(event.target.value)} /><ExampleChips items={ivpExamples} onSelect={setExpression} />{compiled.error && <p role="alert" className="de1-error">{compiled.error}</p>}</Card><Card title="2. Set the Initial Condition"><p>Specify the point (x₀,y₀) for the unique solution.</p><div className="de1-pair"><label>x₀<input type="number" step="0.1" value={x0} onChange={(event) => setX0(Number(event.target.value))} /></label><label>y₀<input type="number" step="0.1" value={y0} onChange={(event) => setY0(Number(event.target.value))} /></label></div></Card><Card title="3. Adjust Parameters"><Slider label="Numerical steps" value={steps} min={10} max={160} step={10} onChange={setSteps} /></Card><Card title="4. Visualization Options"><CheckBox label="Show slope field" checked={showField} onChange={setShowField} /><CheckBox label="Show solution curve" checked={showSolution} onChange={setShowSolution} /><CheckBox label="Show grid" checked={showGrid} onChange={setShowGrid} /><Slider label="Field density" value={density} min={10} max={30} step={2} onChange={setDensity} /><button type="button" className="de1-primary de1-full" onClick={reset}><RotateCcw size={16} /> Reset</button></Card></div>
  <div className="de1-stack"><Card title="Solution Visualization" icon={Activity} className="de1-graph-card"><Phase1Graph bounds={baseBounds} series={series} field={field} density={density} showField={showField} showGrid={showGrid} points={[{ x: x0, y: y0 }]} onPointChange={(_, point) => { setX0(Number(point.x.toFixed(2))); setY0(Number(point.y.toFixed(2))); }} label="Initial value solution graph with draggable point" /><Notice>Drag the initial point to select a new solution curve.</Notice></Card><Card title="Key Takeaway" icon={BookOpen}><p>An initial condition selects one curve from a family. The point ({fmt(x0)}, {fmt(y0)}) fixes the integration constant.</p></Card></div>
  <div className="de1-stack"><Card title="Existence and Uniqueness" icon={Check}><p>When f(x,y) and ∂f/∂y are continuous near ({fmt(x0)}, {fmt(y0)}), one local solution passes through that point.</p><Notice good>{Number.isFinite(field(x0, y0)) ? "The current slope rule is defined at the initial point." : "The slope rule is not defined at this initial point."}</Notice></Card><Card title="Analytical vs. Numerical Solution"><CheckBox label="Analytical solution" checked={showAnalytic} onChange={setShowAnalytic} /><CheckBox label="Numerical solution (RK4)" checked={showNumerical} onChange={setShowNumerical} /><Slider label="Steps" value={steps} min={10} max={160} step={10} onChange={setSteps} /><Notice good>{exactKnown ? `Maximum sample difference: ${errorText}` : "An analytical formula is shown for the x − y example. RK4 explores other rules numerically."}</Notice></Card><Card title="Step-by-Step Solution"><Steps steps={exactKnown ? [{ title: "Solve the differential equation", formula: "y'+y=x", detail: "Use the integrating factor e^x." }, { title: "Apply the initial condition", formula: `C=(${fmt(y0)}-${fmt(x0)}+1)e^{${fmt(x0)}}` }, { title: "Write the unique solution", formula: "y=x-1+Ce^{-x}" }, { title: "Verify the solution", formula: "y'+y=x" }] : [{ title: "Evaluate the slope", formula: `y'=f(${fmt(x0)},${fmt(y0)})=${fmt(field(x0, y0))}` }, { title: "Integrate numerically", formula: "y_{n+1}=y_n+\\frac{h}{6}(k_1+2k_2+2k_3+k_4)" }]} /></Card></div></div>;
}

const separableCases = [
  { label: "y′ = xy", equation: "x*y", form: "x\\cdot y", separate: "\\frac{1}{y}\\,dy=x\\,dx", integrate: "\\ln|y|=\\frac{x^2}{2}+C", solution: "y=Ce^{x^2/2}", fn: (x: number, c: number) => c * Math.exp(x * x / 2) },
  { label: "y′ = x(1+y²)", equation: "x*(1+y^2)", form: "x(1+y^2)", separate: "\\frac{dy}{1+y^2}=x\\,dx", integrate: "\\arctan(y)=\\frac{x^2}{2}+C", solution: "y=\\tan(x^2/2+C)", fn: (x: number, c: number) => Math.tan(x * x / 2 + c) },
  { label: "y′ = (1+x²)(1−y)", equation: "(1+x^2)*(1-y)", form: "(1+x^2)(1-y)", separate: "\\frac{dy}{1-y}=(1+x^2)\\,dx", integrate: "-\\ln|1-y|=x+\\frac{x^3}{3}+C", solution: "y=1-Ce^{-x-x^3/3}", fn: (x: number, c: number) => 1 - c * Math.exp(-x - x ** 3 / 3) },
  { label: "y′ = y/x", equation: "y/x", form: "y/x", separate: "\\frac{dy}{y}=\\frac{dx}{x}", integrate: "\\ln|y|=\\ln|x|+C", solution: "y=Cx\\quad(x\\ne 0)", fn: (x: number, c: number) => x === 0 ? Number.NaN : c * x },
];
export function SeparablePhase1() {
  const [equation, setEquation] = useState(separableCases[0].equation);
  const [constant, setConstant] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [reveal, setReveal] = useState(true);
  const selected = separableCases.find((item) => normalizeEquation(item.equation) === normalizeEquation(equation));
  const compiled = useMemo(() => compileSlope(equation), [equation]);
  const series: GraphSeries[] = selected ? [-2, -1, -0.5, 0.5, 1, 2].map((c, index) => ({ label: `C = ${fmt(c, 1)}`, color: ["#ed5b3b", orange, "#a577ed", "#60a5fa", blue, violet][index], points: sampleCurve((x) => selected.fn(x, c), -3, 3) })) : compiled.fn ? [constant - 0.5, constant, constant + 0.5].map((y0, index) => ({ label: `y(0) = ${fmt(y0, 1)}`, color: [orange, blue, violet][index], points: rk4Curve(compiled.fn!, { x: 0, y: y0 }, { xMin: -3, xMax: 3, yMin: -6, yMax: 6 }) })) : [];
  const steps = selected ? [
    { title: "Identify the form", formula: `\\frac{dy}{dx}=${selected.form}`, detail: "Write the right side as a product of an x function and a y function." },
    { title: "Separate variables", formula: selected.separate, detail: "Move all y terms with dy and all x terms with dx." },
    { title: "Integrate both sides", formula: `\\int ${selected.separate.replace("=", "=\\int ")}` },
    { title: "Evaluate the integrals", formula: selected.integrate },
    { title: "Solve for y", formula: selected.solution },
  ] : [{ title: "Inspect the form", formula: `y'=${equation}`, detail: "The numerical family is plotted. Choose a supported example for verified symbolic steps." }];
  return <div className="de1-page"><div className="de1-lead-strip"><span><Sparkles /> Interactive Solver<small>See each step unfold</small></span><span><Activity /> Visual Learning<small>Graphs and intuition</small></span><span><BookOpen /> Worked Examples<small>Learn from curated problems</small></span></div><Card title="Enter a Differential Equation" className="de1-equation-banner"><div className="de1-equation-row"><input aria-label="Separable equation" value={equation} onChange={(event) => setEquation(event.target.value)} /><button className="de1-primary" type="button" onClick={() => setReveal(true)}>Solve Step by Step <ArrowRight size={16} /></button></div><ExampleChips items={separableCases.map((item) => ({ label: item.label, value: item.equation }))} onSelect={(value) => { setEquation(value); setReveal(true); }} />{compiled.error && <p className="de1-error" role="alert">{compiled.error}</p>}</Card><div className="de1-two-col de1-separable-layout"><Card title="Step-by-Step Solution">{reveal ? <Steps steps={steps} /> : <Notice>Choose an example or press Solve Step by Step.</Notice>}<div className="de1-pair"><Card title="Left Side Integral (y)"><Formula value={selected?.separate.split("=")[0] ?? "\\int dy/h(y)"} /></Card><Card title="Right Side Integral (x)"><Formula value={selected?.separate.split("=")[1] ?? "\\int g(x)dx"} /></Card></div></Card><div className="de1-stack"><Card title="Family of Solutions" className="de1-graph-card"><Slider label="Highlight constant C" value={constant} min={-2} max={2} step={0.1} onChange={setConstant} /><Phase1Graph bounds={{ xMin: -3, xMax: 3, yMin: -6, yMax: 6 }} series={[...series, ...(selected ? [{ label: `Selected C = ${fmt(constant, 1)}`, color: green, points: sampleCurve((x) => selected.fn(x, constant), -3, 3) }] : [])]} showAxes={showAxes} showGrid={showGrid} showLegend={showLegend} label="Separable solution family" /><div className="de1-inline-options"><CheckBox label="Show axes" checked={showAxes} onChange={setShowAxes} /><CheckBox label="Show grid" checked={showGrid} onChange={setShowGrid} /><CheckBox label="Show legend" checked={showLegend} onChange={setShowLegend} /></div></Card><Card title="Solution"><div className="de1-result"><Formula value={selected?.solution ?? "\\text{Symbolic solution not verified for this input}"} display /></div><p>{selected ? "C is an arbitrary constant; adjust it to select a family member." : "The graph is a numerical family through selected initial values."}</p></Card></div></div><Card title="Worked Examples"><ExampleChips items={separableCases.map((item) => ({ label: item.label, value: item.equation }))} onSelect={setEquation} /></Card></div>;
}

export function HomogeneousPhase1() {
  const [equation, setEquation] = useState(homogeneousPresets[0].label.replace(/^dy\/dx\s*=\s*/, ""));
  const [substitution, setSubstitution] = useState<"y = vx" | "x = vy">("y = vx");
  const [constant, setConstant] = useState(1);
  const [scale, setScale] = useState(2);
  const preset = homogeneousPresets.find((item) => normalizeEquation(item.label.replace(/^dy\/dx\s*=\s*/, "")) === normalizeEquation(equation));
  const compiled = useMemo(() => compileSlope(equation), [equation]);
  const field = compiled.fn ?? (() => Number.NaN);
  const testAt = { x: 1.3, y: 0.4 };
  const original = field(testAt.x, testAt.y);
  const scaled = field(scale * testAt.x, scale * testAt.y);
  const homogeneous = compiled.fn !== null && Number.isFinite(original) && Number.isFinite(scaled) && Math.abs(original - scaled) < 1e-4;
  const series: GraphSeries[] = compiled.fn ? [-2, -1, -0.5, 0, 0.5, 1, 2].map((c, index) => ({ label: `y(1) = ${fmt(c, 1)}`, color: [blue, "#6b8bf9", violet, "#d24fd5", orange, green, "#32a8ce"][index], points: rk4Curve(field, { x: 1, y: c }, baseBounds) })) : [];
  const selectedCurve = compiled.fn ? rk4Curve(field, { x: 1, y: constant }, baseBounds) : [];
  const guidedSteps = substitution === "y = vx"
    ? preset?.steps ?? ["Choose a supported example to see verified symbolic substitutions."]
    : [
      "Set x = vy and treat x as a function of y.",
      "Differentiate: dx/dy = v + y dv/dy.",
      "Invert the original slope where it is nonzero: dx/dy = 1/f(x,y).",
      "Substitute x = vy and simplify to an equation in v and y.",
      "Separate, integrate, then replace v by x/y.",
    ];
  return <div className="de1-page"><div className="de1-lead-strip"><span><Search /> Interactive Solver<small>Work through examples</small></span><span><GitBranch /> Step-by-Step Guidance<small>See each transformation</small></span><span><Activity /> Graph Solutions<small>Visualize families</small></span></div><div className="de1-three-col de1-hom-top"><Card title="Equation Input"><ExampleChips items={homogeneousPresets.map((item) => ({ label: item.label, value: item.label.replace(/^dy\/dx\s*=\s*/, "") }))} onSelect={setEquation} /><div className="de1-equation-row"><input aria-label="Homogeneous slope rule" value={equation} onChange={(event) => setEquation(event.target.value)} /><button className="de1-primary" type="button" onClick={() => document.getElementById("de1-hom-steps")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Solve</button></div>{compiled.error && <p className="de1-error" role="alert">{compiled.error}</p>}</Card><Card title="Homogeneous Form Check"><div className={`de1-result${homogeneous ? "" : " is-warn"}`}><strong>{homogeneous ? "This equation is homogeneous" : "Scale invariance was not confirmed"}</strong><p>f({fmt(scale)}x,{fmt(scale)}y) = {fmt(scaled, 4)}; f(x,y) = {fmt(original, 4)} at ({testAt.x}, {testAt.y}).</p></div><Slider label="Scale t" value={scale} min={0.5} max={4} step={0.1} onChange={setScale} /></Card><Card title="Substitution Method"><div className="de1-segmented">{(["y = vx", "x = vy"] as const).map((item) => <button key={item} type="button" aria-pressed={substitution === item} onClick={() => setSubstitution(item)}>{item}</button>)}</div><div className="de1-result"><Formula value={substitution === "y = vx" ? "y=vx,\\quad y'=v+xv'" : "x=vy,\\quad dx/dy=v+yv'"} display /></div><p>{substitution === "y = vx" ? "Replace y/x by v to obtain an equation for v and x." : "Replace x/y by v and work with x as a function of y."}</p></Card></div><div className="de1-two-col de1-hom-main"><Card title="Step-by-Step Solution" className="de1-hom-steps" ><div id="de1-hom-steps"><Steps steps={guidedSteps.map((line, index) => ({ title: ["Recognize homogeneous form", "Use the substitution", "Substitute and simplify", "Separate variables", "Integrate", "Solution (implicit form)"][index] ?? `Step ${index + 1}`, detail: line }))} /></div></Card><div className="de1-stack"><Card title="Solution (Simplified Form)"><div className="de1-result"><Formula value={preset?.closedForm ?? "\\text{Use numerical solution curves for this input}"} display /></div></Card><Card title="Solution Curves" className="de1-graph-card"><Slider label="Select y(1)" value={constant} min={-3} max={3} step={0.1} onChange={setConstant} /><Phase1Graph bounds={baseBounds} series={[...series, { label: `Selected y(1) = ${fmt(constant, 1)}`, color: "#0f766e", points: selectedCurve }]} label="Homogeneous solution family" /><Notice>For a homogeneous rule, slopes depend on a ratio such as y/x.</Notice></Card></div></div><div className="de1-two-col"><Card title="Key Insight"><p>Scale invariance means f(tx,ty)=f(x,y). That is why the ratio substitution works.</p></Card><Card title="More Examples"><ExampleChips items={homogeneousPresets.map((item) => ({ label: item.label, value: item.label.replace(/^dy\/dx\s*=\s*/, "") }))} onSelect={setEquation} /></Card></div></div>;
}

export function ExactPhase1() {
  const [m, setM] = useState("2*x*y");
  const [n, setN] = useState("x^2");
  const [level, setLevel] = useState(2);
  const [showLevels, setShowLevels] = useState(true);
  const [showField, setShowField] = useState(false);
  const [selected, setSelected] = useState("mockup");
  const mCompiled = useMemo(() => compileSlope(m), [m]);
  const nCompiled = useMemo(() => compileSlope(n), [n]);
  const partial = (fn: (x: number, y: number) => number, x: number, y: number, dx: number, dy: number) => (fn(x + dx, y + dy) - fn(x - dx, y - dy)) / (2 * Math.max(Math.abs(dx), Math.abs(dy)));
  const samples = [{ x: 0.7, y: 0.4 }, { x: -0.8, y: 1.2 }, { x: 1.3, y: -0.6 }];
  const differences = mCompiled.fn && nCompiled.fn ? samples.map(({ x, y }) => partial(mCompiled.fn!, x, y, 0, 1e-4) - partial(nCompiled.fn!, x, y, 1e-4, 0)) : [];
  const exact = differences.length > 0 && differences.every((value) => Number.isFinite(value) && Math.abs(value) < 1e-3);
  const knownPotential = normalizeEquation(m) === "2xy" && normalizeEquation(n) === "x^2" ? (x: number, y: number) => x * x * y : exactPresets.find((item) => normalizeEquation(item.m) === normalizeEquation(m) && normalizeEquation(item.n) === normalizeEquation(n))?.field;
  const knownFormula = normalizeEquation(m) === "2xy" && normalizeEquation(n) === "x^2" ? "x^2y=C" : exactPresets.find((item) => normalizeEquation(item.m) === normalizeEquation(m) && normalizeEquation(item.n) === normalizeEquation(n))?.potential;
  const levels = showLevels && exact && knownPotential ? [-2, -1, -0.5, 0.5, 1, 2].map((c, i) => ({ label: `C = ${fmt(c)}`, color: [violet, blue, "#48a0ec", "#ff6384", orange, green][i], segments: contourSegments(knownPotential, c * level, 55) })) : [];
  const series: GraphSeries[] = levels.flatMap((entry) => entry.segments.map((segment, i) => ({ label: `${entry.label} ${i}`, color: entry.color, points: [{ x: segment[0], y: segment[1] }, { x: segment[2], y: segment[3] }] })));
  const load = (key: string) => { setSelected(key); if (key === "mockup") { setM("2*x*y"); setN("x^2"); } else { const preset = exactPresets.find((item) => item.id === key); if (preset) { setM(preset.m); setN(preset.n); } } };
  return <div className="de1-page"><div className="de1-tabs">{["Solve", "Examples", "Visualize", "Theory"].map((tab) => <button key={tab} type="button" aria-pressed={selected === tab} onClick={() => setSelected(tab)}>{tab}</button>)}</div><div className="de1-two-col"><Card title="Input Differential Equation"><p>Enter an equation in the form M(x,y)dx + N(x,y)dy = 0.</p><div className="de1-exact-input"><label>M(x,y)<input aria-label="M of x and y" value={m} onChange={(event) => setM(event.target.value)} /></label><span>dx +</span><label>N(x,y)<input aria-label="N of x and y" value={n} onChange={(event) => setN(event.target.value)} /></label><span>dy = 0</span></div><ExampleChips items={[{ label: "2xy dx + x² dy", value: "mockup" }, ...exactPresets.map((item) => ({ label: item.label, value: item.id }))]} onSelect={load} />{mCompiled.error || nCompiled.error ? <p role="alert" className="de1-error">{mCompiled.error || nCompiled.error}</p> : null}</Card><Card title="Exactness Test"><div className="de1-test-row"><div><Formula value="\frac{\partial M}{\partial y}" /><strong>{mCompiled.fn ? fmt(partial(mCompiled.fn, 1, 1, 0, 1e-4), 3) : "—"}</strong></div><span>{exact ? "=" : "≠"}</span><div><Formula value="\frac{\partial N}{\partial x}" /><strong>{nCompiled.fn ? fmt(partial(nCompiled.fn, 1, 1, 1e-4, 0), 3) : "—"}</strong></div><div className={`de1-result${exact ? "" : " is-warn"}`}><b>{exact ? (knownFormula ? "Exact" : "Numerically consistent") : "Not exact"}</b><p>{exact ? "The sampled partial derivatives agree." : "The partial derivatives differ, or the input is invalid. Check the equation or seek an integrating factor."}</p></div></div></Card></div><div className="de1-two-col"><div className="de1-stack"><Card title="Potential Function"><p>Find F(x,y) so that dF = Mdx + Ndy.</p><div className="de1-result"><Formula value={exact && knownFormula ? `F(x,y)=${knownFormula.replace(/=C$/, "")}` : "\\text{Potential not derived for this input}"} display /></div></Card><Card title="Step-by-Step Solution"><Steps steps={exact && knownFormula ? [{ title: "Verify exactness", formula: "M_y=N_x" }, { title: "Integrate M with respect to x", formula: "F(x,y)=\\int M(x,y)\\,dx+g(y)" }, { title: "Determine g(y)", formula: "F_y=N(x,y)" }, { title: "Write the implicit solution", formula: knownFormula }] : [{ title: "Test the partial derivatives", formula: "M_y\\stackrel{?}{=}N_x", detail: "An implicit potential solution requires exactness." }]} /></Card></div><div className="de1-stack"><Card title="Solution"><div className={`de1-result${knownFormula ? "" : " is-warn"}`}><Formula value={exact && knownFormula ? knownFormula : "\\text{No verified symbolic solution}"} display /></div></Card><Card title="Solution Family" className="de1-graph-card"><Slider label="Level scale C" value={level} min={0.5} max={4} step={0.1} onChange={setLevel} /><Phase1Graph bounds={{ xMin: -2.5, xMax: 2.5, yMin: -2.5, yMax: 2.5 }} series={series} showLegend={false} showField={showField && Boolean(mCompiled.fn && nCompiled.fn)} field={mCompiled.fn && nCompiled.fn ? (x, y) => -mCompiled.fn!(x, y) / nCompiled.fn!(x, y) : undefined} label="Potential level curves" /><div className="de1-inline-options"><CheckBox label="Show level curves" checked={showLevels} onChange={setShowLevels} /><CheckBox label="Show slope field" checked={showField} onChange={setShowField} /></div>{exact && !knownPotential && <Notice>Exactness is numerically supported, but a symbolic potential has not been derived for these inputs.</Notice>}</Card></div></div></div>;
}

const linearExamples = [
  { label: "y′ + xy = sin(x)", p: "x", q: "sin(x)" },
  { label: "y′ + 2y = eˣ", p: "2", q: "exp(x)" },
  { label: "y′ + y = x", p: "1", q: "x" },
  { label: "y′ + y = sin(x)", p: "1", q: "sin(x)" },
];
export function LinearFirstOrderPhase1() {
  const [pText, setPText] = useState("x");
  const [qText, setQText] = useState("sin(x)");
  const [constant, setConstant] = useState(0.5);
  const [showSolution, setShowSolution] = useState(true);
  const [showForcing, setShowForcing] = useState(true);
  const [showField, setShowField] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [understanding, setUnderstanding] = useState<"Key Ideas" | "Behavior" | "Examples">("Key Ideas");
  const p = useMemo(() => { try { const fn = compileFunctionExpression(pText); fn(0.4); return { fn, error: "" }; } catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid P(x)" }; } }, [pText]);
  const q = useMemo(() => { try { const fn = compileFunctionExpression(qText); fn(0.4); return { fn, error: "" }; } catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid Q(x)" }; } }, [qText]);
  const field = (x: number, y: number) => q.fn && p.fn ? q.fn(x) - p.fn(x) * y : Number.NaN;
  const known = linearPresets.find((item) => normalizeEquation(item.p) === normalizeEquation(pText) && normalizeEquation(item.q) === normalizeEquation(qText));
  const bounds = { xMin: -6, xMax: 6, yMin: -3, yMax: 3 };
  const series: GraphSeries[] = [];
  if (showSolution && p.fn && q.fn) series.push({ label: "Solution y(x)", color: blue, points: rk4Curve(field, { x: 0, y: constant }, bounds, 900) });
  if (showForcing && q.fn) series.push({ label: "Forcing Q(x)", color: orange, dashed: true, points: sampleCurve(q.fn, -6, 6) });
  const load = (item: typeof linearExamples[number]) => { setPText(item.p); setQText(item.q); };
  const standard = `y'+(${pText})y=${qText}`;
  return <div className="de1-page"><div className="de1-lead-strip"><span><BookOpen /> Standard Form<small>y′ + P(x)y = Q(x)</small></span><span><Sparkles /> Integrating Factor<small>μ(x) = e^(∫Pdx)</small></span><span><Target /> Explicit Solution<small>One constant C selects a curve</small></span></div><div className="de1-two-col de1-linear-layout"><div className="de1-stack"><Card title="Equation Input"><p>Enter a first-order linear differential equation in standard form.</p><div className="de1-linear-input"><span>y′ +</span><input aria-label="P of x" value={pText} onChange={(event) => setPText(event.target.value)} /><span>y =</span><input aria-label="Q of x" value={qText} onChange={(event) => setQText(event.target.value)} /></div><p className="de1-muted">P(x) and Q(x) accept sin, cos, exp, powers, and arithmetic.</p><div className="de1-chips">{linearExamples.map((item) => <button key={item.label} type="button" onClick={() => load(item)}>{item.label}</button>)}</div>{p.error || q.error ? <p className="de1-error" role="alert">{p.error || q.error}</p> : null}</Card><Card title="Step-by-Step Solution"><CheckBox label="Show all steps" checked={showSteps} onChange={setShowSteps} />{showSteps ? <Steps steps={[{ title: "Standard Form", formula: standard }, { title: "Integrating Factor", formula: known?.integratingFactor ?? "\\mu(x)=e^{\\int P(x)\\,dx}" }, { title: "Multiply Through", formula: "\\frac{d}{dx}(\\mu y)=\\mu Q" }, { title: "Integrate", formula: "\\mu y=\\int\\mu Q\\,dx+C" }, { title: "Explicit Solution", formula: "y=\\frac{1}{\\mu(x)}\\left(\\int\\mu(x)Q(x)\\,dx+C\\right)" }]} /> : <Notice>The steps are hidden. Toggle them to inspect the derivation.</Notice>}</Card></div><div className="de1-stack"><Card title="Solution and Forcing Term" className="de1-graph-card"><div className="de1-inline-options"><CheckBox label="Solution" checked={showSolution} onChange={setShowSolution} /><CheckBox label="Forcing Q(x)" checked={showForcing} onChange={setShowForcing} /><CheckBox label="Slope field" checked={showField} onChange={setShowField} /></div><Phase1Graph bounds={bounds} series={series} field={field} showField={showField} label="Linear solution and forcing term" /><Slider label="Constant C = y(0)" value={constant} min={-3} max={3} step={0.1} onChange={setConstant} /><div className="de1-chips">{[-1, 0, 1].map((value) => <button key={value} type="button" onClick={() => setConstant(value)}>C = {value}</button>)}</div></Card><Card title="Symbolic Solution"><p>General solution:</p><div className="de1-result"><Formula value="y(x)=\frac{1}{\mu(x)}\left(\int\mu(x)Q(x)\,dx+C\right)" display /></div>{known && <p>For the matching preset: {known.steps.at(-1)}</p>}<p>With initial condition y(0) = {fmt(constant)} the numerical curve is shown above.</p></Card><div className="de1-two-col"><Card title="Numerical Exploration"><Slider label="Initial value y(0)" value={constant} min={-3} max={3} step={0.1} onChange={setConstant} /><p>Changing C selects a different solution of the same ODE.</p></Card><Card title="Understanding"><div className="de1-segmented">{(["Key Ideas", "Behavior", "Examples"] as const).map((item) => <button key={item} type="button" aria-pressed={understanding === item} onClick={() => setUnderstanding(item)}>{item}</button>)}</div><p>{understanding === "Key Ideas" ? "The integrating factor turns the left side into a product derivative." : understanding === "Behavior" ? "The coefficient P(x) controls decay or growth while Q(x) acts as forcing." : "Choose a preset to compare a different coefficient or forcing term."}</p></Card></div></div></div><Card title="Try These Examples"><div className="de1-chips">{linearExamples.map((item) => <button key={item.label} type="button" onClick={() => load(item)}>{item.label}</button>)}</div></Card></div>;
}

const bernoulliExamples = [
  { label: "y′ + 2xy = xy²", p: "2*x", q: "x", n: 2 },
  { label: "y′ + xy = y²", p: "x", q: "1", n: 2 },
  { label: "y′ + 3y = eˣy³", p: "3", q: "exp(x)", n: 3 },
  { label: "y′ + y = y", p: "1", q: "1", n: 1 },
];
export function BernoulliPhase1() {
  const [pText, setPText] = useState("2*x");
  const [qText, setQText] = useState("x");
  const [n, setN] = useState(2);
  const [y0, setY0] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const p = useMemo(() => { try { const fn = compileFunctionExpression(pText); fn(0.3); return { fn, error: "" }; } catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid P(x)" }; } }, [pText]);
  const q = useMemo(() => { try { const fn = compileFunctionExpression(qText); fn(0.3); return { fn, error: "" }; } catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid Q(x)" }; } }, [qText]);
  const bounds = { xMin: -2, xMax: 4, yMin: -2, yMax: 5 };
  const series: GraphSeries[] = p.fn && q.fn ? [-1, 0, 1, 2, 3].map((power, index) => ({ label: `n = ${power}`, color: [blue, green, orange, violet, "#e7417e"][index], points: rk4Curve((x, y) => q.fn!(x) * y ** power - p.fn!(x) * y, { x: 0, y: y0 }, bounds) })) : [];
  const current = p.fn && q.fn ? rk4Curve((x, y) => q.fn!(x) * y ** n - p.fn!(x) * y, { x: 0, y: y0 }, bounds) : [];
  const load = (item: typeof bernoulliExamples[number]) => { setPText(item.p); setQText(item.q); setN(item.n); };
  return <div className="de1-page"><div className="de1-lead-strip"><span><Search /> Interactive Solver<small>Change the exponent n</small></span><span><Activity /> Visual Comparisons<small>Compare solution behavior</small></span><span><BookOpen /> Real Examples<small>Physics and population</small></span></div><div className="de1-two-col de1-bernoulli-layout"><Card title="Equation Input"><p>Enter a Bernoulli equation y′ + P(x)y = Q(x)yⁿ.</p><div className="de1-result de1-big-formula"><Formula value={`y'+(${pText})y=(${qText})y^{${n}}`} display /></div><Slider label="Exponent n" value={n} min={-2} max={4} step={1} onChange={setN} /><div className="de1-pair"><label>P(x)<input aria-label="Bernoulli P of x" value={pText} onChange={(event) => setPText(event.target.value)} /></label><label>Q(x)<input aria-label="Bernoulli Q of x" value={qText} onChange={(event) => setQText(event.target.value)} /></label></div><Slider label="Initial y(0)" value={y0} min={0.2} max={3} step={0.1} onChange={setY0} /><div className="de1-chips">{bernoulliExamples.map((item) => <button key={item.label} type="button" onClick={() => load(item)}>{item.label}</button>)}</div>{p.error || q.error ? <p className="de1-error" role="alert">{p.error || q.error}</p> : null}</Card><Card title="Solution Behavior" className="de1-graph-card"><p>Compare the solution through y(0) = {fmt(y0)} for different values of n.</p><Phase1Graph bounds={bounds} series={[...series, { label: `Selected n = ${n}`, color: "#0f172a", points: current }]} showGrid={showGrid} showLegend={showLegend} label="Bernoulli exponent comparison" /><div className="de1-inline-options"><CheckBox label="Show grid" checked={showGrid} onChange={setShowGrid} /><CheckBox label="Show legend" checked={showLegend} onChange={setShowLegend} /></div><Notice>Changing n recomputes every curve from the same P(x), Q(x), and initial condition.</Notice></Card></div><div className="de1-two-col"><Card title="Transformation to Linear Equation"><p>{n === 0 || n === 1 ? `n = ${n} is already a linear equation, so no substitution is needed.` : "Use the substitution to transform the nonlinear equation."}</p><div className="de1-pair"><div className="de1-result"><strong>Substitution</strong><Formula value={n === 0 || n === 1 ? "\\text{None required}" : `v=y^{1-${n}}`} display /></div><div className="de1-result"><strong>Resulting Linear Equation</strong><Formula value={n === 0 || n === 1 ? `y'+P(x)y=Q(x)y^{${n}}` : `v'+(1-${n})P(x)v=(1-${n})Q(x)`} display /></div></div></Card><Card title="Step-by-Step Derivation"><Steps steps={n === 0 || n === 1 ? [{ title: "Recognize a linear case", formula: `n=${n}`, detail: "Rearrange terms and apply the integrating factor method." }] : [{ title: "Start with the Bernoulli equation", formula: "y'+P(x)y=Q(x)y^n" }, { title: "Substitute", formula: `v=y^{1-${n}}` }, { title: "Differentiate", formula: `v'=(1-${n})y^{-${n}}y'` }, { title: "Simplify", formula: `v'+(1-${n})P(x)v=(1-${n})Q(x)` }, { title: "Solve the linear equation", formula: "v=\\frac{1}{\\mu(x)}(\\int\\mu(x)(1-n)Q(x)dx+C)" }]} /></Card></div><div className="de1-insights"><Card title="Method Tips"><p>For n ≠ 0,1, v = y^(1−n) is the exponent that linearizes the equation.</p></Card><Card title="Example Equations"><ExampleChips items={bernoulliExamples.map((item) => ({ label: item.label, value: item.label }))} onSelect={(value) => { const item = bernoulliExamples.find((entry) => entry.label === value); if (item) load(item); }} /></Card><Card title="Where Bernoulli Fits"><p>n = 0 or 1 leads to a linear equation. Some forms are also separable.</p></Card></div></div>;
}

type GrowthModel = "Exponential Growth" | "Exponential Decay" | "Logistic Growth";
export function GrowthPhase1() {
  const [model, setModel] = useState<GrowthModel>("Logistic Growth");
  const [rate, setRate] = useState(0.6);
  const [capacity, setCapacity] = useState(1000);
  const [initial, setInitial] = useState(50);
  const [timeMax, setTimeMax] = useState(50);
  const [scenario, setScenario] = useState("Population");
  const [view, setView] = useState<"Model" | "Exact Solution" | "Slope Field" | "Compare">("Model");
  const [showExponential, setShowExponential] = useState(true);
  const [showCapacity, setShowCapacity] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const logistic = (t: number, r = rate) => capacity / (1 + ((capacity - initial) / Math.max(1e-6, initial)) * Math.exp(-r * t));
  const exponential = (t: number) => initial * Math.exp(rate * t);
  const decay = (t: number) => initial * Math.exp(-rate * t);
  const solution = (t: number) => model === "Logistic Growth" ? logistic(t) : model === "Exponential Growth" ? exponential(t) : decay(t);
  const bounds = { xMin: 0, xMax: timeMax, yMin: 0, yMax: Math.max(capacity * 1.2, initial * 1.5) };
  const series: GraphSeries[] = [{ label: model, color: blue, points: sampleCurve(solution, 0, timeMax) }];
  if (showExponential && model === "Logistic Growth" && view !== "Exact Solution") series.push({ label: "Exponential comparison", color: green, dashed: true, points: sampleCurve(exponential, 0, timeMax) });
  if (model === "Logistic Growth" && view === "Compare") { series.push({ label: "Slower growth", color: orange, points: sampleCurve((t) => logistic(t, rate * 0.5), 0, timeMax) }); series.push({ label: "Faster growth", color: violet, points: sampleCurve((t) => logistic(t, rate * 1.5), 0, timeMax) }); }
  const reset = () => { setModel("Logistic Growth"); setRate(0.6); setCapacity(1000); setInitial(50); setTimeMax(50); setScenario("Population"); setView("Model"); };
  const selectScenario = (next: string) => {
    setScenario(next);
    if (next === "Finance") { setModel("Exponential Growth"); setRate(0.1); setInitial(100); }
    else if (next === "Bacteria") { setModel("Exponential Growth"); setRate(0.8); setInitial(20); }
    else if (next === "Epidemic") { setModel("Logistic Growth"); setRate(0.7); setCapacity(1500); setInitial(10); }
    else if (next === "Adoption") { setModel("Logistic Growth"); setRate(0.4); setCapacity(3000); setInitial(30); }
    else { setModel("Logistic Growth"); setRate(0.6); setCapacity(1000); setInitial(50); }
  };
  return <div className="de1-page"><div className="de1-lead-strip"><span><Activity /> Interactive Models<small>Adjust parameters in real time</small></span><span><Target /> Real-World Scenarios<small>Explore applications</small></span><span><Sparkles /> Parameter Insights<small>See why behavior changes</small></span></div><div className="de1-three-col de1-growth-layout"><Card title="Model Setup"><div className="de1-segmented">{(["Exponential Growth", "Exponential Decay", "Logistic Growth"] as const).map((item) => <button key={item} type="button" aria-pressed={model === item} onClick={() => setModel(item)}>{item}</button>)}</div><h3>Differential Equation</h3><div className="de1-result"><Formula value={model === "Logistic Growth" ? "\\frac{dP}{dt}=rP(1-P/K)" : model === "Exponential Growth" ? "\\frac{dP}{dt}=rP" : "\\frac{dP}{dt}=-rP"} display /></div><h3>Parameters</h3><Slider label="Growth rate (r)" value={rate} min={0.1} max={2} step={0.05} onChange={setRate} />{model === "Logistic Growth" && <Slider label="Carrying capacity (K)" value={capacity} min={100} max={5000} step={50} onChange={setCapacity} />}<Slider label="Initial population (P₀)" value={initial} min={1} max={Math.max(1000, capacity)} step={1} onChange={setInitial} /><Slider label="Time range" value={timeMax} min={10} max={100} step={5} onChange={setTimeMax} /><h3>Real-World Scenario</h3><div className="de1-chips">{["Population", "Bacteria", "Finance", "Epidemic", "Adoption"].map((item) => <button key={item} type="button" aria-pressed={scenario === item} onClick={() => selectScenario(item)}>{item}</button>)}</div><button type="button" className="de1-secondary de1-full" onClick={reset}><RotateCcw size={15} /> Reset parameters</button></Card><Card title="Population Over Time" className="de1-graph-card"><div className="de1-segmented">{(["Model", "Exact Solution", "Slope Field", "Compare"] as const).map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}</div><Phase1Graph bounds={bounds} series={series} showField={view === "Slope Field"} field={(_, y) => model === "Logistic Growth" ? rate * y * (1 - y / capacity) : (model === "Exponential Growth" ? 1 : -1) * rate * y} horizontalLines={showCapacity && model === "Logistic Growth" ? [{ y: capacity, label: `K = ${fmt(capacity, 0)}`, color: violet }] : []} points={showPoints ? [{ x: 0, y: initial }] : []} onPointChange={(_, point) => setInitial(Math.max(1, Math.min(capacity, Math.round(point.y))))} label="Growth model population over time" /><div className="de1-inline-options"><CheckBox label="Exponential comparison" checked={showExponential} onChange={setShowExponential} /><CheckBox label="Capacity line" checked={showCapacity} onChange={setShowCapacity} /><CheckBox label="Show point" checked={showPoints} onChange={setShowPoints} /></div></Card><div className="de1-stack"><Card title="Key Metrics"><dl className="de1-metrics"><div><dt>Early doubling time</dt><dd>{model === "Exponential Decay" ? "—" : fmt(Math.log(2) / rate, 2)}</dd></div><div><dt>Equilibrium points</dt><dd>{model === "Logistic Growth" ? `0, ${fmt(capacity, 0)}` : "0"}</dd></div><div><dt>Carrying capacity</dt><dd>{model === "Logistic Growth" ? fmt(capacity, 0) : "Unbounded"}</dd></div><div><dt>Long-term behavior</dt><dd>{model === "Logistic Growth" ? `P → ${fmt(capacity, 0)}` : model === "Exponential Decay" ? "P → 0" : "P → ∞"}</dd></div></dl></Card><Card title="Model Interpretation"><p>{model === "Logistic Growth" ? `When ${scenario.toLowerCase()} is small relative to capacity, growth is nearly exponential. It slows near K = ${fmt(capacity, 0)}.` : model === "Exponential Decay" ? `${scenario} decreases by a constant proportion per unit of time.` : `${scenario} grows at a rate proportional to its current size.`}</p><Notice good>At t = {fmt(timeMax, 0)}, P(t) ≈ {fmt(solution(timeMax), 2)}.</Notice></Card></div></div><Card title="Explore Key Concepts"><div className="de1-insights"><div><strong>Growth Rate</strong><p>Controls the speed of change.</p></div><div><strong>Initial Value</strong><p>Sets the starting population P₀.</p></div><div><strong>Carrying Capacity</strong><p>Limits logistic growth.</p></div><div><strong>Applications</strong><p>Population, finance, epidemics, and adoption.</p></div></div></Card></div>;
}
