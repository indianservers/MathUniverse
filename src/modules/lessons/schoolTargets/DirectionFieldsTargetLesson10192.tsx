import {
  BookOpen, Compass, ClipboardCheck, ListTree,
  Eye,
  EyeOff,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DirectionFieldsTargetLesson10192.css";
import MathExpression from "../../../components/ui/MathExpression";
import {directionExact as exact,traceDirection as solve,directionErrors,type DirectionMethod as Method} from "./directionFieldsModel";
import "../components/LessonMockupReference.css";

const fmt=(n:number,d=4)=>Number(n.toFixed(d));
const show=(n:number,d=4)=>Number.isFinite(n)?n.toFixed(d):"—";
const mapX=(x:number,z:number)=>60+x*112*z,mapY=(y:number,z:number)=>350-y*62*z;
export default function DirectionFieldsTargetLesson10192({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [probe, setProbe] = useState({ x: 0, y: 1 }),
    [initial, setInitial] = useState({ x: 0, y: 1 }),
    [method, setMethod] = useState<Method>("Euler"),
    [h, setH] = useState(0.05),
    [traced, setTraced] = useState(true),
    [running, setRunning] = useState(false),
    [progress,setProgress]=useState(1),
    [traceRun,setTraceRun]=useState(0),
    [iso, setIso] = useState(true),
    [levels, setLevels] = useState([-2, -1, 0, 1, 2]),
    [axes, setAxes] = useState(true),
    [grid, setGrid] = useState(true),
    [values, setValues] = useState(true),
    [density, setDensity] = useState<"Sparse" | "Dense">("Dense"),
    [zoom, setZoom] = useState(1),
    [tips, setTips] = useState(true),
    [prediction, setPrediction] = useState(""),
    [feedback, setFeedback] = useState("");
  const dragging=useRef(false);
  useEffect(()=>{if(!running)return;const started=performance.now();const id=window.setInterval(()=>{const value=Math.min(1,(performance.now()-started)/2000);setProgress(value);if(value>=1)setRunning(false);},40);return()=>window.clearInterval(id);},[running,traceRun]);
  const slope = probe.x - probe.y,
    numerical = useMemo(
      () => solve(initial.x, initial.y, h, method),
      [initial, h, method],
    ),
    exactPoints = useMemo(
      () =>
        Array.from({ length: 151 }, (_, i) => {
          const x = initial.x + (i * (4.5 - initial.x)) / 150;
          return { x, y: exact(x, initial.x, initial.y) };
        }),
      [initial],
    );
  const comparison=useMemo(()=>directionErrors(initial.x,initial.y,h,method),[initial,h,method]),errors=comparison.samples,maxError=comparison.max,meanError=comparison.mean;
  const field=useMemo(()=>{const cols=density==="Dense"?36:18,rows=density==="Dense"?27:14;return Array.from({length:cols*rows},(_,i)=>{const cx=20+(i%cols)*565/(cols-1),cy=15+Math.floor(i/cols)*530/(rows-1),x=(cx-60)/(112*zoom),y=(350-cy)/(62*zoom),m=x-y,angle=Math.atan(m*62/112),dx=Math.cos(angle)*5.2,dy=-Math.sin(angle)*5.2;return {x1:cx-dx,y1:cy-dy,x2:cx+dx,y2:cy+dy,m};});},[density,zoom]);
  const coefficient=Number((initial.y-initial.x+1).toPrecision(12)),exactFormula=`y=x-1${coefficient===0?"":`${coefficient<0?"-":"+"}${Math.abs(coefficient)===1?"":Math.abs(coefficient)}e^{${initial.x===0?"-x":`-(x-(${initial.x}))`}}`}`;
  const path = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${mapX(p.x, zoom)},${mapY(p.y, zoom)}`).join(" ");
  const changeProbe=(x:number,y:number)=>{if(!Number.isFinite(x)||!Number.isFinite(y))return;const p={x:Number(x.toPrecision(12)),y:Number(y.toPrecision(12))};setProbe(p);setInitial(p);};
  const key=(event:KeyboardEvent<SVGCircleElement>)=>{const delta:Record<string,number[]>={ArrowLeft:[-.05,0],ArrowRight:[.05,0],ArrowUp:[0,.05],ArrowDown:[0,-.05]};if(delta[event.key]){event.preventDefault();changeProbe(probe.x+delta[event.key][0],probe.y+delta[event.key][1]);}};
  const trace=()=>{setProgress(0);setTraced(true);setRunning(true);setTraceRun(v=>v+1);};
  const graphPoint=(event:React.PointerEvent<SVGSVGElement>)=>{const ctm=event.currentTarget.getScreenCTM();if(!ctm)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(ctm.inverse());changeProbe(fmt(Math.max((20-60)/(112*zoom),Math.min((585-60)/(112*zoom),(p.x-60)/(112*zoom))),2),fmt(Math.max((350-545)/(62*zoom),Math.min((350-15)/(62*zoom),(350-p.y)/(62*zoom))),2));};
  const reset = () => {
    setProbe({ x: 0, y: 1 });
    setInitial({ x: 0, y: 1 });
    setMethod("Euler");
    setH(0.05);
    setTraced(true);
    setRunning(false);setProgress(1);
    setIso(true);
    setLevels([-2, -1, 0, 1, 2]);
    setAxes(true);
    setGrid(true);
    setValues(true);
    setDensity("Dense");
    setZoom(1);
    setTips(true);
    setPrediction("");
    setFeedback("");
  };
  return (
    <main
      className="df10192-page lesson-reference"
      data-testid="school-mockup-0866"
      data-object-model="dedicated-direction-field-numerical-solver"
      data-probe-x={fmt(probe.x, 2)}
      data-probe-y={fmt(probe.y, 2)}
      data-slope={fmt(slope)}
      data-method={method}
      data-step={h}
      data-traced={traced} data-running={running} data-progress={progress} data-zoom={zoom}
      data-max-error={fmt(maxError)}
    >
      <section className="df-hero" aria-label="Lesson introduction">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>{lesson.title}</h1>
<div>
          <span>25 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>visual</span>
          <span>interactive</span>
        </div>
        <Link className="df-school" to="/lessons/school/class-12">← School lessons</Link>
      </section>
      <section className="df-lab">
        <div className="df-intro-copy">
        <p>
          Dense slope field for y′=x−y. Explore local slope, isoclines, and
          solution curves. Click an initial point to trace Euler or RK4.
        </p>
        <p className="df-default">Default (0, 1) shows the exact solution <MathExpression value="y=x-1+2e^{-x}"/>.</p>
        </div>
        <div className="df-title">
          <div>
            <small>▦ &nbsp; INTERACTIVE LAB</small>
            <h2>Direction Field Explorer</h2>
            <p>Equation: y′ = x − y</p>
          </div>
          <div>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={()=>{setTraced(false);setRunning(false);setProgress(0);}}>
              <Trash2 />
              Clear solution
            </button>
            <button onClick={() => setTips((x) => !x)}>
              {tips ? <EyeOff /> : <Eye />}
              {tips ? "Hide tips" : "Show tips"}
            </button>
          </div>
        </div>
        <div className="df-workspace">
          <aside className="df-controls">
            <article>
              <h3>PROBE (DRAG IN THE FIELD)</h3>
              <p>
                x = <b>{show(probe.x,3)}</b>
              </p>
              <p>
                y = <b>{show(probe.y,3)}</b>
              </p>
              <p>
                m = x−y = <b>{show(slope,3)}</b>
              </p>
              <span className="probe-line" />
            </article>
            <article>
              <h3>TRACE SOLUTION</h3>
              <label>
                Initial point (x₀,y₀)
                <div>
                  <input
                    aria-label="Initial x"
                    type="number"
                    step=".1"
                    value={initial.x}
                    onChange={(e) =>
                      changeProbe(Number(e.target.value),initial.y)
                    }
                  />
                  <input
                    aria-label="Initial y"
                    type="number"
                    step=".1"
                    value={initial.y}
                    onChange={(e) =>
                      changeProbe(initial.x,Number(e.target.value))
                    }
                  />
                </div>
              </label>
              <button onClick={trace}>
                {running ? "Tracing..." : "◉ Trace solution"}
              </button><button className="df-stop" disabled={!running} onClick={()=>setRunning(false)}>Stop</button>
              <label>
                Method:
                <select
                  aria-label="Numerical method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                >
                  <option>Euler</option>
                  <option>RK4</option>
                </select>
              </label>
              <label>
                <span className="df-step-label">Step size h</span>
                <input
                  aria-label="Step size"
                  type="range"
                  min=".001"
                  max=".5"
                  step=".001"
                  value={h}
                  onChange={(e) => setH(Number(e.target.value))}
                />
                <input aria-label="Step size value" type="number" min=".001" max=".5" step=".001" value={h} onChange={e=>{const value=Number(e.target.value);if(Number.isFinite(value))setH(Math.max(.001,Math.min(.5,value)));}}/><div className="df-step-ticks"><span>0.001</span><span>0.05</span><span>0.5</span></div>
              </label>
            </article>
            <article>
              <h3>ISOCLINES y=x−m</h3>
              <label>
                <input
                  type="checkbox"
                  checked={iso}
                  onChange={(e) => setIso(e.target.checked)}
                />{" "}
                Show isoclines
              </label>
              {[-2, -1, 0, 1, 2].map((m, i) => (
                <label key={m}>
                  <input
                    type="checkbox"
                    checked={levels.includes(m)}
                    onChange={(e) =>
                      setLevels((old) =>
                        e.target.checked
                          ? [...old, m].sort()
                          : old.filter((n) => n !== m),
                      )
                    }
                  />
                  <span style={{ color: colors[i] }}>m={m}</span><i style={{borderColor:colors[i]}}/>
                </label>
              ))}
            </article>
            <article>
              <h3>VIEW OPTIONS</h3>
              <label>
                <input
                  type="checkbox"
                  checked={axes}
                  onChange={(e) => setAxes(e.target.checked)}
                />{" "}
                Show axes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={grid}
                  onChange={(e) => setGrid(e.target.checked)}
                />{" "}
                Show grid
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={values}
                  onChange={(e) => setValues(e.target.checked)}
                />{" "}
                Show slope value at probe
              </label>
              <label>
                Field density
                <select
                  aria-label="Field density" value={density}
                  onChange={(e) =>
                    setDensity(e.target.value as "Sparse" | "Dense")
                  }
                >
                  <option>Sparse</option>
                  <option>Dense</option>
                </select>
              </label>
            </article>
          </aside>
          <div className="df-visual">
            <svg viewBox="0 0 600 560" role="img" aria-label="Interactive direction field" onPointerDown={event=>{if(event.target instanceof SVGCircleElement)return;graphPoint(event);trace();}} onPointerMove={event=>{if(dragging.current)graphPoint(event);}} onPointerUp={event=>{if(dragging.current){dragging.current=false;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);trace();}}} onPointerCancel={()=>{dragging.current=false;}} onLostPointerCapture={()=>{dragging.current=false;}}>
              {grid&&<g className="df-grid">{Array.from({length:25},(_,i)=>i-10).map(n=><g key={n}><line x1={mapX(n,zoom)} y1="15" x2={mapX(n,zoom)} y2="545" className="grid"/><line x1="20" y1={mapY(n,zoom)} x2="585" y2={mapY(n,zoom)} className="grid"/></g>)}</g>}
              {field.map(({m,...l}, i) => (
                <line key={i} data-slope={m} {...l} className="slope" />
              ))}
              {iso &&
                levels.map((m) => (
                  <line
                    key={m} data-level={m}
                    x1="20" y1={mapY((20-60)/(112*zoom)-m,zoom)}
                    x2="585" y2={mapY((585-60)/(112*zoom)-m,zoom)}
                    style={{ stroke: colors[m+2] }}
                    className="isocline"
                  />
                ))}
              {axes&&<g className="df-axes"><path d="M20 350H590 M60 545V10"/><path d="M590 350L584 347V353Z M60 10L57 16H63Z"/>{[-2,-1,0,1,2,3,4,5,6,7,8].map(n=><text key={`x${n}`} x={mapX(n,zoom)-3} y="367">{n}</text>)}{[-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9].map(n=><text key={`y${n}`} x="48" y={mapY(n,zoom)+4} textAnchor="end">{n}</text>)}<text x="587" y="342">x</text><text x="66" y="16">y</text></g>}
              {traced && (
                <>
                  <polyline points={path(exactPoints.slice(0,Math.max(1,Math.ceil(exactPoints.length*progress))))} className="exact" />
                  <polyline points={path(numerical.slice(0,Math.max(1,Math.ceil(numerical.length*progress))))} className="numerical" />
                </>
              )}
              <circle
                cx={mapX(probe.x, zoom)}
                cy={mapY(probe.y, zoom)}
                r="7"
                tabIndex={0}
                role="slider" aria-label="Direction field probe" aria-valuetext={`${probe.x}, ${probe.y}`} onPointerDown={event=>{event.stopPropagation();dragging.current=true;event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);event.preventDefault();}}
                onKeyDown={key}
              />
              {values && (
                <text x={mapX(probe.x, zoom) + 10} y={mapY(probe.y, zoom) - 10}>
                  ({fmt(probe.x, 2)}, {fmt(probe.y, 2)}) m={fmt(slope, 2)}
                </text>
              )}
            </svg>
            <div className="df-zoom">
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.25, fmt(z + 0.05, 2)))}
              >
                <Plus />
              </button>
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.75, fmt(z - 0.05, 2)))}
              >
                <Minus />
              </button>
              <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
            </div>
            <div className="df-readouts">
              <article>
                <h3>Current probe</h3>
                <p>
                  (x,y)=({show(probe.x,3)}, {show(probe.y,3)})
                </p>
                <p>Slope m=x−y={show(slope,3)}</p>
                <p>
                  Tangent: y={show(slope,3)}(x−{fmt(probe.x, 2)})+
                  {fmt(probe.y, 2)}
                </p>
              </article>
              <article>
                <h3>
                  Exact solution (through ({initial.x},{initial.y}))
                </h3>
                <p className="formula">
                  <MathExpression value={exactFormula}/>
                </p>
                <table>
                  <tbody>
                    <tr>
                      <th>x</th>
                      {errors.map((r) => (
                        <td key={r.x}>{r.x}</td>
                      ))}
                    </tr>
                    <tr>
                      <th>y exact</th>
                      {errors.map((r) => (
                        <td key={r.x}>{show(r.exact)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </article>
            </div>
          </div>
        </div>
        <div className="df-error">
          <div>
            <h3>Numerical vs Exact ({method})</h3>
            <p>Step size h={h}</p>
            <table>
              <tbody>
                <tr>
                  <th>x</th>
                  {errors.map((r) => (
                    <td key={r.x}>{r.x}</td>
                  ))}
                </tr>
                <tr>
                  <th>y ({method})</th>
                  {errors.map((r) => (
                    <td key={r.x}>{show(r.euler)}</td>
                  ))}
                </tr>
                <tr>
                  <th>y (Exact)</th>
                  {errors.map((r) => (
                    <td key={r.x}>{show(r.exact)}</td>
                  ))}
                </tr>
                <tr>
                  <th>Error</th>
                  {errors.map((r) => (
                    <td key={r.x}>{show(r.error)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <aside>
            <p>Max |error| on [0,4]: {fmt(maxError)}</p>
            <p>Mean |error|: {fmt(meanError)}</p>
            <p>ⓘ Decrease step size h for higher accuracy.</p>
          </aside>
        </div>
      </section>
      <section className="df-explain">
        <article>
          <h3>WHAT DIRECTION FIELDS SHOW</h3>
          <ul>
            <li>Each short segment shows slope y′=x−y.</li>
            <li>They describe LOCAL behavior only.</li>
            <li>A solution curve follows the slopes.</li>
          </ul>
        </article>
        <article className="warn">
          <h3>⚠ &nbsp; COMMON MISCONCEPTION</h3>
          <p>
            The little line segments are NOT solution curves. They do not
            connect to form trajectories.
          </p>
          <p>
            A solution curve is a smooth path tangent to the field everywhere.
          </p><MisconceptionSketch/>
        </article>
      </section>
      <section className="df-challenge">
        <h3>♧ &nbsp; PREDICTION CHALLENGE</h3>
        <p>
          Without using trace, predict how the solution through (2,2) moves as x
          increases.
        </p>
        <div>
          {[
            "Upward and getting steeper",
            "Upward and flattening",
            "Downward and getting steeper",
            "Downward and flattening",
          ].map((v,index) => (
            <label key={v}>
              <input
                type="radio"
                name="df10192" aria-label={v} data-letter={String.fromCharCode(65+index)}
                checked={prediction === v}
                onChange={()=>{setPrediction(v);setFeedback("");}}
              />
              {v}
            </label>
          ))}
        </div>
        <button
          onClick={() =>
            setFeedback(
              prediction === "Upward and getting steeper"
                ? "Correct: initially y′=0, then x outgrows y and the slope becomes positive."
                : "Compare x and y immediately to the right of (2,2).",
            )
          }
        >
          Check answer
        </button>
        {tips && <p>Hint: compare x and y at points to the right of (2,2).</p>}
        {feedback && (
          <strong role="status"
            className={feedback.startsWith("Correct") ? "correct" : "incorrect"}
          >
            {feedback}
          </strong>
        )}
      </section>
      <section className="df-lower">
        {[
          [
            "LEARN",
            "What is a direction field?",
            "How to read slope at a point",
            "What are isoclines?",
            "How to trace solutions",
            "Exact vs numerical solutions",
          ],
          [
            "EXPLORE",
            "Change initial point and trace",
            "Adjust step size h",
            "Toggle isoclines",
            "Zoom and inspect slopes",
            "Compare Euler with exact",
          ],
          [
            "PRACTICE",
            "Trace from different points",
            "Predict curve behavior",
            "Estimate slopes",
            "Improve accuracy",
            "Interpret results",
          ],
          [
            "EXTEND",
            "Try other equations",
            "Observe equilibrium",
            "Find where slope = 0",
            "Investigate stability",
            "Verify exact forms",
          ],
        ].map((a,index) => (
          <article key={a[0]}>
            <h3>{index===0?<BookOpen/>:index===1?<Compass/>:index===2?<ClipboardCheck/>:<ListTree/>}{a[0]}</h3>
            <ol>
              {a.slice(1).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </article>
        ))}
      </section>
      <Link
        className="df-prev"
        to="/lessons/school/class-12/class-12-differential-equations-general-and-particular-solutions"
      >
        ← General and Particular Solutions
      </Link>

      

    </main>
  );
}
function MisconceptionSketch(){return <svg className="df-misconception-sketch" viewBox="0 0 270 110" role="img" aria-label="Separate slope marks are not connected trajectories; a solution is tangent to the field">{Array.from({length:120},(_,i)=>{const x=8+(i%20)*13,y=9+Math.floor(i/20)*16,dy=-.008*(x-130)*3;return <path key={i} d={`M${x-3} ${y-dy}l6 ${2*dy}`} stroke="#bfcde0" strokeWidth=".8"/>;})}<path d="M5 85L35 92L67 83L92 91L120 77" stroke="#c74758" fill="none" strokeDasharray="4 3"/><path d="M140 99.6Q202.5 94.6 265 27.1" stroke="#1682de" strokeWidth="2" fill="none"/><path d="M56 38L72 58M72 38L56 58" stroke="#e03648" strokeWidth="2.5"/><path d="M211 90L219 98L239 79" stroke="#129b61" strokeWidth="2.5" fill="none"/></svg>;}
const colors = ["#ff416c", "#2997e8", "#12a36d", "#ff9a24", "#8538ef"];
