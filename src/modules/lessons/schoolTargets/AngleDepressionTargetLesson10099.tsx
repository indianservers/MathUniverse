import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import depressionScene from "../../../assets/lessons/angle-depression-lighthouse.png";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleDepressionTargetLesson10099.css";
import{angleDepressionModel,depressionDistanceFromX}from "./angleDepressionModel";
import MathExpression from "../../../components/ui/MathExpression";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
function DepressionRange({label,value,min,max,onChange,homeValue}:{label:string;value:number;min:number;max:number;onChange:(v:number)=>void;homeValue?:number}){return <label className="aod10099-range"><b>{label}</b><input aria-label={label} type="range" min={min} max={max} step=".01" value={value} onChange={e=>onChange(+e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();onChange(Math.max(min,Math.min(max,round(value+(e.key==='ArrowRight'?1:-1)))));}if(e.key==='Home'&&homeValue!==undefined){e.preventDefault();onChange(homeValue);}}}/><strong>{value.toFixed(2)} m</strong><small>Range: {min} – {max} m</small></label>;}
function DepressionMini({complement=false}:{complement?:boolean}){return <svg className="aod10099-mini" viewBox="0 0 270 170" role="img" aria-label={complement?'Complementary angle measured from the vertical':'Alternate interior angles with parallel horizontal lines'}><path d="M25 30H250M25 140H250" fill="none" stroke="#176ed8" strokeDasharray="5 4"/><path d="M25 30L215 140" stroke="#df3838" fill="none" strokeWidth="2"/><path d="M58 30 A33 33 0 0 1 53.58 46.5 L25 30Z" fill="#fff0dc" stroke="#eb9a1c"/><path d="M182 140 A33 33 0 0 1 186.42 123.5 L215 140Z" fill="#ddf3e7" stroke="#15945d"/><circle cx="25" cy="30" r="4"/><circle cx="215" cy="140" r="4"/><text x="14" y="18">A</text><text x="215" y="159">B</text><text x="247" y="25">AX</text><text x="247" y="140">CB</text><text x="65" y="48">{complement?'30°':'∠A'}</text><text x="168" y="128">{complement?'30°':'∠B'}</text>{complement&&<><path d="M25 30V140" stroke="#176ed8" strokeDasharray="4 3"/><path d="M25 72 Q43 73 59 50" fill="none" stroke="#eb9a1c"/><text x="32" y="93">60°</text></>}</svg>;}

