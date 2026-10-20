import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  FlipHorizontal2,
  Layers,
  Lock,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RhsCongruenceTargetLesson10070.css";
import{createPortal}from'react-dom';
import MathExpression from '../../../components/ui/MathExpression';
import{rhsStart10070,rhsOther10070 as otherLeg,rhsChange10070,rhsBounds10070,rhsGeometry10070,rhsGrade10070,type RHS10070 as RhsModel}from'./rhsCongruenceModel10070';

const START=rhsStart10070;
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const fmt=(n:number)=>Number(n.toFixed(3)).toString();
export default function RhsCongruenceTargetLesson10070({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState<RhsModel>(START);
  const [parts, setParts] = useState([true, true, false]);
  const [view, setView] = useState<"normal" | "mirror" | "overlay">("normal");
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState(0);
  const [challenge, setChallenge] = useState([
    "∠Y",
    "∠Q",
    "XZ = PR",
    "XY = PQ",
  ]);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0),[swapped,setSwapped]=useState(false),[version,setVersion]=useState(0);
  const fullButton=useRef<HTMLButtonElement>(null),wasExpanded=useRef(false);
  useEffect(()=>{if(!expanded){if(wasExpanded.current)requestAnimationFrame(()=>fullButton.current?.focus());wasExpanded.current=false;return;}wasExpanded.current=true;const old=document.body.style.overflow;document.body.style.overflow='hidden';const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(false);};window.addEventListener('keydown',close);return()=>{document.body.style.overflow=old;window.removeEventListener('keydown',close);};},[expanded]);
  const other = otherLeg(model);
  const valid = model.hypotenuse > model.leg && other > 0;
  const rhsSatisfied = valid && parts[0] && (parts[1] || parts[2]);
  const challengeCorrect =
    checked && rhsGrade10070(challenge);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const update=(key:string,n:number)=>{const next=rhsChange10070(model,key,n);if(next)act(()=>setModel(next));};
  const setLeg=(n:number)=>{const [lo,hi]=rhsBounds10070(model,'l');update('l',clamp(n,lo,hi));};
  const reset=()=>act(()=>{setModel(START);setParts([true,true,false]);setView('normal');setSwapped(false);setVersion(v=>v+1);});
  const content=(

    <section
      className={`rhs10070-page ${expanded ? "expanded" : ""}`}
      data-testid="school-mockup-0744"
      data-object-model="dedicated-rhs-pythagorean-locked-right-triangle-engine"
      data-model={`${model.hypotenuse},${model.leg},${other}`} data-swapped={String(swapped)}
      data-parts={parts.map(Number).join(",")}
      data-view={view}
      data-valid={String(valid)}
      data-satisfied={String(rhsSatisfied)}
      data-expanded={String(expanded)}
      data-challenge={String(challengeCorrect)}
      data-actions={actions}
    >
      <div role="banner" className="rhs10070-hero"><Link className="rhs10070-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>RHS Congruence</h1>
        <p>
          Prove right triangles congruent using hypotenuse and one corresponding
          side.
        </p>
        <div>
          <span>Theorem</span>
          <span>◎ Right Triangles</span>
          <span>◷ 30 min</span>
          <span>▥ Rigorous</span>
          <span>▣ NCERT: 7.2</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="rhs10070-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              aria-pressed={tab === index}
              onClick={() => act(() => {setTab(index);document.getElementById(['rhs10070-interact','rhs10070-learn','rhs10070-example','rhs10070-formula','rhs10070-practice'][index])?.scrollIntoView({behavior:'smooth',block:'start'});})}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <main>
        <section id="rhs10070-interact" className="rhs10070-lab">
          <header>
            <div>
              <h2>♙ INTERACTIVE CONGRUENCE LAB</h2>
              <p>
                Adjust sides below. Right angles are locked. Use Mirror or
                Overlay to verify congruence.
              </p>
            </div>
            <nav>
              <button
                className={view === "mirror" ? "active" : ""}
                aria-pressed={view==="mirror"} onClick={() => act(() => setView(v=>v==="mirror"?"normal":"mirror"))}
              >
                <FlipHorizontal2 /> Mirror
              </button>
              <button
                className={view === "overlay" ? "active" : ""}
                aria-pressed={view==="overlay"} onClick={() => act(() => setView(v=>v==="overlay"?"normal":"overlay"))}
              >
                <Layers /> Overlay
              </button>
              <button
                ref={fullButton} aria-pressed={expanded} aria-label="Toggle fullscreen lesson"
                onClick={() => act(() => setExpanded((value) => !value))}
              >
                <Expand />
              </button>
            </nav>
          </header>
          <div className={`rhs10070-diagrams ${view} ${swapped?"swapped":""}`}>
            <RightTriangle
              title="Triangle 1"
              letters="ABC"
              model={model}
              color="blue"
              parts={parts} overlay={view==="overlay"} onLeg={setLeg} onRestore={setModel}
            />
            <button
              aria-label="Swap triangles"
              onClick={()=>act(()=>setSwapped(v=>!v))}
            >
              ⇄
            </button>
            <RightTriangle
              title="Triangle 2"
              letters="DEF"
              model={model}
              color="purple"
              mirrored={view === "mirror"}
              parts={parts} overlay={view==="overlay"} onLeg={setLeg} onRestore={setModel}
            />
          </div>
          <div className="rhs10070-controls">
            <section>
              <h3>Select equal parts</h3>
              {[
                "Hypotenuse (AC = DF)",
                "One corresponding leg (AB = DE)",
                "Other leg (BC = EF)",
              ].map((label, index) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    checked={parts[index]}
                    onChange={(e) =>
                      act(() => {
                        const next = [...parts];
                        next[index] = e.target.checked;
                        setParts(next);
                      })
                    }
                  />
                  {label}
                  <i className={["purple", "blue", "gray"][index]} />
                </label>
              ))}
            </section>
            <section>
              <h3>Adjust sides</h3>
              {([['Hypotenuse','h',model.hypotenuse],['Leg (adjacent)','l',model.leg],['Other leg','o',other]] as const).map(([label,key,value])=><Stepper key={`${key}-${version}`} label={label} value={value} bounds={rhsBounds10070(model,key)} onChange={n=>update(key,n)} onStep={n=>{const[lo,hi]=rhsBounds10070(model,key);update(key,clamp(value+n,lo,hi));}}/>)}
              <button className="rhs10070-reset" onClick={reset}>Reset triangles</button>
            </section>
            <section>
              <h3>Right angles (locked)</h3>
              <p>
                <input aria-label="Angle B locked at 90 degrees" type="checkbox" checked disabled /> ∠B = 90° <Lock />
              </p>
              <p>
                <input aria-label="Angle E locked at 90 degrees" type="checkbox" checked disabled /> ∠E = 90° <Lock />
              </p>
            </section>
          </div>
          <footer className={rhsSatisfied ? "pass" : "fail"}>
            {rhsSatisfied?<Check/>:<TriangleAlert/>}
            <span>
              <b>
                {rhsSatisfied
                  ? "RHS conditions satisfied!"
                  : "Select the RHS conditions."}
              </b>
              <i>{parts[0]?`AC = DF = ${fmt(model.hypotenuse)}`:'Select equal hypotenuses'} and {parts[1]?`AB = DE = ${fmt(model.leg)}`:parts[2]?`BC = EF = ${fmt(other)}`:'select one corresponding leg'}, with ∠B = ∠E = 90°.</i>
            </span>
            <strong>
              Therefore, △ABC {rhsSatisfied ? "≅" : "?"} △DEF
              <br />
              by RHS Congruence.
            </strong>
          </footer>
        </section>
        <section id="rhs10070-learn" className="rhs10070-theory">
          <article>
            <h2>WHY RHS WORKS</h2>
            <p>
              In right triangles, the hypotenuse is always the longest side.
            </p>
            <p>
              If the hypotenuse and one corresponding side are equal, then by
              Pythagoras Theorem, the third sides are also equal.
            </p>
            <strong>
              <span id="rhs10070-formula">Pythagoras link</span>
              <br />
              <i>
                <MathExpression value={String.raw`AC=DF,\ AB=DE,\ \angle B=\angle E=90^\circ`}/><MathExpression value={String.raw`BC=\sqrt{AC^2-AB^2}=\sqrt{DF^2-DE^2}=EF`}/>
              </i>
              <br />
              Thus, △ABC ≅ △DEF (SSS).
            </strong>
          </article>
          <article>
            <h2 id="rhs10070-example">WORKED EXAMPLE</h2>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>Given</th>
                    <td>Right triangles △PQR and △MNO</td>
                  </tr>
                  <tr>
                    <th>Right angles</th>
                    <td>∠Q = ∠N = 90°</td>
                  </tr>
                  <tr>
                    <th>Hypotenuse</th>
                    <td>PR = MO = 10</td>
                  </tr>
                  <tr>
                    <th>One leg</th>
                    <td>PQ = MN = 6</td>
                  </tr>
                </tbody>
              </table>
              <MiniRight letters="PQR"/>
              <MiniRight letters="MNO"/>
            </div>
            <ol>
              <li>∠Q = ∠N = 90°</li>
              <li>PR = MO = 10</li>
              <li>PQ = MN = 6</li>
            </ol>
            <p>By RHS Congruence, △PQR ≅ △MNO.</p>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> WATCH OUT!
            </h2>
            <b>RHS applies ONLY to right triangles.</b>
            <h3>Not applicable when:</h3>
            <p>× Triangles are not right-angled.</p>
            <p>× Right angles are not known.</p>
            <p>× General SSA is given without a right angle.</p>
            <p>× AAA alone is given. Three equal corresponding sides can prove SSS, but do not establish right angles for RHS.</p>
            <strong>Always verify both right angles are 90° □.</strong>
          </article>
          <article id="rhs10070-practice" className="challenge">
            <h2>YOUR TURN: CHALLENGE</h2>
            <p>Identify the marked parts, then check RHS congruence.</p>
            <div className="rhs10070-challenge-diagrams">
              <ChallengeTriangle letters="XYZ" />
              <ChallengeTriangle letters="PQR" />
            </div>
            <div className="rhs10070-selects">
              {[
                ["Right angle (left)", ["∠Y", "∠X", "∠Z"]],
                ["Right angle (right)", ["∠Q", "∠P", "∠R"]],
                ["Hypotenuse", ["XZ = PR", "XY = PQ", "YZ = QR"]],
                ["Matching leg", ["XY = PQ", "YZ = QR", "XZ = PR"]],
              ].map(([label, options], index) => (
                <label key={String(label)}>
                  {String(label)}
                  <select
                    value={challenge[index]}
                    onChange={(e) =>
                      act(() => {
                        const next = [...challenge];
                        next[index] = e.target.value;
                        setChallenge(next);setChecked(false);
                      })
                    }
                  >
                    {(options as string[]).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <footer>
              <button onClick={() => act(() => setChecked(true))}>
                Check RHS
              </button>
              <span role="status" className={challengeCorrect ? "correct" : ""}>
                {checked
                  ? challengeCorrect
                    ? "Correct: △XYZ ≅ △PQR by RHS."
                    : "Review the marked right angles and sides."
                  : "Result will appear here."}
              </span>
            </footer>
          </article>
        </section>
      </main>
      <nav className="rhs10070-nav"><Link to="/lessons/school/class-9/class-9-triangle-proofs-sss-congruence"><ArrowLeft/>SSS Congruence</Link><Link to="/lessons/school/class-9/class-9-triangle-proofs-equal-sides-and-equal-angles">Equal Sides and Equal Angles<ArrowRight/></Link></nav><footer className="rhs10070-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
  return expanded?createPortal(content,document.body):content;
}

function RightTriangle({title,letters,model,color,mirrored=false,parts,overlay=false,onLeg,onRestore}:{title:string;letters:string;model:RhsModel;color:string;mirrored?:boolean;overlay?:boolean;parts:boolean[];onLeg:(n:number)=>void;onRestore:(m:RhsModel)=>void}){const g=rhsGeometry10070(model,mirrored),svgRef=useRef<SVGSVGElement>(null),gesture=useRef<{model:RhsModel;client:{x:number;y:number};moved:boolean}|null>(null),[a,b,c]=letters.split(''),o=otherLeg(model),move=(ev:PointerEvent<SVGSVGElement>)=>{const saved=gesture.current;if(!saved)return;if(Math.hypot(ev.clientX-saved.client.x,ev.clientY-saved.client.y)>.5)saved.moved=true;if(saved.moved){const matrix=svgRef.current?.getScreenCTM();if(matrix){const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());onLeg((285-p.y)/(250/saved.model.hypotenuse));}}},dir=mirrored?-1:1;return <article className={`rhs10070-triangle ${color}`}><b>{title}</b><svg ref={svgRef} viewBox="0 0 330 320" aria-label={`Interactive RHS triangle ${letters}`} data-coordinates={`${g.a.x},${g.a.y};${g.b.x},${g.b.y};${g.c.x},${g.c.y}`} onPointerMove={move} onPointerUp={e=>{move(e);gesture.current=null;}} onPointerCancel={()=>{if(gesture.current)onRestore(gesture.current.model);gesture.current=null;}}><path className="triangle-fill" d={`M${g.a.x} ${g.a.y}L${g.b.x} ${g.b.y}L${g.c.x} ${g.c.y}Z`}/>{[[g.a,g.c,0],[g.a,g.b,1],[g.b,g.c,2]].map(([u,v,i])=>{const p=u as typeof g.a,q=v as typeof g.a,n=i as number;return <line key={n} className={`edge edge-${n} ${parts[n]?'marked':''}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y}/>;})}<path className="right" d={`M${g.b.x} 285v-16h${16*dir}v16Z`}/><circle className="handle" cx={g.a.x} cy={g.a.y} r="5" role="slider" tabIndex={0} aria-label={`Triangle ${letters} leg handle`} aria-valuemin={.5} aria-valuemax={rhsBounds10070(model,'l')[1]} aria-valuenow={model.leg} onPointerDown={ev=>{ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={model,client:{x:ev.clientX,y:ev.clientY},moved:false};}} onKeyDown={e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();onLeg(model.leg+(e.key==='ArrowUp'?1:-1)*(e.shiftKey?1:.1));}}/><circle cx={g.b.x} cy={g.b.y} r="4"/><circle cx={g.c.x} cy={g.c.y} r="4"/><text className="letter" x={g.a.x} y={g.a.y-13}>{overlay&&color==='blue'?`${a}/D`:a}</text><text className="letter" x={g.b.x-10*dir} y="303">{overlay&&color==='blue'?`${b}/E`:b}</text><text className="letter" x={g.c.x+10*dir} y="303">{overlay&&color==='blue'?`${c}/F`:c}</text><text className="leg" x={g.b.x-20*dir} y={(g.a.y+285)/2}>{fmt(model.leg)}</text><text className="other" x={(g.b.x+g.c.x)/2} y="309">{fmt(o)}</text><text className="hyp" x={(g.a.x+g.c.x)/2+14*dir} y={(g.a.y+285)/2-12}>{fmt(model.hypotenuse)}</text></svg></article>;}
function Stepper({label,value,bounds,onChange,onStep}:{label:string;value:number;bounds:number[];onChange:(n:number)=>void;onStep:(n:number)=>void}){const[d,setD]=useState(String(value)),[editing,setEditing]=useState(false),shown=editing?d:fmt(value),n=Number(shown),ok=shown.trim()!==''&&Number.isFinite(n)&&n>=bounds[0]-1e-12&&n<=bounds[1]+1e-12;return <label className="rhs10070-stepper"><span>{label}</span><input aria-label={label} type="number" step="any" min={bounds[0]} max={bounds[1]} value={shown} aria-invalid={!ok} onFocus={()=>{setD(String(value));setEditing(true);}} onChange={e=>{setD(e.target.value);setEditing(true);const q=Number(e.target.value);if(e.target.value!==''&&Number.isFinite(q)&&q>=bounds[0]&&q<=bounds[1])onChange(q);}} onBlur={()=>{if(ok)setEditing(false);}}/><button aria-label={`Decrease ${label}`} disabled={value<=bounds[0]+1e-12} onClick={()=>{onStep(-1);setEditing(false);}}>−</button><button aria-label={`Increase ${label}`} disabled={value>=bounds[1]-1e-12} onClick={()=>{onStep(1);setEditing(false);}}>+</button>{!ok&&<small role="alert">Enter {fmt(bounds[0])}–{fmt(bounds[1])}.</small>}</label>;}
function MiniRight({letters}:{letters:string}){return <StaticTriangle letters={letters} leg={6} other={8} hyp={10} className="rhs10070-mini"/>;}
function ChallengeTriangle({letters}:{letters:string}){return <StaticTriangle letters={letters} leg={7} other={24} hyp={25}/>;}
function StaticTriangle({letters,leg,other,hyp,className=''}:{letters:string;leg:number;other:number;hyp:number;className?:string}){const k=Math.min(185/other,95/leg),a={x:24,y:125-leg*k},c={x:24+other*k,y:125};return <svg className={className} viewBox="0 0 240 155" aria-label={`RHS example triangle ${letters}`}><path className="static-fill" d={`M24 125V${a.y}L${c.x} 125Z`}/><line className="static-hyp" x1="24" y1={a.y} x2={c.x} y2="125"/><path className="right" d="M24 125v-12h12v12Z"/><text className="letter" x="24" y={a.y-10}>{letters[0]}</text><text className="letter" x="12" y="143">{letters[1]}</text><text className="letter" x={c.x+8} y="143">{letters[2]}</text><text x="9" y={(a.y+125)/2}>{leg}</text><text x={(24+c.x)/2} y="148">{other}</text><text className="hyp" x={(24+c.x)/2+12} y={(a.y+125)/2-10}>{hyp}</text></svg>;}
