import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Expand,
  MousePointer2,
  Move,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CyclicQuadrilateralTargetLesson10094.css";
import MathExpression from "../../../components/ui/MathExpression";
import {cyclicQuadrilateralModel,cyclicDefaults,moveQuadrilateralVertex,quadrilateralSector,type CyclicVertices} from "./cyclicQuadrilateralModel";
import {cyclicNormalize} from "./oppositeCyclicModel";


type Name = "A" | "B" | "C" | "D";
type Vertex={angle:number;radius:number};
type Point={x:number;y:number};
const NAMES:Name[]=['A','B','C','D'];
const DEFAULTS=cyclicDefaults;
const round=(v:number,p=1)=>Math.round(v*10**p)/10**p;
function Figure({vertices,onRadius,rectangle=false,warning=false}:{vertices:CyclicVertices;onRadius?:(r:number)=>void;rectangle?:boolean;warning?:boolean}){
 const m=cyclicQuadrilateralModel(vertices),svg=useRef<SVGSVGElement>(null),[drag,setDrag]=useState(false),p=Object.fromEntries(NAMES.map(n=>[n,{x:160+m.points[n].x*90,y:140-m.points[n].y*90}])) as Record<Name,Point>;
 const update=(e:PointerEvent<SVGSVGElement>)=>{const matrix=svg.current?.getScreenCTM();if(!matrix||!onRadius)return;const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());onRadius(Math.max(.7,Math.min(1.25,Math.round(Math.hypot(q.x-160,q.y-140)/90*100)/100)));};
 return <svg ref={svg} className="cyq10094-mini-svg" viewBox="0 0 320 285" aria-label={rectangle?'Rectangle inscribed in a circle':warning?'Three points on a circle and C inside':'Challenge cyclic quadrilateral'} onPointerMove={e=>drag&&update(e)} onPointerUp={e=>{if(drag){update(e);setDrag(false);}}} onPointerCancel={()=>setDrag(false)}><circle className="fit-circle" cx="160" cy="140" r="90" style={warning?{stroke:'#7c8791',strokeDasharray:'5 4'}:undefined}/>{!warning&&<polygon className="quad" points={NAMES.map(n=>`${p[n].x},${p[n].y}`).join(' ')}/>} {!warning&&<><path className="diagonal" d={`M${p.A.x} ${p.A.y}L${p.C.x} ${p.C.y}M${p.B.x} ${p.B.y}L${p.D.x} ${p.D.y}`}/><circle className="center" cx="160" cy="140" r="3"/><text x="165" y="132">O</text></>}{NAMES.map((n,i)=><g key={n}>{!warning&&!rectangle&&<path className={`angle-fill n${i}`} d={quadrilateralSector(p[n],p[NAMES[(i+3)%4]],p[NAMES[(i+1)%4]],m.angles[n],18)}/>}<circle className={`vertex ${n.toLowerCase()}`} cx={p[n].x} cy={p[n].y} r={n==='B'&&onRadius?7:4} role={n==='B'&&onRadius?'slider':undefined} tabIndex={n==='B'&&onRadius?0:undefined} aria-label={n==='B'&&onRadius?'Challenge point B':undefined} aria-valuemin={n==='B'&&onRadius?0.7:undefined} aria-valuemax={n==='B'&&onRadius?1.25:undefined} aria-valuenow={n==='B'&&onRadius?vertices.B.radius:undefined} onKeyDown={n==='B'&&onRadius?e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();e.stopPropagation();onRadius(e.key==='Home'?1:Math.max(.7,Math.min(1.25,Math.round((vertices.B.radius+(e.key==='ArrowRight'?.01:-.01))*100)/100)));}}:undefined} onPointerDown={n==='B'&&onRadius?e=>{e.currentTarget.setPointerCapture(e.pointerId);setDrag(true);}:undefined}/><text x={160+(p[n].x-160)*1.15} y={140+(p[n].y-140)*1.15}>{n}</text>{!warning&&!rectangle&&<text className={`measure n${i}`} x={160+(p[n].x-160)*.65} y={140+(p[n].y-140)*.65}>{m.angles[n].toFixed(1)}°</text>}</g>)}</svg>;
}
const rectangleVertices:CyclicVertices={A:{angle:135,radius:1},B:{angle:45,radius:1},C:{angle:315,radius:1},D:{angle:225,radius:1}};

