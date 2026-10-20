import {
  Atom, BookOpen, Calculator, Braces, ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  Maximize2,
  Move,
  RotateCcw,
  Shuffle,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramDiagonalsTargetLesson10075.css";
import MathExpression from '../../../components/ui/MathExpression';
import{parallelogramDiagonals10075,pdStart10075,pdPresets10075,pdBound10075,pdVertex10075,pdRandom10075}from'./parallelogramDiagonalsModel10075';

type Point = { x: number; y: number };
type Handle = "a" | "b" | "c" | "d" | "o";
const START=pdStart10075;
const answers=['always','always','sometimes','sometimes'];
const initialChoices=['always','always','never','never'];
export default function ParallelogramDiagonalsTargetLesson10075({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState(START),
    [candidate, setCandidate] = useState(START.center),
    [locked, setLocked] = useState(true),
    [proof, setProof] = useState(true),
    [tool, setTool] = useState<"drag" | "move">("drag"),
    [zoom, setZoom] = useState(100),
    [tab, setTab] = useState(0),

    [choices, setChoices] = useState(initialChoices),
    [actions, setActions] = useState(0);
  const svgRef=useRef<SVGSVGElement>(null),plotRef=useRef<SVGGElement>(null),seed=useRef(0),gesture=useRef<{key:Handle;model:typeof START;candidate:Point;client:Point;moved:boolean}|null>(null);
  const o=locked?model.center:candidate,m=useMemo(()=>parallelogramDiagonals10075(model,o),[model,o]),{points:pts,measures,totals,midpoint:equal}=m;
  const score = choices.filter((x, i) => x === answers[i]).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setModel(START);
      setCandidate(START.center);
      setLocked(true);
      setProof(true);
      setTool("drag");
      setZoom(100);gesture.current=null;
    });
  const randomize=()=>act(()=>{const next=pdRandom10075(++seed.current);setModel(next);setCandidate(next.center);});
  const point=(ev:PointerEvent<SVGSVGElement>)=>{const matrix=plotRef.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());return{x:p.x,y:p.y};};
  const update=(key:Handle,p:Point)=>{if(key==='o'){if(!locked&&tool==='move')setCandidate(pdBound10075(p));return;}if(tool==='drag')setModel(old=>pdVertex10075(old,key,p));};
  const keyMove=(key:Handle,dx:number,dy:number)=>{const p=key==='o'?o:pts[key];act(()=>update(key,{x:p.x+dx,y:p.y+dy}));};
  const finish=(ev:PointerEvent<SVGSVGElement>)=>{const g=gesture.current;if(!g)return;const p=point(ev);if(p&&g.moved)update(g.key,p);gesture.current=null;setActions(n=>n+1);};
  return (
    <section
      className="pd10075-page"
      data-testid="school-mockup-0749"
      data-object-model="dedicated-half-diagonal-midpoint-bisection-engine"
      data-points={`${pts.a.x},${pts.a.y};${pts.b.x},${pts.b.y};${pts.c.x},${pts.c.y};${pts.d.x},${pts.d.y};${model.center.x},${model.center.y}`}
      data-candidate={`${o.x},${o.y}`} data-valid={String(m.valid)} data-diagonals-equal={String(m.equalDiagonals)} data-perpendicular={String(m.perpendicular)}
      data-measures={measures.join(",")}
      data-totals={totals.join(",")}
      data-midpoint={String(equal)}
      data-locked={String(locked)}
      data-proof={String(proof)}
      data-tool={tool}
      data-zoom={zoom}
      data-score={`${score}/4`}
      data-actions={actions}
    >
      <div role="banner" className="pd10075-hero"><Link className="pd10075-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Parallelogram Diagonals</h1>
        <p>
          <b>Objective:</b> Discover and prove that parallelogram diagonals
          bisect each other.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>INTERACTIVE</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="pd10075-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);if(i===3)setProof(true);requestAnimationFrame(()=>document.getElementById(["pd10075-interact","pd10075-learn","pd10075-example","pd10075-formula","pd10075-practice"][i])?.scrollIntoView({behavior:"smooth",block:"start"}));})}
          >
            {i===0?<Atom/>:i===1?<BookOpen/>:i===2?<Calculator/>:i===3?<Braces/>:<ClipboardCheck/>}{x}
          </button>
        ))}
      </div>
      <main>
        <section id="pd10075-interact" className="pd10075-lab">
          <header>
            <div>
              <h2>DRAG &amp; DISCOVER</h2>
              <p>
                Drag any vertex to change the parallelogram. Point O is the
                true intersection of the diagonals. Opposite vertices move symmetrically to preserve the parallelogram. Unlock to test a separate point P.
              </p>
            </div>
            <label>
              Midpoint locks{" "}
              <button
                role="switch" aria-label="Midpoint locks"
                aria-checked={locked}
                className={locked ? "on" : ""}
                onClick={() =>
                  act(() => {
                    setLocked(!locked);
                    setTool(locked ? "move" : "drag");
                    setCandidate(model.center);
                  })
                }
              >
                <i />
              </button>
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="pd10075-work">
            <aside>
              <section>
                <h3>MEASUREMENTS (live)</h3>
                {(locked?(m.valid?["AO", "OC", "BO", "OD"]:["AM","MC","BM","MD"]):["AP", "PC", "BP", "PD"]).map((x, i) => (
                  <p key={x}>
                    <i className={i < 2 ? "purple" : "green"} />
                    <span>{x} =</span>
                    <b>{measures[i].toFixed(2)}</b>
                  </p>
                ))}
              </section>
              <section>
                <h3>DIAGONALS</h3>
                <p>
                  <i className="purple" />
                  <span>AC =</span>
                  <b>{totals[0].toFixed(2)}</b>
                </p>
                <p>
                  <i className="green" />
                  <span>BD =</span>
                  <b>{totals[1].toFixed(2)}</b>
                </p>
              </section>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 560 380"
                aria-label="Draggable parallelogram diagonal model"
                onPointerMove={ev=>{const g=gesture.current;if(!g)return;if(Math.hypot(ev.clientX-g.client.x,ev.clientY-g.client.y)>.5)g.moved=true;const p=point(ev);if(p&&g.moved)update(g.key,p);}}
                onPointerUp={finish}
                onPointerCancel={()=>{if(gesture.current){setModel(gesture.current.model);setCandidate(gesture.current.candidate);}gesture.current=null;}}
              >
                <defs>
                  <pattern
                    id="pdGrid"
                    width="22"
                    height="22"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M22 0H0V22" />
                  </pattern>
                </defs>
                <g ref={plotRef} transform={`translate(280 190) scale(${zoom/100}) translate(-280 -190)`}>
                <rect width="560" height="380" fill="url(#pdGrid)"/>
                <path
                  className="shape"
                  d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}L${pts.c.x} ${pts.c.y}L${pts.d.x} ${pts.d.y}Z`}
                />
                <line
                  className="diag"
                  x1={pts.a.x}
                  y1={pts.a.y}
                  x2={pts.c.x}
                  y2={pts.c.y}
                />
                <line
                  className="diag"
                  x1={pts.b.x}
                  y1={pts.b.y}
                  x2={pts.d.x}
                  y2={pts.d.y}
                />
                {(["a", "b", "c", "d"] as Handle[]).map((k) => {
                  const p = pts[k as keyof typeof pts];
                  return (
                    <g key={k}>
                      <circle
                        className="vertex"
                        cx={p.x}
                        cy={p.y}
                        r="7"
                        tabIndex={0}
                        aria-label={`Draggable vertex ${k.toUpperCase()}`}
                        role="slider" aria-valuemin={40} aria-valuemax={520} aria-valuenow={p.x} aria-valuetext={`x ${p.x}, y ${p.y}`} aria-disabled={tool!=='drag'}
                        onPointerDown={ev=>{if(tool!=='drag')return;ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={key:k,model,candidate,client:{x:ev.clientX,y:ev.clientY},moved:false};}}
                        onKeyDown={ev=>{if(tool!=='drag'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?10:4;keyMove(k,ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0,ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0);}}
                      />
                      <text
                        x={p.x + (k === "a" || k === "d" ? -20 : 9)}
                        y={p.y + (k === "a" || k === "b" ? -10 : 20)}
                      >
                        {k.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
                {m.valid&&!locked&&!equal&&<><circle className="true-origin" cx={model.center.x} cy={model.center.y} r="5"/><text className="true-label" x={model.center.x+10} y={model.center.y-10}>O</text></>}
                <circle className={`origin ${equal?'equal':'unequal'}`} cx={o.x} cy={o.y} r="9" role="slider" tabIndex={locked?-1:0} aria-label="Test point P" aria-disabled={locked||tool!=='move'} aria-valuemin={40} aria-valuemax={520} aria-valuenow={o.x} aria-valuetext={`x ${o.x}, y ${o.y}`} onPointerDown={ev=>{if(locked||tool!=='move')return;ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={key:'o',model,candidate,client:{x:ev.clientX,y:ev.clientY},moved:false};}} onKeyDown={ev=>{if(locked||tool!=='move'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?10:4;keyMove('o',ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0,ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0);}}/>
                <text className="point-label" x={o.x+10} y={o.y-10}>{!m.valid?locked?'M':'P':locked?'O':equal?'P = O':'P'}</text>
                </g>
              </svg>
              <footer>
                <div>
                  <button
                    aria-label="Drag vertices" aria-pressed={tool==="drag"}
                    className={tool === "drag" ? "active" : ""}
                    onClick={() => act(() => setTool("drag"))}
                  >
                    ⌁ Drag
                  </button>
                  <button
                    aria-pressed={tool==="move"} className={tool === "move" ? "active" : ""}
                    onClick={() =>
                      act(() => {
                        setTool("move");
                        setLocked(false);
                        setCandidate(model.center);
                      })
                    }
                  >
                    <Move /> Test point P
                  </button>
                  <button onClick={reset}>
                    <RotateCcw /> Reset shape
                  </button>
                  <button onClick={randomize}>
                    <Shuffle /> Randomize
                  </button>
                </div>
                <div>
                  <button
                    aria-label="Zoom out" disabled={zoom<=80}
                    onClick={() => act(() => setZoom(Math.max(80, zoom - 10)))}
                  >
                    <ZoomOut />
                  </button>
                  <button
                    aria-label="Zoom in" disabled={zoom>=120}
                    onClick={() => act(() => setZoom(Math.min(120, zoom + 10)))}
                  >
                    <ZoomIn />
                  </button>
                  <button
                    aria-label="Fit view"
                    onClick={() => act(() => setZoom(100))}
                  >
                    <Maximize2 />
                  </button>
                </div>
              </footer>
            </article>
          </div>
        </section>
        <div role="group" aria-label="Special parallelograms" className="pd10075-presets">{Object.entries(pdPresets10075).map(([name,shape])=><button key={name} onClick={()=>act(()=>{setModel(shape);setCandidate(shape.center);setLocked(true);setTool('drag');})}>{name}</button>)}</div><p className="pd10075-special-state" role="status">{!m.valid?'Degenerate figure: the diagonals do not have a unique intersection.':`${m.equalDiagonals?'Equal':'Unequal'} diagonal lengths; ${m.perpendicular?'perpendicular':'non-perpendicular'} diagonals.`}</p>
        <section className={`pd10075-result ${equal ? "correct" : "wrong"}`}>
          {equal?<Check/>:<TriangleAlert/>}
          <div>
            <b>
              {equal
                ? locked?"Great! O is the midpoint of both diagonals.":"P coincides with the true midpoint O."
                : m.valid?"P is not the midpoint. O remains the true intersection.":"Use a non-degenerate parallelogram."}
            </b>
            <p>
              {equal
                ? locked?"AO = OC and BO = OD":"AP = PC and BP = PD"
                : m.valid?"The distances to P are not diagonal halves unless P = O.":"Distinct non-parallel diagonals are required."}
            </p>
          </div>
          <button aria-expanded={proof} onClick={() => act(() => setProof(!proof))}>
            {proof ? "Hide proof" : "Show proof"}
          </button>
        </section>
        {proof && <Proof />}
        <section className="pd10075-theory">
          <Why />
          <Worked />
        </section>
        <section className="pd10075-lower">
          <Mistake />
          <Challenge
            choices={choices}
            setChoices={(x) => act(() => setChoices(x))}
          />
        </section>
      </main>
      <div className="pd10075-nav">
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-angles">
          <ArrowLeft /> Parallelogram Opposite Angles
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-conditions-for-a-quadrilateral-to-be-a-parallelogram">
          Conditions for a Quadrilateral To Be a Parallelogram <ArrowRight />
        </Link>
      </div><footer className="pd10075-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function Proof() {
  return (
    <section id="pd10075-formula" className="pd10075-proof">
      <h2>PROOF OVERLAY: △AOB ≅ △COD</h2>
      <div>
        <article>
          <h3>Given</h3>
          <p>ABCD is a parallelogram.</p>
          <p>Diagonals AC and BD intersect at O.</p>
        </article>
        <article>
          <h3>To Prove</h3>
          <p>AO = OC</p>
          <p>BO = OD</p>
        </article>
        <article>
          <h3>Proof</h3>
          <ol>
            <li>AB ∥ CD and AD ∥ BC.</li>
            <li>∠ABO = ∠CDO.</li>
            <li>∠BAO = ∠DCO.</li>
            <li>∠AOB = ∠COD (vertical).</li>
            <li>AB = CD (opposite sides of a parallelogram).</li>
            <li>△AOB ≅ △COD (ASA, using the two angles and included side).</li>
            <li>AO = OC and BO = OD (CPCTC).</li>
          </ol>
        </article>
      </div>
    </section>
  );
}
function Mini({cross=false,proof=false}:{cross?:boolean;proof?:boolean}){const m=parallelogramDiagonals10075(START),map=(p:Point)=>({x:90+(p.x-280)*.28,y:65+(p.y-190)*.28}),p={a:map(m.points.a),b:map(m.points.b),c:map(m.points.c),d:map(m.points.d)},o={x:90,y:65},sector=(v:Point,a:Point,b:Point,r:number)=>{const start=Math.atan2(a.y-v.y,a.x-v.x),end=Math.atan2(b.y-v.y,b.x-v.x);let delta=end-start;while(delta>Math.PI)delta-=2*Math.PI;while(delta< -Math.PI)delta+=2*Math.PI;const x=v.x+r*Math.cos(start),y=v.y+r*Math.sin(start),xx=v.x+r*Math.cos(start+delta),yy=v.y+r*Math.sin(start+delta);return`M${v.x} ${v.y}L${x} ${y}A${r} ${r} 0 0 ${delta>0?1:0} ${xx} ${yy}Z`;};return<svg className="pd10075-mini" viewBox="0 0 180 125" aria-label={cross?'Diagonals meeting at a non-right angle':'Unequal bisecting diagonals'}><path className="shape" d={`M${p.a.x} ${p.a.y}L${p.b.x} ${p.b.y}L${p.c.x} ${p.c.y}L${p.d.x} ${p.d.y}Z`}/>{proof&&<><path className="angle-purple" d={sector(p.b,p.a,o,13)}/><path className="angle-purple" d={sector(p.d,p.c,o,13)}/><path className="angle-blue" d={sector(p.a,p.b,o,13)}/><path className="angle-blue" d={sector(p.c,p.d,o,13)}/><path className="angle-green" d={sector(o,p.a,p.b,10)}/><path className="angle-green" d={sector(o,p.c,p.d,10)}/></>}<line className="diag" x1={p.a.x} y1={p.a.y} x2={p.c.x} y2={p.c.y}/><line className="diag green" x1={p.b.x} y1={p.b.y} x2={p.d.x} y2={p.d.y}/>{Object.entries(p).map(([k,v])=><g key={k}><circle className="mini-point" cx={v.x} cy={v.y} r="2.5"/><text x={v.x+3} y={v.y+(k==='a'||k==='b'?-5:13)}>{k.toUpperCase()}</text></g>)}<circle className="mini-origin" cx={o.x} cy={o.y} r="3"/><text x="95" y="61">O</text><text className="mini-caption" x="90" y="122" textAnchor="middle">{proof?'Equal corresponding angles':cross?`Acute angle ≈ ${m.acuteAngle!.toFixed(1)}°`:'AC = 12, BD = 10'}</text></svg>;}
function Why() {
  return (
    <article id="pd10075-learn">
      <h2>WHY IT WORKS</h2>
      <p>
        Opposite sides are parallel. When diagonals intersect, alternate
        interior angles and opposite sides AB = CD give ASA congruence for triangles AOB and COD.
      </p>
      <Mini proof/><div className="pd10075-angle-legend"><span>∠ABO = ∠CDO</span><span>∠BAO = ∠DCO</span><span>∠AOB = ∠COD (vertical)</span></div>
      <p>
        Corresponding parts of congruent triangles are equal, including the
        segments on the diagonals.
      </p>
    </article>
  );
}
function Worked() {
  return (
    <article id="pd10075-example">
      <h2>WORKED EXAMPLE</h2>
      <p>If AC = 12 and BD = 10, what are the lengths of the four segments?</p>
      <MathExpression value={String.raw`AO=OC=\frac12AC=\frac12(12)=6`}/>
      <MathExpression value={String.raw`BO=OD=\frac12BD=\frac12(10)=5`}/>
      <footer>Answer: AO = OC = 6 and BO = OD = 5.</footer>
    </article>
  );
}
function Mistake() {
  return (
    <article className="pd10075-mistake">
      <h2>
        <TriangleAlert /> COMMON MISCONCEPTION
      </h2>
      <p>
        The diagonals do not generally have equal total lengths and do not meet
        at right angles.
      </p>
      <div>
        <section>
          <b>Not necessarily equal</b>
          <Mini />
          <span>AC ≠ BD ×</span>
        </section>
        <section>
          <b>Not necessarily perpendicular</b>
          <Mini cross />
          <span>×</span>
        </section>
      </div>
      <p>Only special cases have equal or perpendicular diagonals.</p>
    </article>
  );
}
function Challenge({
  choices,
  setChoices,
}: {
  choices: string[];
  setChoices: (x: string[]) => void;
}) {
  const rows = ["AO = OC", "BO = OD", "AC = BD", "Diagonals are perpendicular"];
  return (
    <article id="pd10075-practice" className="pd10075-challenge">
      <h2>🏆 PRACTICE CHALLENGE</h2>
      <p>Drag vertex B to change the shape. Which properties remain true?</p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Always True</th>
            <th>Sometimes True</th>
            <th>Never True</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((x, i) => (
            <tr key={x}>
              <td>{x}</td>
              {["always", "sometimes", "never"].map((v) => (
                <td key={v}>
                  <input
                    type="radio"
                    name={`pd-row-${i}`}
                    aria-label={`${x}: ${v}`}
                    aria-invalid={choices[i]===v&&choices[i]!==answers[i]} checked={choices[i] === v}
                    onChange={() => {
                      const n = [...choices];
                      n[i] = v;
                      setChoices(n);
                    }}
                  />
                  {choices[i]===v&&(choices[i]===answers[i]?<Check/>:<span className="wrong-choice">×</span>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer role="status">{choices.filter((v,i)=>v===answers[i]).length}/4 correct. The halves are always equal. Equal diagonals occur in rectangles; perpendicular diagonals occur in rhombi. A square has both, so the last two properties are sometimes true.</footer>
    </article>
  );
}
