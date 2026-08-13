import katex from "katex";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BadgeIndianRupee, BarChart3, Calculator, Camera, Check, CheckCircle2, ChevronDown,
  CircleHelp, Clipboard, Clock3, Copy, Eraser, FileText, GraduationCap, Lightbulb,
  ListChecks, Play, Search, Share2, Sparkles, Target,
} from "lucide-react";
import { ProblemGraph, ValueTablePanel } from "../problem-solver/ProblemGraph";
import { buildVisualVerification } from "../problem-solver/graphingUtils";
import { solveProblem } from "../problem-solver/problemSolverEngine";
import type { ProblemIntentKind, ProblemSolverResult } from "../problem-solver/problemTypes";
import { symbolicLatex } from "../utils/symbolic";
import "./StepByStepProblemSolver.css";

const INITIAL = "Simple interest principal 5000 rate 8 time 2 years";
const EXAMPLES = [INITIAL, "2x + 5 = 15", "x^2 - 5x + 6 = 0", "derivative of x^3 + 2x", "mean of 4, 6, 8, 10", "determinant [[1,2],[3,4]]"];
const QUICK_EXAMPLES = [
  { label: "Interest", value: INITIAL },
  { label: "Equation", value: "2x + 5 = 15" },
  { label: "Quadratic", value: "x^2 - 5x + 6 = 0" },
  { label: "Calculus", value: "derivative of x^3 + 2x" },
  { label: "Statistics", value: "mean of 4, 6, 8, 10" },
  { label: "Matrix", value: "determinant [[1,2],[3,4]]" },
] as const;
type WorkspaceTab = "Solution" | "Visual" | "Assumptions" | "Input details" | "Practice";
type InputMode = "Natural language" | "Equation" | "Photo";

