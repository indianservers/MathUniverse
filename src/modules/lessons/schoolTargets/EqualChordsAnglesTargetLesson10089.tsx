import {
  ArrowLeft,
  ArrowRight,
  Hand,
  LocateFixed,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EqualChordsAnglesTargetLesson10089.css";
import MathExpression from "../../../components/ui/MathExpression";
import {equalChordsModel,equalChordRadius,moveEqualChord,chordRotation,chordSignedRotation,chordAngleLimit,type EqualChordState} from "./equalChordsModel";
import {cyclicSector} from "./oppositeCyclicModel";


type Handle = "a" | "b" | "c" | "d";
const RADIUS=equalChordRadius;
const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
const polar = (cx: number, cy: number, r: number, degrees: number) => ({
  x: cx + r * Math.cos((degrees * Math.PI) / 180),
  y: cy - r * Math.sin((degrees * Math.PI) / 180),
});

function ProofTriangles(){const r=equalChordRadius,s=13,h=r*Math.cos(27*Math.PI/180)*s,w=3*s;return <svg className="eca10089-mini-svg" viewBox="0 0 340 210" role="img" aria-label="Two congruent isosceles triangles with equal radii and6cm bases">{[80,255].map((x,i)=>{const o={x,y:40},a={x:x-w,y:40+h},b={x:x+w,y:40+h};return <g key={i} className={i?'proof-purple':'proof-orange'}><path className="proof-triangle" d={`M${a.x} ${a.y}L${o.x} ${o.y}L${b.x} ${b.y}Z`}/><path className="proof-sector" d={cyclicSector(o,a,b,18)}/><path className="proof-ticks" d={`M${x-3} ${a.y-5}v10M${x+3} ${a.y-5}v10`}/><text x={x-32} y={40+h/2}>r</text><text x={x+24} y={40+h/2}>r</text><text x={x-5} y="27">O</text><text x={a.x-5} y={a.y+20}>{i?'C':'A'}</text><text x={b.x-5} y={b.y+20}>{i?'D':'B'}</text><text x={x} y={a.y+40} textAnchor="middle">6 cm</text></g>;})}</svg>;}
function UnequalFigure(){const m=equalChordsModel({leftRotation:180,rightRotation:0,leftAngle:54,rightAngle:70,overlay:0}),project=(p:{x:number;y:number})=>({x:150+p.x*14,y:125-p.y*14}),pts=Object.fromEntries(Object.entries(m.points).map(([n,p])=>[n,project(p)])) as Record<Handle,{x:number;y:number}>;return <svg className="eca10089-mini-svg" viewBox="0 0 300 260" role="img" aria-label="Measured unequal chords6cm and7.58cm in the same circle"><circle className="circle" cx="150" cy="125" r={equalChordRadius*14}/><path className="chord ab" d={`M${pts.a.x} ${pts.a.y}L${pts.b.x} ${pts.b.y}`}/><path className="chord cd" d={`M${pts.c.x} ${pts.c.y}L${pts.d.x} ${pts.d.y}`}/>{Object.entries(pts).map(([n,p])=><g key={n}><circle className={`handle ${n}`} cx={p.x} cy={p.y} r="4"/><text x={p.x+(p.x<150?-18:8)} y={p.y}>{n.toUpperCase()}</text></g>)}<text className="measure ab" x="80" y="240">6.00 cm</text><text className="measure cd" x="170" y="240">{m.cd.toFixed(2)} cm</text></svg>;}

export default function EqualChordsAnglesTargetLesson10089({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [leftRotation, setLeftRotation] = useState(180),
    [rightRotation, setRightRotation] = useState(0),
    [leftAngle, setLeftAngle] = useState(54),
    [rightAngle, setRightAngle] = useState(54),
    [radii, setRadii] = useState(true),
    [arcs, setArcs] = useState(true),
    [lengths, setLengths] = useState(true),
    [overlay, setOverlay] = useState(0),
    [converse, setConverse] = useState(true),
    [tool, setTool] = useState<"drag" | "rotate">("drag"),
    [dragging, setDragging] = useState<Handle | "circle" | null>(null),
    [tab, setTab] = useState(0),
    [actions, setActions] = useState(0),[rotatedCD,setRotatedCD]=useState(false);
  const svgRef = useRef<SVGSVGElement>(null),
    cx = 215,
    cy = 205,
    r = 165;
  const state:EqualChordState={leftRotation,rightRotation,leftAngle,rightAngle,overlay},model=equalChordsModel(state),points=Object.fromEntries(Object.entries(model.points).map(([n,p])=>[n,{x:cx+p.x*r/RADIUS,y:cy-p.y*r/RADIUS}])) as Record<Handle,{x:number;y:number}>,ab=model.ab,cd=model.cd,{equalChord,equalAngle,holds}=model;
  const formatLength=(value:number)=>value.toFixed(!equalChord&&ab.toFixed(2)===cd.toFixed(2)?5:2);
  const rotationStart=useRef<null|{angle:number;left:number;right:number}>(null);
  const challengeAB=Math.abs(ab-6)<1e-8,challengeCD=Math.abs(cd-6)<1e-8,challengeRotation=challengeCD&&Math.abs(rightAngle-54)<1e-8&&rotatedCD,score=Number(challengeAB)+Number(challengeCD)+Number(challengeRotation);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setLeftRotation(180);
      setRightRotation(0);
      setLeftAngle(54);
      setRightAngle(54);
      setRadii(true);
      setArcs(true);
      setLengths(true);
      setOverlay(0);
      setConverse(true);
      setTool("drag");setDragging(null);setTab(0);setRotatedCD(false);rotationStart.current=null;
    });
  const angleAt=(e:{clientX:number;clientY:number})=>{const matrix=svgRef.current?.getScreenCTM();if(!matrix)return 0;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());return Math.atan2(cy-p.y,p.x-cx)*180/Math.PI;};
  const apply=(next:EqualChordState)=>{if(Math.abs(chordSignedRotation(next.rightRotation+next.overlay-rightRotation-overlay))>.01&&Math.abs(rightAngle-54)<1e-8&&Math.abs(next.rightAngle-54)<1e-8)setRotatedCD(true);setLeftRotation(chordRotation(next.leftRotation));setRightRotation(chordRotation(next.rightRotation));setLeftAngle(next.leftAngle);setRightAngle(next.rightAngle);setOverlay(next.overlay);};
  const move=(e:{clientX:number;clientY:number})=>{if(!dragging)return;const angle=angleAt(e);if(tool==='rotate'||dragging==='circle'){const start=rotationStart.current;if(start){const delta=chordSignedRotation(angle-start.angle);apply({...state,leftRotation:start.left+delta,rightRotation:start.right+delta});}}else apply(moveEqualChord(state,dragging,angle,converse));};
  const finish=(e:PointerEvent<SVGSVGElement>)=>{if(dragging){move(e);act(()=>setDragging(null));rotationStart.current=null;}};
  const keyboard=(handle:Handle,delta:number)=>act(()=>{if(tool==='rotate')apply({...state,leftRotation:leftRotation+delta,rightRotation:rightRotation+delta});else apply(moveEqualChord(state,handle,model.angles[handle]+delta,converse));});
  const setOverlayValue=(value:number)=>apply({...state,overlay:Math.max(-90,Math.min(90,value))});
  const toggleConverse=(checked:boolean)=>act(()=>{setConverse(checked);if(checked){setRightAngle(leftAngle);if(rightAngle!==leftAngle)setRotatedCD(false);}});
  const changeAngle=(left:boolean,value:number)=>act(()=>{const a=chordAngleLimit(value);if(left)setLeftAngle(a);else setRightAngle(a);setRotatedCD(false);});
  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.eca10089-investigate','.eca10089-cards','.eca10089-cards article:nth-child(2)','.eca10089-cards','.eca10089-challenge'];svgRef.current?.closest('main')?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const arcPath = (rotation: number, angle: number, rr: number) => {
    const p1 = polar(cx, cy, rr, rotation - angle / 2),
      p2 = polar(cx, cy, rr, rotation + angle / 2);
    return `M${cx} ${cy}L${p1.x} ${p1.y}A${rr} ${rr} 0 0 0 ${p2.x} ${p2.y}Z`;
  };
  return (
    <section
      className="eca10089-page"
      data-testid="school-mockup-0763"
      data-object-model="dedicated-equal-chord-central-angle-congruence-engine"
      data-ab={round(ab)}
      data-cd={round(cd)}
      data-left-angle={leftAngle}
      data-right-angle={rightAngle}
      data-equal-chords={String(equalChord)}
      data-equal-angles={String(equalAngle)}
      data-theorem={String(holds)}
      data-left-rotation={leftRotation}
      data-right-rotation={rightRotation}
      data-overlay={overlay}
      data-exact-model={JSON.stringify(model)} data-converse={String(converse)} data-tool={tool} data-score={score}
      data-actions={actions}
    >
      <div className="eca10089-hero"><Link className="eca10089-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Equal Chords and Equal Angles</h1>
        <p>
          Explore the relationship between equal chords and equal angles at a
          circle&apos;s centre.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div className="eca10089-tabs" role="group" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab===i} onClick={() => navigateTab(i)}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section className="eca10089-investigate">
          <div className="eca10089-heading">
            <h2>INVESTIGATE</h2>
            <p>Drag points A, B, C or D. Observe angles and chord lengths.</p>
            <strong>Theorem: Equal chords ↔ Equal central angles</strong>
          </div>
          <div className="workspace">
            <aside>
              <section>
                <h3>CONTROLS</h3>
                <b>Display</b>
                <label>
                  <input
                    type="checkbox"
                    checked={radii}
                    onChange={(e) => act(() => setRadii(e.target.checked))}
                  />{" "}
                  Show radii OA, OB, OC, OD
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={arcs}
                    onChange={(e) => act(() => setArcs(e.target.checked))}
                  />{" "}
                  Show angle arcs
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={lengths}
                    onChange={(e) => act(() => setLengths(e.target.checked))}
                  />{" "}
                  Show chord lengths
                </label>
              </section>
              <section>
                <b>Measures</b>
                <label>
                  AB ={" "}
                  <input
                    aria-label="Chord AB length"
                    className="measure-value" readOnly
                    value={formatLength(ab)}
                  />{" "}
                  cm
                </label>
                <label>
                  CD ={" "}
                  <input
                    aria-label="Chord CD length"
                    className="measure-value" readOnly
                    value={formatLength(cd)}
                  />{" "}
                  cm
                </label>
              </section>
              <section>
                <b>Options</b>
                <label>
                  Overlay rotation <output>{overlay}°</output>
                  <input
                    aria-label="Overlay rotation"
                    type="range"
                    min="-90"
                    max="90"
                    value={overlay}
                    onChange={(e) => act(() => setOverlayValue(+e.target.value))}
                    onKeyDown={e=>e.stopPropagation()}
                  />
                </label>
                <label className="switch">
                  Converse view{" "}
                  <input
                    aria-label="Converse view"
                    type="checkbox"
                    checked={converse}
                    onChange={(e) => toggleConverse(e.target.checked)}
                  />
                </label>
                <small>Equal angles ⇔ Equal chords</small>
                {!converse&&<div className="independent-angles"><label>Central angle AB<input type="range" aria-label="Central angle AB" min="10" max="150" step=".001" value={leftAngle} onChange={e=>changeAngle(true,+e.target.value)}/><output>{leftAngle.toFixed(3)}°</output></label><label>Central angle CD<input type="range" aria-label="Central angle CD" min="10" max="150" step=".001" value={rightAngle} onChange={e=>changeAngle(false,+e.target.value)}/><output>{rightAngle.toFixed(3)}°</output></label></div>}

              </section>
              <section className="eca10089-status">
                <b>STATUS</b>
                <strong>{equalChord ? "✓ AB = CD" : "AB ≠ CD"}</strong>
                <strong>{equalAngle ? "∠AOB = ∠COD" : "Angles differ"}</strong>
                <em>
                  {equalChord?"The theorem holds.":"Chords and central angles both differ; the equivalence still holds."}
                </em>
              </section>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 430 410"
                aria-label="Draggable equal chords circle"
                onPointerDown={e=>{if(tool==='rotate'){rotationStart.current={angle:angleAt(e),left:leftRotation,right:rightRotation};e.currentTarget.setPointerCapture(e.pointerId);setDragging('circle');}}}
                onPointerMove={move} onPointerUp={finish} onPointerCancel={()=>{setDragging(null);rotationStart.current=null;}}
              >
                <line className="axis" x1={cx} y1="20" x2={cx} y2="390" />
                <line className="axis" x1="20" y1={cy} x2="410" y2={cy} />
                <circle className="circle" cx={cx} cy={cy} r={r} />
                {radii &&
                  (["a", "b", "c", "d"] as Handle[]).map((key) => (
                    <line
                      key={key}
                      className={`radius ${key}`}
                      x1={cx}
                      y1={cy}
                      x2={points[key].x}
                      y2={points[key].y}
                    />
                  ))}
                <line
                  className="chord ab"
                  x1={points.a.x}
                  y1={points.a.y}
                  x2={points.b.x}
                  y2={points.b.y}
                />
                <line
                  className="chord cd"
                  x1={points.c.x}
                  y1={points.c.y}
                  x2={points.d.x}
                  y2={points.d.y}
                />
                {arcs && (
                  <>
                    <path
                      className="arc ab"
                      d={arcPath(leftRotation, leftAngle, 38)}
                    />
                    <path
                      className="arc cd"
                      d={arcPath(rightRotation + overlay, rightAngle, 38)}
                    />
                  </>
                )}
                {(["a", "b", "c", "d"] as Handle[]).map((key) => (
                  <g key={key}>
                    <circle
                      className={`handle ${key}`} role="slider" aria-valuemin={0} aria-valuemax={360} aria-valuenow={round(chordRotation(model.angles[key]))}
                      tabIndex={0}
                      aria-label={`Draggable chord point ${key.toUpperCase()}`}
                      cx={points[key].x}
                      cy={points[key].y}
                      r="7"
                      onPointerDown={(e) => {
                        e.stopPropagation();rotationStart.current={angle:angleAt(e),left:leftRotation,right:rightRotation};e.currentTarget.setPointerCapture(e.pointerId);
                        setDragging(key);
                      }}
                      onKeyDown={(e) => {if(e.key.startsWith('Arrow')){e.preventDefault();e.stopPropagation();}
                        if (e.key === "ArrowLeft") keyboard(key, -2);
                        if (e.key === "ArrowRight") keyboard(key, 2);
                      }}
                    />
                    <text
                      x={points[key].x + (key === "a" || key === "b" ? -18 : 8)}
                      y={points[key].y - 10}
                    >
                      {key.toUpperCase()}
                    </text>
                  </g>
                ))}
                <circle className="center" cx={cx} cy={cy} r="6" />
                <text x={cx + 8} y={cy - 8}>
                  O
                </text>
                {arcs && (
                  <>
                    <text className="angle ab" x={polar(cx,cy,55,leftRotation).x} y={polar(cx,cy,55,leftRotation).y} textAnchor="middle">
                      {leftAngle}°
                    </text>
                    <text className="angle cd" x={polar(cx,cy,55,rightRotation+overlay).x} y={polar(cx,cy,55,rightRotation+overlay).y} textAnchor="middle">
                      {rightAngle}°
                    </text>
                  </>
                )}
                {lengths && (
                  <>
                    <text className="measure ab" x="115" y="397" textAnchor="middle">
                      AB = {formatLength(ab)} cm
                    </text>
                    <text className="measure cd" x="315" y="397" textAnchor="middle">
                      CD = {formatLength(cd)} cm
                    </text>
                  </>
                )}
              </svg>
              <div className="readouts">
                <strong>AB = {formatLength(ab)} cm</strong>
                <strong>CD = {formatLength(cd)} cm</strong>
                <strong>∠AOB = {leftAngle}°</strong>
                <strong>∠COD = {rightAngle}°</strong>
              </div>
            </article>
            <aside className="tools">
              <h3>TOOLS</h3>
              <button
                aria-pressed={tool==='drag'} className={tool === "drag" ? "active" : ""}
                onClick={() => act(() => setTool("drag"))}
              >
                <Hand /> Drag
              </button>
              <button
                aria-pressed={tool==='rotate'} className={tool === "rotate" ? "active" : ""}
                onClick={() => act(() => setTool("rotate"))}
              >
                <RotateCcw /> Rotate circle
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setLeftRotation(180);
                    setRightRotation(0);
                    setOverlay(0);setRotatedCD(false);
                  })
                }
              >
                <LocateFixed /> Center view
              </button>
              <h3>KEY</h3>
              <p>● A</p>
              <p>● B</p>
              <p>● C</p>
              <p>● D</p>
              <p>● O Centre</p>
            </aside>
          </div>
          <footer>
            {converse?'Drag any point or use the rotation slider. Locked chord lengths stay equal.':'Unlocked: move an endpoint or adjust central angles. Compare exact chord lengths and angles.'}
          </footer>
        </section>
        <section className="eca10089-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Equal chords in the same circle are equidistant from the centre.
              Radii to the endpoints form two isosceles triangles with equal
              legs and equal bases.
            </p>
            <ProofTriangles/>

          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Given: <MathExpression value="AB=CD"/></p>
            <p>Prove: <MathExpression value={String.raw`\angle AOB=\angle COD`}/></p>
            <ol>
              <li>OA=OC and OB=OD (radii).</li>
              <li>AB=CD (given).</li>
              <li>△AOB ≅ △COD (SSS).</li>
              <li>∠AOB=∠COD (CPCTC).</li>
            </ol>
          </article>
          <article className="warning">
            <h2>WARNING</h2>
            <p>
              Comparing arcs by appearance does not establish equal chord
              lengths.
            </p>
            <UnequalFigure/>
            <strong>Always compare chords or use the measurements.</strong>
          </article>
        </section>
        <section className="eca10089-challenge">
          <h2>CHALLENGE</h2>
          <p>
            Set both chords to 6 cm and rotate one without changing its central
            angle.
          </p>
          <div>
            <article>
              <p>{challengeAB?'✓':'○'} Set AB =6 cm</p>
              <p>{challengeCD?'✓':'○'} Set CD =6 cm</p>
              <p>
                ③ Rotate point C (and D) around the circle.
                <br />
                Keep ∠COD = 54°.
              </p>
            </article>
            <article className="challenge-goal" role="status" aria-live="polite">
              <h3>Goal</h3>
              <p>Maintain ∠COD = 54° while changing the position of CD.</p>
              <strong className={score===3?'complete':'pending'}>{score===3?'Well done!':'Rotate CD while keeping both chords 6 cm.'} CD ={formatLength(cd)} cm.</strong>
              <em>{score===3?'✓ Challenge complete.':'Keep the central angle 54°.'}</em>
            </article>
            <strong className="score" style={{borderColor:score===3?'#14944d':'#8050d6'}} aria-label={`${score} of3 challenge steps complete`}>
              {score}/3<small>{score===3?'Complete':'In progress'}</small>
            </strong>
          </div>
        </section>
      </main>
      <nav className="eca10089-nav">
        <Link to="/lessons/school/class-10/class-10-circle-proofs-angles-in-the-same-segment">
          <ArrowLeft />
          Angles in the Same Segment
        </Link>
        <Link to="/lessons/school/class-10/class-10-circle-proofs-perpendicular-from-centre-to-chord">

          Perpendicular from Centre to Chord <ArrowRight />
        </Link>
      </nav>
      <footer className="eca10089-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
