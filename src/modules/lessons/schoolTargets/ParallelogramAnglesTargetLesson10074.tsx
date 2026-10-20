import {
  Atom, BookOpen, Calculator, Braces, ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramAnglesTargetLesson10074.css";
import MathExpression from '../../../components/ui/MathExpression';
import{parallelogramAngles10074,paStart10074,paMove10074,paSector10074,paPredictions10074,paForAngle10074}from'./parallelogramAnglesModel10074';

type Point = { x: number; y: number };
type Vertex = "a" | "b" | "c" | "d";
type Base = { a: Point; b: Point; d: Point };
const START=paStart10074;
const fmt=(n:number)=>Number(n.toFixed(2));
export default function ParallelogramAnglesTargetLesson10074({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [base, setBase] = useState(START),
    [diagonal, setDiagonal] = useState<"AC" | "BD">("AC");
  const [showDiagonal, setShowDiagonal] = useState(true),
    [values, setValues] = useState(true);
  const [parallel, setParallel] = useState(true),
    [proofStep, setProofStep] = useState(0),
    [tab, setTab] = useState(0);
  const [challengeB, setChallengeB] = useState("95"),
    [answers, setAnswers] = useState(["85", "85", "95"]),
    [actions, setActions] = useState(0);
  const svgRef=useRef<SVGSVGElement>(null),gesture=useRef<{key:Vertex;base:Base;client:Point;moved:boolean}|null>(null);
  const m=useMemo(()=>parallelogramAngles10074(base),[base]),c=m.points.c,angles=m.angles,angleA=angles[0],validB=challengeB.trim()!==''&&Number.isFinite(Number(challengeB))&&Number(challengeB)>=1&&Number(challengeB)<=179,prediction=validB?paPredictions10074(Number(challengeB)):null,isAnswer=(i:number)=>prediction!==null&&answers[i].trim()!==''&&Number.isFinite(Number(answers[i]))&&Number(answers[i])===prediction[i],score=answers.filter((_,i)=>isAnswer(i)).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update=(key:Vertex,point:Point)=>setBase(old=>paMove10074(old,key,point));
  const pointer=(ev:PointerEvent<SVGSVGElement>)=>{const matrix=svgRef.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());return{x:p.x,y:p.y};};
  const keyMove=(key:Vertex,dx:number,dy:number)=>{const p=key==='c'?c:base[key];act(()=>update(key,{x:p.x+dx,y:p.y+dy}));};
  const finish=(ev:PointerEvent<SVGSVGElement>)=>{const g=gesture.current;if(!g)return;const p=pointer(ev);if(p&&g.moved)update(g.key,p);gesture.current=null;setActions(n=>n+1);};
  const reset = () =>
    act(() => {
      setBase(START);
      setDiagonal("AC");
      setShowDiagonal(true);
      setValues(true);
      setParallel(true);
      setProofStep(0);
      setChallengeB("95");
      setAnswers(["85", "85", "95"]);gesture.current=null;
    });
  return (
    <section
      className="pa10074-page"
      data-testid="school-mockup-0748"
      data-object-model="dedicated-constrained-parallelogram-opposite-angle-engine"
      data-points={`${base.a.x},${base.a.y};${base.b.x},${base.b.y};${c.x},${c.y};${base.d.x},${base.d.y}`}
      data-angles={angles.map(n=>n??"undefined").join(",")} data-valid={String(m.valid)}
      data-diagonal={diagonal}
      data-layers={`${+showDiagonal},${+values},${+parallel}`}
      data-proof-step={proofStep + 1}
      data-challenge={`${challengeB};${answers.join(",")};${score}/3`}
      data-actions={actions}
    >
      <div role="banner" className="pa10074-hero"><Link className="pa10074-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Parallelogram Opposite Angles</h1>
        <p>
          Explore and prove that in a parallelogram, opposite angles are equal
          and adjacent angles are supplementary.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="pa10074-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(["pa10074-interact","pa10074-learn","pa10074-example","pa10074-formula","pa10074-practice"][i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {i===0?<Atom/>:i===1?<BookOpen/>:i===2?<Calculator/>:i===3?<Braces/>:<ClipboardCheck/>}{x}
          </button>
        ))}
      </div>
      <main>
        <section id="pa10074-interact" className="pa10074-lab">
          <header>
            <div>
              <h2>INTERACTIVE PARALLELOGRAM LAB</h2>
              <p>
                Drag any vertex to explore. Toggle diagonals to see the proof in
                action.
              </p>
            </div>
            <label>
              Show diagonals{" "}
              <button
                role="switch" aria-label="Show diagonal in diagram"
                aria-checked={showDiagonal}
                className={showDiagonal ? "on" : ""}
                onClick={() => act(() => setShowDiagonal(!showDiagonal))}
              >
                <i />
              </button>
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="pa10074-work">
            <aside>
              <section>
                <h3>MEASUREMENTS</h3>
                {["A", "B", "C", "D"].map((x, i) => (
                  <p key={x}>
                    <b>∠{x}</b>
                    <span>
                      {angles[i]===null?"Undefined":fmt(angles[i]!)+"°"} <i className={`c${i}`} />
                    </span>
                  </p>
                ))}
                <Toggle
                  label="Show angle values"
                  value={values}
                  onChange={() => act(() => setValues(!values))}
                />
                <Toggle
                  label="Show parallel marks"
                  value={parallel}
                  onChange={() => act(() => setParallel(!parallel))}
                />
                <Toggle
                  label="Show diagonals"
                  value={showDiagonal}
                  onChange={() => act(() => setShowDiagonal(!showDiagonal))}
                />
              </section>
              <section>
                <h3>DRAG TIPS</h3>
                <p>Drag any vertex (A, B, C, or D) to change the shape.</p>
                <p>The parallelogram properties will always hold.</p>
              </section>
            </aside>
            <article className="pa10074-canvas">
              <svg
                ref={svgRef}
                viewBox="0 0 540 390"
                aria-label="Draggable opposite-angle parallelogram"
                onPointerMove={ev=>{const g=gesture.current;if(!g)return;if(Math.hypot(ev.clientX-g.client.x,ev.clientY-g.client.y)>.5)g.moved=true;const p=pointer(ev);if(p&&g.moved)update(g.key,p);}}
                onPointerUp={finish}
                onPointerCancel={()=>{if(gesture.current)setBase(gesture.current.base);gesture.current=null;}}
              >
                <defs>
                  <pattern
                    id="paGrid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M24 0H0V24" />
                  </pattern>
                </defs>
                <rect width="540" height="390" fill="url(#paGrid)" />
                <path
                  className="shape"
                  d={`M${base.a.x} ${base.a.y}L${base.b.x} ${base.b.y}L${c.x} ${c.y}L${base.d.x} ${base.d.y}Z`}
                />
                {showDiagonal && (
                  <line
                    className="diagonal"
                    x1={diagonal === "AC" ? base.a.x : base.b.x}
                    y1={diagonal === "AC" ? base.a.y : base.b.y}
                    x2={diagonal === "AC" ? c.x : base.d.x}
                    y2={diagonal === "AC" ? c.y : base.d.y}
                  />
                )}
                <AngleSectors
                  a={base.a}
                  b={base.b}
                  c={c}
                  d={base.d}
                  values={values}
                  angles={angles}
                />
                {parallel && m.valid && (
                  <ParallelMarks a={base.a} b={base.b} c={c} d={base.d} />
                )}{" "}
                {showDiagonal&&m.valid&&<ProofSectors points={m.points} diagonal={diagonal} step={proofStep}/>}
                {(["a", "b", "c", "d"] as Vertex[]).map((key) => {
                  const p = key === "c" ? c : base[key];
                  return (
                    <g key={key}><circle
                      key={key}
                      className="handle"
                      cx={p.x}
                      cy={p.y}
                      r="7"
                      tabIndex={0}
                      aria-label={`Draggable vertex ${key.toUpperCase()}`}
                      role="slider" aria-valuemin={40} aria-valuemax={500} aria-valuenow={p.x} aria-valuetext={`x ${p.x}, y ${p.y}`}
                      onPointerDown={ev=>{ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={key,base,client:{x:ev.clientX,y:ev.clientY},moved:false};}}
                      onKeyDown={ev=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?10:4;keyMove(key,ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0,ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0);}}
                    /><text className="vertex-label" x={p.x+(p.x<(base.a.x+c.x)/2?-13:10)} y={p.y+(p.y<(base.a.y+c.y)/2?-12:22)}>{key.toUpperCase()}</text></g>
                  );
                })}
              </svg>
              <section className="pa10074-feedback">
                <h3>LIVE FEEDBACK</h3>
                {m.valid?<><p>✓ AB ∥ CD and AD ∥ BC</p>
                <p>✓ Opposite angles are equal: ∠A = ∠C and ∠B = ∠D</p>
                <p>✓ Adjacent angles are supplementary: ∠A + ∠B = 180°</p></>:<p className="invalid">Flat or coincident vertices: reshape the figure to measure reliable interior angles.</p>}
              </section>
            </article>
            <aside className="pa10074-proof">
              <section>
                <h3>PROOF MODE</h3>
                <p>Step through the diagonal proof.</p>
              </section>
              <section>
                <h3>Select a diagonal:</h3>
                <button
                  aria-label="Use diagonal AC" aria-pressed={diagonal==="AC"}
                  className={diagonal === "AC" ? "active" : ""}
                  onClick={() => act(() => {setDiagonal("AC");setProofStep(0);setShowDiagonal(true);})}
                >
                  ◉ AC
                </button>
                <button
                  aria-label="Use diagonal BD" aria-pressed={diagonal==="BD"}
                  className={diagonal === "BD" ? "active" : ""}
                  onClick={() => act(() => {setDiagonal("BD");setProofStep(0);setShowDiagonal(true);})}
                >
                  ◉ BD
                </button>
              </section>
              <ProofSteps
                diagonal={diagonal}
                active={proofStep}
                onSelect={(index) => act(() => {setProofStep(index);setShowDiagonal(true);})}
              />
              <section className="theorem">
                <h3>THEOREM</h3>
                <b>
                  In a parallelogram, opposite angles are equal.
                  <br />
                  Adjacent angles are supplementary.
                </b>
              </section>
            </aside>
          </div>
        </section>
        <section className="pa10074-theory">
          <Why angle={angleA} />
          <Worked angle={68} />
        </section>
        <section className="pa10074-lower">
          <Mistake />
          <article id="pa10074-practice" className="pa10074-challenge"><h2><Trophy/>CHALLENGE: DRAG &amp; PREDICT</h2><p>Practice with one given angle, then predict the others. This example is independent of the live shape.</p><label>Given ∠B = <input aria-label="Challenge angle B" aria-invalid={!validB} type="number" min="1" max="179" step="any" value={challengeB} onChange={ev=>act(()=>setChallengeB(ev.target.value))}/>°</label><button className="pa10074-use-angle" disabled={!m.valid} onClick={()=>act(()=>{setChallengeB(String(fmt(angles[1]!)));setAnswers(['','','']);})}>Use displayed ∠B</button>{['A','C','D'].map((name,i)=><label key={name}>Predict ∠{name} = <input aria-label={`Predict angle ${name}`} aria-invalid={answers[i].trim()===''||!Number.isFinite(Number(answers[i]))||Number(answers[i])<=0||Number(answers[i])>=180} type="number" min="0" max="180" step="any" value={answers[i]} onChange={ev=>act(()=>setAnswers(old=>old.map((v,j)=>i===j?ev.target.value:v)))}/>° {isAnswer(i)?<Check/>:<TriangleAlert/>}</label>)}<p role="status">{validB?`${score}/3 correct. Use exact values for this given angle; values that only round to the answer do not pass.`:'Enter a given angle B between 1° and 179°.'}</p><footer><b>Challenge Tip</b><p>Opposite angles are equal. Adjacent angles add to 180°.</p></footer></article>
        </section>
      </main>
      <div className="pa10074-nav">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-sides">
          <ArrowLeft /> Parallelogram Opposite Sides
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-diagonals">
          Parallelogram Diagonals <ArrowRight />
        </Link>
      </div><footer className="pa10074-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}

