import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Move,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Mode = "move" | "rotate";
type Visibility = { labels: boolean; lengths: boolean; angles: boolean; overlay: boolean };
type Drag = { start: Point; origin: Point; angle: number } | null;

const original: Point[] = [{ x: -3, y: 1 }, { x: 1, y: 5 }, { x: 4, y: 1 }];
const names = ["A", "B", "C"];
const initialVisibility: Visibility = { labels: true, lengths: true, angles: true, overlay: true };

export default function RigidPolygonTargetLesson216({ resetToken, onInteraction }: LessonAdapterProps) {
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [mode, setMode] = useState<Mode>("move");
  const [visibility, setVisibility] = useState(initialVisibility);
  const [drag, setDrag] = useState<Drag>(null);
  const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");

  const model = useMemo(() => buildModel(position, rotation), [position, rotation]);
  const reset = () => {
    setPosition({ x: 0, y: 0 }); setRotation(0); setMode("move");
    setVisibility(initialVisibility); setAnswers(["", "", "", "", "", ""]); setFeedback("idle"); onInteraction();
  };
  useEffect(() => {
    setPosition({ x: 0, y: 0 }); setRotation(0); setMode("move");
    setVisibility(initialVisibility); setAnswers(["", "", "", "", "", ""]); setFeedback("idle");
  }, [resetToken]);

  const toggle = (key: keyof Visibility) => { setVisibility((value) => ({ ...value, [key]: !value[key] })); onInteraction(); };
  const check = () => {
    const expected = [-1, -3, -5, 1, -1, 4];
    setFeedback(answers.every((value, index) => Number(value) === expected[index]) ? "correct" : "incorrect");
    onInteraction();
  };

  return <section
    className="space-y-3"
    style={{ marginTop: -25 }}
    data-testid="dynamic-geometry-mockup-0273"
    data-dedicated-lesson="216"
    data-object-model="rigid-triangle-motion"
    data-direct-interaction="true"
    aria-label="Rigid Polygon dedicated interactive geometry model"
  >
    <span className="sr-only">Live Verification. Check Construction.</span>
    <header className="h-[147px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[8px] font-black uppercase text-indigo-700">Dynamic Geometry Constructions</p>
          <h1 className="mt-2 text-[28px] font-black leading-8 text-slate-950">Rigid Polygon</h1>
          <p className="mt-1 text-[11px] text-slate-600">Preserve shape during movement.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[8px] font-bold text-slate-700">
            {['Foundation-Advanced', 'Construction Studio', 'Geometry Tools', '6-10 min'].map((item) => <span key={item} className="rounded-full border border-slate-200 px-3 py-1.5">{item}</span>)}
          </div>
        </div>
        <div className="grid grid-cols-2 content-start gap-2 text-[9px]">
          <button type="button" className="target-geometry-action" onClick={reset}><RotateCcw />Reset</button>
          <button type="button" className="target-geometry-action" onClick={() => { void navigator.clipboard?.writeText(location.href); onInteraction(); }}><Share2 />Share</button>
          <button type="button" className="target-geometry-action">English (English)</button>
          <a className="target-geometry-action" href="/workspace/geometry">Workspace</a>
        </div>
      </div>
    </header>

    <nav className="grid grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ marginTop: 18 }}>
      {[['Explore','Observe & manipulate'], ['Understand','Rule & insight'], ['Examples','Worked example'], ['Practice','Try it yourself']].map(([label, sub], index) => <button key={label} type="button" className={`h-[53px] text-[10px] font-black ${index === 0 ? 'bg-cyan-600 text-white' : 'text-slate-700'}`} onClick={() => { document.getElementById(`rigid-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); onInteraction(); }}><span className="block">{label}</span><span className={`mt-1 block text-[8px] font-normal ${index === 0 ? 'text-cyan-50' : 'text-slate-500'}`}>{sub}</span></button>)}
    </nav>

    <section id="rigid-0" className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-[14px] font-black text-indigo-800">1. Manipulate the polygon</h2><p className="mt-1 text-[10px] text-slate-600">Drag or rotate the polygon. Watch the measures stay the same.</p></div>
        <div className="flex items-center gap-2">
          <ModeButton active={mode === 'move'} icon={<Move />} label="Move" onClick={() => setMode('move')} />
          <ModeButton active={mode === 'rotate'} icon={<RotateCcw />} label="Rotate" onClick={() => setMode('rotate')} />
          <button type="button" aria-pressed={visibility.overlay} className={`target-geometry-action ${visibility.overlay ? '!border-indigo-400 !text-indigo-700' : ''}`} onClick={() => toggle('overlay')}>Overlay</button>
          <CircleHelp className="h-5 w-5 text-slate-500" />
        </div>
      </div>
      <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200">
        <div className="absolute left-2 top-3 z-10 w-[110px] rounded-lg border border-slate-200 bg-white/95 p-3 text-[8px] shadow-sm">
          <p className="mb-2 text-[10px] font-black">Controls</p>
          {([['labels','Show labels'], ['lengths','Show lengths'], ['angles','Show angles'], ['overlay','Show overlay']] as const).map(([key,label]) => <label key={key} className="mb-2 flex items-center gap-2"><input type="checkbox" checked={visibility[key]} onChange={() => toggle(key)} />{label}</label>)}
          <button type="button" className="mt-1 rounded-md border border-slate-200 px-2 py-1.5 font-bold" onClick={reset}><RotateCcw className="mr-1 inline h-3 w-3" />Reset view</button>
        </div>
        <div className="absolute bottom-3 left-2 z-10 w-[110px] rounded-lg border border-slate-200 bg-white/95 p-3 text-[8px] shadow-sm">
          <p className="font-black">How to interact</p><p className="mt-2">- Drag any vertex or inside the polygon.</p><p className="mt-2">- Use Rotate to turn around a point.</p>
        </div>
        <RigidCanvas model={model} visibility={visibility} mode={mode} drag={drag} onDrag={setDrag} onPosition={(point) => { setPosition(point); onInteraction(); }} onRotation={(angle) => { setRotation(angle); onInteraction(); }} />
      </div>
      <div className="mt-3 grid items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-[9px] lg:grid-cols-[1fr_1fr_1.25fr_auto]">
        <p className="font-black text-blue-800">What do you notice?</p><Invariant>Side lengths stay the same.</Invariant><Invariant>Angle measures stay the same. The shape and size are unchanged.</Invariant><p className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 font-black text-emerald-700">This is a rigid motion. <Check className="ml-2 inline h-4 w-4" /></p>
      </div>
    </section>

    <section className="grid gap-3 lg:grid-cols-[.9fr_1.08fr_1.2fr]" style={{ marginTop: 10 }}>
      <article id="rigid-2" className="target-rigid-card"><h2>2. Worked example</h2><p>Translate triangle ABC by vector (6, -2).</p><h3>Steps</h3>{['Add 6 to each x-coordinate; subtract 2 from each y-coordinate.', 'Plot the new points.', "Connect A'B', B'C', C'A'."].map((step,index) => <p key={step} className="target-rigid-step"><b>{index+1}</b>{step}</p>)}<CoordinateTable /><p>All side lengths and angles are preserved.</p></article>
      <article id="rigid-1" className="target-rigid-card"><h2>3. Insight</h2><p>Rigid motion preserves distance and angle.</p><div className="target-rigid-rule"><b>Distance</b><p className="font-serif text-[13px] italic">d(P,Q) = sqrt((x2-x1)^2 + (y2-y1)^2)</p><p>Remains constant under translation, rotation, and reflection.</p></div><div className="target-rigid-rule"><b>Angle</b><p className="font-serif text-[13px] italic">m angle ABC = m angle A'B'C'</p><p>Angle measures are preserved.</p></div><p className="target-rigid-rule">A rigid polygon has fixed side lengths and angle measures. Only position or orientation may change.</p></article>
      <article id="rigid-3" className="target-rigid-card"><h2>4. Try it</h2><p>Rotate triangle ABC about point P(0, 0) by 90 degrees counterclockwise.</p><p>Enter the coordinates after rotation.</p><PracticeTable answers={answers} onChange={(index,value) => { setAnswers((current) => current.map((item,i) => i === index ? value : item)); setFeedback('idle'); onInteraction(); }} /><div className="flex gap-2"><button type="button" className="target-rigid-check" onClick={check}>Check</button><button type="button" className="target-geometry-action" onClick={() => { setAnswers(["", "", "", "", "", ""]); setFeedback('idle'); onInteraction(); }}>Reset</button></div><p className="mt-3 font-bold text-cyan-700">Hint: (x, y) becomes (-y, x) for 90 degrees CCW.</p>{feedback !== 'idle' && <p role="status" className={`mt-2 font-black ${feedback === 'correct' ? 'text-emerald-700' : 'text-rose-700'}`}>{feedback === 'correct' ? 'Correct rigid rotation.' : 'Check each coordinate pair.'}</p>}</article>
    </section>

    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm" style={{ marginTop: 10 }}><h2 className="text-[11px] font-black">Rigid motions</h2><div className="mt-2 grid grid-cols-4 gap-3 text-[8px]"><Motion name="Translation" hint="Slide" mark="->"/><Motion name="Rotation" hint="Turn" mark="O"/><Motion name="Reflection" hint="Flip" mark="|"/><Motion name="Glide reflection" hint="Slide + flip" mark="->|"/></div></section>
    <nav className="grid grid-cols-2 gap-3" style={{ marginTop: 10 }} aria-label="Adjacent lessons"><a className="target-rigid-nav" href="/lessons/geometry/215-regular-polygon"><ArrowLeft /> <span><b>Previous</b>Regular Polygon</span></a><a className="target-rigid-nav is-next justify-end text-right" href="/lessons/geometry/217-general-polygon"><span><b>Next</b>General Polygon</span><ArrowRight /></a></nav>
  </section>;
}

function RigidCanvas({ model, visibility, mode, drag, onDrag, onPosition, onRotation }: { model: ReturnType<typeof buildModel>; visibility: Visibility; mode: Mode; drag: Drag; onDrag: (drag: Drag) => void; onPosition: (point: Point) => void; onRotation: (angle: number) => void }) {
  const domain = (event: ReactPointerEvent<SVGSVGElement>): Point => { const box = event.currentTarget.getBoundingClientRect(); return { x: -10 + ((event.clientX-box.left)/box.width)*22, y: 8 - ((event.clientY-box.top)/box.height)*15 }; };
  const start = (event: ReactPointerEvent<SVGElement>) => { event.stopPropagation(); const plane = event.currentTarget.ownerSVGElement!; const p = domain({ ...event, currentTarget: plane } as ReactPointerEvent<SVGSVGElement>); plane.setPointerCapture(event.pointerId); onDrag({ start: p, origin: model.position, angle: model.rotation }); };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => { if (!drag) return; const p = domain(event); if (mode === 'move') onPosition({ x: drag.origin.x+p.x-drag.start.x, y: drag.origin.y+p.y-drag.start.y }); else { const c = model.centroid; const a0 = Math.atan2(drag.start.y-c.y, drag.start.x-c.x); const a1 = Math.atan2(p.y-c.y,p.x-c.x); onRotation(drag.angle+(a1-a0)*180/Math.PI); } };
  return <svg className="h-[420px] w-full touch-none bg-white" viewBox="0 0 770 430" role="img" aria-label="Interactive rigid triangle plane with movable original and translated overlay" onPointerMove={move} onPointerUp={() => onDrag(null)} onPointerCancel={() => onDrag(null)}>
    <defs><pattern id="rigid-grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#e1ebf5" /></pattern></defs><rect width="770" height="430" fill="url(#rigid-grid)"/><line x1="0" y1="215" x2="770" y2="215" stroke="#64748b"/><line x1="350" y1="0" x2="350" y2="430" stroke="#64748b"/>
    {visibility.overlay && <><path d="M365 115 Q445 60 520 108" fill="none" stroke="#b6c3d3" strokeWidth="2"/><path d="M515 102l8 7-11 1" fill="#b6c3d3"/><Triangle points={model.overlay} color="#8b3dff" fill="#f4eaff" dashed visibility={visibility} names={names.map(n => `${n}'`)} /></>}
    <Triangle points={model.points} color="#1683ff" fill="#dff4ef" visibility={visibility} names={names} onPointerDown={start} />
  </svg>;
}

function Triangle({ points, color, fill, dashed=false, visibility, names, onPointerDown }: { points: Point[]; color: string; fill: string; dashed?: boolean; visibility: Visibility; names: string[]; onPointerDown?: (event: ReactPointerEvent<SVGElement>) => void }) {
  const px = (p: Point) => ({ x: 350+p.x*35, y: 215-p.y*35 }); const screen = points.map(px); const lengths = points.map((point,index) => distance(point, points[(index+1)%3])); const angles = points.map((point,index) => angle(points[(index+2)%3], point, points[(index+1)%3]));
  return <g><polygon data-testid={dashed ? 'rigid-overlay-polygon' : 'rigid-original-polygon'} data-side-lengths={lengths.map(value => value.toFixed(4)).join(',')} points={screen.map(p => `${p.x},${p.y}`).join(' ')} fill={fill} fillOpacity=".72" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? '7 5' : undefined} className="cursor-move" onPointerDown={onPointerDown}/>{screen.map((p,index) => <g key={names[index]}><circle data-testid={!dashed ? `rigid-vertex-${names[index].toLowerCase()}` : undefined} cx={p.x} cy={p.y} r="6" fill={color} className="cursor-move" onPointerDown={onPointerDown}/>{visibility.labels && <text x={p.x+(index===1?0:index===0?-55:10)} y={p.y+(index===1?-13:18)} fontSize="12" fontWeight="700" fill={color}>{names[index]} ({format(points[index].x)}, {format(points[index].y)})</text>}{visibility.lengths && <text x={(p.x+screen[(index+1)%3].x)/2} y={(p.y+screen[(index+1)%3].y)/2-7} fontSize="12" fontWeight="700" fill={color}>{lengths[index].toFixed(2)}</text>}{visibility.angles && <text x={p.x+(index===1?-18:index===0?18:-52)} y={p.y+(index===1?28:-10)} fontSize="11" fontWeight="800" fill="#18831d">{angles[index].toFixed(1)} degrees</text>}</g>)}</g>;
}

function buildModel(position: Point, rotation: number) { const centroid0 = centroid(original); const points = original.map((p) => { const r = rotate(p,centroid0,rotation); return { x:r.x+position.x,y:r.y+position.y }; }); return { points, overlay: points.map(p => ({ x:p.x+6,y:p.y-2 })), position, rotation, centroid: centroid(points) }; }
function rotate(point: Point, center: Point, degrees: number): Point { const r=degrees*Math.PI/180, x=point.x-center.x, y=point.y-center.y; return { x:center.x+x*Math.cos(r)-y*Math.sin(r), y:center.y+x*Math.sin(r)+y*Math.cos(r) }; }
function centroid(points: Point[]): Point { return { x:points.reduce((s,p)=>s+p.x,0)/points.length, y:points.reduce((s,p)=>s+p.y,0)/points.length }; }
function distance(a:Point,b:Point){return Math.hypot(b.x-a.x,b.y-a.y)}
function angle(a:Point,b:Point,c:Point){const u={x:a.x-b.x,y:a.y-b.y},v={x:c.x-b.x,y:c.y-b.y}; return Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y)))))*180/Math.PI}
function format(value:number){return Number(value.toFixed(1)).toString()}
function ModeButton({ active, icon, label, onClick }:{active:boolean;icon:React.ReactNode;label:string;onClick:()=>void}){return <button type="button" aria-pressed={active} className={`target-geometry-action ${active?'!border-cyan-400 !bg-cyan-50 !text-cyan-700':''}`} onClick={()=>{onClick()}}>{icon}{label}</button>}
function Invariant({children}:{children:React.ReactNode}){return <p className="text-slate-700"><Check className="mr-2 inline h-4 w-4 text-emerald-600"/>{children}</p>}
function CoordinateTable(){const rows=[['A','(-3, 1)','(3, -1)'],['B','(1, 5)','(7, 3)'],['C','(4, 1)','(10, -1)']];return <table className="my-3 w-full border-collapse text-center text-[8px]"><thead><tr className="bg-slate-100"><th>Point</th><th>Original (x, y)</th><th>Translated (x, y)</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}>{r.map(c=><td key={c} className="border border-slate-200 px-1 py-2">{c}</td>)}</tr>)}</tbody></table>}
function PracticeTable({answers,onChange}:{answers:string[];onChange:(index:number,value:string)=>void}){return <div className="my-3 overflow-hidden rounded-md border border-slate-200 text-[8px]"><div className="grid grid-cols-[.5fr_1fr] bg-slate-100 px-2 py-2 font-black"><span>Point</span><span>Rotated (x, y)</span></div>{['A (-3, 1)','B (1, 5)','C (4, 1)'].map((label,row)=><div key={label} className="grid grid-cols-[.5fr_1fr] items-center border-t px-2 py-1.5"><span>{label}</span><span className="flex items-center gap-1">(<input aria-label={`${names[row]} rotated x`} className="w-10 rounded border px-1 py-1" value={answers[row*2]} onChange={e=>onChange(row*2,e.target.value)}/>,<input aria-label={`${names[row]} rotated y`} className="w-10 rounded border px-1 py-1" value={answers[row*2+1]} onChange={e=>onChange(row*2+1,e.target.value)}/>)</span></div>)}</div>}
function Motion({name,hint,mark}:{name:string;hint:string;mark:string}){return <div className="flex items-center justify-center gap-2"><b className="text-[18px] text-indigo-700">{mark}</b><span><strong className="block">{name}</strong>{hint}</span></div>}
