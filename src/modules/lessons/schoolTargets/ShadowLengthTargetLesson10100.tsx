import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Target,
  Triangle,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ShadowLengthTargetLesson10100.css";
import{shadowLengthModel,shadowFromSceneX,displayLength}from "./shadowLengthModel";
import MathExpression from "../../../components/ui/MathExpression";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

function ShadowTriangle({angle=45,tree=false,sloped=false,label='h'}:{angle?:number;tree?:boolean;sloped?:boolean;label?:string}){const t=Math.tan(angle*Math.PI/180),run=Math.min(180,90/t),rise=run*t,x=40,y=115;return <svg className="slm10100-small-diagram" viewBox="0 0 260 155" role="img" aria-label={sloped?'Sloped ground is not a right triangle':tree?'Tree and shadow triangle':'Right triangle for height and shadow'}><path d={`M${x} ${y-rise}V${y}H${x+run}Z`} fill="none" stroke="#263750" strokeWidth="1.5" strokeDasharray={tree?'4 3':undefined}/>{tree&&<g><path d="M40 115V45" stroke="#916035" strokeWidth="8"/><path d="M40 18C5 18 9 48 14 56C2 76 21 87 40 82C65 89 85 68 69 54C79 35 62 15 40 18" fill="#76b93f" stroke="#40802d"/></g>}{sloped&&<path d={`M${x} ${y}L${x+run} ${y-25}`} stroke="#ad8c52" strokeWidth="9"/>}{!sloped&&<path d={`M40 105H50V115`} fill="none" stroke="#263750"/>}<path d={`M${x+run-20} 115 Q${x+run-20} 105 ${x+run-16} 103`} fill="none" stroke="#263750"/><text x="20" y={y-rise/2}>{label}</text><text x={x+run/2} y="140">s</text><text x={x+run-38} y="104">θ</text></svg>;}