export default function AngleDepressionTargetLesson10099({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [height, setHeight] = useState(40);
  const [distance, setDistance] = useState(40 / Math.tan(Math.PI / 6));
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const sceneRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const {angle:exactAngle,observerY,waterY,boatX,challengeComplete}=angleDepressionModel(height,distance);
  const angle=exactAngle??0,equalAngles=true,challengeDifference=Math.abs(distance-40);
  const mainRef=useRef<HTMLElement>(null);
  const setH=(v:number)=>{if(Number.isFinite(v))setHeight(Math.max(10,Math.min(100,round(v))));};
  const setD=(v:number)=>{if(Number.isFinite(v))setDistance(Math.max(5,Math.min(200,round(v))));};
  const updateBoat=(event:PointerEvent<SVGSVGElement>)=>{const m=sceneRef.current?.getScreenCTM();if(!m)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());setD(depressionDistanceFromX(height,pt.x));};
  const rad=angle*Math.PI/180,arcRadius=Math.min(50,(boatX-120)*.4),artScale=(waterY-observerY)/670;
  const reset = () =>
    act(() => {
      setHeight(40);
      setDistance(40 / Math.tan(Math.PI / 6));setDragging(false);setTab(0);
    });
  const artWidthFactor=Math.min(1,(boatX-120)/320),boatArtFactor=Math.min(1,(boatX-120)/70),closeBoat=boatX-120<110;
  const navigateTab=(index:number)=>{act(()=>setTab(index));const selectors=['.aod10099-scene','.aod10099-cards','.aod10099-cards article:nth-child(2)','.aod10099-cards article:nth-child(2)','.aod10099-challenge'];mainRef.current?.querySelector(selectors[index])?.scrollIntoView({behavior:'smooth',block:'start'});};

  return (
    <section
      className="aod10099-page"
      data-testid="school-mockup-0773"
      data-object-model="dedicated-angle-depression-parallel-lines-engine"
      data-height={round(height)}
      data-distance={round(distance)}
      data-exact-distance={distance} data-exact-angle={angle}
      data-depression-angle={round(angle)}
      data-elevation-angle={round(angle)}
      data-equal-angles={String(equalAngles)}
      data-challenge-difference={round(challengeDifference)}
      data-challenge-complete={String(challengeComplete)}
      data-actions={actions}
    >
      <div className="aod10099-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <Link className="aod10099-school" to="/lessons/school">← School lessons</Link>
        <h1>Angle of Depression</h1>
        <p>
          Relate a downward line of sight to the equal alternate angle of
          elevation.
        </p>
        <div>
          <span>24 min</span>
          <span>INTERACTIVE</span>
          <span>VISUAL</span>
          <span>CLASS 10</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div className="aod10099-tabs" role="group" aria-label="Lesson sections">
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
        <section className="aod10099-scene">
          <div className="aod10099-heading">
            <h2>OBSERVATION SCENE</h2>
            <p>
              Adjust the height or move the boat to see how the angles stay
              equal.
            </p>
          </div>
          <div className="scene-grid">
            <aside>
              <DepressionRange
                label="Observer height"
                value={height}
                min={10}
                max={100}
                onChange={v=>act(()=>setH(v))}
              />
              <DepressionRange
                label="Boat position"
                value={distance}
                min={5}
                max={200}
                homeValue={height}
                onChange={v=>act(()=>setD(v))}
              />
              <section className="measure">
                <h3>Live Measurements</h3>
                <p>
                  Angle of depression (∠A)<b>{angle.toFixed(1)}°</b>
                </p>
                <p>
                  Angle of elevation (∠B)<b>{angle.toFixed(1)}°</b>
                </p>
                <strong>
                  <CheckCircle2 /> ∠A = ∠B (alternate angles)
                </strong>
              </section>
            </aside>
            <article>
              <div className="scene-image">
                <svg
                  ref={sceneRef}
                  viewBox="0 0 700 430"
                  aria-label="Draggable boat in an angle of depression scene"
                  onPointerMove={(event) => dragging && updateBoat(event)}
                  onPointerUp={event=>{if(dragging)updateBoat(event);act(()=>setDragging(false));}}
                  onPointerCancel={()=>setDragging(false)}
                >
                  <defs><linearGradient id="aod10099-sky" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#e7f6ff"/></linearGradient><linearGradient id="aod10099-sea" x2="0" y2="1"><stop stopColor="#72c7e7"/><stop offset="1" stopColor="#effaff"/></linearGradient><clipPath id="aod10099-lighthouse-art"><path d="M229 32 L249 67 L266 89 L290 130 L289 159 L269 173 L299 510 L455 552 L478 745 L579 820 L0 890 L0 490 L100 495 L160 510 L178 171 L168 151 L168 129 L187 88 L215 63Z"/></clipPath><marker id="aod10099-dimension" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0L6 3L0 6Z" fill="#172743"/></marker></defs>
                  <rect width="700" height="430" fill="url(#aod10099-sky)"/><rect y={waterY} width="700" height={430-waterY} fill="url(#aod10099-sea)"/>
                  <g style={{display:closeBoat?'none':undefined}} transform={`translate(${120-229*artScale*artWidthFactor} ${observerY-130*artScale}) scale(${artScale*artWidthFactor} ${artScale})`}><image href={depressionScene} width="1672" height="941" clipPath="url(#aod10099-lighthouse-art)"/></g>
                  {closeBoat&&<text className="aod10099-view-note" x="350" y={observerY+60}>Close-range schematic</text>}
                  {Array.from({length:8},(_,i)=><path key={i} d={`M${220+i*40} ${waterY+15+i%3*9}h35`} stroke="#bfe8f4" strokeWidth="2"/>)}
                  <g className="aod10099-boat" data-boat-art="true" transform={`translate(${boatX} ${waterY}) scale(${boatArtFactor})`}><path d="M-28 18H68L56 32H-16Z" fill="#b62823" stroke="#6e2929"/><path d="M10 17V-77L15 17Z" fill="#79503c"/><path d="M14-74L60 13H14Z" fill="#fffdf7" stroke="#aaa"/><path d="M8-60L-22 14H8Z" fill="#f6f6ed" stroke="#aaa"/></g>
                  <line
                    className="eye-line"
                    x1="120"
                    y1={observerY}
                    x2="660"
                    y2={observerY}
                  />
                  <line
                    className="ground-line"
                    x1="120"
                    y1={waterY}
                    x2={boatX}
                    y2={waterY}
                  />
                  <line
                    className="height-line"
                    x1="120"
                    y1={observerY}
                    x2="120"
                    y2={waterY}
                  />
                  <line
                    className="sight"
                    x1="120"
                    y1={observerY}
                    x2={boatX}
                    y2={waterY}
                  />
                  <path
                    className="angle top"
                    d={`M${120+arcRadius} ${observerY} A${arcRadius} ${arcRadius} 0 0 1 ${120+arcRadius*Math.cos(rad)} ${observerY+arcRadius*Math.sin(rad)} L120 ${observerY}Z`}
                  />
                  <path
                    className="angle bottom"
                    d={`M${boatX-arcRadius} ${waterY} A${arcRadius} ${arcRadius} 0 0 1 ${boatX-arcRadius*Math.cos(rad)} ${waterY-arcRadius*Math.sin(rad)} L${boatX} ${waterY}Z`}
                  />
                  <circle className="observer" cx="120" cy={observerY} r="5" />
                  <text x="105" y={observerY-20}>
                    A
                  </text>
                  <text x="650" y={observerY-12}>
                    X
                  </text>
                  <text className="angle-text" x="175" y={observerY+30}>
                    {angle.toFixed(1)}°
                  </text>
                  <text className="angle-text" x={closeBoat?boatX+24:boatX-90} y={waterY - 35}>
                    {angle.toFixed(1)}°
                  </text>
                  <text className="horizontal-label" x="350" y={observerY-15}>
                    Horizontal eye line
                  </text>
                  <text
                    className="horizontal-label"
                    x={closeBoat?boatX+35:(120 + boatX) / 2}
                    y={waterY - 12}
                  >
                    Horizontal ground
                  </text>
                  <text className="height-label" x="65" y={(observerY+waterY)/2}>
                    h = {height.toFixed(0)} m
                  </text>
                  <path className="aod10099-distance-dimension" d={`M120 ${waterY+42}H${boatX}`} markerStart="url(#aod10099-dimension)" markerEnd="url(#aod10099-dimension)"/>
                  <circle cx="120" cy={waterY} r="5"/><text x="110" y={waterY+24}>C</text>
                  <text
                    className="distance-label"
                    x={(120 + boatX) / 2 - 35}
                    y="398"
                  >
                    d = {distance.toFixed(2)} m
                  </text>
                  <circle
                    className="boat-handle"
                    cx={boatX}
                    cy={waterY}
                    r={Math.min(6,(boatX-120)*.22)}
                    role="slider"
                    tabIndex={0}
                    aria-label="Boat B"
                    aria-valuemin={5}
                    aria-valuemax={200}
                    aria-valuenow={round(distance)}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      act(() => setDragging(true));
                    }}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setD(distance - 1));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setD(distance + 1));
                      }
                      if (event.key === "Home") {
                        event.preventDefault();
                        act(() => setD(height));
                      }
                    }}
                  />
                  <text x={closeBoat?boatX+18:boatX-8} y={waterY+30}>
                    B
                  </text>
                </svg>
              </div>
              <footer>
                <span>∠A: Angle of depression</span>
                <span>Horizontal lines (AX ∥ CB)</span>
                <span>∠B: Angle of elevation</span>
                <span>Line of sight (AB)</span>
              </footer>
            </article>
          </div>
        </section>
        <section className="aod10099-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              AX (eye line) is parallel to CB (ground). With AB as a
              transversal, ∠A and ∠B are alternate interior angles, so they are
              equal.
            </p>
            <DepressionMini/>
            <strong>Therefore, ∠A = ∠B</strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              A lighthouse is 40 m high. The angle of depression to a boat is
              30°. Find the horizontal distance.
            </p>
            <p>
              <b>Given:</b> h=40 m, ∠A=30°
            </p>
            <p>
              <MathExpression value={String.raw`\tan \theta=\frac{h}{d}`}/><br/><MathExpression value={String.raw`\tan30^\circ=\frac{40}{d}`}/><br/><MathExpression value={String.raw`d=\frac{40}{\tan30^\circ}=69.28\,m`}/>
            </p>
            <strong>The boat is 69.28 m from the base.</strong>
          </article>
          <article className="mistake">
            <h2>
              <Lightbulb /> COMMON MISTAKE
            </h2>
            <p>
              Measuring the angle from the vertical gives the complementary
              angle.
            </p>
            <DepressionMini complement/>
            <p>
              Here 60° is from the vertical. The angle of depression is measured
              from the horizontal, so the correct angle is 30°.
            </p>
            <strong>Always measure from the horizontal eye line.</strong>
          </article>
        </section>
        <section className="aod10099-challenge">
          <article>
            <h2>
              <Target /> YOUR CHALLENGE
            </h2>
            <p>
              Move the boat to make the angle of depression 45°. What is the
              horizontal distance when the lighthouse height is 40 m?
            </p>
            <button onClick={reset}>Reset Scene</button>
          </article>
          <article>
            <h3>Set ∠A = 45°</h3>
            <p role="status" className={challengeComplete ? "success" : "pending"}>
              {challengeComplete ? (
                <>
                  <CheckCircle2 /> Great! Angle of depression = 45.0°
                </>
              ) : (
                height!==40?`Set observer height to 40 m. Current height = ${height.toFixed(2)} m.`:`Current angle = ${angle.toFixed(1)}°`
              )}
            </p>
            <p>
              Horizontal distance (d) <b>{distance.toFixed(2)} m</b>
            </p>
            <small>
              Expected: 40.00 m · Difference:{" "}
              {challengeDifference.toFixed(2)} m
            </small>
          </article>
          <article>
            <h3>Why 40 m?</h3>
            <p>When ∠A=45°, tan 45°=1.</p>
            <p>
              <MathExpression value={String.raw`d=\frac{40}{\tan45^\circ}=40\,m`}/>
            </p>
          </article>
        </section>
        <nav className="aod10099-next">
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-elevation">
            <ArrowLeft /> Angle of Elevation
          </Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-shadow-length-modelling">
            Shadow-Length Modelling <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="aod10099-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
