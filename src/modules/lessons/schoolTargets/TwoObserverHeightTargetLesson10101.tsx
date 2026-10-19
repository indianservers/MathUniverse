import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TwoObserverHeightTargetLesson10101.css";
import{twoObserverScene,tangent}from "./twoObserverHeightModel";
import MathExpression from "../../../components/ui/MathExpression";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
function MiniDiagram({wrong=false}:{wrong?:boolean}){return <svg className="toh10101-mini-diagram" viewBox="0 0 260 140" role="img" aria-label={wrong?'Incorrect angle assignment':'Two right triangles sharing one height'}><path d="M15 108H235V18" fill="none" stroke="#263550" strokeWidth="1.5"/><path d="M15 108L235 18M130 108L235 18" fill="none" stroke="#287bce" strokeDasharray="4 3"/><path d="M42 108Q42 98 39 97M151 108Q151 95 146 94" fill="none" stroke={wrong?'#bd3044':'#289d58'}/><text x="43" y="103">{wrong?'60°':'β'}</text><text x="153" y="103">{wrong?'30°':'α'}</text><text x="240" y="65">h</text><path d="M15 123H130M130 123H235" stroke="#263550"/><text x="68" y="137">d</text><text x="181" y="137">x</text>{wrong&&<text x="106" y="60" fill="#bd3044" fontSize="24">×</text>}</svg>;}

