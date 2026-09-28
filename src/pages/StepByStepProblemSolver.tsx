import katex from "katex";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StudioBreadcrumb from "../components/ui/StudioBreadcrumb";
import {
  BadgeIndianRupee, BarChart3, Calculator, Camera, Check, CheckCircle2, ChevronDown,
  CircleHelp, Clipboard, Clock3, Copy, Eraser, FileText, GraduationCap, Lightbulb,
  ListChecks, Play, Search, Share2, Sparkles, Target, History,
} from "lucide-react";
import { ProblemGraph, ValueTablePanel } from "../problem-solver/ProblemGraph";
import { buildVisualVerification } from "../problem-solver/graphingUtils";
import { solveProblem } from "../problem-solver/problemSolverEngine";
import { formatInterestValue, parseSimpleInterest, type SimpleInterestData } from "../problem-solver/simpleInterest";
import type { ProblemIntentKind, ProblemSolverResult } from "../problem-solver/problemTypes";
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
  const [showDetails, setShowDetails] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => { try { return JSON.parse(sessionStorage.getItem("problem-solver-recent") ?? "[]") as string[]; } catch { return []; } });
  const [shareMessage, setShareMessage] = useState("");
  const output = useMemo(() => solveProblem(submitted), [submitted]);
  const { classification, result, trust } = output;
  const visual = useMemo(() => buildVisualVerification(classification, result), [classification, result]);
  const finance = useMemo(() => result.kind === "word-problem" && result.canCopy ? parseSimpleInterest(submitted) : null, [submitted, result.kind, result.canCopy]);
  const hasChanges = draft.trim() !== submitted;
  const verified = Boolean(!hasChanges && trust.verification?.passed && result.canCopy && trust.confidence === "verified");
  const status = !draft.trim() ? "Ready" : hasChanges ? "Changes not solved" : verified ? "Verified" : trust.confidence === "ambiguous" ? "Needs clarification" : trust.confidence === "unsupported" || trust.confidence === "error" ? "Unable to solve" : "Calculated";

  useEffect(() => { setDraft(routedQuery); setSubmitted(routedQuery); }, [routedQuery]);

  const solve = () => {
    const next = draft.trim();
    if (!next) return;
    setDraft(next);
    setSubmitted(next);
    setActiveTab("Solution");
    const updated = [next, ...recent.filter(item => item !== next)].slice(0, 6);
    setRecent(updated);
    sessionStorage.setItem("problem-solver-recent", JSON.stringify(updated));
  };
  const chooseExample = () => {
    const index = Math.max(0, EXAMPLES.indexOf(draft));
    const next = EXAMPLES[(index + 1) % EXAMPLES.length];
    setDraft(next); setSubmitted(next); setActiveTab("Solution");
  };
  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("query", submitted);
    url.searchParams.delete("q");
    try { await navigator.clipboard.writeText(url.href); setShareMessage("Problem link copied"); }
    catch { setShareMessage("Could not copy link"); }
    window.setTimeout(() => setShareMessage(""), 2500);
  };

  return (
    <div className="problem-solver-page">
      <StudioBreadcrumb className="ps-breadcrumb" crumbs={[
        { label: "Home", to: "/" },
        { label: "Mathematics", to: "/learn" },
        { label: "CAS", to: "/workspace/data/cas" },
        { label: "Algebra Solver", to: "/problem-solver" },
      ]} />
      <header className="ps-header">
        <div className="ps-title-icon"><Calculator /></div>
        <div><h1>Step-by-Step Problem Solver</h1><p>Type a problem. See the reasoning. Check the answer.</p></div>
        <span className={`ps-status ${verified ? "verified" : ""}`}>{verified ? <CheckCircle2 /> : <Sparkles />}{status}</span>
        <button className="ps-new" onClick={() => { setDraft(""); setSubmitted(""); }}><span>+</span>New problem</button>
        <button className="ps-share" onClick={() => void share()} disabled={!submitted || hasChanges} title={hasChanges ? "Solve the edited input before sharing" : undefined}><Share2 />{shareMessage || "Share"}</button>
      </header>

      <main className="ps-layout">
        <div className="ps-main-column">
          <section className="ps-card ps-input-card">
            <div className="ps-card-title"><h2>What do you want to solve?</h2><div className="ps-modes" role="group" aria-label="Input format">
              {(["Natural language", "Equation", "Photo"] as InputMode[]).map(item => <button key={item} disabled={item === "Photo"} title={item === "Photo" ? "Photo input is coming soon" : undefined} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item === "Photo" && <Camera />}{item}</button>)}
            </div></div>
            <textarea aria-label="Problem input" rows={2} maxLength={500} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") solve(); }} placeholder={mode === "Equation" ? "Try: 2x + 5 = 15" : "Describe the problem in your own words…"} />
            <div className="ps-token-preview" aria-label="Detected input tokens">{highlightInput(draft)}</div>
            <div className="ps-actions"><button className="primary" disabled={!draft.trim()} onClick={solve}><Play />Solve problem</button><button onClick={() => setDraft("")}><Eraser />Clear</button><button onClick={chooseExample}><Lightbulb />Try an example</button><span>{draft.length}/500 · Ctrl + Enter to solve</span></div>
            <div className="ps-samples" aria-label="Sample problems"><b>Samples</b>{QUICK_EXAMPLES.map(example => <button key={example.label} title={example.value} onClick={() => { setDraft(example.value); setSubmitted(example.value); setActiveTab("Solution"); }}>{example.label}<span>{example.value}</span></button>)}</div>
            {recent.length > 0 && <div className="ps-recent"><History/><b>Recent</b>{recent.map(item => <button key={item} title={item} onClick={() => { setDraft(item); setSubmitted(item); setActiveTab("Solution"); }}>{item}</button>)}<button className="ps-recent-clear" onClick={() => { setRecent([]); sessionStorage.removeItem("problem-solver-recent"); }}>Clear history</button></div>}
            {hasChanges && <p className="ps-message"><CircleHelp />Input changed. Solve to update the answer and checks below.</p>}
            {trust.unsupportedReason && !hasChanges && <p className="ps-message"><CircleHelp />{trust.unsupportedReason}</p>}
            {!hasChanges && <Interpretation classification={classification} finance={finance} />}
          </section>

          <section className="ps-card ps-solution-card">
            <h2>Step-by-step solution</h2>
            <ProgressRail solving={false} hasAnswer={!hasChanges && Boolean(result.result)} verified={verified} />
            {hasChanges ? <div className="ps-empty"><CircleHelp/><p>Solve the edited input to see its steps.</p></div> : <SolutionSteps result={result} finance={finance} showDetails={showDetails} />}
            <div className="ps-detail-actions"><button onClick={() => setShowDetails(value => !value)}>Show {showDetails ? "less" : "more"} detail<ChevronDown className={showDetails ? "rotated" : ""} /></button><button onClick={() => setActiveTab("Assumptions")}><CircleHelp />Why this formula?</button></div>
          </section>
        </div>

        <aside className="ps-side-column">
          {hasChanges ? <section className="ps-answer ps-answer-pending"><span>FINAL ANSWER</span><div><strong>Ready to solve</strong></div><p>Run the edited problem to update this answer.</p></section> : <AnswerCard result={result} finance={finance} verified={verified} confidence={classification.confidence} onExplain={() => setActiveTab("Solution")} />}
          {!hasChanges && (finance ? <MoneyGrowth finance={finance} /> : <VisualSummary result={result} visual={visual} />)}
          {!hasChanges && <QuickCheck result={result} finance={finance} verified={verified} />}
        </aside>
      </main>

      <section className="ps-bottom-card">
        <div className="ps-bottom-tabs" role="tablist" aria-label="Solver workspace">{(["Solution", "Visual", "Assumptions", "Input details", "Practice"] as WorkspaceTab[]).map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} aria-controls="ps-workspace-panel" id={`ps-tab-${tab.replaceAll(" ", "-")}`} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tabIcon(tab)}{tab}</button>)}</div>
        <div role="tabpanel" id="ps-workspace-panel" aria-labelledby={`ps-tab-${activeTab.replaceAll(" ", "-")}`}>{hasChanges ? <p className="ps-tab-panel">Solve the edited input to update the workspace.</p> : <TabPanel tab={activeTab} input={submitted} classification={classification} result={result} visual={visual} finance={finance} onExample={value => { setDraft(value); setSubmitted(value); setActiveTab("Solution"); }} />}</div>
      </section>
    </div>
  );
}

