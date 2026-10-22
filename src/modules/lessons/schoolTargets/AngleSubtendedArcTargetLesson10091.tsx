import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleSubtendedArcTargetLesson10091.css";
import MathExpression from "../../../components/ui/MathExpression";
import {arcAngleModel,arcPosition,arcPositionFromAngle} from "./arcAngleModel";
import {segmentUnit as unit,segmentAngleLabel} from "./sameSegmentModel";
import {cyclicSector} from "./oppositeCyclicModel";


type Point = { x: number; y: number };
const A_ANGLE = 210.8,
  B_ANGLE = 329.2;
const round = (n: number, p = 1) => Math.round(n * 10 ** p) / 10 ** p;
function ArcFigure({minor=false,example=false}:{minor?:boolean;example?:boolean}){const m=arcAngleModel(.5,example?120:118.4),cWorld=minor?unit(270):m.c,project=(p:Point)=>({x:150+p.x*90,y:135-p.y*90}),O={x:150,y:135},a=project(m.a),b=project(m.b),c=project(cWorld),label=segmentAngleLabel(c,a,b,35),q1={x:150+m.a.x*25,y:135-m.a.y*25},q2={x:150+m.b.x*25,y:135-m.b.y*25},central=minor?360-m.central:m.central,inscribed=central/2,arc=`M${O.x} ${O.y}L${q1.x} ${q1.y}A25 25 0 ${minor?1:0} ${minor?1:0} ${q2.x} ${q2.y}Z`;return <svg className="asa10091-mini-svg" viewBox="0 0 300 270" role="img" aria-label={example?'Worked example120degree central and60degree inscribed angle':minor?'Minor-arc vertex needs241.6degree reflex central angle':'Major-arc vertex with118.4degree central angle'}><circle className="circle" cx="150" cy="135" r="90"/><path className="fixed-arc" d={`M${a.x} ${a.y}A90 90 0 0 0 ${b.x} ${b.y}`}/><path className="radius" d={`M${a.x} ${a.y}L150 135L${b.x} ${b.y}`}/><path className="chord" d={`M${a.x} ${a.y}L${c.x} ${c.y}L${b.x} ${b.y}`}/><path className="central" d={arc}/><path className="inscribed" d={cyclicSector(c,a,b,19)}/>{[['A',a],['B',b],['C',c]].map(([n,p])=>{const q=p as Point;return <g key={n as string}><circle className={`point ${(n as string).toLowerCase()}`} cx={q.x} cy={q.y} r="4"/><text x={q.x+(n==='A'?-12:5)} y={q.y+(n==='C'?(minor?20:-12):18)}>{n as string}</text></g>;})}<circle className="center" cx="150" cy="135" r="4"/><text x="155" y="128">O</text><text className="inscribed-label" x={label.x} y={label.y} textAnchor="middle">{inscribed.toFixed(1)}°</text>{example&&<text className="central-label" x="150" y="182" textAnchor="middle">120°</text>}</svg>;}
export default function AngleSubtendedArcTargetLesson10091({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [position, setPosition] = useState(0.5),
    [centralVisible, setCentralVisible] = useState(true),
    [inscribedVisible, setInscribedVisible] = useState(true),
    [dragging, setDragging] = useState(false),
    [tab, setTab] = useState(0),
    [observations, setObservations] = useState<number[]>([]),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    cx = 310,
    cy = 235,
    r = 185,
    geometry=arcAngleModel(position),a=geometry.a,b=geometry.b,c=geometry.c,cAngle=geometry.cAngle,central=geometry.central,inscribed=geometry.inscribed,ratio=geometry.ratio,valid=geometry.valid;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setPos = (value: number) => {
    if(Number.isFinite(value))setPosition(arcPosition(value));
  };
  const reset = () =>
    act(() => {
      setPosition(0.5);
      setCentralVisible(true);
      setInscribedVisible(true);
      setObservations([]);setDragging(false);setTab(0);
    });
  const localAngle = (e: PointerEvent<SVGSVGElement>) => {
    const matrix=svgRef.current?.getScreenCTM();if(!matrix)return cAngle;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());return Math.atan2(cy-p.y,p.x-cx)*180/Math.PI;
  };
  const infer=(degrees:number)=>setPos(arcPositionFromAngle(degrees));
  const finish=(e:PointerEvent<SVGSVGElement>)=>{if(dragging){infer(localAngle(e));act(()=>setDragging(false));}};
  const record=()=>act(()=>setObservations(v=>v.some(p=>Math.abs(p-position)<.0001)?v:[...v.slice(-1),position]));
  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.asa10091-lab','.asa10091-cards','.asa10091-lower article:first-child','.asa10091-cards article:nth-child(2)','.asa10091-lower article:last-child'];svgRef.current?.closest('main')?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const screen = (p: Point) => ({ x: cx + r * p.x, y: cy - r * p.y });
  const pa = screen(a),
    pb = screen(b),
    pc = screen(c);
  const arcPoint = (d: number, rr = r) => {
    const q = unit(d);
    return { x: cx + rr * q.x, y: cy - rr * q.y };
  };
  const arcPath = (start: number, end: number, rr: number) => {
    const p1 = arcPoint(start, rr),
      p2 = arcPoint(end, rr),
      large = (end - start + 360) % 360 > 180 ? 1 : 0;
    return `M${p1.x} ${p1.y}A${rr} ${rr} 0 ${large} 0 ${p2.x} ${p2.y}`;
  };
  const observation=(p:number)=>arcAngleModel(p);
  const angleLabel=segmentAngleLabel(pc,pa,pb,55),sectorSize=Math.min(38,Math.hypot(pc.x-pa.x,pc.y-pa.y)*.3,Math.hypot(pc.x-pb.x,pc.y-pb.y)*.3);
  return (
    <section
      className="asa10091-page"
      data-testid="school-mockup-0765"
      data-object-model="dedicated-fixed-arc-central-inscribed-angle-engine"
      data-position={round(position, 3)}
      data-c={`${round(c.x, 2)},${round(c.y, 2)}`}
      data-central-angle={round(central)}
      data-inscribed-angle={round(inscribed)}
      data-ratio={round(ratio)}
      data-invariant={String(valid)}
      data-observations={observations.length}
      data-exact-position={position} data-exact-c={JSON.stringify(c)} data-exact-central={central} data-exact-inscribed={inscribed} data-exact-ratio={ratio} data-recorded-positions={JSON.stringify(observations)}
      data-actions={actions}
    >
      <div className="asa10091-hero"><Link className="asa10091-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Angle Subtended by an Arc</h1>
        <p>
          Compare the angle subtended by the same arc at the centre and on the
          circle.
        </p>
        <div>
          <span>24 min</span>
          <span>Class 10</span>
          <span>Circle Proofs</span>
          <span>Difficulty</span>
          <span>NCERT: Ex. 10.2</span>
        </div>
      </div>
      <div className="asa10091-tabs" role="group" aria-label="Lesson sections">
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
        <section className="asa10091-lab">
          <aside>
            <section>
              <h2>INTERACT</h2>
              <b>Fixed arc AB</b>
              <p>
                <span>A ●</span>
                <span>B ●</span>
              </p>
              <small>Drag point C on the major arc.</small>
            </section>
            <section>
              <b>Drag C around</b>
              <input
                aria-label="Point C around major arc"
                type="range"
                min=".04"
                max=".96"
                step=".000001"
                value={position}
                onChange={(e) => act(() => setPos(+e.target.value))}
                onKeyDown={(e) => {e.stopPropagation();
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    act(() => setPos(position - 0.02));
                  }
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    act(() => setPos(position + 0.02));
                  }
                }}
              />
              <strong>
                C (x,y)
                <br />({round(c.x, 2)}, {round(c.y, 2)})
              </strong>
            </section>
            <section>
              <b>Measure angles</b>
              <label>
                <input
                  type="checkbox"
                  checked={centralVisible}
                  onChange={(e) =>
                    act(() => setCentralVisible(e.target.checked))
                  }
                />{" "}
                Central angle ∠AOB
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={inscribedVisible}
                  onChange={(e) =>
                    act(() => setInscribedVisible(e.target.checked))
                  }
                />{" "}
                Inscribed angle ∠ACB
              </label>
            </section>
            <section className="asa10091-result">
              <h3>LIVE RESULT</h3>
              <strong>∠AOB = {central.toFixed(1)}°</strong>
              <strong>∠ACB = {inscribed.toFixed(1)}°</strong>
              <hr />
              <p>
                Ratio{" "}
                <b>
                  {central.toFixed(1)}/{inscribed.toFixed(1)} = {ratio.toFixed(2)} : 1
                </b>
              </p>
              <em>
                <CheckCircle2 /> Invariant confirmed
              </em>
            </section>
          </aside>
          <article>
            <button onClick={reset}>
              <RotateCcw /> Reset diagram
            </button>
            <svg
              ref={svgRef}
              viewBox="0 0 620 470"
              aria-label="Draggable central and inscribed angle circle"
              onPointerMove={(e) => {
                if (dragging) infer(localAngle(e));
              }}
              onPointerUp={finish}
              onPointerCancel={()=>setDragging(false)}
            >
              <circle className="circle" cx={cx} cy={cy} r={r} />
              <path className="fixed-arc" d={arcPath(A_ANGLE, B_ANGLE, r)} />
              <line className="chord" x1={pc.x} y1={pc.y} x2={pa.x} y2={pa.y} />
              <line className="chord" x1={pc.x} y1={pc.y} x2={pb.x} y2={pb.y} />
              {centralVisible && (
                <>
                  <line
                    className="radius"
                    x1={cx}
                    y1={cy}
                    x2={pa.x}
                    y2={pa.y}
                  />
                  <line
                    className="radius"
                    x1={cx}
                    y1={cy}
                    x2={pb.x}
                    y2={pb.y}
                  />
                  <path className="central" d={cyclicSector({x:cx,y:cy},pa,pb,42)} />
                  <text className="central-label" x={cx - 28} y={cy + 53}>
                    {central.toFixed(1)}°
                  </text>
                </>
              )}
              {inscribedVisible && (
                <>
                  <path
                    className="inscribed"
                    d={cyclicSector(pc,pa,pb,sectorSize)}
                  />
                  <text className="inscribed-label" x={angleLabel.x} y={angleLabel.y} textAnchor="middle">
                    {inscribed.toFixed(1)}°
                  </text>
                </>
              )}
              <circle className="center" cx={cx} cy={cy} r="7" />
              <text x={cx - 10} y={cy - 16}>
                O
              </text>
              <circle className="point a" cx={pa.x} cy={pa.y} r="7" />
              <text className="label-a" x={pa.x - 25} y={pa.y + 22}>
                A
              </text>
              <circle className="point b" cx={pb.x} cy={pb.y} r="7" />
              <text className="label-b" x={pb.x + 12} y={pb.y + 22}>
                B
              </text>
              <circle
                className="point c" role="slider" aria-valuemin={.04} aria-valuemax={.96} aria-valuenow={position}
                tabIndex={0}
                aria-label="Draggable point C on major arc"
                cx={pc.x}
                cy={pc.y}
                r="8"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDragging(true);
                }}
                onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();act(()=>setPos(e.key==='Home'?.04:e.key==='End'?.96:position+(e.key==='ArrowRight'?.02:-.02)));}}}
              />
              <text className="label-c" x={pc.x - 10} y={pc.y - 16}>
                C
              </text>
            </svg>
            <footer>
              <article>
                <p className="legend-radii">— Radii OA, OB</p>
                <p className="legend-arc">— Arc AB (fixed)</p>
                <p className="legend-chords">— Chords CA, CB</p>
              </article>
              <article>
                As C moves on the major arc, the ratio{" "}
                <strong>∠AOB / ∠ACB</strong> remains <b>2 : 1.</b>
              </article>
            </footer>
          </article>
        </section>
        <section className="asa10091-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              The central angle ∠AOB and the inscribed angle ∠ACB stand on the
              same arc AB.
            </p>
            <p>
              The central angle opens twice as wide as the angle at the
              circumference.
            </p>
            <strong>
              Key idea: Equal arcs subtend equal angles at the circumference.
            </strong>
          </article>
          <article>
            <h2>THE RULE (THEOREM)</h2>
            <strong>
              The angle subtended by an arc at the centre is twice the angle
              subtended by the arc at any point on the remaining circle.
            </strong>
            <b><MathExpression value={String.raw`\angle AOB=2\angle ACB`}/></b>
          </article>
          <article className="warning">
            <h2>MISCONCEPTION WARNING</h2>
            <p>
              Point C must lie on the remaining (major) arc AB, not on the same
              minor arc.
            </p>
            <p>
              If C lies on the minor arc AB, its inscribed angle is 120.8°. Use the reflex central angle 241.6° for the intercepted major arc: 241.6° =2×120.8°.
            </p>
            <div className="asa10091-comparison"><section><ArcFigure/><small>Major arc: use 118.4°</small></section><section><ArcFigure minor/><small>Minor arc: use 241.6° reflex</small></section></div>
          </article>
        </section>
        <section className="asa10091-lower">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>If ∠AOB=120°, find ∠ACB.</p>
            <ArcFigure example/>
            <ol>
              <li>Given: ∠AOB=120°</li>
              <li>By the theorem: ∠AOB=2∠ACB</li>
              <li>∠ACB=½×120°=60°</li>
            </ol>
            <strong>Answer: ∠ACB = 60°</strong>
          </article>
          <article>
            <h2>CHALLENGE: DRAG & OBSERVE</h2>
            <p>
              Drag point C along the major arc of AB and observe two positions.
            </p>
            <button className="record-position" onClick={record} disabled={observations.some(p=>Math.abs(p-position)<.0001)}>Record current position</button>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>∠AOB</th>
                  <th>∠ACB</th>
                  <th>Ratio</th>
                </tr>
              </thead>
              <tbody>
                {[0,1].map((i) => {
                  const p=observations[i],o=p===undefined?null:observation(p);
                  return (
                    <tr key={i}>
                      <td>Position {i + 1}{o&&<small className="record-coordinate">C ({o.c.x.toFixed(2)}, {o.c.y.toFixed(2)})</small>}</td>
                      <td>{o?o.central.toFixed(1)+'°':'—'}</td>
                      <td>{o?o.inscribed.toFixed(1)+'°':'—'}</td>
                      <td>{o?o.ratio.toFixed(2)+' : 1':'—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <em>
              <CheckCircle2 /> {observations.length===2?'Both recorded positions confirm the 2:1 ratio.':'Record two different positions to compare.'}
            </em>
          </article>
        </section>
      </main>
      <nav className="asa10091-nav">
        <Link to="/lessons/school/class-10/class-10-circle-proofs-perpendicular-from-centre-to-chord">
          <ArrowLeft />
          Perpendicular from Centre to Chord
        </Link>
        <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-in-a-semicircle">

          Angle in a Semicircle <ArrowRight />
        </Link>
      </nav>
      <footer className="asa10091-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
