import { Check, CircleHelp, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./VectorEquationLineTargetLesson10155.css";
import MathExpression from "../../../components/ui/MathExpression";
import {clParam,clSymmetric,clParse,clDraft,clVector,clExact} from "./cartesianLineModel";
import "../components/LessonMockupReference.css";
import VectorEquationLineScene,{VL_CAMERA} from "./VectorEquationLineScene10155";
import {lpAdd,lpScale,lpDot,lpUnit} from "./linePlaneAngleModel";


type V = { x: number; y: number; z: number };
const A0 = { x: 1, y: -1, z: 2 },
  B0 = { x: 2, y: 1, z: 3 };
const fmt = (n: number) => n!==0&&Math.abs(n)<.001?n.toExponential(2):Number(n.toFixed(3));
const M=({value}:{value:string})=><div className="ve-math"><MathExpression value={value}/></div>;
export default function VectorEquationLineTargetLesson10155({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [a, setA] = useState(A0),
    [b, setB] = useState(B0),
    [lambda, setLambda] = useState(2),
    [layers, setLayers] = useState({
      anchor: true,
      direction: true,
      line: true,
      point: true,
      axes: true,
    }),
    [camera,setCamera]=useState(VL_CAMERA),
    [draftA,setDraftA]=useState(clDraft(A0)),
    [draftB,setDraftB]=useState(clDraft(B0)),
    [help,setHelp]=useState(false),
    [symmetric,setSymmetric]=useState(["","",""]),
    [auto, setAuto] = useState(false),
    [answers, setAnswers] = useState({
      p: ["", "", ""] as string[],
      lambda: "",
      onLine: "",
    }),
    [feedback, setFeedback] = useState<Record<string, boolean|undefined>>({}),
    [actions, setActions] = useState(0);
  const p = useMemo(
      () => ({
        x: a.x + lambda * b.x,
        y: a.y + lambda * b.y,
        z: a.z + lambda * b.z,
      }),
      [a, b, lambda],
    ),
    ma = Math.hypot(a.x, a.y, a.z),
    mb = Math.hypot(b.x, b.y, b.z),
    dot = a.x * b.x + a.y * b.y + a.z * b.z,
    theta = (Math.acos(Math.max(-1,Math.min(1,ma&&mb?(a.x/ma)*(b.x/mb)+(a.y/ma)*(b.y/mb)+(a.z/ma)*(b.z/mb):NaN))) * 180) / Math.PI;
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(
      () => setLambda((l) => (l >= 4 ? -4 : Number((l + 0.1).toFixed(1)))),
      100,
    );
    return () => clearInterval(id);
  }, [auto]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    },
    setComp = (kind:"a"|"b",axis:keyof V,text:string)=>act(()=>{const i=["x","y","z"].indexOf(axis),draft=(kind==="a"?draftA:draftB).map((v,j)=>i===j?text:v),parsed=clParse(draft);if(kind==="a"){setDraftA(draft);if(parsed)setA(parsed);}else{setDraftB(draft);if(parsed)setB(parsed);}setAuto(false);});
  const validInputs=!!clParse(draftA)&&!!clParse(draftB),validLine=validInputs&&mb>0;
  // Linear coordinates in span(a,b), vertically stretched for a legible schematic.
  const ub=lpUnit(b),ax=lpDot(a,ub),ay=-3*Math.hypot(a.x-ax*ub.x,a.y-ax*ub.y,a.z-ax*ub.z),bx=lambda*mb,minX=Math.min(0,ax,bx,ax+bx),maxX=Math.max(0,ax,bx,ax+bx),miniScale=Math.min(1e300,220/(maxX-minX||1),170/(-ay||1)),mo={x:30-minX*miniScale,y:225},maPoint={x:mo.x+ax*miniScale,y:mo.y+ay*miniScale},mbPoint={x:mo.x+bx*miniScale,y:mo.y},mp={x:maPoint.x+bx*miniScale,y:maPoint.y};
  const reset = () =>
    act(() => {
      setA(A0);
      setB(B0);
      setLambda(2);
      setLayers({
        anchor: true,
        direction: true,
        line: true,
        point: true,
        axes: true,
      });
      setCamera(VL_CAMERA);setDraftA(clDraft(A0));setDraftB(clDraft(B0));
      setAuto(false);
      setHelp(false);
    });
  return (
    <section
      className="ve10155-page lesson-reference"
      data-testid="school-mockup-0829"
      data-object-model="dedicated-anchor-direction-vector-line-engine"
      data-anchor={`${a.x},${a.y},${a.z}`}
      data-direction={`${b.x},${b.y},${b.z}`}
      data-lambda={lambda}
      data-point={validLine?`${p.x},${p.y},${p.z}`:undefined}
      data-valid={validLine}
      data-inputs-valid={validInputs}
      data-dot={dot.toFixed(3)}
      data-angle={Number.isFinite(theta)?theta.toFixed(3):undefined}
      data-actions={actions}
    >
      <section className="ve-hero"><a className="ve-school-link" href="/lessons/school">← School lessons</a>
        <small>CLASS 12 &bull; THREE-DIMENSIONAL GEOMETRY</small>
        <h1>Vector Equation of a Line</h1>
        <p>
          Explore the line determined by an anchor point a and direction vector
          b using r = a + λb.
        </p>
        <p>Visualize the line in 3D, move the point P(λ), try negative λ, and see how vectors and coordinates update.</p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry3d</span>
        </div>
      </section>
      <main className="ve-lab">
        <div className="ve-title">
          <div>
            <small>INTERACTIVE EXPLORER</small>
            <h2>Anchor + Direction 3D Explorer</h2>
          </div>
          <span>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button disabled={!validLine} onClick={() => act(() => setAuto((v) => !v))}>
              <Play />
              {auto ? "Pause" : "Animate"}
            </button>
            <button
              aria-expanded={help} onClick={()=>setHelp(v=>!v)}
            >
              <CircleHelp />
              Help
            </button>
          </span>
        </div>
        {help&&<p className="ve-help">Edit the anchor and a nonzero direction, then move λ to trace the line. Negative λ travels opposite b. Drag the scene to rotate it. A zero direction describes a point, not a line.</p>}
        {!validLine&&<p role="alert" className="ve-invalid">{validInputs?"Zero direction describes a point, not a line. Enter a nonzero b.":"Enter three finite components between −10 and 10 for both vectors. Blank is not zero."}</p>}
        <section className="ve-top">
          <aside className="ve-controls">
            <div className="lambda-badge">λ = {lambda}</div><div className="ve-point-badge">{validLine?`P = (${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)})`:"Enter valid vectors"}</div>
            {(["a", "b"] as const).map((kind) => (
              <article key={kind}>
                <h3>
                  {kind === "a" ? "Anchor vector a" : "Direction vector b"}
                </h3>
                <M value={`${kind}=${clVector(kind==="a"?a:b,true)}`}/>
                <div>
                  {(["x", "y", "z"] as const).map((axis) => (
                    <label key={axis}>
                      {axis}
                      <input
                        aria-label={`${kind} ${axis}`}
                        type="text" inputMode="decimal"
                        value={(kind === "a" ? draftA : draftB)[["x","y","z"].indexOf(axis)]}
                        aria-invalid={!clParse(kind==="a"?draftA:draftB)}
                        onChange={(e) => setComp(kind, axis, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
                <M value={`${kind}=\\begin{bmatrix}${clExact((kind==="a"?a:b).x)}\\\\${clExact((kind==="a"?a:b).y)}\\\\${clExact((kind==="a"?a:b).z)}\\end{bmatrix}`}/>
              </article>
            ))}
            <article>
              <h3>Parameter λ</h3>
              <label className="lambda">
                <input
                  aria-label="Line lambda" disabled={!validLine}
                  type="range"
                  min="-4"
                  max="4"
                  step=".1"
                  value={lambda}
                  onInput={(e) => {setAuto(false);setLambda(+e.currentTarget.value);}}
                  onChange={(e) => act(() => setLambda(+e.target.value))}
                />
                <input aria-label="Lambda value" type="number" min="-4" max="4" step=".1" value={lambda} disabled={!validLine} onChange={e=>{const v=e.target.valueAsNumber;if(Number.isFinite(v)){setAuto(false);setLambda(Math.max(-4,Math.min(4,v)));}}}/>
              </label>
              <p>P(λ)=a+λb</p>
              <strong>
                P({lambda}) = ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
              </strong>
            </article>
            <div className="layer-list">
              {Object.entries(layers).map(([key, on]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      act(() => setLayers((v) => ({ ...v, [key]: !on })))
                    }
                  />
                  {({anchor:"Show anchor vector a",direction:"Show direction vector b",line:"Show line (all λ)",point:"Show point P(λ)",axes:"Show axes & grid"} as const)[key as keyof typeof layers]}
                </label>
              ))}
            </div>
          </aside>
          <article className="ve-scene">
            <VectorEquationLineScene p={validInputs?a:null} d={validLine?b:null} t={lambda} camera={camera} layers={layers} onCamera={setCamera} onT={t=>{setAuto(false);setLambda(Number(t.toFixed(2)));}}/>
            <div className="scene-legend">
              <span className="ve-blue-key">
                ━ a = ({a.x},{a.y},{a.z})
              </span>
              <span className="ve-green-key">
                ━ b = ({b.x},{b.y},{b.z})
              </span>
              <span className="ve-purple-key">┄ Line: r = a + λb, λ ∈ ℝ</span>
            </div>
          </article>
          <aside className="ve-results" data-current-valid={validInputs}>
            <article>
              <h3>Current values</h3>
              <p>
                a = ({a.x},{a.y},{a.z})
              </p>
              <p>|a| = {fmt(ma)}</p>
              <p>
                b = ({b.x},{b.y},{b.z})
              </p>
              <p>|b| = {fmt(mb)}</p>
              <p>a · b = {fmt(dot)}</p>
              <p>Angle(a,b) ≈ {ma&&mb?`${fmt(theta)}°`:"undefined (zero vector)"}</p>
              <p>λ = {lambda}</p>
              <p>
                P({lambda}) = ({fmt(p.x)},{fmt(p.y)},{fmt(p.z)})
              </p>
            </article>
            <article className="violet">
              <h3>Vector equation</h3>
              <p>r = a + λb</p>
              <p>
                = ({a.x},{a.y},{a.z}) + λ({b.x},{b.y},{b.z})
              </p>
            </article>
            <article className="blue">
              <h3>Coordinate (symmetric) form</h3>
              <M value={clSymmetric(a,b)}/>
            </article>
            <article className="green">
              <h3>Parametric form</h3>
              {(["x","y","z"] as const).map(k=><M key={k} value={clParam(k,a[k],b[k]).replace(/t$/,"λ")}/>)}
            </article>
          </aside>
        </section>
        <section className="ve-second">
          <article>
            <h3>Vector addition (parallelogram rule)</h3>
            <p>P = a + λb is the diagonal formed by a and λb. Diagram is schematic; lengths and angles are not to scale.</p>
            <div className="ve-addition"><svg className="ve-mini-svg" viewBox="0 0 300 260" aria-label="Current vector addition parallelogram"><defs><marker id="ve-mini-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10" fill="none" stroke="context-stroke"/></marker></defs>{[[mo,maPoint,"a"],[mo,mbPoint,"b"],[maPoint,mp,"dash"],[mbPoint,mp,"dash"],[mo,mp,"sum"]].map(([start,end,cls],i)=>{const q=start as typeof mo,r=end as typeof mo;return <line key={i} className={cls as string} x1={q.x} y1={q.y} x2={r.x} y2={r.y} markerEnd={i===2||i===3?undefined:"url(#ve-mini-arrow)"}/>;})}<text x={mo.x-15} y={mo.y+15}>O</text><text x={maPoint.x+5} y={maPoint.y-8} fill="#009dff">a</text><text x={mbPoint.x+5} y={mbPoint.y+15} fill="#159e46">λb</text><text x={mp.x+5} y={mp.y-10} fill="#7833cf">P(λ)</text></svg><div><p>At λ = {lambda}</p><M value={`a=${clVector(a)}`}/><M value={`λb=${clVector(lpScale(b,lambda))}`}/><M value={`P(${lambda})=a+λb`}/><M value={`=${clVector(p)}`}/></div></div>
          </article>
          <article>
            <h3>Positive and negative λ</h3>
            <p>The line extends infinitely in both directions.</p>
            <div className="numberline">
              {[-3,-2,-1,0,1,2,3].map(n=><span className="ve-tick" key={n} style={{left:`${(n+3)/6*100}%`}}>{n}</span>)}
              <button style={{left:"16.667%"}} data-label="λ = −2" aria-label="Set lambda to -2" onClick={() => act(() => {setAuto(false);setLambda(-2);})}>λ=-2</button>
              <button style={{left:"50%"}} data-label="λ = 0" aria-label="Set lambda to 0" onClick={() => act(() => {setAuto(false);setLambda(0);})}>λ=0</button>
              <button style={{left:"83.333%"}} data-label="λ = 2" aria-label="Set lambda to 2" onClick={() => act(() => {setAuto(false);setLambda(2);})}>λ=2</button>
            </div>
            <div className="lambda-cards">
              <p>
                λ=-2
                <br />
                <M value={`P(-2)=a-2b=${clVector(lpAdd(a,lpScale(b,-2)))}`}/>
              </p>
              <p>
                λ=2
                <br />
                <M value={`P(2)=a+2b=${clVector(lpAdd(a,lpScale(b,2)))}`}/>
              </p>
            </div>
          </article>
        </section>
        <section className="ve-third">
          <article>
            <h3>Position vector vs direction vector</h3>
            <div>
              <p>
                <b>Position vector</b>
                <br />
                Gives location of a point and starts at the origin. Example: a = (1, −1, 2) locates A.
              </p>
              <p>
                <b>Direction vector</b>
                <br />
                Gives direction, not position. Its tail can be anywhere. Nonzero parallel multiples through the same anchor define the
                same line.
              </p>
            </div>
            <div className="ve-vector-examples"><svg className="ve-mini-svg" viewBox="0 0 240 110" aria-label="Position vector from origin to A"><line x1="30" y1="95" x2="165" y2="20" stroke="#009dff" strokeWidth="3"/><circle cx="30" cy="95" r="3"/><circle cx="165" cy="20" r="3"/><text x="15" y="107">O</text><text x="170" y="20">A(1,−1,2)</text></svg><svg className="ve-mini-svg" viewBox="0 0 240 110" aria-label="Parallel direction vectors can start anywhere"><path d="M35 95L170 20M55 105L190 30" stroke="#159e46" strokeWidth="3"/><text x="175" y="18">b</text></svg></div>
          </article>
          <article>
            <h3>Point-on-line test</h3>
            <p>For the fixed given line, Q lies on the line iff Q − a = λb for some real λ.</p><M value="Q=(5,1,8)"/><M value="Q-a=(4,2,6)=2(2,1,3)"/><p>All three coordinates give λ = 2.</p>
            <strong>
              <Check /> Yes, Q lies on the line at λ=2.
            </strong>
          </article>
        </section>
        <section className="ve-worked">
          <h3>Worked example</h3>
          <div>
            <article>
              <p>Find the vector and parametric equations of the line through A(1,−1,2) with direction b = (2,1,3).</p><b>Solution</b><M value="a=(1,-1,2), b=(2,1,3)"/><b>Vector equation:</b>
              <M value="r=(1,-1,2)+λ(2,1,3), λ∈ℝ"/>
            </article>
            <article>
              <b>Parametric equations</b>
              <p>
                x=1+2λ
                <br />
                y=-1+λ
                <br />
                z=2+3λ
              </p><b>Coordinate (symmetric) form:</b><M value={clSymmetric(A0,B0)}/>
            </article>
            <article>
              <b>Find points on the line</b>
              <p>P(0) = (1,−1,2)</p><p>P(1) = (3,0,5)</p><p>P(−1) = (−1,−2,−1)</p><p className="ve-purple">P(2) = (5,1,8)</p>
            </article>
          </div>
        </section>
        <section className="ve-practice">
          <h3>Practice</h3><p>Solve and check your answers using a = (1, −1, 2), b = (2, 1, 3) for questions 1–3.</p>
          <div>
            <article>
              <b>1 Find P(3) on r = a + λb with a = (1,−1,2), b = (2,1,3).</b>
              <div>
                {answers.p.map((v, i) => (
                  <input
                    key={i}
                    aria-label={`Practice P coordinate ${i + 1}`}
                    value={v}
                    onChange={(e) => {setFeedback(f=>({...f,p:undefined}));
                      setAnswers((s) => ({
                        ...s,
                        p: s.p.map((x, j) => (j === i ? e.target.value : x)),
                      }));}
                    }
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  act(() =>
                    setFeedback((f) => ({
                      ...f,
                      p: answers.p.every((v,i)=>v.trim()!==""&&Number(v)===[7,2,11][i]),
                    })),
                  )
                }
              >
                Check
              </button>
              {feedback.p !== undefined && (
                <strong role="status" data-correct={feedback.p}>{feedback.p ? "Correct: P(3) = (7, 2, 11)" : "Try again: substitute λ = 3 in every coordinate"}</strong>
              )}
            </article>
            <article>
              <b>2 Find λ if P=(−3,−3,−4)</b>
              <input
                aria-label="Practice lambda"
                value={answers.lambda}
                onChange={(e) =>
                  {setFeedback(f=>({...f,lambda:undefined}));setAnswers((s) => ({ ...s, lambda: e.target.value }));}
                }
              />
              <button
                onClick={() =>
                  act(() =>
                    setFeedback((f) => ({
                      ...f,
                      lambda: answers.lambda.trim()!==""&&Number(answers.lambda) === -2,
                    })),
                  )
                }
              >
                Check
              </button>
              {feedback.lambda !== undefined && (
                <strong role="status" data-correct={feedback.lambda}>{feedback.lambda ? "Correct: λ = −2" : "Try again: use −3 = 1 + 2λ"}</strong>
              )}
            </article>
            <article>
              <b>3 Does Q=(9,3,14) lie on the line?</b>
              <div className="ve-radio">{["Yes","No"].map(value=><label key={value}><input type="radio" name="ve10155-on-line" aria-label={`Point on line: ${value}`} checked={answers.onLine===value} onChange={()=>{setFeedback(f=>({...f,onLine:undefined}));setAnswers(s=>({...s,onLine:value}));}}/>{value}</label>)}</div>
              <button
                onClick={() =>
                  act(() =>
                    setFeedback((f) => ({
                      ...f,
                      onLine: answers.onLine === "Yes",
                    })),
                  )
                }
              >
                Check
              </button>
              {feedback.onLine !== undefined && (
                <strong role="status" data-correct={feedback.onLine}>{feedback.onLine ? "Correct: Q − a = 4b" : "Try again: compare (8, 4, 12) with b"}</strong>
              )}
            </article>
            <article><b>4 Write the symmetric form through a = (2,0,−1), b = (−1,2,2)</b><div className="ve-symmetric-input">{symmetric.map((v,i)=><label key={i}><span>{["x −","y −","z +"][i]}<input aria-label={`Symmetric numerator ${i+1}`} value={v} onChange={e=>{setSymmetric(s=>s.map((x,j)=>i===j?e.target.value:x));setFeedback(f=>({...f,symmetric:undefined}));}}/></span><span className="ve-denominator">{[-1,2,2][i]}</span></label>)}</div><button onClick={()=>setFeedback(f=>({...f,symmetric:symmetric.every((v,i)=>v.trim()!==""&&Number(v)===[2,0,1][i])}))}>Check</button>{feedback.symmetric!==undefined&&<strong role="status" data-correct={feedback.symmetric}>{feedback.symmetric?"Correct: (x−2)/(−1) = y/2 = (z+1)/2":"Try again: subtract each anchor coordinate"}</strong>}</article>
          </div>
          <details className="ve-hints"><summary>Show hints</summary><p>1. Substitute λ = 3. 2. Solve −3 = 1 + 2λ and check every coordinate. 3. Compare Q − a with 4b. 4. Use (x − a₁)/b₁ = (y − a₂)/b₂ = (z − a₃)/b₃.</p></details>
        </section>
        <div className="ve-lesson-links" role="navigation" aria-label="Adjacent vector line lessons">
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-line-through-two-points-in-3d">
            ← Line Through Two Points in 3D
          </a>
          <a href="/lessons/school/class-12/class-12-three-dimensional-geometry-cartesian-equation-of-a-line">
            Cartesian Equation of a Line →
          </a>
        </div>
        <div className="ve-quick" role="navigation" aria-label="Vector line quick links">
          <b>Quick links:</b>
          <a href="/formulas">Formula Sheet</a>
          <a href="/math-lab/3d-graphing">3D Vector Basics</a>
          <a href="/lessons/geometry/190-dot-product">Dot Product</a>
          <a href="/lessons/geometry/191-cross-product">Cross Product</a>
          <a href="/lessons/school/class-10/class-10-coordinate-geometry-distance-formula">Distance Formula</a>
        </div>
      </main>


    </section>
  );
}
