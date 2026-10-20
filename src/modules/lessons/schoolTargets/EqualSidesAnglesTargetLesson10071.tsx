import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Save,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EqualSidesAnglesTargetLesson10071.css";
import{eaInitial10071,eaClamp10071 as clamp,eaConstrain10071 as constrained,eaMeasure10071 as measure,eaRelations10071,eaPairs10071}from'./equalSidesAnglesModel10071';
import{paSector10074}from'./parallelogramAnglesModel10074';

type Point = { x: number; y: number };
type Measures=ReturnType<typeof measure>;
const INITIAL=eaInitial10071;
const fmt = (n: number) => n.toFixed(1);

export default function EqualSidesAnglesTargetLesson10071({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [apex, setApex] = useState<Point>(INITIAL),
    [sideLock, setSideLock] = useState(1),
    [angleLock, setAngleLock] = useState(1),
    [options, setOptions] = useState([true, true, true, true]),
    [tab, setTab] = useState(0),
    [challengeY, setChallengeY] = useState(2.06),
    [choices, setChoices] = useState([false, false, true, false]),
    [reason, setReason] = useState(""),
    [saved, setSaved] = useState(()=>{try{return localStorage.getItem('math-rule-10071')==='1';}catch{return false;}}),[graded,setGraded]=useState(false),
    [actions, setActions] = useState(0);
  const m=measure(apex,sideLock,angleLock),cm=measure({x:0,y:challengeY},1,1),equalSides=m.eq[0],equalAngles=m.eq[0],relations=m.eq.flatMap((v,i)=>v?[eaRelations10071[i].join(' ⇔ ')]:[]),pairs=eaPairs10071(sideLock,angleLock);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const move = (p: Point) =>
    act(() => setApex(constrained(p, sideLock, angleLock)));
  const setSide = (value: number) =>
    act(() => {
      setSideLock(value);
      setApex(constrained(apex, value, angleLock));
    });
  const setAngle = (value: number) =>
    act(() => {
      setAngleLock(value);
      setApex(constrained(apex, sideLock, value));
    });
  const reset = () =>
    act(() => {
      setApex(INITIAL);
      setSideLock(1);
      setAngleLock(1);
      setOptions([true, true, true, true]);
    });
  return (
    <section
      className="esa10071-page"
      data-testid="school-mockup-0745"
      data-object-model="dedicated-constrained-apex-isosceles-opposite-parts-engine"
      data-apex={`${apex.x},${apex.y}`}
      data-sides={`${m.ab},${m.ac},${m.bc}`}
      data-angles={`${m.a},${m.b},${m.c}`}
      data-side-lock={sideLock}
      data-angle-lock={angleLock}
      data-options={options.map(Number).join(",")}
      data-equal={String(equalSides && equalAngles)}
      data-challenge-y={challengeY} data-relations={m.eq.map(Number).join(",")} data-graded={graded?String(choices.every((v,i)=>v===(i===2))):"ungraded"}
      data-choice={choices.map(Number).join(",")}
      data-reason-length={reason.length}
      data-saved={String(saved)}
      data-actions={actions}
    >
      <div role="banner" className="esa10071-hero"><Link className="esa10071-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>Equal Sides and Equal Angles</h1>
        <p>
          Explore how equal sides and opposite angles are connected in a
          triangle.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="esa10071-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(['esa10071-interact','esa10071-learn','esa10071-example','esa10071-formula','challenge'][i])?.scrollIntoView({behavior:'smooth',block:'start'});})}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section id="esa10071-interact" className="esa10071-lab">
          <div className="esa10071-canvas">
            <header>
              <h2>
                <FlaskConical /> INTERACTIVE TRIANGLE LAB
              </h2>
              <p>
                Drag the purple vertex to explore. Use the controls to lock
                sides or angles.
              </p>
            </header>
            <IsoscelesDiagram
              point={apex}
              measures={m}
              options={options}
              name="Main triangle"
              onMove={move}
            />
            <strong className={relations.length?"truth":"pending"}><Check/>{relations.length?relations.join(' • '):'Unequal sides have unequal opposite angles.'}</strong>
            <footer>
              <h3>Live Measurements</h3>
              {[
                ["AB", m.ab],
                ["AC", m.ac],
                ["BC", m.bc],
              ].map(([x, v]) => (
                <span key={String(x)}>
                  {x} = {(v as number).toFixed(2)}
                </span>
              ))}
              {[
                ["∠A", m.a],
                ["∠B", m.b],
                ["∠C", m.c],
              ].map(([x, v]) => (
                <span className="angle" key={String(x)}>
                  {x} = {(v as number).toFixed(1)}°
                </span>
              ))}
            </footer>
          </div>
          <aside className="esa10071-controls">
            <h2>CONTROLS</h2>
            <section>
              <h3>Lock Equal Sides</h3>
              <p>Keep two sides equal while you drag.</p>
              <Segmented name="Sides"
                value={sideLock}
                labels={["Off", "AB = AC", "AB = BC", "AC = BC"]}
                onChange={setSide}
              />
            </section>
            <section>
              <h3>Lock Equal Angles</h3>
              <p>Keep two angles equal while you drag.</p>
              <Segmented name="Angles"
                value={angleLock}
                labels={["Off", "∠B = ∠C", "∠A = ∠B", "∠A = ∠C"]}
                onChange={setAngle}
              />
            </section>
            <section>
              <h3>Display Options</h3>
              {[
                "Show angle measures",
                "Show side lengths",
                "Show tick marks",
                "Show angle arcs",
              ].map((label, i) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    checked={options[i]}
                    onChange={(e) =>
                      act(() => {
                        const next = [...options];
                        next[i] = e.target.checked;
                        setOptions(next);
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </section>
            {pairs.length>1&&<p className="esa10071-lock-note" role="status">Both different equality conditions require an equilateral triangle. Turn one lock off to reshape.</p>}
            <button onClick={reset}>
              <RotateCcw /> Reset Triangle
            </button>
          </aside>
        </section>
        <section className="esa10071-now">
          <Check />
          <p>
            <b>What's true right now</b>
            <br />
            {relations.length?relations.join(' • '):'All three sides differ, and their opposite angles differ.'}
          </p>
          <span>Experiment • Observe • Discover</span>
        </section>
        <section id="esa10071-learn" className="esa10071-theory">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              <b>In any triangle:</b>
            </p>
            <p>◆ Equal sides have equal opposite angles.</p>
            <p>◆ Equal angles have equal opposite sides.</p>
            <p>
              This follows from the <b>Isosceles Triangle Theorem.</b>
            </p>
            <details className="esa10071-proof"><summary>Learn more: proof →</summary><p>Bisect ∠A and meet BC at D. AB = AC, AD is common, and ∠BAD = ∠CAD. By SAS, △ABD ≅ △ACD, so ∠B = ∠C.</p><p>Conversely, if ∠B = ∠C, compare △ABC and △ACB: equal angles at B/C and the common included side BC = CB give ASA congruence, hence AB = AC.</p></details>
          </article>
          <article>
            <h2 id="esa10071-example">▦ WORKED EXAMPLE</h2>
            <p>If AB = AC, then ∠B = ∠C.</p>
            <MiniIso />
            <p>
              Since AB = AC, the triangle is isosceles.
              <br />
              Therefore, ∠B = ∠C.
            </p>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> WARNING: COMMON MISTAKE
            </h2>
            <p>
              The equal angle lies <b>opposite</b>—not adjacent to—the equal
              side.
            </p>
            <strong>
              <Check /> Correct
            </strong>
            <MiniIso variant="correct"/><p>AB is opposite ∠C; AC is opposite ∠B.</p>
            <hr />
            <strong className="bad">⊗ Incorrect</strong>
            <MiniIso variant="wrong"/><p>∠B is adjacent to AB. AB corresponds to the angle at C.</p>
          </article>
        </section>
        <section id="challenge" className="esa10071-challenge">
          <header>
            <h2>◎ CHALLENGE</h2>
            <p>
              Drag the apex while keeping AB = AC. Then answer the question.
            </p>
          </header>
          <div>
            <IsoscelesDiagram
              point={{ x: 0, y: challengeY }}
              measures={cm}
              options={[true, true, true, true]}
              name="Challenge triangle"
              onMove={(p) => act(() => setChallengeY(clamp(p.y, 0.8, 2.5)))}
            />
          </div>
          <section>
            <b>Question</b>
            <p>While keeping AB = AC:</p>
            <h3>
              Which angles remain equal no matter where you drag the vertex?
            </h3>
            <p>Select all that apply.</p>
            {[
              "∠A and ∠B",
              "∠A and ∠C",
              "∠B and ∠C",
              "All three angles are always equal",
            ].map((label, i) => (
              <label key={label}>
                <input
                  type="checkbox"
                  checked={choices[i]}
                  onChange={(e) =>
                    act(() => {
                      const next = [...choices];
                      next[i] = e.target.checked;
                      setChoices(next);setGraded(false);
                    })
                  }
                />
                {label}
              </label>
            ))}
            <button className="esa10071-check" onClick={()=>setGraded(true)}>Check answer</button>{graded&&<p role="status">{choices.every((v,i)=>v===(i===2))?'Correct: only ∠B and ∠C remain equal for every isosceles shape.':'Select only ∠B and ∠C. All three are equal only in the equilateral special case.'}</p>}
          </section>
          <aside>
            <label>
              <b>Your explanation (optional)</b>
              <textarea
                value={reason}
                onChange={(e) => act(() => setReason(e.target.value))}
                placeholder="Type your reasoning here..."
              />
            </label>
            <p>Great explanations help you learn!</p>
            <footer>
              <b>Hint</b>
              <p>
                Think about which sides are equal and where the opposite angles
                are.
              </p>
            </footer>
          </aside>
        </section>
        <section id="esa10071-formula" className="esa10071-rule">
          <h2>⊙ THE RULE TO REMEMBER</h2>
          <p>
            In a triangle, equal sides have equal opposite angles, and equal
            angles have equal opposite sides.
          </p>
          <button
            className={saved ? "saved" : ""}
            aria-pressed={saved} onClick={() => act(() => setSaved(value=>{try{localStorage.setItem('math-rule-10071',value?'0':'1');}catch{/* Storage unavailable. */}return !value;}))}
          >
            <Save /> {saved ? "Saved" : "Save rule"}
          </button>
        </section>
      </main>
      <nav className="esa10071-nav"><Link to="/lessons/school/class-9/class-9-triangle-proofs-rhs-congruence"><ArrowLeft/>RHS Congruence</Link><Link to="/lessons/school/class-9/class-9-triangle-proofs-triangle-inequality">Triangle Inequality<ArrowRight/></Link></nav><footer className="esa10071-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function Segmented({
  name,value,
  labels,
  onChange,
}: {
  name:string;value: number;
  labels: string[];
  onChange: (n: number) => void;
}) {
  return (
    <div className="esa10071-segmented">
      {labels.map((label, i) => (
        <button
          key={label}
          aria-label={`${name}: ${label}`} aria-pressed={value===i} className={value === i ? "active" : ""}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
function IsoscelesDiagram({point,measures,options,onMove,name}:{point:Point;measures:Measures;options:boolean[];onMove:(p:Point)=>void;name:string}){const svgRef=useRef<SVGSVGElement>(null),gesture=useRef<{point:Point;client:Point;moved:boolean}|null>(null),a={x:200+100*point.x,y:315-100*point.y},b={x:100,y:315},c={x:300,y:315},vertices=[a,b,c],sectors=vertices.map((v,i)=>paSector10074(v,vertices[(i+1)%3],vertices[(i+2)%3],30)),local=(ev:PointerEvent<SVGSVGElement>)=>{const matrix=svgRef.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());return{x:(p.x-200)/100,y:(315-p.y)/100};},move=(ev:PointerEvent<SVGSVGElement>)=>{const g=gesture.current;if(!g)return;if(Math.hypot(ev.clientX-g.client.x,ev.clientY-g.client.y)>.5)g.moved=true;if(g.moved){const p=local(ev);if(p)onMove(p);}},equalEdges=[false,false,false];if(measures.eq[0])equalEdges[0]=equalEdges[1]=true;if(measures.eq[1])equalEdges[0]=equalEdges[2]=true;if(measures.eq[2])equalEdges[1]=equalEdges[2]=true;return <svg ref={svgRef} className="esa10071-diagram" viewBox="0 0 400 370" aria-label="Draggable equal sides and angles triangle" data-name={name} onPointerMove={move} onPointerUp={ev=>{move(ev);gesture.current=null;}} onPointerCancel={()=>{if(gesture.current)onMove(gesture.current.point);gesture.current=null;}}><path className="triangle-fill" d={`M${a.x} ${a.y}L100 315H300Z`}/>{[[a,b],[a,c],[b,c]].map(([u,v],i)=><g key={i}><line className={i===2?'base-edge':'equal-edge'} x1={u.x} y1={u.y} x2={v.x} y2={v.y}/>{options[2]&&equalEdges[i]&&<Ticks a={u} b={v}/>} {options[1]&&<text className="length" x={(u.x+v.x)/2+(i===0?-28:i===1?28:0)} y={(u.y+v.y)/2+(i===2?35:0)}>{[measures.ab,measures.ac,measures.bc][i].toFixed(2)}</text>}</g>)}{sectors.map((sector,i)=>sector&&<g key={i}>{options[3]&&<path className={`arc ${['a','b','c'][i]}`} d={sector.path}/>} {options[0]&&<text className={`angle-value m${['a','b','c'][i]}`} x={sector.label.x} y={sector.label.y+4}>{fmt([measures.a,measures.b,measures.c][i])}°</text>}</g>)}<circle className="handle" cx={a.x} cy={a.y} r="7" tabIndex={0} role="slider" aria-label={`${name} apex A`} aria-valuemin={.65} aria-valuemax={2.8} aria-valuenow={point.y} aria-valuetext={`x ${point.x}, y ${point.y}`} onPointerDown={ev=>{ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={point,client:{x:ev.clientX,y:ev.clientY},moved:false};}} onKeyDown={ev=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?.2:.05;onMove({x:point.x+(ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0),y:point.y+(ev.key==='ArrowUp'?n:ev.key==='ArrowDown'?-n:0)});}}/><circle className="base-point" cx="100" cy="315" r="5"/><circle className="base-point" cx="300" cy="315" r="5"/><text className="vertex a" x={a.x} y={a.y-16}>A</text><text className="vertex" x="86" y="332">B</text><text className="vertex" x="314" y="332">C</text><text className="drag" x={a.x+18} y={a.y}>Drag me</text></svg>;}
function Ticks({a,b}:{a:Point;b:Point}){const dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy),ux=dx/n,uy=dy/n;return <g className="ticks">{[-2,2].map(t=><line key={t} x1={(a.x+b.x)/2+t*ux-6*uy} y1={(a.y+b.y)/2+t*uy+6*ux} x2={(a.x+b.x)/2+t*ux+6*uy} y2={(a.y+b.y)/2+t*uy-6*ux}/>)}</g>;}
function MiniIso({variant='worked'}:{variant?:'worked'|'correct'|'wrong'}){const a={x:95,y:18},b={x:25,y:105},c={x:165,y:105},vertices=[a,b,c],marked=variant==='correct'?[1,2]:variant==='wrong'?[1]:[0,1,2];return <svg className={`esa10071-mini ${variant}`} viewBox="0 0 190 135" aria-label={variant==='wrong'?'Wrong: angle B is adjacent to side AB':variant==='correct'?'AB opposite angle C; AC opposite angle B':'Isosceles worked example'}><path className="mini-shape" d="M25 105L95 18L165 105Z"/><line className="mini-base" x1="25" y1="105" x2="165" y2="105"/><Ticks a={a} b={b}/><Ticks a={a} b={c}/>{marked.map(i=>{const s=paSector10074(vertices[i],vertices[(i+1)%3],vertices[(i+2)%3],19);return s?<g key={i}><path className="mini-arc" d={s.path}/>{variant==='worked'&&<text className="variable" x={s.label.x} y={s.label.y+3}>{i===0?'y°':'x°'}</text>}</g>:null;})}{vertices.map((p,i)=><text key={i} className="mini-letter" x={p.x+(i===1?-10:i===2?10:0)} y={p.y+(i===0?-8:15)}>{['A','B','C'][i]}</text>)}</svg>;}