export default function CyclicQuadrilateralTargetLesson10094({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [vertices, setVertices] = useState(DEFAULTS);
  const [dragging, setDragging] = useState<Name | null>(null);
  const [showCircle, setShowCircle] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showSums, setShowSums] = useState(true);
  const [snap, setSnap] = useState(false);
  const [tool, setTool] = useState<"select" | "move" | "fit" | "animate">(
    "select",
  );
  const [challengeRadius, setChallengeRadius] = useState(1.2);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [tab, setTab] = useState(0);
  const [randomStep, setRandomStep] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const frozenScale=useRef<number|null>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const model=cyclicQuadrilateralModel(vertices),points=model.points,measures=model.angles,sumAC=model.sums.AC,sumBD=model.sums.BD,verticesOnCircle=model.onReference,cyclic=model.cyclic;
  const challengeVertices={...DEFAULTS,B:{...DEFAULTS.B,radius:challengeRadius}},challengeModel=cyclicQuadrilateralModel(challengeVertices),challengeOnCircle=challengeModel.cyclic,challengeCorrect=challengeChecked&&challengeOnCircle;
  const [fit,setFit]=useState(false),[pan,setPan]=useState({x:0,y:0});
  const panStart=useRef<null|{x:number;y:number;pan:{x:number;y:number}}>(null);
  useEffect(()=>{if(tool!=='animate')return;const timer=window.setInterval(()=>setVertices(v=>Object.fromEntries(NAMES.map(n=>[n,{...v[n],angle:cyclicNormalize(v[n].angle+1)}])) as CyclicVertices),80);return()=>window.clearInterval(timer);},[tool]);
  const cx = 342+pan.x,
    cy = 260+pan.y,
    radius = frozenScale.current??(fit?Math.min(205,220/Math.max(...NAMES.map(n=>vertices[n].radius))):180);
  const screen = (point: Point) => ({
    x: cx + point.x * radius,
    y: cy - point.y * radius,
  });
  const screenPoints = Object.fromEntries(
    NAMES.map((name) => [name, screen(points[name])]),
  ) as Record<Name, Point>;
  const polygon = NAMES.map(
    (name) => `${screenPoints[name].x},${screenPoints[name].y}`,
  ).join(" ");
  const setVertex = (name: Name, next: Vertex) => {
    setVertices(value=>moveQuadrilateralVertex(value,name,next.angle,next.radius,snap));
    setChallengeChecked(false);
  };
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const matrix=svgRef.current?.getScreenCTM();if(!matrix)return;
    const q=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    if(panStart.current){const start=panStart.current;setPan({x:start.pan.x+q.x-start.x,y:start.pan.y+q.y-start.y});return;}
    if(!dragging)return;
    const x=q.x-cx,y=cy-q.y,angle=Math.atan2(y,x)*180/Math.PI;
    setVertex(dragging,{angle,radius:snap?1:Math.hypot(x,y)/radius});
  };
  const finishPointer=(e:PointerEvent<SVGSVGElement>)=>{updateFromPointer(e);panStart.current=null;frozenScale.current=null;setDragging(null);};
  const chooseTool=(v:typeof tool)=>{setTool(v==='animate'&&tool==='animate'?'select':v);if(v==='fit'){setFit(true);setPan({x:0,y:0});}};
  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.cyq10094-lab','.cyq10094-cards','.cyq10094-cards article:nth-child(2)','.cyq10094-cards','.cyq10094-challenge'];svgRef.current?.closest('main')?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const randomize = () =>
    act(() => {
      const step = (randomStep + 1) % 3;
      const sets = [
        [126, 43, 310, 214],
        [103, 18, 287, 190],
        [136, 54, 325, 226],
      ];
      setVertices(
        Object.fromEntries(
          NAMES.map((name, index) => [
            name,
            { angle: sets[step][index], radius: 1 },
          ]),
        ) as Record<Name, Vertex>,
      );
      setRandomStep(step);
      setChallengeChecked(false);
    });
  const reset = () =>
    act(() => {
      setVertices(DEFAULTS);setDragging(null);setPan({x:0,y:0});setFit(false);setTab(0);
      setShowCircle(true);
      setShowAngles(true);
      setShowSums(true);
      setSnap(false);
      setTool("select");
      setChallengeRadius(1.2);
      setChallengeChecked(false);
      setRandomStep(0);
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
    <label className="cyq10094-switch">
      {label}
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />
      <span>{checked ? "ON" : "OFF"}</span>
    </label>
  );

  return (
    <section
      className="cyq10094-page"
      data-testid="school-mockup-0768"
      data-object-model="dedicated-four-vertex-cyclic-quadrilateral-engine"
      data-vertices-on-circle={verticesOnCircle}
      data-angle-a={round(measures.A)}
      data-angle-b={round(measures.B)}
      data-angle-c={round(measures.C)}
      data-angle-d={round(measures.D)}
      data-sum-ac={round(sumAC)}
      data-sum-bd={round(sumBD)}
      data-cyclic={String(cyclic)}
      data-tool={tool}
      data-challenge-radius={round(challengeRadius, 2)}
      data-challenge-correct={String(challengeCorrect)}
      data-exact-vertices={JSON.stringify(vertices)} data-exact-angles={JSON.stringify(measures)} data-exact-sums={JSON.stringify(model.sums)} data-pan={JSON.stringify(pan)} data-scale={radius}
      data-actions={actions}
    >
      <div className="cyq10094-hero"><Link className="cyq10094-school" to="/lessons/school">← School lessons</Link>
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Cyclic Quadrilateral</h1>
        <p>
          A quadrilateral is cyclic when all four vertices lie on one circle.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset activity
        </button>
      </div>
      <div className="cyq10094-tabs" role="group" aria-label="Lesson sections">
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
        <section className="cyq10094-lab">
          <aside>
            <h2>DRAG · OBSERVE · CONSTRUCT</h2>
            <p>Drag any vertex to move it.</p>
            {Switch({label:'Show circle (reference)',checked:showCircle,onChange:setShowCircle})}
            {Switch({label:'Angle measures',checked:showAngles,onChange:setShowAngles})}
            {Switch({label:'Opposite sum check',checked:showSums,onChange:setShowSums})}
            {Switch({label:'Snap to circle',checked:snap,onChange:(v)=>{setSnap(v);if(v)setVertices(old=>Object.fromEntries(NAMES.map(n=>[n,{...old[n],radius:1}])) as CyclicVertices);}})}
            <button className="random" onClick={randomize}>
              <RotateCcw /> Random cyclic
            </button>
            <p className="tip">
              <b>Tip:</b> Keep all four points on the circle to maintain
              cyclicity.
            </p>
            <h3>Vertex coordinates</h3>
            {NAMES.map((name) => (
              <p className="coordinate" key={name}>
                <i className={`dot ${name.toLowerCase()}`} /> <b>{name}</b> (
                {(points[name].x * 6).toFixed(2)},{" "}
                {(points[name].y * 6).toFixed(2)})
              </p>
            ))}
            <p className={cyclic ? "status good" : "status bad"}>
              {cyclic ? <CheckCircle2 /> : <XCircle className="bad" />} {verticesOnCircle} of 4
              vertices lie on the reference circle.
            </p>
          </aside>
          <article>
            <div className="graph-toolbar">
              <div>
                <b className={cyclic ? "good" : "bad"}>
                  {cyclic ? <CheckCircle2 /> : <XCircle className="bad" />}{" "}
                  {cyclic ? "CYCLIC QUADRILATERAL" : "NOT CYCLIC"}
                </b>
                <span>
                  {cyclic
                    ? "All four vertices lie on one circle."
                    : "Restore each vertex to the reference circle."}
                </span>
              </div>
              <nav>
                {[
                  ["select", MousePointer2],
                  ["move", Move],
                  ["fit", Expand],
                  ["animate", Play],
                ].map(([value, Icon]) => (
                  <button
                    key={String(value)}
                    aria-label={`${value} tool`}
                    className={tool === value ? "active" : ""}
                    aria-pressed={tool===value} onClick={() => act(() => chooseTool(value as typeof tool))}
                  >
                    <Icon />
                  </button>
                ))}
              </nav>
            </div>
            <svg
              ref={svgRef}
              viewBox="0 0 684 520"
              aria-label="Interactive cyclic quadrilateral construction"
              onPointerDown={e=>{if(tool==='move'){const m=e.currentTarget.getScreenCTM();if(m){const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());panStart.current={x:p.x,y:p.y,pan};e.currentTarget.setPointerCapture(e.pointerId);}}}}
              onPointerMove={updateFromPointer}
              onPointerUp={finishPointer}
              onPointerCancel={()=>{setDragging(null);panStart.current=null;frozenScale.current=null;}}
            >
              {showCircle && (
                <circle className="fit-circle" cx={cx} cy={cy} r={radius} />
              )}
              <line
                className="diagonal"
                x1={screenPoints.A.x}
                y1={screenPoints.A.y}
                x2={screenPoints.C.x}
                y2={screenPoints.C.y}
              />
              <line
                className="diagonal"
                x1={screenPoints.B.x}
                y1={screenPoints.B.y}
                x2={screenPoints.D.x}
                y2={screenPoints.D.y}
              />
              <polygon className="quad" points={polygon} />
              <circle className="center" cx={cx} cy={cy} r="5" />
              <text x={cx + 8} y={cy - 8}>
                O
              </text>
              {NAMES.map((name, index) => {
                const p = screenPoints[name];
                return (
                  <g key={name}>
                    {showAngles&&<path className={`angle-fill n${index}`} d={quadrilateralSector(p,screenPoints[NAMES[(index+3)%4]],screenPoints[NAMES[(index+1)%4]],measures[name])}/>}
                    <circle
                      className={`vertex ${name.toLowerCase()}`}
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      role="slider"
                      tabIndex={0}
                      aria-label={`Vertex ${name}`}
                      aria-valuemin={0}
                      aria-valuemax={359}
                      aria-valuenow={round(vertices[name].angle)}
                      onPointerDown={(event) => {
                        if(tool==='move')return;event.stopPropagation();setTool('select');frozenScale.current=radius;event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(name));
                      }}
                      onKeyDown={(event) => {event.stopPropagation();setTool('select');
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, {
                              ...vertices[name],
                              angle: vertices[name].angle + 3,
                            }),
                          );
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, {
                              ...vertices[name],
                              angle: vertices[name].angle - 3,
                            }),
                          );
                        }
                        if (event.key === "ArrowDown" && !snap) {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, {
                              ...vertices[name],
                              radius: 0.82,
                            }),
                          );
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          act(() =>
                            setVertex(name, { ...vertices[name], radius: 1 }),
                          );
                        }
                      }}
                    />
                    <text className="vertex-label" x={cx+(p.x-cx)*1.12} y={cy+(p.y-cy)*1.12} textAnchor="middle">{name}</text>
                    {showAngles&&<text className={`measure n${index}`} x={cx+(p.x-cx)*.78} y={cy+(p.y-cy)*.78} textAnchor="middle">{measures[name].toFixed(1)}°</text>}
                  </g>
                );
              })}
            </svg>
            <footer>
              <section>
                <h3>OPPOSITE ANGLE SUMS</h3>
                {showSums ? (
                  <>
                    <p>
                      ∠A + ∠C = {measures.A.toFixed(1)}° + {measures.C.toFixed(1)}° = <b>{sumAC.toFixed(1)}°</b>{" "}
                      {Math.abs(sumAC - 180) < 1e-7 ? (
                        <CheckCircle2 />
                      ) : (
                        <XCircle className="bad" />
                      )}
                    </p>
                    <p>
                      ∠B + ∠D = {measures.B.toFixed(1)}° + {measures.D.toFixed(1)}° = <b>{sumBD.toFixed(1)}°</b>{" "}
                      {Math.abs(sumBD - 180) < 1e-7 ? (
                        <CheckCircle2 />
                      ) : (
                        <XCircle className="bad" />
                      )}
                    </p>
                    <small>A cyclic quadrilateral has both sums equal to 180°.</small>
                  </>
                ) : (
                  <p>Opposite-sum layer hidden.</p>
                )}
              </section>
              <section>
                <h3>CYCLIC CHECK</h3>
                <p>
                  Vertices on circle: <b>{verticesOnCircle} of 4</b>
                </p>
                <p>
                  Result: <b>{cyclic ? "Cyclic" : "Not cyclic"}</b>{" "}
                  {cyclic ? <CheckCircle2 /> : <XCircle className="bad" />}
                </p>
              </section>
            </footer>
          </article>
        </section>

        <section className="cyq10094-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              A simple, nondegenerate quadrilateral is cyclic if and only if each pair of opposite
              angles is supplementary.
            </p>
            <strong><MathExpression value={String.raw`\angle A+\angle C=180^\circ`}/><MathExpression value={String.raw`\angle B+\angle D=180^\circ`}/></strong>
            <p>
              <CheckCircle2 /> All four vertices are concyclic.
            </p>
            <p>
              <CheckCircle2 /> The angle sums follow from common arcs.
            </p>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>Consider rectangle ABCD.</p>
            <Figure vertices={rectangleVertices} rectangle/>
            <p>
              Each interior angle = 90°.
              <br />
              ∠A + ∠C = 180°
              <br />
              ∠B + ∠D = 180°
            </p>
            <b>Hence, ABCD is cyclic.</b>
          </article>
          <article className="warning">
            <h2>WARNING: COMMON MISTAKE</h2>
            <p>
              Drawing a circle near four points does not prove they are cyclic.
            </p>
            <Figure vertices={{...rectangleVertices,C:{...rectangleVertices.C,radius:.35}}} warning/>
            <strong>
              <XCircle className="bad" /> Not cyclic
            </strong>
            <p>Vertex C is not on the circle.</p>
          </article>
        </section>

        <section className="cyq10094-challenge">
          <aside>
            <h2>CHALLENGE</h2>
            <p>Move vertex B off the circle. Can you restore cyclicity?</p>
            <ol>
              <li>Move B anywhere off the circle.</li>
              <li>Adjust its radius back to the fitted circle.</li>
              <li>Check the cyclic result.</li>
            </ol>
            <button onClick={() => act(() => setChallengeChecked(true))}>
              Check answer
            </button>
          </aside>
          <article>
            <h3>Your current figure</h3>
            <Figure vertices={challengeVertices} onRadius={v=>{setChallengeRadius(v);setChallengeChecked(false);}}/>
            <label>
              Vertex B radius{" "}
              <input
                aria-label="Challenge vertex B radius"
                type="range"
                min=".7"
                max="1.25"
                step=".01"
                value={challengeRadius}
                onChange={(event) =>
                  act(() => {
                    setChallengeRadius(+event.target.value);
                    setChallengeChecked(false);
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => {
                      setChallengeRadius((value) =>
                        Math.max(0.7, round(value - 0.01, 2)),
                      );
                      setChallengeChecked(false);
                    });
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => {
                      setChallengeRadius((value) =>
                        Math.min(1.25, round(value + 0.01, 2)),
                      );
                      setChallengeChecked(false);
                    });
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    act(() => {
                      setChallengeRadius(1);
                      setChallengeChecked(false);
                    });
                  }
                }}
              />
            </label>
          </article>
          <article className="challenge-status" role="status" aria-live="polite">
            <h3>Status</h3>
            <strong className={challengeOnCircle ? "good" : "bad"}>
              {challengeOnCircle ? "CYCLIC" : "NOT CYCLIC"}
            </strong>
            <p>
              Vertices on circle:{" "}
              <b>{challengeOnCircle ? "4 of 4" : "3 of 4"}</b>
            </p>
            <p>
              Opposite angle condition:{" "}
              <b>{challengeOnCircle ? "satisfied" : "not satisfied"}</b>
            </p>
            <p>∠A + ∠C = {challengeModel.sums.AC.toFixed(1)}°</p><p>∠B + ∠D = {challengeModel.sums.BD.toFixed(1)}°</p>
            {challengeChecked && (
              <p className={challengeCorrect ? "good" : "bad"}>
                {challengeCorrect
                  ? "Correct! Cyclicity restored."
                  : "Move B onto the circle before checking."}
              </p>
            )}
          </article>
        </section>
        <nav className="cyq10094-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angles-in-the-same-segment">
            <ArrowLeft /> Angles in the Same Segment
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-opposite-angles-of-a-cyclic-quadrilateral">
            Opposite Angles of a Cyclic Quadrilateral <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="cyq10094-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
