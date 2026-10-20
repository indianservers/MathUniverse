import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {createPortal} from "react-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AnglesSameSegmentTargetLesson10093.css";
import MathExpression from "../../../components/ui/MathExpression";
import {sameSegmentModel,safeSegmentPosition,segmentAngleLabel} from "./sameSegmentModel";
import {cyclicSector} from "./oppositeCyclicModel";


type PointName = "C" | "D";
type Point = { x: number; y: number };
const A_ANGLE = 218;
const B_ANGLE = 322;
const round = (value: number, places = 1) =>
  Math.round(value * 10 ** places) / 10 ** places;
function SegmentFigure({opposite=false}:{opposite?:boolean}){const m=sameSegmentModel(125,opposite?270:55,opposite?218:212,opposite?322:328),project=(p:Point)=>({x:160+p.x*100,y:145-p.y*100}),a=project(m.a),b=project(m.b),c=project(m.c),d=project(m.d);return <svg className="ass10093-mini-svg" viewBox="0 0 320 290" role="img" aria-label={opposite?'Opposite segments with angles52 and128 degrees':'Worked example with two58degree inscribed angles'}><circle className="circle" cx="160" cy="145" r="100"/><path className="chord" d={`M${a.x} ${a.y}L${b.x} ${b.y}`}/>{[c,d].map((p,i)=>{const label=segmentAngleLabel(p,a,b,30);return <g key={i}><path className="side" d={`M${a.x} ${a.y}L${p.x} ${p.y}L${b.x} ${b.y}`}/><path className="angle-sector" d={cyclicSector(p,a,b,18)}/><text className="angle-label" x={label.x} y={label.y} textAnchor="middle">{(i?m.angleD:m.angleC)?.toFixed(0)}°</text></g>;})}{[['A',a],['B',b],['C',c],['D',d]].map(([n,p])=>{const q=p as Point;return <g key={n as string}><circle className={n==='A'||n==='B'?'fixed':'drag-point'} cx={q.x} cy={q.y} r="4"/><text className={n==='C'||n==='D'?'point-label':''} x={160+(q.x-160)*1.13} y={145+(q.y-145)*1.13}>{n as string}</text></g>;})}<circle className="center" cx="160" cy="145" r="3"/><text x="167" y="138">O</text></svg>;}

