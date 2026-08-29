import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Expand,
  Hand,
  Lightbulb,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SolveTargetLesson433.css";

type Quadratic = { valid: boolean; b: number; c: number; pair: [number, number]; roots: [number, number]; factors: string };
type Operation = "add-linear" | "subtract-constant" | "factor";
const INITIAL = "x^2-5x+6=0";

export default function SolveTargetLesson433({ resetToken, onInteraction }: LessonAdapterProps) {
  const [equation, setEquation] = useState(INITIAL);
  const [stage, setStage] = useState(3);
  const [actions, setActions] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceRoots, setPracticeRoots] = useState<[string, string]>(["", ""]);
  const [practiceFeedback, setPracticeFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showPractice, setShowPractice] = useState(false);
  const model = useMemo(() => solveQuadratic(equation), [equation]);
  useEffect(() => {
    setEquation(INITIAL); setStage(3); setActions(0); setFullscreen(false); setPracticeOpen(false); setPracticeRoots(["", ""]); setPracticeFeedback("idle"); setShowPractice(false);
  }, [resetToken]);
  const act = (run: () => void) => { run(); setActions((value) => value + 1); onInteraction(); };
  const apply = (operation: Operation) => act(() => setStage(operation === "add-linear" ? 1 : operation === "subtract-constant" ? 2 : 3));
  const checkPractice = () => act(() => {
    const roots = practiceRoots.map(Number).sort((a, b) => a - b);
    setPracticeFeedback(roots[0] === -4 && roots[1] === 2 ? "correct" : "incorrect");
  });
  return <section
    className={`sol433-page${fullscreen ? " fullscreen" : ""}`}
    data-testid="symbolic-cas-mockup-0339"
    data-dedicated-lesson="433"
    data-object-model="balanced-quadratic-inverse-operations-factor-roots-verification"
    data-equation={equation}
    data-valid={model.valid}
    data-coefficients={`1,${model.b},${model.c}`}
    data-pair={model.pair.join(",")}
    data-roots={model.roots.join(",")}
    data-factors={model.factors}
    data-stage={stage}
    data-actions={actions}
    data-practice-feedback={practiceFeedback}
  >
    <section className="sol433-lab">
      <header><span><small>INTERACTION + VISUALIZATION</small><h2>Solve - reusable CAS engine</h2></span><div><b>{actions ? "Interactive" : "Awaiting interaction"}</b><i>{actions} actions</i><button type="button" data-lesson-control="solve-fullscreen" aria-label="Toggle solve workspace fullscreen" onClick={() => act(() => setFullscreen((value) => !value))}><Expand/></button></div></header>
      <section className="sol433-flow">{[[Eye,"1 Observe","See the balanced equation as a model."],[Hand,"2 Manipulate","Apply inverse operations to both sides."],[Lightbulb,"3 Notice","The balance stays true at every step."],[Target,"4 Understand","Arrive at a true statement to read the solution."]].map(([Icon,title,text],index)=><article key={String(title)}><Icon/><div><h3>{String(title)}</h3><p>{String(text)}</p></div>{index<3&&<ArrowRight/>}</article>)}</section>
      <div className="sol433-body">
        <main>
          <div className="sol433-inputs"><label>Equation<input data-lesson-control="solve-equation" aria-label="Equation to solve" value={equation} onChange={(event)=>act(()=>{setEquation(event.target.value);setStage(0);})}/></label><label>Model view<select data-lesson-control="solve-model-view" aria-label="Solve model view"><option>Balance (symbolic)</option><option>Equation steps</option></select></label></div>
          <BalanceRow index={0} title="Start" model={model} active={stage>=0}/>
          <BalanceRow index={1} title={`Add ${plainSigned(-model.b)}x to both sides`} model={model} active={stage>=1}/>
          <BalanceRow index={2} title={`Add ${plainSigned(-model.c)} to both sides`} model={model} active={stage>=2}/>
          <BalanceRow index={3} title="Factor" model={model} active={stage>=3}/>
          <div className="sol433-solution"><CheckCircle2/><b>Solution set</b><strong>x = {model.roots.join(", ")}</strong><span>Domain: x in R</span></div>
          <div className="sol433-ops" aria-label="Inverse operation controls">{([ ["add-linear",`Add ${plainSigned(-model.b)}x`], ["subtract-constant",`Add ${plainSigned(-model.c)}`], ["factor","Factor"] ] as Array<[Operation,string]>).map(([operation,label])=><OperationChip key={operation} operation={operation} label={label} onApply={apply}/>)}</div>
          <div className="sol433-drop" data-lesson-control="solve-operation-dropzone" onDragOver={(event)=>event.preventDefault()} onDrop={(event)=>{event.preventDefault();const op=event.dataTransfer.getData("application/x-equation-operation") as Operation;if(["add-linear","subtract-constant","factor"].includes(op))apply(op);}}>Drop an inverse operation here</div>
        </main>
        <aside className="sol433-side">
          <section><h2><Lightbulb/> Relevant rule</h2><h3>Solve by Inverse Operations</h3><p>Apply the same operation to both sides to keep the equation balanced.</p><div><b>Inverse operations</b><p>+ a ↔ - a</p><p>- a ↔ + a</p><p>x a ↔ ÷ a</p><p>÷ a ↔ x a &nbsp; (a != 0)</p></div></section>
          <section><h2><CheckCircle2/> Verify by substitution</h2><p>Substitute each solution into the original equation.</p>{model.roots.map((root)=><div key={root}><b>x = {root}</b><p>{root}² {signed(model.b*root)} {signed(model.c)} = {root**2+model.b*root+model.c}</p><strong>True</strong></div>)}</section>
        </aside>
      </div>
      <section className="sol433-bottom">
        <article><h2><AlertTriangle/> Common misconception</h2><p>Only solving for one root. Quadratic equations can have two solutions, as many solutions as their factors.</p><div><b>{model.factors} = 0</b><span>{binomial(model.pair[0])}=0<br/>x = {model.roots[0]}</span><span>{binomial(model.pair[1])}=0<br/>x = {model.roots[1]}</span></div></article>
        <article><h2><Target/> Practice challenge</h2><p>Solve using the balance model.</p><strong>x² + 2x - 8 = 0</strong>{practiceOpen&&<label><input data-lesson-control="solve-practice-root-one" aria-label="First practice root" value={practiceRoots[0]} onChange={(event)=>setPracticeRoots([event.target.value,practiceRoots[1]])}/><input data-lesson-control="solve-practice-root-two" aria-label="Second practice root" value={practiceRoots[1]} onChange={(event)=>setPracticeRoots([practiceRoots[0],event.target.value])}/></label>}<div><button type="button" data-lesson-control="solve-practice-try" onClick={()=>act(()=>setPracticeOpen(true))}>Try it</button><button type="button" data-lesson-control="solve-practice-show" onClick={()=>act(()=>setShowPractice((value)=>!value))}>{showPractice?"x = -4, 2":"Show me"}</button>{practiceOpen&&<button type="button" data-lesson-control="solve-practice-check" onClick={checkPractice}>Check</button>}</div>{practiceFeedback!=="idle"&&<em className={practiceFeedback}>{practiceFeedback==="correct"?"Both roots are correct.":"Use factors (x+4)(x-2)."}</em>}</article>
      </section>
      <footer><span>primary-control</span><span>expression</span><span>CAS result</span></footer>
    </section>
    <nav className="sol433-nav" aria-label="Adjacent lessons"><a href="/lessons/symbolic-mathematics/432-substitute"><ArrowLeft/><span><small>Previous</small>Substitute</span></a><a href="/lessons/symbolic-mathematics/434-numerical-solve"><span><small>Next</small>Numerical Solve</span><ArrowRight/></a></nav>
  </section>;
}

