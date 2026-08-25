import {
  Calculator,
  Check,
  ExternalLink,
  Globe2,
  Info,
  Network,
  RotateCcw,
  Share2,
  Sparkles,
  Table2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./VariableExplorerTargetLesson20.css";

const TABS = ["Interact", "Explore", "Explain", "Examples", "Formulas", "Know more"];
const PRESETS = [-1, 0, 1, 2, 3];
const TABLE_VALUES = [-2, 0, 1, 3];

export default function VariableExplorerTargetLesson20({ resetToken, onInteraction }: LessonAdapterProps) {
  const [x, setX] = useState(1);
  const [view, setView] = useState(0);
  const [symbolic, setSymbolic] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const y = 2 * x + 3;
  const touch = () => { setActions((value) => value + 1); onInteraction(); };
  const setVariable = (value: number) => { setX(value); touch(); };
  const reset = () => { setX(1); setView(0); setSymbolic(true); setWorkspaceOpen(false); setShareState("Share"); setActions(0); onInteraction(); };
  useEffect(() => { setX(1); setView(0); setSymbolic(true); setWorkspaceOpen(false); setShareState("Share"); setActions(0); }, [resetToken]);
  const share = async () => {
    try { await navigator.clipboard?.writeText(`x = ${x}; y = 2(${x}) + 3 = ${y}`); setShareState("Copied"); }
    catch { setShareState("Ready"); }
    touch();
  };

  return (
    <div
      className="target-variable-page"
      data-testid="algebra-mockup-0020"
      data-dedicated-lesson="20"
      data-object-model="single-source-variable-linked-rule-substitution-output-dependency-graph-table-verification-model"
      data-x={x}
      data-y={y}
      data-view={view}
      data-symbolic={symbolic}
      data-workspace-open={workspaceOpen}
      data-actions={actions}
    >
      <nav className="variable-breadcrumb"><a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>20 Variable Explorer</b></nav>
      <header className="variable-header">
        <div className="variable-heading"><div className="variable-kickers"><span>CORE WORKSPACES</span><span>ALGEBRA AND DYNAMIC VARIABLES</span></div><h1>Variable Explorer</h1><p>Understand variable dependency.</p><div className="variable-meta"><b>♙ Foundational–Advanced</b><b>ϟ Exploration Lab</b><b>▣ Algebra View / Input Bar</b><b>◴ 6–10 min</b></div></div>
        <nav className="variable-actions"><button type="button" onClick={touch}><Globe2 />English (English)<span>⌄</span></button><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={()=>void share()}><Share2 />{shareState}</button><button type="button" className={workspaceOpen?"active":""} onClick={()=>{setWorkspaceOpen(value=>!value);touch();}}><ExternalLink />Workspace<span>⌄</span></button></nav>
      </header>
      <nav className="variable-tabs" aria-label="Lesson views">{TABS.map((tab,index)=><button type="button" className={view===index?"active":""} key={tab} onClick={()=>{setView(index);touch();}}><span>{index===0?"◉":index===1?"▣":index===2?"♧":index===3?"▤":index===4?"∑":"✣"}</span>{tab}</button>)}</nav>
      <main className="variable-main">
        <section className="variable-flow-panel">
          <div className="variable-panel-title"><h2>Input, rule, substitution, output <Info /></h2><button type="button" onClick={()=>{setSymbolic(value=>!value);touch();}}><Network />{symbolic?"Symbolic trace":"Numeric values"}</button></div>
          <div className="variable-stage input"><i>1</i><span><small>INPUT</small><b>x = {x}</b></span></div><em>↓</em>
          <div className="variable-stage rule"><i>2</i><span><small>RULE</small><b>{symbolic?"y = 2x + 3":`y = 2(${x}) + 3`}</b></span></div><em>↓</em>
          <div className="variable-stage substitute"><i>3</i><span><small>SUBSTITUTE</small><b>y = 2(<strong>{x}</strong>) + 3</b></span></div><em>↓</em>
          <div className="variable-stage output"><i>4</i><span><small>OUTPUT</small><b>y = {y}</b></span></div>
          <section className="variable-graph"><h3>Dependency Graph <small>(update order)</small></h3><div><b>x</b><span>→</span><b>2x</b><span>→</span><b>+3</b><span>→</span><b>y</b></div><p>When x changes, updates flow left to right.</p></section>
        </section>
        <aside className="variable-side">
          <section className="variable-control"><header><h2>Active variable</h2><b>x</b></header><div><label>Adjust x <output>x = {x}</output></label><input aria-label="Active variable x drag control" type="range" min="-5" max="5" step="1" value={x} onChange={event=>setVariable(Number(event.target.value))}/><span><i>-5</i><i>0</i><i>5</i></span><nav>{PRESETS.map(value=><button type="button" className={x===value?"active":""} key={value} onClick={()=>setVariable(value)}>{value}</button>)}</nav></div></section>
          <section className="variable-callout"><Zap /><b>Changing x updates<br/>every linked expression.</b></section>
          <section className="variable-table"><h2>Value table</h2><div><b>x</b>{TABLE_VALUES.map(value=><b className={x===value?"active":""} key={`x-${value}`}>{value}</b>)}<b>y</b>{TABLE_VALUES.map(value=><b className={x===value?"active":""} key={`y-${value}`}>{2*value+3}</b>)}</div></section>
          <section className="variable-verify"><h2>Verify dependency</h2><div><span><Calculator />Expression</span><b>Correct <Check /></b></div><div><span><Table2 />Table</span><b>Correct <Check /></b></div><div><span><Network />Dependency graph</span><b>Correct <Check /></b></div></section>
        </aside>
      </main>
      <nav className="variable-neighbors"><a href="/lessons/core-workspaces/19-algebra-workspace">←<span><small>Previous</small><b>Algebra Workspace</b></span></a><a href="/lessons/core-workspaces/21-numeric-sliders"><span><small>Next</small><b>Numeric Sliders</b></span>→</a></nav>
      <footer className="variable-footer"><b><Sparkles />Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><button type="button" onClick={touch}>Sitemap</button><button type="button" onClick={touch}>Docs</button><button type="button" onClick={touch}>About</button></nav></footer>
    </div>
  );
}
