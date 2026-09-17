import { useRef,useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft,ArrowRight,RotateCcw,Expand,Shrink,LocateFixed,Trophy,Lightbulb,List,Star } from "lucide-react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import { cornerPointModel } from "./cornerPointModel";
import "./CornerPointTargetLesson10202.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
const display=(n:number)=>Number(n.toFixed(2));
export default function CornerPointTargetLesson10202({lesson}:{lesson:SchoolSyllabusLesson}) {
  const [c1,setC1]=useState(6),[c2,setC2]=useState(8),[cx,setCx]=useState(3),[cy,setCy]=useState(2),[z,setZ]=useState(12);
  const [expanded,setExpanded]=useState(false),[answer,setAnswer]=useState<number|null>(null),[graded,setGraded]=useState(false);
  const [tab,setTab]=useState("Interact");
  const drag=useRef<1|2|null>(null);
  const model=cornerPointModel(c1,c2,cx,cy);
  const extent=Math.max(9,c1+1,c2+1),scale=420/extent;
  const map=(x:number,y:number)=>[65+x*scale,440-y*scale];
  const reset=()=>{setC1(6);setC2(8);setCx(3);setCy(2);setZ(12);setExpanded(false);};
  const field=(label:string,value:number,change:(value:number)=>void,min=-20)=><label>{label}<input type="number" aria-label={label} min={min} max="30" step="0.1" value={value} onChange={e=>{const v=Number(e.target.value);if(Number.isFinite(v))change(Math.max(min,Math.min(30,v)));}}/></label>;
  const move=(event:React.PointerEvent<SVGSVGElement>)=>{
    if(!drag.current)return;const matrix=event.currentTarget.getScreenCTM();if(!matrix)return;
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    const value=drag.current===1?(440-p.y)/scale:(p.x-65)/scale;
    (drag.current===1?setC1:setC2)(Math.max(.1,Math.min(30,Math.round(value*10)/10)));
  };
  const handle=(which:1|2,x:number,y:number)=><circle cx={map(x,y)[0]} cy={map(x,y)[1]} r="5" fill="white" stroke={which===1?"#248bff":"#954aff"} strokeWidth="2" tabIndex={0} role="slider" aria-label={`Constraint ${which} boundary`} aria-valuemin={.1} aria-valuemax={30} aria-valuenow={which===1?c1:c2}
    onPointerDown={event=>{drag.current=which;event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);event.preventDefault();}}
    onKeyDown={event=>{if(["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"].includes(event.key)){event.preventDefault();const change=which===1?setC1:setC2;change(v=>Math.max(.1,Math.min(30,v+(["ArrowUp","ArrowRight"].includes(event.key)?.1:-.1))));}}}/>;
  const objective=cy!==0?[[0,z/cy],[extent,(z-cx*extent)/cy]]:cx!==0?[[z/cx,0],[z/cx,extent]]:null;
  const practice=cornerPointModel(6,8,2,1);
  const practiceOrder=[0,2,3,1];
  return <main className="cp10202" data-testid="school-mockup-0876"><header><Link to="/lessons/school/class-12"><ArrowLeft size={14}/>School lessons</Link><small>CLASS 12 · LINEAR PROGRAMMING</small><h1>{lesson.title}</h1><p>Learn how to find the optimal value of a linear objective function using the corner-point (vertex) method.</p><div className="cp-tags">Class 12 · Linear Programming · 18 min</div></header>
    <nav className="cp-tabs" aria-label="Lesson sections">{["Interact","Learn","Worked Example","Rule","Practice"].map(name=><button key={name} aria-current={tab===name?"location":undefined} onClick={()=>{setTab(name);document.getElementById(`cp-${name.replaceAll(" ","-")}`)?.scrollIntoView({behavior:"smooth",block:"start"});}}>{name}</button>)}</nav>
    <section id="cp-Interact" className={`cp-workspace ${expanded?"expanded":""}`}><div className="cp-canvas"><div className="cp-graph-heading"><h2>FEASIBLE REGION & OBJECTIVE LINE</h2><button onClick={reset}><RotateCcw size={14}/>Reset view</button><button aria-label={expanded?"Exit expanded graph":"Expand graph"} title={expanded?"Exit expanded graph":"Expand graph"} onClick={()=>setExpanded(v=>!v)}>{expanded?<Shrink size={15}/>:<Expand size={15}/>}</button></div>
      <svg viewBox="0 0 520 500" className="cp-graph" role="img" aria-label="Corner-point feasible region and draggable constraints" onPointerMove={move} onPointerUp={event=>{drag.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}} onPointerCancel={()=>{drag.current=null;}}>
        {Array.from({length:Math.ceil(extent)+1},(_,i)=>i).map(n=><g key={n}><path d={`M${map(n,0)[0]} 15V475 M15 ${map(0,n)[1]}H505`} stroke="#e6eaf1" strokeDasharray="2 2"/><text x={map(n,0)[0]} y="457">{n}</text><text x="48" y={map(0,n)[1]+3}>{n}</text></g>)}
        <path d="M65 10V480 M10 440H510" stroke="#49515c" fill="none"/>
        <polygon points={model.vertices.map(v=>map(...v.point).join(",")).join(" ")} fill="#65b4ed" opacity=".28"/>
        {model.constraints.slice(0,2).map(c=><line key={c.label} x1={map(0,c.c/c.b)[0]} y1={map(0,c.c/c.b)[1]} x2={map(extent,(c.c-extent)/c.b)[0]} y2={map(extent,(c.c-extent)/c.b)[1]} stroke={c.color} strokeWidth="1.5"/>)}
        {objective&&<line x1={map(objective[0][0],objective[0][1])[0]} y1={map(objective[0][0],objective[0][1])[1]} x2={map(objective[1][0],objective[1][1])[0]} y2={map(objective[1][0],objective[1][1])[1]} stroke="#00a16b" strokeWidth="1.5" strokeDasharray="5 4"/>}
        {model.vertices.map(v=><g key={v.label}><circle cx={map(...v.point)[0]} cy={map(...v.point)[1]} r="5" fill="#086daa" stroke="white" strokeWidth="1.5"/><text className="cp-vertex-label" x={map(...v.point)[0]+7} y={map(...v.point)[1]-10}>{v.label} ({v.point.map(display).join(", ")})</text></g>)}
        {handle(1,0,c1)}{handle(2,c2,0)}
      </svg><div className="cp-legend"><strong>Constraints</strong>{model.constraints.map(c=><span key={c.label} style={{color:c.color}}>{c.label}</span>)}</div><p className="cp-line-label">Z = {cx}x + {cy}y = {display(z)}</p>
    </div><aside><section><h2>CONSTRAINTS</h2><p>x + y ≤ c₁</p>{field("c₁",c1,setC1,.1)}<p>x + 2y ≤ c₂</p>{field("c₂",c2,setC2,.1)}<p>x ≥ 0 (fixed)</p><p>y ≥ 0 (fixed)</p></section><section><h2>OBJECTIVE FUNCTION</h2><p>Maximize Z = c₃x + c₄y</p>{field("c₃",cx,setCx)}{field("c₄",cy,setCy)}</section><section><h2>MOVE THE OBJECTIVE LINE</h2><label><input aria-label="Objective line value" type="range" min={Math.min(-30,z)} max={Math.max(40,z,model.maximum??0)} step=".1" value={z} onChange={e=>setZ(Number(e.target.value))}/>Z = {display(z)}</label><button onClick={()=>{if(model.maximum!==null)setZ(model.maximum);}}><LocateFixed size={15}/>Auto (Best)</button></section></aside></section>
    <section id="cp-Worked-Example" className="cp-evaluation"><div><h2>VERTEX EVALUATION TABLE</h2><p>Evaluate Z = {cx}x + {cy}y at each vertex.</p><table><thead><tr><th>Vertex</th><th>Coordinates (x, y)</th><th>Calculation</th><th>Z</th></tr></thead><tbody>{model.vertices.map(v=><tr key={v.label} className={model.best.includes(v)?"best":""}><th>{v.label}</th><td>({v.point.map(display).join(", ")})</td><td>{cx}({display(v.point[0])}) + {cy}({display(v.point[1])})</td><td>{display(v.value)}</td></tr>)}</tbody></table></div><div className="cp-result" aria-live="polite"><h2>RESULT (LIVE)</h2><Trophy size={34}/><h3>Maximum Z = {display(model.maximum??0)}</h3><p>achieved at {model.best.map(v=>`${v.label} (${v.point.map(display).join(", ")})`).join(" and ")}</p>{model.best.length>1&&<p>Every convex combination of these optimal vertices is also optimal.</p>}</div></section>
    <section id="cp-Learn" className="cp-learning"><article><h2><Lightbulb size={20}/>WHY VERTICES?</h2><p>A linear objective over a nonempty bounded convex polygon reaches an optimum at a vertex.</p></article><article id="cp-Rule"><h2><List size={20}/>CORNER-POINT METHOD (3 STEPS)</h2><ol><li>Graph the constraints and identify the feasible region.</li><li>Find the vertices.</li><li>Evaluate Z at each vertex and compare the values.</li></ol></article><article><h2><Star size={20}/>KEY INSIGHT</h2><p>Move the objective line outward until it last touches the feasible region. An entire edge can be optimal when the objective is parallel to it.</p></article></section>
    <section id="cp-Practice" className="cp-practice"><h2>QUICK PRACTICE</h2><p>For the default feasible region, maximize Z = 2x + y.</p><div role="radiogroup" aria-label="Practice optimum">{practiceOrder.map((id,i)=><label key={id}><input type="radio" name="corner-practice" checked={answer===id} onChange={()=>{setAnswer(id);setGraded(false);}}/>{String.fromCharCode(65+i)} At {practice.vertices[id].label} ({practice.vertices[id].point.join(", ")})</label>)}<button onClick={()=>setGraded(true)}>Check answer</button></div>{graded&&<p role="status">{answer!==null&&practice.best.includes(practice.vertices[answer])?"Correct: maximum Z = 12 at (6, 0).":"Try evaluating 2x + y at all four vertices."}</p>}</section>
    <nav className="cp-next"><Link to="/lessons/school/class-12/class-12-linear-programming-feasible-region"><ArrowLeft size={14}/>Previous: Feasible Region</Link><Link to="/lessons/school/class-12/class-12-linear-programming-bounded-feasible-region">Next: Bounded Feasible Region<ArrowRight size={14}/></Link></nav>
      <LessonTopicStudyBoard lessonId={10202} view={tab} />

  </main>;
}
