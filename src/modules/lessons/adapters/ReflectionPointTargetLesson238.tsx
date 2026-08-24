import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Crosshair,
  Eye,
  Info,
  Lightbulb,
  Move,
  MousePointer2,
  RotateCcw,
  Share2,
  Sigma,
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
import "./ReflectionPointTargetLesson238.css";

type Point = { x: number; y: number };
type Tool = "select" | "move" | "centre";
type Drag = "source" | "centre" | null;
type Layers = { source: boolean; image: boolean; centre: boolean; midpointSource: boolean; midpointImage: boolean };

const INITIAL_CENTRE = { x: 0, y: 0 };
const INITIAL_SOURCE = { x: 3, y: 1 };
const INITIAL_LAYERS: Layers = { source: true, image: true, centre: true, midpointSource: true, midpointImage: true };
const PRACTICE_CENTRE = { x: 2, y: -1 };
const PRACTICE_SOURCE = { x: 5, y: 3 };
const STAGES = ["Explore", "Notice", "Rule", "Try", "Summary"];

export default function ReflectionPointTargetLesson238({ resetToken, onInteraction }: LessonAdapterProps) {
  const [centre, setCentre] = useState<Point>(INITIAL_CENTRE);
  const [source, setSource] = useState<Point>(INITIAL_SOURCE);
  const [layers, setLayers] = useState<Layers>(INITIAL_LAYERS);
  const [tool, setTool] = useState<Tool>("select");
  const [stage, setStage] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [status, setStatus] = useState("Observation: P is the midpoint of AA'.");
  const [answer, setAnswer] = useState(["", ""]);
  const [practiceStatus, setPracticeStatus] = useState("Complete to see feedback.");
  const [worked, setWorked] = useState(false);
  const model = useMemo(() => centralReflection(centre, source), [centre, source]);
  const practice = useMemo(() => centralReflection(PRACTICE_CENTRE, PRACTICE_SOURCE), []);

  const reset = () => {
    setCentre(INITIAL_CENTRE); setSource(INITIAL_SOURCE); setLayers(INITIAL_LAYERS);
    setTool("select"); setStage(1); setStatus("Observation: P is the midpoint of AA'.");
    onInteraction();
  };
  useEffect(() => {
    setCentre(INITIAL_CENTRE); setSource(INITIAL_SOURCE); setLayers(INITIAL_LAYERS);
    setTool("select"); setStage(1); setGuideOpen(false); setStatus("Observation: P is the midpoint of AA'.");
    setAnswer(["", ""]); setPracticeStatus("Complete to see feedback."); setWorked(false);
  }, [resetToken]);

  const updateCentre = (axis: "x" | "y", value: number) => {
    setCentre((current) => ({ ...current, [axis]: clamp(value, -5, 5) }));
    setStatus("Centre P moved; A' was recalculated so P remains the midpoint."); onInteraction();
  };
  const updateSource = (axis: "x" | "y", value: number) => {
    setSource((current) => ({ ...current, [axis]: clamp(value, -6, 6) }));
    setStatus("Point A moved; its centrally reflected image updated."); onInteraction();
  };
  const presetCentre = (next: Point, label: string) => {
    setCentre(next); setStatus(`${label} centre preset applied.`); onInteraction();
  };
  const randomCentre = () => {
    const options = [{x:-2,y:1},{x:1,y:2},{x:2,y:-2},{x:-1,y:-2}];
    const currentIndex = options.findIndex((item) => item.x === centre.x && item.y === centre.y);
    presetCentre(options[(currentIndex + 1) % options.length], "Random");
  };
  const share = async () => {
    const text = `Centre P${formatPoint(centre)} reflects A${formatPoint(source)} to A'${formatPoint(model.image)}.`;
    try { await navigator.clipboard?.writeText(text); setStatus("Point-reflection mapping copied."); }
    catch { setStatus("Share summary prepared."); }
    onInteraction();
  };
  const checkAnswer = () => {
    const x = Number(answer[0]), y = Number(answer[1]);
    const correct = answer.every((value) => value.trim() !== "") && Math.abs(x-practice.image.x)<.01 && Math.abs(y-practice.image.y)<.01;
    setPracticeStatus(correct ? "Correct: A' = (-1, -5), so P is the midpoint of AA'." : "Not yet: use A' = (2h - x, 2k - y).");
    onInteraction();
  };

  return <section className="target-point-reflection-page text-slate-900" data-testid="dynamic-geometry-mockup-0295" data-dedicated-lesson="238" data-object-model="centre-midpoint-half-turn-reflection" data-centre-x={centre.x.toFixed(4)} data-centre-y={centre.y.toFixed(4)} aria-label="Reflection in Point dedicated interactive geometry model">
    <header className="target-point-reflection-header"><div><section><span>Geometry</span><span>Coordinate Geometry</span></section><h1>Reflection in Point</h1><p>Understand central symmetry (180° rotation).</p><footer><b>♙ Intermediate-Advanced</b><b>⌁ Investigation Lab</b><b>▣ Transformation / Locus Tools</b><b>◷ 6-10 min</b></footer></div><button type="button" className={guideOpen?"is-active":""} onClick={() => { setGuideOpen((value)=>!value); setStatus(guideOpen?"Lesson guide closed.":"Lesson guide opened."); onInteraction(); }}><BookOpen /> Lesson guide</button></header>
    <nav className="target-point-reflection-stages" aria-label="Point reflection lesson stages">{STAGES.map((name,index)=><button type="button" key={name} className={stage===index+1?"is-active":""} onClick={()=>{setStage(index+1);setStatus(`${name} stage selected.`);onInteraction();}}>{index===0?<Eye/>:index===1?<Crosshair/>:index===2?<Info/>:index===3?<Sparkles/>:<BookOpen/>}<b>{name}</b></button>)}</nav>

    <section className="target-point-reflection-workspace"><article><header><h2>Manipulate the model</h2><aside><button type="button" onClick={reset}><RotateCcw/> Reset</button><button type="button" onClick={()=>void share()}><Share2/> Share</button></aside></header><PointReflectionGraph centre={centre} source={source} model={model} layers={layers} tool={tool} onCentre={(next)=>{setCentre(next);setStatus("Centre P dragged; A' remains opposite A through P.");onInteraction();}} onSource={(next)=>{setSource(next);setStatus("Point A dragged; central reflection recalculated.");onInteraction();}} /><div className="target-point-reflection-layerbox"><b>Show</b>{([['source','Original point A'],['image',"Reflected point A'"],['centre','Centre P'],['midpointSource','Midpoint PA'],['midpointImage',"Midpoint PA'"]] as [keyof Layers,string][]).map(([key,label])=><label key={key}><input type="checkbox" checked={layers[key]} onChange={(event)=>{setLayers((current)=>({...current,[key]:event.target.checked}));onInteraction();}}/>{label}</label>)}</div><nav aria-label="Point reflection graph tools">{([['select',MousePointer2,'Select tool'],['move',Move,'Move construction tool'],['centre',Crosshair,'Centre tool']] as const).map(([name,Icon,label])=><button type="button" key={name} className={tool===name?"is-active":""} aria-label={label} onClick={()=>setTool(name)}><Icon/></button>)}</nav></article><aside className="target-point-reflection-controls"><h2>Objects &amp; controls</h2><section><h3>Centre of reflection P</h3><CoordinateRow title="Centre P" point={centre} onValue={updateCentre}/><div><button type="button" onClick={()=>presetCentre({x:0,y:0},"Origin")}>Origin (0,0)</button><button type="button" onClick={()=>presetCentre({x:2,y:2},"Quadrant I")}>Quadrant I</button><button type="button" onClick={randomCentre}>Random</button></div></section><section><h3>Point A <i>(drag or edit)</i></h3><CoordinateRow title="Point A" point={source} onValue={updateSource}/><footer><input aria-label="Point A horizontal position" type="range" min="-6" max="6" step=".5" value={source.x} onChange={(event)=>updateSource("x",Number(event.target.value))}/><button type="button" className={tool==="select"?"is-active":""} aria-label="Select source point" onClick={()=>setTool("select")}><MousePointer2/></button><button type="button" className={tool==="move"?"is-active":""} aria-label="Move complete reflection" onClick={()=>setTool("move")}><Move/></button></footer></section><section className="target-point-reflection-result"><h3><ChevronDown/> Result (reflected point A')</h3><strong>A' {formatPoint(model.image)}</strong><CoordinateRow title="Reflected point A prime" point={model.image} readOnly onValue={()=>{}}/><aside><h3>♧ Observation</h3><b>P is the midpoint of AA'.</b><p>PA = PA' and A, P, A' are collinear.</p></aside></section></aside></section>

    <section className="target-point-reflection-learning"><article><h2>How it works <Info/></h2><ol><li>Drag P (centre).</li><li>Drag A or change coordinates.</li><li>Point A' appears.</li><li>P is always the midpoint of AA'.</li><li>Reflection in a point = rotation of 180° about that point.</li></ol></article><article><h2>Coordinate rule <Sigma/></h2><p>If P(h, k) and A(x, y), then</p><strong>A' = (2h - x, 2k - y)</strong><p>Special case (origin):</p><aside>P(0,0) ⇒ A' = (-x, -y)</aside></article><article><h2>Quick example <BookOpen/></h2><p>Reflect A(4, -2) in P(1, 3).</p><strong>A' = (2(1) - 4, 2(3) - (-2))<br/>= (-2, 8)</strong><b>Answer: A'(-2, 8)</b></article></section>

    <section className="target-point-reflection-practice"><article><header><h2>Try it yourself</h2><b>1 of 1</b><button type="button" aria-label="Previous challenge">‹</button><button type="button" aria-label="Next challenge">›</button></header><p>Reflect A in the given centre P.</p><strong>P(2, -1), &nbsp; A(5, 3)</strong><p>Find A' = (x', y').</p><footer><label>x' = <input aria-label="Practice reflected x coordinate" inputMode="decimal" value={answer[0]} onChange={(event)=>setAnswer([event.target.value,answer[1]])}/></label><label>y' = <input aria-label="Practice reflected y coordinate" inputMode="decimal" value={answer[1]} onChange={(event)=>setAnswer([answer[0],event.target.value])}/></label><button type="button" onClick={checkAnswer}><Check/> Check answer</button></footer></article><article><h2><Lightbulb/> Need a hint?</h2><p>Use the rule A' = (2h - x, 2k - y) with P(h,k) = (2,-1).</p><button type="button" onClick={()=>{setWorked((value)=>!value);onInteraction();}}><BookOpen/> {worked?"Hide worked steps":"Show worked steps"}</button>{worked&&<aside>2(2)-5=-1<br/>2(-1)-3=-5</aside>}</article><article><h2>Your result <Lightbulb/></h2><strong>{practiceStatus.startsWith("Correct")?"A'(-1, -5)":"-"}</strong><p role="status">{practiceStatus}</p></article></section>

    <nav className="target-point-reflection-nav" aria-label="Adjacent lessons"><a href="/lessons/geometry/237-reflection-in-line"><ArrowLeft/><span><b>Previous</b>Reflection in Line</span></a><a href="/lessons/geometry/239-reflection-in-circle"><span><b>Next</b>Reflection in Circle</span><ArrowRight/></a></nav><span className="sr-only" role="status">{status}</span>
  </section>;
}

function PointReflectionGraph({centre,source,model,layers,tool,onCentre,onSource}:{centre:Point;source:Point;model:ReturnType<typeof centralReflection>;layers:Layers;tool:Tool;onCentre:(value:Point)=>void;onSource:(value:Point)=>void}){const ref=useRef<SVGSVGElement>(null),drag=useRef<Drag>(null),moveOrigin=useRef<{world:Point;centre:Point;source:Point}|null>(null),origin={x:245,y:210},scale=36;const screen=(p:Point)=>({x:origin.x+p.x*scale,y:origin.y-p.y*scale});const world=(event:ReactPointerEvent<SVGSVGElement>)=>{const matrix=ref.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());return{x:(p.x-origin.x)/scale,y:(origin.y-p.y)/scale};};const begin=(which:Exclude<Drag,null>)=>(event:ReactPointerEvent<SVGCircleElement>)=>{const p=world(event as unknown as ReactPointerEvent<SVGSVGElement>);if(!p)return;drag.current=which;moveOrigin.current={world:p,centre:{...centre},source:{...source}};event.currentTarget.setPointerCapture(event.pointerId);};const p=screen(centre),a=screen(source),image=screen(model.image),m1=screen(model.midpointSource),m2=screen(model.midpointImage);return <svg ref={ref} className="target-point-reflection-graph" viewBox="0 0 500 430" role="img" aria-label="Interactive central reflection graph with draggable centre P and point A" onPointerMove={(event)=>{if(!drag.current)return;const next=world(event),start=moveOrigin.current;if(!next||!start)return;if(tool==="move"){const dx=next.x-start.world.x,dy=next.y-start.world.y;onCentre({x:clamp(roundHalf(start.centre.x+dx),-5,5),y:clamp(roundHalf(start.centre.y+dy),-5,5)});onSource({x:clamp(roundHalf(start.source.x+dx),-6,6),y:clamp(roundHalf(start.source.y+dy),-6,6)});}else if(drag.current==="centre"||tool==="centre")onCentre({x:clamp(roundHalf(next.x),-5,5),y:clamp(roundHalf(next.y),-5,5)});else onSource({x:clamp(roundHalf(next.x),-6,6),y:clamp(roundHalf(next.y),-6,6)});}} onPointerUp={()=>{drag.current=null;moveOrigin.current=null;}} onPointerCancel={()=>{drag.current=null;moveOrigin.current=null;}}><rect width="500" height="430" fill="#fff"/><Grid width={500} height={430} origin={origin} scale={scale}/><line data-testid="point-reflection-collinear-line" x1={a.x} y1={a.y} x2={image.x} y2={image.y} stroke="#a78bfa" strokeWidth="2" strokeDasharray="7 5"/>{layers.midpointSource&&<rect data-testid="point-reflection-midpoint-pa" x={m1.x-4} y={m1.y-4} width="8" height="8" fill="#4ade80"/>}{layers.midpointImage&&<rect data-testid="point-reflection-midpoint-pa-prime" x={m2.x-4} y={m2.y-4} width="8" height="8" fill="#4ade80"/>}{layers.source&&<g><circle data-testid="point-reflection-source" data-x={source.x.toFixed(4)} data-y={source.y.toFixed(4)} cx={a.x} cy={a.y} r="7" fill="#168ddd" onPointerDown={begin("source")}/><text x={a.x+9} y={a.y-12} fill="#168ddd" fontSize="15" fontFamily="Georgia,serif">A {formatPoint(source)}</text></g>}{layers.image&&<g><circle data-testid="point-reflection-image" data-x={model.image.x.toFixed(4)} data-y={model.image.y.toFixed(4)} cx={image.x} cy={image.y} r="7" fill="#8b5cf6"/><text x={image.x-65} y={image.y+15} fill="#7c3aed" fontSize="15" fontFamily="Georgia,serif">A' {formatPoint(model.image)}</text></g>}{layers.centre&&<g><circle data-testid="point-reflection-centre" data-x={centre.x.toFixed(4)} data-y={centre.y.toFixed(4)} cx={p.x} cy={p.y} r="7" fill="#f97316" onPointerDown={begin("centre")}/><text x={p.x-27} y={p.y-14} fill="#f97316" fontSize="14" fontFamily="Georgia,serif">P {formatPoint(centre)}</text></g>}</svg>;}
function CoordinateRow({title,point,onValue,readOnly=false}:{title:string;point:Point;onValue:(axis:"x"|"y",value:number)=>void;readOnly?:boolean}){return <div className="target-point-reflection-coordinate"><label>x<input aria-label={`${title} x coordinate`} type="number" min="-8" max="8" step="1" value={point.x} readOnly={readOnly} onChange={(event)=>onValue("x",Number(event.target.value))}/></label><label>y<input aria-label={`${title} y coordinate`} type="number" min="-8" max="8" step="1" value={point.y} readOnly={readOnly} onChange={(event)=>onValue("y",Number(event.target.value))}/></label></div>;}
function Grid({width,height,origin,scale}:{width:number;height:number;origin:Point;scale:number}){const vs=Array.from({length:Math.ceil(width/scale)+2},(_,i)=>origin.x%scale+i*scale-scale),hs=Array.from({length:Math.ceil(height/scale)+2},(_,i)=>origin.y%scale+i*scale-scale);return <g><g stroke="#e8eef5">{vs.map(x=><line key={`v${x}`} x1={x} x2={x} y1="0" y2={height}/>)}{hs.map(y=><line key={`h${y}`} x1="0" x2={width} y1={y} y2={y}/>)}</g><g stroke="#475569"><line x1="0" x2={width} y1={origin.y} y2={origin.y}/><line x1={origin.x} x2={origin.x} y1="0" y2={height}/></g>{[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(value=><g key={value} fill="#475569" fontSize="8"><text x={origin.x+value*scale-5} y={origin.y+16}>{value}</text>{value!==0&&<text x={origin.x-17} y={origin.y-value*scale+3}>{value}</text>}</g>)}</g>;}
function centralReflection(centre:Point,source:Point){const image={x:2*centre.x-source.x,y:2*centre.y-source.y},midpoint={x:(source.x+image.x)/2,y:(source.y+image.y)/2},midpointSource={x:(source.x+centre.x)/2,y:(source.y+centre.y)/2},midpointImage={x:(image.x+centre.x)/2,y:(image.y+centre.y)/2},distance=Math.hypot(source.x-centre.x,source.y-centre.y),cross=(source.x-centre.x)*(image.y-centre.y)-(source.y-centre.y)*(image.x-centre.x);return{image,midpoint,midpointSource,midpointImage,distance,collinear:Math.abs(cross)<1e-8,midpointInvariant:Math.hypot(midpoint.x-centre.x,midpoint.y-centre.y)<1e-8};}
function format(value:number){return Number(value.toFixed(2)).toString();}function formatPoint(point:Point){return `(${format(point.x)}, ${format(point.y)})`;}function roundHalf(value:number){return Math.round(value*2)/2;}function clamp(value:number,min:number,max:number){return Math.min(max,Math.max(min,Number.isFinite(value)?value:min));}
