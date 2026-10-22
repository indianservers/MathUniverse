import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ProofStructureTargetLesson10057.css";
import{proofFacts10057 as facts,proofExpected10057 as expected,proofInitial10057,proofBroken10057,proofValidate10057,type ProofRow10057}from'./proofStructureModel10057';
const reasons=[...new Set(facts.map(f=>f.reason))];
export default function ProofStructureTargetLesson10057({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [proof, setProof] = useState<ProofRow10057[]>(proofInitial10057),
    [tab, setTab] = useState("Interact"),
    [checked, setChecked] = useState(true),
    [extraGiven, setExtraGiven] = useState(false),
    [fixes, setFixes] = useState<ProofRow10057[]>(proofBroken10057),
    [fixChecked, setFixChecked] = useState(false),
    [hints, setHints] = useState(2),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const result=proofValidate10057(proof),valid=result.valid,repair=proofValidate10057(fixes);
  const add=(id:string)=>{if(!facts.some(f=>f.id===id))return;act(()=>{setChecked(false);setProof(current=>current.some(r=>r.id===id)?current:[...current,{id,reason:facts.find(f=>f.id===id)!.reason}]);});};
  const changeRow=(index:number,reason:string)=>act(()=>{setChecked(false);setProof(rows=>rows.map((row,i)=>i===index?{...row,reason}:row));});
  const moveRow=(i:number,d:number)=>act(()=>{setChecked(false);setProof(rows=>{const next=[...rows];[next[i],next[i+d]]=[next[i+d],next[i]];return next;});});
  const clear = () =>
    act(() => {
      setProof([]);
      setChecked(false);
    });
  const resetChallenge = () =>
    act(() => {
      setFixes(proofBroken10057());
      setFixChecked(false);
      setHints(2);
    });
  const fixScore=repair.steps.filter(s=>s.valid).length;
  return (
    <section
      className="ps10057-page"
      data-testid="school-mockup-0731"
      data-object-model="dedicated-ordered-proof-reason-and-repair-engine"
      data-proof={proof.map(row=>row.id).join(",")}
      data-valid={String(checked && valid)}
      data-extra-given={String(extraGiven)}
      data-fix-score={fixChecked ? fixScore : "idle"}
      data-actions={actions}
    >
      <div role="banner" className="ps10057-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Proof Structure and Logical Statements</h1>
        <p>
          Learn how to build valid geometric proofs using logical structure and
          correct reasons.
        </p>
        <div>
          <span>◴ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </div>
      <div role="group" aria-label="Lesson sections" className="ps10057-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-pressed={tab === item}
            onClick={() => act(() => {setTab(item);document.getElementById(({Interact:"ps10057-interact",Learn:"ps10057-learn",Example:"ps10057-example",Formula:"ps10057-formula",Practice:"ps10057-practice"} as Record<string,string>)[item])?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {item}
          </button>
        ))}
      </div>
      <main>
        <section id="ps10057-interact" className="ps10057-builder">
          <header>
            <div>
              <h2>INTERACTIVE PROOF BUILDER</h2>
              <p>
                Drag or tap a fact to build your proof. Connect each step to
                a valid reason.
              </p>
            </div>
            <strong className={checked&&valid ? "ps10057-ok" : "ps10057-bad"}>
              <Check /> {checked&&valid ? "All steps valid" : checked ? "Review proof" : "Not checked"}
            </strong>
          </header>
          <div className="ps10057-work">
            <aside>
              <article>
                <h3>PROBLEM</h3>
                <p>In △ABC, AB = AC.</p>
                <b>Prove: ∠B = ∠C.</b>
                <IsoscelesDiagram marked />
              </article>
              <article>
                <h3>GIVEN</h3>
                <p>
                  <i>1</i> AB = AC
                </p>
                {extraGiven && (
                  <p>
                    <i>2</i> △ABC
                  </p>
                )}
                <button onClick={() => act(() => setExtraGiven((v) => !v))}>
                  {extraGiven?"− Remove optional given":"＋ Add given (optional)"}
                </button>
              </article>
            </aside>
            <article className="ps10057-main">
              <h3>Drag a fact below to add a step.</h3>
              <div className="ps10057-kinds">
                <span>Given</span>
                <span>Definition</span>
                <span>Axiom / Theorem</span>
                <span>Conclusion</span>
              </div>
              <div className="ps10057-facts">
                {facts.map((fact) => (
                  <button
                    aria-label={`Add fact: ${fact.id}`}
                    key={fact.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("fact", fact.id)}
                    onClick={() => add(fact.id)}
                    className={
                      fact.kind.startsWith("Given")
                        ? "given"
                        : fact.kind.startsWith("Definition")
                          ? "definition"
                          : "theorem"
                    }
                  >
                    <b>{fact.cardTitle ?? fact.statement}</b>
                    <span>{fact.cardDetail ?? fact.reason}</span>
                  </button>
                ))}
              </div>
              <h3>YOUR PROOF</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>STATEMENT</th>
                    <th>REASON</th>
                  </tr>
                </thead>
                <tbody>
                  {proof.map((row, index) => {
                    const id=row.id;
                    const f = facts.find((item) => item.id === id)!;
                    return (
                      <tr key={id}>
                        <td>
                          <i>{index + 1}</i>
                        </td>
                        <td>{f.statement}<div className="ps10057-row-tools"><button aria-label={`Move step ${index+1} up`} disabled={index===0} onClick={()=>moveRow(index,-1)}>↑</button><button aria-label={`Move step ${index+1} down`} disabled={index===proof.length-1} onClick={()=>moveRow(index,1)}>↓</button><button aria-label={`Remove step ${index+1}`} onClick={()=>act(()=>{setChecked(false);setProof(rows=>rows.filter((_,i)=>i!==index));})}>×</button></div></td>
                        <td><select aria-label={`Reason for step ${index+1}`} value={row.reason} onChange={e=>changeRow(index,e.target.value)}><option value="">Choose reason</option>{reasons.map(r=><option key={r}>{r}</option>)}</select><span className="ps10057-mobile-reason">{row.reason||"Choose a reason"}</span>{checked&&(result.steps[index].valid?<Check/>:<span className="ps10057-step-error">{result.steps[index].message}</span>)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div
                className="ps10057-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {e.preventDefault();add(e.dataTransfer.getData("fact"));}}
              >
                ◴ Drop the next fact here to add a step
              </div>
              <footer>
                <button onClick={clear}>
                  <RotateCcw /> Clear proof
                </button>
                <button onClick={() => act(() => setChecked(true))}>
                  <Check /> Check proof
                </button>
              </footer>
            </article>
          </div>
          <footer role="status" className={checked && valid ? "ps10057-success" : "ps10057-pending"}>
            {checked && valid ? (
              <>
                <Check />
                <span>
                  <b>Correct! Your proof is valid.</b>Every conclusion follows
                  from previous facts using an acceptable reason.
                </span>
              </>
            ) : (
              checked ? (result.steps.some(s=>!s.valid)?"Review the highlighted reasons and dependencies.":"The steps are justified, but the conclusion ∠B = ∠C has not been established.") : "Build your proof, choose reasons, then check it."
            )}
          </footer>
        </section>
        <section id="ps10057-learn" className="ps10057-example">
          <article>
            <h2 id="ps10057-example">WORKED EXAMPLE</h2>
            <p>
              <b>Example:</b> Prove ∠B = ∠C
            </p>
            <p>
              <b>Given:</b> In △ABC, AB = AC.
              <br />
              <b>Prove:</b> ∠B = ∠C
            </p>
            <ProofTable />
            <aside id="ps10057-formula">
              <Lightbulb />
              <b>Why it works</b>
              <p>
                Step 2 classifies the triangle using the definition.
                <br />
                Step 3 applies a proven theorem that guarantees the base angles
                are equal.
              </p>
            </aside>
          </article>
          <article className="ps10057-warning">
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <strong>
              A diagram's appearance cannot be used as an unstated premise.
            </strong>
            <IsoscelesDiagram marked={false} />
            <p>
              Even if it looks isosceles, you cannot conclude ∠B = ∠C unless AB
              = AC (or another valid reason) is stated or proved.
            </p>
          </article>
        </section>
        <section id="ps10057-practice" className="ps10057-challenge">
          <header>
            <div>
              <h2>CHALLENGE: REPAIR THE PROOF</h2>
              <p>
                This proof assumes the conclusion, misuses a theorem, and omits a reason. Replace each row with a justified step.
              </p>
            </div>
            <button onClick={resetChallenge}>
              <RotateCcw /> Reset challenge
            </button>
          </header>
          <p>
            <b>Problem:</b> In △ABC, AB = AC. Prove: ∠B = ∠C.
          </p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>STATEMENT</th>
                <th>REASON</th>
                <th>FIX</th>
              </tr>
            </thead>
            <tbody>
              {fixes.map((row,index)=><tr key={index}><td>{index+1}</td><td>{facts.find(f=>f.id===row.id)?.statement}</td><td>{row.reason||<em>Missing reason</em>}</td><td><select aria-label={`Repair step ${index+1}`} value={facts.some(f=>f.id===row.id&&f.reason===row.reason)?row.id:'wrong'} onChange={e=>act(()=>{const f=facts.find(f=>f.id===e.target.value);if(!f)return;setFixChecked(false);setFixes(rows=>rows.map((r,i)=>i===index?{id:f.id,reason:f.reason}:r));})}><option value="wrong">{['Replace the assumed conclusion.','Replace the misused theorem.','Supply a justified step and reason.'][index]}</option>{facts.map(f=><option key={f.id} value={f.id}>{f.statement} — {f.reason}</option>)}</select>{fixChecked&&<small className={repair.steps[index].valid?'ps10057-repair-ok':'ps10057-step-error'}>{repair.steps[index].valid?'Justified':repair.steps[index].message}</small>}</td></tr>)}
            </tbody>
          </table>
          <footer>
            <button onClick={() => act(() => setFixChecked(true))}>
              Check my fixes
            </button>
            <button
              disabled={hints===0} onClick={() => act(() => setHints((h) => Math.max(0, h - 1)))}
            >
              <Lightbulb /> Hints ({hints})
            </button>
            {fixChecked && (
              <strong>
                {repair.valid
                  ? "All repairs are logically valid."
                  : `${fixScore}/3 steps justified. ${repair.complete?"Review the remaining steps.":"The goal has not been proved."}`}
              </strong>
            )}
          </footer>{hints<2&&<aside className="ps10057-hint" role="note"><p>Start with AB = AC as a given. The desired conclusion cannot be assumed.</p>{hints===0&&<p>Equal sides give the isosceles classification by definition. Then the Isosceles Triangle Theorem gives equal base angles.</p>}</aside>}
        </section>
      </main>
      <nav className="ps10057-nav">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-axiom-versus-theorem">
          <ArrowLeft /> Axiom versus Theorem
        </Link>
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-vertically-opposite-angles">
          Vertically Opposite Angles <ArrowRight />
        </Link>
      </nav>
      <footer className="ps10057-footer"><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div><nav><Link to="/sitemap">Sitemap</Link><Link to="/docs">Docs</Link><Link to="/about">About</Link></nav></footer>

    </section>
  );
}
function IsoscelesDiagram({ marked }: { marked: boolean }) {
  return (
    <svg className="ps10057-triangle" viewBox="0 0 210 180" role="img" aria-label={marked?"Triangle ABC with equal sides AB and AC marked":"Triangle ABC without equality assumptions"}>
      <path d="M25 155L105 20l80 135Z" />
      <circle cx="105" cy="20" r="3" />
      <circle cx="25" cy="155" r="3" />
      <circle cx="185" cy="155" r="3" />
      {marked && (
        <>
          <line className="mark" x1="59" y1="91" x2="69" y2="97" />
          <line className="mark" x1="141" y1="97" x2="151" y2="91" />
        </>
      )}
      <text x="101" y="12">
        A
      </text>
      <text x="12" y="167">
        B
      </text>
      <text x="190" y="167">
        C
      </text>
    </svg>
  );
}
function ProofTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>STATEMENT</th>
          <th>REASON</th>
        </tr>
      </thead>
      <tbody>
        {expected.map((id, index) => {
          const f = facts.find((item) => item.id === id)!;
          return (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{f.statement}</td>
              <td>
                {index + 1} &nbsp; {f.reason}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
