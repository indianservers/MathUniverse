import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, CircleDot, Eye, Grid3X3, Languages, Lightbulb, Maximize2, MousePointer2, MoveDiagonal2, Redo2, RotateCcw, Share2, Target, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { LessonAdapterProps } from "../types";
import "./SegmentTargetLesson204.css";

type Point = { x: number; y: number };
type Pair = { A: Point; B: Point };
type Mode = "none" | "line" | "ray";
type Tool = "select" | "point" | "segment" | "ray" | "settings";
const INITIAL: Pair = { A: { x: -3, y: 1 }, B: { x: 4, y: 2 } };
const TASK: Pair = { A: { x: -2, y: -1 }, B: { x: 3, y: 4 } };
const round = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number) => Math.max(-6, Math.min(6, n));
const metrics = ({ A, B }: Pair) => ({
  length: Math.hypot(B.x - A.x, B.y - A.y),
  midpoint: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 },
});

function SegmentCanvas({ points, snap, mode, tool, onPoint }: { points: Pair; snap: boolean; mode: Mode; tool: Tool; onPoint: (name: keyof Pair, point: Point) => void }) {
  const ref = useRef<SVGSVGElement>(null), drag = useRef<keyof Pair | null>(null);
  const sx = (x: number) => 270 + x * 36, sy = (y: number) => 225 - y * 36;
  const fromEvent = (e: PointerEvent<SVGSVGElement>) => {
    const b = ref.current!.getBoundingClientRect(), raw = { x: (((e.clientX - b.left) / b.width) * 540 - 270) / 36, y: (225 - ((e.clientY - b.top) / b.height) * 450) / 36 };
    return { x: clamp(snap ? Math.round(raw.x) : round(raw.x)), y: clamp(snap ? Math.round(raw.y) : round(raw.y)) };
  };
  const start = (e: PointerEvent<SVGGElement>, name: keyof Pair) => { e.stopPropagation(); drag.current = name; e.currentTarget.setPointerCapture(e.pointerId); };
  const dx = points.B.x - points.A.x, dy = points.B.y - points.A.y, norm = Math.hypot(dx, dy) || 1, ux = dx / norm, uy = dy / norm;
  const extension = mode === "none" ? { x1: sx(points.A.x), y1: sy(points.A.y), x2: sx(points.B.x), y2: sy(points.B.y) } : { x1: mode === "line" ? sx(points.A.x) - ux * 700 : sx(points.A.x), y1: mode === "line" ? sy(points.A.y) + uy * 700 : sy(points.A.y), x2: sx(points.B.x) + ux * 700, y2: sy(points.B.y) - uy * 700 };
  return <svg ref={ref} className="sg204-canvas" viewBox="0 0 540 450" role="img" aria-label="Finite segment AB with draggable endpoints A and B" onPointerDown={(e) => { if (tool !== "point") return; const p = fromEvent(e); const next = Math.hypot(p.x - points.A.x, p.y - points.A.y) < Math.hypot(p.x - points.B.x, p.y - points.B.y) ? "A" : "B"; onPoint(next, p); }} onPointerMove={(e) => drag.current && onPoint(drag.current, fromEvent(e))} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}>
    <defs><pattern id="sg204-grid" width="36" height="36" patternUnits="userSpaceOnUse" x="270" y="225"><path d="M36 0H0V36" fill="none" stroke="#dce5ef" strokeDasharray="2 2" /></pattern><marker id="sg204-arrow" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#086edb" /></marker></defs>
    <rect width="540" height="450" fill="#fff" /><rect width="540" height="450" fill="url(#sg204-grid)" /><line x1="10" y1="225" x2="530" y2="225" className="axis" /><line x1="270" y1="440" x2="270" y2="10" className="axis" />
    {[-6,-4,-2,0,2,4,6].map((n) => <g key={n}><text x={sx(n)} y="244" textAnchor="middle">{n}</text>{n !== 0 && <text x="260" y={sy(n)+4} textAnchor="end">{n}</text>}</g>)}<text x="523" y="215" className="axis-name">x</text><text x="280" y="15" className="axis-name">y</text>
    <line {...extension} className={`segment ${mode}`} markerEnd={mode === "ray" ? "url(#sg204-arrow)" : undefined} />
    {(["A","B"] as const).map((name) => { const p = points[name]; return <g key={name} data-testid={`segment-point-${name.toLowerCase()}`} className="endpoint" onPointerDown={(e) => start(e,name)}><circle cx={sx(p.x)} cy={sy(p.y)} r="8" /><text x={sx(p.x)+(name === "A" ? -12 : 9)} y={sy(p.y)-15}>{name}</text><g transform={`translate(${sx(p.x)-31} ${sy(p.y)+13})`}><rect width="70" height="27" rx="6" /><text x="35" y="18" textAnchor="middle">{name} ({p.x}, {p.y})</text></g></g>; })}
  </svg>;
}

