import katex from "katex";
import { useMemo, useState } from "react";
import { CheckCircle2, Eye, FileText, Lightbulb, ListChecks, Search } from "lucide-react";
import SmartMathInput from "../components/math-input/SmartMathInput";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, PrintWorksheetButton, RelatedToolLinks, ResetExampleButton } from "../components/ui/UiFeedback";
import { ProblemGraph, ValueTablePanel } from "../problem-solver/ProblemGraph";
import { buildVisualVerification } from "../problem-solver/graphingUtils";
import { solveProblem } from "../problem-solver/problemSolverEngine";
import { buildProblemResultCards, type ProblemResultCard } from "../problem-solver/resultCards";
import type { ProblemIntentKind, ProblemSolverResult } from "../problem-solver/problemTypes";
import type { SolverResult } from "../problem-solver/types/solverResult";
import { symbolicLatex } from "../utils/symbolic";
import { buildProblemSolverWorkspaceObjects } from "../workspace/universalObjectGraph";
import { useUniversalObjectGraphPublisher } from "../workspace/useUniversalObjectGraphPublisher";

const examples = ["sqrt(34)", "sqrt(34) + tan(45)", "sqrt 34", "sin 30", "Laplace transform of sin(t)", "Fourier series of x", "Newton Raphson method", "A train travels 60 km in 2 hours", "A car travels at 50 km/h for 3 hours", "Percent increase from 50 to 60", "Rectangle length 8 width 5 area", "Circle radius 7 circumference", "Ratio of 12 to 18", "Simple interest principal 5000 rate 8 time 2 years", "120 for 6 notebooks", "apple mango x + 2", "sin(30) + cos(60)", "log(100)", "ln(e)", "sqrt(-1)", "log(0)", "sqrt(x-2)", "derivative of sin(x)", "integrate x^2", "limit x->0 sin(x)/x", "mean of 4, 6, 8, 10", "determinant [[1,2],[3,4]]", "2x + 5 = 15", "0x + 5 = 5", "0x + 5 = 8", "x + 1 = x + 2", "x^2 - 5x + 6 = 0", "x^2 - 2x + 1 = 0", "2*x+5=11", "x^2-5*x+6=0", "(x^2 - 1)/(x - 1) = 0", "simplify (x^2 - 1)/(x - 1)", "factor x^2 - 5x + 6", "expand (x+1)^2", "2 + 3 * 4", "sum 2, 3, 4", "add 12 18 30", "multiply 7 and 8", "mul 6 9", "subtract 3 from 10", "divide 100 by 4", "mod 17 5", "power 2 to 3", "square 12", "cube 5", "reciprocal 8", "15% of 200", "percent 12.5 of 640", "gcd 48 180", "lcm 12 18", "minimum 9, 4, 12", "maximum 9, 4, 12", "factorial 6", "sin(30)", "derivative of x^2", "derivative of x^3 + 2x", "differentiate x^2 + 5x + 6", "integrate x from 0 to 2", "integrate 2x", "integral of x^2 + 3x", "limit x->2 x^2 + 1", "lim x->0 sin(x)/x", "solve 2x + y = 7 and x - y = 2", "2x + 3y = 12; x - y = 1", "x + y + z = 6; 2x - y + z = 3; x + 2y - z = 2", "x + y = 2; x + y = 3", "x + y = 2; 2x + 2y = 4", "x^2 + y = 5; x + y = 3", "median of 4, 6, 8, 10", "mode of 2, 3, 3, 5", "variance of 4, 6, 8, 10", "sample variance of 4", "standard deviation of 4, 6, 8, 10", "quartiles of 2, 4, 6, 8, 10", "frequency table of 1, 2, 2, 3, 3, 3", "weighted mean values 80, 90, 100 weights 2, 3, 5", "[[1,2],[3,4]]", "inverse [[1,2],[3,4]]", "inverse [[1,2],[2,4]]", "transpose [[1,2],[3,4]]", "[[1,2],[3,4]] + [[5,6],[7,8]]", "[[1,2],[3,4]] * [[5,6],[7,8]]", "solve matrix [[2,1,7],[1,-1,2]]"];
const equationKinds: ProblemIntentKind[] = ["linear-equation", "quadratic-equation", "polynomial-equation"];
const resultTabs = ["Answer", "Steps", "Visual", "Insights"] as const;
type ResultTab = (typeof resultTabs)[number];

