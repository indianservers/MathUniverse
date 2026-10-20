import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SameSideInteriorTargetLesson10062.css";
import {ssInitial10062,ssModel10062,ssEdit10062,ssTiltDraft10062} from './sameSideModel10062';
import {pcLine10063,pcAdd10063,pcClamp10063,type PCState10063,type PCPoint10063} from './parallelConverseModel10063';
import {paSector10074} from './parallelogramAnglesModel10074';
import MathExpression from '../../../components/ui/MathExpression';
const fmt=(n:number)=>Number(n.toFixed(2));

export default function SameSideInteriorTargetLesson10062({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [geometry,setGeometry]=useState(ssInitial10062),
    [parallel, setParallel] = useState(true),
    [pair, setPair] = useState(0),
    [tab, setTab] = useState(0),
    [tilt, setTilt] = useState(14),
    [challengeChecked, setChallengeChecked] = useState(false),
    [tiltBad,setTiltBad]=useState(false),[version,setVersion]=useState(0),
    [actions, setActions] = useState(0);
  const model=ssModel10062(geometry,pair),[first,second]=model.values,{sum,balanced}=model,challenge=ssModel10062({...ssInitial10062,m:-tilt},pair),challengeValid=tilt===0&&challengeChecked&&!tiltBad;
  const targets=['ss10062-interact','ss10062-learn','ss10062-example','ss10062-formula','ss10062-practice'];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const updateFirst=(value:number)=>act(()=>setGeometry(ssEdit10062(geometry,pair,0,value,parallel)));
  const updateSecond=(value:number)=>act(()=>setGeometry(ssEdit10062(geometry,pair,1,value,parallel)));
  const changeTilt=(v:number)=>act(()=>{setTilt(Math.max(-20,Math.min(20,v)));setChallengeChecked(false);setTiltBad(false);setVersion(n=>n+1);});
  return (
    <section
      className="ss10062-page"
      data-testid="school-mockup-0736"
      data-object-model="dedicated-same-side-interior-supplement-converse-engine"
      data-angles={`${fmt(first)},${fmt(second)}`}
      data-raw-angles={JSON.stringify(model.values)}
      data-geometry={JSON.stringify(geometry)}
      data-challenge-angles={JSON.stringify(challenge.values)}
      data-challenge-sum={challenge.sum}
      data-challenge-checked={challengeChecked}
      data-tilt-invalid={tiltBad}
      data-sum={sum}
      data-parallel={String(model.balanced)}
      data-locked={parallel}
      data-pair={pair}
      data-tilt={tilt}
      data-challenge-valid={String(challengeValid)}
      data-actions={actions}
    >
      <div role="banner" className="ss10062-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Interior Angles on the Same Side</h1>
        <p>
          Explore co-interior (same-side interior) angles and their
          supplementary relationship.
        </p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="ss10062-tabs">
        {["⚗ Interact", "▣ Learn", "▱ Example", "◫ Formula", "⌘ Practice"].map(
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
        <section id="ss10062-interact" className="ss10062-lab">
          <header>
            <h2>TRANSVERSAL INTERACTIVE</h2>
            <p>Select the same-side interior angle pair and explore.</p>
            <div>
              <button
                className={parallel ? "active" : ""}
                aria-pressed={parallel}
                onClick={() =>
                  act(() => {
                    setParallel(true);
                    setGeometry(g=>({...g,m:g.l}));
                  })
                }
              >
                Parallel Lines
              </button>
              <button
                className={!parallel ? "active" : ""}
                aria-pressed={!parallel}
                onClick={() => act(() => {setParallel(false);setGeometry(g=>({...g,m:g.m===g.l?(g.l===8?0:8):g.m}));})}
              >
                Nonparallel Lines
              </button>
            </div>
          </header>
          <div className="ss10062-work">
            <article>
              <SameSideDiagram geometry={geometry} pair={pair} change={g=>act(()=>setGeometry(pcClamp10063(g)))} restore={setGeometry}/>
              <aside>
                <b>⌁ C-pattern (Same-side interior)</b>
                <p>{pair===0?"∠1 and ∠2":"∠3 and ∠4"} are co-interior angles on the {pair===0?"right":"left"} of t.</p><button className="ss10062-reset" onClick={()=>act(()=>{setGeometry(ssInitial10062);setParallel(true);setPair(0);})}><RotateCcw/> Reset explorer</button>
              </aside>
            </article>
            <aside>
              <h3>1. SELECT ANGLE PAIR</h3>
              {["∠1 & ∠2", "∠3 & ∠4"].map((x, i) => (
                <button
                  key={x}
                  aria-label={x}
                  aria-pressed={pair===i}
                  className={pair === i ? "active" : ""}
                  onClick={() => act(() => setPair(i))}
                >
                  <b>{x}</b>
                  <span>same-side interior</span>
                  <i>{pair === i ? "✓" : ""}</i>
                </button>
              ))}
              <h3>2. MEASURE ANGLES</h3>
              <Stepper label={pair===0?"∠1":"∠3"} value={first} change={updateFirst} disabledMinus={geometry.angle===(pair===0?35:145)} disabledPlus={geometry.angle===(pair===0?145:35)}/>
              <Stepper label={pair===0?"∠2":"∠4"} value={second} change={updateSecond} disabledMinus={parallel?geometry.angle===(pair===0?145:35):geometry.m===(pair===0?-8:8)} disabledPlus={parallel?geometry.angle===(pair===0?35:145):geometry.m===(pair===0?8:-8)}/>
              <h3>3. SUM (SUPPLEMENTARY CHECK)</h3>
              <strong className={balanced ? "ss10062-supplementary" : "ss10062-not-supplementary"}>
                <span className="ss10062-blue-text">{fmt(first)}°</span> + <span className="ss10062-purple-text">{fmt(second)}°</span> {!balanced&&fmt(sum)===180?"≈":Math.abs(fmt(first)+fmt(second)-fmt(sum))<1e-8?"=":"≈"} {fmt(sum)}° {balanced && <Check />}
              </strong>
              <div className="ss10062-meter-labels"><span>0°</span><span>180°</span><span>360°</span></div><div className="ss10062-meter" role="meter" aria-label="Angle sum" aria-valuemin={0} aria-valuemax={360} aria-valuenow={sum} aria-valuetext={`${fmt(sum)} degrees${balanced?', supplementary':''}`}><i style={{left:`${sum/360*100}%`}}/></div>
              <p className="ss10062-rounding">Angle labels are rounded to two decimals.</p><b className="balanced">
                {balanced
                  ? "Balanced! Sum is 180°."
                  : `Not supplementary: rounded sum is ${fmt(sum)}°.`}
              </b>
              <footer>
                ☝ Drag the purple rotation handle or use ±. {parallel?"The parallel lock keeps the other angle supplementary.":"The upper ± controls rotate t; lower ± controls rotate m within ±8°."} Drag the center handle to move t.
              </footer>
            </aside>
          </div>
          <footer className={balanced ? "success" : "pending"}>
            {balanced?<Check/>:<X/>}
            <span>
              <b>
                {balanced
                  ? "Great! For parallel lines, same-side interior angles are supplementary."
                  : "These lines are not parallel; the co-interior sum is not 180°."}
              </b>
              Their sum is {fmt(sum)}°.
            </span>
          </footer>
        </section>
        <section id="ss10062-learn" className="ss10062-theory">
          <article>
            <h2>💡 WHY IT WORKS</h2>
            <p>
              When two parallel lines are cut by a transversal, the interior
              angles on the same side lie on a straight line when one line is
              slid over the other without rotation.
            </p>
            <p>
              Hence, they are <b>supplementary.</b>
            </p>
            <strong>Straight line ⟶ 180°</strong>
            <footer><MathExpression value={String.raw`\angle1+\angle2=180^\circ`}/></footer>
          </article>
          <article>
            <h2 id="ss10062-example">▣ WORKED EXAMPLE</h2>
            <p>For parallel lines, if one same-side interior angle is 73°, what is the other?</p>
            <p>
              <b>Given</b> ∠1 = 73°
            </p>
            <p>
              <b>Since</b> ∠1 + ∠2 = 180°
            </p>
            <p>
              <b>So</b> ∠2 = 180° − 73° = 107°
            </p>
            <footer>Answer: ∠2 = 107°</footer>
          </article>
          <article>
            <h2 id="ss10062-formula">♙ KEY FACT (THEOREM)</h2>
            <p>
              For parallel lines cut by a transversal, same-side interior angles
              are supplementary.
            </p>
            <footer><MathExpression value={String.raw`\angle1+\angle2=180^\circ`}/></footer>
            <p>
              <b>Converse:</b> If a pair of same-side interior angles are
              supplementary, then the lines are parallel.
            </p>
          </article>
        </section>
        <section className="ss10062-lower">
          <article>
            <h2>△ COMMON MISCONCEPTION</h2>
            <p>
              For parallel lines, same-side interior angles are supplementary, not generally equal.
            </p>
            <div>
              <MiniSame wrong />
              <MiniSame />
            </div>
            <footer>Their sum is 180°. They are equal only when both angles are 90°.</footer>
          </article>
          <article id="ss10062-practice" className="ss10062-challenge">
            <h2>◎ CHALLENGE: MAKE THEM 180°</h2>
            <p>
              Rotate line m until the selected same-side interior angles add to
              180°. Then verify parallelism.
            </p>
            <SameSideDiagram geometry={{...ssInitial10062,m:-tilt}} pair={pair} compact change={g=>changeTilt(-g.m)} restore={g=>{setTilt(-g.m);setChallengeChecked(challengeChecked&&!tiltBad);setTiltBad(false);setVersion(v=>v+1);}}/>
            <p className="ss10062-challenge-measures">∠{pair===0?'1':'3'}={fmt(challenge.values[0])}° + ∠{pair===0?'2':'4'}={fmt(challenge.values[1])}° {tilt!==0&&fmt(challenge.sum)===180?"≈":"="} {fmt(challenge.sum)}°</p>
            <label>Rotate line m <input aria-label="Rotate line m" type="range" min="-20" max="20" value={tilt} onChange={e=>changeTilt(+e.target.value)}/><TiltNumber key={version} value={tilt} invalid={setTiltBad} commit={v=>act(()=>{setTilt(v);setChallengeChecked(false);})}/></label>
            <div>
              <button
                onClick={() =>
                  act(() => {
                    setTilt(14);
                    setChallengeChecked(false);setTiltBad(false);setVersion(v=>v+1);
                  })
                }
              >
                <RotateCcw /> Reset
              </button>
              <button disabled={tiltBad} onClick={() => act(() => setChallengeChecked(true))}>
                Check Parallelism
              </button>
            </div>
            <footer className={challengeValid ? "success" : "pending"}>
              {challengeValid?<Check/>:challengeChecked?<X/>:<span aria-hidden="true">○</span>}{" "}
              {challengeValid
                ? "Perfect! ∠1 + ∠2 = 180°. Lines l and m are parallel."
                : tiltBad?"Enter a valid tilt before checking.":!challengeChecked?"Move or rotate m, then check the measured sum and line directions.":`Not parallel: the line directions still differ. The rounded angle sum is ${fmt(challenge.sum)}°. Match the line directions, then check again.`}
            </footer>
          </article>
        </section>
      </main>
      <nav className="ss10062-nav">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-alternate-interior-angles">
          <ArrowLeft />{" "}
          <span>

            <b>Alternate Interior Angles</b>
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-parallel-line-converse-theorems">
          <span>

            <b>Parallel Line Converse Theorems</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
      <footer className="ss10062-footer"><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div><div><b>Explore</b><Link to="/lessons/school">School lessons</Link><Link to="/sitemap">Sitemap</Link></div><div><b>Support</b><Link to="/docs">Docs</Link></div><div><b>Connect</b><Link to="/about">About</Link></div><small>©2026 INDIAN SERVERS PRIVATE LIMITED. ALL RIGHTS RESERVED.</small></footer>

    </section>
  );
}
function Stepper({label,value,change,disabledMinus,disabledPlus}:{label:string;value:number;change:(v:number)=>void;disabledMinus:boolean;disabledPlus:boolean}){return <div className="ss10062-stepper"><b>{label}</b><span>=</span><strong>{fmt(value)}°</strong><button aria-label={`Decrease ${label}`} disabled={disabledMinus} onClick={()=>change(value-1)}>−</button><button aria-label={`Increase ${label}`} disabled={disabledPlus} onClick={()=>change(value+1)}>+</button></div>;}
function TiltNumber({value,commit,invalid}:{value:number;commit:(v:number)=>void;invalid:(v:boolean)=>void}){const[editing,setEditing]=useState(false),[raw,setRaw]=useState('');const good=ssTiltDraft10062(raw);return <span className="ss10062-tilt-number"><input aria-label="Line m tilt value" type="number" min="-20" max="20" step="any" value={editing?raw:fmt(value)} aria-invalid={editing&&!good} onFocus={()=>{if(!editing){setRaw(String(value));setEditing(true);}}} onChange={e=>{setEditing(true);setRaw(e.target.value);const ok=ssTiltDraft10062(e.target.value);invalid(!ok);if(ok)commit(+e.target.value);}}/>{editing&&!good&&<small role="alert">Enter −20° to20°.</small>}</span>;}
function SameSideDiagram({geometry,pair=0,compact=false,change,restore,staticOnly=false}:{geometry:PCState10063;pair?:number;compact?:boolean;change?:(g:PCState10063)=>void;restore?:(g:PCState10063)=>void;staticOnly?:boolean}){
 const id=useId().replace(/:/g,''),ref=useRef<SVGSVGElement>(null),gesture=useRef<{pid:number;before:PCState10063;kind:string;x:number;y:number;moved:boolean;cancel?:((g:PCState10063)=>void)}|null>(null),model=ssModel10062(geometry,pair),lines=[pcLine10063({x:300,y:190},model.l)!,pcLine10063({x:300,y:390},model.m)!,pcLine10063(model.origin,model.t)!],neg=(p:PCPoint10063)=>({x:-p.x,y:-p.y}),rotation=pcAdd10063(model.origin,model.t,-110),lower=pcAdd10063({x:300,y:390},model.m,180);
 const update=(e:React.PointerEvent<SVGCircleElement>,end=false)=>{const d=gesture.current;if(!d||d.pid!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>.5)d.moved=true;if(d.moved){const matrix=ref.current?.getScreenCTM();if(matrix){const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()),g={...d.before};if(d.kind==='move')g.offset=q.x-300;else if(d.kind==='lower')g.m=Math.max(-20,Math.min(20,Math.atan2(q.y-390,q.x-300)*180/Math.PI));else if(Math.hypot(q.x-model.origin.x,q.y-model.origin.y)>20){let a=Math.atan2(q.y-model.origin.y,q.x-model.origin.x)*180/Math.PI;while(a<0)a+=180;while(a>180)a-=180;g.angle=a;}change?.(g);}}if(end)gesture.current=null;};
 function handle(kind:string,p:PCPoint10063,label:string){return <g key={kind}><circle className="ss10062-halo" cx={p.x} cy={p.y} r="8"/><circle role="slider" aria-label={label} aria-valuetext={String(kind==='lower'?-geometry.m:kind==='move'?geometry.offset:geometry.angle)} className="handle" cx={p.x} cy={p.y} r="19" tabIndex={0} onPointerDown={e=>{if(gesture.current)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);gesture.current={pid:e.pointerId,before:geometry,kind,x:e.clientX,y:e.clientY,moved:false,cancel:restore};}} onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={e=>{const d=gesture.current;if(d?.pid===e.pointerId){d.cancel?.(d.before);gesture.current=null;}}} onKeyDown={e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const sign=e.key==='ArrowRight'||e.key==='ArrowUp'?1:-1,key=kind==='lower'?'m':kind==='move'?'offset':'angle',g={...geometry,[key]:geometry[key]+sign*(e.shiftKey?5:1)};if(compact)g.m=Math.max(-20,Math.min(20,geometry.m-sign*(e.shiftKey?5:1)));change?.(g);}}/></g>;}
 return <svg ref={ref} className={`ss10062-diagram ${compact?'compact':''}`} viewBox="0 0 600 570" aria-label={staticOnly?'Same-side interior angle example':compact?'Challenge same-side interior diagram':'Interactive same-side interior diagram'} data-geometry={JSON.stringify(geometry)} data-angles={JSON.stringify(model.values)} data-sum={model.sum}><defs><marker id={`ss-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#18304c"/></marker><marker id={`ss-purple-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#7433dc"/></marker></defs>{lines.map((v,i)=><line key={i} data-line={['l','m','t'][i]} className={i===2?'trans':'base'} x1={v[0].x} y1={v[0].y} x2={v[1].x} y2={v[1].y} markerStart={`url(#ss-${i===2?'purple':'arrow'}-${id})`} markerEnd={`url(#ss-${i===2?'purple':'arrow'}-${id})`}/>)}<SameAngle at={model.upper!} a={model.t} b={pair===0?model.l:neg(model.l)} index={pair===0?1:3} value={model.values[0]} minimal={staticOnly} blue/><SameAngle at={model.lower!} a={neg(model.t)} b={pair===0?model.m:neg(model.m)} index={pair===0?2:4} value={model.values[1]} minimal={staticOnly}/>{!compact&&!staticOnly&&<path className="dash" d={`M${model.upper!.x+(pair===0?42:-42)} ${model.upper!.y+35}Q${model.upper!.x+(pair===0?115:-115)} ${model.upper!.y+30} ${model.upper!.x+(pair===0?115:-115)} ${(model.upper!.y+model.lower!.y)/2}L${model.upper!.x+(pair===0?115:-115)} ${model.lower!.y-35}H${model.lower!.x+(pair===0?42:-42)}`}/>}<text className="name" x="28" y="176">ℓ</text><text className="name" x="28" y={lines[1][0].y-14}>m</text><text className="name" x={lines[2][0].x+15} y={lines[2][0].y+20}>t</text>{!staticOnly&&(compact?handle('lower',lower,'Rotate challenge line m'):<>{handle('rotate',rotation,'Rotate transversal')}{handle('move',model.origin,'Move transversal')}</>)}</svg>;
}
function SameAngle({at,a,b,index,value,blue=false,minimal=false}:{at:PCPoint10063;a:PCPoint10063;b:PCPoint10063;index:number;value:number;blue?:boolean;minimal?:boolean}){const s=paSector10074(at,pcAdd10063(at,a,200),pcAdd10063(at,b,200),38);return s?<g className={`ss10062-angle ${blue?'blue':'purple'}`} data-measure={value} data-index={index}><path d={s.path}/><text x={s.label.x} y={s.label.y} textAnchor="middle" dominantBaseline="middle">{!minimal&&`∠${index}: `}{fmt(value)}°</text></g>:null;}
function MiniSame({wrong=false}:{wrong?:boolean}){return <figure><b>{wrong?'Claim: ∠1 = ∠2':'Correct: ∠1 + ∠2 =180°'}</b><SameSideDiagram geometry={ssInitial10062} staticOnly/><i>{wrong?'×':'✓'}</i></figure>;}
