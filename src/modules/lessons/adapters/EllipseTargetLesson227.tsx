import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleDot,
  Expand,
  Eye,
  Grid3X3,
  Link2,
  Move,
  RefreshCw,
  RotateCcw,
  Share2,
  Wrench,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Drag = "center" | "focus-left" | "focus-right" | "point" | null;
type AnswerKey = "sum" | "minor" | "eccentricity";

const initialCenter = { x: 0, y: 0 };
const initialA = 6;
const initialC = 3;
const initialTheta = 65;
const tasks = [{ a: 7, c: 3.5 }, { a: 8, c: 4.8 }, { a: 5, c: 2 }];

export default function EllipseTargetLesson227({ resetToken, onInteraction }: LessonAdapterProps) {
  const [center, setCenter] = useState<Point>(initialCenter);
  const [a, setA] = useState(initialA);
  const [c, setC] = useState(initialC);
  const [theta, setTheta] = useState(initialTheta);
  const [drag, setDrag] = useState<Drag>(null);
  const [showAxes, setShowAxes] = useState(true);
  const [showMajorMinor, setShowMajorMinor] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [stage, setStage] = useState(0);
  const [shared, setShared] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({ sum: "", minor: "", eccentricity: "" });
  const [results, setResults] = useState<Record<AnswerKey, "idle" | "correct" | "incorrect">>({ sum: "idle", minor: "idle", eccentricity: "idle" });
  const [hintOpen, setHintOpen] = useState(false);

  const b = Math.sqrt(Math.max(0.01, a * a - c * c));
  const eccentricity = c / a;
  const radians = theta * Math.PI / 180;
  const localPoint = { x: a * Math.cos(radians), y: b * Math.sin(radians) };
  const point = { x: center.x + localPoint.x, y: center.y + localPoint.y };
  const f1 = { x: center.x - c, y: center.y };
  const f2 = { x: center.x + c, y: center.y };
  const d1 = distance(point, f1), d2 = distance(point, f2), sum = d1 + d2;
  const task = tasks[taskIndex];
  const taskB = Math.sqrt(task.a ** 2 - task.c ** 2);

  const reset = () => {
    setCenter(initialCenter); setA(initialA); setC(initialC); setTheta(initialTheta); setDrag(null); setShowAxes(true); setShowMajorMinor(true); setShowGrid(true); setStage(0); onInteraction();
  };
  useEffect(() => { setCenter(initialCenter); setA(initialA); setC(initialC); setTheta(initialTheta); setDrag(null); setShowAxes(true); setShowMajorMinor(true); setShowGrid(true); setStage(0); }, [resetToken]);

  const updateA = (value: number) => { const next = clamp(value, 3, 10); setA(next); setC((current) => Math.min(current, next * 0.99)); onInteraction(); };
  const updateC = (value: number) => { setC(clamp(value, 0.5, a * 0.99)); onInteraction(); };
  const updateE = (value: number) => { setC(clamp(value, 0.05, 0.99) * a); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`Ellipse: (x-${format(center.x)})²/${a.toFixed(2)}² + (y-${format(center.y)})²/${b.toFixed(2)}² = 1; PF₁+PF₂=${sum.toFixed(2)}`); } catch { /* Confirmation remains useful without clipboard permission. */ } setShared(true); window.setTimeout(() => setShared(false), 1500); onInteraction(); };
  const check = (key: AnswerKey) => { const expected = key === "sum" ? 2 * task.a : key === "minor" ? taskB : task.c / task.a; const tolerance = key === "eccentricity" ? 0.01 : 0.03; setResults((current) => ({ ...current, [key]: Math.abs(Number(answers[key]) - expected) <= tolerance ? "correct" : "incorrect" })); onInteraction(); };
  const newTask = () => { setTaskIndex((value) => (value + 1) % tasks.length); setAnswers({ sum: "", minor: "", eccentricity: "" }); setResults({ sum: "idle", minor: "idle", eccentricity: "idle" }); setHintOpen(false); onInteraction(); };

  return <section className="target-ellipse-page text-slate-900" data-testid="dynamic-geometry-mockup-0284" data-dedicated-lesson="227" data-object-model="two-focus-constant-sum-ellipse" aria-label="Ellipse dedicated interactive geometry model">
    <span className="sr-only">Live Verification. Check Construction.</span>
    <header className="target-ellipse-header"><div><div><span>Geometry</span><span>Dynamic Geometry Construction</span></div><h1>Ellipse</h1><p>Explore focus-sum loci.</p></div><div className="target-ellipse-head-actions"><span>Foundation–Advanced</span><span><Wrench /> Construction Studio</span><span><CircleDot /> Geometry Tools</span><span>6–10 min</span><button type="button" onClick={reset}><RotateCcw /> Reset</button><button type="button" onClick={() => void share()}><Share2 />{shared ? "Copied" : "Share"}</button><a href="/workspace/geometry"><Expand /> Workspace</a></div></header>
    <nav className="target-ellipse-stages" aria-label="Lesson stages">{[["Observe", "See the model", <Eye />], ["Manipulate", "Drag to explore", <Move />], ["Pattern", "Notice the constant", <Grid3X3 />], ["Rule", "Understand why", <Wrench />], ["Practice", "Try independently", <Link2 />]].map(([title, subtitle, icon], index) => <button key={String(title)} type="button" className={stage === index ? "is-active" : ""} onClick={() => { setStage(index); onInteraction(); }}>{icon as ReactNode}<span><b>{title}</b><small>{subtitle}</small></span></button>)}</nav>

    <section className="target-ellipse-workspace">
      <article className="target-ellipse-plot"><h2>Drag to explore the ellipse</h2><EllipsePlot center={center} a={a} b={b} c={c} point={point} d1={d1} d2={d2} theta={theta} drag={drag} showAxes={showAxes} showMajorMinor={showMajorMinor} showGrid={showGrid} onDrag={setDrag} onCenter={(value) => { setCenter(value); onInteraction(); }} onC={updateC} onTheta={(value) => { setTheta(value); onInteraction(); }} /><div className="target-ellipse-display"><span>Show:</span><label><input type="checkbox" checked={showAxes} onChange={(event) => { setShowAxes(event.target.checked); onInteraction(); }} /> Axes</label><label><input type="checkbox" checked={showMajorMinor} onChange={(event) => { setShowMajorMinor(event.target.checked); onInteraction(); }} /> Major/Minor Axes</label><label><input type="checkbox" checked={showGrid} onChange={(event) => { setShowGrid(event.target.checked); onInteraction(); }} /> Grid</label><button type="button" aria-label="Fullscreen ellipse" onClick={() => void document.documentElement.requestFullscreen?.()}><Expand /></button></div></article>
      <aside className="target-ellipse-controls"><h2>Objects</h2><ObjectLegend color="#7541e8" label="P(x,y)" value="Point on ellipse" /><ObjectLegend color="#2468e5" label="F₁" value="Focus 1" /><ObjectLegend color="#21b5b8" label="F₂" value="Focus 2" /><ObjectLegend color="#1f2937" label="O" value="Center" /><hr /><EllipseControl label="Focus position" detail="c (focus distance)" aria="Ellipse focus distance" value={c} min={0.5} max={Math.min(6, a * 0.99)} step={0.1} onChange={updateC} /><EllipseControl label="Ellipse shape" detail="a (distance from center to vertex)" aria="Ellipse semi-major axis" value={a} min={3} max={10} step={0.1} onChange={updateA} /><EllipseControl label="Eccentricity" detail="e = c / a" aria="Ellipse eccentricity" value={eccentricity} min={0.05} max={0.99} step={0.01} onChange={updateE} /><section className="target-ellipse-sum"><b>Constant sum (PF₁ + PF₂)</b><strong data-testid="ellipse-focal-sum">{sum.toFixed(2)}</strong><p>This sum remains constant for all points P on the ellipse.</p></section><section className="target-ellipse-equation"><b>Equation <small>(horizontal major axis)</small></b><div><span>(x − {format(center.x)})²<i />{(a * a).toFixed(0)}</span> + <span>(y − {format(center.y)})²<i />{(b * b).toFixed(0)}</span> = 1</div><small>Where a = {a.toFixed(2)}, c = {c.toFixed(2)}, b = {b.toFixed(2)}</small></section></aside>
    </section>

    <section className="target-ellipse-learning"><article><h2>What's happening?</h2><p>Point P is connected to the foci F₁ and F₂. Drag P anywhere on the purple curve.</p><div>PF₁ = {d1.toFixed(2)}<br />PF₂ = {d2.toFixed(2)}<br />PF₁ + PF₂ = {sum.toFixed(2)}</div><output><Check /> The sum of distances to the foci is constant.</output></article><article><h2>Construction steps</h2>{[<>Place two foci F₁ and F₂ on the x-axis at (−c, 0) and (c, 0).</>, <>Choose a constant a &gt; c.</>, <>For any point P such that PF₁ + PF₂ = 2a, P lies on an ellipse.</>, <>Major axis length = 2a, minor axis length = 2b, where b = √(a² − c²).</>].map((text, index) => <p key={index}><b>{index + 1}</b><span>{text}</span></p>)}</article><article><h2>Definition & insight</h2><p>An <strong>ellipse</strong> is the set of all points P in the plane such that the sum of the distances from P to two fixed points F₁ and F₂ (the foci) is constant.</p><div>PF₁ + PF₂ = 2a <span>(constant)</span></div><ul><li>2a = length of major axis</li><li>2b = length of minor axis</li><li>c = distance from center to each focus</li><li>e = c/a = eccentricity (0 &lt; e &lt; 1)</li></ul></article></section>

    <section className="target-ellipse-practice"><header><div><h2>Try it yourself</h2><p>Set a = {task.a} and c = {task.c} using the controls, then answer the questions.</p></div><button type="button" onClick={newTask}><RefreshCw /> New Task</button></header><div>{(["sum", "minor", "eccentricity"] as AnswerKey[]).map((key, index) => <label key={key}><span><b>{index + 1}</b>{key === "sum" ? "What should be the constant sum PF₁ + PF₂?" : key === "minor" ? "What is the value of the minor axis b?" : "What is the eccentricity e?"}</span><div><input aria-label={`Ellipse practice ${key}`} inputMode="decimal" value={answers[key]} onChange={(event) => { setAnswers((current) => ({ ...current, [key]: event.target.value })); setResults((current) => ({ ...current, [key]: "idle" })); }} /><button type="button" onClick={() => check(key)}>Check</button></div><output className={`is-${results[key]}`}>{results[key] === "correct" ? "Correct" : results[key] === "incorrect" ? "Try again" : ""}</output></label>)}</div><button type="button" className="target-ellipse-hint" onClick={() => setHintOpen((value) => !value)}><b>Need a hint?</b> Show solution formula <ChevronDown /></button>{hintOpen && <p className="target-ellipse-hint-copy">Use PF₁ + PF₂ = 2a, b = √(a² − c²), and e = c/a.</p>}</section>
    <nav className="target-ellipse-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/226-conic-through-five-points"><ArrowLeft /><span><b>Previous</b>Conic Through Five Points</span></a><section><b>Lesson 227 <span>of 240</span></b><div><i /></div><span>76%</span></section><a href="/lessons/geometry/228-hyperbola"><span><b>Next</b>Hyperbola</span><ArrowRight /></a></nav>
  </section>;
}