export default function StepByStepProblemSolver() {
  const [equation, setEquation] = useState("2*x+5=17");
  const [activeTab, setActiveTab] = useState<ResultTab>("Answer");
  const [exampleQuery, setExampleQuery] = useState("");
  const trustedOutput = useMemo(() => solveProblem(equation), [equation]);
  const { classification, result: solverResult, trust } = trustedOutput;
  const visual = useMemo(() => buildVisualVerification(classification, solverResult), [classification, solverResult]);
  const cards = useMemo(() => buildProblemResultCards(classification, solverResult, visual), [classification, solverResult, visual]);
  const workspaceObjects = useMemo(() => buildProblemSolverWorkspaceObjects({
    input: equation,
    problemType: classification.kind,
    confidence: classification.confidence,
    method: solverResult.method,
    finalAnswer: solverResult.result,
    assumptions: solverResult.assumptions,
    restrictions: solverResult.restrictions,
    warnings: solverResult.warnings,
    steps: solverResult.steps,
    visual: visual ? {
      title: visual.title,
      description: visual.description,
      curves: visual.curves.map((curve) => ({ expression: curve.expression, label: curve.label, color: curve.color })),
      markers: visual.markers.map((marker) => ({ label: marker.label, x: marker.x, y: marker.y })),
      table: visual.table.map((row) => ({ x: row.x, y: row.y })),
    } : null,
  }), [classification.confidence, classification.kind, equation, solverResult, visual]);
  useUniversalObjectGraphPublisher("problem-solver", workspaceObjects);
  const smartExamples = useMemo(() => examplesForKind(classification.kind), [classification.kind]);
  const filteredExamples = useMemo(() => {
    const normalized = exampleQuery.trim().toLowerCase();
    if (!normalized) return smartExamples;
    return examples.filter((example) => example.toLowerCase().includes(normalized)).slice(0, 18);
  }, [exampleQuery, smartExamples]);

  return (
    <div className="space-y-3">
      <TopicHeader title="Step-by-Step Problem Solver" subtitle="A smarter cockpit for equations, expressions, calculus, matrices, statistics, and word problems." difficulty="Smart Solver" estimatedMinutes={7} />

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionCard title="Solver Input" description="Type naturally or with symbols. Results refresh instantly, with confidence and verification shown beside the input.">
          <div className="mb-3 flex flex-wrap gap-2">
            <CopyResultButton value={solverResult.canCopy ? solverResult.result : undefined} />
            <ResetExampleButton onClick={() => setEquation("2*x+5=11")} />
            <PrintWorksheetButton />
            <RelatedToolLinks links={[{ label: "Calculator", route: "/calculator" }, { label: "Equation Solver", route: "/math-lab/equation-solver" }]} />
          </div>
          <SmartMathInput ariaLabel="Smart math problem editor" mode="math" placeholder="Try: solve 2x + y = 7 and x - y = 2" value={equation} onChange={setEquation} />
          <SmartActionStrip equation={equation} classificationKind={classification.kind} onSelectExample={setEquation} />
        </SectionCard>

        <LearnerAnswerPanel
          classification={classification}
          onOpenSteps={() => setActiveTab("Steps")}
          onTryExample={setEquation}
          result={solverResult}
          trust={trust}
        />
      </section>

      <ResultWorkspace activeTab={activeTab} cards={cards} result={solverResult} setActiveTab={setActiveTab} trust={trust} visual={visual} onSelectExample={setEquation} />

      <section className="grid gap-3">
        <SectionCard title="Practice Launcher" description="Use the detected topic first, or search the full example bank without scrolling through a long list.">
          <div className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950">
            <Search className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            <input
              value={exampleQuery}
              onChange={(event) => setExampleQuery(event.target.value)}
              placeholder="Search examples..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {filteredExamples.map((example) => (
              <button key={example} type="button" onClick={() => setEquation(example)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold leading-5 text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/40">
                {example}
              </button>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function LearnerAnswerPanel({ classification, onOpenSteps, onTryExample, result, trust }: { classification: ReturnType<typeof solveProblem>["classification"]; onOpenSteps: () => void; onTryExample: (value: string) => void; result: ProblemSolverResult; trust: SolverResult }) {
  const answer = result.result ?? "Enter a supported problem to get an answer.";
  const check = trust.verification?.passed
    ? `Verified by ${trust.verification.method}.`
    : result.verification?.[0] ?? "Check by substituting the answer back into the original problem.";
  const warnings = [...classification.warnings, ...result.warnings].slice(0, 2);
  return (
    <SectionCard title="Answer" description="Result, check, and the next useful learning move." compact>
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 shadow-sm dark:border-emerald-300/20 dark:from-emerald-400/10 dark:via-white/5 dark:to-cyan-400/10">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">Final answer</p>
        <div className="mt-2 rounded-2xl bg-white p-4 shadow-inner dark:bg-slate-950/50">
          {result.result && equationKinds.includes(result.kind) ? <RenderedMath value={answer} /> : <p className="break-words text-xl font-black text-slate-950 dark:text-white">{answer}</p>}
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{studentStrategyFor(result)}</p>
      </div>

      <div className="mt-3 grid gap-2">
        <MiniLearningTile label="Problem type" value={labelForKind(result.kind)} />
        <MiniLearningTile label="Method" value={result.method ?? trust.metadata?.solverFamily ?? "Step method"} />
        <MiniLearningTile label="Check" value={check} />
        <MiniLearningTile label="Next habit" value={nextHabitFor(result.kind)} />
      </div>

      {warnings.map((warning, index) => (
        <p key={`${warning}-${index}`} className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs font-bold leading-5 text-amber-900 dark:border-amber-300/30 dark:bg-amber-400/10 dark:text-amber-100">{warning}</p>
      ))}

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <button className="action-primary justify-center" type="button" onClick={onOpenSteps}><ListChecks className="h-4 w-4" /> Explain steps</button>
        <button className="action-secondary justify-center" type="button" onClick={() => onTryExample("2x + 5 = 15")}>Try simpler example</button>
      </div>
    </SectionCard>
  );
}

function SmartActionStrip({ equation, classificationKind, onSelectExample }: { equation: string; classificationKind: ProblemIntentKind; onSelectExample: (value: string) => void }) {
  const actions = smartActionsFor(equation, classificationKind);
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => (
        <button key={action.value} type="button" onClick={() => onSelectExample(action.value)} className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
          <Lightbulb className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

function ResultWorkspace({ activeTab, cards, result, setActiveTab, trust, visual, onSelectExample }: { activeTab: ResultTab; cards: ProblemResultCard[]; result: ProblemSolverResult; setActiveTab: (tab: ResultTab) => void; trust: SolverResult; visual: ReturnType<typeof buildVisualVerification>; onSelectExample: (value: string) => void }) {
  const tabCards = cardsForTab(cards, activeTab);
  return (
    <SectionCard title="Work Area" description="Use the tabs only when you want steps, graph/table checks, or extra practice.">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {resultTabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "action-primary px-4 py-2 text-sm" : "action-secondary px-4 py-2 text-sm"}>
              {tabIcon(tab)}
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TrustBadge trust={trust} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{labelForKind(result.kind)}</span>
        </div>
      </div>
      {activeTab === "Answer" ? <StudentAnswerSummary result={result} trust={trust} /> : null}
      {activeTab === "Steps" ? <StudentStepGuide result={result} /> : null}
      <div className="mt-3 grid gap-3">
        {tabCards.length ? tabCards.map((card) => <ResultCard key={card.id} card={card} result={result} visual={visual} onSelectExample={onSelectExample} />) : <EmptyTab tab={activeTab} />}
      </div>
      {trust.confidence === "unsupported" && <UnsupportedSuggestions reason={trust.unsupportedReason} onSelectExample={onSelectExample} />}
    </SectionCard>
  );
}

function tabIcon(tab: ResultTab) {
  if (tab === "Answer") return <CheckCircle2 className="h-4 w-4" />;
  if (tab === "Steps") return <ListChecks className="h-4 w-4" />;
  if (tab === "Visual") return <Eye className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

function TrustBadge({ trust }: { trust: SolverResult }) {
  const styles: Record<SolverResult["confidence"], string> = {
    ambiguous: "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100",
    error: "bg-rose-50 text-rose-800 dark:bg-rose-400/10 dark:text-rose-100",
    "partially-supported": "bg-violet-50 text-violet-800 dark:bg-violet-400/10 dark:text-violet-100",
    unsupported: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
    verified: "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${styles[trust.confidence]}`}>{trust.confidence.replace(/-/g, " ")}</span>;
}

function StudentAnswerSummary({ result, trust }: { result: ProblemSolverResult; trust: SolverResult }) {
  const strategy = studentStrategyFor(result);
  const check = trust.verification?.passed
    ? `Checked using ${trust.verification.method}.`
    : result.verification?.[0] ?? "After solving, substitute the answer back into the original problem.";
  return (
    <div className="mt-3 grid gap-3 lg:grid-cols-2">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">How to read this</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{strategy}</p>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-300/20 dark:bg-emerald-400/10">
        <p className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
          <Lightbulb className="h-4 w-4 text-emerald-600" />
          Quick check
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{check}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <MiniLearningTile label="Method" value={result.method ?? "Step method"} />
          <MiniLearningTile label="Next habit" value={nextHabitFor(result.kind)} />
        </div>
      </div>
    </div>
  );
}

function StudentStepGuide({ result }: { result: ProblemSolverResult }) {
  return (
    <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">Guided solution</p>
          <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Read each step as goal + action + reason</h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-800 dark:bg-white/10 dark:text-cyan-100">{result.steps.length} steps</span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <MiniLearningTile label="1. Notice" value={studentNoticeFor(result.kind)} />
        <MiniLearningTile label="2. Do" value={studentDoFor(result.kind)} />
        <MiniLearningTile label="3. Check" value="Put the answer back in the original problem." />
      </div>
    </div>
  );
}

function MiniLearningTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/40">
      <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function ResultCard({ card, result, visual, onSelectExample }: { card: ProblemResultCard; result: ProblemSolverResult; visual: ReturnType<typeof buildVisualVerification>; onSelectExample: (value: string) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-950 dark:text-white">{card.title}</h3>
        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-black uppercase text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{card.type.replace(/-/g, " ")}</span>
      </div>
      {card.type === "visual" && visual ? <ProblemGraph visual={visual} showTable={false} /> : null}
      {card.type === "table" && visual ? <ValueTablePanel visual={visual} /> : null}
      {card.type === "steps" && Array.isArray(card.content) ? <StepList items={card.content} result={result} /> : null}
      {card.type === "verification" && Array.isArray(card.content) ? <StepList items={card.content} result={result} startLabel="Check" /> : null}
      {card.type === "final-answer" && typeof card.content === "string" ? (
        <div className="rounded-xl bg-cyan-50 p-4 dark:bg-cyan-400/10">
          {equationKinds.includes(result.kind) ? <RenderedMath value={card.content} /> : <p className="break-words font-mono text-sm font-black text-cyan-950 dark:text-cyan-100">{card.content}</p>}
        </div>
      ) : null}
      {card.type !== "visual" && card.type !== "table" && card.type !== "steps" && card.type !== "verification" && card.type !== "final-answer" ? <CardContent content={card.content} interactive={card.type === "practice"} onSelectExample={onSelectExample} /> : null}
    </section>
  );
}

function StepList({ items, result, startLabel = "Step" }: { items: string[]; result: ProblemSolverResult; startLabel?: string }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const guidance = studentGuidanceForStep(item, index, result, startLabel);
        return (
        <div key={`${item}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-sm font-black text-white shadow-sm shadow-cyan-300/40">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-200">{startLabel} {index + 1}</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">{guidance.goal}</span>
              </div>
              <p className="mt-2 break-words rounded-xl bg-white p-3 text-base font-bold leading-7 text-slate-950 dark:bg-white/10 dark:text-white">{item}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{guidance.why}</p>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

function CardContent({ content, interactive = false, onSelectExample }: { content: ProblemResultCard["content"]; interactive?: boolean; onSelectExample?: (value: string) => void }) {
  if (typeof content === "string") return <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{content}</p>;
  if (Array.isArray(content)) {
    return (
      <div className="flex flex-wrap gap-2">
        {content.map((item) => interactive ? (
          <button key={item} type="button" onClick={() => onSelectExample?.(item)} className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-800 transition hover:bg-cyan-100 dark:bg-cyan-300/10 dark:text-cyan-100">
            {item}
          </button>
        ) : <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-100">{item}</span>)}
      </div>
    );
  }
  const entries = Object.entries(content).filter(([, value]) => value !== undefined && value !== "");
  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p>
          <p className="mt-1 break-words font-mono text-sm font-bold text-slate-900 dark:text-white">{String(value)}</p>
        </div>
      ))}
    </div>
  );
}

function RenderedMath({ value }: { value: string }) {
  const html = useMemo(() => katex.renderToString(symbolicLatex(value), { displayMode: true, throwOnError: false }), [value]);
  return <div className="overflow-x-auto [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />;
}

function UnsupportedSuggestions({ reason, onSelectExample }: { reason?: string; onSelectExample: (value: string) => void }) {
  const suggestions = ["2x + 5 = 15", "simplify (x^2 - 1)/(x - 1)", "derivative of x^3 + 2x", "mean of 4, 6, 8, 10"];
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-300/30 dark:bg-amber-400/10">
      <p className="font-black text-amber-900 dark:text-amber-100">This problem type is not yet supported.</p>
      {reason ? <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-100">{reason}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => onSelectExample(suggestion)} className="mini-chip bg-white/80 text-amber-900 dark:bg-white/10 dark:text-amber-100">
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function studentStrategyFor(result: ProblemSolverResult) {
  const strategies: Record<ProblemIntentKind, string> = {
    "linear-equation": "Keep the equation balanced while undoing operations until the variable is alone.",
    "quadratic-equation": "Rewrite the equation in a form where roots can be found, then check each root in the original equation.",
    "polynomial-equation": "Look for factors or roots that make the polynomial equal zero.",
    simplify: "Combine like parts and rewrite the expression without changing its value.",
    factor: "Rewrite the expression as multiplication so its structure and roots are easier to see.",
    expand: "Use the distributive property to remove brackets, then combine like terms.",
    evaluate: "Substitute numbers carefully and follow order of operations.",
    derivative: "Find the rule for how fast the expression changes at each point.",
    integral: "Build an antiderivative or accumulated-area expression, then apply any bounds if given.",
    limit: "Study what the expression approaches, especially near the target value.",
    system: "Use equations together until each unknown has one value that satisfies all equations.",
    statistics: "Organize the data first, then compute the requested center or spread measure.",
    matrix: "Follow row, column, determinant, inverse, or multiplication rules exactly.",
    fractal: "Identify the iteration, then choose the Sierpinski count, scale, or area formula before substituting.",
    "proportional-reasoning": "Decide whether the situation uses equal ratios, same-unit map scale, ratio shares, constant ratio, or constant product.",
    "word-problem": "Translate the sentence into math, solve the math, then attach the correct units.",
    unsupported: "This input needs a supported format or a clearer problem statement before solving.",
  };
  return strategies[result.kind] ?? "Read the problem, choose a method, perform each step, and verify the result.";
}

function nextHabitFor(kind: ProblemIntentKind) {
  if (kind === "linear-equation" || kind === "quadratic-equation" || kind === "system") return "Substitute the answer back.";
  if (kind === "derivative") return "Compare with a graph slope.";
  if (kind === "integral") return "Differentiate the result.";
  if (kind === "statistics") return "Check data count and units.";
  if (kind === "matrix") return "Check dimensions first.";
  if (kind === "proportional-reasoning") return "Check the constant.";
  if (kind === "word-problem") return "Write the units.";
  return "Check each simplification.";
}

function studentNoticeFor(kind: ProblemIntentKind) {
  if (kind === "linear-equation") return "There is one main variable to isolate.";
  if (kind === "quadratic-equation" || kind === "polynomial-equation") return "Zeroes happen when a factor becomes zero.";
  if (kind === "derivative") return "The answer is a rate of change.";
  if (kind === "integral") return "The answer is accumulated area or an antiderivative.";
  if (kind === "limit") return "The question asks about approaching, not always equal.";
  if (kind === "system") return "All equations must be true at the same time.";
  if (kind === "statistics") return "The data order and count matter.";
  if (kind === "matrix") return "Rows and columns decide what operation is legal.";
  if (kind === "proportional-reasoning") return "The key is deciding whether a ratio, product, scale, or whole-share stays constant.";
  return "Identify what the question is asking for.";
}

function studentDoFor(kind: ProblemIntentKind) {
  if (kind === "linear-equation") return "Undo addition/subtraction, then multiplication/division.";
  if (kind === "quadratic-equation" || kind === "polynomial-equation") return "Factor, use roots, or use a formula.";
  if (kind === "simplify") return "Combine like terms and cancel common factors.";
  if (kind === "factor") return "Find pieces that multiply back to the original.";
  if (kind === "expand") return "Multiply each part of the brackets.";
  if (kind === "derivative") return "Apply the matching derivative rule.";
  if (kind === "integral") return "Reverse the derivative rule.";
  if (kind === "system") return "Eliminate or substitute one variable at a time.";
  if (kind === "statistics") return "Use the formula on the organized data.";
  if (kind === "proportional-reasoning") return "Set up equal ratios, convert units, or check constant ratio/product before calculating.";
  return "Use one legal move at a time.";
}

function studentGuidanceForStep(step: string, index: number, result: ProblemSolverResult, startLabel: string) {
  if (startLabel === "Check") {
    return {
      goal: "verify",
      why: "This confirms the answer agrees with the original problem instead of only looking right.",
    };
  }
  const lower = step.toLowerCase();
  if (index === 0) {
    return {
      goal: "understand",
      why: "Start by rewriting what the solver recognized, so the next moves are based on the same problem you typed.",
    };
  }
  if (/subtract|minus|remove/.test(lower)) {
    return { goal: "undo addition", why: "Subtracting the same value from matching parts keeps the equation balanced while moving toward the unknown." };
  }
  if (/\badd\b|adding|\+/.test(lower)) {
    return { goal: "undo subtraction", why: "Adding the same value to matching parts keeps equality true and helps isolate the useful term." };
  }
  if (/divide|\/|÷/.test(lower)) {
    return { goal: "scale down", why: "Division removes a multiplier, leaving the variable or expression closer to being alone." };
  }
  if (/multiply|\*/.test(lower)) {
    return { goal: "clear a divisor", why: "Multiplying can remove fractions or apply a scale factor while preserving the relationship." };
  }
  if (/factor/.test(lower)) {
    return { goal: "split into factors", why: "Factors are useful because a product is zero when at least one factor is zero." };
  }
  if (/expand|distribut/.test(lower)) {
    return { goal: "open brackets", why: "Expanding shows every term clearly so like terms can be combined." };
  }
  if (/simpl/.test(lower)) {
    return { goal: "clean up", why: "Simplifying removes clutter without changing the mathematical meaning." };
  }
  if (/differentiat|derivative|power rule|slope/.test(lower)) {
    return { goal: "find rate", why: "A derivative describes how quickly the expression changes." };
  }
  if (/integrat|antiderivative|area/.test(lower)) {
    return { goal: "accumulate", why: "An integral reverses differentiation or measures accumulated area." };
  }
  if (/substitut|replace|plug/.test(lower)) {
    return { goal: "substitute", why: "Putting a known value into the expression turns the problem into simpler arithmetic." };
  }
  if (/answer|solution|therefore|final/.test(lower)) {
    return { goal: "conclude", why: `This is the result of the ${result.method ?? "chosen"} method; now verify it with the original input.` };
  }
  return {
    goal: index === result.steps.length - 1 ? "conclude" : "transform",
    why: "This step uses an allowed math move to create an equivalent, easier version of the problem.",
  };
}

function EmptyTab({ tab }: { tab: ResultTab }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
      No {tab.toLowerCase()} card is available for this input yet. Try a supported equation, expression, matrix, statistics, or calculus example.
    </div>
  );
}

function cardsForTab(cards: ProblemResultCard[], tab: ResultTab) {
  const groups: Record<ResultTab, ProblemResultCard["type"][]> = {
    Answer: ["final-answer", "input-interpretation", "classification", "domain", "warnings", "assumptions"],
    Steps: ["steps", "verification"],
    Visual: ["visual", "table"],
    Insights: ["alternative-method", "related-concepts", "practice"],
  };
  return cards.filter((card) => groups[tab].includes(card.type));
}

function examplesForKind(kind: ProblemIntentKind) {
  const relevant = examples.filter((example) => {
    const lower = example.toLowerCase();
    if (kind === "linear-equation") return /x|y|=/.test(lower) && !lower.includes("^2") && !lower.includes("[[");
    if (kind === "quadratic-equation" || kind === "polynomial-equation") return lower.includes("x^2") || lower.includes("factor") || lower.includes("expand");
    if (kind === "derivative") return lower.includes("derivative") || lower.includes("differentiate");
    if (kind === "integral") return lower.includes("integrate") || lower.includes("integral");
    if (kind === "limit") return lower.includes("limit") || lower.includes("lim ");
    if (kind === "statistics") return /mean|median|mode|variance|quartiles|frequency/.test(lower);
    if (kind === "matrix") return lower.includes("[[") || lower.includes("matrix");
    if (kind === "proportional-reasoning") return /ratio|proportion|map scale|pie|workers|direct|inverse/.test(lower);
    if (kind === "system") return lower.includes(";") || lower.includes(" and ");
    if (kind === "word-problem") return /train|car|rectangle|circle|interest|notebooks/.test(lower);
    return true;
  });
  return relevant.slice(0, 12);
}

function smartActionsFor(equation: string, kind: ProblemIntentKind) {
  const cleaned = equation.trim();
  const expression = cleaned.replace(/^solve\s+/i, "").replace(/=.*$/g, "").trim();
  const actions = [
    { label: "Solve sample equation", value: "2x + 5 = 15" },
    { label: "Graph-friendly quadratic", value: "x^2 - 5x + 6 = 0" },
    { label: "Statistics sample", value: "mean of 4, 6, 8, 10" },
  ];
  if (kind === "derivative" || /^[a-z0-9+\-*/^() ]+$/i.test(expression)) actions.unshift({ label: "Differentiate this", value: `derivative of ${expression || "x^2"}` });
  if (kind === "integral" || /^[a-z0-9+\-*/^() ]+$/i.test(expression)) actions.unshift({ label: "Integrate this", value: `integrate ${expression || "2x"}` });
  if (kind === "linear-equation" || kind === "quadratic-equation") actions.unshift({ label: "Check by graph", value: cleaned });
  if (kind === "proportional-reasoning") actions.unshift({ label: "Map-scale example", value: "3.2 cm on map with scale 1:50000" }, { label: "Ratio split", value: "divide 900 in ratio 2:3:4" });
  return actions.slice(0, 5);
}

function labelForKind(kind: ProblemIntentKind) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
