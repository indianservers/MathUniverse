import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CircleDot,
  Expand,
  Globe2,
  Move,
  RotateCcw,
  Share2,
  Volume2,
  Wrench,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Drag = "center" | "focus-left" | "focus-right" | "point" | null;

const initialCenter = { x: 0, y: 0 };
const initialA = 3;
const initialC = 4;
const initialU = 1.3;

export default function HyperbolaTargetLesson228({ resetToken, onInteraction }: LessonAdapterProps) {
  const [center, setCenter] = useState<Point>(initialCenter);
  const [a, setA] = useState(initialA);
  const [c, setC] = useState(initialC);
  const [u, setU] = useState(initialU);
  const [side, setSide] = useState<1 | -1>(1);
  const [drag, setDrag] = useState<Drag>(null);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [snap, setSnap] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [stage, setStage] = useState(1);
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workedOpen, setWorkedOpen] = useState(false);
  const [practiceA, setPracticeA] = useState(2);
  const [practiceMoved, setPracticeMoved] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  const b = Math.sqrt(Math.max(0.01, c * c - a * a));
  const eccentricity = c / a;
  const localPoint = { x: side * a * Math.cosh(u), y: b * Math.sinh(u) };
  const point = { x: center.x + localPoint.x, y: center.y + localPoint.y };
  const f1 = { x: center.x - c, y: center.y }, f2 = { x: center.x + c, y: center.y };
  const d1 = distance(point, f1), d2 = distance(point, f2), difference = Math.abs(d1 - d2);

  const reset = () => { setCenter(initialCenter); setA(initialA); setC(initialC); setU(initialU); setSide(1); setDrag(null); setShowAsymptotes(true); setSnap(false); setShowDetails(true); setStage(1); onInteraction(); };
  useEffect(() => { setCenter(initialCenter); setA(initialA); setC(initialC); setU(initialU); setSide(1); setDrag(null); setShowAsymptotes(true); setSnap(false); setShowDetails(true); setStage(1); }, [resetToken]);
  const updateC = (value: number) => { setC(Math.max(a + 0.1, clamp(value, 1.2, 7))); onInteraction(); };
  const share = async () => { try { await navigator.clipboard?.writeText(`Hyperbola: (x-${format(center.x)})²/${a.toFixed(2)}² - (y-${format(center.y)})²/${b.toFixed(2)}² = 1; |PF₁-PF₂|=${difference.toFixed(2)}`); } catch { /* Visible confirmation remains available. */ } setShared(true); window.setTimeout(() => setShared(false), 1500); onInteraction(); };
  const checkPractice = () => { setFeedback(Math.abs(Number(answer) - 2 * practiceA) <= 0.02 ? "correct" : "incorrect"); onInteraction(); };
  const movePracticePoint = () => { const nextB = Math.sqrt(c * c - practiceA * practiceA); setA(practiceA); setU(Math.asinh(3 / nextB)); setSide(1); setPracticeMoved(true); onInteraction(); };

  return <section className="target-hyper-page text-slate-900" data-testid="dynamic-geometry-mockup-0285" data-dedicated-lesson="228" data-object-model="two-focus-constant-difference-hyperbola" aria-label="Hyperbola dedicated interactive geometry model">
    <span className="sr-only">Live Verification. Check Construction.</span>
    <header className="target-hyper-header"><div><h1>Hyperbola</h1><p>Explore focus-difference loci.</p></div><div className="target-hyper-actions"><span>Dynamic Geometry Construction</span><span><Wrench /> Geometry Tools</span><span>6–10 min</span><label><Globe2 /><select aria-label="Hyperbola lesson language" value={language} onChange={(event) => { setLanguage(event.target.value); onInteraction(); }}><option>English (English)</option><option>Hindi (हिन्दी)</option></select></label><button type="button" onClick={reset}><RotateCcw /> Reset</button><button type="button" onClick={() => void share()}><Share2 /> {shared ? "Copied" : "Share"}</button></div></header>
    <nav className="target-hyper-stages" aria-label="Lesson stages">{[["Observe", "What is a hyperbola?"], ["Manipulate", "Drag to explore"], ["Notice", "Watch the pattern"], ["Understand", "Learn the rule"], ["Try It", "Practice"]].map(([title, subtitle], index) => <button key={title} type="button" className={stage === index ? "is-active" : ""} onClick={() => { setStage(index); onInteraction(); }}><b>{index + 1}</b><span><strong>{title}</strong><small>{subtitle}</small></span></button>)}</nav>

    <section className="target-hyper-workspace">
      <article className="target-hyper-plot"><header><span><Move /> Drag the green point to construct the hyperbola.</span><label><input type="checkbox" checked={showAsymptotes} onChange={(event) => { setShowAsymptotes(event.target.checked); onInteraction(); }} /> Show asymptotes</label><button type="button" aria-label="Fullscreen hyperbola" onClick={() => void document.documentElement.requestFullscreen?.()}><Expand /></button></header><HyperbolaPlot center={center} a={a} b={b} c={c} point={point} d1={d1} d2={d2} side={side} u={u} drag={drag} snap={snap} showAsymptotes={showAsymptotes} onDrag={setDrag} onCenter={(value) => { setCenter(value); onInteraction(); }} onC={updateC} onPoint={(nextSide, nextU) => { setSide(nextSide); setU(nextU); onInteraction(); }} /><footer><span><i />Hyperbola</span><span><i />Asymptotes</span><span><i />Foci</span><span><i />Point P</span><button type="button" onClick={reset}><Volume2 /> Fit</button></footer></article>
      <aside className="target-hyper-controls"><h2>Object Controls</h2><section><h3>Foci</h3><FocusControl label="F₁ (−c, 0)" aria="Hyperbola left focus" value={-c} min={-7} max={-1.2} onChange={(value) => updateC(Math.abs(value))} /><FocusControl label="F₂ (c, 0)" aria="Hyperbola right focus" value={c} min={1.2} max={7} onChange={updateC} /></section><section><h3>Point P</h3><p><CircleDot /> Drag on graph</p><label><input type="checkbox" checked={snap} onChange={(event) => { setSnap(event.target.checked); onInteraction(); }} /> Snap to grid</label></section><section><h3>Measurements</h3><Measure label="d₁ = PF₁" value={d1.toFixed(3)} /><Measure label="d₂ = PF₂" value={d2.toFixed(3)} /><div className="target-hyper-difference"><span>|d₁ − d₂|</span><b data-testid="hyperbola-focal-difference">{difference.toFixed(3)}</b><small>(Constant = 2a)</small></div></section><section><h3>Eccentricity</h3><Measure label="e = c/a" value={eccentricity.toFixed(3)} /></section><section className="target-hyper-parameters"><h3>Parameters</h3>{showDetails && <><Measure label="c" value={c.toFixed(3)} /><Measure label="a" value={a.toFixed(3)} /><Measure label="b" value={b.toFixed(3)} /></>}<button type="button" onClick={() => setShowDetails((value) => !value)}>{showDetails ? "Hide details" : "Show details"} <ChevronDown /></button></section></aside>
    </section>

    <section className="target-hyper-learning"><article><h2>What's happening?</h2><p>Point P is chosen so that the difference of its distances from the foci is constant:</p><div>|PF₁ − PF₂| = 2a</div><p>All such points P trace a hyperbola.</p><span><i /> Blue curve: hyperbola</span><span><i /> Purple dashed lines: asymptotes</span></article><article><h2>Construction Steps</h2>{[<>Place the foci F₁(−c, 0) and F₂(c, 0).</>, <>Choose a constant 2a (distance-difference).</>, <>Drag P so that |PF₁ − PF₂| = 2a.</>, <>The locus of P is a hyperbola.</>].map((text, index) => <p key={index}><b>{index + 1}</b><span>{text}</span></p>)}<button type="button" onClick={() => setWorkedOpen((value) => !value)}>View worked example <ArrowRight /></button>{workedOpen && <small>For a = 3 and c = 4, b = √7 and the focal difference is 6.</small>}</article><article><h2>Key Insight</h2><p>Equation (transverse axis along x-axis):</p><div><span>x²<i />{(a * a).toFixed(2)}</span> − <span>y²<i />{(b * b).toFixed(2)}</span> = 1</div><p>Where: c² = a² + b² and e = c/a (&gt; 1)</p><p>Asymptotes: y = ± (b/a)x</p></article></section>

    <section className="target-hyper-practice"><h2>Try It Yourself</h2><p>Keep F₁(−4, 0) and F₂(4, 0). Adjust a to 2 and explore.</p><div><article><label><input type="checkbox" checked={Math.abs(practiceA - 2) < 0.01} onChange={() => setPracticeA(2)} /> Set a = 2.0</label><div><input type="range" aria-label="Practice hyperbola semi-axis slider" min="1" max="3.9" step="0.1" value={practiceA} onChange={(event) => { setPracticeA(Number(event.target.value)); setFeedback("idle"); }} /><input type="number" aria-label="Practice hyperbola semi-axis" min="1" max="3.9" step="0.1" value={practiceA.toFixed(1)} onChange={(event) => { setPracticeA(Number(event.target.value)); setFeedback("idle"); }} /></div><label><input type="checkbox" checked={practiceMoved} onChange={movePracticePoint} /> Move P toward x ≈ 6 on the right branch.</label><label><input type="checkbox" checked={feedback === "correct"} readOnly /> What is |PF₁ − PF₂|?</label><div><input aria-label="Practice focal difference" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback("idle"); }} placeholder="Your answer" /><button type="button" onClick={checkPractice}>Check</button></div><output role="status" className={`is-${feedback}`}>{feedback === "correct" ? "Correct: the difference is 2a." : feedback === "incorrect" ? "Use the constant 2a." : ""}</output></article><article><h3>Prompts</h3><ul><li>How does the shape change as a decreases?</li><li>What happens when a → c?</li></ul><div><b>Hint</b>The constant difference equals 2a.</div></article><article><h3>Expected result</h3><ul><li>|PF₁ − PF₂| ≈ {(2 * practiceA).toFixed(3)}</li><li>e = c/a = {(4 / practiceA).toFixed(3)} (&gt; 1)</li><li>Asymptotes: y = ± (b/a)x, where b = √(c² − a²) ≈ {Math.sqrt(16 - practiceA ** 2).toFixed(3)}</li></ul></article></div></section>
    <nav className="target-hyper-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/227-ellipse"><ArrowLeft /><span><b>Previous</b>Ellipse</span></a><a href="/lessons">Back to Lesson Overview</a><a href="/lessons/geometry/229-parabola"><span><b>Next</b>Parabola</span><ArrowRight /></a></nav>
  </section>;
}

