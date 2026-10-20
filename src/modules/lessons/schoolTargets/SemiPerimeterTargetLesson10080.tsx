import {
  Atom, BookOpen, ListChecks, FlaskConical, SquarePen, Lightbulb, Calculator, TriangleAlert,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  X,
} from "lucide-react";
import { type PointerEvent, useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SemiPerimeterTargetLesson10080.css";
import MathExpression from '../../../components/ui/MathExpression';
import {keys10080, semiPerimeter10080, geometry10080, sides10080, ribbon10080, fit10080, type Sides10080, type Point10080, type Points10080} from './semiPerimeterModel10080';

type Sides=Sides10080;
type Point=Point10080;
type Vertex=keyof Sides;
const START:Sides={a:5,b:5,c:6};
const rr=(n:number,p=3)=>Number(n.toFixed(p));
const display=(n:number)=>n!==0&&Math.abs(n)<.001?n.toExponential(3):String(rr(n));
const mathNumber=(n:number)=>display(n).replace(/e([+-]?)([0-9]+)/,(_,sign,power)=>`\\times10^{${sign==='-'?'-':''}${Number(power)}}`);
function SideField({value,label,onValue}:{value:number;label:string;onValue:(v:number)=>void}){const[draft,setDraft]=useState(String(rr(value,6))),[invalid,setInvalid]=useState(false),dirty=useRef(false);useEffect(()=>{if(!dirty.current)setDraft(String(rr(value,6)));},[value]);const commit=()=>{if(!dirty.current)return;const v=Number(draft);if(!draft.trim()||!Number.isFinite(v)||v<1||v>12){setInvalid(true);return;}dirty.current=false;setInvalid(false);onValue(v);};return <input type="number" aria-label={label} aria-invalid={invalid} min="1" max="12" step="0.1" value={draft} title={String(value)} onChange={e=>{dirty.current=true;setDraft(e.target.value);setInvalid(false);}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')commit();if(e.key==='Escape'){dirty.current=false;setDraft(String(rr(value,6)));setInvalid(false);}}}/>;}
const options: Sides[] = [
  { a: 6, b: 8, c: 10 },
  { a: 7, b: 9, c: 8 },
  { a: 5, b: 11, c: 8 },
  { a: 4, b: 12, c: 8 },
];
export default function SemiPerimeterTargetLesson10080({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides,setSides]=useState(START),[world,setWorld]=useState<Points10080|null>(()=>geometry10080(START)),[tab,setTab]=useState(0),[choice,setChoice]=useState(1),[actions,setActions]=useState(0),[version,setVersion]=useState(0),[folded,setFolded]=useState(true),[frozen,setFrozen]=useState<ReturnType<typeof fit10080>|null>(null);
  const svgRef=useRef<SVGSVGElement>(null),gesture=useRef<{key:Vertex;points:Points10080;sides:Sides;fit:ReturnType<typeof fit10080>;id:number;client:Point;moved:boolean}|null>(null);
  const m=useMemo(()=>semiPerimeter10080(sides),[sides]),halves=ribbon10080(sides),fit=frozen??fit10080(world??geometry10080(START)!);
  const points=Object.fromEntries(keys10080.map(k=>[k,{x:fit.x+(world?.[k].x??0)*fit.scale,y:fit.y-(world?.[k].y??0)*fit.scale}])) as Points10080;
  const act=(fn:()=>void)=>{fn();setActions(n=>n+1);};
  const update=(key:Vertex,value:number)=>{const next={...sides,[key]:value};setSides(next);setWorld(geometry10080(next));};
  const local=(e:PointerEvent<SVGSVGElement>)=>{const matrix=svgRef.current?.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()),f=gesture.current?.fit??fit;return{x:Math.round((Math.max(25,Math.min(305,p.x))-f.x)/f.scale*100)/100,y:Math.round((f.y-Math.max(25,Math.min(285,p.y)))/f.scale*100)/100};};
  const move=(key:Vertex,p:Point)=>{if(!world)return;const next={...world,[key]:p},s=sides10080(next),metrics=semiPerimeter10080(s);if(keys10080.every(k=>s[k]>=1&&s[k]<=12)&&metrics.valid&&metrics.area!>1e-4){setWorld(next);setSides(s);}};
  const finish=(e:PointerEvent<SVGSVGElement>)=>{if(!gesture.current)return;const p=local(e);if(p&&gesture.current.moved)move(gesture.current.key,p);gesture.current=null;setFrozen(null);setActions(n=>n+1);};
  const reset=()=>act(()=>{setSides(START);setWorld(geometry10080(START));setChoice(1);setTab(0);setFolded(true);setFrozen(null);gesture.current=null;setVersion(n=>n+1);});
  return (
    <section
      className="sp10080-page"
      data-testid="school-mockup-0754"
      data-object-model="dedicated-semiperimeter-ribbon-heron-factor-engine"
      data-sides={`${sides.a},${sides.b},${sides.c}`}
      data-perimeter={m.p}
      data-semiperimeter={m.s}
      data-factors={m.f.join(",")}
      data-area={m.area??"undefined"}
      data-state={m.state}
      data-valid={String(m.valid)}
      data-choice={choice}
      data-actions={actions}
    >
      <div role="banner" className="sp10080-hero"><Link className="sp10080-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · MENSURATION</small>
        <h1>Semi-Perimeter Lab</h1>
        <p>
          Explore how the semi-perimeter <i>s</i> controls Heron&apos;s formula.
          Drag the triangle or adjust the sides.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>number</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="sp10080-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(["sp10080-interact","sp10080-learn","sp10080-example","sp10080-formula","sp10080-practice"][i])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {i===0?<Atom/>:i===1?<BookOpen/>:i===2?<ListChecks/>:i===3?<FlaskConical/>:<SquarePen/>}{x}
          </button>
        ))}
      </div>
      <main>
        <section id="sp10080-interact" className="sp10080-lab">
          <article className="sp10080-controls">
            <header>
              <h2>1. TRIANGLE CONTROLS</h2>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </header>
            <p>Adjust side lengths</p>
            {(["a", "b", "c"] as Vertex[]).map((k) => (
              <label key={k}>
                <b>{k}</b>
                <input
                  aria-label={`Side ${k} slider`}
                  type="range"
                  min="1"
                  max="12"
                  step="0.1"
                  value={rr(sides[k])}
                  onChange={(e) => act(() => update(k, +e.target.value))}
                />
                <SideField key={`${k}-${version}`} label={`Side ${k}`} value={rr(sides[k])} onValue={v=>act(()=>update(k,v))}/>
              </label>
            ))}
            <p>Or drag the triangle&apos;s vertices</p>
            <svg
              ref={svgRef}
              viewBox="0 0 330 310"
              aria-label="Draggable semi-perimeter triangle"
              onPointerMove={e=>{if(gesture.current){if(Math.hypot(e.clientX-gesture.current.client.x,e.clientY-gesture.current.client.y)>.5)gesture.current.moved=true;const p=local(e);if(p&&gesture.current.moved)move(gesture.current.key,p);}}}
              onPointerUp={finish}
              onPointerCancel={()=>{if(gesture.current){setWorld(gesture.current.points);setSides(gesture.current.sides);}gesture.current=null;setFrozen(null);}}
            >
              <defs><linearGradient id="sp10080-shade"><stop stopColor="#e6f2fd"/><stop offset="1" stopColor="#e4f8f8"/></linearGradient></defs>{world ? <g>
              <path
                d={`M${points.a.x} ${points.a.y}L${points.b.x} ${points.b.y}L${points.c.x} ${points.c.y}Z`}
              />
              {([['a','b','#2577d8'],['a','c','#24a7b5'],['b','c','#8245d9']] as const).map(([u,v,color])=><line className="edge" key={u+v} x1={points[u].x} y1={points[u].y} x2={points[v].x} y2={points[v].y} style={{stroke:color}}/>)}
              {(["a", "b", "c"] as Vertex[]).map((k) => (
                <circle
                  key={k}
                  tabIndex={0}
                  aria-label={`Draggable vertex ${k.toUpperCase()}`}
                  cx={points[k].x}
                  cy={points[k].y}
                  r="7"
                  role="slider" aria-valuemin={-12} aria-valuemax={12} aria-valuenow={world?.[k].x??0} aria-valuetext={`x ${rr(world?.[k].x??0)}, y ${rr(world?.[k].y??0)}`}
                  onPointerDown={e=>{if(!world)return;e.currentTarget.setPointerCapture(e.pointerId);gesture.current={key:k,points:world,sides,fit,id:e.pointerId,client:{x:e.clientX,y:e.clientY},moved:false};setFrozen(fit);}}
                  onKeyDown={e=>{if(!world||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const d=e.shiftKey?.5:.1;act(()=>move(k,{x:world[k].x+(e.key==='ArrowRight'?d:e.key==='ArrowLeft'?-d:0),y:world[k].y+(e.key==='ArrowUp'?d:e.key==='ArrowDown'?-d:0)}));}}
                />
              ))}
              <text x={points.a.x - 6} y={points.a.y - 12}>
                A
              </text>
              <text x={points.b.x - 5} y={points.b.y + 22}>
                B
              </text>
              <text x={points.c.x - 4} y={points.c.y + 22}>
                C
              </text>
              <text
                x={(points.a.x + points.b.x) / 2 - 18}
                y={(points.a.y + points.b.y) / 2}
              >
                {rr(sides.a)}
              </text>
              <text
                x={(points.a.x + points.c.x) / 2 + 10}
                y={(points.a.y + points.c.y) / 2}
              >
                {rr(sides.b)}
              </text>
              <text x={(points.b.x + points.c.x) / 2} y={points.b.y + 26}>
                {rr(sides.c)}
              </text>
              </g> : <g className="impossible"><text x="165" y="90" textAnchor="middle">These sides cannot close a triangle.</text>{keys10080.map((k,i)=><g key={k}><line x1="40" y1={130+i*40} x2={40+sides[k]*20} y2={130+i*40} stroke={['#2577d8','#24a7b5','#8245d9'][i]} strokeWidth="3"/><text x="40" y={123+i*40}>{k} = {rr(sides[k])}</text></g>)}</g>}
            </svg>
            <strong className={m.valid ? "valid" : "invalid"}>
              {m.valid ? <CheckCircle2 /> : <X />}
              {m.valid
                ? "Valid triangle (all factors > 0)"
                : m.state === "degenerate" ? "Flat triangle — area 0" : "Impossible triangle"}
            </strong>
          </article>
          <article className="sp10080-ribbon">
            <h2>2. PERIMETER RIBBON → SEMI-PERIMETER</h2>
            <p>The perimeter ribbon folds into two equal halves.</p>
            <h3>Perimeter P = a + b + c</h3>
            <div className="whole">
              {(["a", "b", "c"] as Vertex[]).map((k) => (
                <span key={k} style={{ flex: sides[k] }}>
                  {rr(sides[k])}
                </span>
              ))}
            </div>
            <b className="total">{rr(m.p)}</b>
            <button className="fold" aria-label={folded?"Unfold perimeter ribbon":"Fold perimeter ribbon"} aria-expanded={folded} onClick={()=>act(()=>setFolded(v=>!v))}>↓<b>{folded?'Unfold':'Fold'}</b></button>
            {folded&&<div className="halves">{halves.map((h,i)=><div className="half" key={i} data-half={i}><div>{h.map(f=><span key={f.key} data-side={f.key} data-length={f.length} style={{flex:f.length,background:{a:'#2577d8',b:'#24a7b5',c:'#8245d9'}[f.key]}}>{rr(f.length)}</span>)}</div><b>{rr(m.s)}</b></div>)}</div>}
            <div className="semi"><b>Semi-perimeter</b><MathExpression value={`s=\\frac{a+b+c}{2}=\\frac{${rr(m.p)}}2=${rr(m.s)}`}/></div>
            <div id="sp10080-formula"/>
            <h2>
              3. HERON FACTORS <small>(positive for a proper triangle)</small>
            </h2>
            <div className="factors">
              {m.f.map((f, i) => (
                <span key={i}>
                  <b>s − {["a", "b", "c"][i]}</b>
                  {rr(m.s)} − {rr(sides[keys10080[i]])} = {display(f)}
                  <i
                    style={{
                      width: `${Math.max(0, Math.min(100, (f / m.s) * 100))}%`,
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="area"><b>Area</b>{m.area===null?<p>Undefined: one Heron factor is negative.</p>:<MathExpression value={`A=\\sqrt{s(s-a)(s-b)(s-c)}${m.radical?'='+m.radical:'\\approx '+mathNumber(m.area)}`}/>}<small>{m.state==='proper'?`≈ ${display(m.area!)} square units`:m.state==='degenerate'?'Zero factor: the vertices lie on a straight line.':'Increase the shorter sides or decrease the longest side.'}</small></div>
          </article>
        </section>
        <section className="sp10080-cards">
          <article id="sp10080-learn">
            <h2><Lightbulb/> WHY IT WORKS</h2>
            <p>Heron&apos;s formula uses the semi-perimeter s.</p>
            <MathExpression value={String.raw`s=\frac{a+b+c}{2}`}/><p>✓ Half the perimeter, a single number.</p>
            <p>✓ For a proper triangle all three factors are positive. A zero factor gives a flat triangle.</p>
          </article>
          <article id="sp10080-example">
            <h2><Calculator/> WORKED EXAMPLE</h2>
            <p>If a=5, b=5, c=6:</p>
            <MathExpression value={String.raw`s=\frac{5+5+6}2=8`}/><MathExpression value={String.raw`A=\sqrt{8\cdot3\cdot3\cdot2}=12`}/><p>12 square units</p>
          </article>
          <article className="warn">
            <h2><TriangleAlert/> COMMON MISCONCEPTION</h2>
            <p>Semi-perimeter is half the perimeter, not half of each side.</p>
            <MathExpression value={String.raw`\color{#bd3527}{\times}\quad\text{Wrong: }\frac52,\;\frac52,\;\frac62`}/>
            <MathExpression value={String.raw`\color{#13824d}{\checkmark}\quad s=\frac{5+5+6}2=8`}/>
          </article>
        </section>
        <section id="sp10080-practice" className="sp10080-practice">
          <h2>PRACTICE CHALLENGE</h2>
          <p>Choose sides with s = 12.<br/><br/>Which set gives the maximum area?<br/><br/>(All sets have a + b + c = 24.)</p>
          <div role="radiogroup" aria-label="Maximum area choices">
            {options.map((o, i) => (
              <button
                key={i}
                role="radio" aria-checked={choice===i}
                className={choice === i ? "active" : ""}
                onClick={() => act(() => setChoice(i))}
              >
                <span>
                  {choice===i?"◉":"○"} ({o.a}, {o.b}, {o.c})
                </span>
                <MathExpression value={`A=${semiPerimeter10080(o).radical}`}/><b>≈ {rr(semiPerimeter10080(o).area!)}{i===3?" (flat)":""}</b>
              </button>
            ))}
          </div>
          <strong role="status" className={choice===1?'correct':'retry'}><CheckCircle2/>{choice===1?'Correct: (7, 9, 8) has the largest area among these choices.':choice===3?'(4, 12, 8) is degenerate: 4 + 8 = 12, so its area is 0.':'Compare with (7, 9, 8): its area is about 26.833 square units.'} For fixed s = 12, the global maximum is the equilateral triangle (8, 8, 8), with area 16√3 ≈ 27.713.</strong>
        </section>
      </main>
      <div className="sp10080-nav">
        <Link to="/lessons/school/class-9/class-9-mensuration-heron-s-formula-derivation">
          <ArrowLeft /> Heron’s Formula Derivation
        </Link>
        <span>Mensuration</span>
        <Link to="/lessons/school/class-9/class-9-mensuration-coordinate-area-versus-heron-s-formula">
          Coordinate Area versus Heron’s Formula <ArrowRight />
        </Link>
      </div><footer className="sp10080-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
