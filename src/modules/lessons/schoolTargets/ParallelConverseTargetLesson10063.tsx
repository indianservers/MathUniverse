import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelConverseTargetLesson10063.css";
import {pcInitial10063,pcModel10063,pcClamp10063,pcLine10063,pcAdd10063,type PCState10063,type PCPoint10063} from './parallelConverseModel10063';
import {paSector10074} from './parallelogramAnglesModel10074';

const tests = [
  {
    title: "Corresponding Angles",
    detail: "If corresponding angles are equal, then lines are parallel.",
    color: "blue",
  },
  {
    title: "Alternate Interior Angles",
    detail: "If alternate interior angles are equal, then lines are parallel.",
    color: "purple",
  },
  {
    title: "Same-Side Interior Angles",
    detail:
      "If same-side interior angles are supplementary, then lines are parallel.",
    color: "teal",
  },
];
const answers = ["alternate", "same-side", "insufficient"];

export default function ParallelConverseTargetLesson10063({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [test, setTest] = useState(0),
    [geometry,setGeometry]=useState(pcInitial10063),
    [tool,setTool]=useState(0),[zoom,setZoom]=useState(1),[bad,setBad]=useState(false),[version,setVersion]=useState(0),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState(["alternate","same-side","corresponding"]),
    [graded, setGraded] = useState(true),
    [actions, setActions] = useState(0);
  const model=pcModel10063(geometry),[angle,paired]=model.pairs[test],condition=model.condition&&!bad;
  const setG=(g:PCState10063,preserveDraft=false)=>{setGeometry(pcClamp10063(g));if(!preserveDraft){setVersion(v=>v+1);setBad(false);}};
  const targets=['pc10063-interact','pc10063-learn','pc10063-example','pc10063-formula','pc10063-practice'];
  const display=(n:number)=>Number(n.toFixed(2));
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setTest(0);
      setGeometry(pcInitial10063);setTool(0);setZoom(1);setBad(false);setVersion(v=>v+1);
    });
  const score = challenge.filter((value, i) => value === answers[i]).length;
  return (
    <section
      className="pc10063-page"
      data-testid="school-mockup-0737"
      data-object-model="dedicated-parallel-converse-evidence-inference-engine"
      data-test={test}
      data-angle={display(angle)}
      data-geometry={JSON.stringify(geometry)}
      data-pairs={JSON.stringify(model.pairs)}
      data-intersections={JSON.stringify([model.upper,model.lower])}
      data-tool={tool}
      data-zoom={zoom}
      data-invalid-draft={bad}
      data-paired={display(paired)}
      data-offset={geometry.offset}
      data-line-skew={geometry.m-geometry.l}
      data-condition={String(condition)}
      data-challenge-score={graded ? score : "idle"}
      data-actions={actions}
    >
      <div role="banner" className="pc10063-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Parallel Line Converse Theorems</h1>
        <p>Use angle conditions to prove two lines are parallel.</p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School Lessons
        </Link>
      </div>
      <div role="group" aria-label="Lesson sections" className="pc10063-tabs">
        {["☼ Interact", "▣ Learn", "◇ Example", "⌁ Formula", "⌕ Practice"].map(
          (x, i) => (
            <button
              key={x}
              className={tab === i ? "active" : ""}
              aria-pressed={tab === i}
              onClick={() => act(() => {setTab(i);document.getElementById(targets[i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
            >
              {x}
            </button>
          ),
        )}
      </div>
      <main>
        <section id="pc10063-interact" className="pc10063-lab">
          <header>
            <h2>PROOF-TESTING LAB</h2>
            <p>
              Drag the transversal, adjust angles, and test converse conditions.
            </p>
            <button onClick={reset}>
              <RotateCcw /> Reset Lab
            </button>
          </header>
          <div className="pc10063-work">
            <aside>
              <section>
                <h3>1. CHOOSE A CONVERSE TEST</h3>
                <p>Select the angle condition to test.</p>
                {tests.map((item, i) => (
                  <button
                    key={item.title}
                    aria-label={item.title}
                    aria-pressed={test===i}
                    className={`${item.color} ${test === i ? "active" : ""}`}
                    onClick={() => act(() => setTest(i))}
                  >
                    <MiniConverse mode={i} />
                    <span>
                      <b>{item.title}</b>
                      <small>{item.detail}</small>
                    </span>
                    <em>{test === i ? "✓" : ""}</em>
                  </button>
                ))}
              </section>
              <section>
                <h3>2. GIVEN ANGLE</h3>
                <p>Adjust the highlighted angle.</p>
                <label>
                  <input
                    aria-label="Given angle"
                    type="range"
                    min={35-geometry.l}
                    max={145-geometry.l}
                    value={angle}
                    onChange={(e) => act(() => {setG({...geometry,angle:+e.target.value+geometry.l});})}
                  />
                  <GivenAngle key={version} value={angle} min={35-geometry.l} max={145-geometry.l} invalid={setBad} commit={a=>act(()=>setG({...geometry,angle:a+geometry.l},true))}/>
                </label>
              </section>
              <section>
                <h3>3. EVIDENCE CHECKLIST</h3>
                <p>Does the diagram satisfy the chosen condition?</p>
                {tests.map((item, i) => (
                  <div key={item.title}>
                    <span>
                      {item.title.toLowerCase()} are{" "}
                      {i === 2 ? "supplementary" : "equal"}
                    </span>
                    <b>
                      {`${display(model.pairs[i][0])}° ${i===2?'+':(model.condition?'=':display(model.pairs[i][0])===display(model.pairs[i][1])?'≈':'≠')} ${display(model.pairs[i][1])}°${i===2?` ${model.condition?'=':'≈'} ${display(model.pairs[i][0]+model.pairs[i][1])}°`:''}`}
                    </b>
                    <i>{model.condition && !bad ? "✓" : ""}</i>
                  </div>
                ))}
              </section>
              <footer className={condition ? "success" : "pending"}>
                <Check />
                <span>
                  <b>
                    RESULT:{" "}
                    {condition
                      ? "Condition satisfied."
                      : bad?"Enter a valid given angle.":"Condition not satisfied."}
                  </b>
                  {bad?"The draft is not a measured angle.":condition?"Therefore, ℓ ∥ m.":"ℓ and m have different directions; no converse condition holds."}
                </span>
              </footer>
            </aside>
            <article>
              <ConverseDiagram geometry={geometry} test={test} tool={tool} zoom={zoom} change={g=>act(()=>setG(g))} restore={setGeometry}/>
              <div role="group" aria-label="Diagram tools" className="pc10063-tools">
                {['Move t','Rotate t','Drag ℓ','Drag m','Zoom'].map((label,i)=><button key={label} aria-label={label} aria-pressed={tool===i} onClick={()=>act(()=>setTool(i))}>{['☝','⟳','↔','↕','⌕'][i]} {label}</button>)}
              </div>
              <div className="pc10063-tool-control">
                <label>{['Transversal position','Transversal direction','Line ℓ tilt','Line m tilt','Diagram zoom'][tool]} <input aria-label={['Transversal position','Transversal direction','Line ℓ tilt','Line m tilt','Diagram zoom'][tool]} type="range" min={[-40,35,-8,-8,.8][tool]} max={[40,145,8,8,1.15][tool]} step={tool===4?.05:1} value={[geometry.offset,geometry.angle,geometry.l,geometry.m,zoom][tool]} onChange={e=>act(()=>{const v=+e.target.value;if(tool===4)setZoom(v);else setG({...geometry,[['offset','angle','l','m'][tool]]:v});})}/><b>{tool===4?`${Math.round(zoom*100)}%`:[geometry.offset,geometry.angle,geometry.l,geometry.m][tool]+(tool===0?'':'°')}</b></label>
                <button onClick={()=>act(()=>setG({...geometry,m:geometry.l}))}>Make lines parallel</button>
              </div>
              <p className="pc10063-help">Drag the selected handle, or use its arrow keys (Shift for larger steps). Moving or rotating t preserves the line directions. Drag ℓ or m to test non-parallel lines.</p>
            </article>
          </div>
        </section>
        <section id="pc10063-formula" className="pc10063-rule">
          <i>☼</i>
          <div>
            <h2>THE RULE (THEOREM)</h2>
            <p>
              If any one of the following conditions holds for a transversal
              cutting two lines, then the lines are parallel.
            </p>
            <ol>
              <li>Corresponding angles are equal.</li>
              <li>Alternate interior angles are equal.</li>
              <li>Same-side interior angles are supplementary.</li>
            </ol>
          </div>
          <strong>
            Any one valid condition is sufficient
            <br />
            to prove parallelism.
          </strong>
        </section>
        <section id="pc10063-learn" className="pc10063-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              These converses come from the original parallel line angle
              relationships. If the resulting angles match the parallel
              relationships, the only way this can happen is when the lines are
              parallel.
            </p>
            {tests.map((item,i)=><div className="pc10063-proof-row" key={item.title}><MiniConverse mode={i}/><b>{item.title}: {i===2?"supplementary":"equal"} ⇒ ℓ ∥ m</b></div>)}<p>Equal alternate interior angles give equal corresponding angles by vertical angles. Supplementary same-side interior angles give equal corresponding angles by a linear pair.</p>
          </article>
          <article>
            <h2 id="pc10063-example">WORKED EXAMPLE</h2>
            <p>Given: ∠1 and ∠5 are corresponding angles and both measure 58°.</p>
            <MiniConverse mode={0} large />
            <b>Solution:</b>
            <ol>
              <li>∠1 and ∠5 are corresponding angles.</li>
              <li>m∠1 = m∠5 = 58°.</li>
              <li>Corresponding angles are equal.</li>
              <li>By the Converse of Corresponding Angles Theorem,</li>
            </ol>
            <footer>ℓ ∥ m</footer>
          </article>
          <article className="warning">
            <h2>COMMON MISCONCEPTION</h2>
            <p>
              Measuring equal vertically opposite angles at just one intersection does not prove the
              lines are parallel.
            </p>
            <b>Not a valid converse condition.</b>
            <MiniConverse mode={3} large />
            <footer>
              <X /> These 58° angles are vertically opposite at the same intersection. They are equal for any second-line direction, so this does not prove ℓ ∥ m.
            </footer>
          </article>
        </section>
        <section id="pc10063-practice" className="pc10063-challenge">
          <header>
            <h2>CHALLENGE: Choose the correct converse theorem</h2>
            <p>
              For each diagram below, select which converse theorem proves ℓ ∥
              m. One claim is NOT sufficient.
            </p>
            <button onClick={() => act(() => setGraded(true))}>
              Check Answers
            </button>
          </header>
          <div>
            {[
              ["72°", "72°"],
              ["110°", "70°"],
              ["45°", "45°"],
            ].map((values, i) => (
              <article key={i}>
                <i>{i + 1}</i>
                <MiniConverse mode={i===0?1:i===1?2:3} large angle={i===0?72:i===1?110:45} color={i===2?4:i} />
                <select
                  aria-label={`Challenge theorem ${i + 1}`}
                  value={challenge[i]}
                  onChange={(e) =>
                    act(() => {
                      setGraded(false);
                      setChallenge((current) =>
                        current.map((v, n) => (n === i ? e.target.value : v)),
                      );
                    })
                  }
                >
                  <option value="alternate">Alternate Interior Angles</option>
                  <option value="same-side">Same-Side Interior Angles</option>
                  <option value="corresponding">Corresponding Angles</option>
                  <option value="insufficient">
                    Not Sufficient (Incorrect Claim)
                  </option>
                </select>
                <footer
                  className={
                    !graded?"ungraded":challenge[i] === answers[i]?"correct":"incorrect"
                  }
                >
                  {graded ? challenge[i] === answers[i] ? <Check /> : <X /> : null}
                  <span>
                    <b>
                      {!graded?"Check your answers.":challenge[i]===answers[i]?"Correct!":"Try again."}
                    </b>
                    {values[0]} and {values[1]}{" "}
                    {i === 1
                      ? "sum to 180°."
                      : i === 0
                        ? "are equal alternate angles."
                        : "are vertical angles at one intersection; they give no relation to the second line."}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </main>
      <nav className="pc10063-nav">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-interior-angles-on-the-same-side">
          <ArrowLeft /> Interior Angles on the Same Side
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-triangle-angle-sum-theorem">
          Triangle Angle Sum Theorem <ArrowRight />
        </Link>
      </nav>
      <footer className="pc10063-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><div><Link to="/sitemap">Sitemap</Link><Link to="/docs">Docs</Link><Link to="/about">About</Link></div><small>©2026 INDIAN SERVERS PRIVATE LIMITED. RIGHT NOT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function GivenAngle({value,min,max,commit,invalid}:{value:number;min:number;max:number;commit:(n:number)=>void;invalid:(b:boolean)=>void}){const[editing,setEditing]=useState(false),[raw,setRaw]=useState('');const good=raw.trim()!==''&&Number.isFinite(+raw)&&+raw>=min&&+raw<=max;return <span className="pc10063-number"><input aria-label="Given angle value" type="number" min={min} max={max} step="any" value={editing?raw:Number(value.toFixed(8))} aria-invalid={editing&&!good} onFocus={()=>{if(!editing){setEditing(true);setRaw(String(Number(value.toFixed(8))));}}} onChange={e=>{setRaw(e.target.value);setEditing(true);const n=Number(e.target.value),ok=e.target.value.trim()!==''&&Number.isFinite(n)&&n>=min&&n<=max;invalid(!ok);if(ok)commit(n);}}/>{editing&&!good&&<small role="alert">Enter {min}–{max}°.</small>}</span>;}
function ConverseDiagram({geometry,test,tool,zoom,change,restore}:{geometry:PCState10063;test:number;tool:number;zoom:number;change:(g:PCState10063)=>void;restore:(g:PCState10063)=>void}){
 const id=useId().replace(/:/g,''),group=useRef<SVGGElement>(null),gesture=useRef<{pid:number;before:PCState10063;x:number;y:number;moved:boolean}|null>(null),m=pcModel10063(geometry),t=pcLine10063(m.origin,m.t)!,l=pcLine10063({x:300,y:190},m.l)!,lower=pcLine10063({x:300,y:390},m.m)!;
 const location=tool===0?m.origin:tool===1?pcAdd10063(m.origin,m.t,-110):tool===2?pcAdd10063({x:300,y:190},m.l,180):pcAdd10063({x:300,y:390},m.m,180);
 const update=(e:React.PointerEvent<SVGCircleElement>,end=false)=>{const d=gesture.current;if(!d||d.pid!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>.5)d.moved=true;if(d.moved){const matrix=group.current?.getScreenCTM();if(matrix){const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());const g={...d.before};if(tool===0)g.offset=q.x-300;else if(tool===1){let a=Math.atan2(m.origin.y-q.y,m.origin.x-q.x)*180/Math.PI;if(a<0)a+=360;g.angle=a;}else{const y=tool===2?190:390;g[tool===2?'l':'m']=Math.atan2(q.y-y,q.x-300)*180/Math.PI;}change(pcClamp10063(g));}}if(end)gesture.current=null;};
 return <svg className="pc10063-diagram" viewBox="0 0 600 570" aria-label="Interactive parallel converse diagram"><defs><pattern id={`pc-grid-${id}`} width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25"/></pattern><marker id={`pc-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#18304c"/></marker></defs><rect width="600" height="570" style={{fill:`url(#pc-grid-${id})`}}/><g ref={group} transform={`translate(300 290) scale(${zoom}) translate(-300 -290)`}>{[l,lower,t].map((pair,i)=><line data-line={['l','m','t'][i]} key={i} className={i===2?'trans':'base'} x1={pair[0].x} y1={pair[0].y} x2={pair[1].x} y2={pair[1].y} markerStart={`url(#pc-arrow-${id})`} markerEnd={`url(#pc-arrow-${id})`}/>)}<AngleMark at={m.upper!} a={m.t} b={m.l} color={test} value={m.pairs[test][0]}/><AngleMark at={m.lower!} a={test===0?m.t:pcAdd10063({x:0,y:0},m.t,-1)} b={test===1?pcAdd10063({x:0,y:0},m.m,-1):m.m} color={test} value={m.pairs[test][1]}/><text className="name" x={l[1].x-4} y={l[1].y-14}>ℓ</text><text className="name" x={lower[1].x-4} y={lower[1].y-14}>m</text><text className="name" x={t[0].x+15} y={t[0].y+18}>t</text>{tool!==4&&<><circle className="tool-halo" cx={location.x} cy={location.y} r="10"/><circle role="slider" aria-label={`Drag ${['transversal position','transversal direction','line ℓ tilt','line m tilt'][tool]}`} aria-valuetext={String([geometry.offset,geometry.angle,geometry.l,geometry.m][tool])} className="tool-handle" cx={location.x} cy={location.y} r="20" tabIndex={0} onPointerDown={e=>{if(gesture.current)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);gesture.current={pid:e.pointerId,before:geometry,x:e.clientX,y:e.clientY,moved:false};}} onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={e=>{const d=gesture.current;if(d?.pid===e.pointerId){restore(d.before);gesture.current=null;}}} onKeyDown={e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const direction=e.key==='ArrowRight'||e.key==='ArrowUp'?1:-1,key=(['offset','angle','l','m']as const)[tool];change(pcClamp10063({...geometry,[key]:geometry[key]+direction*(e.shiftKey?5:1)}));}}/></>}</g></svg>;
}
function AngleMark({at,a,b,color,value,label}:{at:PCPoint10063;a:PCPoint10063;b:PCPoint10063;color:number;value:number;label?:string}){const s=paSector10074(at,pcAdd10063(at,a,200),pcAdd10063(at,b,200),36);if(!s)return null;return <g className={`pc10063-angle c${color}`} data-measure={value}><path d={s.path}/><text x={s.label.x} y={s.label.y} textAnchor="middle" dominantBaseline="middle">{label??`${Number(value.toFixed(2))}°`}</text></g>;}
function MiniConverse({mode,large=false,angle=58,color=mode}:{mode:number;large?:boolean;angle?:number;color?:number}){const m=pcModel10063({...pcInitial10063,angle,m:mode===3?8:0}),negative=(u:PCPoint10063)=>({x:-u.x,y:-u.y}),lines=[pcLine10063({x:300,y:190},m.l)!,pcLine10063({x:300,y:390},m.m)!,pcLine10063(m.origin,m.t)!];return <svg className={`pc10063-mini ${large?'large':''}`} viewBox="0 20 600 530" aria-label={mode===3?'Equal vertical angles do not prove parallelism':`${tests[mode].title} example`} data-mini-mode={mode} data-mini-angle={angle}>{lines.map((pair,i)=><line key={i} x1={pair[0].x} y1={pair[0].y} x2={pair[1].x} y2={pair[1].y}/>)}<AngleMark at={m.upper!} a={m.t} b={m.l} color={color} value={angle} label={large&&mode===0?"1":undefined}/>{mode===3?<AngleMark at={m.upper!} a={negative(m.t)} b={negative(m.l)} color={color} value={angle}/>:<AngleMark at={m.lower!} a={mode===0?m.t:negative(m.t)} b={mode===1?negative(m.m):m.m} color={color} value={m.pairs[mode][1]} label={large&&mode===0?"5":undefined}/>}<text className="mini-name" x="570" y="175">ℓ</text><text className="mini-name" x="570" y="375">m</text><text className="mini-name" x={lines[2][0].x+15} y={lines[2][0].y+20}>t</text></svg>;}