export default function ShadowLengthTargetLesson10100({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(45);
  const [shadow, setShadow] = useState(6);
  const [unit, setUnit] = useState<"m" | "cm">("m");
  const [tab, setTab] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const {height:exactHeight,tan,endpointX,objectX,groundY,topY:objectTopY,sunX,sunY}=shadowLengthModel(angle,shadow);
  const height=exactHeight??0,shadowDisplay=displayLength(shadow,unit),heightDisplay=displayLength(height,unit);
  const mainRef=useRef<HTMLElement>(null);
  const [answer,setAnswer]=useState(''),[checked,setChecked]=useState(false);
  const challengeHeight = round(8.4 * (1.5 / 2));

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setA=(value:number)=>{if(Number.isFinite(value))setAngle(Math.max(10,Math.min(80,round(value,1))));};
  const setS=(value:number)=>{if(Number.isFinite(value))setShadow(Math.max(.5,Math.min(20,round(value,2))));};
  const reset = () =>
    act(() => {
      setAngle(45);
      setShadow(6);
      setUnit("m");setDragging(false);setAnswer('');setChecked(false);setTab(0);
    });
  const updateShadow = (event: PointerEvent<SVGSVGElement>) => {
    const m=svgRef.current?.getScreenCTM();if(!m)return;
    const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());setS(shadowFromSceneX(angle,pt.x));
  };

  const navigateTab=(index:number)=>{act(()=>setTab(index));const selectors=['.slm10100-lab','.slm10100-theory','.slm10100-examples','.slm10100-calc','.slm10100-practice'];mainRef.current?.querySelector(selectors[index])?.scrollIntoView({behavior:'smooth',block:'start'});};
  return (
    <section
      className="slm10100-page"
      data-testid="school-mockup-0774"
      data-object-model="dedicated-shadow-similar-triangle-engine"
      data-angle={round(angle)}
      data-shadow={round(shadow)}
      data-height={round(height)} data-exact-height={height}
      data-unit={unit} data-display-shadow={shadowDisplay} data-display-height={heightDisplay}
      data-ratio={round(tan,4)} data-exact-ratio={tan}
      data-challenge-height={challengeHeight}
      data-actions={actions}
    >
      <div className="slm10100-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <Link className="slm10100-school" to="/lessons/school">← School lessons</Link>
        <h1>Shadow Length Modelling</h1>
        <p>Use shadow length and solar elevation to determine object height.</p>
        <div>
          <span>Class 10</span>
          <span>Trigonometry Applications</span>
          <span>Level: Intermediate</span>
          <span>15–20 min</span>
        </div>
      </div>

      <div className="slm10100-tabs" role="group" aria-label="Lesson sections">
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
        <section className="slm10100-lab">
          <article className="slm10100-scene">
            <div className="slm10100-heading">
              <h2>MODEL THE SCENE</h2>
              <span>
                <Triangle /> Same sun, similar triangles
              </span>
            </div>
            <svg
              ref={svgRef}
              viewBox="0 0 680 390"
              aria-label="Interactive object and shadow model"
              onPointerMove={(event) => dragging && updateShadow(event)}
              onPointerUp={event=>{if(dragging)updateShadow(event);act(()=>setDragging(false));}}
              onPointerCancel={()=>setDragging(false)}
            >
              <defs><marker id="slm10100-dimension" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0L6 3L0 6Z" fill="#0872d1"/></marker></defs>
              <g className="slm10100-sun" transform={`translate(${sunX-90} ${sunY-72})`}>
                <circle cx="90" cy="72" r="25" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => {
                  const radians = (degree * Math.PI) / 180;
                  return (
                    <line
                      key={degree}
                      x1={90 + Math.cos(radians) * 34}
                      y1={72 + Math.sin(radians) * 34}
                      x2={90 + Math.cos(radians) * 47}
                      y2={72 + Math.sin(radians) * 47}
                    />
                  );
                })}
              </g>
              <line
                className="slm10100-ground"
                x1="170"
                y1={groundY}
                x2="630"
                y2={groundY}
              />
              <line
                className="slm10100-object"
                x1={objectX}
                y1={groundY}
                x2={objectX}
                y2={objectTopY}
              />
              <line
                className="slm10100-ray"
                x1={sunX}
                y1={sunY}
                x2={endpointX}
                y2={groundY}
              />
              <line
                className="slm10100-hypotenuse"
                x1={objectX}
                y1={objectTopY}
                x2={endpointX}
                y2={groundY}
              />
              <path className="slm10100-right" d={`M210 307h18v18`} />
              <path
                className="slm10100-angle"
                d={`M${endpointX-Math.min(44,(endpointX-objectX)*.35)} ${groundY} A${Math.min(44,(endpointX-objectX)*.35)} ${Math.min(44,(endpointX-objectX)*.35)} 0 0 1 ${endpointX-Math.min(44,(endpointX-objectX)*.35)*Math.cos(angle*Math.PI/180)} ${groundY-Math.min(44,(endpointX-objectX)*.35)*Math.sin(angle*Math.PI/180)}`}
              />
              <circle cx={objectX} cy={groundY} r="7" />
              <circle cx={objectX} cy={objectTopY} r="7" />
              <circle
                className="slm10100-handle"
                cx={endpointX}
                cy={groundY}
                r="11"
                role="slider"
                tabIndex={0}
                aria-label="Shadow endpoint"
                aria-valuemin={0.5}
                aria-valuemax={20}
                aria-valuenow={shadow}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setS(shadow - 0.5));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setS(shadow + 0.5));
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    act(() => setS(6));
                  }
                }}
              />
              <text x="198" y="345">
                0
              </text>
              <text className="slm10100-solar" x="290" y="46">
                Solar elevation (θ)
              </text>
              <text className="slm10100-solar-value" x="315" y="76">
                {angle.toFixed(1)}°
              </text>
              <text textAnchor="end" x={objectX-18} y="222">
                Object (vertical)
              </text>
              <text className="slm10100-height-text" textAnchor="end" x={objectX-18} y="250">
                h = {heightDisplay.toFixed(2)} {unit}
              </text>
              <text className="slm10100-angle-text" x={endpointX - 120} y="307">
                θ = {angle.toFixed(1)}°
              </text>
              <line className="slm10100-dimension" x1={objectX} x2={endpointX} y1="350" y2="350" markerStart="url(#slm10100-dimension)" markerEnd="url(#slm10100-dimension)" stroke="#0872d1" strokeWidth="2"/>
              <text
                className="slm10100-shadow-text"
                textAnchor="middle" x={(objectX + endpointX) / 2}
                y="370"
              >
                Shadow length: {shadowDisplay.toFixed(2)} {unit}
              </text>
            </svg>
          </article>

          <aside className="slm10100-controls">
            <h2>CONTROLS</h2>
            <label>
              <b>Solar elevation (θ)</b>
              <strong>{angle.toFixed(1)}°</strong>
              <input
                aria-label="Solar elevation"
                type="range"
                min="10"
                max="80"
                step="0.1"
                value={angle}
                onChange={(event) => act(() => setA(+event.target.value))}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setA(angle - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setA(angle + 1));
                  }
                }}
              />
              <small>
                10° <span>80°</span>
              </small>
            </label>
            <label>
              <b>Shadow length (s)</b>
              <strong>
                {shadowDisplay.toFixed(2)} {unit}
              </strong>
              <input
                aria-label="Shadow length"
                aria-valuetext={`${shadowDisplay.toFixed(2)} ${unit}`}
                type="range"
                min="0.5"
                max="20"
                step="0.01"
                value={shadow}
                onChange={(event) => act(() => setS(+event.target.value))}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setS(shadow - 0.5));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setS(shadow + 0.5));
                  }
                }}
              />
              <small>
                {displayLength(.5,unit)} {unit} <span>{displayLength(20,unit)} {unit}</span>
              </small>
            </label>
            <div className="slm10100-units">
              <b>Units</b>
              <button
                className={unit === "m" ? "active" : ""}
                aria-pressed={unit==='m'}
                onClick={() => act(() => setUnit("m"))}
              >
                m
              </button>
              <button
                className={unit === "cm" ? "active" : ""}
                aria-pressed={unit==='cm'}
                onClick={() => act(() => setUnit("cm"))}
              >
                cm
              </button>
            </div>
            <section>
              <h3>INSTANT RESULT</h3>
              <p>Object height (h)</p>
              <strong>
                {heightDisplay.toFixed(2)} {unit}
              </strong>
              <p>Formula: <MathExpression value={String.raw`\tan \theta=\frac{h}{s}`}/></p>
            </section>
            <button className="slm10100-reset" onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </aside>
        </section>

        <section className="slm10100-calc">
          <article>
            <h2>SIMILAR TRIANGLE COMPARISON</h2>
            <div className="slm10100-triangles"><div>Reference (sun)<ShadowTriangle angle={angle}/></div><b>∼</b><div>Your scene<ShadowTriangle angle={angle}/></div></div>
            <p>The same solar angle fixes the same height-to-shadow ratio.</p>
          </article>
          <article>
            <h2>HEIGHT CALCULATION</h2>
            <p><MathExpression value={String.raw`\tan \theta=\frac{h}{s}`}/></p>
            <p><MathExpression value={String.raw`h=s\tan \theta`}/></p>
            <p>
              = {shadowDisplay.toFixed(2)} × tan({angle.toFixed(1)}°)
            </p>
            <strong>
              = {heightDisplay.toFixed(2)} {unit}
            </strong>
          </article>
          <article className="slm10100-check">
            <h2>CHECK</h2>
            <p>
              tan {angle.toFixed(1)}° ={" "}
              {tan.toFixed(4)}
            </p>
            <p>h/s = {(height / shadow).toFixed(4)}</p>
            <strong>
              <CheckCircle2 /> Ratios agree.
            </strong>
          </article>
        </section>

        <section className="slm10100-theory">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              Sun rays are effectively parallel. The object and its shadow form
              a right triangle with angle θ.
            </p>
            <p>
              Every object measured under the same sun forms a similar right
              triangle.
            </p>
            <strong><MathExpression value={String.raw`\tan \theta=\frac{\text{height}}{\text{shadow length}}`}/></strong>
          </article>
          <article className="slm10100-mistake">
            <h2>
              <AlertTriangle /> COMMON MISCONCEPTION
            </h2>
            <p>
              Using a sloped surface as the base breaks the right angle. The
              model assumes horizontal ground.
            </p>
            <ShadowTriangle angle={35} tree sloped/>
            <strong>Keep the base horizontal.</strong>
          </article>
        </section>

        <section className="slm10100-examples">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              A vertical pole casts a 6.0 m shadow when solar elevation is 45°.
              Find its height.
            </p>
            <ShadowTriangle angle={45}/><p><MathExpression value={String.raw`\tan45^\circ=\frac{h}{6}`}/></p>
            <p>h = 6.0 × 1</p>
            <strong>Height = 6.0 m</strong>
          </article>
          <article>
            <h2>REFERENCE STICK</h2>
            <p>A 1.5 m stick casts a 2.0 m shadow. Find the solar elevation.</p>
            <ShadowTriangle angle={Math.atan(.75)*180/Math.PI} label="1.5 m"/><p><MathExpression value={String.raw`\tan \theta=\frac{1.5}{2}=0.75`}/></p>
            <strong>θ = 36.87°</strong>
          </article>
          <article className="slm10100-practice">
            <h2>
              <Target /> PRACTICE CHALLENGE
            </h2>
            <p>
              A tree casts an 8.40 m shadow. A 1.5 m stick casts a 2.00 m shadow
              at the same time.
            </p>
            <ShadowTriangle angle={Math.atan(.75)*180/Math.PI} tree/>
            <p>h = 8.40 × (1.5/2.0)</p>
            <strong>Estimated height = {challengeHeight.toFixed(2)} m</strong>
            <label className="slm10100-practice-entry">Your height estimate (m)<input aria-label="Practice height estimate" type="number" step="0.01" value={answer} onChange={event=>{setAnswer(event.target.value);setChecked(false);}}/></label><button className="slm10100-check-answer" onClick={()=>act(()=>setChecked(true))}>Check estimate</button>{checked&&<p role="status">{answer.trim()!==''&&Number.isFinite(Number(answer))&&Math.abs(Number(answer)-challengeHeight)<=.02?'Correct: the height is 6.30 m.':'Use the common ratio 1.5 / 2.0, then multiply by 8.4.'}</p>}
          </article>
        </section>

        <nav className="slm10100-next">
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression">
            <ArrowLeft />{" "}
            <span>
              Angle of Depression
            </span>
          </Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-two-observer-height-problems">
            <span>
              Two-Observer Height Problems
            </span>
            <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="slm10100-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