export default function StepByStepProblemSolver() {
  const [searchParams] = useSearchParams();
  const routedQuery = searchParams.get("query")?.trim() || searchParams.get("q")?.trim() || INITIAL;
  const [draft, setDraft] = useState(routedQuery);
  const [submitted, setSubmitted] = useState(routedQuery);
  const [mode, setMode] = useState<InputMode>("Natural language");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("Solution");
  const [solving, setSolving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const timer = useRef<number>();
  const output = useMemo(() => solveProblem(submitted), [submitted]);
  const { classification, result, trust } = output;
  const visual = useMemo(() => buildVisualVerification(classification, result), [classification, result]);
  const finance = useMemo(() => parseSimpleInterest(submitted, result), [submitted, result]);
  const verified = Boolean(trust.verification?.passed && result.result && trust.confidence === "verified");
  const status = solving ? "Solving" : !draft.trim() ? "Ready" : verified ? "Verified" : trust.confidence === "ambiguous" ? "Needs clarification" : trust.confidence === "unsupported" || trust.confidence === "error" ? "Unable to solve" : "Calculated";

  useEffect(() => () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
  }, []);

  const solve = () => {
    if (!draft.trim() || solving) return;
    setSolving(true);
    setActiveTab("Solution");
    timer.current = window.setTimeout(() => { setSubmitted(draft.trim()); setSolving(false); }, 420);
  };
  const chooseExample = () => {
    const index = Math.max(0, EXAMPLES.indexOf(draft));
    const next = EXAMPLES[(index + 1) % EXAMPLES.length];
    setDraft(next); setSubmitted(next); setActiveTab("Solution");
  };

  return (
    <div className="problem-solver-page">
      <nav className="ps-breadcrumb" aria-label="Breadcrumb"><span>Home</span><i>/</i><span>CAS</span><i>/</i><b>Algebra Solver</b></nav>
      <header className="ps-header">
        <div className="ps-title-icon"><Calculator /></div>
        <div><h1>Step-by-Step Problem Solver</h1><p>Type a problem. See the reasoning. Check the answer.</p></div>
        <span className={`ps-status ${verified ? "verified" : ""}`}>{verified ? <CheckCircle2 /> : <Sparkles />}{status}</span>
        <button className="ps-new" onClick={() => { setDraft(""); setSubmitted(""); }}><span>+</span>New problem</button>
        <button className="ps-share" onClick={() => void navigator.clipboard?.writeText(location.href)}><Share2 />Share</button>
      </header>

      <main className="ps-layout">
        <div className="ps-main-column">
          <section className="ps-card ps-input-card">
            <div className="ps-card-title"><h2>What do you want to solve?</h2><div className="ps-modes" role="tablist">
              {(["Natural language", "Equation", "Photo"] as InputMode[]).map(item => <button key={item} disabled={item === "Photo"} title={item === "Photo" ? "Photo input is coming soon" : undefined} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item === "Photo" && <Camera />}{item}</button>)}
            </div></div>
            <textarea aria-label="Problem input" rows={2} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") solve(); }} placeholder={mode === "Equation" ? "Try: 2x + 5 = 15" : "Describe the problem in your own words…"} />
            <div className="ps-token-preview" aria-label="Detected input tokens">{highlightInput(draft)}</div>
            <div className="ps-actions"><button className="primary" disabled={!draft.trim() || solving} onClick={solve}><Play />{solving ? "Solving…" : "Solve problem"}</button><button onClick={() => setDraft("")}><Eraser />Clear</button><button onClick={chooseExample}><Lightbulb />Try an example</button><span>Ctrl + Enter to solve</span></div>
            <div className="ps-samples" aria-label="Sample problems"><b>Samples</b>{QUICK_EXAMPLES.map(example => <button key={example.label} title={example.value} onClick={() => { setDraft(example.value); setSubmitted(example.value); setActiveTab("Solution"); }}>{example.label}<span>{example.value}</span></button>)}</div>
            {trust.unsupportedReason && !solving && <p className="ps-message"><CircleHelp />{trust.unsupportedReason}</p>}
            <Interpretation classification={classification} finance={finance} />
          </section>

          <section className="ps-card ps-solution-card">
            <h2>Step-by-step solution</h2>
            <ProgressRail solving={solving} hasAnswer={Boolean(result.result)} verified={verified} />
            {solving ? <LoadingSteps /> : <SolutionSteps result={result} finance={finance} showDetails={showDetails} />}
            <div className="ps-detail-actions"><button onClick={() => setShowDetails(value => !value)}>Show {showDetails ? "less" : "more"} detail<ChevronDown className={showDetails ? "rotated" : ""} /></button><button onClick={() => setActiveTab("Assumptions")}><CircleHelp />Why this formula?</button></div>
          </section>
        </div>

        <aside className="ps-side-column">
          <AnswerCard result={result} finance={finance} verified={verified} confidence={classification.confidence} onExplain={() => setActiveTab("Solution")} />
          {finance ? <MoneyGrowth finance={finance} /> : <VisualSummary result={result} visual={visual} />}
          <QuickCheck result={result} finance={finance} verified={verified} />
        </aside>
      </main>

      <section className="ps-bottom-card">
        <div className="ps-bottom-tabs" role="tablist">{(["Solution", "Visual", "Assumptions", "Input details", "Practice"] as WorkspaceTab[]).map(tab => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tabIcon(tab)}{tab}</button>)}</div>
        {activeTab !== "Solution" && <TabPanel tab={activeTab} input={submitted} classification={classification} result={result} visual={visual} finance={finance} onExample={value => { setDraft(value); setSubmitted(value); setActiveTab("Solution"); }} />}
      </section>
    </div>
  );
}

function Interpretation({ classification, finance }: { classification: ReturnType<typeof solveProblem>["classification"]; finance: FinanceData | null }) {
  const items = finance ? [
    [BadgeIndianRupee, "Principal", "P", money(finance.principal)],
    [Target, "Rate", "R", `${finance.rate}% per year`],
    [Clock3, "Time", "T", `${finance.time} years`],
    [Search, "Find", "", "Interest and Amount"],
  ] as const : [
    [FileText, "Problem type", "", labelKind(classification.kind)],
    [Sparkles, "Confidence", "", classification.confidence],
    [Calculator, "Method", "", classification.reason],
  ] as const;
  return <div className="ps-understood"><h3>I understood</h3><div>{items.map(([Icon,label,symbol,value]) => <article key={label}><Icon/><span><b>{label}</b><small>{symbol && `${symbol} = `}<em>{value}</em></small></span></article>)}</div></div>;
}

function ProgressRail({ solving, hasAnswer, verified }: { solving: boolean; hasAnswer: boolean; verified: boolean }) {
  const completed = verified ? 4 : hasAnswer ? 3 : solving ? 1 : 0;
  return <div className="ps-progress">{["Understand", "Choose formula", "Substitute", "Answer"].map((label,index) => <div className={index < completed ? "done" : index === completed && solving ? "active" : ""} key={label}><i>{index < completed ? <Check /> : index + 1}</i><span>{label}</span></div>)}</div>;
}

