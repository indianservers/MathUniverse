import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Lightbulb,
  MoreHorizontal,
  Printer,
  RefreshCcw,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ReflectionLineTargetLesson237.css";

type Point = { x: number; y: number };
type Orientation = "vertical" | "horizontal";
type Drag = "point" | "line" | null;
type SideTab = "Objects" | "Line";

const INITIAL_POINT = { x: -4, y: 2 };
const INITIAL_LINE = 1;
const PRACTICE_POINT = { x: 3, y: 4 };
const PRACTICE_LINE = 1;
const STAGES = ["Observe", "Manipulate", "Notice", "Understand", "Try"];

export default function ReflectionLineTargetLesson237({ resetToken, onInteraction }: LessonAdapterProps) {
  const [point, setPoint] = useState<Point>(INITIAL_POINT);
  const [orientation, setOrientation] = useState<Orientation>("vertical");
  const [line, setLine] = useState(INITIAL_LINE);
  const [showPerpendiculars, setShowPerpendiculars] = useState(true);
  const [folded, setFolded] = useState(false);
  const [stage, setStage] = useState(2);
  const [sideTab, setSideTab] = useState<SideTab>("Objects");
  const [status, setStatus] = useState("Equal perpendicular distances verified.");
  const [practicePoint, setPracticePoint] = useState<Point>(PRACTICE_POINT);
  const [practiceLine, setPracticeLine] = useState(PRACTICE_LINE);
  const [checks, setChecks] = useState([false, false, false, false]);
  const [practiceStatus, setPracticeStatus] = useState("Select each verified reflection property.");

  const model = useMemo(() => reflectionModel(point, orientation, line), [point, orientation, line]);
  const practice = useMemo(() => reflectionModel(practicePoint, "horizontal", practiceLine), [practicePoint, practiceLine]);

  const reset = () => {
    setPoint(INITIAL_POINT);
    setOrientation("vertical");
    setLine(INITIAL_LINE);
    setShowPerpendiculars(true);
    setFolded(false);
    setSideTab("Objects");
    setStatus("Equal perpendicular distances verified.");
    onInteraction();
  };

  useEffect(() => {
    setPoint(INITIAL_POINT);
    setOrientation("vertical");
    setLine(INITIAL_LINE);
    setShowPerpendiculars(true);
    setFolded(false);
    setStage(2);
    setSideTab("Objects");
    setStatus("Equal perpendicular distances verified.");
    setPracticePoint(PRACTICE_POINT);
    setPracticeLine(PRACTICE_LINE);
    setChecks([false, false, false, false]);
    setPracticeStatus("Select each verified reflection property.");
  }, [resetToken]);

  const updatePoint = (axis: "x" | "y", value: number) => {
    setPoint((current) => ({ ...current, [axis]: clamp(value, -6, 6) }));
    setFolded(false);
    setStatus("Point P moved; P' and all reflection measurements recalculated.");
    onInteraction();
  };

  const updateImage = (axis: "x" | "y", value: number) => {
    const next = clamp(value, -6, 6);
    setPoint((current) => {
      if (orientation === "vertical") return axis === "x" ? { ...current, x: 2 * line - next } : { ...current, y: next };
      return axis === "x" ? { ...current, x: next } : { ...current, y: 2 * line - next };
    });
    setFolded(false);
    setStatus("Image P' edited; source P was recovered by the inverse reflection.");
    onInteraction();
  };

  const updateLine = (value: number) => {
    setLine(clamp(value, -5, 5));
    setFolded(false);
    setStatus("Mirror line moved; the reflected image and midpoint updated.");
    onInteraction();
  };

  const share = async () => {
    const summary = `Reflect P${formatPoint(point)} in ${model.equation} to P'${formatPoint(model.image)}.`;
    try { await navigator.clipboard?.writeText(summary); setStatus("Reflection mapping copied for sharing."); }
    catch { setStatus("Reflection summary prepared."); }
    onInteraction();
  };

  const checkPractice = () => {
    const invariant = Math.abs(practice.sourceDistance - practice.imageDistance) < 1e-8 && Math.abs(practice.midpoint.y - practiceLine) < 1e-8;
    const correct = invariant && checks.every(Boolean);
    setPracticeStatus(correct ? "Correct: all line-reflection invariants are verified." : "Not yet: verify all four properties of A and A'.");
    onInteraction();
  };

  return <section className="target-reflection-page text-slate-900" data-testid="dynamic-geometry-mockup-0294" data-dedicated-lesson="237" data-object-model="point-line-orthogonal-reflection" data-orientation={orientation} data-line={line.toFixed(4)} aria-label="Reflection in Line dedicated interactive geometry model">
    <header className="target-reflection-header">
      <ReflectionThumbnail />
      <div><span>Coordinate Geometry</span><h1>Reflection in Line</h1><p>Understand mirror symmetry across a line.</p><footer><b>♙ Intermediate-Advanced</b><b>◇ Investigation Lab</b><b>◷ 6-10 min</b></footer></div>
      <aside><button type="button" onClick={() => void share()}><Share2 /> Share</button><button type="button" onClick={() => window.print()}><Printer /> Print</button><button type="button" aria-label="More lesson actions" onClick={() => { setStatus("More lesson actions opened."); onInteraction(); }}><MoreHorizontal /></button></aside>
    </header>

    <nav className="target-reflection-stages" aria-label="Reflection lesson stages">{STAGES.map((name, index) => <button type="button" key={name} className={stage === index + 1 ? "is-active" : ""} onClick={() => { setStage(index + 1); setStatus(`${name} stage selected.`); onInteraction(); }}><i>{index + 1}</i><b>{name}</b>{index === 1 && <ChevronRight />}</button>)}</nav>

    <section className="target-reflection-workspace">
      <article className="target-reflection-model"><header><div><h2><Sparkles /> Interactive model</h2><p>Drag the mirror line or the point.</p></div><button type="button" onClick={reset}><RotateCcw /> Reset</button></header><div className="target-reflection-tools"><label><input type="checkbox" checked={showPerpendiculars} onChange={(event) => { setShowPerpendiculars(event.target.checked); onInteraction(); }} /> Show perpendiculars</label><button type="button" className={folded ? "is-active" : ""} onClick={() => { setFolded((value) => !value); setStatus(folded ? "Reflection unfolded." : "Image folded onto its source across the mirror line."); onInteraction(); }}>⌘ Fold</button></div><ReflectionGraph point={point} orientation={orientation} line={line} model={model} folded={folded} showPerpendiculars={showPerpendiculars} onPoint={(next) => { setPoint(next); setFolded(false); setStatus("Point P dragged; its image remains exactly reflected."); onInteraction(); }} onLine={updateLine} /></article>
      <aside className="target-reflection-panel"><nav>{(["Objects", "Line"] as SideTab[]).map((name) => <button type="button" key={name} className={sideTab === name ? "is-active" : ""} onClick={() => setSideTab(name)}>{name}</button>)}</nav>{sideTab === "Objects" ? <ObjectsPanel point={point} image={model.image} model={model} onPoint={updatePoint} onImage={updateImage} /> : <LinePanel orientation={orientation} line={line} equation={model.equation} onOrientation={(next) => { setOrientation(next); setLine(next === "vertical" ? 1 : 0); setFolded(false); setStatus(`Mirror changed to a ${next} line.`); onInteraction(); }} onLine={updateLine} />}</aside>
    </section>

    <section className="target-reflection-observe"><Eye /><div><h2>Observe</h2><p>Point P and its image P' are the same perpendicular distance from line l and lie on opposite sides of it.</p></div></section>

    <section className="target-reflection-learning"><article><h2>⌁ Construction steps</h2><ol><li>Draw a line l.</li><li>Draw a line perpendicular to l through P.</li><li>Mark the foot of the perpendicular.</li><li>On the same perpendicular, mark point P' on the opposite side of l such that dist(P, l) = dist(P', l).</li></ol><MiniConstruction /></article><article><h2><Lightbulb /> Insight</h2><h3>Reflection in a line</h3><p>If l is a vertical line x = a, then</p><strong>(x, y) → (2a - x, y)</strong><p>If l is a horizontal line y = b, then</p><strong>(x, y) → (x, 2b - y)</strong><h3>Invariants</h3>{["Distances to the line are equal.","Segment PP' is perpendicular to the line.","Midpoint of PP' lies on the line.","Lengths and angles are preserved."].map((text) => <p className="target-reflection-check" key={text}><CheckCircle2 /> {text}</p>)}</article><article><h2>◉ Quick check</h2><p className="formula">dist(P, l) = |x - a| = |{format(point.x)} - {format(line)}| = {format(model.sourceDistance)}</p><p className="formula">dist(P', l) = |x' - a| = |{format(model.image.x)} - {format(line)}| = {format(model.imageDistance)}</p><h3>Midpoint of PP'</h3><strong className="midpoint">(({format(point.x)} + {format(model.image.x)}) / 2, ({format(point.y)} + {format(model.image.y)}) / 2) = {formatPoint(model.midpoint)}</strong><p className="formula">lies on {model.equation} <CheckCircle2 /></p></article></section>

    <section className="target-reflection-practice"><header><h2>◇ Try it yourself</h2><p>Reflect A across the line l : y = {format(practiceLine)}.</p><small>Drag point A to any location, then drag the line l.</small></header><PracticeReflectionGraph point={practicePoint} line={practiceLine} model={practice} onPoint={(next) => { setPracticePoint(next); setChecks([false,false,false,false]); setPracticeStatus("Practice point moved; verify the new reflection."); onInteraction(); }} onLine={(next) => { setPracticeLine(next); setChecks([false,false,false,false]); setPracticeStatus("Practice line moved; verify the new reflection."); onInteraction(); }} /><aside><button type="button" onClick={checkPractice}>Check my work</button>{["A and A' are the same distance from l.","AA' is perpendicular to l.","Midpoint of AA' lies on l.",`Coordinates follow the rule (x, y) → (x, 2·${format(practiceLine)} - y).`].map((label,index) => <label key={label}><input type="checkbox" aria-label={label} checked={checks[index]} onChange={(event) => setChecks((current) => current.map((value,currentIndex) => currentIndex === index ? event.target.checked : value))} />{label}</label>)}<button type="button" onClick={() => { setPracticePoint(PRACTICE_POINT); setPracticeLine(PRACTICE_LINE); setChecks([false,false,false,false]); setPracticeStatus("Practice reset to A(3, 4) and l: y = 1."); onInteraction(); }}><RefreshCcw /> Reset</button><output role="status">{practiceStatus}</output></aside></section>

    <nav className="target-reflection-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/236-translation-by-vector"><ArrowLeft /><span><b>Previous</b>Translation by Vector</span></a><div><span>Lesson progress</span>{[1,2,3,4,5].map((value) => <button type="button" key={value} className={stage === value ? "is-active" : ""} onClick={() => setStage(value)}>{value}</button>)}</div><a href="/lessons/geometry/238-reflection-in-point"><span><b>Next</b>Reflection in Point</span><ArrowRight /></a></nav>
    <span className="sr-only" role="status">{status}</span>
  </section>;
}