function EllipsePlot({ center, a, b, c, point, d1, d2, theta, drag, showAxes, showMajorMinor, showGrid, onDrag, onCenter, onC, onTheta }: { center: Point; a: number; b: number; c: number; point: Point; d1: number; d2: number; theta: number; drag: Drag; showAxes: boolean; showMajorMinor: boolean; showGrid: boolean; onDrag: (value: Drag) => void; onCenter: (value: Point) => void; onC: (value: number) => void; onTheta: (value: number) => void }) {
  const xScale = 35.5, yScale = 27, origin = { x: 245 + center.x * xScale, y: 205 - center.y * yScale };
  const screen = (value: Point) => ({ x: 245 + value.x * xScale, y: 205 - value.y * yScale });
  const p = screen(point), left = screen({ x: center.x - c, y: center.y }), right = screen({ x: center.x + c, y: center.y });
  const local = (svg: SVGSVGElement, clientX: number, clientY: number) => { const value = svg.createSVGPoint(); value.x = clientX; value.y = clientY; const result = value.matrixTransform(svg.getScreenCTM()?.inverse()); return { x: (result.x - 245) / xScale, y: (205 - result.y) / yScale }; };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => { if (!drag) return; const next = local(event.currentTarget, event.clientX, event.clientY); if (drag === "center") onCenter({ x: clamp(next.x, -2, 2), y: clamp(next.y, -2, 2) }); else if (drag === "focus-left" || drag === "focus-right") onC(Math.abs(next.x - center.x)); else { const angle = Math.atan2((next.y - center.y) / b, (next.x - center.x) / a) * 180 / Math.PI; onTheta((angle + 360) % 360); } };
  return <svg role="img" aria-label="Interactive ellipse with draggable center foci and constrained point P" viewBox="0 0 520 500" onPointerMove={move} onPointerUp={() => onDrag(null)} onPointerCancel={() => onDrag(null)}>
    <defs><pattern id="ellipse-grid" width={xScale} height={yScale} patternUnits="userSpaceOnUse"><path d={`M ${xScale} 0 H 0 V ${yScale}`} fill="none" stroke="#e3eaf3" /></pattern></defs><rect width="520" height="500" fill={showGrid ? "url(#ellipse-grid)" : "white"} />
    {showAxes && <><line x1="12" x2="508" y1={origin.y} y2={origin.y} stroke="#334155" /><line x1={origin.x} x2={origin.x} y1="12" y2="488" stroke="#334155" /></>}
    <ellipse data-testid="ellipse-locus" data-a={a.toFixed(6)} data-b={b.toFixed(6)} cx={origin.x} cy={origin.y} rx={a * xScale} ry={b * yScale} fill="#f7f4ff" stroke="#7541e8" strokeWidth="2.3" />
    {showMajorMinor && <><line x1={origin.x - a * xScale} x2={origin.x + a * xScale} y1={origin.y} y2={origin.y} stroke="#9ca3af" strokeDasharray="4 4" /><line x1={origin.x} x2={origin.x} y1={origin.y - b * yScale} y2={origin.y + b * yScale} stroke="#9ca3af" strokeDasharray="4 4" /></>}
    <line x1={left.x} y1={left.y} x2={p.x} y2={p.y} stroke="#2468e5" strokeWidth="2" /><line x1={right.x} y1={right.y} x2={p.x} y2={p.y} stroke="#21b5b8" strokeWidth="2" />
    <text x={(left.x + p.x) / 2 - 25} y={(left.y + p.y) / 2 - 9} fill="#2468e5" fontSize="11" fontWeight="800">PF₁ = {d1.toFixed(2)}</text><text x={(right.x + p.x) / 2 + 4} y={(right.y + p.y) / 2 + 18} fill="#15989c" fontSize="11" fontWeight="800">PF₂ = {d2.toFixed(2)}</text>
    <circle data-testid="ellipse-center" cx={origin.x} cy={origin.y} r="6" fill="#1f2937" onPointerDown={() => onDrag("center")} /><circle data-testid="ellipse-focus-1" cx={left.x} cy={left.y} r="7" fill="#2468e5" onPointerDown={() => onDrag("focus-left")} /><circle data-testid="ellipse-focus-2" cx={right.x} cy={right.y} r="7" fill="#21b5b8" onPointerDown={() => onDrag("focus-right")} /><circle data-testid="ellipse-point" data-theta={theta.toFixed(5)} cx={p.x} cy={p.y} r="8" fill="#7541e8" stroke="#fff" strokeWidth="2" onPointerDown={() => onDrag("point")} />
    <text x={p.x + 10} y={p.y - 13} fill="#7541e8" fontSize="13" fontWeight="900">P(x, y)</text><text x={left.x - 8} y={left.y + 28} textAnchor="middle" fill="#2468e5" fontSize="11" fontWeight="800">F₁<tspan x={left.x - 8} dy="16">({format(center.x - c)}, {format(center.y)})</tspan></text><text x={right.x + 8} y={right.y + 28} textAnchor="middle" fill="#2468e5" fontSize="11" fontWeight="800">F₂<tspan x={right.x + 8} dy="16">({format(center.x + c)}, {format(center.y)})</tspan></text><text x={origin.x + 8} y={origin.y + 23} fontSize="11">O</text>
  </svg>;
}

function ObjectLegend({ color, label, value }: { color: string; label: string; value: string }) { return <p className="target-ellipse-object"><i style={{ background: color }} /><b>{label}</b><span>{value}</span></p>; }
function EllipseControl({ label, detail, aria, value, min, max, step, onChange }: { label: string; detail: string; aria: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) { return <label className="target-ellipse-control"><b>{label}</b><span>{detail}</span><div><input type="range" aria-label={`${aria} slider`} min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /><input type="number" aria-label={aria} min={min} max={max} step={step} value={value.toFixed(step < 0.1 ? 2 : 1)} onChange={(event) => onChange(Number(event.target.value))} /></div><small><i>{min}</i><i>{Number(max).toFixed(max % 1 ? 1 : 0)}</i></small></label>; }
function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min)); }
function format(value: number) { return Math.abs(value) < 0.005 ? "0.00" : value.toFixed(2); }
