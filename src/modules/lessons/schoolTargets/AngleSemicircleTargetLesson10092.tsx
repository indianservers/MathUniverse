import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleSemicircleTargetLesson10092.css";
import MathExpression from "../../../components/ui/MathExpression";
import {semicircleModel,clampSemicircle,advanceSemicircle} from "./semicircleModel";
import {tangentRightAngle} from "./tangentLengthsModel";
import {cyclicSector} from "./oppositeCyclicModel";
import {sameSegmentModel} from "./sameSegmentModel";


const RADIUS = 6.31;
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

const EXAMPLE=semicircleModel(Math.acos(2/7)*180/Math.PI,7);
function SemicircleFigure({warning=false}:{warning?:boolean}){const w=sameSegmentModel(60,90,220,350),m=EXAMPLE,center={x:160,y:warning?140:170},scale=warning?90:15,project=(p:{x:number;y:number})=>({x:center.x+p.x*scale,y:center.y-p.y*scale}),a=project(warning?w.a:m.a),b=project(warning?w.b:m.b),c=project(warning?w.c:m.c);return <svg className="ais10092-mini-svg" viewBox="0 0 320 280" role="img" aria-label={warning?'Non-diameter chord with an inscribed angle65degrees':'Radius7 circle example with C at2 and square root45'}>{warning?<circle className="circle" cx="160" cy="140" r="90"/>:<path className="circle" d="M55 170A105 105 0 0 1 265 170"/>}<path className="triangle" d={`M${a.x} ${a.y}L${c.x} ${c.y}L${b.x} ${b.y}L${a.x} ${a.y}`} fill="none"/>{!warning&&<line className="radius" x1={center.x} y1={center.y} x2={c.x} y2={c.y}/>}<path className={`angle ${warning?'warning-angle':'angle-c'}`} d={cyclicSector(c,a,b,21)}/>{!warning&&<polyline className="right-mark" points={tangentRightAngle(c,a,b,10).map(p=>`${p.x},${p.y}`).join(' ')}/>}<circle className="center" cx={center.x} cy={center.y} r="3"/>{[['A',a],['B',b],['C',c]].map(([n,p])=>{const q=p as {x:number;y:number};return <g key={n as string}><circle className={n==='C'?'point draggable':'point'} cx={q.x} cy={q.y} r="4"/><text className={n==='C'?'label-c':''} x={q.x+(n==='C'?5:-10)} y={q.y+(n==='C'?-12:22)}>{n as string}</text></g>;})}<text x={center.x-20} y={center.y+22}>O</text><text className={warning?'warning-text':'angle-c-text'} x={c.x+22} y={c.y+35}>{warning?'65° ≠90°':'90°'}</text></svg>;}

