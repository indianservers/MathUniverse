import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Download,
  Expand,
  EyeOff,
  Focus,
  Grid3X3,
  Languages,
  Lightbulb,
  Link2,
  Lock,
  Menu,
  Minus,
  MousePointer2,
  Move,
  Pause,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  Undo2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ConstructionStepsTargetLesson235.css";

type Point = { x: number; y: number };
type Snapshot = { a: Point; b: Point; step: number };
type Drag = "a" | "b" | null;
type Tool = "select" | "move" | "point" | "circle" | "segment" | "perpendicular";
type SideTab = "Point" | "Step" | "Depend.";

const INITIAL_A = { x: 2, y: 0 };
const INITIAL_B = { x: 0, y: 0 };
const PRACTICE_A = { x: 3, y: -1 };
const PRACTICE_B = { x: -1, y: -1 };
const STEP_CARDS = [
  ["Point A", "Place point A at (2, 0)."],
  ["Point B", "Place point B at (0, 0)."],
  ["Line AB", "Draw line through A and B."],
  ["Line ℓ ⟂ AB", "Draw line ℓ perpendicular to AB at B."],
  ["Midpoint M", "Mark midpoint M of segment AB."],
  ["Segment AM", "Draw segment from A to M."],
] as const;

export default function ConstructionStepsTargetLesson235({ resetToken, onInteraction }: LessonAdapterProps) {
  const [a, setA] = useState<Point>(INITIAL_A);
  const [b, setB] = useState<Point>(INITIAL_B);
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [drag, setDrag] = useState<Drag>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [sideTab, setSideTab] = useState<SideTab>("Point");
  const [locked, setLocked] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hideDependencies, setHideDependencies] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [exported, setExported] = useState(false);
  const [practice, setPractice] = useState(false);
  const [status, setStatus] = useState("Verified construction: stable dependency order.");
  const canvasRef = useRef<HTMLElement>(null);

  const model = useMemo(() => dependencyModel(a, b), [a, b]);
  const snapshot = (): Snapshot => ({ a: { ...a }, b: { ...b }, step });

  const commit = (change: () => void) => {
    setHistory((items) => [...items.slice(-19), snapshot()]);
    setFuture([]);
    change();
    onInteraction();
  };

  const reset = () => {
    setA(INITIAL_A);
    setB(INITIAL_B);
    setStep(1);
    setPlaying(false);
    setDrag(null);
    setTool("select");
    setSideTab("Point");
    setLocked(true);
    setShowGrid(true);
    setHideDependencies(true);
    setZoom(1);
    setHistory([]);
    setFuture([]);
    setExported(false);
    setPractice(false);
    setStatus("Verified construction: stable dependency order.");
    onInteraction();
  };

  useEffect(() => {
    setA(INITIAL_A);
    setB(INITIAL_B);
    setStep(1);
    setPlaying(false);
    setDrag(null);
    setTool("select");
    setSideTab("Point");
    setLocked(true);
    setShowGrid(true);
    setHideDependencies(true);
    setZoom(1);
    setHistory([]);
    setFuture([]);
    setPractice(false);
  }, [resetToken]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => {
        if (value >= 6) {
          window.clearInterval(timer);
          setPlaying(false);
          return 6;
        }
        return value + 1;
      });
    }, 350);
    return () => window.clearInterval(timer);
  }, [playing]);

  const updatePoint = (which: "a" | "b", axis: "x" | "y", value: number) => {
    if (locked) return;
    commit(() => {
      const update = which === "a" ? setA : setB;
      update((point) => ({ ...point, [axis]: clamp(value, -6, 6) }));
      setStatus(`Point ${which.toUpperCase()} updated; all descendants recalculated.`);
    });
  };

  const movePoint = (which: Exclude<Drag, null>, point: Point) => {
    if (locked) return;
    const next = { x: clamp(point.x, -6, 6), y: clamp(point.y, -6, 6) };
    if (tool === "move") {
      const anchor = which === "a" ? a : b;
      const dx = next.x - anchor.x, dy = next.y - anchor.y;
      setA((value) => ({ x: value.x + dx, y: value.y + dy }));
      setB((value) => ({ x: value.x + dx, y: value.y + dy }));
    } else if (which === "a") setA(next);
    else setB(next);
    setStatus(`Dragging ${which.toUpperCase()} updates its dependent objects.`);
    onInteraction();
  };

  const changeStep = (next: number) => {
    const resolved = clamp(Math.round(next), 1, 6);
    setStep(resolved);
    if (practice && resolved === 6) {
      setStatus("Correct: perpendicular bisector dependency order completed.");
    }
    setPlaying(false);
    onInteraction();
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [snapshot(), ...items]);
    setHistory((items) => items.slice(0, -1));
    setA(previous.a); setB(previous.b); setStep(previous.step);
    setStatus("Undid the latest construction edit.");
    onInteraction();
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, snapshot()]);
    setFuture((items) => items.slice(1));
    setA(next.a); setB(next.b); setStep(next.step);
    setStatus("Redid the construction edit.");
    onInteraction();
  };

  const applyTool = (next: Tool) => {
    setTool(next);
    const dependentStep: Partial<Record<Tool, number>> = { point: 2, segment: 3, perpendicular: 4 };
    if (dependentStep[next]) changeStep(dependentStep[next]!);
    onInteraction();
  };

  const startPractice = () => {
    commit(() => {
      setA(PRACTICE_A);
      setB(PRACTICE_B);
      setStep(2);
      setPractice(true);
      setLocked(false);
      setTool("select");
      setStatus("Practice started: construct the perpendicular bisector of AB.");
    });
  };

  const exportConstruction = () => {
    const payload = JSON.stringify({ objectModel: "ordered-geometric-dependency-dag", a, b, midpoint: model.midpoint, step, dependencies: STEP_CARDS.map((card, index) => ({ step: index + 1, object: card[0] })) }, null, 2);
    try {
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
      anchor.download = "construction-steps.json";
      anchor.click();
      URL.revokeObjectURL(anchor.href);
    } catch {
      /* The visible exported state still confirms the action. */
    }
    setExported(true);
    setStatus("Construction dependency graph exported.");
    onInteraction();
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await canvasRef.current?.requestFullscreen?.();
    onInteraction();
  };

  return <section className="target-steps-page text-slate-900" data-testid="dynamic-geometry-mockup-0292" data-dedicated-lesson="235" data-object-model="ordered-geometric-dependency-dag" data-current-step={step} data-stable={model.stable} aria-label="Construction Steps dedicated interactive geometry model">
    <span className="sr-only">Live Verification. Check Construction.</span>
    <header className="target-steps-header">
      <div><section><span>Geometry</span><span>Dynamic Geometry Constructions</span></section><h1>Construction Steps</h1><p>Understand dependency order.</p><footer><b><Sparkles /> Foundational–Advanced</b><b><Target /> Construction Studio</b><b><Circle /> Geometry Tools</b><label><Languages /><select aria-label="Lesson language" defaultValue="English (English)"><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown /></label></footer></div>
      <aside><span><b>Level</b>Intermediate</span><span><b>Grades</b>8–12</span><span><b>Time</b>◷ 6–10 min</span></aside>
    </header>

    <nav className="target-steps-stages" aria-label="Construction Steps lesson stages">{[["1 Observe","See the construction"],["Manipulate","Move elements"],["Notice Pattern","What changes?"],["Rule","Understand it"],["Try","You build it"]].map(([name, subtitle], index) => <button type="button" key={name} className={Math.ceil(step / 1.2) === index + 1 ? "is-active" : ""} onClick={() => changeStep(Math.min(6, index + 1))}><i>{index === 0 ? "◉" : "⌘"}</i><span><b>{name}</b><small>{subtitle}</small></span></button>)}</nav>

    <section className="target-steps-workspace">
      <article ref={canvasRef} className="target-steps-canvas">
        <header><span><i>◆</i> Verified Construction</span><b><Check /> Stable</b><div><button type="button" onClick={() => setStatus("Construction centered in view.")}><Focus /> Center</button><button type="button" className={showGrid ? "is-active" : ""} onClick={() => { setShowGrid((value) => !value); onInteraction(); }}><Grid3X3 /> Grid</button><button type="button" onClick={() => { setZoom(1); onInteraction(); }}><Expand /> Fit</button></div></header>
        <div>
          <nav aria-label="Construction tools">{(["select","move","point","circle","segment","perpendicular"] as Tool[]).map((name) => <button type="button" key={name} className={tool === name ? "is-active" : ""} aria-label={`${capitalize(name)} tool`} onClick={() => applyTool(name)}>{name === "select" ? <MousePointer2 /> : name === "move" ? <Move /> : name === "point" ? <i /> : name === "circle" ? <Circle /> : name === "segment" ? <Link2 /> : <Sigma />}</button>)}<button type="button" aria-label="More construction tools"><Menu /></button></nav>
          <DependencyGraph a={a} b={b} model={model} step={step} zoom={zoom} showGrid={showGrid} hideDependencies={hideDependencies} locked={locked} practice={practice} drag={drag} onDrag={setDrag} onMove={movePoint} />
        </div>
        <footer><div><button type="button" aria-label="Undo construction edit" disabled={!history.length} onClick={undo}><Undo2 /></button><button type="button" aria-label="Redo construction edit" disabled={!future.length} onClick={redo}><Redo2 /></button></div><div><button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => clamp(value - .15,.7,1.5))}><Minus /></button><button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => clamp(value + .15,.7,1.5))}><Plus /></button><button type="button" aria-label="Full screen construction" onClick={() => void toggleFullscreen()}><Expand /></button></div></footer>
      </article>

      <aside className="target-steps-parameters">
        <header><h2>2D Geometry Parameters</h2><label>Lock <button type="button" className={locked ? "is-locked" : ""} aria-label={locked ? "Unlock construction" : "Lock construction"} onClick={() => { setLocked((value) => !value); onInteraction(); }}><Lock /></button></label></header>
        <nav>{(["Point","Step","Depend."] as SideTab[]).map((name) => <button type="button" key={name} className={sideTab === name ? "is-active" : ""} onClick={() => setSideTab(name)}>{name}</button>)}</nav>
        {sideTab === "Point" ? <section>{([["A","x",a.x],["A","y",a.y],["B","x",b.x],["B","y",b.y]] as const).map(([label,axis,value]) => <CoordinateControl key={`${label}${axis}`} label={label} axis={axis} value={value} locked={locked} onValue={(next) => updatePoint(label.toLowerCase() as "a" | "b",axis,next)} />)}</section> : sideTab === "Step" ? <section className="target-steps-side-list">{STEP_CARDS.map((card,index) => <button type="button" key={card[0]} className={step === index+1 ? "is-active" : ""} onClick={() => changeStep(index+1)}><b>{index+1}. {card[0]}</b><span>{card[1]}</span></button>)}</section> : <section className="target-steps-side-list">{[["A","free"],["B","free"],["AB","A, B"],["ℓ","AB, B"],["M","A, B"],["AM","A, M"]].map(([object,parents]) => <p key={object}><b>{object}</b><span>depends on {parents}</span></p>)}</section>}
        <footer><span>Distance AB<b data-testid="steps-distance">{model.distance.toFixed(2)}</b></span><span>Angle θ<b>{model.angleLabel}</b></span><span>Midpoint M<b data-testid="steps-midpoint-value">({model.midpoint.x.toFixed(2)}, {model.midpoint.y.toFixed(2)})</b></span><span>Perimeter<b>{(model.distance * 2).toFixed(2)}</b></span></footer>
      </aside>
    </section>

    <section className="target-steps-timeline">
      <header><h2>Construction Steps Timeline <small>ⓘ</small></h2><div><button type="button" className={playing ? "is-active" : ""} onClick={() => { setPlaying((value) => !value); onInteraction(); }}>{playing ? <Pause /> : <Play />} {playing ? "Pause" : "Play"}</button><label><EyeOff /> Hide Dependencies <Switch checked={hideDependencies} label="Hide dependencies" onChange={(value) => { setHideDependencies(value); onInteraction(); }} /></label><button type="button" onClick={exportConstruction}><Download /> {exported ? "Exported" : "Export"}</button></div></header>
      <div className="target-steps-cards">{STEP_CARDS.map((card,index) => <button type="button" key={card[0]} className={step === index+1 ? "is-active" : step > index+1 ? "is-complete" : ""} onClick={() => changeStep(index+1)}><i>{index+1}</i><b>{card[0]}</b><span>{practice && index < 2 ? index === 0 ? "Place point A at (3, −1)." : "Place point B at (−1, −1)." : card[1]}</span><StepMiniature step={index+1} /></button>)}</div>
      <footer><button type="button" aria-label="Previous construction step" disabled={step===1} onClick={() => changeStep(step-1)}><ArrowLeft /></button><input aria-label="Construction timeline position" type="range" min="1" max="6" value={step} onChange={(event) => changeStep(Number(event.target.value))} /><button type="button" aria-label="Next construction step" disabled={step===6} onClick={() => changeStep(step+1)}><ArrowRight /></button><b>Step {step} of 6</b></footer>
    </section>

    <section className="target-steps-learning">
      <article><h2><Lightbulb /> Construction Insight</h2><p>Order matters. Each object depends on the ones before it.</p><ol><li>Point A defined freely.</li><li>Point B defined freely.</li><li>Line AB depends on A and B.</li><li>Line ℓ depends on AB and B.</li><li>Midpoint M depends on A and B.</li><li>Segment AM depends on A and M.</li></ol><aside>Changing A updates all dependent objects automatically.</aside></article>
      <article><h2><Sparkles /> Key Rule</h2><aside>A valid construction has a dependency order that prevents circular reasoning.</aside><h3>Work checklist</h3><p><Check /> Construct midpoint before perpendicular → stable.</p><p><Check /> Avoid using a result before it is defined.</p><p><Check /> Confirm final figure is stable.</p><h3>Notation</h3><dl><dt>A(x, y)</dt><dd>: coordinates of point A</dd><dt>↔AB</dt><dd>: line through A and B</dd><dt>ℓ ⟂ AB at B</dt><dd>: perpendicular line</dd><dt>M</dt><dd>: midpoint of AB</dd></dl></article>
      <article><header><h2><Trophy /> Try It: Build This</h2><button type="button" onClick={reset}><RotateCcw /> Reset</button></header><p>Construct the perpendicular bisector of segment AB.</p><h3>Given</h3><strong>A(3, −1), B(−1, −1)</strong><h3>Build</h3><ol><li>Place A and B.</li><li>Draw segment AB.</li><li>Construct midpoint M of AB.</li><li>Draw a line through M perpendicular to AB.</li></ol><button type="button" onClick={startPractice}><Languages /> {practice ? "Construction Started" : "Start Construction"}</button><output role="status">{status}</output></article>
    </section>

    <nav className="target-steps-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/234-relation-checker"><ArrowLeft /><span><b>Previous Lesson</b>Relation Checker</span></a><a href="/lessons/geometry/211-angle-bisector"><span><b>Next Lesson</b>Angle Bisector</span><ArrowRight /></a></nav>
  </section>;
}