function PointInputs({ name, point, onPoint }: { name: keyof Pair; point: Point; onPoint: (p: Point) => void }) {
  return <div><b>{name} (x<sub>{name === "A" ? "1" : "2"}</sub>, y<sub>{name === "A" ? "1" : "2"}</sub>)</b><span><input aria-label={`${name} x coordinate`} type="number" min="-6" max="6" step="0.5" value={point.x} onChange={(e) => onPoint({ ...point, x: clamp(Number(e.target.value)) })} /><input aria-label={`${name} y coordinate`} type="number" min="-6" max="6" step="0.5" value={point.y} onChange={(e) => onPoint({ ...point, y: clamp(Number(e.target.value)) })} /></span></div>;
}
function InfoPanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section className="sg204-info"><h2><i>{icon}</i>{title}</h2><div>{children}</div></section>;
}
function MiniGraph({ show }: { show: boolean }) {
  const sx=(x:number)=>145+x*20, sy=(y:number)=>93-y*20;
  return <svg className="sg204-mini" viewBox="0 0 290 190" role="img" aria-label="Challenge coordinate plane for segment A negative two negative one to B three four"><defs><pattern id="sg204-mini-grid" width="20" height="20" patternUnits="userSpaceOnUse" x="145" y="93"><path d="M20 0H0V20" fill="none" stroke="#dce5ef" strokeDasharray="2 2" /></pattern></defs><rect width="290" height="190" fill="url(#sg204-mini-grid)"/><line x1="10" y1="93" x2="280" y2="93" className="axis"/><line x1="145" y1="8" x2="145" y2="182" className="axis"/>{show && <><line x1={sx(-2)} y1={sy(-1)} x2={sx(3)} y2={sy(4)} className="solution"/><circle cx={sx(-2)} cy={sy(-1)} r="5"/><circle cx={sx(3)} cy={sy(4)} r="5"/></>}</svg>;
}

