import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import elevationScene from "../../../assets/lessons/angle-elevation-scene-v2.png";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleElevationTargetLesson10098.css";
import{angleElevationModel,elevationAngleFromPoint}from "./angleElevationModel";
import MathExpression from "../../../components/ui/MathExpression";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
function ElevationRange({label,value,min,max,step,unit,onChange}:{label:string;value:number;min:number;max:number;step:number;unit:string;onChange:(v:number)=>void}){return <label className="aoe10098-range"><b>{label}</b><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();onChange(Math.max(min,Math.min(max,round(value+(e.key==='ArrowRight'?step:-step)))));}}}/><strong>{round(value,1)} {unit}</strong></label>;}
function ElevationMini({vertical=false}:{vertical?:boolean}){return <svg className="aoe10098-mini-diagram" viewBox="0 0 270 160" role="img" aria-label={vertical?'Complementary angle measured from vertical':'Right triangle with angle measured from horizontal'}><path d="M25 120H225V40Z" fill="none" stroke="#176edb" strokeWidth="2"/><path d="M212 120V107H225" fill="none" stroke="#176edb"/>{vertical?<><path d="M225 72 Q205 70 195 52" fill="none" stroke="#bd3340"/><text x="192" y="90">φ</text><text x="42" y="148">φ = 90° − θ</text></>:<><path d="M65 120 Q65 109 62 105" fill="none" stroke="#6830c0"/><text x="72" y="112">θ</text><text x="122" y="146">d</text><text x="238" y="85">h</text></>}</svg>;}

