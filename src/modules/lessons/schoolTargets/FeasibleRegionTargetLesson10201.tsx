import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Pause, Plus, Minus, RotateCcw } from "lucide-react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { DEFAULT_REGION, analyzeRegion, visibleRegion, satisfiesRegion, type RegionConstraint, type RegionPoint } from "./feasibleRegionModel";
import "./FeasibleRegionTargetLesson10201.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
const number=(n:number)=>Number(n.toFixed(2));
function VertexPractice() {
  const vertices=analyzeRegion(DEFAULT_REGION).vertices;
  const [order,setOrder]=useState([0,1,2,3]);
  const [checked,setChecked]=useState(false);
  const move=(from:number,to:number)=>{
    if(!Number.isInteger(from)||from<0||from>=4||to<0||to>=4)return;
    setOrder(previous=>{const next=[...previous];const [value]=next.splice(from,1);next.splice(to,0,value);return next;});setChecked(false);
  };
  return <section className="fr-practice" aria-label="Vertex ordering practice"><h2>PRACTICE: IDENTIFY VERTICES</h2>
    <p>Order the default region's vertices counter-clockwise, starting at (0, 0).</p>
    <ol>{order.map((id,index)=><li key={id} draggable onDragStart={event=>event.dataTransfer.setData("text/plain",String(index))} onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();const payload=event.dataTransfer.getData("text/plain");if(/^[0-3]$/.test(payload))move(Number(payload),index);}}>
      <button type="button" aria-label={`Move vertex ${id+1} left`} title="Move left" disabled={index===0} onClick={()=>move(index,index-1)}><ArrowLeft size={12}/></button>
      <span>({vertices[id].map(number).join(", ")})</span>
      <button type="button" aria-label={`Move vertex ${id+1} right`} title="Move right" disabled={index===3} onClick={()=>move(index,index+1)}><ArrowRight size={12}/></button>
    </li>)}</ol><button type="button" onClick={()=>setChecked(true)}>Check Answer</button> <button type="button" onClick={()=>{setOrder([0,1,2,3]);setChecked(false);}}>Reset order</button>
    {checked&&<p role="status">{order.every((id,index)=>id===index)?"Correct counter-clockwise order":"Start at (0, 0), then follow the boundary counter-clockwise."}</p>}
  </section>;
}
function RegionGraph({constraints,point,onPoint,grid=true,snap=true,zoom=1,sweep}:{constraints:RegionConstraint[];point:RegionPoint;onPoint?:(p:RegionPoint)=>void;grid?:boolean;snap?:boolean;zoom?:number;sweep?:number}) {
  const map=(p:RegionPoint)=>[40+p[0]*10*zoom,360-p[1]*10*zoom];
  const bounds={left:-4/zoom,right:48/zoom,top:36/zoom,bottom:-5/zoom};
  const points=(polygon:RegionPoint[])=>polygon.map(p=>map(p).join(",")).join(" ");
  const update=(event:React.PointerEvent<SVGSVGElement>)=>{
    if (!onPoint) return;
    const matrix=event.currentTarget.getScreenCTM(); if(!matrix)return;
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    const round=(v:number)=>snap?Math.round(v):number(v);
    onPoint([round((p.x-40)/(10*zoom)),round((360-p.y)/(10*zoom))]);
  };
  return <svg className="fr-graph" viewBox="0 0 520 410" role="img" aria-label="Feasible region graph" onPointerDown={event=>{if(onPoint){event.currentTarget.setPointerCapture(event.pointerId);update(event);}}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))update(event);}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}>
    {grid && Array.from({length:10},(_,i)=>i*5).map(n=><g key={n}><line x1={map([n,0])[0]} y1="10" x2={map([n,0])[0]} y2="360" stroke="#e9edf2"/><line x1="40" y1={map([0,n])[1]} x2="500" y2={map([0,n])[1]} stroke="#e9edf2"/></g>)}
    {constraints.filter(c=>c.enabled&&c.shaded!==false).map(c=><polygon key={c.label} points={points(visibleRegion([c],bounds))} fill={c.color} opacity=".06"/>)}
    <polygon points={points(visibleRegion(constraints,bounds))} fill="#25b276" opacity=".2"/>
    <path d="M40 10V360H510" fill="none" stroke="#303840"/>
    {constraints.filter(c=>c.enabled).map(c=>{const a:RegionPoint=c.b?[bounds.left,(c.c-bounds.left*c.a)/c.b]:[c.c/c.a,bounds.bottom];const b:RegionPoint=c.b?[bounds.right,(c.c-bounds.right*c.a)/c.b]:[c.c/c.a,bounds.top];return <line key={c.label} x1={map(a)[0]} y1={map(a)[1]} x2={map(b)[0]} y2={map(b)[1]} stroke={c.color} strokeWidth="1.7"/>;})}
    {Array.from({length:9},(_,i)=>i*5).map(n=><g key={n}><text x={map([n,0])[0]} y="377">{n}</text>{n<35&&<text x="18" y={map([0,n])[1]+4}>{n}</text>}</g>)}
    {analyzeRegion(constraints).vertices.map(p=><g key={p.join()}><circle cx={map(p)[0]} cy={map(p)[1]} r="3"/><text x={map(p)[0]+6} y={map(p)[1]-8}>({number(p[0])}, {number(p[1])})</text></g>)}
    {sweep!==undefined&&<line x1={map([0,sweep/40])[0]} y1={map([0,sweep/40])[1]} x2={map([45,(sweep-2250)/40])[0]} y2={map([45,(sweep-2250)/40])[1]} stroke="#9044df" strokeDasharray="6 4"/>}
    {onPoint&&<circle cx={map(point)[0]} cy={map(point)[1]} r="6" fill="#8454cf" tabIndex={0} role="slider" aria-label="Test point" aria-valuetext={point.join(", ")} onKeyDown={event=>{const moves:Record<string,RegionPoint>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};const delta=moves[event.key];if(delta){event.preventDefault();onPoint([point[0]+delta[0],point[1]+delta[1]]);}}}/>}
  </svg>;
}
export default function FeasibleRegionTargetLesson10201({lesson}:{lesson:SchoolSyllabusLesson}) {
  const [constraints,setConstraints]=useState(DEFAULT_REGION.map(c=>({...c})));
  const [point,setPoint]=useState<RegionPoint>([0,0]);
  const [grid,setGrid]=useState(true),[snap,setSnap]=useState(true),[zoom,setZoom]=useState(1);
  const [sweep,setSweep]=useState(0),[playing,setPlaying]=useState(false);
  const [answers,setAnswers]=useState(["","",""]),[graded,setGraded]=useState(false);
  const model=analyzeRegion(constraints);
  useEffect(()=>{if(!playing)return;const id=setInterval(()=>setSweep(z=>z>=2000?-1000:z+20),80);return()=>clearInterval(id);},[playing]);
  const preset=(kind:string)=>{setConstraints(DEFAULT_REGION.map((c,i)=>kind==="UNBOUNDED"?{...c,enabled:i>=2}:kind==="EMPTY"&&i===0?{...c,c:-1,label:"x + 2y ≤ −1"}:{...c}));setGraded(false);};
  const maximum=model.optimum?50*model.optimum[0]+40*model.optimum[1]:null;
  return <main className="fr10201" data-testid="school-mockup-0875"><header><Link to="/lessons/school/class-12"><ArrowLeft size={14}/>School lessons</Link><small>CLASS 12 · LINEAR PROGRAMMING</small><h1>{lesson.title}</h1><p>Identify the feasible region by graphing each constraint and taking the intersection.</p><div className="fr-tags">16 min · ADVANCED · INTERACTIVE LAB · LINEAR PROGRAMMING</div></header>
    <section className="fr-lab"><aside><h2>HALF-PLANE INTERSECTION LAB</h2><h3>SYSTEM OF INEQUALITIES</h3>{constraints.map(c=><p key={c.label} style={{color:c.color}}>{c.label}</p>)}<h3>TOGGLE CONSTRAINTS</h3>{constraints.map((c,i)=><div className="fr-constraint-row" key={i}><label><input type="checkbox" checked={c.enabled} onChange={event=>{setConstraints(previous=>previous.map((item,j)=>j===i?{...item,enabled:event.target.checked}:item));setGraded(false);}}/>{c.label}</label><input type="checkbox" role="switch" aria-label={`Shade ${c.label}`} title={`Shade ${c.label}`} checked={c.shaded!==false} onChange={event=>setConstraints(previous=>previous.map((item,j)=>j===i?{...item,shaded:event.target.checked}:item))}/></div>)}<h3>TEST POINT</h3><button onClick={()=>setPoint([0,0])}>Test (0, 0)</button><p>Point: ({point.join(", ")})</p>{constraints.filter(c=>c.enabled).map(c=><p key={c.label}>{c.label} <strong>{satisfiesRegion(point,c)?"✓ Pass":"× Fail"}</strong></p>)}</aside>
      <div><div className="fr-toolbar"><h2>GRAPH & FEASIBLE REGION</h2><label>Grid<input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/></label><label>Snap<input type="checkbox" checked={snap} onChange={e=>setSnap(e.target.checked)}/></label><button aria-label="Zoom in" title="Zoom in" onClick={()=>setZoom(z=>Math.min(1.5,z+.1))}><Plus size={14}/></button><button aria-label="Zoom out" title="Zoom out" onClick={()=>setZoom(z=>Math.max(.6,z-.1))}><Minus size={14}/></button><button aria-label="Reset view" title="Reset view" onClick={()=>setZoom(1)}><RotateCcw size={14}/></button></div><RegionGraph constraints={constraints} point={point} onPoint={setPoint} grid={grid} snap={snap} zoom={zoom}/></div></section>
    <section className="fr-summary"><div><h2>VERTICES OF FEASIBLE REGION</h2><table><thead><tr><th>Vertex</th><th>(x, y)</th>{constraints.filter(c=>c.enabled).map(c=><th key={c.label}>{c.label}</th>)}</tr></thead><tbody>{model.vertices.map((p,i)=><tr key={i}><td>{i+1}</td><td>({p.map(number).join(", ")})</td>{constraints.filter(c=>c.enabled).map(c=><td key={c.label}>{number(c.a*p[0]+c.b*p[1])} ≤ {c.c} ✓</td>)}</tr>)}</tbody></table></div><div><h2>CONSTRAINT SUMMARY</h2><p>Active constraints: {constraints.filter(c=>c.enabled).length}</p><p>Variables: x, y</p><strong>{model.kind}</strong><p>Area: {model.area===null?"Unbounded":`${number(model.area)} sq. units`}</p></div></section>
    <section className="fr-sweep"><div><h2>OBJECTIVE FUNCTION</h2><p>Maximize Z = 50x + 40y</p><h3>SWEEP LINE CONTROLS</h3><label>Z value<input type="number" value={sweep} onChange={e=>setSweep(Number(e.target.value))}/></label><input aria-label="Objective sweep" type="range" min="-1000" max="2000" value={sweep} onChange={e=>setSweep(Number(e.target.value))}/><button onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?"Pause sweep":"Animate sweep"}</button></div><div><h2>SWEEP LINE ON GRAPH</h2><RegionGraph constraints={constraints} point={point} sweep={sweep}/></div><div><h2>OBJECTIVE VALUE AT VERTICES</h2><table><tbody>{model.vertices.map(p=><tr key={p.join()}><td>({p.map(number).join(", ")})</td><td>{number(50*p[0]+40*p[1])}</td></tr>)}</tbody></table><h3>OPTIMAL SOLUTION</h3><p>{maximum===null?model.objectiveUnbounded?"No finite maximum":"No feasible solution":`Maximum Z = ${number(maximum)} at (${model.optimum!.map(number).join(", ")})`}</p></div></section>
    <div className="fr-types-row"><section className="fr-types"><h2>FEASIBLE REGION TYPES</h2><div>{["BOUNDED","UNBOUNDED","EMPTY"].map(kind=><button key={kind} onClick={()=>preset(kind)} aria-pressed={model.kind===kind}>{kind}</button>)}</div></section>
      <aside className="fr-reminder"><h2>IMPORTANT REMINDER</h2><p>Always test a point (like (0, 0)) to verify the inequality direction.</p><strong>Wrong direction → wrong region!</strong><button type="button" onClick={()=>setPoint([0,0])}>Test point (0, 0)</button></aside></div>
    <div className="fr-practice-row"><VertexPractice/><section className="fr-quiz"><h2>QUICK CHECK (DEFAULT SYSTEM)</h2>{["How many vertices?","Maximum value of Z?","At which point is the maximum achieved?"].map((question,i)=><label key={question}>{question}<input aria-label={question} value={answers[i]} onChange={e=>{setAnswers(previous=>previous.map((a,j)=>j===i?e.target.value:a));setGraded(false);}}/>{graded&&<strong>{(i===0?answers[i].trim()==="4":i===1?answers[i].trim()==="1100":answers[i].replace(/[()\s]/g,"")==="10,15")?"✓":"Try again"}</strong>}</label>)}<button onClick={()=>setGraded(true)}>Check answers</button></section></div>
    <nav className="fr-lesson-nav" aria-label="Adjacent lessons"><Link to="/lessons/school/class-12/class-12-linear-programming-formulating-linear-programming-problems"><ArrowLeft size={14}/>Formulating Linear Programming Problems</Link><Link to="/lessons/school/class-12/class-12-linear-programming-corner-point-method">Corner-Point Method<ArrowRight size={14}/></Link></nav>
      <LessonTopicStudyBoard lessonId={10201} alwaysVisible />

  </main>;
}
