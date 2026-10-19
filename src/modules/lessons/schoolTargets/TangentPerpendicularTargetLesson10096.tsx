import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TangentPerpendicularTargetLesson10096.css";
import{tangentPerpendicularModel,visibleLineHandle,normalizeCircleAngle,normalizeCircleLine}from "./tangentPerpendicularModel";
import{tangentRightAngle}from "./tangentLengthsModel";
import MathExpression from "../../../components/ui/MathExpression";


type DragTarget = "point" | "line" | null;
const RADIUS = 6;
const round = (value: number, places = 1) =>
  Math.round(value * 10 ** places) / 10 ** places;
const normalize=normalizeCircleAngle,lineNormalize=normalizeCircleLine;
const pathMark=(T:{x:number;y:number},O:{x:number;y:number},P:{x:number;y:number},size=14)=>tangentRightAngle(T,O,P,size).map((v,i)=>`${i?'L':'M'}${v.x},${v.y}`).join(' ');
function RadiusFigure({tAngle=270,lineAngle=0,offset=0,minimum=false}:{tAngle?:number;lineAngle?:number;offset?:number;minimum?:boolean}){const m=tangentPerpendicularModel(tAngle,lineAngle,offset),s=(p:{x:number;y:number})=>({x:160+p.x*15,y:130-p.y*15}),O=s({x:0,y:0}),T=s(m.t),F=s(m.foot),B=s(m.base),u={x:m.direction.x,y:-m.direction.y};return <svg className="tpr10096-mini-diagram" viewBox="0 0 320 280" role="img" aria-label={m.count===2?'Secant with two intersections':'Radius and line construction'}><circle cx="160" cy="130" r="90" fill="#fff" stroke="#126ee2"/><path d={`M${B.x-u.x*190} ${B.y-u.y*190}L${B.x+u.x*190} ${B.y+u.y*190}`} stroke="#8a24d0" strokeWidth="2"/><path d={`M${O.x} ${O.y}L${T.x} ${T.y}`} stroke="#126ee2" strokeWidth="2"/>{!m.onLine&&<path d={`M${O.x} ${O.y}L${F.x} ${F.y}`} stroke="#87a8bc" strokeDasharray="4 3"/>}{minimum&&[-120,120].map((v,i)=><path key={i} d={`M160 130L${160+v} 220`} stroke="#9e6be0" strokeDasharray="5 3"/>)}{m.perpendicular&&<><path d={pathMark(T,O,{x:T.x+u.x*80,y:T.y+u.y*80},10)} fill="none" stroke="#159354"/><text x={T.x+18} y={T.y-18}>90°</text></>}{m.intersections.map((q,i)=>{const p=s(q);return <g key={i}><circle cx={p.x} cy={p.y} r="3"/><text x={p.x+5} y={p.y-10}>{m.count===2?(i?'B':'A'):''}</text></g>;})}<circle cx={O.x} cy={O.y} r="4" fill="#126ee2"/><circle cx={T.x} cy={T.y} r="4" fill="#8a24d0"/><text x={O.x+8} y={O.y-8}>O</text><text x={T.x-5} y={T.y+22}>T</text><text x={B.x+u.x*120} y={B.y+u.y*120-10}>ℓ</text></svg>;}

