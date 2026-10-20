import {
  Bookmark, BookOpen, Calculator, FlaskConical, PenLine, X,
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  Lightbulb,
  RotateCcw,
  Star,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MidpointTheoremTargetLesson10077.css";
import MathExpression from '../../../components/ui/MathExpression';
import{midpointTheorem10077,mtStart10077,mtBound10077,mtDimension10077,type MTPoint10077 as P}from'./midpointTheoremModel10077';
type V='a'|'b'|'c';
const START=mtStart10077;
const rr=(n:number)=>Number(n.toFixed(2));
export default function MidpointTheoremTargetLesson10077({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pts, setPts] = useState(START),
    [showMid, setShowMid] = useState(true),
    [tool, setTool] = useState<"move" | "inspect">("move"),
    [fullscreen, setFullscreen] = useState(false),
    [tab, setTab] = useState(0),
    [selected,setSelected]=useState<V>("a"),
    [favorite,setFavorite]=useState(()=>{try{return localStorage.getItem("math-universe-favorite-10077")==="true";}catch{return false;}}),
    [checks, setChecks] = useState([true, true]),
    [actions, setActions] = useState(0);
  const svgRef=useRef<SVGSVGElement>(null),gesture=useRef<{key:V;points:typeof START;checks:boolean[];client:P;moved:boolean}|null>(null);
  const m=useMemo(()=>midpointTheorem10077(pts),[pts]),{d,e,lengths,ratio,parallel}=m;
  useEffect(()=>{if(!fullscreen)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const escape=(ev:KeyboardEvent)=>{if(ev.key==='Escape')setFullscreen(false);};document.addEventListener('keydown',escape);return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',escape);};},[fullscreen]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPts(START);
      setShowMid(true);
      setTool("move");
      setFullscreen(false);
      setChecks([true, true]);
    });
  const point=(ev:PointerEvent<SVGSVGElement>)=>{const matrix=svgRef.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());return{x:p.x,y:p.y};};
  const update=(k:V,p:P)=>{setPts(old=>({...old,[k]:mtBound10077(p)}));setChecks([false,false]);};
  const keyMove=(k:V,dx:number,dy:number)=>act(()=>update(k,{x:pts[k].x+dx,y:pts[k].y+dy}));
  const finish=(ev:PointerEvent<SVGSVGElement>)=>{const g=gesture.current;if(!g)return;const p=point(ev);if(p&&g.moved&&tool==='move')update(g.key,p);gesture.current=null;setActions(n=>n+1);};
  const content=(

    <section
      className={`mt10077-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="school-mockup-0751"
      data-object-model="dedicated-moving-triangle-midpoint-segment-engine"
      data-points={`${pts.a.x},${pts.a.y};${pts.b.x},${pts.b.y};${pts.c.x},${pts.c.y}`}
      data-midpoints={`${d.x},${d.y};${e.x},${e.y}`}
      data-lengths={lengths.join(",")}
      data-ratio={ratio??"undefined"}
      data-valid={String(m.valid)}
      data-half={String(m.half)}
      role={fullscreen?"dialog":undefined} aria-modal={fullscreen?true:undefined} aria-label={fullscreen?"Midpoint Theorem fullscreen":undefined}
      data-parallel={String(parallel)}
      data-show-midpoints={String(showMid)}
      data-tool={tool}
      data-fullscreen={String(fullscreen)}
      data-checks={checks.map(Number).join(",")}
      data-actions={actions}
    >
      <div role="banner" className="mt10077-hero"><Link className="mt10077-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Midpoint Theorem <button aria-label="Favorite Midpoint Theorem" aria-pressed={favorite} onClick={()=>act(()=>{const v=!favorite;setFavorite(v);try{localStorage.setItem("math-universe-favorite-10077",String(v));}catch{/* storage optional */}})}><Bookmark fill={favorite?"currentColor":"none"}/></button></h1>
        <p>
          If D and E are midpoints of two sides of a triangle ABC, then DE ∥ BC
          and DE = ½ BC.
        </p>
        <div>
          <span>Class 9</span>
          <span>Geometry</span>
          <span>Proof</span>
          <span>10-12 min</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="mt10077-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(["mt10077-interact","mt10077-learn","mt10077-example","mt10077-formula","mt10077-practice"][i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {i===0?<FlaskConical/>:i===1?<BookOpen/>:i===2?<Calculator/>:i===3?<PenLine/>:<Lightbulb/>}{x}
          </button>
        ))}
      </div>
      <main>
        <section id="mt10077-interact" className="mt10077-lab">
          <header>
            <div>
              <h2>Explore the Midpoint Theorem</h2>
              <p>
                Drag vertices A, B, and C to change the triangle. Points D and E
                stay at the midpoints.
              </p>
            </div>
            <button
              aria-label="Toggle fullscreen"
              onClick={() => act(() => setFullscreen(!fullscreen))}
            >
              {fullscreen?<X/>:<Expand/>}
            </button>
          </header>
          <div className="mt10077-work">
            <aside>
              <button
                aria-pressed={tool==="move"}
                className={tool === "move" ? "active" : ""}
                onClick={() =>
                  act(() => setTool(tool === "move" ? "inspect" : "move"))
                }
              >
                ⌁ {tool === "move" ? "Move A, B, C" : "Inspect points"}
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <label>
                <input
                  type="checkbox"
                  checked={showMid}
                  onChange={() => act(() => setShowMid(!showMid))}
                />{" "}
                Show midpoints
              </label>
              <section>
                <h3>Measurements</h3>
                <p>AB = {lengths[0].toFixed(2)} cm</p>
                <p>AC = {lengths[1].toFixed(2)} cm</p>
                <p>BC = {lengths[2].toFixed(2)} cm</p>
                <hr />
                <p>DE = {lengths[3].toFixed(2)} cm</p>
              </section>
              <section>
                <h3>Live Ratios</h3>
                <strong>
                  DE / BC = {lengths[3].toFixed(2)} / {lengths[2].toFixed(2)} ={" "}
                  {ratio===null?"Undefined":ratio.toFixed(3)}
                </strong>
                <strong>
                  {m.half?<>DE / BC = 1/2 ≈ 0.500 <Check /></>:"BC = 0: ratio undefined"}
                </strong>
              </section>
              <footer className={m.valid?"verified":"invalid"}>
                {m.valid?<Check/>:<TriangleAlert/>}
                <b>{m.valid&&parallel&&m.half?"Verified":"Degenerate triangle"}</b>
                <p>{m.valid?"DE ∥ BC and DE = ½ BC":"Use three distinct non-collinear vertices."}</p>
              </footer>
            </aside>
            <article>
              <div className={`legend ${pts.a.x>400&&pts.a.y<180?"shifted":""}`}>
                <h3>Legend</h3>
                <p>
                  <i /> Vertices (move)
                </p>
                <p>
                  <i /> Midpoints (fixed)
                </p>
                <p>
                  <i /> DE (midpoint segment)
                </p>
                <p>
                  <i /> BC (opposite side)
                </p>
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 600 400"
                aria-label="Draggable midpoint theorem triangle"
                onPointerMove={ev=>{const g=gesture.current;if(!g||tool!=='move')return;if(Math.hypot(ev.clientX-g.client.x,ev.clientY-g.client.y)>.5)g.moved=true;const p=point(ev);if(p&&g.moved)update(g.key,p);}}
                onPointerUp={finish}
                onPointerCancel={()=>{if(gesture.current){setPts(gesture.current.points);setChecks(gesture.current.checks);}gesture.current=null;}}
              >
                <defs><marker id="mt10077-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker><marker id="mt10077-purple-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path className="purple-arrow" d="M0 0L10 5L0 10Z"/></marker></defs>
                <path
                  className="triangle"
                  d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}L${pts.c.x} ${pts.c.y}Z`}
                />
                <line className="segment" x1={d.x} y1={d.y} x2={e.x} y2={e.y} />
                <line className="base" x1={pts.b.x} y1={pts.b.y} x2={pts.c.x} y2={pts.c.y}/>
                <Dimension p={pts.b} q={pts.c} away={pts.a} label={`${lengths[2].toFixed(2)} cm`} offset={32}/>
                <Dimension p={d} q={e} away={pts.a} label={`${lengths[3].toFixed(2)} cm`} offset={16} purple/>
                {showMid&&<><Ticks p={pts.a} q={d}/><Ticks p={d} q={pts.b}/><Ticks p={pts.a} q={e} count={2}/><Ticks p={e} q={pts.c} count={2}/></>}
                {(["a", "b", "c"] as V[]).map((k) => (
                  <g key={k}>
                    <circle
                      className="vertex"
                      cx={pts[k].x}
                      cy={pts[k].y}
                      r="7"
                      tabIndex={0}
                      aria-label={`Draggable vertex ${k.toUpperCase()}`}
                      role="slider" aria-valuemin={55} aria-valuemax={545} aria-valuenow={pts[k].x} aria-valuetext={`x ${pts[k].x}, y ${pts[k].y}`} aria-disabled={tool==='inspect'}
                      onFocus={()=>setSelected(k)}
                      onPointerDown={ev=>{setSelected(k);if(tool!=='move')return;ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={key:k,points:pts,checks,client:{x:ev.clientX,y:ev.clientY},moved:false};}}
                      onKeyDown={ev=>{if(tool!=='move'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?10:4;keyMove(k,ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0,ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0);}}
                    />
                    <text
                      x={pts[k].x + (k === "a" ? -5 : k === "b" ? -16 : 10)}
                      y={pts[k].y + (k === "a" ? -12 : 20)}
                    >
                      {k.toUpperCase()}
                    </text>
                  </g>
                ))}
                {showMid && (
                  <>
                    {[
                      [d, "D"],
                      [e, "E"],
                    ].map(([p, n]) => (
                      <g key={String(n)}>
                        <circle
                          className="mid"
                          cx={(p as P).x}
                          cy={(p as P).y}
                          r="7"
                        />
                        <text
                          x={(p as P).x + (n === "D" ? -18 : 10)}
                          y={(p as P).y - 5}
                        >
                          {n as string}
                        </text>
                      </g>
                    ))}
                  </>
                )}
                <text className="parallel-tag" x={(d.x+e.x)/2} y={(d.y+e.y)/2+60} textAnchor="middle">{m.valid?'DE ∥ BC':'Degenerate triangle'}</text>
              </svg>
              <aside>
                <Lightbulb />
                <b>Tip</b>
<p>{tool==="inspect"?`Point ${selected.toUpperCase()}: (${rr((pts[selected].x-100)/40)}, ${rr((320-pts[selected].y)/40)}) cm. Switch to Move to reshape.`:"D and E follow the exact midpoints. The theorem applies to non-degenerate triangles."}</p>
              </aside>
            </article>
          </div>
        </section>
        <Proof />
        <section className="mt10077-theory">
          <Worked />
          <Warning />
        </section>
        <section id="mt10077-practice" className="mt10077-challenge">
          <div>
            <h2>
              <Star /> Your Challenge
            </h2>
            <p>Move A, B, or C while keeping D and E at the midpoints.</p>
            <section>
              {["Check Parallelism", "Check Length Relationship"].map(
                (x, i) => (
                  <button
                    key={x}
                    className={checks[i] ? "done" : ""}
                    onClick={() =>
                      act(() => {
                        const n = [...checks];
                        n[i] = i===0?m.valid&&m.parallel:m.half;
                        setChecks(n);
                      })
                    }
                  >
                    <b>
                      Task {i + 1}: {x}
                    </b>
                    <small>
                      {i === 0
                        ? "Verify that DE remains parallel to BC."
                        : "Verify that DE is always half of BC."}
                    </small>
                    <strong>{i===0?m.parallel?"DE ∥ BC":"Not verified":m.half?"DE = ½ BC":"Undefined"}</strong>
                    {checks[i] && <Check />}
                  </button>
                ),
              )}
            </section>
          </div>
          <aside>
            <b>Keep exploring!</b>
            <p>Drag the triangle to test many shapes.</p>
            <i>{checks.filter(Boolean).length * 50}%</i>
            <strong>
              {checks.every(Boolean)&&m.valid
                ? "Both properties hold!"
                : "Complete both checks"}
            </strong>
          </aside>
        </section>
      </main>
      <div className="mt10077-nav">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-conditions-for-a-quadrilateral-to-be-a-parallelogram">
          <ArrowLeft /> Conditions for a Quadrilateral to be a Parallelogram
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-converse-of-midpoint-theorem">
          Converse of Midpoint Theorem <ArrowRight />
        </Link>
      </div><footer className="mt10077-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
  return fullscreen&&typeof document!=="undefined"?createPortal(content,document.body):content;
}
function Mini({bad=false}:{bad?:boolean}){const a={x:95,y:10},b={x:20,y:110},c={x:170,y:110},point=(u:P,v:P,t:number)=>({x:u.x+t*(v.x-u.x),y:u.y+t*(v.y-u.y)}),d=point(a,b,bad?.62:.5),e=point(a,c,bad?.56:.5);return<svg className="mt10077-mini" viewBox="0 0 190 135" aria-label={bad?'Points that are not midpoints':'True midpoints'}><path className="triangle" d="M95 10L20 110L170 110Z"/><line className="base" x1="20" y1="110" x2="170" y2="110"/><line className="segment" x1={d.x} y1={d.y} x2={e.x} y2={e.y}/>{!bad&&<><Ticks p={a} q={d}/><Ticks p={d} q={b}/><Ticks p={a} q={e} count={2}/><Ticks p={e} q={c} count={2}/></>}{[['A',a],['B',b],['C',c],['D',d],['E',e]].map(([name,v])=><g key={name as string}><circle className="mini-dot" cx={(v as P).x} cy={(v as P).y} r="2.5"/><text x={(v as P).x+4} y={name==='A'?(v as P).y:name==='B'||name==='C'?(v as P).y+14:(v as P).y-5}>{name as string}</text></g>)}</svg>;}
function Ticks({p,q,count=1}:{p:P;q:P;count?:number}){const dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy);if(l<10)return null;return<g className="ticks">{Array.from({length:count},(_,i)=>(i-(count-1)/2)*4).map(n=>{const x=(p.x+q.x)/2+dx/l*n,y=(p.y+q.y)/2+dy/l*n;return<line key={n} x1={x-dy/l*5} y1={y+dx/l*5} x2={x+dy/l*5} y2={y-dx/l*5}/>;})}</g>;}
function Dimension({p,q,away,label,offset,purple=false}:{p:P;q:P;away:P;label:string;offset:number;purple?:boolean}){const d=mtDimension10077(p,q,away,offset);if(!d)return null;return<g className={`dimension ${purple?'purple':''}`}><line markerStart={purple?"url(#mt10077-purple-arrow)":"url(#mt10077-arrow)"} markerEnd={purple?"url(#mt10077-purple-arrow)":"url(#mt10077-arrow)"} x1={d.p.x} y1={d.p.y} x2={d.q.x} y2={d.q.y}/><text textAnchor="middle" x={purple?(p.x+q.x)/2-d.nx*12:d.label.x} y={purple?(p.y+q.y)/2-d.ny*12:d.label.y}>{label}</text></g>;}
function Proof(){return<section id="mt10077-learn" className="mt10077-proof"><article><h2>Why does it work?</h2><p>Consider triangle ABC with D and E as exact midpoints of AB and AC.</p><ol><li>AD = DB and AE = EC, so AD / AB = AE / AC = 1/2.</li><li>Triangles ADE and ABC share the included angle at A.</li><li>By SAS similarity, triangle ADE is similar to triangle ABC.</li><li>Corresponding angles are equal, so DE ∥ BC. Corresponding side lengths have ratio 1/2.</li></ol><div id="mt10077-formula"><MathExpression value={String.raw`DE\parallel BC,\qquad DE=\frac12BC`}/></div></article><Mini/></section>;}
function Worked() {
  return (
    <article id="mt10077-example">
      <h2>WORKED EXAMPLE</h2>
      <p>If BC = 10 cm, what is DE?</p>
      <MathExpression value={String.raw`DE=\frac12BC=\frac12\times10=5\text{ cm}`}/>
      <footer>Answer: DE = 5 cm</footer>
    </article>
  );
}
function Warning() {
  return (
    <article className="warning">
      <h2>
        <TriangleAlert /> Warning: Common Misconception
      </h2>
      <p>
        Choosing points that only look centered does not guarantee midpoints.
        Only true midpoints ensure both theorem conclusions.
      </p>
      <div>
        <span>
          <Mini />
          <b>✓ Correct midpoints</b>
        </span>
        <span>
          <Mini bad />
          <b>× Not midpoints</b>
        </span>
      </div>
    </article>
  );
}
