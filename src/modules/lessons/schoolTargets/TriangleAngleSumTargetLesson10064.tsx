import { ArrowLeft, ArrowRight, Check, RotateCcw, Trash2 } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleAngleSumTargetLesson10064.css";
import {tsInitial10064 as initial,tsModel10064,tsMove10064,tsFrom10064,tsWedge10064,type TSPoint10064 as Point,type TSTriangle10064} from './triangleSumModel10064';
import {paSector10074} from './parallelogramAnglesModel10074';
import MathExpression from '../../../components/ui/MathExpression';

const colors = ['purple','blue','green'];
const fmt=(n:number|null)=>n===null?'Undefined':`${Number(n.toFixed(2))}°`;
const presets=[[55,53,72],[42,48,90],[30,40,110]];
export default function TriangleAngleSumTargetLesson10064({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(initial),
    [line, setLine] = useState([0, 1, 2]),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState(0),
    [actions, setActions] = useState(0);
  const model=useMemo(()=>tsModel10064(points),[points]);
  const {angles,sum,proper}=model;
  const dropRef=useRef<HTMLDivElement>(null);
  const pieceDrag=useRef<{id:number;index:number;x:number;y:number;moved:boolean}|null>(null);
  const suppressClick=useRef(false);
  const sectionIds=['ta10064-interact','ta10064-learn','ta10064-example','ta10064-formula','ta10064-practice'];
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const move=(name:keyof TSTriangle10064,point:Point)=>act(()=>setPoints(current=>tsMove10064(current,name,point)));
  const addPiece = (index: number) =>
    act(() =>
      setLine((current) =>
        !proper||current.includes(index) ? current : [...current, index],
      ),
    );
  return (
    <section
      className="ta10064-page"
      data-testid="school-mockup-0738"
      data-object-model="dedicated-draggable-triangle-angle-sum-tear-rearrange-engine"
      data-points={Object.values(points)
        .map((p) => `${p.x},${p.y}`)
        .join(";")}
      data-angles={angles.map(a=>a??"undefined").join(",")}
      data-proper={proper}
      data-kind={model.kind}
      data-sum={sum}
      data-line={line.join(",")}
      data-challenge={challenge}
      data-actions={actions}
    >
      <div role="banner" className="ta10064-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Triangle Angle Sum Theorem</h1>
        <p>Discover and prove that a triangle's interior angles total 180°.</p>
        <div>
          <span>◷ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </div>
      <div role="group" aria-label="Lesson sections" className="ta10064-tabs">
        {["⌘ Interact", "▣ Learn", "◷ Example", "⌁ Formula", "⌕ Practice"].map(
          (x, i) => (
            <button
              key={x}
              className={tab === i ? "active" : ""}
              aria-pressed={tab === i}
              onClick={() => act(() => {setTab(i);document.getElementById(sectionIds[i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
            >
              {x}
            </button>
          ),
        )}
      </div>
      <main>
        <section id="ta10064-interact" className="ta10064-explore">
          <header>
            <h2>1. EXPLORE & DISCOVER</h2>
            <p>
              Drag any vertex to change the triangle. Arrange the three angles
              on a straight line.
            </p>
          </header>
          <div>
            <article>
              <button onClick={() => act(() => setPoints(initial))}>
                <RotateCcw /> Reset triangle
              </button>
              <TriangleModel points={points} move={move} restore={setPoints} />
              <footer>
                💡 Drag vertices A, B, or C to explore acute, right, and obtuse
                triangles.
              </footer>
            </article>
            <aside>
              <section>
                <h3>ANGLE MEASURES (live)</h3>
                {angles.map((value, i) => (
                  <p key={i} className={colors[i]}>
                    <i /> ∠{String.fromCharCode(65 + i)} <span>=</span>
                    <b>{fmt(value)}</b>
                  </p>
                ))}
              </section>
              <section>
                <h3>SUM METER</h3>
                <strong>
                  {proper?`${angles.map(fmt).join(" + ")} ${Math.abs(angles.reduce<number>((s,a)=>s+Number(a!.toFixed(2)),0)-180)<1e-9?"=":"≈"} 180°`:"Undefined: three non-collinear vertices required"}
                </strong>
                <progress aria-label="Triangle angle sum" max="180" value={sum??0} />
                <b>
                  {proper
                    ? "Perfect! The sum is 180°."
                    : "Restore a proper triangle to measure its interior angles."}
                </b>
              </section>
            </aside>
          </div>
        </section>
        <section className="ta10064-tear" data-rearranged={proper&&line.length===3}>
          <header>
            <h2>2. TEAR & REARRANGE</h2>
            <p>
              Drag or select each colored angle to place it at the same point on the line. Clear the line to start again.
            </p>
            <button onClick={() => act(() => setLine([]))}>
              <Trash2 /> Clear line
            </button>
          </header>
          {!proper&&<p role="status">A degenerate triangle has no three interior angles to rearrange.</p>}
          <div className="ta10064-palette" aria-label="Angle pieces">
            {angles.map((value,i)=><button key={i} disabled={!proper||line.includes(i)} aria-label={`Place angle ${'ABC'[i]}`} aria-pressed={line.includes(i)} className={colors[i]}
              onPointerDown={e=>{if(pieceDrag.current||!proper||line.includes(i))return;e.currentTarget.setPointerCapture(e.pointerId);suppressClick.current=false;pieceDrag.current={id:e.pointerId,index:i,x:e.clientX,y:e.clientY,moved:false};}}
              onPointerMove={e=>{const d=pieceDrag.current;if(d&&d.id===e.pointerId&&Math.hypot(e.clientX-d.x,e.clientY-d.y)>3)d.moved=true;}}
              onPointerUp={e=>{const d=pieceDrag.current;if(!d||d.id!==e.pointerId)return;const box=dropRef.current?.getBoundingClientRect();if(d.moved){suppressClick.current=true;setTimeout(()=>{suppressClick.current=false;},0);if(box&&e.clientX>=box.left&&e.clientX<=box.right&&e.clientY>=box.top&&e.clientY<=box.bottom)addPiece(i);}pieceDrag.current=null;}}
              onPointerCancel={()=>{pieceDrag.current=null;suppressClick.current=false;}}
              onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}addPiece(i);}}>{String.fromCharCode(65+i)}: {fmt(value)}{line.includes(i)?' ✓':''}</button>)}
          </div>
          <div ref={dropRef} className="ta10064-line" aria-label="Angle rearrangement line">
            <svg viewBox="0 0 520 170" aria-label="Adjacent angle sectors forming a straight angle">
              <line x1="20" y1="135" x2="500" y2="135" className="baseline"/>
              {proper&&line.map((i,j)=>{const previous=line.slice(0,j).reduce((s,k)=>s+angles[k]!,0),w=tsWedge10064(angles[i]!,180-previous-angles[i]!);return <g key={i} className={colors[i]}><path data-piece={i} data-angle={angles[i]!} d={w.path}/><text x={w.label.x} y={w.label.y} textAnchor="middle">{fmt(angles[i])}</text></g>;})}
              <text x="260" y="160" textAnchor="middle">{!proper?'Undefined':line.length===3?'180°':`${line.length}/3 pieces · ${fmt(line.reduce((s,i)=>s+angles[i]!,0))}`}</text>
            </svg>
          </div>
          <p className="ta10064-rounding">All three measured angles sum to 180°. Individual labels are rounded to two decimals.</p>
        </section>
        <section id="ta10064-formula" className="ta10064-theorem">
          <i>△</i>
          <div>
            <h2>THEOREM</h2>
            <p>For every Euclidean triangle ABC,</p>
            <MathExpression value={String.raw`\angle A+\angle B+\angle C=180^\circ`} />
          </div>
        </section>
        <section id="ta10064-learn" className="ta10064-explain">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>Draw a line through vertex C parallel to side AB.</p>
            <p>The alternate interior angles formed equal ∠A and ∠B.</p>
            <p>These three adjacent angles on a straight line sum to 180°.</p>
            <ProofTriangle />
          </article>
          <article>
            <h2 id="ta10064-example">WORKED EXAMPLE</h2>
            <p>If ∠A = 48° and ∠B = 67°, find ∠C.</p>
            <p>∠C = 180° − (48° + 67°)</p>
            <p>∠C = 180° − 115°</p>
            <p>
              <b>∠C = 65°</b>
            </p>
            <StaticTriangle angles={[48, 67, 65]} />
          </article>
        </section>
        <section className="ta10064-warning">
          <h2>💡 COMMON MISCONCEPTION</h2>
          <div>
            <p>
              <b>Myth: The angle sum changes with the shape of a triangle.</b>
            </p>
            <p>
              <b>Reality:</b> The sum of the interior angles of any Euclidean
              triangle is always 180°, whether the triangle is acute, right,
              obtuse, scalene, or isosceles.
            </p>
          </div>
          {[
            [55, 53, 72],
            [42, 48, 90],
            [30, 40, 110],
          ].map((set, i) => (
            <figure key={i}>
              <StaticTriangle angles={set} />
              <b>{["Acute", "Right", "Obtuse"][i]}</b>
              <span>180°</span>
            </figure>
          ))}
        </section>
        <section id="ta10064-practice" className="ta10064-challenge">
          <header>
            <h2>◎ CHALLENGE YOURSELF</h2>
            <p>
              Drag vertex C through acute, right, and obtuse cases. Keep the sum
              verified.
            </p>
            <button
              onClick={() => act(() => {const i=(challenge+1)%3;setChallenge(i);setPoints(tsFrom10064(presets[i][0],presets[i][1]));document.getElementById("ta10064-interact")?.scrollIntoView({behavior:"smooth"});})}
            >
              ⟳ Try it now
            </button>
          </header>
          <div>
            {[
              [55, 53, 72],
              [42, 48, 90],
              [30, 40, 110],
            ].map((set, i) => (
              <article key={i} className={challenge === i ? "active" : ""}>
                <h3>
                  <button aria-label={`Explore ${["acute","right","obtuse"][i]} triangle`} onClick={()=>act(()=>{setChallenge(i);setPoints(tsFrom10064(set[0],set[1]));document.getElementById("ta10064-interact")?.scrollIntoView({behavior:"smooth"});})}>{["Acute Triangle", "Right Triangle", "Obtuse Triangle"][i]}</button>
                </h3>
                <StaticTriangle angles={set} />
                <b>
                  Sum = 180° <Check />
                </b>
              </article>
            ))}
          </div>
        </section>
      </main>
      <nav className="ta10064-nav">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-parallel-line-converse-theorems">
          <ArrowLeft /> Parallel Line Converse Theorems
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-exterior-angle-theorem">
          Exterior Angle Theorem <ArrowRight />
        </Link>
      </nav>
      <footer className="ta10064-footer"><b>Math Universe</b><div className="ta10064-footer-links"><Link to="/sitemap">Sitemap</Link><Link to="/docs">Docs</Link><Link to="/about">About</Link></div><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. RIGHT NOT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function TriangleModel({points,move,restore}:{points:TSTriangle10064;move:(k:keyof TSTriangle10064,p:Point)=>void;restore:(p:TSTriangle10064)=>void}){
 const ref=useRef<SVGSVGElement>(null),gesture=useRef<{pid:number;k:keyof TSTriangle10064;before:TSTriangle10064;x:number;y:number;moved:boolean}|null>(null),id=`ta-grid-${useId().replace(/:/g,'')}`;
 const update=(e:React.PointerEvent<SVGCircleElement>,final=false)=>{const d=gesture.current;if(!d||d.pid!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>.5)d.moved=true;if(d.moved){const m=ref.current?.getScreenCTM();if(m){const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());move(d.k,q);}}if(final)gesture.current=null;};
 return <svg ref={ref} className="ta10064-triangle" viewBox="0 0 520 370" aria-label="Interactive triangle angle sum diagram"><defs><pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24"/></pattern></defs><rect width="520" height="370" style={{fill:`url(#${id})`}}/><TriangleInk points={points}/>{(['A','B','C']as const).map(k=><circle key={k} role="slider" aria-label={`Drag vertex ${k}`} aria-valuetext={`x ${points[k].x.toFixed(1)}, y ${points[k].y.toFixed(1)}`} className="handle" cx={points[k].x} cy={points[k].y} r="17" tabIndex={0}
 onPointerDown={e=>{if(gesture.current)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);gesture.current={pid:e.pointerId,k,before:points,x:e.clientX,y:e.clientY,moved:false};}}
 onPointerMove={e=>update(e)} onPointerUp={e=>update(e,true)} onPointerCancel={e=>{const d=gesture.current;if(d?.pid===e.pointerId){restore(d.before);gesture.current=null;}}}
 onKeyDown={e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const step=e.shiftKey?10:4,p=points[k];move(k,{x:p.x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),y:p.y+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0)});}}/>)}</svg>;
}
function TriangleInk({points,proof=false}:{points:TSTriangle10064;proof?:boolean}){
 const m=tsModel10064(points),v=[points.A,points.B,points.C];
 return <><path className="shape" d={`M${v.map(p=>`${p.x} ${p.y}`).join('L')}Z`}/>{v.map((p,i)=>{const sector=m.proper?paSector10074(p,v[(i+1)%3],v[(i+2)%3],40):null,cx=(v[0].x+v[1].x+v[2].x)/3,cy=(v[0].y+v[1].y+v[2].y)/3,dx=p.x-cx,dy=p.y-cy,length=Math.hypot(dx,dy)||1;return <g key={i} className={colors[i]}>{sector&&<><path className="sector" d={sector.path}/><text className="measure" x={sector.label.x} y={sector.label.y} textAnchor="middle" dominantBaseline="middle">{fmt(m.angles[i])}</text></>}<circle className="vertex" cx={p.x} cy={p.y} r="3"/><text className="vertex-name" textAnchor="middle" x={p.x+dx/length*17} y={p.y+dy/length*17+4}>{'ABC'[i]}</text></g>;})}{!m.proper&&<text x="260" y="55" textAnchor="middle">Degenerate triangle: angles undefined</text>}{proof&&m.proper&&<><line className="parallel" x1="35" x2="485" y1={points.C.y} y2={points.C.y}/><text x="480" y={points.C.y-12}>ℓ ∥ AB</text>{[paSector10074(points.C,{x:35,y:points.C.y},points.A,40),paSector10074(points.C,points.B,{x:485,y:points.C.y},40)].map((s,i)=>s&&<g key={i} className={colors[i]}><path className="sector" d={s.path}/><text className="measure" textAnchor="middle" x={s.label.x} y={s.label.y}>{fmt(m.angles[i])}</text></g>)}</>}</>;
}
function StaticTriangle({angles}:{angles:number[]}){return <svg className="ta10064-static" viewBox="0 0 520 370" aria-label={`${angles.join(', ')} degree triangle`}><TriangleInk points={tsFrom10064(angles[0],angles[1])}/></svg>;}
function ProofTriangle(){return <svg className="ta10064-proof" viewBox="0 -30 520 400" aria-label="Parallel line through C proves the angle sum"><TriangleInk points={tsFrom10064()} proof/></svg>;}
