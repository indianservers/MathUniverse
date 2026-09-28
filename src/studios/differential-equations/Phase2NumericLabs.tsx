import { useMemo, useState } from "react";
import { Activity, ArrowRight, BarChart3, Download, HelpCircle, RotateCcw, Target } from "lucide-react";
import { Card, CheckBox, ExampleChips, Formula, Notice, Slider } from "./Phase1Labs";
import { Phase1Graph, type Bounds, type GraphMarker, type GraphSeries } from "./Phase1Graph";
import { compileNumericRule, exactNumericSolution, numericError, numericSteps, numericalExamples, numberText, samplePoints, type NumericStep } from "./phase2Math";
import "./phase2Labs.css";

type Method = "euler" | "heun" | "rk4";
const colors = { exact: "#1769f5", euler: "#f97316", heun: "#0aaf71", rk4: "#7938f1" };
const names = { euler: "Euler", heun: "Heun", rk4: "RK4" };
const tips = { euler: "A smaller h takes more steps and generally reduces error on smooth problems.", heun: "Heun averages the slope at the start and at a predicted end point.", rk4: "RK4 combines four slopes: beginning, two midpoints, and end, with weights 1, 2, 2, 1." };
function Help({ text }: { text: string }) { return <button className="de2-help" type="button" title={text} aria-label={text}><HelpCircle size={15} /></button>; }
function StageMini({ slope, color }: { slope: number; color: string }) {
  const angle = Math.atan(slope);
  const dx = 29 * Math.cos(angle), dy = 14 * Math.sin(angle);
  return <svg className="de2-stage-mini" viewBox="0 0 90 38" role="img" aria-label={`Local slope ${value(slope, 3)}`}><line x1="5" y1="32" x2="85" y2="32" stroke="#ccd9eb" /><line x1={45 - dx} y1={19 + dy} x2={45 + dx} y2={19 - dy} stroke={color} strokeWidth="2.3" /><circle cx="45" cy="19" r="3" fill={color} /></svg>;
}
function value(value: number | null | undefined, digits = 4) { return value == null || !Number.isFinite(value) ? "—" : Number(value.toFixed(digits)).toString(); }
function csvDownload(method: Method, rows: NumericStep[]) {
  const headings = ["n", "x_n", "Euler y_n", "Heun y_n", "RK4 y_n", "Euler slope", "predictor", "end slope", "k1", "k2", "k3", "k4", "exact"];
  const content = [headings.join(","), ...rows.map((row) => [row.n, row.x, row.euler, row.heun, row.rk4, row.eulerSlope, row.predictor, row.endSlope, row.k1, row.k2, row.k3, row.k4, row.exact ?? ""].join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  const link = document.createElement("a"); link.href = url; link.download = `${method}-steps.csv`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function NumericalPhase2({ method }: { method: Method }) {
  const [rule, setRule] = useState("x-y");
  const [x0, setX0] = useState(0); const [y0, setY0] = useState(1);
  const [h, setH] = useState(method === "rk4" ? 0.2 : 0.5);
  const [count, setCount] = useState(method === "rk4" ? 20 : method === "heun" ? 6 : 8);
  const [current, setCurrent] = useState(0);
  const [showExact, setShowExact] = useState(true); const [showEuler, setShowEuler] = useState(method !== "euler");
  const [showHeun, setShowHeun] = useState(method === "rk4"); const [showPredictor, setShowPredictor] = useState(true);
  const [showNodes, setShowNodes] = useState(true); const [showGrid, setShowGrid] = useState(true);
  const [showTangent, setShowTangent] = useState(true); const [showError, setShowError] = useState(false);
  const [inspector, setInspector] = useState<{ x: number; y: number } | null>(null);
  const compiled = useMemo(() => compileNumericRule(rule), [rule]);
  const exact = useMemo(() => exactNumericSolution(rule, x0, y0), [rule, x0, y0]);
  const rows = useMemo(() => compiled.fn ? numericSteps(compiled.fn, x0, y0, h, count, exact) : [], [compiled.fn, x0, y0, h, count, exact]);
  const selected = rows[Math.min(current, rows.length - 1)];
  const last = rows.at(-1);
  const errors = numericError(rows, h, exact);
  const xEnd = x0 + Math.max(h, (last ? last.n + 1 : count) * h);
  const trace = (key: "euler" | "heun" | "rk4") => [{ x: x0, y: y0 }, ...rows.map((row) => ({ x: row.x + h, y: row[`next${key[0].toUpperCase()}${key.slice(1)}` as "nextEuler" | "nextHeun" | "nextRk4"] }))];
  const series: GraphSeries[] = [];
  if (showExact && exact) series.push({ label: "Exact solution", color: colors.exact, points: samplePoints(exact, x0, xEnd) });
  if (method === "euler" || showEuler) series.push({ label: "Euler approximation", color: colors.euler, points: trace("euler"), dashed: true });
  if (method === "heun" || showHeun) series.push({ label: "Heun corrected", color: colors.heun, points: trace("heun"), dashed: method !== "heun" });
  if (method === "rk4") series.push({ label: "RK4 approximation", color: colors.rk4, points: trace("rk4") });
  const plotted = series.flatMap((entry) => entry.points.map((point) => point.y)).filter((y) => Number.isFinite(y) && Math.abs(y) < 1e6);
  const low = Math.min(0, ...plotted, y0); const high = Math.max(1, ...plotted, y0);
  const pad = Math.max(0.5, (high - low) * 0.15);
  const bounds: Bounds = { xMin: x0 - h * 0.3, xMax: xEnd + h * 0.3, yMin: low - pad, yMax: high + pad };
  const activeKey = method === "euler" ? "euler" : method === "heun" ? "heun" : "rk4";
  const activeColor = colors[activeKey];
  const markers: GraphMarker[] = [];
  if (showNodes) trace(activeKey).forEach((point, index) => { if (index < 65) markers.push({ ...point, color: index === current ? "#ff3165" : activeColor }); });
  if (selected && method === "heun" && showPredictor) markers.push({ x: selected.x + h, y: selected.predictor, color: "#9b42ed", label: "predictor" });
  if (selected && method === "rk4" && showPredictor) markers.push(
    { x: selected.x, y: selected.rk4, color: "#1979f6", label: "k₁" },
    { x: selected.x + h / 2, y: selected.rk4 + h * selected.k1 / 2, color: "#19a875", label: "k₂" },
    { x: selected.x + h / 2, y: selected.rk4 + h * selected.k2 / 2, color: "#a04bea", label: "k₃" },
    { x: selected.x + h, y: selected.rk4 + h * selected.k3, color: "#ee6d69", label: "k₄" },
  );
  const segments: GraphSeries[] = [];
  if (selected && showTangent) {
    const startY = selected[activeKey];
    segments.push({ label: "current tangent", color: "#23b67c", dashed: true, points: [{ x: selected.x, y: startY }, { x: selected.x + h, y: startY + h * (method === "euler" ? selected.eulerSlope : method === "heun" ? compiled.fn?.(selected.x, selected.heun) ?? 0 : selected.k1) }] });
  }
  if (selected && showError && exact) segments.push({ label: "current error", color: "#ef476f", dashed: true, points: [{ x: selected.x + h, y: selected[`next${activeKey[0].toUpperCase()}${activeKey.slice(1)}` as "nextEuler" | "nextHeun" | "nextRk4"] }, { x: selected.x + h, y: exact(selected.x + h) }] });
  const reset = () => { setRule("x-y"); setX0(0); setY0(1); setH(method === "rk4" ? 0.2 : 0.5); setCount(method === "rk4" ? 20 : method === "heun" ? 6 : 8); setCurrent(0); };
  const title = names[method];
  return <div className="de1-page de2-page">
    <div className="de2-feature-strip"><span><Target size={17} /> {title} approximation</span><span><BarChart3 size={17} /> Step table</span><span><Activity size={17} /> Error comparison</span><span><HelpCircle size={17} /> Method intuition</span></div>
    <div className="de2-three-col de2-numeric-layout">
      <div className="de1-stack"><Card title="Equation Setup"><p>Enter a first-order differential equation <Formula value="y'=f(x,y)" />.</p><label className="de2-field">Slope rule y′ = <input aria-label="Slope rule" value={rule} onChange={(event) => { setRule(event.target.value); setCurrent(0); }} /></label><ExampleChips items={numericalExamples.map((item) => ({ label: item.label, value: item.rule }))} onSelect={(next) => { setRule(next); setCurrent(0); }} />{compiled.error && <p className="de1-error" role="alert">{compiled.error}</p>}<div className="de1-pair"><label>x₀<input type="number" value={x0} step="0.1" onChange={(event) => setX0(Number(event.target.value))} /></label><label>y₀<input type="number" value={y0} step="0.1" onChange={(event) => setY0(Number(event.target.value))} /></label></div><Slider label="Step size h" min={0.05} max={1} step={0.05} value={h} onChange={(next) => { setH(next); setCurrent(0); }} /><label className="de2-field">Number of steps<input type="number" min="1" max="80" value={count} onChange={(event) => { setCount(Number(event.target.value)); setCurrent(0); }} /></label>{(h <= 0 || count <= 0 || count > 80) && <p className="de1-error" role="alert">Use h &gt; 0 and 1–80 steps.</p>}<h3>Display options</h3>{exact && <CheckBox label="Exact solution" checked={showExact} onChange={setShowExact} />}{method !== "euler" && <CheckBox label="Compare Euler" checked={showEuler} onChange={setShowEuler} />}{method === "rk4" && <CheckBox label="Compare Heun" checked={showHeun} onChange={setShowHeun} />}{method !== "euler" && <CheckBox label={method === "heun" ? "Show predictor" : "Show stage markers"} checked={showPredictor} onChange={setShowPredictor} />}<CheckBox label="Show nodes" checked={showNodes} onChange={setShowNodes} /><CheckBox label="Show tangent" checked={showTangent} onChange={setShowTangent} /><CheckBox label="Show error indicator" checked={showError} onChange={setShowError} /><CheckBox label="Show grid" checked={showGrid} onChange={setShowGrid} /><div className="de2-actions"><button type="button" className="de1-primary" onClick={() => document.querySelector(".de2-numeric-plot")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Explore {title} <ArrowRight size={15} /></button><button type="button" className="de2-secondary" onClick={reset} title="Reset problem"><RotateCcw size={15} /> Reset</button></div></Card></div>
      <div className="de1-stack"><Card title={`${title} Approximation`} className="de1-graph-card de2-numeric-plot"><div className="de2-card-toolbar"><Help text={tips[method]} /><span>{inspector ? `Inspect (${numberText(inspector.x, 2)}, ${numberText(inspector.y, 2)})` : "Drag to pan; use toolbar to zoom"}</span></div><Phase1Graph bounds={bounds} series={series} segments={segments} markers={markers} showGrid={showGrid} onInspect={setInspector} label={`${title} numerical approximation and comparisons`} height={405} />{!exact && <Notice>The entered rule has no verified exact formula in this lab; comparisons remain numerical.</Notice>}</Card>{method === "heun" && selected && <Card title="Heun’s Two-Stage Method"><div className="de2-stage-grid"><div><strong>1. Predictor</strong><p>Euler estimate at the next x.</p><Formula value={`y^*=${value(selected.heun)}+${value(h)}(${value(compiled.fn?.(selected.x, selected.heun))})=${value(selected.predictor)}`} /></div><div><strong>2. Corrector</strong><p>Average the beginning and predicted end slopes.</p><Formula value={`y_{n+1}=${value(selected.nextHeun)}`} /></div></div></Card>}{method === "rk4" && selected && <Card title="RK4 Stage Slopes"><div className="de2-stage-grid four">{(["k1", "k2", "k3", "k4"] as const).map((key, index) => <div key={key}><strong>{["k₁", "k₂", "k₃", "k₄"][index]}</strong><p>{["Beginning", "First midpoint", "Second midpoint", "End of step"][index]}</p><output>{value(selected[key], 6)}</output><StageMini slope={selected[key]} color={["#1979f6", "#19a875", "#a04bea", "#ee6d69"][index]} /></div>)}</div></Card>}</div>
      <div className="de1-stack"><Card title={method === "euler" ? "How Euler Works" : method === "heun" ? "Method Summary" : "Method Overview"}><p>{method === "euler" ? "Move from the current point along its tangent slope." : method === "heun" ? "Predict an endpoint with Euler, then correct using the average of two slopes." : "Four carefully weighted slopes estimate the average change across one step."}</p><Formula value={method === "euler" ? "y_{n+1}=y_n+h f(x_n,y_n)" : method === "heun" ? "y_{n+1}=y_n+\\frac h2[f(x_n,y_n)+f(x_{n+1},y^*)]" : "y_{n+1}=y_n+\\frac h6(k_1+2k_2+2k_3+k_4)"} display /><Notice>{tips[method]}</Notice></Card><Card title="Current Step"><div className="de2-step-nav"><button type="button" aria-label="Previous step" disabled={current <= 0} onClick={() => setCurrent((n) => n - 1)}>‹</button><span>Step {selected ? current + 1 : 0} of {rows.length}</span><button type="button" aria-label="Next step" disabled={current >= rows.length - 1} onClick={() => setCurrent((n) => n + 1)}>›</button></div>{selected ? <div className="de2-metric-list"><div><span>xₙ</span><strong>{value(selected.x)}</strong></div><div><span>yₙ</span><strong>{value(selected[activeKey])}</strong></div><div><span>Beginning slope</span><strong>{value(method === "euler" ? selected.eulerSlope : method === "heun" ? compiled.fn?.(selected.x, selected.heun) : selected.k1)}</strong></div><div><span>Next {title} value</span><strong>{value(selected[`next${activeKey[0].toUpperCase()}${activeKey.slice(1)}` as "nextEuler" | "nextHeun" | "nextRk4"])}</strong></div></div> : <p>Enter a valid equation and step settings.</p>}</Card><Card title="Accuracy Comparison"><Help text="Absolute error is the distance from the exact solution at the final x value." />{errors ? <div className="de2-metric-list"><div><span>Exact at x = {value(xEnd, 2)}</span><strong>{value(errors.exact, 6)}</strong></div><div><span>Euler error</span><strong>{value(errors.euler, 6)}</strong></div><div><span>Heun error</span><strong>{value(errors.heun, 6)}</strong></div><div><span>RK4 error</span><strong>{value(errors.rk4, 8)}</strong></div></div> : <p>Choose a preset with a known exact solution for error metrics.</p>}</Card></div>
    </div>
    <Card title="Step-by-Step Results" className="de2-table-card"><div className="de2-card-toolbar"><p>Select a row to inspect its step on the graph.</p><button type="button" className="de2-secondary" onClick={() => csvDownload(method, rows)} disabled={!rows.length}><Download size={15} /> Export table</button></div><div className="de2-table-scroll"><table className="de2-table"><thead><tr><th>n</th><th>xₙ</th><th>yₙ</th>{method === "euler" ? <><th>f(xₙ,yₙ)</th><th>yₙ₊₁</th></> : method === "heun" ? <><th>Predictor y*</th><th>f(xₙ₊₁,y*)</th><th>Corrected yₙ₊₁</th></> : <><th>k₁</th><th>k₂</th><th>k₃</th><th>k₄</th><th>yₙ₊₁</th></>}</tr></thead><tbody>{rows.map((row) => <tr key={row.n} className={row.n === current ? "is-selected" : ""} onClick={() => setCurrent(row.n)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setCurrent(row.n); }}><td>{row.n}</td><td>{value(row.x)}</td><td>{value(row[activeKey])}</td>{method === "euler" ? <><td>{value(row.eulerSlope)}</td><td>{value(row.nextEuler)}</td></> : method === "heun" ? <><td>{value(row.predictor)}</td><td>{value(row.endSlope)}</td><td>{value(row.nextHeun)}</td></> : <><td>{value(row.k1)}</td><td>{value(row.k2)}</td><td>{value(row.k3)}</td><td>{value(row.k4)}</td><td>{value(row.nextRk4)}</td></>}</tr>)}</tbody></table></div></Card>
    <div className="de2-insights"><Card title="Step Size h"><p>Smaller steps generally improve accuracy, while increasing computation.</p></Card><Card title="Slope Evaluation"><p>Each method estimates change from the rule f(x,y) at selected locations.</p></Card><Card title="Accuracy vs Speed"><p>Euler uses one evaluation, Heun two, and RK4 four per step.</p></Card><Card title="When to Use {title}"><p>{method === "euler" ? "Quick estimates and introductory reasoning." : method === "heun" ? "Better accuracy with a simple predictor and corrector." : "High accuracy for smooth initial value problems."}</p></Card></div>
  </div>;
}