function ReflectionGraph({ point, orientation, line, model, folded, showPerpendiculars, onPoint, onLine }: { point: Point; orientation: Orientation; line: number; model: ReturnType<typeof reflectionModel>; folded: boolean; showPerpendiculars: boolean; onPoint: (value: Point) => void; onLine: (value: number) => void }) {
  const image = folded ? point : model.image;
  return <ReflectionPlane className="target-reflection-main-graph" label="Interactive point and mirror line reflection graph" point={point} image={image} orientation={orientation} line={line} origin={{x:235,y:210}} scale={35} showPerpendiculars={showPerpendiculars} onPoint={onPoint} onLine={onLine} />;
}

function PracticeReflectionGraph({ point, line, model, onPoint, onLine }: { point: Point; line: number; model: ReturnType<typeof reflectionModel>; onPoint: (value: Point) => void; onLine: (value: number) => void }) {
  return <ReflectionPlane className="target-reflection-practice-graph" label="Practice horizontal line reflection graph" point={point} image={model.image} orientation="horizontal" line={line} origin={{x:127,y:107}} scale={23} showPerpendiculars={false} onPoint={onPoint} onLine={onLine} />;
}

function ReflectionPlane({ className, label, point, image, orientation, line, origin, scale, showPerpendiculars, onPoint, onLine }: { className: string; label: string; point: Point; image: Point; orientation: Orientation; line: number; origin: Point; scale: number; showPerpendiculars: boolean; onPoint: (value: Point) => void; onLine: (value: number) => void }) {
  const ref = useRef<SVGSVGElement>(null), active = useRef<Drag>(null);
  const practice = className.includes("practice"), width = practice ? 300 : 520, height = practice ? 205 : 410;
  const screen = (value: Point) => ({x:origin.x+value.x*scale,y:origin.y-value.y*scale});
  const world = (event: ReactPointerEvent<SVGSVGElement>) => { const matrix=ref.current?.getScreenCTM(); if(!matrix)return null; const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()); return {x:(p.x-origin.x)/scale,y:(origin.y-p.y)/scale}; };
  const p=screen(point), q=screen(image), linePosition=orientation==="vertical"?screen({x:line,y:0}).x:screen({x:0,y:line}).y;
  const begin=(kind:Exclude<Drag,null>)=>(event:ReactPointerEvent<SVGElement>)=>{active.current=kind;event.currentTarget.setPointerCapture(event.pointerId);};
  return <svg ref={ref} className={className} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} onPointerMove={(event)=>{if(!active.current)return;const next=world(event);if(!next)return;if(active.current==="point")onPoint({x:clamp(roundHalf(next.x),-6,6),y:clamp(roundHalf(next.y),-6,6)});else onLine(clamp(roundHalf(orientation==="vertical"?next.x:next.y),-5,5));}} onPointerUp={()=>{active.current=null;}} onPointerCancel={()=>{active.current=null;}}>
    <rect width={width} height={height} fill="#fff"/><Grid width={width} height={height} origin={origin} scale={scale}/>
    <line data-testid={practice?"reflection-practice-line":"reflection-mirror-line"} data-value={line.toFixed(4)} x1={orientation==="vertical"?linePosition:10} x2={orientation==="vertical"?linePosition:width-10} y1={orientation==="vertical"?8:linePosition} y2={orientation==="vertical"?height-8:linePosition} stroke={practice?"#7c3aed":"#3b82f6"} strokeWidth="2" strokeDasharray="7 5" onPointerDown={begin("line")}/>
    <line x1={orientation==="vertical"?linePosition:10} x2={orientation==="vertical"?linePosition:width-10} y1={orientation==="vertical"?8:linePosition} y2={orientation==="vertical"?height-8:linePosition} stroke="transparent" strokeWidth="18" onPointerDown={begin("line")}/>
    {showPerpendiculars&&<line data-testid="reflection-perpendicular" x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#64748b" strokeWidth="1.4" strokeDasharray="6 5"/>}
    <circle data-testid={practice?"reflection-practice-point":"reflection-source-point"} data-x={point.x.toFixed(4)} data-y={point.y.toFixed(4)} cx={p.x} cy={p.y} r="7" fill="#168ddd" onPointerDown={begin("point")}/><text pointerEvents="none" x={p.x-30} y={p.y-14} fill="#168ddd" fontSize={practice?12:15} fontFamily="Georgia,serif" fontStyle="italic">{practice?`A(${format(point.x)}, ${format(point.y)})`:`P(${format(point.x)}, ${format(point.y)})`}</text>
    <circle data-testid={practice?"reflection-practice-image":"reflection-image-point"} data-x={image.x.toFixed(4)} data-y={image.y.toFixed(4)} cx={q.x} cy={q.y} r="7" fill="#8b5cf6"/><text x={q.x-27} y={q.y-14} fill="#7c3aed" fontSize={practice?12:15} fontFamily="Georgia,serif" fontStyle="italic">{practice?`A'(${format(image.x)}, ${format(image.y)})`:`P'(${format(image.x)}, ${format(image.y)})`}</text>
    <circle data-testid={practice?"reflection-practice-line-handle":"reflection-line-handle"} cx={orientation==="vertical"?linePosition:origin.x} cy={orientation==="vertical"?origin.y:linePosition} r="12" fill="#fff" stroke="#60a5fa" onPointerDown={begin("line")}/><text pointerEvents="none" x={(orientation==="vertical"?linePosition:origin.x)-7} y={(orientation==="vertical"?origin.y:linePosition)+4} fill="#2563eb" fontSize="11">↔</text>
    <text x={orientation==="vertical"?linePosition+10:width-64} y={orientation==="vertical"?25:linePosition-8} fill={practice?"#6d28d9":"#2563eb"} fontSize="13" fontFamily="Georgia,serif" fontStyle="italic">l : {orientation==="vertical"?"x":"y"} = {format(line)}</text>
  </svg>;
}

