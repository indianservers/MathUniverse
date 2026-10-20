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
import "./MidpointFormulaTargetLesson10084.css";
import MathExpression from "../../../components/ui/MathExpression";
import {midpointModel,fixedMidpoint,boundMidpointPoint} from "./midpointModel";
type Point = { x: number; y: number };
type Key = "a" | "b";
const START = { a: { x: -2, y: 4 }, b: { x: 6, y: -2 } },
  CHALLENGE = { a: { x: -1, y: 5 }, b: { x: 5, y: -3 } };
const rr = (n: number, p = 3) => Math.round(n * 10 ** p) / 10 ** p;
const fmt=(n:number)=>n!==0&&Math.abs(n)<.0001?n.toExponential(5):String(+n.toPrecision(12));
const measured=(n:number)=>n!==0&&Math.abs(n)<.0005?n.toExponential(5):n.toFixed(3);
function midpointLabelOffset(key:string,p:Point,pair:{a:Point;b:Point}){
 if(Math.hypot(pair.a.x-pair.b.x,pair.a.y-pair.b.y)<2){if(p.y< -4)return key==='a'?-12:key==='b'?-36:-60;if(p.y>5)return key==='a'?20:key==='b'?44:68;return key==='a'?-20:key==='b'?22:46;}
 return key==='b'?(p.y< -5?-16:26):p.y>6?20:-12;
}
function MidpointField({value,label,axis,onValue}:{value:number;label:string;axis:'x'|'y';onValue:(v:number)=>void}){
 const [draft,setDraft]=useState<string|null>(null),[bad,setBad]=useState(false),min=axis==='x'?-8:-7,max=axis==='x'?8:7;
 const commit=()=>{if(draft===null)return;const n=Number(draft);if(!draft.trim()||!Number.isFinite(n)||n<min||n>max){setBad(true);return;}onValue(n);setDraft(null);setBad(false);};
 return <span className="mf10084-field"><input type="number" min={min} max={max} step="any" aria-label={label} aria-invalid={bad} title={String(value)} value={draft??fmt(value)} onChange={e=>{setDraft(e.target.value);setBad(false);}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')commit();if(e.key==='Escape'){setDraft(null);setBad(false);}}}/>{bad&&<small>Enter {min} to {max}</small>}</span>;
}
function AverageRuler({a,b,axis}:{a:number;b:number;axis:'x'|'y'}){
 const left=Math.min(a,b),right=Math.max(a,b),middle=midpointModel({a:{x:a,y:0},b:{x:b,y:0}}).m.x,first=a<=b?'1':'2',last=a<=b?'2':'1';
 return <svg className={`mf10084-average-ruler ${axis}`} viewBox="0 0 420 115" aria-label={`${axis} coordinate average ruler`} data-min={left} data-max={right} data-average={middle}>{left===right?<><circle className="ruler-mid" cx="210" cy="40" r="18"/><text className={`ruler-value ${fmt(middle).length>5?'is-long':''}`} x="210" y={fmt(middle).length>5?14:45} textAnchor="middle">{fmt(middle)}</text><text x="210" y="82" textAnchor="middle">{axis}₁ = {axis}₂ = {fmt(middle)}</text></>:<><line className="ruler-line" x1="30" y1="40" x2="390" y2="40"/><circle className="ruler-dot" cx="30" cy="40" r="6"/><circle className="ruler-dot" cx="390" cy="40" r="6"/><circle className="ruler-mid" cx="210" cy="40" r="18"/><text className={`ruler-value ${fmt(middle).length>5?'is-long':''}`} x="210" y={fmt(middle).length>5?14:45} textAnchor="middle">{fmt(middle)}</text><text x="30" y="78" textAnchor={fmt(left).length>6?"start":"middle"}>{fmt(left)}</text><text x="390" y="78" textAnchor={fmt(right).length>6?"end":"middle"}>{fmt(right)}</text><text className="ruler-caption" x="30" y="102" textAnchor="middle">{axis}{first==='1'?'₁':'₂'}</text><text className="ruler-caption" x="210" y="102" textAnchor="middle">({axis}₁ + {axis}₂) / 2</text><text className="ruler-caption" x="390" y="102" textAnchor="middle">{axis}{last==='1'?'₁':'₂'}</text></>}</svg>;
}
export default function MidpointFormulaTargetLesson10084({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [challenge, setChallenge] = useState(CHALLENGE),
    [active, setActive] = useState<`${"main" | "challenge"}-${Key}` | null>(
      null,
    ),
    [tab, setTab] = useState(0),
    [actions, setActions] = useState(0);
  const mainSvg = useRef<SVGSVGElement>(null),
    challengeSvg = useRef<SVGSVGElement>(null),
    m = useMemo(() => midpointModel(points), [points]),
    cm = useMemo(() => midpointModel(challenge), [challenge]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    clamp = (p:Point)=>boundMidpointPoint(p);
  const update=(model:'main'|'challenge',key:Key,p:Point)=>model==='main'?setPoints(v=>({...v,[key]:clamp(p)})):setChallenge(v=>({...v,[key]:clamp(p)}));
  const local=(e:PointerEvent<SVGSVGElement>,ref:RefObject<SVGSVGElement>)=>{const matrix=ref.current?.getScreenCTM();if(!matrix)return null;const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());return{x:q.x/30-8,y:7-q.y/30};};
  const fixed=fixedMidpoint(challenge),coincident=cm.coincident;
  const navigate=(i:number)=>{setTab(i);document.getElementById(['mf10084-interact','mf10084-learn','mf10084-example','mf10084-formula','mf10084-practice'][i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const keyMove = (
    model: "main" | "challenge",
    key: Key,
    dx: number,
    dy: number,
  ) => {
    const source = model === "main" ? points : challenge;
    act(() =>
      update(model, key, { x: source[key].x + dx, y: source[key].y + dy }),
    );
  };
  const reset = () =>
      act(() => {
        setPoints(START);
        setChallenge(CHALLENGE);
        setActive(null);
      }),
    sx = (x: number) => (x + 8) * 30,
    sy = (y: number) => (7 - y) * 30;
  const graph = (
    model: "main" | "challenge",
    p: { a: Point; b: Point },
    mid: Point,
    ref: RefObject<SVGSVGElement>,
  ) => (
    <svg
      ref={ref}
      viewBox="-16 -16 512 452"
      aria-label={`${model === "main" ? "Draggable midpoint coordinate plane" : "Draggable fixed-midpoint challenge"}`}
      onPointerMove={(e) => {
        if (!active || !active.startsWith(model)) return;
        const q = local(e, ref);
        if (q) update(model, active.endsWith("a") ? "a" : "b", {x:rr(q.x,1),y:rr(q.y,1)});
      }}
      onPointerUp={e=>{if(active?.startsWith(model)){const q=local(e,ref);if(q)update(model,active.endsWith('a')?'a':'b',{x:rr(q.x,1),y:rr(q.y,1)});act(()=>setActive(null));}}}
      onPointerCancel={()=>setActive(null)}
    >
      <defs><marker id={`mf10084-arrow-${model}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z"/></marker></defs>
      {Array.from({ length: 17 }, (_, i) => (
        <g key={i}>
          <line className="grid" x1={i * 30} y1="0" x2={i * 30} y2="420" />
          <line className="grid" x1="0" y1={i * 30} x2="480" y2={i * 30} />
        </g>
      ))}
      <line className="axis" x1="0" y1={sy(0)} x2="480" y2={sy(0)} markerEnd={`url(#mf10084-arrow-${model})`}/>
      <line className="axis" x1={sx(0)} y1="420" x2={sx(0)} y2="0" markerEnd={`url(#mf10084-arrow-${model})`}/>
      {Array.from({length:9},(_,i)=>i*2-8).map(i=><text className="tick" key={i} x={sx(i)+(i===0?-9:0)} y={sy(0)+18} textAnchor="middle">{i}</text>)}{Array.from({length:7},(_,i)=>i*2-6).filter(i=>i!==0).map(i=><text className="tick" key={i} x={sx(0)-10} y={sy(i)+4} textAnchor="end">{i}</text>)}<text className="axis-title" x="470" y={sy(0)-8}>x</text><text className="axis-title" x={sx(0)+10} y="8">y</text>
      <line
        className="segment"
        x1={sx(p.a.x)}
        y1={sy(p.a.y)}
        x2={sx(p.b.x)}
        y2={sy(p.b.y)}
      />
      <line
        className="half one"
        x1={sx(p.a.x)}
        y1={sy(p.a.y)}
        x2={sx(mid.x)}
        y2={sy(mid.y)}
      />
      <line
        className="half two"
        x1={sx(mid.x)}
        y1={sy(mid.y)}
        x2={sx(p.b.x)}
        y2={sy(p.b.y)}
      />
      {(["a", "b"] as Key[]).map((key) => (
        <circle
          key={key}
          className={key}
          role="slider" aria-valuemin={-8} aria-valuemax={8} aria-valuenow={p[key].x} aria-valuetext={`x ${p[key].x}, y ${p[key].y}`}
          tabIndex={0}
          aria-label={`Draggable ${model} point ${key.toUpperCase()}`}
          cx={sx(p[key].x)}
          cy={sy(p[key].y)}
          r="7"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setActive(`${model}-${key}`);
          }}
          onKeyDown={(e) => {
            const dx=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,dy=e.key==='ArrowUp'?1:e.key==='ArrowDown'?-1:0;
            if(dx||dy){e.preventDefault();e.stopPropagation();keyMove(model,key,dx*(e.shiftKey?.1:1),dy*(e.shiftKey?.1:1));}
          }}
        />
      ))}
      <circle className="mid" cx={sx(mid.x)} cy={sy(mid.y)} r="7" />
      {[{key:'a',p:p.a},{key:'b',p:p.b},{key:'m',p:mid}].filter(o=>p.a.x!==p.b.x||p.a.y!==p.b.y||o.key==='m').map(o=><text key={o.key} className={o.key==='m'?'mlabel':o.key==='b'?'blabel':'alabel'} x={sx(o.p.x)+(o.p.x>4?-8:8)} y={sy(o.p.y)+midpointLabelOffset(o.key,o.p,p)} textAnchor={o.p.x>4?'end':'start'}>{p.a.x===p.b.x&&p.a.y===p.b.y?'A = B = M':o.key.toUpperCase()} ({fmt(o.p.x)}, {fmt(o.p.y)})</text>)}

    </svg>
  );
  return (
    <section
      className="mf10084-page"
      data-testid="school-mockup-0758"
      data-object-model="dedicated-endpoint-average-equal-distance-midpoint-engine"
      data-a={`${points.a.x},${points.a.y}`}
      data-b={`${points.b.x},${points.b.y}`}
      data-midpoint={`${m.m.x},${m.m.y}`}
      data-distances={`${m.am},${m.mb}`}
      data-equal={String(m.equal)}
      data-challenge-a={`${challenge.a.x},${challenge.a.y}`}
      data-challenge-b={`${challenge.b.x},${challenge.b.y}`}
      data-challenge-midpoint={`${cm.m.x},${cm.m.y}`}
      data-challenge-fixed={String(fixed)}
      data-challenge-distances={`${cm.am},${cm.mb}`} data-coincident={String(m.coincident)}
      data-actions={actions}
    >
      <div className="mf10084-hero" role="banner">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Midpoint Formula</h1>
        <p>Locate the point halfway between two coordinate points.</p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      <Link to="/lessons?category=school"><ArrowLeft/>School lessons</Link></div>
      <div className="mf10084-tabs" role="group" aria-label="Lesson sections">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab===i} onClick={() => act(() => navigate(i))}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section id="mf10084-interact" className="mf10084-lab">
          <aside>
            <h2>CONTROL POINTS</h2>
            <p>Drag the endpoints A or B on the grid.</p>
            {(["a", "b"] as Key[]).map((key, i) => (
              <section key={key} className={key}>
                <h3>
                  ● Point {key.toUpperCase()} (x{i + 1}, y{i + 1})
                </h3>
                <label>
                  <MidpointField label={`Point ${key.toUpperCase()} x`} value={points[key].x} axis="x" onValue={v=>act(()=>update('main',key,{...points[key],x:v}))}/>
                  x{i + 1}
                </label>
                <label>
                  <MidpointField label={`Point ${key.toUpperCase()} y`} value={points[key].y} axis="y" onValue={v=>act(()=>update('main',key,{...points[key],y:v}))}/>
                  y{i + 1}
                </label>
              </section>
            ))}
            <h2>MIDPOINT M</h2>
            <p>Computed using the Midpoint Formula.</p>
            <strong>
              M ({fmt(m.m.x)}, {fmt(m.m.y)})
            </strong>
          </aside>
          <article>{graph("main", points, m.m, mainSvg)}</article>
          <aside className="results">
            <h2>LIVE RESULTS</h2>
            <h3>MIDPOINT FORMULA</h3>
            <MathExpression value={String.raw`M\left(\frac{x_1+x_2}2,\frac{y_1+y_2}2\right)`}/>
            <h3>Substitute values</h3>
            <MathExpression value={`M\\left(\\frac{(${points.a.x})+(${points.b.x})}2,\\frac{(${points.a.y})+(${points.b.y})}2\\right)`}/><MathExpression value={String.raw`=M\left(\frac{${fmt(m.m.x*2)}}2,\frac{${fmt(m.m.y*2)}}2\right)`}/><MathExpression value={`=M(${fmt(m.m.x)},${fmt(m.m.y)})`}/>
            <hr />
            <h3>Equal-distance check</h3>
            <p>
              AM = <b>{measured(m.am)} units</b>
            </p>
            <p>
              MB = <b>{measured(m.mb)} units</b>
            </p>
            <em>
              <CheckCircle2 /> {m.coincident?"A = B: both distances are 0":"Equal distances ✓"}
            </em>
          </aside>
        </section>
        <section id="mf10084-formula" className="mf10084-averages">
          <h2>HOW THE MIDPOINT IS COMPUTED (AVERAGE OF COORDINATES)</h2>
          <div>
            <article>
              <h3>x-coordinate (average of x₁ and x₂)</h3>
              <AverageRuler a={points.a.x} b={points.b.x} axis="x"/>
            </article>
            <article>
              <h3>y-coordinate (average of y₁ and y₂)</h3>
              <AverageRuler a={points.a.y} b={points.b.y} axis="y"/>
            </article>
          </div>
        </section>
        <section className="mf10084-cards">
          <article id="mf10084-learn">
            <h2>WHY IT WORKS</h2>
            <p>
              The midpoint divides AB into two equal parts. Therefore, AM = MB
              and M lies exactly halfway on the segment.
            </p>
            <svg className="mf10084-proof" viewBox="0 0 300 120" aria-label="Equal midpoint halves proof"><line className="half one" x1="35" y1="65" x2="150" y2="65"/><line className="half two" x1="150" y1="65" x2="265" y2="65"/>{[{x:35,k:'a',name:'A'},{x:150,k:'mid',name:'M'},{x:265,k:'b',name:'B'}].map(o=><g key={o.k}><circle className={o.k} cx={o.x} cy="65" r="7"/><text x={o.x} y="38" textAnchor="middle">{o.name}</text></g>)}<path className="equal-marks" d="M92.5 58V72M207.5 58V72"/></svg>
          </article>
          <article id="mf10084-example">
            <h2>WORKED EXAMPLE</h2>
            <p>Find the midpoint of A(−2,4) and B(6,−2).</p><MathExpression value={String.raw`M\left(\frac{x_1+x_2}2,\frac{y_1+y_2}2\right)`}/>
            <MathExpression value={String.raw`M\left(\frac{-2+6}2,\frac{4+(-2)}2\right)`}/><MathExpression value={String.raw`=M\left(\frac42,\frac22\right)=(2,1)`}/>
            <strong>So, the midpoint is M(2,1).</strong>
          </article>
          <article className="mistake">
            <h2>COMMON MISTAKE</h2>
            <p>Do not average x₁ with y₂ (or mix coordinates).</p>
            <div className="wrong"><b>Incorrect:</b><MathExpression value={String.raw`\left(\frac{x_1+y_2}2,\frac{y_1+x_2}2\right)`}/></div>
            <p>This mixes coordinates and gives an incorrect point.</p><p><b>Always average x with x and y with y.</b></p>
          </article>
        </section>
        <section id="mf10084-practice" className="mf10084-challenge">
          <h2>CHALLENGE: KEEP THE MIDPOINT FIXED</h2>
          <p>
            Move points A and B anywhere on the grid while keeping the midpoint
            fixed at M(2,1).
          </p>
          <aside>
            <p>Target midpoint</p>
            <strong>M(2,1)</strong>
            <p>Equal-distance required</p>
            <em>AM = MB</em>
          </aside>
          {graph("challenge", challenge, cm.m, challengeSvg)}
          <article>
            <h3>Your current values</h3>
            {(["a", "b"] as Key[]).map((key) => (
              <div key={key}>
                <b>{key.toUpperCase()}</b>
                <MidpointField label={`Challenge ${key.toUpperCase()} x`} value={challenge[key].x} axis="x" onValue={v=>act(()=>update('challenge',key,{...challenge[key],x:v}))}/>
                <MidpointField label={`Challenge ${key.toUpperCase()} y`} value={challenge[key].y} axis="y" onValue={v=>act(()=>update('challenge',key,{...challenge[key],y:v}))}/>
              </div>
            ))}
            <p>Computed midpoint</p>
            <strong>
              M({fmt(cm.m.x)}, {fmt(cm.m.y)})
            </strong>
            <em role="status" aria-live="polite" className={fixed ? "yes" : ""}>
              AM={measured(cm.am)} &nbsp; MB={measured(cm.mb)}
              <br />
              {fixed
                ? coincident?"Target met; A = B = M (zero-length segment).":"Midpoint fixed ✓"
                : "Move the opposite endpoint"}
            </em>
            <button onClick={reset}>
              <RotateCcw /> Reset all
            </button>
          </article>
        </section>
      </main>
      <div className="mf10084-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-distance-formula">
          <ArrowLeft />
          Distance Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-internal-section-formula">
          Internal Section Formula <ArrowRight />
        </Link>
      </div>
      <footer className="mf10084-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
