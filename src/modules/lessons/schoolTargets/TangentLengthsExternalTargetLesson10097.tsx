import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TangentLengthsExternalTargetLesson10097.css";
import{externalTangents,tangentRightAngle,normalizeTangentAngle}from "./tangentLengthsModel";
import MathExpression from "../../../components/ui/MathExpression";


type Handle = "P" | "A" | "B" | null;
type Point = { x: number; y: number };
const RADIUS = 6;
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
const normalize=normalizeTangentAngle;
const markPath=(t:Point,o:Point,p:Point,size=13)=>tangentRightAngle(t,o,p,size).map((v,i)=>`${i?'L':'M'}${v.x},${v.y}`).join(' ');

function TangentExample(){const {points:q}=externalTangents(10,0),s=(p:Point)=>({x:200+p.x*20,y:165-p.y*20}),O=s(q.O),P=s(q.P),A=s(q.A),B=s(q.B);return <svg className="tle10097-example-diagram" viewBox="0 0 520 330" role="img" aria-label="Two eight centimetre tangent segments"><circle cx={O.x} cy={O.y} r="120" fill="#fff" stroke="#176fe0" strokeWidth="2"/><path d={`M${A.x} ${A.y}L${O.x} ${O.y}L${B.x} ${B.y}L${P.x} ${P.y}Z`} fill="#eee8ff"/><path d={`M${A.x} ${A.y}L${P.x} ${P.y}L${B.x} ${B.y}`} fill="none" stroke="#6c34ce" strokeWidth="2"/><path d={`M${A.x} ${A.y}L${O.x} ${O.y}L${B.x} ${B.y}`} fill="none" stroke="#18243a" strokeWidth="2"/><path d={`M${O.x} ${O.y}L${P.x} ${P.y}`} stroke="#7040d2" strokeDasharray="6 4"/>{[A,B].map((T,i)=><path key={i} d={markPath(T,O,P,12)} fill="none" stroke="#18243a"/>)}{Object.entries({O,A,B,P}).map(([n,T])=><g key={n}><circle cx={T.x} cy={T.y} r="4" fill={n==='A'?'#ef9915':n==='B'?'#1679d5':n==='P'?'#7137cb':'#151d2d'}/><text x={T.x+(n==='O'?-22:6)} y={T.y+(n==='A'?-12:18)}>{n}</text></g>)}<text x="340" y="108">PA = 8 cm</text><text x="340" y="240">PB = 8 cm</text></svg>;}
function DifferentPoints(){const p=externalTangents(10,180).points,q=externalTangents(8,0).points,s=(v:Point)=>({x:200+v.x*15,y:125-v.y*15});return <svg className="tle10097-different-diagram" viewBox="0 0 430 250" role="img" aria-label="Unequal tangent lengths from different external points"><circle cx="200" cy="125" r="90" fill="#fff" stroke="#176fe0"/>{[[p,'#7137cb'],[q,'#159353']].map(([value,color],i)=>{const v=value as typeof p,P=s(v.P),A=s(v.A),B=s(v.B);return <g key={i}><path d={`M${A.x} ${A.y}L${P.x} ${P.y}L${B.x} ${B.y}`} fill="none" stroke={color as string} strokeWidth="2"/><circle cx={P.x} cy={P.y} r="5" fill={color as string}/><text x={P.x-5} y={P.y-15}>{i?'Q':'P'}</text></g>;})}<circle cx="200" cy="125" r="4"/><text x="194" y="145">O</text></svg>;}

