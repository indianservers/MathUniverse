import { ArrowLeft, ArrowRight, CheckCircle2, Share2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./BooleanVariablesTargetLesson36.css";

type Operation = "AND" | "OR" | "NOT";

export default function BooleanVariablesTargetLesson36({ resetToken, onInteraction }: LessonAdapterProps) {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [operation, setOperation] = useState<Operation>("AND");
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const and = a && b;
  const or = a || b;
  const not = !a;
  const focused = operation === "AND" ? and : operation === "OR" ? or : not;
  const act = (action: () => void) => { action(); setActions((value) => value + 1); onInteraction(); };
  useEffect(() => { setA(true); setB(false); setOperation("AND"); setShareState("Share"); setActions(0); }, [resetToken]);
  const share = async () => {
    try { await navigator.clipboard?.writeText(`A=${a}, B=${b}, AND=${and}, OR=${or}, NOT A=${not}`); setShareState("Copied"); }
    catch { setShareState("Ready"); }
    setActions((value) => value + 1); onInteraction();
  };
  return <div className="boolean-page" data-testid="algebra-mockup-0036" data-dedicated-lesson="36"
    data-object-model="dual-boolean-switch-logic-gates-truth-table-operation-focus-conditional-visibility-model"
    data-a={a} data-b={b} data-and={and} data-or={or} data-not={not} data-operation={operation} data-focused-result={focused} data-visible={and} data-actions={actions}>
    <nav className="boolean-breadcrumb"><a href="/">&larr;</a><a href="/">Home</a><span>&rsaquo;</span><a href="/lessons">Lessons</a><span>&rsaquo;</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>&rsaquo;</span><b>36 Boolean Variables</b></nav>
    <section className="boolean-shell">
      <header><div><h1>Boolean Variables</h1><p>Control logic and interactivity.</p></div><aside><b>◷ &nbsp; 6-10 min</b><button type="button" onClick={() => void share()}><Share2 />{shareState}</button></aside></header>
      <main aria-label="Boolean rule">
        <section className="boolean-left">
          <section className="state-card">
            <BooleanState name="A" value={a} onToggle={() => act(() => setA((value) => !value))} />
            <span className="state-arrow">&rarr;</span>
            <BooleanState name="B" value={b} onToggle={() => act(() => setB((value) => !value))} />
          </section>
          <section className="logic-card"><p className="boolean-eyebrow">LOGICAL OPERATIONS</p><div>
            <GateSummary title="A AND B" value={and} kind="AND" />
            <GateSummary title="A OR B" value={or} kind="OR" />
            <GateSummary title="NOT A" value={not} kind="NOT" />
          </div></section>
          <section className="truth-card"><p className="boolean-eyebrow">TRUTH TABLE</p><table><thead><tr><th>A</th><th>B</th><th>A AND B</th><th>A OR B</th></tr></thead><tbody>{[[false,false],[false,true],[true,false],[true,true]].map(([rowA,rowB]) => <tr className={a===rowA&&b===rowB?"active":""} key={`${rowA}${rowB}`}><td>{String(rowA)}</td><td>{String(rowB)}</td><td>{String(rowA&&rowB)}</td><td>{String(rowA||rowB)}</td></tr>)}</tbody></table></section>
          <section className="visibility-card"><p className="boolean-eyebrow">VISIBILITY EXAMPLE</p><div><article><h2>Show <b>Object P</b> if <em>A AND B</em></h2><p>Since A AND B = {String(and)}</p></article><span>&rarr;</span><article className={and?"object visible":"object hidden"}><div>P</div><h2>Object P is {and?"visible":"hidden"}</h2></article></div></section>
        </section>
        <aside className="boolean-side">
          <section className="control-card"><p className="boolean-eyebrow">CONTROLS</p><BooleanControl name="A" value={a} onToggle={() => act(() => setA((value) => !value))} /><BooleanControl name="B" value={b} onToggle={() => act(() => setB((value) => !value))} /></section>
          <section className="operation-card"><p className="boolean-eyebrow">OPERATION VIEW</p><p>Select an operation to focus</p><nav>{(["AND","OR","NOT"] as Operation[]).map((name) => <button type="button" className={operation===name?"active":""} onClick={() => act(() => setOperation(name))} key={name}>{name}</button>)}</nav><div><GateDrawing kind={operation} /><h2>Result: <b className={focused?"true":"false"}>{String(focused)}</b></h2></div></section>
          <section className="misconception-card"><h2>⚠ &nbsp; COMMON MISCONCEPTION</h2><p>{operation === "AND" ? "AND is true only when both inputs are true." : operation === "OR" ? "OR is false only when both inputs are false." : "NOT reverses the value of A."}</p></section>
          <section className="boolean-key"><p className="boolean-eyebrow">KEY</p><span><CheckCircle2 />true</span><span><XCircle />false</span></section>
        </aside>
      </main>
      <nav className="boolean-navigation"><a href="/lessons/core-workspaces/35-piecewise-definitions"><ArrowLeft/><span><small>Previous</small>Piecewise Definitions</span></a><a href="/lessons/core-workspaces/37-dynamic-text"><span><small>Next</small>Dynamic Text</span><ArrowRight/></a></nav>
    </section>
  </div>;
}

function BooleanState({name,value,onToggle}:{name:string;value:boolean;onToggle:()=>void}) { return <article className={value?"true":"false"}><h2>{name} = {String(value)}</h2><button type="button" role="switch" aria-label={`Toggle ${name}`} aria-checked={value} onClick={onToggle}><i /></button><strong>{String(value)}{value?<CheckCircle2/>:<XCircle/>}</strong></article>; }
function BooleanControl({name,value,onToggle}:{name:string;value:boolean;onToggle:()=>void}) { return <div className={value?"true":"false"}><b>{name}</b><button type="button" role="switch" aria-label={`Control ${name}`} aria-checked={value} onClick={onToggle}><i /></button><strong>{String(value)}</strong></div>; }
function GateSummary({title,value,kind}:{title:string;value:boolean;kind:Operation}) { return <article><h2>{title} = <b className={value?"true":"false"}>{String(value)}</b></h2><GateDrawing kind={kind}/><strong className={value?"true":"false"}>{String(value)}{value?<CheckCircle2/>:<XCircle/>}</strong></article>; }
function GateDrawing({kind}:{kind:Operation}) { return <svg viewBox="0 0 150 82" role="img" aria-label={`${kind} logic gate`}><text x="4" y="27" className="a">A</text>{kind!=="NOT"&&<text x="4" y="62" className="b">B</text>}<line x1="20" y1="23" x2="55" y2="23"/><line x1="20" y1="58" x2="55" y2="58"/><path d={kind==="AND"?"M55 13h20c40 0 40 55 0 55H55z":kind==="OR"?"M55 13q35 0 55 28-20 27-55 27 14-27 0-55z":"M55 13v55l43-27z"}/>{kind==="NOT"&&<circle cx="102" cy="41" r="5"/>}<line x1={kind==="NOT"?107:110} y1="41" x2="140" y2="41"/><circle cx="142" cy="41" r="5"/></svg>; }
