import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Link as LinkIcon,
  RotateCcw,
  ShieldCheck,
  Star,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AxiomTheoremTargetLesson10056.css";
import{paSector10074}from"./parallelogramAnglesModel10074";
import{atStatements10056 as statements,atInitial10056 as initial,atClassify10056,atChallenge10056,atTest10056,type ATLane10056 as Lane}from'./axiomTheoremModel10056';
type Statement=typeof statements[number];
export default function AxiomTheoremTargetLesson10056({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [placed, setPlaced] = useState<Record<string, Lane>>(initial),
    [tab, setTab] = useState("Interact"),
    [whole, setWhole] = useState("2"),
    [part, setPart] = useState("5"),
    [tested, setTested] = useState(true),
    [domain,setDomain]=useState<"numbers"|"lengths">("numbers"),[selected,setSelected]=useState("A1"),
    [challenge, setChallenge] = useState(false),
    [challengeChain, setChallengeChain] = useState<string[]>([]),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const assumptions = statements.filter((s) => placed[s.id] === "assumed"),
    proved = statements.filter((s) => placed[s.id] === "proved");
  const valid=atClassify10056(placed),testResult=atTest10056(whole,part,domain),counterexample=testResult==='found';
  const place=(id:string,lane:Lane)=>{if(!statements.some(s=>s.id===id))return;act(()=>setPlaced(p=>({...p,[id]:lane})));};
  const reset = () =>
    act(() => {
      setPlaced({});
      setChallengeChain([]);
      setChallenge(false);
    });
  const addChallenge = (id: string) =>
    act(() =>
      setChallengeChain((current) =>
        current.includes(id)||!statements.some(s=>s.id===id) ? current : [...current, id],
      ),
    );
  const challengeResult=atChallenge10056(challengeChain),challengeValid=challengeResult.minimal;
  return (
    <section
      className="at10056-page"
      data-testid="school-mockup-0730"
      data-object-model="dedicated-proof-dependency-counterexample-and-minimal-chain-engine"
      data-assumed={assumptions.map((s) => s.id).join(",")}
      data-proved={proved.map((s) => s.id).join(",")}
      data-valid={String(valid)}
      data-counterexample={tested ? String(counterexample) : "idle"}
      data-challenge={challengeChain.join(",")}
      data-challenge-valid={String(challenge && challengeValid)}
      data-test-status={tested?testResult:"idle"} data-domain={domain} data-placed={JSON.stringify(placed)}
      data-actions={actions}
    >
      <div role="banner" className="at10056-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Axiom versus Theorem</h1>
        <p>Distinguish assumed statements from results established by proof.</p>
        <div>
          <span>◴ 30 min</span>
          <span>▥ Class 9</span>
          <span>♙ Euclidean Geometry</span>
          <span>✥ Concept: Logic &amp; Proof</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </div>
      <div role="group" aria-label="Lesson sections" className="at10056-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-pressed={tab === item}
            onClick={() => act(() => {setTab(item);document.getElementById(({Interact:"at10056-interact",Learn:"at10056-learn",Example:"at10056-example",Formula:"at10056-formula",Practice:"at10056-practice"} as Record<string,string>)[item])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {item}
          </button>
        ))}
      </div>
      <main>
        <section id="at10056-interact" className="at10056-builder">
          <header>
            <h2>PROOF-FOUNDATION BUILDER</h2>
            <p>
              Drag each statement to place it as Assumed (axiom/definition) or
              Proved (theorem). Tap a card, then choose its lane; or drag it. Identify the two supports for T2.
            </p>
          </header>
          <div className="at10056-board">
            <article className="at10056-cards">
              <h3>
                STATEMENT CARDS <CircleHelp /> <small>Drag to place</small>
              </h3>
              {statements.map((s) => (
                <button
                  aria-label={`Select statement ${s.id}`} aria-pressed={selected===s.id}
                  key={s.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("statement", s.id)}
                  onClick={() => setSelected(s.id)}
                  className={s.lane}
                >
                  <i>⠿</i>
                  <span>
                    <b>{s.id}</b> {s.text}
                    <small>{s.type}</small>
                  </span>
                </button>
              ))}
            </article>
            <Lane
              title="ASSUMED (Axioms / Definitions)"
              lane="assumed"
              statements={assumptions}
              place={place} selected={selected}
            />
            <Lane
              title="PROVED (Theorems)"
              lane="proved"
              statements={proved}
              place={place} selected={selected}
            />
          </div>
          <footer
            role="status" className={valid ? "at10056-valid" : "at10056-invalid"}
          >
            {valid ? (
              <>
                <Check />
                <span>
                  <b>Great! All statements correctly classified.</b>T2 uses two supports: D1 and T1.
                </span>
              </>
            ) : (
              "Classify all five statements. Each card must be in its correct lane."
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
            >
              <RotateCcw /> Reset builder
            </button>
          </footer>
        </section>
        <section id="at10056-formula" className="at10056-middle">
          <article className="at10056-evidence">
            <h2>EVIDENCE VIEWER (for T2)</h2>
            <p>Let lines ℓ and m intersect at O.</p>
            <CrossingAngles />
            <p>
              ∠1 and ∠2 form a linear pair.
              <br />∴ ∠1 + ∠2 = 180° &nbsp; (by T1)
            </p>
            <p>
              ∠2 and ∠3 form a linear pair.
              <br />∴ ∠2 + ∠3 = 180° &nbsp; (by T1)
            </p>
            <p>∴ ∠1 = ∠3 &nbsp; (subtract ∠2 from both)</p>
            <strong>Hence, vertically opposite angles are equal.</strong>
          </article>
          <article className="at10056-counter">
            <h2>COUNTEREXAMPLE TESTER</h2>
            <label>
              Test statement
              <select aria-label="Counterexample domain" value={domain} onChange={e=>{setDomain(e.target.value as 'numbers'|'lengths');setTested(false);}}><option value="numbers">Whole &gt; part: arbitrary numbers</option><option value="lengths">Whole &gt; proper part: lengths</option></select>
            </label>
            <p>Try a counterexample</p>
            <div>
              <label>
                Whole ={" "}
                <input
                  aria-label="Whole value"
                  type="text" role="spinbutton" inputMode="decimal" maxLength={64}
                  aria-valuetext={whole} aria-valuenow={whole.trim()&&Number.isFinite(Number(whole))?Number(whole):undefined} onKeyDown={e=>numberKey(whole,e,v=>{setWhole(v);setTested(false);})} value={whole}
                  onChange={(e) =>
                    act(() => {
                      setTested(false);
                      setWhole(e.target.value);
                    })
                  }
                />
              </label>
              <label>
                Part ={" "}
                <input
                  aria-label="Part value"
                  type="text" role="spinbutton" inputMode="decimal" maxLength={64}
                  aria-valuetext={part} aria-valuenow={part.trim()&&Number.isFinite(Number(part))?Number(part):undefined} onKeyDown={e=>numberKey(part,e,v=>{setPart(v);setTested(false);})} value={part}
                  onChange={(e) =>
                    act(() => {
                      setTested(false);
                      setPart(e.target.value);
                    })
                  }
                />
              </label>
              <button onClick={() => act(() => setTested(true))}>Check</button>
            </div>
            {tested&&<section role="status" className={testResult==='holds'?'at10056-holds':testResult==='found'?'at10056-found':'at10056-outside'}>{testResult==='holds'?<Check/>:<X/>}<b>{testResult==='found'?'Counterexample to the numeric claim.':testResult==='holds'?'No counterexample here.':testResult==='outside'?'Not a proper-part example.':'Enter two valid finite decimal values.'}</b><p>{testResult==='found'?`${whole} is not greater than ${part}.`:testResult==='holds'?`${whole} is greater than ${part}.`:testResult==='outside'?'A positive proper part must be smaller than its positive whole.':'Blank or malformed values cannot be tested.'}</p><p>{domain==='numbers'?'Arbitrary numbers need not represent a whole and its proper part. This does not refute the geometric axiom.':testResult==='holds'?'This example satisfies the proper-part conditions; one example is not a universal proof.':'Values outside the proper-part conditions cannot refute the axiom.'}</p></section>}
          </article>
          <article className="at10056-chain">
            <h2>CHAIN OVERVIEW</h2>
            <p>Current dependency chain</p>
            {["D1", "T1", "T2"].map((id, index) => {
              const s = statements.find((item) => item.id === id)!;
              return (
                <div key={id} data-dependency={id} data-ready={placed[id]===s.lane}>
                  <b>{id}</b>
                  {s.text}
                  {index===1&&<i>D1 + T1 ↓ T2</i>}
                </div>
              );
            })}
            <strong>{["D1","T1","T2"].every(id=>placed[id]===initial[id])?"D1 + T1 ⇒ T2 · 2 support links":"Classify D1, T1 and T2 correctly to activate the proof."}</strong>
          </article>
        </section>
        <section id="at10056-learn" className="at10056-why">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Axioms are assumptions; definitions specify meanings. Theorems are built only from these foundations
              using valid logical steps. Dependency chains make this structure
              visible and verifiable. In this model, T1 follows from angle additivity and a straight angle of 180°; some curricula instead take the linear-pair statement as an axiom. D1 and T1 independently support T2.
            </p>
            <div>
              <span>
                <ShieldCheck />
                <b>Clarity</b>Separates what we assume from what we prove.
              </span>
              <span>
                <LinkIcon />
                <b>Logic</b>Ensures every theorem rests on a solid foundation.
              </span>
              <span>
                <Check />
                <b>Trust</b>Proofs are reliable and reproducible.
              </span>
            </div>
          </article>
          <aside>
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <b>A familiar true statement is not automatically an axiom.</b>
            <p>
              Example: “Vertically opposite angles are equal” needs proof from prior facts. A triangle having three angles follows from the meaning of triangle; definitions and theorems play different roles.
            </p>
          </aside>
        </section>
        <section id="at10056-example" className="at10056-lower">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              The whole is greater than the part is an axiom; vertically
              opposite angles are equal is a theorem.
            </p>
            <div>
              <section>
                <b>Axiom (accepted without proof)</b>
                <strong>The whole is greater than the part.</strong>
                <p>
                  <b>Example:</b> If a line segment AB is divided at C, then AC
                  &lt; AB and BC &lt; AB.
                </p>
              </section>
              <section>
                <b>Theorem (proved)</b>
                <strong>Vertically opposite angles are equal.</strong>
                <p>
                  <b>Status:</b> Proved using definitions and Theorem T1.
                  <br />
                  <b>Supports:</b> D1 and T1 (2 links).
                </p>
              </section>
            </div>
          </article>
          <article id="at10056-practice" className="at10056-task">
            <h2>YOUR CHALLENGE</h2>
            <p>Select the supports before the result to prove:</p>
            <strong>Vertically opposite angles are equal.</strong>
            <p>
              ✓ Use only the given statements.
              <br />✓ Use D1 and T1 before T2 (either support order).
              <br />✓ Earn 1 ⭐ for exactly 3 cards and 2 support links.
            </p>
            <button
              onClick={() =>
                act(() => {
                  setChallenge(true);
                  setChallengeChain([]);
                })
              }
            >
              Start Challenge
            </button>
            {challenge && (
              <div>
                {["A1","A2","D1", "T1", "T2"].map((id) => (
                  <button
                    key={id} aria-label={`Challenge add ${id}`}
                    onClick={() => addChallenge(id)}
                    disabled={challengeChain.includes(id)}
                  >
                    {id}
                  </button>
                ))}
                <span>
                  {challengeChain.length?`Selection order: ${challengeChain.join(" · ")}`:"Choose support cards"}
                </span>
                <b>
                  {challengeValid
                    ? "Minimal proof complete! ⭐"
                    : challengeResult.valid?"Valid supports; remove unrelated cards for the minimal proof.":"Both D1 and T1 must precede T2."}
                </b><button aria-label="Undo challenge step" disabled={!challengeChain.length} onClick={()=>setChallengeChain(ids=>ids.slice(0,-1))}>Undo</button>
              </div>
            )}
            <Star className={challenge&&challengeValid?"at10056-earned":""} aria-label={challenge&&challengeValid?"Star earned":"Star not yet earned"}/>
          </article>
        </section>
      </main>
      <nav className="at10056-nav"><Link to="/lessons/school/class-9/class-9-euclidean-geometry-equivalent-forms-of-the-fifth-postulate"><ArrowLeft/> Equivalent Forms of the Fifth Postulate</Link><Link to="/lessons/school/class-9/class-9-euclidean-geometry-proof-structure-and-logical-statements">Proof Structure and Logical Statements <ArrowRight/></Link></nav>
      <footer className="at10056-footer"><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div><nav><Link to="/sitemap">Sitemap</Link><Link to="/docs">Docs</Link><Link to="/about">About</Link></nav></footer>

    </section>
  );
}
function Lane({
  title,
  lane,
  statements: items,
  place,selected,
}: {
  title: string;
  lane: Lane;
  statements: Statement[];
  place: (id: string, lane: Lane) => void;selected:string;
}) {
  return (
    <article
      className={`at10056-lane ${lane}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {e.preventDefault();place(e.dataTransfer.getData("statement"), lane);}}
    >
      <h3>{title}</h3><button className="at10056-place" aria-label={`Place selected in ${lane}`} onClick={()=>place(selected,lane)}>Place {selected} here</button>
      {items.map((s) => (
        <button key={s.id} aria-label={`Move ${s.id} to ${lane==='assumed'?'proved':'assumed'}`} onClick={() => place(s.id, lane==='assumed'?'proved':'assumed')}>
          <b>{s.id}</b>
          <span>
            {s.text}
            <small>{s.type}</small>
          </span>
          <small className="at10056-move">↔ Move to other lane</small>
        </button>
      ))}
    </article>
  );
}
function CrossingAngles(){const o={x:115,y:70},arms=[{x:1,y:-.5},{x:1,y:.5},{x:-1,y:.5},{x:-1,y:-.5}],labels=[[115,28],[177,75],[115,122],[53,75]],names=[['A',10,10],['B',214,10],['C',10,137],['D',214,137]];return <svg className="at10056-cross" role="img" aria-label="Intersecting lines with opposite angles1 and3, adjacent angles1 and2" viewBox="0 0 230 145">{arms.map((a,i)=>{const next=arms[(i+1)%4];const s=paSector10074(o,{x:o.x+a.x*100,y:o.y+a.y*100},{x:o.x+next.x*100,y:o.y+next.y*100},27);return s&&<path key={i} className={`at10056-sector c${[1,2,3,0][i]}`} data-sector={[2,3,4,1][i]} d={s.path}/>;})}<line x1="15" y1="20" x2="215" y2="120"/><line x1="15" y1="120" x2="215" y2="20"/>{labels.map(([x,y],i)=><text key={i} x={x} y={y} textAnchor="middle">{[1,2,3,4][i]}</text>)}{names.map(([n,x,y])=><text key={n} x={x} y={y}>{n}</text>)}<circle cx="115" cy="70" r="2"/><text x="104" y="86">O</text><text x="222" y="29">ℓ</text><text x="222" y="126">m</text></svg>;}

function numberKey(raw:string,e:React.KeyboardEvent<HTMLInputElement>,change:(s:string)=>void){if((e.key==='ArrowUp'||e.key==='ArrowDown')&&raw.trim()!==''&&Number.isFinite(Number(raw))){e.preventDefault();change(String(Number(raw)+(e.key==='ArrowUp'?1:-1)*(e.shiftKey?10:1)));}}