export default function TangentPerpendicularTargetLesson10096({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [tAngle, setTAngle] = useState(270);
  const [lineAngle, setLineAngle] = useState(0);
  const [lineOffset, setLineOffset] = useState(0);
  const [dragging, setDragging] = useState<DragTarget>(null);
  const [showRadius, setShowRadius] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAngle, setShowAngle] = useState(true);
  const [snap, setSnap] = useState(true);

  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const geometry=tangentPerpendicularModel(tAngle,lineAngle,lineOffset),{t,direction,normal,base,signed:signedDistance,distance,count:intersections,angle:radiusLineAngle,onLine,perpendicular,status}=geometry;
  const mode: 'tangent'|'secant'|'none'=intersections===1?'tangent':intersections===2?'secant':'none';
  const mainRef=useRef<HTMLElement>(null);
  const cx=342,cy=250,scale=30,screen=(p:{x:number;y:number})=>({x:cx+p.x*scale,y:cy-p.y*scale}),st=screen(t),sb=screen(base),screenDirection={x:direction.x,y:-direction.y};
  const lineStart={x:sb.x-screenDirection.x*290,y:sb.y-screenDirection.y*290},lineEnd={x:sb.x+screenDirection.x*290,y:sb.y+screenDirection.y*290},rotateHandle=visibleLineHandle(sb,screenDirection),foot=screen({x:normal.x*signedDistance,y:normal.y*signedDistance});
  const u={x:(cx-st.x)/(RADIUS*scale),y:(cy-st.y)/(RADIUS*scale)},sign=u.x*screenDirection.x+u.y*screenDirection.y>=0?1:-1,v={x:screenDirection.x*sign,y:screenDirection.y*sign},arcPath=`M${st.x+u.x*27} ${st.y+u.y*27} A27 27 0 0 ${u.x*v.y-u.y*v.x>0?1:0} ${st.x+v.x*27} ${st.y+v.y*27}`;
  const setPointAngle = (value: number) => {
    if(!Number.isFinite(value))return;
    const next = normalize(round(value,3));
    setTAngle(next);
    if (snap) {
      setLineAngle(lineNormalize(next + 90));
      setLineOffset(0);

    }
  };
  const setDirection=(value:number)=>{if(!Number.isFinite(value))return;let next=lineNormalize(round(value,3));const delta=Math.abs(lineNormalize(tAngle)-next),a=Math.min(delta,180-delta);if(snap&&Math.abs(a-90)<=3)next=lineNormalize(tAngle+90);setLineAngle(next);setLineOffset(0);};
  const toggleSnap=(value:boolean)=>{setSnap(value);if(value){setLineAngle(lineNormalize(tAngle+90));setLineOffset(0);}};
  const chooseMode = (next: typeof mode) =>
    act(() => {
      if (next === "tangent") {
        setLineAngle(lineNormalize(tAngle + 90));
        setLineOffset(0);
      }
      if (next === "secant") {
        setLineAngle(lineNormalize(tAngle + 64));
        setLineOffset(0);
      }
      if (next === "none") {
        const tangentAngle = lineNormalize(tAngle + 90);
        const tangentRadians = (tangentAngle * Math.PI) / 180;
        const tangentNormal = {
          x: -Math.sin(tangentRadians),
          y: Math.cos(tangentRadians),
        };
        const tangentSigned = t.x * tangentNormal.x + t.y * tangentNormal.y;
        setLineAngle(tangentAngle);
        setLineOffset(Math.sign(tangentSigned) || 1);
      }
    });
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    if(!dragging)return;const m=svgRef.current?.getScreenCTM();if(!m)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse()),x=(p.x-cx)/scale,y=(cy-p.y)/scale;
    const degrees=Math.atan2(y-(dragging==='line'?t.y:0),x-(dragging==='line'?t.x:0))*180/Math.PI;
    if(dragging==='point')setPointAngle(degrees);else setDirection(degrees);
  };
  const reset = () =>
    act(() => {
      setTAngle(270);
      setLineAngle(0);
      setLineOffset(0);
      setShowRadius(true);
      setShowDistance(true);
      setShowAngle(true);
      setSnap(true);setDragging(null);setTab(0);

    });
  const Switch = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <label className="tpr10096-switch">
      <span className="tpr10096-switch-label">{label}</span>
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />
      <span>{checked ? "ON" : "OFF"}</span>
    </label>
  );

  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.tpr10096-lab','.tpr10096-cards','.tpr10096-cards article:nth-child(2)','.tpr10096-cards','.tpr10096-challenge'];mainRef.current?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  return (
    <section
      className="tpr10096-page"
      data-testid="school-mockup-0770"
      data-object-model="dedicated-tangent-line-distance-intersection-engine"
      data-t-angle={round(tAngle)}
      data-line-angle={round(lineAngle)}
      data-line-offset={round(lineOffset, 2)}
      data-distance={round(distance,2)} data-exact-distance={distance} data-exact-t-angle={tAngle} data-exact-line-angle={lineAngle} data-on-line={String(onLine)}
      data-intersections={intersections}
      data-contact-angle={round(radiusLineAngle)} data-exact-contact-angle={radiusLineAngle}
      data-status={status.toLowerCase().replace(" ", "-")}
      data-perpendicular={String(perpendicular)}
      data-mode={mode}
      data-actions={actions}
    >
      <div className="tpr10096-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <Link className="tpr10096-school" to="/lessons/school">← School lessons</Link>
        <h1>Tangent Perpendicular to Radius</h1>
        <p>
          Understand why a tangent at a point on a circle is perpendicular to
          the radius through that point.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div className="tpr10096-tabs" role="group" aria-label="Lesson sections">
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
        <section className="tpr10096-lab">
          <h2>INTERACTIVE EXPLORATION</h2>
          <p>
            Drag point T on the circle and rotate line ℓ. Observe and discover.
          </p>
          <div className="lab-grid">
            <aside>
              <section>
                <h3>
                  <b>1</b> Drag tangent point T
                </h3>
                <label>
                  Move T on the circle
                  <input
                    aria-label="Tangent point angle"
                    type="range"
                    min="0"
                    max="359"
                    value={tAngle}
                    onChange={(event) =>
                      act(() => setPointAngle(+event.target.value))
                    }
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setPointAngle(tAngle + 2));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setPointAngle(tAngle - 2));
                      }
                    }}
                  />
                </label>
                <p>
                  T angle <b>{round(tAngle)}°</b>
                </p>
              </section>
              <section>
                <h3>
                  <b>2</b> Rotate line ℓ
                </h3>
                <label>
                  Rotate the purple line
                  <input
                    aria-label="Tangent line angle"
                    type="range"
                    min="0"
                    max="179"
                    value={lineAngle}
                    onChange={(event) =>
                      act(() => setDirection(+event.target.value))
                    }
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setDirection(lineAngle - 1));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setDirection(lineAngle + 1));
                      }
                    }}
                  />
                </label>
                <p>
                  Angle of ℓ <b>{round(lineAngle)}°</b>
                </p>
              </section>
              <section>
                <h3>Display options</h3>
                {Switch({label:'Show radius OT',checked:showRadius,onChange:setShowRadius})}{Switch({label:'Show shortest distance',checked:showDistance,onChange:setShowDistance})}{Switch({label:'Show angle ∠OTℓ',checked:showAngle,onChange:setShowAngle})}{Switch({label:'Snap to perpendicular',checked:snap,onChange:toggleSnap})}

              </section>
              <section>
                <h3>Comparison mode</h3>
                <div className="modes">
                  {(["tangent", "secant", "none"] as const).map((value) => (
                    <button
                      key={value}
                      className={mode === value ? "active" : ""}
                      aria-pressed={mode===value}
                      onClick={() => chooseMode(value)}
                    >
                      {value[0].toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
                <button className="reset" onClick={reset}>
                  <RotateCcw /> Reset
                </button>
              </section>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 684 500"
                aria-label="Tangent line and radius interactive diagram"
                onPointerMove={pointer}
                onPointerUp={event=>{if(dragging)pointer(event);act(()=>setDragging(null));}}
                onPointerCancel={()=>setDragging(null)}
              >
                <circle className="circle" cx={cx} cy={cy} r={RADIUS * scale} />
                {showRadius && (
                  <line
                    className="radius"
                    x1={cx}
                    y1={cy}
                    x2={st.x}
                    y2={st.y}
                  />
                )}
                {showDistance && (
                  <line
                    className="distance"
                    x1={cx}
                    y1={cy}
                    x2={foot.x}
                    y2={foot.y}
                  />
                )}
                <line
                  className={`line ${status.toLowerCase().replace(" ", "-")}`}
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                />
                {geometry.intersections.filter(q=>Math.hypot(q.x-t.x,q.y-t.y)>1e-6).map((q,i)=>{const p=screen(q);return <circle key={i} className="intersection" cx={p.x} cy={p.y} r="4"/>;})}
                <circle className="center" cx={cx} cy={cy} r="5" />
                <text x={cx + 9} y={cy - 10}>
                  O
                </text>
                <circle
                  className="contact"
                  cx={st.x}
                  cy={st.y}
                  r="10"
                  role="slider"
                  tabIndex={0}
                  aria-label="Tangent point T"
                  aria-valuemin={0}
                  aria-valuemax={359}
                  aria-valuenow={round(tAngle)}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    act(() => setDragging("point"));
                  }}
                  onKeyDown={(event) => {
                      event.stopPropagation();
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      act(() => setPointAngle(tAngle + 2));
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      act(() => setPointAngle(tAngle - 2));
                    }
                  }}
                />
                <text className="t-label" x={st.x - 8} y={st.y + 30}>
                  T
                </text>
                <circle
                  className="rotate-handle"
                  cx={rotateHandle.x}
                  cy={rotateHandle.y}
                  r="8"
                  role="slider"
                  tabIndex={0}
                  aria-label="Rotate tangent line"
                  aria-valuemin={0}
                  aria-valuemax={179}
                  aria-valuenow={round(lineAngle)}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    act(() => setDragging("line"));
                  }}
                  onKeyDown={(event) => {
                      event.stopPropagation();
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      act(() => setDirection(lineAngle - 1));
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      act(() => setDirection(lineAngle + 1));
                    }
                  }}
                />
                {showRadius && (
                  <text
                    className="radius-label"
                    x={(cx + st.x) / 2 + 10}
                    y={(cy + st.y) / 2}
                  >
                    OT = 6.00
                  </text>
                )}
                {showAngle&&onLine&&<path className="angle-mark" data-angle-mark="true" d={perpendicular?pathMark(st,{x:cx,y:cy},{x:st.x+v.x*100,y:st.y+v.y*100}):arcPath} fill="none" stroke={perpendicular?'#159354':'#e09a1c'}/>}
                {showAngle && (
                  <text
                    className={
                      perpendicular ? "angle-label good" : "angle-label bad"
                    }
                    x={st.x + 22}
                    y={st.y - 25}
                  >
                    {radiusLineAngle.toFixed(1)}°
                  </text>
                )}
                <text className="ell" x={rotateHandle.x+12} y={rotateHandle.y-12}>
                  ℓ
                </text>
              </svg>
              <p className="instruction">
                Drag T or rotate ℓ until the line just touches the circle at T.
                <br />
                <b>The radius OT will be perpendicular to ℓ.</b>
              </p>
            </article>
            <aside className={`status ${perpendicular ? "good" : "bad"}`}>
              <h3>STATUS: {status}</h3>
              <p>
                Intersections: <b>{intersections}</b>
              </p>
              <p>
                Distance d(O,ℓ): <b>{distance.toFixed(intersections!==1&&Math.abs(distance-6)<.005?6:2)}</b>
              </p>
              <p>
                {onLine?'∠OTℓ':'Angle (OT, ℓ)'}: <b>{radiusLineAngle.toFixed(1)}°</b>
              </p>
              {!onLine&&<p>Line ℓ does not pass through T.</p>}
              <strong>
                {perpendicular ? (
                  <>
                    <CheckCircle2 /> Perpendicular
                  </>
                ) : (
                  "Adjust the line"
                )}
              </strong>
            </aside>
          </div>
        </section>
        <section className="tpr10096-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              For a fixed tangent line ℓ, every other point Q on ℓ lies outside the circle, so OQ &gt; OT. Thus OT is the shortest segment from O to ℓ.
            </p>
            <p>
              A shortest distance is perpendicular to that line. Therefore the
              tangent at T is perpendicular to OT.
            </p>
            <RadiusFigure minimum/>
            <strong><MathExpression value={String.raw`d(O,\ell)=OT=6.00`}/> (shortest segment)</strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Given:</b> Circle O with radius 6 units. If OT is vertical and
              ℓ is tangent at T:
            </p>
            <ol>
              <li>OT is a radius, so OT = 6.</li>
              <li>A tangent at T is perpendicular to OT.</li>
            </ol>
            <RadiusFigure/>
            <strong>Result: ℓ is horizontal and ∠OTℓ = 90°.</strong>
          </article>
          <article className="mistake">
            <h2>
              <AlertTriangle /> A COMMON MISCONCEPTION
            </h2>
            <p>
              A line that looks like it touches the circle may actually be a
              secant.
            </p>
            <p>
              A secant intersects the circle at two points, so it is not the
              tangent.
            </p>
            <RadiusFigure tAngle={230} lineAngle={5}/>
            <strong>This line is a secant, not a tangent.</strong>
          </article>
        </section>
        <section className="tpr10096-challenge">
          <h2>YOUR CHALLENGE</h2>
          <p>
            Rotate ℓ until it is tangent to the circle at T and verify the
            angle.
          </p>
          <div>
            <section>
              <h3>Tasks</h3>
              <p>1 Set the line so there is exactly one intersection.</p>
              <p>2 The shortest distance from O to ℓ equals OT.</p>
              <p>3 The angle ∠OTℓ must be 90°.</p>
            </section>
            <section className="challenge-figure">
              <RadiusFigure tAngle={tAngle} lineAngle={lineAngle} offset={lineOffset}/>
            </section>
            <section>
              <h3>Live checks</h3>
              <p>Intersections = 1 {intersections === 1 && <CheckCircle2 />}</p>
              <p>
                d(O,ℓ) = OT{" "}
                {Math.abs(distance-RADIUS)<1e-9 && <CheckCircle2 />}
              </p>
              <p>∠OTℓ = 90° {perpendicular && <CheckCircle2 />}</p>
              {perpendicular && (
                <strong role="status">
                  <Trophy /> Well done! ℓ is tangent at T.
                </strong>
              )}
            </section>
          </div>
        </section>
        <p className="tpr10096-tip">
          Tip: Enable “Snap to perpendicular” to lock ℓ at exactly 90°.
        </p>
        <nav className="tpr10096-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-opposite-angles-of-a-cyclic-quadrilateral">
            <ArrowLeft /> Opposite Angles of a Cyclic Quadrilateral
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-tangent-lengths-from-an-external-point">
            Tangent Lengths from an External Point <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="tpr10096-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