function Interpretation({ classification, finance }: { classification: ReturnType<typeof solveProblem>["classification"]; finance: SimpleInterestData | null }) {
  const items = finance ? [
    [BadgeIndianRupee, "Principal", "P", money(finance.principal, finance.currency)],
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

function SolutionSteps({ result, finance, showDetails }: { result: ProblemSolverResult; finance: SimpleInterestData | null; showDetails: boolean }) {
  const steps = finance ? [
    { title: "Choose the formula", value: "I=\\frac{P\\times R\\times T}{100}", isLatex: true, why: "Simple interest equals principal multiplied by annual rate and time." },
    { title: "Substitute the values", value: `I=\\frac{${finance.principal}\\times ${finance.rate}\\times ${finance.time}}{100}`, isLatex: true, why: "The rate is interpreted as a yearly percentage." },
    { title: "Calculate interest", value: `I=${moneyLatex(finance.interest, finance.currency)}`, isLatex: true, why: "Multiplication and division give the interest earned." },
    { title: "Find total amount", value: `A=P+I=${finance.principal}+${finance.interest}=${moneyLatex(finance.amount, finance.currency)}`, isLatex: true, why: "The amount combines the original principal and interest." },
  ] : result.steps.map((step,index) => ({ title: stepTitle(step,index), value: step, isLatex: false, why: genericWhy(result.kind,index) }));
  if (!result.result) return <div className="ps-empty"><CircleHelp /><p>Enter a supported problem, then solve it to see structured reasoning.</p></div>;
  return <div className="ps-step-list">{steps.map((step,index) => <details open key={`${step.title}-${index}`}><summary><i>{index+1}</i><b>{step.title}</b>{step.isLatex ? <RenderedMath value={step.value}/> : <span className="ps-step-text">{step.value}</span>}<CheckCircle2/><CopyButton value={step.value}/></summary>{showDetails && <p>{step.why}</p>}</details>)}</div>;
}

function AnswerCard({ result, finance, verified, confidence, onExplain }: { result: ProblemSolverResult; finance: SimpleInterestData | null; verified: boolean; confidence: string; onExplain: () => void }) {
  const answer = finance ? <><strong>Interest = {money(finance.interest, finance.currency)}</strong><strong>Total amount = {money(finance.amount, finance.currency)}</strong></> : <strong>{result.result ?? "Solve a problem to see the answer."}</strong>;
  const copy = finance ? `Interest = ${money(finance.interest, finance.currency)}\nTotal amount = ${money(finance.amount, finance.currency)}` : result.result ?? "";
  return <section className={`ps-answer ${verified ? "checked" : ""}`}><span>FINAL ANSWER</span><div>{answer}</div><hr/><p><CheckCircle2 />{verified ? "Checked" : result.result ? "Calculated" : "Ready"}</p><small>{confidence[0]?.toUpperCase()+confidence.slice(1)} confidence · {labelKind(result.kind)}</small><footer><CopyButton value={copy} label="Copy answer"/><button onClick={onExplain}><ListChecks />Explain steps</button></footer></section>;
}

function MoneyGrowth({ finance }: { finance: SimpleInterestData }) { const percent = finance.amount ? finance.interest/finance.amount*100 : 0; return <section className="ps-card ps-money"><h2>Money growth</h2><div className="ps-money-bar"><i style={{width:`${100-percent}%`}}/><b style={{width:`${percent}%`}}/></div><div><span><small>Principal</small><strong>{money(finance.principal, finance.currency)}</strong></span><em>+</em><span><small>Interest</small><strong>{money(finance.interest, finance.currency)}</strong></span><em>=</em><span><small>Amount</small><strong>{money(finance.amount, finance.currency)}</strong></span></div></section>; }

function VisualSummary({ result, visual }: { result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification> }) { return <section className="ps-card ps-generic-visual"><h2>{visual?.title ?? "Visual model"}</h2>{visual ? <ProblemGraph visual={visual} showTable={false}/> : <div className="ps-empty"><BarChart3/><p>A relevant visual will appear when this problem type supports one.</p></div>}<small>{result.method}</small></section>; }

function QuickCheck({ result, finance, verified }: { result: ProblemSolverResult; finance: SimpleInterestData | null; verified: boolean }) { const text = finance ? `${finance.rate}% of ${money(finance.principal, finance.currency)} for ${finance.time} years = ${money(finance.interest, finance.currency)}` : result.verification?.[0] ?? "Verification becomes available after calculation."; return <section className={`ps-card ps-quick ${verified ? "checked" : ""}`}><h2>Quick check</h2><CheckCircle2/><p>{text}</p><small>{finance ? "Amount and interest checked" : verified ? "Consistency check passed" : "Review recommended"}</small></section>; }

function TabPanel({ tab, input, classification, result, visual, finance, onExample }: { tab: WorkspaceTab; input: string; classification: ReturnType<typeof solveProblem>["classification"]; result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification>; finance: SimpleInterestData | null; onExample: (value:string)=>void }) {
  if (tab === "Solution") return <div className="ps-tab-panel ps-solution-summary"><h3>Solution summary</h3><p>{result.result ?? "Enter and solve a problem to see the answer."}</p><h3>Checks and notes</h3>{[...(result.verification ?? []), ...(result.restrictions ?? []), ...result.warnings].length ? <ul>{[...(result.verification ?? []), ...(result.restrictions ?? []), ...result.warnings].map((note,index) => <li key={`${note}-${index}`}>{note}</li>)}</ul> : <p>No additional checks or restrictions were supplied for this result.</p>}</div>;
  if (tab === "Visual") return <div className="ps-tab-panel">{finance ? <MoneyGrowth finance={finance}/> : visual ? <><ProblemGraph visual={visual} showTable={false}/><ValueTablePanel visual={visual}/></> : <p>No visual is available for this result.</p>}</div>;
  if (tab === "Assumptions") return <div className="ps-tab-panel ps-assumptions">{(finance ? ["Rate interpreted as percent per year", `Time interpreted as ${finance.time} years`, "Simple interest, without compounding", "No fees or taxes", finance.currency ? `Currency: ${finance.currency}` : "No currency specified"] : [...classification.assumptions,...result.assumptions]).map(item => <label key={item}><Check/><span>{item}</span></label>)}</div>;
  if (tab === "Input details") return <div className="ps-tab-panel ps-details"><Info label="Original input" value={input}/><Info label="Normalized input" value={classification.normalizedInput}/><Info label="Problem type" value={labelKind(classification.kind)}/><Info label="Method selected" value={result.method ?? "Not selected"}/><Info label="Confidence" value={classification.confidence}/><Info label="Why classified" value={classification.reason}/></div>;
  if (tab === "Practice") return <div className="ps-tab-panel ps-practice">{EXAMPLES.filter(item => item !== input).slice(0,4).map((item,index) => <button key={item} onClick={() => onExample(item)}><GraduationCap/><span><b>{index === 0 ? "Similar problem" : index === 1 ? "Easier example" : index === 2 ? "Harder example" : "Change values"}</b><small>{item}</small></span></button>)}</div>;
  return null;
}

function Info({label,value}:{label:string;value:string}){return <article><b>{label}</b><span>{value || "—"}</span></article>}
function CopyButton({value,label}:{value:string;label?:string}){const [copied,setCopied]=useState(false);return <button onClick={event=>{event.preventDefault();void navigator.clipboard.writeText(value).then(()=>{setCopied(true);window.setTimeout(()=>setCopied(false),1200)}).catch(()=>setCopied(false))}} aria-label={label??"Copy step"}>{copied?<Check/>:<Copy/>}{label}</button>}
function RenderedMath({value}:{value:string}){const html=useMemo(()=>katex.renderToString(value,{displayMode:true,throwOnError:false}),[value]);return <div className="ps-math" dangerouslySetInnerHTML={{__html:html}}/>}
function tabIcon(tab:WorkspaceTab){if(tab==="Solution")return <Clipboard/>;if(tab==="Visual")return <BarChart3/>;if(tab==="Assumptions")return <FileText/>;if(tab==="Input details")return <CircleHelp/>;return <GraduationCap/>}
function labelKind(kind:ProblemIntentKind){return kind.split("-").map(word=>word[0].toUpperCase()+word.slice(1)).join(" ")}
function stepTitle(step:string,index:number){const colon=step.indexOf(":");return colon>0&&colon<42?step.slice(0,colon):index===0?"Understand the problem":index===1?"Choose a method":index===2?"Calculate":"Conclude"}
function genericWhy(kind:ProblemIntentKind,index:number){return index===0?`The input was identified as ${labelKind(kind).toLowerCase()}.`:index===1?"This method matches the mathematical structure of the input.":"Each transformation preserves the meaning of the original problem."}
function highlightInput(value:string){const chunks=value.split(/(\d+(?:\.\d+)?)/g);return chunks.map((chunk,index)=>/^\d/.test(chunk)?<mark key={`${chunk}-${index}`}>{chunk}</mark>:<span key={`${chunk}-${index}`}>{chunk}</span>)}
function money(value:number,currency:string|null){return formatInterestValue(value,currency)}
function moneyLatex(value:number,currency:string|null){return `\\text{${money(value,currency)}}`}
