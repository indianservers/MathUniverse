import { ArrowLeft, ArrowRight, Check, RotateCcw, Bookmark, Trophy } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AlternateInteriorTargetLesson10061.css";
import {aiStart10061,aiModel10061,aiPairs10061} from './alternateInteriorModel10061';
import {pcLine10063,pcAdd10063,pcClamp10063,type PCState10063,type PCPoint10063} from './parallelConverseModel10063';
import {paSector10074} from './parallelogramAnglesModel10074';
const fmt=(n:number)=>Number(n.toFixed(2));

const tabs = ["◉ Interact", "▣ Learn", "▱ Example", "∑ Formula", "⌁ Practice"];

export default function AlternateInteriorTargetLesson10061({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [geometry,setGeometry]=useState(aiStart10061);
  const [challengeGeometry,setChallengeGeometry]=useState({...aiStart10061,offset:-20});
  const [parallel, setParallel] = useState(true);
  const [labels, setLabels] = useState(true);
  const [checked, setChecked] = useState(true);
  const [tab, setTab] = useState(0);
  const [pairs, setPairs] = useState([true, true, false, false]);
  const [challengeMoved, setChallengeMoved] = useState(true);
  const [actions, setActions] = useState(0);
  const [saved,setSaved]=useState(()=>{try{return typeof window!=="undefined"&&localStorage.getItem("math-lesson-10061-saved")==="true";}catch{return false;}});
  const model=aiModel10061(geometry),angle=model.values[3],acute=model.values[4],valid=model.equal&&checked;
  const solved=challengeMoved&&aiPairs10061(pairs);
  const targets=['ai10061-interact','ai10061-learn','ai10061-example','ai10061-formula','ai10061-practice'];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setGeometry(aiStart10061);
      setParallel(true);
      setLabels(true);
      setChecked(true);
    });
  return (
    <section
      className="ai10061-page"
      data-testid="school-mockup-0735"
      data-object-model="dedicated-alternate-interior-position-equality-converse-engine"
      data-angle={fmt(angle)}
      data-geometry={JSON.stringify(geometry)}
      data-readouts={JSON.stringify(model.values)}
      data-checked={checked}
      data-mode={parallel?"parallel":"converse"}
      data-challenge-moved={challengeMoved}
      data-supplement={fmt(acute)}
      data-offset={geometry.offset}
      data-parallel={String(model.equal)}
      data-labels={String(labels)}
      data-selected={pairs
        .map((v, i) => (v ? i : -1))
        .filter((i) => i >= 0)
        .join(",")}
      data-solved={String(solved)}
      data-actions={actions}
    >
      <div role="banner" className="ai10061-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Alternate Interior Angles</h1>
        <p>
          Recognize alternate interior angle pairs and use their equality when
          two lines are parallel.
        </p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
          <span>Lesson 9.9</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link><button className="ai10061-save" aria-label={saved?'Unsave lesson':'Save lesson'} aria-pressed={saved} onClick={()=>{const next=!saved;setSaved(next);try{localStorage.setItem('math-lesson-10061-saved',String(next));}catch{/* Bookmark remains available for this session. */}}}><Bookmark fill={saved?'currentColor':'none'}/></button>
      </div>
      <div role="group" aria-label="Lesson sections" className="ai10061-tabs">
        {tabs.map((item, i) => (
          <button
            key={item}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(targets[i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {item}
          </button>
        ))}
      </div>
      <main>
        <section id="ai10061-interact" className="ai10061-explorer">
          <header>
            <h2>Explore Alternate Interior Angles</h2>
            <p>
              Drag the purple transversal to see how alternate interior angles
              stay equal when ℓ ∥ m.
            </p>
            <div>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button aria-label="Check angles" onClick={() => act(() => setChecked(true))}>
                ☑ Check
              </button>
              <Toggle
                label="Show angle labels"
                value={labels}
                change={setLabels}
              />
            </div>
          </header>
          <div className="ai10061-work">
            <aside>
              <section>
                <h3>Relationship</h3>
                <p>Parallel lines ⇄ Alternate interior angles</p>
                <div>
                  <button
                    className={parallel ? "active" : ""}
                    aria-pressed={parallel}
                    aria-label="Lines are parallel"
                    onClick={() => act(() => {setParallel(true);setGeometry(g=>({...g,m:g.l}));setChecked(false);})}
                  >
                    Lines are parallel
                  </button>
                  <button
                    className={!parallel ? "active" : ""}
                    aria-pressed={!parallel}
                    aria-label="Converse"
                    onClick={() => act(() => {setParallel(false);setGeometry(g=>({...g,m:g.l===g.m?8:g.m}));setChecked(false);})}
                  >
                    Converse ⓘ
                  </button>
                </div>
              </section>
              <section>
                <h3>Angle Readouts</h3>
                <div className="ai10061-readouts">
                  <span>
                    ∠3<b>{fmt(model.values[3])}°</b>
                  </span>
                  <span>
                    ∠5<b>{fmt(model.values[5])}°</b>
                  </span>
                  <span>
                    ∠4<b>{fmt(model.values[4])}°</b>
                  </span>
                  <span>
                    ∠6<b>{fmt(model.values[6])}°</b>
                  </span>
                </div>
              </section>
              <section>
                <h3>Selected Pair</h3>
                <p className={!checked?"ai10061-unchecked":valid?"ai10061-equal":"ai10061-unequal"}>
                  ∠3 and ∠5 <b>{!checked?"Check values":valid?"Equal ✓":"Unequal"}</b>
                </p>
              </section>
              <label className="ai10061-range">Transversal direction<input aria-label="Transversal direction" type="range" min="35" max="145" value={geometry.angle} onChange={e=>act(()=>{setGeometry(g=>({...g,angle:+e.target.value}));setChecked(false);})}/><b>{fmt(geometry.angle)}°</b></label>
              {!parallel&&<section className="ai10061-converse"><h3>Test the converse</h3><label>Rotate m<input aria-label="Line m tilt" type="range" min="-8" max="8" value={geometry.m} onChange={e=>act(()=>{setGeometry(g=>({...g,m:+e.target.value}));setChecked(false);})}/><b>{fmt(geometry.m)}°</b></label><button onClick={()=>act(()=>{setGeometry(g=>({...g,m:g.l}));setChecked(false);})}>Align m with ℓ</button><p>Equal alternate interior angles prove parallelism. Match the line directions, then check.</p></section>}
              <p className="ai10061-rounding">Labels round to two decimals. Exact line directions determine equality.</p>
              <p className="purple">● ∠3 and ∠5 (alternate interior)</p>
              <p className="orange">● ∠4 and ∠6 (alternate interior)</p>
            </aside>
            <article>
              <AlternateDiagram geometry={geometry} labels={labels} free={!parallel} change={g=>act(()=>{setGeometry(pcClamp10063(g));setChecked(false);})} restore={g=>{setGeometry(g);setChecked(checked);}}/>
            </article>
          </div>
          <footer>
            💡 <b>Observation:</b> When lines ℓ and m are parallel, ∠3 = ∠5 and
            ∠4 = ∠6.
          </footer>
        </section>
        <section id="ai10061-learn" className="ai10061-theory">
          <article>
            <h2 id="ai10061-formula">▱ Why it works</h2>
            <h3>When two parallel lines are cut by a transversal:</h3>
            <p>
              <Check /> Alternate interior angles are between the lines and on
              opposite sides of the transversal.
            </p>
            <p>
              <Check /> They have the same measure.
            </p>
            <p>
              <Check /> If a pair of alternate interior angles are equal, the
              lines must be parallel (converse).
            </p>
            <aside>
              <b>Rule:</b> Parallel lines cut by a transversal have equal
              alternate interior angles.
              <br />
              <br />
              <b>Converse:</b> If alternate interior angles are equal, the lines
              are parallel.
            </aside>
          </article>
          <article>
            <h2 id="ai10061-example">▣ Worked Example</h2>
            <p>For parallel lines, if ∠3 = 117°, find ∠5.</p>
            <MiniAlternate worked />
            <ol>
              <li>∠3 and ∠5 are alternate interior angles.</li>
              <li>Lines ℓ and m are parallel.</li>
            </ol>
            <footer>
              Therefore,<strong>∠5 = ∠3 = 117°</strong>
            </footer>
          </article>
          <article className="warning">
            <h2>⊗ Common Misconception</h2>
            <h3>Alternate angles must be between the lines</h3>
            <p>
              <b>Incorrect:</b> ∠1 and ∠5 are not alternate interior (∠1 is
              exterior).
            </p>
            <MiniAlternate wrong />
            <p>
              <b>Correct:</b> ∠3 and ∠5 are between the lines and on opposite
              sides of the transversal.
            </p>
            <MiniAlternate />
          </article>
        </section>
        <section id="ai10061-practice" className="ai10061-challenge">
          <header>
            <h2>Challenge: Find the Alternate Interior Pairs</h2>
            <p>
              Drag the purple transversal anywhere on the parallel lines, then
              select the two pairs of alternate interior angles.
            </p><button className="ai10061-challenge-reset" onClick={()=>act(()=>{setChallengeGeometry(aiStart10061);setChallengeMoved(false);setPairs([false,false,false,false]);})}>Reset challenge</button>
          </header>
          <div>
            <AlternateDiagram geometry={challengeGeometry} labels compact change={g=>act(()=>{const next=pcClamp10063(g);if(next.angle!==challengeGeometry.angle||next.offset!==challengeGeometry.offset)setChallengeMoved(true);setChallengeGeometry(next);})} restore={g=>{setChallengeGeometry(g);setChallengeMoved(challengeMoved);}}/>
            <section>
              <h3>Step 1: Drag the transversal</h3>
              <p>Move t to any position.</p>
              <button
                className={challengeMoved ? "done" : ""}
                onClick={() => act(() => {setChallengeGeometry(g=>({...g,offset:g.offset>=40?-40:Math.min(40,g.offset+8)}));setChallengeMoved(true);})}
              >
                <Check />{" "}
                {challengeMoved
                  ? "Great! Transversal moved."
                  : "Move transversal"}
              </button>
              <h3>Step 2: Select the alternate interior pairs</h3>
              <p>Choose the two correct pairs.</p>
              {["∠3 and ∠5", "∠4 and ∠6", "∠1 and ∠7", "∠2 and ∠8"].map(
                (label, i) => (
                  <label
                    key={label}
                    className={pairs[i] ? (i < 2 ? "right" : "wrong") : ""}
                  >
                    <input
                      type="checkbox"
                      checked={pairs[i]}
                      onChange={() =>
                        act(() =>
                          setPairs((current) =>
                            current.map((v, n) => (n === i ? !v : v)),
                          ),
                        )
                      }
                    />
                    {label}
                  </label>
                ),
              )}
            </section>
            <aside className={solved ? "solved" : ""}>
              <div className="ai10061-trophy"><Trophy/></div>
              <h2>{solved ? "Well done!" : "Keep exploring"}</h2>
              <p>
                {solved
                  ? "You found both pairs correctly."
                  : "Move the transversal and select two pairs."}
              </p>
              <svg className="ai10061-celebration" viewBox="0 0 240 100" aria-hidden="true"><path d="M5 45C20 100 70 0 40 20S70 110 120 70S200 30 235 45M100 70C160 20 190 110 150 90S140 45 170 45"/></svg><p className="ai10061-keep">Keep exploring by moving the transversal!</p>
            </aside>
          </div>
        </section>
        <section className="ai10061-takeaway">
          <h2>▱ Key Takeaways</h2>
          <div>
            {[
              [
                "↗↙",
                "Location matters",
                "Alternate interior angles are between the lines and on opposite sides of the transversal.",
              ],
              [
                "=",
                "Equality",
                "If lines are parallel, alternate interior angles are equal.",
              ],
              [
                "↔",
                "Converse",
                "If a pair of alternate interior angles are equal, the lines are parallel.",
              ],
              [
                "◉",
                "Look and label",
                "Use labels to spot alternate interior pairs quickly.",
              ],
            ].map(([icon, title, text]) => (
              <article key={title}>
                <i>{icon}</i>
                <b>{title}</b>
                <p>{text}</p>{title==="Equality"&&<footer className="ai10061-equality-formula"><span>∠3 = ∠5</span>, <span>∠4 = ∠6</span></footer>}
              </article>
            ))}
          </div>
        </section>
      </main>
      <nav className="ai10061-nav">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-corresponding-angles">
          <ArrowLeft /> Corresponding Angles
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-interior-angles-on-the-same-side">
          Interior Angles on the Same Side <ArrowRight />
        </Link>
      </nav>
      <footer className="ai10061-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><div><Link to="/sitemap">Sitemap</Link><Link to="/docs">Docs</Link><Link to="/about">About</Link></div><small>©2026 INDIAN SERVERS PRIVATE LIMITED. RIGHT NOT TO REPRODUCE IT.</small></footer>

    </section>
  );
}

function Toggle({
  label,
  value,
  change,
}: {
  label: string;
  value: boolean;
  change: (v: boolean) => void;
}) {
  return (
    <label className="ai10061-toggle">
      {label}
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => change(e.target.checked)}
      />
      <i />
    </label>
  );
}
function AlternateDiagram({geometry,labels=true,free=false,compact=false,change,restore,mini,worked=false}:{geometry:PCState10063;labels?:boolean;free?:boolean;compact?:boolean;change?:(g:PCState10063)=>void;restore?:(g:PCState10063)=>void;mini?:'correct'|'wrong';worked?:boolean}){
 const ref=useRef<SVGSVGElement>(null),id=useId().replace(/:/g,''),gesture=useRef<{pid:number;before:PCState10063;kind:string;x:number;y:number;moved:boolean;startX?:number;cancel?:((g:PCState10063)=>void)}|null>(null),m=aiModel10061(geometry),negative=(p:PCPoint10063)=>({x:-p.x,y:-p.y}),lines=[pcLine10063({x:300,y:190},m.l)!,pcLine10063({x:300,y:390},m.m)!,pcLine10063(m.origin,m.t)!],rotation=pcAdd10063(m.origin,m.t,-110),lower=pcAdd10063({x:300,y:390},m.m,180);
 const specs=[{n:1,p:m.upper!,a:negative(m.t),b:negative(m.l),v:m.values[4]},{n:2,p:m.upper!,a:negative(m.t),b:m.l,v:m.values[3]},{n:3,p:m.upper!,a:m.t,b:negative(m.l),v:m.values[3]},{n:4,p:m.upper!,a:m.t,b:m.l,v:m.values[4]},{n:5,p:m.lower!,a:negative(m.t),b:m.m,v:m.values[5]},{n:6,p:m.lower!,a:negative(m.t),b:negative(m.m),v:m.values[6]},{n:7,p:m.lower!,a:m.t,b:negative(m.m),v:m.values[5]},{n:8,p:m.lower!,a:m.t,b:m.m,v:m.values[6]}];
 const update=(e:React.PointerEvent<SVGElement>,end=false)=>{const d=gesture.current;if(!d||d.pid!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>.5)d.moved=true;if(d.moved){const matrix=ref.current?.getScreenCTM();if(matrix){const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()),g={...d.before};if(d.kind==='line')g.offset=d.before.offset+q.x-d.startX!;else if(d.kind==='move')g.offset=q.x-300;else if(d.kind==='lower')g.m=Math.atan2(q.y-390,q.x-300)*180/Math.PI;else if(Math.hypot(q.x-m.origin.x,q.y-m.origin.y)>20){let a=Math.atan2(q.y-m.origin.y,q.x-m.origin.x)*180/Math.PI;while(a<0)a+=180;while(a>180)a-=180;g.angle=a;}change?.(pcClamp10063(g));}}if(end)gesture.current=null;};
 function handle(kind:string,p:PCPoint10063,label:string){return <g key={kind}><circle className="ai10061-halo" cx={p.x} cy={p.y} r="9"/><circle role="slider" aria-label={label} aria-valuetext={String(kind==='move'?geometry.offset:kind==='lower'?geometry.m:geometry.angle)} className="handle" cx={p.x} cy={p.y} r="19" tabIndex={0} onPointerDown={e=>{if(gesture.current)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);gesture.current={pid:e.pointerId,before:geometry,kind,x:e.clientX,y:e.clientY,moved:false,cancel:restore};}} onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={e=>{const d=gesture.current;if(d?.pid===e.pointerId){d.cancel?.(d.before);gesture.current=null;}}} onKeyDown={e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const key=kind==='move'?'offset':kind==='lower'?'m':'angle',sign=e.key==='ArrowRight'||e.key==='ArrowUp'?1:-1;change?.(pcClamp10063({...geometry,[key]:geometry[key]+sign*(e.shiftKey?5:1)}));}}/></g>;}
 const bottom=(x:number)=>390+(x-300)*Math.tan(geometry.m*Math.PI/180),top=(x:number)=>190+(x-300)*Math.tan(geometry.l*Math.PI/180);
 return <svg ref={ref} className={mini?'ai10061-mini':`ai10061-diagram ${compact?'compact':''}`} viewBox="0 0 600 570" aria-label={mini?mini==='wrong'?'Exterior angle1 and interior angle5 are not an alternate interior pair':worked?'Worked alternate interior example':'Correct alternate interior pair3 and5':compact?'Challenge alternate interior diagram':'Interactive alternate interior angle diagram'} data-geometry={JSON.stringify(geometry)} data-values={JSON.stringify(m.values)}><defs>{['base','purple'].map(color=><marker key={color} id={`ai-${color}-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={color==='base'?'#182437':'#7433dc'}/></marker>)}</defs><path className="interior" d={`M160 ${top(160)}L440 ${top(440)}L440 ${bottom(440)}L160 ${bottom(160)}Z`}/>{lines.map((v,i)=><line key={i} data-line={['l','m','t'][i]} className={i===2?'transversal':'base'} x1={v[0].x} y1={v[0].y} x2={v[1].x} y2={v[1].y} markerStart={`url(#ai-${i===2?'purple':'base'}-${id})`} markerEnd={`url(#ai-${i===2?'purple':'base'}-${id})`}/>)}{!mini&&<line className="ai10061-line-hit" data-testid={compact?'challenge-transversal-line':'explorer-transversal-line'} x1={lines[2][0].x} y1={lines[2][0].y} x2={lines[2][1].x} y2={lines[2][1].y} onPointerDown={e=>{if(gesture.current)return;const matrix=ref.current?.getScreenCTM();if(!matrix)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());gesture.current={pid:e.pointerId,before:geometry,kind:'line',x:e.clientX,y:e.clientY,moved:false,startX:q.x,cancel:restore};}} onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={e=>{const d=gesture.current;if(d?.pid===e.pointerId){d.cancel?.(d.before);gesture.current=null;}}}/>} {specs.map(spec=>{const s=paSector10074(spec.p,pcAdd10063(spec.p,spec.a,200),pcAdd10063(spec.p,spec.b,200),34);if(!s)return null;const active=mini?mini==='wrong'?[1,5].includes(spec.n):[3,5].includes(spec.n):[3,4,5,6].includes(spec.n),color=mini==='wrong'&&spec.n===5?'green':[3,5].includes(spec.n)||mini==='wrong'&&spec.n===1?'purple':'orange',show=mini?active:labels;return <g key={spec.n} className={`ai10061-angle ${active?color:'ai10061-exterior'}`} data-angle-index={spec.n} data-measure={spec.v} data-at={`${spec.p.x},${spec.p.y}`} data-ray-a={`${spec.a.x},${spec.a.y}`} data-ray-b={`${spec.b.x},${spec.b.y}`}>{active&&<path d={s.path}/>} {show&&<text x={s.label.x} y={s.label.y} textAnchor="middle" dominantBaseline="middle">{worked?spec.n===3?'117°':'?':spec.n}</text>}</g>;})}{mini==='wrong'&&<path className="dash" d={`M${m.upper!.x+30} ${m.upper!.y-70}Q540 280 ${m.lower!.x+45} ${m.lower!.y-35}`}/>}<text className="name" x="25" y="176">ℓ</text><text className="name" x="25" y={lines[1][0].y-14}>m</text><text className="name" x={lines[2][0].x+15} y={lines[2][0].y+20}>t</text>{!mini&&<>{handle('move',m.origin,'Move transversal')}{handle('rotate',rotation,'Rotate transversal')}{free&&handle('lower',lower,'Rotate line m')}</>}</svg>;
}
function MiniAlternate({wrong=false,worked=false}:{wrong?:boolean;worked?:boolean}){return <AlternateDiagram geometry={aiStart10061} mini={wrong?'wrong':'correct'} worked={worked}/>;}
