import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Pause, Plus, Minus, RotateCcw } from "lucide-react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { DEFAULT_REGION, analyzeRegion, visibleRegion, satisfiesRegion, type RegionConstraint, type RegionPoint } from "./feasibleRegionModel";
import "./FeasibleRegionTargetLesson10201.css";
import LessonMockupFooter from "../components/LessonMockupFooter";
import MathExpression from "../../../components/ui/MathExpression";
import "../components/LessonMockupReference.css";
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
    {constraints.filter(c=>c.enabled&&c.shaded!==false).map(c=><polygon key={c.label} points={points(visibleRegion([c],bounds))} fill={c.color} opacity={c.a<0||c.b<0?.012:.045}/>)}
    <polygon points={points(visibleRegion(constraints,bounds))} fill="#25b276" opacity=".2"/>
    <text x="503" y="354">x</text><text x="46" y="14">y</text><path d="M40 10V360H510" fill="none" stroke="#303840"/>
    {constraints.filter(c=>c.enabled).map(c=>{const a:RegionPoint=c.b?[bounds.left,(c.c-bounds.left*c.a)/c.b]:[c.c/c.a,bounds.bottom];const b:RegionPoint=c.b?[bounds.right,(c.c-bounds.right*c.a)/c.b]:[c.c/c.a,bounds.top];return <line key={c.label} x1={map(a)[0]} y1={map(a)[1]} x2={map(b)[0]} y2={map(b)[1]} stroke={c.color} strokeWidth="1.7" strokeDasharray={c.a<0||c.b<0?"4 3":undefined}/>;})}
    {Array.from({length:9},(_,i)=>i*5).map(n=><g key={n}><text x={map([n,0])[0]} y="377">{n}</text>{n<35&&<text x="18" y={map([0,n])[1]+4}>{n}</text>}</g>)}
    {analyzeRegion(constraints).vertices.map(p=><g key={p.join()}><circle cx={map(p)[0]} cy={map(p)[1]} r="3"/><text x={map(p)[0]+6} y={map(p)[1]-8}>({number(p[0])}, {number(p[1])})</text></g>)}
    {sweep===undefined&&constraints.slice(0,2).filter(c=>c.enabled).map((c,i)=><text key={c.label} x={i===0?map([30,5])[0]:map([27,0])[0]} y={i===0?map([30,5])[1]-9:397} style={{fill:c.color}} textLength="86" lengthAdjust="spacingAndGlyphs">{c.label}</text>)}
    {sweep!==undefined&&<line x1={map([0,sweep/40])[0]} y1={map([0,sweep/40])[1]} x2={map([45,(sweep-2250)/40])[0]} y2={map([45,(sweep-2250)/40])[1]} stroke="#9044df" strokeDasharray="6 4"/>}
    {sweep!==undefined&&[800,1100,1400].map(z=><line key={z} x1={map([0,z/40])[0]} y1={map([0,z/40])[1]} x2={map([45,(z-2250)/40])[0]} y2={map([45,(z-2250)/40])[1]} stroke="#b291db" strokeDasharray="5 5" opacity=".6"/>)}
    {onPoint&&<g className="fr-point-callout" transform={`translate(${Math.min(390,Math.max(50,map(point)[0]+12))},${Math.min(310,Math.max(35,map(point)[1]-45))})`}><rect width="112" height="38" rx="5" fill="white" stroke="#ccd7e3"/><text x="8" y="16">Point: ({point.map(number).join(", ")})</text><text x="8" y="30">Drag on graph</text></g>}
    {onPoint&&<circle cx={map(point)[0]} cy={map(point)[1]} r="6" fill="#8454cf" tabIndex={0} role="slider" aria-label="Test point" aria-valuetext={point.join(", ")} onKeyDown={event=>{const moves:Record<string,RegionPoint>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};const delta=moves[event.key];if(delta){event.preventDefault();onPoint([point[0]+delta[0],point[1]+delta[1]]);}}}/>}
  </svg>;
}
function RegionTypeSketch({kind}:{kind:string}) {return <svg viewBox="0 0 100 70" aria-hidden="true"><path d="M12 5V58H94" fill="none" stroke="#63768a"/>{kind==="BOUNDED"?<><path d="M12 58L12 25L35 36L62 58Z" fill="#c9ebd7" stroke="#39a567"/></>:kind==="UNBOUNDED"?<><path d="M12 58V14L94 58Z" fill="#cfe5ff" stroke="#5298ef"/><path d="M28 18L18 8M18 8L18 15M18 8H25" fill="none" stroke="#5298ef"/></>:<><path d="M12 45H94M12 22H94" stroke="#e58c8c" strokeDasharray="4 3"/><path d="M40 24L54 40M54 24L40 40" stroke="#e05757"/></>}</svg>;}
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
  return <main className="fr10201 lesson-reference" data-testid="school-mockup-0875"><header><Link to="/lessons/school/class-12"><ArrowLeft size={14}/>School lessons</Link><small>CLASS 12 · LINEAR PROGRAMMING</small><h1>{lesson.title}</h1><p>Identify the feasible region by graphing each constraint and taking the intersection.</p><div className="fr-tags">{["16 min","ADVANCED","INTERACTIVE LAB","LINEAR PROGRAMMING"].map(tag=><span key={tag}>{tag}</span>)}</div></header>
    <section className="fr-lab"><aside><h2>HALF-PLANE INTERSECTION LAB</h2><section className="fr-system"><h3>SYSTEM OF INEQUALITIES</h3>{constraints.map(c=><p key={c.label} style={{color:c.color}}><MathExpression value={c.label}/><i style={{borderColor:c.color}}/></p>)}<p className="fr-hint">Shade each half-plane to see their intersection (feasible region).</p></section><section className="fr-toggles"><h3>TOGGLE CONSTRAINTS</h3>{constraints.map((c,i)=><div className="fr-constraint-row" key={i}><label><input type="checkbox" checked={c.enabled} onChange={event=>{setConstraints(previous=>previous.map((item,j)=>j===i?{...item,enabled:event.target.checked}:item));setGraded(false);}}/>{c.label}</label><input type="checkbox" role="switch" aria-label={`Shade ${c.label}`} title={`Shade ${c.label}`} checked={c.shaded!==false} onChange={event=>setConstraints(previous=>previous.map((item,j)=>j===i?{...item,shaded:event.target.checked}:item))}/></div>)}</section><section className="fr-point-test"><h3>TEST POINT</h3><button onClick={()=>setPoint([0,0])}>Test (0, 0)</button><p>Point: ({point.join(", ")})</p>{constraints.filter(c=>c.enabled).map(c=><p key={c.label}>{c.label} <strong className={satisfiesRegion(point,c)?"pass":"fail"}>{satisfiesRegion(point,c)?"✓ Pass":"× Fail"}</strong></p>)}<p className="fr-hint">TIP: Test points help verify the correct inequality direction.</p></section></aside>
      <div><div className="fr-toolbar"><h2>GRAPH & FEASIBLE REGION</h2><label>Grid<input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/></label><label>Snap<input type="checkbox" checked={snap} onChange={e=>setSnap(e.target.checked)}/></label><button aria-label="Zoom in" title="Zoom in" onClick={()=>setZoom(z=>Math.min(1.5,z+.1))}><Plus size={14}/></button><button aria-label="Zoom out" title="Zoom out" onClick={()=>setZoom(z=>Math.max(.6,z-.1))}><Minus size={14}/></button><button aria-label="Reset view" title="Reset view" onClick={()=>setZoom(1)}><RotateCcw size={14}/></button></div><RegionGraph constraints={constraints} point={point} onPoint={setPoint} grid={grid} snap={snap} zoom={zoom}/></div></section>
    <section className="fr-summary"><div><h2>VERTICES OF FEASIBLE REGION</h2><table><thead><tr><th>Vertex</th><th>(x, y)</th>{constraints.filter(c=>c.enabled).map(c=><th key={c.label}>{c.label}</th>)}</tr></thead><tbody>{model.vertices.map((p,i)=><tr key={i}><td>{i+1}</td><td>({p.map(number).join(", ")})</td>{constraints.filter(c=>c.enabled).map(c=><td key={c.label}>{c.a<0||c.b<0?`${number(-(c.a*p[0]+c.b*p[1]))} ≥ ${-c.c}`:`${number(c.a*p[0]+c.b*p[1])} ≤ ${c.c}`} ✓</td>)}</tr>)}</tbody></table><p className="fr-vertex-order">Feasible region vertices in boundary order: {model.vertices.length?model.vertices.map(p=>`(${p.map(number).join(", ")})`).join(" → "):"None"}</p></div><div><h2>CONSTRAINT SUMMARY</h2><p>Active constraints: {constraints.filter(c=>c.enabled).length}</p><p>Variables: x, y</p><strong>{model.kind}</strong><p>Area: {model.area===null?"Unbounded":`${number(model.area)} sq. units`}</p><p>Feasible region: {model.kind==="EMPTY"?"None":model.kind==="UNBOUNDED"?"Unbounded intersection":`Polygon (${model.vertices.length} vertices)`}</p></div></section>
    <section className="fr-sweep"><div><h2>OBJECTIVE FUNCTION</h2><p className="fr-objective">Maximize <MathExpression value="Z = 50x + 40y" /></p><h3>SWEEP LINE CONTROLS</h3><p>Move the objective line parallel to itself. The last contact gives the maximum when it is finite.</p><label>Z value<input aria-label="Z value" type="number" min="-1000" max="2000" value={sweep} onChange={e=>{const n=Number(e.target.value);if(Number.isFinite(n))setSweep(Math.max(-1000,Math.min(2000,n)));}}/></label><input aria-label="Objective sweep" type="range" min="-1000" max="2000" value={sweep} onChange={e=>setSweep(Number(e.target.value))}/><button onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?"Pause sweep":"Animate sweep"}</button></div><div><h2>SWEEP LINE ON GRAPH</h2><RegionGraph constraints={constraints} point={point} sweep={sweep}/></div><div><h2>OBJECTIVE VALUE AT VERTICES</h2><table><thead><tr><th>Vertex (x, y)</th><th>Z = 50x + 40y</th></tr></thead><tbody>{model.vertices.map(p=><tr key={p.join()} className={maximum!==null&&Math.abs(50*p[0]+40*p[1]-maximum)<1e-8?"fr-best":""}><td>({p.map(number).join(", ")})</td><td>{number(50*p[0]+40*p[1])}</td></tr>)}</tbody></table><div className="fr-optimal"><h3>OPTIMAL SOLUTION</h3><p>{maximum===null?model.objectiveUnbounded?"No finite maximum":"No feasible solution":`Maximum Z = ${number(maximum)} at (${model.optimum!.map(number).join(", ")})`}</p></div></div></section>
    <div className="fr-types-row"><section className="fr-types"><h2>FEASIBLE REGION TYPES <small>(Toggle constraints to explore)</small></h2><div>{["BOUNDED","UNBOUNDED","EMPTY"].map(kind=><button key={kind} onClick={()=>preset(kind)} aria-pressed={model.kind===kind}><strong>{kind}</strong><RegionTypeSketch kind={kind}/><span>{kind==="BOUNDED"?"Finite region with maximum and minimum.":kind==="UNBOUNDED"?"Region extends to infinity in at least one direction.":"No common region satisfies all constraints."}</span><small>{kind==="BOUNDED"?"Example: Our system":kind==="UNBOUNDED"?"Try: Keep only x ≥ 0, y ≥ 0":"Try: x + 2y ≤ −1"}</small></button>)}</div></section>
      <aside className="fr-reminder"><h2>IMPORTANT REMINDER</h2><p>Always test a point (like (0, 0)) to verify the inequality direction.</p><strong>Wrong direction → wrong region!</strong><button type="button" onClick={()=>setPoint([0,0])}>Test point (0, 0)</button></aside></div>
    <div className="fr-practice-row"><VertexPractice/><section className="fr-quiz"><h2>QUICK CHECK (DEFAULT SYSTEM)</h2>{["How many vertices?","Maximum value of Z?","At which point is the maximum achieved?"].map((question,i)=><label key={question}>{question}<input aria-label={question} value={answers[i]} onChange={e=>{setAnswers(previous=>previous.map((a,j)=>j===i?e.target.value:a));setGraded(false);}}/>{graded&&<strong>{(i===0?answers[i].trim()==="4":i===1?answers[i].trim()==="1100":answers[i].replace(/[()\s]/g,"")==="10,15")?"✓":"Try again"}</strong>}</label>)}<button onClick={()=>setGraded(true)}>Check answers</button></section></div>
    <nav className="fr-lesson-nav" aria-label="Adjacent lessons"><Link to="/lessons/school/class-12/class-12-linear-programming-formulating-linear-programming-problems"><ArrowLeft size={14}/>Formulating Linear Programming Problems</Link><Link to="/lessons/school/class-12/class-12-linear-programming-corner-point-method">Corner-Point Method<ArrowRight size={14}/></Link></nav>
      <LessonMockupFooter />

  </main>;
}