function Toggle({label,value,onChange}:{label:string;value:boolean;onChange:()=>void}){return<label><input type="checkbox" aria-label={label} checked={value} onChange={onChange}/>{label}</label>;}
function AngleSectors({a,b,c,d,values,angles}:{a:Point;b:Point;c:Point;d:Point;values:boolean;angles:(number|null)[]}){if(angles[0]===null)return null;const ps=[a,b,c,d];return<g className="pa-angles">{ps.map((p,i)=>{const s=paSector10074(p,ps[(i+3)%4],ps[(i+1)%4]);return s?<g key={i}><path className={['a','b','c','d'][i]} d={s.path}/>{values&&<text className={['a-text','b-text','c-text','d-text'][i]} textAnchor="middle" x={s.label.x} y={s.label.y+4}>{fmt(angles[i]!)}°</text>}</g>:null;})}</g>;}
function ParallelMarks({a,b,c,d}:{a:Point;b:Point;c:Point;d:Point}){const mark=(p:Point,q:Point,count:number)=>{const dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy);if(l<15)return'';const ux=dx/l,uy=dy/l,nx=-uy,ny=ux;return Array.from({length:count},(_,i)=>{const x=(p.x+q.x)/2+ux*(i-(count-1)/2)*7,y=(p.y+q.y)/2+uy*(i-(count-1)/2)*7;return`M${x-ux*4+nx*5} ${y-uy*4+ny*5}L${x+ux*3} ${y+uy*3}L${x-ux*4-nx*5} ${y-uy*4-ny*5}`;}).join('');};return<g className="pa-marks"><path d={mark(a,b,2)+mark(d,c,2)}/><path d={mark(a,d,1)+mark(b,c,1)}/></g>;}
function ProofSectors({points:p,diagonal,step}:{points:Record<Vertex,Point>;diagonal:'AC'|'BD';step:number}){const pairs=diagonal==='AC'?[[['a','b','c'],['c','d','a']],[['a','c','d'],['c','a','b']]]:[[ ['b','a','d'],['d','c','b']],[['d','a','b'],['b','c','d']]],selected=step<2?[pairs[step]]:pairs;return<g className="pa10074-proof-sectors">{selected.flat().map(([v,a,b],i)=>{const s=paSector10074(p[v as Vertex],p[a as Vertex],p[b as Vertex],28);return s?<path key={i} d={s.path}/>:null;})}</g>;}
function ProofSteps({diagonal,active,onSelect}:{diagonal:'AC'|'BD';active:number;onSelect:(i:number)=>void}){const titles=['Alternate interior angles','Alternate interior angles','Angle addition','Substitution','Conclusion'],equations=diagonal==='AC'?[String.raw`\angle BAC=\angle DCA`,String.raw`\angle CAD=\angle BCA`,String.raw`\angle BAC+\angle CAD=\angle DCA+\angle BCA`,String.raw`\angle BAD=\angle BCD`,String.raw`\angle A=\angle C`]:[String.raw`\angle ABD=\angle CDB`,String.raw`\angle ADB=\angle CBD`,String.raw`\angle ABD+\angle CBD=\angle CDB+\angle ADB`,String.raw`\angle ABC=\angle CDA`,String.raw`\angle B=\angle D`];return<section className="proofsteps"><h3>PROOF STEPS</h3>{titles.map((title,i)=><button key={i} aria-label={`Proof step ${i+1}: ${title}`} aria-pressed={active===i} className={active===i?'active':''} onClick={()=>onSelect(i)}><i>{i+1}</i><b>{title}</b><p>{i<2?`Since ${i===0?'AB ∥ CD':'AD ∥ BC'}, diagonal ${diagonal} is a transversal.`:i===2?'Add the two equal angle pairs.':i===3?'Each sum is a full interior angle.':'The other diagonal proves the remaining opposite-angle pair.'}</p><MathExpression value={equations[i]}/></button>)}</section>;}
function Why({ angle }: { angle: number|null }) {
  return (
    <article id="pa10074-learn">
      <h2>WHY IT WORKS</h2>
      <p>
        In parallelogram ABCD, opposite sides are parallel. Using diagonal AC:
      </p>
      <ol>
        <li>∠BAC = ∠DCA (alternate interior angles).</li>
        <li>∠CAD = ∠BCA (alternate interior angles).</li>
        <li>Adding equals to equals proves ∠A = ∠C.</li>
        <li>Similarly, using BD proves ∠B = ∠D.</li><li>AB ∥ CD makes ∠A + ∠D = 180° along transversal AD. Substituting ∠D = ∠B gives ∠A + ∠B = 180°.</li>
      </ol>
      <div id="pa10074-formula">{angle===null?<p>Reshape the figure to measure its interior angles.</p>:<MathExpression value={`${fmt(angle)}^\\circ+${fmt(180-angle)}^\\circ=180^\\circ`}/>}</div>
      <footer>
        <b>Key Takeaway</b>
        <p>
          Parallel lines create equal alternate interior angles. Adding these
          equal angles proves equality of opposite angles.
        </p>
      </footer>
    </article>
  );
}
function SmallDiagram({angle}:{angle:number}){const m=parallelogramAngles10074(paForAngle10074(angle)),{a,b,c,d}=m.points;return<svg className="pa10074-small" viewBox="20 25 310 170" aria-label={`Parallelogram with angle A ${angle} degrees`}><path className="shape" d={`M${a.x} ${a.y}L${b.x} ${b.y}L${c.x} ${c.y}L${d.x} ${d.y}Z`}/><AngleSectors a={a} b={b} c={c} d={d} angles={m.angles} values/><ParallelMarks a={a} b={b} c={c} d={d}/>{Object.entries(m.points).map(([k,p])=><text className="vertex-label" key={k} x={p.x+(k==='a'||k==='d'?-12:7)} y={p.y+(k==='a'||k==='b'?-9:16)}>{k.toUpperCase()}</text>)}</svg>;}
function Worked({angle}:{angle:number}){return<article id="pa10074-example"><h2>WORKED EXAMPLE</h2><p><b>Given:</b> In parallelogram ABCD, ∠A = {angle}°.<br/><b>Find:</b> ∠B, ∠C, ∠D.</p><SmallDiagram angle={angle}/><ul><li>Opposite angles: ∠C = ∠A = {angle}°.</li><li>Adjacent angles: ∠B = ∠D = 180° − {angle}° = {180-angle}°.</li></ul><footer>Answer: ∠B = {180-angle}°, ∠C = {angle}°, ∠D = {180-angle}°.</footer></article>;}
function Mistake(){return<article className="pa10074-mistake"><h2><TriangleAlert/>COMMON MISTAKE</h2><h3>Thinking adjacent angles are equal.</h3><p>That is true only for rectangles, where both angles are 90°.</p><SmallDiagram angle={70}/><footer>Here ∠A = 70° and ∠B = 110°. In general, ∠A ≠ ∠B.</footer></article>;}
