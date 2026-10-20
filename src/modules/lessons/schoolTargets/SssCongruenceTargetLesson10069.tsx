import {
  ArrowLeft,
  ArrowRight,
  Check,
  Link2,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SssCongruenceTargetLesson10069.css";
import{ssStart10069,ssChallenge10069,ssModel10069,ssSame10069,ssRigid10069,ssFit10069,ssArcs10069,ssGrade10069,type SSides10069 as Sides}from'./sssCongruenceModel10069';

const START=ssStart10069;
const modes=['None','Translate','Rotate','Flip','Perfect Overlay'];
export default function SssCongruenceTargetLesson10069({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sides, setSides] = useState<Sides>(START),
    [showCorrespondence, setShowCorrespondence] = useState(true),
    [showMeasures, setShowMeasures] = useState(true),
    [arcs, setArcs] = useState(true),
    [mode, setMode] = useState(4),
    [tab, setTab] = useState(0),
    [challengePairs, setChallengePairs] = useState(["DE", "EF", "FD"]),
    [challengeOverlay, setChallengeOverlay] = useState(false),
    [actions, setActions] = useState(0);
  const [second,setSecond]=useState<Sides>(START),[linked,setLinked]=useState(true),[points,setPoints]=useState(true),[tested,setTested]=useState(false);
  const construction=ssModel10069(sides),secondModel=ssModel10069(second),congruent=ssSame10069(sides,second),challengeCorrect=ssGrade10069(challengePairs)&&tested;
  const update=(key:keyof Sides,n:number)=>{setSides(old=>({...old,[key]:n}));if(linked)setSecond(old=>({...old,[key]:n}));setActions(n=>n+1);};
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setSides(START);setSecond(START);setLinked(true);setPoints(true);
      setShowCorrespondence(true);
      setShowMeasures(true);
      setArcs(true);
      setMode(4);
    });
  return (
    <section
      className="sss10069-page"
      data-testid="school-mockup-0743"
      data-object-model="dedicated-linked-sss-circle-intersection-rigid-overlay-engine"
      data-sides={`${sides.red},${sides.blue},${sides.green}`}
      data-valid={String(construction.valid&&secondModel.valid)} data-kind={construction.kind} data-second={`${second.red},${second.blue},${second.green}`} data-linked={String(linked)} data-congruent={String(congruent)} data-points={String(points)}
      data-mode={modes[mode]}
      data-arcs={String(arcs)}
      data-measures={String(showMeasures)}
      data-correspondence={String(showCorrespondence)}
      data-challenge-pairs={challengePairs.join(",")}
      data-challenge={String(challengeCorrect)}
      data-actions={actions}
    >
      <div role="banner" className="sss10069-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>SSS Congruence</h1>
        <p>
          <b>Objective:</b> Prove triangles congruent when all three
          corresponding sides are equal.
        </p>
        <div>
          <span>Class 9</span>
          <span>Geometry</span>
          <span>Triangle Proofs</span>
          <span>Theorem</span>
          <span>SSS</span>
        </div>

      <aside>
          <h2 id="sss10069-formula">Theorem (SSS)</h2>
          <p>
            If three sides of one triangle are equal to three sides of another
            triangle, then the triangles are congruent.
          </p>
          <p>In symbols: SSS ⇒ △ABC ≅ △DEF</p>
        </aside></div>
      <div role="group" aria-label="Lesson sections" className="sss10069-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab === i}
            onClick={() => act(() => {setTab(i);document.getElementById(['sss10069-interact','sss10069-learn','sss10069-example','sss10069-formula','sss10069-practice'][i])?.scrollIntoView({behavior:'smooth',block:'start'});})}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section id="sss10069-interact" className="sss10069-lab">
          <header>
            <div>
              <h2>Explore & Construct</h2>
              <p>
                Construct △ABC and △DEF. Adjust side lengths together using the
                linked controls.
                <br />
                Check whether the triangles are congruent.
              </p>
            </div>
            <nav>
              <label>
                Show correspondences{" "}
                <input
                  type="checkbox"
                  checked={showCorrespondence}
                  onChange={(e) =>
                    act(() => setShowCorrespondence(e.target.checked))
                  }
                />
                <i />
              </label>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </nav>
          </header>
          <div className="sss10069-workspace">
            <aside className="sss10069-controls">
              <h3>
                Linked Side Controls <small>(corresponding sides)</small>
              </h3>
              <SideControl
                color="red"
                label="AB ↔ DE"
                value={sides.red}
                onChange={red=>update('red',red)}
              />
              <SideControl
                color="blue"
                label="BC ↔ EF"
                value={sides.blue}
                onChange={blue=>update('blue',blue)}
              />
              <SideControl
                color="green"
                label="CA ↔ FD"
                value={sides.green}
                onChange={green=>update('green',green)}
              />
              <button className="lock" aria-pressed={linked} onClick={()=>act(()=>{if(!linked)setSecond({...sides});setLinked(v=>!v);})}>
                <Link2 /> {linked?"Linking locked":"Link triangles"}
              </button>
              {!linked&&<section className="sss10069-second-controls"><h3>Triangle DEF (unlinked)</h3>{(['red','blue','green'] as const).map((key,i)=><SideControl key={key} color={key} label={['DE','EF','FD'][i]} value={second[key]} onChange={n=>act(()=>setSecond(old=>({...old,[key]:n})))}/>)}</section>}
              <section>
                <h3>Tools</h3>
                <button aria-label="Point tool" aria-pressed={points&&!arcs} onClick={() => act(() => {setArcs(false);setPoints(true);})}>
                  ● Point
                </button>
                <button
                  className={arcs ? "active" : ""}
                  aria-label="Add construction arcs" aria-pressed={arcs} onClick={() => act(() => {setArcs(true);setPoints(true);})}
                >
                  ◌ Add Arc
                </button>
                <button aria-label="Clear construction marks" onClick={() => act(() => {setArcs(false);setPoints(false);})}>
                  ▱ Clear All
                </button>
                <label>
                  <input
                    type="checkbox"
                    checked={showMeasures}
                    onChange={(e) =>
                      act(() => setShowMeasures(e.target.checked))
                    }
                  />{" "}
                  Show Measurements
                </label>
              </section>
            </aside>
            <SssTriangle
              title="△ABC"
              letters="ABC"
              sides={sides}
              arcs={arcs}
              measures={showMeasures} points={points}
            />
            <SssTriangle
              title="△DEF"
              letters="DEF"
              sides={second}
              arcs={arcs}
              measures={showMeasures} points={points}
            />
            <section className="sss10069-overlay-panel">
              <header>
                <b>Overlay (Rigid Motion)</b>
                <nav>
                  {modes.map((x, i) => (
                    <button
                      key={x}
                      aria-label={`Motion: ${x}`} aria-pressed={mode===i} className={mode === i ? "active" : ""}
                      onClick={() => act(() => setMode(i))}
                    >
                      {x}
                    </button>
                  ))}
                </nav>
              </header>
              <div
                className={
                  congruent ? "sss10069-result" : "sss10069-result invalid"
                }
              >
                {congruent?<Check/>:<TriangleAlert/>}
                <p>
                  <b>Congruence Result</b>
                  <strong>{!construction.valid||!secondModel.valid?"No proper triangle to compare":`△ABC ${congruent?"≅":"≇"} △DEF${congruent?" by SSS":" in this correspondence"}`}</strong>
                  <span>
                    {congruent
                      ? "All three pairs of corresponding sides are equal."
                      : !construction.valid||!secondModel.valid?"A strict triangle inequality fails; adjust the lengths.":"The chosen corresponding side lengths differ."}
                  </span>
                </p>
                {showCorrespondence && (
                  <aside>
                    <b>Selected Correspondences</b>
                    <span>
                      <i className="red" /> A ↔ D
                    </span>
                    <span>
                      <i className="blue" /> B ↔ E
                    </span>
                    <span>
                      <i className="green" /> C ↔ F
                    </span>
                  </aside>
                )}
                <OverlayMini sides={sides} second={second} mode={mode} />
              </div>
            </section>
          </div>
        </section>
        <section id="sss10069-learn" className="sss10069-theory">
          <article>
            <h2>Why SSS Works</h2>
            <p>
              If all three corresponding sides are equal, one triangle can be
              moved, rotated, or reflected to fit exactly on the other. The
              third side leaves no room for a different shape.
            </p>
            <ol>
              <li>Fix side AB onto DE.</li>
              <li>
                Point C lies at the intersection of circles centered at A and B, with radii CA and CB.
              </li>
              <li>The two possible intersections are reflections across the base, so reflection may be needed before the triangles coincide.</li>
            </ol>
            <div>
              <SssMini />
              <b>Rigid motion →</b>
              <SssMini letters="DEF"/>
            </div>
            <strong>
              Conclusion: Three equal corresponding sides determine congruence.
            </strong>
          </article>
          <article>
            <h2 id="sss10069-example">Worked Example</h2>
            <p>
              <b>Given:</b> In △ABC and △DEF,
            </p>
            <p className="pairs">
              <span>AB = DE = 5</span>
              <span>BC = EF = 6</span>
              <span>CA = FD = 7</span>
            </p>
            <p>
              <b>Prove:</b> △ABC ≅ △DEF
            </p>
            <ol>
              <li>AB = DE = 5</li>
              <li>BC = EF = 6</li>
              <li>CA = FD = 7</li>
            </ol>
            <p>Thus, all three pairs of corresponding sides are equal.</p>
            <strong>△ABC ≅ △DEF</strong>
          </article>
        </section>
        <section className="sss10069-warning">
          <TriangleAlert />
          <div>
            <h2>Common Misconception</h2>
            <b>Equal perimeters do NOT guarantee congruence.</b>
            <p>
              Two triangles can have the same perimeter but different shapes.
            </p>
          </div>
          <SssMini sides={{ red: 5, blue: 4, green: 3 }} />
          <SssMini sides={{ red: 5, blue: 5, green: 2 }} />
          <aside>
            Perimeter = 3+4+5 = 12
            <br />
            Perimeter = 2+5+5 = 12
            <br />
            <b>
              Same perimeter,
              <br />
              but not congruent.
            </b>
          </aside>
        </section>
        <section id="sss10069-practice" className="sss10069-challenge">
          <header>
            <h2>Challenge: Match, Measure & Decide</h2>
            <p>
              Match the three corresponding sides between the triangles. Then
              use Perfect Overlay to test congruence.
            </p>
          </header>
          <SssTriangle
            title="Triangle 1"
            letters="ABC"
            sides={ssChallenge10069}
            arcs={false}
            measures
          />
          <section>
            <h3>1. Match the sides</h3>
            {[
              ["CA (6)", "DE"],
              ["CB (7)", "EF"],
              ["AB (5)", "FD"],
            ].map(([label, correct], i) => (
              <label key={label}>
                <i className={["green", "blue", "red"][i]} />
                {label} ↔{" "}
                <select
                  aria-label={`Match ${label}`} value={challengePairs[i]}
                  onChange={(e) =>
                    act(() => {
                      const next = [...challengePairs];
                      next[i] = e.target.value;
                      setChallengePairs(next);setTested(false);
                    })
                  }
                >
                  {["DE", "EF", "FD"].map((x) => (
                    <option key={x} value={x}>{x} ({({DE:6,EF:7,FD:5} as Record<string,number>)[x]})</option>
                  ))}
                </select>
                {challengePairs[i] === correct ? <Check /> : <TriangleAlert />}
              </label>
            ))}
          </section>
          <section>
            <h3>2. Test with overlay</h3>
            <button aria-label="Challenge Overlay" onClick={() => act(() => {setChallengeOverlay(false);setTested(true);})}>
              Overlay
            </button>
            <button
              className="perfect"
              aria-label="Challenge Perfect Overlay" onClick={() => act(() => {setChallengeOverlay(true);setTested(true);})}
            >
              Perfect Overlay
            </button>
            <OverlayMini sides={ssChallenge10069} mode={challengeOverlay?4:0}/><p role="status" className={challengeCorrect?'pass':tested?'fail':''}><b>{!tested?'Test the correspondence.':challengeCorrect?'Congruent: △ABC ≅ △DFE by SSS.':'Correspondence mismatch.'}</b><br/>{tested&&(challengeCorrect?'CA ↔ DE, CB ↔ EF, AB ↔ FD.':'These triangles are congruent, but the selected side matching is wrong.')}</p>
          </section>
          <aside>
            <h3>Goal</h3>
            <p>
              <Check /> Match all three sides
            </p>
            <p>
              <Check /> Use overlay
            </p>
            <p>
              <Check /> Rule out equal perimeter only
            </p>
          </aside>
        </section>
      </main>
      <nav className="sss10069-nav">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-aas-congruence">
          <ArrowLeft />
          <span>
            <b>AAS Congruence</b>
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-rhs-congruence">
          <span>
            <b>RHS Congruence</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
      <footer className="sss10069-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
function SideControl({
  color,
  label,
  value,
  onChange,
}: {
  color: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="sss10069-side">
      <span>
        <i className={color} />
        <b>{label}</b>
        <output>{value}</output>
        <small>units</small>
      </span>
      <input
        aria-label={label}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small className="sss10069-range-ends">
        <span>1</span>
        <span>10</span>
      </small>
    </label>
  );
}
function SssTriangle({title,letters,sides,arcs,measures,points=true}:{title:string;letters:string;sides:Sides;arcs:boolean;measures:boolean;points?:boolean}){return <article className="sss10069-triangle"><i>{title}</i><TriangleDrawing sides={sides} letters={letters} arcs={arcs} measures={measures} points={points}/></article>;}
function TriangleDrawing({sides,letters='ABC',arcs=false,measures=true,points=true,mini=false}:{sides:Sides;letters?:string;arcs?:boolean;measures?:boolean;points?:boolean;mini?:boolean}){const m=ssModel10069(sides),circles=arcs?ssArcs10069(sides):[];if(!m.points)return <svg className={mini?'sss10069-mini':''} viewBox="0 0 280 270" aria-label={`SSS triangle ${letters}`}><text className="invalid-caption" x="140" y="110">{m.kind==='flat'?'Flat lengths':'Triangle cannot close'}</text><text className="invalid-caption" x="140" y="140">{sides.red}, {sides.blue}, {sides.green}</text><text className="invalid-caption" x="140" y="170">Strict triangle inequalities required.</text></svg>;const fit=ssFit10069([...m.points,...circles.flatMap(a=>[a.start,a.end])]),p=m.points.map(fit.map),path=`M${p[0].x} ${p[0].y}L${p[1].x} ${p[1].y}L${p[2].x} ${p[2].y}Z`;return <svg className={mini?'sss10069-mini':''} viewBox="0 0 280 270" aria-label={`SSS triangle ${letters}`} data-coordinates={p.map(q=>`${q.x},${q.y}`).join(';')} data-scale={fit.k}>{circles.map((a,i)=>{const from=fit.map(a.start),to=fit.map(a.end);return <path key={i} className={`construction-arc ${i?'blue':'green'}`} d={`M${from.x} ${from.y}A${a.r*fit.k} ${a.r*fit.k} 0 0 0 ${to.x} ${to.y}`}/>;})}<path className="triangle-fill" d={path}/>{p.map((a,i)=>{const b=p[(i+1)%3],color=['red','blue','green'][i],dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;return <g key={i}><line className={`edge ${color}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>{points&&<circle cx={a.x} cy={a.y} r="4"/>}<text className="letter" x={a.x+(i===0?-10:i===1?10:0)} y={a.y+(i===2?-12:14)}>{letters[i]}</text>{measures&&<text className={`measure ${color}`} x={mx-dy/n*14} y={my+dx/n*14+4}>{[sides.red,sides.blue,sides.green][i]}</text>}</g>;})}</svg>;}
function OverlayMini({sides,second=sides,mode}:{sides:Sides;second?:Sides;mode:number}){const a=ssModel10069(sides),b=ssModel10069(second);if(!a.points||!b.points)return <div className="sss10069-overlay-empty">No rigid triangle overlay for invalid lengths.</div>;const q=b.points.map(p=>ssRigid10069(p,mode,{x:second.red/2,y:0})),fit=ssFit10069([...a.points,...q],240,190),first=a.points.map(fit.map),last=q.map(fit.map),path=(p:typeof first)=>`M${p.map(v=>`${v.x} ${v.y}`).join('L')}Z`;return <svg className="sss10069-overlay-mini" viewBox="0 0 240 190" aria-label={`Rigid motion: ${modes[mode]}`} data-first={first.map(p=>`${p.x},${p.y}`).join(';')} data-second={last.map(p=>`${p.x},${p.y}`).join(';')} data-scale={fit.k}><path className="first" d={path(first)}/><path className="second" d={path(last)}/><text x="120" y="184">{mode===4?(ssSame10069(sides,second)?'Triangles coincide perfectly':'Compare corresponding vertices'):modes[mode]}</text></svg>;}
function SssMini({sides=START,letters="ABC"}:{sides?:Sides;letters?:string}){return <TriangleDrawing sides={sides} letters={letters} mini/>;}
