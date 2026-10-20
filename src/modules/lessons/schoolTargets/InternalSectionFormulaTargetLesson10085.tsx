import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import {
  type PointerEvent,
  type RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InternalSectionFormulaTargetLesson10085.css";
import MathExpression from "../../../components/ui/MathExpression";
import {internalSectionModel,internalProjection} from "./internalSectionModel";

type Point = { x: number; y: number };
type Endpoint = "a" | "b";
const START = { a: { x: 0, y: 0 }, b: { x: 10, y: 5 }, m: 2, n: 3 };
const CHALLENGE = { a: { x: 0, y: 0 }, b: { x: 8, y: 4 }, p: { x: 6, y: 3 } };
const sectionPoint=(a:Point,b:Point,m:number,n:number)=>internalSectionModel(a,b,m,n).p;
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
const fmt=(n:number)=>n===0?'0':Math.abs(n)<.0001?n.toExponential(5):String(+n.toFixed(6));
function SectionField({value,label,min,max,onValue}:{value:number;label:string;min:number;max:number;onValue:(v:number)=>void}){
 const[draft,setDraft]=useState<string|null>(null),[bad,setBad]=useState(false);const commit=()=>{if(draft===null)return;const n=Number(draft);if(!draft.trim()||!Number.isFinite(n)||n<min||n>max){setBad(true);return;}onValue(n);setDraft(null);setBad(false);};
 return <span className="isf10085-field"><input type="number" step="any" min={min} max={max} aria-label={label} aria-invalid={bad} title={String(value)} value={draft??fmt(value)} onChange={e=>{setDraft(e.target.value);setBad(false);}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')commit();if(e.key==='Escape'){setDraft(null);setBad(false);}}}/>{bad&&<small>Enter {min} to {max}</small>}</span>;
}

export default function InternalSectionFormulaTargetLesson10085({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [model, setModel] = useState(START);
  const [challenge, setChallenge] = useState(CHALLENGE);
  const [dragging, setDragging] = useState<"main-p" | "challenge-p" | null>(
    null,
  );
  const [tab, setTab] = useState(0);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const mainRef = useRef<SVGSVGElement>(null);
  const challengeRef = useRef<SVGSVGElement>(null);
  const p = useMemo(
    () => sectionPoint(model.a, model.b, model.m, model.n),
    [model],
  );
  const ap = distance(model.a, p);
  const pb = distance(p, model.b);
  const defined=model.a.x!==model.b.x||model.a.y!==model.b.y;
  const ratio = defined ? ap/pb : null;
  const position=model.m/(model.m+model.n);
  const expectedChallenge = sectionPoint(challenge.a, challenge.b, 3, 1);
  const challengeCorrect =
    Math.abs(challenge.p.x - expectedChallenge.x) < 1e-6 &&
    Math.abs(challenge.p.y - expectedChallenge.y) < 1e-6;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const svgPoint = (event:PointerEvent<SVGSVGElement>,svg:SVGSVGElement|null,scale=34,top=8)=>{const matrix=svg?.getScreenCTM();if(!matrix)return null;const q=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());return {x:q.x/scale-1,y:top-q.y/scale};};
  const setEndpoint = (key: Endpoint, axis: keyof Point, value: number) =>
    act(() =>
      setModel((current) => ({
        ...current,
        [key]: { ...current[key], [axis]: value },
      })),
    );
  const moveChallenge = (point:Point) => {const t=internalProjection(challenge.a,challenge.b,point);if(t!==null){setChallenge(current=>({...current,p:sectionPoint(current.a,current.b,t,1-t)}));setChecked(false);}};
  const setPosition=(t:number)=>setModel(current=>({...current,m:t,n:1-t}));
  const navigate=(i:number)=>{setTab(i);document.getElementById(['isf10085-interact','isf10085-learn','isf10085-example','isf10085-formula','isf10085-practice'][i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const reset = () =>
    act(() => {
      setModel(START);
      setChallenge(CHALLENGE);
      setChecked(false);
      setDragging(null);
    });
  const graph = (kind:"main"|"challenge",a:Point,b:Point,point:Point,ref:RefObject<SVGSVGElement>) => {
   const scale=kind==='main'?34:42.5,top=kind==='main'?8:6,x=(v:number)=>(v+1)*scale,y=(v:number)=>(top-v)*scale;
   const moving=(event:PointerEvent<SVGSVGElement>)=>{if(dragging!==`${kind}-p`)return;const q=svgPoint(event,ref.current,scale,top);if(!q)return;if(kind==='challenge')moveChallenge(q);else{const t=internalProjection(a,b,q);if(t!==null)setPosition(t);}};
   return <svg ref={ref} viewBox="-16 -16 508 372" aria-label={kind==='main'?'Internal section coordinate graph':'Ratio challenge coordinate graph'} onPointerMove={moving} onPointerUp={e=>{if(dragging===`${kind}-p`){moving(e);act(()=>setDragging(null));}}} onPointerCancel={()=>setDragging(null)}>
    <defs><marker id={`isf10085-arrow-${kind}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z"/></marker></defs>
    {Array.from({length:kind==='main'?15:12},(_,i)=>i-1).map(i=><g key={i}><line className="grid" x1={x(i)} y1="0" x2={x(i)} y2="340"/>{i>=-2&&i<=top&&<line className="grid" x1="0" y1={y(i)} x2="476" y2={y(i)}/>}</g>)}
    <line className="axis" x1="0" y1={y(0)} x2="476" y2={y(0)} markerEnd={`url(#isf10085-arrow-${kind})`}/><line className="axis" x1={x(0)} y1="340" x2={x(0)} y2="0" markerEnd={`url(#isf10085-arrow-${kind})`}/>
    {Array.from({length:kind==='main'?7:6},(_,i)=>i*2).map(i=><text className="tick" key={i} x={x(i)} y={y(0)+17} textAnchor="middle">{i}</text>)}{Array.from({length:top+2},(_,i)=>i-2).filter(i=>i!==0).map(i=><text className="tick" key={i} x={x(0)-8} y={y(i)+4} textAnchor="end">{i}</text>)}<text className="axis-title" x="470" y={y(0)-8}>x</text><text className="axis-title" x={x(0)+9} y="10">y</text>
    <line className="segment" x1={x(a.x)} y1={y(a.y)} x2={x(b.x)} y2={y(b.y)}/><circle className="endpoint" cx={x(a.x)} cy={y(a.y)} r="5"/><circle className="endpoint b" cx={x(b.x)} cy={y(b.y)} r="5"/>
    <circle className="point" role="slider" aria-valuemin={0} aria-valuemax={1} aria-valuenow={kind==='main'?position:challenge.p.x/8} aria-valuetext={`P (${fmt(point.x)}, ${fmt(point.y)})`} aria-disabled={kind==='main'&&!defined} cx={x(point.x)} cy={y(point.y)} r="7" tabIndex={0} aria-label={`Draggable ${kind} point P`} onPointerDown={e=>{if(kind==='main'&&!defined)return;e.currentTarget.setPointerCapture(e.pointerId);setDragging(`${kind}-p`);}} onKeyDown={e=>{const d=e.key==='ArrowLeft'||e.key==='ArrowDown'?-.05:e.key==='ArrowRight'||e.key==='ArrowUp'?.05:0;if(d){e.preventDefault();e.stopPropagation();if(kind==='main'&&defined)act(()=>setPosition(Math.max(.000001,Math.min(.999999,position+d))));if(kind==='challenge'){const t=Math.max(.000001,Math.min(.999999,challenge.p.x/8+d));act(()=>moveChallenge({x:8*t,y:4*t}));}}}}/>
    {[{key:'a',p:a},{key:'b',p:b},{key:'p',p:point}].filter(o=>kind!=='main'||defined||o.key==='a').map(o=><text key={o.key} className={o.key==='p'?'plabel':o.key==='a'?'alabel':'blabel'} x={x(o.p.x)+(o.p.x>9?-7:7)} y={y(o.p.y)+(o.key==='a'?o.p.y< -1? -12:26:o.key==='p'&&Math.hypot(point.x-b.x,point.y-b.y)<1?(o.p.y< -1?-38:o.p.y>7.5?46:36):o.p.y>7.5?20:-12)} textAnchor={o.p.x>9?'end':'start'}>{kind==='main'&&!defined?'A = B = P':o.key.toUpperCase()} ({fmt(o.p.x)}, {fmt(o.p.y)})</text>)}
   </svg>;
  };

  return (
    <section
      className="isf10085-page"
      data-testid="school-mockup-0759"
      data-object-model="dedicated-internal-section-weighted-ratio-engine"
      data-point={`${p.x},${p.y}`}
      data-ratio={`${model.m}:${model.n}`}
      data-distances={`${ap},${pb}`}
      data-ratio-match={String(defined)}
      data-a={`${model.a.x},${model.a.y}`} data-b={`${model.b.x},${model.b.y}`} data-position={position} data-checked={String(checked)} data-defined={String(defined)}
      data-challenge-point={`${challenge.p.x},${challenge.p.y}`}
      data-challenge-correct={String(challengeCorrect)}
      data-actions={actions}
    >
      <div className="isf10085-hero" role="banner">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Internal Section Formula</h1>
        <p>
          Find the coordinates of a point that divides a segment internally in a
          given ratio.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
        </div>
      <Link to="/lessons?category=school"><ArrowLeft/>School lessons</Link></div>
      <div className="isf10085-tabs" role="group" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              aria-pressed={tab===index}
              onClick={() => act(() => navigate(index))}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <main>
        <section id="isf10085-interact" className="isf10085-explore">
          <h2>INTERACTIVE EXPLORATION</h2>
          <p>Drag point P or adjust the ratio to see live updates.</p>
          <div className="isf10085-workspace">
            <aside>
              <section>
                <h3>1. Set endpoints</h3>
                {(["a", "b"] as Endpoint[]).map((key) => (
                  <div className="inputs" key={key}>
                    <b>{key.toUpperCase()} (x, y)</b>
                    <SectionField label={`${key.toUpperCase()} x`} value={model[key].x} min={-1} max={12} onValue={v=>setEndpoint(key,'x',v)}/><SectionField label={`${key.toUpperCase()} y`} value={model[key].y} min={-2} max={8} onValue={v=>setEndpoint(key,'y',v)}/>
                  </div>
                ))}
              </section>
              <section>
                <h3>2. Internal ratio AP : PB = m : n</h3>
                <div className="ratio">
                  <label>
                    m
                    <SectionField label="Ratio m" value={model.m} min={.000001} max={1000000} onValue={v=>act(()=>setModel(c=>({...c,m:v})))}/>
                  </label>
                  <b>:</b>
                  <label>
                    n
                    <SectionField label="Ratio n" value={model.n} min={.000001} max={1000000} onValue={v=>act(()=>setModel(c=>({...c,n:v})))}/>
                  </label>
                </div>
                <input aria-label="Ratio position" type="range" min="0.000001" max="0.999999" step="0.000001" value={position} disabled={!defined} onChange={e=>act(()=>setPosition(+e.target.value))}/>
                <strong>
                  AP : PB = {fmt(model.m)} : {fmt(model.n)}
                </strong>
              </section>
              <section>
                <h3>3. Point P (draggable)</h3>
                <div className="inputs">
                  <b>P (x, y)</b>
                  <input
                    readOnly
                    title={fmt(p.x)} value={`${p.x!==Number(p.x.toFixed(2))?"≈":""}${p.x.toFixed(2)}`}
                    aria-label="Point P x"
                  />
                  <input
                    readOnly
                    title={fmt(p.y)} value={`${p.y!==Number(p.y.toFixed(2))?"≈":""}${p.y.toFixed(2)}`}
                    aria-label="Point P y"
                  />
                </div>
                <small>Drag the purple point on the graph.</small>
              </section>
            </aside>
            <article>{graph("main", model.a, model.b, p, mainRef)}</article>
          </div>
          <section className="isf10085-results">
            <h3>4. Live results</h3>
            <div>
              <article>
                <h4>Weighted-average balance</h4>
                <p>P balances weight n at A and weight m at B.</p>
                <svg className="isf10085-balance" viewBox="0 0 500 230" aria-label="Weighted average balance diagram" data-fulcrum={80+340*position}><rect className="weight-a" x="15" y="24" width="130" height="60" rx="7"/><rect className="weight-b" x="355" y="24" width="130" height="60" rx="7"/><text x="80" y="47" textAnchor="middle">A ({fmt(model.a.x)}, {fmt(model.a.y)})</text><text style={{fontSize:fmt(model.n).length>7?11:14}} x="80" y="70" textAnchor="middle">weight n = {fmt(model.n)}</text><text x="420" y="47" textAnchor="middle">B ({fmt(model.b.x)}, {fmt(model.b.y)})</text><text style={{fontSize:fmt(model.m).length>7?11:14}} x="420" y="70" textAnchor="middle">weight m = {fmt(model.m)}</text><path className="beam" d="M40 92H460M80 92V111H420V92"/><path className="fulcrum" d={`M${80+340*position} 108L${60+340*position} 145H${100+340*position}Z`}/><circle className="pivot" cx={80+340*position} cy="108" r="10"/><rect className="balance-result" x={Math.max(15,Math.min(285,80+340*position-100))} y="157" width="200" height="60" rx="8"/><text className="plabel" x={Math.max(115,Math.min(385,80+340*position))} y="182" textAnchor="middle">P ({fmt(p.x)}, {fmt(p.y)})</text><text className="balance-state" x={Math.max(115,Math.min(385,80+340*position))} y="204" textAnchor="middle">{defined?'✓ balanced':'A = B: ratio undefined'}</text></svg>
              </article>
              <article>
                <h4>AP : PB verification</h4>
                <p>
                  AP = <b>{ap!==0&&ap<.005?fmt(ap):ap.toFixed(2)}</b> &nbsp;&nbsp; PB = <b>{pb!==0&&pb<.005?fmt(pb):pb.toFixed(2)}</b>
                </p>
                <strong>
                  {defined?`AP : PB ≈ ${fmt(ratio!)} : 1 = ${fmt(model.m)} : ${fmt(model.n)}`:"A and B coincide: AP : PB = 0 : 0, undefined."}
                </strong>
                <em>
                  {defined&&<CheckCircle2/>} {defined?"Matches the ratio":"Move A and B apart to define a division ratio."}
                </em>
              </article>
            </div>
          </section>
        </section>
        <section className="isf10085-cards">
          <article id="isf10085-learn">
            <h2>WHY IT WORKS</h2>
            <p>
              If P divides AB internally in ratio m:n, then P is the weighted
              average of A and B with weights n and m:
            </p>
            <MathExpression value={String.raw`P=\frac{nA+mB}{m+n}`}/>
            <p>This keeps P closer to the point with the larger weight.</p>
          </article>
          <article id="isf10085-formula">
            <h2>INTERNAL SECTION FORMULA</h2>
            <p>If A(x₁,y₁), B(x₂,y₂), and AP:PB=m:n, then</p>
            <MathExpression value={String.raw`P\left(\frac{mx_2+nx_1}{m+n},\frac{my_2+ny_1}{m+n}\right)`}/>
          </article>
          <article className="mistake">
            <h2>COMMON MISTAKE</h2>
            <p>
              Using the same ratio as the weight on an endpoint is incorrect.
            </p>
            <p>Use the opposite segment ratio as the weight.</p>
            <strong>weight of A = n, weight of B = m</strong>
          </article>
        </section>
        <section id="isf10085-example" className="isf10085-example">
          <h2>WORKED EXAMPLE</h2>
          <p>
            Find P that divides AB internally in the ratio 2:3, where A(0,0) and
            B(10,5).
          </p>
          <svg className="isf10085-example-line" viewBox="0 0 440 140" aria-label="Worked example two to three parts"><rect className="example-bg" x="4" y="4" width="432" height="132" rx="8"/><line className="example-segment" x1="40" y1="60" x2="400" y2="60"/>{[{x:40,k:'a',label:'A(0,0)'},{x:184,k:'p',label:'P'},{x:400,k:'b',label:'B(10,5)'}].map(o=><g key={o.k}><circle className={o.k==='p'?'point':'endpoint'} cx={o.x} cy="60" r="5"/><text x={o.x} y="35" textAnchor={o.k==='a'?'start':o.k==='b'?'end':'middle'}>{o.label}</text></g>)}<path className="bracket" d="M40 75V85H184V75M184 75V85H400V75"/><text x="112" y="112" textAnchor="middle">2 parts</text><text x="292" y="112" textAnchor="middle">3 parts</text></svg>
          <article>
            <p>Here, m=2, n=3.</p>
            <MathExpression value={String.raw`P\left(\frac{2(10)+3(0)}{2+3},\frac{2(5)+3(0)}{2+3}\right)`}/><MathExpression value={String.raw`=P\left(\frac{20}5,\frac{10}5\right)=(4,2)`}/>
            <em>Thus, P is at (4, 2). ✓</em>
          </article>
        </section>
        <section id="isf10085-practice" className="isf10085-challenge">
          <aside>
            <h2>YOUR CHALLENGE</h2>
            <p>Place point P to divide AB internally in the ratio 3:1.</p>
            <strong>A(0,0), B(8,4)</strong>
            <button onClick={() => act(() => setChecked(true))}>
              Check my answer
            </button>
          </aside>
          {graph(
            "challenge",
            challenge.a,
            challenge.b,
            challenge.p,
            challengeRef,
          )}
          <article>
            <p>Target ratio: AP : PB = 3 : 1</p>
            <p>Expected coordinates of P:</p><MathExpression value={String.raw`\left(\frac{3(8)+1(0)}{3+1},\frac{3(4)+1(0)}{3+1}\right)=(6,3)`}/>
            <em role="status" aria-live="polite" className={checked && challengeCorrect ? "yes" : ""}>
              {checked
                ? challengeCorrect
                  ? "P is nearer to B. Correct ✓"
                  : "Move P to (6, 3)."
                : "Drag P, then check your answer."}
            </em>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </article>
        </section>
      </main>
      <div className="isf10085-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-midpoint-formula">
          <ArrowLeft /> Midpoint Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-external-section-formula">
          External Section Formula <ArrowRight />
        </Link>
      </div>
      <footer className="isf10085-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