export default function SegmentTargetLesson204({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [history, setHistory] = useState<Pair[]>([INITIAL]), [index, setIndex] = useState(0), points = history[index];
  const [snap, setSnap] = useState(true), [stage, setStage] = useState("Observe"), [compare, setCompare] = useState<Mode>("none"), [tool, setTool] = useState<Tool>("select"), [solution, setSolution] = useState(false), [answer, setAnswer] = useState<"idle"|"correct"|"incorrect">("idle"), [shared, setShared] = useState(false), [workspace, setWorkspace] = useState(false), [language, setLanguage] = useState("English (English)");
  const editRef = useRef<{ name: keyof Pair; time: number; start: number } | null>(null);
  const result = useMemo(() => metrics(points), [points]);
  const commit = (name: keyof Pair, point: Point) => {
    const next = { ...points, [name]: point }, now = Date.now();
    const grouped = editRef.current?.name === name && now - editRef.current.time < 250;
    const start = grouped ? editRef.current!.start : index;
    setHistory((current) => [...current.slice(0, start + 1), next]);
    setIndex(start + 1);
    editRef.current = { name, time: now, start };
    setAnswer("idle");
    onInteraction();
  };
  const reset = () => { setHistory([INITIAL]); setIndex(0); setCompare("none"); setTool("select"); setSolution(false); setAnswer("idle"); onInteraction(); };
  useEffect(() => { setHistory([INITIAL]); setIndex(0); setSnap(true); setStage("Observe"); setCompare("none"); setTool("select"); setSolution(false); setAnswer("idle"); setShared(false); setWorkspace(false); }, [resetToken]);
  const stages = [["Observe",<Eye key="o"/>],["Manipulate",<MousePointer2 key="m"/>],["Notice",<Lightbulb key="n"/>],["Understand",<BookOpen key="u"/>],["Try",<Target key="t"/>]] as const;
  const tools: [Tool, ReactNode, string][] = [["select",<MousePointer2/>,"Select endpoints"],["point",<CircleDot/>,"Place nearest endpoint"],["segment",<MoveDiagonal2/>,"Show segment"],["ray",<ArrowRight/>,"Compare ray"],["settings",<Grid3X3/>,"Toggle snap"]];
  return <section className={`sg204-page ${workspace ? "workspace" : ""}`} data-testid="dynamic-geometry-mockup-0261" data-model="finite-two-endpoint-distance-midpoint-comparison" data-a={`${points.A.x}:${points.A.y}`} data-b={`${points.B.x}:${points.B.y}`} data-length={result.length} data-midpoint={`${result.midpoint.x}:${result.midpoint.y}`} data-snap={snap} data-stage={stage} data-compare={compare} data-tool={tool} data-history={`${index}:${history.length}`} data-solution={solution} data-shared={shared}>
    <header className="sg204-header"><small>DYNAMIC GEOMETRY CONSTRUCTIONS</small><h1>{lesson.title}</h1><p>Construct finite line segments and explore their properties.</p><div className="badges"><b>Foundation / Advanced</b><b>Construction Studio</b><b>Geometry Tools</b><b>6-10 min</b></div><nav><label><Languages/><select aria-label="Lesson language" value={language} onChange={(e)=>{setLanguage(e.target.value);onInteraction();}}><option>English (English)</option><option>Hindi (Hindi)</option></select><ChevronDown/></label><button type="button" onClick={reset}><RotateCcw/>Reset</button><button type="button" disabled={!index} onClick={()=>{setIndex(i=>i-1);onInteraction();}}><Undo2/>Undo</button><button type="button" disabled={index===history.length-1} onClick={()=>{setIndex(i=>i+1);onInteraction();}}><Redo2/>Redo</button><button type="button" onClick={async()=>{setShared(true);await globalThis.navigator?.clipboard?.writeText(globalThis.location?.href ?? "").catch(()=>{});onInteraction();}}><Share2/>{shared ? "Shared" : "Share"}</button><button type="button" aria-pressed={workspace} onClick={()=>{setWorkspace(v=>!v);onInteraction();}}><Maximize2/>Workspace</button></nav></header>
    <nav className="sg204-stages" aria-label="Segment lesson stages">{stages.map(([name,icon])=><button type="button" key={name} className={stage===name?"active":""} onClick={()=>{setStage(name);onInteraction();}}>{icon}{name}</button>)}</nav>
    <div className="sg204-main"><section className="sg204-construction"><header><div><h2>Construct a segment</h2><p>Drag points A and B to change the segment.</p></div><button type="button" aria-pressed={snap} onClick={()=>{setSnap(v=>!v);onInteraction();}}>Snap<i className={snap?"on":""}/></button></header><div className="sg204-tools">{tools.map(([name,icon,label])=><button type="button" aria-label={label} className={tool===name?"active":""} key={name} onClick={()=>{setTool(name);if(name==="segment")setCompare("none");if(name==="ray")setCompare("ray");if(name==="settings")setSnap(v=>!v);onInteraction();}}>{icon}</button>)}</div><SegmentCanvas points={points} snap={snap} mode={compare} tool={tool} onPoint={commit}/><section className="coordinate-tray"><div><p>Point coordinates</p><aside><PointInputs name="A" point={points.A} onPoint={(p)=>commit("A",p)}/><PointInputs name="B" point={points.B} onPoint={(p)=>commit("B",p)}/></aside></div><div><p>Segment length</p><strong><span className="overline">AB</span> = {result.length.toFixed(2)} units</strong></div></section><div className="compare"><b>Compare with</b>{(["line","ray","none"] as Mode[]).map(mode=><button type="button" key={mode} className={compare===mode?"active":""} onClick={()=>{setCompare(mode);onInteraction();}}>{mode}</button>)}</div></section>
    <aside className="sg204-side"><InfoPanel title="Instant observation" icon={<Eye/>}><p>Length</p><strong className="blue">AB = {result.length.toFixed(2)} units</strong><p>Midpoint</p><strong className="purple">M ({result.midpoint.x.toFixed(2)}, {result.midpoint.y.toFixed(2)})</strong><p>Distance formula check</p><b className="formula">sqrt(({points.B.x} - ({points.A.x}))^2 + ({points.B.y} - {points.A.y})^2) = {result.length.toFixed(2)}</b></InfoPanel><InfoPanel title="Construction steps" icon={<Lightbulb/>}><ol><li><i>1</i>Place point A.</li><li><i>2</i>Place point B.</li><li><i>3</i><span>The segment AB is drawn.<b>Its length is the distance between A and B.</b></span></li></ol></InfoPanel><InfoPanel title="Definition & insight" icon={<BookOpen/>}><p>A segment is the part of a line between two endpoints.</p><p>Notation: <span className="overline">AB</span> or AB</p><p>Length (Distance formula):<b className="formula">AB = sqrt((x2 - x1)^2 + (y2 - y1)^2)</b></p></InfoPanel></aside></div>
    <section className="sg204-practice"><header><h2>Try it yourself</h2><p>Construct a segment with the given endpoints and verify its length.</p></header><div><article><b>Your task</b><p>Set A (-2, -1) and B (3, 4). Construct AB and find its length.</p><small>Hint: Drag points or enter coordinates.</small><button type="button" onClick={()=>{const ok=points.A.x===TASK.A.x&&points.A.y===TASK.A.y&&points.B.x===TASK.B.x&&points.B.y===TASK.B.y;setAnswer(ok?"correct":"incorrect");onInteraction();}}><Check/>Check Answer</button>{answer!=="idle"&&<strong role="status" className={answer}>{answer==="correct"?"Correct. AB = sqrt(50) = 7.07 units.":"Set both endpoints to the requested coordinates."}</strong>}</article><MiniGraph show={solution}/><aside><b>Answer preview</b><p>A (-2, -1)<br/>B (3, 4)</p><p>Expected length</p><strong>AB = 7.07 units</strong><button type="button" onClick={()=>{setSolution(v=>!v);onInteraction();}}><Eye/>{solution?"Hide Solution":"Show Solution"}</button></aside></div></section>
    <nav className="sg204-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/203-line-through-two-points"><ArrowLeft/><span><small>Previous</small>Line Through Two Points</span></a><a href="/lessons/geometry/205-segment-with-given-length"><span><small>Next</small>Segment with Given Length</span><ArrowRight/></a></nav>
    <footer className="sg204-footer"><b>Math Universe</b><span>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</span><nav><a href="/">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.<br/>www.IndianServers.com info@IndianServers.com</small></footer>
  </section>;
}
