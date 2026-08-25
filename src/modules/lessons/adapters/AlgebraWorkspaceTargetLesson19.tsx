import {
  Check,
  CheckCircle2,
  Edit3,
  ExternalLink,
  HelpCircle,
  Languages,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./AlgebraWorkspaceTargetLesson19.css";

const TABS = ["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"];
const PRACTICE_VALUES = [4, -3, 7, 2];

function formatRule(a: number, b: number) {
  const coefficient = a === 1 ? "" : a === -1 ? "-" : String(a);
  return `${coefficient}x${b >= 0 ? ` + ${b}` : ` - ${Math.abs(b)}`}`;
}

function parseRule(value: string) {
  const compact = value.replace(/\s+/g, "").replace("−", "-");
  const match = compact.match(/^([+-]?(?:\d+(?:\.\d+)?)?)x([+-]\d+(?:\.\d+)?)?$/i);
  if (!match) return null;
  const coefficientText = match[1];
  const a = coefficientText === "" || coefficientText === "+" ? 1 : coefficientText === "-" ? -1 : Number(coefficientText);
  const b = match[2] ? Number(match[2]) : 0;
  return Number.isFinite(a) && Number.isFinite(b) ? { a, b } : null;
}

const number = (value: number) => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));

export default function AlgebraWorkspaceTargetLesson19({ resetToken, onInteraction }: LessonAdapterProps) {
  const [x, setX] = useState(5);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [ruleText, setRuleText] = useState("2x + 3");
  const [editingRule, setEditingRule] = useState(false);
  const [ruleValid, setRuleValid] = useState(true);
  const [view, setView] = useState(0);
  const [actions, setActions] = useState(0);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(true);
  const output = a * x + b;
  const practiceX = PRACTICE_VALUES[practiceIndex];
  const practiceAnswer = a * practiceX + b;
  const canonicalRule = formatRule(a, b);
  const touch = () => { setActions((value) => value + 1); onInteraction(); };

  const restore = (notify = true) => {
    setX(5); setA(2); setB(3); setRuleText("2x + 3"); setEditingRule(false); setRuleValid(true);
    setView(0); setActions(0); setWorkspaceOpen(false); setShareState("Share");
    setPracticeIndex(0); setAnswerVisible(true); if (notify) onInteraction();
  };
  useEffect(() => {
    setX(5); setA(2); setB(3); setRuleText("2x + 3"); setEditingRule(false); setRuleValid(true);
    setView(0); setActions(0); setWorkspaceOpen(false); setShareState("Share"); setPracticeIndex(0); setAnswerVisible(true);
  }, [resetToken]);

  const commitRule = () => {
    const parsed = parseRule(ruleText);
    if (!parsed) { setRuleValid(false); touch(); return; }
    setA(parsed.a); setB(parsed.b); setRuleText(formatRule(parsed.a, parsed.b)); setRuleValid(true); setEditingRule(false); touch();
  };
  const clearAll = () => {
    setX(0); setA(1); setB(0); setRuleText("x + 0"); setRuleValid(true); setEditingRule(false);
    setPracticeIndex(0); setAnswerVisible(false); touch();
  };
  const share = async () => {
    try { await navigator.clipboard?.writeText(`x = ${number(x)}; f(x) = ${canonicalRule}; output = ${number(output)}`); setShareState("Copied"); }
    catch { setShareState("Ready"); }
    touch();
  };
  const nextQuestion = () => { setPracticeIndex((value) => (value + 1) % PRACTICE_VALUES.length); setAnswerVisible(false); touch(); };

  return (
    <div
      className="target-algebra-page"
      data-testid="algebra-mockup-0019"
      data-dedicated-lesson="19"
      data-object-model="editable-affine-rule-draggable-variable-substitution-output-dependency-equivalence-table-practice-model"
      data-x={x}
      data-coefficient={a}
      data-intercept={b}
      data-output={output}
      data-rule-valid={ruleValid}
      data-actions={actions}
      data-view={view}
      data-practice-index={practiceIndex}
      data-answer-visible={answerVisible}
    >
      <nav className="algebra-breadcrumb"><a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>19 Algebra Workspace</b></nav>
      <header className="algebra-header">
        <div className="algebra-kickers"><span>CORE WORKSPACES</span><span>ALGEBRA AND DYNAMIC VARIABLES</span></div>
        <h1>Algebra Workspace</h1><p>Create and manage mathematical objects.</p>
        <div className="algebra-meta"><b>♙ Foundational–Advanced</b><b>ϟ Exploration Lab</b><b>▣ Algebra View / Input Bar</b><b>◴ 6–10 min</b></div>
        <nav className="algebra-actions">
          <button type="button" onClick={touch}><Languages />English (English)<span>⌄</span></button>
          <button type="button" onClick={() => restore()}><RotateCcw />Reset</button>
          <button type="button" onClick={() => void share()}><Share2 />{shareState}</button>
          <button type="button" className={workspaceOpen ? "active" : ""} onClick={() => { setWorkspaceOpen((value) => !value); touch(); }}><ExternalLink />Workspace</button>
        </nav>
      </header>
      <nav className="algebra-tabs" aria-label="Lesson views">{TABS.map((tab,index)=><button type="button" className={view===index?"active":""} key={tab} onClick={()=>{setView(index);touch();}}><span>{index===0?"◉":index===1?"▣":index===2?"♧":index===3?"∑":"✣"}</span>{tab}</button>)}</nav>

      <main className="algebra-main">
        <section className="algebra-workspace">
          <div className="algebra-title"><div><small>SYMBOLIC WORKSPACE</small><h2>Build, link, substitute, and check</h2></div><button type="button" onClick={clearAll}><Trash2 />Clear all</button></div>
          <div className="algebra-equation"><i>x</i><span>=</span><b>{number(x)}</b><em>→</em><i>{canonicalRule}</i><em>→</em><i>{canonicalRule.replace("x", `(${number(x)})`)}</i><span>=</span><output>{number(output)}</output></div>
          <div className="algebra-flow">
            <article><small>1</small><h3>VARIABLE</h3><b><i>x</i><span>= {number(x)}</span></b><p>Input feeds<br/>the rule</p></article><em>→</em>
            <article className="rule"><small>2</small><h3>RULE</h3><b><i>f(x)</i><span>= {canonicalRule}</span></b><button type="button" onClick={()=>setEditingRule(true)}><Edit3 />Edit rule</button><p>Rule applies to<br/>the input</p></article><em>→</em>
            <article className="substitute"><small>3</small><h3>SUBSTITUTE</h3><b>{canonicalRule.replace("x", `(${number(x)})`)}</b><span>Replace x<br/>with {number(x)}</span><p>Evaluation<br/>produces output</p></article><em>→</em>
            <article className="result"><small>4</small><h3>OUTPUT</h3><b>{number(output)}</b><span>Result<br/>(live)</span></article>
          </div>
          <div className="algebra-editors">
            <label><b>Variable (x) <HelpCircle /></b><span>Set the input value.</span><div><input aria-label="Variable x drag control" type="range" min="-10" max="10" step="1" value={x} onChange={(event)=>{setX(Number(event.target.value));touch();}}/><output>{number(x)}</output></div><small><i>-10</i><i>-5</i><i>0</i><i>5</i><i>10</i></small></label>
            <div className="algebra-rule-editor"><b>Rule f(x) <HelpCircle /></b><span>Define the rule.</span>{editingRule?<div><input aria-label="Editable affine rule" value={ruleText} onChange={(event)=>setRuleText(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter")commitRule();}}/><button type="button" onClick={commitRule}>Apply</button></div>:<button type="button" onClick={()=>setEditingRule(true)}>{canonicalRule}<Edit3 /></button>}{!ruleValid?<small>Use a linear rule such as 3x - 2.</small>:null}</div>
          </div>
          <section className="algebra-output"><div><h3>Output (f(x))</h3><p>Live result from the workspace.</p></div><output>{number(output)}</output><b><i/>Live</b></section>
          <section className="algebra-practice"><div className="algebra-practice-title"><div><small>PRACTICE</small><h3>Check your understanding.</h3></div><button type="button" onClick={nextQuestion}><RefreshCw />New question</button></div><div><p>If <i>x</i> = {practiceX}, what does <b>{canonicalRule}</b> output?</p><button type="button" onClick={()=>{setAnswerVisible((value)=>!value);touch();}}>{answerVisible?"Hide answer":"Show answer"}</button></div>{answerVisible?<output><small>Answer</small><b>{number(practiceAnswer)}</b><CheckCircle2 /></output>:null}<p><Lightbulb />Hint: Substitute x = {practiceX} into the rule {canonicalRule}.</p></section>
        </section>

        <aside className="algebra-side">
          <h3>CONCEPT TRACE</h3><p>How the workspace evaluates.</p>
          <div className="algebra-trace"><i>1</i><span><b>Input</b><strong>x = {number(x)}</strong><small>Given value</small></span></div>
          <div className="algebra-trace violet"><i>2</i><span><b>Rule</b><strong>f(x) = {canonicalRule}</strong><small>Algebraic rule</small></span></div>
          <div className="algebra-trace blue"><i>3</i><span><b>Substitute</b><strong>{canonicalRule.replace("x", `(${number(x)})`)}</strong><small>Replace x with {number(x)}</small></span></div>
          <div className="algebra-trace amber"><i>4</i><span><b>Output</b><strong>{number(output)}</strong><small>Computed result</small></span></div>
          <div className="algebra-trace check"><i><Check /></i><span><b>Check</b><strong>Preserve equivalence</strong><small>Left and right sides are equal.</small></span></div>
          <section className="algebra-test-table"><h3>TEST VALUES TABLE</h3><p>Try multiple inputs.</p><div><b>x</b><b>{canonicalRule}</b><b>Output</b>{[0,x,10].map((value,index)=><span className={index===1?"active":""} key={`${value}-${index}`}><i>{number(value)}</i><i>{canonicalRule.replace("x",`(${number(value)})`)}</i><i>{number(a*value+b)}</i></span>)}</div><p><Lightbulb />The workspace stores your rule and evaluates it for any input.</p></section>
        </aside>
      </main>
      <nav className="algebra-neighbor"><a href="/lessons/core-workspaces/20-variable-explorer"><span><small>NEXT LESSON</small><b>Variable Explorer</b></span>→</a></nav>
      <footer className="algebra-footer"><b>✣ Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><button type="button" onClick={touch}>Sitemap</button><button type="button" onClick={touch}>Docs</button><button type="button" onClick={touch}>About</button></nav></footer>
    </div>
  );
}
