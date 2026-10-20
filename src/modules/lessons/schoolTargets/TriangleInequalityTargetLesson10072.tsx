import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TriangleInequalityTargetLesson10072.css";
import{triangleInequality10072,tiIntegers10072,tiGrade10072}from'./triangleInequalityModel10072';

type Sides = { a: number; b: number; c: number };
const START: Sides = { a: 4, b: 5, c: 8 };
const colors = { a: "purple", b: "blue", c: "teal" };
export default function TriangleInequalityTargetLesson10072({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState<Sides>(START),
    [placed, setPlaced] = useState<string[]>([]),
    [view, setView] = useState<"triangle" | "line">("triangle"),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState<number[]>([
      5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]),
    [actions, setActions] = useState(0);
  const model=triangleInequality10072(sides),verdicts=model.checks,isValid=model.kind==='proper',point=model.point,perimeter=model.perimeter,grade=tiGrade10072(challenge);
  const [version,setVersion]=useState(0),[graded,setGraded]=useState(false);
  const dropRef=useRef<HTMLDivElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: keyof Sides, value: number) =>
    act(() => {
      setSides({ ...sides, [key]: Math.max(1, Math.min(20, value)) });
      setPlaced([]);
    });
  const preset = (next: Sides) =>
    act(() => {
      setSides(next);setVersion(n=>n+1);
      setPlaced([]);
    });
  const place = (key: string) =>
    act(() =>
      setPlaced((current) =>
        !['a','b','c'].includes(key)||current.includes(key) ? current : [...current, key],
      ),
    );
  const reset = () =>
    act(() => {
      setSides(START);setVersion(n=>n+1);
      setPlaced([]);
      setView("triangle");
    });
  return (
    <section
      className="ti10072-page"
      data-testid="school-mockup-0746"
      data-object-model="dedicated-segment-drop-triangle-inequality-engine"
      data-sides={`${sides.a},${sides.b},${sides.c}`}
      data-checks={verdicts.map(Number).join(",")}
      data-valid={String(isValid)} data-kind={model.kind} data-grade={graded?(grade.correct?"correct":"incorrect"):"ungraded"}
      data-perimeter={perimeter}
      data-placed={placed.join(",")}
      data-view={view}
      data-challenge={challenge.join(",")}
      data-actions={actions}
    >
      <div role="banner" className="ti10072-hero"><Link className="ti10072-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>Triangle Inequality</h1>
        <p>
          Three positive lengths form a triangle if and only if the sum of any
          two is greater than the third.
        </p>
        <div>
          <span>24 min</span>
          <span>INTERMEDIATE</span>
          <span>VISUAL EXPLORATION</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div role="group" aria-label="Lesson sections" className="ti10072-tabs">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(['ti10072-interact','ti10072-learn','ti10072-example','ti10072-formula','ti10072-practice'][i])?.scrollIntoView({behavior:'smooth',block:'start'});})}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section id="ti10072-interact" className="ti10072-builder">
          <header>
            <div>
              <h2>1. BUILD A TRIANGLE</h2>
              <p>
                Drag the segment sliders or type values. Then drag the segments
                into the triangle to test.
              </p>
            </div>
            <nav>
              <button
                aria-label="Triangle view" aria-pressed={view==="triangle"} className={view === "triangle" ? "active" : ""}
                onClick={() => act(() => setView("triangle"))}
              >
                ▣ Triangle view
              </button>
              <button
                aria-label="Number line view" aria-pressed={view==="line"} className={view === "line" ? "active" : ""}
                onClick={() => act(() => setView("line"))}
              >
                ▤ Number line view
              </button>
              <button aria-label="Clear triangle" onClick={() => act(() => setPlaced([]))}>
                ▱ Clear triangle
              </button>
            </nav>
          </header>
          <div className="ti10072-build-grid">
            <aside>
              <h3>Segment lengths</h3>
              {(["a", "b", "c"] as const).map((key) => (
                <label key={key}>
                  <b>Side {key}</b>
                  <span>
                    <input
                      aria-label={`Side ${key}`}
                      type="range"
                      min="1"
                      max="20" step="0.1"
                      value={sides[key]}
                      onChange={(e) => update(key, +e.target.value)}
                    />
                    <SideDraft key={`${key}-${version}`} name={key} value={sides[key]} onCommit={n=>update(key,n)}/>
                  </span>
                </label>
              ))}
              <h3>Presets</h3>
              <div className="presets">
                <button onClick={() => preset({ a: 4, b: 5, c: 8 })}>
                  Example: 4,5,8
                </button>
                <button onClick={() => preset({ a: 3, b: 4, c: 7 })}>
                  Degenerate: 3,4,7
                </button>
                <button onClick={() => preset({ a: 6, b: 6, c: 6 })}>
                  Equilateral: 6,6,6
                </button>
              </div>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </aside>
            <section className="ti10072-stage">
              <div className="segments">
                {(["a", "b", "c"] as const).map((key) => (
                  <DraggableSegment
                    key={key}
                    id={key}
                    value={sides[key]}
                    color={colors[key]}
                    onPlace={place} dropRef={dropRef} placed={placed.includes(key)}
                  />
                ))}
              </div>
              <span className="arrow">→</span>
              <div
                ref={dropRef} className={`drop ${isValid ? "valid" : "invalid"}`}
                role="region"
                aria-label="Triangle construction drop zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  if (['a','b','c'].includes(id)) place(id);
                }}
              >
                {view === "triangle" ? (
                  <BuildTriangle sides={sides} point={point} placed={placed} />
                ) : (
                  <LineView sides={sides} />
                )}
                <p className={placed.length===3?"built-caption":""}>
                  {placed.length === 3
                    ? isValid
                      ? "Triangle built from all three segments"
                      : "These segments cannot close"
                    : "Drag all three segments here to build the triangle"}
                </p>
              </div>
              <footer className={isValid ? "valid" : "invalid"}>
                {isValid ? <Check /> : <TriangleAlert />}
                <span>
                  <b>{isValid ? "Valid triangle!" : model.kind==="flat"?"Degenerate: flat figure":"Cannot form a triangle"}</b>
                  <small>
                    {isValid
                      ? "All three inequalities are satisfied."
                      : "At least one strict inequality fails."}
                  </small>
                </span>
                <strong>{isValid?"Perimeter":"Length sum"} = {perimeter}</strong>
                <svg
                  className="mini-triangle"
                  viewBox="0 0 42 34"
                  aria-hidden="true"
                >
                  <path d="M3 31 22 3l17 28Z" />
                </svg>
              </footer>
            </section>
          </div>
        </section>
        <section id="ti10072-formula" className="ti10072-checks">
          <header>
            <h2>2. CHECK THE TRIANGLE INEQUALITY</h2>
            <p>All three inequalities must be true.</p>
          </header>
          {[
            ["a + b > c", model.pairSums[0], sides.c, verdicts[0]],
            ["a + c > b", model.pairSums[1], sides.b, verdicts[1]],
            ["b + c > a", model.pairSums[2], sides.a, verdicts[2]],
          ].map(([label, sum, third, ok]) => (
            <article key={String(label)}>
              <h2>{label}</h2>
              <strong>
                {String(label).replace(/[abc]/g, (m) =>
                  String(sides[m as keyof Sides]),
                )}
              </strong>
              <CompareBars sum={Number(sum)} third={Number(third)} ok={Boolean(ok)}/>
              <p>
                {sum} &gt; {third}
              </p>
              <b className={ok ? "true" : "false"}>{ok ? "True" : "False"}</b>
            </article>
          ))}
          <footer>
            <Lightbulb /> If any one of these is false or equal, the segments
            cannot form a non-degenerate triangle.
          </footer>
        </section>
        <section id="ti10072-learn" className="ti10072-theory">
          <article>
            <h2>3. WHY IT WORKS</h2>
            <p>
              If one inequality fails, one side is too long to “reach” the other
              two. The figure collapses into a straight line or two overlapping
              sides.
            </p>
            <LineExample type="equal" />
            <b>Equality (degenerate): a + b = c</b>
            <LineExample type="less" />
            <b>Inequality fails: a + b &lt; c</b>
            <strong>
              ⓘ Three positive lengths form a triangle if each pair sum is
              greater than the third.
            </strong>
          </article>
          <article>
            <h2 id="ti10072-example">4. WORKED EXAMPLE</h2>
            <h3>Valid triangle: 4, 5, 8</h3>
            <ExampleTriangle sides={START} />
            <p>
              ✓ 4 + 5 = 9 &gt; 8; ✓ 4 + 8 = 12 &gt; 5<br />✓ 5 + 8 = 13 &gt; 4
            </p>
            <b>All true → Triangle exists.</b>
            <hr />
            <h3>Degenerate (invalid): 3, 4, 7</h3>
            <LineView sides={{ a: 3, b: 4, c: 7 }} />
            <p>3 + 4 = 7 = 7 ×</p>
            <b>One equality → No triangle (flat).</b>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> COMMON MISTAKE
            </h2>
            <h3>Checking an arbitrary pair is not enough.</h3>
            <section>
              <b>× Mistake: checking only 2 + 6 &gt; 3</b>
              <p>
                Example: 2, 3, 6<br />2 + 6 = 8 &gt; 3 (true)
                <br />
                But 2 + 3 = 5 &lt; 6 (false)
                <br />3 + 6 = 9 &gt; 2 (true)
                <br />
                The longest side is too long; no triangle exists.
              </p>
            </section>
            <section className="correct">
              <b>✓ Correct rule</b>
              <p>
                All three pair sums must be strictly greater than the third.
                <br />
                Use &gt;, not ≥. For positive lengths sorted from shortest to longest, checking shortest + middle &gt; longest is sufficient.
              </p>
            </section>
          </article>
        </section>
        <section id="ti10072-practice" className="ti10072-challenge">
          <header>
            <h2>6. CHALLENGE</h2>
            <p>
              Let two sides be 5 and 9. What integer values can the third side
              take?
              <br />
              Find all integers x such that a triangle can be formed.
            </p>
          </header>
          <section>
            <div className="number-line">
              {Array.from({ length: 16 }, (_, x) => (
                <button
                  key={x} aria-label={`Select integer ${x}`} aria-pressed={challenge.includes(x)}
                  className={
                    `${challenge.includes(x)?"active":""} ${x<=4||x>=14?"invalid":""}`
                  }
                  onClick={() =>
                    act(() =>
                      (setGraded(false),setChallenge((current) =>
                        current.includes(x)
                          ? current.filter((n) => n !== x)
                          : [...current, x].sort((a, b) => a - b),
                      )),
                    )
                  }
                >
                  {x}
                </button>
              ))}
            </div>
            <p>
              <span>x ≤ 4 (invalid)</span>
              <span>4 &lt; x &lt; 14 (valid)</span>
              <span>x ≥ 14 (invalid)</span>
            </p>
          </section>
          <aside>
            <h2>Solution</h2>
            <p>We need both: |9 − 5| &lt; x &lt; 9 + 5</p>
            <strong>4 &lt; x &lt; 14</strong>
            <p>Solution integers: {tiIntegers10072.join(", ")}</p><p>Your selection: {challenge.length?challenge.join(", "):"none"}</p><button onClick={()=>setGraded(true)}>Check selection</button><button onClick={()=>{setChallenge([]);setGraded(false);}}>Clear selection</button>{graded&&<p role="status">{grade.correct?"Correct! All nine integers selected.":`Try again: ${grade.missing.length} missing and ${grade.extra.length} invalid selections.`}</p>}
            <p>
              There are <b>{tiIntegers10072.length}</b>{" "}
              possible integer values.
            </p>
          </aside>
        </section>
      </main>
      <nav className="ti10072-nav">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-equal-sides-and-equal-angles">
          <ArrowLeft /> Equal Sides and Equal Angles
        </Link>
        <Link to="/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-sides">
          Parallelogram Opposite Sides <ArrowRight />
        </Link>
      </nav>
      <footer className="ti10072-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function SideDraft({name,value,onCommit}:{name:string;value:number;onCommit:(n:number)=>void}){const[d,setD]=useState(String(value)),[editing,setEditing]=useState(false);const shown=editing?d:String(value),n=Number(shown),ok=shown.trim()!==''&&Number.isFinite(n)&&n>=1&&n<=20;return <span className="ti10072-draft"><input aria-label={`Side ${name} value`} type="number" min="1" max="20" step="any" value={shown} aria-invalid={!ok} onFocus={()=>{setD(String(value));setEditing(true);}} onChange={e=>{setD(e.target.value);setEditing(true);const v=Number(e.target.value);if(e.target.value!==''&&Number.isFinite(v)&&v>=1&&v<=20)onCommit(v);}} onBlur={()=>{if(ok)setEditing(false);}}/>{!ok&&<small role="alert">Enter 1–20.</small>}</span>;}