function BalanceRow({index,title,model,active}:{index:number;title:string;model:Quadratic;active:boolean}){return <section className={`sol433-row row-${index}${active?" active":""}`}><aside><i>{index}</i><b>{title}</b></aside><div><EquationSide index={index} side="left" model={model}/><span>=</span><EquationSide index={index} side="right" model={model}/></div>{index>0&&<small><Check/> Balanced</small>}</section>}
function EquationSide({index,side,model}:{index:number;side:"left"|"right";model:Quadratic}){
  if(index===3)return <strong className={side}>{side==="left"?model.factors:"0"}</strong>;
  if(side==="right")return <strong className="right">{index===0?"0":index===1?<><i>0</i><i className="x">{plainSigned(-model.b)}x</i></>:<><i>{plainSigned(-model.b)}x</i><i className="constant">({plainSigned(-model.c)})</i></>}</strong>;
  return <strong className="left"><i className="square">x²</i>{index<2&&<i className={`x${index===1?" cancelled":""}`}>{plainSigned(model.b)}x</i>}{index===1&&<i className="x">{plainSigned(-model.b)}x</i>}{index<3&&Array.from({length:Math.min(Math.abs(model.c),6)},(_,unit)=><i className="unit" key={unit}>+1</i>)}{index===2&&<i className="constant">({plainSigned(-model.c)})</i>}</strong>;
}
function OperationChip({operation,label,onApply}:{operation:Operation;label:string;onApply:(operation:Operation)=>void}){const drag=(event:DragEvent<HTMLButtonElement>)=>event.dataTransfer.setData("application/x-equation-operation",operation);const key=(event:KeyboardEvent<HTMLButtonElement>)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onApply(operation)}};return <button type="button" draggable data-lesson-control={`solve-operation-${operation}`} onDragStart={drag} onClick={()=>onApply(operation)} onKeyDown={key}>{label}</button>}
function solveQuadratic(value:string):Quadratic{const source=value.replaceAll(" ","").replaceAll("²","^2").replaceAll("−","-");const match=source.match(/^x\^2(?:(\+|-)(\d*)x)?(?:(\+|-)(\d+))=0$/);if(!match)return{valid:false,b:0,c:0,pair:[0,0],roots:[0,0],factors:"Invalid equation"};const b=match[1]?(match[1]==="-"?-1:1)*Number(match[2]||1):0,c=(match[3]==="-"?-1:1)*Number(match[4]);let pair:[number,number]=[0,0];for(let m=-Math.abs(c)-1;m<=Math.abs(c)+1;m+=1)if(m&&c%m===0&&m+c/m===b){pair=[m,c/m];break}pair=pair.sort((a,z)=>z-a) as [number,number];return{valid:pair.some(Boolean),b,c,pair,roots:[-pair[0],-pair[1]],factors:`${binomial(pair[0])}${binomial(pair[1])}`}}
function binomial(value:number){return `(x ${value<0?"-":"+"} ${Math.abs(value)})`}function signed(value:number){return `${value<0?"-":"+"} ${Math.abs(value)}`}function plainSigned(value:number){return `${value<0?"-":""}${Math.abs(value)}`}