function SolutionSteps({ result, finance, showDetails }: { result: ProblemSolverResult; finance: FinanceData | null; showDetails: boolean }) {
  const steps = finance ? [
    { title: "Choose the formula", math: "I=\\frac{P\\times R\\times T}{100}", why: "Simple interest equals principal multiplied by annual rate and time." },
    { title: "Substitute the values", math: `I=\\frac{${finance.principal}\\times ${finance.rate}\\times ${finance.time}}{100}`, why: "The rate is interpreted as a yearly percentage." },
    { title: "Calculate interest", math: `I=${moneyLatex(finance.interest)}`, why: "Multiplication and division give the interest earned." },
    { title: "Find total amount", math: `A=P+I=${finance.principal}+${finance.interest}=${moneyLatex(finance.amount)}`, why: "The amount combines the original principal and interest." },
  ] : result.steps.slice(result.steps.length > 4 ? 1 : 0, 5).map((step,index) => ({ title: stepTitle(step,index), math: step, why: genericWhy(result.kind,index) }));
  if (!result.result) return <div className="ps-empty"><CircleHelp /><p>Enter a supported problem, then solve it to see structured reasoning.</p></div>;
  return <div className="ps-step-list">{steps.map((step,index) => <details open key={`${step.title}-${index}`}><summary><i>{index+1}</i><b>{step.title}</b><RenderedMath value={step.math}/><CheckCircle2/><CopyButton value={step.math}/></summary>{showDetails && <p>{step.why}</p>}</details>)}</div>;
}

function AnswerCard({ result, finance, verified, confidence, onExplain }: { result: ProblemSolverResult; finance: FinanceData | null; verified: boolean; confidence: string; onExplain: () => void }) {
  const answer = finance ? <><strong>Interest = {money(finance.interest)}</strong><strong>Total amount = {money(finance.amount)}</strong></> : <strong>{result.result ?? "Solve a problem to see the answer."}</strong>;
  const copy = finance ? `Interest = ${money(finance.interest)}\nTotal amount = ${money(finance.amount)}` : result.result ?? "";
  return <section className={`ps-answer ${verified ? "checked" : ""}`}><span>FINAL ANSWER</span><div>{answer}</div><hr/><p><CheckCircle2 />{verified ? "Checked" : result.result ? "Calculated" : "Ready"}</p><small>{confidence[0]?.toUpperCase()+confidence.slice(1)} confidence · {labelKind(result.kind)}</small><footer><CopyButton value={copy} label="Copy answer"/><button onClick={onExplain}><ListChecks />Explain steps</button></footer></section>;
}

function MoneyGrowth({ finance }: { finance: FinanceData }) { const percent = finance.amount ? finance.interest/finance.amount*100 : 0; return <section className="ps-card ps-money"><h2>Money growth</h2><div className="ps-money-bar"><i style={{width:`${100-percent}%`}}/><b style={{width:`${percent}%`}}/></div><div><span><small>Principal</small><strong>{money(finance.principal)}</strong></span><em>+</em><span><small>Interest</small><strong>{money(finance.interest)}</strong></span><em>=</em><span><small>Amount</small><strong>{money(finance.amount)}</strong></span></div></section>; }

function VisualSummary({ result, visual }: { result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification> }) { return <section className="ps-card ps-generic-visual"><h2>{visual?.title ?? "Visual model"}</h2>{visual ? <ProblemGraph visual={visual} showTable={false}/> : <div className="ps-empty"><BarChart3/><p>A relevant visual will appear when this problem type supports one.</p></div>}<small>{result.method}</small></section>; }

function QuickCheck({ result, finance, verified }: { result: ProblemSolverResult; finance: FinanceData | null; verified: boolean }) { const text = finance ? `${finance.rate}% of ${money(finance.principal)} for ${finance.time} years = ${money(finance.interest)}` : result.verification?.[0] ?? "Verification becomes available after calculation."; return <section className={`ps-card ps-quick ${verified ? "checked" : ""}`}><h2>Quick check</h2><CheckCircle2/><p>{text}</p><small>{finance ? "Units included" : verified ? "Consistency check passed" : "Review recommended"}</small></section>; }