export default function TwoObserverHeightTargetLesson10101({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [nearAngle, setNearAngle] = useState(60);
  const [farAngle, setFarAngle] = useState(30);
  const [observerGap, setObserverGap] = useState(20);
  const [dragging, setDragging] = useState<"near" | "far" | null>(null);
  const [tab, setTab] = useState(0);
  const [nearAnswer, setNearAnswer] = useState("");
  const [heightAnswer, setHeightAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const mainRef=useRef<HTMLElement>(null),frozenRise=useRef<number|null>(null);
  const [gapDraft,setGapDraft]=useState<string|null>(null),[gapError,setGapError]=useState('');
  const sceneRef = useRef<SVGSVGElement>(null);

  const {valid,x:nearDistanceValue,h:heightValue,far:farDistanceValue,towerX,groundY,topY,scale:visualScale,nearX,farX}=twoObserverScene(nearAngle,farAngle,observerGap,frozenRise.current);
  const nearDistance=nearDistanceValue??0,height=heightValue??0,farDistance=farDistanceValue??0;
  const arc=(x:number,angle:number,r:number)=>`M${x+r} ${groundY} A${r} ${r} 0 0 0 ${x+r*Math.cos(angle*Math.PI/180)} ${groundY-r*Math.sin(angle*Math.PI/180)}`;
  const cramped=nearX-farX<110;
  const defaultCase=nearAngle===60&&farAngle===30&&observerGap===20;
  const challengeNear = (30 * tangent(22.5)) / (tangent(45) - tangent(22.5));
  const challengeHeight = challengeNear * tangent(45);
  const challengeCorrect =
    nearAnswer.trim()!==''&&heightAnswer.trim()!==''&&Math.abs(Number(nearAnswer) - challengeNear) <= 0.02 &&
    Math.abs(Number(heightAnswer) - challengeHeight) <= 0.02;

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setNear = (value: number) => {
    if(!Number.isFinite(value))return;
    setNearAngle(Math.max(farAngle + 1, Math.min(80, round(value, 1))));
    setGraded(false);
  };
  const setFar = (value: number) => {
    if(!Number.isFinite(value))return;
    setFarAngle(Math.max(10, Math.min(nearAngle - 1, round(value, 1))));
    setGraded(false);
  };
  const setGap = (value: number) => {
    if(!Number.isFinite(value))return;
    setObserverGap(Math.max(5, Math.min(100, round(value,1))));
    setGraded(false);
  };
  const reset = () =>
    act(() => {
      setNearAngle(60);
      setFarAngle(30);
      setObserverGap(20);
      setNearAnswer("");
      setHeightAnswer("");
      setGraded(false);
      setShowSolution(false);setDragging(null);frozenRise.current=null;setGapDraft(null);setGapError('');setTab(0);
    });
  const updateObserver = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const m=sceneRef.current?.getScreenCTM();if(!m)return;
    const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());
    const angle=Math.atan2(groundY-topY,Math.max(1,towerX-pt.x))*180/Math.PI;
    if (dragging === "near") setNear(angle);
    else setFar(angle);
  };

  const navigateTab=(index:number)=>{act(()=>setTab(index));const selectors=['.toh10101-lab','.toh10101-cards','.toh10101-cards article:nth-child(2)','.toh10101-equations','.toh10101-challenge'];mainRef.current?.querySelector(selectors[index])?.scrollIntoView({behavior:'smooth',block:'start'});};

  return (
    <section
      className="toh10101-page"
      data-testid="school-mockup-0775"
      data-object-model="dedicated-two-observer-linked-tangent-engine"
      data-near-angle={nearAngle}
      data-far-angle={farAngle}
      data-observer-gap={observerGap}
      data-near-distance={round(nearDistance)}
      data-far-distance={round(farDistance)}
      data-height={round(height, 3)}
      data-exact-height={heightValue??"none"} data-exact-near={nearDistanceValue??"none"} data-scene-scale={visualScale}
      data-valid={String(valid)}
      data-challenge-near={round(challengeNear)}
      data-challenge-height={round(challengeHeight)}
      data-challenge-correct={String(graded && challengeCorrect)}
      data-actions={actions}
    >
      <div className="toh10101-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <Link className="toh10101-school" to="/lessons/school">← School lessons</Link>
        <h1>Two-Observer Height Problems</h1>
        <p>
          Determine the height of an inaccessible object using angles of
          elevation measured from two points on the same side.
        </p>
        <div>
          <span>20 min</span>
          <span>INTERMEDIATE</span>
          <span>PRACTICE</span>
          <span>trigonometry</span>
          <span>two observers</span>
        </div>
      </div>

      <div className="toh10101-tabs" role="group" aria-label="Lesson sections">
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
        <button className="toh10101-reset" onClick={reset}>
          <RotateCcw /> Reset
        </button>
      </div>

      <main ref={mainRef}>
        <section className="toh10101-lab">
          <p>
            Drag the observers or adjust the angles. Distances update
            automatically.
          </p>
          <svg
            ref={sceneRef}
            viewBox="0 0 700 370"
            aria-label="Two observers measuring a tower"
            onPointerMove={(event) => dragging && updateObserver(event)}
            onPointerUp={event=>{if(dragging)updateObserver(event);frozenRise.current=null;act(()=>setDragging(null));}}
            onPointerCancel={()=>{frozenRise.current=null;setDragging(null);}}
          >
            <defs>
              <linearGradient id="toh-sky" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#e2f1ff"/></linearGradient>
              <marker id="toh-dimension" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="#263550"/></marker>
              <pattern
                id="toh-bricks"
                width="15"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 0h24v16H0z" fill="#d98a54" />
                <path
                  d="M0 0h24M0 16h24M12 0v8M0 8h24M4 8v8"
                  fill="none"
                  stroke="#99502f"
                  strokeWidth=".7"
                />
              </pattern>
            </defs>
            <rect className="toh10101-sky" width="700" height="300" />
            <path
              className="toh10101-cloud"
              d="M85 120c8-24 37-23 46-5 13-12 36-3 36 13H74c0-5 5-8 11-8zM250 68c7-21 31-20 39-5 11-10 29-2 30 11h-77c0-4 3-6 8-6z"
            />
            <rect x="0" y="300" width="700" height="70" fill="#efe4d2"/>
            <path d={Array.from({length:140},(_,i)=>`M${i*5} 302v-${3+i%4}`).join(' ')} stroke="#76a246" strokeWidth="2"/>
            <line
              className="toh10101-ground"
              x1="0"
              y1={groundY}
              x2="700"
              y2={groundY}
            />
            <rect
              x="585"
              y={topY + 28}
              width="70"
              height={groundY - topY - 28}
              fill="url(#toh-bricks)"
              stroke="#78452f"
            />
            <path
              className="toh10101-roof"
              d={`M578 ${topY+30} L620 ${topY} L662 ${topY+30} Z`}
            />
            <path d={[590,605,620,635,650].map(x=>`M620 ${topY}L${x} ${topY+30}`).join(' ')} fill="none" stroke="#63311e" strokeWidth="1"/>
            <rect
              className="toh10101-window"
              x="592"
              y={topY + 40}
              width="15"
              height={Math.min(22,(groundY-topY-28)*.25)}
            />
            <rect
              className="toh10101-window"
              x="613"
              y={topY + 40}
              width="15"
              height={Math.min(22,(groundY-topY-28)*.25)}
            />
            <rect
              className="toh10101-window"
              x="634"
              y={topY + 40}
              width="15"
              height={Math.min(22,(groundY-topY-28)*.25)}
            />
            <path
              className="toh10101-door"
              d={`M610 ${groundY}v-28a13 13 0 0 1 26 0v28`}
            />
            <line
              className="toh10101-sight near"
              x1={nearX}
              y1={groundY}
              x2={towerX}
              y2={topY}
            />
            <line
              className="toh10101-sight far"
              x1={farX}
              y1={groundY}
              x2={towerX}
              y2={topY}
            />
            <path
              className="toh10101-angle near"
              d={arc(nearX,nearAngle,Math.min(44,(towerX-nearX)*.4))}
            />
            <path
              className="toh10101-angle far"
              d={arc(farX,farAngle,Math.min(50,(nearX-farX)*.4))}
            />
            {(['near','far'] as const).map(kind=><circle key={kind} className={`toh10101-handle ${kind}`} cx={kind==='near'?nearX:farX} cy={groundY} r="9" role="slider" tabIndex={0} aria-label={`${kind==='near'?'Near':'Far'} observer`} aria-valuemin={kind==='near'?farAngle+1:10} aria-valuemax={kind==='near'?80:nearAngle-1} aria-valuenow={kind==='near'?nearAngle:farAngle} onPointerDown={event=>{frozenRise.current=groundY-topY;event.currentTarget.setPointerCapture(event.pointerId);act(()=>setDragging(kind));}} onKeyDown={event=>{event.stopPropagation();const angle=kind==='near'?nearAngle:farAngle,setter=kind==='near'?setNear:setFar;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();act(()=>setter(angle+(event.key==='ArrowRight'?1:-1)));}if(event.key==='Home'){event.preventDefault();act(()=>setter(kind==='near'?60:30));}}}/>)}
            <text
              className="toh10101-label near"
              x={nearX - 25}
              y={groundY - (cramped?62:25)}
            >
              A (near)
            </text>
            <text className="toh10101-label far" x={farX - 20} y={groundY - (cramped?30:25)}>
              B (far)
            </text>
            <text
              className="toh10101-angle-text near"
              x={nearX + 38}
              y={groundY - (cramped?50:32)}
            >
              {nearAngle.toFixed(1)}°
            </text>
            <text
              className="toh10101-angle-text far"
              x={farX + (cramped?18:40)}
              y={groundY - (cramped?14:18)}
            >
              {farAngle.toFixed(1)}°
            </text>
            <g className="toh10101-dimensions" fill="none" stroke="#263550" strokeWidth="1"><path d={`M${farX} 310V360 M${nearX} 310V345 M620 310V360`}/><path markerStart="url(#toh-dimension)" markerEnd="url(#toh-dimension)" d={`M${farX} 319H${nearX}`}/><path markerStart="url(#toh-dimension)" markerEnd="url(#toh-dimension)" d={`M${nearX} 335H620`}/><path markerStart="url(#toh-dimension)" markerEnd="url(#toh-dimension)" d={`M${farX} 357H620`}/><path markerStart="url(#toh-dimension)" markerEnd="url(#toh-dimension)" d={`M680 300V${topY}`}/></g>
            <text textAnchor="middle" x={(nearX+farX)/2} y="316">{observerGap} m</text><text textAnchor="middle" x={(nearX+towerX)/2} y="331">x</text><text textAnchor="middle" x={(farX+towerX)/2} y="354">x + {observerGap}</text><text className="toh10101-height-label" x="684" y={(topY+groundY)/2}>h</text>

          </svg>
          <section className="toh10101-controls">
            <article>
              <h3>ANGLE AT A (NEAR)</h3>
              <strong className="toh10101-gauge near" style={{background:`conic-gradient(#299d58 ${nearAngle/90*360}deg,#dce3e9 0)`}}><span>{nearAngle}°</span></strong>
              <div>
                <button aria-label="Decrease near angle" onClick={() => act(() => setNear(nearAngle - 1))}>
                  −
                </button>
                <button aria-label="Increase near angle" onClick={() => act(() => setNear(nearAngle + 1))}>
                  +
                </button>
              </div>
            </article>
            <article>
              <h3>ANGLE AT B (FAR)</h3>
              <strong className="toh10101-gauge far" style={{background:`conic-gradient(#8043b3 ${farAngle/90*360}deg,#dce3e9 0)`}}><span>{farAngle}°</span></strong>
              <div>
                <button aria-label="Decrease far angle" onClick={() => act(() => setFar(farAngle - 1))}>
                  −
                </button>
                <button aria-label="Increase far angle" onClick={() => act(() => setFar(farAngle + 1))}>
                  +
                </button>
              </div>
            </article>
            <article>
              <h3>DISTANCE AB</h3>
              <label>
                <input
                  aria-label="Observer distance"
                  type="number"
                  min="5"
                  max="100" step="0.1"
                  value={gapDraft??observerGap}
                  onBlur={()=>{setGapDraft(null);setGapError('');}}
                  onChange={event=>{const text=event.target.value,v=Number(text);setGapDraft(text);if(text.trim()===''||!Number.isFinite(v)||v<5||v>100){setGapError('Distance must be from 5 to 100 metres.');return;}setGapError('');act(()=>setGap(v));}}
                />{" "}
                m
              </label>
              <input
                aria-label="Observer distance slider"
                type="range"
                min="5"
                max="100" step="0.1"
                value={observerGap}
                onChange={(event) => act(() => setGap(+event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setGap(observerGap - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setGap(observerGap + 1));
                  }
                }}
              />
            </article>
            <article className={valid ? "consistent" : "invalid"}>
              <h3>CALCULATED HEIGHT</h3>
              <strong>
                {valid ? defaultCase?<MathExpression value={String.raw`h=10\sqrt{3}\,m`}/>: `h = ${height.toFixed(3)} m` : "Angles must differ"}
              </strong>
              <p>
                {valid
                  ? `Near distance x = ${nearDistance.toFixed(2)} m`
                  : "Near angle must exceed far angle."}
              </p>
              <span>
                {valid ? (
                  <>
                    <CheckCircle2 /> Consistent
                  </>
                ) : (
                  <>
                    <AlertTriangle /> Invalid
                  </>
                )}
              </span>
            </article>
          </section>
          {gapError&&<p role="alert">{gapError}</p>}
        </section>

        <section className="toh10101-equations">
          <article>
            <h2>LINKED EQUATIONS</h2>
            <p>For observers on the same side:</p>
            <dl className="toh10101-definitions"><div><dt>x</dt><dd>near observer to tower base</dd></div><div><dt>d</dt><dd>observer separation (AB)</dd></div><div><dt>α</dt><dd>near angle at A</dd></div><div><dt>β</dt><dd>far angle at B</dd></div></dl>
            <strong><MathExpression value={String.raw`h=x\tan \alpha=(x+d)\tan \beta`}/></strong>
            <div className="toh10101-eq-pair">
              <span>
                From observer A (near):<MathExpression value={String.raw`h=x\tan ${nearAngle}^\circ`}/>

              </span>
              <span>
                From observer B (far):<MathExpression value={String.raw`h=(x+${observerGap})\tan ${farAngle}^\circ`}/>

              </span>
            </div>
            <p><MathExpression value={String.raw`x=\frac{d\tan \beta}{\tan \alpha-\tan \beta}=${nearDistance.toFixed(2)}\,m`}/></p>
            <b><MathExpression value={String.raw`h=x\tan \alpha=${height.toFixed(3)}\,m`}/></b>
          </article>
          <article>
            <h2>SOLVE STEPS</h2>
            <ol>
              <li>Write the two tangent equations.<p><MathExpression value={String.raw`h=x\tan ${nearAngle}^\circ,\quad h=(x+${observerGap})\tan ${farAngle}^\circ`}/></p></li>
              <li>Equate both expressions for h.<p><MathExpression value={String.raw`x\tan ${nearAngle}^\circ=(x+${observerGap})\tan ${farAngle}^\circ`}/></p></li>
              <li>Solve for near distance x.<p><MathExpression value={String.raw`x=${nearDistance.toFixed(3)}\,m`}/></p></li>
              <li>Substitute x to find height.<p><MathExpression value={String.raw`h=x\tan ${nearAngle}^\circ=${height.toFixed(3)}\,m`}/></p></li>
            </ol>
            <div className="toh10101-answer">
              <Trophy />
              <span>
                <b>ANSWER</b>Near distance x = {nearDistance.toFixed(2)} m<br />
                Height h = {height.toFixed(3)} m
              </span>
            </div>
          </article>
        </section>

        <section className="toh10101-cards">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              The two right triangles formed by the tower and observers share
              the same height h. Tangent relates height to each horizontal
              distance.
            </p>
            <MiniDiagram/>
            <strong>Key: Larger angle is at the nearer point.</strong>
          </article>
          <article>
            <h2>
              <CheckCircle2 /> WORKED EXAMPLE
            </h2>
            <p>Two observers are 20 m apart. Their angles are 60° and 30°.</p>
            <p>x = 20 tan30° / (tan60° − tan30°) = 10 m</p>
            <p>h = 10 tan60° = 10√3 m</p>
            <strong>Answer: x = 10 m, h ≈ 17.321 m</strong>
          </article>
          <article className="toh10101-mistake">
            <h2>
              <AlertTriangle /> COMMON MISTAKE
            </h2>
            <p>
              Assigning the larger angle to the farther observer reverses the
              geometry and gives a wrong or negative height.
            </p>
            <MiniDiagram wrong/>
            <strong>Larger angle must be at the nearer observer.</strong>
          </article>
        </section>

        <section className="toh10101-challenge">
          <div className="toh10101-heading">
            <h2>
              <Target /> YOUR CHALLENGE
            </h2>
            <p>
              Two observers are 30 m apart on level ground. The near angle is
              45° and the far angle is 22.5°. Find the near distance and tower
              height.
            </p>
          </div>
          <div>
            <label>
              Near distance x ={" "}
              <input
                aria-label="Challenge near distance"
                type="number"
                step="0.01"
                value={nearAnswer}
                onChange={(event) => {
                  setNearAnswer(event.target.value);
                  setGraded(false);
                }}
              />{" "}
              m
            </label>
            <label>
              Height h ={" "}
              <input
                aria-label="Challenge height"
                type="number"
                step="0.01"
                value={heightAnswer}
                onChange={(event) => {
                  setHeightAnswer(event.target.value);
                  setGraded(false);
                }}
              />{" "}
              m
            </label>
            <button onClick={() => act(() => setGraded(true))}>
              Check Answer
            </button>
            <button
              onClick={() => act(() => setShowSolution((value) => !value))}
            >
              <Eye /> {showSolution?'Hide Solution':'Show Solution'}
            </button>
          </div>
          {graded && (
            <p role="status" className={challengeCorrect ? "correct" : "incorrect"}>
              {challengeCorrect ? (
                <>
                  <CheckCircle2 /> Correct: x = h = {challengeHeight.toFixed(2)}{" "}
                  m.
                </>
              ) : (
                "Check both linked tangent equations and try again."
              )}
            </p>
          )}
          {showSolution && (
            <p className="solution">
              tan 22.5° = √2 − 1. Therefore x = 30(√2 − 1)/(1 − (√2 − 1)) =
              21.21 m and h = x tan45° = 21.21 m.
            </p>
          )}
          <aside>
            <b>Hint</b>tan 22.5° = √2 − 1
          </aside>
        </section>

        <nav className="toh10101-next">
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression">
            <ArrowLeft /> Angle of Depression
          </Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-shadow-length-modelling">
            Shadow-Length Modelling <ArrowRight />
          </Link>
        </nav>
      </main>
      <footer className="toh10101-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