export default function AngleElevationTargetLesson10098({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [distance, setDistance] = useState(20);
  const [angle, setAngle] = useState(45);
  const [eyeHeight, setEyeHeight] = useState(1.6);
  const [dragging, setDragging] = useState(false);
  const [estimate, setEstimate] = useState("");
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const modelRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const {height:heightValue,total:totalValue,ax,ay,bx,by,cy,sceneAx,sceneBx,sceneAy,sceneCy,groundY,scale}=angleElevationModel(distance,angle,eyeHeight);
  const height=heightValue??0,totalHeight=totalValue??0,expected=30*Math.tan(35*Math.PI/180)+1.6;
  const estimateCorrect=checked&&estimate.trim()!==''&&Number.isFinite(Number(estimate))&&Math.abs(Number(estimate)-expected)<=.2;
  const mainRef=useRef<HTMLElement>(null);
  const [draftKey,setDraftKey]=useState<string|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState('');
  const change=(setter:(v:number)=>void,v:number,min:number,max:number)=>{if(!Number.isFinite(v))return;setter(Math.max(min,Math.min(max,round(v,2))));setChecked(false);};
  const edit=(key:string,text:string,setter:(v:number)=>void,min:number,max:number)=>{setDraftKey(key);setDraft(text);const v=text.trim()===''?NaN:Number(text);if(!Number.isFinite(v)||v<min||v>max){setError(`Enter a value from ${min} to ${max}.`);return;}setError('');act(()=>change(setter,v,min,max));};
  const blur=()=>{setDraftKey(null);setError('');};
  const updateAngleFromPointer=(event:PointerEvent<SVGSVGElement>)=>{const m=modelRef.current?.getScreenCTM();if(!m)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());change(setAngle,round(elevationAngleFromPoint(pt.x,pt.y),1),5,80);};
  const arc=(x:number,y:number,r:number)=>`M${x+r} ${y} A${r} ${r} 0 0 0 ${x+r*Math.cos(angle*Math.PI/180)} ${y-r*Math.sin(angle*Math.PI/180)}`;
  const reset = () =>
    act(() => {
      setDistance(20);
      setAngle(45);
      setEyeHeight(1.6);
      setEstimate("");
      setChecked(false);setDragging(false);setDraftKey(null);setError('');setTab(0);
    });
  const navigateTab=(index:number)=>{act(()=>setTab(index));const selectors=['.aoe10098-lab','.aoe10098-cards','.aoe10098-cards article:nth-child(2)','.aoe10098-rule','.aoe10098-challenge'];mainRef.current?.querySelector(selectors[index])?.scrollIntoView({behavior:'smooth',block:'start'});};

  return (
    <section
      className="aoe10098-page"
      data-testid="school-mockup-0772"
      data-object-model="dedicated-angle-elevation-surveying-triangle-engine"
      data-distance={round(distance)}
      data-angle={round(angle)}
      data-eye-height={round(eyeHeight)}
      data-height={round(height)} data-exact-height={height} data-exact-total={totalHeight}
      data-total-height={round(totalHeight)}
      data-challenge-expected={round(expected)}
      data-estimate-correct={String(estimateCorrect)}
      data-actions={actions}
    >
      <div className="aoe10098-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <Link className="aoe10098-school" to="/lessons/school">← School lessons</Link><button className="aoe10098-reset" onClick={reset}>Reset lesson</button>
        <h1>Angle of Elevation</h1>
        <p>
          Model heights and horizontal distances using an upward line of sight.
        </p>
        <div>
          <span>24 min</span>
          <span>Intermediate</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div className="aoe10098-tabs" role="group" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              aria-pressed={tab===index}
              onClick={() => navigateTab(index)}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <main ref={mainRef}>
        <section className="aoe10098-lab">
          <article className="scene">
            <div className="aoe10098-heading">
              <h2>Real-world scene</h2>
              <b>Observer looking up at a tower</b>
            </div>
            <div className="scene-image">
              <svg
                viewBox="0 0 500 360"
                aria-label="Line of sight over the tower scene"
              >
                <defs><linearGradient id="aoe10098-sky" x2="0" y2="1"><stop stopColor="#e0f5ff"/><stop offset="1" stopColor="#f7fcff"/></linearGradient><clipPath id="aoe10098-tower-art"><path d="M1120 20H1125V115L1140 130L1128 145V216C1210 224 1234 346 1150 374L1154 861L1190 870L1196 965H1048L1057 870L1080 862L1094 374C1018 348 1020 252 1090 220L1116 216V145L1105 132L1114 116Z"/></clipPath><clipPath id="aoe10098-observer-art"><path d="M190 595H305V722H267L260 985L292 1004V1024H188L194 805L207 726L190 690Z"/></clipPath><marker id="aoe10098-dimension" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0L6 3L0 6Z" fill="#6830c0"/></marker></defs>
                <rect width="500" height="360" fill="url(#aoe10098-sky)"/>{Array.from({length:18},(_,i)=><rect key={i} x={i*29} y={280-i%4*8} width="22" height={50+i%4*8} fill="#c7e6f4"/>)}<rect y={groundY} width="500" height="30" fill="#b5d292"/>
                <g transform={`translate(${sceneBx-1122*(groundY-sceneCy)/940} ${sceneCy-25*(groundY-sceneCy)/940}) scale(${(groundY-sceneCy)/940})`}><image href={elevationScene} width="1448" height="1086" clipPath="url(#aoe10098-tower-art)"/></g>
                <g transform={`translate(${sceneAx-285*eyeHeight*scale/380} ${sceneAy-620*eyeHeight*scale/380}) scale(${eyeHeight*scale/380})`}><image href={elevationScene} width="1448" height="1086" clipPath="url(#aoe10098-observer-art)"/></g>
                <line className="aoe10098-tower-guide" x1={sceneBx} x2={sceneBx} y1={groundY} y2={sceneCy} stroke="#263550" strokeOpacity=".35" strokeWidth="1"/>
                <line className="horizontal" x1={sceneAx} y1={sceneAy} x2={sceneBx} y2={sceneAy}/><line className="sight" x1={sceneAx} y1={sceneAy} x2={sceneBx} y2={sceneCy}/><path className="arc" d={arc(sceneAx,sceneAy,Math.min(36,(sceneBx-sceneAx)*.4))}/><circle cx={sceneAx} cy={sceneAy} r="3" fill="#176edb"/><text x={sceneAx+40} y={sceneAy-12}>θ = {round(angle,1)}°</text><text textAnchor="end" x={sceneAx-10} y={sceneAy-18}>Eye level</text><text textAnchor="end" x={sceneAx-10} y={sceneAy}>{round(eyeHeight,1)} m</text><path d={`M${sceneAx} 348H${sceneBx}`} stroke="#6830c0" markerStart="url(#aoe10098-dimension)" markerEnd="url(#aoe10098-dimension)"/><text textAnchor="middle" x={(sceneAx+sceneBx)/2} y="343">d = {round(distance,1)} m</text><path d={`M${sceneBx+32} ${groundY}V${sceneCy}`} stroke="#6830c0" markerStart="url(#aoe10098-dimension)" markerEnd="url(#aoe10098-dimension)"/><text x={sceneBx+38} y={(groundY+sceneCy)/2}>H</text>

              </svg>
            </div>
            <div className="scene-controls">
              <ElevationRange
                label="Horizontal distance"
                value={distance}
                min={5}
                max={100}
                step={1}
                unit="m"
                onChange={v=>act(()=>change(setDistance,v,5,100))}
              />
              <div className="aoe10098-angle-control">              <ElevationRange
                label="Angle of elevation"
                value={angle}
                min={5}
                max={80}
                step={1}
                unit="°"
                onChange={v=>act(()=>change(setAngle,v,5,80))}
              /><svg className="aoe10098-angle-gauge" viewBox="0 0 190 130" aria-label="Elevation angle gauge"><path d="M20 95A75 75 0 0 1 170 95" fill="none" stroke="#ccd5f3" strokeWidth="5"/>{Array.from({length:19},(_,i)=>{const r=Math.PI-i/18*Math.PI;return <line key={i} x1={95+68*Math.cos(r)} y1={95-68*Math.sin(r)} x2={95+79*Math.cos(r)} y2={95-79*Math.sin(r)} stroke="#216bea" strokeWidth="1.5"/>;})}<line x1="95" y1="95" x2={95+59*Math.cos(Math.PI-angle/90*Math.PI)} y2={95-59*Math.sin(Math.PI-angle/90*Math.PI)} stroke="#6730c1" strokeWidth="3"/><text x="95" y="122" textAnchor="middle">{angle}°</text><text x="12" y="115">0°</text><text x="167" y="115">90°</text></svg><div className="aoe10098-angle-buttons"><button aria-label="Decrease elevation angle" onClick={()=>act(()=>change(setAngle,angle-1,5,80))}>−</button><button aria-label="Increase elevation angle" onClick={()=>act(()=>change(setAngle,angle+1,5,80))}>+</button></div></div>

            </div>
            <div className="aoe10098-numeric"><label>Distance (m)<input aria-label="Distance value" type="number" min="5" max="100" step="any" value={draftKey==='d'?draft:distance} onChange={e=>edit('d',e.target.value,setDistance,5,100)} onBlur={blur}/></label><label>Eye height (m)<input aria-label="Eye height value" type="number" min="1" max="2.2" step="0.1" value={draftKey==='e'?draft:eyeHeight} onChange={e=>edit('e',e.target.value,setEyeHeight,1,2.2)} onBlur={blur}/><input aria-label="Eye level height" type="range" min="1" max="2.2" step="0.1" value={eyeHeight} onChange={event=>act(()=>change(setEyeHeight,+event.target.value,1,2.2))} onKeyDown={event=>{event.stopPropagation();if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();act(()=>change(setEyeHeight,eyeHeight+(event.key==='ArrowRight'?.1:-.1),1,2.2));}}}/></label></div>{error&&<p role="alert">{error}</p>}
          </article>
          <article className="model">
            <div className="aoe10098-heading">
              <h2>Right-triangle model</h2>
              <b>Linked to the scene at eye level</b>
            </div>
            <svg
              ref={modelRef}
              viewBox="0 0 480 400"
              aria-label="Draggable right-triangle elevation model"
              onPointerMove={(event) =>
                dragging && updateAngleFromPointer(event)
              }
              onPointerUp={event=>{if(dragging)updateAngleFromPointer(event);act(()=>setDragging(false));}}
              onPointerCancel={()=>setDragging(false)}
            >
              <line className="base" x1={ax} y1={ay} x2={bx} y2={by} />
              <line className="tower" x1={bx} y1={by} x2={bx} y2={cy} />
              <line className="hypotenuse" x1={ax} y1={ay} x2={bx} y2={cy} />
              <path
                className="angle-arc"
                d={arc(ax,ay,Math.min(50,(bx-ax)*.4))}
              />
              <rect
                className="right"
                x={bx - 22}
                y={by - 22}
                width="20"
                height="20"
              />
              <circle
                className="top-handle"
                cx={bx}
                cy={cy}
                r="10"
                role="slider"
                tabIndex={0}
                aria-label="Tower top C"
                aria-valuemin={5}
                aria-valuemax={80}
                aria-valuenow={round(angle)}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    act(() => setAngle(Math.min(80, angle + 1)));
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    act(() => setAngle(Math.max(5, angle - 1)));
                  }
                }}
              />
              <text x={ax - 18} y={ay + 25}>
                A
              </text>
              <text x={bx - 5} y={by + 25}>
                B
              </text>
              <text x={bx - 4} y={cy - 18}>
                C
              </text>
              <text className="theta" x={ax + 58} y={ay - 18}>
                θ
              </text>
              <text className="h" x={bx + 18} y={(by + cy) / 2}>
                h
              </text>
              <text className="d" x={(ax + bx) / 2} y={by + 38}>
                d
              </text>
            </svg>
            <section className="aoe10098-result">
              <p>Height above eye level, h</p>
              <strong>{height.toFixed(2)} m</strong>
              <hr />
              <p>Total height of tower, H = h + eye level</p>
              <b>{totalHeight.toFixed(2)} m</b>
            </section>
            <p className="consistent">
              <CheckCircle2 /> Great! The model and calculations are consistent.
            </p>
          </article>
        </section>
        <section className="aoe10098-rule">
          <h2>Rule / Theorem</h2>
          <strong><MathExpression value={String.raw`\tan \theta=\frac{\text{opposite}}{\text{adjacent}}=\frac{h}{d}`}/></strong>
          <div>
            <p>
              <b>h</b> = height above eye level
            </p>
            <p>
              <b>d</b> = horizontal distance
            </p>
            <p>
              <b>θ</b> = angle measured from the horizontal
            </p>
          </div>
          <aside>
            <b>Key idea</b>
            <p>
              If eye level is not at ground, total height H = h + eye-level
              height.
            </p>
          </aside>
        </section>
        <section className="aoe10098-cards">
          <article>
            <h2>
              <Lightbulb /> Why it works
            </h2>
            <p>
              The line of sight, horizontal distance, and vertical height form a
              right triangle.
            </p>
            <p>Using tan θ = h/d lets us find unknown heights or distances.</p>
            <ElevationMini/>
          </article>
          <article>
            <h2>Worked example</h2>
            <p>
              A person is 20 m from a tower and the angle of elevation is 45°.
              Eye level is 1.6 m.
            </p>
            <p>
              <b>Solution:</b>
            </p>
            <ul>
              <li><MathExpression value={String.raw`\tan45^\circ=\frac{h}{20}`}/></li>
              <li><MathExpression value={String.raw`1=\frac{h}{20}`}/></li>
              <li>h = 20 m</li>
              <li>H = h + 1.6 = 21.6 m</li>
            </ul>
            <strong>Answer: Total height = 21.6 m</strong>
          </article>
          <article className="mistake">
            <h2>
              <AlertTriangle /> Common misconception
            </h2>
            <p>
              The angle of elevation is measured from the horizontal, not the
              vertical.
            </p>
            <p className="correct">Correct ✓</p>
            <ElevationMini/><p className="incorrect">Incorrect: measured from vertical ✕</p><ElevationMini vertical/>
          </article>
        </section>
        <section className="aoe10098-challenge">
          <article>
            <h2>Your challenge</h2>
            <p>
              A person is 30 m from a tower. The angle of elevation to the top
              is 35°. Eye level is 1.6 m. Estimate the total height.
            </p>
          </article>
          <article>
            <h3>Given</h3>
            <p>
              d = 30 m<br />θ = 35°
              <br />
              Eye level = 1.6 m
            </p>
          </article>
          <article>
            <label>
              Your estimate
              <input
                aria-label="Tower height estimate"
                type="number" step="0.01"
                value={estimate}
                onChange={(event) =>
                  act(() => {
                    setEstimate(event.target.value);
                    setChecked(false);
                  })
                }

              />
            </label>
            <button onClick={() => act(() => setChecked(true))}>
              Check answer
            </button>
          </article>
          <article>
            <h3>Expected result</h3>
            <strong>H ≈ {expected.toFixed(2)} m</strong><small>Acceptable range: {(expected-.2).toFixed(2)}–{(expected+.2).toFixed(2)} m</small>
            {checked && (
              <p role="status" className={estimateCorrect ? "correct" : "incorrect"}>
                {estimateCorrect
                  ? "Correct. Your estimate matches the model."
                  : "Use H = 30 tan(35°) + 1.6."}
              </p>
            )}
          </article>
        </section>
        <nav className="aoe10098-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-tangent-lengths-from-an-external-point"><ArrowLeft/> Tangent Lengths from an External Point</Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression">
            Angle of Depression <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="aoe10098-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