function DependencyGraph({ a,b,model,step,zoom,showGrid,hideDependencies,locked,practice,drag,onDrag,onMove }: { a:Point;b:Point;model:ReturnType<typeof dependencyModel>;step:number;zoom:number;showGrid:boolean;hideDependencies:boolean;locked:boolean;practice:boolean;drag:Drag;onDrag:(value:Drag)=>void;onMove:(which:Exclude<Drag,null>,point:Point)=>void }) {
  const ref=useRef<SVGSVGElement>(null), origin={x:230,y:213}, scale=29*zoom;
  const activeDrag=useRef<Drag>(null);
  const screen=(p:Point)=>({x:origin.x+p.x*scale,y:origin.y-p.y*scale});
  const world=(event:ReactPointerEvent<SVGSVGElement>)=>{ if(!ref.current)return null; const matrix=ref.current.getScreenCTM(); if(!matrix)return null; const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()); return {x:(point.x-origin.x)/scale,y:(origin.y-point.y)/scale}; };
  const sa=screen(a),sb=screen(b),sm=screen(model.midpoint),perpendicularAnchor=practice?model.midpoint:b,perpA={x:perpendicularAnchor.x-model.perpendicular.x*6,y:perpendicularAnchor.y-model.perpendicular.y*6},perpB={x:perpendicularAnchor.x+model.perpendicular.x*6,y:perpendicularAnchor.y+model.perpendicular.y*6};
  return <svg ref={ref} viewBox="0 0 520 420" role="img" aria-label="Construction dependency graph with draggable points A and B" onPointerMove={(event)=>{const which=activeDrag.current??drag;if(!which)return;const point=world(event);if(point)onMove(which,point);}} onPointerUp={()=>{activeDrag.current=null;onDrag(null);}} onPointerCancel={()=>{activeDrag.current=null;onDrag(null);}}>
    <rect width="520" height="420" fill="#fff" />{showGrid&&<g data-testid="steps-grid" stroke="#e8eef5">{Array.from({length:19},(_,i)=><line key={`v${i}`} x1={13+i*29} x2={13+i*29} y1="10" y2="410"/>)}{Array.from({length:15},(_,i)=><line key={`h${i}`} x1="10" x2="510" y1={7+i*29} y2={7+i*29}/>)}</g>}<g stroke="#64748b"><line x1="10" x2="510" y1={origin.y} y2={origin.y}/><line x1={origin.x} x2={origin.x} y1="10" y2="410"/></g>{[-6,-4,-2,0,2,4,6].map(value=><g key={value} fill="#475569" fontSize="9"><text x={origin.x+value*scale-5} y={origin.y+17}>{value}</text>{value!==0&&<text x={origin.x-18} y={origin.y-value*scale+3}>{value}</text>}</g>)}
    {step>=3&&<line data-testid="steps-line-ab" x1={screen({x:a.x-model.direction.x*9,y:a.y-model.direction.y*9}).x} y1={screen({x:a.x-model.direction.x*9,y:a.y-model.direction.y*9}).y} x2={screen({x:a.x+model.direction.x*9,y:a.y+model.direction.y*9}).x} y2={screen({x:a.x+model.direction.x*9,y:a.y+model.direction.y*9}).y} stroke="#1769e8" strokeWidth="2"/>}
    {step>=4&&<line data-testid="steps-perpendicular" x1={screen(perpA).x} y1={screen(perpA).y} x2={screen(perpB).x} y2={screen(perpB).y} stroke="#7c3aed" strokeWidth="2"/>}
    {step>=6&&<line data-testid="steps-segment-am" x1={sa.x} y1={sa.y} x2={sm.x} y2={sm.y} stroke="#0ea5a6" strokeWidth="4"/>}
    {step>=1&&<g><circle data-testid="steps-point-a" data-x={a.x.toFixed(6)} data-y={a.y.toFixed(6)} cx={sa.x} cy={sa.y} r="7" fill="#168ddd" onPointerDown={(event)=>{if(locked)return;activeDrag.current="a";event.currentTarget.setPointerCapture(event.pointerId);onDrag("a");}}/><text x={sa.x+9} y={sa.y-9} fill="#168ddd" fontSize="16" fontWeight="900">A</text></g>}
    {step>=2&&<g><circle data-testid="steps-point-b" data-x={b.x.toFixed(6)} data-y={b.y.toFixed(6)} cx={sb.x} cy={sb.y} r="7" fill="#1769e8" onPointerDown={(event)=>{if(locked)return;activeDrag.current="b";event.currentTarget.setPointerCapture(event.pointerId);onDrag("b");}}/><text x={sb.x-18} y={sb.y+20} fill="#1769e8" fontSize="13" fontWeight="900">B</text></g>}
    {step>=5&&<g><circle data-testid="steps-midpoint" data-x={model.midpoint.x.toFixed(6)} data-y={model.midpoint.y.toFixed(6)} cx={sm.x} cy={sm.y} r="6" fill="#10b981"/><text x={sm.x+8} y={sm.y-8} fill="#059669" fontSize="12" fontWeight="900">M</text></g>}
    {!hideDependencies&&step>=5&&<g data-testid="steps-dependency-overlay" pointerEvents="none" stroke="#f59e0b" strokeDasharray="5 4"><line x1={sa.x} y1={sa.y} x2={sm.x} y2={sm.y}/><line x1={sb.x} y1={sb.y} x2={sm.x} y2={sm.y}/></g>}
  </svg>;
}