export default function TangentLengthsExternalTargetLesson10097({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [distance, setDistance] = useState(10);
  const [direction, setDirection] = useState(0);
  const [dragging, setDragging] = useState<Handle>(null);
  const [enabled, setEnabled] = useState({ P: true, A: true, B: true });
  const [showRadii, setShowRadii] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [showCongruent, setShowCongruent] = useState(true);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const model=externalTangents(distance,direction),{alpha,points}=model;
  const tangentLength=model.pa,tangentLengthB=model.pb,difference=model.difference,equal=difference<1e-9;
  const [visited,setVisited]=useState({near:false,far:false});
  const mainRef=useRef<HTMLElement>(null),dragScale=useRef<number|null>(null);
  const cx=300,cy=250,scale=dragScale.current??model.scale;
  const screen=(p:Point)=>({x:cx+p.x*scale,y:cy-p.y*scale});
  const s={O:screen(points.O),P:screen(points.P),A:screen(points.A),B:screen(points.B)};
  const setP = (nextDistance: number, nextDirection = direction) => {
    if(!Number.isFinite(nextDistance)||!Number.isFinite(nextDirection))return;
    const d=Math.max(RADIUS+.5,Math.min(15,round(nextDistance,3)));setDistance(d);setVisited(v=>({near:v.near||d<=8,far:v.far||d>=12}));
    setDirection(normalize(round(nextDirection,3)));
  };
  const pointerWorld = (event: PointerEvent<SVGSVGElement>) => {
    const m=svgRef.current?.getScreenCTM();if(!m)return null;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());return{x:(p.x-cx)/scale,y:(cy-p.y)/scale};
  };
  const updatePointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !enabled[dragging]) return;
    const world = pointerWorld(event);if(!world)return;
    let degrees = (Math.atan2(world.y, world.x) * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    if (dragging === "P") setP(Math.hypot(world.x, world.y), degrees);
    if (dragging === "A") setDirection(normalize(round(degrees-alpha,3)));
    if (dragging === "B") setDirection(normalize(round(degrees+alpha,3)));
  };
  const reset = () =>
    act(() => {
      setDistance(10);
      setDirection(0);
      setEnabled({ P: true, A: true, B: true });
      setShowRadii(true);
      setShowRight(true);
      setShowCongruent(true);setDragging(null);dragScale.current=null;setTab(0);setVisited({near:false,far:false});
    });
  const Switch = ({
    name,
    label,
  }: {
    name: keyof typeof enabled;
    label: string;
  }) => (
    <label className="tle10097-switch">
      <i className={name.toLowerCase()} />
      {label}
      <input
        type="checkbox"
        checked={enabled[name]}
        onChange={(event) =>
          act(() =>
            setEnabled((value) => ({ ...value, [name]: event.target.checked })),
          )
        }
      />
      <span />
    </label>
  );
  const Check = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <label className="tle10097-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => onChange(event.target.checked))}
      />{" "}
      {label}
    </label>
  );

  const navigateTab=(i:number)=>{act(()=>setTab(i));const selectors=['.tle10097-lab','.tle10097-proof','.tle10097-proof article:nth-child(2)','.tle10097-proof','.tle10097-bottom article:nth-child(2)'];mainRef.current?.querySelector(selectors[i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  return (
    <section
      className="tle10097-page"
      data-testid="school-mockup-0771"
      data-object-model="dedicated-external-point-two-tangent-congruence-engine"
      data-distance-op={round(distance)}
      data-direction={round(direction)}
      data-pa={round(tangentLength)} data-exact-pa={tangentLength} data-exact-pb={tangentLengthB} data-challenge-complete={String(visited.near&&visited.far)}
      data-pb={round(tangentLengthB)}
      data-difference={difference}
      data-equal={String(equal)}
      data-actions={actions}
    >
      <div className="tle10097-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <Link className="tle10097-school" to="/lessons/school">← School Lessons</Link>
        <h1>Tangent Lengths from an External Point</h1>
        <p>
          From an external point P, the lengths of the tangent segments PA and
          PB to a circle are equal.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </div>
      <div className="tle10097-tabs" role="group" aria-label="Lesson sections">
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
        <section className="tle10097-lab">
          <h2>Explore the Theorem</h2>
          <p>
            Drag point P or the tangent points A and B.
            <br />
            Watch how PA and PB always stay equal.
          </p>
          <div className="lab-grid">
            <aside>
              <h3>Controls</h3>
              {Switch({name:"P",label:"Drag P (external point)"})}
              {Switch({name:"A",label:"Drag A (tangent point)"})}
              {Switch({name:"B",label:"Drag B (tangent point)"})}
              <h3>Show / Hide</h3>
              {Check({label:'Radii OA, OB',checked:showRadii,onChange:setShowRadii})}
              {Check({label:'Right-angle marks',checked:showRight,onChange:setShowRight})}
              {Check({label:'Congruent triangles ΔOAP & ΔOBP',checked:showCongruent,onChange:setShowCongruent})}
              <button className="reset" onClick={reset}>
                Reset construction
              </button>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="0 0 650 500"
                aria-label="Two tangent segments from external point P"
                onPointerMove={updatePointer}
                onPointerUp={event=>{if(dragging)updatePointer(event);dragScale.current=null;act(()=>setDragging(null));}}
                onPointerCancel={()=>{dragScale.current=null;setDragging(null);}}
              >
                <circle className="circle" cx={cx} cy={cy} r={RADIUS * scale} />
                {showCongruent && (
                  <>
                    <polygon
                      className="triangle upper"
                      points={`${s.O.x},${s.O.y} ${s.A.x},${s.A.y} ${s.P.x},${s.P.y}`}
                    />
                    <polygon
                      className="triangle lower"
                      points={`${s.O.x},${s.O.y} ${s.B.x},${s.B.y} ${s.P.x},${s.P.y}`}
                    />
                  </>
                )}
                <line
                  className="tangent"
                  x1={s.A.x}
                  y1={s.A.y}
                  x2={s.P.x}
                  y2={s.P.y}
                />
                <line
                  className="tangent"
                  x1={s.B.x}
                  y1={s.B.y}
                  x2={s.P.x}
                  y2={s.P.y}
                />
                    <line
                      className="op"
                      x1={s.O.x}
                      y1={s.O.y}
                      x2={s.P.x}
                      y2={s.P.y}
                    />
                {showRadii && (
                  <>
                    <line
                      className="radius"
                      x1={s.O.x}
                      y1={s.O.y}
                      x2={s.A.x}
                      y2={s.A.y}
                    />
                    <line
                      className="radius"
                      x1={s.O.x}
                      y1={s.O.y}
                      x2={s.B.x}
                      y2={s.B.y}
                    />

                  </>
                )}
                {showRight && (
                  <>
                    <path className="right" data-right-mark="A" d={markPath(s.A,s.O,s.P)}/><path className="right" data-right-mark="B" d={markPath(s.B,s.O,s.P)}/>

                  </>
                )}
                <circle className="center" cx={s.O.x} cy={s.O.y} r="6" />
                <text x={s.O.x - 28} y={s.O.y + 6}>
                  O
                </text>
                {(["A", "B", "P"] as const).map((name) => {
                  const p = s[name];
                  return (
                    <g key={name}>
                      <circle
                        className={`handle ${name.toLowerCase()}`}
                        cx={p.x}
                        cy={p.y}
                        r="10"
                        role="slider"
                        tabIndex={0}
                        aria-disabled={!enabled[name]}
                        aria-label={`Point ${name}`}
                        aria-valuemin={name==='P'?6.5:0}
                        aria-valuemax={name === "P" ? 15 : 360}
                        aria-valuenow={
                          name === "P"
                            ? round(distance)
                            : round(
                                name === "A"
                                  ? normalize(direction + alpha)
                                  : normalize(direction - alpha),
                              )
                        }
                        onPointerDown={(event) => {
                          if (!enabled[name]) return;
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          dragScale.current=scale;act(() => setDragging(name));
                        }}
                        onKeyDown={(event) => {
                          event.stopPropagation();
                          if(name==='P'&&enabled.P&&(event.key==='ArrowUp'||event.key==='ArrowDown')){event.preventDefault();act(()=>setP(distance,direction+(event.key==='ArrowUp'?2:-2)));}
                          if(name==='P'&&enabled.P&&event.key==='Home'){event.preventDefault();act(()=>setP(10,0));}
                          if (!enabled[name]) return;
                          if (name === "P" && event.key === "ArrowRight") {
                            event.preventDefault();
                            act(() => setP(distance + 0.5));
                          }
                          if (name === "P" && event.key === "ArrowLeft") {
                            event.preventDefault();
                            act(() => setP(distance - 0.5));
                          }
                          if (name !== "P" && event.key === "ArrowRight") {
                            event.preventDefault();
                            act(() => setDirection(normalize(direction - 2)));
                          }
                          if (name !== "P" && event.key === "ArrowLeft") {
                            event.preventDefault();
                            act(() => setDirection(normalize(direction + 2)));
                          }
                        }}
                      />
                      <text
                        className={`label ${name.toLowerCase()}`}
                        x={p.x + (name === "P" ? 12 : 2)}
                        y={p.y + (name === "A" ? -17 : 27)}
                      >
                        {name}
                      </text>
                    </g>
                  );
                })}
                <text
                  className="length top"
                  x={(s.A.x + s.P.x) / 2}
                  y={(s.A.y + s.P.y) / 2 - 14}
                >
                  PA = {tangentLength.toFixed(2)} cm
                </text>
                <text
                  className="length bottom"
                  x={(s.B.x + s.P.x) / 2}
                  y={(s.B.y + s.P.y) / 2 + 25}
                >
                  PB = {tangentLengthB.toFixed(2)} cm
                </text>
              </svg>
            </article>
          </div>
          <footer>
            <section>
              <CheckCircle2 />
              <b>Result</b>
              <strong>PA = PB</strong>
              <span>The tangent segments from P are equal.</span>
            </section>
            <div>
              <p>
                PA<b>{tangentLength.toFixed(2)} cm</b>
              </p>
              <p>
                PB<b>{tangentLengthB.toFixed(2)} cm</b>
              </p>
              <p>
                Difference<b>{difference.toFixed(2)} cm</b>
              </p>
            </div>
          </footer>
        </section>
        <section className="tle10097-proof">
          <article>
            <h2>Why It Works</h2>
            <div>
              <p>ΔOAP and ΔOBP are right triangles.</p>
              <ul>
                <li>OA = OB = radius</li>
                <li>∠OAP = ∠OBP = 90°</li>
                <li>OP = OP (common side)</li>
              </ul>
              <p>By RHS (HL) congruence,</p>
              <strong><MathExpression value={String.raw`\triangle OAP\cong\triangle OBP`}/></strong>
              <p>Therefore, PA = PB.</p>
            </div>
          </article>
          <article>
            <h2>Worked Example</h2>
            <p>If PA = 8 cm, then PB = 8 cm.</p>
            <TangentExample/>
            <p>
              PA = 8 cm
              <br />
              PB = 8 cm
            </p>
          </article>
        </section>
        <section className="tle10097-bottom">
          <article className="mistake">
            <h2>
              <AlertTriangle /> Common Misconception
            </h2>
            <p>
              It is not true that tangent lengths from different external points
              are equal.
            </p>
            <p>
              The equality holds only for tangent segments from the same
              external point.
            </p>
            <DifferentPoints/>
            <p>For example, tangents from P have length 8 cm; tangents from Q have length √28 ≈ 5.29 cm. Equal lengths are guaranteed within each pair.</p>
          </article>
          <article>
            <h2>
              <Star /> Your Challenge
            </h2>
            <p>
              <b>Drag point P to different locations.</b>
              <br />
              Observe how PA and PB change, but always remain equal.
            </p>
            <div className="try">
              <b>Try this:</b>
              <p>
                Move P far away and then closer to the circle. What do you
                notice about the lengths?
              </p>
            </div>
            <div className="goal">
              <CheckCircle2 />
              <b>Challenge Goal</b>
              <p>
                {visited.near&&visited.far?'Near and far positions explored: PA = PB in both cases.':'Explore a near position (OP ≤ 8 cm) and a far position (OP ≥ 12 cm). PA remains equal to PB.'}
              </p>
            </div>
            <p role="status">Near: {visited.near?'explored':'pending'} · Far: {visited.far?'explored':'pending'}</p>
          </article>
        </section>
        <nav className="tle10097-next">
          <Link to="/lessons/school/class-10/class-10-circle-proofs-tangent-perpendicular-to-radius">
            <ArrowLeft /> Tangent Perpendicular to Radius
          </Link>
          <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-between-tangent-and-chord">
            Angle Between Tangent and Chord <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="tle10097-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
