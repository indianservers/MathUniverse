import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDot,
  Copy,
  Eraser,
  Move,
  Pentagon,
  RotateCcw,
  Ruler,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Tool = "point" | "polygon" | "move" | "measure";
type Drag = { index: number | "polygon"; start: Point; original: Point[] } | null;
const initialPoints: Point[] = [
  { x: 0, y: 3.2 }, { x: -3.1, y: 1.1 }, { x: -2.1, y: -2.1 },
  { x: 2.8, y: -1.6 }, { x: 3.4, y: 1.6 },
];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function GeneralPolygonTargetLesson217({ resetToken, onInteraction }: LessonAdapterProps) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [tool, setTool] = useState<Tool>("point");
  const [snap, setSnap] = useState(true);
  const [grid, setGrid] = useState(true);
  const [drag, setDrag] = useState<Drag>(null);
  const [selectedSide, setSelectedSide] = useState<number | null>(null);
  const [answers, setAnswers] = useState(["", ""]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const model = useMemo(() => polygonModel(points), [points]);

  const reset = () => { setPoints(initialPoints); setTool("point"); setSnap(true); setGrid(true); setSelectedSide(null); setAnswers(["",""]); setFeedback("idle"); onInteraction(); };
  useEffect(() => { setPoints(initialPoints); setTool("point"); setSnap(true); setGrid(true); setSelectedSide(null); setAnswers(["",""]); setFeedback("idle"); }, [resetToken]);
  const check = () => { setFeedback(Number(answers[0]) === 720 && Number(answers[1]) === 360 ? "correct" : "incorrect"); onInteraction(); };

  return <section
    className="space-y-3"
    style={{ marginTop: -7 }}
    data-testid="dynamic-geometry-mockup-0274"
    data-dedicated-lesson="217"
    data-object-model="editable-general-polygon"
    data-direct-interaction="true"
    aria-label="General Polygon dedicated interactive geometry model"
  >
    <span className="sr-only">Live Verification. Check Construction.</span>
    <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid items-center gap-5 md:grid-cols-[1.25fr_1fr]">
        <div><p className="inline-block rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[8px] font-black uppercase text-cyan-700">Dynamic Geometry Constructions</p><h1 className="mt-2 text-[29px] font-black leading-9 text-slate-950">General Polygon</h1><p className="mt-1 text-[10px] text-slate-600">Construct arbitrary polygons and explore their properties.</p><div className="mt-4 flex flex-wrap gap-2 text-[8px] font-bold text-slate-700"><span className="target-geometry-chip">Level: Middle-High School</span><span className="target-geometry-chip">Tools: Point, Polygon, Measure</span><span className="target-geometry-chip">Time: 6-10 min</span></div></div>
        <div className="rounded-xl border border-slate-200 p-3 shadow-sm"><p className="text-[8px] font-black">Learning flow</p><div className="relative mt-3 grid grid-cols-5 text-center text-[7px]"><div className="absolute left-[10%] right-[10%] top-4 h-px bg-blue-300" />{['Observe','Manipulate','Notice','Understand','Try'].map((label,index)=><div key={label} className="relative"><span className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-white ${index===1?'bg-purple-600':'bg-blue-400'}`}>{index+1}</span><b className="mt-2 block">{label}</b></div>)}</div></div>
      </div>
    </header>

    <nav className="grid grid-cols-5 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">{[['Explore','Build & investigate'],['Explain',"What's happening"],['Examples','See it in action'],['Formulas','Rules & definitions'],['Practice','Try it yourself']].map(([label,sub],index)=><button type="button" key={label} className={`h-11 rounded-lg text-[9px] font-black ${index===0?'border border-blue-300 text-blue-700':'text-slate-700'}`} onClick={()=>{document.getElementById(index===4?'general-practice':`general-${index}`)?.scrollIntoView({behavior:'smooth',block:'center'});onInteraction()}}>{label}<span className="block text-[7px] font-normal">{sub}</span></button>)}</nav>

    <section id="general-0" className="grid gap-3 md:grid-cols-[minmax(0,2.5fr)_minmax(190px,1fr)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-[12px] font-black">Build &amp; Explore</h2><p className="mt-1 text-[8px] text-slate-600">Click to add vertices. Drag vertices to reshape. Double-click a vertex to remove.</p></div><div className="flex gap-2"><button type="button" className="target-geometry-action" onClick={reset}><RotateCcw />Reset</button><button type="button" className="target-general-clear" onClick={()=>{setPoints([]);setTool('point');setSelectedSide(null);onInteraction()}}><Eraser />Clear All</button></div></div>
        <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200">
          <div className="absolute left-2 top-3 z-10 grid w-[78px] gap-1 rounded-lg border border-slate-200 bg-white/95 p-2 text-[8px] shadow-sm"><ToolButton active={tool==='point'} icon={<CircleDot/>} label="Point" onClick={()=>setTool('point')}/><ToolButton active={tool==='polygon'} icon={<Pentagon/>} label="Polygon" onClick={()=>setTool('polygon')}/><ToolButton active={tool==='move'} icon={<Move/>} label="Move" onClick={()=>setTool('move')}/><ToolButton active={tool==='measure'} icon={<Ruler/>} label="Measure" onClick={()=>setTool('measure')}/><hr/><Toggle label="Snap" checked={snap} onChange={setSnap}/><Toggle label="Grid" checked={grid} onChange={setGrid}/></div>
          <PolygonCanvas points={points} model={model} tool={tool} snap={snap} grid={grid} drag={drag} selectedSide={selectedSide} onDrag={setDrag} onPoints={(next)=>{setPoints(next);setFeedback('idle');onInteraction()}} onSelectSide={setSelectedSide}/>
        </div>
        <p className="mt-2 text-[8px] text-slate-500">Tip: Try dragging vertices to change the shape. Watch the measurements update in real time.</p>
      </div>
      <Properties points={points} model={model} onCopy={(text)=>{void navigator.clipboard?.writeText(text);onInteraction()}} />
    </section>

    <section className="grid gap-3 md:grid-cols-3" style={{marginTop:10}}>
      <article id="general-1" className="target-general-card"><h2>Notice the Pattern</h2><p>For any n-gon:</p><p>- Sum of interior angles = (n - 2) x 180 degrees</p><p>- Sum of exterior angles = 360 degrees</p><p>Try adding or removing vertices.</p><MiniPolygon /></article>
      <article id="general-3" className="target-general-card"><h2>Understand the Rule</h2><b>Interior Angle Sum</b><p className="target-general-formula">Sum i = (n - 2) x 180 degrees</p><b>Exterior Angle Sum</b><p className="target-general-formula">Sum e = 360 degrees</p><p>Where n = number of vertices.</p></article>
      <article id="general-2" className="target-general-card"><div className="flex justify-between"><h2>Worked Example</h2><span className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-[7px] font-bold text-emerald-700">Example</span></div><p>Find the sum of interior angles of a 7-gon.</p><b>Solution:</b><p className="target-general-formula">(n - 2) x 180 = (7 - 2) x 180<br/>= 5 x 180<br/>= 900 degrees</p><p className="font-black text-emerald-700">Answer: 900 degrees</p></article>
    </section>

    <section id="general-practice" className="grid h-[211px] gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_180px]" style={{marginTop:10}}>
      <div><h2 className="text-[11px] font-black">Try It Independently</h2><p className="mt-1 text-[8px]">Construct a convex hexagon. What is the sum of its interior angles? What is the sum of its exterior angles?</p><div className="mt-3 grid items-center gap-3 md:grid-cols-[130px_1fr]"><PracticeHexagon/><div className="space-y-3 text-[8px]"><PracticeRow number="1">Build a convex hexagon.</PracticeRow><PracticeRow number="2">Record the sum of interior angles. <AnswerInput label="Hexagon interior sum" value={answers[0]} onChange={(value)=>{setAnswers([value,answers[1]]);setFeedback('idle')}} /></PracticeRow><PracticeRow number="3">Record the sum of exterior angles. <AnswerInput label="Hexagon exterior sum" value={answers[1]} onChange={(value)=>{setAnswers([answers[0],value]);setFeedback('idle')}} /></PracticeRow><button type="button" className="ml-auto block rounded-md bg-purple-600 px-5 py-2 font-black text-white" onClick={check}>Check</button>{feedback!=='idle'&&<p role="status" className={`text-right font-black ${feedback==='correct'?'text-emerald-700':'text-rose-700'}`}>{feedback==='correct'?'Correct polygon sums.':'Use the n-gon sum rules.'}</p>}</div></div></div>
      <aside className="rounded-lg bg-blue-50 p-3 text-[8px] text-slate-700"><h3 className="font-black text-cyan-700">Hint</h3><p className="mt-2">- Use the polygon tool.</p><p>- Drag to adjust the shape.</p><p>- Check the Properties panel.</p><hr className="my-3"/><h3 className="font-black">Goal</h3><p className="mt-2">Interior sum: <b>720 degrees</b></p><p>Exterior sum: <b>360 degrees</b></p></aside>
    </section>

    <nav className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-[8px] shadow-sm" style={{marginTop:10}} aria-label="Adjacent lessons"><a className="flex items-center gap-3" href="/lessons/geometry/216-rigid-polygon"><ArrowLeft className="h-4 w-4"/><span><b className="block">Previous</b>Rigid Polygon</span></a><span className="text-slate-500">Lesson 217 of Geometry</span><a className="flex items-center justify-end gap-3 text-right" href="/lessons/geometry/218-circle-centre-and-point"><span><b className="block">Next</b>Circle: Centre and Point</span><ArrowRight className="h-4 w-4"/></a></nav>
  </section>;
}

function PolygonCanvas({points,model,tool,snap,grid,drag,selectedSide,onDrag,onPoints,onSelectSide}:{points:Point[];model:ReturnType<typeof polygonModel>;tool:Tool;snap:boolean;grid:boolean;drag:Drag;selectedSide:number|null;onDrag:(drag:Drag)=>void;onPoints:(points:Point[])=>void;onSelectSide:(side:number|null)=>void}){
  const domain=(event:ReactPointerEvent<SVGSVGElement>):Point=>{const box=event.currentTarget.getBoundingClientRect();const p={x:-7+((event.clientX-box.left)/box.width)*14,y:6-((event.clientY-box.top)/box.height)*12};return snap?{x:Math.round(p.x*10)/10,y:Math.round(p.y*10)/10}:p};
  const start=(event:ReactPointerEvent<SVGElement>,index:number|"polygon")=>{event.stopPropagation();const svg=event.currentTarget.ownerSVGElement!;const box=svg.getBoundingClientRect();const p={x:-7+((event.clientX-box.left)/box.width)*14,y:6-((event.clientY-box.top)/box.height)*12};onDrag({index,start:p,original:points.map(point=>({...point}))})};
  const move=(event:ReactPointerEvent<SVGSVGElement>)=>{if(!drag)return;const p=domain(event),dx=p.x-drag.start.x,dy=p.y-drag.start.y;if(drag.index==='polygon')onPoints(drag.original.map(q=>({x:q.x+dx,y:q.y+dy})));else onPoints(drag.original.map((q,index)=>index===drag.index?p:q))};
  const click=(event:ReactPointerEvent<SVGSVGElement>)=>{if((tool==='point'||tool==='polygon')&&!drag&&points.length<10)onPoints([...points,domain(event)])};
  const screen=(p:Point)=>({x:350+p.x*48,y:288-p.y*48});
  return <svg role="img" aria-label="Editable general polygon coordinate plane with add drag and remove vertices" className="h-[500px] w-full touch-none bg-white" viewBox="0 0 700 576" onPointerDown={click} onPointerMove={move} onPointerUp={()=>onDrag(null)} onPointerCancel={()=>onDrag(null)}>
    <defs><pattern id="general-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#dfe9f3"/></pattern></defs>{grid&&<rect width="700" height="576" fill="url(#general-grid)"/>}<line x1="0" y1="288" x2="700" y2="288" stroke="#64748b"/><line x1="350" y1="0" x2="350" y2="576" stroke="#64748b"/>
    {points.length>=2&&points.map((point,index)=>{const a=screen(point),b=screen(points[(index+1)%points.length]);return <line key={`side${index}`} data-testid={`general-polygon-side-${index}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={selectedSide===index?'#f97316':'#6740db'} strokeWidth={selectedSide===index?4:2.5} onClick={(event)=>{if(tool==='measure'){event.stopPropagation();onSelectSide(index)}}}/>})}
    {points.length>=3&&<polygon data-testid="general-polygon-body" data-area={model.area.toFixed(4)} data-perimeter={model.perimeter.toFixed(4)} points={points.map(p=>{const s=screen(p);return `${s.x},${s.y}`}).join(' ')} fill="#effdf8" fillOpacity=".7" className="cursor-move" onPointerDown={(event)=>{if(tool==='move')start(event,'polygon')}}/>}
    {points.map((point,index)=>{const s=screen(point);return <g key={`${index}-${point.x}-${point.y}`}><circle data-testid={`general-polygon-vertex-${index}`} cx={s.x} cy={s.y} r="7" fill="#3867f3" className="cursor-move" onPointerDown={(event)=>start(event,index)} onDoubleClick={(event)=>{event.stopPropagation();if(points.length>3)onPoints(points.filter((_,i)=>i!==index))}}/><text x={s.x+(index===0?4:index===1?-25:8)} y={s.y-12} fill="#2456dd" fontSize="13" fontWeight="800">{letters[index]}</text><text x={s.x+(index===1?-55:10)} y={s.y+20} fill="#52627b" fontSize="10">({point.x.toFixed(2)}, {point.y.toFixed(2)})</text>{model.angles[index]!==undefined&&<text x={s.x+(index===0?-5:10)} y={s.y+(index===0?38:-14)} fill="#079447" fontSize="11" fontWeight="800">{model.angles[index].toFixed(1)} degrees</text>}</g>})}
    {model.lengths.map((length,index)=>{const a=screen(points[index]),b=screen(points[(index+1)%points.length]);return <text key={`length${index}`} x={(a.x+b.x)/2} y={(a.y+b.y)/2-8} fill="#3f2b95" fontSize="11" fontWeight="800">{length.toFixed(2)}</text>})}
  </svg>;
}