function TabPanel({ tab, input, classification, result, visual, finance, onExample }: { tab: WorkspaceTab; input: string; classification: ReturnType<typeof solveProblem>["classification"]; result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification>; finance: FinanceData | null; onExample: (value:string)=>void }) {
  if (tab === "Visual") return <div className="ps-tab-panel">{finance ? <MoneyGrowth finance={finance}/> : visual ? <><ProblemGraph visual={visual} showTable={false}/><ValueTablePanel visual={visual}/></> : <p>No visual is available for this result.</p>}</div>;
  if (tab === "Assumptions") return <div className="ps-tab-panel ps-assumptions">{(finance ? ["Rate interpreted as percent per year", `Time interpreted as ${finance.time} years`, "Simple interest—not compound interest", "No fees or taxes", "Currency inferred as INR"] : [...classification.assumptions,...result.assumptions]).map(item => <label key={item}><Check/><span>{item}</span></label>)}</div>;
  if (tab === "Input details") return <div className="ps-tab-panel ps-details"><Info label="Original input" value={input}/><Info label="Normalized input" value={classification.normalizedInput}/><Info label="Problem type" value={labelKind(classification.kind)}/><Info label="Method selected" value={result.method ?? "Not selected"}/><Info label="Confidence" value={classification.confidence}/><Info label="Why classified" value={classification.reason}/></div>;
  if (tab === "Practice") return <div className="ps-tab-panel ps-practice">{EXAMPLES.filter(item => item !== input).slice(0,4).map((item,index) => <button key={item} onClick={() => onExample(item)}><GraduationCap/><span><b>{index === 0 ? "Similar problem" : index === 1 ? "Easier example" : index === 2 ? "Harder example" : "Change values"}</b><small>{item}</small></span></button>)}</div>;
  return null;
}

function LoadingSteps(){return <div className="ps-loading"><span/><span/><span/><p>Interpreting input, selecting a method, calculating, and checking…</p></div>}
function Info({label,value}:{label:string;value:string}){return <article><b>{label}</b><span>{value || "—"}</span></article>}
function CopyButton({value,label}:{value:string;label?:string}){const [copied,setCopied]=useState(false);return <button onClick={event=>{event.preventDefault();void navigator.clipboard?.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),1200)}} aria-label={label??"Copy step"}>{copied?<Check/>:<Copy/>}{label}</button>}
function RenderedMath({value}:{value:string}){const html=useMemo(()=>katex.renderToString(symbolicLatex(value),{displayMode:true,throwOnError:false}),[value]);return <div className="ps-math" dangerouslySetInnerHTML={{__html:html}}/>}
function tabIcon(tab:WorkspaceTab){if(tab==="Solution")return <Clipboard/>;if(tab==="Visual")return <BarChart3/>;if(tab==="Assumptions")return <FileText/>;if(tab==="Input details")return <CircleHelp/>;return <GraduationCap/>}
function labelKind(kind:ProblemIntentKind){return kind.split("-").map(word=>word[0].toUpperCase()+word.slice(1)).join(" ")}
function stepTitle(step:string,index:number){const colon=step.indexOf(":");return colon>0&&colon<42?step.slice(0,colon):index===0?"Understand the problem":index===1?"Choose a method":index===2?"Calculate":"Conclude"}
function genericWhy(kind:ProblemIntentKind,index:number){return index===0?`The input was identified as ${labelKind(kind).toLowerCase()}.`:index===1?"This method matches the mathematical structure of the input.":"Each transformation preserves the meaning of the original problem."}
function highlightInput(value:string){const chunks=value.split(/(\d+(?:\.\d+)?)/g);return chunks.map((chunk,index)=>/^\d/.test(chunk)?<mark key={`${chunk}-${index}`}>{chunk}</mark>:<span key={`${chunk}-${index}`}>{chunk}</span>)}
function money(value:number){return `₹${value.toLocaleString("en-IN",{maximumFractionDigits:2})}`}
function moneyLatex(value:number){return `\\text{₹}${value.toLocaleString("en-IN",{maximumFractionDigits:2})}`}
type FinanceData={principal:number;rate:number;time:number;interest:number;amount:number};
function parseSimpleInterest(input:string,result:ProblemSolverResult):FinanceData|null{if(result.kind!=="word-problem"||!/simple interest|principal/i.test(input)||!/interest/i.test(result.result??""))return null;const principal=Number(input.match(/principal\s*=?\s*([\d.]+)/i)?.[1]);const rate=Number(input.match(/rate\s*=?\s*([\d.]+)/i)?.[1]);const time=Number(input.match(/(?:time\s*=?\s*|)([\d.]+)\s*years?/i)?.[1]??input.match(/time\s*=?\s*([\d.]+)/i)?.[1]);if(!principal||!rate||!time)return null;const interest=principal*rate*time/100;return{principal,rate,time,interest,amount:principal+interest}}