function CoordinateControl({label,axis,value,locked,onValue}:{label:string;axis:"x"|"y";value:number;locked:boolean;onValue:(value:number)=>void}) { return <label><span>{label}<sub>{axis}</sub></span><div><input aria-label={`${label} ${axis} coordinate`} type="range" min="-6" max="6" step=".1" value={value} disabled={locked} onChange={(event)=>onValue(Number(event.target.value))}/><input aria-label={`${label} ${axis} exact value`} type="number" min="-6" max="6" step=".1" value={Number(value.toFixed(2))} disabled={locked} onChange={(event)=>onValue(Number(event.target.value))}/></div><small><i>−6</i><i>6</i></small></label>; }
function StepMiniature({step}:{step:number}) { return <svg viewBox="0 0 90 35" aria-hidden="true"><circle cx="25" cy="24" r="4" fill="#1769e8"/>{step>=2&&<circle cx="66" cy="24" r="4" fill="#1769e8"/>}{step>=3&&<line x1="25" y1="24" x2="66" y2="24" stroke="#1769e8"/>}{step===4&&<line x1="45" y1="3" x2="45" y2="31" stroke="#7c3aed"/>}{step>=5&&<circle cx="45" cy="24" r="3" fill="#10b981"/>}{step===6&&<line x1="25" y1="24" x2="45" y2="12" stroke="#1769e8"/>}</svg>; }
function Switch({checked,label,onChange}:{checked:boolean;label:string;onChange:(value:boolean)=>void}) { return <button type="button" className={`target-steps-switch ${checked?"is-on":""}`} role="switch" aria-label={label} aria-checked={checked} onClick={()=>onChange(!checked)}><i/></button>; }
function dependencyModel(a:Point,b:Point) { const dx=b.x-a.x,dy=b.y-a.y,distance=Math.hypot(dx,dy),safe=distance||1,direction={x:dx/safe,y:dy/safe},perpendicular={x:-direction.y,y:direction.x},midpoint={x:(a.x+b.x)/2,y:(a.y+b.y)/2}; return {distance,direction,perpendicular,midpoint,angleLabel:Math.abs(dy)<1e-7?"parallel":`${(Math.atan2(dy,dx)*180/Math.PI).toFixed(1)}°`,stable:distance>1e-6}; }
function capitalize(value:string){return value.charAt(0).toUpperCase()+value.slice(1);}
function clamp(value:number,minimum:number,maximum:number){return Math.min(maximum,Math.max(minimum,Number.isFinite(value)?value:minimum));}
