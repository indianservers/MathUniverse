import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Magnet,
  Move,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CorrespondingAnglesTargetLesson10060.css";
import {caInitial10060,caModel10060,caClamp10060,caBounds10060,type CAState10060} from './correspondingModel10060';
import {pcAdd10063,type PCPoint10063} from './parallelConverseModel10063';
import {paSector10074} from './parallelogramAnglesModel10074';
const fmt=(n:number|null)=>n===null?'Undefined':String(Number(n.toFixed(2)));

const pairs = [
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 8],
] as const;
const tabs = ["⚗ Interact", "▣ Learn", "□ Example", "π Formula", "✎ Practice"];
const tools = [
  {
    id: "drag",
    icon: Move,
    title: "Drag lines",
    detail: "Move lines to change angles",
  },
  {
    id: "rotate",
    icon: RotateCw,
    title: "Rotate transversal",
    detail: "Click & drag the slanted line",
  },
  {
    id: "parallel",
    icon: Magnet,
    title: "Snap to parallel",
    detail: "Make lines parallel",
  },
] as const;

export default function CorrespondingAnglesTargetLesson10060({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [geometry,setGeometry]=useState(caInitial10060);
  const [formula,setFormula]=useState(false);
  const [tool, setTool] = useState("drag");
  const [labels, setLabels] = useState(true);
  const [measures, setMeasures] = useState(true);
  const [highlights, setHighlights] = useState(true);
  const [tab, setTab] = useState(0);
  const [selectedPairs, setSelectedPairs] = useState<number[]>([0, 1, 2, 3]);
  const [actions, setActions] = useState(0);
  const model=caModel10060(geometry),{values,parallel}=model,acute=values[0]??0,allEqual=parallel;
  const bounds=caBounds10060(geometry.angle),minOne=Math.max(5,5-geometry.l),maxOne=Math.min(175,175-geometry.l);
  const setOne=(v:number)=>setGeometry(g=>caClamp10060({...g,angle:v+g.l}));
  const comparison=(a:number,b:number)=>allEqual?'=':fmt(values[a-1])===fmt(values[b-1])?'≈':'≠';
  const targets=['ca10060-interact','ca10060-learn','ca10060-example','ca10060-formula','ca10060-practice'];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const snapParallel = () => {
    setGeometry(g=>({...g,m:g.l}));
    setTool("parallel");
  };
  const reset = () =>
    act(() => {
      setGeometry(caInitial10060);setFormula(false);
      setTool("drag");
      setLabels(true);
      setMeasures(true);
      setHighlights(true);
      setSelectedPairs([0, 1, 2, 3]);
    });
  return (
    <section
      className="ca10060-page"
      data-testid="school-mockup-0734"
      data-dedicated-lesson="10060"
      data-object-model="dedicated-two-line-transversal-correspondence-parallel-test-engine"
      data-angle={fmt(acute)}
      data-geometry={JSON.stringify(geometry)}
      data-raw-values={JSON.stringify(values)}
      data-proper={model.proper}
      data-values={values.map(fmt).join(",")}
      data-parallel={String(parallel)}
      data-tool={tool}
      data-selected-pairs={selectedPairs.join(",")}
      data-valid={String(allEqual)}
      data-actions={actions}
    >
      <div role="banner" className="ca10060-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Corresponding Angles</h1>
        <p>
          Identify corresponding angle positions and use them to test parallel
          lines.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </div>
      <div role="group" aria-label="Lesson sections" className="ca10060-tabs">
        {tabs.map((item, index) => (
          <button
            key={item}
            className={tab === index ? "active" : ""}
            aria-pressed={tab === index}
            onClick={() => act(() => {setTab(index);if(index===3)setFormula(true);setTimeout(()=>document.getElementById(targets[index])?.scrollIntoView({behavior:"smooth",block:"start"}),0);})}
          >
            {item}
          </button>
        ))}
      </div>
      <main>
        <section id="ca10060-interact" className="ca10060-explorer">
          <header>
            <div>
              <h2>Two-Line Transversal Explorer</h2>
              <p>Drag the lines to explore corresponding angles.</p>
            </div>
            <strong className={allEqual ? "ca10060-live-valid" : "ca10060-live-invalid"}>
              {allEqual?<Check/>:<X/>} LIVE CHECK: {allEqual ? "CORRECT" : "NOT PARALLEL"}
            </strong>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="ca10060-work">
            <aside>
              <h3>TOOLS</h3>
              {tools.map(({ id, icon: Icon, title, detail }) => (
                <button
                  key={id}
                  aria-label={title}
                  type="button"
                  className={tool === id ? "active" : ""}
                  aria-pressed={tool === id}
                  onClick={() =>
                    act(() => {
                      if (id === "parallel") snapParallel();
                      else setTool(id);
                    })
                  }
                >
                  <Icon aria-hidden="true" />
                  <span>
                    <b>{title}</b>
                    <small>{detail}</small>
                  </span>
                </button>
              ))}
              <h3>SHOW / HIDE</h3>
              <Toggle label="Angle numbers" value={labels} change={setLabels} />
              <Toggle
                label="Angle measures"
                value={measures}
                change={setMeasures}
              />
              <Toggle
                label="Corresponding highlights"
                value={highlights}
                change={setHighlights}
              />
              <h3>ANGLE MEASURE</h3>
              <div className="ca10060-angle-control"><span>Set ∠1</span><div><button aria-label="Decrease angle one" disabled={acute<=minOne+1e-9} onClick={()=>act(()=>setOne(acute-1))}>−</button><b>{fmt(acute)}°</b><button aria-label="Increase angle one" disabled={acute>=maxOne-1e-9} onClick={()=>act(()=>setOne(acute+1))}>+</button></div><input aria-label="Set angle one" type="range" min={minOne} max={maxOne} value={acute} onChange={e=>act(()=>setOne(+e.target.value))}/><small>{minOne}° — {maxOne}°</small></div>
              <p className="ca10060-hint">Drag ℓ or m to rotate that line about its intersection. Arrow keys work on each line and the t handle. Labels round to two decimals.</p>
              <div className="ca10060-tilts"><label>Line ℓ tilt<input aria-label="Line ℓ tilt" type="range" min={bounds.min} max={bounds.max} value={geometry.l} onChange={e=>act(()=>{setGeometry(g=>caClamp10060({...g,l:+e.target.value}));setTool('drag');})}/><b>{fmt(geometry.l)}°</b></label><label>Line m tilt<input aria-label="Line m tilt" type="range" min={bounds.min} max={bounds.max} value={geometry.m} onChange={e=>act(()=>{setGeometry(g=>caClamp10060({...g,m:+e.target.value}));setTool('drag');})}/><b>{fmt(geometry.m)}°</b></label></div>
            </aside>
            <article>
              <TransversalDiagram geometry={geometry} labels={labels} measures={measures} highlights={highlights} change={(g,kind)=>act(()=>{setGeometry(caClamp10060(g));setTool(kind==='rotate'?'rotate':'drag');})} restore={(g,previousTool)=>{setGeometry(g);setTool(previousTool);}} tool={tool} selected={selectedPairs}/>
              <CorrespondenceLegend />
            </article>
          </div>
          <div className="ca10060-checks">
            <section>
              <h3>CORRESPONDING CHECK</h3>
              <p>{allEqual?"All four corresponding pairs are equal.":"The positions are corresponding; the measures are unequal."}</p>
              <div>
                {pairs.map(([a, b]) => (
                  <span
                    key={a}
                    className={allEqual ? "ca10060-pair-equal" : "ca10060-pair-unequal"}
                  >
                    {allEqual?<Check/>:<X/>} ∠{a} {comparison(a,b)} ∠{b}
                    <b>
                      {fmt(values[a-1])}° {comparison(a,b)} {fmt(values[b-1])}°
                    </b>
                  </span>
                ))}
              </div>
            </section>
            <section className={allEqual?'ca10060-proof-valid':'ca10060-proof-invalid'}>
              <h3>♻ PARALLEL TEST</h3>
              <b>Lines ℓ and m are {allEqual ? "parallel" : "not parallel"}.</b>
              <p>Corresponding angles are {allEqual ? "equal" : "unequal"}.</p>
              <i>#</i>
            </section>
          </div>
          <div className="ca10060-results">
            {pairs.map(([a, b]) => (
              <span key={a}>
                ∠{a} (and ∠{b})<b>{fmt(values[a-1])}°{!allEqual&&` / ${fmt(values[b-1])}°`}</b>
              </span>
            ))}
            <span className={`conclusion ${allEqual?"":"ca10060-nonparallel"}`}>
              <b>CONCLUSION</b>
              <strong>{allEqual ? "ℓ ∥ m" : "ℓ ∦ m"}</strong>
              <small>
                ({allEqual ? "Lines are parallel" : "Adjust the lines"})
              </small>
            </span>
          </div>
        </section>
        <section id="ca10060-learn" className="ca10060-theory">
          <article>
            <h2>💡 WHY IT WORKS</h2>
            <p>When two parallel lines are cut by a transversal:</p>
            <p>
              <Check /> Corresponding angles occupy the same relative position.
            </p>
            <p>
              <Check /> Their measures are equal.
            </p>
            <p>Converse also true:</p>
            <p>
              <Check /> If corresponding angles are equal, then the lines are
              parallel.
            </p>
            <button aria-expanded={formula} onClick={() => act(() => {setTab(3);setFormula(v=>!v);})}>⌁ {formula?"Hide":"View"} Formula</button><div id="ca10060-formula">{formula&&<aside className="ca10060-formula">If ℓ ∥ m: ∠1 = ∠5, ∠2 = ∠6, ∠3 = ∠7, ∠4 = ∠8.<br/>Conversely, one equal corresponding pair proves ℓ ∥ m.</aside>}</div>
          </article>
          <article>
            <h2 id="ca10060-example">▣ WORKED EXAMPLE</h2>
            <h3>For ℓ ∥ m, if ∠1 = 64°, what is ∠5?</h3>
            <p>Since ∠1 and ∠5 are corresponding angles,</p>
            <strong>∠1 = ∠5</strong>
            <p>
              Therefore, <b>∠5 = 64°.</b>
            </p>
            <MiniTransversal />
          </article>
          <article className="warning">
            <h2>△ COMMON MISCONCEPTION</h2>
            <h3>
              Angles on the same side of the transversal are not automatically
              corresponding.
            </h3>
            <p>Position matters!</p>
            <MiniTransversal wrong />
            <p>
              ∠1 and ∠3 are at the same intersection. They form a linear pair, not a corresponding pair.
            </p>
          </article>
        </section>
        <section id="ca10060-practice" className="ca10060-challenge">
          <h2>🏆 CHALLENGE</h2>
          <p>
            Select all four corresponding pairs, then make one pair equal to
            force the lines to be parallel.
          </p>
          <button className="ca10060-practice-reset" onClick={()=>act(()=>{setSelectedPairs([]);setGeometry({...caInitial10060,m:10});setTool('drag');})}>Reset challenge</button><div>
            <ol>
              <li>Select corresponding pairs.</li>
              <li>Rotate line m until a corresponding pair has equal measures.</li>
            </ol>
            <section>
              <b>PROGRESS</b>
              <span>{selectedPairs.length}/4 pairs selected</span>
              <div>
                {pairs.map((pair, i) => (
                  <button
                    key={i}
                    className={selectedPairs.includes(i) ? "chosen" : ""}
                    aria-pressed={selectedPairs.includes(i)}
                    title={`∠${pair[0]} ↔ ∠${pair[1]}`}
                    aria-label={`Select pair ${pair[0]} and ${pair[1]}`}
                    onClick={() =>
                      act(() =>
                        setSelectedPairs((current) =>
                          current.includes(i)
                            ? current.filter((x) => x !== i)
                            : [...current, i],
                        ),
                      )
                    }
                  >
                    <Check />
                  </button>
                ))}
              </div>
            </section>
            <section className={selectedPairs.length===4&&allEqual?'ca10060-status-valid':'ca10060-status-pending'}>
              <b>STATUS</b>
              <strong>
                {selectedPairs.length === 4 && allEqual
                  ? "☑ Parallel!!"
                  : "Keep working"}
              </strong>
              <span>
                {selectedPairs.length === 4 && allEqual
                  ? "Great job!"
                  : "Select and align all pairs."}
              </span>
            </section>
          </div>
        </section>
      </main>
      <nav className="ca10060-nav">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-linear-pair-axiom-and-converse">
          <ArrowLeft /> Linear Pair Axiom and Converse
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-alternate-interior-angles">
          Alternate Interior Angles <ArrowRight />
        </Link>
      </nav>
      <footer className="ca10060-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><div><Link to="/sitemap">Sitemap</Link><Link to="/docs">Docs</Link><Link to="/about">About</Link></div><small>©2026 INDIAN SERVERS PRIVATE LIMITED. RIGHT NOT TO REPRODUCE IT.</small></footer>

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
  change: (value: boolean) => void;
}) {
  return (
    <label className="ca10060-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => change(e.target.checked)}
      />
      <i />
    </label>
  );
}
function CorrespondenceLegend() {
  return (
    <aside className="ca10060-legend">
      <h3>
        Corresponding
        <br />
        angle pairs
      </h3>
      {pairs.map(([a, b], i) => (
        <p key={a}>
          <i className={`c${i}`} />({a}, {b})
        </p>
      ))}
    </aside>
  );
}
function TransversalDiagram({geometry,labels=true,measures=true,highlights=true,change,restore,tool='drag',mini,selected=[0,1,2,3]}:{geometry:CAState10060;labels?:boolean;measures?:boolean;highlights?:boolean;change?:(g:CAState10060,kind:string)=>void;restore?:(g:CAState10060,tool:string)=>void;tool?:string;mini?:'worked'|'wrong';selected?:number[]}){
 const ref=useRef<SVGSVGElement>(null),id=useId().replace(/:/g,''),gesture=useRef<{pid:number;kind:string;before:CAState10060;tool:string;x:number;y:number;moved:boolean;cancel?:((g:CAState10060,tool:string)=>void)}|null>(null),model=caModel10060(geometry),neg=(p:PCPoint10063)=>({x:-p.x,y:-p.y}),{t,l,m,a,b,origin}=model;
 const specs=[{at:a,u:neg(l),v:neg(t)},{at:a,u:neg(t),v:l},{at:a,u:t,v:neg(l)},{at:a,u:l,v:t},{at:b,u:neg(m),v:neg(t)},{at:b,u:neg(t),v:m},{at:b,u:t,v:neg(m)},{at:b,u:m,v:t}];
 const start=(kind:string)=>(e:React.PointerEvent<SVGElement>)=>{if(gesture.current)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);gesture.current={pid:e.pointerId,kind,before:geometry,tool,x:e.clientX,y:e.clientY,moved:false,cancel:restore};};
 const update=(e:React.PointerEvent<SVGElement>,end=false)=>{const d=gesture.current;if(!d||d.pid!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>.5)d.moved=true;if(d.moved){const matrix=ref.current?.getScreenCTM();if(matrix){const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()),base=caModel10060(d.before),center=d.kind==='rotate'?base.origin:d.kind==='lineL'?base.a:base.b;let degrees=Math.atan2(q.y-center.y,q.x-center.x)*180/Math.PI;if(d.kind==='rotate'&&Math.hypot(q.x-center.x,q.y-center.y)>20){while(degrees<0)degrees+=180;while(degrees>180)degrees-=180;change?.(caClamp10060({...d.before,angle:degrees}),d.kind);}else if(d.kind!=='rotate'){while(degrees>90)degrees-=180;while(degrees< -90)degrees+=180;change?.(caClamp10060({...d.before,[d.kind==='lineL'?'l':'m']:degrees}),d.kind);}}}if(end)gesture.current=null;};
 const cancel=(e:React.PointerEvent<SVGElement>)=>{const d=gesture.current;if(d?.pid===e.pointerId){d.cancel?.(d.before,d.tool);gesture.current=null;}};
 const hitPoints=(segment:PCPoint10063[])=>{const[a,b]=segment,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,n={x:-dy/len*11,y:dx/len*11};return[pcAdd10063(a,n),pcAdd10063(b,n),pcAdd10063(b,n,-1),pcAdd10063(a,n,-1)].map(p=>`${p.x},${p.y}`).join(' ');};
 const key=(kind:string)=>(e:React.KeyboardEvent<SVGElement>)=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const sign=e.key==='ArrowRight'||e.key==='ArrowUp'?1:-1,k=kind==='rotate'?'angle':kind==='lineL'?'l':'m';change?.(caClamp10060({...geometry,[k]:geometry[k]+sign*(e.shiftKey?5:1)}),kind);};
 return <svg ref={ref} className={mini?'ca10060-mini':'ca10060-diagram'} viewBox="0 0 600 570" aria-label={mini?mini==='worked'?'Worked corresponding angles64 degree example':'Angles1 and3 form a linear pair at one intersection':'Interactive corresponding angles diagram'} data-geometry={JSON.stringify(geometry)} data-values={JSON.stringify(model.values)}><defs><pattern id={`ca-grid-${id}`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24"/></pattern><marker id={`ca-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#1d2a3e"/></marker></defs>{!mini&&<rect width="600" height="570" style={{fill:`url(#ca-grid-${id})`}}/>}{model.lines.map((segment,i)=>segment&&<line key={i} data-line={['l','m','t'][i]} className={i===2?'transversal':'line'} x1={segment[0].x} y1={segment[0].y} x2={segment[1].x} y2={segment[1].y} markerStart={`url(#ca-arrow-${id})`} markerEnd={`url(#ca-arrow-${id})`}/>)}{specs.map((s,i)=>{const sector=paSector10074(s.at,pcAdd10063(s.at,s.u,250),pcAdd10063(s.at,s.v,250),model.radius);if(!sector||!model.proper)return null;const dx=s.u.x+s.v.x,dy=s.u.y+s.v.y,len=Math.hypot(dx,dy)||1,unit={x:dx/len,y:dy/len},compactLayout=model.numberRadius<35,base=i<4?l:m,normal={x:base.y,y:-base.x},above=i%4<2,left=i%4===0||i%4===2,interior=i>=2&&i<=5,extent=Math.abs(unit.x*base.x+unit.y*base.y)>.6?42:2,number=compactLayout?pcAdd10063(pcAdd10063(s.at,base,(left?-1:1)*extent),normal,(above?1:-1)*(interior?Math.min(22,model.radius/.6):22)):pcAdd10063(s.at,unit,model.numberRadius),measure=compactLayout?pcAdd10063(number,normal,26):pcAdd10063(s.at,unit,model.numberRadius+34),leader=pcAdd10063(s.at,unit,model.radius+3),active=mini?mini==='worked'?[0,4].includes(i):[0,2].includes(i):selected.includes(i%4);return <g key={i} className={`ca10060-sector c${i%4} ${highlights?'highlighted':''} ${active?'':'ca10060-muted'}`} data-index={i+1} data-measure={model.values[i]} data-at={`${s.at.x},${s.at.y}`} data-ray-a={`${s.u.x},${s.u.y}`} data-ray-b={`${s.v.x},${s.v.y}`}><path d={sector.path}/>{compactLayout&&labels&&(!mini||active)&&<line className="ca10060-leader" x1={leader.x} y1={leader.y} x2={number.x} y2={number.y}/>} {labels&&(!mini||active)&&<text className="ca10060-number" textAnchor="middle" dominantBaseline="middle" x={number.x} y={number.y}>{i+1}</text>}{measures&&(!mini?i<2:active)&&<text className="measure" textAnchor="middle" dominantBaseline="middle" x={measure.x} y={measure.y}>{fmt(model.values[i])}°</text>}</g>;})}{!mini&&model.lines.map((segment,i)=>segment&&<polygon key={i} className="hit" points={hitPoints(segment)} role={i<2?'slider':undefined} tabIndex={i<2?0:undefined} aria-label={i===0?'Move line ℓ':i===1?'Move line m':undefined} aria-valuenow={i===0?geometry.l:i===1?geometry.m:undefined} aria-valuemin={i<2?caBounds10060(geometry.angle).min:undefined} aria-valuemax={i<2?caBounds10060(geometry.angle).max:undefined} aria-valuetext={i===0?`${geometry.l} degrees`:i===1?`${geometry.m} degrees`:undefined} onPointerDown={start(i===0?'lineL':i===1?'lineM':'rotate')} onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={cancel} onKeyDown={key(i===0?'lineL':i===1?'lineM':'rotate')}/>)}{!mini&&<><circle className="visible-handle" cx={origin.x-135*t.x} cy={origin.y-135*t.y} r="6"/><circle role="slider" aria-label="Rotate transversal" aria-valuemin={5} aria-valuemax={175} aria-valuenow={geometry.angle} aria-valuetext={`Direction ${geometry.angle} degrees`} className="handle" cx={origin.x-135*t.x} cy={origin.y-135*t.y} r="19" tabIndex={0} onPointerDown={start('rotate')} onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={cancel} onKeyDown={key('rotate')}/></>}{mini==='wrong'&&<text className="ca10060-cross" x="420" y="300">×</text>}<text className="name" x={model.lines[0]![0].x+4} y={model.lines[0]![0].y-15}>ℓ</text><text className="name" x={model.lines[1]![0].x+4} y={model.lines[1]![0].y+(model.numberRadius<35?28:-15)}>m</text><text className="name" x={Math.abs(t.y)<.35?model.lines[2]![1].x+(t.x>0?-15:15):model.lines[2]![0].x+15} y={Math.abs(t.y)<.35?model.lines[2]![1].y+28:model.lines[2]![0].y+20}>t</text></svg>;
}
function MiniTransversal({wrong=false}:{wrong?:boolean}){return <TransversalDiagram geometry={caInitial10060} mini={wrong?'wrong':'worked'}/>;}