function HyperbolaPlot({ center, a, b, c, point, d1, d2, side, u, drag, snap, showAsymptotes, onDrag, onCenter, onC, onPoint }: { center: Point; a: number; b: number; c: number; point: Point; d1: number; d2: number; side: 1 | -1; u: number; drag: Drag; snap: boolean; showAsymptotes: boolean; onDrag: (value: Drag) => void; onCenter: (value: Point) => void; onC: (value: number) => void; onPoint: (side: 1 | -1, u: number) => void }) {
  const sx = 25, sy = 21, origin = { x: 280 + center.x * sx, y: 255 - center.y * sy };
  const screen = (value: Point) => ({ x: 280 + value.x * sx, y: 255 - value.y * sy }); const p = screen(point), left = screen({ x: center.x - c, y: center.y }), right = screen({ x: center.x + c, y: center.y });
  const domain = (svg: SVGSVGElement, clientX: number, clientY: number) => { const value = svg.createSVGPoint(); value.x = clientX; value.y = clientY; const local = value.matrixTransform(svg.getScreenCTM()?.inverse()); return { x: (local.x - 280) / sx, y: (255 - local.y) / sy }; };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => { if (!drag) return; let next = domain(event.currentTarget, event.clientX, event.clientY); if (snap) next = { x: Math.round(next.x), y: Math.round(next.y) }; if (drag === "center") onCenter({ x: clamp(next.x, -2, 2), y: clamp(next.y, -2, 2) }); else if (drag === "focus-left" || drag === "focus-right") onC(Math.abs(next.x - center.x)); else onPoint(next.x < center.x ? -1 : 1, Math.asinh((next.y - center.y) / b)); };
  const branch = (branchSide: 1 | -1) => Array.from({ length: 121 }, (_, index) => { const t = -1.75 + index * 3.5 / 120; return `${origin.x + branchSide * a * Math.cosh(t) * sx},${origin.y - b * Math.sinh(t) * sy}`; }).join(" ");
  return <svg role="img" aria-label="Interactive hyperbola with draggable center foci and constrained point P" viewBox="0 0 560 520" onPointerMove={move} onPointerUp={() => onDrag(null)} onPointerCancel={() => onDrag(null)}><defs><pattern id="hyper-grid" width={sx} height={sy} patternUnits="userSpaceOnUse"><path d={`M${sx} 0H0V${sy}`} fill="none" stroke="#e3eaf3" /></pattern></defs><rect width="560" height="520" fill="url(#hyper-grid)" /><line x1="5" x2="555" y1={origin.y} y2={origin.y} stroke="#334155" /><line x1={origin.x} x2={origin.x} y1="5" y2="515" stroke="#334155" />{showAsymptotes && <><line data-testid="hyperbola-asymptote" x1="5" x2="555" y1={origin.y + (b / a) * (origin.x - 5) * sy / sx} y2={origin.y - (b / a) * (555 - origin.x) * sy / sx} stroke="#7541e8" strokeDasharray="6 5" /><line data-testid="hyperbola-asymptote" x1="5" x2="555" y1={origin.y - (b / a) * (origin.x - 5) * sy / sx} y2={origin.y + (b / a) * (555 - origin.x) * sy / sx} stroke="#7541e8" strokeDasharray="6 5" /></>}<polyline data-testid="hyperbola-left-branch" points={branch(-1)} fill="none" stroke="#2468e5" strokeWidth="2.5" /><polyline data-testid="hyperbola-right-branch" data-a={a.toFixed(6)} data-b={b.toFixed(6)} points={branch(1)} fill="none" stroke="#2468e5" strokeWidth="2.5" /><line x1={left.x} y1={left.y} x2={p.x} y2={p.y} stroke="#22a06b" strokeDasharray="5 4" /><line x1={right.x} y1={right.y} x2={p.x} y2={p.y} stroke="#22a06b" strokeDasharray="5 4" /><text x={(left.x + p.x) / 2} y={(left.y + p.y) / 2 - 8} fill="#16a34a" fontSize="13" fontWeight="900">d₁</text><text x={(right.x + p.x) / 2 + 10} y={(right.y + p.y) / 2} fill="#16a34a" fontSize="13" fontWeight="900">d₂</text><circle data-testid="hyperbola-center" cx={origin.x} cy={origin.y} r="6" fill="#334155" onPointerDown={() => onDrag("center")} /><circle data-testid="hyperbola-focus-1" cx={left.x} cy={left.y} r="7" fill="#6d28d9" onPointerDown={() => onDrag("focus-left")} /><circle data-testid="hyperbola-focus-2" cx={right.x} cy={right.y} r="7" fill="#6d28d9" onPointerDown={() => onDrag("focus-right")} /><circle data-testid="hyperbola-point" data-u={u.toFixed(6)} data-side={side} cx={p.x} cy={p.y} r="8" fill="#54b957" stroke="#fff" strokeWidth="2" onPointerDown={() => onDrag("point")} /><text x={p.x + 10} y={p.y - 10} fill="#16833f" fontSize="14" fontWeight="900">P(x, y)</text><text x={left.x - 5} y={left.y + 27} textAnchor="middle" fill="#6d28d9" fontSize="11">F₁ (−c, 0)</text><text x={right.x + 5} y={right.y + 27} textAnchor="middle" fill="#6d28d9" fontSize="11">F₂ (c, 0)</text><title>{`Distances ${d1.toFixed(3)} and ${d2.toFixed(3)}`}</title></svg>;
}

function FocusControl({ label, aria, value, min, max, onChange }: { label: string; aria: string; value: number; min: number; max: number; onChange: (value: number) => void }) { return <label className="target-hyper-focus"><span>{label}</span><input type="range" aria-label={`${aria} slider`} min={min} max={max} step="0.1" value={value} onChange={(event) => onChange(Number(event.target.value))} /><input type="number" aria-label={aria} min={min} max={max} step="0.1" value={value.toFixed(1)} onChange={(event) => onChange(Number(event.target.value))} /></label>; }
function Measure({ label, value }: { label: string; value: string }) { return <p className="target-hyper-measure"><span>{label}</span><b>{value}</b></p>; }
function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min)); }
function format(value: number) { return Math.abs(value) < 0.005 ? "0.00" : value.toFixed(2); }