function ObjectsPanel({point,image,model,onPoint,onImage}:{point:Point;image:Point;model:ReturnType<typeof reflectionModel>;onPoint:(axis:"x"|"y",value:number)=>void;onImage:(axis:"x"|"y",value:number)=>void}) { return <div className="target-reflection-objects"><CoordinatePair color="#168ddd" title="Point P" point={point} prime={false} onValue={onPoint}/><CoordinatePair color="#8b5cf6" title="Image P'" point={image} prime onValue={onImage}/><section><h3>Distances to line {model.equation}</h3><div><span>Left (P)<b data-testid="reflection-source-distance">{format(model.sourceDistance)} units</b></span><span>Right (P')<b data-testid="reflection-image-distance">{format(model.imageDistance)} units</b></span></div><strong>= Equal <Check /></strong></section><section><h3>Coordinate mapping</h3><p>Rule: {model.rule}</p><p>Here, {model.lineVariable} = {format(model.line)}</p><p>{formatPoint(model.source)} → {formatPoint(model.image)}</p></section></div>; }
function CoordinatePair({color,title,point,prime,onValue}:{color:string;title:string;point:Point;prime:boolean;onValue:(axis:"x"|"y",value:number)=>void}) { return <section className="target-reflection-coordinate"><h3><i style={{background:color}}/> {title}</h3><div><label>x{prime&&"′"}<input aria-label={`${title} x coordinate`} type="number" min="-6" max="6" step="1" value={point.x} onChange={(event)=>onValue("x",Number(event.target.value))}/></label><label>y{prime&&"′"}<input aria-label={`${title} y coordinate`} type="number" min="-6" max="6" step="1" value={point.y} onChange={(event)=>onValue("y",Number(event.target.value))}/></label></div></section>; }
function LinePanel({orientation,line,equation,onOrientation,onLine}:{orientation:Orientation;line:number;equation:string;onOrientation:(value:Orientation)=>void;onLine:(value:number)=>void}) { return <div className="target-reflection-line-panel"><h3>Mirror line</h3><div>{(["vertical","horizontal"] as Orientation[]).map((value)=><button type="button" key={value} className={orientation===value?"is-active":""} onClick={()=>onOrientation(value)}>{value}</button>)}</div><label>Line position<input aria-label="Mirror line position" type="range" min="-5" max="5" step=".5" value={line} onChange={(event)=>onLine(Number(event.target.value))}/><input aria-label="Mirror line exact value" type="number" min="-5" max="5" step=".5" value={line} onChange={(event)=>onLine(Number(event.target.value))}/></label><aside><b>Equation</b><strong>{equation}</strong></aside><p>Drag the line or edit its coordinate. Every image point remains the same perpendicular distance away.</p></div>; }
function ReflectionThumbnail(){return <svg viewBox="0 0 118 118" aria-hidden="true"><defs><pattern id="reflection-thumb-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#e2e8f0"/></pattern></defs><rect width="118" height="118" fill="url(#reflection-thumb-grid)"/><line x1="59" x2="59" y1="4" y2="114" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 4"/><circle cx="18" cy="62" r="6" fill="#168ddd"/><circle cx="100" cy="40" r="6" fill="#7c3aed"/></svg>;}
function MiniConstruction(){return <svg viewBox="0 0 210 90" aria-hidden="true"><line x1="105" x2="105" y1="3" y2="87" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4"/><line x1="30" x2="180" y1="49" y2="49" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 4"/><circle cx="30" cy="49" r="6" fill="#168ddd"/><circle cx="180" cy="49" r="6" fill="#8b5cf6"/><text x="25" y="32" fill="#168ddd">P</text><text x="176" y="32" fill="#7c3aed">P'</text><text x="100" y="15" fill="#7c3aed">l</text><path d="M105 49v-10h10" fill="none" stroke="#64748b"/></svg>;}
function Grid({width,height,origin,scale}:{width:number;height:number;origin:Point;scale:number}){const vs=Array.from({length:Math.ceil(width/scale)+2},(_,i)=>origin.x%scale+i*scale-scale),hs=Array.from({length:Math.ceil(height/scale)+2},(_,i)=>origin.y%scale+i*scale-scale);return <g><g stroke="#e8eef5">{vs.map(x=><line key={`v${x}`} x1={x} x2={x} y1="0" y2={height}/>)}{hs.map(y=><line key={`h${y}`} x1="0" x2={width} y1={y} y2={y}/>)}</g><g stroke="#475569"><line x1="0" x2={width} y1={origin.y} y2={origin.y}/><line x1={origin.x} x2={origin.x} y1="0" y2={height}/></g>{[-6,-4,-2,0,2,4,6].map(value=><g key={value} fill="#334155" fontSize="9"><text x={origin.x+value*scale-7} y={origin.y+17}>{value}</text>{value!==0&&<text x={origin.x-18} y={origin.y-value*scale+3}>{value}</text>}</g>)}</g>;}
function reflectionModel(source:Point,orientation:Orientation,line:number){const image=orientation==="vertical"?{x:2*line-source.x,y:source.y}:{x:source.x,y:2*line-source.y},midpoint={x:(source.x+image.x)/2,y:(source.y+image.y)/2},sourceDistance=Math.abs((orientation==="vertical"?source.x:source.y)-line),imageDistance=Math.abs((orientation==="vertical"?image.x:image.y)-line),equation=`l : ${orientation==="vertical"?"x":"y"} = ${format(line)}`,rule=orientation==="vertical"?"(x, y) → (2a - x, y)":"(x, y) → (x, 2b - y)";return{source,image,midpoint,sourceDistance,imageDistance,equation,rule,line,lineVariable:orientation==="vertical"?"a":"b"};}
function format(value:number){return Number(value.toFixed(2)).toString();}function formatPoint(point:Point){return `(${format(point.x)}, ${format(point.y)})`;}function roundHalf(value:number){return Math.round(value*2)/2;}function clamp(value:number,min:number,max:number){return Math.min(max,Math.max(min,Number.isFinite(value)?value:min));}