export default function AnglesSameSegmentTargetLesson10093({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angles, setAngles] = useState({ C: 125, D: 55 });
  const [dragging, setDragging] = useState<PointName | null>(null);
  const [answer, setAnswer] = useState<"equal" | "supplementary" | null>(null);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [visualFullscreen, setVisualFullscreen] = useState(false);
  useEffect(() => {
    if (!visualFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVisualFullscreen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visualFullscreen]);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const geometry=sameSegmentModel(angles.C,angles.D,A_ANGLE,B_ANGLE),{a,b,c,d,sameSegment}=geometry;
  const angleC=geometry.angleC??0,angleD=geometry.angleD??0,difference=geometry.difference??0,sum=geometry.sum??0;
  const correct = answer === (sameSegment ? "equal" : "supplementary");
  const cx = 355,
    cy = 260,
    radius = 205;
  const screen = (point: Point) => ({
    x: cx + radius * point.x,
    y: cy - radius * point.y,
  });
  const pa = screen(a),
    pb = screen(b),
    pc = screen(c),
    pd = screen(d);
  const setPoint = (name: PointName, degrees: number) => {
    setAngles(value=>({...value,[name]:safeSegmentPosition(degrees,value[name])}));
    setAnswer(null);
  };
  const pointerAngle = (event: PointerEvent<SVGSVGElement>) => {
    const matrix=svgRef.current?.getScreenCTM();if(!matrix)return 0;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());return Math.atan2(cy-p.y,p.x-cx)*180/Math.PI;
  };
  const finishPointer=(e:PointerEvent<SVGSVGElement>)=>{if(dragging){setPoint(dragging,pointerAngle(e));act(()=>setDragging(null));}};
  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.ass10093-explore','.ass10093-why','.ass10093-cards article:first-child','.ass10093-why','.ass10093-challenge'];svgRef.current?.closest('main')?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const reset = () =>
    act(() => {
      setAngles({ C: 125, D: 55 });
      setDragging(null);
      setAnswer(null);setTab(0);
    });

  const content=(
    <section
      className="ass10093-page"
      data-testid="school-mockup-0767"
      data-object-model="dedicated-two-point-same-segment-inscribed-angle-engine"
      data-c-angle={round(angles.C)}
      data-d-angle={round(angles.D)}
      data-angle-c={round(angleC)}
      data-angle-d={round(angleD)}
      data-difference={round(difference)}
      data-sum={round(sum)}
      data-relation={sameSegment ? "equal" : "supplementary"}
      data-answer={answer ?? "none"}
      data-correct={String(correct)}
      data-exact-c-position={angles.C} data-exact-d-position={angles.D} data-exact-angle-c={angleC} data-exact-angle-d={angleD} data-exact-sum={sum} data-exact-difference={difference}
      data-actions={actions}
    >
      <div className="ass10093-hero"><Link className="ass10093-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Angles in the Same Segment</h1>
        <p>
          Angles standing on the same chord in the same segment of a circle are
          equal.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div className="ass10093-tabs" role="group" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              aria-pressed={tab===index} onClick={() => navigateTab(index)}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <main>
        <section className="ass10093-explore">
          <div className="ass10093-explore-heading">
            <h2>Explore the theorem</h2>
            <p>Drag points C and D along the circle.</p>
          </div>
          <aside>
            <div
              className={
                sameSegment
                  ? "ass10093-theorem-result"
                  : "ass10093-theorem-result opposite"
              }
            >
              {sameSegment ? <CheckCircle2 /> : <Info />}
              <b>Result</b>
              <strong>
                {sameSegment ? "∠ACB = ∠ADB" : "∠ACB + ∠ADB = 180°"}
              </strong>
              <span>
                {sameSegment
                  ? "The angles are equal."
                  : "The angles are supplementary."}
              </span>
            </div>
            <div className="measures">
              <p>
                ∠ACB<b>{angleC.toFixed(1)}°</b>
              </p>
              <p>
                ∠ADB<b>{angleD.toFixed(1)}°</b>
              </p>
              <p>
                {sameSegment ? "Difference" : "Sum"}
                <b>{(sameSegment ? difference : sum).toFixed(1)}°</b>
              </p>
            </div>
            <p className="notice">
              <Info /> Move C and D to either side of chord AB. A small clearance from A and B keeps both angles defined.
            </p>
          </aside>
          <article
            className={visualFullscreen ? "is-fullscreen" : ""}
            data-smart-lesson-visual="geometry"
          >
            <div className="ass10093-visual-actions">
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button
                onClick={() => setVisualFullscreen((value) => !value)}
                aria-label={visualFullscreen ? "Exit full screen diagram" : "Open diagram full screen"}
                title={visualFullscreen ? "Exit full screen" : "Full screen"}
              >
                {visualFullscreen ? <Minimize2 /> : <Maximize2 />}
                {visualFullscreen ? "Exit" : "Full screen"}
              </button>
            </div>
            <svg
              ref={svgRef}
              viewBox="0 0 710 520"
              aria-label="Two draggable angles standing on chord AB"
              onPointerMove={(event) =>
                dragging && setPoint(dragging, pointerAngle(event))
              }
              onPointerUp={finishPointer}
              onPointerCancel={()=>setDragging(null)}
            >
              <defs>
                <pattern
                  id="ass-dots"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" />
                </pattern>
              </defs>
              <rect
                className="dots"
                width="710"
                height="520"
                fill="url(#ass-dots)"
              />
              <circle className="circle" cx={cx} cy={cy} r={radius} />
              <line className="radius" x1={cx} y1={cy} x2={pa.x} y2={pa.y} />
              <line className="radius" x1={cx} y1={cy} x2={pb.x} y2={pb.y} />
              <line className="chord" x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} />
              {[pc, pd].map((p, index) => (
                <g key={index}>
                  <line
                    className="side"
                    x1={p.x}
                    y1={p.y}
                    x2={pa.x}
                    y2={pa.y}
                  />
                  <line
                    className="side"
                    x1={p.x}
                    y1={p.y}
                    x2={pb.x}
                    y2={pb.y}
                  />
                </g>
              ))}
              <circle className="center" cx={cx} cy={cy} r="5" />
              <text x={cx + 8} y={cy - 8}>
                O
              </text>
              <path className="central-sector" d={cyclicSector({x:cx,y:cy},pa,pb,44)}/>
              <text className="central-label" x={cx - 42} y={cy + 86}>
                ∠AOB = 104.0°
              </text>
              <circle className="fixed" cx={pa.x} cy={pa.y} r="7" />
              <text x={pa.x - 20} y={pa.y + 28}>
                A
              </text>
              <circle className="fixed" cx={pb.x} cy={pb.y} r="7" />
              <text x={pb.x + 10} y={pb.y + 28}>
                B
              </text>
              {(["C", "D"] as PointName[]).map((name) => {
                const p = name === "C" ? pc : pd;
                return (
                  <g key={name}>
                    <path className="angle-sector" d={cyclicSector(p,pa,pb,30)}/>
                    <circle
                      className="drag-point"
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      role="slider"
                      tabIndex={0}
                      aria-label={`Point ${name} on circle`}
                      aria-valuemin={0}
                      aria-valuemax={359}
                      aria-valuenow={round(angles[name])}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(name));
                      }}
                      onKeyDown={(event) => {event.stopPropagation();
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          act(() => setPoint(name, angles[name] + 3));
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          act(() => setPoint(name, angles[name] - 3));
                        }
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          act(() => setPoint(name, angles[name]>218&&angles[name]<322?90:270));
                        }
                      }}
                    />
                    <text className="point-label" x={p.x + 10} y={p.y - 13}>
                      {name}
                    </text>
                  </g>
                );
              })}
              {[pc,pd].map((p,i)=>{const label=segmentAngleLabel(p,pa,pb);return <text key={i} className="angle-label" x={label.x} y={label.y} textAnchor="middle">{(i?angleD:angleC).toFixed(1)}°</text>;})}
            </svg>
          </article>
        </section>

        <section className="ass10093-why">
          <h2>Why this is true</h2>
          <p>An inscribed angle equals half the central angle for its intercepted arc, the arc that does not contain the vertex.</p>
          {sameSegment?<MathExpression value={`\\angle ACB=\\angle ADB=\\frac12\\times ${geometry.interceptedC?.toFixed(1)}^\\circ=${angleC.toFixed(1)}^\\circ`}/>:<MathExpression value={String.raw`\angle ACB+\angle ADB=\frac12(104^\circ+256^\circ)=180^\circ`}/>}
          <p>{sameSegment?(angleC>90?'Both points lie on the minor segment; they intercept the 256° major arc.':'Both points lie on the major segment; they intercept the 104° minor arc.'):'Opposite segments intercept the two arcs that make the full circle, so the angles are supplementary.'}</p>
        </section>

        <section className="ass10093-cards">
          <article>
            <h2>Worked Example</h2>
            <p>
              In the figure, AB is a chord of a circle with centre O. ∠ACB =
              58°. Find ∠ADB.
            </p>
            <SegmentFigure/>
            <p>
              <b>Solution</b>
            </p>
            <p>Since C and D lie on the same segment of chord AB,</p>
            <strong>∴ ∠ADB = 58°</strong>
          </article>
          <article className="misconception">
            <h2>
              <AlertTriangle /> Common Misconception
            </h2>
            <p>Points on opposite segments do not give equal angles.</p>
            <p>They give supplementary angles.</p>
            <SegmentFigure opposite/>
            <strong>
              If C and D lie on opposite segments of AB, then ∠ACB + ∠ADB =
              180°.
            </strong>
          </article>
          <article>
            <h2>Quick Check</h2>
            <p>Move C and D independently. What happens to the angles?</p>
            <p className="check">
              <CheckCircle2 /> Same segment
              <br />
              <b>∠ACB = ∠ADB</b>
            </p>
            <p className="check bad">
              <AlertTriangle /> Opposite segments
              <br />
              <b>∠ACB + ∠ADB = 180°</b>
            </p>
            <p className="check">
              <Info /> Press Arrow Down on a point to cross the chord.
            </p>
          </article>
        </section>

        <section className="ass10093-challenge">
          <h2>Your Challenge</h2>
          <p>
            Drag points C and D anywhere on the circle. Classify the
            relationship between the angles.
          </p>
          <div>
            <button
              className={answer === "equal" ? "selected" : ""}
              onClick={() => act(() => setAnswer("equal"))}
            >
              Equal (same segment)<span>∠ACB = ∠ADB</span>
            </button>
            <button
              className={answer === "supplementary" ? "selected" : ""}
              onClick={() => act(() => setAnswer("supplementary"))}
            >
              Supplementary (opposite segments)<span>∠ACB + ∠ADB = 180°</span>
            </button>
          </div>
          {answer && (
            <strong role="status" aria-live="polite" className={correct ? "correct" : "incorrect"}>
              {correct
                ? "Correct. The classification matches the current geometry."
                : "Check which side of chord AB contains each point."}
            </strong>
          )}
        </section>
        <section className="ass10093-goal">
          <b>Goal:</b> Observe when the relationship changes and explain why.
        </section>
        <nav className="ass10093-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-in-a-semicircle">
            <ArrowLeft /> Angle in a Semicircle
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral">
            Cyclic Quadrilateral <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="ass10093-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
  return visualFullscreen?createPortal(content,document.body):content;
}
