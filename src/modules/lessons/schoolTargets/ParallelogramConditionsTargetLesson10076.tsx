import {
  Undo2, Redo2,
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Lightbulb,
  Lock,
  MousePointer2,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramConditionsTargetLesson10076.css";
import{parallelogramConditions10076,pcStart10076,pcPresets10076,pcBound10076,pcJustification10076}from'./parallelogramConditionsModel10076';
type P = { x: number; y: number };
type V = "a" | "b" | "c" | "d";
const START=pcStart10076;
const names = [
  "Opposite sides are parallel",
  "Opposite sides are equal",
  "Opposite angles are equal",
  "Diagonals bisect each other",
  "One pair of opposite sides is equal and parallel",
];
export default function ParallelogramConditionsTargetLesson10076({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pts, setPts] = useState(START),
    [selected,setSelected]=useState(3),[showDiag,setShowDiag]=useState(true),[showMarks,setShowMarks]=useState(false),[showGrid,setShowGrid]=useState(true),
    [past,setPast]=useState<(typeof START)[]>([]),[future,setFuture]=useState<(typeof START)[]>([]),[proof,setProof]=useState(false),[solution,setSolution]=useState(false),
    [showMeasures, setShowMeasures] = useState(true),
    [locked, setLocked] = useState(false),
    [tool, setTool] = useState<"vertex" | "diagonals" | "marks" | "grid">(
      "vertex",
    ),
    [tab, setTab] = useState(0),

    [text, setText] = useState(""),
    [graded, setGraded] = useState(false),
    [actions, setActions] = useState(0);
  const svgRef=useRef<SVGSVGElement>(null),gesture=useRef<{key:V;points:typeof START;client:P;moved:boolean;graded:boolean}|null>(null);
  const m=useMemo(()=>parallelogramConditions10076(pts),[pts]),{o,sides,halves:half,angles:ang,conditions:certs,count}=m,correct=certs[selected]&&pcJustification10076(selected,text);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPts(START);
      setSelected(3);setShowDiag(true);setShowMarks(false);setShowGrid(true);setPast([]);setFuture([]);setProof(false);setSolution(false);gesture.current=null;
      setShowMeasures(true);
      setLocked(false);
      setTool("vertex");
      setText("");
      setGraded(false);
    });
  const point=(ev:PointerEvent<SVGSVGElement>)=>{const matrix=svgRef.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());return{x:p.x,y:p.y};};
  const change=(next:typeof START,record=true)=>{if(record){setPast(old=>[...old,pts]);setFuture([]);}setPts(next);setGraded(false);};
  const update=(k:V,p:P,record=true)=>change({...pts,[k]:pcBound10076(p)},record);
  const keyMove=(k:V,dx:number,dy:number)=>act(()=>update(k,{x:pts[k].x+dx,y:pts[k].y+dy}));
  const undo=()=>act(()=>{if(!past.length)return;setFuture(old=>[pts,...old]);setPts(past[past.length-1]);setPast(old=>old.slice(0,-1));setGraded(false);});
  const redo=()=>act(()=>{if(!future.length)return;setPast(old=>[...old,pts]);setPts(future[0]);setFuture(old=>old.slice(1));setGraded(false);});
  const finish=(ev:PointerEvent<SVGSVGElement>)=>{const g=gesture.current;if(!g)return;const p=point(ev);if(p&&g.moved&&!locked){const next={...pts,[g.key]:pcBound10076(p)};setPts(next);if(JSON.stringify(next)!==JSON.stringify(g.points)){setPast(old=>[...old,g.points]);setFuture([]);}}gesture.current=null;setActions(n=>n+1);};
  return (
    <section
      className="pc10076-page"
      data-testid="school-mockup-0750"
      data-object-model="dedicated-quadrilateral-measurement-and-sufficient-condition-dashboard"
      data-points={`${pts.a.x},${pts.a.y};${pts.b.x},${pts.b.y};${pts.c.x},${pts.c.y};${pts.d.x},${pts.d.y}`}
      data-sides={sides.join(",")}
      data-halves={half.map(n=>n??"undefined").join(",")}
      data-angles={ang.map(n=>n??"undefined").join(",")}
      data-certificates={certs.map(Number).join(",")}
      data-result={String(count > 0)}
      data-count={count}
      data-kind={m.kind} data-selected={selected} data-history={past.length} data-future={future.length} data-complete={String(graded&&correct)} data-show={`${Number(showDiag)},${Number(showMarks)},${Number(showGrid)}`}
      data-tool={tool}
      data-locked={String(locked)}
      data-graded={String(graded)}
      data-actions={actions}
    >
      <div role="banner" className="pc10076-hero"><Link className="pc10076-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Conditions for a Quadrilateral to Be a Parallelogram</h1>
        <p>
          Test different conditions. Any one valid condition is enough to prove
          a quadrilateral is a parallelogram.
        </p>
        <div>
          <span>30 min</span>
          <span>Class 9</span>
          <span>Geometry</span>
          <span>Interactive</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="pc10076-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(["pc10076-interact","pc10076-learn","pc10076-example","pc10076-formula","pc10076-practice"][i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section id="pc10076-interact" className="pc10076-lab">
          <div className="pc10076-model">
            <header>
              <div>
                <h2>INTERACTIVE MODEL</h2>
                <p>
                  Drag any vertex A, B, C, or D. Observe the conditions on the
                  right.
                </p>
              </div>
              <button aria-label="Undo vertex movement" onClick={undo} disabled={!past.length}><Undo2/></button><button aria-label="Redo vertex movement" onClick={redo} disabled={!future.length}><Redo2/></button><button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 500 380"
              aria-label="Draggable quadrilateral condition model"
              onPointerMove={ev=>{const g=gesture.current;if(!g||locked)return;if(Math.hypot(ev.clientX-g.client.x,ev.clientY-g.client.y)>.5)g.moved=true;const p=point(ev);if(p&&g.moved)update(g.key,p,false);}}
              onPointerUp={finish}
              onPointerCancel={()=>{if(gesture.current){setPts(gesture.current.points);setGraded(gesture.current.graded);}gesture.current=null;}}
            >
              <defs>
                <pattern
                  id="pcGrid"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M22 0H0V22" />
                </pattern>
              </defs>
              {showGrid&&<rect className="grid-fill" width="500" height="380" fill="url(#pcGrid)"/>}
              <path
                className="shape"
                d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}L${pts.c.x} ${pts.c.y}L${pts.d.x} ${pts.d.y}Z`}
              />
              {showDiag&&<><line className="diagonal" x1={pts.a.x} y1={pts.a.y} x2={pts.c.x} y2={pts.c.y} />
              <line className="diagonal" x1={pts.b.x} y1={pts.b.y} x2={pts.d.x} y2={pts.d.y} /></>}
              {(["a", "b", "c", "d"] as V[]).map((k) => (
                <g key={k}>
                  <circle
                    className="handle"
                    cx={pts[k].x}
                    cy={pts[k].y}
                    r="7"
                    tabIndex={0}
                    aria-label={`Draggable vertex ${k.toUpperCase()}`}
                    role="slider" aria-valuemin={35} aria-valuemax={465} aria-valuenow={pts[k].x} aria-valuetext={`x ${pts[k].x}, y ${pts[k].y}`} aria-disabled={locked}
                    onPointerDown={ev=>{if(locked)return;ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={key:k,points:pts,client:{x:ev.clientX,y:ev.clientY},moved:false,graded};}}
                    onKeyDown={ev=>{if(locked||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?10:4;keyMove(k,ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0,ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0);}}
                  />
                  <text
                    x={pts[k].x + (k === "a" || k === "d" ? -18 : 9)}
                    y={pts[k].y + (k === "a" || k === "b" ? -10 : 20)}
                  >
                    {k.toUpperCase()}
                  </text>
                </g>
              ))}
              {showDiag&&o&&m.intersectionInside&&<><circle className="origin" cx={o.x} cy={o.y} r="6"/><text className="o-label" x={o.x-8} y={o.y-12}>O</text></>}
              {showMarks&&certs[1]&&<><Tick p={pts.a} q={pts.b}/><Tick p={pts.c} q={pts.d}/><Tick p={pts.a} q={pts.d} count={2}/><Tick p={pts.b} q={pts.c} count={2}/></>}
            </svg>
            <footer>
              {[
                ["vertex", <MousePointer2 />, "Vertex"],
                ["diagonals", "⌁", "Diagonals"],
                ["marks", "✣", "Marks"],
                ["grid", <Grid3X3 />, "Grid"],
              ].map(([v, icon, label]) => (
                <button
                  key={String(v)} aria-label={String(label)}
                  aria-pressed={v==="vertex"?tool==="vertex":v==="diagonals"?showDiag:v==="marks"?showMarks:showGrid}
                  className={(v==="vertex"?tool==="vertex":v==="diagonals"?showDiag:v==="marks"?showMarks:showGrid)?"active":""}
                  onClick={() => act(() => {setTool(v as typeof tool);if(v==="diagonals")setShowDiag(x=>!x);if(v==="marks")setShowMarks(x=>!x);if(v==="grid")setShowGrid(x=>!x);})}
                >
                  {icon}
                  {label}
                </button>
              ))}
              <label>
                Show measurements{" "}
                <button
                  role="switch" aria-label="Show measurements"
                  aria-checked={showMeasures}
                  className={showMeasures ? "on" : ""}
                  onClick={() => act(() => setShowMeasures(!showMeasures))}
                >
                  <i />
                </button>
              </label>
              <label>
                <Lock /> Lock shape{" "}
                <button
                  role="switch" aria-label="Lock shape"
                  aria-checked={locked}
                  className={locked ? "on" : ""}
                  onClick={() => act(() => setLocked(!locked))}
                >
                  <i />
                </button>
              </label>
            </footer>
          </div>
          <article className="pc10076-dashboard">
            <h2>CONDITIONS DASHBOARD</h2>
            <p>
              A quadrilateral is a parallelogram if at least one condition is
              true.
            </p>
            {names.map((x, i) => (
              <button
                key={x}
                className={certs[i] ? "satisfied" : ""}
                aria-pressed={selected===i} onClick={()=>act(()=>{setSelected(i);setGraded(false);})}
              >
                <i>{i + 1}</i>
                <span>
                  <b>{x}</b>
                  <small>
                    {i === 0
                      ? "AB ∥ CD and AD ∥ BC"
                      : i === 1
                        ? "AB = CD and AD = BC"
                        : i === 2
                          ? "∠A = ∠C and ∠B = ∠D"
                          : i === 3
                            ? "AO = OC and BO = OD"
                            : "AB = CD & AB ∥ CD, or AD = BC & AD ∥ BC"}
                  </small>
                </span>
                <strong>{certs[i] ? "✓ Satisfied" : "× Not satisfied"}</strong>
              </button>
            ))}
            <footer className={count ? "yes" : "no"}>
              <b>
                Result:{" "}
                {count
                  ? `${count} sufficient condition${count > 1 ? "s are" : " is"} satisfied.`
                  : "No sufficient condition is certified."}
              </b>
              <strong>
                {count
                  ? "∴ ABCD is a parallelogram."
                  : "ABCD is not yet proved a parallelogram."}
              </strong>
            </footer>
          </article>
        </section>
        <p className="pc10076-geometry-state" role="status">{m.kind==='convex'?count?'All five equivalent conditions hold. Choose one as your proof premise.':'No sufficient condition holds for this quadrilateral.':m.kind==='concave'?'Concave quadrilateral: none of these parallelogram conditions holds.':`${m.kind} figure: the parallelogram theorem requires a simple non-degenerate quadrilateral.`}</p>
        <div className="pc10076-presets" role="group" aria-label="Example shapes">{Object.entries(pcPresets10076).map(([name,p])=><button key={name} onClick={()=>act(()=>{setLocked(false);change(p);})}>{name}</button>)}</div>
        {showMeasures && (
          <section className="pc10076-measures">
            <article>
              <h2>LIVE MEASUREMENTS</h2>
              <p>
                <b>AB = {sides[0].toFixed(2)}</b>
                <b>CD = {sides[2].toFixed(2)}</b>
                <b>AD = {sides[3].toFixed(2)}</b>
                <b>BC = {sides[1].toFixed(2)}</b>
              </p>
              <p>
                <b>AO = {half[0]===null?"Undefined":half[0]!.toFixed(2)}</b>
                <b>OC = {half[1]===null?"Undefined":half[1]!.toFixed(2)}</b>
                <b>BO = {half[2]===null?"Undefined":half[2]!.toFixed(2)}</b>
                <b>OD = {half[3]===null?"Undefined":half[3]!.toFixed(2)}</b>
              </p>
            </article>
            <article>
              <h2>ANGLE MEASUREMENTS</h2>
              <p>
                {ang.map((n, i) => (
                  <b key={i}>
                    ∠{["A", "B", "C", "D"][i]} = {n===null?"Undefined":n.toFixed(1)+"°"}
                  </b>
                ))}
              </p>
            </article>
          </section>
        )}
        <section className="pc10076-theory">
          <div id="pc10076-learn"><Why/><button className="pc10076-proof-button" aria-expanded={proof} onClick={()=>act(()=>setProof(v=>!v))}>View full proof →</button>{proof&&<p className="pc10076-proof-expanded">AO = OC and BO = OD; vertical angles AOB and COD are equal. SAS gives triangle AOB congruent to COD, hence equal alternate interior angles imply AB ∥ CD. Similarly, triangles AOD and COB give AD ∥ BC. Thus ABCD is a parallelogram.</p>}</div>
          <div id="pc10076-example"><Worked/><button className="pc10076-proof-button" aria-expanded={solution} onClick={()=>act(()=>setSolution(v=>!v))}>See complete solution →</button>{solution&&<p className="pc10076-proof-expanded">Use PO = OR, QO = OS and the equal vertical angles at O. SAS congruence supplies equal alternate interior angles, so PQ ∥ SR. The other two triangles similarly give PS ∥ QR.</p>}</div>
          <Warning />
        </section>
        <section id="pc10076-practice" className="pc10076-challenge">
          <h2>YOUR CHALLENGE</h2>
          <p>
            Make a parallelogram, choose ONE sufficient condition as your proof premise, and explain why it proves the result. All five equivalent conditions will hold.
          </p>
          <div>
            <article>
              <b>Target: Choose one sufficient condition to justify.</b>
              {names.map((x, i) => (
                <label key={x}>
                  <input type="radio" name="pc10076-criterion" checked={selected===i} onChange={()=>act(()=>{setSelected(i);setGraded(false);})}/>
                  {x}
                </label>
              ))}
            </article>
            <article>
              <label>
                Justify your answer
                <textarea
                  aria-label="Challenge justification"
                  value={text}
                  onChange={(e) =>
                    act(() => {
                      setText(e.target.value);
                      setGraded(false);
                    })
                  }
                  placeholder="Type your justification here..."
                />
              </label>
              <button onClick={() => act(() => setGraded(true))}>
                Check Answer
              </button>
              {graded && (
                <p role="status" aria-live="polite"
                  className={
                    correct
                      ? "correct"
                      : "incorrect"
                  }
                >
                  {correct
                    ? "The selected sufficient condition holds, and your statement identifies it. Compare the full proof above."
                    : "First make the selected condition true, then state its geometric premise and conclude that the figure is a parallelogram."}
                </p>
              )}
            </article>
            <aside>
              <Lightbulb />
              <b>TIP</b>
              <p>
                One sufficient premise proves the figure is a parallelogram. The other equivalent properties then follow; exactly one green condition is impossible.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <div className="pc10076-nav">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-diagonals">
          <ArrowLeft /> Parallelogram Diagonals
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-midpoint-theorem">
          Midpoint Theorem <ArrowRight />
        </Link>
      </div><footer className="pc10076-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function Tick({p,q,count=1}:{p:P;q:P;count?:number}){const dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy);if(l<10)return null;return<g className="ticks">{Array.from({length:count},(_,i)=>(i-(count-1)/2)*5).map(n=>{const x=(p.x+q.x)/2+dx/l*n,y=(p.y+q.y)/2+dy/l*n;return<line key={n} x1={x-dy/l*5} y1={y+dx/l*5} x2={x+dy/l*5} y2={y-dx/l*5}/>;})}</g>;}
function Mini({warning=false}:{warning?:boolean}){const p=warning?{a:{x:50,y:15},b:{x:130,y:15},c:{x:160,y:95},d:{x:20,y:95}}:{a:{x:38,y:15},b:{x:158,y:15},c:{x:140,y:95},d:{x:20,y:95}},m=parallelogramConditions10076(p),o=m.o!;return<svg className="pc10076-mini" viewBox="0 0 180 120" aria-label={warning?'Equal-diagonal isosceles trapezium':'Bisecting diagonals worked example'}><path className="shape" d={`M${p.a.x} ${p.a.y}L${p.b.x} ${p.b.y}L${p.c.x} ${p.c.y}L${p.d.x} ${p.d.y}Z`}/><line x1={p.a.x} y1={p.a.y} x2={p.c.x} y2={p.c.y}/><line x1={p.b.x} y1={p.b.y} x2={p.d.x} y2={p.d.y}/>{warning?<><Tick p={p.a} q={p.c}/><Tick p={p.b} q={p.d}/><Tick p={p.a} q={p.d} count={2}/><Tick p={p.b} q={p.c} count={2}/></>:<><Tick p={p.a} q={o}/><Tick p={o} q={p.c}/><Tick p={p.b} q={o} count={2}/><Tick p={o} q={p.d} count={2}/></>}{Object.entries(p).map(([k,v],i)=><g key={k}><circle cx={v.x} cy={v.y} r="2.5"/><text x={v.x+3} y={v.y+(i<2?-5:13)}>{(warning?['A','B','C','D']:['P','Q','R','S'])[i]}</text></g>)}{!warning&&<><circle cx={o.x} cy={o.y} r="2.5"/><text x={o.x-4} y={o.y+13}>O</text></>}</svg>;}
function Why() {
  return (
    <article>
      <h2>WHY IT WORKS</h2>
      <p>
        If the diagonals of a quadrilateral bisect each other, then it has the
        properties of a parallelogram.
      </p>
      <section id="pc10076-formula">
        <b>Proof idea:</b>
        <p>
          From AO = OC and BO = OD, triangles AOB and COD are congruent by SAS using equal vertical angles at O.
          This gives AB ∥ CD. Applying SAS to triangles AOD and COB likewise gives AD ∥ BC.
        </p>
      </section>
    </article>
  );
}
function Worked() {
  return (
    <article>
      <h2>WORKED EXAMPLE</h2>
      <p>In quadrilateral PQRS, diagonals PR and QS bisect each other at O.</p>
      <Mini />
      <p>
        <b>Given:</b> PO = OR and QO = OS
        <br />
        <b>To prove:</b> PQRS is a parallelogram.
      </p>
      <b>Conclusion: PQ ∥ SR and PS ∥ QR</b>
    </article>
  );
}
function Warning() {
  return (
    <article className="warning">
      <h2>
        <TriangleAlert /> WARNING
      </h2>
      <p>Equal diagonals alone are NOT sufficient!</p>
      <Mini warning />
      <p>In this isosceles trapezium, AC = BD but it is not a parallelogram.</p>
    </article>
  );
}