export default function AngleSemicircleTargetLesson10092({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [motion,setMotion]=useState({theta:68,direction:1});
  const theta=motion.theta;
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);

  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setPoint=(value:number)=>{if(!Number.isFinite(value))return;setPlaying(false);setMotion(v=>({...v,theta:clampSemicircle(value)}));};

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setMotion(value=>advanceSemicircle(value,speed));
    }, 55);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const model=semicircleModel(theta),point=model.c,angleA=model.angleA,angleB=model.angleB,angleC=model.angleC,acExact=model.ac,bcExact=model.bc,ac=round(model.ac),bc=round(model.bc),diameter=model.diameter,lhs=round(model.lhs),rhs=round(model.rhs),verified=model.verified;
  const cx = 344,
    cy = 295,
    scale = 30,
    rr = RADIUS * scale;
  const a = { x: cx - rr, y: cy };
  const b = { x: cx + rr, y: cy };
  const c = { x: cx + point.x * scale, y: cy - point.y * scale };

  const markSize=Math.min(14,acExact*scale/4,bcExact*scale/4),sectorA=Math.min(38,acExact*scale*.35),sectorB=Math.min(38,bcExact*scale*.35),sectorC=Math.min(29,acExact*scale*.35,bcExact*scale*.35);
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const matrix=svgRef.current?.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()),x=p.x-cx,y=cy-p.y;setPoint(Math.atan2(Math.max(0,y),x)*180/Math.PI);
  };
  const finishPointer=(e:PointerEvent<SVGSVGElement>)=>{if(dragging){updateFromPointer(e);act(()=>setDragging(false));}};
  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.ais10092-lab','.ais10092-cards','.ais10092-cards article:nth-child(2)','.ais10092-cards','.ais10092-bottom'];svgRef.current?.closest('main')?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const reset = () =>
    act(() => {
      setMotion({theta:68,direction:1});setDragging(false);setTab(0);
      setPlaying(false);
      setSpeed(2);

    });

  return (
    <section
      className="ais10092-page"
      data-testid="school-mockup-0766"
      data-object-model="dedicated-diameter-semicircle-right-angle-engine"
      data-theta={round(theta)}
      data-c={`${round(point.x)},${round(point.y)}`}
      data-angle-a={round(angleA)}
      data-angle-b={round(angleB)}
      data-angle-c={round(angleC)}
      data-pythagorean={String(verified)}
      data-playing={String(playing)}
      data-exact-theta={theta} data-exact-c={JSON.stringify(point)} data-exact-angles={JSON.stringify({A:angleA,B:angleB,C:angleC})} data-exact-lengths={JSON.stringify({AC:acExact,BC:bcExact,AB:diameter})} data-exact-pythagoras={JSON.stringify({lhs:model.lhs,rhs:model.rhs})} data-speed={speed}
      data-actions={actions}
    >
      <div className="ais10092-hero"><Link className="ais10092-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Angle in a Semicircle</h1>
        <p>
          The angle subtended by a diameter at any point on the circle is a
          right angle (90°).
        </p>
        <div>
          <span>24 min</span>
          <span>INTERMEDIATE</span>
          <span>VISUAL EXPLORATION</span>
          <span>NCERT 10.2</span>
          <span>Geometry</span>
        </div>
      </div>

      <div className="ais10092-tabs" role="group" aria-label="Lesson sections">
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
        <section className="ais10092-lab">
          <aside>
            <h2>DRAG &amp; EXPLORE</h2>
            <p>Drag C along the semicircle, away from the diameter endpoints.</p>
            <strong className="ais10092-result">Result: ∠ACB is always 90°.</strong>
            <h3>Measurements</h3>
            <dl>
              <div>
                <dt>∠ACB (at C)</dt>
                <dd>{angleC.toFixed(2)}°</dd>
              </div>
              <div>
                <dt>∠CAB (at A)</dt>
                <dd>{angleA.toFixed(2)}°</dd>
              </div>
              <div>
                <dt>∠CBA (at B)</dt>
                <dd>{angleB.toFixed(2)}°</dd>
              </div>
            </dl>
            <h3>Lengths</h3>
            <p className="math">
              AC = {ac.toFixed(2)}
              <br />
              BC = {bc.toFixed(2)}
              <br />
              AB (diameter) = {diameter.toFixed(2)}
            </p>
            <p className="math">
              AC² + BC² = {round(acExact * acExact)} +{" "}
              {round(bcExact * bcExact)} = {lhs}
            </p>
            <p className="math">
              AB² = {diameter.toFixed(2)}² = {rhs}
            </p>
            <div className="verified">
              <CheckCircle2 />
              <b>Right triangle verified!</b>
              <span>AC² + BC² = AB² (before display rounding)</span>
            </div>
          </aside>

          <article>
            <svg
              ref={svgRef}
              viewBox="0 0 688 535"
              aria-label="Angle in a semicircle interactive diagram"
              onPointerMove={(event) => dragging && updateFromPointer(event)}
              onPointerUp={finishPointer}
              onPointerCancel={()=>setDragging(false)}
            >
              <defs>
                <pattern
                  id="ais-grid"
                  x="44" y="-5" width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M60 0H0V60" />
                </pattern>
              </defs>
              <rect
                className="grid"
                x="56" y="35" width="600"
                height="470"
                fill="url(#ais-grid)"
              />
              <line className="axis" x1="56" y1={cy} x2="656" y2={cy}/><line className="axis" x1="56" y1="35" x2="56" y2="505"/>
              {[-8,-6,-4,-2,0,2,4,6,8].map(v=><text key={`x${v}`} className="tick" x={cx+v*scale} y="522" textAnchor="middle">{v}</text>)}
              {[-6,-4,-2,0,2,4,6,8].map(v=><text key={`y${v}`} className="tick" x="47" y={cy-v*scale+4} textAnchor="end">{v}</text>)}
              <circle className="circle" cx={cx} cy={cy} r={rr} />
              <line className="triangle" x1={a.x} y1={a.y} x2={c.x} y2={c.y} />
              <line className="triangle" x1={c.x} y1={c.y} x2={b.x} y2={b.y} />
              <line className="diameter" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <line className="radius" x1={cx} y1={cy} x2={c.x} y2={c.y} />
              <path className="angle angle-a" d={cyclicSector(a,b,c,sectorA)}/><path className="angle angle-b" d={cyclicSector(b,c,a,sectorB)}/><path className="angle angle-c" d={cyclicSector(c,a,b,sectorC)}/><polyline className="right-mark" points={tangentRightAngle(c,a,b,markSize).map(p=>`${p.x},${p.y}`).join(' ')}/>
              <circle className="center" cx={cx} cy={cy} r="5" />
              <circle className="point" cx={a.x} cy={a.y} r="6" />
              <circle className="point" cx={b.x} cy={b.y} r="6" />
              <circle
                className="point draggable"
                cx={c.x}
                cy={c.y}
                r="9"
                role="slider"
                tabIndex={0}
                aria-label="Point C on semicircle"
                aria-valuemin={2}
                aria-valuemax={178}
                aria-valuenow={round(theta)}
                onPointerDown={(event) => {
                  setPlaying(false);event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {event.stopPropagation();
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setPoint(theta + 2));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setPoint(theta - 2));
                  }
                }}
              />
              <text className="coordinate-label" x={a.x} y={a.y + 30}>
                A (−{RADIUS}, 0)
              </text>
              <text className="coordinate-label" x={b.x - 78} y={b.y + 30}>
                B ({RADIUS}, 0)
              </text>
              <text className="label-c" x={c.x + 8} y={c.y - 14}>
                C ({round(point.x)}, {round(point.y)})
              </text>
              <text x={cx - 24} y={cy + 28}>
                O (0, 0)
              </text>
              <text className="angle-a-text" x={a.x + 60} y={a.y - 27}>
                {angleA.toFixed(2)}°
              </text>
              <text className="angle-b-text" x={b.x - 105} y={b.y - 27}>
                {angleB.toFixed(2)}°
              </text>
              <text className="angle-c-text" x={c.x - 18} y={c.y + 58}>
                90.00°
              </text>
            </svg>
            <footer>
              <span>
                <i className="blue" /> Triangle ACB
              </span>
              <span>
                <i className="dash" /> Radii: OA, OB, OC
              </span>
              <span>
                <i /> Circle (radius OA)
              </span>
            </footer>
          </article>
        </section>

        <section className="ais10092-animation">
          <b>Animation</b>
          <button
            aria-label={playing ? "Pause auto-drag" : "Start auto-drag"}
            onClick={() => act(() => setPlaying(!playing))}
          >
            {playing ? <Pause /> : <Play />}
          </button>
          <span>Auto-drag C</span>
          <input
            aria-label="Point C position"
            type="range"
            min="2"
            max="178"
            step="0.001" value={theta}
            onChange={(event) => act(() => setPoint(+event.target.value))}
          />
          <div>
            {[1, 2, 4].map((value, index) => (
              <button
                key={value}
                aria-pressed={speed===value} className={speed === value ? "active" : ""}
                onClick={() => act(() => setSpeed(value))}
              >
                {["Slow", "Medium", "Fast"][index]}
              </button>
            ))}
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </section>

        <section className="ais10092-cards">
          <article>
            <h2>WHY IT WORKS (PROOF IDEA)</h2>
            <ol>
              <li>
                Join OC. Since OA = OC and OB = OC, triangles AOC and BOC are
                isosceles.
              </li>
              <li>Let ∠CAO = ∠ACO = α and ∠CBO = ∠OCB = β.</li>
              <li>Since A, O and B are collinear, ∠AOC + ∠COB =180°. This gives 2(α + β) =180°.</li>
              <li>Therefore α + β = 90°.</li>
            </ol>
            <MathExpression value={String.raw`(180^\circ-2\alpha)+(180^\circ-2\beta)=180^\circ`}/><p>Thus α + β =90°, and ∠ACB = α + β.</p>
            <strong>
              <CheckCircle2 /> Therefore, ∠ACB = 90°.
            </strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Given:</b> Circle with centre O(0,0), radius 7.
              <br />
              Diameter AB with A(−7,0), B(7,0).
            </p>
            <p><MathExpression value={String.raw`C=(2,\sqrt{7^2-2^2})=(2,\sqrt{45})\approx(2,6.708)`}/></p><SemicircleFigure/>
            <p className="answers">
              ∠ACB = 90.00°
              <br />
              ∠CAB = {EXAMPLE.angleA.toFixed(2)}°<br/>∠CBA = {EXAMPLE.angleB.toFixed(2)}°
            </p>
            <MathExpression value={String.raw`AC^2+BC^2=126+70=196=14^2=AB^2`}/>
          </article>
          <article className="warning">
            <h2>
              <AlertTriangle /> DON’T GET TRICKED!
            </h2>
            <p>
              If AB is not a diameter (just a chord), ∠ACB is <b>not</b> 90°.
            </p>
            <SemicircleFigure warning/>
            <p>The right angle happens only when AB is a diameter.</p>
            <strong>Rule: Must be a diameter.</strong>
          </article>
        </section>

        <section className="ais10092-bottom">
          <article>
            <h2>YOUR CHALLENGE</h2>
            <p>
              Drag point C around the semicircle and try to keep ∠ACB = 90°.
            </p>
            <ol className="challenge-instructions"><li>Keep dragging C to different positions.</li><li>Observe that the right angle never changes.</li><li>Try auto-drag and watch the angle.</li></ol>
            <div className="target">
              <div className="target-goal"><span>Target</span><b>90°</b></div>
              <span>Current</span>
              <b>{angleC.toFixed(2)}°</b>
              <em>Great! You nailed it.</em>
            </div>
          </article>
          <article>
            <h2>WHAT YOU DISCOVERED</h2>
            <p>
              <CheckCircle2 /> For any point C on the semicircle with diameter
              AB, ∠ACB is always 90°.
            </p>
            <p>
              <CheckCircle2 /> This is the <b>Angle in a Semicircle</b> theorem.
            </p>
            <p>
              <CheckCircle2 /> The result follows from both circle geometry and
              Pythagoras.
            </p>
          </article>
        </section>
        <nav className="ais10092-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-subtended-by-an-arc">
            <ArrowLeft /> Angle Subtended by an Arc
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral">
            Cyclic Quadrilateral <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="ais10092-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