function Properties({points,model,onCopy}:{points:Point[];model:ReturnType<typeof polygonModel>;onCopy:(text:string)=>void}){return <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><h2 className="text-[11px] font-black">Properties</h2><PropertyPanel title="Side Lengths">{model.lengths.map((value,index)=><Property key={index} label={`${letters[index]}${letters[(index+1)%points.length]}`} value={value.toFixed(2)} onCopy={()=>onCopy(value.toFixed(2))}/>)}</PropertyPanel><PropertyPanel title="Interior Angles">{model.angles.map((value,index)=><Property key={index} label={`angle ${letters[index]}`} value={`${value.toFixed(1)} degrees`} onCopy={()=>onCopy(value.toFixed(1))}/>)}<hr/><Property label="Sum" value={`${model.angleSum.toFixed(1)} degrees`}/><Property label="Expected" value={`${Math.max(0,(points.length-2)*180).toFixed(1)} degrees`}/></PropertyPanel><PropertyPanel title="Summary"><Property label="Vertices (n)" value={String(points.length)}/><Property label="Perimeter" value={`${model.perimeter.toFixed(2)} units`}/><Property label="Area" value={`${model.area.toFixed(2)} sq units`}/><Property label="Convex" value={model.convex?'Yes':'No'} tone={model.convex?'good':'bad'}/><Property label="Self-intersecting" value={model.selfIntersecting?'Yes':'No'} tone={model.selfIntersecting?'bad':'good'}/></PropertyPanel></aside>}
function PropertyPanel({title,children}:{title:string;children:React.ReactNode}){return <section className="mt-3 rounded-lg border border-slate-200 p-3 text-[8px]"><h3 className="mb-2 text-[10px] font-black">{title}</h3><div className="space-y-2">{children}</div></section>}
function Property({label,value,onCopy,tone}:{label:string;value:string;onCopy?:()=>void;tone?:'good'|'bad'}){return <div className="flex items-center justify-between gap-2"><span>{label}</span><span className={`ml-auto font-bold ${tone==='good'?'rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700':tone==='bad'?'rounded bg-rose-50 px-1.5 py-0.5 text-rose-700':''}`}>{value}</span>{onCopy&&<button type="button" aria-label={`Copy ${label}`} onClick={onCopy}><Copy className="h-3 w-3 text-slate-500"/></button>}</div>}
function ToolButton({active,icon,label,onClick}:{active:boolean;icon:React.ReactNode;label:string;onClick:()=>void}){return <button type="button" aria-pressed={active} className={`flex items-center gap-2 rounded-md px-2 py-2 text-left font-bold ${active?'bg-blue-50 text-blue-700':'text-slate-700'}`} onClick={()=>{onClick()}}><span className="[&>svg]:h-3 [&>svg]:w-3">{icon}</span>{label}</button>}
function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(value:boolean)=>void}){return <label className="flex items-center justify-between gap-2 py-1"><span>{label}</span><input type="checkbox" checked={checked} onChange={event=>onChange(event.target.checked)}/></label>}
function PracticeRow({number,children}:{number:string;children:React.ReactNode}){return <div className="flex items-center gap-2"><b className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-cyan-300 text-cyan-700">{number}</b><span className="flex flex-1 items-center justify-between gap-2">{children}</span></div>}
function AnswerInput({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}){return <label className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Sum of angles = <input aria-label={label} className="w-12 rounded border bg-white px-1 py-1" value={value} onChange={event=>onChange(event.target.value)}/> degrees</label>}
function MiniPolygon(){return <svg className="mx-auto mt-2 h-[70px] w-[120px]" viewBox="0 0 120 70"><polygon points="60,5 108,25 93,65 28,62 12,25" fill="#f5edff" stroke="#7753e8"/><text x="56" y="42" fontSize="20" fontWeight="700">n</text></svg>}
function PracticeHexagon(){return <svg className="h-[110px] w-full" viewBox="0 0 130 110"><polygon points="65,8 110,28 118,72 82,101 30,94 10,50" fill="#fff" stroke="#6e5bd8" strokeWidth="2"/><circle cx="65" cy="8" r="3" fill="#f97316"/><circle cx="110" cy="28" r="3" fill="#ec4899"/><circle cx="118" cy="72" r="3" fill="#10b981"/><circle cx="82" cy="101" r="3" fill="#ef4444"/><circle cx="30" cy="94" r="3" fill="#3b82f6"/><circle cx="10" cy="50" r="3" fill="#eab308"/></svg>}

function polygonModel(points:Point[]){const lengths=points.map((point,index)=>distance(point,points[(index+1)%points.length]));const areaSigned=points.length<3?0:points.reduce((sum,p,index)=>sum+p.x*points[(index+1)%points.length].y-p.y*points[(index+1)%points.length].x,0)/2;const angles=points.length<3?[]:points.map((point,index)=>interiorAngle(points[(index-1+points.length)%points.length],point,points[(index+1)%points.length],Math.sign(areaSigned)||1));return{lengths,angles,perimeter:lengths.reduce((a,b)=>a+b,0),area:Math.abs(areaSigned),angleSum:angles.reduce((a,b)=>a+b,0),convex:isConvex(points),selfIntersecting:hasSelfIntersection(points)}}
function distance(a:Point,b:Point){return Math.hypot(b.x-a.x,b.y-a.y)}
function interiorAngle(prev:Point,current:Point,next:Point,orientation:number){const a=Math.atan2(prev.y-current.y,prev.x-current.x),b=Math.atan2(next.y-current.y,next.x-current.x);let value=(b-a)*180/Math.PI;if(orientation>0)value=-value;while(value<0)value+=360;while(value>=360)value-=360;return value}
function cross(a:Point,b:Point,c:Point){return(b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x)}
function isConvex(points:Point[]){if(points.length<3)return false;let sign=0;for(let i=0;i<points.length;i++){const value=cross(points[i],points[(i+1)%points.length],points[(i+2)%points.length]);if(Math.abs(value)<1e-8)continue;const next=Math.sign(value);if(sign&&next!==sign)return false;sign=next}return sign!==0&&!hasSelfIntersection(points)}
function hasSelfIntersection(points:Point[]){if(points.length<4)return false;for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){if(i===j||(i+1)%points.length===j||i===(j+1)%points.length)continue;if(intersects(points[i],points[(i+1)%points.length],points[j],points[(j+1)%points.length]))return true}return false}
function intersects(a:Point,b:Point,c:Point,d:Point){const ab1=cross(a,b,c),ab2=cross(a,b,d),cd1=cross(c,d,a),cd2=cross(c,d,b);return ab1*ab2<0&&cd1*cd2<0}
