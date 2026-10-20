import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  MousePointer2,
  RefreshCcw,
  RotateCcw,
  Trophy,
  TriangleAlert,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParallelogramSidesTargetLesson10073.css";
import MathExpression from '../../../components/ui/MathExpression';
import{parallelogramSides10073,psStart10073,psMove10073,psArc10073,psRandom10073,psProof10073}from'./parallelogramSidesModel10073';

type Point = { x: number; y: number };
type Vertex = "a" | "b" | "c" | "d";
type Diagonal = "AC" | "BD";
type Tool = "select" | "pan" | "fit";

const START=psStart10073;
const correctReasons = [
  "Definition of parallelogram",
  "Alternate interior angles",
  "Alternate interior angles",
  "Reflexive property",
  "ASA congruence",
  "CPCTC",
  "CPCTC",
];
export default function ParallelogramSidesTargetLesson10073({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START);
  const [diagonal, setDiagonal] = useState<Diagonal>("AC");
  const [split, setSplit] = useState(true);
  const [angles, setAngles] = useState(true);
  const [ticks, setTicks] = useState(true);
  const [labels, setLabels] = useState(true);
  const [tool, setTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(100);
  const [tab, setTab] = useState(0);
  const [pan,setPan]=useState({x:0,y:0});
  const [reasons, setReasons] = useState(correctReasons);
  const [revealed, setRevealed] = useState(true);
  const [actions, setActions] = useState(0);
  const svgRef=useRef<SVGSVGElement>(null),plotRef=useRef<SVGGElement>(null),seed=useRef(0),gesture=useRef<{key:Vertex|'pan';points:typeof START;pan:Point;local:Point;client:Point;moved:boolean}|null>(null);
  const m=useMemo(()=>parallelogramSides10073(points,diagonal),[points,diagonal]),{c}=m.points,sides=m.sides,proofSteps=psProof10073(diagonal);
  const score = reasons.filter(
    (reason, i) => reason === correctReasons[i],
  ).length;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setPoints(START);
      setDiagonal("AC");
      setSplit(true);
      setAngles(true);
      setTicks(true);
      setLabels(true);
      setTool("select");
      setZoom(100);setPan({x:0,y:0});gesture.current=null;
    });
  const randomize=()=>act(()=>{setPoints(psRandom10073(++seed.current));setPan({x:0,y:0});});
  const updatePoint=(key:Vertex,next:Point)=>setPoints(old=>psMove10073(old,key,next));
  const local=(ev:PointerEvent<SVGSVGElement>,plot=true)=>{const matrix=(plot?plotRef.current:svgRef.current)?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(matrix.inverse());return{x:p.x,y:p.y};};
  const moveKeyboard=(key:Vertex,dx:number,dy:number)=>{if(tool!=='select')return;const p=key==='c'?c:points[key];act(()=>updatePoint(key,{x:p.x+dx,y:p.y+dy}));};
  const move=(ev:PointerEvent<SVGSVGElement>)=>{const g=gesture.current;if(!g)return;if(Math.hypot(ev.clientX-g.client.x,ev.clientY-g.client.y)>.5)g.moved=true;if(!g.moved)return;if(g.key==='pan'){const p=local(ev,false);if(p)setPan({x:Math.max(-220,Math.min(220,g.pan.x+p.x-g.local.x)),y:Math.max(-160,Math.min(160,g.pan.y+p.y-g.local.y))});}else if(tool==='select'){const p=local(ev);if(p)updatePoint(g.key,p);}};
  const finish=(ev:PointerEvent<SVGSVGElement>)=>{if(!gesture.current)return;move(ev);gesture.current=null;setActions(n=>n+1);};
  return (
    <section
      className="ps10073-page"
      data-testid="school-mockup-0747"
      data-object-model="dedicated-constrained-parallelogram-congruence-proof-engine"
      data-points={`${points.a.x},${points.a.y};${points.b.x},${points.b.y};${c.x},${c.y};${points.d.x},${points.d.y}`}
      data-sides={sides.join(",")}
      data-opposite-equal={String(m.congruent)} data-valid={String(m.valid)} data-pan={`${pan.x},${pan.y}`} data-area={m.area}
      data-diagonal={diagonal}
      data-overlays={`${Number(split)},${Number(angles)},${Number(ticks)}`}
      data-tool={tool}
      data-zoom={zoom}
      data-score={`${score}/7`}
      data-revealed={String(revealed)}
      data-actions={actions}
    >
      <div role="banner" className="ps10073-hero"><Link className="ps10073-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · QUADRILATERAL PROOFS</small>
        <h1>Parallelogram Opposite Sides</h1>
        <p>
          Prove that opposite sides of a parallelogram are equal using diagonal
          properties and triangle congruence.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>learning</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="ps10073-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (name, i) => (
            <button
              key={name}
              className={tab === i ? "active" : ""}
              aria-pressed={tab === i}
              onClick={() => act(() => {setTab(i);document.getElementById(["ps10073-interact","ps10073-learn","ps10073-example","ps10073-formula","ps10073-practice"][i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
            >
              {name}
            </button>
          ),
        )}
      </div>
      <main>
        <section id="ps10073-interact" className="ps10073-lab">
          <aside className="ps10073-controls">
            <section>
              <h2>1. Build the parallelogram</h2>
              <p>Drag any vertex to reshape.</p>
              <p>The shape remains a parallelogram.</p>
              <button onClick={reset}>
                <RotateCcw /> Reset shape
              </button>
              <button onClick={randomize}>
                <RefreshCcw /> Randomize
              </button>
            </section>
            <section>
              <h2>2. Add a diagonal</h2>
              <p>Select the diagonal to draw.</p>
              <div>
                <button
                  aria-label="Use diagonal AC" aria-pressed={diagonal==="AC"}
                  className={diagonal === "AC" ? "active" : ""}
                  onClick={() => act(() => setDiagonal("AC"))}
                >
                  ╱ AC
                </button>
                <button
                  aria-label="Use diagonal BD" aria-pressed={diagonal==="BD"}
                  className={diagonal === "BD" ? "active" : ""}
                  onClick={() => act(() => setDiagonal("BD"))}
                >
                  ╱ BD
                </button>
              </div>
            </section>
            <section>
              <h2>3. Show overlays</h2>
              <Toggle
                label="Split into triangles"
                value={split}
                onChange={() => act(() => setSplit(!split))}
              />
              <Toggle
                label="Corresponding angles"
                value={angles}
                onChange={() => act(() => setAngles(!angles))}
              />
              <Toggle
                label="Side tick marks"
                value={ticks}
                onChange={() => act(() => setTicks(!ticks))}
              />
            </section>
            <section className={`feedback ${m.valid?"":"invalid"}`}>
              <h2>
                <Check /> Live feedback
              </h2>
              <p>{m.valid?`Great! Triangles ${m.labels[0]} and ${m.labels[1]} are congruent.`:"Degenerate figure: reshape the vertices to form proper triangles."}</p>
              <strong>{m.valid?"Therefore AB = CD and BC = AD.":"The triangle congruence proof requires non-collinear vertices."}</strong>
            </section>
          </aside>
          <article className="ps10073-canvas">
            <header>
              <div>
                <h2>Parallelogram ABCD</h2>
                <p>Drag points to explore. Properties update automatically.</p>
              </div>
              <button aria-pressed={labels} onClick={() => act(() => setLabels(!labels))}>
                <Eye /> {labels ? "Hide labels" : "Show labels"}
              </button>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 560 410"
              aria-label="Draggable parallelogram ABCD"
              tabIndex={0}
              onPointerDown={ev=>{if(tool!=='pan')return;const p=local(ev,false);if(!p)return;ev.currentTarget.setPointerCapture(ev.pointerId);gesture.current={key:'pan',points,pan,local:p,client:{x:ev.clientX,y:ev.clientY},moved:false};}}
              onPointerMove={move} onPointerUp={finish}
              onPointerCancel={()=>{if(gesture.current){setPoints(gesture.current.points);setPan(gesture.current.pan);}gesture.current=null;}}
              onKeyDown={ev=>{if(tool!=='pan'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?40:20;act(()=>setPan(old=>({x:Math.max(-220,Math.min(220,old.x+(ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0))),y:Math.max(-160,Math.min(160,old.y+(ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0)))})));}}
            >
              <defs><linearGradient id="ps10073-blue"><stop stopColor="#d8f0ff"/><stop offset="1" stopColor="#b8dfff"/></linearGradient><linearGradient id="ps10073-purple"><stop stopColor="#eee6fc"/><stop offset="1" stopColor="#e5d6fb"/></linearGradient></defs><g ref={plotRef} transform={`translate(${pan.x} ${pan.y}) translate(280 205) scale(${zoom/100}) translate(-280 -205)`}>
              {split && diagonal === "AC" && (
                <>
                  <path
                    className="fill-one"
                    d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${c.x} ${c.y}Z`}
                  />
                  <path
                    className="fill-two"
                    d={`M${points.a.x} ${points.a.y}L${c.x} ${c.y}L${points.d.x} ${points.d.y}Z`}
                  />
                </>
              )}
              {split && diagonal === "BD" && (
                <>
                  <path
                    className="fill-one"
                    d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${points.d.x} ${points.d.y}Z`}
                  />
                  <path
                    className="fill-two"
                    d={`M${points.b.x} ${points.b.y}L${c.x} ${c.y}L${points.d.x} ${points.d.y}Z`}
                  />
                </>
              )}
              <path
                className="outline"
                d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${c.x} ${c.y}L${points.d.x} ${points.d.y}Z`}
              />
              <line
                className="diagonal"
                x1={diagonal === "AC" ? points.a.x : points.b.x}
                y1={diagonal === "AC" ? points.a.y : points.b.y}
                x2={diagonal === "AC" ? c.x : points.d.x}
                y2={diagonal === "AC" ? c.y : points.d.y}
              />
              {ticks && m.valid && (
                <TickMarks a={points.a} b={points.b} c={c} d={points.d} />
              )}
              {angles&&m.valid&&<AngleMarks a={points.a} b={points.b} c={c} d={points.d} diagonal={diagonal}/>}
              {labels && (
                <>
                  <text x={points.a.x - 24} y={points.a.y - 12}>
                    A
                  </text>
                  <text x={points.b.x + 8} y={points.b.y - 12}>
                    B
                  </text>
                  <text x={c.x + 8} y={c.y + 24}>
                    C
                  </text>
                  <text x={points.d.x - 24} y={points.d.y + 24}>
                    D
                  </text>
                  <text
                    x={m.triangles[0].reduce((v,p)=>v+p.x,0)/3}
                    y={m.triangles[0].reduce((v,p)=>v+p.y,0)/3}
                  >
                    △{m.labels[0]}
                  </text>
                  <text
                    x={m.triangles[1].reduce((v,p)=>v+p.x,0)/3}
                    y={m.triangles[1].reduce((v,p)=>v+p.y,0)/3}
                  >
                    △{m.labels[1]}
                  </text>
                </>
              )}
              {(["a", "b", "c", "d"] as Vertex[]).map((key) => (
                <circle
                  key={key}
                  className="handle"
                  cx={(key==='c'?c:points[key]).x}
                  cy={(key==='c'?c:points[key]).y}
                  r="8"
                  tabIndex={0}
                  aria-label={`Draggable vertex ${key.toUpperCase()}`}
                  role="slider" aria-valuemin={40} aria-valuemax={500} aria-valuenow={(key==='c'?c:points[key]).x} aria-valuetext={`x ${(key==='c'?c:points[key]).x}, y ${(key==='c'?c:points[key]).y}`} aria-disabled={tool!=='select'}
                  onPointerDown={ev=>{if(tool!=='select')return;ev.currentTarget.setPointerCapture(ev.pointerId);const p=local(ev as unknown as PointerEvent<SVGSVGElement>);gesture.current={key,points,pan,local:p??{x:0,y:0},client:{x:ev.clientX,y:ev.clientY},moved:false};}}
                  onKeyDown={ev=>{if(tool!=='select'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(ev.key))return;ev.preventDefault();const n=ev.shiftKey?10:4;moveKeyboard(key,ev.key==='ArrowLeft'?-n:ev.key==='ArrowRight'?n:0,ev.key==='ArrowUp'?-n:ev.key==='ArrowDown'?n:0);}}
                />
              ))}
              </g>
              <text className="caption" x="280" y="396">
                {m.valid?`Diagonal ${diagonal} divides ABCD into triangles ${m.labels[0]} and ${m.labels[1]}.`:"Degenerate figure: form a non-collinear parallelogram."}
              </text>
            </svg>
            <footer>
              <div>
                <button
                  className={tool === "select" ? "active" : ""}
                  aria-label="Select tool" aria-pressed={tool==="select"}
                  onClick={() => act(() => setTool("select"))}
                >
                  <MousePointer2 />
                </button>
                <button
                  className={tool === "pan" ? "active" : ""}
                  aria-label="Pan tool" aria-pressed={tool==="pan"}
                  onClick={() => act(() => setTool("pan"))}
                >
                  <Hand />
                </button>
                <button
                  aria-label="Fit view"
                  onClick={() =>
                    act(() => {
                      setTool("select");
                      setZoom(100);setPan({x:0,y:0});
                    })
                  }
                >
                  <Maximize2 />
                </button>
              </div>
              <div>
                <button
                  aria-label="Zoom out" disabled={zoom<=80}
                  onClick={() => act(() => setZoom(Math.max(80, zoom - 10)))}
                >
                  <ZoomOut />
                </button>
                <b>{zoom}%</b>
                <button
                  aria-label="Zoom in" disabled={zoom>=120}
                  onClick={() => act(() => setZoom(Math.min(120, zoom + 10)))}
                >
                  <ZoomIn />
                </button>
              </div>
            </footer>
          </article>
        </section>
        <WhyItWorks />
        <section className="ps10073-lower">
          <WorkedExample />
          <Misconception />
          <article id="ps10073-practice" className="ps10073-challenge">
            <h2>
              <Trophy /> CHALLENGE
            </h2>
            <p>Complete the proof and reveal the conclusions.</p>
            <p>
              <b>Given:</b> ABCD is a parallelogram.
              <br />
              <b>Prove:</b> AB = CD and BC = AD.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {proofSteps.map((step, i) => (
                  <tr key={step}>
                    <td>
                      <b>{i + 1}</b> <MathExpression value={step.replace(/∥/g,'\\parallel ').replace(/∠/g,'\\angle ').replace(/△/g,'\\triangle ').replace(/≅/g,'\\cong ').replace(/ and /g,'\\text{ and }')}/>
                    </td>
                    <td>
                      <select
                        aria-label={`Proof reason ${i + 1}`}
                        value={reasons[i]}
                        onChange={(event) =>
                          act(() => {
                            const next = [...reasons];
                            next[i] = event.target.value;
                            setReasons(next);
                            setRevealed(false);
                          })
                        }
                      >
                        <option>Choose reason</option>
                        {[...new Set(correctReasons)].map((reason) => (
                          <option key={reason}>{reason}</option>
                        ))}
                      </select>
                      {reasons[i] === correctReasons[i] ? (
                        <Check />
                      ) : (
                        <TriangleAlert />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => act(() => setRevealed(true))}>
              Reveal conclusions
            </button>
            {revealed && (
              <footer className={score === 7 ? "correct" : "incorrect"}>
                {score===7?<Check/>:<TriangleAlert/>}
                <b>
                  {score === 7
                    ? "Well done! Opposite sides of a parallelogram are equal."
                    : `${score} of 7 reasons are correct. Keep checking the proof.`}
                </b>
              </footer>
            )}
          </article>
        </section>
      </main>
      <div className="ps10073-nav">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-triangle-inequality">
          <ArrowLeft /> Triangle Inequality
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-angles">
          Parallelogram Opposite Angles <ArrowRight />
        </Link>
      </div><footer className="ps10073-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <label>
      {label}
      <button
        role="switch" aria-label={label}
        aria-checked={value}
        className={value ? "on" : ""}
        onClick={onChange}
      >
        <i />
      </button>
    </label>
  );
}

function TickMarks({a,b,c,d}:{a:Point;b:Point;c:Point;d:Point}){const mark=(p:Point,q:Point,count:number)=>{const dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy);if(l<10)return'';return Array.from({length:count},(_,i)=>{const x=(p.x+q.x)/2+dx/l*(i-(count-1)/2)*7,y=(p.y+q.y)/2+dy/l*(i-(count-1)/2)*7;return`M${x-dy/l*8} ${y+dx/l*8}L${x+dy/l*8} ${y-dx/l*8}`;}).join('');};return<g className="ticks"><path d={mark(a,b,2)+mark(c,d,2)}/><path d={mark(a,d,1)+mark(b,c,1)}/></g>;}
function AngleMarks({a,b,c,d,diagonal='AC',radius=34}:{a:Point;b:Point;c:Point;d:Point;diagonal?:Diagonal;radius?:number}){const pairs=diagonal==='AC'?[[a,b,c],[c,d,a],[a,c,d],[c,a,b]]:[[b,a,d],[d,c,b],[d,a,b],[b,c,d]];return<g className="angles">{pairs.flatMap(([v,p,q],i)=>[radius,radius+5].map(r=>{const path=psArc10073(v,p,q,r);return path?<path key={i+'-'+r} className={i<2?'green':'orange'} d={path}/>:null;}))}</g>;}
function MiniParallelogram({stage,bad=false}:{stage:number;bad?:boolean}){const a={x:28,y:13},b={x:121,y:13},c={x:109,y:69},d={x:16,y:69};return<svg className={`ps10073-mini ${bad?'bad-mini':''}`} viewBox="0 0 140 88" aria-label={bad?'Adjacent-side equality is not guaranteed':`Proof illustration stage ${stage}`}><path className="mini-outline" d="M28 13H121L109 69H16Z"/>{stage>=3&&<><path className="mini-blue" d="M28 13H121L109 69Z"/><path className="mini-purple" d="M28 13L109 69H16Z"/></>}<line className="mini-diagonal" x1="28" y1="13" x2="109" y2="69"/>{stage>=2&&<AngleMarks a={a} b={b} c={c} d={d} radius={11}/>} {stage>=4&&<TickMarks a={a} b={b} c={c} d={d}/>} {bad&&<path className="bad-adjacent" d="M28 13H121L109 69"/>}{Object.entries({a,b,c,d}).map(([k,p])=><text className="mini-letter" key={k} x={p.x+(k==='a'||k==='d'?-7:3)} y={p.y+(k==='a'||k==='b'?-4:12)}>{k.toUpperCase()}</text>)}</svg>;}
function WhyItWorks() {
  const labels = [
    "Draw diagonal AC.",
    "Identify equal angles",
    "ASA → △ABC ≅ △CDA",
    "Opposite sides are equal",
  ];
  return (
    <section id="ps10073-learn" className="ps10073-why">
      <h2>
        <Lightbulb /> WHY IT WORKS
      </h2>
      <p>
        A diagonal creates two triangles that share one side and have equal
        corresponding angles due to parallel sides. By ASA congruence,
        corresponding sides are equal.
      </p>
      <div>
        {labels.map((label, i) => (
          <span key={label}>
            <MiniParallelogram stage={i + 1} />
            <b>{label}</b>
            {i < 3 && <ArrowRight />}
          </span>
        ))}
      </div>
    </section>
  );
}

function WorkedExample() {
  return (
    <article id="ps10073-example" className="worked">
      <h2>▧ WORKED EXAMPLE</h2>
      <p>
        <b>Given:</b> ABCD is a parallelogram.
        <br />
        <b>Prove:</b> AB = CD and BC = AD.
      </p>
      <MiniParallelogram stage={4} />
      <ol>
        <li>AB ∥ CD and AD ∥ BC (definition).</li>
        <li>∠BAC = ∠DCA and ∠BCA = ∠CAD.</li>
        <li>AC = AC (common side).</li>
        <li>Therefore, △ABC ≅ △CDA (ASA).</li>
        <li>Hence, by CPCTC:</li>
      </ol>
      <footer id="ps10073-formula">
        <b>AB = CD</b>
        <b>BC = AD</b>
      </footer>
    </article>
  );
}

function Misconception() {
  return (
    <article className="mistake">
      <h2>
        <TriangleAlert /> COMMON MISCONCEPTION
      </h2>
      <p>
        Opposite sides are matched across the parallelogram, not next to each
        other.
      </p>
      <section>
        <b>Correct (Opposite sides)</b>
        <MiniParallelogram stage={4} />
        <strong>
          AB = CD ✓
          <br />
          BC = AD ✓
        </strong>
      </section>
      <section className="wrong">
        <b>Not a general rule (Adjacent sides)</b>
        <MiniParallelogram stage={1} bad/>
        <strong>
          AB = BC ×
          <br />
          BC = CD ×
        </strong>
      </section>
      <p>
        <b>Match across the shape. Adjacent sides can be equal in special cases such as rhombi; it is not a general rule.</b>
      </p>
    </article>
  );
}