function DraggableSegment({id,value,color,onPlace,dropRef,placed}:{id:string;value:number;color:string;onPlace:(id:string)=>void;dropRef:React.RefObject<HTMLDivElement|null>;placed:boolean}){const g=useRef<{x:number;y:number;moved:boolean}|null>(null),[offset,setOffset]=useState({x:0,y:0});const move=(e:PointerEvent<HTMLButtonElement>)=>{if(!g.current)return;const x=e.clientX-g.current.x,y=e.clientY-g.current.y;if(Math.hypot(x,y)>4)g.current.moved=true;if(g.current.moved)setOffset({x,y});};return <button className={`ti10072-segment ${color}`} aria-label={`Place segment ${id}`} aria-pressed={placed} style={{transform:`translate(${offset.x}px,${offset.y}px)`,zIndex:g.current?5:1}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);g.current={x:e.clientX,y:e.clientY,moved:false};}} onPointerMove={move} onPointerUp={e=>{const q=g.current,box=dropRef.current?.getBoundingClientRect();if(q?.moved&&box&&e.clientX>=box.x&&e.clientX<=box.right&&e.clientY>=box.y&&e.clientY<=box.bottom)onPlace(id);setOffset({x:0,y:0});if(q?.moved)e.currentTarget.dataset.suppress='true';g.current=null;}} onPointerCancel={()=>{g.current=null;setOffset({x:0,y:0});}} onClick={e=>{if(e.currentTarget.dataset.suppress){delete e.currentTarget.dataset.suppress;return;}onPlace(id);}}><b>{id} = {value}{placed?' ✓':''}</b><i style={{width:`${value/20*100}%`}}/></button>;}
function BuildTriangle({sides,point,placed}:{sides:Sides;point:{x:number;y:number}|null;placed:string[]}){if(!point&&placed.length===3)return <LineView sides={sides}/>;if(!point||!placed.length)return <svg viewBox="0 0 310 220" aria-label="Triangle segment drop zone"><path className="ti-outline" d="M20 190L155 25L290 190Z"/></svg>;return <ExampleTriangle sides={sides} placed={placed}/>;}
function LineView({sides}:{sides:Sides}){const scale=260/Math.max(sides.a+sides.b,sides.c),x=(v:number)=>20+v*scale;return <svg className="ti10072-line" viewBox="0 0 300 100" aria-label="Triangle inequality number line"><line className="axis" x1="20" y1="48" x2="280" y2="48"/><line className="side-a" x1="20" y1="28" x2={x(sides.a)} y2="28"/><line className="side-b" x1={x(sides.a)} y1="28" x2={x(sides.a+sides.b)} y2="28"/><line className="side-c" x1="20" y1="68" x2={x(sides.c)} y2="68"/>{[0,sides.a,sides.a+sides.b].map((v,i)=><circle key={i} cx={x(v)} cy="28" r="4"/>)}<circle cx="20" cy="68" r="4"/><circle cx={x(sides.c)} cy="68" r="4"/><text x={x(sides.a/2)} y="15">a = {sides.a}</text><text x={x(sides.a+sides.b/2)} y="15">b = {sides.b}</text><text x={x(sides.c/2)} y="91">c = {sides.c}</text></svg>;}
function LineExample({type}:{type:string}){return <LineView sides={type==='equal'?{a:3,b:4,c:7}:{a:2,b:3,c:7}}/>;}
function ExampleTriangle({sides,placed=['a','b','c']}:{sides:Sides;placed?:string[]}){const m=triangleInequality10072(sides);if(!m.point)return <LineView sides={sides}/>;const {x,y}=m.point,min=Math.min(0,x),max=Math.max(sides.c,x),k=Math.min(250/(max-min),150/y),p=[{x:30-min*k,y:185},{x:30+(x-min)*k,y:185-y*k},{x:30+(sides.c-min)*k,y:185}];return <svg className="ti10072-example" viewBox="0 0 310 220" aria-label="Triangle drawn to scale" data-apex={`${x},${y}`}><path className="ti-outline" d={`M${p[0].x} ${p[0].y}L${p[1].x} ${p[1].y}L${p[2].x} ${p[2].y}Z`}/>{(['a','b','c'] as const).map((key,i)=>{const u=p[i],v=p[(i+1)%3];return placed.includes(key)?<g key={key}><line className={`side-${key}`} x1={u.x} y1={u.y} x2={v.x} y2={v.y}/><text className={`label-${key}`} x={(u.x+v.x)/2+(i===0?-12:i===1?12:0)} y={(u.y+v.y)/2+(i===2?20:-10)}>{key} = {sides[key]}</text></g>:null;})}</svg>;}
function CompareBars({sum,third,ok}:{sum:number;third:number;ok:boolean}){const k=210/Math.max(sum,third);return <svg className="ti10072-compare" viewBox="0 0 260 75" aria-label={`${sum} greater than ${third}: ${ok}`}><line className="axis" x1="12" y1="35" x2="230" y2="35"/><line className="sum" x1="12" y1="22" x2={12+sum*k} y2="22"/><line className="third" x1="12" y1="48" x2={12+third*k} y2="48"/><text x="12" y="12">sum = {sum}</text><text x="12" y="72">third = {third}</text><text className={ok?'good':'bad'} x="240" y="37">{ok?'✓':'×'}</text></svg>;}
